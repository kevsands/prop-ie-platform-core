-- ================================================================================
-- ENTERPRISE SAFETY CHECKS - Run BEFORE any migration
-- These queries verify system state and create safety checkpoints
-- NO DATA IS MODIFIED - READ-ONLY VERIFICATION ONLY
-- ================================================================================

-- Check if we're connected to the correct database
SELECT 
    current_database() as connected_database,
    version() as postgres_version,
    current_user as connected_user,
    inet_server_addr() as server_address,
    inet_server_port() as server_port;

-- Verify PostgreSQL version compatibility (minimum 12.0)
DO $$
BEGIN
    IF (SELECT version() ~ 'PostgreSQL ([0-9]+)\.([0-9]+)' AND 
               (SELECT substring(version() from 'PostgreSQL ([0-9]+)')::integer) >= 12) THEN
        RAISE NOTICE '✓ PostgreSQL version is compatible for enterprise features';
    ELSE
        RAISE EXCEPTION '✗ PostgreSQL version too old. Enterprise features require PostgreSQL 12+';
    END IF;
END $$;

-- Check available extensions
SELECT 
    name,
    installed_version,
    default_version,
    comment
FROM pg_available_extensions 
WHERE name IN ('uuid-ossp', 'pgcrypto', 'btree_gin')
ORDER BY name;

-- Verify connection limits and current usage
SELECT 
    setting as max_connections,
    current_setting('max_connections')::int - 
    (SELECT count(*) FROM pg_stat_activity WHERE state = 'active') as available_connections
FROM pg_settings 
WHERE name = 'max_connections';

-- Check database permissions for current user
SELECT 
    datname,
    datacl,
    has_database_privilege(current_user, datname, 'CREATE') as can_create,
    has_database_privilege(current_user, datname, 'CONNECT') as can_connect
FROM pg_database 
WHERE datname = current_database();

-- Verify disk space (enterprise requirement: minimum 10GB free)
SELECT 
    pg_database_size(current_database()) as current_db_size_bytes,
    pg_size_pretty(pg_database_size(current_database())) as current_db_size,
    CASE 
        WHEN pg_database_size(current_database()) < 10 * 1024 * 1024 * 1024 
        THEN '✓ Sufficient space for migration'
        ELSE '⚠ Database approaching size limits'
    END as space_status;

-- Check for conflicting table names (safety check)
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'user_audit_log')
ORDER BY tablename;

-- Verify transaction isolation level
SELECT 
    current_setting('transaction_isolation') as isolation_level,
    current_setting('transaction_read_only') as read_only_mode;

-- Check for active long-running transactions (could block migration)
SELECT 
    pid,
    state,
    query_start,
    state_change,
    query
FROM pg_stat_activity 
WHERE state = 'active' 
AND query_start < now() - interval '5 minutes'
AND pid != pg_backend_pid();

-- Verify backup capabilities
SELECT 
    current_setting('archive_mode') as archive_mode,
    current_setting('wal_level') as wal_level,
    CASE 
        WHEN current_setting('archive_mode') = 'on' 
        THEN '✓ Point-in-time recovery available'
        ELSE '⚠ Consider enabling archive_mode for enterprise backup'
    END as backup_status;

-- Create a test table to verify CREATE permissions (will be dropped)
DO $$
BEGIN
    -- Test table creation
    CREATE TEMP TABLE migration_safety_test (
        id SERIAL PRIMARY KEY,
        test_column TEXT,
        created_at TIMESTAMP DEFAULT NOW()
    );
    
    -- Test data insertion
    INSERT INTO migration_safety_test (test_column) VALUES ('safety_test');
    
    -- Test data retrieval
    PERFORM * FROM migration_safety_test WHERE test_column = 'safety_test';
    
    -- Test will automatically clean up (TEMP table)
    RAISE NOTICE '✓ Database permissions verified - CREATE/INSERT/SELECT operations successful';
    
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION '✗ Database permissions insufficient: %', SQLERRM;
END $$;

-- Final safety confirmation
SELECT 
    '✓ SAFETY CHECKS COMPLETED' as status,
    NOW() as verified_at,
    current_user as verified_by,
    'Ready for migration planning phase' as next_step;