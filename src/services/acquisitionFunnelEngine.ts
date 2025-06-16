/**
 * Customer Acquisition Funnel Engine
 * Unified system for converting visitors into revenue-generating customers
 * Integrates revenue engine, email marketing, and conversion optimization
 */

import { EventEmitter } from 'events';
import { emailMarketingEngine, UserCategory, EmailCampaignType } from './emailMarketingEngine';
import { revenueEngine, FeeType, SubscriptionTier } from './revenueEngine';

export enum FunnelStage {
  AWARENESS = 'AWARENESS',           // Landing page visit, first touch
  INTEREST = 'INTEREST',             // Email signup, content engagement  
  CONSIDERATION = 'CONSIDERATION',   // Property views, search behavior
  INTENT = 'INTENT',                 // Property inquiries, calculator usage
  EVALUATION = 'EVALUATION',         // Multiple property views, customization
  PURCHASE = 'PURCHASE'              // Transaction initiation, payment
}

export enum ConversionGoal {
  EMAIL_SIGNUP = 'EMAIL_SIGNUP',
  PROPERTY_INQUIRY = 'PROPERTY_INQUIRY',
  DEVELOPER_DEMO = 'DEVELOPER_DEMO',
  SUBSCRIPTION_UPGRADE = 'SUBSCRIPTION_UPGRADE',
  PROP_CHOICE_PURCHASE = 'PROP_CHOICE_PURCHASE',
  PROPERTY_PURCHASE = 'PROPERTY_PURCHASE',
  CONTRACTOR_SIGNUP = 'CONTRACTOR_SIGNUP'
}

interface FunnelVisitor {
  id: string;
  sessionId: string;
  email?: string;
  category?: UserCategory;
  currentStage: FunnelStage;
  acquisitionSource: string;
  landingPage: string;
  utmParams: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
  };
  behavior: {
    pageViews: number;
    timeOnSite: number;
    scrollDepth: number;
    clickEvents: string[];
    formInteractions: string[];
    searchQueries: string[];
    propertyViews: string[];
  };
  conversions: FunnelConversion[];
  revenuePotential: number;
  lastActivity: Date;
  createdAt: Date;
}

interface FunnelConversion {
  goal: ConversionGoal;
  value: number;
  timestamp: Date;
  page: string;
  campaignAttribution?: string;
}

interface ABTestVariant {
  id: string;
  name: string;
  traffic: number; // Percentage of traffic
  config: Record<string, any>;
  isControl: boolean;
}

interface ABTest {
  id: string;
  name: string;
  goal: ConversionGoal;
  variants: ABTestVariant[];
  isActive: boolean;
  startDate: Date;
  endDate?: Date;
  results: {
    [variantId: string]: {
      visitors: number;
      conversions: number;
      revenue: number;
      conversionRate: number;
    };
  };
}

interface LandingPageOptimization {
  page: string;
  category: UserCategory;
  elements: {
    headline: string;
    subheadline: string;
    ctaText: string;
    ctaColor: string;
    heroImage: string;
    valueProposition: string[];
    socialProof: string;
    urgencyMessage?: string;
  };
  conversionRate: number;
  lastOptimized: Date;
}

export class AcquisitionFunnelEngine {
  private eventBus = new EventEmitter();
  private visitors: Map<string, FunnelVisitor> = new Map();
  private abTests: Map<string, ABTest> = new Map();
  private landingPages: Map<string, LandingPageOptimization> = new Map();

