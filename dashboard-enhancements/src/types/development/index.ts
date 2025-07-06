/**
 * Development Type Definitions
 * 
 * This file serves as the central export point for all development-related types.
 * It consolidates the types from multiple files to provide a single, consistent API.
 */

// Re-export core types
export * from './models';
export * from './responses';
export * from './filters';

// Type aliases for convenience and backward compatibility
import { 
  Development as DevelopmentModel,
  DevelopmentDetail as DevelopmentDetailModel,
  DevelopmentListItem as DevelopmentListItemModel
} from './models';

import type {
  DevelopmentFilters as DevelopmentFiltersModel
} from './filters';

// Re-export with simplified names for backward compatibility
export type Development = DevelopmentModel;
export type DevelopmentDetail = DevelopmentDetailModel;
export type DevelopmentListItem = DevelopmentListItemModel;
export type DevelopmentFilters = DevelopmentFiltersModel;