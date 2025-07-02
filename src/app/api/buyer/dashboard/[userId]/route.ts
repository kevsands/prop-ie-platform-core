import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { userService } from '@/lib/services/users-production';

const prisma = new PrismaClient();

/**
 * GET /api/buyer/dashboard/[userId] - Complete buyer dashboard data
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

    // Get all buyer data in parallel for performance
    const [
      buyerProfile,
      buyerJourney,
      mortgageTracking,
      recentEvents,
      activeReservations,
      snagLists,
      homePackItems,
      affordabilityChecks,
      mortgageApplications
    ] = await Promise.all([
      // Buyer profile
      prisma.buyerProfile.findUnique({
        where: { userId },
        include: {
          User: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
              kycStatus: true,
              lastActive: true
            }
          }
        }
      }),

      // Buyer journey
      prisma.buyerJourneys.findUnique({
        where: { buyerId: userId },
        include: {
          BuyerPhaseHistory: {
            orderBy: { phaseStartDate: 'desc' },
            take: 5
          }
        }
      }),

      // Mortgage tracking
      prisma.mortgageTracking.findUnique({
        where: { userId },
        include: {
          MortgageDocument: {
            orderBy: { uploadDate: 'desc' },
            take: 10
          }
        }
      }),

      // Recent events
      prisma.buyerEvent.findMany({
        where: { buyerId: userId },
        orderBy: { eventDate: 'desc' },
        take: 15
      }),

      // Active reservations
      prisma.reservation.findMany({
        where: {
          userId,
          status: { in: ['ACTIVE', 'PENDING', 'CONFIRMED'] }
        },
        orderBy: { created: 'desc' },
        include: {
          Development: {
            select: {
              id: true,
              name: true,
              location: true,
              developer: true
            }
          }
        }
      }),

      // Snag lists
      prisma.snagList.findMany({
        where: { userId },
        orderBy: { created: 'desc' },
        take: 10,
        include: {
          SnagItem: {
            where: { status: { not: 'COMPLETED' } },
            orderBy: { created: 'desc' }
          }
        }
      }),

      // Home pack items
      prisma.homePackItem.findMany({
        where: {
          OR: [
            { buyerId: userId },
            { 
              propertyId: {
                in: await getReservedPropertyIds(userId)
              }
            }
          ]
        },
        orderBy: { created: 'desc' },
        take: 20
      }),

      // Affordability checks
      prisma.affordabilityCheck.findMany({
        where: { journeyId: userId }, // Assuming journeyId matches userId
        orderBy: { created: 'desc' },
        take: 5
      }),

      // Mortgage applications
      prisma.mortgageApplication.findMany({
        where: { journeyId: userId }, // Assuming journeyId matches userId
        orderBy: { applicationDate: 'desc' },
        take: 5
      })
    ]);

    if (!buyerProfile) {
      return NextResponse.json(
        { error: 'Buyer profile not found' },
        { status: 404 }
      );
    }

    // Calculate comprehensive dashboard metrics
    const dashboardData = {
      // Profile and user information
      profile: {
        ...buyerProfile,
        completionScore: calculateProfileCompletionScore(buyerProfile)
      },

      // Journey overview
      journey: {
        ...buyerJourney,
        progress: calculateJourneyProgress(buyerJourney, activeReservations, mortgageTracking),
        timeInCurrentPhase: calculateTimeInCurrentPhase(buyerJourney),
        estimatedCompletion: estimateCompletionDate(buyerJourney, activeReservations)
      },

      // Financial overview
      financial: {
        mortgageTracking,
        affordabilityChecks,
        mortgageApplications,
        preApprovalStatus: calculatePreApprovalStatus(mortgageTracking, mortgageApplications),
        budgetSummary: calculateBudgetSummary(buyerProfile, affordabilityChecks)
      },

      // Property activity
      properties: {
        activeReservations,
        reservationsSummary: calculateReservationsSummary(activeReservations),
        snagLists: snagLists.map(snagList => ({
          ...snagList,
          summary: {
            totalItems: snagList.SnagItem.length,
            openItems: snagList.SnagItem.filter(item => item.status !== 'COMPLETED').length,
            highPriorityItems: snagList.SnagItem.filter(item => item.priority === 'HIGH').length
          }
        })),
        totalSnagItems: snagLists.reduce((total, list) => total + list.SnagItem.length, 0)
      },

      // Home pack and documents
      homePack: {
        items: homePackItems,
        categories: categorizeHomePackItems(homePackItems),
        completionStatus: calculateHomePackCompletion(homePackItems)
      },

      // Timeline and activity
      timeline: {
        recentEvents: recentEvents.map(event => ({
          ...event,
          timeAgo: calculateTimeAgo(event.eventDate),
          category: categorizeEvent(event.eventType)
        })),
        upcomingMilestones: generateUpcomingMilestones(buyerJourney, activeReservations, mortgageTracking)
      },

      // Alerts and notifications
      alerts: generateDashboardAlerts(buyerJourney, activeReservations, mortgageTracking, snagLists),

      // Action items and recommendations
      actionItems: generateActionItems(buyerProfile, buyerJourney, mortgageTracking, activeReservations),

      // Performance metrics
      metrics: {
        journeyDuration: calculateJourneyDuration(buyerJourney),
        activityScore: calculateActivityScore(recentEvents),
        completionPrediction: predictCompletionTimeline(buyerJourney, activeReservations, mortgageTracking)
      }
    };

    return NextResponse.json({
      success: true,
      data: dashboardData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching buyer dashboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch buyer dashboard' },
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

async function getReservedPropertyIds(userId: string): Promise<string[]> {
  const reservations = await prisma.reservation.findMany({
    where: { userId },
    select: { propertyId: true }
  });
  return reservations.map(r => r.propertyId).filter(Boolean);
}

function calculateProfileCompletionScore(profile: any): number {
  let score = 0;
  const maxScore = 100;

  // Basic info (30%)
  if (profile.User?.firstName && profile.User?.lastName) score += 10;
  if (profile.User?.email) score += 5;
  if (profile.User?.phone) score += 5;
  if (profile.currentJourneyPhase !== 'planning') score += 10;

  // Financial details (40%)
  const financialDetails = profile.financialDetails || {};
  if (financialDetails.annualIncome) score += 10;
  if (financialDetails.savings) score += 10;
  if (financialDetails.monthlyDebts) score += 5;
  if (financialDetails.depositAmount) score += 10;
  if (financialDetails.maxBudget) score += 5;

  // Preferences (20%)
  const preferences = profile.preferences || {};
  if (preferences.preferredAreas?.length) score += 10;
  if (preferences.propertyTypes?.length) score += 5;
  if (preferences.minBedrooms || preferences.maxBedrooms) score += 5;

  // Government schemes (10%)
  const govSchemes = profile.governmentSchemes || {};
  if (govSchemes.htbApplicationStatus) score += 5;
  if (govSchemes.firstHomeBuyer !== undefined) score += 5;

  return Math.min(score, maxScore);
}

function calculateJourneyProgress(journey: any, reservations: any[], mortgageTracking: any) {
  if (!journey) return { percentage: 0, phase: 'PLANNING', milestones: [] };

  const phases = ['PLANNING', 'SEARCHING', 'VIEWING', 'RESERVING', 'FINANCING', 'LEGAL', 'COMPLETION'];
  const currentPhaseIndex = phases.indexOf(journey.currentPhase);
  
  // Base progress from phase
  const baseProgress = Math.round((currentPhaseIndex / (phases.length - 1)) * 70);
  
  // Additional progress from milestones
  let milestoneProgress = 0;
  const milestones = [];

  if (reservations.length > 0) {
    milestoneProgress += 10;
    milestones.push('Property Reserved');
  }

  if (mortgageTracking?.status === 'APPROVED') {
    milestoneProgress += 15;
    milestones.push('Mortgage Approved');
  } else if (mortgageTracking?.aipDate) {
    milestoneProgress += 10;
    milestones.push('AIP Obtained');
  }

  if (journey.currentPhase === 'COMPLETION') {
    milestoneProgress += 5;
    milestones.push('Near Completion');
  }

  return {
    percentage: Math.min(100, baseProgress + milestoneProgress),
    phase: journey.currentPhase,
    phaseIndex: currentPhaseIndex,
    totalPhases: phases.length,
    milestones,
    estimatedDaysToCompletion: estimateDaysToCompletion(currentPhaseIndex, phases.length)
  };
}

function calculateTimeInCurrentPhase(journey: any): number {
  if (!journey?.BuyerPhaseHistory?.length) return 0;
  
  const currentPhase = journey.BuyerPhaseHistory[0];
  if (!currentPhase.phaseStartDate) return 0;

  const now = new Date();
  const phaseStart = new Date(currentPhase.phaseStartDate);
  return Math.ceil((now.getTime() - phaseStart.getTime()) / (1000 * 60 * 60 * 24));
}

function estimateCompletionDate(journey: any, reservations: any[]): Date | null {
  if (!journey) return null;

  const phases = ['PLANNING', 'SEARCHING', 'VIEWING', 'RESERVING', 'FINANCING', 'LEGAL', 'COMPLETION'];
  const currentPhaseIndex = phases.indexOf(journey.currentPhase);
  
  // Estimate days per remaining phase
  const avgDaysPerPhase = 30;
  const remainingPhases = phases.length - 1 - currentPhaseIndex;
  const estimatedDays = remainingPhases * avgDaysPerPhase;

  // Adjust based on reservations
  if (reservations.length > 0) {
    // If property is reserved, reduce estimate
    const estimatedWithReservation = estimatedDays * 0.7; // 30% faster
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + estimatedWithReservation);
    return completionDate;
  }

  const completionDate = new Date();
  completionDate.setDate(completionDate.getDate() + estimatedDays);
  return completionDate;
}

function calculatePreApprovalStatus(mortgageTracking: any, applications: any[]) {
  if (!mortgageTracking && (!applications || applications.length === 0)) {
    return { status: 'not_started', message: 'No mortgage application started' };
  }

  if (mortgageTracking?.status === 'APPROVED') {
    return { status: 'approved', message: 'Mortgage approved', expiryDate: mortgageTracking.aipExpiryDate };
  }

  if (mortgageTracking?.aipDate) {
    return { status: 'aip_obtained', message: 'Agreement in Principle obtained', expiryDate: mortgageTracking.aipExpiryDate };
  }

  if (applications?.some(app => app.status === 'SUBMITTED')) {
    return { status: 'in_progress', message: 'Application in progress' };
  }

  return { status: 'started', message: 'Application started' };
}

function calculateBudgetSummary(profile: any, affordabilityChecks: any[]) {
  const financialDetails = profile.financialDetails || {};
  const latestCheck = affordabilityChecks?.[0];

  return {
    maxBudget: financialDetails.maxBudget || latestCheck?.maxPropertyPrice,
    depositAmount: financialDetails.depositAmount || latestCheck?.depositAmount,
    maxMortgage: latestCheck?.maxMortgage,
    monthlyPayment: latestCheck?.monthlyRepayment,
    htbAmount: financialDetails.htbAmount || latestCheck?.htbAmount,
    loanToValue: latestCheck?.loanToValue,
    hasAffordabilityCheck: !!latestCheck,
    lastChecked: latestCheck?.created
  };
}

function calculateReservationsSummary(reservations: any[]) {
  const active = reservations.filter(r => r.status === 'ACTIVE').length;
  const pending = reservations.filter(r => r.status === 'PENDING').length;
  const confirmed = reservations.filter(r => r.status === 'CONFIRMED').length;

  return {
    total: reservations.length,
    active,
    pending,
    confirmed,
    totalValue: reservations.reduce((sum, r) => sum + (r.totalPropertyPrice || 0), 0),
    expiringThisWeek: reservations.filter(r => {
      if (!r.expiresAt) return false;
      const expiryDate = new Date(r.expiresAt);
      const oneWeekFromNow = new Date();
      oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
      return expiryDate <= oneWeekFromNow;
    }).length
  };
}

function categorizeHomePackItems(items: any[]) {
  const categories = {
    warranties: items.filter(item => item.category === 'warranty'),
    manuals: items.filter(item => item.category === 'manual'),
    certificates: items.filter(item => item.category === 'certificate'),
    contacts: items.filter(item => item.category === 'contact'),
    other: items.filter(item => !['warranty', 'manual', 'certificate', 'contact'].includes(item.category))
  };

  return Object.entries(categories).map(([category, categoryItems]) => ({
    category,
    count: categoryItems.length,
    items: categoryItems
  }));
}

function calculateHomePackCompletion(items: any[]): number {
  if (items.length === 0) return 0;
  
  const expectedCategories = ['warranty', 'manual', 'certificate', 'contact'];
  const presentCategories = [...new Set(items.map(item => item.category))];
  const completionScore = (presentCategories.length / expectedCategories.length) * 100;
  
  return Math.round(completionScore);
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

function categorizeEvent(eventType: string): string {
  const categories: { [key: string]: string } = {
    'PROFILE_CREATED': 'profile',
    'PROFILE_UPDATED': 'profile',
    'PHASE_CHANGED': 'journey',
    'AFFORDABILITY_CHECK': 'financial',
    'PROPERTY_RESERVED': 'property',
    'MORTGAGE_APPLIED': 'financial',
    'SNAG_CREATED': 'property',
    'DOCUMENT_UPLOADED': 'document'
  };
  return categories[eventType] || 'general';
}

function generateUpcomingMilestones(journey: any, reservations: any[], mortgageTracking: any) {
  const milestones = [];

  // Phase-based milestones
  if (journey?.currentPhase === 'PLANNING') {
    milestones.push({
      title: 'Complete Affordability Check',
      dueDate: null,
      priority: 'high',
      category: 'financial'
    });
  }

  if (journey?.currentPhase === 'SEARCHING') {
    milestones.push({
      title: 'Schedule Property Viewings',
      dueDate: null,
      priority: 'medium',
      category: 'property'
    });
  }

  // Reservation-based milestones
  reservations.forEach(reservation => {
    if (reservation.expiresAt) {
      milestones.push({
        title: `Reservation Expires - ${reservation.Development?.name}`,
        dueDate: reservation.expiresAt,
        priority: 'high',
        category: 'property'
      });
    }
  });

  // Mortgage-based milestones
  if (mortgageTracking?.aipExpiryDate) {
    milestones.push({
      title: 'AIP Expires - Renew if Needed',
      dueDate: mortgageTracking.aipExpiryDate,
      priority: 'medium',
      category: 'financial'
    });
  }

  return milestones.sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
}

function generateDashboardAlerts(journey: any, reservations: any[], mortgageTracking: any, snagLists: any[]) {
  const alerts = [];

  // Reservation expiry alerts
  reservations.forEach(reservation => {
    if (reservation.expiresAt) {
      const expiryDate = new Date(reservation.expiresAt);
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
        alerts.push({
          type: 'warning',
          title: 'Reservation Expiring Soon',
          message: `Reservation for ${reservation.Development?.name} expires in ${daysUntilExpiry} days`,
          priority: 'high',
          action: 'extend_reservation'
        });
      }
    }
  });

  // Mortgage AIP expiry alerts
  if (mortgageTracking?.aipExpiryDate) {
    const expiryDate = new Date(mortgageTracking.aipExpiryDate);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry <= 14 && daysUntilExpiry > 0) {
      alerts.push({
        type: 'info',
        title: 'AIP Expiring',
        message: `Your Agreement in Principle expires in ${daysUntilExpiry} days`,
        priority: 'medium',
        action: 'renew_aip'
      });
    }
  }

  // Snag list alerts
  snagLists.forEach(snagList => {
    const highPriorityItems = snagList.SnagItem.filter((item: any) => item.priority === 'HIGH').length;
    if (highPriorityItems > 0) {
      alerts.push({
        type: 'info',
        title: 'High Priority Snag Items',
        message: `${highPriorityItems} high priority items need attention`,
        priority: 'medium',
        action: 'view_snag_list'
      });
    }
  });

  return alerts.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
  });
}

function generateActionItems(profile: any, journey: any, mortgageTracking: any, reservations: any[]) {
  const actions = [];

  // Profile completion actions
  const completionScore = calculateProfileCompletionScore(profile);
  if (completionScore < 80) {
    actions.push({
      title: 'Complete Your Profile',
      description: 'Add missing information to improve your experience',
      priority: 'medium',
      category: 'profile',
      action: 'complete_profile'
    });
  }

  // Journey-specific actions
  if (journey?.currentPhase === 'PLANNING' && !mortgageTracking) {
    actions.push({
      title: 'Start Mortgage Pre-approval',
      description: 'Get pre-approved to strengthen your position',
      priority: 'high',
      category: 'financial',
      action: 'start_mortgage'
    });
  }

  // Reservation actions
  if (reservations.length === 0 && journey?.currentPhase === 'SEARCHING') {
    actions.push({
      title: 'Reserve Your First Property',
      description: 'Secure a property that matches your criteria',
      priority: 'high',
      category: 'property',
      action: 'make_reservation'
    });
  }

  return actions;
}

function calculateJourneyDuration(journey: any): number {
  if (!journey?.startDate) return 0;
  return Math.ceil((Date.now() - new Date(journey.startDate).getTime()) / (1000 * 60 * 60 * 24));
}

function calculateActivityScore(events: any[]): number {
  const recentEvents = events.filter(event => {
    const eventDate = new Date(event.eventDate);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return eventDate >= thirtyDaysAgo;
  });

  // Score based on recent activity frequency
  return Math.min(100, recentEvents.length * 5);
}

function predictCompletionTimeline(journey: any, reservations: any[], mortgageTracking: any) {
  if (!journey) return null;

  const phases = ['PLANNING', 'SEARCHING', 'VIEWING', 'RESERVING', 'FINANCING', 'LEGAL', 'COMPLETION'];
  const currentPhaseIndex = phases.indexOf(journey.currentPhase);
  
  let estimatedWeeks = (phases.length - 1 - currentPhaseIndex) * 4; // 4 weeks per phase

  // Adjust based on current status
  if (reservations.length > 0) estimatedWeeks *= 0.8; // 20% faster with reservation
  if (mortgageTracking?.status === 'APPROVED') estimatedWeeks *= 0.7; // 30% faster with approved mortgage

  return {
    estimatedWeeks: Math.ceil(estimatedWeeks),
    estimatedCompletionDate: new Date(Date.now() + estimatedWeeks * 7 * 24 * 60 * 60 * 1000),
    confidence: calculatePredictionConfidence(journey, reservations, mortgageTracking)
  };
}

function calculatePredictionConfidence(journey: any, reservations: any[], mortgageTracking: any): number {
  let confidence = 50; // Base confidence

  if (reservations.length > 0) confidence += 20;
  if (mortgageTracking?.aipDate) confidence += 15;
  if (mortgageTracking?.status === 'APPROVED') confidence += 15;

  return Math.min(100, confidence);
}

function estimateDaysToCompletion(currentPhaseIndex: number, totalPhases: number): number {
  const remainingPhases = totalPhases - 1 - currentPhaseIndex;
  return remainingPhases * 30; // 30 days per phase estimate
}