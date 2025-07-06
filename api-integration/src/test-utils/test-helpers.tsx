/**
 * Enhanced Test Utilities for Next.js App Router
 */

import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from 'next-themes';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  initialRouterState?: {
    pathname?: string;
    searchParams?: URLSearchParams;
    params?: Record<string, string>;
  };
  authState?: {
    isAuthenticated?: boolean;
    user?: any;
    loading?: boolean;
  };
  queryClient?: QueryClient;
}

// Create a custom render function that includes all providers
export function renderWithProviders(
  ui: React.ReactElement,
  {
    initialRouterState = {},
    authState = { isAuthenticated: false, user: null, loading: false },
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, staleTime: 0 },
        mutations: { retry: false },
      },
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  // Mock the router state
  jest.mocked(require('next/navigation').usePathname).mockReturnValue(
    initialRouterState.pathname || '/'
  );
  jest.mocked(require('next/navigation').useSearchParams).mockReturnValue(
    initialRouterState.searchParams || new URLSearchParams()
  );
  jest.mocked(require('next/navigation').useParams).mockReturnValue(
    initialRouterState.params || {}
  );

  function AllTheProviders({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <TooltipProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: AllTheProviders, ...renderOptions });
}

// Helper for creating mock API responses
export function createMockApiResponse<T>(data: T, options: Partial<Response> = {}) {
  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: new Headers(),
    json: async () => data,
    text: async () => JSON.stringify(data),
    blob: async () => new Blob([JSON.stringify(data)], { type: 'application/json' }),
    clone: jest.fn(),
    ...options,
  } as Response;
}

// Helper for waiting for async operations
export const waitForAsync = (ms: number = 0) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Mock authentication hook for tests
export const createMockAuthHook = (overrides = {}) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  signIn: jest.fn(),
  signOut: jest.fn(),
  signUp: jest.fn(),
  updateProfile: jest.fn(),
  hasRole: jest.fn(),
  hasPermission: jest.fn(),
  checkSecurityLevel: jest.fn(),
  mfaEnabled: false,
  ...overrides,
});

// Helper for creating mock router
export const createMockRouter = (overrides = {}) => ({
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  prefetch: jest.fn(),
  refresh: jest.fn(),
  pathname: '/',
  searchParams: new URLSearchParams(),
  params: {},
  ...overrides,
});

// Mock data factories
export const createMockUser = (overrides = {}) => ({
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  role: 'BUYER',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const createMockProperty = (overrides = {}) => ({
  id: 'property-123',
  name: 'Test Property',
  address: '123 Test Street',
  price: 500000,
  bedrooms: 3,
  bathrooms: 2,
  size: 150,
  type: 'HOUSE',
  status: 'AVAILABLE',
  images: [],
  features: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const createMockDevelopment = (overrides = {}) => ({
  id: 'development-123',
  name: 'Test Development',
  location: 'Test City',
  developer: 'Test Developer',
  units: [],
  totalUnits: 100,
  availableUnits: 50,
  minPrice: 250000,
  maxPrice: 750000,
  status: 'ACTIVE',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

// Re-export commonly used testing utilities
export * from '@testing-library/react';
export { userEvent } from '@testing-library/user-event';