-- ================================================================================
-- PROP.ie Enterprise Database Schema - Initial Migration
-- Version: 1.0.0
-- Target: PostgreSQL 15+
-- ================================================================================

-- Enable required extensions for enterprise features
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Create custom types for better type safety
CREATE TYPE user_status AS ENUM (
    'pending',
    'active', 
    'suspended',
    'deactivated'
);

CREATE TYPE kyc_status AS ENUM (
    'not_started',
    'in_progress', 
    'pending_review',
    'approved',
    'rejected',
    'expired'
);

CREATE TYPE user_role AS ENUM (
    'developer',
    'buyer',
    'investor', 
    'architect',
    'engineer',
    'quantity_surveyor',
    'legal',
    'project_manager',
    'agent',
    'solicitor', 
    'contractor',
    'admin'
);

-- ================================================================================
-- USERS TABLE - Enterprise Grade
-- ================================================================================

CREATE TABLE users (
    -- Primary identification
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    legacy_id TEXT UNIQUE, -- For SQLite migration compatibility
    cognito_user_id TEXT UNIQUE NOT NULL,
    
    -- Core user data
    email TEXT UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    phone_verified BOOLEAN DEFAULT FALSE,
    
    -- Authorization and status
    roles user_role[] NOT NULL DEFAULT '{buyer}',
    status user_status NOT NULL DEFAULT 'pending',
    kyc_status kyc_status NOT NULL DEFAULT 'not_started',
    
    -- Professional information
    organization TEXT,
    position TEXT,
    avatar TEXT,
    
    -- User preferences (JSON for flexibility)
    preferences JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    
    -- Security and compliance
    password_hash TEXT, -- For non-Cognito fallback
    last_password_change TIMESTAMPTZ,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    
    -- Timestamps with timezone support
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ, -- Soft delete support
    
    -- Data integrity constraints
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT phone_format CHECK (phone IS NULL OR phone ~* '^\+[1-9]\d{1,14}$'),
    CONSTRAINT name_length CHECK (char_length(first_name) >= 1 AND char_length(last_name) >= 1),
    CONSTRAINT roles_not_empty CHECK (array_length(roles, 1) > 0)
);

-- ================================================================================
-- ENTERPRISE INDEXES FOR PERFORMANCE
-- ================================================================================

-- Primary access patterns (using regular CREATE INDEX for initial setup)
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_cognito_id ON users(cognito_user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_status ON users(status) WHERE deleted_at IS NULL;

-- Role-based queries (using GIN for array searches)
CREATE INDEX idx_users_roles ON users USING GIN(roles) WHERE deleted_at IS NULL;

-- Time-based analytics
CREATE INDEX idx_users_created_at ON users(created_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_last_active ON users(last_active_at) WHERE deleted_at IS NULL;

-- Security monitoring
CREATE INDEX idx_users_failed_logins ON users(failed_login_attempts) WHERE failed_login_attempts > 0;
CREATE INDEX idx_users_locked ON users(locked_until) WHERE locked_until IS NOT NULL;

-- Soft delete support
CREATE INDEX idx_users_deleted ON users(deleted_at) WHERE deleted_at IS NOT NULL;

-- JSON preferences indexing (for future features)
CREATE INDEX idx_users_preferences_gin ON users USING GIN(preferences) WHERE deleted_at IS NULL;

-- ================================================================================
-- ENTERPRISE TRIGGERS AND FUNCTIONS
-- ================================================================================

-- Automatic updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- User activity tracking
CREATE OR REPLACE FUNCTION update_last_active()
RETURNS TRIGGER AS $$
BEGIN
    -- Only update if last_active is more than 5 minutes old (reduce DB writes)
    IF NEW.last_active_at < NOW() - INTERVAL '5 minutes' THEN
        NEW.last_active_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Email normalization trigger
CREATE OR REPLACE FUNCTION normalize_email()
RETURNS TRIGGER AS $$
BEGIN
    NEW.email = LOWER(TRIM(NEW.email));
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER normalize_email_trigger
    BEFORE INSERT OR UPDATE OF email ON users
    FOR EACH ROW
    EXECUTE FUNCTION normalize_email();

-- ================================================================================
-- ROW LEVEL SECURITY (Enterprise Security)
-- ================================================================================

-- Enable RLS on users table (will be configured after roles are created)
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Note: RLS policies will be enabled in a separate migration after roles are established

-- ================================================================================
-- DATABASE ROLES (Enterprise Access Control)
-- ================================================================================

-- Note: Database roles will be created in a separate migration for production
-- Development mode uses default postgres user with full access

-- ================================================================================
-- AUDIT LOG TABLE (Enterprise Compliance)
-- ================================================================================

CREATE TABLE user_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    performed_by UUID REFERENCES users(id),
    performed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Index for audit queries
    CONSTRAINT audit_action_check CHECK (action IN ('INSERT', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'ROLE_CHANGE'))
);

CREATE INDEX idx_audit_user_id ON user_audit_log(user_id);
CREATE INDEX idx_audit_performed_at ON user_audit_log(performed_at);
CREATE INDEX idx_audit_action ON user_audit_log(action);

-- ================================================================================
-- MATERIALIZED VIEWS (Enterprise Analytics)
-- ================================================================================

-- User statistics for dashboards
CREATE MATERIALIZED VIEW user_statistics AS
SELECT 
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE status = 'active') as active_users,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as new_users_30d,
    COUNT(*) FILTER (WHERE last_login_at > NOW() - INTERVAL '7 days') as active_users_7d,
    COUNT(*) FILTER (WHERE kyc_status = 'approved') as kyc_approved_users,
    AVG(EXTRACT(EPOCH FROM (NOW() - created_at))) as avg_user_age_seconds
FROM users 
WHERE deleted_at IS NULL;

-- Create unique index for REFRESH CONCURRENTLY
CREATE UNIQUE INDEX ON user_statistics ((1));

-- ================================================================================
-- PERFORMANCE MONITORING VIEWS (Simplified for Initial Setup)
-- ================================================================================

-- Basic connection monitoring
CREATE VIEW basic_connection_stats AS
SELECT 
    current_database() as database_name,
    current_user as current_user,
    NOW() as monitoring_timestamp;

-- ================================================================================
-- DATA VALIDATION FUNCTIONS
-- ================================================================================

-- Validate user roles
CREATE OR REPLACE FUNCTION validate_user_roles(roles_array user_role[])
RETURNS BOOLEAN AS $$
BEGIN
    -- Must have at least one role
    IF array_length(roles_array, 1) = 0 THEN
        RETURN FALSE;
    END IF;
    
    -- Cannot have conflicting roles (business rule)
    IF 'admin' = ANY(roles_array) AND array_length(roles_array, 1) > 1 THEN
        RETURN FALSE; -- Admins should only have admin role
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ================================================================================
-- COMMENTS FOR DOCUMENTATION
-- ================================================================================

COMMENT ON TABLE users IS 'Enterprise user management table with full audit trail and security features';
COMMENT ON COLUMN users.cognito_user_id IS 'AWS Cognito User Pool user identifier';
COMMENT ON COLUMN users.preferences IS 'User preferences stored as JSONB for flexibility';
COMMENT ON COLUMN users.metadata IS 'Additional user metadata for extensibility';
COMMENT ON COLUMN users.roles IS 'Array of user roles for role-based access control';
COMMENT ON TABLE user_audit_log IS 'Complete audit trail for all user-related operations';

-- ================================================================================
-- MIGRATION COMPLETE
-- ================================================================================