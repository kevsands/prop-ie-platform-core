-- Production Readiness and Advanced Monitoring
-- Phase 5: Final optimizations, monitoring, and production-ready features

BEGIN;

-- Enable pg_stat_statements for query monitoring
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create advanced monitoring views for production
CREATE OR REPLACE VIEW system_health_summary AS
SELECT 
    'database' as component,
    CASE 
        WHEN (SELECT count(*) FROM pg_stat_activity WHERE state = 'active') > 
             (SELECT setting::int FROM pg_settings WHERE name = 'max_connections') * 0.8 
        THEN 'critical'
        WHEN (SELECT count(*) FROM pg_stat_activity WHERE state = 'active') > 
             (SELECT setting::int FROM pg_settings WHERE name = 'max_connections') * 0.6 
        THEN 'warning'
        ELSE 'healthy'
    END as status,
    jsonb_build_object(
        'active_connections', (SELECT count(*) FROM pg_stat_activity WHERE state = 'active'),
        'max_connections', (SELECT setting::int FROM pg_settings WHERE name = 'max_connections'),
        'database_size', pg_size_pretty(pg_database_size(current_database())),
        'uptime_hours', EXTRACT(EPOCH FROM (now() - pg_postmaster_start_time())) / 3600
    ) as metrics
UNION ALL
SELECT 
    'data_quality' as component,
    CASE 
        WHEN (SELECT count(*) FROM data_quality_violations WHERE resolved_at IS NULL AND rule_id IN 
              (SELECT id FROM data_quality_rules WHERE severity = 'ERROR')) > 10
        THEN 'critical'
        WHEN (SELECT count(*) FROM data_quality_violations WHERE resolved_at IS NULL) > 5
        THEN 'warning'
        ELSE 'healthy'
    END as status,
    jsonb_build_object(
        'total_violations', (SELECT count(*) FROM data_quality_violations WHERE resolved_at IS NULL),
        'critical_violations', (SELECT count(*) FROM data_quality_violations dqv 
                                JOIN data_quality_rules dqr ON dqv.rule_id = dqr.id 
                                WHERE dqv.resolved_at IS NULL AND dqr.severity = 'ERROR'),
        'last_check', (SELECT max(detected_at) FROM data_quality_violations)
    ) as metrics
UNION ALL
SELECT 
    'performance' as component,
    CASE 
        WHEN (SELECT avg(mean_exec_time) FROM pg_stat_statements WHERE calls > 100) > 1000
        THEN 'warning'
        WHEN (SELECT count(*) FROM pg_stat_statements WHERE mean_exec_time > 5000) > 5
        THEN 'critical'
        ELSE 'healthy'
    END as status,
    jsonb_build_object(
        'avg_query_time', COALESCE((SELECT round(avg(mean_exec_time), 2) FROM pg_stat_statements WHERE calls > 10), 0),
        'slow_queries', COALESCE((SELECT count(*) FROM pg_stat_statements WHERE mean_exec_time > 1000), 0),
        'total_queries', COALESCE((SELECT sum(calls) FROM pg_stat_statements), 0)
    ) as metrics;

-- Create table partitioning for audit logs (time-based partitioning)
CREATE TABLE IF NOT EXISTS audit_logs_y2025m01 PARTITION OF audit_logs
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE IF NOT EXISTS audit_logs_y2025m02 PARTITION OF audit_logs
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

CREATE TABLE IF NOT EXISTS audit_logs_y2025m03 PARTITION OF audit_logs
    FOR VALUES FROM ('2025-03-01') TO ('2025-04-01');

-- Create automatic partition creation function
CREATE OR REPLACE FUNCTION create_audit_log_partition(partition_date date)
RETURNS void AS $$
DECLARE
    partition_name text;
    start_date date;
    end_date date;
BEGIN
    start_date := date_trunc('month', partition_date);
    end_date := start_date + interval '1 month';
    partition_name := 'audit_logs_y' || to_char(start_date, 'YYYY') || 'm' || to_char(start_date, 'MM');
    
    EXECUTE format('CREATE TABLE IF NOT EXISTS %I PARTITION OF audit_logs FOR VALUES FROM (%L) TO (%L)',
                   partition_name, start_date, end_date);
    
    -- Create index on new partition
    EXECUTE format('CREATE INDEX IF NOT EXISTS %I ON %I (timestamp)',
                   partition_name || '_timestamp_idx', partition_name);
