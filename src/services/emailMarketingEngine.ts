/**
 * Email Marketing Engine - Advanced Lead Management & Nurturing
 * Categorizes users, tracks behavior, and delivers targeted campaigns
 */

import { EventEmitter } from 'events';

export enum UserCategory {
  FIRST_TIME_BUYER = 'FIRST_TIME_BUYER',
  PROPERTY_INVESTOR = 'PROPERTY_INVESTOR', 
  DEVELOPER = 'DEVELOPER',
  CONTRACTOR = 'CONTRACTOR',
  REAL_ESTATE_AGENT = 'REAL_ESTATE_AGENT',
  CASUAL_BROWSER = 'CASUAL_BROWSER',
  HIGH_VALUE_PROSPECT = 'HIGH_VALUE_PROSPECT',
  RETURNING_VISITOR = 'RETURNING_VISITOR'
}

export enum EmailCampaignType {
  WELCOME_SERIES = 'WELCOME_SERIES',
  PROPERTY_ALERTS = 'PROPERTY_ALERTS',
  INVESTMENT_OPPORTUNITIES = 'INVESTMENT_OPPORTUNITIES',
  DEVELOPER_ONBOARDING = 'DEVELOPER_ONBOARDING',
  ABANDONED_SEARCH = 'ABANDONED_SEARCH',
  NURTURE_SEQUENCE = 'NURTURE_SEQUENCE',
  RE_ENGAGEMENT = 'RE_ENGAGEMENT',
  PROP_CHOICE_UPSELL = 'PROP_CHOICE_UPSELL'
}

export enum LeadScore {
  COLD = 'COLD',           // 0-25 points
  WARM = 'WARM',           // 26-50 points  
  HOT = 'HOT',             // 51-75 points
  URGENT = 'URGENT'        // 76-100 points
}

interface VisitorBehavior {
  pageViews: number;
  timeOnSite: number; // seconds
  pagesVisited: string[];
  searchQueries: string[];
  propertyViews: string[];
  developmentInterest: string[];
  downloadedResources: string[];
  formSubmissions: number;
  emailOpens: number;
  emailClicks: number;
  lastVisit: Date;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  referralSource: string;
  location: string;
}

interface EmailContact {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  category: UserCategory;
  leadScore: number;
  leadGrade: LeadScore;
  behavior: VisitorBehavior;
  preferences: {
    priceRange?: { min: number; max: number };
    bedrooms?: number;
    propertyTypes?: string[];
    locations?: string[];
    investmentBudget?: number;
    timeframe?: string;
  };
  tags: string[];
  subscriptionStatus: 'subscribed' | 'unsubscribed' | 'pending';
  campaignHistory: EmailCampaignEvent[];
  revenueGenerated: number;
  createdAt: Date;
  updatedAt: Date;
}

interface EmailCampaignEvent {
  campaignId: string;
  campaignType: EmailCampaignType;
  sentAt: Date;
  openedAt?: Date;
  clickedAt?: Date;
  convertedAt?: Date;
  revenue?: number;
}

interface EmailCampaign {
  id: string;
  type: EmailCampaignType;
  name: string;
  targetCategory: UserCategory[];
  subject: string;
  content: string;
  htmlContent: string;
  triggerConditions: {
    leadScoreMin?: number;
    leadScoreMax?: number;
    daysSinceLastVisit?: number;
    specificBehavior?: string[];
    tags?: string[];
  };
  scheduling: {
    immediate?: boolean;
    delayHours?: number;
    bestTimeToSend?: string; // e.g., "09:00-11:00"
    timezone?: string;
  };
  performance: {
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
    revenue: number;
    unsubscribed: number;
  };
  isActive: boolean;
  createdAt: Date;
}

export class EmailMarketingEngine {
  private eventBus = new EventEmitter();
  private contacts: Map<string, EmailContact> = new Map();
  private campaigns: Map<string, EmailCampaign> = new Map();

