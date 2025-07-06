// src/types/properties.ts
// Consolidated property type definitions

import { PropertyStatus, PropertyType } from './enums';
import { Development } from './development';

/**
 * Base Property interface with required fields from your API
 */
export interface Property {
  id: string;
  name: string;
  slug: string;
  projectId: string;
  projectName: string;
  projectSlug: string;
  title?: string; // For backwards compatibility
  address?: {
    city?: string;
    state?: string;
    country?: string;
  };
  unitNumber: string;
  price: number;
  status: PropertyStatus;
  type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  floorArea: number;
  area?: number; // For backwards compatibility
  features: string[];
  amenities: string[];
  images: string[];
  image?: string; // Single image (legacy support)
  floorPlan: string;
  floorPlanUrl?: string; // For backwards compatibility
  virtualTourUrl?: string; // Optional virtual tour link
  description: string;
  isNew?: boolean;
  isReduced?: boolean;
  developmentId?: string; // Link to parent development
  developmentName?: string; // Name of the parent development
  statusColor?: string; // UI color for status badge
  createdAt: string;
  updatedAt: string;
}

/**
 * Property with additional fields specifically for detail page
 */
export interface PropertyDetail extends Property {
  // Additional fields that might be needed for the detail view
  location?: {
    lat: number;
    lng: number;
  };
  isFeatured?: boolean;
  development?: Development | {
    id: string;
    name: string;
    description?: string;
  };
}

/**
 * Property list item (used for summary views)
 */
export interface PropertyListItem {
  id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area?: number;
  image: string;
  developmentName?: string;
  status?: PropertyStatus | string;
  isNew?: boolean;
  isReduced?: boolean;
}

/**
 * Property with development data for combined views
 * @deprecated Use PropertyDetail instead with its development field
 */
export type PropertyWithDevelopment = Property & {
  development: Development;
};

/**
 * Filter interfaces for searching properties
 */
export interface PropertyFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: PropertyType;
  status?: PropertyStatus;
  developmentId?: string;
}

/**
 * API response types for GraphQL/REST
 */
export interface GraphQLListResponse<T> {
  items: T[];
  nextToken?: string | null;
}

export interface ListPropertiesResponse {
  listProperties: GraphQLListResponse<Property> | null;
}

export interface GetPropertyResponse {
  getProperty: Property | null;
}

/**
 * For property comparison feature
 */
export interface PropertyComparison {
  propertyIds: string[];
  comparisonDate: string;
  userId?: string;
}