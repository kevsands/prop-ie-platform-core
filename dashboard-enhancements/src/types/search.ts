// src/types/search.ts
// Types for search functionality

import { PropertyStatus, PropertyType } from './enums';

/**
 * Search parameters for property search functionality
 */
export interface PropertySearchParams {
  query?: string;
  projectSlug?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  type?: PropertyType[];
  status?: PropertyStatus[];
  sort?: string;
  page?: number;
  limit?: number;
}

/**
 * Response format for property listings with pagination
 */
export interface PropertyListResponse {
  properties: any[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}