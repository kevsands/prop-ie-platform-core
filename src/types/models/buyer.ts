/**
 * Buyer Domain Model Types
 * 
 * This file defines the buyer-specific domain models and related types
 * that are used throughout the application.
 */

import { User, UserSummary } from './user';
import { Document } from './document';
import { GovernmentSchemeType, MortgageStatus } from './sales';

/**
 * Buyer journey stage enum
 */
export enum BuyerJourneyStage {
  RESEARCH = 'RESEARCH',
  VIEWING = 'VIEWING',
  FINANCIAL_ASSESSMENT = 'FINANCIAL_ASSESSMENT',
  RESERVATION = 'RESERVATION',
  MORTGAGE_APPLICATION = 'MORTGAGE_APPLICATION',
  LEGAL_PROCESS = 'LEGAL_PROCESS',
  EXCHANGE = 'EXCHANGE',
  COMPLETION = 'COMPLETION',
  POST_COMPLETION = 'POST_COMPLETION'
}

/**
 * Financial readiness status enum
 */
export enum FinancialReadinessStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  MORTGAGE_IN_PRINCIPLE = 'MORTGAGE_IN_PRINCIPLE',
  FULLY_APPROVED = 'FULLY_APPROVED',
  CASH_BUYER = 'CASH_BUYER',
  NEEDS_ASSISTANCE = 'NEEDS_ASSISTANCE'
}

/**
 * Buyer preference interface
 */
export interface BuyerPreference {
  propertyTypes: string[];
  minBedrooms: number;
  maxBedrooms: number;
  minBathrooms: number;
  maxBathrooms: number;
  minPrice: number;
  maxPrice: number;
  locations: string[];
  mustHaveFeatures: string[];
  niceToHaveFeatures: string[];
  moveInTimeline: string;
  interestedInNewBuild: boolean;
  interestedInGovernmentSchemes: boolean;
}

/**
 * Financial details interface
 */
export interface BuyerFinancialDetails {
  annualIncome: number;
  additionalIncome?: number;
  savings: number;
  existingPropertyValue?: number;
  existingMortgageBalance?: number;
  monthlyOutgoings?: number;
  creditScore?: number;
  affordabilityAssessment?: {
    maximumLoanAmount: number;
    recommendedPurchasePrice: number;
    estimatedMonthlyPayment: number;
    loanToValueRatio: number;
    affordabilityRatio: number;
  };
  mortgageInPrinciple?: {
    lender: string;
    amount: number;
    validUntil: Date;
    documentId?: string;
  };
}

/**
 * Checklist item interface
 */
export interface BuyerChecklistItem {
  id: string;
  title: string;
  description?: string;
  stage: BuyerJourneyStage;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'NOT_APPLICABLE';
  dueDate?: Date;
  completedDate?: Date;
  documentIds?: string[];
  documents?: Document[];
  order: number;
  isRequired: boolean;
}

/**
 * Document requirement interface
 */
export interface BuyerDocumentRequirement {
  id: string;
  title: string;
  description?: string;
  stage: BuyerJourneyStage;
  documentType: string;
  isRequired: boolean;
  status: 'NOT_STARTED' | 'PENDING' | 'APPROVED' | 'REJECTED';
  documentIds?: string[];
  documents?: Document[];
  notes?: string;
}

/**
 * Government scheme application interface
 */
export interface GovernmentSchemeApplication {
  id: string;
  type: GovernmentSchemeType;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'APPROVED' | 'DECLINED';
  referenceNumber?: string;
  applicationDate?: Date;
  approvalDate?: Date;
  equityPercentage?: number;
  documents?: Document[];
  notes?: string;
}

/**
 * Solicitor details interface
 */
export interface SolicitorDetails {
  name: string;
  company: string;
  address?: string;
  email: string;
  phone?: string;
  referenceNumber?: string;
}

/**
 * Core BuyerProfile interface
 */
export interface BuyerProfile {
  id: string;
  userId: string;
  user?: User;
  currentStage: BuyerJourneyStage;
  preferences?: BuyerPreference;
  financialReadiness: FinancialReadinessStatus;
  financialDetails?: BuyerFinancialDetails;
  mortgageStatus: MortgageStatus;
  checklist: BuyerChecklistItem[];
  documentRequirements: BuyerDocumentRequirement[];
  governmentScheme?: GovernmentSchemeApplication;
  solicitor?: SolicitorDetails;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  assignedAgentId?: string;
  assignedAgent?: UserSummary;
  isFirstTimeBuyer: boolean;
  metadata?: Record<string, any>
  );
}

/**
 * Buyer journey progress interface
 */
export interface BuyerJourneyProgress {
  id: string;
  userId: string;
  currentStage: BuyerJourneyStage;
  stageProgress: Record<BuyerJourneyStage, number>
  );
  checklistCompletion: number;
  documentsCompletion: number;
  overallProgress: number;
  lastActivity: Date;
  nextActionItems: Array<{
    title: string;
    dueDate?: Date;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
  }>
  );
}

/**
 * Buyer preference update request
 */
export interface UpdateBuyerPreferenceRequest {
  propertyTypes?: string[];
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  locations?: string[];
  mustHaveFeatures?: string[];
  niceToHaveFeatures?: string[];
  moveInTimeline?: string;
  interestedInNewBuild?: boolean;
  interestedInGovernmentSchemes?: boolean;
}

/**
 * Buyer financial details update request
 */
export interface UpdateBuyerFinancialDetailsRequest {
  annualIncome?: number;
  additionalIncome?: number;
  savings?: number;
  existingPropertyValue?: number;
  existingMortgageBalance?: number;
  monthlyOutgoings?: number;
  creditScore?: number;
}

/**
 * Buyer checklist item update request
 */
export interface UpdateBuyerChecklistItemRequest {
  id: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'NOT_APPLICABLE';
  completedDate?: Date;
  documentIds?: string[];
  notes?: string;
}

/**
 * Type guard to check if a value is a valid BuyerProfile
 */
export function isBuyerProfile(value: any): value is BuyerProfile {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    typeof value.userId === 'string' &&
    typeof value.currentStage === 'string' &&
    typeof value.financialReadiness === 'string' &&
    typeof value.mortgageStatus === 'string' &&
    Array.isArray(value.checklist) &&
    Array.isArray(value.documentRequirements) &&
    typeof value.isFirstTimeBuyer === 'boolean'
  );
}

/**
 * Type assertion function to ensure a value is a BuyerProfile
 * @throws {Error} If the value is not a valid BuyerProfile
 */
export function assertBuyerProfile(value: any): asserts value is BuyerProfile {
  if (!isBuyerProfile(value)) {
    throw new Error('Value is not a valid BuyerProfile');
  }
}