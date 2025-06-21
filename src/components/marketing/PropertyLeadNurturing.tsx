'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Mail, 
  Target, 
  TrendingUp,
  Clock,
  DollarSign,
  Eye,
  MousePointer,
  Phone,
  MessageSquare,
  Star,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  UserPlus,
  Heart,
  Zap,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Send,
  BarChart3
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  stage: 'AWARENESS' | 'INTEREST' | 'CONSIDERATION' | 'INTENT' | 'EVALUATION' | 'PURCHASE';
  score: number;
  category: 'FIRST_TIME_BUYER' | 'INVESTOR' | 'UPGRADER' | 'CASUAL_BROWSER';
  source: string;
  interests: string[];
  lastActivity: Date;
  totalValue: number;
  engagementLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  nextAction: string;
  daysInFunnel: number;
  propertyViews: number;
  emailOpens: number;
  emailClicks: number;
}

interface MarketingCampaign {
  id: string;
  name: string;
  type: 'EMAIL_SEQUENCE' | 'PROPERTY_ALERT' | 'NURTURE_DRIP' | 'RETARGETING';
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  audienceCount: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  revenue: number;
  startDate: Date;
  endDate?: Date;
}

interface NurturingMetrics {
  totalLeads: number;
  qualifiedLeads: number;
  hotLeads: number;
  conversionRate: number;
  avgTimeToConversion: number;
  revenueFromNurturing: number;
  campaignPerformance: MarketingCampaign[];
  leadsByStage: Record<string, number>;
  leadsBySource: Record<string, number>;
}

