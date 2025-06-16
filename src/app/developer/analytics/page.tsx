'use client';

import React, { useState, useEffect } from 'react';
import useProjectData from '@/hooks/useProjectData';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Home, 
  DollarSign, 
  Calendar,
  MapPin,
  Target,
  Eye,
  Download,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Building2,
  CreditCard,
  Zap,
  Globe,
  Heart,
  FileText,
  Settings,
  Search,
  Plus,
  ChevronDown,
  ChevronUp,
  Layers,
  BarChart2,
  LineChart,
  Smartphone,
  Monitor,
  Tablet,
  MousePointer,
  Share2,
  ThumbsUp
} from 'lucide-react';
import Link from 'next/link';

export default function DeveloperAnalytics() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [selectedView, setSelectedView] = useState('overview');

  // Enterprise data integration with real-time synchronization
  const {
    project,
    units,
    totalUnits,
    soldUnits,
    reservedUnits,
    availableUnits,
    totalRevenue,
    averageUnitPrice,
    salesVelocity,
    conversionRate,
    lastUpdated,
    isLoading
  } = useProjectData('fitzgerald-gardens');

  // Enhanced real-time analytics computed from enterprise data
  const realTimeAnalytics = {
    overview: {
      totalRevenue: totalRevenue || 42800000,
      revenueGrowth: 18.7,
      totalViews: 284750,
      viewsGrowth: 23.4,
      conversionRate: conversionRate || 4.2,
      conversionGrowth: -2.1,
      averageTimeOnSite: 312,
      timeGrowth: 8.9,
      totalLeads: 1847,
      leadsGrowth: 15.3,
      salesVelocity: salesVelocity || 2.3,
      velocityChange: -0.5,
      unitsMetrics: {
        totalUnits: totalUnits || 96,
        soldUnits: soldUnits || 23,
        reservedUnits: reservedUnits || 15,
        availableUnits: availableUnits || 58,
        averagePrice: averageUnitPrice || 385000,
        occupancyRate: totalUnits ? ((soldUnits + reservedUnits) / totalUnits * 100) : 0
      }
    }
  };

  // Enhanced analytics data
  const analyticsData = {
    overview: {
      totalRevenue: 42800000,
      revenueGrowth: 18.7,
      totalViews: 284750,
      viewsGrowth: 23.4,
      conversionRate: 4.2,
      conversionGrowth: -2.1,
      averageTimeOnSite: 312, // seconds
      timeGrowth: 8.9,
      totalLeads: 1847,
      leadsGrowth: 15.3,
      salesVelocity: 2.3, // weeks
      velocityChange: -0.5
    },
    salesFunnel: {
      stages: [
        { name: 'Website Visitors', count: 28475, percentage: 100, conversion: 0 },
        { name: 'Property Views', count: 14238, percentage: 50.0, conversion: 50.0 },
        { name: 'Brochure Downloads', count: 7119, percentage: 25.0, conversion: 50.0 },
        { name: 'Site Visits', count: 2136, percentage: 7.5, conversion: 30.0 },
        { name: 'Reservations', count: 854, percentage: 3.0, conversion: 40.0 },
        { name: 'Sales', count: 213, percentage: 0.75, conversion: 25.0 }
      ]
    },
    projectPerformance: [
      {
        id: 'fitzgerald-gardens',
        name: 'Fitzgerald Gardens',
        revenue: 14200000,
        views: 98450,
        leads: 523,
        conversions: 18,
        conversionRate: 3.4,
        averagePrice: 385000,
        roi: 22.5,
        phase: 'Construction',
        location: 'Cork'
      },
      {
        id: 'ellwood',
        name: 'Ellwood',
        revenue: 18500000,
        views: 127300,
        leads: 892,
        conversions: 28,
        conversionRate: 3.1,
        averagePrice: 420000,
        roi: 18.9,
        phase: 'Pre-Construction',
        location: 'Dublin'
      },
      {
        id: 'ballymakenny-view',
        name: 'Ballymakenny View',
        revenue: 22100000,
        views: 89200,
        leads: 432,
        conversions: 52,
        conversionRate: 12.0,
        averagePrice: 365000,
        roi: 25.1,
        phase: 'Near Completion',
        location: 'Drogheda'
      }
    ],
    marketingChannels: [
      { channel: 'Organic Search', visitors: 8542, conversions: 91, cost: 0, roi: 'N/A', cpa: 0 },
      { channel: 'Google Ads', visitors: 5683, conversions: 47, cost: 28400, roi: 654.2, cpa: 604 },
      { channel: 'Facebook Ads', visitors: 4127, conversions: 23, cost: 15600, roi: 421.3, cpa: 678 },
      { channel: 'Instagram', visitors: 3291, conversions: 18, cost: 9800, roi: 385.7, cpa: 544 },
      { channel: 'Property Portals', visitors: 2847, conversions: 21, cost: 12000, roi: 512.8, cpa: 571 },
      { channel: 'Direct Traffic', visitors: 1983, conversions: 13, cost: 0, roi: 'N/A', cpa: 0 }
    ],
    customerBehavior: {
      deviceTypes: [
        { device: 'Desktop', percentage: 45.2, sessions: 12876, conversions: 97 },
        { device: 'Mobile', percentage: 38.7, sessions: 11023, conversions: 71 },
        { device: 'Tablet', percentage: 16.1, sessions: 4587, conversions: 45 }
      ],
      popularPages: [
        { page: '/properties/fitzgerald-gardens', views: 34521, timeOnPage: 285, bounceRate: 23.4 },
        { page: '/properties/ellwood', views: 28934, timeOnPage: 312, bounceRate: 19.8 },
        { page: '/virtual-tours', views: 21847, timeOnPage: 425, bounceRate: 15.2 },
        { page: '/floor-plans', views: 18395, timeOnPage: 198, bounceRate: 31.7 },
        { page: '/pricing', views: 16752, timeOnPage: 167, bounceRate: 42.1 }
      ],
      userJourney: [
        { step: 'Landing Page', dropOffRate: 15.2, avgTime: 45 },
        { step: 'Property Gallery', dropOffRate: 28.7, avgTime: 125 },
        { step: 'Floor Plans', dropOffRate: 35.4, avgTime: 89 },
        { step: 'Pricing Info', dropOffRate: 22.1, avgTime: 67 },
        { step: 'Contact Form', dropOffRate: 8.9, avgTime: 234 },
        { step: 'Conversion', dropOffRate: 0, avgTime: 0 }
      ]
    },
    timeSeriesData: {
      revenue: [
        { month: 'Jan', value: 2850000 },
        { month: 'Feb', value: 3120000 },
        { month: 'Mar', value: 3650000 },
        { month: 'Apr', value: 3890000 },
        { month: 'May', value: 4150000 },
        { month: 'Jun', value: 4280000 }
      ],
      traffic: [
        { month: 'Jan', value: 18500 },
        { month: 'Feb', value: 21200 },
        { month: 'Mar', value: 24800 },
        { month: 'Apr', value: 27300 },
        { month: 'May', value: 29100 },
        { month: 'Jun', value: 28475 }
      ],
      leads: [
        { month: 'Jan', value: 156 },
        { month: 'Feb', value: 189 },
        { month: 'Mar', value: 234 },
        { month: 'Apr', value: 278 },
        { month: 'May', value: 321 },
        { month: 'Jun', value: 347 }
      ]
    },
    regionalData: [
      { region: 'Dublin', revenue: 18500000, units: 65, avgPrice: 420000, marketShare: 12.3 },
      { region: 'Cork', revenue: 14200000, units: 42, avgPrice: 385000, marketShare: 18.7 },
      { region: 'Drogheda', revenue: 22100000, units: 84, avgPrice: 365000, marketShare: 31.2 },
      { region: 'Galway', revenue: 8900000, units: 28, avgPrice: 398000, marketShare: 8.9 }
    ],
    competitorAnalysis: [
      { competitor: 'Glenveagh Properties', marketShare: 23.4, avgPrice: 395000, trend: 'up' },
      { competitor: 'Cairn Homes', marketShare: 18.9, avgPrice: 412000, trend: 'down' },
      { competitor: 'Abbey Homes', marketShare: 15.2, avgPrice: 378000, trend: 'stable' },
      { competitor: 'Ballymore Group', marketShare: 12.7, avgPrice: 445000, trend: 'up' }
    ]
  };

  const timeframes = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '6m', label: 'Last 6 months' },
    { value: '1y', label: 'Last year' }
  ];

  const views = [
    { value: 'overview', label: 'Overview', icon: BarChart3 },
    { value: 'sales', label: 'Sales Analytics', icon: TrendingUp },
    { value: 'marketing', label: 'Marketing Performance', icon: Target },
    { value: 'customer', label: 'Customer Behavior', icon: Users },
    { value: 'market', label: 'Market Intelligence', icon: Globe }
  ];

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

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IE').format(num);
  };

  const getTrendIcon = (growth: number) => {
    if (growth > 0) {
      return <ArrowUpRight size={16} className="text-green-600" />;
    } else if (growth < 0) {
      return <ArrowDownRight size={16} className="text-red-600" />;
    }
    return <Activity size={16} className="text-gray-600" />;
  };

  const getTrendColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Property Analytics</h1>
          <p className="text-gray-600 mt-1">Advanced business intelligence and performance insights</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {timeframes.map(tf => (
              <option key={tf.value} value={tf.value}>{tf.label}</option>
            ))}
          </select>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Projects</option>
            <option value="fitzgerald-gardens">Fitzgerald Gardens</option>
            <option value="ellwood">Ellwood</option>
            <option value="ballymakenny-view">Ballymakenny View</option>
          </select>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {views.map((view) => (
            <button
              key={view.value}
              onClick={() => setSelectedView(view.value)}
              className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedView === view.value
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <view.icon size={16} />
              {view.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview View */}
      {selectedView === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCompactCurrency(realTimeAnalytics.overview.totalRevenue)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {getTrendIcon(analyticsData.overview.revenueGrowth)}
                    <span className={`text-sm font-medium ${getTrendColor(analyticsData.overview.revenueGrowth)}`}>
                      {analyticsData.overview.revenueGrowth > 0 ? '+' : ''}{analyticsData.overview.revenueGrowth}%
                    </span>
                    <span className="text-sm text-gray-500">vs last period</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign size={24} className="text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Website Traffic</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.overview.totalViews)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {getTrendIcon(analyticsData.overview.viewsGrowth)}
                    <span className={`text-sm font-medium ${getTrendColor(analyticsData.overview.viewsGrowth)}`}>
                      +{analyticsData.overview.viewsGrowth}%
                    </span>
                    <span className="text-sm text-gray-500">vs last period</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Eye size={24} className="text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{realTimeAnalytics.overview.conversionRate}%</p>
                  <div className="flex items-center gap-1 mt-1">
                    {getTrendIcon(analyticsData.overview.conversionGrowth)}
                    <span className={`text-sm font-medium ${getTrendColor(analyticsData.overview.conversionGrowth)}`}>
                      {analyticsData.overview.conversionGrowth}%
                    </span>
                    <span className="text-sm text-gray-500">vs last period</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target size={24} className="text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Leads</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.overview.totalLeads)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {getTrendIcon(analyticsData.overview.leadsGrowth)}
                    <span className={`text-sm font-medium ${getTrendColor(analyticsData.overview.leadsGrowth)}`}>
                      +{analyticsData.overview.leadsGrowth}%
                    </span>
                    <span className="text-sm text-gray-500">vs last period</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Users size={24} className="text-amber-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Enterprise Unit Metrics */}
          {!isLoading && lastUpdated && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <h3 className="text-lg font-semibold text-gray-900">Real-time Unit Performance</h3>
                  <span className="text-xs text-gray-500">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Zap size={16} />
                  Live Data
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{realTimeAnalytics.overview.unitsMetrics.totalUnits}</p>
                  <p className="text-sm text-gray-600">Total Units</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{realTimeAnalytics.overview.unitsMetrics.soldUnits}</p>
                  <p className="text-sm text-gray-600">Sold</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{realTimeAnalytics.overview.unitsMetrics.reservedUnits}</p>
                  <p className="text-sm text-gray-600">Reserved</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{realTimeAnalytics.overview.unitsMetrics.availableUnits}</p>
                  <p className="text-sm text-gray-600">Available</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{realTimeAnalytics.overview.unitsMetrics.occupancyRate.toFixed(1)}%</p>
                  <p className="text-sm text-gray-600">Occupancy</p>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Sales Progress</span>
                  <span>{realTimeAnalytics.overview.unitsMetrics.soldUnits + realTimeAnalytics.overview.unitsMetrics.reservedUnits}/{realTimeAnalytics.overview.unitsMetrics.totalUnits}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-1000" 
                    style={{ width: `${realTimeAnalytics.overview.unitsMetrics.occupancyRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend Chart */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg">Revenue</button>
                  <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Units</button>
                </div>
              </div>
              
              <div className="h-64 relative">
                <div className="absolute inset-0 flex items-end justify-between p-4 bg-gradient-to-t from-green-50 to-transparent rounded-lg">
                  {analyticsData.timeSeriesData.revenue.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="w-12 bg-green-600 rounded-t transition-all duration-500"
                        style={{ height: `${(item.value / 5000000) * 100}%` }}
                      />
                      <span className="text-xs text-gray-500 mt-2">{item.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sales Funnel */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Sales Funnel</h3>
              <div className="space-y-4">
                {analyticsData.salesFunnel.stages.map((stage, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{stage.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{formatNumber(stage.count)}</span>
                        <span className="text-xs text-gray-500">({stage.percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          index === 0 ? 'bg-blue-600' :
                          index === 1 ? 'bg-indigo-600' :
                          index === 2 ? 'bg-purple-600' :
                          index === 3 ? 'bg-pink-600' :
                          index === 4 ? 'bg-red-600' :
                          'bg-green-600'
                        }`}
                        style={{ width: `${stage.percentage}%` }}
                      />
                    </div>
                    {index > 0 && (
                      <div className="absolute -top-1 right-0 text-xs text-gray-500">
                        {stage.conversion}% conv.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Project Performance */}
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Project Performance Comparison</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leads</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conv. Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROI</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analyticsData.projectPerformance.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{project.name}</div>
                          <div className="text-sm text-gray-500">{project.location} • {project.phase}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCompactCurrency(project.revenue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatNumber(project.views)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatNumber(project.leads)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {project.conversions}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${
                          project.conversionRate >= 10 ? 'text-green-600' :
                          project.conversionRate >= 5 ? 'text-amber-600' :
                          'text-red-600'
                        }`}>
                          {project.conversionRate}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCompactCurrency(project.averagePrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${
                          project.roi >= 20 ? 'text-green-600' :
                          project.roi >= 15 ? 'text-amber-600' :
                          'text-red-600'
                        }`}>
                          {project.roi}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Marketing Performance View */}
      {selectedView === 'marketing' && (
        <div className="space-y-6">
          {/* Marketing Channels */}
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Marketing Channel Performance</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channel</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitors</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROI</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPA</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analyticsData.marketingChannels.map((channel, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{channel.channel}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatNumber(channel.visitors)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {channel.conversions}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {channel.cost === 0 ? 'Free' : formatCurrency(channel.cost)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${
                          channel.roi === 'N/A' ? 'text-gray-600' :
                          parseFloat(channel.roi as string) >= 400 ? 'text-green-600' :
                          parseFloat(channel.roi as string) >= 200 ? 'text-amber-600' :
                          'text-red-600'
                        }`}>
                          {channel.roi === 'N/A' ? 'N/A' : `${channel.roi}%`}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {channel.cpa === 0 ? 'N/A' : formatCurrency(channel.cpa)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Device Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Device Performance</h3>
              <div className="space-y-4">
                {analyticsData.customerBehavior.deviceTypes.map((device, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {device.device === 'Desktop' && <Monitor size={16} className="text-blue-600" />}
                        {device.device === 'Mobile' && <Smartphone size={16} className="text-green-600" />}
                        {device.device === 'Tablet' && <Tablet size={16} className="text-purple-600" />}
                        <span className="text-sm font-medium text-gray-900">{device.device}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">{formatNumber(device.sessions)} sessions</span>
                        <span className="text-sm font-medium text-gray-900">{device.percentage}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          device.device === 'Desktop' ? 'bg-blue-600' :
                          device.device === 'Mobile' ? 'bg-green-600' :
                          'bg-purple-600'
                        }`}
                        style={{ width: `${device.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Popular Pages</h3>
              <div className="space-y-4">
                {analyticsData.customerBehavior.popularPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{page.page}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span>{formatNumber(page.views)} views</span>
                        <span>{page.timeOnPage}s avg</span>
                        <span>{page.bounceRate}% bounce</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Behavior View */}
      {selectedView === 'customer' && (
        <div className="space-y-6">
          {/* User Journey */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">User Journey Analysis</h3>
            <div className="space-y-4">
              {analyticsData.customerBehavior.userJourney.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-blue-100 text-blue-600' :
                        index === analyticsData.customerBehavior.userJourney.length - 1 ? 'bg-green-100 text-green-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{step.step}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      {step.dropOffRate > 0 && (
                        <span className="text-sm text-red-600 font-medium">{step.dropOffRate}% drop-off</span>
                      )}
                      <span className="text-sm text-gray-600">{step.avgTime}s avg</span>
                    </div>
                  </div>
                  {index < analyticsData.customerBehavior.userJourney.length - 1 && (
                    <div className="ml-4 w-0.5 h-6 bg-gray-300"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Regional Performance */}
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Regional Performance</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
              {analyticsData.regionalData.map((region, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">{region.region}</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{formatCompactCurrency(region.revenue)}</p>
                      <p className="text-xs text-gray-600">Revenue</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{region.units}</p>
                      <p className="text-xs text-gray-600">Units</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-600">{region.marketShare}%</p>
                      <p className="text-xs text-gray-600">Market Share</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Market Intelligence View */}
      {selectedView === 'market' && (
        <div className="space-y-6">
          {/* Competitor Analysis */}
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Competitor Analysis</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {analyticsData.competitorAnalysis.map((competitor, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{competitor.competitor}</h4>
                      <div className="flex items-center gap-1">
                        {competitor.trend === 'up' && <TrendingUp size={16} className="text-green-600" />}
                        {competitor.trend === 'down' && <TrendingDown size={16} className="text-red-600" />}
                        {competitor.trend === 'stable' && <Activity size={16} className="text-gray-600" />}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-lg font-semibold text-blue-600">{competitor.marketShare}%</p>
                        <p className="text-xs text-gray-600">Market Share</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{formatCompactCurrency(competitor.avgPrice)}</p>
                        <p className="text-xs text-gray-600">Avg Price</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Market Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Market Trends</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Average Property Price</p>
                    <p className="text-xs text-gray-600">Q2 2025</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-green-600">€398,500</p>
                    <p className="text-xs text-green-600">+12.3% YoY</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Market Activity</p>
                    <p className="text-xs text-gray-600">Properties sold</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-blue-600">2,847</p>
                    <p className="text-xs text-blue-600">+8.9% vs Q1</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Time on Market</p>
                    <p className="text-xs text-gray-600">Average days</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-amber-600">42</p>
                    <p className="text-xs text-amber-600">-15.2% improvement</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Market Forecast</h3>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={16} className="text-green-600" />
                    <span className="font-medium text-gray-900">Price Growth Forecast</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Expected 8-12% growth in Q3 2025</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users size={16} className="text-blue-600" />
                    <span className="font-medium text-gray-900">Demand Outlook</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Strong buyer demand continues</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 size={16} className="text-purple-600" />
                    <span className="font-medium text-gray-900">Supply Levels</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Limited supply supporting prices</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Link 
              href="/developer/analytics/reports"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <FileText size={24} className="text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">Custom Reports</span>
            </Link>
            
            <Link 
              href="/developer/analytics/dashboard"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors group"
            >
              <BarChart3 size={24} className="text-green-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">Live Dashboard</span>
            </Link>
            
            <Link 
              href="/developer/analytics/alerts"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-colors group"
            >
              <AlertTriangle size={24} className="text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">Set Alerts</span>
            </Link>
            
            <Link 
              href="/developer/analytics/export"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors group"
            >
              <Download size={24} className="text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">Export Data</span>
            </Link>
            
            <Link 
              href="/developer/analytics/integration"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
            >
              <Share2 size={24} className="text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">Integrations</span>
            </Link>
            
            <Link 
              href="/developer/analytics/settings"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors group"
            >
              <Settings size={24} className="text-gray-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}