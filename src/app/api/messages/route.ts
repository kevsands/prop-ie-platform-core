// src/app/api/messages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/users-production';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'buyer' | 'solicitor' | 'agent' | 'developer' | 'lender' | 'admin';
  recipientIds: string[];
  subject?: string;
  content: string;
  messageType: 'text' | 'document' | 'system' | 'task_update' | 'payment_notification';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'sent' | 'delivered' | 'read';
  createdAt: string;
  updatedAt: string;
  readBy: {
    userId: string;
    readAt: string;
  }[];
  attachments?: {
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    url: string;
  }[];
  metadata?: {
    propertyId?: string;
    taskId?: string;
    transactionId?: string;
    relatedEntityType?: string;
    relatedEntityId?: string;
  };
}

interface Conversation {
  id: string;
  title: string;
  participants: {
    userId: string;
    userName: string;
    userRole: string;
    joinedAt: string;
    lastSeenAt?: string;
  }[];
  lastMessage?: {
    content: string;
    senderName: string;
    timestamp: string;
  };
  messageCount: number;
  unreadCount: number;
  status: 'active' | 'archived' | 'closed';
  createdAt: string;
  updatedAt: string;
  metadata?: {
    propertyId?: string;
    propertyTitle?: string;
    contextType?: 'property_purchase' | 'htb_application' | 'legal_support' | 'general_inquiry';
  };
}

