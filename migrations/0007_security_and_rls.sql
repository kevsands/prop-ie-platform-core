-- Row-Level Security and Enhanced Audit System
-- Phase 3: Security enhancements for multi-tenant data isolation

BEGIN;

-- Enable Row Level Security on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE developments ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_investors ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mortgage_tracking ENABLE ROW LEVEL SECURITY;

-- Create roles for different user types
DO $$
BEGIN
    -- Create roles if they don't exist
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated_user') THEN
        CREATE ROLE authenticated_user;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'developer_role') THEN
        CREATE ROLE developer_role;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'buyer_role') THEN
        CREATE ROLE buyer_role;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'agent_role') THEN
        CREATE ROLE agent_role;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'admin_role') THEN
        CREATE ROLE admin_role;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'investor_role') THEN
        CREATE ROLE investor_role;
    END IF;
END$$;

-- Grant basic permissions to roles
GRANT authenticated_user TO developer_role, buyer_role, agent_role, admin_role, investor_role;

-- Create security context functions
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS text AS $$
BEGIN
    RETURN current_setting('app.current_user_id', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION current_user_roles()
RETURNS text[] AS $$
BEGIN
    RETURN string_to_array(current_setting('app.current_user_roles', true), ',');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
    RETURN 'ADMIN' = ANY(current_user_roles()) OR 'SUPER_ADMIN' = ANY(current_user_roles());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_developer()
RETURNS boolean AS $$
BEGIN
    RETURN 'DEVELOPER' = ANY(current_user_roles());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_buyer()
RETURNS boolean AS $$
BEGIN
    RETURN 'BUYER' = ANY(current_user_roles());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_agent()
RETURNS boolean AS $$
BEGIN
    RETURN 'AGENT' = ANY(current_user_roles());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_investor()
RETURNS boolean AS $$
BEGIN
    RETURN 'INVESTOR' = ANY(current_user_roles());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- User table RLS policies
-- Users can see their own data, admins can see all
CREATE POLICY user_own_data ON users
    FOR ALL TO authenticated_user
    USING (id = current_user_id() OR is_admin());

-- Developers can see other developers in their organization
CREATE POLICY developer_visibility ON users
    FOR SELECT TO developer_role
    USING (
        organization = (
            SELECT organization FROM users WHERE id = current_user_id()
        ) AND 'DEVELOPER' = ANY(roles)
    );

-- Agents can see buyers and other agents
CREATE POLICY agent_visibility ON users
    FOR SELECT TO agent_role
    USING (
        'BUYER' = ANY(roles) OR 'AGENT' = ANY(roles) OR
        organization = (
            SELECT organization FROM users WHERE id = current_user_id()
        )
    );

-- Development table RLS policies
-- Developers can manage their own developments
CREATE POLICY developer_own_developments ON developments
    FOR ALL TO developer_role
    USING (developer_id = current_user_id());

-- Public read access for active developments (for buyers and agents)
CREATE POLICY public_development_read ON developments
    FOR SELECT TO authenticated_user
    USING (status IN ('MARKETING', 'SALES'));

-- Admins can see all developments
CREATE POLICY admin_all_developments ON developments
    FOR ALL TO admin_role
    USING (is_admin());

-- Unit table RLS policies
-- Access based on development ownership and visibility
CREATE POLICY unit_development_access ON units
    FOR ALL TO authenticated_user
    USING (
        development_id IN (
            SELECT id FROM developments WHERE 
            developer_id = current_user_id() OR 
            status IN ('MARKETING', 'SALES') OR
            is_admin()
        )
    );

-- Financial transactions RLS policies
-- Users can only see their own transactions
CREATE POLICY transaction_own_data ON financial_transactions
    FOR ALL TO authenticated_user
    USING (
        user_id = current_user_id() OR
        is_admin() OR
        (is_developer() AND development_id IN (
            SELECT id FROM developments WHERE developer_id = current_user_id()
        ))
    );

-- Document RLS policies
-- Users can see documents they uploaded or that are related to their entities
CREATE POLICY document_access ON documents
    FOR ALL TO authenticated_user
    USING (
        uploader_id = current_user_id() OR
        user_id = current_user_id() OR
        is_admin() OR
        (is_developer() AND development_id IN (
            SELECT id FROM developments WHERE developer_id = current_user_id()
        ))
    );

-- Investment investor RLS policies
-- Investors can only see their own investment records
CREATE POLICY investor_own_data ON investment_investors
    FOR ALL TO authenticated_user
    USING (
        user_id = current_user_id() OR
        is_admin() OR
        (is_developer() AND investment_id IN (
            SELECT i.id FROM investments i
            JOIN developments d ON i.development_id = d.id
            WHERE d.developer_id = current_user_id()
        ))
    );

-- Buyer profile RLS policies
-- Buyers can see their own profiles, agents can see buyer profiles
CREATE POLICY buyer_profile_access ON buyer_profiles
    FOR ALL TO authenticated_user
    USING (
        user_id = current_user_id() OR
        is_admin() OR
        is_agent()
    );

-- Mortgage tracking RLS policies
-- Only the buyer and their assigned agents can see mortgage data
CREATE POLICY mortgage_tracking_access ON mortgage_tracking
    FOR ALL TO authenticated_user
    USING (
        user_id = current_user_id() OR
        is_admin() OR
        (is_agent() AND user_id IN (
            SELECT user_id FROM buyer_profiles -- Agents can see buyer mortgage data
        ))
    );

-- Enhanced audit logging with more security context
CREATE OR REPLACE FUNCTION enhanced_audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
    old_data jsonb;
    new_data jsonb;
    excluded_cols text[] := ARRAY['updated_at', 'last_active'];
    sensitive_tables text[] := ARRAY['users', 'financial_transactions', 'mortgage_tracking', 'investment_investors'];
    is_sensitive boolean := TG_TABLE_NAME = ANY(sensitive_tables);
BEGIN
    -- Enhanced security logging for sensitive operations
    IF TG_OP = 'UPDATE' THEN
        old_data := to_jsonb(OLD);
        new_data := to_jsonb(NEW);
        
        -- Check if only excluded columns changed
        IF old_data - excluded_cols = new_data - excluded_cols THEN
            RETURN NEW;
        END IF;
    END IF;

    -- Log sensitive operations with additional context
    INSERT INTO audit_logs (
        table_name, 
        operation, 
        record_id,
        old_values, 
        new_values, 
        user_id,
        ip_address,
        user_agent,
        session_id,
        timestamp
    )
    VALUES (
        TG_TABLE_NAME,
        TG_OP,
        CASE 
            WHEN TG_OP = 'DELETE' THEN OLD.id
            ELSE NEW.id
        END,
        CASE 
            WHEN TG_OP = 'DELETE' THEN 
                CASE WHEN is_sensitive THEN 
                    jsonb_build_object('id', OLD.id, '_redacted', true)
                ELSE to_jsonb(OLD) END
            ELSE NULL 
        END,
        CASE 
            WHEN TG_OP = 'INSERT' THEN 
                CASE WHEN is_sensitive THEN 
                    jsonb_build_object('id', NEW.id, '_redacted', true)
                ELSE to_jsonb(NEW) END
            WHEN TG_OP = 'UPDATE' THEN 
                CASE WHEN is_sensitive THEN 
                    jsonb_build_object('id', NEW.id, '_redacted', true)
                ELSE to_jsonb(NEW) END
            ELSE NULL 
        END,
        current_setting('app.current_user_id', true),
        current_setting('app.current_ip_address', true)::inet,
        current_setting('app.current_user_agent', true),
        current_setting('app.current_session_id', true),
        now()
    );
    
    -- Additional security logging for sensitive operations
    IF is_sensitive AND TG_OP IN ('UPDATE', 'DELETE') THEN
        INSERT INTO security_events (
            event_type,
            table_name,
            record_id,
            user_id,
            ip_address,
            user_agent,
            session_id,
            risk_level,
            details,
            timestamp
        )
        VALUES (
            'SENSITIVE_DATA_ACCESS',
            TG_TABLE_NAME,
            CASE WHEN TG_OP = 'DELETE' THEN OLD.id ELSE NEW.id END,
            current_setting('app.current_user_id', true),
            current_setting('app.current_ip_address', true)::inet,
            current_setting('app.current_user_agent', true),
            current_setting('app.current_session_id', true),
            CASE 
                WHEN TG_OP = 'DELETE' THEN 'HIGH'
                WHEN TG_TABLE_NAME = 'financial_transactions' THEN 'HIGH'
                ELSE 'MEDIUM'
            END,
            jsonb_build_object(
                'operation', TG_OP,
                'table', TG_TABLE_NAME,
                'timestamp', now()
            ),
            now()
        );
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create security events table for monitoring
CREATE TABLE IF NOT EXISTS security_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type text NOT NULL,
    table_name text,
    record_id text,
    user_id text,
    ip_address inet,
    user_agent text,
    session_id text,
    risk_level text CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    details jsonb,
    timestamp timestamptz DEFAULT now(),
    resolved_at timestamptz,
    resolution_notes text
);

