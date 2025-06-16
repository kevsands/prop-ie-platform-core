/**
 * Buyer Portal Synchronization Service
 * Synchronizes agent leads with buyer portal registration and activity
 * 
 * @fileoverview Service for syncing agent leads with buyer portal
 * @version 1.0.0
 * @author Property Development Platform Team
 */

import { 
  BuyerInformation, 
  Unit, 
  UnitStatus 
} from '@/types/project';
import { agentBuyerIntegrationService, AgentLead, PropertyInterest } from '@/services/AgentBuyerIntegrationService';
import { projectDataService } from '@/services/ProjectDataService';

// Enhanced interfaces for buyer portal synchronization
export interface BuyerPortalSync {
  id: string;
  leadId: string;
  agentId: string;
  buyerId: string;
  syncStatus: SyncStatus;
  syncType: SyncType;
  lastSyncAt: Date;
  syncData: SyncData;
  errors: SyncError[];
  retryCount: number;
  nextRetry?: Date;
}

export interface SyncData {
  buyerRegistration?: BuyerRegistrationSync;
  propertyInterests?: PropertyInterestSync[];
  viewingHistory?: ViewingSync[];
  searchActivity?: SearchActivitySync[];
  documentSubmissions?: DocumentSync[];
  transactionProgress?: TransactionSync;
}

export interface BuyerRegistrationSync {
  portalRegistrationId: string;
  registrationDate: Date;
  profileCompleteness: number;
  verificationStatus: 'pending' | 'verified' | 'failed';
  preferences: BuyerPreferences;
  agentReferralData: {
    agentId: string;
    agentName: string;
    referralSource: string;
    referralDate: Date;
  };
}

export interface PropertyInterestSync {
  propertyId: string;
  unitId?: string;
  interestLevel: 'viewing_requested' | 'favourited' | 'offer_intended' | 'offer_made';
  firstInteraction: Date;
  lastInteraction: Date;
  interactions: PropertyInteraction[];
  agentNotified: boolean;
}

export interface PropertyInteraction {
  type: 'view' | 'favourite' | 'inquiry' | 'viewing_request' | 'customization' | 'offer';
  timestamp: Date;
  details: any;
  agentActionRequired: boolean;
}

export interface ViewingSync {
  viewingId: string;
  propertyId: string;
  scheduledDate: Date;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  agentPresent: boolean;
  feedback?: ViewingFeedback;
  followUpActions: string[];
}

export interface ViewingFeedback {
  rating: number;
  positives: string[];
  concerns: string[];
  nextSteps: string[];
  offerIntention: boolean;
}

export interface SearchActivitySync {
  searchId: string;
  searchCriteria: {
    priceRange: { min: number; max: number };
    locations: string[];
    propertyTypes: string[];
    bedrooms: number[];
    features: string[];
  };
  resultsViewed: string[];
  savedProperties: string[];
  timestamp: Date;
  matchesAgentListings: boolean;
}

export interface DocumentSync {
  documentId: string;
  documentType: 'mortgage_approval' | 'id_verification' | 'address_proof' | 'bank_statements';
  uploadDate: Date;
  status: 'uploaded' | 'verified' | 'approved' | 'rejected';
  agentAccess: boolean;
  solicitorShared: boolean;
}

export interface TransactionSync {
  transactionId: string;
  propertyId: string;
  stage: 'reservation' | 'contract' | 'mortgage' | 'completion';
  amount: number;
  milestones: TransactionMilestone[];
  agentCommission?: {
    calculatedAmount: number;
    status: 'pending' | 'approved' | 'paid';
  };
}

export interface TransactionMilestone {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: Date;
  completedDate?: Date;
  agentNotification: boolean;
}

export interface BuyerPreferences {
  communicationMethod: 'email' | 'phone' | 'sms' | 'app';
  marketingConsent: boolean;
  agentCommunicationPreference: 'direct' | 'portal_only' | 'both';
  viewingPreferences: {
    preferredDays: string[];
    preferredTimes: string[];
    groupViewings: boolean;
  };
}

