'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Paperclip, 
  MoreVertical, 
  Search, 
  Filter, 
  Archive, 
  Star, 
  Clock,
  CheckCircle,
  Eye,
  Phone,
  Video,
  Plus,
  ArrowLeft,
  Users,
  Settings,
  X,
  Download,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'buyer' | 'solicitor' | 'agent' | 'developer' | 'lender' | 'admin';
  content: string;
  messageType: 'text' | 'document' | 'system' | 'task_update' | 'payment_notification';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'sent' | 'delivered' | 'read';
  createdAt: string;
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

interface MessagingInterfaceProps {
  className?: string;
  initialConversationId?: string;
}

export function MessagingInterface({ className = '', initialConversationId }: MessagingInterfaceProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showMobileConversations, setShowMobileConversations] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (initialConversationId && conversations.length > 0) {
      const conversation = conversations.find(c => c.id === initialConversationId);
      if (conversation) {
        setSelectedConversation(conversation);
        fetchMessages(conversation.id);
        setShowMobileConversations(false);
      }
    }
  }, [initialConversationId, conversations]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/messages', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }

      const data = await response.json();
      setConversations(data.conversations || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      setMessagesLoading(true);

      const response = await fetch(`/api/messages?type=messages&conversationId=${conversationId}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data.messages || []);
    } catch (err: any) {
      console.error('Error fetching messages:', err);
    } finally {
      setMessagesLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sendingMessage) {
      return;
    }

    try {
      setSendingMessage(true);

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          content: newMessage.trim(),
          messageType: 'text',
          priority: 'normal'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      // Add the new message to the messages list
      setMessages(prev => [...prev, data.message]);
      setNewMessage('');
      
      // Update conversation last message
      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { 
              ...conv, 
              lastMessage: {
                content: newMessage.trim(),
                senderName: data.message.senderName,
                timestamp: data.message.createdAt
              },
              updatedAt: data.message.createdAt
            }
          : conv
      ));
    } catch (err: any) {
      console.error('Error sending message:', err);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-IE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-IE', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'solicitor':
        return '⚖️';
      case 'agent':
        return '🏘️';
      case 'developer':
        return '🏗️';
      case 'lender':
        return '🏦';
      case 'admin':
        return '🛠️';
      default:
        return '👤';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'solicitor':
        return 'bg-purple-100 text-purple-800';
      case 'agent':
        return 'bg-blue-100 text-blue-800';
      case 'developer':
        return 'bg-green-100 text-green-800';
      case 'lender':
        return 'bg-indigo-100 text-indigo-800';
      case 'admin':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.participants.some(p => p.userName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className={`bg-white rounded-lg border shadow-sm h-[700px] flex ${className}`}>
      {/* Conversations Sidebar */}
      <div className={`w-full md:w-80 border-r flex flex-col ${showMobileConversations ? 'block' : 'hidden md:block'}`}>
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MessageSquare size={20} className="text-blue-600" />
              Messages
            </h2>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Plus size={16} className="text-gray-600" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading conversations...</p>
            </div>
          ) : error ? (
            <div className="p-4 text-center">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">No conversations found</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => {
                    setSelectedConversation(conversation);
                    setShowMobileConversations(false);
                  }}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation?.id === conversation.id ? 'bg-blue-50 border-r-2 border-blue-600' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 truncate text-sm">
                          {conversation.title}
                        </h4>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      
                      {conversation.lastMessage && (
                        <p className="text-sm text-gray-600 truncate">
                          <span className="font-medium">{conversation.lastMessage.senderName}:</span> {conversation.lastMessage.content}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex -space-x-1">
                          {conversation.participants.slice(0, 3).map((participant) => (
                            <div
                              key={participant.userId}
                              className={`w-5 h-5 rounded-full text-xs flex items-center justify-center border border-white ${getRoleColor(participant.userRole)}`}
                              title={participant.userName}
                            >
                              {getRoleIcon(participant.userRole)}
                            </div>
                          ))}
                          {conversation.participants.length > 3 && (
                            <div className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs flex items-center justify-center border border-white">
                              +{conversation.participants.length - 3}
                            </div>
                          )}
                        </div>
                        
                        {conversation.lastMessage && (
                          <span className="text-xs text-gray-500 ml-auto">
                            {formatDate(conversation.lastMessage.timestamp)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className={`flex-1 flex flex-col ${showMobileConversations ? 'hidden md:flex' : 'flex'}`}>
        {selectedConversation ? (
          <>
            {/* Messages Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowMobileConversations(true)}
                    className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedConversation.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Users size={12} className="text-gray-500" />
                      <span className="text-xs text-gray-500">
                        {selectedConversation.participants.length} participants
                      </span>
                      {selectedConversation.metadata?.propertyTitle && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs text-gray-500">
                            {selectedConversation.metadata.propertyTitle}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Phone size={16} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Video size={16} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messagesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">No messages yet</p>
                  <p className="text-xs text-gray-500 mt-1">Start the conversation!</p>
                </div>
              ) : (
                messages.map((message, index) => {
                  const isOwnMessage = message.senderId === 'current_user'; // This would be determined by actual user ID
                  const showDate = index === 0 || 
                    formatDate(message.createdAt) !== formatDate(messages[index - 1].createdAt);
                  
                  return (
                    <div key={message.id}>
                      {showDate && (
                        <div className="text-center my-4">
                          <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                            {formatDate(message.createdAt)}
                          </span>
                        </div>
                      )}
                      
                      <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                          {!isOwnMessage && (
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleColor(message.senderRole)}`}>
                                {getRoleIcon(message.senderRole)} {message.senderName}
                              </span>
                            </div>
                          )}
                          
                          <div className={`rounded-lg p-3 ${
                            isOwnMessage 
                              ? 'bg-blue-600 text-white' 
                              : message.messageType === 'system'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            {message.messageType === 'system' && (
                              <div className="flex items-center gap-2 mb-2">
                                <Settings size={14} />
                                <span className="text-xs font-medium">System Message</span>
                              </div>
                            )}
                            
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-3 space-y-2">
                                {message.attachments.map((attachment) => (
                                  <div key={attachment.id} className={`flex items-center gap-2 p-2 rounded border ${
                                    isOwnMessage ? 'bg-blue-500 border-blue-400' : 'bg-white border-gray-200'
                                  }`}>
                                    <Paperclip size={14} />
                                    <span className="text-xs font-medium truncate flex-1">
                                      {attachment.fileName}
                                    </span>
                                    <button className="p-1 hover:bg-black/10 rounded">
                                      <Download size={12} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            <div className={`flex items-center justify-between mt-2 text-xs ${
                              isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              <span>{formatTime(message.createdAt)}</span>
                              {isOwnMessage && (
                                <div className="flex items-center gap-1">
                                  {message.status === 'sent' && <Clock size={12} />}
                                  {message.status === 'delivered' && <CheckCircle size={12} />}
                                  {message.status === 'read' && <Eye size={12} />}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-end gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Paperclip size={16} className="text-gray-600" />
                </button>
                
                <div className="flex-1">
                  <textarea
                    ref={messageInputRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ minHeight: '40px', maxHeight: '120px' }}
                  />
                </div>
                
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || sendingMessage}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendingMessage ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          /* No Conversation Selected */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-600">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}