  /**
   * Track visitor entry into acquisition funnel
   */
  async trackVisitorEntry(
    sessionId: string,
    entryData: {
      landingPage: string;
      acquisitionSource: string;
      utmParams?: Record<string, string>;
      referrer?: string;
      userAgent?: string;
      ipAddress?: string;
    }
  ): Promise<FunnelVisitor> {
    const visitorId = `VISITOR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const visitor: FunnelVisitor = {
      id: visitorId,
      sessionId,
      currentStage: FunnelStage.AWARENESS,
      acquisitionSource: entryData.acquisitionSource,
      landingPage: entryData.landingPage,
      utmParams: entryData.utmParams || {},
      behavior: {
        pageViews: 1,
        timeOnSite: 0,
        scrollDepth: 0,
        clickEvents: [],
        formInteractions: [],
        searchQueries: [],
        propertyViews: []
      },
      conversions: [],
      revenuePotential: await this.calculateRevenuePotential(entryData),
      lastActivity: new Date(),
      createdAt: new Date()
    };

    this.visitors.set(visitorId, visitor);

    // Apply A/B test variant if applicable
    await this.assignABTestVariant(visitor);

    // Track funnel entry
    this.eventBus.emit('funnel.entry', visitor);
    console.log(`👥 New visitor entered funnel: ${visitorId} via ${entryData.acquisitionSource}`);

    return visitor;
  }

  /**
   * Update visitor behavior and advance through funnel stages
   */
  async updateVisitorBehavior(
    visitorId: string,
    behaviorUpdate: {
      pageView?: string;
      timeOnSite?: number;
      scrollDepth?: number;
      clickEvent?: string;
      formInteraction?: string;
      searchQuery?: string;
      propertyView?: string;
      email?: string;
    }
  ): Promise<FunnelVisitor | null> {
    const visitor = this.visitors.get(visitorId);
    if (!visitor) return null;

    // Update behavior data
    if (behaviorUpdate.pageView) {
      visitor.behavior.pageViews++;
    }
    if (behaviorUpdate.timeOnSite) {
      visitor.behavior.timeOnSite += behaviorUpdate.timeOnSite;
    }
    if (behaviorUpdate.scrollDepth) {
      visitor.behavior.scrollDepth = Math.max(visitor.behavior.scrollDepth, behaviorUpdate.scrollDepth);
    }
    if (behaviorUpdate.clickEvent) {
      visitor.behavior.clickEvents.push(behaviorUpdate.clickEvent);
    }
    if (behaviorUpdate.formInteraction) {
      visitor.behavior.formInteractions.push(behaviorUpdate.formInteraction);
    }
    if (behaviorUpdate.searchQuery) {
      visitor.behavior.searchQueries.push(behaviorUpdate.searchQuery);
    }
    if (behaviorUpdate.propertyView) {
      visitor.behavior.propertyViews.push(behaviorUpdate.propertyView);
    }

    // Email capture - major conversion event
    if (behaviorUpdate.email && !visitor.email) {
      visitor.email = behaviorUpdate.email;
      await this.handleEmailConversion(visitor);
    }

    // Advance funnel stage based on behavior
    const newStage = this.calculateFunnelStage(visitor);
    if (newStage !== visitor.currentStage) {
      const oldStage = visitor.currentStage;
      visitor.currentStage = newStage;
      await this.handleStageAdvancement(visitor, oldStage, newStage);
    }

    visitor.lastActivity = new Date();
    this.visitors.set(visitorId, visitor);

    return visitor;
  }

  /**
   * Record conversion events
   */
  async recordConversion(
    visitorId: string,
    goal: ConversionGoal,
    value: number = 0,
    page: string = '',
    campaignAttribution?: string
  ): Promise<boolean> {
    const visitor = this.visitors.get(visitorId);
    if (!visitor) return false;

    const conversion: FunnelConversion = {
      goal,
      value,
      timestamp: new Date(),
      page,
      campaignAttribution
    };

    visitor.conversions.push(conversion);

    // Update A/B test results
    await this.updateABTestResults(visitor, conversion);

    // Trigger revenue collection if applicable
    await this.processRevenueConversion(visitor, conversion);

    // Trigger follow-up campaigns
    await this.triggerFollowUpCampaigns(visitor, conversion);

    this.eventBus.emit('funnel.conversion', { visitor, conversion });
    console.log(`💰 Conversion recorded: ${goal} (€${value}) for visitor ${visitorId}`);

    return true;
  }

  /**
   * Calculate visitor's current funnel stage based on behavior
   */
  private calculateFunnelStage(visitor: FunnelVisitor): FunnelStage {
    const behavior = visitor.behavior;

    // Purchase stage - has made transactions
    if (visitor.conversions.some(c => 
      c.goal === ConversionGoal.PROPERTY_PURCHASE || 
      c.goal === ConversionGoal.SUBSCRIPTION_UPGRADE ||
      c.goal === ConversionGoal.PROP_CHOICE_PURCHASE
    )) {
      return FunnelStage.PURCHASE;
    }

    // Evaluation stage - deep engagement with properties/customization
    if (behavior.propertyViews.length >= 3 || 
        behavior.formInteractions.some(f => f.includes('customization'))) {
      return FunnelStage.EVALUATION;
    }

    // Intent stage - specific actions showing purchase intent
    if (behavior.formInteractions.some(f => f.includes('inquiry') || f.includes('calculator')) ||
        behavior.clickEvents.some(c => c.includes('contact') || c.includes('demo'))) {
      return FunnelStage.INTENT;
    }

    // Consideration stage - browsing properties, multiple searches
    if (behavior.propertyViews.length > 0 || behavior.searchQueries.length > 0) {
      return FunnelStage.CONSIDERATION;
    }

    // Interest stage - email signup or significant engagement
    if (visitor.email || behavior.timeOnSite > 120 || behavior.pageViews > 3) {
      return FunnelStage.INTEREST;
    }

    // Default: Awareness stage
    return FunnelStage.AWARENESS;
  }

  /**
   * Handle email conversion - integrate with email marketing system
   */
  private async handleEmailConversion(visitor: FunnelVisitor): Promise<void> {
    if (!visitor.email) return;

    // Create contact in email marketing system
    const behaviorData = {
      pageViews: visitor.behavior.pageViews,
      timeOnSite: visitor.behavior.timeOnSite,
      pagesVisited: [visitor.landingPage],
      searchQueries: visitor.behavior.searchQueries,
      propertyViews: visitor.behavior.propertyViews,
      deviceType: 'desktop' as const, // Could be detected from user agent
      referralSource: visitor.acquisitionSource,
      location: 'Ireland'
    };

    const contact = await emailMarketingEngine.trackVisitorBehavior(
      visitor.sessionId,
      behaviorData,
      visitor.email
    );

    if (contact) {
      visitor.category = contact.category;
      
      // Record email signup conversion
      await this.recordConversion(
        visitor.id,
        ConversionGoal.EMAIL_SIGNUP,
        50, // Value of email signup
        visitor.landingPage,
        visitor.utmParams.campaign
      );
    }
  }

  /**
   * Handle visitor advancement through funnel stages
   */
  private async handleStageAdvancement(
    visitor: FunnelVisitor,
    oldStage: FunnelStage,
    newStage: FunnelStage
  ): Promise<void> {
    console.log(`📈 Visitor ${visitor.id} advanced: ${oldStage} → ${newStage}`);

    // Trigger stage-specific actions
    switch (newStage) {
      case FunnelStage.INTEREST:
        // Show email capture widget with higher urgency
        this.eventBus.emit('trigger.email-capture', { visitor, urgency: 'medium' });
        break;

      case FunnelStage.CONSIDERATION:
        // Show property recommendations
        this.eventBus.emit('trigger.property-recommendations', visitor);
        break;

      case FunnelStage.INTENT:
        // Show consultation booking or direct contact options
        this.eventBus.emit('trigger.consultation-booking', visitor);
        break;

      case FunnelStage.EVALUATION:
        // Show PROP Choice upsells, financing options
        this.eventBus.emit('trigger.evaluation-support', visitor);
        break;

      case FunnelStage.PURCHASE:
        // Trigger post-purchase follow-up campaigns
        this.eventBus.emit('trigger.post-purchase', visitor);
        break;
    }

    this.eventBus.emit('funnel.stage-advancement', { visitor, oldStage, newStage });
  }

  /**
   * Calculate revenue potential based on visitor characteristics
   */
  private async calculateRevenuePotential(entryData: any): Promise<number> {
    let potential = 100; // Base potential

    // Source-based scoring
    const sourceMultipliers = {
      'google-ads': 2.5,
      'facebook-ads': 2.0,
      'organic-search': 1.8,
      'referral': 1.5,
      'direct': 1.3,
      'social': 1.0
    };

    potential *= sourceMultipliers[entryData.acquisitionSource] || 1.0;

    // Landing page optimization
    if (entryData.landingPage.includes('developer')) {
      potential *= 15; // Developers have much higher value
    } else if (entryData.landingPage.includes('investment')) {
      potential *= 8; // Investors are high value
    } else if (entryData.landingPage.includes('first-time-buyer')) {
      potential *= 3; // First-time buyers are valuable
    }

    // UTM campaign scoring
    if (entryData.utmParams?.campaign?.includes('premium')) {
      potential *= 2.0;
    }

    return Math.round(potential);
  }

  /**
   * Assign A/B test variants to visitors
   */
  private async assignABTestVariant(visitor: FunnelVisitor): Promise<void> {
    const activeTests = Array.from(this.abTests.values())
      .filter(test => test.isActive);

    for (const test of activeTests) {
      const random = Math.random() * 100;
      let cumulative = 0;

      for (const variant of test.variants) {
        cumulative += variant.traffic;
        if (random <= cumulative) {
          // Assign this variant to visitor
          if (!visitor.abTestVariants) {
            (visitor as any).abTestVariants = {};
          }
          (visitor as any).abTestVariants[test.id] = variant.id;
          break;
        }
      }
    }
  }

  /**
   * Update A/B test results with conversion data
   */
  private async updateABTestResults(
    visitor: FunnelVisitor,
    conversion: FunnelConversion
  ): Promise<void> {
    const visitorVariants = (visitor as any).abTestVariants || {};

    for (const [testId, variantId] of Object.entries(visitorVariants)) {
      const test = this.abTests.get(testId);
      if (!test) continue;

      if (!test.results[variantId as string]) {
        test.results[variantId as string] = {
          visitors: 0,
          conversions: 0,
          revenue: 0,
          conversionRate: 0
        };
      }

      const results = test.results[variantId as string];
      results.conversions++;
      results.revenue += conversion.value;
      results.conversionRate = (results.conversions / results.visitors) * 100;
    }
  }

  /**
   * Process revenue collection for conversions
   */
  private async processRevenueConversion(
    visitor: FunnelVisitor,
    conversion: FunnelConversion
  ): Promise<void> {
    try {
      switch (conversion.goal) {
        case ConversionGoal.SUBSCRIPTION_UPGRADE:
          // Process subscription revenue
          const subscriptionValue = conversion.value;
          console.log(`💰 Subscription revenue: €${subscriptionValue}`);
          break;

        case ConversionGoal.PROP_CHOICE_PURCHASE:
          // Calculate and collect PROP Choice commission
          const commission = await revenueEngine.calculatePropChoiceCommission(
            'furniture',
            conversion.value,
            visitor.email || 'anonymous',
            'platform'
          );
          
          await revenueEngine.collectFees(
            [commission],
            `FUNNEL-${conversion.timestamp.getTime()}`,
            'prop-developer',
            { funnelSource: visitor.acquisitionSource }
          );
          break;

        case ConversionGoal.PROPERTY_PURCHASE:
          // Process transaction fees
          const transactionFees = await revenueEngine.calculateTransactionFees(
            'initial_deposit',
            500, // Standard initial deposit
            'card'
          );
          
          await revenueEngine.collectFees(
            transactionFees,
            `FUNNEL-${conversion.timestamp.getTime()}`,
            'prop-developer',
            { funnelSource: visitor.acquisitionSource }
          );
          break;
      }
    } catch (error) {
      console.error('Failed to process revenue conversion:', error);
    }
  }

  /**
   * Trigger follow-up email campaigns based on conversions
   */
  private async triggerFollowUpCampaigns(
    visitor: FunnelVisitor,
    conversion: FunnelConversion
  ): Promise<void> {
    if (!visitor.email || !visitor.category) return;

    try {
      switch (conversion.goal) {
        case ConversionGoal.EMAIL_SIGNUP:
          // Trigger welcome series
          await emailMarketingEngine.createContact(visitor.email);
          break;

        case ConversionGoal.PROPERTY_INQUIRY:
          // Trigger property follow-up sequence
          // Implementation would trigger specific email campaign
          break;

        case ConversionGoal.DEVELOPER_DEMO:
          // Trigger developer onboarding sequence
          // Implementation would trigger developer-specific campaigns
          break;
      }
    } catch (error) {
      console.error('Failed to trigger follow-up campaigns:', error);
    }
  }

  /**
   * Create A/B test for conversion optimization
   */
  async createABTest(
    name: string,
    goal: ConversionGoal,
    variants: Omit<ABTestVariant, 'id'>[]
  ): Promise<ABTest> {
    const testId = `TEST-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    const test: ABTest = {
      id: testId,
      name,
      goal,
      variants: variants.map((v, index) => ({
        ...v,
        id: `${testId}-VAR-${index + 1}`
      })),
      isActive: true,
      startDate: new Date(),
      results: {}
    };

    // Initialize results for each variant
    test.variants.forEach(variant => {
      test.results[variant.id] = {
        visitors: 0,
        conversions: 0,
        revenue: 0,
        conversionRate: 0
      };
    });

    this.abTests.set(testId, test);
    console.log(`🧪 A/B test created: ${name} (${variants.length} variants)`);

    return test;
  }

