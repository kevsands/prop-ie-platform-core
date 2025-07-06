'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  timestamp: Date;
  read: boolean;
}

interface NotificationCenterProps {
  notifications?: Notification[];
  onNotificationClick?: (notification: Notification) => void;
}

export default function NotificationCenter({ notifications = [], onNotificationClick }: NotificationCenterProps) {
  const defaultNotifications: Notification[] = [
    {
      id: '1',
      title: 'Document Approved',
      message: 'Your mortgage pre-approval has been confirmed',
      type: 'success',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
    },
    {
      id: '2',
      title: 'Viewing Confirmed',
      message: 'Your viewing at Fitzgerald Gardens is scheduled for tomorrow',
      type: 'info',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true,
    },
  ];

  const displayNotifications = notifications.length > 0 ? notifications : defaultNotifications;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                notification.read ? 'bg-gray-50' : 'bg-blue-50'
              } hover:bg-gray-100`}
              onClick={() => onNotificationClick?.(notification)}
            >
              {getIcon(notification.type)}
              <div className="flex-1">
                <h4 className="font-medium text-sm">{notification.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                <span className="text-xs text-gray-500 mt-2 block">
                  {notification.timestamp.toLocaleString()}
                </span>
              </div>
              {!notification.read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}