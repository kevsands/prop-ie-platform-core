# Developer Onboarding Guide

Welcome to the PropIE AWS App development team! This comprehensive guide will help you get started with the codebase, understand the application architecture, and establish a productive development workflow.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Development Environment Setup](#development-environment-setup)
3. [Code Organization](#code-organization)
4. [Application Architecture](#application-architecture)
5. [Key Technologies](#key-technologies)
6. [Development Workflow](#development-workflow)
7. [Testing Strategy](#testing-strategy)
8. [AWS Integration](#aws-integration)
9. [Common Tasks](#common-tasks)
10. [Extending the Application](#extending-the-application)
11. [Troubleshooting](#troubleshooting)
12. [Getting Help](#getting-help)

## Project Overview

The PropIE AWS App is a comprehensive property development and sales platform built with Next.js and AWS services. The application enables property developers to showcase their developments, manage property listings, and interact with buyers through a streamlined, secure platform.

### Key Features

- **Property Development Showcase**: Interactive display of property developments
- **User Management**: Role-based user management (admin, developer, buyer, solicitor)
- **Document Management**: Secure document upload, storage, and sharing
- **Purchase Process**: End-to-end property purchase workflow
- **Customization Options**: Property customization for buyers
- **Help-to-Buy Integration**: Integration with Help-to-Buy schemes
- **Reporting and Analytics**: Performance and sales reporting

### User Roles

- **Admin**: Platform administrators with complete access
- **Developer**: Property developers who manage developments and properties
- **Buyer**: Property buyers who browse and purchase properties
- **Solicitor**: Legal professionals who manage purchase documentation
- **Agent**: Sales agents who assist buyers with property purchases

## Development Environment Setup

### Prerequisites

- **Node.js**: v18.x or later
- **npm**: v9.x or later
- **Git**: v2.30.0 or later
- **AWS Account**: For AWS services integration
- **AWS CLI**: v2.x configured with appropriate credentials
- **AWS Amplify CLI**: v6.x for Amplify configuration

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/prop-ie-aws-app.git
   cd prop-ie-aws-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Create a `.env.local` file in the project root
   - Copy the template from `.env.example` and fill in the required values:
   ```
   # AWS Configuration
   NEXT_PUBLIC_AWS_REGION=us-east-1
   NEXT_PUBLIC_AWS_USER_POOLS_ID=your-user-pool-id
   NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID=your-client-id
   NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID=your-identity-pool-id
   NEXT_PUBLIC_APPSYNC_GRAPHQL_ENDPOINT=your-graphql-endpoint
   NEXT_PUBLIC_API_KEY=your-api-key
   NEXT_PUBLIC_S3_BUCKET=your-s3-bucket-name
   
   # Feature Flags
   NEXT_PUBLIC_ENABLE_DEBUG_TOOLS=true
   NEXT_PUBLIC_ENABLE_MOCK_DATA=true
   
   # API Configuration
   NEXT_PUBLIC_API_ENDPOINT=http://localhost:3000/api
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Access the application**:
   - Open a browser and navigate to `http://localhost:3000`
   - Use the development user accounts for testing (see below)

### Development User Accounts

For local development, you can use the following user accounts:

| Role | Email | Password | Notes |
|------|-------|----------|-------|
| Admin | admin@example.com | TestPassword123! | Full access to all features |
| Developer | developer@example.com | TestPassword123! | Access to development management |
| Buyer | buyer@example.com | TestPassword123! | Access to buyer features |
| Solicitor | solicitor@example.com | TestPassword123! | Access to document management |
| Agent | agent@example.com | TestPassword123! | Access to sales features |

These accounts are configured in the development environment only.

## Code Organization

The application follows a modular structure organized by feature and technical concern.

### Directory Structure

```
├── __tests__/            # Jest unit and integration tests
├── docs/                 # Documentation files
├── infrastructure/       # Infrastructure as code (Terraform, CloudFormation)
├── prisma/               # Prisma database schema and migrations
├── public/               # Static assets
├── scripts/              # Utility scripts
├── src/
│   ├── app/              # Next.js App Router pages and layouts
│   ├── components/       # React components
│   ├── context/          # React context providers
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Core libraries and utilities
│   │   ├── amplify/      # AWS Amplify integration
│   │   ├── api/          # API client and utilities
│   │   ├── auth/         # Authentication utilities
│   │   ├── db/           # Database utilities
│   │   ├── security/     # Security-related utilities
│   │   └── utils/        # General utility functions
│   ├── services/         # Domain services
│   ├── styles/           # Global styles and CSS modules
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── cypress/              # Cypress end-to-end tests
└── .github/              # GitHub Actions workflows
```

### Key Files

- `src/app/layout.tsx`: Root layout for all pages
- `src/components/ClientProviders.tsx`: Client-side providers
- `src/context/AuthContext.tsx`: Authentication context provider
- `src/lib/amplify/index.ts`: AWS Amplify integration entry point
- `src/types/index.ts`: Core type definitions
- `next.config.js`: Next.js configuration
- `tsconfig.json`: TypeScript configuration

## Application Architecture

The PropIE application follows a modern React architecture optimized for performance and maintainability.

### Client/Server Architecture

With Next.js App Router, the application uses a hybrid server/client architecture:

1. **Server Components (Default)**:
   - Render on the server
   - Reduce client-side JavaScript
   - Direct access to backend resources
   - Located in `src/app/` without "use client" directive

2. **Client Components**:
   - Interactive components that render on the client
   - Marked with "use client" directive
   - Support state, effects, and event handlers
   - Located primarily in `src/components/`

### Component Hierarchy

```
Layout (Server Component)
├── ClientProviders (Client Component)
│   ├── AuthProvider
│   ├── QueryClientProvider
│   └── Other Providers
├── Navigation (Client Component)
└── Page Content (Server or Client Components)
    ├── Feature Components
    ├── UI Components
    └── Domain-specific Components
```

### Data Flow

1. **Data Fetching**:
   - Server Components: Direct data fetching in the component
   - Client Components: React Query hooks for data fetching
   - API Endpoints: Next.js API routes or direct AWS service calls

2. **State Management**:
   - React Context for global state (auth, theme, etc.)
   - React Query for server state (caching, refetching)
   - Local component state for UI state

3. **Authentication Flow**:
   - AWS Cognito via Amplify Authentication
   - Token storage and refresh handled by AuthContext
   - Role-based access control via Cognito groups

### Error Handling

1. **Client-Side Error Handling**:
   - React Error Boundaries for component errors
   - Try/catch for async operations
   - React Query error handling for data fetching

2. **Server-Side Error Handling**:
   - Next.js error pages
   - Global error logging
   - Structured error responses from API routes

## Key Technologies

The application uses a modern technology stack:

### Frontend

- **React 19**: UI library
- **Next.js 15**: React framework
- **TypeScript**: Type-safe JavaScript
- **TailwindCSS**: Utility-first CSS framework
- **React Query**: Data fetching and caching
- **React Hook Form**: Form handling
- **Zod**: Schema validation
- **Shadcn/UI**: UI component library

### Backend

- **Next.js API Routes**: Backend API endpoints
- **AWS Amplify**: AWS services integration
- **AWS Cognito**: Authentication and user management
- **AWS AppSync**: GraphQL API
- **AWS S3**: Storage for files and assets
- **Prisma**: Database ORM
- **MongoDB**: Database (via MongoDB Atlas)

### Development & Testing

- **Jest**: Unit and integration testing
- **Testing Library**: Component testing
- **Cypress**: End-to-end testing
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **GitHub Actions**: CI/CD

## Development Workflow

### 1. Git Workflow

We follow a feature branch workflow:

1. **Feature Branches**:
   - Create a new branch for each feature or bug fix
   - Use a descriptive name with the format: `feature/feature-name` or `fix/bug-name`

2. **Commit Guidelines**:
   - Write clear, concise commit messages
   - Follow the conventional commits format
   - Reference issue numbers in commit messages

3. **Pull Requests**:
   - Create a pull request when your feature is ready
   - Fill out the pull request template with details
   - Request reviews from appropriate team members
   - Ensure all CI checks pass

4. **Code Review**:
   - Address all code review comments
   - Make requested changes and request re-review
   - Merge only after approval

5. **Merge Strategy**:
   - We use squash merging to keep the history clean
   - The PR title becomes the commit message
   - Delete the branch after merging

### 2. Development Process

1. **Issue Assignment**:
   - Pick an issue from the backlog
   - Assign it to yourself
   - Move it to "In Progress" on the project board

2. **Implementation**:
   - Create a feature branch from `develop`
   - Implement the feature or fix
   - Write tests for your code
   - Ensure code meets quality standards

3. **Local Testing**:
   - Run unit tests: `npm test`
   - Run linting: `npm run lint`
   - Run type checking: `npm run typecheck`
   - Test the feature manually in the browser

4. **Pull Request**:
   - Create a PR to the `develop` branch
   - Fill out the PR template
   - Request reviews
   - Address feedback

5. **Deployment**:
   - Merged PRs are automatically deployed to the development environment
   - Test in the development environment
   - When ready, promote to staging and then production

### 3. Code Standards

1. **TypeScript**:
   - Use proper type annotations
   - Avoid `any` type
   - Define interfaces for data structures
   - Use TypeScript utility types when appropriate

2. **React Components**:
   - Functional components with hooks
   - Proper prop typing
   - Descriptive naming
   - Separation of concerns

3. **File Organization**:
   - One component per file
   - Named exports for all components
   - Consistent file naming
   - Group related files in subdirectories

4. **Styling**:
   - Use TailwindCSS for styling
   - Follow the project's design system
   - Mobile-first responsive design
   - Use CSS modules for component-specific styles

## Testing Strategy

The application uses a comprehensive testing strategy:

### 1. Unit Tests

- Located in `__tests__/` directory
- Focus on pure functions and small components
- Use Jest and Testing Library
- Run with `npm test`

Example:
```typescript
// __tests__/utils/paramValidator.test.ts
import { validateParam } from '@/utils/paramValidator';

describe('validateParam', () => {
  it('should return true for valid parameters', () => {
    expect(validateParam('abc123', /^[a-z0-9]+$/)).toBe(true);
  });

  it('should return false for invalid parameters', () => {
    expect(validateParam('abc-123', /^[a-z0-9]+$/)).toBe(false);
  });
});
```

### 2. Integration Tests

- Located in `__tests__/` with specific directories
- Test the interaction between components
- Use Jest and Testing Library
- Run with `npm test`

Example:
```typescript
// __tests__/app-router/auth-flow.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '@/components/auth/LoginForm';
import { AuthProvider } from '@/context/AuthContext';

jest.mock('@/lib/amplify/auth', () => ({
  Auth: {
    signIn: jest.fn().mockResolvedValue({ isSignedIn: true }),
  },
}));

describe('Auth Flow', () => {
  it('should call signIn when form is submitted', async () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(require('@/lib/amplify/auth').Auth.signIn).toHaveBeenCalledWith({
        username: 'test@example.com',
        password: 'password123',
      });
    });
  });
});
```

### 3. End-to-End Tests

- Located in `cypress/` directory
- Test complete user flows
- Use Cypress
- Run with `npm run cypress`

Example:
```typescript
// cypress/e2e/auth/login.cy.ts
describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should login successfully with valid credentials', () => {
    cy.intercept('POST', '**/cognito-idp.*', {
      statusCode: 200,
      body: { AuthenticationResult: { IdToken: 'fake-token' } },
    }).as('login');

    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.wait('@login');
    cy.url().should('include', '/dashboard');
  });

  it('should show error with invalid credentials', () => {
    cy.intercept('POST', '**/cognito-idp.*', {
      statusCode: 400,
      body: { __type: 'NotAuthorizedException', message: 'Incorrect username or password.' },
    }).as('loginError');

    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginError');
    cy.contains('Incorrect email or password').should('be.visible');
  });
});
```

### 4. Test Coverage

- View test coverage with `npm run test:coverage`
- Aim for at least 70% code coverage
- Focus on critical business logic and complex components

## AWS Integration

The application integrates with AWS services through AWS Amplify v6.

### 1. Authentication

The application uses AWS Cognito for authentication:

```typescript
// src/lib/amplify/auth.ts
import { Auth } from '@/lib/amplify';

// Sign in
const signIn = async (email, password) => {
  try {
    const response = await Auth.signIn({
      username: email,
      password,
    });
    return response;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// Get current user
const getCurrentUser = async () => {
  try {
    return await Auth.getCurrentUser();
  } catch {
    return null;
  }
};
```

### 2. API Integration

The application uses AWS AppSync for GraphQL operations:

```typescript
// src/lib/amplify/api.ts
import { API } from '@/lib/amplify';
import { Development } from '@/types';

// Query developments
const getDevelopments = async () => {
  const query = `
    query ListDevelopments {
      listDevelopments {
        items {
          id
          name
          description
          location
          status
        }
      }
    }
  `;
  
  try {
    const result = await API.graphql({ query });
    return result.listDevelopments.items as Development[];
  } catch (error) {
    console.error('Error fetching developments:', error);
    throw error;
  }
};
```

### 3. Storage Integration

The application uses Amazon S3 for file storage:

```typescript
// src/lib/amplify/storage.ts
import { Storage } from '@/lib/amplify';

// Upload file
const uploadFile = async (file, key) => {
  try {
    const result = await Storage.upload(file, key);
    return result;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Get file URL
const getFileUrl = async (key) => {
  try {
    const url = await Storage.getUrl(key);
    return url;
  } catch (error) {
    console.error('Error getting file URL:', error);
    throw error;
  }
};
```

## Common Tasks

### 1. Creating a New Component

1. **Create the component file**:
   ```typescript
   // src/components/feature/MyComponent.tsx
   'use client';
   
   import { useState } from 'react';
   
   interface MyComponentProps {
     title: string;
     description?: string;
   }
   
   export const MyComponent: React.FC<MyComponentProps> = ({ 
     title, 
     description = 'Default description'
   }) => {
     const [isOpen, setIsOpen] = useState(false);
     
     return (
       <div className="p-4 border rounded">
         <h2 className="text-xl font-bold">{title}</h2>
         {isOpen && <p className="mt-2 text-gray-600">{description}</p>}
         <button 
           className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
           onClick={() => setIsOpen(!isOpen)}
         >
           {isOpen ? 'Hide Details' : 'Show Details'}
         </button>
       </div>
     );
   };
   ```

2. **Create a test file**:
   ```typescript
   // __tests__/components/feature/MyComponent.test.tsx
   import { render, screen, fireEvent } from '@testing-library/react';
   import { MyComponent } from '@/components/feature/MyComponent';
   
   describe('MyComponent', () => {
     it('should render the title', () => {
       render(<MyComponent title="Test Title" />);
       expect(screen.getByText('Test Title')).toBeInTheDocument();
     });
     
     it('should show description when button is clicked', () => {
       render(<MyComponent title="Test Title" description="Test Description" />);
       
       // Description should not be visible initially
       expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
       
       // Click the button
       fireEvent.click(screen.getByRole('button', { name: /show details/i }));
       
       // Description should now be visible
       expect(screen.getByText('Test Description')).toBeInTheDocument();
     });
   });
   ```

3. **Use the component**:
   ```typescript
   // src/app/some-page/page.tsx
   import { MyComponent } from '@/components/feature/MyComponent';
   
   export default function SomePage() {
     return (
       <div className="container mx-auto py-8">
         <h1 className="text-2xl font-bold mb-4">Some Page</h1>
         <MyComponent 
           title="My Component Example" 
           description="This is an example of my new component."
         />
       </div>
     );
   }
   ```

### 2. Adding a New API Endpoint

1. **Create the API route handler**:
   ```typescript
   // src/app/api/feature/route.ts
   import { NextRequest, NextResponse } from 'next/server';
   
   export async function GET(request: NextRequest) {
     try {
       // Get query parameters
       const searchParams = request.nextUrl.searchParams;
       const query = searchParams.get('query') || '';
       
       // Your business logic here
       const data = {
         results: [
           { id: '1', name: 'Item 1', description: 'Description 1' },
           { id: '2', name: 'Item 2', description: 'Description 2' },
         ],
         query,
       };
       
       return NextResponse.json(data);
     } catch (error) {
       console.error('API error:', error);
       return NextResponse.json(
         { error: 'Internal Server Error' },
         { status: 500 }
       );
     }
   }
   
   export async function POST(request: NextRequest) {
     try {
       const body = await request.json();
       
       // Validate request body
       if (!body.name) {
         return NextResponse.json(
           { error: 'Name is required' },
           { status: 400 }
         );
       }
       
       // Your business logic here
       const newItem = {
         id: Date.now().toString(),
         name: body.name,
         description: body.description || '',
         createdAt: new Date().toISOString(),
       };
       
       return NextResponse.json(newItem, { status: 201 });
     } catch (error) {
       console.error('API error:', error);
       return NextResponse.json(
         { error: 'Internal Server Error' },
         { status: 500 }
       );
     }
   }
   ```

2. **Create a service function to call the API**:
   ```typescript
   // src/services/featureService.ts
   import { Item } from '@/types';
   
   export const FeatureService = {
     async getItems(query: string = ''): Promise<Item[]> {
       try {
         const response = await fetch(`/api/feature?query=${encodeURIComponent(query)}`);
         
         if (!response.ok) {
           throw new Error(`API error: ${response.status}`);
         }
         
         const data = await response.json();
         return data.results;
       } catch (error) {
         console.error('Error fetching items:', error);
         throw error;
       }
     },
     
     async createItem(item: { name: string, description?: string }): Promise<Item> {
       try {
         const response = await fetch('/api/feature', {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify(item),
         });
         
         if (!response.ok) {
           throw new Error(`API error: ${response.status}`);
         }
         
         return await response.json();
       } catch (error) {
         console.error('Error creating item:', error);
         throw error;
       }
     },
   };
   ```

3. **Create a React hook to use the service**:
   ```typescript
   // src/hooks/useFeature.ts
   import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
   import { FeatureService } from '@/services/featureService';
   import { Item } from '@/types';
   
   export function useFeature() {
     const queryClient = useQueryClient();
     
     const items = useQuery({
       queryKey: ['items'],
       queryFn: () => FeatureService.getItems(),
     });
     
     const createItem = useMutation({
       mutationFn: (newItem: { name: string, description?: string }) => 
         FeatureService.createItem(newItem),
       onSuccess: () => {
         // Invalidate and refetch
         queryClient.invalidateQueries({ queryKey: ['items'] });
       },
     });
     
     return {
       items: {
         data: items.data || [],
         isLoading: items.isLoading,
         error: items.error,
       },
       createItem: {
         mutate: createItem.mutate,
         isLoading: createItem.isPending,
         error: createItem.error,
       },
     };
   }
   ```

4. **Use the hook in a component**:
   ```typescript
   // src/components/feature/ItemsList.tsx
   'use client';
   
   import { useState } from 'react';
   import { useFeature } from '@/hooks/useFeature';
   
   export const ItemsList = () => {
     const { items, createItem } = useFeature();
     const [name, setName] = useState('');
     const [description, setDescription] = useState('');
     
     const handleSubmit = (e: React.FormEvent) => {
       e.preventDefault();
       createItem.mutate({ name, description });
       setName('');
       setDescription('');
     };
     
     if (items.isLoading) {
       return <div>Loading...</div>;
     }
     
     if (items.error) {
       return <div>Error: {items.error.message}</div>;
     }
     
     return (
       <div className="space-y-4">
         <h2 className="text-xl font-bold">Items</h2>
         
         <form onSubmit={handleSubmit} className="space-y-2">
           <input
             type="text"
             value={name}
             onChange={(e) => setName(e.target.value)}
             placeholder="Name"
             className="px-4 py-2 border rounded"
             required
           />
           <input
             type="text"
             value={description}
             onChange={(e) => setDescription(e.target.value)}
             placeholder="Description"
             className="px-4 py-2 border rounded ml-2"
           />
           <button
             type="submit"
             className="px-4 py-2 bg-blue-500 text-white rounded ml-2"
             disabled={createItem.isLoading}
           >
             {createItem.isLoading ? 'Adding...' : 'Add Item'}
           </button>
         </form>
         
         <ul className="space-y-2">
           {items.data.map((item) => (
             <li key={item.id} className="p-4 border rounded">
               <h3 className="font-bold">{item.name}</h3>
               {item.description && <p className="text-gray-600">{item.description}</p>}
             </li>
           ))}
         </ul>
       </div>
     );
   };
   ```

### 3. Working with Authentication

1. **Using the auth context**:
   ```typescript
   // src/components/auth/ProfileButton.tsx
   'use client';
   
   import { useAuth } from '@/context/AuthContext';
   
   export const ProfileButton = () => {
     const { user, isAuthenticated, isLoading, signOut } = useAuth();
     
     if (isLoading) {
       return <div className="p-2">Loading...</div>;
     }
     
     if (!isAuthenticated || !user) {
       return (
         <a href="/login" className="p-2 hover:underline">
           Sign In
         </a>
       );
     }
     
     return (
       <div className="relative group">
         <button className="p-2 hover:underline">
           {user.name || user.email}
         </button>
         
         <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md hidden group-hover:block">
           <div className="p-2 border-b">
             <div className="font-bold">{user.name}</div>
             <div className="text-sm text-gray-600">{user.email}</div>
           </div>
           
           <a href="/profile" className="block p-2 hover:bg-gray-100">
             Profile
           </a>
           
           <button 
             className="block w-full text-left p-2 hover:bg-gray-100"
             onClick={() => signOut()}
           >
             Sign Out
           </button>
         </div>
       </div>
     );
   };
   ```

2. **Protected routes**:
   ```typescript
   // src/components/auth/ProtectedRoute.tsx
   'use client';
   
   import { useRouter } from 'next/navigation';
   import { useAuth } from '@/context/AuthContext';
   import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
   
   interface ProtectedRouteProps {
     children: React.ReactNode;
     allowedRoles?: string[];
   }
   
   export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
     children, 
     allowedRoles = [] 
   }) => {
     const { user, isAuthenticated, isLoading } = useAuth();
     const router = useRouter();
     
     // Show loading spinner while checking auth
     if (isLoading) {
       return (
         <div className="flex justify-center items-center min-h-screen">
           <LoadingSpinner size="large" />
         </div>
       );
     }
     
     // Redirect to login if not authenticated
     if (!isAuthenticated) {
       router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
       return null;
     }
     
     // Check role-based access if roles are specified
     if (allowedRoles.length > 0) {
       const userRole = user?.role || '';
       
       if (!allowedRoles.includes(userRole)) {
         router.push('/unauthorized');
         return null;
       }
     }
     
     // If authenticated and authorized, render children
     return <>{children}</>;
   };
   ```

3. **Using protected routes**:
   ```typescript
   // src/app/admin/page.tsx
   import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
   import { AdminDashboard } from '@/components/admin/AdminDashboard';
   
   export default function AdminPage() {
     return (
       <ProtectedRoute allowedRoles={['admin']}>
         <AdminDashboard />
       </ProtectedRoute>
     );
   }
   ```

## Extending the Application

### 1. Adding a New Feature

When adding a new feature to the application, follow these steps:

1. **Plan the feature**:
   - Define the user stories and requirements
   - Create any necessary designs or wireframes
   - Identify the data model changes needed
   - Plan the API endpoints required

2. **Create the necessary components**:
   - Create the UI components
   - Implement the business logic
   - Add tests for the components

3. **Create API endpoints**:
   - Implement the backend API routes
   - Add validation and error handling
   - Create tests for the API endpoints

4. **Update the data model**:
   - Add any new types or interfaces
   - Update database schema if necessary
   - Create migrations if using a database

5. **Create documentation**:
   - Update README with feature details
   - Add usage examples
   - Update API documentation

### 2. Example: Adding a Property Search Feature

1. **Create the search component**:
   ```typescript
   // src/components/property/PropertySearch.tsx
   'use client';
   
   import { useState } from 'react';
   import { useRouter } from 'next/navigation';
   
   interface PropertySearchProps {
     initialQuery?: string;
   }
   
   export const PropertySearch: React.FC<PropertySearchProps> = ({ 
     initialQuery = ''
   }) => {
     const [query, setQuery] = useState(initialQuery);
     const router = useRouter();
     
     const handleSubmit = (e: React.FormEvent) => {
       e.preventDefault();
       router.push(`/properties/search?q=${encodeURIComponent(query)}`);
     };
     
     return (
       <form onSubmit={handleSubmit} className="flex w-full max-w-md">
         <input
           type="text"
           value={query}
           onChange={(e) => setQuery(e.target.value)}
           placeholder="Search properties..."
           className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
         />
         <button
           type="submit"
           className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
         >
           Search
         </button>
       </form>
     );
   };
   ```

2. **Create the search results page**:
   ```typescript
   // src/app/properties/search/page.tsx
   import { Suspense } from 'react';
   import { PropertySearch } from '@/components/property/PropertySearch';
   import { PropertySearchResults } from '@/components/property/PropertySearchResults';
   import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
   
   interface SearchPageProps {
     searchParams: { q?: string };
   }
   
   export default function SearchPage({ searchParams }: SearchPageProps) {
     const query = searchParams.q || '';
     
     return (
       <div className="container mx-auto py-8">
         <h1 className="text-2xl font-bold mb-6">Property Search</h1>
         
         <div className="mb-6">
           <PropertySearch initialQuery={query} />
         </div>
         
         <Suspense fallback={<LoadingSpinner />}>
           <PropertySearchResults query={query} />
         </Suspense>
       </div>
     );
   }
   ```

3. **Create the search results component**:
   ```typescript
   // src/components/property/PropertySearchResults.tsx
   import { usePropertySearch } from '@/hooks/usePropertySearch';
   import { PropertyCard } from '@/components/property/PropertyCard';
   
   interface PropertySearchResultsProps {
     query: string;
   }
   
   export const PropertySearchResults: React.FC<PropertySearchResultsProps> = ({ 
     query 
   }) => {
     const { properties, isLoading, error } = usePropertySearch(query);
     
     if (isLoading) {
       return <div>Searching...</div>;
     }
     
     if (error) {
       return <div className="text-red-500">Error: {error.message}</div>;
     }
     
     if (!properties.length) {
       return (
         <div className="text-center py-8">
           <h2 className="text-xl font-semibold">No properties found</h2>
           <p className="text-gray-600 mt-2">
             Try adjusting your search terms or filters
           </p>
         </div>
       );
     }
     
     return (
       <div>
         <h2 className="text-xl font-semibold mb-4">
           {properties.length} {properties.length === 1 ? 'Property' : 'Properties'} Found
         </h2>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {properties.map((property) => (
             <PropertyCard key={property.id} property={property} />
           ))}
         </div>
       </div>
     );
   };
   ```

4. **Create the search API endpoint**:
   ```typescript
   // src/app/api/properties/search/route.ts
   import { NextRequest, NextResponse } from 'next/server';
   import { propertyService } from '@/services/propertyService';
   
   export async function GET(request: NextRequest) {
     try {
       const searchParams = request.nextUrl.searchParams;
       const query = searchParams.get('q') || '';
       const minPrice = searchParams.get('minPrice') ? 
         Number(searchParams.get('minPrice')) : undefined;
       const maxPrice = searchParams.get('maxPrice') ? 
         Number(searchParams.get('maxPrice')) : undefined;
       const bedrooms = searchParams.get('bedrooms') ? 
         Number(searchParams.get('bedrooms')) : undefined;
       
       const properties = await propertyService.searchProperties({
         query,
         minPrice,
         maxPrice,
         bedrooms,
       });
       
       return NextResponse.json({ properties });
     } catch (error) {
       console.error('Search API error:', error);
       return NextResponse.json(
         { error: 'Failed to search properties' },
         { status: 500 }
       );
     }
   }
   ```

5. **Create the search hook**:
   ```typescript
   // src/hooks/usePropertySearch.ts
   import { useQuery } from '@tanstack/react-query';
   import { Property } from '@/types';
   
   interface SearchParams {
     query?: string;
     minPrice?: number;
     maxPrice?: number;
     bedrooms?: number;
   }
   
   async function searchProperties(params: SearchParams): Promise<Property[]> {
     const searchParams = new URLSearchParams();
     
     if (params.query) searchParams.append('q', params.query);
     if (params.minPrice) searchParams.append('minPrice', params.minPrice.toString());
     if (params.maxPrice) searchParams.append('maxPrice', params.maxPrice.toString());
     if (params.bedrooms) searchParams.append('bedrooms', params.bedrooms.toString());
     
     const response = await fetch(`/api/properties/search?${searchParams.toString()}`);
     
     if (!response.ok) {
       throw new Error('Failed to search properties');
     }
     
     const data = await response.json();
     return data.properties;
   }
   
   export function usePropertySearch(query: string, options?: Omit<SearchParams, 'query'>) {
     const queryKey = ['properties', 'search', query, options];
     
     const { data, isLoading, error } = useQuery({
       queryKey,
       queryFn: () => searchProperties({ query, ...options }),
       enabled: !!query,
     });
     
     return {
       properties: data || [],
       isLoading,
       error,
     };
   }
   ```

## Troubleshooting

### Common Issues

1. **Authentication Issues**:
   - Ensure AWS Cognito is properly configured
   - Check environment variables for correct values
   - Verify the auth provider is properly initialized
   - Check for token expiration issues

2. **API Issues**:
   - Check network requests in browser developer tools
   - Verify API endpoints are correctly implemented
   - Check for CORS issues
   - Verify authentication tokens are being sent correctly

3. **Build Issues**:
   - Check TypeScript errors in the console
   - Run `npm run lint` to identify linting issues
   - Check for missing dependencies
   - Verify Next.js configuration

4. **Runtime Issues**:
   - Check browser console for errors
   - Use React DevTools for component debugging
   - Verify component props and state
   - Check for memory leaks in React components

### Debugging Tools

1. **React DevTools**:
   - Install the React DevTools browser extension
   - Inspect component props and state
   - Profile component renders

2. **Next.js Debug Tools**:
   - Use `next dev --debug` for detailed logs
   - Check `.next/server/` directory for built files
   - Use `next build --debug` for build issues

3. **AWS Amplify Debug Tools**:
   - Enable Amplify logging:
   ```typescript
   Amplify.configure({
     ...config,
     Logging: {
       logLevel: 'DEBUG',
     },
   });
   ```
   - Check AWS CloudWatch logs for backend issues
   - Use AWS CLI for direct service interaction

## Getting Help

If you encounter issues that aren't covered in this guide:

1. **Internal Resources**:
   - Check the project documentation in the `docs/` directory
   - Review the project wiki for known issues and solutions
   - Search existing GitHub issues for similar problems

2. **Team Communication**:
   - Ask in the development team channel on Slack
   - Discuss during daily stand-up meetings
   - Schedule a pair programming session for complex issues

3. **External Resources**:
   - [Next.js Documentation](https://nextjs.org/docs)
   - [React Documentation](https://react.dev/learn)
   - [AWS Amplify Documentation](https://docs.amplify.aws/)
   - [TypeScript Documentation](https://www.typescriptlang.org/docs/)

4. **Contact Information**:
   - Technical Lead: techlead@propieapp.com
   - DevOps Team: devops@propieapp.com
   - AWS Support: aws-support@propieapp.com