  /**
   * Get funnel analytics and performance metrics
   */
  getFunnelAnalytics(): Record<string, any> {
    const visitors = Array.from(this.visitors.values());
    const totalVisitors = visitors.length;

    // Stage distribution
    const stageDistribution = Object.values(FunnelStage).reduce((acc, stage) => {
      acc[stage] = visitors.filter(v => v.currentStage === stage).length;
      return acc;
    }, {} as Record<string, number>);

    // Conversion rates by stage
    const conversionRates = {
      awarenessToInterest: this.calculateStageConversionRate(FunnelStage.AWARENESS, FunnelStage.INTEREST),
      interestToConsideration: this.calculateStageConversionRate(FunnelStage.INTEREST, FunnelStage.CONSIDERATION),
      considerationToIntent: this.calculateStageConversionRate(FunnelStage.CONSIDERATION, FunnelStage.INTENT),
      intentToEvaluation: this.calculateStageConversionRate(FunnelStage.INTENT, FunnelStage.EVALUATION),
      evaluationToPurchase: this.calculateStageConversionRate(FunnelStage.EVALUATION, FunnelStage.PURCHASE)
    };

    // Revenue metrics
    const totalRevenue = visitors.reduce((sum, visitor) => {
      return sum + visitor.conversions.reduce((convSum, conv) => convSum + conv.value, 0);
    }, 0);

    const averageRevenuePerVisitor = totalRevenue / totalVisitors;

    // Source performance
    const sourcePerformance = this.calculateSourcePerformance(visitors);

    return {
      totalVisitors,
      stageDistribution,
      conversionRates,
      totalRevenue,
      averageRevenuePerVisitor,
      sourcePerformance,
      overallConversionRate: (stageDistribution[FunnelStage.PURCHASE] / totalVisitors) * 100
    };
  }

