/**
 * Comprehensive React Query mock implementations for testing
 * This file provides a full set of mocks for React Query hooks and functions
 * Updated for compatibility with @tanstack/react-query
 */

import { QueryClient, QueryClientConfig } from '@tanstack/react-query';

// Mock data for different entity types
const mockUsers = [
  { id: 'user-1', email: 'user1@example.com', firstName: 'John', lastName: 'Doe' },
  { id: 'user-2', email: 'user2@example.com', firstName: 'Jane', lastName: 'Smith' }
];

const mockDevelopments = [
  { 
    id: 'dev-1', 
    name: 'Riverside Manor', 
    description: 'Luxury apartments by the river',
    status: 'ACTIVE',
    location: { address: '123 River St', city: 'Dublin', county: 'Dublin' }
  },
  { 
    id: 'dev-2', 
    name: 'Mountain View', 
    description: 'Modern homes with mountain views',
    status: 'COMING_SOON',
    location: { address: '456 Mountain Rd', city: 'Galway', county: 'Galway' }
  }
];

const mockProperties = [
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
];

const mockDocuments = [
  {
    id: 'doc-1',
    title: 'Property Details',
    type: 'LEGAL',
    status: 'ACTIVE',
    fileUrl: 'https://example.com/doc1.pdf',
    createdAt: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'doc-2',
    title: 'Contract Terms',
    type: 'LEGAL',
    status: 'ACTIVE',
    fileUrl: 'https://example.com/doc2.pdf',
    createdAt: '2025-01-02T00:00:00.000Z'
  }
];

// Function to generate mock data based on query key
const getMockDataByQueryKey = (queryKey: Array<string | object>) => {
  const [typeparams] = queryKey;
  
  // Handle common query types
  switch(type) {
    case 'users':
      if (typeof params === 'object' && params && 'id' in params) {
        return mockUsers.find(user => user.id === params.id) || null;
      }
      return mockUsers;
    
    case 'developments':
      if (typeof params === 'object' && params && 'id' in params) {
        return mockDevelopments.find(dev => dev.id === params.id) || null;
      }
      return mockDevelopments;
      
    case 'properties':
      if (typeof params === 'object' && params && 'developmentId' in params) {
        return mockProperties.filter(prop => prop.developmentId === params.developmentId);
      } else if (typeof params === 'object' && params && 'id' in params) {
        return mockProperties.find(prop => prop.id === params.id) || null;
      }
      return mockProperties;
      
    case 'documents':
      if (typeof params === 'object' && params && 'id' in params) {
        return mockDocuments.find(doc => doc.id === params.id) || null;
      }
      return mockDocuments;
      
    default:
      return [];
  }
};

// Create a mock QueryClient for testing
export const createMockQueryClient = () => new QueryClient({ defaultOptions: { queries: {
      retry: false,
      // Use new property names from @tanstack/react-query
      cacheTime: 0, // replaces cacheTime
      staleTime: 0,
      refetchOnWindowFocus: false}} as QueryClientConfig);

// Mock implementation of useQuery
export const mockUseQuery = jest.fn().mockImplementation((queryKey, queryFn, options = {}) => {
  const data = getMockDataByQueryKey(Array.isArray(queryKey) ? queryKey : [queryKey]);
  
  return {
    data,
    isLoading: false,
    isError: false,
    error: null,
    status: 'success',
    isFetching: false,
    refetch: jest.fn().mockResolvedValue({ data })};
});

// Mock implementation for different result states
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
  error: new Error('Mock error'),
  status: 'error',
  isFetching: false,
  refetch: jest.fn()}));

// Mock implementation of useMutation
export const mockUseMutation = jest.fn().mockImplementation((mutationFn, options = {}) => {
  return {
    mutate: jest.fn().mockImplementation((variables) => {
      if (options.onSuccess) {
        options.onSuccess(variables, variables, {});
      }
      return Promise.resolve(variables);
    }),
    mutateAsync: jest.fn().mockImplementation((variables) => {
      if (options.onSuccess) {
        options.onSuccess(variables, variables, {});
      }
      return Promise.resolve(variables);
    }),
    isLoading: false,
    isError: false,
    error: null,
    reset: jest.fn(),
    status: 'idle'};
});

// Mock implementation for useInfiniteQuery
export const mockUseInfiniteQuery = jest.fn().mockImplementation((queryKey) => {
  const data = getMockDataByQueryKey(Array.isArray(queryKey) ? queryKey : [queryKey]);
  
  return {
    data: {
      pages: [data],
      pageParams: [0]},
    isLoading: false,
    isError: false,
    error: null,
    status: 'success',
    isFetching: false,
    isFetchingNextPage: false,
    isFetchingPreviousPage: false,
    fetchNextPage: jest.fn().mockResolvedValue({}),
    fetchPreviousPage: jest.fn().mockResolvedValue({}),
    hasNextPage: false,
    hasPreviousPage: false};
});

// Export the mock implementation for all React Query hooks
export const reactQueryMocks = {
  QueryClient: jest.fn().mockImplementation(() => createMockQueryClient()),
  QueryClientProvider: ({ children }) => children,
  useQuery: mockUseQuery,
  useMutation: mockUseMutation,
  useInfiniteQuery: mockUseInfiniteQuery,
  // Updated for @tanstack/react-query
  useQueryClient: jest.fn().mockImplementation(() => ({
    invalidateQueries: jest.fn().mockResolvedValue({}),
    setQueryData: jest.fn(),
    getQueryData: jest.fn(),
    resetQueries: jest.fn(),
    refetchQueries: jest.fn().mockResolvedValue({}),
    removeQueries: jest.fn(),
    cancelQueries: jest.fn().mockResolvedValue({}),
    isFetching: jest.fn().mockReturnValue(0), // Returns number in v4+
    isMutating: jest.fn().mockReturnValue(0), // New in v4
    getQueriesData: jest.fn().mockReturnValue([]), // New in v4
    getMutationCache: jest.fn().mockReturnValue({
      getAll: jest.fn().mockReturnValue([])
    }),
    getQueryCache: jest.fn().mockReturnValue({
      getAll: jest.fn().mockReturnValue([])
    })}))};