/**
 * Legal Process Automation Service
 * Automated solicitor case creation and legal workflow management
 * Streamlines property transactions from reservation to completion
 */

import { EventEmitter } from 'events';

// Types for legal automation
export interface SolicitorCase {
  id: string;
  caseNumber: string;
  status: 'initiated' | 'documents_requested' | 'documents_received' | 'contracts_prepared' | 
          'contracts_sent' | 'contracts_signed' | 'completion_scheduled' | 'completed' | 'on_hold';
  
  // Property details
  propertyId: string;
  developmentId: string;
  unitNumber: string;
  propertyAddress: string;
  salePrice: number;
  
  // Buyer information
  buyerDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
    firstTimeBuyer: boolean;
    mortgageProvider?: string;
    htbApplicant: boolean;
    htbAmount?: number;
  };
  
  // Seller/Developer information
  sellerDetails: {
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    solicitorFirm: string;
  };
  
  // Assigned legal professionals
  buyerSolicitor?: {
    firm: string;
    solicitorName: string;
    email: string;
    phone: string;
    reference: string;
  };
  
  sellerSolicitor: {
    firm: string;
    solicitorName: string;
    email: string;
    phone: string;
    reference: string;
  };
  
  // Case timeline
  createdAt: Date;
  targetCompletionDate: Date;
  actualCompletionDate?: Date;
  
  // Required documents
  requiredDocuments: DocumentRequirement[];
  submittedDocuments: SubmittedDocument[];
  
  // Financial details
  financialDetails: {
    depositAmount: number;
    mortgageAmount: number;
    htbAmount: number;
    stampDuty: number;
    legalFees: number;
    otherCosts: number;
    totalCosts: number;
  };
  
  // Milestones and deadlines
  milestones: CaseMilestone[];
  
  // Communication log
  communications: CaseCommunication[];
  
  // Compliance and checks
  compliance: {
    antiMoneyLaundering: boolean;
    identityVerification: boolean;
    mortgageApproval: boolean;
    htbApproval: boolean;
    buildingCompliance: boolean;
  };
}

export interface DocumentRequirement {
  id: string;
  documentType: 'identity' | 'address_proof' | 'income_proof' | 'mortgage_approval' | 
                 'htb_approval' | 'pps_number' | 'bank_statements' | 'deposit_proof' | 'other';
  title: string;
  description: string;
  mandatory: boolean;
  requestedAt: Date;
  dueDate: Date;
  status: 'pending' | 'received' | 'verified' | 'rejected';
  rejectionReason?: string;
}

export interface SubmittedDocument {
  id: string;
  requirementId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: Date;
  uploadedBy: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verificationNotes?: string;
}

export interface CaseMilestone {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  completedAt?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  responsible: 'buyer' | 'seller' | 'buyer_solicitor' | 'seller_solicitor' | 'lender' | 'htb_office';
  dependencies: string[]; // IDs of prerequisite milestones
}

export interface CaseCommunication {
  id: string;
  timestamp: Date;
  sender: string;
  recipient: string[];
  subject: string;
  content: string;
  communicationType: 'email' | 'phone' | 'system_notification' | 'document_request';
  attachments?: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface LegalWorkflowTemplate {
  templateId: string;
  name: string;
  description: string;
  applicableFor: string[]; // buyer types, property types, etc.
  milestones: Omit<CaseMilestone, 'id' | 'completedAt' | 'status'>[];
  documentRequirements: Omit<DocumentRequirement, 'id' | 'requestedAt' | 'status'>[];
  estimatedTimeline: number; // days
}

class LegalAutomationService extends EventEmitter {
  private activeCases: Map<string, SolicitorCase> = new Map();
  private workflowTemplates: Map<string, LegalWorkflowTemplate> = new Map();
  private solicitorNetwork: Map<string, any> = new Map();
  
  constructor() {
    super();
    this.initializeWorkflowTemplates();
    this.initializeSolicitorNetwork();
  }

