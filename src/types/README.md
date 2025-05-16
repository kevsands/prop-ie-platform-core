# PropIE TypeScript Type System

This directory contains a comprehensive type system for the PropIE application. The type system is organized into several key areas to provide complete type safety across the application.

## Directory Structure

- **models/** - Core domain model interfaces representing business entities
- **api/** - API request/response types and error handling
- **utils/** - Utility types and type helpers
- **generated/** - Automatically generated types from GraphQL schema

## Usage Guide

### Domain Models

Import domain models directly when working with business entities:

```typescript
import { User, UserStatus, UserRole } from 'src/types/models';

// Type-safe user object
const user: User = {
  id: '123',
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  fullName: 'John Doe',
  roles: [UserRole.BUYER],
  status: UserStatus.ACTIVE,
  kycStatus: KYCStatus.APPROVED,
  created: new Date(),
  lastActive: new Date()
};
```

### API Types

Use API types when making requests and handling responses:

```typescript
import { ApiResponse, ApiErrorResponse } from 'src/types/api';
import { User } from 'src/types/models';

// Type-safe API response handling
const fetchUser = async (id: string): Promise<User> => {
  const response: ApiResponse<User> = await fetch(`/api/users/${id}`)
    .then(res => res.json());
  
  if (!response.success || !response.data) {
    throw response.error;
  }
  
  return response.data;
};
```

### Utility Types

Use utility types for common type patterns:

```typescript
import { DeepPartial, PaginatedResponse, AsyncState } from 'src/types/utils';
import { User } from 'src/types/models';

// Partial user for updates
const userUpdate: DeepPartial<User> = {
  firstName: 'Updated',
  preferences: {
    theme: 'dark'
  }
};

// Type-safe async state management
const [userState, setUserState] = useState<AsyncState<User>>({
  data: null,
  isLoading: false,
  error: null
});
```

### GraphQL Types

Use automatically generated GraphQL types for type-safe GraphQL operations:

```typescript
import { 
  GetUserQuery, 
  GetUserQueryVariables 
} from 'src/types/generated/graphql';

const { data, loading, error } = useQuery<GetUserQuery, GetUserQueryVariables>(
  GET_USER_QUERY,
  { variables: { id: userId } }
);

// Type-safe access to query results
const user = data?.user;
```

### Type Guards and Assertions

Use type guards and assertions to ensure type safety at runtime:

```typescript
import { User, isUser, assertUser } from 'src/types/models';

// Type guard usage
if (isUser(data)) {
  // data is confirmed to be User type here
  console.log(data.fullName);
}

// Type assertion usage
try {
  assertUser(data);
  // data is User type if no error is thrown
} catch (error) {
  console.error('Invalid user data:', error);
}
```

## Type Generation

The GraphQL types are automatically generated. To generate or update them:

```bash
npm run generate:types
```

To watch for schema changes and regenerate automatically:

```bash
npm run generate:types:watch
```

## Best Practices

1. **Always use the most specific type**
   - Import specific types rather than using generic `any` or `object` types

2. **Leverage type guards for runtime safety**
   - Use the provided type guards to validate data at runtime

3. **Use utility types for common patterns**
   - Use `DeepPartial<T>` for updates, `PaginatedResponse<T>` for lists, etc.

4. **Keep domain models in sync with the API**
   - Ensure domain models accurately reflect backend data structures

5. **Add type annotations to function parameters and return values**
   - Explicitly type function signatures for better IDE support and documentation