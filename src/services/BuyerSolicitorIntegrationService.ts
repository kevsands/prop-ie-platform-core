/**
 * Buyer-Solicitor Integration Service
 * Handles seamless transaction handoff and real-time synchronization
 * 
 * @fileoverview Critical integration service for buyer-to-solicitor workflow
 * @version 1.0.0
 * @author Property Development Platform Team
 */

import { 
  BuyerInformation, 
  Unit, 
  UnitStatus,
  ProjectStateUpdate 
} from '@/types/project';
import { projectDataService } from '@/services/ProjectDataService';

// Enhanced types for solicitor integration
export interface SolicitorCase {
  id: string;
  caseNumber: string;
  propertyId: string;
  buyerId: string;
  solicitorId: string;
  status: CaseStatus;
  type: 'purchase' | 'sale' | 'htb_application';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  lastUpdated: Date;
  buyer: BuyerInformation;
  property: PropertyDetails;
  documents: CaseDocument[];
  milestones: CaseMilestone[];
  communications: CaseCommunication[];
  htbDetails?: HTBApplicationDetails;
  timeline: CaseTimeline;
  metadata: CaseMetadata;
}

export interface PropertyDetails {
  id: string;
  unitNumber: string;
  developmentName: string;
  address: {
    street: string;
    city: string;
    county: string;
    eircode?: string;
  };
  purchasePrice: number;
  deposit: number;
  completion: Date;
  developer: string;
  propertyType: string;
  customizations?: PropertyCustomization[];
}

export interface CaseDocument {
  id: string;
  name: string;
  type: DocumentType;
  status: 'pending' | 'uploaded' | 'reviewed' | 'approved' | 'rejected';
  source: 'buyer' | 'solicitor' | 'lender' | 'developer' | 'system';
  uploadedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  url?: string;
  metadata: {
    size: number;
    fileType: string;
    checksum: string;
  };
  requirements?: DocumentRequirement[];
}

export interface CaseMilestone {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  dueDate: Date;
  completedAt?: Date;
  dependencies: string[];
  assignedTo?: string;
  documents: string[];
  automatedTriggers: string[];
}

export interface CaseCommunication {
  id: string;
  type: 'email' | 'phone' | 'meeting' | 'document' | 'system_notification';
  from: string;
  to: string[];
  subject: string;
  content: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  attachments?: string[];
}

export interface HTBApplicationDetails {
  applicationId: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'completed';
  amount: number;
  eligibilityConfirmed: boolean;
  documentsSubmitted: boolean;
  approvalDate?: Date;
  claimDate?: Date;
  documents: string[];
}

export interface CaseTimeline {
  events: TimelineEvent[];
  estimatedCompletion: Date;
  criticalPath: string[];
  delays: TimelineDelay[];
}

export interface TimelineEvent {
  id: string;
  name: string;
  date: Date;
  status: 'completed' | 'current' | 'upcoming' | 'overdue';
  type: 'milestone' | 'document' | 'communication' | 'payment' | 'meeting';
  description: string;
  automated: boolean;
}

export interface CaseMetadata {
  autoCreated: boolean;
  source: 'buyer_reservation' | 'manual_creation' | 'referral';
  integrationData: {
    buyerPortalUrl: string;
    propertyListingUrl: string;
    developerContact: string;
  };
  analytics: {
    timeToHandoff: number; // milliseconds
    documentsReceived: number;
    communicationCount: number;
  };
}

export type CaseStatus = 
  | 'new' 
  | 'documents_requested' 
  | 'documents_pending' 
  | 'review_in_progress' 
  | 'contract_prepared' 
  | 'awaiting_signature' 
  | 'exchange_scheduled' 
  | 'exchanged' 
  | 'completion_scheduled' 
  | 'completed' 
  | 'on_hold' 
  | 'cancelled';

