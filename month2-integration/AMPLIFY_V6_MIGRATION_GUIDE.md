# AWS Amplify v6 Migration Guide

This document outlines the key changes and migration patterns applied to transition the PropIE AWS platform from AWS Amplify v5 to v6.

## Overview

The PropIE AWS platform has been migrated from AWS Amplify v5 to v6, addressing compatibility issues and leveraging new features provided by the Amplify v6 SDK. Key areas of focus include:

1. Updated import patterns and API signatures
2. Multi-factor authentication (MFA) implementation
3. GraphQL API usage
4. Analytics and monitoring integrations
5. Server-side rendering with Next.js App Router
6. Compatibility utilities to support gradual migration

## Key Changes

### 1. Updated Import Patterns

Amplify v6 uses a modular import structure to reduce bundle size. We've updated imports across the codebase to follow the new pattern:

**Before (v5):**
```javascript
import Amplify, { Auth, API, Analytics } from 'aws-amplify';
```

**After (v6):**
```javascript
import { Amplify } from 'aws-amplify';
import { signIn, signOut, fetchAuthSession } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import { record } from 'aws-amplify/analytics';
```

### 2. Configuration Updates

The Amplify configuration format has changed in v6. We've updated our configuration structure to match:

**Before (v5):**
```javascript
const amplifyConfig = {
  Auth: {
    userPoolId: 'xxx',
    userPoolWebClientId: 'xxx',
    region: 'us-east-1'
  },
  // Other services...
};
```

**After (v6):**
```javascript
const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'xxx',
      userPoolClientId: 'xxx',
      loginWith: {
        email: true,
        username: true,
        phone: false
      }
    }
  },
  // Other services with updated structure...
};
```

### 3. Authentication Updates

Authentication methods have been updated to match the new v6 API signatures:

**Before (v5):**
```javascript
const user = await Auth.signIn(username, password);
const userInfo = await Auth.currentAuthenticatedUser();
const tokens = await Auth.currentSession();
```

**After (v6):**
```javascript
const result = await signIn({ username, password });
const user = await getCurrentUser();
const session = await fetchAuthSession();
```

### 4. Multi-Factor Authentication (MFA) Updates

MFA implementation has been updated to use the new v6 API:

**Before (v5):**
```javascript
const totpSetup = await Auth.setupTOTP(user);
```

**After (v6):**
```javascript
const totpSetup = await generateTotp();
```

The response format has also changed:

**Before (v5):**
```javascript
const qrCode = totpSetup.getSetupDetails().qrCodeUrl;
const secretKey = totpSetup.getSetupDetails().secretKey;
```

**After (v6):**
```javascript
const qrCode = totpSetup.qrCodeUrl;
const secretKey = totpSetup.secretKey;
```

### 5. GraphQL API Updates

GraphQL API calls have been updated to match the new v6 API:

**Before (v5):**
```javascript
const response = await API.graphql(graphqlOperation(query, variables));
```

**After (v6):**
```javascript
const client = generateClient();
const response = await client.graphql({
  query: query,
  variables: variables
});
```

### 6. Analytics Updates

Analytics API usage has been updated to match v6:

**Before (v5):**
```javascript
Analytics.record('eventName', { 
  attribute1: 'value1' 
});
```

**After (v6):**
```javascript
record({
  name: 'eventName',
  attributes: { 
    attribute1: 'value1' 
  }
});
```

## Migration Utilities

We've created several utility modules to help with the transition from v5 to v6:

1. **v6-migration-utils.ts**: Provides compatibility functions that maintain v5-like interfaces but use v6 under the hood
2. **analytics-adapter.ts**: Adapter for the v6 analytics API to support both old and new patterns

These utilities allow for:

1. Gradual migration of existing code
2. Backward compatibility with third-party modules still using v5 patterns
3. Easier debugging during the transition period

## Breaking Changes and Workarounds

### Authentication Response Format

The authentication response format has changed significantly in v6. Our auth.ts module wraps these changes to provide a consistent interface for the application.

### Error Handling

Error codes and formats have changed in v6. We've added a `normalizeAuthError()` function in the v6-migration-utils.ts to handle these differences.

### API Signature Changes

Many API methods now use object parameters instead of positional parameters. For example:

**Before (v5):**
```javascript
Auth.confirmSignIn(challengeResponse);
```

**After (v6):**
```javascript
confirmSignIn({ challengeResponse });
```

## Multi-Factor Authentication (MFA) Implementation

AWS Amplify v6 introduces several changes to MFA implementation. Our implementation includes:

### MFA Setup and Verification

1. **TOTP (Time-based One-Time Password)**:
   ```javascript
   // Generate TOTP setup
   const totpSetup = await generateTotp();
   // Use totpSetup.qrCodeUrl to display QR code to user
   
   // Verify TOTP setup with code from authenticator app
   await verifyTOTPSetup({ totpCode: code });
   
   // Update MFA preference to TOTP
   await updateMFAPreference({
     preferredMFA: 'TOTP',
     enabled: true
   });
   ```

