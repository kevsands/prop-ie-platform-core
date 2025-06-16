/**
 * PropIE Core Data Model - Investor
 * Defines investor profiles, investments, and analytics
 */

import { Document } from '../document';
import { Development } from './development';
import { DevelopmentBudget } from './financial';
import { Unit } from './unit';
import { User } from './user';

/**
 * Investor interface
 * Represents an investor in property developments
 */
export interface Investor {
  id: string;
  user: User;
  investorProfile: InvestorProfile;
  investments: Investment[];
  portfolio: Portfolio;
  watchlist: {
    developments: Development[];
    units: Unit[];
  };
  notifications: InvestorNotification[];
  documents: Document[];
  accountManager?: User;
  status: InvestorStatus;
  created: Date;
  updated: Date;
}

/**
 * Investor Status enum
 * Status of an investor account
 */
export enum InvestorStatus {
  PENDING_APPROVAL = 'pending_approval',
  ACTIVE = 'active',
  DORMANT = 'dormant',
  SUSPENDED = 'suspended',
  CLOSED = 'closed'
}

/**
 * Investor Profile interface
 * Details about an investor's preferences and background
 */
export interface InvestorProfile {
  id: string;
  investmentPreferences: {
    developmentTypes: string[];
    locationPreferences: string[];
    minInvestmentAmount: number;
    maxInvestmentAmount: number;
    targetReturn: number;
    riskTolerance: RiskTolerance;
    investmentHorizon: InvestmentHorizon;
    interestInOffers: boolean;
  };
  financialProfile: {
    annualIncome: IncomeRange;
    netWorth: NetWorthRange;
    investableAssets: number;
    sourceOfFunds: string;
    incomeVerified: boolean;
    netWorthVerified: boolean;
  };
  accreditationStatus: AccreditationStatus;
  accreditationDocuments: Document[];
  accreditationExpiryDate?: Date;
  investmentExperience: InvestmentExperience;
  taxResidency: string;
  taxIdentificationNumber?: string;
  investmentEntityType: 'individual' | 'company' | 'trust' | 'partnership';
  companyDetails?: {
    name: string;
    registrationNumber: string;
    registrationCountry: string;
    taxNumber: string;
    directors: string[];
  };
  kycStatus: 'not_started' | 'in_progress' | 'completed' | 'rejected';
  kycDocuments: Document[];
  bankDetails?: {
    accountHolder: string;
    bankName: string;
    accountNumber: string;
    sortCode: string;
    iban: string;
    swift: string;
  };
}

/**
 * Risk Tolerance enum
 * Investor risk tolerance levels
 */
export enum RiskTolerance {
  CONSERVATIVE = 'conservative',
  MODERATE = 'moderate',
  AGGRESSIVE = 'aggressive'
}

/**
 * Investment Horizon enum
 * Investor preferred timeframes
 */
export enum InvestmentHorizon {
  SHORT_TERM = 'short_term', // <2 years
  MEDIUM_TERM = 'medium_term', // 2-5 years
  LONG_TERM = 'long_term' // > 5 years
}

/**
 * Income Range enum
 * Investor income brackets
 */
export enum IncomeRange {
  UNDER_50K = 'under_50k',
  FROM_50K_TO_100K = 'from_50k_to_100k',
  FROM_100K_TO_250K = 'from_100k_to_250k',
  FROM_250K_TO_500K = 'from_250k_to_500k',
  OVER_500K = 'over_500k'
}

/**
 * Net Worth Range enum
 * Investor net worth brackets
 */
export enum NetWorthRange {
  UNDER_250K = 'under_250k',
  FROM_250K_TO_1M = 'from_250k_to_1m',
  FROM_1M_TO_5M = 'from_1m_to_5m',
  FROM_5M_TO_25M = 'from_5m_to_25m',
  OVER_25M = 'over_25m'
}

/**
 * Accreditation Status enum
 * Status of investor accreditation
 */
export enum AccreditationStatus {
  NOT_APPLICABLE = 'not_applicable',
  PENDING = 'pending',
  ACCREDITED = 'accredited',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

/**
 * Investment Experience enum
 * Level of investor experience
 */
export enum InvestmentExperience {
  NONE = 'none',
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  EXPERIENCED = 'experienced',
  EXPERT = 'expert'
}

/**
 * Investment interface
 * Single investment made by an investor
 */
export interface Investment {
  id: string;
  investor: Investor;
  development: Development;
  units?: Unit[];
  investmentType: InvestmentType;
  status: InvestmentStatus;
  
  // Financial details
  amount: number;
  currency: string;
  equity?: number; // percentage of ownership
  ownershipStructure?: string;
  expectedReturn: number;
  projectedIRR?: number;
  projectMultiple?: number;
  
