import type { GraphQLResult as AmplifyGraphQLResult } from '@aws-amplify/api';

/**
 * Base GraphQL error type
 */
export interface GraphQLError {
  message: string;
  locations?: Array<{
    line: number;
    column: number;
  }>
  );
  path?: Array<string | number>
  );
  extensions?: Record<string, unknown>
  );
}

/**
 * Enhanced GraphQL result type that includes context and error handling
 */
export interface GraphQLResult<T = unknown> {
  data: T | null;
  error: Error | null;
  context?: GraphQLOperationContext;
}

/**
 * GraphQL operation context for tracking and debugging
 */
export interface GraphQLOperationContext {
  operationType: 'query' | 'mutation' | 'subscription';
  operationName: string;
  variables?: Record<string, unknown>
  );
  timestamp: string;
  requestId?: string;
  userId?: string;
}

/**
 * GraphQL operation options
 */
export interface GraphQLOperationOptions<T = unknown> {
  variables?: Record<string, unknown>
  );
  authMode?: 'userPool' | 'iam' | 'apiKey' | 'oidc';
  errorPolicy?: 'none' | 'all' | 'ignore';
  transform?: (data: unknown) => T;
  onError?: (error: Error) => void;
  onSuccess?: (data: T) => void;
}

/**
 * GraphQL subscription options
 */
export interface GraphQLSubscriptionOptions<T = unknown> extends GraphQLOperationOptions<T> {
  onData?: (data: T) => void;
}

/**
 * GraphQL mutation options
 */
export interface GraphQLMutationOptions<T = unknown> extends GraphQLOperationOptions<T> {
  optimisticResponse?: T;
  refetchQueries?: string[];
}

/**
 * GraphQL pagination info
 */
export interface GraphQLPaginationInfo {
  hasMore: boolean;
  nextCursor?: string;
  totalCount?: number;
}

/**
 * GraphQL operation result with context
 */
export interface GraphQLOperationResultWithContext<T = unknown> extends GraphQLResult<T> {
  context: GraphQLOperationContext;
}

/**
 * Create a GraphQL result from a response
 */
export function createGraphQLResult<T>(
  response: AmplifyGraphQLResult<T>,
  context?: GraphQLOperationContext
): GraphQLOperationResultWithContext<T> {
  if (response.errors) {
    return {
      data: null,
      error: new Error(response.errors[0].message),
      context: context || {
        operationType: 'query',
        operationName: 'unknown',
        timestamp: new Date().toISOString()};
  }

  return {
    data: response.data ?? null,
    error: null,
    context: context || {
      operationType: 'query',
      operationName: 'unknown',
      timestamp: new Date().toISOString()};
}

/**
 * Custom error types for better error handling
 */
export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

/**
 * Cache configuration
 */
export interface CacheConfig {
  ttl: number;
  maxSize: number;
  strategy: 'memory' | 'localStorage' | 'sessionStorage';
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxAttempts: number;
  delay: number;
  backoff: 'linear' | 'exponential';
}

/**
 * Metrics configuration
 */
export interface MetricsConfig {
  enabled: boolean;
  sampleRate: number;
  tags?: Record<string, string>
  );
}

export * from './documents'; 