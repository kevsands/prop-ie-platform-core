/**
 * Authentication Service for Prop.ie platform
 * Enhanced authentication flow using AWS Amplify for auth and fallback to API for additional user data
 */

import { fetchUserAttributes, getCurrentUser, signIn, signOut, signUp } from 'aws-amplify/auth';
import { configureAmplify } from '../amplify-client';
import { api } from "../api-client";
import type { SignInOutput } from 'aws-amplify/auth';

/**
 * User type definition
 */
export type User = {
  id: string;
  email?: string;
  username?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role: "buyer" | "solicitor" | "developer" | "admin";
};

/**
 * Login credentials type
 */
export type LoginCredentials = {
  email: string;
  password: string;
};

/**
 * Registration data type
 */
export type RegisterData = {
  email: string;
  password: string;
  name: string;
  role: "buyer" | "solicitor" | "developer";
};

/**
 * Authentication response type
 */
export type AuthResponse = {
  user: User;
  token: string;
};

/**
 * Enhanced authentication service with AWS Amplify integration
 * Provides methods for login, registration, and user management
 */
export const authService = {
  /**
   * Initialize Amplify configuration
   */
  init: () => {
    configureAmplify();
  },

  /**
   * Log in a user with email and password using Amplify
   * Falls back to API-based auth if needed
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      // Ensure Amplify is configured
      configureAmplify();

      // Use Amplify for primary authentication
      const signInResult = await signIn({
        username: credentials.email,
        password: credentials.password
      });

      if (signInResult.isSignedIn) {
        // Get user attributes from Cognito
        const cognitoUser = await getCurrentUser();
        const attributes = await fetchUserAttributes();

        // Construct user object
        const user: User = {
          id: cognitoUser.userId,
          email: attributes.email,
          username: cognitoUser.username,
          name: attributes.name || cognitoUser.username,
          firstName: attributes.given_name,
          lastName: attributes.family_name,
          role: (attributes['custom:role'] as "buyer" | "solicitor" | "developer" | "admin") || 'buyer'
        };

        // Get and store the token
        // NOTE: Tokens are managed by Amplify, we're using an identifier here
        const token = cognitoUser.userId;
        authService.setToken(token);

        return { user, token };
      } else {
        throw new Error('Sign in failed');
      }
    } catch (amplifyError) {
      console.error('Amplify auth error:', amplifyError);

      // Fall back to API-based auth as backup
      try {
        const response = await api.post<AuthResponse>("/auth/login", credentials, { requiresAuth: false });

        if (response && response.token) {
          authService.setToken(response.token);
        }

        return response;
      } catch (apiError) {
        console.error('API auth error:', apiError);
        throw new Error('Authentication failed');
      }
    }
  },

  /**
   * Register a new user
   * Uses Amplify for registration with fallback to API
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      // Ensure Amplify is configured
      configureAmplify();

      // Use Amplify for registration
      const signUpResult = await signUp({
        username: data.email,
        password: data.password,
        options: {
          userAttributes: {
            email: data.email,
            name: data.name,
            'custom:role': data.role
          },
          autoSignIn: true
        }
      });

      if (signUpResult) {
        // Auto sign-in is enabled, verify user is signed in
        const currentUser = await getCurrentUser().catch(() => null);

        if (currentUser) {
          const attributes = await fetchUserAttributes();

          // Construct user object
          const user: User = {
            id: currentUser.userId,
            email: attributes.email,
            username: currentUser.username,
            name: attributes.name || data.name,
            firstName: attributes.given_name,
            lastName: attributes.family_name,
            role: data.role
          };

          // Create a token
          const token = currentUser.userId;
          authService.setToken(token);

          return { user, token };
        } else {
          throw new Error('Registration successful but auto sign-in failed');
        }
      } else {
        throw new Error('Registration failed');
      }
    } catch (amplifyError) {
      console.error('Amplify registration error:', amplifyError);

      // Fall back to API-based registration
      try {
        const response = await api.post<AuthResponse>("/auth/register", data, { requiresAuth: false });

        if (response && response.token) {
          authService.setToken(response.token);
        }

        return response;
      } catch (apiError) {
        console.error('API registration error:', apiError);
        throw new Error('Registration failed');
      }
    }
  },

  /**
   * Get the current logged-in user
   * First tries Amplify, then falls back to API
   */
  getCurrentUser: async (): Promise<User | null> => {
    try {
      // Ensure Amplify is configured
      configureAmplify();

      // Try to get current user from Amplify
      const cognitoUser = await getCurrentUser();
      const attributes = await fetchUserAttributes();

      // Return user from Amplify
      return {
        id: cognitoUser.userId,
        email: attributes.email,
        username: cognitoUser.username,
        name: attributes.name || cognitoUser.username,
        firstName: attributes.given_name,
        lastName: attributes.family_name,
        role: (attributes['custom:role'] as "buyer" | "solicitor" | "developer" | "admin") || 'buyer'
      };
    } catch (amplifyError) {
      // Fall back to API if token exists
      if (authService.isAuthenticated()) {
        try {
          const user = await api.get<User>("/auth/user");
          return user;
        } catch (apiError) {
          console.error('API get current user error:', apiError);
          return null;
        }
      }
      return null;
    }
  },

  /**
   * Log out the current user
   * Handles both Amplify and local storage cleanup
   */
  logout: async (): Promise<void> => {
    try {
      // Ensure Amplify is configured
      configureAmplify();

      // Sign out from Amplify
      await signOut();
    } catch (error) {
      console.error('Error signing out from Amplify:', error);
    } finally {
      // Always clean up local storage
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
      }
    }
  },

  /**
   * Store authentication token in local storage
   */
  setToken: (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  },

  /**
   * Get authentication token from local storage
   */
  getToken: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token");
    }
    return null;
  },

  /**
   * Check if user is authenticated
   * This is a simplified check that can be enhanced
   */
  isAuthenticated: (): boolean => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("auth_token");
    }
    return false;
  },
};

export default authService;