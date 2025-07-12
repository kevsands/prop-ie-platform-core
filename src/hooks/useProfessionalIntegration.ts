/**
 * Professional Integration Hook
 * 
 * Custom React hook for managing professional integration state
 * Provides real-time synchronization, notifications, and coordination features
 */

import { useState, useEffect, useCallback, useMemo } from 'react';

interface Professional {
  id: string;
  name: string;
  company: string;
  type: 'quantity-surveyor' | 'architect' | 'engineer';
  activeProjects: string[];
  currentWorkload: number;
  performance: number;
  status: 'available' | 'busy' | 'unavailable';
  lastActivity: string;
}

interface IntegrationStatus {
  professionalId: string;
  syncStatus: 'active' | 'pending' | 'failed' | 'disabled';
  dataConsistency: number;
  lastSyncTime: string;
}

interface NotificationRoute {
  id: string;
  fromProfessional: string;
  toDeveloper: string;
  notificationType: 'status-change' | 'document-ready' | 'approval-needed' | 'deadline-alert';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  message: string;
  timestamp: string;
  read: boolean;
  actionRequired: boolean;
}

interface ProfessionalIntegrationState {
  professionals: Professional[];
  integrationStatuses: IntegrationStatus[];
  notifications: NotificationRoute[];
  isLoading: boolean;
  error: string | null;
  lastUpdate: string;
}

interface UseProfessionalIntegrationOptions {
  projectId?: string;
  professionalType?: 'quantity-surveyor' | 'architect' | 'engineer';
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useProfessionalIntegration(options: UseProfessionalIntegrationOptions = {}) {
  const {
    projectId,
    professionalType,
    autoRefresh = true,
    refreshInterval = 30000 // 30 seconds
  } = options;

  const [state, setState] = useState<ProfessionalIntegrationState>({
    professionals: [],
    integrationStatuses: [],
    notifications: [],
    isLoading: true,
    error: null,
    lastUpdate: new Date().toISOString()
  });

  // Fetch professional data
  const fetchProfessionals = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const params = new URLSearchParams({
        action: 'professionals'
      });
      
      if (projectId) params.append('projectId', projectId);
      if (professionalType) params.append('type', professionalType);

      const response = await fetch(`/api/professional/coordination?${params}`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setState(prev => ({
          ...prev,
          professionals: data.professionals || [],
          isLoading: false,
          lastUpdate: new Date().toISOString()
        }));
      } else {
        throw new Error(data.error || 'Failed to fetch professionals');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false
      }));
    }
  }, [projectId, professionalType]);

  // Fetch integration status
  const fetchIntegrationStatus = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        action: 'status'
      });
      
      if (projectId) params.append('projectId', projectId);

      const response = await fetch(`/api/professional/integration?${params}`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setState(prev => ({
          ...prev,
          integrationStatuses: data.integrationStatuses || []
        }));
      }
    } catch (error) {
      console.error('Failed to fetch integration status:', error);
    }
  }, [projectId]);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        action: 'notifications',
        unreadOnly: 'true'
      });

      const response = await fetch(`/api/professional/integration?${params}`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setState(prev => ({
          ...prev,
          notifications: data.notifications || []
        }));
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, []);

  // Trigger manual sync
  const triggerSync = useCallback(async (professionalId: string, syncData: any) => {
    try {
      const response = await fetch('/api/professional/integration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'trigger-sync',
          data: {
            type: 'data-sync',
            source: 'developer-dashboard',
            target: professionalId,
            syncData
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Sync failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Refresh data after sync
        await Promise.all([
          fetchProfessionals(),
          fetchIntegrationStatus()
        ]);
        
        return { success: true, syncEvent: data.syncEvent };
      } else {
        throw new Error(data.error || 'Sync failed');
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }, [fetchProfessionals, fetchIntegrationStatus]);

  // Mark notification as read
  const markNotificationAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch('/api/professional/integration', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          notificationId,
          markAsRead: true
        })
      });

      if (response.ok) {
        setState(prev => ({
          ...prev,
          notifications: prev.notifications.map(notif =>
            notif.id === notificationId ? { ...notif, read: true } : notif
          )
        }));
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  // Send notification to professional
  const sendNotification = useCallback(async (
    toProfessional: string,
    notificationType: string,
    message: string,
    priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'
  ) => {
    try {
      const response = await fetch('/api/professional/integration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'send-notification',
          data: {
            fromProfessional: 'developer-team',
            toDeveloper: toProfessional,
            notificationType,
            priority,
            message,
            actionRequired: priority === 'high' || priority === 'urgent'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to send notification: ${response.status}`);
      }

      const data = await response.json();
      return { success: data.success, notification: data.notification };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }, []);

  // Calculate integration health
  const integrationHealth = useMemo(() => {
    if (state.integrationStatuses.length === 0) {
      return {
        overall: 'unknown',
        consistency: 0,
        activeConnections: 0,
        totalConnections: 0
      };
    }

    const activeConnections = state.integrationStatuses.filter(
      status => status.syncStatus === 'active'
    ).length;
    
    const averageConsistency = state.integrationStatuses.reduce(
      (sum, status) => sum + status.dataConsistency,
      0
    ) / state.integrationStatuses.length;

    const overall = averageConsistency >= 95 ? 'healthy' : 
                   averageConsistency >= 85 ? 'warning' : 'error';

    return {
      overall,
      consistency: averageConsistency,
      activeConnections,
      totalConnections: state.integrationStatuses.length
    };
  }, [state.integrationStatuses]);

  // Professional statistics
  const professionalStats = useMemo(() => {
    const stats = {
      total: state.professionals.length,
      byType: {
        'quantity-surveyor': 0,
        'architect': 0,
        'engineer': 0
      },
      byStatus: {
        'available': 0,
        'busy': 0,
        'unavailable': 0
      },
      averageWorkload: 0,
      averagePerformance: 0
    };

    state.professionals.forEach(professional => {
      stats.byType[professional.type]++;
      stats.byStatus[professional.status]++;
      stats.averageWorkload += professional.currentWorkload;
      stats.averagePerformance += professional.performance;
    });

    if (state.professionals.length > 0) {
      stats.averageWorkload /= state.professionals.length;
      stats.averagePerformance /= state.professionals.length;
    }

    return stats;
  }, [state.professionals]);

  // Auto-refresh effect
  useEffect(() => {
    // Initial fetch
    Promise.all([
      fetchProfessionals(),
      fetchIntegrationStatus(),
      fetchNotifications()
    ]);

    // Set up auto-refresh
    if (autoRefresh) {
      const interval = setInterval(() => {
        Promise.all([
          fetchProfessionals(),
          fetchIntegrationStatus(),
          fetchNotifications()
        ]);
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [fetchProfessionals, fetchIntegrationStatus, fetchNotifications, autoRefresh, refreshInterval]);

  return {
    // State
    ...state,
    
    // Computed values
    integrationHealth,
    professionalStats,
    unreadNotifications: state.notifications.filter(n => !n.read),
    urgentNotifications: state.notifications.filter(n => n.priority === 'urgent' && !n.read),
    
    // Actions
    refresh: () => Promise.all([
      fetchProfessionals(),
      fetchIntegrationStatus(),
      fetchNotifications()
    ]),
    triggerSync,
    markNotificationAsRead,
    sendNotification,
    
    // Utilities
    getProfessionalById: (id: string) => state.professionals.find(p => p.id === id),
    getProfessionalsByType: (type: string) => state.professionals.filter(p => p.type === type),
    getIntegrationStatus: (professionalId: string) => 
      state.integrationStatuses.find(s => s.professionalId === professionalId)
  };
}