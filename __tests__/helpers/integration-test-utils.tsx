/**
 * integration-test-utils.tsx
 * Utilities for integration testing that extend the app-router-test-utils
 * with additional capabilities for testing component interactions.
 */
import React, { ReactElement } from 'react';
import { render, RenderOptions, waitFor } from '@testing-library/react';
import { setupAppRouterMocks, setupAuthMock, RouterMockOptions, AuthMockOptions } from './app-router-test-utils';
// Fix React Query imports - import from the correct package
import { QueryClient } from '@tanstack/query-core';
import { QueryClientProvider } from '@tanstack/query-core';
import { toast } from 'sonner';

// Mock external dependencies
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  },
  Toaster: () => <div data-testid="mock-toaster" />,
}));

// Extended provider interface that includes all necessary providers for integration tests
interface AllProvidersProps {
  children: React.ReactNode;
  queryClient?: QueryClient;
  routerOptions?: RouterMockOptions;
  authOptions?: AuthMockOptions;
}

/**
 * Provider wrapper that includes all necessary context providers for integration tests
 */
const AllProviders = ({
  children,
  queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
      },
    },
  }),
  routerOptions = {},
  authOptions = {},
}: AllProvidersProps) => {
  // Setup router and auth mocks
  setupAppRouterMocks(routerOptions);
  setupAuthMock(authOptions);

  // Reset history for toast mocks
  jest.clearAllMocks();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

/**
 * Enhanced render function for integration tests
 * Includes all necessary providers and mocks for testing component interactions
 */
export function renderForIntegration(
  ui: ReactElement,
  {
    routerOptions = {},
    authOptions = {},
    queryClient,
    ...renderOptions
  }: {
    routerOptions?: RouterMockOptions;
    authOptions?: AuthMockOptions;
    queryClient?: QueryClient;
  } & Omit<RenderOptions, 'wrapper'> = {}
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders
        queryClient={queryClient}
        routerOptions={routerOptions}
        authOptions={authOptions}
      >
        {children}
      </AllProviders>
    ),
    ...renderOptions,
  });
}

/**
 * Mock for fetch API to use in integration tests
 * @param mockResponse Response object to return
 * @param status HTTP status code
 */
export function mockFetch(mockResponse: any, status = 200) {
  global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      status,
      ok: status >= 200 && status < 300,
      json: () => Promise.resolve(mockResponse),
      text: () => Promise.resolve(JSON.stringify(mockResponse)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
  );
}

/**
 * Clear all mocked fetch implementations
 */
export function clearFetchMocks() {
  global.fetch = jest.fn();
}

/**
 * Mock storage for testing local storage interactions
 */
export class MockStorage {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }

  get length(): number {
    return Object.keys(this.store).length;
  }

  key(index: number): string | null {
    return Object.keys(this.store)[index] || null;
  }
}

/**
 * Setup mock storage for tests
 */
export function setupMockStorage() {
  const mockLocalStorage = new MockStorage();
  const mockSessionStorage = new MockStorage();

  Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });
  Object.defineProperty(window, 'sessionStorage', { value: mockSessionStorage });

  return { mockLocalStorage, mockSessionStorage };
}

/**
 * Wait for toast notifications
 * @param type Type of toast to wait for
 */
export async function waitForToast(type: 'success' | 'error' | 'loading') {
  await waitFor(() => {
    expect(toast[type]).toHaveBeenCalled();
  });
  return toast[type];
}

/**
 * Simulate an API error response
 * @param message Error message
 * @param status HTTP status code
 */
export function simulateApiError(message: string, status = 400) {
  mockFetch({ error: { message } }, status);
}

/**
 * Helper to test data flows between components
 * Tracks changes to a value across renders
 */
export function trackRenderChanges<T>(initialValue: T) {
  const history: T[] = [initialValue];
  const trackChange = (newValue: T) => {
    history.push(newValue);
    return newValue;
  };

  return {
    trackChange,
    getHistory: () => history,
    getLastValue: () => history[history.length - 1],
  };
}

/**
 * Mock Amplify API request for testing
 */
export function mockAmplifyApi(operation: string, mockResponse: any) {
  const mockApiCall = jest.fn().mockResolvedValue(mockResponse);

  // Mock the AWS Amplify API module
  jest.mock('aws-amplify/api', () => ({
    ...jest.requireActual('aws-amplify/api'),
    get: jest.fn().mockImplementation((params) => {
      if (params.operation === operation) {
        return mockApiCall(params);
      }
      return jest.requireActual('aws-amplify/api').get(params);
    }),
    post: jest.fn().mockImplementation((params) => {
      if (params.operation === operation) {
        return mockApiCall(params);
      }
      return jest.requireActual('aws-amplify/api').post(params);
    }),
  }));

  return mockApiCall;
}

/**
 * Helper to test component transition states
 * e.g., loading -> error or loading -> success
 */
export async function testComponentStates(
  renderCallback: () => ReturnType<typeof render>,
  states: {
    initial?: (view: ReturnType<typeof render>) => void;
    loading?: (view: ReturnType<typeof render>) => void;
    error?: (view: ReturnType<typeof render>, error?: Error) => void;
    success?: (view: ReturnType<typeof render>, data?: any) => void;
  },
  setupTestCase: (simulateSuccess: () => void, simulateError: (error: Error) => void) => void
) {
  const view = renderCallback();

  // Check initial state if provided
  if (states.initial) {
    states.initial(view);
  }

  // Setup callbacks to simulate test outcomes
  const triggerSuccess: () => void = () => { };
  const triggerError: (error: Error) => void = () => { };

  // Provide these callbacks to the test case setup
  setupTestCase(
    () => triggerSuccess(),
    (error) => triggerError(error)
  );

  // Return functions to drive the test
  return {
    simulateLoading: async () => {
      if (states.loading) {
        states.loading(view);
      }
    },
    simulateSuccess: async (data?: any) => {
      triggerSuccess();
      if (states.success) {
        await waitFor(() => states.success!(view, data));
      }
    },
    simulateError: async (error: Error) => {
      triggerError(error);
      if (states.error) {
        await waitFor(() => states.error!(view, error));
      }
    },
    cleanup: () => {
      // Clean up any mocks that might have been created
      clearFetchMocks();
    },
  };
}