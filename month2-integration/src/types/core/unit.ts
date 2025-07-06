/**
 * PropIE Core Data Model - Unit
 * Defines units within a development and customization options
 */

import { Document } from '../document';
import { Development } from './development';

/**
 * Main Unit interface
 * Represents a property unit within a development
 */
export interface Unit {
  id: string;
  development: Development;
  name: string;
  type: UnitType;
  
  // Basic specifications
  size: number; // in square meters
  bedrooms: number;
  bathrooms: number;
  floors: number;
  parkingSpaces: number;
  
  // Pricing and status
  basePrice: number;
  status: UnitStatus;
  
  // Features and specifications
  berRating: BERRating;
  features: string[];
  customizationOptions: CustomizationOption[];
  
  // Media
  primaryImage: string;
  images: string[];
  floorplans: string[];
  virtualTourUrl?: string;
  
  // Additional details
  unitNumber?: string;
  block?: string;
  floor?: number;
  aspect?: string; // e.g., 'North-facing'
  outdoorSpace?: OutdoorSpace[];
  rooms?: Room[];
  availableFrom?: Date;
  reservationEndDate?: Date;
  lastViewed?: Date;
  viewCount?: number;
  updatedAt?: Date;
  slug?: string;
}

/**
 * Unit Type enum
 * Type of property unit
 */
export enum UnitType {
  APARTMENT = 'apartment',
  DUPLEX = 'duplex',
  SEMI_DETACHED = 'semi_detached',
  DETACHED = 'detached',
  TERRACED = 'terraced',
  PENTHOUSE = 'penthouse',
  COMMERCIAL = 'commercial',
  RETAIL = 'retail',
  OFFICE = 'office'
}

/**
 * Unit Status enum
 * Current status of a unit in terms of availability
 */
export enum UnitStatus {
  PLANNED = 'planned',
  UNDER_CONSTRUCTION = 'under_construction',
  COMPLETE = 'complete',
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  SALE_AGREED = 'sale_agreed',
  SOLD = 'sold',
  OCCUPIED = 'occupied'
}

/**
 * BER Rating enum
 * Building Energy Rating values
 */
export enum BERRating {
  A1 = 'A1',
  A2 = 'A2',
  A3 = 'A3',
  B1 = 'B1',
  B2 = 'B2',
  B3 = 'B3',
  C1 = 'C1',
  C2 = 'C2',
  C3 = 'C3',
  D1 = 'D1',
  D2 = 'D2',
  E1 = 'E1',
  E2 = 'E2',
  F = 'F',
  G = 'G'
}

/**
 * Outdoor Space interface
 * Details of outdoor spaces associated with a unit
 */
export interface OutdoorSpace {
  type: OutdoorSpaceType;
  size: number; // in square meters
  orientation?: string; // e.g., 'South'
  description?: string;
  features?: string[];
  images?: string[];
}

/**
 * Outdoor Space Type enum
 * Types of outdoor spaces
 */
export enum OutdoorSpaceType {
  BALCONY = 'balcony',
  TERRACE = 'terrace',
  GARDEN = 'garden',
  PATIO = 'patio',
  ROOF_TERRACE = 'roof_terrace',
  YARD = 'yard'
}

/**
 * Room interface
 * Details of rooms within a unit
 */
export interface Room {
  name: string;
  type: RoomType;
  size: number; // in square meters
  length?: number; // in meters
  width?: number; // in meters
  features?: string[];
  images?: string[];
}

/**
 * Room Type enum
 * Types of rooms
 */
export enum RoomType {
  LIVING_ROOM = 'living_room',
  KITCHEN = 'kitchen',
  DINING_ROOM = 'dining_room',
  BEDROOM = 'bedroom',
  BATHROOM = 'bathroom',
  EN_SUITE = 'en_suite',
  STUDY = 'study',
  UTILITY = 'utility',
  HALL = 'hall',
  LANDING = 'landing',
  STORAGE = 'storage',
  OTHER = 'other'
}

/**
 * Customization Option interface
 * Options for customizing a unit
 */
