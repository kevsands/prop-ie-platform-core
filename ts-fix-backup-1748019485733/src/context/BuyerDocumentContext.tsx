'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Document as DocumentType } from '@/types/document';
import { 
  BuyerDocumentCategory,
  BuyerPhaseToDocumentCategory,
  DocumentUploadStatus,
  PhaseDocumentProgress,
  RequiredDocument,
  getRequiredDocumentsForPhase
} from '@/types/buyer-documents';
import { BuyerPhase } from '@/types/buyer-journey';
import { buyerDocumentService } from '@/services/buyerDocumentService';
import { useBuyerJourney } from '@/hooks/useBuyerJourney';

interface BuyerDocumentContextType {
  documents: DocumentType[];
  requiredDocuments: RequiredDocument[];
  documentStatuses: DocumentUploadStatus[];
  phaseProgress: Record<BuyerPhase, PhaseDocumentProgress>\n  );
  overallProgress: number;
  loading: boolean;
  error: string | null;
  uploadDocument: (file: File, documentInfo: { 
    requiredDocumentId: string;
    name: string;
    description?: string;
    type: string;
  }) => Promise<{
    success: boolean;
    document?: DocumentType;
    message?: string;
  }>\n  );
  deleteDocument: (documentId: string) => Promise<{
    success: boolean;
    message?: string;
  }>\n  );
  refreshDocuments: () => Promise<void>\n  );
  getPhaseDocuments: (phase: BuyerPhase) => DocumentType[];
}

const BuyerDocumentContext = createContext<BuyerDocumentContextType | undefined>(undefined);

export const BuyerDocumentProvider: React.FC<{ 
  children: React.ReactNode;
  buyerId: string;
}> = ({ children, buyerId }) => {
  const [documentssetDocuments] = useState<DocumentType[]>([]);
  const [requiredDocumentssetRequiredDocuments] = useState<RequiredDocument[]>([]);
  const [documentStatusessetDocumentStatuses] = useState<DocumentUploadStatus[]>([]);
  const [phaseProgresssetPhaseProgress] = useState<Record<BuyerPhase, PhaseDocumentProgress>>({} as Record<BuyerPhase, PhaseDocumentProgress>);
  const [overallProgresssetOverallProgress] = useState<number>(0);
  const [loadingsetLoading] = useState<boolean>(true);
  const [errorsetError] = useState<string | null>(null);
  
  const { journey, refreshJourney } = useBuyerJourney();
  
  // Fetch all required documents based on the journey phase
  const fetchRequiredDocuments = useCallback(() => {
    try {
      if (!journey) return;
      
      const currentPhase = journey.currentPhase;
      const phaseDocuments = getRequiredDocumentsForPhase(currentPhase);
      
      setRequiredDocuments(phaseDocuments);
    } catch (err) {
      setError('Failed to load required documents');
      console.error('Error loading required documents:', err);
    }
  }, [journey]);
  
  // Fetch buyer documents
  const fetchDocuments = useCallback(async () => {
    if (!buyerId) return;
    
    setLoading(true);
    try {
      const docs = await buyerDocumentService.getBuyerDocuments(buyerId);
      setDocuments(docs);
      
      // Calculate progress for each phase
      const progress = await buyerDocumentService.getOverallDocumentProgress(buyerId);
      setPhaseProgress(progress);
      
      // Calculate overall progress
      // BuyerPhase is a type, not an enum, so we need to create our array of phases
      const phases: BuyerPhase[] = [
        'PLANNING', 
        'FINANCING', 
        'PROPERTY_SEARCH', 
        'RESERVATION', 
        'LEGAL_PROCESS', 
        'CONSTRUCTION', 
        'COMPLETION', 
        'POST_PURCHASE'
      ];
      
      const totalRequired = phases.reduce((totalphase) => 
        total + (progress[phase as keyof typeof progress]?.requiredCount || 0), 0);
      const totalUploaded = phases.reduce((totalphase) => 
        total + (progress[phase as keyof typeof progress]?.uploadedCount || 0), 0);
      
      const overall = totalRequired> 0 
        ? Math.floor((totalUploaded / totalRequired) * 100) 
        : 0;
      setOverallProgress(overall);
      
      // Flatten document statuses from all phases
      const allStatuses = Object.values(progress).flatMap(p => 
        p && 'documents' in p ? p.documents : []
      );
      setDocumentStatuses(allStatuses);
      
      setError(null);
    } catch (err) {
      setError('Failed to load documents');
      console.error('Error loading documents:', err);
    } finally {
      setLoading(false);
    }
  }, [buyerId]);
  
  // Upload a document
  const uploadDocument = async (file: File, documentInfo: { 
    requiredDocumentId: string;
    name: string;
    description?: string;
    type: string;
  }) => {
    if (!buyerId) {
      return { success: false, message: 'Buyer ID is missing' };
    }
    
    try {
      const result = await buyerDocumentService.uploadBuyerDocument(
        file,
        {
          ...documentInfo,
          type: documentInfo.type
        },
        buyerId,
        journey?.currentPhase
      );
      
      if (result.success) {
        // Refresh documents
        await fetchDocuments();
      }
      
      return result;
    } catch (err) {
      console.error('Error uploading document:', err);
      return { 
        success: false, 
        message: err instanceof Error ? err.message : 'An error occurred during upload' 
      };
    }
  };
  
  // Delete a document
  const deleteDocument = async (documentId: string) => {
    try {
      const result = await buyerDocumentService.deleteBuyerDocument(documentId);
      
      if (result.success) {
        // Refresh documents
        await fetchDocuments();
      }
      
      return result;
    } catch (err) {
      console.error('Error deleting document:', err);
      return { 
        success: false, 
        message: err instanceof Error ? err.message : 'An error occurred while deleting' 
      };
    }
  };
  
  // Get documents for a specific phase
  const getPhaseDocuments = (phase: BuyerPhase) => {
    // Get the corresponding BuyerDocumentCategory for the phase
    const phaseCategory = BuyerPhaseToDocumentCategory[phase];
    
    return documents.filter(doc => 
      doc.metadata?.journeyPhaseId === phase || 
      (doc.metadata?.requiredDocumentId && 
       requiredDocuments.some(rd => 
         rd.id === doc.metadata?.requiredDocumentId && 
         rd.requiredByPhase === phaseCategory
       ))
    );
  };
  
  // Refresh all documents and their status
  const refreshDocuments = async () => {
    await fetchDocuments();
    await refreshJourney();
  };
  
  // Load documents on initial render and when journey changes
  useEffect(() => {
    fetchRequiredDocuments();
    fetchDocuments();
  }, [fetchRequiredDocuments, fetchDocuments, journey?.currentPhase]);
  
  const value = {
    documents,
    requiredDocuments,
    documentStatuses,
    phaseProgress,
    overallProgress,
    loading,
    error,
    uploadDocument,
    deleteDocument,
    refreshDocuments,
    getPhaseDocuments
  };
  
  return (
    <BuyerDocumentContext.Provider value={value}>
      {children}
    </BuyerDocumentContext.Provider>
  );
};

export const useBuyerDocuments = () => {
  const context = useContext(BuyerDocumentContext);
  if (context === undefined) {
    throw new Error('useBuyerDocuments must be used within a BuyerDocumentProvider');
  }
  return context;
};

export default BuyerDocumentContext;