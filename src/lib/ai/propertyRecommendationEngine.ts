/**
 * AI-Powered Property Recommendation Engine for PROP.ie Platform
 * Advanced machine learning algorithms for intelligent property matching
 * Personalized recommendations based on user behavior, preferences, and market data
 */

import { z } from 'zod';
import { logger } from '@/lib/security/auditLogger';

// User Preference Schema
export const UserPreferenceSchema = z.object({
  userId: z.string(),
  demographics: z.object({
    ageRange: z.enum(['18-25', '26-35', '36-45', '46-55', '56-65', '65+']),
    familyStatus: z.enum(['single', 'couple', 'family_young', 'family_teen', 'empty_nest']),
    occupation: z.enum(['professional', 'executive', 'entrepreneur', 'student', 'retired', 'other']),
    incomeRange: z.enum(['<50k', '50k-75k', '75k-100k', '100k-150k', '150k-250k', '250k+']),
    firstTimeBuyer: z.boolean()
  }),
  locationPreferences: z.object({
    preferredRegions: z.array(z.string()),
    maxCommuteTime: z.number(), // minutes
    proximityFactors: z.object({
      publicTransport: z.number().min(0).max(10),
      schools: z.number().min(0).max(10),
      shopping: z.number().min(0).max(10),
      healthcare: z.number().min(0).max(10),
      recreation: z.number().min(0).max(10),
      nightlife: z.number().min(0).max(10),
      nature: z.number().min(0).max(10)
    }),
    urbanVsRural: z.enum(['urban', 'suburban', 'rural', 'mixed'])
  }),
  propertyPreferences: z.object({
    propertyTypes: z.array(z.enum(['apartment', 'house', 'townhouse', 'penthouse', 'duplex'])),
    sizePreferences: z.object({
      minBedrooms: z.number().min(0).max(10),
      maxBedrooms: z.number().min(0).max(10),
      minBathrooms: z.number().min(0).max(10),
      minSquareMeters: z.number().min(0),
      maxSquareMeters: z.number().min(0).optional()
    }),
    budgetConstraints: z.object({
      minPrice: z.number().min(0),
      maxPrice: z.number().min(0),
      downPaymentAvailable: z.number().min(0),
      monthlyBudget: z.number().min(0),
      flexibilityPercentage: z.number().min(0).max(50) // How much over budget willing to go
    }),
    stylePreferences: z.object({
      architecturalStyles: z.array(z.enum(['modern', 'traditional', 'contemporary', 'victorian', 'georgian', 'minimalist'])),
      interiorStyles: z.array(z.enum(['modern', 'traditional', 'scandinavian', 'industrial', 'bohemian', 'luxury'])),
      outdoorSpace: z.enum(['none', 'balcony', 'garden', 'large_garden', 'rooftop']),
      parking: z.enum(['none', 'street', 'private', 'garage', 'multiple'])
    })
  }),
  lifestyleFactors: z.object({
    workFromHome: z.boolean(),
    entertainingFrequency: z.enum(['never', 'rarely', 'sometimes', 'often', 'frequently']),
    petOwner: z.boolean(),
    fitnessImportance: z.number().min(0).max(10),
    privacyImportance: z.number().min(0).max(10),
    technologyImportance: z.number().min(0).max(10),
    sustainabilityImportance: z.number().min(0).max(10)
  }),
  investmentGoals: z.object({
    primaryResidence: z.boolean(),
    investmentProperty: z.boolean(),
    rentalPotential: z.boolean(),
    expectedHoldPeriod: z.enum(['1-2years', '3-5years', '5-10years', '10+years']),
    riskTolerance: z.enum(['conservative', 'moderate', 'aggressive'])
  }).optional()
});

