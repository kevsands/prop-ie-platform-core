'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target,
  BarChart3,
  PieChart,
  ArrowUp,
  ArrowDown,
  Zap,
  Eye,
  MousePointer,
  ShoppingCart,
  Mail,
  Phone,
  Download,
  Filter,
  Calendar,
  RefreshCw,
  Settings,
  TestTube,
  Award,
  Activity
} from 'lucide-react';

// Import our unified systems
import { acquisitionFunnelEngine, FunnelStage, ConversionGoal } from '../../../services/acquisitionFunnelEngine';
import { emailMarketingEngine, UserCategory } from '../../../services/emailMarketingEngine';
import { revenueEngine } from '../../../services/revenueEngine';

export default function GrowthAnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock unified analytics data
  const mockUnifiedAnalytics = {
    funnel: {
      totalVisitors: 15847,
      stageDistribution: {
        [FunnelStage.AWARENESS]: 8932,
        [FunnelStage.INTEREST]: 3456,
        [FunnelStage.CONSIDERATION]: 1876,
        [FunnelStage.INTENT]: 892,
        [FunnelStage.EVALUATION]: 445,
        [FunnelStage.PURCHASE]: 246
      },
      conversionRates: {
        awarenessToInterest: 38.7,
        interestToConsideration: 54.3,
        considerationToIntent: 47.6,
        intentToEvaluation: 49.9,
        evaluationToPurchase: 55.3
      },
      totalRevenue: 187450.75,
      averageRevenuePerVisitor: 11.83,
      overallConversionRate: 1.55,
      sourcePerformance: {
        'google-ads': { visitors: 4523, conversions: 89, revenue: 67890, conversionRate: 1.97, revenuePerVisitor: 15.01 },
        'organic-search': { visitors: 3891, conversions: 67, revenue: 45230, conversionRate: 1.72, revenuePerVisitor: 11.62 },
        'facebook-ads': { visitors: 2976, conversions: 43, revenue: 32150, conversionRate: 1.45, revenuePerVisitor: 10.80 },
        'referral': { visitors: 2134, conversions: 28, revenue: 23890, conversionRate: 1.31, revenuePerVisitor: 11.19 },
        'direct': { visitors: 1876, conversions: 15, revenue: 12780, conversionRate: 0.80, revenuePerVisitor: 6.81 },
        'email': { visitors: 447, conversions: 4, revenue: 5510, conversionRate: 0.89, revenuePerVisitor: 12.32 }
      }
    },
    email: {
      totalContacts: 28470,
      averageOpenRate: 34.7,
      averageClickRate: 8.2,
      totalEmailRevenue: 89650.25,
      categoryBreakdown: {
        [UserCategory.FIRST_TIME_BUYER]: 12340,
        [UserCategory.PROPERTY_INVESTOR]: 7890,
        [UserCategory.DEVELOPER]: 234,
        [UserCategory.CONTRACTOR]: 567,
        [UserCategory.HIGH_VALUE_PROSPECT]: 2145,
        [UserCategory.CASUAL_BROWSER]: 5294
      }
    },
    revenue: {
      totalPlatformRevenue: 345670.50,
      monthlyGrowth: 28.4,
      revenueStreams: {
        transactionFees: 127450.00,
        subscriptions: 89240.00,
        propChoice: 67890.50,
        tenderPlatform: 23450.00,
        emailMarketing: 37640.00
      },
      customerLifetimeValue: 2847.60,
      acquisitionCost: 127.80
    },
    abTests: [
      {
        id: 'test-1',
        name: 'Homepage CTA Button Color',
        goal: 'Email Signups',
        status: 'Running',
        variants: [
          { name: 'Blue (Control)', visitors: 2456, conversions: 89, conversionRate: 3.62 },
          { name: 'Green', visitors: 2398, conversions: 112, conversionRate: 4.67 },
          { name: 'Orange', visitors: 2445, conversions: 97, conversionRate: 3.97 }
        ],
        confidence: 87,
        winner: 'Green'
      },
      {
        id: 'test-2',
        name: 'Property Page Email Capture Timing',
        goal: 'Email Signups',
        status: 'Running',
        variants: [
          { name: '30 seconds (Control)', visitors: 1876, conversions: 67, conversionRate: 3.57 },
          { name: '60 seconds', visitors: 1923, conversions: 89, conversionRate: 4.63 }
        ],
        confidence: 92,
        winner: '60 seconds'
      }
    ]
  };

  useEffect(() => {
    // Simulate loading unified analytics
    const timer = setTimeout(() => {
      // In production, this would fetch from all systems
      const funnelData = acquisitionFunnelEngine.getFunnelAnalytics();
      const emailData = emailMarketingEngine.getCampaignAnalytics();
      
      setAnalytics(mockUnifiedAnalytics);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [timeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading growth analytics...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Growth Analytics</h1>
              <p className="text-gray-600 mt-1">Unified view of acquisition, conversion, and revenue optimization</p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export Report
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
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.revenue.totalPlatformRevenue)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 text-sm font-medium">
                {formatPercentage(analytics.revenue.monthlyGrowth)}
              </span>
              <span className="text-gray-500 text-sm ml-2">vs last month</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Funnel Visitors</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.funnel.totalVisitors.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 text-sm font-medium">+15.2%</span>
              <span className="text-gray-500 text-sm ml-2">conversion rate</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Email Contacts</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.email.totalContacts.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Mail className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 text-sm font-medium">+23.1%</span>
              <span className="text-gray-500 text-sm ml-2">growth rate</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customer LTV</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.revenue.customerLifetimeValue)}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-gray-900 text-sm font-medium">
                CAC: {formatCurrency(analytics.revenue.acquisitionCost)}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'overview', label: 'Overview', icon: BarChart3 },
                { key: 'funnel', label: 'Acquisition Funnel', icon: TrendingUp },
                { key: 'ab-tests', label: 'A/B Tests', icon: TestTube },
                { key: 'revenue', label: 'Revenue Streams', icon: DollarSign },
                { key: 'optimization', label: 'Optimization', icon: Zap }
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
            {/* Revenue Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Revenue by Source</h3>
                <div className="space-y-4">
                  {Object.entries(analytics.revenue.revenueStreams).map(([source, amount]) => {
                    const percentage = (amount / analytics.revenue.totalPlatformRevenue) * 100;
                    const colors = {
                      transactionFees: 'bg-blue-500',
                      subscriptions: 'bg-green-500',
                      propChoice: 'bg-purple-500',
                      tenderPlatform: 'bg-orange-500',
                      emailMarketing: 'bg-yellow-500'
                    };
                    
                    return (
                      <div key={source} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${colors[source]} mr-3`}></div>
                          <span className="text-sm font-medium text-gray-900">
                            {source.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-gray-900">{formatCurrency(amount)}</span>
                          <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Traffic Sources Performance</h3>
                <div className="space-y-4">
                  {Object.entries(analytics.funnel.sourcePerformance)
                    .sort(([,a], [,b]) => b.revenuePerVisitor - a.revenuePerVisitor)
                    .slice(0, 5)
                    .map(([source, data]) => (
                    <div key={source} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900 capitalize">
                          {source.replace('-', ' ')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {data.visitors.toLocaleString()} visitors • {data.conversions} conversions
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{formatCurrency(data.revenuePerVisitor)}</div>
                        <div className="text-sm text-gray-500">per visitor</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* User Categories */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">User Category Distribution</h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(analytics.email.categoryBreakdown).map(([category, count]) => (
                  <div key={category} className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{count.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">{category.replace(/_/g, ' ')}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {((count / analytics.email.totalContacts) * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Acquisition Funnel Tab */}
        {activeTab === 'funnel' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Conversion Funnel</h3>
              <div className="space-y-4">
                {Object.entries(analytics.funnel.stageDistribution).map(([stage, count], index) => {
                  const percentage = (count / analytics.funnel.totalVisitors) * 100;
                  const conversionKey = Object.keys(analytics.funnel.conversionRates)[index];
                  const conversionRate = analytics.funnel.conversionRates[conversionKey];
                  
                  return (
                    <div key={stage} className="relative">
                      <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                            <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{stage.replace(/_/g, ' ')}</div>
                            {conversionRate && (
                              <div className="text-sm text-gray-500">
                                {conversionRate.toFixed(1)}% conversion from previous stage
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900">{count.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">{percentage.toFixed(1)}% of total</div>
                        </div>
                      </div>
                      
                      {/* Funnel visualization */}
                      <div className="mt-2 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* A/B Tests Tab */}
        {activeTab === 'ab-tests' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Active A/B Tests</h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                <TestTube className="w-4 h-4 mr-2" />
                Create New Test
              </button>
            </div>

            {analytics.abTests.map((test) => (
              <div key={test.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{test.name}</h4>
                    <p className="text-sm text-gray-600">Goal: {test.goal}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      test.status === 'Running' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {test.status}
                    </span>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Confidence</div>
                      <div className="font-bold text-gray-900">{test.confidence}%</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {test.variants.map((variant, index) => (
                    <div key={index} className={`p-4 border-2 rounded-lg ${
                      variant.name === test.winner ? 'border-green-500 bg-green-50' : 'border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{variant.name}</h5>
                        {variant.name === test.winner && (
                          <Award className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Visitors:</span>
                          <span className="font-medium">{variant.visitors.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Conversions:</span>
                          <span className="font-medium">{variant.conversions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rate:</span>
                          <span className={`font-bold ${
                            variant.name === test.winner ? 'text-green-600' : 'text-gray-900'
                          }`}>
                            {variant.conversionRate.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Revenue Streams Tab */}
        {activeTab === 'revenue' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(analytics.revenue.revenueStreams).map(([stream, amount]) => {
                const growth = Math.random() * 40 - 10; // Mock growth rate
                const colors = {
                  transactionFees: { bg: 'bg-blue-100', text: 'text-blue-600', icon: Target },
                  subscriptions: { bg: 'bg-green-100', text: 'text-green-600', icon: Users },
                  propChoice: { bg: 'bg-purple-100', text: 'text-purple-600', icon: ShoppingCart },
                  tenderPlatform: { bg: 'bg-orange-100', text: 'text-orange-600', icon: Activity },
                  emailMarketing: { bg: 'bg-yellow-100', text: 'text-yellow-600', icon: Mail }
                };
                
                const config = colors[stream];
                const Icon = config.icon;
                
                return (
                  <div key={stream} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${config.bg} rounded-lg flex items-center justify-center`}>
                        <Icon className={`h-6 w-6 ${config.text}`} />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{formatCurrency(amount)}</div>
                        <div className={`text-sm font-medium ${growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {growth > 0 ? '+' : ''}{growth.toFixed(1)}% vs last month
                        </div>
                      </div>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      {stream.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {((amount / analytics.revenue.totalPlatformRevenue) * 100).toFixed(1)}% of total revenue
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Optimization Tab */}
        {activeTab === 'optimization' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Growth Opportunities</h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-green-900">High-Impact Opportunity</h4>
                      <p className="text-sm text-green-800 mt-1">
                        Optimize email capture timing on property pages - current test shows 60s delay performs 29% better
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-900">+€12,500</div>
                      <div className="text-sm text-green-700">monthly revenue potential</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-blue-900">Medium-Impact Opportunity</h4>
                      <p className="text-sm text-blue-800 mt-1">
                        Google Ads traffic has highest revenue per visitor - increase budget allocation
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-900">+€8,900</div>
                      <div className="text-sm text-blue-700">monthly revenue potential</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-purple-900">Segmentation Opportunity</h4>
                      <p className="text-sm text-purple-800 mt-1">
                        Property investors show 3x higher LTV - create dedicated conversion paths
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-purple-900">+€15,600</div>
                      <div className="text-sm text-purple-700">monthly revenue potential</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}