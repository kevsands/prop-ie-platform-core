/**
 * usePWA Hook
 * 
 * React hook for Progressive Web App functionality including
 * offline detection, install prompts, push notifications,
 * and background sync capabilities.
 */

import { useState, useEffect, useCallback } from 'react';
import { pwaService, PWAUtils } from '@/services/PWAService';

export interface PWACapabilities {
  canInstall: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  isPWASupported: boolean;
  canReceiveNotifications: boolean;
  canBackgroundSync: boolean;
}

export interface PWAState {
  isOnline: boolean;
  isInstalled: boolean;
  canInstall: boolean;
  updateAvailable: boolean;
  pendingActions: number;
  cacheUsage: {
    usage: number;
    quota: number;
    percentage: number;
  };
}

export interface PWAActions {
  promptInstall: () => Promise<boolean>;
  updateApp: () => Promise<void>;
  clearCache: () => Promise<void>;
  scheduleNotification: (title: string, body: string, delay: number) => void;
  cacheTaskData: (tasks: any[]) => Promise<void>;
  getCachedTasks: () => Promise<any[]>;
  registerForNotifications: () => Promise<boolean>;
}

/**
 * Main PWA hook
 */
export const usePWA = (): {
  state: PWAState;
  actions: PWAActions;
  capabilities: PWACapabilities;
} => {
  const [state, setState] = useState<PWAState>({
    isOnline: navigator.onLine,
    isInstalled: false,
    canInstall: false,
    updateAvailable: false,
    pendingActions: 0,
    cacheUsage: { usage: 0, quota: 0, percentage: 0 }
  });

  // Check PWA capabilities
  const capabilities: PWACapabilities = {
    canInstall: 'serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window,
    isInstalled: pwaService.isInstalled(),
    isOnline: state.isOnline,
    isPWASupported: PWAUtils.getPWASupport().serviceWorker,
    canReceiveNotifications: 'Notification' in window,
    canBackgroundSync: PWAUtils.getPWASupport().backgroundSync
  };

  // Initialize PWA state
  useEffect(() => {
    const initializePWA = async () => {
      const cacheStats = await pwaService.getCacheStats();
      const offlineStatus = pwaService.getOfflineStatus();
      
      setState(prev => ({
        ...prev,
        isInstalled: pwaService.isInstalled(),
        pendingActions: offlineStatus.queuedActions,
        cacheUsage: cacheStats
      }));
    };

    initializePWA();
  }, []);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));
    
    const handlePWAUpdate = () => setState(prev => ({ ...prev, updateAvailable: true }));
    const handlePWAOnlineStatus = (event: CustomEvent) => {
      setState(prev => ({
        ...prev,
        isOnline: event.detail.isOnline,
        pendingActions: event.detail.queuedActions
      }));
    };

    // Browser events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // PWA events
    window.addEventListener('pwa-update-available', handlePWAUpdate);
    window.addEventListener('pwa-online-status', handlePWAOnlineStatus as EventListener);

    // Handle install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      (window as any).deferredPrompt = e;
      setState(prev => ({ ...prev, canInstall: true }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('pwa-update-available', handlePWAUpdate);
      window.removeEventListener('pwa-online-status', handlePWAOnlineStatus as EventListener);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // PWA Actions
  const actions: PWAActions = {
    promptInstall: useCallback(async () => {
      const installed = await pwaService.promptInstall();
      if (installed) {
        setState(prev => ({ ...prev, isInstalled: true, canInstall: false }));
      }
      return installed;
    }, []),

    updateApp: useCallback(async () => {
      await pwaService.updateApp();
      setState(prev => ({ ...prev, updateAvailable: false }));
    }, []),

    clearCache: useCallback(async () => {
      await pwaService.clearCache();
      const cacheStats = await pwaService.getCacheStats();
      setState(prev => ({ ...prev, cacheUsage: cacheStats }));
    }, []),

    scheduleNotification: useCallback((title: string, body: string, delay: number) => {
      setTimeout(() => {
        pwaService.sendNotification(title, { body });
      }, delay);
    }, []),

    cacheTaskData: useCallback(async (tasks: any[]) => {
      await pwaService.cacheTaskData(tasks);
    }, []),

    getCachedTasks: useCallback(async () => {
      return await pwaService.getCachedTasks();
    }, []),

    registerForNotifications: useCallback(async () => {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }
      return false;
    }, [])
  };

  return { state, actions, capabilities };
};

