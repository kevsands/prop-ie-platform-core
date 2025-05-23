# Authentication System Guide

## Overview

The platform uses NextAuth.js for authentication with a custom credentials provider. The system has been consolidated to use a single authentication flow.

## Authentication Routes

- **Login**: `/login`
- **Register**: `/auth/register`
- **Test Page**: `/auth/test` (for quick testing)

Note: The old `/register` route now redirects to `/auth/register` for consistency.

## How to Login

### Method 1: Standard Login
1. Navigate to `/login`
2. Enter your email and password
3. Click "Sign In"

### Method 2: Quick Test Login
1. Navigate to `/auth/test`
2. Click one of the quick login buttons to test different user roles:
   - Buyer: `buyer@example.com`
   - Developer: `developer@example.com`
   - Estate Agent: `agent@example.com`
   - Solicitor: `solicitor@example.com`

All test accounts use the password: `password123`

## How to Register

1. Navigate to `/auth/register`
2. Fill in the form:
   - First Name
   - Last Name
   - Email
   - Password
   - Confirm Password
   - Account Type (from dropdown)
3. Click "Register"

## Available User Roles

- **buyer**: Home buyers and investors
- **developer**: Property developers
- **estate_agent**: Real estate agents
- **solicitor**: Legal professionals
- **admin**: System administrators

## Known Issues Fixed

1. **Fixed**: Dropdown in registration form was broken - replaced with native HTML select
2. **Fixed**: Duplicate auth flows - consolidated to single flow
3. **Fixed**: Database query issues in authentication

## Developer Notes

### Key Files
- `/src/lib/auth.ts` - NextAuth configuration
- `/src/app/auth/register/page.tsx` - Registration page
- `/src/app/login/page.tsx` - Login page
- `/src/components/navigation/MainNavigation.tsx` - Main navigation with auth links

### Database Schema
The User model uses an enum array for roles:
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  roles     Role[]   @default([buyer])
  // ... other fields
}

enum Role {
  buyer
  seller
  agent
  estate_agent
  solicitor
  developer
  admin
  investor
}
```

### Authentication Flow
1. User submits credentials
2. NextAuth validates against database
3. JWT token created with user info and roles
4. Session available throughout app via `useSession()` hook

## Testing Authentication

To verify authentication is working:

1. Start the development server
2. Navigate to `/auth/test`
3. Try logging in with different test accounts
4. Check that the session displays correctly
5. Test the logout functionality

## Troubleshooting

If you encounter issues:

1. Check the browser console for errors
2. Verify the database connection
3. Ensure all required environment variables are set
4. Check the server logs for authentication errors

## Security Notes

- Passwords are hashed using bcrypt
- Sessions use secure JWT tokens
- HTTPS should be used in production
- Environment variables must be kept secure