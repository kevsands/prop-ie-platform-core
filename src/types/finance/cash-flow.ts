/**
 * Cash Flow Projection Models
 * 
 * These interfaces define cash flow projections for real estate development projects,
 * including both historic cash flows and forecasts.
 */

import { MonetaryAmount, CurrencyCode } from './development-finance';

/**
 * Cash Flow Projection
 * Contains all cash flow data for a development project
 */
export interface CashFlowProjection {
  id: string;
  developmentId: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  periods: CashFlowPeriod[];
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'annually';
  baseCurrency: CurrencyCode;
  version: number;
  status: 'draft' | 'approved' | 'active' | 'archived';
  createdBy: string;
  approvedBy?: string;
  approvedAt?: Date;
  lastUpdated: Date;
  scenarioType: 'base' | 'optimistic' | 'pessimistic' | 'custom';
  assumptions?: CashFlowAssumptions;
}

/**
 * Cash Flow Period
 * Represents a single period in the cash flow projection
 */
export interface CashFlowPeriod {
  id: string;
  cashFlowId: string;
  periodNumber: number;
  startDate: Date;
  endDate: Date;
  isActual: boolean; // Whether this period contains actual or projected figures
  
  // Inflows
  salesRevenue: MonetaryAmount;
  rentalIncome: MonetaryAmount;
  fundingDrawdowns: MonetaryAmount;
  otherInflows: MonetaryAmount;
  totalInflows: MonetaryAmount;
  
  // Outflows
  landCosts: MonetaryAmount;
  constructionCosts: MonetaryAmount;
  professionalFees: MonetaryAmount;
  marketingCosts: MonetaryAmount;
  financeCosts: MonetaryAmount;
  legalFees: MonetaryAmount;
  contingencyCosts: MonetaryAmount;
  taxPayments: MonetaryAmount;
  otherOutflows: MonetaryAmount;
  totalOutflows: MonetaryAmount;
  
  // Net cash flow
  netCashFlow: MonetaryAmount;
  cumulativeCashFlow: MonetaryAmount;
  
  // Additional details
  categories: CashFlowCategory[];
  notes?: string;
}

/**
 * Cash Flow Category
 * Represents a category of cash flow items within a period
 */
export interface CashFlowCategory {
  id: string;
  periodId: string;
  name: string;
  description?: string;
  type: 'inflow' | 'outflow';
  plannedAmount: MonetaryAmount;
  actualAmount: MonetaryAmount;
  variance: MonetaryAmount;
  variancePercentage: number;
  subcategories?: CashFlowCategory[];
  items?: CashFlowLineItem[];
}

/**
 * Cash Flow Line Item
 * Represents a specific cash flow item within a category
 */
export interface CashFlowLineItem {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  type: 'inflow' | 'outflow';
  plannedAmount: MonetaryAmount;
  actualAmount: MonetaryAmount;
  variance: MonetaryAmount;
  variancePercentage: number;
  date?: Date;
  transactionId?: string; // Reference to actual transaction if this is an actual line item
  budgetLineItemId?: string; // Reference to budget line item
  notes?: string;
}

/**
 * Cash Flow Assumptions
 * Documents the assumptions used in creating the cash flow projection
 */
export interface CashFlowAssumptions {
  salesPriceAssumptions: {
    initialPrice: MonetaryAmount;
    priceGrowthRate: number; // Percentage
    salesVelocity: number; // Units per period
    seasonalityFactors?: number[]; // Adjustment factors by period
  };
  
  constructionAssumptions: {
    totalDuration: number; // In periods
    costProfile: number[]; // Percentage of costs by period
    contingencyRate: number; // Percentage
  };
  
  financingAssumptions: {
    interestRate: number; // Percentage
    loanToValue: number; // Percentage
    loanToConstruction: number; // Percentage
    drawdownProfile: number[]; // Percentage of loan by period
    repaymentProfile: number[]; // Percentage of repayment by period
  };
  
  operatingAssumptions?: {
    vacancyRate?: number; // Percentage
    managementFees?: number; // Percentage
    maintenanceCosts?: number; // Percentage
    propertyTaxRate?: number; // Percentage
  };
  
  taxAssumptions?: {
    corporateTaxRate: number; // Percentage
    stampDutyRate: number; // Percentage
    vatRate: number; // Percentage
    capitalGainsTaxRate?: number; // Percentage
  };
  
  inflationAssumptions?: {
    generalInflationRate: number; // Percentage
    constructionInflationRate: number; // Percentage
    costInflationVariance: Record<string, number>; // Inflation rate variances by cost category
  };
  
  discountRate: number; // Percentage - used for NPV calculations
  
  customAssumptions?: Record<string, any>; // For any additional assumptions
}

/**
 * Cash Flow Summary
 * Provides key metrics and summaries from the cash flow projection
 */
export interface CashFlowSummary {
  developmentId: string;
  cashFlowId: string;
  