  /**
   * Calculate conversion rate between funnel stages
   */
  private calculateStageConversionRate(fromStage: FunnelStage, toStage: FunnelStage): number {
    const visitors = Array.from(this.visitors.values());
    const fromStageVisitors = visitors.filter(v => v.currentStage === fromStage).length;
    const toStageVisitors = visitors.filter(v => v.currentStage === toStage).length;
    
    return fromStageVisitors > 0 ? (toStageVisitors / fromStageVisitors) * 100 : 0;
  }

  /**
   * Calculate performance metrics by acquisition source
   */
  private calculateSourcePerformance(visitors: FunnelVisitor[]): Record<string, any> {
    const sourceStats = visitors.reduce((acc, visitor) => {
      const source = visitor.acquisitionSource;
      if (!acc[source]) {
        acc[source] = { visitors: 0, conversions: 0, revenue: 0 };
      }
      
      acc[source].visitors++;
      acc[source].conversions += visitor.conversions.length;
      acc[source].revenue += visitor.conversions.reduce((sum, conv) => sum + conv.value, 0);
      
      return acc;
    }, {} as Record<string, any>);

    // Calculate conversion rates and ROI
    Object.keys(sourceStats).forEach(source => {
      const stats = sourceStats[source];
      stats.conversionRate = (stats.conversions / stats.visitors) * 100;
      stats.revenuePerVisitor = stats.revenue / stats.visitors;
    });

    return sourceStats;
  }

  /**
   * Subscribe to funnel events
   */
  onFunnelEvent(callback: (event: any) => void) {
    this.eventBus.on('funnel.entry', callback);
    this.eventBus.on('funnel.conversion', callback);
    this.eventBus.on('funnel.stage-advancement', callback);
  }
}

// Export singleton instance
export const acquisitionFunnelEngine = new AcquisitionFunnelEngine();