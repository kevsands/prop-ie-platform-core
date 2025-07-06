/**
 * AWS Amplify Mocking Utilities for Tests
 * 
 * This file provides a comprehensive set of mocking utilities for AWS Amplify
 * services to enable offline testing of components and features that depend on
 * AWS Amplify functionality.
 */

import { AuthError } from 'aws-amplify/auth';

// Types for mocked responses
interface MockedResponse<T> {
  data: T;
  error?: Error;
}

interface MockAuthUser {
  userId: string;
  username: string;
  email: string;
  attributes?: Record<string, any>;
}

interface MockApiOptions {
  statusCode?: number;
  delay?: number;
  headers?: Record<string, string>;
}

// ====== AUTH MOCKING UTILITIES ======

/**
 * Creates a mock Auth module that simulates Amplify Auth behavior
 */
export function createMockAuth(options?: {
  initialUser?: MockAuthUser | null;
  signInBehavior?: 'success' | 'error' | 'mfa-required';
  signUpBehavior?: 'success' | 'error' | 'confirm-required';
}) {
  const {
    initialUser = null,
    signInBehavior = 'success',
    signUpBehavior = 'success',
  } = options || {};

  // Store current auth state
  let currentUser: MockAuthUser | null = initialUser;
  let isSignedIn = !!initialUser;

  // Create auth mock
  const authMock = {
    // Current state tracking
    __currentUser: currentUser,
    __isSignedIn: isSignedIn,
    __resetMock: () => {
      currentUser = initialUser;
      isSignedIn = !!initialUser;
      authMock.__currentUser = currentUser;
      authMock.__isSignedIn = isSignedIn;
    },

    // Mock implementations
    signIn: jest.fn(async ({ username, password }: { username: string; password: string }) => {
      if (signInBehavior === 'error') {
        throw new AuthError({
          name: 'NotAuthorizedException',
          message: 'Incorrect username or password.',
        });
      }

      if (signInBehavior === 'mfa-required') {
        return {
          isSignedIn: false,
          nextStep: {
            signInStep: 'CONFIRM_SIGN_IN_WITH_SMS_CODE',
            codeDeliveryDetails: {
              deliveryMedium: 'SMS',
              destination: '+1********12',
              attributeName: 'phone_number',
            },
          },
        };
      }

      currentUser = {
        userId: 'mock-user-id',
        username,
        email: username.includes('@') ? username : `${username}@example.com`,
      };

      isSignedIn = true;
      authMock.__currentUser = currentUser;
      authMock.__isSignedIn = isSignedIn;

      return {
        isSignedIn: true,
        nextStep: { signInStep: 'DONE' },
      };
    }),

    signOut: jest.fn(async () => {
      currentUser = null;
      isSignedIn = false;
      authMock.__currentUser = currentUser;
      authMock.__isSignedIn = isSignedIn;
      return {};
    }),

    getCurrentUser: jest.fn(async () => {
      if (!isSignedIn) {
        return null;
      }

      return currentUser;
    }),

    fetchUserAttributes: jest.fn(async () => {
      if (!isSignedIn || !currentUser) {
        throw new AuthError({
          name: 'NotAuthorizedException',
          message: 'User is not authenticated',
        });
      }

      return {
        email: currentUser.email,
        email_verified: 'true',
        name: 'Test User',
        ...(currentUser.attributes || {}),
      };
    }),

    signUp: jest.fn(async ({ username, password, email }: { username: string; password: string; email: string }) => {
      if (signUpBehavior === 'error') {
        throw new AuthError({
          name: 'UsernameExistsException',
          message: 'An account with the given email already exists.',
        });
      }

      if (signUpBehavior === 'confirm-required') {
        return {
          isSignUpComplete: false,
          nextStep: {
            signUpStep: 'CONFIRM_SIGN_UP',
            codeDeliveryDetails: {
              deliveryMedium: 'EMAIL',
              destination: email || username,
              attributeName: 'email',
            },
          },
        };
      }

      return {
        isSignUpComplete: true,
        nextStep: { signUpStep: 'DONE' },
      };
    }),

    confirmSignUp: jest.fn(async ({ username, confirmationCode }: { username: string; confirmationCode: string }) => {
      if (confirmationCode !== '123456') {
        throw new AuthError({
          name: 'CodeMismatchException',
          message: 'Invalid verification code provided',
        });
      }

      return {
        isSignUpComplete: true,
        nextStep: { signUpStep: 'DONE' },
      };
    }),

    resetPassword: jest.fn(async ({ username }: { username: string }) => {
      return {
        isPasswordReset: false,
        nextStep: {
          resetPasswordStep: 'CONFIRM_RESET_PASSWORD',
          codeDeliveryDetails: {
            deliveryMedium: 'EMAIL',
            destination: username.includes('@') ? username : `${username}@example.com`,
            attributeName: 'email',
          },
        },
      };
    }),

    confirmResetPassword: jest.fn(
      async ({ username, confirmationCode, newPassword }: { username: string; confirmationCode: string; newPassword: string }) => {
        if (confirmationCode !== '123456') {
          throw new AuthError({
            name: 'CodeMismatchException',
            message: 'Invalid verification code provided',
          });
        }

        return {};
      }
    ),

    // Helpers for managing sessions in tests
    __setCurrentUser: (user: MockAuthUser | null) => {
      currentUser = user;
      isSignedIn = !!user;
      authMock.__currentUser = currentUser;
      authMock.__isSignedIn = isSignedIn;
    },
  };

  return authMock;
}

