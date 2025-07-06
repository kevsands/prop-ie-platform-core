'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Home, 
  Calendar,
  Star,
  Target,
  Award,
  Activity,
  Eye,
  MessageSquare,
  Phone,
  Mail,
  Building2,
  Briefcase,
  CheckCircle2,
  Clock,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Download,
  Filter,
  ChevronDown,
  Zap,
  Globe,
  Heart,
  UserCheck,
  FileText
} from 'lucide-react';
import { agentBuyerIntegrationService } from '@/services/AgentBuyerIntegrationService';

interface AgentAnalyticsPageProps {}

export default function AgentAnalyticsPage({}: AgentAnalyticsPageProps) {
  const [timeframe, setTimeframe] = useState('month');
  const [selectedProject, setSelectedProject] = useState('all');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock agent ID - in production this would come from auth context
  const currentAgentId = 'agent-001';

  useEffect(() => {
    loadAnalytics();
  }, [timeframe, selectedProject]);

  const loadAnalytics = async () => {
    setLoading(true);
    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setLastUpdated(new Date());
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Sample data for analytics
  const performanceMetrics = {
    totalLeads: 127,
    convertedLeads: 23,
    conversionRate: 18.1,
    totalCommission: 187500,
    averageDealSize: 385000,
    activeBuyers: 34,
    propertiesSold: 23,
    totalSalesVolume: 8855000,
    responseTime: 1.2, // hours
    clientSatisfaction: 4.8,
    marketShare: 12.3,
    pipelineValue: 12400000
  };

  const monthlyData = [
    { month: 'Jan', leads: 15, conversions: 3, commission: 12500, volume: 875000 },
    { month: 'Feb', leads: 18, conversions: 4, commission: 18000, volume: 1200000 },
    { month: 'Mar', leads: 22, conversions: 5, commission: 22500, volume: 1500000 },
    { month: 'Apr', leads: 19, conversions: 3, commission: 15000, volume: 950000 },
    { month: 'May', leads: 25, conversions: 6, commission: 28000, volume: 1800000 },
    { month: 'Jun', leads: 28, conversions: 2, commission: 9500, volume: 625000 }
  ];

  const sourceData = [
    { name: 'Website', value: 35, color: '#3B82F6' },
    { name: 'Referrals', value: 28, color: '#10B981' },
    { name: 'Social Media', value: 18, color: '#F59E0B' },
    { name: 'Walk-ins', value: 12, color: '#8B5CF6' },
    { name: 'Advertising', value: 7, color: '#EF4444' }
  ];

  const projectPerformance = [
    { project: 'Fitzgerald Gardens', units: 8, commission: 45000, avgDays: 32 },
    { project: 'Ellwood', units: 6, commission: 38500, avgDays: 28 },
    { project: 'Ballymakenny View', units: 5, commission: 32000, avgDays: 41 },
    { project: 'Dublin Bay', units: 4, commission: 28000, avgDays: 35 }
  ];

  const activityTrends = [
    { week: 'Week 1', calls: 45, emails: 67, viewings: 12, meetings: 8 },
    { week: 'Week 2', calls: 52, emails: 73, viewings: 15, meetings: 11 },
    { week: 'Week 3', calls: 48, emails: 69, viewings: 18, meetings: 9 },
    { week: 'Week 4', calls: 58, emails: 81, viewings: 22, meetings: 14 }
  ];

  const conversionFunnel = [
    { stage: 'Initial Contact', count: 127, percentage: 100 },
    { stage: 'Qualified Lead', count: 89, percentage: 70 },
    { stage: 'Viewing Scheduled', count: 56, percentage: 44 },
    { stage: 'Offer Made', count: 31, percentage: 24 },
    { stage: 'Sale Completed', count: 23, percentage: 18 }
  ];

  const competitorComparison = [
    { metric: 'Conversion Rate', agent: 18.1, market: 14.2, benchmark: 16.5 },
    { metric: 'Response Time', agent: 1.2, market: 3.4, benchmark: 2.1 },
    { metric: 'Client Satisfaction', agent: 4.8, market: 4.2, benchmark: 4.5 },
    { metric: 'Average Deal Size', agent: 385000, market: 342000, benchmark: 365000 }
  ];

  const getChangeColor = (value: number) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (value: number) => {
    return value >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatCompactCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `€${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `€${(amount / 1000).toFixed(0)}K`;
    }
    return formatCurrency(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
          <p className="text-gray-600 mt-1">
            Track your sales performance and optimize your strategy
          </p>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <Clock size={14} />
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="all">All Projects</option>
            <option value="fitzgerald-gardens">Fitzgerald Gardens</option>
            <option value="ellwood">Ellwood</option>
            <option value="ballymakenny-view">Ballymakenny View</option>
          </select>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
              <DollarSign size={24} className="text-blue-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600">
              {getChangeIcon(12.5)}
              <span className="text-sm font-medium">+12.5%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{formatCompactCurrency(performanceMetrics.totalCommission)}</h3>
          <p className="text-gray-600 text-sm">Total Commission</p>
          <div className="mt-2 text-xs text-gray-500">
            vs. last {timeframe === 'month' ? 'month' : 'period'}
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
              <Target size={24} className="text-green-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600">
              {getChangeIcon(8.3)}
              <span className="text-sm font-medium">+8.3%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{performanceMetrics.conversionRate}%</h3>
          <p className="text-gray-600 text-sm">Conversion Rate</p>
          <div className="mt-2 text-xs text-gray-500">
            {performanceMetrics.convertedLeads} of {performanceMetrics.totalLeads} leads
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-violet-100 rounded-lg flex items-center justify-center">
              <Home size={24} className="text-purple-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600">
              {getChangeIcon(15.2)}
              <span className="text-sm font-medium">+15.2%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{performanceMetrics.propertiesSold}</h3>
          <p className="text-gray-600 text-sm">Properties Sold</p>
          <div className="mt-2 text-xs text-gray-500">
            {formatCompactCurrency(performanceMetrics.totalSalesVolume)} total volume
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
              <Star size={24} className="text-amber-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600">
              {getChangeIcon(5.1)}
              <span className="text-sm font-medium">+5.1%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{performanceMetrics.clientSatisfaction}/5.0</h3>
          <p className="text-gray-600 text-sm">Client Rating</p>
          <div className="mt-2 text-xs text-gray-500">
            Based on {performanceMetrics.convertedLeads} reviews
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance Trend */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Performance</h3>
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-600" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'commission' || name === 'volume') {
                    return [formatCurrency(value as number), name];
                  }
                  return [value, name];
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="leads" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="conversions" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Lead Sources */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Lead Sources</h3>
            <div className="flex items-center gap-2">
              <Users size={20} className="text-green-600" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sourceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {sourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Trends */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Activity</h3>
            <div className="flex items-center gap-2">
              <Activity size={20} className="text-purple-600" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activityTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="calls" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="emails" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="viewings" stroke="#F59E0B" strokeWidth={2} />
              <Line type="monotone" dataKey="meetings" stroke="#8B5CF6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Conversion Funnel</h3>
            <div className="flex items-center gap-2">
              <Target size={20} className="text-indigo-600" />
            </div>
          </div>
          <div className="space-y-4">
            {conversionFunnel.map((stage, index) => (
              <div key={stage.stage} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{stage.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{stage.count}</span>
                    <span className="text-sm text-gray-500">({stage.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stage.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Performance & Benchmark Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Performance */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Performance by Project</h3>
            <div className="flex items-center gap-2">
              <Building2 size={20} className="text-blue-600" />
            </div>
          </div>
          <div className="space-y-4">
            {projectPerformance.map((project, index) => (
              <div key={project.project} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{project.project}</h4>
                  <span className="text-sm text-gray-500">{project.units} units sold</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Commission</p>
                    <p className="font-medium text-gray-900">{formatCurrency(project.commission)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Avg. Days to Sale</p>
                    <p className="font-medium text-gray-900">{project.avgDays} days</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benchmark Comparison */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Market Comparison</h3>
            <div className="flex items-center gap-2">
              <Award size={20} className="text-amber-600" />
            </div>
          </div>
          <div className="space-y-4">
            {competitorComparison.map((comparison, index) => (
              <div key={comparison.metric} className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">{comparison.metric}</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600 font-medium">You</span>
                    <span className="text-sm font-medium">
                      {comparison.metric.includes('Rate') || comparison.metric.includes('Satisfaction') ? 
                        comparison.agent : 
                        comparison.metric.includes('Time') ? 
                        `${comparison.agent} hrs` : 
                        formatCurrency(comparison.agent)
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Market Average</span>
                    <span className="text-sm text-gray-600">
                      {comparison.metric.includes('Rate') || comparison.metric.includes('Satisfaction') ? 
                        comparison.market : 
                        comparison.metric.includes('Time') ? 
                        `${comparison.market} hrs` : 
                        formatCurrency(comparison.market)
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Industry Benchmark</span>
                    <span className="text-sm text-gray-600">
                      {comparison.metric.includes('Rate') || comparison.metric.includes('Satisfaction') ? 
                        comparison.benchmark : 
                        comparison.metric.includes('Time') ? 
                        `${comparison.benchmark} hrs` : 
                        formatCurrency(comparison.benchmark)
                      }
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock size={20} className="text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Response Time</h4>
              <p className="text-2xl font-bold text-gray-900">{performanceMetrics.responseTime}hrs</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">65% faster than market average</p>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Active Pipeline</h4>
              <p className="text-2xl font-bold text-gray-900">{performanceMetrics.activeBuyers}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">{formatCompactCurrency(performanceMetrics.pipelineValue)} potential value</p>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Globe size={20} className="text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Market Share</h4>
              <p className="text-2xl font-bold text-gray-900">{performanceMetrics.marketShare}%</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">In assigned territories</p>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-amber-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Avg. Deal Size</h4>
              <p className="text-2xl font-bold text-gray-900">{formatCompactCurrency(performanceMetrics.averageDealSize)}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">12% above market average</p>
        </div>
      </div>

      {/* Insights and Recommendations */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
            <Zap size={20} className="text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Performance Insights & Recommendations</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-green-600 mb-3 flex items-center gap-2">
              <CheckCircle2 size={16} />
              Strengths
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Conversion rate 28% above market average</li>
              <li>• Excellent client satisfaction scores (4.8/5.0)</li>
              <li>• Response time significantly faster than competitors</li>
              <li>• Strong performance in luxury property segment</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-amber-600 mb-3 flex items-center gap-2">
              <Target size={16} />
              Improvement Opportunities
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Increase lead generation from social media channels</li>
              <li>• Focus on reducing time-to-sale for budget properties</li>
              <li>• Expand market share in Dublin 15 territory</li>
              <li>• Improve follow-up consistency for warm leads</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}