/**
 * Unit Domain Model Types
 * 
 * This file defines the core Unit domain models and related types
 * that are used throughout the application.
 */

import { Development } from './development';
import { Property, PropertyStatus, PropertyType } from './property';

/**
 * Unit type enum (extends property type with more specific options)
 */
export enum UnitType {
  // Basic property types
  HOUSE = 'HOUSE',
  APARTMENT = 'APARTMENT',
  DUPLEX = 'DUPLEX',
  PENTHOUSE = 'PENTHOUSE',
  VILLA = 'VILLA',
  TOWNHOUSE = 'TOWNHOUSE',
  STUDIO = 'STUDIO',
  
  // More specific unit types
  ONE_BED = 'ONE_BED',
  TWO_BED = 'TWO_BED',
  THREE_BED = 'THREE_BED',
  FOUR_BED = 'FOUR_BED',
  FIVE_BED_PLUS = 'FIVE_BED_PLUS',
  MAISONETTE = 'MAISONETTE',
  GROUND_FLOOR = 'GROUND_FLOOR',
  TOP_FLOOR = 'TOP_FLOOR',
  MID_FLOOR = 'MID_FLOOR'
}

/**
 * Unit position within a development
 */
export interface UnitPosition {
  block?: string;
  floor?: number;
  unitNumber: string;
  section?: string;
  phase?: string;
}

/**
 * Unit specification (details about finishes and features)
 */
export interface UnitSpecification {
  kitchenSpec?: string;
  bathroomSpec?: string;
  flooringType?: string;
  heatingSystem?: string;
  windowType?: string;
  energyRating?: string;
  smartFeatures?: string[];
  parkingSpaces?: number;
  storageUnits?: number;
  privateOutdoorSpace?: boolean;
  outdoorSpaceArea?: number;
  ceilingHeight?: number;
  customFeatures?: Record<string, any>\n  );
}

/**
 * Customization option for a unit
 */
export interface CustomizationOption {
  id: string;
  category: string;
  name: string;
  description?: string;
  price: number;
  isStandard: boolean;
  leadTime?: number;
  availableUntilStage?: string;
  imageUrl?: string;
  metadata?: Record<string, any>\n  );
}

/**
 * Unit customization selections
 */
export interface UnitCustomization {
  unitId: string;
  options: Array<{
    optionId: string;
    selected: boolean;
    selectedAt?: Date;
    selectedBy?: string;
  }>\n  );
  totalCustomizationCost: number;
  lastUpdated: Date;
}

/**
 * Core Unit interface
 */
export interface Unit {
  id: string;
  name: string;
  propertyId: string;
  property?: Property;
  developmentId: string;
  development?: Development;
  type: UnitType;
  status: PropertyStatus;
  position: UnitPosition;
  bedrooms: number;
  bathrooms: number;
  squareMeters: number;
  floorPlanUrl?: string;
  virtualTourUrl?: string;
  model3dUrl?: string;
  price: number;
  currency: string;
  specification: UnitSpecification;
  availableCustomizations?: CustomizationOption[];
  selectedCustomizations?: UnitCustomization;
  completionDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  isShowUnit: boolean;
  metadata?: Record<string, any>\n  );
}

/**
 * Unit summary for listing views
 */
export interface UnitSummary {
  id: string;
  name: string;
  type: UnitType;
  status: PropertyStatus;
  position: {
    block?: string;
    floor?: number;
    unitNumber: string;
  };
  bedrooms: number;
  bathrooms: number;
  squareMeters: number;
  price: number;
  currency: string;
  developmentName: string;
  developmentId: string;
  floorPlanUrl?: string;
}

/**
 * Unit creation request
 */
export interface CreateUnitRequest {
  name: string;
  propertyId?: string;
  developmentId: string;
  type: UnitType;
  status: PropertyStatus;
  position: UnitPosition;
  bedrooms: number;
  bathrooms: number;
  squareMeters: number;
  floorPlanUrl?: string;
  virtualTourUrl?: string;
  model3dUrl?: string;
  price: number;
  currency: string;
  specification: UnitSpecification;
  availableCustomizations?: CustomizationOption[];
  completionDate?: Date;
  isShowUnit?: boolean;
  metadata?: Record<string, any>\n  );
}

/**
 * Unit update request
 */
export interface UpdateUnitRequest {
  name?: string;
  propertyId?: string;
  type?: UnitType;
  status?: PropertyStatus;
  position?: Partial<UnitPosition>\n  );
  bedrooms?: number;
  bathrooms?: number;
  squareMeters?: number;
  floorPlanUrl?: string;
  virtualTourUrl?: string;
  model3dUrl?: string;
  price?: number;
  currency?: string;
  specification?: Partial<UnitSpecification>\n  );
  availableCustomizations?: CustomizationOption[];
  completionDate?: Date;
  isShowUnit?: boolean;
  metadata?: Record<string, any>\n  );
}

/**
 * Unit customization update request
 */
export interface UpdateUnitCustomizationRequest {
  unitId: string;
  options: Array<{
    optionId: string;
    selected: boolean;
  }>\n  );
}

/**
 * Unit search parameters
 */
export interface UnitSearchParams {
  keyword?: string;
  developmentId?: string;
  type?: UnitType[];
  status?: PropertyStatus[];
  block?: string;
  floor?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minSquareMeters?: number;
  maxSquareMeters?: number;
  minPrice?: number;
  maxPrice?: number;
  completionDateFrom?: Date;
  completionDateTo?: Date;
  isShowUnit?: boolean;
  sortBy?: 'name' | 'price' | 'bedrooms' | 'squareMeters' | 'completionDate';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Type guard to check if a value is a valid Unit
 */
export function isUnit(value: any): value is Unit {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.developmentId === 'string' &&
    typeof value.type === 'string' &&
    typeof value.status === 'string' &&
    value.position &&
    typeof value.position.unitNumber === 'string' &&
    typeof value.bedrooms === 'number' &&
    typeof value.bathrooms === 'number' &&
    typeof value.squareMeters === 'number' &&
    typeof value.price === 'number' &&
    typeof value.currency === 'string' &&
    value.specification
  );
}

/**
 * Type assertion function to ensure a value is a Unit
 * @throws {Error} If the value is not a valid Unit
 */
export function assertUnit(value: any): asserts value is Unit {
  if (!isUnit(value)) {
    throw new Error('Value is not a valid Unit');
  }
}