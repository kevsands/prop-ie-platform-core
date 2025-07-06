-- ================================================================================
-- PROP.ie Data Migration from SQLite to PostgreSQL
-- Migrates existing users with full data integrity
-- ================================================================================

-- Temporary staging table for SQLite data
CREATE TEMP TABLE sqlite_users_staging (
    id TEXT,
    cognitoUserId TEXT,
    email TEXT,
    firstName TEXT,
    lastName TEXT,
    phone TEXT,
    roles TEXT, -- JSON array as text
    status TEXT,
    kycStatus TEXT,
    organization TEXT,
    position TEXT,
    avatar TEXT,
    preferences TEXT, -- JSON as text
    metadata TEXT, -- JSON as text
    created TEXT, -- ISO date string
    lastActive TEXT, -- ISO date string
    lastLogin TEXT, -- ISO date string
    updatedAt TEXT -- ISO date string
);

-- ================================================================================
-- DATA MIGRATION FUNCTION
-- ================================================================================

CREATE OR REPLACE FUNCTION migrate_sqlite_users()
RETURNS TABLE (
    migrated_count INTEGER,
    error_count INTEGER,
    migration_report TEXT
) AS $$
DECLARE
    user_record RECORD;
    migration_errors TEXT[] := '{}';
    success_count INTEGER := 0;
    error_count INTEGER := 0;
    roles_array user_role[];
    parsed_preferences JSONB;
    parsed_metadata JSONB;
BEGIN
    -- Process each user from staging table
    FOR user_record IN SELECT * FROM sqlite_users_staging LOOP
        BEGIN
            -- Parse JSON roles array
            SELECT ARRAY(
                SELECT unnest(
                    ARRAY(
                        SELECT jsonb_array_elements_text(user_record.roles::jsonb)
                    )
                )::user_role
            ) INTO roles_array;
            
            -- Handle empty or invalid roles
            IF roles_array IS NULL OR array_length(roles_array, 1) = 0 THEN
                roles_array := '{buyer}'; -- Default role
            END IF;
            
            -- Parse preferences JSON
            BEGIN
                parsed_preferences := COALESCE(user_record.preferences::jsonb, '{}'::jsonb);
            EXCEPTION WHEN OTHERS THEN
                parsed_preferences := '{}'::jsonb;
            END;
            
            -- Parse metadata JSON  
            BEGIN
                parsed_metadata := COALESCE(user_record.metadata::jsonb, '{}'::jsonb);
            EXCEPTION WHEN OTHERS THEN
                parsed_metadata := '{}'::jsonb;
            END;
            
            -- Insert user with data transformation
            INSERT INTO users (
                legacy_id,
                cognito_user_id,
                email,
                first_name,
                last_name,
                phone,
                roles,
                status,
                kyc_status,
                organization,
                position,
                avatar,
                preferences,
                metadata,
                created_at,
                updated_at,
                last_active_at,
                last_login_at
            ) VALUES (
                user_record.id, -- Store original SQLite ID as legacy_id
                user_record.cognitoUserId,
                LOWER(TRIM(user_record.email)),
                user_record.firstName,
                user_record.lastName,
                NULLIF(user_record.phone, ''),
                roles_array,
                COALESCE(user_record.status::user_status, 'pending'::user_status),
                COALESCE(user_record.kycStatus::kyc_status, 'not_started'::kyc_status),
                NULLIF(user_record.organization, ''),
                NULLIF(user_record.position, ''),
                NULLIF(user_record.avatar, ''),
                parsed_preferences,
                parsed_metadata,
                COALESCE(user_record.created::timestamptz, NOW()),
                COALESCE(user_record.updatedAt::timestamptz, NOW()),
                COALESCE(user_record.lastActive::timestamptz, NOW()),
                CASE 
                    WHEN user_record.lastLogin IS NOT NULL AND user_record.lastLogin != ''
                    THEN user_record.lastLogin::timestamptz
                    ELSE NULL
                END
            );
            
            success_count := success_count + 1;
            
        EXCEPTION WHEN OTHERS THEN
            error_count := error_count + 1;
            migration_errors := migration_errors || (
                'User ID: ' || user_record.id || 
                ', Email: ' || user_record.email || 
                ', Error: ' || SQLERRM
            );
        END;
    END LOOP;
    
    -- Create audit log entry for migration
    INSERT INTO user_audit_log (
        user_id,
        action,
        new_values,
        ip_address,
        performed_at
    ) VALUES (
        NULL, -- System operation
        'INSERT',
        jsonb_build_object(
            'migration_type', 'sqlite_to_postgresql',
            'migrated_users', success_count,
            'error_count', error_count,
            'timestamp', NOW()
        ),
        '127.0.0.1'::inet,
        NOW()
    );
    
    -- Return migration results
    RETURN QUERY SELECT 
        success_count,
        error_count,
        CASE 
            WHEN error_count = 0 THEN 
                'Migration completed successfully. ' || success_count || ' users migrated.'
            ELSE 
                'Migration completed with errors. ' || success_count || ' users migrated, ' || 
                error_count || ' errors: ' || array_to_string(migration_errors, '; ')
        END;
