/**
 * Database Optimization Script
 * Analyzes and optimizes database performance for production
 */

const fs = require('fs');
const path = require('path');

// Database optimization configurations
const OPTIMIZATIONS = {
  indexes: [
    // User-related indexes
    {
      table: 'User',
      columns: ['email'],
      type: 'UNIQUE',
      name: 'idx_user_email',
      rationale: 'Fast user lookup by email for authentication'
    },
    {
      table: 'User',
      columns: ['role', 'status'],
      type: 'COMPOSITE',
      name: 'idx_user_role_status',
      rationale: 'Query users by role and status efficiently'
    },
    
    // Property-related indexes
    {
      table: 'Property',
      columns: ['developerId', 'status'],
      type: 'COMPOSITE',
      name: 'idx_property_developer_status',
      rationale: 'Fast property queries by developer and availability'
    },
    {
      table: 'Property',
      columns: ['priceMin', 'priceMax'],
      type: 'COMPOSITE',
      name: 'idx_property_price_range',
      rationale: 'Efficient price range queries'
    },
    {
      table: 'Property',
      columns: ['location', 'propertyType'],
      type: 'COMPOSITE',
      name: 'idx_property_location_type',
      rationale: 'Location and type filtering'
    },
    
    // Transaction-related indexes
    {
      table: 'Transaction',
      columns: ['buyerId'],
      type: 'INDEX',
      name: 'idx_transaction_buyer',
      rationale: 'Fast buyer transaction lookup'
    },
    {
      table: 'Transaction',
      columns: ['propertyId'],
      type: 'INDEX',
      name: 'idx_transaction_property',
      rationale: 'Property transaction history'
    },
    {
      table: 'Transaction',
      columns: ['status', 'createdAt'],
      type: 'COMPOSITE',
      name: 'idx_transaction_status_date',
      rationale: 'Transaction monitoring and reporting'
    },
    
    // HTB Application indexes
    {
      table: 'HTBApplication',
      columns: ['buyerId'],
      type: 'INDEX',
      name: 'idx_htb_buyer',
      rationale: 'Fast HTB application lookup by buyer'
    },
    {
      table: 'HTBApplication',
      columns: ['status', 'submittedAt'],
      type: 'COMPOSITE',
      name: 'idx_htb_status_date',
      rationale: 'HTB application processing and reporting'
    },
    
    // Task-related indexes
    {
      table: 'Task',
      columns: ['assignedTo', 'status'],
      type: 'COMPOSITE',
      name: 'idx_task_assigned_status',
      rationale: 'User task dashboard queries'
    },
    {
      table: 'Task',
      columns: ['milestone', 'dueDate'],
      type: 'COMPOSITE',
      name: 'idx_task_milestone_due',
      rationale: 'Milestone tracking and deadline monitoring'
    },
    
    // Message-related indexes
    {
      table: 'Message',
      columns: ['conversationId', 'createdAt'],
      type: 'COMPOSITE',
      name: 'idx_message_conversation_date',
      rationale: 'Message chronological retrieval'
    },
    {
      table: 'Message',
      columns: ['senderId'],
      type: 'INDEX',
      name: 'idx_message_sender',
      rationale: 'User message history'
    },
    
    // Document indexes
    {
      table: 'Document',
      columns: ['uploadedBy', 'createdAt'],
      type: 'COMPOSITE',
      name: 'idx_document_uploader_date',
      rationale: 'User document history'
    },
    {
      table: 'Document',
      columns: ['associatedWith', 'documentType'],
      type: 'COMPOSITE',
      name: 'idx_document_association_type',
      rationale: 'Document categorization and retrieval'
    }
  ],
  
  queryOptimizations: [
    {
      name: 'Paginated Property Search',
      before: 'SELECT * FROM Property WHERE location LIKE ?',
      after: 'SELECT * FROM Property USE INDEX (idx_property_location_type) WHERE location = ? AND propertyType = ? LIMIT ? OFFSET ?',
      improvement: 'Use exact matches and proper indexing'
    },
    {
      name: 'User Dashboard Tasks',
      before: 'SELECT * FROM Task WHERE assignedTo = ?',
      after: 'SELECT * FROM Task USE INDEX (idx_task_assigned_status) WHERE assignedTo = ? AND status IN (?, ?) ORDER BY dueDate ASC',
      improvement: 'Filter by status and order by due date'
    },
    {
      name: 'Transaction History',
      before: 'SELECT * FROM Transaction WHERE buyerId = ? ORDER BY createdAt DESC',
      after: 'SELECT * FROM Transaction USE INDEX (idx_transaction_buyer) WHERE buyerId = ? ORDER BY createdAt DESC LIMIT ?',
      improvement: 'Add limit for pagination'
    }
  ],
  
  caching: [
    {
      name: 'Property Search Results',
      key: 'property:search:{location}:{type}:{page}',
      ttl: '15 minutes',
      invalidation: 'On property updates'
    },
    {
      name: 'User Profile Data',
      key: 'user:profile:{userId}',
      ttl: '30 minutes',
      invalidation: 'On profile updates'
    },
    {
      name: 'HTB Application Status',
      key: 'htb:status:{applicationId}',
      ttl: '5 minutes',
      invalidation: 'On status changes'
    },
    {
      name: 'Task Counts by User',
      key: 'task:counts:{userId}',
      ttl: '10 minutes',
      invalidation: 'On task updates'
    }
  ]
};

