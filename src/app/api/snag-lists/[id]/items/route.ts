import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { userService } from '@/lib/services/users-production';
import { z } from 'zod';

const prisma = new PrismaClient();

const createSnagItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  category: z.enum(['STRUCTURAL', 'ELECTRICAL', 'PLUMBING', 'FINISHES', 'FLOORING', 'WINDOWS_DOORS', 'BATHROOM', 'KITCHEN', 'APPLIANCES', 'SAFETY', 'EXTERIOR', 'GENERAL', 'OTHER']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional().default('MEDIUM'),
  location: z.string().optional(),
  targetDate: z.string().optional(),
  assignedTo: z.string().optional(),
  contractorRequired: z.boolean().optional().default(false),
  estimatedCost: z.number().optional(),
  notes: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

const updateSnagItemSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'PENDING_REVIEW', 'COMPLETED', 'ON_HOLD', 'REJECTED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  location: z.string().optional(),
  targetDate: z.string().optional(),
  assignedTo: z.string().optional(),
  contractorRequired: z.boolean().optional(),
  estimatedCost: z.number().optional(),
  actualCost: z.number().optional(),
  completionNotes: z.string().optional(),
  notes: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

const bulkUpdateSchema = z.object({
  itemIds: z.array(z.string()).min(1, 'At least one item ID required'),
  updates: z.object({
    status: z.enum(['OPEN', 'IN_PROGRESS', 'PENDING_REVIEW', 'COMPLETED', 'ON_HOLD', 'REJECTED']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    assignedTo: z.string().optional(),
    targetDate: z.string().optional()
  }),
  notes: z.string().optional()
});

/**
 * GET /api/snag-lists/[id]/items - Get snag items for a specific snag list
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: snagListId } = params;
    const { searchParams } = new URL(request.url);

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

    // Verify snag list exists and user has access
    const snagList = await prisma.snagList.findUnique({
      where: { id: snagListId },
      select: { userId: true, id: true, title: true }
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

    // Parse query parameters
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const category = searchParams.get('category');
    const assignedTo = searchParams.get('assignedTo');
    const overdue = searchParams.get('overdue') === 'true';
    const sortBy = searchParams.get('sortBy') || 'created';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build where clause
    const whereClause: any = {
      snagListId
    };

    if (status) {
      whereClause.status = status;
    }

    if (priority) {
      whereClause.priority = priority;
    }

    if (category) {
      whereClause.category = category;
    }

    if (assignedTo) {
      whereClause.assignedTo = assignedTo;
    }

    if (overdue) {
      whereClause.targetDate = {
        lt: new Date()
      };
      whereClause.status = {
        not: 'COMPLETED'
      };
    }

    // Get snag items with full details
    const snagItems = await prisma.snagItem.findMany({
      where: whereClause,
      orderBy: getSortOrder(sortBy, sortOrder),
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
        CompletedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        SnagItemUpdate: {
          orderBy: { created: 'desc' },
          take: 3,
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
    });

    // Calculate item analytics
    const analytics = calculateItemAnalytics(snagItems);

    // Format response data
    const formattedSnagItems = snagItems.map(item => ({
      ...item,
      timeAgo: calculateTimeAgo(item.created),
      statusDisplay: getSnagItemStatusDisplay(item.status),
      priorityDisplay: getPriorityDisplay(item.priority),
      categoryDisplay: getCategoryDisplay(item.category),
      isOverdue: item.targetDate && new Date(item.targetDate) < new Date() && item.status !== 'COMPLETED',
      daysOverdue: item.targetDate && new Date(item.targetDate) < new Date() && item.status !== 'COMPLETED' ? 
        Math.ceil((Date.now() - new Date(item.targetDate).getTime()) / (1000 * 60 * 60 * 24)) : 0,
      daysToTarget: item.targetDate && item.status !== 'COMPLETED' ? 
        Math.ceil((new Date(item.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null,
      hasPhotos: item.SnagItemPhoto.length > 0,
      photoCount: item.SnagItemPhoto.length,
      updateCount: item.SnagItemUpdate.length,
      lastUpdate: item.SnagItemUpdate[0] || null,
      estimatedResolution: estimateItemResolution(item),
      resolutionDays: item.completedDate && item.created ? 
        Math.ceil((new Date(item.completedDate).getTime() - new Date(item.created).getTime()) / (1000 * 60 * 60 * 24)) : null
    }));

    return NextResponse.json({
      success: true,
      data: {
        items: formattedSnagItems,
        analytics,
        summary: {
          total: snagItems.length,
          byStatus: getStatusBreakdown(snagItems),
          byPriority: getPriorityBreakdown(snagItems),
          byCategory: getCategoryBreakdown(snagItems),
          overdue: snagItems.filter(item => 
            item.targetDate && new Date(item.targetDate) < new Date() && item.status !== 'COMPLETED'
          ).length,
          dueSoon: snagItems.filter(item => {
            if (!item.targetDate || item.status === 'COMPLETED') return false;
            const daysToTarget = Math.ceil((new Date(item.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            return daysToTarget <= 7 && daysToTarget >= 0;
          }).length
        }
      }
    });

  } catch (error) {
    console.error('Error fetching snag items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch snag items' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * POST /api/snag-lists/[id]/items - Create new snag item
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: snagListId } = params;
    const body = await request.json();

    if (!snagListId) {
      return NextResponse.json(
        { error: 'Snag list ID is required' },
        { status: 400 }
      );
    }

    // Handle bulk operations
    if (body.action === 'bulk_update') {
      return await handleBulkUpdate(snagListId, body, request);
    }

    // Handle single item creation
    const validatedData = createSnagItemSchema.parse(body);

    // Get current user for authorization
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify snag list exists and user has access
    const snagList = await prisma.snagList.findUnique({
      where: { id: snagListId },
      select: { userId: true, id: true, status: true }
    });

    if (!snagList) {
      return NextResponse.json(
        { error: 'Snag list not found' },
        { status: 404 }
      );
    }

    // Check permissions
    if (snagList.userId !== currentUser.id && !isAuthorizedToCreate(currentUser)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to create snag items' },
        { status: 403 }
      );
    }

    // Can't add items to completed snag lists
    if (snagList.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Cannot add items to completed snag lists' },
        { status: 400 }
      );
    }

    // Create snag item
    const snagItem = await prisma.snagItem.create({
      data: {
        id: generateId(),
        snagListId,
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
        priority: validatedData.priority,
        status: 'OPEN',
        location: validatedData.location,
        targetDate: validatedData.targetDate ? new Date(validatedData.targetDate) : null,
        assignedTo: validatedData.assignedTo,
        contractorRequired: validatedData.contractorRequired,
        estimatedCost: validatedData.estimatedCost,
        notes: validatedData.notes,
        metadata: validatedData.metadata || {},
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
        },
        AssignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Create initial update record
    await prisma.snagItemUpdate.create({
      data: {
        id: generateId(),
        itemId: snagItem.id,
        updateType: 'CREATED',
        updateText: `Snag item created: ${validatedData.title}`,
        updatedBy: currentUser.id
      }
    });

    // Update snag list status if it was draft
    if (snagList.status === 'DRAFT') {
      await prisma.snagList.update({
        where: { id: snagListId },
        data: { 
          status: 'IN_PROGRESS',
          lastUpdated: new Date()
        }
      });
    }

    // Create notification if item is assigned
    if (validatedData.assignedTo && validatedData.assignedTo !== currentUser.id) {
      await createAssignmentNotification(snagItem.id, validatedData.assignedTo, currentUser.id);
    }

    return NextResponse.json({
      success: true,
      data: {
        item: {
          ...snagItem,
          timeAgo: calculateTimeAgo(snagItem.created),
          statusDisplay: getSnagItemStatusDisplay(snagItem.status),
          priorityDisplay: getPriorityDisplay(snagItem.priority),
          categoryDisplay: getCategoryDisplay(snagItem.category)
        },
        message: 'Snag item created successfully'
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating snag item:', error);
    
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
      { error: 'Failed to create snag item' },
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

function isAuthorizedToCreate(user: any): boolean {
  return user?.roles?.includes('ADMIN') || 
         user?.roles?.includes('SUPER_ADMIN') ||
         user?.roles?.includes('SITE_MANAGER') ||
         user?.roles?.includes('CONTRACTOR');
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

function getSortOrder(sortBy: string, sortOrder: string) {
  const orderDirection = sortOrder === 'desc' ? 'desc' : 'asc';
  
  switch (sortBy) {
    case 'priority':
      return [
        { priority: 'desc' }, // Critical, High, Medium, Low
        { created: 'desc' }
      ];
    case 'status':
      return [
        { status: orderDirection },
        { created: 'desc' }
      ];
    case 'targetDate':
      return [
        { targetDate: orderDirection },
        { priority: 'desc' }
      ];
    case 'category':
      return [
        { category: orderDirection },
        { priority: 'desc' }
      ];
    default:
      return { created: orderDirection };
  }
}

function calculateItemAnalytics(items: any[]) {
  if (items.length === 0) {
    return {
      completion: { percentage: 100, trend: 'stable' },
      efficiency: { averageResolutionDays: 0, velocity: 0 },
      workload: { totalEstimatedCost: 0, byAssignee: [] },
      timeline: { overdueCount: 0, dueSoonCount: 0, averageDaysToTarget: 0 }
    };
  }

  const completedItems = items.filter(item => item.status === 'COMPLETED');
  const completionPercentage = Math.round((completedItems.length / items.length) * 100);

  // Calculate resolution times
  const resolutionTimes = completedItems
    .filter(item => item.completedDate && item.created)
    .map(item => {
      return Math.ceil((new Date(item.completedDate).getTime() - new Date(item.created).getTime()) / (1000 * 60 * 60 * 24));
    });

  const averageResolutionDays = resolutionTimes.length > 0 ? 
    Math.round(resolutionTimes.reduce((sum, days) => sum + days, 0) / resolutionTimes.length) : 0;

  // Calculate velocity (items completed per day over last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recentCompletions = completedItems.filter(item => 
    item.completedDate && new Date(item.completedDate) >= thirtyDaysAgo
  );
  const velocity = recentCompletions.length / 30;

  // Workload analysis
  const totalEstimatedCost = items.reduce((sum, item) => sum + (item.estimatedCost || 0), 0);
  const workloadByAssignee = items.reduce((acc: any, item) => {
    if (item.assignedTo) {
      const assignee = item.AssignedTo;
      const key = assignee ? `${assignee.firstName} ${assignee.lastName}` : 'Unknown';
      acc[key] = (acc[key] || 0) + 1;
    }
    return acc;
  }, {});

  // Timeline analysis
  const now = new Date();
  const overdueCount = items.filter(item => 
    item.targetDate && new Date(item.targetDate) < now && item.status !== 'COMPLETED'
  ).length;

  const dueSoonCount = items.filter(item => {
    if (!item.targetDate || item.status === 'COMPLETED') return false;
    const daysToTarget = Math.ceil((new Date(item.targetDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysToTarget <= 7 && daysToTarget >= 0;
  }).length;

  const itemsWithTargets = items.filter(item => item.targetDate && item.status !== 'COMPLETED');
  const averageDaysToTarget = itemsWithTargets.length > 0 ? 
    Math.round(itemsWithTargets.reduce((sum, item) => {
      return sum + Math.ceil((new Date(item.targetDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    }, 0) / itemsWithTargets.length) : 0;

  return {
    completion: {
      percentage: completionPercentage,
      trend: velocity > 0.5 ? 'improving' : velocity > 0.1 ? 'stable' : 'declining'
    },
    efficiency: {
      averageResolutionDays,
      velocity: Math.round(velocity * 100) / 100
    },
    workload: {
      totalEstimatedCost,
      byAssignee: Object.entries(workloadByAssignee).map(([name, count]) => ({ name, count }))
    },
    timeline: {
      overdueCount,
      dueSoonCount,
      averageDaysToTarget
    }
  };
}

function getSnagItemStatusDisplay(status: string): any {
  const statusMap: any = {
    'OPEN': { label: 'Open', color: 'red', description: 'Not started', priority: 1 },
    'IN_PROGRESS': { label: 'In Progress', color: 'blue', description: 'Being worked on', priority: 2 },
    'PENDING_REVIEW': { label: 'Pending Review', color: 'yellow', description: 'Awaiting review', priority: 3 },
    'COMPLETED': { label: 'Completed', color: 'green', description: 'Resolved', priority: 4 },
    'ON_HOLD': { label: 'On Hold', color: 'orange', description: 'Temporarily paused', priority: 5 },
    'REJECTED': { label: 'Rejected', color: 'gray', description: 'Not valid', priority: 6 }
  };

  return statusMap[status] || { label: status, color: 'gray', description: 'Unknown status', priority: 0 };
}

function getPriorityDisplay(priority: string): any {
  const priorityMap: any = {
    'LOW': { label: 'Low', color: 'green', urgency: 1, days: 14 },
    'MEDIUM': { label: 'Medium', color: 'yellow', urgency: 2, days: 7 },
    'HIGH': { label: 'High', color: 'orange', urgency: 3, days: 3 },
    'CRITICAL': { label: 'Critical', color: 'red', urgency: 4, days: 1 }
  };

  return priorityMap[priority] || { label: priority, color: 'gray', urgency: 0, days: 7 };
}

function getCategoryDisplay(category: string): any {
  const categoryMap: any = {
    'STRUCTURAL': { label: 'Structural', icon: 'building', color: 'red' },
    'ELECTRICAL': { label: 'Electrical', icon: 'zap', color: 'yellow' },
    'PLUMBING': { label: 'Plumbing', icon: 'droplet', color: 'blue' },
    'FINISHES': { label: 'Finishes', icon: 'brush', color: 'purple' },
    'FLOORING': { label: 'Flooring', icon: 'square', color: 'brown' },
    'WINDOWS_DOORS': { label: 'Windows & Doors', icon: 'door', color: 'gray' },
    'BATHROOM': { label: 'Bathroom', icon: 'bath', color: 'cyan' },
    'KITCHEN': { label: 'Kitchen', icon: 'chef-hat', color: 'orange' },
    'APPLIANCES': { label: 'Appliances', icon: 'microwave', color: 'indigo' },
    'SAFETY': { label: 'Safety', icon: 'shield', color: 'red' },
    'EXTERIOR': { label: 'Exterior', icon: 'home', color: 'green' },
    'GENERAL': { label: 'General', icon: 'settings', color: 'gray' },
    'OTHER': { label: 'Other', icon: 'more-horizontal', color: 'gray' }
  };

  return categoryMap[category] || { label: category, icon: 'circle', color: 'gray' };
}

function getStatusBreakdown(items: any[]) {
  return items.reduce((acc: any, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});
}

function getPriorityBreakdown(items: any[]) {
  return items.reduce((acc: any, item) => {
    acc[item.priority] = (acc[item.priority] || 0) + 1;
    return acc;
  }, {});
}

function getCategoryBreakdown(items: any[]) {
  return items.reduce((acc: any, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});
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
    'STRUCTURAL': 3.0,
    'ELECTRICAL': 2.0,
    'PLUMBING': 2.0,
    'FINISHES': 1.0,
    'GENERAL': 0.5,
    'OTHER': 1.0
  };

  const multiplier = categoryMultiplier[item.category] || 1.0;
  const estimatedDays = Math.ceil(baseDays * multiplier);

  if (estimatedDays <= 1) return 'Same day';
  if (estimatedDays <= 3) return `${estimatedDays} days`;
  if (estimatedDays <= 7) return '1 week';
  if (estimatedDays <= 14) return '2 weeks';
  return `${Math.ceil(estimatedDays / 7)} weeks`;
}

async function handleBulkUpdate(snagListId: string, body: any, request: NextRequest) {
  const validatedData = bulkUpdateSchema.parse(body);
  
  const currentUser = await getCurrentUser(request);
  if (!currentUser) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  // Verify user has permission to update items
  const snagList = await prisma.snagList.findUnique({
    where: { id: snagListId },
    select: { userId: true }
  });

  if (!snagList || (snagList.userId !== currentUser.id && !isAuthorizedToCreate(currentUser))) {
    return NextResponse.json(
      { error: 'Insufficient permissions' },
      { status: 403 }
    );
  }

  // Prepare update data
  const updateData: any = {
    lastUpdated: new Date()
  };

  Object.keys(validatedData.updates).forEach(key => {
    const value = validatedData.updates[key as keyof typeof validatedData.updates];
    if (value !== undefined) {
      if (key === 'targetDate') {
        updateData[key] = value ? new Date(value) : null;
      } else {
        updateData[key] = value;
      }
    }
  });

  // Perform bulk update
  const updateResult = await prisma.snagItem.updateMany({
    where: {
      id: { in: validatedData.itemIds },
      snagListId // Ensure items belong to this snag list
    },
    data: updateData
  });

  // Create update records for each item
  for (const itemId of validatedData.itemIds) {
    await prisma.snagItemUpdate.create({
      data: {
        id: generateId(),
        itemId,
        updateType: 'BULK_UPDATE',
        updateText: validatedData.notes || 'Bulk update applied',
        updatedBy: currentUser.id,
        metadata: validatedData.updates
      }
    });
  }

  return NextResponse.json({
    success: true,
    data: {
      updatedCount: updateResult.count,
      message: `${updateResult.count} items updated successfully`
    }
  });
}

async function createAssignmentNotification(itemId: string, assignedTo: string, assignedBy: string) {
  // Create notification for assignment
  // This would typically integrate with a notification service
  console.log(`Snag item ${itemId} assigned to ${assignedTo} by ${assignedBy}`);
}