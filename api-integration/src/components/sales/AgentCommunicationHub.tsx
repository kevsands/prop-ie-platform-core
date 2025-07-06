'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Send,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  MapPin,
  Calendar,
  Euro,
  Eye,
  Users,
  Zap,
  Filter,
  Search,
  MoreVertical,
  PhoneCall,
  Video,
  FileText,
  Bell,
  Settings
} from 'lucide-react';
import Image from 'next/image';

interface AgentCommunicationHubProps {
  agentId: string;
  agentName: string;
  className?: string;
}

interface BuyerLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  leadScore: number;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'contacted' | 'viewing_scheduled' | 'offer_made' | 'completed';
  lastActivity: Date;
  interestedProperty: {
    id: string;
    title: string;
    price: number;
    developmentName: string;
  };
  preferredContact: 'email' | 'phone' | 'whatsapp';
  notes: string;
  assignedAt: Date;
  responseTime?: number; // minutes
  engagementLevel: 'low' | 'medium' | 'high';
}

interface CommunicationMessage {
  id: string;
  buyerId: string;
  agentId: string;
  type: 'whatsapp' | 'sms' | 'email' | 'phone' | 'system';
  direction: 'inbound' | 'outbound';
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  template?: string;
  attachments?: string[];
}

interface MessageTemplate {
  id: string;
  name: string;
  category: 'greeting' | 'follow_up' | 'viewing' | 'htb_info' | 'price_update' | 'closing';
  subject?: string;
  content: string;
  variables: string[];
  channels: ('email' | 'sms' | 'whatsapp')[];
}

