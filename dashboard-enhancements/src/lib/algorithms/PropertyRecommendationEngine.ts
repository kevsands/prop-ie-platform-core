/**
 * Property Recommendation Engine
 * AI-powered matching system that analyzes user profiles and property features
 * to provide personalized property recommendations with explanation scoring
 */

import { Property } from '@/types/properties';

export interface UserProfile {
  // Basic Info
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  
  // Financial
  budget?: string; // e.g., "300-400" for €300k-€400k
  deposit?: string;
  hasHTB?: boolean;
  hasAIP?: boolean; // Approval in Principle
  
  // Property Preferences
  preferredCounties?: string[];
  propertyType?: string[]; // ['apartment', 'house', 'duplex']
  bedrooms?: string; // e.g., "2-3"
  bathrooms?: string;
  minFloorArea?: number;
  maxFloorArea?: number;
  
  // Lifestyle
  moveInTimeframe?: string; // 'immediate', '3-6-months', '6-12-months'
  currentStatus?: string; // 'first-time-buyer', 'upgrading', 'downsizing'
  importantFeatures?: string[]; // ['parking', 'balcony', 'garden', 'gym']
  
  // Journey Context
  journeySource?: string;
  registrationSource?: string;
  completionScore?: number;
}

export interface PropertyMatch {
  property: Property;
  matchScore: number; // 0-100
  explanations: RecommendationExplanation[];
  strengths: string[];
  considerations: string[];
  personalizedFeatures: string[];
}

export interface RecommendationExplanation {
  category: 'budget' | 'location' | 'size' | 'type' | 'features' | 'lifestyle' | 'financial';
  score: number; // 0-100
  explanation: string;
  impact: 'high' | 'medium' | 'low';
  details?: string;
}

export class PropertyRecommendationEngine {
  
