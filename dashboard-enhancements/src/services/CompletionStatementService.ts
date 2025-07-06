/**
 * Completion Statement Service
 * Handles property completion tracking, statements, and milestone management
 */

interface CompletionStatement {
  id: string;
  propertyId: string;
  buyerId: string;
  developerId: string;
  status: 'draft' | 'pending_review' | 'approved' | 'completed';
  createdDate: Date;
  completionDate?: Date;
  totalAmount: number;
  balanceOwing: number;
  items: CompletionItem[];
  milestones: CompletionMilestone[];
  documents: CompletionDocument[];
  approvals: CompletionApproval[];
}

interface CompletionItem {
  id: string;
  description: string;
  category: 'base_price' | 'extras' | 'adjustments' | 'fees' | 'taxes';
  amount: number;
  status: 'included' | 'optional' | 'pending';
  dueDate?: Date;
}

interface CompletionMilestone {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending' | 'blocked';
  completedDate?: Date;
  expectedDate?: Date;
  responsible: string;
  dependencies?: string[];
}

interface CompletionDocument {
  id: string;
  name: string;
  type: 'legal' | 'financial' | 'technical' | 'compliance';
  status: 'required' | 'submitted' | 'approved' | 'rejected';
  uploadDate?: Date;
  approvedDate?: Date;
  url?: string;
  responsible: string;
}

interface CompletionApproval {
  id: string;
  type: 'legal' | 'financial' | 'technical' | 'final';
  approver: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedDate?: Date;
  comments?: string;
  conditions?: string[];
}

interface PropertyCompletion {
  propertyId: string;
  propertyAddress: string;
  purchasePrice: number;
  completionDate?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  progress: number;
  htbAmount?: number;
  milestones: CompletionMilestone[];
  documents: CompletionDocument[];
  stakeholders: StakeholderStatus[];
  nextActions: NextAction[];
}

interface StakeholderStatus {
  id: string;
  name: string;
  role: 'buyer' | 'seller' | 'solicitor' | 'bank' | 'surveyor' | 'estate_agent';
  email: string;
  phone?: string;
  status: 'active' | 'pending' | 'completed' | 'issues';
  lastContact?: Date;
  nextAction?: string;
}

interface NextAction {
  id: string;
  title: string;
  description: string;
  responsible: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  category: 'legal' | 'financial' | 'documentation' | 'inspection' | 'communication';
}

class CompletionStatementService {
  /**
   * Get completion status for a property purchase
   */
  async getCompletionStatus(propertyId: string, buyerId: string): Promise<PropertyCompletion> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const milestones: CompletionMilestone[] = [
        {
          id: 'm1',
          title: 'Mortgage Approval',
          description: 'Final mortgage approval and loan documents signed',
          status: 'completed',
          completedDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
          responsible: 'Bank of Ireland',
        },
        {
          id: 'm2',
          title: 'Legal Due Diligence',
          description: 'Solicitor review of property title and contracts',
          status: 'completed',
          completedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          responsible: 'O\'Sullivan & Partners Solicitors',
        },
        {
          id: 'm3',
          title: 'Property Survey',
          description: 'Professional structural survey and valuation',
          status: 'completed',
          completedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          responsible: 'Professional Surveyors Ltd',
        },
        {
          id: 'm4',
          title: 'HTB Application',
          description: 'Help-to-Buy application submitted to Revenue',
          status: 'current',
          expectedDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          responsible: 'Revenue Online Service',
        },
        {
          id: 'm5',
          title: 'Final Completion',
          description: 'Keys handover and property registration',
          status: 'pending',
          expectedDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          responsible: 'Fitzgerald Developments',
        }
      ];

      const documents: CompletionDocument[] = [
        {
          id: 'd1',
          name: 'Purchase Contract',
          type: 'legal',
          status: 'approved',
          uploadDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          approvedDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
          responsible: 'O\'Sullivan & Partners'
        },
        {
          id: 'd2',
          name: 'Mortgage Approval Letter',
          type: 'financial',
          status: 'approved',
          uploadDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          approvedDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
          responsible: 'Bank of Ireland'
        },
        {
          id: 'd3',
          name: 'Building Energy Rating (BER)',
          type: 'compliance',
          status: 'approved',
          uploadDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          approvedDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
          responsible: 'Certified BER Assessor'
        },
        {
          id: 'd4',
          name: 'HTB Declaration',
          type: 'financial',
          status: 'submitted',
          uploadDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          responsible: 'Buyer'
        },
        {
          id: 'd5',
          name: 'Insurance Certificate',
          type: 'compliance',
          status: 'required',
          responsible: 'Insurance Provider'
        }
      ];

      const stakeholders: StakeholderStatus[] = [
        {
          id: 's1',
          name: 'John Smith',
          role: 'buyer',
          email: 'john.smith@email.com',
          phone: '+353 87 123 4567',
          status: 'active',
          lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          nextAction: 'Submit insurance documentation'
        },
        {
          id: 's2',
          name: 'Fitzgerald Developments',
          role: 'seller',
          email: 'sales@fitzgeralddevelopments.ie',
          phone: '+353 1 234 5678',
          status: 'active',
          lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          nextAction: 'Prepare completion statement'
        },
        {
          id: 's3',
          name: 'O\'Sullivan & Partners',
          role: 'solicitor',
          email: 'conveyancing@osullivanlaw.ie',
          phone: '+353 1 345 6789',
          status: 'active',
          lastContact: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          nextAction: 'Review final contracts'
        },
        {
          id: 's4',
          name: 'Bank of Ireland',
          role: 'bank',
          email: 'mortgages@boi.com',
          phone: '+353 1 456 7890',
          status: 'completed',
          lastContact: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
        }
      ];

