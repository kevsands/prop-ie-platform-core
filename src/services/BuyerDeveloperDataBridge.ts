/**
 * Buyer-Developer Data Bridge Service
 * Unifies data flow between developer portal and buyer-facing pages
 * Ensures synchronized unit data across both platforms
 */

import { projectDataService } from '@/services/ProjectDataService';
import { realTimeDataSyncService } from '@/services/RealTimeDataSyncService';
import { Unit, Project, UnitStatus } from '@/types/project';
import { Development, Unit as BuyerUnit, DEVELOPMENT_DATA } from '@/data/developments-brochure-data';

export interface UnifiedDevelopmentData {
  // Core development info
  id: string;
  name: string;
  slug: string;
  location: string;
  description: string;
  heroImage: string;
  
  // Buyer portal compatibility fields
  features: string[];
  propertyTypes: any[];
  galleryImages: any[];
  amenities: any;
  legalInfo: any;
  sitePlan?: string;
  brochureUrl?: string;
  
  // Live unit data from developer portal
  units: BuyerUnit[];
  
  // Real-time sync metadata
  lastSyncedAt: Date;
  dataSource: 'live' | 'static';
}

export class BuyerDeveloperDataBridge {
  private static instance: BuyerDeveloperDataBridge;
  
  private constructor() {
    // Subscribe to developer portal changes for real-time sync
    this.initializeRealTimeSync();
  }
  
  public static getInstance(): BuyerDeveloperDataBridge {
    if (!BuyerDeveloperDataBridge.instance) {
      BuyerDeveloperDataBridge.instance = new BuyerDeveloperDataBridge();
    }
    return BuyerDeveloperDataBridge.instance;
  }
  
  /**
   * Get unified development data that combines static brochure info with live developer data
   */
  public getUnifiedDevelopmentData(developmentId: string): UnifiedDevelopmentData | null {
    try {
      // Get static brochure data for baseline info (direct access to prevent circular dependency)
      const staticDevelopment = DEVELOPMENT_DATA[developmentId];
      if (!staticDevelopment) return null;
      
      // Try to get live project data from developer portal
      let liveProject = projectDataService.getProject(developmentId);
      
      // If no live project found, try to initialize it for known developments
      if (!liveProject && developmentId === 'fitzgerald-gardens') {
        console.log('🏗️ [Bridge] Initializing Fitzgerald Gardens for live data...');
        try {
          liveProject = projectDataService.initializeFitzgeraldGardens();
        } catch (initError) {
          console.warn('Failed to initialize Fitzgerald Gardens:', initError);
        }
      }
      
      if (liveProject) {
        // Use live data with static brochure overlay
        console.log(`✅ [Bridge] Using live data for ${developmentId} with ${liveProject.units.length} units`);
        return this.mergeLiveDataWithBrochure(staticDevelopment, liveProject);
      } else {
        // Fallback to static data
        console.log(`📄 [Bridge] Using static data for ${developmentId}`);
        return this.convertStaticToBridge(staticDevelopment);
      }
    } catch (error) {
      console.error('Error getting unified development data:', error);
      // Return static data as ultimate fallback
      try {
        const staticDevelopment = DEVELOPMENT_DATA[developmentId];
        if (staticDevelopment) {
          return this.convertStaticToBridge(staticDevelopment);
        }
      } catch (fallbackError) {
        console.error('Even static fallback failed:', fallbackError);
      }
      return null;
    }
  }
  
  /**
   * Get live units from developer portal in buyer-compatible format
   */
  public getLiveUnitsForBuyerPortal(developmentId: string): BuyerUnit[] {
    try {
      const project = projectDataService.getProject(developmentId);
      if (!project) return [];
      
      return project.units.map(unit => this.convertDeveloperUnitToBuyerUnit(unit));
    } catch (error) {
      console.error('Error getting live units for buyer portal:', error);
      return [];
    }
  }
  
  /**
   * Get specific unit data synchronized between both portals
   */
  public getUnifiedUnitData(developmentId: string, unitId: string): BuyerUnit | null {
    try {
      const project = projectDataService.getProject(developmentId);
      if (!project) return null;
      
      const unit = project.units.find(u => u.id === unitId || u.number === unitId);
      if (!unit) return null;
      
      return this.convertDeveloperUnitToBuyerUnit(unit);
    } catch (error) {
      console.error('Error getting unified unit data:', error);
      return null;
    }
  }
  
