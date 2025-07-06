# Prop.ie AWS Application Architecture

This document provides an overview of the architecture for the Prop.ie AWS application, focusing on core services, integration patterns, and best practices implemented in the codebase.

## Architecture Overview

The application follows a modern client-server architecture built on Next.js App Router, AWS Amplify, and various AWS services. The architecture emphasizes:

- **Unified Configuration** - Centralized configuration management across environments
- **Standardized API Access** - Consistent patterns for data access and mutation
- **Robust Authentication** - Multi-layer authentication with fallback mechanisms
- **Security Controls** - CSRF protection, XSS prevention, and audit logging

## Core Services

### Configuration Service

The configuration system provides a unified interface for accessing environment-specific settings and feature flags.

- **File:** `src/config/index.ts`
- **Key Features:**
  - Environment detection (local, development, staging, production)
  - Feature flag management
  - Merged AWS and environment configurations
  - Type-safe config access

```typescript
// Access configuration
import { config } from '@/config';

// Accessing specific configuration sections
const apiUrl = config.api.endpoint;
const isDebug = config.features.showDebugTools;

// Typesafe access using getConfig
import { getConfig } from '@/config';
const authConfig = getConfig('auth');
```

### API Client

The unified API client handles all data access patterns including REST and GraphQL, with fallback mechanisms for reliability.

- **File:** `src/lib/api-client.ts`
- **Key Features:**
  - Unified interface for REST and GraphQL
  - AWS Amplify integration with fetch fallback
  - Automatic error handling and formatting
  - CSRF protection for state-changing operations
  - Authentication token management

```typescript
// Basic API usage
import { api } from '@/lib/api-client';

// GET request with type safety
const user = await api.get<User>('/users/me');

// POST request with body
const result = await api.post<CreateUserResponse>(
  '/users', 
  { name: 'John', email: 'john@example.com' }
);

// GraphQL query
const data = await api.graphql<ProjectData>(
  `query GetProject($id: ID!) {
    project(id: $id) {
      name
      status
    }
  }`,
  { id: 'project-123' }
);
```

### Authentication Service

The authentication service provides a comprehensive solution for user authentication, authorization, and session management.

- **File:** `src/lib/auth.ts`
- **Key Features:**
  - AWS Cognito integration
  - JWT verification and validation
  - Role-based access control
  - Security logging and audit trails
  - CSRF protection
  - Token lifecycle management (refresh, expiry)

```typescript
// Client-side authentication
import { authService } from '@/lib/auth';

// Login
const { user, token } = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Check current user
const currentUser = await authService.getCurrentUser();

// Check permissions
const canAccess = authService.hasPermission(user, 'admin');

// Logout
await authService.logout();
```

## Security Features

### CSRF Protection

The application implements comprehensive Cross-Site Request Forgery (CSRF) protection:

- Token generation and validation (`CSRFToken` component)
- Automatic token inclusion in all state-changing API requests
- Server-side token validation
- Security logging for potential CSRF attacks

### Authentication Logging

All authentication events are logged with structured data:

- **File:** `src/lib/security/authLogger.ts`
- **Features:**
  - Login success/failure logging
  - Token lifecycle events
  - Suspicious activity detection
  - Configurable severity levels
  - Server-side reporting capabilities

## Integration with AWS Services

The application integrates with the following AWS services:

1. **AWS Cognito** - User management and authentication
2. **AWS AppSync** - GraphQL API and real-time data
3. **AWS S3** - File storage for documents and user uploads
4. **AWS Amplify** - Deployment and hosting
5. **AWS Lambda** - Serverless API endpoints (via Next.js API routes)

## Directory Structure

```
src/
├── app/               # Next.js App Router pages and layouts
├── components/        # Reusable React components
├── config/            # Configuration system
├── context/           # React context providers
├── hooks/             # Custom React hooks
├── lib/               # Core services and utilities
│   ├── api-client.ts  # Unified API client
│   ├── auth.ts        # Authentication service
│   └── security/      # Security utilities and monitoring
├── styles/            # Global styles
└── types/             # TypeScript type definitions
```

## Best Practices

1. **Type Safety** - Comprehensive TypeScript type definitions for all APIs and data structures
2. **Error Handling** - Structured error handling with proper logging
3. **Security Controls** - CSRF protection, input validation, and output encoding
4. **Performance Optimization** - Caching strategies and code splitting
5. **Authentication** - Multi-factor authentication support and secure session management

## Code Examples

### Setting Up the Application

```typescript
// In src/app/layout.tsx
import { ClientProviders } from '@/components/ClientProviders';
import config from '@/config';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
```

### Protecting Routes

```typescript
// In src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireRoles } from '@/lib/auth';

export default async function middleware(req: NextRequest) {
  // Protect admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    return requireRoles(['admin'])(req);
  }
  
  // Protect buyer routes
  if (req.nextUrl.pathname.startsWith('/buyer')) {
    return requireRoles(['buyer', 'admin'])(req);
  }
  
  return NextResponse.next();
}
```

## Deployment

The application is deployed using AWS Amplify:

1. **amplify.yml** - Defines build and deployment configuration
2. **Environment Variables** - Securely stored in Amplify Console
3. **Branch-based Deployments** - Each environment has its own branch
4. **Preview Deployments** - Pull request previews for testing changes

## Monitoring and Observability

1. **Authentication Logging** - Tracks login attempts and security events
2. **API Performance Monitoring** - Tracks API call performance
3. **Security Violation Reporting** - Detects and reports security violations
4. **Error Tracking** - Captures and reports client and server errors