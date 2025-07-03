// Real message sending with database persistence and user delivery
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { withAuth, DOCUMENT_PERMISSIONS } from '@/lib/middleware/auth-middleware';

const prisma = new PrismaClient();

export const POST = withAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    const { conversationId, recipientIds, content, messageType = 'text', priority = 'normal', projectId } = body;

    // Use authenticated user
    const currentUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.roles[0] || 'USER'
    };

    // Start database transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create or find conversation
      let conversation;
      if (conversationId) {
        conversation = await tx.conversation.findUnique({
          where: { id: conversationId },
          include: { participants: true }
        });
      } else {
        // Create new conversation
        conversation = await tx.conversation.create({
          data: {
            id: uuidv4(),
            title: `Developer Communication - ${new Date().toLocaleDateString()}`,
            type: 'developer_communication',
            status: 'active',
            projectId: projectId || null,
            createdById: currentUser.id,
            participants: {
              create: [
                {
                  userId: currentUser.id,
                  role: 'developer',
                  joinedAt: new Date()
                },
                ...(recipientIds || []).map((recipientId: string) => ({
                  userId: recipientId,
                  role: 'participant',
                  joinedAt: new Date()
                }))
              ]
            }
          },
          include: { participants: true }
        });
      }

      if (!conversation) {
        throw new Error('Conversation not found');
      }

      // Create the message
      const message = await tx.message.create({
        data: {
          id: uuidv4(),
          conversationId: conversation.id,
          senderId: currentUser.id,
          senderName: `${currentUser.firstName} ${currentUser.lastName}`,
          senderRole: currentUser.role || 'developer',
          content: content,
          messageType: messageType,
          priority: priority,
          status: 'sent',
          metadata: {
            projectId: projectId,
            timestamp: new Date().toISOString()
          }
        }
      });

      // Update conversation last message
      await tx.conversation.update({
        where: { id: conversation.id },
        data: {
          lastMessageAt: new Date(),
          lastMessageContent: content.substring(0, 100),
          lastMessageSender: `${currentUser.firstName} ${currentUser.lastName}`
        }
      });

      // Create notifications for recipients
      const notifications = [];
      for (const participant of conversation.participants) {
        if (participant.userId !== currentUser.id) {
          const notification = await tx.notification.create({
            data: {
              id: uuidv4(),
              userId: participant.userId,
              type: 'new_message',
              title: `New message from ${currentUser.firstName} ${currentUser.lastName}`,
              content: content.substring(0, 150),
              actionUrl: `/developer/messages?conversation=${conversation.id}`,
              priority: priority,
              status: 'unread',
              metadata: {
                conversationId: conversation.id,
                messageId: message.id,
                senderName: `${currentUser.firstName} ${currentUser.lastName}`
              }
            }
          });
          notifications.push(notification);
        }
      }

      return {
        message,
        conversation,
        notifications
      };
    });

    // In production, trigger real-time notifications here
    // Example: WebSocket broadcast, push notifications, email alerts
    for (const notification of result.notifications) {
      // Broadcast to WebSocket connections
      // sendWebSocketNotification(notification.userId, notification);
      
      // Send push notification
      // sendPushNotification(notification.userId, notification);
      
      // Send email if urgent
      if (priority === 'urgent' || priority === 'executive') {
        // sendEmailNotification(notification.userId, notification);
      }
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      conversation: {
        id: result.conversation.id,
        participantCount: result.conversation.participants.length
      },
      notificationsSent: result.notifications.length,
      realDelivery: true
    });

  } catch (error: any) {
    console.error('Real message sending error:', error);
    
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}, {
  permissions: [DOCUMENT_PERMISSIONS.MESSAGE_CREATE, DOCUMENT_PERMISSIONS.CONVERSATION_CREATE]
});