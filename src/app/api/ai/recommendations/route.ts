import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { userService } from '@/lib/services/users-production';
import { PredictiveBuyerAnalyticsService } from '@/services/PredictiveBuyerAnalyticsService';
import { AIMarketAnalysisEngine } from '@/services/AIMarketAnalysisEngine';
import { z } from 'zod';

const prisma = new PrismaClient();

const recommendationRequestSchema = z.object({
  recommendationType: z.enum([
    'PROPERTY_RECOMMENDATIONS',
    'INVESTMENT_OPPORTUNITIES',
    'MORTGAGE_PRODUCTS',
    'PROFESSIONAL_SERVICES',
    'MARKET_OPPORTUNITIES',
    'PORTFOLIO_OPTIMIZATION',
    'DEVELOPMENT_OPPORTUNITIES',
    'BUYER_MATCHES',
    'PRICING_OPTIMIZATION',
    'FEATURE_RECOMMENDATIONS'
  ]),
  userId: z.string().optional(),
  propertyId: z.string().optional(),
  filters: z.object({
    budget: z.object({
      min: z.number().optional(),
      max: z.number().optional()
    }).optional(),
    location: z.object({
      areas: z.array(z.string()).optional(),
      radius: z.number().optional(), // in km
      coordinates: z.object({
        lat: z.number(),
        lng: z.number()
      }).optional()
    }).optional(),
    propertyTypes: z.array(z.string()).optional(),
    bedrooms: z.object({
      min: z.number().optional(),
      max: z.number().optional()
    }).optional(),
    features: z.array(z.string()).optional(),
    investmentCriteria: z.object({
      minYield: z.number().optional(),
      maxRisk: z.string().optional(),
      timeHorizon: z.string().optional()
    }).optional()
  }).optional(),
  preferences: z.object({
    userType: z.enum(['FIRST_TIME_BUYER', 'INVESTOR', 'UPGRADER', 'DOWNSIZER']).optional(),
    priorities: z.array(z.enum(['PRICE', 'LOCATION', 'SIZE', 'YIELD', 'GROWTH', 'QUALITY'])).optional(),
    riskTolerance: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    timeline: z.enum(['IMMEDIATE', 'SHORT_TERM', 'MEDIUM_TERM', 'LONG_TERM']).optional()
  }).optional(),
  options: z.object({
    maxResults: z.number().optional().default(20),
    includeReasons: z.boolean().optional().default(true),
    includeAlternatives: z.boolean().optional().default(true),
    personalizeResults: z.boolean().optional().default(true),
    confidenceThreshold: z.number().min(0).max(1).optional().default(0.6)
  }).optional().default({})
});

