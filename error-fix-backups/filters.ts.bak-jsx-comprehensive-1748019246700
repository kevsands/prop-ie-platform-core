/**
 * Development Filter Types
 * 
 * Contains interfaces for filtering developments in search/browse views.
 */

import { DevelopmentStatus } from '../enums';

/**
 * Development Filters
 * Parameters for filtering developments in search/browse views
 */
export interface DevelopmentFilters {
  location?: string;
  priceRange?: string | [number, number]; // Support both string format and numeric range
  bedrooms?: number | number[]; // Single value or array of values
  status?: string | DevelopmentStatus;
  buildingType?: string | string[]; // Single type or multiple
  completionDateFrom?: string | Date;
  completionDateTo?: string | Date;
  
  // Additional filter parameters
  developerId?: string;
  projectId?: string;
  minUnits?: number;
  maxUnits?: number;
  amenities?: string[];
  
  // Search text
  searchText?: string;
  
  // Sorting
  sortBy?: 'price' | 'date' | 'name' | 'popularity';
  sortDirection?: 'asc' | 'desc';
  
  // Pagination
  page?: number;
  limit?: number;
}