-- Index security events for monitoring
CREATE INDEX idx_security_events_timestamp ON security_events (timestamp);
CREATE INDEX idx_security_events_user_id ON security_events (user_id);
CREATE INDEX idx_security_events_risk_level ON security_events (risk_level);
CREATE INDEX idx_security_events_event_type ON security_events (event_type);
CREATE INDEX idx_security_events_unresolved ON security_events (timestamp) 
    WHERE resolved_at IS NULL AND risk_level IN ('HIGH', 'CRITICAL');

-- Create access logs table for detailed access tracking
CREATE TABLE IF NOT EXISTS access_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id text,
    resource_type text NOT NULL,
    resource_id text,
    action text NOT NULL,
    access_granted boolean NOT NULL,
    denial_reason text,
    ip_address inet,
    user_agent text,
    session_id text,
    request_data jsonb,
    response_size integer,
    response_time_ms integer,
    timestamp timestamptz DEFAULT now()
);

-- Index access logs
CREATE INDEX idx_access_logs_timestamp ON access_logs (timestamp);
CREATE INDEX idx_access_logs_user_id ON access_logs (user_id);
CREATE INDEX idx_access_logs_resource ON access_logs (resource_type, resource_id);
CREATE INDEX idx_access_logs_denied ON access_logs (timestamp) WHERE NOT access_granted;

