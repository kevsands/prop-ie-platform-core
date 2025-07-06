# Database Access Layer Implementation

This document outlines the implementation of a comprehensive database access layer using the Repository Pattern with Prisma ORM.

## Overview

The repository pattern provides an abstraction layer over the database operations, making the code more maintainable, testable, and consistent. The implementation uses Prisma as the ORM and includes support for transactions and proper error handling.

## Key Components

### 1. Base Repository

The `BaseRepository` class provides common CRUD operations for all entities:

```typescript
export abstract class BaseRepository<T, CreateInput, UpdateInput> {
  protected prisma: PrismaClient;
  protected abstract model: any;

  constructor(prismaClient: PrismaClient = prisma) {
    this.prisma = prismaClient;
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findUnique({
      where: { id },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
  }): Promise<T[]> {
    const { skip, take, where, orderBy } = params;
    
    return this.model.findMany({
      skip,
      take,
      where,
      orderBy,
    });
  }

  async count(where?: any): Promise<number> {
    return this.model.count({
      where,
    });
  }

  async create(data: CreateInput): Promise<T> {
    return this.model.create({
      data,
    });
  }

  async update(id: string, data: UpdateInput): Promise<T> {
    return this.model.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<T> {
    return this.model.delete({
      where: { id },
    });
  }

  async transaction<R>(callback: (tx: PrismaClient) => Promise<R>): Promise<R> {
    return this.prisma.$transaction(callback);
  }
}
```

### 2. Entity Repositories

Specialized repositories are implemented for each entity type, extending the BaseRepository:

- UserRepository
- DevelopmentRepository
- UnitRepository
- DocumentRepository
- FinancialRepository
- CustomizationRepository

Each repository adds entity-specific methods. For example, the UnitRepository includes:

```typescript
async findByDevelopmentId(developmentId: string): Promise<Unit[]> {
  return this.model.findMany({
    where: { developmentId },
  });
}

async findWithFullDetails(id: string): Promise<Unit | null> {
  return this.model.findUnique({
    where: { id },
    include: {
      rooms: true,
      outdoorSpaces: true,
      customizationOptions: true,
      documents: true,
    },
  });
}
```

### 3. Repository Factory

A factory function to get repository instances:

```typescript
export function getRepository<T extends RepositoryType>(type: T): InstanceType<typeof repositories[T]> {
  const RepositoryClass = repositories[type];
  return new RepositoryClass() as InstanceType<typeof repositories[T]>;
}
```

### 4. Transaction Support

The implementation includes robust transaction support to ensure data consistency:

```typescript
export async function createTransactionContext() {
  const { prisma } = await import('../index');
  
  return prisma.$transaction(async (tx) => {
    return {
      users: new UserRepository(tx),
      developments: new DevelopmentRepository(tx),
      units: new UnitRepository(tx),
      documents: new DocumentRepository(tx),
      financials: new FinancialRepository(tx),
    };
  });
}
```

## API Integration

The repository pattern is integrated with API routes to provide a consistent data access layer. For example:

### Units API

```typescript
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const developmentId = searchParams.get("developmentId");
    // ... other parameters ...

    // Get unit repository
    const unitRepository = getRepository("unit");
    
    // If specific unit ID is requested
    if (id) {
      const unit = await unitRepository.findWithFullDetails(id);
      // ... handle result ...
    }

    // Build filter object for repository query
    const filterParams = { ... };

    // Find units with filters
    const units = await unitRepository.findWithFilter(filterParams);

    // Get total count for pagination
    const totalCount = await unitRepository.count({ ... });

    return NextResponse.json({
      units,
      pagination: {
        total: totalCount,
        offset,
        limit
      }
    });
  } catch (error) {
    logger.error("Error fetching units:", { error });
    // ... error handling ...
  }
}
```

### Transaction Example in Customizations API

This demonstrates creating multiple related entities in a single transaction:

```typescript
// Execute in a transaction
try {
  // Create a transaction context with all repositories
  const tx = await createTransactionContext();
  
  // First, verify the sale exists and belongs to the user
  const sale = await tx.sales.findById(body.saleId);
  
  // ... validation logic ...
  
  // Create a customization package
  const customizationPackage = await tx.customizationPackages.create({
    // ... package data ...
  });
  
  // Process each selection and calculate total cost
  let totalAdditionalCost = 0;
  const createdSelections = [];
  
  for (const selection of body.selections) {
    // ... process each selection ...
    const createdSelection = await tx.customizationSelections.create({
      // ... selection data ...
    });
    
    createdSelections.push(createdSelection);
  }
  
  // Update the total cost of the package
  await tx.customizationPackages.update(customizationPackage.id, {
    totalAdditionalCost,
    updatedAt: new Date()
  });
  
  // Create a document record for the customization
  const document = await tx.documents.create({
    // ... document data ...
  });
  
  // Return the created package with selections
  return NextResponse.json({
    data: {
      customizationPackage: {
        ...customizationPackage,
        totalAdditionalCost
      },
      selections: createdSelections,
      document
    }
  }, { status: 201 });
} catch (error) {
  // Transaction automatically rolls back on error
  logger.error('Transaction failed:', { error });
  // ... error handling ...
}
```

## Benefits

1. **Abstraction**: The database access layer abstracts away the underlying ORM, making it easier to change or upgrade the ORM in the future.

2. **Consistency**: All database operations follow the same pattern, ensuring consistent error handling and data access.

3. **Transactions**: Built-in transaction support ensures data integrity when working with related entities.

4. **Type Safety**: The repository layer leverages TypeScript's type system for type-safe database operations.

5. **Testability**: The repository pattern makes it easier to mock database operations for testing.

6. **Reusability**: Common database operations are shared across repositories, reducing code duplication.

7. **Error Handling**: Consistent error handling with proper logging across all database operations.

## Testing

Two test scripts have been created to demonstrate the API usage:

1. `scripts/test-units-api.js`: Tests the Units API including creating, retrieving, updating, and deleting units with transaction support.

2. `scripts/test-customizations-api.js`: Tests the Customizations API, demonstrating the creation of a customization package with multiple selections in a single transaction.

## Conclusion

The repository pattern implementation with Prisma provides a robust database access layer for the application. It ensures data consistency, type safety, and proper error handling, making the application more maintainable and resilient.