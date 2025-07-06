/**
 * Real-Time Coordination Service
 * 
 * Week 4 Implementation: Core Service Enhancement
 * Phase 1, Month 1 - Foundation Enhancement
 * 
 * WebSocket-based real-time coordination for the 49-role professional ecosystem
 * Provides instant updates, live collaboration, and cross-stakeholder communication
 */

import { EventEmitter } from 'events';
import { UserRole } from '@prisma/client';

export interface RealTimeMessage {
  id: string;
  type: 'notification' | 'status_update' | 'coordination_request' | 'task_update' | 'live_chat' | 'system_alert';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  data: any;
  targetUsers: string[];
  targetRoles: UserRole[];
  sender: {
    userId?: string;
    role?: UserRole;
    system?: boolean;
  };
  timestamp: Date;
  expiresAt?: Date;
  requiresAcknowledgment: boolean;
  metadata: {
    transactionId?: string;
    projectId?: string;
    coordinationId?: string;
    taskId?: string;
    roomId?: string;
  };
}

export interface ConnectionInfo {
  userId: string;
  role: UserRole;
  socketId: string;
  lastActivity: Date;
  activeRooms: Set<string>;
  status: 'online' | 'away' | 'busy' | 'offline';
}

export interface CoordinationRoom {
  id: string;
  name: string;
  type: 'transaction' | 'project' | 'task' | 'general';
  participants: Map<string, ConnectionInfo>;
  requiredRoles: UserRole[];
  metadata: {
    transactionId?: string;
    projectId?: string;
    taskId?: string;
    coordinationId?: string;
  };
  created: Date;
  lastActivity: Date;
  isActive: boolean;
}

/**
 * Real-Time Coordination Service
 * 
 * Manages WebSocket connections and real-time communication
 * across the 49-role professional ecosystem
 */
export class RealTimeCoordinationService extends EventEmitter {
  private connections = new Map<string, ConnectionInfo>();
  private userConnections = new Map<string, Set<string>>();
  private coordinationRooms = new Map<string, CoordinationRoom>();
  private messageHistory = new Map<string, RealTimeMessage[]>();
  private heartbeatInterval: NodeJS.Timeout;

  constructor() {
    super();
    this.initializeRealtimeEngine();
  }

  /**
   * Initialize real-time coordination engine
   */
  private initializeRealtimeEngine() {
    this.on('userConnected', this.handleUserConnection.bind(this));
    this.on('userDisconnected', this.handleUserDisconnection.bind(this));
    this.on('messageReceived', this.handleMessageReceived.bind(this));
    this.on('roomJoined', this.handleRoomJoined.bind(this));
    this.on('roomLeft', this.handleRoomLeft.bind(this));

    // Start heartbeat monitoring
    this.heartbeatInterval = setInterval(() => {
      this.performHeartbeatCheck();
    }, 30000); // 30 seconds
  }

  /**
   * Register a new WebSocket connection
   */
  registerConnection(socketId: string, userId: string, role: UserRole): ConnectionInfo {
    const connectionInfo: ConnectionInfo = {
      userId,
      role,
      socketId,
      lastActivity: new Date(),
      activeRooms: new Set(),
      status: 'online'
    };

    this.connections.set(socketId, connectionInfo);

    // Track user connections
    if (!this.userConnections.has(userId)) {
      this.userConnections.set(userId, new Set());
    }
    this.userConnections.get(userId)!.add(socketId);

    this.emit('userConnected', connectionInfo);

    return connectionInfo;
  }

  /**
   * Unregister a WebSocket connection
   */
  unregisterConnection(socketId: string): void {
    const connection = this.connections.get(socketId);
    if (!connection) return;

    // Remove from user connections
    const userSockets = this.userConnections.get(connection.userId);
    if (userSockets) {
      userSockets.delete(socketId);
      if (userSockets.size === 0) {
        this.userConnections.delete(connection.userId);
      }
    }

    // Leave all active rooms
    for (const roomId of connection.activeRooms) {
      this.leaveRoom(socketId, roomId);
    }

    this.connections.delete(socketId);
    this.emit('userDisconnected', connection);
  }

