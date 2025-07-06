# Testing Guide

This document outlines the testing patterns and best practices used in the Prop IE AWS application.

## Table of Contents

1. [Testing Structure](#testing-structure)
2. [Testing Hooks](#testing-hooks)
3. [Testing GraphQL Operations](#testing-graphql-operations)
4. [Integration Testing](#integration-testing)
5. [Data Layer Testing](#data-layer-testing)
6. [Best Practices](#best-practices)
7. [Running Tests](#running-tests)
8. [Troubleshooting](#troubleshooting)

## Testing Structure

Our testing setup consists of several key components:

- **Jest**: The testing framework used for all tests
- **React Testing Library**: For testing React components and hooks
- **MSW (Mock Service Worker)**: For mocking HTTP and GraphQL requests
- **jest-mock-extended**: For mocking Prisma and other complex objects

Tests are organized into the following directories:

- `__tests__/`: Unit tests for components and functions
- `src/hooks/__tests__/`: Tests for React hooks
- `src/tests/integration/`: Integration tests for the data layer and GraphQL
- `src/tests/mocks/`: Mock data and handlers
- `src/tests/utils/`: Test utilities

## Testing Hooks

Hooks, especially those that interact with external services like GraphQL, require special handling. We've created a dedicated setup for testing hooks:

### Key Utilities

1. **`renderHookWithProviders`**: A wrapper around React Testing Library's `renderHook` that provides all necessary providers (QueryClient, etc.)
2. **`createTestQueryClient`**: Creates a query client configured for testing
3. **`mockAmplifyGraphQL`**: Mocks the AWS Amplify GraphQL client

### Example: Testing a GraphQL Hook

```tsx
import { renderHookWithProviders } from '../../tests/utils/hook-test-utils';
import { createGraphQLMock } from '../../tests/utils/graphql-test-utils';
import { server } from '../../tests/mocks/msw-setup';

describe('useDocuments', () => {
  beforeEach(() => {
    // Create a GraphQL mock instance
    const graphqlMock = createGraphQLMock();
    
    // Setup mock response
    graphqlMock.mockQuery(
      'GetDocuments', 
      { documents: { items: [], totalCount: 0 } }
    );
    
    // Apply mocks to server
    graphqlMock.applyMocks();
  });

  afterEach(() => {
    // Reset server handlers between tests
    server.resetHandlers();
  });
  
  it('should fetch documents with filters', async () => {
    // Render the hook with providers
    const { result } = renderHookWithProviders(() => 
      useDocuments({ projectId: 'test-project' })
    );
    
    // Wait for the query to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    // Make assertions
    expect(result.current.data).toBeDefined();
  });
});
```

## Testing GraphQL Operations

GraphQL operations can be tested using MSW (Mock Service Worker) to intercept requests:

### MSW v2 Setup

We use MSW version 2 for GraphQL and API mocking. The main components are:

1. **`src/tests/mocks/msw-setup.ts`**: Sets up the MSW server with global before/after hooks
2. **`src/tests/mocks/msw-handlers.ts`**: Defines default handlers for common API and GraphQL operations
3. **`src/tests/utils/graphql-test-utils.ts`**: Contains utilities for creating GraphQL mocks

### Key Utilities

1. **`createGraphQLMock`**: Creates a GraphQL mock handler for testing
2. **`mockQuery`/`mockMutation`**: Mock specific operations
3. **`mockQueryError`/`mockMutationError`**: Mock error responses

### Example: Mocking a GraphQL Query

```tsx
import { createGraphQLMock } from '../../tests/utils/graphql-test-utils';
import { server } from '../../tests/mocks/msw-setup';

// Create a new GraphQL mock instance
const graphqlMock = createGraphQLMock();

// Mock a successful query response
graphqlMock.mockQuery('GetDocuments', { 
  documents: { 
    items: [
      { id: 'doc-1', name: 'Test Document' }
    ], 
    totalCount: 1 
  }
});

// Mock a mutation with variable validation
graphqlMock.mockMutation(
  'UpdateDocument',
  { updateDocument: { id: 'doc-1', name: 'Updated Document' } },
  (variables) => variables.documentId === 'doc-1' // Only mock if variable matches
);

// Mock an error response
graphqlMock.mockQueryError(
  'GetUser',
  'User not found',
  'NOT_FOUND',
  404
);

// Apply all mocks to the server
graphqlMock.applyMocks();

// Reset server handlers after test
afterEach(() => {
  server.resetHandlers();
});
```

## Integration Testing

Integration tests verify that different parts of the application work together correctly:

### GraphQL Server Integration

We test the GraphQL schema, resolvers, and authorization logic using a test server:

```tsx
// Create a test server
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const server = new ApolloServer({
  schema,
});

// Test with different contexts
const adminContext = createTestContext('admin-user', [UserRole.ADMIN]);
const buyerContext = createTestContext('buyer-user', [UserRole.BUYER]);

// Execute operations with different contexts
const adminResponse = await server.executeOperation(
  { query: QUERY, variables },
  { contextValue: adminContext }
);

const buyerResponse = await server.executeOperation(
  { query: QUERY, variables },
  { contextValue: buyerContext }
);
```

## Data Layer Testing

The data layer (repositories, services) is tested with mocked Prisma client:

### Key Utilities

1. **`setupIntegrationTestContext`**: Creates a test context with repositories
2. **`mockPrismaCall`**: Mocks specific Prisma method calls
3. **`mockUserData`/`mockDevelopmentData`/etc.**: Generate test data

### Example: Testing a Repository

There are two approaches to repository testing:

#### 1. Using Mock Repository Implementation

```tsx
import { userRepository } from '../../tests/mocks/repositories';

describe('UserRepository (Mock Implementation)', () => {
  it('should find a user by ID', async () => {
    // Use the mock repository directly
    const user = await userRepository.findById('user-1');
    
    // Assertions
    expect(user).not.toBeNull();
    expect(user?.id).toBe('user-1');
    expect(user?.email).toBe('user1@example.com');
  });
  
  it('should create a new user', async () => {
    const newUser = await userRepository.create({
      email: 'new@example.com',
      firstName: 'New',
      lastName: 'User',
    });
    
    expect(newUser.id).toBeDefined();
    expect(newUser.email).toBe('new@example.com');
  });
});
```

#### 2. Using Mocked Prisma Client

```tsx
import { prismaMock } from '../mocks/prisma-mock';
import { UserRepository } from '../../lib/db/repositories/user-repository';

describe('UserRepository (Prisma Mock)', () => {
  it('should find a user by ID', async () => {
    // Create repository with mocked Prisma client
    const userRepo = new UserRepository(prismaMock);
    
    // Mock Prisma response
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      // ...other user properties
    });
    
    // Call repository method
    const result = await userRepo.findById('user-1');
    
    // Assertions
    expect(result).toBeDefined();
    expect(result.id).toBe('user-1');
    
    // Verify Prisma was called correctly
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'user-1' }
    });
  });
});
```

## Best Practices

### 1. Isolate Tests

- Each test should be independent and not rely on the state from other tests
- Use `beforeEach` to set up the test environment
- Reset mocks between tests

```tsx
beforeEach(() => {
  jest.clearAllMocks();
  server.resetHandlers();
});
```

### 2. Mock External Dependencies

- Use MSW to mock HTTP/GraphQL requests
- Use built-in mock repositories for data layer testing
- Use jest mocks for other external dependencies
- Avoid making real network requests in tests
- Prefer the `createGraphQLMock()` utility for GraphQL mocking

### 3. Test Both Success and Error Paths

- Test the happy path (success case)
- Test error handling
- Test edge cases

```tsx
it('should handle errors gracefully', async () => {
  // Create a GraphQL mock with error response
  const graphqlMock = createGraphQLMock();
  graphqlMock.mockQueryError('GetDocuments', 'Something went wrong');
  graphqlMock.applyMocks();
  
  // Rest of the test...
});
```

### 4. Use Type-Safe Mocks

- Ensure mocks match the expected types
- Use TypeScript to catch type errors in tests

### 5. Test User Interactions

- Test user interactions with `userEvent` from Testing Library
- Simulate real user behavior (click, type, etc.)

### 6. Use Snapshot Testing Sparingly

- Use snapshot testing for UI components that rarely change
- Prefer explicit assertions for behavior

## Running Tests

### Unit Tests

```bash
npm test
```

### Integration Tests

```bash
npm run test:integration
```

### Specific Test Files

```bash
npm test -- path/to/test
```

### Coverage Report

```bash
npm run test:coverage
```

## Troubleshooting

### Common Issues

1. **Tests are slow**: Use `--maxWorkers=4` to limit the number of workers

2. **Tests are flaky**: 
   - Check for timeouts or race conditions
   - Use `waitFor` for async operations
   - Check for memory leaks

3. **Mock not working**:
   - Ensure the mock is set up before the test
   - Check if the mock is being reset between tests
   - Verify the import path being mocked

### Debugging Tests

1. Use `console.log` statements in tests to debug
2. Run a single test with `--verbose` for detailed output
3. Use `--watch` to run tests whenever files change

```bash
npm test -- --watch --verbose path/to/test
```