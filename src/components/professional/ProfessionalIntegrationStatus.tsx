/**
 * Professional Integration Status Widget
 * 
 * Real-time monitoring of professional integration health
 * Shows sync status, data consistency, and connection health
 */

'use client';

import React, { useState } from 'react';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle,
  Wifi,
  WifiOff,
  RefreshCw,
  Activity,
  Clock,
  TrendingUp,
  TrendingDown,
  Calculator,
  Building2,
  Wrench,
  Settings,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useProfessionalIntegration } from '@/hooks/useProfessionalIntegration';

interface ProfessionalIntegrationStatusProps {
  projectId?: string;
  showDetails?: boolean;
}

export default function ProfessionalIntegrationStatus({ 
  projectId,
  showDetails = true 
}: ProfessionalIntegrationStatusProps) {
  const [refreshing, setRefreshing] = useState(false);
  
  const {
    integrationStatuses,
    integrationHealth,
    professionalStats,
    isLoading,
    refresh,
    triggerSync
  } = useProfessionalIntegration({ projectId });

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  };

  const handleTriggerSync = async (professionalId: string) => {
    const result = await triggerSync(professionalId, {
      timestamp: new Date().toISOString(),
      source: 'developer-dashboard'
    });
    
    if (result.success) {
      console.log('Sync triggered successfully');
    } else {
      console.error('Sync failed:', result.error);
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return AlertCircle;
      default: return Shield;
    }
  };

  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return Wifi;
      case 'pending': return Clock;
      case 'failed': return WifiOff;
      case 'disabled': return WifiOff;
      default: return AlertTriangle;
    }
  };

  const getSyncStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'pending': return 'text-yellow-500';
      case 'failed': return 'text-red-500';
      case 'disabled': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getProfessionalTypeIcon = (type: string) => {
    switch (type) {
      case 'quantity-surveyor': return Calculator;
      case 'architect': return Building2;
      case 'engineer': return Wrench;
      default: return Shield;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    return `${hours}h ago`;
  };

  const HealthIcon = getHealthIcon(integrationHealth.overall);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Integration Status
            <Badge className={getHealthColor(integrationHealth.overall)}>
              <HealthIcon className="h-3 w-3 mr-1" />
              {integrationHealth.overall}
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-3 w-3 mr-1" />
              Configure
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Overall Health Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Data Consistency</span>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-600">
              {integrationHealth.consistency.toFixed(1)}%
            </div>
            <Progress value={integrationHealth.consistency} className="h-2 mt-2" />
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Active Connections</span>
              <Activity className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {integrationHealth.activeConnections}/{integrationHealth.totalConnections}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {((integrationHealth.activeConnections / integrationHealth.totalConnections) * 100).toFixed(0)}% connected
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Avg Workload</span>
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {professionalStats.averageWorkload.toFixed(0)}%
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {professionalStats.total} professionals
            </div>
          </div>
        </div>

        {/* Professional Type Distribution */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Professional Distribution</h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
              <Calculator className="h-4 w-4 text-blue-600" />
              <span className="text-sm">QS: {professionalStats.byType['quantity-surveyor']}</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-purple-50 rounded">
              <Building2 className="h-4 w-4 text-purple-600" />
              <span className="text-sm">Arch: {professionalStats.byType['architect']}</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-orange-50 rounded">
              <Wrench className="h-4 w-4 text-orange-600" />
              <span className="text-sm">Eng: {professionalStats.byType['engineer']}</span>
            </div>
          </div>
        </div>

        {/* Detailed Integration Status */}
        {showDetails && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Individual Integration Status</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-4 text-gray-500">
                  Loading integration status...
                </div>
              ) : integrationStatuses.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No integrations found
                </div>
              ) : (
                integrationStatuses.map((status) => {
                  const SyncIcon = getSyncStatusIcon(status.syncStatus);
                  const TypeIcon = getProfessionalTypeIcon(status.professionalType);
                  
                  return (
                    <div
                      key={status.professionalId}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <TypeIcon className="h-5 w-5 text-gray-600" />
                        <div>
                          <div className="font-medium text-sm">
                            {status.professionalId}
                          </div>
                          <div className="text-xs text-gray-500">
                            {status.professionalType.replace('-', ' ')}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {status.dataConsistency}%
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatTimeAgo(status.lastSyncTime)}
                          </div>
                        </div>
                        
                        <SyncIcon 
                          className={`h-4 w-4 ${getSyncStatusColor(status.syncStatus)}`}
                        />
                        
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleTriggerSync(status.professionalId)}
                          >
                            <RefreshCw className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Integration Summary */}
        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Last update: {formatTimeAgo(new Date().toISOString())}
            </span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                {integrationHealth.activeConnections} active
              </span>
              <span className="flex items-center gap-1">
                <Activity className="h-3 w-3 text-blue-500" />
                {integrationHealth.consistency.toFixed(0)}% sync
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}