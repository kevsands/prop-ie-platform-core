// Types for the FTB buyer journey tracking

// Define BuyerPhase as both enum (for values) and type (for type checking)
export enum BuyerPhase {
  PLANNING = 'PLANNING',           // Research, education, affordability
  FINANCING = 'FINANCING',         // Mortgage approval, HTB application
  PROPERTY_SEARCH = 'PROPERTY_SEARCH', // Viewing properties, selecting options
  RESERVATION = 'RESERVATION',     // Reserving a property, paying deposit
  LEGAL_PROCESS = 'LEGAL_PROCESS', // Contracts, legal work
  CONSTRUCTION = 'CONSTRUCTION',   // For new builds: watching construction progress
  COMPLETION = 'COMPLETION',       // Closing, funds transfer
  POST_PURCHASE = 'POST_PURCHASE'  // Moving in, snagging, settling
}

// Keep the type definition for backward compatibility
export type BuyerPhaseType = keyof typeof BuyerPhase;

export type JourneyPhaseStatus = 'complete' | 'active' | 'pending';

export interface JourneyPhase {
  id: BuyerPhase;
  name: string;
  path: string;
  status: JourneyPhaseStatus;
  description: string;
  nextSteps?: string[];
  completedTasks?: string[];
}

export interface BuyerJourney {
  id: string;
  buyerId: string;
  currentPhase: BuyerPhase;
  startDate: string;
  lastUpdated: string;
  targetMoveInDate?: string;
  targetPropertyId?: string;
  phaseHistory?: BuyerPhaseHistory[];
}

export interface BuyerPhaseHistory {
  id: string;
  journeyId: string;
  phase: BuyerPhase;
  startDate: string;
  endDate?: string;
  completedTasks?: Record<string, any>
  );
  notes?: string;
}

export interface BuyerPreference {
  id: string;
  journeyId: string;
  locations: string[];
  maxDistanceToWork?: number;
  maxDistanceToSchool?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  propertyTypes: string[];
  mustHaveFeatures: string[];
  niceToHaveFeatures: string[];
  budget?: BudgetInfo;
  lastUpdated: string;
}

export interface BudgetInfo {
  id: string;
  preferenceId: string;
  maxTotalPrice: number;
  maxMonthlyPayment?: number;
  estimatedDeposit: number;
  includesHTB: boolean;
  htbAmount?: number;
  otherFundingSources?: Record<string, any>
  );
  created: string;
  updated: string;
}

export interface AffordabilityCheck {
  id: string;
  journeyId: string;
  grossAnnualIncome: number;
  partnerIncome?: number;
  monthlyDebts: number;
  depositAmount: number;
  htbAmount?: number;
  maxMortgage: number;
  maxPropertyPrice: number;
  monthlyRepayment: number;
  loanToValue: number;
  debtToIncomeRatio: number;
  lender?: string;
  calculator?: string;
  notes?: string;
  created: string;
}

export interface MortgageApplication {
  id: string;
  journeyId: string;
  lender: string;
  applicationType: string;
  applicationDate: string;
  applicationReference?: string;
  status: MortgageStatus;
  loanAmount: number;
  term: number;
  interestRate?: number;
  fixedRatePeriod?: number;
  monthlyRepayment?: number;
  approvalDate?: string;
  approvalExpiryDate?: string;
  offerReceivedDate?: string;
  offerValidUntil?: string;
  brokerName?: string;
  brokerContact?: string;
  brokerFee?: number;
  notes?: string;
  created: string;
  updated: string;
}

export type MortgageStatus = 
  | 'PREPARING'
  | 'SUBMITTED'
  | 'INFO_REQUESTED'
  | 'UNDERWRITING'
  | 'DECLINED'
  | 'APPROVED_IN_PRINCIPLE'
  | 'VALUATION_PENDING'
  | 'VALUATION_COMPLETE'
  | 'FINAL_APPROVAL'
  | 'MORTGAGE_OFFER'
  | 'EXPIRED'
  | 'DRAWDOWN'
  | 'COMPLETED';

export interface PropertyReservation {
  id: string;
  journeyId: string;
  unitId: string;
  reservationDate: string;
  reservationFee: number;
  status: ReservationStatus;
  expiryDate: string;
  termsUrl?: string;
  paymentMethod: string;
  paymentReference?: string;
  paymentStatus: string;
  paymentDate?: string;
  refundAmount?: number;
  refundDate?: string;
  contractSentDate?: string;
  contractSignedDate?: string;
  notes?: string;
  created: string;
  updated: string;
}

export type ReservationStatus = 
  | 'PENDING_PAYMENT'
  | 'ACTIVE'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'CONVERTED_TO_SALE'
  | 'REFUNDED';

export interface SnagList {
  id: string;
  journeyId: string;
  unitId: string;
  name: string;
  inspectionDate: string;
  status: string;
  items: SnagItem[];
  createdBy: string;
  created: string;
  updated: string;
}

export interface SnagItem {
  id: string;
  snagListId: string;
  title: string;
  description: string;
  room: string;
  category: string;
  severity: string;
  images: string[];
  status: string;
  reportedDate: string;
  resolvedDate?: string;
  resolution?: string;
  developerNotes?: string;
}