import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { userService } from '@/lib/services/users-production';
import { z } from 'zod';

const prisma = new PrismaClient();

const createHomePackItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  category: z.enum(['ACCESS', 'LEGAL', 'CERTIFICATE', 'WARRANTY', 'MANUAL', 'CONTACT', 'UTILITY', 'INSURANCE', 'SAFETY', 'OTHER']),
  itemType: z.enum(['PHYSICAL', 'DOCUMENT', 'DIGITAL', 'INFORMATION']).optional().default('DOCUMENT'),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'NOT_REQUIRED']).optional().default('PENDING'),
  required: z.boolean().optional().default(false),
  targetDate: z.string().optional(),
  assignedTo: z.string().optional(),
  estimatedValue: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional().default('MEDIUM'),
  notes: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

const updateHomePackItemSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'NOT_REQUIRED']).optional(),
  required: z.boolean().optional(),
  targetDate: z.string().optional(),
  assignedTo: z.string().optional(),
  estimatedValue: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  completionNotes: z.string().optional(),
  notes: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

const bulkUpdateSchema = z.object({
  itemIds: z.array(z.string()).min(1, 'At least one item ID required'),
  updates: z.object({
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'NOT_REQUIRED']).optional(),
    assignedTo: z.string().optional(),
    targetDate: z.string().optional(),
    required: z.boolean().optional()
  }),
  notes: z.string().optional()
});

