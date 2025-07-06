# Security Best Practices

This guide outlines security best practices for developers working on the PropIE application. Following these guidelines will help ensure the security and integrity of the application and its data.

## Authentication & Authorization

### Authentication

- Always use the `Security.getMFA()` module for MFA operations
- Require MFA for administrative functions and sensitive operations
- Use strong password policies (minimum 12 characters, complexity requirements)
- Implement account lockout after multiple failed login attempts
- Use the session fingerprinting system to detect suspicious logins
- Always validate authentication status before allowing access to protected resources

```typescript
// Example of proper authentication check
import { Auth } from '@/lib/amplify/auth';
import { Security } from '@/lib/security';

async function protectedOperation() {
  // Check authentication
  const isAuthenticated = await Auth.isAuthenticated();
  if (!isAuthenticated) {
    throw new Error('Authentication required');
  }
  
  // Check MFA for sensitive operations
  const mfaStatus = await Security.getMFA().getMFAStatus();
  const isSensitiveOperation = true;
  
  if (isSensitiveOperation && mfaStatus.requireForSensitiveOperations) {
    // Require MFA verification
    const mfaVerified = await verifyMFA();
    if (!mfaVerified) {
      throw new Error('MFA verification required');
    }
  }
  
  // Check session validity
  const sessionStatus = Security.getSessionFingerprint().validate();
  if (!sessionStatus.valid) {
    throw new Error(`Session validation failed: ${sessionStatus.reason}`);
  }
  
  // Proceed with protected operation
}
```

### Authorization

- Use role-based access control (RBAC) for authorization
- Follow the principle of least privilege
- Implement proper access controls for API endpoints
- Validate permissions before processing requests
- Log all authorization failures

```typescript
// Example of proper authorization check
import { Security } from '@/lib/security';
import { AuditLogger, AuditCategory, AuditSeverity } from '@/lib/security/auditLogger';

async function adminOperation(userId: string) {
  // Check if user has admin role
  const user = await Auth.currentAuthenticatedUser();
  const hasAdminRole = user.signInUserSession.accessToken.payload['cognito:groups']?.includes('admin');
  
  if (!hasAdminRole) {
    // Log authorization failure
    AuditLogger.logAuthorization(
      'admin_operation',
      'failure',
      'User attempted admin operation without permission',
      'user',
      userId
    );
    
    throw new Error('Unauthorized: Admin permission required');
  }
  
  // Proceed with admin operation
}
```

## Data Protection

### Input Validation

- Validate all user inputs
- Use strong typing with TypeScript
- Implement server-side validation even if client-side validation exists
- Use validation libraries for complex validations

```typescript
// Example of proper input validation
import { z } from 'zod';

// Define validation schema
const UserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  age: z.number().int().min(18).max(120).optional(),
  role: z.enum(['user', 'admin', 'manager'])
});

// Validate input
function createUser(userData: unknown) {
  const validationResult = UserSchema.safeParse(userData);
  
  if (!validationResult.success) {
    throw new Error(`Invalid user data: ${validationResult.error.message}`);
  }
  
  const user = validationResult.data;
  // Proceed with valid user data
}
```

### Output Sanitization

- Sanitize all outputs displayed to users
- Use context-appropriate encoding (HTML, URL, JS, etc.)
- Avoid rendering raw HTML from user inputs
- Use secure templates and frameworks that auto-escape content

```typescript
// Example of secure content rendering
import DOMPurify from 'dompurify';

function DisplayUserContent({ content }: { content: string }) {
  // Sanitize content before rendering
  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  });
  
  return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
}
```

### Data Storage

- Use appropriate encryption for sensitive data
- Follow the principle of data minimization
- Implement proper access controls for stored data
- Use parameterized queries to prevent SQL injection
- Sanitize all database inputs

