# Developer Portal Access Guide

## Current Issue
The authentication system has two separate implementations that aren't fully integrated:
1. **AuthContext** - Mock authentication used by the login page
2. **NextAuth** - Production authentication checked by middleware

The middleware is protecting the `/developer` route and redirecting unauthenticated users.

## Quick Solution (Temporary)

I've temporarily disabled the middleware. You can now access the developer portal directly:

1. Go to [http://localhost:3000/dev-login](http://localhost:3000/dev-login)
2. Click "Login as Developer"
3. You'll be redirected to the developer portal at `/developer`

## Alternative Access Methods

### Method 1: Direct URL (if middleware is disabled)
```
http://localhost:3000/developer
```

### Method 2: Development Login
```
http://localhost:3000/dev-login
```
- Click "Login as Developer"
- Sets both AuthContext and a mock cookie

### Method 3: Debug Page
```
http://localhost:3000/debug/auth
```
- Shows current authentication status
- Provides direct link to developer portal

## The Developer Portal

Once you access `/developer`, you should see:
- Developer Dashboard with KPIs
- Active Projects list
- Quick Actions for managing projects
- Sidebar navigation for different sections

## Important Files

- `/src/app/developer/page.tsx` - Main developer dashboard
- `/src/app/developer/layout.tsx` - Developer portal layout
- `/src/context/AuthContext.tsx` - Mock authentication context
- `/src/middleware.ts` - Route protection (currently disabled)

## Permanent Solution

To properly integrate the authentication systems:

1. Update the login page to use NextAuth
2. Configure NextAuth to work with the existing user roles
3. Update all components to use NextAuth session
4. Re-enable middleware with proper role checks

## Test Accounts

All test accounts use any password:
- `developer@example.com` - Developer role
- `buyer@example.com` - Buyer role
- `agent@example.com` - Agent role
- `solicitor@example.com` - Solicitor role

## Current Status

- Middleware temporarily disabled (renamed to `middleware.ts.bak`)
- Multiple login pages available for testing
- Developer portal accessible at `/developer`
- Mock authentication working via AuthContext