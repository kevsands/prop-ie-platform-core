/**
 * AWS Amplify Main Module
 * 
 * This module serves as the entry point for all AWS Amplify interactions.
 * It handles initialization of Amplify v6 and provides safe access to Amplify services.
 * 
 * IMPORTANT: This file should NOT be imported directly in server components.
 * For server components, use the ServerAmplify module from './server'.
 * 
 * Includes environment detection, error handling, and debug logging options.
 */
import { Amplify as AmplifyCore } from 'aws-amplify';
import { Hub } from 'aws-amplify/utils';
import amplifyConfig from './config';

// Re-export Hub for use in other modules
export { Hub };

// Configuration options for Amplify initialization
export interface AmplifyInitOptions {
  ssr?: boolean;
  debug?: boolean;
}

// Environment and initialization state tracking
let isInitialized = false;
let isDebugMode = process.env.NODE_ENV !== 'production';

/**
 * Initialize Amplify
 * This ensures Amplify is only initialized once, even with HMR (Hot Module Replacement)
 */
export function initialize(options: AmplifyInitOptions = { ssr: true, debug: isDebugMode }) {
  // If already initialized, return true
  if (isInitialized) {
    return true;
  }

  try {
    // Configure Amplify with our config and options
    AmplifyCore.configure(amplifyConfig);

    // Set up debugging if enabled
    if (options.debug) {
      enableDebugMode();
    }

    // Listen for auth events if in browser
    if (typeof window !== 'undefined') {
      setupAuthListeners();
    }

    isInitialized = true;
    isDebugMode = options.debug || false;

    // Log success but only in development or if debug mode is on
    if (process.env.NODE_ENV !== 'production' || isDebugMode) {

    }

    return true;
  } catch (error) {

    return false;
  }
}

/**
 * Async version of initialize for improved error handling
 * This implementation ensures the application will continue to load even if initialization fails
 * 
 * @param options Optional configuration options for Amplify initialization
 * @returns Promise that always resolves to true to prevent application crashes
 */
export async function initializeAsync(options: AmplifyInitOptions = { ssr: true, debug: isDebugMode }): Promise<boolean> {
  try {
    // If we're already initialized, just return true
    if (isInitialized) {
      return true;
    }

    // Get Auth configuration from environment
    const authConfig = {
      region: process.env.NEXT_PUBLIC_AWS_REGION || amplifyConfig.Auth?.Cognito?.region || 'us-east-1',
      userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOLS_ID || amplifyConfig.Auth?.Cognito?.userPoolId,
      userPoolClientId: process.env.NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID || amplifyConfig.Auth?.Cognito?.userPoolClientId,
      identityPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID || amplifyConfig.Auth?.Cognito?.identityPoolId
    };

    // Configure Amplify with our config enhanced with any environment overrides
    const configToUse = {
      ...amplifyConfig,
      Auth: {
        Cognito: {
          ...amplifyConfig.Auth?.Cognito,
          ...authConfig
        }
      }
    };

    await AmplifyCore.configure(configToUse);

    // Set up debugging if enabled
    if (options.debug) {
      enableDebugMode();
    }

    // Listen for auth events if in browser
    if (typeof window !== 'undefined') {
      setupAuthListeners();
    }

    isInitialized = true;
    isDebugMode = options.debug || false;

    // Log success but only in development or if debug mode is on
    if (process.env.NODE_ENV !== 'production' || isDebugMode) {
      ');
    }

    return true;
  } catch (error) {
    // Log the error but still return true to prevent app crashes

    // Ensure we at least set the initialized flag to prevent repeated initialization attempts
    isInitialized = true;

    // Always return true to prevent application crashes
    return true;
  }
}

/**
 * Enable debug mode for Amplify
 */
function enableDebugMode() {
  if (typeof window !== 'undefined') {
    // Set global logging flag for Amplify's internal logging
    (window as any).LOG_LEVEL = 'DEBUG';
  }
}

/**
 * Set up event listeners for auth events
 */
function setupAuthListeners() {
  Hub.listen('auth', ({ payload }) => {
    const { event } = payload;

    if (isDebugMode) {

    }

    switch (event) {
      case 'signedIn':
        // User has signed in
        if (isDebugMode) 
        break;
      case 'signedOut':
        // User has signed out
        if (isDebugMode) 
        break;
      case 'tokenRefresh':
        // Token has been refreshed
        if (isDebugMode) 
        break;
      case 'tokenRefresh_failure':
        // Token refresh failed

        break;
      case 'configured':
        // Amplify has been configured
        if (isDebugMode) 
        break;
    }
  });
}

/**
 * Reset the Amplify initialization state
 * Useful for testing and in specific scenarios where re-initialization is needed
 */
export function resetAmplifyState() {
  isInitialized = false;
}

/**
 * Check if Amplify is initialized
 */
export function isAmplifyInitialized() {
  return isInitialized;
}

/**
 * Set debug mode on or off
 */
export function setDebugMode(enabled: boolean) {
  isDebugMode = enabled;
  if (enabled) {
    enableDebugMode();
  }
}

/**
 * Ensure Amplify is initialized in client components
 */
export function ensureAmplifyInitialized() {
  if (typeof window !== 'undefined' && !isInitialized) {
    initialize();
  }
  return isInitialized;
}

// Alias for backward compatibility
export const initializeAmplify = initialize;

// Export all submodules
export * from './auth';
export * from './api';
export * from './cache';
export * from './storage';

// Safe check for browser environment - don't attempt to access window in SSR
const isBrowser = typeof window !== 'undefined';

// Only initialize automatically in browser environment and not during SSR
if (isBrowser) {
  // Defer to next event loop tick to avoid initialization race conditions
  setTimeout(() => {
    if (!isInitialized) {
      initialize();
    }
  }, 0);
}

/**
 * Amplify module - main export with all commonly used functions
 */
const Amplify = {
  initialize,
  initializeAsync,
  isInitialized: isAmplifyInitialized,
  resetState: resetAmplifyState,
  setDebugMode,
  ensureInitialized: ensureAmplifyInitialized};

export default Amplify;