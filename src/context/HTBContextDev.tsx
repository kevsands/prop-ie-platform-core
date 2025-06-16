'use client';

import React, { createContext, useContext, ReactNode, useState, useCallback } from "react";
import { HTBClaimStatus } from '@/types/htb';

/**
 * Development HTB Context with Mock Data
 * Provides working HTB claims management for developer portal testing
 */

// Mock HTB Claim interface for development
interface MockHTBClaim {
  id: string;
  propertyId: string;
  buyerId: string;
  accessCode: string;
  claimCode?: string;
  status: HTBClaimStatus;
  requestedAmount: number;
  approvedAmount?: number;
  applicationDate: string;
  lastUpdatedDate: string;
  accessCodeExpiryDate?: string;
  notes?: string;
}

interface HTBContextType {
  developerClaims: MockHTBClaim[];
  selectedDeveloperClaim: MockHTBClaim | null;
  fetchDeveloperClaims: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const HTBContext = createContext<HTBContextType | undefined>(undefined);

// Mock data for development
const mockDeveloperClaims: MockHTBClaim[] = [
  {
    id: 'claim-001',
    propertyId: 'FG-A-101',
    buyerId: 'buyer-johndoe-001',
    accessCode: 'HTB2025001',
    claimCode: 'CC2025001',
    status: HTBClaimStatus.FUNDS_RECEIVED,
    requestedAmount: 65000,
    approvedAmount: 65000,
    applicationDate: '2025-05-15T10:00:00Z',
    lastUpdatedDate: '2025-06-10T14:30:00Z',
    accessCodeExpiryDate: '2025-08-15T23:59:59Z',
    notes: 'First-time buyer, all documentation verified'
  },
  {
    id: 'claim-002',
    propertyId: 'FG-B-205',
    buyerId: 'buyer-marysullivan-002',
    accessCode: 'HTB2025002',
    status: HTBClaimStatus.ACCESS_CODE_SUBMITTED,
    requestedAmount: 70000,
    applicationDate: '2025-06-01T09:15:00Z',
    lastUpdatedDate: '2025-06-01T09:15:00Z',
    accessCodeExpiryDate: '2025-09-01T23:59:59Z',
    notes: 'Awaiting developer processing'
  },
  {
    id: 'claim-003',
    propertyId: 'FG-A-304',
    buyerId: 'buyer-davidwalsh-003',
    accessCode: 'HTB2025003',
    claimCode: 'CC2025003',
    status: HTBClaimStatus.DEVELOPER_PROCESSING,
    requestedAmount: 55000,
    applicationDate: '2025-05-20T11:45:00Z',
    lastUpdatedDate: '2025-06-05T16:20:00Z',
    accessCodeExpiryDate: '2025-08-20T23:59:59Z',
    notes: 'Ready for claim code submission'
  },
  {
    id: 'claim-004',
    propertyId: 'FG-C-102',
    buyerId: 'buyer-emmakelley-004',
    accessCode: 'HTB2025004',
    claimCode: 'CC2025004',
    status: HTBClaimStatus.COMPLETED,
    requestedAmount: 75000,
    approvedAmount: 75000,
    applicationDate: '2025-04-10T08:30:00Z',
    lastUpdatedDate: '2025-05-25T12:45:00Z',
    accessCodeExpiryDate: '2025-07-10T23:59:59Z',
    notes: 'Completed successfully, funds applied to deposit'
  },
  {
    id: 'claim-005',
    propertyId: 'FG-B-401',
    buyerId: 'buyer-patrickbrown-005',
    accessCode: 'HTB2025005',
    status: HTBClaimStatus.CLAIM_CODE_RECEIVED,
    requestedAmount: 60000,
    applicationDate: '2025-05-28T14:00:00Z',
    lastUpdatedDate: '2025-06-08T10:15:00Z',
    accessCodeExpiryDate: '2025-08-28T23:59:59Z',
    notes: 'Claim code issued, ready for funds request'
  },
  {
    id: 'claim-006',
    propertyId: 'FG-A-201',
    buyerId: 'buyer-lisaconnor-006',
    accessCode: 'HTB2025006',
    status: HTBClaimStatus.FUNDS_REQUESTED,
    requestedAmount: 68000,
    applicationDate: '2025-06-02T13:20:00Z',
    lastUpdatedDate: '2025-06-12T09:30:00Z',
    accessCodeExpiryDate: '2025-09-02T23:59:59Z',
    notes: 'Funds requested from Revenue, awaiting approval'
  }
];

export function HTBProvider({ children }: { children: ReactNode }) {
  const [developerClaims, setDeveloperClaims] = useState<MockHTBClaim[]>(mockDeveloperClaims);
  const [selectedDeveloperClaim, setSelectedDeveloperClaim] = useState<MockHTBClaim | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDeveloperClaims = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would fetch from API
      setDeveloperClaims(mockDeveloperClaims);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch claims');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: HTBContextType = {
    developerClaims,
    selectedDeveloperClaim,
    fetchDeveloperClaims,
    isLoading,
    error,
  };

  return (
    <HTBContext.Provider value={value}>
      {children}
    </HTBContext.Provider>
  );
}

export function useHTB(): HTBContextType {
  const context = useContext(HTBContext);
  if (context === undefined) {
    throw new Error('useHTB must be used within an HTBProvider');
  }
  return context;
}

export default HTBProvider;