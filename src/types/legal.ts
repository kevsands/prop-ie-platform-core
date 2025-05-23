// src/types/legal.ts
// Legal transaction flow types that integrate with existing transaction system

export type LegalTransactionStatus = 
  | 'BOOKING_INITIATED'
  | 'TERMS_ACCEPTED'
  | 'DEPOSIT_PAID'
  | 'SOLICITOR_NOMINATED'
  | 'CONTRACT_GENERATED'
  | 'CONTRACT_READY'
  | 'PENDING_SIGNATURES'
  | 'LEGALLY_BOUND'
  | 'COMPLETED'
  | 'CANCELLED';

export type DepositStatus = 
  | 'PENDING'
  | 'PAID'
  | 'HELD_IN_ESCROW'
  | 'NON_REFUNDABLE'
  | 'REFUNDED'
  | 'FORFEITED';

export type ContractStage = 
  | 'DRAFT'
  | 'GENERATED'
  | 'UNDER_REVIEW'
  | 'READY_FOR_SIGNATURE'
  | 'PARTIALLY_SIGNED'
  | 'FULLY_EXECUTED'
  | 'CANCELLED';

export type SignatureStatus = 
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'DECLINED'
  | 'EXPIRED';

/**
 * Legal reservation extends the basic transaction concept
 * with legal-specific requirements and stages
 */
export interface LegalReservation {
  id: string;
  transactionId?: string; // Links to existing transaction system
  unitId: string;
  buyerId: string;
  
  // Legal status tracking
  status: LegalTransactionStatus;
  legalStage: ContractStage;
  
  // Deposit management
  deposit: {
    amount: number;
    status: DepositStatus;
    paidAt?: Date;
    escrowAccount?: string;
    paymentReference?: string;
  };
  
  // Terms acceptance
  termsAccepted: {
    accepted: boolean;
    acceptedAt?: Date;
    ipAddress?: string;
    userAgent?: string;
  };
  
  // Solicitor information
  solicitor?: {
    firmName: string;
    solicitorName: string;
    email: string;
    phone?: string;
    lawSocRegistration: string;
    address?: string;
    validatedAt?: Date;
    status: 'PENDING' | 'VALIDATED' | 'ACTIVE';
  };
  
  // Contract details
  contract?: {
    contractUrl?: string;
    generatedAt?: Date;
    reviewedAt?: Date;
    stage: ContractStage;
    version: number;
    
    // DocuSign integration
    docuSignEnvelopeId?: string;
    signingUrl?: string;
    signedContractUrl?: string;
    
    // Signature tracking
    signatures: ContractSignature[];
  };
  
  // Important dates
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  completionDate?: Date;
  executedAt?: Date;
  
  // Audit trail
  auditLog: LegalAuditEvent[];
}

export interface ContractSignature {
  signerRole: 'BUYER' | 'DEVELOPER' | 'WITNESS';
  signerName: string;
  signerEmail: string;
  status: SignatureStatus;
  signedAt?: Date;
  ipAddress?: string;
  signatureId?: string;
  docuSignTabId?: string;
}

export interface LegalAuditEvent {
  id: string;
  reservationId: string;
  event: string;
  description: string;
  data?: Record<string, any>\n  );
  timestamp: Date;
  userId?: string;
  ipAddress?: string;
  source: 'USER' | 'SYSTEM' | 'DOCUSIGN' | 'PAYMENT' | 'LEGAL';
}

/**
 * Contract generation data structure
 */
export interface ContractData {
  contractReference: string;
  contractDate: string;
  
  // Parties
  buyer: {
    name: string;
    email: string;
    address: string;
    ppsNumber?: string;
  };
  
  developer: {
    name: string;
    address: string;
    companyRegNumber: string;
    signatory: {
      name: string;
      title: string;
    };
  };
  
  // Property details
  unit: {
    id: string;
    name: string;
    address: string;
    unitNumber: string;
    type: string;
    bedrooms: number;
    bathrooms: number;
    floorArea: number;
    parkingSpaces?: number;
  };
  
  // Financial terms
  terms: {
    purchasePrice: number;
    bookingDeposit: number;
    balanceDeposit: number;
    completionBalance: number;
    completionDate: string;
    stampDuty?: number;
    legalFees?: number;
  };
  
  // Development details
  development: {
    name: string;
    planningRef?: string;
    completionDate?: string;
  };
  
  // Solicitor details
  solicitor?: {
    firmName: string;
    solicitorName: string;
    email: string;
    address: string;
  };
  
  // Special conditions
  specialConditions?: string[];
  customizations?: ContractCustomization[];
}

export interface ContractCustomization {
  id: string;
  description: string;
  cost: number;
  included: boolean;
}

/**
 * DocuSign integration types
 */
export interface DocuSignEnvelope {
  envelopeId: string;
  status: 'created' | 'sent' | 'delivered' | 'signed' | 'completed' | 'declined' | 'expired';
  signingUrl: string;
  documentUrl?: string;
  createdAt: Date;
  completedAt?: Date;
  signers: DocuSignSigner[];
}

export interface DocuSignSigner {
  name: string;
  email: string;
  role: string;
  routingOrder: number;
  status: 'created' | 'sent' | 'delivered' | 'signed' | 'completed' | 'declined';
  signedAt?: Date;
  declinedReason?: string;
}

/**
 * Legal compliance tracking
 */
export interface LegalCompliance {
  reservationId: string;
  
  // KYC/AML status
  kyc: {
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
    completedAt?: Date;
    documents: string[];
  };
  
  aml: {
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
    completedAt?: Date;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  
  // Legal requirements
  solicitorNominated: boolean;
  contractReviewed: boolean;
  depositSecured: boolean;
  
  // Irish law compliance
  statuteOfFraudsCompliant: boolean;
  eCommerceActCompliant: boolean;
  eidasCompliant: boolean;
  
  // GDPR compliance
  dataProcessingConsent: boolean;
  privacyPolicyAccepted: boolean;
  
  lastUpdated: Date;
}

/**
 * Financial escrow management
 */
export interface EscrowAccount {
  id: string;
  accountNumber: string;
  bankName: string;
  sortCode: string;
  accountName: string;
  solicitorFirm: string;
  
  // Regulatory compliance
  lawSocietyRegulated: boolean;
  insuranceCovered: boolean;
  
  // Deposit tracking
  deposits: EscrowDeposit[];
  totalBalance: number;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface EscrowDeposit {
  id: string;
  reservationId: string;
  amount: number;
  currency: 'EUR';
  status: DepositStatus;
  
  // Payment details
  paymentMethod: 'STRIPE' | 'BANK_TRANSFER' | 'CHEQUE';
  paymentReference: string;
  paidAt: Date;
  
  // Escrow management
  transferredAt?: Date;
  releasedAt?: Date;
  refundedAt?: Date;
  
  // Audit trail
  auditLog: DepositAuditEvent[];
}

export interface DepositAuditEvent {
  id: string;
  depositId: string;
  event: 'PAID' | 'TRANSFERRED' | 'HELD' | 'RELEASED' | 'REFUNDED' | 'FORFEITED';
  amount: number;
  description: string;
  timestamp: Date;
  authorizedBy?: string;
  reason?: string;
}

/**
 * Legal notification types
 */
export type LegalNotificationType = 
  | 'TERMS_ACCEPTANCE_REQUIRED'
  | 'DEPOSIT_PAYMENT_DUE'
  | 'SOLICITOR_NOMINATION_REQUIRED'
  | 'CONTRACT_READY_FOR_REVIEW'
  | 'SIGNATURE_REQUIRED'
  | 'CONTRACT_EXECUTED'
  | 'BALANCE_DEPOSIT_DUE'
  | 'COMPLETION_APPROACHING'
  | 'LEGAL_DEADLINE_WARNING';

export interface LegalNotification {
  id: string;
  reservationId: string;
  type: LegalNotificationType;
  recipient: {
    role: 'BUYER' | 'SOLICITOR' | 'DEVELOPER' | 'AGENT';
    email: string;
    name: string;
  };
  
