/**
 * Type definitions for the PropIE AWS platform database layer
 * These types define the core data models used throughout the application
 */

// User Management Types
export interface User {
  id: string;
  cognitoId?: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profileImageUrl?: string;
  role: string;
  status: string;
  kycStatus: string;
  twoFactorEnabled: boolean;
  lastLogin?: Date;
  metadata?: any;
  termsAccepted: boolean;
  termsAcceptedAt?: Date;
  marketingConsent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Location Type
export interface Location {
  id: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  county?: string;
  state?: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  geocoded: boolean;
}

// Development Types
export interface Development {
  id: string;
  name: string;
  code: string;
  description: string;
  status: string;
  developerId: string;
  location?: Location;
  totalUnits: number;
  availableUnits: number;
  reservedUnits: number;
  soldUnits: number;
  buildStartDate?: Date;
  buildEndDate?: Date;
  salesStartDate?: Date;
  estimatedCompletionDate?: Date;
  brochureUrl?: string;
  websiteUrl?: string;
  featuredImageUrl?: string;
  galleryImages?: string[];
  sitePlanUrl?: string;
  virtualTourUrl?: string;
  floorplans?: any;
  amenities?: string[];
  features?: string[];
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

// Unit Types
export interface Unit {
  id: string;
  developmentId: string;
  name: string;
  unitNumber: string;
  description: string;
  type: string;
  status: string;
  location?: Location;
  floorNumber?: number;
  bedrooms: number;
  bathrooms: number;
  totalArea: number;
  indoorArea?: number;
  outdoorArea?: number;
  parkingSpaces: number;
  basePrice: number;
  currentPrice: number;
  depositAmount?: number;
  depositPercentage?: number;
  completionPercentage: number;
  estimatedCompletionDate?: Date;
  actualCompletionDate?: Date;
  floorPlanUrl?: string;
  virtualTourUrl?: string;
  mainImageUrl?: string;
  galleryImages?: string[];
  features?: string[];
  energyRating?: string;
  isFeatured: boolean;
  isCustomizable: boolean;
  customizationDeadline?: Date;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

// Sale Types
export interface Sale {
  id: string;
  unitId: string;
  unit?: {
    id: string;
    name: string;
    unitNumber: string;
  };
  buyerId: string;
  buyerName?: string;
  agentId?: string;
  solicitorId?: string;
  status: string;
  inquiryDate?: Date;
  reservationDate?: Date;
  contractSentDate?: Date;
  contractSignedDate?: Date;
  depositPaidDate?: Date;
  completionDate?: Date;
  cancellationDate?: Date;
  cancellationReason?: string;
  salePrice: number;
  depositAmount?: number;
  helpToBuyAmount?: number;
  mortgageAmount?: number;
  cashAmount?: number;
  customizationTotal?: number;
  hasMortgage: boolean;
  hasHelpToBuy: boolean;
  notes?: string;
  developmentName?: string;
  developmentId?: string;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

// Document Types
export interface Document {
  id: string;
  name: string;
  description?: string;
  type: string;
  fileUrl: string;
  fileSize?: number;
  fileType?: string;
  version: string;
  status: string;
  entityType: string;
  entityId: string;
  uploadedBy?: string;
  approvedBy?: string;
  approvalDate?: Date;
  expiryDate?: Date;
  isTemplate: boolean;
  templateVariables?: any;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

// Customization Types
export interface CustomizationOption {
  id: string;
  unitId: string;
  category: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isDefault: boolean;
  isPremium: boolean;
  availableFrom?: Date;
  availableUntil?: Date;
  stockLimited: boolean;
  stockQuantity?: number;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomizationSelection {
  id: string;
  saleId: string;
  customizationOptionId: string;
  customizationOption?: {
    id: string;
    name: string;
    category: string;
    description?: string;
  };
  quantity: number;
  priceAtSelection: number;
  totalPrice: number;
  selectedAt: Date;
  status: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Financial Types
export interface DevelopmentFinance {
  id: string;
  developmentId: string;
  totalBudget: number;
  totalCostToDate: number;
  projectedProfit?: number;
  projectedMargin?: number;
  currency: string;
  lastUpdatedBy?: string;
  reportingPeriodStart?: Date;
  reportingPeriodEnd?: Date;
  financialSummary?: any;
  isLocked: boolean;
  lockedBy?: string;
  lockedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Budget {
  categories: {
    id: string;
    name: string;
    description?: string;
    displayOrder: number;
    items: {
      id: string;
      name: string;
      description?: string;
      budgetedAmount: number;
      actualAmount: number;
      varianceAmount: number;
      variancePercentage: number;
      isFixedCost: boolean;
      costPerUnit?: number;
      contingencyPercentage: number;
      contingencyAmount: number;
      forecastToComplete?: number;
      displayOrder: number;
      createdAt: Date;
      updatedAt: Date;
    }[];
  }[];
}

export interface CashFlow {
  projection: {
    id: string;
    name: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    periodType: string;
    currency: string;
    isApproved: boolean;
    approvedBy?: string;
    approvedAt?: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  periods: {
    id: string;
    periodNumber: number;
    periodStartDate: Date;
    periodEndDate: Date;
    inflowsTotal: number;
    outflowsTotal: number;
    netCashFlow: number;
    openingBalance: number;
    closingBalance: number;
    isActual: boolean;
    lineItems: {
      id: string;
      categoryId: string;
      categoryName: string;
      categoryType: string;
      name: string;
      description?: string;
      amount: number;
      isActual: boolean;
      transactionId?: string;
      budgetItemId?: string;
      createdAt: Date;
      updatedAt: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
  }[];
}

export interface Transaction {
  id: string;
  developmentFinanceId: string;
  budgetItemId?: string;
  reference?: string;
  description: string;
  amount: number;
  type: string;
  status: string;
  transactionDate: Date;
  paymentMethod?: string;
  supplier?: string;
  recipient?: string;
  approvedBy?: string;
  approvedAt?: Date;
  invoiceReference?: string;
  receiptReference?: string;
  notes?: string;
  documents?: string[];
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

// Database Operation Result Types
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DatabaseError extends Error {
  code?: string;
  detail?: string;
  table?: string;
  constraint?: string;
}

// Filter Types
export interface DevelopmentFilter {
  developerId?: string;
  status?: string;
  name?: string;
}

export interface UnitFilter {
  developmentId?: string;
  status?: string;
  type?: string;
  bedrooms?: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface SaleFilter {
  developmentId?: string;
  status?: string;
  agentId?: string;
  buyerId?: string;
}

export interface DocumentFilter {
  type?: string;
  status?: string;
}

export interface TransactionFilter {
  type?: string;
  status?: string;
  fromDate?: Date;
  toDate?: Date;
  budgetItemId?: string;
}

// Security Types
export interface UserPermission {
  name: string;
  granted: boolean;
}