import { graphql } from 'msw';
import { server } from './hook-test-utils';
import { GraphQLOperations, GraphQLQueryResponses, GraphQLMutationResponses } from '../mocks/graphql-operations';

/**
 * Sets up mock handlers for GraphQL operations
 */
export function setupGraphQLOperationMocks() {
  // Create mock handlers array
  const handlers = [
    // Query handlers
    ...Object.keys(GraphQLQueryResponses).map(operation => {
      return graphql.query(operation, (req: NextApiRequest, res: NextApiResponse, ctx: any) => {
        // Check if the mock is a function (parameterized) or a static object
        const mockValue = typeof GraphQLQueryResponses[operation] === 'function'
          ? GraphQLQueryResponses[operation](req.variables?.id || req.variables?.documentId)
          : GraphQLQueryResponses[operation];
          
        return res(ctx.data(mockValue));
      });
    }),
    
    // Mutation handlers
    ...Object.keys(GraphQLMutationResponses).map(operation => {
      return graphql.mutation(operation, (req: NextApiRequest, res: NextApiResponse, ctx: any) => {
        // Check if the mock is a function (parameterized) or a static object
        const mockValue = typeof GraphQLMutationResponses[operation] === 'function'
          ? GraphQLMutationResponses[operation](req.variables)
          : GraphQLMutationResponses[operation];
          
        return res(ctx.data(mockValue));
      });
    })];
  
  // Apply all handlers to the server
  server.use(...handlers);
  
  return handlers;
}

/**
 * Sets up a mock for a specific GraphQL query
 */
export function mockGraphQLQuery(operation: string, mockData: any) {
  const handler = graphql.query(operation, (req: NextApiRequest, res: NextApiResponse, ctx: any) => {
    return res(ctx.data(mockData));
  });
  
  server.use(handler);
  
  return handler;
}

/**
 * Sets up a mock for a specific GraphQL query with error
 */
export function mockGraphQLQueryError(operation: string, errorMessage: string, errorCode = 'ERROR') {
  const handler = graphql.query(operation, (req: NextApiRequest, res: NextApiResponse, ctx: any) => {
    return res(
      ctx.errors([
        {
          message: errorMessage,
          extensions: { code: errorCode }])
    );
  });
  
  server.use(handler);
  
  return handler;
}

/**
 * Sets up a mock for a specific GraphQL mutation
 */
export function mockGraphQLMutation(operation: string, mockData: any) {
  const handler = graphql.mutation(operation, (req: NextApiRequest, res: NextApiResponse, ctx: any) => {
    return res(ctx.data(mockData));
  });
  
  server.use(handler);
  
  return handler;
}

/**
 * Sets up a mock for a specific GraphQL mutation with error
 */
export function mockGraphQLMutationError(operation: string, errorMessage: string, errorCode = 'ERROR') {
  const handler = graphql.mutation(operation, (req: NextApiRequest, res: NextApiResponse, ctx: any) => {
    return res(
      ctx.errors([
        {
          message: errorMessage,
          extensions: { code: errorCode }])
    );
  });
  
  server.use(handler);
  
  return handler;
}

/**
 * Presets to mock common scenarios
 */
export const mockPresets = {
  // Preset for authentication errors
  authenticationError: () => {
    const handlers = Object.keys(GraphQLOperations).map(operation => {
      if (operation.startsWith('Get')) {
        return mockGraphQLQueryError(
          GraphQLOperations[operation], 
          'User is not authenticated',
          'UNAUTHENTICATED'
        );
      } else {
        return mockGraphQLMutationError(
          GraphQLOperations[operation], 
          'User is not authenticated',
          'UNAUTHENTICATED'
        );
      }
    });
    
    return handlers;
  },
  
  // Preset for permission errors
  permissionError: () => {
    const handlers = Object.keys(GraphQLOperations).map(operation => {
      if (operation.startsWith('Get')) {
        return mockGraphQLQueryError(
          GraphQLOperations[operation], 
          'User does not have permission to perform this action',
          'FORBIDDEN'
        );
      } else {
        return mockGraphQLMutationError(
          GraphQLOperations[operation], 
          'User does not have permission to perform this action',
          'FORBIDDEN'
        );
      }
    });
    
    return handlers;
  },
  
  // Preset for server errors
  serverError: () => {
    const handlers = Object.keys(GraphQLOperations).map(operation => {
      if (operation.startsWith('Get')) {
        return mockGraphQLQueryError(
          GraphQLOperations[operation], 
          'Internal server error',
          'INTERNAL_SERVER_ERROR'
        );
      } else {
        return mockGraphQLMutationError(
          GraphQLOperations[operation], 
          'Internal server error',
          'INTERNAL_SERVER_ERROR'
        );
      }
    });
    
    return handlers;
  },
  
  // Preset for validation errors
  validationError: () => {
    const handlers = Object.keys(GraphQLOperations).filter(op => !op.startsWith('Get')).map(operation => {
      return mockGraphQLMutationError(
        GraphQLOperations[operation], 
        'Validation failed for input data',
        'BAD_USER_INPUT'
      );
    });
    
    return handlers;
  };