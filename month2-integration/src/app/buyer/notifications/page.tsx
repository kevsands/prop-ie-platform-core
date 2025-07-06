'use client';

import { useState } from 'react';
import { 
  Bell, 
  BellOff, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Home, 
  Euro, 
  FileText, 
  Settings, 
  Filter, 
  MoreHorizontal,
  Trash2,
  Mail,
  MailOpen,
  Clock,
  Zap,
  Star,
  Archive,
  RefreshCw
} from 'lucide-react';
import { format, isToday, isYesterday, subDays } from 'date-fns';

interface Notification {
  id: string;
  type: 'appointment' | 'document' | 'payment' | 'system' | 'property' | 'task' | 'message';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  archived: boolean;
  actionRequired: boolean;
  actionUrl?: string;
  actionText?: string;
  relatedId?: string;
  sender?: string;
  metadata?: Record<string, any>;
}

export default function NotificationsPage() {
  const [filter, setFilter] = useState<'all' | 'unread' | 'archived'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
  const [showSettings, setShowSettings] = useState(false);

  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'appointment',
      priority: 'high',
      title: 'Upcoming Property Viewing',
      message: 'You have a property viewing at Riverside Manor, Unit 4B scheduled for tomorrow at 2:00 PM. Please bring valid ID and proof of funds.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
      archived: false,
      actionRequired: true,
      actionUrl: '/buyer/appointments/1',
      actionText: 'View Details',
      relatedId: 'appointment-1',
      sender: 'System'
    },
    {
      id: '2',
      type: 'document',
      priority: 'urgent',
      title: 'Document Verification Required',
      message: 'Your bank statements need verification before we can proceed with your mortgage application. Please upload the missing documents.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      read: false,
      archived: false,
      actionRequired: true,
      actionUrl: '/buyer/documents',
      actionText: 'Upload Documents',
      relatedId: 'doc-verification-2'
    },
    {
      id: '3',
      type: 'payment',
      priority: 'medium',
      title: 'Payment Confirmation',
      message: 'Your deposit payment of €5,000 for Riverside Manor has been successfully processed and confirmed.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      read: true,
      archived: false,
      actionRequired: false,
      relatedId: 'payment-5000'
    },
    {
      id: '4',
      type: 'task',
      priority: 'high',
      title: 'HTB Application Due Soon',
      message: 'Your Help-to-Buy application is due in 3 days. Complete all required sections to avoid delays in processing.',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      read: false,
      archived: false,
      actionRequired: true,
      actionUrl: '/buyer/tasks/htb-application',
      actionText: 'Complete Application',
      relatedId: 'task-htb'
    },
    {
      id: '5',
      type: 'property',
      priority: 'medium',
      title: 'New Property Match',
      message: 'A new property matching your criteria has been added: Fitzgerald Gardens, Unit 23. It\'s HTB eligible and within your budget.',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      read: true,
      archived: false,
      actionRequired: false,
      actionUrl: '/properties/fitzgerald-gardens-23',
      actionText: 'View Property',
      relatedId: 'property-fg23'
    },
    {
      id: '6',
      type: 'message',
      priority: 'low',
      title: 'Message from Sarah Johnson',
      message: 'Hi! I wanted to confirm our viewing appointment tomorrow and let you know parking is available on-site. Looking forward to meeting you!',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      read: true,
      archived: false,
      actionRequired: false,
      sender: 'Sarah Johnson',
      actionUrl: '/buyer/messages/sarah-johnson',
      actionText: 'Reply'
    },
    {
      id: '7',
      type: 'system',
      priority: 'low',
      title: 'Profile Completion Reminder',
      message: 'Complete your buyer profile to get personalized property recommendations and faster processing.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      read: true,
      archived: false,
      actionRequired: false,
      actionUrl: '/buyer/profile',
      actionText: 'Update Profile'
    },
    {
      id: '8',
      type: 'appointment',
      priority: 'medium',
      title: 'Appointment Rescheduled',
      message: 'Your mortgage consultation with Bank of Ireland has been rescheduled to Friday at 3:00 PM at your request.',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      read: true,
      archived: true,
      actionRequired: false,
      relatedId: 'appointment-reschedule'
    }
  ]);

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = 
      filter === 'all' ? !notification.archived :
      filter === 'unread' ? !notification.read && !notification.archived :
      filter === 'archived' ? notification.archived :
      true;
    
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    
    return matchesFilter && matchesType;
  });

  // Group notifications by date
  const groupedNotifications = filteredNotifications.reduce((groups, notification) => {
    let dateKey: string;
    
    if (isToday(notification.timestamp)) {
      dateKey = 'Today';
    } else if (isYesterday(notification.timestamp)) {
      dateKey = 'Yesterday';
    } else {
      dateKey = format(notification.timestamp, 'MMMM d, yyyy');
    }
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(notification);
    return groups;
  }, {} as Record<string, Notification[]>);

  // Statistics
  const unreadCount = notifications.filter(n => !n.read && !n.archived).length;
  const urgentCount = notifications.filter(n => n.priority === 'urgent' && !n.read && !n.archived).length;
  const actionRequiredCount = notifications.filter(n => n.actionRequired && !n.read && !n.archived).length;

  const getNotificationIcon = (type: string, priority: string) => {
    const iconProps = {
      size: 20,
      className: priority === 'urgent' ? 'text-red-600' : 
                priority === 'high' ? 'text-orange-600' :
                priority === 'medium' ? 'text-blue-600' : 'text-gray-600'
    };

    switch (type) {
      case 'appointment':
        return <Calendar {...iconProps} />;
      case 'document':
        return <FileText {...iconProps} />;
      case 'payment':
        return <Euro {...iconProps} />;
      case 'property':
        return <Home {...iconProps} />;
      case 'task':
        return <CheckCircle {...iconProps} />;
      case 'message':
        return <Mail {...iconProps} />;
      case 'system':
        return <Info {...iconProps} />;
      default:
        return <Bell {...iconProps} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-red-500 bg-red-50';
      case 'high':
        return 'border-l-orange-500 bg-orange-50';
      case 'medium':
        return 'border-l-blue-500 bg-blue-50';
      case 'low':
        return 'border-l-gray-500 bg-gray-50';
      default:
        return 'border-l-gray-300 bg-white';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    if (isToday(timestamp)) {
      return format(timestamp, 'h:mm a');
    } else if (isYesterday(timestamp)) {
      return `Yesterday ${format(timestamp, 'h:mm a')}`;
    } else {
      return format(timestamp, 'MMM d, h:mm a');
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const archiveNotification = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, archived: true } : n)
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const toggleSelectNotification = (id: string) => {
    setSelectedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const bulkAction = (action: 'read' | 'archive' | 'delete') => {
    const ids = Array.from(selectedNotifications);
    
    setNotifications(prev => {
      switch (action) {
        case 'read':
          return prev.map(n => ids.includes(n.id) ? { ...n, read: true } : n);
        case 'archive':
          return prev.map(n => ids.includes(n.id) ? { ...n, archived: true } : n);
        case 'delete':
          return prev.filter(n => !ids.includes(n.id));
        default:
          return prev;
      }
    });
    
    setSelectedNotifications(new Set());
  };

  return (
    <div className="flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-1">Stay updated on your home buying journey</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Settings size={16} />
              Settings
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-blue-600">{unreadCount}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Urgent</p>
                <p className="text-2xl font-bold text-red-600">{urgentCount}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Action Required</p>
                <p className="text-2xl font-bold text-orange-600">{actionRequiredCount}</p>
              </div>
              <Zap className="h-8 w-8 text-orange-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              </div>
              <Archive className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg border shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-wrap gap-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'all' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'unread' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  onClick={() => setFilter('archived')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'archived' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Archived
                </button>
              </div>
              
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">All Types</option>
                <option value="appointment">Appointments</option>
                <option value="document">Documents</option>
                <option value="payment">Payments</option>
                <option value="property">Properties</option>
                <option value="task">Tasks</option>
                <option value="message">Messages</option>
                <option value="system">System</option>
              </select>
            </div>

            <div className="flex gap-2">
              {selectedNotifications.size > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => bulkAction('read')}
                    className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Mark Read ({selectedNotifications.size})
                  </button>
                  <button
                    onClick={() => bulkAction('archive')}
                    className="px-3 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Archive
                  </button>
                  <button
                    onClick={() => bulkAction('delete')}
                    className="px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
              
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Mark All Read
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-6">
          {Object.entries(groupedNotifications).map(([dateKey, dayNotifications]) => (
            <div key={dateKey}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{dateKey}</h3>
              <div className="space-y-3">
                {dayNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`bg-white rounded-lg border shadow-sm transition-all hover:shadow-md ${
                      !notification.read ? 'border-l-4 ' + getPriorityColor(notification.priority) : ''
                    } ${selectedNotifications.has(notification.id) ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          checked={selectedNotifications.has(notification.id)}
                          onChange={() => toggleSelectNotification(notification.id)}
                          className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type, notification.priority)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                  {notification.title}
                                </h4>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                )}
                                {notification.priority === 'urgent' && (
                                  <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                                    Urgent
                                  </span>
                                )}
                                {notification.actionRequired && (
                                  <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                                    Action Required
                                  </span>
                                )}
                              </div>
                              
                              <p className={`text-sm mb-2 ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                {notification.message}
                              </p>
                              
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>{formatTimestamp(notification.timestamp)}</span>
                                {notification.sender && (
                                  <span>from {notification.sender}</span>
                                )}
                                <span className="capitalize">{notification.type}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 ml-4">
                              {notification.actionUrl && (
                                <a
                                  href={notification.actionUrl}
                                  onClick={() => markAsRead(notification.id)}
                                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  {notification.actionText || 'View'}
                                </a>
                              )}
                              
                              <div className="relative">
                                <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                                  <MoreHorizontal size={16} />
                                </button>
                                {/* Dropdown menu would go here */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <BellOff className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500">
              {filter === 'unread' 
                ? "You're all caught up! No unread notifications."
                : filter === 'archived'
                ? "No archived notifications found."
                : "You don't have any notifications yet."}
            </p>
          </div>
        )}

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Notification Settings</h2>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Email Notifications</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Appointment reminders</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Document requests</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Payment confirmations</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Property matches</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Push Notifications</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Urgent notifications</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Daily summary</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t">
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}