/**
 * Verification Status Service
 * 
 * Provides real-time integration between the buyer dashboard and verification system
 * Syncs KYC/AML status across all buyer interfaces
 */

export interface VerificationDocument {
  id: string;
  name: string;
  type: 'identity' | 'address' | 'income' | 'employment' | 'other';
  status: 'not-started' | 'uploaded' | 'under-review' | 'approved' | 'rejected';
  uploadedDate?: Date;
  reviewedDate?: Date;
  expiryDate?: Date;
  notes?: string;
  rejectionReason?: string;
  fileUrl?: string;
  isRequired: boolean;
}

export interface VerificationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  documents: VerificationDocument[];
}

export interface VerificationStatus {
  overallStatus: 'not-started' | 'pending' | 'approved' | 'rejected';
  completionPercentage: number;
  verificationLevel: 'basic' | 'enhanced' | 'complete';
  amlRiskScore: number;
  steps: VerificationStep[];
  documentsUploaded: number;
  totalDocuments: number;
  requiredDocumentsRemaining: number;
  estimatedCompletionTime: string;
  nextRequiredAction?: {
    title: string;
    description: string;
    documentId: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
  };
}

export class VerificationStatusService {
  private static instance: VerificationStatusService;
  
  public static getInstance(): VerificationStatusService {
    if (!VerificationStatusService.instance) {
      VerificationStatusService.instance = new VerificationStatusService();
    }
    return VerificationStatusService.instance;
  }

  /**
   * Get current verification status for a user
   */
  async getVerificationStatus(userId: string): Promise<VerificationStatus> {
    try {
      // In a real implementation, this would fetch from your backend API
      // For now, we'll use the same mock data as the verification page
      const mockSteps: VerificationStep[] = [
        {
          id: '1',
          title: 'Identity Verification',
          description: 'Verify your identity with government-issued documents',
          status: 'completed',
          documents: [
            {
              id: 'id-1',
              name: 'Passport',
              type: 'identity',
              status: 'approved',
              uploadedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              reviewedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
              expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
              isRequired: true
            },
            {
              id: 'id-2',
              name: 'Driver\'s License',
              type: 'identity',
              status: 'approved',
              uploadedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              reviewedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
              isRequired: false
            }
          ]
        },
        {
          id: '2',
          title: 'Address Verification',
          description: 'Confirm your current residential address',
          status: 'in-progress',
          documents: [
            {
              id: 'addr-1',
              name: 'Utility Bill',
              type: 'address',
              status: 'under-review',
              uploadedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
              isRequired: true,
              notes: 'Must be dated within last 3 months'
            },
            {
              id: 'addr-2',
              name: 'Bank Statement',
              type: 'address',
              status: 'not-started',
              isRequired: true,
              notes: 'Recent statement showing current address'
            }
          ]
        },
        {
          id: '3',
          title: 'Financial Verification',
          description: 'Verify your income and financial status',
          status: 'pending',
          documents: [
            {
              id: 'fin-1',
              name: 'Salary Slips (Last 3 months)',
              type: 'income',
              status: 'not-started',
              isRequired: true
            },
            {
              id: 'fin-2',
              name: 'Employment Contract',
              type: 'employment',
              status: 'not-started',
              isRequired: true
            },
            {
              id: 'fin-3',
              name: 'Bank Statements (Last 6 months)',
              type: 'income',
              status: 'not-started',
              isRequired: true
            }
          ]
        },
        {
          id: '4',
          title: 'Additional Documents',
          description: 'Any additional documentation required',
          status: 'pending',
          documents: [
            {
              id: 'add-1',
              name: 'Mortgage Pre-Approval',
              type: 'other',
              status: 'not-started',
              isRequired: false
            },
            {
              id: 'add-2',
              name: 'Reference Letter',
              type: 'other',
              status: 'not-started',
              isRequired: false
            }
          ]
        }
      ];

      // Calculate verification metrics
      const allDocuments = mockSteps.flatMap(step => step.documents);
      const requiredDocuments = allDocuments.filter(doc => doc.isRequired);
      const approvedRequired = requiredDocuments.filter(doc => doc.status === 'approved');
      const uploadedDocuments = allDocuments.filter(doc => 
        ['uploaded', 'under-review', 'approved'].includes(doc.status)
      );

      const completionPercentage = Math.round((approvedRequired.length / requiredDocuments.length) * 100);
      
      // Determine overall status
      let overallStatus: 'not-started' | 'pending' | 'approved' | 'rejected' = 'not-started';
      if (completionPercentage === 100) {
        overallStatus = 'approved';
      } else if (uploadedDocuments.length > 0) {
        overallStatus = 'pending';
      }

      // Determine verification level
      let verificationLevel: 'basic' | 'enhanced' | 'complete' = 'basic';
      if (completionPercentage >= 100) {
        verificationLevel = 'complete';
      } else if (completionPercentage >= 60) {
        verificationLevel = 'enhanced';
      }

      // Calculate AML risk score (mock)
      const amlRiskScore = Math.max(10, 30 - (completionPercentage * 0.2));

      // Find next required action
      const nextRequiredDoc = requiredDocuments.find(doc => doc.status === 'not-started');
      const nextRequiredAction = nextRequiredDoc ? {
        title: `Upload ${nextRequiredDoc.name}`,
        description: nextRequiredDoc.notes || `Upload your ${nextRequiredDoc.name.toLowerCase()} for verification`,
        documentId: nextRequiredDoc.id,
        priority: 'high' as const
      } : undefined;

      // Estimate completion time
      const remainingDocs = requiredDocuments.filter(doc => doc.status === 'not-started').length;
      const estimatedCompletionTime = remainingDocs === 0 ? 'Complete' : `${remainingDocs * 2} minutes`;

      return {
        overallStatus,
        completionPercentage,
        verificationLevel,
        amlRiskScore: Math.round(amlRiskScore),
        steps: mockSteps,
        documentsUploaded: uploadedDocuments.length,
        totalDocuments: allDocuments.length,
        requiredDocumentsRemaining: requiredDocuments.length - approvedRequired.length,
        estimatedCompletionTime,
        nextRequiredAction
      };
    } catch (error) {
      console.error('Error fetching verification status:', error);
      throw new Error('Failed to fetch verification status');
    }
  }

