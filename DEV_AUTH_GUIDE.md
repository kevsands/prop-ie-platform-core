# Development Authentication Guide

This guide explains the development authentication system that's been implemented in this project to bypass AWS Amplify authentication for local development and testing.

## Overview

The development authentication system includes:

1. `DevAuthContext.tsx` - A development-only auth context provider
2. Modified API routes for login and registration
3. Integration with existing login/register forms
4. Simplified context providers and security monitoring

## How to Use

### Starting the App

1. Run the development server with:
   ```
   ./dev-start.sh
   ```
   Or manually with:
   ```
   npm run dev
   ```

2. Open your browser to http://localhost:3000

### Automatic Authentication

The development system provides automatic authentication with admin privileges. You should be automatically logged in when you visit the site.

### Manual Login

If you want to test the login flow manually:

1. Go to http://localhost:3000/login
2. Enter any email and password
   - For admin access: use an email containing "admin" (e.g., admin@example.com)
   - For developer access: use an email containing "developer" (e.g., developer@example.com)
   - For solicitor access: use an email containing "solicitor" (e.g., solicitor@example.com)
   - For agent access: use an email containing "agent" (e.g., agent@example.com)
   - Default role: any other email will be given a "buyer" role

### Testing Registration

To test the registration process:

1. Go to http://localhost:3000/register
2. Complete the registration form
3. Any valid form submission will succeed and redirect to the login page

### Testing Different User Roles

To test different user roles, log out and log back in with one of these example emails:

- Admin: `admin@example.com`
- Developer: `developer@example.com`
- Solicitor: `solicitor@example.com`
- Agent: `agent@example.com`
- Buyer: `buyer@example.com`

The password can be anything (as long as it's 8+ characters).

## Technical Details

### Development Auth Context

Located at: `/src/context/DevAuthContext.tsx`

This provides a React context that:
- Auto-authenticates on page load with admin privileges
- Implements signIn, signUp, and signOut functions that work without AWS
- Maintains auth state across the application

### API Routes

Development versions of:
- Login: `/src/app/api/auth/login/route.ts`
- Registration: `/src/app/api/auth/register/route.ts`

These routes accept any valid credentials and return success responses.

### Integration

The development auth is activated via:
- `ClientProviders.tsx` - Using DevAuthContext instead of the real AuthContext

### Simplified Components

We've also simplified several components to avoid Amplify dependencies:

- `HTBContext.tsx` - Help-to-buy context simplified for development
- `ClientSecurityProvider.tsx` - Security monitoring context simplified
- `useClientSecurity.ts` - Security monitoring hook simplified
- `InvestorModeContext.tsx` - Investor mode context simplified

## Troubleshooting

### Common Issues and Solutions

1. **React Version Issues**:
   ```
   Invalid hook call. Hooks can only be called inside of the body of a function component.
   ```
   or
   ```
   TypeError: Cannot read properties of null (reading 'use')
   ```
   Solution: The app requires React 18.x, but you might have React 19.x installed. Run:
   ```
   npm install react@18.2.0 react-dom@18.2.0 --legacy-peer-deps
   ```
   The `./dev-start.sh` script will do this automatically.

2. **React Query Import Errors**:
   ```
   Module not found: Package path ./build/modern is not exported from package @tanstack/react-query
   ```
   Solution: Run `npm install @tanstack/react-query @tanstack/react-query-devtools --legacy-peer-deps`
   The `./dev-start.sh` script will do this automatically.

3. **ParseWithSchema Error**:
   ```
   ReferenceError: parseWithSchema is not defined
   ```
   Solution: We've fixed this by renaming the function correctly in `safeJsonParser.ts`.

4. **Amplify Configuration Errors**:
   Solution: We've removed the Amplify configuration in `ClientLayout.tsx` for development mode.

5. **"Window is not defined" errors**:
   Solution: We've simplified security monitoring to avoid accessing the `window` object directly.

6. **"Cannot find module '@aws-amplify/.*'"**:
   Solution: We've implemented a development authentication system that doesn't rely on AWS Amplify.

### Running with the dev-start.sh Script

For the easiest setup, use the included script:

```bash
chmod +x dev-start.sh
./dev-start.sh
```

This script will:
1. Install React 18.2.0 (required by the app's dependencies)
2. Install necessary React Query dependencies
3. Start the development server
4. Display helpful information about login credentials

## Important Notes

1. **DO NOT USE IN PRODUCTION**: This system is for development only
2. All authentication is simulated and no real security checks occur
3. No real AWS Cognito accounts are created during registration
4. Security features are minimized for easier development

## Reverting to Real Authentication

To go back to using the real AWS Amplify authentication:

1. Update the import in `src/components/ClientProviders.tsx`:
   ```typescript
   // Replace:
   import { AuthProvider } from "@/context/DevAuthContext";
   
   // With:
   import { AuthProvider } from "@/context/AuthContext";
   ```

2. Restore the original API routes for login and registration
3. Restore the original HTBContext, security components, and other context providers