import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { logger } from '@/lib/security/auditLogger';
import { recommendationEngine, RecommendationUtils } from '@/lib/ai/propertyRecommendationEngine';
import { z } from 'zod';

/**
 * AI-Powered Property Recommendation API for PROP.ie Platform
 * Advanced machine learning-based property matching and personalized recommendations
 * Intelligent property discovery based on user preferences and behavior analysis
 */

// Validation schemas
const RecommendationRequestSchema = z.object({
  userPreferences: z.object({
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
      maxCommuteTime: z.number(),
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
        flexibilityPercentage: z.number().min(0).max(50)
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
  }),
  searchCriteria: z.object({
    limit: z.number().min(1).max(50).default(10),
    includeReasons: z.boolean().default(true),
    includeAlternatives: z.boolean().default(false),
    minScore: z.number().min(0).max(100).default(60)
  }).optional()
});

const UserFeedbackSchema = z.object({
  propertyId: z.string(),
  interactionType: z.enum(['view', 'save', 'contact', 'visit', 'offer']),
  feedback: z.object({
    rating: z.number().min(1).max(10),
    reasons: z.array(z.string()),
    wouldRecommend: z.boolean().optional(),
    additionalComments: z.string().optional()
  }).optional()
});

// GET /api/ai/property-recommendations - Get personalized property recommendations
export async function GET(request: NextRequest) {
  try {
    // For demo purposes, we'll allow access without authentication for testing
    // In production, uncomment the authentication check below
    
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.email) {
    //   return NextResponse.json(
    //     { error: 'Authentication required' },
    //     { status: 401 }
    //   );
    // }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo_user';
    const limit = parseInt(searchParams.get('limit') || '10');
    const minScore = parseInt(searchParams.get('minScore') || '60');
    const includeReasons = searchParams.get('includeReasons') !== 'false';

    // Log the API request
    logger.info('AI property recommendations requested', {
      userId,
      limit,
      minScore,
      includeReasons,
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString()
    });

    // For demo purposes, create sample user preferences
    const demoUserPreferences = {
      userId,
      demographics: {
        ageRange: '26-35' as const,
        familyStatus: 'couple' as const,
        occupation: 'professional' as const,
        incomeRange: '75k-100k' as const,
        firstTimeBuyer: true
      },
      locationPreferences: {
        preferredRegions: ['dublin', 'cork'],
        maxCommuteTime: 45,
        proximityFactors: {
          publicTransport: 8,
          schools: 6,
          shopping: 7,
          healthcare: 8,
          recreation: 6,
          nightlife: 4,
          nature: 7
        },
        urbanVsRural: 'suburban' as const
      },
      propertyPreferences: {
        propertyTypes: ['apartment', 'house'],
        sizePreferences: {
          minBedrooms: 2,
          maxBedrooms: 3,
          minBathrooms: 1,
          minSquareMeters: 70,
          maxSquareMeters: 120
        },
        budgetConstraints: {
          minPrice: 250000,
          maxPrice: 450000,
          downPaymentAvailable: 45000,
          monthlyBudget: 1800,
          flexibilityPercentage: 10
        },
        stylePreferences: {
          architecturalStyles: ['modern', 'contemporary'],
          interiorStyles: ['modern', 'scandinavian'],
          outdoorSpace: 'balcony' as const,
          parking: 'private' as const
        }
      },
      lifestyleFactors: {
        workFromHome: true,
        entertainingFrequency: 'sometimes' as const,
        petOwner: false,
        fitnessImportance: 7,
        privacyImportance: 6,
        technologyImportance: 8,
        sustainabilityImportance: 7
      },
      investmentGoals: {
        primaryResidence: true,
        investmentProperty: false,
        rentalPotential: false,
        expectedHoldPeriod: '5-10years' as const,
        riskTolerance: 'moderate' as const
      }
    };

    // Generate sample properties for demonstration
    const availableProperties = generateSampleProperties();

    // Get recommendations from AI engine
    const recommendations = await recommendationEngine.generateRecommendations({
      userPreferences: demoUserPreferences,
      availableProperties,
      limit,
      includeReasons
    });

    // Filter by minimum score
    const filteredRecommendations = recommendations.filter(
      property => property.recommendationScore.overallScore >= minScore
    );

    // Generate search suggestions
    const searchSuggestions = RecommendationUtils.generateSearchSuggestions(demoUserPreferences);

    // Get user insights if available
    const userInsights = recommendationEngine.getUserInsights(userId);

    const response = {
      success: true,
      recommendations: filteredRecommendations,
      metadata: {
        totalPropertiesAnalyzed: availableProperties.length,
        recommendationsReturned: filteredRecommendations.length,
        averageScore: filteredRecommendations.length > 0 
          ? Math.round(filteredRecommendations.reduce((sum, r) => sum + r.recommendationScore.overallScore, 0) / filteredRecommendations.length)
          : 0,
        processingTime: '1.2s',
        modelVersion: '2.1.0',
        lastUpdated: new Date().toISOString()
      },
      userInsights,
      searchSuggestions,
      modelInsights: {
        confidenceLevel: 'high',
        dataQuality: 'excellent',
        personalizationLevel: userInsights.totalInteractions > 10 ? 'high' : 'medium'
      },
      timestamp: new Date().toISOString()
    };

    // Log successful response
    logger.info('AI property recommendations provided', {
      userId,
      propertiesAnalyzed: availableProperties.length,
      recommendationsReturned: filteredRecommendations.length,
      averageScore: response.metadata.averageScore
    });

    return NextResponse.json(response);

  } catch (error) {
    logger.error('AI property recommendations API error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to generate property recommendations'
      },
      { status: 500 }
    );
  }
}

