# Authentication Service Usage Guide

This document provides examples and best practices for using the unified authentication service in the Prop.ie AWS application.

## Introduction

The authentication service (`src/lib/auth.ts`) provides a comprehensive solution for user authentication, authorization, and session management. It integrates with AWS Cognito and provides fallbacks for reliability.

## Basic Usage

The authentication service is split into client-side and server-side functionality.

### Client-Side Authentication

Import the authentication service in your component or service:

```typescript
import { authService } from '@/lib/auth';
```

#### Login

```typescript
// Login a user
try {
  const { user, token } = await authService.login({
    email: 'user@example.com',
    password: 'password123'
  });
  
  console.log('Logged in user:', user);
  // Redirect to dashboard
} catch (error) {
  console.error('Login failed:', error);
}
```

#### Registration

```typescript
// Register a new user
try {
  const result = await authService.register({
    email: 'newuser@example.com',
    password: 'securePassword123',
    name: 'New User',
    role: 'buyer'
  });
  
  if (result.isNewUser) {
    // User needs to confirm their account
    console.log('Please check your email to confirm your account');
  } else {
    // User is automatically signed in
    console.log('Registered and logged in:', result.user);
  }
} catch (error) {
  console.error('Registration failed:', error);
}
```

#### Get Current User

```typescript
// Check if user is logged in
const user = await authService.getCurrentUser();

if (user) {
  console.log('Current user:', user);
} else {
  console.log('No user is logged in');
}
```

#### Check Authentication Status

```typescript
// Check if user is authenticated
const isAuthenticated = authService.isAuthenticated();

if (isAuthenticated) {
  console.log('User is authenticated');
} else {
  console.log('User is not authenticated');
}
```

#### Logout

```typescript
// Log out the current user
await authService.logout();
console.log('User logged out');
```

#### Permission Checking

```typescript
// Check if user has a specific permission or role
const user = await authService.getCurrentUser();
const canAccessAdmin = authService.hasPermission(user, 'admin');

if (canAccessAdmin) {
  console.log('User can access admin area');
} else {
  console.log('User does not have admin access');
}
```

### Server-Side Authentication (Next.js API Routes and Middleware)

For server-side code, import the authentication module:

```typescript
import auth from '@/lib/auth';
```

#### Verify JWT Token

```typescript
// In an API route
import { NextRequest, NextResponse } from 'next/server';
import auth from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await auth.verifyAuth(req);
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  return NextResponse.json({ 
    message: `Hello ${user.name || user.email}`,
    userId: user.id 
  });
}
```

#### Role-Based Access Control

```typescript
// In Next.js middleware
import { NextRequest } from 'next/server';
import auth from '@/lib/auth';

export async function middleware(req: NextRequest) {
  // Require admin role for admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    return auth.requireRoles(['admin'])(req);
  }
  
  // Require buyer or developer role for properties routes
  if (req.nextUrl.pathname.startsWith('/properties')) {
    return auth.requireRoles(['buyer', 'developer', 'admin'])(req);
  }
}
```

#### Get User from Cookie

```typescript
// Get user from cookie (alternative to Authorization header)
import { NextRequest, NextResponse } from 'next/server';
import auth from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await auth.getUserFromCookie(req);
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  return NextResponse.json({ user });
}
```

## React Integration

### Auth Context

The application provides an `AuthContext` that you can use in your components:

```typescript
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

function UserProfile() {
  const { user, isLoading, login, logout } = useContext(AuthContext);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return (
      <div>
        <h1>Please log in</h1>
        <button onClick={() => login({ email: 'user@example.com', password: 'password' })}>
          Log in
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <h1>Welcome, {user.name || user.email}</h1>
      <p>Role: {user.role}</p>
      <button onClick={logout}>Log out</button>
    </div>
  );
}
```

### Protected Routes

Use the authentication context to protect routes:

```typescript
'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';

export default function ProtectedPage() {
  const { user, isLoading } = useContext(AuthContext);
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && !user) {
      // Redirect to login if not authenticated
      router.push('/login');
    }
  }, [user, isLoading, router]);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div>
      <h1>Protected Content</h1>
      <p>This page is only visible to authenticated users.</p>
    </div>
  );
}
```

## Advanced Usage

### Role-Based Component Rendering

```typescript
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { authService } from '@/lib/auth';

function Dashboard() {
  const { user } = useContext(AuthContext);
  
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Only show admin panel to admin users */}
      {user && authService.hasPermission(user, 'admin') && (
        <div className="admin-panel">
          <h2>Admin Controls</h2>
          {/* Admin specific controls */}
        </div>
      )}
      
      {/* Show developer tools to developers */}
      {user && authService.hasPermission(user, 'developer') && (
        <div className="developer-tools">
          <h2>Developer Tools</h2>
          {/* Developer specific tools */}
        </div>
      )}
      
      {/* All authenticated users see this */}
      <div className="user-section">
        <h2>Your Account</h2>
        {/* User account information */}
      </div>
    </div>
  );
}
```

### Custom Hook for Authentication

Create a custom hook for easier access to authentication:

```typescript
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { authService } from '@/lib/auth';

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  // Add additional helper functions
  return {
    ...context,
    isAdmin: context.user ? authService.hasPermission(context.user, 'admin') : false,
    isDeveloper: context.user ? authService.hasPermission(context.user, 'developer') : false,
    isBuyer: context.user ? authService.hasPermission(context.user, 'buyer') : false,
    isSolicitor: context.user ? authService.hasPermission(context.user, 'solicitor') : false,
    hasRole: (role: string) => context.user ? authService.hasPermission(context.user, role) : false,
  };
}
```

Then use it in your components:

```typescript
function AdminSection() {
  const { user, isAdmin, hasRole } = useAuth();
  
  if (!user || !isAdmin) {
    return <div>Access denied: Admin access required</div>;
  }
  
  return (
    <div>
      <h1>Admin Section</h1>
      {hasRole('super-admin') && (
        <button>Delete All Data</button>
      )}
    </div>
  );
}
```

## Security Considerations

### Token Storage

The authentication service stores tokens in localStorage, which has some security implications:

- Tokens are vulnerable to XSS attacks
- Tokens persist across browser sessions

For increased security:

1. Use secure cookies for token storage
2. Implement shorter token expiration times
3. Implement a refresh token mechanism
4. Enable multi-factor authentication

### Password Requirements

When registering users, enforce strong password requirements:

```typescript
function validatePassword(password: string): boolean {
  // At least 8 characters
  if (password.length < 8) return false;
  
  // At least one uppercase letter
  if (!/[A-Z]/.test(password)) return false;
  
  // At least one lowercase letter
  if (!/[a-z]/.test(password)) return false;
  
  // At least one number
  if (!/[0-9]/.test(password)) return false;
  
  return true;
}

// In registration form
function RegistrationForm() {
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    if (!validatePassword(newPassword)) {
      setPasswordError('Password must be at least 8 characters with uppercase, lowercase, and numbers');
    } else {
      setPasswordError(null);
    }
  };
  
  // Rest of form implementation...
}
```

## Best Practices

1. **Always use the authentication service** for auth operations, not direct Amplify calls
2. **Handle authentication errors** gracefully with user-friendly messages
3. **Check permissions** before rendering sensitive components or data
4. **Include proper loading states** during authentication operations
5. **Implement proper logout** on token expiration
6. **Use the auth context** for component access to auth state