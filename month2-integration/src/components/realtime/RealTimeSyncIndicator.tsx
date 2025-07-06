'use client';

import React, { useState } from 'react';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Bell,
  Eye,
  X
} from 'lucide-react';
import { useRealTimeSync, useNotifications } from '@/hooks/useRealTimeSync';
import { ConnectionState } from '@/services/RealTimeDataSyncService';

interface RealTimeSyncIndicatorProps {
  userId?: string;
  userRole?: string;
  showDetails?: boolean;
  className?: string;
}

export function RealTimeSyncIndicator({ 
  userId, 
  userRole, 
  showDetails = false,
  className = '' 
}: RealTimeSyncIndicatorProps) {
  const {
    connectionState,
    isConnected,
    isConnecting,
    isReconnecting,
    metrics,
    lastEvent
  } = useRealTimeSync(userId, userRole);

  const { notifications, unreadCount } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  const getStatusColor = () => {
    switch (connectionState) {
      case ConnectionState.CONNECTED:
        return 'bg-green-500';
      case ConnectionState.CONNECTING:
      case ConnectionState.RECONNECTING:
        return 'bg-amber-500';
      case ConnectionState.DISCONNECTED:
        return 'bg-gray-500';
      case ConnectionState.ERROR:
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (connectionState) {
      case ConnectionState.CONNECTED:
        return <Wifi size={16} className="text-white" />;
      case ConnectionState.CONNECTING:
      case ConnectionState.RECONNECTING:
        return <RefreshCw size={16} className="text-white animate-spin" />;
      case ConnectionState.DISCONNECTED:
        return <WifiOff size={16} className="text-white" />;
      case ConnectionState.ERROR:
        return <AlertCircle size={16} className="text-white" />;
      default:
        return <WifiOff size={16} className="text-white" />;
    }
  };

  const getStatusText = () => {
    switch (connectionState) {
      case ConnectionState.CONNECTED:
        return 'Connected';
      case ConnectionState.CONNECTING:
        return 'Connecting...';
      case ConnectionState.RECONNECTING:
        return 'Reconnecting...';
      case ConnectionState.DISCONNECTED:
        return 'Disconnected';
      case ConnectionState.ERROR:
        return 'Connection Error';
      default:
        return 'Unknown';
    }
  };

  if (!showDetails) {
    // Simple indicator for header/navbar
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={`relative p-2 rounded-full ${getStatusColor()}`}>
          {getStatusIcon()}
          {isConnected && lastEvent && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
          )}
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <Bell size={16} />
            <span className="absolute -top-1 -right-1 bg-white text-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </button>
        )}

        {/* Notifications Popup */}
        {showNotifications && unreadCount > 0 && (
          <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="p-3 border-b flex items-center justify-between">
              <h3 className="font-medium text-gray-900">Notifications ({unreadCount})</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.slice(0, 5).map((notification, index) => (
                <div
                  key={index}
                  className="p-3 border-b last:border-b-0 hover:bg-gray-50"
                >
                  <p className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Detailed indicator for dashboards
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900">Real-Time Status</h3>
        <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor()}`}>
          {getStatusIcon()}
          {getStatusText()}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {Math.round(metrics.avgLatency)}ms
          </div>
          <div className="text-xs text-gray-600">Latency</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {metrics.messagesReceived}
          </div>
          <div className="text-xs text-gray-600">Messages</div>
        </div>
      </div>

      {lastEvent && (
        <div className="p-2 bg-gray-50 rounded border">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle size={12} className="text-green-600" />
            <span className="text-xs font-medium text-gray-900">
              Last Event: {lastEvent.type.replace(/_/g, ' ')}
            </span>
          </div>
          <div className="text-xs text-gray-600">
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      )}

      {unreadCount > 0 && (
        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
          <div className="flex items-center gap-2">
            <Bell size={12} className="text-blue-600" />
            <span className="text-xs font-medium text-blue-900">
              {unreadCount} new notification{unreadCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Clock size={10} />
          Connected since: {metrics.connectTime.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}