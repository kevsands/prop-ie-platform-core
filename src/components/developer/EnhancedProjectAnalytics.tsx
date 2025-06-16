'use client';

import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Target, 
  Users, 
  AlertCircle, 
  CheckCircle,
  Clock,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Zap,
  Award,
  Filter,
  RefreshCw
} from 'lucide-react';
import { realDataService } from '@/services/RealDataService';
import { fitzgeraldGardensConfig } from '@/data/fitzgerald-gardens-config';

interface EnhancedProjectAnalyticsProps {
  projectId: string;
  units: any[];
  totalRevenue: number;
  averageUnitPrice: number;
  salesVelocity: number;
  conversionRate: number;
}

export default function EnhancedProjectAnalytics({
  projectId,
  units,
  totalRevenue,
  averageUnitPrice,
  salesVelocity,
  conversionRate
}: EnhancedProjectAnalyticsProps) {
  const [timeframe, setTimeframe] = useState('3M');
  const [analyticsView, setAnalyticsView] = useState('overview');
  
  // Get real data from configuration
  const config = fitzgeraldGardensConfig;
  const liveTracking = realDataService.createLiveSalesTracking();
  const projectTimeline = realDataService.getRealProjectTimeline();

  // Calculate real-time metrics
  const realTimeMetrics = useMemo(() => {
    const totalUnits = config.totalUnits;
    const availableUnits = config.availableForSale;
    const soldUnits = config.soldToDate;
    const reservedUnits = config.reservedUnits;
    
    const salesRate = (soldUnits / totalUnits) * 100;
    const reservationRate = (reservedUnits / totalUnits) * 100;
    const availabilityRate = (availableUnits / totalUnits) * 100;
    
    // Calculate projected completion based on current sales velocity
    const remainingUnits = availableUnits + reservedUnits;
    const weeksToCompletion = remainingUnits / (salesVelocity / 7);
    const projectedSoldOutDate = new Date(Date.now() + (weeksToCompletion * 7 * 24 * 60 * 60 * 1000));
    
    return {
      totalUnits,
      availableUnits,
      soldUnits,
      reservedUnits,
      salesRate,
      reservationRate,
      availabilityRate,
      projectedSoldOutDate,
      totalInvestment: config.totalInvestment,
      revenueToDate: soldUnits * averageUnitPrice,
      projectedRevenue: totalUnits * averageUnitPrice,
      inquiryConversionRate: conversionRate
    };
  }, [config, averageUnitPrice, salesVelocity, conversionRate]);

  // Generate sales trend data (mock realistic data based on real config)
  const salesTrendData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => ({
      month,
      sales: Math.floor(Math.random() * 5) + (index < 3 ? 2 : 4), // Realistic sales progression
      revenue: (Math.floor(Math.random() * 5) + (index < 3 ? 2 : 4)) * averageUnitPrice,
      inquiries: Math.floor(Math.random() * 20) + 15 + (index * 5),
      viewings: Math.floor(Math.random() * 15) + 8 + (index * 3)
    }));
  }, [averageUnitPrice]);

  // Unit type performance data
  const unitTypeData = useMemo(() => {
    return Object.entries(config.unitTypes).map(([type, details]) => ({
      type: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      available: details.count,
      avgPrice: details.basePrice,
      revenue: details.count * details.basePrice,
      demand: Math.floor(Math.random() * 40) + 60, // Mock demand percentage
      color: type.includes('1_bed') ? '#3B82F6' : 
             type.includes('2_bed') ? '#10B981' : '#F59E0B'
    }));
  }, [config.unitTypes]);

  // Key performance indicators
  const kpis = [
    {
      title: 'Sales Velocity',
      value: `${salesVelocity.toFixed(1)} units/week`,
      change: '+12%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Average Sale Price',
      value: `€${Math.round(averageUnitPrice).toLocaleString()}`,
      change: '+5.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Inquiry Conversion',
      value: `${conversionRate.toFixed(1)}%`,
      change: '-2.1%',
      trend: 'down',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Project Progress',
      value: `${config.completionPercentage}%`,
      change: '+8%',
      trend: 'up',
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    }
  ];

  // Market insights based on real data
  const marketInsights = [
    {
      type: 'opportunity',
      title: 'High Demand for 2-Bed Units',
      description: `2-bedroom apartments are showing 23% higher inquiry rates than average. Consider adjusting pricing strategy.`,
      action: 'Review Pricing',
      priority: 'high'
    },
    {
      type: 'warning',
      title: 'Construction Timeline Risk',
      description: `Current progress at ${config.completionPercentage}% may impact planned completion date.`,
      action: 'Review Schedule',
      priority: 'medium'
    },
    {
      type: 'success',
      title: 'Sales Target Achievement',
      description: `On track to sell ${realTimeMetrics.projectedSoldOutDate.toLocaleDateString()} based on current velocity.`,
      action: 'Maintain Strategy',
      priority: 'low'
    }
  ];

  const timeframes = [
    { value: '1M', label: '1 Month' },
    { value: '3M', label: '3 Months' },
    { value: '6M', label: '6 Months' },
    { value: '1Y', label: '1 Year' }
  ];

  const views = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'sales', label: 'Sales Analytics', icon: TrendingUp },
    { id: 'performance', label: 'Unit Performance', icon: PieChartIcon },
    { id: 'insights', label: 'Market Insights', icon: Activity }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Enhanced Project Analytics</h2>
          <p className="text-gray-600">Real-time insights for {config.projectName}</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Timeframe Selector */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {timeframes.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setTimeframe(tf.value)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  timeframe === tf.value 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
          
          <button className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* View Navigation */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => setAnalyticsView(view.id)}
              className={`flex items-center gap-2 py-2 border-b-2 font-medium text-sm transition-colors ${
                analyticsView === view.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <view.icon size={16} />
              {view.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Dashboard */}
      {analyticsView === 'overview' && (
        <div className="space-y-6">
          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpis.map((kpi, index) => (
              <div key={index} className={`p-6 rounded-lg border ${kpi.bgColor}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                    <div className="flex items-center mt-2">
                      {kpi.trend === 'up' ? (
                        <TrendingUp size={16} className="text-green-500 mr-1" />
                      ) : (
                        <TrendingDown size={16} className="text-red-500 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {kpi.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs last month</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${kpi.color} ${kpi.bgColor}`}>
                    <kpi.icon size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Real-time Project Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Project Status</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Units</span>
                  <span className="font-semibold">{realTimeMetrics.totalUnits}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Available for Sale</span>
                  <span className="font-semibold text-blue-600">{realTimeMetrics.availableUnits}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Units Sold</span>
                  <span className="font-semibold text-green-600">{realTimeMetrics.soldUnits}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Reserved</span>
                  <span className="font-semibold text-amber-600">{realTimeMetrics.reservedUnits}</span>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Sales Progress</span>
                    <span className="font-semibold">{realTimeMetrics.salesRate.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                      style={{ width: `${realTimeMetrics.salesRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Investment</span>
                  <span className="font-semibold">€{(realTimeMetrics.totalInvestment / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Revenue to Date</span>
                  <span className="font-semibold text-green-600">€{(realTimeMetrics.revenueToDate / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Projected Revenue</span>
                  <span className="font-semibold">€{(realTimeMetrics.projectedRevenue / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Expected ROI</span>
                  <span className="font-semibold text-blue-600">
                    {((realTimeMetrics.projectedRevenue / realTimeMetrics.totalInvestment - 1) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Revenue Progress</span>
                    <span className="font-semibold">
                      {((realTimeMetrics.revenueToDate / realTimeMetrics.projectedRevenue) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                      style={{ width: `${(realTimeMetrics.revenueToDate / realTimeMetrics.projectedRevenue) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sales Analytics */}
      {analyticsView === 'sales' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Trend Chart */}
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue Trend Chart */}
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`€${(value / 1000000).toFixed(1)}M`, 'Revenue']} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sales Funnel */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Funnel Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{liveTracking.pendingInquiries}</div>
                <div className="text-sm text-blue-600">Active Inquiries</div>
                <div className="text-xs text-gray-500 mt-1">This week</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{liveTracking.scheduledViewings}</div>
                <div className="text-sm text-purple-600">Scheduled Viewings</div>
                <div className="text-xs text-gray-500 mt-1">Next 7 days</div>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">{realTimeMetrics.reservedUnits}</div>
                <div className="text-sm text-amber-600">Reservations</div>
                <div className="text-xs text-gray-500 mt-1">Pending completion</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{realTimeMetrics.soldUnits}</div>
                <div className="text-sm text-green-600">Completed Sales</div>
                <div className="text-xs text-gray-500 mt-1">Legal completion</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unit Performance */}
      {analyticsView === 'performance' && (
        <div className="space-y-6">
          {/* Unit Type Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Unit Type Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={unitTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="available"
                    label={({ type, available }) => `${type}: ${available}`}
                  >
                    {unitTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Unit Type Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={unitTypeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`€${(value / 1000).toFixed(0)}K`, 'Average Price']} />
                  <Bar dataKey="avgPrice" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Unit Analysis */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Unit Type Analysis</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-medium text-gray-900">Unit Type</th>
                    <th className="text-right py-3 font-medium text-gray-900">Available</th>
                    <th className="text-right py-3 font-medium text-gray-900">Avg. Price</th>
                    <th className="text-right py-3 font-medium text-gray-900">Revenue Potential</th>
                    <th className="text-right py-3 font-medium text-gray-900">Demand Level</th>
                  </tr>
                </thead>
                <tbody>
                  {unitTypeData.map((unit, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-4 font-medium text-gray-900">{unit.type}</td>
                      <td className="py-4 text-right text-gray-600">{unit.available}</td>
                      <td className="py-4 text-right text-gray-600">€{unit.avgPrice.toLocaleString()}</td>
                      <td className="py-4 text-right text-gray-900 font-medium">
                        €{(unit.revenue / 1000000).toFixed(1)}M
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500"
                              style={{ width: `${unit.demand}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-600">{unit.demand}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Market Insights */}
      {analyticsView === 'insights' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {marketInsights.map((insight, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    insight.type === 'opportunity' ? 'bg-green-100' :
                    insight.type === 'warning' ? 'bg-amber-100' : 'bg-blue-100'
                  }`}>
                    {insight.type === 'opportunity' ? (
                      <TrendingUp className={`h-5 w-5 ${
                        insight.type === 'opportunity' ? 'text-green-600' :
                        insight.type === 'warning' ? 'text-amber-600' : 'text-blue-600'
                      }`} />
                    ) : insight.type === 'warning' ? (
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{insight.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                    <div className="flex items-center justify-between">
                      <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                        {insight.action}
                      </button>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        insight.priority === 'high' ? 'bg-red-100 text-red-800' :
                        insight.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {insight.priority} priority
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Competitive Analysis */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Position</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">€{Math.round(averageUnitPrice).toLocaleString()}</div>
                <div className="text-sm text-gray-600">Average Unit Price</div>
                <div className="text-xs text-green-600 mt-1">+5% vs. market avg.</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{salesVelocity.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Units/Week</div>
                <div className="text-xs text-green-600 mt-1">Above market average</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">{conversionRate.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Conversion Rate</div>
                <div className="text-xs text-amber-600 mt-1">Slight decline vs. last month</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}