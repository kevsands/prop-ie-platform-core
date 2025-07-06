'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  Archive,
  Star,
  Hash,
  Brain,
  BarChart3,
  Target,
  Plus,
  Settings,
  Users,
  Tag,
  Calendar,
  Clock,
  ChevronRight,
  X,
  CheckSquare,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { MessagingInterface } from './MessagingInterface';
import { ConversationThreadView } from './ConversationThreadView';

interface EnhancedMessagingInterfaceProps {
  className?: string;
  initialConversationId?: string;
  showThreadView?: boolean;
}

interface ConversationListItem {
  id: string;
  title: string;
  lastMessage?: {
    content: string;
    senderName: string;
    timestamp: string;
  };
  participants: {
    userId: string;
    userName: string;
    userRole: string;
  }[];
  unreadCount: number;
  messageCount: number;
  status: 'active' | 'archived' | 'closed';
  contextType?: string;
  priority?: string;
  hasActionItems?: boolean;
  needsAttention?: boolean;
  metadata?: {
    propertyId?: string;
    propertyTitle?: string;
  };
}

export function EnhancedMessagingInterface({ 
  className = '', 
  initialConversationId,
  showThreadView = false 
}: EnhancedMessagingInterfaceProps) {
  const [activeView, setActiveView] = useState<'conversations' | 'thread_analysis'>('conversations');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(initialConversationId || null);
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'priority' | 'action_items'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'priority' | 'unread'>('recent');
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (showThreadView && selectedConversationId) {
      setActiveView('thread_analysis');
    }
  }, [showThreadView, selectedConversationId]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/messages', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        
        // Transform conversations to include enhanced metadata
        const enhancedConversations = (data.conversations || []).map((conv: any) => ({
          ...conv,
          hasActionItems: Math.random() > 0.7, // Simulate some conversations having action items
          needsAttention: conv.unreadCount > 3 || conv.contextType === 'property_purchase',
          priority: conv.contextType === 'property_purchase' ? 'high' : 
                   conv.contextType === 'htb_application' ? 'medium' : 'low'
        }));

        setConversations(enhancedConversations);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchConversations = async (query: string) => {
    if (!query.trim()) {
      fetchConversations();
      return;
    }

    try {
      const response = await fetch(`/api/conversations?type=search&q=${encodeURIComponent(query)}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data.results || []);
      }
    } catch (err) {
      console.error('Error searching conversations:', err);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    
    // Debounce search
    setTimeout(() => {
      if (value === searchQuery) {
        searchConversations(value);
      }
    }, 300);
  };

  const getFilteredAndSortedConversations = () => {
    let filtered = conversations;

    // Apply filters
    switch (filterType) {
      case 'unread':
        filtered = filtered.filter(conv => conv.unreadCount > 0);
        break;
      case 'priority':
        filtered = filtered.filter(conv => conv.priority === 'high' || conv.needsAttention);
        break;
      case 'action_items':
        filtered = filtered.filter(conv => conv.hasActionItems);
        break;
    }

    // Apply sorting
    switch (sortBy) {
      case 'priority':
        filtered.sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
                 (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
        });
        break;
      case 'unread':
        filtered.sort((a, b) => b.unreadCount - a.unreadCount);
        break;
      case 'recent':
      default:
        filtered.sort((a, b) => {
          if (!a.lastMessage || !b.lastMessage) return 0;
          return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
        });
        break;
    }

    return filtered;
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-amber-500 bg-amber-50';
      case 'low':
        return 'border-l-gray-500 bg-gray-50';
      default:
        return 'border-l-gray-300 bg-white';
    }
  };

  const getContextIcon = (contextType?: string) => {
    switch (contextType) {
      case 'property_purchase':
        return '🏠';
      case 'htb_application':
        return '💰';
      case 'legal_support':
        return '⚖️';
      case 'mortgage_application':
        return '🏦';
      default:
        return '💬';
    }
  };

  const filteredConversations = getFilteredAndSortedConversations();

  if (activeView === 'thread_analysis' && selectedConversationId) {
    return (
      <div className={`${className}`}>
        <div className="mb-4 flex items-center gap-3">
          <button
            onClick={() => setActiveView('conversations')}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ChevronRight size={16} className="rotate-180" />
            Back to Conversations
          </button>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-700">Thread Analysis</span>
        </div>
        
        <ConversationThreadView 
          conversationId={selectedConversationId}
          className="mb-6"
        />
        
        <MessagingInterface 
          initialConversationId={selectedConversationId}
          className="h-[500px]"
        />
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Enhanced Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare size={28} className="text-blue-600" />
              Enhanced Messaging
            </h2>
            <p className="text-gray-600 mt-1">Advanced conversation management and analysis</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Filter size={16} />
              Filters
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus size={16} />
              New Conversation
            </button>
          </div>
        </div>

        {/* Enhanced Search */}
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations, participants, or content..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Conversations</option>
                  <option value="unread">Unread Messages</option>
                  <option value="priority">High Priority</option>
                  <option value="action_items">Has Action Items</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="recent">Most Recent</option>
                  <option value="priority">Priority</option>
                  <option value="unread">Unread Count</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilterType('all');
                    setSortBy('recent');
                    setSearchQuery('');
                    fetchConversations();
                  }}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Conversation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Total Conversations</p>
              <p className="text-2xl font-bold text-blue-900">{conversations.length}</p>
            </div>
            <MessageSquare size={24} className="text-blue-600" />
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-800">Unread Messages</p>
              <p className="text-2xl font-bold text-red-900">
                {conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)}
              </p>
            </div>
            <AlertCircle size={24} className="text-red-600" />
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-800">High Priority</p>
              <p className="text-2xl font-bold text-amber-900">
                {conversations.filter(conv => conv.priority === 'high').length}
              </p>
            </div>
            <TrendingUp size={24} className="text-amber-600" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Action Items</p>
              <p className="text-2xl font-bold text-green-900">
                {conversations.filter(conv => conv.hasActionItems).length}
              </p>
            </div>
            <CheckSquare size={24} className="text-green-600" />
          </div>
        </div>
      </div>

      {/* Enhanced Conversation List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversation List Panel */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">
                Conversations ({filteredConversations.length})
              </h3>
              <button 
                onClick={fetchConversations}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings size={16} className="text-gray-600" />
              </button>
            </div>
          </div>

          <div className="max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading conversations...</p>
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
                    onClick={() => setSelectedConversationId(conversation.id)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors border-l-4 ${getPriorityColor(conversation.priority)} ${
                      selectedConversationId === conversation.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-lg">{getContextIcon(conversation.contextType)}</span>
                        <h4 className="font-medium text-gray-900 truncate text-sm">
                          {conversation.title}
                        </h4>
                        {conversation.needsAttention && (
                          <AlertCircle size={14} className="text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {conversation.hasActionItems && (
                          <CheckSquare size={14} className="text-green-600" />
                        )}
                        {conversation.unreadCount > 0 && (
                          <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>

                    {conversation.lastMessage && (
                      <p className="text-sm text-gray-600 truncate mb-2">
                        <span className="font-medium">{conversation.lastMessage.senderName}:</span> {conversation.lastMessage.content}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Users size={12} />
                          {conversation.participants.length}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare size={12} />
                          {conversation.messageCount}
                        </span>
                        {conversation.contextType && (
                          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
                            {conversation.contextType.replace('_', ' ')}
                          </span>
                        )}
                      </div>
                      
                      {conversation.lastMessage && (
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(conversation.lastMessage.timestamp).toLocaleDateString('en-IE')}
                        </span>
                      )}
                    </div>

                    {conversation.metadata?.propertyTitle && (
                      <div className="mt-2 text-xs text-gray-500">
                        🏠 {conversation.metadata.propertyTitle}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message Interface or Analysis Panel */}
        <div className="bg-white rounded-lg border shadow-sm">
          {selectedConversationId ? (
            <div>
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Messages</h3>
                  <button
                    onClick={() => setActiveView('thread_analysis')}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Brain size={16} />
                    Analyze Thread
                  </button>
                </div>
              </div>
              <div className="h-[600px]">
                <MessagingInterface 
                  initialConversationId={selectedConversationId}
                  className="h-full"
                />
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}