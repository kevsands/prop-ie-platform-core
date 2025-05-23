/**
 * PropIE Core Data Model - Marketing
 * Defines marketing campaigns, leads, and tracking
 */

import { Document } from '../document';
import { Development } from './development';
import { Sale } from './sales';
import { Unit } from './unit';
import { User } from './user';

/**
 * Marketing Campaign interface
 * Targeted marketing effort for a development
 */
export interface MarketingCampaign {
  id: string;
  name: string;
  development: Development;
  status: CampaignStatus;
  
  // Campaign details
  description: string;
  targetAudience: string;
  objectives: string[];
  successCriteria: string[];
  
  // Timeline
  startDate: Date;
  endDate?: Date;
  plannedEndDate: Date;
  
  // Budget and spend
  budget: number;
  actualSpend: number;
  
  // Channels and activities
  channels: MarketingChannel[];
  activities: MarketingActivity[];
  
  // Materials and assets
  creativeAssets: CreativeAsset[];
  
  // Performance tracking
  performance: MarketingPerformance;
  leads: Lead[];
  
  // Management and metadata
  createdBy: User;
  assignedTo: User[];
  approvedBy?: User;
  created: Date;
  updated: Date;
  notes?: string;
  tags: string[];
}

/**
 * Campaign Status enum
 * Status of a marketing campaign
 */
export enum CampaignStatus {
  PLANNING = 'planning',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

/**
 * Marketing Channel interface
 * Distribution channel for marketing
 */
export interface MarketingChannel {
  id: string;
  name: string;
  type: ChannelType;
  status: 'active' | 'paused' | 'completed';
  
  // Budget and spend
  budget: number;
  actualSpend: number;
  
  // Performance metrics
  impressions: number;
  clicks?: number;
  inquiries: number;
  cost: number;
  costPerInquiry: number;
  costPerImpression: number;
  
  // Tracking
  startDate: Date;
  endDate?: Date;
  trackingCodes: string[];
  trackingUrls: string[];
  
  // Additional details
  platform?: string;
  targetAudience?: string;
  audienceSize?: number;
  geographicFocus?: string[];
  creativeAssets: CreativeAsset[];
  
  // Notes and metadata
  notes?: string;
  tags: string[];
}

/**
 * Channel Type enum
 * Types of marketing channels
 */
export enum ChannelType {
  DIGITAL = 'digital',
  PRINT = 'print',
  OUTDOOR = 'outdoor',
  RADIO = 'radio',
  TV = 'tv',
  EMAIL = 'email',
  SOCIAL = 'social',
  EVENTS = 'events',
  REFERRAL = 'referral',
  PARTNER = 'partner',
  PR = 'pr',
  DIRECT_MAIL = 'direct_mail'
}

/**
 * Marketing Activity interface
 * Specific marketing action
 */
export interface MarketingActivity {
  id: string;
  name: string;
  description: string;
  type: ActivityType;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  
  // Timeline
  plannedStartDate: Date;
  plannedEndDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  
  // Budget and spend
  budget: number;
  actualSpend: number;
  
  // Details and assets
  channel: MarketingChannel;
  assignedTo: User[];
  creativeAssets: CreativeAsset[];
  externalVendors?: string[];
  
  // Performance
  metrics: Record<string, number>\n  );
  results?: string;
  
  // Notes and metadata
  notes?: string;
  created: Date;
  updated: Date;
}

/**
 * Activity Type enum
 * Types of marketing activities
 */
export enum ActivityType {
  ADVERTISING = 'advertising',
  CONTENT_CREATION = 'content_creation',
  EMAIL_CAMPAIGN = 'email_campaign',
  SOCIAL_MEDIA_CAMPAIGN = 'social_media_campaign',
  EVENT = 'event',
  PR_RELEASE = 'pr_release',
  BROCHURE_DISTRIBUTION = 'brochure_distribution',
  VIDEO_PRODUCTION = 'video_production',
  WEBSITE_UPDATE = 'website_update',
  SEO_OPTIMIZATION = 'seo_optimization',
  BANNER_CAMPAIGN = 'banner_campaign',
  INFLUENCER_MARKETING = 'influencer_marketing',
  VIRTUAL_TOUR = 'virtual_tour',
  OTHER = 'other'
}

