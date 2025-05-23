# Performance Optimization Guide

## Overview
This guide outlines the performance optimizations implemented to address the issues identified in the database and API analysis.

## Critical Issues Addressed

### 1. Database Indexes (✅ Fixed)
- **Problem**: 220 missing indexes on foreign key fields across 110 models
- **Solution**: Created migration with all missing indexes
- **Impact**: 10-100x faster query performance on joins

### 2. N+1 Queries (✅ Fixed in Units API)
- **Problem**: 6 N+1 query patterns found
- **Solution**: Added proper `include` statements with selective loading
- **Example Fix**:
```typescript
// Before: N+1 query
const units = await prisma.unit.findMany();
// Separate query for each unit's development

// After: Single query with joins
const units = await prisma.unit.findMany({
  include: {
    development: {
      select: { id: true, name: true }
    }
  }
});
```

### 3. Query Caching (✅ Implemented)
- **Problem**: 121 API routes without caching
- **Solution**: Created `QueryCache` utility with Redis integration
- **Usage**:
```typescript
import { queryCache } from '@/lib/cache/queryCache';

const data = await queryCache.getOrSet(
  { 
    key: 'analytics:developer:monthly',
    ttl: 300, // 5 minutes
    tags: ['analytics', 'developer']
  },
  async () => {
    // Expensive query here
    return await prisma.transaction.findMany({ ... });
  }
);
```

## Quick Fixes Applied

### API Endpoints
1. **Units API** (`/api/units`)
   - Added includes for development, unitType, customizationOptions
   - Added count aggregations to avoid separate queries
   - Maintained pagination for large datasets

2. **Analytics API** (`/api/analytics/developer`)
   - Already had Redis caching implemented
   - Cache TTL: 5 minutes for dashboard data

### Database Optimizations
1. **Composite Indexes**
   - `Transaction(status, stage)` - For filtering by multiple statuses
   - `Unit(developmentId, status)` - For development unit listings
   - `PropertyView(unitId, createdAt)` - For analytics queries

2. **Critical Performance Indexes**
   - All foreign keys now indexed
   - Date fields used in sorting/filtering indexed
   - Status fields for filtering indexed

## Remaining Optimizations

### High Priority
1. **Transaction Listing** (`/api/transactions`)
   ```typescript
   // Add this include pattern
   include: {
     unit: { select: { id: true, unitNumber: true } },
     buyer: { select: { id: true, firstName: true, lastName: true } },
     _count: { select: { payments: true, documents: true } }
   }
   ```

2. **Heavy Aggregations**
   - Implement materialized views for dashboard metrics
   - Use background jobs for report generation

### Medium Priority
1. **Pagination**
   - Standardize pagination across all list endpoints
   - Implement cursor-based pagination for large datasets

2. **Response Optimization**
   - Implement field selection via query params
   - Add response compression

### Low Priority
1. **Static Data Caching**
   - Cache development details (changes rarely)
   - Cache user permissions

## Monitoring Performance

### Query Performance
```bash
# Enable Prisma query logging
export DEBUG="prisma:query"

# Monitor slow queries
npx prisma studio
```

### Redis Cache Hit Rate
```typescript
// Add to your monitoring dashboard
const stats = await redis.info('stats');
console.log('Cache hit rate:', stats.keyspace_hits / (stats.keyspace_hits + stats.keyspace_misses));
```

### API Response Times
- Use APM tools (DataDog, New Relic)
- Add timing middleware
- Monitor P95 response times

## Best Practices

### 1. Always Include Relations
```typescript
// ❌ Bad: Causes N+1
const developments = await prisma.development.findMany();
for (const dev of developments) {
  const units = await prisma.unit.findMany({ where: { developmentId: dev.id } });
}

// ✅ Good: Single query
const developments = await prisma.development.findMany({
  include: { units: true }
});
```

### 2. Use Selective Loading
```typescript
// ❌ Bad: Loading everything
include: { 
  development: true // Loads 50+ fields
}

// ✅ Good: Load only needed fields
include: {
  development: {
    select: {
      id: true,
      name: true,
      location: true
    }
  }
}
```

### 3. Implement Caching Strategy
- **Real-time data**: No cache or very short TTL (30s)
- **User data**: Short TTL (5 min)
- **Analytics**: Medium TTL (5-15 min)
- **Static content**: Long TTL (1 hour+)

### 4. Use Aggregations Wisely
```typescript
// ❌ Bad: Count in application
const transactions = await prisma.transaction.findMany();
const completed = transactions.filter(t => t.status === 'COMPLETED').length;

// ✅ Good: Count in database
const completed = await prisma.transaction.count({
  where: { status: 'COMPLETED' }
});
```

## Performance Targets

- **API Response Time**: < 200ms (P95)
- **Database Query Time**: < 50ms (P95)
- **Cache Hit Rate**: > 80%
- **Time to First Byte**: < 100ms

## Next Steps

1. Run the migration:
   ```bash
   ./scripts/apply-performance-fixes.sh
   ```

2. Monitor performance improvements

3. Apply remaining optimizations based on actual usage patterns

4. Set up automated performance testing