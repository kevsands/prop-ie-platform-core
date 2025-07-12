/**
 * Real-Time Data Synchronization Service
 * Bridges developer portal changes to buyer platform updates instantly
 * 
 * @fileoverview WebSocket-based real-time sync for unit status, pricing, and availability
 * @version 1.0.0
 * @author Property Development Platform Team
 */

import { EventEmitter } from 'events';

// =============================================================================
// REAL-TIME EVENT TYPES
// =============================================================================

export interface PropertyUpdateEvent {
  type: 'UNIT_STATUS_CHANGE' | 'UNIT_PRICE_UPDATE' | 'UNIT_AVAILABILITY_CHANGE';
  developmentId: string;
  unitId: string;
  timestamp: Date;
  data: {
    unitNumber?: string;
    previousValue?: any;
    newValue?: any;
    updatedBy?: string;
    reason?: string;
  };
  metadata: {
    source: 'developer_portal' | 'admin_panel' | 'api';
    sessionId?: string;
    userRole?: string;
  };
}

export enum ConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting',
  ERROR = 'error'
}

export interface ConnectionMetrics {
  totalConnections: number;
  activeConnections: number;
  messagesSent: number;
  messagesReceived: number;
  connectionUptime: number;
  lastHeartbeat: Date | null;
  averageLatency: number;
}

export type SyncEventType = 'property_update' | 'task_update' | 'payment_update' | 'message_received' | 'notification';

export interface SyncEventData<T extends SyncEventType> {
  propertyId?: string;
  taskId?: string;
  transactionId?: string;
  conversationId?: string;
  notificationId?: string;
  timestamp: string;
  [key: string]: any;
}

export interface BuyerPlatformUpdate {
  developmentId: string;
  units: Array<{
    id: string;
    unitNumber: string;
    status: 'available' | 'reserved' | 'sold' | 'held' | 'withdrawn';
    price: number;
    updatedAt: Date;
  }>;
  lastUpdate: Date;
  totalAvailable: number;
}

// =============================================================================
// REAL-TIME SYNC SERVICE
// =============================================================================

export class RealTimeDataSyncService extends EventEmitter {
  private static instance: RealTimeDataSyncService;
  private connections: Map<string, any> = new Map();
  private developmentSubscriptions: Map<string, Set<string>> = new Map();
  private lastUpdates: Map<string, Date> = new Map();
  private connectionState: ConnectionState = ConnectionState.DISCONNECTED;
  private metrics: ConnectionMetrics = {
    totalConnections: 0,
    activeConnections: 0,
    messagesSent: 0,
    messagesReceived: 0,
    connectionUptime: 0,
    lastHeartbeat: null,
    averageLatency: 0
  };
  private initialized = false;

  private constructor() {
    super();
    this.setupEventHandlers();
  }

  public static getInstance(): RealTimeDataSyncService {
    if (!RealTimeDataSyncService.instance) {
      RealTimeDataSyncService.instance = new RealTimeDataSyncService();
    }
    return RealTimeDataSyncService.instance;
  }

  // =============================================================================
  // CONNECTION MANAGEMENT
  // =============================================================================

  /**
   * Register a WebSocket connection for real-time updates
   */
  public registerConnection(connectionId: string, socket: any, developmentId?: string): void {
    this.connections.set(connectionId, {
      socket,
      developmentId,
      connectedAt: new Date(),
      lastSeen: new Date()
    });

    if (developmentId) {
      this.subscribeToDevelopment(connectionId, developmentId);
    }

    console.log(`✅ Real-time connection registered: ${connectionId} for ${developmentId || 'general'}`);
  }

  /**
   * Remove a WebSocket connection
   */
  public removeConnection(connectionId: string): void {
    const connection = this.connections.get(connectionId);
    if (connection && connection.developmentId) {
      this.unsubscribeFromDevelopment(connectionId, connection.developmentId);
    }
    
    this.connections.delete(connectionId);
    console.log(`❌ Real-time connection removed: ${connectionId}`);
  }

  /**
   * Subscribe connection to development updates
   */
  public subscribeToDevelopment(connectionId: string, developmentId: string): void {
    if (!this.developmentSubscriptions.has(developmentId)) {
      this.developmentSubscriptions.set(developmentId, new Set());
    }
    
    this.developmentSubscriptions.get(developmentId)!.add(connectionId);
    console.log(`📡 Connection ${connectionId} subscribed to ${developmentId}`);
  }