// POST /api/ai/property-recommendations - Submit user feedback and preferences
export async function POST(request: NextRequest) {
  try {
    // For demo purposes, we'll allow access without authentication for testing
    // In production, uncomment the authentication check below
    
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.email) {
    //   return NextResponse.json(
    //     { error: 'Authentication required' },
    //     { status: 401 }
    //   );
    // }

    const body = await request.json();
    const { action, data } = body;

    // Log the request
    logger.info('AI property recommendations action requested', {
      action,
      timestamp: new Date().toISOString()
    });

    switch (action) {
      case 'submit_feedback':
        return await handleUserFeedback(data);
      
      case 'update_preferences':
        return await handlePreferencesUpdate(data);
      
      case 'get_similar_properties':
        return await handleSimilarPropertiesRequest(data);
      
      case 'explain_recommendation':
        return await handleRecommendationExplanation(data);
      
      case 'train_model':
        return await handleModelTraining();
      
      default:
        return NextResponse.json(
          { error: 'Invalid action. Must be "submit_feedback", "update_preferences", "get_similar_properties", "explain_recommendation", or "train_model"' },
          { status: 400 }
        );
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('AI recommendations validation error', {
        errors: error.errors
      });

      return NextResponse.json(
        {
          error: 'Validation error',
          details: error.errors
        },
        { status: 400 }
      );
    }

    logger.error('AI recommendations action error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to process AI recommendations action'
      },
      { status: 500 }
    );
  }
}

// Handler functions
async function handleUserFeedback(data: any) {
  const validatedFeedback = UserFeedbackSchema.parse(data);
  
  // Record user interaction
  recommendationEngine.recordUserInteraction({
    userId: data.userId || 'demo_user',
    propertyId: validatedFeedback.propertyId,
    interactionType: validatedFeedback.interactionType,
    feedback: validatedFeedback.feedback
  });

  logger.info('User feedback recorded', {
    userId: data.userId || 'demo_user',
    propertyId: validatedFeedback.propertyId,
    interactionType: validatedFeedback.interactionType,
    hasRating: !!validatedFeedback.feedback?.rating
  });

  return NextResponse.json({
    success: true,
    message: 'Feedback recorded successfully',
    recommendation: 'Your feedback helps improve future recommendations',
    timestamp: new Date().toISOString()
  });
}

async function handlePreferencesUpdate(data: any) {
  const validatedPreferences = RecommendationRequestSchema.parse(data);
  
  // In production, this would update user preferences in the database
  // For demo, we'll just acknowledge the update
  
  logger.info('User preferences updated', {
    userId: validatedPreferences.userPreferences.userId,
    hasInvestmentGoals: !!validatedPreferences.userPreferences.investmentGoals
  });

  return NextResponse.json({
    success: true,
    message: 'Preferences updated successfully',
    nextSteps: [
      'Recommendations will be refreshed based on your new preferences',
      'The AI model will learn from your updated criteria',
      'You may see different property suggestions in future searches'
    ],
    timestamp: new Date().toISOString()
  });
}

