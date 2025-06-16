/**
 * Sales Domain Model Types
 * 
 * This file defines the core Sales domain models and related types
 * that are used throughout the application.
 */

import { User, UserSummary } from './user';
import { Unit } from './unit';
import { Property } from './property';
import { Development } from './development';
import { Document } from './document';

/**
 * Sales status enum
 */
export enum SalesStatus {
  INQUIRY = 'INQUIRY',
  VIEWING_SCHEDULED = 'VIEWING_SCHEDULED',
  VIEWING_COMPLETED = 'VIEWING_COMPLETED',
  NEGOTIATION = 'NEGOTIATION',
  RESERVATION = 'RESERVATION',
  SALE_AGREED = 'SALE_AGREED',
  CONTRACT_SENT = 'CONTRACT_SENT',
  CONTRACT_SIGNED = 'CONTRACT_SIGNED',
  DEPOSIT_PAID = 'DEPOSIT_PAID',
  MORTGAGE_APPROVED = 'MORTGAGE_APPROVED',
  CONVEYANCING = 'CONVEYANCING',
  EXCHANGE = 'EXCHANGE',
  COMPLETION = 'COMPLETION',
  HANDOVER = 'HANDOVER',
  CANCELLED = 'CANCELLED',
  LOST = 'LOST'
}

/**
 * Government scheme type enum
 */
export enum GovernmentSchemeType {
  NONE = 'NONE',
  HELP_TO_BUY = 'HELP_TO_BUY',
  SHARED_OWNERSHIP = 'SHARED_OWNERSHIP',
  RIGHT_TO_BUY = 'RIGHT_TO_BUY',
  FIRST_HOMES = 'FIRST_HOMES',
  AFFORDABLE_HOUSING = 'AFFORDABLE_HOUSING',
  OTHER = 'OTHER'
}

/**
 * Mortgage status enum
 */
export enum MortgageStatus {
  NOT_APPLICABLE = 'NOT_APPLICABLE',
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  DECISION_IN_PRINCIPLE = 'DECISION_IN_PRINCIPLE',
  APPLICATION_SUBMITTED = 'APPLICATION_SUBMITTED',
  VALUATION_SCHEDULED = 'VALUATION_SCHEDULED',
  VALUATION_COMPLETED = 'VALUATION_COMPLETED',
  UNDERWRITING = 'UNDERWRITING',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
  FUNDS_RELEASED = 'FUNDS_RELEASED'
}

/**
 * Payment type enum
 */
export enum PaymentType {
  RESERVATION_FEE = 'RESERVATION_FEE',
  EXCHANGE_DEPOSIT = 'EXCHANGE_DEPOSIT',
  COMPLETION_BALANCE = 'COMPLETION_BALANCE',
  STAGE_PAYMENT = 'STAGE_PAYMENT',
  CUSTOMIZATION_PAYMENT = 'CUSTOMIZATION_PAYMENT',
  LEGAL_FEES = 'LEGAL_FEES',
  OTHER_FEES = 'OTHER_FEES'
}

/**
 * Payment status enum
 */
export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED'
}

/**
 * Payment method enum
 */
export enum PaymentMethod {
  CARD = 'CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  DIRECT_DEBIT = 'DIRECT_DEBIT',
  CHECK = 'CHECK',
  CASH = 'CASH',
  CRYPTO = 'CRYPTO',
  OTHER = 'OTHER'
}

/**
 * Sale payment interface
 */
export interface SalePayment {
  id: string;
  saleId: string;
  type: PaymentType;
  status: PaymentStatus;
  amount: number;
  currency: string;
  dueDate?: Date;
  paidDate?: Date;
  method?: PaymentMethod;
  reference?: string;
  notes?: string;
  receipt?: Document;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Milestone interface
 */
export interface SaleMilestone {
  id: string;
  name: string;
  status: 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED' | 'SKIPPED';
  dueDate?: Date;
  completedDate?: Date;
  assignedTo?: string;
  assignee?: UserSummary;
  notes?: string;
  order: number;
}

/**
 * Government scheme details
 */
export interface GovernmentSchemeDetails {
  type: GovernmentSchemeType;
  referenceNumber?: string;
  equityPercentage?: number;
  applicationDate?: Date;
  approvalDate?: Date;
  completionDate?: Date;
  notes?: string;
}

/**
 * Mortgage details
 */
export interface MortgageDetails {
  status: MortgageStatus;
  lender?: string;
  brokerName?: string;
  brokerContact?: string;
  mortgageAmount?: number;
  interestRate?: number;
  term?: number;
  applicationDate?: Date;
  approvalDate?: Date;
  valuerName?: string;
  valuationDate?: Date;
  valuationAmount?: number;
  notes?: string;
}

/**
 * Legal representation details
 */
export interface LegalRepresentation {
  name: string;
  company: string;
  email: string;
  phone?: string;
  address?: string;
  referenceNumber?: string;
}

/**
 * Core Sale interface
 */
export interface Sale {
  id: string;
  status: SalesStatus;
  unitId?: string;
  unit?: Unit;
  propertyId?: string;
  property?: Property;
  developmentId: string;
  development?: Development;
  buyerId: string;
  buyer?: User;
  agentId?: string;
  agent?: UserSummary;
  salePrice: number;
  currency: string;
  reservationDate?: Date;
  exchangeDate?: Date;
  completionDate?: Date;
  handoverDate?: Date;
  cancelledDate?: Date;
  cancellationReason?: string;
  payments: SalePayment[];
  milestones: SaleMilestone[];
  documents: Document[];
  governmentScheme?: GovernmentSchemeDetails;
  mortgage?: MortgageDetails;
  buyerSolicitor?: LegalRepresentation;
  sellerSolicitor?: LegalRepresentation;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>\n  );
}