export type DocumentType = 
  | 'identity_verification'
  | 'proof_of_address' 
  | 'bank_statements'
  | 'mortgage_approval'
  | 'htb_approval'
  | 'employment_contract'
  | 'solicitor_undertaking'
  | 'contract_for_sale'
  | 'search_results'
  | 'survey_report'
  | 'insurance_documents'
  | 'completion_statement';

export interface DocumentRequirement {
  id: string;
  description: string;
  mandatory: boolean;
  deadline?: Date;
  alternatives?: string[];
}

export interface PropertyCustomization {
  id: string;
  category: string;
  item: string;
  cost: number;
  status: 'selected' | 'pending' | 'approved' | 'installed';
}

export interface TimelineDelay {
  id: string;
  reason: string;
  impact: number; // days
  mitigationPlan?: string;
  resolved: boolean;
}

// =============================================================================
// BUYER-SOLICITOR INTEGRATION SERVICE CLASS
// =============================================================================

export class BuyerSolicitorIntegrationService {
  private static instance: BuyerSolicitorIntegrationService;
  private cases: Map<string, SolicitorCase> = new Map();
  private eventListeners: Map<string, Array<(event: any) => void>> = new Map();

  private constructor() {
    // Singleton pattern for enterprise data consistency
  }

  public static getInstance(): BuyerSolicitorIntegrationService {
    if (!BuyerSolicitorIntegrationService.instance) {
      BuyerSolicitorIntegrationService.instance = new BuyerSolicitorIntegrationService();
    }
    return BuyerSolicitorIntegrationService.instance;
  }

  // =============================================================================
  // TRANSACTION HANDOFF SYSTEM
  // =============================================================================

  /**
   * Creates a solicitor case automatically when buyer reserves property
   */
  public async createCaseFromReservation(
    reservationData: {
      unitId: string;
      buyer: BuyerInformation;
      property: Unit;
      reservationAmount: number;
      htbApplication?: any;
    }
  ): Promise<SolicitorCase> {
    try {
      const caseId = `case-${Date.now()}-${reservationData.unitId}`;
      const caseNumber = this.generateCaseNumber();

      // Auto-assign solicitor based on buyer preferences or location
      const assignedSolicitor = await this.autoAssignSolicitor(reservationData.buyer);

      const solicitorCase: SolicitorCase = {
        id: caseId,
        caseNumber,
        propertyId: reservationData.property.id,
        buyerId: reservationData.buyer.id,
        solicitorId: assignedSolicitor.id,
        status: 'new',
        type: reservationData.htbApplication ? 'htb_application' : 'purchase',
        priority: 'high',
        createdAt: new Date(),
        lastUpdated: new Date(),
        buyer: reservationData.buyer,
        property: this.convertUnitToPropertyDetails(reservationData.property),
        documents: [],
        milestones: this.generateDefaultMilestones(reservationData.htbApplication),
        communications: [],
        htbDetails: reservationData.htbApplication ? this.createHTBDetails(reservationData.htbApplication) : undefined,
        timeline: this.generateTimeline(),
        metadata: {
          autoCreated: true,
          source: 'buyer_reservation',
          integrationData: {
            buyerPortalUrl: `/buyer/transaction`,
            propertyListingUrl: `/properties/${reservationData.property.id}`,
            developerContact: 'developer@fitzgeraldgardens.ie'
          },
          analytics: {
            timeToHandoff: Date.now() - new Date(reservationData.buyer.registrationDate || Date.now()).getTime(),
            documentsReceived: 0,
            communicationCount: 0
          }
        }
      };

      // Store case
      this.cases.set(caseId, solicitorCase);

      // Trigger automated workflows
      await this.triggerAutomatedWorkflows(solicitorCase);

      // Notify stakeholders
      await this.notifyStakeholders(solicitorCase, 'case_created');

      // Broadcast state update to all connected systems
      projectDataService.broadcastStateUpdate({
        projectId: 'fitzgerald-gardens',
        unitId: reservationData.property.id,
        eventType: 'solicitor_case_created',
        timestamp: new Date(),
        data: {
          caseId: solicitorCase.id,
          caseNumber: solicitorCase.caseNumber,
          buyerName: reservationData.buyer.name,
          solicitorFirm: assignedSolicitor.name
        }
      });

      console.log(`✅ Solicitor case ${caseNumber} created for buyer ${reservationData.buyer.name}`);
      return solicitorCase;

    } catch (error) {
      console.error('Error creating solicitor case from reservation:', error);
      throw error;
    }
  }

