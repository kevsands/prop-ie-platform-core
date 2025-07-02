// Enhanced KYC Type Definitions
// These types correspond to the enhanced Prisma schema

export interface KYCVerification {
  id: string;
  userId: string;
  
  // Personal Information
  fullName: string;
  dateOfBirth: Date;
  nationality: string;
  ppsNumber: string;
  
  // Identity Verification
  idType: IDType;
  idNumber: string;
  idExpiryDate: Date;
  idFrontImageId?: string;
  idBackImageId?: string;
  selfieImageId?: string;
  
  // Address Information
  addressLine1: string;
  addressLine2?: string;
  city: string;
  county: string;
  eircode: string;
  addressProofType: AddressProofType;
  addressProofImageId?: string;
  
  // AML/Compliance
  sourceOfFunds: SourceOfFunds;
  isPoliticallyExposed: boolean;
  isHighRiskCountry: boolean;
  
  // Verification Status
  status: KYCStatus;
  progress: number;
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  reviewNotes?: string;
  
  // Compliance Scoring
  riskScore?: number;
  complianceFlags: string[];
  
  // Audit Trail
  created: Date;
  updated: Date;
  metadata?: any;
}

export interface KYCVerificationHistory {
  id: string;
  verificationId: string;
  previousStatus?: KYCStatus;
  newStatus: KYCStatus;
  changedBy: string;
  changeReason?: string;
  changeNotes?: string;
  created: Date;
  metadata?: any;
}

export interface KYCComplianceCheck {
  id: string;
  verificationId: string;
  checkType: ComplianceCheckType;
  checkProvider: string;
  checkReference?: string;
  status: CheckStatus;
  result: CheckResult;
  confidence?: number;
  flags: string[];
  riskLevel: RiskLevel;
  riskFactors: string[];
  requestedAt: Date;
  completedAt?: Date;
  expiresAt?: Date;
  requestData?: any;
  responseData?: any;
  metadata?: any;
}

// Enhanced enums
export enum IDType {
  PASSPORT = 'PASSPORT',
  DRIVING_LICENSE = 'DRIVING_LICENSE',
  NATIONAL_ID = 'NATIONAL_ID',
  EU_ID_CARD = 'EU_ID_CARD',
  OTHER = 'OTHER'
}

export enum AddressProofType {
  UTILITY_BILL = 'UTILITY_BILL',
  BANK_STATEMENT = 'BANK_STATEMENT',
  GOVERNMENT_LETTER = 'GOVERNMENT_LETTER',
  COUNCIL_TAX = 'COUNCIL_TAX',
  RENTAL_AGREEMENT = 'RENTAL_AGREEMENT',
  MORTGAGE_STATEMENT = 'MORTGAGE_STATEMENT',
  OTHER = 'OTHER'
}

export enum SourceOfFunds {
  EMPLOYMENT = 'EMPLOYMENT',
  SAVINGS = 'SAVINGS',
  INVESTMENT = 'INVESTMENT',
  INHERITANCE = 'INHERITANCE',
  BUSINESS_INCOME = 'BUSINESS_INCOME',
  PENSION = 'PENSION',
  GIFT = 'GIFT',
  LOAN = 'LOAN',
  OTHER = 'OTHER'
}

export enum ComplianceCheckType {
  IDENTITY_VERIFICATION = 'IDENTITY_VERIFICATION',
  ADDRESS_VERIFICATION = 'ADDRESS_VERIFICATION',
  PEP_SCREENING = 'PEP_SCREENING',
  SANCTIONS_SCREENING = 'SANCTIONS_SCREENING',
  ADVERSE_MEDIA_SCREENING = 'ADVERSE_MEDIA_SCREENING',
  DOCUMENT_VERIFICATION = 'DOCUMENT_VERIFICATION',
  BIOMETRIC_VERIFICATION = 'BIOMETRIC_VERIFICATION',
  FRAUD_CHECK = 'FRAUD_CHECK'
}

export enum CheckStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED'
}

export enum CheckResult {
  PASS = 'PASS',
  FAIL = 'FAIL',
  REVIEW_REQUIRED = 'REVIEW_REQUIRED',
  INSUFFICIENT_DATA = 'INSUFFICIENT_DATA',
  ERROR = 'ERROR'
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum KYCStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

// Form submission interfaces
export interface KYCFormData {
  userId: string;
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  ppsNumber: string;
  idType: string;
  idNumber: string;
  idExpiryDate: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  county: string;
  eircode: string;
  addressProofType: string;
  sourceOfFunds: string;
  isPoliticallyExposed: boolean;
  isHighRiskCountry: boolean;
  termsAccepted: boolean;
}

export interface KYCSubmissionResponse {
  success: boolean;
  message: string;
  data: {
    verification: KYCVerification;
    documents: any[];
    progress: number;
    status: KYCStatus;
  };
}

export interface KYCStatusResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    kycStatus: KYCStatus;
    lastActive: Date;
  };
  verification: {
    id?: string;
    status: KYCStatus;
    progress: number;
    completedSteps: number;
    totalSteps: number;
    nextSteps: string[];
    submittedAt?: Date;
    reviewedAt?: Date;
    reviewedBy?: string;
    reviewNotes?: string;
    riskScore?: number;
    complianceFlags: string[];
  };
  documents: {
    total: number;
    byCategory: {
      identity: any[];
      address: any[];
      financial: any[];
    };
    recent: any[];
    enhanced: {
      idFront?: any;
      idBack?: any;
      selfie?: any;
      addressProof?: any;
    };
  };
  formData?: any;
  complianceChecks: Array<KYCComplianceCheck & { completionTime?: number }>;
  riskAssessment: {
    overallRisk: RiskLevel | 'UNKNOWN';
    riskFactors: string[];
    riskScore?: number;
    recommendations: string[];
  };
  verificationHistory: KYCVerificationHistory[];
  requiresAction: boolean;
  estimatedCompletionTime: string;
  lastUpdated: Date;
}

// Admin dashboard interfaces
export interface KYCAdminDashboard {
  summary: {
    totalVerifications: number;
    successMetrics: {
      approvalRate: number;
      rejectionRate: number;
      averageProcessingTime: number;
      slaCompliance: number;
    };
    riskDistribution: Record<RiskLevel, number>;
    statusDistribution: Record<KYCStatus, number>;
  };
  trends: {
    daily: Array<{
      date: string;
      total: number;
      approved: number;
      rejected: number;
      pending: number;
    }>;
    processing: {
      averageHours: number;
      medianHours: number;
      byStatus: Record<string, number[]>;
    };
  };
  complianceChecks: {
    summary: Record<string, number>;
    byType: Record<ComplianceCheckType, Record<CheckResult, number>>;
  };
  recentActivity: Array<{
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
    status: KYCStatus;
    progress: number;
    riskScore?: number;
    submittedAt?: Date;
    created: Date;
    timeToProcess?: number;
  }>;
  pendingActions: {
    pendingReviews: number;
    expiredDocuments: number;
    highRiskVerifications: number;
    stalledVerifications: number;
    total: number;
  };
  alerts: Array<{
    type: 'info' | 'warning' | 'critical';
    title: string;
    message: string;
    action: string;
  }>;
}

// Utility types
export interface KYCDocument {
  id: string;
  name: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadDate: Date;
  status: string;
}

export interface KYCAddress {
  line1: string;
  line2?: string;
  city: string;
  county: string;
  eircode: string;
}

export interface KYCValidationError {
  field: string;
  message: string;
  code?: string;
}

// API response types
export type KYCApiResponse<T = any> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: KYCValidationError[];
};