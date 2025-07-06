'use client';

import React, { useState } from 'react';
import useProjectData from '@/hooks/useProjectData';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Home, 
  Users, 
  Calendar,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Phone,
  Mail,
  MapPin,
  Building2,
  Heart,
  FileText,
  Download,
  Filter,
  Search,
  Plus,
  BarChart3,
  PieChart,
  Activity,
  Star,
  Award,
  Zap,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Edit,
  Share2,
  Settings,
  User,
  CreditCard,
  Briefcase,
  Calculator,
  Globe,
  MousePointer,
  Circle
} from 'lucide-react';
import Link from 'next/link';

export default function DeveloperSales() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [selectedProject, setSelectedProject] = useState('fitzgerald-gardens');
  const [selectedView, setSelectedView] = useState('overview');
  const [selectedSalesStage, setSelectedSalesStage] = useState('all');

  // Enterprise data integration for real-time sales metrics
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
    isLoading,
    lastUpdated,
    filteredUnits,
    getUnitById
  } = useProjectData(selectedProject);

  // Enhanced sales metrics computed from enterprise data
  const realTimeSalesMetrics = {
    totalUnits: totalUnits || (selectedProject === 'fitzgerald-gardens' ? 15 : selectedProject === 'ellwood' ? 46 : 20),
    soldUnits: soldUnits || (selectedProject === 'fitzgerald-gardens' ? 0 : selectedProject === 'ellwood' ? 46 : 19),
    reservedUnits: reservedUnits || (selectedProject === 'fitzgerald-gardens' ? 0 : selectedProject === 'ellwood' ? 0 : 1),
    availableUnits: availableUnits || (selectedProject === 'fitzgerald-gardens' ? 15 : selectedProject === 'ellwood' ? 0 : 0),
    salesRate: totalUnits ? (soldUnits / totalUnits * 100) : 0,
    reservationRate: totalUnits ? (reservedUnits / totalUnits * 100) : 0,
    totalRevenue: totalRevenue || 0,
    averagePrice: averageUnitPrice || 385000,
    salesVelocity: salesVelocity || 2.3,
    conversionRate: conversionRate || 4.2,
    pipelineValue: reservedUnits * (averageUnitPrice || 385000),
    monthlyTarget: Math.ceil((totalUnits || 96) / 18), // 18 month sales period
    weeklyVelocity: (salesVelocity || 2.3) / 4
  };

  // Enhanced sales data
  const salesData = {
    overview: {
      totalSales: 97,
      salesGrowth: 12.5,
      totalRevenue: 42800000,
      revenueGrowth: 18.7,
      averageSalePrice: 441237,
      priceGrowth: 5.4,
      salesVelocity: 16.5, // days
      velocityChange: -2.3,
      conversionRate: 4.2,
      conversionGrowth: -0.8,
      pipelineValue: 28500000,
      pipelineGrowth: 22.1
    },
    salesPipeline: [
      { stage: 'Enquiry', count: 247, value: 98800000, avgDays: 1, conversion: 65 },
      { stage: 'Qualified Lead', count: 161, value: 64240000, avgDays: 3, conversion: 45 },
      { stage: 'Site Visit', count: 72, value: 28800000, avgDays: 7, conversion: 62 },
      { stage: 'Proposal', count: 45, value: 17820000, avgDays: 5, conversion: 58 },
      { stage: 'Negotiation', count: 26, value: 10400000, avgDays: 14, conversion: 73 },
      { stage: 'Contract', count: 19, value: 7600000, avgDays: 21, conversion: 89 },
      { stage: 'Closed Won', count: 17, value: 6800000, avgDays: 0, conversion: 100 }
    ],
    salesByProject: [
      {
        id: 'fitzgerald-gardens',
        name: 'Fitzgerald Gardens',
        totalUnits: 15, // Phase 1 launch - 15 units available
        soldUnits: 0,
        reservedUnits: 0,
        availableUnits: 15,
        revenue: 0,
        avgPrice: 340000,
        salesRate: 0, // Ready for sales launch
        targetSales: 15,
        monthlyTarget: 3,
        actualMonthlySales: 0,
        leadConversion: 0,
        avgSaleTime: 0,
        topAgent: 'Launch Ready',
        location: 'Cork'
      },
      {
        id: 'ellwood',
        name: 'Ellwood',
        totalUnits: 46, // SOLD OUT
        soldUnits: 46,
        reservedUnits: 0,
        availableUnits: 0,
        revenue: 18500000,
        avgPrice: 402000,
        salesRate: 100, // SOLD OUT
        targetSales: 46,
        monthlyTarget: 0,
        actualMonthlySales: 0,
        leadConversion: 100,
        avgSaleTime: 0,
        topAgent: 'Project Complete',
        location: 'Dublin'
      },
      {
        id: 'ballymakenny-view',
        name: 'Ballymakenny View',
        totalUnits: 20, // 19/20 sold
        soldUnits: 19,
        reservedUnits: 1,
        availableUnits: 0,
        revenue: 7600000,
        avgPrice: 380000,
        salesRate: 95, // 19/20 sold
        targetSales: 20,
        monthlyTarget: 0,
        actualMonthlySales: 0,
        leadConversion: 95,
        avgSaleTime: 0,
        topAgent: 'Near Complete',
        location: 'Drogheda'
      }
    ],
    salesTeam: [
      {
        id: 'agent-1',
        name: 'Sarah Murphy',
        role: 'Senior Sales Executive',
        totalSales: 23,
        revenue: 8970000,
        conversionRate: 5.2,
        avgDealSize: 390000,
        commission: 89700,
        target: 30,
        achievement: 76.7,
        phone: '+353 21 123 4567',
        email: 'sarah.murphy@company.ie',
        projects: ['Fitzgerald Gardens', 'Ellwood'],
        status: 'active',
        lastActivity: '2025-06-14'
      },
      {
        id: 'agent-2',
        name: 'Michael O\'Brien',
        role: 'Sales Executive',
        totalSales: 19,
        revenue: 7980000,
        conversionRate: 4.8,
        avgDealSize: 420000,
        commission: 79800,
        target: 25,
        achievement: 76.0,
        phone: '+353 1 234 5678',
        email: 'michael.obrien@company.ie',
        projects: ['Ellwood', 'Ballymakenny View'],
        status: 'active',
        lastActivity: '2025-06-14'
      },
      {
        id: 'agent-3',
        name: 'Emma Walsh',
        role: 'Sales Executive',
        totalSales: 31,
        revenue: 11310000,
        conversionRate: 6.1,
        avgDealSize: 365000,
        commission: 113100,
        target: 35,
        achievement: 88.6,
        phone: '+353 41 987 6543',
        email: 'emma.walsh@company.ie',
        projects: ['Ballymakenny View'],
        status: 'active',
        lastActivity: '2025-06-13'
      },
      {
        id: 'agent-4',
        name: 'David Kelly',
        role: 'Junior Sales Executive',
        totalSales: 14,
        revenue: 5040000,
        conversionRate: 3.9,
        avgDealSize: 360000,
        commission: 50400,
        target: 20,
        achievement: 70.0,
        phone: '+353 21 345 6789',
        email: 'david.kelly@company.ie',
        projects: ['Fitzgerald Gardens'],
        status: 'active',
        lastActivity: '2025-06-14'
      }
    ],
    salesActivities: [
      { id: 1, type: 'sale', agent: 'Sarah Murphy', customer: 'John & Mary O\'Connor', property: 'Fitzgerald Gardens - Unit 23', amount: 385000, date: '2025-06-14', status: 'completed' },
      { id: 2, type: 'site_visit', agent: 'Michael O\'Brien', customer: 'David Walsh', property: 'Ellwood - Unit 15', amount: 420000, date: '2025-06-14', status: 'scheduled' },
      { id: 3, type: 'proposal', agent: 'Emma Walsh', customer: 'Lisa Ryan', property: 'Ballymakenny View - Unit 8', amount: 365000, date: '2025-06-13', status: 'pending' },
      { id: 4, type: 'follow_up', agent: 'David Kelly', customer: 'Patrick Murphy', property: 'Fitzgerald Gardens - Unit 12', amount: 375000, date: '2025-06-13', status: 'completed' },
      { id: 5, type: 'negotiation', agent: 'Sarah Murphy', customer: 'Anna Byrne', property: 'Ellwood - Unit 7', amount: 435000, date: '2025-06-12', status: 'in_progress' }
    ],
    customerSegments: [
      { segment: 'First Time Buyers', count: 45, percentage: 46.4, avgPrice: 365000, conversionRate: 5.2 },
      { segment: 'Upgraders', count: 28, percentage: 28.9, avgPrice: 425000, conversionRate: 4.1 },
      { segment: 'Investors', count: 16, percentage: 16.5, avgPrice: 385000, conversionRate: 6.8 },
      { segment: 'Downsizers', count: 8, percentage: 8.2, avgPrice: 395000, conversionRate: 3.9 }
    ],
    monthlyTrends: [
      { month: 'Jan', sales: 12, revenue: 4680000, leads: 234, conversion: 5.1 },
      { month: 'Feb', sales: 14, revenue: 5460000, leads: 278, conversion: 5.0 },
      { month: 'Mar', sales: 16, revenue: 6240000, leads: 312, conversion: 5.1 },
      { month: 'Apr', sales: 18, revenue: 7020000, leads: 341, conversion: 5.3 },
      { month: 'May', sales: 19, revenue: 7410000, leads: 358, conversion: 5.3 },
      { month: 'Jun', sales: 18, revenue: 7020000, leads: 324, conversion: 5.6 }
    ],
    htbData: {
      totalHTBSales: 23,
      htbPercentage: 23.7,
      avgHTBAmount: 38500,
      totalHTBValue: 885500,
      processingTime: 14, // days
      approvalRate: 94.2
    }
  };

  const timeframes = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '6m', label: 'Last 6 months' },
    { value: '1y', label: 'Last year' }
  ];

  const views = [
    { value: 'overview', label: 'Sales Overview', icon: BarChart3 },
    { value: 'pipeline', label: 'Sales Pipeline', icon: TrendingUp },
    { value: 'team', label: 'Sales Team', icon: Users },
    { value: 'customers', label: 'Customer Analytics', icon: User },
    { value: 'htb', label: 'Help-to-Buy', icon: Heart }
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'site_visit':
        return <MapPin size={16} className="text-blue-600" />;
      case 'proposal':
        return <FileText size={16} className="text-purple-600" />;
      case 'follow_up':
        return <Phone size={16} className="text-amber-600" />;
      case 'negotiation':
        return <Users size={16} className="text-indigo-600" />;
      default:
        return <Activity size={16} className="text-gray-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'sale':
        return 'bg-green-100 text-green-800';
      case 'site_visit':
        return 'bg-blue-100 text-blue-800';
      case 'proposal':
        return 'bg-purple-100 text-purple-800';
      case 'follow_up':
        return 'bg-amber-100 text-amber-800';
      case 'negotiation':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Performance</h1>
          <p className="text-gray-600 mt-1">Comprehensive sales analytics and team performance tracking</p>
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

      {/* Sales Overview */}
      {selectedView === 'overview' && (
        <div className="space-y-6">
          {/* Real-time Data Indicator */}
          {!isLoading && lastUpdated && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-900">Live Sales Data</span>
                  <span className="text-xs text-gray-500">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-green-600">
                    <Zap size={16} />
                    Real-time
                  </div>
                  <div className="text-gray-600">
                    {realTimeSalesMetrics.salesRate.toFixed(1)}% sold
                  </div>
                  <div className="text-blue-600">
                    {realTimeSalesMetrics.reservationRate.toFixed(1)}% reserved
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Key Sales Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Sales</p>
                  <p className="text-2xl font-bold text-gray-900">{realTimeSalesMetrics.soldUnits}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {getTrendIcon(salesData.overview.salesGrowth)}
                    <span className={`text-sm font-medium ${getTrendColor(salesData.overview.salesGrowth)}`}>
                      +{salesData.overview.salesGrowth}%
                    </span>
                    <span className="text-sm text-gray-500">vs last period</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp size={24} className="text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Sales Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCompactCurrency(realTimeSalesMetrics.totalRevenue)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {getTrendIcon(salesData.overview.revenueGrowth)}
                    <span className={`text-sm font-medium ${getTrendColor(salesData.overview.revenueGrowth)}`}>
                      +{salesData.overview.revenueGrowth}%
                    </span>
                    <span className="text-sm text-gray-500">vs last period</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign size={24} className="text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Sale Price</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCompactCurrency(realTimeSalesMetrics.averagePrice)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {getTrendIcon(salesData.overview.priceGrowth)}
                    <span className={`text-sm font-medium ${getTrendColor(salesData.overview.priceGrowth)}`}>
                      +{salesData.overview.priceGrowth}%
                    </span>
                    <span className="text-sm text-gray-500">vs last period</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Home size={24} className="text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Sales Velocity</p>
                  <p className="text-2xl font-bold text-gray-900">{realTimeSalesMetrics.salesVelocity} weeks</p>
                  <div className="flex items-center gap-1 mt-1">
                    {getTrendIcon(salesData.overview.velocityChange)}
                    <span className={`text-sm font-medium ${getTrendColor(salesData.overview.velocityChange)}`}>
                      {salesData.overview.velocityChange}%
                    </span>
                    <span className="text-sm text-gray-500">vs last period</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Clock size={24} className="text-amber-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Sales Trends and Project Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Sales Trend */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Monthly Sales Trend</h3>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg">Sales</button>
                  <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Revenue</button>
                </div>
              </div>
              
              <div className="h-64 relative">
                <div className="absolute inset-0 flex items-end justify-between p-4 bg-gradient-to-t from-blue-50 to-transparent rounded-lg">
                  {salesData.monthlyTrends.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="w-12 bg-blue-600 rounded-t transition-all duration-500"
                        style={{ height: `${(item.sales / 20) * 100}%` }}
                      />
                      <span className="text-xs text-gray-500 mt-2">{item.month}</span>
                      <span className="text-xs font-medium text-gray-900">{item.sales}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Project Performance */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Project Sales Performance</h3>
              <div className="space-y-4">
                {salesData.salesByProject.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{project.name}</h4>
                        <p className="text-sm text-gray-600">{project.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">{project.soldUnits}/{project.totalUnits}</p>
                        <p className="text-sm text-gray-600">sold</p>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.salesRate}%` }}
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                      <div>
                        <p className="font-semibold text-gray-900">{formatCompactCurrency(project.revenue)}</p>
                        <p className="text-gray-600">Revenue</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{project.actualMonthlySales}/{project.monthlyTarget}</p>
                        <p className="text-gray-600">Monthly</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{project.leadConversion}%</p>
                        <p className="text-gray-600">Conversion</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Sales Activities */}
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Recent Sales Activities</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {salesData.salesActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityColor(activity.type)}`}>
                          {activity.type.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-600">{activity.date}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{activity.customer}</p>
                      <p className="text-sm text-gray-600">{activity.property}</p>
                      <p className="text-xs text-gray-500">Agent: {activity.agent}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">{formatCompactCurrency(activity.amount)}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                        activity.status === 'in_progress' ? 'bg-amber-100 text-amber-800' :
                        activity.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {activity.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sales Pipeline View */}
      {selectedView === 'pipeline' && (
        <div className="space-y-6">
          {/* Pipeline Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pipeline Value</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCompactCurrency(salesData.overview.pipelineValue)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {getTrendIcon(salesData.overview.pipelineGrowth)}
                    <span className={`text-sm font-medium ${getTrendColor(salesData.overview.pipelineGrowth)}`}>
                      +{salesData.overview.pipelineGrowth}%
                    </span>
                    <span className="text-sm text-gray-500">vs last period</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp size={24} className="text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{salesData.overview.conversionRate}%</p>
                  <div className="flex items-center gap-1 mt-1">
                    {getTrendIcon(salesData.overview.conversionGrowth)}
                    <span className={`text-sm font-medium ${getTrendColor(salesData.overview.conversionGrowth)}`}>
                      {salesData.overview.conversionGrowth}%
                    </span>
                    <span className="text-sm text-gray-500">vs last period</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target size={24} className="text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Deal Size</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCompactCurrency(salesData.overview.averageSalePrice)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {getTrendIcon(salesData.overview.priceGrowth)}
                    <span className={`text-sm font-medium ${getTrendColor(salesData.overview.priceGrowth)}`}>
                      +{salesData.overview.priceGrowth}%
                    </span>
                    <span className="text-sm text-gray-500">vs last period</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign size={24} className="text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Sales Pipeline */}
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Sales Pipeline Stages</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {salesData.salesPipeline.map((stage, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-blue-100 text-blue-600' :
                          index === 1 ? 'bg-indigo-100 text-indigo-600' :
                          index === 2 ? 'bg-purple-100 text-purple-600' :
                          index === 3 ? 'bg-pink-100 text-pink-600' :
                          index === 4 ? 'bg-red-100 text-red-600' :
                          index === 5 ? 'bg-orange-100 text-orange-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{stage.stage}</h4>
                          <p className="text-sm text-gray-600">{stage.avgDays} days avg • {stage.conversion}% conversion</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">{stage.count}</p>
                        <p className="text-sm text-gray-600">{formatCompactCurrency(stage.value)}</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 ml-13">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          index === 0 ? 'bg-blue-600' :
                          index === 1 ? 'bg-indigo-600' :
                          index === 2 ? 'bg-purple-600' :
                          index === 3 ? 'bg-pink-600' :
                          index === 4 ? 'bg-red-600' :
                          index === 5 ? 'bg-orange-600' :
                          'bg-green-600'
                        }`}
                        style={{ width: `${Math.min((stage.count / 247) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sales Team View */}
      {selectedView === 'team' && (
        <div className="space-y-6">
          {/* Team Performance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {salesData.salesTeam.map((agent) => (
              <div key={agent.id} className="bg-white rounded-lg border shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">{agent.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{agent.name}</h4>
                    <p className="text-sm text-gray-600">{agent.role}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Sales</span>
                    <span className="font-semibold text-gray-900">{agent.totalSales}/{agent.target}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${agent.achievement}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Achievement</span>
                    <span className={`font-semibold ${
                      agent.achievement >= 80 ? 'text-green-600' :
                      agent.achievement >= 60 ? 'text-amber-600' :
                      'text-red-600'
                    }`}>
                      {agent.achievement}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Revenue</span>
                    <span className="font-semibold text-gray-900">{formatCompactCurrency(agent.revenue)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Conversion</span>
                    <span className="font-semibold text-gray-900">{agent.conversionRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Commission</span>
                    <span className="font-semibold text-green-600">{formatCompactCurrency(agent.commission)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={14} />
                    <span>{agent.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Mail size={14} />
                    <span>{agent.email}</span>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">Projects: {agent.projects.join(', ')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Team Leaderboard */}
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Sales Leaderboard</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Deal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Achievement</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {salesData.salesTeam
                    .sort((a, b) => b.totalSales - a.totalSales)
                    .map((agent, index) => (
                    <tr key={agent.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {index === 0 && <Award size={16} className="text-yellow-500" />}
                          {index === 1 && <Award size={16} className="text-gray-400" />}
                          {index === 2 && <Award size={16} className="text-amber-600" />}
                          <span className="font-medium text-gray-900">#{index + 1}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">{agent.name.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                            <div className="text-sm text-gray-500">{agent.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {agent.totalSales}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCompactCurrency(agent.revenue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${
                          agent.conversionRate >= 5 ? 'text-green-600' :
                          agent.conversionRate >= 4 ? 'text-amber-600' :
                          'text-red-600'
                        }`}>
                          {agent.conversionRate}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCompactCurrency(agent.avgDealSize)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                agent.achievement >= 80 ? 'bg-green-600' :
                                agent.achievement >= 60 ? 'bg-amber-600' :
                                'bg-red-600'
                              }`}
                              style={{ width: `${Math.min(agent.achievement, 100)}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-600">{agent.achievement}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        {formatCompactCurrency(agent.commission)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Customer Analytics View */}
      {selectedView === 'customers' && (
        <div className="space-y-6">
          {/* Customer Segments */}
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Customer Segments</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {salesData.customerSegments.map((segment, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">{segment.segment}</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{segment.count}</p>
                        <p className="text-xs text-gray-600">{segment.percentage}% of sales</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-900">{formatCompactCurrency(segment.avgPrice)}</p>
                        <p className="text-xs text-gray-600">Avg Price</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-600">{segment.conversionRate}%</p>
                        <p className="text-xs text-gray-600">Conversion</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Journey Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Journey</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Eye size={20} className="text-blue-600" />
                    <span className="font-medium">First Contact</span>
                  </div>
                  <span className="text-sm text-gray-600">247 leads</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone size={20} className="text-indigo-600" />
                    <span className="font-medium">Qualification</span>
                  </div>
                  <span className="text-sm text-gray-600">161 qualified</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MapPin size={20} className="text-purple-600" />
                    <span className="font-medium">Site Visit</span>
                  </div>
                  <span className="text-sm text-gray-600">72 visits</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-green-600" />
                    <span className="font-medium">Purchase</span>
                  </div>
                  <span className="text-sm text-gray-600">17 sales</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Satisfaction</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Overall Satisfaction</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-green-600">4.6/5</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sales Process</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-blue-600">4.4/5</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Property Quality</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-purple-600">4.7/5</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Recommend to Others</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-green-600">90%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help-to-Buy View */}
      {selectedView === 'htb' && (
        <div className="space-y-6">
          {/* HTB Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">HTB Sales</p>
                  <p className="text-2xl font-bold text-gray-900">{salesData.htbData.totalHTBSales}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-sm text-purple-600 font-medium">{salesData.htbData.htbPercentage}%</span>
                    <span className="text-sm text-gray-500">of total sales</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Heart size={24} className="text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">HTB Value</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCompactCurrency(salesData.htbData.totalHTBValue)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-sm text-green-600 font-medium">Avg: {formatCompactCurrency(salesData.htbData.avgHTBAmount)}</span>
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
                  <p className="text-sm text-gray-600">Processing Time</p>
                  <p className="text-2xl font-bold text-gray-900">{salesData.htbData.processingTime} days</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-sm text-blue-600 font-medium">Avg processing</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock size={24} className="text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Approval Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{salesData.htbData.approvalRate}%</p>
                  <div className="flex items-center gap-1 mt-1">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-sm text-green-600 font-medium">High success rate</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Award size={24} className="text-amber-600" />
                </div>
              </div>
            </div>
          </div>

          {/* HTB Process Timeline */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">HTB Application Process</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Process Steps</h4>
                <div className="space-y-4">
                  {[
                    { step: 'Application Submission', days: 1, status: 'completed' },
                    { step: 'Documentation Review', days: 3, status: 'completed' },
                    { step: 'Financial Assessment', days: 5, status: 'in_progress' },
                    { step: 'Property Valuation', days: 2, status: 'pending' },
                    { step: 'Final Approval', days: 3, status: 'pending' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        item.status === 'completed' ? 'bg-green-100 text-green-600' :
                        item.status === 'in_progress' ? 'bg-amber-100 text-amber-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {item.status === 'completed' ? <CheckCircle size={16} /> :
                         item.status === 'in_progress' ? <Clock size={16} /> :
                         <Circle size={16} />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.step}</p>
                        <p className="text-xs text-gray-600">{item.days} days avg</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'completed' ? 'bg-green-100 text-green-800' :
                        item.status === 'in_progress' ? 'bg-amber-100 text-amber-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-4">HTB Benefits</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">Increased Affordability</p>
                    <p className="text-xs text-blue-700">Up to 30% equity loan from government</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-900">Lower Mortgage Requirements</p>
                    <p className="text-xs text-green-700">Reduced down payment needed</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm font-medium text-purple-900">Interest-Free Period</p>
                    <p className="text-xs text-purple-700">First 5 years interest-free</p>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <p className="text-sm font-medium text-amber-900">Shared Appreciation</p>
                    <p className="text-xs text-amber-700">Government shares in property value growth</p>
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
              href="/developer/sales/leads"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <Users size={24} className="text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">Manage Leads</span>
            </Link>
            
            <Link 
              href="/developer/sales/pipeline"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors group"
            >
              <TrendingUp size={24} className="text-green-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">Pipeline View</span>
            </Link>
            
            <Link 
              href="/developer/sales/reports"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors group"
            >
              <BarChart3 size={24} className="text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">Sales Reports</span>
            </Link>
            
            <Link 
              href="/developer/sales/commissions"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-colors group"
            >
              <CreditCard size={24} className="text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">Commissions</span>
            </Link>
            
            <Link 
              href="/developer/sales/forecasting"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
            >
              <Target size={24} className="text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">Forecasting</span>
            </Link>
            
            <Link 
              href="/developer/sales/settings"
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