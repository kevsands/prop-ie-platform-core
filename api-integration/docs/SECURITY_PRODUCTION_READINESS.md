# Security Production Readiness Guide

This document provides comprehensive guidance for deploying the security features to production environments. It covers configuration, monitoring, and ongoing maintenance of the security implementation.

## Table of Contents

1. [Production Security Configuration](#production-security-configuration)
2. [Environment-Specific Security Settings](#environment-specific-security-settings)
3. [AWS Amplify v6 Security Integration](#aws-amplify-v6-security-integration)
4. [Next.js App Router Security Configuration](#nextjs-app-router-security-configuration)
5. [Security Monitoring Setup](#security-monitoring-setup)
6. [Incident Response](#incident-response)
7. [Ongoing Maintenance](#ongoing-maintenance)

## Production Security Configuration

### Core Security Configuration

The core security configuration for production environments should be set up in the following file:

```typescript
// src/config/environment.ts

export const productionConfig = {
  security: {
    // Authentication settings
    auth: {
      mfaRequired: true,
      sessionDuration: 3600, // 1 hour in seconds
      refreshTokenDuration: 86400 * 30, // 30 days in seconds
      passwordPolicyMinLength: 12,
      passwordPolicyRequireSymbols: true,
      passwordPolicyRequireNumbers: true,
      passwordPolicyRequireUppercase: true,
      passwordPolicyRequireLowercase: true
    },
    
    // Content Security Policy
    csp: {
      enableStrict: true,
      reportOnly: false,
      reportUri: '/api/security/report'
    },
    
    // Rate limiting
    rateLimit: {
      enabled: true,
      maxRequests: 100,
      windowMs: 60000, // 1 minute
      standardEndpoints: 250, // Higher limit for standard endpoints
      secureEndpoints: 50 // Lower limit for secure endpoints
    },
    
    // Feature flags
    featureFlags: {
      enableSessionFingerprinting: true,
      enableApiProtection: true,
      enableSecurityMonitoring: true,
      enableAuditLogging: true,
      enableMfa: true,
      enableAdvancedThreatDetection: true,
      enablePerformanceCorrelation: true
    }
  }
};
```

### Security Headers Configuration

Make sure these security headers are configured in production:

```javascript
// next.config.js

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  }
];

module.exports = {
  // Other Next.js config...
  
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
};
```

### Content Security Policy

The production CSP should be strict:

```javascript
// next.config.js

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'nonce-INTERNAL_NONCE' https://js.stripe.com https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https://*.amazonaws.com https://cdn.jsdelivr.net;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://*.amazonaws.com https://*.amazoncognito.com https://*.execute-api.us-east-1.amazonaws.com;
  frame-src 'self' https://js.stripe.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  block-all-mixed-content;
  upgrade-insecure-requests;
`;

// Add this to securityHeaders above
{
  key: 'Content-Security-Policy',
  value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
}
```

## Environment-Specific Security Settings

Different environments should have specific security configurations:

### Development

```typescript
// src/config/environment.ts

export const developmentConfig = {
  security: {
    // Authentication settings
    auth: {
      mfaRequired: false, // Optional in development
      sessionDuration: 86400, // 24 hours in seconds
      refreshTokenDuration: 86400 * 30, // 30 days in seconds
      passwordPolicyMinLength: 8, // Less strict in development
      passwordPolicyRequireSymbols: false,
      passwordPolicyRequireNumbers: true,
      passwordPolicyRequireUppercase: false,
      passwordPolicyRequireLowercase: true
    },
    
    // Content Security Policy
    csp: {
      enableStrict: false,
      reportOnly: true, // Report only in development
      reportUri: '/api/security/report'
    },
    
    // Rate limiting
    rateLimit: {
      enabled: false, // Disabled in development
      maxRequests: 1000,
      windowMs: 60000
    },
    
    // Feature flags
    featureFlags: {
      enableSessionFingerprinting: true,
      enableApiProtection: true,
      enableSecurityMonitoring: true,
      enableAuditLogging: true,
      enableMfa: false, // Optional in development
      enableAdvancedThreatDetection: false,
      enablePerformanceCorrelation: true
    }
  }
};
```

### Staging

```typescript
// src/config/environment.ts

export const stagingConfig = {
  security: {
    // Authentication settings
    auth: {
      mfaRequired: true, // Required in staging
      sessionDuration: 3600, // 1 hour in seconds
      refreshTokenDuration: 86400 * 30, // 30 days in seconds
      passwordPolicyMinLength: 12,
      passwordPolicyRequireSymbols: true,
      passwordPolicyRequireNumbers: true,
      passwordPolicyRequireUppercase: true,
      passwordPolicyRequireLowercase: true
    },
    
    // Content Security Policy
    csp: {
      enableStrict: true,
      reportOnly: false, // Enforce in staging
      reportUri: '/api/security/report'
    },
    
    // Rate limiting
    rateLimit: {
      enabled: true, // Enabled in staging
      maxRequests: 200, // Higher than production
      windowMs: 60000
    },
    
    // Feature flags
    featureFlags: {
      enableSessionFingerprinting: true,
      enableApiProtection: true,
      enableSecurityMonitoring: true,
      enableAuditLogging: true,
      enableMfa: true,
      enableAdvancedThreatDetection: true,
      enablePerformanceCorrelation: true
    }
  }
};
```

## AWS Amplify v6 Security Integration

### AWS Amplify Configuration

Configure AWS Amplify v6 with security settings:

```javascript
// src/lib/amplify/config.ts

import { Amplify } from 'aws-amplify';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import { env } from '@/config/environment';

export function configureAmplify() {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: env.cognito.userPoolId,
        userPoolClientId: env.cognito.userPoolClientId,
        identityPoolId: env.cognito.identityPoolId,
        loginWith: {
          email: true,
          username: false,
          phone: false
        },
        mfa: {
          status: env.security.auth.mfaRequired ? 'required' : 'optional',
          totpOptions: {
            issuer: 'PropIE',
            accountName: 'user@example.com' // Will be replaced with user's username
          }
        }
      }
    },
    API: {
      REST: {
        APIGateway: {
          endpoint: env.apiUrl,
          region: env.region
        }
      },
      GraphQL: {
        endpoint: env.appsyncUrl,
        region: env.region,
        defaultAuthMode: 'userPool'
      }
    },
    Storage: {
      S3: {
        bucket: env.s3.bucket,
        region: env.region
      }
    }
  });
  
  // Configure token management for security integration
  cognitoUserPoolsTokenProvider.setKeyValueStorage({
    setItem: async (key, value) => {
      // Secure storage with additional encryption
      sessionStorage.setItem(
        key, 
        await encryptData(value, env.security.encryptionKey)
      );
    },
    getItem: async (key) => {
      const encryptedValue = sessionStorage.getItem(key);
      if (!encryptedValue) return null;
      return decryptData(encryptedValue, env.security.encryptionKey);
    },
    removeItem: (key) => {
      sessionStorage.removeItem(key);
    }
  });
  
  // Initialize security integration
  initializeSecurityAmplifyIntegration();
}
```

### Authentication Security Flow

Secure authentication flow with Amplify v6:

```typescript
// src/lib/auth.ts

import { 
  signIn, 
  confirmSignIn, 
  signOut, 
  getCurrentUser, 
  fetchAuthSession 
} from 'aws-amplify/auth';
import { AuditLogger } from '@/lib/security/auditLogger';
import { SessionFingerprint } from '@/lib/security/sessionFingerprint';

export async function secureSignIn(username: string, password: string) {
  try {
    AuditLogger.logAuth(
      'user_sign_in_attempt', 
      'pending', 
      'User attempting to sign in',
      { username }
    );
    
    const signInResult = await signIn({
      username,
      password,
    });
    
    if (signInResult.isSignedIn) {
      // Generate session fingerprint after successful sign-in
      await SessionFingerprint.generate();
      
      AuditLogger.logAuth(
        'user_sign_in', 
        'success', 
        'User signed in successfully',
        { username }
      );
      
      return signInResult;
    }
    
    if (signInResult.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_SMS_CODE') {
      AuditLogger.logAuth(
        'mfa_challenge', 
        'pending', 
        'MFA challenge issued',
        { username, method: 'SMS' }
      );
    }
    
    if (signInResult.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_TOTP_CODE') {
      AuditLogger.logAuth(
        'mfa_challenge', 
        'pending', 
        'MFA challenge issued',
        { username, method: 'TOTP' }
      );
    }
    
    return signInResult;
  } catch (error) {
    AuditLogger.logAuth(
      'user_sign_in', 
      'failure', 
      'User sign in failed',
      { username, error: error.message }
    );
    
    throw error;
  }
}

export async function secureSignOut() {
  try {
    // Get current user before sign out for logging
    let username = 'unknown';
    try {
      const user = await getCurrentUser();
      username = user.username;
    } catch (e) {
      // User might not be signed in
    }
    
    // Perform sign out
    await signOut();
    
    // Clear session fingerprint
    SessionFingerprint.clear();
    
    AuditLogger.logAuth(
      'user_sign_out', 
      'success', 
      'User signed out successfully',
      { username }
    );
    
    return true;
  } catch (error) {
    AuditLogger.logAuth(
      'user_sign_out', 
      'failure', 
      'User sign out failed',
      { error: error.message }
    );
    
    throw error;
  }
}
```

## Next.js App Router Security Configuration

### Middleware Security

Configure security middleware for Next.js App Router:

```typescript
// src/middleware.ts

import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from './lib/auth';
import { urlSafetyCheck } from './lib/security/urlSafetyCheck';

export async function middleware(request: NextRequest) {
  // Get the pathname
  const pathname = request.nextUrl.pathname;
  
  // Check for authentication on protected routes
  if (pathname.startsWith('/dashboard') || 
      pathname.startsWith('/admin') || 
      pathname.startsWith('/api/secure')) {
    const isAuthed = await isAuthenticated(request);
    
    if (!isAuthed) {
      // Redirect to login page with return URL
      const returnUrl = encodeURIComponent(pathname);
      return NextResponse.redirect(new URL(`/login?returnUrl=${returnUrl}`, request.url));
    }
  }
  
  // URL Safety Check for redirects
  const redirectParam = request.nextUrl.searchParams.get('redirect') || 
                       request.nextUrl.searchParams.get('returnUrl');
  
  if (redirectParam) {
    const safetyResult = urlSafetyCheck.validateUrl(redirectParam);
    
    if (!safetyResult.valid) {
      // Log security event and redirect to home
      console.warn(`Potentially unsafe redirect blocked: ${redirectParam}`);
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  // Add security headers to all responses
  const response = NextResponse.next();
  
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
```

### API Route Security

Secure API routes in the App Router:

```typescript
// src/app/api/[...path]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { validateAuthToken } from '@/lib/auth';
import { validateCSRFToken } from '@/lib/security/apiProtection';
import { AuditLogger } from '@/lib/security/auditLogger';
import { rateLimit } from '@/lib/security/rateLimit';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimit.check(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429, headers: { 'Retry-After': rateLimitResult.retryAfter.toString() } }
      );
    }
    
    // Authenticate request
    const authResult = await validateAuthToken(request);
    if (!authResult.valid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Process the request
    // ...
    
    return NextResponse.json({ data: 'Success' });
  } catch (error) {
    console.error('API error:', error);
    
    // Log security-related errors
    AuditLogger.logSecurity(
      'api_error',
      'ERROR',
      `Error in API route ${params.path.join('/')}`,
      { error: error.message }
    );
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimit.check(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429, headers: { 'Retry-After': rateLimitResult.retryAfter.toString() } }
      );
    }
    
    // Validate CSRF token
    const csrfResult = await validateCSRFToken(request);
    if (!csrfResult.valid) {
      AuditLogger.logSecurity(
        'csrf_validation_failure',
        'WARNING',
        'CSRF token validation failed',
        { path: params.path.join('/') }
      );
      
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      );
    }
    
    // Authenticate request
    const authResult = await validateAuthToken(request);
    if (!authResult.valid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Process the request
    // ...
    
    return NextResponse.json({ data: 'Success' });
  } catch (error) {
    console.error('API error:', error);
    
    // Log security-related errors
    AuditLogger.logSecurity(
      'api_error',
      'ERROR',
      `Error in API route ${params.path.join('/')}`,
      { error: error.message }
    );
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Security Monitoring Setup

### CloudWatch Monitoring

Set up CloudWatch metrics, alarms, and dashboards:

```typescript
// infrastructure/monitoring/cloudwatch-alarms.tf

resource "aws_cloudwatch_metric_alarm" "security_incident_alarm" {
  alarm_name          = "${var.environment}-security-incident-alarm"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "SecurityIncidents"
  namespace           = "PropertyApp/Security"
  period              = "300"
  statistic           = "Sum"
  threshold           = "0"
  alarm_description   = "This alarm monitors for security incidents"
  alarm_actions       = [aws_sns_topic.security_alerts.arn]
  ok_actions          = [aws_sns_topic.security_alerts.arn]
  
  dimensions = {
    Environment = var.environment
  }
}

resource "aws_cloudwatch_metric_alarm" "authentication_failures_alarm" {
  alarm_name          = "${var.environment}-auth-failures-alarm"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "AuthenticationFailures"
  namespace           = "PropertyApp/Security"
  period              = "300"
  statistic           = "Sum"
  threshold           = "5"
  alarm_description   = "This alarm monitors for authentication failures"
  alarm_actions       = [aws_sns_topic.security_alerts.arn]
  ok_actions          = [aws_sns_topic.security_alerts.arn]
  
  dimensions = {
    Environment = var.environment
  }
}

resource "aws_cloudwatch_metric_alarm" "security_performance_alarm" {
  alarm_name          = "${var.environment}-security-performance-alarm"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "3"
  metric_name         = "SecurityOperationOverhead"
  namespace           = "PropertyApp/SecurityPerformance"
  period              = "300"
  statistic           = "Average"
  threshold           = "200"
  alarm_description   = "This alarm monitors for security performance overhead"
  alarm_actions       = [aws_sns_topic.performance_alerts.arn]
  
  dimensions = {
    Environment = var.environment
  }
}
```

### Security Dashboard

Create a security dashboard:

```typescript
// infrastructure/monitoring/dashboard.tf

resource "aws_cloudwatch_dashboard" "security_dashboard" {
  dashboard_name = "${var.environment}-security-dashboard"
  
  dashboard_body = <<EOF
{
  "widgets": [
    {
      "type": "metric",
      "x": 0,
      "y": 0,
      "width": 12,
      "height": 6,
      "properties": {
        "metrics": [
          ["PropertyApp/Security", "SecurityIncidents", "Environment", "${var.environment}"],
          ["PropertyApp/Security", "AuthenticationFailures", "Environment", "${var.environment}"],
          ["PropertyApp/Security", "CSRFValidationFailures", "Environment", "${var.environment}"],
          ["PropertyApp/Security", "RateLimitExceeded", "Environment", "${var.environment}"]
        ],
        "view": "timeSeries",
        "stacked": false,
        "region": "${var.region}",
        "title": "Security Incidents",
        "period": 300
      }
    },
    {
      "type": "metric",
      "x": 12,
      "y": 0,
      "width": 12,
      "height": 6,
      "properties": {
        "metrics": [
          ["PropertyApp/SecurityPerformance", "SecurityOperationOverhead", "Environment", "${var.environment}"],
          ["PropertyApp/SecurityPerformance", "SecurityFeatureLoadTime", "Environment", "${var.environment}"]
        ],
        "view": "timeSeries",
        "stacked": false,
        "region": "${var.region}",
        "title": "Security Performance",
        "period": 300
      }
    },
    {
      "type": "log",
      "x": 0,
      "y": 6,
      "width": 24,
      "height": 6,
      "properties": {
        "query": "SOURCE '/aws/lambda/${var.app_name}-${var.environment}-api' | filter @message like /security|authentication|unauthorized/i | sort @timestamp desc",
        "region": "${var.region}",
        "title": "Security Logs",
        "view": "table"
      }
    }
  ]
}
EOF
}
```

### Security Metrics

Publish security metrics to CloudWatch:

```typescript
// src/lib/security/auditLogger.ts

import { Metrics } from 'aws-amplify/analytics';

export class SecurityMetrics {
  static async publishMetric(name: string, value: number = 1, unit: string = 'Count') {
    try {
      // Publish metric to CloudWatch through Amplify
      await Metrics.record({
        name,
        value,
        unit
      });
      
      console.log(`Published metric: ${name} = ${value} ${unit}`);
    } catch (error) {
      console.error('Error publishing security metric:', error);
    }
  }
  
  static async recordSecurityIncident(type: string) {
    await this.publishMetric('SecurityIncidents');
    await this.publishMetric(`Security_${type}`);
  }
  
  static async recordAuthFailure() {
    await this.publishMetric('AuthenticationFailures');
  }
  
  static async recordCSRFFailure() {
    await this.publishMetric('CSRFValidationFailures');
  }
  
  static async recordRateLimitExceeded() {
    await this.publishMetric('RateLimitExceeded');
  }
  
  static async recordSecurityPerformance(operationName: string, durationMs: number) {
    await this.publishMetric('SecurityOperationOverhead', durationMs, 'Milliseconds');
    await this.publishMetric(`SecurityOperation_${operationName}`, durationMs, 'Milliseconds');
  }
}
```

## Incident Response

### Security Incident Handling

Implement security incident handling:

```typescript
// src/lib/security/incidentResponse.ts

import { AuditLogger, AuditSeverity } from './auditLogger';
import { SecurityMetrics } from './securityMetrics';
import { Auth } from '@/lib/amplify/auth';
import { env } from '@/config/environment';

export enum IncidentType {
  AUTHENTICATION_FAILURE = 'authentication_failure',
  CSRF_VIOLATION = 'csrf_violation',
  XSS_ATTEMPT = 'xss_attempt',
  INJECTION_ATTEMPT = 'injection_attempt',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  MALICIOUS_REDIRECT = 'malicious_redirect',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity'
}

export enum IncidentSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface SecurityIncident {
  type: IncidentType;
  severity: IncidentSeverity;
  description: string;
  timestamp: Date;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  data?: Record<string, any>;
}

export class IncidentResponse {
  static async handleIncident(incident: SecurityIncident): Promise<void> {
    try {
      // Step 1: Log the incident
      await AuditLogger.logSecurity(
        incident.type,
        this.mapSeverity(incident.severity),
        incident.description,
        incident.data
      );
      
      // Step 2: Publish metrics
      await SecurityMetrics.recordSecurityIncident(incident.type);
      
      // Step 3: Take action based on severity and type
      await this.takeAction(incident);
      
      // Step 4: Notify if needed
      if (['high', 'critical'].includes(incident.severity)) {
        await this.notifySecurityTeam(incident);
      }
    } catch (error) {
      console.error('Error handling security incident:', error);
    }
  }
  
  private static mapSeverity(severity: IncidentSeverity): AuditSeverity {
    switch (severity) {
      case IncidentSeverity.LOW:
        return AuditSeverity.INFO;
      case IncidentSeverity.MEDIUM:
        return AuditSeverity.WARNING;
      case IncidentSeverity.HIGH:
        return AuditSeverity.ERROR;
      case IncidentSeverity.CRITICAL:
        return AuditSeverity.CRITICAL;
      default:
        return AuditSeverity.WARNING;
    }
  }
  
  private static async takeAction(incident: SecurityIncident): Promise<void> {
    // Take different actions based on incident type and severity
    switch (incident.type) {
      case IncidentType.AUTHENTICATION_FAILURE:
        if (incident.severity === IncidentSeverity.HIGH) {
          // For high-severity auth failures, consider locking account
          // await this.lockUserAccount(incident.userId);
        }
        break;
        
      case IncidentType.CSRF_VIOLATION:
      case IncidentType.XSS_ATTEMPT:
      case IncidentType.INJECTION_ATTEMPT:
        if (['high', 'critical'].includes(incident.severity)) {
          // For high-severity attacks, consider invalidating user session
          if (incident.userId) {
            await this.invalidateUserSession(incident.userId);
          }
        }
        break;
        
      case IncidentType.RATE_LIMIT_EXCEEDED:
        // Add IP to temporary blocklist if persistent abuse
        break;
        
      case IncidentType.MALICIOUS_REDIRECT:
        // Add domain to blocklist
        if (incident.data?.url) {
          await this.addDomainToBlocklist(extractDomain(incident.data.url));
        }
        break;
    }
  }
  
  private static async invalidateUserSession(userId: string): Promise<void> {
    try {
      // Force sign out the user
      if (env.isProduction) {
        // In production, we would call a secure endpoint to invalidate the user's session
        // await secureAdminAPI.post('/admin/users/invalidate-session', { userId });
      }
    } catch (error) {
      console.error('Failed to invalidate user session:', error);
    }
  }
  
  private static async addDomainToBlocklist(domain: string): Promise<void> {
    try {
      if (env.isProduction) {
        // In production, we would call a secure endpoint to add the domain to the blocklist
        // await secureAdminAPI.post('/admin/security/blocklist-domain', { domain });
      }
    } catch (error) {
      console.error('Failed to add domain to blocklist:', error);
    }
  }
  
  private static async notifySecurityTeam(incident: SecurityIncident): Promise<void> {
    try {
      if (env.isProduction) {
        // In production, we would send a notification to the security team
        // await secureAdminAPI.post('/admin/notifications/security-alert', { incident });
      }
    } catch (error) {
      console.error('Failed to notify security team:', error);
    }
  }
}

// Utility function to extract domain from URL
function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch (error) {
    return url;
  }
}
```

## Ongoing Maintenance

### Security Update Process

Establish a regular security update process:

1. **Weekly Security Review**
   - Review security logs and incidents
   - Analyze security metrics
   - Review new vulnerabilities and threats

2. **Monthly Security Updates**
   - Update security dependencies
   - Apply security patches
   - Review and update security configurations

3. **Quarterly Security Audits**
   - Conduct penetration testing
   - Review security architecture
   - Update security documentation

### Security Maintenance Tasks

```
# Security Maintenance Tasks

## Daily
- Review and respond to security incidents
- Monitor security metrics and alerts
- Check for critical security updates

## Weekly
- Review security logs and analytics
- Update security component performance metrics
- Address security-related technical debt

## Monthly
- Update security dependencies
- Apply security patches
- Review and update security configurations
- Test security failure scenarios

## Quarterly
- Conduct security penetration testing
- Review and update security architecture
- Update security documentation
- Review and update incident response procedures
```

### Security Recommendations

1. **Implement MFA for All Production Users**
   - Require MFA for all user accounts in production
   - Provide user education on MFA importance
   - Monitor MFA adoption and usage

2. **Regular Security Training**
   - Conduct security awareness training for all team members
   - Provide specialized security training for developers
   - Establish secure coding practices and guidelines

3. **Regular Security Testing**
   - Conduct regular penetration testing
   - Implement automated security scanning
   - Test security incident response procedures

4. **Monitor and Update Security Dependencies**
   - Regularly update security dependencies
   - Monitor for security vulnerabilities in dependencies
   - Maintain a software bill of materials (SBOM)

5. **Continuous Security Improvement**
   - Implement security improvements based on incidents and feedback
   - Stay current with security best practices and standards
   - Engage with security communities and resources