/**
 * Developer Notifications Dashboard
 * 
 * Real-time financial alerts, payment notifications, and compliance reminders
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import {
  Bell,
  BellOff,
  Check,
  CheckCircle,
  Clock,
  Euro,
  AlertTriangle,
  Info,
  X,
  ExternalLink,
  Calendar,
  Building2,
  Receipt,
  Shield,
  FileText,
  User,
  Filter,
  Search,
  RefreshCw,
  Eye,
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
  readAt?: Date | null;
  unitId?: string;
  unitNumber?: string;
  developmentName?: string;
  actionUrl?: string;
  amount?: number;
}

interface NotificationStats {
  total: number;
  unread: number;
  highPriority: number;
  urgent: number;
  todayCount: number;
  completedActions: number;
  pendingActions: number;
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
    loadStats();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const mockNotifications: DeveloperNotification[] = [
        {
          id: '1',
          buyerId: 'buyer1',
          buyerName: 'Sarah Connor',
          type: 'HTB_UPDATE',
          title: 'HTB Application Approved',
          message: 'Help-to-Buy application has been approved for €30,000. Ready for next stage.',
          priority: 'high',
          createdAt: new Date('2024-01-15T10:30:00'),
          readAt: null,
          unitId: 'unit1',
          unitNumber: 'A-101',
          developmentName: 'Fitzgerald Gardens',
          amount: 30000
        },
        {
          id: '2',
          buyerId: 'buyer2',
          buyerName: 'Michael O\'Brien',
          type: 'COMPLETION_STATUS',
          title: 'Unit Construction Update',
          message: 'Unit A-102 has reached 85% completion. Expected completion in 4 weeks.',
          priority: 'medium',
          createdAt: new Date('2024-01-15T14:45:00'),
          readAt: new Date('2024-01-15T16:00:00'),
          unitId: 'unit2',
          unitNumber: 'A-102',
          developmentName: 'Fitzgerald Gardens'
        },
        {
          id: '3',
          buyerId: 'buyer3',
          buyerName: 'David Walsh',
          type: 'DOCUMENT_REQUIRED',
          title: 'Employment Verification Required',
          message: 'Current employment verification documents are needed to proceed with mortgage approval.',
          priority: 'urgent',
          createdAt: new Date('2024-01-15T09:15:00'),
          readAt: null,
          unitId: 'unit3',
          unitNumber: 'B-201',
          developmentName: 'Fitzgerald Gardens'
        },
        {
          id: '4',
          buyerId: 'buyer4',
          buyerName: 'Emma Thompson',
          type: 'PAYMENT_DUE',
          title: 'Stage Payment Due',
          message: 'Second stage payment of €25,000 is due within 7 days.',
          priority: 'high',
          createdAt: new Date('2024-01-14T16:30:00'),
          readAt: null,
          unitId: 'unit4',
          unitNumber: 'B-203',
          developmentName: 'Fitzgerald Gardens',
          amount: 25000
        },
        {
          id: '5',
          buyerId: 'buyer5',
          buyerName: 'John Smith',
          type: 'URGENT_ACTION',
          title: 'Contract Signing Deadline',
          message: 'Contract signing deadline is approaching in 2 days. Immediate action required.',
          priority: 'urgent',
          createdAt: new Date('2024-01-14T11:20:00'),
          readAt: null,
          unitId: 'unit5',
          unitNumber: 'C-301',
          developmentName: 'Fitzgerald Gardens'
        }
      ];

      setNotifications(mockNotifications);
    } catch (err) {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const mockStats: NotificationStats = {
        total: 12,
        unread: 5,
        highPriority: 3,
        urgent: 2,
        todayCount: 8,
        completedActions: 7,
        pendingActions: 5,
        urgentActions: 2
      };

      setStats(mockStats);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const refresh = async () => {
    setRefreshing(true);
    await Promise.all([loadNotifications(), loadStats()]);
    setRefreshing(false);
  };

  const markAsRead = async (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, readAt: new Date() }
          : notification
      )
    );
  };

  const markAllAsRead = async () => {
    setNotifications(prev =>
      prev.map(notification =>
        !notification.readAt
          ? { ...notification, readAt: new Date() }
          : notification
      )
    );
  };

  const deleteNotification = async (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'HTB_UPDATE':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'COMPLETION_STATUS':
        return <Building2 className="h-5 w-5 text-blue-600" />;
      case 'DOCUMENT_REQUIRED':
        return <FileText className="h-5 w-5 text-orange-600" />;
      case 'PAYMENT_DUE':
        return <Euro className="h-5 w-5 text-purple-600" />;
      case 'URGENT_ACTION':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (priorityFilter !== 'all' && notification.priority !== priorityFilter) return false;
    if (typeFilter !== 'all' && notification.type !== typeFilter) return false;
    if (searchQuery && !notification.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !notification.buyerName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.readAt).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Developer Notifications</h1>
          <p className="text-gray-600 mt-2">Stay updated with buyer activities and requirements</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={refresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <Check className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Bell className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-gray-600">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BellOff className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.unread}</p>
                  <p className="text-gray-600">Unread</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.urgent}</p>
                  <p className="text-gray-600">Urgent</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.todayCount}</p>
                  <p className="text-gray-600">Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="HTB_UPDATE">HTB Updates</option>
              <option value="COMPLETION_STATUS">Completion</option>
              <option value="DOCUMENT_REQUIRED">Documents</option>
              <option value="PAYMENT_DUE">Payments</option>
              <option value="URGENT_ACTION">Actions</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications ({filteredNotifications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-600">Try adjusting your filters or search criteria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start space-x-4 p-4 border rounded-lg ${
                    notification.readAt ? 'bg-gray-50' : 'bg-white border-l-4 border-l-blue-500'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`text-sm font-medium ${notification.readAt ? 'text-gray-700' : 'text-gray-900'}`}>
                          {notification.title}
                        </h4>
                        <p className={`text-sm mt-1 ${notification.readAt ? 'text-gray-500' : 'text-gray-700'}`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>{notification.buyerName}</span>
                          {notification.unitNumber && (
                            <>
                              <span>•</span>
                              <span>{notification.unitNumber}</span>
                            </>
                          )}
                          {notification.amount && (
                            <>
                              <span>•</span>
                              <span>€{notification.amount.toLocaleString()}</span>
                            </>
                          )}
                          <span>•</span>
                          <span>{notification.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <Badge variant="outline" className={getPriorityColor(notification.priority)}>
                          {notification.priority}
                        </Badge>

                        <div className="flex space-x-1">
                          {!notification.readAt && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}

                          <Link href={`/developer/buyers/${notification.buyerId}`}>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}