export default function AgentCommunicationHub({
  agentId,
  agentName,
  className = ''
}: AgentCommunicationHubProps) {
  const [activeTab, setActiveTab] = useState<'leads' | 'messages' | 'templates'>('leads');
  const [leads, setLeads] = useState<BuyerLead[]>([]);
  const [messages, setMessages] = useState<CommunicationMessage[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [selectedLead, setSelectedLead] = useState<BuyerLead | null>(null);
  const [showMessageComposer, setShowMessageComposer] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [messageType, setMessageType] = useState<'whatsapp' | 'sms' | 'email'>('whatsapp');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgentData();
    
    // Real-time updates every 30 seconds
    const interval = setInterval(() => {
      loadLeadsUpdate();
    }, 30000);

    return () => clearInterval(interval);
  }, [agentId]);

  const loadAgentData = async () => {
    setLoading(true);
    try {
      const data = await generateAgentData();
      setLeads(data.leads);
      setMessages(data.messages);
      setTemplates(data.templates);
    } catch (error) {
      console.error('Error loading agent data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLeadsUpdate = async () => {
    try {
      // Simulate real-time lead updates
      const updatedLeads = await generateLeadUpdates();
      setLeads(prev => {
        const updated = [...prev];
        updatedLeads.forEach(newLead => {
          const index = updated.findIndex(l => l.id === newLead.id);
          if (index >= 0) {
            updated[index] = newLead;
          } else {
            updated.unshift(newLead);
          }
        });
        return updated.sort((a, b) => b.leadScore - a.leadScore);
      });
    } catch (error) {
      console.error('Error updating leads:', error);
    }
  };

  const generateAgentData = async () => {
    const leads: BuyerLead[] = [
      {
        id: 'lead-1',
        name: 'Sarah & Mark Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+353 87 123 4567',
        leadScore: 95,
        urgency: 'urgent',
        status: 'viewing_scheduled',
        lastActivity: new Date(Date.now() - 15 * 60 * 1000), // 15 mins ago
        interestedProperty: {
          id: 'fg-unit-15',
          title: 'Unit 15 - 2 Bed Apartment',
          price: 435000,
          developmentName: 'Fitzgerald Gardens'
        },
        preferredContact: 'whatsapp',
        notes: 'First-time buyers, HTB approved for €28k. Very motivated, viewing booked for Saturday 2pm.',
        assignedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        responseTime: 12,
        engagementLevel: 'high'
      },
      {
        id: 'lead-2',
        name: 'Michael O\'Sullivan',
        email: 'michael.osullivan@email.com',
        phone: '+353 86 987 6543',
        leadScore: 88,
        urgency: 'high',
        status: 'contacted',
        lastActivity: new Date(Date.now() - 45 * 60 * 1000), // 45 mins ago
        interestedProperty: {
          id: 'fg-unit-25',
          title: 'Unit 25 - 3 Bed Penthouse',
          price: 520000,
          developmentName: 'Fitzgerald Gardens'
        },
        preferredContact: 'phone',
        notes: 'Investor looking for rental property. Cash buyer, wants to close quickly.',
        assignedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        responseTime: 8,
        engagementLevel: 'high'
      },
      {
        id: 'lead-3',
        name: 'Emma Walsh',
        email: 'emma.walsh@email.com',
        phone: '+353 85 456 7890',
        leadScore: 76,
        urgency: 'medium',
        status: 'new',
        lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        interestedProperty: {
          id: 'fg-unit-18',
          title: 'Unit 18 - 3 Bed Family Home',
          price: 465000,
          developmentName: 'Fitzgerald Gardens'
        },
        preferredContact: 'email',
        notes: 'Family with 2 children, relocating from Dublin. Needs to sell current property first.',
        assignedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        engagementLevel: 'medium'
      }
    ];

    const messages: CommunicationMessage[] = [
      {
        id: 'msg-1',
        buyerId: 'lead-1',
        agentId,
        type: 'whatsapp',
        direction: 'inbound',
        content: 'Hi! Looking forward to the viewing on Saturday. Can we confirm the time?',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        status: 'read'
      },
      {
        id: 'msg-2',
        buyerId: 'lead-1',
        agentId,
        type: 'whatsapp',
        direction: 'outbound',
        content: 'Absolutely! Confirmed for Saturday at 2pm. I\'ll meet you at the development entrance. Looking forward to showing you Unit 15!',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        status: 'read',
        template: 'viewing_confirmation'
      }
    ];

    const templates: MessageTemplate[] = [
      {
        id: 'temp-1',
        name: 'New Lead Welcome',
        category: 'greeting',
        subject: 'Welcome to Fitzgerald Gardens',
        content: 'Hi {{name}}! Thanks for your interest in {{property}}. I\'m {{agent_name}}, your dedicated property consultant. I\'d love to arrange a viewing for you. When would be convenient?',
        variables: ['name', 'property', 'agent_name'],
        channels: ['whatsapp', 'sms', 'email']
      },
      {
        id: 'temp-2',
        name: 'HTB Information',
        category: 'htb_info',
        subject: 'Help to Buy Information',
        content: 'Great news {{name}}! Based on your budget, you may qualify for up to €30,000 Help to Buy support. This could reduce your deposit requirement significantly. Would you like me to arrange a consultation to discuss this?',
        variables: ['name'],
        channels: ['email', 'whatsapp']
      },
      {
        id: 'temp-3',
        name: 'Viewing Confirmation',
        category: 'viewing',
        content: 'Viewing confirmed for {{date}} at {{time}} for {{property}}. Address: {{address}}. My mobile: {{agent_phone}}. Looking forward to meeting you!',
        variables: ['date', 'time', 'property', 'address', 'agent_phone'],
        channels: ['whatsapp', 'sms', 'email']
      },
      {
        id: 'temp-4',
        name: 'Follow Up After Viewing',
        category: 'follow_up',
        subject: 'How did you find {{property}}?',
        content: 'Hi {{name}}, I hope you enjoyed viewing {{property}} today. Do you have any questions? I\'m here to help with the next steps whenever you\'re ready.',
        variables: ['name', 'property'],
        channels: ['whatsapp', 'email']
      }
    ];

    return { leads, messages, templates };
  };

  const generateLeadUpdates = async (): Promise<BuyerLead[]> => {
    // Simulate new lead or lead updates
    const updates: BuyerLead[] = [];
    
    // Randomly add new leads or update existing ones
    if (Math.random() > 0.8) {
      updates.push({
        id: `lead-${Date.now()}`,
        name: 'David & Lisa Murphy',
        email: 'david.murphy@email.com',
        phone: '+353 87 999 8888',
        leadScore: 82,
        urgency: 'high',
        status: 'new',
        lastActivity: new Date(),
        interestedProperty: {
          id: 'fg-unit-20',
          title: 'Unit 20 - 3 Bed Apartment',
          price: 475000,
          developmentName: 'Fitzgerald Gardens'
        },
        preferredContact: 'whatsapp',
        notes: 'Just filled out HTB calculator - qualified for €25k support. Very interested!',
        assignedAt: new Date(),
        engagementLevel: 'high'
      });
    }
    
    return updates;
  };

  const sendMessage = async (
    buyerId: string, 
    content: string, 
    type: 'whatsapp' | 'sms' | 'email',
    templateId?: string
  ) => {
    try {
      const message: CommunicationMessage = {
        id: `msg_${Date.now()}`,
        buyerId,
        agentId,
        type,
        direction: 'outbound',
        content,
        timestamp: new Date(),
        status: 'sent',
        template: templateId
      };

      // Add to messages
      setMessages(prev => [message, ...prev]);

      // Update lead status
      setLeads(prev => prev.map(lead => 
        lead.id === buyerId 
          ? { ...lead, status: 'contacted', lastActivity: new Date() }
          : lead
      ));

      // Simulate delivery status updates
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === message.id ? { ...msg, status: 'delivered' } : msg
        ));
      }, 2000);

      // Track communication in buyer activity system
      await fetch('/api/buyer-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerId,
          sessionId: `agent_session_${Date.now()}`,
          activityType: 'agent_contact',
          data: {
            agentId,
            communicationType: type,
            messageContent: content,
            templateUsed: templateId
          },
          engagement: {
            intensity: 'high',
            timeSpent: 0,
            pageDepth: 1,
            interactionCount: 1
          }
        })
      });

      console.log(`📱 ${type.toUpperCase()} sent to ${buyerId}`);
      
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const useTemplate = (template: MessageTemplate, lead: BuyerLead) => {
    let content = template.content;
    
    // Replace variables
    const variables: { [key: string]: string } = {
      name: lead.name,
      property: lead.interestedProperty.title,
      agent_name: agentName,
      agent_phone: '+353 1 234 5678',
      date: 'Saturday',
      time: '2:00 PM',
      address: 'Fitzgerald Gardens, Drogheda'
    };

    template.variables.forEach(variable => {
      content = content.replace(new RegExp(`{{${variable}}}`, 'g'), variables[variable] || `{{${variable}}}`);
    });

    setMessageContent(content);
    setSelectedTemplate(template);
  };

  const getUrgencyColor = (urgency: BuyerLead['urgency']) => {
    switch (urgency) {
      case 'urgent':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getStatusColor = (status: BuyerLead['status']) => {
    switch (status) {
      case 'new':
        return 'text-blue-600 bg-blue-50';
      case 'contacted':
        return 'text-purple-600 bg-purple-50';
      case 'viewing_scheduled':
        return 'text-green-600 bg-green-50';
      case 'offer_made':
        return 'text-orange-600 bg-orange-50';
      case 'completed':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{agentName}</h2>
              <p className="text-sm text-gray-600">Property Consultant</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Online</span>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mt-4">
          {[
            { id: 'leads', label: 'My Leads', icon: Users, count: leads.length },
            { id: 'messages', label: 'Messages', icon: MessageSquare, count: messages.filter(m => m.direction === 'inbound' && m.status !== 'read').length },
            { id: 'templates', label: 'Templates', icon: FileText, count: templates.length }
          ].map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === id ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-600'
                }`}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'leads' && (
          <div className="space-y-4">
            {/* Lead Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{leads.length}</div>
                <div className="text-sm text-green-600">Active Leads</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {leads.filter(l => l.urgency === 'urgent' || l.urgency === 'high').length}
                </div>
                <div className="text-sm text-orange-600">High Priority</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {leads.filter(l => l.status === 'viewing_scheduled').length}
                </div>
                <div className="text-sm text-blue-600">Viewings Booked</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(leads.reduce((sum, l) => sum + l.leadScore, 0) / leads.length)}
                </div>
                <div className="text-sm text-purple-600">Avg Lead Score</div>
              </div>
            </div>

            {/* Leads List */}
            <div className="space-y-3">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                  onClick={() => setSelectedLead(lead)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(lead.urgency)}`}>
                          {lead.urgency}
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(lead.status)}`}>
                          {lead.status.replace('_', ' ')}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{lead.interestedProperty.title} - {formatCurrency(lead.interestedProperty.price)}</p>
                      <p className="text-sm text-gray-500 line-clamp-2">{lead.notes}</p>
                      
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span>{lead.leadScore}/100</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTimeAgo(lead.lastActivity)}</span>
                        </div>
                        {lead.responseTime && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span>Responded in {lead.responseTime}m</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {/* Quick action buttons */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`https://wa.me/${lead.phone.replace(/\s+/g, '')}`, '_blank');
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`tel:${lead.phone}`, '_self');
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Call"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`mailto:${lead.email}`, '_self');
                        }}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-4">
            {/* Message composer */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <select 
                  className="border border-gray-300 rounded px-3 py-2 text-sm"
                  onChange={(e) => {
                    const lead = leads.find(l => l.id === e.target.value);
                    setSelectedLead(lead || null);
                  }}
                >
                  <option value="">Select lead...</option>
                  {leads.map(lead => (
                    <option key={lead.id} value={lead.id}>{lead.name}</option>
                  ))}
                </select>
                
                <div className="flex gap-1">
                  {['whatsapp', 'sms', 'email'].map(type => (
                    <button
                      key={type}
                      onClick={() => setMessageType(type as any)}
                      className={`px-3 py-2 rounded text-sm font-medium capitalize ${
                        messageType === type
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              
              <textarea
                placeholder="Type your message..."
                rows={3}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
              />
              
              <div className="flex justify-between items-center mt-3">
                <div className="flex gap-2">
                  {templates.slice(0, 3).map(template => (
                    <button
                      key={template.id}
                      onClick={() => selectedLead && useTemplate(template, selectedLead)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200"
                    >
                      {template.name}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => {
                    if (selectedLead && messageContent.trim()) {
                      sendMessage(selectedLead.id, messageContent, messageType, selectedTemplate?.id);
                      setMessageContent('');
                      setSelectedTemplate(null);
                    }
                  }}
                  disabled={!selectedLead || !messageContent.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </div>
            </div>

            {/* Message history */}
            <div className="space-y-3">
              {messages.slice(0, 10).map((message) => {
                const lead = leads.find(l => l.id === message.buyerId);
                return (
                  <div
                    key={message.id}
                    className={`p-3 rounded-lg ${
                      message.direction === 'outbound'
                        ? 'bg-blue-50 ml-8'
                        : 'bg-gray-50 mr-8'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {message.direction === 'outbound' ? 'You' : lead?.name}
                        </span>
                        <span className="text-xs text-gray-500 uppercase">{message.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{formatTimeAgo(message.timestamp)}</span>
                        {message.direction === 'outbound' && (
                          <CheckCircle className={`w-3 h-3 ${
                            message.status === 'read' ? 'text-blue-600' :
                            message.status === 'delivered' ? 'text-green-600' :
                            'text-gray-400'
                          }`} />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{message.content}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Message Templates</h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700">
                Create Template
              </button>
            </div>
            
            <div className="grid gap-4">
              {templates.map((template) => (
                <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{template.name}</h4>
                      <span className="text-sm text-gray-500 capitalize">{template.category.replace('_', ' ')}</span>
                    </div>
                    <div className="flex gap-2">
                      {template.channels.map(channel => (
                        <span key={channel} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded capitalize">
                          {channel}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-3">{template.content}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {template.variables.map(variable => (
                        <span key={variable} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {variable}
                        </span>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => selectedLead && useTemplate(template, selectedLead)}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">Lead Details</h3>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Lead Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{selectedLead.name}</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-600">Email:</span> {selectedLead.email}</p>
                      <p><span className="text-gray-600">Phone:</span> {selectedLead.phone}</p>
                      <p><span className="text-gray-600">Preferred Contact:</span> {selectedLead.preferredContact}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Lead Metrics</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-600">Score:</span> {selectedLead.leadScore}/100</p>
                      <p><span className="text-gray-600">Urgency:</span> <span className="capitalize">{selectedLead.urgency}</span></p>
                      <p><span className="text-gray-600">Engagement:</span> <span className="capitalize">{selectedLead.engagementLevel}</span></p>
                    </div>
                  </div>
                </div>

                {/* Property Interest */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Interested Property</h4>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium">{selectedLead.interestedProperty.title}</p>
                    <p className="text-sm text-gray-600">{selectedLead.interestedProperty.developmentName}</p>
                    <p className="text-lg font-bold text-green-600">{formatCurrency(selectedLead.interestedProperty.price)}</p>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedLead.notes}</p>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedLead(selectedLead);
                      setShowMessageComposer(true);
                    }}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Send Message
                  </button>
                  <button
                    onClick={() => window.open(`tel:${selectedLead.phone}`, '_self')}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Call Now
                  </button>
                  <button
                    onClick={() => window.open(`mailto:${selectedLead.email}`, '_self')}
                    className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}