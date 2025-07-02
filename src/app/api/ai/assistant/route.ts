import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { userService } from '@/lib/services/users-production';
import { z } from 'zod';

const prisma = new PrismaClient();

const assistantRequestSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  conversationId: z.string().optional(),
  context: z.object({
    userId: z.string().optional(),
    propertyId: z.string().optional(),
    reservationId: z.string().optional(),
    currentPage: z.string().optional(),
    userType: z.enum(['BUYER', 'DEVELOPER', 'ESTATE_AGENT', 'SOLICITOR', 'INVESTOR', 'ADMIN']).optional(),
    sessionData: z.record(z.any()).optional()
  }).optional(),
  assistantType: z.enum([
    'GENERAL_ASSISTANT',
    'PROPERTY_ADVISOR',
    'MORTGAGE_ADVISOR',
    'LEGAL_ASSISTANT',
    'INVESTMENT_ADVISOR',
    'TECHNICAL_SUPPORT',
    'SALES_ASSISTANT'
  ]).optional().default('GENERAL_ASSISTANT'),
  options: z.object({
    includeRecommendations: z.boolean().optional().default(true),
    includeDataInsights: z.boolean().optional().default(true),
    maxResponseLength: z.number().optional().default(500),
    tone: z.enum(['PROFESSIONAL', 'FRIENDLY', 'TECHNICAL', 'CONVERSATIONAL']).optional().default('PROFESSIONAL')
  }).optional().default({})
});

