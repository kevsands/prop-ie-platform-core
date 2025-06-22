/**
 * Real-Time WebSocket Server
 * 
 * Provides actual WebSocket server implementation for real-time data synchronization
 * Integrates with database operations and existing RealTimeDataSyncService
 */

import { WebSocket, WebSocketServer } from 'ws';
import { Database } from 'sqlite3';
import { EventEmitter } from 'events';
import http from 'http';
import url from 'url';

export interface WebSocketClient {
  ws: WebSocket;
  userId: string;
  userRole: string;
  subscriptions: Set<string>;
  lastPing: Date;
  isAuthenticated: boolean;
  connectionId: string;
}

export interface BroadcastMessage {
  type: string;
  eventType?: string;
  data: any;
  timestamp: number;
  targetUsers?: string[];
  targetRoles?: string[];
}

export class RealTimeWebSocketServer extends EventEmitter {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, WebSocketClient> = new Map();
  private db: Database;
  private server: http.Server | null = null;
  private port: number = 3001;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    
    // Initialize database connection
    const dbPath = process.env.NODE_ENV === 'production' 
      ? '/app/database/propie_production.db'
      : './database/propie_development.db';
    this.db = new Database(dbPath);
    
    this.setupDatabaseEventListeners();
  }

  /**
   * Start the WebSocket server
   */
  async start(): Promise<void> {
    try {
      // Create HTTP server
      this.server = http.createServer();
      
      // Create WebSocket server
      this.wss = new WebSocketServer({
        server: this.server,
        path: '/realtime'
      });

      this.setupWebSocketServer();
      this.startHeartbeat();

      // Start listening
      await new Promise<void>((resolve, reject) => {
        this.server!.listen(this.port, (err?: Error) => {
          if (err) {
            reject(err);
          } else {
            console.log(`✅ WebSocket server started on ws://localhost:${this.port}/realtime`);
            resolve();
          }
        });
      });

    } catch (error) {
      console.error('Failed to start WebSocket server:', error);
      throw error;
    }
  }

  /**
   * Stop the WebSocket server
   */
  async stop(): Promise<void> {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    // Close all client connections
    this.clients.forEach(client => {
      client.ws.close(1000, 'Server shutdown');
    });
    this.clients.clear();

    // Close WebSocket server
    if (this.wss) {
      this.wss.close();
    }

    // Close HTTP server
    if (this.server) {
      await new Promise<void>((resolve) => {
        this.server!.close(() => resolve());
      });
    }

    console.log('WebSocket server stopped');
  }

  /**
   * Setup WebSocket server event handlers
   */
  private setupWebSocketServer(): void {
    if (!this.wss) return;

    this.wss.on('connection', (ws: WebSocket, request: http.IncomingMessage) => {
      this.handleNewConnection(ws, request);
    });

    this.wss.on('error', (error: Error) => {
      console.error('WebSocket server error:', error);
      this.emit('error', error);
    });
  }

  /**
   * Handle new WebSocket connection
   */
  private handleNewConnection(ws: WebSocket, request: http.IncomingMessage): void {
    const connectionId = this.generateConnectionId();
    const parsedUrl = url.parse(request.url || '', true);
    const { userId, userRole } = parsedUrl.query;

    // Create client object
    const client: WebSocketClient = {
      ws,
      userId: userId as string || '',
      userRole: userRole as string || '',
      subscriptions: new Set(),
      lastPing: new Date(),
      isAuthenticated: false,
      connectionId
    };

    // Store client
    this.clients.set(connectionId, client);

    console.log(`New WebSocket connection: ${connectionId} (User: ${client.userId}, Role: ${client.userRole})`);

    // Setup client event handlers
    this.setupClientHandlers(client);
  }

  /**
   * Setup individual client event handlers
   */
  private setupClientHandlers(client: WebSocketClient): void {
    client.ws.on('message', (data: Buffer) => {
      this.handleClientMessage(client, data.toString());
    });

    client.ws.on('close', (code: number, reason: Buffer) => {
      console.log(`Client disconnected: ${client.connectionId} (${code}: ${reason.toString()})`);
      this.clients.delete(client.connectionId);
    });

    client.ws.on('error', (error: Error) => {
      console.error(`Client error ${client.connectionId}:`, error);
      this.clients.delete(client.connectionId);
    });

    client.ws.on('pong', () => {
      client.lastPing = new Date();
    });
  }

  /**
   * Handle incoming client messages
   */
  private handleClientMessage(client: WebSocketClient, message: string): void {
    try {
      const data = JSON.parse(message);

      switch (data.type) {
        case 'authenticate':
          this.handleAuthentication(client, data);
          break;
        case 'subscribe':
          this.handleSubscription(client, data.events || []);
          break;
        case 'unsubscribe':
          this.handleUnsubscription(client, data.events || []);
          break;
        case 'ping':
          this.handlePing(client, data.timestamp);
          break;
        case 'broadcast':
          this.handleBroadcast(client, data);
          break;
        default:
          console.warn(`Unknown message type: ${data.type}`);
      }
    } catch (error) {
      console.error('Error parsing client message:', error);
      this.sendToClient(client, {
        type: 'error',
        message: 'Invalid message format'
      });
    }
  }

  /**
   * Handle client authentication
   */
  private async handleAuthentication(client: WebSocketClient, data: any): Promise<void> {
    try {
      // Basic authentication - in production, validate JWT token
      if (data.userId && data.userRole) {
        client.userId = data.userId;
        client.userRole = data.userRole;
        client.isAuthenticated = true;

        this.sendToClient(client, {
          type: 'auth_success',
          userId: client.userId,
          userRole: client.userRole
        });

        console.log(`Client authenticated: ${client.connectionId} (${client.userId})`);
      } else {
        this.sendToClient(client, {
          type: 'auth_error',
          error: 'Invalid credentials'
        });
      }
    } catch (error) {
      console.error('Authentication error:', error);
      this.sendToClient(client, {
        type: 'auth_error',
        error: 'Authentication failed'
      });
    }
  }

  /**
   * Handle client subscription
   */
  private handleSubscription(client: WebSocketClient, events: string[]): void {
    if (!client.isAuthenticated) {
      this.sendToClient(client, {
        type: 'auth_error',
        error: 'Authentication required'
      });
      return;
    }

    events.forEach(event => {
      client.subscriptions.add(event);
    });

    this.sendToClient(client, {
      type: 'subscription_confirmed',
      events: Array.from(client.subscriptions)
    });

    console.log(`Client ${client.connectionId} subscribed to:`, events);
  }

  /**
   * Handle client unsubscription
   */
  private handleUnsubscription(client: WebSocketClient, events: string[]): void {
    events.forEach(event => {
      client.subscriptions.delete(event);
    });

    this.sendToClient(client, {
      type: 'unsubscription_confirmed',
      events
    });
  }

  /**
   * Handle ping from client
   */
  private handlePing(client: WebSocketClient, timestamp: number): void {
    client.lastPing = new Date();
    this.sendToClient(client, {
      type: 'pong',
      timestamp
    });
  }

  /**
   * Handle broadcast message from client
   */
  private handleBroadcast(client: WebSocketClient, data: any): void {
    if (!client.isAuthenticated) return;

    // Broadcast to other clients
    this.broadcast({
      type: data.eventType,
      eventType: data.eventType,
      data: data.data,
      timestamp: Date.now(),
      targetUsers: data.targetUsers,
      targetRoles: data.targetRoles
    }, client.connectionId);
  }

  /**
   * Send message to specific client
   */
  private sendToClient(client: WebSocketClient, message: any): void {
    if (client.ws.readyState === WebSocket.OPEN) {
      try {
        client.ws.send(JSON.stringify(message));
      } catch (error) {
        console.error(`Error sending message to client ${client.connectionId}:`, error);
      }
    }
  }

  /**
   * Broadcast message to all or filtered clients
   */
  public broadcast(message: BroadcastMessage, excludeConnectionId?: string): void {
    const messageData = {
      ...message,
      timestamp: message.timestamp || Date.now()
    };

    this.clients.forEach((client, connectionId) => {
      // Skip excluded connection
      if (excludeConnectionId && connectionId === excludeConnectionId) return;
      
      // Check if client is authenticated
      if (!client.isAuthenticated) return;

      // Check subscription
      if (message.eventType && !client.subscriptions.has(message.eventType)) return;

      // Check user targeting
      if (message.targetUsers && !message.targetUsers.includes(client.userId)) return;

      // Check role targeting
      if (message.targetRoles && !message.targetRoles.includes(client.userRole)) return;

      this.sendToClient(client, messageData);
    });
  }

  /**
   * Broadcast to specific users
   */
  public broadcastToUsers(userIds: string[], eventType: string, data: any): void {
    this.broadcast({
      type: eventType,
      eventType,
      data,
      timestamp: Date.now(),
      targetUsers: userIds
    });
  }

  /**
   * Broadcast to specific roles
   */
  public broadcastToRoles(roles: string[], eventType: string, data: any): void {
    this.broadcast({
      type: eventType,
      eventType,
      data,
      timestamp: Date.now(),
      targetRoles: roles
    });
  }

  /**
   * Setup database event listeners for real-time updates
   */
  private setupDatabaseEventListeners(): void {
    // In a real implementation, you'd use database triggers or change streams
    // For SQLite, we'll implement manual event triggering from service methods
    
    // Listen for task updates
    this.on('task_updated', (taskData) => {
      this.broadcastTaskUpdate(taskData);
    });

    // Listen for property updates
    this.on('property_updated', (propertyData) => {
      this.broadcastPropertyUpdate(propertyData);
    });

    // Listen for HTB updates
    this.on('htb_updated', (htbData) => {
      this.broadcastHTBUpdate(htbData);
    });

    // Listen for role assignment updates
    this.on('role_assigned', (roleData) => {
      this.broadcastRoleUpdate(roleData);
    });
  }

  /**
   * Broadcast task update
   */
  private broadcastTaskUpdate(taskData: any): void {
    const message = {
      type: 'task_update',
      eventType: 'task_update',
      data: {
        taskId: taskData.id,
        status: taskData.status,
        assignedTo: taskData.assigned_to,
        updatedBy: taskData.updated_by || 'system',
        milestone: taskData.milestone,
        timestamp: new Date().toISOString()
      },
      timestamp: Date.now()
    };

    // Broadcast to assigned user and relevant stakeholders
    if (taskData.assigned_to) {
      this.broadcastToUsers([taskData.assigned_to], 'task_update', message.data);
    }

    // Broadcast to users with task viewing permissions
    this.broadcastToRoles(['ADMIN', 'PROJECT_MANAGER', 'DEVELOPER'], 'task_update', message.data);
  }

  /**
   * Broadcast property update
   */
  private broadcastPropertyUpdate(propertyData: any): void {
    const message = {
      type: 'property_update',
      eventType: 'property_update',
      data: {
        propertyId: propertyData.id,
        updatedData: propertyData,
        updatedBy: propertyData.updated_by || 'system',
        timestamp: new Date().toISOString()
      },
      timestamp: Date.now()
    };

    // Broadcast to buyers, agents, and developers
    this.broadcastToRoles(['BUYER', 'ESTATE_AGENT', 'DEVELOPER', 'ADMIN'], 'property_update', message.data);
  }

  /**
   * Broadcast HTB update
   */
  private broadcastHTBUpdate(htbData: any): void {
    const message = {
      type: 'htb_status_change',
      eventType: 'htb_status_change',
      data: {
        applicationId: htbData.claimId,
        newStatus: htbData.status,
        buyerId: htbData.buyerId,
        propertyId: htbData.propertyId,
        updatedBy: htbData.updated_by || 'system',
        timestamp: new Date().toISOString()
      },
      timestamp: Date.now()
    };

    // Broadcast to buyer and relevant professionals
    const targetUsers = [htbData.buyerId];
    this.broadcastToUsers(targetUsers, 'htb_status_change', message.data);
    this.broadcastToRoles(['BUYER_SOLICITOR', 'BUYER_MORTGAGE_BROKER', 'ADMIN'], 'htb_status_change', message.data);
  }

  /**
   * Broadcast role assignment update
   */
  private broadcastRoleUpdate(roleData: any): void {
    const message = {
      type: 'role_assignment_update',
      eventType: 'notification',
      data: {
        notificationId: `role_${Date.now()}`,
        userId: roleData.userId,
        type: 'role_assignment',
        title: 'Role Assignment Update',
        message: `Your role assignment for ${roleData.roleType} has been ${roleData.status}`,
        priority: 'medium',
        timestamp: new Date().toISOString()
      },
      timestamp: Date.now()
    };

    // Broadcast to the specific user
    this.broadcastToUsers([roleData.userId], 'notification', message.data);
  }

  /**
   * Start heartbeat to check client connections
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      const now = new Date();
      const timeout = 60000; // 1 minute

      this.clients.forEach((client, connectionId) => {
        const timeSinceLastPing = now.getTime() - client.lastPing.getTime();
        
        if (timeSinceLastPing > timeout) {
          console.log(`Client ${connectionId} timed out`);
          client.ws.close(1001, 'Timeout');
          this.clients.delete(connectionId);
        } else {
          // Send ping
          if (client.ws.readyState === WebSocket.OPEN) {
            client.ws.ping();
          }
        }
      });
    }, 30000); // Check every 30 seconds
  }

  /**
   * Generate unique connection ID
   */
  private generateConnectionId(): string {
    return `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get server statistics
   */
  public getStats(): {
    totalConnections: number;
    authenticatedConnections: number;
    connectionsByRole: Record<string, number>;
  } {
    const totalConnections = this.clients.size;
    let authenticatedConnections = 0;
    const connectionsByRole: Record<string, number> = {};

    this.clients.forEach(client => {
      if (client.isAuthenticated) {
        authenticatedConnections++;
        connectionsByRole[client.userRole] = (connectionsByRole[client.userRole] || 0) + 1;
      }
    });

    return {
      totalConnections,
      authenticatedConnections,
      connectionsByRole
    };
  }
}

// Export singleton instance
export const realTimeWebSocketServer = new RealTimeWebSocketServer();
export default realTimeWebSocketServer;