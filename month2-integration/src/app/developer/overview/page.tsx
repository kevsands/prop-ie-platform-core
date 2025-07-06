'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar, 
  BarChart3, 
  Target, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download, 
  Plus, 
  MapPin, 
  Zap, 
  Award, 
  Heart,
  FileText,
  Settings,
  AlertTriangle,
  Globe,
  Shield,
  Activity,
  RefreshCw,
  ExternalLink,
  Star,
  Construction,
  ThumbsUp,
  Home,
  MessageSquare,
  Calculator,
  Headphones,
  Camera
} from 'lucide-react';
import Link from 'next/link';

interface OverviewMetrics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalUnits: number;
  soldUnits: number;
  reservedUnits: number;
  availableUnits: number;
  totalRevenue: number;
  monthlyRevenue: number;
  projectedRevenue: number;
  totalInvestment: number;
  roi: number;
  averageUnitPrice: number;
  salesVelocity: number;
  constructionProgress: number;
  htbClaims: number;
  activeBuyers: number;
  pendingDeals: number;
  marketShare: number;
  customerSatisfaction: number;
  teamEfficiency: number;
  riskScore: number;
}

interface MarketIntelligence {
  priceGrowth: number;
  demandLevel: 'High' | 'Medium' | 'Low';
  supplyLevel: 'High' | 'Medium' | 'Low';
  competitorAnalysis: {
    marketPosition: number;
    pricingCompetitiveness: number;
    qualityRating: number;
  };
  trendForecast: {
    nextQuarter: number;
    nextYear: number;
  };
}

interface RecentActivity {
  id: string;
  type: 'sale' | 'reservation' | 'htb' | 'milestone' | 'payment' | 'inquiry' | 'contract' | 'planning';
  message: string;
  time: string;
  value?: string;
  project?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'completed' | 'pending' | 'in_progress';
}

interface KeyPerformanceIndicator {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  category: 'financial' | 'operational' | 'marketing' | 'quality';
  description: string;
}

