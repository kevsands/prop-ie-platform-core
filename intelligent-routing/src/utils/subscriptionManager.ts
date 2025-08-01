/**
 * Subscription Manager
 * 
 * Efficient handling of real-time data subscriptions with:
 * - Subscription deduplication and multiplexing
 * - Automatic reconnection with exponential backoff
 * - Memory and CPU optimization through batched updates
 * - Client-side filtering and transformation
 * - Integration with React Query for cache updates
 */

import React from 'react';
import { getDefaultQueryClient } from './queryClient';
import { apiCache } from './performance/enhancedCache';

// WebSocket states
enum WebSocketState {
  CONNECTING = 'connecting',
  OPEN = 'open',
  CLOSING = 'closing',
  CLOSED = 'closed'
}

// Subscription status
export enum SubscriptionStatus {
  CONNECTING = 'connecting',
  ACTIVE = 'active',
  RECONNECTING = 'reconnecting',
  PAUSED = 'paused',
  INACTIVE = 'inactive',
  ERROR = 'error'
}

// Subscription options
export interface SubscriptionOptions<T> {
  /**
   * Subscription topic/channel
   */
  topic: string;
  
  /**
   * Optional client-side filter function
   */
  filter?: (data: T) => boolean;
  
  /**
   * Optional data transformer
   */
  transform?: (data: T) => any;
  
  /**
   * React Query keys to update with subscription data
   */
  queryKeys?: unknown[][];
  
  /**
   * Cache tags to invalidate on updates
   */
  cacheTags?: string[];
  
  /**
   * Callback for subscription status changes
   */
  onStatusChange?: (status: SubscriptionStatus) => void;
  
  /**
   * Maximum reconnection attempts (default: 10)
   */
  maxReconnectAttempts?: number;
  
  /**
   * Initial backoff delay in ms (default: 1000ms)
   */
  initialBackoffDelay?: number;
  
  /**
   * Maximum backoff delay in ms (default: 30000ms)
   */
  maxBackoffDelay?: number;
  
  /**
   * Batch updates to reduce re-renders (default: true)
   */
  batchUpdates?: boolean;
  
  /**
   * Batch interval in ms (default: 100ms)
   */
  batchInterval?: number;
}

// Subscription interface
export interface Subscription<T = any> {
  id: string;
  topic: string;
  status: SubscriptionStatus;
  options: SubscriptionOptions<T>;
  lastMessage?: T;
  lastUpdated?: Date;
  unsubscribe: () => void;
  pause: () => void;
  resume: () => void;
}

// Map of pending batch updates
interface PendingBatch {
  timeout: NodeJS.Timeout;
  updates: Map<string, any>;
}

/**
 * Subscription Manager for handling real-time data
 */
export class SubscriptionManager {
  private websocket: WebSocket | null = null;
  private websocketState: WebSocketState = WebSocketState.CLOSED;
  private subscriptions = new Map<string, Subscription>();
  private topicSubscriptions = new Map<string, Set<string>>();
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private keepAliveInterval: NodeJS.Timeout | null = null;
  private pendingBatches = new Map<string, PendingBatch>();
  private connectionPromise: Promise<void> | null = null;
  private wsUrl: string;
  private authToken?: string;
  
