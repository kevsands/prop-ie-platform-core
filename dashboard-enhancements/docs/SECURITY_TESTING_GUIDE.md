# Security Testing Guide

This guide provides comprehensive testing scenarios for the security features implemented in the application. It covers authentication, authorization, and other security mechanisms to ensure robust protection of your application and user data.

## Table of Contents

1. [Authentication Testing](#authentication-testing)
2. [Authorization Testing](#authorization-testing)
3. [MFA Testing](#mfa-testing)
4. [CSRF Protection Testing](#csrf-protection-testing)
5. [Session Security Testing](#session-security-testing)
6. [Input Validation Testing](#input-validation-testing)
7. [API Security Testing](#api-security-testing)
8. [Security Integration Testing](#security-integration-testing)
9. [Automated Security Tests](#automated-security-tests)

## Authentication Testing

Authentication is the first line of defense. These tests verify that the authentication mechanisms work correctly and securely.

### User Authentication Flow Testing

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| Valid Login | Test login with valid credentials | User is authenticated and receives valid tokens |
| Invalid Password | Test login with invalid password | Authentication is rejected with a generic error message |
| Non-existent User | Test login with non-existent username | Authentication is rejected with a generic error message |
| Password Complexity | Test password restrictions during registration | Weak passwords are rejected with specific requirements |
| Account Lockout | Test multiple failed login attempts | Account is temporarily locked after a specific number of failed attempts |
| Session Duration | Test that sessions expire after the configured time | User is required to re-authenticate after session expiration |
| Token Verification | Test that tokens are properly verified | Invalid or expired tokens are rejected |

### Implementation Example

```typescript
// Authentication testing example
describe('Authentication Tests', () => {
  it('should authenticate with valid credentials', async () => {
    const result = await Auth.signIn({
      username: 'validuser@example.com',
      password: 'ValidPassword123!'
    });
    
    expect(result.isSignedIn).toBe(true);
    expect(result.nextStep).toBeNull();
  });
  
  it('should reject invalid credentials with generic error', async () => {
    try {
      await Auth.signIn({
        username: 'validuser@example.com',
        password: 'WrongPassword123!'
      });
      fail('Should have thrown an error');
    } catch (error) {
      expect(error.message).toContain('incorrect username or password');
      // Verify the error doesn't leak sensitive information
      expect(error.message).not.toContain('attempt');
      expect(error.message).not.toContain('hash');
      expect(error.message).not.toContain('ip');
    }
  });
  
  it('should lock account after multiple failed attempts', async () => {
    // Make multiple failed attempts
    for (let i = 0; i < 5; i++) {
      try {
        await Auth.signIn({
          username: 'validuser@example.com',
          password: `WrongPassword${i}!`
        });
      } catch (error) {
        // Expected error
      }
    }
    
    // Next attempt should trigger account lockout
    try {
      await Auth.signIn({
        username: 'validuser@example.com',
        password: 'AnotherWrongPassword!'
      });
      fail('Should have thrown an error');
    } catch (error) {
      expect(error.message).toContain('attempt limit exceeded');
    }
  });
});
```

## Authorization Testing

Authorization tests verify that users can only access resources and perform actions they are authorized for.

### Role-Based Access Control Testing

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| Admin Access | Test admin user accessing admin resources | Access is granted |
| Regular User Access | Test regular user accessing admin resources | Access is denied |
| Developer Access | Test developer accessing developer resources | Access is granted |
| Mixed Role Access | Test user with multiple roles | Access is granted appropriately for each role |
| No Role Access | Test user with no specific role | Access is restricted to public resources only |
| Role Elevation | Test attempts to elevate privileges | Attempts are blocked and logged |

### Security Level Testing

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| Basic Security Level | Test access with basic security level | Access to basic resources is granted |
| Medium Security Level | Test access with medium security level | Access to medium-security resources is granted |
| High Security Level | Test access with high security level | Access to high-security resources is granted |
| Security Level Elevation | Test elevation from basic to high security | Requires additional verification (e.g., MFA) |

### Implementation Example

```typescript
// Authorization testing example
describe('Authorization Tests', () => {
  it('should grant access based on user role', async () => {
    // Setup test users with different roles
    const adminUser = { id: 'admin1', roles: ['admin'] };
    const devUser = { id: 'dev1', roles: ['developer'] };
    const regularUser = { id: 'user1', roles: ['user'] };
    
    // Test admin-specific resource
    expect(await Security.checkAccess(adminUser, 'admin-dashboard')).toBe(true);
    expect(await Security.checkAccess(devUser, 'admin-dashboard')).toBe(false);
    expect(await Security.checkAccess(regularUser, 'admin-dashboard')).toBe(false);
    
    // Test developer-specific resource
    expect(await Security.checkAccess(adminUser, 'code-repository')).toBe(true); // Admins have all access
    expect(await Security.checkAccess(devUser, 'code-repository')).toBe(true);
    expect(await Security.checkAccess(regularUser, 'code-repository')).toBe(false);
    
    // Test user-accessible resource
    expect(await Security.checkAccess(adminUser, 'user-profile')).toBe(true);
    expect(await Security.checkAccess(devUser, 'user-profile')).toBe(true);
    expect(await Security.checkAccess(regularUser, 'user-profile')).toBe(true);
  });
  
  it('should grant access based on security level', async () => {
    // Mock different security levels
    jest.spyOn(Security, 'checkSecurityLevel').mockImplementation((level) => {
      switch (level) {
        case 'high':
          return Promise.resolve(false); // User doesn't have high security
        case 'medium':
          return Promise.resolve(true); // User has medium security
        case 'basic':
          return Promise.resolve(true); // User has basic security
        default:
          return Promise.resolve(false);
      }
    });
    
    // Test access to resources requiring different security levels
    const result = await Promise.all([
      Security.checkResourceAccess('basic-resource'), // Should be true
      Security.checkResourceAccess('medium-resource'), // Should be true
      Security.checkResourceAccess('high-resource') // Should be false
    ]);
    
    expect(result).toEqual([true, true, false]);
  });
});
```

## MFA Testing

Multi-Factor Authentication adds an additional layer of security. These tests verify that MFA works correctly.

### MFA Setup and Verification Testing

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| TOTP Setup | Test setting up TOTP-based MFA | Setup is successful and QR code is generated |
| TOTP Verification | Test verifying a TOTP code | Verification succeeds with a valid code |
| SMS Setup | Test setting up SMS-based MFA | Setup is successful and verification code is sent |
| SMS Verification | Test verifying an SMS code | Verification succeeds with a valid code |
| Invalid Code | Test entering an invalid verification code | Verification fails with appropriate error |
| Recovery Code | Test using a recovery code | Authentication succeeds and prompts for new MFA setup |
| MFA Enforcement | Test MFA enforcement for high-privilege roles | Users with high-privilege roles are required to set up MFA |

### MFA Challenge Testing

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| Login Challenge | Test MFA challenge during login | User is prompted for MFA verification before completing login |
| Operation Challenge | Test MFA challenge for sensitive operations | User is prompted for MFA verification before performing sensitive operation |
| Remember Device | Test "remember this device" functionality | MFA is not required for subsequent logins from the same device |
| Device Change | Test logging in from a new device | MFA is required even if previously verified on another device |

### Implementation Example

```typescript
// MFA testing example
describe('MFA Tests', () => {
  it('should successfully set up TOTP MFA', async () => {
    // Mock user is authenticated
    mockAuthUser({ id: 'user1', email: 'user@example.com' });
    
    // Set up TOTP MFA
    const setupResult = await MFAService.setupTOTPMFA();
    
    // Verify setup response
    expect(setupResult.setupStatus).toBe('PENDING_VERIFICATION');
    expect(setupResult.secretKey).toBeDefined();
    expect(setupResult.qrCode).toBeDefined();
    
    // Generate a mock TOTP code based on the secret
    const mockTotpCode = generateMockTotpCode(setupResult.secretKey);
    
    // Verify TOTP setup
    const verificationResult = await MFAService.verifyTOTPSetupWithCode(mockTotpCode);
    expect(verificationResult).toBe(true);
    
    // Check MFA status after setup
    const mfaStatus = await MFAService.getMFAStatus();
    expect(mfaStatus.enabled).toBe(true);
    expect(mfaStatus.preferred).toBe('TOTP');
  });
  
  it('should require MFA for sign-in when enabled', async () => {
    // Mock user with MFA enabled
    mockUserWithMFA({ id: 'user1', email: 'user@example.com' });
    
    // Attempt sign-in
    const signInResult = await Auth.signIn({
      username: 'user@example.com',
      password: 'Password123!'
    });
    
    // Should not be signed in yet, should require TOTP verification
    expect(signInResult.isSignedIn).toBe(false);
    expect(signInResult.nextStep?.signInStep).toBe('CONFIRM_SIGN_IN_WITH_TOTPCODE');
    
    // Complete MFA challenge
    const mockTotpCode = generateMockTotpCode('test-secret');
    const confirmResult = await Auth.confirmSignIn(mockTotpCode);
    
    // Now should be signed in
    expect(confirmResult.isSignedIn).toBe(true);
  });
  
  it('should enforce MFA for high-privilege roles', async () => {
    // Check MFA enforcement for different roles
    expect(MFAService.shouldEnforceMFA({ role: 'admin' })).toBe(true);
    expect(MFAService.shouldEnforceMFA({ role: 'developer' })).toBe(true);
    expect(MFAService.shouldEnforceMFA({ role: 'user' })).toBe(false);
    
    // Check multi-role user
    expect(MFAService.shouldEnforceMFA({ roles: ['user', 'developer'] })).toBe(true);
  });
});
```

## CSRF Protection Testing

Cross-Site Request Forgery (CSRF) protection prevents attackers from tricking users into making unwanted requests.

### CSRF Token Testing

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| Token Generation | Test that CSRF tokens are generated correctly | A unique token is generated and stored in the session |
| Token Inclusion | Test that CSRF tokens are included in forms | Forms include a hidden CSRF token field |
| Token Validation | Test that requests with valid CSRF tokens are accepted | Request is processed normally |
| Missing Token | Test that requests without CSRF tokens are rejected | Request is rejected with a security error |
| Invalid Token | Test that requests with invalid CSRF tokens are rejected | Request is rejected with a security error |
| Token Rotation | Test that CSRF tokens are rotated appropriately | Old tokens become invalid after expiration |

### Implementation Example

```typescript
// CSRF protection testing example
describe('CSRF Protection Tests', () => {
  it('should generate and validate CSRF tokens', () => {
    // Generate a token
    const originalToken = generateCSRFToken();
    expect(originalToken).toBeTruthy();
    expect(typeof originalToken).toBe('string');
    
    // Validate the token
    expect(verifyCSRFToken(originalToken)).toBe(true);
    
    // Validate an invalid token
    expect(verifyCSRFToken('invalid-token')).toBe(false);
  });
  
  it('should include CSRF tokens in forms', async () => {
    // Render a protected form
    const { container } = render(<ProtectedForm />);
    
    // Check for the hidden CSRF token field
    const tokenField = container.querySelector('input[name="csrf_token"]');
    expect(tokenField).toBeTruthy();
    expect(tokenField.getAttribute('type')).toBe('hidden');
    expect(tokenField.value).toBeTruthy();
  });
  
  it('should reject requests without valid CSRF tokens', async () => {
    // Mock a form submission without CSRF token
    const response = await fetch('/api/protected-endpoint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: 'test' })
    });
    
    // Should be rejected
    expect(response.status).toBe(403);
    const responseData = await response.json();
    expect(responseData.error).toContain('CSRF');
  });
});
```

## Session Security Testing

Session security tests verify that user sessions are managed securely.

### Session Management Testing

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| Session Creation | Test that sessions are created securely | Session is created with secure attributes |
| Session Expiration | Test that sessions expire after inactivity | Session becomes invalid after the expiration time |
| Session Invalidation | Test that sessions are invalidated on logout | Session becomes invalid immediately after logout |
| Session Hijacking Protection | Test protection against session hijacking | Attempts to use a session from a different device/fingerprint are rejected |
| Concurrent Sessions | Test handling of concurrent sessions | New sessions invalidate old sessions or notify the user |
| Secure Cookie Attributes | Test that session cookies have secure attributes | Cookies have Secure, HttpOnly, and SameSite attributes |

### Implementation Example

```typescript
// Session security testing example
describe('Session Security Tests', () => {
  it('should create sessions with secure attributes', async () => {
    // Sign in to create a session
    await Auth.signIn({
      username: 'user@example.com',
      password: 'Password123!'
    });
    
    // Check cookie attributes (implementation-specific)
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    const sessionCookie = cookies.find(cookie => cookie.startsWith('session='));
    
    // Verify cookie exists
    expect(sessionCookie).toBeDefined();
    
    // In a real test, you would need to check HTTP headers for cookie attributes
    // This is a simplified example
  });
  
  it('should invalidate sessions on logout', async () => {
    // Sign in
    await Auth.signIn({
      username: 'user@example.com',
      password: 'Password123!'
    });
    
    // Verify we can access a protected resource
    const beforeLogout = await Security.checkSecurityLevel('basic');
    expect(beforeLogout).toBe(true);
    
    // Sign out
    await Auth.signOut();
    
    // Verify we can no longer access the protected resource
    const afterLogout = await Security.checkSecurityLevel('basic');
    expect(afterLogout).toBe(false);
  });
  
  it('should protect against session hijacking', async () => {
    // Set up session fingerprinting
    const fingerprint = Security.getSessionFingerprint();
    
    // Generate fingerprint
    await fingerprint.generate();
    
    // Validate correct fingerprint
    const validResult = await fingerprint.validate();
    expect(validResult.valid).toBe(true);
    
    // Simulate fingerprint from another device
    mockDifferentDeviceFingerprint();
    
    // Validation should fail
    const invalidResult = await fingerprint.validate();
    expect(invalidResult.valid).toBe(false);
  });
});
```

## Input Validation Testing

Input validation tests verify that user inputs are properly validated and sanitized to prevent injection attacks.

### Validation and Sanitization Testing

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| Valid Input | Test validation with valid input | Input is accepted without errors |
| Invalid Input | Test validation with invalid input | Input is rejected with appropriate error messages |
| XSS Attack | Test with inputs containing XSS payloads | Inputs are rejected or sanitized to prevent XSS |
| SQL Injection | Test with inputs containing SQL injection payloads | Inputs are rejected or sanitized to prevent SQL injection |
| Schema Validation | Test validation against defined schemas | Input is validated according to the schema rules |
| Sanitization | Test that outputs are properly sanitized | Output does not contain potentially dangerous content |

### Implementation Example

```typescript
// Input validation testing example
describe('Input Validation Tests', () => {
  it('should validate input against schemas', () => {
    // Define a schema for testing
    const userSchema = {
      type: 'object',
      properties: {
        name: { type: 'string', minLength: 2, maxLength: 50 },
        email: { type: 'string', format: 'email' },
        age: { type: 'number', minimum: 18 }
      },
      required: ['name', 'email']
    };
    
    // Valid input
    const validInput = { name: 'John Doe', email: 'john@example.com', age: 30 };
    expect(() => Security.validate(userSchema, validInput)).not.toThrow();
    
    // Invalid email format
    const invalidEmail = { name: 'John Doe', email: 'not-an-email', age: 30 };
    expect(() => Security.validate(userSchema, invalidEmail)).toThrow();
    
    // Missing required field
    const missingField = { name: 'John Doe', age: 30 };
    expect(() => Security.validate(userSchema, missingField)).toThrow();
    
    // Below minimum age
    const underage = { name: 'John Doe', email: 'john@example.com', age: 17 };
    expect(() => Security.validate(userSchema, underage)).toThrow();
  });
  
  it('should sanitize potentially dangerous content', () => {
    // XSS attempt
    const xssInput = '<script>alert("XSS")</script>Hello';
    const sanitized = Security.sanitizeUserInput(xssInput);
    
    // Script tags should be removed or escaped
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).toContain('Hello');
    
    // HTML should be properly escaped
    const htmlInput = '<b>Bold</b> <i>Italic</i>';
    const htmlSanitized = Security.sanitizeUserInput(htmlInput, { allowBasicFormatting: false });
    
    // Tags should be escaped if not allowed
    expect(htmlSanitized).not.toContain('<b>');
    expect(htmlSanitized).toContain('Bold');
    
    // If basic formatting is allowed
    const htmlSanitizedWithFormatting = Security.sanitizeUserInput(htmlInput, { allowBasicFormatting: true });
    
    // Basic tags may be preserved if allowed
    expect(htmlSanitizedWithFormatting).toContain('<b>');
    expect(htmlSanitizedWithFormatting).toContain('<i>');
  });
});
```

## API Security Testing

API security tests verify that your API endpoints are protected against unauthorized access and other security threats.

### API Protection Testing

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| Authentication | Test API access with and without authentication | Unauthenticated requests to protected endpoints are rejected |
| Authorization | Test API access with different user roles | Users can only access endpoints they're authorized for |
| Rate Limiting | Test API rate limiting | Excessive requests are throttled |
| Input Validation | Test API input validation | Invalid inputs are rejected with appropriate errors |
| Error Handling | Test API error handling | Errors don't leak sensitive information |
| Token Validation | Test API token validation | Expired or invalid tokens are rejected |
| API Schema | Test API response schema | Responses match the expected schema |

### Implementation Example

```typescript
// API security testing example
describe('API Security Tests', () => {
  it('should require authentication for protected endpoints', async () => {
    // Try accessing a protected endpoint without authentication
    const response = await fetch('/api/protected-data');
    
    // Should be rejected with 401 Unauthorized
    expect(response.status).toBe(401);
    
    // Now authenticate
    await Auth.signIn({
      username: 'user@example.com',
      password: 'Password123!'
    });
    
    // Get the auth token
    const token = await Auth.getAccessToken();
    
    // Try again with authentication
    const authedResponse = await fetch('/api/protected-data', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Should succeed
    expect(authedResponse.status).toBe(200);
  });
  
  it('should enforce rate limiting', async () => {
    // Make multiple requests in quick succession
    const responses = [];
    for (let i = 0; i < 20; i++) {
      const response = await fetch('/api/rate-limited-endpoint');
      responses.push(response.status);
    }
    
    // Some of the later requests should be rate limited (429 Too Many Requests)
    expect(responses).toContain(429);
  });
  
  it('should validate API request data', async () => {
    // Authenticate
    await Auth.signIn({
      username: 'user@example.com',
      password: 'Password123!'
    });
    const token = await Auth.getAccessToken();
    
    // Send invalid data
    const invalidResponse = await fetch('/api/user-profile', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'not-an-email',
        age: 'thirty' // Should be a number
      })
    });
    
    // Should be rejected with 400 Bad Request
    expect(invalidResponse.status).toBe(400);
    const errorData = await invalidResponse.json();
    expect(errorData.errors).toBeDefined();
    expect(errorData.errors).toHaveLength(2); // Two validation errors
  });
});
```

## Security Integration Testing

Integration tests verify that the various security components work together correctly.

### Security System Integration Testing

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| Authentication + MFA | Test full login flow with MFA | User can successfully authenticate with correct MFA code |
| Authorization + Security Levels | Test access with different security levels | Access is granted or denied based on security level and authorization |
| Session + Fingerprinting | Test session validation with fingerprinting | Sessions are validated against device fingerprints |
| API Protection + CSRF | Test API protection with CSRF tokens | CSRF protection is properly enforced for API calls |
| MFA + Recovery | Test MFA recovery flow | User can recover access using recovery codes |
| Security Monitoring | Test security event monitoring | Security events are properly logged and monitored |

### Implementation Example

```typescript
// Security integration testing example
describe('Security Integration Tests', () => {
  it('should integrate authentication, MFA, and authorization', async () => {
    // Set up test user with MFA
    const user = setupTestUserWithMFA({
      id: 'user1',
      email: 'user@example.com',
      role: 'admin'
    });
    
    // Sign in (first factor)
    const signInResult = await Auth.signIn({
      username: 'user@example.com',
      password: 'Password123!'
    });
    
    // Should require MFA
    expect(signInResult.isSignedIn).toBe(false);
    expect(signInResult.nextStep?.signInStep).toBe('CONFIRM_SIGN_IN_WITH_TOTPCODE');
    
    // Complete MFA (second factor)
    const mockTotpCode = generateMockTotpCode(user.mfaSecret);
    const confirmResult = await Auth.confirmSignIn(mockTotpCode);
    
    // Now should be signed in
    expect(confirmResult.isSignedIn).toBe(true);
    
    // Check authorization
    const canAccessAdminResource = await Security.checkAccess('admin-resource');
    expect(canAccessAdminResource).toBe(true);
    
    // Check security level
    const hasHighSecurity = await Security.checkSecurityLevel('high');
    expect(hasHighSecurity).toBe(true); // High security because of MFA + admin role
  });
  
  it('should integrate session security with fingerprinting', async () => {
    // Sign in
    await Auth.signIn({
      username: 'user@example.com',
      password: 'Password123!'
    });
    
    // Generate session fingerprint
    const fingerprint = Security.getSessionFingerprint();
    await fingerprint.generate();
    
    // Session should be valid
    const sessionValid = await Security.checkSecurityLevel('medium');
    expect(sessionValid).toBe(true);
    
    // Simulate browser/device change
    mockDifferentDeviceFingerprint();
    
    // Session should now be invalid due to fingerprint mismatch
    const sessionInvalid = await Security.checkSecurityLevel('medium');
    expect(sessionInvalid).toBe(false);
  });
  
  it('should detect and log security violations', async () => {
    // Mock the security logger
    const logSpy = jest.spyOn(Security.AuditLogger, 'logSecurity');
    
    // Simulate a security violation
    const testViolation = {
      type: 'csrf',
      severity: 'high',
      description: 'Invalid CSRF token detected',
      url: 'https://example.com/protected'
    };
    
    // Report the violation
    await Security.reportSecurityViolation(testViolation);
    
    // Verify logging
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy.mock.calls[0][0]).toBe('security_violation');
    expect(logSpy.mock.calls[0][2]).toContain('CSRF');
    
    // Restore the spy
    logSpy.mockRestore();
  });
});
```

## Automated Security Tests

Automated tests can be integrated into your CI/CD pipeline to ensure security is maintained throughout development.

### Test Script Examples

**Authentication Tests:**

```bash
# Run authentication tests
npm test -- --testPathPattern=auth
```

**MFA Tests:**

```bash
# Run MFA tests
npm test -- --testPathPattern=mfa
```

**API Security Tests:**

```bash
# Run API security tests
npm test -- --testPathPattern=api-security
```

**Integration Tests:**

```bash
# Run security integration tests
npm test -- --testPathPattern=security-integration
```

### Continuous Integration Setup

Add security tests to your CI pipeline:

```yaml
# Example GitHub Actions workflow for security testing
name: Security Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  security-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run authentication tests
      run: npm test -- --testPathPattern=auth
      
    - name: Run MFA tests
      run: npm test -- --testPathPattern=mfa
      
    - name: Run API security tests
      run: npm test -- --testPathPattern=api-security
      
    - name: Run security integration tests
      run: npm test -- --testPathPattern=security-integration
```

### Security Scanning Integration

Integrate security scanning tools to identify vulnerabilities:

```yaml
# Example security scanning job
security-scan:
  runs-on: ubuntu-latest
  
  steps:
  - uses: actions/checkout@v3
  
  - name: Set up Node.js
    uses: actions/setup-node@v3
    with:
      node-version: '18'
      
  - name: Install dependencies
    run: npm ci
    
  - name: Run npm audit
    run: npm audit --production
    
  - name: Run OWASP Dependency Check
    uses: dependency-check/Dependency-Check_Action@main
    with:
      project: 'PropIE'
      path: '.'
      format: 'HTML'
      args: >
        --scan .
        --suppression ./.dependency-check-suppressions.xml
        --failOnCVSS 7
        
  - name: Upload dependency check report
    if: always()
    uses: actions/upload-artifact@v3
    with:
      name: dependency-check-report
      path: '${{ github.workspace }}/reports'
```

By implementing a comprehensive testing strategy that covers all aspects of your security system, you can ensure that your application remains secure as it evolves. Regular security testing should be part of your development lifecycle to catch and fix vulnerabilities early.