export default function DeveloperOverview() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Enhanced mock data for enterprise overview
  const overviewMetrics: OverviewMetrics = {
    totalProjects: 12,
    activeProjects: 5,
    completedProjects: 7,
    totalUnits: 284,
    soldUnits: 142,
    reservedUnits: 38,
    availableUnits: 104,
    totalRevenue: 67800000,
    monthlyRevenue: 4200000,
    projectedRevenue: 85600000,
    totalInvestment: 78500000,
    roi: 22.8,
    averageUnitPrice: 425000,
    salesVelocity: 3.2,
    constructionProgress: 74,
    htbClaims: 28,
    activeBuyers: 156,
    pendingDeals: 18,
    marketShare: 12.4,
    customerSatisfaction: 94.2,
    teamEfficiency: 91.7,
    riskScore: 18.5
  };

  const marketIntelligence: MarketIntelligence = {
    priceGrowth: 8.7,
    demandLevel: 'High',
    supplyLevel: 'Medium',
    competitorAnalysis: {
      marketPosition: 3,
      pricingCompetitiveness: 87.5,
      qualityRating: 92.1
    },
    trendForecast: {
      nextQuarter: 6.2,
      nextYear: 12.8
    }
  };

  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'sale',
      message: 'Unit 34 sold at Fitzgerald Gardens - €435,000',
      time: '23 minutes ago',
      value: '€435,000',
      project: 'Fitzgerald Gardens',
      priority: 'high',
      status: 'completed'
    },
    {
      id: '2',
      type: 'reservation',
      message: 'New reservation at Ellwood Phase 2',
      time: '1 hour ago',
      value: '€485,000',
      project: 'Ellwood',
      priority: 'high',
      status: 'pending'
    },
    {
      id: '3',
      type: 'htb',
      message: 'HTB claim approved - Unit 18 Ballymakenny',
      time: '2 hours ago',
      value: '€42,500',
      project: 'Ballymakenny View',
      priority: 'medium',
      status: 'completed'
    },
    {
      id: '4',
      type: 'milestone',
      message: 'Phase 3 foundation work completed ahead of schedule',
      time: '4 hours ago',
      project: 'Fitzgerald Gardens',
      priority: 'medium',
      status: 'completed'
    },
    {
      id: '5',
      type: 'planning',
      message: 'Planning approval received for Oak Grove Extension',
      time: '6 hours ago',
      project: 'Oak Grove',
      priority: 'high',
      status: 'completed'
    }
  ];

  const keyPerformanceIndicators: KeyPerformanceIndicator[] = [
    {
      id: 'sales_conversion',
      name: 'Sales Conversion Rate',
      value: 68.4,
      target: 65.0,
      unit: '%',
      trend: 'up',
      change: 5.2,
      category: 'marketing',
      description: 'Percentage of property inquiries converted to sales'
    },
    {
      id: 'construction_efficiency',
      name: 'Construction Efficiency',
      value: 91.7,
      target: 88.0,
      unit: '%',
      trend: 'up',
      change: 3.8,
      category: 'operational',
      description: 'On-time completion rate for construction milestones'
    },
    {
      id: 'customer_acquisition_cost',
      name: 'Customer Acquisition Cost',
      value: 2850,
      target: 3200,
      unit: '€',
      trend: 'up',
      change: -12.5,
      category: 'marketing',
      description: 'Average cost to acquire a new customer'
    },
    {
      id: 'gross_margin',
      name: 'Gross Profit Margin',
      value: 28.4,
      target: 25.0,
      unit: '%',
      trend: 'up',
      change: 2.1,
      category: 'financial',
      description: 'Gross profit as percentage of total revenue'
    }
  ];

  const timeframes = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLastUpdated(new Date());
    setRefreshing(false);
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return <DollarSign size={16} className="text-green-600" />;
      case 'reservation':
        return <Home size={16} className="text-blue-600" />;
      case 'htb':
        return <Heart size={16} className="text-purple-600" />;
      case 'milestone':
        return <Target size={16} className="text-amber-600" />;
      case 'payment':
        return <DollarSign size={16} className="text-emerald-600" />;
      case 'inquiry':
        return <MessageSquare size={16} className="text-gray-600" />;
      case 'contract':
        return <FileText size={16} className="text-indigo-600" />;
      case 'planning':
        return <Building2 size={16} className="text-teal-600" />;
      default:
        return <AlertCircle size={16} className="text-gray-400" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'sale':
        return 'bg-green-100';
      case 'reservation':
        return 'bg-blue-100';
      case 'htb':
        return 'bg-purple-100';
      case 'milestone':
        return 'bg-amber-100';
      case 'payment':
        return 'bg-emerald-100';
      case 'inquiry':
        return 'bg-gray-100';
      case 'contract':
        return 'bg-indigo-100';
      case 'planning':
        return 'bg-teal-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getKPIIcon = (category: string) => {
    switch (category) {
      case 'financial':
        return <DollarSign size={16} className="text-green-600" />;
      case 'operational':
        return <Settings size={16} className="text-blue-600" />;
      case 'marketing':
        return <TrendingUp size={16} className="text-purple-600" />;
      case 'quality':
        return <Award size={16} className="text-amber-600" />;
      default:
        return <BarChart3 size={16} className="text-gray-600" />;
    }
  };

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === 'up') {
      return change > 0 ? (
        <ArrowUpRight size={14} className="text-green-600" />
      ) : (
        <ArrowDownRight size={14} className="text-red-600" />
      );
    } else if (trend === 'down') {
      return <ArrowDownRight size={14} className="text-red-600" />;
    } else {
      return <div className="w-3 h-3 bg-gray-400 rounded-full" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Developer Overview</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive view of your property development portfolio and business performance
          </p>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <Clock size={14} />
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            {timeframes.map(tf => (
              <option key={tf.value} value={tf.value}>{tf.label}</option>
            ))}
          </select>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
            <Download size={16} className="inline mr-2" />
            Export Report
          </button>
          <Link 
            href="/developer/analytics"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <BarChart3 size={16} className="inline mr-2" />
            Advanced Analytics
          </Link>
        </div>
      </div>

      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Portfolio Value */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Portfolio Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCompactCurrency(overviewMetrics.totalRevenue)}</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight size={16} className="text-green-600" />
                <span className="text-sm text-green-600 font-medium">+22.8%</span>
                <span className="text-sm text-gray-500">vs target</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
              <Building2 size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900">{overviewMetrics.activeProjects}</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" />
                <span className="text-sm text-blue-600 font-medium">{overviewMetrics.constructionProgress}%</span>
                <span className="text-sm text-gray-500">avg progress</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
              <Construction size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        {/* Sales Performance */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Units Sold</p>
              <p className="text-2xl font-bold text-gray-900">{overviewMetrics.soldUnits}</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight size={16} className="text-green-600" />
                <span className="text-sm text-green-600 font-medium">{overviewMetrics.salesVelocity}</span>
                <span className="text-sm text-gray-500">per week</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-violet-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        {/* Customer Satisfaction */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Customer Satisfaction</p>
              <p className="text-2xl font-bold text-gray-900">{overviewMetrics.customerSatisfaction}%</p>
              <div className="flex items-center gap-1 mt-1">
                <Star size={16} className="text-amber-500 fill-current" />
                <span className="text-sm text-amber-600 font-medium">Excellent</span>
                <span className="text-sm text-gray-500">rating</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
              <ThumbsUp size={24} className="text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Market Intelligence & Risk Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Intelligence */}
        <div className="lg:col-span-2 bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                <Globe size={20} className="inline mr-2 text-blue-600" />
                Market Intelligence
              </h3>
              <Link 
                href="/developer/market"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Detailed Analysis
                <ExternalLink size={14} className="inline ml-1" />
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Price Growth */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-3">
                  <TrendingUp size={24} className="text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{marketIntelligence.priceGrowth}%</p>
                <p className="text-sm text-gray-600">Price Growth (YoY)</p>
                <div className="mt-2 flex items-center justify-center gap-1">
                  <ArrowUpRight size={14} className="text-green-600" />
                  <span className="text-xs text-green-600">Above national avg</span>
                </div>
              </div>

              {/* Market Position */}
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto flex items-center justify-center mb-3">
                  <Award size={24} className="text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">#{marketIntelligence.competitorAnalysis.marketPosition}</p>
                <p className="text-sm text-gray-600">Market Position</p>
                <div className="mt-2 flex items-center justify-center gap-1">
                  <Star size={14} className="text-amber-500 fill-current" />
                  <span className="text-xs text-amber-600">Top tier developer</span>
                </div>
              </div>

              {/* Demand Level */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-3">
                  <Activity size={24} className="text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{marketIntelligence.demandLevel}</p>
                <p className="text-sm text-gray-600">Demand Level</p>
                <div className="mt-2 flex items-center justify-center gap-1">
                  <Zap size={14} className="text-blue-600" />
                  <span className="text-xs text-blue-600">Strong momentum</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h4 className="font-semibold text-gray-900 mb-4">Price Trend Forecast</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Next Quarter</p>
                  <p className="text-xl font-semibold text-green-600">+{marketIntelligence.trendForecast.nextQuarter}%</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Next Year</p>
                  <p className="text-xl font-semibold text-blue-600">+{marketIntelligence.trendForecast.nextYear}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              <Shield size={20} className="inline mr-2 text-amber-600" />
              Risk Assessment
            </h3>
          </div>
          
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-3">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-green-200 rounded-full" />
                  <div className="absolute top-0 left-0 w-12 h-12 border-4 border-green-600 rounded-full transform" 
                       style={{ clipPath: `inset(0 0 ${overviewMetrics.riskScore}% 0)` }} />
                </div>
              </div>
              <p className="text-2xl font-bold text-green-600">{overviewMetrics.riskScore}%</p>
              <p className="text-sm text-gray-600">Overall Risk Score</p>
              <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full mt-2">
                Low Risk
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Market Risk</span>
                <div className="flex items-center gap-2">
                  <div className="w-12 bg-gray-200 rounded-full h-2">
                    <div className="w-4 h-2 bg-green-600 rounded-full" />
                  </div>
                  <span className="text-xs font-medium text-green-600">Low</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Financial Risk</span>
                <div className="flex items-center gap-2">
                  <div className="w-12 bg-gray-200 rounded-full h-2">
                    <div className="w-6 h-2 bg-amber-600 rounded-full" />
                  </div>
                  <span className="text-xs font-medium text-amber-600">Medium</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Operational Risk</span>
                <div className="flex items-center gap-2">
                  <div className="w-12 bg-gray-200 rounded-full h-2">
                    <div className="w-3 h-2 bg-green-600 rounded-full" />
                  </div>
                  <span className="text-xs font-medium text-green-600">Low</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Regulatory Risk</span>
                <div className="flex items-center gap-2">
                  <div className="w-12 bg-gray-200 rounded-full h-2">
                    <div className="w-5 h-2 bg-blue-600 rounded-full" />
                  </div>
                  <span className="text-xs font-medium text-blue-600">Low-Med</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <Link 
                href="/developer/risk-management"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Risk Management Dashboard
                <ArrowUpRight size={14} className="inline ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              <Target size={20} className="inline mr-2 text-purple-600" />
              Key Performance Indicators
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">All targets met or exceeded</span>
              <CheckCircle size={16} className="text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyPerformanceIndicators.map((kpi) => (
              <div key={kpi.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getKPIIcon(kpi.category)}
                    <span className="text-sm font-medium text-gray-900">{kpi.name}</span>
                  </div>
                  {getTrendIcon(kpi.trend, kpi.change)}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                      {kpi.unit === '€' && kpi.value > 1000 ? formatCompactCurrency(kpi.value) : `${kpi.value}${kpi.unit}`}
                    </span>
                    <span className="text-sm text-gray-500">
                      Target: {kpi.unit === '€' && kpi.target > 1000 ? formatCompactCurrency(kpi.target) : `${kpi.target}${kpi.unit}`}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        kpi.value >= kpi.target ? 'bg-green-600' : 
                        kpi.value >= kpi.target * 0.8 ? 'bg-amber-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${
                      Math.abs(kpi.change) > 0 ? (kpi.change > 0 ? 'text-green-600' : 'text-red-600') : 'text-gray-600'
                    }`}>
                      {kpi.change > 0 ? '+' : ''}{kpi.change}% vs last period
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      kpi.value >= kpi.target ? 'bg-green-100 text-green-800' : 
                      kpi.value >= kpi.target * 0.8 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {kpi.value >= kpi.target ? 'On Target' : kpi.value >= kpi.target * 0.8 ? 'Near Target' : 'Below Target'}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-2">{kpi.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                <Activity size={20} className="inline mr-2 text-green-600" />
                Recent Activity
              </h3>
              <Link 
                href="/developer/activity"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View All
                <ArrowUpRight size={14} className="inline ml-1" />
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ml-2 ${getPriorityColor(activity.priority)}`}>
                        {activity.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">{activity.time}</span>
                      <div className="flex items-center gap-2">
                        {activity.value && (
                          <span className="text-sm font-medium text-green-600">{activity.value}</span>
                        )}
                        {activity.project && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {activity.project}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & Tools */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              <Zap size={20} className="inline mr-2 text-amber-600" />
              Quick Actions
            </h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <Link 
                href="/developer/projects/create"
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                <Plus size={24} className="text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-900">New Project</span>
              </Link>
              
              <Link 
                href="/developer/sales"
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all group"
              >
                <DollarSign size={24} className="text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-900">Sales Dashboard</span>
              </Link>
              
              <Link 
                href="/developer/team"
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all group"
              >
                <Users size={24} className="text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-900">Team Management</span>
              </Link>
              
              <Link 
                href="/developer/finance"
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-all group"
              >
                <Calculator size={24} className="text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-900">Financial Dashboard</span>
              </Link>
              
              <Link 
                href="/developer/htb"
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-pink-300 hover:bg-pink-50 transition-all group"
              >
                <Heart size={24} className="text-pink-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-900">Help-to-Buy</span>
              </Link>
              
              <Link 
                href="/developer/documents"
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
              >
                <FileText size={24} className="text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-900">Documents</span>
              </Link>
            </div>

            {/* Platform Status */}
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-semibold text-gray-900 mb-3">Platform Status</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">System Health</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-green-600">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Data Sync</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-green-600">Live</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API Status</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-green-600">99.97% Uptime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
              <Award size={24} className="text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Enterprise Developer Portal</h4>
              <p className="text-sm text-gray-600">Complete property development management platform</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/developer/analytics"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <BarChart3 size={16} className="inline mr-2" />
              Advanced Analytics
            </Link>
            <Link 
              href="/developer/reports"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FileText size={16} className="inline mr-2" />
              Generate Report
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}