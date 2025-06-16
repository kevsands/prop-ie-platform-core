/**
 * Enterprise Data Types for Property Development Platform
 * Provides type-safe contracts for all property and unit management
 * 
 * @fileoverview Comprehensive TypeScript definitions for enterprise property management
 * @version 2.0.0
 * @author Property Development Platform Team
 */

// =============================================================================
// CORE UNIT MANAGEMENT TYPES
// =============================================================================

export type UnitStatus = 'available' | 'reserved' | 'sold' | 'held' | 'withdrawn';
export type UnitType = '1 Bed Apartment' | '2 Bed Apartment' | '3 Bed House' | '4 Bed House';
export type AppointmentType = 'engineer' | 'consultant' | 'solicitor' | 'architect' | 'surveyor';
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
export type InvoiceStatus = 'pending' | 'approved' | 'paid' | 'overdue' | 'disputed';
export type InvoiceCategory = 'design' | 'construction' | 'legal' | 'marketing' | 'other';
export type ProposalStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
export type TeamMemberStatus = 'active' | 'busy' | 'unavailable' | 'on_leave';
export type TeamDepartment = 'design' | 'construction' | 'management' | 'sales' | 'legal';

// =============================================================================
// BUYER AND LEGAL INFORMATION
// =============================================================================

