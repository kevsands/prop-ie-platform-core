/**
 * AWS Amplify Type Definitions
 * 
 * This file provides centralized type definitions for AWS Amplify services
 * to ensure consistency across the application.
 */

// Re-export all sub-module types
export * from './auth';
export * from './api';
export * from './storage';
export * from './config';

/**
 * Common AWS Amplify response types
 */

/**
 * Error response shape from AWS Amplify operations
 */
export interface AmplifyErrorResponse {
  message: string;
  code?: string;
  name?: string;
  statusCode?: number;
  retryable?: boolean;
}

/**
 * Pagination token structure for paginated responses
 */
export interface PaginationToken {
  nextToken?: string | null;
  startKey?: string | null;
  page?: number;
  limit?: number;
  totalItems?: number;
  totalPages?: number;
}

/**
 * Generic paginated response structure
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination?: PaginationToken;
}

/**
 * AWS service regions
 */
export type AWSRegion = 
  'us-east-1' | 'us-east-2' | 'us-west-1' | 'us-west-2' | 
  'eu-west-1' | 'eu-west-2' | 'eu-west-3' | 'eu-central-1' | 
  'ap-northeast-1' | 'ap-northeast-2' | 'ap-southeast-1' | 'ap-southeast-2' |
  'ap-south-1' | 'sa-east-1' | 'ca-central-1';

/**
 * Common initialization options for AWS Amplify modules
 */
export interface AmplifyInitOptions {
  /** Whether to configure for server-side rendering */
  ssr?: boolean;
  /** Enable debug mode with additional logging */
  debug?: boolean;
  /** Additional client-specific options */
  [key: string]: any;
}

/**
 * Authentication state that can be tracked across the application
 */
export enum AuthState {
  /** Initial state before auth status is determined */
  INITIALIZING = 'INITIALIZING',
  /** User is signed in and authenticated */
  SIGNED_IN = 'SIGNED_IN',
  /** User is not signed in */
  SIGNED_OUT = 'SIGNED_OUT',
  /** User needs to complete additional auth steps (MFA, etc.) */
  CONFIRMATION_NEEDED = 'CONFIRMATION_NEEDED',
  /** User's sign-in session is expired */
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  /** Auth operation failed */
  ERROR = 'ERROR'
}

/**
 * Amplify platform capabilities for feature detection
 */
export interface AmplifyCapabilities {
  /** Whether Auth features are available */
  auth: boolean;
  /** Whether API features are available */
  api: boolean;
  /** Whether Storage features are available */
  storage: boolean;
  /** Whether the platform supports local storage */
  localStorage: boolean;
  /** Whether offline capabilities are available */
  offline: boolean;
}

/**
 * Standard response structure for Amplify operations
 */
export interface AmplifyResponse<T> {
  /** The operation was successful */
  success: boolean;
  /** The data returned from the operation */
  data?: T;
  /** Error information if the operation failed */
  error?: AmplifyErrorResponse;
  /** Metadata about the operation */
  meta?: {
    /** Operation timestamp */
    timestamp: number;
    /** Request ID for tracing */
    requestId?: string;
    /** Cache status for the request */
    cached?: boolean;
  };
}