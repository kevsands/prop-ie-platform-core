'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { 
  realTimeDataSyncService, 
  SyncEventType, 
  SyncEventData, 
  ConnectionState,
  ConnectionMetrics 
} from '@/services/RealTimeDataSyncService';

/**
 * React hook for real-time data synchronization
 */
export function useRealTimeSync(userId?: string, userRole?: string) {
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    realTimeDataSyncService.getConnectionState()
  );
  const [metrics, setMetrics] = useState<ConnectionMetrics>(
    realTimeDataSyncService.getMetrics()
  );
  const [lastEvent, setLastEvent] = useState<{ type: SyncEventType; data: any } | null>(null);
  const [eventHistory, setEventHistory] = useState<{ type: SyncEventType; data: any; timestamp: Date }[]>([]);

  const serviceRef = useRef(realTimeDataSyncService);
  const eventListenersRef = useRef<Map<string, Function>>(new Map());

  // Initialize connection when user info is available
  useEffect(() => {
    if (userId && userRole) {
      serviceRef.current.initialize(userId, userRole);
    }
  }, [userId, userRole]);

  // Setup event listeners
  useEffect(() => {
    const service = serviceRef.current;

    // Connection state changes
    const handleConnectionStateChange = (state: ConnectionState) => {
      setConnectionState(state);
    };

    // Sync events
    const handleSyncEvent = (event: { type: SyncEventType; data: any }) => {
      setLastEvent(event);
      setEventHistory(prev => [
        ...prev.slice(-49), // Keep last 50 events
        { ...event, timestamp: new Date() }
      ]);
    };

    // Metrics updates (periodic)
    const handleMetricsUpdate = () => {
      setMetrics(service.getMetrics());
    };

    // Register listeners
    service.on('connection_state_changed', handleConnectionStateChange);
    service.on('sync_event', handleSyncEvent);

    // Update metrics every 5 seconds
    const metricsInterval = setInterval(handleMetricsUpdate, 5000);

    // Cleanup
    return () => {
      service.off('connection_state_changed', handleConnectionStateChange);
      service.off('sync_event', handleSyncEvent);
      clearInterval(metricsInterval);
    };
  }, []);

  // Connect/disconnect functions
  const connect = useCallback(async () => {
    if (userId && userRole) {
      await serviceRef.current.initialize(userId, userRole);
    }
  }, [userId, userRole]);

  const disconnect = useCallback(() => {
    serviceRef.current.disconnect();
  }, []);

  // Subscribe to specific event types
  const subscribeToEvent = useCallback(async (eventType: SyncEventType, enabled: boolean = true) => {
    await serviceRef.current.subscribeToEvent(eventType, enabled);
  }, []);

  // Broadcast event to other clients
  const broadcastEvent = useCallback(<T extends SyncEventType>(
    eventType: T, 
    data: SyncEventData<T>
  ) => {
    serviceRef.current.broadcastEvent(eventType, data);
  }, []);

  // Add custom event listener
  const addEventListener = useCallback(<T extends SyncEventType>(
    eventType: T,
    callback: (data: SyncEventData<T>) => void
  ) => {
    const listener = (data: any) => callback(data);
    serviceRef.current.on(eventType, listener);
    eventListenersRef.current.set(eventType, listener);

    // Return cleanup function
    return () => {
      serviceRef.current.off(eventType, listener);
      eventListenersRef.current.delete(eventType);
    };
  }, []);

  // Remove event listener
  const removeEventListener = useCallback((eventType: SyncEventType) => {
    const listener = eventListenersRef.current.get(eventType);
    if (listener) {
      serviceRef.current.off(eventType, listener);
      eventListenersRef.current.delete(eventType);
    }
  }, []);

  // Clear event history
  const clearEventHistory = useCallback(() => {
    setEventHistory([]);
    setLastEvent(null);
  }, []);

  return {
    // Connection state
    connectionState,
    isConnected: connectionState === ConnectionState.CONNECTED,
    isConnecting: connectionState === ConnectionState.CONNECTING,
    isReconnecting: connectionState === ConnectionState.RECONNECTING,
    isDisconnected: connectionState === ConnectionState.DISCONNECTED,
    hasError: connectionState === ConnectionState.ERROR,

    // Metrics
    metrics,

    // Events
    lastEvent,
    eventHistory,

    // Actions
    connect,
    disconnect,
    subscribeToEvent,
    broadcastEvent,
    addEventListener,
    removeEventListener,
    clearEventHistory,

    // Utils
    service: serviceRef.current
  };
}

/**
 * Hook for listening to specific event types
 */
export function useRealTimeEvent<T extends SyncEventType>(
  eventType: T,
  callback: (data: SyncEventData<T>) => void,
  enabled: boolean = true
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!enabled) return;

    const listener = (data: SyncEventData<T>) => {
      callbackRef.current(data);
    };

    realTimeDataSyncService.on(eventType, listener);

    return () => {
      realTimeDataSyncService.off(eventType, listener);
    };
  }, [eventType, enabled]);
}

/**
 * Hook for property updates
 */
export function usePropertyUpdates(propertyId?: string) {
  const [propertyData, setPropertyData] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useRealTimeEvent('property_update', (data) => {
    if (!propertyId || data.propertyId === propertyId) {
      setPropertyData(data.updatedData);
      setLastUpdate(new Date(data.timestamp));
    }
  });

  return {
    propertyData,
    lastUpdate,
    hasUpdates: lastUpdate !== null
  };
}

/**
 * Hook for task updates
 */
export function useTaskUpdates(taskId?: string) {
  const [taskData, setTaskData] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useRealTimeEvent('task_update', (data) => {
    if (!taskId || data.taskId === taskId) {
      setTaskData(data);
      setLastUpdate(new Date(data.timestamp));
    }
  });

  return {
    taskData,
    lastUpdate,
    hasUpdates: lastUpdate !== null
  };
}

/**
 * Hook for payment updates
 */
export function usePaymentUpdates(transactionId?: string) {
  const [paymentData, setPaymentData] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useRealTimeEvent('payment_update', (data) => {
    if (!transactionId || data.transactionId === transactionId) {
      setPaymentData(data);
      setLastUpdate(new Date(data.timestamp));
    }
  });

  return {
    paymentData,
    lastUpdate,
    hasUpdates: lastUpdate !== null
  };
}

/**
 * Hook for message updates
 */
export function useMessageUpdates(conversationId?: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useRealTimeEvent('message_received', (data) => {
    if (!conversationId || data.conversationId === conversationId) {
      setMessages(prev => [...prev, data]);
      setUnreadCount(prev => prev + 1);
    }
  });

  const markAsRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setUnreadCount(0);
  }, []);

  return {
    messages,
    unreadCount,
    hasNewMessages: unreadCount > 0,
    markAsRead,
    clearMessages
  };
}

/**
 * Hook for notifications
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useRealTimeEvent('notification', (data) => {
    setNotifications(prev => [data, ...prev.slice(0, 49)]); // Keep last 50
    setUnreadCount(prev => prev + 1);
  });

  const markAsRead = useCallback((notificationId?: string) => {
    if (notificationId) {
      setNotifications(prev => 
        prev.map(notif => 
          notif.notificationId === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
    } else {
      setUnreadCount(0);
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
    }
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  return {
    notifications,
    unreadCount,
    hasNewNotifications: unreadCount > 0,
    markAsRead,
    clearNotifications
  };
}