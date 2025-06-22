/**
 * Progressive Web App (PWA) Service
 * 
 * Enterprise-grade PWA capabilities for the PropIE Universal Task Management System.
 * Provides offline functionality, push notifications, background sync, AI-powered
 * task caching, and app-like experience for mobile and desktop users.
 * 
 * Features:
 * - Offline-first task management
 * - AI suggestion caching
 * - Background sync for task updates
 * - Push notifications for task reminders
 * - Mobile-optimized caching strategies
 * - IndexedDB for persistent offline storage
 */

import { Task, TaskStatus, TaskPriority } from '@/types/task/universal-task';
import { AITaskPriorityScore } from '@/services/AITaskIntelligenceService';

/**
 * Service Worker registration and management
 */
export class PWAService {
  private static instance: PWAService;
  private registration: ServiceWorkerRegistration | null = null;
  private isOnline: boolean = navigator.onLine;
  private offlineQueue: Array<{
    id: string;
    url: string;
    method: string;
    body?: any;
    timestamp: Date;
    retryCount: number;
    taskId?: string;
    action?: 'create' | 'update' | 'complete' | 'delete';
  }> = [];
  
  private cachedTasks: Map<string, Task> = new Map();
  private cachedAIScores: Map<string, AITaskPriorityScore> = new Map();
  private installPrompt: any = null;
  private syncListeners: Array<(data: any) => void> = [];

  private constructor() {
    this.initializeServiceWorker();
    this.setupOfflineHandling();
    this.setupPushNotifications();
  }

  public static getInstance(): PWAService {
    if (!PWAService.instance) {
      PWAService.instance = new PWAService();
    }
    return PWAService.instance;
  }

