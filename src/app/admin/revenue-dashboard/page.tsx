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
  RefreshCw
} from 'lucide-react';
import { revenueEngine, FeeType } from '@/services/revenueEngine';

interface RevenueMetrics {
  totalRevenue: number;
  monthlyGrowth: number;
  transactionCount: number;
  avgTransactionValue: number;
  revenueByType: Record<FeeType, number>;
  subscriptionMRR: number;
  propChoiceRevenue: number;
  tenderRevenue: number;
}

export default function RevenueDashboard() {
  const [timeRange, setTimeRange] = useState('30d');
  const [metrics, setMetrics] = useState<RevenueMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock revenue data - in production this would come from your database
  const mockMetrics: RevenueMetrics = {
    totalRevenue: 127450.75,
    monthlyGrowth: 23.5,
    transactionCount: 342,
    avgTransactionValue: 372.81,
    revenueByType: {
      [FeeType.TRANSACTION_FEE]: 45230.50,
      [FeeType.PROCESSING_FEE]: 12840.25,
      [FeeType.PROP_CHOICE_COMMISSION]: 18750.00,
      [FeeType.SUBSCRIPTION_FEE]: 47250.00, // ~19 Enterprise customers
      [FeeType.TENDER_SUBMISSION_FEE]: 2800.00,
      [FeeType.PREMIUM_LISTING_FEE]: 380.00,
      [FeeType.AI_ANALYSIS_FEE]: 200.00
    },
    subscriptionMRR: 47250.00,
    propChoiceRevenue: 18750.00,
    tenderRevenue: 3380.00
  };

  const recentTransactions = [
    {
      id: 'TXN-001',
      type: 'Property Purchase',
      amount: 375000,
      fee: 5625.00,
      feeType: 'Transaction Fee (1.5%)',
      developer: 'Cairn Homes',
      timestamp: '2024-06-15 14:30'
    },
    {
      id: 'PC-045',
      type: 'PROP Choice Purchase',
      amount: 2850.00,
      fee: 427.50,
      feeType: 'Commission (15%)',
      developer: 'Fitzgerald Gardens',
      timestamp: '2024-06-15 11:20'
    },
    {
      id: 'SUB-019',
      type: 'Subscription Renewal',
      amount: 2499.00,
      fee: 2499.00,
      feeType: 'Enterprise Plan',
      developer: 'Property Developments Ltd',
      timestamp: '2024-06-15 09:15'
    },
    {
      id: 'TND-078',
      type: 'Tender Submission',
      amount: 450000,
      fee: 25.00,
      feeType: 'Submission Fee',
      developer: 'Elite Electrical Ltd',
      timestamp: '2024-06-14 16:45'
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setMetrics(mockMetrics);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading revenue analytics...</p>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Revenue Dashboard</h1>
              <p className="text-gray-600 mt-1">Platform revenue analytics and optimization</p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalRevenue)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 text-sm font-medium">
                {formatPercentage(metrics.monthlyGrowth)}
              </span>
              <span className="text-gray-500 text-sm ml-2">vs last month</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Recurring Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.subscriptionMRR)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 text-sm font-medium">+18.2%</span>
              <span className="text-gray-500 text-sm ml-2">subscription growth</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">PROP Choice Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.propChoiceRevenue)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 text-sm font-medium">+31.4%</span>
              <span className="text-gray-500 text-sm ml-2">commission revenue</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Transaction Count</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.transactionCount.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Receipt className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-gray-900 text-sm font-medium">
                Avg: {formatCurrency(metrics.avgTransactionValue)}
              </span>
            </div>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue by Type</h3>
            <div className="space-y-4">
              {Object.entries(metrics.revenueByType).map(([type, amount]) => {
                const percentage = (amount / metrics.totalRevenue) * 100;
                let label = '';
                let color = '';
                
                switch (type) {
                  case FeeType.TRANSACTION_FEE:
                    label = 'Transaction Fees';
                    color = 'bg-blue-500';
                    break;
                  case FeeType.SUBSCRIPTION_FEE:
                    label = 'Subscriptions';
                    color = 'bg-green-500';
                    break;
                  case FeeType.PROP_CHOICE_COMMISSION:
                    label = 'PROP Choice';
                    color = 'bg-purple-500';
                    break;
                  case FeeType.PROCESSING_FEE:
                    label = 'Processing Fees';
                    color = 'bg-yellow-500';
                    break;
                  case FeeType.TENDER_SUBMISSION_FEE:
                    label = 'Tender Submissions';
                    color = 'bg-orange-500';
                    break;
                  default:
                    label = type.replace(/_/g, ' ').toLowerCase();
                    color = 'bg-gray-500';
                }

                return (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${color} mr-3`}></div>
                      <span className="text-sm font-medium text-gray-900">{label}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900">{formatCurrency(amount)}</span>
                      <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Optimization</h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900">High-Value Opportunity</h4>
                <p className="text-sm text-green-800 mt-1">
                  PROP Choice showing 31% growth - consider increasing commission rates for premium items
                </p>
                <div className="mt-2">
                  <span className="text-sm font-bold text-green-900">Potential uplift: +€5,600/month</span>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">Subscription Growth</h4>
                <p className="text-sm text-blue-800 mt-1">
                  19 Enterprise customers paying €2,499/month - target 25 for €62,475 MRR
                </p>
                <div className="mt-2">
                  <span className="text-sm font-bold text-blue-900">Target: +€15,225/month</span>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900">Tender Platform</h4>
                <p className="text-sm text-purple-800 mt-1">
                  Only €3,380 from tender fees - opportunity to increase contractor adoption
                </p>
                <div className="mt-2">
                  <span className="text-sm font-bold text-purple-900">Growth potential: +200%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Revenue Events</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All Transactions →
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {transaction.type.includes('PROP Choice') ? (
                      <Target className="h-5 w-5 text-purple-600" />
                    ) : transaction.type.includes('Subscription') ? (
                      <Users className="h-5 w-5 text-blue-600" />
                    ) : transaction.type.includes('Tender') ? (
                      <Building className="h-5 w-5 text-orange-600" />
                    ) : (
                      <Receipt className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.type}</p>
                    <p className="text-sm text-gray-600">{transaction.developer}</p>
                    <p className="text-xs text-gray-400">{transaction.timestamp}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{formatCurrency(transaction.fee)}</p>
                  <p className="text-sm text-gray-600">{transaction.feeType}</p>
                  <p className="text-xs text-gray-400">
                    from {formatCurrency(transaction.amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fee Structure Display */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Current Fee Structure</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Transaction Fees</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Initial Deposit (€500)</span>
                  <span className="font-medium">2.5%</span>
                </li>
                <li className="flex justify-between">
                  <span>Full Deposit (€4,500)</span>
                  <span className="font-medium">2.0%</span>
                </li>
                <li className="flex justify-between">
                  <span>Final Transaction</span>
                  <span className="font-medium">1.5%</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">PROP Choice Commission</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Furniture Sales</span>
                  <span className="font-medium">15%</span>
                </li>
                <li className="flex justify-between">
                  <span>Customizations</span>
                  <span className="font-medium">12%</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Tender Platform</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Submission Fee</span>
                  <span className="font-medium">€25</span>
                </li>
                <li className="flex justify-between">
                  <span>Premium Listing</span>
                  <span className="font-medium">€100/month</span>
                </li>
                <li className="flex justify-between">
                  <span>AI Analysis</span>
                  <span className="font-medium">€50</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}