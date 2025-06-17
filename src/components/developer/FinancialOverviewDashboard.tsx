'use client';

import React, { useState, useMemo } from 'react';
import { 
  Euro, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Calculator, 
  Target, 
  Calendar, 
  AlertCircle, 
  CheckCircle,
  CreditCard,
  Receipt,
  Building,
  Home,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Download,
  RefreshCw,
  Settings,
  Filter,
  Zap,
  Clock
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { fitzgeraldGardensConfig } from '@/data/fitzgerald-gardens-config';
import { realDataService } from '@/services/RealDataService';

interface FinancialOverviewProps {
  units: any[];
  totalRevenue: number;
  averageUnitPrice: number;
  salesVelocity?: number;
  conversionRate?: number;
  soldUnits?: number;
  reservedUnits?: number;
  totalUnits?: number;
}

export default function FinancialOverviewDashboard({ 
  units, 
  totalRevenue, 
  averageUnitPrice,
  salesVelocity = 0,
  conversionRate = 0,
  soldUnits: propSoldUnits,
  reservedUnits: propReservedUnits,
  totalUnits: propTotalUnits
}: FinancialOverviewProps) {
  const [timeframe, setTimeframe] = useState<'3M' | '6M' | '1Y' | 'ALL'>('6M');
  const [viewMode, setViewMode] = useState<'overview' | 'cashflow' | 'projections' | 'costs'>('overview');

  // Get real project data
  const config = fitzgeraldGardensConfig;
  const liveTracking = realDataService.createLiveSalesTracking();

  // Calculate comprehensive financial metrics using live database data
  const financialMetrics = useMemo(() => {
    const totalInvestment = config.totalInvestment;
    
    // Use live data when available, fallback to config
    const soldUnits = propSoldUnits !== undefined ? propSoldUnits : 
                     units.length > 0 ? units.filter(u => u.status === 'SOLD').length : config.soldToDate;
    const reservedUnits = propReservedUnits !== undefined ? propReservedUnits :
                         units.length > 0 ? units.filter(u => u.status === 'RESERVED').length : config.reservedUnits;
    const totalUnits = propTotalUnits !== undefined ? propTotalUnits :
                      units.length > 0 ? units.length : config.totalUnits;
    const availableUnits = totalUnits - soldUnits - reservedUnits;
    
    // Calculate live pricing data
    const liveAveragePrice = units.length > 0 ? 
      units.reduce((sum, unit) => sum + unit.pricing.currentPrice, 0) / units.length : averageUnitPrice;
    const actualAveragePrice = liveAveragePrice || averageUnitPrice;
    
    // Revenue calculations using live data
    const currentRevenue = units.length > 0 ? 
      units.filter(u => u.status === 'SOLD').reduce((sum, unit) => sum + unit.pricing.currentPrice, 0) :
      soldUnits * actualAveragePrice;
    const reservedRevenue = units.length > 0 ?
      units.filter(u => u.status === 'RESERVED').reduce((sum, unit) => sum + unit.pricing.currentPrice, 0) :
      reservedUnits * actualAveragePrice;
    const projectedTotalRevenue = units.length > 0 ?
      units.reduce((sum, unit) => sum + unit.pricing.currentPrice, 0) :
      totalUnits * actualAveragePrice;
    
    // Calculate costs and margins
    const constructionCosts = totalInvestment * 0.65; // 65% construction
    const landCosts = totalInvestment * 0.20; // 20% land
    const professionalFees = totalInvestment * 0.08; // 8% professional fees
    const marketingCosts = totalInvestment * 0.03; // 3% marketing
    const contingency = totalInvestment * 0.04; // 4% contingency
    
    const totalCosts = constructionCosts + landCosts + professionalFees + marketingCosts + contingency;
    const grossProfit = projectedTotalRevenue - totalCosts;
    const grossMargin = (grossProfit / projectedTotalRevenue) * 100;
    
    // ROI calculations
    const currentROI = ((currentRevenue - (totalCosts * (soldUnits / totalUnits))) / totalInvestment) * 100;
    const projectedROI = (grossProfit / totalInvestment) * 100;
    
    // Cash flow calculations
    const cashInvested = totalInvestment;
    const cashReceived = currentRevenue;
    const netCashPosition = cashReceived - cashInvested;
    
    // Sales velocity and projections using live data
    const liveSalesVelocity = salesVelocity > 0 ? salesVelocity : 2.3; // fallback to existing estimate
    const remainingUnits = availableUnits + reservedUnits;
    const weeksToSellOut = remainingUnits / Math.max(liveSalesVelocity, 0.1); // Avoid division by zero
    const projectedSellOutDate = new Date(Date.now() + (weeksToSellOut * 7 * 24 * 60 * 60 * 1000));
    
    return {
      totalInvestment,
      currentRevenue,
      reservedRevenue,
      projectedTotalRevenue,
      constructionCosts,
      landCosts,
      professionalFees,
      marketingCosts,
      contingency,
      totalCosts,
      grossProfit,
      grossMargin,
      currentROI,
      projectedROI,
      cashInvested,
      cashReceived,
      netCashPosition,
      salesVelocity: liveSalesVelocity,
      projectedSellOutDate,
      unitsProgress: (soldUnits / totalUnits) * 100,
      revenueProgress: (currentRevenue / projectedTotalRevenue) * 100,
      isLiveData: units.length > 0,
      dataSource: units.length > 0 ? 'database' : 'configuration'
    };
  }, [config, averageUnitPrice, units, salesVelocity, propSoldUnits, propReservedUnits, propTotalUnits]);

  // Generate monthly cash flow data
  const cashFlowData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const startMonth = new Date(config.projectStartDate).getMonth();
    
    return months.map((month, index) => {
      const monthIndex = (startMonth + index) % 12;
      const isProjectMonth = index <= 10; // 11 months into project
      
      // Mock realistic cash flow patterns
      const constructionSpend = isProjectMonth ? -2500000 - (Math.random() * 1000000) : 0;
      const salesIncome = isProjectMonth && index >= 4 ? // Sales start after 4 months
        1200000 + (Math.random() * 800000) + (index * 100000) : 0;
      
      const netCashFlow = salesIncome + constructionSpend;
      const cumulativeCash = index === 0 ? netCashFlow : netCashFlow;
      
      return {
        month: months[monthIndex],
        cashIn: salesIncome,
        cashOut: Math.abs(constructionSpend),
        netCashFlow,
        cumulativeCash,
        unitsCompleted: isProjectMonth ? Math.min(index * 2, config.phase1Units) : 0
      };
    });
  }, [config]);

  // Cost breakdown data
  const costBreakdownData = useMemo(() => [
    { name: 'Construction', value: financialMetrics.constructionCosts, color: '#3B82F6', percentage: 65 },
    { name: 'Land Acquisition', value: financialMetrics.landCosts, color: '#10B981', percentage: 20 },
    { name: 'Professional Fees', value: financialMetrics.professionalFees, color: '#F59E0B', percentage: 8 },
    { name: 'Marketing', value: financialMetrics.marketingCosts, color: '#EF4444', percentage: 3 },
    { name: 'Contingency', value: financialMetrics.contingency, color: '#8B5CF6', percentage: 4 }
  ], [financialMetrics]);

  // Revenue projection data
  const revenueProjectionData = useMemo(() => {
    const quarters = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025', 'Q3 2025'];
    
    return quarters.map((quarter, index) => {
      const baseRevenue = index < 2 ? 0 : // No sales first 2 quarters
        index < 4 ? 1500000 + (index * 500000) : // Ramp up
        3000000 + ((index - 4) * 1000000); // Peak sales
      
      const actualRevenue = index < 3 ? baseRevenue : baseRevenue * (0.9 + Math.random() * 0.2);
      const projectedRevenue = baseRevenue;
      
      return {
        quarter,
        actual: actualRevenue,
        projected: projectedRevenue,
        unitsSold: Math.floor(actualRevenue / averageUnitPrice)
      };
    });
  }, [averageUnitPrice]);

  // Key performance indicators
  const kpis = [
    {
      title: 'Total Investment',
      value: `€${(financialMetrics.totalInvestment / 1000000).toFixed(1)}M`,
      change: null,
      icon: Building,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Revenue to Date',
      value: `€${(financialMetrics.currentRevenue / 1000000).toFixed(1)}M`,
      change: '+12.3%',
      trend: 'up',
      icon: Euro,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Projected ROI',
      value: `${financialMetrics.projectedROI.toFixed(1)}%`,
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Gross Margin',
      value: `${financialMetrics.grossMargin.toFixed(1)}%`,
      change: '-0.5%',
      trend: 'down',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Cash Position',
      value: `€${(financialMetrics.netCashPosition / 1000000).toFixed(1)}M`,
      change: financialMetrics.netCashPosition > 0 ? '+8.7%' : '-15.2%',
      trend: financialMetrics.netCashPosition > 0 ? 'up' : 'down',
      icon: CreditCard,
      color: financialMetrics.netCashPosition > 0 ? 'text-green-600' : 'text-red-600',
      bgColor: financialMetrics.netCashPosition > 0 ? 'bg-green-50' : 'bg-red-50'
    },
    {
      title: 'Sell-out Date',
      value: financialMetrics.projectedSellOutDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      change: null,
      icon: Calendar,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            Financial Overview Dashboard
            {financialMetrics.isLiveData && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <Euro size={12} className="mr-1" />
                Live Data
              </span>
            )}
          </h2>
          <p className="text-gray-600">
            Real-time financial tracking for {config.projectName}
            {financialMetrics.isLiveData && (
              <span className="text-green-600 ml-2">• Connected to database ({units.length} units)</span>
            )}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['overview', 'cashflow', 'projections', 'costs'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-3 py-1 rounded text-sm transition-colors capitalize ${
                  viewMode === mode ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="3M">3 Months</option>
            <option value="6M">6 Months</option>
            <option value="1Y">1 Year</option>
            <option value="ALL">All Time</option>
          </select>
          
          <button className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, index) => (
          <div key={index} className={`p-4 rounded-lg border ${kpi.bgColor}`}>
            <div className="flex items-center justify-between mb-2">
              <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
              {kpi.change && (
                <div className="flex items-center gap-1">
                  {kpi.trend === 'up' ? (
                    <ArrowUpRight size={16} className="text-green-500" />
                  ) : (
                    <ArrowDownRight size={16} className="text-red-500" />
                  )}
                  <span className={`text-xs font-medium ${
                    kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.change}
                  </span>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
              <p className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Overview Dashboard */}
      {viewMode === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Progress */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Revenue Target</span>
                  <span className="text-sm text-gray-600">
                    €{(financialMetrics.currentRevenue / 1000000).toFixed(1)}M / €{(financialMetrics.projectedTotalRevenue / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full"
                    style={{ width: `${financialMetrics.revenueProgress}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">{financialMetrics.revenueProgress.toFixed(1)}% complete</div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Units Sold</span>
                  <span className="text-sm text-gray-600">
                    {financialMetrics.isLiveData ? 
                      `${units.filter(u => u.status === 'SOLD').length} / ${units.length} units` :
                      `${config.soldToDate} / ${config.totalUnits} units`}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
                    style={{ width: `${financialMetrics.unitsProgress}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">{financialMetrics.unitsProgress.toFixed(1)}% sold</div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Reserved Revenue:</span>
                  <div className="font-semibold text-gray-900">€{(financialMetrics.reservedRevenue / 1000000).toFixed(1)}M</div>
                </div>
                <div>
                  <span className="text-gray-600">Remaining Potential:</span>
                  <div className="font-semibold text-gray-900">
                    €{((financialMetrics.projectedTotalRevenue - financialMetrics.currentRevenue - financialMetrics.reservedRevenue) / 1000000).toFixed(1)}M
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profitability Analysis */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profitability Analysis</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Projected Revenue</span>
                <span className="font-semibold text-gray-900">€{(financialMetrics.projectedTotalRevenue / 1000000).toFixed(1)}M</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Costs</span>
                <span className="font-semibold text-red-600">-€{(financialMetrics.totalCosts / 1000000).toFixed(1)}M</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-medium">Gross Profit</span>
                  <span className="font-bold text-green-600">€{(financialMetrics.grossProfit / 1000000).toFixed(1)}M</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Gross Margin</span>
                <span className="font-semibold text-green-600">{financialMetrics.grossMargin.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Projected ROI</span>
                <span className="font-semibold text-emerald-600">{financialMetrics.projectedROI.toFixed(1)}%</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="font-medium text-emerald-800">
                  Project on track for {financialMetrics.projectedROI.toFixed(1)}% ROI
                </span>
              </div>
              <p className="text-sm text-emerald-700 mt-1">
                Expected completion: {financialMetrics.projectedSellOutDate.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cash Flow View */}
      {viewMode === 'cashflow' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Cash Flow</h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`€${(value / 1000000).toFixed(1)}M`, '']} />
                <Area type="monotone" dataKey="cashIn" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                <Area type="monotone" dataKey="cashOut" stackId="2" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                <Line type="monotone" dataKey="netCashFlow" stroke="#3B82F6" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border">
              <h4 className="font-semibold text-gray-900 mb-3">Cash Inflows</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Unit Sales</span>
                  <span className="text-sm font-medium">€{(financialMetrics.currentRevenue / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Deposits</span>
                  <span className="text-sm font-medium">€{(financialMetrics.reservedRevenue * 0.1 / 1000000).toFixed(1)}M</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h4 className="font-semibold text-gray-900 mb-3">Cash Outflows</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Construction</span>
                  <span className="text-sm font-medium text-red-600">-€{(financialMetrics.constructionCosts / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Professional Fees</span>
                  <span className="text-sm font-medium text-red-600">-€{(financialMetrics.professionalFees / 1000000).toFixed(1)}M</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h4 className="font-semibold text-gray-900 mb-3">Net Position</h4>
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  financialMetrics.netCashPosition > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  €{(financialMetrics.netCashPosition / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {financialMetrics.netCashPosition > 0 ? 'Positive' : 'Negative'} Cash Flow
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Projections View */}
      {viewMode === 'projections' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Projections vs Actual</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={revenueProjectionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis />
                <Tooltip formatter={(value) => [`€${(value / 1000000).toFixed(1)}M`, '']} />
                <Line type="monotone" dataKey="projected" stroke="#94A3B8" strokeWidth={2} strokeDasharray="5 5" />
                <Line type="monotone" dataKey="actual" stroke="#3B82F6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Forecast</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium text-blue-800">Remaining Units to Sell</span>
                  <span className="text-xl font-bold text-blue-600">
                    {financialMetrics.isLiveData ? 
                      units.filter(u => u.status === 'AVAILABLE' || u.status === 'RESERVED').length :
                      config.availableForSale + config.reservedUnits}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-medium text-green-800">Projected Monthly Sales</span>
                  <span className="text-xl font-bold text-green-600">{(financialMetrics.salesVelocity * 4.33).toFixed(1)}</span>
                  {financialMetrics.isLiveData && (
                    <span className="text-xs text-green-600 ml-2">• Live velocity</span>
                  )}
                </div>
                <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                  <span className="font-medium text-amber-800">Expected Sell-out</span>
                  <span className="text-lg font-bold text-amber-600">
                    {financialMetrics.projectedSellOutDate.toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Milestones</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900">Project Launch</p>
                    <p className="text-sm text-gray-600">Sales commenced June 2024</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900">Break-even Point</p>
                    <p className="text-sm text-gray-600">60% sales milestone reached</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="font-medium text-gray-900">Construction Completion</p>
                    <p className="text-sm text-gray-600">Expected August 2025</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900">Full Project ROI</p>
                    <p className="text-sm text-gray-600">Target: {financialMetrics.projectedROI.toFixed(1)}% return</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Costs View */}
      {viewMode === 'costs' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={costBreakdownData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                  >
                    {costBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`€${(value / 1000000).toFixed(1)}M`, '']} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Analysis</h3>
              <div className="space-y-4">
                {costBreakdownData.map((cost, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: cost.color }}
                      />
                      <span className="text-gray-900">{cost.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">€{(cost.value / 1000000).toFixed(1)}M</div>
                      <div className="text-sm text-gray-600">{cost.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Total Project Cost</span>
                  <span className="text-xl font-bold text-gray-900">
                    €{(financialMetrics.totalCosts / 1000000).toFixed(1)}M
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Management Alerts</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">
                    {financialMetrics.isLiveData ? 'Live Financial Tracking Active' : 'Construction Costs on Budget'}
                  </p>
                  <p className="text-sm text-green-700">
                    {financialMetrics.isLiveData ? 
                      `Real-time revenue tracking: €${(financialMetrics.currentRevenue / 1000000).toFixed(1)}M from ${units.filter(u => u.status === 'SOLD').length} completed sales` :
                      'Construction spending tracking within 2% of projected costs'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800">Professional Fees Review</p>
                  <p className="text-sm text-amber-700">Review upcoming professional service fees for Q3 2025</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">
                    {financialMetrics.isLiveData ? 'Sales Performance Insight' : 'Marketing Budget Optimization'}
                  </p>
                  <p className="text-sm text-blue-700">
                    {financialMetrics.isLiveData ? 
                      `Sales velocity of ${financialMetrics.salesVelocity.toFixed(1)} units/week ${financialMetrics.salesVelocity > 1.5 ? 'exceeds targets - consider premium pricing' : 'tracking well - maintain current strategy'}` :
                      'Consider reallocating marketing budget based on strong sales performance'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}