  constructor(wsUrl: string, authToken?: string) {
    this.wsUrl = wsUrl;
    this.authToken = authToken;
    
    // Handle page visibility changes to optimize resource usage
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }
  }
  
  /**
   * Handle page visibility changes to optimize resource usage
   */
  private handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      // Page is hidden, pause non-critical subscriptions
      this.pauseNonCriticalSubscriptions();
    } else {
      // Page is visible again, resume subscriptions
      this.resumeAllSubscriptions();
    }
  };
  
  /**
   * Pause non-critical subscriptions
   */
  private pauseNonCriticalSubscriptions() {
    // In a real implementation, you would determine which subscriptions
    // are critical vs non-critical, perhaps via a priority setting
    // For now, we'll implement a simple stub
    console.log('Pausing non-critical subscriptions');
  }
  
  /**
   * Resume all subscriptions
   */
  private resumeAllSubscriptions() {
    this.subscriptions.forEach(subscription => {
      if (subscription.status === SubscriptionStatus.PAUSED) {
        subscription.resume();
      }
    });
  }
  
  /**
   * Connect to the WebSocket server
   */
  private async connect(): Promise<void> {
    // If already connecting, return the existing promise
    if (this.connectionPromise && this.websocketState === WebSocketState.CONNECTING) {
      return this.connectionPromise;
    }
    
    // If already connected, return resolved promise
    if (this.websocket && this.websocketState === WebSocketState.OPEN) {
      return Promise.resolve();
    }
    
    // Create a new connection promise
    this.websocketState = WebSocketState.CONNECTING;
    this.connectionPromise = new Promise<void>((resolve, reject) => {
      try {
        // Close existing connection if any
        if (this.websocket) {
          this.cleanupWebSocket();
        }
        
        // Construct WebSocket URL with auth token if provided
        let url = this.wsUrl;
        if (this.authToken) {
          url += (url.includes('?') ? '&' : '?') + `token=${this.authToken}`;
        }
        
        // Create new WebSocket
        this.websocket = new WebSocket(url);
        
        // Setup event handlers
        this.websocket.onopen = () => {
          this.websocketState = WebSocketState.OPEN;
          this.reconnectAttempts = 0;
          this.setupKeepAlive();
          this.resubscribeAll();
          resolve();
        };
        
        this.websocket.onclose = (event) => {
          this.websocketState = WebSocketState.CLOSED;
          this.handleDisconnect(event.code === 1000);
        };
        
        this.websocket.onerror = (error) => {
          console.error('WebSocket error:', error);
          if (this.websocketState === WebSocketState.CONNECTING) {
            reject(new Error('Failed to connect to WebSocket server'));
          }
        };
        
        this.websocket.onmessage = this.handleMessage;
      } catch (error) {
        this.websocketState = WebSocketState.CLOSED;
        reject(error);
      }
    });
    
    return this.connectionPromise;
  }
  
  /**
   * Handle WebSocket message
   */
  private handleMessage = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      const { topic, payload } = data;
      
      if (!topic || !payload) {
        console.warn('Received message with missing topic or payload', data);
        return;
      }
      
      // Dispatch to subscribers
      this.dispatchMessage(topic, payload);
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
    }
  };
  
  /**
   * Dispatch message to subscribers
   */
  private dispatchMessage(topic: string, payload: any) {
    // Get all subscription IDs for this topic
    const subscriptionIds = this.topicSubscriptions.get(topic);
    if (!subscriptionIds || subscriptionIds.size === 0) {
      return;
    }
    
    // Process each subscription
    subscriptionIds.forEach(id => {
      const subscription = this.subscriptions.get(id);
      if (!subscription) return;
      
      const { filter, transform, batchUpdates, batchInterval, queryKeys, cacheTags } = subscription.options;
      
      // Apply filter if provided
      if (filter && !filter(payload)) {
        return;
      }
      
      // Apply transform if provided
      const transformedData = transform ? transform(payload) : payload;
      
      // Update subscription metadata
      subscription.lastMessage = transformedData;
      subscription.lastUpdated = new Date();
      
      // Update React Query cache if query keys provided
      if (queryKeys && queryKeys.length > 0) {
        if (batchUpdates) {
          // Batch updates to reduce re-renders
          this.batchQueryUpdate(subscription.id, topic, queryKeys, transformedData, batchInterval || 100);
        } else {
          // Update immediately
          this.updateQueryCache(queryKeys, transformedData);
        }
      }
      
      // Update the apiCache if cache tags provided
      if (cacheTags && cacheTags.length > 0) {
        cacheTags.forEach(tag => {
          apiCache.invalidateByTag(tag);
        });
      }
    });
  }
  
  /**
   * Batch query updates to reduce re-renders
   */
  private batchQueryUpdate(
    subscriptionId: string,
    topic: string,
    queryKeys: unknown[][],
    data: any,
    interval: number
  ) {
    // Create a batch key from topic
    const batchKey = `${topic}`;
    
    // Get or create pending batch
    if (!this.pendingBatches.has(batchKey)) {
      const timeout = setTimeout(() => {
        const batch = this.pendingBatches.get(batchKey);
        if (batch) {
          // Apply all updates in the batch
          batch.updates.forEach((updateData, updateKey) => {
            const [subId, qkIndex] = updateKey.split(':');
            const subscription = this.subscriptions.get(subId);
            if (subscription && subscription.options.queryKeys) {
              const queryKey = subscription.options.queryKeys[parseInt(qkIndex, 10)];
              this.updateSingleQueryCache(queryKey, updateData);
            }
          });
          
          // Clear the batch
          this.pendingBatches.delete(batchKey);
        }
      }, interval);
      
      this.pendingBatches.set(batchKey, {
        timeout,
        updates: new Map()
      });
    }
    
    // Add updates to the batch
    const batch = this.pendingBatches.get(batchKey)!;
    queryKeys.forEach((queryKey, index) => {
      const updateKey = `${subscriptionId}:${index}`;
      batch.updates.set(updateKey, data);
    });
  }
  
  /**
   * Update React Query cache with subscription data
   */
  private updateQueryCache(queryKeys: unknown[][], data: any) {
    queryKeys.forEach(queryKey => {
      this.updateSingleQueryCache(queryKey, data);
    });
  }
  
  /**
   * Update a single query cache entry
   */
  private updateSingleQueryCache(queryKey: unknown[], data: any) {
    const queryClient = getDefaultQueryClient();
    const existing = queryClient.getQueryData(queryKey);
    
    if (Array.isArray(existing)) {
      // For arrays, merge based on ID field if available
      if (data.id) {
        queryClient.setQueryData(queryKey, (old: any[] = []) => {
          const index = old.findIndex(item => item.id === data.id);
          if (index >= 0) {
            // Update existing item
            const updated = [...old];
            updated[index] = { ...updated[index], ...data };
            return updated;
          } else {
            // Add new item
            return [...old, data];
          }
        });
      } else {
        // Simple append
        queryClient.setQueryData(queryKey, (old: any[] = []) => [...old, data]);
      }
    } else if (existing && typeof existing === 'object') {
      // For objects, merge properties
      queryClient.setQueryData(queryKey, (old: any = {}) => ({ ...old, ...data }));
    } else {
      // For other types, replace
      queryClient.setQueryData(queryKey, data);
    }
  }
  
  /**
   * Handle WebSocket disconnection
   */
  private handleDisconnect(isClean: boolean) {
    // Clean up resources
    this.clearKeepAlive();
    
    // Update all subscriptions to reconnecting status
    this.subscriptions.forEach(subscription => {
      if (subscription.status === SubscriptionStatus.ACTIVE) {
        subscription.status = SubscriptionStatus.RECONNECTING;
        subscription.options.onStatusChange?.(SubscriptionStatus.RECONNECTING);
      }
    });
    
    // If not a clean close, attempt reconnection
    if (!isClean) {
      this.attemptReconnect();
    }
  }
  
  /**
   * Attempt to reconnect with exponential backoff
   */
  private attemptReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    
    // Check if max reconnect attempts reached
    const maxAttempts = Math.max(...Array.from(this.subscriptions.values())
      .map(sub => sub.options.maxReconnectAttempts || 10));
    
    if (this.reconnectAttempts >= maxAttempts) {
      console.error(`Maximum reconnection attempts (${maxAttempts}) reached`);
      
      // Set all subscriptions to error state
      this.subscriptions.forEach(subscription => {
        subscription.status = SubscriptionStatus.ERROR;
        subscription.options.onStatusChange?.(SubscriptionStatus.ERROR);
      });
      
      return;
    }
    
    // Calculate backoff delay using exponential backoff
    const initialDelay = Math.min(...Array.from(this.subscriptions.values())
      .map(sub => sub.options.initialBackoffDelay || 1000));
    
    const maxDelay = Math.max(...Array.from(this.subscriptions.values())
      .map(sub => sub.options.maxBackoffDelay || 30000));
    
    const delay = Math.min(
      initialDelay * Math.pow(2, this.reconnectAttempts),
      maxDelay
    );
    
    this.reconnectAttempts++;
    
    // Schedule reconnection
    this.reconnectTimer = setTimeout(() => {
      console.log(`Attempting to reconnect (attempt ${this.reconnectAttempts})...`);
      this.connect().catch(() => {
        // If reconnection fails, schedule another attempt
        this.attemptReconnect();
      });
    }, delay);
  }
  
  /**
   * Setup keep-alive ping
   */
  private setupKeepAlive() {
    this.clearKeepAlive();
    
    this.keepAliveInterval = setInterval(() => {
      if (this.websocket && this.websocketState === WebSocketState.OPEN) {
        try {
          this.websocket.send(JSON.stringify({ type: 'ping' }));
        } catch (error) {
          console.error('Error sending ping:', error);
        }
      }
    }, 30000); // Send ping every 30 seconds
  }
  
  /**
   * Clear keep-alive interval
   */
  private clearKeepAlive() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
  }
  
  /**
   * Clean up WebSocket resources
   */
  private cleanupWebSocket() {
    if (!this.websocket) return;
    
    this.clearKeepAlive();
    
    try {
      if (this.websocketState !== WebSocketState.CLOSED) {
        this.websocketState = WebSocketState.CLOSING;
        this.websocket.close();
      }
    } catch (e) {
      console.error('Error closing WebSocket:', e);
    }
    
    this.websocket = null;
    this.websocketState = WebSocketState.CLOSED;
  }
  
  /**
   * Resubscribe all active subscriptions after reconnection
   */
  private resubscribeAll() {
    if (!this.websocket || this.websocketState !== WebSocketState.OPEN) {
      return;
    }
    
    // Group subscriptions by topic to send fewer messages
    const topicSubscriptions = new Map<string, string[]>();
    
    this.subscriptions.forEach(subscription => {
      if (subscription.status === SubscriptionStatus.RECONNECTING || 
          subscription.status === SubscriptionStatus.CONNECTING) {
        // Update status to active
        subscription.status = SubscriptionStatus.ACTIVE;
        subscription.options.onStatusChange?.(SubscriptionStatus.ACTIVE);
        
        // Add to topic subscriptions
        const subs = topicSubscriptions.get(subscription.topic) || [];
        subs.push(subscription.id);
        topicSubscriptions.set(subscription.topic, subs);
      }
    });
    
    // Send subscription messages by topic
    topicSubscriptions.forEach((subscriptionIds, topic) => {
      try {
        this.websocket!.send(JSON.stringify({
          type: 'subscribe',
          topic,
          subscriptionIds
        }));
      } catch (error) {
        console.error(`Error subscribing to ${topic}:`, error);
      }
    });
  }
  
  /**
   * Subscribe to a topic
   */
  public subscribe<T = any>(options: SubscriptionOptions<T>): Subscription<T> {
    const { topic } = options;
    const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Create subscription object
    const subscription: Subscription<T> = {
      id: subscriptionId,
      topic,
      status: SubscriptionStatus.CONNECTING,
      options: {
        ...options,
        onStatusChange: status => {
          subscription.status = status;
          options.onStatusChange?.(status);
        }
      },
      unsubscribe: () => this.unsubscribe(subscriptionId),
      pause: () => this.pauseSubscription(subscriptionId),
      resume: () => this.resumeSubscription(subscriptionId)
    };
    
    // Store subscription
    this.subscriptions.set(subscriptionId, subscription);
    
    // Add to topic map
    if (!this.topicSubscriptions.has(topic)) {
      this.topicSubscriptions.set(topic, new Set());
    }
    this.topicSubscriptions.get(topic)!.add(subscriptionId);
    
    // Connect and subscribe
    this.connect().then(() => {
      if (this.websocket && this.websocketState === WebSocketState.OPEN) {
        try {
          this.websocket.send(JSON.stringify({
            type: 'subscribe',
            topic,
            subscriptionId
          }));
          
          subscription.status = SubscriptionStatus.ACTIVE;
          options.onStatusChange?.(SubscriptionStatus.ACTIVE);
        } catch (error) {
          console.error(`Error subscribing to ${topic}:`, error);
          subscription.status = SubscriptionStatus.ERROR;
          options.onStatusChange?.(SubscriptionStatus.ERROR);
        }
      }
    }).catch(error => {
      console.error(`Error connecting for subscription to ${topic}:`, error);
      subscription.status = SubscriptionStatus.ERROR;
      options.onStatusChange?.(SubscriptionStatus.ERROR);
    });
    
    return subscription;
  }
  
  /**
   * Unsubscribe from a topic
   */
  public unsubscribe(subscriptionId: string): boolean {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) {
      return false;
    }
    
    const { topic } = subscription;
    
    // Remove from topic subscriptions
    const topicSubs = this.topicSubscriptions.get(topic);
    if (topicSubs) {
      topicSubs.delete(subscriptionId);
      if (topicSubs.size === 0) {
        this.topicSubscriptions.delete(topic);
      }
    }
    
    // Remove subscription
    this.subscriptions.delete(subscriptionId);
    
    // If WebSocket is open, send unsubscribe message
    if (this.websocket && this.websocketState === WebSocketState.OPEN) {
      try {
        this.websocket.send(JSON.stringify({
          type: 'unsubscribe',
          topic,
          subscriptionId
        }));
      } catch (error) {
        console.error(`Error unsubscribing from ${topic}:`, error);
      }
    }
    
    // If no more subscriptions, close connection
    if (this.subscriptions.size === 0) {
      this.cleanupWebSocket();
      
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
    }
    
    return true;
  }
  
  /**
   * Pause a subscription
   */
  public pauseSubscription(subscriptionId: string): boolean {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription || subscription.status !== SubscriptionStatus.ACTIVE) {
      return false;
    }
    
    // Update status
    subscription.status = SubscriptionStatus.PAUSED;
    subscription.options.onStatusChange?.(SubscriptionStatus.PAUSED);
    
    // Notify server if connected
    if (this.websocket && this.websocketState === WebSocketState.OPEN) {
      try {
        this.websocket.send(JSON.stringify({
          type: 'pause',
          topic: subscription.topic,
          subscriptionId
        }));
      } catch (error) {
        console.error(`Error pausing subscription:`, error);
      }
    }
    
    return true;
  }
  
  /**
   * Resume a paused subscription
   */
  public resumeSubscription(subscriptionId: string): boolean {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription || subscription.status !== SubscriptionStatus.PAUSED) {
      return false;
    }
    
    // Update status
    subscription.status = SubscriptionStatus.CONNECTING;
    subscription.options.onStatusChange?.(SubscriptionStatus.CONNECTING);
    
    // Ensure connection and resubscribe
    this.connect().then(() => {
      if (this.websocket && this.websocketState === WebSocketState.OPEN) {
        try {
          this.websocket.send(JSON.stringify({
            type: 'resume',
            topic: subscription.topic,
            subscriptionId
          }));
          
          subscription.status = SubscriptionStatus.ACTIVE;
          subscription.options.onStatusChange?.(SubscriptionStatus.ACTIVE);
        } catch (error) {
          console.error(`Error resuming subscription:`, error);
          subscription.status = SubscriptionStatus.ERROR;
          subscription.options.onStatusChange?.(SubscriptionStatus.ERROR);
        }
      }
    }).catch(error => {
      console.error(`Error connecting for resuming subscription:`, error);
      subscription.status = SubscriptionStatus.ERROR;
      subscription.options.onStatusChange?.(SubscriptionStatus.ERROR);
    });
    
    return true;
  }
  
  /**
   * Update auth token
   */
  public updateAuthToken(token: string) {
    this.authToken = token;
    
    // If connected, reconnect with new token
    if (this.websocket && this.websocketState === WebSocketState.OPEN) {
      this.cleanupWebSocket();
      this.connect().catch(error => {
        console.error('Error reconnecting with new token:', error);
      });
    }
  }
  
  /**
   * Close all subscriptions and clean up resources
   */
  public destroy() {
    // Clear all batched updates
    this.pendingBatches.forEach(batch => {
      clearTimeout(batch.timeout);
    });
    this.pendingBatches.clear();
    
    // Unsubscribe all
    const subscriptionIds = Array.from(this.subscriptions.keys());
    subscriptionIds.forEach(id => this.unsubscribe(id));
    
    // Clean up WebSocket
    this.cleanupWebSocket();
    
    // Clear reconnect timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    // Remove visibility change listener
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
  }
  
  /**
   * Get statistics about current subscriptions
   */
  public getStats() {
    const statusCounts: Record<SubscriptionStatus, number> = {
      [SubscriptionStatus.CONNECTING]: 0,
      [SubscriptionStatus.ACTIVE]: 0,
      [SubscriptionStatus.RECONNECTING]: 0,
      [SubscriptionStatus.PAUSED]: 0,
      [SubscriptionStatus.INACTIVE]: 0,
      [SubscriptionStatus.ERROR]: 0
    };
    
    this.subscriptions.forEach(subscription => {
      statusCounts[subscription.status]++;
    });
    
    return {
      totalSubscriptions: this.subscriptions.size,
      topicCount: this.topicSubscriptions.size,
      connectionState: this.websocketState,
      subscriptionStatus: statusCounts,
      reconnectAttempts: this.reconnectAttempts
    };
  }
}

