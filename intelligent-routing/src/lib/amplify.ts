/**
 * @deprecated This file is deprecated. Please use the new modules in src/lib/amplify/ instead:
 * - For authentication: import { Auth } from '@/lib/amplify/auth'
 * - For API operations: import { API } from '@/lib/amplify/api'
 * - For storage operations: import { Storage } from '@/lib/amplify/storage'
 * - For initialization: import { initialize as initializeAmplify, initializeAsync } from '@/lib/amplify'
 */

// src/lib/amplify.ts
import { fetchUserAttributes, getCurrentUser, signOut } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import { initialize as initializeAmplify, initializeAsync } from './amplify/index';

// Display deprecation warning
console.warn(
  'Warning: The amplify.ts file is deprecated and will be removed in a future version. ' +
  'Please use the new modules in src/lib/amplify/ instead.'
);

/**
 * Centralized Amplify configuration module
 * 
 * This file provides a standardized approach to configuring Amplify
 * and exposing necessary functions and clients across the application.
 */

// Track configuration state
let isAmplifyConfigured = false;

/**
 * Configure Amplify for client-side use
 * 
 * This function should be called in client components/contexts, typically in _app.tsx
 * It ensures Amplify is only configured once, even with HMR (Hot Module Replacement)
 */
export function configureAmplify() {
  if (typeof window !== 'undefined' && !isAmplifyConfigured) {
    try {
      // Configure Amplify using the centralized initialization
      initializeAmplify();
      isAmplifyConfigured = true;
      console.log('Amplify configured successfully on the client-side.');
    } catch (error) {
      console.error('Error configuring Amplify on the client-side:', error);
    }
  }
}

/**
 * Initialize Amplify asynchronously
 * 
 * This function provides a more robust way to initialize Amplify with proper error handling
 * It ensures the application will continue to load even if Amplify initialization fails
 * 
 * @returns Promise that always resolves to true to prevent application crashes
 */
export { initializeAsync };

/**
 * Generate a GraphQL API client
 * 
 * This function creates and returns an API client for GraphQL operations
 */
export function getApiClient() {
  // Ensure Amplify is configured before generating a client
  configureAmplify();
  // Generate and return the client
  return generateClient();
}

/**
 * User interface representing authenticated user info
 */
export interface AuthUser {
  userId: string;
  username: string;
  email?: string;
  roles: string[];
  // Add other relevant attributes as needed
}

/**
 * Get the current authenticated user
 * 
 * @returns Promise that resolves to the authenticated user or null if not authenticated
 */
export async function getAuthenticatedUser(): Promise<AuthUser | null> {
  try {
    const cognitoUser = await getCurrentUser();
    const attributes = await fetchUserAttributes();
    
    // Safely parse the cognito:groups attribute
    let roles: string[] = [];
    
    // Check if the attribute exists and properly parse it
    if (attributes["cognito:groups"]) {
      // If the attribute is already an array, use it directly
      if (Array.isArray(attributes["cognito:groups"])) {
        roles = attributes["cognito:groups"] as string[];
      } 
      // If it's a string, it might be a comma-separated list or a single value
      else if (typeof attributes["cognito:groups"] === 'string') {
        const groupsStr = attributes["cognito:groups"] as string;
        // Check if it contains commas
        if (groupsStr.includes(',')) {
          roles = groupsStr.split(',').map(g => g.trim());
        } else {
          roles = [groupsStr];
        }
      }
    }
    
    // Map Cognito user data to our application's user model
    return {
      userId: cognitoUser.userId,
      username: cognitoUser.username,
      email: attributes.email,
      roles: roles,
    };
  } catch (error) {
    // User is not authenticated
    console.log('User not authenticated:', error);
    return null;
  }
}

/**
 * Sign out the current user
 * 
 * @returns Promise that resolves when sign out is complete
 */
export async function signOutUser(): Promise<void> {
  try {
    await signOut();
    console.log('User signed out successfully');
  } catch (error) {
    console.error('Error signing out user:', error);
    throw error;
  }
}

/**
 * Default export of the entire module
 */
export default {
  configureAmplify,
  getApiClient,
  getAuthenticatedUser,
  signOutUser,
  initializeAsync
};