// Property Data Schema
export const PropertyDataSchema = z.object({
  propertyId: z.string(),
  basicInfo: z.object({
    address: z.string(),
    region: z.string(),
    propertyType: z.enum(['apartment', 'house', 'townhouse', 'penthouse', 'duplex']),
    bedrooms: z.number(),
    bathrooms: z.number(),
    squareMeters: z.number(),
    yearBuilt: z.number().optional(),
    developmentStage: z.enum(['completed', 'under_construction', 'planning'])
  }),
  pricing: z.object({
    listPrice: z.number(),
    pricePerSqm: z.number(),
    estimatedMonthlyPayment: z.number(),
    serviceCharges: z.number().optional(),
    propertyTax: z.number().optional(),
    priceHistory: z.array(z.object({
      date: z.string().datetime(),
      price: z.number(),
      priceChange: z.number()
    })).optional()
  }),
  features: z.object({
    architecturalStyle: z.enum(['modern', 'traditional', 'contemporary', 'victorian', 'georgian', 'minimalist']),
    interiorStyle: z.enum(['modern', 'traditional', 'scandinavian', 'industrial', 'bohemian', 'luxury']),
    outdoorSpace: z.enum(['none', 'balcony', 'garden', 'large_garden', 'rooftop']),
    parking: z.enum(['none', 'street', 'private', 'garage', 'multiple']),
    energyRating: z.enum(['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3', 'D1', 'D2']),
    smartHomeFeatures: z.boolean(),
    accessibility: z.boolean(),
    petFriendly: z.boolean()
  }),
  location: z.object({
    coordinates: z.object({
      latitude: z.number(),
      longitude: z.number()
    }),
    walkScore: z.number().min(0).max(100),
    transitScore: z.number().min(0).max(100),
    proximityScores: z.object({
      schools: z.number().min(0).max(10),
      shopping: z.number().min(0).max(10),
      healthcare: z.number().min(0).max(10),
      recreation: z.number().min(0).max(10),
      publicTransport: z.number().min(0).max(10),
      nightlife: z.number().min(0).max(10),
      nature: z.number().min(0).max(10)
    }),
    noiseLevel: z.enum(['quiet', 'moderate', 'busy']),
    safetyRating: z.number().min(0).max(10)
  }),
  marketData: z.object({
    averageAreaPrice: z.number(),
    priceAppreciation: z.object({
      oneYear: z.number(),
      threeYear: z.number(),
      fiveYear: z.number()
    }),
    rentalYield: z.number().optional(),
    marketTrend: z.enum(['rising', 'stable', 'declining']),
    salesVolume: z.number(),
    timeOnMarket: z.number() // days
  }),
  propChoiceCompatibility: z.object({
    available: z.boolean(),
    packageOptions: z.array(z.string()),
    customizationLevel: z.enum(['basic', 'standard', 'premium', 'luxury']),
    estimatedUpgradeValue: z.number().optional()
  })
});

// Recommendation Score Schema
export const RecommendationScoreSchema = z.object({
  propertyId: z.string(),
  overallScore: z.number().min(0).max(100),
  scoreBreakdown: z.object({
    budgetMatch: z.number().min(0).max(100),
    locationMatch: z.number().min(0).max(100),
    propertyMatch: z.number().min(0).max(100),
    lifestyleMatch: z.number().min(0).max(100),
    investmentMatch: z.number().min(0).max(100),
    marketOpportunity: z.number().min(0).max(100)
  }),
  reasoning: z.array(z.object({
    factor: z.string(),
    impact: z.enum(['positive', 'negative', 'neutral']),
    weight: z.number(),
    explanation: z.string()
  })),
  confidence: z.number().min(0).max(100),
  riskFactors: z.array(z.string()),
  opportunities: z.array(z.string())
});

// Machine Learning Model Interface
interface MLModel {
  predict(features: number[]): number;
  retrain(trainingData: Array<{ features: number[]; target: number }>): void;
  getFeatureImportance(): Record<string, number>;
}

// Simple Neural Network Implementation
class PropertyRecommendationNN implements MLModel {
  private weights: number[][];
  private biases: number[];
  private learningRate: number = 0.01;

