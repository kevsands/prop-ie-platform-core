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
  fetchUserAttributes,
  fetchAuthSession
} from 'aws-amplify/auth';
import {
  generateClient,
  GraphQLResult
} from 'aws-amplify/api';
import {
  uploadData as uploadFile,
  getUrl as getFileUrl,
  remove as removeFile,
  type TransferProgressEvent
} from '@aws-amplify/storage';
// We don't need to import the Amplify module directly since we're using direct imports
// from aws-amplify packages above. We'll handle initialization differently.

// Define request options interface
interface ApiRequestOptions {
  headers?: Record<string, string>\n  );
  queryParams?: Record<string, string>\n  );
  body?: unknown;
  customEndpoint?: string;
}

// Define response interface
interface ApiResponse<T = unknown> {
  data: T;
  statusCode: number;
  headers: Record<string, string>\n  );
}

// Add custom interface to enhance ApiClient with REST methods
interface EnhancedApiClient {
  graphql: <T = unknown>(options: { query: string; variables?: Record<string, unknown> }) => Promise<{ data: T }>\n  );
  get: <T = unknown>(params: { apiName: string; path: string; options?: ApiRequestOptions }) => Promise<ApiResponse<T>>\n  );
  post: <T = unknown>(params: { apiName: string; path: string; options?: ApiRequestOptions }) => Promise<ApiResponse<T>>\n  );
  put: <T = unknown>(params: { apiName: string; path: string; options?: ApiRequestOptions }) => Promise<ApiResponse<T>>\n  );
  delete: <T = unknown>(params: { apiName: string; path: string; options?: ApiRequestOptions }) => Promise<ApiResponse<T>>\n  );
}

// Storage types
type StorageAccessLevel = 'private' | 'protected' | 'guest';

interface TransferProgress {
  loaded: number;
  total: number;
}

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
 * User interface for V5 compatibility
 */
export interface AuthV5CompatUser {
  username: string;
  attributes: Record<string, string>\n  );
  signInUserSession: {
    accessToken: {
      jwtToken: string | undefined;
      payload: Record<string, unknown>\n  );
    };
    idToken: {
      jwtToken: string | undefined;
      payload: Record<string, unknown>\n  );
    };
    refreshToken: {
      token: string;
    };
  };
}

/**
 * Session interface for V5 compatibility
 */
export interface AuthV5CompatSession {
  accessToken: string;
  idToken: string;
  refreshToken: string;
}

/**
 * Type for the auth result in v5 compatibility format
 */
export interface AuthV5CompatResult {
  user?: AuthV5CompatUser;
  session?: AuthV5CompatSession;
  userConfirmed?: boolean;
  userSub?: string;
  challengeName?: string;
  challengeParam?: Record<string, unknown>\n  );
}

/**
 * Get current authentication tokens in v5-compatible format
 */
export async function getAuthTokensV5Compatible() {
  try {
    const session = await fetchAuthSession();

    if (!session?.tokens) {
      return null;
    }

    // Return in a format compatible with v5 patterns
    return {
      accessToken: session.tokens.accessToken,
      idToken: session.tokens.idToken,
      // Create a compatible refreshToken field since v6 may not expose this directly
      refreshToken: {
        token: session.tokens.accessToken?.toString() || '' // Using accessToken as fallback
      },
      getAccessToken: () => session.tokens?.accessToken?.toString(),
      getIdToken: () => session.tokens?.idToken?.toString(),
      getRefreshToken: () => session.tokens?.accessToken?.toString(), // Using accessToken as fallback
    };
  } catch (error) {

    return null;
  }
}

/**
 * Get current authenticated user in v5-compatible format
 */
