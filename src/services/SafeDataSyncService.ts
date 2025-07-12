/**
 * Safe Data Synchronization Service
 * Enterprise-grade adapter pattern for route data consistency
 * 
 * @fileoverview Harmonizes data between developer portal routes without modifying existing interfaces
 * @version 1.0.0
 * @author Property Development Platform Team
 * 
 * SAFETY: This service does NOT modify any existing interfaces or core systems
 * APPROACH: Uses adapter pattern to transform data consistently across routes
 */

// Import existing types without modifications
import { ProjectMetrics as ExistingProjectMetrics } from '@/types/project';
import { Unit } from '@/types/project';

// =============================================================================
// SAFE TYPE DEFINITIONS (NO CONFLICTS WITH EXISTING)
// =============================================================================

export interface SafeRouteMetrics {
  // Core unit counts (matches existing interface)
  totalUnits: number;
  soldUnits: number;
  reservedUnits: number;
  availableUnits: number;
  
  // Additional status tracking (extension, not replacement)
  heldUnits?: number;
  withdrawnUnits?: number;
  
  // Financial metrics (safe additions)
  totalRevenue: number;
  averageUnitPrice: number;
  salesVelocity: number;
  conversionRate: number;
  
  // Extended financial data (optional)
  projectedRevenue?: number;
  completedRevenue?: number;
  pendingRevenue?: number;
  
  // Timestamps
  lastCalculated: Date;
  lastSynced?: Date;
}

export interface SafeDataTransform {
  fromExistingMetrics(metrics: ExistingProjectMetrics): SafeRouteMetrics;
  toStandardFormat(data: any): SafeRouteMetrics;
  calculateConsistentMetrics(units: ReadonlyArray<Unit>): SafeRouteMetrics;
  ensureDataConsistency(routeData: any[]): SafeRouteMetrics;
}

// =============================================================================
// ENTERPRISE DATA SYNCHRONIZATION SERVICE
// =============================================================================

export class SafeDataSyncService implements SafeDataTransform {
  private static instance: SafeDataSyncService;

  private constructor() {
    // Singleton pattern for enterprise consistency
  }

  public static getInstance(): SafeDataSyncService {
    if (!SafeDataSyncService.instance) {
      SafeDataSyncService.instance = new SafeDataSyncService();
    }
    return SafeDataSyncService.instance;
  }

  // =============================================================================
  // SAFE DATA TRANSFORMATION METHODS
  // =============================================================================

  /**
   * Transform existing ProjectMetrics to SafeRouteMetrics
   * SAFETY: Only reads existing interface, never modifies
   */
  public fromExistingMetrics(metrics: ExistingProjectMetrics): SafeRouteMetrics {
    return {
      // Core metrics (direct mapping from existing interface)
      totalUnits: metrics.totalUnits,
      soldUnits: metrics.soldUnits,
      reservedUnits: metrics.reservedUnits,
      availableUnits: metrics.availableUnits,
      totalRevenue: metrics.totalRevenue,
      averageUnitPrice: metrics.averageUnitPrice,
      salesVelocity: metrics.salesVelocity,
      conversionRate: metrics.conversionRate,
      lastCalculated: metrics.lastCalculated,
      
      // Safe additions (backward compatible)
      heldUnits: metrics.heldUnits || 0,
      withdrawnUnits: metrics.withdrawnUnits || 0,
      projectedRevenue: metrics.projectedRevenue || metrics.totalRevenue,
      completedRevenue: metrics.totalRevenue,
      pendingRevenue: (metrics.reservedUnits || 0) * (metrics.averageUnitPrice || 0),
      lastSynced: new Date()
    };
  }

  /**
   * Transform any route data to standard format
   * SAFETY: Defensive programming with fallbacks
   */
  public toStandardFormat(data: any): SafeRouteMetrics {
    // Handle different data structures safely
    const units = data?.units || data?.properties || data?.developments || [];
    
    if (Array.isArray(units) && units.length > 0) {
      return this.calculateConsistentMetrics(units);
    }
    
    // Handle direct metrics object
    if (data && typeof data === 'object' && 'totalUnits' in data) {
      return this.fromExistingMetrics(data as ExistingProjectMetrics);
    }
    
    // Safe fallback
    return this.getEmptyMetrics();
  }

