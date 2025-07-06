'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Building2, 
  PieChart, 
  Target, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download, 
  Plus, 
  RefreshCw, 
  ExternalLink,
  Bell,
  MapPin,
  Star,
  Award,
  BarChart3,
  Activity,
  Calendar,
  Users,
  Shield,
  Zap,
  Settings,
  Euro,
  Percent,
  LineChart,
  Home,
  FileText,
  Calculator,
  Globe,
  Briefcase
} from 'lucide-react';
import Link from 'next/link';

interface InvestorMetrics {
  totalInvestment: number;
  currentValue: number;
  totalReturn: number;
  roi: number;
  monthlyIncome: number;
  activeProperties: number;
  portfolioProperties: number;
  occupancyRate: number;
  avgYield: number;
  cashFlow: number;
  capitalGrowth: number;
  nextPayment: {
    amount: number;
    date: string;
    property: string;
  };
}

interface Investment {
  id: string;
  property: string;
  location: string;
  investmentAmount: number;
  currentValue: number;
  monthlyReturn: number;
  roi: number;
  acquisitionDate: string;
  propertyType: 'apartment' | 'house' | 'commercial';
  status: 'active' | 'pending' | 'completed';
  developer: string;
  image: string;
}

interface MarketOpportunity {
  id: string;
  title: string;
  location: string;
  expectedRoi: number;
  minInvestment: number;
  developer: string;
  completionDate: string;
  riskLevel: 'low' | 'medium' | 'high';
  sector: 'residential' | 'commercial' | 'mixed';
}

export default function InvestorOverview() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('ytd');
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Enhanced investor metrics
  const investorMetrics: InvestorMetrics = {
    totalInvestment: 2500000,
    currentValue: 3200000,
    totalReturn: 700000,
    roi: 28.0,
    monthlyIncome: 18500,
    activeProperties: 12,
    portfolioProperties: 15,
    occupancyRate: 94.5,
    avgYield: 8.2,
    cashFlow: 156000,
    capitalGrowth: 22.5,
    nextPayment: {
      amount: 18500,
      date: 'Dec 1, 2025',
      property: 'Fitzgerald Gardens - Unit 23'
    }
  };

  const recentInvestments: Investment[] = [
    {
      id: '1',
      property: 'Fitzgerald Gardens - Unit 23',
      location: 'Cork, Ireland',
      investmentAmount: 385000,
      currentValue: 425000,
      monthlyReturn: 2100,
      roi: 18.5,
      acquisitionDate: '2024-06-15',
      propertyType: 'apartment',
      status: 'active',
      developer: 'Premium Developments',
      image: '/api/placeholder/300/200'
    },
    {
      id: '2',
      property: 'Ellwood - Unit 15',
      location: 'Dublin, Ireland',
      investmentAmount: 520000,
      currentValue: 580000,
      monthlyReturn: 2800,
      roi: 21.2,
      acquisitionDate: '2024-03-20',
      propertyType: 'apartment',
      status: 'active',
      developer: 'Dublin Properties Ltd',
      image: '/api/placeholder/300/200'
    },
    {
      id: '3',
      property: 'Ballymakenny View - Unit 8',
      location: 'Drogheda, Ireland',
      investmentAmount: 365000,
      currentValue: 395000,
      monthlyReturn: 1950,
      roi: 16.8,
      acquisitionDate: '2024-08-10',
      propertyType: 'house',
      status: 'active',
      developer: 'Coastal Developments',
      image: '/api/placeholder/300/200'
    }
  ];

  const marketOpportunities: MarketOpportunity[] = [
    {
      id: '1',
      title: 'Riverside Heights Phase 2',
      location: 'Galway, Ireland',
      expectedRoi: 24.5,
      minInvestment: 450000,
      developer: 'Atlantic Developments',
      completionDate: 'Q2 2026',
      riskLevel: 'medium',
      sector: 'residential'
    },
    {
      id: '2',
      title: 'Cork City Commercial Center',
      location: 'Cork, Ireland',
      expectedRoi: 31.2,
      minInvestment: 850000,
      developer: 'Commercial Partners Ltd',
      completionDate: 'Q4 2025',
      riskLevel: 'low',
      sector: 'commercial'
    },
    {
      id: '3',
      title: 'Phoenix Park Residences',
      location: 'Dublin, Ireland',
      expectedRoi: 19.8,
      minInvestment: 620000,
      developer: 'Dublin Elite Properties',
      completionDate: 'Q1 2026',
      riskLevel: 'low',
      sector: 'residential'
    }
  ];

  const timeframes = [
    { value: 'mtd', label: 'Month to Date' },
    { value: 'qtd', label: 'Quarter to Date' },
    { value: 'ytd', label: 'Year to Date' },
    { value: 'all', label: 'All Time' }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
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

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'medium':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'pending':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'completed':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Investment Overview</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive view of your property investment portfolio
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
            href="/investor/opportunities"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus size={16} className="inline mr-2" />
            New Investment
          </Link>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Portfolio Value */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Portfolio Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCompactCurrency(investorMetrics.currentValue)}</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight size={16} className="text-green-600" />
                <span className="text-sm text-green-600 font-medium">+{investorMetrics.capitalGrowth}%</span>
                <span className="text-sm text-gray-500">capital growth</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* Total ROI */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total ROI</p>
              <p className="text-2xl font-bold text-gray-900">{investorMetrics.roi}%</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight size={16} className="text-green-600" />
                <span className="text-sm text-green-600 font-medium">Outperforming</span>
                <span className="text-sm text-gray-500">market avg</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
              <Percent size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        {/* Monthly Income */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Income</p>
              <p className="text-2xl font-bold text-gray-900">{formatCompactCurrency(investorMetrics.monthlyIncome)}</p>
              <div className="flex items-center gap-1 mt-1">
                <Euro size={16} className="text-purple-600" />
                <span className="text-sm text-purple-600 font-medium">{investorMetrics.avgYield}%</span>
                <span className="text-sm text-gray-500">avg yield</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-violet-100 rounded-lg flex items-center justify-center">
              <DollarSign size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        {/* Active Properties */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Properties</p>
              <p className="text-2xl font-bold text-gray-900">{investorMetrics.activeProperties}</p>
              <div className="flex items-center gap-1 mt-1">
                <CheckCircle size={16} className="text-amber-600" />
                <span className="text-sm text-amber-600 font-medium">{investorMetrics.occupancyRate}%</span>
                <span className="text-sm text-gray-500">occupied</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
              <Building2 size={24} className="text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Next Payment Alert */}
      {investorMetrics.nextPayment && (
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Next Rental Income</h3>
              <p className="text-2xl font-bold">{formatCurrency(investorMetrics.nextPayment.amount)}</p>
              <p className="text-green-100">Expected: {investorMetrics.nextPayment.date}</p>
              <p className="text-green-100 text-sm">From: {investorMetrics.nextPayment.property}</p>
            </div>
            <div className="flex gap-3">
              <Link 
                href="/investor/financial"
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm"
              >
                View Details
              </Link>
              <Link 
                href="/investor/properties"
                className="px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-gray-100 transition-colors text-sm"
              >
                Property Details
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Investments */}
        <div className="lg:col-span-2 bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                <Building2 size={20} className="inline mr-2 text-blue-600" />
                Portfolio Properties
              </h3>
              <Link 
                href="/investor/portfolio"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View All ({investorMetrics.portfolioProperties})
                <ExternalLink size={14} className="inline ml-1" />
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {recentInvestments.map((investment) => (
                <div key={investment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                        <Home size={20} className="text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{investment.property}</h4>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(investment.status)}`}>
                            {investment.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                          <MapPin size={14} />
                          {investment.location}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Investment</p>
                            <p className="font-medium">{formatCompactCurrency(investment.investmentAmount)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Current Value</p>
                            <p className="font-medium text-green-600">{formatCompactCurrency(investment.currentValue)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Monthly Return</p>
                            <p className="font-medium">{formatCompactCurrency(investment.monthlyReturn)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">ROI</p>
                            <p className="font-medium text-blue-600">{investment.roi}%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Link 
                      href={`/investor/properties/${investment.id}`}
                      className="ml-4 p-2 hover:bg-gray-100 rounded transition-colors"
                    >
                      <ArrowUpRight size={16} className="text-gray-400" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Market Opportunities */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              <Target size={20} className="inline mr-2 text-purple-600" />
              Market Opportunities
            </h3>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {marketOpportunities.map((opportunity) => (
                <div key={opportunity.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 text-sm">{opportunity.title}</h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getRiskColor(opportunity.riskLevel)}`}>
                      {opportunity.riskLevel} risk
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mb-3">
                    <MapPin size={12} />
                    {opportunity.location}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Expected ROI</span>
                      <span className="font-medium text-green-600">{opportunity.expectedRoi}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Min Investment</span>
                      <span className="font-medium">{formatCompactCurrency(opportunity.minInvestment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Completion</span>
                      <span className="font-medium">{opportunity.completionDate}</span>
                    </div>
                  </div>
                  <Link 
                    href={`/investor/opportunities/${opportunity.id}`}
                    className="mt-3 w-full flex items-center justify-center p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
            
            <Link 
              href="/investor/market"
              className="mt-4 w-full flex items-center justify-center p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <Globe size={16} className="mr-2" />
              View Market Analysis
            </Link>
          </div>
        </div>
      </div>

      {/* Performance Analytics */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              <BarChart3 size={20} className="inline mr-2 text-green-600" />
              Performance Analytics
            </h3>
            <Link 
              href="/investor/financial"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Detailed Analytics
              <ExternalLink size={14} className="inline ml-1" />
            </Link>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-3">
                <TrendingUp size={24} className="text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatCompactCurrency(investorMetrics.totalReturn)}</p>
              <p className="text-sm text-gray-600">Total Returns</p>
              <div className="mt-2 flex items-center justify-center gap-1">
                <ArrowUpRight size={14} className="text-green-600" />
                <span className="text-xs text-green-600">Compound growth</span>
              </div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-3">
                <Euro size={24} className="text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatCompactCurrency(investorMetrics.cashFlow)}</p>
              <p className="text-sm text-gray-600">Annual Cash Flow</p>
              <div className="mt-2 flex items-center justify-center gap-1">
                <CheckCircle size={14} className="text-blue-600" />
                <span className="text-xs text-blue-600">Stable income</span>
              </div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto flex items-center justify-center mb-3">
                <Award size={24} className="text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{investorMetrics.avgYield}%</p>
              <p className="text-sm text-gray-600">Average Yield</p>
              <div className="mt-2 flex items-center justify-center gap-1">
                <Star size={14} className="text-purple-600" />
                <span className="text-xs text-purple-600">Above market</span>
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
              <PieChart size={24} className="text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Professional Investor Portal</h4>
              <p className="text-sm text-gray-600">Advanced property investment management platform</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/investor/financial"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <LineChart size={16} className="inline mr-2" />
              Financial Reports
            </Link>
            <Link 
              href="/investor/opportunities"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} className="inline mr-2" />
              Explore Opportunities
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}