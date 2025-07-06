
-- PROP.ie Staging Database Setup
-- Safe setup script for staging environment

-- Create staging database (if not exists)
SELECT 'CREATE DATABASE propie_staging'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'propie_staging');

-- Create staging user
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'staging_user') THEN
    CREATE USER staging_user WITH PASSWORD 'staging_secure_pass_2025';
  END IF;
END
$$;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE propie_staging TO staging_user;

-- Connect to staging database
\c propie_staging;

-- Create staging-specific extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Set up staging-specific configurations
ALTER DATABASE propie_staging SET timezone TO 'Europe/Dublin';
ALTER DATABASE propie_staging SET log_statement TO 'all';
ALTER DATABASE propie_staging SET log_min_duration_statement TO 1000;

-- Create staging schemas
CREATE SCHEMA IF NOT EXISTS staging_analytics;
CREATE SCHEMA IF NOT EXISTS staging_testing;
CREATE SCHEMA IF NOT EXISTS staging_monitoring;

COMMENT ON DATABASE propie_staging IS 'PROP.ie Staging Environment Database - Created $(date)';
