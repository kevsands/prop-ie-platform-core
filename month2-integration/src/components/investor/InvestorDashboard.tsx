'use client';

import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Building, 
  Home, 
  TrendingUp, 
  Users, 
  FilePlus2, 
  BarChart2, 
  LineChart, 
  PieChart, 
  DollarSign,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

// Types for investor data
interface Property {
  id: string;
  name: string;
  location: string;
  type: 'apartment' | 'house' | 'commercial';
  purchasePrice: number;
  currentValue: number;
  monthlyRent: number;
  occupancyStatus: 'occupied' | 'vacant' | 'maintenance';
  purchaseDate: string;
  tenantName?: string;
  leaseEndDate?: string;
  roi: number;
}

interface InvestorMetrics {
  totalPortfolioValue: number;
  totalEquity: number;
  annualCashFlow: number;
  averageROI: number;
  totalProperties: number;
  occupancyRate: number;
  monthlyIncome: number;
  totalDebt: number;
}

interface MarketTrend {
  metric: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

// Mock data for demonstration
const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Riverside Apartment',
    location: 'Dublin 4',
    type: 'apartment',
    purchasePrice: 420000,
    currentValue: 465000,
    monthlyRent: 2100,
    occupancyStatus: 'occupied',
    purchaseDate: '2022-03-15',
    tenantName: 'Sarah O\'Connor',
    leaseEndDate: '2025-03-15',
    roi: 8.2
  },
  {
    id: '2',
    name: 'City Centre Studio',
    location: 'Dublin 1',
    type: 'apartment',
    purchasePrice: 285000,
    currentValue: 315000,
    monthlyRent: 1650,
    occupancyStatus: 'occupied',
    purchaseDate: '2021-08-20',
    tenantName: 'John Murphy',
    leaseEndDate: '2024-12-20',
    roi: 7.8
  },
  {
    id: '3',
    name: 'Suburban Family Home',
    location: 'Cork',
    type: 'house',
    purchasePrice: 385000,
    currentValue: 420000,
    monthlyRent: 1950,
    occupancyStatus: 'vacant',
    purchaseDate: '2023-01-10',
    roi: 6.1
  },
  {
    id: '4',
    name: 'Modern Townhouse',
    location: 'Galway',
    type: 'house',
    purchasePrice: 375000,
    currentValue: 395000,
    monthlyRent: 1800,
    occupancyStatus: 'occupied',
    purchaseDate: '2022-11-05',
    tenantName: 'Emma Walsh',
    leaseEndDate: '2025-11-05',
    roi: 7.2
  }
];

const mockMarketTrends: MarketTrend[] = [
  { metric: 'Dublin Property Prices', value: '+4.2%', change: 4.2, trend: 'up' },
  { metric: 'Cork Rental Yield', value: '6.8%', change: 0.3, trend: 'up' },
  { metric: 'Mortgage Rates', value: '4.1%', change: 0.5, trend: 'up' },
  { metric: 'Vacancy Rates', value: '2.3%', change: -0.2, trend: 'down' },
  { metric: 'New Construction', value: '-12%', change: -12, trend: 'down' }
];

const InvestorDashboard = () => {
  const [viewMode, setViewMode] = useState<'overview' | 'properties' | 'analytics'>('overview');

  // Calculate investor metrics
  const metrics: InvestorMetrics = useMemo(() => {
    const totalPortfolioValue = mockProperties.reduce((sum, prop) => sum + prop.currentValue, 0);
    const totalPurchasePrice = mockProperties.reduce((sum, prop) => sum + prop.purchasePrice, 0);
    const totalEquity = totalPortfolioValue * 0.35; // Assuming 65% LTV average
    const monthlyIncome = mockProperties
      .filter(prop => prop.occupancyStatus === 'occupied')
      .reduce((sum, prop) => sum + prop.monthlyRent, 0);
    const annualCashFlow = monthlyIncome * 12;
    const occupiedProperties = mockProperties.filter(prop => prop.occupancyStatus === 'occupied').length;
    const occupancyRate = (occupiedProperties / mockProperties.length) * 100;
    const averageROI = mockProperties.reduce((sum, prop) => sum + prop.roi, 0) / mockProperties.length;
    const totalDebt = totalPortfolioValue - totalEquity;

    return {
      totalPortfolioValue,
      totalEquity,
      annualCashFlow,
      averageROI,
      totalProperties: mockProperties.length,
      occupancyRate,
      monthlyIncome,
      totalDebt
    };
  }, []);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getStatusColor = (status: Property['occupancyStatus']) => {
    switch (status) {
      case 'occupied': return 'bg-green-100 text-green-800';
      case 'vacant': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="h-4 w-4 text-green-600" />;
      case 'down': return <ArrowDownRight className="h-4 w-4 text-red-600" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investment Portfolio</h1>
          <p className="text-gray-600">Comprehensive overview of your property investments</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('overview')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'overview' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setViewMode('properties')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'properties' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Properties
          </button>
          <button
            onClick={() => setViewMode('analytics')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'analytics' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Analytics
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Portfolio Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalPortfolioValue)}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.3% this year
              </p>
            </div>
            <Building className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Income</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.monthlyIncome)}</p>
              <p className="text-sm text-blue-600 flex items-center mt-1">
                <DollarSign className="h-3 w-3 mr-1" />
                {formatCurrency(metrics.annualCashFlow)} annually
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average ROI</p>
              <p className="text-2xl font-bold text-gray-900">{formatPercentage(metrics.averageROI)}</p>
              <p className="text-sm text-gray-600 mt-1">{metrics.totalProperties} properties</p>
            </div>
            <BarChart className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
              <p className="text-2xl font-bold text-gray-900">{formatPercentage(metrics.occupancyRate)}</p>
              <p className="text-sm text-gray-600 mt-1">
                {mockProperties.filter(p => p.occupancyStatus === 'occupied').length} of {metrics.totalProperties} occupied
              </p>
            </div>
            <Users className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Properties */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Property Portfolio</h3>
              <p className="text-sm text-gray-600">Your investment properties and their performance</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {mockProperties.slice(0, 3).map((property) => (
                  <div key={property.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {property.type === 'apartment' ? <Building className="h-5 w-5 text-blue-600" /> : <Home className="h-5 w-5 text-blue-600" />}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{property.name}</h4>
                        <p className="text-sm text-gray-600 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {property.location}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.occupancyStatus)}`}>
                            {property.occupancyStatus.charAt(0).toUpperCase() + property.occupancyStatus.slice(1)}
                          </span>
                          {property.tenantName && (
                            <span className="text-xs text-gray-500">Tenant: {property.tenantName}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">{formatCurrency(property.monthlyRent)}/mo</p>
                      <p className="text-sm text-green-600">{formatPercentage(property.roi)} ROI</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                View All Properties
              </button>
            </div>
          </div>

          {/* Market Insights */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Market Trends</h3>
                <p className="text-sm text-gray-600">Current market indicators</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {mockMarketTrends.slice(0, 4).map((trend, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(trend.trend)}
                        <span className="text-sm font-medium text-gray-900">{trend.metric}</span>
                      </div>
                      <span className={`text-sm font-medium ${
                        trend.trend === 'up' ? 'text-green-600' : 
                        trend.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {trend.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6 space-y-3">
                <button className="w-full flex items-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <FilePlus2 className="h-4 w-4 mr-3" />
                  Add New Property
                </button>
                <button className="w-full flex items-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <BarChart2 className="h-4 w-4 mr-3" />
                  Financial Analysis
                </button>
                <button className="w-full flex items-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <PieChart className="h-4 w-4 mr-3" />
                  Portfolio Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'properties' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">All Properties</h3>
            <p className="text-sm text-gray-600">Detailed view of your investment portfolio</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Rent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROI</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{property.name}</div>
                        <div className="text-sm text-gray-500">{property.location}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(property.currentValue)}</div>
                      <div className="text-sm text-gray-500">
                        {property.currentValue > property.purchasePrice ? '+' : ''}
                        {formatCurrency(property.currentValue - property.purchasePrice)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(property.monthlyRent)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {formatPercentage(property.roi)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.occupancyStatus)}`}>
                        {property.occupancyStatus.charAt(0).toUpperCase() + property.occupancyStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {property.tenantName || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewMode === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Financial Summary</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Total Investment</span>
                <span className="text-sm font-bold text-gray-900">{formatCurrency(mockProperties.reduce((sum, p) => sum + p.purchasePrice, 0))}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Current Value</span>
                <span className="text-sm font-bold text-gray-900">{formatCurrency(metrics.totalPortfolioValue)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Total Equity</span>
                <span className="text-sm font-bold text-gray-900">{formatCurrency(metrics.totalEquity)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Outstanding Debt</span>
                <span className="text-sm font-bold text-gray-900">{formatCurrency(metrics.totalDebt)}</span>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Net Annual Cash Flow</span>
                  <span className="text-lg font-bold text-green-600">{formatCurrency(metrics.annualCashFlow)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-center">
                <PieChart className="h-24 w-24 mx-auto text-gray-300 mb-4" />
                <p className="text-sm text-gray-500">Portfolio composition and performance analytics would be displayed here with interactive charts.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestorDashboard;