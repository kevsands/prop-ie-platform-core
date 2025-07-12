// src/app/api/notifications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/users-production';

interface Notification {
  id: string;
  userId: string;
  type: 'success' | 'info' | 'warning' | 'error' | 'new_message' | 'task_update' | 'payment_status' | 'milestone' | 'reminder';
  title: string;
  content: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'unread' | 'read' | 'archived';
  createdAt: string;
  readAt?: string;
  actionUrl?: string;
  actionLabel?: string;
  category: 'system' | 'communication' | 'financial' | 'legal' | 'property' | 'task';
  metadata?: {
    senderId?: string;
    senderName?: string;
    conversationId?: string;
    taskId?: string;
    transactionId?: string;
    propertyId?: string;
    relatedEntityType?: string;
    relatedEntityId?: string;
  };
  deliveryChannels: {
    inApp: boolean;
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  scheduledFor?: string; // For future delivery
  expiresAt?: string; // Auto-archive after this date
}

interface NotificationPreferences {
  userId: string;
  categories: {
    system: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
    communication: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
    financial: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
    legal: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
    property: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
    task: { inApp: boolean; email: boolean; sms: boolean; push: boolean };
  };
  quietHours: {
    enabled: boolean;
    startTime: string; // "22:00"
    endTime: string; // "08:00"
    timezone: string;
  };
  frequency: {
    realTime: boolean;
    digest: 'never' | 'daily' | 'weekly';
    digestTime: string; // "09:00"
  };
}

/**
 * Notifications API
 * Handles user notifications and delivery preferences
 */
export async function GET(request: NextRequest) {
  try {
    // Get current user
    let currentUser = null;
    try {
      if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
        const authToken = request.cookies.get('auth-token')?.value;
        if (authToken?.startsWith('dev-token-')) {
          const userId = authToken.replace('dev-token-', '');
          currentUser = await userService.getUserById(userId);
        }
      } else {
        currentUser = await userService.getCurrentUser();
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // In development mode, return mock notifications
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
      console.log(`[DEV] Getting notifications for user ${currentUser.id}`);
      
      const mockNotifications: Notification[] = [
        {
          id: 'notif_001',
          userId: currentUser.id,
          type: 'success',
          title: 'Payment Certificate Issued',
          content: 'Payment certificate #9 for €617,500 has been issued for Fitzgerald Gardens contractor valuation.',
          priority: 'high',
          status: 'unread',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          actionUrl: '/developer/finance/dashboard',
          actionLabel: 'View Dashboard',
          category: 'financial',
          metadata: {
            amount: 617500,
            certificateNumber: 9,
            projectId: 'fitzgerald-gardens'
          },
          deliveryChannels: {
            inApp: true,
            email: true,
            sms: false,
            push: true
          }
        },
        {
          id: 'notif_001a',
          userId: currentUser.id,
          type: 'warning',
          title: 'VAT Return Due Soon',
          content: 'Monthly VAT return for July 2025 is due on July 23rd. Total VAT liable: €156,750.',
          priority: 'urgent',
          status: 'unread',
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
          actionUrl: '/developer/finance/tax-compliance',
          actionLabel: 'File Return',
          category: 'financial',
          metadata: {
            dueDate: '2025-07-23',
            vatAmount: 156750,
            returnType: 'monthly'
          },
          deliveryChannels: {
            inApp: true,
            email: true,
            sms: true,
            push: true
          }
        },
        {
          id: 'notif_001b',
          userId: currentUser.id,
          type: 'info',
          title: 'New Contractor Valuation',
          content: 'John Murphy has submitted valuation #10 for €425,000. Awaiting QS review.',
          priority: 'normal',
          status: 'unread',
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
          actionUrl: '/quantity-surveyor/valuation-review',
          actionLabel: 'Review Valuation',
          category: 'financial',
          metadata: {
            amount: 425000,
            submittedBy: 'John Murphy',
            valuationNumber: 10
          },
          deliveryChannels: {
            inApp: true,
            email: false,
            sms: false,
            push: true
          }
        },
        {
          id: 'notif_002',
          userId: currentUser.id,
          type: 'new_message',
          title: 'New Message from Sarah O\'Sullivan',
          content: 'I\'ve completed the review of your purchase contract for Fitzgerald Gardens Unit 12A...',
          priority: 'normal',
          status: 'unread',
          createdAt: '2025-06-18T14:30:00Z',
          actionUrl: '/buyer/messages?conversation=conv_001',
          actionLabel: 'Read Message',
          category: 'communication',
          metadata: {
            senderId: 'user_solicitor_001',
            senderName: 'Sarah O\'Sullivan',
            conversationId: 'conv_001'
          },
          deliveryChannels: {
            inApp: true,
            email: false,
            sms: false,
            push: true
          }
        },
        {
          id: 'notif_003',
          userId: currentUser.id,
          type: 'task_update',
          title: 'Task Completed: Identity Verification',
          content: 'Your identity verification has been completed successfully. You can now proceed with your Help-to-Buy application.',
          priority: 'normal',
          status: 'read',
          createdAt: '2025-06-17T11:15:00Z',
          readAt: '2025-06-17T14:22:00Z',
          actionUrl: '/buyer/tasks',
          actionLabel: 'View Tasks',
          category: 'task',
          metadata: {
            taskId: 'task_001',
            relatedEntityType: 'verification'
          },
          deliveryChannels: {
            inApp: true,
            email: true,
            sms: false,
            push: true
          }
        },
        {
          id: 'notif_004',
          userId: currentUser.id,
          type: 'milestone',
          title: 'Milestone Achieved: Property Secured',
          content: 'Congratulations! You\'ve successfully reserved your property. Next step: legal setup.',
          priority: 'high',
          status: 'read',
          createdAt: '2025-06-16T18:45:00Z',
          readAt: '2025-06-17T09:30:00Z',
          actionUrl: '/buyer/journey',
          actionLabel: 'View Journey',
          category: 'task',
          metadata: {
            relatedEntityType: 'milestone',
            relatedEntityId: 'property_secured'
          },
          deliveryChannels: {
            inApp: true,
            email: true,
            sms: true,
            push: true
          }
        },
        {
          id: 'notif_005',
          userId: currentUser.id,
          type: 'info',
          title: 'HTB Application Submitted',
          content: 'Your Help-to-Buy application has been submitted to Revenue. Processing time is typically 5-10 business days.',
          priority: 'normal',
          status: 'read',
          createdAt: '2025-06-15T10:20:00Z',
          readAt: '2025-06-15T15:45:00Z',
          actionUrl: '/buyer/htb/status',
          actionLabel: 'Check Status',
          category: 'financial',
          metadata: {
            relatedEntityType: 'htb_application',
            relatedEntityId: 'htb_claim_001'
          },
          deliveryChannels: {
            inApp: true,
            email: true,
            sms: false,
            push: true
          }
        },
        {
          id: 'notif_006',
          userId: currentUser.id,
          type: 'reminder',
          title: 'Reminder: Mortgage Application Due',
          content: 'Don\'t forget to submit your formal mortgage application by June 30th to stay on track.',
          priority: 'high',
          status: 'unread',
          createdAt: '2025-06-18T09:00:00Z',
          actionUrl: '/buyer/tasks/task_005',
          actionLabel: 'Submit Application',
          category: 'financial',
          metadata: {
            taskId: 'task_005',
            relatedEntityType: 'mortgage_reminder'
          },
          deliveryChannels: {
            inApp: true,
            email: true,
            sms: true,
            push: true
          },
          expiresAt: '2025-06-30T23:59:59Z'
        },
        {
          id: 'notif_007',
          userId: currentUser.id,
          type: 'warning',
          title: 'Action Required: Choose Solicitor',
          content: 'You need to select a solicitor within 7 days of your property reservation to proceed with the legal process.',
          priority: 'urgent',
          status: 'unread',
          createdAt: '2025-06-18T08:00:00Z',
          actionUrl: '/professionals/solicitors',
          actionLabel: 'Find Solicitors',
          category: 'legal',
          metadata: {
            taskId: 'task_004',
            relatedEntityType: 'solicitor_deadline'
          },
          deliveryChannels: {
            inApp: true,
            email: true,
            sms: true,
            push: true
          },
          expiresAt: '2025-06-25T23:59:59Z'
        },
        {
          id: 'notif_008',
          userId: currentUser.id,
          type: 'info',
          title: 'Welcome to PROP.ie',
          content: 'Welcome to Ireland\'s most advanced property platform! We\'re here to guide you through every step of your home buying journey.',
          priority: 'low',
          status: 'archived',
          createdAt: '2025-06-10T12:00:00Z',
          readAt: '2025-06-10T14:30:00Z',
          actionUrl: '/buyer/journey/planning',
          actionLabel: 'Start Journey',
          category: 'system',
          deliveryChannels: {
            inApp: true,
            email: true,
            sms: false,
            push: false
          }
        }
      ];

      // Apply filters
      let filteredNotifications = mockNotifications;
      
      if (status) {
        filteredNotifications = filteredNotifications.filter(n => n.status === status);
      }
      
      if (category) {
        filteredNotifications = filteredNotifications.filter(n => n.category === category);
      }
      
      if (type) {
        filteredNotifications = filteredNotifications.filter(n => n.type === type);
      }

      // Apply pagination
      const paginatedNotifications = filteredNotifications.slice(offset, offset + limit);

      // Calculate summary
      const summary = {
        total: filteredNotifications.length,
        unread: mockNotifications.filter(n => n.status === 'unread').length,
        read: mockNotifications.filter(n => n.status === 'read').length,
        archived: mockNotifications.filter(n => n.status === 'archived').length,
        urgent: mockNotifications.filter(n => n.priority === 'urgent' && n.status === 'unread').length,
        categories: {
          system: mockNotifications.filter(n => n.category === 'system').length,
          communication: mockNotifications.filter(n => n.category === 'communication').length,
          financial: mockNotifications.filter(n => n.category === 'financial').length,
          legal: mockNotifications.filter(n => n.category === 'legal').length,
          property: mockNotifications.filter(n => n.category === 'property').length,
          task: mockNotifications.filter(n => n.category === 'task').length
        }
      };

      return NextResponse.json({
        success: true,
        notifications: paginatedNotifications,
        pagination: {
          total: filteredNotifications.length,
          limit,
          offset,
          hasMore: offset + limit < filteredNotifications.length
        },
        summary,
        message: '[DEV MODE] Mock notifications data'
      });
    }

    // Production: Query actual database
    try {
      return NextResponse.json({
        success: true,
        notifications: [],
        pagination: {
          total: 0,
          limit,
          offset,
          hasMore: false
        },
        summary: {
          total: 0,
          unread: 0,
          read: 0,
          archived: 0,
          urgent: 0,
          categories: {
            system: 0,
            communication: 0,
            financial: 0,
            legal: 0,
            property: 0,
            task: 0
          }
        }
      });
    } catch (dbError: any) {
      console.error('Database query error:', dbError);
      
      return NextResponse.json(
        { error: 'Failed to retrieve notifications' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Notifications API error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Create New Notification
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId, 
      type, 
      title, 
      content, 
      priority = 'normal', 
      category, 
      actionUrl, 
      actionLabel, 
      metadata,
      deliveryChannels = { inApp: true, email: false, sms: false, push: false },
      scheduledFor,
      expiresAt
    } = body;

    // Validate required fields
    if (!userId || !type || !title || !content || !category) {
      return NextResponse.json(
        { error: 'userId, type, title, content, and category are required' },
        { status: 400 }
      );
    }

    // In development mode, simulate notification creation
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
      console.log(`[DEV] Creating notification for user ${userId}: ${title}`);
      
      const newNotification: Notification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        type,
        title,
        content,
        priority,
        status: 'unread',
        createdAt: new Date().toISOString(),
        actionUrl,
        actionLabel,
        category,
        metadata,
        deliveryChannels,
        scheduledFor,
        expiresAt
      };

      // Simulate delivery to different channels
      const deliveryResults = [];
      
      if (deliveryChannels.inApp) {
        deliveryResults.push({
          channel: 'in_app',
          status: 'delivered',
          deliveredAt: new Date().toISOString()
        });
      }
      
      if (deliveryChannels.email) {
        deliveryResults.push({
          channel: 'email',
          status: 'queued',
          scheduledFor: new Date(Date.now() + 60000).toISOString() // 1 minute delay
        });
      }
      
      if (deliveryChannels.push) {
        deliveryResults.push({
          channel: 'push',
          status: 'delivered',
          deliveredAt: new Date().toISOString()
        });
      }

      return NextResponse.json({
        success: true,
        notification: newNotification,
        delivery: deliveryResults,
        message: '[DEV MODE] Notification created and delivery simulated'
      });
    }

    // Production: Create actual notification
    try {
      return NextResponse.json({
        success: true,
        notification: {
          id: `notif_${Date.now()}`,
          userId,
          type,
          title,
          content,
          createdAt: new Date().toISOString()
        }
      });
    } catch (dbError: any) {
      console.error('Database insert error:', dbError);
      
      return NextResponse.json(
        { error: 'Failed to create notification' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Create notification error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Update Notification Status
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { notificationIds, status, action } = body;

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return NextResponse.json(
        { error: 'Notification IDs array is required' },
        { status: 400 }
      );
    }

    // Get current user
    let currentUser = null;
    try {
      if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
        const authToken = request.cookies.get('auth-token')?.value;
        if (authToken?.startsWith('dev-token-')) {
          const userId = authToken.replace('dev-token-', '');
          currentUser = await userService.getUserById(userId);
        }
      } else {
        currentUser = await userService.getCurrentUser();
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // In development mode, simulate notification updates
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
      console.log(`[DEV] Updating notifications for user ${currentUser.id}: ${action || status}`);
      
      const updateResults = notificationIds.map(id => ({
        id,
        status: status || 'read',
        updatedAt: new Date().toISOString(),
        readAt: status === 'read' ? new Date().toISOString() : undefined
      }));

      return NextResponse.json({
        success: true,
        updated: updateResults,
        message: '[DEV MODE] Notifications updated successfully'
      });
    }

    // Production: Update actual notifications
    try {
      return NextResponse.json({
        success: true,
        updated: notificationIds.map(id => ({
          id,
          status: status || 'read',
          updatedAt: new Date().toISOString()
        }))
      });
    } catch (dbError: any) {
      console.error('Database update error:', dbError);
      
      return NextResponse.json(
        { error: 'Failed to update notifications' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Update notification error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}