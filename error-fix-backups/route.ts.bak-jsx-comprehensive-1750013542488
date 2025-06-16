// WebSocket API Route
import { NextRequest, NextResponse } from 'next/server';
import { createServer } from 'http';
import websocketService from '@/services/websocketService';

let isInitialized = false;

export async function GET(request: NextRequest) {
  if (!isInitialized) {
    try {
      // Initialize WebSocket server once
      const httpServer = createServer();
      websocketService.initialize(httpServer);
      isInitialized = true;

      return NextResponse.json({ 
        success: true, 
        message: 'WebSocket server initialized'
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to initialize WebSocket server' },
        { status: 500 }
      );
    }
  }

  // Get WebSocket server status
  const onlineUsers = websocketService.getOnlineUsers();

  return NextResponse.json({ 
    success: true, 
    data: {
      isInitialized,
      onlineUsers: onlineUsers.length,
      users: onlineUsers.map(user => ({
        userId: user.userId,
        role: user.role
      }))
    }
  });
}

// POST /api/websocket - Send WebSocket events from server-side
export async function POST(request: NextRequest) {
  try {
    const body: any = await request.json();
    const { event, data, target } = body;

    if (!event || !data) {
      return NextResponse.json(
        { success: false, error: 'Event and data are required' },
        { status: 400 }
      );
    }

    switch (target.type) {
      case 'user':
        websocketService.sendToUser(target.userId, eventdata);
        break;

      case 'role':
        websocketService.sendToRole(target.role, eventdata);
        break;

      case 'transaction':
        await websocketService.broadcastTransactionUpdate({
          transactionId: target.transactionId,
          type: event,
          data,
          timestamp: new Date()
        });
        break;

      case 'document':
        await websocketService.broadcastDocumentUpdate(target.documentIddata);
        break;

      case 'payment':
        await websocketService.broadcastPaymentUpdate(target.paymentIddata);
        break;

      case 'analytics':
        websocketService.emitAnalyticsUpdate(data);
        break;

      case 'system':
        websocketService.emitSystemNotification(data);
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid target type' },
          { status: 400 }
        );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Event sent successfully' 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to send WebSocket event' },
      { status: 500 }
    );
  }
}