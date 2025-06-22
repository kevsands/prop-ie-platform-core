/**
 * WebSocket Connection Pool Manager
 * 
 * Advanced connection pooling for optimal real-time performance at enterprise scale
 * Manages multiple WebSocket connections, load balancing, and failover
 */

import { EventEmitter } from 'events';
import WebSocket from 'ws';

export interface ConnectionPoolConfig {
  maxConnections: number;
  minConnections: number;
  connectionTimeout: number;
  keepAliveInterval: number;
  reconnectDelay: number;
  maxReconnectAttempts: number;
  loadBalancing: 'round-robin' | 'least-connections' | 'random';
  healthCheckInterval: number;
}

export interface ConnectionStats {
  active: number;
  idle: number;
  connecting: number;
  failed: number;
  totalMessages: number;
  avgResponseTime: number;
  lastHealthCheck: number;
}

export interface PooledConnection {
  id: string;
  ws: WebSocket;
  isActive: boolean;
  lastUsed: number;
  messageCount: number;
  responseTimeSum: number;
  status: 'connecting' | 'open' | 'closing' | 'closed' | 'error';
  reconnectAttempts: number;
}

export class ConnectionPoolManager extends EventEmitter {
  private connections: Map<string, PooledConnection> = new Map();
  private availableConnections: string[] = [];
  private busyConnections: Set<string> = new Set();
  private connectionIndex = 0; // For round-robin load balancing
  
  private readonly config: ConnectionPoolConfig = {
    maxConnections: 10,
    minConnections: 2,
    connectionTimeout: 30000,
    keepAliveInterval: 30000,
    reconnectDelay: 5000,
    maxReconnectAttempts: 5,
    loadBalancing: 'round-robin',
    healthCheckInterval: 60000
  };

  private healthCheckInterval: NodeJS.Timeout;
  private keepAliveInterval: NodeJS.Timeout;

  constructor(customConfig?: Partial<ConnectionPoolConfig>) {
    super();
    
    // Merge custom config
    if (customConfig) {
      Object.assign(this.config, customConfig);
    }
    
    // Initialize minimum connections
    this.initializePool();
    
    // Start background processes
    this.startHealthChecking();
    this.startKeepAlive();
    
    console.log(`🏊 WebSocket Connection Pool initialized (${this.config.minConnections}-${this.config.maxConnections} connections)`);
  }

  /**
   * Initialize the connection pool with minimum connections
   */
  private async initializePool(): Promise<void> {
    const promises: Promise<void>[] = [];
    
    for (let i = 0; i < this.config.minConnections; i++) {
      promises.push(this.createConnection());
    }
    
    try {
      await Promise.all(promises);
      console.log(`✅ Connection pool initialized with ${this.config.minConnections} connections`);
    } catch (error) {
      console.error('Failed to initialize connection pool:', error);
    }
  }