// Create a React Hook for using subscriptions
export function createSubscriptionHook(wsUrl: string) {
  // Create a singleton instance
  const manager = new SubscriptionManager(wsUrl);
  
  /**
   * Custom hook for subscribing to real-time data
   */
  function useSubscription<T>(options: SubscriptionOptions<T>) {
    const [status, setStatus] = React.useState<SubscriptionStatus>(SubscriptionStatus.CONNECTING);
    const [data, setData] = React.useState<T | undefined>(undefined);
    const subscriptionRef = React.useRef<Subscription<T> | null>(null);
    
    React.useEffect(() => {
      // Create enhanced options with status callback
      const enhancedOptions: SubscriptionOptions<T> = {
        ...options,
        onStatusChange: (newStatus) => {
          setStatus(newStatus);
          options.onStatusChange?.(newStatus);
        },
        transform: (payload) => {
          const transformedData = options.transform ? options.transform(payload) : payload;
          setData(transformedData);
          return transformedData;
        }
      };
      
      // Subscribe
      const subscription = manager.subscribe<T>(enhancedOptions);
      subscriptionRef.current = subscription;
      
      // Cleanup on unmount
      return () => {
        subscription.unsubscribe();
        subscriptionRef.current = null;
      };
    }, [options.topic]); // Only re-subscribe if topic changes
    
    // Return subscription state and controls
    return {
      data,
      status,
      isLoading: status === SubscriptionStatus.CONNECTING,
      isActive: status === SubscriptionStatus.ACTIVE,
      isError: status === SubscriptionStatus.ERROR,
      pause: () => subscriptionRef.current?.pause(),
      resume: () => subscriptionRef.current?.resume(),
      unsubscribe: () => subscriptionRef.current?.unsubscribe() || false,
    };
  }
  
  // Also expose the manager for direct access
  useSubscription.manager = manager;
  
  return useSubscription;
}

// Create default subscription hook with WebSocket URL from environment
const wsUrl = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_WS_URL 
  ? process.env.NEXT_PUBLIC_WS_URL 
  : 'wss://api.example.com/subscriptions';

export const useSubscription = createSubscriptionHook(wsUrl);

export default useSubscription;