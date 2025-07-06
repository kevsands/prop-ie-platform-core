-- PROP.IE Database Optimization Script
-- Generated: 2025-06-19T13:17:50.473Z
-- Purpose: Production database performance optimization

-- =====================================================
-- INDEX CREATION
-- =====================================================

-- Fast user lookup by email for authentication
CREATE UNIQUE INDEX idx_user_email ON User (email);

-- Query users by role and status efficiently
CREATE INDEX idx_user_role_status ON User (role, status);

-- Fast property queries by developer and availability
CREATE INDEX idx_property_developer_status ON Property (developerId, status);

-- Efficient price range queries
CREATE INDEX idx_property_price_range ON Property (priceMin, priceMax);

-- Location and type filtering
CREATE INDEX idx_property_location_type ON Property (location, propertyType);

-- Fast buyer transaction lookup
CREATE INDEX idx_transaction_buyer ON Transaction (buyerId);

-- Property transaction history
CREATE INDEX idx_transaction_property ON Transaction (propertyId);

-- Transaction monitoring and reporting
CREATE INDEX idx_transaction_status_date ON Transaction (status, createdAt);

-- Fast HTB application lookup by buyer
CREATE INDEX idx_htb_buyer ON HTBApplication (buyerId);

-- HTB application processing and reporting
CREATE INDEX idx_htb_status_date ON HTBApplication (status, submittedAt);

-- User task dashboard queries
CREATE INDEX idx_task_assigned_status ON Task (assignedTo, status);

-- Milestone tracking and deadline monitoring
CREATE INDEX idx_task_milestone_due ON Task (milestone, dueDate);

-- Message chronological retrieval
CREATE INDEX idx_message_conversation_date ON Message (conversationId, createdAt);

-- User message history
CREATE INDEX idx_message_sender ON Message (senderId);

-- User document history
CREATE INDEX idx_document_uploader_date ON Document (uploadedBy, createdAt);

-- Document categorization and retrieval
CREATE INDEX idx_document_association_type ON Document (associatedWith, documentType);

-- =====================================================
-- POSTGRESQL SPECIFIC OPTIMIZATIONS
-- =====================================================

-- Update table statistics
ANALYZE;

-- Vacuum tables to reclaim space
VACUUM ANALYZE;

-- Set optimal PostgreSQL configuration
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET work_mem = '64MB';
ALTER SYSTEM SET maintenance_work_mem = '256MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.7;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;

-- Enable query optimization
ALTER SYSTEM SET enable_hashjoin = ON;
ALTER SYSTEM SET enable_mergejoin = ON;
ALTER SYSTEM SET enable_nestloop = ON;

-- Reload configuration
SELECT pg_reload_conf();

-- =====================================================
-- MONITORING QUERIES
-- =====================================================

-- Check index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as index_scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as index_size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check slow queries
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    rows
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 20;
