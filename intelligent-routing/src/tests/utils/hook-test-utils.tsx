import React, { ReactElement } from 'react';
import { render, RenderOptions, RenderResult, renderHook as rtlRenderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';

// Set up request mocking
import { http, graphql, HttpResponse } from 'msw';
import { server } from '../mocks/msw-setup';

/**
 * Creates a new QueryClient for tests
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
        staleTime: 0,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
      mutations: {
        retry: false,
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {}, // Silent error logs in tests
    },
  });
}

/**
 * Testing wrapper that includes necessary providers
 */
interface TestProvidersProps {
  children: React.ReactNode;
  queryClient?: QueryClient;
}

export function TestProviders({
  children,
  queryClient = createTestQueryClient(),
}: TestProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

/**
 * Custom render function for components that includes all providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    queryClient?: QueryClient;
  },
): RenderResult {
  const { queryClient, ...renderOptions } = options || {};
  
  return render(ui, {
    wrapper: ({ children }) => (
      <TestProviders queryClient={queryClient}>
        {children}
      </TestProviders>
    ),
    ...renderOptions,
  });
}

/**
 * Custom renderHook function that includes all providers
 */
export function renderHookWithProviders<TProps, TResult>(
  hook: (props: TProps) => TResult,
  options?: Omit<any, 'wrapper'> & {
    queryClient?: QueryClient;
  },
) {
  const { queryClient, ...renderOptions } = options || {};
  
  return rtlRenderHook(hook, {
    wrapper: ({ children }) => (
      <TestProviders queryClient={queryClient}>
        {children}
      </TestProviders>
    ),
    ...renderOptions,
  });
}

/**
 * GraphQL response utility for creating mock responses
 */
export function createGraphQLResponse<T>(data: T, errors?: any[]) {
  return {
    data,
    errors,
  };
}

/**
 * Set up MSW GraphQL handlers
 */
export function setupGraphQLHandlers(handlers: ReturnType<typeof graphql.query | typeof graphql.mutation>[]) {
  server.use(...handlers);
}

/**
 * Create a GraphQL query handler
 */
export function createGraphQLQueryHandler<TData, TVariables = Record<string, any>>(
  operationName: string,
  resolver: (variables: TVariables) => TData,
) {
  return graphql.query(operationName, ({ variables }) => {
    const data = resolver(variables as TVariables);
    return HttpResponse.json({
      data,
    });
  });
}

/**
 * Create a GraphQL mutation handler
 */
export function createGraphQLMutationHandler<TData, TVariables = Record<string, any>>(
  operationName: string,
  resolver: (variables: TVariables) => TData,
) {
  return graphql.mutation(operationName, ({ variables }) => {
    const data = resolver(variables as TVariables);
    return HttpResponse.json({
      data,
    });
  });
}

/**
 * Clean up functions for tests
 */
export function cleanupTestEnvironment() {
  server.resetHandlers();
}

// Re-export everything from testing-library
export * from '@testing-library/react';