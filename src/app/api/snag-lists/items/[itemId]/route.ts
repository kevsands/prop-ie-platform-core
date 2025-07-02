import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { userService } from '@/lib/services/users-production';
import { z } from 'zod';

const prisma = new PrismaClient();

const updateSnagItemSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'PENDING_REVIEW', 'COMPLETED', 'ON_HOLD', 'REJECTED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  category: z.enum(['STRUCTURAL', 'ELECTRICAL', 'PLUMBING', 'FINISHES', 'FLOORING', 'WINDOWS_DOORS', 'BATHROOM', 'KITCHEN', 'APPLIANCES', 'SAFETY', 'EXTERIOR', 'GENERAL', 'OTHER']).optional(),
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

const addPhotoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  fileName: z.string().min(1, 'File name is required'),
  fileSize: z.number().min(1, 'File size is required'),
  mimeType: z.string().min(1, 'MIME type is required'),
  photoData: z.string().min(1, 'Photo data is required'), // Base64 encoded
  photoType: z.enum(['BEFORE', 'DURING', 'AFTER', 'REFERENCE']).optional().default('REFERENCE'),
  metadata: z.record(z.any()).optional()
});

const addUpdateSchema = z.object({
  updateType: z.enum(['STATUS_CHANGE', 'PROGRESS_UPDATE', 'NOTE_ADDED', 'PHOTO_ADDED', 'ASSIGNMENT_CHANGE', 'COMPLETION', 'OTHER']),
  updateText: z.string().min(1, 'Update text is required'),
  privateNote: z.boolean().optional().default(false),
  metadata: z.record(z.any()).optional()
});

