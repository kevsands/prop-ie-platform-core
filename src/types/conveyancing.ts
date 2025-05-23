export interface ConveyancingCase {
  id: string;
  caseReference: string;
  propertyId: string;
  status: ConveyancingStatus;
  type: ConveyancingType;
  
  // Parties
  solicitorId: string;
  buyerId?: string;
  sellerId?: string;
  agentId?: string;
  
  // Property Details
  propertyAddress: string;
  purchasePrice: number;
  depositAmount: number;
  stampDuty?: number;
  
  // Key Dates
  instructionDate: Date;
  proposedCompletion?: Date;
  actualCompletion?: Date;
  
  // Associated Data
  tasks: ConveyancingTask[];
  documents: Document[];
  notes: Note[];
  fees: LegalFee[];
  invoices?: Invoice[];
  amlCheck?: AMLCheck;
  sourceOfFunds?: SourceOfFunds[];
  
  createdAt: Date;
  updatedAt: Date;
}

export type ConveyancingStatus = 
  | 'NEW'
  | 'INSTRUCTION_RECEIVED'
  | 'DUE_DILIGENCE'
  | 'CONTRACT_PREP'
  | 'CONTRACT_ISSUED'
  | 'CONTRACT_NEGOTIATION'
  | 'CONTRACT_SIGNED'
  | 'DEPOSIT_RECEIVED'
  | 'COMPLETION_PENDING'
  | 'COMPLETED'
  | 'ABORTED';

export type ConveyancingType = 
  | 'PURCHASE'
  | 'SALE'
  | 'REMORTGAGE'
  | 'TRANSFER';

export interface ConveyancingTask {
  id: string;
  caseId: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: Priority;
  status: TaskStatus;
  
  assignedTo?: string;
  dueDate?: Date;
  completedDate?: Date;
  
  dependsOn: string[];
  blockedBy?: string[];
  
  documents?: Document[];
  comments?: TaskComment[];
  
  createdAt: Date;
  updatedAt: Date;
}

export type TaskCategory = 
  | 'DUE_DILIGENCE'
  | 'CONTRACT_PREPARATION'
  | 'SEARCHES'
  | 'FINANCIAL'
  | 'COMPLIANCE'
  | 'COMMUNICATION'
  | 'COMPLETION';

export type TaskStatus = 
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'BLOCKED'
  | 'COMPLETED'
  | 'CANCELLED';

export type Priority = 
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'URGENT';

export interface Document {
  id: string;
  caseId: string;
  taskId?: string;
  
  name: string;
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  
  status: DocumentStatus;
  version: number;
  
  uploadedBy: string;
  uploadedAt: Date;
  
  metadata?: any;
  isConfidential?: boolean;
  accessControl?: any;
  
  createdAt: Date;
  updatedAt: Date;
}

export type DocumentType = 
  | 'CONTRACT'
  | 'TITLE_DEED'
  | 'SEARCH_RESULT'
  | 'AML_CHECK'
  | 'PROOF_OF_FUNDS'
  | 'IDENTITY_VERIFICATION'
  | 'MORTGAGE_OFFER'
  | 'BUILDING_REPORT'
  | 'PLANNING_PERMISSION'
  | 'CORRESPONDENCE'
  | 'OTHER';

export type DocumentStatus = 
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'FINAL';

export interface Note {
  id: string;
  caseId: string;
  content: string;
  type: NoteType;
  isPrivate: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export type NoteType = 
  | 'GENERAL'
  | 'LEGAL'
  | 'CLIENT_COMMUNICATION'
  | 'INTERNAL'
  | 'WARNING';

export interface AMLCheck {
  id: string;
  caseId: string;
  clientId: string;
  status: AMLStatus;
  
  idVerificationStatus: VerificationStatus;
  idDocuments?: any[];
  
  addressVerificationStatus: VerificationStatus;
  addressDocuments?: any[];
  
  pepCheckStatus: CheckStatus;
  sanctionsCheckStatus: CheckStatus;
  
  riskLevel: RiskLevel;
  riskFactors?: any;
  
  completedBy?: string;
  completedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

export type AMLStatus = 
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'FAILED'
  | 'REFERRED';

export type VerificationStatus = 
  | 'PENDING'
  | 'VERIFIED'
  | 'FAILED'
  | 'MANUAL_REVIEW';

export type CheckStatus = 
  | 'PENDING'
  | 'CLEAR'
  | 'HIT'
  | 'REVIEW_REQUIRED';

export type RiskLevel = 
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'UNACCEPTABLE';

export interface SourceOfFunds {
  id: string;
  caseId: string;
  source: FundSource;
  amount: number;
  currency: string;
  verificationStatus: VerificationStatus;
  documents?: any[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type FundSource = 
  | 'SALARY'
  | 'SAVINGS'
  | 'INVESTMENT'
  | 'INHERITANCE'
  | 'GIFT'
  | 'PROPERTY_SALE'
  | 'BUSINESS_INCOME'
  | 'LOAN'
  | 'OTHER';

export interface LegalFee {
  id: string;
  caseId: string;
  description: string;
  category: FeeCategory;
  amount: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
  status: FeeStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type FeeCategory = 
  | 'PROFESSIONAL_FEE'
  | 'DISBURSEMENT'
  | 'SEARCH_FEE'
  | 'REGISTRATION_FEE'
  | 'STAMP_DUTY'
  | 'OTHER';

export type FeeStatus = 
  | 'PENDING'
  | 'INVOICED'
  | 'PAID'
  | 'WAIVED';

export interface Invoice {
  id: string;
  caseId: string;
  invoiceNumber: string;
  clientId: string;
  
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  
  status: InvoiceStatus;
  
  issuedDate?: Date;
  dueDate?: Date;
  paidDate?: Date;
  
  lineItems: any[];
  
  createdAt: Date;
  updatedAt: Date;
}

export type InvoiceStatus = 
  | 'DRAFT'
  | 'ISSUED'
  | 'SENT'
  | 'VIEWED'
  | 'PAID'
  | 'OVERDUE'
  | 'CANCELLED';

export interface TaskComment {
  id: string;
  taskId: string;
  content: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  category: DocumentType;
  version: string;
  content: string;
  variables: any[];
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConveyancingWorkflow {
  id: string;
  name: string;
  description?: string;
  type: ConveyancingType;
  stages: WorkflowStage[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowStage {
  id: string;
  workflowId: string;
  name: string;
  description?: string;
  order: number;
  tasks: any[];
  expectedDuration?: number;
  createdAt: Date;
  updatedAt: Date;
}