import { EventEmitter } from 'events';
import {
  Lead,
  Property,
  Viewing,
  PropertyMatch,
  MatchingCriteria,
  AgentPerformanceMetrics,
  PerformanceTarget,
  Commission,
  CommissionStructure,
  AutomatedWorkflow,
  EmailTemplate,
  WorkflowTrigger,
  WorkflowAction
} from '@/types/crm';

export class EstateAgentCRMService extends EventEmitter {
  // Lead Management
  async getAllLeads(): Promise<Lead[]> {
    // Mock implementation - replace with actual database call
    return [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        status: 'new',
        score: 75,
        source: 'website',
        notes: 'Interested in 3-bed properties',
        tags: ['first-time-buyer', 'pre-approved'],
        assignedAgentId: 'agent-123',
        requirements: {
          minBudget: 300000,
          maxBudget: 450000,
          minBedrooms: 3,
          maxBedrooms: 4,
          propertyTypes: ['house', 'townhouse'],
          preferredLocations: ['Dublin City', 'Dublin South'],
          additionalRequirements: 'Need garden'
        },
        activities: [],
        viewings: [],
        propertyInterests: [],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20')
      }
    ];
  }

  async createLead(data: Partial<Lead>): Promise<Lead> {
    const lead: Lead = {
      id: Date.now().toString(),
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || '',
      status: 'new',
      score: 50,
      source: data.source || 'other',
      notes: data.notes || '',
      tags: data.tags || [],
      assignedAgentId: data.assignedAgentId || '',
      requirements: data.requirements,
      activities: [],
      viewings: [],
      propertyInterests: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.emit('lead:created', lead);
    return lead;
  }

  async updateLead(id: string, data: Partial<Lead>): Promise<Lead> {
    // Mock implementation
    const lead = await this.getLeadById(id);
    const updatedLead = { ...lead, ...data, updatedAt: new Date() };
    this.emit('lead:updated', updatedLead);
    return updatedLead;
  }

  async getLeadById(id: string): Promise<Lead> {
    const leads = await this.getAllLeads();
    const lead = leads.find(l => l.id === id);
    if (!lead) throw new Error('Lead not found');
    return lead;
  }

  async deleteLead(id: string): Promise<void> {
    this.emit('lead:deleted', { id });
  }

  // Property Management
  async getAllProperties(): Promise<Property[]> {
    // Mock implementation
    return [
      {
        id: '1',
        title: '3 Bed Semi-Detached House',
        description: 'Beautiful family home in quiet neighborhood',
        price: 395000,
        bedrooms: 3,
        bathrooms: 2,
        size: 120,
        propertyType: 'house',
        status: 'available',
        location: {
          address: '123 Main Street',
          city: 'Dublin',
          state: 'Dublin',
          zip: 'D12',
          lat: 53.3498,
          lng: -6.2603
        },
        features: ['Garden', 'Parking', 'Recently Renovated'],
        images: ['/images/property1.jpg'],
        agentId: 'agent-123',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10')
      }
    ];
  }

  // Property Matching
  async findPropertyMatches(
    leadId: string,
    criteria?: MatchingCriteria
  ): Promise<PropertyMatch[]> {
    const lead = await this.getLeadById(leadId);
    const properties = await this.getAllProperties();

    const defaultCriteria: MatchingCriteria = criteria || {
      location: { weight: 0.3 },
      price: { weight: 0.25, tolerance: 10 },
      bedrooms: { weight: 0.15, tolerance: 1 },
      propertyType: { weight: 0.15 },
      size: { weight: 0.15, tolerance: 15 }
    };

    const matches: PropertyMatch[] = properties.map(property => {
      const scores = {
        location: this.calculateLocationScore(leadproperty),
        price: this.calculatePriceScore(lead, property, defaultCriteria.price.tolerance || 10),
        bedrooms: this.calculateBedroomsScore(leadproperty),
        propertyType: this.calculatePropertyTypeScore(leadproperty),
        size: this.calculateSizeScore(leadproperty)
      };

      const totalScore = Object.entries(scores).reduce((sum, [keyscore]) => {
        const weight = defaultCriteria[key as keyof MatchingCriteria].weight;
        return sum + (score * weight);
      }, 0);

      return {
        property,
        lead,
        score: totalScore,
        breakdown: scores,
        reasons: this.generateMatchReasons(scores)
      };
    });

    return matches.sort((ab) => b.score - a.score);
  }

  private calculateLocationScore(lead: Lead, property: Property): number {
    if (!lead.requirements?.preferredLocations) return 0.5;
    const isPreferred = lead.requirements.preferredLocations.includes(property.location.city);
    return isPreferred ? 1 : 0.3;
  }

  private calculatePriceScore(lead: Lead, property: Property, tolerance: number): number {
    if (!lead.requirements) return 0.5;
    const { minBudget = 0, maxBudget = Infinity } = lead.requirements;

    if (property.price>= minBudget && property.price <= maxBudget) {
      return 1;
    }

    const toleranceAmount = maxBudget * (tolerance / 100);
    if (property.price <= maxBudget + toleranceAmount) {
      return 0.7;
    }

    return 0.2;
  }

  private calculateBedroomsScore(lead: Lead, property: Property): number {
    if (!lead.requirements) return 0.5;
    const { minBedrooms = 0, maxBedrooms = Infinity } = lead.requirements;

    if (property.bedrooms>= minBedrooms && property.bedrooms <= maxBedrooms) {
      return 1;
    }

    const diff = Math.min(
      Math.abs(property.bedrooms - minBedrooms),
      Math.abs(property.bedrooms - maxBedrooms)
    );

    return Math.max(0, 1 - (diff * 0.2));
  }

  private calculatePropertyTypeScore(lead: Lead, property: Property): number {
    if (!lead.requirements?.propertyTypes) return 0.5;
    return lead.requirements.propertyTypes.includes(property.propertyType) ? 1 : 0.3;
  }

  private calculateSizeScore(lead: Lead, property: Property): number {
    // Basic size scoring - can be enhanced with lead requirements
    return 0.8;
  }

  private generateMatchReasons(scores: Record<string, number>): string[] {
    const reasons: string[] = [];

    if (scores.location>= 0.8) reasons.push('Perfect location match');
    if (scores.price>= 0.8) reasons.push('Within budget');
    if (scores.bedrooms === 1) reasons.push('Exact bedroom count');
    if (scores.propertyType === 1) reasons.push('Preferred property type');

    return reasons;
  }

  async saveCriteriaPreferences(criteria: MatchingCriteria): Promise<void> {
    // Save to user preferences
    this.emit('criteria:saved', criteria);
  }

  // Viewing Management
  async getAllViewings(): Promise<Viewing[]> {
    // Mock implementation
    return [
      {
        id: '1',
        leadId: '1',
        propertyId: '1',
        agentId: 'agent-123',
        scheduledDate: new Date('2024-02-01T14:00:00'),
        duration: 30,
        status: 'scheduled',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  async createViewing(data: Partial<Viewing>): Promise<Viewing> {
    const viewing: Viewing = {
      id: Date.now().toString(),
      leadId: data.leadId || '',
      propertyId: data.propertyId || '',
      agentId: data.agentId || '',
      scheduledDate: data.scheduledDate || new Date(),
      duration: data.duration || 30,
      status: 'scheduled',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.emit('viewing:created', viewing);
    return viewing;
  }

  async updateViewing(id: string, data: Partial<Viewing>): Promise<Viewing> {
    // Mock implementation
    const viewing = { id, ...data, updatedAt: new Date() };
    this.emit('viewing:updated', viewing);
    return viewing as Viewing;
  }

  async cancelViewing(id: string): Promise<void> {
    await this.updateViewing(id, { status: 'cancelled' });
  }

  // Performance Metrics
  async getAgentPerformance(
    agentId: string,
    startDate: Date,
    endDate: Date
  ): Promise<AgentPerformanceMetrics> {
    // Mock implementation
    return {
      agentId,
      totalLeads: 45,
      closedDeals: 12,
      totalRevenue: 4800000,
      viewingsConducted: 78,
      propertiesListed: 23,
      averageResponseTime: 2.5,
      customerSatisfaction: 4.7,
      dealsBySource: {
        website: 5,
        referral: 4,
        marketing: 3
      },
      performanceHistory: [
        { period: 'Jan 2024', leads: 15, deals: 4, revenue: 1600000 },
        { period: 'Feb 2024', leads: 18, deals: 5, revenue: 2000000 },
        { period: 'Mar 2024', leads: 12, deals: 3, revenue: 1200000 }
      ]
    };
  }

  async getPerformanceTargets(agentId: string): Promise<PerformanceTarget[]> {
    // Mock implementation
    return [
      {
        id: '1',
        agentId,
        metric: 'deals',
        targetValue: 15,
        currentValue: 12,
        period: 'monthly',
        deadline: new Date('2024-03-31')
      },
      {
        id: '2',
        agentId,
        metric: 'revenue',
        targetValue: 5000000,
        currentValue: 4800000,
        period: 'monthly',
        deadline: new Date('2024-03-31')
      }
    ];
  }

  // Commission Management
  async getCommissions(
    agentId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Commission[]> {
    // Mock implementation
    return [
      {
        id: '1',
        agentId,
        dealId: 'deal-1',
        propertyId: 'prop-1',
        dealValue: 395000,
        amount: 11850,
        rate: 3,
        status: 'paid',
        paymentDate: new Date('2024-02-15'),
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-15')
      },
      {
        id: '2',
        agentId,
        dealId: 'deal-2',
        propertyId: 'prop-2',
        dealValue: 450000,
        amount: 13500,
        rate: 3,
        status: 'pending',
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-03-01')
      }
    ];
  }

  async getCommissionStructure(agentId: string): Promise<CommissionStructure> {
    // Mock implementation
    return {
      id: '1',
      agentId,
      type: 'tiered',
      baseRate: 2.5,
      tiers: [
        { minAmount: 0, maxAmount: 300000, percentage: 2.5 },
        { minAmount: 300000, maxAmount: 500000, percentage: 3 },
        { minAmount: 500000, maxAmount: Infinity, percentage: 3.5 }
      ],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    };
  }

  async updateCommissionStructure(
    agentId: string,
    structure: CommissionStructure
  ): Promise<void> {
    this.emit('commission:structureUpdated', { agentId, structure });
  }

  // Automated Workflows
  async getAutomatedWorkflows(agentId: string): Promise<AutomatedWorkflow[]> {
    // Mock implementation
    return [
      {
        id: '1',
        name: 'New Lead Welcome',
        description: 'Send welcome email to new leads',
        trigger: {
          type: 'lead_created',
          conditions: {}
        },
        actions: [
          {
            id: '1',
            type: 'send_email',
            parameters: { templateId: 'welcome-email' }
          }
        ],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  async saveWorkflow(workflow: AutomatedWorkflow): Promise<AutomatedWorkflow> {
    this.emit('workflow:saved', workflow);
    return workflow;
  }

  async deleteWorkflow(workflowId: string): Promise<void> {
    this.emit('workflow:deleted', { id: workflowId });
  }

  // Email Templates
  async getEmailTemplates(agentId: string): Promise<EmailTemplate[]> {
    // Mock implementation
    return [
      {
        id: '1',
        name: 'Welcome Email',
        subject: 'Welcome to our property search!',
        body: 'Hi {firstName}, welcome to our service...',
        variables: ['firstName', 'lastName'],
        category: 'welcome',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  async saveEmailTemplate(template: EmailTemplate): Promise<EmailTemplate> {
    this.emit('template:saved', template);
    return template;
  }
}