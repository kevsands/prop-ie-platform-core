// @/types/htb.ts

export enum HTBClaimStatus {
    INITIATED = 'INITIATED',
    ACCESS_CODE_RECEIVED = 'ACCESS_CODE_RECEIVED',
    ACCESS_CODE_SUBMITTED = 'ACCESS_CODE_SUBMITTED',
    DEVELOPER_PROCESSING = 'DEVELOPER_PROCESSING',
    CLAIM_CODE_RECEIVED = 'CLAIM_CODE_RECEIVED',
    FUNDS_REQUESTED = 'FUNDS_REQUESTED',
    FUNDS_RECEIVED = 'FUNDS_RECEIVED',
    DEPOSIT_APPLIED = 'DEPOSIT_APPLIED',
    COMPLETED = 'COMPLETED',
    REJECTED = 'REJECTED',
    EXPIRED = 'EXPIRED',
    CANCELLED = 'CANCELLED',
    // Add missing statuses needed by the component
    SUBMITTED = 'SUBMITTED',
    ACCESS_CODE_APPROVED = 'ACCESS_CODE_APPROVED',
    CLAIM_CODE_ISSUED = 'CLAIM_CODE_ISSUED'
  }
  
  export interface HTBStatusUpdate {
    id: string;
    claimId: string;
    previousStatus: HTBClaimStatus | null;
    newStatus: HTBClaimStatus;
    updatedBy: string;
    updatedAt: string;
    notes?: string;
  }
  
  export interface HTBClaim {
    id: string;
    buyerId: string;
    developerId?: string;
    propertyId: string;
    propertyPrice: number;
    propertyAddress?: string; // Add the missing propertyAddress field
    status: HTBClaimStatus;
    requestedAmount: number;
    approvedAmount?: number;
    drawdownAmount?: number;
    accessCode: string;
    accessCodeExpiryDate?: string;
    claimCode?: string;
    claimCodeExpiryDate?: string;
    applicationDate: string;
    lastUpdatedDate: string;
    documents: HTBDocument[];
    notes: HTBNote[];
    statusHistory: HTBStatusUpdate[];
  }
  
  export interface HTBDocument {
    id: string;
    claimId: string;
    url: string;
    name: string;
    type: string;
    uploadedBy: string;
    uploadedAt: string;
  }
  
  export interface HTBNote {
    id: string;
    claimId: string;
    content: string;
    isPrivate: boolean;
    createdBy: string;
    createdAt: string;
  }
  
  export interface HTBClaimCreationParams {
    propertyId: string;
    requestedAmount: number;
  }
  
  export interface HTBAccessCodeUpdateParams {
    accessCode: string;
    accessCodeExpiryDate: Date;
    documentFile?: File;
  }
  
  export interface HTBClaimCodeUpdateParams {
    claimCode: string;
    claimCodeExpiryDate: Date;
    approvedAmount: number;
    documentFile?: File;
  } // Added closing brace here