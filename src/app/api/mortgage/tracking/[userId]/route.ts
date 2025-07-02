import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { userService } from '@/lib/services/users-production';
import { z } from 'zod';

const prisma = new PrismaClient();

const updateTrackingSchema = z.object({
  status: z.enum(['INITIAL', 'APPLICATION_SUBMITTED', 'UNDER_REVIEW', 'ADDITIONAL_INFO_REQUIRED', 'AIP_ISSUED', 'FORMAL_APPLICATION', 'SURVEY_ORDERED', 'SURVEY_COMPLETED', 'VALUATION_COMPLETE', 'UNDERWRITING', 'OFFER_ISSUED', 'OFFER_ACCEPTED', 'LEGAL_PROCESS', 'FUNDS_RELEASED', 'COMPLETED', 'REJECTED', 'WITHDRAWN']).optional(),
  lender: z.string().optional(),
  lenderName: z.string().optional(),
  mortgageType: z.enum(['FIXED', 'VARIABLE', 'TRACKER', 'SPLIT_RATE', 'OFFSET']).optional(),
  amount: z.number().optional(),
  interestRate: z.number().optional(),
  term: z.number().optional(),
  loanToValue: z.number().optional(),
  monthlyPayment: z.number().optional(),
  aipDate: z.string().optional(),
  aipExpiryDate: z.string().optional(),
  aipAmount: z.number().optional(),
  formalOfferDate: z.string().optional(),
  offerExpiryDate: z.string().optional(),
  drawdownDate: z.string().optional(),
  completionDate: z.string().optional(),
  brokerDetails: z.object({
    brokerName: z.string().optional(),
    brokerFirm: z.string().optional(),
    contactEmail: z.string().optional(),
    contactPhone: z.string().optional()
  }).optional(),
  solicitorDetails: z.object({
    solicitorName: z.string().optional(),
    solicitorFirm: z.string().optional(),
    contactEmail: z.string().optional(),
    contactPhone: z.string().optional()
  }).optional(),
  conditions: z.array(z.string()).optional(),
  notes: z.string().optional(),
  milestones: z.array(z.object({
    milestone: z.string(),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE']),
    dueDate: z.string().optional(),
    completedDate: z.string().optional(),
    notes: z.string().optional()
  })).optional()
});

