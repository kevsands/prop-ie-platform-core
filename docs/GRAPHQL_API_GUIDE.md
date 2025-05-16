# PropIE GraphQL API Guide

This document provides comprehensive guidance on the PropIE GraphQL API architecture, including schema organization, authentication and authorization, resolver patterns, and testing strategies.

## Table of Contents

1. [API Architecture Overview](#api-architecture-overview)
2. [Schema Organization](#schema-organization)
3. [Authentication and Authorization](#authentication-and-authorization)
4. [Resolver Implementation](#resolver-implementation)
5. [Error Handling](#error-handling)
6. [Performance Optimization](#performance-optimization)
7. [Testing Strategy](#testing-strategy)
8. [Security Best Practices](#security-best-practices)
9. [API Versioning and Evolution](#api-versioning-and-evolution)

## API Architecture Overview

The PropIE GraphQL API is built on Apollo Server and integrated with Next.js API routes. It provides a flexible and type-safe interface for accessing PropIE data and services.

### Key Components

- **Apollo Server**: Handles GraphQL request processing
- **Next.js API Route**: Provides HTTP endpoint for GraphQL operations
- **AWS Amplify v6**: Manages authentication and token validation
- **PostgreSQL Database**: Stores application data
- **Schema Definition**: Strongly typed GraphQL schema
- **Resolvers**: Business logic for resolving GraphQL operations
- **Directives**: Schema-level functionality like auth enforcement

### Architecture Diagram

```
Client App
    │
    ▼
Next.js API Route (/api/graphql)
    │
    ▼
Apollo Server (GraphQL Engine)
    │
    ├─► Schema ◄─┐
    │            │
    ├─► Resolvers │
    │            │
    ├─► Directives
    │
    ▼
Authentication (AWS Amplify v6)
    │
    ▼
Data Sources (PostgreSQL/Prisma)
```

## Schema Organization

The GraphQL schema is organized in a modular fashion, with separate files for each domain entity.

### Schema Structure

- `base.graphql`: Core schema definitions, scalars, and directives
- `user.graphql`: User and authentication types
- `development.graphql`: Real estate development types
- `unit.graphql`: Property unit and customization types
- `document.graphql`: Document management types
- `sales.graphql`: Sales and transaction types
- `dashboard.graphql`: Dashboard and analytics types

### Type Design Principles

1. **Entity Types**: Core entity representations (User, Development, Unit, etc.)
2. **Input Types**: For operation parameters
3. **Response Types**: For structured responses with pagination
4. **Enum Types**: For limited choices
5. **Interface Types**: For shared properties
6. **Scalar Types**: Custom scalars for dates and structured data

### Type Example

```graphql
# Entity Type
type User {
  id: ID!
  email: String!
  firstName: String!
  lastName: String!
  fullName: String!
  roles: [Role!]!
  status: UserStatus!
  # other fields...
}

# Input Type
input CreateUserInput {
  email: String!
  firstName: String!
  lastName: String!
  roles: [Role!]!
  # other fields...
}

# Response Type
type UsersResponse {
  users: [User!]!
  totalCount: Int!
  pageInfo: PageInfo!
}

# Enum Type
enum UserStatus {
  PENDING
  ACTIVE
  SUSPENDED
  INACTIVE
}
```

## Authentication and Authorization

The API uses AWS Amplify v6 for authentication and implements a role-based authorization model.

### Authentication Flow

1. Client obtains a JWT token from AWS Cognito via Amplify
2. Token is included in the Authorization header
3. GraphQL context extracts and validates the token
4. User information is added to the GraphQL context
5. Resolvers access the authenticated user via context

### Authorization Models

1. **@auth Directive**: Schema-level permission enforcement
2. **Resolver Auth Checks**: Function-level permission enforcement
3. **Resource Ownership**: User-specific access control
4. **Role-Based Access**: Permission based on user roles

### Auth Directive Example

```graphql
type Query {
  # Requires any authenticated user
  me: User @auth
  
  # Requires admin role
  user(id: ID!): User @auth(requires: [ADMIN])
  
  # Requires developer role
  myDevelopments: DevelopmentsResponse @auth(requires: [DEVELOPER])
}
```

### Resolver Authorization Example

```typescript
// Check if user is authenticated
requireAuth(context);

// Check if user has specific role
requireRole(context, [UserRole.DEVELOPER, UserRole.ADMIN]);

// Check if user owns the resource
requireOwner(context, development.developerId);
```

## Resolver Implementation

Resolvers are organized by entity type and implement the business logic for resolving GraphQL operations.

### Resolver Structure

- **Query Resolvers**: For fetching data
- **Mutation Resolvers**: For modifying data
- **Type Resolvers**: For resolving fields on types
- **Helper Functions**: For reusable logic

### Resolver Pattern

1. **Input Validation**: Validate operation parameters
2. **Authorization Check**: Verify user permissions
3. **Business Logic**: Execute the operation
4. **Response Formatting**: Format the response

### Resolver Example

```typescript
// Query resolver
async development(_: any, { id }: { id: string }) {
  // Fetch the development
  const development = await developmentDb.getById(id);
  
  // Handle not found
  if (!development) {
    throw new NotFoundError('Development', id);
  }
  
  // Map to GraphQL type and return
  return mapDevelopmentToGraphQL(development);
}

// Mutation resolver
async createDevelopment(_: any, { input }: { input: CreateDevelopmentInput }, context: GraphQLContext) {
  // Check authorization
  requireRole(context, [UserRole.DEVELOPER, UserRole.ADMIN]);
  
  // Validate input
  if (!input.name) {
    throw new ValidationError('Name is required');
  }
  
  // Create development
  const developmentData = {
    name: input.name,
    developerId: context.user!.userId,
    // other fields...
  };
  
  const development = await developmentDb.create(developmentData);
  
  // Return the result
  return mapDevelopmentToGraphQL(development);
}
```

## Error Handling

The API implements standardized error handling to provide clear error messages and appropriate status codes.

### Error Types

- **AuthenticationError**: User is not authenticated
- **ForbiddenError**: User is not authorized
- **NotFoundError**: Resource not found
- **ValidationError**: Input validation failed
- **ApiError**: General API error

### Error Format

```json
{
  "errors": [
    {
      "message": "You are not authorized to perform this operation",
      "path": ["myDevelopments"],
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ]
}
```

### Error Handling Example

```typescript
try {
  // Operation logic
} catch (error) {
  if (error instanceof NotFoundError) {
    // Handle not found
  } else if (error instanceof ValidationError) {
    // Handle validation error
  } else {
    // Handle unexpected error
    console.error('Unexpected error:', error);
    throw new Error('An unexpected error occurred');
  }
}
```

## Performance Optimization

The API implements various performance optimizations to ensure efficient operation.

### Optimization Techniques

1. **Selective Field Resolution**: Resolving only requested fields
2. **Data Loader Pattern**: Batching and caching database queries
3. **Query Optimization**: Efficient database queries
4. **Result Caching**: Caching frequent operation results
5. **Pagination**: Efficient handling of large result sets

### Pagination Example

```graphql
query {
  developments(
    filter: { status: [CONSTRUCTION, SALES] }
    pagination: { first: 10, after: "dev-123" }
  ) {
    developments {
      id
      name
      status
    }
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
```

## Testing Strategy

The API includes a comprehensive testing strategy to ensure reliability and correctness.

### Testing Levels

1. **Unit Tests**: Testing individual resolvers
2. **Integration Tests**: Testing resolver chains
3. **E2E Tests**: Testing complete operations

### Testing Tools

- **Jest**: Test runner and assertion library
- **Apollo Server Testing**: GraphQL operation execution
- **Mock Context**: Simulated GraphQL context

### Test Example

```typescript
describe('Query.development', () => {
  it('should return a development by ID', async () => {
    // Create test server
    const testServer = await createTestServer();
    
    // Execute query
    const response = await testServer.executeOperation({
      query: DEVELOPMENT_QUERY,
      variables: { id: 'dev-123' },
    });
    
    // Check response
    expect(response.body.kind).toBe('single');
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.development).toMatchObject({
      id: 'dev-123',
      name: 'Sample Development',
      // other fields...
    });
  });
});
```

## Security Best Practices

The API implements various security best practices to protect against common vulnerabilities.

### Security Measures

1. **Input Validation**: Validating all user inputs
2. **Authentication**: Requiring valid tokens
3. **Authorization**: Enforcing proper permissions
4. **Query Complexity Analysis**: Preventing resource exhaustion
5. **Rate Limiting**: Preventing abuse
6. **Error Sanitization**: Preventing information leakage

### Security Example

```typescript
// Validate input
if (!input.email || !isValidEmail(input.email)) {
  throw new ValidationError('Valid email is required');
}

// Check authorization
requireRole(context, [UserRole.ADMIN]);

// Sanitize error messages
formatError: (formattedError) => {
  if (formattedError.extensions?.code === 'INTERNAL_SERVER_ERROR') {
    return {
      message: 'Internal server error',
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
      },
    };
  }
  return formattedError;
}
```

## API Versioning and Evolution

The API is designed to evolve while maintaining backward compatibility.

### Versioning Strategy

1. **Additive Changes**: Adding new fields and types
2. **Deprecation**: Marking fields as deprecated before removal
3. **Schema Directives**: Using directives to manage versioning
4. **GraphQL Aliasing**: Allowing clients to handle changes

### Deprecation Example

```graphql
type User {
  id: ID!
  email: String!
  firstName: String!
  lastName: String!
  # Deprecated field
  name: String @deprecated(reason: "Use firstName and lastName instead")
  # New fields
  fullName: String!
}
```

## Conclusion

This GraphQL API architecture provides a robust foundation for the PropIE application, with strong typing, proper authentication and authorization, efficient resolvers, and comprehensive testing. By following the patterns and practices outlined in this guide, developers can extend and maintain the API effectively.

For more specific implementation details, please refer to the codebase and the following resources:

- [Apollo Server Documentation](https://www.apollographql.com/docs/apollo-server/)
- [GraphQL Specification](https://spec.graphql.org/)
- [AWS Amplify Documentation](https://docs.amplify.aws/)