// ====== API MOCKING UTILITIES ======

/**
 * Creates a mock API module that simulates Amplify API behavior
 */
export function createMockApi() {
  // Store predefined responses for API endpoints
  const responseMap: Record<string, MockedResponse<any>> = {};

  // Create API mock
  const apiMock = {
    // Response configuration
    __responseMap: responseMap,
    __resetMock: () => {
      Object.keys(responseMap).forEach(key => {
        delete responseMap[key];
      });
    },

    // Mock implementations
    get: jest.fn(async (options: { path: string }) => {
      const key = `GET:${options.path}`;
      const mock = responseMap[key];

      if (mock?.error) {
        throw mock.error;
      }

      return mock?.data || null;
    }),

    post: jest.fn(async (options: { path: string; body: any }) => {
      const key = `POST:${options.path}`;
      const mock = responseMap[key];

      if (mock?.error) {
        throw mock.error;
      }

      return mock?.data || null;
    }),

    put: jest.fn(async (options: { path: string; body: any }) => {
      const key = `PUT:${options.path}`;
      const mock = responseMap[key];

      if (mock?.error) {
        throw mock.error;
      }

      return mock?.data || null;
    }),

    del: jest.fn(async (options: { path: string }) => {
      const key = `DELETE:${options.path}`;
      const mock = responseMap[key];

      if (mock?.error) {
        throw mock.error;
      }

      return mock?.data || null;
    }),

    graphql: jest.fn(async (options: { query: string; variables?: any }) => {
      const queryName = options.query.match(/query\s+(\w+)|mutation\s+(\w+)/)?.[1] || options.query.slice(0, 20);
      const key = `GRAPHQL:${queryName}`;
      const mock = responseMap[key];

      if (mock?.error) {
        throw mock.error;
      }

      return mock?.data || { data: {} };
    }),

    // Helpers for configuring responses in tests
    __mockResponse: (method: string, path: string, data: any, options?: MockApiOptions) => {
      const key = `${method.toUpperCase()}:${path}`;
      responseMap[key] = { data };
    },

    __mockGraphQLResponse: (queryName: string, data: any, options?: MockApiOptions) => {
      const key = `GRAPHQL:${queryName}`;
      responseMap[key] = { data: { data } };
    },

    __mockError: (method: string, path: string, error: Error) => {
      const key = `${method.toUpperCase()}:${path}`;
      responseMap[key] = { data: null, error };
    },

    __mockGraphQLError: (queryName: string, error: Error) => {
      const key = `GRAPHQL:${queryName}`;
      responseMap[key] = {
        data: {
          data: null,
          errors: [{ message: error.message }],
        },
        error,
      };
    },
  };

  return apiMock;
}

// ====== STORAGE MOCKING UTILITIES ======

/**
 * Creates a mock Storage module that simulates Amplify Storage behavior
 */
export function createMockStorage() {
  // Store file data
  const fileMap: Record<string, { data: any; url: string }> = {};

  // Create storage mock
  const storageMock = {
    // Storage state tracking
    __fileMap: fileMap,
    __resetMock: () => {
      Object.keys(fileMap).forEach(key => {
        delete fileMap[key];
      });
    },

    // Mock implementations
    getUrl: jest.fn(async ({ key }: { key: string }) => {
      if (!fileMap[key]) {
        return { url: '' };
      }
      return { url: fileMap[key].url || `https://mock-s3.amazonaws.com/${key}` };
    }),

    uploadData: jest.fn(async ({ key, data, options }: { key: string; data: any; options?: any }) => {
      fileMap[key] = {
        data,
        url: `https://mock-s3.amazonaws.com/${key}`,
      };

      return {
        key,
      };
    }),

    downloadData: jest.fn(async ({ key }: { key: string }) => {
      if (!fileMap[key]) {
        throw new Error(`File not found: ${key}`);
      }

      return {
        body: fileMap[key].data,
      };
    }),

    remove: jest.fn(async ({ key }: { key: string }) => {
      if (fileMap[key]) {
        delete fileMap[key];
      }
      return { key };
    }),

    list: jest.fn(async ({ path }: { path: string }) => {
      const matchingKeys = Object.keys(fileMap).filter(key => key.startsWith(path));
      return {
        results: matchingKeys.map(key => ({
          key,
          size: 1024,
          eTag: 'mock-etag',
          lastModified: new Date(),
        })),
      };
    }),

    // Helpers for configuring files in tests
    __mockFile: (key: string, data: any, url?: string) => {
      fileMap[key] = {
        data,
        url: url || `https://mock-s3.amazonaws.com/${key}`,
      };
    },
  };

  return storageMock;
}

