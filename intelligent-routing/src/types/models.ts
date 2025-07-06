// src/types/models.ts
import { PropertyStatus, PropertyType, DevelopmentStatus } from './enums';

/**
 * Complete Property model interface with all required fields
 * and support for legacy field names for backward compatibility
 */
export interface Property {
  // Core identification
  id: string;
  name: string;
  slug: string;
  title?: string; // Legacy field for backward compatibility

  // Project relationship
  projectId: string;
  projectName: string; 
  projectSlug: string;
  
  // Development relationship
  developmentId: string;
  developmentName: string;
  
  // Location information
  location?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    county?: string;
    state?: string;
    country?: string;
    postcode?: string;
    coordinates?: {
      lat?: number;
      lng?: number;
    };
  };
  
  // Unit details
  unitNumber: string;
  price: number;
  status: PropertyStatus;
  type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  
  // Size information
  floorArea: number;
  area?: number; // Legacy field for backward compatibility
  
  // Features and amenities
  features: string[];
  amenities: string[];
  
  // Media
  images: string[];
  image?: string; // Legacy field for backward compatibility
  imageUrl?: string; // For backward compatibility
  floorPlan: string;
  floorPlanUrl?: string; // Legacy field for backward compatibility
  virtualTourUrl?: string;
  
  // Description
  description: string;
  
  // Status flags
  isNew?: boolean;
  isReduced?: boolean;
  statusColor?: string;
  
  // Dates
  createdAt: string;
  updatedAt: string;
}

/**
 * Complete Development model interface with all required fields
 * and optional fields that may appear in different scenarios
 */
export interface Development {
  // Core identification
  id: string;
  name: string;
  slug: string;
  
  // Description and location
  description: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  mapLocation?: { lat: number; lng: number } | string;
  
  // Media
  image: string;
  images?: string[];
  sitePlanUrl?: string;
  brochureUrl?: string;
  virtualTourUrl?: string;
  websiteUrl?: string;
  
  // Status information
  status: DevelopmentStatus;
  statusColor: string;
  priceRange: string;
  availabilityStatus: string;
  
  // Unit information
  type?: PropertyType;
  bedrooms: number[];
  bathrooms: number | number[];
  buildingType?: string | string[];
  totalUnits: number;
  
  // Features
  developmentFeatures: string[];
  areaAmenities: string[];
  
  // Detailed specifications
  specifications?: {
    structure?: string;
    exteriorFinish?: string;
    windowsAndDoors?: string;
    heatingSystem?: string;
    energyRatingDetails?: string;
  };
  
  // Sales information
  salesAgent: { 
    name: string; 
    agency: string;
    phone?: string;
    email?: string;
    image?: string;
  };
  showingDates: string[];
  
  // Units and floor plans
  units?: Array<{
    id: string;
    name: string;
    price: number;
    status: PropertyStatus;
    type: PropertyType;
    bedrooms: number;
    bathrooms: number;
    area: number;
  }>;
  
  floorPlans?: Array<{
    id: string;
    name: string;
    image: string;
    unitType: PropertyType;
    bedrooms: number;
    bathrooms: number;
    area: number;
  }>;
  
  // Dates
  completionDate?: string;
  startDate?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Helper type for safely handling potentially undefined properties
 * Use this when accessing properties that might be missing from legacy data
 */
export type SafeProperty = Partial<Property> & Pick<Property, 'id' | 'name'>;
export type SafeDevelopment = Partial<Development> & Pick<Development, 'id' | 'name'>;

/**
 * Type guard to check if a property has all required fields
 * @param property Property to check
 * @returns Whether the property has all required fields
 */
export function isCompleteProperty(property: SafeProperty): property is Property {
  return (
    !!property.id &&
    !!property.name &&
    !!property.slug &&
    !!property.price &&
    !!property.status &&
    !!property.type &&
    !!property.bedrooms !== undefined &&
    !!property.bathrooms !== undefined &&
    !!property.developmentId &&
    !!property.developmentName
  );
}

/**
 * Type guard to check if a development has all required fields
 * @param development Development to check
 * @returns Whether the development has all required fields
 */
export function isCompleteDevelopment(development: SafeDevelopment): development is Development {
  return (
    !!development.id &&
    !!development.name &&
    !!development.slug &&
    !!development.description &&
    !!development.location &&
    !!development.status &&
    !!development.statusColor &&
    !!development.priceRange &&
    !!development.availabilityStatus &&
    !!development.bedrooms &&
    !!development.bathrooms &&
    !!development.totalUnits &&
    !!development.developmentFeatures &&
    !!development.areaAmenities &&
    !!development.salesAgent &&
    !!development.showingDates
  );
}