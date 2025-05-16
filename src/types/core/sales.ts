/**
 * PropIE Core Data Model - Sales Process
 * Defines the sales process, contracts, and related interfaces
 */

import { Document, DocumentStatus, DocumentType } from '../document';
import { Unit } from './unit';
import { User } from './user';
import { HTBClaimStatus } from '../htb';

/**
 * Sale interface
 * Represents the complete sales transaction for a property unit
 */
export interface Sale {
  id: string;
  unit: Unit;
  buyer: User;
  sellingAgent?: User;
  solicitor?: User;
  buyerSolicitor?: User;
  
  // Status and timeline
  status: SaleStatus;
  statusHistory: SaleStatusHistory[];
  timeline: SaleTimeline;
  
  // Financial details
  basePrice: number;
  customizationCost: number;
  totalPrice: number;
  deposit: Deposit;
  contractStatus: ContractStatus;
  mortgageDetails?: MortgageDetails;
  htbDetails?: HTBDetails;
  
  // Documents and communication
  documents: Document[];
  notes: SaleNote[];
  tasks: SaleTask[];
  
  // Handover and snags
  completionDate?: Date;
  handoverDate?: Date;
  keyCollectionDate?: Date;
  snagList?: SnagItem[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // Additional metadata
  referenceNumber: string;
  metadata?: Record<string, any>;
  tags?: string[];
}

/**
 * Sale Status enum
 * Current stage in the sales process
 */
export enum SaleStatus {
  ENQUIRY = 'enquiry',
  VIEWING_SCHEDULED = 'viewing_scheduled',
  VIEWED = 'viewed',
  INTERESTED = 'interested',
  RESERVATION = 'reservation',
  PENDING_APPROVAL = 'pending_approval',
  RESERVATION_APPROVED = 'reservation_approved',
  CONTRACT_ISSUED = 'contract_issued',
  CONTRACT_SIGNED = 'contract_signed',
  DEPOSIT_PAID = 'deposit_paid',
  MORTGAGE_APPROVED = 'mortgage_approved',
  CLOSING = 'closing',
  COMPLETED = 'completed',
  HANDED_OVER = 'handed_over',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired'
}

/**
 * Sale Status History
 * Record of status changes
 */
export interface SaleStatusHistory {
  id: string;
  status: SaleStatus;
  previousStatus?: SaleStatus;
  timestamp: Date;
  updatedBy: User;
  notes?: string;
}

/**
 * Sale Timeline
 * Key dates in the sales process
 */
export interface SaleTimeline {
  initialEnquiryDate?: Date;
  firstViewingDate?: Date;
  reservationDate?: Date;
  reservationExpiryDate?: Date;
  contractIssuedDate?: Date;
  contractReturnDeadline?: Date;
  contractReturnedDate?: Date;
  depositDueDate?: Date;
  depositPaidDate?: Date;
  mortgageApprovalDate?: Date;
  closingDate?: Date;
  fundsDisbursedDate?: Date;
  saleCompletedDate?: Date;
  handoverDate?: Date;
  keyCollectionDate?: Date;
  warrantyStartDate?: Date;
  warrantyEndDate?: Date;
}

/**
 * Deposit interface
 * Represents deposit payments for a sale
 */
export interface Deposit {
  initialAmount: number;
  initialAmountPercentage: number;
  initialPaidDate?: Date;
  balanceAmount: number;
  balanceDueDate?: Date;
  balancePaidDate?: Date;
  totalPaid: number;
  status: DepositStatus;
  paymentMethod?: string;
  receiptDocuments?: Document[];
}

/**
 * Deposit Status enum
 * Status of deposit payment
 */
export enum DepositStatus {
  NOT_PAID = 'not_paid',
  INITIAL_PAID = 'initial_paid',
  FULLY_PAID = 'fully_paid',
  PARTIAL_REFUND = 'partial_refund',
  FULLY_REFUNDED = 'fully_refunded'
}

/**
 * Contract Status enum
 * Status of the sales contract
 */
export enum ContractStatus {
  NOT_ISSUED = 'not_issued',
  DRAFTED = 'drafted',
  ISSUED = 'issued',
  UNDER_REVIEW = 'under_review',
  AMENDMENTS_REQUESTED = 'amendments_requested',
  SIGNED_BUYER = 'signed_buyer',
  SIGNED_DEVELOPER = 'signed_developer',
  FULLY_SIGNED = 'fully_signed',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired'
}

/**
 * Mortgage Details interface
 * Financing details for the property purchase
 */
export interface MortgageDetails {
  id: string;
  lender: string;
  amount: number;
  term: number; // in years
  interestRate: number;
  approvalInPrincipleDate?: Date;
  finalApprovalDate?: Date;
  status: MortgageStatus;
  broker?: string;
  brokerFee?: number;
  loanType: MortgageType;
  documents: Document[];
  notes?: string;
  applicationDate?: Date;
  offerExpiryDate?: Date;
  completionDate?: Date;
  drawdownDate?: Date;
}

/**
 * Mortgage Status enum
 * Status of mortgage application and approval
 */
export enum MortgageStatus {
  INQUIRY = 'inquiry',
  APPLICATION_IN_PROGRESS = 'application_in_progress',
  APPROVAL_IN_PRINCIPLE = 'approval_in_principle',
  VALUATION_SCHEDULED = 'valuation_scheduled',
  VALUATION_COMPLETED = 'valuation_completed',
  UNDERWRITING = 'underwriting',
  ADDITIONAL_INFO_REQUESTED = 'additional_info_requested',
  FINAL_APPROVAL = 'final_approval',
  LOAN_OFFER_ISSUED = 'loan_offer_issued',
  LOAN_OFFER_ACCEPTED = 'loan_offer_accepted',
  READY_FOR_DRAWDOWN = 'ready_for_drawdown',
  FUNDS_DISBURSED = 'funds_disbursed',
  DECLINED = 'declined',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired'
}

/**
 * Mortgage Type enum
 * Type of mortgage product
 */
export enum MortgageType {
  FIXED = 'fixed',
  VARIABLE = 'variable',
  TRACKER = 'tracker',
  INTEREST_ONLY = 'interest_only',
  OFFSET = 'offset',
  BUY_TO_LET = 'buy_to_let'
}

/**
 * Help to Buy (HTB) Details interface
 * Help to Buy incentive scheme details
 */
export interface HTBDetails {
  id: string;
  applicationNumber: string;
  status: HTBClaimStatus;
  applicationDate: Date;
  approvalDate?: Date;
  amount: number;
  claimSubmissionDate?: Date;
  claimPaymentDate?: Date;
  documents: Document[];
  notes?: string;
  accessCode?: string;
  claimCode?: string;
  expiryDate?: Date;
}

/**
 * Sale Note interface
 * Internal notes for a sale
 */
export interface SaleNote {
  id: string;
  sale: Sale;
  author: User;
  content: string;
  timestamp: Date;
  isPrivate: boolean;
  category?: string;
}

/**
 * Sale Task interface
 * Tasks to be completed during the sale process
 */
export interface SaleTask {
  id: string;
  sale: Sale;
  title: string;
  description: string;
  dueDate: Date;
  status: SaleTaskStatus;
  priority: SaleTaskPriority;
  assignedTo: User;
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  completedBy?: User;
  notifyBeforeDays?: number;
  isReminderSent?: boolean;
  recurrence?: TaskRecurrence;
}

/**
 * Sale Task Status enum
 * Status of a task in the sales process
 */
export enum SaleTaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  BLOCKED = 'blocked',
  CANCELLED = 'cancelled',
  OVERDUE = 'overdue'
}

