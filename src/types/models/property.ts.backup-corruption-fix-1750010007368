// Comprehensive Property Types and Interfaces
import { PropertyStatus, PropertyType } from '../enums';

// Main Property Interface
export interface Property {
  id: string;
  developmentId?: string;
  development?: Development;
  unitNumber: string;
  name: string;
  type: PropertyType;
  size: number;
  bedrooms: number;
  bathrooms: number;
  price: number;
  originalPrice?: number;
  status: PropertyStatus;
  features: string[];
  images: PropertyImage[];
  floorPlans: string[];
  virtualTourUrl?: string;
  description?: string;
  specifications?: PropertySpecifications;
  location: PropertyLocation;
  amenities: string[];
  availability: PropertyAvailability;
  customizationOptions?: CustomizationOption[];
  energyRating?: string;
  berNumber?: string;
  propertyTax?: number;
  managementFee?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyImage {
  id: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
  order: number;
  width?: number;
  height?: number;
  thumbnailUrl?: string;
}

export interface PropertySpecifications {
  internalArea?: number;
  externalArea?: number;
  totalArea: number;
  floors?: number;
  parkingSpaces?: number;
  orientation?: string;
  yearBuilt?: number;
  heatingType?: string;
  coolingType?: string;
  windowType?: string;
  insulation?: string;
  constructionType?: string;
  foundation?: string;
  roofType?: string;
  exteriorFinish?: string;
}

export interface PropertyLocation {
  address: string;
  addressLine2?: string;
  city: string;
  county: string;
  postcode?: string;
  country?: string;
  latitude: number;
  longitude: number;
  neighborhood?: string;
  nearbyAmenities?: NearbyAmenity[];
  transportLinks?: TransportLink[];
}

export interface NearbyAmenity {
  type: AmenityType;
  name: string;
  distance: number;
  walkingTime?: number;
  drivingTime?: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface TransportLink {
  type: 'bus' | 'train' | 'luas' | 'dart' | 'airport';
  name: string;
  lines?: string[];
  distance: number;
  walkingTime?: number;
}

export type AmenityType = 
  | 'school'
  | 'hospital'
  | 'shopping'
  | 'restaurant'
  | 'park'
  | 'gym'
  | 'supermarket'
  | 'pharmacy'
  | 'bank'
  | 'cinema'
  | 'library'
  | 'transport';

export interface PropertyAvailability {
  isAvailable: boolean;
  availableFrom?: Date;
  moveInDate?: Date;
  reservationDeadline?: Date;
  viewingSlots?: ViewingSlot[];
}

export interface ViewingSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  isBooked: boolean;
  bookedBy?: string;
}

export interface CustomizationOption {
  id: string;
  category: CustomizationCategory;
  name: string;
  description?: string;
  price: number;
  images?: string[];
  isStandard?: boolean;
  leadTime?: number;
  supplier?: string;
}

export type CustomizationCategory = 
  | 'flooring'
  | 'kitchen'
  | 'bathroom'
  | 'fixtures'
  | 'paint'
  | 'appliances'
  | 'lighting'
  | 'storage'
  | 'technology';

export interface Development {
  id: string;
  name: string;
  slug: string;
  developer: Developer;
  location: string;
  totalUnits: number;
  availableUnits: number;
  completionDate?: Date;
  description?: string;
  masterplanImage?: string;
  amenities?: string[];
  specifications?: DevelopmentSpecifications;
}

export interface Developer {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  description?: string;
  establishedYear?: number;
  completedProjects?: number;
}

export interface DevelopmentSpecifications {
  totalArea?: number;
  greenSpaces?: number;
  parkingSpaces?: number;
  communityAmenities?: string[];
  securityFeatures?: string[];
  sustainabilityFeatures?: string[];
}

// API Request/Response Types
export interface PropertyFilters {
  search?: string;
  type?: PropertyType[];
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number[];
  bathrooms?: number[];
  minSize?: number;
  maxSize?: number;
  location?: string[];
  amenities?: string[];
  status?: PropertyStatus[];
  features?: string[];
  developmentId?: string;
  hasVirtualTour?: boolean;
  hasParking?: boolean;
  sortBy?: PropertySortOption;
  sortOrder?: 'asc' | 'desc';
}

export type PropertySortOption = 
  | 'price'
  | 'size'
  | 'bedrooms'
  | 'newest'
  | 'oldest'
  | 'name'
  | 'availability';

export interface PropertyListResponse {
  properties: Property[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  filters: PropertyFilters;
  aggregations?: PropertyAggregations;
}

export interface PropertyAggregations {
  priceRange: {
    min: number;
    max: number;
    avg: number;
  };
  sizeRange: {
    min: number;
    max: number;
    avg: number;
  };
  typeCounts: Record<PropertyType, number>\n  );
  statusCounts: Record<PropertyStatus, number>\n  );
  bedroomCounts: Record<number, number>\n  );
  locationCounts: Record<string, number>\n  );
}

// Property Actions
export interface PropertyReservation {
  propertyId: string;
  userId: string;
  reservationDate: Date;
  expiryDate: Date;
  depositAmount?: number;
  status: 'pending' | 'confirmed' | 'expired' | 'cancelled';
}

export interface PropertyInquiry {
  propertyId: string;
  userId: string;
  message: string;
  contactPreference: 'email' | 'phone' | 'both';
  preferredContactTime?: string;
  createdAt: Date;
}

// Helper Types
export interface PropertySearchParams {
  q?: string;
  filters?: PropertyFilters;
  page?: number;
  limit?: number;
  view?: 'grid' | 'list' | 'map';
}

export interface PropertyMapMarker {
  id: string;
  position: {
    lat: number;
    lng: number;
  };
  property: {
    name: string;
    price: number;
    type: PropertyType;
    bedrooms: number;
    image?: string;
  };
}

// Validation schemas
export interface PropertyValidation {
  isValid: boolean;
  errors?: {
    field: string;
    message: string;
  }[];
}

// Analytics
export interface PropertyAnalytics {
  propertyId: string;
  views: number;
  inquiries: number;
  reservations: number;
  averageViewTime: number;
  popularFeatures: string[];
  conversionRate: number;
}