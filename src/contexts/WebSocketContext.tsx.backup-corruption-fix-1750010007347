'use client';

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Socket } from 'socket.io-client';

interface WebSocketContextType {
  socket: Socket | null;
  connected: boolean;
  connecting: boolean;
  error: Error | null;
  connect: () => void;
  disconnect: () => void;
  emit: (event: string, data?: any) => void;
  on: (event: string, handler: (data: any) => void) => void;
  off: (event: string, handler?: (data: any) => void) => void;
  joinTransaction: (transactionId: string) => void;
  leaveTransaction: (transactionId: string) => void;
  startTyping: (transactionId: string, field: string) => void;
  stopTyping: (transactionId: string, field: string) => void;
  updatePresence: (status: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};

interface WebSocketProviderProps {
  children: ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const webSocket = useWebSocket({
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  });

  // Set up presence updates
  useEffect(() => {
    if (webSocket.connected) {
      // Update presence on connect
      webSocket.updatePresence('online');

      // Set up periodic presence updates
      const presenceInterval = setInterval(() => {
        webSocket.updatePresence('online');
      }, 30000); // Every 30 seconds

      // Handle visibility changes
      const handleVisibilityChange = () => {
        if (document.hidden) {
          webSocket.updatePresence('away');
        } else {
          webSocket.updatePresence('online');
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        clearInterval(presenceInterval);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [webSocket.connected]);

  return (
    <WebSocketContext.Provider value={webSocket}>
      {children}
    </WebSocketContext.Provider>
  );
}

// Higher-order component for WebSocket integration
export function withWebSocket<P extends object>(
  Component: React.ComponentType<P & WebSocketContextType>
) {
  return function WithWebSocketComponent(props: P) {
    const webSocket = useWebSocketContext();
    return <Component {...props} {...webSocket} />\n  );
  };
}