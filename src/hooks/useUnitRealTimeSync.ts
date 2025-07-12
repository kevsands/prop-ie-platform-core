'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Unit } from '@/lib/services/units';
import { useRealTimeSync, useRealTimeEvent } from './useRealTimeSync';

export interface UnitUpdateEvent {
  unitId: string;
  developmentId: string;
  updateType: 'STATUS_CHANGE' | 'PRICE_CHANGE' | 'AVAILABILITY_CHANGE' | 'VIEW_COUNT_UPDATE' | 'BOOKING_UPDATE';
  oldValue?: any;
  newValue: any;
  timestamp: string;
  updatedBy: string;
  reason?: string;
}

export interface UnitRealtimeData {
  unit: Unit;
  lastUpdated: Date;
  updateType?: string;
  isLive: boolean;
  syncIndicator: 'synced' | 'syncing' | 'error' | 'offline';
}

/**
 * Hook for real-time unit synchronization
 * Keeps unit data synchronized between buyer views and developer portal
 */
export function useUnitRealTimeSync(unitId?: string, developmentId?: string) {
  const [unitData, setUnitData] = useState<UnitRealtimeData | null>(null);
  const [recentUpdates, setRecentUpdates] = useState<UnitUpdateEvent[]>([]);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error' | 'offline'>('offline');
  
  const { isConnected, connectionState, broadcastEvent, addEventListener } = useRealTimeSync();
  const updateTimeoutRef = useRef<NodeJS.Timeout>();

  // Handle unit updates from real-time service
  const handleUnitUpdate = useCallback((event: UnitUpdateEvent) => {
    if (unitId && event.unitId !== unitId) return;
    if (developmentId && event.developmentId !== developmentId) return;

    // Update recent activity
    setRecentUpdates(prev => [
      event,
      ...prev.slice(0, 19) // Keep last 20 updates
    ]);

    // Update unit data if it matches current unit
    if (unitId === event.unitId) {
      setUnitData(prev => {
        if (!prev) return null;
        
        const updatedUnit = { ...prev.unit };
        
        // Apply the update based on type
        switch (event.updateType) {
          case 'STATUS_CHANGE':
            updatedUnit.status = event.newValue;
            break;
          case 'PRICE_CHANGE':
            updatedUnit.basePrice = event.newValue;
            break;
          case 'VIEW_COUNT_UPDATE':
            updatedUnit.viewCount = event.newValue;
            break;
          case 'AVAILABILITY_CHANGE':
            updatedUnit.availableFrom = event.newValue;
            break;
        }

        return {
          ...prev,
          unit: updatedUnit,
          lastUpdated: new Date(event.timestamp),
          updateType: event.updateType,
          isLive: true,
          syncIndicator: 'synced'
        };
      });

      // Show sync indicator briefly
      setSyncStatus('syncing');
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      updateTimeoutRef.current = setTimeout(() => {
        setSyncStatus('synced');
      }, 1000);
    }
  }, [unitId, developmentId]);

  // Subscribe to unit updates
  useRealTimeEvent('property_update', handleUnitUpdate, isConnected);

  // Update sync status based on connection
  useEffect(() => {
    if (isConnected) {
      setSyncStatus('synced');
    } else {
      setSyncStatus('offline');
    }
  }, [isConnected]);

  // Initialize unit data
  const initializeUnit = useCallback((unit: Unit) => {
    setUnitData({
      unit,
      lastUpdated: new Date(),
      isLive: isConnected,
      syncIndicator: isConnected ? 'synced' : 'offline'
    });
  }, [isConnected]);

  // Broadcast unit view event
  const recordUnitView = useCallback(() => {
    if (unitId && developmentId && isConnected) {
      broadcastEvent('property_update', {
        propertyId: unitId,
        developmentId,
        updateType: 'VIEW_COUNT_UPDATE',
        newValue: (unitData?.unit.viewCount || 0) + 1,
        timestamp: new Date().toISOString(),
        updatedBy: 'buyer_view'
      });
    }
  }, [unitId, developmentId, isConnected, broadcastEvent, unitData]);

  // Broadcast unit interest
  const recordUnitInterest = useCallback((interestType: 'view' | 'save' | 'share' | 'contact') => {
    if (unitId && developmentId && isConnected) {
      broadcastEvent('property_update', {
        propertyId: unitId,
        developmentId,
        updateType: 'BOOKING_UPDATE',
        newValue: interestType,
        timestamp: new Date().toISOString(),
        updatedBy: 'buyer_interaction'
      });
    }
  }, [unitId, developmentId, isConnected, broadcastEvent]);

  // Clear old updates
  const clearOldUpdates = useCallback(() => {
    setRecentUpdates([]);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  return {
    // Data
    unitData,
    recentUpdates,
    syncStatus,
    isLive: isConnected && unitData?.isLive,
    
    // Actions
    initializeUnit,
    recordUnitView,
    recordUnitInterest,
    clearOldUpdates,
    
    // Connection info
    isConnected,
    connectionState
  };
}

/**
 * Hook for real-time development units synchronization
 * Keeps all units in a development synchronized
 */
export function useDevelopmentUnitsRealTimeSync(developmentId: string) {
  const [units, setUnits] = useState<Unit[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [activeUpdates, setActiveUpdates] = useState<Map<string, UnitUpdateEvent>>(new Map());
  
  const { isConnected, broadcastEvent } = useRealTimeSync();
  const updateTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Handle unit updates for this development
  const handleDevelopmentUnitUpdate = useCallback((event: UnitUpdateEvent) => {
    if (event.developmentId !== developmentId) return;

    console.log(`👥 Buyer platform received update: Unit ${event.unitId} ${event.updateType}`, event);

    // Update the units list
    setUnits(prev => prev.map(unit => {
      if (unit.id !== event.unitId) return unit;

      const updatedUnit = { ...unit };
      
      switch (event.updateType) {
        case 'STATUS_CHANGE':
        case 'UNIT_STATUS_CHANGE': // Support both formats
          updatedUnit.status = event.newValue;
          console.log(`🔄 Unit ${event.unitId} status updated: ${event.oldValue} → ${event.newValue}`);
          break;
        case 'PRICE_CHANGE':
        case 'UNIT_PRICE_UPDATE': // Support both formats
          updatedUnit.basePrice = event.newValue;
          console.log(`💰 Unit ${event.unitId} price updated: €${event.oldValue} → €${event.newValue}`);
          break;
        case 'VIEW_COUNT_UPDATE':
          updatedUnit.viewCount = event.newValue;
          break;
        case 'AVAILABILITY_CHANGE':
        case 'UNIT_AVAILABILITY_CHANGE': // Support both formats
          updatedUnit.availableFrom = event.newValue;
          break;
      }

      return updatedUnit;
    }));

    // Track active updates for UI indicators
    setActiveUpdates(prev => {
      const newMap = new Map(prev);
      newMap.set(event.unitId, event);
      return newMap;
    });

    // Clear the update indicator after delay
    const existingTimeout = updateTimeoutsRef.current.get(event.unitId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    const timeout = setTimeout(() => {
      setActiveUpdates(prev => {
        const newMap = new Map(prev);
        newMap.delete(event.unitId);
        return newMap;
      });
      updateTimeoutsRef.current.delete(event.unitId);
    }, 3000);

    updateTimeoutsRef.current.set(event.unitId, timeout);
    setLastUpdate(new Date(event.timestamp));
  }, [developmentId]);

  // Subscribe to property updates
  useRealTimeEvent('property_update', handleDevelopmentUnitUpdate, isConnected);

  // Initialize units
  const initializeUnits = useCallback((initialUnits: Unit[]) => {
    setUnits(initialUnits);
  }, []);

  // Broadcast units list refresh
  const refreshUnits = useCallback(() => {
    if (isConnected) {
      broadcastEvent('property_update', {
        propertyId: '*',
        developmentId,
        updateType: 'AVAILABILITY_CHANGE',
        newValue: 'refresh_request',
        timestamp: new Date().toISOString(),
        updatedBy: 'development_view'
      });
    }
  }, [developmentId, isConnected, broadcastEvent]);

  // Check if unit has active updates
  const hasActiveUpdate = useCallback((unitId: string) => {
    return activeUpdates.has(unitId);
  }, [activeUpdates]);

  // Get active update for unit
  const getActiveUpdate = useCallback((unitId: string) => {
    return activeUpdates.get(unitId);
  }, [activeUpdates]);

  // Cleanup
  useEffect(() => {
    return () => {
      updateTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      updateTimeoutsRef.current.clear();
    };
  }, []);

  return {
    // Data
    units,
    lastUpdate,
    activeUpdates: Array.from(activeUpdates.values()),
    isLive: isConnected,
    
    // Actions
    initializeUnits,
    refreshUnits,
    hasActiveUpdate,
    getActiveUpdate,
    
    // Connection info
    isConnected
  };
}