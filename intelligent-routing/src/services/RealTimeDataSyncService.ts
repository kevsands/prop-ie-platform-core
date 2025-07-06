/**
 * ================================================================================
 * REAL-TIME DATA SYNCHRONIZATION SERVICE
 * Provides WebSocket and SSE connections for live data sync across all portals
 * ================================================================================
 */

import { EventEmitter } from 'events';
import { webSocketPoolManager, ConnectionPool } from './WebSocketConnectionPool';

// Real-time sync data types
export interface SyncDataTypes {
  property_update: {
    propertyId: string;
    updatedData: any;
    updatedBy: string;
    timestamp: string;
  };
  task_update: {
    taskId: string;
    status: string;
    assignedTo: string;
    updatedBy: string;
    milestone?: string;
    timestamp: string;
  };
  payment_update: {
    transactionId: string;
    paymentStatus: string;
    amount: number;
    buyerId: string;
    propertyId: string;
    timestamp: string;
  };
  message_received: {
    conversationId: string;
    messageId: string;
    senderId: string;
    content: string;
    timestamp: string;
  };
  document_uploaded: {
    documentId: string;
    fileName: string;
    uploadedBy: string;
    associatedWith: string;
    documentType: string;
    timestamp: string;
  };
  htb_status_change: {
    applicationId: string;
    newStatus: string;
    buyerId: string;
    propertyId: string;
    updatedBy: string;
    timestamp: string;
  };
  legal_milestone: {
    caseId: string;
    milestone: string;
    status: string;
    solicitorId: string;
    buyerId: string;
    timestamp: string;
  };
  notification: {
    notificationId: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    timestamp: string;
  };
}

export type SyncEventType = keyof SyncDataTypes;
export type SyncEventData<T extends SyncEventType> = SyncDataTypes[T];

// WebSocket connection states
export enum ConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting',
  ERROR = 'error'
}

// User subscription preferences
export interface SubscriptionPreferences {
  userId: string;
  userRole: string;
  subscriptions: {
    eventType: SyncEventType;
    enabled: boolean;
    filters?: {
      propertyIds?: string[];
      projectIds?: string[];
      conversationIds?: string[];
      taskCategories?: string[];
    };
  }[];
  realTimeEnabled: boolean;
  pushNotifications: boolean;
  emailDigest: boolean;
}

// Connection metrics
export interface ConnectionMetrics {
  connectTime: Date;
  lastPingTime: Date;
  messagesSent: number;
  messagesReceived: number;
  reconnectAttempts: number;
  avgLatency: number;
  dataTransferred: number;
}

/**
 * Real-Time Data Synchronization Service
 * Manages WebSocket connections and data synchronization across all portals
 */
export class RealTimeDataSyncService extends EventEmitter {
  private ws: WebSocket | null = null;
  private connectionState: ConnectionState = ConnectionState.DISCONNECTED;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 10;
  private reconnectDelay: number = 1000; // Start with 1 second
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private userId: string | null = null;
  private userRole: string | null = null;
  private subscriptions: Map<SyncEventType, boolean> = new Map();
  private eventQueue: Array<{ type: SyncEventType; data: any }> = [];
  private metrics: ConnectionMetrics;
  private preferences: SubscriptionPreferences | null = null;

  // WebSocket server endpoints
  private readonly wsEndpoints = {
    development: 'ws://localhost:3001/realtime',
    production: 'wss://api.prop.ie/realtime'
  };

  constructor() {
    super();
    this.initializeMetrics();
    this.setupEventHandlers();
  }

  private initializeMetrics(): void {
    this.metrics = {
      connectTime: new Date(),
      lastPingTime: new Date(),
      messagesSent: 0,
      messagesReceived: 0,
      reconnectAttempts: 0,
      avgLatency: 0,
      dataTransferred: 0
    };
  }