export interface BuyerInformation {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly address?: string;
  readonly solicitor: string;
  readonly solicitorContact?: string;
  readonly mortgageProvider?: string;
  readonly mortgageApproved: boolean;
  readonly depositAmount?: number;
  readonly notes?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface LegalPack {
  readonly solicitorPackSent: boolean;
  readonly contractSigned: boolean;
  readonly depositPaid: boolean;
  readonly mortgageApproved: boolean;
  readonly completionDate: Date | null;
  readonly legalNotes?: string;
  readonly lastUpdated: Date;
}

// =============================================================================
// UNIT DEFINITION AND MANAGEMENT
// =============================================================================

export interface UnitFeatures {
  readonly bedrooms: number;
  readonly bathrooms: number;
  readonly sqft: number;
  readonly floor: number;
  readonly building: number;
  readonly hasBalcony: boolean;
  readonly hasGarden: boolean;
  readonly parkingSpaces: number;
  readonly features: ReadonlyArray<string>;
  readonly amenities: ReadonlyArray<string>;
}

export interface UnitLocation {
  readonly x: number; // Position for site plan (0-100)
  readonly y: number; // Position for site plan (0-100)
  readonly building: number;
  readonly floor: number;
  readonly unitNumber: string;
}

export interface UnitPricing {
  readonly basePrice: number;
  readonly currentPrice: number;
  readonly priceHistory: ReadonlyArray<{
    readonly price: number;
    readonly date: Date;
    readonly reason: string;
  }>;
  readonly htbEligible: boolean;
  readonly htbAmount?: number;
}

export interface Unit {
  readonly id: string;
  readonly number: string;
  readonly type: UnitType;
  readonly status: UnitStatus;
  readonly pricing: UnitPricing;
  readonly features: UnitFeatures;
  readonly location: UnitLocation;
  readonly buyer: BuyerInformation | null;
  readonly legalPack: LegalPack;
  readonly statusHistory: ReadonlyArray<{
    readonly status: UnitStatus;
    readonly date: Date;
    readonly reason: string;
    readonly updatedBy: string;
  }>;
  readonly lastUpdated: Date;
  readonly createdAt: Date;
}

// =============================================================================
// PROJECT MANAGEMENT TYPES
// =============================================================================

export interface ProjectMetrics {
  readonly totalUnits: number;
  readonly soldUnits: number;
  readonly reservedUnits: number;
  readonly availableUnits: number;
  readonly heldUnits: number;
  readonly withdrawnUnits: number;
  readonly totalRevenue: number;
  readonly projectedRevenue: number;
  readonly averageUnitPrice: number;
  readonly salesVelocity: number; // units per week
  readonly conversionRate: number; // percentage
  readonly lastCalculated: Date;
}

export interface UnitTypeBreakdown {
  readonly type: UnitType;
  readonly totalCount: number;
  readonly sold: number;
  readonly reserved: number;
  readonly available: number;
  readonly held: number;
  readonly withdrawn: number;
  readonly priceRange: {
    readonly min: number;
    readonly max: number;
    readonly average: number;
  };
  readonly salesPercentage: number;
}

export interface ProjectTimeline {
  readonly projectStart: Date;
  readonly plannedCompletion: Date;
  readonly currentPhase: string;
  readonly progressPercentage: number;
  readonly milestones: ReadonlyArray<{
    readonly id: string;
    readonly name: string;
    readonly date: Date;
    readonly completed: boolean;
    readonly critical: boolean;
  }>;
}

export interface Project {
  readonly id: string;
  readonly name: string;
  readonly location: string;
  readonly description: string;
  readonly metrics: ProjectMetrics;
  readonly unitBreakdown: ReadonlyArray<UnitTypeBreakdown>;
  readonly timeline: ProjectTimeline;
  readonly units: ReadonlyArray<Unit>;
  readonly lastUpdated: Date;
  readonly createdAt: Date;
}

// =============================================================================
// TEAM MANAGEMENT TYPES
// =============================================================================

export interface TeamMember {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly company: string;
  readonly email: string;
  readonly phone: string;
  readonly status: TeamMemberStatus;
  readonly department: TeamDepartment;
  readonly specialties: ReadonlyArray<string>;
  readonly hourlyRate: number;
  readonly joinDate: Date;
  readonly lastActivity: Date;
  readonly currentTasks: number;
  readonly completedTasks: number;
  readonly location: string;
  readonly notes?: string;
}

// =============================================================================
// FINANCIAL MANAGEMENT TYPES
// =============================================================================

export interface Invoice {
  readonly id: string;
  readonly invoiceNumber: string;
  readonly provider: string;
  readonly providerEmail: string;
  readonly providerPhone: string;
  readonly amount: number;
  readonly netAmount: number;
  readonly vatAmount: number;
  readonly date: Date;
  readonly dueDate: Date;
  readonly status: InvoiceStatus;
  readonly type: string;
  readonly description: string;
  readonly category: InvoiceCategory;
  readonly approvedBy?: string;
  readonly approvedDate?: Date;
  readonly paymentMethod?: string;
  readonly paymentDate?: Date;
  readonly notes?: string;
}

export interface FeeProposal {
  readonly id: string;
  readonly title: string;
  readonly provider: string;
  readonly totalAmount: number;
  readonly status: ProposalStatus;
  readonly submittedDate: Date;
  readonly reviewDate?: Date;
  readonly description: string;
  readonly breakdownItems: ReadonlyArray<{
    readonly description: string;
    readonly quantity: number;
    readonly rate: number;
    readonly total: number;
  }>;
  readonly terms: string;
  readonly validUntil: Date;
  readonly notes?: string;
}

export interface ProfessionalAppointment {
  readonly id: string;
  readonly professional: string;
  readonly company: string;
  readonly role: string;
  readonly appointmentType: AppointmentType;
  readonly appointmentDate: Date;
  readonly status: AppointmentStatus;
  readonly fee: number;
  readonly description: string;
  readonly duration: number; // hours
  readonly location: string;
  readonly contactEmail: string;
  readonly contactPhone: string;
  readonly notes?: string;
  readonly followUpRequired: boolean;
  readonly completionNotes?: string;
}

// =============================================================================
// STATE MANAGEMENT AND EVENTS
// =============================================================================

export interface UnitUpdateEvent {
  readonly unitId: string;
  readonly previousStatus: UnitStatus;
  readonly newStatus: UnitStatus;
  readonly reason: string;
  readonly updatedBy: string;
  readonly timestamp: Date;
  readonly additionalData?: Record<string, unknown>;
}

export interface ProjectStateUpdate {
  readonly type: 'UNIT_STATUS_CHANGE' | 'UNIT_PRICE_UPDATE' | 'BUYER_ASSIGNMENT' | 'LEGAL_UPDATE';
  readonly payload: UnitUpdateEvent;
  readonly projectId: string;
  readonly timestamp: Date;
}

// =============================================================================
// ANALYTICS AND REPORTING TYPES
// =============================================================================

export interface SalesAnalytics {
  readonly totalSales: number;
  readonly salesGrowth: number;
  readonly totalRevenue: number;
  readonly revenueGrowth: number;
  readonly averageSalePrice: number;
  readonly priceGrowth: number;
  readonly salesVelocity: number;
  readonly velocityChange: number;
  readonly conversionRate: number;
  readonly conversionGrowth: number;
  readonly pipelineValue: number;
  readonly pipelineGrowth: number;
  readonly period: string;
  readonly lastUpdated: Date;
}

export interface MarketingMetrics {
  readonly pageViews: number;
  readonly uniqueVisitors: number;
  readonly enquiries: number;
  readonly brochureDownloads: number;
  readonly virtualTours: number;
  readonly conversionRate: number;
  readonly averageTimeOnSite: number;
  readonly bounceRate: number;
  readonly period: string;
  readonly lastUpdated: Date;
}

// =============================================================================
// VALIDATION AND BUSINESS RULES
// =============================================================================

export interface ValidationRule {
  readonly field: string;
  readonly rule: string;
  readonly message: string;
  readonly severity: 'error' | 'warning' | 'info';
}

export interface BusinessRules {
  readonly unitStatusTransitions: Record<UnitStatus, ReadonlyArray<UnitStatus>>;
  readonly requiredFields: Record<string, ReadonlyArray<string>>;
  readonly validationRules: ReadonlyArray<ValidationRule>;
  readonly permissions: Record<string, ReadonlyArray<string>>;
}

// =============================================================================
// EXPORT ALL TYPES
// =============================================================================

export type {
  Unit,
  Project,
  TeamMember,
  Invoice,
  FeeProposal,
  ProfessionalAppointment,
  UnitUpdateEvent,
  ProjectStateUpdate,
  SalesAnalytics,
  MarketingMetrics,
  BusinessRules
};