/**
 * API Error Types
 * 
 * This file defines standardized error types used throughout the application.
 */

import { ValidationError } from '../utils';

/**
 * Common error codes
 */
export enum ErrorCode {
  // General errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  CONFLICT = 'CONFLICT',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  
  // Authentication errors
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  MFA_REQUIRED = 'MFA_REQUIRED',
  MFA_INVALID = 'MFA_INVALID',
  PASSWORD_RESET_REQUIRED = 'PASSWORD_RESET_REQUIRED',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  
  // Data errors
  DATA_INTEGRITY_ERROR = 'DATA_INTEGRITY_ERROR',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  FOREIGN_KEY_VIOLATION = 'FOREIGN_KEY_VIOLATION',
  
  // API errors
  INVALID_QUERY_PARAMS = 'INVALID_QUERY_PARAMS',
  INVALID_REQUEST_BODY = 'INVALID_REQUEST_BODY',
  INVALID_FILTER = 'INVALID_FILTER',
  INVALID_SORT = 'INVALID_SORT',
  INVALID_PAGINATION = 'INVALID_PAGINATION',
  
  // GraphQL errors
  GRAPHQL_VALIDATION_ERROR = 'GRAPHQL_VALIDATION_ERROR',
  GRAPHQL_EXECUTION_ERROR = 'GRAPHQL_EXECUTION_ERROR',
  GRAPHQL_RESOLVER_ERROR = 'GRAPHQL_RESOLVER_ERROR',
  
  // File operations
  FILE_UPLOAD_ERROR = 'FILE_UPLOAD_ERROR',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  
  // Subscription errors
  SUBSCRIPTION_ERROR = 'SUBSCRIPTION_ERROR',
  SUBSCRIPTION_LIMIT_EXCEEDED = 'SUBSCRIPTION_LIMIT_EXCEEDED',
  
  // Resource errors
  RESOURCE_LIMIT_EXCEEDED = 'RESOURCE_LIMIT_EXCEEDED',
  RESOURCE_UNAVAILABLE = 'RESOURCE_UNAVAILABLE',
  
  // Transaction errors
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  OPTIMISTIC_LOCK_ERROR = 'OPTIMISTIC_LOCK_ERROR',
  
  // Third-party errors
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  PAYMENT_PROCESSING_ERROR = 'PAYMENT_PROCESSING_ERROR'
}

/**
 * Base API error
 */
export class ApiError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: string;
  public readonly timestamp: Date;
  public readonly validationErrors?: ValidationError[];
  public readonly requestId?: string;
  public readonly path?: string;
  
  constructor(options: {
    message: string;
    code: ErrorCode | string;
    statusCode: number;
    details?: string;
    validationErrors?: ValidationError[];
    requestId?: string;
    path?: string;
  }) {
    super(options.message);
    this.name = 'ApiError';
    this.code = options.code;
    this.statusCode = options.statusCode;
    this.details = options.details;
    this.timestamp = new Date();
    this.validationErrors = options.validationErrors;
    this.requestId = options.requestId;
    this.path = options.path;
    
    // This line is needed to ensure the inheritance chain works correctly
    Object.setPrototypeOf(this, ApiError.prototype);
  }
  
  /**
   * Convert the error to a plain object suitable for serialization
   */
  public toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: this.timestamp.toISOString(),
      validationErrors: this.validationErrors,
      requestId: this.requestId,
      path: this.path
    };
  }
}

/**
 * Validation error
 */
export class ValidationApiError extends ApiError {
  constructor(options: {
    message?: string;
    validationErrors: ValidationError[];
    requestId?: string;
    path?: string;
  }) {
    super({
      message: options.message || 'Validation failed',
      code: ErrorCode.VALIDATION_ERROR,
      statusCode: 400,
      validationErrors: options.validationErrors,
      requestId: options.requestId,
      path: options.path
    });
    this.name = 'ValidationApiError';
    
    Object.setPrototypeOf(this, ValidationApiError.prototype);
  }
}

/**
 * Not found error
 */
export class NotFoundApiError extends ApiError {
  constructor(options: {
    message?: string;
    resource?: string;
    id?: string;
    requestId?: string;
    path?: string;
  }) {
    const resource = options.resource || 'Resource';
    const id = options.id ? ` with ID '${options.id}'` : '';
    super({
      message: options.message || `${resource}${id} not found`,
      code: ErrorCode.NOT_FOUND,
      statusCode: 404,
      requestId: options.requestId,
      path: options.path
    });
    this.name = 'NotFoundApiError';
    
    Object.setPrototypeOf(this, NotFoundApiError.prototype);
  }
}