export interface SyncError {
  id: string;
  errorType: 'network' | 'data_validation' | 'permission' | 'system';
  errorMessage: string;
  timestamp: Date;
  context: any;
  resolved: boolean;
}

export interface BuyerJourneyMapping {
  leadStage: string;
  portalStage: string;
  triggerActions: string[];
  agentNotifications: string[];
  automatedFollowUps: string[];
}

export type SyncStatus = 
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'partial'
  | 'retry_scheduled';

export type SyncType = 
  | 'initial_registration'
  | 'profile_update'
  | 'activity_sync'
  | 'transaction_update'
  | 'document_sync'
  | 'preference_change';

// =============================================================================
// BUYER PORTAL SYNC SERVICE CLASS
// =============================================================================

export class BuyerPortalSyncService {
  private static instance: BuyerPortalSyncService;
  private syncRecords: Map<string, BuyerPortalSync> = new Map();
  private journeyMappings: BuyerJourneyMapping[] = [];
  private eventListeners: Map<string, Array<(event: any) => void>> = new Map();

  private constructor() {
    // Singleton pattern for enterprise data consistency
    this.initializeJourneyMappings();
  }

  public static getInstance(): BuyerPortalSyncService {
    if (!BuyerPortalSyncService.instance) {
      BuyerPortalSyncService.instance = new BuyerPortalSyncService();
    }
    return BuyerPortalSyncService.instance;
  }

  // =============================================================================
  // LEAD-TO-BUYER SYNCHRONIZATION
  // =============================================================================

  /**
   * Synchronize agent lead with buyer portal registration
   */
  public async syncLeadToBuyerPortal(
    leadId: string,
    registrationData?: Partial<BuyerInformation>
  ): Promise<BuyerPortalSync> {
    try {
      const syncId = `sync-${Date.now()}-${leadId}`;
      
      // Get lead from agent service
      const leads = agentBuyerIntegrationService.getAgentLeads('agent-001'); // Mock agent ID
      const lead = leads.find(l => l.id === leadId);
      
      if (!lead) {
        throw new Error(`Lead ${leadId} not found`);
      }

      // Create buyer portal registration
      const buyerId = await this.createBuyerPortalRegistration(lead, registrationData);

      // Create sync record
      const sync: BuyerPortalSync = {
        id: syncId,
        leadId,
        agentId: lead.agentId,
        buyerId,
        syncStatus: 'in_progress',
        syncType: 'initial_registration',
        lastSyncAt: new Date(),
        syncData: {
          buyerRegistration: {
            portalRegistrationId: buyerId,
            registrationDate: new Date(),
            profileCompleteness: this.calculateProfileCompleteness(lead.buyer),
            verificationStatus: 'pending',
            preferences: this.createDefaultPreferences(),
            agentReferralData: {
              agentId: lead.agentId,
              agentName: agentBuyerIntegrationService.getAgentById(lead.agentId)?.name || 'Unknown Agent',
              referralSource: lead.source,
              referralDate: lead.createdAt
            }
          },
          propertyInterests: this.convertLeadInterestsToPortalFormat(lead.interests),
          searchActivity: [],
          viewingHistory: [],
          documentSubmissions: [],
        },
        errors: [],
        retryCount: 0
      };

      this.syncRecords.set(syncId, sync);

      // Convert lead to buyer and register with agent integration service
      const { buyer } = await agentBuyerIntegrationService.convertLeadToBuyer(
        leadId,
        registrationData
      );

      // Update sync status
      sync.syncStatus = 'completed';
      sync.lastSyncAt = new Date();

      // Broadcast event
      this.broadcastEvent('buyer_registered_from_lead', {
        syncId,
        leadId,
        buyerId,
        agentId: lead.agentId
      });

      console.log(`✅ Lead ${leadId} successfully synced to buyer portal: ${buyerId}`);
      return sync;

    } catch (error) {
      console.error('Error syncing lead to buyer portal:', error);
      throw error;
    }
  }

