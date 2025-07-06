import { NextRequest, NextResponse } from 'next/server';
import { rosieIntegrationService } from '@/services/ROSIeIntegrationService';

interface Notification {
  id: string;
  userId: string;
  type: 'HTB_UPDATE' | 'COMPLETION_STATUS' | 'DOCUMENT_REQUIRED' | 'PAYMENT_DUE' | 'GENERAL';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage for demo (replace with database in production)
const notifications: Map<string, Notification[]> = new Map();

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    // Get user notifications from storage
    let userNotifications = notifications.get(userId) || [];

    // Filter unread if requested
    if (unreadOnly) {
      userNotifications = userNotifications.filter(n => !n.read);
    }

    // Sort by creation date (newest first)
    userNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Apply limit
    const limitedNotifications = userNotifications.slice(0, limit);

    // Check for new ROS.ie updates
    await checkForROSIeUpdates(userId);

    return NextResponse.json(limitedNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const body = await request.json();
    
    const notification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type: body.type || 'GENERAL',
      title: body.title,
      message: body.message,
      data: body.data,
      read: false,
      priority: body.priority || 'medium',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to storage
    const userNotifications = notifications.get(userId) || [];
    userNotifications.push(notification);
    notifications.set(userId, userNotifications);

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const body = await request.json();
    const { notificationId, read } = body;

    const userNotifications = notifications.get(userId) || [];
    const notification = userNotifications.find(n => n.id === notificationId);

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    notification.read = read;
    notification.updatedAt = new Date();

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}

async function checkForROSIeUpdates(userId: string): Promise<void> {
  try {
    // Get user's HTB claims
    const response = await fetch(`/api/htb/status/${userId}`);
    if (!response.ok) return;

    const htbStatus = await response.json();
    if (!htbStatus.claimCode) return;

    // Check ROS.ie for updates
    const rosieStatus = await rosieIntegrationService.getHTBClaimStatus(htbStatus.claimCode);
    
    if (rosieStatus.status !== htbStatus.lastKnownStatus) {
      // Create notification for status change
      const notification: Notification = {
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId,
        type: 'HTB_UPDATE',
        title: 'HTB Status Update',
        message: `Your Help-to-Buy claim status has changed to: ${rosieStatus.status}`,
        data: {
          claimCode: htbStatus.claimCode,
          newStatus: rosieStatus.status,
          previousStatus: htbStatus.lastKnownStatus
        },
        read: false,
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const userNotifications = notifications.get(userId) || [];
      userNotifications.push(notification);
      notifications.set(userId, userNotifications);

      // Update HTB status
      await fetch(`/api/htb/status/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lastKnownStatus: rosieStatus.status })
      });
    }
  } catch (error) {
    console.error('Error checking ROS.ie updates:', error);
  }
}

// Initialize with some demo notifications for development
if (process.env.NODE_ENV === 'development') {
  // Add demo notifications for buyer-001
  notifications.set('buyer-001', [
    {
      id: 'demo-1',
      userId: 'buyer-001',
      type: 'HTB_UPDATE',
      title: 'HTB Application Approved',
      message: 'Your Help-to-Buy application has been approved by the Revenue Commissioners.',
      data: { claimCode: 'HTB2024001234' },
      read: false,
      priority: 'high',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 'demo-2',
      userId: 'buyer-001',
      type: 'DOCUMENT_REQUIRED',
      title: 'Document Upload Required',
      message: 'Please upload your mortgage approval letter to complete your application.',
      data: { documentType: 'mortgage_approval' },
      read: false,
      priority: 'medium',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'demo-3',
      userId: 'buyer-001',
      type: 'COMPLETION_STATUS',
      title: 'Property Completion Update',
      message: 'Your property completion is scheduled for next week. All documents are ready.',
      data: { propertyId: 'prop-123', completionDate: '2024-06-25' },
      read: true,
      priority: 'medium',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    }
  ]);
}