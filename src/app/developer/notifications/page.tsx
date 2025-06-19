'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Clock,
  Heart,
  FileText,
  User,
  Filter,
  Search,
  RefreshCw,
  ExternalLink,
  Eye,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface DeveloperNotification {
  id: string;
  buyerId: string;
  buyerName: string;
  type: 'HTB_UPDATE' | 'COMPLETION_STATUS' | 'DOCUMENT_REQUIRED' | 'PAYMENT_DUE' | 'URGENT_ACTION';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  propertyId?: string;
  claimId?: string;
  developerId?: string;
  projectId?: string;
}

interface NotificationStats {
  total: number;
  urgent: number;
  high: number;
  medium: number;
  low: number;
  htbUpdates: number;
  completionStatus: number;
  documentsRequired: number;
  urgentActions: number;
}

export default function DeveloperNotificationsPage() {
  const [notifications, setNotifications] = useState<DeveloperNotification[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadNotifications();
  }, [priorityFilter, typeFilter]);

  const loadNotifications = async () => {
    try {
      setError(null);
      const params = new URLSearchParams({
        developerId: 'developer-001'
      });
      
      if (priorityFilter !== 'all') {
        params.append('priority', priorityFilter);
      }
      
      if (typeFilter !== 'all') {
        params.append('type', typeFilter);
      }

      const response = await fetch(`/api/developer/notifications?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to load notifications');
      }

      const data = await response.json();
      setNotifications(data.notifications.map((n: any) => ({
        ...n,
        createdAt: new Date(n.createdAt)
      })));
      setStats(data.stats);
    } catch (err) {
      console.error('Error loading notifications:', err);
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const refreshNotifications = async () => {
    setRefreshing(true);
    try {
      await loadNotifications();
    } catch (err) {
      console.error('Error refreshing notifications:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'HTB_UPDATE': return <Heart className="h-4 w-4 text-red-500" />;
      case 'COMPLETION_STATUS': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'DOCUMENT_REQUIRED': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'URGENT_ACTION': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        notification.buyerName.toLowerCase().includes(query) ||
        notification.title.toLowerCase().includes(query) ||
        notification.message.toLowerCase().includes(query) ||
        notification.propertyId?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error && !notifications.length) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-600 mb-4" />
        <h3 className="text-lg font-medium text-red-900 mb-2">Unable to Load Notifications</h3>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={loadNotifications}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Bell className="text-blue-500" />
            Buyer Notifications
          </h1>
          <p className="mt-2 text-gray-600">
            Monitor buyer activities, HTB updates, and completion status
          </p>
        </div>
        <button
          onClick={refreshNotifications}
          disabled={refreshing}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Notifications</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Urgent Actions</p>
                <p className="text-3xl font-bold text-red-600">{stats.urgent}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">HTB Updates</p>
                <p className="text-3xl font-bold text-purple-600">{stats.htbUpdates}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Heart className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Status</p>
                <p className="text-3xl font-bold text-green-600">{stats.completionStatus}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">All Types</option>
              <option value="HTB_UPDATE">HTB Updates</option>
              <option value="COMPLETION_STATUS">Completion Status</option>
              <option value="DOCUMENT_REQUIRED">Documents Required</option>
              <option value="URGENT_ACTION">Urgent Actions</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            Showing {filteredNotifications.length} of {notifications.length} notifications
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Notifications Found</h3>
            <p className="text-gray-600">
              {searchQuery || priorityFilter !== 'all' || typeFilter !== 'all' 
                ? 'No notifications match your current filters.' 
                : 'No notifications available at this time.'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div key={notification.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex-shrink-0 mt-1">
                    {getTypeIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                        {notification.priority.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{notification.message}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{notification.buyerName}</span>
                      </div>
                      
                      {notification.propertyId && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{notification.propertyId}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatTimeAgo(notification.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {notification.claimId && (
                    <Link
                      href={`/buyer/htb/status?buyerId=${notification.buyerId}`}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="View buyer HTB status"
                    >
                      <Eye className="h-4 w-4 text-gray-600" />
                    </Link>
                  )}
                  
                  {notification.propertyId && (
                    <Link
                      href={`/developer/projects/${notification.projectId}`}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="View project details"
                    >
                      <ExternalLink className="h-4 w-4 text-gray-600" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More (if needed in future) */}
      {filteredNotifications.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Showing {filteredNotifications.length} notifications
          </p>
        </div>
      )}
    </div>
  );
}