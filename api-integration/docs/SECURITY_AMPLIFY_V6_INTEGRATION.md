# Security Integration with AWS Amplify v6 and Next.js App Router

This document provides a comprehensive guide on integrating AWS Amplify v6 with the security features of our application, specifically for the Next.js App Router architecture.

## Table of Contents

1. [Overview](#overview)
2. [AWS Amplify v6 Migration](#aws-amplify-v6-migration)
3. [Client/Server Separation](#clientserver-separation)
4. [Security Components](#security-components)
5. [MFA Implementation](#mfa-implementation)
6. [Security Monitoring](#security-monitoring)
7. [Security Analytics](#security-analytics)
8. [GraphQL Authentication Integration](#graphql-authentication-integration)
9. [Integration Points](#integration-points)
10. [Implementation Examples](#implementation-examples)
11. [Troubleshooting](#troubleshooting)

## Overview

Our security architecture has been updated to work with AWS Amplify v6 and the Next.js App Router. The updates focus on:

- Migrating from monolithic imports to modular imports
- Proper client/server separation with React Server Components (RSC)
- Performance optimization through caching and lazy loading
- Enhanced security monitoring and analytics
- Improved MFA implementation with support for TOTP and SMS

## AWS Amplify v6 Migration

AWS Amplify v6 introduces a modular import system to reduce bundle size and improve performance. We've updated our security features to use this new import pattern.

### Before (v5)

```typescript
import { Auth } from 'aws-amplify';

async function checkAuth() {
  const user = await Auth.currentAuthenticatedUser();
  return user;
}
```

### After (v6)

```typescript
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

async function checkAuth() {
  const user = await getCurrentUser();
  return user;
}
```

## Client/Server Separation

Next.js App Router requires clear separation between client and server components. Our security architecture now:

1. Uses the `'use client'` directive to mark client components
2. Provides both client and server versions of security APIs
3. Uses React's `cache()` function for server components to optimize data fetching
4. Implements safe server-side functions for security operations

### Server Component Example

```typescript
// src/app/dashboard/security/page.tsx
import { Suspense } from 'react';
import { getSecuritySnapshot } from '@/lib/security/securityAnalyticsServer';
import { SecurityMetricsSkeleton } from '@/components/security/SecurityMetricsSkeleton';
import SecurityDashboardClient from './SecurityDashboardClient';

export default async function SecurityDashboardPage() {
  // Fetch initial security data on the server
  const securitySnapshot = await getSecuritySnapshot({ 
    timeframe: 'last_24_hours',
    includeResolved: false
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Security Dashboard</h1>
      
      <Suspense fallback={<SecurityMetricsSkeleton />}>
        <SecurityDashboardClient 
          initialMetrics={securitySnapshot.metrics}
          initialEvents={securitySnapshot.recentEvents}
          initialAnomalies={securitySnapshot.activeAnomalies}
          initialThreats={securitySnapshot.activeThreatIndicators}
          securityScore={securitySnapshot.securityScore}
          securityStatus={securitySnapshot.securityStatus}
        />
      </Suspense>
    </div>
  );
}
```

### Client Component Example

```typescript
// src/app/dashboard/security/SecurityDashboardClient.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { SecurityAnalyticsClient } from '@/lib/security/securityAnalyticsClient';
import SecurityMonitor from '@/components/security/SecurityMonitor';
import { recordEvent } from 'aws-amplify/analytics';
import { 
  SecurityMetric, 
  SecurityEvent, 
  AnomalyDetection, 
  ThreatIndicator 
} from '@/lib/security/securityAnalyticsTypes';

export default function SecurityDashboardClient({ 
  initialMetrics,
  initialEvents,
  initialAnomalies,
  initialThreats,
  securityScore,
  securityStatus
}) {
  // Client-side state and real-time updates
  const [metrics, setMetrics] = useState(initialMetrics);
  const [events, setEvents] = useState(initialEvents);
  
  // Subscribe to real-time updates
  useEffect(() => {
    const metricUnsubscribe = SecurityAnalyticsClient.on('metric', (metric) => {
      setMetrics(prevMetrics => {
        const index = prevMetrics.findIndex(m => m.id === metric.id);
        if (index === -1) {
          return [...prevMetrics, metric];
        }
        
        const newMetrics = [...prevMetrics];
        newMetrics[index] = metric;
        return newMetrics;
      });
      
      // Record metric update with analytics
      recordEvent({
        name: 'SecurityMetricUpdate',
        attributes: {
          metricName: metric.name,
          value: metric.value
        }
      }).catch(console.error);
    });
    
    // More subscriptions...
    
    return () => {
      metricUnsubscribe();
      // Clean up other subscriptions...
    };
  }, []);
  
  // Rest of the component
}
```

## Security Components

Our security components have been updated to work with AWS Amplify v6 and Next.js App Router:

1. **SecurityMonitor**: Client component that monitors for security violations
2. **AppSecurityProvider**: Context provider for security features
3. **OptimizedSecurityDashboard**: High-performance dashboard for security visualization
4. **SecurityMetricsSkeleton**: Loading skeleton for improved UX during data fetching
5. **MFASetup**: Client component for multi-factor authentication setup with Amplify v6

### Example Usage in App Router Layout

```typescript
// src/app/dashboard/layout.tsx
import { AppSecurityProvider } from '@/components/security/AppSecurityProvider';
import SecurityMonitor from '@/components/security/SecurityMonitor';

export default function DashboardLayout({ children }) {
  return (
    <AppSecurityProvider>
      <SecurityMonitor 
        enableXSSDetection={true}
        enableCSPReporting={true}
        enableFormProtection={true}
        enableInlineScriptChecking={true}
        reportViolationsToBackend={true}
        analyticsEnabled={true}
      />
      <main>{children}</main>
    </AppSecurityProvider>
  );
}
```

## MFA Implementation

The Multi-Factor Authentication (MFA) system has been completely revamped to support AWS Amplify v6 and provide a seamless user experience.

### Key Features

- **TOTP Authentication**: Support for authenticator apps like Google Authenticator
- **SMS Authentication**: Text message code verification
- **Recovery Codes**: Backup access method when primary methods are unavailable
- **Role-Based Enforcement**: Different MFA requirements based on user roles
- **Caching and Performance**: Optimized implementation with minimal API calls

### Implementation

The MFA implementation is divided into two parts:
1. A comprehensive implementation in `src/lib/security/mfa/index.ts`
2. A compatibility layer in `src/lib/security/mfa.ts` that re-exports all functionality

```typescript
// src/lib/security/mfa/index.ts
'use client';

import { 
  confirmSignIn,
  generateTotp,
  updateMFAPreference,
  verifyTOTPSetup,
  getMFAPreference,
  // ...other imports
} from 'aws-amplify/auth';
import { Auth } from '@/lib/amplify/auth';
import { createClientCache } from '@/lib/amplify/cache';

// MFA status cache to prevent excessive API calls
const mfaStatusCache = createClientCache(async () => {
  try {
    const status = await getMFAStatus();
    return status;
  } catch (error) {
    console.warn('Failed to fetch MFA status:', error);
    return {
      enabled: false,
      preferred: 'NONE',
      methods: [],
      phoneVerified: false,
      totpVerified: false,
      recoveryCodesRemaining: 0
    };
  }
});

// Core MFA functions
export async function getMFAStatus(): Promise<MFAStatus> {
  // Implementation details...
}

export async function setupTOTPMFA(): Promise<MFASetupResponse> {
  // Implementation details...
}

export async function verifyTOTPSetupWithCode(code: string): Promise<boolean> {
  // Implementation details...
}

// Export all functions through a service object for easy access
export const MFAService = {
  getMFAStatus,
  getCachedMFAStatus,
  setupTOTPMFA,
  verifyTOTPSetupWithCode,
  setupSMSMFA,
  verifySMSSetup,
  disableMFA,
  // ...other methods
};
```

### MFA Setup Component

```typescript
// src/components/security/MFASetup.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { QRCodeSVG } from 'qrcode.react';
import { Input } from '@/components/ui/input';
import { setupTOTPMFA, verifyTOTPSetupWithCode, MFAService } from '@/lib/security/mfa';

export default function MFASetup() {
  const [setupResponse, setSetupResponse] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const handleSetup = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await setupTOTPMFA();
      setSetupResponse(response);
    } catch (err) {
      setError('Failed to set up MFA: ' + (err.message || String(err)));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }
    
    setIsVerifying(true);
    setError('');
    
    try {
      const result = await verifyTOTPSetupWithCode(verificationCode);
      if (result) {
        setSuccess(true);
      } else {
        setError('Verification failed. Please try again.');
      }
    } catch (err) {
      setError('Failed to verify MFA: ' + (err.message || String(err)));
    } finally {
      setIsVerifying(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Set Up Multi-Factor Authentication</h2>
      <p className="text-gray-600">
        Add an extra layer of security to your account by enabling MFA.
      </p>
      
      {!setupResponse && !success && (
        <Button onClick={handleSetup} disabled={isLoading}>
          {isLoading ? 'Setting up...' : 'Set Up MFA'}
        </Button>
      )}
      
      {setupResponse && setupResponse.setupStatus === 'PENDING_VERIFICATION' && !success && (
        <div className="space-y-4">
          <div className="p-4 bg-white border rounded-lg inline-block">
            {setupResponse.qrCode && (
              <QRCodeSVG value={setupResponse.qrCode} size={200} />
            )}
          </div>
          
          <div>
            <p className="font-medium">Secret Key: {setupResponse.secretKey}</p>
            <p className="text-sm text-gray-600">
              Scan the QR code with your authenticator app or enter the secret key manually.
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Enter the 6-digit verification code from your app
            </label>
            <Input
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="000000"
              maxLength={6}
            />
          </div>
          
          <Button onClick={handleVerify} disabled={isVerifying}>
            {isVerifying ? 'Verifying...' : 'Verify'}
          </Button>
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">
            MFA has been successfully enabled for your account!
          </p>
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
}
```

## GraphQL Authentication Integration

This section details how AWS Amplify v6 authentication integrates with GraphQL operations in the PropIE application.

### Authentication Token Flow

Authentication tokens flow from Amplify Auth to GraphQL operations through these steps:

1. **Token Acquisition**: Tokens are acquired during authentication and stored securely
2. **Token Inclusion**: Tokens are included in GraphQL operation headers
3. **Token Validation**: Server validates tokens before processing operations
4. **User Context Creation**: Valid tokens are used to create user context for resolvers
5. **Authorization Enforcement**: Directives and resolver logic enforce permissions

### Client-Side Integration

The client uses a secure wrapper around Amplify to perform authenticated GraphQL operations:

```typescript
import { SecureAPI } from '@/lib/security/amplify-integration';

// Example authenticated GraphQL query
async function fetchUserData() {
  try {
    const result = await SecureAPI.graphql(`
      query GetCurrentUser {
        me {
          id
          email
          firstName
          lastName
          roles
        }
      }
    `);
    
    return result?.data?.me;
  } catch (error) {
    // Error handling with proper type checking
    if (error.errors?.[0]?.extensions?.code === 'UNAUTHENTICATED') {
      // Handle authentication error
      throw new Error('You must be logged in to access this data');
    } else if (error.errors?.[0]?.extensions?.code === 'FORBIDDEN') {
      // Handle authorization error
      throw new Error('You do not have permission to access this data');
    } else {
      // Handle other errors
      console.error('GraphQL operation failed:', error);
      throw new Error('Failed to fetch user data');
    }
  }
}
```

### SecureAPI Implementation

The SecureAPI wrapper ensures that every GraphQL operation includes proper authentication and security measures:

```typescript
// src/lib/security/amplify-integration.ts
export const SecureAPI = {
  /**
   * Execute a GraphQL query with security features
   */
  async graphql<T>(query: string, variables?: Record<string, any>, options?: any): Promise<T> {
    try {
      // Add security checks before the request
      if (env.featureFlags.enableSessionFingerprinting) {
        const fingerprintValid = await SessionFingerprint.validate();
        if (!fingerprintValid.valid) {
          throw new Error('Invalid session fingerprint: ' + fingerprintValid.reason);
        }
      }
      
      // Get authentication token
      const token = await Auth.getAccessToken();
      
      // Use the API client with security checks
      return await API.graphql<T>({
        query,
        variables,
        authMode: token ? 'AMAZON_COGNITO_USER_POOLS' : 'AWS_IAM',
        authToken: token,
        ...options
      });
    } catch (error) {
      // Log security-related errors
      AuditLogger.logSecurity(
        'secure_api_error',
        AuditSeverity.ERROR,
        `Secure GraphQL operation failed`,
        { 
          error: error instanceof Error ? error.message : String(error),
          query: query.substring(0, 100) + (query.length > 100 ? '...' : '')
        }
      );
      throw error;
    }
  }
};
```

### Server-Side GraphQL Context

On the server, GraphQL operations build authenticated context from tokens:

```typescript
// src/lib/graphql/server.ts
const handler = startServerAndCreateNextHandler(server, {
  context: async ({ req }): Promise<GraphQLContext> => {
    // Extract the authorization token from the headers
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    // Default unauthenticated context
    const defaultContext: GraphQLContext = {
      user: null,
      userRoles: [],
      isAuthenticated: false,
    };
    
    // If no token, return unauthenticated context
    if (!token) {
      return defaultContext;
    }
    
    try {
      // Verify token and get user
      const cognitoUser = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      
      // Parse user roles from Cognito groups
      let roles: string[] = [];
      
      if (attributes["cognito:groups"]) {
        if (Array.isArray(attributes["cognito:groups"])) {
          roles = attributes["cognito:groups"] as string[];
        } else if (typeof attributes["cognito:groups"] === 'string') {
          const groupsStr = attributes["cognito:groups"] as string;
          roles = groupsStr.includes(',')
            ? groupsStr.split(',').map(g => g.trim())
            : [groupsStr];
        }
      }
      
      // Create authenticated context
      return {
        user: {
          userId: cognitoUser.userId,
          username: cognitoUser.username,
          email: attributes.email,
          roles: roles,
        },
        userRoles: roles,
        isAuthenticated: true,
        token,
      };
    } catch (error) {
      console.error('Authentication error in GraphQL context:', error);
      return defaultContext;
    }
  },
});
```

### Authentication Directive

GraphQL operations use an authentication directive to enforce access control:

```typescript
// src/lib/graphql/directives/auth.ts
export function authDirectiveTransformer() {
  return (schema: GraphQLSchema) => {
    return mapSchema(schema, {
      [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
        const authDirective = getDirective(schema, fieldConfig, 'auth')?.[0];
        
        if (authDirective) {
          const { requires } = authDirective;
          const originalResolver = fieldConfig.resolve || defaultFieldResolver;
          
          fieldConfig.resolve = async (source, args, context: GraphQLContext, info) => {
            // Check if the user is authenticated
            if (!context.isAuthenticated || !context.user) {
              throw new AuthenticationError();
            }
            
            // If roles are specified, check if the user has any of them
            if (requires && requires.length > 0) {
              // Admin can access everything
              if (context.userRoles.includes(UserRole.ADMIN)) {
                return originalResolver(source, args, context, info);
              }
              
              // Check if user has any of the required roles
              const hasRole = requires.some(role => 
                context.userRoles.includes(role)
              );
              
              if (!hasRole) {
                throw new ForbiddenError('You do not have the required role for this operation');
              }
            }
            
            // Call the original resolver
            return originalResolver(source, args, context, info);
          };
        }
        
        return fieldConfig;
      },
    });
  };
}
```

### GraphQL Schema Authentication

The GraphQL schema uses the auth directive to enforce authorization:

```graphql
# Example schema with auth directive
type Query {
  # Available to any authenticated user
  me: User @auth
  
  # Requires admin role
  listUsers: [User!]! @auth(requires: [ADMIN])
  
  # Requires developer role
  developments: [Development!]! @auth(requires: [DEVELOPER])
}
```

### Error Handling

GraphQL errors related to authentication are standardized:

```typescript
// Authentication error - user is not logged in
export class AuthenticationError extends ApolloError {
  constructor(message = 'You must be logged in to perform this action') {
    super(message, 'UNAUTHENTICATED');
  }
}

// Authorization error - user lacks required permissions
export class ForbiddenError extends ApolloError {
  constructor(message = 'You do not have permission to perform this action') {
    super(message, 'FORBIDDEN');
  }
}
```

These errors are returned to the client as GraphQL errors:

```json
{
  "errors": [
    {
      "message": "You must be logged in to perform this action",
      "extensions": {
        "code": "UNAUTHENTICATED"
      }
    }
  ]
}
```

### Best Practices for Authenticated GraphQL

1. **Always use SecureAPI**: Never use direct GraphQL calls without security
2. **Handle auth errors explicitly**: Check for UNAUTHENTICATED and FORBIDDEN codes
3. **Define clear role requirements**: Use `@auth(requires: [ROLE])` directives
4. **Validate input**: Always validate input before processing
5. **Use proper error types**: Return AuthenticationError or ForbiddenError
6. **Audit sensitive operations**: Log security events for sensitive mutations
7. **Implement rate limiting**: Protect against abuse with rate limiting

## Security Monitoring

The security monitoring system has been updated to use Amplify v6 for reporting security violations:

1. **useSecurityMonitor hook**: Client-side hook for detecting and reporting security issues
2. **SecurityMonitor component**: UI component that uses the hook and displays alerts

### Key Features

- XSS detection and prevention
- CSRF token validation
- Suspicious redirect blocking
- CSP violation reporting
- Inline script monitoring
- DOM tampering detection

### Implementation Example

```typescript
'use client';

import { post } from 'aws-amplify/api';
import { recordEvent } from 'aws-amplify/analytics';

// Inside the hook
const recordViolation = (violation) => {
  const fullViolation = {
    ...violation,
    timestamp: Date.now(),
    url: typeof window !== 'undefined' ? window.location.href : '',
  };

  // Use AWS Amplify v6 API for reporting
  post({
    apiName: 'SecurityAPI',
    path: '/api/security/report',
    options: {
      headers: { 'Content-Type': 'application/json' },
      body: { violation: fullViolation }
    }
  }).catch(err => {
    console.error('Failed to report security violation:', err);
    
    // Fallback to regular fetch if Amplify API fails
    fetch('/api/security/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ violation: fullViolation }),
      credentials: 'same-origin'
    }).catch(err => console.error('Failed to report security violation with fetch:', err));
  });
  
  // Also record an analytics event
  recordEvent({
    name: 'SecurityViolationDetected',
    attributes: {
      type: violation.type,
      severity: violation.severity,
      url: fullViolation.url
    }
  }).catch(err => {
    console.error('Failed to record security violation to analytics:', err);
  });
};
```

## Security Analytics

The Security Analytics system has been split into client and server components:

1. **securityAnalyticsTypes.ts**: Shared types between client and server
2. **securityAnalyticsServer.ts**: Server-side functions with React's `cache()`
3. **securityAnalyticsClient.ts**: Client-side class with real-time updates

### Type Definitions

```typescript
// src/lib/security/securityAnalyticsTypes.ts
/**
 * Security metric data point
 * Represents a single security measurement or indicator
 */
export interface SecurityMetric {
  id: string;
  name: string;
  value: number;
  timestamp: Date;
  category: string;
  valueType: 'count' | 'percentage' | 'duration' | 'score';
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  status?: 'normal' | 'warning' | 'critical';
  source?: string;
  metadata?: Record<string, any>;
}

/**
 * Security event record
 * Represents a security-relevant activity or occurrence
 */
export interface SecurityEvent {
  id: string;
  type: string;
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  source: string;
  details: Record<string, any>;
  relatedEntities?: string[];
  status: 'detected' | 'investigating' | 'mitigated' | 'resolved';
  actionTaken?: string;
  userId?: string;
  ipAddress?: string;
  resource?: string;
  resourceId?: string;
  description?: string;
  relatedEvents?: string[];
}

// More type definitions...
```

### Server-Side Implementation

```typescript
// src/lib/security/securityAnalyticsServer.ts
import { cache } from 'react';
import { API } from '@/lib/amplify/api';
import type { SecurityMetric, SecurityEvent, SecuritySnapshot } from './securityAnalyticsTypes';

export const getSecurityMetrics = cache(
  async (options = {}): Promise<SecurityMetric[]> => {
    const queryParams = optionsToParams(options);
    
    try {
      const metrics = await API.get<SecurityMetric[]>('/api/security/metrics', queryParams);
      return metrics;
    } catch (error) {
      console.error('Error fetching security metrics:', error);
      return [];
    }
  }
);

// Comprehensive security snapshot
export const getSecuritySnapshot = cache(
  async (options = {}): Promise<SecuritySnapshot> => {
    try {
      // Fetch all data in parallel for performance
      const [metrics, events, anomalies, threats] = await Promise.all([
        getSecurityMetrics(options),
        getSecurityEvents({...options, limit: 10}), // Limit recent events
        getAnomalyDetections({
          ...options, 
          includeResolved: false // Only include active anomalies
        }),
        getThreatIndicators(options)
      ]);
      
      // Calculate security score and status
      const securityScore = calculateSecurityScore(metrics, anomalies, threats);
      const securityStatus = determineSecurityStatus(anomalies, threats);
      
      return {
        timestamp: new Date(),
        metrics,
        recentEvents: events,
        activeAnomalies: anomalies,
        activeThreatIndicators: threats,
        securityScore,
        securityStatus,
        alertCount: {
          low: countSeverity(anomalies, threats, 'low'),
          medium: countSeverity(anomalies, threats, 'medium'),
          high: countSeverity(anomalies, threats, 'high'),
          critical: countSeverity(anomalies, threats, 'critical')
        }
      };
    } catch (error) {
      console.error('Error fetching security snapshot:', error);
      return createEmptySnapshot();
    }
  }
);

// More server-side functions...
```

### Client-Side Implementation

```typescript
// src/lib/security/securityAnalyticsClient.ts
'use client';

import { get, post } from 'aws-amplify/api';
import type { SecurityMetric, SecurityEvent } from './securityAnalyticsTypes';
import { ttlCache, asyncSafeCache } from '../utils/safeCache';

class EnhancedAnalyticsService {
  private sseConnection: EventSource | null = null;
  private eventHandlers: Map<string, Set<(data: any) => void>> = new Map();

  // Initialize with EventSource for real-time updates
  initialize(): void {
    this.connectToSSE();
  }
  
  /**
   * Fetch security metrics with caching and performance optimization
   */
  getMetrics = asyncSafeCache({
    cacheTTL: 60 * 1000, // 1 minute
    includeArguments: true
  })(
    async function(options = {}): Promise<SecurityMetric[]> {
      try {
        const response = await get({
          apiName: 'SecurityAPI',
          path: '/api/security/metrics',
          options: {
            queryParams: this.optionsToParams(options)
          }
        });
        
        return response.body.json();
      } catch (error) {
        console.error('Error fetching metrics:', error);
        return [];
      }
    }
  );
  
  /**
   * Subscribe to real-time security events
   */
  on(
    eventType: 'metric' | 'event' | 'anomaly' | 'threat' | 'correlation' | 'snapshot',
    handler: (data: any) => void
  ): () => void {
    // Add event handler to the map
    let handlers = this.eventHandlers.get(eventType);
    if (!handlers) {
      handlers = new Set();
      this.eventHandlers.set(eventType, handlers);
    }
    handlers.add(handler);
    
    // Return unsubscribe function
    return () => {
      const handlers = this.eventHandlers.get(eventType);
      if (handlers) {
        handlers.delete(handler);
      }
    };
  }
  
  // More methods...
}

export const SecurityAnalyticsClient = new EnhancedAnalyticsService();
```

## Integration Points

The security system integrates with AWS Amplify at several key points:

1. **Authentication**: Uses `aws-amplify/auth` for user authentication and MFA
2. **API**: Uses `aws-amplify/api` for client requests and `@/lib/amplify/api` for server requests
3. **Analytics**: Uses `aws-amplify/analytics` for event tracking
4. **Storage**: Uses `aws-amplify/storage` for secure file operations

### API Route Handlers

```typescript
// src/app/api/security/report/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withAuthenticatedAPIRoute } from '@/lib/auth/apiMiddleware';
import { createSecurityEvent } from '@/lib/security/securityEvents';

async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }
  
  const body = await req.json();
  const { violation } = body;
  
  try {
    await createSecurityEvent(violation);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating security event:', error);
    return NextResponse.json(
      { error: 'Failed to create security event' }, 
      { status: 500 }
    );
  }
}

export const POST = withAuthenticatedAPIRoute(handler);
```

## Implementation Examples

### Protected Routes with Amplify Auth in App Router

Here's an example of how to implement protected routes using Amplify Auth v6 with Next.js App Router:

```typescript
// src/components/auth/ProtectedRoute.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string | string[];
  fallback?: ReactNode;
}

export const ProtectedRoute = ({ children, requiredRole, fallback }: ProtectedRouteProps) => {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();
  
  useEffect(() => {
    if (!isLoading) {
      // Redirect to login if not authenticated
      if (!isAuthenticated) {
        router.push('/login');
      } 
      // Check if user has required role(s)
      else if (requiredRole && user) {
        const roles = user.roles || [];
        const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        
        // Check if user has any of the required roles
        const hasRequiredRole = requiredRoles.some(role => roles.includes(role));
        
        if (!hasRequiredRole) {
          // Redirect to dashboard or another appropriate page
          router.push('/dashboard');
        }
      }
    }
  }, [isAuthenticated, isLoading, router, user, requiredRole]);
  
  if (isLoading) {
    return fallback || <div>Loading...</div>;
  }
  
  // Only render children if authenticated and role requirements are met
  const hasRequiredRole = requiredRole 
    ? user?.roles?.some(role => {
        const required = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        return required.includes(role);
      })
    : true;
  
  return (isAuthenticated && hasRequiredRole) ? <>{children}</> : null;
};

export default ProtectedRoute;
```

### Using Protected Route in App Router Pages

```typescript
// src/app/developer/page.tsx
import { Suspense } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DeveloperDashboard from '@/components/developer/DeveloperDashboard';
import DeveloperDashboardSkeleton from '@/components/developer/DeveloperDashboardSkeleton';

export default function DeveloperPage() {
  return (
    <ProtectedRoute 
      requiredRole={['DEVELOPER', 'ADMIN']}
      fallback={<DeveloperDashboardSkeleton />}
    >
      <Suspense fallback={<DeveloperDashboardSkeleton />}>
        <DeveloperDashboard />
      </Suspense>
    </ProtectedRoute>
  );
}
```

### Auth Context Provider with Amplify v6

```typescript
// src/context/AuthContext.tsx
'use client';

import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect,
  useMemo
} from 'react';
import { 
  getCurrentUser,
  fetchUserAttributes,
  fetchAuthSession,
  signIn,
  signOut
} from 'aws-amplify/auth';
import { Auth } from '@/lib/amplify/auth';
import { Hub } from 'aws-amplify/utils';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  signIn: (credentials: { username: string; password: string }) => Promise<any>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  
  const checkAuthState = async () => {
    try {
      setIsLoading(true);
      const user = await Auth.getCurrentUser();
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    checkAuthState();
    
    // Listen for auth events
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signIn':
          checkAuthState();
          break;
        case 'signOut':
          setIsAuthenticated(false);
          setUser(null);
          break;
        case 'tokenRefresh':
          checkAuthState();
          break;
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, []);
  
  const handleSignIn = async (credentials: { username: string; password: string }) => {
    return Auth.signIn(credentials);
  };
  
  const handleSignOut = async () => {
    await Auth.signOut();
    setIsAuthenticated(false);
    setUser(null);
  };
  
  const refreshSession = async () => {
    await fetchAuthSession({ forceRefresh: true });
    await checkAuthState();
  };
  
  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      user,
      signIn: handleSignIn,
      signOut: handleSignOut,
      refreshSession
    }),
    [isAuthenticated, isLoading, user]
  );
  
  return (
    <AuthContext.Provider value={value}>
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

### Security Dashboard with Amplify v6 and App Router

```typescript
// src/app/dashboard/security/EnhancedSecurityDashboardPage.tsx
import { Suspense } from 'react';
import { getSecuritySnapshot } from '@/lib/security/securityAnalyticsServer';
import { SecurityMetricsSkeleton } from '@/components/security/SecurityMetricsSkeleton';
import { Metadata } from 'next';
import SecurityDashboardClient from './SecurityDashboardClient';

/**
 * Enhanced Security Dashboard Page (Server Component)
 * Compatible with AWS Amplify v6 and Next.js App Router
 */
export default async function EnhancedSecurityDashboardPage() {
  // Fetch initial security data on the server
  // This uses React cache() internally for optimized data fetching
  const securitySnapshot = await getSecuritySnapshot({ 
    timeframe: 'last_24_hours',
    includeResolved: false,
    withRecommendations: true
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Security Dashboard</h1>
      <p className="text-gray-600 mb-8">
        Monitor and respond to security events with real-time analytics.
      </p>
      
      <Suspense fallback={<SecurityMetricsSkeleton showCharts={true} showTimeline={true} />}>
        <SecurityDashboardClient 
          initialMetrics={securitySnapshot.metrics}
          initialEvents={securitySnapshot.recentEvents}
          initialAnomalies={securitySnapshot.activeAnomalies}
          initialThreats={securitySnapshot.activeThreatIndicators}
          securityScore={securitySnapshot.securityScore}
          securityStatus={securitySnapshot.securityStatus}
        />
      </Suspense>
    </div>
  );
}

// Export metadata for SEO optimization
export const metadata: Metadata = {
  title: 'Security Dashboard | PropIE AWS Platform',
  description: 'Monitor and respond to security events and threats in real-time.',
};
```

## Troubleshooting

### Common Issues and Solutions

1. **Server Component Import Errors**:
   ```
   Error: You're importing a component that needs 'useState'. It only works in a Client Component, not a Server Component.
   ```
   
   Solution: Add the `'use client'` directive at the top of your file, or move the component to a separate client component file.

2. **Amplify v6 API Errors**:
   ```
   Error: The API call has not been configured for the API 'SecurityAPI'.
   ```
   
   Solution: Ensure that the API is properly configured in your Amplify configuration file (aws-exports.js or amplify.config.ts).

3. **React Cache Errors**:
   ```
   Error: Cache functions must be called in a module or server component.
   ```
   
   Solution: Ensure that cache functions are only called in server components or modules, not in client components.

4. **GraphQL Authentication Errors**:
   ```
   Error: You must be logged in to perform this action
   ```

   Solution: Check that the auth token is being properly included in GraphQL requests and that the token is valid and not expired.

5. **MFA Verification Issues**:
   ```
   Error: The MFA verification failed. Please try again.
   ```
   
   Solution: Check that the MFA implementation is properly using the Amplify v6 APIs for TOTP and SMS verification.

### Best Practices

1. Always use modular imports from Amplify v6
2. Mark all client components with 'use client' directive
3. Use React's cache() for server-side data fetching
4. Implement proper cleanup for all event listeners
5. Use try/catch blocks for error handling in async functions
6. Provide fallback UI with Suspense for loading states
7. Keep analytics calls separate from core functionality with proper error handling
8. Use the SecureAPI wrapper for all GraphQL operations
9. Implement proper error handling for all authentication-related operations
10. Follow role-based access control consistently