-- Create function to log access attempts
CREATE OR REPLACE FUNCTION log_access_attempt(
    p_user_id text,
    p_resource_type text,
    p_resource_id text,
    p_action text,
    p_access_granted boolean,
    p_denial_reason text DEFAULT NULL,
    p_request_data jsonb DEFAULT NULL,
    p_response_size integer DEFAULT NULL,
    p_response_time_ms integer DEFAULT NULL
) RETURNS void AS $$
BEGIN
    INSERT INTO access_logs (
        user_id,
        resource_type,
        resource_id,
        action,
        access_granted,
        denial_reason,
        ip_address,
        user_agent,
        session_id,
        request_data,
        response_size,
        response_time_ms
    )
    VALUES (
        p_user_id,
        p_resource_type,
        p_resource_id,
        p_action,
        p_access_granted,
        p_denial_reason,
        current_setting('app.current_ip_address', true)::inet,
        current_setting('app.current_user_agent', true),
        current_setting('app.current_session_id', true),
        p_request_data,
        p_response_size,
        p_response_time_ms
    );
END;
$$ LANGUAGE plpgsql;

-- Data encryption functions for sensitive fields
CREATE OR REPLACE FUNCTION encrypt_sensitive_data(data text)
RETURNS text AS $$
BEGIN
    RETURN encode(
        pgp_sym_encrypt(
            data, 
            current_setting('app.encryption_key', false)
        ), 
        'base64'
    );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrypt_sensitive_data(encrypted_data text)
RETURNS text AS $$
BEGIN
    RETURN pgp_sym_decrypt(
        decode(encrypted_data, 'base64'),
        current_setting('app.encryption_key', false)
    );
END;
$$ LANGUAGE plpgsql;

-- Create anonymization functions for development environments
CREATE OR REPLACE FUNCTION anonymize_user_data()
RETURNS void AS $$
BEGIN
    -- Only run in non-production environments
    IF current_setting('app.environment', true) = 'production' THEN
        RAISE EXCEPTION 'Anonymization not allowed in production environment';
    END IF;
    
    UPDATE users SET
        email = 'user' || substring(id, 1, 8) || '@example.com',
        first_name = 'User',
        last_name = substring(id, 1, 8),
        phone = '+353' || (random() * 1000000000)::bigint::text
    WHERE status != 'ACTIVE' OR created < now() - interval '30 days';
    
    UPDATE locations SET
        address = 'Anonymized Address ' || id,
        eircode = 'A00 B000'
    WHERE id IN (
        SELECT location_id FROM developments 
        WHERE status = 'CANCELLED' OR created < now() - interval '1 year'
    );
END;
$$ LANGUAGE plpgsql;

-- Create data retention policies
CREATE OR REPLACE FUNCTION cleanup_old_audit_data()
RETURNS void AS $$
BEGIN
    -- Delete audit logs older than 7 years
    DELETE FROM audit_logs 
    WHERE timestamp < now() - interval '7 years';
    
    -- Delete access logs older than 2 years
    DELETE FROM access_logs 
    WHERE timestamp < now() - interval '2 years';
    
    -- Archive old security events
    UPDATE security_events 
    SET details = jsonb_build_object('archived', true)
    WHERE timestamp < now() - interval '5 years' 
      AND risk_level IN ('LOW', 'MEDIUM');