  /**
   * Track website visitor behavior and categorize
   */
  async trackVisitorBehavior(
    visitorId: string,
    behaviorData: Partial<VisitorBehavior>,
    email?: string
  ): Promise<EmailContact | null> {
    let contact = email ? this.findContactByEmail(email) : null;
    
    if (!contact && email) {
      contact = await this.createContact(email, behaviorData);
    } else if (contact) {
      contact = await this.updateContactBehavior(contact.id, behaviorData);
    }

    // Track anonymous behavior for future email capture
    if (!email) {
      this.trackAnonymousVisitor(visitorId, behaviorData);
    }

    return contact;
  }

  /**
   * Create new email contact with automatic categorization
   */
  async createContact(
    email: string,
    initialBehavior: Partial<VisitorBehavior> = {}
  ): Promise<EmailContact> {
    const contactId = `CONTACT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const contact: EmailContact = {
      id: contactId,
      email: email.toLowerCase(),
      category: await this.categorizeUser(initialBehavior),
      leadScore: this.calculateInitialLeadScore(initialBehavior),
      leadGrade: LeadScore.COLD,
      behavior: {
        pageViews: initialBehavior.pageViews || 1,
        timeOnSite: initialBehavior.timeOnSite || 0,
        pagesVisited: initialBehavior.pagesVisited || [],
        searchQueries: initialBehavior.searchQueries || [],
        propertyViews: initialBehavior.propertyViews || [],
        developmentInterest: initialBehavior.developmentInterest || [],
        downloadedResources: initialBehavior.downloadedResources || [],
        formSubmissions: 1, // Email signup counts as form submission
        emailOpens: 0,
        emailClicks: 0,
        lastVisit: new Date(),
        deviceType: initialBehavior.deviceType || 'desktop',
        referralSource: initialBehavior.referralSource || 'direct',
        location: initialBehavior.location || 'Ireland'
      },
      preferences: {},
      tags: await this.generateInitialTags(initialBehavior),
      subscriptionStatus: 'subscribed',
      campaignHistory: [],
      revenueGenerated: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    contact.leadGrade = this.calculateLeadGrade(contact.leadScore);
    this.contacts.set(contactId, contact);

    // Trigger welcome campaign
    await this.triggerCampaign(contact, EmailCampaignType.WELCOME_SERIES);

    console.log(`✅ New contact created: ${email} (${contact.category})`);
    this.eventBus.emit('contact.created', contact);

    return contact;
  }

  /**
   * Update contact behavior and recalculate scoring
   */
  async updateContactBehavior(
    contactId: string,
    behaviorData: Partial<VisitorBehavior>
  ): Promise<EmailContact> {
    const contact = this.contacts.get(contactId);
    if (!contact) throw new Error('Contact not found');

    // Update behavior data
    Object.assign(contact.behavior, {
      ...behaviorData,
      pageViews: contact.behavior.pageViews + (behaviorData.pageViews || 1),
      timeOnSite: contact.behavior.timeOnSite + (behaviorData.timeOnSite || 0),
      lastVisit: new Date()
    });

    // Merge arrays
    if (behaviorData.pagesVisited) {
      contact.behavior.pagesVisited = [...new Set([...contact.behavior.pagesVisited, ...behaviorData.pagesVisited])];
    }
    if (behaviorData.searchQueries) {
      contact.behavior.searchQueries = [...new Set([...contact.behavior.searchQueries, ...behaviorData.searchQueries])];
    }
    if (behaviorData.propertyViews) {
      contact.behavior.propertyViews = [...new Set([...contact.behavior.propertyViews, ...behaviorData.propertyViews])];
    }

    // Recalculate lead score and category
    const oldScore = contact.leadScore;
    const oldCategory = contact.category;
    
    contact.leadScore = await this.calculateLeadScore(contact);
    contact.leadGrade = this.calculateLeadGrade(contact.leadScore);
    contact.category = await this.categorizeUser(contact.behavior);
    contact.updatedAt = new Date();

    // Trigger campaigns based on behavior changes
    await this.evaluateCampaignTriggers(contact, oldScore, oldCategory);

    this.contacts.set(contactId, contact);
    this.eventBus.emit('contact.updated', contact);

    return contact;
  }

  /**
   * Intelligent user categorization based on behavior
   */
  private async categorizeUser(behavior: Partial<VisitorBehavior>): Promise<UserCategory> {
    const pages = behavior.pagesVisited || [];
    const searches = behavior.searchQueries || [];
    const properties = behavior.propertyViews || [];

    // Developer indicators
    if (pages.some(p => p.includes('/developer/') || p.includes('/sell'))) {
      return UserCategory.DEVELOPER;
    }

    // Contractor indicators  
    if (pages.some(p => p.includes('/tender') || p.includes('/contractor'))) {
      return UserCategory.CONTRACTOR;
    }

    // Investment indicators
    const investmentKeywords = ['investment', 'yield', 'rental', 'roi', 'portfolio'];
    if (searches.some(s => investmentKeywords.some(k => s.toLowerCase().includes(k))) ||
        properties.length > 5) {
      return UserCategory.PROPERTY_INVESTOR;
    }

    // First-time buyer indicators
    const firstTimeBuyerKeywords = ['first time', 'help to buy', 'mortgage calculator', 'buying guide'];
    if (searches.some(s => firstTimeBuyerKeywords.some(k => s.toLowerCase().includes(k))) ||
        pages.some(p => p.includes('first-time-buyer'))) {
      return UserCategory.FIRST_TIME_BUYER;
    }

    // High-value prospect indicators
    if (behavior.timeOnSite && behavior.timeOnSite > 600 && // 10+ minutes
        behavior.pageViews && behavior.pageViews > 10) {
      return UserCategory.HIGH_VALUE_PROSPECT;
    }

    // Returning visitor
    if (behavior.pageViews && behavior.pageViews > 1) {
      return UserCategory.RETURNING_VISITOR;
    }

    return UserCategory.CASUAL_BROWSER;
  }

  /**
   * Calculate lead score based on behavior and engagement
   */
  private async calculateLeadScore(contact: EmailContact): Promise<number> {
    let score = 0;
    const behavior = contact.behavior;

    // Page engagement scoring
    score += Math.min(behavior.pageViews * 2, 20); // Max 20 points
    score += Math.min(behavior.timeOnSite / 60, 15); // 1 point per minute, max 15
    score += behavior.formSubmissions * 10; // 10 points per form
    score += behavior.emailOpens * 3; // 3 points per email open
    score += behavior.emailClicks * 5; // 5 points per email click

    // Property interest scoring
    score += Math.min(behavior.propertyViews.length * 3, 15); // Max 15 points
    score += behavior.searchQueries.length * 2; // 2 points per search
    score += behavior.downloadedResources.length * 8; // 8 points per download

    // Category bonuses
    switch (contact.category) {
      case UserCategory.DEVELOPER:
        score += 25; // High-value category
        break;
      case UserCategory.PROPERTY_INVESTOR:
        score += 20;
        break;
      case UserCategory.HIGH_VALUE_PROSPECT:
        score += 15;
        break;
      case UserCategory.FIRST_TIME_BUYER:
        score += 10;
        break;
    }

    // Revenue generation bonus
    if (contact.revenueGenerated > 0) {
      score += Math.min(contact.revenueGenerated / 100, 25); // Up to 25 points for revenue
    }

    // Recency factor
    const daysSinceLastVisit = Math.floor((Date.now() - behavior.lastVisit.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceLastVisit > 30) score *= 0.8; // Reduce score for inactive users
    if (daysSinceLastVisit > 90) score *= 0.6;

    return Math.min(Math.round(score), 100); // Cap at 100
  }

  /**
   * Calculate initial lead score for new contacts
   */
  private calculateInitialLeadScore(behavior: Partial<VisitorBehavior>): number {
    let score = 5; // Base score for email signup

    if (behavior.pageViews) score += Math.min(behavior.pageViews * 2, 10);
    if (behavior.timeOnSite) score += Math.min(behavior.timeOnSite / 60, 8);
    if (behavior.propertyViews?.length) score += behavior.propertyViews.length * 3;

    return Math.min(score, 25); // Conservative initial scoring
  }

  /**
   * Convert lead score to grade
   */
  private calculateLeadGrade(score: number): LeadScore {
    if (score >= 76) return LeadScore.URGENT;
    if (score >= 51) return LeadScore.HOT;
    if (score >= 26) return LeadScore.WARM;
    return LeadScore.COLD;
  }

  /**
   * Generate initial tags based on behavior
   */
  private async generateInitialTags(behavior: Partial<VisitorBehavior>): Promise<string[]> {
    const tags: string[] = [];

    if (behavior.deviceType === 'mobile') tags.push('mobile-user');
    if (behavior.referralSource?.includes('google')) tags.push('google-traffic');
    if (behavior.referralSource?.includes('facebook')) tags.push('social-media');
    if (behavior.timeOnSite && behavior.timeOnSite > 300) tags.push('engaged-visitor');
    if (behavior.propertyViews && behavior.propertyViews.length > 3) tags.push('high-intent');

    return tags;
  }

  /**
   * Create and manage email campaigns
   */
  async createCampaign(campaignData: Omit<EmailCampaign, 'id' | 'performance' | 'createdAt'>): Promise<EmailCampaign> {
    const campaignId = `CAMPAIGN-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    
    const campaign: EmailCampaign = {
      id: campaignId,
      ...campaignData,
      performance: {
        sent: 0,
        opened: 0,
        clicked: 0,
        converted: 0,
        revenue: 0,
        unsubscribed: 0
      },
      createdAt: new Date()
    };

    this.campaigns.set(campaignId, campaign);
    console.log(`✅ Campaign created: ${campaign.name} (${campaign.type})`);

    return campaign;
  }

