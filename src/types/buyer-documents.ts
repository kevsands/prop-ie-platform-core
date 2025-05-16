/**
 * Types for First-Time Buyer document repository functionality
 */
import { DocumentCategory, DocumentType } from './document';

/**
 * Document categories specific to buyer journey phases
 */
export enum BuyerDocumentCategory {
  PLANNING = 'planning',
  FINANCING = 'financing',
  PROPERTY_SEARCH = 'property_search',
  RESERVATION = 'reservation',
  LEGAL_PROCESS = 'legal_process',
  CONSTRUCTION = 'construction',
  COMPLETION = 'completion',
  POST_PURCHASE = 'post_purchase'
}

/**
 * Maps buyer journey phases to document categories
 */
export const BuyerPhaseToDocumentCategory: Record<string, BuyerDocumentCategory> = {
  PLANNING: BuyerDocumentCategory.PLANNING,
  FINANCING: BuyerDocumentCategory.FINANCING,
  PROPERTY_SEARCH: BuyerDocumentCategory.PROPERTY_SEARCH,
  RESERVATION: BuyerDocumentCategory.RESERVATION,
  LEGAL_PROCESS: BuyerDocumentCategory.LEGAL_PROCESS,
  CONSTRUCTION: BuyerDocumentCategory.CONSTRUCTION,
  COMPLETION: BuyerDocumentCategory.COMPLETION,
  POST_PURCHASE: BuyerDocumentCategory.POST_PURCHASE
};

/**
 * Required documents for each journey phase
 */
export interface RequiredDocument {
  id: string;
  name: string;
  description: string;
  type: DocumentType;
  category: DocumentCategory;
  isRequired: boolean;
  requiredByPhase: BuyerDocumentCategory;
  helpText?: string;
}

/**
 * Required documents by phase
 */
