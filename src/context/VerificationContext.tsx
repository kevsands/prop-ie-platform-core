'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useEnterpriseAuth } from './EnterpriseAuthContext';

// Types for verification system
export interface VerificationDocument {
  id: string;
  name: string;
  type: 'identity' | 'address' | 'income' | 'employment' | 'funds' | 'other';
  category: 'personal' | 'financial' | 'legal';
  status: 'not-started' | 'uploaded' | 'under-review' | 'approved' | 'rejected';
  uploadedDate?: Date;
  reviewedDate?: Date;
  expiryDate?: Date;
  fileUrl?: string;
  rejectionReason?: string;
  notes?: string;
  isRequired: boolean;
  requiresManualReview?: boolean;
}

export interface VerificationStep {
  id: string;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
  documents: VerificationDocument[];
  order: number;
  dependencies?: string[]; // IDs of steps that must be completed first
}

export interface VerificationProfile {
  userId: string;
  overallStatus: 'not-started' | 'in-progress' | 'completed' | 'rejected';
  completionPercentage: number;
  lastUpdated: Date;
  steps: VerificationStep[];
  riskLevel: 'low' | 'medium' | 'high';
  complianceNotes?: string;
  nextAction?: {
    type: 'upload-document' | 'await-review' | 'contact-support' | 'complete';
    description: string;
    documentId?: string;
  };
}

interface VerificationContextType {
  // State
  profile: VerificationProfile | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  initializeVerification: () => Promise<void>;
  uploadDocument: (documentId: string, file: File) => Promise<void>;
  retryDocument: (documentId: string) => Promise<void>;
  getStepProgress: (stepId: string) => number;
  getOverallProgress: () => number;
  canProceedToStep: (stepId: string) => boolean;
  markStepComplete: (stepId: string) => Promise<void>;
  refreshVerificationStatus: () => Promise<void>;
  
