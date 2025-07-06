// jest.integration.setup.js
import '@testing-library/jest-dom';
import 'jest-extended';
import './src/tests/setup.ts';
import { server } from './src/tests/utils/hook-test-utils';
import { dataServer, setupRestApiMocks } from './src/tests/utils/data-layer-test-utils';

// This extends Jest's expect with DOM specific matchers
// https://github.com/testing-library/jest-dom

// Mock the environment module
jest.mock('./src/lib/environment', () => require('./__tests__/mocks/environment-mock'));

// Setup for MSW (Mock Service Worker) to intercept API requests
beforeAll(() => {
  // Start MSW servers for hook tests and data layer tests
  server.listen({ onUnhandledRequest: 'warn' });
  dataServer.listen({ onUnhandledRequest: 'warn' });
  setupRestApiMocks();

  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  // Mock Intersection Observer
  global.IntersectionObserver = class IntersectionObserver {
    constructor(callback) {
      this.callback = callback;
    }
    observe() { return null; }
    unobserve() { return null; }
    disconnect() { return null; }
  };

  // Mock ResizeObserver
  global.ResizeObserver = class ResizeObserver {
    constructor(callback) {
      this.callback = callback;
    }
    observe() { return null; }
    unobserve() { return null; }
    disconnect() { return null; }
  };

  // Mock window.scrollTo
  window.scrollTo = jest.fn();

  // Mock AWS Amplify modules
  jest.mock('aws-amplify/auth', () => ({
    signIn: jest.fn(),
    signOut: jest.fn(),
    fetchUserAttributes: jest.fn(),
    getCurrentUser: jest.fn(),
    confirmSignIn: jest.fn(),
    confirmSignUp: jest.fn(),
    resetPassword: jest.fn(),
    confirmResetPassword: jest.fn(),
  }));

  jest.mock('aws-amplify/api', () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    del: jest.fn(),
    fetch: jest.fn(),
    graphql: jest.fn(),
  }));

  jest.mock('aws-amplify/storage', () => ({
    getUrl: jest.fn(),
    uploadData: jest.fn(),
    downloadData: jest.fn(),
    remove: jest.fn(),
    list: jest.fn(),
  }));

  // Mock Next.js navigation functions
  jest.mock('next/navigation', () => ({
    useRouter: jest.fn(() => ({
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    })),
    useSearchParams: jest.fn(() => ({
      get: jest.fn(),
      getAll: jest.fn(),
      has: jest.fn(),
      forEach: jest.fn(),
      entries: jest.fn(),
      keys: jest.fn(),
      values: jest.fn(),
      toString: jest.fn(),
    })),
    useParams: jest.fn(() => ({})),
    usePathname: jest.fn(() => '/'),
  }));

  // Setup local & session storage mocks
  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: jest.fn(key => store[key] || null),
      setItem: jest.fn((key, value) => {
        store[key] = value.toString();
      }),
      removeItem: jest.fn(key => {
        delete store[key];
      }),
      clear: jest.fn(() => {
        store = {};
      }),
    };
  })();

  const sessionStorageMock = (() => {
    let store = {};
    return {
      getItem: jest.fn(key => store[key] || null),
      setItem: jest.fn((key, value) => {
        store[key] = value.toString();
      }),
      removeItem: jest.fn(key => {
        delete store[key];
      }),
      clear: jest.fn(() => {
        store = {};
      }),
    };
  })();

  Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });
});

afterEach(() => {
  // Reset all mocks between tests for clean state
  jest.clearAllMocks();
  
  // Reset MSW handlers between tests
  server.resetHandlers();
  dataServer.resetHandlers();
});

afterAll(() => {
  // Close MSW servers after all tests are done
  server.close();
  dataServer.close();
});

// Global helpers for integration tests
global.waitForAmplifyOperation = async (operation, mockImplementation) => {
  // Helper to wait for AWS Amplify operations
  const mockFn = jest.fn().mockImplementation(mockImplementation);
  
  // Choose which Amplify module to mock based on operation type
  if (operation.startsWith('auth:')) {
    const authOperation = operation.split(':')[1];
    const authModule = require('aws-amplify/auth');
    const originalMethod = authModule[authOperation];
    authModule[authOperation] = mockFn;
    
    return {
      mockFn,
      cleanup: () => {
        authModule[authOperation] = originalMethod;
      }
    };
  } else if (operation.startsWith('api:')) {
    const apiOperation = operation.split(':')[1];
    const apiModule = require('aws-amplify/api');
    const originalMethod = apiModule[apiOperation];
    apiModule[apiOperation] = mockFn;
    
    return {
      mockFn,
      cleanup: () => {
        apiModule[apiOperation] = originalMethod;
      }
    };
  } else if (operation.startsWith('storage:')) {
    const storageOperation = operation.split(':')[1];
    const storageModule = require('aws-amplify/storage');
    const originalMethod = storageModule[storageOperation];
    storageModule[storageOperation] = mockFn;
    
    return {
      mockFn,
      cleanup: () => {
        storageModule[storageOperation] = originalMethod;
      }
    };
  }
  
  throw new Error(`Unknown Amplify operation: ${operation}`);
};