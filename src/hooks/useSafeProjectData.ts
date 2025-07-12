/**
 * Safe Project Data Hook
 * Enterprise-grade data synchronization for developer portal routes
 * 
 * @fileoverview Provides consistent data across all developer routes using adapter pattern
 * @version 1.0.0
 * @author Property Development Platform Team
 * 
 * SAFETY: Uses existing useProjectData hook with additional consistency layer
 * APPROACH: Adapts data without modifying existing interfaces or services
 */

import { useMemo } from 'react';
import useProjectData from '@/hooks/useProjectData';
import { safeDataSyncService, SafeRouteMetrics } from '@/services/SafeDataSyncService';

// =============================================================================
// SAFE PROJECT DATA HOOK
// =============================================================================

export interface SafeProjectDataResult {
  // All original useProjectData properties (passthrough)
  project: any;
  units: ReadonlyArray<any>;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  
  // Original individual metrics (for backward compatibility)
  totalUnits: number;
  soldUnits: number;
  reservedUnits: number;
  availableUnits: number;
  totalRevenue: number;
  averageUnitPrice: number;
  salesVelocity: number;
  conversionRate: number;
  
  // Enhanced safe metrics (consistent across all routes)
  safeMetrics: SafeRouteMetrics;
  
  // Additional safe properties
  heldUnits: number;
  withdrawnUnits: number;
  projectedRevenue: number;
  completedRevenue: number;
  pendingRevenue: number;
  
  // Formatting utilities
  formatCurrency: (amount: number) => string;
  isDataConsistent: boolean;
  dataSyncTimestamp: Date;
  
  // Original functions (passthrough)
  updateUnitStatus: any;
  updateUnitPrice: any;
  getUnitById: any;
  setUnitFilter: any;
  refreshData: any;
  
  // Additional data arrays (passthrough)
  teamMembers: ReadonlyArray<any>;
  invoices: ReadonlyArray<any>;
  feeProposals: ReadonlyArray<any>;
  professionalAppointments: ReadonlyArray<any>;
}

/**
 * Safe Project Data Hook
 * Provides consistent data across all developer portal routes
 */
export function useSafeProjectData(projectId: string = 'fitzgerald-gardens'): SafeProjectDataResult {
  // Get original data using existing hook (no modifications)
  const originalData = useProjectData(projectId);
  
  // Calculate safe metrics using adapter service
  const safeMetrics = useMemo(() => {
    if (!originalData.units || originalData.isLoading) {
      return safeDataSyncService.harmonizeProjectOverview(null);
    }
    
    // Create comprehensive data object for harmonization
    const projectData = {
      units: originalData.units,
      project: originalData.project,
      totalUnits: originalData.totalUnits,
      soldUnits: originalData.soldUnits,
      reservedUnits: originalData.reservedUnits,
      availableUnits: originalData.availableUnits,
      totalRevenue: originalData.totalRevenue,
      averageUnitPrice: originalData.averageUnitPrice,
      salesVelocity: originalData.salesVelocity,
      conversionRate: originalData.conversionRate
    };
    
    return safeDataSyncService.harmonizeProjectOverview(projectData);
  }, [
    originalData.units,
    originalData.totalUnits,
    originalData.soldUnits,
    originalData.reservedUnits,
    originalData.availableUnits,
    originalData.totalRevenue,
    originalData.isLoading
  ]);
  
  // Validate data consistency
  const isDataConsistent = useMemo(() => {
    return safeDataSyncService.validateMetrics(safeMetrics);
  }, [safeMetrics]);
  
  // Format currency function
  const formatCurrency = useMemo(() => {
    return (amount: number) => safeDataSyncService.formatCurrency(amount);
  }, []);
  
  // Return enhanced data with backward compatibility
  return {
    // Original properties (passthrough - no breaking changes)
    project: originalData.project,
    units: originalData.units,
    isLoading: originalData.isLoading,
    error: originalData.error,
    lastUpdated: originalData.lastUpdated,
    teamMembers: originalData.teamMembers,
    invoices: originalData.invoices,
    feeProposals: originalData.feeProposals,
    professionalAppointments: originalData.professionalAppointments,
    
    // Original functions (passthrough)
    updateUnitStatus: originalData.updateUnitStatus,
    updateUnitPrice: originalData.updateUnitPrice,
    getUnitById: originalData.getUnitById,
    setUnitFilter: originalData.setUnitFilter,
    refreshData: originalData.refreshData,
    
    // Enhanced consistent metrics (use safe values when available)
    totalUnits: safeMetrics.totalUnits || originalData.totalUnits,
    soldUnits: safeMetrics.soldUnits || originalData.soldUnits,
    reservedUnits: safeMetrics.reservedUnits || originalData.reservedUnits,
    availableUnits: safeMetrics.availableUnits || originalData.availableUnits,
    totalRevenue: safeMetrics.totalRevenue || originalData.totalRevenue,
    averageUnitPrice: safeMetrics.averageUnitPrice || originalData.averageUnitPrice,
    salesVelocity: safeMetrics.salesVelocity || originalData.salesVelocity,
    conversionRate: safeMetrics.conversionRate || originalData.conversionRate,
    
    // Additional safe properties
    heldUnits: safeMetrics.heldUnits || 0,
    withdrawnUnits: safeMetrics.withdrawnUnits || 0,
    projectedRevenue: safeMetrics.projectedRevenue || safeMetrics.totalRevenue,
    completedRevenue: safeMetrics.completedRevenue || safeMetrics.totalRevenue,
    pendingRevenue: safeMetrics.pendingRevenue || 0,
    
    // Safe metrics object
    safeMetrics,
    
    // Utility properties
    formatCurrency,
    isDataConsistent,
    dataSyncTimestamp: safeMetrics.lastSynced || new Date(),
  };
}

