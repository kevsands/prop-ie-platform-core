// __tests__/helpers/app-router-test-utils.tsx
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { mockEnvironmentVariables } from './environment-test-utils';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../../src/context/AuthContext';
import { CustomizationProvider } from '../../src/context/CustomizationContext';

// Global mocks for AWS Amplify and Next.js
jest.mock('aws-amplify/auth', () => ({
  getCurrentUser: jest.fn().mockResolvedValue({
    userId: 'test-user',
    username: 'testuser',
  }),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  useParams: jest.fn(),
}));

// Mock API services
jest.mock('../../src/lib/api-client', () => ({
  get: jest.fn().mockImplementation((path) => {
    if (path.includes('properties')) {
      return Promise.resolve([
        { id: 'prop1', title: 'Test Property 1', price: 250000 },
        { id: 'prop2', title: 'Test Property 2', price: 350000 },
      ]);
    }
    if (path.includes('customization/options')) {
      return Promise.resolve({
        categories: [
          {
            id: 'cat1',
            name: 'Flooring',
            options: [
              { id: 'opt1', name: 'Carpet', price: 0 },
              { id: 'opt2', name: 'Hardwood', price: 5000 },
            ],
          },
        ],
      });
    }
    return Promise.resolve({});
  }),
  post: jest.fn().mockResolvedValue({ success: true }),
}));

// Define interfaces for router and auth mock options
export interface RouterMockOptions {
  params?: Record<string, string>;
  searchParams?: Record<string, string>;
  pathname?: string;
  customRouterMethods?: Record<string, jest.Mock>;
}

export interface UserMockData {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
  [key: string]: any;
}

export interface AuthMockOptions {
  isAuthenticated?: boolean;
  user?: UserMockData;
  token?: string;
  customAuthMethods?: Record<string, jest.Mock>;
}

// Type definitions for Next.js navigation features to improve IDE support and type checking
interface NextRouter {
  push: jest.Mock;
  replace: jest.Mock;
  back: jest.Mock;
  forward: jest.Mock;
  refresh: jest.Mock;
  prefetch: jest.Mock;
  pathname: string;
  [key: string]: any;
}

interface NextSearchParams {
  get: jest.Mock<(key: string) => string | null>;
  getAll: jest.Mock<(key: string) => string[]>;
  has: jest.Mock<(key: string) => boolean>;
  entries: jest.Mock<() => IterableIterator<[string, string]>>;
  keys: jest.Mock<() => IterableIterator<string>>;
  values: jest.Mock<() => IterableIterator<string>>;
  toString: jest.Mock<() => string>;
}

interface NextNavigation {
  useRouter: jest.Mock<() => NextRouter>;
  useSearchParams: jest.Mock<() => NextSearchParams>;
  useParams: jest.Mock<() => Record<string, string>>;
}

// Mock Next.js modules without directly requiring them
// to avoid issues when they aren't available
const mockNextNavigation = (): void => {
  jest.mock('next/navigation', () => ({
    useRouter: jest.fn().mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
      pathname: '',
    }),
    useSearchParams: jest.fn().mockReturnValue({
      get: jest.fn(),
      getAll: jest.fn(),
      has: jest.fn(),
      entries: jest.fn(),
      keys: jest.fn(),
      values: jest.fn(),
      toString: jest.fn(),
    }),
    useParams: jest.fn().mockReturnValue({}),
  }));
};

// Only call this if the module is available
try {
  mockNextNavigation();
} catch (error) {
  console.warn('Could not mock next/navigation. This is expected in non-Next.js environments.');
}

/**
 * Sets up router mocks for testing app router functionality
 * @param options Router mock configuration options
 * @returns Mock objects for router, searchParams and params
 */
export function setupAppRouterMocks(options: RouterMockOptions = {}): {
  router: NextRouter;
  searchParams: NextSearchParams;
  params: Record<string, string>;
} {
  const { 
    params = {}, 
    searchParams = {}, 
    pathname = '',
    customRouterMethods = {} 
  } = options;

  // Get the mocked modules
  const nextNavigation = jest.requireMock('next/navigation') as NextNavigation;
  
  // Setup useParams mock
  nextNavigation.useParams.mockReturnValue(params);
  
  // Setup useSearchParams mock with proper types
  const searchParamsObj: NextSearchParams = {
    get: jest.fn((key: string) => searchParams[key] || null),
    getAll: jest.fn((key: string) => searchParams[key] ? [searchParams[key]] : []),
    has: jest.fn((key: string) => key in searchParams),
    entries: jest.fn(() => Object.entries(searchParams)[Symbol.iterator]()),
    keys: jest.fn(() => Object.keys(searchParams)[Symbol.iterator]()),
    values: jest.fn(() => Object.values(searchParams)[Symbol.iterator]()),
    toString: jest.fn(() => 
      Object.entries(searchParams)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')
    ),
  };
  nextNavigation.useSearchParams.mockReturnValue(searchParamsObj);
  
  // Setup useRouter mock with proper types
  const routerObj: NextRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
    pathname,
    ...customRouterMethods,
  };
  nextNavigation.useRouter.mockReturnValue(routerObj);
  
  return {
    router: routerObj,
    searchParams: searchParamsObj,
    params,
  };
}