  // Timeline
  commitmentDate: Date;
  fundingDate: Date;
  dueDate?: Date;
  exitDate?: Date;
  
  // Associated entities and structure
  investmentVehicle?: InvestmentVehicle;
  legalEntity?: string;
  coInvestors?: Investor[];
  
  // Documents and agreements
  investmentAgreement: Document;
  termSheet?: Document;
  documents: Document[];
  
  // Returns and distributions
  distributions: Distribution[];
  currentValue: number;
  valuationDate: Date;
  totalReturns: number;
  roi: number;
  
  // Status and logs
  updates: InvestmentUpdate[];
  notes?: string;
  created: Date;
  updated: Date;
}

/**
 * Investment Type enum
 * Types of property investments
 */
export enum InvestmentType {
  EQUITY = 'equity',
  DEBT = 'debt',
  MEZZANINE = 'mezzanine',
  PREFERRED_EQUITY = 'preferred_equity',
  SYNDICATION = 'syndication',
  FUND = 'fund',
  JOINT_VENTURE = 'joint_venture',
  CONVERTIBLE_LOAN = 'convertible_loan'
}

/**
 * Investment Status enum
 * Current status of an investment
 */
export enum InvestmentStatus {
  SCREENING = 'screening',
  DUE_DILIGENCE = 'due_diligence',
  COMMITTED = 'committed',
  APPROVED = 'approved',
  EXECUTED = 'executed',
  FUNDED = 'funded',
  ACTIVE = 'active',
  PERFORMING = 'performing',
  UNDERPERFORMING = 'underperforming',
  AT_RISK = 'at_risk',
  DEFAULT = 'default',
  COMPLETED = 'completed',
  EXITED = 'exited',
  CANCELLED = 'cancelled'
}

/**
 * Investment Vehicle interface
 * Legal structure holding investments
 */
export interface InvestmentVehicle {
  id: string;
  name: string;
  type: 'spv' | 'fund' | 'trust' | 'partnership' | 'company';
  jurisdiction: string;
  registrationNumber: string;
  taxIdentificationNumber: string;
  establishedDate: Date;
  investments: Investment[];
  investors: Investor[];
  managedBy: User;
  documents: Document[];
  bankDetails: {
    accountHolder: string;
    bankName: string;
    accountNumber: string;
    sortCode: string;
    iban: string;
    swift: string;
  };
}

/**
 * Distribution interface
 * Income or capital distribution to investors
 */
export interface Distribution {
  id: string;
  investment: Investment;
  distributionType: 'interest' | 'dividend' | 'capital_return' | 'profit_share';
  amount: number;
  currency: string;
  distributionDate: Date;
  description: string;
  status: 'scheduled' | 'processing' | 'completed' | 'cancelled';
  paymentReference?: string;
  documents: Document[];
  taxWithheld?: number;
  netAmount: number;
}

/**
 * Investment Update interface
 * Updates on investment performance
 */
export interface InvestmentUpdate {
  id: string;
  investment: Investment;
  updateDate: Date;
  title: string;
  content: string;
  author: User;
  isPublic: boolean;
  metrics: {
    currentValue: number;
    changePercentage: number;
    keyHighlights: string[];
    risks: string[];
  };
  documents: Document[];
  sentToInvestors: boolean;
  acknowledgements: {
    investor: Investor;
    timestamp: Date;
  }[];
}

/**
 * Portfolio interface
 * Collection of investor's investments
 */
export interface Portfolio {
  id: string;
  investor: Investor;
  investments: Investment[];
  
  // Summary metrics
  totalInvested: number;
  currentValue: number;
  unrealizedGain: number;
  unrealizedGainPercentage: number;
  realizedGain: number;
  totalReturn: number;
  totalReturnPercentage: number;
  irr: number; // Internal Rate of Return
  
  // Allocations
  allocationByType: Record<InvestmentType, number>; // percentage
  allocationByDevelopment: Record<string, number>; // percentage
  allocationByRegion: Record<string, number>; // percentage
  allocationByRisk: Record<string, number>; // percentage
  
  // Performance tracking
  historicalPerformance: PortfolioSnapshot[];
  yearToDateReturn: number;
  oneYearReturn: number;
  threeYearReturn: number;
  fiveYearReturn: number;
  sinceInceptionReturn: number;
  
  // Projections
  projectedIncome: number;
  projectedCapitalGrowth: number;
  projectedCompletionDates: Record<string, Date>; // investmentId -> date
  
  // Risk metrics
  volatility: number;
  sharpeRatio?: number;
  correlationToMarket?: number;
  
  // Cash flow
  cashInflows: number;
  cashOutflows: number;
  netCashFlow: number;
  
