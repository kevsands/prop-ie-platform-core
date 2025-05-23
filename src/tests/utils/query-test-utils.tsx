/**
 * React Query Test Utilities
 * 
 * This file provides helper functions for testing components that use React Query.
 * Updated for compatibility with @tanstack/react-query v4
 */

import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider, QueryClientConfig } from '@tanstack/react-query';
import { createMockQueryClient } from '../mocks/react-query-mock';

// Create a wrapper with QueryClientProvider for testing components
interface QueryTestingOptions extends RenderOptions {
  queryClient?: QueryClient;
  // Add additional providers if needed for app-specific context
  withProviders?: boolean;
}

interface WrapperProps {
  children: React.ReactNode;
  queryClient?: QueryClient;
}

// Component wrapper with React Query client provider
export const QueryWrapper = ({ 
  children, 
  queryClient = createMockQueryClient() 
}: WrapperProps) => {
  // Ensure we have a fresh QueryClient for tests
  React.useEffect(() => {
    return () => {
      queryClient.clear(); // Clean up after test
    };
  }, [queryClient]);
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

// Custom render function with React Query provider
export function renderWithQueryClient(
  ui: React.ReactElement,
  options: QueryTestingOptions = {}
) {
  const { 
    queryClient = createMockQueryClient(), 
    withProviders = false, 
    ...renderOptions 
  } = options;
  
  // Create a wrapper that includes all necessary providers
  const AllProviders = ({ children }: { children: React.ReactNode }) => (
    <QueryWrapper queryClient={queryClient}>
      {children}
    </QueryWrapper>
  );
  
  return {
    ...render(ui, { 
      wrapper: AllProviders, 
      ...renderOptions 
    }),
    // Return the QueryClient instance for direct manipulation in tests
    queryClient
  };
}

// Helper for creating a queryKey factory
export const createQueryKeyFactory = (prefix: string) => {
  return {
    all: () => [prefix],
    lists: () => [prefix, 'list'],
    list: (filters?: Record<string, any>) => [prefix, 'list', filters],
    details: () => [prefix, 'detail'],
    detail: (id: string) => [prefix, 'detail', id]};
};

// Re-export everything from testing-library
export * from '@testing-library/react';