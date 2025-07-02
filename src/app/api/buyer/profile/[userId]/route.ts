import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { userService } from '@/lib/services/users-production';

const prisma = new PrismaClient();

/**
 * GET /api/buyer/profile/[userId] - Get buyer profile with journey status
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

    // Get buyer profile with related data
    const buyerProfile = await prisma.buyerProfile.findUnique({
      where: { userId },
      include: {
        User: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            created: true,
            lastActive: true,
            kycStatus: true
          }
        }
      }
    });

    if (!buyerProfile) {
      return NextResponse.json(
        { error: 'Buyer profile not found' },
        { status: 404 }
      );
    }

    // Get buyer journey information
    const buyerJourney = await prisma.buyerJourneys.findUnique({
      where: { buyerId: userId },
      include: {
        BuyerPhaseHistory: {
          orderBy: { phaseStartDate: 'desc' },
          take: 10,
          select: {
            id: true,
            phase: true,
            phaseStartDate: true,
            phaseEndDate: true,
            notes: true
          }
        },
        AffordabilityCheck: {
          orderBy: { created: 'desc' },
          take: 5,
          select: {
            id: true,
            grossAnnualIncome: true,
            maxMortgage: true,
            maxPropertyPrice: true,
            loanToValue: true,
            created: true
          }
        },
        PropertyReservation: {
          orderBy: { created: 'desc' },
          take: 10,
          select: {
            id: true,
            propertyId: true,
            status: true,
            depositAmount: true,
            created: true,
            expiryDate: true
          }
        },
        MortgageApplication: {
          orderBy: { applicationDate: 'desc' },
          take: 5,
          select: {
            id: true,
            lender: true,
            amount: true,
            status: true,
            applicationDate: true
          }
        },
        SnagList: {
          orderBy: { created: 'desc' },
          take: 5,
          include: {
            SnagItem: {
              select: {
                id: true,
                title: true,
                status: true,
                priority: true
              }
            }
          }
        }
      }
    });

    // Get recent buyer events
    const recentEvents = await prisma.buyerEvent.findMany({
      where: { buyerId: userId },
      orderBy: { eventDate: 'desc' },
      take: 20,
      select: {
        id: true,
        eventType: true,
        eventDate: true,
        eventData: true,
        description: true
      }
    });

    // Calculate journey progress
    const journeyProgress = calculateJourneyProgress(buyerJourney, buyerProfile);

    // Get active reservations
    const activeReservations = buyerJourney?.PropertyReservation?.filter(
      reservation => reservation.status === 'ACTIVE' || reservation.status === 'PENDING'
    ) || [];

    // Get mortgage tracking
    const mortgageTracking = await prisma.mortgageTracking.findUnique({
      where: { userId },
      include: {
        MortgageDocument: {
          select: {
            id: true,
            documentType: true,
            status: true,
            uploadDate: true
          }
        }
      }
    });

    // Prepare response data
    const responseData = {
      profile: {
        id: buyerProfile.id,
        userId: buyerProfile.userId,
        currentJourneyPhase: buyerProfile.currentJourneyPhase,
        financialDetails: buyerProfile.financialDetails,
        preferences: buyerProfile.preferences,
        governmentSchemes: buyerProfile.governmentSchemes,
        createdAt: buyerProfile.createdAt,
        updatedAt: buyerProfile.updatedAt,
        user: buyerProfile.User
      },
      journey: {
        id: buyerJourney?.id,
        currentPhase: buyerJourney?.currentPhase,
        startDate: buyerJourney?.startDate,
        lastUpdated: buyerJourney?.lastUpdated,
        targetMoveInDate: buyerJourney?.targetMoveInDate,
        targetPropertyId: buyerJourney?.targetPropertyId,
        notes: buyerJourney?.notes,
        progress: journeyProgress,
        phaseHistory: buyerJourney?.BuyerPhaseHistory || []
      },
      financialStatus: {
        affordabilityChecks: buyerJourney?.AffordabilityCheck || [],
        mortgageApplications: buyerJourney?.MortgageApplication || [],
        mortgageTracking: mortgageTracking ? {
          id: mortgageTracking.id,
          status: mortgageTracking.status,
          lender: mortgageTracking.lender,
          lenderName: mortgageTracking.lenderName,
          amount: mortgageTracking.amount,
          aipDate: mortgageTracking.aipDate,
          aipExpiryDate: mortgageTracking.aipExpiryDate,
          formalOfferDate: mortgageTracking.formalOfferDate,
          documents: mortgageTracking.MortgageDocument || []
        } : null
      },
      propertyActivity: {
        reservations: buyerJourney?.PropertyReservation || [],
        activeReservations,
        snagLists: buyerJourney?.SnagList || []
      },
      timeline: {
        recentEvents,
        keyMilestones: extractKeyMilestones(recentEvents, buyerJourney)
      },
      nextSteps: generateNextSteps(buyerJourney, buyerProfile, mortgageTracking),
      alerts: generateAlerts(buyerJourney, buyerProfile, mortgageTracking)
    };

    return NextResponse.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('Error fetching buyer profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch buyer profile' },
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

function calculateJourneyProgress(buyerJourney: any, buyerProfile: any) {
  const phases = ['PLANNING', 'SEARCHING', 'VIEWING', 'RESERVING', 'FINANCING', 'LEGAL', 'COMPLETION'];
  const currentPhaseIndex = phases.indexOf(buyerJourney?.currentPhase || 'PLANNING');
  
  let additionalProgress = 0;
  
  // Add progress based on completed activities
  if (buyerProfile.financialDetails && Object.keys(buyerProfile.financialDetails).length > 0) {
    additionalProgress += 5;
  }
  
  if (buyerJourney?.AffordabilityCheck?.length > 0) {
    additionalProgress += 10;
  }
  
  if (buyerJourney?.PropertyReservation?.length > 0) {
    additionalProgress += 15;
  }
  
  if (buyerJourney?.MortgageApplication?.length > 0) {
    additionalProgress += 10;
  }

  const baseProgress = Math.round((currentPhaseIndex / (phases.length - 1)) * 70); // 70% for phase completion
  const totalProgress = Math.min(100, baseProgress + additionalProgress);
  
  return {
    percentage: totalProgress,
    currentPhase: buyerJourney?.currentPhase || 'PLANNING',
    currentPhaseIndex,
    totalPhases: phases.length,
    phases,
    completedActivities: {
      hasFinancialDetails: !!buyerProfile.financialDetails,
      hasAffordabilityCheck: (buyerJourney?.AffordabilityCheck?.length || 0) > 0,
      hasReservation: (buyerJourney?.PropertyReservation?.length || 0) > 0,
      hasMortgageApplication: (buyerJourney?.MortgageApplication?.length || 0) > 0
    }
  };
}

function extractKeyMilestones(events: any[], buyerJourney: any) {
  const milestones = [];
  
  // Journey start
  if (buyerJourney?.startDate) {
    milestones.push({
      type: 'journey_started',
      date: buyerJourney.startDate,
      title: 'Journey Started',
      description: 'Buyer journey began'
    });
  }
  
  // Key events from timeline
  events.forEach(event => {
    if (['PROFILE_CREATED', 'AFFORDABILITY_CHECK', 'PROPERTY_RESERVED', 'MORTGAGE_APPLIED'].includes(event.eventType)) {
      milestones.push({
        type: event.eventType.toLowerCase(),
        date: event.eventDate,
        title: formatEventTitle(event.eventType),
        description: event.description || formatEventDescription(event.eventType)
      });
    }
  });
  
  return milestones.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function generateNextSteps(buyerJourney: any, buyerProfile: any, mortgageTracking: any) {
  const steps = [];
  
  if (!buyerProfile.financialDetails || Object.keys(buyerProfile.financialDetails).length === 0) {
    steps.push({
      priority: 'high',
      title: 'Complete Financial Profile',
      description: 'Add your income, savings, and debt information',
      action: 'complete_financial_profile'
    });
  }
  
  if (!buyerJourney?.AffordabilityCheck?.length) {
    steps.push({
      priority: 'high', 
      title: 'Run Affordability Check',
      description: 'Determine your maximum budget and mortgage amount',
      action: 'run_affordability_check'
    });
  }
  
  if (!mortgageTracking && buyerJourney?.currentPhase !== 'PLANNING') {
    steps.push({
      priority: 'medium',
      title: 'Start Mortgage Application',
      description: 'Begin the mortgage pre-approval process',
      action: 'start_mortgage_application'
    });
  }
  
  if (buyerJourney?.currentPhase === 'PLANNING' && buyerProfile.preferences) {
    steps.push({
      priority: 'medium',
      title: 'Start Property Search',
      description: 'Browse properties that match your criteria',
      action: 'start_property_search'
    });
  }
  
  return steps;
}

function generateAlerts(buyerJourney: any, buyerProfile: any, mortgageTracking: any) {
  const alerts = [];
  
  // Check for expiring reservations
  const activeReservations = buyerJourney?.PropertyReservation?.filter(
    (res: any) => res.status === 'ACTIVE' && res.expiryDate
  ) || [];
  
  activeReservations.forEach((reservation: any) => {
    const expiryDate = new Date(reservation.expiryDate);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
      alerts.push({
        type: 'warning',
        title: 'Reservation Expiring Soon',
        message: `Your property reservation expires in ${daysUntilExpiry} days`,
        action: 'extend_reservation',
        priority: 'high'
      });
    }
  });
  
  // Check for mortgage AIP expiry
  if (mortgageTracking?.aipExpiryDate) {
    const aipExpiryDate = new Date(mortgageTracking.aipExpiryDate);
    const daysUntilExpiry = Math.ceil((aipExpiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry <= 14 && daysUntilExpiry > 0) {
      alerts.push({
        type: 'info',
        title: 'Mortgage AIP Expiring',
        message: `Your Agreement in Principle expires in ${daysUntilExpiry} days`,
        action: 'renew_aip',
        priority: 'medium'
      });
    }
  }
  
  return alerts;
}

function formatEventTitle(eventType: string): string {
  const titles: { [key: string]: string } = {
    'PROFILE_CREATED': 'Profile Created',
    'AFFORDABILITY_CHECK': 'Affordability Check Completed',
    'PROPERTY_RESERVED': 'Property Reserved',
    'MORTGAGE_APPLIED': 'Mortgage Application Submitted'
  };
  return titles[eventType] || eventType;
}

function formatEventDescription(eventType: string): string {
  const descriptions: { [key: string]: string } = {
    'PROFILE_CREATED': 'Buyer profile was created',
    'AFFORDABILITY_CHECK': 'Affordability assessment was completed',
    'PROPERTY_RESERVED': 'Property reservation was made',
    'MORTGAGE_APPLIED': 'Mortgage application was submitted'
  };
  return descriptions[eventType] || 'Event occurred';
}