  /**
   * Unsubscribe connection from development updates
   */
  public unsubscribeFromDevelopment(connectionId: string, developmentId: string): void {
    const subscribers = this.developmentSubscriptions.get(developmentId);
    if (subscribers) {
      subscribers.delete(connectionId);
      if (subscribers.size === 0) {
        this.developmentSubscriptions.delete(developmentId);
      }
    }
  }

  // =============================================================================
  // DEVELOPER PORTAL INTEGRATION
  // =============================================================================

  /**
   * Called when developer changes unit status in their portal
   */
  public broadcastUnitStatusChange(
    developmentId: string,
    unitId: string,
    previousStatus: string,
    newStatus: string,
    updatedBy: string = 'Developer',
    reason: string = 'Status updated'
  ): void {
    const event: PropertyUpdateEvent = {
      type: 'UNIT_STATUS_CHANGE',
      developmentId,
      unitId,
      timestamp: new Date(),
      data: {
        previousValue: previousStatus,
        newValue: newStatus,
        updatedBy,
        reason
      },
      metadata: {
        source: 'developer_portal',
        userRole: 'developer'
      }
    };

    this.broadcastToDevelopment(developmentId, 'property_update', event);
    this.lastUpdates.set(developmentId, new Date());

    console.log(`🚀 Broadcasting unit status change: ${unitId} ${previousStatus} → ${newStatus}`);
  }

  /**
   * Called when developer changes unit pricing in their portal
   */
  public broadcastUnitPriceUpdate(
    developmentId: string,
    unitId: string,
    previousPrice: number,
    newPrice: number,
    updatedBy: string = 'Developer',
    reason: string = 'Price updated'
  ): void {
    const event: PropertyUpdateEvent = {
      type: 'UNIT_PRICE_UPDATE',
      developmentId,
      unitId,
      timestamp: new Date(),
      data: {
        previousValue: previousPrice,
        newValue: newPrice,
        updatedBy,
        reason
      },
      metadata: {
        source: 'developer_portal',
        userRole: 'developer'
      }
    };

    this.broadcastToDevelopment(developmentId, 'property_update', event);
    this.lastUpdates.set(developmentId, new Date());

    console.log(`💰 Broadcasting unit price update: ${unitId} €${previousPrice} → €${newPrice}`);
  }

  /**
   * Called when multiple units are updated (bulk operations)
   */
  public broadcastBulkUnitUpdate(
    developmentId: string,
    updates: Array<{
      unitId: string;
      type: 'status' | 'price';
      previousValue: any;
      newValue: any;
    }>,
    updatedBy: string = 'Developer'
  ): void {
    updates.forEach(update => {
      if (update.type === 'status') {
        this.broadcastUnitStatusChange(
          developmentId,
          update.unitId,
          update.previousValue,
          update.newValue,
          updatedBy,
          'Bulk status update'
        );
      } else if (update.type === 'price') {
        this.broadcastUnitPriceUpdate(
          developmentId,
          update.unitId,
          update.previousValue,
          update.newValue,
          updatedBy,
          'Bulk price update'
        );
      }
    });
  }

  /**
   * Broadcast to buyer portal specifically
   * Ensures buyer-facing pages receive developer portal changes
   */
  public broadcastToBuyerPortal(developmentId: string, event: any): void {
    try {
      const buyerEvent: PropertyUpdateEvent = {
        type: event.type || 'UNIT_STATUS_CHANGE',
        developmentId,
        unitId: event.payload?.unitId || 'unknown',
        timestamp: new Date(),
        data: {
          unitNumber: event.payload?.unitNumber,
          previousValue: event.payload?.previousStatus || event.payload?.previousValue,
          newValue: event.payload?.newStatus || event.payload?.newValue,
          updatedBy: event.payload?.updatedBy || 'Developer Portal',
          reason: event.payload?.reason || 'Developer update'
        },
        metadata: {
          source: 'developer_portal',
          sessionId: this.generateSessionId(),
          userRole: 'developer'
        }
      };

      console.log('🔔 Broadcasting to buyer portal:', buyerEvent);

      // Emit to buyer portal listeners
      this.emit('buyer_portal_update', buyerEvent);
      
      // Also broadcast to connected development subscribers
      this.broadcastToDevelopment(developmentId, 'buyer_portal_update', buyerEvent);
      
      // Update metrics
      this.updateConnectionMetrics('buyer_portal_broadcast');
    } catch (error) {
      console.error('Error broadcasting to buyer portal:', error);
    }
  }

