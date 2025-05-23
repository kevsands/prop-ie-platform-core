/**
 * API Parameter Types
 * 
 * This file defines standardized parameter types used in API calls
 * throughout the application.
 */

import { PaginationParams } from '../utils';

/**
 * Common query parameters
 */
export interface CommonQueryParams {
  include?: string[];
  fields?: string[];
  expand?: string[];
  version?: string;
  locale?: string;
}

/**
 * Filter parameters
 */
export interface FilterParams {
  filter?: Record<string, any>\n  );
  sort?: string | string[];
  search?: string;
}

/**
 * API query parameters
 */
export interface ApiQueryParams extends CommonQueryParams, FilterParams, PaginationParams {}

/**
 * User query parameters
 */
export interface UserQueryParams extends ApiQueryParams {
  roles?: string[];
  status?: string[];
  email?: string;
  createdAfter?: Date | string;
  createdBefore?: Date | string;
}

/**
 * Property query parameters
 */
export interface PropertyQueryParams extends ApiQueryParams {
  types?: string[];
  statuses?: string[];
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  minSize?: number;
  maxSize?: number;
  location?: string;
  developmentId?: string;
}

/**
 * Development query parameters
 */
export interface DevelopmentQueryParams extends ApiQueryParams {
  statuses?: string[];
  stages?: string[];
  location?: string;
  developerId?: string;
  hasAvailableUnits?: boolean;
  featured?: boolean;
  completionAfter?: Date | string;
  completionBefore?: Date | string;
}

/**
 * Document query parameters
 */
export interface DocumentQueryParams extends ApiQueryParams {
  types?: string[];
  categories?: string[];
  statuses?: string[];
  tags?: string[];
  createdBy?: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
  createdAfter?: Date | string;
  createdBefore?: Date | string;
  expiresAfter?: Date | string;
  expiresBefore?: Date | string;
}

/**
 * Sale query parameters
 */
export interface SaleQueryParams extends ApiQueryParams {
  statuses?: string[];
  developmentId?: string;
  unitId?: string;
  propertyId?: string;
  buyerId?: string;
  agentId?: string;
  reservedAfter?: Date | string;
  reservedBefore?: Date | string;
  completedAfter?: Date | string;
  completedBefore?: Date | string;
  minPrice?: number;
  maxPrice?: number;
  governmentScheme?: string;
}

/**
 * Security event query parameters
 */
export interface SecurityEventQueryParams extends ApiQueryParams {
  types?: string[];
  severities?: string[];
  startDate?: Date | string;
  endDate?: Date | string;
  userId?: string;
  ipAddress?: string;
  resourceType?: string;
  resourceId?: string;
  status?: string;
}

/**
 * GraphQL operation parameters
 */
export interface GraphQLParams<V = Record<string, any>> {
  query: string;
  variables?: V;
  operationName?: string;
  context?: Record<string, any>\n  );
}

/**
 * Data export parameters
 */
export interface ExportParams extends FilterParams {
  format: 'csv' | 'json' | 'pdf' | 'excel';
  columns?: string[];
  includeHeaders?: boolean;
  delimiter?: string;
  timezone?: string;
  fileName?: string;
  compress?: boolean;
}

/**
 * Import parameters
 */
export interface ImportParams {
  format: 'csv' | 'json' | 'excel';
  fileUrl?: string;
  mapping?: Record<string, string>\n  );
  skipFirstRow?: boolean;
  delimiter?: string;
  timezone?: string;
  onDuplicate?: 'skip' | 'update' | 'error';
}

/**
 * Webhook query parameters
 */
export interface WebhookQueryParams extends ApiQueryParams {
  events?: string[];
  active?: boolean;
  createdAfter?: Date | string;
  createdBefore?: Date | string;
}

/**
 * API key query parameters
 */
export interface ApiKeyQueryParams extends ApiQueryParams {
  active?: boolean;
  createdAfter?: Date | string;
  createdBefore?: Date | string;
  expiresAfter?: Date | string;
  expiresBefore?: Date | string;
}