      const nextActions: NextAction[] = [
        {
          id: 'a1',
          title: 'Submit Home Insurance',
          description: 'Provide proof of home insurance covering the property',
          responsible: 'Buyer',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          priority: 'high',
          status: 'pending',
          category: 'documentation'
        },
        {
          id: 'a2',
          title: 'HTB Approval Confirmation',
          description: 'Confirm HTB approval with Revenue and provide reference',
          responsible: 'Revenue Online Service',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          priority: 'medium',
          status: 'in_progress',
          category: 'financial'
        },
        {
          id: 'a3',
          title: 'Final Walkthrough',
          description: 'Schedule final property inspection before completion',
          responsible: 'Fitzgerald Developments',
          dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          priority: 'medium',
          status: 'pending',
          category: 'inspection'
        }
      ];

      const completedMilestones = milestones.filter(m => m.status === 'completed').length;
      const progress = Math.round((completedMilestones / milestones.length) * 100);

      return {
        propertyId,
        propertyAddress: 'Apt 12, Fitzgerald Gardens, Dublin 8',
        purchasePrice: 450000,
        completionDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: 'in_progress',
        progress,
        htbAmount: 20000,
        milestones,
        documents,
        stakeholders,
        nextActions
      };

    } catch (error) {
      console.error('Failed to get completion status:', error);
      throw new Error('Failed to retrieve completion status');
    }
  }

  /**
   * Generate completion statement
   */
  async generateCompletionStatement(propertyId: string, buyerId: string): Promise<CompletionStatement> {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const items: CompletionItem[] = [
        {
          id: 'i1',
          description: 'Base Purchase Price',
          category: 'base_price',
          amount: 450000,
          status: 'included'
        },
        {
          id: 'i2',
          description: 'Upgraded Kitchen Package',
          category: 'extras',
          amount: 8000,
          status: 'included'
        },
        {
          id: 'i3',
          description: 'Premium Flooring',
          category: 'extras',
          amount: 4500,
          status: 'included'
        },
        {
          id: 'i4',
          description: 'Legal Fees',
          category: 'fees',
          amount: 2500,
          status: 'included'
        },
        {
          id: 'i5',
          description: 'Stamp Duty',
          category: 'taxes',
          amount: 18000,
          status: 'included'
        },
        {
          id: 'i6',
          description: 'HTB Credit',
          category: 'adjustments',
          amount: -20000,
          status: 'pending'
        }
      ];

      const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
      const balanceOwing = items
        .filter(item => item.status !== 'pending')
        .reduce((sum, item) => sum + item.amount, 0);

      return {
        id: `cs-${Date.now()}`,
        propertyId,
        buyerId,
        developerId: 'fitzgerald-dev',
        status: 'pending_review',
        createdDate: new Date(),
        totalAmount,
        balanceOwing,
        items,
        milestones: [],
        documents: [],
        approvals: []
      };

    } catch (error) {
      console.error('Failed to generate completion statement:', error);
      throw new Error('Failed to generate completion statement');
    }
  }

  /**
   * Update milestone status
   */
  async updateMilestone(propertyId: string, milestoneId: string, status: string): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log(`Milestone ${milestoneId} updated to ${status} for property ${propertyId}`);
    } catch (error) {
      console.error('Failed to update milestone:', error);
      throw new Error('Failed to update milestone');
    }
  }

  /**
   * Upload completion document
   */
  async uploadDocument(propertyId: string, file: File, documentType: string): Promise<CompletionDocument> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        id: `doc-${Date.now()}`,
        name: file.name,
        type: documentType as any,
        status: 'submitted',
        uploadDate: new Date(),
        responsible: 'Buyer'
      };

    } catch (error) {
      console.error('Document upload failed:', error);
      throw new Error('Failed to upload document');
    }
  }

  /**
   * Get completion timeline for property
   */
  async getCompletionTimeline(propertyId: string): Promise<CompletionMilestone[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));

      return [
        {
          id: 't1',
          title: 'Contract Signing',
          description: 'Purchase contract signed by all parties',
          status: 'completed',
          completedDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
          responsible: 'Legal Team'
        },
        {
          id: 't2',
          title: 'Mortgage Application',
          description: 'Formal mortgage application submitted',
          status: 'completed',
          completedDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
          responsible: 'Bank'
        },
        {
          id: 't3',
          title: 'Property Survey',
          description: 'Independent property survey completed',
          status: 'completed',
          completedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          responsible: 'Surveyor'
        },
        {
          id: 't4',
          title: 'Mortgage Approval',
          description: 'Final mortgage approval received',
          status: 'completed',
          completedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          responsible: 'Bank'
        },
        {
          id: 't5',
          title: 'HTB Application',
          description: 'Help-to-Buy application processing',
          status: 'current',
          expectedDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          responsible: 'Revenue'
        },
        {
          id: 't6',
          title: 'Final Completion',
          description: 'Keys handover and property transfer',
          status: 'pending',
          expectedDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          responsible: 'Developer'
        }
      ];

    } catch (error) {
      console.error('Failed to get completion timeline:', error);
      throw new Error('Failed to retrieve completion timeline');
    }
  }
}

// Export singleton instance
export const completionStatementService = new CompletionStatementService();

// Export types
export type {
  CompletionStatement,
  CompletionItem,
  CompletionMilestone,
  CompletionDocument,
  CompletionApproval,
  PropertyCompletion,
  StakeholderStatus,
  NextAction
};