/**
 * GET /api/snag-lists/items/[itemId] - Get specific snag item with full details
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

    // Get snag item with comprehensive details
    const snagItem = await prisma.snagItem.findUnique({
      where: { id: itemId },
      include: {
        SnagList: {
          select: {
            id: true,
            userId: true,
            title: true,
            status: true,
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
        SnagItemUpdate: {
          orderBy: { created: 'desc' },
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

    if (!snagItem) {
      return NextResponse.json(
        { error: 'Snag item not found' },
        { status: 404 }
      );
    }

    // Check permissions
    if (snagItem.SnagList.userId !== currentUser.id && !isAuthorizedToView(currentUser)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Calculate item analytics
    const analytics = calculateItemAnalytics(snagItem);
    
    // Get similar items for comparison
    const similarItems = await getSimilarItems(itemId, snagItem.category, snagItem.priority);

    // Generate recommendations
    const recommendations = generateItemRecommendations(snagItem, analytics);

    // Format response data
    const formattedItem = {
      ...snagItem,
      timeAgo: calculateTimeAgo(snagItem.created),
      statusDisplay: getSnagItemStatusDisplay(snagItem.status),
      priorityDisplay: getPriorityDisplay(snagItem.priority),
      categoryDisplay: getCategoryDisplay(snagItem.category),
      isOverdue: snagItem.targetDate && new Date(snagItem.targetDate) < new Date() && snagItem.status !== 'COMPLETED',
      daysOverdue: snagItem.targetDate && new Date(snagItem.targetDate) < new Date() && snagItem.status !== 'COMPLETED' ? 
        Math.ceil((Date.now() - new Date(snagItem.targetDate).getTime()) / (1000 * 60 * 60 * 24)) : 0,
      daysToTarget: snagItem.targetDate && snagItem.status !== 'COMPLETED' ? 
        Math.ceil((new Date(snagItem.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null,
      resolutionDays: snagItem.completedDate && snagItem.created ? 
        Math.ceil((new Date(snagItem.completedDate).getTime() - new Date(snagItem.created).getTime()) / (1000 * 60 * 60 * 24)) : null,
      estimatedResolution: estimateItemResolution(snagItem),
      canEdit: canEditItem(snagItem, currentUser),
      canComplete: canCompleteItem(snagItem, currentUser),
      canAssign: canAssignItem(snagItem, currentUser),
      SnagItemUpdate: snagItem.SnagItemUpdate.map((update: any) => ({
        ...update,
        timeAgo: calculateTimeAgo(update.created)
      })),
      SnagItemPhoto: snagItem.SnagItemPhoto.map((photo: any) => ({
        ...photo,
        timeAgo: calculateTimeAgo(photo.uploadDate),
        thumbnailUrl: generateThumbnailUrl(photo.photoData),
        fullUrl: generateFullImageUrl(photo.photoData)
      }))
    };

    return NextResponse.json({
      success: true,
      data: {
        item: formattedItem,
        analytics,
        similarItems,
        recommendations,
        timeline: formatTimeline(snagItem.SnagItemUpdate),
        photos: {
          total: snagItem.SnagItemPhoto.length,
          byType: groupPhotosByType(snagItem.SnagItemPhoto),
          latest: snagItem.SnagItemPhoto[0] || null
        }
      }
    });

  } catch (error) {
    console.error('Error fetching snag item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch snag item' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * PATCH /api/snag-lists/items/[itemId] - Update snag item
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const { itemId } = params;
    const body = await request.json();
    const validatedData = updateSnagItemSchema.parse(body);

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

    // Get existing snag item
    const existingItem = await prisma.snagItem.findUnique({
      where: { id: itemId },
      include: {
        SnagList: {
          select: { userId: true, status: true }
        }
      }
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Snag item not found' },
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

    // Track what changed for update log
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

    // Update snag item
    const updatedItem = await prisma.$transaction(async (tx) => {
      const item = await tx.snagItem.update({
        where: { id: itemId },
        data: updateData,
        include: {
          SnagList: {
            select: {
              id: true,
              userId: true,
              title: true
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

      // Create update record
      await tx.snagItemUpdate.create({
        data: {
          id: generateId(),
          itemId,
          updateType: determineUpdateType(changes),
          updateText: generateUpdateText(changes, validatedData),
          updatedBy: currentUser.id,
          metadata: { changes }
        }
      });

      return item;
    });

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
          statusDisplay: getSnagItemStatusDisplay(updatedItem.status),
          priorityDisplay: getPriorityDisplay(updatedItem.priority),
          categoryDisplay: getCategoryDisplay(updatedItem.category)
        },
        changes,
        message: 'Snag item updated successfully'
      }
    });

  } catch (error) {
    console.error('Error updating snag item:', error);
    
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
      { error: 'Failed to update snag item' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * POST /api/snag-lists/items/[itemId] - Add photo or update to snag item
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
    const snagItem = await prisma.snagItem.findUnique({
      where: { id: itemId },
      include: {
        SnagList: {
          select: { userId: true, status: true }
        }
      }
    });

    if (!snagItem) {
      return NextResponse.json(
        { error: 'Snag item not found' },
        { status: 404 }
      );
    }

    // Check permissions
    if (!canEditItem(snagItem, currentUser)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    switch (action) {
      case 'add_photo':
        return await handleAddPhoto(itemId, actionData, currentUser);
      
      case 'add_update':
        return await handleAddUpdate(itemId, actionData, currentUser);
      
      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error processing snag item action:', error);
    
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

function calculateItemAnalytics(item: any) {
  const updates = item.SnagItemUpdate || [];
  const photos = item.SnagItemPhoto || [];

  // Calculate time in each status
  const statusHistory = updates
    .filter((update: any) => update.updateType === 'STATUS_CHANGE')
    .reverse();

  const timeInStatus: any = {};
  let currentStatus = 'OPEN';
  let lastStatusChange = new Date(item.created);

  statusHistory.forEach((update: any, index: number) => {
    const statusChangeDate = new Date(update.created);
    const daysInStatus = Math.ceil((statusChangeDate.getTime() - lastStatusChange.getTime()) / (1000 * 60 * 60 * 24));
    
    timeInStatus[currentStatus] = (timeInStatus[currentStatus] || 0) + daysInStatus;
    
    // Extract new status from metadata or update text
    currentStatus = update.metadata?.changes?.status?.to || extractStatusFromText(update.updateText);
    lastStatusChange = statusChangeDate;
  });

  // Add time in current status
  const daysInCurrentStatus = Math.ceil((Date.now() - lastStatusChange.getTime()) / (1000 * 60 * 60 * 24));
  timeInStatus[item.status] = (timeInStatus[item.status] || 0) + daysInCurrentStatus;

  // Activity metrics
  const recentUpdates = updates.filter((update: any) => {
    const updateDate = new Date(update.created);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return updateDate >= sevenDaysAgo;
  }).length;

  return {
    lifecycle: {
      totalDays: Math.ceil((Date.now() - new Date(item.created).getTime()) / (1000 * 60 * 60 * 24)),
      timeInStatus,
      statusChanges: statusHistory.length,
      currentStatusDays: daysInCurrentStatus
    },
    activity: {
      totalUpdates: updates.length,
      recentActivity: recentUpdates,
      totalPhotos: photos.length,
      photosByType: groupPhotosByType(photos),
      lastActivity: updates[0]?.created || item.created
    },
    progress: {
      isStalled: daysInCurrentStatus > 7 && item.status !== 'COMPLETED',
      isOverdue: item.targetDate && new Date(item.targetDate) < new Date() && item.status !== 'COMPLETED',
      progressRate: statusHistory.length > 0 ? statusHistory.length / timeInStatus.totalDays : 0
    }
  };
}

async function getSimilarItems(itemId: string, category: string, priority: string) {
  const similarItems = await prisma.snagItem.findMany({
    where: {
      id: { not: itemId },
      category,
      priority,
      status: 'COMPLETED'
    },
    select: {
      id: true,
      title: true,
      status: true,
      created: true,
      completedDate: true,
      estimatedCost: true,
      actualCost: true
    },
    orderBy: { completedDate: 'desc' },
    take: 5
  });

  return similarItems.map(item => ({
    ...item,
    resolutionDays: item.completedDate && item.created ? 
      Math.ceil((new Date(item.completedDate).getTime() - new Date(item.created).getTime()) / (1000 * 60 * 60 * 24)) : null
  }));
}

function generateItemRecommendations(item: any, analytics: any): string[] {
  const recommendations = [];

  // Stalled item recommendations
  if (analytics.progress.isStalled) {
    recommendations.push('Item has been in current status for over 7 days - consider escalation');
  }

  // Overdue recommendations
  if (analytics.progress.isOverdue) {
    recommendations.push('Item is overdue - prioritize completion or adjust target date');
  }

  // Status-specific recommendations
  switch (item.status) {
    case 'OPEN':
      if (analytics.lifecycle.currentStatusDays > 3) {
        recommendations.push('Consider assigning this item to begin work');
      }
      break;
    case 'IN_PROGRESS':
      if (analytics.lifecycle.currentStatusDays > 7) {
        recommendations.push('Request progress update from assigned person');
      }
      break;
    case 'PENDING_REVIEW':
      if (analytics.lifecycle.currentStatusDays > 2) {
        recommendations.push('Review pending item to avoid delays');
      }
      break;
  }

  // Photo recommendations
  if (item.SnagItemPhoto.length === 0) {
    recommendations.push('Add photos to document the issue');
  }

  // Cost recommendations
  if (item.estimatedCost && item.actualCost && item.actualCost > item.estimatedCost * 1.2) {
    recommendations.push('Actual cost exceeds estimate by 20% - review budget');
  }

  return recommendations;
}

function canEditItem(item: any, user: any): boolean {
  // Owner can always edit
  if (item.SnagList.userId === user.id) return true;
  
  // Assigned person can edit
  if (item.assignedTo === user.id) return true;
  
  // Authorized roles can edit
  return user?.roles?.includes('ADMIN') || 
         user?.roles?.includes('SUPER_ADMIN') ||
         user?.roles?.includes('SITE_MANAGER') ||
         user?.roles?.includes('CONTRACTOR');
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
  if (item.SnagList.userId === user.id) return true;
  
  return user?.roles?.includes('ADMIN') || 
         user?.roles?.includes('SUPER_ADMIN') ||
         user?.roles?.includes('SITE_MANAGER');
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

function formatTimeline(updates: any[]) {
  return updates.map(update => ({
    id: update.id,
    date: update.created,
    type: update.updateType,
    description: update.updateText,
    user: update.UpdatedBy,
    timeAgo: calculateTimeAgo(update.created),
    isPrivate: update.privateNote || false
  }));
}

function groupPhotosByType(photos: any[]) {
  return photos.reduce((acc: any, photo) => {
    const type = photo.photoType || 'REFERENCE';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
}

function generateThumbnailUrl(photoData: string): string {
  // In a real implementation, this would generate a thumbnail URL
  return `data:image/jpeg;base64,${photoData.substring(0, 100)}...`;
}

function generateFullImageUrl(photoData: string): string {
  // In a real implementation, this would return a full image URL
  return `data:image/jpeg;base64,${photoData}`;
}

function determineUpdateType(changes: any): string {
  if (changes.status) return 'STATUS_CHANGE';
  if (changes.assignedTo) return 'ASSIGNMENT_CHANGE';
  if (changes.priority) return 'PRIORITY_CHANGE';
  return 'GENERAL_UPDATE';
}

function generateUpdateText(changes: any, data: any): string {
  const changeDescriptions = [];

  if (changes.status) {
    changeDescriptions.push(`Status changed from ${changes.status.from} to ${changes.status.to}`);
  }
  if (changes.assignedTo) {
    changeDescriptions.push(`Assignment changed`);
  }
  if (changes.priority) {
    changeDescriptions.push(`Priority changed from ${changes.priority.from} to ${changes.priority.to}`);
  }
  if (changes.targetDate) {
    changeDescriptions.push(`Target date updated`);
  }

  return changeDescriptions.join(', ') || 'Item updated';
}

function extractStatusFromText(text: string): string {
  // Extract status from update text - simplified implementation
  const statusMatch = text.match(/to (\w+)/);
  return statusMatch ? statusMatch[1] : 'OPEN';
}

async function handleAddPhoto(itemId: string, data: any, currentUser: any) {
  const validatedData = addPhotoSchema.parse(data);

  // Validate file size (10MB limit)
  if (validatedData.fileSize > 10 * 1024 * 1024) {
    return NextResponse.json(
      { error: 'File size must be less than 10MB' },
      { status: 400 }
    );
  }

  // Create photo record
  const photo = await prisma.snagItemPhoto.create({
    data: {
      id: generateId(),
      itemId,
      title: validatedData.title,
      description: validatedData.description,
      fileName: validatedData.fileName,
      fileSize: validatedData.fileSize,
      mimeType: validatedData.mimeType,
      photoData: validatedData.photoData,
      photoType: validatedData.photoType,
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

  // Create update record
  await prisma.snagItemUpdate.create({
    data: {
      id: generateId(),
      itemId,
      updateType: 'PHOTO_ADDED',
      updateText: `Photo added: ${validatedData.title}`,
      updatedBy: currentUser.id,
      metadata: { photoId: photo.id, photoType: validatedData.photoType }
    }
  });

  return NextResponse.json({
    success: true,
    data: {
      photo: {
        ...photo,
        timeAgo: calculateTimeAgo(photo.uploadDate),
        thumbnailUrl: generateThumbnailUrl(photo.photoData)
      },
      message: 'Photo added successfully'
    }
  }, { status: 201 });
}

async function handleAddUpdate(itemId: string, data: any, currentUser: any) {
  const validatedData = addUpdateSchema.parse(data);

  // Create update record
  const update = await prisma.snagItemUpdate.create({
    data: {
      id: generateId(),
      itemId,
      updateType: validatedData.updateType,
      updateText: validatedData.updateText,
      privateNote: validatedData.privateNote,
      metadata: validatedData.metadata || {},
      updatedBy: currentUser.id
    },
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
  });

  return NextResponse.json({
    success: true,
    data: {
      update: {
        ...update,
        timeAgo: calculateTimeAgo(update.created)
      },
      message: 'Update added successfully'
    }
  }, { status: 201 });
}

async function handleStatusChangeNotifications(item: any, statusChange: any, currentUser: any) {
  // Send notifications for status changes
  if (statusChange.to === 'COMPLETED') {
    // Notify snag list owner of completion
    console.log(`Snag item ${item.id} completed by ${currentUser.id}`);
  }
}

async function handleAssignmentChangeNotifications(item: any, assignmentChange: any, currentUser: any) {
  // Send notifications for assignment changes
  if (assignmentChange.to) {
    console.log(`Snag item ${item.id} assigned to ${assignmentChange.to} by ${currentUser.id}`);
  }
}