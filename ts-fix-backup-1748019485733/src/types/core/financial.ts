/**
 * PropIE Core Data Model - Financial Models
 * Defines financial models, transactions, and analytics
 */

import { Development } from './development';
import { Document } from '../document';
import { Professional } from './professional';
import { Sale } from './sales';
import { Unit } from './unit';
import { User } from './user';

/**
 * Development Budget interface
 * Complete financial budget for a development project
 */
export interface DevelopmentBudget {
  id: string;
  development: Development;
  version: number;
  status: BudgetStatus;
  createdBy: User;
  approvedBy?: User;
  created: Date;
  updated: Date;
  approvedDate?: Date;
  
  // Acquisition costs
  landCost: number;
  landTransferTax: number;
  legalFeesAcquisition: number;
  totalAcquisitionCosts: number;
  
  // Construction costs
  constructionCosts: ConstructionCostBreakdown;
  professionalFees: ProfessionalFeesBreakdown;
  
  // Additional costs
  marketingCosts: number;
  salesCosts: number;
  financeCosts: FinanceCostsBreakdown;
  leviesCosts: LeviesCostsBreakdown;
  contingency: number;
  contingencyPercentage: number;
  vatLiability: number;
  
  // Revenue and profit
  totalUnits: number;
  totalProjectValue: number;
  grossDevelopmentValue: number;
  totalCosts: number;
  grossProfit: number;
  grossProfitPercentage: number;
  netProfit: number;
  netProfitPercentage: number;
  
  // Cashflow projections
  cashflowProjections: CashflowProjection[];
  cashflowStartDate: Date;
  cashflowEndDate: Date;
  
  // Linked documents
  documents: Document[];
  notes?: string;
}

/**
 * Budget Status enum
 * Status of a development budget
 */
export enum BudgetStatus {
  DRAFT = 'draft',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  OUTDATED = 'outdated',
  ARCHIVED = 'archived'
}

/**
 * Construction Cost Breakdown interface
 * Detailed breakdown of construction costs
 */
export interface ConstructionCostBreakdown {
  preliminaries: number;
  preliminariesPercentage: number;
  substructure: number;
  superstructure: number;
  externalWorks: number;
  internalFinishes: number;
  fitOut: number;
  services: ServicesBreakdown;
  landscaping: number;
  roadworks: number;
  infrastructureCosts: number;
  totalPerSqM: number;
  totalConstructionCost: number;
}

/**
 * Services Breakdown interface
 * Breakdown of building services costs
 */
export interface ServicesBreakdown {
  mechanical: number;
  electrical: number;
  plumbing: number;
  securitySystems: number;
  dataAndTelecom: number;
  elevators: number;
  other: number;
  total: number;
}

/**
 * Professional Fees Breakdown interface
 * Breakdown of professional fees
 */
export interface ProfessionalFeesBreakdown {
  architect: number;
  architectPercentage: number;
  engineers: number;
  engineersPercentage: number;
  quantitySurveyor: number;
  quantitySurveyorPercentage: number;
  projectManager: number;
  projectManagerPercentage: number;
  legal: number;
  planningConsultant: number;
  other: number;
  totalProfessionalFees: number;
  totalProfessionalFeesPercentage: number;
}

/**
 * Finance Costs Breakdown interface
 * Breakdown of financing costs
 */
export interface FinanceCostsBreakdown {
  interestRate: number;
  loanAmount: number;
  loanPeriodMonths: number;
  loanArrangementFee: number;
  loanExitFee: number;
  interestCosts: number;
  totalFinanceCosts: number;
}

/**
 * Levies Costs Breakdown interface
 * Breakdown of development levies
 */
export interface LeviesCostsBreakdown {
  planningLevies: number;
  infrastructureLevies: number;
  communityContributions: number;
  parkingLevies: number;
  otherLevies: number;
  totalLeviesCosts: number;
}

/**
 * Cashflow Projection interface
 * Projected cashflow for a period
 */
export interface CashflowProjection {
  period: Date;
  periodNumber: number;
  
  // Inflows
  sales: number;
  otherIncome: number;
  totalInflows: number;
  
