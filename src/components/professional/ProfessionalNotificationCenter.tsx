/**
 * Professional Notification Center
 * 
 * Real-time notification system for professional integration
 * Displays notifications from professional dashboards to developer dashboard
 */

'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  AlertCircle,
  FileText,
  Calendar,
  Users,
  X,
  Eye,
  Check,
  ExternalLink,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useProfessionalIntegration } from '@/hooks/useProfessionalIntegration';

interface ProfessionalNotificationCenterProps {
  projectId?: string;
  compact?: boolean;
  showUnreadOnly?: boolean;
}

export default function ProfessionalNotificationCenter({ 
  projectId, 
  compact = false,
  showUnreadOnly = false 
}: ProfessionalNotificationCenterProps) {
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const {
    notifications,
    unreadNotifications,
    urgentNotifications,
    isLoading,
    markNotificationAsRead,
    sendNotification
  } = useProfessionalIntegration({ projectId });

  // Filter notifications
  const filteredNotifications = React.useMemo(() => {
    let filtered = showUnreadOnly ? unreadNotifications : notifications;

    if (selectedPriority !== 'all') {
      filtered = filtered.filter(n => n.priority === selectedPriority);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(n => n.notificationType === selectedType);
    }

    return filtered.sort((a, b) => {
      // Sort by priority first, then by timestamp
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [notifications, unreadNotifications, showUnreadOnly, selectedPriority, selectedType]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document-ready': return FileText;
      case 'approval-needed': return CheckCircle;
      case 'deadline-alert': return Clock;
      case 'status-change': return AlertTriangle;
      case 'coordination-request': return Users;
      default: return Bell;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleMarkAsRead = async (notificationId: string) => {
    await markNotificationAsRead(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await Promise.all(
      unreadNotifications.map(notification => 
        markNotificationAsRead(notification.id)
      )
    );
  };

  if (compact) {
    return (
      <div className="relative">
        <Button variant="outline" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {unreadNotifications.length > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
              {unreadNotifications.length}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Professional Notifications
            {unreadNotifications.length > 0 && (
              <Badge className="bg-red-100 text-red-800">
                {unreadNotifications.length} unread
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {unreadNotifications.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                <Check className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Filter className="h-3 w-3 mr-1" />
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Priority Filter */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedPriority === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPriority('all')}
          >
            All ({notifications.length})
          </Button>
          <Button
            variant={selectedPriority === 'urgent' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPriority('urgent')}
          >
            <AlertCircle className="h-3 w-3 mr-1" />
            Urgent ({notifications.filter(n => n.priority === 'urgent').length})
          </Button>
          <Button
            variant={selectedPriority === 'high' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPriority('high')}
          >
            High ({notifications.filter(n => n.priority === 'high').length})
          </Button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-4 text-gray-500">
              Loading notifications...
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              No notifications to display
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const TypeIcon = getTypeIcon(notification.notificationType);
              return (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                    !notification.read 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${getPriorityColor(notification.priority)}`}>
                      <TypeIcon className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getPriorityColor(notification.priority)}>
                          {notification.priority}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          from {notification.fromProfessional}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(notification.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="capitalize">
                          {notification.notificationType.replace('-', ' ')}
                        </span>
                        {notification.actionRequired && (
                          <Badge variant="outline" className="text-xs">
                            Action Required
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {notification.actionRequired && !notification.read && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          Take Action
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          View Details
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Summary */}
        {notifications.length > 0 && (
          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                {unreadNotifications.length} unread of {notifications.length} total
              </span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 text-red-500" />
                  {urgentNotifications.length} urgent
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-orange-500" />
                  {notifications.filter(n => n.actionRequired && !n.read).length} require action
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}