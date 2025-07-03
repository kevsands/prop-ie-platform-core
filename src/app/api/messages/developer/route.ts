// Real Developer Messages API with Database Integration and Authentication
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { withAuth, DOCUMENT_PERMISSIONS } from '@/lib/middleware/auth-middleware';

const prisma = new PrismaClient();

// GET /api/messages/developer - Get conversations or messages for developer
export const GET = withAuth(async (request: NextRequest, user) => {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    const type = searchParams.get('type'); // 'conversations' or 'messages'
    const filter = searchParams.get('filter') || 'all';
    const project = searchParams.get('project') || 'all';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    console.log(`[DEVELOPER API] Getting ${type || 'conversations'} for user ${user.id} with filter: ${filter}, project: ${project}`);

    // Use authenticated user ID
    const currentUserId = user.id;

    if (type === 'messages' && conversationId) {
      // Get messages for specific conversation
      const messages = await prisma.message.findMany({
        where: {
          conversationId: conversationId,
          conversation: {
            participants: {
              some: {
                userId: currentUserId
              }
            }
          }
        },
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true
            }
          },
          attachments: true,
          readReceipts: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'asc'
        },
        skip: offset,
        take: limit
      });

      // Transform to API format
      const formattedMessages = messages.map(message => ({
        id: message.id,
        conversationId: message.conversationId,
        senderId: message.senderId,
        senderName: message.senderName,
        senderRole: message.senderRole || 'DEVELOPER',
        content: message.content,
        messageType: message.messageType.toLowerCase(),
        priority: message.priority.toLowerCase(),
        status: message.status.toLowerCase(),
        createdAt: message.createdAt.toISOString(),
        updatedAt: message.updatedAt.toISOString(),
        readBy: message.readReceipts.map(receipt => ({
          userId: receipt.userId,
          readAt: receipt.readAt.toISOString()
        })),
        attachments: message.attachments.map(att => ({
          id: att.id,
          fileName: att.fileName,
          fileType: att.fileType,
          fileSize: Number(att.fileSize),
          url: att.fileUrl || `/attachments/${att.fileName}`
        })),
        metadata: message.metadata || {}
      }));

      return NextResponse.json({
        success: true,
        messages: formattedMessages,
        pagination: {
          total: formattedMessages.length,
          limit,
          offset,
          hasMore: formattedMessages.length === limit
        },
        realData: true
      });
    }

    // Get conversations for developer
    const whereClause: any = {
      participants: {
        some: {
          userId: currentUserId
        }
      }
    };

    // Apply filters
    if (filter !== 'all') {
      switch (filter) {
        case 'team':
          whereClause.conversationType = 'TEAM_COMMUNICATION';
          break;
        case 'buyers':
          whereClause.conversationType = 'BUYER_QUERY';
          break;
        case 'approvals':
          whereClause.OR = [
            { conversationType: 'APPROVAL_REQUEST' },
            { requiresApproval: true }
          ];
          break;
        case 'urgent':
          whereClause.OR = [
            { priority: 'URGENT' },
            { priority: 'EXECUTIVE' }
          ];
          break;
        case 'meetings':
          whereClause.conversationType = 'MEETING_DISCUSSION';
          break;
      }
    }

    if (project !== 'all') {
      whereClause.projectId = project;
    }

    const conversations = await prisma.conversation.findMany({
      where: whereClause,
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true
              }
            }
          }
        },
        project: {
          select: {
            id: true,
            name: true
          }
        },
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1,
          include: {
            sender: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        _count: {
          select: {
            messages: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      },
      skip: offset,
      take: limit
    });

    // Get unread counts for each conversation
    const unreadCounts = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conv.id,
            senderId: { not: currentUserId },
            readReceipts: {
              none: {
                userId: currentUserId
              }
            }
          }
        });
        return { conversationId: conv.id, unreadCount };
      })
    );

    // Transform to API format
    const formattedConversations = conversations.map(conv => {
      const unreadData = unreadCounts.find(u => u.conversationId === conv.id);
      const lastMessage = conv.messages[0];
      
      return {
        id: conv.id,
        title: conv.title,
        conversationType: conv.conversationType.toLowerCase(),
        projectId: conv.projectId,
        projectName: conv.project?.name,
        participants: conv.participants.map(p => ({
          userId: p.userId,
          userName: `${p.user.firstName} ${p.user.lastName}`,
          userRole: p.user.role || 'USER',
          teamRole: p.role.toLowerCase(),
          joinedAt: p.joinedAt.toISOString(),
          lastSeenAt: p.lastSeenAt?.toISOString()
        })),
        lastMessage: lastMessage ? {
          content: lastMessage.content.substring(0, 100),
          senderName: lastMessage.senderName,
          timestamp: lastMessage.createdAt.toISOString()
        } : null,
        messageCount: conv._count.messages,
        unreadCount: unreadData?.unreadCount || 0,
        status: conv.status.toLowerCase(),
        priority: conv.priority.toLowerCase(),
        createdAt: conv.createdAt.toISOString(),
        updatedAt: conv.updatedAt.toISOString(),
        metadata: {
          ...(conv.metadata as any || {}),
          approvalRequired: conv.requiresApproval,
          executiveAttention: conv.priority === 'EXECUTIVE'
        }
      };
    });

    // Calculate summary statistics
    const allConversations = await prisma.conversation.count({
      where: {
        participants: {
          some: {
            userId: currentUserId
          }
        }
      }
    });

    const summary = {
      total: allConversations,
      team: await prisma.conversation.count({
        where: {
          conversationType: 'TEAM_COMMUNICATION',
          participants: { some: { userId: currentUserId } }
        }
      }),
      buyers: await prisma.conversation.count({
        where: {
          conversationType: 'BUYER_QUERY',
          participants: { some: { userId: currentUserId } }
        }
      }),
      approvals: await prisma.conversation.count({
        where: {
          OR: [
            { conversationType: 'APPROVAL_REQUEST' },
            { requiresApproval: true }
          ],
          participants: { some: { userId: currentUserId } }
        }
      }),
      urgent: await prisma.conversation.count({
        where: {
          OR: [
            { priority: 'URGENT' },
            { priority: 'EXECUTIVE' }
          ],
          participants: { some: { userId: currentUserId } }
        }
      }),
      meetings: await prisma.conversation.count({
        where: {
          conversationType: 'MEETING_DISCUSSION',
          participants: { some: { userId: currentUserId } }
        }
      }),
      totalUnread: unreadCounts.reduce((sum, u) => sum + u.unreadCount, 0)
    };

    return NextResponse.json({
      success: true,
      conversations: formattedConversations,
      pagination: {
        total: allConversations,
        limit,
        offset,
        hasMore: offset + limit < allConversations
      },
      summary,
      realData: true
    });

  } catch (error: any) {
    console.error('Developer Messages API error:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch developer messages' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}, {
  permissions: [DOCUMENT_PERMISSIONS.CONVERSATION_READ, DOCUMENT_PERMISSIONS.MESSAGE_READ]
});

