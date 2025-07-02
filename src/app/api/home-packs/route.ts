import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { userService } from '@/lib/services/users-production';
import { z } from 'zod';

const prisma = new PrismaClient();

const createHomePackSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  propertyId: z.string().min(1, 'Property ID is required'),
  reservationId: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  packType: z.enum(['HANDOVER', 'WARRANTY', 'MAINTENANCE', 'COMPLIANCE', 'CUSTOM']).optional().default('HANDOVER'),
  status: z.enum(['DRAFT', 'IN_PREPARATION', 'READY', 'DELIVERED', 'COMPLETED']).optional().default('DRAFT'),
  targetDeliveryDate: z.string().optional(),
  notes: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

const updateHomePackSchema = createHomePackSchema.partial().omit(['userId', 'propertyId']);

/**
 * GET /api/home-packs - Get home packs with filtering and search
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
    const packType = searchParams.get('packType');
    const includeItems = searchParams.get('includeItems') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    const whereClause: any = {};

    if (userId) {
      // Check permissions for accessing another user's home packs
      if (currentUser.id !== userId && !isAuthorizedToView(currentUser)) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }
      whereClause.userId = userId;
    } else {
      // Default to current user's home packs if not admin
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

    if (packType) {
      whereClause.packType = packType;
    }

    // Get home packs with related data
    const homePacks = await prisma.homePack.findMany({
      where: whereClause,
      orderBy: { created: 'desc' },
      take: limit,
      skip: offset,
      include: {
        HomePackItem: includeItems ? {
          orderBy: { created: 'desc' },
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
        } : {
          select: { id: true, status: true, category: true }
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

    // Get total count for pagination
    const totalCount = await prisma.homePack.count({
      where: whereClause
    });

    // Calculate analytics and summaries
    const analytics = calculateHomePackAnalytics(homePacks);

    // Format response data
    const formattedHomePacks = homePacks.map(homePack => {
      const itemSummary = calculateItemSummary(homePack.HomePackItem);
      
      return {
        ...homePack,
        timeAgo: calculateTimeAgo(homePack.created),
        statusDisplay: getHomePackStatusDisplay(homePack.status),
        packTypeDisplay: getPackTypeDisplay(homePack.packType),
        itemSummary,
        completionPercentage: itemSummary.total > 0 ? 
          Math.round((itemSummary.completed / itemSummary.total) * 100) : 0,
        daysToDelivery: homePack.targetDeliveryDate ? 
          Math.ceil((new Date(homePack.targetDeliveryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null,
        isOverdue: homePack.targetDeliveryDate && 
          new Date(homePack.targetDeliveryDate) < new Date() && 
          !['DELIVERED', 'COMPLETED'].includes(homePack.status)
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        homePacks: formattedHomePacks,
        analytics,
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: offset + homePacks.length < totalCount
        }
      }
    });

  } catch (error) {
    console.error('Error fetching home packs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch home packs' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * POST /api/home-packs - Create new home pack
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createHomePackSchema.parse(body);

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
        { error: 'Insufficient permissions to create home packs for this user' },
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

    // Create home pack
    const homePack = await prisma.homePack.create({
      data: {
        id: generateId(),
        userId: validatedData.userId,
        propertyId: validatedData.propertyId,
        reservationId: validatedData.reservationId,
        title: validatedData.title,
        description: validatedData.description,
        packType: validatedData.packType,
        status: validatedData.status,
        targetDeliveryDate: validatedData.targetDeliveryDate ? new Date(validatedData.targetDeliveryDate) : null,
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
        eventType: 'HOME_PACK_CREATED',
        eventDate: new Date(),
        eventData: {
          homePackId: homePack.id,
          propertyId: validatedData.propertyId,
          packType: validatedData.packType,
          title: validatedData.title
        },
        description: `Home pack created: ${validatedData.title}`
      }
    });

    // Auto-generate standard home pack items based on pack type
    await generateDefaultHomePackItems(homePack.id, validatedData.packType, currentUser.id);

    return NextResponse.json({
      success: true,
      data: {
        homePack: {
          ...homePack,
          timeAgo: calculateTimeAgo(homePack.created),
          statusDisplay: getHomePackStatusDisplay(homePack.status),
          packTypeDisplay: getPackTypeDisplay(homePack.packType)
        },
        message: 'Home pack created successfully'
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating home pack:', error);
    
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
      { error: 'Failed to create home pack' },
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

function calculateHomePackAnalytics(homePacks: any[]) {
  const totalPacks = homePacks.length;
  const totalItems = homePacks.reduce((sum, pack) => sum + pack.HomePackItem.length, 0);
  const completedItems = homePacks.reduce((sum, pack) => 
    sum + pack.HomePackItem.filter((item: any) => item.status === 'COMPLETED').length, 0
  );

  const statusBreakdown = homePacks.reduce((acc, pack) => {
    acc[pack.status] = (acc[pack.status] || 0) + 1;
    return acc;
  }, {} as any);

  const packTypeBreakdown = homePacks.reduce((acc, pack) => {
    acc[pack.packType] = (acc[pack.packType] || 0) + 1;
    return acc;
  }, {} as any);

  const overdueCount = homePacks.filter(pack => 
    pack.targetDeliveryDate && 
    new Date(pack.targetDeliveryDate) < new Date() && 
    !['DELIVERED', 'COMPLETED'].includes(pack.status)
  ).length;

  return {
    overview: {
      totalPacks,
      totalItems,
      completedItems,
      overallCompletionRate: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0,
      overdueCount
    },
    breakdown: {
      byStatus: statusBreakdown,
      byPackType: packTypeBreakdown
    },
    trends: {
      averageItemsPerPack: totalPacks > 0 ? Math.round(totalItems / totalPacks) : 0,
      averageCompletionTime: calculateAverageCompletionTime(homePacks),
      mostCommonCategories: getMostCommonCategories(homePacks)
    }
  };
}

function calculateItemSummary(items: any[]) {
  const total = items.length;
  const completed = items.filter(item => item.status === 'COMPLETED').length;
  const pending = items.filter(item => item.status === 'PENDING').length;
  const inProgress = items.filter(item => item.status === 'IN_PROGRESS').length;

  const categories = items.reduce((acc: any, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  return {
    total,
    completed,
    pending,
    inProgress,
    categories
  };
}

function getHomePackStatusDisplay(status: string): any {
  const statusMap: any = {
    'DRAFT': { label: 'Draft', color: 'gray', description: 'Being prepared' },
    'IN_PREPARATION': { label: 'In Preparation', color: 'blue', description: 'Items being collected' },
    'READY': { label: 'Ready', color: 'green', description: 'Ready for delivery' },
    'DELIVERED': { label: 'Delivered', color: 'green', description: 'Delivered to buyer' },
    'COMPLETED': { label: 'Completed', color: 'green', description: 'Process completed' }
  };

  return statusMap[status] || { label: status, color: 'gray', description: 'Unknown status' };
}

function getPackTypeDisplay(packType: string): any {
  const typeMap: any = {
    'HANDOVER': { label: 'Handover Pack', description: 'Property handover documentation', icon: 'key' },
    'WARRANTY': { label: 'Warranty Pack', description: 'Warranty information and certificates', icon: 'shield' },
    'MAINTENANCE': { label: 'Maintenance Pack', description: 'Maintenance guides and schedules', icon: 'tools' },
    'COMPLIANCE': { label: 'Compliance Pack', description: 'Compliance certificates and documentation', icon: 'check-circle' },
    'CUSTOM': { label: 'Custom Pack', description: 'Custom documentation pack', icon: 'folder' }
  };

  return typeMap[packType] || { label: packType, description: 'Unknown type', icon: 'file' };
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

async function generateDefaultHomePackItems(homePackId: string, packType: string, createdBy: string) {
  const defaultItems: any = {
    'HANDOVER': [
      {
        title: 'Property Keys and Access Cards',
        category: 'ACCESS',
        itemType: 'PHYSICAL',
        required: true,
        description: 'All keys, fobs, and access cards for the property'
      },
      {
        title: 'Property Title Documents',
        category: 'LEGAL',
        itemType: 'DOCUMENT',
        required: true,
        description: 'Deed, title certificate, and ownership documents'
      },
      {
        title: 'Energy Performance Certificate',
        category: 'CERTIFICATE',
        itemType: 'DOCUMENT',
        required: true,
        description: 'EPC rating and energy efficiency information'
      },
      {
        title: 'Building Control Certificate',
        category: 'CERTIFICATE',
        itemType: 'DOCUMENT',
        required: true,
        description: 'Building regulations compliance certificate'
      },
      {
        title: 'Meter Readings and Utility Information',
        category: 'UTILITY',
        itemType: 'DOCUMENT',
        required: true,
        description: 'Current meter readings and utility supplier details'
      },
      {
        title: 'Property Insurance Information',
        category: 'INSURANCE',
        itemType: 'DOCUMENT',
        required: false,
        description: 'Insurance recommendations and requirements'
      }
    ],
    'WARRANTY': [
      {
        title: 'NHBC Warranty Certificate',
        category: 'WARRANTY',
        itemType: 'DOCUMENT',
        required: true,
        description: '10-year NHBC warranty documentation'
      },
      {
        title: 'Appliance Warranties',
        category: 'WARRANTY',
        itemType: 'DOCUMENT',
        required: true,
        description: 'Warranties for all included appliances'
      },
      {
        title: 'Boiler and Heating System Warranty',
        category: 'WARRANTY',
        itemType: 'DOCUMENT',
        required: true,
        description: 'Boiler installation and warranty certificates'
      },
      {
        title: 'Windows and Doors Warranty',
        category: 'WARRANTY',
        itemType: 'DOCUMENT',
        required: true,
        description: 'Window and door installation warranties'
      }
    ],
    'MAINTENANCE': [
      {
        title: 'Property Maintenance Guide',
        category: 'MANUAL',
        itemType: 'DOCUMENT',
        required: true,
        description: 'Comprehensive maintenance schedule and procedures'
      },
      {
        title: 'Appliance User Manuals',
        category: 'MANUAL',
        itemType: 'DOCUMENT',
        required: true,
        description: 'Operating manuals for all appliances'
      },
      {
        title: 'Boiler Service Instructions',
        category: 'MANUAL',
        itemType: 'DOCUMENT',
        required: true,
        description: 'Boiler maintenance and service requirements'
      },
      {
        title: 'Emergency Contact Information',
        category: 'CONTACT',
        itemType: 'DOCUMENT',
        required: true,
        description: 'Emergency contacts for utilities and services'
      }
    ],
    'COMPLIANCE': [
      {
        title: 'Gas Safety Certificate',
        category: 'CERTIFICATE',
        itemType: 'DOCUMENT',
        required: true,
        description: 'Gas installation safety certificate'
      },
      {
        title: 'Electrical Installation Certificate',
        category: 'CERTIFICATE',
        itemType: 'DOCUMENT',
        required: true,
        description: 'Electrical work compliance certificate'
      },
      {
        title: 'Fire Safety Information',
        category: 'SAFETY',
        itemType: 'DOCUMENT',
        required: true,
        description: 'Fire safety procedures and equipment information'
      }
    ],
    'CUSTOM': []
  };

  const items = defaultItems[packType] || [];

  for (const item of items) {
    await prisma.homePackItem.create({
      data: {
        id: generateId(),
        homePackId,
        title: item.title,
        description: item.description,
        category: item.category,
        itemType: item.itemType,
        status: 'PENDING',
        required: item.required,
        createdBy,
        isDefault: true
      }
    });
  }
}

function calculateAverageCompletionTime(homePacks: any[]): number {
  const completedPacks = homePacks.filter(pack => pack.status === 'COMPLETED');
  if (completedPacks.length === 0) return 0;

  const totalDays = completedPacks.reduce((sum, pack) => {
    const startDate = new Date(pack.created);
    const endDate = new Date(pack.lastUpdated);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return sum + days;
  }, 0);

  return Math.round(totalDays / completedPacks.length);
}

function getMostCommonCategories(homePacks: any[]): any[] {
  const categoryCounts: any = {};

  homePacks.forEach(pack => {
    pack.HomePackItem.forEach((item: any) => {
      const category = item.category || 'OTHER';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
  });

  return Object.entries(categoryCounts)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5)
    .map(([category, count]) => ({ category, count }));
}