  /**
   * Initialize Service Worker for offline capabilities
   */
  private async initializeServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });
        
        console.log('[PWA] Service Worker registered successfully');
        
        // Setup PWA install prompt handling
        window.addEventListener('beforeinstallprompt', (e) => {
          e.preventDefault();
          this.installPrompt = e;
          console.log('[PWA] Install prompt available');
        });
        
        // Handle updates
        this.registration.addEventListener('updatefound', () => {
          const newWorker = this.registration!.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New version available
                this.notifyUpdate();
              }
            });
          }
        });
        
        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', this.handleServiceWorkerMessage.bind(this));
        
      } catch (error) {
        console.error('[PWA] Service Worker registration failed:', error);
      }
    }
  }

  /**
   * Setup offline handling and background sync
   */
  private setupOfflineHandling(): void {
    // Online/offline event listeners
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processOfflineQueue();
      this.notifyOnlineStatus(true);
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyOnlineStatus(false);
    });
    
    // Intercept fetch requests for offline queueing
    this.interceptFetchRequests();
  }

  /**
   * Setup push notifications
   */
  private async setupPushNotifications(): Promise<void> {
    if ('Notification' in window && 'PushManager' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted' && this.registration) {
        try {
          const subscription = await this.registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: this.urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_KEY || '')
          });
          
          // Send subscription to server
          await this.sendSubscriptionToServer(subscription);
        } catch (error) {
          console.error('Push subscription failed:', error);
        }
      }
    }
  }

  /**
   * Enhanced PWA installation with task management setup
   */
  public async promptInstall(): Promise<boolean> {
    if (this.installPrompt) {
      this.installPrompt.prompt();
      const { outcome } = await this.installPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('[PWA] App installed successfully');
        
        // Initialize task management caches after installation
        await this.initializeTaskCaches();
        
        // Setup push notifications for task reminders
        await this.setupTaskNotifications();
      }
      
      this.installPrompt = null;
      return outcome === 'accepted';
    }
    
    // Fallback for older browsers
    const deferredPrompt = (window as any).deferredPrompt;
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      (window as any).deferredPrompt = null;
      return outcome === 'accepted';
    }
    
    return false;
  }
  
  /**
   * Initialize task-specific caches after installation
   */
  private async initializeTaskCaches(): Promise<void> {
    try {
      // Pre-cache essential task management resources
      const taskCache = await caches.open('prop-ie-tasks-v1');
      const aiCache = await caches.open('prop-ie-ai-v1');
      
      const essentialUrls = [
        '/tasks/mobile',
        '/tasks/universal-demo',
        '/offline.html'
      ];
      
      await Promise.allSettled(essentialUrls.map(url => taskCache.add(url)));
      console.log('[PWA] Task caches initialized');
    } catch (error) {
      console.warn('[PWA] Failed to initialize task caches:', error);
    }
  }
  
  /**
   * Setup task-specific push notifications
   */
  private async setupTaskNotifications(): Promise<void> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('[PWA] Task notifications enabled');
        
        // Send welcome notification
        this.sendNotification('PropIE Task Manager Installed', {
          body: 'You can now manage tasks offline and receive reminders!',
          icon: '/icon-192x192.png',
          tag: 'welcome'
        });
      }
    }
  }

  /**
   * Check if app is installed
   */
  public isInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone ||
           document.referrer.includes('android-app://');
  }

  /**
   * Cache management
   */
  public async clearCache(): Promise<void> {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }
  }

  /**
   * Get cache usage statistics
   */
  public async getCacheStats(): Promise<{
    usage: number;
    quota: number;
    percentage: number;
  }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        usage: estimate.usage || 0,
        quota: estimate.quota || 0,
        percentage: estimate.quota ? (estimate.usage || 0) / estimate.quota * 100 : 0
      };
    }
    return { usage: 0, quota: 0, percentage: 0 };
  }

  /**
   * Enhanced task-specific offline operations
   */
  public async cacheTaskData(tasks: Task[], aiScores?: Map<string, AITaskPriorityScore>): Promise<void> {
    if ('caches' in window) {
      const cache = await caches.open('prop-ie-tasks-v1');
      
      // Cache task data with enhanced metadata
      const taskData = {
        tasks,
        aiScores: aiScores ? Array.from(aiScores.entries()) : [],
        timestamp: new Date().toISOString(),
        version: '2.0',
        cacheStrategy: 'offline-first'
      };
      
      await cache.put('/api/tasks/offline', new Response(JSON.stringify(taskData)));
      
      // Update local cache maps
      tasks.forEach(task => this.cachedTasks.set(task.id, task));
      if (aiScores) {
        aiScores.forEach((score, taskId) => this.cachedAIScores.set(taskId, score));
      }
      
      // Send message to service worker
      this.sendMessageToServiceWorker('CACHE_TASK_DATA', taskData);
      
      console.log(`[PWA] Cached ${tasks.length} tasks with AI scores`);
    }
  }

  public async getCachedTasks(): Promise<{
    tasks: Task[];
    aiScores: Map<string, AITaskPriorityScore>;
    timestamp: string;
  }> {
    if ('caches' in window) {
      const cache = await caches.open('prop-ie-tasks-v1');
      const response = await cache.match('/api/tasks/offline');
      
      if (response) {
        const data = await response.json();
        return {
          tasks: data.tasks || [],
          aiScores: new Map(data.aiScores || []),
          timestamp: data.timestamp
        };
      }
    }
    return {
      tasks: [],
      aiScores: new Map(),
      timestamp: new Date().toISOString()
    };
  }
  
  /**
   * Cache AI intelligence data for offline use
   */
  public async cacheAIIntelligence(scores: Map<string, AITaskPriorityScore>): Promise<void> {
    if ('caches' in window) {
      const cache = await caches.open('prop-ie-ai-v1');
      
      const aiData = {
        scores: Array.from(scores.entries()),
        models: {
          priorityEngine: 'cached',
          bottleneckPrediction: 'cached',
          workloadBalancing: 'cached',
          intelligentRouting: 'cached'
        },
        timestamp: new Date().toISOString()
      };
      
      await cache.put('/api/ai/offline', new Response(JSON.stringify(aiData)));
      scores.forEach((score, taskId) => this.cachedAIScores.set(taskId, score));
      
      console.log(`[PWA] Cached AI intelligence for ${scores.size} tasks`);
    }
  }
  
  /**
   * Get cached AI intelligence
   */
  public async getCachedAIIntelligence(): Promise<Map<string, AITaskPriorityScore>> {
    if ('caches' in window) {
      const cache = await caches.open('prop-ie-ai-v1');
      const response = await cache.match('/api/ai/offline');
      
      if (response) {
        const data = await response.json();
        return new Map(data.scores || []);
      }
    }
    return new Map();
  }

  /**
   * Enhanced offline action queueing for tasks
   */
  public queueOfflineAction(
    url: string, 
    method: string, 
    body?: any, 
    taskId?: string, 
    action?: 'create' | 'update' | 'complete' | 'delete'
  ): void {
    const queueItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url,
      method,
      body,
      timestamp: new Date(),
      retryCount: 0,
      taskId,
      action
    };
    
    this.offlineQueue.push(queueItem);
    
    // Store in IndexedDB for persistence
    this.persistOfflineQueue();
    
    // Register background sync for this action
    this.registerBackgroundSync('offline-actions');
    
    console.log(`[PWA] Queued offline action: ${action || method} for ${url}`);
  }
  
  /**
   * Task-specific offline actions
   */
  public queueTaskAction(taskId: string, action: 'create' | 'update' | 'complete' | 'delete', data: any): void {
    const url = `/api/tasks${action === 'create' ? '' : `/${taskId}`}`;
    const method = action === 'create' ? 'POST' : action === 'delete' ? 'DELETE' : 'PATCH';
    
    this.queueOfflineAction(url, method, data, taskId, action);
  }

  /**
   * Process offline queue when back online
   */
  private async processOfflineQueue(): Promise<void> {
    const queue = [...this.offlineQueue];
    this.offlineQueue = [];
    
    for (const action of queue) {
      try {
        await fetch(action.url, {
          method: action.method,
          body: action.body ? JSON.stringify(action.body) : undefined,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        console.error('Failed to process offline action:', error);
        // Re-queue failed actions
        this.offlineQueue.push(action);
      }
    }
    
    // Update persistent storage
    this.persistOfflineQueue();
    
    // Notify listeners
    this.syncListeners.forEach(listener => listener({ synced: queue.length - this.offlineQueue.length }));
  }

  /**
   * Enhanced background sync for task updates
   */
  public registerBackgroundSync(tag: string, data?: any): void {
    if ('serviceWorker' in navigator && this.registration) {
      navigator.serviceWorker.ready.then(registration => {
        if ('sync' in registration) {
          (registration as any).sync.register(tag);
          console.log(`[PWA] Registered background sync: ${tag}`);
          
          // Send data to service worker if provided
          if (data) {
            this.sendMessageToServiceWorker('QUEUE_OFFLINE_ACTION', data);
          }
        }
      });
    }
  }
  
  /**
   * Send message to service worker
   */
  private sendMessageToServiceWorker(type: string, payload: any): void {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type,
        payload
      });
    }
  }

  /**
   * Push notification helpers
   */
  public async sendNotification(
    title: string, 
    options: NotificationOptions = {}
  ): Promise<void> {
    if ('Notification' in window && Notification.permission === 'granted') {
      if (this.registration) {
        await this.registration.showNotification(title, {
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-72x72.png',
          vibrate: [100, 50, 100],
          data: { timestamp: Date.now() },
          ...options
        });
      } else {
        new Notification(title, options);
      }
    }
  }

  /**
   * Enhanced task reminder scheduling with AI priority consideration
   */
  public scheduleTaskReminder(taskId: string, title: string, dueDate: Date, priority?: TaskPriority): void {
    const now = new Date();
    const timeUntilDue = dueDate.getTime() - now.getTime();
    
    // Adjust reminder timing based on priority
    let reminderOffsets = [60 * 60 * 1000]; // Default: 1 hour before
    
    if (priority === TaskPriority.CRITICAL) {
      reminderOffsets = [24 * 60 * 60 * 1000, 4 * 60 * 60 * 1000, 60 * 60 * 1000]; // 24h, 4h, 1h
    } else if (priority === TaskPriority.HIGH) {
      reminderOffsets = [4 * 60 * 60 * 1000, 60 * 60 * 1000]; // 4h, 1h
    }
    
    reminderOffsets.forEach((offset, index) => {
      const reminderTime = timeUntilDue - offset;
      
      if (reminderTime > 0) {
        setTimeout(() => {
          const urgencyText = offset <= 60 * 60 * 1000 ? 'due soon' : 'due today';
          
          this.sendNotification(`${this.getPriorityEmoji(priority)} ${title}`, {
            body: `This ${priority?.toLowerCase() || 'normal'} priority task is ${urgencyText}`,
            tag: `task-reminder-${taskId}-${index}`,
            requireInteraction: priority === TaskPriority.CRITICAL,
            vibrate: priority === TaskPriority.CRITICAL ? [200, 100, 200, 100, 200] : [100, 50, 100],
            actions: [
              { action: 'view', title: 'View Task', icon: '/icons/view.png' },
              { action: 'complete', title: 'Mark Complete', icon: '/icons/complete.png' },
              { action: 'defer', title: 'Defer 1h', icon: '/icons/defer.png' }
            ],
            data: {
              taskId,
              priority,
              dueDate: dueDate.toISOString()
            }
          });
        }, reminderTime);
      }
    });
  }
  
  /**
   * Send AI-powered task suggestions notification
   */
  public sendAITaskSuggestion(taskId: string, suggestion: string, score: number): void {
    this.sendNotification('🤖 AI Task Suggestion', {
      body: `${suggestion} (Confidence: ${Math.round(score)}%)`,
      tag: `ai-suggestion-${taskId}`,
      icon: '/icon-192x192.png',
      actions: [
        { action: 'apply', title: 'Apply Suggestion' },
        { action: 'dismiss', title: 'Dismiss' }
      ],
      data: {
        taskId,
        suggestion,
        score,
        type: 'ai-suggestion'
      }
    });
  }
  
  /**
   * Send bottleneck alert notification
   */
  public sendBottleneckAlert(tasks: string[], prediction: string): void {
    this.sendNotification('⚠️ Workflow Bottleneck Detected', {
      body: prediction,
      tag: 'bottleneck-alert',
      requireInteraction: true,
      vibrate: [200, 100, 200],
      actions: [
        { action: 'view-tasks', title: 'View Tasks' },
        { action: 'rebalance', title: 'Auto-Rebalance' }
      ],
      data: {
        tasks,
        prediction,
        type: 'bottleneck-alert'
      }
    });
  }
  
  /**
   * Get priority emoji for notifications
   */
  private getPriorityEmoji(priority?: TaskPriority): string {
    switch (priority) {
      case TaskPriority.CRITICAL: return '🚨';
      case TaskPriority.HIGH: return '🔥';
      case TaskPriority.MEDIUM: return '⚡';
      case TaskPriority.LOW: return '📝';
      default: return '📋';
    }
  }

  /**
   * App update handling
   */
  public async updateApp(): Promise<void> {
    if (this.registration) {
      const waitingWorker = this.registration.waiting;
      if (waitingWorker) {
        waitingWorker.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    }
  }

  /**
   * Add sync listener
   */
  public addSyncListener(listener: (data: any) => void): void {
    this.syncListeners.push(listener);
  }

  /**
   * Remove sync listener
   */
  public removeSyncListener(listener: (data: any) => void): void {
    const index = this.syncListeners.indexOf(listener);
    if (index > -1) {
      this.syncListeners.splice(index, 1);
    }
  }

  /**
   * Get offline status
   */
  public getOfflineStatus(): {
    isOnline: boolean;
    queuedActions: number;
    lastSync?: Date;
  } {
    return {
      isOnline: this.isOnline,
      queuedActions: this.offlineQueue.length,
      lastSync: this.offlineQueue.length > 0 ? this.offlineQueue[0].timestamp : undefined
    };
  }

  /**
   * Private helper methods
   */
  private handleServiceWorkerMessage(event: MessageEvent): void {
    const { type, payload } = event.data;
    
    switch (type) {
      case 'CACHE_UPDATED':
        console.log('Cache updated:', payload);
        break;
      case 'BACKGROUND_SYNC':
        this.processOfflineQueue();
        break;
      case 'PUSH_RECEIVED':
        console.log('Push notification received:', payload);
        break;
    }
  }

  private notifyUpdate(): void {
    // Dispatch custom event for app update
    window.dispatchEvent(new CustomEvent('pwa-update-available'));
  }

  private notifyOnlineStatus(isOnline: boolean): void {
    window.dispatchEvent(new CustomEvent('pwa-online-status', {
      detail: { isOnline, queuedActions: this.offlineQueue.length }
    }));
  }

  private interceptFetchRequests(): void {
    // This would typically be handled by the service worker
    // But we can add client-side queue management here
  }

  private async persistOfflineQueue(): Promise<void> {
    if ('indexedDB' in window) {
      try {
        // Store offline queue in IndexedDB for persistence across sessions
        const request = indexedDB.open('PropIE-PWA', 1);
        
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains('offlineQueue')) {
            db.createObjectStore('offlineQueue', { keyPath: 'id', autoIncrement: true });
          }
        };
        
        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          const transaction = db.transaction(['offlineQueue'], 'readwrite');
          const store = transaction.objectStore('offlineQueue');
          
          // Clear existing queue
          store.clear();
          
          // Add current queue items
          this.offlineQueue.forEach(item => store.add(item));
        };
      } catch (error) {
        console.error('Failed to persist offline queue:', error);
      }
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    try {
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
      });
    } catch (error) {
      console.error('Failed to send subscription to server:', error);
    }
  }
}

