/**
 * Agent-Buyer Integration Service
 * Complete transaction ecosystem: Agent → Buyer → Solicitor → Developer
 * 
 * @fileoverview Comprehensive integration service for estate agent workflows
 * @version 1.0.0
 * @author Property Development Platform Team
 */

import { 
  BuyerInformation, 
  Unit, 
  UnitStatus,
  ProjectStateUpdate 
} from '@/types/project';
import { universalTransactionService } from '@/services/UniversalTransactionService';
import { buyerSolicitorIntegrationService } from '@/services/BuyerSolicitorIntegrationService';
import { projectDataService } from '@/services/ProjectDataService';

// Enhanced interfaces for agent integration
export interface AgentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  agency: AgencyInformation;
  specializations: PropertySpecialization[];
  performanceMetrics: AgentPerformanceMetrics;
  certifications: AgentCertification[];
  territories: GeographicTerritory[];
  commissionStructure: CommissionStructure;
  status: 'active' | 'inactive' | 'suspended';
  joinDate: Date;
  lastActive: Date;
}

export interface AgencyInformation {
  id: string;
  name: string;
  licenseNumber: string;
  address: {
    street: string;
    city: string;
    county: string;
    eircode: string;
  };
  phone: string;
  email: string;
  website?: string;
  established: Date;
  size: 'independent' | 'small' | 'medium' | 'large' | 'national';
}

export interface PropertySpecialization {
  type: 'new_homes' | 'second_hand' | 'commercial' | 'investment' | 'luxury';
  experience: number; // years
  certifications: string[];
  preferredPriceRange: {
    min: number;
    max: number;
  };
}

export interface AgentPerformanceMetrics {
  totalSales: number;
  salesVolume: number;
  averageDaysOnMarket: number;
  clientSatisfactionScore: number;
  conversionRate: number;
  activeBuyers: number;
  completedTransactions: number;
  pipelineValue: number;
  yearToDateCommission: number;
  monthlyTargets: MonthlyTarget[];
}

export interface AgentCertification {
  id: string;
  name: string;
  issuingBody: string;
  issueDate: Date;
  expiryDate?: Date;
  status: 'active' | 'expired' | 'pending';
}

export interface GeographicTerritory {
  id: string;
  name: string;
  type: 'county' | 'city' | 'district' | 'postal_code';
  boundaries: string[];
  exclusivity: 'exclusive' | 'shared' | 'preferred';
}

export interface CommissionStructure {
  type: 'percentage' | 'fixed' | 'tiered' | 'hybrid';
  baseRate: number;
  tiers?: CommissionTier[];
  bonusStructure?: BonusStructure[];
  paymentTerms: 'on_completion' | 'on_exchange' | 'split';
}

export interface CommissionTier {
  volumeThreshold: number;
  rate: number;
  description: string;
}

export interface BonusStructure {
  trigger: 'monthly_target' | 'quarterly_target' | 'client_satisfaction' | 'new_development_sales';
  threshold: number;
  bonus: number;
  type: 'percentage' | 'fixed';
}

export interface MonthlyTarget {
  month: string;
  salesTarget: number;
  volumeTarget: number;
  newBuyersTarget: number;
  achieved: number;
  status: 'not_started' | 'in_progress' | 'achieved' | 'exceeded' | 'missed';
}

export interface AgentLead {
  id: string;
  agentId: string;
  source: 'website' | 'referral' | 'walk_in' | 'social_media' | 'advertising' | 'developer_referral';
  status: 'new' | 'contacted' | 'qualified' | 'viewing_scheduled' | 'offer_made' | 'converted' | 'lost';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  buyer: BuyerInformation;
  interests: PropertyInterest[];
  interactions: AgentInteraction[];
  timeline: LeadTimeline;
  potentialValue: number;
  conversionProbability: number;
  nextAction: NextAction;
  tags: string[];
  notes: string;
  createdAt: Date;
  lastUpdated: Date;
}

export interface PropertyInterest {
  projectId?: string;
  unitId?: string;
  propertyType: string[];
  priceRange: {
    min: number;
    max: number;
  };
  locations: string[];
  bedrooms: number[];
  requirements: string[];
  dealBreakers: string[];
  htbEligible: boolean;
  timeframe: 'immediate' | '1-3_months' | '3-6_months' | '6-12_months' | 'flexible';
}