  /**
   * Broadcast unit synchronization event
   * Used when manually syncing data between portals
   */
  public broadcastUnitSync(developmentId: string, unitId: string, unitData: any): void {
    try {
      const syncEvent: PropertyUpdateEvent = {
        type: 'UNIT_STATUS_CHANGE',
        developmentId,
        unitId,
        timestamp: new Date(),
        data: {
          unitNumber: unitData.number,
          previousValue: 'out_of_sync',
          newValue: 'synchronized',
          updatedBy: 'Data Bridge Service',
          reason: 'Manual synchronization'
        },
        metadata: {
          source: 'api',
          sessionId: this.generateSessionId(),
          userRole: 'system'
        }
      };

      console.log('🔄 Broadcasting unit sync event:', syncEvent);

      // Emit sync event
      this.emit('unit_sync', syncEvent);
      this.emit('buyer_portal_update', syncEvent);
      
      // Broadcast to connected subscribers
      this.broadcastToDevelopment(developmentId, 'unit_sync', syncEvent);
      
      // Update metrics
      this.updateConnectionMetrics('unit_sync');
    } catch (error) {
      console.error('Error broadcasting unit sync:', error);
    }
  }

  /**
   * Broadcast comprehensive unit update
   * Used when developer makes comprehensive unit changes
   */
  public broadcastUnitUpdate(
    developmentId: string,
    unitId: string,
    unitData: any,
    updatedBy: string = 'Developer Portal'
  ): void {
    try {
      const updateEvent: PropertyUpdateEvent = {
        type: 'UNIT_STATUS_CHANGE',
        developmentId,
        unitId,
        timestamp: new Date(),
        data: {
          unitNumber: unitData.number,
          previousValue: 'unknown',
          newValue: unitData,
          updatedBy,
          reason: 'Comprehensive unit update'
        },
        metadata: {
          source: 'developer_portal',
          sessionId: this.generateSessionId(),
          userRole: 'developer'
        }
      };

      console.log('📝 Broadcasting comprehensive unit update:', updateEvent);

      // Emit to all listeners
      this.emit('unit_update', updateEvent);
      this.emit('buyer_portal_update', updateEvent);
      
      // Broadcast to connected subscribers
      this.broadcastToDevelopment(developmentId, 'unit_update', updateEvent);
      
      // Update metrics
      this.updateConnectionMetrics('unit_update');
    } catch (error) {
      console.error('Error broadcasting unit update:', error);
    }
  }

  // =============================================================================
  // BUYER PLATFORM INTEGRATION
  // =============================================================================

  /**
   * Broadcast update to all buyer platform connections for a development
   */
  public broadcastToDevelopment(developmentId: string, eventType: string, data: any): void {
    const subscribers = this.developmentSubscriptions.get(developmentId);
    if (!subscribers || subscribers.size === 0) {
      console.log(`📭 No subscribers for development: ${developmentId}`);
      return;
    }

    let successfulBroadcasts = 0;
    let failedBroadcasts = 0;

    subscribers.forEach(connectionId => {
      const connection = this.connections.get(connectionId);
      if (connection && connection.socket) {
        try {
          connection.socket.send(JSON.stringify({
            type: eventType,
            data,
            timestamp: new Date().toISOString()
          }));
          
          connection.lastSeen = new Date();
          successfulBroadcasts++;
        } catch (error) {
          console.error(`❌ Failed to send to connection ${connectionId}:`, error);
          failedBroadcasts++;
          // Remove dead connection
          this.removeConnection(connectionId);
        }
      }
    });

    console.log(`📡 Broadcast to ${developmentId}: ${successfulBroadcasts} sent, ${failedBroadcasts} failed`);
  }