/**
 * Unauthorized error
 */
export class UnauthorizedApiError extends ApiError {
  constructor(options?: {
    message?: string;
    details?: string;
    requestId?: string;
    path?: string;
  }) {
    super({
      message: options?.message || 'Authentication is required to access this resource',
      code: ErrorCode.UNAUTHORIZED,
      statusCode: 401,
      details: options?.details,
      requestId: options?.requestId,
      path: options?.path
    });
    this.name = 'UnauthorizedApiError';
    
    Object.setPrototypeOf(this, UnauthorizedApiError.prototype);
  }
}

/**
 * Forbidden error
 */
export class ForbiddenApiError extends ApiError {
  constructor(options?: {
    message?: string;
    details?: string;
    requestId?: string;
    path?: string;
  }) {
    super({
      message: options?.message || 'You do not have permission to access this resource',
      code: ErrorCode.FORBIDDEN,
      statusCode: 403,
      details: options?.details,
      requestId: options?.requestId,
      path: options?.path
    });
    this.name = 'ForbiddenApiError';
    
    Object.setPrototypeOf(this, ForbiddenApiError.prototype);
  }
}

/**
 * GraphQL error
 */
export class GraphQLApiError extends ApiError {
  public readonly graphqlErrors: any[];
  
  constructor(options: {
    message?: string;
    graphqlErrors: any[];
    requestId?: string;
    path?: string;
  }) {
    super({
      message: options.message || 'GraphQL operation failed',
      code: ErrorCode.GRAPHQL_EXECUTION_ERROR,
      statusCode: 400,
      details: 'See graphqlErrors for details',
      requestId: options.requestId,
      path: options.path
    });
    this.name = 'GraphQLApiError';
    this.graphqlErrors = options.graphqlErrors;
    
    Object.setPrototypeOf(this, GraphQLApiError.prototype);
  }
  
  public toJSON(): Record<string, any> {
    return {
      ...super.toJSON(),
      graphqlErrors: this.graphqlErrors
    };
  }
}

/**
 * Network error
 */
export class NetworkApiError extends ApiError {
  constructor(options?: {
    message?: string;
    details?: string;
    requestId?: string;
    path?: string;
    statusCode?: number;
  }) {
    super({
      message: options?.message || 'Network error occurred',
      code: ErrorCode.SERVICE_UNAVAILABLE,
      statusCode: options?.statusCode || 503,
      details: options?.details,
      requestId: options?.requestId,
      path: options?.path
    });
    this.name = 'NetworkApiError';
    
    Object.setPrototypeOf(this, NetworkApiError.prototype);
  }
}

/**
 * Type guard to check if an error is an ApiError
 */
export function isApiError(error: any): error is ApiError {
  return error instanceof ApiError || 
    (error && typeof error === 'object' && 'code' in error && 'statusCode' in error);
}

/**
 * Type guard to check if an error is a ValidationApiError
 */
export function isValidationApiError(error: any): error is ValidationApiError {
  return isApiError(error) && error.code === ErrorCode.VALIDATION_ERROR;
}

/**
 * Type guard to check if an error is a NotFoundApiError
 */
export function isNotFoundApiError(error: any): error is NotFoundApiError {
  return isApiError(error) && error.code === ErrorCode.NOT_FOUND;
}

/**
 * Type guard to check if an error is an UnauthorizedApiError
 */
export function isUnauthorizedApiError(error: any): error is UnauthorizedApiError {
  return isApiError(error) && error.code === ErrorCode.UNAUTHORIZED;
}

/**
 * Type guard to check if an error is a ForbiddenApiError
 */
export function isForbiddenApiError(error: any): error is ForbiddenApiError {
  return isApiError(error) && error.code === ErrorCode.FORBIDDEN;
}

/**
 * Type guard to check if an error is a GraphQLApiError
 */
export function isGraphQLApiError(error: any): error is GraphQLApiError {
  return isApiError(error) && error.code === ErrorCode.GRAPHQL_EXECUTION_ERROR;
}

/**
 * Type guard to check if an error is a NetworkApiError
 */
export function isNetworkApiError(error: any): error is NetworkApiError {
  return isApiError(error) && error.code === ErrorCode.SERVICE_UNAVAILABLE;
}