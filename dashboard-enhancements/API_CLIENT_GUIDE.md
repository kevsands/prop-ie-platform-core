# API Client Usage Guide

This guide explains how to effectively use the unified API client in the Prop IE AWS application, including authentication, error handling, and advanced features.

## Table of Contents

1. [Introduction](#introduction)
2. [Basic Usage](#basic-usage)
3. [Authentication](#authentication)
4. [Error Handling](#error-handling)
5. [Request Options](#request-options)
6. [GraphQL Support](#graphql-support)
7. [CSRF Protection](#csrf-protection)
8. [Performance Monitoring](#performance-monitoring)
9. [TypeScript Integration](#typescript-integration)
10. [Best Practices](#best-practices)

## Introduction

The unified API client provides a consistent interface for making API requests to both our REST and GraphQL endpoints. It integrates with AWS Amplify for authentication, handles errors consistently, and includes built-in security features.

### Key Features

- REST and GraphQL support
- Automatic authentication token handling
- Consistent error handling
- CSRF protection
- Performance monitoring
- Type safety with TypeScript

## Basic Usage

First, import the API client from the appropriate module:

```typescript
import { api } from '@/lib/api-client';
```

### HTTP Methods

The client supports all standard HTTP methods:

```typescript
// GET request
const users = await api.get('/users');

// POST request with data
const newUser = await api.post('/users', {
  name: 'John Doe',
  email: 'john@example.com'
});

// PUT request for update
await api.put(`/users/${userId}`, {
  name: 'John Updated'
});

// DELETE request
await api.delete(`/users/${userId}`);

// PATCH request for partial update
await api.patch(`/users/${userId}`, {
  status: 'active'
});
```

## Authentication

The API client automatically handles authentication for requests. By default, it:

1. Tries to get the JWT token from AWS Amplify Auth
2. Falls back to a stored token in localStorage if Amplify fails
3. Adds the token to the request as a Bearer token

### Authentication Options

You can control authentication behavior with the `requiresAuth` option:

```typescript
// Request with authentication (default)
const userData = await api.get('/users/me');

// Request without authentication
const publicData = await api.get('/public-data', { 
  requiresAuth: false 
});
```

## Error Handling

The API client standardizes error handling through the `ApiError` class. All API errors are wrapped in this class for consistent error handling.

```typescript
import { api, ApiError } from '@/lib/api-client';

try {
  const data = await api.get('/api/resource');
  // Handle successful response
} catch (error) {
  if (error instanceof ApiError) {
    // Type-safe error handling
    console.error(`API error (${error.statusCode}): ${error.message}`);
    
    // Handle specific status codes
    if (error.statusCode === 401) {
      // Handle unauthorized error
    } else if (error.statusCode === 404) {
      // Handle not found error
    }
    
    // Access additional error data
    console.error('Error details:', error.errorData);
  } else {
    // Handle other errors (network, etc.)
    console.error('Unexpected error:', error);
  }
}
```

### Common Error Status Codes

- `400` - Bad Request (invalid input)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (not authorized)
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity (validation errors)
- `500` - Server Error

## Request Options

The API client accepts various options to customize requests:

```typescript
await api.get('/api/users', {
  // Authentication
  requiresAuth: true,  // Whether to include auth token (default: true)
  
  // Request customization
  headers: {           // Additional headers to include
    'X-Custom-Header': 'value'
  },
  
  // URL parameters
  searchParams: {      // Query parameters
    page: 1,
    limit: 10,
    sort: 'name'
  },
  
  // Response handling
  parseResponse: true, // Whether to parse JSON response (default: true)
  
  // Amplify integration
  useAmplify: true     // Whether to use Amplify API (default: same as requiresAuth)
});
```

## GraphQL Support

The API client includes support for GraphQL queries through Amplify API:

```typescript
import { api } from '@/lib/api-client';

const query = `
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      name
      description
      status
      createdAt
      owner {
        id
        name
      }
    }
  }
`;

const variables = {
  id: 'project-123'
};

try {
  const data = await api.graphql(query, variables);
  console.log('Project:', data.project);
} catch (error) {
  console.error('GraphQL error:', error);
}
```

### GraphQL Options

```typescript
await api.graphql(
  query,
  variables,
  {
    // Auth mode override (default: AMAZON_COGNITO_USER_POOLS)
    authMode: 'API_KEY',
    
    // Additional options
    headers: {
      'X-Custom-Header': 'value'
    }
  }
);
```

## CSRF Protection

The API client automatically adds CSRF protection for state-changing operations (POST, PUT, DELETE, PATCH). This protection works by:

1. Getting the CSRF token from session storage
2. Adding it to the request header
3. Validating the token on the server

You don't need to manually handle CSRF tokens for API requests - it's done automatically.

## Performance Monitoring

For production environments, you can use the monitored version of the API client that tracks performance metrics:

```typescript
import { monitoredApi } from '@/lib/monitoring/apiPerformance';

// Use just like the regular API client
const data = await monitoredApi.get('/api/resources');

// The request will be automatically tracked for performance
```

### Available Metrics

```typescript
import { getApiPerformanceMetrics } from '@/lib/monitoring/apiPerformance';

const metrics = getApiPerformanceMetrics();
console.log('Average request duration:', metrics.averageDuration);
console.log('Success rate:', metrics.successRate);
console.log('Slow requests:', metrics.slowRequests);
```

## TypeScript Integration

The API client is fully typed with TypeScript generics for type-safe API interactions:

```typescript
// Define your API types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface CreateUserRequest {
  name: string;
  email: string;
  role: 'admin' | 'user';
}

// Type-safe API requests
const users = await api.get<User[]>('/api/users');
// users is typed as User[]

const newUser = await api.post<User, CreateUserRequest>(
  '/api/users', 
  { name: 'John', email: 'john@example.com', role: 'user' }
);
// newUser is typed as User
```

## Best Practices

1. **Always use the API client** for all API requests to ensure consistent security and error handling.

2. **Use TypeScript generics** to ensure type safety for request and response data.

3. **Handle errors properly** by catching and processing ApiError instances.

4. **Use the monitored API client** in production for better insights into API performance.

5. **Don't manually include auth tokens** - let the API client handle authentication.

6. **Keep API requests in service modules** rather than directly in components.

7. **Use searchParams for query parameters** instead of manually constructing URLs.

8. **Be explicit about requiresAuth** for public endpoints.

9. **Avoid unnecessary abstractions** on top of the API client.

10. **Use the GraphQL client** for AppSync APIs rather than implementing your own.

11. **Document API types** thoroughly for better team collaboration.

### Example: API Service Module

```typescript
// src/services/userService.ts
import { api } from '@/lib/api-client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  role: string;
}

export const userService = {
  getUsers: () => api.get<User[]>('/api/users'),
  
  getUser: (id: string) => api.get<User>(`/api/users/${id}`),
  
  createUser: (data: CreateUserRequest) => api.post<User>('/api/users', data),
  
  updateUser: (id: string, data: Partial<CreateUserRequest>) => 
    api.put<User>(`/api/users/${id}`, data),
  
  deleteUser: (id: string) => api.delete(`/api/users/${id}`)
};

// Usage in component
import { userService } from '@/services/userService';

async function loadUsers() {
  try {
    const users = await userService.getUsers();
    return users;
  } catch (error) {
    handleError(error);
    return [];
  }
}
```

This structure keeps API interaction logic in service modules, improving code organization and reusability.