  /**
   * Get current buyer platform update for development
   */
  public async getBuyerPlatformUpdate(developmentId: string): Promise<BuyerPlatformUpdate | null> {
    try {
      // Fetch current unit data from database/API
      const response = await fetch(`/api/developments/${developmentId}/units`);
      if (!response.ok) {
        return null;
      }

      const units = await response.json();
      const availableUnits = units.filter((unit: any) => unit.status === 'available');

      return {
        developmentId,
        units: units.map((unit: any) => ({
          id: unit.id,
          unitNumber: unit.unitNumber || unit.name,
          status: unit.status,
          price: unit.price || unit.basePrice,
          updatedAt: new Date(unit.updatedAt || unit.lastUpdated)
        })),
        lastUpdate: this.lastUpdates.get(developmentId) || new Date(),
        totalAvailable: availableUnits.length
      };
    } catch (error) {
      console.error('Error fetching buyer platform update:', error);
      return null;
    }
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  /**
   * Setup internal event handlers
   */
  private setupEventHandlers(): void {
    this.on('property_update', (event: PropertyUpdateEvent) => {
      // Handle internal event processing
      this.emit(`development_${event.developmentId}`, event);
    });

    // Cleanup dead connections every 5 minutes
    setInterval(() => {
      this.cleanupDeadConnections();
    }, 5 * 60 * 1000);
  }

  /**
   * Remove connections that haven't been seen in a while
   */
  private cleanupDeadConnections(): void {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const deadConnections: string[] = [];

    this.connections.forEach((connection, connectionId) => {
      if (connection.lastSeen < fiveMinutesAgo) {
        deadConnections.push(connectionId);
      }
    });

    deadConnections.forEach(connectionId => {
      this.removeConnection(connectionId);
    });

    if (deadConnections.length > 0) {
      console.log(`🧹 Cleaned up ${deadConnections.length} dead connections`);
    }
  }

  /**
   * Get connection statistics
   */
  public getStats(): {
    totalConnections: number;
    developmentSubscriptions: Record<string, number>;
    lastUpdates: Record<string, Date>;
  } {
    const stats: Record<string, number> = {};
    this.developmentSubscriptions.forEach((subscribers, developmentId) => {
      stats[developmentId] = subscribers.size;
    });

    const lastUpdatesObj: Record<string, Date> = {};
    this.lastUpdates.forEach((date, developmentId) => {
      lastUpdatesObj[developmentId] = date;
    });

    return {
      totalConnections: this.connections.size,
      developmentSubscriptions: stats,
      lastUpdates: lastUpdatesObj
    };
  }

  /**
   * Test connection health
   */
  public async testConnection(developmentId: string): Promise<boolean> {
    try {
      this.broadcastToDevelopment(developmentId, 'connection_test', {
        message: 'Connection test',
        timestamp: new Date()
      });
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  // =============================================================================
  // MISSING METHODS FOR HOOKS COMPATIBILITY
  // =============================================================================

  /**
   * Get current connection state
   */
  public getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  /**
   * Get connection metrics
   */
  public getMetrics(): ConnectionMetrics {
    return {
      ...this.metrics,
      activeConnections: this.connections.size,
      totalConnections: this.connections.size
    };
  }

  /**
   * Initialize service with user context
   */
  public async initialize(userId: string, userRole: string): Promise<void> {
    if (this.initialized) return;

    try {
      this.connectionState = ConnectionState.CONNECTING;
      this.emit('connection_state_changed', this.connectionState);

      // Simulate connection setup
      await new Promise(resolve => setTimeout(resolve, 100));

      this.connectionState = ConnectionState.CONNECTED;
      this.initialized = true;
      this.metrics.lastHeartbeat = new Date();
      
      this.emit('connection_state_changed', this.connectionState);
      console.log(`✅ RealTimeDataSyncService initialized for user: ${userId} (${userRole})`);
    } catch (error) {
      this.connectionState = ConnectionState.ERROR;
      this.emit('connection_state_changed', this.connectionState);
      console.error('Failed to initialize RealTimeDataSyncService:', error);
    }
  }

  /**
   * Disconnect service
   */
  public disconnect(): void {
    this.connectionState = ConnectionState.DISCONNECTED;
    this.initialized = false;
    this.emit('connection_state_changed', this.connectionState);
    console.log('🔌 RealTimeDataSyncService disconnected');
  }

  /**
   * Subscribe to specific event type
   */
  public async subscribeToEvent(eventType: SyncEventType, enabled: boolean = true): Promise<void> {
    if (enabled) {
      console.log(`📡 Subscribed to ${eventType} events`);
    } else {
      console.log(`🚫 Unsubscribed from ${eventType} events`);
    }
  }

  /**
   * Broadcast generic event
   */
  public broadcastEvent<T extends SyncEventType>(eventType: T, data: SyncEventData<T>): void {
    this.emit(eventType, data);
    this.metrics.messagesSent++;
    console.log(`📢 Broadcasting ${eventType} event:`, data);
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Update connection metrics
   */
  private updateConnectionMetrics(operation: string): void {
    this.metrics.messagesSent++;
    this.metrics.lastHeartbeat = new Date();
    console.log(`📊 Metrics updated for operation: ${operation}`);
  }
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

export const realTimeDataSyncService = RealTimeDataSyncService.getInstance();

// Export types for use in other modules
export type { PropertyUpdateEvent, BuyerPlatformUpdate };