/**
 * GET /api/home-packs/[id]/items - Get home pack items with filtering and search
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: homePackId } = params;
    const { searchParams } = new URL(request.url);

    if (!homePackId) {
      return NextResponse.json(
        { error: 'Home pack ID is required' },
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

    // Verify home pack exists and user has access
    const homePack = await prisma.homePack.findUnique({
      where: { id: homePackId },
      select: { userId: true, id: true, title: true, status: true }
    });

    if (!homePack) {
      return NextResponse.json(
        { error: 'Home pack not found' },
        { status: 404 }
      );
    }

    // Check permissions
    if (homePack.userId !== currentUser.id && !isAuthorizedToView(currentUser)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Parse query parameters
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const itemType = searchParams.get('itemType');
    const required = searchParams.get('required');
    const assignedTo = searchParams.get('assignedTo');
    const overdue = searchParams.get('overdue') === 'true';
    const includeDocuments = searchParams.get('includeDocuments') === 'true';
    const sortBy = searchParams.get('sortBy') || 'created';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build where clause
    const whereClause: any = {
      homePackId
    };

    if (status) {
      whereClause.status = status;
    }

    if (category) {
      whereClause.category = category;
    }

    if (itemType) {
      whereClause.itemType = itemType;
    }

    if (required !== null && required !== undefined) {
      whereClause.required = required === 'true';
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

    // Get home pack items with full details
    const homePackItems = await prisma.homePackItem.findMany({
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
        HomePackItemDocument: includeDocuments ? {
          orderBy: { uploadDate: 'desc' },
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
        } : {
          select: { id: true, title: true, uploadDate: true }
        }
      }
    });

    // Calculate analytics
    const analytics = calculateItemAnalytics(homePackItems);

    // Format response data
    const formattedItems = homePackItems.map(item => ({
      ...item,
      timeAgo: calculateTimeAgo(item.created),
      statusDisplay: getHomePackItemStatusDisplay(item.status),
      categoryDisplay: getCategoryDisplay(item.category),
      itemTypeDisplay: getItemTypeDisplay(item.itemType),
      estimatedValueDisplay: getEstimatedValueDisplay(item.estimatedValue),
      isOverdue: item.targetDate && new Date(item.targetDate) < new Date() && item.status !== 'COMPLETED',
      daysOverdue: item.targetDate && new Date(item.targetDate) < new Date() && item.status !== 'COMPLETED' ? 
        Math.ceil((Date.now() - new Date(item.targetDate).getTime()) / (1000 * 60 * 60 * 24)) : 0,
      daysToTarget: item.targetDate && item.status !== 'COMPLETED' ? 
        Math.ceil((new Date(item.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null,
      hasDocuments: item.HomePackItemDocument.length > 0,
      documentCount: item.HomePackItemDocument.length,
      completionDays: item.completedDate && item.created ? 
        Math.ceil((new Date(item.completedDate).getTime() - new Date(item.created).getTime()) / (1000 * 60 * 60 * 24)) : null,
      canEdit: canEditItem(item, currentUser, homePack),
      canComplete: canCompleteItem(item, currentUser, homePack),
      dependencies: findItemDependencies(item, homePackItems)
    }));

    return NextResponse.json({
      success: true,
      data: {
        items: formattedItems,
        analytics,
        summary: {
          total: homePackItems.length,
          byStatus: getStatusBreakdown(homePackItems),
          byCategory: getCategoryBreakdown(homePackItems),
          byItemType: getItemTypeBreakdown(homePackItems),
          required: homePackItems.filter(item => item.required).length,
          completed: homePackItems.filter(item => item.status === 'COMPLETED').length,
          overdue: homePackItems.filter(item => 
            item.targetDate && new Date(item.targetDate) < new Date() && item.status !== 'COMPLETED'
          ).length,
          dueSoon: homePackItems.filter(item => {
            if (!item.targetDate || item.status === 'COMPLETED') return false;
            const daysToTarget = Math.ceil((new Date(item.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            return daysToTarget <= 7 && daysToTarget >= 0;
          }).length
        }
      }
    });

  } catch (error) {
    console.error('Error fetching home pack items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch home pack items' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * POST /api/home-packs/[id]/items - Create new home pack item or bulk update
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: homePackId } = params;
    const body = await request.json();

    if (!homePackId) {
      return NextResponse.json(
        { error: 'Home pack ID is required' },
        { status: 400 }
      );
    }

    // Handle bulk operations
    if (body.action === 'bulk_update') {
      return await handleBulkUpdate(homePackId, body, request);
    }

    // Handle single item creation
    const validatedData = createHomePackItemSchema.parse(body);

    // Get current user for authorization
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify home pack exists and user has access
    const homePack = await prisma.homePack.findUnique({
      where: { id: homePackId },
      select: { userId: true, id: true, status: true, packType: true }
    });

    if (!homePack) {
      return NextResponse.json(
        { error: 'Home pack not found' },
        { status: 404 }
      );
    }

    // Check permissions
    if (homePack.userId !== currentUser.id && !isAuthorizedToCreate(currentUser)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to create home pack items' },
        { status: 403 }
      );
    }

    // Can't add items to completed home packs
    if (homePack.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Cannot add items to completed home packs' },
        { status: 400 }
      );
    }

    // Create home pack item
    const homePackItem = await prisma.homePackItem.create({
      data: {
        id: generateId(),
        homePackId,
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
        itemType: validatedData.itemType,
        status: validatedData.status,
        required: validatedData.required,
        targetDate: validatedData.targetDate ? new Date(validatedData.targetDate) : null,
        assignedTo: validatedData.assignedTo,
        estimatedValue: validatedData.estimatedValue,
        notes: validatedData.notes,
        metadata: validatedData.metadata || {},
        createdBy: currentUser.id,
        isDefault: false
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

    // Update home pack status if it was draft
    if (homePack.status === 'DRAFT') {
      await prisma.homePack.update({
        where: { id: homePackId },
        data: { 
          status: 'IN_PREPARATION',
          lastUpdated: new Date()
        }
      });
    }

    // Create buyer event for item creation
    await prisma.buyerEvent.create({
      data: {
        id: generateId(),
        buyerId: homePack.userId,
        eventType: 'HOME_PACK_ITEM_CREATED',
        eventDate: new Date(),
        eventData: {
          homePackId,
          itemId: homePackItem.id,
          title: validatedData.title,
          category: validatedData.category,
          required: validatedData.required
        },
        description: `Home pack item created: ${validatedData.title}`
      }
    });

    // Create notification if item is assigned
    if (validatedData.assignedTo && validatedData.assignedTo !== currentUser.id) {
      await createAssignmentNotification(homePackItem.id, validatedData.assignedTo, currentUser.id);
    }

    return NextResponse.json({
      success: true,
      data: {
        item: {
          ...homePackItem,
          timeAgo: calculateTimeAgo(homePackItem.created),
          statusDisplay: getHomePackItemStatusDisplay(homePackItem.status),
          categoryDisplay: getCategoryDisplay(homePackItem.category),
          itemTypeDisplay: getItemTypeDisplay(homePackItem.itemType)
        },
        message: 'Home pack item created successfully'
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating home pack item:', error);
    
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
      { error: 'Failed to create home pack item' },
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
         user?.roles?.includes('ESTATE_AGENT');
}

function isAuthorizedToCreate(user: any): boolean {
  return user?.roles?.includes('ADMIN') || 
         user?.roles?.includes('SUPER_ADMIN') ||
         user?.roles?.includes('SITE_MANAGER') ||
         user?.roles?.includes('DEVELOPER');
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
    case 'status':
      return [
        { status: orderDirection },
        { required: 'desc' },
        { created: 'desc' }
      ];
    case 'category':
      return [
        { category: orderDirection },
        { required: 'desc' },
        { status: 'asc' }
      ];
    case 'required':
      return [
        { required: 'desc' },
        { status: 'asc' },
        { created: 'desc' }
      ];
    case 'targetDate':
      return [
        { targetDate: orderDirection },
        { required: 'desc' }
      ];
    case 'estimatedValue':
      return [
        { estimatedValue: 'desc' }, // Critical, High, Medium, Low
        { required: 'desc' }
      ];
    default:
      return { created: orderDirection };
  }
}

function calculateItemAnalytics(items: any[]) {
  if (items.length === 0) {
    return {
      completion: { percentage: 100, trend: 'stable' },
      readiness: { score: 100, blockers: [] },
      workload: { totalItems: 0, byAssignee: [], unassigned: 0 },
      timeline: { overdueCount: 0, dueSoonCount: 0, averageDaysToComplete: 0 }
    };
  }

  const totalItems = items.length;
  const completedItems = items.filter(item => item.status === 'COMPLETED').length;
  const requiredItems = items.filter(item => item.required);
  const completedRequired = requiredItems.filter(item => item.status === 'COMPLETED').length;

  // Completion analytics
  const completionPercentage = Math.round((completedItems / totalItems) * 100);
  const readinessScore = requiredItems.length > 0 ? 
    Math.round((completedRequired.length / requiredItems.length) * 100) : 100;

  // Blockers (required items not completed)
  const blockers = requiredItems
    .filter(item => item.status !== 'COMPLETED')
    .map(item => item.title);

  // Calculate completion times
  const completedItemsWithDates = items.filter(item => 
    item.status === 'COMPLETED' && item.completedDate && item.created
  );

  let averageDaysToComplete = 0;
  if (completedItemsWithDates.length > 0) {
    const totalDays = completedItemsWithDates.reduce((sum, item) => {
      return sum + Math.ceil((new Date(item.completedDate).getTime() - new Date(item.created).getTime()) / (1000 * 60 * 60 * 24));
    }, 0);
    averageDaysToComplete = Math.round(totalDays / completedItemsWithDates.length);
  }

  // Workload analysis
  const workloadByAssignee = items.reduce((acc: any, item) => {
    if (item.assignedTo) {
      const assignee = item.AssignedTo;
      const key = assignee ? `${assignee.firstName} ${assignee.lastName}` : 'Unknown';
      if (!acc[key]) {
        acc[key] = { total: 0, completed: 0, pending: 0 };
      }
      acc[key].total++;
      if (item.status === 'COMPLETED') {
        acc[key].completed++;
      } else {
        acc[key].pending++;
      }
    }
    return acc;
  }, {});

  const unassignedCount = items.filter(item => !item.assignedTo).length;

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

  return {
    completion: {
      percentage: completionPercentage,
      completedItems,
      totalItems,
      trend: completionPercentage > 75 ? 'excellent' : completionPercentage > 50 ? 'good' : 'needs-attention'
    },
    readiness: {
      score: readinessScore,
      blockers,
      blockerCount: blockers.length,
      requiredItems: requiredItems.length,
      completedRequired: completedRequired.length
    },
    workload: {
      totalItems,
      byAssignee: Object.entries(workloadByAssignee).map(([name, data]: [string, any]) => ({
        name,
        ...data
      })),
      unassigned: unassignedCount
    },
    timeline: {
      overdueCount,
      dueSoonCount,
      averageDaysToComplete,
      completedWithDates: completedItemsWithDates.length
    }
  };
}

function getHomePackItemStatusDisplay(status: string): any {
  const statusMap: any = {
    'PENDING': { label: 'Pending', color: 'yellow', description: 'Not started', priority: 1 },
    'IN_PROGRESS': { label: 'In Progress', color: 'blue', description: 'Being prepared', priority: 2 },
    'COMPLETED': { label: 'Completed', color: 'green', description: 'Ready for delivery', priority: 3 },
    'NOT_REQUIRED': { label: 'Not Required', color: 'gray', description: 'Not needed for this pack', priority: 4 }
  };

  return statusMap[status] || { label: status, color: 'gray', description: 'Unknown status', priority: 0 };
}

function getCategoryDisplay(category: string): any {
  const categoryMap: any = {
    'ACCESS': { label: 'Access & Keys', icon: 'key', color: 'blue' },
    'LEGAL': { label: 'Legal Documents', icon: 'file-text', color: 'purple' },
    'CERTIFICATE': { label: 'Certificates', icon: 'award', color: 'green' },
    'WARRANTY': { label: 'Warranties', icon: 'shield', color: 'orange' },
    'MANUAL': { label: 'Manuals & Guides', icon: 'book', color: 'indigo' },
    'CONTACT': { label: 'Contact Information', icon: 'phone', color: 'cyan' },
    'UTILITY': { label: 'Utilities', icon: 'zap', color: 'yellow' },
    'INSURANCE': { label: 'Insurance', icon: 'umbrella', color: 'red' },
    'SAFETY': { label: 'Safety Information', icon: 'shield-check', color: 'red' },
    'OTHER': { label: 'Other', icon: 'more-horizontal', color: 'gray' }
  };

  return categoryMap[category] || { label: category, icon: 'circle', color: 'gray' };
}

function getItemTypeDisplay(itemType: string): any {
  const typeMap: any = {
    'PHYSICAL': { label: 'Physical Item', icon: 'box', description: 'Physical item to be handed over' },
    'DOCUMENT': { label: 'Document', icon: 'file', description: 'Document or certificate' },
    'DIGITAL': { label: 'Digital Item', icon: 'monitor', description: 'Digital file or access' },
    'INFORMATION': { label: 'Information', icon: 'info', description: 'Information or instructions' }
  };

  return typeMap[itemType] || { label: itemType, icon: 'circle', description: 'Unknown type' };
}

function getEstimatedValueDisplay(value: string): any {
  const valueMap: any = {
    'LOW': { label: 'Low', color: 'green', priority: 1 },
    'MEDIUM': { label: 'Medium', color: 'yellow', priority: 2 },
    'HIGH': { label: 'High', color: 'orange', priority: 3 },
    'CRITICAL': { label: 'Critical', color: 'red', priority: 4 }
  };

  return valueMap[value] || { label: value, color: 'gray', priority: 0 };
}

function getStatusBreakdown(items: any[]) {
  return items.reduce((acc: any, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});
}

function getCategoryBreakdown(items: any[]) {
  return items.reduce((acc: any, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});
}

function getItemTypeBreakdown(items: any[]) {
  return items.reduce((acc: any, item) => {
    acc[item.itemType] = (acc[item.itemType] || 0) + 1;
    return acc;
  }, {});
}

function canEditItem(item: any, user: any, homePack: any): boolean {
  // Pack owner can always edit
  if (homePack.userId === user.id) return true;
  
  // Assigned person can edit
  if (item.assignedTo === user.id) return true;
  
  // Authorized roles can edit
  return user?.roles?.includes('ADMIN') || 
         user?.roles?.includes('SUPER_ADMIN') ||
         user?.roles?.includes('SITE_MANAGER');
}

function canCompleteItem(item: any, user: any, homePack: any): boolean {
  // Can't complete already completed items
  if (item.status === 'COMPLETED') return false;
  
  // Assigned person can complete
  if (item.assignedTo === user.id) return true;
  
  // Authorized roles can complete
  return canEditItem(item, user, homePack);
}

function findItemDependencies(item: any, allItems: any[]): string[] {
  // Find items that this item depends on
  const dependencies = [];
  
  if (item.category === 'LEGAL' && item.title.includes('Title')) {
    // Title documents depend on completion certificates
    const completionCert = allItems.find(i => 
      i.category === 'CERTIFICATE' && i.title.includes('Building Control')
    );
    if (completionCert && completionCert.status !== 'COMPLETED') {
      dependencies.push(completionCert.title);
    }
  }
  
  if (item.category === 'WARRANTY' && item.title.includes('Appliance')) {
    // Appliance warranties depend on appliance delivery
    const applianceDelivery = allItems.find(i => 
      i.category === 'PHYSICAL' && i.title.includes('Appliance')
    );
    if (applianceDelivery && applianceDelivery.status !== 'COMPLETED') {
      dependencies.push(applianceDelivery.title);
    }
  }
  
  return dependencies;
}

async function handleBulkUpdate(homePackId: string, body: any, request: NextRequest) {
  const validatedData = bulkUpdateSchema.parse(body);
  
  const currentUser = await getCurrentUser(request);
  if (!currentUser) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  // Verify user has permission to update items
  const homePack = await prisma.homePack.findUnique({
    where: { id: homePackId },
    select: { userId: true }
  });

  if (!homePack || (homePack.userId !== currentUser.id && !isAuthorizedToCreate(currentUser))) {
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

  // Add completion tracking for status changes
  if (validatedData.updates.status === 'COMPLETED') {
    updateData.completedDate = new Date();
    updateData.completedBy = currentUser.id;
  }

  // Perform bulk update
  const updateResult = await prisma.homePackItem.updateMany({
    where: {
      id: { in: validatedData.itemIds },
      homePackId // Ensure items belong to this home pack
    },
    data: updateData
  });

  // Create buyer events for significant bulk updates
  if (validatedData.updates.status === 'COMPLETED' && updateResult.count > 0) {
    await prisma.buyerEvent.create({
      data: {
        id: generateId(),
        buyerId: homePack.userId,
        eventType: 'HOME_PACK_ITEMS_BULK_COMPLETED',
        eventDate: new Date(),
        eventData: {
          homePackId,
          itemIds: validatedData.itemIds,
          itemCount: updateResult.count,
          notes: validatedData.notes
        },
        description: `${updateResult.count} home pack items completed via bulk update`
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
  console.log(`Home pack item ${itemId} assigned to ${assignedTo} by ${assignedBy}`);
}