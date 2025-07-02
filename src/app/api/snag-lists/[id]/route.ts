import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { userService } from '@/lib/services/users-production';
import { z } from 'zod';

const prisma = new PrismaClient();

const updateSnagListSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['DRAFT', 'IN_PROGRESS', 'UNDER_REVIEW', 'COMPLETED', 'ON_HOLD', 'CANCELLED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  inspectionDate: z.string().optional(),
  inspectorName: z.string().optional(),
  inspectorContact: z.string().optional(),
  targetCompletionDate: z.string().optional(),
  notes: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

/**
 * GET /api/snag-lists/[id] - Get specific snag list with full details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: snagListId } = params;

    if (!snagListId) {
      return NextResponse.json(
        { error: 'Snag list ID is required' },
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

    // Get snag list with comprehensive details
    const snagList = await prisma.snagList.findUnique({
      where: { id: snagListId },
      include: {
        SnagItem: {
          orderBy: [
            { priority: 'desc' },
            { status: 'asc' },
            { created: 'desc' }
          ],
          include: {
            CreatedBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            },
            AssignedTo: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            },
            SnagItemUpdate: {
              orderBy: { created: 'desc' },
              take: 5,
              include: {
                UpdatedBy: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true
                  }
                }
              }
            },
            SnagItemPhoto: {
              orderBy: { uploadDate: 'desc' }
            }
          }
        },
        CreatedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        Property: {
          select: {
            id: true,
            title: true,
            address: true,
            unitNumber: true,
            developmentId: true,
            Development: {
              select: {
                id: true,
                name: true,
                developer: true
              }
            }
          }
        },
        Reservation: {
          select: {
            id: true,
            reservationNumber: true,
            status: true
          }
        }
      }
    });

    if (!snagList) {
      return NextResponse.json(
        { error: 'Snag list not found' },
        { status: 404 }
      );
    }

    // Check permissions
    if (snagList.userId !== currentUser.id && !isAuthorizedToView(currentUser)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Calculate detailed analytics
    const analytics = calculateDetailedAnalytics(snagList);
    
    // Get recent activity timeline
    const timeline = await generateSnagListTimeline(snagListId);

    // Calculate progress and estimates
    const progress = calculateProgressMetrics(snagList);

    // Generate recommendations and next steps
    const recommendations = generateRecommendations(snagList, analytics);

    // Format snag items with enhanced data
    const formattedSnagItems = snagList.SnagItem.map((item: any) => ({
      ...item,
      timeAgo: calculateTimeAgo(item.created),
      statusDisplay: getSnagItemStatusDisplay(item.status),
      priorityDisplay: getPriorityDisplay(item.priority),
      isOverdue: item.targetDate && new Date(item.targetDate) < new Date() && item.status !== 'COMPLETED',
      daysOverdue: item.targetDate && new Date(item.targetDate) < new Date() && item.status !== 'COMPLETED' ? 
        Math.ceil((Date.now() - new Date(item.targetDate).getTime()) / (1000 * 60 * 60 * 24)) : 0,
      estimatedResolution: estimateItemResolution(item),
      hasPhotos: item.SnagItemPhoto.length > 0,
      photoCount: item.SnagItemPhoto.length,
      updateCount: item.SnagItemUpdate.length,
      lastUpdate: item.SnagItemUpdate[0] || null
    }));

    return NextResponse.json({
      success: true,
      data: {
        snagList: {
          ...snagList,
          SnagItem: formattedSnagItems,
          timeAgo: calculateTimeAgo(snagList.created),
          statusDisplay: getSnagListStatusDisplay(snagList.status),
          priorityDisplay: getPriorityDisplay(snagList.priority),
          daysToTarget: snagList.targetCompletionDate ? 
            Math.ceil((new Date(snagList.targetCompletionDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null,
          isOverdue: snagList.targetCompletionDate && 
            new Date(snagList.targetCompletionDate) < new Date() && 
            snagList.status !== 'COMPLETED'
        },
        analytics,
        timeline,
        progress,
        recommendations
      }
    });

  } catch (error) {
    console.error('Error fetching snag list:', error);
    return NextResponse.json(
      { error: 'Failed to fetch snag list' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * PATCH /api/snag-lists/[id] - Update snag list
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: snagListId } = params;
    const body = await request.json();
    const validatedData = updateSnagListSchema.parse(body);

    if (!snagListId) {
      return NextResponse.json(
        { error: 'Snag list ID is required' },
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

    // Get existing snag list
    const existingSnagList = await prisma.snagList.findUnique({
      where: { id: snagListId },
      select: { userId: true, status: true, title: true }
    });

    if (!existingSnagList) {
      return NextResponse.json(
        { error: 'Snag list not found' },
        { status: 404 }
      );
    }

    // Check permissions
    if (existingSnagList.userId !== currentUser.id && !isAuthorizedToUpdate(currentUser)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to update this snag list' },
        { status: 403 }
      );
    }

    // Prepare update data
    const updateData: any = {
      lastUpdated: new Date()
    };

    // Map validated fields to update data
    Object.keys(validatedData).forEach(key => {
      const value = validatedData[key as keyof typeof validatedData];
      if (value !== undefined) {
        switch (key) {
          case 'inspectionDate':
          case 'targetCompletionDate':
            updateData[key] = value ? new Date(value) : null;
            break;
          default:
            updateData[key] = value;
        }
      }
    });

    // Update snag list
    const updatedSnagList = await prisma.snagList.update({
      where: { id: snagListId },
      data: updateData,
      include: {
        SnagItem: {
          select: {
            id: true,
            status: true,
            priority: true
          }
        },
        CreatedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        Property: {
          select: {
            id: true,
            title: true,
            address: true
          }
        }
      }
    });

    // Create activity log for status changes
    if (validatedData.status && validatedData.status !== existingSnagList.status) {
      await createStatusChangeActivity(snagListId, existingSnagList.status, validatedData.status, currentUser.id);
      
      // Create buyer event for significant status changes
      await prisma.buyerEvent.create({
        data: {
          id: generateId(),
          buyerId: existingSnagList.userId,
          eventType: 'SNAG_LIST_STATUS_CHANGED',
          eventDate: new Date(),
          eventData: {
            snagListId,
            previousStatus: existingSnagList.status,
            newStatus: validatedData.status,
            title: existingSnagList.title
          },
          description: `Snag list status changed to ${validatedData.status}`
        }
      });

      // Auto-complete items if list is marked as completed
      if (validatedData.status === 'COMPLETED') {
        await autoCompleteOpenItems(snagListId, currentUser.id);
      }
    }

    // Recalculate analytics after update
    const analytics = calculateDetailedAnalytics(updatedSnagList);

    return NextResponse.json({
      success: true,
      data: {
        snagList: {
          ...updatedSnagList,
          timeAgo: calculateTimeAgo(updatedSnagList.created),
          statusDisplay: getSnagListStatusDisplay(updatedSnagList.status),
          priorityDisplay: getPriorityDisplay(updatedSnagList.priority)
        },
        analytics,
        message: 'Snag list updated successfully'
      }
    });

  } catch (error) {
    console.error('Error updating snag list:', error);
    
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
      { error: 'Failed to update snag list' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * DELETE /api/snag-lists/[id] - Delete snag list (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: snagListId } = params;

    if (!snagListId) {
      return NextResponse.json(
        { error: 'Snag list ID is required' },
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

    // Check admin permissions
    if (!isAuthorizedToDelete(currentUser)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to delete snag lists' },
        { status: 403 }
      );
    }

    // Get snag list details before deletion
    const snagList = await prisma.snagList.findUnique({
      where: { id: snagListId },
      select: { userId: true, title: true, status: true }
    });

    if (!snagList) {
      return NextResponse.json(
        { error: 'Snag list not found' },
        { status: 404 }
      );
    }

    // Soft delete by marking as cancelled instead of hard delete
    const deletedSnagList = await prisma.snagList.update({
      where: { id: snagListId },
      data: {
        status: 'CANCELLED',
        lastUpdated: new Date(),
        notes: `Deleted by ${currentUser.firstName} ${currentUser.lastName} on ${new Date().toISOString()}`
      }
    });

    // Create buyer event
    await prisma.buyerEvent.create({
      data: {
        id: generateId(),
        buyerId: snagList.userId,
        eventType: 'SNAG_LIST_DELETED',
        eventDate: new Date(),
        eventData: {
          snagListId,
          title: snagList.title,
          deletedBy: currentUser.id
        },
        description: `Snag list deleted: ${snagList.title}`
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        message: 'Snag list deleted successfully'
      }
    });

  } catch (error) {
    console.error('Error deleting snag list:', error);
    return NextResponse.json(
      { error: 'Failed to delete snag list' },
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

function isAuthorizedToView(user: any): boolean {
  return user?.roles?.includes('ADMIN') || 
         user?.roles?.includes('SUPER_ADMIN') ||
         user?.roles?.includes('DEVELOPER') ||
         user?.roles?.includes('SITE_MANAGER') ||
         user?.roles?.includes('CONTRACTOR');
}

function isAuthorizedToUpdate(user: any): boolean {
  return user?.roles?.includes('ADMIN') || 
         user?.roles?.includes('SUPER_ADMIN') ||
         user?.roles?.includes('SITE_MANAGER') ||
         user?.roles?.includes('CONTRACTOR');
}

function isAuthorizedToDelete(user: any): boolean {
  return user?.roles?.includes('ADMIN') || 
         user?.roles?.includes('SUPER_ADMIN');
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

function calculateDetailedAnalytics(snagList: any) {
  const items = snagList.SnagItem || [];
  const totalItems = items.length;
  
  if (totalItems === 0) {
    return {
      completion: { percentage: 100, completedItems: 0, totalItems: 0 },
      priority: { critical: 0, high: 0, medium: 0, low: 0 },
      status: { open: 0, inProgress: 0, completed: 0, onHold: 0 },
      timeline: { overdue: 0, dueSoon: 0, onTrack: 0 },
      categories: {},
      efficiency: { averageResolutionDays: 0, fastest: null, slowest: null }
    };
  }

  // Completion analytics
  const completedItems = items.filter((item: any) => item.status === 'COMPLETED').length;
  const completionPercentage = Math.round((completedItems / totalItems) * 100);

  // Priority breakdown
  const priorityBreakdown = items.reduce((acc: any, item: any) => {
    acc[item.priority.toLowerCase()] = (acc[item.priority.toLowerCase()] || 0) + 1;
    return acc;
  }, { critical: 0, high: 0, medium: 0, low: 0 });

  // Status breakdown
  const statusBreakdown = items.reduce((acc: any, item: any) => {
    const status = item.status.toLowerCase().replace('_', '');
    acc[status === 'inprogress' ? 'inProgress' : status === 'onhold' ? 'onHold' : status] = 
      (acc[status === 'inprogress' ? 'inProgress' : status === 'onhold' ? 'onHold' : status] || 0) + 1;
    return acc;
  }, { open: 0, inProgress: 0, completed: 0, onHold: 0 });

  // Timeline analytics
  const now = new Date();
  const timeline = items.reduce((acc: any, item: any) => {
    if (item.targetDate && item.status !== 'COMPLETED') {
      const targetDate = new Date(item.targetDate);
      const daysToTarget = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysToTarget < 0) {
        acc.overdue++;
      } else if (daysToTarget <= 7) {
        acc.dueSoon++;
      } else {
        acc.onTrack++;
      }
    } else if (item.status !== 'COMPLETED') {
      acc.onTrack++;
    }
    return acc;
  }, { overdue: 0, dueSoon: 0, onTrack: 0 });

  // Category breakdown
  const categories = items.reduce((acc: any, item: any) => {
    const category = item.category || 'OTHER';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  // Efficiency metrics
  const completedItemsWithDates = items.filter((item: any) => 
    item.status === 'COMPLETED' && item.completedDate && item.created
  );
  
  let averageResolutionDays = 0;
  let fastest = null;
  let slowest = null;

  if (completedItemsWithDates.length > 0) {
    const resolutionTimes = completedItemsWithDates.map((item: any) => {
      const days = Math.ceil((new Date(item.completedDate).getTime() - new Date(item.created).getTime()) / (1000 * 60 * 60 * 24));
      return { item: item.title, days };
    });

    averageResolutionDays = Math.round(resolutionTimes.reduce((sum, r) => sum + r.days, 0) / resolutionTimes.length);
    fastest = resolutionTimes.reduce((prev, current) => prev.days < current.days ? prev : current);
    slowest = resolutionTimes.reduce((prev, current) => prev.days > current.days ? prev : current);
  }

  return {
    completion: {
      percentage: completionPercentage,
      completedItems,
      totalItems,
      remainingItems: totalItems - completedItems
    },
    priority: priorityBreakdown,
    status: statusBreakdown,
    timeline,
    categories,
    efficiency: {
      averageResolutionDays,
      fastest,
      slowest,
      totalCompletedItems: completedItemsWithDates.length
    }
  };
}

async function generateSnagListTimeline(snagListId: string) {
  // Get snag item activities
  const activities = await prisma.snagItemUpdate.findMany({
    where: {
      SnagItem: {
        snagListId
      }
    },
    orderBy: { created: 'desc' },
    take: 20,
    include: {
      UpdatedBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      },
      SnagItem: {
        select: {
          id: true,
          title: true
        }
      }
    }
  });

  return activities.map(activity => ({
    id: activity.id,
    date: activity.created,
    type: activity.updateType,
    description: activity.updateText || `${activity.updateType} - ${activity.SnagItem.title}`,
    user: activity.UpdatedBy,
    itemTitle: activity.SnagItem.title,
    timeAgo: calculateTimeAgo(activity.created)
  }));
}

function calculateProgressMetrics(snagList: any) {
  const items = snagList.SnagItem || [];
  const totalItems = items.length;
  
  if (totalItems === 0) {
    return {
      overall: 100,
      byPriority: { critical: 100, high: 100, medium: 100, low: 100 },
      velocity: 0,
      estimated: { daysRemaining: 0, completionDate: null }
    };
  }

  const completedItems = items.filter((item: any) => item.status === 'COMPLETED').length;
  const overallProgress = Math.round((completedItems / totalItems) * 100);

  // Progress by priority
  const priorities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  const byPriority = priorities.reduce((acc: any, priority) => {
    const priorityItems = items.filter((item: any) => item.priority === priority);
    const priorityCompleted = priorityItems.filter((item: any) => item.status === 'COMPLETED').length;
    acc[priority.toLowerCase()] = priorityItems.length > 0 ? 
      Math.round((priorityCompleted / priorityItems.length) * 100) : 100;
    return acc;
  }, {});

  // Calculate velocity (items completed per day)
  const completedItemsWithDates = items.filter((item: any) => 
    item.status === 'COMPLETED' && item.completedDate
  );

  let velocity = 0;
  if (completedItemsWithDates.length > 0) {
    const oldestCompletion = completedItemsWithDates.reduce((oldest: any, current: any) => 
      new Date(current.completedDate) < new Date(oldest.completedDate) ? current : oldest
    );
    
    const daysSinceFirst = Math.ceil((Date.now() - new Date(oldestCompletion.completedDate).getTime()) / (1000 * 60 * 60 * 24));
    velocity = daysSinceFirst > 0 ? completedItemsWithDates.length / daysSinceFirst : 0;
  }

  // Estimate completion
  const remainingItems = totalItems - completedItems;
  const daysRemaining = velocity > 0 ? Math.ceil(remainingItems / velocity) : 0;
  const completionDate = daysRemaining > 0 ? 
    new Date(Date.now() + daysRemaining * 24 * 60 * 60 * 1000) : null;

  return {
    overall: overallProgress,
    byPriority,
    velocity: Math.round(velocity * 100) / 100,
    estimated: {
      daysRemaining,
      completionDate
    }
  };
}

function generateRecommendations(snagList: any, analytics: any): string[] {
  const recommendations = [];
  const items = snagList.SnagItem || [];

  // Overdue items
  if (analytics.timeline.overdue > 0) {
    recommendations.push(`Address ${analytics.timeline.overdue} overdue items immediately`);
  }

  // High priority items
  if (analytics.priority.critical > 0 || analytics.priority.high > 0) {
    const highPriorityCount = analytics.priority.critical + analytics.priority.high;
    recommendations.push(`Focus on ${highPriorityCount} high priority items first`);
  }

  // Due soon
  if (analytics.timeline.dueSoon > 0) {
    recommendations.push(`${analytics.timeline.dueSoon} items due within 7 days`);
  }

  // Progress recommendations
  if (analytics.completion.percentage < 25) {
    recommendations.push('Consider increasing resource allocation to improve progress');
  } else if (analytics.completion.percentage > 75) {
    recommendations.push('Excellent progress - focus on completing remaining items');
  }

  // Efficiency recommendations
  if (analytics.efficiency.averageResolutionDays > 7) {
    recommendations.push('Resolution time is above average - consider process improvements');
  }

  return recommendations;
}

function getSnagListStatusDisplay(status: string): any {
  const statusMap: any = {
    'DRAFT': { label: 'Draft', color: 'gray', description: 'Being prepared' },
    'IN_PROGRESS': { label: 'In Progress', color: 'blue', description: 'Items being addressed' },
    'UNDER_REVIEW': { label: 'Under Review', color: 'yellow', description: 'Awaiting review' },
    'COMPLETED': { label: 'Completed', color: 'green', description: 'All items resolved' },
    'ON_HOLD': { label: 'On Hold', color: 'orange', description: 'Temporarily paused' },
    'CANCELLED': { label: 'Cancelled', color: 'red', description: 'Cancelled' }
  };

  return statusMap[status] || { label: status, color: 'gray', description: 'Unknown status' };
}

function getSnagItemStatusDisplay(status: string): any {
  const statusMap: any = {
    'OPEN': { label: 'Open', color: 'red', description: 'Not started' },
    'IN_PROGRESS': { label: 'In Progress', color: 'blue', description: 'Being worked on' },
    'PENDING_REVIEW': { label: 'Pending Review', color: 'yellow', description: 'Awaiting review' },
    'COMPLETED': { label: 'Completed', color: 'green', description: 'Resolved' },
    'ON_HOLD': { label: 'On Hold', color: 'orange', description: 'Temporarily paused' },
    'REJECTED': { label: 'Rejected', color: 'gray', description: 'Not valid' }
  };

  return statusMap[status] || { label: status, color: 'gray', description: 'Unknown status' };
}

function getPriorityDisplay(priority: string): any {
  const priorityMap: any = {
    'LOW': { label: 'Low', color: 'green', urgency: 1 },
    'MEDIUM': { label: 'Medium', color: 'yellow', urgency: 2 },
    'HIGH': { label: 'High', color: 'orange', urgency: 3 },
    'CRITICAL': { label: 'Critical', color: 'red', urgency: 4 }
  };

  return priorityMap[priority] || { label: priority, color: 'gray', urgency: 0 };
}

function estimateItemResolution(item: any): string {
  const priorityDays: any = {
    'CRITICAL': 1,
    'HIGH': 3,
    'MEDIUM': 7,
    'LOW': 14
  };

  const baseDays = priorityDays[item.priority] || 7;
  
  // Adjust based on category complexity
  const categoryMultiplier: any = {
    'STRUCTURAL': 2.0,
    'ELECTRICAL': 1.5,
    'PLUMBING': 1.5,
    'FINISHES': 1.0,
    'GENERAL': 0.5
  };

  const multiplier = categoryMultiplier[item.category] || 1.0;
  const estimatedDays = Math.ceil(baseDays * multiplier);

  if (estimatedDays <= 1) return 'Same day';
  if (estimatedDays <= 3) return `${estimatedDays} days`;
  if (estimatedDays <= 7) return '1 week';
  if (estimatedDays <= 14) return '2 weeks';
  return `${Math.ceil(estimatedDays / 7)} weeks`;
}

async function createStatusChangeActivity(snagListId: string, oldStatus: string, newStatus: string, userId: string) {
  // This would create an activity log entry for the status change
  // For now, we'll just log it
  console.log(`Snag list ${snagListId} status changed from ${oldStatus} to ${newStatus} by user ${userId}`);
}

async function autoCompleteOpenItems(snagListId: string, userId: string) {
  // Auto-complete all open items when snag list is marked as completed
  await prisma.snagItem.updateMany({
    where: {
      snagListId,
      status: { not: 'COMPLETED' }
    },
    data: {
      status: 'COMPLETED',
      completedDate: new Date(),
      completedBy: userId,
      completionNotes: 'Auto-completed when snag list was marked as completed'
    }
  });
}