// =============================================================================
// ROUTE-SPECIFIC HOOKS (FOR SPECIALIZED USE CASES)
// =============================================================================

/**
 * Hook specifically for project overview route
 */
export function useSafeProjectOverview(projectId: string = 'fitzgerald-gardens') {
  const data = useSafeProjectData(projectId);
  
  const routeSpecificMetrics = useMemo(() => {
    return safeDataSyncService.harmonizeProjectOverview({
      units: data.units,
      project: data.project
    });
  }, [data.units, data.project]);
  
  return {
    ...data,
    routeMetrics: routeSpecificMetrics
  };
}

/**
 * Hook specifically for unit management route
 */
export function useSafeUnitManagement(projectId: string = 'fitzgerald-gardens') {
  const data = useSafeProjectData(projectId);
  
  const routeSpecificMetrics = useMemo(() => {
    return safeDataSyncService.harmonizeUnitManagement({
      units: data.units
    });
  }, [data.units]);
  
  return {
    ...data,
    routeMetrics: routeSpecificMetrics
  };
}

/**
 * Hook specifically for sales route
 */
export function useSafeSalesData(projectId: string = 'fitzgerald-gardens') {
  const data = useSafeProjectData(projectId);
  
  const routeSpecificMetrics = useMemo(() => {
    return safeDataSyncService.harmonizeSalesData({
      units: data.units,
      totalRevenue: data.totalRevenue,
      salesVelocity: data.salesVelocity
    });
  }, [data.units, data.totalRevenue, data.salesVelocity]);
  
  return {
    ...data,
    routeMetrics: routeSpecificMetrics
  };
}

/**
 * Hook specifically for finance route
 */
export function useSafeFinanceData(projectId: string = 'fitzgerald-gardens') {
  const data = useSafeProjectData(projectId);
  
  const routeSpecificMetrics = useMemo(() => {
    return safeDataSyncService.harmonizeFinanceData({
      units: data.units,
      invoices: data.invoices,
      totalRevenue: data.totalRevenue,
      projectedRevenue: data.projectedRevenue
    });
  }, [data.units, data.invoices, data.totalRevenue, data.projectedRevenue]);
  
  return {
    ...data,
    routeMetrics: routeSpecificMetrics
  };
}

// =============================================================================
// UTILITY HOOKS
// =============================================================================

/**
 * Hook for cross-route data validation
 */
export function useCrossRouteValidation() {
  const projectOverview = useSafeProjectOverview();
  const unitManagement = useSafeUnitManagement();
  const salesData = useSafeSalesData();
  const financeData = useSafeFinanceData();
  
  const consistencyReport = useMemo(() => {
    const routes = [
      { name: 'project-overview', data: projectOverview.safeMetrics },
      { name: 'unit-management', data: unitManagement.safeMetrics },
      { name: 'sales', data: salesData.safeMetrics },
      { name: 'finance', data: financeData.safeMetrics }
    ];
    
    // Check if all routes have consistent totalUnits
    const totalUnits = routes.map(r => r.data.totalUnits);
    const soldUnits = routes.map(r => r.data.soldUnits);
    const totalRevenue = routes.map(r => r.data.totalRevenue);
    
    return {
      isConsistent: {
        totalUnits: totalUnits.every(val => val === totalUnits[0]),
        soldUnits: soldUnits.every(val => val === soldUnits[0]),
        totalRevenue: totalRevenue.every(val => Math.abs(val - totalRevenue[0]) < 1)
      },
      values: {
        totalUnits,
        soldUnits,
        totalRevenue
      },
      routes: routes.map(r => r.name)
    };
  }, [projectOverview, unitManagement, salesData, financeData]);
  
  return consistencyReport;
}

export default useSafeProjectData;