```typescript
// Example of secure data access
import { AuditLogger } from '@/lib/security/auditLogger';
import { prisma } from '@/lib/prisma';

async function getUserData(userId: string, requestingUserId: string) {
  // Check if requesting user has permission
  const canAccess = await checkUserAccess(requestingUserId, userId);
  
  if (!canAccess) {
    // Log unauthorized access attempt
    AuditLogger.logDataAccess(
      'read',
      'user',
      userId,
      'failure',
      'Unauthorized data access attempt'
    );
    
    throw new Error('Unauthorized access');
  }
  
  // Use parameterized query
  const userData = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      // Exclude sensitive fields
      password: false,
      securityQuestions: false
    }
  });
  
  // Log successful data access
  AuditLogger.logDataAccess(
    'read',
    'user',
    userId,
    'success',
    'User data accessed'
  );
  
  return userData;
}
```

## API Security

### Rate Limiting

- Use the API Protection module for rate limiting
- Set appropriate rate limits for different endpoints
- Implement progressive penalties for repeated violations
- Log rate limit violations

```typescript
// Example of rate limiting
import { ApiProtection } from '@/lib/security/apiProtection';

export async function POST(req: Request) {
  // Check rate limit
  const endpoint = '/api/users';
  const rateLimitResult = ApiProtection.checkRateLimit(endpoint, 'write');
  
  if (!rateLimitResult.allowed) {
    return Response.json(
      { error: 'Rate limit exceeded', retryAfter: rateLimitResult.retryAfter },
      { status: 429 }
    );
  }
  
  // Track this request
  ApiProtection.trackRequest({
    endpoint,
    method: 'POST',
    category: 'write'
  });
  
  // Process request
  // ...
}
```

### Request Validation

- Validate all API request parameters
- Use proper HTTP status codes for responses
- Implement proper error handling
- Log all API errors

```typescript
// Example of API request validation
import { z } from 'zod';
import { AuditLogger } from '@/lib/security/auditLogger';

// Define validation schema
const CreateProjectSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(1000).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  budget: z.number().positive()
});

export async function POST(req: Request) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const validationResult = CreateProjectSchema.safeParse(body);
    
    if (!validationResult.success) {
      // Log validation error
      AuditLogger.logApi(
        'create_project',
        '/api/projects',
        'POST',
        'failure',
        'Validation error',
        { errors: validationResult.error.errors },
        'VALIDATION_ERROR'
      );
      
      return Response.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const projectData = validationResult.data;
    
    // Process valid request
    // ...
    
    // Log successful API call
    AuditLogger.logApi(
      'create_project',
      '/api/projects',
      'POST',
      'success',
      'Project created successfully',
      { projectId: 'new-project-id' }
    );
    
    return Response.json({ success: true, projectId: 'new-project-id' });
  } catch (error) {
    // Log error
    AuditLogger.logApi(
      'create_project',
      '/api/projects',
      'POST',
      'failure',
      'Internal server error',
      {},
      'INTERNAL_ERROR',
      error instanceof Error ? error.message : String(error)
    );
    
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### CSRF Protection

- Use CSRF tokens for all state-changing operations
- Validate origin and referrer headers
- Implement proper CORS configuration
- Use the `withCSRFProtection` HOC for protected routes

```typescript
// Example of CSRF protection usage
import { withCSRFProtection } from '@/components/security/withCSRFProtection';
import { CSRFToken } from '@/components/security/CSRFToken';

// Protect form with CSRF token
function ProtectedForm() {
  return (
    <form method="POST" action="/api/update-profile">
      <CSRFToken />
      {/* Form fields */}
      <button type="submit">Update</button>
    </form>
  );
}

// Protect API route with CSRF validation
export const POST = withCSRFProtection(async (req: Request) => {
  // Process request with CSRF validation
  // ...
});
```

## Security Monitoring

### Logging

- Use the Audit Logger for security-relevant events
- Log all authentication and authorization events
- Log all sensitive operations
- Use appropriate severity levels for different events

```typescript
// Example of proper security logging
import { AuditLogger, AuditSeverity } from '@/lib/security/auditLogger';

