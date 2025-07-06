# Database Module

This module implements a repository pattern for database access in the PropIE AWS application. The repository pattern abstracts database operations and provides a clean, consistent interface for accessing data.

## Architecture

The database module consists of:

1. **Prisma Client**: Core ORM for database access
2. **Repository Pattern**: Abstraction for data operations
3. **Transaction Support**: Ensures data integrity for multi-step operations
4. **Legacy Support**: Backward compatibility with existing code

## Repository Pattern

The repository pattern provides several benefits:

- **Abstraction**: Shields application code from database implementation details
- **Testability**: Simplifies testing with mock repositories
- **Consistency**: Provides a consistent API for all database operations
- **Composability**: Allows repositories to be composed into larger workflows
- **Type Safety**: Leverages TypeScript for type-safe database access

### Repository Structure

Each repository extends the `BaseRepository` class, which provides common CRUD operations:

- `findById`: Get an entity by ID
- `findAll`: Get all entities, with optional filtering
- `count`: Count entities, with optional filtering
- `create`: Create a new entity
- `update`: Update an existing entity
- `delete`: Delete an entity

Entity-specific repositories then add custom methods relevant to that domain:

```typescript
// Example: UserRepository
class UserRepository extends BaseRepository<User> {
  // Common operations from BaseRepository
  // findById, findAll, count, create, update, delete

  // User-specific operations
  async findByEmail(email: string): Promise<User | null> { ... }
  async findWithPermissions(userId: string): Promise<User & { permissions: UserPermission[] }> { ... }
  async addPermission(userId: string, permission: string): Promise<UserPermission> { ... }
}
```

## Transaction Support

Repositories support transactions for multi-step operations that need to succeed or fail as a unit. Transactions ensure data integrity and consistency.

### Transaction Usage

```typescript
// Import necessary repositories
import { createTransactionContext } from './repositories';

// Example: Create a development with units in a single transaction
async function createDevelopmentWithUnits(developmentData, units) {
  return await createTransactionContext(async (ctx) => {
    // All operations in this function share the same transaction
    
    // Create development
    const development = await ctx.developments.create(developmentData);
    
    // Create units linked to the development
    const createdUnits = [];
    for (const unitData of units) {
      const unit = await ctx.units.create({
        ...unitData,
        developmentId: development.id
      });
      createdUnits.push(unit);
    }
    
    // If any operation fails, the entire transaction is rolled back
    // If all succeed, the transaction is committed
    
    return {
      development,
      units: createdUnits
    };
  });
}
```

## Testing

The repository pattern makes testing easier by allowing repositories to be mocked. The test utilities provide helpers for testing repositories, both individually and in transactions.

### Example Test

```typescript
import { testWithTransaction } from '../helpers/repository-test-utils';

// Test a function that uses multiple repositories in a transaction
it('should create related entities in a transaction', async () => {
  await testWithTransaction(async ({ 
    userRepository, 
    developmentRepository 
  }) => {
    // Test code here
    const user = await userRepository.create({...});
    const dev = await developmentRepository.create({...});
    
    // Assertions
    expect(user.id).toBeDefined();
    expect(dev.developerId).toBe(user.id);
  });
});
```

## Usage Guidelines

1. **Use Repository Classes**: Always use repository classes for database operations instead of direct Prisma client access.

2. **Use Transactions**: For operations that affect multiple entities, use transactions to ensure data consistency.

3. **Testing**: When testing repository operations, use the test utilities to mock the Prisma client.

4. **Entity DTOs**: Use DTOs to map between database models and API responses.

5. **Error Handling**: Properly handle database errors and provide meaningful error messages.

## Migration from Legacy Code

The module maintains compatibility with existing code through the legacy database interface. New code should use the repository pattern, while existing code can continue to use the legacy interface until migration is complete.

## Example Usage

```typescript
import { UserRepository, DevelopmentRepository } from '../lib/db/repositories';

async function getUserDevelopments(userId: string) {
  const userRepository = new UserRepository();
  const developmentRepository = new DevelopmentRepository();
  
  // Get user
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  // Get developments for user
  const developments = await developmentRepository.findAll({
    developerId: userId
  });
  
  return {
    user,
    developments
  };
}
```