2. **SMS-based MFA**:
   ```javascript
   // First set phone number
   await updateUserAttributes({
     userAttributes: { phone_number: phoneNumber }
   });
   
   // Send verification code
   await sendUserAttributeVerificationCode({
     userAttributeKey: 'phone_number'
   });
   
   // Verify phone number
   await confirmVerifiedContactAttribute({
     userAttributeKey: 'phone_number',
     confirmationCode: code
   });
   
   // Update MFA preference to SMS
   await updateMFAPreference({
     preferredMFA: 'SMS_MFA',
     enabled: true
   });
   ```

### MFA During Sign-In

When a user needs to verify with MFA during sign-in, the sign-in result will contain next steps:

```javascript
const result = await signIn({ username, password });

if (result.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_SMS_CODE' || 
    result.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_TOTP_CODE') {
  // Show MFA challenge UI to user
  // After getting code from user:
  await confirmSignIn({ challengeResponse: code });
}
```

### Best Practices for MFA

1. **Clear error messages**: Provide specific error messages for different MFA failures
2. **Fallback options**: Always offer an alternative verification method when possible
3. **Caching MFA status**: Cache the MFA status to avoid excessive API calls
4. **Progressive enhancement**: Allow users to complete basic actions before enforcing MFA
5. **Role-based enforcement**: Enforce MFA based on user roles and access levels

## Server-Side Rendering with Next.js App Router

Amplify v6 provides better support for server-side rendering, but still requires specific patterns for use in Next.js App Router. We've implemented the following approach:

### Client vs Server Components

**For Client Components:**

```javascript
'use client';

import { Auth } from '@/lib/amplify/auth';
import { ensureAmplifyInitialized } from '@/lib/amplify/index';

// Ensure Amplify is initialized before using
ensureAmplifyInitialized();

// Now use Auth methods
const user = await Auth.getCurrentUser();
```

**For Server Components:**

```javascript
import { ServerAmplify } from '@/lib/amplify/server';

// Use the server adapter directly - no initialization needed
const user = await ServerAmplify.Auth.getCurrentUser();
```

### Proper Initialization Patterns

1. **Centralized initialization**: We use a centralized module (`src/lib/amplify/index.ts`) to handle initialization across the app.

2. **Lazy initialization**: We've implemented a lazy initialization pattern that only initializes Amplify when it's actually needed, using the `ensureAmplifyInitialized()` function.

3. **Singleton client instances**: We create singleton GraphQL clients to avoid creating new instances for each request.

4. **Server adapters**: We've created server-safe versions of Amplify services for use in Server Components.

## Import Best Practices

To maintain clean and consistent code, follow these import patterns:

1. **For client components**:
   ```javascript
   // Import from our wrapper modules, not directly from aws-amplify
   import { Auth } from '@/lib/amplify/auth';
   import { API } from '@/lib/amplify/api';
   ```

2. **For server components**:
   ```javascript
   import { ServerAmplify } from '@/lib/amplify/server';
   // Then use ServerAmplify.Auth, ServerAmplify.API, etc.
   ```

3. **Direct imports (discouraged except in wrapper modules)**:
   ```javascript
   // Should only be used in our wrapper modules
   import { signIn, signOut } from 'aws-amplify/auth';
   ```

4. **Utilities**:
   ```javascript
   import { Hub } from '@/lib/amplify/index';
   ```

## Error Handling Best Practices

1. **Use the normalizeAuthError utility**:
   ```javascript
   import { normalizeAuthError } from '@/lib/amplify/v6-migration-utils';
   
   try {
     await signIn({ username, password });
   } catch (error) {
     const normalizedError = normalizeAuthError(error);
     // Now normalizedError has consistent .code, .message, and .name properties
   }
   ```

2. **Check for specific error codes**:
   ```javascript
   try {
     await signIn({ username, password });
   } catch (error) {
     if (error.code === 'UserNotConfirmedException') {
       // Handle unconfirmed user
     } else if (error.code === 'NotAuthorizedException') {
       // Handle invalid credentials
     }
   }
   ```

## Next Steps

1. Continue updating any remaining v5 patterns throughout the codebase
2. Test authentication flows thoroughly across all user scenarios
3. Validate GraphQL operations with the new client
4. Monitor for any performance or bundle size impacts
5. Consider phasing out compatibility utilities as the migration completes
6. Implement end-to-end testing for critical authentication and API flows

## Resources

- [Official AWS Amplify v6 Migration Guide](https://docs.amplify.aws/react/tools/migrating-from-v5/)
- [Amplify v6 API Reference](https://docs.amplify.aws/react/tools/reference/authentication-reference/)
- [Amplify v6 Authentication](https://docs.amplify.aws/react/build-a-backend/auth/manage-mfa/)
- [Amplify v6 API (GraphQL)](https://docs.amplify.aws/react/build-a-backend/graphqlapi/query-data/)