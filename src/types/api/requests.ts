/**
 * API Request Types
 * 
 * This file defines standardized request types used in API calls
 * throughout the application.
 */

import { PaginationParams } from '../utils';

/**
 * Base request interface with authentication token
 */
export interface BaseRequest {
  authToken?: string;
}

/**
 * Paginated request interface
 */
export interface PaginatedRequest extends BaseRequest, PaginationParams {}

/**
 * Generic filter request interface
 */
export interface FilterRequest<T> extends PaginatedRequest {
  filters: T;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * GraphQL operation options
 */
export interface GraphQLOperationOptions {
  fetchPolicy?: 'cache-first' | 'network-only' | 'cache-only' | 'no-cache';
  errorPolicy?: 'none' | 'ignore' | 'all';
  context?: Record<string, any>
  );
  notifyOnNetworkStatusChange?: boolean;
  pollInterval?: number;
  clientId?: string;
  authMode?: 'userPool' | 'apiKey' | 'iam' | 'oidc';
}

/**
 * GraphQL query request
 */
export interface GraphQLQueryRequest<V = Record<string, any>> extends GraphQLOperationOptions {
  query: string;
  variables?: V;
}

/**
 * GraphQL mutation request
 */
export interface GraphQLMutationRequest<V = Record<string, any>> extends GraphQLOperationOptions {
  mutation: string;
  variables?: V;
  optimisticResponse?: Record<string, any>
  );
  refetchQueries?: string[];
}

/**
 * GraphQL subscription request
 */
export interface GraphQLSubscriptionRequest<V = Record<string, any>> extends GraphQLOperationOptions {
  subscription: string;
  variables?: V;
}

/**
 * File upload request
 */
export interface FileUploadRequest extends BaseRequest {
  file: File;
  contentType?: string;
  fileName?: string;
  path?: string;
  metadata?: Record<string, any>
  );
  public?: boolean;
}

/**
 * Batch operation request
 */
export interface BatchOperationRequest<T> extends BaseRequest {
  operations: T[];
  continueOnError?: boolean;
}

/**
 * Search request
 */
export interface SearchRequest extends PaginatedRequest {
  query: string;
  fields?: string[];
  filters?: Record<string, any>
  );
  facets?: string[];
}

/**
 * API key request
 */
export interface ApiKeyRequest extends BaseRequest {
  name: string;
  expiresIn?: number;
  permissions?: string[];
}

/**
 * Authentication request
 */
export interface AuthRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Multi-factor authentication request
 */
export interface MfaRequest {
  username: string;
  session: string;
  code: string;
  method: 'SMS' | 'EMAIL' | 'TOTP';
}

/**
 * Password reset request
 */
export interface PasswordResetRequest {
  username: string;
  code?: string;
  newPassword?: string;
}

/**
 * Registration request
 */
export interface RegistrationRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  userType?: string;
  metadata?: Record<string, any>
  );
}

/**
 * Webhook registration request
 */
export interface WebhookRegistrationRequest extends BaseRequest {
  url: string;
  events: string[];
  description?: string;
  secret?: string;
  active?: boolean;
}