  // Outflows
  landCosts: number;
  constructionCosts: number;
  professionalFees: number;
  marketingCosts: number;
  financeCosts: number;
  leviesCosts: number;
  vatPayments: number;
  otherOutflows: number;
  totalOutflows: number;
  
  // Net and cumulative positions
  netCashflow: number;
  cumulativeCashflow: number;
}

/**
 * Unit Pricing interface
 * Pricing details for a unit
 */
export interface UnitPricing {
  id: string;
  unit: Unit;
  basePrice: number;
  minimumPrice: number;
  targetPrice: number;
  salePrice?: number;
  pricePerSqM: number;
  customizationOptions: CustomizationPricing[];
  vatRate: number;
  isVatInclusive: boolean;
  helpToBuyEligible: boolean;
  priceHistory: PriceHistoryItem[];
  specialOffers: SpecialOffer[];
  status: PricingStatus;
  updatedBy: User;
  updatedAt: Date;
}

/**
 * Customization Pricing interface
 * Pricing for unit customization options
 */
export interface CustomizationPricing {
  optionId: string;
  name: string;
  basePrice: number;
  costPrice: number;
  profit: number;
  profitMargin: number;
  vatRate: number;
  isVatInclusive: boolean;
}

/**
 * Price History Item interface
 * Historical unit price
 */
export interface PriceHistoryItem {
  price: number;
  effectiveDate: Date;
  updatedBy: User;
  reason?: string;
}

/**
 * Special Offer interface
 * Promotional pricing or incentives
 */
export interface SpecialOffer {
  id: string;
  name: string;
  description: string;
  discountType: 'percentage' | 'amount' | 'item';
  discountValue: number;
  discountItem?: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  terms: string;
}

/**
 * Pricing Status enum
 * Current status of unit pricing
 */
export enum PricingStatus {
  DRAFT = 'draft',
  APPROVED = 'approved',
  PUBLISHED = 'published',
  RESERVED = 'reserved',
  SOLD = 'sold'
}

/**
 * Transaction interface
 * Financial transactions for a development
 */
export interface Transaction {
  id: string;
  development: Development;
  sale?: Sale;
  transactionType: TransactionType;
  category: TransactionCategory;
  amount: number;
  currency: string;
  date: Date;
  description: string;
  payee?: User | Professional;
  payeeType: 'user' | 'professional' | 'company' | 'other';
  payeeName: string;
  reference?: string;
  status: TransactionStatus;
  documents: Document[];
  createdBy: User;
  approvedBy?: User;
  created: Date;
  updated: Date;
  budgetCode?: string;
  taxRate?: number;
  taxAmount?: number;
  costCenter?: string;
}

/**
 * Transaction Type enum
 * Type of financial transaction
 */
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  REFUND = 'refund',
  TRANSFER = 'transfer',
  ADJUSTMENT = 'adjustment'
}

/**
 * Transaction Category enum
 * Categories for transactions
 */
export enum TransactionCategory {
  SALES = 'sales',
  DEPOSIT = 'deposit',
  LAND_ACQUISITION = 'land_acquisition',
  CONSTRUCTION = 'construction',
  PROFESSIONAL_FEES = 'professional_fees',
  MARKETING = 'marketing',
  ADMIN = 'administrative',
  FINANCE = 'finance',
  LEVIES = 'levies',
  TAXES = 'taxes',
  UTILITIES = 'utilities',
  INSURANCE = 'insurance',
  OTHER = 'other'
}

/**
 * Transaction Status enum
 * Current status of a transaction
 */
export enum TransactionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  RECONCILED = 'reconciled',
  DISPUTED = 'disputed'
}

/**
 * Financial Report interface
 * Generated financial report
 */
export interface FinancialReport {
  id: string;
  development: Development;
  reportType: ReportType;
  period: {
    startDate: Date;
    endDate: Date;
  };
  generated: Date;
  generatedBy: User;
  fileUrl?: string;
  status: ReportStatus;
  data: any; // Will vary based on report type
  notes?: string;
  version: number;
}

/**
 * Report Type enum
 * Types of financial reports
 */