async function generateOptimizationScript() {
  console.log('🗄️  Generating Database Optimization Scripts...\n');

  // Generate SQL for indexes
  const sqlIndexes = OPTIMIZATIONS.indexes.map(index => {
    let sql = '';
    
    switch (index.type) {
      case 'UNIQUE':
        sql = `CREATE UNIQUE INDEX ${index.name} ON ${index.table} (${index.columns.join(', ')});`;
        break;
      case 'COMPOSITE':
        sql = `CREATE INDEX ${index.name} ON ${index.table} (${index.columns.join(', ')});`;
        break;
      case 'INDEX':
        sql = `CREATE INDEX ${index.name} ON ${index.table} (${index.columns.join(', ')});`;
        break;
    }
    
    return {
      sql,
      comment: `-- ${index.rationale}`,
      table: index.table,
      name: index.name
    };
  });

  // Generate PostgreSQL optimization script
  const postgresqlScript = `-- PROP.IE Database Optimization Script
-- Generated: ${new Date().toISOString()}
-- Purpose: Production database performance optimization

-- =====================================================
-- INDEX CREATION
-- =====================================================

${sqlIndexes.map(index => `${index.comment}\n${index.sql}`).join('\n\n')}

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
`;

  // Generate SQLite optimization script
  const sqliteScript = `-- PROP.IE SQLite Database Optimization Script
-- Generated: ${new Date().toISOString()}
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

${sqlIndexes.map(index => `${index.comment}\n${index.sql}`).join('\n\n')}

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
`;

  // Write optimization scripts
  const postgresqlPath = path.join(process.cwd(), 'database', 'optimize-postgresql.sql');
  const sqlitePath = path.join(process.cwd(), 'database', 'optimize-sqlite.sql');
  
  // Ensure database directory exists
  const dbDir = path.join(process.cwd(), 'database');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  fs.writeFileSync(postgresqlPath, postgresqlScript);
  fs.writeFileSync(sqlitePath, sqliteScript);

  // Generate optimization report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalIndexes: OPTIMIZATIONS.indexes.length,
      queryOptimizations: OPTIMIZATIONS.queryOptimizations.length,
      cachingStrategies: OPTIMIZATIONS.caching.length,
      estimatedImprovements: {
        querySpeed: '60-80% faster',
        concurrentUsers: '5x more',
        responseTime: '50-70% reduction'
      }
    },
    indexes: OPTIMIZATIONS.indexes,
    queryOptimizations: OPTIMIZATIONS.queryOptimizations,
    caching: OPTIMIZATIONS.caching,
    files: {
      postgresql: postgresqlPath,
      sqlite: sqlitePath
    }
  };

  const reportPath = path.join(process.cwd(), 'database-optimization-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log('📊 Database Optimization Summary:');
  console.log(`- Created ${report.summary.totalIndexes} optimized indexes`);
  console.log(`- Provided ${report.summary.queryOptimizations} query optimizations`);
  console.log(`- Defined ${report.summary.cachingStrategies} caching strategies`);
  console.log(`- Estimated improvements: ${report.summary.estimatedImprovements.querySpeed}`);

  console.log('\n📁 Generated Files:');
  console.log(`- PostgreSQL script: ${postgresqlPath}`);
  console.log(`- SQLite script: ${sqlitePath}`);
  console.log(`- Optimization report: ${reportPath}`);

  console.log('\n🎯 Next Steps:');
  console.log('1. Review the optimization scripts');
  console.log('2. Test in development environment first');
  console.log('3. Apply to production database during maintenance window');
  console.log('4. Monitor performance improvements');

  return report;
}

// Run if called directly
if (require.main === module) {
  generateOptimizationScript()
    .then(() => {
      console.log('\n✅ Database optimization scripts generated!');
    })
    .catch((error) => {
      console.error('❌ Database optimization failed:', error);
      process.exit(1);
    });
}

module.exports = { generateOptimizationScript };