export const REQUIRED_DOCUMENTS_BY_PHASE: Record<BuyerDocumentCategory, RequiredDocument[]> = {
  [BuyerDocumentCategory.PLANNING]: [
    {
      id: 'id-verification',
      name: 'ID Verification Documents',
      description: 'Government-issued photo ID (Passport, Driver\'s License)',
      type: DocumentType.IDENTITY,
      category: DocumentCategory.USER,
      isRequired: true,
      requiredByPhase: BuyerDocumentCategory.PLANNING,
      helpText: 'Please upload a clear copy of your government-issued photo ID'
    },
    {
      id: 'proof-of-address',
      name: 'Proof of Address',
      description: 'Recent utility bill or bank statement (within last 3 months)',
      type: DocumentType.IDENTITY,
      category: DocumentCategory.USER,
      isRequired: true,
      requiredByPhase: BuyerDocumentCategory.PLANNING,
      helpText: 'Must show your full name and current address'
    }
  ],
  [BuyerDocumentCategory.FINANCING]: [
    {
      id: 'mortgage-agreement-in-principle',
      name: 'Mortgage Agreement in Principle',
      description: 'Document from your lender confirming how much they might lend you',
      type: DocumentType.FINANCIAL,
      category: DocumentCategory.USER,
      isRequired: true,
      requiredByPhase: BuyerDocumentCategory.FINANCING,
      helpText: 'Also known as a Decision in Principle or Mortgage Promise'
    },
    {
      id: 'proof-of-deposit',
      name: 'Proof of Deposit',
      description: 'Bank statement showing available funds for deposit',
      type: DocumentType.FINANCIAL,
      category: DocumentCategory.USER,
      isRequired: true,
      requiredByPhase: BuyerDocumentCategory.FINANCING,
      helpText: 'Must clearly show the funds available for your deposit'
    },
    {
      id: 'payslips',
      name: 'Recent Payslips',
      description: 'Last 3 months of payslips',
      type: DocumentType.FINANCIAL,
      category: DocumentCategory.USER,
      isRequired: true,
      requiredByPhase: BuyerDocumentCategory.FINANCING
    }
  ],
  [BuyerDocumentCategory.PROPERTY_SEARCH]: [
    {
      id: 'property-wishlist',
      name: 'Property Requirements Checklist',
      description: 'Your list of must-haves and nice-to-haves for your new home',
      type: DocumentType.OTHER,
      category: DocumentCategory.USER,
      isRequired: false,
      requiredByPhase: BuyerDocumentCategory.PROPERTY_SEARCH
    }
  ],
  [BuyerDocumentCategory.RESERVATION]: [
    {
      id: 'reservation-agreement',
      name: 'Property Reservation Agreement',
      description: 'Signed agreement to reserve your chosen property',
      type: DocumentType.LEGAL,
      category: DocumentCategory.SALE,
      isRequired: true,
      requiredByPhase: BuyerDocumentCategory.RESERVATION
    },
    {
      id: 'reservation-fee-receipt',
      name: 'Reservation Fee Receipt',
      description: 'Proof of payment of reservation fee',
      type: DocumentType.FINANCIAL,
      category: DocumentCategory.SALE,
      isRequired: true,
      requiredByPhase: BuyerDocumentCategory.RESERVATION
    }
  ],
  [BuyerDocumentCategory.LEGAL_PROCESS]: [
    {
      id: 'sale-contract',
      name: 'Sale Contract',
      description: 'Legal contract for the purchase of the property',
      type: DocumentType.LEGAL,
      category: DocumentCategory.SALE,
      isRequired: true,
      requiredByPhase: BuyerDocumentCategory.LEGAL_PROCESS
    },
    {
      id: 'mortgage-offer',
      name: 'Mortgage Offer',
      description: 'Final mortgage offer from your lender',
      type: DocumentType.FINANCIAL,
      category: DocumentCategory.USER,
      isRequired: true,
      requiredByPhase: BuyerDocumentCategory.LEGAL_PROCESS
    },
    {
      id: 'solicitor-details',
      name: 'Solicitor Details',
      description: 'Contact information for your solicitor or conveyancer',
      type: DocumentType.OTHER,
      category: DocumentCategory.ADMINISTRATIVE,
      isRequired: true,
      requiredByPhase: BuyerDocumentCategory.LEGAL_PROCESS
    }
  ],
  [BuyerDocumentCategory.CONSTRUCTION]: [
    {
      id: 'build-schedule',
      name: 'Construction Schedule',
      description: 'Timeline for the construction of your property',
      type: DocumentType.CONSTRUCTION,
      category: DocumentCategory.PROPERTY,
      isRequired: false,
      requiredByPhase: BuyerDocumentCategory.CONSTRUCTION
    },
    {
      id: 'customization-choices',
      name: 'Customization Selections',
      description: 'Your chosen fixtures, fittings, and finishes',
      type: DocumentType.OTHER,
      category: DocumentCategory.PROPERTY,
      isRequired: true,
      requiredByPhase: BuyerDocumentCategory.CONSTRUCTION
    }
  ],
  [BuyerDocumentCategory.COMPLETION]: [
    {
      id: 'completion-statement',
      name: 'Completion Statement',
      description: 'Final financial statement showing all costs and payments',
      type: DocumentType.FINANCIAL,
      category: DocumentCategory.SALE,
      isRequired: true,
      requiredByPhase: BuyerDocumentCategory.COMPLETION
    },
    {
      id: 'property-deed',
      name: 'Property Deed',
      description: 'Legal document showing ownership transfer',
      type: DocumentType.LEGAL,
      category: DocumentCategory.PROPERTY,
      isRequired: true,
      requiredByPhase: BuyerDocumentCategory.COMPLETION
    }
  ],
  [BuyerDocumentCategory.POST_PURCHASE]: [
    {
      id: 'warranty-documents',
      name: 'Warranty Documents',
      description: 'Builder\'s warranty and other guarantees',
      type: DocumentType.LEGAL,
      category: DocumentCategory.PROPERTY,
      isRequired: true,
      requiredByPhase: BuyerDocumentCategory.POST_PURCHASE
    },
    {
      id: 'homeowner-manual',
      name: 'Homeowner\'s Manual',
      description: 'Guide to your new home including maintenance information',
      type: DocumentType.OTHER,
      category: DocumentCategory.PROPERTY,
      isRequired: true,
      requiredByPhase: BuyerDocumentCategory.POST_PURCHASE
    },
    {
      id: 'snagging-list',
      name: 'Snagging List',
      description: 'List of any issues that need to be addressed',
      type: DocumentType.CONSTRUCTION,
      category: DocumentCategory.PROPERTY,
      isRequired: false,
      requiredByPhase: BuyerDocumentCategory.POST_PURCHASE
    }
  ]
};

/**
 * Get required documents for a specific phase
 */
export function getRequiredDocumentsForPhase(phase: string): RequiredDocument[] {
  const buyerPhase = BuyerPhaseToDocumentCategory[phase];
  if (!buyerPhase) {
    return [];
  }
  return REQUIRED_DOCUMENTS_BY_PHASE[buyerPhase] || [];
}

/**
 * Get all required documents across all phases
 */
export function getAllRequiredDocuments(): RequiredDocument[] {
  return Object.values(REQUIRED_DOCUMENTS_BY_PHASE).flat();
}

/**
 * Document upload status
 */
export interface DocumentUploadStatus {
  documentId: string;
  requiredDocumentId: string;
  name: string;
  uploaded: boolean;
  approved: boolean;
  uploadDate?: Date;
  fileUrl?: string;
}

/**
 * Document progress for a phase
 */
export interface PhaseDocumentProgress {
  phase: BuyerDocumentCategory;
  requiredCount: number;
  uploadedCount: number;
  approvedCount: number;
  percentage: number;
  documents: DocumentUploadStatus[];
}