  /**
   * Get simplified verification summary for dashboard display
   */
  async getVerificationSummary(userId: string) {
    const status = await this.getVerificationStatus(userId);
    
    return {
      kycStatus: status.overallStatus,
      verificationLevel: status.verificationLevel,
      completionPercentage: status.completionPercentage,
      documentsUploaded: status.documentsUploaded,
      amlRiskScore: status.amlRiskScore,
      nextAction: status.nextRequiredAction,
      isReadyForTransactions: status.overallStatus === 'approved'
    };
  }

  /**
   * Update verification status (for when documents are uploaded)
   */
  async updateDocumentStatus(userId: string, documentId: string, status: string) {
    // In a real implementation, this would update the backend
    // For now, we'll just trigger a refresh
    console.log(`Document ${documentId} status updated to ${status} for user ${userId}`);
    return this.getVerificationStatus(userId);
  }

  /**
   * Get compliance score for dashboard
   */
  async getComplianceScore(userId: string): Promise<number> {
    const status = await this.getVerificationStatus(userId);
    
    let score = 0;
    
    // Identity verification (40%)
    if (status.overallStatus === 'approved') score += 40;
    else if (status.overallStatus === 'pending') score += 20;
    
    // Verification level (30%)
    if (status.verificationLevel === 'complete') score += 30;
    else if (status.verificationLevel === 'enhanced') score += 20;
    else if (status.verificationLevel === 'basic') score += 10;
    
    // Document completion (20%)
    score += (status.completionPercentage / 100) * 20;
    
    // AML risk assessment (10%)
    if (status.amlRiskScore <= 20) score += 10;
    else if (status.amlRiskScore <= 40) score += 5;
    
    return Math.round(score);
  }
}

// Export singleton instance
export const verificationStatusService = VerificationStatusService.getInstance();