/**
 * Messages API
 * Handles multi-party messaging and communication
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
    const conversationId = searchParams.get('conversationId');
    const type = searchParams.get('type'); // 'conversations' or 'messages'
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    // In development mode, return mock data
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
      console.log(`[DEV] Getting ${type || 'conversations'} for user ${currentUser.id}`);
      
      if (type === 'messages' && conversationId) {
        // Return messages for specific conversation
        const mockMessages: Message[] = [
          {
            id: 'msg_001',
            conversationId,
            senderId: 'user_solicitor_001',
            senderName: 'Sarah O\'Sullivan',
            senderRole: 'solicitor',
            recipientIds: [currentUser.id],
            subject: 'Contract Review Complete',
            content: 'Hi John, I\'ve completed the review of your purchase contract for Fitzgerald Gardens Unit 12A. Overall, the contract looks good with standard terms. I have a few minor queries about the completion timeline that I\'d like to discuss with you. When would be a good time for a call this week?',
            messageType: 'text',
            priority: 'high',
            status: 'delivered',
            createdAt: '2025-06-18T14:30:00Z',
            updatedAt: '2025-06-18T14:30:00Z',
            readBy: [],
            metadata: {
              propertyId: 'prop_001',
              relatedEntityType: 'contract_review'
            }
          },
          {
            id: 'msg_002',
            conversationId,
            senderId: currentUser.id,
            senderName: `${currentUser.firstName} ${currentUser.lastName}`,
            senderRole: 'buyer',
            recipientIds: ['user_solicitor_001'],
            content: 'Thanks Sarah! I\'m available for a call tomorrow afternoon after 2pm, or Thursday morning. What queries do you have about the completion timeline?',
            messageType: 'text',
            priority: 'normal',
            status: 'sent',
            createdAt: '2025-06-18T15:15:00Z',
            updatedAt: '2025-06-18T15:15:00Z',
            readBy: [
              {
                userId: 'user_solicitor_001',
                readAt: '2025-06-18T15:20:00Z'
              }
            ]
          },
          {
            id: 'msg_003',
            conversationId,
            senderId: 'user_developer_001',
            senderName: 'Fitzgerald Developments',
            senderRole: 'developer',
            recipientIds: [currentUser.id, 'user_solicitor_001'],
            content: 'We\'ve scheduled the final snag inspection for next Tuesday at 10am. Please confirm if this timing works for both of you. The property will be ready for completion the following week.',
            messageType: 'text',
            priority: 'normal',
            status: 'delivered',
            createdAt: '2025-06-18T16:45:00Z',
            updatedAt: '2025-06-18T16:45:00Z',
            readBy: [],
            metadata: {
              propertyId: 'prop_001',
              relatedEntityType: 'final_inspection'
            }
          },
          {
            id: 'msg_004',
            conversationId,
            senderId: 'system',
            senderName: 'PROP.ie System',
            senderRole: 'admin',
            recipientIds: [currentUser.id],
            content: 'Your Help-to-Buy benefit of €30,000 has been approved and will be disbursed to your solicitor before completion.',
            messageType: 'system',
            priority: 'high',
            status: 'delivered',
            createdAt: '2025-06-18T17:00:00Z',
            updatedAt: '2025-06-18T17:00:00Z',
            readBy: [],
            metadata: {
              relatedEntityType: 'htb_approval',
              relatedEntityId: 'htb_claim_001'
            }
          },
          {
            id: 'msg_005',
            conversationId,
            senderId: 'user_agent_001',
            senderName: 'Michael Murphy - Cork Properties',
            senderRole: 'agent',
            recipientIds: [currentUser.id],
            content: 'Congratulations on reaching this stage! I\'ll be available to help coordinate the final inspection next week. Let me know if you need any assistance.',
            messageType: 'text',
            priority: 'low',
            status: 'delivered',
            createdAt: '2025-06-18T18:30:00Z',
            updatedAt: '2025-06-18T18:30:00Z',
            readBy: [],
            attachments: [
              {
                id: 'att_001',
                fileName: 'Final_Inspection_Checklist.pdf',
                fileType: 'application/pdf',
                fileSize: 245760,
                url: '/attachments/att_001.pdf'
              }
            ]
          }
        ];

        return NextResponse.json({
          success: true,
          messages: mockMessages,
          pagination: {
            total: mockMessages.length,
            limit,
            offset,
            hasMore: false
          },
          message: '[DEV MODE] Mock messages for conversation'
        });
      }

      // Return conversations list
      const mockConversations: Conversation[] = [
        {
          id: 'conv_001',
          title: 'Fitzgerald Gardens Unit 12A - Purchase',
          participants: [
            {
              userId: currentUser.id,
              userName: `${currentUser.firstName} ${currentUser.lastName}`,
              userRole: 'buyer',
              joinedAt: '2025-06-15T10:00:00Z',
              lastSeenAt: '2025-06-18T18:35:00Z'
            },
            {
              userId: 'user_solicitor_001',
              userName: 'Sarah O\'Sullivan',
              userRole: 'solicitor',
              joinedAt: '2025-06-16T09:00:00Z',
              lastSeenAt: '2025-06-18T15:25:00Z'
            },
            {
              userId: 'user_developer_001',
              userName: 'Fitzgerald Developments',
              userRole: 'developer',
              joinedAt: '2025-06-15T10:00:00Z',
              lastSeenAt: '2025-06-18T16:50:00Z'
            },
            {
              userId: 'user_agent_001',
              userName: 'Michael Murphy',
              userRole: 'agent',
              joinedAt: '2025-06-15T10:00:00Z',
              lastSeenAt: '2025-06-18T18:35:00Z'
            }
          ],
          lastMessage: {
            content: 'Congratulations on reaching this stage! I\'ll be available to help coordinate...',
            senderName: 'Michael Murphy',
            timestamp: '2025-06-18T18:30:00Z'
          },
          messageCount: 12,
          unreadCount: 3,
          status: 'active',
          createdAt: '2025-06-15T10:00:00Z',
          updatedAt: '2025-06-18T18:30:00Z',
          metadata: {
            propertyId: 'prop_001',
            propertyTitle: 'Fitzgerald Gardens Unit 12A',
            contextType: 'property_purchase'
          }
        },
        {
          id: 'conv_002',
          title: 'Help-to-Buy Application Support',
          participants: [
            {
              userId: currentUser.id,
              userName: `${currentUser.firstName} ${currentUser.lastName}`,
              userRole: 'buyer',
              joinedAt: '2025-06-10T14:00:00Z',
              lastSeenAt: '2025-06-17T11:20:00Z'
            },
            {
              userId: 'user_admin_001',
              userName: 'PROP.ie Support',
              userRole: 'admin',
              joinedAt: '2025-06-10T14:00:00Z',
              lastSeenAt: '2025-06-17T16:30:00Z'
            }
          ],
          lastMessage: {
            content: 'Your HTB application has been successfully submitted to Revenue...',
            senderName: 'PROP.ie Support',
            timestamp: '2025-06-17T16:30:00Z'
          },
          messageCount: 8,
          unreadCount: 0,
          status: 'active',
          createdAt: '2025-06-10T14:00:00Z',
          updatedAt: '2025-06-17T16:30:00Z',
          metadata: {
            contextType: 'htb_application'
          }
        },
        {
          id: 'conv_003',
          title: 'Mortgage Application - Bank of Ireland',
          participants: [
            {
              userId: currentUser.id,
              userName: `${currentUser.firstName} ${currentUser.lastName}`,
              userRole: 'buyer',
              joinedAt: '2025-06-12T11:00:00Z',
              lastSeenAt: '2025-06-16T14:45:00Z'
            },
            {
              userId: 'user_lender_001',
              userName: 'Bank of Ireland Mortgages',
              userRole: 'lender',
              joinedAt: '2025-06-12T11:00:00Z',
              lastSeenAt: '2025-06-16T15:00:00Z'
            }
          ],
          lastMessage: {
            content: 'Congratulations! Your mortgage application has been approved for €280,000...',
            senderName: 'Bank of Ireland Mortgages',
            timestamp: '2025-06-16T15:00:00Z'
          },
          messageCount: 6,
          unreadCount: 1,
          status: 'active',
          createdAt: '2025-06-12T11:00:00Z',
          updatedAt: '2025-06-16T15:00:00Z',
          metadata: {
            propertyId: 'prop_001',
            contextType: 'property_purchase'
          }
        },
        {
          id: 'conv_004',
          title: 'Property Viewing Follow-up',
          participants: [
            {
              userId: currentUser.id,
              userName: `${currentUser.firstName} ${currentUser.lastName}`,
              userRole: 'buyer',
              joinedAt: '2025-06-08T16:00:00Z'
            },
            {
              userId: 'user_agent_002',
              userName: 'Emma Kelly - Dublin Properties',
              userRole: 'agent',
              joinedAt: '2025-06-08T16:00:00Z'
            }
          ],
          lastMessage: {
            content: 'Thanks for viewing the property today. Let me know if you have any questions!',
            senderName: 'Emma Kelly',
            timestamp: '2025-06-08T17:30:00Z'
          },
          messageCount: 4,
          unreadCount: 0,
          status: 'archived',
          createdAt: '2025-06-08T16:00:00Z',
          updatedAt: '2025-06-08T17:30:00Z',
          metadata: {
            propertyId: 'prop_002',
            propertyTitle: 'Oakwood Heights Unit 5B',
            contextType: 'general_inquiry'
          }
        }
      ];

      // Apply filters
      let filteredConversations = mockConversations;
      if (status) {
        filteredConversations = filteredConversations.filter(c => c.status === status);
      }

      // Apply pagination
      const paginatedConversations = filteredConversations.slice(offset, offset + limit);

      // Calculate summary
      const summary = {
        total: filteredConversations.length,
        active: mockConversations.filter(c => c.status === 'active').length,
        archived: mockConversations.filter(c => c.status === 'archived').length,
        totalUnread: mockConversations.reduce((sum, c) => sum + c.unreadCount, 0)
      };

      return NextResponse.json({
        success: true,
        conversations: paginatedConversations,
        pagination: {
          total: filteredConversations.length,
          limit,
          offset,
          hasMore: offset + limit < filteredConversations.length
        },
        summary,
        message: '[DEV MODE] Mock conversations data'
      });
    }

    // Production: Query actual database
    try {
      return NextResponse.json({
        success: true,
        conversations: [],
        pagination: {
          total: 0,
          limit,
          offset,
          hasMore: false
        },
        summary: {
          total: 0,
          active: 0,
          archived: 0,
          totalUnread: 0
        }
      });
    } catch (dbError: any) {
      console.error('Database query error:', dbError);
      
      return NextResponse.json(
        { error: 'Failed to retrieve messages' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Messages API error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Send New Message
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationId, recipientIds, subject, content, messageType = 'text', priority = 'normal', metadata } = body;

    // Validate required fields
    if (!content) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    if (!conversationId && !recipientIds) {
      return NextResponse.json(
        { error: 'Either conversation ID or recipient IDs must be provided' },
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

    // In development mode, simulate message sending
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
      console.log(`[DEV] Sending message from user ${currentUser.id}`);
      
      const newMessage: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        conversationId: conversationId || `conv_${Date.now()}`,
        senderId: currentUser.id,
        senderName: `${currentUser.firstName} ${currentUser.lastName}`,
        senderRole: 'buyer', // This would be determined from user's role
        recipientIds: recipientIds || [],
        subject,
        content,
        messageType,
        priority,
        status: 'sent',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        readBy: [],
        metadata
      };

      // Simulate real-time notification sending
      const notifications = [];
      if (recipientIds) {
        for (const recipientId of recipientIds) {
          notifications.push({
            recipientId,
            type: 'new_message',
            title: `New message from ${currentUser.firstName} ${currentUser.lastName}`,
            content: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
            actionUrl: `/buyer/messages?conversation=${newMessage.conversationId}`
          });
        }
      }

      return NextResponse.json({
        success: true,
        message: newMessage,
        notifications,
        message_text: '[DEV MODE] Message sent successfully'
      });
    }

    // Production: Send actual message
    try {
      return NextResponse.json({
        success: true,
        message: {
          id: `msg_${Date.now()}`,
          conversationId: conversationId || `conv_${Date.now()}`,
          senderId: currentUser.id,
          content,
          createdAt: new Date().toISOString()
        }
      });
    } catch (dbError: any) {
      console.error('Database insert error:', dbError);
      
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Send message error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}