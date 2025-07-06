# Security Architecture

This document outlines the comprehensive security architecture of the PropIE application, covering all layers of the system including authentication, API security, data protection, and infrastructure security.

## Table of Contents

1. [Authentication System](#authentication-system)
2. [Multi-Factor Authentication](#multi-factor-authentication)
3. [Session Security](#session-security)
4. [API Security](#api-security)
5. [Data Protection](#data-protection)
6. [Security Monitoring](#security-monitoring)
7. [Infrastructure Security](#infrastructure-security)
8. [Security Testing](#security-testing)
9. [Incident Response](#incident-response)
10. [Implementation Best Practices](#implementation-best-practices)

## Authentication System

### Architecture

The application uses AWS Cognito as the primary authentication provider, implemented through AWS Amplify v6 with modular imports. Key features:

- **User Pools**: Separate user pools for different environments
- **Identity Pools**: For AWS service access control
- **JWT Tokens**: Secure token-based authentication
- **Role-Based Access Control**: Using Cognito groups for roles
- **Password Policies**: Enforcing strong password requirements
- **App Router Compatible**: Works with Next.js App Router architecture

### Implementation

```typescript
// src/lib/amplify/auth.ts
import {
  signIn as amplifySignIn,
  signUp as amplifySignUp,
  signOut as amplifySignOut,
  confirmSignUp,
  resetPassword,
  confirmResetPassword,
  confirmSignIn,
  getCurrentUser,
  fetchUserAttributes,
  fetchAuthSession
} from 'aws-amplify/auth';

export class Auth {
  static async signIn({ username, password }: SignInParams): Promise<SignInResult> {
    initialize();
    try {
      const result = await amplifySignIn({ username, password });
      return result;
    } catch (error) {
      this.handleAuthError(error, 'signIn');
      throw error;
    }
  }
  
  // Other authentication methods...
}
```

### Token Handling

1. **JWT Verification**: Validating tokens on each request
2. **Token Refresh**: Automatic refresh of expired tokens
3. **Token Storage**: Secure storage in browser

```typescript
// Token validation example in API routes
import { verifyToken } from '@/lib/security/tokenValidator';

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    const decoded = await verifyToken(token);
    // Continue with authenticated request...
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
```

## Multi-Factor Authentication

### Architecture

- **TOTP-Based MFA**: Time-based One-Time Password
- **SMS Verification**: Phone number verification
- **Adaptive MFA**: Risk-based MFA challenges

### Implementation

```typescript
// src/lib/amplify/auth/mfa.ts
export class MFAService {
  static async setupTOTP(): Promise<MFASetupResponse> {
    initialize();
    try {
      await getCurrentUser();
      const totpSetup = await setUpTOTP();
      
      return {
        secretCode: totpSetup.secretKey,
        qrCode: totpSetup.getSetupUri(true)
      };
    } catch (error) {
      console.error('Error setting up TOTP:', error);
      throw error;
    }
  }
  
  // Other MFA methods...
}
```

## Session Security

### Session Fingerprinting

Session fingerprinting provides an additional layer of security by creating a unique identifier for each user session based on browser and device characteristics. This helps detect potential session hijacking attempts.

```typescript
// src/lib/security/sessionFingerprint.ts
export class SessionFingerprint {
  static async generate(): Promise<string> {
    try {
      const user = await getCurrentUser().catch(() => null);
      const userId = user ? user.userId : 'anonymous';
      
      const clientInfo = this.getClientInfo();
      
      const fingerprintData = JSON.stringify({
        userId,
        clientInfo,
        timestamp: Date.now(),
        random: Math.random().toString(36).substring(2, 15)
      });
      
      const fingerprint = SHA256(fingerprintData).toString();
      
      // Store the fingerprint for validation
      if (typeof window !== 'undefined') {
        window[STORAGE_TYPE].setItem(SESSION_FINGERPRINT_KEY, fingerprint);
        window[STORAGE_TYPE].setItem(SESSION_FINGERPRINT_TIMESTAMP_KEY, Date.now().toString());
      }
      
      return fingerprint;
    } catch (error) {
      console.error('Error generating session fingerprint:', error);
      return '';
    }
  }
  
  // Other session methods...
}
```

### Session Management

- **Inactivity Timeout**: Automatic logout after inactivity
- **Concurrent Sessions**: Limiting concurrent sessions per user
- **Secure Cookies**: Using HttpOnly and Secure flags
- **CSRF Protection**: Tokens for cross-site request forgery prevention

## API Security

### Rate Limiting and Abuse Detection

The application implements rate limiting and abuse detection to protect API endpoints from excessive usage and potential attacks.

```typescript
// src/lib/security/rateLimit.ts
export class RateLimiter {
  static checkRateLimit(
    endpoint: string, 
    category: 'auth' | 'api' | 'mutation' | 'query' | 'default' = 'default'
  ): { allowed: boolean; reason?: string; retryAfter?: number } {
    // Get rate limit config for this category
    const config = DEFAULT_RATE_LIMITS[category] || DEFAULT_RATE_LIMITS.default;
    
    // Find or create entry for this endpoint
    let entry = this.rateLimitEntries.find(e => e.endpoint === endpoint);
    
    // Rate limiting implementation...
    
    return { allowed: true };
  }
  
  // Other rate limiting methods...
}
```

### API Request Validation

- **Input Validation**: Validating all API inputs
- **Schema Validation**: Using JSON Schema for request validation
- **Parameter Sanitization**: Preventing injection attacks

```typescript
// Example of Zod schema validation
import { z } from 'zod';

const UserSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(['admin', 'user', 'developer'])
});

export default async function handler(req, res) {
  try {
    const validatedData = UserSchema.parse(req.body);
    // Continue with validated data...
  } catch (error) {
    return res.status(400).json({ message: 'Invalid input data' });
  }
}
```

### GraphQL Security

- **Query Depth Limiting**: Preventing nested query attacks
- **Query Complexity Analysis**: Limiting complex queries
- **Field-Level Permissions**: Controlling access to specific fields

## Data Protection

### Data Encryption

- **At Rest**: AWS S3 server-side encryption
- **In Transit**: HTTPS/TLS for all communications
- **Database**: DynamoDB encryption
- **Sensitive Fields**: Field-level encryption for PII

### Data Access Controls

- **Fine-grained IAM Policies**: AWS IAM for service access
- **Row-Level Security**: Database-level access controls
- **GDPR Compliance**: Data minimization and retention policies

## React Server Components Security

### Client-Server Separation

The security architecture is designed with React Server Components (RSC) in mind, properly separating client and server-side code:

- **Client Components**: Marked with 'use client' directive, include UI rendering and interactivity
- **Server Components**: Handle data fetching and sensitive operations
- **Security Boundaries**: Clear boundaries defined between client and server concerns

```typescript
// Server component example (app/dashboard/security/page.tsx)
import { getSecuritySnapshot } from '@/lib/security/securityAnalyticsServer';
import OptimizedSecurityDashboard from '@/components/security/OptimizedSecurityDashboard';

export default async function SecurityDashboardPage() {
  // Server-side data fetching for initial state
  const securitySnapshot = await getSecuritySnapshot();
  
  return (
    <OptimizedSecurityDashboard 
      initialMetrics={securitySnapshot.metrics}
    />
  );
}
```

```typescript
// Client component example (components/security/OptimizedSecurityDashboard.tsx)
'use client';

import { SecurityAnalyticsClient } from '@/lib/security/securityAnalyticsClient';
import { useState, useEffect } from 'react';

export default function OptimizedSecurityDashboard({ initialMetrics }) {
  // Client-side state management and interactivity
  const [metrics, setMetrics] = useState(initialMetrics);
  
  // Real-time updates with client APIs
  useEffect(() => {
    const unsubscribe = SecurityAnalyticsClient.on('metric', (newMetric) => {
      setMetrics(current => 
        current.map(m => m.id === newMetric.id ? newMetric : m)
      );
    });
    
    return () => unsubscribe();
  }, []);
  
  // Component UI rendering...
}
```

### Server-Safe Security APIs

To enable proper functioning with RSC, security APIs have been split into server and client versions:

- **Server APIs**: Use React's `cache()` function for request deduplication
- **Client APIs**: Handle real-time updates and interactive features
- **Shared Types**: Common type definitions used by both client and server

```typescript
// Server-side API example (lib/security/securityAnalyticsServer.ts)
import { cache } from 'react';

export const getSecurityMetrics = cache(
  async (options = {}): Promise<SecurityMetric[]> => {
    const queryParams = optionsToParams(options);
    const metrics = await API.get<SecurityMetric[]>('/api/security/metrics', queryParams);
    return metrics;
  }
);
```

### Type-Safe Security Interfaces

Security types are shared between client and server to ensure consistency:

```typescript
// Shared types (lib/security/securityAnalyticsTypes.ts)
export interface SecurityMetric {
  id: string;
  name: string;
  value: number;
  timestamp: Date;
  category: string;
  valueType: 'count' | 'percentage' | 'duration' | 'score';
  trend?: 'up' | 'down' | 'stable';
  status?: 'normal' | 'warning' | 'critical';
}
```

## Security Monitoring

### Audit Logging

Comprehensive audit logging captures security-relevant events across the application.

```typescript
// src/lib/security/auditLogger.ts
export class AuditLogger {
  static async log(event: Omit<AuditEvent, 'timestamp' | 'eventId' | 'sessionId'>): Promise<void> {
    // Initialize if not already done
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    try {
      // Get current user information
      const user = await getCurrentUser().catch(() => null);
      
      // Build the complete audit event
      const completeEvent: AuditEvent = {
        ...event,
        timestamp: Date.now(),
        eventId: this.generateEventId(),
        sessionId: this.sessionId || undefined,
        userId: user?.userId || event.userId,
        userName: user?.username || event.userName,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
        ipAddress: await this.getClientIp()
      };
      
      // Send event to server if online
      if (navigator.onLine) {
        await this.sendEvent(completeEvent);
      } else {
        // Otherwise buffer it for later
        this.bufferEvent(completeEvent);
      }
    } catch (error) {
      console.error('Error logging audit event:', error);
      // Buffer the event if sending failed
      if (event) {
        this.bufferEvent({
          ...event,
          timestamp: Date.now(),
          eventId: this.generateEventId(),
          sessionId: this.sessionId || undefined
        });
      }
    }
  }
  
  // Other audit logging methods...
}
```

### Real-time Monitoring

- **CloudWatch Alarms**: Alerting on security events
- **API Monitoring**: Tracking API usage patterns
- **Authentication Monitoring**: Detecting suspicious auth activities
- **Anomaly Detection**: Identifying unusual usage patterns

```yaml
# CloudWatch alarm example (from monitoring.yml)
ApiErrorsAlarm:
  Type: AWS::CloudWatch::Alarm
  Properties:
    AlarmName: !Sub ${ApplicationName}-${Environment}-api-errors
    AlarmDescription: Alert when API errors exceed threshold
    MetricName: GraphQLErrors
    Namespace: !Sub "${ApplicationName}/${Environment}/API"
    Statistic: Sum
    Period: 60
    EvaluationPeriods: 5
    Threshold: !If [IsProd, 10, 50]
    ComparisonOperator: GreaterThanThreshold
    TreatMissingData: notBreaching
    AlarmActions:
      - !Ref AlertsTopic
```

## Infrastructure Security

### AWS Security Configuration

- **Least Privilege IAM**: Minimal permissions for each service
- **Security Groups**: Network traffic restrictions
- **VPC Configuration**: Private subnets for sensitive services
- **WAF Integration**: Web Application Firewall protection

```yaml
# WAF configuration (from appsync.yml)
AppSyncWebACL:
  Type: AWS::WAFv2::WebACL
  Properties:
    Name: !Sub ${ApplicationName}-${Environment}-appsync-waf
    Scope: REGIONAL
    DefaultAction:
      Allow: {}
    Rules:
      - Name: RateBasedRule
        Priority: 1
        Statement:
          RateBasedStatement:
            Limit: 1000
            AggregateKeyType: IP
        Action:
          Block: {}
        VisibilityConfig:
          SampledRequestsEnabled: true
          CloudWatchMetricsEnabled: true
          MetricName: RateBasedRule
```

### Deployment Security

- **Infrastructure as Code**: CloudFormation templates
- **CI/CD Security**: Pipeline security checks
- **Secret Management**: AWS Secrets Manager
- **Environment Isolation**: Separate environments for dev/staging/prod

## Security Testing

### Automated Security Testing

- **Static Analysis**: Code scanning for vulnerabilities
- **Dynamic Analysis**: Runtime security testing
- **Dependency Scanning**: Identifying vulnerable dependencies
- **Penetration Testing**: Regular security assessments

### Vulnerability Management

- **Vulnerability Database**: Tracking identified issues
- **Risk Assessment**: Prioritizing vulnerabilities
- **Remediation Process**: Fixing security issues
- **Disclosure Policy**: Responsible disclosure process

## Incident Response

### Detection

- **Security Alerts**: Real-time notification of incidents
- **Anomaly Detection**: Identifying unusual patterns
- **User Reporting**: Process for users to report issues

### Response

- **Response Team**: Designated security responders
- **Playbooks**: Predefined response procedures
- **Communication Plan**: Notification procedures
- **Post-Incident Analysis**: Learning from incidents

## Implementation Best Practices

### Secure Coding

- **Input Validation**: Validating all user inputs
- **Output Encoding**: Preventing XSS vulnerabilities
- **Parameterized Queries**: Preventing SQL injection
- **Safe Dependencies**: Using trusted libraries

### Authentication Best Practices

- **Secure Password Storage**: Using AWS Cognito's secure storage
- **Account Lockout**: Preventing brute force attacks
- **Session Management**: Secure handling of user sessions
- **Multi-Factor Authentication**: Requiring MFA for sensitive actions

### OWASP Top 10 Protection

- **Injection Prevention**: Validating and sanitizing inputs
- **Broken Authentication**: Implementing secure auth flows
- **Sensitive Data Exposure**: Encrypting sensitive data
- **XML External Entities**: Disabling external entity processing
- **Broken Access Control**: Implementing proper authorization
- **Security Misconfiguration**: Using secure defaults
- **Cross-Site Scripting**: Implementing content security policy
- **Insecure Deserialization**: Validating serialized data
- **Using Components with Known Vulnerabilities**: Regular dependency updates
- **Insufficient Logging & Monitoring**: Comprehensive audit logging

## Conclusion

This security architecture provides a comprehensive approach to securing the PropIE application at all levels. By implementing these measures, we create a robust security posture that protects user data, prevents unauthorized access, and enables quick detection and response to security threats.

For specific implementation details, refer to the codebase or contact the security team.