/**
 * GET /api/mortgage/tracking/[userId] - Get comprehensive mortgage tracking information
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get current user for authorization
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check permissions
    if (currentUser.id !== userId && !isAdmin(currentUser)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Get comprehensive mortgage tracking data
    const [
      mortgageTracking,
      mortgageApplications,
      mortgageOffers,
      mortgageDocuments,
      recentActivity
    ] = await Promise.all([
      // Primary mortgage tracking record
      prisma.mortgageTracking.findUnique({
        where: { userId },
        include: {
          MortgageDocument: {
            orderBy: { uploadDate: 'desc' },
            take: 20
          }
        }
      }),

      // All mortgage applications
      prisma.mortgageApplication.findMany({
        where: { userId },
        orderBy: { applicationDate: 'desc' },
        include: {
          MortgageOffer: {
            orderBy: { createdAt: 'desc' }
          }
        }
      }),

      // Latest mortgage offers
      prisma.mortgageOffer.findMany({
        where: {
          MortgageApplication: {
            userId
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),

      // Recent mortgage documents
      prisma.mortgageDocument.findMany({
        where: {
          MortgageTracking: {
            userId
          }
        },
        orderBy: { uploadDate: 'desc' },
        take: 10,
        include: {
          UploadedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      }),

      // Recent mortgage-related buyer events
      prisma.buyerEvent.findMany({
        where: {
          buyerId: userId,
          eventType: {
            in: ['MORTGAGE_APPLIED', 'MORTGAGE_AIP_RECEIVED', 'MORTGAGE_OFFER_RECEIVED', 'MORTGAGE_COMPLETED']
          }
        },
        orderBy: { eventDate: 'desc' },
        take: 15
      })
    ]);

    // Calculate progress and analytics
    const progress = calculateMortgageProgress(mortgageTracking, mortgageApplications);
    const timeline = generateMortgageTimeline(mortgageTracking, recentActivity);
    const affordabilityAnalysis = await calculateAffordabilityAnalysis(userId, mortgageTracking);
    const nextSteps = generateMortgageNextSteps(mortgageTracking, mortgageApplications);
    const alerts = generateMortgageAlerts(mortgageTracking, mortgageOffers);

    return NextResponse.json({
      success: true,
      data: {
        tracking: mortgageTracking ? {
          ...mortgageTracking,
          statusDisplay: getMortgageStatusDisplay(mortgageTracking.status),
          daysInCurrentStatus: calculateDaysInStatus(mortgageTracking.lastUpdated),
          isAipActive: isAipActive(mortgageTracking.aipExpiryDate),
          timeToCompletion: estimateTimeToCompletion(mortgageTracking.status)
        } : null,
        applications: mortgageApplications.map(app => ({
          ...app,
          statusDisplay: getApplicationStatusDisplay(app.status),
          timeAgo: calculateTimeAgo(app.applicationDate),
          offerCount: app.MortgageOffer.length,
          bestOffer: app.MortgageOffer[0] || null
        })),
        offers: mortgageOffers.map(offer => ({
          ...offer,
          timeAgo: calculateTimeAgo(offer.createdAt),
          competitiveness: calculateOfferCompetitiveness(offer, mortgageOffers),
          monthlyAffordability: calculateMonthlyAffordability(offer.monthlyPayment)
        })),
        documents: mortgageDocuments.map(doc => ({
          ...doc,
          timeAgo: calculateTimeAgo(doc.uploadDate),
          isExpiring: doc.expiryDate ? isDocumentExpiring(doc.expiryDate) : false
        })),
        progress,
        timeline,
        affordabilityAnalysis,
        nextSteps,
        alerts,
        summary: {
          hasActiveApplication: mortgageApplications.some(app => ['SUBMITTED', 'UNDER_REVIEW'].includes(app.status)),
          hasAip: mortgageTracking?.aipDate ? isAipActive(mortgageTracking.aipExpiryDate) : false,
          hasOffer: mortgageTracking?.formalOfferDate !== null,
          totalOffers: mortgageOffers.length,
          averageInterestRate: calculateAverageInterestRate(mortgageOffers),
          estimatedCompletion: estimateCompletionDate(mortgageTracking)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching mortgage tracking:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mortgage tracking information' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * PUT /api/mortgage/tracking/[userId] - Update mortgage tracking information
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const body = await request.json();
    const validatedData = updateTrackingSchema.parse(body);

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get current user for authorization
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check permissions - user or authorized professional can update
    const canUpdate = currentUser.id === userId || 
                     isAdmin(currentUser) ||
                     currentUser.roles?.includes('MORTGAGE_BROKER') ||
                     currentUser.roles?.includes('SOLICITOR');

    if (!canUpdate) {
      return NextResponse.json(
        { error: 'Insufficient permissions to update mortgage tracking' },
        { status: 403 }
      );
    }

    // Get existing tracking record
    const existingTracking = await prisma.mortgageTracking.findUnique({
      where: { userId }
    });

    const updateData: any = {
      lastUpdated: new Date()
    };

    // Map validated data to update object
    Object.keys(validatedData).forEach(key => {
      if (validatedData[key as keyof typeof validatedData] !== undefined) {
        switch (key) {
          case 'aipDate':
          case 'aipExpiryDate':
          case 'formalOfferDate':
          case 'offerExpiryDate':
          case 'drawdownDate':
          case 'completionDate':
            updateData[key] = validatedData[key as keyof typeof validatedData] ? 
              new Date(validatedData[key as keyof typeof validatedData] as string) : null;
            break;
          case 'brokerDetails':
          case 'solicitorDetails':
          case 'conditions':
          case 'milestones':
            updateData[key] = validatedData[key as keyof typeof validatedData];
            break;
          default:
            updateData[key] = validatedData[key as keyof typeof validatedData];
        }
      }
    });

    // Create or update tracking record
    const updatedTracking = existingTracking ? 
      await prisma.mortgageTracking.update({
        where: { userId },
        data: updateData,
        include: {
          MortgageDocument: {
            orderBy: { uploadDate: 'desc' },
            take: 5
          }
        }
      }) :
      await prisma.mortgageTracking.create({
        data: {
          id: generateId(),
          userId,
          ...updateData
        },
        include: {
          MortgageDocument: {
            orderBy: { uploadDate: 'desc' },
            take: 5
          }
        }
      });

    // Log status change if status was updated
    if (validatedData.status && validatedData.status !== existingTracking?.status) {
      await prisma.buyerEvent.create({
        data: {
          id: generateId(),
          buyerId: userId,
          eventType: 'MORTGAGE_STATUS_CHANGED',
          eventDate: new Date(),
          eventData: {
            previousStatus: existingTracking?.status,
            newStatus: validatedData.status,
            updatedBy: currentUser.id,
            lender: validatedData.lender
          },
          description: `Mortgage status changed to ${validatedData.status}`
        }
      });

      // Create milestone events for significant status changes
      await createMilestoneEvents(userId, validatedData.status, currentUser.id);
    }

    // Update related buyer journey if mortgage reaches key milestones
    if (validatedData.status && ['AIP_ISSUED', 'OFFER_ISSUED', 'COMPLETED'].includes(validatedData.status)) {
      await updateBuyerJourneyProgress(userId, validatedData.status);
    }

    return NextResponse.json({
      success: true,
      data: {
        tracking: {
          ...updatedTracking,
          statusDisplay: getMortgageStatusDisplay(updatedTracking.status),
          daysInCurrentStatus: calculateDaysInStatus(updatedTracking.lastUpdated),
          isAipActive: isAipActive(updatedTracking.aipExpiryDate)
        },
        message: 'Mortgage tracking updated successfully'
      }
    });

  } catch (error) {
    console.error('Error updating mortgage tracking:', error);
    
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
      { error: 'Failed to update mortgage tracking' },
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

function isAdmin(user: any): boolean {
  return user?.roles?.includes('ADMIN') || user?.roles?.includes('SUPER_ADMIN');
}

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function calculateTimeAgo(date: Date | string): string {
  const now = new Date();
  const eventDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - eventDate.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
}

function calculateMortgageProgress(mortgageTracking: any, applications: any[]) {
  const stages = [
    'INITIAL', 'APPLICATION_SUBMITTED', 'UNDER_REVIEW', 'AIP_ISSUED', 
    'FORMAL_APPLICATION', 'SURVEY_COMPLETED', 'OFFER_ISSUED', 'OFFER_ACCEPTED', 
    'LEGAL_PROCESS', 'FUNDS_RELEASED', 'COMPLETED'
  ];

  const currentStageIndex = mortgageTracking ? 
    stages.indexOf(mortgageTracking.status) : 0;

  const progressPercentage = currentStageIndex >= 0 ? 
    Math.round((currentStageIndex / (stages.length - 1)) * 100) : 0;

  return {
    currentStage: mortgageTracking?.status || 'INITIAL',
    currentStageIndex,
    totalStages: stages.length,
    progressPercentage,
    stagesCompleted: Math.max(0, currentStageIndex),
    estimatedDaysRemaining: estimateDaysRemaining(mortgageTracking?.status),
    milestones: generateProgressMilestones(mortgageTracking, applications)
  };
}

function generateMortgageTimeline(mortgageTracking: any, recentActivity: any[]) {
  const timeline = [];

  // Add mortgage tracking events
  if (mortgageTracking) {
    if (mortgageTracking.aipDate) {
      timeline.push({
        date: mortgageTracking.aipDate,
        event: 'Agreement in Principle Issued',
        type: 'milestone',
        description: `AIP for €${mortgageTracking.aipAmount?.toLocaleString()} received`
      });
    }

    if (mortgageTracking.formalOfferDate) {
      timeline.push({
        date: mortgageTracking.formalOfferDate,
        event: 'Formal Mortgage Offer Received',
        type: 'milestone',
        description: `Offer for €${mortgageTracking.amount?.toLocaleString()} at ${mortgageTracking.interestRate}%`
      });
    }

    if (mortgageTracking.drawdownDate) {
      timeline.push({
        date: mortgageTracking.drawdownDate,
        event: 'Funds Drawn Down',
        type: 'milestone',
        description: 'Mortgage funds released to solicitor'
      });
    }
  }

  // Add buyer events
  recentActivity.forEach(event => {
    timeline.push({
      date: event.eventDate,
      event: formatEventTitle(event.eventType),
      type: 'activity',
      description: event.description || formatEventDescription(event.eventType)
    });
  });

  return timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

async function calculateAffordabilityAnalysis(userId: string, mortgageTracking: any) {
  // Get latest affordability check
  const latestAffordability = await prisma.affordabilityCheck.findFirst({
    where: { journeyId: userId },
    orderBy: { created: 'desc' }
  });

  if (!latestAffordability || !mortgageTracking) {
    return {
      status: 'no_data',
      message: 'No affordability data available'
    };
  }

  const monthlyIncome = latestAffordability.grossMonthlyIncome || 0;
  const monthlyPayment = mortgageTracking.monthlyPayment || 0;
  const affordabilityRatio = monthlyIncome > 0 ? (monthlyPayment / monthlyIncome) * 100 : 0;

  return {
    monthlyIncome: latestAffordability.grossMonthlyIncome,
    monthlyPayment: mortgageTracking.monthlyPayment,
    affordabilityRatio: Math.round(affordabilityRatio),
    maxAffordable: latestAffordability.maxMortgage,
    currentMortgage: mortgageTracking.amount,
    utilisationPercentage: latestAffordability.maxMortgage > 0 ? 
      Math.round((mortgageTracking.amount / latestAffordability.maxMortgage) * 100) : 0,
    recommendation: getAffordabilityRecommendation(affordabilityRatio),
    riskLevel: getAffordabilityRiskLevel(affordabilityRatio)
  };
}

function generateMortgageNextSteps(mortgageTracking: any, applications: any[]) {
  const steps = [];

  if (!mortgageTracking || mortgageTracking.status === 'INITIAL') {
    steps.push({
      priority: 'high',
      title: 'Submit Mortgage Application',
      description: 'Complete and submit your first mortgage application',
      action: 'start_application',
      timeframe: 'Now'
    });
    return steps;
  }

  switch (mortgageTracking.status) {
    case 'APPLICATION_SUBMITTED':
      steps.push({
        priority: 'medium',
        title: 'Await Lender Response',
        description: 'Your application is being reviewed by the lender',
        action: 'wait_for_response',
        timeframe: '5-10 business days'
      });
      break;

    case 'ADDITIONAL_INFO_REQUIRED':
      steps.push({
        priority: 'high',
        title: 'Provide Additional Information',
        description: 'Submit the requested documents to your lender',
        action: 'submit_documents',
        timeframe: 'Within 7 days'
      });
      break;

    case 'AIP_ISSUED':
      steps.push({
        priority: 'high',
        title: 'Submit Formal Application',
        description: 'Complete your formal mortgage application',
        action: 'formal_application',
        timeframe: 'Within 30 days'
      });
      break;

    case 'SURVEY_ORDERED':
      steps.push({
        priority: 'medium',
        title: 'Coordinate Property Survey',
        description: 'Arrange access for the property surveyor',
        action: 'coordinate_survey',
        timeframe: '2-3 weeks'
      });
      break;

    case 'OFFER_ISSUED':
      steps.push({
        priority: 'high',
        title: 'Accept Mortgage Offer',
        description: 'Review and accept the formal mortgage offer',
        action: 'accept_offer',
        timeframe: 'Within offer validity period'
      });
      break;

    case 'OFFER_ACCEPTED':
      steps.push({
        priority: 'high',
        title: 'Coordinate with Solicitor',
        description: 'Ensure legal work is progressing',
        action: 'solicitor_coordination',
        timeframe: 'Ongoing'
      });
      break;
  }

  return steps;
}

function generateMortgageAlerts(mortgageTracking: any, offers: any[]) {
  const alerts = [];

  if (!mortgageTracking) return alerts;

  // AIP expiry alert
  if (mortgageTracking.aipExpiryDate) {
    const daysUntilExpiry = Math.ceil((new Date(mortgageTracking.aipExpiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry <= 14 && daysUntilExpiry > 0) {
      alerts.push({
        type: 'warning',
        title: 'AIP Expiring Soon',
        message: `Your Agreement in Principle expires in ${daysUntilExpiry} days`,
        priority: 'high',
        action: 'renew_aip'
      });
    }
  }

  // Offer expiry alert
  if (mortgageTracking.offerExpiryDate) {
    const daysUntilExpiry = Math.ceil((new Date(mortgageTracking.offerExpiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
      alerts.push({
        type: 'critical',
        title: 'Mortgage Offer Expiring',
        message: `Your mortgage offer expires in ${daysUntilExpiry} days`,
        priority: 'critical',
        action: 'accept_offer'
      });
    }
  }

  // Better offers available
  if (offers.length > 1 && mortgageTracking.interestRate) {
    const betterOffers = offers.filter(offer => 
      offer.interestRate < mortgageTracking.interestRate - 0.1
    );
    
    if (betterOffers.length > 0) {
      alerts.push({
        type: 'info',
        title: 'Better Rates Available',
        message: `${betterOffers.length} offers with better rates available`,
        priority: 'medium',
        action: 'review_offers'
      });
    }
  }

  return alerts;
}

// Additional helper functions
function getMortgageStatusDisplay(status: string): any {
  const statusMap: any = {
    'INITIAL': { label: 'Getting Started', color: 'gray', description: 'Beginning mortgage process' },
    'APPLICATION_SUBMITTED': { label: 'Application Submitted', color: 'blue', description: 'Application under review' },
    'UNDER_REVIEW': { label: 'Under Review', color: 'yellow', description: 'Lender reviewing application' },
    'ADDITIONAL_INFO_REQUIRED': { label: 'Info Required', color: 'orange', description: 'Additional documents needed' },
    'AIP_ISSUED': { label: 'AIP Issued', color: 'green', description: 'Agreement in Principle received' },
    'FORMAL_APPLICATION': { label: 'Formal Application', color: 'blue', description: 'Processing formal application' },
    'SURVEY_ORDERED': { label: 'Survey Ordered', color: 'blue', description: 'Property survey scheduled' },
    'SURVEY_COMPLETED': { label: 'Survey Complete', color: 'green', description: 'Property survey finished' },
    'OFFER_ISSUED': { label: 'Offer Issued', color: 'green', description: 'Mortgage offer received' },
    'OFFER_ACCEPTED': { label: 'Offer Accepted', color: 'green', description: 'Offer accepted, proceeding' },
    'LEGAL_PROCESS': { label: 'Legal Process', color: 'blue', description: 'Legal work in progress' },
    'FUNDS_RELEASED': { label: 'Funds Released', color: 'green', description: 'Mortgage funds drawn down' },
    'COMPLETED': { label: 'Completed', color: 'green', description: 'Mortgage process complete' },
    'REJECTED': { label: 'Rejected', color: 'red', description: 'Application rejected' },
    'WITHDRAWN': { label: 'Withdrawn', color: 'gray', description: 'Application withdrawn' }
  };

  return statusMap[status] || { label: status, color: 'gray', description: 'Unknown status' };
}

function calculateDaysInStatus(lastUpdated: Date | string): number {
  return Math.ceil((Date.now() - new Date(lastUpdated).getTime()) / (1000 * 60 * 60 * 24));
}

function isAipActive(aipExpiryDate: Date | string | null): boolean {
  if (!aipExpiryDate) return false;
  return new Date(aipExpiryDate) > new Date();
}

function estimateTimeToCompletion(status: string): string {
  const timeMap: any = {
    'INITIAL': '8-12 weeks',
    'APPLICATION_SUBMITTED': '6-10 weeks',
    'UNDER_REVIEW': '5-8 weeks',
    'AIP_ISSUED': '4-6 weeks',
    'FORMAL_APPLICATION': '3-5 weeks',
    'SURVEY_ORDERED': '2-4 weeks',
    'OFFER_ISSUED': '2-3 weeks',
    'OFFER_ACCEPTED': '1-2 weeks',
    'LEGAL_PROCESS': '1-2 weeks',
    'FUNDS_RELEASED': 'Complete',
    'COMPLETED': 'Complete'
  };

  return timeMap[status] || 'Unknown';
}

function getApplicationStatusDisplay(status: string): any {
  const statusMap: any = {
    'SUBMITTED': { label: 'Submitted', color: 'blue' },
    'UNDER_REVIEW': { label: 'Under Review', color: 'yellow' },
    'APPROVED': { label: 'Approved', color: 'green' },
    'REJECTED': { label: 'Rejected', color: 'red' },
    'WITHDRAWN': { label: 'Withdrawn', color: 'gray' }
  };

  return statusMap[status] || { label: status, color: 'gray' };
}

function calculateOfferCompetitiveness(offer: any, allOffers: any[]): string {
  if (allOffers.length < 2) return 'N/A';

  const rates = allOffers.map(o => o.interestRate).sort((a, b) => a - b);
  const offerRank = rates.indexOf(offer.interestRate) + 1;
  const percentile = ((rates.length - offerRank + 1) / rates.length) * 100;

  if (percentile >= 80) return 'Excellent';
  if (percentile >= 60) return 'Very Good';
  if (percentile >= 40) return 'Good';
  if (percentile >= 20) return 'Fair';
  return 'Poor';
}

function calculateMonthlyAffordability(monthlyPayment: number): any {
  // Rough affordability calculation - typically should be <35% of gross income
  return {
    payment: monthlyPayment,
    recommendedIncome: Math.round(monthlyPayment / 0.35),
    maxRecommendedPayment: Math.round(monthlyPayment * 1.4) // 40% of income
  };
}

function isDocumentExpiring(expiryDate: Date | string): boolean {
  const expiry = new Date(expiryDate);
  const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  return expiry <= thirtyDaysFromNow;
}

function calculateAverageInterestRate(offers: any[]): number {
  if (offers.length === 0) return 0;
  const totalRate = offers.reduce((sum, offer) => sum + offer.interestRate, 0);
  return Math.round((totalRate / offers.length) * 100) / 100;
}

function estimateCompletionDate(mortgageTracking: any): Date | null {
  if (!mortgageTracking) return null;

  const statusWeeks: any = {
    'INITIAL': 12,
    'APPLICATION_SUBMITTED': 8,
    'UNDER_REVIEW': 6,
    'AIP_ISSUED': 5,
    'FORMAL_APPLICATION': 4,
    'SURVEY_ORDERED': 3,
    'OFFER_ISSUED': 2,
    'OFFER_ACCEPTED': 1,
    'LEGAL_PROCESS': 1
  };

  const weeksRemaining = statusWeeks[mortgageTracking.status] || 0;
  if (weeksRemaining === 0) return null;

  return new Date(Date.now() + weeksRemaining * 7 * 24 * 60 * 60 * 1000);
}

async function createMilestoneEvents(userId: string, status: string, createdBy: string) {
  const milestoneMap: any = {
    'AIP_ISSUED': 'Agreement in Principle received',
    'OFFER_ISSUED': 'Formal mortgage offer received',
    'OFFER_ACCEPTED': 'Mortgage offer accepted',
    'COMPLETED': 'Mortgage process completed'
  };

  if (milestoneMap[status]) {
    await prisma.buyerEvent.create({
      data: {
        id: generateId(),
        buyerId: userId,
        eventType: 'MORTGAGE_MILESTONE',
        eventDate: new Date(),
        eventData: {
          milestone: status,
          description: milestoneMap[status],
          createdBy
        },
        description: milestoneMap[status]
      }
    });
  }
}

async function updateBuyerJourneyProgress(userId: string, mortgageStatus: string) {
  // Update buyer journey phase based on mortgage milestones
  let newPhase = null;

  switch (mortgageStatus) {
    case 'AIP_ISSUED':
      newPhase = 'SEARCHING';
      break;
    case 'OFFER_ISSUED':
      newPhase = 'FINANCING';
      break;
    case 'COMPLETED':
      newPhase = 'COMPLETION';
      break;
  }

  if (newPhase) {
    await prisma.buyerJourneys.updateMany({
      where: { buyerId: userId },
      data: {
        currentPhase: newPhase,
        lastUpdated: new Date()
      }
    });
  }
}

function generateProgressMilestones(mortgageTracking: any, applications: any[]) {
  const milestones = [
    { name: 'Application Submitted', completed: false, date: null },
    { name: 'AIP Received', completed: false, date: null },
    { name: 'Formal Application', completed: false, date: null },
    { name: 'Survey Complete', completed: false, date: null },
    { name: 'Offer Received', completed: false, date: null },
    { name: 'Offer Accepted', completed: false, date: null },
    { name: 'Funds Released', completed: false, date: null }
  ];

  // Update based on applications
  if (applications.length > 0) {
    milestones[0].completed = true;
    milestones[0].date = applications[0].applicationDate;
  }

  // Update based on tracking status
  if (mortgageTracking) {
    if (mortgageTracking.aipDate) {
      milestones[1].completed = true;
      milestones[1].date = mortgageTracking.aipDate;
    }

    const statusMilestones: any = {
      'FORMAL_APPLICATION': 2,
      'SURVEY_COMPLETED': 3,
      'OFFER_ISSUED': 4,
      'OFFER_ACCEPTED': 5,
      'FUNDS_RELEASED': 6,
      'COMPLETED': 6
    };

    const completedIndex = statusMilestones[mortgageTracking.status];
    if (completedIndex !== undefined) {
      for (let i = 2; i <= completedIndex; i++) {
        milestones[i].completed = true;
        milestones[i].date = mortgageTracking.lastUpdated;
      }
    }
  }

  return milestones;
}

function estimateDaysRemaining(status: string): number {
  const daysMap: any = {
    'INITIAL': 84,
    'APPLICATION_SUBMITTED': 56,
    'UNDER_REVIEW': 42,
    'AIP_ISSUED': 35,
    'FORMAL_APPLICATION': 28,
    'SURVEY_ORDERED': 21,
    'OFFER_ISSUED': 14,
    'OFFER_ACCEPTED': 7,
    'LEGAL_PROCESS': 7
  };

  return daysMap[status] || 0;
}

function formatEventTitle(eventType: string): string {
  const titles: any = {
    'MORTGAGE_APPLIED': 'Mortgage Application Submitted',
    'MORTGAGE_AIP_RECEIVED': 'Agreement in Principle Received',
    'MORTGAGE_OFFER_RECEIVED': 'Mortgage Offer Received',
    'MORTGAGE_COMPLETED': 'Mortgage Process Completed',
    'MORTGAGE_STATUS_CHANGED': 'Status Updated',
    'MORTGAGE_MILESTONE': 'Milestone Reached'
  };
  return titles[eventType] || eventType;
}

function formatEventDescription(eventType: string): string {
  const descriptions: any = {
    'MORTGAGE_APPLIED': 'Mortgage application was submitted',
    'MORTGAGE_AIP_RECEIVED': 'Agreement in Principle was received',
    'MORTGAGE_OFFER_RECEIVED': 'Formal mortgage offer was received',
    'MORTGAGE_COMPLETED': 'Mortgage process was completed',
    'MORTGAGE_STATUS_CHANGED': 'Mortgage status was updated',
    'MORTGAGE_MILESTONE': 'Important milestone was reached'
  };
  return descriptions[eventType] || 'Mortgage-related event occurred';
}

function getAffordabilityRecommendation(ratio: number): string {
  if (ratio < 25) return 'Excellent affordability - well within safe limits';
  if (ratio < 30) return 'Good affordability - comfortable repayment level';
  if (ratio < 35) return 'Acceptable affordability - at recommended limit';
  if (ratio < 40) return 'Stretched affordability - consider reducing loan amount';
  return 'Poor affordability - loan amount may be too high';
}

function getAffordabilityRiskLevel(ratio: number): string {
  if (ratio < 25) return 'LOW';
  if (ratio < 35) return 'MEDIUM';
  return 'HIGH';
}