  /**
   * Synchronizes documents between buyer and solicitor portals
   */
  public async syncDocuments(
    buyerId: string, 
    solicitorId: string, 
    documents: any[]
  ): Promise<void> {
    try {
      const cases = this.getCasesByBuyer(buyerId);
      
      for (const solicitorCase of cases) {
        for (const doc of documents) {
          const caseDocument: CaseDocument = {
            id: `doc-${Date.now()}-${doc.id}`,
            name: doc.name,
            type: this.mapDocumentType(doc.type),
            status: 'uploaded',
            source: 'buyer',
            uploadedAt: new Date(),
            url: doc.url,
            metadata: {
              size: doc.size || 0,
              fileType: doc.fileType || 'unknown',
              checksum: doc.checksum || 'pending'
            },
            requirements: this.getDocumentRequirements(doc.type)
          };

          solicitorCase.documents.push(caseDocument);
          solicitorCase.lastUpdated = new Date();
        }

        // Update case status if all required documents received
        await this.checkDocumentCompleteness(solicitorCase);
      }

      console.log(`✅ Documents synchronized for buyer ${buyerId}`);
    } catch (error) {
      console.error('Error synchronizing documents:', error);
      throw error;
    }
  }

  /**
   * Notifies solicitor of milestone updates
   */
  public async notifyMilestoneUpdate(
    caseId: string, 
    milestoneId: string, 
    status: string,
    updatedBy: string
  ): Promise<void> {
    try {
      const solicitorCase = this.cases.get(caseId);
      if (!solicitorCase) return;

      const milestone = solicitorCase.milestones.find(m => m.id === milestoneId);
      if (!milestone) return;

      milestone.status = status as any;
      if (status === 'completed') {
        milestone.completedAt = new Date();
      }

      solicitorCase.lastUpdated = new Date();

      // Create communication record
      const communication: CaseCommunication = {
        id: `comm-${Date.now()}`,
        type: 'system_notification',
        from: 'system',
        to: [solicitorCase.solicitorId, solicitorCase.buyerId],
        subject: `Milestone Update: ${milestone.name}`,
        content: `Milestone "${milestone.name}" status updated to "${status}" by ${updatedBy}`,
        timestamp: new Date(),
        read: false,
        priority: 'medium'
      };

      solicitorCase.communications.push(communication);

      // Trigger automated next steps
      await this.triggerMilestoneAutomation(solicitorCase, milestone);

      console.log(`✅ Milestone ${milestone.name} updated for case ${solicitorCase.caseNumber}`);
    } catch (error) {
      console.error('Error updating milestone:', error);
      throw error;
    }
  }

  /**
   * Shares property customization data with solicitor
   */
  public async shareCustomizationData(
    propertyId: string, 
    solicitorId: string,
    customizations: PropertyCustomization[]
  ): Promise<void> {
    try {
      const cases = this.getCasesByProperty(propertyId);
      
      for (const solicitorCase of cases) {
        if (solicitorCase.solicitorId === solicitorId) {
          solicitorCase.property.customizations = customizations;
          solicitorCase.lastUpdated = new Date();

          // Create communication about customizations
          const communication: CaseCommunication = {
            id: `comm-${Date.now()}`,
            type: 'system_notification',
            from: 'system',
            to: [solicitorId],
            subject: 'Property Customizations Updated',
            content: `Property customizations have been updated for ${solicitorCase.property.developmentName}. Total customization cost: €${customizations.reduce((sum, c) => sum + c.cost, 0).toLocaleString()}`,
            timestamp: new Date(),
            read: false,
            priority: 'medium'
          };

          solicitorCase.communications.push(communication);
        }
      }

      console.log(`✅ Customization data shared for property ${propertyId}`);
    } catch (error) {
      console.error('Error sharing customization data:', error);
      throw error;
    }
  }

