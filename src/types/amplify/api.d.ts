/**
 * Custom type definitions for AWS Amplify API
 * Provides compatibility between our code and Amplify v6
 */

// Import types from aws-amplify/api
import type { 
  GraphQLResult, 
  GraphQLOptions, 
  GraphQLOperation 
} from 'aws-amplify/api';

// Extended GraphQL result to ensure presence of data and errors fields
export interface EnhancedGraphQLResult<T = any> extends GraphQLResult<T> {
  data?: T;
  errors?: any[];
}

// GraphQL options with extended properties for Amplify v6
export interface EnhancedGraphQLOptions<T = object> extends GraphQLOptions {
  headers?: Record<string, string>;
  authMode?: 'API_KEY' | 'AWS_IAM' | 'AMAZON_COGNITO_USER_POOLS' | 'OPENID_CONNECT';
  authToken?: string;
  config?: any;
}

// API client configuration options
export interface APIClientOptions {
  baseUrl?: string;
  apiKey?: string;
  headers?: Record<string, string>;
  withCredentials?: boolean;
}

// REST API options
export interface RESTOptions {
  path: string;
  headers?: Record<string, string>;
  queryParams?: Record<string, string | number | boolean | null>;
  body?: any;
  response?: boolean;
  init?: RequestInit;
  authMode?: 'API_KEY' | 'AWS_IAM' | 'AMAZON_COGNITO_USER_POOLS' | 'OPENID_CONNECT';
}

// Extends the GraphQL operation type
export interface EnhancedGraphQLOperation<T = object> extends GraphQLOperation {
  // Add any additional properties you need
}

// Type helper for API client generation
export type APIClientGenerator<T> = {
  (): T;
}