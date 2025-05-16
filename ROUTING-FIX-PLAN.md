# Next.js Routing Conflicts Resolution Plan

This document outlines the specific steps to resolve routing conflicts between App Router (`/src/app/*`) and Pages Router (`/src/pages/*`) in the PropIE platform.

## Overview of Conflicts

We've identified the following routing conflicts:

1. **Login Routes**:
   - App Router: `/src/app/login/page.tsx`
   - Pages Router: `/src/pages/auth/login.tsx`

2. **Register Routes**:
   - App Router: `/src/app/register/page.tsx`
   - Pages Router: `/src/pages/auth/register.tsx`

3. **Properties Routes**:
   - App Router: `/src/app/properties/page.tsx`
   - Pages Router: `/src/pages/properties/[id].tsx`

These conflicts can cause unpredictable routing behavior, potentially breaking the authentication flow and property browsing functionality.

## Recommended Approach

Since the project is using Next.js 15.3.1, we recommend standardizing on the App Router architecture, which is the recommended approach for newer Next.js applications. This involves:

1. Migrating any remaining Pages Router functionality to App Router
2. Ensuring proper client/server component separation
3. Setting up appropriate redirects for backward compatibility

## Implementation Plan

### Step 1: Set Up Redirects for Backward Compatibility

First, we'll modify the `next.config.js` file to redirect requests from the old Pages Router routes to the new App Router routes:

```javascript
// next.config.js
module.exports = {
  // ... other config
  async redirects() {
    return [
      {
        source: '/auth/login',
        destination: '/login',
        permanent: true,
      },
      {
        source: '/auth/register',
        destination: '/register',
        permanent: true,
      },
      // Any other redirects needed
    ];
  },
};
```

### Step 2: Migrate Authentication Routes

#### 2.1: Login Route

1. Review the current Pages Router implementation (`/src/pages/auth/login.tsx`)
2. Ensure the App Router implementation (`/src/app/login/page.tsx`) has all required functionality
3. Update any components, context usage, and imports to work with the App Router paradigm
4. Add 'use client' directives where needed

#### 2.2: Register Route

1. Review the current Pages Router implementation (`/src/pages/auth/register.tsx`)
2. Ensure the App Router implementation (`/src/app/register/page.tsx`) has all required functionality
3. Update any components, context usage, and imports to work with the App Router paradigm
4. Add 'use client' directives where needed

### Step 3: Migrate Property Routes

1. Create a new dynamic route in the App Router for property details:
   - Create `/src/app/properties/[id]/page.tsx` to match the Pages Router's `[id].tsx` pattern
2. Move the functionality from `/src/pages/properties/[id].tsx` to the new file
3. Update imports, component structure, and data fetching patterns to work with App Router
4. Update any links or navigation that references the old routes

### Step 4: Update Navigation and Links

1. Search for all instances of `href="/auth/login"` or similar in the codebase
2. Update these to point to the new App Router paths
3. Check for programmatic navigation using `router.push()` and update those paths

### Step 5: Clean Up

1. Once migration is complete and thoroughly tested, create a git branch with all the changes
2. Test all user flows thoroughly, especially authentication and property browsing
3. If everything works correctly, consider removing the Pages Router files entirely
4. Update documentation to reflect the new routing structure

## File-by-File Migration Guide

### Auth Migration

#### Move from: `/src/pages/auth/login.tsx`
#### To: `/src/app/login/page.tsx`

```typescript
// Sample structure for the new file
'use client';

import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation'; // Note 'navigation' instead of 'router'

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
  // Redirect logic if needed
  // Note: For redirects in App Router, prefer using a useEffect

  return (
    <div className="container mx-auto py-12">
      <LoginForm />
    </div>
  );
}
```

#### Move from: `/src/pages/auth/register.tsx`
#### To: `/src/app/register/page.tsx`

Similar approach to the login page migration.

### Properties Migration

#### Move from: `/src/pages/properties/[id].tsx`
#### To: `/src/app/properties/[id]/page.tsx`

Note the change in folder structure - in App Router, dynamic segments need their own folders.

```typescript
// Sample structure for the new file
// For components that use client hooks, add 'use client'
'use client';

import { PropertyDetail } from '@/components/property/PropertyDetail';
import { useParams } from 'next/navigation';

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;
  
  return (
    <div className="container mx-auto py-8">
      <PropertyDetail propertyId={propertyId} />
    </div>
  );
}
```

## Testing Strategy

After implementing these changes, test the following user flows:

1. Authentication
   - Login with valid credentials
   - Register a new account
   - Navigate between login and register pages
   - Verify protected routes work correctly

2. Property Browsing
   - View the properties list page
   - View individual property details
   - Navigate between different properties
   - Test navigation from home page to properties

3. Browser History/Navigation
   - Verify that back/forward browser navigation works correctly
   - Test bookmarking pages and returning to them
   - Verify that deep linking to specific properties works

## Conclusion

By following this migration plan, we'll standardize on the App Router architecture, eliminating routing conflicts and setting up the application for better maintainability and future enhancements.

This approach provides a clear path to resolve the routing conflicts while minimizing disruption to the application's functionality and ensuring backward compatibility through proper redirects.