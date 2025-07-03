'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Plus, 
  Trash2, 
  Save,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Target,
  Award,
  Info,
  Settings,
  Eye,
  Edit3,
  Filter
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar } from 'recharts';

// Financial tracking categories for property development
const FINANCIAL_CATEGORIES = {
  revenue: {
    name: 'Revenue Streams',
    icon: <TrendingUp className="w-4 h-4" />,
    color: '#10B981',
    subCategories: [
      'Property Sales',
      'Rental Income',
      'Parking Sales',
      'Commercial Units',
      'Government Grants',
      'Other Revenue'
    ]
  },
  costs: {
    name: 'Development Costs',
    icon: <TrendingDown className="w-4 h-4" />,
    color: '#EF4444',
    subCategories: [
      'Land Acquisition',
      'Construction Costs',
      'Professional Fees',
      'Finance Costs',
      'Marketing & Sales',
      'Legal & Compliance',
      'Contingency'
    ]
  },
  cashflow: {
    name: 'Cash Flow',
    icon: <DollarSign className="w-4 h-4" />,
    color: '#3B82F6',
    subCategories: [
      'Operating Cash Flow',
      'Investment Cash Flow',
      'Financing Cash Flow'
    ]
  }
};

// Predefined metrics for Irish property development
const PERFORMANCE_METRICS = {
  profitability: [
    { key: 'gross_profit_margin', name: 'Gross Profit Margin', format: 'percentage' },
    { key: 'net_profit_margin', name: 'Net Profit Margin', format: 'percentage' },
    { key: 'roi', name: 'Return on Investment', format: 'percentage' },
    { key: 'irr', name: 'Internal Rate of Return', format: 'percentage' }
  ],
  efficiency: [
    { key: 'cost_per_sqm', name: 'Cost per Sq. Meter', format: 'currency' },
    { key: 'revenue_per_unit', name: 'Revenue per Unit', format: 'currency' },
    { key: 'sale_rate', name: 'Sales Rate (units/month)', format: 'number' },
    { key: 'construction_variance', name: 'Construction Cost Variance', format: 'percentage' }
  ],
  market: [
    { key: 'market_price_variance', name: 'Market Price Variance', format: 'percentage' },
    { key: 'time_to_sell', name: 'Average Time to Sell (months)', format: 'number' },
    { key: 'price_per_sqm', name: 'Price per Sq. Meter', format: 'currency' },
    { key: 'absorption_rate', name: 'Market Absorption Rate', format: 'percentage' }
  ]
};

interface FinancialEntry {
  id: string;
  date: string;
  category: string;
  subCategory: string;
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  status: 'planned' | 'committed' | 'actual';
  reference?: string;
  notes?: string;
}

interface MetricValue {
  current: number;
  target: number;
  variance: number;
  trend: 'up' | 'down' | 'stable';
}

interface DynamicFinancialTrackerProps {
  onSave: (trackerData: any) => void;
  onCancel: () => void;
  projectId?: string;
  existingTracker?: any;
}

