'use client';

import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Users, 
  TrendingUp, 
  Target,
  BarChart3,
  Eye,
  MousePointer,
  DollarSign,
  Filter,
  Search,
  Download,
  Plus,
  Settings,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  UserCheck,
  Zap,
  Star,
  Calendar,
  ArrowUp,
  ArrowDown,
  RefreshCw
} from 'lucide-react';

// Types
import { 
  emailMarketingEngine, 
  UserCategory, 
  EmailCampaignType, 
  LeadScore 
} from '../../../services/emailMarketingEngine';

export default function EmailMarketingDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState<UserCategory | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock analytics data
  const mockAnalytics = {
    totalContacts: 2847,
    totalCampaigns: 12,
    activeCampaigns: 8,
    averageOpenRate: 34.7,
    averageClickRate: 8.2,
    totalRevenue: 47350.50,
    categoryBreakdown: {
      [UserCategory.FIRST_TIME_BUYER]: 1024,
      [UserCategory.PROPERTY_INVESTOR]: 623,
      [UserCategory.DEVELOPER]: 89,
      [UserCategory.CONTRACTOR]: 156,
      [UserCategory.HIGH_VALUE_PROSPECT]: 234,
      [UserCategory.CASUAL_BROWSER]: 721
    }
  };

  const mockContacts = [
    {
      id: '1',
      email: 'sarah.mccarthy@email.com',
      firstName: 'Sarah',
      lastName: 'McCarthy',
      category: UserCategory.FIRST_TIME_BUYER,
      leadScore: 78,
      leadGrade: LeadScore.HOT,
      revenueGenerated: 2850,
      lastVisit: new Date('2025-06-15'),
      tags: ['high-intent', 'mobile-user', 'engaged-visitor']
    },
    {
      id: '2', 
      email: 'michael.obrien@investments.ie',
      firstName: 'Michael',
      lastName: 'O\'Brien',
      category: UserCategory.PROPERTY_INVESTOR,
      leadScore: 92,
      leadGrade: LeadScore.URGENT,
      revenueGenerated: 12500,
      lastVisit: new Date('2025-06-14'),
      tags: ['high-value', 'repeat-visitor', 'multiple-properties']
    },
    {
      id: '3',
      email: 'info@cairnhomes.ie',
      firstName: 'Cairn',
      lastName: 'Homes',
      category: UserCategory.DEVELOPER,
      leadScore: 95,
      leadGrade: LeadScore.URGENT,
      revenueGenerated: 25000,
      lastVisit: new Date('2025-06-15'),
      tags: ['enterprise-client', 'subscription-customer']
    }
  ];

  const mockCampaigns = [
    {
      id: 'camp-1',
      name: 'First-Time Buyer Welcome Series',
      type: EmailCampaignType.WELCOME_SERIES,
      subject: 'Welcome to Your Property Journey 🏠',
      targetCategory: [UserCategory.FIRST_TIME_BUYER],
      performance: {
        sent: 1024,
        opened: 398,
        clicked: 87,
        converted: 23,
        revenue: 8950.00
      },
      isActive: true,
      createdAt: new Date('2025-06-01')
    },
    {
      id: 'camp-2',
      name: 'Investment Opportunity Alerts',
      type: EmailCampaignType.INVESTMENT_OPPORTUNITIES,
      subject: 'Exclusive Investment Properties - High ROI 📈',
      targetCategory: [UserCategory.PROPERTY_INVESTOR],
      performance: {
        sent: 623,
        opened: 267,
        clicked: 94,
        converted: 31,
        revenue: 18750.00
      },
      isActive: true,
      createdAt: new Date('2025-05-28')
    },
    {
      id: 'camp-3',
      name: 'Developer Onboarding',
      type: EmailCampaignType.DEVELOPER_ONBOARDING,
      subject: 'Maximize Your Sales with PROP Platform',
      targetCategory: [UserCategory.DEVELOPER],
      performance: {
        sent: 89,
        opened: 76,
        clicked: 34,
        converted: 12,
        revenue: 29880.00
      },
      isActive: true,
      createdAt: new Date('2025-06-10')
    }
  ];

  useEffect(() => {
    // Simulate loading analytics
    const timer = setTimeout(() => {
      setAnalytics(mockAnalytics);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const getLeadScoreColor = (score: number) => {
    if (score >= 76) return 'text-red-600 bg-red-100';
    if (score >= 51) return 'text-orange-600 bg-orange-100';
    if (score >= 26) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getCategoryIcon = (category: UserCategory) => {
    switch (category) {
      case UserCategory.FIRST_TIME_BUYER:
        return <UserCheck className="w-4 h-4" />;
      case UserCategory.PROPERTY_INVESTOR:
        return <TrendingUp className="w-4 h-4" />;
      case UserCategory.DEVELOPER:
        return <Settings className="w-4 h-4" />;
      case UserCategory.CONTRACTOR:
        return <Activity className="w-4 h-4" />;
      case UserCategory.HIGH_VALUE_PROSPECT:
        return <Star className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateRate = (numerator: number, denominator: number) => {
    return denominator > 0 ? ((numerator / denominator) * 100).toFixed(1) : '0.0';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading email marketing analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Email Marketing</h1>
              <p className="text-gray-600 mt-1">Manage leads, campaigns, and email performance</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalContacts.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 text-sm font-medium">+12.3%</span>
              <span className="text-gray-500 text-sm ml-2">vs last month</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Open Rate</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.averageOpenRate.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 text-sm font-medium">+3.2%</span>
              <span className="text-gray-500 text-sm ml-2">vs industry avg</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Click Rate</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.averageClickRate.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MousePointer className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 text-sm font-medium">+1.8%</span>
              <span className="text-gray-500 text-sm ml-2">vs last month</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Email Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.totalRevenue)}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 text-sm font-medium">+28.7%</span>
              <span className="text-gray-500 text-sm ml-2">vs last month</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'overview', label: 'Overview', icon: BarChart3 },
                { key: 'contacts', label: 'Contacts', icon: Users },
                { key: 'campaigns', label: 'Campaigns', icon: Mail },
                { key: 'automation', label: 'Automation', icon: Zap },
                { key: 'analytics', label: 'Analytics', icon: TrendingUp }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.key
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Category Breakdown */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Contact Categories</h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(analytics.categoryBreakdown).map(([category, count]) => (
                  <div key={category} className="flex items-center p-4 border border-gray-200 rounded-lg">
                    <div className="mr-3">
                      {getCategoryIcon(category as UserCategory)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{count}</p>
                      <p className="text-sm text-gray-500">{category.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performing Campaigns */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Top Performing Campaigns</h3>
              <div className="space-y-4">
                {mockCampaigns.slice(0, 3).map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                      <p className="text-sm text-gray-500">{campaign.subject}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(campaign.performance.revenue)}</p>
                      <p className="text-sm text-gray-500">
                        {calculateRate(campaign.performance.opened, campaign.performance.sent)}% open rate
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Contact Management</h3>
                <div className="flex items-center space-x-3">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as UserCategory | 'ALL')}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="ALL">All Categories</option>
                    {Object.values(UserCategory).map(category => (
                      <option key={category} value={category}>
                        {category.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search contacts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Contacts Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lead Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Visit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockContacts.map((contact) => (
                      <tr key={contact.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {contact.firstName} {contact.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{contact.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getCategoryIcon(contact.category)}
                            <span className="ml-2 text-sm text-gray-900">
                              {contact.category.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLeadScoreColor(contact.leadScore)}`}>
                            {contact.leadScore}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(contact.revenueGenerated)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {contact.lastVisit.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                          <button className="text-green-600 hover:text-green-900">Email</button>
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
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Email Campaigns</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  New Campaign
                </button>
              </div>

              <div className="space-y-4">
                {mockCampaigns.map((campaign) => (
                  <div key={campaign.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{campaign.name}</h4>
                        <p className="text-sm text-gray-500">{campaign.subject}</p>
                        <div className="flex items-center mt-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            campaign.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {campaign.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">
                            Created {campaign.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <Settings className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{campaign.performance.sent}</p>
                        <p className="text-sm text-gray-500">Sent</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{campaign.performance.opened}</p>
                        <p className="text-sm text-gray-500">
                          Opened ({calculateRate(campaign.performance.opened, campaign.performance.sent)}%)
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{campaign.performance.clicked}</p>
                        <p className="text-sm text-gray-500">
                          Clicked ({calculateRate(campaign.performance.clicked, campaign.performance.sent)}%)
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{campaign.performance.converted}</p>
                        <p className="text-sm text-gray-500">
                          Converted ({calculateRate(campaign.performance.converted, campaign.performance.sent)}%)
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-600">{formatCurrency(campaign.performance.revenue)}</p>
                        <p className="text-sm text-gray-500">Revenue</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}