END;
$$ LANGUAGE plpgsql;

-- ================================================================================
-- USER LOOKUP COMPATIBILITY FUNCTION
-- ================================================================================

-- Function to find users by legacy SQLite ID (for backward compatibility)
CREATE OR REPLACE FUNCTION get_user_by_legacy_id(legacy_user_id TEXT)
RETURNS TABLE (
    id UUID,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    roles user_role[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        u.roles
    FROM users u
    WHERE u.legacy_id = legacy_user_id
    AND u.deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- ================================================================================
-- ROLLBACK FUNCTION (Enterprise Safety)
-- ================================================================================

CREATE OR REPLACE FUNCTION rollback_migration()
RETURNS TEXT AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Delete all migrated users (those with legacy_id)
    DELETE FROM users WHERE legacy_id IS NOT NULL;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Log rollback action
    INSERT INTO user_audit_log (
        action,
        new_values,
        performed_at
    ) VALUES (
        'DELETE',
        jsonb_build_object(
            'rollback_action', 'migration_rollback',
            'deleted_users', deleted_count,
            'timestamp', NOW()
        ),
        NOW()
    );
    
    RETURN 'Rollback completed. Deleted ' || deleted_count || ' migrated users.';
END;
$$ LANGUAGE plpgsql;

-- ================================================================================
-- MIGRATION VERIFICATION QUERIES
-- ================================================================================

-- View to compare SQLite vs PostgreSQL data
CREATE VIEW migration_verification AS
SELECT 
    'PostgreSQL' as source,
    COUNT(*) as user_count,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
    COUNT(*) FILTER (WHERE 'admin' = ANY(roles)) as admin_count,
    COUNT(*) FILTER (WHERE 'developer' = ANY(roles)) as developer_count,
    COUNT(*) FILTER (WHERE 'buyer' = ANY(roles)) as buyer_count
FROM users 
WHERE deleted_at IS NULL;

-- ================================================================================
-- POST-MIGRATION OPTIMIZATION
-- ================================================================================

CREATE OR REPLACE FUNCTION post_migration_optimize()
RETURNS TEXT AS $$
BEGIN
    -- Update table statistics
    ANALYZE users;
    ANALYZE user_audit_log;
    
    -- Refresh materialized view
    REFRESH MATERIALIZED VIEW user_statistics;
    
    -- Vacuum to reclaim space
    VACUUM users;
    
    RETURN 'Post-migration optimization completed successfully.';
END;
$$ LANGUAGE plpgsql;

-- ================================================================================
-- MIGRATION INSTRUCTIONS
-- ================================================================================

/*
MIGRATION STEPS:

1. Load SQLite data into staging table:
   COPY sqlite_users_staging FROM '/path/to/sqlite_export.csv' WITH CSV HEADER;

2. Run migration:
   SELECT * FROM migrate_sqlite_users();

3. Verify data:
   SELECT * FROM migration_verification;

4. Optimize database:
   SELECT post_migration_optimize();

5. If needed, rollback:
   SELECT rollback_migration();
*/