import { NextRequest, NextResponse } from 'next/server';
import { WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import { Duplex } from 'stream';
import { webSocketPoolManager } from '@/services/WebSocketConnectionPool';

// WebSocket server instance
let wss: WebSocketServer | null = null;

// Client connection management
interface ConnectedClient {
  id: string;
  userId: string;
  userRole: string;
  socket: any;
  subscriptions: Set<string>;
  lastPing: Date;
  isAlive: boolean;
}

const connectedClients = new Map<string, ConnectedClient>();

/**
 * Initialize WebSocket server for real-time communication
 */
function initializeWebSocketServer() {
  if (wss) return wss;

  // Create WebSocket server
  wss = new WebSocketServer({
    port: 3001,
    clientTracking: true,
    perMessageDeflate: false
  });

  console.log('WebSocket server started on port 3001');

  // Handle new connections
  wss.on('connection', (ws, request) => {
    const url = new URL(request.url!, `http://${request.headers.host}`);
    const userId = url.searchParams.get('userId');
    const userRole = url.searchParams.get('userRole');

    if (!userId || !userRole) {
      ws.close(4001, 'Missing authentication parameters');
      return;
    }

    const clientId = `${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const client: ConnectedClient = {
      id: clientId,
      userId,
      userRole,
      socket: ws,
      subscriptions: new Set(),
      lastPing: new Date(),
      isAlive: true
    };

    connectedClients.set(clientId, client);
    console.log(`Client connected: ${userId} (${userRole}) - ${clientId}`);

    // Handle messages from client
    ws.on('message', (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        handleClientMessage(clientId, message);
      } catch (error) {
        console.error('Error parsing client message:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Invalid message format'
        }));
      }
    });

    // Handle client disconnect
    ws.on('close', (code, reason) => {
      console.log(`Client disconnected: ${userId} - Code: ${code}, Reason: ${reason}`);
      connectedClients.delete(clientId);
    });

    // Handle connection errors
    ws.on('error', (error) => {
      console.error(`WebSocket error for client ${userId}:`, error);
      connectedClients.delete(clientId);
    });

    // Send welcome message
    ws.send(JSON.stringify({
      type: 'connected',
      clientId,
      timestamp: Date.now()
    }));
  });

  // Handle server errors
  wss.on('error', (error) => {
    console.error('WebSocket server error:', error);
  });

  // Setup heartbeat to detect broken connections
  setupHeartbeat();

  return wss;
}

/**
 * Handle messages from clients
 */
function handleClientMessage(clientId: string, message: any) {
  const client = connectedClients.get(clientId);
  if (!client) return;

  switch (message.type) {
    case 'authenticate':
      handleAuthentication(client, message);
      break;
    case 'subscribe':
      handleSubscription(client, message.events, true);
      break;
    case 'unsubscribe':
      handleSubscription(client, message.events, false);
      break;
    case 'ping':
      handlePing(client, message.timestamp);
      break;
    case 'broadcast':
      handleBroadcast(client, message);
      break;
    default:
      console.log(`Unknown message type: ${message.type}`);
  }
}

/**
 * Handle client authentication
 */
function handleAuthentication(client: ConnectedClient, message: any) {
  // In production, validate JWT token or session
  // For development, accept all authenticated requests
  
  client.socket.send(JSON.stringify({
    type: 'auth_success',
    userId: client.userId,
    userRole: client.userRole,
    timestamp: Date.now()
  }));
}

/**
 * Handle event subscriptions
 */
function handleSubscription(client: ConnectedClient, events: string[], subscribe: boolean) {
  events.forEach(eventType => {
    if (subscribe) {
      client.subscriptions.add(eventType);
    } else {
      client.subscriptions.delete(eventType);
    }
  });

  client.socket.send(JSON.stringify({
    type: 'subscription_confirmed',
    events: Array.from(client.subscriptions),
    timestamp: Date.now()
  }));
}

/**
 * Handle ping/pong for connection health
 */
function handlePing(client: ConnectedClient, timestamp: number) {
  client.lastPing = new Date();
  client.isAlive = true;
  
  client.socket.send(JSON.stringify({
    type: 'pong',
    timestamp
  }));
}

/**
 * Handle broadcast messages from clients
 */
function handleBroadcast(sender: ConnectedClient, message: any) {
  const { eventType, data } = message;
  
  // Broadcast to all relevant clients
  connectedClients.forEach((client, clientId) => {
    // Don't send back to sender
    if (clientId === sender.id) return;
    
    // Check if client is subscribed to this event type
    if (!client.subscriptions.has(eventType)) return;
    
    // Apply additional filtering based on user role and data
    if (!shouldSendToClient(client, eventType, data)) return;
    
    try {
      client.socket.send(JSON.stringify({
        type: eventType,
        data,
        timestamp: Date.now(),
        from: sender.userId
      }));
    } catch (error) {
      console.error(`Error sending to client ${client.userId}:`, error);
    }
  });
}

/**
 * Determine if event should be sent to specific client
 */
function shouldSendToClient(client: ConnectedClient, eventType: string, data: any): boolean {
  switch (eventType) {
    case 'property_update':
      // Only send to users involved with this property
      return isUserInvolvedWithProperty(client, data.propertyId);
    
    case 'task_update':
      // Send to assigned user and stakeholders
      return data.assignedTo === client.userId || 
             isUserStakeholderForTask(client, data.taskId);
    
    case 'payment_update':
      // Send to buyer, developer, agent, and solicitor involved
      return isUserInvolvedWithPayment(client, data);
    
    case 'message_received':
      // Send to conversation participants
      return isUserInConversation(client, data.conversationId);
    
    case 'htb_status_change':
      // Send to buyer and relevant professionals
      return data.buyerId === client.userId ||
             isUserInvolvedWithHTB(client, data.applicationId);
    
    case 'legal_milestone':
      // Send to solicitor, buyer, and relevant stakeholders
      return data.solicitorId === client.userId ||
             data.buyerId === client.userId ||
             isUserInvolvedWithLegalCase(client, data.caseId);
    
    case 'notification':
      // Direct notification to specific user
      return data.userId === client.userId;
    
    default:
      return true;
  }
}

/**
 * Setup heartbeat to detect broken connections
 */
function setupHeartbeat() {
  setInterval(() => {
    connectedClients.forEach((client, clientId) => {
      const timeSinceLastPing = Date.now() - client.lastPing.getTime();
      
      if (timeSinceLastPing > 60000) { // 1 minute timeout
        console.log(`Client ${client.userId} timed out, closing connection`);
        client.socket.close(4000, 'Connection timeout');
        connectedClients.delete(clientId);
      }
    });
  }, 30000); // Check every 30 seconds
}

/**
 * API endpoint for real-time events
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, data, targetUsers } = body;

    // Initialize WebSocket server if not already running
    if (!wss) {
      initializeWebSocketServer();
    }

    // Broadcast event to connected clients
    let sentCount = 0;
    
    connectedClients.forEach((client) => {
      // Check if client should receive this event
      if (targetUsers && !targetUsers.includes(client.userId)) return;
      if (!client.subscriptions.has(eventType)) return;
      if (!shouldSendToClient(client, eventType, data)) return;
      
      try {
        client.socket.send(JSON.stringify({
          type: eventType,
          data,
          timestamp: Date.now()
        }));
        sentCount++;
      } catch (error) {
        console.error(`Error sending to client ${client.userId}:`, error);
      }
    });

    return NextResponse.json({
      success: true,
      eventType,
      sentToClients: sentCount,
      totalConnectedClients: connectedClients.size
    });

  } catch (error: any) {
    console.error('Real-time API error:', error);
    return NextResponse.json(
      { error: 'Failed to broadcast event' },
      { status: 500 }
    );
  }
}

/**
 * Get real-time connection status
 */
export async function GET(request: NextRequest) {
  try {
    // Initialize WebSocket server if not already running
    if (!wss) {
      initializeWebSocketServer();
    }

    const connectionStats = {
      totalConnections: connectedClients.size,
      connectionsByRole: {},
      activeSubscriptions: {},
      serverUptime: process.uptime(),
      memoryUsage: process.memoryUsage()
    };

    // Calculate stats
    connectedClients.forEach((client) => {
      // Count by role
      if (!connectionStats.connectionsByRole[client.userRole]) {
        connectionStats.connectionsByRole[client.userRole] = 0;
      }
      connectionStats.connectionsByRole[client.userRole]++;

      // Count subscriptions
      client.subscriptions.forEach((subscription) => {
        if (!connectionStats.activeSubscriptions[subscription]) {
          connectionStats.activeSubscriptions[subscription] = 0;
        }
        connectionStats.activeSubscriptions[subscription]++;
      });
    });

    return NextResponse.json({
      success: true,
      status: 'healthy',
      stats: connectionStats,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Real-time status error:', error);
    return NextResponse.json(
      { error: 'Failed to get status' },
      { status: 500 }
    );
  }
}

// Helper functions for access control
function isUserInvolvedWithProperty(client: ConnectedClient, propertyId: string): boolean {
  // In production, check database for user involvement with property
  return true; // Simplified for development
}

function isUserStakeholderForTask(client: ConnectedClient, taskId: string): boolean {
  // Check if user is a stakeholder for this task
  return true; // Simplified for development
}

function isUserInvolvedWithPayment(client: ConnectedClient, paymentData: any): boolean {
  // Check if user is involved in this payment
  return paymentData.buyerId === client.userId ||
         client.userRole === 'developer' ||
         client.userRole === 'agent' ||
         client.userRole === 'solicitor';
}

function isUserInConversation(client: ConnectedClient, conversationId: string): boolean {
  // Check if user is participant in conversation
  return true; // Simplified for development
}

function isUserInvolvedWithHTB(client: ConnectedClient, applicationId: string): boolean {
  // Check if user is involved with HTB application
  return client.userRole === 'developer' ||
         client.userRole === 'agent' ||
         client.userRole === 'solicitor';
}

function isUserInvolvedWithLegalCase(client: ConnectedClient, caseId: string): boolean {
  // Check if user is involved with legal case
  return client.userRole === 'developer' ||
         client.userRole === 'agent';
}