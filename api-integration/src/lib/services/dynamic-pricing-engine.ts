/**
 * Dynamic Pricing Engine
 * AI-powered demand-based pricing optimization for maximum revenue
 * Real-time price adjustments based on market signals and buyer behavior
 */

import { EventEmitter } from 'events';

// Types for dynamic pricing
export interface PricingFactors {
  basePrice: number;
  demandLevel: 'low' | 'medium' | 'high' | 'critical';
  inventoryLevel: number; // remaining units
  totalInventory: number;
  competitorPricing: number[];
  marketTrends: 'declining' | 'stable' | 'rising' | 'hot';
  timeOnMarket: number; // days
  viewingActivity: number;
  interestExpressions: number;
  seasonality: number; // 0.8-1.2 multiplier
  locationPremium: number; // 0.9-1.3 multiplier
}

export interface PricingRecommendation {
  unitId: string;
  currentPrice: number;
  recommendedPrice: number;
  priceChange: number; // absolute change
  priceChangePercent: number;
  confidence: number; // 0-100
  reasoning: string[];
  urgency: 'low' | 'medium' | 'high' | 'immediate';
  validUntil: Date;
  marketPosition: 'below_market' | 'at_market' | 'premium' | 'luxury';
  expectedImpact: {
    demandIncrease: number; // percentage
    timeToSaleReduction: number; // days
    revenueImpact: number; // euros
  };
}

export interface MarketIntelligence {
  developmentId: string;
  averagePrice: number;
  medianPrice: number;
  pricePerSqm: number;
  marketVelocity: number; // units sold per week
  demandToSupplyRatio: number;
  competitorAnalysis: {
    similarDevelopments: string[];
    priceComparison: number; // percentage vs market
    competitiveAdvantage: string[];
  };
  buyerBehavior: {
    averageTimeToDecision: number; // days
    priceElasticity: number;
    featureValueMap: { [feature: string]: number };
  };
}

export interface PricingStrategy {
  strategy: 'aggressive' | 'balanced' | 'premium' | 'clearance';
  description: string;
  targetMargin: number;
  maxDiscountPercent: number;
  maxPremiumPercent: number;
  priceUpdateFrequency: number; // hours
}

class DynamicPricingEngine extends EventEmitter {
  private pricingHistory: Map<string, PricingRecommendation[]> = new Map();
  private marketIntelligence: Map<string, MarketIntelligence> = new Map();
  private activeStrategies: Map<string, PricingStrategy> = new Map();
  
  // Pricing algorithms configuration
  private algorithms = {
    demandMultipliers: {
      'low': 0.95,      // 5% discount for low demand
      'medium': 1.0,    // base price
      'high': 1.08,     // 8% premium for high demand
      'critical': 1.15  // 15% premium for critical demand
    },
    inventoryMultipliers: {
      scarcity: {
        '0.1': 1.20,  // Last 10% of units - 20% premium
        '0.2': 1.15,  // Last 20% of units - 15% premium
        '0.3': 1.10,  // Last 30% of units - 10% premium
        '0.5': 1.05,  // Last 50% of units - 5% premium
        '1.0': 1.00   // Full inventory - base price
      }
    },
    competitorAdjustments: {
      'significantly_below': 1.12,  // 12% premium when significantly below market
      'below': 1.06,               // 6% premium when below market
      'at_market': 1.00,           // base price at market level
      'above': 0.97,               // 3% discount when above market
      'significantly_above': 0.92   // 8% discount when significantly above market
    }
  };

  constructor() {
    super();
    this.initializeFitzgeraldGardensData();
    this.startPricingEngine();
  }