/**
 * Hook for offline task management
 */
export const useOfflineTasks = () => {
  const [offlineQueue, setOfflineQueue] = useState<any[]>([]);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    const syncListener = (data: any) => {
      if (data.synced !== undefined) {
        setLastSync(new Date());
        // Update queue by removing synced items
        setOfflineQueue(prev => prev.slice(data.synced));
      }
    };

    pwaService.addSyncListener(syncListener);

    return () => {
      pwaService.removeSyncListener(syncListener);
    };
  }, []);

  const queueAction = useCallback((action: string, taskId: string, data?: any) => {
    const queueItem = {
      id: `${Date.now()}-${Math.random()}`,
      action,
      taskId,
      data,
      timestamp: new Date()
    };

    pwaService.queueOfflineAction('/api/tasks', 'POST', queueItem);
    setOfflineQueue(prev => [...prev, queueItem]);
  }, []);

  const getQueueStatus = useCallback(() => {
    return {
      pendingCount: offlineQueue.length,
      lastSync,
      hasUnsyncedChanges: offlineQueue.length > 0
    };
  }, [offlineQueue.length, lastSync]);

  return {
    queueAction,
    getQueueStatus,
    offlineQueue
  };
};

/**
 * Hook for PWA notifications
 */
export const usePWANotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('Notification' in window);
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    }
    return false;
  }, []);

  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (permission === 'granted') {
      pwaService.sendNotification(title, options);
      return true;
    }
    return false;
  }, [permission]);

  const scheduleTaskReminder = useCallback((taskId: string, title: string, dueDate: Date) => {
    if (permission === 'granted') {
      pwaService.scheduleTaskReminder(taskId, title, dueDate);
      return true;
    }
    return false;
  }, [permission]);

  return {
    permission,
    isSupported,
    requestPermission,
    sendNotification,
    scheduleTaskReminder
  };
};

/**
 * Hook for device detection and mobile optimization
 */
export const useDeviceCapabilities = () => {
  const [capabilities, setCapabilities] = useState(() => PWAUtils.getDeviceCapabilities());

  useEffect(() => {
    const handleResize = () => {
      setCapabilities(PWAUtils.getDeviceCapabilities());
    };

    const handleOrientationChange = () => {
      setTimeout(() => {
        setCapabilities(PWAUtils.getDeviceCapabilities());
      }, 100); // Small delay to ensure dimensions are updated
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    // Apply mobile optimizations
    PWAUtils.optimizeForMobile();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return {
    ...capabilities,
    isLandscape: capabilities.orientation === 'landscape',
    isPortrait: capabilities.orientation === 'portrait',
    isSmallScreen: capabilities.screenSize.width < 768,
    isMediumScreen: capabilities.screenSize.width >= 768 && capabilities.screenSize.width < 1024,
    isLargeScreen: capabilities.screenSize.width >= 1024
  };
};

/**
 * Hook for cache management
 */
export const usePWACache = () => {
  const [cacheStats, setCacheStats] = useState({
    usage: 0,
    quota: 0,
    percentage: 0
  });

  const updateCacheStats = useCallback(async () => {
    const stats = await pwaService.getCacheStats();
    setCacheStats(stats);
  }, []);

  useEffect(() => {
    updateCacheStats();
  }, [updateCacheStats]);

  const clearCache = useCallback(async () => {
    await pwaService.clearCache();
    await updateCacheStats();
  }, [updateCacheStats]);

  const cacheTaskData = useCallback(async (tasks: any[]) => {
    await pwaService.cacheTaskData(tasks);
    await updateCacheStats();
  }, [updateCacheStats]);

  return {
    cacheStats,
    clearCache,
    cacheTaskData,
    updateCacheStats
  };
};