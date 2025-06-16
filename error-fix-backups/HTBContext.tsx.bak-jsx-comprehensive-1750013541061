'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";

/**
 * Help-to-Buy Context Implementation
 * Provides centralized state management and actions for HTB claims
 */

// Define basic types needed for the context
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

export interface HTBClaim {
  id: string;
  buyerId: string;
  developerId?: string;
  propertyId: string;
  propertyPrice: number;
  propertyAddress?: string;
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

// Mock claim for static data
const MOCK_CLAIM: HTBClaim = {
  id: "claim-123",
  buyerId: "buyer-456",
  developerId: "dev-789",
  propertyId: "Fitzgerald Gardens - Unit 102",
  propertyPrice: 320000,
  propertyAddress: "102 Fitzgerald Gardens, Dublin",
  status: HTBClaimStatus.ACCESS_CODE_RECEIVED,
  requestedAmount: 30000,
  approvedAmount: undefined,
  accessCode: "HTB-1234-ABCD-5678",
  applicationDate: new Date().toISOString(),
  lastUpdatedDate: new Date().toISOString(),
  documents: [],
  notes: [],
  statusHistory: [
    {
      id: "status-1",
      claimId: "claim-123",
      previousStatus: null,
      newStatus: HTBClaimStatus.INITIATED,
      updatedBy: "system",
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      notes: "Claim initiated"
    },
    {
      id: "status-2",
      claimId: "claim-123",
      previousStatus: HTBClaimStatus.INITIATED,
      newStatus: HTBClaimStatus.ACCESS_CODE_RECEIVED,
      updatedBy: "system",
      updatedAt: new Date().toISOString(),
      notes: "Access code received"
    }
  ]
};

// Define context interface with proper method signatures
export interface HTBContextType {
  // Buyer claims
  buyerClaims: HTBClaim[];
  selectedBuyerClaim: HTBClaim | null;
  createNewClaim: (data: { propertyId: string; requestedAmount: number }) => Promise<HTBClaim>;
  submitClaim: (data: { propertyId: string; requestedAmount: number }) => Promise<HTBClaim>;
  fetchClaimById: (id: string, type: 'buyer' | 'developer') => Promise<void>;
  updateAccessCode: (id: string, accessCode: string, expiryDate?: Date) => Promise<void>;
  // Developer claims
  developerClaims: HTBClaim[];
  selectedDeveloperClaim: HTBClaim | null;
  fetchDeveloperClaims: () => Promise<void>;
  // Developer actions
  processAccessCode: (claimId: string, accessCode: string) => Promise<void>;
  addNoteToHTB: (claimId: string, content: string, isPrivate: boolean) => Promise<void>;
  updateClaimCode: (claimId: string, claimCode: string, claimCodeExpiryDate: string, approvedAmount: number, documentFile: File) => Promise<void>;
  completeHTBClaim: (claimId: string, completionDate: Date, notes: string, documentFile?: File) => Promise<void>;
  markDepositApplied: (claimId: string, appliedDate: Date, notes: string, documentFile?: File) => Promise<void>;
  uploadHTBDocument: (claimId: string, file: File, type: string, name: string) => Promise<void>;
  markFundsReceived: (claimId: string, receivedAmount: number, receivedDate: Date, documentFile?: File) => Promise<void>;
  requestClaimFunds: (claimId: string, requestDate: Date, notes: string, documentFile?: File) => Promise<void>;
  // Status
  isLoading: boolean;
  error: Error | null;
}

// Create the context with proper type safety
const HTBContext = createContext<HTBContextType | undefined>(undefined);

// Hook for using the context with type safety
export const useHTB = () => {
  const context = useContext(HTBContext);
  if (!context) {
    throw new Error('useHTB must be used within an HTBProvider');
  }
  return context;
};

// Provider component with proper implementation
export const HTBProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedBuyerClaim, setSelectedBuyerClaim] = useState<HTBClaim | null>(null);
  const [buyerClaims, setBuyerClaims] = useState<HTBClaim[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchClaimById = async (id: string, type: 'buyer' | 'developer') => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Implement actual API call
      const response = await fetch(`/api/htb/claims/${id}?type=${type}`);
      if (!response.ok) {
        throw new Error('Failed to fetch claim');
      }
      const data = await response.json();
      setSelectedBuyerClaim(data as HTBClaim);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  const createNewClaim = async (data: { propertyId: string; requestedAmount: number, firstName?: string, lastName?: string, email?: string, phone?: string, ppsNumber?: string, propertyAddress?: string, claimAmount?: number }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/htb/buyer/claims`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to create new claim: ${response.status}`);
      }
      const claim = await response.json() as HTBClaim;
      // Attach extra fields for UI compatibility
      const claimWithExtras = {
        ...claim,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        ppsNumber: data.ppsNumber,
        propertyAddress: data.propertyAddress,
        claimAmount: data.claimAmount || data.requestedAmount};
      setSelectedBuyerClaim(claimWithExtras);
      return claimWithExtras;
    } catch (error) {
      console.error('Failed to create new claim:', error);
      throw error;
    }
  };
  // ADDED: submitClaim for backward compatibility
  const submitClaim = createNewClaim;

  const value: HTBContextType = {
    buyerClaims,
    selectedBuyerClaim,
    createNewClaim,
    submitClaim,
    fetchClaimById,
    updateAccessCode: async (id: string, accessCode: string, expiryDate?: Date) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/htb/buyer/claims/${id}/access-code`, {
          method: 'PUT',
          body: JSON.stringify({
            accessCode,
            expiryDate: expiryDate?.toISOString()
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to update access code: ${response.status}`);
        }

        await response.json();
      } catch (error) {
        console.error('Failed to update access code:', error);
        throw error;
      }
    },
    
    developerClaims: [],
    selectedDeveloperClaim: null,
    fetchDeveloperClaims: async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/htb/developer/claims`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch developer claims: ${response.status}`);
        }

        const claims = await response.json();
        // No need to return anything as per the interface
      } catch (error) {
        console.error('Failed to fetch developer claims:', error);
        throw error;
      }
    },
    
    // Developer actions with proper implementation
    processAccessCode: async (claimId: string, accessCode: string) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/htb/developer/claims/${claimId}/process-access-code`, {
          method: 'POST',
          body: JSON.stringify({ accessCode }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to process access code: ${response.status}`);
        }

        await response.json();
      } catch (error) {
        console.error('Failed to process access code:', error);
        throw error;
      }
    },
    addNoteToHTB: async (claimId: string, content: string, isPrivate: boolean) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/htb/developer/claims/${claimId}/notes`, {
          method: 'POST',
          body: JSON.stringify({ content, isPrivate }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to add note: ${response.status}`);
        }

        await response.json();
      } catch (error) {
        console.error('Failed to add note:', error);
        throw error;
      }
    },
    updateClaimCode: async (claimId: string, claimCode: string, claimCodeExpiryDate: string, approvedAmount: number, documentFile: File) => {
      try {
        const formData = new FormData();
        formData.append('claimCode', claimCode);
        formData.append('claimCodeExpiryDate', claimCodeExpiryDate);
        formData.append('approvedAmount', approvedAmount.toString());
        formData.append('documentFile', documentFile);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/htb/developer/claims/${claimId}/claim-code`, {
          method: 'PUT',
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to update claim code: ${response.status}`);
        }

        await response.json();
      } catch (error) {
        console.error('Failed to update claim code:', error);
        throw error;
      }
    },
    completeHTBClaim: async (claimId: string, completionDate: Date, notes: string, documentFile?: File) => {
      try {
        const formData = new FormData();
        formData.append('completionDate', completionDate.toISOString());
        formData.append('notes', notes);
        if (documentFile) {
          formData.append('documentFile', documentFile);
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/htb/developer/claims/${claimId}/complete`, {
          method: 'PUT',
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to complete HTB claim: ${response.status}`);
        }

        await response.json();
      } catch (error) {
        console.error('Failed to complete HTB claim:', error);
        throw error;
      }
    },
    markDepositApplied: async (claimId: string, appliedDate: Date, notes: string, documentFile?: File) => {
      try {
        const formData = new FormData();
        formData.append('appliedDate', appliedDate.toISOString());
        formData.append('notes', notes);
        if (documentFile) {
          formData.append('documentFile', documentFile);
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/htb/developer/claims/${claimId}/deposit-applied`, {
          method: 'PUT',
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to mark deposit as applied: ${response.status}`);
        }

        await response.json();
      } catch (error) {
        console.error('Failed to mark deposit as applied:', error);
        throw error;
      }
    },
    uploadHTBDocument: async (claimId: string, file: File, type: string, name: string) => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        formData.append('name', name);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/htb/developer/claims/${claimId}/documents`, {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to upload document: ${response.status}`);
        }

        await response.json();
      } catch (error) {
        console.error('Failed to upload document:', error);
        throw error;
      }
    },
    markFundsReceived: async (claimId: string, receivedAmount: number, receivedDate: Date, documentFile?: File) => {
      try {
        const formData = new FormData();
        formData.append('receivedAmount', receivedAmount.toString());
        formData.append('receivedDate', receivedDate.toISOString());
        if (documentFile) {
          formData.append('documentFile', documentFile);
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/htb/developer/claims/${claimId}/funds-received`, {
          method: 'PUT',
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to mark funds as received: ${response.status}`);
        }

        await response.json();
      } catch (error) {
        console.error('Failed to mark funds as received:', error);
        throw error;
      }
    },
    requestClaimFunds: async (claimId: string, requestDate: Date, notes: string, documentFile?: File) => {
      try {
        const formData = new FormData();
        formData.append('requestDate', requestDate.toISOString());
        formData.append('notes', notes);
        if (documentFile) {
          formData.append('documentFile', documentFile);
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/htb/developer/claims/${claimId}/request-funds`, {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to request funds: ${response.status}`);
        }

        await response.json();
      } catch (error) {
        console.error('Failed to request funds:', error);
        throw error;
      }
    },
    
    isLoading,
    error
  };

  return (
    <HTBContext.Provider value={value}>
      {children}
    </HTBContext.Provider>
  );
};