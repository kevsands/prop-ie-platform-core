'use client';

import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download, 
  Plus, 
  RefreshCw, 
  ExternalLink,
  Bell,
  Settings,
  BarChart3,
  Database,
  Server,
  Globe,
  Lock,
  UserCheck,
  Zap,
  Building2,
  DollarSign,
  FileText,
  Monitor,
  Cpu,
  HardDrive,
  Wifi,
  Home,
  Eye,
  Filter,
  Search
} from 'lucide-react';
import Link from 'next/link';

interface AdminMetrics {
  totalUsers: number;
  activeUsers: number;
  totalTransactions: number;
  monthlyRevenue: number;
  systemUptime: number;
  securityAlerts: number;
  pendingApprovals: number;
  systemLoad: number;
  databaseHealth: number;
  apiRequests: number;
  storageUsage: number;
  backupStatus: 'healthy' | 'warning' | 'error';
  nextMaintenance: {
    date: string;
    duration: string;
    type: string;
  };
}

interface SecurityAlert {
  id: string;
  type: 'authentication' | 'access' | 'data' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  status: 'new' | 'investigating' | 'resolved';
  affectedUser?: string;
}

interface SystemAlert {
  id: string;
  type: 'performance' | 'storage' | 'database' | 'api';
  severity: 'info' | 'warning' | 'error';
  message: string;
  timestamp: string;
  status: 'active' | 'resolved';
}

interface PlatformStats {
  id: string;
  metric: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  category: 'users' | 'transactions' | 'system' | 'revenue';
}

