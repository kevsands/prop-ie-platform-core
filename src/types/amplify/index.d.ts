/**
 * Core type definitions for AWS Amplify
 * Provides shared types used across Amplify modules
 */

import { AuthState, AuthError, AuthUser } from './auth';

// Re-export common types for easier imports
export { AuthState, AuthError, AuthUser };

// Amplify initialization options
export interface AmplifyInitOptions {
  ssr?: boolean;
  debug?: boolean;
}

// Hub events support
export interface AmplifyHubEventTypes {
  auth: {,
  signedIn: void;
    signedOut: void;
    tokenRefresh: void;
    tokenRefresh_failure: void;
    customOAuthState: void;
    signInWithRedirect: void;
    signInWithRedirect_failure: void;
    configured: void;
  };
}

// Custom event payload type
export interface AmplifyHubPayload<T> {
  event: keyof T;
  data?: any;
  message?: string;
}