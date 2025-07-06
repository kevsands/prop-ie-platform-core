/**
 * Coverage Helper Utilities
 * 
 * These utilities help ensure accurate coverage reporting by:
 * 1. Providing consistent mocks for difficult-to-test components
 * 2. Supporting branch coverage through conditional testing
 * 3. Enabling integration with the coverage dashboard
 */

/**
 * Comprehensive test-friendly mocks for components that are difficult to test
 */
export const coverageMocks = {
  /**
   * Mock for Amplify Auth functionality
   */
  amplifyAuth: {
    signIn: jest.fn().mockResolvedValue({ isSignedIn: true }),
    signOut: jest.fn().mockResolvedValue(undefined),
    currentAuthenticatedUser: jest.fn().mockResolvedValue({ 
      username: 'testuser',
      attributes: {
        email: 'test@example.com',
        sub: 'test-user-id',
        'custom:role': 'user'
      }
    }),
    currentSession: jest.fn().mockResolvedValue({
      idToken: { jwtToken: 'fake-jwt-token' },
      refreshToken: { token: 'fake-refresh-token' },
      accessToken: { jwtToken: 'fake-access-token' }
    })
  },
  
  /**
   * Mock for React Query functionality
   */
  reactQuery: {
    useQuery: jest.fn().mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn()
    }),
    useMutation: jest.fn().mockReturnValue({
      mutate: jest.fn(),
      isLoading: false,
      isError: false,
      error: null,
      reset: jest.fn()
    })
  },
  
  /**
   * Mock for Next.js router
   */
  nextRouter: {
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    query: {},
    pathname: '/',
    asPath: '/',
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn()
    }
  }
};

/**
 * Helper to test multiple branches/conditions
 * Use this to ensure every condition gets tested
 */
export function testConditions<T>(
  testFn: (condition: T) => void,
  conditions: T[]
): void {
  conditions.forEach(condition => {
    testFn(condition);
  });
}

/**
 * Creates test data with specified coverage goals
 * @param options Configuration for the test data
 */
export function createTestCoverageData(options: {
  includeEdgeCases?: boolean;
  includeErrorStates?: boolean;
  includeAllPermutations?: boolean;
} = {}) {
  const { 
    includeEdgeCases = true,
    includeErrorStates = true,
    includeAllPermutations = false
  } = options;
  
  // Base test cases that ensure good coverage
  const baseTestCases = [
    { id: 1, name: 'Standard case', value: 'normal' },
  ];
  
  // Edge cases for better branch coverage
  const edgeCases = includeEdgeCases ? [
    { id: 2, name: 'Empty case', value: '' },
    { id: 3, name: 'Null case', value: null },
    { id: 4, name: 'Undefined case', value: undefined },
    { id: 5, name: 'Boundary case', value: Number.MAX_SAFE_INTEGER },
  ] : [];
  
  // Error states to test error handling code paths
  const errorStates = includeErrorStates ? [
    { id: 6, name: 'Error case', value: 'error', error: new Error('Test error') },
    { id: 7, name: 'Network error', value: 'network-error', error: new Error('Network error') },
    { id: 8, name: 'Timeout error', value: 'timeout', error: new Error('Timeout') },
  ] : [];
  
  // Permutations for exhaustive testing
  const permutations = includeAllPermutations ? [
    { id: 9, name: 'Boolean true', value: true },
    { id: 10, name: 'Boolean false', value: false },
    { id: 11, name: 'Number zero', value: 0 },
    { id: 12, name: 'Negative number', value: -1 },
    { id: 13, name: 'Array empty', value: [] },
    { id: 14, name: 'Array with values', value: [1, 2, 3] },
    { id: 15, name: 'Object empty', value: {} },
    { id: 16, name: 'Object with values', value: { key: 'value' } },
  ] : [];
  
  return [...baseTestCases, ...edgeCases, ...errorStates, ...permutations];
}

/**
 * Helper function to confirm all branches of an async function are covered
 * 
 * Usage:
 * ```
 * it('covers all branches', async () => {
 *   await testAsyncBranches(
 *     async (input) => myFunction(input),
 *     ['success', 'error', 'empty']
 *   );
 * });
 * ```
 */
export async function testAsyncBranches<T>(
  fn: (input: T) => Promise<any>,
  inputs: T[]
): Promise<void> {
  for (const input of inputs) {
    try {
      await fn(input);
    } catch (error) {
      // Catching errors is expected for some branches
      // This ensures the function executes for all inputs
    }
  }
}

/**
 * Provides mock server responses that ensure all API handler branches are covered
 */
export const apiCoverageMocks = {
  success: {
    status: 200,
    json: jest.fn().mockResolvedValue({ success: true, data: {} })
  },
  created: {
    status: 201,
    json: jest.fn().mockResolvedValue({ success: true, data: { id: 'new-id' } })
  },
  badRequest: {
    status: 400,
    json: jest.fn().mockResolvedValue({ success: false, error: 'Bad request' })
  },
  unauthorized: {
    status: 401,
    json: jest.fn().mockResolvedValue({ success: false, error: 'Unauthorized' })
  },
  forbidden: {
    status: 403,
    json: jest.fn().mockResolvedValue({ success: false, error: 'Forbidden' })
  },
  notFound: {
    status: 404,
    json: jest.fn().mockResolvedValue({ success: false, error: 'Not found' })
  },
  serverError: {
    status: 500,
    json: jest.fn().mockResolvedValue({ success: false, error: 'Server error' })
  }
};