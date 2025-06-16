/**
 * AWS Amplify v6 Migration Utilities
 * 
 * This module provides utility functions to help bridge the gap between
 * Amplify v5 and v6 patterns, making the migration process smoother.
 * 
 * It includes:
 * - Helper functions for common patterns that changed in v6
 * - Type conversions for updated interfaces
 * - Wrappers for APIs with significant changes
 */

import { 
  getCurrentUser, 
  signIn, 
  signOut,
  fetchUserAttributes
} from 'aws-amplify/auth';
import { getSession } from 'aws-amplify/auth/session';
import { 
  generateClient,
  GraphQLResult
} from 'aws-amplify/api';
// Add custom interface to enhance ApiClient with REST methods
interface EnhancedApiClient {
  graphql: any;
  get: (params: { apiName: string; path: string; options?: any }) => Promise<any>
  );
  post: (params: { apiName: string; path: string; options?: any }) => Promise<any>
  );
  put: (params: { apiName: string; path: string; options?: any }) => Promise<any>
  );
  delete: (params: { apiName: string; path: string; options?: any }) => Promise<any>
  );
}
import { uploadData as uploadDataStorage } from 'aws-amplify/storage/upload';
import { getUrl as getUrlStorage } from 'aws-amplify/storage/get';
import { remove as removeStorage } from 'aws-amplify/storage/remove';
import { ensureAmplifyInitialized } from './index';

/**
 * Type for the auth result returned from v6 signIn
 */
export interface AuthV6Result {
  isSignedIn: boolean;
  nextStep?: {
    signInStep: string;
  };
}

/**
 * Type for the auth result in v5 compatibility format
 */
export interface AuthV5CompatResult {
  user?: any;
  session?: any;
  userConfirmed?: boolean;
  userSub?: string;
  challengeName?: string;
  challengeParam?: any;
}

/**
 * Get current authentication tokens in v5-compatible format
 */
export async function getAuthTokensV5Compatible() {
  ensureAmplifyInitialized();

  try {
    const session = await getSession();

    if (!session?.tokens) {
      return null;
    }

    // Return in a format compatible with v5 patterns
    return {
      accessToken: session.tokens.accessToken,
      idToken: session.tokens.idToken,
      refreshToken: session.tokens.refreshToken,
      getAccessToken: () => session.tokens?.accessToken?.toString(),
      getIdToken: () => session.tokens?.idToken?.toString(),
      getRefreshToken: () => session.tokens?.refreshToken?.toString()};
  } catch (error) {

    return null;
  }
}

/**
 * Get current authenticated user in v5-compatible format
 */
export async function getCurrentUserV5Compatible() {
  ensureAmplifyInitialized();

  try {
    // Get user with v6 API
    const user = await getCurrentUser();
    const attributes = await fetchUserAttributes();
    const session = await getSession();

    // Convert to v5-compatible format
    return {
      username: user.username,
      attributes: attributes,
      signInUserSession: {
        accessToken: {
          jwtToken: session.tokens?.accessToken?.toString(),
          payload: session.tokens?.accessToken?.payload || {}
        },
        idToken: {
          jwtToken: session.tokens?.idToken?.toString(),
          payload: session.tokens?.idToken?.payload || {}
        },
        refreshToken: {
          token: session.tokens?.refreshToken?.toString()
        }
      }
    };
  } catch (error) {

    throw error;
  }
}

/**
 * Sign in with v5-compatible result format
 */
// Define additional interface for SignInOutput to include missing fields
interface SignInOutputExtended {
  isSignedIn: boolean;
  nextStep?: {
    signInStep: string;
  };
  // Add the missing userId field that appears in some versions
  userId?: string;
}

export async function signInV5Compatible(username: string, password: string): Promise<AuthV5CompatResult> {
  ensureAmplifyInitialized();

  try {
    const result = await signIn({ username, password }) as SignInOutputExtended;

    // Convert to v5-compatible result
    const v5Result: AuthV5CompatResult = {
      userConfirmed: result.isSignedIn,
      // Use safe access for userSub
      userSub: result.userId || username // Fall back to username if userId is not available
    };

    if (result.nextStep) {
      v5Result.challengeName = result.nextStep.signInStep;
    }

    // If signed in, fetch and add user and session
    if (result.isSignedIn) {
      const user = await getCurrentUserV5Compatible();
      v5Result.user = user;

      const session = await getSession();
      v5Result.session = {
        accessToken: session.tokens?.accessToken?.toString() || '',
        idToken: session.tokens?.idToken?.toString() || '',
        refreshToken: session.tokens?.refreshToken?.toString() || ''
      };
    }

    return v5Result;
  } catch (error) {

    throw error;
  }
}

