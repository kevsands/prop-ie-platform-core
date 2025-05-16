/**
 * @deprecated This file is deprecated and will be removed in a future version. 
 * Please use the new modular imports from the appropriate files:
 * 
 * - For authentication: import { Auth } from '@/lib/amplify/auth'
 * - For API operations: import { API } from '@/lib/amplify/api'
 * - For storage operations: import { Storage } from '@/lib/amplify/storage'
 * - For general Amplify configuration: import { initialize } from '@/lib/amplify'
 * 
 * If you're updating a server component, use the server-safe versions:
 * - import { ServerAmplify } from '@/lib/amplify/server'
 */

// Re-export from new modules for backwards compatibility
import { ensureAmplifyInitialized } from './amplify/index';
import { Auth, AuthUser, SignInResult } from './amplify/auth';
import { API } from './amplify/api';
import { Storage } from './amplify/storage';

// Display deprecation warning
console.warn(
  'Warning: The amplify-client.ts file is deprecated and will be removed in a future version. ' +
  'Please use the new modules in src/lib/amplify/ instead.'
);

/**
 * Centralized Amplify configuration module for client-side
 * 
 * @deprecated Use the new modular imports from @/lib/amplify instead
 */

// Re-export the authentication methods
export const getAuthenticatedUser = Auth.getCurrentUser;
export const signInUser = (username: string, password: string) => Auth.signIn({ username, password });
export const signUpUser = (username: string, password: string, attributes: Record<string, string> = {}) => {
  return Auth.signUp({
    username,
    password,
    email: attributes.email || username,
    firstName: attributes.given_name,
    lastName: attributes.family_name,
    phoneNumber: attributes.phone_number
  });
};
export const signOutUser = Auth.signOut;

// Re-export types
export type { AuthUser, SignInResult };

// Configure Amplify function - redirects to new implementation
export const configureAmplify = ensureAmplifyInitialized;

// API client re-export
export const getApiClient = () => {
  ensureAmplifyInitialized();
  return API;
};

// Export direct API client for use in components
export const amplifyApiClient = API;

/**
 * Default export of the entire module
 * @deprecated Use the new modular imports from @/lib/amplify instead
 */
export default {
  configureAmplify: ensureAmplifyInitialized,
  getApiClient,
  getAuthenticatedUser: Auth.getCurrentUser,
  signInUser: (username: string, password: string) => Auth.signIn({ username, password }),
  signUpUser,
  signOutUser: Auth.signOut,
  amplifyApiClient: API
};