  // =============================================================================
  // HELPER METHODS
  // =============================================================================

  private generateCaseNumber(): string {
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const sequence = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `FG${year}${month}${sequence}`;
  }

  private async autoAssignSolicitor(buyer: BuyerInformation): Promise<any> {
    // In production, this would query available solicitors
    return {
      id: 'solicitor-001',
      name: 'O\'Brien & Associates',
      email: 'cases@obrienlaw.ie',
      phone: '+353 1 234 5678'
    };
  }

  private convertUnitToPropertyDetails(unit: Unit): PropertyDetails {
    return {
      id: unit.id,
      unitNumber: unit.number,
      developmentName: 'Fitzgerald Gardens',
      address: {
        street: `Unit ${unit.number}, Fitzgerald Gardens`,
        city: 'Drogheda',
        county: 'Co. Louth',
        eircode: 'A92 X1Y2'
      },
      purchasePrice: unit.pricing.currentPrice,
      deposit: unit.pricing.currentPrice * 0.1,
      completion: new Date('2025-09-01'),
      developer: 'Cairn Homes',
      propertyType: unit.type
    };
  }

  private generateDefaultMilestones(hasHTB: boolean): CaseMilestone[] {
    const milestones: CaseMilestone[] = [
      {
        id: 'milestone-1',
        name: 'Client Onboarding',
        description: 'Initial client meeting and document collection',
        status: 'pending',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
        dependencies: [],
        documents: ['identity_verification', 'proof_of_address'],
        automatedTriggers: ['request_documents', 'schedule_meeting']
      },
      {
        id: 'milestone-2',
        name: 'Property Searches',
        description: 'Conduct property searches and review developer pack',
        status: 'pending',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
        dependencies: ['milestone-1'],
        documents: ['search_results', 'survey_report'],
        automatedTriggers: ['order_searches']
      }
    ];

    if (hasHTB) {
      milestones.push({
        id: 'milestone-htb',
        name: 'Help-to-Buy Processing',
        description: 'Review and process HTB application',
        status: 'pending',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
        dependencies: ['milestone-1'],
        documents: ['htb_approval'],
        automatedTriggers: ['validate_htb_documents']
      });
    }

    return milestones;
  }

  private generateTimeline(): CaseTimeline {
    return {
      events: [],
      estimatedCompletion: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
      criticalPath: ['milestone-1', 'milestone-2'],
      delays: []
    };
  }

  private createHTBDetails(htbApplication: any): HTBApplicationDetails {
    return {
      applicationId: htbApplication.id || `htb-${Date.now()}`,
      status: 'submitted',
      amount: htbApplication.amount || 30000,
      eligibilityConfirmed: true,
      documentsSubmitted: false,
      documents: []
    };
  }

  private async triggerAutomatedWorkflows(solicitorCase: SolicitorCase): Promise<void> {
    // Request initial documents from buyer
    await this.requestDocumentsFromBuyer(solicitorCase);
    
    // Schedule initial client meeting
    await this.scheduleInitialMeeting(solicitorCase);
    
    // Set up monitoring for deadlines
    await this.setupDeadlineMonitoring(solicitorCase);
  }

  private async notifyStakeholders(solicitorCase: SolicitorCase, eventType: string): Promise<void> {
    // Notify assigned solicitor
    console.log(`📧 Notifying solicitor ${solicitorCase.solicitorId} of new case ${solicitorCase.caseNumber}`);
    
    // Notify buyer
    console.log(`📧 Notifying buyer ${solicitorCase.buyer.name} that solicitor has been assigned`);
    
    // Update buyer portal with solicitor information
    console.log(`🔄 Updating buyer portal with solicitor contact details`);
  }