/**
 * Sign out with v5-compatible signature
 */
export async function signOutV5Compatible(options?: { global?: boolean }): Promise<void> {
  ensureAmplifyInitialized();

  try {
    await signOut(options);
  } catch (error) {

    throw error;
  }
}

/**
 * Upload file to S3 with v5-compatible signature
 */
export async function uploadFileV5Compatible(
  key: string,
  file: File | Blob | Buffer,
  options?: {
    contentType?: string;
    level?: 'public' | 'private' | 'protected';
    progressCallback?: (progress: { loaded: number; total: number }) => void;
  }
): Promise<{ key: string }> {
  ensureAmplifyInitialized();

  try {
    const result = await uploadDataStorage({
      key,
      data: file,
      options: {
        contentType: options?.contentType,
        accessLevel: options?.level || 'public',
        onProgress: options?.progressCallback ? 
          (progress: any) => options.progressCallback?.(progress: any) : 
          undefined
      }
    });

    return { key: result.key };
  } catch (error) {

    throw error;
  }
}

/**
 * Generate S3 URL with v5-compatible signature
 */
export async function getS3UrlV5Compatible(
  key: string,
  options?: {
    expires?: number;
    level?: 'public' | 'private' | 'protected';
  }
): Promise<string> {
  ensureAmplifyInitialized();

  try {
    const result = await getUrlStorage({
      key,
      options: {
        accessLevel: options?.level || 'public',
        expiresIn: options?.expires || 900 // 15 minutes default
      }
    });

    return result.url.toString();
  } catch (error) {

    throw error;
  }
}

/**
 * Create a GraphQL client compatible with v5 API patterns
 */
export function createGraphQLClientV5Compatible() {
  ensureAmplifyInitialized();

  // Generate the v6 client
  const client = generateClient();

  // Return a v5-compatible wrapper
  return {
    query: async <T>(params: { query: string; variables?: Record<string, any> }): Promise<{ data: T }> => {
      try {
        const result = await client.graphql({
          query: params.query,
          variables: params.variables
        }) as GraphQLResult<T>
  );
        // Make sure to handle undefined data case
        if (result.data === undefined) {
          throw new Error('GraphQL query returned undefined data');
        }

        return { data: result.data };
      } catch (error) {

        throw error;
      }
    },

    mutate: async <T>(params: { query: string; variables?: Record<string, any> }): Promise<{ data: T }> => {
      try {
        const result = await client.graphql({
          query: params.query,
          variables: params.variables
        }) as GraphQLResult<T>
  );
        // Make sure to handle undefined data case
        if (result.data === undefined) {
          throw new Error('GraphQL mutation returned undefined data');
        }

        return { data: result.data };
      } catch (error) {

        throw error;
      }
    }
  };
}

/**
 * Interface for v5-compatible API client
 */
export interface ApiV5Compatible {
  graphql: <T>(params: { query: string; variables?: Record<string, any> }) => Promise<{ data: T }>
  );
  get: (apiName: string, path: string, init?: RequestInit) => Promise<any>
  );
  post: (apiName: string, path: string, init?: RequestInit) => Promise<any>
  );
  put: (apiName: string, path: string, init?: RequestInit) => Promise<any>
  );
  delete: (apiName: string, path: string, init?: RequestInit) => Promise<any>
  );
}

/**
 * Create a comprehensive API client compatible with v5 patterns
 */