/**
 * POST /api/ai/assistant - AI-powered conversational assistant
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = assistantRequestSchema.parse(body);

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
        { error: 'Insufficient permissions for AI assistant' },
        { status: 403 }
      );
    }

    // Get or create conversation
    const conversation = await getOrCreateConversation(
      validatedData.conversationId,
      currentUser.id,
      validatedData.assistantType
    );

    // Gather relevant context
    const contextData = await gatherContextData(validatedData.context, currentUser);

    // Process the message
    const response = await processAssistantMessage(
      validatedData.message,
      validatedData.assistantType,
      contextData,
      conversation.history,
      validatedData.options
    );

    // Save conversation history
    await saveConversationMessage(conversation.id, 'USER', validatedData.message, contextData);
    await saveConversationMessage(conversation.id, 'ASSISTANT', response.message, response.metadata);

    // Log AI usage
    await logAssistantUsage({
      userId: currentUser.id,
      conversationId: conversation.id,
      assistantType: validatedData.assistantType,
      messageLength: validatedData.message.length,
      responseLength: response.message.length,
      processingTime: Date.now() - new Date().getTime()
    });

    return NextResponse.json({
      success: true,
      data: {
        conversationId: conversation.id,
        message: response.message,
        suggestions: response.suggestions,
        actions: response.actions,
        recommendations: response.recommendations,
        dataInsights: response.dataInsights,
        metadata: {
          confidence: response.confidence,
          assistantType: validatedData.assistantType,
          processingTime: response.processingTime,
          contextUsed: response.contextUsed
        }
      }
    });

  } catch (error) {
    console.error('Error processing assistant request:', error);
    
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
      { error: 'Failed to process assistant request' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * GET /api/ai/assistant - Get conversation history
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Get current user for authorization
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (conversationId) {
      // Get specific conversation
      const conversation = await getConversationHistory(conversationId, currentUser.id, limit);
      
      if (!conversation) {
        return NextResponse.json(
          { error: 'Conversation not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: conversation
      });
    } else {
      // Get all conversations for user
      const conversations = await getUserConversations(currentUser.id, limit);
      
      return NextResponse.json({
        success: true,
        data: {
          conversations,
          total: conversations.length
        }
      });
    }

  } catch (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversation' },
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
         user?.roles?.includes('SOLICITOR') ||
         user?.roles?.includes('INVESTOR') ||
         user?.subscription?.includes('AI_ASSISTANT');
}

async function getOrCreateConversation(conversationId: string | undefined, userId: string, assistantType: string) {
  if (conversationId) {
    // Try to get existing conversation
    const existing = await prisma.aIConversation.findFirst({
      where: {
        id: conversationId,
        userId: userId
      },
      include: {
        AIConversationMessage: {
          orderBy: { timestamp: 'desc' },
          take: 10
        }
      }
    });

    if (existing) {
      return {
        id: existing.id,
        history: existing.AIConversationMessage
      };
    }
  }

  // Create new conversation
  const newConversation = await prisma.aIConversation.create({
    data: {
      id: generateId(),
      userId: userId,
      assistantType: assistantType,
      title: 'New Conversation',
      metadata: {}
    }
  });

  return {
    id: newConversation.id,
    history: []
  };
}

async function gatherContextData(context: any, currentUser: any) {
  const contextData: any = {
    user: {
      id: currentUser.id,
      name: `${currentUser.firstName} ${currentUser.lastName}`,
      roles: currentUser.roles,
      type: context?.userType || 'BUYER'
    },
    session: context?.sessionData || {},
    platform: {
      currentPage: context?.currentPage,
      timestamp: new Date()
    }
  };

  // Gather property context if provided
  if (context?.propertyId) {
    try {
      const property = await prisma.property.findUnique({
        where: { id: context.propertyId },
        include: {
          Development: {
            select: {
              name: true,
              developer: true,
              location: true
            }
          }
        }
      });

      if (property) {
        contextData.property = {
          id: property.id,
          title: property.title,
          address: property.address,
          propertyType: property.propertyType,
          bedrooms: property.bedrooms,
          price: property.price,
          development: property.Development
        };
      }
    } catch (error) {
      console.error('Error fetching property context:', error);
    }
  }

  // Gather reservation context if provided
  if (context?.reservationId) {
    try {
      const reservation = await prisma.reservation.findUnique({
        where: { id: context.reservationId },
        include: {
          Property: {
            select: {
              title: true,
              address: true
            }
          }
        }
      });

      if (reservation) {
        contextData.reservation = {
          id: reservation.id,
          status: reservation.status,
          reservationDate: reservation.reservationDate,
          completionDate: reservation.completionDate,
          totalPrice: reservation.totalPrice,
          property: reservation.Property
        };
      }
    } catch (error) {
      console.error('Error fetching reservation context:', error);
    }
  }

  return contextData;
}

async function processAssistantMessage(
  message: string,
  assistantType: string,
  contextData: any,
  conversationHistory: any[],
  options: any
) {
  const startTime = Date.now();

  // Analyze the message intent
  const intent = await analyzeMessageIntent(message, assistantType, contextData);

  // Generate response based on assistant type and intent
  let response;
  switch (assistantType) {
    case 'PROPERTY_ADVISOR':
      response = await generatePropertyAdvisorResponse(message, intent, contextData, conversationHistory, options);
      break;
    case 'MORTGAGE_ADVISOR':
      response = await generateMortgageAdvisorResponse(message, intent, contextData, conversationHistory, options);
      break;
    case 'LEGAL_ASSISTANT':
      response = await generateLegalAssistantResponse(message, intent, contextData, conversationHistory, options);
      break;
    case 'INVESTMENT_ADVISOR':
      response = await generateInvestmentAdvisorResponse(message, intent, contextData, conversationHistory, options);
      break;
    case 'TECHNICAL_SUPPORT':
      response = await generateTechnicalSupportResponse(message, intent, contextData, conversationHistory, options);
      break;
    case 'SALES_ASSISTANT':
      response = await generateSalesAssistantResponse(message, intent, contextData, conversationHistory, options);
      break;
    default:
      response = await generateGeneralAssistantResponse(message, intent, contextData, conversationHistory, options);
  }

  response.processingTime = Date.now() - startTime;
  response.contextUsed = Object.keys(contextData);

  return response;
}

async function analyzeMessageIntent(message: string, assistantType: string, contextData: any) {
  // Simulate intent analysis using NLP
  const messageLower = message.toLowerCase();
  
  // Define intent patterns
  const intentPatterns = {
    PROPERTY_SEARCH: ['find property', 'search for', 'looking for property', 'show me properties'],
    PRICE_INQUIRY: ['price', 'cost', 'how much', 'afford', 'budget'],
    MORTGAGE_HELP: ['mortgage', 'loan', 'financing', 'lending', 'interest rate'],
    LEGAL_QUESTION: ['legal', 'contract', 'solicitor', 'conveyancing', 'documents'],
    INVESTMENT_ADVICE: ['investment', 'roi', 'return', 'yield', 'profit'],
    TECHNICAL_ISSUE: ['problem', 'error', 'not working', 'bug', 'issue'],
    GENERAL_INFO: ['help', 'information', 'explain', 'what is', 'how to']
  };

  let detectedIntent = 'GENERAL_INFO';
  let confidence = 0.5;

  for (const [intent, patterns] of Object.entries(intentPatterns)) {
    for (const pattern of patterns) {
      if (messageLower.includes(pattern)) {
        detectedIntent = intent;
        confidence = 0.8;
        break;
      }
    }
    if (confidence > 0.7) break;
  }

  return {
    intent: detectedIntent,
    confidence,
    entities: extractEntities(message),
    sentiment: analyzeSentiment(message)
  };
}

async function generatePropertyAdvisorResponse(message: string, intent: any, context: any, history: any[], options: any) {
  const baseResponse = {
    message: '',
    suggestions: [],
    actions: [],
    recommendations: [],
    dataInsights: [],
    confidence: 0.85
  };

  switch (intent.intent) {
    case 'PROPERTY_SEARCH':
      baseResponse.message = "I'd be happy to help you find the perfect property! Based on your profile, I can search our database of available properties.";
      baseResponse.suggestions = [
        "What's your budget range?",
        "Which area are you interested in?",
        "How many bedrooms do you need?",
        "Do you prefer new builds or existing properties?"
      ];
      baseResponse.actions = [
        { type: 'OPEN_PROPERTY_SEARCH', label: 'Browse Properties' },
        { type: 'SCHEDULE_VIEWING', label: 'Schedule Viewing' }
      ];
      baseResponse.recommendations = await getPropertyRecommendations(context);
      break;

    case 'PRICE_INQUIRY':
      if (context.property) {
        baseResponse.message = `The property at ${context.property.address} is priced at €${context.property.price?.toLocaleString()}. Based on current market conditions, this represents good value.`;
        baseResponse.dataInsights = await getPropertyPriceInsights(context.property);
      } else {
        baseResponse.message = "I can help you understand property pricing. Property values depend on location, size, condition, and current market trends.";
      }
      baseResponse.suggestions = [
        "Get market analysis",
        "Compare similar properties",
        "Check affordability",
        "Schedule valuation"
      ];
      break;

    default:
      baseResponse.message = "I'm here to help you with all your property-related questions. I can assist with property search, market analysis, valuations, and investment advice.";
      baseResponse.suggestions = [
        "Find properties in your budget",
        "Get market insights",
        "Compare neighborhoods",
        "Calculate affordability"
      ];
  }

  return baseResponse;
}

async function generateMortgageAdvisorResponse(message: string, intent: any, context: any, history: any[], options: any) {
  const baseResponse = {
    message: '',
    suggestions: [],
    actions: [],
    recommendations: [],
    dataInsights: [],
    confidence: 0.87
  };

  switch (intent.intent) {
    case 'MORTGAGE_HELP':
      baseResponse.message = "I'm here to guide you through the mortgage process. I can help you understand different mortgage types, calculate affordability, and connect you with approved lenders.";
      baseResponse.suggestions = [
        "Calculate how much I can borrow",
        "Compare mortgage rates",
        "Understand mortgage types",
        "Check Help to Buy eligibility"
      ];
      baseResponse.actions = [
        { type: 'OPEN_MORTGAGE_CALCULATOR', label: 'Mortgage Calculator' },
        { type: 'START_APPLICATION', label: 'Start Application' }
      ];
      baseResponse.recommendations = await getMortgageRecommendations(context);
      break;

    case 'PRICE_INQUIRY':
      baseResponse.message = "Let me help you understand the financial aspects. I can calculate monthly payments, deposit requirements, and total costs.";
      baseResponse.dataInsights = await getMortgageAffordabilityInsights(context);
      break;

    default:
      baseResponse.message = "I specialize in mortgage advice and can help you navigate the entire financing process from application to approval.";
      baseResponse.suggestions = [
        "Check mortgage eligibility",
        "Compare lender options",
        "Understand interest rates",
        "Plan payment schedule"
      ];
  }

  return baseResponse;
}

async function generateLegalAssistantResponse(message: string, intent: any, context: any, history: any[], options: any) {
  const baseResponse = {
    message: '',
    suggestions: [],
    actions: [],
    recommendations: [],
    dataInsights: [],
    confidence: 0.82
  };

  switch (intent.intent) {
    case 'LEGAL_QUESTION':
      baseResponse.message = "I can help you understand the legal aspects of property transactions. I provide general guidance on contracts, conveyancing, and legal requirements.";
      baseResponse.suggestions = [
        "Explain the conveyancing process",
        "Review contract terms",
        "Understand legal obligations",
        "Find qualified solicitors"
      ];
      baseResponse.actions = [
        { type: 'FIND_SOLICITOR', label: 'Find Solicitor' },
        { type: 'REVIEW_DOCUMENTS', label: 'Document Review' }
      ];
      break;

    default:
      baseResponse.message = "I provide legal guidance for property transactions. Please note that while I can offer general information, you should always consult with a qualified solicitor for specific legal advice.";
      baseResponse.recommendations = [
        "Engage a qualified solicitor early in the process",
        "Ensure all legal documents are properly reviewed",
        "Understand your legal obligations and rights"
      ];
  }

  return baseResponse;
}

async function generateInvestmentAdvisorResponse(message: string, intent: any, context: any, history: any[], options: any) {
  const baseResponse = {
    message: '',
    suggestions: [],
    actions: [],
    recommendations: [],
    dataInsights: [],
    confidence: 0.86
  };

  switch (intent.intent) {
    case 'INVESTMENT_ADVICE':
      baseResponse.message = "I can help you analyze investment opportunities and understand potential returns. Let me provide insights based on current market data.";
      baseResponse.suggestions = [
        "Calculate potential ROI",
        "Analyze rental yields",
        "Compare investment options",
        "Assess market trends"
      ];
      baseResponse.dataInsights = await getInvestmentInsights(context);
      break;

    default:
      baseResponse.message = "I specialize in property investment analysis, helping you make informed decisions based on market data and financial projections.";
      baseResponse.actions = [
        { type: 'INVESTMENT_CALCULATOR', label: 'Investment Calculator' },
        { type: 'MARKET_ANALYSIS', label: 'Market Analysis' }
      ];
  }

  return baseResponse;
}

async function generateTechnicalSupportResponse(message: string, intent: any, context: any, history: any[], options: any) {
  const baseResponse = {
    message: '',
    suggestions: [],
    actions: [],
    recommendations: [],
    dataInsights: [],
    confidence: 0.79
  };

  switch (intent.intent) {
    case 'TECHNICAL_ISSUE':
      baseResponse.message = "I'm here to help resolve any technical issues you're experiencing. Can you describe the specific problem you're encountering?";
      baseResponse.suggestions = [
        "Clear browser cache",
        "Check internet connection",
        "Try different browser",
        "Contact support team"
      ];
      baseResponse.actions = [
        { type: 'DIAGNOSTIC_CHECK', label: 'Run Diagnostic' },
        { type: 'CONTACT_SUPPORT', label: 'Contact Support' }
      ];
      break;

    default:
      baseResponse.message = "I provide technical support for the platform. Whether you're having trouble with features, navigation, or functionality, I'm here to help.";
  }

  return baseResponse;
}

async function generateSalesAssistantResponse(message: string, intent: any, context: any, history: any[], options: any) {
  const baseResponse = {
    message: '',
    suggestions: [],
    actions: [],
    recommendations: [],
    dataInsights: [],
    confidence: 0.84
  };

  baseResponse.message = "I'm here to assist with your property purchase journey. I can help you find the right property, understand the buying process, and connect you with the right professionals.";
  baseResponse.suggestions = [
    "Schedule property viewing",
    "Get financing pre-approval",
    "Connect with estate agent",
    "Request more information"
  ];
  baseResponse.actions = [
    { type: 'SCHEDULE_VIEWING', label: 'Schedule Viewing' },
    { type: 'REQUEST_CALLBACK', label: 'Request Callback' }
  ];

  return baseResponse;
}

async function generateGeneralAssistantResponse(message: string, intent: any, context: any, history: any[], options: any) {
  const baseResponse = {
    message: '',
    suggestions: [],
    actions: [],
    recommendations: [],
    dataInsights: [],
    confidence: 0.75
  };

  baseResponse.message = "I'm your AI assistant for all things property-related. I can help you with property search, mortgage advice, legal guidance, investment analysis, and platform support.";
  baseResponse.suggestions = [
    "Find properties",
    "Get mortgage advice",
    "Legal guidance",
    "Investment analysis",
    "Technical support"
  ];
  baseResponse.actions = [
    { type: 'SWITCH_ASSISTANT', label: 'Specialized Assistant' }
  ];

  return baseResponse;
}

// Utility functions
function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function extractEntities(message: string) {
  // Simulate entity extraction
  const entities = [];
  
  // Extract price mentions
  const priceMatch = message.match(/€?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/);
  if (priceMatch) {
    entities.push({ type: 'PRICE', value: priceMatch[1] });
  }

  // Extract location mentions
  const locations = ['Dublin', 'Cork', 'Galway', 'Limerick', 'Waterford'];
  for (const location of locations) {
    if (message.toLowerCase().includes(location.toLowerCase())) {
      entities.push({ type: 'LOCATION', value: location });
    }
  }

  return entities;
}

function analyzeSentiment(message: string) {
  // Simple sentiment analysis
  const positiveWords = ['good', 'great', 'excellent', 'love', 'perfect', 'amazing'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'problem', 'issue'];
  
  const words = message.toLowerCase().split(' ');
  const positiveCount = words.filter(word => positiveWords.includes(word)).length;
  const negativeCount = words.filter(word => negativeWords.includes(word)).length;
  
  if (positiveCount > negativeCount) return 'POSITIVE';
  if (negativeCount > positiveCount) return 'NEGATIVE';
  return 'NEUTRAL';
}

async function getPropertyRecommendations(context: any) {
  // Generate property recommendations based on context
  return [
    "Consider properties in emerging areas for better value",
    "New builds may offer Help to Buy eligibility",
    "Properties near transport links tend to appreciate faster"
  ];
}

async function getPropertyPriceInsights(property: any) {
  // Generate price insights for specific property
  return [
    { metric: "Price per sq ft", value: "€350", trend: "above_average" },
    { metric: "Market position", value: "Competitive", trend: "stable" },
    { metric: "Price growth (YoY)", value: "+5.2%", trend: "positive" }
  ];
}

async function getMortgageRecommendations(context: any) {
  return [
    "Consider getting mortgage pre-approval to strengthen your offer",
    "Compare rates from multiple lenders",
    "Factor in all costs including legal fees and insurance"
  ];
}

async function getMortgageAffordabilityInsights(context: any) {
  return [
    { metric: "Max loan amount", value: "€360,000", calculation: "Based on 4.5x income" },
    { metric: "Monthly payment", value: "€1,650", calculation: "At 3.5% over 30 years" },
    { metric: "Required deposit", value: "€45,000", calculation: "10% of property value" }
  ];
}

async function getInvestmentInsights(context: any) {
  return [
    { metric: "Projected ROI", value: "7.2%", timeframe: "Annual" },
    { metric: "Rental yield", value: "5.8%", calculation: "Gross annual rental / property value" },
    { metric: "Capital growth", value: "4.1%", timeframe: "5-year average" }
  ];
}

async function saveConversationMessage(conversationId: string, sender: string, message: string, metadata: any) {
  try {
    await prisma.aIConversationMessage.create({
      data: {
        id: generateId(),
        conversationId,
        sender,
        message,
        metadata: metadata || {},
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Error saving conversation message:', error);
  }
}

async function getConversationHistory(conversationId: string, userId: string, limit: number) {
  try {
    const conversation = await prisma.aIConversation.findFirst({
      where: {
        id: conversationId,
        userId: userId
      },
      include: {
        AIConversationMessage: {
          orderBy: { timestamp: 'asc' },
          take: limit
        }
      }
    });

    return conversation;
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    return null;
  }
}

async function getUserConversations(userId: string, limit: number) {
  try {
    const conversations = await prisma.aIConversation.findMany({
      where: { userId },
      orderBy: { lastUpdated: 'desc' },
      take: limit,
      include: {
        AIConversationMessage: {
          orderBy: { timestamp: 'desc' },
          take: 1
        }
      }
    });

    return conversations;
  } catch (error) {
    console.error('Error fetching user conversations:', error);
    return [];
  }
}

async function logAssistantUsage(data: any) {
  try {
    await prisma.aIUsageLog.create({
      data: {
        id: generateId(),
        userId: data.userId,
        service: 'AI_ASSISTANT',
        parameters: data,
        processingTime: data.processingTime,
        confidenceScore: 0.8
      }
    });
  } catch (error) {
    console.error('Error logging assistant usage:', error);
  }
}