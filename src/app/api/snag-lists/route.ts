import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { userService } from '@/lib/services/users-production';
import { z } from 'zod';

const prisma = new PrismaClient();

const createSnagListSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  propertyId: z.string().min(1, 'Property ID is required'),
  reservationId: z.string().optional(),
  inspectionType: z.enum(['PRE_COMPLETION', 'FINAL_INSPECTION', 'POST_HANDOVER', 'WARRANTY_INSPECTION']),
  inspectionDate: z.string().optional(),
  inspectorName: z.string().optional(),
  inspectorContact: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional().default('MEDIUM'),
  targetCompletionDate: z.string().optional(),
  notes: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

const updateSnagListSchema = createSnagListSchema.partial().omit(['userId', 'propertyId']);

/**
 * GET /api/snag-lists - Get snag lists with filtering and search
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get current user for authorization
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const userId = searchParams.get('userId');
    const propertyId = searchParams.get('propertyId');
    const reservationId = searchParams.get('reservationId');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const inspectionType = searchParams.get('inspectionType');
    const includeCompleted = searchParams.get('includeCompleted') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    const whereClause: any = {};

    if (userId) {
      // Check permissions for accessing another user's snag lists
      if (currentUser.id !== userId && !isAuthorizedToView(currentUser)) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }
      whereClause.userId = userId;
    } else {
      // Default to current user's snag lists if not admin
      if (!isAuthorizedToView(currentUser)) {
        whereClause.userId = currentUser.id;
      }
    }

    if (propertyId) {
      whereClause.propertyId = propertyId;
    }

    if (reservationId) {
      whereClause.reservationId = reservationId;
    }

    if (status) {
      whereClause.status = status;
    }

    if (priority) {
      whereClause.priority = priority;
    }

    if (inspectionType) {
      whereClause.inspectionType = inspectionType;
    }

    if (!includeCompleted) {
      whereClause.status = { not: 'COMPLETED' };
    }

    // Get snag lists with related data
    const snagLists = await prisma.snagList.findMany({
      where: whereClause,
      orderBy: { created: 'desc' },
      take: limit,
      skip: offset,
      include: {
        SnagItem: {
          orderBy: { created: 'desc' },
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
            developmentId: true
          }
        }
      }
    });

    // Get total count for pagination
    const totalCount = await prisma.snagList.count({
      where: whereClause
    });

    // Calculate analytics and summaries
    const analytics = calculateSnagListAnalytics(snagLists);

    // Format response data
    const formattedSnagLists = snagLists.map(snagList => ({
      ...snagList,
      timeAgo: calculateTimeAgo(snagList.created),
      summary: {
        totalItems: snagList.SnagItem.length,
        openItems: snagList.SnagItem.filter(item => item.status !== 'COMPLETED').length,
        highPriorityItems: snagList.SnagItem.filter(item => item.priority === 'HIGH' || item.priority === 'CRITICAL').length,
        overdueItems: snagList.SnagItem.filter(item => 
          item.targetDate && new Date(item.targetDate) < new Date() && item.status !== 'COMPLETED'
        ).length,
        completionPercentage: snagList.SnagItem.length > 0 ? 
          Math.round((snagList.SnagItem.filter(item => item.status === 'COMPLETED').length / snagList.SnagItem.length) * 100) : 0
      },
      statusDisplay: getSnagListStatusDisplay(snagList.status),
      priorityDisplay: getPriorityDisplay(snagList.priority),
      daysToTarget: snagList.targetCompletionDate ? 
        Math.ceil((new Date(snagList.targetCompletionDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null
    }));

    return NextResponse.json({
      success: true,
      data: {
        snagLists: formattedSnagLists,
        analytics,
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: offset + snagLists.length < totalCount
        }
      }
    });

  } catch (error) {
    console.error('Error fetching snag lists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch snag lists' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * POST /api/snag-lists - Create new snag list
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createSnagListSchema.parse(body);

    // Get current user for authorization
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check permissions to create for this user
    if (currentUser.id !== validatedData.userId && !isAuthorizedToCreate(currentUser)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to create snag lists for this user' },
        { status: 403 }
      );
    }

    // Verify property exists and user has access
    const property = await verifyPropertyAccess(validatedData.propertyId, validatedData.userId);
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found or access denied' },
        { status: 404 }
      );
    }

    // Create snag list
    const snagList = await prisma.snagList.create({
      data: {
        id: generateId(),
        userId: validatedData.userId,
        propertyId: validatedData.propertyId,
        reservationId: validatedData.reservationId,
        inspectionType: validatedData.inspectionType,
        inspectionDate: validatedData.inspectionDate ? new Date(validatedData.inspectionDate) : null,
        inspectorName: validatedData.inspectorName,
        inspectorContact: validatedData.inspectorContact,
        title: validatedData.title,
        description: validatedData.description,
        status: 'DRAFT',
        priority: validatedData.priority,
        targetCompletionDate: validatedData.targetCompletionDate ? new Date(validatedData.targetCompletionDate) : null,
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
        Property: {
          select: {
            id: true,
            title: true,
            address: true,
            unitNumber: true
          }
        }
      }
    });

    // Create buyer event
    await prisma.buyerEvent.create({
      data: {
        id: generateId(),
        buyerId: validatedData.userId,
        eventType: 'SNAG_LIST_CREATED',
        eventDate: new Date(),
        eventData: {
          snagListId: snagList.id,
          propertyId: validatedData.propertyId,
          inspectionType: validatedData.inspectionType,
          title: validatedData.title
        },
        description: `Snag list created: ${validatedData.title}`
      }
    });

    // Auto-generate common snag items based on inspection type
    await generateDefaultSnagItems(snagList.id, validatedData.inspectionType, currentUser.id);

    return NextResponse.json({
      success: true,
      data: {
        snagList: {
          ...snagList,
          timeAgo: calculateTimeAgo(snagList.created),
          statusDisplay: getSnagListStatusDisplay(snagList.status),
          priorityDisplay: getPriorityDisplay(snagList.priority)
        },
        message: 'Snag list created successfully'
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating snag list:', error);
    
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
      { error: 'Failed to create snag list' },
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
         user?.roles?.includes('SITE_MANAGER');
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

function calculateSnagListAnalytics(snagLists: any[]) {
  const totalLists = snagLists.length;
  const totalItems = snagLists.reduce((sum, list) => sum + list.SnagItem.length, 0);
  const completedItems = snagLists.reduce((sum, list) => 
    sum + list.SnagItem.filter((item: any) => item.status === 'COMPLETED').length, 0
  );
  const openItems = totalItems - completedItems;
  const highPriorityItems = snagLists.reduce((sum, list) => 
    sum + list.SnagItem.filter((item: any) => item.priority === 'HIGH' || item.priority === 'CRITICAL').length, 0
  );
  const overdueItems = snagLists.reduce((sum, list) => 
    sum + list.SnagItem.filter((item: any) => 
      item.targetDate && new Date(item.targetDate) < new Date() && item.status !== 'COMPLETED'
    ).length, 0
  );

  const statusBreakdown = snagLists.reduce((acc, list) => {
    acc[list.status] = (acc[list.status] || 0) + 1;
    return acc;
  }, {} as any);

  const inspectionTypeBreakdown = snagLists.reduce((acc, list) => {
    acc[list.inspectionType] = (acc[list.inspectionType] || 0) + 1;
    return acc;
  }, {} as any);

  return {
    overview: {
      totalLists,
      totalItems,
      completedItems,
      openItems,
      highPriorityItems,
      overdueItems,
      overallCompletionRate: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
    },
    breakdown: {
      byStatus: statusBreakdown,
      byInspectionType: inspectionTypeBreakdown,
      byPriority: snagLists.reduce((acc, list) => {
        acc[list.priority] = (acc[list.priority] || 0) + 1;
        return acc;
      }, {} as any)
    },
    trends: {
      averageItemsPerList: totalLists > 0 ? Math.round(totalItems / totalLists) : 0,
      averageCompletionTime: calculateAverageCompletionTime(snagLists),
      mostCommonIssues: getMostCommonIssues(snagLists)
    }
  };
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

function getPriorityDisplay(priority: string): any {
  const priorityMap: any = {
    'LOW': { label: 'Low', color: 'green', urgency: 1 },
    'MEDIUM': { label: 'Medium', color: 'yellow', urgency: 2 },
    'HIGH': { label: 'High', color: 'orange', urgency: 3 },
    'CRITICAL': { label: 'Critical', color: 'red', urgency: 4 }
  };

  return priorityMap[priority] || { label: priority, color: 'gray', urgency: 0 };
}

async function verifyPropertyAccess(propertyId: string, userId: string): Promise<boolean> {
  // Check if user has access to this property through reservations or ownership
  const access = await prisma.reservation.findFirst({
    where: {
      propertyId,
      userId,
      status: { in: ['ACTIVE', 'COMPLETED'] }
    }
  });

  return !!access;
}

async function generateDefaultSnagItems(snagListId: string, inspectionType: string, createdBy: string) {
  const defaultItems: any = {
    'PRE_COMPLETION': [
      { title: 'Windows and doors operation check', category: 'WINDOWS_DOORS', priority: 'MEDIUM' },
      { title: 'Electrical outlets and switches test', category: 'ELECTRICAL', priority: 'HIGH' },
      { title: 'Plumbing fixtures operation', category: 'PLUMBING', priority: 'HIGH' },
      { title: 'Paint and finish quality check', category: 'FINISHES', priority: 'MEDIUM' },
      { title: 'Flooring condition inspection', category: 'FLOORING', priority: 'MEDIUM' },
      { title: 'Kitchen appliances functionality', category: 'APPLIANCES', priority: 'MEDIUM' },
      { title: 'Bathroom fixtures and sealing', category: 'BATHROOM', priority: 'HIGH' }
    ],
    'FINAL_INSPECTION': [
      { title: 'Overall cleanliness and presentation', category: 'GENERAL', priority: 'MEDIUM' },
      { title: 'Safety equipment installation', category: 'SAFETY', priority: 'HIGH' },
      { title: 'Warranty documentation provided', category: 'DOCUMENTATION', priority: 'MEDIUM' },
      { title: 'Keys and access cards functionality', category: 'ACCESS', priority: 'HIGH' },
      { title: 'Meter readings recorded', category: 'UTILITIES', priority: 'MEDIUM' }
    ],
    'POST_HANDOVER': [
      { title: 'Settling cracks inspection', category: 'STRUCTURAL', priority: 'MEDIUM' },
      { title: 'Appliance warranty issues', category: 'APPLIANCES', priority: 'LOW' },
      { title: 'Minor cosmetic touch-ups', category: 'FINISHES', priority: 'LOW' }
    ],
    'WARRANTY_INSPECTION': [
      { title: 'Structural integrity check', category: 'STRUCTURAL', priority: 'HIGH' },
      { title: 'Weatherproofing effectiveness', category: 'EXTERIOR', priority: 'HIGH' },
      { title: 'Long-term finish durability', category: 'FINISHES', priority: 'MEDIUM' }
    ]
  };

  const items = defaultItems[inspectionType] || [];

  for (const item of items) {
    await prisma.snagItem.create({
      data: {
        id: generateId(),
        snagListId,
        title: item.title,
        category: item.category,
        priority: item.priority,
        status: 'OPEN',
        description: `Default ${inspectionType.toLowerCase().replace('_', ' ')} item`,
        createdBy,
        isDefault: true
      }
    });
  }
}

function calculateAverageCompletionTime(snagLists: any[]): number {
  const completedLists = snagLists.filter(list => list.status === 'COMPLETED');
  if (completedLists.length === 0) return 0;

  const totalDays = completedLists.reduce((sum, list) => {
    const startDate = new Date(list.created);
    const endDate = new Date(list.lastUpdated);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return sum + days;
  }, 0);

  return Math.round(totalDays / completedLists.length);
}

function getMostCommonIssues(snagLists: any[]): any[] {
  const issueCounts: any = {};

  snagLists.forEach(list => {
    list.SnagItem.forEach((item: any) => {
      const category = item.category || 'OTHER';
      issueCounts[category] = (issueCounts[category] || 0) + 1;
    });
  });

  return Object.entries(issueCounts)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5)
    .map(([category, count]) => ({ category, count }));
}