  /**
   * Check if unit data is synchronized between portals
   */
  public isUnitSynchronized(developmentId: string, unitId: string): boolean {
    try {
      const liveUnit = projectDataService.getUnitById(developmentId, unitId);
      const staticDevelopment = getDevelopmentById(developmentId);
      
      if (!liveUnit || !staticDevelopment) return false;
      
      const staticUnit = staticDevelopment.units.find(u => u.id === unitId || u.number === unitId);
      if (!staticUnit) return false;
      
      // Compare key fields for synchronization
      return (
        liveUnit.pricing.currentPrice === staticUnit.price &&
        this.mapDeveloperStatus(liveUnit.status) === staticUnit.status
      );
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Force synchronization of specific unit across both portals
   */
  public synchronizeUnit(developmentId: string, unitId: string): boolean {
    try {
      const liveUnit = projectDataService.getUnitById(developmentId, unitId);
      if (!liveUnit) return false;
      
      // Update static data to match live data
      // This would typically update a database or cache
      console.log(`Synchronizing unit ${unitId} with live data:`, {
        price: liveUnit.pricing.currentPrice,
        status: liveUnit.status,
        lastUpdated: liveUnit.lastUpdated
      });
      
      // Broadcast sync event
      realTimeDataSyncService.broadcastUnitSync(developmentId, unitId, liveUnit);
      
      return true;
    } catch (error) {
      console.error('Error synchronizing unit:', error);
      return false;
    }
  }
  
  /**
   * Initialize real-time synchronization between portals
   */
  private initializeRealTimeSync(): void {
    // Subscribe to developer portal changes
    ['fitzgerald-gardens', 'ballymakenny-view', 'ellwood'].forEach(projectId => {
      projectDataService.subscribe(projectId, (event) => {
        this.handleDeveloperPortalChange(projectId, event);
      });
    });
  }
  
  /**
   * Handle changes from developer portal and sync to buyer portal
   */
  private handleDeveloperPortalChange(developmentId: string, event: any): void {
    try {
      console.log(`🔄 Syncing developer portal change to buyer portal:`, {
        development: developmentId,
        eventType: event.type,
        timestamp: event.timestamp
      });
      
      // Broadcast change to buyer portal components
      realTimeDataSyncService.broadcastToBuyerPortal(developmentId, event);
      
      // Update any cached buyer portal data
      this.updateBuyerPortalCache(developmentId, event);
    } catch (error) {
      console.error('Error handling developer portal change:', error);
    }
  }
  
  /**
   * Merge live project data with static brochure data
   */
  private mergeLiveDataWithBrochure(staticDev: Development, liveProject: Project): UnifiedDevelopmentData {
    return {
      // Core info from static data
      id: staticDev.id,
      name: staticDev.name,
      slug: staticDev.slug,
      location: staticDev.location,
      description: staticDev.description,
      heroImage: staticDev.heroImage,
      
      // Brochure data
      features: staticDev.features,
      propertyTypes: staticDev.propertyTypes,
      galleryImages: staticDev.galleryImages,
      amenities: staticDev.amenities,
      legalInfo: staticDev.legalInfo,
      sitePlan: staticDev.sitePlan,
      brochureUrl: staticDev.brochureUrl,
      
      // LIVE units from developer portal
      units: liveProject.units.map(unit => this.convertDeveloperUnitToBuyerUnit(unit)),
      
      // Sync metadata
      lastSyncedAt: new Date(),
      dataSource: 'live'
    };
  }
  
  /**
   * Convert static development to bridge format
   */
  private convertStaticToBridge(staticDev: Development): UnifiedDevelopmentData {
    return {
      ...staticDev,
      lastSyncedAt: new Date(),
      dataSource: 'static'
    };
  }
  
  /**
   * Convert developer portal unit to buyer portal format
   */
  private convertDeveloperUnitToBuyerUnit(unit: Unit): BuyerUnit {
    return {
      id: unit.id,
      number: unit.number,
      type: this.mapUnitTypeToBuyer(unit.type),
      bedrooms: unit.features.bedrooms,
      bathrooms: unit.features.bathrooms,
      sqm: unit.features.sqm || Math.round(unit.features.sqft / 10.764),
      status: this.mapDeveloperStatus(unit.status),
      price: unit.pricing.currentPrice,
      coordinates: {
        x: unit.location?.x || Math.random() * 80 + 10,
        y: unit.location?.y || Math.random() * 80 + 10,
        width: 5,
        height: 5
      }
    };
  }
  
  /**
   * Map developer portal unit types to buyer portal format
   */
  private mapUnitTypeToBuyer(developerType: any): string {
    if (typeof developerType === 'string') {
      return developerType;
    }
    
    // Handle complex unit type objects
    return `${developerType.bedrooms || 2} Bed ${developerType.type || 'Apartment'}`;
  }
  
  /**
   * Map developer portal status to buyer portal status
   */
  private mapDeveloperStatus(status: UnitStatus): 'available' | 'reserved' | 'sold' {
    switch (status) {
      case 'available':
        return 'available';
      case 'reserved':
      case 'held':
        return 'reserved';
      case 'sold':
        return 'sold';
      default:
        return 'available';
    }
  }
  
  /**
   * Update buyer portal cache with new data
   */
  private updateBuyerPortalCache(developmentId: string, event: any): void {
    // This would typically update a cache or database
    // For now, we'll just log the cache update
    console.log(`🗄️ Updating buyer portal cache for ${developmentId}:`, event);
  }
  
  /**
   * Get development statistics for admin dashboard
   */
  public getDevelopmentSyncStats(developmentId: string): {
    totalUnits: number;
    syncedUnits: number;
    syncPercentage: number;
    lastSyncTime: Date;
    dataSource: 'live' | 'static';
  } {
    try {
      const unified = this.getUnifiedDevelopmentData(developmentId);
      if (!unified) {
        return {
          totalUnits: 0,
          syncedUnits: 0,
          syncPercentage: 0,
          lastSyncTime: new Date(),
          dataSource: 'static'
        };
      }
      
      const totalUnits = unified.units.length;
      const syncedUnits = unified.dataSource === 'live' ? totalUnits : 0;
      
      return {
        totalUnits,
        syncedUnits,
        syncPercentage: totalUnits > 0 ? (syncedUnits / totalUnits) * 100 : 0,
        lastSyncTime: unified.lastSyncedAt,
        dataSource: unified.dataSource
      };
    } catch (error) {
      console.error('Error getting sync stats:', error);
      return {
        totalUnits: 0,
        syncedUnits: 0,
        syncPercentage: 0,
        lastSyncTime: new Date(),
        dataSource: 'static'
      };
    }
  }
}

// Singleton export
export const buyerDeveloperDataBridge = BuyerDeveloperDataBridge.getInstance();