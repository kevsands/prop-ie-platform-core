// WebSocket Service for Real-time Updates
import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { PrismaClient } from '@prisma/client';
import authService from './authService';

const prisma = new PrismaClient();

interface SocketUser {
  userId: string;
  role: string;
  socketId: string;
}

interface TransactionUpdate {
  transactionId: string;
  type: string;
  data: any;
  timestamp: Date;
}

class WebSocketService {
  private io: Server;
  private connectedUsers: Map<string, SocketUser>
  );
  private transactionRooms: Map<string, Set<string>>
  );
  constructor() {
    this.connectedUsers = new Map();
    this.transactionRooms = new Map();
  }

  // Initialize WebSocket server
  initialize(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        credentials: true
      }
    });

    this.setupEventHandlers();
    return this.io;
  }

  // Setup WebSocket event handlers
  private setupEventHandlers() {
    this.io.on('connection', async (socket: any) => {

      // Handle authentication
      socket.on('authenticate', async (token: string) => {
        try {
          const payload = await authService.verifyToken(token);
          const user = await authService.getUserById(payload.userId);

          if (user) {
            this.connectedUsers.set(socket.id, {
              userId: user.id,
              role: user.role,
              socketId: socket.id
            });

            socket.emit('authenticated', { userId: user.id, role: user.role });

            // Join user's personal room
            socket.join(`user:${user.id}`);

            // Join role-based room
            socket.join(`role:${user.role}`);

          }
        } catch (error) {
          socket.emit('authentication_error', { message: 'Invalid token' });
          socket.disconnect();
        }
      });

      // Handle joining transaction room
      socket.on('join_transaction', async (transactionId: string) => {
        const socketUser = this.connectedUsers.get(socket.id);
        if (!socketUser) {
          socket.emit('error', { message: 'Not authenticated' });
          return;
        }

        // Check if user has access to this transaction
        const hasAccess = await this.checkTransactionAccess(socketUser.userIdtransactionId);
        if (!hasAccess) {
          socket.emit('error', { message: 'Access denied' });
          return;
        }

        socket.join(`transaction:${transactionId}`);

        // Track room membership
        if (!this.transactionRooms.has(transactionId)) {
          this.transactionRooms.set(transactionId, new Set());
        }
        this.transactionRooms.get(transactionId)!.add(socket.id);

        socket.emit('joined_transaction', { transactionId });

        // Send initial transaction state
        const transaction = await prisma.transaction.findUnique({
          where: { id: transactionId },
          include: {
            events: { orderBy: { createdAt: 'desc' }, take: 10 },
            tasks: { where: { status: { not: 'COMPLETED' } } },
            documents: { orderBy: { createdAt: 'desc' }, take: 5 },
            payments: { orderBy: { createdAt: 'desc' }, take: 5 }
          }
        });

        socket.emit('transaction_state', transaction);
      });

      // Handle leaving transaction room
      socket.on('leave_transaction', (transactionId: string) => {
        socket.leave(`transaction:${transactionId}`);

        const room = this.transactionRooms.get(transactionId);
        if (room) {
          room.delete(socket.id);
          if (room.size === 0) {
            this.transactionRooms.delete(transactionId);
          }
        }

        socket.emit('left_transaction', { transactionId });
      });

      // Handle real-time document collaboration
      socket.on('document_update', async (data: {
        documentId: string;
        changes: any;
        cursor?: { line: number; column: number };
      }) => {
        const socketUser = this.connectedUsers.get(socket.id);
        if (!socketUser) return;

        // Broadcast to other users viewing the same document
        socket.to(`document:${data.documentId}`).emit('document_changed', {
          userId: socketUser.userId,
          ...data
        });
      });

      // Handle typing indicators
      socket.on('typing_start', (data: { transactionId: string; field: string }) => {
        const socketUser = this.connectedUsers.get(socket.id);
        if (!socketUser) return;

        socket.to(`transaction:${data.transactionId}`).emit('user_typing', {
          userId: socketUser.userId,
          field: data.field
        });
      });

      socket.on('typing_stop', (data: { transactionId: string; field: string }) => {
        const socketUser = this.connectedUsers.get(socket.id);
        if (!socketUser) return;

        socket.to(`transaction:${data.transactionId}`).emit('user_stopped_typing', {
          userId: socketUser.userId,
          field: data.field
        });
      });

      // Handle presence updates
      socket.on('presence_update', (data: { status: string; lastActivity: Date }) => {
        const socketUser = this.connectedUsers.get(socket.id);
        if (!socketUser) return;

        this.io.emit('user_presence', {
          userId: socketUser.userId,
          ...data
        });
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        const socketUser = this.connectedUsers.get(socket.id);
        if (socketUser) {
          // Remove from all transaction rooms
          this.transactionRooms.forEach((roomtransactionId: any) => {
            if (room.has(socket.id)) {
              room.delete(socket.id);
              if (room.size === 0) {
                this.transactionRooms.delete(transactionId);
              }
            }
          });

          // Notify others of disconnection
          this.io.emit('user_disconnected', { userId: socketUser.userId });
        }

        this.connectedUsers.delete(socket.id);

      });
    });
  }

  // Check if user has access to a transaction
  private async checkTransactionAccess(userId: string, transactionId: string): Promise<boolean> {
    try {
      const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId },
        include: {
          buyer: true,
          seller: true,
          agent: true,
          solicitor: true,
          development: {
            include: { developer: true }
          }
        }
      });

      if (!transaction) return false;

      // Check if user is a stakeholder in the transaction
      const stakeholders = [
        transaction.buyerId,
        transaction.sellerId,
        transaction.agentId,
        transaction.solicitorId,
        transaction.development?.developerId
      ].filter(Boolean);

      return stakeholders.includes(userId);
    } catch (error) {

      return false;
    }
  }

  // Broadcast transaction update
  async broadcastTransactionUpdate(update: TransactionUpdate) {
    const { transactionId, type, data } = update;

    // Get all stakeholders for this transaction
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        buyer: true,
        seller: true,
        agent: true,
        solicitor: true,
        development: {
          include: { developer: true }
        }
      }
    });

    if (!transaction) return;

    const stakeholderIds = [
      transaction.buyerId,
      transaction.sellerId,
      transaction.agentId,
      transaction.solicitorId,
      transaction.development?.developerId
    ].filter(Boolean);

    // Emit to transaction room
    this.io.to(`transaction:${transactionId}`).emit('transaction_update', {
      type,
      data,
      timestamp: update.timestamp
    });

    // Also emit to individual user rooms
    stakeholderIds.forEach(userId => {
      this.io.to(`user:${userId}`).emit('transaction_update', {
        transactionId,
        type,
        data,
        timestamp: update.timestamp
      });
    });
  }

  // Broadcast document update
  async broadcastDocumentUpdate(documentId: string, update: any) {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: { transaction: true }
    });

    if (!document) return;

    this.io.to(`transaction:${document.transactionId}`).emit('document_update', {
      documentId,
      update,
      timestamp: new Date()
    });
  }

  // Broadcast payment update
  async broadcastPaymentUpdate(paymentId: string, update: any) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { transaction: true }
    });

    if (!payment) return;

    this.io.to(`transaction:${payment.transactionId}`).emit('payment_update', {
      paymentId,
      update,
      timestamp: new Date()
    });
  }

  // Send direct message to user
  sendToUser(userId: string, event: string, data: any) {
    this.io.to(`user:${userId}`).emit(eventdata);
  }

  // Send message to role
  sendToRole(role: string, event: string, data: any) {
    this.io.to(`role:${role}`).emit(eventdata);
  }

  // Get online users
  getOnlineUsers(): SocketUser[] {
    return Array.from(this.connectedUsers.values());
  }

  // Get users in transaction room
  getUsersInTransaction(transactionId: string): SocketUser[] {
    const room = this.transactionRooms.get(transactionId);
    if (!room) return [];

    return Array.from(room).map(socketId => this.connectedUsers.get(socketId)).filter(Boolean) as SocketUser[];
  }

  // Emit analytics event
  emitAnalyticsUpdate(data: any) {
    // Send to all admin users
    this.sendToRole('ADMIN', 'analytics_update', data);
  }

  // Emit system notification
  emitSystemNotification(notification: any) {
    this.io.emit('system_notification', notification);
  }

  // Clean up resources
  cleanup() {
    this.connectedUsers.clear();
    this.transactionRooms.clear();
    if (this.io) {
      this.io.close();
    }
  }
}

export default new WebSocketService();