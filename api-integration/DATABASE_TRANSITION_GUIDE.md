# PROP.ie Database Transition Guide

## Overview

This guide provides step-by-step instructions for transitioning from the current fragmented database configuration to a unified, enterprise-ready database architecture.

## Current State vs Target State

### Current State ❌
- **9 different schema files** with overlapping functionality
- **6-table SQLite database** with basic SLP tracking
- **Mock data usage** in development environment
- **Configuration inconsistencies** across environments
- **Package.json script mismatches** referencing non-existent schemas

### Target State ✅
- **Single unified schema** with 80+ comprehensive models
- **PostgreSQL production database** with full enterprise capabilities
- **Real data operations** replacing mock implementations
- **Consistent configuration** across all environments
- **Streamlined build process** with unified commands

## Transition Process

### Phase 1: Analysis and Backup (15 minutes)

#### Step 1.1: Run Configuration Analysis
```bash
# Analyze current database configuration
node scripts/database-config-manager.js analyze
```

This will provide:
- Complete inventory of schema files
- Database provider analysis
- Environment configuration review
- Issue identification
- Actionable recommendations

#### Step 1.2: Create Complete Backup
```bash
# Create backup of current state
node scripts/database-config-manager.js backup
```

Creates timestamped backup including:
- All schema files
- Existing SQLite databases
- Environment configuration files
- Package.json scripts

### Phase 2: Schema Consolidation (30 minutes)

#### Step 2.1: Validate Unified Schema
```bash
# Validate the new unified schema
node scripts/database-config-manager.js validate
```

Performs:
- Prisma syntax validation
- Client generation test
- Model relationship verification
- Type safety confirmation

#### Step 2.2: Update Package Scripts
```bash
# Update package.json to reference unified schema
node scripts/database-config-manager.js update-scripts
```

Updates all database-related scripts:
- `db:migrate` → Uses unified schema
- `db:studio` → Uses unified schema
- `db:generate` → Uses unified schema
- `db:seed` → Uses unified schema

#### Step 2.3: Update Environment Configuration

**For Development (.env.local):**
```bash
# SQLite for local development
DATABASE_URL="file:./dev.db"
SHADOW_DATABASE_URL="file:./shadow.db"
```

**For Production (.env.production):**
```bash
# PostgreSQL for production
DATABASE_URL="postgresql://username:password@hostname:5432/propie_production"
```

### Phase 3: Database Migration (45 minutes)

#### Step 3.1: Export Existing Data
```bash
# Export existing SLP data
sqlite3 prisma/dev.db .dump > existing-data-backup.sql
```

#### Step 3.2: Initialize New Database
```bash
# Generate Prisma client with unified schema
npx prisma generate --schema=./prisma/schema-unified.prisma

# Create initial migration
npx prisma migrate dev --name initial-unified-schema --schema=./prisma/schema-unified.prisma
```

#### Step 3.3: Migrate Existing Data
```bash
# Create data migration script
node scripts/migrate-existing-data.js
```

Migration process:
1. **Map SLP data** to new unified models
2. **Preserve transaction history** in new structure
3. **Create user records** for existing participants
4. **Establish proper relationships** between entities

### Phase 4: Application Integration (2 hours)

#### Step 4.1: Update Database Connection Layer

**Replace mock implementations:**
```typescript
// OLD: src/lib/mongodb.ts (mock implementation)
export class MongoClient {
  static async connect() {
    console.log('[MOCK] Connecting to MongoDB');
    // ... mock implementation
  }
}

// NEW: src/lib/db/connection.ts (real Prisma connection)
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});
```

#### Step 4.2: Update Data Service Layer

**Replace mock data service:**
```typescript
// OLD: src/lib/data-service/index.ts
const DataService = {
  async getCustomization(id: string) {
    return await mongodb.findOne('customizations', { _id: id });
  }
}

// NEW: Real Prisma implementation
const DataService = {
  async getCustomization(id: string) {
    return await prisma.customizationSelection.findUnique({
      where: { id },
      include: {
        selections: {
          include: {
            option: true
          }
        },
        unit: true,
        documents: true
      }
    });
  }
}
```

#### Step 4.3: Update API Routes

**Replace mock data with real database queries:**
```typescript
// OLD: Using mock data
export async function GET(request: NextRequest) {
  const mockData = [
    { id: 'prop1', name: 'Luxury Apartment', price: 350000 }
  ];
  return NextResponse.json(mockData);
}

// NEW: Using Prisma with unified schema
export async function GET(request: NextRequest) {
  const developments = await prisma.development.findMany({
    include: {
      location: true,
      units: {
        include: {
          customizationOptions: true,
          sales: true
        }
      },
      professionalTeam: true
    }
  });
  return NextResponse.json(developments);
}
```

### Phase 5: Testing and Validation (1 hour)

#### Step 5.1: Run Test Suite
```bash
# Run all tests with new database configuration
npm run test

# Run specific database tests
npm run test:db

# Run integration tests
npm run test:integration
```

