# AWS Amplify v6 Configuration Guide

This document provides guidance on configuring AWS Amplify v6 with Next.js App Router in the PropIE AWS application.

## Key Differences in Amplify v6

AWS Amplify v6 introduces modular imports and a new configuration format that differs significantly from v5. Key changes include:

1. **Modular Imports**: Each Amplify service is now imported individually instead of from the main `aws-amplify` package
2. **Configuration Format**: The configuration object structure has been updated
3. **Category Names**: Categories like `Auth`, `API`, etc. are now capitalized in configuration
4. **Authentication Flow**: The auth flow APIs have changed, with different method signatures and return types

## Correct Configuration Pattern

### 1. Initializing Amplify

```typescript
// src/lib/amplify/index.ts
import { Amplify as AmplifyCore } from 'aws-amplify';
import amplifyConfig from './config';

// Initialize Amplify
export function initialize(options = {}) {
  try {
    // Configure Amplify with our config
    AmplifyCore.configure(amplifyConfig);
    
    // Rest of initialization...
    return true;
  } catch (error) {
    console.error('[Amplify] Failed to initialize:', error);
    return false;
  }
}
```

### 2. Configuration Format

```typescript
// src/lib/amplify/config.ts
import { ResourcesConfig } from 'aws-amplify';
import awsExports from '@/aws-exports';

const amplifyConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOLS_ID || awsExports.aws_user_pools_id,
      userPoolClientId: process.env.NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID || awsExports.aws_user_pools_web_client_id,
      identityPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID || awsExports.aws_cognito_identity_pool_id,
      loginWith: {
        email: true,
        username: true,
        phone: false
      }
    }
  },
  API: {
    REST: {
      PropAPI: {
        endpoint: process.env.NEXT_PUBLIC_API_URL || 'https://api.prop-ie.com',
        region: process.env.NEXT_PUBLIC_AWS_REGION || awsExports.aws_project_region
      }
    },
    GraphQL: {
      endpoint: process.env.NEXT_PUBLIC_APPSYNC_GRAPHQL_ENDPOINT || awsExports.aws_appsync_graphqlEndpoint,
      region: process.env.NEXT_PUBLIC_AWS_REGION || awsExports.aws_project_region,
      defaultAuthMode: 'apiKey'
    }
  },
  Storage: {
    S3: {
      bucket: process.env.NEXT_PUBLIC_S3_BUCKET || awsExports.aws_user_files_s3_bucket,
      region: process.env.NEXT_PUBLIC_S3_REGION || awsExports.aws_user_files_s3_bucket_region
    }
  }
};

export default amplifyConfig;
```

### 3. Auth Service Usage

```typescript
// src/lib/amplify/auth.ts
import {
  signIn,
  signUp,
  signOut,
  confirmSignUp,
  resetPassword,
  confirmResetPassword,
  confirmSignIn,
  getCurrentUser,
  fetchUserAttributes,
  fetchAuthSession
} from 'aws-amplify/auth';

// Example of a getCurrentUser implementation
export async function getCurrentAuthUser() {
  try {
    const user = await getCurrentUser();
    const attributes = await fetchUserAttributes();
    
    return {
      userId: user.userId,
      username: user.username,
      email: attributes.email,
      // Other attributes...
    };
  } catch (error) {
    // User is not authenticated
    return null;
  }
}
```

### 4. Client Component Integration

```typescript
// src/components/AmplifyProvider.tsx
'use client';

import React, { useEffect } from 'react';
import { initialize as initializeAmplify } from '@/lib/amplify';

export function AmplifyProvider({ children }) {
  useEffect(() => {
    // Initialize Amplify when the component mounts
    initializeAmplify();
  }, []);

  return <>{children}</>;
}
```

## Common Pitfalls and Solutions

### 1. Incorrect Import Pattern

**Problem**: Using the old import pattern from v5

```typescript
// ❌ INCORRECT
import { Auth } from 'aws-amplify';
await Auth.signIn(username, password);
```

**Solution**: Use the new modular imports

```typescript
// ✅ CORRECT
import { signIn } from 'aws-amplify/auth';
await signIn({ username, password });
```

### 2. Configuration Format Issues

**Problem**: Using the v5 configuration format

```typescript
// ❌ INCORRECT
Amplify.configure({
  Auth: {
    userPoolId: '...',
    userPoolWebClientId: '...'
  }
});
```

**Solution**: Use the new v6 configuration format

```typescript
// ✅ CORRECT
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: '...',
      userPoolClientId: '...',
      loginWith: {
        email: true
      }
    }
  }
});
```

### 3. Method Parameter Changes

**Problem**: Using old method signatures

```typescript
// ❌ INCORRECT
await Auth.signIn(username, password);
```

**Solution**: Use the new parameter objects

```typescript
// ✅ CORRECT
await signIn({ username, password });
```

### 4. `Amplify.configure` is not a function

**Problem**: Incorrect import of Amplify core

```typescript
// ❌ INCORRECT
import Amplify from 'aws-amplify';
Amplify.configure(config); // Error: Amplify.configure is not a function
```

**Solution**: Import the correct Amplify object

```typescript
// ✅ CORRECT
import { Amplify } from 'aws-amplify';
Amplify.configure(config);
```

### 5. `ensureAmplifyInitialized is not a function`

**Problem**: Importing a non-existent function or from the wrong module

**Solution**: Create and export the function explicitly or import from the correct module

```typescript
// In src/lib/amplify/index.ts
export function ensureAmplifyInitialized() {
  if (typeof window !== 'undefined' && !isInitialized) {
    initialize();
  }
  return isInitialized;
}
```

## Verification Steps

To verify your Amplify configuration is working correctly:

1. **Check Initialization**: Add a console log in the `initialize` function to confirm it runs successfully
2. **Test Authentication**: Attempt to sign in with a test account and check if tokens are received
3. **Verify API Calls**: Make a test API call to ensure the configuration is working
4. **Check Storage**: Test uploading and downloading a small file to verify storage configuration

## Environment Support

Make sure your Amplify configuration works correctly in all environments:

1. **Development**: Include debug logging and more verbose error handling
2. **Testing/Staging**: Configure with test accounts but equivalent security
3. **Production**: Optimize for performance and security, minimize logging

## Resources

- [AWS Amplify v6 Documentation](https://docs.amplify.aws/)
- [Migrating from v5 to v6](https://docs.amplify.aws/react/build-a-backend/auth/migrate-from-v5/)
- [Authentication with Amplify v6](https://docs.amplify.aws/react/build-a-backend/auth/set-up-auth/)