/**
 * Sale Task Priority enum
 * Priority level for a sales task
 */
export enum SaleTaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

/**
 * Task Recurrence interface
 * For recurring tasks
 */
export interface TaskRecurrence {
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number;
  endAfterOccurrences?: number;
  endByDate?: Date;
}

/**
 * Snag Item interface
 * Issues identified during inspection
 */
export interface SnagItem {
  id: string;
  sale: Sale;
  title: string;
  description: string;
  room?: string;
  category: SnagCategory;
  priority: SnagPriority;
  status: SnagStatus;
  reportedBy: User;
  reportedDate: Date;
  assignedTo?: User;
  dueDate?: Date;
  resolvedDate?: Date;
  resolvedBy?: User;
  resolutionNotes?: string;
  images?: string[];
  isRework: boolean;
  previousAttempts?: number;
}

/**
 * Snag Category enum
 * Categories of snag items
 */
export enum SnagCategory {
  PLUMBING = 'plumbing',
  ELECTRICAL = 'electrical',
  HVAC = 'hvac',
  DOORS_WINDOWS = 'doors_windows',
  WALLS_CEILINGS = 'walls_ceilings',
  FLOORING = 'flooring',
  FIXTURES = 'fixtures',
  APPLIANCES = 'appliances',
  EXTERIOR = 'exterior',
  STRUCTURAL = 'structural',
  LANDSCAPING = 'landscaping',
  OTHER = 'other'
}