// POST /api/messages/developer - Send new developer message
export const POST = withAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    const { conversationId, recipientIds, subject, content, messageType = 'TEXT', priority = 'NORMAL', metadata } = body;

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

    // Use authenticated user
    const currentUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.roles[0] || 'USER' // Take first role as primary
    };

    console.log(`[DEVELOPER API] Sending message to conversation ${conversationId}`);

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      let conversation;

      if (conversationId) {
        // Find existing conversation
        conversation = await tx.conversation.findUnique({
          where: { id: conversationId },
          include: { participants: true }
        });
      } else {
        // Create new conversation
        conversation = await tx.conversation.create({
          data: {
            title: subject || `Developer Communication - ${new Date().toLocaleDateString()}`,
            conversationType: 'TEAM_COMMUNICATION',
            status: 'ACTIVE',
            priority: priority.toUpperCase(),
            createdById: currentUser.id,
            metadata: metadata || {},
            participants: {
              create: [
                {
                  userId: currentUser.id,
                  role: 'LEAD'
                },
                ...(recipientIds || []).map((recipientId: string) => ({
                  userId: recipientId,
                  role: 'MEMBER'
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
          conversationId: conversation.id,
          senderId: currentUser.id,
          senderName: `${currentUser.firstName} ${currentUser.lastName}`,
          senderRole: currentUser.role || 'DEVELOPER',
          content,
          messageType: messageType.toUpperCase(),
          priority: priority.toUpperCase(),
          status: 'SENT',
          metadata: metadata || {}
        }
      });

      // Update conversation timestamp
      await tx.conversation.update({
        where: { id: conversation.id },
        data: {
          lastMessageAt: new Date(),
          lastMessageContent: content.substring(0, 100),
          lastMessageSender: `${currentUser.firstName} ${currentUser.lastName}`,
          updatedAt: new Date()
        }
      });

      // Create notifications for other participants
      const notifications = [];
      for (const participant of conversation.participants) {
        if (participant.userId !== currentUser.id) {
          const notification = await tx.notification.create({
            data: {
              userId: participant.userId,
              type: 'NEW_MESSAGE',
              title: `New message from ${currentUser.firstName} ${currentUser.lastName}`,
              content: content.substring(0, 150),
              actionUrl: `/developer/messages?conversation=${conversation.id}`,
              priority: priority.toUpperCase(),
              status: 'UNREAD',
              conversationId: conversation.id,
              messageId: message.id,
              metadata: {
                senderName: `${currentUser.firstName} ${currentUser.lastName}`,
                conversationType: conversation.conversationType
              }
            }
          });
          notifications.push(notification);
        }
      }

      return { message, conversation, notifications };
    });

    return NextResponse.json({
      success: true,
      message: {
        id: result.message.id,
        conversationId: result.message.conversationId,
        content: result.message.content,
        createdAt: result.message.createdAt.toISOString()
      },
      conversation: {
        id: result.conversation.id,
        participantCount: result.conversation.participants.length
      },
      notificationsSent: result.notifications.length,
      realData: true
    });

  } catch (error: any) {
    console.error('Send developer message error:', error);
    
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