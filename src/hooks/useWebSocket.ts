// React hook for WebSocket messaging integration
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { getWebSocketClient, WebSocketEventHandlers } from '@/lib/websocket-client';

interface UseWebSocketOptions {
  userId?: string;
  autoConnect?: boolean;
  onNewMessage?: (message: any) => void;
  onUserStatusChange?: (data: { userId: string; status: 'online' | 'offline' }) => void;
  onTypingIndicator?: (data: { userId: string; conversationId: string; isTyping: boolean }) => void;
  onConversationUpdated?: (conversation: any) => void;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  connectionState: number;
  sendMessage: (conversationId: string, content: string, messageType?: string) => boolean;
  markMessageAsRead: (messageId: string, conversationId: string) => boolean;
  sendTypingIndicator: (conversationId: string, isTyping: boolean) => boolean;
  joinConversation: (conversationId: string) => boolean;
  leaveConversation: (conversationId: string) => boolean;
  connect: (userId?: string) => void;
  disconnect: () => void;
  connectedUsers: string[];
  lastMessage: any;
  connectionError: Error | null;
}

export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
  const {
    userId,
    autoConnect = true,
    onNewMessage,
    onUserStatusChange,
    onTypingIndicator,
    onConversationUpdated
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState(WebSocket.CLOSED);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [connectionError, setConnectionError] = useState<Error | null>(null);
  
  const wsClientRef = useRef(getWebSocketClient());
  const currentConversationRef = useRef<string | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Setup event handlers
  useEffect(() => {
    const wsClient = wsClientRef.current;

    const handlers: WebSocketEventHandlers = {
      onConnected: () => {
        console.log('[useWebSocket] Connected to messaging server');
        setIsConnected(true);
        setConnectionState(WebSocket.OPEN);
        setConnectionError(null);
      },

      onDisconnected: () => {
        console.log('[useWebSocket] Disconnected from messaging server');
        setIsConnected(false);
        setConnectionState(WebSocket.CLOSED);
      },

      onError: (error: Error) => {
        console.error('[useWebSocket] Connection error:', error);
        setConnectionError(error);
        setIsConnected(false);
      },

      onNewMessage: (message: any) => {
        console.log('[useWebSocket] New message received:', message);
        setLastMessage(message);
        onNewMessage?.(message);
      },

      onUserStatusChange: (data: { userId: string; status: 'online' | 'offline' }) => {
        console.log('[useWebSocket] User status change:', data);
        setConnectedUsers(prev => {
          if (data.status === 'online') {
            return prev.includes(data.userId) ? prev : [...prev, data.userId];
          } else {
            return prev.filter(id => id !== data.userId);
          }
        });
        onUserStatusChange?.(data);
      },

      onUserTyping: (data: { userId: string; conversationId: string; isTyping: boolean }) => {
        console.log('[useWebSocket] Typing indicator:', data);
        onTypingIndicator?.(data);
      },

      onConversationUpdated: (conversation: any) => {
        console.log('[useWebSocket] Conversation updated:', conversation);
        onConversationUpdated?.(conversation);
      },

      onMessageRead: (data: { messageId: string; userId: string }) => {
        console.log('[useWebSocket] Message read:', data);
        // Could trigger message status updates here
      }
    };

    // Register all handlers
    Object.entries(handlers).forEach(([event, handler]) => {
      if (handler) {
        wsClient.on(event as keyof WebSocketEventHandlers, handler);
      }
    });

    // Auto-connect if specified
    if (autoConnect && userId) {
      wsClient.connect(userId);
    }

    // Cleanup on unmount
    return () => {
      Object.keys(handlers).forEach(event => {
        wsClient.off(event as keyof WebSocketEventHandlers);
      });
    };
  }, [userId, autoConnect, onNewMessage, onUserStatusChange, onTypingIndicator, onConversationUpdated]);

  // Connection methods
  const connect = useCallback((connectUserId?: string) => {
    const wsClient = wsClientRef.current;
    const targetUserId = connectUserId || userId;
    
    if (targetUserId) {
      wsClient.connect(targetUserId);
    } else {
      console.warn('[useWebSocket] Cannot connect - no user ID provided');
    }
  }, [userId]);

  const disconnect = useCallback(() => {
    const wsClient = wsClientRef.current;
    wsClient.disconnect();
    setIsConnected(false);
    setConnectionState(WebSocket.CLOSED);
  }, []);

  // Messaging methods
  const sendMessage = useCallback((conversationId: string, content: string, messageType: string = 'text') => {
    const wsClient = wsClientRef.current;
    return wsClient.sendMessage(conversationId, content, messageType);
  }, []);

  const markMessageAsRead = useCallback((messageId: string, conversationId: string) => {
    const wsClient = wsClientRef.current;
    return wsClient.markMessageAsRead(messageId, conversationId);
  }, []);

  const sendTypingIndicator = useCallback((conversationId: string, isTyping: boolean) => {
    const wsClient = wsClientRef.current;
    
    // Clear any existing typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Send typing indicator
    const success = wsClient.sendTypingIndicator(conversationId, isTyping);

    // If starting to type, set timeout to automatically stop typing indicator
    if (isTyping && success) {
      typingTimeoutRef.current = setTimeout(() => {
        wsClient.sendTypingIndicator(conversationId, false);
      }, 3000); // Stop typing indicator after 3 seconds
    }

    return success;
  }, []);

  const joinConversation = useCallback((conversationId: string) => {
    const wsClient = wsClientRef.current;
    currentConversationRef.current = conversationId;
    return wsClient.joinConversation(conversationId);
  }, []);

  const leaveConversation = useCallback((conversationId: string) => {
    const wsClient = wsClientRef.current;
    if (currentConversationRef.current === conversationId) {
      currentConversationRef.current = null;
    }
    return wsClient.leaveConversation(conversationId);
  }, []);

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return {
    isConnected,
    connectionState,
    sendMessage,
    markMessageAsRead,
    sendTypingIndicator,
    joinConversation,
    leaveConversation,
    connect,
    disconnect,
    connectedUsers,
    lastMessage,
    connectionError
  };
}

// Helper hook for typing indicators
export function useTypingIndicator(conversationId: string, sendTypingIndicator: (conversationId: string, isTyping: boolean) => boolean) {
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startTyping = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true);
      sendTypingIndicator(conversationId, true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTypingIndicator(conversationId, false);
    }, 1000);
  }, [conversationId, isTyping, sendTypingIndicator]);

  const stopTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (isTyping) {
      setIsTyping(false);
      sendTypingIndicator(conversationId, false);
    }
  }, [conversationId, isTyping, sendTypingIndicator]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return {
    isTyping,
    startTyping,
    stopTyping
  };
}