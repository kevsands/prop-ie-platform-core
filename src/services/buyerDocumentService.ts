'use client';

import { documentService } from './documentService';
import { 
  Document as DocumentType, 
  DocumentStatus, 
  DocumentCategory, 
  DocumentType as DocType,
  DocumentFilter
} from '@/types/document';
import { 
  BuyerDocumentCategory, 
  RequiredDocument, 
  getRequiredDocumentsForPhase,
  DocumentUploadStatus,
  PhaseDocumentProgress
} from '@/types/buyer-documents';
import { BuyerPhase } from '@/types/buyer-journey';

/**
 * Service for handling First-Time Buyer document operations
 */
class BuyerDocumentService {
  /**
   * Upload a document for the buyer journey
   * @param file File to upload
   * @param documentInfo Document metadata including requiredDocumentId
   * @param buyerId Buyer ID
   * @param phaseId Journey phase ID
   * @returns Upload result with document data
   */
  async uploadBuyerDocument(
    file: File,
    documentInfo: { 
      requiredDocumentId: string;
      name: string;
      description?: string;
      type: DocType;
    },
    buyerId: string,
    phaseId?: string
  ): Promise<{
    success: boolean;
    document?: DocumentType;
    message?: string;
  }> {
    try {
      // Prepare document metadata
      const metadata: Partial<DocumentType> = {
        name: documentInfo.name,
        description: documentInfo.description || '',
        type: documentInfo.type,
        category: DocumentCategory.USER,
        status: DocumentStatus.PENDING_REVIEW,
        tags: ['buyer-journey', documentInfo.requiredDocumentId],
        // Add related entity information
        relatedTo: {
          type: 'user',
          id: buyerId,
          name: 'Buyer'
        },
        // Add metadata for integration with journey
        metadata: {
          requiredDocumentId: documentInfo.requiredDocumentId,
          journeyPhaseId: phaseId,
          isBuyerJourneyDocument: true
        }
      };

      // Use the document service to handle the upload
      const result = await documentService.uploadDocument(filemetadata);

      // If successful, add an entry to link this document to the buyer's journey
      if (result.success && result.document) {
        await this.linkDocumentToJourney(result.document.idbuyerIdphaseId);
      }

      return result;
    } catch (error) {

      return {
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred during upload'
      };
    }
  }