  /**
   * Initialize market intelligence for Fitzgerald Gardens
   */
  private initializeFitzgeraldGardensData() {
    const fitzgeraldIntelligence: MarketIntelligence = {
      developmentId: 'fitzgerald-gardens',
      averagePrice: 442000,
      medianPrice: 435000,
      pricePerSqm: 4850,
      marketVelocity: 1.2, // 1.2 units per week (strong demand)
      demandToSupplyRatio: 2.8, // 2.8 buyers per available unit
      competitorAnalysis: {
        similarDevelopments: ['ballymakenny-view', 'riverside-gardens', 'drogheda-central'],
        priceComparison: 1.05, // 5% above average market
        competitiveAdvantage: [
          'Phase 1 premium location',
          'Government backing (12 units sold)',
          'Modern energy-efficient design',
          'HTB eligibility',
          'Excellent transport links'
        ]
      },
      buyerBehavior: {
        averageTimeToDecision: 14, // 2 weeks average
        priceElasticity: 0.7, // relatively inelastic (quality development)
        featureValueMap: {
          'balcony': 8000,
          'parking_space': 15000,
          'energy_rating_a': 12000,
          'penthouse': 35000,
          'corner_unit': 5000,
          'garden_level': -3000
        }
      }
    };

    this.marketIntelligence.set('fitzgerald-gardens', fitzgeraldIntelligence);

    // Set balanced strategy for Phase 1 sales
    const strategy: PricingStrategy = {
      strategy: 'balanced',
      description: 'Balanced approach maximizing both velocity and revenue for Phase 1 completion',
      targetMargin: 0.18, // 18% margin target
      maxDiscountPercent: 8, // Max 8% discount
      maxPremiumPercent: 20, // Max 20% premium for penthouses
      priceUpdateFrequency: 24 // Update prices daily
    };

    this.activeStrategies.set('fitzgerald-gardens', strategy);
  }

  /**
   * Calculate dynamic pricing recommendation for a unit
   */
  async calculatePricingRecommendation(
    unitId: string,
    developmentId: string,
    factors: PricingFactors
  ): Promise<PricingRecommendation> {
    try {
      const intelligence = this.marketIntelligence.get(developmentId);
      const strategy = this.activeStrategies.get(developmentId);
      
      if (!intelligence || !strategy) {
        throw new Error(`No market intelligence or strategy found for ${developmentId}`);
      }

      // Calculate base pricing adjustments
      let priceMultiplier = 1.0;
      let reasoning: string[] = [];

      // 1. Demand-based adjustment
      const demandMultiplier = this.algorithms.demandMultipliers[factors.demandLevel];
      priceMultiplier *= demandMultiplier;
      reasoning.push(`Demand level: ${factors.demandLevel} (${((demandMultiplier - 1) * 100).toFixed(1)}% adjustment)`);

      // 2. Inventory scarcity adjustment
      const inventoryRatio = factors.inventoryLevel / factors.totalInventory;
      const scarcityMultiplier = this.getScarcityMultiplier(inventoryRatio);
      priceMultiplier *= scarcityMultiplier;
      if (scarcityMultiplier > 1.0) {
        reasoning.push(`Inventory scarcity: ${Math.round(inventoryRatio * 100)}% remaining (+${((scarcityMultiplier - 1) * 100).toFixed(1)}%)`);
      }

      // 3. Market trends adjustment
      const trendMultiplier = this.getTrendMultiplier(factors.marketTrends);
      priceMultiplier *= trendMultiplier;
      if (trendMultiplier !== 1.0) {
        reasoning.push(`Market trend: ${factors.marketTrends} (${((trendMultiplier - 1) * 100).toFixed(1)}% adjustment)`);
      }

      // 4. Activity-based adjustment
      const activityMultiplier = this.getActivityMultiplier(factors.viewingActivity, factors.interestExpressions);
      priceMultiplier *= activityMultiplier;
      if (activityMultiplier > 1.0) {
        reasoning.push(`High buyer activity: ${factors.viewingActivity} viewings, ${factors.interestExpressions} interests (+${((activityMultiplier - 1) * 100).toFixed(1)}%)`);
      }

      // 5. Time on market adjustment
      const timeMultiplier = this.getTimeOnMarketMultiplier(factors.timeOnMarket);
      priceMultiplier *= timeMultiplier;
      if (timeMultiplier < 1.0) {
        reasoning.push(`Time on market: ${factors.timeOnMarket} days (${((timeMultiplier - 1) * 100).toFixed(1)}% adjustment)`);
      }

      // 6. Seasonal and location adjustments
      priceMultiplier *= factors.seasonality * factors.locationPremium;

      // Apply strategy constraints
      const maxMultiplier = 1 + (strategy.maxPremiumPercent / 100);
      const minMultiplier = 1 - (strategy.maxDiscountPercent / 100);
      priceMultiplier = Math.max(minMultiplier, Math.min(maxMultiplier, priceMultiplier));

      // Calculate final recommendation
      const recommendedPrice = Math.round(factors.basePrice * priceMultiplier);
      const priceChange = recommendedPrice - factors.currentPrice;
      const priceChangePercent = (priceChange / factors.currentPrice) * 100;

      // Calculate confidence based on data quality and market conditions
      const confidence = this.calculateConfidence(factors, intelligence);

      // Determine urgency
      const urgency = this.determineUrgency(factors, priceChangePercent);

      // Calculate expected impact
      const expectedImpact = this.calculateExpectedImpact(
        factors,
        priceChangePercent,
        intelligence
      );

      // Determine market position
      const marketPosition = this.determineMarketPosition(recommendedPrice, intelligence);

      const recommendation: PricingRecommendation = {
        unitId,
        currentPrice: factors.currentPrice,
        recommendedPrice,
        priceChange,
        priceChangePercent,
        confidence,
        reasoning,
        urgency,
        validUntil: new Date(Date.now() + strategy.priceUpdateFrequency * 60 * 60 * 1000),
        marketPosition,
        expectedImpact
      };

      // Store in history
      this.addToHistory(unitId, recommendation);

      // Emit pricing event
      this.emit('pricing-recommendation', recommendation);

      return recommendation;

    } catch (error) {
      console.error('Error calculating pricing recommendation:', error);
      throw error;
    }
  }

