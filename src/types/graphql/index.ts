import type { AppError } from '../common';

/**
 * GraphQL error location
 */
export interface GraphQLErrorLocation {
  line: number;
  column: number;
}

/**
 * GraphQL error
 */
export interface GraphQLError {
  message: string;
  locations?: GraphQLErrorLocation[];
  path?: string[];
  extensions?: Record<string, unknown>
  );
}

/**
 * GraphQL response wrapper
 */
export interface GraphQLResponse<T = unknown> {
  data: T | null;
  errors?: GraphQLError[];
}

/**
 * GraphQL operation result
 */
export interface GraphQLResult<T = unknown> {
  data: T | null;
  error: AppError | null;
}

/**
 * GraphQL operation options
 */
export interface GraphQLOperationOptions {
  /** Whether to throw on error */
  throwOnError?: boolean;
  /** Custom error handler */
  onError?: (error: AppError) => void;
  /** Custom success handler */
  onSuccess?: (data: unknown) => void;
}

/**
 * GraphQL metadata for entities
 */
export interface GraphQLMetadata {
  /** GraphQL type name */
  __typename?: string;
  /** GraphQL field selection */
  __selection?: string[];
  /** GraphQL field arguments */
  __args?: Record<string, unknown>
  );
}

/**
 * GraphQL pagination info
 */
export interface GraphQLPaginationInfo {
  /** Whether there are more items */
  hasMore: boolean;
  /** Cursor for the next page */
  nextCursor?: string;
  /** Total count of items */
  totalCount?: number;
}

/**
 * GraphQL connection edge
 */
export interface GraphQLEdge<T> {
  /** Node data */
  node: T;
  /** Edge cursor */
  cursor: string;
}

/**
 * GraphQL connection
 */
export interface GraphQLConnection<T> {
  /** Connection edges */
  edges: GraphQLEdge<T>[];
  /** Page info */
  pageInfo: GraphQLPaginationInfo;
}

/**
 * GraphQL operation context
 */
export interface GraphQLOperationContext {
  /** Operation name */
  operationName?: string;
  /** Operation type (query/mutation) */
  operationType: 'query' | 'mutation';
  /** Variables used in the operation */
  variables?: Record<string, unknown>
  );
  /** Timestamp of the operation */
  timestamp: string;
  /** User ID if authenticated */
  userId?: string;
}

/**
 * GraphQL operation result with context
 */
export interface GraphQLOperationResultWithContext<T = unknown> extends GraphQLResult<T> {
  /** Operation context */
  context: GraphQLOperationContext;
}

/**
 * GraphQL error handler options
 */
export interface GraphQLErrorHandlerOptions {
  /** Whether to include stack trace */
  includeStack?: boolean;
  /** Whether to include operation context */
  includeContext?: boolean;
  /** Custom error formatter */
  formatError?: (error: GraphQLError) => AppError;
}

/**
 * GraphQL error handler
 */
export class GraphQLErrorHandler {
  private options: GraphQLErrorHandlerOptions;

  constructor(options: GraphQLErrorHandlerOptions = {}) {
    this.options = {
      includeStack: process.env.NODE_ENV === 'development',
      includeContext: true,
      ...options};
  }

  /**
   * Format a GraphQL error into an AppError
   */
  formatError(error: GraphQLError, context?: GraphQLOperationContext): AppError {
    const { formatError } = this.options;
    if (formatError) {
      return formatError(error);
    }

    return {
      code: 'GRAPHQL_ERROR',
      message: error.message,
      details: {
        locations: error.locations,
        path: error.path,
        extensions: error.extensions,
        ...(this.options.includeContext && context ? { context } : {})},
      ...(this.options.includeStack ? { stack: new Error().stack } : {})};
  }

  /**
   * Handle GraphQL errors
   */
  handleErrors(errors: GraphQLError[], context?: GraphQLOperationContext): AppError {
    if (errors.length === 1) {
      return this.formatError(errors[0], context);
    }

    return {
      code: 'GRAPHQL_MULTIPLE_ERRORS',
      message: 'Multiple GraphQL errors occurred',
      details: {
        errors: errors.map(error => this.formatError(errorcontext)),
        ...(this.options.includeContext && context ? { context } : {})},
      ...(this.options.includeStack ? { stack: new Error().stack } : {})};
  }
}

/**
 * Create a GraphQL result from a response
 */
export function createGraphQLResult<T>(
  response: GraphQLResponse<T>,
  context?: GraphQLOperationContext,
  errorHandler = new GraphQLErrorHandler()
): GraphQLOperationResultWithContext<T> {
  if (response.errors) {
    return {
      data: null,
      error: errorHandler.handleErrors(response.errorscontext),
      context: context || {
        operationType: 'query',
        timestamp: new Date().toISOString()};
  }

  return {
    data: response.data,
    error: null,
    context: context || {
      operationType: 'query',
      timestamp: new Date().toISOString()};
} 