export default function DynamicFinancialTracker({
  onSave,
  onCancel,
  projectId,
  existingTracker
}: DynamicFinancialTrackerProps) {
  const [trackerData, setTrackerData] = useState({
    projectName: existingTracker?.projectName || '',
    trackerTitle: existingTracker?.trackerTitle || '',
    reportingPeriod: existingTracker?.reportingPeriod || 'monthly',
    baseCurrency: existingTracker?.baseCurrency || 'EUR',
    startDate: existingTracker?.startDate || new Date().toISOString().split('T')[0],
    endDate: existingTracker?.endDate || '',
    lastUpdated: existingTracker?.lastUpdated || new Date().toISOString()
  });

  const [entries, setEntries] = useState<FinancialEntry[]>(existingTracker?.entries || []);
  const [activeView, setActiveView] = useState<'entries' | 'dashboard' | 'analytics'>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'1m' | '3m' | '6m' | '1y' | 'all'>('3m');
  const [isCalculating, setIsCalculating] = useState(false);

  // Calculated financial summaries
  const financialSummary = useMemo(() => {
    const summary = {
      totalRevenue: 0,
      totalCosts: 0,
      netProfit: 0,
      profitMargin: 0,
      actualRevenue: 0,
      plannedRevenue: 0,
      actualCosts: 0,
      plannedCosts: 0,
      cashPosition: 0
    };

    entries.forEach(entry => {
      if (entry.type === 'income') {
        summary.totalRevenue += entry.amount;
        if (entry.status === 'actual') summary.actualRevenue += entry.amount;
        if (entry.status === 'planned') summary.plannedRevenue += entry.amount;
      } else if (entry.type === 'expense') {
        summary.totalCosts += entry.amount;
        if (entry.status === 'actual') summary.actualCosts += entry.amount;
        if (entry.status === 'planned') summary.plannedCosts += entry.amount;
      }
    });

    summary.netProfit = summary.totalRevenue - summary.totalCosts;
    summary.profitMargin = summary.totalRevenue > 0 ? (summary.netProfit / summary.totalRevenue) * 100 : 0;
    summary.cashPosition = summary.actualRevenue - summary.actualCosts;

    return summary;
  }, [entries]);

  // Chart data for visualizations
  const chartData = useMemo(() => {
    const monthlyData = entries.reduce((acc, entry) => {
      const month = entry.date.substring(0, 7); // YYYY-MM format
      if (!acc[month]) {
        acc[month] = { month, revenue: 0, costs: 0, profit: 0 };
      }
      
      if (entry.type === 'income') {
        acc[month].revenue += entry.amount;
      } else if (entry.type === 'expense') {
        acc[month].costs += entry.amount;
      }
      
      acc[month].profit = acc[month].revenue - acc[month].costs;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(monthlyData).sort((a: any, b: any) => a.month.localeCompare(b.month));
  }, [entries]);

  // Category breakdown for pie chart
  const categoryData = useMemo(() => {
    const breakdown = entries.reduce((acc, entry) => {
      const category = entry.category;
      if (!acc[category]) {
        acc[category] = { name: category, value: 0 };
      }
      acc[category].value += Math.abs(entry.amount);
      return acc;
    }, {} as Record<string, any>);

    return Object.values(breakdown);
  }, [entries]);

  const addEntry = () => {
    const newEntry: FinancialEntry = {
      id: `entry-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      category: 'revenue',
      subCategory: 'Property Sales',
      description: '',
      amount: 0,
      type: 'income',
      status: 'planned'
    };
    setEntries(prev => [...prev, newEntry]);
  };

  const updateEntry = (id: string, field: string, value: any) => {
    setEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const removeEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const calculateMetrics = () => {
    setIsCalculating(true);
    setTimeout(() => {
      // Simulate metric calculations
      setIsCalculating(false);
    }, 800);
  };

  const handleSave = () => {
    if (!trackerData.trackerTitle) {
      alert('Please provide a tracker title.');
      return;
    }

    const financialTracker = {
      ...trackerData,
      entries,
      financialSummary,
      entryCount: entries.length,
      lastCalculated: new Date().toISOString(),
      projectId: projectId || 'general',
      documentType: 'financial_tracker',
      metadata: {
        totalValue: financialSummary.netProfit,
        currency: trackerData.baseCurrency,
        profitMargin: financialSummary.profitMargin,
        lastModified: new Date().toISOString()
      }
    };

    onSave(financialTracker);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: trackerData.baseCurrency
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  return (
    <div className="max-w-7xl mx-auto bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dynamic Financial Tracker</h1>
                <p className="text-gray-600">Real-time financial monitoring and analytics</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <RefreshCw className={`w-4 h-4 ${isCalculating ? 'animate-spin text-blue-600' : 'text-gray-400'}`} />
                <span className="text-sm text-gray-600">
                  Last updated: {new Date(trackerData.lastUpdated).toLocaleDateString()}
                </span>
              </div>
              <button
                onClick={calculateMetrics}
                className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Refresh Metrics
              </button>
              <button
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Tracker
              </button>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex items-center gap-6 mt-4">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'entries', label: 'Financial Entries', icon: <Edit3 className="w-4 h-4" /> },
              { id: 'analytics', label: 'Analytics', icon: <PieChart className="w-4 h-4" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  activeView === tab.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <div className="space-y-6">
            {/* Project Information */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tracker Title *</label>
                  <input
                    type="text"
                    value={trackerData.trackerTitle}
                    onChange={(e) => setTrackerData(prev => ({ ...prev, trackerTitle: e.target.value }))}
                    placeholder="e.g., Fitzgerald Gardens Financial Tracker"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                  <input
                    type="text"
                    value={trackerData.projectName}
                    onChange={(e) => setTrackerData(prev => ({ ...prev, projectName: e.target.value }))}
                    placeholder="Project name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Base Currency</label>
                  <select
                    value={trackerData.baseCurrency}
                    onChange={(e) => setTrackerData(prev => ({ ...prev, baseCurrency: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Key Metrics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-900">{formatCurrency(financialSummary.totalRevenue)}</p>
                    <p className="text-xs text-green-600 mt-1">
                      Actual: {formatCurrency(financialSummary.actualRevenue)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-700">Total Costs</p>
                    <p className="text-2xl font-bold text-red-900">{formatCurrency(financialSummary.totalCosts)}</p>
                    <p className="text-xs text-red-600 mt-1">
                      Actual: {formatCurrency(financialSummary.actualCosts)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700">Net Profit</p>
                    <p className="text-2xl font-bold text-blue-900">{formatCurrency(financialSummary.netProfit)}</p>
                    <p className="text-xs text-blue-600 mt-1">
                      Margin: {formatPercentage(financialSummary.profitMargin)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-700">Cash Position</p>
                    <p className="text-2xl font-bold text-purple-900">{formatCurrency(financialSummary.cashPosition)}</p>
                    <p className="text-xs text-purple-600 mt-1">Real-time</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Trends Chart */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Trends</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => formatCurrency(value)} />
                    <Area type="monotone" dataKey="revenue" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="costs" stackId="2" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="profit" stackId="3" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Financial Entries View */}
        {activeView === 'entries' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Financial Entries</h3>
              <button
                onClick={addEntry}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Entry
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Category</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Description</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Amount</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry, index) => (
                      <tr key={entry.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                        <td className="px-4 py-3">
                          <input
                            type="date"
                            value={entry.date}
                            onChange={(e) => updateEntry(entry.id, 'date', e.target.value)}
                            className="w-full bg-transparent border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={entry.category}
                            onChange={(e) => updateEntry(entry.id, 'category', e.target.value)}
                            className="w-full bg-transparent border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
                          >
                            {Object.entries(FINANCIAL_CATEGORIES).map(([key, cat]) => (
                              <option key={key} value={key}>{cat.name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={entry.description}
                            onChange={(e) => updateEntry(entry.id, 'description', e.target.value)}
                            placeholder="Description"
                            className="w-full bg-transparent border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={entry.type}
                            onChange={(e) => updateEntry(entry.id, 'type', e.target.value)}
                            className="w-full bg-transparent border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                            <option value="transfer">Transfer</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={entry.status}
                            onChange={(e) => updateEntry(entry.id, 'status', e.target.value)}
                            className="w-full bg-transparent border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="planned">Planned</option>
                            <option value="committed">Committed</option>
                            <option value="actual">Actual</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <input
                            type="number"
                            step="0.01"
                            value={entry.amount}
                            onChange={(e) => updateEntry(entry.id, 'amount', parseFloat(e.target.value) || 0)}
                            className="w-full bg-transparent border border-gray-300 rounded px-2 py-1 text-right focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => removeEntry(entry.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Analytics View */}
        {activeView === 'analytics' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Financial Analytics</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Breakdown */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Expense Breakdown</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => formatCurrency(value)} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Key Performance Indicators</h4>
                <div className="space-y-4">
                  {Object.entries(PERFORMANCE_METRICS).map(([category, metrics]) => (
                    <div key={category}>
                      <h5 className="text-sm font-medium text-gray-700 mb-2 capitalize">{category}</h5>
                      <div className="space-y-2">
                        {metrics.map(metric => (
                          <div key={metric.key} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{metric.name}</span>
                            <span className="text-sm font-medium text-gray-900">
                              {metric.format === 'currency' ? formatCurrency(0) :
                               metric.format === 'percentage' ? formatPercentage(0) : '0'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}