  /**
   * Sync buyer portal activity back to agent lead management
   */
  public async syncBuyerActivityToAgent(
    buyerId: string,
    activityData: {
      type: 'property_view' | 'viewing_scheduled' | 'document_uploaded' | 'offer_made';
      propertyId?: string;
      details: any;
    }
  ): Promise<void> {
    try {
      // Find sync record for this buyer
      const syncRecord = Array.from(this.syncRecords.values()).find(
        sync => sync.buyerId === buyerId
      );

      if (!syncRecord) {
        console.log(`No sync record found for buyer ${buyerId}`);
        return;
      }

      // Update agent lead with buyer activity
      await this.updateAgentLeadFromBuyerActivity(syncRecord, activityData);

      // Update sync record
      syncRecord.lastSyncAt = new Date();
      
      // Add activity to sync data
      switch (activityData.type) {
        case 'property_view':
          this.addPropertyInteraction(syncRecord, activityData);
          break;
        case 'viewing_scheduled':
          this.addViewingSync(syncRecord, activityData);
          break;
        case 'document_uploaded':
          this.addDocumentSync(syncRecord, activityData);
          break;
        case 'offer_made':
          this.addTransactionSync(syncRecord, activityData);
          break;
      }

      console.log(`🔄 Buyer activity synced to agent: ${activityData.type} for buyer ${buyerId}`);

    } catch (error) {
      console.error('Error syncing buyer activity to agent:', error);
    }
  }

  /**
   * Monitor buyer journey and trigger agent notifications
   */
  public async monitorBuyerJourney(buyerId: string): Promise<void> {
    try {
      const syncRecord = Array.from(this.syncRecords.values()).find(
        sync => sync.buyerId === buyerId
      );

      if (!syncRecord) return;

      // Analyze buyer stage progression
      const currentStage = this.determineBuyerStage(syncRecord);
      const journeyMapping = this.journeyMappings.find(
        mapping => mapping.portalStage === currentStage
      );

      if (journeyMapping) {
        // Trigger agent notifications
        for (const notification of journeyMapping.agentNotifications) {
          await this.sendAgentNotification(syncRecord.agentId, notification, syncRecord);
        }

        // Execute automated follow-ups
        for (const followUp of journeyMapping.automatedFollowUps) {
          await this.executeAutomatedFollowUp(syncRecord, followUp);
        }
      }

    } catch (error) {
      console.error('Error monitoring buyer journey:', error);
    }
  }

  // =============================================================================
  // HELPER METHODS
  // =============================================================================

