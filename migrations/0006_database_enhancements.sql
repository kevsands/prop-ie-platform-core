-- Database Enhancement Migration
-- Phase 1: Extensions, Performance, and Architecture Improvements

BEGIN;

-- Enable necessary PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- TimescaleDB for time-series data (if available)
-- This will fail gracefully if TimescaleDB is not installed
DO $$
BEGIN
    CREATE EXTENSION IF NOT EXISTS "timescaledb";
EXCEPTION 
    WHEN others THEN
        RAISE NOTICE 'TimescaleDB not available, continuing without time-series optimizations';
END$$;

-- Create audit timestamp function
CREATE OR REPLACE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create audit trigger function for comprehensive logging
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
    old_data json;
    new_data json;
    excluded_cols text[] := ARRAY['updated_at', 'last_active'];
BEGIN
    -- Skip audit for excluded columns only updates
    IF TG_OP = 'UPDATE' THEN
        old_data := row_to_json(OLD);
        new_data := row_to_json(NEW);
        
        -- Check if only excluded columns changed
        IF old_data::jsonb - excluded_cols = new_data::jsonb - excluded_cols THEN
            RETURN NEW;
        END IF;
    END IF;

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
        CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
        CASE WHEN TG_OP = 'INSERT' THEN row_to_json(NEW) 
             WHEN TG_OP = 'UPDATE' THEN row_to_json(NEW) ELSE NULL END,
        current_setting('app.current_user_id', true),
        current_setting('app.current_ip_address', true)::inet,
        current_setting('app.current_user_agent', true),
        current_setting('app.current_session_id', true),
        now()
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create data validation function
CREATE OR REPLACE FUNCTION validate_email(email text)
RETURNS boolean AS $$
BEGIN
    RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION validate_phone(phone text)
RETURNS boolean AS $$
BEGIN
    -- E.164 format validation
    RETURN phone ~* '^\+[1-9]\d{1,14}$';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION validate_eircode(eircode text)
RETURNS boolean AS $$
BEGIN
    -- Irish Eircode format: A65 F4E2
    RETURN eircode ~* '^[A-Z0-9]{3} [A-Z0-9]{4}$';
END;
$$ LANGUAGE plpgsql;

-- Create function for currency conversion
CREATE OR REPLACE FUNCTION convert_currency(
    amount DECIMAL(19,4),
    from_currency TEXT,
    to_currency TEXT,
    exchange_rate DECIMAL(10,6) DEFAULT NULL
) RETURNS DECIMAL(19,4) AS $$
DECLARE
    converted_amount DECIMAL(19,4);
    current_rate DECIMAL(10,6);
BEGIN
    -- If same currency, return original amount
    IF from_currency = to_currency THEN
        RETURN amount;
    END IF;
    
    -- Use provided rate or fetch from rates table (placeholder for now)
    current_rate := COALESCE(exchange_rate, 1.0);
    
    converted_amount := amount * current_rate;
    
    RETURN converted_amount;
END;
$$ LANGUAGE plpgsql;

-- Create function for IRR calculation (simplified version)
CREATE OR REPLACE FUNCTION calculate_irr(
    cash_flows DECIMAL[],
    dates DATE[]
) RETURNS DECIMAL AS $$
DECLARE
    irr_result DECIMAL := 0.1; -- Starting guess of 10%
    tolerance DECIMAL := 0.0001;
    max_iterations INTEGER := 100;
    iteration INTEGER := 0;
    npv DECIMAL;
    derivative DECIMAL;
    periods INTEGER[];
    i INTEGER;
BEGIN
    -- Convert dates to periods (days from first date)
    FOR i IN 1..array_length(dates, 1) LOOP
        periods[i] := dates[i] - dates[1];
    END LOOP;
    
    -- Newton-Raphson method for IRR calculation
    WHILE iteration < max_iterations LOOP
        npv := 0;
        derivative := 0;
        
        FOR i IN 1..array_length(cash_flows, 1) LOOP
            npv := npv + cash_flows[i] / POWER(1 + irr_result, periods[i] / 365.0);
            derivative := derivative - (periods[i] / 365.0) * cash_flows[i] / POWER(1 + irr_result, (periods[i] / 365.0) + 1);
        END LOOP;
        
        IF ABS(npv) < tolerance THEN
            EXIT;
        END IF;
        
        irr_result := irr_result - npv / derivative;
        iteration := iteration + 1;
    END LOOP;
    
    RETURN irr_result * 100; -- Return as percentage
END;
$$ LANGUAGE plpgsql;

-- Create comprehensive indexing strategy