export async function getCurrentUserV5Compatible() {
  try {
    // Get user with v6 API
    const user = await getCurrentUser();
    const attributes = await fetchUserAttributes();
    const session = await fetchAuthSession();

    // Convert to v5-compatible format
    return {
      username: user.username,
      attributes: attributes,
      signInUserSession: {
        accessToken: {
          jwtToken: session.tokens?.accessToken?.toString(),
          payload: {} // v6 doesn't expose token payload directly
        },
        idToken: {
          jwtToken: session.tokens?.idToken?.toString(),
          payload: {} // v6 doesn't expose token payload directly
        },
        refreshToken: {
          token: session.tokens?.accessToken?.toString() || '' // Using accessToken as fallback
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

      const session = await fetchAuthSession();
      v5Result.session = {
        accessToken: session.tokens?.accessToken?.toString() || '',
        idToken: session.tokens?.idToken?.toString() || '',
        refreshToken: session.tokens?.accessToken?.toString() || '' // Using accessToken as fallback
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
  try {
    // Amplify should be initialized by the time these methods are called
    // Initialization is handled by the application's main entry point

    // Convert v5 options to v6 options format
    const v6Options = options?.global ? { global: true } : undefined;

    await signOut(v6Options);
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
    level?: StorageAccessLevel;
    progressCallback?: (progress: TransferProgress) => void;
  }
): Promise<{ key: string }> {
  try {
    const result = await uploadFile({
      key,
      data: file,
      options: {
        contentType: options?.contentType,
        accessLevel: options?.level,
        onProgress: (event: TransferProgressEvent) => {
          if (options?.progressCallback) {
            options.progressCallback({
              loaded: event.transferredBytes ?? 0,
              total: event.totalBytes ?? 0
            });
          }
        }
      }
    });

    return { key };
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
    level?: StorageAccessLevel;
  }
): Promise<string> {
  try {
    const result = await getFileUrl({
      key,
      options: {
        expiresIn: options?.expires,
        accessLevel: options?.level
      }
    });

    return result.url.toString();
  } catch (error) {

    throw error;
  }
}

/**
 * Remove file from S3 with v5-compatible signature
 */
export async function removeFileV5Compatible(
  key: string,
  options?: {
    level?: StorageAccessLevel;
  }
): Promise<void> {
  try {
    await removeFile({
      key,
      options: {
        accessLevel: options?.level
      }
    });
  } catch (error) {

    throw error;
  }
}

/**
 * Create a GraphQL client compatible with v5 API patterns
 */
// Define GraphQL params interface
interface GraphQLParams {
  query: string;
  variables?: Record<string, unknown>\n  );
}

export function createGraphQLClientV5Compatible() {
  // Generate the v6 client
  const client = generateClient();

  // Return a v5-compatible wrapper
  return {
    query: async <T>(params: GraphQLParams): Promise<{ data: T }> => {
      try {
        // Amplify should be initialized by the time these methods are called
        // Initialization is handled by the application's main entry point

        const result = await client.graphql({
          query: params.query,
          variables: params.variables || {}
        }) as GraphQLResult<T>\n  );
        // Make sure to handle undefined data case
        if (result.data === undefined) {
          throw new Error('GraphQL query returned undefined data');
        }

        return { data: result.data };
      } catch (error) {

        throw error;
      }
    },

    mutate: async <T>(params: GraphQLParams): Promise<{ data: T }> => {
      try {
        // Amplify should be initialized by the time these methods are called
        // Initialization is handled by the application's main entry point

        const result = await client.graphql({
          query: params.query,
          variables: params.variables || {}
        }) as GraphQLResult<T>\n  );
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
  graphql: <T>(params: GraphQLParams) => Promise<{ data: T }>\n  );
  get: <T = unknown>(apiName: string, path: string, init?: RequestInit) => Promise<T>\n  );
  post: <T = unknown>(apiName: string, path: string, init?: RequestInit) => Promise<T>\n  );
  put: <T = unknown>(apiName: string, path: string, init?: RequestInit) => Promise<T>\n  );
  delete: <T = unknown>(apiName: string, path: string, init?: RequestInit) => Promise<T>\n  );
}

/**
 * Convert RequestInit to ApiRequestOptions
 */
function convertRequestInitToApiOptions(init?: RequestInit): ApiRequestOptions {
  if (!init) return {};

  const options: ApiRequestOptions = {};

  // Convert headers
  if (init.headers) {
    if (init.headers instanceof Headers) {
      options.headers = Object.fromEntries(init.headers.entries());
    } else if (typeof init.headers === 'object') {
      options.headers = init.headers as Record<string, string>\n  );
    }
  }

  // Convert body
  if (init.body) {
    options.body = init.body;
  }

  return options;
}

/**
 * Create a comprehensive API client compatible with v5 patterns
 */
export function createApiV5Compatible(): ApiV5Compatible {
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
        }) as GraphQLResult<T>\n  );
        // Make sure to handle undefined data case
        if (result.data === undefined) {
          throw new Error('GraphQL operation returned undefined data');
        }

        return { data: result.data };
      } catch (error) {

        throw error;
      }
    },

    get: async <T = unknown>(apiName: string, path: string, init?: RequestInit) => {
      try {
        const result = await graphqlClient.get<T>({ 
          apiName, 
          path, 
          options: convertRequestInitToApiOptions(init) 
        });
        return result.data;
      } catch (error) {

        throw error;
      }
    },

    post: async <T = unknown>(apiName: string, path: string, init?: RequestInit) => {
      try {
        const result = await graphqlClient.post<T>({ 
          apiName, 
          path, 
          options: convertRequestInitToApiOptions(init) 
        });
        return result.data;
      } catch (error) {

        throw error;
      }
    },

    put: async <T = unknown>(apiName: string, path: string, init?: RequestInit) => {
      try {
        const result = await graphqlClient.put<T>({ 
          apiName, 
          path, 
          options: convertRequestInitToApiOptions(init) 
        });
        return result.data;
      } catch (error) {

        throw error;
      }
    },

    delete: async <T = unknown>(apiName: string, path: string, init?: RequestInit) => {
      try {
        const result = await graphqlClient.delete<T>({ 
          apiName, 
          path, 
          options: convertRequestInitToApiOptions(init) 
        });
        return result.data;
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
    remove: removeFileV5Compatible
  },
  API: createApiV5Compatible(),
  graphqlOperation: (query: string, variables?: Record<string, any>) => ({ query, variables })
};

export default AmplifyV5Compatible;