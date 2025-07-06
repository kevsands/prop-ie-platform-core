# AWS Integration Improvement Plan

This document provides a structured plan for improving the AWS integration in the PropIE property development platform.

## Problem Statement

The current AWS integration has several issues:

1. **Duplicate code and configurations** - Multiple files handle Amplify configuration with overlapping functionality
2. **Inconsistent error handling** - Different approaches to error management across files
3. **Type safety concerns** - Some functions lack proper TypeScript type annotations
4. **Authentication flow gaps** - Incomplete implementation of authentication methods
5. **Security issues** - API keys exposed in source code
6. **No unified data fetching strategy** - Inconsistent approaches to data fetching and caching

## Implementation Plan

### Phase 1: Consolidation and Security (1-2 weeks)

#### 1.1 Create a Unified Amplify Structure

Create a new directory structure:

```
src/lib/amplify/
  ├── index.ts         # Main entry point and initialization
  ├── config.ts        # Configuration using environment variables
  ├── auth.ts          # Authentication service
  ├── api.ts           # API client service
  ├── storage.ts       # Storage service
  └── types.ts         # Shared types
```

#### 1.2 Move Sensitive Configuration to Environment Variables

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_AWS_USER_POOLS_ID=us-east-1_XXXXXXXXX
NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID=us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NEXT_PUBLIC_APPSYNC_GRAPHQL_ENDPOINT=https://xxxxxxxxxxxxxxxxxxxxxxxxxx.appsync-api.us-east-1.amazonaws.com/graphql
NEXT_PUBLIC_APPSYNC_API_KEY=da2-xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_S3_BUCKET=propieawsapp-storage-xxxxxxxx-dev
```

Update `next.config.js` to ensure environment variables are properly handled:

```js
module.exports = {
  env: {
    NEXT_PUBLIC_AWS_REGION: process.env.NEXT_PUBLIC_AWS_REGION,
    NEXT_PUBLIC_AWS_USER_POOLS_ID: process.env.NEXT_PUBLIC_AWS_USER_POOLS_ID,
    NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID: process.env.NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID,
    NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID: process.env.NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID,
    NEXT_PUBLIC_APPSYNC_GRAPHQL_ENDPOINT: process.env.NEXT_PUBLIC_APPSYNC_GRAPHQL_ENDPOINT,
    NEXT_PUBLIC_S3_BUCKET: process.env.NEXT_PUBLIC_S3_BUCKET,
  },
};
```

#### 1.3 Implement Core Amplify Configuration

Create `src/lib/amplify/config.ts`:

```typescript
const config = {
  Auth: {
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOLS_ID,
    userPoolWebClientId: process.env.NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID,
    identityPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID,
  },
  API: {
    GraphQL: {
      endpoint: process.env.NEXT_PUBLIC_APPSYNC_GRAPHQL_ENDPOINT,
      region: process.env.NEXT_PUBLIC_AWS_REGION,
      defaultAuthMode: 'apiKey',
      apiKey: process.env.NEXT_PUBLIC_APPSYNC_API_KEY,
    },
  },
  Storage: {
    S3: {
      bucket: process.env.NEXT_PUBLIC_S3_BUCKET,
      region: process.env.NEXT_PUBLIC_AWS_REGION,
    },
  },
};

export default config;
```

Create `src/lib/amplify/index.ts`:

```typescript
import { Amplify } from 'aws-amplify';
import config from './config';

// Export sub-modules
import { Auth } from './auth';
import { API } from './api';
import { Storage } from './storage';

let isInitialized = false;

function initialize() {
  if (typeof window !== 'undefined' && !isInitialized) {
    try {
      Amplify.configure(config, { ssr: true });
      isInitialized = true;
      console.log('Amplify initialized successfully');
    } catch (error) {
      console.error('Error initializing Amplify:', error);
      throw error;
    }
  }
}

// Initialize on import
initialize();

export { initialize, Auth, API, Storage };
```

### Phase 2: Authentication Enhancement (1 week)

#### 2.1 Complete Authentication Module

Create a comprehensive `src/lib/amplify/auth.ts`:

```typescript
import {
  signIn, signUp, signOut, confirmSignUp,
  resetPassword, confirmResetPassword,
  getCurrentUser, fetchUserAttributes
} from 'aws-amplify/auth';
import { initialize } from './index';

export interface AuthUser {
  userId: string;
  username: string;
  email?: string;
  roles: string[];
  firstName?: string;
  lastName?: string;
}

export interface SignInParams {
  username: string;
  password: string;
}

