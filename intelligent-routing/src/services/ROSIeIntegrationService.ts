/**
 * ROS.ie Integration Service
 * Handles integration with Revenue Online Service (ROS.ie) for HTB claims and tax reporting
 */

interface ROSIeClaimStatus {
  claimId: string;
  status: 'submitted' | 'processing' | 'approved' | 'rejected' | 'paid';
  submissionDate: Date;
  approvalDate?: Date;
  amount: number;
  taxYear: number;
  property: {
    address: string;
    eircode: string;
    purchasePrice: number;
  };
  buyer: {
    ppsn: string;
    name: string;
    email: string;
  };
  documents: ROSIeDocument[];
  notifications: ROSIeNotification[];
}

interface ROSIeDocument {
  id: string;
  type: 'contract' | 'certificate' | 'bank_statement' | 'mortgage_approval' | 'other';
  name: string;
  uploadDate: Date;
  status: 'pending' | 'verified' | 'rejected';
  url?: string;
}

interface ROSIeNotification {
  id: string;
  type: 'status_update' | 'document_required' | 'payment_approved' | 'deadline_reminder';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionRequired?: boolean;
}

interface HTBEligibilityCheck {
  eligible: boolean;
  reasons?: string[];
  requirements: HTBRequirement[];
  estimatedAmount?: number;
}

interface HTBRequirement {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'pending' | 'not_applicable';
  required: boolean;
  evidence?: string[];
}

class ROSIeIntegrationService {
  private readonly baseUrl = process.env.ROSIE_API_URL || 'https://api.ros.ie/v1';
  private readonly apiKey = process.env.ROSIE_API_KEY || 'demo-key';

  /**
   * Check HTB eligibility for a buyer
   */
  async checkHTBEligibility(buyerId: string, propertyId: string): Promise<HTBEligibilityCheck> {
    try {
      // Simulate API call to ROS.ie
      await new Promise(resolve => setTimeout(resolve, 500));

      // Demo eligibility check
      const requirements: HTBRequirement[] = [
        {
          id: 'first_time_buyer',
          title: 'First-time Buyer Status',
          description: 'Must be a first-time buyer as defined by Revenue',
          status: 'completed',
          required: true,
          evidence: ['Declaration form', 'Bank confirmation']
        },
        {
          id: 'income_threshold',
          title: 'Income Threshold',
          description: 'Annual income must be below €50,000 (single) or €75,000 (couple)',
          status: 'completed',
          required: true,
          evidence: ['P60', 'Payslips']
        },
        {
          id: 'property_value',
          title: 'Property Value Limit',
          description: 'Property value must be below €500,000 (€525,000 in Dublin/Cork)',
          status: 'completed',
          required: true,
          evidence: ['Purchase contract', 'Valuation report']
        },
        {
          id: 'residence_requirement',
          title: 'Principal Private Residence',
          description: 'Property must be your principal private residence',
          status: 'pending',
          required: true,
          evidence: ['Statutory declaration']
        }
      ];

      const eligible = requirements.every(req => req.status === 'completed' || !req.required);

      return {
        eligible,
        requirements,
        estimatedAmount: eligible ? 20000 : undefined,
        reasons: eligible ? undefined : ['Income threshold not met', 'Documentation incomplete']
      };

    } catch (error) {
      console.error('HTB eligibility check failed:', error);
      throw new Error('Failed to check HTB eligibility');
    }
  }

  /**
   * Submit HTB claim to ROS.ie
   */
  async submitHTBClaim(buyerId: string, propertyId: string, claimData: any): Promise<ROSIeClaimStatus> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const claimId = `HTB-${Date.now()}`;
      
