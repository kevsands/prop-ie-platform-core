import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { userService } from '@/lib/services/users-production';
import { z } from 'zod';

const prisma = new PrismaClient();

const updateHomePackSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['DRAFT', 'IN_PREPARATION', 'READY', 'DELIVERED', 'COMPLETED']).optional(),
  packType: z.enum(['HANDOVER', 'WARRANTY', 'MAINTENANCE', 'COMPLIANCE', 'CUSTOM']).optional(),
  targetDeliveryDate: z.string().optional(),
  deliveryDate: z.string().optional(),
  deliveryMethod: z.string().optional(),
  deliveryNotes: z.string().optional(),
  notes: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

const generatePackageSchema = z.object({
  includePhysicalItems: z.boolean().optional().default(true),
  includeDigitalItems: z.boolean().optional().default(true),
  deliveryMethod: z.enum(['PHYSICAL', 'DIGITAL', 'HYBRID']).optional().default('HYBRID'),
  packageFormat: z.enum(['PDF', 'ZIP', 'EMAIL']).optional().default('PDF'),
  customInstructions: z.string().optional()
});

/**
 * GET /api/home-packs/[id] - Get specific home pack with full details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: homePackId } = params;

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

    // Get home pack with comprehensive details
    const homePack = await prisma.homePack.findUnique({
      where: { id: homePackId },
      include: {
        HomePackItem: {
          orderBy: [
            { required: 'desc' },
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
            HomePackItemDocument: {
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
        DeliveredBy: {
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
                developer: true,
                contactEmail: true,
                contactPhone: true
              }
            }
          }
        },
        Reservation: {
          select: {
            id: true,
            reservationNumber: true,
            status: true,
            completionDate: true
          }
        }
      }
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

    // Calculate detailed analytics
    const analytics = calculateDetailedAnalytics(homePack);
    
    // Get delivery timeline
    const deliveryTimeline = await generateDeliveryTimeline(homePackId);

    // Calculate readiness score
    const readinessScore = calculateReadinessScore(homePack);

    // Generate recommendations
    const recommendations = generateRecommendations(homePack, analytics);

    // Format home pack items with enhanced data
    const formattedItems = homePack.HomePackItem.map((item: any) => ({
      ...item,
      timeAgo: calculateTimeAgo(item.created),
      statusDisplay: getHomePackItemStatusDisplay(item.status),
      categoryDisplay: getCategoryDisplay(item.category),
      itemTypeDisplay: getItemTypeDisplay(item.itemType),
      hasDocuments: item.HomePackItemDocument.length > 0,
      documentCount: item.HomePackItemDocument.length,
      completionDays: item.completedDate && item.created ? 
        Math.ceil((new Date(item.completedDate).getTime() - new Date(item.created).getTime()) / (1000 * 60 * 60 * 24)) : null,
      estimatedValue: estimateItemValue(item),
      dependencies: findItemDependencies(item, homePack.HomePackItem)
    }));

    return NextResponse.json({
      success: true,
      data: {
        homePack: {
          ...homePack,
          HomePackItem: formattedItems,
          timeAgo: calculateTimeAgo(homePack.created),
          statusDisplay: getHomePackStatusDisplay(homePack.status),
          packTypeDisplay: getPackTypeDisplay(homePack.packType),
          daysToDelivery: homePack.targetDeliveryDate ? 
            Math.ceil((new Date(homePack.targetDeliveryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null,
          isOverdue: homePack.targetDeliveryDate && 
            new Date(homePack.targetDeliveryDate) < new Date() && 
            !['DELIVERED', 'COMPLETED'].includes(homePack.status),
          daysSinceDelivery: homePack.deliveryDate ? 
            Math.ceil((Date.now() - new Date(homePack.deliveryDate).getTime()) / (1000 * 60 * 60 * 24)) : null
        },
        analytics,
        deliveryTimeline,
        readinessScore,
        recommendations,
        checklist: generateDeliveryChecklist(homePack),
        packaging: {
          estimatedSize: estimatePackageSize(homePack.HomePackItem),
          physicalItems: homePack.HomePackItem.filter((item: any) => item.itemType === 'PHYSICAL').length,
          digitalItems: homePack.HomePackItem.filter((item: any) => item.itemType === 'DOCUMENT').length,
          totalDocuments: homePack.HomePackItem.reduce((sum: number, item: any) => 
            sum + item.HomePackItemDocument.length, 0)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching home pack:', error);
    return NextResponse.json(
      { error: 'Failed to fetch home pack' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * PATCH /api/home-packs/[id] - Update home pack
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: homePackId } = params;
    const body = await request.json();
    const validatedData = updateHomePackSchema.parse(body);

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

    // Get existing home pack
    const existingHomePack = await prisma.homePack.findUnique({
      where: { id: homePackId },
      select: { 
        userId: true, 
        status: true, 
        title: true,
        HomePackItem: {
          select: { id: true, status: true, required: true }
        }
      }
    });

    if (!existingHomePack) {
      return NextResponse.json(
        { error: 'Home pack not found' },
        { status: 404 }
      );
    }

    // Check permissions
    if (existingHomePack.userId !== currentUser.id && !isAuthorizedToUpdate(currentUser)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to update this home pack' },
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
          case 'targetDeliveryDate':
          case 'deliveryDate':
            updateData[key] = value ? new Date(value) : null;
            break;
          case 'status':
            updateData[key] = value;
            if (value === 'DELIVERED' && !existingHomePack.deliveryDate) {
              updateData.deliveryDate = new Date();
              updateData.deliveredBy = currentUser.id;
            }
            break;
          default:
            updateData[key] = value;
        }
      }
    });

    // Update home pack
    const updatedHomePack = await prisma.homePack.update({
      where: { id: homePackId },
      data: updateData,
      include: {
        HomePackItem: {
          select: {
            id: true,
            status: true,
            required: true,
            category: true
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
    if (validatedData.status && validatedData.status !== existingHomePack.status) {
      await createStatusChangeActivity(homePackId, existingHomePack.status, validatedData.status, currentUser.id);
      
      // Create buyer event for significant status changes
      await prisma.buyerEvent.create({
        data: {
          id: generateId(),
          buyerId: existingHomePack.userId,
          eventType: 'HOME_PACK_STATUS_CHANGED',
          eventDate: new Date(),
          eventData: {
            homePackId,
            previousStatus: existingHomePack.status,
            newStatus: validatedData.status,
            title: existingHomePack.title
          },
          description: `Home pack status changed to ${validatedData.status}`
        }
      });

      // Auto-complete items if pack is delivered
      if (validatedData.status === 'DELIVERED') {
        await autoCompleteRequiredItems(homePackId, currentUser.id);
      }
    }

    // Recalculate analytics after update
    const analytics = calculateDetailedAnalytics(updatedHomePack);
    const readinessScore = calculateReadinessScore(updatedHomePack);

    return NextResponse.json({
      success: true,
      data: {
        homePack: {
          ...updatedHomePack,
          timeAgo: calculateTimeAgo(updatedHomePack.created),
          statusDisplay: getHomePackStatusDisplay(updatedHomePack.status),
          packTypeDisplay: getPackTypeDisplay(updatedHomePack.packType)
        },
        analytics,
        readinessScore,
        message: 'Home pack updated successfully'
      }
    });

  } catch (error) {
    console.error('Error updating home pack:', error);
    
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
      { error: 'Failed to update home pack' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * POST /api/home-packs/[id] - Generate delivery package
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: homePackId } = params;
    const body = await request.json();
    const { action, ...actionData } = body;

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
      include: {
        HomePackItem: {
          include: {
            HomePackItemDocument: true
          }
        }
      }
    });

    if (!homePack) {
      return NextResponse.json(
        { error: 'Home pack not found' },
        { status: 404 }
      );
    }

    // Check permissions
    if (homePack.userId !== currentUser.id && !isAuthorizedToUpdate(currentUser)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    switch (action) {
      case 'generate_package':
        return await handleGeneratePackage(homePackId, actionData, currentUser);
      
      case 'mark_delivered':
        return await handleMarkDelivered(homePackId, actionData, currentUser);
      
      case 'validate_completion':
        return await handleValidateCompletion(homePackId, currentUser);
      
      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error processing home pack action:', error);
    
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
      { error: 'Failed to process action' },
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

function isAuthorizedToUpdate(user: any): boolean {
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

function calculateDetailedAnalytics(homePack: any) {
  const items = homePack.HomePackItem || [];
  const totalItems = items.length;
  
  if (totalItems === 0) {
    return {
      completion: { percentage: 100, completedItems: 0, totalItems: 0 },
      categories: {},
      timeline: { averageDaysToComplete: 0 },
      documents: { totalDocuments: 0, totalSize: 0 },
      readiness: { score: 0, blockers: [] }
    };
  }

  // Completion analytics
  const completedItems = items.filter((item: any) => item.status === 'COMPLETED').length;
  const completionPercentage = Math.round((completedItems / totalItems) * 100);

  // Category breakdown
  const categories = items.reduce((acc: any, item: any) => {
    const category = item.category || 'OTHER';
    if (!acc[category]) {
      acc[category] = { total: 0, completed: 0, required: 0 };
    }
    acc[category].total++;
    if (item.status === 'COMPLETED') acc[category].completed++;
    if (item.required) acc[category].required++;
    return acc;
  }, {});

  // Timeline analytics
  const completedItemsWithDates = items.filter((item: any) => 
    item.status === 'COMPLETED' && item.completedDate && item.created
  );

  let averageDaysToComplete = 0;
  if (completedItemsWithDates.length > 0) {
    const totalDays = completedItemsWithDates.reduce((sum: number, item: any) => {
      return sum + Math.ceil((new Date(item.completedDate).getTime() - new Date(item.created).getTime()) / (1000 * 60 * 60 * 24));
    }, 0);
    averageDaysToComplete = Math.round(totalDays / completedItemsWithDates.length);
  }

  // Document analytics
  const totalDocuments = items.reduce((sum: number, item: any) => sum + item.HomePackItemDocument.length, 0);
  const totalSize = items.reduce((sum: number, item: any) => 
    sum + item.HomePackItemDocument.reduce((itemSum: number, doc: any) => itemSum + (doc.fileSize || 0), 0), 0
  );

  // Readiness analytics
  const requiredItems = items.filter((item: any) => item.required);
  const completedRequiredItems = requiredItems.filter((item: any) => item.status === 'COMPLETED');
  const readinessScore = requiredItems.length > 0 ? 
    Math.round((completedRequiredItems.length / requiredItems.length) * 100) : 100;

  const blockers = items.filter((item: any) => 
    item.required && item.status !== 'COMPLETED'
  ).map((item: any) => item.title);

  return {
    completion: {
      percentage: completionPercentage,
      completedItems,
      totalItems,
      requiredItems: requiredItems.length,
      completedRequiredItems: completedRequiredItems.length
    },
    categories,
    timeline: {
      averageDaysToComplete,
      completedItemsCount: completedItemsWithDates.length
    },
    documents: {
      totalDocuments,
      totalSize,
      averageDocsPerItem: totalItems > 0 ? Math.round(totalDocuments / totalItems) : 0
    },
    readiness: {
      score: readinessScore,
      blockers,
      blockerCount: blockers.length
    }
  };
}

async function generateDeliveryTimeline(homePackId: string) {
  // Get home pack items with completion dates
  const items = await prisma.homePackItem.findMany({
    where: { homePackId },
    select: {
      id: true,
      title: true,
      status: true,
      required: true,
      created: true,
      completedDate: true,
      CompletedBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      }
    },
    orderBy: { completedDate: 'desc' }
  });

  return items
    .filter(item => item.completedDate)
    .map(item => ({
      id: item.id,
      date: item.completedDate,
      title: item.title,
      type: 'item_completed',
      required: item.required,
      completedBy: item.CompletedBy,
      timeAgo: calculateTimeAgo(item.completedDate!)
    }));
}

function calculateReadinessScore(homePack: any): any {
  const items = homePack.HomePackItem || [];
  const requiredItems = items.filter((item: any) => item.required);
  const completedRequiredItems = requiredItems.filter((item: any) => item.status === 'COMPLETED');

  const score = requiredItems.length > 0 ? 
    Math.round((completedRequiredItems.length / requiredItems.length) * 100) : 100;

  let level = 'not_ready';
  let color = 'red';
  let message = 'Not ready for delivery';

  if (score === 100) {
    level = 'ready';
    color = 'green';
    message = 'Ready for delivery';
  } else if (score >= 80) {
    level = 'mostly_ready';
    color = 'yellow';
    message = 'Mostly ready - few items remaining';
  } else if (score >= 50) {
    level = 'in_progress';
    color = 'blue';
    message = 'In progress - significant work remaining';
  }

  return {
    score,
    level,
    color,
    message,
    requiredItems: requiredItems.length,
    completedRequiredItems: completedRequiredItems.length,
    missingRequiredItems: requiredItems.filter((item: any) => item.status !== 'COMPLETED').map((item: any) => item.title)
  };
}

function generateRecommendations(homePack: any, analytics: any): string[] {
  const recommendations = [];

  // Readiness recommendations
  if (analytics.readiness.score < 100) {
    recommendations.push(`Complete ${analytics.readiness.blockerCount} required items before delivery`);
  }

  // Timeline recommendations
  if (homePack.targetDeliveryDate) {
    const daysToDelivery = Math.ceil((new Date(homePack.targetDeliveryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    if (daysToDelivery < 0) {
      recommendations.push('Delivery date has passed - update schedule or mark as delivered');
    } else if (daysToDelivery <= 3 && analytics.readiness.score < 100) {
      recommendations.push('Delivery date approaching - prioritize remaining required items');
    }
  }

  // Status recommendations
  if (homePack.status === 'DRAFT' && analytics.completion.percentage > 50) {
    recommendations.push('Consider changing status to IN_PREPARATION');
  } else if (homePack.status === 'IN_PREPARATION' && analytics.readiness.score === 100) {
    recommendations.push('All required items complete - mark as READY');
  }

  // Document recommendations
  if (analytics.documents.totalDocuments === 0) {
    recommendations.push('Add supporting documents to items');
  }

  return recommendations;
}

function generateDeliveryChecklist(homePack: any): any[] {
  const checklist = [];

  // Required items check
  const requiredItems = homePack.HomePackItem.filter((item: any) => item.required);
  const completedRequired = requiredItems.filter((item: any) => item.status === 'COMPLETED');
  
  checklist.push({
    item: 'All required items completed',
    completed: completedRequired.length === requiredItems.length,
    details: `${completedRequired.length}/${requiredItems.length} required items completed`
  });

  // Physical items check
  const physicalItems = homePack.HomePackItem.filter((item: any) => item.itemType === 'PHYSICAL');
  const completedPhysical = physicalItems.filter((item: any) => item.status === 'COMPLETED');
  
  checklist.push({
    item: 'Physical items prepared',
    completed: physicalItems.length === 0 || completedPhysical.length === physicalItems.length,
    details: `${completedPhysical.length}/${physicalItems.length} physical items ready`
  });

  // Document items check
  const documentItems = homePack.HomePackItem.filter((item: any) => item.itemType === 'DOCUMENT');
  const completedDocuments = documentItems.filter((item: any) => item.status === 'COMPLETED');
  
  checklist.push({
    item: 'Documents collected',
    completed: documentItems.length === 0 || completedDocuments.length === documentItems.length,
    details: `${completedDocuments.length}/${documentItems.length} documents ready`
  });

  // Delivery date check
  checklist.push({
    item: 'Delivery date confirmed',
    completed: !!homePack.targetDeliveryDate,
    details: homePack.targetDeliveryDate ? 
      `Scheduled for ${new Date(homePack.targetDeliveryDate).toLocaleDateString()}` : 
      'No delivery date set'
  });

  return checklist;
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

function getHomePackItemStatusDisplay(status: string): any {
  const statusMap: any = {
    'PENDING': { label: 'Pending', color: 'gray', description: 'Not started' },
    'IN_PROGRESS': { label: 'In Progress', color: 'blue', description: 'Being prepared' },
    'COMPLETED': { label: 'Completed', color: 'green', description: 'Ready for delivery' },
    'NOT_REQUIRED': { label: 'Not Required', color: 'gray', description: 'Not needed for this pack' }
  };

  return statusMap[status] || { label: status, color: 'gray', description: 'Unknown status' };
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

function estimateItemValue(item: any): string {
  // Estimate the relative value/importance of each item
  if (item.required) {
    if (item.category === 'LEGAL' || item.category === 'CERTIFICATE') {
      return 'Critical';
    }
    return 'High';
  }
  
  if (item.category === 'WARRANTY' || item.category === 'MANUAL') {
    return 'Medium';
  }
  
  return 'Low';
}

function findItemDependencies(item: any, allItems: any[]): string[] {
  // Find items that this item depends on
  const dependencies = [];
  
  if (item.category === 'LEGAL' && item.title.includes('Title')) {
    // Title documents depend on completion certificates
    const completionCert = allItems.find(i => 
      i.category === 'CERTIFICATE' && i.title.includes('Building Control')
    );
    if (completionCert) dependencies.push(completionCert.title);
  }
  
  return dependencies;
}

function estimatePackageSize(items: any[]): string {
  const physicalItems = items.filter(item => item.itemType === 'PHYSICAL').length;
  const documentItems = items.filter(item => item.itemType === 'DOCUMENT').length;
  
  if (physicalItems > 5 || documentItems > 20) {
    return 'Large';
  } else if (physicalItems > 2 || documentItems > 10) {
    return 'Medium';
  }
  return 'Small';
}

async function createStatusChangeActivity(homePackId: string, oldStatus: string, newStatus: string, userId: string) {
  // This would create an activity log entry for the status change
  console.log(`Home pack ${homePackId} status changed from ${oldStatus} to ${newStatus} by user ${userId}`);
}

async function autoCompleteRequiredItems(homePackId: string, userId: string) {
  // Auto-complete all required items when home pack is delivered
  await prisma.homePackItem.updateMany({
    where: {
      homePackId,
      required: true,
      status: { not: 'COMPLETED' }
    },
    data: {
      status: 'COMPLETED',
      completedDate: new Date(),
      completedBy: userId,
      notes: 'Auto-completed when home pack was marked as delivered'
    }
  });
}

async function handleGeneratePackage(homePackId: string, data: any, currentUser: any) {
  const validatedData = generatePackageSchema.parse(data);
  
  // Generate package based on specifications
  const packageInfo = {
    id: generateId(),
    homePackId,
    deliveryMethod: validatedData.deliveryMethod,
    packageFormat: validatedData.packageFormat,
    includePhysicalItems: validatedData.includePhysicalItems,
    includeDigitalItems: validatedData.includeDigitalItems,
    generatedBy: currentUser.id,
    generatedAt: new Date(),
    customInstructions: validatedData.customInstructions
  };

  // In a real implementation, this would generate the actual package file
  
  return NextResponse.json({
    success: true,
    data: {
      package: packageInfo,
      downloadUrl: `/api/home-packs/${homePackId}/download`,
      message: 'Package generated successfully'
    }
  });
}

async function handleMarkDelivered(homePackId: string, data: any, currentUser: any) {
  const { deliveryDate, deliveryMethod, deliveryNotes } = data;

  await prisma.homePack.update({
    where: { id: homePackId },
    data: {
      status: 'DELIVERED',
      deliveryDate: deliveryDate ? new Date(deliveryDate) : new Date(),
      deliveryMethod,
      deliveryNotes,
      deliveredBy: currentUser.id,
      lastUpdated: new Date()
    }
  });

  return NextResponse.json({
    success: true,
    data: {
      message: 'Home pack marked as delivered'
    }
  });
}

async function handleValidateCompletion(homePackId: string, currentUser: any) {
  const homePack = await prisma.homePack.findUnique({
    where: { id: homePackId },
    include: {
      HomePackItem: {
        select: { id: true, status: true, required: true, title: true }
      }
    }
  });

  if (!homePack) {
    return NextResponse.json(
      { error: 'Home pack not found' },
      { status: 404 }
    );
  }

  const requiredItems = homePack.HomePackItem.filter(item => item.required);
  const completedRequiredItems = requiredItems.filter(item => item.status === 'COMPLETED');
  const missingItems = requiredItems.filter(item => item.status !== 'COMPLETED');

  const isComplete = missingItems.length === 0;

  return NextResponse.json({
    success: true,
    data: {
      isComplete,
      completionScore: requiredItems.length > 0 ? 
        Math.round((completedRequiredItems.length / requiredItems.length) * 100) : 100,
      requiredItems: requiredItems.length,
      completedItems: completedRequiredItems.length,
      missingItems: missingItems.map(item => ({ id: item.id, title: item.title })),
      canDeliver: isComplete,
      message: isComplete ? 
        'Home pack is complete and ready for delivery' : 
        `${missingItems.length} required items remaining`
    }
  });
}