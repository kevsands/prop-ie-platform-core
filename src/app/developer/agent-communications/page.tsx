'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Users, 
  Phone, 
  Video, 
  Calendar, 
  Star,
  Building2,
  User,
  Clock,
  CheckCircle2,
  Filter,
  Search,
  Plus,
  MoreVertical,
  Bell,
  UserCheck,
  TrendingUp,
  DollarSign,
  Home,
  Eye,
  MapPin,
  Briefcase,
  Award,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Download,
  Image,
  Paperclip,
  Archive,
  Reply,
  Forward,
  Zap,
  Target,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { agentDeveloperCommunicationService, MessageConversation, DeveloperAgentMessage, AgentDeveloperNotification } from '@/services/AgentDeveloperCommunicationService';

interface DeveloperAgentCommunicationsPageProps {}

export default function DeveloperAgentCommunicationsPage({}: DeveloperAgentCommunicationsPageProps) {
  const [conversations, setConversations] = useState<MessageConversation[]>([]);
  const [messages, setMessages] = useState<DeveloperAgentMessage[]>([]);
  const [notifications, setNotifications] = useState<AgentDeveloperNotification[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [agentFilter, setAgentFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock developer ID - in production this would come from auth context
  const currentDeveloperId = 'developer-001';

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load conversations for this developer
      const developerConversations = agentDeveloperCommunicationService.getConversationsByParticipant(
        currentDeveloperId, 
        'developer'
      );
      setConversations(developerConversations);

      // Load notifications for this developer
      const developerNotifications = agentDeveloperCommunicationService.getNotificationsByRecipient(
        currentDeveloperId, 
        'developer'
      );
      setNotifications(developerNotifications);

      // Load messages for selected conversation
      if (selectedConversation) {
        const conversationMessages = agentDeveloperCommunicationService.getMessagesByConversation(
          selectedConversation
        );
        setMessages(conversationMessages);
      }

    } catch (error) {
      console.error('Error loading communications data:', error);
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

      // Find agent participant
      const agent = conversation.participants.find(p => p.type === 'agent');
      if (!agent) return;

      await agentDeveloperCommunicationService.sendMessage(
        currentDeveloperId,
        'developer',
        agent.id,
        'agent',
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

  const handleSelectConversation = async (conversationId: string) => {
    setSelectedConversation(conversationId);
    
    // Load messages for this conversation
    const conversationMessages = agentDeveloperCommunicationService.getMessagesByConversation(
      conversationId
    );
    setMessages(conversationMessages);

    // Mark messages as read
    conversationMessages.forEach(msg => {
      if (msg.recipientId === currentDeveloperId && msg.status !== 'read') {
        agentDeveloperCommunicationService.markMessageAsRead(msg.id, currentDeveloperId);
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

  const getAgentPerformanceIcon = (agent: any) => {
    // Mock performance indicators
    const performance = Math.random();
    if (performance > 0.8) return <Star className="text-yellow-500" size={16} />;
    if (performance > 0.6) return <TrendingUp className="text-green-500" size={16} />;
    return <Activity className="text-blue-500" size={16} />;
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.participants.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = () => {
      if (filterType === 'all') return true;
      if (filterType === 'unread') return conv.unreadCount > 0;
      if (filterType === 'urgent') return conv.priority === 'urgent';
      if (filterType === 'buyers') return conv.conversationType === 'buyer_specific';
      return true;
    };

    const matchesAgentFilter = () => {
      if (agentFilter === 'all') return true;
      if (agentFilter === 'top_performers') {
        // Mock: filter for top performing agents
        return Math.random() > 0.5;
      }
      return true;
    };
    
    return matchesSearch && matchesFilter() && matchesAgentFilter();
  });

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const totalActiveAgents = new Set(conversations.map(c => 
    c.participants.find(p => p.type === 'agent')?.id
  )).size;

  const communicationStats = {
    totalConversations: conversations.length,
    unreadMessages: conversations.reduce((sum, c) => sum + c.unreadCount, 0),
    activeAgents: totalActiveAgents,
    urgentMatters: conversations.filter(c => c.priority === 'urgent').length
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agent Communications</h1>
            <p className="text-gray-600">Manage communication with estate agents</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Communication Stats */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-blue-600" />
                <span className="text-gray-600">{communicationStats.totalConversations} conversations</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-green-600" />
                <span className="text-gray-600">{communicationStats.activeAgents} active agents</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-orange-600" />
                <span className="text-gray-600">{communicationStats.urgentMatters} urgent</span>
              </div>
            </div>
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
                placeholder="Search agents or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Conversations</option>
                <option value="unread">Unread Messages</option>
                <option value="urgent">Urgent Matters</option>
                <option value="buyers">Buyer Enquiries</option>
              </select>
              <select
                value={agentFilter}
                onChange={(e) => setAgentFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Agents</option>
                <option value="top_performers">Top Performers</option>
              </select>
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center">
                <Users size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">No conversations found</p>
                <p className="text-sm text-gray-400">Agents will appear here when they initiate contact</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredConversations.map((conversation) => {
                  const agent = conversation.participants.find(p => p.type === 'agent');
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
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                              <Briefcase size={16} className="text-white" />
                            </div>
                            <div className="absolute -bottom-1 -right-1">
                              {getAgentPerformanceIcon(agent)}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{agent?.name || 'Unknown Agent'}</h4>
                            <p className="text-sm text-gray-500">{agent?.role}</p>
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
                      
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{conversation.subject}</p>
                      
                      {conversation.context.unitDetails && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <Home size={12} />
                          <span>Unit {conversation.context.unitDetails.unitNumber}</span>
                          <span>•</span>
                          <span>€{conversation.context.unitDetails.price.toLocaleString()}</span>
                        </div>
                      )}

                      {conversation.context.buyerDetails && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <User size={12} />
                          <span>Buyer: {conversation.context.buyerDetails.name}</span>
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

                        {conversation.context.salesMetrics && conversation.context.salesMetrics.saleValue && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            €{conversation.context.salesMetrics.saleValue.toLocaleString()}
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
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                      <Briefcase size={16} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {conversations.find(c => c.id === selectedConversation)?.participants.find(p => p.type === 'agent')?.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>
                          {conversations.find(c => c.id === selectedConversation)?.participants.find(p => p.type === 'agent')?.role}
                        </span>
                        <span>•</span>
                        <span>
                          {conversations.find(c => c.id === selectedConversation)?.context.projectName}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link 
                      href="/developer/agents"
                      className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      View Agent Profile
                    </Link>
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
                    <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No messages yet. The agent will start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isFromDeveloper = message.senderType === 'developer';
                    const conversation = conversations.find(c => c.id === selectedConversation);
                    const sender = conversation?.participants.find(p => 
                      p.type === message.senderType && p.id === message.senderId
                    );

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isFromDeveloper ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-md ${isFromDeveloper ? 'order-2' : 'order-1'}`}>
                          <div className={`p-4 rounded-lg ${
                            isFromDeveloper 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-white border shadow-sm'
                          }`}>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium">
                                {isFromDeveloper ? 'You' : sender?.name}
                              </span>
                              <span className={`text-xs ${
                                isFromDeveloper ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                {formatTime(message.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-3 space-y-2">
                                {message.attachments.map((attachment) => (
                                  <div key={attachment.id} className={`flex items-center gap-2 p-2 rounded ${
                                    isFromDeveloper ? 'bg-blue-500' : 'bg-gray-50'
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
                                isFromDeveloper ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {message.messageType.replace('_', ' ')}
                              </span>
                              
                              {isFromDeveloper && (
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
                      placeholder="Type your response..."
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
                <Users size={64} className="mx-auto text-gray-300 mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Agent Communications Hub</h3>
                <p className="text-gray-600 mb-6 max-w-md">
                  Manage all communication with estate agents selling your properties. 
                  Respond to enquiries, coordinate viewings, and track sales progress.
                </p>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare size={16} className="text-blue-600" />
                        <span className="font-medium">Quick Response</span>
                      </div>
                      <p className="text-gray-600">Respond to agent enquiries instantly</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <Target size={16} className="text-green-600" />
                        <span className="font-medium">Track Progress</span>
                      </div>
                      <p className="text-gray-600">Monitor sales pipeline and metrics</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Select a conversation from the sidebar to begin communicating
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