'use client';

import React, { useState, useMemo } from 'react';
import { 
  MessageSquare,
  Users,
  Calendar,
  FileText,
  Phone,
  Video,
  Mail,
  Bell,
  Clock,
  CheckCircle,
  AlertCircle,
  Pin,
  Search,
  Filter,
  Plus,
  Send,
  Paperclip,
  MoreHorizontal,
  Star,
  Archive,
  Reply,
  Forward,
  Edit,
  Trash2,
  Download,
  Eye,
  Settings,
  UserPlus,
  Building,
  Euro,
  Target,
  Activity,
  Zap,
  Shield,
  Award,
  TrendingUp,
  BarChart3,
  MapPin,
  Camera,
  Mic,
  Share,
  ArrowRight,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

// Communication interfaces
interface Message {
  id: string;
  sender: {
    name: string;
    role: string;
    company: string;
    avatar?: string;
  };
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'meeting' | 'task' | 'financial' | 'system';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  attachments?: {
    name: string;
    type: string;
    size: number;
    url: string;
  }[];
  mentions?: string[];
  reactions?: {
    emoji: string;
    users: string[];
  }[];
  threadCount?: number;
  status?: 'sent' | 'delivered' | 'read' | 'replied';
}

interface Channel {
  id: string;
  name: string;
  type: 'project' | 'team' | 'announcement' | 'support' | 'financial' | 'procurement';
  description: string;
  members: number;
  unreadCount: number;
  lastActivity: Date;
  pinned: boolean;
  private: boolean;
  integrations: string[];
}

interface Meeting {
  id: string;
  title: string;
  type: 'construction_review' | 'team_standup' | 'client_update' | 'financial_review' | 'procurement_meeting';
  startTime: Date;
  duration: number;
  attendees: {
    name: string;
    role: string;
    status: 'accepted' | 'declined' | 'pending';
  }[];
  location: string;
  agenda: string[];
  recordings?: string[];
  notes?: string;
  actionItems?: {
    task: string;
    assignee: string;
    dueDate: Date;
    status: 'pending' | 'in_progress' | 'completed';
  }[];
}

interface Notification {
  id: string;
  type: 'mention' | 'task_assigned' | 'meeting_reminder' | 'financial_alert' | 'system_update' | 'approval_required';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionRequired: boolean;
  source: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
}

interface EnterpriseCollaborationHubProps {
  projectId?: string;
  mode?: 'overview' | 'project_specific';
}

export default function EnterpriseCollaborationHub({ 
  projectId, 
  mode = 'overview' 
}: EnterpriseCollaborationHubProps) {
  const [activeView, setActiveView] = useState<'messages' | 'meetings' | 'notifications' | 'integrations' | 'analytics'>('messages');
  const [selectedChannel, setSelectedChannel] = useState<string>('fitzgerald-general');
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Sample data - in production this would come from real-time APIs
  const channels: Channel[] = [
    {
      id: 'fitzgerald-general',
      name: 'Fitzgerald Gardens - General',
      type: 'project',
      description: 'Main project communication channel',
      members: 18,
      unreadCount: 3,
      lastActivity: new Date('2025-06-17T14:30:00'),
      pinned: true,
      private: false,
      integrations: ['financial-alerts', 'construction-updates', 'team-management']
    },
    {
      id: 'design-team',
      name: 'Design Team',
      type: 'team',
      description: 'Architecture and design coordination',
      members: 8,
      unreadCount: 0,
      lastActivity: new Date('2025-06-17T13:15:00'),
      pinned: false,
      private: false,
      integrations: ['project-timeline', 'document-sharing']
    },
    {
      id: 'construction-daily',
      name: 'Construction Daily Updates',
      type: 'project',
      description: 'Daily construction progress and safety updates',
      members: 12,
      unreadCount: 7,
      lastActivity: new Date('2025-06-17T15:45:00'),
      pinned: true,
      private: false,
      integrations: ['safety-reports', 'progress-tracking', 'financial-control']
    },
    {
      id: 'financial-control',
      name: 'Financial Control Center',
      type: 'financial',
      description: 'Budget alerts, payment schedules, cost control',
      members: 6,
      unreadCount: 2,
      lastActivity: new Date('2025-06-17T12:20:00'),
      pinned: true,
      private: true,
      integrations: ['payment-alerts', 'budget-tracking', 'invoice-matching']
    },
    {
      id: 'procurement-team',
      name: 'Procurement & Tendering',
      type: 'procurement',
      description: 'Vendor management and procurement processes',
      members: 5,
      unreadCount: 1,
      lastActivity: new Date('2025-06-17T11:30:00'),
      pinned: false,
      private: true,
      integrations: ['vendor-alerts', 'tender-updates', 'ai-recommendations']
    }
  ];

  const recentMessages: Message[] = [
    {
      id: '1',
      sender: {
        name: 'Sarah Chen',
        role: 'Lead Architect',
        company: 'Chen Architecture'
      },
      content: 'Foundation inspection completed. All structural elements meet specifications. Ready to proceed with next phase.',
      timestamp: new Date('2025-06-17T14:30:00'),
      type: 'text',
      priority: 'normal',
      status: 'read'
    },
    {
      id: '2',
      sender: {
        name: 'Financial Control System',
        role: 'System',
        company: 'PROP.ie'
      },
      content: 'Payment of €485,000 to Murphy Construction has been processed. Milestone: Foundation Completion achieved.',
      timestamp: new Date('2025-06-17T14:15:00'),
      type: 'financial',
      priority: 'normal',
      status: 'delivered'
    },
    {
      id: '3',
      sender: {
        name: 'Tom Wilson',
        role: 'PSCS',
        company: 'Wilson Safety Consulting'
      },
      content: 'Safety audit completed. 2 minor observations recorded. Full report attached.',
      timestamp: new Date('2025-06-17T13:45:00'),
      type: 'file',
      priority: 'high',
      attachments: [
        {
          name: 'Safety_Audit_June_2025.pdf',
          type: 'pdf',
          size: 2048000,
          url: '/documents/safety-audit.pdf'
        }
      ],
      status: 'read'
    },
    {
      id: '4',
      sender: {
        name: 'AI Procurement System',
        role: 'System',
        company: 'PROP.ie'
      },
      content: 'New tender responses received for Electrical Works. 3 qualified bids ready for evaluation. Recommended vendor: O\'Neill Electrical (Score: 94%).',
      timestamp: new Date('2025-06-17T12:30:00'),
      type: 'system',
      priority: 'normal',
      status: 'read'
    }
  ];

  const upcomingMeetings: Meeting[] = [
    {
      id: '1',
      title: 'Weekly Construction Review',
      type: 'construction_review',
      startTime: new Date('2025-06-18T09:00:00'),
      duration: 60,
      attendees: [
        { name: 'Sarah Chen', role: 'Lead Architect', status: 'accepted' },
        { name: 'Mike O\'Brien', role: 'Structural Engineer', status: 'accepted' },
        { name: 'Tom Wilson', role: 'PSCS', status: 'pending' },
        { name: 'John Murphy', role: 'Main Contractor', status: 'accepted' }
      ],
      location: 'Site Office - Fitzgerald Gardens',
      agenda: [
        'Progress review: Foundation completion',
        'Next phase planning: Superstructure',
        'Safety update and observations',
        'Resource allocation and timeline'
      ]
    },
    {
      id: '2',
      title: 'Financial Control Review',
      type: 'financial_review',
      startTime: new Date('2025-06-18T14:00:00'),
      duration: 45,
      attendees: [
        { name: 'Lisa Chen', role: 'Quantity Surveyor', status: 'accepted' },
        { name: 'David Murphy', role: 'Project Solicitor', status: 'accepted' },
        { name: 'Financial Control System', role: 'System Integration', status: 'accepted' }
      ],
      location: 'Virtual Meeting',
      agenda: [
        'Q2 budget performance review',
        'Payment schedule optimization',
        'Cost variance analysis',
        'Procurement savings opportunities'
      ]
    }
  ];

  const notifications: Notification[] = [
    {
      id: '1',
      type: 'financial_alert',
      title: 'Payment Due Reminder',
      message: 'ESB Networks payment of €125,000 is overdue by 2 days',
      timestamp: new Date('2025-06-17T15:00:00'),
      read: false,
      actionRequired: true,
      source: 'Financial Control System',
      priority: 'high'
    },
    {
      id: '2',
      type: 'approval_required',
      title: 'Tender Evaluation Ready',
      message: 'Electrical Works tender evaluation completed. Your approval required.',
      timestamp: new Date('2025-06-17T14:45:00'),
      read: false,
      actionRequired: true,
      source: 'Procurement System',
      priority: 'normal'
    },
    {
      id: '3',
      type: 'meeting_reminder',
      title: 'Meeting in 30 minutes',
      message: 'Weekly Construction Review starting at 9:00 AM',
      timestamp: new Date('2025-06-17T08:30:00'),
      read: true,
      actionRequired: false,
      source: 'Calendar',
      priority: 'normal'
    }
  ];

  const integrationSummary = {
    teamManagement: {
      activeMembers: 32,
      onlineNow: 18,
      recentUpdates: 4
    },
    financialControl: {
      pendingPayments: 4,
      budgetAlerts: 2,
      approvals: 1
    },
    procurement: {
      activeTenders: 3,
      newBids: 8,
      evaluations: 2
    },
    analytics: {
      projectHealth: 92,
      teamEfficiency: 94,
      costPerformance: 96
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl text-white p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Enterprise Collaboration Hub</h1>
            <p className="text-indigo-100 text-lg">
              Unified communication platform integrating team management, financial control, and project coordination
            </p>
            <div className="flex items-center mt-4 space-x-6">
              <div className="flex items-center">
                <Users className="mr-2" size={20} />
                <span className="font-medium">{integrationSummary.teamManagement.onlineNow} Online Now</span>
              </div>
              <div className="flex items-center">
                <MessageSquare className="mr-2" size={20} />
                <span className="font-medium">{channels.reduce((sum, ch) => sum + ch.unreadCount, 0)} Unread Messages</span>
              </div>
              <div className="flex items-center">
                <Bell className="mr-2" size={20} />
                <span className="font-medium">{notifications.filter(n => !n.read).length} Active Alerts</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{integrationSummary.analytics.projectHealth}%</div>
            <div className="text-indigo-200">Project Health Score</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'messages', label: 'Communication Channels', icon: MessageSquare },
            { id: 'meetings', label: 'Meetings & Events', icon: Calendar },
            { id: 'notifications', label: 'Alerts & Notifications', icon: Bell },
            { id: 'integrations', label: 'System Integrations', icon: Zap },
            { id: 'analytics', label: 'Collaboration Analytics', icon: BarChart3 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                activeView === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Communication Channels */}
      {activeView === 'messages' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
          {/* Channel Sidebar */}
          <div className="bg-white rounded-lg border p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Channels</h3>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Plus size={16} />
              </button>
            </div>
            
            <div className="space-y-2">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedChannel === channel.id
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{channel.name}</span>
                      {channel.pinned && <Pin size={12} className="text-gray-400" />}
                      {channel.private && <Shield size={12} className="text-gray-400" />}
                    </div>
                    {channel.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {channel.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 mb-1">{channel.description}</div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{channel.members} members</span>
                    <span>{channel.lastActivity.toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {channel.integrations.slice(0, 2).map((integration, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-1 py-0.5 rounded">
                        {integration.split('-')[0]}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Message Area */}
          <div className="lg:col-span-2 bg-white rounded-lg border flex flex-col">
            {/* Channel Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {channels.find(ch => ch.id === selectedChannel)?.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {channels.find(ch => ch.id === selectedChannel)?.members} members • 
                    Active integrations: {channels.find(ch => ch.id === selectedChannel)?.integrations.length}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Phone size={16} />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Video size={16} />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Settings size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {recentMessages.map((message) => (
                <div key={message.id} className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {message.sender.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-medium text-gray-900">{message.sender.name}</span>
                      <span className="text-xs text-gray-500">{message.sender.role}</span>
                      <span className="text-xs text-gray-400">{message.timestamp.toLocaleTimeString()}</span>
                      {message.priority === 'high' && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">High Priority</span>
                      )}
                    </div>
                    <div className="text-gray-700 text-sm mb-2">{message.content}</div>
                    {message.attachments && (
                      <div className="flex gap-2 mb-2">
                        {message.attachments.map((attachment, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded border text-xs">
                            <FileText size={14} />
                            <span>{attachment.name}</span>
                            <span className="text-gray-500">({(attachment.size / 1024 / 1024).toFixed(1)}MB)</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <button className="hover:text-gray-700">Reply</button>
                      <button className="hover:text-gray-700">React</button>
                      <button className="hover:text-gray-700">Share</button>
                      <span>{message.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Paperclip size={16} />
                </button>
                <button className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Meetings & Events */}
      {activeView === 'meetings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Meetings & Events</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Calendar size={16} />
                View Calendar
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2">
                <Plus size={16} />
                Schedule Meeting
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upcomingMeetings.map((meeting) => (
              <div key={meeting.id} className="bg-white rounded-lg border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{meeting.title}</h3>
                    <p className="text-sm text-gray-600 capitalize">{meeting.type.replace('_', ' ')}</p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {meeting.startTime.toLocaleDateString()}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={14} className="text-gray-500" />
                    <span>{meeting.startTime.toLocaleTimeString()} - {meeting.duration} minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={14} className="text-gray-500" />
                    <span>{meeting.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users size={14} className="text-gray-500" />
                    <span>{meeting.attendees.length} attendees</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Agenda</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {meeting.agenda.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-gray-400">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700">
                    Join Meeting
                  </button>
                  <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notifications */}
      {activeView === 'notifications' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Alerts & Notifications</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Filter size={16} />
                Filter
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2">
                <CheckCircle size={16} />
                Mark All Read
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className={`bg-white rounded-lg border p-4 ${
                !notification.read ? 'border-l-4 border-l-indigo-500' : ''
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      notification.priority === 'critical' ? 'bg-red-100 text-red-600' :
                      notification.priority === 'high' ? 'bg-orange-100 text-orange-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {notification.type === 'financial_alert' && <Euro size={16} />}
                      {notification.type === 'approval_required' && <CheckCircle size={16} />}
                      {notification.type === 'meeting_reminder' && <Calendar size={16} />}
                      {notification.type === 'mention' && <MessageSquare size={16} />}
                      {notification.type === 'task_assigned' && <Target size={16} />}
                      {notification.type === 'system_update' && <Zap size={16} />}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span>{notification.source}</span>
                        <span>{notification.timestamp.toLocaleString()}</span>
                        <span className={`px-2 py-0.5 rounded-full ${
                          notification.priority === 'critical' ? 'bg-red-100 text-red-800' :
                          notification.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {notification.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {notification.actionRequired && (
                      <button className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700">
                        Take Action
                      </button>
                    )}
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System Integrations Dashboard */}
      {activeView === 'integrations' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">System Integrations Dashboard</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Settings size={16} />
                Configure
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2">
                <Zap size={16} />
                Add Integration
              </button>
            </div>
          </div>

          {/* Integration Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Team Management Integration */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Team Management</h3>
                    <p className="text-sm text-gray-600">Comprehensive team coordination</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-green-600 font-medium">Active</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Active Members</span>
                  <span className="font-medium">{integrationSummary.teamManagement.activeMembers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Online Now</span>
                  <span className="font-medium">{integrationSummary.teamManagement.onlineNow}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Recent Updates</span>
                  <span className="font-medium">{integrationSummary.teamManagement.recentUpdates}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex gap-2">
                  <button className="flex-1 text-xs bg-blue-50 text-blue-700 py-2 rounded hover:bg-blue-100">
                    View Details
                  </button>
                  <button className="flex-1 text-xs border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50">
                    Configure
                  </button>
                </div>
              </div>
            </div>

            {/* Financial Control Integration */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Euro className="text-green-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Financial Control</h3>
                    <p className="text-sm text-gray-600">Budget and payment management</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-green-600 font-medium">Active</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pending Payments</span>
                  <span className="font-medium">{integrationSummary.financialControl.pendingPayments}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Budget Alerts</span>
                  <span className="font-medium text-orange-600">{integrationSummary.financialControl.budgetAlerts}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Approvals Required</span>
                  <span className="font-medium text-red-600">{integrationSummary.financialControl.approvals}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex gap-2">
                  <button className="flex-1 text-xs bg-green-50 text-green-700 py-2 rounded hover:bg-green-100">
                    View Details
                  </button>
                  <button className="flex-1 text-xs border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50">
                    Configure
                  </button>
                </div>
              </div>
            </div>

            {/* Procurement Integration */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Briefcase className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">AI Procurement</h3>
                    <p className="text-sm text-gray-600">Automated tendering & vendor management</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-green-600 font-medium">Active</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Active Tenders</span>
                  <span className="font-medium">{integrationSummary.procurement.activeTenders}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">New Bids</span>
                  <span className="font-medium text-blue-600">{integrationSummary.procurement.newBids}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Evaluations Pending</span>
                  <span className="font-medium">{integrationSummary.procurement.evaluations}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex gap-2">
                  <button className="flex-1 text-xs bg-purple-50 text-purple-700 py-2 rounded hover:bg-purple-100">
                    View Details
                  </button>
                  <button className="flex-1 text-xs border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50">
                    Configure
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Integration Flow Diagram */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Integration Flow</h3>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <Users className="text-blue-600" size={20} />
                </div>
                <span className="text-sm font-medium">Team Management</span>
              </div>
              <ArrowRight className="text-gray-400" size={20} />
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
                  <MessageSquare className="text-indigo-600" size={20} />
                </div>
                <span className="text-sm font-medium">Collaboration Hub</span>
              </div>
              <ArrowRight className="text-gray-400" size={20} />
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <Euro className="text-green-600" size={20} />
                </div>
                <span className="text-sm font-medium">Financial Control</span>
              </div>
              <ArrowRight className="text-gray-400" size={20} />
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                  <Briefcase className="text-purple-600" size={20} />
                </div>
                <span className="text-sm font-medium">Procurement</span>
              </div>
            </div>
          </div>

          {/* Integration Logs */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Integration Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="text-green-600" size={16} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Payment processed via Financial Control</p>
                  <p className="text-xs text-gray-600">€485,000 to Murphy Construction - Foundation Milestone</p>
                </div>
                <span className="text-xs text-gray-500">2 min ago</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Zap className="text-blue-600" size={16} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">AI Procurement recommendation</p>
                  <p className="text-xs text-gray-600">O'Neill Electrical ranked #1 for Electrical Works tender</p>
                </div>
                <span className="text-xs text-gray-500">15 min ago</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <Users className="text-purple-600" size={16} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Team member status update</p>
                  <p className="text-xs text-gray-600">Sarah Chen (Lead Architect) marked Foundation Inspection as complete</p>
                </div>
                <span className="text-xs text-gray-500">1 hour ago</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collaboration Analytics */}
      {activeView === 'analytics' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Collaboration Analytics</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Download size={16} />
                Export Report
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2">
                <BarChart3 size={16} />
                Advanced Analytics
              </button>
            </div>
          </div>

          {/* Key Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Project Health Score</h3>
                  <p className="text-3xl font-bold text-green-600">{integrationSummary.analytics.projectHealth}%</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Activity className="text-green-600" size={20} />
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: `${integrationSummary.analytics.projectHealth}%`}}></div>
              </div>
              <p className="text-xs text-gray-600 mt-2">↑ 4% from last month</p>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Team Efficiency</h3>
                  <p className="text-3xl font-bold text-blue-600">{integrationSummary.analytics.teamEfficiency}%</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="text-blue-600" size={20} />
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: `${integrationSummary.analytics.teamEfficiency}%`}}></div>
              </div>
              <p className="text-xs text-gray-600 mt-2">↑ 2% from last week</p>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Cost Performance</h3>
                  <p className="text-3xl font-bold text-purple-600">{integrationSummary.analytics.costPerformance}%</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Euro className="text-purple-600" size={20} />
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{width: `${integrationSummary.analytics.costPerformance}%`}}></div>
              </div>
              <p className="text-xs text-gray-600 mt-2">↑ 8% from last month</p>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Communication Score</h3>
                  <p className="text-3xl font-bold text-orange-600">88%</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <MessageSquare className="text-orange-600" size={20} />
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{width: '88%'}}></div>
              </div>
              <p className="text-xs text-gray-600 mt-2">↑ 6% from last week</p>
            </div>
          </div>

          {/* Communication Activity Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Communication Volume</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Messages</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '75%'}}></div>
                    </div>
                    <span className="text-sm font-medium">245</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Meetings</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '60%'}}></div>
                    </div>
                    <span className="text-sm font-medium">12</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Documents Shared</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{width: '45%'}}></div>
                    </div>
                    <span className="text-sm font-medium">18</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">System Alerts</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{width: '30%'}}></div>
                    </div>
                    <span className="text-sm font-medium">8</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Responsiveness</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Response Time</span>
                  <span className="text-lg font-bold text-green-600">12 min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Meeting Attendance Rate</span>
                  <span className="text-lg font-bold text-blue-600">94%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Task Completion Rate</span>
                  <span className="text-lg font-bold text-purple-600">89%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Issue Resolution Time</span>
                  <span className="text-lg font-bold text-orange-600">4.2 hrs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Team Performance Breakdown */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Performance by Department</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-blue-900">Design Team</h4>
                  <span className="text-sm text-blue-600 font-semibold">92%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '92%'}}></div>
                </div>
                <p className="text-xs text-blue-700">8 active members • 4 projects</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-green-900">Construction</h4>
                  <span className="text-sm text-green-600 font-semibold">96%</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2 mb-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '96%'}}></div>
                </div>
                <p className="text-xs text-green-700">12 active members • 2 projects</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-purple-900">Financial</h4>
                  <span className="text-sm text-purple-600 font-semibold">94%</span>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2 mb-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{width: '94%'}}></div>
                </div>
                <p className="text-xs text-purple-700">6 active members • 3 projects</p>
              </div>
            </div>
          </div>

          {/* Collaboration Insights */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Collaboration Insights & Recommendations</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="text-green-600 mt-0.5" size={16} />
                <div>
                  <h4 className="font-medium text-green-900">High Performance Area</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Construction team showing excellent communication patterns with 96% efficiency. 
                    Daily standups and progress updates are working well.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <Lightbulb className="text-blue-600 mt-0.5" size={16} />
                <div>
                  <h4 className="font-medium text-blue-900">Optimization Opportunity</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Consider implementing automated status updates for the design team to reduce manual reporting overhead and improve response times.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
                <AlertCircle className="text-orange-600 mt-0.5" size={16} />
                <div>
                  <h4 className="font-medium text-orange-900">Action Required</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    Financial team response time has increased by 15% this week. Schedule a check-in to identify potential bottlenecks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}