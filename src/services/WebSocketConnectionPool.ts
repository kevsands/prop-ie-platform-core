/**
 * ================================================================================
 * WEBSOCKET CONNECTION POOLING SERVICE
 * Advanced connection pooling for extreme scale scenarios
 * ================================================================================
 */

import EventEmitter from 'events';
import { WebSocket } from 'ws';

// Connection pool configuration
export interface ConnectionPoolConfig {
  maxConnections: number;
  maxConnectionsPerUser: number;
  connectionTimeout: number;
  heartbeatInterval: number;
  retryAttempts: number;
  retryDelay: number;
  clustering: boolean;
  loadBalancing: 'round_robin' | 'least_connections' | 'weighted';
  metrics: boolean;
}

// Connection metadata
interface PooledConnection {
  id: string;
  ws: WebSocket;
  userId?: string;
  ipAddress: string;
  connectedAt: Date;
  lastActivity: Date;
  subscriptions: Set<string>;
  messagesSent: number;
  messagesReceived: number;
  isHealthy: boolean;
  poolId?: string;
}

// Pool statistics
interface PoolMetrics {
  totalConnections: number;
  activeConnections: number;
  connectionsPerSecond: number;
  messagesPerSecond: number;
  averageLatency: number;
  connectionUptime: number;
  errorRate: number;
  poolUtilization: number;
}

// Load balancer interface
interface LoadBalancer {
  selectPool(pools: ConnectionPool[]): ConnectionPool;
  updateMetrics(poolId: string, metrics: PoolMetrics): void;
}

/**
 * Round Robin Load Balancer
 */
class RoundRobinBalancer implements LoadBalancer {
  private currentIndex = 0;

  selectPool(pools: ConnectionPool[]): ConnectionPool {
    if (pools.length === 0) {
      throw new Error('No connection pools available');
    }
    
    const pool = pools[this.currentIndex % pools.length];
    this.currentIndex = (this.currentIndex + 1) % pools.length;
    return pool;
  }

  updateMetrics(poolId: string, metrics: PoolMetrics): void {
    // Round robin doesn't use metrics for selection
  }
}

/**
 * Least Connections Load Balancer
 */
class LeastConnectionsBalancer implements LoadBalancer {
  private poolMetrics = new Map<string, PoolMetrics>();

  selectPool(pools: ConnectionPool[]): ConnectionPool {
    if (pools.length === 0) {
      throw new Error('No connection pools available');
    }

    let selectedPool = pools[0];
    let minConnections = this.poolMetrics.get(pools[0].getId())?.activeConnections || 0;

    for (const pool of pools) {
      const connections = this.poolMetrics.get(pool.getId())?.activeConnections || 0;
      if (connections < minConnections) {
        minConnections = connections;
        selectedPool = pool;
      }
    }

    return selectedPool;
  }

  updateMetrics(poolId: string, metrics: PoolMetrics): void {
    this.poolMetrics.set(poolId, metrics);
  }
}

/**
 * Weighted Load Balancer
 */
class WeightedBalancer implements LoadBalancer {
  private poolMetrics = new Map<string, PoolMetrics>();
  private weights = new Map<string, number>();

  constructor(weights: Map<string, number> = new Map()) {
    this.weights = weights;
  }

  selectPool(pools: ConnectionPool[]): ConnectionPool {
    if (pools.length === 0) {
      throw new Error('No connection pools available');
    }

    // Calculate weighted scores based on utilization and latency
    let bestPool = pools[0];
    let bestScore = this.calculateScore(pools[0]);

    for (const pool of pools) {
      const score = this.calculateScore(pool);
      if (score > bestScore) {
        bestScore = score;
        bestPool = pool;
      }
    }

    return bestPool;
  }

  private calculateScore(pool: ConnectionPool): number {
    const poolId = pool.getId();
    const metrics = this.poolMetrics.get(poolId);
    const weight = this.weights.get(poolId) || 1;

    if (!metrics) return weight;

    // Higher score is better
    const utilizationScore = (100 - metrics.poolUtilization) / 100;
    const latencyScore = Math.max(0, (1000 - metrics.averageLatency) / 1000);
    const errorScore = Math.max(0, (100 - metrics.errorRate) / 100);

    return weight * (utilizationScore * 0.4 + latencyScore * 0.3 + errorScore * 0.3);
  }

  updateMetrics(poolId: string, metrics: PoolMetrics): void {
    this.poolMetrics.set(poolId, metrics);
  }

  setWeight(poolId: string, weight: number): void {
    this.weights.set(poolId, weight);
  }
}

/**
 * Individual Connection Pool
 */
