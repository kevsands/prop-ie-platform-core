'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Phone, 
  Video, 
  Calendar, 
  AlertCircle,
  Building2,
  User,
  Clock,
  CheckCircle2,
  Star,
  Filter,
  Search,
  Plus,
  MoreVertical,
  Bell,
  Archive,
  Trash2,
  Forward,
  Reply,
  FileText,
  Image,
  Download,
  Eye,
  ThumbsUp,
  MessageCircle,
  Users,
  Zap,
  TrendingUp,
  DollarSign,
  Home
} from 'lucide-react';
import Link from 'next/link';
import { agentDeveloperCommunicationService, MessageConversation, DeveloperAgentMessage, AgentDeveloperNotification } from '@/services/AgentDeveloperCommunicationService';

interface AgentDeveloperChatPageProps {}

export default function AgentDeveloperChatPage({}: AgentDeveloperChatPageProps) {
  const [conversations, setConversations] = useState<MessageConversation[]>([]);
  const [messages, setMessages] = useState<DeveloperAgentMessage[]>([]);
  const [notifications, setNotifications] = useState<AgentDeveloperNotification[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isComposing, setIsComposing] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock agent ID - in production this would come from auth context
  const currentAgentId = 'agent-001';

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load conversations for this agent
      const agentConversations = agentDeveloperCommunicationService.getConversationsByParticipant(
        currentAgentId, 
        'agent'
      );
      setConversations(agentConversations);

      // Load notifications for this agent
      const agentNotifications = agentDeveloperCommunicationService.getNotificationsByRecipient(
        currentAgentId, 
        'agent'
      );
      setNotifications(agentNotifications);

      // Load messages for selected conversation
      if (selectedConversation) {
        const conversationMessages = agentDeveloperCommunicationService.getMessagesByConversation(
          selectedConversation
        );
        setMessages(conversationMessages);
      }

    } catch (error) {
      console.error('Error loading chat data:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setLoading(true);
      
      const conversation = conversations.find(c => c.id === selectedConversation);
      if (!conversation) return;

      // Find developer participant
      const developer = conversation.participants.find(p => p.type === 'developer');
      if (!developer) return;

      await agentDeveloperCommunicationService.sendMessage(
        currentAgentId,
        'agent',
        developer.id,
        'developer',
        {
          subject: conversation.subject,
          content: newMessage,
          messageType: 'general_enquiry',
          priority: 'medium',
          conversationId: selectedConversation,
          context: {
            propertyId: conversation.unitId,
            propertyName: conversation.context.unitDetails?.unitNumber
          }
        }
      );

      setNewMessage('');
      await loadData(); // Reload to get updated messages

    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartNewConversation = async () => {
    try {
      setLoading(true);
      
      const conversation = await agentDeveloperCommunicationService.createConversation(
        currentAgentId,
        'agent',
        'developer-001', // Mock developer ID
        'developer',
        'New Enquiry',
        'general_enquiry',
        {
          projectId: 'fitzgerald-gardens'
        }
      );

      setSelectedConversation(conversation.id);
      await loadData();

    } catch (error) {
      console.error('Error creating conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = async (conversationId: string) => {
    setSelectedConversation(conversationId);
    
    // Load messages for this conversation
    const conversationMessages = agentDeveloperCommunicationService.getMessagesByConversation(
      conversationId
    );
    setMessages(conversationMessages);

    // Mark messages as read
    conversationMessages.forEach(msg => {
      if (msg.recipientId === currentAgentId && msg.status !== 'read') {
        agentDeveloperCommunicationService.markMessageAsRead(msg.id, currentAgentId);
      }
    });
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-IE', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return new Intl.DateTimeFormat('en-IE', {
        month: 'short',
        day: 'numeric'
      }).format(date);
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.participants.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'unread') return matchesSearch && conv.unreadCount > 0;
    if (filterType === 'urgent') return matchesSearch && conv.priority === 'urgent';
    
    return matchesSearch;
  });

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Developer Communication</h1>
            <p className="text-gray-600">Direct communication with property developers</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell size={20} />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            </div>
            <button
              onClick={handleStartNewConversation}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              New Message
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Conversations Sidebar */}
        <div className="w-80 bg-white border-r flex flex-col">
          {/* Search and Filter */}
          <div className="p-4 border-b">
            <div className="relative mb-3">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center">
                <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">No conversations found</p>
                <button
                  onClick={handleStartNewConversation}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Conversation
                </button>
              </div>
            ) : (
              <div className="divide-y">
                {filteredConversations.map((conversation) => {
                  const developer = conversation.participants.find(p => p.type === 'developer');
                  const isSelected = selectedConversation === conversation.id;
                  
                  return (
                    <div
                      key={conversation.id}
                      onClick={() => handleSelectConversation(conversation.id)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        isSelected ? 'bg-blue-50 border-r-2 border-blue-600' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <Building2 size={16} className="text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{developer?.name || 'Developer'}</h4>
                            <p className="text-sm text-gray-500">{conversation.context.projectName}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs text-gray-500">{formatDate(conversation.lastActivity)}</span>
                          {conversation.unreadCount > 0 && (
                            <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{conversation.subject}</p>
                      {conversation.context.unitDetails && (
                        <div className="mt-2 text-xs text-gray-500">
                          Unit {conversation.context.unitDetails.unitNumber} • €{conversation.context.unitDetails.price.toLocaleString()}
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          conversation.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          conversation.priority === 'high' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {conversation.priority}
                        </span>
                        {conversation.conversationType !== 'general' && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {conversation.conversationType.replace('_', ' ')}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Building2 size={16} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {conversations.find(c => c.id === selectedConversation)?.participants.find(p => p.type === 'developer')?.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {conversations.find(c => c.id === selectedConversation)?.context.projectName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Phone size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Video size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Calendar size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isFromAgent = message.senderType === 'agent';
                    const conversation = conversations.find(c => c.id === selectedConversation);
                    const sender = conversation?.participants.find(p => 
                      p.type === message.senderType && p.id === message.senderId
                    );

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isFromAgent ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-md ${isFromAgent ? 'order-2' : 'order-1'}`}>
                          <div className={`p-4 rounded-lg ${
                            isFromAgent 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-white border shadow-sm'
                          }`}>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium">
                                {isFromAgent ? 'You' : sender?.name}
                              </span>
                              <span className={`text-xs ${
                                isFromAgent ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                {formatTime(message.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-3 space-y-2">
                                {message.attachments.map((attachment) => (
                                  <div key={attachment.id} className={`flex items-center gap-2 p-2 rounded ${
                                    isFromAgent ? 'bg-blue-500' : 'bg-gray-50'
                                  }`}>
                                    <FileText size={16} />
                                    <span className="text-sm">{attachment.name}</span>
                                    <button className="ml-auto">
                                      <Download size={14} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between mt-2">
                              <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                message.priority === 'urgent' ? 'bg-red-500 text-white' :
                                message.priority === 'high' ? 'bg-yellow-500 text-white' :
                                isFromAgent ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {message.messageType.replace('_', ' ')}
                              </span>
                              
                              {isFromAgent && (
                                <div className="flex items-center gap-1">
                                  {message.status === 'read' && <CheckCircle2 size={14} />}
                                  <span className="text-xs">{message.status}</span>
                                </div>
                              )}
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
              <div className="bg-white border-t p-4">
                <div className="flex items-end gap-3">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Paperclip size={18} />
                  </button>
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Type your message..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={1}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || loading}
                    className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* No Conversation Selected */
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageSquare size={64} className="mx-auto text-gray-300 mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Developer Chat</h3>
                <p className="text-gray-600 mb-6 max-w-md">
                  Communicate directly with property developers about listings, viewings, and client needs.
                </p>
                <div className="space-y-4">
                  <button
                    onClick={handleStartNewConversation}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                  >
                    <Plus size={20} />
                    Start New Conversation
                  </button>
                  <div className="text-sm text-gray-500">
                    or select an existing conversation from the sidebar
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}