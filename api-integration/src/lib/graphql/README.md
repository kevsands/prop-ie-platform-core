# PropIE GraphQL API

This directory contains the implementation of the PropIE GraphQL API, which provides a flexible and type-safe interface for accessing PropIE data and services.

## Directory Structure

```
graphql/
├── directives/       # Schema directives
│   └── auth.ts       # Authentication directive
├── resolvers/        # GraphQL resolvers
│   ├── base.ts       # Base resolver utilities
│   ├── user.ts       # User resolvers
│   ├── development.ts # Development resolvers
│   └── index.ts      # Resolver aggregation
├── schemas/          # GraphQL schema definitions
│   ├── base.graphql  # Base schema
│   ├── user.graphql  # User schema
│   ├── development.graphql # Development schema
│   ├── unit.graphql  # Unit schema
│   ├── document.graphql # Document schema
│   ├── sales.graphql # Sales schema
│   └── dashboard.graphql # Dashboard schema
├── testing/          # Testing utilities
│   ├── testServer.ts # Test server setup
│   ├── userResolver.test.ts # User resolver tests
│   └── developmentResolver.test.ts # Development resolver tests
├── server.ts         # Apollo Server configuration
└── README.md         # This file
```

## Key Components

### Schema Definitions

Schema definitions are located in the `schemas/` directory, with each file containing type definitions for a specific domain entity. The main schema components include:

- **Types**: Data structures
- **Inputs**: Operation parameters
- **Queries**: Data retrieval operations
- **Mutations**: Data modification operations
- **Enums**: Enumerated values
- **Directives**: Schema-level functionality

### Resolvers

Resolvers are located in the `resolvers/` directory, with each file containing resolver implementations for a specific domain entity. The resolver structure includes:

- **Query Resolvers**: For retrieving data
- **Mutation Resolvers**: For modifying data
- **Type Resolvers**: For resolving fields on types
- **Helper Functions**: For common operations

### Server Configuration

The server configuration is located in `server.ts` and includes:

- **Apollo Server Setup**: Configuration for the GraphQL server
- **Context Building**: Creating the GraphQL context with authentication
- **Error Handling**: Formatting and logging errors
- **Performance Monitoring**: Tracking operation performance

### Authentication and Authorization

Authentication and authorization are implemented at multiple levels:

- **Context Building**: Extracting and validating tokens
- **Auth Directive**: Schema-level permission enforcement
- **Resolver Checks**: Function-level permission enforcement

## Getting Started

### Setting Up the Server

The GraphQL server is set up as a Next.js API route:

```typescript
// src/app/api/graphql/route.ts
import { createGraphQLHandler } from '@/lib/graphql/server';

const handler = createGraphQLHandler();

export const GET = handler;
export const POST = handler;
```

### Adding a New Entity

To add a new entity to the GraphQL API:

1. **Create a Schema File**: Add a new `.graphql` file in the `schemas/` directory
2. **Create a Resolver File**: Add a new `.ts` file in the `resolvers/` directory
3. **Update the Resolver Index**: Add the new resolver to `resolvers/index.ts`

### Example Entity Addition

```graphql
// schemas/newEntity.graphql
type NewEntity {
  id: ID!
  name: String!
  description: String
  createdAt: DateTime!
}

extend type Query {
  newEntity(id: ID!): NewEntity
  newEntities: [NewEntity!]!
}

extend type Mutation {
  createNewEntity(name: String!, description: String): NewEntity! @auth
}
```

```typescript
// resolvers/newEntity.ts
export const newEntityResolvers = {
  Query: {
    newEntity: async (_: any, { id }: { id: string }) => {
      // Implementation
    },
    newEntities: async () => {
      // Implementation
    },
  },
  Mutation: {
    createNewEntity: async (_: any, { name, description }: { name: string, description?: string }, context: GraphQLContext) => {
      // Implementation
    },
  },
};

export default newEntityResolvers;
```

## Testing

### Running Tests

Use the following npm scripts to run GraphQL API tests:

```bash
# Run all GraphQL tests
npm run test:graphql

# Run tests in watch mode
npm run test:graphql:watch

# Run tests with coverage
npm run test:graphql:coverage
```

### Writing Tests

To write tests for a new resolver:

1. Create a test file in the `testing/` directory
2. Use the `createTestServer()` function to create a test server
3. Write tests using Jest assertions

```typescript
// testing/newEntityResolver.test.ts
import { createTestServer, createAuthContext } from './testServer';

describe('NewEntity Resolvers', () => {
  let testServer;

  beforeEach(async () => {
    testServer = await createTestServer();
  });

  describe('Query.newEntity', () => {
    it('should return a new entity by ID', async () => {
      // Test implementation
    });
  });
});
```

## Best Practices

### Schema Design

- Use descriptive type and field names
- Include documentation comments
- Follow consistent naming conventions
- Design for future extensibility
- Use appropriate nullability

### Resolver Implementation

- Separate concerns (validation, authorization, business logic)
- Use helper functions for common operations
- Implement proper error handling
- Optimize performance for large datasets
- Add appropriate logging

### Security

- Validate all inputs
- Implement proper authentication checks
- Apply the principle of least privilege
- Sanitize error messages
- Protect against common GraphQL vulnerabilities

## Further Documentation

For more detailed documentation, please refer to:

- [GraphQL API Guide](../../docs/GRAPHQL_API_GUIDE.md): Comprehensive API documentation
- [API Documentation](../../API-DOCUMENTATION.md): General API documentation
- [Security Guide](../../SECURITY-GUIDE.md): Security best practices