export class ConnectionPool extends EventEmitter {
  private connections = new Map<string, PooledConnection>();
  private userConnections = new Map<string, Set<string>>();
  private metrics: PoolMetrics;
  private heartbeatTimer?: NodeJS.Timeout;
  private metricsTimer?: NodeJS.Timeout;
  private isShuttingDown = false;

  constructor(
    private readonly poolId: string,
    private readonly config: ConnectionPoolConfig
  ) {
    super();
    
    this.metrics = {
      totalConnections: 0,
      activeConnections: 0,
      connectionsPerSecond: 0,
      messagesPerSecond: 0,
      averageLatency: 0,
      connectionUptime: 0,
      errorRate: 0,
      poolUtilization: 0
    };

    this.startHeartbeat();
    this.startMetricsCollection();
  }

  getId(): string {
    return this.poolId;
  }

  /**
   * Add connection to pool
   */
  addConnection(ws: WebSocket, userId?: string, ipAddress?: string): string {
    if (this.isShuttingDown) {
      throw new Error('Pool is shutting down');
    }

    if (this.connections.size >= this.config.maxConnections) {
      throw new Error('Connection pool at maximum capacity');
    }

    if (userId) {
      const userConns = this.userConnections.get(userId) || new Set();
      if (userConns.size >= this.config.maxConnectionsPerUser) {
        throw new Error('User has reached maximum connection limit');
      }
    }

    const connectionId = this.generateConnectionId();
    const connection: PooledConnection = {
      id: connectionId,
      ws,
      userId,
      ipAddress: ipAddress || 'unknown',
      connectedAt: new Date(),
      lastActivity: new Date(),
      subscriptions: new Set(),
      messagesSent: 0,
      messagesReceived: 0,
      isHealthy: true,
      poolId: this.poolId
    };

    this.connections.set(connectionId, connection);
    
    if (userId) {
      const userConns = this.userConnections.get(userId) || new Set();
      userConns.add(connectionId);
      this.userConnections.set(userId, userConns);
    }

    this.setupConnectionHandlers(connection);
    this.updateMetrics();

    this.emit('connectionAdded', connection);
    return connectionId;
  }

  /**
   * Remove connection from pool
   */
  removeConnection(connectionId: string): boolean {
    const connection = this.connections.get(connectionId);
    if (!connection) return false;

    // Clean up user connections tracking
    if (connection.userId) {
      const userConns = this.userConnections.get(connection.userId);
      if (userConns) {
        userConns.delete(connectionId);
        if (userConns.size === 0) {
          this.userConnections.delete(connection.userId);
        }
      }
    }

    // Close WebSocket if still open
    if (connection.ws.readyState === WebSocket.OPEN) {
      connection.ws.close();
    }

    this.connections.delete(connectionId);
    this.updateMetrics();

    this.emit('connectionRemoved', connection);
    return true;
  }

  /**
   * Get connection by ID
   */
  getConnection(connectionId: string): PooledConnection | undefined {
    return this.connections.get(connectionId);
  }

  /**
   * Get all connections for a user
   */
  getUserConnections(userId: string): PooledConnection[] {
    const connectionIds = this.userConnections.get(userId) || new Set();
    return Array.from(connectionIds)
      .map(id => this.connections.get(id))
      .filter(Boolean) as PooledConnection[];
  }

  /**
   * Broadcast message to all connections
   */
  broadcast(message: string | Buffer, filter?: (conn: PooledConnection) => boolean): number {
    let sentCount = 0;

    for (const connection of this.connections.values()) {
      if (filter && !filter(connection)) continue;
      if (connection.ws.readyState === WebSocket.OPEN) {
        try {
          connection.ws.send(message);
          connection.messagesSent++;
          connection.lastActivity = new Date();
          sentCount++;
        } catch (error) {
          console.error(`Failed to send message to connection ${connection.id}:`, error);
          this.markConnectionUnhealthy(connection.id);
        }
      }
    }

    return sentCount;
  }

  /**
   * Send message to specific connection
   */
  sendToConnection(connectionId: string, message: string | Buffer): boolean {
    const connection = this.connections.get(connectionId);
    if (!connection || connection.ws.readyState !== WebSocket.OPEN) {
      return false;
    }

    try {
      connection.ws.send(message);
      connection.messagesSent++;
      connection.lastActivity = new Date();
      return true;
    } catch (error) {
      console.error(`Failed to send message to connection ${connectionId}:`, error);
      this.markConnectionUnhealthy(connectionId);
      return false;
    }
  }

  /**
   * Get pool metrics
   */
  getMetrics(): PoolMetrics {
    return { ...this.metrics };
  }

