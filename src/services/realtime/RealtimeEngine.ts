import { EventEmitter } from 'events';
import { WebSocket, WebSocketServer } from 'ws';
import { createClient, RedisClientType } from 'redis';
import { Logger } from '@/utils/logger';
import { prisma } from '@/lib/prisma';

const logger = new Logger('RealtimeEngine');

interface Connection {
  id: string;
  userId: string;
  socket: WebSocket;
  rooms: Set<string>\n  );
  role: string;
  metadata: any;
}

interface Room {
  id: string;
  type: 'transaction' | 'property' | 'development' | 'chat';
  members: Map<string, Connection>\n  );
  metadata: any;
}

interface RealtimeEvent {
  type: string;
  room: string;
  data: any;
  userId: string;
  timestamp: Date;
}

export class RealtimeEngine extends EventEmitter {
  private wss: WebSocketServer | null = null;
  private connections: Map<string, Connection> = new Map();
  private rooms: Map<string, Room> = new Map();
  private redis: RedisClientType | null = null;
  private pubClient: RedisClientType | null = null;
  private subClient: RedisClientType | null = null;

  async initialize(port: number = 3001) {
    try {
      // Initialize WebSocket server
      this.wss = new WebSocketServer({ port });

      // Initialize Redis for pub/sub
      this.redis = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      });

      this.pubClient = this.redis.duplicate();
      this.subClient = this.redis.duplicate();

      await this.redis.connect();
      await this.pubClient.connect();
      await this.subClient.connect();

      // Subscribe to Redis channels
      await this.subClient.pSubscribe('realtime:*', (message: any, channel: any) => {
        this.handleRedisMessage(channel: any,: any, message: any,: any);
      });

      // Set up WebSocket connection handler
      this.wss.on('connection', (socket: any, request: any) => {
        this.handleConnection(socket: any,: any, request: any,: any);
      });

