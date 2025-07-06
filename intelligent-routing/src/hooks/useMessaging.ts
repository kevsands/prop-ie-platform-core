'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/hooks/useAuth';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  attachments?: MessageAttachment[];
  replyTo?: string;
  edited?: boolean;
  editedAt?: Date;
  reactions?: MessageReaction[];
}

interface MessageAttachment {
  id: string;
  type: 'image' | 'document' | 'audio' | 'video';
  url: string;
  name: string;
  size: number;
  mimeType: string;
  thumbnail?: string;
}

interface MessageReaction {
  userId: string;
  emoji: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  type: 'direct' | 'group' | 'channel';
  name?: string;
  participants: ConversationParticipant[];
  lastMessage?: Message;
  unreadCount: number;
  lastActivity: Date;
  pinned: boolean;
  muted: boolean;
  archived: boolean;
  metadata?: {
    propertyId?: string;
    transactionId?: string;
    [key: string]: any;
  };
}

interface ConversationParticipant {
  userId: string;
  name: string;
  avatar?: string;
  role?: string;
  status: 'online' | 'away' | 'offline';
  lastSeen?: Date;
  isAdmin?: boolean;
}

interface SendMessageData {
  conversationId: string;
  text: string;
  attachments?: MessageAttachment[];
  replyTo?: string;
}

