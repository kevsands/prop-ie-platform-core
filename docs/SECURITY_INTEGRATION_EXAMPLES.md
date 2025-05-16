# Security Integration Examples

This document provides examples of how to integrate the security system with frontend components, implement protected routes, and handle multi-factor authentication in your application.

## Protected Routes with Role-Based Access Control

The security system provides several mechanisms for protecting routes and implementing role-based access control in your frontend components.

### Basic Protected Route

Use the `ProtectedRoute` component to restrict access to authenticated users:

```tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function SecurePage() {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  );
}
```

### Role-Based Protected Route

Restrict access based on user roles:

```tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function AdminDashboard() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div>This content is only visible to admin users</div>
    </ProtectedRoute>
  );
}
```

### Enhanced Security Level Protection

For more granular security levels, use the `Security.checkSecurityLevel` function:

```tsx
'use client';

import { useEffect, useState } from 'react';
import Security from '@/lib/security';

export default function HighSecurityPage() {
  const [securityVerified, setSecurityVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkSecurity() {
      try {
        // Check if user meets high security level requirements
        const hasHighSecurity = await Security.checkSecurityLevel('high');
        setSecurityVerified(hasHighSecurity);
      } catch (error) {
        console.error('Security check failed:', error);
        setSecurityVerified(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkSecurity();
  }, []);

  if (isLoading) {
    return <div>Verifying security level...</div>;
  }

  if (!securityVerified) {
    return <div>Additional security verification required to access this page.</div>;
  }

  return <div>Highly sensitive content protected by enhanced security</div>;
}
```

## Role-Based UI Rendering

You can conditionally render UI elements based on user roles and permissions:

### Using the Auth Context

```tsx
'use client';

import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Basic role check */}
      {user?.role === 'admin' && (
        <div className="admin-panel">
          <h2>Admin Controls</h2>
          {/* Admin-specific controls */}
        </div>
      )}
      
      {/* Combined role checks */}
      {(user?.role === 'developer' || user?.role === 'admin') && (
        <div className="developer-tools">
          <h2>Developer Tools</h2>
          {/* Developer-specific tools */}
        </div>
      )}
      
      {/* All users see this content */}
      <div className="user-content">
        <h2>User Content</h2>
        {/* Content for all authenticated users */}
      </div>
    </div>
  );
}
```

### Using the Security API for Advanced Permissions

For more complex permission checks, use the Security API:

```tsx
'use client';

import { useEffect, useState } from 'react';
import Security from '@/lib/security';
import { useAuth } from '@/context/AuthContext';

export default function SecurityAwarePage() {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState({
    canViewSensitiveData: false,
    canEditSettings: false,
    mfaEnabled: false
  });
  
  useEffect(() => {
    async function checkPermissions() {
      if (!user) return;
      
      try {
        // Check security level
        const hasHighSecurity = await Security.checkSecurityLevel('medium');
        
        // Get MFA status
        const mfaService = Security.getMFA();
        const mfaStatus = await mfaService.getMFAStatus();
        
        // Update permissions
        setPermissions({
          canViewSensitiveData: hasHighSecurity,
          canEditSettings: user.role === 'admin' || user.role === 'manager',
          mfaEnabled: mfaStatus.enabled
        });
      } catch (error) {
        console.error('Error checking permissions:', error);
      }
    }
    
    checkPermissions();
  }, [user]);
  
  return (
    <div>
      <h1>Security-Aware UI</h1>
      
      {/* Render UI based on permissions */}
      {permissions.canViewSensitiveData && (
        <div className="sensitive-data">
          <h2>Sensitive Data</h2>
          {/* Sensitive content */}
        </div>
      )}
      
      {permissions.canEditSettings && (
        <div className="settings-panel">
          <h2>Settings</h2>
          {/* Settings panel */}
        </div>
      )}
      
      {!permissions.mfaEnabled && (
        <div className="mfa-recommendation">
          <h2>Security Recommendation</h2>
          <p>Enable MFA to enhance your account security.</p>
          <button>Set up MFA</button>
        </div>
      )}
    </div>
  );
}
```