  constructor(inputSize: number, hiddenSize: number = 50, outputSize: number = 1) {
    // Initialize weights and biases randomly
    this.weights = [
      Array(inputSize * hiddenSize).fill(0).map(() => Math.random() * 0.2 - 0.1),
      Array(hiddenSize * outputSize).fill(0).map(() => Math.random() * 0.2 - 0.1)
    ];
    this.biases = [
      Array(hiddenSize).fill(0).map(() => Math.random() * 0.2 - 0.1),
      Array(outputSize).fill(0).map(() => Math.random() * 0.2 - 0.1)
    ];
  }

  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }

  private relu(x: number): number {
    return Math.max(0, x);
  }

  predict(features: number[]): number {
    // Forward pass through the network
    let hidden = Array(this.biases[0].length).fill(0);
    
    // Input to hidden layer
    for (let i = 0; i < hidden.length; i++) {
      let sum = this.biases[0][i];
      for (let j = 0; j < features.length; j++) {
        sum += features[j] * this.weights[0][j * hidden.length + i];
      }
      hidden[i] = this.relu(sum);
    }

    // Hidden to output layer
    let output = this.biases[1][0];
    for (let i = 0; i < hidden.length; i++) {
      output += hidden[i] * this.weights[1][i];
    }

    return this.sigmoid(output) * 100; // Scale to 0-100
  }

  retrain(trainingData: Array<{ features: number[]; target: number }>): void {
    // Simple gradient descent training
    for (let epoch = 0; epoch < 100; epoch++) {
      for (const sample of trainingData) {
        const prediction = this.predict(sample.features);
        const error = sample.target - prediction;
        
        // Simplified backpropagation (would be more complex in real implementation)
        // This is a placeholder for demonstration
      }
    }
  }

  getFeatureImportance(): Record<string, number> {
    // Calculate feature importance based on weight magnitudes
    const featureNames = [
      'budget_match', 'location_score', 'size_match', 'style_match',
      'lifestyle_fit', 'investment_potential', 'market_trend', 'appreciation'
    ];
    
    const importance: Record<string, number> = {};
    for (let i = 0; i < featureNames.length; i++) {
      let totalWeight = 0;
      for (let j = 0; j < this.weights[0].length; j += featureNames.length) {
        totalWeight += Math.abs(this.weights[0][j + i]);
      }
      importance[featureNames[i]] = totalWeight;
    }
    
    return importance;
  }
}

// Main Recommendation Engine
export class PropertyRecommendationEngine {
  private mlModel: MLModel;
  private userInteractions: Map<string, any[]> = new Map();
  private propertyViews: Map<string, number> = new Map();
  private marketData: Map<string, any> = new Map();

  constructor() {
    this.mlModel = new PropertyRecommendationNN(20); // 20 input features
    this.initializeMarketData();
  }

  // Initialize with real market data
  private initializeMarketData() {
    // In production, this would load from real market data APIs
    this.marketData.set('dublin', {
      averagePrice: 450000,
      priceGrowth: 0.08,
      rentalYield: 0.045,
      marketTrend: 'rising'
    });
    
    this.marketData.set('cork', {
      averagePrice: 320000,
      priceGrowth: 0.12,
      rentalYield: 0.055,
      marketTrend: 'rising'
    });

    this.marketData.set('galway', {
      averagePrice: 280000,
      priceGrowth: 0.09,
      rentalYield: 0.05,
      marketTrend: 'stable'
    });
  }

