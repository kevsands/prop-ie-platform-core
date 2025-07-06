# PropIE AWS App API

This README provides an overview of the API implementation for the PropIE AWS application, including setup instructions, usage examples, and best practices.

## 📋 Overview

The PropIE AWS App API provides a comprehensive set of endpoints for managing real estate development data, including:

- User management (developers, buyers, solicitors)
- Development projects
- Property units
- Sales processes
- Document management

## 🚀 Setup

To set up the API for development:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 📚 Documentation

Detailed documentation is available in the following files:

- **[API-DOCUMENTATION.md](./API-DOCUMENTATION.md)**: Comprehensive documentation of all API endpoints
- **[DATA-MODEL-USAGE-GUIDE.md](./DATA-MODEL-USAGE-GUIDE.md)**: Guide to using the data model and API infrastructure
- **[API-IMPLEMENTATION.md](./API-IMPLEMENTATION.md)**: Technical details of the API implementation

## 🔍 API Endpoints

The following API endpoints are available:

### Users API

```
GET    /api/users           # Get users with filtering
POST   /api/users           # Create a new user
PUT    /api/users           # Update an existing user
DELETE /api/users           # Delete a user
```

### Developments API

```
GET    /api/developments    # Get developments with filtering
POST   /api/developments    # Create a new development
PUT    /api/developments    # Update an existing development
DELETE /api/developments    # Delete a development
```

### Units API

```
GET    /api/units           # Get units with filtering
POST   /api/units           # Create a new unit
PUT    /api/units           # Update an existing unit
DELETE /api/units           # Delete a unit
```

### Sales API

```
GET    /api/sales           # Get sales with filtering
POST   /api/sales           # Create a new sale
PUT    /api/sales           # Update a sale
DELETE /api/sales           # Cancel a sale
```

### Documents API

```
GET    /api/documents       # Get documents with filtering
POST   /api/documents       # Create a new document
PUT    /api/documents       # Update document metadata
DELETE /api/documents       # Delete a document
```

## 🔌 Frontend Integration

### React Query Hooks

React Query hooks are provided for easy frontend integration:

```tsx
import { useDevelopments, useCreateUnit } from '../hooks/api-hooks';

// Example component using the hooks
const DevelopmentPage = () => {
  // Fetch developments with filtering
  const { data, isLoading, isError } = useDevelopments({
    status: 'CONSTRUCTION',
    page: 1,
    limit: 10
  });

  // Mutation to create a new unit
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
    });
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading developments</p>;

  return (
    <div>
      <h1>Developments</h1>
      <ul>
        {data?.data.map(development => (
          <li key={development.id}>{development.name}</li>
        ))}
      </ul>
      <button onClick={handleCreateUnit} disabled={isPending}>
        Add Unit
      </button>
    </div>
  );
};
```

### Direct API Client

For more advanced use cases, a direct API client is available:

```tsx
import { api } from '../lib/api';

// Example function using the API client
const fetchDevelopments = async () => {
  try {
    const response = await api.developments.getDevelopments({
      status: 'CONSTRUCTION',
      page: 1,
      limit: 10
    });
    return response;
  } catch (error) {
    console.error('Error fetching developments:', error);
    throw error;
  }
};
```

## 🧪 Testing

The API endpoints can be tested using the provided integration tests:

```bash
npm test
```

These tests use Jest and mock services to test the API endpoints in isolation.

## 📐 Architecture

The API follows a layered architecture:

```
UI Components → React Query Hooks → API Client → API Routes → Service Layer → Database
```

This architecture ensures separation of concerns and maintainability.

## 🔒 Authentication and Authorization

The API uses Next Auth for authentication and role-based access control for authorization. Protected endpoints check for the appropriate user role before allowing access.

## ✅ Best Practices

When working with the API, follow these best practices:

1. **Use TypeScript Types**: All API operations are fully typed for better code completion and error checking.
2. **Handle Loading States**: Always handle loading states in your UI to provide feedback to users.
3. **Handle Error States**: Always handle error states to provide useful feedback when operations fail.
4. **Use React Query**: Prefer React Query hooks over direct API calls for better caching and state management.
5. **Include Validation**: Validate data on both the client and server sides to ensure data integrity.
6. **Follow REST Principles**: Use the appropriate HTTP methods for each operation (GET, POST, PUT, DELETE).
7. **Use Pagination**: For endpoints that return lists, always use pagination to limit the amount of data returned.