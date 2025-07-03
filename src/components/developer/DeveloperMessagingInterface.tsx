'use client';

import React, { useState, useEffect, useRef } from 'react';
import { StartConversationModal } from './StartConversationModal';
import { FileUploadModal } from './FileUploadModal';
import { FilePreview } from './FilePreview';
import { MessageSearchModal } from './MessageSearchModal';
import { AutomatedRoutingPanel } from './AutomatedRoutingPanel';
import { useWebSocket, useTypingIndicator } from '@/hooks/useWebSocket';
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
  MessageSquare,
  Building2,
  Shield,
  AlertTriangle,
  CheckCircle2,
  UserCheck,
  Calendar,
  FileText,
  Zap,
  Target,
  Flag,
  TrendingUp,
  Briefcase,
  Home,
  Crown,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Bell,
  DollarSign,
  Bot
} from 'lucide-react';

interface DeveloperMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'buyer' | 'solicitor' | 'agent' | 'developer' | 'lender' | 'admin' | 'architect' | 'engineer' | 'contractor' | 'project_manager' | 'site_manager' | 'ceo' | 'executive';
  content: string;
  messageType: 'text' | 'document' | 'system' | 'task_update' | 'payment_notification' | 'approval_request' | 'meeting_request' | 'progress_update';
  priority: 'low' | 'normal' | 'high' | 'urgent' | 'executive';
  status: 'sent' | 'delivered' | 'read' | 'approved' | 'rejected' | 'pending_approval';
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
    projectId?: string;
    taskId?: string;
    transactionId?: string;
    meetingId?: string;
    approvalId?: string;
    teamId?: string;
    milestoneId?: string;
  };
}