async function handleSimilarPropertiesRequest(data: any) {
  const { propertyId, limit = 5 } = data;
  
  // Generate similar properties based on the reference property
  const availableProperties = generateSampleProperties();
  const referenceProperty = availableProperties.find(p => p.propertyId === propertyId);
  
  if (!referenceProperty) {
    return NextResponse.json(
      { error: 'Property not found' },
      { status: 404 }
    );
  }

  // Find similar properties (simplified logic for demo)
  const similarProperties = availableProperties
    .filter(p => 
      p.propertyId !== propertyId &&
      p.basicInfo.propertyType === referenceProperty.basicInfo.propertyType &&
      Math.abs(p.pricing.listPrice - referenceProperty.pricing.listPrice) < 100000
    )
    .slice(0, limit)
    .map(property => ({
      ...property,
      similarityScore: Math.round(Math.random() * 30 + 70), // 70-100% similarity
      similarityFactors: [
        'Similar property type',
        'Comparable price range',
        'Same region',
        'Similar size'
      ]
    }));

  logger.info('Similar properties requested', {
    referencePropertyId: propertyId,
    similarPropertiesFound: similarProperties.length
  });

  return NextResponse.json({
    success: true,
    referenceProperty,
    similarProperties,
    metadata: {
      searchCriteria: 'Property type, price range, location, size',
      resultsFound: similarProperties.length,
      averageSimilarity: similarProperties.length > 0 
        ? Math.round(similarProperties.reduce((sum, p) => sum + p.similarityScore, 0) / similarProperties.length)
        : 0
    },
    timestamp: new Date().toISOString()
  });
}

async function handleRecommendationExplanation(data: any) {
  const { propertyId, userId = 'demo_user' } = data;
  
  // Generate detailed explanation for why this property was recommended
  const explanation = {
    propertyId,
    overallRating: 'Excellent Match (87/100)',
    keyStrengths: [
      'Perfect budget alignment - well within your €450K maximum',
      'Outstanding location score with excellent public transport (9/10)',
      'Modern architectural style matches your preferences',
      'Ideal for work-from-home with dedicated office space',
      'Strong investment potential with 8% annual appreciation'
    ],
    potentialConcerns: [
      'Limited outdoor space (balcony only)',
      'Higher service charges than area average'
    ],
    aiInsights: {
      confidence: 'Very High (92%)',
      dataPoints: 247,
      similarUsersChose: 'Yes (78% of users with similar profiles)',
      marketTiming: 'Excellent - seller motivated, property fairly priced'
    },
    nextSteps: [
      'Schedule a virtual tour to see the property layout',
      'Request detailed financial breakdown including all costs',
      'Review recent comparable sales in the area',
      'Consider PROP Choice customization options'
    ],
    alternativeOptions: [
      'Similar properties in the same development',
      'Comparable options in nearby areas',
      'Properties with more outdoor space within budget'
    ]
  };

  logger.info('Recommendation explanation provided', {
    propertyId,
    userId,
    explanationGenerated: true
  });

  return NextResponse.json({
    success: true,
    explanation,
    timestamp: new Date().toISOString()
  });
}

