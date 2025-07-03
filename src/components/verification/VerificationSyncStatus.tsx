'use client';

import React, { useState } from 'react';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Server,
  Activity,
  Shield,
  Database,
  Cloud,
  CloudCheck
} from 'lucide-react';
import { useVerificationSync } from '@/hooks/useVerificationSync';

interface SyncSystemStatus {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  critical: boolean;
}

const syncSystems: SyncSystemStatus[] = [
  {
    id: 'first-time-buyers-kyc',
    name: 'KYC Forms',
    description: 'Comprehensive verification forms',
    icon: <Shield className="w-4 h-4" />,
    critical: true
  },
  {
    id: 'document-upload-center',
    name: 'Document Upload',
    description: 'Advanced document categorization',
    icon: <Cloud className="w-4 h-4" />,
    critical: true
  },
  {
    id: 'buyer-document-manager',
    name: 'Buyer Manager',
    description: 'Simple document interface',
    icon: <Database className="w-4 h-4" />,
    critical: false
  },
  {
    id: 'advanced-verification-workflow',
    name: 'Advanced Workflow',
    description: 'Enterprise verification process',
    icon: <Activity className="w-4 h-4" />,
    critical: false
  },
  {
    id: 'enterprise-dashboard',
    name: 'Enterprise Dashboard',
    description: 'Admin monitoring system',
    icon: <Server className="w-4 h-4" />,
    critical: false
  }
];

interface VerificationSyncStatusProps {
  compact?: boolean;
  showDetails?: boolean;
  className?: string;
}

export default function VerificationSyncStatus({ 
  compact = false, 
  showDetails = false,
  className = '' 
}: VerificationSyncStatusProps) {
  const {
    syncStatus,
    isOnline,
    lastSyncError,
    eventQueueLength,
    forceSync,
    getSystemStatus,
    getSyncedSystemsCount
  } = useVerificationSync();

  const [isExpanded, setIsExpanded] = useState(showDetails);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleForceSync = async () => {
    setIsSyncing(true);
    await forceSync();
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const getSyncStatusColor = () => {
    if (!isOnline) return 'text-red-600 bg-red-50 border-red-200';
    if (lastSyncError) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getSyncStatusText = () => {
    if (!isOnline) return 'Offline';
    if (lastSyncError) return 'Sync Issues';
    return 'All Systems Synced';
  };

  const getSyncStatusIcon = () => {
    if (!isOnline) return <WifiOff className="w-4 h-4" />;
    if (lastSyncError) return <AlertTriangle className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getSyncStatusColor()}`}>
          {getSyncStatusIcon()}
          <span>{getSyncStatusText()}</span>
        </div>
        {eventQueueLength > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium border border-blue-200">
            <Clock className="w-3 h-3" />
            <span>{eventQueueLength} pending</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${getSyncStatusColor()}`}>
              {getSyncStatusIcon()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Verification Sync Status</h3>
              <p className="text-sm text-gray-600">
                Real-time synchronization across {getSyncedSystemsCount()} systems
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {eventQueueLength > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium">
                <Clock className="w-3 h-3" />
                {eventQueueLength} queued
              </div>
            )}
            
            <button
              onClick={handleForceSync}
              disabled={isSyncing}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
              title="Force sync all systems"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              title="Toggle details"
            >
              <Server className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Overall Status */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="text-lg font-bold text-gray-900">
              {isOnline ? <Wifi className="w-5 h-5 text-green-600 mx-auto" /> : <WifiOff className="w-5 h-5 text-red-600 mx-auto" />}
            </div>
            <div className="text-xs text-gray-600 mt-1">Network</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="text-lg font-bold text-gray-900">{syncStatus?.overallProgress || 0}%</div>
            <div className="text-xs text-gray-600 mt-1">Progress</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="text-lg font-bold text-gray-900">{getSyncedSystemsCount()}</div>
            <div className="text-xs text-gray-600 mt-1">Systems</div>
          </div>
        </div>
      </div>

      {/* Detailed System Status */}
      {isExpanded && (
        <div className="p-4">
          <h4 className="font-medium text-gray-900 mb-3">System Status Details</h4>
          
          <div className="space-y-2">
            {syncSystems.map((system) => {
              const status = getSystemStatus(system.id);
              const isConnected = status.connected;
              const lastSync = status.lastSync;
              
              return (
                <div
                  key={system.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    isConnected 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded flex items-center justify-center ${
                      isConnected ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {system.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{system.name}</span>
                        {system.critical && (
                          <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">
                            Critical
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-600">{system.description}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {lastSync && (
                      <span className="text-xs text-gray-500">
                        {lastSync.toLocaleTimeString()}
                      </span>
                    )}
                    <div className={`w-2 h-2 rounded-full ${
                      isConnected ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Last Sync Info */}
          {syncStatus && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">
                <strong>Last Sync:</strong> {syncStatus.lastSyncTime.toLocaleString()}
              </div>
              {lastSyncError && (
                <div className="text-sm text-red-600 mt-1">
                  <strong>Error:</strong> {lastSyncError}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}