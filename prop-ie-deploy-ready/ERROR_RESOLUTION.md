# PropIE AWS App - Error Resolution Guide

This guide provides solutions for common errors and issues you might encounter when working with the PropIE AWS App. It covers AWS Amplify integration, React Server Components, TypeScript errors, and build/deployment issues.

## Table of Contents

1. [AWS Amplify v6 Issues](#aws-amplify-v6-issues)
2. [React Server Component Issues](#react-server-component-issues)
3. [TypeScript Errors](#typescript-errors)
4. [Build and Deployment Issues](#build-and-deployment-issues)
5. [Runtime Errors](#runtime-errors)

## AWS Amplify v6 Issues

### Error: 'Auth' is not exported from 'aws-amplify'

**Problem:** 
```
Error: Module '"aws-amplify"' has no exported member 'Auth'.
```

**Solution:**
AWS Amplify v6 uses a modular import approach. Replace:

```typescript
// Old approach - won't work
import { Auth } from 'aws-amplify';
```

With:

```typescript
// New approach for client components
import { Auth } from '@/lib/amplify/auth';

// OR for direct imports (not recommended)
import { signIn, signOut } from 'aws-amplify/auth';
```

### Error: "window is not defined" in Server Components

**Problem:**
```
ReferenceError: window is not defined
```

**Solution:**
AWS Amplify operations that access browser APIs should not be used in Server Components. Use:

1. Import `serverFetch` from `@/lib/amplify/server` for server components
2. Move AWS Amplify code to a Client Component (add 'use client' directive)
3. Use dynamic imports with `next/dynamic` to defer Amplify imports to client-side

Example:
```typescript
// In a server component
import { serverFetch } from '@/lib/amplify/server';

// Fetch data server-side
const data = await serverFetch('/api/data');
```

### Error: "Amplify configuration not found"

**Problem:**
```
Error: No Amplify configuration found. Did you forget to call Amplify.configure?
```

**Solution:**

1. Make sure your component is wrapped with `AmplifyProvider`
2. Verify that `.env.local` contains all required environment variables
3. Use our centralized initialization:

```typescript
// Import the provider in your client component
import { AmplifyProvider } from '@/components/AmplifyProvider';

// Wrap your component
<AmplifyProvider>
  <YourComponent />
</AmplifyProvider>
```

### Error: "Invalid signature in request" with AWS Amplify v6

**Problem:**
```
Error: Invalid signature in request (Service: AmazonS3; Status Code: 403)
```

**Solution:**

This error often occurs when AWS credentials or region are incorrectly configured:

1. Check that AWS region matches in both `src/lib/amplify/config.ts` and `.env.local`
2. Ensure IAM roles have correct permissions for S3 operations
3. Verify that authentication is complete before attempting S3 operations
4. Use the storage module correctly:

```typescript
// Correct approach with typed parameters
import { Storage } from '@/lib/amplify/storage';

// Upload a file with proper access level
await Storage.uploadFile({
  key: 'filename.jpg',
  file: fileObject,
  options: {
    accessLevel: 'private',
    contentType: 'image/jpeg'
  }
});
```

### Error: Multiple instances of AWS Amplify running

**Problem:**
```
Warning: Multiple instances of Amplify detected. This may cause unexpected behavior.
```

**Solution:**

This happens when there are multiple instances of Amplify running with different configurations:

1. Always use the centralized configuration from `@/lib/amplify/index.ts`
2. Use the `ensureAmplifyInitialized()` function to prevent multiple initializations
3. Avoid direct imports from 'aws-amplify' packages
4. Remove any legacy Amplify configuration code

```typescript
// In your client component
import { ensureAmplifyInitialized } from '@/lib/amplify';

// Safe initialization
useEffect(() => {
  ensureAmplifyInitialized();
}, []);
```

### Error: "Cannot read properties of undefined (reading 'get')" with Amplify API

**Problem:**
```
TypeError: Cannot read properties of undefined (reading 'get')
```

**Solution:**

This typically happens when using API methods before Amplify is initialized:

1. Make sure to call `ensureAmplifyInitialized()` before using API methods
2. In client components, wrap API calls in a useEffect to ensure they run after initialization
3. For server components, use the `serverFetch` function instead

```typescript
// Client component
'use client';
import { useEffect, useState } from 'react';
import { API } from '@/lib/amplify/api';
import { ensureAmplifyInitialized } from '@/lib/amplify';

function DataComponent() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      ensureAmplifyInitialized();
      try {
        const result = await API.get('/endpoint');
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);
  
  return <div>{/* Render data */}</div>;
}
```

### Error: Type errors with AWS Amplify v6 operations

**Problem:**
```
Error: Argument of type '{ key: string; }' is not assignable to parameter of type 'GetObjectCommandInput'.
```

**Solution:**

AWS Amplify v6 uses more strongly typed parameters. Use our type-safe wrappers and type definitions:

1. Import types from `@/types/amplify/*`
2. Use the typed methods from our Amplify modules
3. Provide all required parameters

```typescript
// Import the correct types
import { StorageUploadFileOptions } from '@/types/amplify/storage';
import { Storage } from '@/lib/amplify/storage';

// Use with proper types
const options: StorageUploadFileOptions = {
  key: 'filename.jpg',
  file: fileObject,
  options: {
    accessLevel: 'private',
    contentType: 'image/jpeg'
  }
};

await Storage.uploadFile(options);
```

### Error: OAuth configuration issues with Amplify v6

**Problem:**
```
Error: Invalid redirect_uri. redirect_uri does not match the registered callback URLs
```

**Solution:**

OAuth configuration in Amplify v6 requires careful setup:

1. Check that redirect URLs in Cognito match exactly with the ones in your configuration
2. Include all required OAuth settings in `aws-exports.js` or `amplify/config.ts`
3. Use the `withAmplifyOAuth` helper for OAuth authentication

```typescript
// In amplify/config.ts
export const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
      loginWith: {
        oauth: {
          domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN,
          scopes: ['email', 'profile', 'openid'],
          redirectSignIn: ['http://localhost:3000/login/callback', 'https://yourdomain.com/login/callback'],
          redirectSignOut: ['http://localhost:3000/', 'https://yourdomain.com/'],
          responseType: 'code'
        }
      }
    }
  }
};
```

## React Server Component Issues

### Error: TypeError: (0 , _react.cache) is not a function

**Problem:**
```
TypeError: (0 , _react.cache) is not a function
```

**Solution:**

This is a compatibility issue between React's cache function and the codebase. Use our custom cache implementation:

```typescript
// Instead of
import { cache } from 'react';

// Use
import { safeCache } from '@/utils/performance/safeCache';
```

### Error: "Cannot use client directives in server components"

**Problem:**
```
Error: You're importing a component that uses 'use client' in a Server Component.
```

**Solution:**

1. Create a separate client component file with the 'use client' directive
2. Import this client component in your server component
3. Don't mix client-side hooks or browser APIs in server components

Example structure:
```
/components/feature/
├── FeatureClient.tsx  (with 'use client')
└── Feature.tsx        (server component that imports FeatureClient)
```

### Error: "React Suspense boundaries are not supported in Server Components"

**Problem:**
```
Error: React Suspense boundaries are not supported in Server Components.
```

**Solution:**

This error occurs when using React Suspense directly in a Server Component:

1. Move the Suspense boundary to a Client Component
2. Use Next.js's built-in loading states with `loading.tsx` files
3. Use Error Boundaries for error handling

Example structure:
```
/app/feature/
├── loading.tsx      (Next.js loading state for the route)
├── error.tsx        (Next.js error handling for the route)
├── page.tsx         (Server Component)
└── ClientContent.tsx (Client Component with Suspense)
```

### Error: "Cannot pass function as a prop to a Server Component"

**Problem:**
```
Error: Event handlers cannot be passed to Client Component props during Server Component rendering.
```

**Solution:**

This error occurs when passing functions to client components from server components:

1. Move the entire component to be a client component if it needs event handlers
2. Use a pattern where client components define their own event handlers
3. Use URL-based navigation instead of function handlers in server components

```tsx
// Correct approach
// Server Component
export default function Page() {
  return <ClientButton href="/action" />;
}

// Client Component
'use client';
export function ClientButton({ href }) {
  const handleClick = () => {
    // Handle click client-side
  };
  
  return <button onClick={handleClick}>Click me</button>;
}
```

## TypeScript Errors

### Error: TypeScript interface extension errors

**Problem:**
```
Types of property 'nearbyPlaces' are incompatible.
```

**Solution:**

Use our centralized type definitions from the `types/development` directory:

```typescript
// Instead of
import { Development } from '@/types/development';

// Use
import { Development } from '@/types/development/index';
```

For development-related types, we've consolidated all interfaces to eliminate conflicts.

### Error: Module not found

**Problem:**
```
Cannot find module '@/lib/amplify-config' or its corresponding type declarations.
```

**Solution:**

The file structure has been updated. Use the new module paths:

```typescript
// Old
import config from '@/lib/amplify-config';

// New
import config from '@/lib/amplify/config';
```

### Error: Type incompatibility with AWS Amplify types

**Problem:**
```
Type 'StorageOptions' is not assignable to type 'PutObjectCommandInput'.
```

**Solution:**

We've created comprehensive type definitions for AWS Amplify v6 in `@/types/amplify`:

```typescript
// Import proper types
import { StorageOptions } from '@/types/amplify/storage';

// Use the correct type
const options: StorageOptions = {
  accessLevel: 'private',
  contentType: 'application/json'
};
```

## Build and Deployment Issues

### Error: Missing 'critters' module

**Problem:**
```
Error: Cannot find module 'critters'
```

**Solution:**

The critters module is now included in the dependencies. If you're still seeing this error:

1. Make sure you've installed dependencies with `pnpm install`
2. If the error persists, manually install:
   ```bash
   pnpm add -D critters@^0.0.20
   ```

### Error: Wrangler version conflict

**Problem:**
```
Error: This version of wrangler is not compatible with @opennextjs/cloudflare
```

**Solution:**

We've updated the configuration to resolve these conflicts:

1. Wrangler is now updated to v4.24.0
2. Worker-specific build commands are disabled
3. The OpenNext Cloudflare integration is no longer used

If you need Cloudflare integration, consult the team for the recommended approach.

### Error: AWS Amplify build errors in Next.js 15

**Problem:**
```
Error: [webpack.cache.PackFileCacheStrategy] Cannot find module 'aws-amplify/auth'
```

**Solution:**

This occurs when Next.js has webpack resolution issues with AWS Amplify v6:

1. Make sure `next.config.mjs` includes our custom webpack configuration:

```javascript
// next.config.mjs
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Fix for AWS Amplify v6
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        util: require.resolve('util/')
      };
    }
    return config;
  }
};
```

2. Clear your Next.js cache with:
```bash
rm -rf .next
```

3. Reinstall dependencies and rebuild:
```bash
pnpm install
pnpm build
```

## Runtime Errors

### Error: Hydration mismatch

**Problem:**
```
Warning: Text content did not match. Server: "Loading..." Client: "User data"
```

**Solution:**

This occurs when server and client rendering don't match. To fix:

1. Use conditional rendering with proper loading states
2. Make sure data fetching follows the client/server pattern
3. Use React Suspense boundaries appropriately

Example:
```tsx
// Server component
export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <UserData />
    </Suspense>
  );
}

// Client component
'use client';
export function UserData() {
  const { data, isLoading } = useQuery(...);
  
  if (isLoading) return <Loading />;
  return <div>{data.name}</div>;
}
```

### Error: Route handling conflicts

**Problem:**
```
Error: Conflicting app and page route for /login
```

**Solution:**

Next.js App Router and Pages Router can conflict. To fix:

1. Move all page routes to the App Router (`/src/app/` directory)
2. Remove any duplicated routes in the Pages Router (`/src/pages/`)
3. Use proper redirects in `next.config.mjs` for legacy routes

### Error: "Cannot access auth tokens" in server components

**Problem:**
```
Error: Cannot access auth tokens in a server component
```

**Solution:**

Authentication tokens should not be accessed in server components. Instead:

1. Use server-side authentication with secure session cookies
2. Use middleware for route protection
3. Pass needed data to client components 
4. Use the serverFetch utility for authenticated server-side requests

```typescript
// In a server component
import { serverFetch } from '@/lib/amplify/server';

export default async function ProtectedPage() {
  // Server-side authenticated data fetch
  const userData = await serverFetch('/api/user/profile');
  
  // Pass to client component
  return <UserProfileClient initialData={userData} />;
}
```

## Getting Help

If you encounter issues not covered in this guide:

1. Check the [Architecture Documentation](./ARCHITECTURE.md) for design insights
2. Review the AWS Amplify v6 documentation for API changes
3. Search the project codebase for similar patterns
4. Consult with the development team

## Common Error Resolution Patterns

When troubleshooting, follow these general patterns:

1. **Server vs. Client issues**: Most errors are related to confusion between server and client code
2. **AWS Amplify API changes**: Many errors come from outdated import patterns
3. **TypeScript definitions**: Type errors often stem from inconsistent type definitions
4. **Environment variables**: Missing environment variables cause initialization failures
5. **Dependency conflicts**: Version conflicts in dependencies cause build errors

By understanding these patterns, you can efficiently troubleshoot and resolve most issues in the PropIE AWS App.