export const useMessaging = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!user) return;

    const socket = io(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001', {
      auth: { token: user.accessToken },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Connected to messaging service');
      socket.emit('join-user-room', user.id);
    });

    socket.on('message', (message: Message) => {
      handleNewMessage(message);
    });

    socket.on('message-status', ({ messageId, status }: { messageId: string; status: string }) => {
      updateMessageStatus(messageId, status as Message['status']);
    });

    socket.on('typing', ({ conversationId, userId, isTyping }: any) => {
      if (userId !== user.id) {
        setTyping(prev => ({ ...prev, [conversationId]: isTyping }));
      }
    });

    socket.on('conversation-update', (conversation: Conversation) => {
      setConversations(prev =>
        prev.map(c => c.id === conversation.id ? conversation : c)
      );
    });

    socket.on('user-status', ({ userId, status }: { userId: string; status: string }) => {
      updateUserStatus(userId, status);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [user]);

  // Fetch initial data
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  // Fetch conversations
  const fetchConversations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/conversations', {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      });
      const data = await response.json();
      setConversations(data.conversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a conversation
  const fetchMessages = async (conversationId: string, limit = 50, offset = 0) => {
    try {
      const response = await fetch(
        `/api/conversations/${conversationId}/messages?limit=${limit}&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      );
      const data = await response.json();
      return data.messages;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  };

  // Load conversation and its messages
  const loadConversation = async (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    setActiveConversation(conversation);
    const messages = await fetchMessages(conversationId);
    setMessages(messages);
    
    // Mark messages as read
    markAsRead(conversationId);
    
    // Join conversation room
    socketRef.current?.emit('join-conversation', conversationId);
  };

  // Handle new incoming message
  const handleNewMessage = (message: Message) => {
    // Update messages if it's for the active conversation
    if (message.conversationId === activeConversation?.id) {
      setMessages(prev => [...prev, message]);
      markAsRead(message.conversationId);
    }

    // Update conversation list
    setConversations(prev => {
      const updatedConversations = prev.map(conv => {
        if (conv.id === message.conversationId) {
          return {
            ...conv,
            lastMessage: message,
            lastActivity: message.timestamp,
            unreadCount: message.conversationId === activeConversation?.id
              ? conv.unreadCount
              : conv.unreadCount + 1,
          };
        }
        return conv;
      });

      // Sort by last activity
      return updatedConversations.sort((a, b) => 
        new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
      );
    });
  };

  // Send a message
  const sendMessage = async (data: SendMessageData) => {
    const tempId = `temp-${Date.now()}`;
    const tempMessage: Message = {
      id: tempId,
      conversationId: data.conversationId,
      senderId: user!.id,
      text: data.text,
      timestamp: new Date(),
      status: 'sending',
      attachments: data.attachments,
      replyTo: data.replyTo,
    };

    // Optimistically add message
    setMessages(prev => [...prev, tempMessage]);

    try {
      const response = await fetch(`/api/conversations/${data.conversationId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const sentMessage = await response.json();
      
      // Replace temp message with real one
      setMessages(prev =>
        prev.map(m => m.id === tempId ? sentMessage : m)
      );

      // Emit to socket
      socketRef.current?.emit('message', sentMessage);

      return sentMessage;
    } catch (error) {
      // Mark message as failed
      setMessages(prev =>
        prev.map(m => m.id === tempId ? { ...m, status: 'failed' as any } : m)
      );
      throw error;
    }
  };

  // Update message status
  const updateMessageStatus = (messageId: string, status: Message['status']) => {
    setMessages(prev =>
      prev.map(m => m.id === messageId ? { ...m, status } : m)
    );
  };

  // Mark messages as read
  const markAsRead = async (conversationId: string) => {
    try {
      await fetch(`/api/conversations/${conversationId}/read`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      });

      // Update conversation unread count
      setConversations(prev =>
        prev.map(c => c.id === conversationId ? { ...c, unreadCount: 0 } : c)
      );

      // Update message statuses
      setMessages(prev =>
        prev.map(m => 
          m.conversationId === conversationId && m.senderId !== user?.id
            ? { ...m, status: 'read' as Message['status'] }
            : m
        )
      );
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  // Set typing indicator
  const setTypingIndicator = (conversationId: string, isTyping: boolean) => {
    socketRef.current?.emit('typing', { conversationId, isTyping });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to clear typing after 3 seconds
    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current?.emit('typing', { conversationId, isTyping: false });
      }, 3000);
    }
  };

  // Search messages
  const searchMessages = async (query: string, conversationId?: string) => {
    try {
      const url = conversationId
        ? `/api/conversations/${conversationId}/search?q=${encodeURIComponent(query)}`
        : `/api/messages/search?q=${encodeURIComponent(query)}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      });

      const data = await response.json();
      return data.messages;
    } catch (error) {
      console.error('Error searching messages:', error);
      throw error;
    }
  };

  // Create a new conversation
  const createConversation = async (
    participantIds: string[],
    type: Conversation['type'] = 'direct',
    name?: string,
    metadata?: any
  ) => {
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ participantIds, type, name, metadata }),
      });

      const conversation = await response.json();
      setConversations(prev => [conversation, ...prev]);
      return conversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  };

  // Add reaction to a message
  const addReaction = async (messageId: string, emoji: string) => {
    try {
      await fetch(`/api/messages/${messageId}/reactions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emoji }),
      });

      // Update message locally
      setMessages(prev =>
        prev.map(m => {
          if (m.id === messageId) {
            const existingReaction = m.reactions?.find(r => r.userId === user?.id);
            if (existingReaction) {
              return {
                ...m,
                reactions: m.reactions?.map(r =>
                  r.userId === user?.id ? { ...r, emoji } : r
                ),
              };
            }
            return {
              ...m,
              reactions: [
                ...(m.reactions || []),
                { userId: user!.id, emoji, timestamp: new Date() },
              ],
            };
          }
          return m;
        })
      );
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  // Remove reaction from a message
  const removeReaction = async (messageId: string) => {
    try {
      await fetch(`/api/messages/${messageId}/reactions`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      });

      // Update message locally
      setMessages(prev =>
        prev.map(m => {
          if (m.id === messageId) {
            return {
              ...m,
              reactions: m.reactions?.filter(r => r.userId !== user?.id),
            };
          }
          return m;
        })
      );
    } catch (error) {
      console.error('Error removing reaction:', error);
    }
  };

  // Edit a message
  const editMessage = async (messageId: string, newText: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newText }),
      });

      const updatedMessage = await response.json();

      // Update message locally
      setMessages(prev =>
        prev.map(m => m.id === messageId ? updatedMessage : m)
      );

      return updatedMessage;
    } catch (error) {
      console.error('Error editing message:', error);
      throw error;
    }
  };

  // Delete a message
  const deleteMessage = async (messageId: string) => {
    try {
      await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      });

      // Remove message locally
      setMessages(prev => prev.filter(m => m.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  };

  // Upload attachment
  const uploadAttachment = async (file: File): Promise<MessageAttachment> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/uploads', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();
      return data.attachment;
    } catch (error) {
      console.error('Error uploading attachment:', error);
      throw error;
    }
  };

  // Update user status
  const updateUserStatus = (userId: string, status: string) => {
    setConversations(prev =>
      prev.map(conv => ({
        ...conv,
        participants: conv.participants.map(p =>
          p.userId === userId ? { ...p, status: status as any } : p
        ),
      }))
    );
  };

  return {
    conversations,
    activeConversation,
    messages,
    typing,
    loading,
    error,
    fetchConversations,
    loadConversation,
    sendMessage,
    markAsRead,
    searchMessages,
    createConversation,
    addReaction,
    removeReaction,
    editMessage,
    deleteMessage,
    uploadAttachment,
    setTyping: setTypingIndicator,
  };
};