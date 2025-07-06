# Multi-Factor Authentication (MFA) Implementation Guide

This document provides a comprehensive guide for implementing Multi-Factor Authentication (MFA) using the security system in the PropIE application. It covers the complete MFA flow, from setup to verification, and includes examples of integrating MFA into your application.

## Table of Contents

1. [MFA Overview](#mfa-overview)
2. [MFA Implementation Architecture](#mfa-implementation-architecture)
3. [MFA Setup Flow](#mfa-setup-flow)
4. [MFA Challenge Flow](#mfa-challenge-flow)
5. [MFA Recovery Options](#mfa-recovery-options)
6. [Role-Based MFA Requirements](#role-based-mfa-requirements)
7. [Implementation Examples](#implementation-examples)
8. [Best Practices](#best-practices)

## MFA Overview

Multi-Factor Authentication adds an additional layer of security to your application by requiring users to verify their identity through multiple means:

- **Something they know**: Password (first factor)
- **Something they have**: Mobile device with authenticator app or phone for SMS (second factor)
- **Something they are**: Biometrics (not implemented in this version)

The security system supports the following MFA methods:

- **TOTP (Time-based One-Time Password)**: Using authenticator apps like Google Authenticator, Microsoft Authenticator, or Authy
- **SMS**: One-time codes sent via SMS to the user's registered phone number
- **Recovery Codes**: For account recovery when other MFA methods are unavailable

## MFA Implementation Architecture

The MFA implementation is built on AWS Cognito's MFA capabilities with enhancements for better user experience and flexibility:

- **Core MFA Module**: Located at `src/lib/security/mfa/index.ts`
- **Frontend Components**:
  - MFA Setup: `src/components/security/MFASetup.tsx`
  - MFA Challenge: `src/components/security/MFAChallenge.tsx`
  - Security Setup Wizard: `src/components/security/SecuritySetupWizard.tsx`
- **Integration with Auth**: Works with Amplify Auth v6 in `src/lib/amplify/auth.ts`

## MFA Setup Flow

The MFA setup process follows these steps:

### 1. Initiate MFA Setup

To start the MFA setup process, call the `setupTOTPMFA` function from the MFA service:

```typescript
import { MFAService } from '@/lib/security/mfa';

// Get setup data including QR code and secret key
const setupData = await MFAService.setupTOTPMFA();
```

The setup data includes:
- `qrCode`: QR code URL to scan with authenticator app
- `secretKey`: Secret key for manual entry into authenticator app
- `setupStatus`: Current status of setup ('PENDING_VERIFICATION' or 'ERROR')

### 2. Display QR Code and Secret Key

Show the QR code to the user to scan with their authenticator app, along with the secret key for manual entry:

```jsx
// In your MFA setup component
return (
  <div>
    <h2>Set Up Authenticator App</h2>
    {setupData.qrCode && (
      <img src={setupData.qrCode} alt="QR Code for authenticator app" />
    )}
    <p>Can't scan the QR code? Enter this key manually:</p>
    <code>{setupData.secretKey}</code>
  </div>
);
```

### 3. Verify Setup with TOTP Code

Once the user has set up their authenticator app, they need to enter a code to verify the setup:

```typescript
// Verify the TOTP setup with a code from the authenticator app
const verificationSuccess = await MFAService.verifyTOTPSetupWithCode(totpCode);

if (verificationSuccess) {
  // MFA setup completed successfully
  // Show recovery codes or complete the setup
} else {
  // Verification failed, show error
}
```

### 4. Generate and Store Recovery Codes

After successful verification, generate recovery codes for the user:

```typescript
// Generate recovery codes for the user
const recoveryCodes = await MFAService.generateRecoveryCodes();

// Display these to the user
return (
  <div>
    <h2>Save Your Recovery Codes</h2>
    <p>Store these codes securely. Each code can be used once to access your account if you lose your authenticator device.</p>
    <ul>
      {recoveryCodes.map((code, index) => (
        <li key={index}>{code}</li>
      ))}
    </ul>
  </div>
);
```

### 5. Complete MFA Setup

After the user confirms they've saved their recovery codes, complete the setup:

```typescript
// MFA is now enabled for the user
// Update the UI to reflect the new security status
const mfaStatus = await MFAService.getMFAStatus();
```

## MFA Challenge Flow

The MFA challenge flow is triggered during authentication or when performing sensitive operations:

### 1. Detect MFA Requirement

During sign-in or sensitive operations, check if MFA is required:

```typescript
import { Auth } from '@/lib/amplify/auth';

// During sign-in
const signInResult = await Auth.signIn({
  username: 'user@example.com',
  password: 'password'
});

// Check if MFA challenge is required
if (signInResult.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_TOTPCODE') {
  // Show MFA challenge UI
}
```

For sensitive operations after login:

```typescript
import Security from '@/lib/security';

// Check if operation requires additional verification
const securityLevel = await Security.checkSecurityLevel('high');
if (!securityLevel) {
  // Show MFA challenge UI for the operation
}
```

### 2. Present MFA Challenge UI

Use the `MFAChallenge` component to prompt the user for a verification code:

```jsx
import { MFAChallenge } from '@/components/security/MFAChallenge';

// In your component
return (
  <MFAChallenge
    onComplete={(success) => {
      if (success) {
        // Proceed with the operation or login
      } else {
        // Handle verification failure
      }
    }}
    title="Verification Required"
    description="Please verify your identity to continue."
  />
);
```

### 3. Verify MFA Code

When the user submits their code, verify it:

```typescript
// For login MFA challenge
const confirmResult = await Auth.confirmSignIn(mfaCode);
if (confirmResult.isSignedIn) {
  // MFA verification successful, user is now signed in
}

// For operation MFA challenge
import { MFAService } from '@/lib/security/mfa';
const verificationSuccess = await MFAService.completeMFAChallenge(mfaCode);
if (verificationSuccess) {
  // MFA verification successful, proceed with operation
}
```

### 4. Handle Verification Result

After verification, proceed with the intended operation or handle failures:

```typescript
if (verificationSuccess) {
  // Proceed with the operation
  performSecureOperation();
} else {
  // Show error and allow retry
  setError('Verification failed. Please try again.');
}
```

## MFA Recovery Options

The security system provides multiple recovery options for users who lose access to their MFA device:

### Recovery Codes

Users can use previously generated recovery codes:

```typescript
// Verify a recovery code
import { MFAService } from '@/lib/security/mfa';
const recoverySuccess = await MFAService.verifyRecoveryCode(recoveryCode);

if (recoverySuccess) {
  // Recovery successful, prompt user to set up a new MFA method
}
```

### SMS Fallback

If the user has a verified phone number, they can use SMS as a fallback:

```typescript
// Send SMS verification code
await MFAService.setupSMSMFA(phoneNumber);

// Verify SMS code
const verificationSuccess = await MFAService.verifySMSSetup(smsCode);
```

### Admin Reset

In extreme cases, administrators can reset a user's MFA settings:

```typescript
// Reset all MFA methods (admin only)
await MFAService.resetAllMFAMethods();
```

## Role-Based MFA Requirements

The security system can enforce MFA based on user roles or for specific operations:

```typescript
// Check if MFA should be enforced for this user
import { MFAService } from '@/lib/security/mfa';
const user = { role: 'admin' };
const shouldRequireMFA = MFAService.shouldEnforceMFA(user);

if (shouldRequireMFA) {
  // Redirect to MFA setup if not enabled
  const mfaStatus = await MFAService.getMFAStatus();
  if (!mfaStatus.enabled) {
    // Redirect to MFA setup
  }
}
```

Customize the role requirements in the MFA service:

```typescript
// In src/lib/security/mfa/index.ts
export function shouldEnforceMFA(user: { role?: string; roles?: string[] }): boolean {
  // Get roles from user
  const roles = user.roles || (user.role ? [user.role] : []);
  
  // Roles that require MFA
  const mfaRequiredRoles = ['admin', 'developer', 'financial'];
  
  // Check if any user role requires MFA
  return roles.some(role => mfaRequiredRoles.includes(role.toLowerCase()));
}
```

## Implementation Examples

### Complete MFA Setup Component

Here's a comprehensive example of implementing the MFA setup UI:

```jsx
import { useState, useEffect } from 'react';
import { MFAService } from '@/lib/security/mfa';
import { useAuth } from '@/context/AuthContext';

export function MFASetupPage() {
  const { user } = useAuth();
  const [step, setStep] = useState('start'); // start, setup, verify, recovery, complete
  const [setupData, setSetupData] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [error, setError] = useState(null);
  
  // Start TOTP setup
  const handleStartSetup = async () => {
    try {
      setError(null);
      const data = await MFAService.setupTOTPMFA();
      setSetupData(data);
      setStep('setup');
    } catch (err) {
      setError('Failed to start MFA setup: ' + err.message);
    }
  };
  
  // Verify TOTP code
  const handleVerifyCode = async () => {
    try {
      setError(null);
      const success = await MFAService.verifyTOTPSetupWithCode(verificationCode);
      
      if (success) {
        // Generate recovery codes
        const codes = await MFAService.generateRecoveryCodes();
        setRecoveryCodes(codes);
        setStep('recovery');
      } else {
        setError('Verification failed. Please try again.');
      }
    } catch (err) {
      setError('Failed to verify code: ' + err.message);
    }
  };
  
  // Complete setup
  const handleCompleteSetup = () => {
    setStep('complete');
  };
  
  // Render UI based on current step
  return (
    <div>
      <h1>Set Up Multi-Factor Authentication</h1>
      
      {error && <div className="error">{error}</div>}
      
      {step === 'start' && (
        <div>
          <p>Enhance your account security by setting up multi-factor authentication.</p>
          <button onClick={handleStartSetup}>Start Setup</button>
        </div>
      )}
      
      {step === 'setup' && setupData && (
        <div>
          <h2>Scan QR Code</h2>
          <p>Scan this QR code with your authenticator app:</p>
          <img src={setupData.qrCode} alt="QR Code" className="qr-code" />
          
          <h3>Or enter this code manually:</h3>
          <code className="secret-key">{setupData.secretKey}</code>
          
          <div>
            <label>
              Enter the 6-digit verification code from your app:
              <input 
                type="text" 
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                pattern="[0-9]*"
              />
            </label>
            <button 
              onClick={handleVerifyCode}
              disabled={verificationCode.length !== 6}
            >
              Verify
            </button>
          </div>
        </div>
      )}
      
      {step === 'recovery' && (
        <div>
          <h2>Save Recovery Codes</h2>
          <p>Keep these recovery codes in a safe place. If you lose your device, you'll need one of these codes to access your account.</p>
          
          <div className="recovery-codes">
            {recoveryCodes.map((code, index) => (
              <div key={index} className="recovery-code">{code}</div>
            ))}
          </div>
          
          <button onClick={handleCompleteSetup}>
            I've saved these codes
          </button>
        </div>
      )}
      
      {step === 'complete' && (
        <div>
          <h2>MFA Setup Complete</h2>
          <p>Your account is now protected with multi-factor authentication.</p>
        </div>
      )}
    </div>
  );
}
```

### MFA Challenge Component

Here's an example of implementing an MFA challenge for sensitive operations:

```jsx
import { useState } from 'react';
import { MFAService } from '@/lib/security/mfa';

export function SecureOperationPage() {
  const [step, setStep] = useState('initial'); // initial, challenge, processing, complete
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState(null);
  
  // Start secure operation
  const handleStartOperation = async () => {
    try {
      // Check if MFA is required for this operation
      const mfaStatus = await MFAService.getMFAStatus();
      
      if (mfaStatus.enabled) {
        // Require MFA challenge
        setStep('challenge');
      } else {
        // Proceed without MFA
        handlePerformOperation();
      }
    } catch (err) {
      setError('Failed to check MFA status: ' + err.message);
    }
  };
  
  // Verify MFA code
  const handleVerifyCode = async () => {
    try {
      setError(null);
      
      // Verify the MFA code
      const success = await MFAService.completeMFAChallenge(verificationCode);
      
      if (success) {
        // Proceed with operation after verification
        handlePerformOperation();
      } else {
        setError('Verification failed. Please try again.');
      }
    } catch (err) {
      setError('Failed to verify code: ' + err.message);
    }
  };
  
  // Perform the secure operation
  const handlePerformOperation = async () => {
    try {
      setStep('processing');
      
      // Perform the actual secure operation
      await performSecureOperation();
      
      setStep('complete');
    } catch (err) {
      setError('Operation failed: ' + err.message);
      setStep('initial');
    }
  };
  
  // Placeholder for secure operation
  const performSecureOperation = async () => {
    // Simulate an API call
    return new Promise(resolve => setTimeout(resolve, 1000));
  };
  
  // Render UI based on current step
  return (
    <div>
      <h1>Secure Operation</h1>
      
      {error && <div className="error">{error}</div>}
      
      {step === 'initial' && (
        <div>
          <p>This operation requires additional verification for security purposes.</p>
          <button onClick={handleStartOperation}>Continue</button>
        </div>
      )}
      
      {step === 'challenge' && (
        <div>
          <h2>Security Verification</h2>
          <p>Please enter the verification code from your authenticator app:</p>
          
          <div>
            <input 
              type="text" 
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
              pattern="[0-9]*"
            />
            <button 
              onClick={handleVerifyCode}
              disabled={verificationCode.length !== 6}
            >
              Verify
            </button>
          </div>
        </div>
      )}
      
      {step === 'processing' && (
        <div>
          <p>Processing your request...</p>
        </div>
      )}
      
      {step === 'complete' && (
        <div>
          <h2>Operation Complete</h2>
          <p>The secure operation was completed successfully.</p>
        </div>
      )}
    </div>
  );
}
```

## Best Practices

Follow these best practices when implementing MFA:

1. **Clear User Communication**: 
   - Explain the benefits of MFA to users
   - Provide clear instructions for setup and use
   - Explain the importance of saving recovery codes

2. **Progressive Enhancement**:
   - Make MFA optional for general users but required for higher-risk roles
   - Consider making MFA mandatory for sensitive operations even if not required for login

3. **Thoughtful UX**:
   - Minimize friction during the MFA setup process
   - Provide multiple recovery options
   - Allow users to manage their MFA settings easily

4. **Security Considerations**:
   - Never log or display MFA secrets in plain text in logs
   - Use secure storage for MFA settings and recovery codes
   - Implement rate limiting for MFA attempts to prevent brute force attacks

5. **Testing**:
   - Test all MFA flows thoroughly, including edge cases
   - Test recovery flows to ensure users can regain access
   - Consider accessibility testing for MFA interfaces

6. **Monitoring and Analytics**:
   - Track MFA adoption rates
   - Monitor failed MFA attempts for potential security incidents
   - Collect feedback on the MFA experience to improve it

By following this guide, you'll be able to implement a secure, user-friendly MFA system that enhances the security of your application while maintaining a positive user experience.