-- User table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email_gin ON users USING gin(email gin_trgm_ops);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_status_kyc ON users (status, kyc_status) WHERE status = 'ACTIVE';
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_created_date ON users (date_trunc('day', created));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_last_active ON users (last_active) WHERE last_active > now() - interval '30 days';
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_roles_gin ON users USING gin(roles);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_organization ON users (organization) WHERE organization IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_full_name_gin ON users USING gin((first_name || ' ' || last_name) gin_trgm_ops);

-- Location table indexes with PostGIS
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_locations_coordinates_gist ON locations USING gist(coordinates) WHERE coordinates IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_locations_city_county ON locations (city, county);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_locations_eircode ON locations (eircode);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_locations_address_gin ON locations USING gin(address gin_trgm_ops);

-- Development table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_developments_developer_status ON developments (developer_id, status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_developments_location_id ON developments (location_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_developments_slug_unique ON developments (slug);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_developments_created_date ON developments (date_trunc('day', created));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_developments_search_gin ON developments USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_developments_total_value ON developments (total_project_value) WHERE total_project_value IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_developments_completion_date ON developments (completion_date) WHERE completion_date IS NOT NULL;

-- Unit table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_units_development_status ON units (development_id, status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_units_available ON units (development_id, status, price) WHERE status IN ('AVAILABLE', 'RESERVED');
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_units_price_range ON units (price) WHERE price IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_units_bedrooms ON units (bedrooms) WHERE bedrooms IS NOT NULL;

-- Financial transaction indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_date_amount ON financial_transactions (date, amount);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_user_type ON financial_transactions (user_id, transaction_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_status ON financial_transactions (status) WHERE status != 'COMPLETED';
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_reference ON financial_transactions (reference_number) WHERE reference_number IS NOT NULL;

-- Money amounts indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_money_amounts_currency ON money_amounts (currency, amount);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_money_amounts_base_currency ON money_amounts (base_currency, converted_amount);

-- Audit log indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_table_record ON audit_logs (table_name, record_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_user_timestamp ON audit_logs (user_id, timestamp) WHERE user_id IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs (timestamp);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_operation ON audit_logs (operation, table_name);

-- Data quality indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_data_quality_rules_table ON data_quality_rules (table_name, is_active);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_data_quality_violations_unresolved ON data_quality_violations (rule_id, detected_at) WHERE resolved_at IS NULL;

-- Session and auth indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sessions_expires ON sessions (expires) WHERE expires > now();
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_refresh_tokens_expires ON refresh_tokens (expires_at) WHERE expires_at > now();
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_auth_logs_recent ON auth_logs (timestamp) WHERE timestamp > now() - interval '90 days';

-- Create materialized views for performance

-- Development analytics view
CREATE MATERIALIZED VIEW IF NOT EXISTS development_analytics AS
SELECT 
    d.id,
    d.name,
    d.developer_id,
    d.status,
    d.total_project_value,
    d.created,
    COUNT(u.id) as total_units,
    COUNT(CASE WHEN u.status = 'SOLD' THEN 1 END) as sold_units,
    COUNT(CASE WHEN u.status = 'AVAILABLE' THEN 1 END) as available_units,
    COUNT(CASE WHEN u.status = 'RESERVED' THEN 1 END) as reserved_units,
    AVG(u.price) as avg_unit_price,
    MIN(u.price) as min_unit_price,
    MAX(u.price) as max_unit_price,
    SUM(CASE WHEN u.status = 'SOLD' THEN u.price ELSE 0 END) as total_sales_value,
    CASE 
        WHEN COUNT(u.id) > 0 THEN 
            ROUND((COUNT(CASE WHEN u.status = 'SOLD' THEN 1 END)::decimal / COUNT(u.id) * 100), 2)
        ELSE 0 
    END as sales_percentage
FROM developments d
LEFT JOIN units u ON d.id = u.development_id
WHERE d.status != 'CANCELLED'
GROUP BY d.id, d.name, d.developer_id, d.status, d.total_project_value, d.created;

-- Create unique index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_development_analytics_id ON development_analytics (id);
CREATE INDEX IF NOT EXISTS idx_development_analytics_developer ON development_analytics (developer_id);
CREATE INDEX IF NOT EXISTS idx_development_analytics_status ON development_analytics (status);
CREATE INDEX IF NOT EXISTS idx_development_analytics_sales_pct ON development_analytics (sales_percentage);

-- User activity analytics view
CREATE MATERIALIZED VIEW IF NOT EXISTS user_activity_analytics AS
SELECT 
    u.id,
    u.email,
    u.roles,
    u.status,
    u.created,
    u.last_active,
    EXTRACT(days FROM now() - u.last_active) as days_since_last_active,
    COUNT(DISTINCT s.id) as total_sessions,
    COUNT(DISTINCT al.id) as total_auth_events,
    CASE 
        WHEN u.last_active > now() - interval '7 days' THEN 'Active'
        WHEN u.last_active > now() - interval '30 days' THEN 'Recent'
        WHEN u.last_active > now() - interval '90 days' THEN 'Dormant'
        ELSE 'Inactive'
    END as activity_status
FROM users u
LEFT JOIN sessions s ON u.id = s.user_id
LEFT JOIN auth_logs al ON u.id = al.user_id AND al.timestamp > now() - interval '90 days'
GROUP BY u.id, u.email, u.roles, u.status, u.created, u.last_active;

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_activity_analytics_id ON user_activity_analytics (id);
CREATE INDEX IF NOT EXISTS idx_user_activity_status ON user_activity_analytics (activity_status);
CREATE INDEX IF NOT EXISTS idx_user_activity_last_active ON user_activity_analytics (last_active);

-- Financial summary view
CREATE MATERIALIZED VIEW IF NOT EXISTS financial_summary AS
SELECT 
    date_trunc('month', ft.date) as month,
    ft.currency,
    COUNT(*) as transaction_count,
    SUM(CASE WHEN ft.transaction_type IN ('DEPOSIT', 'PAYMENT') THEN ft.amount ELSE 0 END) as total_inflows,
    SUM(CASE WHEN ft.transaction_type IN ('REFUND', 'FEE') THEN ft.amount ELSE 0 END) as total_outflows,
    SUM(ft.amount) as net_flow,
    AVG(ft.amount) as avg_transaction_amount
FROM financial_transactions ft
WHERE ft.status = 'COMPLETED'
    AND ft.date >= date_trunc('year', now()) - interval '2 years'
GROUP BY date_trunc('month', ft.date), ft.currency;

CREATE INDEX IF NOT EXISTS idx_financial_summary_month_currency ON financial_summary (month, currency);

-- Create partitioning for large tables (financial_transactions)
-- This will be implemented as transactions grow

-- Create triggers for audit logging on key tables
CREATE TRIGGER audit_users_trigger
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_developments_trigger
    AFTER INSERT OR UPDATE OR DELETE ON developments
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_units_trigger
    AFTER INSERT OR UPDATE OR DELETE ON units
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_financial_transactions_trigger
    AFTER INSERT OR UPDATE OR DELETE ON financial_transactions
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Create data quality validation triggers
CREATE OR REPLACE FUNCTION validate_user_data()
RETURNS TRIGGER AS $$
BEGIN
    -- Validate email format
    IF NEW.email IS NOT NULL AND NOT validate_email(NEW.email) THEN
        INSERT INTO data_quality_violations (rule_id, table_name, record_id, violation_details)
        SELECT 
            dqr.id, 
            'users', 
            NEW.id, 
            json_build_object('field', 'email', 'value', NEW.email, 'error', 'Invalid email format')
        FROM data_quality_rules dqr 
        WHERE dqr.table_name = 'users' AND dqr.column_name = 'email' AND dqr.is_active = true;
    END IF;
    
    -- Validate phone format
    IF NEW.phone IS NOT NULL AND NOT validate_phone(NEW.phone) THEN
        INSERT INTO data_quality_violations (rule_id, table_name, record_id, violation_details)
        SELECT 
            dqr.id, 
            'users', 
            NEW.id, 
            json_build_object('field', 'phone', 'value', NEW.phone, 'error', 'Invalid phone format (should be E.164)')
        FROM data_quality_rules dqr 
        WHERE dqr.table_name = 'users' AND dqr.column_name = 'phone' AND dqr.is_active = true;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_user_data_trigger
    AFTER INSERT OR UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION validate_user_data();

-- Location validation trigger
CREATE OR REPLACE FUNCTION validate_location_data()
RETURNS TRIGGER AS $$
BEGIN
    -- Validate Eircode format
    IF NEW.eircode IS NOT NULL AND NOT validate_eircode(NEW.eircode) THEN
        INSERT INTO data_quality_violations (rule_id, table_name, record_id, violation_details)
        SELECT 
            dqr.id, 
            'locations', 
            NEW.id, 
            json_build_object('field', 'eircode', 'value', NEW.eircode, 'error', 'Invalid Eircode format')
        FROM data_quality_rules dqr 
        WHERE dqr.table_name = 'locations' AND dqr.column_name = 'eircode' AND dqr.is_active = true;
    END IF;
    
    -- Create PostGIS point from latitude/longitude if coordinates not provided
    IF NEW.coordinates IS NULL AND NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        NEW.coordinates := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_location_data_trigger
    BEFORE INSERT OR UPDATE ON locations
    FOR EACH ROW EXECUTE FUNCTION validate_location_data();

-- Automatic refresh of materialized views
CREATE OR REPLACE FUNCTION refresh_materialized_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY development_analytics;
    REFRESH MATERIALIZED VIEW CONCURRENTLY user_activity_analytics;
    REFRESH MATERIALIZED VIEW CONCURRENTLY financial_summary;
END;
$$ LANGUAGE plpgsql;

-- Schedule automatic refresh (this would typically be done via cron or application scheduler)
-- For now, we'll create a simple function that can be called periodically

-- Create some initial data quality rules
INSERT INTO data_quality_rules (table_name, column_name, rule_type, rule_definition, severity, description)
VALUES 
    ('users', 'email', 'PATTERN', '{"pattern": "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"}', 'ERROR', 'Email must be valid format'),
    ('users', 'phone', 'PATTERN', '{"pattern": "^\\+[1-9]\\d{1,14}$"}', 'WARNING', 'Phone must be E.164 format'),
    ('users', 'first_name', 'NOT_NULL', '{}', 'ERROR', 'First name is required'),
    ('users', 'last_name', 'NOT_NULL', '{}', 'ERROR', 'Last name is required'),
    ('locations', 'eircode', 'PATTERN', '{"pattern": "^[A-Z0-9]{3} [A-Z0-9]{4}$"}', 'WARNING', 'Eircode must be valid Irish format'),
    ('developments', 'total_units', 'RANGE', '{"min": 1, "max": 1000}', 'ERROR', 'Total units must be between 1 and 1000'),
    ('units', 'price', 'RANGE', '{"min": 1000, "max": 10000000}', 'ERROR', 'Unit price must be reasonable range'),
    ('financial_transactions', 'amount', 'RANGE', '{"min": 0.01}', 'ERROR', 'Transaction amount must be positive');

-- Add check constraints for business rules
ALTER TABLE users ADD CONSTRAINT IF NOT EXISTS valid_email_format 
    CHECK (email IS NULL OR validate_email(email));

ALTER TABLE locations ADD CONSTRAINT IF NOT EXISTS valid_eircode_format 
    CHECK (eircode IS NULL OR validate_eircode(eircode));

ALTER TABLE developments ADD CONSTRAINT IF NOT EXISTS valid_total_units 
    CHECK (total_units > 0 AND total_units <= 1000);

ALTER TABLE units ADD CONSTRAINT IF NOT EXISTS valid_unit_price 
    CHECK (price IS NULL OR (price > 1000 AND price < 10000000));

-- Create environment configuration
INSERT INTO environment_configs (environment, feature_flags, validation_rules, performance_thresholds)
VALUES 
    ('development', 
     '{"strict_validation": false, "debug_mode": true, "cache_ttl": 300}',
     '{"email_required": false, "phone_required": false}',
     '{"max_query_time": 5000, "max_connection_pool": 20}'
    ),
    ('staging', 
     '{"strict_validation": true, "debug_mode": false, "cache_ttl": 600}',
     '{"email_required": true, "phone_required": false}',
     '{"max_query_time": 3000, "max_connection_pool": 50}'
    ),
    ('production', 
     '{"strict_validation": true, "debug_mode": false, "cache_ttl": 1800}',
     '{"email_required": true, "phone_required": true}',
     '{"max_query_time": 2000, "max_connection_pool": 100}'
    )
ON CONFLICT (environment) DO UPDATE SET
    feature_flags = EXCLUDED.feature_flags,
    validation_rules = EXCLUDED.validation_rules,
    performance_thresholds = EXCLUDED.performance_thresholds,
    updated = now();

-- Create initial dashboard metrics
INSERT INTO dashboard_metrics (metric_name, query_sql, refresh_interval_seconds)
VALUES 
    ('total_active_users', 
     'SELECT count(*) as value FROM users WHERE status = ''ACTIVE'' AND last_active > now() - interval ''30 days''',
     300
    ),
    ('total_developments', 
     'SELECT count(*) as value FROM developments WHERE status NOT IN (''CANCELLED'', ''COMPLETED'')',
     600
    ),
    ('total_available_units', 
     'SELECT count(*) as value FROM units WHERE status = ''AVAILABLE''',
     300
    ),
    ('avg_unit_price', 
     'SELECT round(avg(price)::numeric, 2) as value FROM units WHERE status = ''AVAILABLE'' AND price IS NOT NULL',
     900
    ),
    ('monthly_sales_volume', 
     'SELECT coalesce(sum(amount), 0) as value FROM financial_transactions WHERE transaction_type = ''PAYMENT'' AND status = ''COMPLETED'' AND date >= date_trunc(''month'', now())',
     1800
    );

-- Record this migration
INSERT INTO schema_versions (version, description, migration_sql, applied_by)
VALUES (
    '0006_database_enhancements',
    'Phase 1: Database extensions, performance optimizations, audit logging, data quality framework, and materialized views',
    'Full migration script with extensions, indexes, triggers, and views',
    'system'
);

COMMIT;

-- Post-migration: Refresh materialized views
SELECT refresh_materialized_views();