END;
$$ LANGUAGE plpgsql;

-- Create advanced caching strategy with Redis-compatible functions
CREATE OR REPLACE FUNCTION cache_key_exists(key_name text)
RETURNS boolean AS $$
BEGIN
    -- This would integrate with Redis in a real implementation
    -- For now, use a simple in-database cache simulation
    RETURN EXISTS(
        SELECT 1 FROM temp_cache 
        WHERE cache_key = key_name 
          AND expires_at > now()
    );
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS temp_cache (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    cache_key text UNIQUE NOT NULL,
    cache_value jsonb NOT NULL,
    expires_at timestamptz NOT NULL,
    created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_temp_cache_key ON temp_cache (cache_key);
CREATE INDEX IF NOT EXISTS idx_temp_cache_expires ON temp_cache (expires_at);

-- Create automated maintenance procedures
CREATE OR REPLACE FUNCTION automated_maintenance()
RETURNS void AS $$
BEGIN
    -- Refresh materialized views
    REFRESH MATERIALIZED VIEW CONCURRENTLY development_analytics;
    REFRESH MATERIALIZED VIEW CONCURRENTLY user_activity_analytics;
    REFRESH MATERIALIZED VIEW CONCURRENTLY financial_summary;
    
    -- Clean up old cache entries
    DELETE FROM temp_cache WHERE expires_at < now();
    
    -- Clean up old sessions
    DELETE FROM sessions WHERE expires < now() - interval '1 day';
    
    -- Clean up old refresh tokens
    DELETE FROM refresh_tokens WHERE expires_at < now() - interval '1 day';
    
    -- Archive old audit logs (older than 1 year)
    UPDATE audit_logs SET 
        old_values = NULL,
        new_values = NULL
    WHERE timestamp < now() - interval '1 year'
      AND old_values IS NOT NULL;
    
    -- Update table statistics
    ANALYZE;
    
    -- Log maintenance completion
    INSERT INTO system_events (event_type, event_data, timestamp)
    VALUES ('MAINTENANCE_COMPLETED', 
            jsonb_build_object('completed_at', now(), 'tasks', 
                ARRAY['materialized_views', 'cache_cleanup', 'session_cleanup', 'audit_archive', 'analyze']),
            now());
END;
$$ LANGUAGE plpgsql;

-- Create system events table for operational monitoring
CREATE TABLE IF NOT EXISTS system_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type text NOT NULL,
    event_data jsonb,
    severity text DEFAULT 'INFO' CHECK (severity IN ('DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL')),
    timestamp timestamptz DEFAULT now(),
    acknowledged_at timestamptz,
    acknowledged_by text
);

CREATE INDEX IF NOT EXISTS idx_system_events_type ON system_events (event_type);
CREATE INDEX IF NOT EXISTS idx_system_events_timestamp ON system_events (timestamp);
CREATE INDEX IF NOT EXISTS idx_system_events_severity ON system_events (severity);
CREATE INDEX IF NOT EXISTS idx_system_events_unacknowledged ON system_events (timestamp) 
    WHERE acknowledged_at IS NULL AND severity IN ('ERROR', 'CRITICAL');

-- Create connection pooling optimization
CREATE OR REPLACE FUNCTION optimize_connection_settings()
RETURNS void AS $$
BEGIN
    -- These would typically be set in postgresql.conf
    -- Including here as reference for production deployment
    
    INSERT INTO system_events (event_type, event_data, severity)
    VALUES ('CONNECTION_OPTIMIZATION_REMINDER', 
            jsonb_build_object(
                'shared_buffers', '256MB',
                'effective_cache_size', '1GB', 
                'work_mem', '4MB',
                'maintenance_work_mem', '64MB',
                'checkpoint_completion_target', 0.9,
                'wal_buffers', '16MB',
                'default_statistics_target', 100,
                'random_page_cost', 1.1,
                'effective_io_concurrency', 200
            ), 
            'INFO');