  /**
   * Get pool status
   */
  getStatus() {
    return {
      poolId: this.poolId,
      connections: this.connections.size,
      maxConnections: this.config.maxConnections,
      utilization: (this.connections.size / this.config.maxConnections) * 100,
      healthyConnections: Array.from(this.connections.values()).filter(c => c.isHealthy).length,
      metrics: this.metrics,
      isShuttingDown: this.isShuttingDown
    };
  }

  /**
   * Graceful shutdown
   */
  async shutdown(): Promise<void> {
    this.isShuttingDown = true;

    // Stop timers
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }
    if (this.metricsTimer) {
      clearInterval(this.metricsTimer);
    }

    // Close all connections
    const closePromises = Array.from(this.connections.values()).map(connection => {
      return new Promise<void>((resolve) => {
        if (connection.ws.readyState === WebSocket.OPEN) {
          connection.ws.once('close', () => resolve());
          connection.ws.close();
        } else {
          resolve();
        }
      });
    });

    await Promise.all(closePromises);
    this.connections.clear();
    this.userConnections.clear();

    this.emit('shutdown');
  }

  private generateConnectionId(): string {
    return `${this.poolId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupConnectionHandlers(connection: PooledConnection): void {
    connection.ws.on('message', (data) => {
      connection.messagesReceived++;
      connection.lastActivity = new Date();
      this.emit('message', connection, data);
    });

    connection.ws.on('close', () => {
      this.removeConnection(connection.id);
    });

    connection.ws.on('error', (error) => {
      console.error(`WebSocket error for connection ${connection.id}:`, error);
      this.markConnectionUnhealthy(connection.id);
    });

    connection.ws.on('pong', () => {
      connection.lastActivity = new Date();
      connection.isHealthy = true;
    });
  }

  private markConnectionUnhealthy(connectionId: string): void {
    const connection = this.connections.get(connectionId);
    if (connection) {
      connection.isHealthy = false;
      this.emit('connectionUnhealthy', connection);
    }
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      this.performHeartbeat();
    }, this.config.heartbeatInterval);
  }

  private performHeartbeat(): void {
    const now = new Date();
    const unhealthyConnections: string[] = [];

    for (const connection of this.connections.values()) {
      if (connection.ws.readyState === WebSocket.OPEN) {
        // Send ping
        try {
          connection.ws.ping();
        } catch (error) {
          unhealthyConnections.push(connection.id);
        }
      } else {
        unhealthyConnections.push(connection.id);
      }
    }

    // Remove unhealthy connections
    unhealthyConnections.forEach(id => this.removeConnection(id));
  }

  private startMetricsCollection(): void {
    this.metricsTimer = setInterval(() => {
      this.updateMetrics();
    }, 10000); // Update every 10 seconds
  }

  private updateMetrics(): void {
    const now = Date.now();
    const connections = Array.from(this.connections.values());

    this.metrics = {
      totalConnections: this.connections.size,
      activeConnections: connections.filter(c => c.isHealthy).length,
      connectionsPerSecond: this.calculateConnectionsPerSecond(),
      messagesPerSecond: this.calculateMessagesPerSecond(connections),
      averageLatency: this.calculateAverageLatency(connections),
      connectionUptime: this.calculateAverageUptime(connections, now),
      errorRate: this.calculateErrorRate(connections),
      poolUtilization: (this.connections.size / this.config.maxConnections) * 100
    };

    this.emit('metricsUpdated', this.metrics);
  }

  private calculateConnectionsPerSecond(): number {
    // This would be calculated based on recent connection history
    // For now, returning a simplified calculation
    return 0;
  }

  private calculateMessagesPerSecond(connections: PooledConnection[]): number {
    const totalMessages = connections.reduce((sum, conn) => 
      sum + conn.messagesSent + conn.messagesReceived, 0);
    // This would be calculated over a time window
    return totalMessages / 60; // Rough estimate over 1 minute
  }

  private calculateAverageLatency(connections: PooledConnection[]): number {
    // This would require actual latency measurements
    // For now, returning a placeholder
    return 50; // ms
  }

  private calculateAverageUptime(connections: PooledConnection[], now: number): number {
    if (connections.length === 0) return 0;
    
    const totalUptime = connections.reduce((sum, conn) => 
      sum + (now - conn.connectedAt.getTime()), 0);
    
    return totalUptime / connections.length / 1000; // seconds
  }

  private calculateErrorRate(connections: PooledConnection[]): number {
    const unhealthyCount = connections.filter(c => !c.isHealthy).length;
    return connections.length > 0 ? (unhealthyCount / connections.length) * 100 : 0;
  }
}

/**
 * WebSocket Connection Pool Manager
 */
export class WebSocketPoolManager extends EventEmitter {
  private pools = new Map<string, ConnectionPool>();
  private loadBalancer: LoadBalancer;
  private config: ConnectionPoolConfig;

  constructor(config: Partial<ConnectionPoolConfig> = {}) {
    super();
    
    this.config = {
      maxConnections: 1000,
      maxConnectionsPerUser: 10,
      connectionTimeout: 30000,
      heartbeatInterval: 30000,
      retryAttempts: 3,
      retryDelay: 1000,
      clustering: true,
      loadBalancing: 'least_connections',
      metrics: true,
      ...config
    };

    this.loadBalancer = this.createLoadBalancer();
  }

  /**
   * Create new connection pool
   */
  createPool(poolId: string, config?: Partial<ConnectionPoolConfig>): ConnectionPool {
    const poolConfig = { ...this.config, ...config };
    const pool = new ConnectionPool(poolId, poolConfig);
    
    this.pools.set(poolId, pool);
    
    // Forward pool events
    pool.on('connectionAdded', (connection) => {
      this.emit('connectionAdded', poolId, connection);
    });
    
    pool.on('connectionRemoved', (connection) => {
      this.emit('connectionRemoved', poolId, connection);
    });
    
    pool.on('metricsUpdated', (metrics) => {
      this.loadBalancer.updateMetrics(poolId, metrics);
      this.emit('metricsUpdated', poolId, metrics);
    });

    return pool;
  }

  /**
   * Add connection using load balancing
   */
  addConnection(ws: WebSocket, userId?: string, ipAddress?: string): {
    poolId: string;
    connectionId: string;
  } {
    const availablePools = Array.from(this.pools.values())
      .filter(pool => !pool.getStatus().isShuttingDown);

    if (availablePools.length === 0) {
      throw new Error('No available connection pools');
    }

    const selectedPool = this.loadBalancer.selectPool(availablePools);
    const connectionId = selectedPool.addConnection(ws, userId, ipAddress);

    return {
      poolId: selectedPool.getId(),
      connectionId
    };
  }

  /**
   * Get connection pool by ID
   */
  getPool(poolId: string): ConnectionPool | undefined {
    return this.pools.get(poolId);
  }

  /**
   * Get all pools
   */
  getAllPools(): ConnectionPool[] {
    return Array.from(this.pools.values());
  }

  /**
   * Broadcast to all pools
   */
  broadcastToAll(message: string | Buffer, filter?: (conn: PooledConnection) => boolean): number {
    let totalSent = 0;
    for (const pool of this.pools.values()) {
      totalSent += pool.broadcast(message, filter);
    }
    return totalSent;
  }

  /**
   * Get aggregated metrics
   */
  getAggregatedMetrics(): PoolMetrics & { poolCount: number } {
    const pools = Array.from(this.pools.values());
    const allMetrics = pools.map(pool => pool.getMetrics());

    const aggregated = allMetrics.reduce((acc, metrics) => ({
      totalConnections: acc.totalConnections + metrics.totalConnections,
      activeConnections: acc.activeConnections + metrics.activeConnections,
      connectionsPerSecond: acc.connectionsPerSecond + metrics.connectionsPerSecond,
      messagesPerSecond: acc.messagesPerSecond + metrics.messagesPerSecond,
      averageLatency: (acc.averageLatency + metrics.averageLatency) / 2,
      connectionUptime: (acc.connectionUptime + metrics.connectionUptime) / 2,
      errorRate: (acc.errorRate + metrics.errorRate) / 2,
      poolUtilization: (acc.poolUtilization + metrics.poolUtilization) / 2
    }), {
      totalConnections: 0,
      activeConnections: 0,
      connectionsPerSecond: 0,
      messagesPerSecond: 0,
      averageLatency: 0,
      connectionUptime: 0,
      errorRate: 0,
      poolUtilization: 0
    });

    return {
      ...aggregated,
      poolCount: pools.length
    };
  }

  /**
   * Graceful shutdown of all pools
   */
  async shutdown(): Promise<void> {
    const shutdownPromises = Array.from(this.pools.values())
      .map(pool => pool.shutdown());

    await Promise.all(shutdownPromises);
    this.pools.clear();
    this.emit('shutdown');
  }

  private createLoadBalancer(): LoadBalancer {
    switch (this.config.loadBalancing) {
      case 'round_robin':
        return new RoundRobinBalancer();
      case 'weighted':
        return new WeightedBalancer();
      case 'least_connections':
      default:
        return new LeastConnectionsBalancer();
    }
  }
}

// Export default instance
export const webSocketPoolManager = new WebSocketPoolManager({
  maxConnections: 2000,
  maxConnectionsPerUser: 5,
  connectionTimeout: 60000,
  heartbeatInterval: 30000,
  loadBalancing: 'least_connections',
  clustering: true,
  metrics: true
});