// Interface for localStorage mock to ensure type safety
interface MockLocalStorage {
  getItem: jest.Mock<(key: string) => string | null>;
  setItem: jest.Mock;
  removeItem: jest.Mock;
  clear: jest.Mock;
  length: number;
  key: jest.Mock;
}

/**
 * Sets up authentication mocks for testing authenticated components
 * @param options Auth mock configuration options
 * @returns Mock auth data (isAuthenticated, user, token)
 */
export function setupAuthMock(options: AuthMockOptions = {}): {
  isAuthenticated: boolean;
  user: UserMockData;
  token: string;
} {
  const {
    isAuthenticated = true,
    user = { 
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user'
    },
    token = 'mock-jwt-token',
    customAuthMethods = {}
  } = options;

  // Mock the auth hook with proper types
  jest.mock('../../src/hooks/useAuth', () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue({
      isAuthenticated,
      user,
      token,
      login: jest.fn().mockResolvedValue({}),
      logout: jest.fn(),
      register: jest.fn().mockResolvedValue({}),
      ...customAuthMethods
    }),
  }));

  // Mock localStorage for JWT token
  if (typeof window !== 'undefined') {
    const mockStorage: MockLocalStorage = {
      getItem: jest.fn((key: string) => {
        if (key === 'auth_token' && isAuthenticated) return token;
        return null;
      }),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      length: isAuthenticated ? 1 : 0,
      key: jest.fn(),
    };
    
    Object.defineProperty(window, 'localStorage', {
      value: mockStorage,
      writable: true
    });
  }

  return {
    isAuthenticated,
    user,
    token,
  };
}

/**
 * Sets up test environment variables for testing
 * @param variables Custom environment variables to set
 * @returns Function to restore original environment
 */
export function setupTestEnvironment(variables: Record<string, string> = {}): () => void {
  // Default test environment variables
  const defaultTestVars: Record<string, string> = {
    NODE_ENV: 'test',
    POSTGRES_HOST: 'localhost',
    POSTGRES_PORT: '5432',
    POSTGRES_DB: 'propie_test',
    POSTGRES_USER: 'postgres',
    POSTGRES_PASSWORD: 'postgres',
    POSTGRES_POOL_MAX: '5',
    POSTGRES_IDLE_TIMEOUT: '10000',
    POSTGRES_CONNECT_TIMEOUT: '1000',
    POSTGRES_SSL: 'false',
  };

  // Merge default with provided variables (provided takes precedence)
  return mockEnvironmentVariables({
    ...defaultTestVars,
    ...variables
  });
}

/**
 * Generates a consistent test ID for querying elements in tests
 * @param componentName Name of the component being tested
 * @param identifier Specific identifier within the component
 * @returns Formatted test ID string
 */
export function getTestId(componentName: string, identifier: string): string {
  return `${componentName}-${identifier}`;
}

/**
 * Type-safe render function for testing components using app router features
 * @param ui Component to render
 * @param routerOptions Options for router mocking
 * @param authOptions Options for auth mocking
 * @param queryClient Optional custom QueryClient instance
 * @param renderOptions Additional render options
 * @returns Result of render function with router and auth mocks set up
 */
export function renderWithAppRouter(
  ui: ReactElement,
  {
    routerOptions = {},
    authOptions = {},
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          cacheTime: 0,
        },
      },
    }),
    ...renderOptions
  }: {
    routerOptions?: RouterMockOptions;
    authOptions?: AuthMockOptions;
    queryClient?: QueryClient;
  } & Omit<RenderOptions, 'wrapper'> = {}
) {
  // Set up router and auth mocks
  const routerMocks = setupAppRouterMocks(routerOptions);
  const authMocks = setupAuthMock(authOptions);
  
  // Create wrapper with providers
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CustomizationProvider>
            {children}
          </CustomizationProvider>
        </AuthProvider>
      </QueryClientProvider>
    );
  }
  
  // Render the component with wrapper
  const renderResult = render(ui, { 
    wrapper: Wrapper,
    ...renderOptions 
  });
  
  // Return render result along with mocks
  return {
    ...renderResult,
    router: routerMocks.router,
    searchParams: routerMocks.searchParams,
    params: routerMocks.params,
    auth: authMocks,
    queryClient,
  };
}