  // Status
  lastUpdated: Date;
  document?: Document; // Portfolio report
}

/**
 * Portfolio Snapshot interface
 * Point-in-time value of portfolio
 */
export interface PortfolioSnapshot {
  date: Date;
  totalValue: number;
  investedCapital: number;
  unrealizedGain: number;
  realizedGain: number;
  cashInflow: number;
  cashOutflow: number;
  performanceContributionByInvestment: Record<string, number>; // investmentId -> contribution
}

/**
 * Investment Opportunity interface
 * Property investment opportunity
 */
export interface InvestmentOpportunity {
  id: string;
  title: string;
  development: Development;
  description: string;
  status: OpportunityStatus;
  
  // Financial details
  minimumInvestment: number;
  targetRaise: number;
  maxRaise: number;
  totalRaised: number;
  investmentType: InvestmentType;
  projectedReturns: {
    irr: number;
    multiple: number;
    equityMultiple: number;
    targetYield: number;
    paybackPeriod: number;
  };
  
  // Timeline
  launchDate: Date;
  closingDate: Date;
  constructionStartDate?: Date;
  estimatedCompletionDate: Date;
  estimatedExitDate: Date;
  
  // Marketing materials
  highlights: string[];
  riskFactors: string[];
  images: string[];
  brochureUrl?: string;
  financialProjectionsUrl?: string;
  
  // Investment terms
  investmentStructure: string;
  feesStructure: {
    acquisitionFee?: number;
    assetManagementFee?: number;
    dispositionFee?: number;
    performanceFee?: number;
    otherFees: Array<{ name: string; amount: number; basis: string }>\n  );
  };
  
  // Documentation
  documents: Document[];
  
  // Access and visibility
  visibleTo: 'all' | 'accredited_only' | 'selected';
  selectedInvestors?: Investor[];
  
  // Investor activity
  viewCount: number;
  interestedInvestors: Array<{ investor: Investor; amount: number }>\n  );
  commitments: Array<{
    investor: Investor;
    amount: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    date: Date;
  }>\n  );
  // Metadata
  createdBy: User;
  created: Date;
  updated: Date;
}

/**
 * Opportunity Status enum
 * Status of an investment opportunity
 */
export enum OpportunityStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  PUBLISHED = 'published',
  ACCEPTING_INVESTMENTS = 'accepting_investments',
  FULLY_SUBSCRIBED = 'fully_subscribed',
  CLOSED = 'closed',
  CANCELLED = 'cancelled'
}

/**
 * Investor Notification interface
 * Notifications for investors
 */
export interface InvestorNotification {
  id: string;
  investor: Investor;
  title: string;
  message: string;
  type: 'general' | 'opportunity' | 'investment' | 'distribution' | 'document' | 'alert';
  priority: 'low' | 'medium' | 'high';
  relatedTo?: {
    type: 'opportunity' | 'investment' | 'distribution' | 'document';
    id: string;
  };
  createdBy: User;
  createdAt: Date;
  read: boolean;
  readAt?: Date;
  expiresAt?: Date;
  actions?: Array<{
    label: string;
    url: string;
  }>\n  );
}

/**
 * Market Analysis interface
 * Real estate market research for investors
 */
export interface MarketAnalysis {
  id: string;
  title: string;
  region: string;
  createdBy: User;
  publicationDate: Date;
  
  // Market indicators
  marketIndicators: {
    housingPriceIndex: number;
    housingPriceYearOverYearChange: number;
    rentalYield: number;
    averagePricePerSqM: number;
    averageRentPerSqM: number;
    affordabilityIndex: number;
    vacancyRate: number;
    absorptionRate: number;
    monthsOfInventory: number;
    constructionStarts: number;
    constructionCompletions: number;
    planningApplications: number;
    planningApprovals: number;
  };
  
  // Trends and forecasts
  trends: {
    priceHistory: Array<{ date: Date; price: number }>\n  );
    rentHistory: Array<{ date: Date; rent: number }>\n  );
    supplyForecast: Array<{ date: Date; units: number }>\n  );
    demandForecast: Array<{ date: Date; units: number }>\n  );
    priceForecast: Array<{ date: Date; price: number; confidence: number }>\n  );
  };
  
  // Economic indicators
  economicIndicators: {
    gdpGrowth: number;
    unemployment: number;
    inflation: number;
    interestRate: number;
    consumerConfidence: number;
    demographicTrends: string;
    netMigration: number;
    householdFormation: number;
  };
  
  // Regulatory environment
  regulatoryEnvironment: {
    recentRegulations: string;
    planningRestrictions: string;
    taxChanges: string;
    governmentIncentives: string;
  };
  
  // Comparative analysis
  comparativeAnalysis: {
    comparisonRegions: string[];
    relative: {
      priceGrowth: Record<string, number>\n  );
      rentalYield: Record<string, number>\n  );
      affordability: Record<string, number>\n  );
      investmentOpportunity: Record<string, number>\n  );
    };
  };
  
  // SWOT analysis
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  
  // Investment recommendations
  investmentRecommendations: {
    recommendedAreas: string[];
    recommendedPropertyTypes: string[];
    investmentStrategy: string;
    riskAssessment: string;
    timeHorizon: string;
  };
  
  // Document and metadata
  reportUrl: string;
  sources: string[];
  methodology: string;
  disclaimer: string;
  isPublic: boolean;
  tags: string[];
}