      return {
        claimId,
        status: 'submitted',
        submissionDate: new Date(),
        amount: 20000,
        taxYear: new Date().getFullYear(),
        property: {
          address: claimData.propertyAddress || '123 Demo Street, Dublin 1',
          eircode: claimData.eircode || 'D01 ABC1',
          purchasePrice: claimData.purchasePrice || 450000
        },
        buyer: {
          ppsn: claimData.ppsn || 'XXXXXXXX',
          name: claimData.buyerName || 'Demo Buyer',
          email: claimData.email || 'demo@example.com'
        },
        documents: [],
        notifications: [
          {
            id: 'n1',
            type: 'status_update',
            title: 'HTB Claim Submitted',
            message: 'Your Help-to-Buy claim has been successfully submitted to Revenue.',
            timestamp: new Date(),
            read: false,
            actionRequired: false
          }
        ]
      };

    } catch (error) {
      console.error('HTB claim submission failed:', error);
      throw new Error('Failed to submit HTB claim');
    }
  }

  /**
   * Get HTB claim status from ROS.ie
   */
  async getHTBClaimStatus(claimId: string): Promise<ROSIeClaimStatus> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));

      // Demo claim status
      return {
        claimId,
        status: 'processing',
        submissionDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        amount: 20000,
        taxYear: new Date().getFullYear(),
        property: {
          address: '123 Demo Street, Dublin 1',
          eircode: 'D01 ABC1',
          purchasePrice: 450000
        },
        buyer: {
          ppsn: 'XXXXXXXX',
          name: 'Demo Buyer',
          email: 'demo@example.com'
        },
        documents: [
          {
            id: 'd1',
            type: 'contract',
            name: 'Purchase Contract',
            uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            status: 'verified'
          },
          {
            id: 'd2',
            type: 'mortgage_approval',
            name: 'Mortgage Approval Letter',
            uploadDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            status: 'pending'
          }
        ],
        notifications: [
          {
            id: 'n2',
            type: 'document_required',
            title: 'Additional Documentation Required',
            message: 'Please upload your P60 for income verification.',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            read: false,
            actionRequired: true
          }
        ]
      };

    } catch (error) {
      console.error('Failed to get HTB claim status:', error);
      throw new Error('Failed to retrieve HTB claim status');
    }
  }

  /**
   * Upload document to ROS.ie for HTB claim
   */
  async uploadDocument(claimId: string, file: File, documentType: string): Promise<ROSIeDocument> {
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1500));

      return {
        id: `doc-${Date.now()}`,
        type: documentType as any,
        name: file.name,
        uploadDate: new Date(),
        status: 'pending',
        url: `/documents/${claimId}/${file.name}`
      };

    } catch (error) {
      console.error('Document upload failed:', error);
      throw new Error('Failed to upload document');
    }
  }

  /**
   * Get notifications from ROS.ie for a buyer
   */
  async getNotifications(buyerId: string): Promise<ROSIeNotification[]> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200));

      return [
        {
          id: 'n1',
          type: 'status_update',
          title: 'HTB Claim Approved',
          message: 'Your Help-to-Buy claim has been approved. Payment will be processed within 5 working days.',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          read: false,
          actionRequired: false
        },
        {
          id: 'n2',
          type: 'deadline_reminder',
          title: 'Tax Return Deadline Approaching',
          message: 'Your annual tax return is due in 30 days. Don\'t forget to include your HTB claim.',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          read: true,
          actionRequired: true
        }
      ];

    } catch (error) {
      console.error('Failed to get notifications:', error);
      return [];
    }
  }

  /**
   * Calculate HTB amount based on property details
   */
  calculateHTBAmount(purchasePrice: number, buyerIncome: number, isCouple: boolean = false): number {
    const maxAmount = 20000;
    const maxIncomeThreshold = isCouple ? 75000 : 50000;
    const maxPropertyValue = 500000; // Simplified - actual varies by location

    if (buyerIncome > maxIncomeThreshold || purchasePrice > maxPropertyValue) {
      return 0;
    }

    // HTB is 5% of purchase price up to maximum
    const calculatedAmount = Math.min(purchasePrice * 0.05, maxAmount);
    return Math.floor(calculatedAmount);
  }

  /**
   * Sync HTB status with local database
   */
  async syncHTBStatus(userId: string): Promise<void> {
    try {
      // This would sync ROS.ie data with local database
      // For demo purposes, we'll just simulate the sync
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`HTB status synced for user ${userId}`);
    } catch (error) {
      console.error('HTB sync failed:', error);
      throw new Error('Failed to sync HTB status');
    }
  }
}

// Export singleton instance
export const rosieIntegrationService = new ROSIeIntegrationService();

// Export types
export type {
  ROSIeClaimStatus,
  ROSIeDocument,
  ROSIeNotification,
  HTBEligibilityCheck,
  HTBRequirement
};