  /**
   * Create new solicitor case automatically when unit is reserved
   */
  async createSolicitorCase(
    propertyId: string,
    developmentId: string,
    unitNumber: string,
    reservationData: any
  ): Promise<SolicitorCase> {
    try {
      const caseId = `case_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const caseNumber = this.generateCaseNumber(developmentId, unitNumber);
      
      // Determine appropriate workflow template
      const template = this.selectWorkflowTemplate(reservationData);
      
      // Assign solicitors
      const buyerSolicitor = await this.assignBuyerSolicitor(reservationData);
      const sellerSolicitor = this.getSellerSolicitor(developmentId);
      
      // Calculate financial details
      const financialDetails = this.calculateFinancialDetails(reservationData);
      
      // Create case milestones from template
      const milestones = this.createMilestonesFromTemplate(template, reservationData);
      
      // Create document requirements
      const requiredDocuments = this.createDocumentRequirements(template, reservationData);
      
      const solicitorCase: SolicitorCase = {
        id: caseId,
        caseNumber,
        status: 'initiated',
        propertyId,
        developmentId,
        unitNumber,
        propertyAddress: this.getPropertyAddress(developmentId, unitNumber),
        salePrice: reservationData.salePrice,
        
        buyerDetails: {
          name: reservationData.buyerName,
          email: reservationData.buyerEmail,
          phone: reservationData.buyerPhone,
          address: reservationData.buyerAddress || '',
          firstTimeBuyer: reservationData.firstTimeBuyer || false,
          mortgageProvider: reservationData.mortgageProvider,
          htbApplicant: reservationData.htbEligible || false,
          htbAmount: reservationData.htbAmount || 0
        },
        
        sellerDetails: this.getSellerDetails(developmentId),
        buyerSolicitor,
        sellerSolicitor,
        
        createdAt: new Date(),
        targetCompletionDate: this.calculateTargetCompletion(template.estimatedTimeline),
        
        requiredDocuments,
        submittedDocuments: [],
        financialDetails,
        milestones,
        communications: [],
        
        compliance: {
          antiMoneyLaundering: false,
          identityVerification: false,
          mortgageApproval: false,
          htbApproval: reservationData.htbAmount > 0 ? false : true,
          buildingCompliance: true // Assume compliance for new developments
        }
      };
      
      // Store case
      this.activeCases.set(caseId, solicitorCase);
      
      // Send initial notifications
      await this.sendInitialNotifications(solicitorCase);
      
      // Start automated workflow
      await this.initiateWorkflow(solicitorCase);
      
      // Emit case creation event
      this.emit('case-created', solicitorCase);
      
      console.log(`⚖️ Legal case created: ${caseNumber} for ${unitNumber}`);
      
      return solicitorCase;
      
    } catch (error) {
      console.error('Error creating solicitor case:', error);
      throw error;
    }
  }

  /**
   * Update case status and trigger workflow actions
   */
  async updateCaseStatus(caseId: string, newStatus: SolicitorCase['status'], notes?: string): Promise<boolean> {
    try {
      const solicitorCase = this.activeCases.get(caseId);
      if (!solicitorCase) {
        throw new Error(`Case ${caseId} not found`);
      }

      const oldStatus = solicitorCase.status;
      solicitorCase.status = newStatus;
      
      // Log status change
      const communication: CaseCommunication = {
        id: `comm_${Date.now()}`,
        timestamp: new Date(),
        sender: 'System',
        recipient: [solicitorCase.buyerDetails.email],
        subject: `Case Status Update: ${this.getStatusDisplayName(newStatus)}`,
        content: notes || `Your case status has been updated to ${this.getStatusDisplayName(newStatus)}`,
        communicationType: 'system_notification',
        priority: 'medium'
      };
      
      solicitorCase.communications.push(communication);
      
      // Trigger workflow actions based on status change
      await this.handleStatusChange(solicitorCase, oldStatus, newStatus);
      
      // Emit status change event
      this.emit('case-status-changed', { caseId, oldStatus, newStatus, solicitorCase });
      
      return true;
      
    } catch (error) {
      console.error('Error updating case status:', error);
      return false;
    }
  }

  /**
   * Submit document for verification
   */
  async submitDocument(
    caseId: string,
    requirementId: string,
    documentData: {
      fileName: string;
      fileSize: number;
      mimeType: string;
      uploadedBy: string;
    }
  ): Promise<boolean> {
    try {
      const solicitorCase = this.activeCases.get(caseId);
      if (!solicitorCase) {
        throw new Error(`Case ${caseId} not found`);
      }

      const requirement = solicitorCase.requiredDocuments.find(req => req.id === requirementId);
      if (!requirement) {
        throw new Error(`Document requirement ${requirementId} not found`);
      }

      // Create submitted document record
      const submittedDocument: SubmittedDocument = {
        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        requirementId,
        fileName: documentData.fileName,
        fileSize: documentData.fileSize,
        mimeType: documentData.mimeType,
        uploadedAt: new Date(),
        uploadedBy: documentData.uploadedBy,
        verificationStatus: 'pending'
      };

      solicitorCase.submittedDocuments.push(submittedDocument);
      requirement.status = 'received';

      // Notify solicitors of document submission
      await this.notifyDocumentSubmission(solicitorCase, requirement, submittedDocument);
      
      // Check if all required documents are submitted
      await this.checkDocumentCompleteness(solicitorCase);
      
      // Emit document submission event
      this.emit('document-submitted', { caseId, requirement, submittedDocument });
      
      return true;
      
    } catch (error) {
      console.error('Error submitting document:', error);
      return false;
    }
  }

  /**
   * Get case details
   */
  getCase(caseId: string): SolicitorCase | null {
    return this.activeCases.get(caseId) || null;
  }

  /**
   * Get cases by development
   */
  getCasesByDevelopment(developmentId: string): SolicitorCase[] {
    return Array.from(this.activeCases.values())
      .filter(c => c.developmentId === developmentId);
  }

  /**
   * Get buyer's cases
   */
  getBuyerCases(buyerEmail: string): SolicitorCase[] {
    return Array.from(this.activeCases.values())
      .filter(c => c.buyerDetails.email === buyerEmail);
  }

  // Private helper methods

  private initializeWorkflowTemplates(): void {
    // First-time buyer with HTB template
    const ftbHtbTemplate: LegalWorkflowTemplate = {
      templateId: 'ftb-htb',
      name: 'First-Time Buyer with Help to Buy',
      description: 'Comprehensive workflow for first-time buyers using HTB scheme',
      applicableFor: ['first-time-buyer', 'htb-applicant'],
      milestones: [
        {
          title: 'Case Initiation',
          description: 'Case created and initial notifications sent',
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
          responsible: 'buyer_solicitor',
          dependencies: []
        },
        {
          title: 'Document Collection',
          description: 'Collect all required documents from buyer',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          responsible: 'buyer',
          dependencies: ['case-initiation']
        },
        {
          title: 'HTB Application',
          description: 'Submit Help to Buy application',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
          responsible: 'buyer_solicitor',
          dependencies: ['document-collection']
        },
        {
          title: 'Mortgage Approval',
          description: 'Obtain formal mortgage approval',
          dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days
          responsible: 'buyer',
          dependencies: ['document-collection']
        },
        {
          title: 'Contract Preparation',
          description: 'Prepare and review sale contracts',
          dueDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 28 days
          responsible: 'seller_solicitor',
          dependencies: ['htb-application', 'mortgage-approval']
        },
        {
          title: 'Contract Exchange',
          description: 'Exchange contracts between parties',
          dueDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // 35 days
          responsible: 'buyer_solicitor',
          dependencies: ['contract-preparation']
        },
        {
          title: 'Completion',
          description: 'Complete property transaction',
          dueDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000), // 42 days
          responsible: 'buyer_solicitor',
          dependencies: ['contract-exchange']
        }
      ],
      documentRequirements: [
        {
          documentType: 'identity',
          title: 'Photo ID',
          description: 'Valid passport or driving licence',
          mandatory: true,
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        },
        {
          documentType: 'address_proof',
          title: 'Proof of Address',
          description: 'Utility bill or bank statement (last 3 months)',
          mandatory: true,
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        },
        {
          documentType: 'income_proof',
          title: 'Proof of Income',
          description: 'Last 3 payslips and P60',
          mandatory: true,
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
        },
        {
          documentType: 'bank_statements',
          title: 'Bank Statements',
          description: 'Last 6 months bank statements',
          mandatory: true,
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
        },
        {
          documentType: 'pps_number',
          title: 'PPS Number',
          description: 'PPS certificate or correspondence',
          mandatory: true,
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        }
      ],
      estimatedTimeline: 42
    };

    this.workflowTemplates.set('ftb-htb', ftbHtbTemplate);
  }

  private initializeSolicitorNetwork(): void {
    // Initialize network of approved solicitors
    const solicitors = [
      {
        id: 'sol-1',
        firm: 'Murphy & Associates',
        name: 'Sarah Murphy',
        email: 'sarah@murphylaw.ie',
        phone: '+353 1 234 5678',
        specializations: ['residential', 'htb', 'first-time-buyers'],
        location: 'Drogheda',
        rating: 4.8
      },
      {
        id: 'sol-2',
        firm: 'O\'Brien Legal Services',
        name: 'Michael O\'Brien',
        email: 'michael@obrienlaw.ie',
        phone: '+353 1 234 5679',
        specializations: ['residential', 'commercial', 'new-builds'],
        location: 'Drogheda',
        rating: 4.7
      }
    ];

    solicitors.forEach(sol => {
      this.solicitorNetwork.set(sol.id, sol);
    });
  }

  private selectWorkflowTemplate(reservationData: any): LegalWorkflowTemplate {
    // Select appropriate template based on buyer profile
    if (reservationData.firstTimeBuyer && reservationData.htbEligible) {
      return this.workflowTemplates.get('ftb-htb')!;
    }
    
    // Default to first-time buyer template
    return this.workflowTemplates.get('ftb-htb')!;
  }

  private async assignBuyerSolicitor(reservationData: any): Promise<SolicitorCase['buyerSolicitor']> {
    // Auto-assign based on specialization and availability
    const availableSolicitors = Array.from(this.solicitorNetwork.values())
      .filter(sol => sol.specializations.includes('residential'));
    
    const selectedSolicitor = availableSolicitors[0]; // Simple selection for demo
    
    return {
      firm: selectedSolicitor.firm,
      solicitorName: selectedSolicitor.name,
      email: selectedSolicitor.email,
      phone: selectedSolicitor.phone,
      reference: `REF-${Date.now()}`
    };
  }

  private getSellerSolicitor(developmentId: string): SolicitorCase['sellerSolicitor'] {
    // Return developer's solicitor
    return {
      firm: 'Developer Legal Ltd',
      solicitorName: 'Emma Walsh',
      email: 'emma@developerlaw.ie',
      phone: '+353 1 234 5680',
      reference: `DEV-${developmentId.toUpperCase()}`
    };
  }

  private calculateFinancialDetails(reservationData: any): SolicitorCase['financialDetails'] {
    const salePrice = reservationData.salePrice;
    const htbAmount = reservationData.htbAmount || 0;
    const depositAmount = salePrice * 0.1 - htbAmount;
    const mortgageAmount = salePrice - depositAmount - htbAmount;
    const stampDuty = this.calculateStampDuty(salePrice);
    const legalFees = 2500; // Standard legal fees
    const otherCosts = 1000; // Miscellaneous costs
    
    return {
      depositAmount,
      mortgageAmount,
      htbAmount,
      stampDuty,
      legalFees,
      otherCosts,
      totalCosts: depositAmount + stampDuty + legalFees + otherCosts
    };
  }

  private calculateStampDuty(salePrice: number): number {
    // Irish stamp duty calculation for residential property
    if (salePrice <= 1000000) {
      return salePrice * 0.01; // 1%
    } else {
      return 10000 + (salePrice - 1000000) * 0.02; // 1% on first €1M, 2% thereafter
    }
  }

  private createMilestonesFromTemplate(template: LegalWorkflowTemplate, reservationData: any): CaseMilestone[] {
    return template.milestones.map((milestone, index) => ({
      ...milestone,
      id: `milestone_${index + 1}`,
      status: 'pending' as const
    }));
  }

  private createDocumentRequirements(template: LegalWorkflowTemplate, reservationData: any): DocumentRequirement[] {
    return template.documentRequirements.map((req, index) => ({
      ...req,
      id: `req_${index + 1}`,
      requestedAt: new Date(),
      status: 'pending' as const
    }));
  }

  private generateCaseNumber(developmentId: string, unitNumber: string): string {
    const devCode = developmentId.substring(0, 3).toUpperCase();
    const year = new Date().getFullYear();
    const sequence = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `${devCode}-${year}-${unitNumber}-${sequence}`;
  }

  private getPropertyAddress(developmentId: string, unitNumber: string): string {
    const addressMap: { [key: string]: string } = {
      'fitzgerald-gardens': `Unit ${unitNumber}, Fitzgerald Gardens, Drogheda, Co. Louth`
    };
    
    return addressMap[developmentId] || `Unit ${unitNumber}, ${developmentId}`;
  }

  private getSellerDetails(developmentId: string): SolicitorCase['sellerDetails'] {
    return {
      companyName: 'Premium Developments Ltd',
      contactPerson: 'John Developer',
      email: 'john@premiumdev.ie',
      phone: '+353 1 234 5681',
      solicitorFirm: 'Developer Legal Ltd'
    };
  }

  private calculateTargetCompletion(timelineDays: number): Date {
    return new Date(Date.now() + timelineDays * 24 * 60 * 60 * 1000);
  }

  private async sendInitialNotifications(solicitorCase: SolicitorCase): Promise<void> {
    // Send notifications to all parties
    const notifications = [
      {
        recipient: solicitorCase.buyerDetails.email,
        subject: 'Legal Process Initiated - Case Reference: ' + solicitorCase.caseNumber,
        content: `Your property purchase legal process has been initiated. Your case reference is ${solicitorCase.caseNumber}.`
      },
      {
        recipient: solicitorCase.buyerSolicitor?.email || '',
        subject: 'New Client Case Assignment - ' + solicitorCase.caseNumber,
        content: `You have been assigned as the buyer's solicitor for case ${solicitorCase.caseNumber}.`
      }
    ];

