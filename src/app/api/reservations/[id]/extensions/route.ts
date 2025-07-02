import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { userService } from '@/lib/services/users-production';
import { z } from 'zod';

const prisma = new PrismaClient();

const createExtensionRequestSchema = z.object({
  requestedDays: z.number().min(1, 'Must request at least 1 day').max(90, 'Cannot request more than 90 days'),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
  justification: z.string().optional(),
  urgency: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional().default('MEDIUM'),
  contactPreference: z.enum(['EMAIL', 'PHONE', 'BOTH']).optional().default('EMAIL'),
  additionalFee: z.number().optional().default(0),
  supportingDocuments: z.array(z.string()).optional()
});

const processExtensionSchema = z.object({
  action: z.enum(['APPROVE', 'REJECT', 'REQUEST_MORE_INFO']),
  approvedDays: z.number().min(0).optional(),
  adminNotes: z.string().optional(),
  conditions: z.array(z.string()).optional(),
  additionalFee: z.number().optional(),
  reviewDate: z.string().optional()
});

/**
 * GET /api/reservations/[id]/extensions - Get extension history
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
      select: { 
        userId: true, 
        id: true, 
        expiresAt: true,
        status: true,
        created: true
      }
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

    // Get extension requests
    const extensions = await prisma.reservationExtension.findMany({
      where: { reservationId },
      orderBy: { requestDate: 'desc' },
      include: {
        RequestedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        ProcessedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Calculate extension eligibility
    const eligibility = await calculateExtensionEligibility(reservationId, reservation);

    // Get current reservation timeline
    const currentTimeline = {
      originalExpiryDate: reservation.expiresAt,
      daysRemaining: reservation.expiresAt ? 
        Math.ceil((new Date(reservation.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 
        null,
      totalExtensionsDays: extensions
        .filter(ext => ext.status === 'APPROVED')
        .reduce((total, ext) => total + (ext.approvedDays || 0), 0),
      canRequestExtension: eligibility.eligible
    };

    return NextResponse.json({
      success: true,
      data: {
        extensions: extensions.map(ext => ({
          ...ext,
          timeAgo: calculateTimeAgo(ext.requestDate),
          processing: {
            timeToProcess: ext.processedAt ? 
              calculateProcessingTime(ext.requestDate, ext.processedAt) : 
              null,
            isOverdue: !ext.processedAt && isRequestOverdue(ext.requestDate)
          }
        })),
        timeline: currentTimeline,
        eligibility,
        statistics: {
          totalRequests: extensions.length,
          approved: extensions.filter(ext => ext.status === 'APPROVED').length,
          rejected: extensions.filter(ext => ext.status === 'REJECTED').length,
          pending: extensions.filter(ext => ext.status === 'PENDING').length,
          averageRequestDays: calculateAverageRequestDays(extensions),
          averageProcessingTime: calculateAverageProcessingTime(extensions)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching reservation extensions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reservation extensions' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * POST /api/reservations/[id]/extensions - Request extension
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: reservationId } = params;
    const body = await request.json();
    const validatedData = createExtensionRequestSchema.parse(body);

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

    // Get reservation to check access and eligibility
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      select: { 
        userId: true, 
        id: true, 
        status: true,
        expiresAt: true,
        created: true
      }
    });

    if (!reservation) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      );
    }

    // Check permissions - only reservation owner can request extensions
    if (reservation.userId !== currentUser.id) {
      return NextResponse.json(
        { error: 'Only the reservation owner can request extensions' },
        { status: 403 }
      );
    }

    // Check eligibility
    const eligibility = await calculateExtensionEligibility(reservationId, reservation);
    if (!eligibility.eligible) {
      return NextResponse.json(
        { 
          error: 'Extension request not eligible',
          reason: eligibility.reason,
          details: eligibility.details
        },
        { status: 400 }
      );
    }

    // Check for pending requests
    const pendingRequest = await prisma.reservationExtension.findFirst({
      where: {
        reservationId,
        status: 'PENDING'
      }
    });

    if (pendingRequest) {
      return NextResponse.json(
        { error: 'You already have a pending extension request' },
        { status: 400 }
      );
    }

    // Calculate potential new expiry date
    const currentExpiry = new Date(reservation.expiresAt!);
    const newExpiry = new Date(currentExpiry.getTime() + validatedData.requestedDays * 24 * 60 * 60 * 1000);

    // Create extension request
    const extensionRequest = await prisma.reservationExtension.create({
      data: {
        id: generateId(),
        reservationId,
        requestedDays: validatedData.requestedDays,
        requestedNewExpiryDate: newExpiry,
        reason: validatedData.reason,
        justification: validatedData.justification,
        urgency: validatedData.urgency,
        contactPreference: validatedData.contactPreference,
        additionalFee: validatedData.additionalFee,
        supportingDocuments: validatedData.supportingDocuments || [],
        status: 'PENDING',
        requestDate: new Date(),
        requestedBy: currentUser.id,
        metadata: {
          originalExpiryDate: reservation.expiresAt,
          daysRemainingAtRequest: Math.ceil((currentExpiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        }
      },
      include: {
        RequestedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Create timeline event
    await prisma.reservationTimelineEvent.create({
      data: {
        id: generateId(),
        reservationId,
        eventType: 'EXTENSION_GRANTED',
        title: `Extension Request Submitted`,
        description: `Requested ${validatedData.requestedDays} days extension - ${validatedData.reason}`,
        eventDate: new Date(),
        metadata: {
          extensionId: extensionRequest.id,
          requestedDays: validatedData.requestedDays,
          urgency: validatedData.urgency,
          reason: validatedData.reason
        },
        visibility: 'PUBLIC',
        createdBy: currentUser.id
      }
    });

    // Create buyer event
    await prisma.buyerEvent.create({
      data: {
        id: generateId(),
        buyerId: reservation.userId,
        eventType: 'EXTENSION_REQUESTED',
        eventDate: new Date(),
        eventData: {
          reservationId,
          extensionId: extensionRequest.id,
          requestedDays: validatedData.requestedDays,
          reason: validatedData.reason
        },
        description: `Extension requested: ${validatedData.requestedDays} days`
      }
    });

    // Notify relevant parties
    await createExtensionNotifications(reservationId, extensionRequest.id, 'REQUEST_SUBMITTED');

    return NextResponse.json({
      success: true,
      data: {
        extension: {
          ...extensionRequest,
          timeAgo: calculateTimeAgo(extensionRequest.requestDate),
          processing: {
            estimatedResponseTime: calculateEstimatedResponseTime(validatedData.urgency)
          }
        },
        message: 'Extension request submitted successfully'
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating extension request:', error);
    
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
      { error: 'Failed to create extension request' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * PATCH /api/reservations/[id]/extensions - Process extension request (admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: reservationId } = params;
    const body = await request.json();
    const { extensionId, ...processData } = body;
    const validatedData = processExtensionSchema.parse(processData);

    if (!reservationId || !extensionId) {
      return NextResponse.json(
        { error: 'Reservation ID and Extension ID are required' },
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

    // Check permissions - only admin or authorized users can process extensions
    const canProcess = isAdmin(currentUser) || 
                      currentUser.roles?.includes('ESTATE_AGENT') ||
                      currentUser.roles?.includes('DEVELOPER');

    if (!canProcess) {
      return NextResponse.json(
        { error: 'Insufficient permissions to process extension requests' },
        { status: 403 }
      );
    }

    // Get extension request
    const extensionRequest = await prisma.reservationExtension.findUnique({
      where: { id: extensionId },
      include: {
        Reservation: {
          select: {
            id: true,
            userId: true,
            expiresAt: true,
            status: true
          }
        }
      }
    });

    if (!extensionRequest || extensionRequest.reservationId !== reservationId) {
      return NextResponse.json(
        { error: 'Extension request not found' },
        { status: 404 }
      );
    }

    if (extensionRequest.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Extension request has already been processed' },
        { status: 400 }
      );
    }

    // Process the request
    const updateData: any = {
      status: validatedData.action === 'REQUEST_MORE_INFO' ? 'PENDING' : validatedData.action,
      processedAt: new Date(),
      processedBy: currentUser.id,
      adminNotes: validatedData.adminNotes,
      conditions: validatedData.conditions || [],
      reviewDate: validatedData.reviewDate ? new Date(validatedData.reviewDate) : null
    };

    if (validatedData.action === 'APPROVE') {
      const approvedDays = validatedData.approvedDays || extensionRequest.requestedDays;
      const currentExpiry = new Date(extensionRequest.Reservation.expiresAt!);
      const newExpiry = new Date(currentExpiry.getTime() + approvedDays * 24 * 60 * 60 * 1000);

      updateData.approvedDays = approvedDays;
      updateData.approvedNewExpiryDate = newExpiry;
      updateData.additionalFee = validatedData.additionalFee || 0;

      // Update reservation expiry date
      await prisma.reservation.update({
        where: { id: reservationId },
        data: { 
          expiresAt: newExpiry,
          lastUpdated: new Date()
        }
      });
    }

    // Update extension request
    const updatedExtension = await prisma.reservationExtension.update({
      where: { id: extensionId },
      data: updateData,
      include: {
        RequestedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        ProcessedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Create timeline event
    const eventTitle = validatedData.action === 'APPROVE' ? 
      `Extension Approved: ${updatedExtension.approvedDays} days` :
      validatedData.action === 'REJECT' ?
      'Extension Request Rejected' :
      'Extension Request - More Information Required';

    await prisma.reservationTimelineEvent.create({
      data: {
        id: generateId(),
        reservationId,
        eventType: 'EXTENSION_GRANTED',
        title: eventTitle,
        description: validatedData.adminNotes || `Extension request ${validatedData.action.toLowerCase()}`,
        eventDate: new Date(),
        metadata: {
          extensionId,
          action: validatedData.action,
          approvedDays: updatedExtension.approvedDays,
          adminNotes: validatedData.adminNotes,
          conditions: validatedData.conditions
        },
        visibility: 'PUBLIC',
        createdBy: currentUser.id
      }
    });

    // Notify buyer of decision
    await createExtensionNotifications(reservationId, extensionId, validatedData.action);

    return NextResponse.json({
      success: true,
      data: {
        extension: {
          ...updatedExtension,
          timeAgo: calculateTimeAgo(updatedExtension.requestDate),
          processing: {
            timeToProcess: calculateProcessingTime(updatedExtension.requestDate, updatedExtension.processedAt!)
          }
        },
        message: `Extension request ${validatedData.action.toLowerCase()} successfully`
      }
    });

  } catch (error) {
    console.error('Error processing extension request:', error);
    
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
      { error: 'Failed to process extension request' },
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

async function calculateExtensionEligibility(reservationId: string, reservation: any) {
  // Check if reservation is eligible for extension
  if (reservation.status !== 'ACTIVE') {
    return {
      eligible: false,
      reason: 'Reservation is not active',
      details: `Current status: ${reservation.status}`
    };
  }

  if (!reservation.expiresAt) {
    return {
      eligible: false,
      reason: 'Reservation has no expiry date',
      details: 'Cannot extend reservation without expiry date'
    };
  }

  const now = new Date();
  const expiry = new Date(reservation.expiresAt);
  
  if (expiry <= now) {
    return {
      eligible: false,
      reason: 'Reservation has already expired',
      details: `Expired on ${expiry.toDateString()}`
    };
  }

  // Check previous extensions
  const extensionCount = await prisma.reservationExtension.count({
    where: { 
      reservationId,
      status: 'APPROVED'
    }
  });

  if (extensionCount >= 3) {
    return {
      eligible: false,
      reason: 'Maximum extensions reached',
      details: 'You have already been granted the maximum number of extensions (3)'
    };
  }

  const totalExtensionDays = await prisma.reservationExtension.aggregate({
    where: {
      reservationId,
      status: 'APPROVED'
    },
    _sum: {
      approvedDays: true
    }
  });

  if ((totalExtensionDays._sum.approvedDays || 0) >= 180) {
    return {
      eligible: false,
      reason: 'Maximum extension period reached',
      details: 'Total extensions cannot exceed 180 days'
    };
  }

  return {
    eligible: true,
    reason: 'Eligible for extension',
    details: {
      previousExtensions: extensionCount,
      totalExtensionDays: totalExtensionDays._sum.approvedDays || 0,
      daysRemaining: Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    }
  };
}

function calculateProcessingTime(requestDate: Date, processedDate: Date): string {
  const diffInHours = Math.floor((processedDate.getTime() - requestDate.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 24) {
    return `${diffInHours} hours`;
  } else {
    const days = Math.floor(diffInHours / 24);
    const hours = diffInHours % 24;
    return `${days} days${hours > 0 ? `, ${hours} hours` : ''}`;
  }
}

function isRequestOverdue(requestDate: Date): boolean {
  const now = new Date();
  const hoursSinceRequest = (now.getTime() - requestDate.getTime()) / (1000 * 60 * 60);
  return hoursSinceRequest > 72; // 3 days
}

function calculateAverageRequestDays(extensions: any[]): number {
  if (extensions.length === 0) return 0;
  const totalDays = extensions.reduce((sum, ext) => sum + ext.requestedDays, 0);
  return Math.round(totalDays / extensions.length);
}

function calculateAverageProcessingTime(extensions: any[]): string {
  const processedExtensions = extensions.filter(ext => ext.processedAt);
  if (processedExtensions.length === 0) return 'N/A';
  
  const totalHours = processedExtensions.reduce((sum, ext) => {
    return sum + (new Date(ext.processedAt).getTime() - new Date(ext.requestDate).getTime()) / (1000 * 60 * 60);
  }, 0);
  
  const avgHours = totalHours / processedExtensions.length;
  
  if (avgHours < 24) {
    return `${Math.round(avgHours)} hours`;
  } else {
    return `${Math.round(avgHours / 24)} days`;
  }
}

function calculateEstimatedResponseTime(urgency: string): string {
  switch (urgency) {
    case 'HIGH': return '24-48 hours';
    case 'MEDIUM': return '2-3 business days';
    case 'LOW': return '3-5 business days';
    default: return '2-3 business days';
  }
}

async function createExtensionNotifications(reservationId: string, extensionId: string, action: string) {
  // TODO: Implement notification system for extension requests
  // This would typically send emails/SMS to relevant parties
}