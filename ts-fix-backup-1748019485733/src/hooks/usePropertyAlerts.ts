import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/useToast';

export interface PropertyAlert {
  id: string;
  userId: string;
  name: string;
  type: 'price_drop' | 'new_listing' | 'price_change' | 'status_change' | 'open_house' | 'market_trend';
  criteria: AlertCriteria;
  frequency: 'instant' | 'daily' | 'weekly' | 'monthly';
  channels: NotificationChannel[];
  status: 'active' | 'paused' | 'expired';
  createdAt: Date;
  lastTriggered?: Date;
  triggerCount: number;
  expiresAt?: Date;
  priority: 'low' | 'medium' | 'high';
  tags?: string[];
}

export interface AlertCriteria {
  locations?: string[];
  propertyTypes?: PropertyType[];
  priceMin?: number;
  priceMax?: number;
  bedroomsMin?: number;
  bedroomsMax?: number;
  bathroomsMin?: number;
  bathroomsMax?: number;
  areaMin?: number;
  areaMax?: number;
  features?: string[];
  developers?: string[];
  priceDropPercentage?: number;
  daysOnMarket?: number;
  keywords?: string[];
  excludeKeywords?: string[];
}

export interface NotificationChannel {
  type: 'email' | 'sms' | 'push' | 'in_app';
  enabled: boolean;
  settings?: {
    email?: string;
    phone?: string;
    sound?: boolean;
    vibrate?: boolean;
  };
}

export type PropertyType = 'apartment' | 'house' | 'townhouse' | 'penthouse' | 'studio' | 'duplex';

export function usePropertyAlerts(userId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch alerts
  const { data: alerts = [], isLoading, error: any } = useQuery<PropertyAlert[]>({
    queryKey: ['property-alerts', userId],
    queryFn: async () => {
      const response = await fetch('/api/property-alerts');
      if (!response.ok) throw new Error('Failed to fetch alerts');
      return response.json();
    },
    enabled: !!userId,
    staleTime: 30000 // 30 seconds
  });

  // Create alert
  const createAlert = useMutation({
    mutationFn: async (alert: Omit<PropertyAlert, 'id' | 'userId' | 'createdAt' | 'triggerCount' | 'status'>) => {
      const response = await fetch('/api/property-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alert)
      });
      if (!response.ok) throw new Error('Failed to create alert');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-alerts'] });
      toast({
        title: 'Alert Created',
        description: 'You will be notified when matching properties are found'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Update alert
  const updateAlert = useMutation({
    mutationFn: async ({ id, ...update }: Partial<PropertyAlert> & { id: string }) => {
      const response = await fetch(`/api/property-alerts?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update)
      });
      if (!response.ok) throw new Error('Failed to update alert');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-alerts'] });
      toast({
        title: 'Alert Updated',
        description: 'Your alert has been updated successfully'
      });
    }
  });

  // Delete alert
  const deleteAlert = useMutation({
    mutationFn: async (alertId: string) => {
      const response = await fetch(`/api/property-alerts?id=${alertId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete alert');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-alerts'] });
      toast({
        title: 'Alert Deleted',
        description: 'The alert has been removed'
      });
    }
  });

  // Toggle alert status
  const toggleAlertStatus = useMutation({
    mutationFn: async (alertId: string) => {
      const alert = alerts.find(a: any => a.id === alertId);
      if (!alert) throw new Error('Alert not found');

      const newStatus = alert.status === 'active' ? 'paused' : 'active';
      return updateAlert.mutateAsync({ id: alertId, status: newStatus });
    }
  });

  // Get alert matches
  const getAlertMatches = async (alertId: string) => {
    try {
      const response = await fetch(`/api/property-alerts/${alertId}/matches`);
      if (!response.ok) throw new Error('Failed to fetch matches');
      return response.json();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch alert matches',
        variant: 'destructive'
      });
      return [];
    }
  };

  // Test alert
  const testAlert = useMutation({
    mutationFn: async (alertId: string) => {
      const response = await fetch(`/api/property-alerts/${alertId}/test`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to test alert');
      return response.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: 'Test Complete',
        description: `Found ${data.matchCount} matching properties`
      });
    }
  });

  // Subscribe to real-time updates
  useEffect(() => {
    if (!userId) return;

    // WebSocket connection for real-time alerts
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/alerts`);

    ws.onmessage = (event) => {
      const data: any = JSON.parse(event.data: any);

      if (data.type === 'alert_match') {
        // Update local state
        queryClient.invalidateQueries({ queryKey: ['property-alerts'] });

        // Show notification
        toast({
          title: 'New Property Match!',
          description: `${data.propertyCount} properties match your "${data.alertName}" alert`
        });
      }
    };

    return () => ws.close();
  }, [userId, queryClienttoast]);

  return {
    alerts,
    isLoading,
    error: any,
    createAlert: createAlert.mutate,
    updateAlert: updateAlert.mutate,
    deleteAlert: deleteAlert.mutate,
    toggleAlertStatus: toggleAlertStatus.mutate,
    getAlertMatches,
    testAlert: testAlert.mutate,
    isCreating: createAlert.isLoading,
    isUpdating: updateAlert.isLoading,
    isDeleting: deleteAlert.isLoading
  };
}