'use client';

/**
 * Auth Service - Simplified Version for Build Testing
 */

// Import from centralized types
import { AuthUser, SignInParams, SignInResult } from "@/types/amplify/auth";
import { GraphQLContext, AuthContext, AuthResolverFunction, ResolverFunction } from "@/types/graphql";
import { GraphQLError } from 'graphql';

/**
 * Authentication service - simplified for build testing
 */
export class Auth {
  /**
   * Sign in a user
   */
  static async signIn({ username, password }: SignInParams): Promise<SignInResult> {
    console.log('[MOCK] signIn:', { username });

    // Simulate MFA for specific test account
    if (username === 'mfa@example.com') {
      return {
        isSignedIn: false,
        nextStep: { signInStep: 'MFA' }
      };
    }

    // Normal sign in
    return {
      isSignedIn: true,
      userId: 'mock-user-id'
    };
  }

  /**
   * Get current authenticated user
   */
  static async currentAuthenticatedUser(): Promise<AuthUser> {
    return {
      userId: 'mock-user-id',
      username: 'mockuser',
      email: 'user@example.com',
      firstName: 'Mock',
      lastName: 'User',
      roles: ['USER'],
    };
  }

  /**
   * Get JWT token
   */
  static async getJwtToken(): Promise<string> {
    return 'mock-jwt-token';
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    return true;
  }
}

export default Auth;

/**
 * Check if user has required roles
 */
export async function requireRoles(request: Request, requiredRoles: string[]): Promise<Response | null> {
  // For development, allow all requests
  if (process.env.NODE_ENV === 'development') {
    return null;
  }
  
  // In production, check roles - for now return null (allow)
  return null;
}

/**
 * NextAuth configuration options for compatibility with Next.js App Router
 */
export const authOptions = {
  providers: [],
  callbacks: {
    async session({ session }: { session: { user?: any } }) {
      return session;
    },
    async jwt({ token }) {
      return token;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || 'development-secret'
};

/**
 * Higher-order function to wrap resolver functions with authentication
 * @param resolver The resolver function to wrap
 * @returns A new resolver function that checks authentication before executing
 */
export function withAuth<TArgs, TResult>(
  resolver: AuthResolverFunction<TArgs, TResult>
): ResolverFunction<TArgs, TResult> {
  return async (parent: unknown, args: TArgs, context: GraphQLContext): Promise<TResult> => {
    if (!context.user?.id) {
      throw new GraphQLError('Unauthorized', {
        extensions: { code: 'UNAUTHORIZED' },
      });
    }
    return resolver(parent, args, context as AuthContext);
  };
}