  /**
   * Get bulk pricing recommendations for all units in a development
   */
  async getBulkPricingRecommendations(
    developmentId: string,
    units: Array<{
      unitId: string;
      currentPrice: number;
      basePrice: number;
      viewingActivity: number;
      interestExpressions: number;
      timeOnMarket: number;
      features: string[];
    }>
  ): Promise<PricingRecommendation[]> {
    const intelligence = this.marketIntelligence.get(developmentId);
    if (!intelligence) {
      throw new Error(`No market intelligence found for ${developmentId}`);
    }

    const totalUnits = units.length;
    const demandLevel = this.calculateOverallDemand(units);
    
    const recommendations: PricingRecommendation[] = [];

    for (const unit of units) {
      // Calculate location premium based on unit features
      const locationPremium = this.calculateLocationPremium(unit.features, intelligence);
      
      const factors: PricingFactors = {
        basePrice: unit.basePrice,
        demandLevel,
        inventoryLevel: units.length, // All units still available
        totalInventory: 27, // Total Fitzgerald Gardens Phase 1
        competitorPricing: [415000, 435000, 445000, 465000], // Sample competitor prices
        marketTrends: 'rising',
        timeOnMarket: unit.timeOnMarket,
        viewingActivity: unit.viewingActivity,
        interestExpressions: unit.interestExpressions,
        seasonality: this.getSeasonalityFactor(),
        locationPremium
      };

      const recommendation = await this.calculatePricingRecommendation(
        unit.unitId,
        developmentId,
        factors
      );

      recommendations.push(recommendation);
    }

    return recommendations.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Get market intelligence summary
   */
  getMarketIntelligence(developmentId: string): MarketIntelligence | null {
    return this.marketIntelligence.get(developmentId) || null;
  }

  /**
   * Update pricing strategy
   */
  updatePricingStrategy(developmentId: string, strategy: PricingStrategy): void {
    this.activeStrategies.set(developmentId, strategy);
    this.emit('strategy-updated', { developmentId, strategy });
  }

  /**
   * Get pricing history for a unit
   */
  getPricingHistory(unitId: string): PricingRecommendation[] {
    return this.pricingHistory.get(unitId) || [];
  }

  // Private helper methods

  private getScarcityMultiplier(inventoryRatio: number): number {
    const scarcityLevels = this.algorithms.inventoryMultipliers.scarcity;
    
    if (inventoryRatio <= 0.1) return scarcityLevels['0.1'];
    if (inventoryRatio <= 0.2) return scarcityLevels['0.2'];
    if (inventoryRatio <= 0.3) return scarcityLevels['0.3'];
    if (inventoryRatio <= 0.5) return scarcityLevels['0.5'];
    return scarcityLevels['1.0'];
  }

  private getTrendMultiplier(trend: PricingFactors['marketTrends']): number {
    switch (trend) {
      case 'declining': return 0.97;
      case 'stable': return 1.0;
      case 'rising': return 1.03;
      case 'hot': return 1.08;
      default: return 1.0;
    }
  }

  private getActivityMultiplier(viewings: number, interests: number): number {
    const activityScore = (viewings * 0.6) + (interests * 0.4);
    
    if (activityScore >= 20) return 1.12; // Very high activity
    if (activityScore >= 15) return 1.08; // High activity
    if (activityScore >= 10) return 1.04; // Medium activity
    if (activityScore >= 5) return 1.00;  // Normal activity
    return 0.98; // Low activity
  }

  private getTimeOnMarketMultiplier(days: number): number {
    if (days <= 7) return 1.02;   // New listing premium
    if (days <= 30) return 1.0;   // Normal timeframe
    if (days <= 60) return 0.98;  // Slight discount
    if (days <= 90) return 0.95;  // Moderate discount
    return 0.92; // Significant discount for stale listings
  }

  private calculateOverallDemand(units: any[]): PricingFactors['demandLevel'] {
    const totalActivity = units.reduce((sum, unit) => 
      sum + unit.viewingActivity + unit.interestExpressions, 0
    );
    const averageActivity = totalActivity / units.length;

    if (averageActivity >= 20) return 'critical';
    if (averageActivity >= 15) return 'high';
    if (averageActivity >= 8) return 'medium';
    return 'low';
  }

  private calculateLocationPremium(features: string[], intelligence: MarketIntelligence): number {
    let premium = 1.0;
    
    features.forEach(feature => {
      const featureValue = intelligence.buyerBehavior.featureValueMap[feature];
      if (featureValue) {
        premium += featureValue / 500000; // Normalize feature value
      }
    });

    return Math.max(0.9, Math.min(1.3, premium));
  }

  private getSeasonalityFactor(): number {
    const month = new Date().getMonth();
    
    // Irish property market seasonality
    if (month >= 2 && month <= 5) return 1.15; // Spring peak (Mar-Jun)
    if (month >= 6 && month <= 8) return 1.05; // Summer
    if (month >= 9 && month <= 10) return 1.10; // Autumn activity
    return 0.95; // Winter slowdown
  }

  private calculateConfidence(factors: PricingFactors, intelligence: MarketIntelligence): number {
    let confidence = 70; // Base confidence

    // Data quality factors
    if (factors.viewingActivity >= 5) confidence += 10;
    if (factors.interestExpressions >= 3) confidence += 10;
    if (factors.timeOnMarket <= 30) confidence += 5;
    
    // Market factors
    if (intelligence.demandToSupplyRatio > 2.0) confidence += 10;
    if (factors.demandLevel === 'high' || factors.demandLevel === 'critical') confidence += 5;

    return Math.min(95, confidence);
  }

  private determineUrgency(factors: PricingFactors, priceChangePercent: number): PricingRecommendation['urgency'] {
    if (Math.abs(priceChangePercent) >= 10) return 'immediate';
    if (Math.abs(priceChangePercent) >= 5) return 'high';
    if (Math.abs(priceChangePercent) >= 2) return 'medium';
    return 'low';
  }

  private calculateExpectedImpact(
    factors: PricingFactors,
    priceChangePercent: number,
    intelligence: MarketIntelligence
  ): PricingRecommendation['expectedImpact'] {
    // Simplified impact calculation based on price elasticity
    const elasticity = intelligence.buyerBehavior.priceElasticity;
    
    const demandIncrease = -priceChangePercent * elasticity * 0.8;
    const timeToSaleReduction = demandIncrease > 0 ? demandIncrease * 0.5 : 0;
    const revenueImpact = factors.currentPrice * (priceChangePercent / 100);

    return {
      demandIncrease: Math.round(demandIncrease * 100) / 100,
      timeToSaleReduction: Math.round(timeToSaleReduction),
      revenueImpact: Math.round(revenueImpact)
    };
  }

  private determineMarketPosition(price: number, intelligence: MarketIntelligence): PricingRecommendation['marketPosition'] {
    const marketRatio = price / intelligence.averagePrice;
    
    if (marketRatio <= 0.90) return 'below_market';
    if (marketRatio <= 1.10) return 'at_market';
    if (marketRatio <= 1.25) return 'premium';
    return 'luxury';
  }

  private addToHistory(unitId: string, recommendation: PricingRecommendation): void {
    if (!this.pricingHistory.has(unitId)) {
      this.pricingHistory.set(unitId, []);
    }
    
    const history = this.pricingHistory.get(unitId)!;
    history.unshift(recommendation);
    
    // Keep only last 30 recommendations
    if (history.length > 30) {
      history.splice(30);
    }
  }

  private startPricingEngine(): void {
    // Update pricing recommendations every 24 hours
    setInterval(() => {
      this.emit('pricing-update-cycle');
      console.log('🎯 Dynamic pricing engine: Daily pricing cycle initiated');
    }, 24 * 60 * 60 * 1000);

    console.log('🚀 Dynamic pricing engine initialized for Fitzgerald Gardens');
  }
}

// Export global instance
export const dynamicPricingEngine = new DynamicPricingEngine();
export default DynamicPricingEngine;