/**
 * Creative Asset interface
 * Marketing material or asset
 */
export interface CreativeAsset {
  id: string;
  name: string;
  type: AssetType;
  url: string;
  fileType: string;
  description?: string;
  
  // Usage and metrics
  usedIn: {
    campaigns: string[];
    channels: string[];
    activities: string[];
  };
  impressions?: number;
  clicks?: number;
  
  // Production details
  createdBy: string;
  designer?: string;
  agency?: string;
  creationDate: Date;
  expiryDate?: Date;
  versionNumber: string;
  
  // Status and rights
  status: 'draft' | 'review' | 'approved' | 'active' | 'archived';
  approvedBy?: User;
  approvedDate?: Date;
  rightsInformation?: string;
  usage: 'unlimited' | 'limited';
  usageRights?: string;
  
  // Tagging and metadata
  tags: string[];
  dimensions?: string;
  size?: number; // in KB
  thumbnailUrl?: string;
}

/**
 * Asset Type enum
 * Types of creative assets
 */
export enum AssetType {
  IMAGE = 'image',
  VIDEO = 'video',
  BROCHURE = 'brochure',
  FLYER = 'flyer',
  SOCIAL_POST = 'social_post',
  EMAIL_TEMPLATE = 'email_template',
  BANNER = 'banner',
  LOGO = 'logo',
  ICON = 'icon',
  AUDIO = 'audio',
  VIRTUAL_TOUR = 'virtual_tour',
  SITE_PLAN = 'site_plan',
  FLOOR_PLAN = 'floor_plan',
  COPYWRITING = 'copywriting',
  PRESENTATION = 'presentation',
  OTHER = 'other'
}

/**
 * Marketing Performance interface
 * Performance metrics for a campaign
 */
export interface MarketingPerformance {
  // Overview metrics
  totalImpressions: number;
  totalClicks: number;
  totalInquiries: number;
  totalLeads: number;
  totalViewings: number;
  totalReservations: number;
  totalSales: number;
  
  // Cost metrics
  totalSpend: number;
  costPerImpression: number;
  costPerClick: number;
  costPerInquiry: number;
  costPerLead: number;
  costPerViewing: number;
  costPerReservation: number;
  costPerSale: number;
  
  // Conversion metrics
  clickThroughRate: number;
  inquiryRate: number;
  leadConversionRate: number;
  viewingConversionRate: number;
  reservationConversionRate: number;
  saleConversionRate: number;
  overallConversionRate: number;
  
  // Timeline metrics
  averageTimeToInquiry: number; // in days
  averageTimeToViewing: number; // in days
  averageTimeToReservation: number; // in days
  averageTimeToSale: number; // in days
  
  // ROI metrics
  campaignROI: number;
  revenueGenerated: number;
  profitContribution: number;
  
  // Channel performance
  performanceByChannel: Record<string, {
    impressions: number;
    clicks: number;
    inquiries: number;
    leads: number;
    viewings: number;
    reservations: number;
    sales: number;
    spend: number;
    roi: number;
  }>\n  );
  // Demographic insights
  leadsByDemographic: Record<string, number>\n  );
  salesByDemographic: Record<string, number>\n  );
  // Time-based analysis
  performanceByDate: Array<{
    date: Date;
    impressions: number;
    clicks: number;
    inquiries: number;
    leads: number;
    reservations: number;
    sales: number;
  }>\n  );
  // Benchmarking
  benchmarkComparison?: {
    impressions: number; // percentage above/below benchmark
    costPerInquiry: number;
    conversionRate: number;
    roi: number;
  };
}

/**
 * Lead interface
 * Potential customer/buyer
 */
