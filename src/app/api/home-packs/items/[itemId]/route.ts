import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { userService } from '@/lib/services/users-production';
import { z } from 'zod';

const prisma = new PrismaClient();

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

const addDocumentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  fileName: z.string().min(1, 'File name is required'),
  fileSize: z.number().min(1, 'File size is required'),
  mimeType: z.string().min(1, 'MIME type is required'),
  documentData: z.string().min(1, 'Document data is required'), // Base64 encoded
  documentType: z.enum(['CERTIFICATE', 'MANUAL', 'WARRANTY', 'INSTRUCTION', 'RECEIPT', 'OTHER']).optional().default('OTHER'),
  metadata: z.record(z.any()).optional()
});

/**
 * GET /api/home-packs/items/[itemId] - Get specific home pack item with full details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const { itemId } = params;

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
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

    // Get home pack item with comprehensive details
    const homePackItem = await prisma.homePackItem.findUnique({
      where: { id: itemId },
      include: {
        HomePack: {
          select: {
            id: true,
            userId: true,
            title: true,
            status: true,
            packType: true,
            Property: {
              select: {
                id: true,
                title: true,
                address: true,
                unitNumber: true
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
        AssignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            roles: true
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
    });

    if (!homePackItem) {
      return NextResponse.json(
        { error: 'Home pack item not found' },
        { status: 404 }
      );
    }

    // Check permissions
    if (homePackItem.HomePack.userId !== currentUser.id && !isAuthorizedToView(currentUser)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Calculate item analytics and insights
    const analytics = calculateItemAnalytics(homePackItem);
    
    // Get similar items for comparison
    const similarItems = await getSimilarItems(itemId, homePackItem.category, homePackItem.itemType);

    // Generate recommendations
    const recommendations = generateItemRecommendations(homePackItem, analytics);

    // Get completion timeline
    const timeline = generateCompletionTimeline(homePackItem);

    // Format response data
    const formattedItem = {
      ...homePackItem,
      timeAgo: calculateTimeAgo(homePackItem.created),
      statusDisplay: getHomePackItemStatusDisplay(homePackItem.status),
      categoryDisplay: getCategoryDisplay(homePackItem.category),
      itemTypeDisplay: getItemTypeDisplay(homePackItem.itemType),
      estimatedValueDisplay: getEstimatedValueDisplay(homePackItem.estimatedValue),
      isOverdue: homePackItem.targetDate && new Date(homePackItem.targetDate) < new Date() && homePackItem.status !== 'COMPLETED',
      daysOverdue: homePackItem.targetDate && new Date(homePackItem.targetDate) < new Date() && homePackItem.status !== 'COMPLETED' ? 
        Math.ceil((Date.now() - new Date(homePackItem.targetDate).getTime()) / (1000 * 60 * 60 * 24)) : 0,
      daysToTarget: homePackItem.targetDate && homePackItem.status !== 'COMPLETED' ? 
        Math.ceil((new Date(homePackItem.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null,
      completionDays: homePackItem.completedDate && homePackItem.created ? 
        Math.ceil((new Date(homePackItem.completedDate).getTime() - new Date(homePackItem.created).getTime()) / (1000 * 60 * 60 * 24)) : null,
      hasDocuments: homePackItem.HomePackItemDocument.length > 0,
      documentCount: homePackItem.HomePackItemDocument.length,
      canEdit: canEditItem(homePackItem, currentUser),
      canComplete: canCompleteItem(homePackItem, currentUser),
      canAssign: canAssignItem(homePackItem, currentUser),
      dependencies: findItemDependencies(homePackItem),
      HomePackItemDocument: homePackItem.HomePackItemDocument.map((doc: any) => ({
        ...doc,
        timeAgo: calculateTimeAgo(doc.uploadDate),
        fileSizeFormatted: formatFileSize(doc.fileSize),
        downloadUrl: generateDocumentDownloadUrl(doc.id)
      }))
    };

    return NextResponse.json({
      success: true,
      data: {
        item: formattedItem,
        analytics,
        similarItems,
        recommendations,
        timeline,
        documents: {
          total: homePackItem.HomePackItemDocument.length,
          byType: groupDocumentsByType(homePackItem.HomePackItemDocument),
          totalSize: homePackItem.HomePackItemDocument.reduce((sum: number, doc: any) => sum + (doc.fileSize || 0), 0),
          latest: homePackItem.HomePackItemDocument[0] || null
        }
      }
    });

  } catch (error) {
    console.error('Error fetching home pack item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch home pack item' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * PATCH /api/home-packs/items/[itemId] - Update home pack item
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const { itemId } = params;
    const body = await request.json();
    const validatedData = updateHomePackItemSchema.parse(body);

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
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

    // Get existing home pack item
    const existingItem = await prisma.homePackItem.findUnique({
      where: { id: itemId },
      include: {
        HomePack: {
          select: { userId: true, status: true, title: true, id: true }
        }
      }
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Home pack item not found' },
        { status: 404 }
      );
    }

    // Check permissions
    if (!canEditItem(existingItem, currentUser)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to update this item' },
        { status: 403 }
      );
    }

    // Prepare update data
    const updateData: any = {
      lastUpdated: new Date()
    };

    // Track what changed for notifications
    const changes: any = {};

    // Map validated fields to update data
    Object.keys(validatedData).forEach(key => {
      const value = validatedData[key as keyof typeof validatedData];
      if (value !== undefined && value !== existingItem[key as keyof typeof existingItem]) {
        changes[key] = { from: existingItem[key as keyof typeof existingItem], to: value };
        
        switch (key) {
          case 'targetDate':
            updateData[key] = value ? new Date(value) : null;
            break;
          case 'status':
            updateData[key] = value;
            if (value === 'COMPLETED') {
              updateData.completedDate = new Date();
              updateData.completedBy = currentUser.id;
            }
            break;
          default:
            updateData[key] = value;
        }
      }
    });

    // If no changes, return early
    if (Object.keys(changes).length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          message: 'No changes detected'
        }
      });
    }

    // Update home pack item
    const updatedItem = await prisma.homePackItem.update({
      where: { id: itemId },
      data: updateData,
      include: {
        HomePack: {
          select: {
            id: true,
            userId: true,
            title: true,
            status: true
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
        }
      }
    });

    // Create buyer event for significant changes
    if (changes.status) {
      await prisma.buyerEvent.create({
        data: {
          id: generateId(),
          buyerId: existingItem.HomePack.userId,
          eventType: 'HOME_PACK_ITEM_STATUS_CHANGED',
          eventDate: new Date(),
          eventData: {
            homePackId: existingItem.HomePack.id,
            itemId,
            previousStatus: changes.status.from,
            newStatus: changes.status.to,
            title: existingItem.title
          },
          description: `Home pack item status changed to ${changes.status.to}: ${existingItem.title}`
        }
      });
    }

    // Handle status change notifications
    if (changes.status) {
      await handleStatusChangeNotifications(updatedItem, changes.status, currentUser);
    }

    // Handle assignment change notifications
    if (changes.assignedTo) {
      await handleAssignmentChangeNotifications(updatedItem, changes.assignedTo, currentUser);
    }

    return NextResponse.json({
      success: true,
      data: {
        item: {
          ...updatedItem,
          timeAgo: calculateTimeAgo(updatedItem.created),
          statusDisplay: getHomePackItemStatusDisplay(updatedItem.status),
          categoryDisplay: getCategoryDisplay(updatedItem.category),
          itemTypeDisplay: getItemTypeDisplay(updatedItem.itemType)
        },
        changes,
        message: 'Home pack item updated successfully'
      }
    });

  } catch (error) {
    console.error('Error updating home pack item:', error);
    
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
      { error: 'Failed to update home pack item' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * POST /api/home-packs/items/[itemId] - Add document to home pack item
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const { itemId } = params;
    const body = await request.json();
    const { action, ...actionData } = body;

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
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

    // Verify item exists and user has access
    const homePackItem = await prisma.homePackItem.findUnique({
      where: { id: itemId },
      include: {
        HomePack: {
          select: { userId: true, status: true }
        }
      }
    });

    if (!homePackItem) {
      return NextResponse.json(
        { error: 'Home pack item not found' },
        { status: 404 }
      );
    }

    // Check permissions
    if (!canEditItem(homePackItem, currentUser)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    switch (action) {
      case 'add_document':
        return await handleAddDocument(itemId, actionData, currentUser);
      
      case 'mark_completed':
        return await handleMarkCompleted(itemId, actionData, currentUser);
      
      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error processing home pack item action:', error);
    
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

function calculateItemAnalytics(item: any) {
  const documents = item.HomePackItemDocument || [];
  
  // Calculate lifecycle metrics
  const totalDays = Math.ceil((Date.now() - new Date(item.created).getTime()) / (1000 * 60 * 60 * 24));
  const isStalled = totalDays > 14 && item.status === 'PENDING';
  const isAtRisk = item.targetDate && new Date(item.targetDate) < new Date() && item.status !== 'COMPLETED';

  // Progress tracking
  let progressPercentage = 0;
  switch (item.status) {
    case 'PENDING': progressPercentage = 0; break;
    case 'IN_PROGRESS': progressPercentage = 50; break;
    case 'COMPLETED': progressPercentage = 100; break;
    case 'NOT_REQUIRED': progressPercentage = 100; break;
  }

  // Document analysis
  const documentTypes = documents.reduce((acc: any, doc: any) => {
    acc[doc.documentType] = (acc[doc.documentType] || 0) + 1;
    return acc;
  }, {});

  return {
    lifecycle: {
      totalDays,
      isStalled,
      isAtRisk,
      progressPercentage
    },
    documents: {
      totalCount: documents.length,
      totalSize: documents.reduce((sum: number, doc: any) => sum + (doc.fileSize || 0), 0),
      byType: documentTypes,
      hasAllRequired: checkRequiredDocuments(item, documents)
    },
    completion: {
      estimatedDaysRemaining: estimateCompletionDays(item),
      completionProbability: calculateCompletionProbability(item),
      blockers: identifyBlockers(item)
    }
  };
}

async function getSimilarItems(itemId: string, category: string, itemType: string) {
  const similarItems = await prisma.homePackItem.findMany({
    where: {
      id: { not: itemId },
      category,
      itemType,
      status: 'COMPLETED'
    },
    select: {
      id: true,
      title: true,
      status: true,
      created: true,
      completedDate: true,
      estimatedValue: true
    },
    orderBy: { completedDate: 'desc' },
    take: 5
  });

  return similarItems.map(item => ({
    ...item,
    completionDays: item.completedDate && item.created ? 
      Math.ceil((new Date(item.completedDate).getTime() - new Date(item.created).getTime()) / (1000 * 60 * 60 * 24)) : null
  }));
}

function generateItemRecommendations(item: any, analytics: any): string[] {
  const recommendations = [];

  // Status-based recommendations
  if (analytics.lifecycle.isStalled) {
    recommendations.push('Item has been pending for over 14 days - consider assigning or escalating');
  }

  if (analytics.lifecycle.isAtRisk) {
    recommendations.push('Item is overdue - prioritize completion or adjust target date');
  }

  // Document recommendations
  if (item.itemType === 'DOCUMENT' && analytics.documents.totalCount === 0) {
    recommendations.push('Add supporting documents to complete this item');
  }

  // Assignment recommendations
  if (!item.assignedTo && item.status === 'PENDING') {
    recommendations.push('Assign this item to someone to begin work');
  }

  // Completion recommendations
  if (item.status === 'IN_PROGRESS' && analytics.lifecycle.totalDays > 7) {
    recommendations.push('Request progress update - item has been in progress for over a week');
  }

  return recommendations;
}

function generateCompletionTimeline(item: any) {
  const timeline = [];

  // Creation event
  timeline.push({
    date: item.created,
    type: 'created',
    description: `Item created: ${item.title}`,
    user: item.CreatedBy
  });

  // Assignment event
  if (item.assignedTo) {
    timeline.push({
      date: item.created, // Assuming assignment at creation for now
      type: 'assigned',
      description: `Assigned to ${item.AssignedTo?.firstName} ${item.AssignedTo?.lastName}`,
      user: item.CreatedBy
    });
  }

  // Document uploads
  item.HomePackItemDocument?.forEach((doc: any) => {
    timeline.push({
      date: doc.uploadDate,
      type: 'document_added',
      description: `Document uploaded: ${doc.title}`,
      user: doc.UploadedBy
    });
  });

  // Completion event
  if (item.completedDate) {
    timeline.push({
      date: item.completedDate,
      type: 'completed',
      description: 'Item marked as completed',
      user: item.CompletedBy
    });
  }

  return timeline.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
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

function canEditItem(item: any, user: any): boolean {
  // Pack owner can always edit
  if (item.HomePack.userId === user.id) return true;
  
  // Assigned person can edit
  if (item.assignedTo === user.id) return true;
  
  // Authorized roles can edit
  return user?.roles?.includes('ADMIN') || 
         user?.roles?.includes('SUPER_ADMIN') ||
         user?.roles?.includes('SITE_MANAGER');
}

function canCompleteItem(item: any, user: any): boolean {
  // Can't complete already completed items
  if (item.status === 'COMPLETED') return false;
  
  // Assigned person can complete
  if (item.assignedTo === user.id) return true;
  
  // Authorized roles can complete
  return canEditItem(item, user);
}

function canAssignItem(item: any, user: any): boolean {
  // Owner and authorized roles can assign
  if (item.HomePack.userId === user.id) return true;
  
  return user?.roles?.includes('ADMIN') || 
         user?.roles?.includes('SUPER_ADMIN') ||
         user?.roles?.includes('SITE_MANAGER');
}

function findItemDependencies(item: any): string[] {
  const dependencies = [];
  
  if (item.category === 'LEGAL' && item.title.includes('Title')) {
    dependencies.push('Building Control Certificate must be completed first');
  }
  
  if (item.category === 'WARRANTY' && item.title.includes('Appliance')) {
    dependencies.push('Appliance delivery must be completed first');
  }
  
  return dependencies;
}

function groupDocumentsByType(documents: any[]) {
  return documents.reduce((acc: any, doc) => {
    const type = doc.documentType || 'OTHER';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function generateDocumentDownloadUrl(documentId: string): string {
  // In a real implementation, this would generate a secure download URL
  return `/api/home-packs/documents/${documentId}/download`;
}

function checkRequiredDocuments(item: any, documents: any[]): boolean {
  // Define required document types by category
  const requiredDocs: any = {
    'LEGAL': ['CERTIFICATE'],
    'WARRANTY': ['WARRANTY'],
    'CERTIFICATE': ['CERTIFICATE']
  };

  const required = requiredDocs[item.category] || [];
  const available = documents.map(doc => doc.documentType);
  
  return required.every((req: string) => available.includes(req));
}

function estimateCompletionDays(item: any): number {
  const baseEstimates: any = {
    'PHYSICAL': 1,
    'DOCUMENT': 3,
    'DIGITAL': 1,
    'INFORMATION': 1
  };

  let baseDays = baseEstimates[item.itemType] || 2;
  
  // Adjust for complexity
  if (item.category === 'LEGAL') baseDays *= 2;
  if (item.estimatedValue === 'CRITICAL') baseDays *= 0.5;
  if (item.estimatedValue === 'LOW') baseDays *= 1.5;
  
  return Math.ceil(baseDays);
}

function calculateCompletionProbability(item: any): number {
  let probability = 80; // Base probability
  
  // Adjust based on status
  if (item.status === 'IN_PROGRESS') probability = 90;
  if (item.status === 'COMPLETED') probability = 100;
  if (item.status === 'NOT_REQUIRED') probability = 100;
  
  // Adjust for overdue
  if (item.targetDate && new Date(item.targetDate) < new Date()) {
    probability -= 20;
  }
  
  // Adjust for assignment
  if (!item.assignedTo) probability -= 10;
  
  return Math.max(0, Math.min(100, probability));
}

function identifyBlockers(item: any): string[] {
  const blockers = [];
  
  if (!item.assignedTo) {
    blockers.push('No one assigned to this item');
  }
  
  if (item.itemType === 'DOCUMENT' && item.HomePackItemDocument.length === 0) {
    blockers.push('Missing required documents');
  }
  
  if (item.targetDate && new Date(item.targetDate) < new Date()) {
    blockers.push('Past due date');
  }
  
  return blockers;
}

async function handleAddDocument(itemId: string, data: any, currentUser: any) {
  const validatedData = addDocumentSchema.parse(data);

  // Validate file size (25MB limit)
  if (validatedData.fileSize > 25 * 1024 * 1024) {
    return NextResponse.json(
      { error: 'File size must be less than 25MB' },
      { status: 400 }
    );
  }

  // Create document record
  const document = await prisma.homePackItemDocument.create({
    data: {
      id: generateId(),
      itemId,
      title: validatedData.title,
      description: validatedData.description,
      fileName: validatedData.fileName,
      fileSize: validatedData.fileSize,
      mimeType: validatedData.mimeType,
      documentData: validatedData.documentData,
      documentType: validatedData.documentType,
      metadata: validatedData.metadata || {},
      uploadedBy: currentUser.id
    },
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
  });

  return NextResponse.json({
    success: true,
    data: {
      document: {
        ...document,
        timeAgo: calculateTimeAgo(document.uploadDate),
        fileSizeFormatted: formatFileSize(document.fileSize)
      },
      message: 'Document added successfully'
    }
  }, { status: 201 });
}

async function handleMarkCompleted(itemId: string, data: any, currentUser: any) {
  const { completionNotes } = data;

  await prisma.homePackItem.update({
    where: { id: itemId },
    data: {
      status: 'COMPLETED',
      completedDate: new Date(),
      completedBy: currentUser.id,
      completionNotes,
      lastUpdated: new Date()
    }
  });

  return NextResponse.json({
    success: true,
    data: {
      message: 'Item marked as completed'
    }
  });
}

async function handleStatusChangeNotifications(item: any, statusChange: any, currentUser: any) {
  // Send notifications for status changes
  if (statusChange.to === 'COMPLETED') {
    console.log(`Home pack item ${item.id} completed by ${currentUser.id}`);
  }
}

async function handleAssignmentChangeNotifications(item: any, assignmentChange: any, currentUser: any) {
  // Send notifications for assignment changes
  if (assignmentChange.to) {
    console.log(`Home pack item ${item.id} assigned to ${assignmentChange.to} by ${currentUser.id}`);
  }
}