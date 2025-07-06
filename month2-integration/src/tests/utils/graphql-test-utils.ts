import { graphql, HttpResponse } from 'msw';
import { server } from '../mocks/msw-setup';

/**
 * GraphQL mock response builder
 */
export class GraphQLMock {
  private server = server;
  private handlers: ReturnType<typeof graphql.query | typeof graphql.mutation>[] = [];

  /**
   * Mock a GraphQL query with a specific response
   */
  public mockQuery<TData, TVariables = Record<string, any>>(
    operationName: string,
    mockData: TData,
    mockVariables?: (variables: TVariables) => boolean
  ) {
    const handler = graphql.query(operationName, ({ variables }) => {
      if (mockVariables && !mockVariables(variables as TVariables)) {
        return HttpResponse.json({
          errors: [
            {
              message: 'Variables did not match expectations',
              extensions: { code: 'VARIABLES_MISMATCH' },
            },
          ]
        }, { status: 400 });
      }
      
      return HttpResponse.json({ data: mockData });
    });
    
    this.handlers.push(handler);
    return this;
  }

  /**
   * Mock a GraphQL query with a specific error response
   */
  public mockQueryError(
    operationName: string,
    errorMessage: string,
    errorCode: string = 'ERROR',
    statusCode: number = 400
  ) {
    const handler = graphql.query(operationName, () => {
      return HttpResponse.json({
        errors: [
          {
            message: errorMessage,
            extensions: { code: errorCode },
          },
        ]
      }, { status: statusCode });
    });
    
    this.handlers.push(handler);
    return this;
  }

  /**
   * Mock a GraphQL mutation with a specific response
   */
  public mockMutation<TData, TVariables = Record<string, any>>(
    operationName: string,
    mockData: TData,
    mockVariables?: (variables: TVariables) => boolean
  ) {
    const handler = graphql.mutation(operationName, ({ variables }) => {
      if (mockVariables && !mockVariables(variables as TVariables)) {
        return HttpResponse.json({
          errors: [
            {
              message: 'Variables did not match expectations',
              extensions: { code: 'VARIABLES_MISMATCH' },
            },
          ]
        }, { status: 400 });
      }
      
      return HttpResponse.json({ data: mockData });
    });
    
    this.handlers.push(handler);
    return this;
  }

  /**
   * Mock a GraphQL mutation with a specific error response
   */
  public mockMutationError(
    operationName: string,
    errorMessage: string,
    errorCode: string = 'ERROR',
    statusCode: number = 400
  ) {
    const handler = graphql.mutation(operationName, () => {
      return HttpResponse.json({
        errors: [
          {
            message: errorMessage,
            extensions: { code: errorCode },
          },
        ]
      }, { status: statusCode });
    });
    
    this.handlers.push(handler);
    return this;
  }

  /**
   * Apply all registered handlers to the MSW server
   */
  public applyMocks() {
    this.server.use(...this.handlers);
    return this;
  }

  /**
   * Reset all handlers and clear mocks
   */
  public reset() {
    this.handlers = [];
    this.server.resetHandlers();
    return this;
  }
}

/**
 * Create a new GraphQL mock instance
 */
export function createGraphQLMock() {
  return new GraphQLMock();
}

/**
 * Mock AWS Amplify GraphQL client
 */
export const mockAmplifyGraphQL = {
  graphql: jest.fn(),
};

/**
 * Setup AWS Amplify GraphQL client mock
 */
export function setupAmplifyMock() {
  jest.mock('aws-amplify/api', () => ({
    generateClient: jest.fn(() => ({
      graphql: mockAmplifyGraphQL.graphql,
    })),
  }));
}

/**
 * Reset AWS Amplify GraphQL client mock
 */
export function resetAmplifyMock() {
  mockAmplifyGraphQL.graphql.mockReset();
}

/**
 * Mock successful GraphQL response for Amplify
 */
export function mockAmplifyGraphQLSuccess<TData>(data: TData) {
  mockAmplifyGraphQL.graphql.mockResolvedValue({ data });
  return mockAmplifyGraphQL;
}

/**
 * Mock failed GraphQL response for Amplify
 */
export function mockAmplifyGraphQLError(
  errorMessage: string,
  errorType: string = 'GraphQLError',
  errorCode: string = 'ERROR'
) {
  mockAmplifyGraphQL.graphql.mockRejectedValue({
    errors: [
      {
        message: errorMessage,
        errorType,
        extensions: { code: errorCode },
      },
    ],
  });
  return mockAmplifyGraphQL;
}