/**
 * POST /api/ai/recommendations - Generate AI-powered recommendations
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = recommendationRequestSchema.parse(body);

    // Get current user for authorization
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check permissions
    if (!isAuthorizedToAccessAI(currentUser)) {
      return NextResponse.json(
        { error: 'Insufficient permissions for AI recommendations' },
        { status: 403 }
      );
    }

    // Get user profile and context
    const userProfile = await getUserProfile(validatedData.userId || currentUser.id);
    const contextData = await getRecommendationContext(validatedData, currentUser);

    // Initialize AI services
    const buyerAnalytics = new PredictiveBuyerAnalyticsService();
    const marketAnalysis = new AIMarketAnalysisEngine();

    // Generate recommendations based on type
    let recommendations;
    switch (validatedData.recommendationType) {
      case 'PROPERTY_RECOMMENDATIONS':
        recommendations = await generatePropertyRecommendations(
          validatedData, userProfile, contextData, buyerAnalytics, marketAnalysis
        );
        break;

      case 'INVESTMENT_OPPORTUNITIES':
        recommendations = await generateInvestmentOpportunities(
          validatedData, userProfile, contextData, marketAnalysis
        );
        break;

      case 'MORTGAGE_PRODUCTS':
        recommendations = await generateMortgageRecommendations(
          validatedData, userProfile, contextData
        );
        break;

      case 'PROFESSIONAL_SERVICES':
        recommendations = await generateProfessionalServiceRecommendations(
          validatedData, userProfile, contextData
        );
        break;

      case 'MARKET_OPPORTUNITIES':
        recommendations = await generateMarketOpportunities(
          validatedData, userProfile, contextData, marketAnalysis
        );
        break;

      case 'PORTFOLIO_OPTIMIZATION':
        recommendations = await generatePortfolioOptimization(
          validatedData, userProfile, contextData, marketAnalysis
        );
        break;

      case 'DEVELOPMENT_OPPORTUNITIES':
        recommendations = await generateDevelopmentOpportunities(
          validatedData, userProfile, contextData, marketAnalysis
        );
        break;

      case 'BUYER_MATCHES':
        recommendations = await generateBuyerMatches(
          validatedData, userProfile, contextData, buyerAnalytics
        );
        break;

      case 'PRICING_OPTIMIZATION':
        recommendations = await generatePricingOptimization(
          validatedData, userProfile, contextData, marketAnalysis
        );
        break;

      case 'FEATURE_RECOMMENDATIONS':
        recommendations = await generateFeatureRecommendations(
          validatedData, userProfile, contextData
        );
        break;

      default:
        throw new Error('Unsupported recommendation type');
    }

    // Apply filtering and ranking
    const filteredRecommendations = applyFiltersAndRanking(
      recommendations,
      validatedData.options
    );

    // Add personalization if enabled
    if (validatedData.options?.personalizeResults) {
      await personalizeRecommendations(filteredRecommendations, userProfile, buyerAnalytics);
    }

    // Log recommendation request
    await logRecommendationUsage({
      userId: currentUser.id,
      recommendationType: validatedData.recommendationType,
      filters: validatedData.filters,
      resultCount: filteredRecommendations.length,
      processingTime: Date.now() - new Date().getTime()
    });

    return NextResponse.json({
      success: true,
      data: {
        recommendationType: validatedData.recommendationType,
        recommendations: filteredRecommendations,
        metadata: {
          totalResults: recommendations.length,
          filteredResults: filteredRecommendations.length,
          userProfile: userProfile.summary,
          generatedAt: new Date(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        }
      }
    });

  } catch (error) {
    console.error('Error generating recommendations:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Helper functions
async function getCurrentUser(request: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
      const authToken = request.cookies.get('auth-token')?.value;
      if (authToken?.startsWith('dev-token-')) {
        const userId = authToken.replace('dev-token-', '');
        return await userService.getUserById(userId);
      }
    } else {
      return await userService.getCurrentUser();
    }
  } catch (error) {
    console.error('Error getting current user:', error);
  }
  return null;
}

function isAuthorizedToAccessAI(user: any): boolean {
  return user?.roles?.includes('ADMIN') || 
         user?.roles?.includes('SUPER_ADMIN') ||
         user?.roles?.includes('DEVELOPER') ||
         user?.roles?.includes('ESTATE_AGENT') ||
         user?.roles?.includes('INVESTOR') ||
         user?.subscription?.includes('AI_RECOMMENDATIONS');
}

async function getUserProfile(userId: string) {
  try {
    // Get comprehensive user profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        BuyerProfile: true,
        Reservation: {
          include: {
            Property: {
              select: {
                propertyType: true,
                bedrooms: true,
                bathrooms: true,
                price: true,
                address: true
              }
            }
          }
        },
        BuyerEvent: {
          where: {
            eventDate: {
              gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // Last 90 days
            }
          }
        }
      }
    });

    if (!user) {
      return { summary: 'Unknown user' };
    }

    // Build user profile
    const profile = {
      demographics: {
        age: user.BuyerProfile?.age,
        income: user.BuyerProfile?.annualIncome,
        occupation: user.BuyerProfile?.occupation,
        location: user.BuyerProfile?.currentLocation
      },
      preferences: {
        propertyTypes: user.BuyerProfile?.preferredPropertyTypes || [],
        locations: user.BuyerProfile?.preferredLocations || [],
        budget: {
          min: user.BuyerProfile?.minBudget,
          max: user.BuyerProfile?.maxBudget
        },
        features: user.BuyerProfile?.desiredFeatures || []
      },
      behavior: {
        searchHistory: user.BuyerEvent?.filter(e => e.eventType === 'PROPERTY_VIEWED') || [],
        reservationHistory: user.Reservation || [],
        lastActivity: user.BuyerEvent?.[0]?.eventDate,
        activityLevel: calculateActivityLevel(user.BuyerEvent || [])
      },
      riskProfile: {
        tolerance: user.BuyerProfile?.riskTolerance || 'MEDIUM',
        investmentExperience: user.BuyerProfile?.investmentExperience || 'BEGINNER'
      },
      summary: `${user.firstName} ${user.lastName} - ${user.BuyerProfile?.buyerType || 'Buyer'}`
    };

    return profile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return { summary: 'Profile unavailable' };
  }
}

async function getRecommendationContext(data: any, currentUser: any) {
  const context: any = {
    timestamp: new Date(),
    userLocation: currentUser.location,
    marketConditions: await getCurrentMarketConditions(),
    seasonality: getCurrentSeasonality()
  };

  // Add property context if specified
  if (data.propertyId) {
    const property = await prisma.property.findUnique({
      where: { id: data.propertyId },
      include: {
        Development: true
      }
    });
    context.property = property;
  }

  return context;
}

async function generatePropertyRecommendations(data: any, userProfile: any, context: any, buyerAnalytics: any, marketAnalysis: any) {
  // Get properties matching basic criteria
  const whereClause: any = {
    status: 'AVAILABLE'
  };

  // Apply filters
  if (data.filters?.budget) {
    whereClause.price = {
      gte: data.filters.budget.min,
      lte: data.filters.budget.max
    };
  }

  if (data.filters?.propertyTypes?.length > 0) {
    whereClause.propertyType = {
      in: data.filters.propertyTypes
    };
  }

  if (data.filters?.bedrooms) {
    whereClause.bedrooms = {
      gte: data.filters.bedrooms.min,
      lte: data.filters.bedrooms.max
    };
  }

  const properties = await prisma.property.findMany({
    where: whereClause,
    include: {
      Development: {
        select: {
          name: true,
          developer: true,
          location: true,
          amenities: true
        }
      }
    },
    take: 100 // Get more than needed for scoring
  });

  // Score each property using AI
  const scoredProperties = await Promise.all(
    properties.map(async (property) => {
      const scores = await scorePropertyForUser(property, userProfile, buyerAnalytics, marketAnalysis);
      return {
        property,
        scores,
        overallScore: calculateOverallScore(scores),
        reasons: generateRecommendationReasons(scores, property, userProfile),
        alternatives: await findAlternativeProperties(property, properties.slice(0, 10))
      };
    })
  );

  return scoredProperties.sort((a, b) => b.overallScore - a.overallScore);
}

async function generateInvestmentOpportunities(data: any, userProfile: any, context: any, marketAnalysis: any) {
  // Get properties with investment potential
  const investmentProperties = await prisma.property.findMany({
    where: {
      status: 'AVAILABLE',
      // Add investment-specific filters
    },
    include: {
      Development: true
    },
    take: 50
  });

  // Analyze investment potential for each property
  const opportunities = await Promise.all(
    investmentProperties.map(async (property) => {
      const analysis = await marketAnalysis.analyzeInvestmentPotential(property);
      const riskAssessment = await marketAnalysis.analyzeInvestmentRisk(property);
      
      return {
        property,
        investmentMetrics: {
          expectedROI: analysis.expectedROI,
          paybackPeriod: analysis.paybackPeriod,
          capitalGrowthProjection: analysis.capitalGrowthProjection,
          rentalYield: analysis.rentalYield
        },
        riskProfile: {
          riskLevel: riskAssessment.riskLevel,
          riskFactors: riskAssessment.riskFactors,
          mitigation: riskAssessment.mitigation
        },
        marketFactors: {
          demandLevel: analysis.demandLevel,
          competitionLevel: analysis.competitionLevel,
          growthPotential: analysis.growthPotential
        },
        overallScore: calculateInvestmentScore(analysis, riskAssessment, userProfile),
        reasons: generateInvestmentReasons(analysis, riskAssessment, userProfile)
      };
    })
  );

  return opportunities.sort((a, b) => b.overallScore - a.overallScore);
}

async function generateMortgageRecommendations(data: any, userProfile: any, context: any) {
  // Get available mortgage products
  const mortgageProducts = [
    {
      id: 'fixed_3_year',
      name: 'Fixed Rate 3 Year',
      type: 'FIXED',
      rate: 3.2,
      term: 30,
      lender: 'Bank of Ireland',
      features: ['Rate guarantee for 3 years', 'No early repayment charges'],
      eligibility: { minIncome: 40000, maxLTV: 90 }
    },
    {
      id: 'variable_standard',
      name: 'Standard Variable Rate',
      type: 'VARIABLE',
      rate: 3.8,
      term: 35,
      lender: 'AIB',
      features: ['Flexible repayments', 'Overpayment options'],
      eligibility: { minIncome: 35000, maxLTV: 85 }
    },
    // Add more mortgage products
  ];

  // Score products based on user profile
  const scoredProducts = mortgageProducts.map(product => {
    const suitabilityScore = calculateMortgageSuitability(product, userProfile);
    const affordabilityScore = calculateMortgageAffordability(product, userProfile);
    const competitivenessScore = calculateMortgageCompetitiveness(product, context);

    return {
      product,
      scores: {
        suitability: suitabilityScore,
        affordability: affordabilityScore,
        competitiveness: competitivenessScore
      },
      overallScore: (suitabilityScore + affordabilityScore + competitivenessScore) / 3,
      monthlyPayment: calculateMonthlyPayment(product, userProfile.preferences?.budget?.max || 400000),
      totalCost: calculateTotalMortgageCost(product, userProfile.preferences?.budget?.max || 400000),
      reasons: generateMortgageReasons(product, userProfile)
    };
  });

  return scoredProducts.sort((a, b) => b.overallScore - a.overallScore);
}

async function generateProfessionalServiceRecommendations(data: any, userProfile: any, context: any) {
  // Get professional services based on user needs
  const professionals = [
    {
      id: 'solicitor_1',
      type: 'SOLICITOR',
      name: 'Murphy & Associates',
      specializations: ['Property Law', 'Conveyancing'],
      location: 'Dublin',
      rating: 4.8,
      experience: 15,
      fees: { conveyancing: 1200 }
    },
    {
      id: 'surveyor_1',
      type: 'SURVEYOR',
      name: 'Property Survey Ireland',
      specializations: ['Structural Surveys', 'Valuations'],
      location: 'Dublin',
      rating: 4.6,
      experience: 12,
      fees: { survey: 600 }
    }
    // Add more professionals
  ];

  // Score professionals based on relevance
  const scoredProfessionals = professionals.map(professional => {
    const relevanceScore = calculateProfessionalRelevance(professional, userProfile, context);
    const qualityScore = calculateProfessionalQuality(professional);
    const valueScore = calculateProfessionalValue(professional, userProfile);

    return {
      professional,
      scores: {
        relevance: relevanceScore,
        quality: qualityScore,
        value: valueScore
      },
      overallScore: (relevanceScore + qualityScore + valueScore) / 3,
      reasons: generateProfessionalReasons(professional, userProfile),
      estimatedCost: professional.fees
    };
  });

  return scoredProfessionals.sort((a, b) => b.overallScore - a.overallScore);
}

async function generateMarketOpportunities(data: any, userProfile: any, context: any, marketAnalysis: any) {
  // Analyze market for opportunities
  const marketData = await marketAnalysis.getMarketOpportunities({
    userProfile,
    preferences: data.preferences,
    filters: data.filters
  });

  const opportunities = [
    {
      type: 'EMERGING_AREA',
      title: 'Emerging Growth Area: Clondalkin',
      description: 'Strong infrastructure development and price growth potential',
      score: 85,
      metrics: {
        priceGrowthPotential: '+15%',
        timeframe: '2-3 years',
        riskLevel: 'Medium'
      },
      reasons: ['Major transport upgrades planned', 'Below-market pricing', 'Strong rental demand']
    },
    {
      type: 'MARKET_CORRECTION',
      title: 'Market Correction Opportunity',
      description: 'Temporary price softening in premium segments',
      score: 78,
      metrics: {
        discountPotential: '8-12%',
        timeframe: '6-12 months',
        riskLevel: 'Low'
      },
      reasons: ['Temporary oversupply', 'Motivated sellers', 'Historical price support']
    }
    // Add more opportunities
  ];

  return opportunities.sort((a, b) => b.score - a.score);
}

async function generatePortfolioOptimization(data: any, userProfile: any, context: any, marketAnalysis: any) {
  // Get user's existing portfolio
  const existingProperties = await prisma.reservation.findMany({
    where: {
      userId: data.userId || userProfile.id,
      status: 'COMPLETED'
    },
    include: {
      Property: {
        include: {
          Development: true
        }
      }
    }
  });

  // Analyze portfolio and suggest optimizations
  const optimizations = [
    {
      type: 'DIVERSIFICATION',
      title: 'Geographic Diversification',
      description: 'Add properties in Cork to reduce Dublin concentration risk',
      priority: 'High',
      impact: 'Reduce portfolio risk by 15%',
      suggestedAction: 'Acquire 1-2 properties in Cork market',
      reasons: ['Current 80% Dublin concentration', 'Strong Cork fundamentals', 'Price arbitrage opportunity']
    },
    {
      type: 'YIELD_OPTIMIZATION',
      title: 'Yield Enhancement',
      description: 'Consider student accommodation for higher yields',
      priority: 'Medium',
      impact: 'Increase portfolio yield by 1.2%',
      suggestedAction: 'Explore student housing near universities',
      reasons: ['Current yield below market average', 'Strong student demand', 'Stable rental income']
    }
    // Add more optimizations
  ];

  return optimizations;
}

async function generateDevelopmentOpportunities(data: any, userProfile: any, context: any, marketAnalysis: any) {
  // Find development opportunities for developers
  const opportunities = [
    {
      type: 'LAND_OPPORTUNITY',
      title: 'Zoned Residential Land - Finglas',
      description: '2.5 acres zoned for residential development',
      score: 92,
      metrics: {
        potentialUnits: 45,
        estimatedGDV: '€18M',
        estimatedProfit: '€3.2M',
        developmentPeriod: '24 months'
      },
      reasons: ['Strong local demand', 'Transport links improving', 'Planning permission likely']
    }
    // Add more development opportunities
  ];

  return opportunities.sort((a, b) => b.score - a.score);
}

async function generateBuyerMatches(data: any, userProfile: any, context: any, buyerAnalytics: any) {
  if (!data.propertyId) {
    throw new Error('Property ID required for buyer matching');
  }

  // Get property details
  const property = await prisma.property.findUnique({
    where: { id: data.propertyId },
    include: { Development: true }
  });

  if (!property) {
    throw new Error('Property not found');
  }

  // Find matching buyers
  const potentialBuyers = await buyerAnalytics.findMatchingBuyers(property, {
    maxResults: 20,
    minMatchScore: 0.7
  });

  return potentialBuyers.map((buyer: any) => ({
    ...buyer,
    contactRecommendation: generateContactRecommendation(buyer, property),
    conversionProbability: buyer.conversionProbability,
    estimatedTimeframe: buyer.estimatedTimeframe
  }));
}

async function generatePricingOptimization(data: any, userProfile: any, context: any, marketAnalysis: any) {
  if (!data.propertyId) {
    throw new Error('Property ID required for pricing optimization');
  }

  // Get property and analyze optimal pricing
  const property = await prisma.property.findUnique({
    where: { id: data.propertyId },
    include: { Development: true }
  });

  if (!property) {
    throw new Error('Property not found');
  }

  const pricingAnalysis = await marketAnalysis.optimizePricing(property);

  return [
    {
      strategy: 'MARKET_POSITIONING',
      title: 'Competitive Market Positioning',
      currentPrice: property.price,
      recommendedPrice: pricingAnalysis.optimalPrice,
      priceAdjustment: pricingAnalysis.optimalPrice - property.price,
      reasoning: pricingAnalysis.reasoning,
      impact: {
        saleSpeed: pricingAnalysis.expectedSaleSpeed,
        demandLevel: pricingAnalysis.expectedDemand
      }
    }
  ];
}

async function generateFeatureRecommendations(data: any, userProfile: any, context: any) {
  // Recommend platform features based on user behavior
  const recommendations = [
    {
      feature: 'MORTGAGE_CALCULATOR',
      title: 'Mortgage Calculator',
      description: 'Calculate your borrowing capacity and monthly payments',
      relevanceScore: 95,
      reasons: ['Viewing properties in your budget range', 'First-time buyer profile'],
      benefits: ['Better budget planning', 'Faster property decisions']
    },
    {
      feature: 'MARKET_ALERTS',
      title: 'Price Alert Notifications',
      description: 'Get notified when properties match your criteria',
      relevanceScore: 88,
      reasons: ['Active property searching', 'Specific location preferences'],
      benefits: ['Never miss opportunities', 'First to know about new listings']
    }
    // Add more feature recommendations
  ];

  return recommendations.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

// Utility functions
function calculateActivityLevel(events: any[]): string {
  const recentEvents = events.filter(e => 
    new Date(e.eventDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  
  if (recentEvents.length > 20) return 'HIGH';
  if (recentEvents.length > 10) return 'MEDIUM';
  return 'LOW';
}

async function getCurrentMarketConditions() {
  // Simulate current market conditions
  return {
    trend: 'RISING',
    momentum: 'STRONG',
    demandLevel: 'HIGH',
    supplyLevel: 'MEDIUM',
    priceGrowth: 0.08 // 8% annual
  };
}

function getCurrentSeasonality() {
  const month = new Date().getMonth();
  const seasons = {
    'SPRING': [2, 3, 4], // March, April, May - Peak buying season
    'SUMMER': [5, 6, 7], // June, July, August - Active season
    'AUTUMN': [8, 9, 10], // September, October, November - Good season
    'WINTER': [11, 0, 1] // December, January, February - Slow season
  };

  for (const [season, months] of Object.entries(seasons)) {
    if (months.includes(month)) {
      return season;
    }
  }
  return 'SPRING';
}

async function scorePropertyForUser(property: any, userProfile: any, buyerAnalytics: any, marketAnalysis: any) {
  // Calculate various scores for the property
  const affordabilityScore = calculateAffordabilityScore(property, userProfile);
  const locationScore = calculateLocationScore(property, userProfile);
  const featureScore = calculateFeatureMatchScore(property, userProfile);
  const marketScore = await calculateMarketScore(property, marketAnalysis);
  const riskScore = calculateRiskScore(property, userProfile);

  return {
    affordability: affordabilityScore,
    location: locationScore,
    features: featureScore,
    market: marketScore,
    risk: riskScore
  };
}

function calculateOverallScore(scores: any): number {
  const weights = {
    affordability: 0.25,
    location: 0.20,
    features: 0.15,
    market: 0.25,
    risk: 0.15
  };

  return Object.entries(weights).reduce((total, [key, weight]) => {
    return total + (scores[key] || 0) * weight;
  }, 0);
}

function calculateAffordabilityScore(property: any, userProfile: any): number {
  const budget = userProfile.preferences?.budget?.max || 0;
  if (budget === 0) return 50; // Neutral score if no budget info

  const priceRatio = property.price / budget;
  
  if (priceRatio <= 0.8) return 100; // Well within budget
  if (priceRatio <= 0.95) return 80; // Within budget
  if (priceRatio <= 1.0) return 60; // At budget limit
  if (priceRatio <= 1.1) return 30; // Slightly over budget
  return 0; // Significantly over budget
}

function calculateLocationScore(property: any, userProfile: any): number {
  const preferredLocations = userProfile.preferences?.locations || [];
  if (preferredLocations.length === 0) return 70; // Neutral score

  // Check if property location matches preferred locations
  const locationMatch = preferredLocations.some((location: string) => 
    property.address.toLowerCase().includes(location.toLowerCase())
  );

  return locationMatch ? 90 : 40;
}

function calculateFeatureMatchScore(property: any, userProfile: any): number {
  const desiredFeatures = userProfile.preferences?.features || [];
  if (desiredFeatures.length === 0) return 70; // Neutral score

  // Calculate feature match percentage
  const propertyFeatures = property.features || [];
  const matchedFeatures = desiredFeatures.filter((feature: string) => 
    propertyFeatures.includes(feature)
  );

  return (matchedFeatures.length / desiredFeatures.length) * 100;
}

async function calculateMarketScore(property: any, marketAnalysis: any): number {
  // Simulate market analysis
  try {
    const marketData = await marketAnalysis.getMarketData({
      location: property.address,
      propertyType: property.propertyType
    });
    return marketData.marketScore || 75;
  } catch (error) {
    return 75; // Default score if analysis fails
  }
}

function calculateRiskScore(property: any, userProfile: any): number {
  // Lower risk = higher score
  let riskScore = 80; // Base score

  // Adjust based on property age
  if (property.yearBuilt && property.yearBuilt < 1980) riskScore -= 10;
  
  // Adjust based on price volatility in area
  if (property.Development?.location === 'City Centre') riskScore -= 5; // Higher volatility

  // Adjust based on user risk tolerance
  const riskTolerance = userProfile.riskProfile?.tolerance || 'MEDIUM';
  if (riskTolerance === 'LOW' && riskScore < 70) riskScore += 10;

  return Math.max(0, Math.min(100, riskScore));
}

function generateRecommendationReasons(scores: any, property: any, userProfile: any): string[] {
  const reasons = [];

  if (scores.affordability > 80) {
    reasons.push('Well within your budget range');
  }

  if (scores.location > 80) {
    reasons.push('Located in your preferred area');
  }

  if (scores.features > 80) {
    reasons.push('Matches most of your desired features');
  }

  if (scores.market > 80) {
    reasons.push('Strong market fundamentals in this area');
  }

  if (scores.risk > 80) {
    reasons.push('Low risk investment suitable for your profile');
  }

  return reasons.length > 0 ? reasons : ['Property matches your general criteria'];
}

async function findAlternativeProperties(property: any, allProperties: any[]): Promise<any[]> {
  // Find similar properties as alternatives
  return allProperties
    .filter(p => p.id !== property.id)
    .filter(p => Math.abs(p.price - property.price) < property.price * 0.2) // Within 20% price range
    .slice(0, 3);
}

function applyFiltersAndRanking(recommendations: any[], options: any) {
  let filtered = recommendations;

  // Apply confidence threshold
  if (options.confidenceThreshold) {
    filtered = filtered.filter(rec => rec.overallScore >= options.confidenceThreshold * 100);
  }

  // Limit results
  if (options.maxResults) {
    filtered = filtered.slice(0, options.maxResults);
  }

  return filtered;
}

async function personalizeRecommendations(recommendations: any[], userProfile: any, buyerAnalytics: any) {
  // Add personalization based on user behavior and preferences
  for (const rec of recommendations) {
    if (rec.property) {
      rec.personalization = {
        similarToViewed: checkSimilarityToViewed(rec.property, userProfile),
        matchesBehavior: checkBehaviorMatch(rec.property, userProfile),
        recommendationStrength: calculateRecommendationStrength(rec, userProfile)
      };
    }
  }
}

function checkSimilarityToViewed(property: any, userProfile: any): boolean {
  // Check if property is similar to previously viewed properties
  const viewedProperties = userProfile.behavior?.searchHistory || [];
  return viewedProperties.some((viewed: any) => 
    viewed.propertyType === property.propertyType &&
    Math.abs(viewed.price - property.price) < property.price * 0.3
  );
}

function checkBehaviorMatch(property: any, userProfile: any): boolean {
  // Check if property matches user behavior patterns
  const preferences = userProfile.preferences || {};
  return preferences.propertyTypes?.includes(property.propertyType) || false;
}

function calculateRecommendationStrength(recommendation: any, userProfile: any): string {
  const score = recommendation.overallScore;
  if (score >= 90) return 'STRONG';
  if (score >= 70) return 'MODERATE';
  return 'WEAK';
}

function calculateInvestmentScore(analysis: any, riskAssessment: any, userProfile: any): number {
  const roiWeight = 0.4;
  const riskWeight = 0.3;
  const growthWeight = 0.3;

  const roiScore = Math.min(100, (analysis.expectedROI / 0.12) * 100); // 12% = 100 score
  const riskScore = riskAssessment.riskLevel === 'LOW' ? 100 : riskAssessment.riskLevel === 'MEDIUM' ? 70 : 40;
  const growthScore = Math.min(100, (analysis.capitalGrowthProjection / 0.08) * 100); // 8% = 100 score

  return roiScore * roiWeight + riskScore * riskWeight + growthScore * growthWeight;
}

function generateInvestmentReasons(analysis: any, riskAssessment: any, userProfile: any): string[] {
  const reasons = [];

  if (analysis.expectedROI > 0.10) {
    reasons.push('High expected return on investment');
  }

  if (analysis.rentalYield > 0.06) {
    reasons.push('Strong rental yield potential');
  }

  if (riskAssessment.riskLevel === 'LOW') {
    reasons.push('Low risk investment');
  }

  if (analysis.growthPotential === 'HIGH') {
    reasons.push('High capital growth potential');
  }

  return reasons;
}

function calculateMortgageSuitability(product: any, userProfile: any): number {
  let score = 70; // Base score

  // Check income eligibility
  const income = userProfile.demographics?.income || 0;
  if (income >= product.eligibility.minIncome) score += 20;

  // Check rate type preference
  const riskTolerance = userProfile.riskProfile?.tolerance || 'MEDIUM';
  if (product.type === 'FIXED' && riskTolerance === 'LOW') score += 10;
  if (product.type === 'VARIABLE' && riskTolerance === 'HIGH') score += 10;

  return Math.min(100, score);
}

function calculateMortgageAffordability(product: any, userProfile: any): number {
  const income = userProfile.demographics?.income || 0;
  const budget = userProfile.preferences?.budget?.max || 0;
  
  if (income === 0 || budget === 0) return 50;

  const maxBorrow = income * 4.5; // Typical multiple
  const ltv = budget / (budget + (budget * 0.1)); // Assume 10% deposit
  
  let score = 70;
  if (ltv <= product.eligibility.maxLTV / 100) score += 20;
  if (budget <= maxBorrow) score += 10;

  return Math.min(100, score);
}

function calculateMortgageCompetitiveness(product: any, context: any): number {
  // Compare rate to market average
  const marketAverage = 3.5; // Example market average
  const rateDiff = product.rate - marketAverage;
  
  let score = 70;
  if (rateDiff <= -0.2) score += 30; // Significantly below market
  else if (rateDiff <= 0) score += 20; // Below market
  else if (rateDiff <= 0.2) score += 10; // Slightly above market
  
  return Math.min(100, score);
}

function calculateMonthlyPayment(product: any, loanAmount: number): number {
  const monthlyRate = product.rate / 100 / 12;
  const numPayments = product.term * 12;
  
  const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                        (Math.pow(1 + monthlyRate, numPayments) - 1);
  
  return Math.round(monthlyPayment);
}

function calculateTotalMortgageCost(product: any, loanAmount: number): number {
  const monthlyPayment = calculateMonthlyPayment(product, loanAmount);
  return monthlyPayment * product.term * 12;
}

function generateMortgageReasons(product: any, userProfile: any): string[] {
  const reasons = [];
  
  if (product.rate < 3.5) {
    reasons.push('Competitive interest rate');
  }
  
  if (product.type === 'FIXED') {
    reasons.push('Rate certainty and predictable payments');
  }
  
  if (product.features.includes('Overpayment options')) {
    reasons.push('Flexibility to pay off mortgage faster');
  }

  return reasons;
}

function calculateProfessionalRelevance(professional: any, userProfile: any, context: any): number {
  let score = 50;

  // Location relevance
  if (professional.location === userProfile.demographics?.location) score += 30;

  // Specialization relevance
  if (userProfile.behavior?.reservationHistory?.length > 0) {
    if (professional.specializations.includes('Conveyancing')) score += 20;
  }

  return Math.min(100, score);
}

function calculateProfessionalQuality(professional: any): number {
  let score = 50;

  // Rating
  score += (professional.rating - 3) * 20; // 5 stars = 90, 4 stars = 70, etc.

  // Experience
  if (professional.experience > 10) score += 15;
  else if (professional.experience > 5) score += 10;

  return Math.min(100, score);
}

function calculateProfessionalValue(professional: any, userProfile: any): number {
  // Simple value calculation - could be more sophisticated
  let score = 70;

  // Could compare fees to market average here
  // For now, assume all offer good value

  return score;
}

function generateProfessionalReasons(professional: any, userProfile: any): string[] {
  const reasons = [];

  if (professional.rating >= 4.5) {
    reasons.push('Highly rated by previous clients');
  }

  if (professional.experience > 10) {
    reasons.push('Extensive experience in property law');
  }

  if (professional.location === userProfile.demographics?.location) {
    reasons.push('Local professional familiar with area');
  }

  return reasons;
}

function generateContactRecommendation(buyer: any, property: any): string {
  if (buyer.conversionProbability > 0.8) {
    return 'HIGH_PRIORITY_CONTACT';
  } else if (buyer.conversionProbability > 0.6) {
    return 'MODERATE_PRIORITY_CONTACT';
  }
  return 'STANDARD_CONTACT';
}

async function logRecommendationUsage(data: any) {
  try {
    await prisma.aIUsageLog.create({
      data: {
        id: generateId(),
        userId: data.userId,
        service: 'AI_RECOMMENDATIONS',
        parameters: data,
        processingTime: data.processingTime,
        confidenceScore: 0.8
      }
    });
  } catch (error) {
    console.error('Error logging recommendation usage:', error);
  }
}

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}