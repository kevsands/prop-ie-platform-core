// WebSocket server for real-time messaging
import { NextRequest } from 'next/server';
import { WebSocketServer } from 'ws';

// Store active connections
const clients = new Map<string, WebSocket>();
const userSessions = new Map<string, { userId: string; conversations: Set<string> }>();

interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: string;
  userId?: string;
  conversationId?: string;
}

// WebSocket upgrade handler
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');

  if (!userId) {
    return new Response('User ID required', { status: 400 });
  }

  // Check if this is a WebSocket upgrade request
  const upgrade = request.headers.get('upgrade');
  if (upgrade !== 'websocket') {
    return new Response('Expected WebSocket upgrade', { status: 426 });
  }

  try {
    // Create WebSocket server (in production, this would be handled differently)
    const wss = new WebSocketServer({ noServer: true });

    return new Response(null, {
      status: 101,
      headers: {
        'Upgrade': 'websocket',
        'Connection': 'Upgrade',
        'Sec-WebSocket-Accept': generateAcceptKey(request.headers.get('sec-websocket-key') || ''),
      },
    });

  } catch (error) {
    console.error('[WebSocket] Upgrade error:', error);
    return new Response('WebSocket upgrade failed', { status: 500 });
  }
}

// Helper function to generate WebSocket accept key
function generateAcceptKey(key: string): string {
  const crypto = require('crypto');
  const WEBSOCKET_MAGIC_STRING = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
  return crypto
    .createHash('sha1')
    .update(key + WEBSOCKET_MAGIC_STRING)
    .digest('base64');
}

// WebSocket connection handler (this would typically be in a separate server file)
export class WebSocketHandler {
  private wss: WebSocketServer;

  constructor() {
    this.wss = new WebSocketServer({ port: 8080 });
    this.setupWebSocketServer();
  }

  private setupWebSocketServer() {
    this.wss.on('connection', (ws: WebSocket, request: any) => {
      const url = new URL(request.url, 'http://localhost');
      const userId = url.searchParams.get('userId');

      if (!userId) {
        ws.close(1000, 'User ID required');
        return;
      }

      console.log(`[WebSocket] User ${userId} connected`);

      // Store client connection
      clients.set(userId, ws);
      userSessions.set(userId, {
        userId,
        conversations: new Set()
      });

      // Notify other users that this user is online
      this.broadcastUserStatus(userId, 'online');

      // Handle incoming messages
      ws.on('message', (data: Buffer) => {
        try {
          const message: WebSocketMessage = JSON.parse(data.toString());
          this.handleMessage(userId, message);
        } catch (error) {
          console.error('[WebSocket] Invalid message format:', error);
        }
      });

      // Handle disconnection
      ws.on('close', () => {
        console.log(`[WebSocket] User ${userId} disconnected`);
        clients.delete(userId);
        userSessions.delete(userId);
        this.broadcastUserStatus(userId, 'offline');
      });

      // Handle errors
      ws.on('error', (error) => {
        console.error(`[WebSocket] Error for user ${userId}:`, error);
      });

      // Send welcome message
      this.sendToUser(userId, {
        type: 'connected',
        payload: { message: 'Connected to PROP.ie messaging server' },
        timestamp: new Date().toISOString()
      });
    });
  }

  private handleMessage(userId: string, message: WebSocketMessage) {
    console.log(`[WebSocket] Message from ${userId}:`, message.type);

    switch (message.type) {
      case 'heartbeat':
        // Respond to heartbeat
        this.sendToUser(userId, {
          type: 'heartbeat_ack',
          payload: {},
          timestamp: new Date().toISOString()
        });
        break;

      case 'join_conversation':
        this.handleJoinConversation(userId, message.payload.conversationId);
        break;

      case 'leave_conversation':
        this.handleLeaveConversation(userId, message.payload.conversationId);
        break;

      case 'send_message':
        this.handleSendMessage(userId, message.payload);
        break;

      case 'mark_read':
        this.handleMarkRead(userId, message.payload);
        break;

      case 'typing':
        this.handleTypingIndicator(userId, message.payload);
        break;

      default:
        console.warn(`[WebSocket] Unknown message type: ${message.type}`);
    }
  }

  private handleJoinConversation(userId: string, conversationId: string) {
    const session = userSessions.get(userId);
    if (session) {
      session.conversations.add(conversationId);
      console.log(`[WebSocket] User ${userId} joined conversation ${conversationId}`);
    }
  }

  private handleLeaveConversation(userId: string, conversationId: string) {
    const session = userSessions.get(userId);
    if (session) {
      session.conversations.delete(conversationId);
      console.log(`[WebSocket] User ${userId} left conversation ${conversationId}`);
    }
  }

  private async handleSendMessage(userId: string, payload: any) {
    const { conversationId, content, messageType } = payload;

    // In production, save message to database here
    const newMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      conversationId,
      senderId: userId,
      content,
      messageType,
      timestamp: new Date().toISOString()
    };

    // Broadcast to all users in the conversation
    this.broadcastToConversation(conversationId, {
      type: 'new_message',
      payload: newMessage,
      timestamp: new Date().toISOString()
    });
  }

  private handleMarkRead(userId: string, payload: any) {
    const { messageId, conversationId } = payload;

    // Broadcast read status to conversation participants
    this.broadcastToConversation(conversationId, {
      type: 'message_read',
      payload: {
        messageId,
        userId,
        readAt: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    });
  }

  private handleTypingIndicator(userId: string, payload: any) {
    const { conversationId, isTyping } = payload;

    // Broadcast typing indicator to other conversation participants
    this.broadcastToConversation(conversationId, {
      type: 'user_typing',
      payload: {
        userId,
        conversationId,
        isTyping
      },
      timestamp: new Date().toISOString()
    }, userId); // Exclude the sender
  }

  private sendToUser(userId: string, message: WebSocketMessage) {
    const client = clients.get(userId);
    if (client && client.readyState === 1) { // OPEN
      client.send(JSON.stringify(message));
    }
  }

  private broadcastUserStatus(userId: string, status: 'online' | 'offline') {
    const message: WebSocketMessage = {
      type: `user_${status}`,
      payload: { userId },
      timestamp: new Date().toISOString()
    };

    // Broadcast to all connected users
    for (const [clientUserId, client] of clients) {
      if (clientUserId !== userId && client.readyState === 1) {
        client.send(JSON.stringify(message));
      }
    }
  }

  private broadcastToConversation(conversationId: string, message: WebSocketMessage, excludeUserId?: string) {
    // Find all users in this conversation
    const participantIds: string[] = [];
    
    for (const [userId, session] of userSessions) {
      if (session.conversations.has(conversationId) && userId !== excludeUserId) {
        participantIds.push(userId);
      }
    }

    // Send message to all participants
    for (const userId of participantIds) {
      this.sendToUser(userId, message);
    }

    console.log(`[WebSocket] Broadcasted ${message.type} to ${participantIds.length} users in conversation ${conversationId}`);
  }

  public getConnectedUsers(): string[] {
    return Array.from(clients.keys());
  }

  public getConversationParticipants(conversationId: string): string[] {
    const participants: string[] = [];
    for (const [userId, session] of userSessions) {
      if (session.conversations.has(conversationId)) {
        participants.push(userId);
      }
    }
    return participants;
  }
}

// Export the handler for external use
// export { WebSocketHandler }; // Already exported above