  /**
   * Trigger campaign for specific contact
   */
  async triggerCampaign(contact: EmailContact, campaignType: EmailCampaignType): Promise<boolean> {
    const campaign = Array.from(this.campaigns.values())
      .find(c => c.type === campaignType && c.isActive);

    if (!campaign) {
      console.log(`⚠️ No active campaign found for type: ${campaignType}`);
      return false;
    }

    // Check if contact matches campaign criteria
    if (!this.contactMatchesCampaign(contact, campaign)) {
      return false;
    }

    // Send email (in production, integrate with email service)
    const emailSent = await this.sendEmail(contact, campaign);
    
    if (emailSent) {
      // Record campaign event
      const campaignEvent: EmailCampaignEvent = {
        campaignId: campaign.id,
        campaignType: campaign.type,
        sentAt: new Date()
      };

      contact.campaignHistory.push(campaignEvent);
      campaign.performance.sent++;
      
      console.log(`📧 Campaign sent: ${campaign.name} to ${contact.email}`);
      this.eventBus.emit('campaign.sent', { contact, campaign });
    }

    return emailSent;
  }

  /**
   * Check if contact matches campaign targeting criteria
   */
  private contactMatchesCampaign(contact: EmailContact, campaign: EmailCampaign): boolean {
    const conditions = campaign.triggerConditions;

    // Category match
    if (!campaign.targetCategory.includes(contact.category)) {
      return false;
    }

    // Lead score range
    if (conditions.leadScoreMin && contact.leadScore < conditions.leadScoreMin) {
      return false;
    }
    if (conditions.leadScoreMax && contact.leadScore > conditions.leadScoreMax) {
      return false;
    }

    // Days since last visit
    if (conditions.daysSinceLastVisit) {
      const daysSince = Math.floor((Date.now() - contact.behavior.lastVisit.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSince < conditions.daysSinceLastVisit) {
        return false;
      }
    }

    // Tag matching
    if (conditions.tags && !conditions.tags.some(tag => contact.tags.includes(tag))) {
      return false;
    }

    return true;
  }

  /**
   * Send email to contact (mock implementation)
   */
  private async sendEmail(contact: EmailContact, campaign: EmailCampaign): Promise<boolean> {
    try {
      // In production, integrate with email service (Resend, SendGrid, etc.)
      console.log(`📧 Sending email: "${campaign.subject}" to ${contact.email}`);
      
      // Mock email sending delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  /**
   * Evaluate campaign triggers based on behavior changes
   */
  private async evaluateCampaignTriggers(
    contact: EmailContact,
    oldScore: number,
    oldCategory: UserCategory
  ): Promise<void> {
    // Score improvement triggers
    if (contact.leadScore > oldScore + 10) {
      await this.triggerCampaign(contact, EmailCampaignType.NURTURE_SEQUENCE);
    }

    // Hot lead trigger
    if (contact.leadGrade === LeadScore.HOT && oldScore < 51) {
      await this.triggerCampaign(contact, EmailCampaignType.PROPERTY_ALERTS);
    }

    // Category change triggers
    if (oldCategory !== contact.category) {
      if (contact.category === UserCategory.DEVELOPER) {
        await this.triggerCampaign(contact, EmailCampaignType.DEVELOPER_ONBOARDING);
      }
    }

    // Abandoned search trigger
    const recentSearches = contact.behavior.searchQueries.length;
    const recentProperties = contact.behavior.propertyViews.length;
    if (recentSearches > 0 && recentProperties === 0) {
      setTimeout(() => {
        this.triggerCampaign(contact, EmailCampaignType.ABANDONED_SEARCH);
      }, 24 * 60 * 60 * 1000); // 24 hours delay
    }
  }

  /**
   * Track anonymous visitors for future email capture
   */
  private trackAnonymousVisitor(visitorId: string, behaviorData: Partial<VisitorBehavior>): void {
    // Store anonymous behavior for session stitching when email is provided
    // This would typically use browser storage or analytics cookies
    console.log(`👤 Tracking anonymous visitor: ${visitorId}`);
  }

  /**
   * Find contact by email
   */
  private findContactByEmail(email: string): EmailContact | null {
    return Array.from(this.contacts.values())
      .find(contact => contact.email === email.toLowerCase()) || null;
  }

  /**
   * Get contacts by category
   */
  getContactsByCategory(category: UserCategory): EmailContact[] {
    return Array.from(this.contacts.values())
      .filter(contact => contact.category === category);
  }

  /**
   * Get high-value prospects
   */
  getHighValueProspects(): EmailContact[] {
    return Array.from(this.contacts.values())
      .filter(contact => 
        contact.leadGrade === LeadScore.HOT || 
        contact.leadGrade === LeadScore.URGENT ||
        contact.revenueGenerated > 0
      )
      .sort((a, b) => b.leadScore - a.leadScore);
  }

  /**
   * Get campaign performance analytics
   */
  getCampaignAnalytics(): Record<string, any> {
    const campaigns = Array.from(this.campaigns.values());
    const totalContacts = this.contacts.size;
    
    return {
      totalContacts,
      totalCampaigns: campaigns.length,
      activeCampaigns: campaigns.filter(c => c.isActive).length,
      averageOpenRate: campaigns.reduce((sum, c) => sum + (c.performance.opened / Math.max(c.performance.sent, 1)), 0) / campaigns.length * 100,
      averageClickRate: campaigns.reduce((sum, c) => sum + (c.performance.clicked / Math.max(c.performance.sent, 1)), 0) / campaigns.length * 100,
      totalRevenue: campaigns.reduce((sum, c) => sum + c.performance.revenue, 0),
      categoryBreakdown: Object.values(UserCategory).reduce((acc, category) => {
        acc[category] = this.getContactsByCategory(category).length;
        return acc;
      }, {} as Record<string, number>)
    };
  }

  /**
   * Subscribe to email marketing events
   */
  onEmailEvent(callback: (event: any) => void) {
    this.eventBus.on('contact.created', callback);
    this.eventBus.on('contact.updated', callback);
    this.eventBus.on('campaign.sent', callback);
  }
}

// Export singleton instance
export const emailMarketingEngine = new EmailMarketingEngine();