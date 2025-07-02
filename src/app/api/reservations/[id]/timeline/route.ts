import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { userService } from '@/lib/services/users-production';
import { z } from 'zod';

const prisma = new PrismaClient();

const createTimelineEventSchema = z.object({
  eventType: z.enum(['STATUS_CHANGE', 'PAYMENT_RECEIVED', 'DOCUMENT_UPLOADED', 'EXTENSION_GRANTED', 'APPOINTMENT_SCHEDULED', 'NOTE_ADDED', 'COMMUNICATION_SENT']),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  visibility: z.enum(['PUBLIC', 'INTERNAL', 'BUYER_ONLY']).optional().default('PUBLIC'),
  relatedDocumentId: z.string().optional(),
  scheduledDate: z.string().optional()
});

/**
 * GET /api/reservations/[id]/timeline - Get reservation timeline events
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: reservationId } = params;
    const { searchParams } = new URL(request.url);

    if (!reservationId) {
      return NextResponse.json(
        { error: 'Reservation ID is required' },
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

    // Get reservation to check access
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      select: { userId: true, id: true }
    });

    if (!reservation) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      );
    }

    // Check permissions
    if (reservation.userId !== currentUser.id && !isAdmin(currentUser)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Parse query parameters
    const eventType = searchParams.get('eventType');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const includeInternal = searchParams.get('includeInternal') === 'true' && isAdmin(currentUser);

    // Build where clause
    const whereClause: any = {
      reservationId
    };

    if (eventType) {
      whereClause.eventType = eventType;
    }

    if (!includeInternal) {
      whereClause.visibility = { not: 'INTERNAL' };
    }

    // Get timeline events
    const events = await prisma.reservationTimelineEvent.findMany({
      where: whereClause,
      orderBy: { eventDate: 'desc' },
      take: limit,
      skip: offset,
      include: {
        CreatedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Get total count for pagination
    const totalCount = await prisma.reservationTimelineEvent.count({
      where: whereClause
    });

    // Calculate progress milestones
    const milestones = await calculateProgressMilestones(reservationId);
    
    // Get upcoming scheduled events
    const upcomingEvents = await prisma.reservationTimelineEvent.findMany({
      where: {
        reservationId,
        scheduledDate: {
          gte: new Date()
        },
        eventType: 'APPOINTMENT_SCHEDULED'
      },
      orderBy: { scheduledDate: 'asc' },
      take: 5
    });

    return NextResponse.json({
      success: true,
      data: {
        events: events.map(event => ({
          ...event,
          timeAgo: calculateTimeAgo(event.eventDate),
          category: categorizeEvent(event.eventType)
        })),
        milestones,
        upcomingEvents,
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: offset + events.length < totalCount
        }
      }
    });

  } catch (error) {
    console.error('Error fetching reservation timeline:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reservation timeline' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * POST /api/reservations/[id]/timeline - Add timeline event
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: reservationId } = params;
    const body = await request.json();
    const validatedData = createTimelineEventSchema.parse(body);

    if (!reservationId) {
      return NextResponse.json(
        { error: 'Reservation ID is required' },
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

    // Get reservation to check access
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      select: { userId: true, id: true, status: true }
    });

    if (!reservation) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      );
    }

    // Check permissions for adding events
    const canAddInternalEvents = isAdmin(currentUser) || 
                                 currentUser.roles?.includes('ESTATE_AGENT') ||
                                 currentUser.roles?.includes('DEVELOPER');
    
    if (validatedData.visibility === 'INTERNAL' && !canAddInternalEvents) {
      return NextResponse.json(
        { error: 'Insufficient permissions for internal events' },
        { status: 403 }
      );
    }

    // Only reservation owner or authorized users can add events
    if (reservation.userId !== currentUser.id && !canAddInternalEvents) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Create timeline event
    const timelineEvent = await prisma.reservationTimelineEvent.create({
      data: {
        id: generateId(),
        reservationId,
        eventType: validatedData.eventType,
        title: validatedData.title,
        description: validatedData.description,
        eventDate: new Date(),
        scheduledDate: validatedData.scheduledDate ? new Date(validatedData.scheduledDate) : null,
        metadata: validatedData.metadata || {},
        visibility: validatedData.visibility || 'PUBLIC',
        relatedDocumentId: validatedData.relatedDocumentId,
        createdBy: currentUser.id
      },
      include: {
        CreatedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Create buyer event for significant timeline events
    if (['STATUS_CHANGE', 'PAYMENT_RECEIVED', 'EXTENSION_GRANTED'].includes(validatedData.eventType)) {
      await prisma.buyerEvent.create({
        data: {
          id: generateId(),
          buyerId: reservation.userId,
          eventType: `RESERVATION_${validatedData.eventType}`,
          eventDate: new Date(),
          eventData: {
            reservationId,
            timelineEventId: timelineEvent.id,
            eventType: validatedData.eventType,
            title: validatedData.title
          },
          description: `Reservation: ${validatedData.title}`
        }
      });
    }

    // Auto-generate follow-up events for certain types
    await createFollowUpEvents(reservationId, validatedData.eventType, currentUser.id);

    return NextResponse.json({
      success: true,
      data: {
        event: {
          ...timelineEvent,
          timeAgo: calculateTimeAgo(timelineEvent.eventDate),
          category: categorizeEvent(timelineEvent.eventType)
        },
        message: 'Timeline event added successfully'
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating timeline event:', error);
    
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
      { error: 'Failed to create timeline event' },
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

async function calculateProgressMilestones(reservationId: string) {
  const events = await prisma.reservationTimelineEvent.findMany({
    where: { reservationId },
    orderBy: { eventDate: 'asc' }
  });

  const milestones = [
    { name: 'Reservation Created', completed: true, date: events[0]?.eventDate },
    { name: 'Initial Payment Received', completed: false, date: null },
    { name: 'Documentation Complete', completed: false, date: null },
    { name: 'Final Payment Received', completed: false, date: null },
    { name: 'Completion', completed: false, date: null }
  ];

  // Update milestone completion based on events
  events.forEach(event => {
    switch (event.eventType) {
      case 'PAYMENT_RECEIVED':
        if (!milestones[1].completed) {
          milestones[1].completed = true;
          milestones[1].date = event.eventDate;
        } else if (!milestones[3].completed) {
          milestones[3].completed = true;
          milestones[3].date = event.eventDate;
        }
        break;
      case 'DOCUMENT_UPLOADED':
        if (!milestones[2].completed) {
          milestones[2].completed = true;
          milestones[2].date = event.eventDate;
        }
        break;
      case 'STATUS_CHANGE':
        if (event.metadata?.newStatus === 'COMPLETED') {
          milestones[4].completed = true;
          milestones[4].date = event.eventDate;
        }
        break;
    }
  });

  return milestones;
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
    'STATUS_CHANGE': 'status',
    'PAYMENT_RECEIVED': 'financial',
    'DOCUMENT_UPLOADED': 'document',
    'EXTENSION_GRANTED': 'administrative',
    'APPOINTMENT_SCHEDULED': 'scheduling',
    'NOTE_ADDED': 'communication',
    'COMMUNICATION_SENT': 'communication'
  };
  return categories[eventType] || 'general';
}

async function createFollowUpEvents(reservationId: string, eventType: string, userId: string) {
  // Auto-generate follow-up events based on event type
  switch (eventType) {
    case 'PAYMENT_RECEIVED':
      // Schedule documentation reminder
      await prisma.reservationTimelineEvent.create({
        data: {
          id: generateId(),
          reservationId,
          eventType: 'NOTE_ADDED',
          title: 'Documentation Required',
          description: 'Please upload required documentation to complete your reservation',
          eventDate: new Date(),
          scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          visibility: 'BUYER_ONLY',
          metadata: { autoGenerated: true, followUpFor: eventType },
          createdBy: userId
        }
      });
      break;

    case 'EXTENSION_GRANTED':
      // Schedule extension expiry reminder
      await prisma.reservationTimelineEvent.create({
        data: {
          id: generateId(),
          reservationId,
          eventType: 'NOTE_ADDED',
          title: 'Extension Expiry Reminder',
          description: 'Your reservation extension will expire soon',
          eventDate: new Date(),
          scheduledDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
          visibility: 'BUYER_ONLY',
          metadata: { autoGenerated: true, followUpFor: eventType },
          createdBy: userId
        }
      });
      break;
  }
}