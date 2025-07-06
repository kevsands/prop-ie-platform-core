# PROP.ie Database Schema Analysis & Consolidation Plan

## Current Schema State Analysis

### 📁 Existing Schema Files
1. **`prisma/schema.prisma`** - Main comprehensive schema (2000+ lines)
2. **`prisma/schema-ftb.prisma`** - First-time buyer extensions  
3. **`prisma/finance-schema.prisma`** - Financial modeling extensions
4. **`src/lib/db/schema.ts`** - Basic Drizzle schema (currently active but limited)

### ⚠️ Critical Issues Identified
- **Schema Fragmentation**: Three separate comprehensive Prisma schemas
- **Package Configuration Mismatch**: `package.json` references non-existent `schema-slp.prisma`
- **Client Configuration Gap**: App uses basic Drizzle schema instead of comprehensive Prisma models
- **Database Provider Inconsistency**: SQLite configured but PostgreSQL needed for production

## Schema Overlap & Conflict Analysis

### 🔄 Model Overlaps Found

#### User Management Models
**Main Schema (`schema.prisma`)**:
```prisma
model User {
  id           String     @id @default(cuid())
  email        String     @unique
  firstName    String
  lastName     String
  // ... comprehensive user model with relations
  buyerProfile      BuyerProfile?
  reservations      Reservation[]
  snagLists         SnagList[]
  mortgageTracking  MortgageTracking?
}
```

**FTB Schema Equivalent**:
```prisma
model BuyerJourney {
  id            String         @id @default(cuid())
  buyer         User           @relation(fields: [buyerId], references: [id])
  buyerId       String         @unique
  // ... enhanced buyer journey tracking
}
```

**Analysis**: 
- ✅ **Compatible**: Main schema has basic buyer profile, FTB schema extends with journey tracking
- 🔧 **Action Needed**: Merge FTB extensions into main User model relations

#### Property & Development Models
**Main Schema**:
```prisma
model Development {
  id              String    @id @default(cuid())
  name           String
  description    String?
  location       String
  // ... comprehensive development model
}

model Unit {
  id              String    @id @default(cuid())
  developmentId   String
  development     Development @relation(fields: [developmentId], references: [id])
  // ... comprehensive unit model
}
```

**FTB Schema Extensions**:
```prisma
model PropertyReservation {
  id                 String      @id @default(cuid())
  journey            BuyerJourney @relation(fields: [journeyId], references: [id])
  unit               Unit        @relation(fields: [unitId], references: [id])
  // ... reservation tracking
}
```

**Analysis**: 
- ✅ **Compatible**: FTB schema extends existing Unit model with reservations
- 🔧 **Action Needed**: Add FTB reservation relations to main schema

#### Financial Models
**Finance Schema**:
```prisma
model DevelopmentFinance {
  id                String      @id @default(cuid())
  development       Development @relation(fields: [developmentId], references: [id])
  developmentId     String      @unique
  projectCost       Decimal     @db.Decimal(12, 2)
  // ... comprehensive financial modeling
}
```

**Analysis**: 
- ✅ **No Conflicts**: Finance schema is purely additive
- 🔧 **Action Needed**: Integrate financial models into main schema

### 🎯 Consolidation Strategy

#### Phase 1: Schema Structure Analysis
```typescript
// CONSOLIDATED MODEL STRUCTURE PLAN

// Core Models (from main schema)
- User (comprehensive with all relations)
- Development (real estate projects)
- Unit (individual properties)
- Document (file management)
- Team/TeamMember (collaboration)

// Extended FTB Models (from FTB schema)
- BuyerJourney (extends User for FTB tracking)
- BuyerPhaseHistory (journey progression)
- AffordabilityCheck (financial calculations)
- MortgageApplication (loan tracking)
- PropertyReservation (extends Unit relations)

// Financial Models (from finance schema)  
- DevelopmentFinance (extends Development)
- FundingSource (development funding)
- CashFlowProjection (financial modeling)
- Investment (investor relations)
```

#### Phase 2: Conflict Resolution Matrix

| Model Type | Main Schema | FTB Schema | Finance Schema | Resolution Strategy |
|------------|-------------|------------|----------------|-------------------|
| User Management | ✅ Complete | 🔧 Extensions | ❌ N/A | Merge FTB extensions |
| Property Models | ✅ Complete | 🔧 Reservations | ❌ N/A | Add reservation relations |
| Financial Models | 🔧 Basic | 🔧 Buyer finance | ✅ Complete | Integrate finance models |
| Document Models | ✅ Complete | 🔧 Mortgage docs | 🔧 Financial docs | Extend document relations |

## Safety-First Consolidation Plan

### Step 1: Create Test Schema (Zero Risk)
```bash
# Create test schema without touching existing files
cp prisma/schema.prisma prisma/schema-unified-test.prisma
```

### Step 2: Incremental Model Integration
1. **Base Models** (Users, Development, Unit) - Already complete in main schema
2. **FTB Extensions** - Add BuyerJourney and related models
3. **Financial Extensions** - Add DevelopmentFinance and related models
4. **Cross-Relations** - Connect all models with proper foreign keys

### Step 3: Validation Strategy
```bash
# Validate each addition
npx prisma validate --schema=./prisma/schema-unified-test.prisma

# Generate test client
npx prisma generate --schema=./prisma/schema-unified-test.prisma
```

## Database Provider Migration Plan

### Current vs Target Configuration
```prisma
// CURRENT (Development)
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// TARGET (Production)
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Migration Strategy
1. **Maintain SQLite for development** during consolidation
2. **Create PostgreSQL configuration** for production
3. **Test migrations** on both providers
4. **Implement environment-based provider selection**

## Risk Mitigation Checklist

### ✅ Pre-Consolidation Safety
- [x] Full project backup created
- [ ] Git branch created: `feature/schema-consolidation`
- [ ] Current state tagged: `v1.0-pre-schema-merge`
- [ ] CLAUDE.md updated with consolidation documentation

### ✅ During Consolidation Safety
- [ ] Test schema created separately
- [ ] Each model addition validated individually
- [ ] TypeScript types generated and tested
- [ ] Rollback procedures documented

### ✅ Post-Consolidation Validation
- [ ] All existing API routes tested
- [ ] Component TypeScript compilation verified
- [ ] Database migration preview generated
- [ ] Performance impact assessed

## Next Steps

1. **Create Git Safety Branch** - Isolate all changes
2. **Build Test Schema** - Start with main schema as base
3. **Add FTB Models** - Integrate buyer journey extensions
4. **Add Financial Models** - Integrate comprehensive finance tracking
5. **Validate & Test** - Ensure everything compiles and works
6. **Update Application Configuration** - Switch from Drizzle to unified Prisma

## Expected Benefits Post-Consolidation

### 🚀 Unified Data Model
- Single source of truth for all stakeholder data
- Consistent TypeScript types across application
- Simplified API development and maintenance

### 🔧 Enhanced Capabilities
- Complete buyer journey tracking with financial modeling
- Integrated HTB management with development finance
- Comprehensive document management across all processes

### 🛡️ Production Readiness
- PostgreSQL support for scalability
- Proper foreign key constraints and data integrity
- Enterprise-grade financial transaction tracking

---

**Status**: Analysis Complete ✅  
**Next Action**: Create git safety branch and begin test schema creation