    // Simulate sending notifications
    notifications.forEach(notification => {
      console.log(`📧 Notification sent to ${notification.recipient}: ${notification.subject}`);
    });
  }

  private async initiateWorkflow(solicitorCase: SolicitorCase): Promise<void> {
    // Start the automated workflow
    console.log(`🔄 Workflow initiated for case ${solicitorCase.caseNumber}`);
    
    // Set first milestone as in progress
    if (solicitorCase.milestones.length > 0) {
      solicitorCase.milestones[0].status = 'in_progress';
    }
  }

  private async handleStatusChange(
    solicitorCase: SolicitorCase, 
    oldStatus: SolicitorCase['status'], 
    newStatus: SolicitorCase['status']
  ): Promise<void> {
    // Handle specific status transitions
    switch (newStatus) {
      case 'documents_requested':
        await this.sendDocumentRequests(solicitorCase);
        break;
      case 'contracts_prepared':
        await this.notifyContractReadiness(solicitorCase);
        break;
      case 'completed':
        await this.handleCaseCompletion(solicitorCase);
        break;
    }
  }

  private async sendDocumentRequests(solicitorCase: SolicitorCase): Promise<void> {
    console.log(`📋 Document requests sent for case ${solicitorCase.caseNumber}`);
  }

  private async notifyContractReadiness(solicitorCase: SolicitorCase): Promise<void> {
    console.log(`📄 Contract readiness notification sent for case ${solicitorCase.caseNumber}`);
  }

