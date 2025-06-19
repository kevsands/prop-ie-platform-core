-- PROP.IE SQLite Database Optimization Script
-- Generated: 2025-06-19T13:17:50.474Z
-- Purpose: Development database performance optimization

-- =====================================================
-- PRAGMA OPTIMIZATIONS
-- =====================================================

-- Enable WAL mode for better concurrency
PRAGMA journal_mode = WAL;

-- Optimize memory usage
PRAGMA cache_size = 10000;
PRAGMA temp_store = memory;

-- Optimize I/O
PRAGMA synchronous = NORMAL;
PRAGMA mmap_size = 268435456; -- 256MB

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
-- STATISTICS UPDATE
-- =====================================================

-- Update query planner statistics
ANALYZE;

-- =====================================================
-- MONITORING QUERIES
-- =====================================================

-- Check database size
SELECT 
    'Database Size' as metric,
    (page_count * page_size) / 1024 / 1024 as size_mb
FROM pragma_page_count(), pragma_page_size();

-- Check table info
.tables

-- Check index list
.indexes
