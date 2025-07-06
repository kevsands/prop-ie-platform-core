/**
 * Development API Response Types
 * 
 * Contains interfaces for API responses related to developments.
 */

import { Development } from './models';

/**
 * Base GraphQL pagination response
 */
export interface GraphQLListResponse<T> {
  items: T[];
  nextToken?: string | null;
}

/**
 * List developments response from GraphQL
 */
export interface ListDevelopmentsResponse {
  listDevelopments: GraphQLListResponse<Development> | null;
}

/**
 * Get single development response from GraphQL
 */
export interface GetDevelopmentResponse {
  getDevelopment: Development | null;
}

/**
 * REST API response for listing developments
 */
export interface DevelopmentsListResponse {
  developments: Development[];
  pagination?: {
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

/**
 * REST API response for a single development
 */
export interface DevelopmentResponse {
  development: Development;
}

/**
 * Error response format 
 */
export interface DevelopmentErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}