/**
 * Investment Performance interface
 * Performance metrics for investment analysis
 */
export interface InvestmentPerformance {
  id: string;
  investment: Investment;
  calculationDate: Date;
  
  // Return metrics
  totalReturn: number;
  totalReturnPercentage: number;
  annualizedReturn: number;
  irr: number;
  cashOnCash: number;
  equityMultiple: number;
  paybackPeriod: number;
  
  // Cash flow
  totalDistributions: number;
  distributionYield: number;
  netCashFlow: number;
  
  // Valuation
  initialInvestment: number;
  currentValue: number;
  valueIncrease: number;
  valueIncreasePercentage: number;
  lastValuationDate: Date;
  valuationMethod: string;
  
  // Risk metrics
  volatility: number;
  beta?: number;
  sharpeRatio?: number;
  
  // Comparison to targets
  targetIRR: number;
  irrVarianceFromTarget: number;
  targetEquityMultiple: number;
  equityMultipleVarianceFromTarget: number;
  
  // Comparison to benchmark
  benchmark: string;
  benchmarkReturn: number;
  outperformance: number;
  
  // Development metrics
  developmentProgress: number;
  budgetVariance: number;
  scheduleVariance: number;
  salesProgress: number;
  
  // Forecasts
  forecastReturn: number;
  forecastIRR: number;
  forecastExitDate: Date;
  forecastExitValue: number;
  
  // Notes and metadata
  notes: string;
  calculatedBy: User;
}

/**
 * Helper function to calculate key investment metrics
 */
export function calculateInvestmentMetrics(
  initialInvestment: number,
  currentValue: number,
  cashFlows: Array<{ amount: number; date: Date }>
): {
  totalReturn: number;
  totalReturnPercentage: number;
  irr: number;
  annualizedReturn: number;
} {
  // Calculate total return
  const totalReturn = currentValue - initialInvestment + 
    cashFlows.reduce((sumcf: any) => sum + cf.amount0);
  
  const totalReturnPercentage = (totalReturn / initialInvestment) * 100;
  
  // Simplified IRR calculation (placeholder - would use proper financial function in real implementation)
  // This is just an approximation for the example
  const irr = 0;
  
  // Calculate time period in years
  const firstDate = new Date(Math.min(
    ...cashFlows.map(cf => cf.date.getTime())
  ));
  const lastDate = new Date();
  const yearsElapsed = (lastDate.getTime() - firstDate.getTime()) / 
    (1000 * 60 * 60 * 24 * 365);
  
  // Annualized return calculation
  const annualizedReturn = yearsElapsed> 0 
    ? Math.pow(1 + totalReturnPercentage / 100, 1 / yearsElapsed) - 1 
    : 0;
  
  return {
    totalReturn,
    totalReturnPercentage,
    irr,
    annualizedReturn: annualizedReturn * 100
  };
}

/**
 * Helper to check if an investor meets opportunity criteria
 */
export function checkInvestorEligibility(
  investor: Investor,
  opportunity: InvestmentOpportunity
): {
  eligible: boolean;
  reasons?: string[];
} {
  const reasons: string[] = [];
  
  // Check accreditation if required
  if (
    opportunity.visibleTo === 'accredited_only' &&
    investor.investorProfile.accreditationStatus !== AccreditationStatus.ACCREDITED
  ) {
    reasons.push('Investor is not accredited');
  }
  
  // Check minimum investment amount
  if (
    investor.investorProfile.investmentPreferences.maxInvestmentAmount < 
    opportunity.minimumInvestment
  ) {
    reasons.push('Investment minimum exceeds investor maximum investment preference');
  }
  
  // Check investment type preference
  if (
    !investor.investorProfile.investmentPreferences.developmentTypes.some(
      type => opportunity.development.buildingType?.includes(type)
    )
  ) {
    reasons.push('Development type does not match investor preferences');
  }
  
  return {
    eligible: reasons.length === 0,
    reasons: reasons.length> 0 ? reasons : undefined
  };
}

{/* Auto-added closing tags */}
</InvestmentType>