# React Query Imports Standardization Guide

## Overview
This document explains the standardization of React Query imports throughout the codebase. Due to changes in TanStack React Query v5+, we needed to update our import patterns to ensure type safety and proper functionality.

## Changes Made

### 1. Standardized Import Pattern
We've standardized to use non-modular imports from `@tanstack/react-query` for all React Query functionality:

```typescript
// Standard import pattern (used throughout the codebase)
import { 
  QueryClient, 
  QueryClientProvider,
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions
} from '@tanstack/react-query';
```

### 2. Fixed Spacing Issues
Fixed spacing issues in import statements:

```typescript
// Bad - spacing issue
import { UseQueryOptions }from '@tanstack/react-query';

// Fixed
import { UseQueryOptions } from '@tanstack/react-query';
```

### 3. ReactQueryDevtools Import
ReactQueryDevtools still requires a specific import path:

```typescript
// Standard pattern for devtools
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
```

## Key Files Modified

The following key files were updated:

1. `src/hooks/useGraphQL.ts` - Central GraphQL query hook 
2. `src/hooks/api/useDeveloperDashboardData.ts` - Dashboard data hooks
3. `src/components/QueryClientWrapper.tsx` - React Query context provider
4. `src/lib/react-query-config.ts` - Query client configuration
5. `src/hooks/useDocuments.ts` - Document management hooks
6. `src/hooks/useDeveloperDashboard.ts` - Developer dashboard data hooks

## TypeScript Configuration

We updated `tsconfig.json` to support proper module resolution and React Query's private identifiers:

1. Changed target from `es5` to `es2022`
2. Changed moduleResolution from `bundler` to `node`

## Automation

Created a script at `fix-react-query-imports.js` to automate these changes across all files.

## Troubleshooting

If TypeScript errors persist related to module paths:

1. Ensure your IDE is respecting the `tsconfig.json` and `jsconfig.json` settings
2. Try restarting the TypeScript server in your IDE
3. If paths with `@/` alias aren't resolving, check for path mappings in tsconfig.json

## Going Forward

When working with React Query:

1. Use standard imports from `@tanstack/react-query`
2. Avoid modular imports (like `/core` or `/react`) to maintain consistency
3. Keep devtools import from `@tanstack/react-query-devtools`