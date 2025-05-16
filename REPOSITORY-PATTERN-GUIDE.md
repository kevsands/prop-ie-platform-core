# Repository Pattern Usage Guide

This guide explains how to use the repository pattern in the PropIE AWS application, which supports both SQL and Prisma approaches.

## Overview

The application's data access layer is in transition from direct SQL queries to Prisma ORM. During this transition, both approaches are supported:

1. **Legacy SQL Approach**: Uses `Pool` from `pg` package with direct SQL queries
2. **New Prisma Approach**: Uses `PrismaClient` with type-safe queries

## Repository Structure

The repositories are organized as follows:

```
src/lib/db/
├── connection.ts        # Database connection (Prisma + SQL)
├── index.ts             # Main entry point for data access
├── repositories.ts      # Legacy SQL repositories
├── repositories/        # Prisma-based repositories
│   ├── base-repository.ts
│   ├── user-repository.ts
│   ├── development-repository.ts
│   └── ...
└── testing/             # Mock repositories for testing
    └── mock-repositories.ts
```

## Using Repositories

### Accessing Repositories

```typescript
// For SQL-based repositories (will show deprecation warnings)
import { userDb, developmentDb } from '../../lib/db';

// For Prisma-based repositories
import { UserRepository } from '../../lib/db/repositories/user-repository';
import { prisma } from '../../lib/db/connection';

const userRepository = new UserRepository(prisma);
```

### Performing Operations

**SQL-based approach (legacy):**

```typescript
import { query, transaction } from '../lib/db';

// Direct query
const result = await query('SELECT * FROM users WHERE email = $1', [email]);
const user = result.rows[0];

// Transaction
await transaction(async (client) => {
  await client.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email]);
  await client.query('INSERT INTO profiles (user_id, bio) VALUES ($1, $2)', [userId, bio]);
});
```

**Prisma-based approach (recommended):**

```typescript
import { prisma } from '../lib/db/connection';
import { UserRepository } from '../lib/db/repositories/user-repository';

const userRepository = new UserRepository(prisma);

// Find by ID
const user = await userRepository.findById('user-123');

// Find by email
const userByEmail = await userRepository.findByEmail('user@example.com');

// Create a new user
const newUser = await userRepository.create({
  email: 'new@example.com',
  firstName: 'New',
  lastName: 'User',
  // other fields...
});

// Transaction
await prisma.$transaction(async (tx) => {
  const txUserRepo = new UserRepository(tx);
  const user = await txUserRepo.create({ /* user data */ });
  
  const txDevRepo = new DevelopmentRepository(tx);
  await txDevRepo.create({ /* development data */ });
});
```

## Testing with Repositories

When writing tests, use the mock repositories:

```typescript
import { mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { UserRepository } from '../../src/lib/db/testing/mock-repositories';

// Create a mock of the Prisma client
const prismaMock = mockDeep<PrismaClient>();

// Create a repository with the mock
const userRepository = new UserRepository(prismaMock);

// Setup mock response
prismaMock.user.findUnique.mockResolvedValue({
  id: 'user-123',
  email: 'test@example.com',
  // other fields...
});

// Test your function
const result = await userRepository.findById('user-123');
expect(result).toEqual(/* expected value */);
```

## Migration Plan

1. **Short-term (Current)**: Both SQL and Prisma approaches work side-by-side
2. **Mid-term**: Gradually replace SQL-based code with Prisma equivalents
3. **Long-term**: Remove deprecated SQL functions once all code is migrated

## Best Practices

1. **For new code**: Always use Prisma repositories
2. **For existing code**: Add a TODO to migrate to Prisma repositories
3. **For testing**: Use the mock repositories in `src/lib/db/testing`
4. **For transactions**: Prefer Prisma transactions with `prisma.$transaction`

## Note on Deprecation Warnings

When using SQL-based functions like `query`, `transaction`, or `getPool`, you'll see deprecation warnings in the console. These warnings guide you toward the Prisma-based approach.