  private setupEventHandlers(): void {
    // Handle browser page visibility changes
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && this.connectionState === ConnectionState.DISCONNECTED) {
          this.connect();
        }
      });
    }

    // Handle network connectivity changes
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        if (this.connectionState === ConnectionState.DISCONNECTED) {
          this.connect();
        }
      });

      window.addEventListener('offline', () => {
        this.disconnect();
      });
    }
  }

  /**
   * Initialize connection with user context
   */
  async initialize(userId: string, userRole: string): Promise<void> {
    this.userId = userId;
    this.userRole = userRole;
    
    // Load user preferences
    await this.loadUserPreferences();
    
    // Connect to WebSocket
    await this.connect();
  }

  /**
   * Load user subscription preferences
   */
  private async loadUserPreferences(): Promise<void> {
    try {
      const response = await fetch('/api/realtime/preferences', {
        credentials: 'include'
      });

      if (response.ok) {
        this.preferences = await response.json();
        
        // Update local subscriptions based on preferences
        if (this.preferences) {
          this.preferences.subscriptions.forEach(sub => {
            this.subscriptions.set(sub.eventType, sub.enabled);
          });
        }
      } else {
        // Use default preferences
        this.setDefaultPreferences();
      }
    } catch (error) {
      console.error('Failed to load user preferences:', error);
      this.setDefaultPreferences();
    }
  }

  /**
   * Set default subscription preferences
   */
  private setDefaultPreferences(): void {
    if (!this.userId || !this.userRole) return;

    const defaultSubscriptions: { [key: string]: SyncEventType[] } = {
      buyer: ['property_update', 'task_update', 'payment_update', 'message_received', 'htb_status_change', 'legal_milestone', 'notification'],
      developer: ['property_update', 'task_update', 'payment_update', 'message_received', 'document_uploaded', 'notification'],
      agent: ['property_update', 'task_update', 'message_received', 'document_uploaded', 'notification'],
      solicitor: ['task_update', 'message_received', 'document_uploaded', 'legal_milestone', 'notification'],
      admin: ['property_update', 'task_update', 'payment_update', 'message_received', 'document_uploaded', 'htb_status_change', 'legal_milestone', 'notification']
    };

    const userSubscriptions = defaultSubscriptions[this.userRole] || [];
    userSubscriptions.forEach(eventType => {
      this.subscriptions.set(eventType, true);
    });
  }

  /**
   * Connect to WebSocket server
   */
  async connect(): Promise<void> {
    if (this.connectionState === ConnectionState.CONNECTING || 
        this.connectionState === ConnectionState.CONNECTED) {
      return;
    }

    this.setConnectionState(ConnectionState.CONNECTING);

    const wsUrl = this.getWebSocketUrl();
    
    try {
      this.ws = new WebSocket(wsUrl);
      this.setupWebSocketHandlers();
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.setConnectionState(ConnectionState.ERROR);
      await this.scheduleReconnect();
    }
  }

  /**
   * Get appropriate WebSocket URL
   */
  private getWebSocketUrl(): string {
    const isProduction = process.env.NODE_ENV === 'production';
    const baseUrl = isProduction ? this.wsEndpoints.production : this.wsEndpoints.development;
    
    const params = new URLSearchParams({
      userId: this.userId || '',
      userRole: this.userRole || '',
      timestamp: Date.now().toString()
    });

    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Setup WebSocket event handlers
   */
  private setupWebSocketHandlers(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.setConnectionState(ConnectionState.CONNECTED);
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;
      this.metrics.connectTime = new Date();
      
      // Send authentication and subscription preferences
      this.authenticate();
      this.subscribeToEvents();
      
      // Start heartbeat
      this.startHeartbeat();
      
      // Process queued events
      this.processEventQueue();
      
      this.emit('connected');
    };

    this.ws.onmessage = (event) => {
      this.handleIncomingMessage(event.data);
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      this.setConnectionState(ConnectionState.DISCONNECTED);
      this.stopHeartbeat();
      
      if (event.code !== 1000) { // Not a normal closure
        this.scheduleReconnect();
      }
      
      this.emit('disconnected', { code: event.code, reason: event.reason });
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.setConnectionState(ConnectionState.ERROR);
      this.emit('error', error);
    };
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleIncomingMessage(data: string): void {
    try {
      const message = JSON.parse(data);
      this.metrics.messagesReceived++;
      this.metrics.dataTransferred += data.length;

      switch (message.type) {
        case 'pong':
          this.handlePong(message.timestamp);
          break;
        case 'auth_success':
          console.log('Authentication successful');
          break;
        case 'auth_error':
          console.error('Authentication failed:', message.error);
          this.disconnect();
          break;
        case 'subscription_confirmed':
          console.log('Subscriptions confirmed:', message.events);
          break;
        default:
          // Handle data sync events
          if (this.isSubscribedToEvent(message.type)) {
            this.handleSyncEvent(message.type, message.data);
          }
          break;
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  /**
   * Handle synchronization events
   */
  private handleSyncEvent<T extends SyncEventType>(eventType: T, data: SyncEventData<T>): void {
    // Apply filters if any
    if (!this.shouldProcessEvent(eventType, data)) {
      return;
    }

    // Emit event for listeners
    this.emit('sync_event', { type: eventType, data });
    this.emit(eventType, data);

    // Update local data stores
    this.updateLocalData(eventType, data);
  }

  /**
   * Check if event should be processed based on filters
   */
  private shouldProcessEvent<T extends SyncEventType>(eventType: T, data: SyncEventData<T>): boolean {
    if (!this.preferences) return true;

    const subscription = this.preferences.subscriptions.find(sub => sub.eventType === eventType);
    if (!subscription || !subscription.enabled) return false;

    const filters = subscription.filters;
    if (!filters) return true;

    // Apply property-based filters
    if (filters.propertyIds && 'propertyId' in data) {
      return filters.propertyIds.includes((data as any).propertyId);
    }

    // Apply conversation-based filters
    if (filters.conversationIds && 'conversationId' in data) {
      return filters.conversationIds.includes((data as any).conversationId);
    }

    return true;
  }

  /**
   * Update local data stores based on sync events
   */
  private updateLocalData<T extends SyncEventType>(eventType: T, data: SyncEventData<T>): void {
    // This would integrate with your local state management
    // For example, updating Redux store, React Query cache, etc.
    
    switch (eventType) {
      case 'property_update':
        this.updatePropertyCache(data as SyncEventData<'property_update'>);
        break;
      case 'task_update':
        this.updateTaskCache(data as SyncEventData<'task_update'>);
        break;
      case 'payment_update':
        this.updatePaymentCache(data as SyncEventData<'payment_update'>);
        break;
      case 'message_received':
        this.updateMessageCache(data as SyncEventData<'message_received'>);
        break;
      // Add other event types as needed
    }
  }

  /**
   * Send authentication message
   */
  private authenticate(): void {
    this.sendMessage({
      type: 'authenticate',
      userId: this.userId,
      userRole: this.userRole,
      timestamp: Date.now()
    });
  }

  /**
   * Subscribe to events based on preferences
   */
  private subscribeToEvents(): void {
    const subscribedEvents = Array.from(this.subscriptions.entries())
      .filter(([_, enabled]) => enabled)
      .map(([eventType, _]) => eventType);

    this.sendMessage({
      type: 'subscribe',
      events: subscribedEvents
    });
  }

  /**
   * Send message through WebSocket
   */
  private sendMessage(message: any): void {
    if (this.connectionState !== ConnectionState.CONNECTED || !this.ws) {
      this.eventQueue.push(message);
      return;
    }

    try {
      const messageString = JSON.stringify(message);
      this.ws.send(messageString);
      this.metrics.messagesSent++;
      this.metrics.dataTransferred += messageString.length;
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      this.eventQueue.push(message);
    }
  }

  /**
   * Process queued events
   */
  private processEventQueue(): void {
    while (this.eventQueue.length > 0) {
      const message = this.eventQueue.shift();
      if (message) {
        this.sendMessage(message);
      }
    }
  }

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      this.sendMessage({
        type: 'ping',
        timestamp: Date.now()
      });
    }, 30000); // Every 30 seconds
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Handle pong response
   */
  private handlePong(serverTimestamp: number): void {
    const latency = Date.now() - serverTimestamp;
    this.metrics.avgLatency = (this.metrics.avgLatency + latency) / 2;
    this.metrics.lastPingTime = new Date();
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    this.stopHeartbeat();
    this.setConnectionState(ConnectionState.DISCONNECTED);
  }

  /**
   * Schedule reconnection attempt
   */
  private async scheduleReconnect(): Promise<void> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.setConnectionState(ConnectionState.RECONNECTING);
    this.reconnectAttempts++;
    this.metrics.reconnectAttempts++;

    setTimeout(() => {
      this.connect();
    }, this.reconnectDelay);

    // Exponential backoff
    this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000);
  }

  /**
   * Set connection state and emit event
   */
  private setConnectionState(state: ConnectionState): void {
    this.connectionState = state;
    this.emit('connection_state_changed', state);
  }

  /**
   * Check if subscribed to specific event type
   */
  private isSubscribedToEvent(eventType: SyncEventType): boolean {
    return this.subscriptions.get(eventType) === true;
  }

  /**
   * Public API methods
   */

  /**
   * Get current connection state
   */
  getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  /**
   * Get connection metrics
   */
  getMetrics(): ConnectionMetrics {
    return { ...this.metrics };
  }

  /**
   * Subscribe to specific event type
   */
  async subscribeToEvent(eventType: SyncEventType, enabled: boolean = true): Promise<void> {
    this.subscriptions.set(eventType, enabled);
    
    if (this.connectionState === ConnectionState.CONNECTED) {
      this.sendMessage({
        type: enabled ? 'subscribe' : 'unsubscribe',
        events: [eventType]
      });
    }

    // Update preferences on server
    await this.updateServerPreferences();
  }

  /**
   * Update subscription preferences on server
   */
  private async updateServerPreferences(): Promise<void> {
    try {
      const subscriptions = Array.from(this.subscriptions.entries()).map(([eventType, enabled]) => ({
        eventType,
        enabled
      }));

      await fetch('/api/realtime/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          subscriptions,
          realTimeEnabled: true
        })
      });
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  }

  /**
   * Broadcast event to other connected clients
   */
  broadcastEvent<T extends SyncEventType>(eventType: T, data: SyncEventData<T>): void {
    this.sendMessage({
      type: 'broadcast',
      eventType,
      data,
      timestamp: Date.now()
    });
  }

  // Cache update methods (integrate with your state management)
  private updatePropertyCache(data: SyncEventData<'property_update'>): void {
    // Update property data in local cache/store
    console.log('Property updated:', data.propertyId);
  }

  private updateTaskCache(data: SyncEventData<'task_update'>): void {
    // Update task data in local cache/store
    console.log('Task updated:', data.taskId);
  }

  private updatePaymentCache(data: SyncEventData<'payment_update'>): void {
    // Update payment data in local cache/store
    console.log('Payment updated:', data.transactionId);
  }

  private updateMessageCache(data: SyncEventData<'message_received'>): void {
    // Update message data in local cache/store
    console.log('Message received:', data.messageId);
  }
}

// Export singleton instance
export const realTimeDataSyncService = new RealTimeDataSyncService();

// Helper hook for React components
export function useRealTimeSync() {
  return realTimeDataSyncService;
}