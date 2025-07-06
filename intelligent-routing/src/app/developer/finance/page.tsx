'use client';

import React, { useState } from 'react';
import useProjectData from '@/hooks/useProjectData';
import { 
  Building2, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Wallet,
  PieChart,
  CreditCard,
  Receipt,
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Download,
  Filter,
  Zap
} from 'lucide-react';

export default function DeveloperFinancePage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('monthly');
  const [selectedProject, setSelectedProject] = useState('fitzgerald-gardens');

  // Enterprise data integration with real-time financial metrics
  const {
    project,
    totalRevenue,
    averageUnitPrice,
    soldUnits,
    reservedUnits,
    totalUnits,
    isLoading,
    lastUpdated,
    teamMembers,
    invoices,
    feeProposals
  } = useProjectData(selectedProject);

  // Enhanced financial calculations from enterprise data
  const financialMetrics = {
    totalRevenue: totalRevenue || 0,
    projectedRevenue: (totalUnits || 96) * (averageUnitPrice || 385000),
    completedRevenue: (soldUnits || 23) * (averageUnitPrice || 385000),
    pendingRevenue: (reservedUnits || 15) * (averageUnitPrice || 385000),
    remainingRevenue: ((totalUnits || 96) - (soldUnits || 23) - (reservedUnits || 15)) * (averageUnitPrice || 385000),
    
    // Cost calculations
    totalCosts: invoices.reduce((sum, inv) => sum + inv.amount, 0),
    pendingInvoices: invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0),
    paidInvoices: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0),
    
    // Profit calculations
    grossProfit: (totalRevenue || 0) - invoices.reduce((sum, inv) => sum + inv.amount, 0),
    profitMargin: (totalRevenue || 0) > 0 ? (((totalRevenue || 0) - invoices.reduce((sum, inv) => sum + inv.amount, 0)) / (totalRevenue || 0)) * 100 : 0,
    
    // Cash flow
    cashInflow: (soldUnits || 23) * (averageUnitPrice || 385000) * 0.3, // 30% deposits received
    cashOutflow: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0),
    netCashFlow: ((soldUnits || 23) * (averageUnitPrice || 385000) * 0.3) - invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0)
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Management</h1>
          <p className="text-gray-600 mt-1">
            Real-time financial analytics and cash flow management
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="fitzgerald-gardens">Fitzgerald Gardens</option>
            <option value="ellwood">Ellwood</option>
            <option value="ballymakenny-view">Ballymakenny View</option>
          </select>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
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

      {/* Real-time Data Indicator */}
      {lastUpdated && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-900">Live Financial Data</span>
              <span className="text-xs text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Zap size={16} />
              Real-time Sync
            </div>
          </div>
        </div>
      )}

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCompactCurrency(financialMetrics.totalRevenue)}</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">+18.5%</span>
                <span className="text-sm text-gray-500">vs target</span>
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
              <p className="text-sm text-gray-600">Gross Profit</p>
              <p className="text-2xl font-bold text-gray-900">{formatCompactCurrency(financialMetrics.grossProfit)}</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">{financialMetrics.profitMargin.toFixed(1)}%</span>
                <span className="text-sm text-gray-500">margin</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Net Cash Flow</p>
              <p className={`text-2xl font-bold ${financialMetrics.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCompactCurrency(Math.abs(financialMetrics.netCashFlow))}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {financialMetrics.netCashFlow >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-600" />
                )}
                <span className={`text-sm font-medium ${financialMetrics.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {financialMetrics.netCashFlow >= 0 ? 'Positive' : 'Negative'}
                </span>
                <span className="text-sm text-gray-500">flow</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Wallet size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Invoices</p>
              <p className="text-2xl font-bold text-orange-600">{formatCompactCurrency(financialMetrics.pendingInvoices)}</p>
              <div className="flex items-center gap-1 mt-1">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-600">
                  {invoices.filter(inv => inv.status === 'pending').length}
                </span>
                <span className="text-sm text-gray-500">invoices</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Receipt size={24} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-700">Completed Sales</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{formatCurrency(financialMetrics.completedRevenue)}</p>
                <p className="text-xs text-gray-500">{soldUnits} units</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-700">Reserved Units</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{formatCurrency(financialMetrics.pendingRevenue)}</p>
                <p className="text-xs text-gray-500">{reservedUnits} units</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <span className="text-sm text-gray-700">Remaining Units</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{formatCurrency(financialMetrics.remainingRevenue)}</p>
                <p className="text-xs text-gray-500">{(totalUnits || 96) - (soldUnits || 23) - (reservedUnits || 15)} units</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Revenue Progress</span>
              <span>{((financialMetrics.completedRevenue + financialMetrics.pendingRevenue) / financialMetrics.projectedRevenue * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="flex h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-green-500" 
                  style={{ width: `${(financialMetrics.completedRevenue / financialMetrics.projectedRevenue) * 100}%` }}
                />
                <div 
                  className="bg-blue-500" 
                  style={{ width: `${(financialMetrics.pendingRevenue / financialMetrics.projectedRevenue) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Invoices</h3>
          <div className="space-y-4">
            {invoices.slice(0, 5).map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{invoice.provider}</p>
                  <p className="text-xs text-gray-500">{invoice.type}</p>
                  <p className="text-xs text-gray-500">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(invoice.amount)}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                    invoice.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {invoices.length > 5 && (
            <div className="mt-4 text-center">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All Invoices ({invoices.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cash Flow Summary */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Cash Flow Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-3">
              <ArrowUpRight className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">{formatCompactCurrency(financialMetrics.cashInflow)}</p>
            <p className="text-sm text-gray-600">Cash Inflow</p>
            <p className="text-xs text-gray-500 mt-1">From unit deposits</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-3">
              <ArrowDownRight className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-red-600">{formatCompactCurrency(financialMetrics.cashOutflow)}</p>
            <p className="text-sm text-gray-600">Cash Outflow</p>
            <p className="text-xs text-gray-500 mt-1">Paid invoices</p>
          </div>
          
          <div className="text-center">
            <div className={`flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-3 ${
              financialMetrics.netCashFlow >= 0 ? 'bg-blue-100' : 'bg-orange-100'
            }`}>
              <Wallet className={`h-8 w-8 ${financialMetrics.netCashFlow >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
            </div>
            <p className={`text-2xl font-bold ${financialMetrics.netCashFlow >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
              {formatCompactCurrency(Math.abs(financialMetrics.netCashFlow))}
            </p>
            <p className="text-sm text-gray-600">Net Cash Flow</p>
            <p className={`text-xs mt-1 ${financialMetrics.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {financialMetrics.netCashFlow >= 0 ? 'Positive' : 'Negative'} position
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}