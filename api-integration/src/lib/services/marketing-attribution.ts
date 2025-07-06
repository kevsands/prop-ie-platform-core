/**
 * Marketing Attribution & Analytics Service
 * Track, analyze, and optimize marketing campaigns and lead sources
 * Comprehensive ROI analysis and conversion attribution
 */

import { EventEmitter } from 'events';

// Types for marketing attribution
export interface MarketingTouch {
  id: string;
  buyerId: string;
  sessionId: string;
  timestamp: Date;
  
  // Channel information
  channel: 'organic_search' | 'paid_search' | 'social_media' | 'email' | 'direct' | 
           'referral' | 'display' | 'video' | 'outdoor' | 'radio' | 'print' | 'event';
  
  // Campaign details
  campaign?: {
    id: string;
    name: string;
    type: 'awareness' | 'consideration' | 'conversion' | 'retention';
    budget: number;
    startDate: Date;
    endDate: Date;
  };
  
  // Source details
  source: {
    platform: string; // Google, Facebook, Daft.ie, etc.
    medium: string; // cpc, organic, social, email, etc.
    campaign: string;
    content?: string;
    keyword?: string;
    placement?: string;
  };
  
  // Touch context
  context: {
    page: string;
    referrer: string;
    userAgent: string;
    device: 'desktop' | 'mobile' | 'tablet';
    location?: string;
    ipAddress?: string;
  };
  
  // Attribution data
  attribution: {
    touchPosition: number; // 1st, 2nd, 3rd touch, etc.
    timeSinceFirst: number; // milliseconds since first touch
    timeSinceLast: number; // milliseconds since last touch
    touchType: 'first' | 'middle' | 'last' | 'only';
  };
  
  // Conversion data (if applicable)
  conversion?: {
    type: 'lead' | 'viewing' | 'application' | 'reservation' | 'purchase';
    value: number;
    propertyId?: string;
    revenue?: number;
  };
}

export interface AttributionModel {
  id: string;
  name: string;
  type: 'first_touch' | 'last_touch' | 'linear' | 'time_decay' | 'position_based' | 'data_driven';
  description: string;
  weights: { [position: string]: number };
  lookbackWindow: number; // days
}

export interface CampaignPerformance {
  campaignId: string;
  campaignName: string;
  channel: string;
  
  // Investment metrics
  budget: number;
  spent: number;
  
  // Engagement metrics
  impressions: number;
  clicks: number;
  sessions: number;
  uniqueVisitors: number;
  
  // Conversion metrics
  leads: number;
  qualifiedLeads: number;
  viewings: number;
  applications: number;
  sales: number;
  
  // Financial metrics
  revenue: number;
  roas: number; // Return on Ad Spend
  roi: number; // Return on Investment
  cpl: number; // Cost Per Lead
  cpa: number; // Cost Per Acquisition
  ltv: number; // Lifetime Value
  
  // Attribution metrics
  firstTouchConversions: number;
  lastTouchConversions: number;
  assistedConversions: number;
  attributedRevenue: { [model: string]: number };
  
  // Time metrics
  period: {
    start: Date;
    end: Date;
  };
}

export interface LeadAttribution {
  buyerId: string;
  
  // Journey overview
  firstTouch: MarketingTouch;
  lastTouch: MarketingTouch;
  touchCount: number;
  journeyDuration: number; // days
  
  // All touchpoints
  touches: MarketingTouch[];
  
  // Conversion details
  conversion?: {
    type: string;
    value: number;
    revenue: number;
    date: Date;
    propertyId: string;
  };
  
  // Attribution scores per model
  attributionScores: { [modelId: string]: { [touchId: string]: number } };
}

export interface ChannelPerformance {
  channel: string;
  
  // Volume metrics
  visits: number;
  uniqueVisitors: number;
  sessions: number;
  pageViews: number;
  
  // Engagement metrics
  averageSessionDuration: number;
  bounceRate: number;
  pagesPerSession: number;
  
  // Conversion metrics
  conversions: number;
  conversionRate: number;
  revenue: number;
  
  // Cost metrics (where applicable)
  cost: number;
  costPerVisit: number;
  costPerConversion: number;
  
  // Attribution analysis
  firstTouchShare: number;
  lastTouchShare: number;
  assistedConversions: number;
}