export interface Lead {
  id: string;
  source: string;
  campaign?: MarketingCampaign;
  channel?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  
  // Personal information
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  
  // Lead details
  status: LeadStatus;
  statusHistory: {
    status: LeadStatus;
    timestamp: Date;
    note?: string;
    user: User;
  }[];
  type: 'buyer' | 'investor' | 'agent' | 'other';
  priorityScore: number;
  assignedTo?: User;
  
  // Requirements
  interestedInDevelopments: Development[];
  interestedInUnits: Unit[];
  propertyType?: string[];
  bedrooms?: number[];
  budget?: {
    min: number;
    max: number;
  };
  desiredMoveInDate?: Date;
  
  // Interactions
  firstContactDate: Date;
  lastContactDate?: Date;
  nextFollowUpDate?: Date;
  interactions: LeadInteraction[];
  viewings: Viewing[];
  documents: Document[];
  notes: string[];
  
  // Conversion
  convertedToSale?: Sale;
  conversionDate?: Date;
  
  // Timestamps and metadata
  created: Date;
  updated: Date;
  tags: string[];
}

/**
 * Lead Status enum
 * Status of a sales lead
 */
export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  ENGAGED = 'engaged',
  QUALIFIED = 'qualified',
  NURTURING = 'nurturing',
  OPPORTUNITY = 'opportunity',
  VIEWING_BOOKED = 'viewing_booked',
  VIEWED = 'viewed',
  NEGOTIATING = 'negotiating',
  RESERVED = 'reserved',
  CONVERTED = 'converted',
  LOST = 'lost',
  DORMANT = 'dormant',
  JUNK = 'junk'
}

/**
 * Lead Interaction interface
 * Record of communication with a lead
 */
export interface LeadInteraction {
  id: string;
  lead: Lead;
  type: InteractionType;
  direction: 'inbound' | 'outbound';
  channel: 'email' | 'phone' | 'in_person' | 'sms' | 'social' | 'web' | 'other';
  date: Date;
  user: User;
  
  // Details
  subject?: string;
  content: string;
  duration?: number; // in minutes
  documents?: Document[];
  location?: string;
  
  // Outcome
  outcome?: string;
  followUpRequired: boolean;
  followUpDate?: Date;
  followUpAssignedTo?: User;
  
  // Metadata
  sentiment?: 'positive' | 'neutral' | 'negative';
  tags: string[];
}

/**
 * Interaction Type enum
 * Types of lead interactions
 */
export enum InteractionType {
  INQUIRY = 'inquiry',
  EMAIL = 'email',
  PHONE_CALL = 'phone_call',
  MEETING = 'meeting',
  VIEWING = 'viewing',
  SMS = 'sms',
  SOCIAL_MEDIA = 'social_media',
  WEB_CHAT = 'web_chat',
  EVENT = 'event',
  NOTE = 'note',
  OTHER = 'other'
}

/**
 * Viewing interface
 * Property viewing appointment
 */
export interface Viewing {
  id: string;
  lead: Lead;
  development: Development;
  units?: Unit[];
  
  // Scheduling
  date: Date;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  type: 'in_person' | 'virtual';
  status: ViewingStatus;
  
  // Participants
  host: User;
  attendees: {
    name: string;
    email?: string;
    phone?: string;
    relationship?: string;
  }[];
  
  // Details
  location: string;
  meetingPoint?: string;
  virtualMeetingLink?: string;
  privateParkingAvailable: boolean;
  specialRequirements?: string;
  
  // Follow-up
  feedback?: ViewingFeedback;
  followUp: {
    required: boolean;
    date?: Date;
    assignedTo?: User;
    completed: boolean;
    notes?: string;
  };
  
  // Reminders and communication
  reminderSent: boolean;
  reminderSentDate?: Date;
  confirmationSent: boolean;
  confirmationSentDate?: Date;
  
  // Metadata
  created: Date;
  updated: Date;
  createdBy: User;
  notes?: string;
}

/**
 * Viewing Status enum
 * Status of a property viewing
 */
