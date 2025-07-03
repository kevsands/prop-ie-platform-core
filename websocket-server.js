// Simple WebSocket server for real-time messaging testing
const WebSocket = require('ws');

const PORT = 8080;

// Store active connections
const clients = new Map();
const userSessions = new Map();

// Create WebSocket server
const wss = new WebSocket.Server({ 
  port: PORT,
  perMessageDeflate: false
});

console.log(`[WebSocket Server] Starting on port ${PORT}...`);

wss.on('connection', (ws, request) => {
  const url = new URL(request.url, 'http://localhost');
  const userId = url.searchParams.get('userId') || `user_${Date.now()}`;

  console.log(`[WebSocket] User ${userId} connected`);

  // Store client connection
  clients.set(userId, ws);
  userSessions.set(userId, {
    userId,
    conversations: new Set(),
    lastSeen: new Date()
  });

  // Notify other users that this user is online
  broadcastUserStatus(userId, 'online');

  // Send welcome message
  ws.send(JSON.stringify({
    type: 'connected',
    payload: { 
      message: 'Connected to PROP.ie messaging server',
      userId: userId,
      timestamp: new Date().toISOString()
    }
  }));

  // Handle incoming messages
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      handleMessage(userId, message);
    } catch (error) {
      console.error('[WebSocket] Invalid message format:', error);
    }
  });

  // Handle disconnection
  ws.on('close', () => {
    console.log(`[WebSocket] User ${userId} disconnected`);
    clients.delete(userId);
    userSessions.delete(userId);
    broadcastUserStatus(userId, 'offline');
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error(`[WebSocket] Error for user ${userId}:`, error);
  });
});

function handleMessage(userId, message) {
  console.log(`[WebSocket] Message from ${userId}:`, message.type);

  switch (message.type) {
    case 'heartbeat':
      // Respond to heartbeat
      sendToUser(userId, {
        type: 'heartbeat_ack',
        payload: {},
        timestamp: new Date().toISOString()
      });
      break;

    case 'join_conversation':
      handleJoinConversation(userId, message.payload.conversationId);
      break;

    case 'leave_conversation':
      handleLeaveConversation(userId, message.payload.conversationId);
      break;

    case 'send_message':
      handleSendMessage(userId, message.payload);
      break;

    case 'mark_read':
      handleMarkRead(userId, message.payload);
      break;

    case 'typing':
      handleTypingIndicator(userId, message.payload);
      break;

    default:
      console.warn(`[WebSocket] Unknown message type: ${message.type}`);
  }
}

function handleJoinConversation(userId, conversationId) {
  const session = userSessions.get(userId);
  if (session) {
    session.conversations.add(conversationId);
    console.log(`[WebSocket] User ${userId} joined conversation ${conversationId}`);
  }
}

function handleLeaveConversation(userId, conversationId) {
  const session = userSessions.get(userId);
  if (session) {
    session.conversations.delete(conversationId);
    console.log(`[WebSocket] User ${userId} left conversation ${conversationId}`);
  }
}

function handleSendMessage(userId, payload) {
  const { conversationId, content, messageType } = payload;

  // Create mock message
  const newMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    conversationId,
    senderId: userId,
    senderName: getUserDisplayName(userId),
    senderRole: getUserRole(userId),
    content,
    messageType: messageType || 'text',
    priority: 'normal',
    status: 'sent',
    createdAt: new Date().toISOString(),
    readBy: []
  };

  // Broadcast to all users in the conversation
  broadcastToConversation(conversationId, {
    type: 'new_message',
    payload: newMessage,
    timestamp: new Date().toISOString()
  });

  console.log(`[WebSocket] Message sent to conversation ${conversationId}: ${content.substring(0, 50)}...`);
}

function handleMarkRead(userId, payload) {
  const { messageId, conversationId } = payload;

  // Broadcast read status to conversation participants
  broadcastToConversation(conversationId, {
    type: 'message_read',
    payload: {
      messageId,
      userId,
      readAt: new Date().toISOString()
    },
    timestamp: new Date().toISOString()
  });
}

function handleTypingIndicator(userId, payload) {
  const { conversationId, isTyping } = payload;

  // Broadcast typing indicator to other conversation participants
  broadcastToConversation(conversationId, {
    type: 'user_typing',
    payload: {
      userId,
      conversationId,
      isTyping
    },
    timestamp: new Date().toISOString()
  }, userId); // Exclude the sender
}

function sendToUser(userId, message) {
  const client = clients.get(userId);
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(message));
  }
}

function broadcastUserStatus(userId, status) {
  const message = {
    type: `user_${status}`,
    payload: { userId },
    timestamp: new Date().toISOString()
  };

  // Broadcast to all connected users
  for (const [clientUserId, client] of clients) {
    if (clientUserId !== userId && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  }
}

function broadcastToConversation(conversationId, message, excludeUserId) {
  // Find all users in this conversation
  const participantIds = [];
  
  for (const [userId, session] of userSessions) {
    if (session.conversations.has(conversationId) && userId !== excludeUserId) {
      participantIds.push(userId);
    }
  }

  // Send message to all participants
  for (const userId of participantIds) {
    sendToUser(userId, message);
  }

  console.log(`[WebSocket] Broadcasted ${message.type} to ${participantIds.length} users in conversation ${conversationId}`);
}

// Helper functions
function getUserDisplayName(userId) {
  const userMap = {
    'developer_001': 'Development Manager',
    'user_architect_001': 'David McCarthy',
    'user_engineer_001': 'Sarah O\'Brien',
    'user_buyer_001': 'John Murphy',
    'user_ceo_001': 'Michael Fitzgerald'
  };
  return userMap[userId] || userId;
}

function getUserRole(userId) {
  if (userId.includes('developer')) return 'developer';
  if (userId.includes('architect')) return 'architect';
  if (userId.includes('engineer')) return 'engineer';
  if (userId.includes('buyer')) return 'buyer';
  if (userId.includes('ceo')) return 'ceo';
  return 'user';
}

// Server status
wss.on('listening', () => {
  console.log(`[WebSocket Server] Listening on port ${PORT}`);
  console.log(`[WebSocket Server] Ready for connections`);
});

wss.on('error', (error) => {
  console.error('[WebSocket Server] Error:', error);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n[WebSocket Server] Shutting down gracefully...');
  wss.close(() => {
    console.log('[WebSocket Server] Closed');
    process.exit(0);
  });
});

// Keep track of server stats
setInterval(() => {
  console.log(`[WebSocket Server] Stats: ${clients.size} connected users, ${userSessions.size} active sessions`);
}, 30000); // Log every 30 seconds