  private async createBuyerPortalRegistration(
    lead: AgentLead,
    additionalData?: Partial<BuyerInformation>
  ): Promise<string> {
    // Mock buyer portal registration - in production would call actual registration API
    const buyerId = `buyer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`🔗 Creating buyer portal registration for lead ${lead.id} → buyer ${buyerId}`);
    
    return buyerId;
  }

  private calculateProfileCompleteness(buyer: BuyerInformation): number {
    let completeness = 0;
    const fields = ['name', 'email', 'phone', 'address', 'employmentStatus', 'annualIncome'];
    
    fields.forEach(field => {
      if (buyer[field as keyof BuyerInformation]) {
        completeness += 1;
      }
    });

    if (buyer.htbEligible !== undefined) completeness += 1;
    if (buyer.mortgagePreApproval !== undefined) completeness += 1;

    return Math.round((completeness / (fields.length + 2)) * 100);
  }

  private createDefaultPreferences(): BuyerPreferences {
    return {
      communicationMethod: 'email',
      marketingConsent: true,
      agentCommunicationPreference: 'both',
      viewingPreferences: {
        preferredDays: ['Saturday', 'Sunday'],
        preferredTimes: ['10:00', '14:00', '16:00'],
        groupViewings: false
      }
    };
  }

  private convertLeadInterestsToPortalFormat(interests: PropertyInterest[]): PropertyInterestSync[] {
    return interests.map(interest => ({
      propertyId: interest.projectId || 'general',
      interestLevel: 'viewing_requested' as const,
      firstInteraction: new Date(),
      lastInteraction: new Date(),
      interactions: [{
        type: 'inquiry' as const,
        timestamp: new Date(),
        details: {
          priceRange: interest.priceRange,
          locations: interest.locations,
          bedrooms: interest.bedrooms
        },
        agentActionRequired: true
      }],
      agentNotified: false
    }));
  }

  private async updateAgentLeadFromBuyerActivity(
    syncRecord: BuyerPortalSync,
    activityData: any
  ): Promise<void> {
    // Update lead interaction history
    agentBuyerIntegrationService.addLeadInteraction(syncRecord.leadId, {
      type: this.mapActivityTypeToInteractionType(activityData.type),
      date: new Date(),
      outcome: 'positive',
      notes: `Buyer portal activity: ${activityData.type}`,
      duration: undefined
    });

    // Update lead status based on activity
    const newStatus = this.determineLeadStatusFromActivity(activityData.type);
    if (newStatus) {
      agentBuyerIntegrationService.updateLeadStatus(syncRecord.leadId, newStatus);
    }
  }

  private addPropertyInteraction(syncRecord: BuyerPortalSync, activityData: any): void {
    if (!syncRecord.syncData.propertyInterests) {
      syncRecord.syncData.propertyInterests = [];
    }

    const existingInterest = syncRecord.syncData.propertyInterests.find(
      pi => pi.propertyId === activityData.propertyId
    );

    if (existingInterest) {
      existingInterest.lastInteraction = new Date();
      existingInterest.interactions.push({
        type: 'view',
        timestamp: new Date(),
        details: activityData.details,
        agentActionRequired: false
      });
    } else {
      syncRecord.syncData.propertyInterests.push({
        propertyId: activityData.propertyId,
        interestLevel: 'viewing_requested',
        firstInteraction: new Date(),
        lastInteraction: new Date(),
        interactions: [{
          type: 'view',
          timestamp: new Date(),
          details: activityData.details,
          agentActionRequired: false
        }],
        agentNotified: false
      });
    }
  }

  private addViewingSync(syncRecord: BuyerPortalSync, activityData: any): void {
    if (!syncRecord.syncData.viewingHistory) {
      syncRecord.syncData.viewingHistory = [];
    }

    syncRecord.syncData.viewingHistory.push({
      viewingId: activityData.details.viewingId || `viewing-${Date.now()}`,
      propertyId: activityData.propertyId!,
      scheduledDate: new Date(activityData.details.scheduledDate),
      status: 'scheduled',
      agentPresent: true,
      followUpActions: ['agent_contact', 'feedback_collection']
    });
  }

  private addDocumentSync(syncRecord: BuyerPortalSync, activityData: any): void {
    if (!syncRecord.syncData.documentSubmissions) {
      syncRecord.syncData.documentSubmissions = [];
    }

    syncRecord.syncData.documentSubmissions.push({
      documentId: activityData.details.documentId,
      documentType: activityData.details.documentType,
      uploadDate: new Date(),
      status: 'uploaded',
      agentAccess: true,
      solicitorShared: false
    });
  }

  private addTransactionSync(syncRecord: BuyerPortalSync, activityData: any): void {
    syncRecord.syncData.transactionProgress = {
      transactionId: activityData.details.transactionId,
      propertyId: activityData.propertyId!,
      stage: 'reservation',
      amount: activityData.details.amount,
      milestones: [{
        id: 'milestone-1',
        name: 'Reservation Complete',
        status: 'completed',
        dueDate: new Date(),
        completedDate: new Date(),
        agentNotification: true
      }],
      agentCommission: {
        calculatedAmount: activityData.details.amount * 0.015, // 1.5% commission
        status: 'pending'
      }
    };
  }

  private determineBuyerStage(syncRecord: BuyerPortalSync): string {
    if (syncRecord.syncData.transactionProgress) {
      return 'transaction_active';
    } else if (syncRecord.syncData.viewingHistory && syncRecord.syncData.viewingHistory.length > 0) {
      return 'viewing_stage';
    } else if (syncRecord.syncData.documentSubmissions && syncRecord.syncData.documentSubmissions.length > 0) {
      return 'documentation_stage';
    } else if (syncRecord.syncData.propertyInterests && syncRecord.syncData.propertyInterests.length > 0) {
      return 'browsing_stage';
    } else {
      return 'registration_stage';
    }
  }

  private mapActivityTypeToInteractionType(activityType: string): 'call' | 'email' | 'meeting' | 'viewing' | 'follow_up' | 'documentation' {
    const typeMap: Record<string, 'call' | 'email' | 'meeting' | 'viewing' | 'follow_up' | 'documentation'> = {
      'property_view': 'follow_up',
      'viewing_scheduled': 'viewing',
      'document_uploaded': 'documentation',
      'offer_made': 'meeting'
    };
    
    return typeMap[activityType] || 'follow_up';
  }

  private determineLeadStatusFromActivity(activityType: string): AgentLead['status'] | null {
    const statusMap: Record<string, AgentLead['status']> = {
      'viewing_scheduled': 'viewing_scheduled',
      'offer_made': 'offer_made',
      'document_uploaded': 'qualified'
    };
    
    return statusMap[activityType] || null;
  }

  private async sendAgentNotification(agentId: string, notification: string, syncRecord: BuyerPortalSync): Promise<void> {
    console.log(`📧 Sending agent notification: ${notification} to agent ${agentId}`);
    // In production, this would send actual notifications
  }

  private async executeAutomatedFollowUp(syncRecord: BuyerPortalSync, followUp: string): Promise<void> {
    console.log(`🤖 Executing automated follow-up: ${followUp} for sync ${syncRecord.id}`);
    // In production, this would execute actual automated actions
  }

  private initializeJourneyMappings(): void {
    this.journeyMappings = [
      {
        leadStage: 'new',
        portalStage: 'registration_stage',
        triggerActions: ['send_welcome_email', 'assign_agent'],
        agentNotifications: ['new_buyer_registered'],
        automatedFollowUps: ['welcome_sequence']
      },
      {
        leadStage: 'contacted',
        portalStage: 'browsing_stage',
        triggerActions: ['property_recommendations'],
        agentNotifications: ['buyer_browsing_actively'],
        automatedFollowUps: ['property_alerts']
      },
      {
        leadStage: 'viewing_scheduled',
        portalStage: 'viewing_stage',
        triggerActions: ['viewing_reminders'],
        agentNotifications: ['viewing_scheduled'],
        automatedFollowUps: ['pre_viewing_prep']
      }
    ];
  }

  private broadcastEvent(eventType: string, data: any): void {
    const listeners = this.eventListeners.get(eventType) || [];
    listeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error('Error in event listener:', error);
      }
    });
  }

  // =============================================================================
  // PUBLIC API METHODS
  // =============================================================================

  public getSyncRecordsByAgent(agentId: string): BuyerPortalSync[] {
    return Array.from(this.syncRecords.values()).filter(sync => sync.agentId === agentId);
  }

  public getSyncRecordByBuyer(buyerId: string): BuyerPortalSync | null {
    return Array.from(this.syncRecords.values()).find(sync => sync.buyerId === buyerId) || null;
  }

  public getAllSyncRecords(): BuyerPortalSync[] {
    return Array.from(this.syncRecords.values());
  }

  public addEventListener(eventType: string, callback: (event: any) => void): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(callback);
  }

  public retryFailedSync(syncId: string): Promise<void> {
    const sync = this.syncRecords.get(syncId);
    if (!sync || sync.syncStatus !== 'failed') {
      throw new Error('Sync record not found or not in failed state');
    }

    sync.retryCount += 1;
    sync.syncStatus = 'retry_scheduled';
    sync.nextRetry = new Date(Date.now() + Math.pow(2, sync.retryCount) * 60000); // Exponential backoff

    return Promise.resolve();
  }
}

// Export singleton instance
export const buyerPortalSyncService = BuyerPortalSyncService.getInstance();