export interface SignUpParams {
  username: string;
  password: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export class Auth {
  static async signIn({ username, password }: SignInParams) {
    initialize();
    try {
      const result = await signIn({ username, password });
      return result;
    } catch (error) {
      this.handleAuthError(error, 'signIn');
      throw error;
    }
  }

  static async signUp({ username, password, email, firstName, lastName, phoneNumber }: SignUpParams) {
    initialize();
    try {
      const attributes: Record<string, string> = { email };
      if (firstName) attributes.given_name = firstName;
      if (lastName) attributes.family_name = lastName;
      if (phoneNumber) attributes.phone_number = phoneNumber;

      const result = await signUp({
        username,
        password,
        options: {
          userAttributes: attributes,
          autoSignIn: true,
        },
      });
      return result;
    } catch (error) {
      this.handleAuthError(error, 'signUp');
      throw error;
    }
  }

  static async confirmSignUp(username: string, confirmationCode: string) {
    initialize();
    try {
      return await confirmSignUp({ username, confirmationCode });
    } catch (error) {
      this.handleAuthError(error, 'confirmSignUp');
      throw error;
    }
  }

  static async signOut() {
    initialize();
    try {
      await signOut();
    } catch (error) {
      this.handleAuthError(error, 'signOut');
      throw error;
    }
  }

  static async resetPassword(username: string) {
    initialize();
    try {
      return await resetPassword({ username });
    } catch (error) {
      this.handleAuthError(error, 'resetPassword');
      throw error;
    }
  }

  static async confirmResetPassword(
    username: string,
    confirmationCode: string,
    newPassword: string
  ) {
    initialize();
    try {
      return await confirmResetPassword({
        username,
        confirmationCode,
        newPassword,
      });
    } catch (error) {
      this.handleAuthError(error, 'confirmResetPassword');
      throw error;
    }
  }

  static async getCurrentUser(): Promise<AuthUser | null> {
    initialize();
    try {
      const user = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      
      // Parse roles from cognito:groups
      let roles: string[] = [];
      if (attributes["cognito:groups"]) {
        if (Array.isArray(attributes["cognito:groups"])) {
          roles = attributes["cognito:groups"];
        } else if (typeof attributes["cognito:groups"] === 'string') {
          const groupsStr = attributes["cognito:groups"] as string;
          roles = groupsStr.includes(',')
            ? groupsStr.split(',').map(g => g.trim())
            : [groupsStr];
        }
      }
      
      return {
        userId: user.userId,
        username: user.username,
        email: attributes.email,
        firstName: attributes.given_name,
        lastName: attributes.family_name,
        roles,
      };
    } catch (error) {
      // User is not authenticated
      return null;
    }
  }

  private static handleAuthError(error: any, operation: string) {
    console.error(`Auth error during ${operation}:`, error);
    
    // Additional error handling logic can be added here
    // For example, reporting to an error tracking service
  }
}
```

#### 2.2 Update Auth Context

Update `src/context/AuthContext.tsx` to use the new Auth module:

```typescript
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Auth, AuthUser } from '@/lib/amplify/auth';

// User interface for the context
export interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  name?: string;
  role?: string;
}