  // Getters
  isVerificationComplete: () => boolean;
  getRequiredDocuments: () => VerificationDocument[];
  getPendingDocuments: () => VerificationDocument[];
  getRejectedDocuments: () => VerificationDocument[];
  getCurrentStep: () => VerificationStep | null;
  getNextRequiredAction: () => string | null;
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

// Mock data structure - would come from API in production
const createInitialVerificationProfile = (userId: string): VerificationProfile => ({
  userId,
  overallStatus: 'not-started',
  completionPercentage: 0,
  lastUpdated: new Date(),
  riskLevel: 'medium',
  steps: [
    {
      id: 'identity-verification',
      title: 'Identity Verification',
      description: 'Verify your identity with government-issued documents',
      status: 'not-started',
      order: 1,
      documents: [
        {
          id: 'identity-primary',
          name: 'Government Photo ID',
          type: 'identity',
          category: 'personal',
          status: 'not-started',
          isRequired: true,
          requiresManualReview: true,
          notes: 'Valid passport, driver\'s license, or national ID card'
        },
        {
          id: 'identity-selfie',
          name: 'Selfie with ID',
          type: 'identity',
          category: 'personal',
          status: 'not-started',
          isRequired: true,
          requiresManualReview: true,
          notes: 'Take a selfie holding your ID document next to your face'
        }
      ]
    },
    {
      id: 'address-verification',
      title: 'Address Verification',
      description: 'Confirm your current residential address',
      status: 'not-started',
      order: 2,
      dependencies: ['identity-verification'],
      documents: [
        {
          id: 'address-proof',
          name: 'Proof of Address',
          type: 'address',
          category: 'personal',
          status: 'not-started',
          isRequired: true,
          requiresManualReview: true,
          notes: 'Utility bill, bank statement, or government letter dated within 3 months'
        }
      ]
    },
    {
      id: 'financial-verification',
      title: 'Financial Verification',
      description: 'Verify your income and financial capacity',
      status: 'not-started',
      order: 3,
      dependencies: ['identity-verification'],
      documents: [
        {
          id: 'income-proof',
          name: 'Proof of Income',
          type: 'income',
          category: 'financial',
          status: 'not-started',
          isRequired: true,
          requiresManualReview: true,
          notes: 'Recent payslips, employment contract, or tax returns'
        },
        {
          id: 'bank-statements',
          name: 'Bank Statements',
          type: 'funds',
          category: 'financial',
          status: 'not-started',
          isRequired: true,
          requiresManualReview: true,
          notes: 'Last 6 months of bank statements showing salary deposits'
        },
        {
          id: 'employment-letter',
          name: 'Employment Verification',
          type: 'employment',
          category: 'financial',
          status: 'not-started',
          isRequired: false,
          requiresManualReview: true,
          notes: 'Letter from employer confirming employment and salary'
        }
      ]
    },
    {
      id: 'aml-compliance',
      title: 'AML Compliance',
      description: 'Anti-Money Laundering compliance verification',
      status: 'not-started',
      order: 4,
      dependencies: ['identity-verification', 'financial-verification'],
      documents: [
        {
          id: 'source-of-funds',
          name: 'Source of Funds Declaration',
          type: 'funds',
          category: 'legal',
          status: 'not-started',
          isRequired: true,
          requiresManualReview: true,
          notes: 'Detailed explanation of deposit source with supporting documents'
        }
      ]
    }
  ],
  nextAction: {
    type: 'upload-document',
    description: 'Upload your government photo ID to begin verification',
    documentId: 'identity-primary'
  }
});

export function VerificationProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useEnterpriseAuth();
  const [profile, setProfile] = useState<VerificationProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize verification profile
  const initializeVerification = async () => {
    if (!isAuthenticated || !user) {
      setError('User must be authenticated to initialize verification');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // In production, this would fetch from API
      // For now, create mock profile or fetch from localStorage
      const existingProfile = localStorage.getItem(`verification_${user.id}`);
      
      if (existingProfile) {
        const parsed = JSON.parse(existingProfile);
        // Convert date strings back to Date objects
        parsed.lastUpdated = new Date(parsed.lastUpdated);
        parsed.steps.forEach((step: VerificationStep) => {
          step.documents.forEach((doc: VerificationDocument) => {
            if (doc.uploadedDate) doc.uploadedDate = new Date(doc.uploadedDate);
            if (doc.reviewedDate) doc.reviewedDate = new Date(doc.reviewedDate);
            if (doc.expiryDate) doc.expiryDate = new Date(doc.expiryDate);
          });
        });
        setProfile(parsed);
      } else {
        const newProfile = createInitialVerificationProfile(user.id);
        setProfile(newProfile);
        localStorage.setItem(`verification_${user.id}`, JSON.stringify(newProfile));
      }
    } catch (err) {
      setError('Failed to initialize verification profile');
      console.error('Verification initialization error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Upload document
  const uploadDocument = async (documentId: string, file: File) => {
    if (!profile) return;

    setLoading(true);
    setError(null);

    try {
      // Simulate API upload
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update document status
      const updatedProfile = { ...profile };
      let documentFound = false;

      updatedProfile.steps.forEach(step => {
        step.documents.forEach(doc => {
          if (doc.id === documentId) {
            doc.status = 'uploaded';
            doc.uploadedDate = new Date();
            doc.fileUrl = URL.createObjectURL(file); // Mock URL
            documentFound = true;
          }
        });
      });

      if (!documentFound) {
        throw new Error('Document not found');
      }

      // Update step status
      updatedProfile.steps.forEach(step => {
        const requiredDocs = step.documents.filter(doc => doc.isRequired);
        const uploadedDocs = requiredDocs.filter(doc => ['uploaded', 'approved'].includes(doc.status));
        
        if (uploadedDocs.length === requiredDocs.length && step.status === 'not-started') {
          step.status = 'in-progress';
        }
      });

      // Update overall progress
      updatedProfile.completionPercentage = calculateCompletionPercentage(updatedProfile);
      updatedProfile.lastUpdated = new Date();

      // Simulate review process - mark as approved after 5 seconds
      setTimeout(() => {
        const doc = updatedProfile.steps
          .flatMap(s => s.documents)
          .find(d => d.id === documentId);
        if (doc) {
          doc.status = 'approved';
          doc.reviewedDate = new Date();
          setProfile({ ...updatedProfile });
          localStorage.setItem(`verification_${user!.id}`, JSON.stringify(updatedProfile));
        }
      }, 5000);

      setProfile(updatedProfile);
      localStorage.setItem(`verification_${user!.id}`, JSON.stringify(updatedProfile));
    } catch (err) {
      setError('Failed to upload document');
      console.error('Document upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Retry document upload
  const retryDocument = async (documentId: string) => {
    if (!profile) return;

    const updatedProfile = { ...profile };
    updatedProfile.steps.forEach(step => {
      step.documents.forEach(doc => {
        if (doc.id === documentId) {
          doc.status = 'not-started';
          doc.rejectionReason = undefined;
          doc.uploadedDate = undefined;
          doc.reviewedDate = undefined;
        }
      });
    });

    setProfile(updatedProfile);
    localStorage.setItem(`verification_${user!.id}`, JSON.stringify(updatedProfile));
  };

  // Get step progress percentage
  const getStepProgress = (stepId: string): number => {
    if (!profile) return 0;
    
    const step = profile.steps.find(s => s.id === stepId);
    if (!step) return 0;

    const requiredDocs = step.documents.filter(doc => doc.isRequired);
    const completedDocs = requiredDocs.filter(doc => doc.status === 'approved');
    
    return requiredDocs.length > 0 ? (completedDocs.length / requiredDocs.length) * 100 : 0;
  };

  // Get overall progress percentage
  const getOverallProgress = (): number => {
    if (!profile) return 0;
    return profile.completionPercentage;
  };

  // Check if user can proceed to a step
  const canProceedToStep = (stepId: string): boolean => {
    if (!profile) return false;
    
    const step = profile.steps.find(s => s.id === stepId);
    if (!step || !step.dependencies) return true;

    return step.dependencies.every(depId => {
      const depStep = profile.steps.find(s => s.id === depId);
      return depStep && depStep.status === 'completed';
    });
  };

  // Mark step as complete
  const markStepComplete = async (stepId: string) => {
    if (!profile) return;

    const updatedProfile = { ...profile };
    const step = updatedProfile.steps.find(s => s.id === stepId);
    
    if (step) {
      step.status = 'completed';
      updatedProfile.lastUpdated = new Date();
      updatedProfile.completionPercentage = calculateCompletionPercentage(updatedProfile);
      
      setProfile(updatedProfile);
      localStorage.setItem(`verification_${user!.id}`, JSON.stringify(updatedProfile));
    }
  };

  // Refresh verification status from server
  const refreshVerificationStatus = async () => {
    // In production, this would fetch latest status from API
    await initializeVerification();
  };

  // Helper functions
  const calculateCompletionPercentage = (profile: VerificationProfile): number => {
    const totalSteps = profile.steps.length;
    const completedSteps = profile.steps.filter(s => s.status === 'completed').length;
    return totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
  };

  const isVerificationComplete = (): boolean => {
    return profile?.overallStatus === 'completed' || getOverallProgress() === 100;
  };

  const getRequiredDocuments = (): VerificationDocument[] => {
    if (!profile) return [];
    return profile.steps.flatMap(step => step.documents.filter(doc => doc.isRequired));
  };

  const getPendingDocuments = (): VerificationDocument[] => {
    if (!profile) return [];
    return profile.steps.flatMap(step => 
      step.documents.filter(doc => ['not-started', 'uploaded', 'under-review'].includes(doc.status))
    );
  };

  const getRejectedDocuments = (): VerificationDocument[] => {
    if (!profile) return [];
    return profile.steps.flatMap(step => step.documents.filter(doc => doc.status === 'rejected'));
  };

  const getCurrentStep = (): VerificationStep | null => {
    if (!profile) return null;
    
    // Find first incomplete step that user can access
    return profile.steps
      .sort((a, b) => a.order - b.order)
      .find(step => 
        step.status !== 'completed' && 
        canProceedToStep(step.id)
      ) || null;
  };

  const getNextRequiredAction = (): string | null => {
    if (!profile || isVerificationComplete()) return null;
    
    const currentStep = getCurrentStep();
    if (!currentStep) return 'Contact support for assistance';

    const pendingDoc = currentStep.documents.find(doc => 
      doc.isRequired && doc.status === 'not-started'
    );

    if (pendingDoc) {
      return `Upload ${pendingDoc.name}`;
    }

    const rejectedDoc = currentStep.documents.find(doc => 
      doc.isRequired && doc.status === 'rejected'
    );

    if (rejectedDoc) {
      return `Re-upload ${rejectedDoc.name}`;
    }

    return 'Awaiting document review';
  };

  // Initialize on mount
  useEffect(() => {
    if (isAuthenticated && user && !profile) {
      initializeVerification();
    }
  }, [isAuthenticated, user]);

  const value: VerificationContextType = {
    // State
    profile,
    loading,
    error,
    
    // Actions
    initializeVerification,
    uploadDocument,
    retryDocument,
    getStepProgress,
    getOverallProgress,
    canProceedToStep,
    markStepComplete,
    refreshVerificationStatus,
    
    // Getters
    isVerificationComplete,
    getRequiredDocuments,
    getPendingDocuments,
    getRejectedDocuments,
    getCurrentStep,
    getNextRequiredAction,
  };

  return (
    <VerificationContext.Provider value={value}>
      {children}
    </VerificationContext.Provider>
  );
}

export function useVerification() {
  const context = useContext(VerificationContext);
  if (context === undefined) {
    throw new Error('useVerification must be used within a VerificationProvider');
  }
  return context;
}