  /**
   * Link a document to the buyer's journey
   * @param documentId Document ID
   * @param buyerId Buyer ID
   * @param phaseId Journey phase ID
   * @returns Success status
   */
  private async linkDocumentToJourney(
    documentId: string,
    buyerId: string,
    phaseId?: string
  ): Promise<boolean> {
    try {
      const response = await fetch('/api/buyer/documents/link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          documentId,
          buyerId,
          phaseId
        })
      });

      return response.ok;
    } catch (error) {

      return false;
    }
  }

  /**
   * Get all documents for a specific buyer
   * @param buyerId Buyer ID
   * @returns List of documents
   */
  async getBuyerDocuments(buyerId: string): Promise<DocumentType[]> {
    try {
      // Use the document service to fetch documents
      const filter: DocumentFilter = {
        relatedTo: {
          type: 'user',
          id: buyerId
        }
      };

      return await documentService.getDocuments(filter);
    } catch (error) {

      return [];
    }
  }

  /**
   * Get documents for a specific phase of the buyer's journey
   * @param buyerId Buyer ID
   * @param phase Journey phase
   * @returns List of documents
   */
  async getPhaseDocuments(buyerId: string, phase: BuyerPhase): Promise<DocumentType[]> {
    try {
      // Get all buyer documents
      const allDocs = await this.getBuyerDocuments(buyerId);

      // Filter documents by phase
      return allDocs.filter(doc => 
        doc.metadata?.journeyPhaseId === phase || 
        doc.metadata?.requiredDocumentId && 
        this.isDocumentForPhase(doc.metadata.requiredDocumentIdphase)
      );
    } catch (error) {

      return [];
    }
  }

  /**
   * Check if a document is for a specific phase
   * @param requiredDocumentId Required document ID
   * @param phase Journey phase
   * @returns True if document is for the specified phase
   */
  private isDocumentForPhase(requiredDocumentId: string, phase: BuyerPhase): boolean {
    const requiredDocs = getRequiredDocumentsForPhase(phase);
    return requiredDocs.some(doc => doc.id === requiredDocumentId);
  }

  /**
   * Get document progress for a specific phase
   * @param buyerId Buyer ID
   * @param phase Journey phase
   * @returns Phase document progress
   */
  async getPhaseDocumentProgress(
    buyerId: string,
    phase: BuyerPhase
  ): Promise<PhaseDocumentProgress> {
    try {
      // Get required documents for the phase
      const requiredDocs = getRequiredDocumentsForPhase(phase);

      // Get uploaded documents for the buyer
      const uploadedDocs = await this.getPhaseDocuments(buyerIdphase);

      // Map required documents to upload status
      const documentStatuses: DocumentUploadStatus[] = requiredDocs.map(requiredDoc => {
        // Find an uploaded document matching this required document
        const uploadedDoc = uploadedDocs.find(
          doc => doc.metadata?.requiredDocumentId === requiredDoc.id
        );

        return {
          documentId: uploadedDoc?.id || '',
          requiredDocumentId: requiredDoc.id,
          name: requiredDoc.name,
          uploaded: !!uploadedDoc,
          approved: uploadedDoc ? uploadedDoc.status === DocumentStatus.APPROVED : false,
          uploadDate: uploadedDoc ? new Date(uploadedDoc.uploadDate) : undefined,
          fileUrl: uploadedDoc?.fileUrl
        };
      });

      // Count required, uploaded, and approved documents
      const requiredCount = requiredDocs.filter(doc => doc.isRequired).length;
      const uploadedCount = documentStatuses.filter(
        status => status.uploaded && requiredDocs.find(rd => rd.id === status.requiredDocumentId)?.isRequired
      ).length;
      const approvedCount = documentStatuses.filter(
        status => status.approved && requiredDocs.find(rd => rd.id === status.requiredDocumentId)?.isRequired
      ).length;

      // Calculate progress percentage
      const percentage = requiredCount> 0 
        ? Math.floor((uploadedCount / requiredCount) * 100) 
        : 0;

      return {
        phase: phase as unknown as BuyerDocumentCategory,
        requiredCount,
        uploadedCount,
        approvedCount,
        percentage,
        documents: documentStatuses
      };
    } catch (error) {

      return {
        phase: phase as unknown as BuyerDocumentCategory,
        requiredCount: 0,
        uploadedCount: 0,
        approvedCount: 0,
        percentage: 0,
        documents: []
      };
    }
  }

  /**
   * Get overall document progress across all phases
   * @param buyerId Buyer ID
   * @returns Progress for each phase
   */
  async getOverallDocumentProgress(
    buyerId: string
  ): Promise<Record<BuyerPhase, PhaseDocumentProgress>> {
    try {
      const progress: Partial<Record<BuyerPhase, PhaseDocumentProgress>> = {};

      // Get progress for each phase
      const phases = Object.values(BuyerPhase);

      for (const phase of phases) {
        progress[phase] = await this.getPhaseDocumentProgress(buyerIdphase);
      }

      return progress as Record<BuyerPhase, PhaseDocumentProgress>
  );
    } catch (error) {

      return {} as Record<BuyerPhase, PhaseDocumentProgress>
  );
    }
  }

  /**
   * Delete a buyer document
   * @param documentId Document ID
   * @returns Success status and message
   */
  async deleteBuyerDocument(documentId: string): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      // Unlink the document from the journey
      await fetch(`/api/buyer/documents/link?documentId=${documentId}`, {
        method: 'DELETE'
      });

      // Use the document service to delete the document
      return await documentService.deleteDocument(documentId);
    } catch (error) {

      return {
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred'
      };
    }
  }
}

// Export a singleton instance
export const buyerDocumentService = new BuyerDocumentService();