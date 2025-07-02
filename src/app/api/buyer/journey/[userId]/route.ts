import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { userService } from '@/lib/services/users-production';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const updateJourneySchema = z.object({
  currentPhase: z.enum(['PLANNING', 'SEARCHING', 'VIEWING', 'RESERVING', 'FINANCING', 'LEGAL', 'COMPLETION']).optional(),
  targetMoveInDate: z.string().optional(),
  targetPropertyId: z.string().optional(),
  notes: z.string().optional(),
  milestoneData: z.object({
    milestoneType: z.string(),
    milestoneData: z.record(z.any()),
    autoProgression: z.boolean().optional().default(true)
  }).optional()
});

/**
 * PATCH /api/buyer/journey/[userId] - Update journey phase and milestones
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const body = await request.json();
    const validatedData = updateJourneySchema.parse(body);

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

    // Get existing journey
    const existingJourney = await prisma.buyerJourneys.findUnique({
      where: { buyerId: userId },
      include: {
        BuyerPhaseHistory: {
          orderBy: { phaseStartDate: 'desc' },
          take: 1
        }
      }
    });

    if (!existingJourney) {
      return NextResponse.json(
        { error: 'Buyer journey not found' },
        { status: 404 }
      );
    }

    // Prepare transaction operations
    const operations = [];

    // Update journey main record
    const updateData: any = {
      lastUpdated: new Date()
    };

    if (validatedData.currentPhase) {
      updateData.currentPhase = validatedData.currentPhase;
    }
    if (validatedData.targetMoveInDate) {
      updateData.targetMoveInDate = new Date(validatedData.targetMoveInDate);
    }
    if (validatedData.targetPropertyId) {
      updateData.targetPropertyId = validatedData.targetPropertyId;
    }
    if (validatedData.notes) {
      updateData.notes = validatedData.notes;
    }

    // Execute transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update journey
      const updatedJourney = await tx.buyerJourneys.update({
        where: { buyerId: userId },
        data: updateData,
        include: {
          BuyerPhaseHistory: {
            orderBy: { phaseStartDate: 'desc' },
            take: 5
          }
        }
      });

      // Create phase history if phase changed
      if (validatedData.currentPhase && validatedData.currentPhase !== existingJourney.currentPhase) {
        // End previous phase
        const currentPhaseHistory = existingJourney.BuyerPhaseHistory[0];
        if (currentPhaseHistory && !currentPhaseHistory.phaseEndDate) {
          await tx.buyerPhaseHistory.update({
            where: { id: currentPhaseHistory.id },
            data: { phaseEndDate: new Date() }
          });
        }

        // Create new phase history entry
        await tx.buyerPhaseHistory.create({
          data: {
            id: generateId(),
            journeyId: existingJourney.id,
            phase: validatedData.currentPhase,
            phaseStartDate: new Date(),
            notes: `Phase changed from ${existingJourney.currentPhase} to ${validatedData.currentPhase}`
          }
        });

        // Create buyer event for phase change
        await tx.buyerEvent.create({
          data: {
            id: generateId(),
            buyerId: userId,
            eventType: 'PHASE_CHANGED',
            eventDate: new Date(),
            eventData: {
              previousPhase: existingJourney.currentPhase,
              newPhase: validatedData.currentPhase,
              changedBy: currentUser.id
            },
            description: `Journey phase changed from ${existingJourney.currentPhase} to ${validatedData.currentPhase}`
          }
        });
      }

      // Process milestone if provided
      if (validatedData.milestoneData) {
        await processMilestone(tx, userId, existingJourney.id, validatedData.milestoneData, currentUser.id);
      }

      // Update buyer profile journey phase if phase changed
      if (validatedData.currentPhase) {
        await tx.buyerProfile.update({
          where: { userId },
          data: {
            currentJourneyPhase: validatedData.currentPhase.toLowerCase(),
            updatedAt: new Date()
          }
        });
      }

      return updatedJourney;
    });

    // Calculate updated progress
    const progress = await calculateJourneyProgress(userId);

    return NextResponse.json({
      success: true,
      data: {
        journey: result,
        progress,
        message: 'Journey updated successfully'
      }
    });

  } catch (error) {
    console.error('Error updating buyer journey:', error);
    
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
      { error: 'Failed to update buyer journey' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * GET /api/buyer/journey/[userId] - Get detailed journey information
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

    // Get comprehensive journey data
    const journey = await prisma.buyerJourneys.findUnique({
      where: { buyerId: userId },
      include: {
        BuyerPhaseHistory: {
          orderBy: { phaseStartDate: 'desc' }
        },
        AffordabilityCheck: {
          orderBy: { created: 'desc' }
        },
        PropertyReservation: {
          orderBy: { created: 'desc' },
          include: {
            Property: {
              select: {
                id: true,
                title: true,
                price: true,
                location: true,
                beds: true,
                baths: true
              }
            }
          }
        },
        MortgageApplication: {
          orderBy: { applicationDate: 'desc' }
        },
        SnagList: {
          orderBy: { created: 'desc' },
          include: {
            SnagItem: true
          }
        }
      }
    });

    if (!journey) {
      return NextResponse.json(
        { error: 'Buyer journey not found' },
        { status: 404 }
      );
    }

    // Get related events
    const events = await prisma.buyerEvent.findMany({
      where: { buyerId: userId },
      orderBy: { eventDate: 'desc' },
      take: 50
    });

    // Calculate progress and analytics
    const progress = await calculateJourneyProgress(userId);
    const analytics = await calculateJourneyAnalytics(journey, events);

    return NextResponse.json({
      success: true,
      data: {
        journey,
        events,
        progress,
        analytics,
        recommendations: await generateJourneyRecommendations(journey, progress)
      }
    });

  } catch (error) {
    console.error('Error fetching buyer journey:', error);
    return NextResponse.json(
      { error: 'Failed to fetch buyer journey' },
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

async function processMilestone(tx: any, userId: string, journeyId: string, milestoneData: any, currentUserId: string) {
  const { milestoneType, milestoneData: data, autoProgression } = milestoneData;

  // Create milestone event
  await tx.buyerEvent.create({
    data: {
      id: generateId(),
      buyerId: userId,
      eventType: milestoneType.toUpperCase(),
      eventDate: new Date(),
      eventData: data,
      description: `Milestone: ${milestoneType}`
    }
  });

  // Handle specific milestone types
  switch (milestoneType) {
    case 'affordability_check_completed':
      if (autoProgression) {
        await autoProgressToSearching(tx, journeyId);
      }
      break;
    
    case 'property_reserved':
      if (autoProgression) {
        await autoProgressToFinancing(tx, journeyId);
      }
      break;
    
    case 'mortgage_approved':
      if (autoProgression) {
        await autoProgressToLegal(tx, journeyId);
      }
      break;
    
    case 'contracts_signed':
      if (autoProgression) {
        await autoProgressToCompletion(tx, journeyId);
      }
      break;
  }
}

async function autoProgressToSearching(tx: any, journeyId: string) {
  await tx.buyerJourneys.update({
    where: { id: journeyId },
    data: {
      currentPhase: 'SEARCHING',
      lastUpdated: new Date()
    }
  });
}

async function autoProgressToFinancing(tx: any, journeyId: string) {
  await tx.buyerJourneys.update({
    where: { id: journeyId },
    data: {
      currentPhase: 'FINANCING',
      lastUpdated: new Date()
    }
  });
}

async function autoProgressToLegal(tx: any, journeyId: string) {
  await tx.buyerJourneys.update({
    where: { id: journeyId },
    data: {
      currentPhase: 'LEGAL',
      lastUpdated: new Date()
    }
  });
}

async function autoProgressToCompletion(tx: any, journeyId: string) {
  await tx.buyerJourneys.update({
    where: { id: journeyId },
    data: {
      currentPhase: 'COMPLETION',
      lastUpdated: new Date()
    }
  });
}

async function calculateJourneyProgress(userId: string) {
  const journey = await prisma.buyerJourneys.findUnique({
    where: { buyerId: userId },
    include: {
      AffordabilityCheck: true,
      PropertyReservation: true,
      MortgageApplication: true
    }
  });

  const phases = ['PLANNING', 'SEARCHING', 'VIEWING', 'RESERVING', 'FINANCING', 'LEGAL', 'COMPLETION'];
  const currentPhaseIndex = phases.indexOf(journey?.currentPhase || 'PLANNING');
  
  // Calculate milestone completion
  const milestones = {
    hasAffordabilityCheck: (journey?.AffordabilityCheck?.length || 0) > 0,
    hasReservation: (journey?.PropertyReservation?.length || 0) > 0,
    hasMortgageApplication: (journey?.MortgageApplication?.length || 0) > 0,
    hasActiveReservation: journey?.PropertyReservation?.some(r => r.status === 'ACTIVE') || false
  };

  const completedMilestones = Object.values(milestones).filter(Boolean).length;
  const totalMilestones = Object.keys(milestones).length;

  const baseProgress = Math.round((currentPhaseIndex / (phases.length - 1)) * 60); // 60% for phase
  const milestoneProgress = Math.round((completedMilestones / totalMilestones) * 40); // 40% for milestones
  const totalProgress = Math.min(100, baseProgress + milestoneProgress);

  return {
    percentage: totalProgress,
    currentPhase: journey?.currentPhase || 'PLANNING',
    currentPhaseIndex,
    totalPhases: phases.length,
    phases,
    milestones,
    completedMilestones,
    totalMilestones
  };
}

async function calculateJourneyAnalytics(journey: any, events: any[]) {
  const now = new Date();
  const journeyStart = new Date(journey.startDate);
  const journeyDurationDays = Math.ceil((now.getTime() - journeyStart.getTime()) / (1000 * 60 * 60 * 24));

  // Calculate phase durations
  const phaseHistory = journey.BuyerPhaseHistory || [];
  const phaseDurations = phaseHistory.map((phase: any, index: number) => {
    const startDate = new Date(phase.phaseStartDate);
    const endDate = phase.phaseEndDate ? new Date(phase.phaseEndDate) : now;
    const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      phase: phase.phase,
      duration,
      startDate,
      endDate: phase.phaseEndDate,
      isActive: !phase.phaseEndDate
    };
  });

  // Event frequency analysis
  const eventsByType = events.reduce((acc: any, event: any) => {
    acc[event.eventType] = (acc[event.eventType] || 0) + 1;
    return acc;
  }, {});

  return {
    journeyDurationDays,
    phaseDurations,
    eventsByType,
    totalEvents: events.length,
    averageEventsPerWeek: journeyDurationDays > 0 ? Math.round((events.length / journeyDurationDays) * 7) : 0,
    completionRate: journey.currentPhase === 'COMPLETION' ? 100 : 
                   Math.round(((journey.BuyerPhaseHistory?.length || 0) / 7) * 100)
  };
}

async function generateJourneyRecommendations(journey: any, progress: any) {
  const recommendations = [];

  // Phase-specific recommendations
  switch (journey.currentPhase) {
    case 'PLANNING':
      if (!progress.milestones.hasAffordabilityCheck) {
        recommendations.push({
          type: 'action',
          priority: 'high',
          title: 'Complete Affordability Check',
          description: 'Determine your budget before searching for properties',
          action: 'affordability_check'
        });
      }
      break;

    case 'SEARCHING':
      recommendations.push({
        type: 'tip',
        priority: 'medium',
        title: 'Save Your Favorite Properties',
        description: 'Create a shortlist of properties that interest you',
        action: 'save_properties'
      });
      break;

    case 'RESERVING':
      if (!progress.milestones.hasMortgageApplication) {
        recommendations.push({
          type: 'action',
          priority: 'high',
          title: 'Start Mortgage Application',
          description: 'Begin your mortgage application process now',
          action: 'start_mortgage'
        });
      }
      break;
  }

  // Time-based recommendations
  const journeyDuration = Math.ceil((new Date().getTime() - new Date(journey.startDate).getTime()) / (1000 * 60 * 60 * 24));
  
  if (journeyDuration > 90 && journey.currentPhase === 'PLANNING') {
    recommendations.push({
      type: 'alert',
      priority: 'medium',
      title: 'Long Planning Phase',
      description: 'Consider moving to the next phase of your journey',
      action: 'review_progress'
    });
  }

  return recommendations;
}