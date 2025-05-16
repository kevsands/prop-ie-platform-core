/**
 * Property Domain Model Types
 * 
 * This file defines the core Property domain models and related types
 * that are used throughout the application.
 */

import { Development } from './development';
import { User, UserSummary } from './user';

/**
 * Property status enum
 */
export enum PropertyStatus {
  UPCOMING = 'UPCOMING',
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  SOLD = 'SOLD',
  UNDER_CONSTRUCTION = 'UNDER_CONSTRUCTION',
  COMPLETED = 'COMPLETED'
}

/**
 * Property type enum
 */
export enum PropertyType {
  HOUSE = 'HOUSE',
  APARTMENT = 'APARTMENT',
  DUPLEX = 'DUPLEX',
  PENTHOUSE = 'PENTHOUSE',
  VILLA = 'VILLA',
  TOWNHOUSE = 'TOWNHOUSE',
  STUDIO = 'STUDIO'
}

/**
 * Property feature type
 */
export interface PropertyFeature {
  name: string;
  value: string | number | boolean;
  category?: string;
  icon?: string;
}

/**
 * Property location type
 */
export interface PropertyLocation {
  address: string;
  city: string;
  county: string;
  postcode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Property image type
 */
export interface PropertyImage {
  id: string;
  url: string;
  title?: string;
  description?: string;
  isPrimary: boolean;
  order: number;
  type: 'EXTERIOR' | 'INTERIOR' | 'FLOORPLAN' | 'SITE_PLAN' | 'OTHER';
}

/**
 * Property financial details
 */
export interface PropertyFinancials {
  price: number;
  currency: string;
  deposit: number;
  monthlyPayment?: number;
  estimatedTotalCost?: number;
  stampDuty?: number;
  maintenanceFees?: number;
  rentalYield?: number;
  investmentDetails?: Record<string, any>;
}

/**
 * Core Property interface
 */
export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  squareMeters: number;
  features: PropertyFeature[];
  images: PropertyImage[];
  location: PropertyLocation;
  financials: PropertyFinancials;
  developmentId?: string;
  development?: Development;
  agentId?: string;
  agent?: UserSummary;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  isPublished: boolean;
  metadata?: Record<string, any>;
}

/**
 * Property summary for listing views
 */
export interface PropertySummary {
  id: string;
  title: string;
  type: PropertyType;
  status: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  squareMeters: number;
  primaryImage?: string;
  location: {
    city: string;
    county: string;
  };
  price: number;
  currency: string;
  developmentName?: string;
}

/**
 * Property creation request
 */
export interface CreatePropertyRequest {
  title: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  squareMeters: number;
  features: PropertyFeature[];
  location: PropertyLocation;
  financials: PropertyFinancials;
  developmentId?: string;
  agentId?: string;
  isPublished?: boolean;
}

/**
 * Property update request
 */
export interface UpdatePropertyRequest {
  title?: string;
  description?: string;
  type?: PropertyType;
  status?: PropertyStatus;
  bedrooms?: number;
  bathrooms?: number;
  squareMeters?: number;
  features?: PropertyFeature[];
  location?: Partial<PropertyLocation>;
  financials?: Partial<PropertyFinancials>;
  developmentId?: string;
  agentId?: string;
  isPublished?: boolean;
}

/**
 * Property search parameters
 */
export interface PropertySearchParams {
  keyword?: string;
  location?: string;
  propertyType?: PropertyType[];
  status?: PropertyStatus[];
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  minSquareMeters?: number;
  maxSquareMeters?: number;
  developmentId?: string;
  sortBy?: 'price' | 'date' | 'bedrooms' | 'squareMeters';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Type guard to check if a value is a valid Property
 */
export function isProperty(value: any): value is Property {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.type === 'string' &&
    typeof value.status === 'string' &&
    typeof value.bedrooms === 'number' &&
    typeof value.bathrooms === 'number' &&
    typeof value.squareMeters === 'number' &&
    Array.isArray(value.features) &&
    Array.isArray(value.images) &&
    value.location &&
    value.financials
  );
}

/**
 * Type assertion function to ensure a value is a Property
 * @throws {Error} If the value is not a valid Property
 */
export function assertProperty(value: any): asserts value is Property {
  if (!isProperty(value)) {
    throw new Error('Value is not a valid Property');
  }
}