// Complete AuthContextType
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: Error | string | null;
  signIn: (username: string, password: string) => Promise<any>;
  signUp: (username: string, password: string, attributes: Record<string, string>) => Promise<any>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>; // Alias for signOut
  resetPassword: (username: string) => Promise<any>;
  confirmResetPassword: (username: string, code: string, newPassword: string) => Promise<any>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  signIn: async () => null,
  signUp: async () => null,
  signOut: async () => {},
  logout: async () => {},
  resetPassword: async () => null,
  confirmResetPassword: async () => null,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | string | null>(null);

  // Check for current authenticated user
  useEffect(() => {
    const checkUser = async () => {
      try {
        const authUser = await Auth.getCurrentUser();
        
        if (authUser) {
          // Map AuthUser to our application's User model
          const userData: User = {
            id: authUser.userId,
            username: authUser.username,
            email: authUser.email,
            firstName: authUser.firstName,
            lastName: authUser.lastName,
            name: authUser.firstName 
              ? `${authUser.firstName} ${authUser.lastName || ''}`.trim()
              : authUser.username,
            role: authUser.roles && authUser.roles.length > 0 ? authUser.roles[0] : 'buyer',
          };
          
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        setUser(null);
        setIsAuthenticated(false);
        setError(err instanceof Error ? err : String(err));
        console.error("Error checking authentication:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  // Sign in method
  const signIn = async (username: string, password: string) => {
    try {
      setError(null);
      const signInResponse = await Auth.signIn({ username, password });
      
      if (signInResponse.isSignedIn) {
        // Refresh the user data after login
        const authUser = await Auth.getCurrentUser();
        
        if (authUser) {
          const userData: User = {
            id: authUser.userId,
            username: authUser.username,
            email: authUser.email,
            firstName: authUser.firstName,
            lastName: authUser.lastName,
            name: authUser.firstName 
              ? `${authUser.firstName} ${authUser.lastName || ''}`.trim()
              : authUser.username,
            role: authUser.roles && authUser.roles.length > 0 ? authUser.roles[0] : 'buyer',
          };
          
          setUser(userData);
          setIsAuthenticated(true);
          return userData;
        }
      }
      
      return signInResponse;
    } catch (err) {
      setError(err instanceof Error ? err : String(err));
      console.error('Error signing in:', err);
      throw err;
    }
  };

  // Sign up method
  const signUp = async (username: string, password: string, attributes: Record<string, string>) => {
    try {
      setError(null);
      return await Auth.signUp({
        username,
        password,
        email: attributes.email,
        firstName: attributes.given_name,
        lastName: attributes.family_name,
        phoneNumber: attributes.phone_number,
      });
    } catch (err) {
      setError(err instanceof Error ? err : String(err));
      console.error('Error signing up:', err);
      throw err;
    }
  };

  // Sign out method
  const signOut = async () => {
    try {
      setError(null);
      await Auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      setError(err instanceof Error ? err : String(err));
      console.error('Error signing out:', err);
      throw err;
    }
  };

  // Reset password
  const resetPassword = async (username: string) => {
    try {
      setError(null);
      return await Auth.resetPassword(username);
    } catch (err) {
      setError(err instanceof Error ? err : String(err));
      console.error('Error resetting password:', err);
      throw err;
    }
  };

  // Confirm reset password
  const confirmResetPassword = async (username: string, code: string, newPassword: string) => {
    try {
      setError(null);
      return await Auth.confirmResetPassword(username, code, newPassword);
    } catch (err) {
      setError(err instanceof Error ? err : String(err));
      console.error('Error confirming password reset:', err);
      throw err;
    }
  };

  // Context value
  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    logout: signOut, // Alias for backward compatibility
    resetPassword,
    confirmResetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Phase 3: API and Data Fetching Enhancement (1-2 weeks)

#### 3.1 Implement Enhanced API Module

Create `src/lib/amplify/api.ts`:

```typescript
import { generateClient } from 'aws-amplify/api';
import { initialize } from './index';

interface GraphQLOptions {
  query: string;
  variables?: Record<string, any>;
  operationName?: string | null;
  authMode?: 'apiKey' | 'userPool' | 'iam';
}

export class API {
  private static client: ReturnType<typeof generateClient> | null = null;

  static getClient() {
    initialize();
    if (!this.client) {
      this.client = generateClient();
    }
    return this.client;
  }

  static async graphql<T>({ query, variables = {}, operationName = null, authMode }: GraphQLOptions): Promise<T> {
    const client = this.getClient();
    const operationLabel = operationName || query.split('{')[0].trim();
    
    console.log(`Executing GraphQL operation: ${operationLabel}...`);
    
    try {
      const response = await client.graphql({
        query,
        variables,
        authMode,
      });
      
      if (response.errors) {
        const errorMessage = response.errors[0].message;
        console.error("GraphQL Errors:", JSON.stringify(response.errors, null, 2));
        throw new Error(`GraphQL operation failed: ${errorMessage}`);
      }
      
      if (!response.data) {
        throw new Error("GraphQL response missing data");
      }
      
      return response.data as T;
    } catch (error) {
      console.error(`GraphQL operation '${operationLabel}' failed:`, error);
      
      // Check for specific error types and handle accordingly
      if (error.message?.includes('Network error')) {
        throw new Error(`Network error while executing ${operationLabel}. Please check your connection.`);
      }
      
      // Handle authentication errors
      if (error.message?.includes('not authorized') || error.statusCode === 401) {
        throw new Error(`Authentication error: You are not authorized to perform this operation.`);
      }
      
      throw error;
    }
  }

  // Utility method for REST API calls
  static async rest<T>(path: string, options: RequestInit = {}): Promise<T> {
    initialize();
    const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT || '';
    
    if (!baseUrl) {
      throw new Error('API endpoint not configured');
    }
    
    const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error(`REST API call to ${path} failed:`, error);
      throw error;
    }
  }
}
```

#### 3.2 Integrate React Query

Install React Query if not already installed:

```bash
npm install @tanstack/react-query
# or with yarn
yarn add @tanstack/react-query
```

Create a custom hook for GraphQL queries:

```typescript
// src/hooks/useGraphQL.ts
import { useQuery, useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import { API } from '@/lib/amplify/api';

export function useGraphQLQuery<TData>(
  queryKey: QueryKey,
  query: string,
  variables = {},
  options = {}
) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      return await API.graphql<TData>({ query, variables });
    },
    ...options,
  });
}

export function useGraphQLMutation<TData, TVariables>(
  mutationKey: QueryKey,
  mutation: string,
  options = {}
) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey,
    mutationFn: async (variables: TVariables) => {
      return await API.graphql<TData>({ query: mutation, variables });
    },
    ...options,
  });
}
```

#### 3.3 Create Service Modules

Create domain-specific service modules that use the API module:

```typescript
// src/services/DevelopmentService.ts
import { API } from '@/lib/amplify/api';
import { Development, ListDevelopmentsResponse, GetDevelopmentResponse } from '@/types';

export class DevelopmentService {
  static async getFeaturedDevelopments(limit: number = 4): Promise<Development[]> {
    const query = `
      query ListFeaturedDevelopments($limit: Int) {
        listDevelopments(limit: $limit, sortDirection: DESC, sortField: "createdAt") {
          items {
            id name description location image status statusColor createdAt updatedAt
          }
        }
      }
    `;
    
    try {
      const responseData = await API.graphql<ListDevelopmentsResponse>({ 
        query, 
        variables: { limit },
        operationName: 'ListFeaturedDevelopments'
      });
      return responseData.listDevelopments?.items || [];
    } catch (error) {
      console.error("Error fetching featured developments:", error);
      return [];
    }
  }
  
  // Add other methods...
}
```

### Phase 4: Storage Service and Cleanup (1 week)

#### 4.1 Implement Storage Module

Create `src/lib/amplify/storage.ts`:

```typescript
import { uploadData, getUrl, remove, list } from 'aws-amplify/storage';
import { initialize } from './index';

export interface UploadOptions {
  path?: string;
  contentType?: string;
  metadata?: Record<string, string>;
  level?: 'public' | 'protected' | 'private';
  onProgress?: (progress: { loaded: number; total: number }) => void;
}

export class Storage {
  static async upload(file: File, key: string, options: UploadOptions = {}) {
    initialize();
    try {
      const { path = '', level = 'public', contentType, metadata, onProgress } = options;
      const fullKey = path ? `${path}/${key}` : key;
      
      const result = await uploadData({
        key: fullKey,
        data: file,
        options: {
          contentType: contentType || file.type,
          metadata,
          level,
          onProgress,
        },
      });
      
      return result;
    } catch (error) {
      console.error(`Error uploading file ${key}:`, error);
      throw error;
    }
  }

  static async getUrl(key: string, options: { level?: 'public' | 'protected' | 'private' } = {}) {
    initialize();
    try {
      const { level = 'public' } = options;
      const result = await getUrl({
        key,
        options: {
          accessLevel: level,
          validateObjectExistence: true,
        },
      });
      return result.url.toString();
    } catch (error) {
      console.error(`Error getting URL for ${key}:`, error);
      throw error;
    }
  }

  static async remove(key: string, options: { level?: 'public' | 'protected' | 'private' } = {}) {
    initialize();
    try {
      const { level = 'public' } = options;
      await remove({
        key,
        options: {
          accessLevel: level,
        },
      });
    } catch (error) {
      console.error(`Error removing file ${key}:`, error);
      throw error;
    }
  }

  static async list(path: string, options: { level?: 'public' | 'protected' | 'private' } = {}) {
    initialize();
    try {
      const { level = 'public' } = options;
      const result = await list({
        path,
        options: {
          accessLevel: level,
        },
      });
      return result;
    } catch (error) {
      console.error(`Error listing files in ${path}:`, error);
      throw error;
    }
  }
}
```

#### 4.2 Integration Testing

Create integration tests for each module:

```typescript
// src/lib/amplify/__tests__/auth.test.ts
import { Auth } from '../auth';

describe('Auth Module', () => {
  test('getCurrentUser returns null when not authenticated', async () => {
    // Mock the underlying Amplify getCurrentUser to throw an error
    jest.spyOn(require('aws-amplify/auth'), 'getCurrentUser').mockRejectedValue(new Error('No current user'));
    
    const user = await Auth.getCurrentUser();
    expect(user).toBeNull();
  });
  
  // Add more tests...
});
```

#### 4.3 Code Cleanup

1. Remove or deprecate old Amplify files:
   - `src/lib/amplify.ts`
   - `src/lib/amplify-client.ts`
   - `src/lib/amplify-data.ts`

2. Update imports in all files to use the new modules.

3. Add deprecation warnings to old files to guide developers to the new modules.

### Phase 5: Documentation and Best Practices (1 week)

#### 5.1 Create AWS Integration Documentation

Create a comprehensive documentation file at `/docs/AWS_INTEGRATION.md`:

```markdown
# AWS Integration Guide

This document outlines how AWS services are integrated into the PropIE application.

## Overview

The application uses AWS Amplify to interact with various AWS services:

- **Authentication**: AWS Cognito for user authentication and authorization
- **API**: AWS AppSync for GraphQL APIs
- **Storage**: Amazon S3 for file storage
- **Analytics**: Amazon Pinpoint for analytics (if applicable)

## Architecture

The AWS integration follows a modular approach:

- **src/lib/amplify/index.ts**: Central entry point and initialization
- **src/lib/amplify/auth.ts**: Authentication service
- **src/lib/amplify/api.ts**: API client service
- **src/lib/amplify/storage.ts**: Storage service

## Authentication Flow

The authentication flow uses AWS Cognito:

1. User signs in with username/password via `Auth.signIn()`
2. Credentials are verified against Cognito User Pool
3. Upon successful authentication, tokens are stored securely
4. User attributes and roles are retrieved from Cognito
5. The application maintains auth state via the AuthContext

## API Integration

The application uses GraphQL APIs through AWS AppSync:

1. GraphQL queries are defined in domain-specific service modules
2. The API client handles authentication, error handling, and retries
3. React Query is used for data fetching, caching, and state management

## Storage Integration

Files are stored in Amazon S3:

1. Files are uploaded via the Storage.upload() method
2. Access levels (public, protected, private) control file visibility
3. Signed URLs are generated for accessing files

## Environment Configuration

All AWS configurations are stored in environment variables:

- NEXT_PUBLIC_AWS_REGION
- NEXT_PUBLIC_AWS_USER_POOLS_ID
- NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID
- NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID
- NEXT_PUBLIC_APPSYNC_GRAPHQL_ENDPOINT
- NEXT_PUBLIC_APPSYNC_API_KEY
- NEXT_PUBLIC_S3_BUCKET

## Best Practices

1. Never hardcode AWS credentials or API keys in the code
2. Always use the centralized modules for AWS interactions
3. Implement proper error handling for all AWS operations
4. Use React Query for efficient data fetching and caching
5. Keep authentication state in the AuthContext
6. Always validate user input before sending to AWS services
```

#### 5.2 Update Component Examples

Update key components to demonstrate best practices:

```tsx
// src/components/auth/LoginForm.tsx (updated)
'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const LoginForm: React.FC = () => {
  const router = useRouter();
  const { signIn, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      await signIn(formData.email, formData.password);
      router.push("/buyer/dashboard");
    } catch (err: any) {
      // Handle common auth errors with user-friendly messages
      if (err.message?.includes('not confirmed')) {
        setError("Your account is not confirmed. Please check your email for a verification link.");
      } else if (err.message?.includes('incorrect username or password')) {
        setError("Incorrect email or password. Please try again.");
      } else if (err.message?.includes('Network error')) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(err.message || "Failed to sign in. Please check your credentials.");
      }
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      {/* Rest of the component... */}
    </div>
  );
};

export default LoginForm;
```

## Timeline and Milestones

1. **Week 1**: Phase 1 - Consolidation and Security
   - Milestone: New directory structure created, sensitive info moved to environment variables

2. **Week 2**: Phase 2 - Authentication Enhancement
   - Milestone: Complete authentication module with all methods implemented and tested

3. **Week 3-4**: Phase 3 - API and Data Fetching Enhancement
   - Milestone: Enhanced API module with React Query integration

4. **Week 5**: Phase 4 - Storage Service and Cleanup
   - Milestone: Storage module implemented, old code deprecated

5. **Week 6**: Phase 5 - Documentation and Best Practices
   - Milestone: Complete documentation and example components

## Conclusion

This implementation plan provides a structured approach to improving the AWS integration in the PropIE platform. By following this plan, the application will have:

1. A more organized and maintainable AWS integration
2. Better security practices with environment variables
3. Enhanced authentication flow with proper error handling
4. Efficient data fetching with React Query
5. Comprehensive documentation for future development

The improvements will result in a more robust, secure, and maintainable application that follows AWS best practices.