export enum ReportType {
  CASHFLOW = 'cashflow',
  BUDGET_VS_ACTUAL = 'budget_vs_actual',
  PROFIT_LOSS = 'profit_loss',
  SALES_ANALYSIS = 'sales_analysis',
  COST_ANALYSIS = 'cost_analysis',
  VARIANCE_ANALYSIS = 'variance_analysis'
}

/**
 * Report Status enum
 * Status of a generated report
 */
export enum ReportStatus {
  GENERATING = 'generating',
  COMPLETE = 'complete',
  FAILED = 'failed',
  ARCHIVED = 'archived'
}

/**
 * Financial Analysis interface
 * Analysis of financial performance
 */
export interface FinancialAnalysis {
  id: string;
  development: Development;
  analysisDate: Date;
  generatedBy: User;
  
  // Key metrics
  grossDevelopmentValue: number;
  totalCosts: number;
  grossProfit: number;
  grossProfitMargin: number;
  netProfit: number;
  netProfitMargin: number;
  returnOnInvestment: number;
  internalRateOfReturn: number;
  
  // Budget performance
  originalBudget: number;
  actualSpend: number;
  variance: number;
  variancePercentage: number;
  
  // Sales performance
  targetSalesValue: number;
  actualSalesValue: number;
  averageSalePrice: number;
  salesVelocity: number; // Units per month
  
  // Cost analysis
  costPerSqM: number;
  landCostPercentage: number;
  constructionCostPercentage: number;
  professionalFeesPercentage: number;
  otherCostsPercentage: number;
  
  // Additional metrics
  breakEvenPoint: number;
  breakEvenPercentage: number;
  peakFunding: number;
  
  // Risk metrics
  sensitivityAnalysis: SensitivityAnalysis;
  notes?: string;
}

/**
 * Sensitivity Analysis interface
 * Impact of changes to key variables
 */
export interface SensitivityAnalysis {
  salesPriceVariations: VariationImpact[];
  constructionCostVariations: VariationImpact[];
  timelineVariations: VariationImpact[];
  interestRateVariations: VariationImpact[];
}

/**
 * Variation Impact interface
 * Impact of variation in a parameter
 */
export interface VariationImpact {
  variationPercentage: number; // E.g., -10%, -5%, +5%, +10%
  profitImpact: number;
  profitMarginImpact: number;
  irr: number;
}

/**
 * Financial Metric interface
 * Key financial metrics for dashboard
 */
export interface FinancialMetric {
  id: string;
  development: Development;
  metricName: string;
  metricValue: number;
  metricUnit: string;
  targetValue?: number;
  varianceFromTarget?: number;
  variancePercentage?: number;
  thresholdWarning?: number;
  thresholdCritical?: number;
  trend: number[]; // Last n values
  trendPeriods: Date[]; // Periods for trend values
  isPositiveTrend: boolean;
  category: 'sales' | 'costs' | 'profit' | 'cashflow' | 'risk';
  updated: Date;
}

/**
 * Helper to calculate profit margins
 */
export function calculateProfitMargins(
  budget: DevelopmentBudget
): { grossProfitMargin: number; netProfitMargin: number } {
  const grossProfitMargin = (budget.grossProfit / budget.grossDevelopmentValue) * 100;
  const netProfitMargin = (budget.netProfit / budget.grossDevelopmentValue) * 100;
  
  return {
    grossProfitMargin,
    netProfitMargin
  };
}

/**
 * Helper to calculate return on investment
 */
export function calculateROI(
  investmentAmount: number,
  profit: number
): number {
  return (profit / investmentAmount) * 100;
}

/**
 * Helper to calculate price per square meter
 */
export function calculatePricePerSqM(
  price: number,
  size: number
): number {
  return price / size;
}

/**
 * Helper function to get transaction summary by category
 */
export function getTransactionSummaryByCategory(
  transactions: Transaction[]
): Record<TransactionCategory, number> {
  return transactions.reduce((summarytransaction) => {
    const category = transaction.category;
    const amount = transaction.transactionType === TransactionType.EXPENSE ? -transaction.amount : transaction.amount;
    
    summary[category] = (summary[category] || 0) + amount;
    return summary;
  }, {} as Record<TransactionCategory, number>);
}