/**
 * Snag Priority enum
 * Priority level of a snag item
 */
export enum SnagPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Snag Status enum
 * Current status of a snag item
 */
export enum SnagStatus {
  REPORTED = 'reported',
  INSPECTED = 'inspected',
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  PENDING_MATERIALS = 'pending_materials',
  COMPLETED = 'completed',
  REQUIRES_REINSPECTION = 'requires_reinspection',
  VERIFIED = 'verified',
  DISPUTED = 'disputed',
  CANNOT_REPRODUCE = 'cannot_reproduce',
  DEFERRED = 'deferred'
}

/**
 * Sales Summary interface
 * Summarized sales data for analytics
 */
export interface SalesSummary {
  totalSales: number;
  totalRevenue: number;
  averageSalePrice: number;
  salesByStatus: Record<SaleStatus, number>;
  salesByMonth: Array<{
    month: string;
    count: number;
    revenue: number;
  }>;
  conversionRate: number;
  averageSalesCycle: number; // in days
  topSellingUnitTypes: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
}

/**
 * Helper to calculate if a sale is at risk of expiring soon
 */
export function isSaleExpiringOrOverdue(
  sale: Sale, 
  daysThreshold: number = 7
): boolean {
  const currentDate = new Date();
  const date = new Date(currentDate);
  date.setDate(date.getDate() + daysThreshold);
  
  if (sale.status === SaleStatus.RESERVATION) {
    return !!sale.timeline.reservationExpiryDate && 
           sale.timeline.reservationExpiryDate <= date;
  } else if (sale.status === SaleStatus.CONTRACT_ISSUED) {
    return !!sale.timeline.contractReturnDeadline && 
           sale.timeline.contractReturnDeadline <= date;
  } else if (sale.contractStatus === ContractStatus.SIGNED_BUYER) {
    return !!sale.deposit.balanceDueDate && 
           sale.deposit.balanceDueDate <= date;
  }
  
  return false;
}

/**
 * Helper to calculate sales velocity
 */
export function calculateSalesVelocity(sales: Sale[], periodInDays: number = 30): number {
  const now = new Date();
  const periodStart = new Date(now);
  periodStart.setDate(periodStart.getDate() - periodInDays);
  
  const salesInPeriod = sales.filter(sale => {
    return (sale.status === SaleStatus.COMPLETED || 
            sale.status === SaleStatus.HANDED_OVER) && 
           sale.timeline.saleCompletedDate && 
           new Date(sale.timeline.saleCompletedDate) >= periodStart;
  });
  
  return salesInPeriod.length / (periodInDays / 30); // Sales per month
}

/**
 * Helper to get the current phase of a sale
 */
export function getSalePhase(sale: Sale): 'reservation' | 'contract' | 'mortgage' | 'closing' | 'completion' | 'handover' {
  switch (sale.status) {
    case SaleStatus.ENQUIRY:
    case SaleStatus.VIEWING_SCHEDULED:
    case SaleStatus.VIEWED:
    case SaleStatus.INTERESTED:
    case SaleStatus.RESERVATION:
    case SaleStatus.PENDING_APPROVAL:
    case SaleStatus.RESERVATION_APPROVED:
      return 'reservation';
    
    case SaleStatus.CONTRACT_ISSUED:
    case SaleStatus.CONTRACT_SIGNED:
    case SaleStatus.DEPOSIT_PAID:
      return 'contract';
    
    case SaleStatus.MORTGAGE_APPROVED:
      return 'mortgage';
    
    case SaleStatus.CLOSING:
      return 'closing';
    
    case SaleStatus.COMPLETED:
      return 'completion';
    
    case SaleStatus.HANDED_OVER:
      return 'handover';
    
    default:
      return 'reservation';
  }
}