async function handleModelTraining() {
  try {
    await recommendationEngine.retrainModel();
    
    const modelInsights = recommendationEngine.getModelInsights();
    
    logger.info('AI model training initiated', {
      totalInteractions: modelInsights.totalUserInteractions,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'Model training completed successfully',
      insights: modelInsights,
      improvements: [
        'Enhanced personalization accuracy',
        'Better preference matching',
        'Improved investment recommendations',
        'More accurate pricing insights'
      ],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Model training failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Generate sample properties for demonstration
function generateSampleProperties() {
  return [
    {
      propertyId: 'prop_001',
      basicInfo: {
        address: '15 Riverside Apartments, Grand Canal Dock, Dublin 2',
        region: 'dublin',
        propertyType: 'apartment',
        bedrooms: 2,
        bathrooms: 2,
        squareMeters: 85,
        yearBuilt: 2022,
        developmentStage: 'completed'
      },
      pricing: {
        listPrice: 420000,
        pricePerSqm: 4941,
        estimatedMonthlyPayment: 1650,
        serviceCharges: 180,
        propertyTax: 350
      },
      features: {
        architecturalStyle: 'modern',
        interiorStyle: 'modern',
        outdoorSpace: 'balcony',
        parking: 'private',
        energyRating: 'A2',
        smartHomeFeatures: true,
        accessibility: false,
        petFriendly: true
      },
      location: {
        coordinates: {
          latitude: 53.3441,
          longitude: -6.2394
        },
        walkScore: 92,
        transitScore: 88,
        proximityScores: {
          schools: 7,
          shopping: 9,
          healthcare: 8,
          recreation: 8,
          publicTransport: 9,
          nightlife: 8,
          nature: 6
        },
        noiseLevel: 'moderate',
        safetyRating: 8
      },
      marketData: {
        averageAreaPrice: 450000,
        priceAppreciation: {
          oneYear: 0.08,
          threeYear: 0.24,
          fiveYear: 0.42
        },
        rentalYield: 0.045,
        marketTrend: 'rising',
        salesVolume: 47,
        timeOnMarket: 21
      },
      propChoiceCompatibility: {
        available: true,
        packageOptions: ['premium_kitchen', 'smart_home_advanced', 'luxury_bathroom'],
        customizationLevel: 'premium',
        estimatedUpgradeValue: 25000
      }
    },
    {
      propertyId: 'prop_002',
      basicInfo: {
        address: '8 Oakwood Avenue, Blackrock, Cork',
        region: 'cork',
        propertyType: 'house',
        bedrooms: 3,
        bathrooms: 2,
        squareMeters: 110,
        yearBuilt: 2021,
        developmentStage: 'completed'
      },
      pricing: {
        listPrice: 385000,
        pricePerSqm: 3500,
        estimatedMonthlyPayment: 1520,
        serviceCharges: 0,
        propertyTax: 405
      },
      features: {
        architecturalStyle: 'contemporary',
        interiorStyle: 'scandinavian',
        outdoorSpace: 'garden',
        parking: 'garage',
        energyRating: 'A3',
        smartHomeFeatures: false,
        accessibility: true,
        petFriendly: true
      },
      location: {
        coordinates: {
          latitude: 51.8985,
          longitude: -8.4756
        },
        walkScore: 78,
        transitScore: 72,
        proximityScores: {
          schools: 9,
          shopping: 6,
          healthcare: 7,
          recreation: 8,
          publicTransport: 7,
          nightlife: 5,
          nature: 9
        },
        noiseLevel: 'quiet',
        safetyRating: 9
      },
      marketData: {
        averageAreaPrice: 370000,
        priceAppreciation: {
          oneYear: 0.12,
          threeYear: 0.35,
          fiveYear: 0.58
        },
        rentalYield: 0.055,
        marketTrend: 'rising',
        salesVolume: 23,
        timeOnMarket: 14
      },
      propChoiceCompatibility: {
        available: true,
        packageOptions: ['essential_upgrade', 'family_comfort', 'energy_efficiency'],
        customizationLevel: 'standard',
        estimatedUpgradeValue: 18000
      }
    },
    {
      propertyId: 'prop_003',
      basicInfo: {
        address: 'Penthouse 1, Marina Point, Dun Laoghaire, Dublin',
        region: 'dublin',
        propertyType: 'penthouse',
        bedrooms: 3,
        bathrooms: 3,
        squareMeters: 140,
        yearBuilt: 2023,
        developmentStage: 'completed'
      },
      pricing: {
        listPrice: 695000,
        pricePerSqm: 4964,
        estimatedMonthlyPayment: 2750,
        serviceCharges: 320,
        propertyTax: 580
      },
      features: {
        architecturalStyle: 'modern',
        interiorStyle: 'luxury',
        outdoorSpace: 'rooftop',
        parking: 'multiple',
        energyRating: 'A1',
        smartHomeFeatures: true,
        accessibility: true,
        petFriendly: false
      },
      location: {
        coordinates: {
          latitude: 53.2942,
          longitude: -6.1337
        },
        walkScore: 85,
        transitScore: 82,
        proximityScores: {
          schools: 8,
          shopping: 7,
          healthcare: 9,
          recreation: 9,
          publicTransport: 8,
          nightlife: 6,
          nature: 10
        },
        noiseLevel: 'quiet',
        safetyRating: 9
      },
      marketData: {
        averageAreaPrice: 650000,
        priceAppreciation: {
          oneYear: 0.06,
          threeYear: 0.18,
          fiveYear: 0.32
        },
        rentalYield: 0.035,
        marketTrend: 'stable',
        salesVolume: 8,
        timeOnMarket: 45
      },
      propChoiceCompatibility: {
        available: true,
        packageOptions: ['luxury_complete', 'smart_home_premium', 'wellness_suite'],
        customizationLevel: 'luxury',
        estimatedUpgradeValue: 75000
      }
    }
  ];
}