  // Total inflows and outflows
  totalInflows: MonetaryAmount;
  totalOutflows: MonetaryAmount;
  netCashFlow: MonetaryAmount;
  
  // Key metrics
  peakNegativeCashFlow: MonetaryAmount;
  peakNegativeCashFlowPeriod: number;
  breakEvenPeriod: number; // Period when cumulative cash flow becomes positive
  cashFlowPositiveDate?: Date;
  
  // Period-based metrics
  periodsWithNegativeCashFlow: number;
  periodsWithPositiveCashFlow: number;
  
  // Financial metrics
  npv: MonetaryAmount; // Net Present Value
  irr: number; // Internal Rate of Return (percentage)
  paybackPeriod: number; // Number of periods
  profitability: number; // Total cash inflow / Total cash outflow
  
  // Cash flow stability metrics
  volatilityIndex: number; // Measure of cash flow volatility
  
  // Liquidity indicators
  liquidityRatio: number; // Current inflows / Current outflows
  
  // Distribution of cash flows
  inflowDistribution: Record<string, number>; // Percentage by category
  outflowDistribution: Record<string, number>; // Percentage by category
  
  // Last calculated timestamp
  lastCalculated: Date;
}

/**
 * Cash Flow Variance Analysis
 * Compares actual cash flows with projected cash flows
 */
export interface CashFlowVarianceAnalysis {
  developmentId: string;
  cashFlowId: string;
  periodId?: string; // If analyzing a specific period
  
  // Overview
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  
  // Total variances
  totalInflowVariance: MonetaryAmount;
  totalInflowVariancePercentage: number;
  totalOutflowVariance: MonetaryAmount;
  totalOutflowVariancePercentage: number;
  netCashFlowVariance: MonetaryAmount;
  netCashFlowVariancePercentage: number;
  
  // Variance by category
  categoryVariances: Array<{
    categoryName: string;
    type: 'inflow' | 'outflow';
    plannedAmount: MonetaryAmount;
    actualAmount: MonetaryAmount;
    variance: MonetaryAmount;
    variancePercentage: number;
    impact: 'positive' | 'negative' | 'neutral';
    significance: 'high' | 'medium' | 'low';
  }>
  );
  // Trend analysis
  trendAnalysis?: {
    improvingCategories: string[];
    worseningCategories: string[];
    stableCategories: string[];
  };
  
  // Recommendations based on variance
  recommendations?: string[];
  
  // Analysis summary
  summary: string;
  
  // Last analyzed timestamp
  analyzedAt: Date;
  analyzedBy: string;
}

/**
 * Discounted Cash Flow Analysis
 * Performs DCF analysis on the cash flow projection
 */
export interface DiscountedCashFlowAnalysis {
  developmentId: string;
  cashFlowId: string;
  
  // Configuration
  discountRate: number; // Percentage
  terminalValue?: MonetaryAmount;
  terminalGrowthRate?: number; // Percentage
  
  // Results
  periodicDcf: Array<{
    periodNumber: number;
    cashFlow: MonetaryAmount;
    discountFactor: number;
    discountedCashFlow: MonetaryAmount;
  }>
  );
  // Summary metrics
  npv: MonetaryAmount; // Net Present Value
  irr: number; // Internal Rate of Return (percentage)
  mirr?: number; // Modified Internal Rate of Return (percentage)
  profitabilityIndex: number; // NPV / Initial Investment
  discountedPaybackPeriod: number; // Number of periods
  
  // For sensitivity analysis
  discountRateSensitivity?: Array<{
    discountRate: number;
    npv: MonetaryAmount;
  }>
  );
  // Terminal value contribution
  terminalValueContribution?: number; // Percentage of NPV from terminal value
  
  // Last calculated timestamp
  lastCalculated: Date;
}

/**
 * Cash Flow Scenario
 * Represents an alternative cash flow scenario for comparison
 */
export interface CashFlowScenario {
  id: string;
  developmentId: string;
  name: string;
  description?: string;
  type: 'optimistic' | 'pessimistic' | 'custom' | 'market_downturn' | 'accelerated_sales' | 'increased_costs';
  baseScenarioId: string; // Reference to the base scenario
  modifiedAssumptions: Partial<CashFlowAssumptions>
  );
  // Result differences
  netCashFlowDifference: MonetaryAmount;
  netCashFlowDifferencePercentage: number;
  npvDifference: MonetaryAmount;
  npvDifferencePercentage: number;
  irrDifference: number; // Percentage points
  paybackPeriodDifference: number; // Periods
  
  // Likelihood assessment
  probabilityAssessment?: number; // Estimated probability (0-100%)
  
  // Scenario-specific metrics
  scenarioSpecificMetrics?: Record<string, any>
  );
  // Creation metadata
  createdBy: string;
  createdAt: Date;
  lastUpdated: Date;
}