export enum ViewingStatus {
  REQUESTED = 'requested',
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
  RESCHEDULED = 'rescheduled'
}

/**
 * Viewing Feedback interface
 * Feedback from a property viewing
 */
export interface ViewingFeedback {
  overallImpression: 'positive' | 'neutral' | 'negative';
  interestedInPurchasing: boolean;
  likedFeatures: string[];
  dislikedFeatures: string[];
  comments: string;
  pricePerception: 'too_high' | 'fair' | 'good_value';
  locationFeedback: string;
  finishesFeedback: string;
  layoutFeedback: string;
  amenitiesFeedback: string;
  competitorComparisons?: string;
  timeframe: 'immediate' | 'short_term' | 'long_term' | 'undecided';
  nextSteps: string;
  submittedBy: User;
  submittedDate: Date;
}

/**
 * Sales Dashboard interface
 * Sales performance dashboard
 */
export interface SalesDashboard {
  id: string;
  development: Development;
  asOfDate: Date;
  
  // Sales overview
  salesSummary: {
    availableUnits: number;
    reservedUnits: number;
    soldUnits: number;
    totalUnits: number;
    percentageSold: number;
    
    totalSalesValue: number;
    averageSalePrice: number;
    highestSalePrice: number;
    lowestSalePrice: number;
    salesValueLastMonth: number;
    salesValueThisMonth: number;
    
    salesByUnitType: Record<string, {
      total: number;
      sold: number;
      percentage: number;
    }>\n  );
  };
  
  // Sales velocity
  salesVelocity: {
    unitsPerMonth: number;
    salesValuePerMonth: number;
    timeToSellout: number; // in months
    absorptionRate: number; // percentage of inventory sold per month
    velocityTrend: Array<{
      month: string;
      units: number;
      value: number;
    }>\n  );
  };
  
  // Lead and pipeline metrics
  pipeline: {
    totalLeads: number;
    newLeadsThisMonth: number;
    activeLeads: number;
    qualifiedLeads: number;
    viewingsScheduled: number;
    viewingsCompleted: number;
    leadConversionRate: number;
    viewingConversionRate: number;
    leadsBySource: Record<string, number>\n  );
    leadsVsSales: Array<{
      month: string;
      leads: number;
      sales: number;
    }>\n  );
  };
  
  // Sales team performance
  teamPerformance: Array<{
    agent: User;
    leadsAssigned: number;
    viewingsConducted: number;
    salesClosed: number;
    salesValue: number;
    conversionRate: number;
    averageDealTime: number; // in days
  }>\n  );
  // Marketing attribution
  marketingAttribution: Array<{
    campaign: string;
    leads: number;
    sales: number;
    salesValue: number;
    spend: number;
    roi: number;
  }>\n  );
  // Forecasting
  forecast: {
    nextMonthProjected: {
      units: number;
      value: number;
    };
    quarterProjected: {
      units: number;
      value: number;
    };
    yearEndProjected: {
      units: number;
      value: number;
    };
    confidenceLevel: 'low' | 'medium' | 'high';
  };
}

/**
 * Construction Tracking interface
 * Construction progress tracking
 */
export interface ConstructionTracking {
  id: string;
  development: Development;
  asOfDate: Date;
  