export interface AgentInteraction {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'viewing' | 'follow_up' | 'documentation';
  date: Date;
  duration?: number; // minutes
  outcome: 'positive' | 'neutral' | 'negative';
  notes: string;
  nextAction?: string;
  attachments?: string[];
}

export interface LeadTimeline {
  firstContact: Date;
  lastContact: Date;
  nextScheduledContact?: Date;
  averageResponseTime: number; // hours
  totalInteractions: number;
  daysInPipeline: number;
}

export interface NextAction {
  type: 'call' | 'email' | 'meeting' | 'viewing' | 'follow_up' | 'documentation';
  description: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  reminders: Date[];
}

export interface AgentCommissionRecord {
  id: string;
  agentId: string;
  transactionId: string;
  buyerId: string;
  projectId: string;
  unitId: string;
  salePrice: number;
  commissionRate: number;
  commissionAmount: number;
  status: 'pending' | 'confirmed' | 'paid' | 'disputed';
  calculationDate: Date;
  paymentDate?: Date;
  paymentMethod?: string;
  notes?: string;
  breakdown: CommissionBreakdown;
}

export interface CommissionBreakdown {
  baseCommission: number;
  bonuses: {
    type: string;
    amount: number;
    reason: string;
  }[];
  deductions: {
    type: string;
    amount: number;
    reason: string;
  }[];
  netCommission: number;
  taxes: number;
  finalPayment: number;
}

export interface AgentBuyerOnboarding {
  id: string;
  agentId: string;
  buyerId: string;
  onboardingStage: 'initial_contact' | 'qualification' | 'registration' | 'property_matching' | 'completed';
  completedSteps: OnboardingStep[];
  nextSteps: OnboardingStep[];
  estimatedCompletion: Date;
  agentNotes: string;
  buyerFeedback?: string;
}

export interface OnboardingStep {
  id: string;
  name: string;
  description: string;
  required: boolean;
  completed: boolean;
  completedAt?: Date;
  completedBy?: string;
  notes?: string;
  documents?: string[];
}

// =============================================================================
// AGENT-BUYER INTEGRATION SERVICE CLASS
// =============================================================================

export class AgentBuyerIntegrationService {
  private static instance: AgentBuyerIntegrationService;
  private agents: Map<string, AgentProfile> = new Map();
  private leads: Map<string, AgentLead> = new Map();
  private commissionRecords: Map<string, AgentCommissionRecord> = new Map();
  private onboardingProcesses: Map<string, AgentBuyerOnboarding> = new Map();
  private eventListeners: Map<string, Array<(event: any) => void>> = new Map();

  private constructor() {
    // Singleton pattern for enterprise data consistency
    this.initializeAgentProfiles();
  }

  public static getInstance(): AgentBuyerIntegrationService {
    if (!AgentBuyerIntegrationService.instance) {
      AgentBuyerIntegrationService.instance = new AgentBuyerIntegrationService();
    }
    return AgentBuyerIntegrationService.instance;
  }

  // =============================================================================
  // AGENT PROFILE MANAGEMENT
  // =============================================================================