### CSRF Protection for Forms

Use the `withCSRFProtection` HOC to protect forms and components handling sensitive operations:

```tsx
'use client';

import { useState } from 'react';
import withCSRFProtection from '@/components/security/withCSRFProtection';
import CSRFToken from '@/components/security/CSRFToken';

function ProfileForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form submission logic
    console.log('Submitting form with CSRF protection:', formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <h2>Update Profile</h2>
      
      {/* Include CSRF Token in the form */}
      <CSRFToken />
      
      <div>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
      </div>
      
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
      </div>
      
      <button type="submit">Update Profile</button>
    </form>
  );
}

// Wrap the form with CSRF protection
export default withCSRFProtection(ProfileForm);
```

## Multi-Factor Authentication (MFA) Implementation

The security system provides comprehensive MFA functionality for protecting user accounts.

### MFA Setup Flow

To implement MFA setup in your application:

```tsx
'use client';

import { useState } from 'react';
import { MFASetup } from '@/components/security/MFASetup';

export default function MFASetupPage() {
  const [setupComplete, setSetupComplete] = useState(false);
  
  const handleSetupComplete = () => {
    setSetupComplete(true);
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Multi-Factor Authentication Setup</h1>
      
      {setupComplete ? (
        <div className="bg-green-100 p-4 rounded">
          <h2 className="text-xl font-semibold text-green-800">Setup Complete</h2>
          <p>Your account is now protected with multi-factor authentication.</p>
        </div>
      ) : (
        <MFASetup onComplete={handleSetupComplete} />
      )}
    </div>
  );
}
```

### MFA Challenge Flow

For implementing MFA challenges during login or for sensitive operations:

```tsx
'use client';

import { useState } from 'react';
import { MFAChallenge } from '@/components/security/MFAChallenge';

export default function SecureOperationPage() {
  const [verificationRequired, setVerificationRequired] = useState(true);
  const [operationComplete, setOperationComplete] = useState(false);
  
  const handleVerificationComplete = (success) => {
    if (success) {
      setVerificationRequired(false);
      performSecureOperation();
    } else {
      // Handle verification failure
      console.error('MFA verification failed');
    }
  };
  
  const performSecureOperation = () => {
    // Perform the secure operation here
    console.log('Performing secure operation after MFA verification');
    setOperationComplete(true);
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Secure Operation</h1>
      
      {verificationRequired ? (
        <MFAChallenge 
          onComplete={handleVerificationComplete}
          title="Verification Required"
          description="Please verify your identity to perform this sensitive operation."
        />
      ) : operationComplete ? (
        <div className="bg-green-100 p-4 rounded">
          <h2 className="text-xl font-semibold text-green-800">Operation Complete</h2>
          <p>The secure operation was successfully performed.</p>
        </div>
      ) : (
        <div>Processing secure operation...</div>
      )}
    </div>
  );
}
```

### Complete MFA Integration with Security Context

For a more comprehensive integration of MFA with your application's security context:

