// src/types/properties.d.ts
import { PropertyStatus, PropertyType } from './enums';
import { Development } from './development';

export type {
  Property,
  PropertyDetail,
  PropertyListItem,
  PropertyWithDevelopment,
  PropertyFilters,
  PropertyComparison,
  GraphQLListResponse,
  ListPropertiesResponse,
  GetPropertyResponse
} from './properties';

/**
 * Legacy Property interface - use the imported types from properties.ts instead
 * @deprecated Use imports from './properties' instead
 */
export interface LegacyProperty {
    id: string;
    name: string; // e.g., '3 Bed Semi-Detached', 'Apartment 203'
    slug: string; // URL friendly identifier
  
    projectId: string; // Link back to the parent development
    projectName: string; // Development name (for easy access)
    projectSlug: string; // Development slug (for linking)
  
    address: string; // Full address
    unitNumber?: string; // Specific unit number if applicable
  
    price: number;
    status: PropertyStatus | string; // Property-specific status
    type: PropertyType | string; // Property type
  
    bedrooms: number;
    bathrooms: number;
    parkingSpaces?: number;
    floorArea: number; // Floor area in square meters or feet
  
    features?: string[]; // Specific features of this unit (e.g., 'South Facing Garden', 'Integrated Appliances')
    amenities?: string[]; // Amenities specific to this unit (e.g., 'Private Balcony')
  
    images: string[]; // Array of paths to images in public folder
    floorPlan?: string; // Path to floor plan image in public folder
    virtualTourUrl?: string; // External URL for this specific unit's virtual tour
  
    // Optional flags for display (e.g., on listings)
    isNew?: boolean; // Recently listed
    isReduced?: boolean; // Price reduction
  
    // Timestamps
    createdAt: string;
    updatedAt: string;
}

/**
 * Legacy interface for filters - use PropertyFilters from properties.ts instead
 * @deprecated Use PropertyFilters from './properties' instead
 */
export interface LegacyPropertyFilters {
    location?: string; // Filter by development location or general area
    minBedrooms?: number;
    maxBedrooms?: number;
    minPrice?: number;
    maxPrice?: number;
    status?: PropertyStatus | string; // Filter by property status
    type?: PropertyType | string; // Filter by property type
    projectId?: string; // Filter by parent development
}