'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building2, 
  DollarSign,
  Activity,
  Target,
  Globe,
  Eye,
  Filter,
  Download,
  RefreshCw,
  Settings
} from 'lucide-react';
import AdvancedInvestmentPerformanceDashboard from '@/components/analytics/AdvancedInvestmentPerformanceDashboard';
import RealTimeMarketIntelligenceDashboard from '@/components/analytics/RealTimeMarketIntelligenceDashboard';

export default function PlatformAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'investment' | 'market' | 'projects' | 'performance'>('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');

  // Mock platform-wide statistics
  const platformStats = {
    totalProjects: 127,
    activeProjects: 43,
    totalInvestment: 2400000000,
    totalRevenue: 3200000000,
    totalUsers: 15847,
    activeTransactions: 234,
    completedTransactions: 8493,
    platformROI: 23.8,
    marketShare: 12.4
  };

  const tabs = [
    { 
      key: 'overview', 
      label: 'Platform Overview', 
      icon: Eye,
      description: 'Executive summary of all platform metrics'
    },
    { 
      key: 'investment', 
      label: 'Investment Analytics', 
      icon: TrendingUp,
      description: 'Platform-wide investment performance and ROI analysis'
    },
    { 
      key: 'market', 
      label: 'Market Intelligence', 
      icon: Globe,
      description: 'Real-time market data across all regions and projects'
    },
    { 
      key: 'projects', 
      label: 'Project Performance', 
      icon: Building2,
      description: 'Cross-project analytics and benchmarking'
    },
    { 
      key: 'performance', 
      label: 'Platform Performance', 
      icon: Activity,
      description: 'System performance, usage metrics, and operational analytics'
    }
  ];

  const timeRanges = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' },
    { value: 'all', label: 'All Time' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <BarChart3 size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
              <p className="text-gray-600">Enterprise-wide analytics and performance metrics</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>{range.label}</option>
            ))}
          </select>
          
          <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Filter size={16} />
            Filter
          </button>
          
          <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download size={16} />
            Export
          </button>
          
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Platform-wide KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Investment</p>
                  <p className="text-2xl font-bold text-gray-900">
                    €{(platformStats.totalInvestment / 1000000000).toFixed(1)}B
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                +12.4% from last period
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Platform ROI</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {platformStats.platformROI}%
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Above industry average
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {platformStats.activeProjects}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Building2 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {platformStats.totalProjects} total projects
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Platform Users</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {(platformStats.totalUsers / 1000).toFixed(1)}K
                  </p>
                </div>
                <div className="p-3 bg-amber-100 rounded-full">
                  <Users className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                +8.2% user growth
              </div>
            </div>
          </div>

          {/* Quick Access to Detailed Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {tabs.slice(1).map(tab => (
              <div key={tab.key} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                   onClick={() => setActiveTab(tab.key as any)}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <tab.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{tab.label}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">{tab.description}</p>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                  View Analytics →
                </button>
              </div>
            ))}
          </div>

          {/* System Health & Performance */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Transaction Status</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Active Transactions</span>
                    <span className="font-medium text-blue-600">{platformStats.activeTransactions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Completed</span>
                    <span className="font-medium text-green-600">{platformStats.completedTransactions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-medium text-green-600">98.7%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Platform Performance</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Avg Response Time</span>
                    <span className="font-medium text-green-600">247ms</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Uptime</span>
                    <span className="font-medium text-green-600">99.98%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">API Calls/Hour</span>
                    <span className="font-medium text-blue-600">42.7K</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Market Position</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Market Share</span>
                    <span className="font-medium text-purple-600">{platformStats.marketShare}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Growth Rate</span>
                    <span className="font-medium text-green-600">+15.3%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Competitive Rank</span>
                    <span className="font-medium text-blue-600">#2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'investment' && (
        <AdvancedInvestmentPerformanceDashboard 
          projectId="platform-wide"
          viewMode="platform"
        />
      )}

      {activeTab === 'market' && (
        <RealTimeMarketIntelligenceDashboard 
          refreshInterval={30}
          alertThresholds={{
            'platform-health': 95,
            'transaction-volume': 1000
          }}
        />
      )}

      {activeTab === 'projects' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cross-Project Performance Analysis</h3>
          <p className="text-gray-600">
            Comprehensive project benchmarking and comparative analysis across all platform projects.
            This view aggregates performance metrics from individual project analytics to provide
            platform-wide insights for strategic decision making.
          </p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This section would display detailed project comparison analytics,
              performance benchmarking, and cross-project insights using the same analytics components
              configured for platform-wide analysis.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Performance Metrics</h3>
          <p className="text-gray-600">
            System performance monitoring, user analytics, and operational metrics for the entire
            PROP.ie platform infrastructure and user experience optimization.
          </p>
          <div className="mt-4 p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-800">
              <strong>Note:</strong> This section would include detailed system monitoring,
              user behavior analytics, performance optimization insights, and operational
              intelligence dashboards.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}