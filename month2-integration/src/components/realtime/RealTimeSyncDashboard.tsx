'use client';

import React, { useState, useEffect } from 'react';
import {
  Wifi,
  WifiOff,
  Activity,
  Clock,
  Users,
  MessageSquare,
  Bell,
  Settings,
  BarChart3,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Zap,
  Signal,
  Globe,
  Monitor,
  Smartphone,
  Eye,
  EyeOff,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useRealTimeSync, useNotifications } from '@/hooks/useRealTimeSync';
import { ConnectionState, SyncEventType } from '@/services/RealTimeDataSyncService';

interface RealTimeSyncDashboardProps {
  userId: string;
  userRole: string;
  className?: string;
}

export function RealTimeSyncDashboard({ 
  userId, 
  userRole, 
  className = '' 
}: RealTimeSyncDashboardProps) {
  const {
    connectionState,
    isConnected,
    isConnecting,
    isReconnecting,
    metrics,
    lastEvent,
    eventHistory,
    connect,
    disconnect,
    subscribeToEvent,
    clearEventHistory
  } = useRealTimeSync(userId, userRole);

  const { notifications, unreadCount, markAsRead, clearNotifications } = useNotifications();

  const [showEventHistory, setShowEventHistory] = useState(false);
  const [subscriptionSettings, setSubscriptionSettings] = useState<{[key: string]: boolean}>({});
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  // Load initial subscription settings
  useEffect(() => {
    loadSubscriptionSettings();
  }, []);

  // Play notification sound on new events
  useEffect(() => {
    if (lastEvent && soundEnabled) {
      playNotificationSound(lastEvent.type);
    }
  }, [lastEvent, soundEnabled]);

  const loadSubscriptionSettings = async () => {
    try {
      const response = await fetch('/api/realtime/preferences', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        const settings: {[key: string]: boolean} = {};
        data.subscriptions.forEach((sub: any) => {
          settings[sub.eventType] = sub.enabled;
        });
        setSubscriptionSettings(settings);
      }
    } catch (error) {
      console.error('Failed to load subscription settings:', error);
    }
  };

  const updateSubscription = async (eventType: SyncEventType, enabled: boolean) => {
    try {
      setLoading(true);
      await subscribeToEvent(eventType, enabled);
      setSubscriptionSettings(prev => ({
        ...prev,
        [eventType]: enabled
      }));
    } catch (error) {
      console.error('Failed to update subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const playNotificationSound = (eventType: SyncEventType) => {
    if (!window || !window.Audio) return;
    
    try {
      const audio = new Audio();
      
      // Different sounds for different event types
      switch (eventType) {
        case 'message_received':
          audio.src = '/sounds/message.mp3';
          break;
        case 'payment_update':
          audio.src = '/sounds/payment.mp3';
          break;
        case 'task_update':
          audio.src = '/sounds/task.mp3';
          break;
        case 'notification':
          audio.src = '/sounds/notification.mp3';
          break;
        default:
          audio.src = '/sounds/default.mp3';
      }
      
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignore autoplay restrictions
      });
    } catch (error) {
      // Ignore audio errors
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionState) {
      case ConnectionState.CONNECTED:
        return 'text-green-600';
      case ConnectionState.CONNECTING:
      case ConnectionState.RECONNECTING:
        return 'text-amber-600';
      case ConnectionState.DISCONNECTED:
        return 'text-gray-600';
      case ConnectionState.ERROR:
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionState) {
      case ConnectionState.CONNECTED:
        return <Wifi size={20} className="text-green-600" />;
      case ConnectionState.CONNECTING:
      case ConnectionState.RECONNECTING:
        return <RefreshCw size={20} className="text-amber-600 animate-spin" />;
      case ConnectionState.DISCONNECTED:
        return <WifiOff size={20} className="text-gray-600" />;
      case ConnectionState.ERROR:
        return <AlertCircle size={20} className="text-red-600" />;
      default:
        return <WifiOff size={20} className="text-gray-600" />;
    }
  };

  const formatEventType = (eventType: string) => {
    return eventType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getEventIcon = (eventType: SyncEventType) => {
    switch (eventType) {
      case 'message_received':
        return <MessageSquare size={16} className="text-blue-600" />;
      case 'task_update':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'payment_update':
        return <BarChart3 size={16} className="text-amber-600" />;
      case 'notification':
        return <Bell size={16} className="text-purple-600" />;
      case 'property_update':
        return <Monitor size={16} className="text-indigo-600" />;
      case 'htb_status_change':
        return <Globe size={16} className="text-teal-600" />;
      case 'legal_milestone':
        return <Activity size={16} className="text-red-600" />;
      case 'document_uploaded':
        return <Eye size={16} className="text-gray-600" />;
      default:
        return <Zap size={16} className="text-gray-600" />;
    }
  };

  const eventTypeOptions: SyncEventType[] = [
    'property_update',
    'task_update',
    'payment_update',
    'message_received',
    'document_uploaded',
    'htb_status_change',
    'legal_milestone',
    'notification'
  ];

  return (
    <div className={`bg-white rounded-lg border shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Signal size={24} className="text-blue-600" />
              Real-Time Sync
            </h2>
            <p className="text-gray-600 mt-1">Live data synchronization across all portals</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg border transition-colors ${
                soundEnabled ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-300 text-gray-600'
              }`}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            
            <button
              onClick={() => setShowEventHistory(!showEventHistory)}
              className={`p-2 rounded-lg border transition-colors ${
                showEventHistory ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-300 text-gray-600'
              }`}
            >
              {showEventHistory ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            
            {isConnected ? (
              <button
                onClick={disconnect}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={connect}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Connect
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Connection Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Connection</p>
                <p className={`text-lg font-semibold capitalize ${getConnectionStatusColor()}`}>
                  {connectionState}
                </p>
              </div>
              {getConnectionStatusIcon()}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Messages</p>
                <p className="text-lg font-semibold text-blue-900">
                  {metrics.messagesReceived}
                </p>
              </div>
              <MessageSquare size={20} className="text-blue-600" />
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Latency</p>
                <p className="text-lg font-semibold text-green-900">
                  {Math.round(metrics.avgLatency)}ms
                </p>
              </div>
              <Clock size={20} className="text-green-600" />
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Notifications</p>
                <p className="text-lg font-semibold text-purple-900">
                  {unreadCount}
                </p>
              </div>
              <Bell size={20} className="text-purple-600" />
            </div>
          </div>
        </div>

        {/* Recent Notifications */}
        {notifications.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Recent Notifications</h3>
              <button
                onClick={() => clearNotifications()}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Clear All
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {notifications.slice(0, 5).map((notification, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        notification.read ? 'text-gray-900' : 'text-blue-900'
                      }`}>
                        {notification.title}
                      </p>
                      <p className={`text-sm ${
                        notification.read ? 'text-gray-600' : 'text-blue-700'
                      }`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.notificationId)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subscription Settings */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Event Subscriptions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {eventTypeOptions.map((eventType) => (
              <div
                key={eventType}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  {getEventIcon(eventType)}
                  <span className="text-sm font-medium text-gray-900">
                    {formatEventType(eventType)}
                  </span>
                </div>
                <button
                  onClick={() => updateSubscription(eventType, !subscriptionSettings[eventType])}
                  disabled={loading}
                  className={`w-10 h-6 rounded-full transition-colors ${
                    subscriptionSettings[eventType]
                      ? 'bg-blue-600'
                      : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    subscriptionSettings[eventType]
                      ? 'translate-x-5'
                      : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Last Event */}
        {lastEvent && (
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Latest Event</h3>
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center gap-2 mb-2">
                {getEventIcon(lastEvent.type)}
                <span className="font-medium text-gray-900">
                  {formatEventType(lastEvent.type)}
                </span>
                <span className="text-xs text-gray-500">
                  Just now
                </span>
              </div>
              <pre className="text-sm text-gray-700 bg-white p-2 rounded border overflow-x-auto">
                {JSON.stringify(lastEvent.data, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Event History */}
        {showEventHistory && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Event History</h3>
              <button
                onClick={clearEventHistory}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Clear History
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
              {eventHistory.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No events received yet
                </div>
              ) : (
                <div className="divide-y">
                  {eventHistory.slice().reverse().map((event, index) => (
                    <div key={index} className="p-3 hover:bg-gray-50">
                      <div className="flex items-center gap-2 mb-1">
                        {getEventIcon(event.type)}
                        <span className="text-sm font-medium text-gray-900">
                          {formatEventType(event.type)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {event.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 truncate">
                        {JSON.stringify(event.data)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Connection Metrics */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Connection Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 border border-gray-200 rounded-lg">
              <div className="text-lg font-semibold text-gray-900">{metrics.messagesSent}</div>
              <div className="text-xs text-gray-600">Messages Sent</div>
            </div>
            <div className="text-center p-3 border border-gray-200 rounded-lg">
              <div className="text-lg font-semibold text-gray-900">{metrics.messagesReceived}</div>
              <div className="text-xs text-gray-600">Messages Received</div>
            </div>
            <div className="text-center p-3 border border-gray-200 rounded-lg">
              <div className="text-lg font-semibold text-gray-900">{metrics.reconnectAttempts}</div>
              <div className="text-xs text-gray-600">Reconnect Attempts</div>
            </div>
            <div className="text-center p-3 border border-gray-200 rounded-lg">
              <div className="text-lg font-semibold text-gray-900">
                {(metrics.dataTransferred / 1024).toFixed(1)}KB
              </div>
              <div className="text-xs text-gray-600">Data Transferred</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}