```tsx
'use client';

import { useEffect, useState } from 'react';
import Security from '@/lib/security';
import { MFAChallenge } from '@/components/security/MFAChallenge';
import { useAuth } from '@/context/AuthContext';

export default function SecureDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [requireMFA, setRequireMFA] = useState(false);
  const [securityStatus, setSecurityStatus] = useState({
    level: 'basic',
    mfaEnabled: false,
    sessionVerified: false
  });
  
  useEffect(() => {
    async function checkSecurityStatus() {
      if (!user) return;
      
      try {
        // Check security level
        const hasHighSecurity = await Security.checkSecurityLevel('high');
        const hasMediumSecurity = await Security.checkSecurityLevel('medium');
        
        // Get MFA service
        const mfaService = Security.getMFA();
        const mfaStatus = await mfaService.getMFAStatus();
        
        // Check if user should be required to set up MFA
        const shouldEnforceMFA = mfaService.shouldEnforceMFA(user);
        
        // Get session fingerprint
        const fingerprint = Security.getSessionFingerprint();
        const fingerprintValid = await fingerprint.validate();
        
        setSecurityStatus({
          level: hasHighSecurity ? 'high' : hasMediumSecurity ? 'medium' : 'basic',
          mfaEnabled: mfaStatus.enabled,
          sessionVerified: fingerprintValid.valid
        });
        
        // Require MFA challenge if user has MFA enabled but security level is not high
        if (mfaStatus.enabled && !hasHighSecurity) {
          setRequireMFA(true);
        }
        
        // Require MFA setup if user should have MFA but doesn't
        if (shouldEnforceMFA && !mfaStatus.enabled) {
          // Redirect to MFA setup
          window.location.href = '/user/security/setup';
        }
      } catch (error) {
        console.error('Error checking security status:', error);
      } finally {
        setLoading(false);
      }
    }
    
    checkSecurityStatus();
  }, [user]);
  
  const handleMFAComplete = (success) => {
    if (success) {
      setRequireMFA(false);
      // Refresh security status
      window.location.reload();
    } else {
      // Handle verification failure
      console.error('MFA verification failed');
    }
  };
  
  if (loading) {
    return <div>Loading security status...</div>;
  }
  
  if (requireMFA) {
    return (
      <MFAChallenge 
        onComplete={handleMFAComplete}
        title="Additional Verification Required"
        description="Please verify your identity to access this dashboard."
      />
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Secure Dashboard</h1>
      
      <div className="mb-4 p-3 bg-blue-50 rounded">
        <h2 className="text-lg font-semibold">Security Status</h2>
        <ul className="list-disc list-inside">
          <li>Security Level: <span className="font-medium">{securityStatus.level}</span></li>
          <li>MFA: <span className="font-medium">{securityStatus.mfaEnabled ? 'Enabled' : 'Disabled'}</span></li>
          <li>Session: <span className="font-medium">{securityStatus.sessionVerified ? 'Verified' : 'Unverified'}</span></li>
        </ul>
      </div>
      
      {/* Dashboard content based on security status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Basic security content - available to all */}
        <div className="p-4 border rounded">
          <h2 className="text-lg font-semibold">Basic Information</h2>
          <p>Content available to all authenticated users.</p>
        </div>
        
        {/* Medium security content */}
        {(securityStatus.level === 'medium' || securityStatus.level === 'high') && (
          <div className="p-4 border rounded">
            <h2 className="text-lg font-semibold">Account Details</h2>
            <p>Content requiring medium security level.</p>
          </div>
        )}
        
        {/* High security content */}
        {securityStatus.level === 'high' && (
          <div className="p-4 border rounded">
            <h2 className="text-lg font-semibold">Sensitive Operations</h2>
            <p>Content requiring high security level with MFA.</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

## Security Testing Scenarios

The security system includes comprehensive tests for authentication, authorization, and other security features.

### Authentication Testing

The following tests verify the security of authentication flows:

```typescript
// Test secure authentication flow
it('should securely authenticate users and validate tokens', async () => {
  // Set up test user
  const testUser = {
    username: 'testuser',
    password: 'secureP@ssw0rd'
  };
  
  // Attempt authentication
  const result = await Auth.signIn(testUser);
  
  // Verify successful authentication
  expect(result.isSignedIn).toBe(true);
  
  // Verify token security
  const session = await Auth.getCurrentSession();
  expect(session.tokens.accessToken).toBeDefined();
  expect(session.tokens.idToken).toBeDefined();
  
  // Verify token contents (without exposing sensitive data)
  const decoded = decodeToken(session.tokens.idToken);
  expect(decoded.sub).toBeDefined();
  expect(decoded.auth_time).toBeDefined();
  expect(decoded.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
});
```

### Authorization Testing

Test role-based access control:

```typescript
// Test role-based access control
it('should enforce role-based access control', async () => {
  // Mock user with specific role
  const regularUser = {
    userId: 'user123',
    username: 'regularuser',
    role: 'user'
  };
  
  const adminUser = {
    userId: 'admin456',
    username: 'adminuser',
    role: 'admin'
  };
  
  // Test access to protected resource as regular user
  const regularAccess = await Security.checkAccess(regularUser, 'admin-resource');
  expect(regularAccess).toBe(false);
  
  // Test access to protected resource as admin user
  const adminAccess = await Security.checkAccess(adminUser, 'admin-resource');
  expect(adminAccess).toBe(true);
});
```

### MFA Testing

Verify MFA functionality:

```typescript
// Test MFA setup and verification
it('should complete MFA setup and verification', async () => {
  // Set up test user with MFA
  const mfaSetup = await MFAService.setupTOTPMFA();
  
  // Verify setup response
  expect(mfaSetup.setupStatus).toBe('PENDING_VERIFICATION');
  expect(mfaSetup.secretKey).toBeDefined();
  expect(mfaSetup.qrCode).toBeDefined();
  
  // Generate TOTP code from secret (in a real test, you'd use a TOTP library)
  const mockTotpCode = generateMockTotpCode(mfaSetup.secretKey);
  
  // Verify TOTP setup
  const verificationResult = await MFAService.verifyTOTPSetupWithCode(mockTotpCode);
  expect(verificationResult).toBe(true);
  
  // Check MFA status after setup
  const mfaStatus = await MFAService.getMFAStatus();
  expect(mfaStatus.enabled).toBe(true);
  expect(mfaStatus.preferred).toBe('TOTP');
});

// Test MFA challenge flow
it('should validate MFA challenge during login', async () => {
  // Mock MFA challenge during login
  const signInResult = await Auth.signIn({
    username: 'mfauser',
    password: 'correctPassword'
  });
  
  // Verify challenge response
  expect(signInResult.isSignedIn).toBe(false);
  expect(signInResult.nextStep.signInStep).toBe('CONFIRM_SIGN_IN_WITH_TOTPCODE');
  
  // Complete MFA challenge with valid code
  const mockTotpCode = generateMockTotpCode('test-secret');
  const challengeResult = await Auth.confirmSignIn(mockTotpCode);
  
  // Verify successful login after MFA
  expect(challengeResult.isSignedIn).toBe(true);
});
```

### Security Validation Testing

Test the Security validation mechanisms:

```typescript
// Test input validation and sanitization
it('should validate and sanitize inputs', async () => {
  const validInput = { name: 'John Doe', email: 'john@example.com' };
  const invalidInput = { name: '<script>alert("XSS")</script>', email: 'not-an-email' };
  
  // Test valid input
  const validResult = Security.validate(userSchema, validInput);
  expect(validResult).toEqual(validInput);
  
  // Test invalid input
  try {
    Security.validate(userSchema, invalidInput);
    fail('Should have thrown validation error');
  } catch (error) {
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.details).toContain('email');
  }
  
  // Test sanitization
  const sanitized = Security.sanitizeUserInput(invalidInput);
  expect(sanitized.name).not.toContain('<script>');
  expect(sanitized.name).toContain('alert');
});

// Test threat detection
it('should detect security threats', async () => {
  // Setup mock threat data
  const threatData = {
    userId: 'test-user',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0',
    actions: ['login', 'password-change', 'login', 'login', 'login']
  };
  
  // Detect threats
  const threatResult = await Security.detectThreats(threatData.userId, {
    includeHistoricalAnalysis: true,
    withAnomalyDetection: true
  });
  
  // Verify threat detection
  expect(threatResult.threatCount).toBeGreaterThan(0);
  expect(threatResult.threats.some(t => t.type === 'BRUTE_FORCE')).toBe(true);
});
```

For more comprehensive testing scenarios, see the authentication test files in the `__tests__/security/` directory.