interface DeveloperConversation {
  id: string;
  title: string;
  conversationType: 'team_communication' | 'buyer_query' | 'approval_request' | 'meeting_discussion' | 'project_update' | 'executive_communication';
  projectId?: string;
  projectName?: string;
  teamId?: string;
  teamName?: string;
  participants: {
    userId: string;
    userName: string;
    userRole: string;
    teamRole?: 'lead' | 'member' | 'consultant';
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
  status: 'active' | 'archived' | 'closed' | 'pending_approval' | 'urgent';
  priority: 'low' | 'normal' | 'high' | 'urgent' | 'executive';
  createdAt: string;
  updatedAt: string;
  metadata?: {
    propertyId?: string;
    propertyTitle?: string;
    contextType?: 'property_purchase' | 'construction_progress' | 'design_review' | 'buyer_inquiry' | 'executive_decision' | 'team_coordination';
    deadline?: string;
    approvalRequired?: boolean;
    executiveAttention?: boolean;
  };
}

interface DeveloperMessagingInterfaceProps {
  className?: string;
  initialConversationId?: string;
}

export function DeveloperMessagingInterface({ className = '', initialConversationId }: DeveloperMessagingInterfaceProps) {
  const [conversations, setConversations] = useState<DeveloperConversation[]>([]);
  const [messages, setMessages] = useState<DeveloperMessage[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<DeveloperConversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showMobileConversations, setShowMobileConversations] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'team' | 'buyers' | 'approvals' | 'urgent' | 'meetings'>('all');
  const [selectedProject, setSelectedProject] = useState<'all' | 'fitzgerald-gardens' | 'ellwood' | 'ballymakenny-view'>('all');
  const [showApprovalPanel, setShowApprovalPanel] = useState(false);
  const [showStartConversation, setShowStartConversation] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [showMessageSearch, setShowMessageSearch] = useState(false);
  const [showRoutingPanel, setShowRoutingPanel] = useState(false);
  const [previewFile, setPreviewFile] = useState<any>(null);
  const [typingUsers, setTypingUsers] = useState<Map<string, { userName: string; conversationId: string }>>(new Map());
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  // WebSocket integration for real-time messaging
  const {
    isConnected,
    sendMessage: wsSendMessage,
    markMessageAsRead,
    sendTypingIndicator,
    joinConversation,
    leaveConversation,
    connectedUsers,
    lastMessage,
    connectionError
  } = useWebSocket({
    userId: 'developer_001', // In production, get from auth context
    autoConnect: true,
    onNewMessage: (message) => {
      // Add new message to the current conversation
      if (selectedConversation && message.conversationId === selectedConversation.id) {
        setMessages(prev => [...prev, message]);
        // Mark as read automatically if conversation is active
        markMessageAsRead(message.id, message.conversationId);
      }
      
      // Update conversation list with latest message
      setConversations(prev => prev.map(conv => 
        conv.id === message.conversationId 
          ? {
              ...conv,
              lastMessage: {
                content: message.content,
                senderName: message.senderName,
                timestamp: message.createdAt
              },
              unreadCount: conv.id === selectedConversation?.id ? 0 : conv.unreadCount + 1
            }
          : conv
      ));
    },
    onUserStatusChange: (data) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        if (data.status === 'online') {
          newSet.add(data.userId);
        } else {
          newSet.delete(data.userId);
        }
        return newSet;
      });
    },
    onTypingIndicator: (data) => {
      setTypingUsers(prev => {
        const newMap = new Map(prev);
        if (data.isTyping) {
          newMap.set(data.userId, {
            userName: data.userId, // In production, fetch actual user name
            conversationId: data.conversationId
          });
        } else {
          newMap.delete(data.userId);
        }
        return newMap;
      });

      // Clear typing indicator after timeout
      setTimeout(() => {
        setTypingUsers(prev => {
          const newMap = new Map(prev);
          newMap.delete(data.userId);
          return newMap;
        });
      }, 3000);
    }
  });

  // Typing indicator for current user
  const { isTyping, startTyping, stopTyping } = useTypingIndicator(
    selectedConversation?.id || '',
    sendTypingIndicator
  );

  useEffect(() => {
    fetchConversations();
  }, [selectedFilter, selectedProject]);

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
      // Join the conversation for WebSocket updates
      joinConversation(selectedConversation.id);
      
      // Leave previous conversation when switching
      return () => {
        leaveConversation(selectedConversation.id);
      };
    }
  }, [selectedConversation, joinConversation, leaveConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/messages/developer?filter=${selectedFilter}&project=${selectedProject}`, {
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

      const response = await fetch(`/api/messages/developer?type=messages&conversationId=${conversationId}`, {
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
      const messageContent = newMessage.trim();

      // Send via WebSocket for real-time delivery
      const wsSuccess = wsSendMessage(selectedConversation.id, messageContent, 'text');
      
      // Also send via API for database persistence
      const response = await fetch('/api/messages/developer/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          content: messageContent,
          messageType: 'text',
          priority: 'normal'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      // Only add to local state if WebSocket didn't succeed
      if (!wsSuccess) {
        setMessages(prev => [...prev, data.message]);
      }
      
      setNewMessage('');
      stopTyping(); // Stop typing indicator
      
      // Update conversation list
      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { 
              ...conv, 
              lastMessage: {
                content: messageContent,
                senderName: data.message?.senderName || 'Development Manager',
                timestamp: new Date().toISOString()
              },
              updatedAt: new Date().toISOString()
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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    
    // Send typing indicator when user starts typing
    if (e.target.value.trim() && selectedConversation) {
      startTyping();
    } else if (!e.target.value.trim()) {
      stopTyping();
    }
  };

  const handleFileUpload = async (files: any[], message?: string) => {
    if (!selectedConversation) return;

    try {
      setSendingMessage(true);

      // Create a temporary message ID for the attachments
      const tempMessageId = `temp_msg_${Date.now()}`;

      // Upload files to server
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file.file);
      });
      formData.append('conversationId', selectedConversation.id);
      formData.append('messageId', tempMessageId);

      const uploadResponse = await fetch('/api/messages/attachments/upload', {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload files');
      }

      const uploadData = await uploadResponse.json();

      // Send message with attachments
      const messageResponse = await fetch('/api/messages/developer/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          content: message || `📎 Shared ${files.length} file${files.length > 1 ? 's' : ''}`,
          messageType: 'document',
          priority: 'normal',
          attachments: uploadData.files.map((file: any) => ({
            id: file.id,
            fileName: file.originalName,
            fileType: file.type,
            fileSize: file.size,
            url: file.url
          }))
        })
      });

      if (!messageResponse.ok) {
        throw new Error('Failed to send message');
      }

      const messageData = await messageResponse.json();
      
      // Update local state with new message
      setMessages(prev => [...prev, {
        ...messageData.message,
        attachments: uploadData.files.map((file: any) => ({
          id: file.id,
          fileName: file.originalName,
          fileType: file.type,
          fileSize: file.size,
          url: file.url
        }))
      }]);

      // Update conversation list
      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { 
              ...conv, 
              lastMessage: {
                content: message || `📎 Shared ${files.length} file${files.length > 1 ? 's' : ''}`,
                senderName: 'Development Manager',
                timestamp: new Date().toISOString()
              },
              updatedAt: new Date().toISOString()
            }
          : conv
      ));

    } catch (error) {
      console.error('File upload error:', error);
      alert('Failed to upload files. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleFilePreview = (file: any) => {
    setPreviewFile(file);
    setShowFilePreview(true);
  };

  const handleSearchResult = async (messageId: string, conversationId: string) => {
    // Find and select the conversation
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setSelectedConversation(conversation);
      setShowMobileConversations(false);
      
      // Fetch messages for the conversation
      await fetchMessages(conversationId);
      
      // Scroll to the specific message after a short delay
      setTimeout(() => {
        const messageElement = document.getElementById(`message-${messageId}`);
        if (messageElement) {
          messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Highlight the message briefly
          messageElement.classList.add('bg-yellow-100', 'border-yellow-300');
          setTimeout(() => {
            messageElement.classList.remove('bg-yellow-100', 'border-yellow-300');
          }, 3000);
        }
      }, 500);
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
      case 'architect':
        return '🏗️';
      case 'engineer':
        return '⚙️';
      case 'contractor':
        return '🔨';
      case 'project_manager':
        return '📋';
      case 'site_manager':
        return '👷';
      case 'ceo':
      case 'executive':
        return '👑';
      case 'solicitor':
        return '⚖️';
      case 'agent':
        return '🏘️';
      case 'developer':
        return '🏢';
      case 'lender':
        return '🏦';
      case 'admin':
        return '🛠️';
      case 'buyer':
        return '🏠';
      default:
        return '👤';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'architect':
        return 'bg-purple-100 text-purple-800';
      case 'engineer':
        return 'bg-indigo-100 text-indigo-800';
      case 'contractor':
        return 'bg-orange-100 text-orange-800';
      case 'project_manager':
        return 'bg-blue-100 text-blue-800';
      case 'site_manager':
        return 'bg-yellow-100 text-yellow-800';
      case 'ceo':
      case 'executive':
        return 'bg-red-100 text-red-800';
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
      case 'buyer':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConversationTypeIcon = (type: string) => {
    switch (type) {
      case 'team_communication':
        return <Users size={16} className="text-blue-600" />;
      case 'buyer_query':
        return <Home size={16} className="text-green-600" />;
      case 'approval_request':
        return <Crown size={16} className="text-red-600" />;
      case 'meeting_discussion':
        return <Calendar size={16} className="text-purple-600" />;
      case 'project_update':
        return <Building2 size={16} className="text-orange-600" />;
      case 'executive_communication':
        return <Flag size={16} className="text-red-600" />;
      default:
        return <MessageSquare size={16} className="text-gray-600" />;
    }
  };

  const getPriorityIndicator = (priority: string) => {
    switch (priority) {
      case 'executive':
        return <Crown size={12} className="text-red-600" />;
      case 'urgent':
        return <AlertTriangle size={12} className="text-amber-600" />;
      case 'high':
        return <AlertCircle size={12} className="text-orange-600" />;
      default:
        return null;
    }
  };

  const getFilterCount = (filter: string) => {
    switch (filter) {
      case 'team':
        return conversations.filter(c => c.conversationType === 'team_communication').length;
      case 'buyers':
        return conversations.filter(c => c.conversationType === 'buyer_query').length;
      case 'approvals':
        return conversations.filter(c => c.conversationType === 'approval_request' || c.metadata?.approvalRequired).length;
      case 'urgent':
        return conversations.filter(c => c.priority === 'urgent' || c.priority === 'executive').length;
      case 'meetings':
        return conversations.filter(c => c.conversationType === 'meeting_discussion').length;
      default:
        return conversations.length;
    }
  };

  const handleStartConversation = async (data: any) => {
    try {
      const response = await fetch('/api/messages/developer/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          title: data.title,
          recipientIds: data.recipients.map((r: any) => r.id),
          content: data.initialMessage,
          messageType: 'text',
          priority: data.priority,
          conversationType: data.conversationType,
          projectId: data.projectId
        })
      });

      if (response.ok) {
        const result = await response.json();
        // Refresh conversations to show the new one
        fetchConversations();
        // Show success message
        console.log('Conversation started successfully:', result);
      }
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.participants.some(p => p.userName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = 
      selectedFilter === 'all' ||
      (selectedFilter === 'team' && conv.conversationType === 'team_communication') ||
      (selectedFilter === 'buyers' && conv.conversationType === 'buyer_query') ||
      (selectedFilter === 'approvals' && (conv.conversationType === 'approval_request' || conv.metadata?.approvalRequired)) ||
      (selectedFilter === 'urgent' && (conv.priority === 'urgent' || conv.priority === 'executive')) ||
      (selectedFilter === 'meetings' && conv.conversationType === 'meeting_discussion');
    
    const matchesProject = selectedProject === 'all' || conv.projectId === selectedProject;
    
    return matchesSearch && matchesFilter && matchesProject;
  });

  return (
    <div className={`bg-white rounded-lg border shadow-sm h-[700px] flex ${className}`}>
      {/* Conversations Sidebar */}
      <div className={`w-full md:w-96 border-r flex flex-col ${showMobileConversations ? 'block' : 'hidden md:block'}`}>
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Building2 size={20} className="text-blue-600" />
              Developer Hub
            </h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowMessageSearch(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Advanced Search"
              >
                <Search size={16} className="text-gray-600" />
              </button>
              <button 
                onClick={() => setShowRoutingPanel(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Automated Routing Rules"
              >
                <Bot size={16} className="text-blue-600" />
              </button>
              <button 
                onClick={() => setShowApprovalPanel(!showApprovalPanel)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
              >
                <Crown size={16} className="text-red-600" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>
              <button 
                onClick={() => setShowStartConversation(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Start New Conversation"
              >
                <Plus size={16} className="text-gray-600" />
              </button>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search communications..."
              value={searchTerm}
              onClick={() => setShowMessageSearch(true)}
              readOnly
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { key: 'all', label: 'All', icon: MessageSquare },
              { key: 'team', label: 'Team', icon: Users },
              { key: 'buyers', label: 'Buyers', icon: Home },
              { key: 'approvals', label: 'Approvals', icon: Crown },
              { key: 'urgent', label: 'Urgent', icon: AlertTriangle },
              { key: 'meetings', label: 'Meetings', icon: Calendar },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key as any)}
                className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  selectedFilter === filter.key
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <filter.icon size={12} />
                {filter.label}
                <span className="bg-white/50 text-xs px-1 rounded">
                  {getFilterCount(filter.key)}
                </span>
              </button>
            ))}
          </div>

          {/* Project Filter */}
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Projects</option>
            <option value="fitzgerald-gardens">Fitzgerald Gardens</option>
            <option value="ellwood">Ellwood</option>
            <option value="ballymakenny-view">Ballymakenny View</option>
          </select>
        </div>

        {/* Quick Stats */}
        <div className="p-4 border-b bg-gray-50">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">3</div>
              <div className="text-xs text-gray-600">Pending Approvals</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-amber-600">12</div>
              <div className="text-xs text-gray-600">Buyer Queries</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">8</div>
              <div className="text-xs text-gray-600">Team Updates</div>
            </div>
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
                        {getConversationTypeIcon(conversation.conversationType)}
                        <h4 className="font-medium text-gray-900 truncate text-sm">
                          {conversation.title}
                        </h4>
                        {getPriorityIndicator(conversation.priority)}
                        {conversation.unreadCount > 0 && (
                          <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      
                      {conversation.projectName && (
                        <div className="text-xs text-gray-500 mb-1">
                          📍 {conversation.projectName}
                        </div>
                      )}
                      
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
                              title={`${participant.userName} (${participant.userRole})`}
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
                    <div className="flex items-center gap-2">
                      {getConversationTypeIcon(selectedConversation.conversationType)}
                      <h3 className="font-semibold text-gray-900">{selectedConversation.title}</h3>
                      {getPriorityIndicator(selectedConversation.priority)}
                      
                      {/* WebSocket Connection Status */}
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-xs text-gray-500">
                          {isConnected ? 'Live' : 'Offline'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Users size={12} className="text-gray-500" />
                      <span className="text-xs text-gray-500">
                        {selectedConversation.participants.length} participants
                      </span>
                      {selectedConversation.projectName && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs text-gray-500">
                            📍 {selectedConversation.projectName}
                          </span>
                        </>
                      )}
                      {selectedConversation.metadata?.deadline && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs text-red-500">
                            ⏰ Deadline: {new Date(selectedConversation.metadata.deadline).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {selectedConversation.conversationType === 'approval_request' && (
                    <>
                      <button className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                        ✅ Approve
                      </button>
                      <button className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                        ❌ Reject
                      </button>
                    </>
                  )}
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
                  const isOwnMessage = message.senderId === 'current_developer'; 
                  const showDate = index === 0 || 
                    formatDate(message.createdAt) !== formatDate(messages[index - 1].createdAt);
                  
                  return (
                    <div key={message.id} id={`message-${message.id}`}>
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
                              {message.priority === 'urgent' && (
                                <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                                  🚨 URGENT
                                </span>
                              )}
                              {message.priority === 'executive' && (
                                <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                                  👑 EXECUTIVE
                                </span>
                              )}
                            </div>
                          )}
                          
                          <div className={`rounded-lg p-3 ${
                            isOwnMessage 
                              ? 'bg-blue-600 text-white' 
                              : message.messageType === 'system'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : message.messageType === 'approval_request'
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            {(message.messageType === 'system' || message.messageType === 'approval_request') && (
                              <div className="flex items-center gap-2 mb-2">
                                {message.messageType === 'system' ? (
                                  <Settings size={14} />
                                ) : (
                                  <Crown size={14} />
                                )}
                                <span className="text-xs font-medium">
                                  {message.messageType === 'system' ? 'System Message' : 'Approval Request'}
                                </span>
                              </div>
                            )}
                            
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-3 space-y-2">
                                {message.attachments.map((attachment) => (
                                  <div key={attachment.id} className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ${
                                    isOwnMessage ? 'bg-blue-500 border-blue-400 hover:bg-blue-400' : 'bg-white border-gray-200 hover:bg-gray-50'
                                  }`}>
                                    <Paperclip size={14} />
                                    <span 
                                      className="text-xs font-medium truncate flex-1"
                                      onClick={() => handleFilePreview(attachment)}
                                    >
                                      {attachment.fileName}
                                    </span>
                                    <button 
                                      className="p-1 hover:bg-black/10 rounded"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const link = document.createElement('a');
                                        link.href = attachment.url;
                                        link.download = attachment.fileName;
                                        link.click();
                                      }}
                                      title="Download file"
                                    >
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
                                  {message.status === 'approved' && <CheckCircle2 size={12} className="text-green-300" />}
                                  {message.status === 'rejected' && <X size={12} className="text-red-300" />}
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
              
              {/* Typing Indicators */}
              {selectedConversation && Array.from(typingUsers.entries())
                .filter(([userId, data]) => data.conversationId === selectedConversation.id && userId !== 'developer_001')
                .map(([userId, data]) => (
                  <div key={userId} className="flex justify-start mb-2">
                    <div className="max-w-xs lg:max-w-md">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-500">{data.userName}</span>
                      </div>
                      <div className="bg-gray-100 text-gray-900 rounded-lg p-3">
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-gray-600">typing</span>
                          <div className="flex gap-1">
                            <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-end gap-3">
                <button 
                  onClick={() => setShowFileUpload(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Attach files"
                >
                  <Paperclip size={16} className="text-gray-600" />
                </button>
                
                <div className="flex-1">
                  <textarea
                    ref={messageInputRef}
                    value={newMessage}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ minHeight: '40px', maxHeight: '120px' }}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <select className="px-2 py-1 border border-gray-300 rounded text-xs">
                    <option value="normal">Normal</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent</option>
                    <option value="executive">Executive</option>
                  </select>
                  
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
            </div>
          </>
        ) : (
          /* No Conversation Selected */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Developer Communication Hub</h3>
              <p className="text-gray-600 mb-4">Select a conversation to manage your team and stakeholder communications</p>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  Team Coordination
                </div>
                <div className="flex items-center gap-2">
                  <Home size={16} />
                  Buyer Management
                </div>
                <div className="flex items-center gap-2">
                  <Crown size={16} />
                  Executive Approvals
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  Meeting Notes
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Approval Panel Overlay */}
      {showApprovalPanel && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg border shadow-lg w-full max-w-md mx-4">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Crown size={16} className="text-red-600" />
                Pending Approvals
              </h3>
              <button 
                onClick={() => setShowApprovalPanel(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="p-3 border border-red-200 rounded-lg bg-red-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-red-900">Budget Increase Request</p>
                    <p className="text-sm text-red-700">Fitzgerald Gardens - Additional €125,000</p>
                  </div>
                  <Crown size={16} className="text-red-600" />
                </div>
              </div>
              <div className="p-3 border border-amber-200 rounded-lg bg-amber-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-amber-900">Timeline Extension</p>
                    <p className="text-sm text-amber-700">Phase 2 completion delay approval</p>
                  </div>
                  <AlertTriangle size={16} className="text-amber-600" />
                </div>
              </div>
              <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-blue-900">Contractor Change</p>
                    <p className="text-sm text-blue-700">Electrical contractor replacement</p>
                  </div>
                  <UserCheck size={16} className="text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Start Conversation Modal */}
      <StartConversationModal
        isOpen={showStartConversation}
        onClose={() => setShowStartConversation(false)}
        onStartConversation={handleStartConversation}
      />

      {/* File Upload Modal */}
      {selectedConversation && (
        <FileUploadModal
          isOpen={showFileUpload}
          onClose={() => setShowFileUpload(false)}
          onUpload={handleFileUpload}
          conversationId={selectedConversation.id}
          maxFileSize={10}
          allowedTypes={['image/*', 'application/pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt', '.zip', '.dwg']}
        />
      )}

      {/* File Preview Modal */}
      {previewFile && (
        <FilePreview
          isOpen={showFilePreview}
          onClose={() => {
            setShowFilePreview(false);
            setPreviewFile(null);
          }}
          file={previewFile}
        />
      )}

      {/* Message Search Modal */}
      <MessageSearchModal
        isOpen={showMessageSearch}
        onClose={() => setShowMessageSearch(false)}
        onSelectMessage={handleSearchResult}
      />

      {/* Automated Routing Panel Modal */}
      {showRoutingPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Bot size={24} className="text-blue-600" />
                Automated Routing Configuration
              </h2>
              <button
                onClick={() => setShowRoutingPanel(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <AutomatedRoutingPanel />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}