/**
 * Sale summary for listing views
 */
export interface SaleSummary {
  id: string;
  status: SalesStatus;
  unitName?: string;
  propertyName?: string;
  developmentName: string;
  buyerName: string;
  salePrice: number;
  currency: string;
  reservationDate?: Date;
  completionDate?: Date;
  nextMilestone?: {
    name: string;
    dueDate?: Date;
  };
}

/**
 * Sale creation request
 */
export interface CreateSaleRequest {
  status: SalesStatus;
  unitId?: string;
  propertyId?: string;
  developmentId: string;
  buyerId: string;
  agentId?: string;
  salePrice: number;
  currency: string;
  reservationDate?: Date;
  exchangeDate?: Date;
  completionDate?: Date;
  governmentScheme?: GovernmentSchemeDetails;
  mortgage?: MortgageDetails;
  notes?: string;
  metadata?: Record<string, any>\n  );
}

/**
 * Sale update request
 */
export interface UpdateSaleRequest {
  status?: SalesStatus;
  unitId?: string;
  propertyId?: string;
  buyerId?: string;
  agentId?: string;
  salePrice?: number;
  currency?: string;
  reservationDate?: Date;
  exchangeDate?: Date;
  completionDate?: Date;
  handoverDate?: Date;
  cancelledDate?: Date;
  cancellationReason?: string;
  governmentScheme?: GovernmentSchemeDetails;
  mortgage?: MortgageDetails;
  buyerSolicitor?: LegalRepresentation;
  sellerSolicitor?: LegalRepresentation;
  notes?: string;
  metadata?: Record<string, any>\n  );
}

/**
 * Sale payment request
 */
export interface CreateSalePaymentRequest {
  saleId: string;
  type: PaymentType;
  amount: number;
  currency: string;
  dueDate?: Date;
  paidDate?: Date;
  method?: PaymentMethod;
  reference?: string;
  notes?: string;
}

/**
 * Sale milestone request
 */
export interface CreateSaleMilestoneRequest {
  saleId: string;
  name: string;
  status: 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED' | 'SKIPPED';
  dueDate?: Date;
  completedDate?: Date;
  assignedTo?: string;
  notes?: string;
  order: number;
}

/**
 * Sale search parameters
 */
export interface SaleSearchParams {
  keyword?: string;
  status?: SalesStatus[];
  developmentId?: string;
  unitId?: string;
  propertyId?: string;
  buyerId?: string;
  agentId?: string;
  reservationDateFrom?: Date;
  reservationDateTo?: Date;
  completionDateFrom?: Date;
  completionDateTo?: Date;
  minPrice?: number;
  maxPrice?: number;
  governmentScheme?: GovernmentSchemeType;
  sortBy?: 'reservationDate' | 'completionDate' | 'salePrice' | 'status';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Type guard to check if a value is a valid Sale
 */
export function isSale(value: any): value is Sale {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    typeof value.status === 'string' &&
    typeof value.developmentId === 'string' &&
    typeof value.buyerId === 'string' &&
    typeof value.salePrice === 'number' &&
    typeof value.currency === 'string' &&
    Array.isArray(value.payments) &&
    Array.isArray(value.milestones) &&
    Array.isArray(value.documents)
  );
}

/**
 * Type assertion function to ensure a value is a Sale
 * @throws {Error} If the value is not a valid Sale
 */
export function assertSale(value: any): asserts value is Sale {
  if (!isSale(value)) {
    throw new Error('Value is not a valid Sale');
  }
}