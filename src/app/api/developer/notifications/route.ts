import { NextRequest, NextResponse } from 'next/server';

interface DeveloperNotification {
  id: string;
  buyerId: string;
  buyerName: string;
  type: 'HTB_UPDATE' | 'COMPLETION_STATUS' | 'DOCUMENT_REQUIRED' | 'PAYMENT_DUE' | 'URGENT_ACTION';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  propertyId?: string;
  claimId?: string;
  developerId?: string;
  projectId?: string;
}

// In-memory storage for demo (replace with database in production)
const developerNotifications: Map<string, DeveloperNotification[]> = new Map();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const developerId = searchParams.get('developerId') || 'developer-001';
    const priority = searchParams.get('priority');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // Get notifications for this developer
    let notifications = developerNotifications.get(developerId) || [];
    
    // Filter by priority if specified
    if (priority) {
      notifications = notifications.filter(n => n.priority === priority);
    }
    
    // Filter by type if specified
    if (type) {
      notifications = notifications.filter(n => n.type === type);
    }
    
    // Sort by creation date (newest first)
    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // Apply limit
    const limitedNotifications = notifications.slice(0, limit);
    
    // Get summary stats
    const stats = {
      total: notifications.length,
      urgent: notifications.filter(n => n.priority === 'urgent').length,
      high: notifications.filter(n => n.priority === 'high').length,
      medium: notifications.filter(n => n.priority === 'medium').length,
      low: notifications.filter(n => n.priority === 'low').length,
      htbUpdates: notifications.filter(n => n.type === 'HTB_UPDATE').length,
      completionStatus: notifications.filter(n => n.type === 'COMPLETION_STATUS').length,
      documentsRequired: notifications.filter(n => n.type === 'DOCUMENT_REQUIRED').length,
      urgentActions: notifications.filter(n => n.type === 'URGENT_ACTION').length
    };

    return NextResponse.json({
      notifications: limitedNotifications,
      stats
    });
  } catch (error) {
    console.error('Error fetching developer notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { developerId = 'developer-001', ...notificationData } = body;
    
    const notification: DeveloperNotification = {
      id: `dev-notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      developerId,
      createdAt: new Date(),
      priority: 'medium',
      ...notificationData
    };

    // Add to storage
    const notifications = developerNotifications.get(developerId) || [];
    notifications.push(notification);
    developerNotifications.set(developerId, notifications);

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error('Error creating developer notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { developerId = 'developer-001', notificationId, markAsRead } = body;

    const notifications = developerNotifications.get(developerId) || [];
    const notification = notifications.find(n => n.id === notificationId);

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    // Update notification (for now just mark as read, could be extended)
    if (markAsRead !== undefined) {
      // In a real implementation, this would update a 'read' field
      notification.createdAt = new Date(notification.createdAt); // Ensure it's a Date object
    }

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Error updating developer notification:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}

// Initialize with demo data for development
if (process.env.NODE_ENV === 'development') {
  // Add demo notifications for developer-001
  developerNotifications.set('developer-001', [
    {
      id: 'dev-notif-001',
      buyerId: 'buyer-001',
      buyerName: 'John Doe',
      type: 'HTB_UPDATE',
      title: 'HTB Claim Code Ready',
      message: 'Buyer John Doe\'s HTB claim code is ready for submission to solicitor',
      priority: 'high',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      propertyId: 'fitzgerald-unit-12',
      claimId: 'htb-001',
      developerId: 'developer-001',
      projectId: 'fitzgerald-gardens'
    },
    {
      id: 'dev-notif-002',
      buyerId: 'buyer-003',
      buyerName: 'Michael Smith',
      type: 'URGENT_ACTION',
      title: 'HTB Funds Must Be Applied',
      message: 'HTB funds for Michael Smith are available and must be applied within 14 days',
      priority: 'urgent',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      propertyId: 'ballymakenny-unit-5',
      claimId: 'htb-003',
      developerId: 'developer-001',
      projectId: 'ballymakenny-view'
    },
    {
      id: 'dev-notif-003',
      buyerId: 'buyer-002',
      buyerName: 'Sarah Connor',
      type: 'COMPLETION_STATUS',
      title: 'Property Completion Delayed',
      message: 'Completion for Unit 8, Ellwood Heights has been delayed by 2 weeks',
      priority: 'medium',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      propertyId: 'ellwood-unit-8',
      developerId: 'developer-001',
      projectId: 'ellwood'
    },
    {
      id: 'dev-notif-004',
      buyerId: 'buyer-004',
      buyerName: 'Emma Watson',
      type: 'DOCUMENT_REQUIRED',
      title: 'HTB Documentation Required',
      message: 'Additional documentation required for Emma Watson\'s HTB application',
      priority: 'medium',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      propertyId: 'fitzgerald-unit-15',
      claimId: 'htb-004',
      developerId: 'developer-001',
      projectId: 'fitzgerald-gardens'
    },
    {
      id: 'dev-notif-005',
      buyerId: 'buyer-005',
      buyerName: 'David Wilson',
      type: 'HTB_UPDATE',
      title: 'HTB Application Approved',
      message: 'HTB application for David Wilson has been approved by Revenue',
      priority: 'high',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      propertyId: 'ellwood-unit-3',
      claimId: 'htb-005',
      developerId: 'developer-001',
      projectId: 'ellwood'
    }
  ]);
}