export function createApiV5Compatible(): ApiV5Compatible {
  ensureAmplifyInitialized();

  // Generate the v6 GraphQL client and cast to our enhanced interface
  const graphqlClient = generateClient() as unknown as EnhancedApiClient;

  // Implement REST methods if they don't exist
  // These implementations will be replaced by the actual REST API methods when they become available
  if (!graphqlClient.get) {
    graphqlClient.get = async ({ apiName, path, options }) => {
      throw new Error(`REST API method 'get' is not implemented in this version of Amplify`);
    };
  }

  if (!graphqlClient.post) {
    graphqlClient.post = async ({ apiName, path, options }) => {
      throw new Error(`REST API method 'post' is not implemented in this version of Amplify`);
    };
  }

  if (!graphqlClient.put) {
    graphqlClient.put = async ({ apiName, path, options }) => {
      throw new Error(`REST API method 'put' is not implemented in this version of Amplify`);
    };
  }

  if (!graphqlClient.delete) {
    graphqlClient.delete = async ({ apiName, path, options }) => {
      throw new Error(`REST API method 'delete' is not implemented in this version of Amplify`);
    };
  }

  // Return a v5-compatible API wrapper
  return {
    graphql: async <T>(params: { query: string; variables?: Record<string, any> }): Promise<{ data: T }> => {
      try {
        const result = await graphqlClient.graphql({
          query: params.query,
          variables: params.variables
        }) as GraphQLResult<T>
  );
        // Make sure to handle undefined data case
        if (result.data === undefined) {
          throw new Error('GraphQL operation returned undefined data');
        }

        return { data: result.data };
      } catch (error) {

        throw error;
      }
    },

    get: async (apiName: string, path: string, init?: RequestInit) => {
      try {
        const result = await graphqlClient.get({ apiName, path, options: init });
        return result.body;
      } catch (error) {

        throw error;
      }
    },

    post: async (apiName: string, path: string, init?: RequestInit) => {
      try {
        const result = await graphqlClient.post({ apiName, path, options: init });
        return result.body;
      } catch (error) {

        throw error;
      }
    },

    put: async (apiName: string, path: string, init?: RequestInit) => {
      try {
        const result = await graphqlClient.put({ apiName, path, options: init });
        return result.body;
      } catch (error) {

        throw error;
      }
    },

    delete: async (apiName: string, path: string, init?: RequestInit) => {
      try {
        const result = await graphqlClient.delete({ apiName, path, options: init });
        return result.body;
      } catch (error) {

        throw error;
      }
    }
  };
}

/**
 * Helper function to convert v6 auth error to standardized format
 */
export function normalizeAuthError(error: any): { code: string; message: string; name: string } {
  let errorCode = 'UnknownError';
  let errorMessage = 'An unknown error occurred';
  let errorName = 'Error';

  if (error) {
    if (typeof error === 'string') {
      errorMessage = error;
    } else {
      // Extract consistent error properties from v6 errors
      errorCode = error.code || error.name || 'UnknownError';
      errorMessage = error.message || 'An unknown error occurred';
      errorName = error.name || 'Error';
    }
  }

  // Map v6-specific error codes to v5-equivalent codes where needed
  const errorCodeMapping: Record<string, string> = {
    'NotAuthorizedException': 'NotAuthorizedException',
    'UserNotFoundException': 'UserNotFoundException',
    'UserNotConfirmedException': 'UserNotConfirmedException',
    'UsernameExistsException': 'UsernameExistsException',
    'CodeMismatchException': 'CodeMismatchException',
    'ExpiredCodeException': 'ExpiredCodeException'
    // Add more mappings as needed
  };

  return {
    code: errorCodeMapping[errorCode] || errorCode,
    message: errorMessage,
    name: errorName
  };
}

/**
 * Export a consolidated Amplify v5-compatible interface
 */
export const AmplifyV5Compatible = {
  Auth: {
    currentSession: getAuthTokensV5Compatible,
    currentUserInfo: getCurrentUserV5Compatible,
    currentAuthenticatedUser: getCurrentUserV5Compatible,
    signIn: signInV5Compatible,
    signOut: signOutV5Compatible
  },
  Storage: {
    put: uploadFileV5Compatible,
    get: getS3UrlV5Compatible,
    remove: async (key: string, options?: { level?: string }) => {
      return removeStorage({ key, options: { accessLevel: options?.level as any || 'public' } });
    }
  },
  API: createApiV5Compatible(),
  graphqlOperation: (query: string, variables?: Record<string, any>) => ({ query, variables })
};

export default AmplifyV5Compatible;