const PropertyLeadNurturing: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [metrics, setMetrics] = useState<NurturingMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

  // Mock data based on Kevin's property platform
  const mockLeads: Lead[] = [
    {
      id: '1',
      name: 'Sarah O\'Connor',
      email: 'sarah.oconnor@email.com',
      phone: '+353 87 123 4567',
      stage: 'EVALUATION',
      score: 78,
      category: 'FIRST_TIME_BUYER',
      source: 'Google Ads - First Time Buyer',
      interests: ['4 Bed Semi-Detached', 'Help to Buy', 'Premium Kitchen'],
      lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      totalValue: 495000,
      engagementLevel: 'HIGH',
      nextAction: 'Schedule viewing appointment',
      daysInFunnel: 12,
      propertyViews: 8,
      emailOpens: 5,
      emailClicks: 3
    },
    {
      id: '2',
      name: 'Michael Walsh',
      email: 'michael.walsh@email.com',
      phone: '+353 86 987 6543',
      stage: 'CONSIDERATION',
      score: 65,
      category: 'INVESTOR',
      source: 'Facebook - Property Investment',
      interests: ['1 Bed Apartment', 'Investment Properties', 'Rental Yield'],
      lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      totalValue: 235000,
      engagementLevel: 'MEDIUM',
      nextAction: 'Send investment calculator',
      daysInFunnel: 8,
      propertyViews: 12,
      emailOpens: 7,
      emailClicks: 4
    },
    {
      id: '3',
      name: 'Emma Kelly',
      email: 'emma.kelly@email.com',
      stage: 'INTENT',
      score: 82,
      category: 'UPGRADER',
      source: 'Organic Search - Property Drogheda',
      interests: ['3 Bed Townhouse', 'Family Home', 'Garden'],
      lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000),
      totalValue: 375000,
      engagementLevel: 'URGENT',
      nextAction: 'Call within 24 hours',
      daysInFunnel: 5,
      propertyViews: 15,
      emailOpens: 9,
      emailClicks: 6
    },
    {
      id: '4',
      name: 'David Murphy',
      email: 'david.murphy@email.com',
      stage: 'INTEREST',
      score: 45,
      category: 'CASUAL_BROWSER',
      source: 'Social Media - Facebook',
      interests: ['Property News', 'Market Updates'],
      lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      totalValue: 0,
      engagementLevel: 'LOW',
      nextAction: 'Send market insight newsletter',
      daysInFunnel: 21,
      propertyViews: 3,
      emailOpens: 2,
      emailClicks: 0
    }
  ];

  const mockCampaigns: MarketingCampaign[] = [
    {
      id: '1',
      name: 'First-Time Buyer Welcome Series',
      type: 'EMAIL_SEQUENCE',
      status: 'ACTIVE',
      audienceCount: 156,
      openRate: 0.68,
      clickRate: 0.23,
      conversionRate: 0.12,
      revenue: 987000,
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      name: 'Fitzgerald Gardens Property Alerts',
      type: 'PROPERTY_ALERT',
      status: 'ACTIVE',
      audienceCount: 234,
      openRate: 0.74,
      clickRate: 0.31,
      conversionRate: 0.08,
      revenue: 1245000,
      startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      name: 'Abandoned Search Recovery',
      type: 'RETARGETING',
      status: 'ACTIVE',
      audienceCount: 89,
      openRate: 0.52,
      clickRate: 0.18,
      conversionRate: 0.15,
      revenue: 503500,
      startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    }
  ];

  const mockMetrics: NurturingMetrics = {
    totalLeads: 489,
    qualifiedLeads: 156,
    hotLeads: 23,
    conversionRate: 0.127,
    avgTimeToConversion: 18.5,
    revenueFromNurturing: 2735500,
    campaignPerformance: mockCampaigns,
    leadsByStage: {
      'AWARENESS': 134,
      'INTEREST': 89,
      'CONSIDERATION': 125,
      'INTENT': 67,
      'EVALUATION': 52,
      'PURCHASE': 22
    },
    leadsBySource: {
      'Google Ads': 156,
      'Facebook Ads': 98,
      'Organic Search': 123,
      'Direct': 67,
      'Referral': 45
    }
  };

  useEffect(() => {
    fetchMarketingData();
  }, []);

  const fetchMarketingData = async () => {
    try {
      setLoading(true);
      
      // Fetch real data from API endpoints
      const [leadsResponse, campaignsResponse, metricsResponse] = await Promise.all([
        fetch('/api/marketing/leads'),
        fetch('/api/marketing/campaigns'),
        fetch('/api/marketing/metrics')
      ]);

      if (leadsResponse.ok && campaignsResponse.ok && metricsResponse.ok) {
        const leadsData = await leadsResponse.json();
        const campaignsData = await campaignsResponse.json();
        const metricsData = await metricsResponse.json();

        setLeads(leadsData.data || []);
        setCampaigns(campaignsData.data || []);
        
        // Transform metrics data to match NurturingMetrics interface
        const transformedMetrics = {
          totalLeads: metricsData.data.totalLeads,
          qualifiedLeads: metricsData.data.qualifiedLeads,
          hotLeads: metricsData.data.hotLeads,
          conversionRate: metricsData.data.conversionRate,
          avgTimeToConversion: metricsData.data.avgTimeToConversion,
          revenueFromNurturing: metricsData.data.revenueFromNurturing,
          campaignPerformance: metricsData.data.campaignPerformance,
          leadsByStage: metricsData.data.leadsByStage,
          leadsBySource: metricsData.data.leadsBySource
        };
        
        setMetrics(transformedMetrics);
      } else {
        // Fallback to mock data if API fails
        console.warn('API endpoints not available, using mock data');
        setLeads(mockLeads);
        setCampaigns(mockCampaigns);
        setMetrics(mockMetrics);
      }
    } catch (error) {
      console.error('Failed to fetch marketing data:', error);
      // Fallback to mock data on error
      setLeads(mockLeads);
      setCampaigns(mockCampaigns);
      setMetrics(mockMetrics);
    } finally {
      setLoading(false);
    }
  };

  const getStageColor = (stage: string) => {
    const colors = {
      'AWARENESS': 'bg-gray-100 text-gray-700',
      'INTEREST': 'bg-blue-100 text-blue-700',
      'CONSIDERATION': 'bg-yellow-100 text-yellow-700',
      'INTENT': 'bg-orange-100 text-orange-700',
      'EVALUATION': 'bg-purple-100 text-purple-700',
      'PURCHASE': 'bg-green-100 text-green-700'
    };
    return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getEngagementColor = (level: string) => {
    const colors = {
      'LOW': 'text-gray-500',
      'MEDIUM': 'text-blue-500',
      'HIGH': 'text-orange-500',
      'URGENT': 'text-red-500'
    };
    return colors[level as keyof typeof colors] || 'text-gray-500';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (decimal: number) => {
    return `${(decimal * 100).toFixed(1)}%`;
  };

  const handleBulkAction = async (action: string, campaignType?: string) => {
    if (selectedLeads.length === 0) {
      alert('Please select leads first');
      return;
    }

    try {
      const response = await fetch('/api/marketing/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leadIds: selectedLeads,
          action,
          campaignType
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Bulk action completed: ${result.summary.successful} successful, ${result.summary.failed} failed`);
        setSelectedLeads([]); // Clear selection
        fetchMarketingData(); // Refresh data
      } else {
        alert('Failed to execute bulk action');
      }
    } catch (error) {
      console.error('Bulk action failed:', error);
      alert('Failed to execute bulk action');
    }
  };

  const handleLeadSelection = (leadId: string) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map(lead => lead.id));
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketing Automation</h1>
          <p className="text-gray-600">Lead Nurturing & Campaign Management</p>
        </div>
        
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            New Campaign
          </button>
          
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Sync Data
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'leads', 'campaigns', 'automation'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Leads</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.totalLeads.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                {metrics.qualifiedLeads} qualified leads
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Hot Leads</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.hotLeads}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <Zap className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                Require immediate attention
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPercentage(metrics.conversionRate)}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                {metrics.avgTimeToConversion} days avg. conversion time
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue Generated</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.revenueFromNurturing)}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                From marketing campaigns
              </div>
            </div>
          </div>

          {/* Funnel Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Funnel</h3>
              <div className="space-y-3">
                {Object.entries(metrics.leadsByStage).map(([stage, count], index) => {
                  const percentage = (count / metrics.totalLeads) * 100;
                  return (
                    <div key={stage} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStageColor(stage)}`}>
                          {stage.toLowerCase().replace('_', ' ')}
                        </div>
                        <span className="text-gray-600">{count} leads</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Sources</h3>
              <div className="space-y-3">
                {Object.entries(metrics.leadsBySource).map(([source, count]) => {
                  const percentage = (count / metrics.totalLeads) * 100;
                  return (
                    <div key={source} className="flex items-center justify-between">
                      <span className="text-gray-700">{source}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Campaigns Performance */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Performance</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Audience</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Open Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Click Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                            <div className="text-sm text-gray-500">{campaign.type.replace('_', ' ')}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {campaign.audienceCount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPercentage(campaign.openRate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPercentage(campaign.clickRate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPercentage(campaign.conversionRate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(campaign.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Leads Tab */}
      {activeTab === 'leads' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Lead Management</h3>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleBulkAction('send_email', 'NURTURE_SEQUENCE')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    disabled={selectedLeads.length === 0}
                  >
                    <Send className="w-4 h-4" />
                    Send Email ({selectedLeads.length})
                  </button>
                  <button 
                    onClick={() => handleBulkAction('add_tag', 'high-priority')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                    disabled={selectedLeads.length === 0}
                  >
                    Tag Selected
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input 
                        type="checkbox" 
                        className="rounded" 
                        checked={selectedLeads.length === leads.length && leads.length > 0}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input 
                          type="checkbox" 
                          className="rounded" 
                          checked={selectedLeads.includes(lead.id)}
                          onChange={() => handleLeadSelection(lead.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                            <div className="text-sm text-gray-500">{lead.email}</div>
                            <div className="text-xs text-gray-400">{lead.source}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStageColor(lead.stage)}`}>
                          {lead.stage.toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">{lead.score}</div>
                          <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${lead.score}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lead.totalValue > 0 ? formatCurrency(lead.totalValue) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${getEngagementColor(lead.engagementLevel)}`}>
                          {lead.engagementLevel}
                        </div>
                        <div className="text-xs text-gray-500">
                          {lead.propertyViews} views • {lead.emailOpens} opens
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <span>{lead.nextAction}</span>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    campaign.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {campaign.status}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Audience</span>
                    <span className="text-sm font-medium">{campaign.audienceCount.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Open Rate</span>
                    <span className="text-sm font-medium">{formatPercentage(campaign.openRate)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Click Rate</span>
                    <span className="text-sm font-medium">{formatPercentage(campaign.clickRate)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Conversion</span>
                    <span className="text-sm font-medium">{formatPercentage(campaign.conversionRate)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Revenue</span>
                    <span className="text-sm font-medium text-green-600">{formatCurrency(campaign.revenue)}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">
                      Edit
                    </button>
                    <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Automation Tab */}
      {activeTab === 'automation' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Automated Workflows</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Welcome Series</h4>
                    <p className="text-sm text-gray-600">New lead onboarding</p>
                  </div>
                  <div className="ml-auto">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  5-email sequence introducing Kevin's developments and first-time buyer guidance
                </p>
                <div className="text-xs text-gray-500">
                  156 active subscribers • 68% open rate
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-orange-100 rounded">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Abandoned Search</h4>
                    <p className="text-sm text-gray-600">Re-engagement for browsing visitors</p>
                  </div>
                  <div className="ml-auto">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  Triggered when users view 3+ properties without registering
                </p>
                <div className="text-xs text-gray-500">
                  89 active triggers • 52% conversion rate
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 rounded">
                    <Heart className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Property Favorites</h4>
                    <p className="text-sm text-gray-600">Price drops and availability updates</p>
                  </div>
                  <div className="ml-auto">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  Instant notifications when favorited properties have updates
                </p>
                <div className="text-xs text-gray-500">
                  234 active watchers • 74% open rate
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100 rounded">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Viewing Reminders</h4>
                    <p className="text-sm text-gray-600">Appointment and follow-up automation</p>
                  </div>
                  <div className="ml-auto">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  Automated scheduling and reminder system for property viewings
                </p>
                <div className="text-xs text-gray-500">
                  45 scheduled viewings • 23 completed this week
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyLeadNurturing;