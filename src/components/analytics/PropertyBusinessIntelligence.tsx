'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Building,
  Receipt,
  CreditCard,
  Target,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Home,
  UserCheck,
  Clock,
  Mail,
  Phone,
  MapPin,
  Percent,
  Eye,
  MousePointer,
  ShoppingCart
} from 'lucide-react';

interface PropertyAnalytics {
  // Core Business Metrics
  totalPropertyValue: number;
  availableInventory: number;
  reservedUnits: number;
  soldUnits: number;
  
  // Financial Performance
  totalRevenue: number;
  avgPropertyPrice: number;
  customizationUptake: number;
  revenueGrowth: number;
  
  // Sales Funnel
  websiteVisitors: number;
  registrations: number;
  propertyViews: number;
  reservations: number;
  conversionRate: number;
  
  // Customer Insights
  avgTimeToReservation: number;
  popularCustomizations: Array<{ name: string; uptake: number; value: number }>;
  buyerDemographics: {
    firstTimeBuyers: number;
    investors: number;
    upgraders: number;
  };
  
  // Property Performance
  developmentPerformance: Array<{
    name: string;
    totalUnits: number;
    soldCount: number;
    avgPrice: number;
    revenue: number;
    velocity: number; // units per month
  }>;
  
  // Real-time Insights
  activeUsers: number;
  currentViewers: number;
  todayInquiries: number;
  thisWeekReservations: number;
}

interface Props {
  data?: PropertyAnalytics;
  onTimeRangeChange?: (range: string) => void;
  onRefresh?: () => void;
}

const PropertyBusinessIntelligence: React.FC<Props> = ({ 
  data, 
  onTimeRangeChange, 
  onRefresh 
}) => {
  const [timeRange, setTimeRange] = useState('30d');
  const [analytics, setAnalytics] = useState<PropertyAnalytics | null>(data || null);
  const [loading, setLoading] = useState(!data);
  const [selectedDevelopment, setSelectedDevelopment] = useState('all');

  // Mock data based on Kevin's real project portfolio
  const kevinPropertyAnalytics: PropertyAnalytics = {
    // Core Business Metrics
    totalPropertyValue: 26870000, // €26.87M
    availableInventory: 15, // Available units in Fitzgerald Gardens
    reservedUnits: 3,
    soldUnits: 74, // 46 Ellwood + 19 Ballymakenny View + 9 Fitzgerald Gardens

    // Financial Performance  
    totalRevenue: 16870000, // €16.87M (sold units)
    avgPropertyPrice: 334375, // Average across all developments
    customizationUptake: 0.68, // 68% add customizations
    revenueGrowth: 0.235, // 23.5% growth

    // Sales Funnel (September launch projections)
    websiteVisitors: 2450,
    registrations: 147,
    propertyViews: 1832,
    reservations: 12,
    conversionRate: 0.08, // 8% visitor to registration

    // Customer Insights
    avgTimeToReservation: 8.5, // days
    popularCustomizations: [
      { name: 'Premium Kitchen Package', uptake: 0.45, value: 8500 },
      { name: 'Smart Kitchen Package', uptake: 0.23, value: 12000 },
      { name: 'Complete White Goods', uptake: 0.67, value: 4200 }
    ],
    buyerDemographics: {
      firstTimeBuyers: 0.72, // 72% first-time buyers
      investors: 0.15, // 15% investors
      upgraders: 0.13 // 13% upgraders
    },

    // Property Performance
    developmentPerformance: [
      {
        name: 'Ellwood',
        totalUnits: 46,
        soldCount: 46,
        avgPrice: 275000,
        revenue: 12650000,
        velocity: 7.8 // units per month
      },
      {
        name: 'Ballymakenny View', 
        totalUnits: 20,
        soldCount: 19,
        avgPrice: 315000,
        revenue: 5985000,
        velocity: 4.2
      },
      {
        name: 'Fitzgerald Gardens',
        totalUnits: 27,
        soldCount: 12,
        avgPrice: 387000,
        revenue: 4644000,
        velocity: 2.1 // Currently selling
      }
    ],

    // Real-time Insights
    activeUsers: 23,
    currentViewers: 8,
    todayInquiries: 5,
    thisWeekReservations: 2
  };

  useEffect(() => {
    if (data) {
      setAnalytics(data);
      setLoading(false);
    } else {
      // Fallback to mock data if no data provided
      setTimeout(() => {
        setAnalytics(kevinPropertyAnalytics);
        setLoading(false);
      }, 1000);
    }
  }, [data, timeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IE').format(num);
  };

  const formatPercentage = (decimal: number) => {
    return `${(decimal * 100).toFixed(1)}%`;
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

  if (!analytics) return null;

  const totalSalesVelocity = analytics.developmentPerformance.reduce((sum, dev) => sum + dev.velocity, 0);
  const inventoryMonthsRemaining = analytics.availableInventory / (totalSalesVelocity / 3);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kevin Fitzgerald Developments</h1>
          <p className="text-gray-600">Business Intelligence Dashboard</p>
        </div>
        
        <div className="flex gap-4">
          <select 
            value={timeRange} 
            onChange={(e) => {
              setTimeRange(e.target.value);
              onTimeRangeChange?.(e.target.value);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          
          <button 
            onClick={onRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Real-time Status Bar */}
      <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Live Platform Status</span>
            </div>
            <div className="text-sm text-gray-600">
              {analytics.activeUsers} active users • {analytics.currentViewers} viewing properties
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Today: {analytics.todayInquiries} inquiries • This week: {analytics.thisWeekReservations} reservations
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Portfolio Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.totalPropertyValue)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <ArrowUpRight className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600 font-medium">{formatPercentage(analytics.revenueGrowth)} vs last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue Generated</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.totalRevenue)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            {analytics.soldUnits} units sold • Avg: {formatCurrency(analytics.avgPropertyPrice)}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Inventory</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.availableInventory}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Home className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            ~{inventoryMonthsRemaining.toFixed(1)} months at current sales velocity
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{formatPercentage(analytics.conversionRate)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            {analytics.registrations} registrations from {formatNumber(analytics.websiteVisitors)} visitors
          </div>
        </div>
      </div>

      {/* Sales Funnel Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Funnel Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Website Visitors</span>
              </div>
              <span className="text-lg font-semibold">{formatNumber(analytics.websiteVisitors)}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <UserCheck className="w-5 h-5 text-green-500" />
                <span className="font-medium">Registrations</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-semibold">{formatNumber(analytics.registrations)}</span>
                <span className="text-sm text-gray-500 ml-2">
                  ({formatPercentage(analytics.registrations / analytics.websiteVisitors)})
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <MousePointer className="w-5 h-5 text-orange-500" />
                <span className="font-medium">Property Views</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-semibold">{formatNumber(analytics.propertyViews)}</span>
                <span className="text-sm text-gray-500 ml-2">
                  ({formatPercentage(analytics.propertyViews / analytics.registrations)})
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-purple-500" />
                <span className="font-medium">Reservations</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-semibold">{formatNumber(analytics.reservations)}</span>
                <span className="text-sm text-gray-500 ml-2">
                  ({formatPercentage(analytics.reservations / analytics.propertyViews)})
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Development Performance</h3>
          <div className="space-y-4">
            {analytics.developmentPerformance.map((dev, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{dev.name}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    dev.soldCount === dev.totalUnits ? 'bg-red-100 text-red-700' :
                    dev.soldCount / dev.totalUnits > 0.8 ? 'bg-orange-100 text-orange-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {dev.soldCount === dev.totalUnits ? 'SOLD OUT' :
                     dev.soldCount / dev.totalUnits > 0.8 ? 'SELLING FAST' : 'AVAILABLE'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Units Sold</p>
                    <p className="font-medium">{dev.soldCount}/{dev.totalUnits}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Avg Price</p>
                    <p className="font-medium">{formatCurrency(dev.avgPrice)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Revenue</p>
                    <p className="font-medium">{formatCurrency(dev.revenue)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Sales Velocity</p>
                    <p className="font-medium">{dev.velocity} units/month</p>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(dev.soldCount / dev.totalUnits) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {((dev.soldCount / dev.totalUnits) * 100).toFixed(1)}% sold
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Insights & Customizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Buyer Demographics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">First-Time Buyers</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${analytics.buyerDemographics.firstTimeBuyers * 100}%` }}></div>
                </div>
                <span className="font-medium">{formatPercentage(analytics.buyerDemographics.firstTimeBuyers)}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Investors</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: `${analytics.buyerDemographics.investors * 100}%` }}></div>
                </div>
                <span className="font-medium">{formatPercentage(analytics.buyerDemographics.investors)}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Upgraders</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${analytics.buyerDemographics.upgraders * 100}%` }}></div>
                </div>
                <span className="font-medium">{formatPercentage(analytics.buyerDemographics.upgraders)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-900">Key Insight</p>
            <p className="text-sm text-blue-700 mt-1">
              {formatPercentage(analytics.buyerDemographics.firstTimeBuyers)} of buyers are first-time purchasers, 
              indicating strong appeal to government Help-to-Buy scheme participants.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Customizations</h3>
          <div className="space-y-4">
            {analytics.popularCustomizations.map((custom, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{custom.name}</h4>
                  <span className="text-sm font-semibold text-green-600">
                    +{formatCurrency(custom.value)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${custom.uptake * 100}%` }}></div>
                  </div>
                  <span className="text-sm font-medium">{formatPercentage(custom.uptake)} uptake</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-green-900">Revenue Impact</p>
            <p className="text-sm text-green-700 mt-1">
              {formatPercentage(analytics.customizationUptake)} of buyers add customizations, 
              increasing average property value by 2-3%.
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Intelligence Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{analytics.avgTimeToReservation}</div>
            <div className="text-sm text-gray-600">Days Average Time to Reservation</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{formatCurrency(analytics.avgPropertyPrice)}</div>
            <div className="text-sm text-gray-600">Average Property Price</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{inventoryMonthsRemaining.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Months Inventory Remaining</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyBusinessIntelligence;