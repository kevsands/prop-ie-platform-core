# PropIE AWS App - Technical Architecture Documentation

**Date:** May 3, 2025  
**Version:** 1.0  
**Status:** Production Ready

This comprehensive technical architecture document provides a detailed overview of the PropIE AWS App's architecture, component structure, data flow, and technical implementations. This document expands on the existing ARCHITECTURE.md with additional technical details and diagrams.

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Component Architecture](#2-component-architecture)
3. [AWS Amplify Integration](#3-aws-amplify-integration)
4. [Type System Architecture](#4-type-system-architecture)
5. [Data Flow Architecture](#5-data-flow-architecture)
6. [Security Architecture](#6-security-architecture)
7. [Performance Optimization](#7-performance-optimization)
8. [State Management](#8-state-management)
9. [Error Handling](#9-error-handling)
10. [Deployment Architecture](#10-deployment-architecture)
11. [Testing Architecture](#11-testing-architecture)
12. [Monitoring and Logging](#12-monitoring-and-logging)
13. [Future Architecture Considerations](#13-future-architecture-considerations)

## 1. Architecture Overview

### 1.1 Technical Stack

The PropIE AWS App is built using the following technology stack:

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Frontend Framework | Next.js | 15.3.1 | Server-side rendering, API routes, app router |
| UI Library | React | 18.2.0 | Component-based UI development |
| Authentication | AWS Amplify Auth | v6.0.12 | User authentication and authorization |
| API | AWS Amplify API | v6.0.12 | GraphQL and REST API integration |
| Storage | AWS Amplify Storage | v6.0.12 | File storage and management |
| State Management | React Context + TanStack Query | v5.75.1 | Global and server state management |
| Styling | Tailwind CSS | v3.4.1 | Utility-first CSS framework |
| Form Management | React Hook Form | v7.54.2 | Form state and validation |
| Schema Validation | Zod | v3.24.1 | Runtime type checking and validation |
| Testing | Jest + React Testing Library | v29.7.0 | Unit and integration testing |
| E2E Testing | Cypress | v13.6.6 | End-to-end testing |
| Package Manager | pnpm | v10.0.0 | Dependency management |
| Type Checking | TypeScript | v5.x | Static type checking |
| API Mocking | MSW | v2.2.6 | API mocking for testing |

### 1.2 System Architecture

The PropIE AWS App follows a modern client-server architecture with React Server Components (RSC) for server-side rendering and client components for interactivity. The application integrates with AWS services using AWS Amplify v6 for authentication, API integration, and storage.

#### Architectural Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                          Client Browser                             │
└───────────────────────────────┬────────────────────────────────────┘
                                │
┌───────────────────────────────▼────────────────────────────────────┐
│                        Next.js Application                          │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │  Server Components│  │  Client Components│  │  Amplify Integration│  │
│  │ ┌──────────────┐ │  │ ┌──────────────┐ │  │ ┌──────────────┐ │  │
│  │ │  Pages/Layouts│ │  │ │  UI Components│ │  │ │  Auth       │ │  │
│  │ └──────────────┘ │  │ └──────────────┘ │  │ └──────────────┘ │  │
│  │ ┌──────────────┐ │  │ ┌──────────────┐ │  │ ┌──────────────┐ │  │
│  │ │  Server Actions│ │  │ │  Form Handling│ │  │ │  API        │ │  │
│  │ └──────────────┘ │  │ └──────────────┘ │  │ └──────────────┘ │  │
│  │ ┌──────────────┐ │  │ ┌──────────────┐ │  │ ┌──────────────┐ │  │
│  │ │  Data Fetching│ │  │ │  Interactivity│ │  │ │  Storage    │ │  │
│  │ └──────────────┘ │  │ └──────────────┘ │  │ └──────────────┘ │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
└───────────────────────────────┬────────────────────────────────────┘
                                │
┌───────────────────────────────▼────────────────────────────────────┐
│                          AWS Services                               │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │  AWS Cognito     │  │  AWS AppSync     │  │  AWS S3          │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │  AWS API Gateway │  │  AWS CloudFront  │  │  AWS CloudWatch  │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

### 1.3 AWS Service Integration

The application integrates with the following AWS services:

| AWS Service | Purpose | Implementation |
|-------------|---------|----------------|
| AWS Cognito | User authentication and management | Amplify Auth module |
| AWS AppSync | GraphQL API for data operations | Amplify API module |
| AWS API Gateway | REST API endpoints | Amplify API module |
| AWS S3 | File storage for user uploads and assets | Amplify Storage module |
| AWS CloudFront | Content delivery network | Next.js integration |
| AWS CloudWatch | Monitoring and logging | Custom logging integration |
| AWS WAF | Web application firewall | REST API protection |

## 2. Component Architecture

### 2.1 Next.js App Router Structure

The application uses the Next.js App Router for routing and component organization:

```
src/
├── app/
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Home page
│   ├── buyer/                    # Buyer routes
│   │   ├── layout.tsx            # Buyer layout
│   │   ├── page.tsx              # Buyer home page
│   │   ├── dashboard/            # Buyer dashboard
│   │   ├── customization/        # Property customization
│   │   ├── documents/            # Document management
│   │   └── htb/                  # Help to Buy
│   ├── developer/                # Developer routes
│   │   ├── layout.tsx            # Developer layout
│   │   ├── page.tsx              # Developer home page
│   │   ├── projects/             # Project management
│   │   └── htb/                  # HTB claim management
│   ├── admin/                    # Admin routes
│   ├── properties/               # Property listings and details
│   ├── developments/             # Development listings and details
│   └── api/                      # API routes
│       ├── auth/                 # Auth API endpoints
│       ├── properties/           # Property API endpoints
│       ├── documents/            # Document API endpoints
│       └── ...                   # Other API endpoints
```

### 2.2 Component Organization

Components are organized following a feature-based structure:

```
src/
├── components/
│   ├── auth/                    # Authentication components
│   ├── buyer/                   # Buyer-specific components
│   ├── developer/               # Developer-specific components
│   ├── property/                # Property-related components
│   ├── customization/           # Customization components
│   ├── documents/               # Document management components
│   ├── htb/                     # Help to Buy components
│   ├── security/                # Security components
│   ├── ui/                      # Shared UI components
│   ├── layout/                  # Layout components
│   └── navigation/              # Navigation components
```

### 2.3 Client/Server Component Separation

The application follows a clear separation between server and client components:

#### Server Components

Server components are used for:
- Initial page rendering
- Data fetching
- Accessing server-only resources
- Server-side operations

Server components are the default in the App Router and don't require any special marking.

#### Client Components

Client components are used for:
- Interactive UI elements
- Using browser APIs
- Using React hooks
- Managing client-side state

Client components are marked with the `'use client'` directive at the top of the file.

### 2.4 Component Hierarchy Example

```tsx
// Server component
// app/buyer/dashboard/page.tsx
import { fetchDashboardData } from '@/lib/server/data';
import BuyerDashboardContent from '@/components/buyer/BuyerDashboardContent';

export default async function BuyerDashboardPage() {
  // Server-side data fetching
  const dashboardData = await fetchDashboardData();
  
  // Pass data to client component
  return <BuyerDashboardContent initialData={dashboardData} />;
}

// Client component
// components/buyer/BuyerDashboardContent.tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { API } from '@/lib/amplify/api';

export default function BuyerDashboardContent({ initialData }) {
  // Client-side state
  const [filter, setFilter] = useState('active');
  
  // Client-side data fetching
  const { data = initialData } = useQuery({
    queryKey: ['dashboard', filter],
    queryFn: () => API.get(`/dashboard?filter=${filter}`),
    initialData
  });
  
  // Interactive UI
  return (
    <div>
      {/* Dashboard UI */}
    </div>
  );
}
```

## 3. AWS Amplify Integration

### 3.1 Modular Amplify Architecture

The AWS Amplify integration follows a modular architecture for better tree-shaking and separation of concerns:

```
src/lib/amplify/
├── index.ts        # Initialization and core utilities
├── auth.ts         # Authentication module
├── api.ts          # API integration (GraphQL and REST)
├── storage.ts      # Storage integration
├── server.ts       # Server-side Amplify utilities
├── config.ts       # Amplify configuration
├── cache.ts        # Caching utilities
├── interceptors.ts # Request/response interceptors
└── types.ts        # Common type definitions
```

### 3.2 Initialization Pattern

Amplify is initialized using a safe pattern that prevents multiple initializations and supports server components:

```typescript
// amplify/index.ts
import { Amplify } from 'aws-amplify';
import amplifyConfig from './config';

let isInitialized = false;
let isDebugMode = process.env.NODE_ENV !== 'production';

export function initialize(options = { ssr: true, debug: isDebugMode }) {
  if (isInitialized) {
    return true;
  }
  
  try {
    Amplify.configure(amplifyConfig);
    
    if (options.debug) {
      enableDebugMode();
    }
    
    if (typeof window !== 'undefined') {
      setupAuthListeners();
    }
    
    isInitialized = true;
    isDebugMode = options.debug || false;
    
    return true;
  } catch (error) {
    console.error('[Amplify] Failed to initialize:', error);
    return false;
  }
}

export function ensureAmplifyInitialized() {
  if (typeof window !== 'undefined' && !isInitialized) {
    initialize();
  }
  return isInitialized;
}
```

### 3.3 Authentication Implementation

Amplify Auth is implemented through a custom wrapper that enhances the base functionality:

```typescript
// amplify/auth.ts
import {
  signIn,
  signUp,
  signOut,
  confirmSignUp,
  resetPassword,
  confirmSignIn,
  getCurrentUser,
  fetchUserAttributes,
  fetchAuthSession
} from 'aws-amplify/auth';
import { initialize } from './index';
import { createClientCache } from './cache';

export class Auth {
  // Cache for user attributes
  private static userCache = createClientCache(async () => {
    try {
      return await fetchUserAttributes();
    } catch (error) {
      console.warn('Failed to fetch user attributes:', error);
      return {};
    }
  });

  // Enhanced sign in with token management
  static async signIn({ username, password }) {
    initialize();
    try {
      const result = await signIn({ username, password });
      
      if (result.isSignedIn) {
        try {
          const session = await fetchAuthSession();
          
          if (session?.tokens?.accessToken) {
            this.storeTokens(
              session.tokens.accessToken.toString(),
              session.tokens.refreshToken?.toString(),
              session.tokens.accessToken.payload.exp
            );
          }
        } catch (tokenError) {
          console.warn('Failed to extract tokens after sign in:', tokenError);
        }
      }
      
      return result;
    } catch (error) {
      this.handleAuthError(error, 'signIn');
      throw error;
    }
  }
  
  // Additional authentication methods...
}
```

### 3.4 API Client Implementation

The Amplify API client is extended with additional functionality:

```typescript
// amplify/api.ts
import { generateClient } from 'aws-amplify/api';
import { initialize } from './index';
import { Auth } from './auth';
import { createClientCache } from './cache';

export class API {
  private static client = null;
  private static cacheEnabled = true;
  
  // Cache for queries
  private static queryCache = createClientCache(
    async (cacheKey, queryFn, ttl = 60000) => {
      // Implementation details...
    }
  );
  
  // Get or create Amplify API client
  static getClient() {
    initialize();
    if (!this.client) {
      this.client = generateClient({
        config: {
          API: {
            GraphQL: {
              responseInvalidation: {
                expressionFunctions: {
                  cacheWithTTL: (seconds = 300) => {
                    return { ttl: seconds };
                  }
                }
              }
            }
          },
          optimisticResponse: true
        }
      });
    }
    return this.client;
  }
  
  // Enhanced GraphQL operations
  static async graphql({ query, variables = {}, operationName = null, authMode, cacheOptions }) {
    // Implementation details...
  }
  
  // Enhanced REST operations
  static async rest(options) {
    // Implementation details...
  }
  
  // Convenience methods
  static async get(path, queryParams, options) {
    return this.rest({ path, method: 'GET', queryParams, ...options });
  }
  
  static async post(path, body, options) {
    return this.rest({ path, method: 'POST', body, ...options });
  }
  
  // Additional methods...
}
```

### 3.5 Storage Implementation

The Amplify Storage module is wrapped with enhanced functionality:

```typescript
// amplify/storage.ts
import { uploadData, downloadData, getUrl, remove } from 'aws-amplify/storage';
import { initialize } from './index';

export class Storage {
  // Initialize before operations
  static ensureInitialized() {
    return initialize();
  }
  
  // Enhanced upload with progress and cancel support
  static async upload(key, file, options = {}) {
    this.ensureInitialized();
    
    try {
      const result = await uploadData({
        key,
        data: file,
        options
      }).result;
      
      return {
        key: result.key,
        url: await this.getUrl(result.key)
      };
    } catch (error) {
      console.error(`[Storage] Upload error for ${key}:`, error);
      throw error;
    }
  }
  
  // Get URL with expiration handling
  static async getUrl(key, options = {}) {
    this.ensureInitialized();
    
    try {
      const result = await getUrl({
        key,
        options: {
          expiresIn: 3600, // 1 hour
          ...options
        }
      });
      
      return result.url;
    } catch (error) {
      console.error(`[Storage] GetUrl error for ${key}:`, error);
      throw error;
    }
  }
  
  // Additional methods...
}
```

### 3.6 Server-Side Amplify

For server components, a special server-side implementation is provided:

```typescript
// amplify/server.ts
import { fetchAuthSession } from 'aws-amplify/auth/server';
import { generateServerClientUsingCookies } from 'aws-amplify/api/server';
import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import { cookies } from 'next/headers';
import amplifyConfig from './config';

// Create server runner for Next.js
const { runWithAmplifyServerContext } = createServerRunner({
  config: amplifyConfig
});

// Server-side API client
export const serverApiClient = generateServerClientUsingCookies({
  config: amplifyConfig,
  cookies
});

// Fetch data from API on server
export async function serverFetch(options) {
  return runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: async (contextSpec) => {
      // Implementation details...
    }
  });
}

// Get current user on server
export async function getServerUser() {
  return runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec);
        // Implementation details...
      } catch (error) {
        return null;
      }
    }
  });
}
```

## 4. Type System Architecture

### 4.1 Domain-Driven Type Organization

The application follows a domain-driven approach to type organization:

```
src/types/
├── amplify/                # AWS Amplify-related types
├── common/                 # Shared type definitions
├── core/                   # Core entity types
│   ├── analytics.ts        # Analytics types
│   ├── development.ts      # Development types
│   ├── document.ts         # Document types
│   ├── financial.ts        # Financial types
│   ├── project.ts          # Project types
│   ├── sales.ts            # Sales types
│   ├── unit.ts             # Unit types
│   └── user.ts             # User types
├── development/            # Development-specific types
├── finance/                # Finance-specific types
├── customization.ts        # Customization types
├── htb.ts                  # Help to Buy types
└── search.ts               # Search-related types
```

### 4.2 Type Definition Examples

```typescript
// Core entity interfaces
// types/core/development.ts
export interface Development {
  id: string;
  name: string;
  description: string;
  location: Location;
  status: DevelopmentStatus;
  units: Unit[];
  floorPlans: FloorPlan[];
  amenities: Amenity[];
  createdAt: string;
  updatedAt: string;
}

// Enum definitions
// types/enums.ts
export enum DevelopmentStatus {
  PLANNING = 'PLANNING',
  CONSTRUCTION = 'CONSTRUCTION',
  MARKETING = 'MARKETING',
  SALES = 'SALES',
  COMPLETED = 'COMPLETED'
}

// API types
// types/api.ts
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
  requestId?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}
```

### 4.3 Utility Types

The application defines utility types for common patterns:

```typescript
// Utility types
// types/common.ts
export type ID = string;

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type AsyncData<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<T>;
};

export type ApiResult<T> = 
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };
```

## 5. Data Flow Architecture

### 5.1 Data Fetching Patterns

The application implements multiple data fetching patterns based on the component type and requirements:

#### Server Component Data Fetching

```tsx
// Server component data fetching
// app/properties/[id]/page.tsx
import { serverFetch } from '@/lib/amplify/server';
import { Property } from '@/types/core/property';
import PropertyDetail from '@/components/property/PropertyDetail';

export default async function PropertyDetailPage({ params }) {
  try {
    // Server-side data fetching
    const property = await serverFetch<Property>({
      path: `/properties/${params.id}`,
      method: 'GET'
    });
    
    return <PropertyDetail property={property} />;
  } catch (error) {
    // Error handling
    return <PropertyNotFound />;
  }
}
```

#### Client Component Data Fetching

```tsx
// Client component data fetching
// components/properties/PropertiesList.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { API } from '@/lib/amplify/api';
import { Property } from '@/types/core/property';

export default function PropertiesList({ initialData = [] }) {
  const { data = initialData, isLoading, error } = useQuery({
    queryKey: ['properties'],
    queryFn: () => API.get<Property[]>('/properties'),
    initialData
  });
  
  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map(property => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
```

### 5.2 Data Mutation Patterns

The application handles data mutations using TanStack Query's mutation hooks:

```tsx
// Data mutation example
// components/property/PropertyForm.tsx
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API } from '@/lib/amplify/api';
import { Property } from '@/types/core/property';

export default function PropertyForm() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (data: Partial<Property>) => API.post('/properties', data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      // Show success message
    },
    onError: (error) => {
      // Handle error
    }
  });
  
  const handleSubmit = (formData) => {
    mutation.mutate(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### 5.3 Data Flow Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Server Component│     │  Client Component│     │    AWS Backend  │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │  Initial Data Fetch   │                       │
         │───────────────────────┼───────────────────────▶
         │                       │                       │
         │  Data & HTML          │                       │
         │◀──────────────────────┼───────────────────────│
         │                       │                       │
         │  Hydration            │                       │
         ├──────────────────────▶│                       │
         │                       │                       │
         │                       │  Client-side Fetch    │
         │                       │───────────────────────▶
         │                       │                       │
         │                       │  JSON Response        │
         │                       │◀──────────────────────│
         │                       │                       │
         │                       │  UI Update            │
         │                       │─────────┐             │
         │                       │         │             │
         │                       │◀────────┘             │
         │                       │                       │
         │                       │  User Interaction     │
         │                       │─────────┐             │
         │                       │         │             │
         │                       │◀────────┘             │
         │                       │                       │
         │                       │  Data Mutation        │
         │                       │───────────────────────▶
         │                       │                       │
         │                       │  Success/Error        │
         │                       │◀──────────────────────│
         │                       │                       │
         │                       │  Refetch Data         │
         │                       │───────────────────────▶
         │                       │                       │
         │                       │  Updated Data         │
         │                       │◀──────────────────────│
```

## 6. Security Architecture

### 6.1 Authentication and Authorization

The application implements a comprehensive authentication and authorization system:

#### Authentication Flow

1. User enters credentials on login page
2. Credentials are sent to AWS Cognito via Amplify Auth
3. Upon successful authentication, tokens are securely stored
4. AuthContext provides user state to components
5. Token refresh is handled automatically

#### Authorization Checks

Authorization is implemented at multiple levels:

1. **Route Level**: Protected routes using middleware
2. **Server Component Level**: Authorization checks in server components
3. **API Level**: Role-based API endpoint protection
4. **UI Level**: Conditional rendering based on user roles

```tsx
// Route level authorization
// middleware.ts
import { NextResponse } from 'next/server';
import { getServerUser } from '@/lib/amplify/server';

export async function middleware(request) {
  // Protected routes
  if (request.nextUrl.pathname.startsWith('/buyer') ||
      request.nextUrl.pathname.startsWith('/developer') ||
      request.nextUrl.pathname.startsWith('/admin')) {
    
    const user = await getServerUser();
    
    if (!user) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Role-based route protection
    if (request.nextUrl.pathname.startsWith('/developer') && 
        !user.roles.includes('developer')) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    
    if (request.nextUrl.pathname.startsWith('/admin') && 
        !user.roles.includes('admin')) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }
  
  return NextResponse.next();
}
```

### 6.2 Enhanced Security Module

The application implements a comprehensive security module in `src/lib/security/`:

```
src/lib/security/
├── index.ts                      # Main security module
├── auditLogger.ts                # Security audit logging
├── errorHandling.ts              # Security error handling
├── validation.ts                 # Input validation
├── threatDetection.ts            # Threat detection
├── sessionFingerprint.ts         # Session security
├── apiProtection.ts              # API security
├── urlSafetyCheck.ts             # URL validation
├── sanitize.ts                   # Input sanitization
├── rateLimit.ts                  # Rate limiting
├── mfa.ts                        # Multi-factor authentication
├── securityAnalyticsClient.ts    # Client security analytics
├── securityAnalyticsServer.ts    # Server security analytics
├── cachedSecurityApi.ts          # Cached security API
└── useSecurityMonitor.ts         # Security monitoring hook
```

### 6.3 Content Security

The application implements various content security measures:

1. **Content Security Policy**: Implemented through headers and meta tags
2. **XSS Protection**: Input sanitization and output encoding
3. **CSRF Protection**: Token-based CSRF protection
4. **URL Safety**: URL validation to prevent malicious redirects
5. **Output Sanitization**: Sanitizing data before rendering

### 6.4 Environment Security

The application secures environment variables and secrets:

1. **NextJS Environment Variables**: Properly prefixed variables for client/server
2. **AWS Secrets Management**: Sensitive values stored in AWS Secrets Manager
3. **Build-time vs. Runtime**: Separation of build-time and runtime secrets

## 7. Performance Optimization

### 7.1 Server Components Optimization

Server components are optimized for performance:

1. **Reduced JavaScript**: Sending less JavaScript to the client
2. **Early Data Fetching**: Data fetching before rendering
3. **Streaming**: Streaming HTML for faster initial load
4. **Parallel Data Fetching**: Fetching data in parallel

### 7.2 Client-side Optimization

Client components are optimized using:

1. **Memoization**: Using React.memo for expensive components
2. **useMemo and useCallback**: Optimizing computations and callbacks
3. **Custom hooks**: Reusable logic extraction

### 7.3 Caching Strategy

The application implements a multi-layered caching strategy:

1. **React Query Cache**: Client-side data caching
2. **Custom Cache Implementation**: TTL and LRU caching for frequently accessed data
3. **API Response Caching**: Caching API responses with appropriate cache headers
4. **Static Generation**: Pre-rendering static content
5. **ISR (Incremental Static Regeneration)**: Updating static content at intervals

### 7.4 Code Splitting

Code splitting is implemented using:

1. **Route-based Splitting**: Automatic code splitting by Next.js
2. **Dynamic Imports**: Manual code splitting for large components
3. **Component Lazy Loading**: Lazy loading for non-critical components

```tsx
// Dynamic import example
import dynamic from 'next/dynamic';

// Lazy load heavy component
const PropertyVisualizer = dynamic(() => import('@/components/property/PropertyVisualizer'), {
  loading: () => <LoadingPlaceholder />,
  ssr: false // Disable SSR for three.js component
});
```

### 7.5 Bundle Optimization

The application optimizes bundle size through:

1. **Tree Shaking**: Removing unused code
2. **Dead Code Elimination**: Eliminating unreachable code
3. **Module Analysis**: Bundle analysis to identify large dependencies
4. **Code Minification**: Minifying code for production
5. **Compression**: Enabling Gzip/Brotli compression

## 8. State Management

### 8.1 React Context API

The application uses React Context for global state management:

```tsx
// AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { Auth } from '@/lib/amplify/auth';
import { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    // Initialize auth state
    const initAuth = async () => {
      try {
        const currentUser = await Auth.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        setUser(null);
        console.error('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();
  }, []);
  
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await Auth.signIn({ username, password });
      const user = await Auth.getCurrentUser();
      setUser(user);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    setIsLoading(true);
    
    try {
      await Auth.signOut();
      setUser(null);
    } catch (err) {
      setError(err as Error);
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, logout, error }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

### 8.2 TanStack Query

TanStack Query is used for server state management:

```tsx
// QueryClientWrapper.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export default function QueryClientWrapper({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: process.env.NODE_ENV === 'production',
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV !== 'production' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
```

### 8.3 Local Component State

Local component state is managed using React hooks:

```tsx
// PropertyFilters.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function PropertyFilters() {
  // Local state for filters
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [propertyType, setPropertyType] = useState('');
  
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Initialize from URL params
  useEffect(() => {
    setPriceMin(searchParams.get('priceMin') || '');
    setPriceMax(searchParams.get('priceMax') || '');
    setBedrooms(searchParams.get('bedrooms') || '');
    setPropertyType(searchParams.get('propertyType') || '');
  }, [searchParams]);
  
  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams();
    
    if (priceMin) params.set('priceMin', priceMin);
    if (priceMax) params.set('priceMax', priceMax);
    if (bedrooms) params.set('bedrooms', bedrooms);
    if (propertyType) params.set('propertyType', propertyType);
    
    router.push(`/properties?${params.toString()}`);
  };
  
  // Reset filters
  const resetFilters = () => {
    setPriceMin('');
    setPriceMax('');
    setBedrooms('');
    setPropertyType('');
    router.push('/properties');
  };
  
  return (
    <div className="filter-panel">
      {/* Filter UI */}
    </div>
  );
}
```

### 8.4 Form State Management

Forms are managed using React Hook Form:

```tsx
// PropertyForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Form validation schema
const propertySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  bedrooms: z.number().int().positive('Bedrooms must be a positive integer'),
  bathrooms: z.number().int().positive('Bathrooms must be a positive integer'),
  area: z.number().positive('Area must be positive'),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

export default function PropertyForm({ onSubmit, initialData = {} }) {
  // Initialize form with validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: initialData
  });
  
  const processSubmit = async (data: PropertyFormValues) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(processSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

## 9. Error Handling

### 9.1 Global Error Handling

The application implements global error handling:

```tsx
// app/global-error.tsx
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="error-container">
          <h2>Something went wrong</h2>
          <p>We apologize for the inconvenience. Please try again later.</p>
          <Button onClick={() => reset()}>Try again</Button>
        </div>
      </body>
    </html>
  );
}
```

### 9.2 Error Boundaries

React Error Boundaries are used for component-level error handling:

```tsx
// components/ui/error-boundary.tsx
'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Log the error
    console.error('Error boundary caught error:', error, info);
    
    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, info);
    }
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Render custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default fallback UI
      return (
        <div className="error-boundary-fallback">
          <h3>Something went wrong</h3>
          <p>There was an error displaying this content</p>
          <Button onClick={this.resetError}>Try again</Button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 9.3 API Error Handling

API errors are handled consistently across the application:

```tsx
// lib/amplify/api.ts (excerpt)
export class ApiError extends Error {
  path?: string;
  method?: string;
  statusCode?: number;
  originalError?: any;
  cached?: boolean;
  cacheStatus?: 'hit' | 'miss' | 'bypass';

  constructor(message: string, options?: {
    path?: string;
    method?: string;
    statusCode?: number;
    originalError?: any;
    cached?: boolean;
    cacheStatus?: 'hit' | 'miss' | 'bypass';
  }) {
    super(message);
    this.name = 'ApiError';
    this.path = options?.path;
    this.method = options?.method;
    this.statusCode = options?.statusCode;
    this.originalError = options?.originalError;
    this.cached = options?.cached;
    this.cacheStatus = options?.cacheStatus;
  }
}

// Custom hook for API error handling
export function useApiErrorHandler() {
  const processApiError = (error: unknown) => {
    if (error instanceof ApiError) {
      // Handle specific API error types
      if (error.statusCode === 401) {
        return {
          message: 'You need to login to access this resource',
          type: 'auth'
        };
      }
      
      if (error.statusCode === 403) {
        return {
          message: 'You do not have permission to access this resource',
          type: 'permission'
        };
      }
      
      if (error.statusCode === 404) {
        return {
          message: 'The requested resource was not found',
          type: 'notFound'
        };
      }
      
      // Generic API error
      return {
        message: error.message || 'An error occurred while communicating with the server',
        type: 'api'
      };
    }
    
    // Generic error
    return {
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      type: 'unknown'
    };
  };
  
  return { processApiError };
}
```

## 10. Deployment Architecture

### 10.1 AWS Amplify Hosting

The application is deployed using AWS Amplify Hosting:

```yaml
# amplify.yml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

### 10.2 Environment Configuration

Environment variables are managed securely:

```
# .env.local.example
# AWS Configuration
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_AWS_USER_POOLS_ID=us-east-1_XXXXXXXXX
NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID=us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NEXT_PUBLIC_API_URL=https://api.prop-ie.com
NEXT_PUBLIC_APPSYNC_GRAPHQL_ENDPOINT=https://xxxxxxxxxxxxxxxxxxxxxxxxxx.appsync-api.us-east-1.amazonaws.com/graphql
NEXT_PUBLIC_APPSYNC_API_KEY=da2-xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_S3_BUCKET=propieawsapp-storage-xxxxxxxx-dev
NEXT_PUBLIC_S3_REGION=us-east-1

# Feature Flags
NEXT_PUBLIC_FEATURE_INVESTOR_MODE=true
NEXT_PUBLIC_FEATURE_HELP_TO_BUY=true
NEXT_PUBLIC_FEATURE_ENHANCED_SECURITY=true
NEXT_PUBLIC_SHOW_DEBUG_TOOLS=true

# Server-only variables (not exposed to client)
API_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SERVICE_ACCOUNT_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 10.3 CI/CD Pipeline

The application uses AWS Amplify CI/CD pipeline for automated deployments:

1. **Branch Connection**: GitHub branches connected to Amplify
2. **Build Specification**: Build process defined in amplify.yml
3. **Environment Variables**: Securely stored in AWS Amplify Console
4. **Preview Deployments**: Pull request previews
5. **Production Deployment**: Automatic deployment from main branch

### 10.4 Deployment Environments

The application supports multiple deployment environments:

1. **Development**: Connected to development branch
2. **Staging**: Connected to staging branch
3. **Production**: Connected to main branch

Each environment has its own configuration and AWS resources.

## 11. Testing Architecture

### 11.1 Testing Framework

The application uses Jest and React Testing Library for testing:

```javascript
// jest.config.js
const nextJest = require("next/jest")();

// Providing the path to your Next.js app
const createJestConfig = nextJest({
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.{js,jsx,ts,tsx}",
  ],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 60,
      functions: 70,
      lines: 70,
    },
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config
module.exports = createJestConfig(customJestConfig);
```

### 11.2 Unit Testing

Unit tests focus on individual components and functions:

```tsx
// components/ui/button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button component', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant styles correctly', () => {
    render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-destructive');
  });

  it('handles disabled state', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### 11.3 Integration Testing

Integration tests focus on component interactions:

```tsx
// __tests__/app-router/auth-flow.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import LoginPage from '@/app/login/page';

// Mock fetch for API calls
global.fetch = jest.fn();

describe('Authentication Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock implementations
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true }),
    });
  });

  it('should display login form', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should handle successful login', async () => {
    // Mock successful API response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ 
        success: true,
        user: { id: '123', email: 'test@example.com' }
      }),
    });
    
    render(<LoginPage />);
    
    // Fill in form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Verify fetch was called with correct params
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/login', expect.any(Object));
    });
  });

  it('should handle login errors', async () => {
    // Mock error response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValue({ 
        success: false,
        message: 'Invalid credentials' 
      }),
    });
    
    render(<LoginPage />);
    
    // Fill in form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' },
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});
```

### 11.4 End-to-End Testing

Cypress is used for end-to-end testing:

```typescript
// cypress/e2e/auth/login.cy.ts
describe('Login Page', () => {
  beforeEach(() => {
    // Visit login page before each test
    cy.visit('/login');
  });

  it('should display login form', () => {
    cy.get('form').should('exist');
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });

  it('should validate inputs', () => {
    // Submit empty form
    cy.get('button[type="submit"]').click();
    
    // Check validation messages
    cy.get('form').contains('Email is required');
    cy.get('form').contains('Password is required');
    
    // Enter invalid email
    cy.get('input[name="email"]').type('invalid-email');
    cy.get('button[type="submit"]').click();
    cy.get('form').contains('Invalid email address');
    
    // Enter short password
    cy.get('input[name="email"]').clear().type('test@example.com');
    cy.get('input[name="password"]').type('short');
    cy.get('button[type="submit"]').click();
    cy.get('form').contains('Password must be at least');
  });

  it('should handle successful login', () => {
    // Mock successful login
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: { success: true }
    }).as('loginRequest');
    
    // Fill in form with valid credentials
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    // Check request was made with correct data
    cy.wait('@loginRequest').its('request.body').should('deep.equal', {
      email: 'test@example.com',
      password: 'password123'
    });
    
    // Verify redirect after successful login
    cy.url().should('include', '/dashboard');
  });

  it('should handle login failure', () => {
    // Mock failed login
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: { success: false, message: 'Invalid credentials' }
    }).as('loginRequest');
    
    // Fill in form with invalid credentials
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    
    // Check error message is displayed
    cy.get('form').contains('Invalid credentials');
    
    // Verify we're still on the login page
    cy.url().should('include', '/login');
  });
});
```

### 11.5 Testing Coverage Requirements

The application has defined testing coverage requirements:

```javascript
// jest.config.js (excerpt)
coverageThreshold: {
  global: {
    statements: 70,
    branches: 60,
    functions: 70,
    lines: 70,
  },
  // Specific thresholds for critical modules
  "./src/lib/security/**/*.{ts,tsx}": {
    statements: 80,
    branches: 75,
    functions: 80,
    lines: 80,
  },
  "./src/lib/services/**/*.{ts,tsx}": {
    statements: 75,
    branches: 70,
    functions: 75,
    lines: 75,
  },
  "./src/components/auth/**/*.{ts,tsx}": {
    statements: 80,
    branches: 75,
    functions: 80,
    lines: 80,
  },
}
```

## 12. Monitoring and Logging

### 12.1 AWS CloudWatch Integration

The application integrates with AWS CloudWatch for monitoring and logging:

1. **Metrics Collection**: Custom metrics for application performance
2. **Log Aggregation**: Centralized logging for all components
3. **Alerting**: Automated alerts for critical issues
4. **Dashboard**: Custom CloudWatch dashboard for monitoring

### 12.2 Application Logging

The application implements structured logging:

```typescript
// lib/logging.ts
interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  context?: string;
  data?: Record<string, any>;
  user?: string;
  requestId?: string;
}

export class Logger {
  static debug(message: string, data?: any, context?: string) {
    this.log('debug', message, data, context);
  }
  
  static info(message: string, data?: any, context?: string) {
    this.log('info', message, data, context);
  }
  
  static warn(message: string, data?: any, context?: string) {
    this.log('warn', message, data, context);
  }
  
  static error(message: string, data?: any, context?: string) {
    this.log('error', message, data, context);
  }
  
  private static log(level: LogEntry['level'], message: string, data?: any, context?: string) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      data
    };
    
    // In development, log to console
    if (process.env.NODE_ENV !== 'production') {
      console[level](message, { context, ...data });
      return;
    }
    
    // In production, send to CloudWatch
    this.sendToCloudWatch(entry);
  }
  
  private static sendToCloudWatch(entry: LogEntry) {
    // Implementation omitted for brevity
  }
}
```

### 12.3 Performance Monitoring

The application implements performance monitoring:

```typescript
// lib/performance-monitor.ts
interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'count' | 'percent';
  timestamp: number;
  tags?: Record<string, string>;
}

export class PerformanceMonitor {
  private static metrics: PerformanceMetric[] = [];
  private static flushInterval: NodeJS.Timeout | null = null;
  
  // Initialize monitoring
  static initialize() {
    if (typeof window !== 'undefined' && !this.flushInterval) {
      // Set up interval to flush metrics
      this.flushInterval = setInterval(() => {
        this.flushMetrics();
      }, 60000); // Flush every minute
    }
  }
  
  // Record a performance metric
  static recordMetric(name: string, value: number, unit: PerformanceMetric['unit'] = 'ms', tags?: Record<string, string>) {
    this.metrics.push({
      name,
      value,
      unit,
      timestamp: Date.now(),
      tags
    });
  }
  
  // Record component render time
  static recordRenderTime(componentName: string, renderTime: number) {
    this.recordMetric(`component.render.${componentName}`, renderTime, 'ms', { component: componentName });
  }
  
  // Record API call time
  static recordApiTime(endpoint: string, responseTime: number, success: boolean) {
    this.recordMetric(`api.call.${endpoint}`, responseTime, 'ms', { 
      endpoint, 
      success: String(success) 
    });
  }
  
  // Flush metrics to monitoring service
  private static flushMetrics() {
    if (this.metrics.length === 0) return;
    
    const metricsToFlush = [...this.metrics];
    this.metrics = [];
    
    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/monitoring/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics: metricsToFlush })
      }).catch(err => {
        console.error('Failed to flush metrics:', err);
      });
    } else {
      // In development, log to console
      console.info('Performance metrics:', metricsToFlush);
    }
  }
  
  // Clean up
  static destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
  }
}
```

## 13. Future Architecture Considerations

### 13.1 Micro-Frontend Architecture

For larger teams and feature sets, consider migrating to a micro-frontend architecture:

1. **Module Federation**: Webpack Module Federation for shared components
2. **Team Ownership**: Different teams owning different sections
3. **Independent Deployment**: Deploy sections independently

### 13.2 Edge Functions

Implement Edge Functions for improved performance:

1. **Middleware Enhancement**: Advanced routing and authentication at the edge
2. **Geolocation Services**: Location-based content and features
3. **A/B Testing**: Configuration and experimentation at the edge

### 13.3 Advanced Caching

Implement more advanced caching strategies:

1. **Distributed Cache**: Redis or Memcached integration
2. **Stale-While-Revalidate**: Serve stale content while revalidating
3. **Cache Invalidation**: Granular cache invalidation patterns

### 13.4 GraphQL Federation

Consider implementing GraphQL Federation for API scaling:

1. **Schema Stitching**: Combining multiple GraphQL schemas
2. **Distributed Resolvers**: Delegating resolvers to service owners
3. **Type Extensions**: Extending types across services

### 13.5 Serverless Functions

Expand the use of serverless functions:

1. **API Handlers**: Move API handlers to serverless functions
2. **Background Processing**: Implement background tasks with serverless
3. **Event Processing**: Use serverless for event-driven architecture

## Conclusion

The PropIE AWS App demonstrates a modern, well-structured architecture that leverages the latest in frontend development with Next.js 15.3.1 and AWS services via Amplify v6. The clear separation between server and client components, modular design, and comprehensive security features create a solid foundation for the application.

The architecture's strengths include:

1. **Modern React Patterns**: Using the latest React 18 features and patterns
2. **Performance Focus**: Multiple optimization techniques for fast loading and interactions
3. **Security First**: Comprehensive security architecture at all levels
4. **Type Safety**: Strong typing throughout the application
5. **Scalable Design**: Modular architecture that can scale with the application
6. **Testing Coverage**: Comprehensive testing strategy

This technical architecture document provides a detailed overview of the current implementation and future considerations for the PropIE AWS App.