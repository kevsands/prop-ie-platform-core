'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Home,
  DollarSign,
  Clock,
  Star,
  TrendingUp,
  Target,
  Eye,
  Edit,
  Trash2,
  MessageSquare,
  Video,
  UserPlus,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Download,
  Upload,
  Tag,
  Activity,
  Zap,
  Heart,
  Award,
  Building2,
  User,
  Briefcase,
  ChevronDown,
  ChevronRight,
  Bell
} from 'lucide-react';
import Link from 'next/link';
import { agentBuyerIntegrationService, AgentLead, PropertyInterest } from '@/services/AgentBuyerIntegrationService';

interface AgentLeadsPageProps {}

export default function AgentLeadsPage({}: AgentLeadsPageProps) {
  const [leads, setLeads] = useState<AgentLead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<AgentLead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('lastContact');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Mock agent ID - in production this would come from auth context
  const currentAgentId = 'agent-001';

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    filterAndSortLeads();
  }, [leads, searchTerm, statusFilter, priorityFilter, sourceFilter, sortBy]);

  const loadLeads = async () => {
    try {
      setLoading(true);
      
      // Get leads for this agent
      const agentLeads = agentBuyerIntegrationService.getAgentLeads(currentAgentId);
      setLeads(agentLeads);

    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortLeads = () => {
    const filtered = leads.filter(lead => {
      const matchesSearch = lead.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lead.buyer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lead.interests.some(interest => 
                             interest.locations.some(loc => 
                               loc.toLowerCase().includes(searchTerm.toLowerCase())
                             )
                           );

      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;
      const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesSource;
    });

    // Sort leads
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.buyer.name.localeCompare(b.buyer.name);
        case 'priority':
          const priorityOrder = { urgent: 0, hot: 1, warm: 2, cold: 3 };
          return priorityOrder[a.priority as keyof typeof priorityOrder] - 
                 priorityOrder[b.priority as keyof typeof priorityOrder];
        case 'value':
          return b.potentialValue - a.potentialValue;
        case 'conversion':
          return b.conversionProbability - a.conversionProbability;
        case 'lastContact':
        default:
          return new Date(b.timeline.lastContact).getTime() - new Date(a.timeline.lastContact).getTime();
      }
    });

    setFilteredLeads(filtered);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadLeads();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleCreateLead = async (leadData: any) => {
    try {
      setLoading(true);

      // Convert form data to property interests
      const propertyInterests: PropertyInterest[] = [{
        propertyType: leadData.propertyTypes || ['apartment'],
        priceRange: {
          min: leadData.budgetMin || 200000,
          max: leadData.budgetMax || 500000
        },
        locations: leadData.locations ? leadData.locations.split(',').map((l: string) => l.trim()) : ['Dublin'],
        bedrooms: leadData.bedrooms || [2, 3],
        requirements: leadData.requirements ? leadData.requirements.split(',').map((r: string) => r.trim()) : [],
        dealBreakers: [],
        htbEligible: leadData.htbEligible || false,
        timeframe: leadData.timeframe || '3-6_months'
      }];

      await agentBuyerIntegrationService.createAgentLead(
        currentAgentId,
        {
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone,
          address: leadData.address || '',
          employmentStatus: leadData.employmentStatus || 'employed',
          annualIncome: leadData.annualIncome || 0,
          htbEligible: leadData.htbEligible || false,
          mortgagePreApproval: leadData.mortgagePreApproval || false
        },
        propertyInterests,
        leadData.source || 'website'
      );

      await loadLeads();
      setShowNewLeadModal(false);

    } catch (error) {
      console.error('Error creating lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLeadStatus = async (leadId: string, newStatus: AgentLead['status']) => {
    try {
      agentBuyerIntegrationService.updateLeadStatus(leadId, newStatus);
      await loadLeads();
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const handleAddInteraction = async (leadId: string, interaction: any) => {
    try {
      agentBuyerIntegrationService.addLeadInteraction(leadId, {
        type: interaction.type,
        date: new Date(),
        duration: interaction.duration,
        outcome: interaction.outcome,
        notes: interaction.notes
      });
      await loadLeads();
    } catch (error) {
      console.error('Error adding interaction:', error);
    }
  };

  const getStatusColor = (status: AgentLead['status']) => {
    const colors = {
      'new': 'bg-blue-100 text-blue-800',
      'contacted': 'bg-yellow-100 text-yellow-800',
      'qualified': 'bg-purple-100 text-purple-800',
      'viewing_scheduled': 'bg-indigo-100 text-indigo-800',
      'offer_made': 'bg-orange-100 text-orange-800',
      'converted': 'bg-green-100 text-green-800',
      'lost': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: AgentLead['priority']) => {
    const colors = {
      'hot': 'bg-red-100 text-red-800 border-red-200',
      'warm': 'bg-orange-100 text-orange-800 border-orange-200',
      'cold': 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  // Calculate lead metrics
  const leadMetrics = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    hot: leads.filter(l => l.priority === 'hot').length,
    thisWeek: leads.filter(l => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(l.createdAt) > weekAgo;
    }).length,
    converted: leads.filter(l => l.status === 'converted').length,
    averageValue: leads.length > 0 ? leads.reduce((sum, l) => sum + l.potentialValue, 0) / leads.length : 0,
    conversionRate: leads.length > 0 ? (leads.filter(l => l.status === 'converted').length / leads.length) * 100 : 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
          <p className="text-gray-600 mt-1">
            Manage and track your property buyer leads
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download size={16} />
            Export
          </button>
          <button
            onClick={() => setShowNewLeadModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            New Lead
          </button>
        </div>
      </div>

      {/* Lead Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{leadMetrics.total}</p>
            </div>
            <Users size={24} className="text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New This Week</p>
              <p className="text-2xl font-bold text-gray-900">{leadMetrics.thisWeek}</p>
            </div>
            <Plus size={24} className="text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Hot Leads</p>
              <p className="text-2xl font-bold text-gray-900">{leadMetrics.hot}</p>
            </div>
            <Star size={24} className="text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Converted</p>
              <p className="text-2xl font-bold text-gray-900">{leadMetrics.converted}</p>
            </div>
            <CheckCircle2 size={24} className="text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(leadMetrics.averageValue).replace('.00', '')}
              </p>
            </div>
            <DollarSign size={24} className="text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{leadMetrics.conversionRate.toFixed(1)}%</p>
            </div>
            <Target size={24} className="text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="viewing_scheduled">Viewing Scheduled</option>
            <option value="offer_made">Offer Made</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Priority</option>
            <option value="hot">Hot</option>
            <option value="warm">Warm</option>
            <option value="cold">Cold</option>
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Sources</option>
            <option value="website">Website</option>
            <option value="referral">Referral</option>
            <option value="social_media">Social Media</option>
            <option value="advertising">Advertising</option>
            <option value="walk_in">Walk-in</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="lastContact">Last Contact</option>
            <option value="name">Name</option>
            <option value="priority">Priority</option>
            <option value="value">Potential Value</option>
            <option value="conversion">Conversion Probability</option>
          </select>
        </div>
      </div>

      {/* Leads List */}
      <div className="bg-white rounded-lg border">
        {loading ? (
          <div className="p-8 text-center">
            <RefreshCw size={24} className="animate-spin mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Loading leads...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-8 text-center">
            <Users size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || sourceFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Start by creating your first lead'
              }
            </p>
            {leads.length === 0 && (
              <button
                onClick={() => setShowNewLeadModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Lead
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User size={20} className="text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{lead.buyer.name}</h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(lead.priority)}`}>
                          {lead.priority}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                          {lead.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Contact</p>
                          <p className="text-sm font-medium text-gray-900">{lead.buyer.email}</p>
                          <p className="text-sm text-gray-600">{lead.buyer.phone}</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Budget & Timeline</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(lead.interests[0]?.priceRange.max || 0)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {lead.interests[0]?.timeframe.replace('_', '-') || 'Not specified'}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Interest & Location</p>
                          <p className="text-sm font-medium text-gray-900">
                            {lead.interests[0]?.propertyType[0] || 'Any type'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {lead.interests[0]?.locations[0] || 'Any location'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-2">
                          <DollarSign size={14} />
                          <span>Value: {formatCurrency(lead.potentialValue)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target size={14} />
                          <span>Conversion: {(lead.conversionProbability * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          <span>Last contact: {getTimeAgo(lead.timeline.lastContact.toString())}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity size={14} />
                          <span>Source: {lead.source.replace('_', ' ')}</span>
                        </div>
                      </div>

                      {lead.tags.length > 0 && (
                        <div className="flex items-center gap-2 mb-3">
                          {lead.tags.map((tag, index) => (
                            <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {lead.notes && (
                        <p className="text-sm text-gray-600 italic mb-3">
                          "{lead.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Phone size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <Mail size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                      <MessageSquare size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                      <Calendar size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Lead Modal (simplified for demo) */}
      {showNewLeadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold mb-4">Create New Lead</h2>
            <p className="text-gray-600 mb-4">New lead form would be implemented here</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowNewLeadModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowNewLeadModal(false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}