// ====== AMPLIFY CONFIGURATION MOCKING ======

/**
 * Creates a mock Amplify module with configuration capabilities
 */
export function createMockAmplify() {
  return {
    configure: jest.fn(),
  };
}

// ====== UTILITY FUNCTIONS ======

/**
 * Creates a complete mock of all Amplify modules
 * 
 * @returns Object containing all mocked Amplify modules
 */
export function createMockAmplifyModules(options?: {
  authOptions?: Parameters<typeof createMockAuth>[0];
}) {
  // Create individual mocks
  const authMock = createMockAuth(options?.authOptions);
  const apiMock = createMockApi();
  const storageMock = createMockStorage();
  const amplifyMock = createMockAmplify();

  // Setup mock for aws-amplify
  jest.mock('aws-amplify', () => ({
    Amplify: amplifyMock,
  }));

  // Setup mocks for individual modules
  jest.mock('aws-amplify/auth', () => authMock);
  jest.mock('aws-amplify/api', () => apiMock);
  jest.mock('aws-amplify/storage', () => storageMock);

  // Return the mocks for further configuration
  return {
    Amplify: amplifyMock,
    Auth: authMock,
    API: apiMock,
    Storage: storageMock,
  };
}

/**
 * Resets all Amplify mocks to their initial state
 */
export function resetAmplifyMocks() {
  // Get the mocked modules
  const auth = require('aws-amplify/auth');
  const api = require('aws-amplify/api');
  const storage = require('aws-amplify/storage');

  // Reset the mocks if they have reset functions
  if (auth.__resetMock) auth.__resetMock();
  if (api.__resetMock) api.__resetMock();
  if (storage.__resetMock) storage.__resetMock();

  // Reset all Jest mocks
  jest.clearAllMocks();
}

/**
 * Simulates a logged-in user for testing authenticated components
 */
export function simulateAuthenticatedUser(userData: Partial<MockAuthUser> = {}) {
  const auth = require('aws-amplify/auth');
  
  const user = {
    userId: 'test-user-id',
    username: 'testuser',
    email: 'test@example.com',
    ...userData,
  };

  // Update the mock state
  if (auth.__setCurrentUser) {
    auth.__setCurrentUser(user);
  }

  return user;
}

/**
 * Simulates a user logout for testing unauthenticated components
 */
export function simulateUnauthenticatedUser() {
  const auth = require('aws-amplify/auth');
  
  // Update the mock state
  if (auth.__setCurrentUser) {
    auth.__setCurrentUser(null);
  }
}

/**
 * Mocks a specific API endpoint response
 */
export function mockApiEndpoint(method: 'get' | 'post' | 'put' | 'delete', path: string, responseData: any) {
  const api = require('aws-amplify/api');
  
  // Configure the mock response
  if (api.__mockResponse) {
    api.__mockResponse(method, path, responseData);
  }
}

/**
 * Mocks a GraphQL query or mutation response
 */
export function mockGraphQLOperation(operationName: string, responseData: any) {
  const api = require('aws-amplify/api');
  
  // Configure the mock response
  if (api.__mockGraphQLResponse) {
    api.__mockGraphQLResponse(operationName, responseData);
  }
}

/**
 * Mocks an API error response
 */
export function mockApiError(method: 'get' | 'post' | 'put' | 'delete', path: string, error: string | Error) {
  const api = require('aws-amplify/api');
  
  // Create error object if string provided
  const errorObj = typeof error === 'string' ? new Error(error) : error;
  
  // Configure the mock error
  if (api.__mockError) {
    api.__mockError(method, path, errorObj);
  }
}

/**
 * Mocks a storage file for testing file operations
 */
export function mockStorageFile(key: string, data: any, url?: string) {
  const storage = require('aws-amplify/storage');
  
  // Configure the mock file
  if (storage.__mockFile) {
    storage.__mockFile(key, data, url);
  }
}