import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-server';
import { Server } from 'socket.io';
import { createServer } from 'http';

// Store WebSocket server instance
let io: Server | null = null;

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  if (!io) {
    // Initialize WebSocket server if not already done
    const httpServer = createServer();
    io = new Server(httpServer, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        credentials: true});

    io.on('connection', (socket: any) => {

      // Join developer-specific room
      socket.on('join-developer-room', (developerId: string) => {
        if (developerId === session.user.id) {
          socket.join(`developer-${developerId}`);
          socket.emit('joined', { room: `developer-${developerId}` });
        }
      });

      // Handle analytics updates
      socket.on('request-update', async (data: any) => {
        // Emit updated analytics data
        io?.to(`developer-${session.user.id}`).emit('analytics-update', {
          type: 'refresh',
          timestamp: new Date().toISOString(),
          data: data});
      });

      socket.on('disconnect', () => {

      });
    });

    // Start listening on a different port for WebSocket
    const wsPort = process.env.WEBSOCKET_PORT || 3001;
    httpServer.listen(wsPort, () => {

    });
  }

  // Return WebSocket connection info
  return new Response(
    JSON.stringify({
      url: `ws://localhost:${process.env.WEBSOCKET_PORT || 3001}`,
      developerId: session.user.id}),
    {
      headers: {
        'Content-Type': 'application/json'}
  );
}

// Export function to emit events from other parts of the application
export function emitAnalyticsUpdate(developerId: string, data: any) {
  if (io) {
    io.to(`developer-${developerId}`).emit('analytics-update', {
      type: 'data-change',
      timestamp: new Date().toISOString(),
      data});
  }
}