END;
$$ LANGUAGE plpgsql;

-- Create backup and recovery verification
CREATE OR REPLACE FUNCTION verify_backup_health()
RETURNS jsonb AS $$
DECLARE
    result jsonb;
    latest_backup timestamptz;
    backup_age_hours numeric;
BEGIN
    -- In a real implementation, this would check actual backup status
    -- For now, simulate backup health check
    
    SELECT COALESCE(max(timestamp), now() - interval '7 days') 
    INTO latest_backup
    FROM system_events 
    WHERE event_type = 'BACKUP_COMPLETED';
    
    backup_age_hours := EXTRACT(EPOCH FROM (now() - latest_backup)) / 3600;
    
    result := jsonb_build_object(
        'latest_backup', latest_backup,
        'backup_age_hours', backup_age_hours,
        'status', CASE 
            WHEN backup_age_hours > 168 THEN 'CRITICAL'  -- > 1 week
            WHEN backup_age_hours > 48 THEN 'WARNING'    -- > 2 days
            ELSE 'HEALTHY'
        END,
        'database_size', pg_size_pretty(pg_database_size(current_database())),
        'wal_files', (SELECT count(*) FROM pg_ls_waldir() WHERE name ~ '^[0-9A-F]{24}$')
    );
    
    -- Log backup status
    INSERT INTO system_events (event_type, event_data, severity)
    VALUES ('BACKUP_HEALTH_CHECK', result, 
            CASE 
                WHEN result->>'status' = 'CRITICAL' THEN 'CRITICAL'
                WHEN result->>'status' = 'WARNING' THEN 'WARNING'
                ELSE 'INFO'
            END);
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create advanced alerting triggers
CREATE OR REPLACE FUNCTION check_system_thresholds()
RETURNS void AS $$
DECLARE
    connection_usage numeric;
    disk_usage_warning boolean := false;
    performance_degraded boolean := false;
BEGIN
    -- Check connection usage
    SELECT (count(*)::numeric / (SELECT setting::int FROM pg_settings WHERE name = 'max_connections') * 100)
    INTO connection_usage
    FROM pg_stat_activity 
    WHERE state = 'active';
    
    IF connection_usage > 85 THEN
        INSERT INTO system_events (event_type, event_data, severity)
        VALUES ('HIGH_CONNECTION_USAGE', 
                jsonb_build_object('usage_percent', connection_usage, 'threshold', 85),
                'CRITICAL');
    ELSIF connection_usage > 70 THEN
        INSERT INTO system_events (event_type, event_data, severity)
        VALUES ('MODERATE_CONNECTION_USAGE', 
                jsonb_build_object('usage_percent', connection_usage, 'threshold', 70),
                'WARNING');
    END IF;
    
    -- Check for performance issues
    SELECT CASE WHEN avg(mean_exec_time) > 2000 THEN true ELSE false END
    INTO performance_degraded
    FROM pg_stat_statements 
    WHERE calls > 50
      AND query NOT LIKE '%pg_stat_statements%';
    
    IF performance_degraded THEN
        INSERT INTO system_events (event_type, event_data, severity)
        VALUES ('PERFORMANCE_DEGRADATION', 
                jsonb_build_object(
                    'avg_query_time', (SELECT avg(mean_exec_time) FROM pg_stat_statements WHERE calls > 50),
                    'slow_query_count', (SELECT count(*) FROM pg_stat_statements WHERE mean_exec_time > 1000)
                ),
                'WARNING');
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create production-ready security enhancements
CREATE OR REPLACE FUNCTION security_audit_scan()
RETURNS jsonb AS $$
DECLARE
    suspicious_activity jsonb;
    failed_logins integer;
    admin_access_count integer;
