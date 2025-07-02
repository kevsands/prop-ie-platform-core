'use client';

/**
 * Production-Ready Auth Service with AWS Cognito Integration
 * Supports multi-role authentication for PROP.ie enterprise platform
 */

import { signIn, signOut, getCurrentUser, fetchAuthSession, signUp, confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { AuthUser, SignInParams, SignInResult } from "@/types/amplify/auth";
import { GraphQLContext, AuthContext, AuthResolverFunction, ResolverFunction } from "@/types/graphql";
import { GraphQLError } from 'graphql';
import { UserRole } from '@/types/core/user';
import { CognitoUserAttributes } from '@/types/auth';

/**
 * Production Authentication Service
 * Integrates with AWS Cognito for secure, scalable authentication
 */
export class Auth {
  /**
   * Sign in a user with AWS Cognito
   */
  static async signIn({ username, password }: SignInParams): Promise<SignInResult> {
    try {
      // In development mode, allow bypass for testing
      if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
        console.log('[DEV] Mock auth enabled for development');
        return {
          isSignedIn: true,
          userId: 'dev-user-id'
        };
      }

      const result = await signIn({ username, password });
      
      if (result.isSignedIn) {
        const user = await getCurrentUser();
        return {
          isSignedIn: true,
          userId: user.userId,
          user: {
            userId: user.userId,
            username: user.username,
            email: user.username, // Cognito username is typically email
            firstName: user.signInDetails?.loginId || '',
            lastName: '',
            roles: ['USER'] // Default role, will be enhanced from user attributes
          }
        };
      } else {
        return {
          isSignedIn: false,
          nextStep: result.nextStep
        };
      }
    } catch (error) {
      console.error('Authentication error:', error);
      throw new Error('Authentication failed. Please check your credentials.');
    }
  }

  /**
   * Sign up a new user
   */
  static async signUp({ username, password, email, firstName, lastName, userRole }: {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    userRole: UserRole;
  }) {
    try {
      const result = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email,
            given_name: firstName,
            family_name: lastName,
            'custom:role': userRole,
            'custom:platform': 'prop.ie'
          }
        }
      });
      return result;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  /**
   * Confirm user sign up with verification code
   */
  static async confirmSignUp(username: string, confirmationCode: string) {
    try {
      return await confirmSignUp({ username, confirmationCode });
    } catch (error) {
      console.error('Confirmation error:', error);
      throw error;
    }
  }

  /**
   * Get current authenticated user with enhanced profile
   */
  static async currentAuthenticatedUser(): Promise<AuthUser> {
    try {
      // Development mode fallback
      if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
        return {
          userId: 'dev-user-id',
          username: 'dev@prop.ie',
          email: 'dev@prop.ie',
          firstName: 'Development',
          lastName: 'User',
          roles: ['DEVELOPER', 'ADMIN'],
        };
      }

      const user = await getCurrentUser();
      const session = await fetchAuthSession();
      
      // Extract user attributes from token
      const idToken = session.tokens?.idToken;
      const userAttributes = idToken?.payload;
      
      return {
        userId: user.userId,
        username: user.username,
        email: userAttributes?.email as string || user.username,
        firstName: userAttributes?.given_name as string || '',
        lastName: userAttributes?.family_name as string || '',
        roles: this.extractUserRoles(userAttributes),
      };
    } catch (error) {
      console.error('Failed to get current user:', error);
      throw new Error('User not authenticated');
    }
  }

  /**
   * Extract user roles from Cognito token
   */
  private static extractUserRoles(userAttributes: CognitoUserAttributes): UserRole[] {
    const defaultRoles: UserRole[] = ['USER'];
    
    if (!userAttributes) return defaultRoles;
    
    // Check for custom role attribute
    const customRole = userAttributes['custom:role'];
    if (customRole && Object.values(UserRole).includes(customRole)) {
      return [customRole as UserRole];
    }
    
    // Check for Cognito groups
    const groups = userAttributes['cognito:groups'] || [];
    const validRoles = groups.filter((group: string) => 
      Object.values(UserRole).includes(group as UserRole)
    ) as UserRole[];
    
    return validRoles.length > 0 ? validRoles : defaultRoles;
  }

  /**
   * Get JWT token for API authentication
   */
  static async getJwtToken(): Promise<string> {
    try {
      // Development mode fallback
      if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
        return 'dev-jwt-token';
      }

      const session = await fetchAuthSession();
      const accessToken = session.tokens?.accessToken;
      
      if (!accessToken) {
        throw new Error('No access token available');
      }
      
      return accessToken.toString();
    } catch (error) {
      console.error('Failed to get JWT token:', error);
      throw new Error('Authentication token not available');
    }
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    try {
      // Development mode always returns true if enabled
      if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
        return true;
      }

      const session = await fetchAuthSession();
      return !!session.tokens?.accessToken;
    } catch (error) {
      console.error('Authentication check failed:', error);
      return false;
    }
  }

  /**
   * Sign out user
   */
  static async signOut(): Promise<void> {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  /**
   * Check if user has specific role
   */
  static async hasRole(requiredRole: UserRole): Promise<boolean> {
    try {
      const user = await this.currentAuthenticatedUser();
      return user.roles.includes(requiredRole);
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if user has any of the required roles
   */
  static async hasAnyRole(requiredRoles: UserRole[]): Promise<boolean> {
    try {
      const user = await this.currentAuthenticatedUser();
      return requiredRoles.some(role => user.roles.includes(role));
    } catch (error) {
      return false;
    }
  }
}

export default Auth;

// Re-export important types and utilities
export type { AuthUser, SignInParams, SignInResult } from "@/types/amplify/auth";
export { UserRole } from '@/types/core/user';

// Re-export authOptions for backward compatibility with existing API routes
export { authOptions } from './auth-options';

/**
 * Check if user has required roles (API route protection)
 */
export async function requireRoles(request: Request, requiredRoles: UserRole[]): Promise<Response | null> {
  try {
    // For development with mock auth enabled, allow all requests
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
      return null;
    }

    // Extract JWT token from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid authorization header' }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has required roles
    const hasValidRole = await Auth.hasAnyRole(requiredRoles);
    if (!hasValidRole) {
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions' }), 
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return null; // Allow request to proceed
  } catch (error) {
    console.error('Role check error:', error);
    return new Response(
      JSON.stringify({ error: 'Authentication verification failed' }), 
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Amplify Auth configuration for PROP.ie platform
 */
export const amplifyAuthConfig = {
  Cognito: {
    userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || 'us-east-1_XXXXXXXXX',
    userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || 'XXXXXXXXXXXXXXXXXXXXXXXXXX',
    identityPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID,
    loginWith: {
      oauth: {
        domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN || 'prop-ie-auth.auth.us-east-1.amazoncognito.com',
        scopes: ['email', 'openid', 'profile'],
        redirectSignIn: process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` : 'http://localhost:3000/auth/callback',
        redirectSignOut: process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/signout` : 'http://localhost:3000/auth/signout',
        responseType: 'code'
      },
      email: true,
      username: false
    }
  }
};

/**
 * Higher-order function to wrap resolver functions with authentication
 * @param resolver The resolver function to wrap
 * @param requiredRoles Optional roles required to access this resolver
 * @returns A new resolver function that checks authentication before executing
 */
export function withAuth<TArgs, TResult>(
  resolver: AuthResolverFunction<TArgs, TResult>,
  requiredRoles?: UserRole[]
): ResolverFunction<TArgs, TResult> {
  return async (parent: unknown, args: TArgs, context: GraphQLContext): Promise<TResult> => {
    // Check if user is authenticated
    if (!context.user?.id) {
      throw new GraphQLError('Unauthorized', {
        extensions: { code: 'UNAUTHORIZED' },
      });
    }

    // Check roles if specified
    if (requiredRoles && requiredRoles.length > 0) {
      const userRoles = context.user.roles || [];
      const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
      
      if (!hasRequiredRole) {
        throw new GraphQLError('Insufficient permissions', {
          extensions: { code: 'FORBIDDEN' },
        });
      }
    }

    return resolver(parent, args, context as AuthContext);
  };
}

/**
 * Middleware factory for role-based API route protection
 */
export function withRoleProtection(requiredRoles: UserRole[]) {
  return async function middleware(request: Request): Promise<Response | null> {
    return requireRoles(request, requiredRoles);
  };
}

/**
 * Hook for client-side authentication state
 */
export function useAuth() {
  // This will be implemented as a React hook for client-side auth state management
  // For now, return basic interface
  return {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    signIn: Auth.signIn,
    signOut: Auth.signOut,
    hasRole: Auth.hasRole
  };
}