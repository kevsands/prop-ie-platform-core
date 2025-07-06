# API Client Usage Guide

This document provides examples and best practices for using the unified API client in the Prop.ie AWS application.

## Introduction

The unified API client (`src/lib/api-client.ts`) provides a standardized way to interact with both REST APIs and AWS Amplify services. It handles authentication, error handling, and provides a consistent interface for all API calls.

## Basic Usage

Import the API client in your component or service:

```typescript
import { api } from '@/lib/api-client';
```

### REST API Calls

#### GET Requests

```typescript
// Get the current user
const currentUser = await api.get<User>('/users/me');

// Get a specific property with query parameters
const property = await api.get<Property>('/properties/123', {
  searchParams: { include: 'amenities,location' }
});
```

#### POST Requests

```typescript
// Create a new user
const newUser = await api.post<User>('/users', {
  name: 'John Doe',
  email: 'john@example.com',
  role: 'buyer'
});

// Login a user (no authentication required)
const authResponse = await api.post<AuthResponse>('/auth/login', {
  email: 'user@example.com',
  password: 'password123'
}, { requiresAuth: false });
```

#### PUT Requests

```typescript
// Update a property
const updatedProperty = await api.put<Property>('/properties/123', {
  title: 'Updated Property Title',
  price: 250000
});
```

#### DELETE Requests

```typescript
// Delete a property
await api.delete('/properties/123');

// Delete with query parameters
await api.delete('/properties/123', {
  searchParams: { hardDelete: true }
});
```

### GraphQL Queries

```typescript
// Simple query
const result = await api.graphql<{ projects: Project[] }>(`
  query GetProjects {
    projects {
      id
      name
      status
    }
  }
`);

// Query with variables
const project = await api.graphql<{ project: Project }>(`
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      name
      description
      status
      createdAt
      units {
        id
        name
      }
    }
  }
`, { id: 'project-123' });
```

### GraphQL Mutations

```typescript
// Create mutation
const newProject = await api.graphql<{ createProject: Project }>(`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      name
      status
    }
  }
`, { 
  input: { 
    name: 'New Development', 
    location: 'Dublin',
    status: 'PLANNING'
  } 
});

// Update mutation
const result = await api.graphql<{ updateProject: Project }>(`
  mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
    updateProject(id: $id, input: $input) {
      id
      name
      status
    }
  }
`, { 
  id: 'project-123',
  input: { status: 'CONSTRUCTION' } 
});
```

## Advanced Usage

### Error Handling

The API client throws `ApiError` instances with details about the error:

```typescript
import { api, ApiError } from '@/lib/api-client';

try {
  const result = await api.get('/protected-resource');
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API Error ${error.statusCode}: ${error.message}`);
    
    // Handle specific error types
    if (error.statusCode === 401) {
      // Handle unauthorized
    } else if (error.statusCode === 403) {
      // Handle forbidden
    } else if (error.statusCode === 404) {
      // Handle not found
    }
  } else {
    console.error('Unknown error:', error);
  }
}
```

### Request Options

The API client accepts various options to customize the request:

```typescript
// Custom headers
const result = await api.get('/custom-endpoint', {
  headers: {
    'X-Custom-Header': 'value'
  }
});

// Change authentication requirement
const publicData = await api.get('/public-data', {
  requiresAuth: false
});

// Control whether to use Amplify API or fetch
const result = await api.post('/data', { foo: 'bar' }, {
  useAmplify: false // Force using fetch instead of Amplify API
});

// Skip parsing the response
const rawHtml = await api.get('/html-content', {
  parseResponse: false
});
```

### Using with React Query

The API client integrates seamlessly with React Query:

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

// Query
function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => api.get<User>(`/users/${userId}`)
  });
}

// Mutation
function useUpdateUser() {
  return useMutation({
    mutationFn: (userData: UpdateUserData) => 
      api.put<User>(`/users/${userData.id}`, userData)
  });
}

// In your component
function UserProfile({ userId }) {
  const { data: user, isLoading } = useUser(userId);
  const { mutate: updateUser } = useUpdateUser();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <button onClick={() => updateUser({ id: userId, status: 'active' })}>
        Activate
      </button>
    </div>
  );
}
```

## Security Features

### CSRF Protection

The API client automatically includes CSRF tokens in the headers for state-changing requests (POST, PUT, DELETE):

```typescript
// CSRF token is automatically included
const result = await api.post('/save-data', { data: 'value' });
```

### Authentication

The API client automatically handles authentication:

```typescript
// Automatically includes Authorization header with JWT token
const protectedData = await api.get('/protected-resource');
```

## Best Practices

1. **Use TypeScript interfaces** for all API responses to ensure type safety
2. **Include proper error handling** for all API calls
3. **Use React Query** for data fetching in components
4. **Minimize direct API calls** in components - create custom hooks instead
5. **Keep authentication logic** in the auth service, not in components

## Examples in Components

### React Component Example

```typescript
import { useState } from 'react';
import { api, ApiError } from '@/lib/api-client';

function CreateProjectForm() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const project = await api.post<Project>('/projects', { name });
      console.log('Project created:', project);
      setName('');
      alert('Project created successfully!');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Project name"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Project'}
      </button>
    </form>
  );
}
```

### React Query Hook Example

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

// Custom hook for projects
export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => api.get<Project[]>('/projects')
  });
}

// Custom hook for creating a project
export function useCreateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (project: CreateProjectData) => 
      api.post<Project>('/projects', project),
    onSuccess: () => {
      // Invalidate and refetch projects list
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });
}

// In your component
function ProjectsPage() {
  const { data: projects, isLoading } = useProjects();
  const { mutate: createProject, isPending } = useCreateProject();
  
  const handleCreate = () => {
    createProject({ name: 'New Project', status: 'PLANNING' });
  };
  
  if (isLoading) return <div>Loading projects...</div>;
  
  return (
    <div>
      <h1>Projects</h1>
      <button onClick={handleCreate} disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Project'}
      </button>
      <ul>
        {projects.map(project => (
          <li key={project.id}>{project.name}</li>
        ))}
      </ul>
    </div>
  );
}
```