export default function AdminOverview() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('today');
  const [selectedView, setSelectedView] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Enhanced admin metrics
  const adminMetrics: AdminMetrics = {
    totalUsers: 45678,
    activeUsers: 12340,
    totalTransactions: 8943,
    monthlyRevenue: 2845000,
    systemUptime: 99.97,
    securityAlerts: 3,
    pendingApprovals: 12,
    systemLoad: 68.5,
    databaseHealth: 96.8,
    apiRequests: 2340000,
    storageUsage: 72.3,
    backupStatus: 'healthy',
    nextMaintenance: {
      date: 'Saturday 2:00 AM',
      duration: '2 hours',
      type: 'Database Optimization'
    }
  };

  const securityAlerts: SecurityAlert[] = [
    {
      id: '1',
      type: 'authentication',
      severity: 'medium',
      message: 'Multiple failed login attempts detected',
      timestamp: '15 minutes ago',
      status: 'investigating',
      affectedUser: 'user@example.com'
    },
    {
      id: '2',
      type: 'access',
      severity: 'low',
      message: 'Unusual access pattern from new location',
      timestamp: '2 hours ago',
      status: 'new',
      affectedUser: 'agent@propie.com'
    },
    {
      id: '3',
      type: 'system',
      severity: 'high',
      message: 'Attempted SQL injection detected and blocked',
      timestamp: '4 hours ago',
      status: 'resolved'
    }
  ];

  const systemAlerts: SystemAlert[] = [
    {
      id: '1',
      type: 'performance',
      severity: 'warning',
      message: 'API response time above threshold (2.1s avg)',
      timestamp: '30 minutes ago',
      status: 'active'
    },
    {
      id: '2',
      type: 'storage',
      severity: 'info',
      message: 'Storage usage at 72% - consider cleanup',
      timestamp: '1 hour ago',
      status: 'active'
    }
  ];

  const platformStats: PlatformStats[] = [
    { id: '1', metric: 'Daily Active Users', value: '12,340', change: '+8.5%', trend: 'up', category: 'users' },
    { id: '2', metric: 'New Registrations', value: '234', change: '+12%', trend: 'up', category: 'users' },
    { id: '3', metric: 'Transactions Today', value: '1,456', change: '+15%', trend: 'up', category: 'transactions' },
    { id: '4', metric: 'Revenue (24h)', value: '€89,340', change: '+7.2%', trend: 'up', category: 'revenue' },
    { id: '5', metric: 'API Calls/min', value: '1,623', change: '-2.1%', trend: 'down', category: 'system' },
    { id: '6', metric: 'System Response', value: '1.2s', change: '+0.3s', trend: 'down', category: 'system' }
  ];

  const timeframes = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' }
  ];

  const viewFilters = [
    { value: 'all', label: 'All Metrics' },
    { value: 'security', label: 'Security Only' },
    { value: 'performance', label: 'Performance Only' },
    { value: 'users', label: 'User Analytics' }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLastUpdated(new Date());
    setRefreshing(false);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IE').format(num);
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'warning':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'info':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'investigating':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'new':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'active':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight size={16} className="text-green-600" />;
      case 'down':
        return <ArrowDownRight size={16} className="text-red-600" />;
      default:
        return <ArrowUpRight size={16} className="text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Administration</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive system monitoring and platform management dashboard
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
            System Report
          </button>
          <Link 
            href="/admin/users/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus size={16} className="inline mr-2" />
            New User
          </Link>
        </div>
      </div>

      {/* Key System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(adminMetrics.totalUsers)}</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight size={16} className="text-green-600" />
                <span className="text-sm text-green-600 font-medium">{formatNumber(adminMetrics.activeUsers)}</span>
                <span className="text-sm text-gray-500">active now</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
              <Users size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        {/* System Uptime */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">System Uptime</p>
              <p className="text-2xl font-bold text-gray-900">{adminMetrics.systemUptime}%</p>
              <div className="flex items-center gap-1 mt-1">
                <CheckCircle size={16} className="text-green-600" />
                <span className="text-sm text-green-600 font-medium">Excellent</span>
                <span className="text-sm text-gray-500">SLA compliance</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
              <Server size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* Security Status */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Security Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{adminMetrics.securityAlerts}</p>
              <div className="flex items-center gap-1 mt-1">
                <Shield size={16} className="text-amber-600" />
                <span className="text-sm text-amber-600 font-medium">1 High</span>
                <span className="text-sm text-gray-500">priority</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
              <Shield size={24} className="text-amber-600" />
            </div>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCompactCurrency(adminMetrics.monthlyRevenue)}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp size={16} className="text-green-600" />
                <span className="text-sm text-green-600 font-medium">+12.5%</span>
                <span className="text-sm text-gray-500">vs last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-violet-100 rounded-lg flex items-center justify-center">
              <DollarSign size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Critical Maintenance Alert */}
      {adminMetrics.nextMaintenance && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Scheduled Maintenance</h3>
              <p className="text-xl font-bold">{adminMetrics.nextMaintenance.type}</p>
              <p className="text-blue-100">{adminMetrics.nextMaintenance.date}</p>
              <p className="text-blue-100 text-sm">Duration: {adminMetrics.nextMaintenance.duration}</p>
            </div>
            <div className="flex gap-3">
              <Link 
                href="/admin/maintenance"
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm"
              >
                View Schedule
              </Link>
              <Link 
                href="/admin/notifications"
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors text-sm"
              >
                Notify Users
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Security Alerts */}
        <div className="lg:col-span-2 bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                <Shield size={20} className="inline mr-2 text-red-600" />
                Security Alerts
              </h3>
              <div className="flex items-center gap-2">
                <select
                  value={selectedView}
                  onChange={(e) => setSelectedView(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  {viewFilters.map(filter => (
                    <option key={filter.value} value={filter.value}>{filter.label}</option>
                  ))}
                </select>
                <Link 
                  href="/admin/security"
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  View All Alerts
                  <ExternalLink size={14} className="inline ml-1" />
                </Link>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {securityAlerts.map((alert) => (
                <div key={alert.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg">
                        <AlertTriangle size={20} className="text-red-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(alert.severity)}`}>
                            {alert.severity.toUpperCase()}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(alert.status)}`}>
                            {alert.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <p className="font-medium text-gray-900 mb-1">{alert.message}</p>
                        {alert.affectedUser && (
                          <p className="text-sm text-gray-600 mb-2">User: {alert.affectedUser}</p>
                        )}
                        <p className="text-sm text-gray-500">{alert.timestamp}</p>
                      </div>
                    </div>
                    <Link 
                      href={`/admin/security/alerts/${alert.id}`}
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

        {/* System Status & Quick Actions */}
        <div className="space-y-6">
          {/* System Status */}
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                <Monitor size={20} className="inline mr-2 text-green-600" />
                System Status
              </h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu size={16} className="text-blue-600" />
                    <span className="text-sm font-medium">CPU Load</span>
                  </div>
                  <span className="text-sm font-medium">{adminMetrics.systemLoad}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${adminMetrics.systemLoad}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database size={16} className="text-green-600" />
                    <span className="text-sm font-medium">Database</span>
                  </div>
                  <span className="text-sm font-medium">{adminMetrics.databaseHealth}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${adminMetrics.databaseHealth}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDrive size={16} className="text-amber-600" />
                    <span className="text-sm font-medium">Storage</span>
                  </div>
                  <span className="text-sm font-medium">{adminMetrics.storageUsage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-amber-600 h-2 rounded-full" 
                    style={{ width: `${adminMetrics.storageUsage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                <Zap size={20} className="inline mr-2 text-purple-600" />
                Quick Actions
              </h3>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 gap-3">
                <Link 
                  href="/admin/users"
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
                >
                  <Users size={20} className="text-blue-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-medium text-gray-900">User Management</p>
                    <p className="text-xs text-gray-600">{formatNumber(adminMetrics.pendingApprovals)} pending</p>
                  </div>
                </Link>
                
                <Link 
                  href="/admin/security"
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all group"
                >
                  <Shield size={20} className="text-red-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-medium text-gray-900">Security Center</p>
                    <p className="text-xs text-gray-600">{adminMetrics.securityAlerts} active alerts</p>
                  </div>
                </Link>
                
                <Link 
                  href="/admin/analytics"
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all group"
                >
                  <BarChart3 size={20} className="text-green-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-medium text-gray-900">Analytics</p>
                    <p className="text-xs text-gray-600">Platform insights</p>
                  </div>
                </Link>
                
                <Link 
                  href="/admin/settings"
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all group"
                >
                  <Settings size={20} className="text-purple-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-medium text-gray-900">System Settings</p>
                    <p className="text-xs text-gray-600">Platform configuration</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Statistics */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              <Activity size={20} className="inline mr-2 text-indigo-600" />
              Real-Time Platform Statistics
            </h3>
            <Link 
              href="/admin/analytics"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Detailed Analytics
              <ExternalLink size={14} className="inline ml-1" />
            </Link>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platformStats.map((stat) => (
              <div key={stat.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{stat.metric}</h4>
                  {getTrendIcon(stat.trend)}
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className={`text-sm ${
                  stat.trend === 'up' ? 'text-green-600' : 
                  stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {stat.change} from yesterday
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
              <Shield size={24} className="text-indigo-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Platform Administration</h4>
              <p className="text-sm text-gray-600">Enterprise-grade monitoring and management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/admin/reports"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText size={16} className="inline mr-2" />
              System Reports
            </Link>
            <Link 
              href="/admin/support"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Bell size={16} className="inline mr-2" />
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}