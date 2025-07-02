/**
 * Client-Safe Real-Time WebSocket Server
 * 
 * This is a client-safe version that provides types and interfaces
 * without importing server-only modules like sqlite3
 */

export interface WebSocketClient {
  ws: any; // WebSocket
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

// Client-safe mock implementation for browser environments
export class RealTimeWebSocketServerClient {
  public broadcast(_message: BroadcastMessage, _excludeConnectionId?: string): void {
    // Client-side implementation would use WebSocket client connection
    console.log('Client-side broadcast not implemented');
  }

  public broadcastToUsers(_userIds: string[], _eventType: string, _data: any): void {
    console.log('Client-side broadcastToUsers not implemented');
  }

  public broadcastToRoles(_roles: string[], _eventType: string, _data: any): void {
    console.log('Client-side broadcastToRoles not implemented');
  }

  public getStats(): {
    totalConnections: number;
    authenticatedConnections: number;
    connectionsByRole: Record<string, number>;
  } {
    return {
      totalConnections: 0,
      authenticatedConnections: 0,
      connectionsByRole: {}
    };
  }
}

// Export client-safe instance
export const realTimeWebSocketServer = new RealTimeWebSocketServerClient();
export default realTimeWebSocketServer;