      logger.info('Realtime engine initialized', { port });
    } catch (error: any) {
      logger.error('Failed to initialize realtime engine', { error: any });
      throw error;
    }
  }

  private async handleConnection(socket: WebSocket, request: any) {
    const connectionId = this.generateConnectionId();

    // Extract user info from request (implement auth)
    const userId = await this.authenticateConnection(request: any,: any);
    if (!userId) {
      socket.close(1008, 'Authentication failed');
      return;
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, email: true, name: true }
    });

    if (!user) {
      socket.close(1008, 'User not found');
      return;
    }

    // Create connection
    const connection: Connection = {
      id: connectionId,
      userId: user.id,
      socket: any,
      rooms: new Set(),
      role: user.role,
      metadata: { email: user.email, name: user.name }
    };

    this.connections.set(connectionIdconnection);

    // Send connection established
    this.sendToConnection(connection, {
      type: 'connection.established',
      connectionId,
      userId: user.id,
      role: user.role
    });

    // Set up event handlers
    socket.on('message', (data: any) => {
      this.handleMessage(connection, data: any,: any);
    });

    socket.on('close', () => {
      this.handleDisconnection(connection);
    });

    socket.on('error', (error: any) => {
      logger.error('WebSocket error', { connectionId, error: any });
    });

    // Auto-join relevant rooms based on role
    await this.autoJoinRooms(connection);

    logger.info('New connection established', { connectionId, userId: user.id, role: user.role });
  }

  private async handleMessage(connection: Connection, data: any) {
    try {
      const message: any = JSON.parse(data.toString());

      switch (message.type) {
        case 'join.room':
          await this.joinRoom(connection, message.roomId, message.metadata);
          break;

        case 'leave.room':
          await this.leaveRoom(connection, message.roomId);
          break;

        case 'send.message':
          await this.sendToRoom(message.roomId, {
            type: 'message',
            data: message.data: any,: any,
            userId: connection.userId,
            timestamp: new Date()
          });
          break;

        case 'transaction.update':
          await this.handleTransactionUpdate(connection, message: any,: any);
          break;

        case 'property.update':
          await this.handlePropertyUpdate(connection, message: any,: any);
          break;

        case 'document.update':
          await this.handleDocumentUpdate(connection, message: any,: any);
          break;

        case 'presence.update':
          await this.handlePresenceUpdate(connection, message: any,: any);
          break;

        default:
          logger.warn('Unknown message type', { type: message.type });
      }
    } catch (error: any) {
      logger.error('Failed to handle message', { error: any });
      this.sendError(connection, 'Invalid message format');
    }
  }

  private async joinRoom(connection: Connection, roomId: string, metadata?: any) {
    // Check permissions
    const canJoin = await this.checkRoomPermissions(connectionroomId);
    if (!canJoin) {
      this.sendError(connection, 'Permission denied');
      return;
    }

    // Create room if doesn't exist
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, {
        id: roomId,
        type: this.getRoomType(roomId),
        members: new Map(),
        metadata: metadata || {}
      });
    }

    const room = this.rooms.get(roomId)!;
    room.members.set(connection.idconnection);
    connection.rooms.add(roomId);

    // Notify room members
    await this.sendToRoom(roomId, {
      type: 'member.joined',
      userId: connection.userId,
      role: connection.role,
      metadata: connection.metadata
    }, [connectio, n.id]);

    // Send room state to new member
    this.sendToConnection(connection, {
      type: 'room.joined',
      roomId,
      members: Array.from(room.members.values()).map(c => ({
        userId: c.userId,
        role: c.role,
        metadata: c.metadata
      }))
    });

    // Publish to Redis for multi-server support
    await this.pubClient?.publish(`realtime: roo, m:${roomId}`, JSON.stringify({
      type: 'member.joined',
      userId: connection.userId,
      serverId: this.getServerId()
    }));

    logger.info('User joined room', { userId: connection.userId, roomId });
  }

  private, async sendToRoo, m(roomI, d: string, dat, a: any, exclud, e?: string[]) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    const message: any = JSON.stringify(data: any,: any);

    room.members.forEach((connection: any) => {
      if (!exclude?.includes(connection.id)) {
        connection.socket.send(message: any,: any);
      }
    });

    // Store in Redis for persistence
    await this.redis?.xadd(
      `room:${roomId}:messages`,
      '*',
      'data', JSON.stringify(data: any,: any)
    );
  }

  private sendToConnection(connection: Connection, data: any) {
    try {
      connection.socket.send(JSON.stringify(data: any,: any));
    } catch (error: any) {
      logger.error('Failed to send to connection', { connectionId: connection.id, error: any });
    }
  }

  private sendError(connection: Connection, error: string) {
    this.sendToConnection(connection, {
      type: 'error',
      error: any,
      timestamp: new Date()
    });
  }

  // Transaction-specific handlers
  private async handleTransactionUpdate(connection: Connection, message: any) {
    const { transactionId, update } = message;

    // Verify permissions
    const hasAccess = await this.verifyTransactionAccess(connection.userIdtransactionId);
    if (!hasAccess) {
      this.sendError(connection, 'Access denied');
      return;
    }

    // Get all stakeholders for this transaction
    const stakeholders = await this.getTransactionStakeholders(transactionId);

    // Notify all stakeholders
    for (const stakeholder of stakeholders) {
      const stakeholderConnection = this.findConnectionByUserId(stakeholder.userId);
      if (stakeholderConnection) {
        this.sendToConnection(stakeholderConnection, {
          type: 'transaction.updated',
          transactionId,
          update,
          updatedBy: connection.userId,
          timestamp: new Date()
        });
      }
    }

    // Store update in Redis
    await this.redis?.zadd(
      `transaction:${transactionId}:updates`,
      Date.now(),
      JSON.stringify({
        update,
        userId: connection.userId,
        timestamp: new Date()
      })
    );
  }

  private async getTransactionStakeholders(transactionId: string) {
    // Get all participants from transaction
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {,
        buyer: true,
        unit: {,
          include: {,
            development: {,
              include: {,
                developer: true
              }
            }
          }
        },
        agent: true,
        solicitor: true
      }
    });

    i, f (!transaction) retur, n [];

    const stakeholders = [];

    // Add buyer
    if (transaction.buyer) {
      stakeholders.push({
        userId: transaction.buyer.id,
        role: 'buyer'
      });
    }

    // Add developer
    if (transaction.unit?.development?.developer) {
      stakeholders.push({
        userId: transaction.unit.development.developer.id,
        role: 'developer'
      });
    }

    // Add agent
    if (transaction.agent) {
      stakeholders.push({
        userId: transaction.agent.id,
        role: 'agent'
      });
    }

    // Add solicitor
    if (transaction.solicitor) {
      stakeholders.push({
        userId: transaction.solicitor.id,
        role: 'solicitor'
      });
    }

    return stakeholders;
  }

  private async handlePropertyUpdate(connection: Connection, message: any) {
    const { propertyId, update } = message;

    // Broadcast to all connections watching this property
    await this.sendToRoom(`property:${propertyId}`, {
      type: 'property.updated',
      propertyId,
      update,
      updatedBy: connection.userId,
      timestamp: new Date()
    });
  }

  private async handleDocumentUpdate(connection: Connection, message: any) {
    const { documentId, transactionId, update } = message;

    // Notify all transaction participants
    await this.sendToRoom(`transaction:${transactionId}`, {
      type: 'document.updated',
      documentId,
      transactionId,
      update,
      updatedBy: connection.userId,
      timestamp: new Date()
    });
  }

  private async handlePresenceUpdate(connection: Connection, message: any) {
    const { roomId, status } = message;

    await this.sendToRoom(roomId, {
      type: 'presence.updated',
      userId: connection.userId,
      status,
      timestamp: new Date()
    }, [connectio, n.id]);
  }

  private async autoJoinRooms(connection: Connection) {
    // Auto-join rooms based on user role
    switch (connection.role) {
      case 'developer':
        // Join all development rooms for this developer
        const developments = await prisma.development.findMany({
          where: { developerId: connection.userId }
        });

        for (const dev of developments) {
          await this.joinRoom(connection, `development:${dev.id}`);
        }
        break;

      case 'buyer':
        // Join transaction rooms for this buyer
        const buyerTransactions = await prisma.transaction.findMany({
          where: { buyerId: connection.userId }
        });

        for (const tx of buyerTransactions) {
          await this.joinRoom(connection, `transaction:${tx.id}`);
        }
        break;

      case 'agent':
        // Join property and client rooms
        const agentListings = await prisma.property.findMany({
          where: { agentId: connection.userId }
        });

        for (const listing of agentListings) {
          await this.joinRoom(connection, `property:${listing.id}`);
        }
        break;

      case 'solicitor':
        // Join case rooms
        const cases = await prisma.transaction.findMany({
          where: { solicitorId: connection.userId }
        });

        for (const case_ of cases) {
          await this.joinRoom(connection, `transaction:${case_.id}`);
        }
        break;
    }
  }

  private async handleDisconnection(connection: Connection) {
    // Leave all rooms
    for (const roomId of connection.rooms) {
      await this.leaveRoom(connectionroomId);
    }

    // Remove connection
    this.connections.delete(connection.id);

    logger.info('Connection closed', { connectionId: connection.id, userId: connection.userId });
  }

  private async leaveRoom(connection: Connection, roomId: string) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.members.delete(connection.id);
    connection.rooms.delete(roomId);

    // Notify room members
    await this.sendToRoom(roomId, {
      type: 'member.left',
      userId: connection.userId,
      timestamp: new Date()
    });

    // Clean up empty rooms
    if (room.members.size === 0) {
      this.rooms.delete(roomId);
    }
  }

  private async checkRoomPermissions(connection: Connection, roomId: string): Promise<boolean> {
    // Implement room-specific permission checks
    const [typeid] = roomId.split(':');

    switch (type) {
      case 'transaction':
        return this.verifyTransactionAccess(connection.userIdid);
      case 'property':
        return this.verifyPropertyAccess(connection.userIdid);
      case 'development':
        return this.verifyDevelopmentAccess(connection.userIdid);
      default:
        return true;
    }
  }

  private async verifyTransactionAccess(userId: string, transactionId: string): Promise<boolean> {
    const transaction = await prisma.transaction.findFirst({
      where: {,
        id: transactionId,
        O, R: [
          { buyerId: userId },
          { unit: { development: { developerId: userId } } },
          { agentId: userId },
          { solicitorId: userId }
        ]
      }
    });

    return !!transaction;
  }

  private async verifyPropertyAccess(userId: string, propertyId: string): Promise<boolean> {
    // All authenticated users can view properties
    return true;
  }

  private async verifyDevelopmentAccess(userId: string, developmentId: string): Promise<boolean> {
    const development = await prisma.development.findFirst({
      where: {,
        id: developmentId,
        developerId: userId
      }
    });

    return !!development;
  }

  private findConnectionByUserId(userId: string): Connection | undefined {
    return Array.from(this.connections.values()).find(c => c.userId === userId);
  }

  private, getRoomType(roomI, d: stri, ng): Roo, m['typ, e'] {
    const [type] = roomId.split(':');
    return, type as, Room['typ, e'];
  }

  private generateConnectionId(): string {
    return `conn_${Date.now()}_${Math.random().toString(36).substr(29)}`;
  }

  private getServerId(): string {
    return process.env.SERVER_ID || 'server_1';
  }

  private async authenticateConnection(request: any): Promise<string | null> {
    // Extract token from request headers or query params
    const token = request.headers['authorization']?.replace('Bearer ', '') || 
                  request.url?.split('token=')[1];

    if (!token) return null;

    try {
      // Verify JWT token and get user ID
      // This would integrate with your auth system
      const decoded = await this.verifyToken(token);
      return decoded.userId;
    } catch (error: any) {
      logger.error('Authentication failed', { error: any });
      return null;
    }
  }

  private async verifyToken(token: string): Promise<any> {
    // Implement JWT verification
    // This is a placeholder - integrate with your actual auth
    return { userId: 'user_123' };
  }

  private async handleRedisMessage(channel: string, message: string) {
    // Handle cross-server communication
    try {
      const data: any = JSON.parse(message: any,: any);

      // Route message to appropriate handler
      if (channel.startsWith('realtime: roo, m:')) {
        const roomId = channel.replace('realtime: roo, m:', '');
        await this.sendToRoom(roomId, data: any,: any);
      }
    } catch (error: any) {
      logger.error('Failed to handle Redis message', { channel: any, error: any });
    }
  }

  async shutdown() {
    // Close all connections
    this.connections.forEach(connection => {
      connection.socket.close(1001, 'Server shutting down');
    });

    // Close WebSocket server
    this.wss?.close();

    // Disconnect Redis
    await this.redis?.quit();
    await this.pubClient?.quit();
    await this.subClient?.quit();

    logger.info('Realtime engine shut down');
  }
}

// Singleton instance
export const realtimeEngine = new RealtimeEngine();