'use client';

import { useState, useEffect } from 'react';
import { Bell, X, Check, AlertCircle, Info, Home, Calendar, Mail, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'property' | 'appointment' | 'message' | 'price';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  actionText?: string;
}

export default function NotificationCenter() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'property',
      title: 'New Property Match',
      message: 'A new property matching your criteria has been listed in Blackrock',
      timestamp: new Date(Date.now() - 3600000),
      isRead: false,
      actionUrl: '/properties/new-listing',
      actionText: 'View Property'
    },
    {
      id: '2',
      type: 'appointment',
      title: 'Viewing Reminder',
      message: 'Your viewing at Riverside Manor is tomorrow at 2:00 PM',
      timestamp: new Date(Date.now() - 7200000),
      isRead: false,
      actionUrl: '/buyer/appointments',
      actionText: 'View Details'
    },
    {
      id: '3',
      type: 'price',
      title: 'Price Drop Alert',
      message: 'A property you saved has reduced in price by €10,000',
      timestamp: new Date(Date.now() - 86400000),
      isRead: true,
      actionUrl: '/buyer/saved-properties',
      actionText: 'View Property'
    },
    {
      id: '4',
      type: 'message',
      title: 'New Message',
      message: 'Your solicitor has sent you a message about contract review',
      timestamp: new Date(Date.now() - 172800000),
      isRead: true,
      actionUrl: '/buyer/messages',
      actionText: 'Read Message'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'property': return <Home className="h-5 w-5 text-blue-600" />;
      case 'appointment': return <Calendar className="h-5 w-5 text-green-600" />;
      case 'message': return <Mail className="h-5 w-5 text-purple-600" />;
      case 'price': return <TrendingUp className="h-5 w-5 text-orange-600" />;
      case 'success': return <Check className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default: return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'property': return 'bg-blue-50';
      case 'appointment': return 'bg-green-50';
      case 'message': return 'bg-purple-50';
      case 'price': return 'bg-orange-50';
      case 'success': return 'bg-green-50';
      case 'warning': return 'bg-yellow-50';
      default: return 'bg-blue-50';
    }
  };

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.notification-center')) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  return (
    <div className="relative notification-center">
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Bell className="h-5 w-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Mark all as read
                </button>
              )}
              <button
                onClick={() => setShowNotifications(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`font-medium text-gray-900 ${
                            !notification.isRead ? 'font-semibold' : ''
                          }`}>
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {format(notification.timestamp, 'MMM d, h:mm a')}
                          </p>
                          {notification.actionUrl && (
                            <a
                              href={notification.actionUrl}
                              className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                              onClick={() => markAsRead(notification.id)}
                            >
                              {notification.actionText || 'View'} →
                            </a>
                          )}
                        </div>
                        <button
                          onClick={() => clearNotification(notification.id)}
                          className="p-1 hover:bg-gray-200 rounded ml-2"
                        >
                          <X className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p>No notifications</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-4 border-t">
              <a
                href="/buyer/notifications"
                className="text-sm text-blue-600 hover:underline block text-center"
              >
                View all notifications
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}