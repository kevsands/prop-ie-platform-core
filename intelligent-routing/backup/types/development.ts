// src/types/development.ts
// Consolidated development type definitions

import { DevelopmentStatus } from './enums';

/**
 * Development Interface
 * Represents a real estate development/project that contains multiple properties
 */
export interface Development {
  id: string;
  name: string;
  slug?: string;
  description: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  image: string;
  images?: string[]; // Multiple images
  status: string | DevelopmentStatus;
  statusColor: string;
  priceRange: string;
  availabilityStatus: string;
  bedrooms: number[];
  bathrooms: number;
  buildingType: string;
  totalUnits: number;
  brochureUrl: string;
  virtualTourUrl: string;
  developmentFeatures: string[];
  areaAmenities: string[];
  salesAgent: { 
    name: string; 
    agency: string;
    phone?: string;
    email?: string;
  };
  showingDates: string[];
  completionDate?: string;
  startDate?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Development List Item
 * Simplified development object for list views
 */
export interface DevelopmentListItem {
  id: string;
  name: string;
  slug?: string;
  location: string;
  image: string;
  status: string | DevelopmentStatus;
  statusColor: string;
  priceRange: string;
  bedrooms: number[];
  completionDate?: string;
}

/**
 * Development Detail
 * Extended development object with additional data for detail views
 */
export interface DevelopmentDetail extends Development {
  propertyCount?: number;
  availableUnits?: number;
  constructionProgress?: number;
  developer?: {
    id: string;
    name: string;
    logo?: string;
  };
  nearbyPlaces?: Array<{
    name: string;
    type: string;
    distance: string;
  }>;
  similarDevelopments?: DevelopmentListItem[];
}

/**
 * Development Filters
 * Parameters for filtering developments in search/browse views
 */
export interface DevelopmentFilters {
  location?: string;
  priceRange?: string;
  bedrooms?: number;
  status?: string | DevelopmentStatus;
  buildingType?: string;
  completionDateFrom?: string;
  completionDateTo?: string;
}

/**
 * GraphQL Development Responses
 */
export interface GraphQLListResponse<T> {
  items: T[];
  nextToken?: string | null;
}

export interface ListDevelopmentsResponse {
  listDevelopments: GraphQLListResponse<Development> | null;
}

export interface GetDevelopmentResponse {
  getDevelopment: Development | null;
}