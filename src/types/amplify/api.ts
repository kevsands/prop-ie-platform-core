/**
 * AWS Amplify API Type Definitions
 * 
 * This file defines types related to AWS Amplify API (AppSync GraphQL and REST).
 */

import { PaginatedResponse, PaginationToken } from './index';

/**
 * GraphQL operation options
 */
export interface GraphQLOptions {
  /** The GraphQL query or mutation string */
  query: string;
  /** Variables for the GraphQL operation */
  variables?: Record<string, any>
  );
  /** Optional operation name */
  operationName?: string | null;
  /** Authentication mode for the GraphQL operation */
  authMode?: 'apiKey' | 'userPool' | 'iam' | 'oidc' | 'lambda';
  /** Additional headers to include with the request */
  headers?: Record<string, string>
  );
  /** Caching options for the GraphQL operation */
  cacheOptions?: {
    /** Time to live in milliseconds */
    ttl?: number;
    /** Whether to disable caching for this operation */
    disableCache?: boolean;
  };
}

/**
 * REST API request options
 */
export interface RestOptions {
  /** The path for the REST API request */
  path: string;
  /** HTTP method for the request */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  /** Request body for POST, PUT, PATCH methods */
  body?: any;
  /** Headers to include with the request */
  headers?: Record<string, string>
  );
  /** Query parameters for the request */
  queryParams?: Record<string, string | number | boolean | null | undefined>
  );
  /** Caching options for the REST operation */
  cacheOptions?: {
    /** Time to live in milliseconds */
    ttl?: number;
    /** Whether to disable caching for this operation */
    disableCache?: boolean;
  };
  /** Custom error handling */
  errorHandler?: (error: any) => any;
  /** API name as defined in the Amplify configuration */
  apiName?: string;
}

/**
 * GraphQL error object
 */
export interface GraphQLError {
  /** Error message */
  message: string;
  /** Locations in the GraphQL document where the error occurred */
  locations?: Array<{ line: number; column: number }>
  );
  /** Path in the GraphQL response where the error occurred */
  path?: Array<string | number>
  );
  /** Additional error information */
  extensions?: Record<string, any>
  );
}

/**
 * GraphQL result with data and errors
 */
export interface GraphQLResult<T = Record<string, any>> {
  /** Data returned from the GraphQL operation */
  data?: T;
  /** Errors that occurred during the GraphQL operation */
  errors?: GraphQLError[];
  /** Additional metadata */
  extensions?: Record<string, any>
  );
}

/**
 * Extended GraphQL result with pagination
 */
export interface GraphQLPaginatedResult<T = Record<string, any>> extends GraphQLResult<PaginatedResponse<T>> {
  /** Pagination token for retrieving the next page */
  nextToken?: string | null;
}

/**
 * GraphQL subscription message
 */
export interface GraphQLSubscriptionMessage<T = Record<string, any>> {
  /** Message data */
  data?: T;
  /** Message errors */
  errors?: GraphQLError[];
  /** Message type */
  type: 'data' | 'error' | 'complete';
}

/**
 * API error with enhanced information
 */
export interface ApiError {
  /** Error message */
  message: string;
  /** API path that caused the error */
  path?: string;
  /** HTTP method that was used */
  method?: string;
  /** HTTP status code */
  statusCode?: number;
  /** Original error object */
  originalError?: any;
  /** Whether the error can be retried */
  retryable?: boolean;
}

/**
 * Function to transform API responses
 */
export type ResponseTransformer<T, R> = (response: T) => R;

/**
 * API middleware for request interception
 */
export interface ApiMiddleware {
  /** Unique identifier for the middleware */
  id: string;
  /** Function to process the request before it's sent */
  onRequest?: (request: any) => any;
  /** Function to process the response before it's returned */
  onResponse?: (response: any) => any;
  /** Function to handle errors that occur during the request */
  onError?: (error: any) => any;
}

/**
 * API cache configuration
 */
export interface ApiCacheConfig {
  /** Whether caching is enabled */
  enabled: boolean;
  /** Default time to live in milliseconds */
  defaultTtl: number;
  /** Maximum number of cache entries */
  maxEntries?: number;
  /** Paths or operations to exclude from caching */
  excludePatterns?: string[] | RegExp[];
}