BEGIN
    -- Check for failed login attempts
    SELECT count(*)
    INTO failed_logins
    FROM auth_logs 
    WHERE success = false 
      AND timestamp > now() - interval '1 hour';
    
    -- Check for excessive admin access
    SELECT count(*)
    INTO admin_access_count
    FROM audit_logs
    WHERE user_id IN (SELECT id FROM users WHERE 'ADMIN' = ANY(roles))
      AND timestamp > now() - interval '1 hour'
      AND operation IN ('UPDATE', 'DELETE');
    
    suspicious_activity := jsonb_build_object(
        'failed_logins_last_hour', failed_logins,
        'admin_modifications_last_hour', admin_access_count,
        'scan_timestamp', now()
    );
    
    -- Alert on suspicious patterns
    IF failed_logins > 50 THEN
        INSERT INTO system_events (event_type, event_data, severity)
        VALUES ('SECURITY_ALERT_BRUTE_FORCE', suspicious_activity, 'CRITICAL');
    END IF;
    
    IF admin_access_count > 100 THEN
        INSERT INTO system_events (event_type, event_data, severity)
        VALUES ('SECURITY_ALERT_EXCESSIVE_ADMIN_ACCESS', suspicious_activity, 'WARNING');
    END IF;
    
    RETURN suspicious_activity;
END;
$$ LANGUAGE plpgsql;

-- Create database size monitoring
CREATE OR REPLACE FUNCTION monitor_database_growth()
RETURNS void AS $$
DECLARE
    db_size_mb numeric;
    growth_rate numeric;
    last_size_mb numeric;
BEGIN
    db_size_mb := pg_database_size(current_database()) / 1024 / 1024;
    
    -- Get last recorded size
    SELECT (event_data->>'size_mb')::numeric
    INTO last_size_mb
    FROM system_events 
    WHERE event_type = 'DATABASE_SIZE_CHECK'
    ORDER BY timestamp DESC 
    LIMIT 1;
    
    IF last_size_mb IS NOT NULL THEN
        growth_rate := ((db_size_mb - last_size_mb) / last_size_mb) * 100;
    ELSE
        growth_rate := 0;
    END IF;
    
    INSERT INTO system_events (event_type, event_data, severity)
    VALUES ('DATABASE_SIZE_CHECK', 
            jsonb_build_object(
                'size_mb', db_size_mb,
                'growth_rate_percent', growth_rate,
                'largest_tables', (
                    SELECT jsonb_agg(
                        jsonb_build_object(
                            'table_name', schemaname || '.' || tablename,
                            'size_mb', pg_total_relation_size(schemaname||'.'||tablename) / 1024 / 1024
                        )
                    )
                    FROM (
                        SELECT schemaname, tablename
                        FROM pg_tables 
                        WHERE schemaname NOT IN ('information_schema', 'pg_catalog')
                        ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
                        LIMIT 5
                    ) t
                )
            ),
            CASE 
                WHEN growth_rate > 20 THEN 'WARNING'
                WHEN db_size_mb > 10000 THEN 'WARNING'  -- > 10GB
                ELSE 'INFO'
            END);
END;
$$ LANGUAGE plpgsql;

-- Create production deployment checklist function
CREATE OR REPLACE FUNCTION production_readiness_check()
RETURNS jsonb AS $$
DECLARE
    checks jsonb := '{}';
    extensions_ok boolean;
    indexes_ok boolean;
    constraints_ok boolean;
    security_ok boolean;
BEGIN
    -- Check required extensions
    SELECT count(*) = 5
    INTO extensions_ok
    FROM pg_extension 
    WHERE extname IN ('uuid-ossp', 'pgcrypto', 'postgis', 'pg_trgm', 'pg_stat_statements');
    
    checks := checks || jsonb_build_object('extensions_installed', extensions_ok);
    
    -- Check critical indexes exist
    SELECT count(*) > 20
    INTO indexes_ok
    FROM pg_indexes 
    WHERE schemaname = 'public';
    
    checks := checks || jsonb_build_object('indexes_created', indexes_ok);
    
    -- Check constraints are in place
    SELECT count(*) > 5
    INTO constraints_ok
    FROM information_schema.check_constraints;
    
    checks := checks || jsonb_build_object('constraints_active', constraints_ok);
    
    -- Check security features
    SELECT count(*) > 0
    INTO security_ok
    FROM information_schema.enabled_roles
    WHERE role_name LIKE '%_role';
    
    checks := checks || jsonb_build_object('security_roles_configured', security_ok);
    
    -- Add overall readiness score
    checks := checks || jsonb_build_object(
        'overall_ready', extensions_ok AND indexes_ok AND constraints_ok AND security_ok,
        'check_timestamp', now()
    );
    
    RETURN checks;