/**
 * PWA Utilities
 */
export class PWAUtils {
  /**
   * Check if device supports PWA features
   */
  static getPWASupport(): {
    serviceWorker: boolean;
    pushNotifications: boolean;
    backgroundSync: boolean;
    installPrompt: boolean;
    offlineCapability: boolean;
  } {
    return {
      serviceWorker: 'serviceWorker' in navigator,
      pushNotifications: 'PushManager' in window,
      backgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
      installPrompt: 'BeforeInstallPromptEvent' in window,
      offlineCapability: 'caches' in window && 'indexedDB' in window
    };
  }

  /**
   * Get device capabilities
   */
  static getDeviceCapabilities(): {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    hasTouch: boolean;
    orientation: 'portrait' | 'landscape';
    screenSize: { width: number; height: number };
    connection?: {
      type: string;
      effectiveType: string;
      downlink: number;
    };
  } {
    const userAgent = navigator.userAgent;
    const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)|KFAPWI|LG-V500|KFTT|KFOT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFASWI|KFTBWI|KFTBWA/.test(userAgent);
    
    return {
      isMobile,
      isTablet,
      isDesktop: !isMobile && !isTablet,
      hasTouch: 'ontouchstart' in window,
      orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
      screenSize: {
        width: window.screen.width,
        height: window.screen.height
      },
      connection: (navigator as any).connection ? {
        type: (navigator as any).connection.type,
        effectiveType: (navigator as any).connection.effectiveType,
        downlink: (navigator as any).connection.downlink
      } : undefined
    };
  }

  /**
   * Performance optimization for mobile
   */
  static optimizeForMobile(): void {
    // Disable hover effects on touch devices
    if ('ontouchstart' in window) {
      document.documentElement.classList.add('touch-device');
    }
    
    // Add viewport meta tag if missing
    if (!document.querySelector('meta[name="viewport"]')) {
      const viewport = document.createElement('meta');
      viewport.name = 'viewport';
      viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.head.appendChild(viewport);
    }
    
    // Optimize images for device pixel ratio
    const devicePixelRatio = window.devicePixelRatio || 1;
    document.documentElement.style.setProperty('--device-pixel-ratio', devicePixelRatio.toString());
  }
}

// Export singleton instance
export const pwaService = PWAService.getInstance();