END;
$$ LANGUAGE plpgsql;

-- Create monitoring views for security
CREATE VIEW security_dashboard AS
SELECT 
    date_trunc('hour', timestamp) as hour,
    risk_level,
    event_type,
    COUNT(*) as event_count,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT ip_address) as unique_ips
FROM security_events
WHERE timestamp > now() - interval '24 hours'
GROUP BY date_trunc('hour', timestamp), risk_level, event_type
ORDER BY hour DESC, risk_level, event_type;

CREATE VIEW failed_access_summary AS
SELECT 
    date_trunc('hour', timestamp) as hour,
    resource_type,
    action,
    denial_reason,
    COUNT(*) as failure_count,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT ip_address) as unique_ips
FROM access_logs
WHERE NOT access_granted 
  AND timestamp > now() - interval '24 hours'
GROUP BY date_trunc('hour', timestamp), resource_type, action, denial_reason
ORDER BY hour DESC, failure_count DESC;

-- Replace existing audit triggers with enhanced version
DROP TRIGGER IF EXISTS audit_users_trigger ON users;
DROP TRIGGER IF EXISTS audit_developments_trigger ON developments;
DROP TRIGGER IF EXISTS audit_units_trigger ON units;
DROP TRIGGER IF EXISTS audit_financial_transactions_trigger ON financial_transactions;

CREATE TRIGGER enhanced_audit_users_trigger
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION enhanced_audit_trigger_function();

CREATE TRIGGER enhanced_audit_developments_trigger
    AFTER INSERT OR UPDATE OR DELETE ON developments
    FOR EACH ROW EXECUTE FUNCTION enhanced_audit_trigger_function();

CREATE TRIGGER enhanced_audit_units_trigger
    AFTER INSERT OR UPDATE OR DELETE ON units
    FOR EACH ROW EXECUTE FUNCTION enhanced_audit_trigger_function();

CREATE TRIGGER enhanced_audit_financial_transactions_trigger
    AFTER INSERT OR UPDATE OR DELETE ON financial_transactions
    FOR EACH ROW EXECUTE FUNCTION enhanced_audit_trigger_function();

-- Add triggers for other sensitive tables
CREATE TRIGGER enhanced_audit_documents_trigger
    AFTER INSERT OR UPDATE OR DELETE ON documents
    FOR EACH ROW EXECUTE FUNCTION enhanced_audit_trigger_function();

CREATE TRIGGER enhanced_audit_investment_investors_trigger
    AFTER INSERT OR UPDATE OR DELETE ON investment_investors
    FOR EACH ROW EXECUTE FUNCTION enhanced_audit_trigger_function();

-- Create security monitoring alerts
CREATE OR REPLACE FUNCTION check_security_alerts()
RETURNS table(alert_type text, severity text, description text, count bigint) AS $$
BEGIN
    RETURN QUERY
    -- High-risk events in last hour
    SELECT 
        'HIGH_RISK_EVENTS'::text,
        'CRITICAL'::text,
        'High-risk security events detected'::text,
        COUNT(*)
    FROM security_events 
    WHERE risk_level = 'HIGH' 
      AND timestamp > now() - interval '1 hour'
    HAVING COUNT(*) > 0
    
    UNION ALL
    
    -- Multiple failed access attempts
    SELECT 
        'FAILED_ACCESS_ATTEMPTS'::text,
        'HIGH'::text,
        'Multiple failed access attempts from same IP'::text,
        COUNT(DISTINCT ip_address)
    FROM access_logs 
    WHERE NOT access_granted 
      AND timestamp > now() - interval '1 hour'
    GROUP BY ip_address
    HAVING COUNT(*) > 10
    
    UNION ALL
    
    -- Unusual data access patterns
    SELECT 
        'UNUSUAL_ACCESS_PATTERN'::text,
        'MEDIUM'::text,
        'Users accessing unusual amount of data'::text,
        COUNT(DISTINCT user_id)
    FROM access_logs 
    WHERE timestamp > now() - interval '1 hour'
      AND response_size > 10000000 -- > 10MB responses
    GROUP BY user_id
    HAVING COUNT(*) > 50;
END;
$$ LANGUAGE plpgsql;

-- Record this migration
INSERT INTO schema_versions (version, description, migration_sql, applied_by)
VALUES (
    '0007_security_and_rls',
    'Phase 3: Row-level security, enhanced audit logging, data encryption, and security monitoring',
    'Comprehensive security enhancement with RLS policies, audit trails, and monitoring',
    'system'
);

COMMIT;