  /**
   * Main recommendation function that analyzes properties against user profile
   */
  static recommendProperties(
    properties: Property[], 
    userProfile: UserProfile,
    limit: number = 20
  ): PropertyMatch[] {
    if (!properties.length || !userProfile) {
      return [];
    }

    const matches: PropertyMatch[] = properties.map(property => {
      const matchResult = this.calculatePropertyMatch(property, userProfile);
      return matchResult;
    });

    // Sort by match score (highest first) and return top results
    return matches
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);
  }

  /**
   * Calculate how well a property matches a user's profile
   */
  private static calculatePropertyMatch(property: Property, userProfile: UserProfile): PropertyMatch {
    const scores: { [key: string]: number } = {};
    const explanations: RecommendationExplanation[] = [];
    const strengths: string[] = [];
    const considerations: string[] = [];
    const personalizedFeatures: string[] = [];

    // 1. Budget Matching (Weight: 30%)
    const budgetMatch = this.calculateBudgetMatch(property, userProfile);
    scores.budget = budgetMatch.score;
    explanations.push(budgetMatch.explanation);
    if (budgetMatch.score >= 80) strengths.push('Perfect price range');
    else if (budgetMatch.score < 50) considerations.push('Above preferred budget');

    // 2. Location Matching (Weight: 25%)
    const locationMatch = this.calculateLocationMatch(property, userProfile);
    scores.location = locationMatch.score;
    explanations.push(locationMatch.explanation);
    if (locationMatch.score >= 80) strengths.push('Ideal location');

    // 3. Property Type & Size (Weight: 20%)
    const typeMatch = this.calculateTypeAndSizeMatch(property, userProfile);
    scores.type = typeMatch.score;
    explanations.push(typeMatch.explanation);
    if (typeMatch.score >= 80) strengths.push('Perfect property type and size');

    // 4. Features & Amenities (Weight: 15%)
    const featuresMatch = this.calculateFeaturesMatch(property, userProfile);
    scores.features = featuresMatch.score;
    explanations.push(featuresMatch.explanation);
    if (featuresMatch.score >= 80) {
      personalizedFeatures.push(...(property.features?.slice(0, 3) || []));
    }

    // 5. Financial Suitability (Weight: 10%)
    const financialMatch = this.calculateFinancialMatch(property, userProfile);
    scores.financial = financialMatch.score;
    explanations.push(financialMatch.explanation);
    if (financialMatch.score >= 80) strengths.push('Great financial fit');

    // Calculate weighted overall score
    const overallScore = Math.round(
      (scores.budget * 0.30) +
      (scores.location * 0.25) +
      (scores.type * 0.20) +
      (scores.features * 0.15) +
      (scores.financial * 0.10)
    );

    // Add timeline considerations
    if (userProfile.moveInTimeframe === 'immediate' && property.status === 'Available') {
      strengths.push('Available immediately');
    }

    return {
      property,
      matchScore: overallScore,
      explanations,
      strengths,
      considerations,
      personalizedFeatures
    };
  }

  /**
   * Calculate budget matching score
   */
  private static calculateBudgetMatch(property: Property, userProfile: UserProfile): { score: number; explanation: RecommendationExplanation } {
    if (!userProfile.budget || !property.price) {
      return {
        score: 50,
        explanation: {
          category: 'budget',
          score: 50,
          explanation: 'Budget preferences not specified',
          impact: 'medium'
        }
      };
    }

    // Parse budget range (e.g., "300-400" = €300k-€400k)
    const budgetParts = userProfile.budget.split('-');
    const minBudget = parseInt(budgetParts[0]) * 1000;
    const maxBudget = budgetParts[1] === '+' ? Infinity : parseInt(budgetParts[1]) * 1000;
    
    const propertyPrice = property.price;
    
    let score = 0;
    let explanation = '';
    let impact: 'high' | 'medium' | 'low' = 'high';

    if (propertyPrice >= minBudget && propertyPrice <= maxBudget) {
      score = 100;
      explanation = `Perfect fit within your €${minBudget/1000}k-€${maxBudget === Infinity ? budgetParts[1] : maxBudget/1000}k budget`;
    } else if (propertyPrice < minBudget) {
      const difference = ((minBudget - propertyPrice) / minBudget) * 100;
      score = Math.max(70, 100 - difference);
      explanation = `€${Math.round((minBudget - propertyPrice)/1000)}k under your budget - great value`;
      impact = 'medium';
    } else {
      const overBudget = ((propertyPrice - maxBudget) / maxBudget) * 100;
      score = Math.max(0, 100 - (overBudget * 2)); // Penalize heavily for over budget
      explanation = `€${Math.round((propertyPrice - maxBudget)/1000)}k over your budget`;
      impact = 'high';
    }

    return {
      score,
      explanation: {
        category: 'budget',
        score,
        explanation,
        impact,
        details: `Property: €${Math.round(propertyPrice/1000)}k | Your range: €${minBudget/1000}k-€${maxBudget === Infinity ? budgetParts[1] : maxBudget/1000}k`
      }
    };
  }

  /**
   * Calculate location matching score
   */
  private static calculateLocationMatch(property: Property, userProfile: UserProfile): { score: number; explanation: RecommendationExplanation } {
    if (!userProfile.preferredCounties?.length) {
      return {
        score: 50,
        explanation: {
          category: 'location',
          score: 50,
          explanation: 'No location preferences specified',
          impact: 'medium'
        }
      };
    }

    const propertyLocation = property.address?.city || property.address?.state || '';
    const matchesPreferredArea = userProfile.preferredCounties.some(county => 
      propertyLocation.toLowerCase().includes(county.toLowerCase())
    );

    const score = matchesPreferredArea ? 100 : 20;
    const explanation = matchesPreferredArea 
      ? `Located in your preferred area: ${propertyLocation}`
      : `Not in your preferred areas, but might be worth considering`;

    return {
      score,
      explanation: {
        category: 'location',
        score,
        explanation,
        impact: matchesPreferredArea ? 'high' : 'medium',
        details: `Property location: ${propertyLocation} | Preferred: ${userProfile.preferredCounties.join(', ')}`
      }
    };
  }

  /**
   * Calculate property type and size matching
   */
  private static calculateTypeAndSizeMatch(property: Property, userProfile: UserProfile): { score: number; explanation: RecommendationExplanation } {
    let score = 0;
    let explanationText = '';
    let details = '';

    // Property type matching (60% of this score)
    let typeScore = 50; // Default neutral score
    if (userProfile.propertyType?.length) {
      const matchesType = userProfile.propertyType.some(type => 
        property.type?.toLowerCase().includes(type.toLowerCase())
      );
      typeScore = matchesType ? 100 : 30;
      explanationText += matchesType 
        ? `${property.type} matches your preference` 
        : `${property.type} - different from your usual preference`;
    }

    // Bedroom matching (40% of this score)
    let bedroomScore = 50;
    if (userProfile.bedrooms && property.bedrooms) {
      const bedroomRange = userProfile.bedrooms.includes('-') 
        ? userProfile.bedrooms.split('-').map(n => parseInt(n))
        : [parseInt(userProfile.bedrooms), parseInt(userProfile.bedrooms)];
      
      const [minBed, maxBed] = bedroomRange;
      
      if (property.bedrooms >= minBed && property.bedrooms <= maxBed) {
        bedroomScore = 100;
        explanationText += ` | ${property.bedrooms} bedrooms - perfect fit`;
      } else if (Math.abs(property.bedrooms - ((minBed + maxBed) / 2)) <= 1) {
        bedroomScore = 75;
        explanationText += ` | ${property.bedrooms} bedrooms - close to your preference`;
      } else {
        bedroomScore = 40;
        explanationText += ` | ${property.bedrooms} bedrooms - different from your preference`;
      }
    }

    score = Math.round((typeScore * 0.6) + (bedroomScore * 0.4));
    details = `Property: ${property.type}, ${property.bedrooms} bed | Preferred: ${userProfile.propertyType?.join(', ')}, ${userProfile.bedrooms} bed`;

    return {
      score,
      explanation: {
        category: 'type',
        score,
        explanation: explanationText,
        impact: score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low',
        details
      }
    };
  }

  /**
   * Calculate features and amenities matching
   */
  private static calculateFeaturesMatch(property: Property, userProfile: UserProfile): { score: number; explanation: RecommendationExplanation } {
    if (!userProfile.importantFeatures?.length) {
      return {
        score: 50,
        explanation: {
          category: 'features',
          score: 50,
          explanation: 'No specific feature preferences specified',
          impact: 'low'
        }
      };
    }

    const propertyFeatures = [
      ...(property.features || []),
      ...(property.amenities || [])
    ].map(f => f.toLowerCase());

    const matchedFeatures = userProfile.importantFeatures.filter(feature =>
      propertyFeatures.some(pf => pf.includes(feature.toLowerCase()))
    );

    const matchPercentage = (matchedFeatures.length / userProfile.importantFeatures.length) * 100;
    const score = Math.min(100, matchPercentage * 1.2); // Slight boost for feature matches

    const explanation = matchedFeatures.length > 0
      ? `Has ${matchedFeatures.length}/${userProfile.importantFeatures.length} of your preferred features: ${matchedFeatures.join(', ')}`
      : `Missing your preferred features, but may have other great amenities`;

    return {
      score,
      explanation: {
        category: 'features',
        score,
        explanation,
        impact: score >= 70 ? 'medium' : 'low',
        details: `Matched features: ${matchedFeatures.join(', ')} | Property features: ${propertyFeatures.slice(0, 5).join(', ')}`
      }
    };
  }

  /**
   * Calculate financial suitability (HTB, AIP, etc.)
   */
  private static calculateFinancialMatch(property: Property, userProfile: UserProfile): { score: number; explanation: RecommendationExplanation } {
    let score = 50; // Default neutral score
    let explanation = 'Standard financing options available';
    let impact: 'high' | 'medium' | 'low' = 'low';

    // HTB eligibility boost for first-time buyers
    if (userProfile.hasHTB && property.isNew) {
      score += 30;
      explanation = 'Eligible for Help to Buy scheme - save up to €30,000';
      impact = 'high';
    }

    // Pre-approval boost
    if (userProfile.hasAIP) {
      score += 20;
      explanation += ' | Pre-approved for mortgage - faster process';
      impact = 'medium';
    }

    score = Math.min(100, score);

    return {
      score,
      explanation: {
        category: 'financial',
        score,
        explanation,
        impact,
        details: `HTB eligible: ${userProfile.hasHTB && property.isNew} | Pre-approved: ${userProfile.hasAIP || false}`
      }
    };
  }

  /**
   * Get explanation for why a property was recommended
   */
  static getDetailedExplanation(match: PropertyMatch): string {
    const topReasons = match.explanations
      .filter(exp => exp.score >= 70)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    if (topReasons.length === 0) {
      return "This property meets some of your criteria and might be worth considering.";
    }

    const reasonTexts = topReasons.map(reason => reason.explanation);
    return `This property is recommended because: ${reasonTexts.join('; ')}.`;
  }

  /**
   * Generate personalized insights for a property match
   */
  static generatePersonalizedInsights(match: PropertyMatch, userProfile: UserProfile): string[] {
    const insights: string[] = [];

    // Budget insights
    const budgetExplanation = match.explanations.find(e => e.category === 'budget');
    if (budgetExplanation && budgetExplanation.score >= 80) {
      insights.push(`💰 Within your €${userProfile.budget}k budget range`);
    }

    // Location insights
    const locationExplanation = match.explanations.find(e => e.category === 'location');
    if (locationExplanation && locationExplanation.score >= 80) {
      insights.push(`📍 In your preferred area`);
    }

    // Feature insights
    if (match.personalizedFeatures.length > 0) {
      insights.push(`✨ Has ${match.personalizedFeatures.slice(0, 2).join(' & ')} you're looking for`);
    }

    // Financial insights
    if (userProfile.hasHTB && match.property.isNew) {
      insights.push(`🏡 Help to Buy eligible - save up to €30,000`);
    }

    return insights;
  }
}

export default PropertyRecommendationEngine;