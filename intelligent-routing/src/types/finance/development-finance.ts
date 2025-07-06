/**
 * Development Finance Models
 * 
 * These interfaces define the financial structures for real estate development projects,
 * including funding sources, project costs, budgets, and financial tracking.
 */

import { Document } from '../document';
import { CashFlowProjection } from './cash-flow';

/**
 * Currency code following ISO 4217
 */
export type CurrencyCode = 'EUR' | 'USD' | 'GBP' | 'CAD' | 'AUD' | 'JPY' | 'CHF' | 'CNY';

/**
 * Development Financing structure
 * Contains all financial information related to a development project
 */
export interface DevelopmentFinance {
  id: string;
  developmentId: string;
  projectCost: MonetaryAmount;
  fundingSources: FundingSource[];
  budget: DevelopmentBudget;
  cashFlow: CashFlowProjection;
  financialReturns: FinancialReturns;
  financialStatements: FinancialStatement[];
  transactions: FinancialTransaction[];
  reportingPeriod: 'monthly' | 'quarterly' | 'annually';
  createdAt: Date;
  updatedAt: Date;
  lockedBy?: string; // User ID who has locked the financial data for editing
  lockedUntil?: Date;
  documents?: Document[];
}

/**
 * Monetary amount with currency
 */
export interface MonetaryAmount {
  amount: number;
  currency: CurrencyCode;
  exchangeRate?: number; // For conversions if needed
}

/**
 * Common transaction attributes
 */
