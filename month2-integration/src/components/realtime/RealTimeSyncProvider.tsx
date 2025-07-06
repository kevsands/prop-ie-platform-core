'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRealTimeSync } from '@/hooks/useRealTimeSync';
import { ConnectionState } from '@/services/RealTimeDataSyncService';

interface RealTimeSyncContextType {
  isConnected: boolean;
  connectionState: ConnectionState;
  connect: () => Promise<void>;
  disconnect: () => void;
  lastEvent: any;
  eventHistory: any[];
}

const RealTimeSyncContext = createContext<RealTimeSyncContextType | null>(null);

interface RealTimeSyncProviderProps {
  children: React.ReactNode;
  userId?: string;
  userRole?: string;
  autoConnect?: boolean;
}

export function RealTimeSyncProvider({ 
  children, 
  userId, 
  userRole, 
  autoConnect = true 
}: RealTimeSyncProviderProps) {
  const {
    connectionState,
    isConnected,
    connect,
    disconnect,
    lastEvent,
    eventHistory
  } = useRealTimeSync(userId, userRole);

  // Auto-connect when user data is available
  useEffect(() => {
    if (autoConnect && userId && userRole && !isConnected) {
      connect();
    }
  }, [autoConnect, userId, userRole, isConnected, connect]);

  const contextValue: RealTimeSyncContextType = {
    isConnected,
    connectionState,
    connect,
    disconnect,
    lastEvent,
    eventHistory
  };

  return (
    <RealTimeSyncContext.Provider value={contextValue}>
      {children}
    </RealTimeSyncContext.Provider>
  );
}

export function useRealTimeSyncContext() {
  const context = useContext(RealTimeSyncContext);
  if (!context) {
    throw new Error('useRealTimeSyncContext must be used within a RealTimeSyncProvider');
  }
  return context;
}