  /**
   * Calculate consistent metrics from unit array
   * SAFETY: Works with any unit-like object structure
   */
  public calculateConsistentMetrics(units: ReadonlyArray<any>): SafeRouteMetrics {
    const safeUnits = Array.isArray(units) ? units : [];
    
    // Count units by status (defensive)
    const soldUnits = safeUnits.filter(u => 
      u?.status === 'sold' || u?.status === 'SOLD'
    ).length;
    
    const reservedUnits = safeUnits.filter(u => 
      u?.status === 'reserved' || u?.status === 'RESERVED'
    ).length;
    
    const availableUnits = safeUnits.filter(u => 
      u?.status === 'available' || u?.status === 'AVAILABLE'
    ).length;
    
    const heldUnits = safeUnits.filter(u => 
      u?.status === 'held' || u?.status === 'HELD'
    ).length;
    
    const withdrawnUnits = safeUnits.filter(u => 
      u?.status === 'withdrawn' || u?.status === 'WITHDRAWN'
    ).length;
    
    // Calculate revenue (defensive)
    const totalRevenue = safeUnits
      .filter(u => u?.status === 'sold' || u?.status === 'SOLD')
      .reduce((sum, u) => {
        const price = u?.pricing?.currentPrice || u?.price || u?.currentPrice || 0;
        return sum + (typeof price === 'number' ? price : 0);
      }, 0);
    
    const allPrices = safeUnits
      .map(u => u?.pricing?.currentPrice || u?.price || u?.currentPrice || 0)
      .filter(price => typeof price === 'number' && price > 0);
    
    const averageUnitPrice = allPrices.length > 0 
      ? allPrices.reduce((sum, price) => sum + price, 0) / allPrices.length 
      : 0;
    
    const projectedRevenue = safeUnits.reduce((sum, u) => {
      const price = u?.pricing?.currentPrice || u?.price || u?.currentPrice || 0;
      return sum + (typeof price === 'number' ? price : 0);
    }, 0);
    
    const pendingRevenue = reservedUnits * averageUnitPrice;
    const completedRevenue = totalRevenue;
    
    // Calculate velocity and conversion (safe)
    const salesVelocity = soldUnits > 0 ? soldUnits / 4 : 0; // Assume 4 weeks
    const conversionRate = safeUnits.length > 0 ? (soldUnits / safeUnits.length) * 100 : 0;
    
    return {
      totalUnits: safeUnits.length,
      soldUnits,
      reservedUnits,
      availableUnits,
      heldUnits,
      withdrawnUnits,
      totalRevenue,
      averageUnitPrice,
      salesVelocity,
      conversionRate,
      projectedRevenue,
      completedRevenue,
      pendingRevenue,
      lastCalculated: new Date(),
      lastSynced: new Date()
    };
  }

  /**
   * Ensure data consistency across multiple route responses
   * SAFETY: Merges data without modifying original sources
   */
  public ensureDataConsistency(routeData: any[]): SafeRouteMetrics {
    if (!Array.isArray(routeData) || routeData.length === 0) {
      return this.getEmptyMetrics();
    }
    
    // Find the most complete dataset
    let bestData = routeData[0];
    let maxUnits = 0;
    
    for (const data of routeData) {
      const units = data?.units || data?.properties || data?.developments || [];
      if (Array.isArray(units) && units.length > maxUnits) {
        maxUnits = units.length;
        bestData = data;
      }
    }
    
    return this.toStandardFormat(bestData);
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  /**
   * Get empty metrics structure (safe fallback)
   */
  private getEmptyMetrics(): SafeRouteMetrics {
    return {
      totalUnits: 0,
      soldUnits: 0,
      reservedUnits: 0,
      availableUnits: 0,
      heldUnits: 0,
      withdrawnUnits: 0,
      totalRevenue: 0,
      averageUnitPrice: 0,
      salesVelocity: 0,
      conversionRate: 0,
      projectedRevenue: 0,
      completedRevenue: 0,
      pendingRevenue: 0,
      lastCalculated: new Date(),
      lastSynced: new Date()
    };
  }

  /**
   * Format currency consistently (safe)
   */
  public formatCurrency(amount: number): string {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return '€0';
    }
    
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  /**
   * Validate metrics object (safety check)
   */
  public validateMetrics(metrics: SafeRouteMetrics): boolean {
    try {
      // Check required properties exist
      const required = ['totalUnits', 'soldUnits', 'reservedUnits', 'availableUnits'];
      for (const prop of required) {
        if (!(prop in metrics) || typeof metrics[prop as keyof SafeRouteMetrics] !== 'number') {
          return false;
        }
      }
      
      // Check logical consistency
      const totalCalculated = metrics.soldUnits + metrics.reservedUnits + 
                             metrics.availableUnits + (metrics.heldUnits || 0) + 
                             (metrics.withdrawnUnits || 0);
      
      return Math.abs(totalCalculated - metrics.totalUnits) <= 1; // Allow for rounding
    } catch (error) {
      return false;
    }
  }

  // =============================================================================
  // DEVELOPER PORTAL ROUTE HARMONIZATION
  // =============================================================================

  /**
   * Harmonize data for project overview route
   */
  public harmonizeProjectOverview(projectData: any): SafeRouteMetrics {
    return this.toStandardFormat(projectData);
  }

  /**
   * Harmonize data for unit management route
   */
  public harmonizeUnitManagement(unitData: any): SafeRouteMetrics {
    return this.toStandardFormat(unitData);
  }

  /**
   * Harmonize data for sales route
   */
  public harmonizeSalesData(salesData: any): SafeRouteMetrics {
    return this.toStandardFormat(salesData);
  }

  /**
   * Harmonize data for finance route
   */
  public harmonizeFinanceData(financeData: any): SafeRouteMetrics {
    return this.toStandardFormat(financeData);
  }
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

export const safeDataSyncService = SafeDataSyncService.getInstance();

// Export types for use in other modules
export type { SafeRouteMetrics };