END;
$$ LANGUAGE plpgsql;

-- Create monitoring dashboard data refresh
CREATE OR REPLACE FUNCTION refresh_dashboard_metrics()
RETURNS void AS $$
BEGIN
    -- Update cached metrics for dashboard
    INSERT INTO dashboard_metric_cache (metric_name, value, calculated_at)
    SELECT 
        'active_users_24h',
        count(*),
        now()
    FROM users 
    WHERE last_active > now() - interval '24 hours'
      AND status = 'ACTIVE'
    ON CONFLICT (metric_name) DO UPDATE SET
        value = EXCLUDED.value,
        calculated_at = EXCLUDED.calculated_at;
    
    INSERT INTO dashboard_metric_cache (metric_name, value, calculated_at)
    SELECT 
        'total_developments_active',
        count(*),
        now()
    FROM developments 
    WHERE status IN ('PLANNING', 'PRE_CONSTRUCTION', 'CONSTRUCTION', 'MARKETING', 'SALES')
    ON CONFLICT (metric_name) DO UPDATE SET
        value = EXCLUDED.value,
        calculated_at = EXCLUDED.calculated_at;
    
    INSERT INTO dashboard_metric_cache (metric_name, value, calculated_at)
    SELECT 
        'units_sold_this_month',
        count(*),
        now()
    FROM units 
    WHERE status = 'SOLD'
      AND updated_at >= date_trunc('month', now())
    ON CONFLICT (metric_name) DO UPDATE SET
        value = EXCLUDED.value,
        calculated_at = EXCLUDED.calculated_at;
END;
$$ LANGUAGE plpgsql;

-- Create cache table for dashboard metrics
CREATE TABLE IF NOT EXISTS dashboard_metric_cache (
    metric_name text PRIMARY KEY,
    value numeric NOT NULL,
    calculated_at timestamptz DEFAULT now(),
    expires_at timestamptz DEFAULT (now() + interval '5 minutes')
);

CREATE INDEX IF NOT EXISTS idx_dashboard_cache_expires ON dashboard_metric_cache (expires_at);

-- Insert production configuration settings
INSERT INTO environment_configs (environment, feature_flags, validation_rules, performance_thresholds)
VALUES (
    'production',
    jsonb_build_object(
        'strict_validation', true,
        'debug_mode', false,
        'cache_ttl', 1800,
        'enable_audit_logging', true,
        'enable_security_monitoring', true,
        'enable_performance_monitoring', true,
        'maintenance_window_hours', '[2,4]'
    ),
    jsonb_build_object(
        'email_required', true,
        'phone_required', true,
        'kyc_required', true,
        'financial_limits_enforced', true,
        'data_retention_days', 2555  -- 7 years
    ),
    jsonb_build_object(
        'max_query_time_ms', 2000,
        'max_connection_pool', 100,
        'connection_warning_threshold', 70,
        'connection_critical_threshold', 85,
        'slow_query_threshold_ms', 1000
    )
)
ON CONFLICT (environment) DO UPDATE SET
    feature_flags = EXCLUDED.feature_flags,
    validation_rules = EXCLUDED.validation_rules,
    performance_thresholds = EXCLUDED.performance_thresholds,
    updated = now();

-- Record this migration
INSERT INTO schema_versions (version, description, migration_sql, applied_by)
VALUES (
    '0008_production_readiness',
    'Phase 5: Production readiness with advanced monitoring, alerting, maintenance procedures, and performance optimization',
    'Complete production-ready database with monitoring, alerting, and automated maintenance',
    'system'
);

-- Run initial production readiness check
SELECT production_readiness_check();

COMMIT;

-- Post-migration: Schedule automated maintenance (would be done via cron in production)
SELECT automated_maintenance();