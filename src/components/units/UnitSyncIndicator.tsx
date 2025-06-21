'use client';

import React from 'react';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2,
  Clock,
  Zap
} from 'lucide-react';

interface UnitSyncIndicatorProps {
  status: 'synced' | 'syncing' | 'error' | 'offline';
  lastUpdate?: Date;
  isLive?: boolean;
  updateType?: string;
  compact?: boolean;
  className?: string;
}

export default function UnitSyncIndicator({ 
  status, 
  lastUpdate, 
  isLive = false,
  updateType,
  compact = false,
  className = ''
}: UnitSyncIndicatorProps) {
  const getStatusInfo = () => {
    switch (status) {
      case 'synced':
        return {
          icon: CheckCircle2,
          color: 'text-green-500',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          label: isLive ? 'Live' : 'Synced',
          description: 'Real-time data synchronized'
        };
      case 'syncing':
        return {
          icon: RefreshCw,
          color: 'text-blue-500',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          label: 'Syncing',
          description: 'Updating data...'
        };
      case 'error':
        return {
          icon: AlertCircle,
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          label: 'Error',
          description: 'Sync failed'
        };
      case 'offline':
      default:
        return {
          icon: WifiOff,
          color: 'text-gray-400',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          label: 'Offline',
          description: 'No real-time connection'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  const formatLastUpdate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);

    if (diffSeconds < 60) {
      return 'just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getUpdateTypeLabel = (type?: string) => {
    switch (type) {
      case 'STATUS_CHANGE': return 'Status updated';
      case 'PRICE_CHANGE': return 'Price updated';
      case 'VIEW_COUNT_UPDATE': return 'New viewer';
      case 'AVAILABILITY_CHANGE': return 'Availability updated';
      case 'BOOKING_UPDATE': return 'Booking activity';
      default: return 'Updated';
    }
  };

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1 ${className}`}>
        <StatusIcon 
          className={`w-3 h-3 ${statusInfo.color} ${status === 'syncing' ? 'animate-spin' : ''}`} 
        />
        {isLive && status === 'synced' && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 font-medium">LIVE</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 p-2 rounded-lg border ${statusInfo.bgColor} ${statusInfo.borderColor} ${className}`}>
      <StatusIcon 
        className={`w-4 h-4 ${statusInfo.color} ${status === 'syncing' ? 'animate-spin' : ''}`} 
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
          
          {isLive && status === 'synced' && (
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-yellow-500" />
              <span className="text-xs text-yellow-600 font-medium">LIVE</span>
            </div>
          )}
          
          {updateType && (
            <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded-full border">
              {getUpdateTypeLabel(updateType)}
            </span>
          )}
        </div>
        
        {!compact && (
          <p className="text-xs text-gray-500 mt-1">
            {statusInfo.description}
            {lastUpdate && status !== 'syncing' && (
              <span className="ml-2 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatLastUpdate(lastUpdate)}
              </span>
            )}
          </p>
        )}
      </div>

      {/* Real-time pulse indicator for live updates */}
      {isLive && status === 'synced' && (
        <div className="relative">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-30"></div>
        </div>
      )}
    </div>
  );
}