#### Step 5.2: Validate Business Logic
```bash
# Test core functionality
node scripts/test-core-functionality.js

# Test API endpoints
node scripts/test-api-endpoints.js

# Test data consistency
node scripts/validate-data-integrity.js
```

#### Step 5.3: Performance Testing
```bash
# Test database performance
node scripts/test-database-performance.js

# Test query optimization
node scripts/analyze-query-performance.js
```

## Automated Transition Process

For a complete automated transition, run:

```bash
# Full consolidation process
node scripts/database-config-manager.js consolidate

# Dry run to preview changes
node scripts/database-config-manager.js consolidate --dry-run
```

## Rollback Procedure

If issues occur during transition:

### Step 1: Stop Application
```bash
# Stop development server
pkill -f "next dev"
```

### Step 2: Restore from Backup
```bash
# Find latest backup
ls -la database-backup/

# Restore specific backup
cp database-backup/backup-2025-06-16T*/schema.prisma prisma/
cp database-backup/backup-2025-06-16T*/dev.db prisma/
cp database-backup/backup-2025-06-16T*/.env ./
```

### Step 3: Restore Package Scripts
```bash
# If package.json.backup exists
cp package.json.backup package.json
```

### Step 4: Regenerate Client
```bash
# Regenerate with restored schema
npx prisma generate
```

## Post-Transition Benefits

### 1. Unified Data Model
- **Single source of truth** for all platform data
- **Consistent TypeScript types** across application
- **Simplified development** with unified API

### 2. Enterprise Capabilities
- **Complete buyer journey tracking** from interest to handover
- **Comprehensive financial modeling** with cash flow projections
- **Professional project management** with full audit trails
- **Investor relations management** with distribution tracking

### 3. Scalability
- **PostgreSQL production support** for high-volume operations
- **Proper indexing** for performance optimization
- **Transaction support** for data integrity
- **Multi-tenant ready** architecture

### 4. Development Experience
- **Real data in development** instead of mocks
- **Type-safe database operations** with Prisma
- **Simplified commands** with unified scripts
- **Better debugging** with actual data relationships

## Environment-Specific Configuration

### Development Environment
```bash
# .env.local
DATABASE_URL="file:./dev.db"
SHADOW_DATABASE_URL="file:./shadow.db"
NEXT_PUBLIC_USE_MOCK_DATA="false"
```

### Staging Environment
```bash
# .env.staging
DATABASE_URL="postgresql://user:pass@staging-db:5432/propie_staging"
NEXT_PUBLIC_USE_MOCK_DATA="false"
```

### Production Environment
```bash
# .env.production
DATABASE_URL="postgresql://user:pass@prod-db:5432/propie_production"
NEXT_PUBLIC_USE_MOCK_DATA="false"
NEXT_PUBLIC_SECURITY_ENHANCED="true"
```

## Common Issues and Solutions

### Issue: Migration Fails Due to Data Conflicts
**Solution:**
```bash
# Reset database and start fresh
npx prisma migrate reset --schema=./prisma/schema-unified.prisma
npx prisma db push --schema=./prisma/schema-unified.prisma
```

### Issue: Package Scripts Still Reference Old Schema
**Solution:**
```bash
# Re-run script update
node scripts/database-config-manager.js update-scripts
```

### Issue: Type Errors After Schema Change
**Solution:**
```bash
# Regenerate Prisma client
npx prisma generate --schema=./prisma/schema-unified.prisma

# Restart TypeScript server in IDE
# VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
```

### Issue: Performance Issues with Large Schema
**Solution:**
```bash
# Optimize with selective includes
const development = await prisma.development.findUnique({
  where: { id },
  select: {
    name: true,
    description: true,
    units: {
      select: {
        id: true,
        name: true,
        basePrice: true
      }
    }
  }
});
```

## Monitoring and Maintenance

### Database Health Checks
```bash
# Monitor database size
npx prisma db execute --stdin < scripts/check-db-size.sql

# Check query performance
node scripts/analyze-slow-queries.js

# Validate data integrity
node scripts/validate-relationships.js
```

### Regular Maintenance Tasks
1. **Weekly:** Run database integrity checks
2. **Monthly:** Analyze query performance and optimize
3. **Quarterly:** Review schema for new business requirements
4. **Annually:** Plan for scaling and performance improvements

## Support and Troubleshooting

### Debug Mode
```bash
# Enable Prisma debugging
DEBUG="prisma:*" npm run dev

# Enable query logging
DATABASE_URL="file:./dev.db?connection_limit=1&socket_timeout=3&pool_timeout=10"
```

### Getting Help
1. **Check logs:** Look at console output for Prisma errors
2. **Validate schema:** Run `npx prisma validate`
3. **Check migrations:** Review `prisma/migrations/` folder
4. **Test connectivity:** Use `scripts/test-database-connectivity.js`

---

**Status:** Ready for implementation  
**Estimated Total Time:** 4-5 hours  
**Risk Level:** Medium (with proper backup procedures)  
**Success Criteria:** All tests pass, real data operations work, no performance degradation