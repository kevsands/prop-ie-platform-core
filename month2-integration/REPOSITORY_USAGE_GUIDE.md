# Repository Pattern Usage Guide

## Overview

This codebase implements the Repository Pattern to abstract database access and provide a clean, domain-specific interface for data operations. The repository pattern allows the application to work with domain entities without being concerned with the underlying data access technology.

This guide explains how to use repositories correctly in the application.

## Current Implementation

The codebase currently has two implementations of the Repository Pattern:

1. **SQL-based Repositories** (in `src/lib/db/repositories.ts`)
   - Use raw SQL queries with the `query` and `transaction` functions
   - Include caching layer using memory-based cache
   - Implement mappers for converting between domain entities and database records

2. **Prisma-based Repositories** (in `src/lib/db/repositories/*.ts`)
   - Use Prisma ORM for database access
   - Implement cleaner type safety with Prisma's generated types
   - Provide simpler API for complex queries

## Unified Repository Access

To simplify usage and facilitate a gradual migration from SQL to Prisma, we've introduced a Unified Repository pattern in `src/lib/db/unified-repository.ts`. This allows the application to work with repositories without knowing which implementation is being used.

### How to use Unified Repositories

Import repositories from the unified module:

```typescript
import { 
  userRepository, 
  developmentRepository,
  unitRepository,
  documentRepository,
  financialRepository
} from '../lib/db/unified-repository';

// Then use the repository
const user = await userRepository.findById('123');
```

## Repository Interface

All repositories implement a common set of base operations:

### Base Operations

```typescript
interface BaseRepository<T> {
  // Find a single entity by ID
  findById(id: string): Promise<T | null>;
  
  // Find multiple entities with optional pagination
  findAll(params: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
  }): Promise<T[]>;
  
  // Count entities with optional filtering
  count(where?: any): Promise<number>;
  
  // Create a new entity
  create(data: any): Promise<T>;
  
  // Update an existing entity
  update(id: string, data: any): Promise<T>;
  
  // Delete an entity
  delete(id: string): Promise<T>;
  
  // Execute operations in a transaction
  transaction<R>(callback: (tx: any) => Promise<R>): Promise<R>;
}
```

### Specialized Operations

Each repository also provides specialized operations for its domain:

#### UserRepository

```typescript
findByEmail(email: string): Promise<User | null>;
findWithPermissions(id: string): Promise<User | null>;
findByRole(role: string): Promise<User[]>;
getUserPermissions(userId: string): Promise<string[]>;
```

#### DevelopmentRepository

```typescript
findBySlug(slug: string): Promise<Development | null>;
findByDeveloperId(developerId: string): Promise<Development[]>;
findWithUnits(id: string): Promise<Development | null>;
findByFilters(filters: any, page?: number, pageSize?: number): Promise<any>;
```

#### UnitRepository

```typescript
findByDevelopmentId(developmentId: string): Promise<Unit[]>;
findByDevelopment(developmentId: string, filters?: any): Promise<Unit[]>;
findWithFullDetails(id: string): Promise<Unit | null>;
getCustomizationOptions(unitId: string, categoryFilter?: string): Promise<any[]>;
```

#### DocumentRepository

```typescript
findByUnitId(unitId: string): Promise<Document[]>;
findByDevelopmentId(developmentId: string): Promise<Document[]>;
findWithDetails(id: string): Promise<Document | null>;
findByType(type: string): Promise<Document[]>;
findByCategory(category: string): Promise<Document[]>;
```

#### FinancialRepository

```typescript
findByDevelopmentId(developmentId: string): Promise<DevelopmentFinance | null>;
findWithFullDetails(id: string): Promise<DevelopmentFinance | null>;
calculateFinancialSummary(financeId: string): Promise<any>;
```

## Transaction Support

Both repository implementations support transactions:

```typescript
// SQL-based transaction
await transaction(async (client) => {
  const result1 = await userRepository.create({ ... });
  const result2 = await developmentRepository.update('123', { ... });
  return result2;
});

// Prisma-based transaction
await prisma.$transaction(async (tx) => {
  const userRepo = new UserRepository(tx);
  const devRepo = new DevelopmentRepository(tx);
  
  const result1 = await userRepo.create({ ... });
  const result2 = await devRepo.update('123', { ... });
  return result2;
});

// Unified transaction (automatically uses the right approach)
import { repositoryFactory } from '../lib/db/unified-repository';

await prisma.$transaction(async (tx) => {
  const userRepo = repositoryFactory.getUserRepository();
  const devRepo = repositoryFactory.getDevelopmentRepository();
  
  const result1 = await userRepo.create({ ... });
  const result2 = await devRepo.update('123', { ... });
  return result2;
});
```

## Testing Repositories

For testing repositories, we provide mock implementations in `__tests__/db/mock-repositories.ts` that work with Jest mocks:

```typescript
// In your test file
import { mockDeep } from 'jest-mock-extended';
import { 
  UserRepository, 
  DevelopmentRepository 
} from '../../__tests__/db/mock-repositories';
import { PrismaClient } from '@prisma/client';

// Create a mock of the Prisma client
const prismaMock = mockDeep<PrismaClient>();

// Create repositories with mock Prisma client
const userRepository = new UserRepository(prismaMock);
const developmentRepository = new DevelopmentRepository(prismaMock);

// Mock responses
prismaMock.user.findUnique.mockResolvedValue({
  id: '1',
  email: 'test@example.com',
  // ...other fields
});

// Test repository methods
const result = await userRepository.findById('1');
expect(result).toEqual(expect.objectContaining({ id: '1' }));
expect(prismaMock.user.findUnique).toHaveBeenCalled();
```

## Migration Path

The codebase is gradually migrating from SQL-based repositories to Prisma-based repositories. To facilitate this transition:

1. Use the unified repository interface for all new code
2. Set `USE_PRISMA=true` in environment variables to switch to Prisma repositories
3. When adding new methods, implement them in both repository styles

## Best Practices

1. **Always use repositories** for database access, never access the database directly
2. **Keep domain logic out of repositories** - repositories should only handle data access
3. **Use transactions** for operations that need to be atomic
4. **Prefer Prisma repositories** for new code, as they provide better type safety
5. **Test repositories** with mock implementations to avoid database dependencies in tests