  /**
   * Initialize sample agent profiles for demonstration
   */
  private initializeAgentProfiles(): void {
    const sampleAgents: AgentProfile[] = [
      {
        id: 'agent-001',
        name: 'Sarah Murphy',
        email: 'sarah.murphy@sheehanproperty.ie',
        phone: '+353 87 123 4567',
        licenseNumber: 'PSRA-2019-001234',
        agency: {
          id: 'agency-001',
          name: 'Sheehan Property',
          licenseNumber: 'PSRA-AG-2018-001',
          address: {
            street: '123 Main Street',
            city: 'Drogheda',
            county: 'Co. Louth',
            eircode: 'A92 X1Y2'
          },
          phone: '+353 41 987 6543',
          email: 'info@sheehanproperty.ie',
          website: 'https://sheehanproperty.ie',
          established: new Date('2018-01-01'),
          size: 'medium'
        },
        specializations: [
          {
            type: 'new_homes',
            experience: 5,
            certifications: ['New Homes Specialist', 'HTB Certified'],
            preferredPriceRange: { min: 250000, max: 600000 }
          }
        ],
        performanceMetrics: {
          totalSales: 127,
          salesVolume: 42500000,
          averageDaysOnMarket: 45,
          clientSatisfactionScore: 4.8,
          conversionRate: 0.68,
          activeBuyers: 23,
          completedTransactions: 89,
          pipelineValue: 8900000,
          yearToDateCommission: 187500,
          monthlyTargets: this.generateMonthlyTargets()
        },
        certifications: [
          {
            id: 'cert-001',
            name: 'Real Estate License',
            issuingBody: 'PSRA',
            issueDate: new Date('2019-03-15'),
            status: 'active'
          }
        ],
        territories: [
          {
            id: 'territory-001',
            name: 'Drogheda & Surrounds',
            type: 'city',
            boundaries: ['Drogheda', 'Bettystown', 'Laytown'],
            exclusivity: 'preferred'
          }
        ],
        commissionStructure: {
          type: 'percentage',
          baseRate: 1.5,
          paymentTerms: 'on_completion'
        },
        status: 'active',
        joinDate: new Date('2019-03-01'),
        lastActive: new Date()
      },
      {
        id: 'agent-002',
        name: 'Michael O\'Brien',
        email: 'michael.obrien@dngproperty.ie',
        phone: '+353 86 234 5678',
        licenseNumber: 'PSRA-2020-002345',
        agency: {
          id: 'agency-002',
          name: 'DNG Property',
          licenseNumber: 'PSRA-AG-2015-002',
          address: {
            street: '45 O\'Connell Street',
            city: 'Dublin',
            county: 'Co. Dublin',
            eircode: 'D01 K7X8'
          },
          phone: '+353 1 234 5678',
          email: 'info@dng.ie',
          website: 'https://dng.ie',
          established: new Date('2015-01-01'),
          size: 'large'
        },
        specializations: [
          {
            type: 'new_homes',
            experience: 4,
            certifications: ['DNG New Homes Specialist'],
            preferredPriceRange: { min: 300000, max: 800000 }
          }
        ],
        performanceMetrics: {
          totalSales: 98,
          salesVolume: 35200000,
          averageDaysOnMarket: 38,
          clientSatisfactionScore: 4.6,
          conversionRate: 0.72,
          activeBuyers: 31,
          completedTransactions: 76,
          pipelineValue: 12300000,
          yearToDateCommission: 234500,
          monthlyTargets: this.generateMonthlyTargets()
        },
        certifications: [
          {
            id: 'cert-002',
            name: 'Real Estate License',
            issuingBody: 'PSRA',
            issueDate: new Date('2020-05-20'),
            status: 'active'
          }
        ],
        territories: [
          {
            id: 'territory-002',
            name: 'Dublin 15 & Surrounds',
            type: 'district',
            boundaries: ['Blanchardstown', 'Castleknock', 'Clonsilla'],
            exclusivity: 'shared'
          }
        ],
        commissionStructure: {
          type: 'tiered',
          baseRate: 1.25,
          tiers: [
            { volumeThreshold: 1000000, rate: 1.5, description: 'Over €1M volume' },
            { volumeThreshold: 2000000, rate: 1.75, description: 'Over €2M volume' }
          ],
          paymentTerms: 'on_completion'
        },
        status: 'active',
        joinDate: new Date('2020-05-01'),
        lastActive: new Date()
      }
    ];

    sampleAgents.forEach(agent => {
      this.agents.set(agent.id, agent);
    });

    console.log(`✅ Agent profiles initialized: ${this.agents.size} agents`);
  }