export interface CustomizationOption {
  id: string;
  category: CustomizationCategory;
  name: string;
  description: string;
  baseOption: boolean;
  additionalCost: number;
  images: string[];
  modelPath?: string;
  installationTimeframe?: number; // in days
  supplierInfo?: SupplierInfo;
  availableTo?: UnitType[];
  alternatives?: string[]; // IDs of alternative options
  requiredOptions?: string[]; // IDs of options that must be selected with this
  incompatibleOptions?: string[]; // IDs of options that cannot be selected with this
  specificationDetails?: string;
  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
    weight?: number;
  };
  technicalRequirements?: string;
  maintenanceInfo?: string;
  warrantyPeriod?: number; // in months
}

/**
 * Customization Category enum
 * Categories of customization options
 */
export enum CustomizationCategory {
  KITCHEN = 'kitchen',
  BATHROOM = 'bathroom',
  FLOORING = 'flooring',
  DOORS = 'doors',
  WINDOWS = 'windows',
  PAINT = 'paint',
  ELECTRICAL = 'electrical',
  HEATING = 'heating',
  STORAGE = 'storage',
  FIXTURES = 'fixtures',
  EXTERIOR = 'exterior',
  SMART_HOME = 'smart_home',
  APPLIANCES = 'appliances',
  LIGHTING = 'lighting',
  OTHER = 'other'
}

/**
 * Supplier Info interface
 * Information about a supplier of customization options
 */
export interface SupplierInfo {
  name: string;
  contact?: string;
  leadTime?: number; // in days
  guaranteePeriod?: number; // in months
  catalogueUrl?: string;
}

/**
 * Customization Selection interface
 * Selected customization options for a specific unit
 */
export interface CustomizationSelection {
  id: string;
  unit: Unit;
  buyer: string; // User ID
  status: CustomizationStatus;
  selections: SelectedOption[];
  totalCost: number;
  notes?: string;
  submittedDate?: Date;
  approvedDate?: Date;
  deadlineDate?: Date;
  documents?: Document[];
  meetingBooked?: boolean;
  meetingDate?: Date;
}

/**
 * Selected Option interface
 * A specific option selected by a buyer
 */
export interface SelectedOption {
  optionId: string;
  option: CustomizationOption;
  location?: string; // e.g., "Master Bedroom"
  notes?: string;
  color?: string;
  finish?: string;
  quantity?: number;
}

/**
 * Customization Status enum
 * Status of a customization selection
 */
export enum CustomizationStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  CHANGES_REQUESTED = 'changes_requested',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

/**
 * Helper to calculate total price with customizations
 */
export function calculateTotalPrice(unit: Unit, selectedOptions?: SelectedOption[]): number {
  if (!selectedOptions || selectedOptions.length === 0) {
    return unit.basePrice;
  }
  
  const customizationTotal = selectedOptions.reduce((total, selection) => {
    return total + selection.option.additionalCost * (selection.quantity || 1);
  }, 0);
  
  return unit.basePrice + customizationTotal;
}

/**
 * Helper to format price with commas and currency symbol
 */
export function formatPrice(price: number, currency: string = '€'): string {
  return `${currency}${price.toLocaleString('en-IE')}`;
}

/**
 * Helper to get color code for BER rating
 */
export function getBerRatingColor(rating: BERRating): string {
  switch (rating) {
    case BERRating.A1:
    case BERRating.A2:
    case BERRating.A3:
      return '#00a651'; // Green
    case BERRating.B1:
    case BERRating.B2:
    case BERRating.B3:
      return '#8bc540'; // Light Green
    case BERRating.C1:
    case BERRating.C2:
    case BERRating.C3:
      return '#ffff00'; // Yellow
    case BERRating.D1:
    case BERRating.D2:
      return '#fbaf3f'; // Orange
    case BERRating.E1:
    case BERRating.E2:
      return '#f26522'; // Light Red
    case BERRating.F:
    case BERRating.G:
      return '#ed1c24'; // Red
    default:
      return '#999999'; // Grey
  }
}