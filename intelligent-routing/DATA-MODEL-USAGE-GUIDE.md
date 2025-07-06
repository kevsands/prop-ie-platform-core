# PropIE AWS App Data Model Usage Guide

This guide explains how to use the comprehensive data model and API infrastructure that has been implemented for the PropIE AWS application.

## Overview

The data model and API infrastructure consists of several key components:

1. **TypeScript Interfaces** - Type definitions for all entities and their relationships
2. **Prisma Schema** - Database schema that maps to TypeScript interfaces
3. **API Routes** - RESTful endpoints for CRUD operations on all entities
4. **API Service** - Central TypeScript API client for all backend interactions
5. **React Query Hooks** - Specialized hooks for data fetching with caching and state management
6. **Example Components** - Reference implementations showing how to use the hooks

## Data Model

The data model consists of the following core entities:

- **Users** - Developers, buyers, solicitors, and other users
- **Developments** - Property development projects
- **Units** - Individual properties within developments
- **Sales** - Sales processes for units
- **Documents** - Document management for all entities

## API Usage

### Central API Client

The central API client provides a type-safe way to interact with all API endpoints. It's located at `src/lib/api.ts` and can be imported as follows:

```typescript
import { api } from '../lib/api';
```

Example usage:

```typescript
// Get developments with filtering
const developmentsResponse = await api.developments.getDevelopments({
  status: 'CONSTRUCTION',
  search: 'riverside',
  page: 1,
  limit: 10
});

// Create a new unit
const newUnit = await api.units.createUnit({
  developmentId: 'dev-123',
  name: 'Unit A1',
  type: 'APARTMENT',
  status: 'AVAILABLE',
  bedrooms: 2,
  bathrooms: 2,
  area: 95,
  price: 350000
});
```

### React Query Hooks

React Query hooks provide a more React-friendly way to interact with the API, with built-in caching, refetching, and error handling. They're located at `src/hooks/api-hooks.ts` and can be imported as follows:

```typescript
import { useDevelopments, useCreateUnit } from '../hooks/api-hooks';
```

Example usage:

```typescript
// Fetch developments with filtering
const { data, isLoading, isError, error } = useDevelopments({
  status: 'CONSTRUCTION',
  search: 'riverside',
  page: 1,
  limit: 10
});

// Create a new unit
const { mutate: createUnit, isPending } = useCreateUnit();

const handleCreateUnit = () => {
  createUnit({
    developmentId: 'dev-123',
    name: 'Unit A1',
    type: 'APARTMENT',
    status: 'AVAILABLE',
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
    price: 350000
  }, {
    onSuccess: (newUnit) => {
      console.log('Unit created:', newUnit);
    },
    onError: (error) => {
      console.error('Failed to create unit:', error);
    }
  });
};
```

## Available API Endpoints

### Users API

- `GET /api/users` - Get users with filtering
- `POST /api/users` - Create a new user
- `PUT /api/users` - Update an existing user
- `DELETE /api/users` - Delete a user

### Units API

- `GET /api/units` - Get units with filtering
- `POST /api/units` - Create a new unit
- `PUT /api/units` - Update an existing unit
- `DELETE /api/units` - Delete a unit

### Sales API

- `GET /api/sales` - Get sales with filtering
- `POST /api/sales` - Create a new sale
- `PUT /api/sales` - Update a sale (status, deposit, notes)
- `DELETE /api/sales` - Cancel a sale

### Documents API

- `GET /api/documents` - Get documents with filtering
- `POST /api/documents` - Create a new document
- `PUT /api/documents` - Update document metadata
- `DELETE /api/documents` - Delete a document

### Developments API

- `GET /api/developments` - Get developments with filtering
- `POST /api/developments` - Create a new development
- `PUT /api/developments` - Update an existing development
- `DELETE /api/developments` - Delete a development

## Available React Query Hooks

### User Hooks

- `useUsers(params?)` - Get users with filtering
- `useUser(id)` - Get a single user by ID
- `useCreateUser()` - Create a new user
- `useUpdateUser()` - Update an existing user
- `useDeleteUser()` - Delete a user

### Unit Hooks

- `useUnits(params?)` - Get units with filtering
- `useUnit(id)` - Get a single unit by ID
- `useCreateUnit()` - Create a new unit
- `useUpdateUnit()` - Update an existing unit
- `useDeleteUnit()` - Delete a unit

### Sale Hooks

- `useSales(params?)` - Get sales with filtering
- `useSale(id)` - Get a single sale by ID
- `useCreateSale()` - Create a new sale
- `useUpdateSaleStatus()` - Update a sale's status
- `useRecordDeposit()` - Record a deposit payment
- `useAddSaleNote()` - Add a note to a sale
- `useCancelSale()` - Cancel a sale

### Document Hooks

- `useDocuments(params?)` - Get documents with filtering
- `useDocument(id)` - Get a single document by ID
- `useCreateDocument()` - Create a new document
- `useUpdateDocument()` - Update document metadata
- `useDeleteDocument()` - Delete a document

### Development Hooks

- `useDevelopments(params?)` - Get developments with filtering
- `useDevelopment(id)` - Get a single development by ID
- `useCreateDevelopment()` - Create a new development
- `useUpdateDevelopment()` - Update an existing development
- `useDeleteDevelopment()` - Delete a development

## Example Implementation

An example implementation is provided at `src/components/examples/DevelopmentList.tsx` and can be viewed at `/examples/developments`. This example demonstrates:

1. Fetching data with React Query hooks
2. Implementing filtering and pagination
3. Handling loading and error states
4. Performing mutations (delete operation)
5. Using UI components with the data model

## Error Handling

The API client and React Query hooks include built-in error handling. API errors are returned with a consistent structure:

```typescript
{
  error: {
    code: 'ERROR_CODE',
    message: 'Human-readable error message',
    details: {}  // Optional additional error details
  }
}
```

In the React Query hooks, errors are handled automatically and can be accessed via the `error` property:

```typescript
const { data, isLoading, isError, error } = useDevelopments();

if (isError) {
  console.error('Error loading developments:', error.message);
}
```

## Best Practices

1. **Use TypeScript Types** - All API operations are fully typed for better code completion and error checking.
2. **Handle Loading States** - Always handle loading states in your UI to provide feedback to users.
3. **Handle Error States** - Always handle error states to provide useful feedback when operations fail.
4. **Use React Query for Frontend** - Prefer React Query hooks over direct API calls for better caching and state management.
5. **Use Query Keys** - React Query uses query keys for caching. The hooks handle this automatically, but you can access them via `queryKeys` if needed.
6. **Invalidate Queries** - When mutating data, invalidate relevant queries to ensure the UI stays in sync. The mutation hooks handle this automatically.
7. **Batch Queries** - Use `useQueries` from React Query to batch multiple queries if needed.

## Further Information

For more detailed information, see:

- **API Documentation** - See `API-DOCUMENTATION.md` for detailed API specifications
- **Data Model Interfaces** - See files in `src/types` for TypeScript interface definitions
- **Database Schema** - See `prisma/schema.prisma` for the database schema
- **API Routes** - See files in `src/app/api` for API route implementations
- **Services** - See files in `src/lib/services` for service implementations
- **React Query Hooks** - See `src/hooks/api-hooks.ts` for React Query hook implementations