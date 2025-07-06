'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Heart,
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  FileText,
  User,
  Building,
  Calendar,
  ExternalLink,
  Eye,
  Settings,
  Bell,
  Filter,
  Search,
  Download
} from 'lucide-react';

interface DeveloperHTBData {
  totalClaims: number;
  activeClaims: number;
  completedClaims: number;
  totalValue: number;
  approvalRate: number;
  avgProcessingDays: number;
  recentClaims: HTBClaimSummary[];
  buyerNotifications: DeveloperNotification[];
  claimsByStatus: { [key: string]: number };
  monthlyStats: MonthlyStats[];
}

interface HTBClaimSummary {
  id: string;
  buyerId: string;
  buyerName: string;
  propertyId: string;
  propertyAddress: string;
  claimAmount: number;
  status: string;
  submissionDate: Date;
  lastUpdate: Date;
  nextAction: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
}

interface DeveloperNotification {
  id: string;
  buyerId: string;
  buyerName: string;
  type: 'HTB_UPDATE' | 'DOCUMENT_REQUIRED' | 'COMPLETION_STATUS' | 'URGENT_ACTION';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  propertyId?: string;
  claimId?: string;
}

interface MonthlyStats {
  month: string;
  claims: number;
  value: number;
  completions: number;
}

export default function EnhancedHTBDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [htbData, setHtbData] = useState<DeveloperHTBData | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHTBData();
  }, [selectedTimeframe]);

  const loadHTBData = async () => {
    try {
      setError(null);
      
      // Fetch real HTB claims data from API
      const response = await fetch('/api/htb-claims');
      if (!response.ok) {
        throw new Error('Failed to fetch HTB claims');
      }
      
      const claims = await response.json();
      
      // Transform API data to dashboard format
      const totalClaims = claims.length;
      const activeClaims = claims.filter((claim: any) => claim.status === 'pending').length;
      const completedClaims = claims.filter((claim: any) => claim.status === 'approved').length;
      const totalValue = claims.reduce((sum: number, claim: any) => sum + claim.amount, 0);
      const approvalRate = totalClaims > 0 ? (completedClaims / totalClaims) * 100 : 0;
      
      const transformedData: DeveloperHTBData = {
        totalClaims,
        activeClaims,
        completedClaims,
        totalValue,
        approvalRate,
        avgProcessingDays: 18, // This would need a separate calculation
        recentClaims: claims.slice(0, 5).map((claim: any) => ({
          id: claim.id,
          buyerId: claim.userId,
          buyerName: `User ${claim.userId}`, // Would need to fetch user data separately
          propertyId: claim.propertyId,
          propertyAddress: `Property ${claim.propertyId}`, // Would need to fetch property data
          claimAmount: claim.amount,
          status: claim.status === 'approved' ? 'Approved' : claim.status === 'pending' ? 'Under Review' : 'Unknown',
          submissionDate: new Date(claim.submissionDate),
          lastUpdate: new Date(claim.updatedAt),
          nextAction: claim.status === 'pending' ? 'Awaiting approval' : 'No action required',
          urgency: claim.status === 'pending' ? 'medium' : 'low'
        })),
        buyerNotifications: [], // Would fetch from notifications API
        claimsByStatus: {
          'pending': activeClaims,
          'approved': completedClaims,
          'total': totalClaims
        },
        monthlyStats: [] // Would calculate from historical data
      };

      setHtbData(transformedData);
    } catch (err) {
      console.error('Error loading HTB data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load HTB data');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    try {
      await loadHTBData();
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading HTB dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !htbData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-600 mb-4" />
        <h3 className="text-lg font-medium text-red-900 mb-2">Unable to Load HTB Data</h3>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={loadHTBData}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!htbData) return null;

  const filteredClaims = htbData.recentClaims.filter(claim => {
    if (statusFilter !== 'all' && claim.status !== statusFilter) return false;
    if (searchQuery && !claim.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !claim.propertyAddress.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Heart className="text-red-500" />
            HTB Management Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Monitor buyer Help-to-Buy claims and coordinate with Revenue
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as '7d' | '30d' | '90d')}
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button
            onClick={refreshData}
            disabled={refreshing}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Syncing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Claims</p>
              <p className="text-3xl font-bold text-gray-900">{htbData.totalClaims}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-600">
            <span>{htbData.activeClaims} active claims</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-3xl font-bold text-gray-900">
                €{(htbData.totalValue / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-600">
            <span>Avg €{Math.round(htbData.totalValue / htbData.totalClaims).toLocaleString()} per claim</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approval Rate</p>
              <p className="text-3xl font-bold text-gray-900">{htbData.approvalRate}%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-600">
            <span>{htbData.completedClaims} completed</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Processing</p>
              <p className="text-3xl font-bold text-gray-900">{htbData.avgProcessingDays}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-600">
            <span>days average</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Claims */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Active HTB Claims</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search buyers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="all">All Statuses</option>
                  {Object.keys(htbData.claimsByStatus).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredClaims.map((claim) => (
                <div key={claim.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{claim.buyerName}</h3>
                          <p className="text-sm text-gray-600">{claim.propertyAddress}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Amount:</span>
                          <p className="font-medium">€{claim.claimAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <p className="font-medium">{claim.status}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Submitted:</span>
                          <p className="font-medium">{claim.submissionDate.toLocaleDateString('en-IE')}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Next Action:</span>
                          <p className="font-medium text-blue-600">{claim.nextAction}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(claim.urgency)}`}>
                        {claim.urgency.toUpperCase()}
                      </span>
                      <Link 
                        href={`/buyer/htb/status?buyerId=${claim.buyerId}`}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View buyer HTB status"
                      >
                        <Eye className="h-4 w-4 text-gray-600" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/developer/htb/claims"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                View All Claims
                <ExternalLink className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Status Distribution */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Claims by Status</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(htbData.claimsByStatus).map(([status, count]) => (
                <div key={status} className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{count}</div>
                  <div className="text-sm text-gray-600">{status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Urgent Notifications */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-500" />
                Buyer Notifications
              </h2>
              <Link href="/developer/notifications" className="text-blue-600 hover:text-blue-800 text-sm">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {htbData.buyerNotifications.slice(0, 5).map((notification) => (
                <div key={notification.id} className="border-l-4 border-orange-400 pl-3 py-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900 text-sm">{notification.buyerName}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                      {notification.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{notification.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {notification.createdAt.toLocaleTimeString('en-IE', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/developer/htb/claims"
                className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FileText className="h-5 w-5 text-blue-600" />
                <span>Manage Claims</span>
              </Link>
              <Link
                href="/developer/htb/analytics"
                className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>View Analytics</span>
              </Link>
              <Link
                href="/developer/notifications"
                className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Bell className="h-5 w-5 text-orange-600" />
                <span>All Notifications</span>
              </Link>
              <button className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="h-5 w-5 text-purple-600" />
                <span>Export Report</span>
              </button>
            </div>
          </div>

          {/* Monthly Stats */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h2>
            <div className="space-y-4">
              {htbData.monthlyStats.map((stat) => (
                <div key={stat.month} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{stat.month}</div>
                    <div className="text-sm text-gray-600">{stat.claims} claims</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">€{(stat.value / 1000).toFixed(0)}K</div>
                    <div className="text-sm text-gray-600">{stat.completions} completed</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}