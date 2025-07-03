// WebSocket client for real-time messaging notifications
'use client';

interface WebSocketMessage {
  type: 'new_message' | 'message_read' | 'user_typing' | 'user_online' | 'user_offline' | 'conversation_updated';
  payload: any;
  timestamp: string;
  userId?: string;
  conversationId?: string;
}

interface WebSocketEventHandlers {
  onNewMessage?: (message: any) => void;
  onMessageRead?: (data: { messageId: string; userId: string }) => void;
  onUserTyping?: (data: { userId: string; conversationId: string; isTyping: boolean }) => void;
  onUserStatusChange?: (data: { userId: string; status: 'online' | 'offline' }) => void;
  onConversationUpdated?: (conversation: any) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
  onError?: (error: Error) => void;
}

class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private eventHandlers: WebSocketEventHandlers = {};
  private isConnected = false;
  private currentUserId: string | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.connect();
  }

  connect(userId?: string) {
    if (userId) {
      this.currentUserId = userId;
    }

    try {
      // In production, this would be wss://your-domain.com/api/ws
      const wsUrl = `ws://localhost:3000/api/ws?userId=${this.currentUserId || 'developer_001'}`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('[WebSocket] Connected to messaging server');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        this.eventHandlers.onConnected?.();
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('[WebSocket] Failed to parse message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('[WebSocket] Connection closed');
        this.isConnected = false;
        this.stopHeartbeat();
        this.eventHandlers.onDisconnected?.();
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('[WebSocket] Connection error:', error);
        this.eventHandlers.onError?.(new Error('WebSocket connection error'));
      };

    } catch (error) {
      console.error('[WebSocket] Failed to connect:', error);
      this.eventHandlers.onError?.(error as Error);
    }
  }

  private handleMessage(message: WebSocketMessage) {
    console.log('[WebSocket] Received message:', message);

    switch (message.type) {
      case 'new_message':
        this.eventHandlers.onNewMessage?.(message.payload);
        break;
      case 'message_read':
        this.eventHandlers.onMessageRead?.(message.payload);
        break;
      case 'user_typing':
        this.eventHandlers.onUserTyping?.(message.payload);
        break;
      case 'user_online':
      case 'user_offline':
        this.eventHandlers.onUserStatusChange?.({
          userId: message.payload.userId,
          status: message.type === 'user_online' ? 'online' : 'offline'
        });
        break;
      case 'conversation_updated':
        this.eventHandlers.onConversationUpdated?.(message.payload);
        break;
    }
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected && this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'heartbeat', timestamp: new Date().toISOString() }));
      }
    }, 30000); // Send heartbeat every 30 seconds
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`[WebSocket] Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.error('[WebSocket] Max reconnection attempts reached');
      this.eventHandlers.onError?.(new Error('Failed to reconnect after maximum attempts'));
    }
  }

  // Public methods
  public on(event: keyof WebSocketEventHandlers, handler: any) {
    this.eventHandlers[event] = handler;
  }

  public off(event: keyof WebSocketEventHandlers) {
    delete this.eventHandlers[event];
  }

  public sendMessage(conversationId: string, content: string, messageType: string = 'text') {
    if (!this.isConnected || !this.ws) {
      console.warn('[WebSocket] Cannot send message - not connected');
      return false;
    }

    const message = {
      type: 'send_message',
      payload: {
        conversationId,
        content,
        messageType,
        timestamp: new Date().toISOString()
      }
    };

    this.ws.send(JSON.stringify(message));
    return true;
  }

  public markMessageAsRead(messageId: string, conversationId: string) {
    if (!this.isConnected || !this.ws) {
      return false;
    }

    const message = {
      type: 'mark_read',
      payload: {
        messageId,
        conversationId,
        timestamp: new Date().toISOString()
      }
    };

    this.ws.send(JSON.stringify(message));
    return true;
  }

  public sendTypingIndicator(conversationId: string, isTyping: boolean) {
    if (!this.isConnected || !this.ws) {
      return false;
    }

    const message = {
      type: 'typing',
      payload: {
        conversationId,
        isTyping,
        timestamp: new Date().toISOString()
      }
    };

    this.ws.send(JSON.stringify(message));
    return true;
  }

  public joinConversation(conversationId: string) {
    if (!this.isConnected || !this.ws) {
      return false;
    }

    const message = {
      type: 'join_conversation',
      payload: {
        conversationId,
        timestamp: new Date().toISOString()
      }
    };

    this.ws.send(JSON.stringify(message));
    return true;
  }

  public leaveConversation(conversationId: string) {
    if (!this.isConnected || !this.ws) {
      return false;
    }

    const message = {
      type: 'leave_conversation',
      payload: {
        conversationId,
        timestamp: new Date().toISOString()
      }
    };

    this.ws.send(JSON.stringify(message));
    return true;
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.stopHeartbeat();
    this.isConnected = false;
  }

  public get connected() {
    return this.isConnected;
  }

  public get connectionState() {
    return this.ws?.readyState || WebSocket.CLOSED;
  }
}

// Singleton instance
let wsClient: WebSocketClient | null = null;

export function getWebSocketClient(): WebSocketClient {
  if (!wsClient) {
    wsClient = new WebSocketClient();
  }
  return wsClient;
}

export function createWebSocketClient(): WebSocketClient {
  return new WebSocketClient();
}

export type { WebSocketMessage, WebSocketEventHandlers };