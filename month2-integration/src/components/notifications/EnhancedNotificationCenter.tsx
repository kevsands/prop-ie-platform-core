'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellRing,
  CheckCircle,
  AlertTriangle,
  Info,
  X,
  Settings,
  Filter,
  Search,
  RefreshCw,
  Eye,
  EyeOff,
  Trash2,
  Archive,
  Clock,
  User,
  FileText,
  CreditCard,
  MessageSquare,
  Shield,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { useNotifications, Notification, NotificationPreferences } from '@/context/NotificationContext';

interface EnhancedNotificationCenterProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function EnhancedNotificationCenter({ className = '', isOpen = true, onClose }: EnhancedNotificationCenterProps) {
  const {
    notifications,
    unreadCount,
    loadingNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    notificationPreferences,
    updateNotificationPreferences
  } = useNotifications();

  const [showPreferences, setShowPreferences] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'TRANSACTION':
        return <FileText size={16} className="text-blue-600" />;
      case 'DOCUMENT':
        return <FileText size={16} className="text-purple-600" />;
      case 'PAYMENT':
        return <CreditCard size={16} className="text-green-600" />;
      case 'MESSAGE':
        return <MessageSquare size={16} className="text-indigo-600" />;
      case 'SYSTEM':
        return <Shield size={16} className="text-gray-600" />;
      default:
        return <Info size={16} className="text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: Notification['severity']) => {
    switch (severity) {
      case 'error':
        return 'border-l-red-500 bg-red-50';
      case 'warning':
        return 'border-l-amber-500 bg-amber-50';
      case 'success':
        return 'border-l-green-500 bg-green-50';
      case 'info':
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  };

  const getSeverityIcon = (severity: Notification['severity']) => {
    switch (severity) {
      case 'error':
        return <AlertTriangle size={16} className="text-red-600" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-amber-600" />;
      case 'success':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'info':
      default:
        return <Info size={16} className="text-blue-600" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMs = now.getTime() - notificationTime.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInHours / 24;

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)}d ago`;
    } else {
      return notificationTime.toLocaleDateString('en-IE', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    const matchesSeverity = severityFilter === 'all' || notification.severity === severityFilter;
    const matchesSearch = searchTerm === '' || 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesReadStatus = !showOnlyUnread || !notification.isRead;

    return matchesType && matchesSeverity && matchesSearch && matchesReadStatus;
  });

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    if (notification.actionUrl) {
      window.open(notification.actionUrl, '_blank');
    }
  };

  const handlePreferenceUpdate = async (key: keyof NotificationPreferences, value: any) => {
    await updateNotificationPreferences({ [key]: value });
  };

  const handleTypePreferenceUpdate = async (type: string, enabled: boolean) => {
    const updatedTypes = {
      ...notificationPreferences.notificationTypes,
      [type]: enabled
    };
    await updateNotificationPreferences({
      notificationTypes: updatedTypes
    });
  };

  if (!isOpen) return null;

  return (
    <div className={`bg-white border rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellRing size={20} className="text-blue-600" />
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreferences(!showPreferences)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Notification Settings"
            >
              <Settings size={16} className="text-gray-600" />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={16} className="text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Mark All Read
          </button>
          <button
            onClick={clearAllNotifications}
            disabled={notifications.length === 0}
            className="text-xs px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={() => setShowOnlyUnread(!showOnlyUnread)}
            className={`text-xs px-3 py-1 rounded transition-colors ${
              showOnlyUnread 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {showOnlyUnread ? 'Show All' : 'Unread Only'}
          </button>
        </div>
      </div>

      {/* Preferences Panel */}
      {showPreferences && (
        <div className="p-4 border-b bg-gray-50">
          <h4 className="font-medium text-gray-900 mb-3">Notification Preferences</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Email Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationPreferences.emailNotifications}
                  onChange={(e) => handlePreferenceUpdate('emailNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Push Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationPreferences.pushNotifications}
                  onChange={(e) => handlePreferenceUpdate('pushNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">SMS Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationPreferences.smsNotifications}
                  onChange={(e) => handlePreferenceUpdate('smsNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="pt-2 border-t">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Notification Types</h5>
              <div className="space-y-2">
                {Object.entries(notificationPreferences.notificationTypes).map(([type, enabled]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{type}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => handleTypePreferenceUpdate(type, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="flex-1">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="TRANSACTION">Transactions</option>
              <option value="DOCUMENT">Documents</option>
              <option value="PAYMENT">Payments</option>
              <option value="MESSAGE">Messages</option>
              <option value="SYSTEM">System</option>
            </select>
            
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Levels</option>
              <option value="error">Errors</option>
              <option value="warning">Warnings</option>
              <option value="success">Success</option>
              <option value="info">Info</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {loadingNotifications ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              {searchTerm || typeFilter !== 'all' || severityFilter !== 'all' || showOnlyUnread
                ? 'No notifications match your filters.'
                : 'No notifications yet.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 ${getSeverityColor(notification.severity)} ${
                  !notification.isRead ? 'bg-blue-25' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`text-sm font-medium ${
                            !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            {getSeverityIcon(notification.severity)}
                            {notification.severity}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          {notification.transactionId && (
                            <span className="flex items-center gap-1">
                              <FileText size={12} />
                              Transaction #{notification.transactionId.slice(-6)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 ml-2">
                        {notification.actionUrl && (
                          <ExternalLink size={14} className="text-gray-400" />
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Delete notification"
                        >
                          <X size={14} className="text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}