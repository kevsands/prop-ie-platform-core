export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'negotiating' | 'closed' | 'lost';
  score: number;
  source: 'website' | 'referral' | 'agent' | 'marketing' | 'other';
  notes: string;
  tags: string[];
  assignedAgentId: string;
  requirements?: PropertyRequirement;
  activities: Activity[];
  viewings: Viewing[];
  propertyInterests: PropertyInterest[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyRequirement {
  minBudget: number;
  maxBudget: number;
  minBedrooms: number;
  maxBedrooms: number;
  propertyTypes: string[];
  preferredLocations: string[];
  additionalRequirements: string;
}

export interface Activity {
  id: string;
  leadId: string;
  type: 'call' | 'email' | 'meeting' | 'viewing' | 'note';
  description: string;
  performedBy: string;
  createdAt: Date;
}

export interface Viewing {
  id: string;
  leadId: string;
  propertyId: string;
  agentId: string;
  scheduledDate: Date;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  feedback?: string;
  rating?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
  propertyType: 'house' | 'apartment' | 'condo' | 'townhouse' | 'land' | 'commercial';
  status: 'available' | 'under_offer' | 'sold' | 'withdrawn';
  location: {
    address: string;
    city: string;
    state: string;
    zip: string;
    lat?: number;
    lng?: number;
  };
  features: string[];
  images: string[];
  virtualTourUrl?: string;
  developmentId?: string;
  agentId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyInterest {
  id: string;
  leadId: string;
  propertyId: string;
  level: 'low' | 'medium' | 'high';
  notes: string;
  createdAt: Date;
}

export interface PropertyMatch {
  property: Property;
  lead: Lead;
  score: number;
  breakdown: {
    location: number;
    price: number;
    bedrooms: number;
    propertyType: number;
    size: number;
  };
  reasons: string[];
}

export interface MatchingCriteria {
  location: { weight: number };
  price: { weight: number; tolerance: number };
  bedrooms: { weight: number; tolerance: number };
  propertyType: { weight: number };
  size: { weight: number; tolerance: number };
}

export interface AgentPerformanceMetrics {
  agentId: string;
  totalLeads: number;
  closedDeals: number;
  totalRevenue: number;
  viewingsConducted: number;
  propertiesListed: number;
  averageResponseTime: number;
  customerSatisfaction: number;
  dealsBySource: { [source: string]: number };
  performanceHistory: Array<{
    period: string;
    leads: number;
    deals: number;
    revenue: number;
  }>
  );
}

export interface PerformanceTarget {
  id: string;
  agentId: string;
  metric: 'deals' | 'revenue' | 'viewings' | 'listings';
  targetValue: number;
  currentValue: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  deadline: Date;
}

export interface Commission {
  id: string;
  agentId: string;
  dealId: string;
  propertyId: string;
  dealValue: number;
  amount: number;
  rate: number;
  status: 'pending' | 'approved' | 'paid';
  paymentDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommissionStructure {
  id: string;
  agentId: string;
  type: 'flat' | 'tiered' | 'performance-based';
  baseRate: number;
  tiers: CommissionTier[];
  performanceModifiers?: PerformanceModifier[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CommissionTier {
  minAmount: number;
  maxAmount: number;
  percentage: number;
}

export interface PerformanceModifier {
  metric: string;
  thresholdValue: number;
  bonusPercentage: number;
}

export interface AutomatedWorkflow {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
  isActive: boolean;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowTrigger {
  type: 'lead_created' | 'viewing_scheduled' | 'viewing_completed' | 'property_matched' | 'time_based' | 'lead_status_change';
  conditions: { [key: string]: any };
}

export interface WorkflowAction {
  id: string;
  type: 'send_email' | 'send_sms' | 'create_task' | 'update_lead_status' | 'add_to_campaign' | 'notify_agent';
  parameters: { [key: string]: any };
  delay?: number;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Deal {
  id: string;
  leadId: string;
  propertyId: string;
  agentId: string;
  value: number;
  status: 'negotiating' | 'accepted' | 'closed' | 'fallen_through';
  closingDate?: Date;
  commission?: Commission;
  documents: Document[];
  createdAt: Date;
  updatedAt: Date;
}