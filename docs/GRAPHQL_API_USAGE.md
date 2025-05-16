# PropIE GraphQL API Usage Guide

This document provides a detailed overview of how to use the GraphQL API layer across your application, including authentication integration, role-based query filtering, and component integration.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication Integration](#authentication-integration)
3. [Using GraphQL Fragments](#using-graphql-fragments)
4. [React Query Hooks](#react-query-hooks)
5. [Role-Based Access Control](#role-based-access-control)
6. [Component Integration](#component-integration)
7. [Best Practices](#best-practices)

## Getting Started

The PropIE GraphQL API provides a unified interface for accessing data across the application. It's designed to work seamlessly with Amplify v6 and React Query for optimal performance.

### Setting Up

The GraphQL API is pre-configured and integrated with the application. Here's how to use it:

```tsx
// Import the hooks you need
import { useDevelopments, useCreateDevelopment } from '@/hooks/api';

// Use query hooks in your component
function DevelopmentsList() {
  const { data, isLoading, error } = useDevelopments();
  
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading developments</p>;
  
  return (
    <div>
      {data?.developments.developments.map(dev => (
        <DevelopmentCard key={dev.id} development={dev} />
      ))}
    </div>
  );
}

// Use mutation hooks
function CreateDevelopmentForm() {
  const createDevelopment = useCreateDevelopment();
  
  const handleSubmit = async (formData) => {
    try {
      await createDevelopment.mutateAsync({ input: formData });
      // Success handling
    } catch (error) {
      // Error handling
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

## Authentication Integration

The GraphQL API is fully integrated with Amplify v6 authentication. Authentication tokens are automatically included with requests.

### Authenticated Requests

Authentication is handled automatically by the custom hooks. The access token is retrieved from Amplify and added to the GraphQL requests:

```tsx
// The hook automatically includes authentication
const { data } = useCurrentUser();
```

### Manual Authentication Integration

If you need to make a custom GraphQL query with authentication:

```tsx
import { executeAuthenticatedOperation } from '@/lib/graphql/auth-client';

// Example custom query
const myQuery = /* GraphQL */ `
  query GetCustomData {
    customData {
      id
      name
    }
  }
`;

// Execute with authentication
const result = await executeAuthenticatedOperation(myQuery);
```

## Using GraphQL Fragments

GraphQL fragments promote code reuse and consistency. They are designed to match component prop types for easy integration.

### Available Fragments

The system provides pre-defined fragments for common entities:

```tsx
// Import fragments
import { 
  developmentSummaryFragment,
  userSummaryFragment 
} from '@/lib/graphql/fragments';

// Use in a custom query
const customQuery = /* GraphQL */ `
  query GetDevelopmentWithOwner($id: ID!) {
    development(id: $id) {
      ...DevelopmentSummary
      developer {
        ...UserSummary
      }
    }
  }
  ${developmentSummaryFragment}
  ${userSummaryFragment}
`;
```

### Creating Custom Fragments

If you need a custom fragment for your component:

```tsx
// Define a fragment that matches your component props
const myComponentFragment = /* GraphQL */ `
  fragment MyComponentData on Development {
    id
    name
    status
    mainImage
    totalUnits
    availableUnits
  }
`;

// Use the fragment in queries
const myQuery = /* GraphQL */ `
  query GetDevelopments {
    developments {
      developments {
        ...MyComponentData
      }
    }
  }
  ${myComponentFragment}
`;
```

## React Query Hooks

The API layer provides React Query hooks for all common operations. These hooks handle loading states, caching, and error handling.

### Query Hooks

These hooks fetch data and handle loading, error, and success states:

```tsx
// Import the hook
import { useDevelopment } from '@/hooks/api';

// Use in component
function DevelopmentDetail({ id }) {
  const { 
    data, 
    isLoading, 
    isError, 
    error 
  } = useDevelopment(id);
  
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage error={error} />;
  
  const development = data.development;
  return <DevelopmentView development={development} />;
}
```

### Mutation Hooks

These hooks handle create, update, and delete operations:

```tsx
// Import the hook
import { useUpdateDevelopment } from '@/hooks/api';

// Use in component
function EditDevelopmentForm({ development }) {
  const updateDevelopment = useUpdateDevelopment();
  
  const handleSubmit = async (formData) => {
    try {
      const result = await updateDevelopment.mutateAsync({
        id: development.id,
        input: formData
      });
      // Success handling
    } catch (error) {
      // Error handling
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button 
        type="submit" 
        disabled={updateDevelopment.isLoading}
      >
        {updateDevelopment.isLoading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}
```

## Role-Based Access Control

The GraphQL API implements role-based access control at both the server and client levels.

### Server-Side Enforcement

On the server, the `@auth` directive enforces authentication and role requirements:

```graphql
type Query {
  # Requires any authenticated user
  me: User @auth
  
  # Requires a specific role
  users: [User!]! @auth(requires: [ADMIN])
  
  # Public query (no @auth directive)
  publicDevelopments: [DevelopmentSummary!]!
}
```

### Client-Side Filtering

Client-side role-based filtering is available for certain queries:

```tsx
import { developmentRoleFilter } from '@/lib/graphql/auth-client';

// Later in your component
const userRoles = ['BUYER']; // This would come from context
const filter = developmentRoleFilter(userRoles, { 
  status: 'SALES' 
});

// Use the filtered result
const { data } = useDevelopments(filter);
```

## Component Integration

GraphQL and React components integrate seamlessly through typed props and fragments.

### Component Data Loading

The recommended pattern for component data loading:

```tsx
// DevelopmentCard.tsx
interface DevelopmentCardProps {
  id: string;
}

export function DevelopmentCard({ id }: DevelopmentCardProps) {
  const { data, isLoading } = useDevelopment(id);
  
  if (isLoading) return <CardSkeleton />;
  if (!data?.development) return <ErrorCard />;
  
  return (
    <Card>
      <CardHeader title={data.development.name} />
      <CardContent>
        {/* Render development data */}
      </CardContent>
    </Card>
  );
}
```

### Container Pattern

For more complex components, use the container pattern:

```tsx
// DevelopmentDetailContainer.tsx
export function DevelopmentDetailContainer({ id }: { id: string }) {
  const { data, isLoading, error } = useDevelopment(id);
  
  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorDisplay error={error} />;
  if (!data?.development) return <NotFoundError />;
  
  return <DevelopmentDetail development={data.development} />;
}

// DevelopmentDetail.tsx (presentation component)
interface DevelopmentDetailProps {
  development: Development;
}

export function DevelopmentDetail({ development }: DevelopmentDetailProps) {
  return (
    <div>
      <h1>{development.name}</h1>
      {/* Pure presentation component */}
    </div>
  );
}
```

## Best Practices

Follow these practices for effective GraphQL usage:

1. **Use provided hooks**: Always prefer the pre-built hooks for standard operations.

2. **Fragment matching**: Design fragments to match component prop interfaces exactly.

3. **Minimal queries**: Only request the fields you need to improve performance.

4. **Error handling**: Always handle loading, error, and empty states.

5. **Authentication**: Let the built-in auth integration handle tokens; don't manage them manually.

6. **Cache invalidation**: After mutations, invalidate the appropriate query cache:

```tsx
const queryClient = useQueryClient();
const updateDevelopment = useUpdateDevelopment({
  onSuccess: () => {
    // Invalidate related queries
    queryClient.invalidateQueries(['development', developmentId]);
    queryClient.invalidateQueries(['developments']);
  }
});
```

7. **Optimistic updates**: For a better user experience, implement optimistic updates:

```tsx
const createDevelopment = useCreateDevelopment({
  onMutate: async (newDevelopment) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries(['developments']);
    
    // Snapshot previous value
    const previousDevelopments = queryClient.getQueryData(['developments']);
    
    // Optimistically update
    queryClient.setQueryData(['developments'], old => ({
      ...old,
      developments: [
        ...old.developments,
        { id: 'temp-id', ...newDevelopment }
      ]
    }));
    
    return { previousDevelopments };
  },
  onError: (err, newDevelopment, context) => {
    // On error, roll back to the previous value
    queryClient.setQueryData(
      ['developments'], 
      context.previousDevelopments
    );
  },
  onSettled: () => {
    // Always refetch after error or success
    queryClient.invalidateQueries(['developments']);
  }
});
```

8. **Prefetching**: For improved performance, prefetch related data:

```tsx
function DevelopmentsList() {
  const queryClient = useQueryClient();
  
  // Prefetch development details on hover
  const prefetchDevelopment = (id) => {
    queryClient.prefetchQuery(
      ['development', id],
      () => fetchDevelopment(id)
    );
  };
  
  return (
    <ul>
      {developments.map(dev => (
        <li 
          key={dev.id}
          onMouseEnter={() => prefetchDevelopment(dev.id)}
        >
          <Link to={`/developments/${dev.id}`}>{dev.name}</Link>
        </li>
      ))}
    </ul>
  );
}
```