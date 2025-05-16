/**
 * Type definitions for AWS Amplify Hub events
 */

// Hub payload structure
export interface HubPayload {
  event: HubAuthEvent;
  data?: any;
  message?: string;
}

// Hub callback structure
export interface HubCallback {
  payload: HubPayload;
}

// Auth events in v6+
export type HubAuthEvent =
  | 'signedIn'
  | 'signedOut'
  | 'tokenRefresh'
  | 'tokenRefresh_failure'
  | 'signInWithRedirect'
  | 'signInWithRedirect_failure'
  | 'customOAuthState'
  | 'signIn'
  | 'signOut'
  | 'signIn_failure'
  | 'configured';