  subject: string;
  message: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  
  // Action required
  actionRequired: boolean;
  actionUrl?: string;
  deadline?: Date;
  
  // Delivery tracking
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  actionTakenAt?: Date;
  
  // Retry logic
  attempts: number;
  maxAttempts: number;
  lastAttemptAt?: Date;
  
  createdAt: Date;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'ACTIONED' | 'FAILED';
}

/**
 * API response types for legal transaction endpoints
 */
export interface LegalTransactionApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
  timestamp: string;
}

export interface BookingInitiationResponse {
  reservationId: string;
  unitDetails: {
    id: string;
    name: string;
    address: string;
    price: number;
    bookingDeposit: number;
  };
  expiresAt: string;
  nextSteps: string;
}

export interface DepositConfirmationResponse {
  reservation: LegalReservation;
  transactionId: string;
  nextSteps: string;
  escrowDetails: {
    account: string;
    reference: string;
  };
}

export interface ContractGenerationResponse {
  contractUrl: string;
  contractData: {
    purchasePrice: number;
    deposits: {
      booking: number;
      balance: number;
    };
    completionDate: string;
  };
  reviewDeadline: string;
}

export interface SigningInitiationResponse {
  docuSignUrl: string;
  envelopeId: string;
  instructions: string;
  expiresAt: string;
}

export interface ContractFinalizationResponse {
  status: 'EXECUTED';
  message: string;
  nextSteps: {
    balanceDepositDue: number;
    balanceDepositDeadline: string;
    completionDate: string;
    actions: string[];
  };
  legalStatus: {
    contractExecuted: boolean;
    bindingDate: string;
    depositStatus: DepositStatus;
    complianceRequired: string[];
  };
}

/**
 * Integration with existing transaction system
 */
export interface LegalTransactionIntegration {
  // Maps to existing Transaction interface
  transactionId: string;
  reservationId: string;
  
  // Legal-specific extensions
  legalStatus: LegalTransactionStatus;
  contractStage: ContractStage;
  complianceStatus: LegalCompliance;
  
  // Enhanced milestones
  legalMilestones: {
    termsAccepted?: Date;
    depositSecured?: Date;
    solicitorNominated?: Date;
    contractGenerated?: Date;
    contractSigned?: Date;
    legallyBound?: Date;
  };
  
  // Enhanced participants
  legalParticipants: {
    buyerSolicitor?: {
      id: string;
      name: string;
      firm: string;
      email: string;
      lawSocRegistration: string;
    };
    developerSolicitor?: {
      id: string;
      name: string;
      firm: string;
      email: string;
    };
  };
}

/**
 * Type guards for legal transaction validation
 */
export function isLegalReservation(obj: any): obj is LegalReservation {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.unitId === 'string' &&
    typeof obj.buyerId === 'string' &&
    obj.status in ['BOOKING_INITIATED', 'TERMS_ACCEPTED', 'DEPOSIT_PAID', 'SOLICITOR_NOMINATED', 'CONTRACT_GENERATED', 'CONTRACT_READY', 'PENDING_SIGNATURES', 'LEGALLY_BOUND', 'COMPLETED', 'CANCELLED'] &&
    obj.deposit &&
    typeof obj.deposit.amount === 'number' &&
    obj.termsAccepted &&
    typeof obj.termsAccepted.accepted === 'boolean'
  );
}

export function isContractExecuted(reservation: LegalReservation): boolean {
  return (
    reservation.status === 'LEGALLY_BOUND' &&
    reservation.contract?.stage === 'FULLY_EXECUTED' &&
    reservation.executedAt !== undefined
  );
}

export function isDepositSecured(reservation: LegalReservation): boolean {
  return (
    reservation.deposit.status === 'HELD_IN_ESCROW' ||
    reservation.deposit.status === 'NON_REFUNDABLE'
  );
}