  private getCasesByBuyer(buyerId: string): SolicitorCase[] {
    return Array.from(this.cases.values()).filter(c => c.buyerId === buyerId);
  }

  private getCasesByProperty(propertyId: string): SolicitorCase[] {
    return Array.from(this.cases.values()).filter(c => c.propertyId === propertyId);
  }

  private mapDocumentType(type: string): DocumentType {
    const typeMap: Record<string, DocumentType> = {
      'id': 'identity_verification',
      'address': 'proof_of_address',
      'bank': 'bank_statements',
      'mortgage': 'mortgage_approval',
      'htb': 'htb_approval',
      'employment': 'employment_contract'
    };
    return typeMap[type] || 'identity_verification';
  }

  private getDocumentRequirements(type: DocumentType): DocumentRequirement[] {
    const requirements: Record<DocumentType, DocumentRequirement[]> = {
      'identity_verification': [
        { id: 'req-1', description: 'Valid passport or driver license', mandatory: true },
        { id: 'req-2', description: 'Clear, unedited scan', mandatory: true }
      ],
      'proof_of_address': [
        { id: 'req-3', description: 'Utility bill from last 3 months', mandatory: true }
      ],
      // ... more requirements
    } as any;
    
    return requirements[type] || [];
  }

  private async checkDocumentCompleteness(solicitorCase: SolicitorCase): Promise<void> {
    const requiredDocs = ['identity_verification', 'proof_of_address', 'bank_statements'];
    const uploadedTypes = solicitorCase.documents.map(d => d.type);
    
    if (requiredDocs.every(type => uploadedTypes.includes(type as DocumentType))) {
      solicitorCase.status = 'documents_received';
      console.log(`✅ All required documents received for case ${solicitorCase.caseNumber}`);
    }
  }

  private async triggerMilestoneAutomation(solicitorCase: SolicitorCase, milestone: CaseMilestone): Promise<void> {
    for (const trigger of milestone.automatedTriggers) {
      switch (trigger) {
        case 'request_documents':
          await this.requestDocumentsFromBuyer(solicitorCase);
          break;
        case 'schedule_meeting':
          await this.scheduleInitialMeeting(solicitorCase);
          break;
        case 'order_searches':
          await this.orderPropertySearches(solicitorCase);
          break;
      }
    }
  }

  private async requestDocumentsFromBuyer(solicitorCase: SolicitorCase): Promise<void> {
    console.log(`📄 Requesting documents from buyer for case ${solicitorCase.caseNumber}`);
  }

  private async scheduleInitialMeeting(solicitorCase: SolicitorCase): Promise<void> {
    console.log(`📅 Scheduling initial meeting for case ${solicitorCase.caseNumber}`);
  }

  private async setupDeadlineMonitoring(solicitorCase: SolicitorCase): Promise<void> {
    console.log(`⏰ Setting up deadline monitoring for case ${solicitorCase.caseNumber}`);
  }

  private async orderPropertySearches(solicitorCase: SolicitorCase): Promise<void> {
    console.log(`🔍 Ordering property searches for case ${solicitorCase.caseNumber}`);
  }

  // =============================================================================
  // PUBLIC API METHODS
  // =============================================================================

  public getCaseById(caseId: string): SolicitorCase | null {
    return this.cases.get(caseId) || null;
  }

  public getAllCases(): SolicitorCase[] {
    return Array.from(this.cases.values());
  }

  public getCasesBySolicitor(solicitorId: string): SolicitorCase[] {
    return Array.from(this.cases.values()).filter(c => c.solicitorId === solicitorId);
  }

  public updateCaseStatus(caseId: string, status: CaseStatus): boolean {
    const solicitorCase = this.cases.get(caseId);
    if (!solicitorCase) return false;

    solicitorCase.status = status;
    solicitorCase.lastUpdated = new Date();
    return true;
  }

  public addEventListener(eventType: string, callback: (event: any) => void): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(callback);
  }
}

// Export singleton instance
export const buyerSolicitorIntegrationService = BuyerSolicitorIntegrationService.getInstance();