export interface BaseTransaction {
  id: string;
  amount: MonetaryAmount;
  date: Date;
  description: string;
  referenceNumber?: string;
  status: TransactionStatus;
  category: string;
  notes?: string;
  documents?: Document[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Transaction status
 */
export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
  SCHEDULED = 'scheduled',
  PROCESSING = 'processing',
  RECONCILED = 'reconciled',
  DISPUTED = 'disputed'
}

/**
 * Financial transaction
 */
export interface FinancialTransaction extends BaseTransaction {
  transactionType: 'income' | 'expense' | 'transfer' | 'adjustment';
  paymentMethod: PaymentMethod;
  counterparty: {
    id?: string;
    name: string;
    type: 'contractor' | 'supplier' | 'buyer' | 'lender' | 'investor' | 'other';
  };
  budgetCategoryId?: string; // Link to budget category
  invoiceId?: string;
  accountId?: string; // Account ID where transaction occurred
  relatedTransactionId?: string; // For linked transactions
  tags?: string[];
}

/**
 * Payment method
 */
export enum PaymentMethod {
  BANK_TRANSFER = 'bank_transfer',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  CASH = 'cash',
  CHECK = 'check',
  DIRECT_DEBIT = 'direct_debit',
  ELECTRONIC_TRANSFER = 'electronic_transfer',
  WIRE_TRANSFER = 'wire_transfer',
  ESCROW = 'escrow',
  OTHER = 'other'
}

/**
 * Funding source
 */
export interface FundingSource {
  id: string;
  name: string;
  type: FundingType;
  amount: MonetaryAmount;
  interestRate?: number; // For debt financing (percentage)
  term?: number; // Term in months
  termUnit?: 'days' | 'weeks' | 'months' | 'years';
  startDate?: Date;
  endDate?: Date;
  drawdownSchedule?: Drawdown[];
  repaymentSchedule?: Repayment[];
  ltvRatio?: number; // Loan to value ratio (percentage)
  ltcRatio?: number; // Loan to cost ratio (percentage)
  covenants?: string[]; // Financial covenants
  securityType?: string; // What secures the financing
  provider?: {
    id?: string;
    name: string;
    contactInfo?: string;
  };
  status: FundingStatus;
  notes?: string;
  documents?: Document[];
}

/**
 * Funding type
 */
export enum FundingType {
  DEVELOPMENT_LOAN = 'development_loan',
  SENIOR_DEBT = 'senior_debt',
  MEZZANINE_DEBT = 'mezzanine_debt',
  EQUITY_INVESTMENT = 'equity_investment',
  CROWDFUNDING = 'crowdfunding',
  GRANT = 'grant',
  PRESALES = 'presales',
  JOINT_VENTURE = 'joint_venture',
  CONSTRUCTION_LOAN = 'construction_loan',
  BRIDGE_LOAN = 'bridge_loan',
  INTERNAL_FUNDING = 'internal_funding',
  VENTURE_DEBT = 'venture_debt',
  OTHER = 'other'
}

/**
 * Funding status
 */
export enum FundingStatus {
  PROPOSED = 'proposed',
  APPROVED = 'approved',
  ACTIVE = 'active',
  FULLY_DRAWN = 'fully_drawn',
  REPAID = 'repaid',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  PENDING_APPROVAL = 'pending_approval',
  PARTIALLY_DRAWN = 'partially_drawn'
}

/**
 * Drawdown (money received from funding source)
 */
export interface Drawdown {
  id: string;
  fundingSourceId: string;
  amount: MonetaryAmount;
  date: Date;
  status: TransactionStatus;
  purpose: string;
  notes?: string;
  transactionId?: string; // Link to the transaction record
  conditions?: string[]; // Conditions that must be met for drawdown
  documents?: Document[];
}

/**
 * Repayment to funding source
 */
export interface Repayment {
  id: string;
  fundingSourceId: string;
  amount: MonetaryAmount;
  date: Date;
  status: TransactionStatus;
  type: 'interest' | 'principal' | 'fees' | 'combined';
  principalAmount?: MonetaryAmount;
  interestAmount?: MonetaryAmount;
  feesAmount?: MonetaryAmount;
  notes?: string;
  transactionId?: string; // Link to the transaction record
  documents?: Document[];
}

/**
 * Development budget
 */
export interface DevelopmentBudget {
  id: string;
  developmentId: string;
  name: string;
  description?: string;
  totalBudget: MonetaryAmount;
  contingencyPercentage: number; // Reserve percentage for unexpected costs
  contingencyAmount: MonetaryAmount;
  startDate: Date;
  endDate: Date;
  categories: BudgetCategory[];
  version: number; // For tracking budget revisions
  status: 'draft' | 'approved' | 'active' | 'closed' | 'revised';
  createdBy: string; // User ID
  approvedBy?: string; // User ID
  approvedAt?: Date;
  notes?: string;
  documents?: Document[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Budget category
 */
export interface BudgetCategory {
  id: string;
  budgetId: string;
  name: string;
  description?: string;
  parentCategoryId?: string; // For hierarchical budget structures
  plannedAmount: MonetaryAmount;
  actualAmount: MonetaryAmount;
  varianceAmount: MonetaryAmount;
  variancePercentage: number;
  items: BudgetLineItem[];
  isMilestone?: boolean;
  milestoneDate?: Date;
  status: 'pending' | 'in_progress' | 'completed';
  notes?: string;
}

/**
 * Budget line item
 */
export interface BudgetLineItem {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  quantity: number;
  unit: string;
  unitPrice: MonetaryAmount;
  plannedAmount: MonetaryAmount;
  actualAmount: MonetaryAmount;
  varianceAmount: MonetaryAmount;
  variancePercentage: number;
  responsible?: string; // Who is responsible for this line item
  invoices?: string[]; // Invoice IDs related to this line item
  purchaseOrders?: string[]; // Purchase order IDs
  status: 'pending' | 'in_progress' | 'completed';
  notes?: string;
  documents?: Document[];
}

/**
 * Financial statement
 */
export interface FinancialStatement {
  id: string;
  developmentId: string;
  type: 'balance_sheet' | 'income_statement' | 'cash_flow_statement';
  period: string; // e.g., 'Q1 2023', 'Jan 2023'
  startDate: Date;
  endDate: Date;
  data: Record<string, any>; // Financial statement data structure
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: Date;
  status: 'draft' | 'final' | 'audited';
  documents?: Document[];
}

/**
 * Financial returns
 */
export interface FinancialReturns {
  developmentId: string;
  
  // Basic profit metrics
  totalRevenue: MonetaryAmount;
  totalCost: MonetaryAmount;
  grossProfit: MonetaryAmount;
  grossMargin: number; // percentage
  netProfit: MonetaryAmount;
  netMargin: number; // percentage
  
  // Investment metrics
  ror: number; // Return on Revenue (percentage)
  roi: number; // Return on Investment (percentage)
  irr: number; // Internal Rate of Return (percentage)
  paybackPeriod: number; // In months
  profitOnCost: number; // (Revenue - Cost) / Cost (percentage)
  breakEvenPoint?: {
    units: number; // Number of units that need to be sold to break even
    percentage: number; // Percentage of total units
    cashAmount: MonetaryAmount; // Cash flow breakeven
  };
  
  // Time-based metrics
  constructionStartDate?: Date; 
  constructionEndDate?: Date;
  salesStartDate?: Date;
  salesEndDate?: Date;
  constructionDuration: number; // In months
  salesDuration: number; // In months
  
  // Financial modeling
  npv: MonetaryAmount; // Net Present Value
  sensitivity?: {
    constructionCosts: SensitivityAnalysis;
    salesPrices: SensitivityAnalysis;
    salesVelocity: SensitivityAnalysis;
    interestRates: SensitivityAnalysis;
  };
  
  // Updated times
  lastCalculated: Date;
  calculatedBy: string;
}

/**
 * Sensitivity analysis
 */
export interface SensitivityAnalysis {
  variationPercentages: number[]; // e.g., [-10, -5, 0, 5, 10]
  npvResults: number[]; // Corresponding NPV results
  roiResults: number[]; // Corresponding ROI results
  irrResults: number[]; // Corresponding IRR results
}

/**
 * Financial risk factors
 */
export interface FinancialRiskFactors {
  developmentId: string;
  marketRisks: Risk[];
  constructionRisks: Risk[];
  financingRisks: Risk[];
  regulatoryRisks: Risk[];
  overallRiskRating: 'low' | 'medium' | 'high' | 'very_high';
  mitigationStrategies: string[];
  contingencyPlans: string[];
  stressTestResults?: Record<string, any>;
}

/**
 * Risk factor
 */
export interface Risk {
  type: string;
  description: string;
  likelihood: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  riskScore: number; // Calculated risk score
  mitigationStrategy?: string;
}

/**
 * Financial ratio analysis
 */
export interface FinancialRatioAnalysis {
  developmentId: string;
  ratios: {
    currentRatio: number;
    quickRatio: number;
    debtToEquityRatio: number;
    interestCoverageRatio: number;
    profitMargin: number;
    returnOnAssets: number;
    returnOnEquity: number;
    cashflowToDebtRatio: number;
  };
  industryBenchmarks?: {
    currentRatio: number;
    quickRatio: number;
    debtToEquityRatio: number;
    interestCoverageRatio: number;
    profitMargin: number;
    returnOnAssets: number;
    returnOnEquity: number;
    cashflowToDebtRatio: number;
  };
  analysis: string;
  calculatedAt: Date;
}