// Log authentication
AuditLogger.logAuth(
  'login',
  'success',
  'User logged in successfully',
  { method: 'password' }
);

// Log security event
AuditLogger.logSecurity(
  'password_changed',
  AuditSeverity.INFO,
  'User changed their password',
  { userId: 'user123' }
);

// Log API access
AuditLogger.logApi(
  'get_user_data',
  '/api/users/123',
  'GET',
  'success',
  'User data retrieved successfully'
);

// Log data access
AuditLogger.logDataAccess(
  'read',
  'financial_record',
  'record123',
  'success',
  'Financial record accessed'
);
```

### Monitoring

- Use the Security Monitoring Dashboard for real-time monitoring
- Set up alerts for suspicious activity
- Regularly review security logs
- Monitor for unusual patterns

## Secure Development Lifecycle

### Code Reviews

- Include security considerations in all code reviews
- Use static analysis tools to identify potential security issues
- Follow secure coding standards
- Review for common vulnerabilities (OWASP Top 10)

### Dependency Management

- Regularly update dependencies
- Use dependency scanning tools
- Review new dependencies for security issues
- Maintain a software bill of materials (SBOM)

### Testing

- Include security tests in your test suite
- Test for common vulnerabilities
- Perform integration testing of security features
- Use the Security Test Runner for regression testing

```typescript
// Example of security-focused test
import { render, screen, fireEvent } from '@testing-library/react';
import { MFASetup } from '@/components/security/MFASetup';

describe('MFASetup', () => {
  it('should not proceed without validation code', async () => {
    // Arrange
    const mockOnComplete = jest.fn();
    render(<MFASetup onComplete={mockOnComplete} />);
    
    // Navigate to verification step
    fireEvent.click(screen.getByText('Authenticator App'));
    fireEvent.click(screen.getByText('Start Setup'));
    
    // Act - try to verify without code
    fireEvent.click(screen.getByText('Verify'));
    
    // Assert
    expect(screen.getByText('Please enter the verification code')).toBeInTheDocument();
    expect(mockOnComplete).not.toHaveBeenCalled();
  });
});
```

## Security Features Integration

### Feature Flags

- Use the Feature Flag system for security features
- Implement gradual rollout of new security features
- Allow customer-specific security configurations
- Test features thoroughly before enabling globally

```typescript
// Example of feature flag usage for security
import { Security } from '@/lib/security';

function AddSecurityKey() {
  // Check if security key feature is enabled
  const securityKeyEnabled = Security.getFeatureFlag('security_key_authentication');
  
  if (!securityKeyEnabled) {
    return (
      <div className="feature-disabled">
        Security key authentication is not available yet.
      </div>
    );
  }
  
  return (
    <div className="security-key-setup">
      {/* Security key setup UI */}
    </div>
  );
}
```

### Security UX

- Provide clear security information to users
- Use the Security Dashboard for user-facing security features
- Implement progressive disclosure for complex security features
- Guide users through security setup with the Security Setup Wizard

## Incident Response

### Preparation

- Document security incident response procedures
- Define roles and responsibilities
- Establish communication channels
- Prepare incident response templates

### Detection

- Use the Security Monitoring Dashboard for detection
- Set up alerts for suspicious activity
- Monitor security logs
- Train users to report suspected incidents

### Containment

- Implement procedures for containing security incidents
- Have tools ready for isolating affected systems
- Document emergency response procedures
- Test incident response procedures regularly

### Recovery

- Document recovery procedures
- Implement backup and restore mechanisms
- Test recovery procedures regularly
- Learn from incidents and improve security posture

## Conclusion

Following these security best practices will help ensure the security and integrity of the PropIE application. Security is a shared responsibility, and everyone on the development team should be aware of and follow these guidelines. Regular security training, code reviews, and testing are essential components of a secure development lifecycle.