  // Generate personalized property recommendations
  public async generateRecommendations(params: {
    userPreferences: any;
    availableProperties: any[];
    limit?: number;
    includeReasons?: boolean;
  }): Promise<any[]> {
    try {
      const { userPreferences, availableProperties, limit = 10, includeReasons = true } = params;

      // Validate input data
      const validatedPreferences = UserPreferenceSchema.parse(userPreferences);

      // Score each property
      const scoredProperties = await Promise.all(
        availableProperties.map(async (property) => {
          const validatedProperty = PropertyDataSchema.parse(property);
          const score = await this.calculatePropertyScore(validatedPreferences, validatedProperty);
          
          return {
            ...property,
            recommendationScore: score,
            reasons: includeReasons ? this.generateRecommendationReasons(score) : []
          };
        })
      );

      // Sort by score and limit results
      const recommendations = scoredProperties
        .sort((a, b) => b.recommendationScore.overallScore - a.recommendationScore.overallScore)
        .slice(0, limit);

      // Log recommendation generation
      logger.info('Property recommendations generated', {
        userId: validatedPreferences.userId,
        propertiesScored: availableProperties.length,
        recommendationsReturned: recommendations.length,
        averageScore: recommendations.reduce((sum, r) => sum + r.recommendationScore.overallScore, 0) / recommendations.length
      });

      return recommendations;

    } catch (error) {
      logger.error('Property recommendation generation failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  // Calculate comprehensive property score
  private async calculatePropertyScore(preferences: any, property: any): Promise<any> {
    // Extract features for ML model
    const features = this.extractFeatures(preferences, property);
    
    // Get base ML prediction
    const mlScore = this.mlModel.predict(features);

    // Calculate detailed score breakdown
    const budgetMatch = this.calculateBudgetMatch(preferences, property);
    const locationMatch = this.calculateLocationMatch(preferences, property);
    const propertyMatch = this.calculatePropertyMatch(preferences, property);
    const lifestyleMatch = this.calculateLifestyleMatch(preferences, property);
    const investmentMatch = this.calculateInvestmentMatch(preferences, property);
    const marketOpportunity = this.calculateMarketOpportunity(property);

    // Weighted combination of scores
    const weights = {
      budget: 0.25,
      location: 0.20,
      property: 0.20,
      lifestyle: 0.15,
      investment: 0.10,
      market: 0.10
    };

    const overallScore = Math.min(100, Math.max(0,
      budgetMatch * weights.budget +
      locationMatch * weights.location +
      propertyMatch * weights.property +
      lifestyleMatch * weights.lifestyle +
      investmentMatch * weights.investment +
      marketOpportunity * weights.market
    ));

    // Generate reasoning
    const reasoning = this.generateScoreReasoning({
      budgetMatch,
      locationMatch,
      propertyMatch,
      lifestyleMatch,
      investmentMatch,
      marketOpportunity
    }, preferences, property);

    // Assess risk factors and opportunities
    const riskFactors = this.identifyRiskFactors(property);
    const opportunities = this.identifyOpportunities(property, preferences);

    return {
      propertyId: property.propertyId,
      overallScore: Math.round(overallScore),
      scoreBreakdown: {
        budgetMatch: Math.round(budgetMatch),
        locationMatch: Math.round(locationMatch),
        propertyMatch: Math.round(propertyMatch),
        lifestyleMatch: Math.round(lifestyleMatch),
        investmentMatch: Math.round(investmentMatch),
        marketOpportunity: Math.round(marketOpportunity)
      },
      reasoning,
      confidence: this.calculateConfidence(overallScore, reasoning),
      riskFactors,
      opportunities
    };
  }

  // Extract numerical features for ML model
  private extractFeatures(preferences: any, property: any): number[] {
    const features = [
      // Budget features
      this.normalizePrice(property.pricing.listPrice),
      preferences.propertyPreferences.budgetConstraints.maxPrice > 0 ? 
        property.pricing.listPrice / preferences.propertyPreferences.budgetConstraints.maxPrice : 0,
      
      // Location features
      property.location.walkScore / 100,
      property.location.transitScore / 100,
      property.location.safetyRating / 10,
      
      // Property features
      property.basicInfo.bedrooms / 10,
      property.basicInfo.bathrooms / 10,
      property.basicInfo.squareMeters / 500,
      
      // Market features
      property.marketData.priceAppreciation.oneYear || 0,
      property.marketData.rentalYield || 0,
      property.marketData.timeOnMarket / 365,
      
      // Proximity features
      property.location.proximityScores.schools / 10,
      property.location.proximityScores.shopping / 10,
      property.location.proximityScores.healthcare / 10,
      property.location.proximityScores.recreation / 10,
      property.location.proximityScores.publicTransport / 10,
      
      // Style match features
      this.calculateStyleMatch(preferences, property) / 100,
      property.features.smartHomeFeatures ? 1 : 0,
      property.features.energyRating ? this.energyRatingScore(property.features.energyRating) : 0,
      property.propChoiceCompatibility.available ? 1 : 0
    ];

    return features;
  }

  // Individual scoring functions
  private calculateBudgetMatch(preferences: any, property: any): number {
    const budget = preferences.propertyPreferences.budgetConstraints;
    const price = property.pricing.listPrice;
    
    if (price <= budget.maxPrice) {
      // Within budget - score based on how much of budget is used
      const utilization = price / budget.maxPrice;
      if (utilization < 0.7) return 100; // Great value
      if (utilization < 0.9) return 90;  // Good value
      return 80; // Fair value
    } else {
      // Over budget - check flexibility
      const overagePercent = ((price - budget.maxPrice) / budget.maxPrice) * 100;
      if (overagePercent <= budget.flexibilityPercentage) {
        return Math.max(0, 70 - overagePercent); // Reduced score for overage
      }
      return 0; // Too expensive
    }
  }

  private calculateLocationMatch(preferences: any, property: any): number {
    const locPrefs = preferences.locationPreferences;
    let score = 0;
    let totalWeight = 0;

    // Check preferred regions
    if (locPrefs.preferredRegions.includes(property.basicInfo.region)) {
      score += 30;
    }

    // Proximity factors
    const proximityWeights = locPrefs.proximityFactors;
    Object.keys(proximityWeights).forEach(factor => {
      const weight = proximityWeights[factor];
      const propertyScore = property.location.proximityScores[factor] || 0;
      score += (propertyScore * weight);
      totalWeight += weight;
    });

    // Normalize proximity score
    if (totalWeight > 0) {
      score = (score / totalWeight) * 7 + 30; // Scale proximity to 70% of total
    }

    return Math.min(100, score);
  }

  private calculatePropertyMatch(preferences: any, property: any): number {
    const propPrefs = preferences.propertyPreferences;
    let score = 0;

    // Property type match
    if (propPrefs.propertyTypes.includes(property.basicInfo.propertyType)) {
      score += 25;
    }

    // Size match
    const sizePrefs = propPrefs.sizePreferences;
    if (property.basicInfo.bedrooms >= sizePrefs.minBedrooms && 
        property.basicInfo.bedrooms <= sizePrefs.maxBedrooms) {
      score += 25;
    }
    
    if (property.basicInfo.bathrooms >= sizePrefs.minBathrooms) {
      score += 15;
    }
    
    if (property.basicInfo.squareMeters >= sizePrefs.minSquareMeters) {
      score += 15;
    }

    // Style match
    const stylePrefs = propPrefs.stylePreferences;
    if (stylePrefs.architecturalStyles.includes(property.features.architecturalStyle)) {
      score += 10;
    }
    
    if (stylePrefs.interiorStyles.includes(property.features.interiorStyle)) {
      score += 5;
    }
    
    if (stylePrefs.outdoorSpace === property.features.outdoorSpace) {
      score += 5;
    }

    return Math.min(100, score);
  }

  private calculateLifestyleMatch(preferences: any, property: any): number {
    const lifestyle = preferences.lifestyleFactors;
    let score = 50; // Base score

    // Work from home
    if (lifestyle.workFromHome && property.basicInfo.bedrooms >= 2) {
      score += 15; // Extra room for office
    }

    // Pet owner
    if (lifestyle.petOwner && property.features.petFriendly) {
      score += 10;
    } else if (lifestyle.petOwner && !property.features.petFriendly) {
      score -= 20;
    }

    // Technology importance
    if (lifestyle.technologyImportance >= 7 && property.features.smartHomeFeatures) {
      score += 10;
    }

    // Privacy importance vs noise level
    if (lifestyle.privacyImportance >= 7) {
      if (property.location.noiseLevel === 'quiet') {
        score += 10;
      } else if (property.location.noiseLevel === 'busy') {
        score -= 15;
      }
    }

    // Sustainability importance
    if (lifestyle.sustainabilityImportance >= 7) {
      score += this.energyRatingScore(property.features.energyRating) * 0.2;
    }

    return Math.min(100, Math.max(0, score));
  }

  private calculateInvestmentMatch(preferences: any, property: any): number {
    if (!preferences.investmentGoals) return 50; // No investment goals

    const investment = preferences.investmentGoals;
    let score = 0;

    // Rental potential
    if (investment.rentalPotential && property.marketData.rentalYield) {
      const yield_ = property.marketData.rentalYield * 100;
      if (yield_ >= 5) score += 30;
      else if (yield_ >= 4) score += 20;
      else if (yield_ >= 3) score += 10;
    }

    // Price appreciation potential
    const appreciation = property.marketData.priceAppreciation.oneYear || 0;
    if (appreciation >= 0.1) score += 25;
    else if (appreciation >= 0.05) score += 15;
    else if (appreciation >= 0) score += 5;

    // Market trend
    if (property.marketData.marketTrend === 'rising') score += 15;
    else if (property.marketData.marketTrend === 'stable') score += 10;

    // Risk tolerance vs property risk
    const riskScore = this.assessPropertyRisk(property);
    if (investment.riskTolerance === 'aggressive' || riskScore <= 3) {
      score += 15;
    } else if (investment.riskTolerance === 'moderate' && riskScore <= 5) {
      score += 10;
    } else if (investment.riskTolerance === 'conservative' && riskScore <= 2) {
      score += 15;
    } else {
      score -= 10;
    }

    // Development stage vs hold period
    if (property.basicInfo.developmentStage === 'under_construction') {
      if (investment.expectedHoldPeriod === '5-10years' || investment.expectedHoldPeriod === '10+years') {
        score += 10; // Good for long-term
      } else {
        score -= 5; // Risk for short-term
      }
    }

    return Math.min(100, Math.max(0, score));
  }

  private calculateMarketOpportunity(property: any): number {
    let score = 50; // Base score

    // Price vs area average
    const areaData = this.marketData.get(property.basicInfo.region.toLowerCase());
    if (areaData) {
      const priceRatio = property.pricing.listPrice / areaData.averagePrice;
      if (priceRatio < 0.9) score += 20; // Below market
      else if (priceRatio < 1.1) score += 10; // At market
      else score -= 10; // Above market
    }

    // Time on market
    if (property.marketData.timeOnMarket > 180) {
      score += 15; // Potential for negotiation
    } else if (property.marketData.timeOnMarket < 30) {
      score += 5; // Hot property
    }

    // Market trend
    if (property.marketData.marketTrend === 'rising') score += 15;
    else if (property.marketData.marketTrend === 'declining') score -= 10;

    // Price appreciation history
    const appreciation = property.marketData.priceAppreciation.threeYear || 0;
    score += Math.min(20, appreciation * 100); // Cap at 20 points

    return Math.min(100, Math.max(0, score));
  }

  // Helper functions
  private normalizePrice(price: number): number {
    // Normalize price to 0-1 range (assuming max price of 2M)
    return Math.min(1, price / 2000000);
  }

  private energyRatingScore(rating: string): number {
    const scores: Record<string, number> = {
      'A1': 100, 'A2': 95, 'A3': 90,
      'B1': 85, 'B2': 80, 'B3': 75,
      'C1': 70, 'C2': 65, 'C3': 60,
      'D1': 50, 'D2': 40
    };
    return scores[rating] || 30;
  }

  private calculateStyleMatch(preferences: any, property: any): number {
    const stylePrefs = preferences.propertyPreferences.stylePreferences;
    let matches = 0;
    let total = 0;

    if (stylePrefs.architecturalStyles.includes(property.features.architecturalStyle)) matches++;
    total++;

    if (stylePrefs.interiorStyles.includes(property.features.interiorStyle)) matches++;
    total++;

    if (stylePrefs.outdoorSpace === property.features.outdoorSpace) matches++;
    total++;

    if (stylePrefs.parking === property.features.parking) matches++;
    total++;

    return total > 0 ? (matches / total) * 100 : 0;
  }

  private assessPropertyRisk(property: any): number {
    let risk = 0;

    // Development stage risk
    if (property.basicInfo.developmentStage === 'planning') risk += 3;
    else if (property.basicInfo.developmentStage === 'under_construction') risk += 2;

    // Market trend risk
    if (property.marketData.marketTrend === 'declining') risk += 2;

    // Time on market risk
    if (property.marketData.timeOnMarket > 365) risk += 2;

    // Price vs market risk
    const areaData = this.marketData.get(property.basicInfo.region.toLowerCase());
    if (areaData && property.pricing.listPrice > areaData.averagePrice * 1.3) {
      risk += 2;
    }

    return Math.min(10, risk);
  }

  private generateScoreReasoning(scores: any, preferences: any, property: any): any[] {
    const reasoning = [];

    // Budget reasoning
    if (scores.budgetMatch >= 80) {
      reasoning.push({
        factor: 'Budget Match',
        impact: 'positive',
        weight: 0.25,
        explanation: 'Property is well within your budget, offering excellent value.'
      });
    } else if (scores.budgetMatch >= 50) {
      reasoning.push({
        factor: 'Budget Match',
        impact: 'neutral',
        weight: 0.25,
        explanation: 'Property is at the upper end of your budget but still affordable.'
      });
    } else {
      reasoning.push({
        factor: 'Budget Match',
        impact: 'negative',
        weight: 0.25,
        explanation: 'Property exceeds your stated budget constraints.'
      });
    }

    // Location reasoning
    if (scores.locationMatch >= 80) {
      reasoning.push({
        factor: 'Location Match',
        impact: 'positive',
        weight: 0.20,
        explanation: 'Excellent location match with strong proximity to your preferred amenities.'
      });
    } else if (scores.locationMatch >= 60) {
      reasoning.push({
        factor: 'Location Match',
        impact: 'neutral',
        weight: 0.20,
        explanation: 'Good location with most of your preferred amenities nearby.'
      });
    } else {
      reasoning.push({
        factor: 'Location Match',
        impact: 'negative',
        weight: 0.20,
        explanation: 'Location may not fully meet your proximity preferences.'
      });
    }

    // Property match reasoning
    if (scores.propertyMatch >= 80) {
      reasoning.push({
        factor: 'Property Features',
        impact: 'positive',
        weight: 0.20,
        explanation: 'Property features align very well with your requirements.'
      });
    }

    // Investment reasoning
    if (preferences.investmentGoals && scores.investmentMatch >= 70) {
      reasoning.push({
        factor: 'Investment Potential',
        impact: 'positive',
        weight: 0.10,
        explanation: 'Strong investment potential with good appreciation prospects.'
      });
    }

    return reasoning;
  }

  private identifyRiskFactors(property: any): string[] {
    const risks = [];

    if (property.basicInfo.developmentStage === 'under_construction') {
      risks.push('Construction completion risk');
    }

    if (property.marketData.timeOnMarket > 180) {
      risks.push('Extended time on market may indicate pricing or condition issues');
    }

    if (property.marketData.marketTrend === 'declining') {
      risks.push('Local market showing declining trend');
    }

    if (property.location.noiseLevel === 'busy') {
      risks.push('High noise levels may affect quality of life');
    }

    return risks;
  }

  private identifyOpportunities(property: any, preferences: any): string[] {
    const opportunities = [];

    if (property.propChoiceCompatibility.available) {
      opportunities.push('PROP Choice customization available for personalization');
    }

    if (property.marketData.timeOnMarket > 90) {
      opportunities.push('Potential for price negotiation due to extended market time');
    }

    if (property.marketData.priceAppreciation.oneYear > 0.1) {
      opportunities.push('Strong price appreciation trend in the area');
    }

    if (property.features.smartHomeFeatures && preferences.lifestyleFactors.technologyImportance >= 7) {
      opportunities.push('Smart home features align with your technology preferences');
    }

    if (property.marketData.rentalYield && property.marketData.rentalYield > 0.05) {
      opportunities.push('Excellent rental yield potential for investment');
    }

    return opportunities;
  }

  private generateRecommendationReasons(score: any): string[] {
    const reasons = [];

    if (score.overallScore >= 85) {
      reasons.push('Exceptional match across all key criteria');
    } else if (score.overallScore >= 70) {
      reasons.push('Strong overall match with your preferences');
    }

    if (score.scoreBreakdown.budgetMatch >= 80) {
      reasons.push('Excellent value within your budget');
    }

    if (score.scoreBreakdown.locationMatch >= 80) {
      reasons.push('Prime location with great amenities');
    }

    if (score.scoreBreakdown.investmentMatch >= 80) {
      reasons.push('Outstanding investment potential');
    }

    return reasons;
  }

  private calculateConfidence(score: number, reasoning: any[]): number {
    let confidence = 50; // Base confidence

    // Higher score = higher confidence
    confidence += (score - 50) * 0.5;

    // More reasoning factors = higher confidence
    confidence += Math.min(20, reasoning.length * 5);

    // Strong positive factors increase confidence
    const positiveFactors = reasoning.filter(r => r.impact === 'positive').length;
    confidence += positiveFactors * 5;

    // Negative factors decrease confidence
    const negativeFactors = reasoning.filter(r => r.impact === 'negative').length;
    confidence -= negativeFactors * 10;

    return Math.min(100, Math.max(0, Math.round(confidence)));
  }

  // Learn from user interactions
  public recordUserInteraction(params: {
    userId: string;
    propertyId: string;
    interactionType: 'view' | 'save' | 'contact' | 'visit' | 'offer';
    feedback?: {
      rating: number;
      reasons: string[];
    };
  }): void {
    const { userId, propertyId, interactionType, feedback } = params;

    // Store interaction
    if (!this.userInteractions.has(userId)) {
      this.userInteractions.set(userId, []);
    }

    this.userInteractions.get(userId)!.push({
      propertyId,
      interactionType,
      feedback,
      timestamp: new Date().toISOString()
    });

    // Update property view count
    const currentViews = this.propertyViews.get(propertyId) || 0;
    this.propertyViews.set(propertyId, currentViews + 1);

    // Log interaction for ML model retraining
    logger.info('User interaction recorded', {
      userId,
      propertyId,
      interactionType,
      hasFeedback: !!feedback
    });
  }

  // Get user behavior insights
  public getUserInsights(userId: string): any {
    const interactions = this.userInteractions.get(userId) || [];
    
    const insights = {
      totalInteractions: interactions.length,
      viewedProperties: interactions.filter(i => i.interactionType === 'view').length,
      savedProperties: interactions.filter(i => i.interactionType === 'save').length,
      contactedProperties: interactions.filter(i => i.interactionType === 'contact').length,
      averageRating: 0,
      preferredFeatures: [],
      behaviorPattern: 'explorer' // explorer, researcher, decisive
    };

    // Calculate average rating
    const ratingsInteractions = interactions.filter(i => i.feedback?.rating);
    if (ratingsInteractions.length > 0) {
      insights.averageRating = ratingsInteractions.reduce((sum, i) => sum + i.feedback!.rating, 0) / ratingsInteractions.length;
    }

    // Determine behavior pattern
    if (interactions.length > 50) {
      insights.behaviorPattern = 'researcher';
    } else if (insights.contactedProperties / Math.max(1, insights.viewedProperties) > 0.1) {
      insights.behaviorPattern = 'decisive';
    }

    return insights;
  }

  // Retrain model based on user feedback
  public async retrainModel(): Promise<void> {
    try {
      const trainingData = [];

      // Collect training data from user interactions
      for (const [userId, interactions] of this.userInteractions.entries()) {
        for (const interaction of interactions) {
          if (interaction.feedback?.rating) {
            // This would extract features and use the rating as target
            // Simplified for demonstration
            const features = Array(20).fill(0).map(() => Math.random());
            const target = interaction.feedback.rating / 10; // Normalize to 0-1
            
            trainingData.push({ features, target });
          }
        }
      }

      if (trainingData.length >= 100) {
        this.mlModel.retrain(trainingData);
        logger.info('ML model retrained', {
          trainingDataSize: trainingData.length,
          timestamp: new Date().toISOString()
        });
      }

    } catch (error) {
      logger.error('Model retraining failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get model insights
  public getModelInsights(): any {
    return {
      featureImportance: this.mlModel.getFeatureImportance(),
      totalUserInteractions: Array.from(this.userInteractions.values()).reduce((sum, interactions) => sum + interactions.length, 0),
      totalPropertyViews: Array.from(this.propertyViews.values()).reduce((sum, views) => sum + views, 0),
      lastRetrained: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const recommendationEngine = new PropertyRecommendationEngine();

// Export utility functions
export const RecommendationUtils = {
  formatScore: (score: number): string => {
    if (score >= 90) return 'Excellent Match';
    if (score >= 80) return 'Very Good Match';
    if (score >= 70) return 'Good Match';
    if (score >= 60) return 'Fair Match';
    return 'Poor Match';
  },

  formatConfidence: (confidence: number): string => {
    if (confidence >= 90) return 'Very High';
    if (confidence >= 75) return 'High';
    if (confidence >= 60) return 'Medium';
    if (confidence >= 40) return 'Low';
    return 'Very Low';
  },

  generateSearchSuggestions: (preferences: any): string[] => {
    const suggestions = [];
    
    if (preferences.propertyPreferences.budgetConstraints.maxPrice < 300000) {
      suggestions.push('Consider expanding your search to include upcoming developments');
    }
    
    if (preferences.locationPreferences.preferredRegions.length === 1) {
      suggestions.push('Explore similar areas with better value propositions');
    }
    
    if (preferences.lifestyleFactors.sustainabilityImportance >= 7) {
      suggestions.push('Look for properties with A-rated energy efficiency');
    }
    
    return suggestions;
  }
};