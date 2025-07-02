/**
 * Real-Time Server Manager
 * 
 * Manages the lifecycle of the WebSocket server and integrates with Next.js
 */

// Use dynamic import to prevent client-side loading
let realTimeWebSocketServer: any = null;

// Dynamically import server-only modules
async function getWebSocketServer() {
  if (typeof window === 'undefined' && !realTimeWebSocketServer) {
    try {
      const { realTimeWebSocketServer: server } = await import('@/services/realTimeWebSocketServer');
      realTimeWebSocketServer = server;
    } catch (error) {
      console.warn('WebSocket server not available in this environment:', error);
      // Fallback to client-safe version
      const { realTimeWebSocketServer: clientServer } = await import('@/services/realTimeWebSocketServer.client');
      realTimeWebSocketServer = clientServer;
    }
  } else if (typeof window !== 'undefined') {
    // Client-side: use client-safe version
    const { realTimeWebSocketServer: clientServer } = await import('@/services/realTimeWebSocketServer.client');
    realTimeWebSocketServer = clientServer;
  }
  return realTimeWebSocketServer;
}

import { connectionPoolManager } from './connectionPoolManager';

export class RealTimeServerManager {
  private static instance: RealTimeServerManager;
  private isServerRunning: boolean = false;
  private initializationPromise: Promise<void> | null = null;

  private constructor() {}

  public static getInstance(): RealTimeServerManager {
    if (!RealTimeServerManager.instance) {
      RealTimeServerManager.instance = new RealTimeServerManager();
    }
    return RealTimeServerManager.instance;
  }

  /**
   * Initialize and start the WebSocket server
   */
  public async initialize(): Promise<void> {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.startServer();
    return this.initializationPromise;
  }

  /**
   * Start the WebSocket server
   */
  private async startServer(): Promise<void> {
    if (this.isServerRunning) {
      console.log('WebSocket server already running');
      return;
    }

    try {
      console.log('🚀 Starting Real-Time WebSocket Server...');
      const server = await getWebSocketServer();
      if (server && server.start) {
        await server.start();
        this.isServerRunning = true;
        
        console.log('✅ Real-Time WebSocket Server initialized successfully');
        console.log('📡 WebSocket endpoint: ws://localhost:3001/realtime');
        
        // Setup graceful shutdown
        this.setupGracefulShutdown();
      } else {
        console.log('📡 WebSocket server not available in this environment');
      }
      
    } catch (error) {
      console.error('❌ Failed to start WebSocket server:', error);
      throw error;
    }
  }

  /**
   * Stop the WebSocket server
   */
  public async stop(): Promise<void> {
    if (!this.isServerRunning) {
      return;
    }

    try {
      console.log('🛑 Stopping Real-Time WebSocket Server...');
      const server = await getWebSocketServer();
      if (server && server.stop) {
        await server.stop();
      }
      this.isServerRunning = false;
      this.initializationPromise = null;
      console.log('✅ WebSocket server stopped');
    } catch (error) {
      console.error('❌ Error stopping WebSocket server:', error);
      throw error;
    }
  }

  /**
   * Get server status
   */
  public async getStatus(): Promise<{
    isRunning: boolean;
    stats?: any;
  }> {
    const server = await getWebSocketServer();
    return {
      isRunning: this.isServerRunning,
      stats: this.isServerRunning && server ? server.getStats() : undefined
    };
  }

  /**
   * Setup graceful shutdown handlers
   */
  private setupGracefulShutdown(): void {
    const shutdownHandler = async (signal: string) => {
      console.log(`\n📡 Received ${signal}. Gracefully shutting down WebSocket server...`);
      await this.stop();
      process.exit(0);
    };

    // Handle different termination signals
    process.on('SIGTERM', () => shutdownHandler('SIGTERM'));
    process.on('SIGINT', () => shutdownHandler('SIGINT'));
    process.on('SIGQUIT', () => shutdownHandler('SIGQUIT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', async (error) => {
      console.error('🚨 Uncaught Exception:', error);
      await this.stop();
      process.exit(1);
    });

    process.on('unhandledRejection', async (reason, promise) => {
      console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
      await this.stop();
      process.exit(1);
    });
  }

  /**
   * Trigger real-time event
   */
  public async triggerEvent(eventType: string, data: any): Promise<void> {
    if (this.isServerRunning) {
      const server = await getWebSocketServer();
      if (server && server.emit) {
        server.emit(eventType, data);
      }
    }
  }

  /**
   * Broadcast to specific users
   */
  public async broadcastToUsers(userIds: string[], eventType: string, data: any): Promise<void> {
    if (this.isServerRunning) {
      const server = await getWebSocketServer();
      if (server && server.broadcastToUsers) {
        server.broadcastToUsers(userIds, eventType, data);
      }
    }
  }

  /**
   * Broadcast to specific roles
   */
  public async broadcastToRoles(roles: string[], eventType: string, data: any): Promise<void> {
    if (this.isServerRunning) {
      const server = await getWebSocketServer();
      if (server && server.broadcastToRoles) {
        server.broadcastToRoles(roles, eventType, data);
      }
    }
  }
}

// Export singleton instance
export const realTimeServerManager = RealTimeServerManager.getInstance();
export default realTimeServerManager;