  private generateMonthlyTargets(): MonthlyTarget[] {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => ({
      month,
      salesTarget: 8 + Math.floor(Math.random() * 4),
      volumeTarget: 2500000 + Math.floor(Math.random() * 1000000),
      newBuyersTarget: 12 + Math.floor(Math.random() * 8),
      achieved: Math.floor(Math.random() * 15),
      status: Math.random() > 0.5 ? 'achieved' : 'in_progress'
    }));
  }

  // =============================================================================
  // AGENT-BUYER ONBOARDING INTEGRATION
  // =============================================================================

  /**
   * Create a new lead and begin agent-buyer onboarding process
   */
  public async createAgentLead(
    agentId: string,
    buyerInfo: Partial<BuyerInformation>,
    propertyInterests: PropertyInterest[],
    source: AgentLead['source']
  ): Promise<AgentLead> {
    try {
      const leadId = `lead-${Date.now()}-${agentId}`;
      const buyerId = `buyer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Create complete buyer profile
      const completeBuyer: BuyerInformation = {
        id: buyerId,
        name: buyerInfo.name || 'New Buyer',
        email: buyerInfo.email || '',
        phone: buyerInfo.phone || '',
        address: buyerInfo.address || '',
        employmentStatus: buyerInfo.employmentStatus || 'employed',
        annualIncome: buyerInfo.annualIncome || 0,
        htbEligible: buyerInfo.htbEligible || false,
        mortgagePreApproval: buyerInfo.mortgagePreApproval || false,
        agentId: agentId,
        registrationDate: new Date(),
        lastLogin: new Date(),
        preferences: {
          communicationMethod: 'email',
          newsletterSubscription: true,
          marketingConsent: true
        }
      };

      const lead: AgentLead = {
        id: leadId,
        agentId,
        source,
        status: 'new',
        priority: this.calculateLeadPriority(propertyInterests, completeBuyer),
        buyer: completeBuyer,
        interests: propertyInterests,
        interactions: [],
        timeline: {
          firstContact: new Date(),
          lastContact: new Date(),
          averageResponseTime: 0,
          totalInteractions: 0,
          daysInPipeline: 0
        },
        potentialValue: this.calculatePotentialValue(propertyInterests),
        conversionProbability: this.calculateConversionProbability(completeBuyer, propertyInterests),
        nextAction: {
          type: 'call',
          description: 'Initial qualification call',
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          priority: 'high',
          reminders: [new Date(Date.now() + 2 * 60 * 60 * 1000)] // 2 hours
        },
        tags: this.generateLeadTags(completeBuyer, propertyInterests),
        notes: '',
        createdAt: new Date(),
        lastUpdated: new Date()
      };

      this.leads.set(leadId, lead);

      // Start onboarding process
      await this.initiateOnboardingProcess(agentId, buyerId);

      // Update agent metrics
      await this.updateAgentMetrics(agentId, 'new_lead');

      // Broadcast event
      this.broadcastEvent('agent_lead_created', {
        leadId,
        agentId,
        buyerId,
        source,
        potentialValue: lead.potentialValue
      });

      console.log(`✅ Agent lead created: ${leadId} for agent ${agentId}`);
      return lead;

    } catch (error) {
      console.error('Error creating agent lead:', error);
      throw error;
    }
  }

  /**
   * Convert agent lead to registered buyer in buyer portal
   */
  public async convertLeadToBuyer(
    leadId: string,
    additionalInfo?: Partial<BuyerInformation>
  ): Promise<{ buyer: BuyerInformation; onboarding: AgentBuyerOnboarding }> {
    try {
      const lead = this.leads.get(leadId);
      if (!lead) {
        throw new Error(`Lead ${leadId} not found`);
      }

      // Update buyer information
      const enhancedBuyer: BuyerInformation = {
        ...lead.buyer,
        ...additionalInfo,
        registrationDate: new Date(),
        agentReferral: {
          agentId: lead.agentId,
          agentName: this.agents.get(lead.agentId)?.name || 'Unknown Agent',
          referralDate: new Date(),
          leadSource: lead.source
        }
      };

      // Update lead status
      lead.status = 'converted';
      lead.buyer = enhancedBuyer;
      lead.lastUpdated = new Date();

      // Complete onboarding process
      const onboarding = this.onboardingProcesses.get(`${lead.agentId}-${lead.buyer.id}`);
      if (onboarding) {
        onboarding.onboardingStage = 'completed';
        onboarding.completedSteps = onboarding.completedSteps.map(step => ({
          ...step,
          completed: true,
          completedAt: new Date()
        }));
      }

      // Update agent metrics
      await this.updateAgentMetrics(lead.agentId, 'conversion');

      // Broadcast event
      this.broadcastEvent('lead_converted_to_buyer', {
        leadId,
        buyerId: enhancedBuyer.id,
        agentId: lead.agentId,
        conversionValue: lead.potentialValue
      });

      console.log(`✅ Lead converted to buyer: ${leadId} → ${enhancedBuyer.id}`);
      return { buyer: enhancedBuyer, onboarding: onboarding! };

    } catch (error) {
      console.error('Error converting lead to buyer:', error);
      throw error;
    }
  }

  /**
   * Track when agent-referred buyer makes a reservation
   */
  public async trackAgentReferralReservation(
    buyerId: string,
    unitId: string,
    projectId: string,
    reservationAmount: number
  ): Promise<AgentCommissionRecord | null> {
    try {
      // Find the lead associated with this buyer
      const lead = Array.from(this.leads.values()).find(l => l.buyer.id === buyerId);
      if (!lead || !lead.buyer.agentReferral) {
        console.log(`No agent referral found for buyer ${buyerId}`);
        return null;
      }

      const agentId = lead.buyer.agentReferral.agentId;
      const agent = this.agents.get(agentId);
      if (!agent) {
        console.error(`Agent ${agentId} not found`);
        return null;
      }

      // Get unit data to calculate commission
      const project = universalTransactionService.getProjectById(projectId);
      const unit = project?.units.find(u => u.id === unitId);
      if (!unit) {
        console.error(`Unit ${unitId} not found in project ${projectId}`);
        return null;
      }

      // Calculate commission
      const salePrice = unit.pricing.currentPrice;
      const commissionRate = agent.commissionStructure.baseRate / 100;
      const baseCommission = salePrice * commissionRate;

      // Apply any bonuses
      const bonuses = this.calculateCommissionBonuses(agent, salePrice, lead);
      const totalBonuses = bonuses.reduce((sum, bonus) => sum + bonus.amount, 0);

      const commissionRecord: AgentCommissionRecord = {
        id: `commission-${Date.now()}-${agentId}`,
        agentId,
        transactionId: `trans-${buyerId}-${unitId}`,
        buyerId,
        projectId,
        unitId,
        salePrice,
        commissionRate,
        commissionAmount: baseCommission + totalBonuses,
        status: 'pending',
        calculationDate: new Date(),
        breakdown: {
          baseCommission,
          bonuses,
          deductions: [],
          netCommission: baseCommission + totalBonuses,
          taxes: (baseCommission + totalBonuses) * 0.2, // 20% tax estimate
          finalPayment: (baseCommission + totalBonuses) * 0.8
        }
      };

      this.commissionRecords.set(commissionRecord.id, commissionRecord);

      // Update agent metrics
      await this.updateAgentMetrics(agentId, 'sale', salePrice);

      // Update lead status
      lead.status = 'converted';
      lead.lastUpdated = new Date();

      // Broadcast event
      this.broadcastEvent('agent_commission_earned', {
        commissionId: commissionRecord.id,
        agentId,
        buyerId,
        salePrice,
        commissionAmount: commissionRecord.commissionAmount
      });

      console.log(`✅ Agent commission tracked: €${commissionRecord.commissionAmount.toFixed(2)} for agent ${agent.name}`);
      return commissionRecord;

    } catch (error) {
      console.error('Error tracking agent referral reservation:', error);
      return null;
    }
  }

  // =============================================================================
  // HELPER METHODS
  // =============================================================================

  private calculateLeadPriority(interests: PropertyInterest[], buyer: BuyerInformation): AgentLead['priority'] {
    let score = 0;
    
    // HTB eligible buyers are higher priority
    if (buyer.htbEligible) score += 2;
    
    // Pre-approved buyers are higher priority
    if (buyer.mortgagePreApproval) score += 2;
    
    // Higher budget = higher priority
    const maxBudget = Math.max(...interests.map(i => i.priceRange.max));
    if (maxBudget > 500000) score += 2;
    else if (maxBudget > 350000) score += 1;
    
    // Immediate timeframe = higher priority
    if (interests.some(i => i.timeframe === 'immediate')) score += 2;
    
    if (score >= 6) return 'urgent';
    if (score >= 4) return 'high';
    if (score >= 2) return 'medium';
    return 'low';
  }

  private calculatePotentialValue(interests: PropertyInterest[]): number {
    return Math.max(...interests.map(i => i.priceRange.max));
  }

  private calculateConversionProbability(buyer: BuyerInformation, interests: PropertyInterest[]): number {
    let probability = 0.3; // Base 30% conversion rate
    
    if (buyer.htbEligible) probability += 0.2;
    if (buyer.mortgagePreApproval) probability += 0.25;
    if (interests.some(i => i.timeframe === 'immediate')) probability += 0.15;
    if (buyer.employmentStatus === 'employed') probability += 0.1;
    
    return Math.min(0.95, probability);
  }

  private generateLeadTags(buyer: BuyerInformation, interests: PropertyInterest[]): string[] {
    const tags: string[] = [];
    
    if (buyer.htbEligible) tags.push('HTB Eligible');
    if (buyer.mortgagePreApproval) tags.push('Pre-Approved');
    if (interests.some(i => i.timeframe === 'immediate')) tags.push('Urgent');
    if (buyer.employmentStatus === 'employed') tags.push('Employed');
    
    return tags;
  }

  private async initiateOnboardingProcess(agentId: string, buyerId: string): Promise<void> {
    const onboardingId = `${agentId}-${buyerId}`;
    
    const onboarding: AgentBuyerOnboarding = {
      id: onboardingId,
      agentId,
      buyerId,
      onboardingStage: 'initial_contact',
      completedSteps: [],
      nextSteps: [
        {
          id: 'step-1',
          name: 'Initial Qualification',
          description: 'Conduct initial buyer qualification call',
          required: true,
          completed: false
        },
        {
          id: 'step-2',
          name: 'Buyer Registration',
          description: 'Register buyer in portal system',
          required: true,
          completed: false
        },
        {
          id: 'step-3',
          name: 'Property Matching',
          description: 'Match buyer with suitable properties',
          required: true,
          completed: false
        }
      ],
      estimatedCompletion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      agentNotes: ''
    };

    this.onboardingProcesses.set(onboardingId, onboarding);
  }

  private async updateAgentMetrics(agentId: string, eventType: string, value?: number): Promise<void> {
    const agent = this.agents.get(agentId);
    if (!agent) return;

    switch (eventType) {
      case 'new_lead':
        agent.performanceMetrics.activeBuyers += 1;
        break;
      case 'conversion':
        agent.performanceMetrics.activeBuyers -= 1;
        agent.performanceMetrics.completedTransactions += 1;
        break;
      case 'sale':
        if (value) {
          agent.performanceMetrics.salesVolume += value;
          agent.performanceMetrics.totalSales += 1;
        }
        break;
    }

    agent.lastActive = new Date();
  }

  private calculateCommissionBonuses(agent: AgentProfile, salePrice: number, lead: AgentLead): BonusStructure[] {
    const bonuses: BonusStructure[] = [];
    
    // New development bonus
    if (lead.interests.some(i => i.projectId)) {
      bonuses.push({
        trigger: 'new_development_sales',
        threshold: 0,
        bonus: salePrice * 0.002, // 0.2% bonus for new developments
        type: 'percentage'
      });
    }
    
    return bonuses;
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

  public getAgentById(agentId: string): AgentProfile | null {
    return this.agents.get(agentId) || null;
  }

  public getAllAgents(): AgentProfile[] {
    return Array.from(this.agents.values());
  }

  public getAgentLeads(agentId: string): AgentLead[] {
    return Array.from(this.leads.values()).filter(lead => lead.agentId === agentId);
  }

  public getAgentCommissions(agentId: string): AgentCommissionRecord[] {
    return Array.from(this.commissionRecords.values()).filter(record => record.agentId === agentId);
  }

  public getOnboardingProcess(agentId: string, buyerId: string): AgentBuyerOnboarding | null {
    return this.onboardingProcesses.get(`${agentId}-${buyerId}`) || null;
  }

  public addEventListener(eventType: string, callback: (event: any) => void): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(callback);
  }

  public updateLeadStatus(leadId: string, status: AgentLead['status']): boolean {
    const lead = this.leads.get(leadId);
    if (!lead) return false;

    lead.status = status;
    lead.lastUpdated = new Date();
    return true;
  }

  public addLeadInteraction(leadId: string, interaction: Omit<AgentInteraction, 'id'>): boolean {
    const lead = this.leads.get(leadId);
    if (!lead) return false;

    const interactionWithId: AgentInteraction = {
      ...interaction,
      id: `interaction-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    lead.interactions.push(interactionWithId);
    lead.timeline.lastContact = interaction.date;
    lead.timeline.totalInteractions += 1;
    lead.lastUpdated = new Date();

    return true;
  }
}

// Export singleton instance
export const agentBuyerIntegrationService = AgentBuyerIntegrationService.getInstance();