'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Plus, 
  Star, 
  Paperclip, 
  Send, 
  Phone, 
  Video, 
  MoreHorizontal,
  Archive,
  Trash2,
  Flag,
  Reply,
  Forward,
  Download,
  Eye,
  Users,
  Building,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  User,
  Settings,
  Bell,
  Pin,
  Tag,
  ChevronDown,
  ChevronRight,
  Circle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export default function MessagesPage() {
  const [selectedConversationsetSelectedConversation] = useState(null);
  const [activeFiltersetActiveFilter] = useState('all');
  const [searchTermsetSearchTerm] = useState('');
  const [showNewMessagesetShowNewMessage] = useState(false);
  const [messageTextsetMessageText] = useState('');

  // Mock conversations data
  const conversations = [
    {
      id: 1,
      subject: 'Electrical Installation Progress Update',
      participants: [
        { name: 'John Murphy', role: 'Electrical Contractor', avatar: 'JM', company: 'Murphy Electrical' },
        { name: 'Sarah Connor', role: 'Project Manager', avatar: 'SC', company: 'Property Developments Ltd' }
      ],
      project: 'Fitzgerald Gardens',
      lastMessage: 'Phase 1 electrical work completed ahead of schedule. Moving to Phase 2 next week.',
      timestamp: '2 hours ago',
      unread: true,
      priority: 'high',
      status: 'active',
      messageCount: 12,
      attachments: 2,
      tags: ['electrical', 'progress'],
      messages: [
        {
          id: 1,
          sender: 'John Murphy',
          content: 'Good morning Sarah, wanted to update you on the electrical progress for Fitzgerald Gardens.',
          timestamp: '2025-06-15 09:30',
          attachments: []
        },
        {
          id: 2,
          sender: 'Sarah Connor',
          content: 'Great to hear from you John. How are we looking on the Phase 1 completion?',
          timestamp: '2025-06-15 09:45',
          attachments: []
        },
        {
          id: 3,
          sender: 'John Murphy',
          content: 'Phase 1 electrical work completed ahead of schedule. Moving to Phase 2 next week. I\'ve attached the completion certificates and inspection reports.',
          timestamp: '2025-06-15 14:20',
          attachments: [
            { name: 'Phase1_Completion_Certificate.pdf', size: '2.1 MB' },
            { name: 'Electrical_Inspection_Report.pdf', size: '1.8 MB' }
          ]
        }
      ]
    },
    {
      id: 2,
      subject: 'Landscaping Design Approval Required',
      participants: [
        { name: 'Mary O\'Brien', role: 'Landscape Architect', avatar: 'MO', company: 'Green Spaces Ltd' },
        { name: 'David Walsh', role: 'Development Manager', avatar: 'DW', company: 'Property Developments Ltd' }
      ],
      project: 'Ballymakenny View',
      lastMessage: 'Updated landscape design attached for your review and approval.',
      timestamp: '4 hours ago',
      unread: true,
      priority: 'medium',
      status: 'pending_approval',
      messageCount: 8,
      attachments: 3,
      tags: ['landscaping', 'approval'],
      messages: [
        {
          id: 1,
          sender: 'Mary O\'Brien',
          content: 'Hi David, I\'ve completed the revised landscape design based on your feedback from last week.',
          timestamp: '2025-06-15 12:00',
          attachments: [
            { name: 'Landscape_Design_Rev3.pdf', size: '15.2 MB' },
            { name: 'Plant_Schedule.xlsx', size: '245 KB' },
            { name: 'Maintenance_Plan.pdf', size: '1.1 MB' }
          ]
        },
        {
          id: 2,
          sender: 'Mary O\'Brien',
          content: 'Updated landscape design attached for your review and approval. The changes include the additional seating areas and revised pathway layout as discussed.',
          timestamp: '2025-06-15 12:15',
          attachments: []
        }
      ]
    },
    {
      id: 3,
      subject: 'Security System Installation Complete',
      participants: [
        { name: 'Tom Kelly', role: 'Security Specialist', avatar: 'TK', company: 'SecureHome Technologies' },
        { name: 'Lisa McCarthy', role: 'Operations Manager', avatar: 'LM', company: 'Property Developments Ltd' }
      ],
      project: 'Ellwood',
      lastMessage: 'All security systems are now operational. Training session scheduled for Monday.',
      timestamp: '1 day ago',
      unread: false,
      priority: 'low',
      status: 'completed',
      messageCount: 15,
      attachments: 5,
      tags: ['security', 'completed'],
      messages: [
        {
          id: 1,
          sender: 'Tom Kelly',
          content: 'Security system installation at Ellwood is now complete. All CCTV cameras, access control systems, and monitoring equipment are operational.',
          timestamp: '2025-06-14 16:30',
          attachments: [
            { name: 'System_Configuration.pdf', size: '3.2 MB' },
            { name: 'User_Manual.pdf', size: '8.7 MB' },
            { name: 'Warranty_Certificate.pdf', size: '1.2 MB' }
          ]
        },
        {
          id: 2,
          sender: 'Tom Kelly',
          content: 'All security systems are now operational. Training session scheduled for Monday at 10 AM for your team.',
          timestamp: '2025-06-14 17:00',
          attachments: []
        }
      ]
    },
    {
      id: 4,
      subject: 'Planning Permission Update - Riverside Manor',
      participants: [
        { name: 'Michael Collins', role: 'Planning Consultant', avatar: 'MC', company: 'Collins Planning Services' },
        { name: 'Emma Murphy', role: 'Legal Advisor', avatar: 'EM', company: 'Property Developments Ltd' }
      ],
      project: 'Riverside Manor',
      lastMessage: 'Planning committee meeting scheduled for July 8th. Need to prepare additional documentation.',
      timestamp: '2 days ago',
      unread: false,
      priority: 'high',
      status: 'action_required',
      messageCount: 6,
      attachments: 1,
      tags: ['planning', 'legal'],
      messages: [
        {
          id: 1,
          sender: 'Michael Collins',
          content: 'Planning committee meeting scheduled for July 8th. Need to prepare additional documentation for the environmental impact assessment.',
          timestamp: '2025-06-13 11:20',
          attachments: [
            { name: 'Planning_Committee_Notice.pdf', size: '980 KB' }
          ]
        }
      ]
    }
  ];

  const communicationStats = {
    totalMessages: conversations.reduce((accconv) => acc + conv.messageCount0),
    unreadCount: conversations.filter(conv => conv.unread).length,
    activeThreads: conversations.filter(conv => conv.status === 'active').length,
    pendingApprovals: conversations.filter(conv => conv.status === 'pending_approval').length,
    avgResponseTime: '2.5 hours',
    completedToday: 3
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'action_required': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const filteredConversations = conversations.filter(conv => {
    if (activeFilter === 'unread' && !conv.unread) return false;
    if (activeFilter === 'high_priority' && conv.priority !== 'high') return false;
    if (activeFilter === 'pending' && conv.status !== 'pending_approval') return false;
    if (searchTerm && !conv.subject.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleSendMessage = () => {
    if (messageText.trim() && selectedConversation) {
      // Add message logic here
      setMessageText('');
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">Messages</h1>
            <button 
              onClick={() => setShowNewMessage(true)}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex space-x-1 text-xs">
            {[
              { key: 'all', label: 'All' },
              { key: 'unread', label: 'Unread' },
              { key: 'high_priority', label: 'High Priority' },
              { key: 'pending', label: 'Pending' }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-3 py-1 rounded-full transition-colors ${
                  activeFilter === filter.key
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{communicationStats.unreadCount}</div>
              <div className="text-gray-600">Unread</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{communicationStats.activeThreads}</div>
              <div className="text-gray-600">Active</div>
            </div>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className={`text-sm font-medium truncate ${conversation.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                      {conversation.subject}
                    </h3>
                    {conversation.unread && (
                      <Circle className="w-2 h-2 text-blue-600 fill-current flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{conversation.project}</p>
                  <p className={`text-xs truncate ${conversation.unread ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                    {conversation.lastMessage}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                  <div className="flex items-center space-x-1">
                    <Flag className={`w-3 h-3 ${getPriorityColor(conversation.priority)}`} />
                    {conversation.attachments> 0 && (
                      <Paperclip className="w-3 h-3 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(conversation.status)}`}>
                    {conversation.status.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-gray-500">{conversation.messageCount} messages</span>
                </div>
                
                <div className="flex -space-x-1">
                  {conversation.participants.slice(0).map((participantindex) => (
                    <div
                      key={index}
                      className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-gray-700"
                    >
                      {participant.avatar}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Conversation Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-lg font-medium text-gray-900">{selectedConversation.subject}</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    <span>{selectedConversation.project}</span>
                    <span>•</span>
                    <span>{selectedConversation.participants.length} participants</span>
                    <span>•</span>
                    <span>{selectedConversation.messageCount} messages</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <Video className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <Pin className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Participants */}
              <div className="flex items-center space-x-4 mt-4">
                {selectedConversation.participants.map((participantindex) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
                      {participant.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                      <p className="text-xs text-gray-500">{participant.role} • {participant.company}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedConversation.messages.map((message) => (
                <div key={message.id} className="flex space-x-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-700 flex-shrink-0">
                    {selectedConversation.participants.find(p => p.name === message.sender)?.avatar || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">{message.sender}</span>
                      <span className="text-xs text-gray-500">{message.timestamp}</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 max-w-2xl">
                      <p className="text-sm text-gray-900">{message.content}</p>
                      
                      {message.attachments.length> 0 && (
                        <div className="mt-3 space-y-2">
                          {message.attachments.map((attachmentindex) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                              <div className="flex items-center space-x-2">
                                <Paperclip className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-900">{attachment.name}</span>
                                <span className="text-xs text-gray-500">({attachment.size})</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button className="text-blue-600 hover:text-blue-500">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="text-blue-600 hover:text-blue-500">
                                  <Download className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                        <Paperclip className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                        <Calendar className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* No Conversation Selected */
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500 mb-6">Choose a conversation from the sidebar to view messages</p>
              <button 
                onClick={() => setShowNewMessage(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Start New Conversation
              </button>
            </div>
          </div>
        )}
      </div>

      {/* New Message Modal */}
      {showNewMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">New Message</h2>
              <button
                onClick={() => setShowNewMessage(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ✕
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add recipients..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                  <option>Select Project</option>
                  <option>Fitzgerald Gardens</option>
                  <option>Ballymakenny View</option>
                  <option>Ellwood</option>
                  <option>Riverside Manor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Message subject..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Type your message..."
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  type="button"
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Paperclip className="w-4 h-4 mr-2" />
                  Attach Files
                </button>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowNewMessage(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}