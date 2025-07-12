/**
 * Real-Time Development Units Sync Hook
 * Keeps buyer portal in sync with developer portal changes
 */

import { useState, useEffect, useCallback } from 'react';
import { buyerDeveloperDataBridge } from '@/services/BuyerDeveloperDataBridge';
import { realTimeDataSyncService } from '@/services/RealTimeDataSyncService';
import { Unit as BuyerUnit } from '@/data/developments-brochure-data';

export interface DevelopmentSyncState {
  units: BuyerUnit[];
  isLoading: boolean;
  lastUpdated: Date | null;
  syncStatus: 'connected' | 'disconnected' | 'syncing' | 'error';
  totalUnits: number;
  availableUnits: number;
  reservedUnits: number;
  soldUnits: number;
}

export function useDevelopmentUnitsRealTimeSync(developmentId: string) {
  const [syncState, setSyncState] = useState<DevelopmentSyncState>({
    units: [],
    isLoading: true,
    lastUpdated: null,
    syncStatus: 'disconnected',
    totalUnits: 0,
    availableUnits: 0,
    reservedUnits: 0,
    soldUnits: 0
  });

  const [error, setError] = useState<string | null>(null);

  // Calculate unit statistics
  const calculateUnitStats = useCallback((units: BuyerUnit[]) => {
    return {
      totalUnits: units.length,
      availableUnits: units.filter(u => u.status === 'available').length,
      reservedUnits: units.filter(u => u.status === 'reserved').length,
      soldUnits: units.filter(u => u.status === 'sold').length
    };
  }, []);

  // Load initial data
  const loadUnits = useCallback(async () => {
    try {
      setSyncState(prev => ({ ...prev, isLoading: true, syncStatus: 'syncing' }));
      
      const units = buyerDeveloperDataBridge.getLiveUnitsForBuyerPortal(developmentId);
      const stats = calculateUnitStats(units);
      
      setSyncState(prev => ({
        ...prev,
        units,
        ...stats,
        isLoading: false,
        lastUpdated: new Date(),
        syncStatus: 'connected'
      }));
      
      setError(null);
      console.log(`🔄 Loaded ${units.length} units for ${developmentId}`);
    } catch (err) {
      console.error('Error loading units:', err);
      setError(err instanceof Error ? err.message : 'Failed to load units');
      setSyncState(prev => ({ 
        ...prev, 
        isLoading: false, 
        syncStatus: 'error' 
      }));
    }
  }, [developmentId, calculateUnitStats]);

  // Handle real-time updates from developer portal
  const handleBuyerPortalUpdate = useCallback((event: any) => {
    if (event.developmentId !== developmentId) return;
    
    console.log(`🔔 Received buyer portal update for ${developmentId}:`, event);
    
    setSyncState(prev => {
      const updatedUnits = [...prev.units];
      
      // Find and update the specific unit
      const unitIndex = updatedUnits.findIndex(u => 
        u.id === event.unitId || u.number === event.data?.unitNumber
      );
      
      if (unitIndex >= 0) {
        const existingUnit = updatedUnits[unitIndex];
        
        // Update unit with new data
        updatedUnits[unitIndex] = {
          ...existingUnit,
          status: event.data?.newValue?.status || existingUnit.status,
          price: event.data?.newValue?.pricing?.currentPrice || existingUnit.price,
          // Add any other fields that might be updated
        };
        
        console.log(`✅ Updated unit ${existingUnit.number} in buyer portal`);
      }
      
      const stats = calculateUnitStats(updatedUnits);
      
      return {
        ...prev,
        units: updatedUnits,
        ...stats,
        lastUpdated: new Date(),
        syncStatus: 'connected'
      };
    });
  }, [developmentId, calculateUnitStats]);

  // Handle unit sync events
  const handleUnitSync = useCallback((event: any) => {
    if (event.developmentId !== developmentId) return;
    
    console.log(`🔄 Unit sync event for ${developmentId}:`, event);
    
    // Reload all units to ensure full synchronization
    loadUnits();
  }, [developmentId, loadUnits]);

  // Handle connection state changes
  const handleConnectionStateChange = useCallback((state: string) => {
    setSyncState(prev => ({ 
      ...prev, 
      syncStatus: state as DevelopmentSyncState['syncStatus']
    }));
  }, []);

  // Initialize hook
  useEffect(() => {
    // Load initial data
    loadUnits();

    // Subscribe to real-time events
    realTimeDataSyncService.on('buyer_portal_update', handleBuyerPortalUpdate);
    realTimeDataSyncService.on('unit_sync', handleUnitSync);
    realTimeDataSyncService.on('connection_state_changed', handleConnectionStateChange);

    // Subscribe to development-specific updates
    realTimeDataSyncService.subscribeToDevelopment('buyer_portal_connection', developmentId);

    // Initialize real-time service if needed
    realTimeDataSyncService.initialize('buyer_portal_user', 'buyer')
      .catch(err => {
        console.error('Failed to initialize real-time service:', err);
        setError('Failed to connect to real-time updates');
      });

    // Cleanup on unmount
    return () => {
      realTimeDataSyncService.off('buyer_portal_update', handleBuyerPortalUpdate);
      realTimeDataSyncService.off('unit_sync', handleUnitSync);
      realTimeDataSyncService.off('connection_state_changed', handleConnectionStateChange);
      realTimeDataSyncService.unsubscribeFromDevelopment('buyer_portal_connection', developmentId);
    };
  }, [developmentId, loadUnits, handleBuyerPortalUpdate, handleUnitSync, handleConnectionStateChange]);

  // Manual refresh function
  const refreshUnits = useCallback(() => {
    loadUnits();
  }, [loadUnits]);

  // Check if specific unit is synchronized
  const isUnitSynchronized = useCallback((unitId: string): boolean => {
    return buyerDeveloperDataBridge.isUnitSynchronized(developmentId, unitId);
  }, [developmentId]);

  // Get sync statistics
  const getSyncStats = useCallback(() => {
    return buyerDeveloperDataBridge.getDevelopmentSyncStats(developmentId);
  }, [developmentId]);

  return {
    // State
    ...syncState,
    error,
    
    // Actions
    refreshUnits,
    isUnitSynchronized,
    getSyncStats,
    
    // Utilities
    isConnected: syncState.syncStatus === 'connected',
    hasError: !!error || syncState.syncStatus === 'error',
    isSyncing: syncState.syncStatus === 'syncing' || syncState.isLoading
  };
}

export default useDevelopmentUnitsRealTimeSync;