  /**
   * Create a new WebSocket connection
   */
  private async createConnection(): Promise<void> {
    const connectionId = `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return new Promise((resolve, reject) => {
      try {
        const ws = new WebSocket('ws://localhost:3001/realtime');
        
        const connection: PooledConnection = {
          id: connectionId,
          ws,
          isActive: false,
          lastUsed: Date.now(),
          messageCount: 0,
          responseTimeSum: 0,
          status: 'connecting',
          reconnectAttempts: 0
        };
        
        // Set connection timeout
        const timeout = setTimeout(() => {
          if (connection.status === 'connecting') {
            connection.status = 'error';
            ws.terminate();
            this.connections.delete(connectionId);
            reject(new Error(`Connection timeout for ${connectionId}`));
          }
        }, this.config.connectionTimeout);
        
        ws.on('open', () => {
          clearTimeout(timeout);
          connection.status = 'open';
          connection.isActive = true;
          this.connections.set(connectionId, connection);
          this.availableConnections.push(connectionId);
          
          this.emit('connection_opened', { connectionId, totalConnections: this.connections.size });
          console.log(`🔗 WebSocket connection opened: ${connectionId}`);
          resolve();
        });
        
        ws.on('message', (data) => {
          this.handleMessage(connectionId, data);
        });
        
        ws.on('close', () => {
          clearTimeout(timeout);
          this.handleConnectionClose(connectionId);
        });
        
        ws.on('error', (error) => {
          clearTimeout(timeout);
          this.handleConnectionError(connectionId, error);
          reject(error);
        });
        
        ws.on('pong', () => {
          this.handlePong(connectionId);
        });
        
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get the next available connection using load balancing strategy
   */
  private getNextConnection(): PooledConnection | null {
    if (this.availableConnections.length === 0) {
      return null;
    }
    
    let connectionId: string;
    
    switch (this.config.loadBalancing) {
      case 'round-robin':
        connectionId = this.availableConnections[this.connectionIndex % this.availableConnections.length];
        this.connectionIndex++;
        break;
        
      case 'least-connections':
        // Find connection with least message count
        connectionId = this.availableConnections.reduce((leastBusy, current) => {
          const currentConn = this.connections.get(current);
          const leastBusyConn = this.connections.get(leastBusy);
          return (currentConn?.messageCount || 0) < (leastBusyConn?.messageCount || 0) ? current : leastBusy;
        });
        break;
        
      case 'random':
        connectionId = this.availableConnections[Math.floor(Math.random() * this.availableConnections.length)];
        break;
        
      default:
        connectionId = this.availableConnections[0];
    }
    
    const connection = this.connections.get(connectionId);
    
    if (connection && connection.status === 'open') {
      // Move from available to busy
      this.availableConnections = this.availableConnections.filter(id => id !== connectionId);
      this.busyConnections.add(connectionId);
      connection.lastUsed = Date.now();
      
      return connection;
    }
    
    return null;
  }

  /**
   * Return connection to available pool
   */
  private returnConnection(connectionId: string): void {
    if (this.busyConnections.has(connectionId)) {
      this.busyConnections.delete(connectionId);
      this.availableConnections.push(connectionId);
    }
  }

  /**
   * Send message using pooled connection
   */
  async sendMessage(message: any): Promise<boolean> {
    const connection = this.getNextConnection();
    
    if (!connection) {
      // Try to create new connection if under max limit
      if (this.connections.size < this.config.maxConnections) {
        try {
          await this.createConnection();
          return this.sendMessage(message); // Retry with new connection
        } catch (error) {
          console.error('Failed to create new connection for message:', error);
          return false;
        }
      }
      
      console.warn('No available connections in pool');
      return false;
    }
    
    try {
      const messageString = JSON.stringify(message);
      const startTime = Date.now();
      
      connection.ws.send(messageString);
      connection.messageCount++;
      
      // Track response time (simplified - in real implementation would wait for ack)
      const responseTime = Date.now() - startTime;
      connection.responseTimeSum += responseTime;
      
      this.emit('message_sent', { 
        connectionId: connection.id, 
        messageSize: messageString.length,
        responseTime 
      });
      
      // Return connection to pool
      setTimeout(() => this.returnConnection(connection.id), 100);
      
      return true;
    } catch (error) {
      console.error(`Failed to send message via connection ${connection.id}:`, error);
      this.handleConnectionError(connection.id, error);
      return false;
    }
  }

  /**
   * Broadcast message to all connections
   */
  async broadcastMessage(message: any): Promise<number> {
    const messageString = JSON.stringify(message);
    let successCount = 0;
    
    const promises = Array.from(this.connections.values())
      .filter(conn => conn.status === 'open')
      .map(async (connection) => {
        try {
          connection.ws.send(messageString);
          connection.messageCount++;
          successCount++;
          
          this.emit('broadcast_sent', { 
            connectionId: connection.id,
            messageSize: messageString.length 
          });
        } catch (error) {
          console.error(`Broadcast failed for connection ${connection.id}:`, error);
          this.handleConnectionError(connection.id, error);
        }
      });
    
    await Promise.allSettled(promises);
    
    this.emit('broadcast_completed', { 
      totalConnections: this.connections.size,
      successCount,
      failureCount: this.connections.size - successCount
    });
    
    return successCount;
  }

  /**
   * Handle incoming message from connection
   */
  private handleMessage(connectionId: string, data: WebSocket.Data): void {
    try {
      const message = JSON.parse(data.toString());
      this.emit('message_received', { connectionId, message });
    } catch (error) {
      console.error(`Failed to parse message from connection ${connectionId}:`, error);
    }
  }

  /**
   * Handle connection close
   */
  private handleConnectionClose(connectionId: string): void {
    const connection = this.connections.get(connectionId);
    if (connection) {
      connection.status = 'closed';
      connection.isActive = false;
      
      // Remove from available/busy pools
      this.availableConnections = this.availableConnections.filter(id => id !== connectionId);
      this.busyConnections.delete(connectionId);
      
      this.emit('connection_closed', { connectionId, totalConnections: this.connections.size });
      console.log(`🔌 WebSocket connection closed: ${connectionId}`);
      
      // Auto-reconnect if below minimum connections
      if (this.connections.size < this.config.minConnections) {
        this.reconnectConnection(connectionId);
      }
    }
  }

  /**
   * Handle connection error
   */
  private handleConnectionError(connectionId: string, error: any): void {
    const connection = this.connections.get(connectionId);
    if (connection) {
      connection.status = 'error';
      connection.isActive = false;
      
      // Remove from pools
      this.availableConnections = this.availableConnections.filter(id => id !== connectionId);
      this.busyConnections.delete(connectionId);
      
      this.emit('connection_error', { connectionId, error, totalConnections: this.connections.size });
      console.error(`❌ WebSocket connection error: ${connectionId}`, error);
      
      // Schedule reconnect
      this.reconnectConnection(connectionId);
    }
  }

  /**
   * Handle pong response (keep-alive)
   */
  private handlePong(connectionId: string): void {
    const connection = this.connections.get(connectionId);
    if (connection) {
      connection.lastUsed = Date.now();
      this.emit('pong_received', { connectionId });
    }
  }

  /**
   * Reconnect a failed connection
   */
  private async reconnectConnection(connectionId: string): Promise<void> {
    const connection = this.connections.get(connectionId);
    if (!connection || connection.reconnectAttempts >= this.config.maxReconnectAttempts) {
      if (connection) {
        this.connections.delete(connectionId);
        console.log(`🚫 Max reconnection attempts reached for ${connectionId}`);
      }
      return;
    }
    
    connection.reconnectAttempts++;
    
    setTimeout(async () => {
      try {
        console.log(`🔄 Reconnecting ${connectionId} (attempt ${connection.reconnectAttempts})`);
        
        // Remove old connection
        this.connections.delete(connectionId);
        
        // Create new connection
        await this.createConnection();
        
        this.emit('connection_reconnected', { 
          oldConnectionId: connectionId,
          attempts: connection.reconnectAttempts 
        });
      } catch (error) {
        console.error(`Reconnection failed for ${connectionId}:`, error);
        this.reconnectConnection(connectionId); // Retry
      }
    }, this.config.reconnectDelay * connection.reconnectAttempts); // Exponential backoff
  }

  /**
   * Start health checking background process
   */
  private startHealthChecking(): void {
    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck();
    }, this.config.healthCheckInterval);
  }

  /**
   * Start keep-alive background process
   */
  private startKeepAlive(): void {
    this.keepAliveInterval = setInterval(() => {
      this.sendKeepAlive();
    }, this.config.keepAliveInterval);
  }

  /**
   * Perform health check on all connections
   */
  private performHealthCheck(): void {
    const now = Date.now();
    let healthyConnections = 0;
    
    for (const [connectionId, connection] of this.connections.entries()) {
      if (connection.status === 'open' && connection.isActive) {
        healthyConnections++;
      } else if (connection.status === 'error' || connection.status === 'closed') {
        // Remove dead connections
        this.connections.delete(connectionId);
        this.availableConnections = this.availableConnections.filter(id => id !== connectionId);
        this.busyConnections.delete(connectionId);
      }
    }
    
    // Ensure minimum connections
    const connectionsNeeded = this.config.minConnections - healthyConnections;
    if (connectionsNeeded > 0) {
      console.log(`🏥 Health check: Creating ${connectionsNeeded} new connections`);
      for (let i = 0; i < connectionsNeeded; i++) {
        this.createConnection().catch(error => {
          console.error('Health check connection creation failed:', error);
        });
      }
    }
    
    this.emit('health_check_completed', {
      totalConnections: this.connections.size,
      healthyConnections,
      timestamp: now
    });
  }

  /**
   * Send keep-alive ping to all connections
   */
  private sendKeepAlive(): void {
    for (const connection of this.connections.values()) {
      if (connection.status === 'open' && connection.ws.readyState === WebSocket.OPEN) {
        try {
          connection.ws.ping();
        } catch (error) {
          console.error(`Keep-alive ping failed for ${connection.id}:`, error);
          this.handleConnectionError(connection.id, error);
        }
      }
    }
    
    this.emit('keep_alive_sent', { connectionCount: this.connections.size });
  }

  /**
   * Get comprehensive connection pool statistics
   */
  getStats(): ConnectionStats {
    const connections = Array.from(this.connections.values());
    const activeConnections = connections.filter(c => c.status === 'open' && c.isActive);
    const totalMessages = connections.reduce((sum, c) => sum + c.messageCount, 0);
    const totalResponseTime = connections.reduce((sum, c) => sum + c.responseTimeSum, 0);
    
    return {
      active: activeConnections.length,
      idle: this.availableConnections.length,
      connecting: connections.filter(c => c.status === 'connecting').length,
      failed: connections.filter(c => c.status === 'error' || c.status === 'closed').length,
      totalMessages,
      avgResponseTime: totalMessages > 0 ? totalResponseTime / totalMessages : 0,
      lastHealthCheck: Date.now()
    };
  }

  /**
   * Gracefully shutdown the connection pool
   */
  async shutdown(): Promise<void> {
    console.log('🛑 Shutting down WebSocket connection pool...');
    
    // Clear intervals
    if (this.healthCheckInterval) clearInterval(this.healthCheckInterval);
    if (this.keepAliveInterval) clearInterval(this.keepAliveInterval);
    
    // Close all connections
    const closePromises = Array.from(this.connections.values()).map(connection => {
      return new Promise<void>((resolve) => {
        if (connection.ws.readyState === WebSocket.OPEN) {
          connection.ws.close(1000, 'Server shutdown');
          connection.ws.once('close', () => resolve());
        } else {
          resolve();
        }
      });
    });
    
    await Promise.allSettled(closePromises);
    
    // Clear data structures
    this.connections.clear();
    this.availableConnections.length = 0;
    this.busyConnections.clear();
    
    this.emit('pool_shutdown');
    console.log('✅ WebSocket connection pool shutdown complete');
  }
}

// Export singleton instance
export const connectionPoolManager = new ConnectionPoolManager();