  private async handleCaseCompletion(solicitorCase: SolicitorCase): Promise<void> {
    solicitorCase.actualCompletionDate = new Date();
    console.log(`✅ Case completed: ${solicitorCase.caseNumber}`);
  }

  private async notifyDocumentSubmission(
    solicitorCase: SolicitorCase, 
    requirement: DocumentRequirement, 
    document: SubmittedDocument
  ): Promise<void> {
    console.log(`📎 Document submitted for case ${solicitorCase.caseNumber}: ${requirement.title}`);
  }

  private async checkDocumentCompleteness(solicitorCase: SolicitorCase): Promise<void> {
    const mandatoryRequirements = solicitorCase.requiredDocuments.filter(req => req.mandatory);
    const completedMandatory = mandatoryRequirements.filter(req => req.status === 'received' || req.status === 'verified');
    
    if (completedMandatory.length === mandatoryRequirements.length) {
      await this.updateCaseStatus(solicitorCase.id, 'documents_received');
    }
  }

  private getStatusDisplayName(status: SolicitorCase['status']): string {
    const statusMap: { [key: string]: string } = {
      'initiated': 'Case Initiated',
      'documents_requested': 'Documents Requested',
      'documents_received': 'Documents Received',
      'contracts_prepared': 'Contracts Prepared',
      'contracts_sent': 'Contracts Sent',
      'contracts_signed': 'Contracts Signed',
      'completion_scheduled': 'Completion Scheduled',
      'completed': 'Completed',
      'on_hold': 'On Hold'
    };
    
    return statusMap[status] || status;
  }
}

// Export global instance
export const legalAutomationService = new LegalAutomationService();
export default LegalAutomationService;