// WebSocket Server Setup
import { createServer } from 'http';
import { Server } from 'socket.io';
import websocketService from '@/services/websocketService';

const PORT = process.env.WEBSOCKET_PORT || 3001;

export function startWebSocketServer() {
  const httpServer = createServer();
  const io = websocketService.initialize(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`WebSocket server running on port ${PORT}`);
  });

  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing WebSocket server');
    websocketService.cleanup();
    httpServer.close(() => {
      console.log('WebSocket server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing WebSocket server');
    websocketService.cleanup();
    httpServer.close(() => {
      console.log('WebSocket server closed');
      process.exit(0);
    });
  });

  return io;
}

// Start the server if this file is run directly
if (require.main === module) {
  startWebSocketServer();
}