class MarketingAttributionService extends EventEmitter {
  private touches: Map<string, MarketingTouch[]> = new Map(); // buyerId -> touches
  private campaigns: Map<string, CampaignPerformance> = new Map();
  private attributionModels: Map<string, AttributionModel> = new Map();
  
  constructor() {
    super();
    this.initializeAttributionModels();
    this.initializeFitzgeraldGardensCampaigns();
    this.startAnalyticsProcessing();
  }

  /**
   * Track marketing touch for buyer journey
   */
  async trackMarketingTouch(touchData: {
    buyerId: string;
    sessionId: string;
    channel: MarketingTouch['channel'];
    source: MarketingTouch['source'];
    context: MarketingTouch['context'];
    conversion?: MarketingTouch['conversion'];
  }): Promise<MarketingTouch> {
    try {
      const touchId = `touch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Get existing touches for buyer
      const existingTouches = this.touches.get(touchData.buyerId) || [];
      
      // Calculate attribution data
      const attribution = this.calculateAttribution(existingTouches, new Date());
      
      const touch: MarketingTouch = {
        id: touchId,
        buyerId: touchData.buyerId,
        sessionId: touchData.sessionId,
        timestamp: new Date(),
        channel: touchData.channel,
        source: touchData.source,
        context: touchData.context,
        attribution,
        conversion: touchData.conversion
      };

      // Add to buyer's journey
      existingTouches.push(touch);
      this.touches.set(touchData.buyerId, existingTouches);

      // Process attribution if conversion occurred
      if (touch.conversion) {
        await this.processConversionAttribution(touch);
      }

      // Update campaign performance
      await this.updateCampaignMetrics(touch);

      // Emit tracking event
      this.emit('touch-tracked', touch);

      console.log(`📊 Marketing touch tracked: ${touch.channel} for buyer ${touchData.buyerId}`);

      return touch;
      
    } catch (error) {
      console.error('Error tracking marketing touch:', error);
      throw error;
    }
  }

  /**
   * Get comprehensive lead attribution analysis
   */
  getLeadAttribution(buyerId: string): LeadAttribution | null {
    const touches = this.touches.get(buyerId);
    if (!touches || touches.length === 0) {
      return null;
    }

    const firstTouch = touches[0];
    const lastTouch = touches[touches.length - 1];
    const conversion = touches.find(t => t.conversion)?.conversion;

    // Calculate attribution scores for each model
    const attributionScores: { [modelId: string]: { [touchId: string]: number } } = {};
    
    for (const [modelId, model] of this.attributionModels.entries()) {
      attributionScores[modelId] = this.calculateAttributionScores(touches, model);
    }

    const attribution: LeadAttribution = {
      buyerId,
      firstTouch,
      lastTouch,
      touchCount: touches.length,
      journeyDuration: Math.ceil((lastTouch.timestamp.getTime() - firstTouch.timestamp.getTime()) / (24 * 60 * 60 * 1000)),
      touches,
      conversion,
      attributionScores
    };

    return attribution;
  }

  /**
   * Get campaign performance analytics
   */
  getCampaignPerformance(campaignId?: string, timeframe?: { start: Date; end: Date }): CampaignPerformance[] {
    let campaigns = Array.from(this.campaigns.values());
    
    if (campaignId) {
      campaigns = campaigns.filter(c => c.campaignId === campaignId);
    }
    
    if (timeframe) {
      campaigns = campaigns.filter(c => 
        c.period.start >= timeframe.start && c.period.end <= timeframe.end
      );
    }
    
    return campaigns.sort((a, b) => b.roas - a.roas); // Sort by ROAS desc
  }

  /**
   * Get channel performance analysis
   */
  getChannelPerformance(timeframe?: { start: Date; end: Date }): ChannelPerformance[] {
    const channels: { [channel: string]: ChannelPerformance } = {};
    
    // Aggregate data from all touches
    for (const touches of this.touches.values()) {
      const filteredTouches = timeframe 
        ? touches.filter(t => t.timestamp >= timeframe.start && t.timestamp <= timeframe.end)
        : touches;
      
      for (const touch of filteredTouches) {
        if (!channels[touch.channel]) {
          channels[touch.channel] = {
            channel: touch.channel,
            visits: 0,
            uniqueVisitors: 0,
            sessions: 0,
            pageViews: 0,
            averageSessionDuration: 0,
            bounceRate: 0,
            pagesPerSession: 0,
            conversions: 0,
            conversionRate: 0,
            revenue: 0,
            cost: 0,
            costPerVisit: 0,
            costPerConversion: 0,
            firstTouchShare: 0,
            lastTouchShare: 0,
            assistedConversions: 0
          };
        }
        
        const channel = channels[touch.channel];
        channel.visits++;
        
        if (touch.conversion) {
          channel.conversions++;
          channel.revenue += touch.conversion.revenue || 0;
        }
        
        if (touch.attribution.touchType === 'first') {
          channel.firstTouchShare++;
        }
        
        if (touch.attribution.touchType === 'last') {
          channel.lastTouchShare++;
        }
      }
    }
    
    // Calculate derived metrics
    for (const channel of Object.values(channels)) {
      channel.conversionRate = channel.visits > 0 ? (channel.conversions / channel.visits) * 100 : 0;
      channel.costPerVisit = channel.visits > 0 ? channel.cost / channel.visits : 0;
      channel.costPerConversion = channel.conversions > 0 ? channel.cost / channel.conversions : 0;
    }
    
    return Object.values(channels).sort((a, b) => b.revenue - a.revenue);
  }

  /**
   * Get multi-touch attribution analysis
   */
  getMultiTouchAttribution(modelId: string, timeframe?: { start: Date; end: Date }): {
    model: AttributionModel;
    results: { [channel: string]: { touches: number; attributedRevenue: number; attributedConversions: number } };
    totalRevenue: number;
    totalConversions: number;
  } {
    const model = this.attributionModels.get(modelId);
    if (!model) {
      throw new Error(`Attribution model ${modelId} not found`);
    }

    const results: { [channel: string]: { touches: number; attributedRevenue: number; attributedConversions: number } } = {};
    let totalRevenue = 0;
    let totalConversions = 0;

    // Process all buyer journeys
    for (const [buyerId, touches] of this.touches.entries()) {
      const filteredTouches = timeframe 
        ? touches.filter(t => t.timestamp >= timeframe.start && t.timestamp <= timeframe.end)
        : touches;
      
      const attribution = this.getLeadAttribution(buyerId);
      if (!attribution || !attribution.conversion) continue;

      const scores = attribution.attributionScores[modelId];
      if (!scores) continue;

      totalRevenue += attribution.conversion.revenue;
      totalConversions++;

      // Distribute attribution across touchpoints
      for (const touch of filteredTouches) {
        const score = scores[touch.id] || 0;
        
        if (!results[touch.channel]) {
          results[touch.channel] = { touches: 0, attributedRevenue: 0, attributedConversions: 0 };
        }
        
        results[touch.channel].touches++;
        results[touch.channel].attributedRevenue += attribution.conversion.revenue * score;
        results[touch.channel].attributedConversions += score;
      }
    }

    return {
      model,
      results,
      totalRevenue,
      totalConversions
    };
  }

  /**
   * Get ROI analysis by campaign
   */
  getROIAnalysis(timeframe?: { start: Date; end: Date }): {
    totalSpent: number;
    totalRevenue: number;
    overallROI: number;
    campaigns: Array<{
      campaignId: string;
      campaignName: string;
      spent: number;
      revenue: number;
      roi: number;
      roas: number;
      efficiency: 'excellent' | 'good' | 'average' | 'poor';
    }>;
  } {
    const campaigns = this.getCampaignPerformance(undefined, timeframe);
    
    const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
    const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
    const overallROI = totalSpent > 0 ? ((totalRevenue - totalSpent) / totalSpent) * 100 : 0;

    const campaignROI = campaigns.map(campaign => ({
      campaignId: campaign.campaignId,
      campaignName: campaign.campaignName,
      spent: campaign.spent,
      revenue: campaign.revenue,
      roi: campaign.roi,
      roas: campaign.roas,
      efficiency: this.getEfficiencyRating(campaign.roas)
    }));

    return {
      totalSpent,
      totalRevenue,
      overallROI,
      campaigns: campaignROI
    };
  }

  // Private helper methods

  private calculateAttribution(existingTouches: MarketingTouch[], currentTime: Date): MarketingTouch['attribution'] {
    const touchPosition = existingTouches.length + 1;
    const firstTouchTime = existingTouches.length > 0 ? existingTouches[0].timestamp.getTime() : currentTime.getTime();
    const lastTouchTime = existingTouches.length > 0 ? existingTouches[existingTouches.length - 1].timestamp.getTime() : currentTime.getTime();
    
    let touchType: MarketingTouch['attribution']['touchType'];
    if (existingTouches.length === 0) {
      touchType = 'first';
    } else {
      touchType = 'middle'; // Will be updated to 'last' when conversion happens
    }

    return {
      touchPosition,
      timeSinceFirst: currentTime.getTime() - firstTouchTime,
      timeSinceLast: currentTime.getTime() - lastTouchTime,
      touchType
    };
  }

  private calculateAttributionScores(touches: MarketingTouch[], model: AttributionModel): { [touchId: string]: number } {
    const scores: { [touchId: string]: number } = {};
    
    if (touches.length === 0) return scores;
    
    switch (model.type) {
      case 'first_touch':
        scores[touches[0].id] = 1.0;
        break;
        
      case 'last_touch':
        scores[touches[touches.length - 1].id] = 1.0;
        break;
        
      case 'linear':
        const linearWeight = 1.0 / touches.length;
        touches.forEach(touch => {
          scores[touch.id] = linearWeight;
        });
        break;
        
      case 'position_based':
        if (touches.length === 1) {
          scores[touches[0].id] = 1.0;
        } else if (touches.length === 2) {
          scores[touches[0].id] = 0.5;
          scores[touches[1].id] = 0.5;
        } else {
          scores[touches[0].id] = 0.4; // First touch gets 40%
          scores[touches[touches.length - 1].id] = 0.4; // Last touch gets 40%
          const middleWeight = 0.2 / (touches.length - 2); // Middle touches split 20%
          for (let i = 1; i < touches.length - 1; i++) {
            scores[touches[i].id] = middleWeight;
          }
        }
        break;
        
      case 'time_decay':
        const now = new Date().getTime();
        const halfLife = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
        let totalWeight = 0;
        
        // Calculate weights
        touches.forEach(touch => {
          const timeDiff = now - touch.timestamp.getTime();
          const weight = Math.pow(0.5, timeDiff / halfLife);
          scores[touch.id] = weight;
          totalWeight += weight;
        });
        
        // Normalize to sum to 1
        if (totalWeight > 0) {
          touches.forEach(touch => {
            scores[touch.id] = scores[touch.id] / totalWeight;
          });
        }
        break;
    }
    
    return scores;
  }

  private async processConversionAttribution(touch: MarketingTouch): Promise<void> {
    if (!touch.conversion) return;
    
    // Update last touch type
    const buyerTouches = this.touches.get(touch.buyerId) || [];
    if (buyerTouches.length > 0) {
      buyerTouches[buyerTouches.length - 1].attribution.touchType = 'last';
    }
    
    // Emit conversion event
    this.emit('conversion-attributed', {
      buyerId: touch.buyerId,
      conversionType: touch.conversion.type,
      revenue: touch.conversion.revenue,
      attributedTouch: touch
    });
  }

  private async updateCampaignMetrics(touch: MarketingTouch): Promise<void> {
    // Update campaign performance metrics
    // This would integrate with actual campaign management systems
    console.log(`📈 Campaign metrics updated for ${touch.source.campaign}`);
  }

  private getEfficiencyRating(roas: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (roas >= 5.0) return 'excellent';
    if (roas >= 3.0) return 'good';
    if (roas >= 1.5) return 'average';
    return 'poor';
  }

  private initializeAttributionModels(): void {
    const models: AttributionModel[] = [
      {
        id: 'first_touch',
        name: 'First Touch',
        type: 'first_touch',
        description: 'Gives 100% credit to the first marketing touchpoint',
        weights: { '1': 1.0 },
        lookbackWindow: 90
      },
      {
        id: 'last_touch',
        name: 'Last Touch',
        type: 'last_touch',
        description: 'Gives 100% credit to the last marketing touchpoint',
        weights: { 'last': 1.0 },
        lookbackWindow: 90
      },
      {
        id: 'linear',
        name: 'Linear',
        type: 'linear',
        description: 'Distributes credit equally across all touchpoints',
        weights: {},
        lookbackWindow: 90
      },
      {
        id: 'position_based',
        name: 'Position Based',
        type: 'position_based',
        description: 'Gives 40% to first, 40% to last, 20% to middle touchpoints',
        weights: { 'first': 0.4, 'last': 0.4, 'middle': 0.2 },
        lookbackWindow: 90
      },
      {
        id: 'time_decay',
        name: 'Time Decay',
        type: 'time_decay',
        description: 'Gives more credit to touchpoints closer to conversion',
        weights: {},
        lookbackWindow: 90
      }
    ];

    models.forEach(model => {
      this.attributionModels.set(model.id, model);
    });

    console.log(`📊 ${models.length} attribution models initialized`);
  }

  private initializeFitzgeraldGardensCampaigns(): void {
    // Initialize sample campaign data for Fitzgerald Gardens
    const campaigns: CampaignPerformance[] = [
      {
        campaignId: 'fg-google-search',
        campaignName: 'Fitzgerald Gardens - Google Search',
        channel: 'paid_search',
        budget: 15000,
        spent: 12800,
        impressions: 485000,
        clicks: 2340,
        sessions: 2180,
        uniqueVisitors: 1950,
        leads: 127,
        qualifiedLeads: 89,
        viewings: 31,
        applications: 18,
        sales: 8,
        revenue: 3360000,
        roas: 262.5, // €262.50 revenue per €1 spent
        roi: 26150, // 26,150% ROI
        cpl: 100.79, // €100.79 per lead
        cpa: 1600, // €1,600 per acquisition
        ltv: 420000, // Average unit price
        firstTouchConversions: 5,
        lastTouchConversions: 3,
        assistedConversions: 12,
        attributedRevenue: {
          'first_touch': 2100000,
          'last_touch': 1260000,
          'linear': 1680000,
          'position_based': 1890000
        },
        period: {
          start: new Date('2024-06-01'),
          end: new Date('2024-06-30')
        }
      },
      {
        campaignId: 'fg-facebook-social',
        campaignName: 'Fitzgerald Gardens - Facebook/Instagram',
        channel: 'social_media',
        budget: 8000,
        spent: 7200,
        impressions: 1200000,
        clicks: 4800,
        sessions: 4320,
        uniqueVisitors: 3890,
        leads: 78,
        qualifiedLeads: 52,
        viewings: 19,
        applications: 11,
        sales: 3,
        revenue: 1260000,
        roas: 175.0,
        roi: 17400,
        cpl: 92.31,
        cpa: 2400,
        ltv: 420000,
        firstTouchConversions: 2,
        lastTouchConversions: 1,
        assistedConversions: 8,
        attributedRevenue: {
          'first_touch': 840000,
          'last_touch': 420000,
          'linear': 630000,
          'position_based': 735000
        },
        period: {
          start: new Date('2024-06-01'),
          end: new Date('2024-06-30')
        }
      },
      {
        campaignId: 'fg-daft-display',
        campaignName: 'Fitzgerald Gardens - Daft.ie Premium',
        channel: 'display',
        budget: 5000,
        spent: 4800,
        impressions: 350000,
        clicks: 1750,
        sessions: 1600,
        uniqueVisitors: 1420,
        leads: 34,
        qualifiedLeads: 28,
        viewings: 12,
        applications: 8,
        sales: 1,
        revenue: 520000,
        roas: 108.33,
        roi: 10733,
        cpl: 141.18,
        cpa: 4800,
        ltv: 520000,
        firstTouchConversions: 1,
        lastTouchConversions: 0,
        assistedConversions: 4,
        attributedRevenue: {
          'first_touch': 520000,
          'last_touch': 0,
          'linear': 260000,
          'position_based': 390000
        },
        period: {
          start: new Date('2024-06-01'),
          end: new Date('2024-06-30')
        }
      }
    ];

    campaigns.forEach(campaign => {
      this.campaigns.set(campaign.campaignId, campaign);
    });

    console.log(`🎯 ${campaigns.length} campaign performance records initialized`);
  }

  private startAnalyticsProcessing(): void {
    // Process attribution analytics every hour
    setInterval(() => {
      this.processAttributionAnalytics();
    }, 60 * 60 * 1000);

    console.log('📊 Marketing attribution analytics processing started');
  }

  private processAttributionAnalytics(): void {
    // Process and update attribution analytics
    const totalTouches = Array.from(this.touches.values()).reduce((sum, touches) => sum + touches.length, 0);
    console.log(`📈 Processed attribution for ${totalTouches} marketing touches`);
  }
}

// Export global instance
export const marketingAttributionService = new MarketingAttributionService();
export default MarketingAttributionService;