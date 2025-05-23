/**
 * React Query Test Utilities
 * 
 * These utilities help with testing components that use React Query
 * for data fetching and mutations.
 */

import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// Mock query hooks
export const mockUseQuery = jest.fn().mockImplementation(() => ({
  data: null,
  isLoading: false,
  isError: false,
  error: null,
  refetch: jest.fn(),
  status: 'success'}));

export const mockUseQueryLoading = jest.fn().mockImplementation(() => ({
  data: undefined,
  isLoading: true,
  isError: false,
  error: null,
  status: 'loading',
  isFetching: true,
  refetch: jest.fn()}));

export const mockUseQueryError = jest.fn().mockImplementation(() => ({
  data: undefined,
  isLoading: false,
  isError: true,
  error: new Error('Error fetching data'),
  status: 'error',
  isFetching: false,
  refetch: jest.fn()}));

export const mockUseMutation = jest.fn().mockImplementation(() => ({
  mutate: jest.fn(),
  mutateAsync: jest.fn().mockResolvedValue({}),
  isLoading: false,
  isError: false,
  error: null,
  reset: jest.fn(),
  status: 'idle'}));

// Default mock data for common entities
export const defaultMockData = {
  users: [
    { id: 'user-1', email: 'user1@example.com', firstName: 'John', lastName: 'Doe' },
    { id: 'user-2', email: 'user2@example.com', firstName: 'Jane', lastName: 'Smith' }
  ],
  developments: [
    { 
      id: 'dev-1', 
      name: 'Riverside Manor', 
      description: 'Luxury apartments by the river',
      status: 'ACTIVE'
    },
    { 
      id: 'dev-2', 
      name: 'Mountain View', 
      description: 'Modern homes with mountain views',
      status: 'COMING_SOON'
    }
  ],
  properties: [
    { 
      id: 'prop-1', 
      developmentId: 'dev-1',
      type: 'APARTMENT',
      bedrooms: 2,
      bathrooms: 1,
      price: 350000,
      status: 'AVAILABLE'
    },
    { 
      id: 'prop-2', 
      developmentId: 'dev-1',
      type: 'APARTMENT',
      bedrooms: 3,
      bathrooms: 2,
      price: 450000,
      status: 'RESERVED'
    }
  ],
  documents: [
    {
      id: 'doc-1',
      title: 'Property Details',
      type: 'LEGAL',
      status: 'ACTIVE'
    },
    {
      id: 'doc-2',
      title: 'Contract Terms',
      type: 'LEGAL',
      status: 'ACTIVE'
    }
  ]
};

// Helper to create a fresh QueryClient for tests
export const createTestQueryClient = () => new QueryClient({ defaultOptions: { queries: {
      retry: false,
      cacheTime: 0,
      staleTime: 0,
      refetchOnWindowFocus: false},
  logger: {
    log: console.log,
    warn: console.warn,
    error: () => {}, // Silent errors during tests
  });

// Interface for the query testing options
interface QueryTestingOptions extends RenderOptions {
  queryClient?: QueryClient;
  mockData?: typeof defaultMockData;
}

// Props for the query wrapper
interface QueryWrapperProps {
  children: ReactNode;
  queryClient?: QueryClient;
}

// React Query client provider wrapper
export const QueryWrapper = ({ 
  children, 
  queryClient = createTestQueryClient() 
}: QueryWrapperProps) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

/**
 * Custom render function with React Query provider
 * @param ui - Component to render
 * @param options - Render options including QueryClient
 */
export function renderWithQueryClient(
  ui: React.ReactElement,
  options: QueryTestingOptions = {}
) {
  const { queryClient = createTestQueryClient(), ...renderOptions } = options;

  // Mock for specific data if provided
  if (options.mockData) {
    mockUseQuery.mockImplementation((queryKey) => {
      const [entityTypeparams] = Array.isArray(queryKey) ? queryKey : [queryKey];
      
      if (entityType in options.mockData) {
        const data = options.mockData[entityType as keyof typeof options.mockData];
        
        // If params has an id, filter by id
        if (params && typeof params === 'object' && 'id' in params) {
          const filteredData = Array.isArray(data) 
            ? data.find(item => item.id === params.id)
            : data;
          return {
            data: filteredData,
            isLoading: false,
            isError: false,
            error: null,
            status: 'success',
            refetch: jest.fn()};
        }
        
        return {
          data,
          isLoading: false,
          isError: false,
          error: null,
          status: 'success',
          refetch: jest.fn()};
      }
      
      return {
        data: null,
        isLoading: false,
        isError: false,
        error: null,
        status: 'success',
        refetch: jest.fn()};
    });
  }
  
  return render(
    <QueryWrapper queryClient={queryClient}>{ui}</QueryWrapper>,
    renderOptions
  );
}

// Export all utilities
export { QueryClientProvider };
export type { QueryTestingOptions, QueryWrapperProps };