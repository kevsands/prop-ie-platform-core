# Security Architecture & Implementation Guide

This document outlines the security architecture, implementation details, and best practices for the Prop IE AWS application.

## Table of Contents

1. [Authentication](#authentication)
2. [API Security](#api-security)
3. [Configuration Management](#configuration-management)
4. [Security Monitoring & Logging](#security-monitoring--logging)
5. [CSRF Protection](#csrf-protection)
6. [URL Safety](#url-safety)
7. [Data Sanitization](#data-sanitization)
8. [Performance Monitoring](#performance-monitoring)
9. [Role-Based Access Control](#role-based-access-control)
10. [Security Best Practices](#security-best-practices)

## Authentication

### Overview

The application uses AWS Amplify Authentication (Cognito) as the primary authentication provider. It includes:

- JWT-based authentication with standard claims
- Role-based permissions stored in Cognito groups
- Token refresh and validation
- Security logging for authentication events
- Server-side JWT verification with JWKS

### Implementation Details

The authentication is implemented in `/src/lib/auth.ts` which provides:

1. **Client-side authentication functions**:
   - `signInUser`: Authenticates a user with username and password
   - `signUpUser`: Registers a new user
   - `signOutUser`: Signs out the current user
   - `getAuthenticatedUser`: Gets the current authenticated user

2. **Server-side JWT verification**:
   - `verifyAuth`: Middleware for API routes to verify JWT tokens
   - `requireRoles`: Factory function for role-based access control
   - `getUserFromCookie`: Extract user information from JWT cookie

3. **Security Logging**:
   - Comprehensive logging of authentication events
   - Suspicious activity detection
   - Security incident tracking

### Code Example

```typescript
// Client side authentication
import { authService } from '@/lib/auth';

// Login
try {
  const response = await authService.login({ 
    email: 'user@example.com', 
    password: 'password' 
  });
  console.log('User authenticated:', response.user);
} catch (error) {
  console.error('Login failed:', error);
}

// Server-side middleware
import { requireRoles } from '@/lib/auth';

// Only allow admin and developer roles
const adminMiddleware = requireRoles(['admin', 'developer']);

// Use in API route
export async function GET(req: Request) {
  const result = await adminMiddleware(req);
  if (result) return result; // Return error response if auth failed
  
  // Continue with authenticated request
}
```

## API Security

### Overview

The API layer is protected through a unified API client that provides:

- Consistent authentication token handling
- CSRF protection
- Request/response encryption when needed
- Error normalization
- Performance monitoring

### Implementation Details

The API client is implemented in `/src/lib/api-client.ts` and provides:

1. **Unified client for both REST and GraphQL APIs**:
   - Automatically handles auth tokens
   - Supports both Amplify and custom endpoints
   - Type-safe request/response handling

2. **CSRF Protection**:
   - Auto-inclusion of CSRF tokens for state-changing operations
   - Validation of CSRF tokens on server
   - Security reporting for CSRF violations

3. **Error Handling**:
   - Consistent error format using `ApiError` class
   - Status code normalization
   - Detailed error information for debugging (in development)

### Code Example

```typescript
import { api } from '@/lib/api-client';

// GET request with automatic auth
const user = await api.get<User>('/api/users/me');

// POST request with CSRF protection
const result = await api.post<CreatePropertyResult>(
  '/api/properties',
  { name: 'New Property', location: '123 Main St' }
);

// GraphQL query
const data = await api.graphql<ProjectData>(
  `query GetProject($id: ID!) {
    project(id: $id) {
      id
      name
      status
    }
  }`,
  { id: 'project-123' }
);

// Error handling
try {
  await api.get('/api/protected-resource');
} catch (error) {
  if (error instanceof ApiError && error.statusCode === 403) {
    // Handle forbidden error
  }
}
```

## Configuration Management

### Overview

A unified configuration system provides consistent environment-aware configuration for all parts of the application:

- Environment detection (local, development, staging, production)
- Service configuration (API endpoints, auth providers)
- Feature flags
- Security settings

### Implementation Details

The configuration system is implemented in `/src/config/index.ts` and provides:

1. **Environment Detection**:
   - Auto-detection based on hostname
   - Support for explicit environment override
   - Default fallbacks for safety

2. **Configuration Schema**:
   - Type-safe configuration with TypeScript interfaces
   - Required and optional configuration properties
   - Default values for all settings

3. **Service Configuration**:
   - API endpoints and versions
   - Auth providers and settings
   - Storage locations

### Code Example

```typescript
import { config } from '@/config';

// Access configuration
const apiEndpoint = config.api.endpoint;
const isAnalyticsEnabled = config.features.enableAnalytics;

// Type-safe access
import { getConfig } from '@/config';
const authSettings = getConfig('auth');
```

## Security Monitoring & Logging

### Overview

Comprehensive security monitoring and logging is provided through:

- Authentication event logging
- API request/response monitoring
- Security violation detection
- Suspicious activity reporting

### Implementation Details

Security monitoring is implemented in:

1. **Auth Logging** (`/src/lib/security/authLogger.ts`):
   - Login success/failure tracking
   - Registration and password reset monitoring
   - Role change auditing

2. **Security Monitoring** (`/src/lib/security/useSecurityMonitor.ts`):
   - DOM manipulation detection
   - XSS attempt detection
   - Suspicious redirects
   - CSRF vulnerabilities

3. **API Monitoring** (`/src/lib/monitoring/apiPerformance.ts`):
   - Request/response times
   - Error rates
   - Performance degradation detection
   - API abuse detection

### Code Example

```typescript
// Authentication logging
import { logLoginSuccess, logLoginFailure } from '@/lib/security/authLogger';

// Log successful login
logLoginSuccess(user.id, user.email, { ipAddress: '192.168.1.1' });

// Client-side security monitoring
import { useSecurityMonitor } from '@/lib/security/useSecurityMonitor';

function SecureComponent() {
  const { violations, isBlocked } = useSecurityMonitor({
    enableRedirectProtection: true,
    enableXSSDetection: true,
    blockOnCriticalViolations: true
  });
  
  // Rest of component
}
```

## CSRF Protection

### Overview

CSRF protection is implemented through:

- Token-based validation for state-changing operations
- Automated token inclusion in API requests
- Server-side validation

### Implementation Details

CSRF protection is implemented in:

1. **API Client** (`/src/lib/api-client.ts`):
   - Automatic token inclusion in headers
   - Token refresh on expiration

2. **Security Middleware** (`/src/middleware/security.ts`):
   - Token validation for all state-changing routes
   - Security violation reporting

### Code Example

```typescript
// The API client handles CSRF protection automatically
import { api } from '@/lib/api-client';

// For POST, PUT, DELETE operations, CSRF token is automatically included
await api.post('/api/data', { value: 'test' });

// Server-side validation in API route
import { validateCSRFToken } from '@/lib/security';

export async function POST(req: Request) {
  // Will return 403 if CSRF token is invalid
  const result = await validateCSRFToken(req);
  if (result) return result;
  
  // Continue processing request
}
```

## URL Safety

### Overview

URL safety checks protect against malicious redirects and phishing attempts:

- Domain whitelist/blacklist checking
- Suspicious URL pattern detection
- Safe navigation helpers

### Implementation Details

URL safety is implemented in `/src/lib/security/urlSafetyCheck.ts` and provides:

1. **URL Validation**:
   - Regular expression pattern matching for suspicious URLs
   - Known malicious domain checking
   - Trusted domain validation

2. **Safe Navigation**:
   - Safe redirect function with validation
   - Confirmation for external navigation
   - Security attributes for external links

### Code Example

```typescript
import { isUrlSafe, safeNavigate } from '@/lib/security/urlSafetyCheck';

// Check if a URL is safe
const safetyCheck = isUrlSafe('https://example.com/path');
if (!safetyCheck.isSafe) {
  console.error(`Unsafe URL: ${safetyCheck.reason}`);
}

// Safe navigation
try {
  await safeNavigate('https://trusted-domain.com', {
    checkForShorteners: true,
    confirmExternalNavigation: true,
    addNoopener: true
  });
} catch (error) {
  console.error('Navigation blocked:', error);
}
```

## Data Sanitization

### Overview

Data sanitization protects against XSS and injection attacks:

- Input sanitization
- HTML escaping
- URL validation
- JSON sanitization

### Implementation Details

Sanitization is implemented in `/src/lib/security/sanitize.ts` and provides:

1. **HTML Escaping**:
   - Special character escaping
   - HTML tag removal
   - Script removal

2. **Input Sanitization**:
   - Object sanitization for nested objects
   - URL sanitization for links
   - Safe JSON parsing

### Code Example

```typescript
import { escapeHtml, sanitizeObject, safeJsonParse } from '@/lib/security/sanitize';

// Escape HTML
const safeText = escapeHtml('<script>alert("XSS")</script>');

// Sanitize an object
const userInput = { name: '<script>alert("XSS")</script>', age: 30 };
const sanitized = sanitizeObject(userInput);

// Safe JSON parsing
const jsonInput = '{"key": "<script>alert(\\"XSS\\")</script>"}';
const parsed = safeJsonParse(jsonInput);
```

## Performance Monitoring & Security Correlation

### Overview

The application includes comprehensive performance monitoring that integrates with security features:

- Request/response timing with security context
- Error rate tracking with security correlation
- Slow endpoint detection with security impact analysis
- API abuse detection integrated with threat monitoring
- Security-performance correlation analysis

### Implementation Details

Performance monitoring is implemented in several modules:

1. **API Performance** (`/src/lib/monitoring/apiPerformance.ts`):
   - Request timing
   - Success/failure rates
   - Error categorization

2. **Performance Correlation** (`/src/lib/security/performanceCorrelation.ts`):
   - Correlation between security events and performance impacts
   - Security feature performance impact analysis
   - Detection of performance anomalies related to security incidents
   - Optimization recommendations based on security-performance trade-offs

3. **Type System** (`/src/types/common/security-performance.ts`):
   - Unified type system for security and performance metrics
   - Structured correlation interfaces
   - Standardized enumerations and status types
   - Consistent metric definitions

### Code Example

```typescript
import { monitoredApi, getApiPerformanceMetrics } from '@/lib/monitoring/apiPerformance';
import { PerformanceCorrelationService } from '@/lib/security/performanceCorrelation';
import { CorrelationStrength, SeverityLevel } from '@/types/common/security-performance';

// Use monitored API instead of regular API
await monitoredApi.get('/api/data');

// Get performance metrics
const metrics = getApiPerformanceMetrics();
console.log(`Average request time: ${metrics.averageDuration}ms`);
console.log(`Success rate: ${metrics.successRate * 100}%`);

// Check for security correlations
const correlations = await PerformanceCorrelationService.getCorrelations(
  CorrelationStrength.MODERATE,
  SeverityLevel.LOW
);

// Get security feature impacts on performance
const featureImpacts = await PerformanceCorrelationService.getFeatureImpacts();

// Get optimization recommendations
const recommendations = await PerformanceCorrelationService.getRecommendations('optimization');
```

## Role-Based Access Control

### Overview

Role-based access control restricts access to resources based on user roles:

- Role assignments in Cognito groups
- Permission checking in UI components
- Route protection on server

### Implementation Details

RBAC is implemented throughout the application:

1. **Authentication Context** (`/src/components/AuthProvider.tsx`):
   - Role information in the user object
   - Permission checking function

2. **Server Middleware** (`/src/lib/auth.ts`):
   - Role validation for API routes
   - Access control for sensitive operations

### Code Example

```typescript
// Client-side permission check
import { useAuth } from '@/components/AuthProvider';

function AdminPanel() {
  const { user, hasPermission } = useAuth();
  
  if (!hasPermission('admin')) {
    return <AccessDenied />;
  }
  
  return <div>Admin Panel Content</div>;
}

// Server-side role requirement
import { requireRoles } from '@/lib/auth';

export const GET = requireRoles(['admin', 'developer']);
```

## Security Best Practices

1. **Always use the unified API client** for all API calls to ensure consistent security measures.

2. **Validate all user input** with proper sanitization and validation.

3. **Use HTTPS for all communications** - the application enforces this through security headers.

4. **Keep dependencies updated** - regularly run security scans with `npm run security-check`.

5. **Follow the principle of least privilege** when assigning roles.

6. **Use environment-specific settings** through the configuration system.

7. **Monitor security logs** for suspicious activity.

8. **Ensure proper error handling** without leaking sensitive information.

9. **Implement Content Security Policy (CSP)** headers in `next.config.js`.

10. **Use appropriate cache control headers** for sensitive data.

11. **Verify and validate all redirects** using the URL safety utilities.

12. **Implement proper session management** with token refresh and expiration.

13. **Regularly audit security settings** and update as needed.

14. **Use the security monitoring hooks** in components handling sensitive data.