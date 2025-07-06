/**
 * Type definitions for Buyer Journey models
 * 
 * This file contains interface definitions for buyer-related data structures,
 * ensuring type safety and comprehensive documentation across the application.
 */

import { User } from './user';
import { Property } from './properties';

/**
 * Possible phases of a buyer's journey
 */
export enum BuyerJourneyPhase {
  PLANNING = 'PLANNING',
  FINANCING = 'FINANCING', 
  SEARCHING = 'SEARCHING',
  BUYING = 'BUYING',
  MOVED_IN = 'MOVED_IN'
}

/**
 * Status for property reservations
 */
export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

/**
 * Mortgage application tracking status
 */
export enum MortgageStatus {
  NOT_STARTED = 'NOT_STARTED',
  AIP_RECEIVED = 'AIP_RECEIVED',
  AIP_EXPIRED = 'AIP_EXPIRED',
  MORTGAGE_OFFERED = 'MORTGAGE_OFFERED',
  MORTGAGE_COMPLETED = 'MORTGAGE_COMPLETED'
}

/**
 * Status for snag list items
 */
export enum SnagItemStatus {
  REPORTED = 'REPORTED',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  FIXED = 'FIXED',
  DISPUTED = 'DISPUTED'
}

/**
 * Status for the overall snag list
 */
export enum SnagListStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED'
}

/**
 * Buyer profile preferences
 */
export interface BuyerPreferences {
  maxBudget?: number;
  minBedrooms?: number;
  propertyType?: string;
  preferredLocations?: string[];
  floorAreaMin?: number;
  [key: string]: any; // Allow for additional custom preferences
}

/**
 * Government scheme enrollment status
 */
export interface GovernmentSchemes {
  helpToBuy?: boolean;
  firstHomeScheme?: boolean;
  sharedOwnership?: boolean;
  [key: string]: boolean | undefined;
}

/**
 * Buyer profile information
 */
export interface BuyerProfile {
  id: string;
  userId: string;
  currentJourneyPhase: BuyerJourneyPhase;
  preferences?: BuyerPreferences;
  governmentSchemes?: GovernmentSchemes;
  maxBudget?: number;
  preApprovalAmount?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Property reservation
 */
export interface Reservation {
  id: string;
  userId: string;
  propertyId: string;
  property: Property;
  status: ReservationStatus;
  depositAmount: number;
  depositPaid: boolean;
  agreementSigned: boolean;
  reservationDate: string;
  expiryDate?: string;
  cancellationReason?: string;
  completionDate?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Mortgage tracking information
 */
export interface MortgageTracking {
  id: string;
  userId: string;
  propertyId?: string;
  property?: Property;
  status: MortgageStatus;
  lenderName?: string;
  amount?: number;
  aipDate?: string;
  aipExpiryDate?: string;
  formalOfferDate?: string;
  completionDate?: string;
  conditions?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Snag list item
 */
export interface SnagItem {
  id: string;
  snagListId: string;
  description: string;
  location: string;
  status: SnagItemStatus;
  reportedDate: string;
  fixedDate?: string;
  notes?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Complete snag list
 */
export interface SnagList {
  id: string;
  userId: string;
  propertyId: string;
  property: Property;
  status: SnagListStatus;
  items: SnagItem[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Home pack document categories
 */
export enum HomePackCategory {
  OWNERSHIP = 'OWNERSHIP',
  INSTRUCTIONS = 'INSTRUCTIONS',
  WARRANTIES = 'WARRANTIES',
  CERTIFICATES = 'CERTIFICATES',
  UTILITIES = 'UTILITIES',
  OTHER = 'OTHER'
}

/**
 * Home pack document item
 */
export interface HomePackItem {
  id: string;
  propertyId: string;
  category: HomePackCategory | string;
  title: string;
  documentUrl: string;
  issuer?: string;
  issueDate?: string;
  expiryDate?: string;
  required: boolean;
  createdAt: string;
  updatedAt: string;
}