import { useState, useEffect, useCallback } from 'react';

/**
 * Unified Buyer Experience Synchronization Hook
 * Ensures consistent data across /journey, /documents, /verification, and /overview
 */

export interface BuyerSyncData {
  // Journey Progress
  journeyStage: string;
  journeyProgress: number;
  completedTasks: string[];
  nextTasks: string[];
  
  // Document Status  
  documentsUploaded: number;
  documentsVerified: number;
  documentsPending: number;
  totalDocuments: number;
  
  // Verification Status
  verificationStage: 'pending' | 'in_progress' | 'completed' | 'rejected';
  identityVerified: boolean;
  financialVerified: boolean;
  addressVerified: boolean;
  
  // Buyer Overview Metrics
  budget: number;
  preApprovalAmount: number;
  htbBenefit: number;
  savedProperties: number;
  
  // Cross-platform integrations
  propChoiceSelections: number;
  propChoiceValue: number;
  
  // System metadata
  lastSyncedAt: string;
  syncVersion: string;
}

interface UseBuyerSyncReturn {
  data: BuyerSyncData | null;
  isLoading: boolean;
  error: string | null;
  updateField: (field: string, value: any) => Promise<boolean>;
  refresh: () => Promise<void>;
  getCompletionPercentage: () => number;
  getDocumentProgress: () => number;
  getVerificationProgress: () => number;
  getJourneyStatus: () => 'getting_started' | 'in_progress' | 'nearly_complete' | 'complete';
}

export const useBuyerSync = (): UseBuyerSyncReturn => {
  const [data, setData] = useState<BuyerSyncData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch buyer sync data
  const fetchSyncData = useCallback(async () => {

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/buyer/sync', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch buyer sync data');
      }
    } catch (err) {
      console.error('Error fetching buyer sync data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update a specific field
  const updateField = useCallback(async (field: string, value: any): Promise<boolean> => {

    try {
      const response = await fetch('/api/buyer/sync', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ field, value }),
      });

      if (response.ok) {
        // Update local data optimistically
        setData(prev => prev ? { ...prev, [field]: value } : null);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating buyer field:', err);
      return false;
    }
  }, []);

  // Refresh data
  const refresh = useCallback(async () => {
    await fetchSyncData();
  }, [fetchSyncData]);

  // Calculate completion percentage based on verified documents and journey progress
  const getCompletionPercentage = useCallback((): number => {
    if (!data) return 0;
    
    const documentWeight = 0.4; // 40% weight for documents
    const journeyWeight = 0.6;   // 60% weight for journey progress
    
    const documentProgress = (data.documentsVerified / data.totalDocuments) * 100;
    const journeyProgress = data.journeyProgress;
    
    return Math.round((documentProgress * documentWeight) + (journeyProgress * journeyWeight));
  }, [data]);

  // Get document progress percentage
  const getDocumentProgress = useCallback((): number => {
    if (!data) return 0;
    return Math.round((data.documentsVerified / data.totalDocuments) * 100);
  }, [data]);

  // Get verification progress percentage
  const getVerificationProgress = useCallback((): number => {
    if (!data) return 0;
    
    const verifications = [
      data.identityVerified,
      data.financialVerified, 
      data.addressVerified
    ];
    
    const completed = verifications.filter(Boolean).length;
    return Math.round((completed / verifications.length) * 100);
  }, [data]);

  // Get overall journey status
  const getJourneyStatus = useCallback((): 'getting_started' | 'in_progress' | 'nearly_complete' | 'complete' => {
    const completion = getCompletionPercentage();
    
    if (completion >= 95) return 'complete';
    if (completion >= 80) return 'nearly_complete';
    if (completion >= 20) return 'in_progress';
    return 'getting_started';
  }, [getCompletionPercentage]);

  // Initial data fetch
  useEffect(() => {
    fetchSyncData();
  }, [fetchSyncData]);

  // Set up real-time sync (in a real implementation, this would use WebSockets)
  useEffect(() => {
    // Simulate periodic sync every 30 seconds
    const interval = setInterval(() => {
      fetchSyncData();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchSyncData]);

  return {
    data,
    isLoading,
    error,
    updateField,
    refresh,
    getCompletionPercentage,
    getDocumentProgress,
    getVerificationProgress,
    getJourneyStatus
  };
};

// Helper hooks for specific page requirements

export const useDocumentSync = () => {
  const { data, updateField, getDocumentProgress } = useBuyerSync();
  
  return {
    documentsUploaded: data?.documentsUploaded || 0,
    documentsVerified: data?.documentsVerified || 0,
    documentsPending: data?.documentsPending || 0,
    totalDocuments: data?.totalDocuments || 0,
    documentProgress: getDocumentProgress(),
    updateDocuments: (uploaded: number, verified: number, pending: number) => {
      updateField('documentsUploaded', uploaded);
      updateField('documentsVerified', verified);
      updateField('documentsPending', pending);
    }
  };
};

export const useJourneySync = () => {
  const { data, updateField, getCompletionPercentage, getJourneyStatus } = useBuyerSync();
  
  return {
    journeyStage: data?.journeyStage || 'preparation',
    journeyProgress: data?.journeyProgress || 0,
    completedTasks: data?.completedTasks || [],
    nextTasks: data?.nextTasks || [],
    completionPercentage: getCompletionPercentage(),
    journeyStatus: getJourneyStatus(),
    completeTask: (taskId: string) => {
      const newCompleted = [...(data?.completedTasks || []), taskId];
      updateField('completedTasks', newCompleted);
    }
  };
};

export const useVerificationSync = () => {
  const { data, updateField, getVerificationProgress } = useBuyerSync();
  
  return {
    verificationStage: data?.verificationStage || 'pending',
    identityVerified: data?.identityVerified || false,
    financialVerified: data?.financialVerified || false,
    addressVerified: data?.addressVerified || false,
    verificationProgress: getVerificationProgress(),
    updateVerification: (type: 'identity' | 'financial' | 'address', verified: boolean) => {
      updateField(`${type}Verified`, verified);
    }
  };
};

export const useOverviewSync = () => {
  const { data, getCompletionPercentage, getJourneyStatus } = useBuyerSync();
  
  return {
    budget: data?.budget || 0,
    preApprovalAmount: data?.preApprovalAmount || 0,
    htbBenefit: data?.htbBenefit || 0,
    savedProperties: data?.savedProperties || 0,
    propChoiceSelections: data?.propChoiceSelections || 0,
    propChoiceValue: data?.propChoiceValue || 0,
    overallProgress: getCompletionPercentage(),
    journeyStatus: getJourneyStatus(),
    lastSyncedAt: data?.lastSyncedAt || new Date().toISOString()
  };
};