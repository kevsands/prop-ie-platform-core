# Generated GraphQL Types

This directory contains TypeScript types automatically generated from GraphQL schema files.

## About

These types are generated using GraphQL Code Generator based on the schema files in `src/lib/graphql/schemas/` and operations in the codebase.

## Usage

Import these types directly when working with GraphQL operations:

```typescript
import { User, UserQuery, UserQueryVariables } from 'src/types/generated/graphql';

// Use in GraphQL operations
const { data, loading, error } = useQuery<UserQuery, UserQueryVariables>(
  GET_USER_QUERY,
  { variables: { id: userId } }
);

// Type-safe access to query results
const user: User | null = data?.user;
```

## Generation

Types are automatically generated during the build process. You can also generate them manually:

```bash
npm run generate:types
```

To watch for changes and regenerate types:

```bash
npm run generate:types:watch
```

## Files

- `index.ts` - Main export file for all generated GraphQL types
- `schema.graphql` - Merged GraphQL schema used for generation
- `introspection.json` - JSON introspection result for tooling

## Notes

- Do not edit these files directly as they are automatically generated
- If you need to customize the TypeScript output, modify the `codegen.ts` configuration
- When adding new GraphQL operations, run the type generation to ensure type safety