# Test Utilities

This directory contains improved TypeScript-compatible test utilities to help with writing robust, type-safe tests.

## Overview

The utilities are organized into these main files:

- **app-router-test-utils.tsx**: Utilities for testing Next.js App Router components
- **environment-test-utils.ts**: Utilities for mocking environment variables
- **integration-test-utils.tsx**: Utilities for integration testing with React Query and fetching
- **repository-test-utils.ts**: Utilities for testing Prisma repositories with transaction support

## Key Features

### App Router Test Utilities

- Type-safe router and auth mock setup for Next.js App Router
- Strong typing for next/navigation features (router, searchParams, params)
- Improved rendering function with router and auth mocks included

```typescript
// Example usage
import { renderWithAppRouter } from './__tests__/helpers/app-router-test-utils';

const { router, searchParams, params, auth } = renderWithAppRouter(<YourComponent />, {
  routerOptions: {
    params: { id: '123' },
    searchParams: { filter: 'active' },
    pathname: '/dashboard',
  },
  authOptions: {
    isAuthenticated: true,
    user: { id: 'user-123', role: 'admin' }
  }
});

// Now you can make assertions about router actions
expect(router.push).toHaveBeenCalledWith('/some-path');
```

### Integration Test Utilities

- Support for React Query with pre-configured QueryClient
- Typed fetch API mocks
- Toast notification testing helpers
- Component state testing utilities

```typescript
// Example usage
import { renderForIntegration, mockFetch, waitForToast } from './__tests__/helpers/integration-test-utils';

// Mock fetch with typed responses
mockFetch<UserResponse>({ id: '123', name: 'Test User' });

// Render with all providers
const { queryClient } = renderForIntegration(<UserProfile userId="123" />);

// Wait for and assert on toast notifications
const successToast = await waitForToast('success');
expect(successToast).toHaveBeenCalledWith('Profile loaded');
```

### Repository Test Utilities

- Type-safe mocking of Prisma client
- Transaction testing support
- Error testing utilities

```typescript
// Example usage
import { testWithTransaction, mockPrismaClient } from './__tests__/helpers/repository-test-utils';

describe('UserRepository', () => {
  it('should create a user in a transaction', async () => {
    await testWithTransaction(async ({ tx }) => {
      // tx is a typed Prisma client mock
      tx.user.create.mockResolvedValueOnce({ id: '123', name: 'Test' });
      
      const result = await userRepository.createUser(tx, { name: 'Test' });
      expect(result.id).toBe('123');
      expect(tx.user.create).toHaveBeenCalled();
    });
  });
});
```

### Environment Test Utilities

- Type-safe environment variable mocking
- Standard test database configuration
- Enum-based configuration keys

```typescript
// Example usage
import { mockEnvironmentVariables, EnvKeys } from './__tests__/helpers/environment-test-utils';

describe('Database Service', () => {
  it('should connect with test credentials', () => {
    const restore = mockEnvironmentVariables({
      [EnvKeys.POSTGRES_HOST]: 'test-host',
      [EnvKeys.POSTGRES_PORT]: '5555'
    });
    
    // Test code here
    
    // Restore original environment
    restore();
  });
});
```

## Best Practices

1. Always use the most specific helper for your testing needs
2. Prefer the typed helpers over manually creating mocks
3. Clean up after your tests using the provided cleanup functions
4. Use interfaces like `UserMockData` instead of plain objects for better type safety
5. Leverage generic types for better type inference

## Implementation Details

These utilities have been upgraded to use:

- Proper TypeScript generics
- Interface-based typing
- Enum constants
- Return type annotations
- No type assertions where possible
- JSX element type safety