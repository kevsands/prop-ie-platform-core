/**
 * Development Domain Model Types
 * 
 * This file defines the core Development domain models and related types
 * that are used throughout the application.
 */

import { UserSummary } from './user';
import { PropertyLocation } from './property';

/**
 * Development status enum
 */
export enum DevelopmentStatus {
  PLANNING = 'PLANNING',
  PRE_CONSTRUCTION = 'PRE_CONSTRUCTION',
  UNDER_CONSTRUCTION = 'UNDER_CONSTRUCTION',
  PARTIALLY_COMPLETE = 'PARTIALLY_COMPLETE',
  COMPLETED = 'COMPLETED',
  SOLD_OUT = 'SOLD_OUT'
}

/**
 * Development stage enum
 */
export enum DevelopmentStage {
  CONCEPT = 'CONCEPT',
  PLANNING = 'PLANNING',
  DESIGN = 'DESIGN',
  APPROVAL = 'APPROVAL',
  CONSTRUCTION = 'CONSTRUCTION',
  HANDOVER = 'HANDOVER',
  COMPLETED = 'COMPLETED'
}

/**
 * Development amenity interface
 */
export interface DevelopmentAmenity {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  category?: string;
}

/**
 * Development image interface
 */
export interface DevelopmentImage {
  id: string;
  url: string;
  title?: string;
  description?: string;
  type: 'EXTERIOR' | 'INTERIOR' | 'SITE_PLAN' | 'BROCHURE' | 'LOGO' | 'OTHER';
  isPrimary: boolean;
  order: number;
}

/**
 * Development document interface
 */
export interface DevelopmentDocument {
  id: string;
  title: string;
  description?: string;
  url: string;
  type: 'BROCHURE' | 'FLOORPLAN' | 'PLANNING' | 'LEGAL' | 'OTHER';
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Development phase interface
 */
export interface DevelopmentPhase {
  id: string;
  name: string;
  description?: string;
  status: DevelopmentStatus;
  startDate?: Date;
  estimatedCompletionDate?: Date;
  actualCompletionDate?: Date;
  totalUnits: number;
  availableUnits: number;
  order: number;
}

/**
 * Development financial information
 */
export interface DevelopmentFinancials {
  startingPrice: number;
  currency: string;
  averagePrice?: number;
  maxPrice?: number;
  depositPercentage: number;
  estimatedServiceCharge?: number;
  reservationFee?: number;
  governmentSchemes?: string[];
  investmentInfo?: Record<string, any>
  );
}

/**
 * Core Development interface
 */
export interface Development {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  description: string;
  status: DevelopmentStatus;
  stage: DevelopmentStage;
  location: PropertyLocation;
  startDate?: Date;
  estimatedCompletionDate?: Date;
  actualCompletionDate?: Date;
  totalUnits: number;
  availableUnits: number;
  soldUnits: number;
  reservedUnits: number;
  amenities: DevelopmentAmenity[];
  images: DevelopmentImage[];
  documents: DevelopmentDocument[];
  phases?: DevelopmentPhase[];
  financials: DevelopmentFinancials;
  developerId: string;
  developer?: UserSummary;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  isPublished: boolean;
  metadata?: Record<string, any>
  );
  tags?: string[];
  featured: boolean;
}

/**
 * Development summary for listing views
 */
export interface DevelopmentSummary {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  status: DevelopmentStatus;
  location: {
    city: string;
    county: string;
  };
  primaryImage?: string;
  totalUnits: number;
  availableUnits: number;
  startingPrice: number;
  currency: string;
  estimatedCompletionDate?: Date;
  featured: boolean;
}

/**
 * Development creation request
 */
export interface CreateDevelopmentRequest {
  name: string;
  tagline?: string;
  description: string;
  status: DevelopmentStatus;
  stage: DevelopmentStage;
  location: PropertyLocation;
  startDate?: Date;
  estimatedCompletionDate?: Date;
  totalUnits: number;
  amenities: DevelopmentAmenity[];
  financials: DevelopmentFinancials;
  developerId: string;
  isPublished?: boolean;
  tags?: string[];
  featured?: boolean;
}

/**
 * Development update request
 */
export interface UpdateDevelopmentRequest {
  name?: string;
  tagline?: string;
  description?: string;
  status?: DevelopmentStatus;
  stage?: DevelopmentStage;
  location?: Partial<PropertyLocation>
  );
  startDate?: Date;
  estimatedCompletionDate?: Date;
  actualCompletionDate?: Date;
  totalUnits?: number;
  amenities?: DevelopmentAmenity[];
  financials?: Partial<DevelopmentFinancials>
  );
  developerId?: string;
  isPublished?: boolean;
  tags?: string[];
  featured?: boolean;
}

/**
 * Development search parameters
 */
export interface DevelopmentSearchParams {
  keyword?: string;
  location?: string;
  status?: DevelopmentStatus[];
  stage?: DevelopmentStage[];
  minUnits?: number;
  maxUnits?: number;
  minPrice?: number;
  maxPrice?: number;
  developerId?: string;
  featured?: boolean;
  hasAvailableUnits?: boolean;
  completionDateFrom?: Date;
  completionDateTo?: Date;
  sortBy?: 'name' | 'price' | 'completionDate' | 'availableUnits';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Type guard to check if a value is a valid Development
 */
export function isDevelopment(value: any): value is Development {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.slug === 'string' &&
    typeof value.description === 'string' &&
    typeof value.status === 'string' &&
    typeof value.stage === 'string' &&
    value.location &&
    typeof value.totalUnits === 'number' &&
    typeof value.availableUnits === 'number' &&
    Array.isArray(value.amenities) &&
    Array.isArray(value.images) &&
    Array.isArray(value.documents) &&
    value.financials &&
    typeof value.developerId === 'string'
  );
}

/**
 * Type assertion function to ensure a value is a Development
 * @throws {Error} If the value is not a valid Development
 */
export function assertDevelopment(value: any): asserts value is Development {
  if (!isDevelopment(value)) {
    throw new Error('Value is not a valid Development');
  }
}