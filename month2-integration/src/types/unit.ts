/**
 * Unit types for properties within developments
 */
import { Document } from './document';
import { PropertyStatus, PropertyType } from './enums';

/**
 * Unit interface representing a property unit within a development
 */
export interface Unit {
  id: string;
  developmentId: string;
  name: string;
  unitNumber: string;
  blockName?: string;
  floorNumber?: number;
  type: PropertyType | string;
  status: PropertyStatus | string;
  price: number;
  priceCurrency: string;
  priceQualifier?: string; // 'from', 'starting at', etc.
  bedrooms: number;
  bathrooms: number;
  area: number; // in square meters
  areaUnit: 'sqm' | 'sqft';
  description?: string;
  features: string[];
  images: string[];
  floorPlanUrl?: string;
  virtualTourUrl?: string;
  availableFrom?: Date;
  isNewBuild: boolean;
  isShowHome?: boolean;
  isFeatured?: boolean;
  isReserved?: boolean;
  reservedBy?: string; // User ID
  reservationDate?: Date;
  reservationExpiryDate?: Date;
  purchaseStatus?: PurchaseStatus;
  customizationAvailable: boolean;
  customizationDeadline?: Date;
  documents?: Document[];
  notes?: string;
  viewingDates?: Date[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Purchase status enum
 */
export enum PurchaseStatus {
  INQUIRY = 'inquiry',
  RESERVED = 'reserved',
  DEPOSIT_PAID = 'deposit_paid',
  CONTRACTS_ISSUED = 'contracts_issued',
  CONTRACTS_SIGNED = 'contracts_signed',
  MORTGAGE_APPROVED = 'mortgage_approved',
  CLOSING = 'closing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

/**
 * Unit customization option type
 */
export interface UnitCustomizationOption {
  id: string;
  unitId: string;
  category: string;
  name: string;
  description?: string;
  price: number;
  isStandard: boolean;
  imageUrl?: string;
  available: boolean;
  deadline?: Date;
}

/**
 * Unit filter parameters
 */
export interface UnitFilter {
  developmentId?: string;
  unitType?: PropertyType | string;
  status?: PropertyStatus | string;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  availableFrom?: Date;
  isNewBuild?: boolean;
  isShowHome?: boolean;
  customizationAvailable?: boolean;
  blockName?: string;
  floorNumber?: number;
}

/**
 * Unit sort options
 */
export enum UnitSortField {
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  AREA_ASC = 'area_asc',
  AREA_DESC = 'area_desc',
  BEDROOMS_ASC = 'bedrooms_asc',
  BEDROOMS_DESC = 'bedrooms_desc',
  AVAILABLE_FROM_ASC = 'available_from_asc',
  AVAILABLE_FROM_DESC = 'available_from_desc',
  RECENTLY_ADDED = 'recently_added'
}

/**
 * Unit reservation request
 */
export interface UnitReservationRequest {
  unitId: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  message?: string;
  reservationFee?: number;
  reservationPeriod?: number; // in days
  financingMethod?: 'mortgage' | 'cash' | 'help_to_buy';
  preApproved?: boolean;
  solicitorDetails?: {
    name: string;
    firm: string;
    email: string;
    phone: string;
  };
}

/**
 * Unit reservation response
 */
export interface UnitReservation {
  id: string;
  unitId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  createdAt: Date;
  expiresAt: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  reservationFee?: number;
  feeStatus?: 'unpaid' | 'paid' | 'refunded';
  paymentReference?: string;
  documents?: Document[];
}