  /**
   * Send notification to specific users or roles
   */
  async sendNotification(message: Omit<RealTimeMessage, 'id' | 'timestamp'>): Promise<void> {
    const notification: RealTimeMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      timestamp: new Date()
    };

    // Send to specific users
    if (notification.targetUsers?.length) {
      for (const userId of notification.targetUsers) {
        await this.sendToUser(userId, notification);
      }
    }

    // Send to users with specific roles
    if (notification.targetRoles?.length) {
      for (const role of notification.targetRoles) {
        await this.sendToRole(role, notification);
      }
    }

    // Store in message history
    this.storeMessage(notification);

    this.emit('notificationSent', notification);
  }

  /**
   * Create coordination room for real-time collaboration
   */
  createCoordinationRoom(
    roomId: string,
    name: string,
    type: CoordinationRoom['type'],
    requiredRoles: UserRole[],
    metadata: CoordinationRoom['metadata'] = {}
  ): CoordinationRoom {
    const room: CoordinationRoom = {
      id: roomId,
      name,
      type,
      participants: new Map(),
      requiredRoles,
      metadata,
      created: new Date(),
      lastActivity: new Date(),
      isActive: true
    };

    this.coordinationRooms.set(roomId, room);
    this.messageHistory.set(roomId, []);

    // Auto-invite users with required roles
    this.inviteRequiredRoles(roomId, requiredRoles);

    this.emit('roomCreated', room);

    return room;
  }

  /**
   * Join coordination room
   */
  joinRoom(socketId: string, roomId: string): boolean {
    const connection = this.connections.get(socketId);
    const room = this.coordinationRooms.get(roomId);

    if (!connection || !room) {
      return false;
    }

    // Add to room participants
    room.participants.set(connection.userId, connection);
    connection.activeRooms.add(roomId);
    room.lastActivity = new Date();

    this.emit('roomJoined', { connection, room });

    // Send room history to new participant
    this.sendRoomHistory(socketId, roomId);

    // Notify other participants
    this.broadcastToRoom(roomId, {
      type: 'system_alert',
      priority: 'low',
      title: 'User Joined',
      message: `${connection.role} has joined the coordination room`,
      data: { userId: connection.userId, role: connection.role },
      targetUsers: [],
      targetRoles: [],
      sender: { system: true },
      requiresAcknowledgment: false,
      metadata: { roomId }
    });

    return true;
  }

  /**
   * Leave coordination room
   */
  leaveRoom(socketId: string, roomId: string): boolean {
    const connection = this.connections.get(socketId);
    const room = this.coordinationRooms.get(roomId);

    if (!connection || !room) {
      return false;
    }

    // Remove from room participants
    room.participants.delete(connection.userId);
    connection.activeRooms.delete(roomId);
    room.lastActivity = new Date();

    this.emit('roomLeft', { connection, room });

    // Notify other participants
    this.broadcastToRoom(roomId, {
      type: 'system_alert',
      priority: 'low',
      title: 'User Left',
      message: `${connection.role} has left the coordination room`,
      data: { userId: connection.userId, role: connection.role },
      targetUsers: [],
      targetRoles: [],
      sender: { system: true },
      requiresAcknowledgment: false,
      metadata: { roomId }
    });

    // Close room if no participants
    if (room.participants.size === 0) {
      room.isActive = false;
    }

    return true;
  }

  /**
   * Broadcast message to coordination room
   */
  async broadcastToRoom(roomId: string, message: Omit<RealTimeMessage, 'id' | 'timestamp'>): Promise<void> {
    const room = this.coordinationRooms.get(roomId);
    if (!room) return;

    const fullMessage: RealTimeMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      timestamp: new Date(),
      metadata: { ...message.metadata, roomId }
    };

    // Send to all room participants
    for (const [userId, connection] of room.participants) {
      await this.sendToSocket(connection.socketId, fullMessage);
    }

    // Store in room history
    this.storeRoomMessage(roomId, fullMessage);

    room.lastActivity = new Date();
  }

  /**
   * Send coordination update
   */
  async sendCoordinationUpdate(
    coordinationId: string,
    updateType: string,
    data: any,
    targetRoles?: UserRole[]
  ): Promise<void> {
    await this.sendNotification({
      type: 'coordination_request',
      priority: 'medium',
      title: `Coordination Update: ${updateType}`,
      message: `Coordination ${coordinationId} has been updated: ${updateType}`,
      data: { coordinationId, updateType, ...data },
      targetUsers: [],
      targetRoles: targetRoles || [],
      sender: { system: true },
      requiresAcknowledgment: true,
      metadata: { coordinationId }
    });
  }

  /**
   * Send task status update
   */
  async sendTaskStatusUpdate(
    taskId: string,
    status: string,
    assignedRole: UserRole,
    assignedUserId?: string
  ): Promise<void> {
    await this.sendNotification({
      type: 'task_update',
      priority: 'medium',
      title: 'Task Status Updated',
      message: `Task ${taskId} status changed to: ${status}`,
      data: { taskId, status, assignedRole },
      targetUsers: assignedUserId ? [assignedUserId] : [],
      targetRoles: [assignedRole],
      sender: { system: true },
      requiresAcknowledgment: false,
      metadata: { taskId }
    });
  }

  /**
   * Get active connections
   */
  getActiveConnections(): ConnectionInfo[] {
    return Array.from(this.connections.values());
  }

  /**
   * Get coordination rooms
   */
  getCoordinationRooms(): CoordinationRoom[] {
    return Array.from(this.coordinationRooms.values()).filter(room => room.isActive);
  }

  /**
   * Get real-time statistics
   */
  getRealtimeStats() {
    const activeConnections = this.getActiveConnections();
    const activeRooms = this.getCoordinationRooms();

    return {
      totalConnections: activeConnections.length,
      connectionsByRole: this.groupConnectionsByRole(activeConnections),
      totalRooms: activeRooms.length,
      roomsByType: this.groupRoomsByType(activeRooms),
      messagesInLast24Hours: this.getRecentMessageCount(),
      systemHealth: this.calculateSystemHealth()
    };
  }

  /**
   * Private helper methods
   */
  private async sendToUser(userId: string, message: RealTimeMessage): Promise<void> {
    const userSockets = this.userConnections.get(userId);
    if (!userSockets) return;

    for (const socketId of userSockets) {
      await this.sendToSocket(socketId, message);
    }
  }

  private async sendToRole(role: UserRole, message: RealTimeMessage): Promise<void> {
    for (const connection of this.connections.values()) {
      if (connection.role === role) {
        await this.sendToSocket(connection.socketId, message);
      }
    }
  }

  private async sendToSocket(socketId: string, message: RealTimeMessage): Promise<void> {
    const connection = this.connections.get(socketId);
    if (!connection) return;

    // Update last activity
    connection.lastActivity = new Date();

    // In a real implementation, this would send via WebSocket
    console.log(`📡 Real-time message to ${connection.role} (${connection.userId}):`, {
      type: message.type,
      title: message.title,
      priority: message.priority
    });

    this.emit('messageSent', { socketId, message, connection });
  }

  private storeMessage(message: RealTimeMessage): void {
    // Store in general message history (could be database)
    console.log('📝 Storing message:', message.id);
  }

  private storeRoomMessage(roomId: string, message: RealTimeMessage): void {
    const roomHistory = this.messageHistory.get(roomId);
    if (roomHistory) {
      roomHistory.push(message);
      
      // Keep only last 100 messages per room
      if (roomHistory.length > 100) {
        roomHistory.shift();
      }
    }
  }

  private sendRoomHistory(socketId: string, roomId: string): void {
    const roomHistory = this.messageHistory.get(roomId);
    if (!roomHistory || roomHistory.length === 0) return;

    // Send last 20 messages
    const recentMessages = roomHistory.slice(-20);
    
    this.sendToSocket(socketId, {
      id: `history_${Date.now()}`,
      type: 'system_alert',
      priority: 'low',
      title: 'Room History',
      message: 'Recent messages in this room',
      data: { messages: recentMessages },
      targetUsers: [],
      targetRoles: [],
      sender: { system: true },
      timestamp: new Date(),
      requiresAcknowledgment: false,
      metadata: { roomId }
    });
  }

  private inviteRequiredRoles(roomId: string, requiredRoles: UserRole[]): void {
    for (const connection of this.connections.values()) {
      if (requiredRoles.includes(connection.role)) {
        this.sendToSocket(connection.socketId, {
          id: `invite_${Date.now()}_${connection.userId}`,
          type: 'coordination_request',
          priority: 'medium',
          title: 'Coordination Room Invitation',
          message: `You've been invited to join coordination room: ${roomId}`,
          data: { roomId, action: 'invite' },
          targetUsers: [connection.userId],
          targetRoles: [],
          sender: { system: true },
          timestamp: new Date(),
          requiresAcknowledgment: false,
          metadata: { roomId }
        });
      }
    }
  }

  private performHeartbeatCheck(): void {
    const now = new Date();
    const timeoutMinutes = 5;

    for (const [socketId, connection] of this.connections.entries()) {
      const timeSinceActivity = now.getTime() - connection.lastActivity.getTime();
      const timeoutMs = timeoutMinutes * 60 * 1000;

      if (timeSinceActivity > timeoutMs) {
        // Mark as away or disconnect if too long
        if (timeSinceActivity > timeoutMs * 2) {
          this.unregisterConnection(socketId);
        } else if (connection.status === 'online') {
          connection.status = 'away';
        }
      }
    }
  }

  private groupConnectionsByRole(connections: ConnectionInfo[]): Record<string, number> {
    const grouped: Record<string, number> = {};
    for (const connection of connections) {
      grouped[connection.role] = (grouped[connection.role] || 0) + 1;
    }
    return grouped;
  }

  private groupRoomsByType(rooms: CoordinationRoom[]): Record<string, number> {
    const grouped: Record<string, number> = {};
    for (const room of rooms) {
      grouped[room.type] = (grouped[room.type] || 0) + 1;
    }
    return grouped;
  }

  private getRecentMessageCount(): number {
    // In real implementation, would query message history
    return 0;
  }

  private calculateSystemHealth(): 'healthy' | 'degraded' | 'unhealthy' {
    const activeConnections = this.getActiveConnections().length;
    const activeRooms = this.getCoordinationRooms().length;

    if (activeConnections > 50 && activeRooms > 10) return 'healthy';
    if (activeConnections > 10 && activeRooms > 2) return 'degraded';
    return 'unhealthy';
  }

  /**
   * Event handlers
   */
  private handleUserConnection(connection: ConnectionInfo): void {
    console.log(`🔗 User connected: ${connection.role} (${connection.userId})`);
  }

  private handleUserDisconnection(connection: ConnectionInfo): void {
    console.log(`🔌 User disconnected: ${connection.role} (${connection.userId})`);
  }

  private handleMessageReceived(data: any): void {
    console.log('📨 Message received:', data);
  }

  private handleRoomJoined(data: { connection: ConnectionInfo; room: CoordinationRoom }): void {
    console.log(`🏠 ${data.connection.role} joined room: ${data.room.name}`);
  }

  private handleRoomLeft(data: { connection: ConnectionInfo; room: CoordinationRoom }): void {
    console.log(`🚪 ${data.connection.role} left room: ${data.room.name}`);
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      const stats = this.getRealtimeStats();
      
      return {
        status: 'healthy',
        connections: stats.totalConnections,
        rooms: stats.totalRooms,
        systemHealth: stats.systemHealth,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Cleanup and disconnect
   */
  async disconnect(): Promise<void> {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    // Close all connections
    for (const socketId of this.connections.keys()) {
      this.unregisterConnection(socketId);
    }

    // Deactivate all rooms
    for (const room of this.coordinationRooms.values()) {
      room.isActive = false;
    }
  }
}

export default new RealTimeCoordinationService();