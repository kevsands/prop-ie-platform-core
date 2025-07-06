import { act, waitFor } from '@testing-library/react';
import { useGraphQLQuery, useGraphQLMutation } from '../useGraphQL';
import { renderHookWithProviders } from '../../tests/utils/hook-test-utils';
import { createGraphQLMock } from '../../tests/utils/graphql-test-utils';
import { QueryClient } from '@tanstack/react-query';
import { server } from '../../tests/mocks/msw-setup';

// Setup TextEncoder and TextDecoder for tests
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Sample GraphQL operations
const TEST_QUERY = `
  query TestQuery($id: ID!) {
    item(id: $id) {
      id
      name
      description
    }
  }
`;

const TEST_MUTATION = `
  mutation TestMutation($input: UpdateItemInput!) {
    updateItem(input: $input) {
      id
      name
      description
    }
  }
`;

// Mock response data
const mockQueryData = {
  item: {
    id: 'test-id',
    name: 'Test Item',
    description: 'This is a test item',
  }
};

const mockMutationData = {
  updateItem: {
    id: 'test-id',
    name: 'Updated Item',
    description: 'This item has been updated',
  }
};

describe('useGraphQL Hooks', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    // Create a fresh QueryClient for each test
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          cacheTime: 0,
        },
      },
    });
    
    // Create a GraphQL mock instance
    const graphqlMock = createGraphQLMock();
    
    // Set up basic mocks for tests
    graphqlMock.mockQuery('TestQuery', { data: mockQueryData });
    graphqlMock.mockMutation('TestMutation', { data: mockMutationData });
    
    // Apply mocks to server
    graphqlMock.applyMocks();
  });

  afterEach(() => {
    // Reset all handlers
    server.resetHandlers();
  });

  describe('useGraphQLQuery', () => {
    it('should fetch data successfully', async () => {
      // Define query variables
      const variables = { id: 'test-id' };

      // Render the hook with our custom provider wrapper
      const { result } = renderHookWithProviders(
        () => useGraphQLQuery(['testQuery', variables], TEST_QUERY, variables),
        { queryClient }
      );

      // Initially, it should be loading
      expect(result.current.isLoading).toBeTruthy();

      // Wait for the query to complete
      await waitFor(() => {
        expect(result.current.isLoading).toBeFalsy();
      });

      // Verify the data is correct
      expect(result.current.data).toBeDefined();
      expect(result.current.data?.data).toEqual(mockQueryData);
      expect(result.current.error).toBeNull();
    });

    it('should handle errors properly', async () => {
      // Set up error mock for this specific test
      const graphqlMock = createGraphQLMock();
      graphqlMock.mockQueryError('TestQuery', 'Error fetching data');
      graphqlMock.applyMocks();

      // Define query variables
      const variables = { id: 'test-id' };

      // Create a mock onError callback
      const onErrorMock = jest.fn();

      // Render the hook with our custom provider wrapper and onError option
      const { result } = renderHookWithProviders(
        () => useGraphQLQuery(
          ['testQueryError', variables], 
          TEST_QUERY, 
          variables,
          { 
            retry: false, 
            onError: onErrorMock 
          }
        ),
        { queryClient }
      );

      // Wait for the query to fail
      await waitFor(() => {
        expect(result.current.isError).toBeTruthy();
      });

      // Verify the error handler was called
      expect(onErrorMock).toHaveBeenCalled();
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeDefined();
    });
  });

  describe('useGraphQLMutation', () => {
    it('should execute mutation successfully', async () => {
      // Define mutation variables
      const variables = { 
        input: { 
          id: 'test-id', 
          name: 'Updated Item',
          description: 'This item has been updated' 
        } 
      };

      // Create mock callbacks
      const onSuccessMock = jest.fn();
      const onErrorMock = jest.fn();

      // Render the hook with our custom provider wrapper
      const { result } = renderHookWithProviders(
        () => useGraphQLMutation(
          TEST_MUTATION,
          {
            onSuccess: onSuccessMock,
            onError: onErrorMock
          }
        ),
        { queryClient }
      );

      // Execute the mutation
      await act(async () => {
        await result.current.mutateAsync(variables);
      });

      // Verify the mutation was successful
      expect(onSuccessMock).toHaveBeenCalled();
      expect(onErrorMock).not.toHaveBeenCalled();
      expect(result.current.data).toBeDefined();
      expect(result.current.data?.data).toEqual(mockMutationData);
      expect(result.current.error).toBeNull();
    });

    it('should handle mutation errors', async () => {
      // Set up error mock for this specific test
      const graphqlMock = createGraphQLMock();
      graphqlMock.mockMutationError('TestMutation', 'Error updating item');
      graphqlMock.applyMocks();

      // Define mutation variables
      const variables = { 
        input: { 
          id: 'invalid-id', 
          name: 'Will Fail',
          description: 'This mutation will fail' 
        } 
      };

      // Create mock callbacks
      const onSuccessMock = jest.fn();
      const onErrorMock = jest.fn();

      // Render the hook with our custom provider wrapper
      const { result } = renderHookWithProviders(
        () => useGraphQLMutation(
          TEST_MUTATION,
          {
            onSuccess: onSuccessMock,
            onError: onErrorMock
          }
        ),
        { queryClient }
      );

      // Execute the mutation and expect it to fail
      await act(async () => {
        try {
          await result.current.mutateAsync(variables);
        } catch (error) {
          // Expected to throw
        }
      });

      // Wait for the error state
      await waitFor(() => {
        expect(result.current.isError).toBeTruthy();
      });

      // Verify the error handler was called
      expect(onSuccessMock).not.toHaveBeenCalled();
      expect(onErrorMock).toHaveBeenCalled();
      expect(result.current.error).toBeDefined();
    });
  });
});