  // Overall progress
  overallProgress: {
    percentage: number;
    phasePercentages: Record<string, number>\n  );
    unitsCompleted: number;
    totalUnits: number;
    estimatedCompletionDate: Date;
    originalCompletionDate: Date;
    daysAhead: number; // positive for ahead, negative for behind
  };
  
  // Budget tracking
  budgetTracking: {
    totalBudget: number;
    totalSpent: number;
    percentageSpent: number;
    projectedFinalCost: number;
    variance: number;
    variancePercentage: number;
    costOverruns: Array<{
      category: string;
      amount: number;
      reason: string;
    }>\n  );
    costSavings: Array<{
      category: string;
      amount: number;
      reason: string;
    }>\n  );
  };
  
  // Trades and contractors
  tradesProgress: Array<{
    trade: string;
    contractor: string;
    scheduledStart: Date;
    actualStart?: Date;
    scheduledEnd: Date;
    actualEnd?: Date;
    percentageComplete: number;
    status: 'not_started' | 'in_progress' | 'delayed' | 'completed';
    issues: number;
  }>\n  );
  // Quality assurance
  qualityAssurance: {
    inspectionsCompleted: number;
    inspectionsPassed: number;
    passRate: number;
    openSnags: number;
    closedSnags: number;
    criticalIssues: number;
  };
  
  // Health and safety
  healthAndSafety: {
    incidentsReported: number;
    nearMisses: number;
    lostTimeIncidents: number;
    safetyInspectionsCompleted: number;
    safetyScore: number;
    openSafetyActions: number;
  };
  
  // Progress photos
  progressPhotos: Array<{
    date: Date;
    area: string;
    photoUrl: string;
    notes?: string;
  }>\n  );
  // Risk register
  risks: Array<{
    description: string;
    impact: 'low' | 'medium' | 'high' | 'critical';
    probability: 'low' | 'medium' | 'high' | 'very_high';
    status: 'identified' | 'mitigating' | 'resolved';
    mitigation: string;
  }>\n  );
  // Unit completion status
  unitStatus: Record<string, {
    unit: string;
    percentageComplete: number;
    status: 'not_started' | 'foundation' | 'structure' | 'envelope' | 'interior_rough' | 'interior_finish' | 'completed';
    estimatedCompletionDate: Date;
    snags: number;
  }>\n  );
}

/**
 * Helper to calculate lead quality score
 */
export function calculateLeadScore(lead: Lead): number {
  let score = 0;
  
  // Basic information completeness (0-20)
  if (lead.firstName && lead.lastName) score += 5;
  if (lead.email) score += 5;
  if (lead.phone) score += 5;
  if (lead.address) score += 5;
  
  // Engagement level (0-30)
  score += Math.min(lead.interactions.length * 215);
  if (lead.viewings.length> 0) score += 15;
  
  // Budget and requirements clarity (0-20)
  if (lead.budget) score += 10;
  if (lead.interestedInDevelopments.length> 0) score += 5;
  if (lead.interestedInUnits.length> 0) score += 5;
  
  // Lead source quality (0-15)
  if (lead.source === 'referral') score += 15;
  else if (lead.source === 'website') score += 10;
  else if (lead.source === 'event') score += 8;
  else score += 5;
  
  // Readiness to purchase (0-15)
  if (lead.status === LeadStatus.QUALIFIED) score += 15;
  else if (lead.status === LeadStatus.VIEWING_BOOKED) score += 12;
  else if (lead.status === LeadStatus.ENGAGED) score += 8;
  else if (lead.status === LeadStatus.CONTACTED) score += 5;
  
  return score;
}

/**
 * Helper to calculate campaign performance
 */
export function calculateCampaignROI(
  campaign: MarketingCampaign
): number {
  const totalRevenue = campaign.leads
    .filter(lead => lead.convertedToSale)
    .reduce((sumlead) => {
      return sum + (lead.convertedToSale?.totalPrice || 0);
    }, 0);
  
  return campaign.actualSpend> 0 
    ? ((totalRevenue - campaign.actualSpend) / campaign.actualSpend) * 100 
    : 0;
}

/**
 * Helper to calculate best performing marketing channel
 */
export function getBestPerformingChannel(
  campaign: MarketingCampaign
): {
  channel: MarketingChannel;
  reason: string;
} | null {
  if (campaign.channels.length === 0) {
    return null;
  }
  
  const channels = campaign.channels
    .filter(channel => channel.inquiries> 0);
  
  if (channels.length === 0) {
    return null;
  }
  
  // Sort by cost per inquiry (lowest first)
  channels.sort((ab) => a.costPerInquiry - b.costPerInquiry);
  
  return {
    channel: channels[0],
    reason: 'Lowest cost per inquiry'
  };
}