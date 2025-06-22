// src/services/apiDataService.ts
import { DataService } from './index';
import { Development } from '@/types/developments';
import { Property } from '@/types/properties';
import { PropertySearchParams, PropertyListResponse } from '@/types/search';
import { api } from './api';
import { realPropertyDataService } from './realPropertyDataService';
import { projectDataService } from './ProjectDataService';
import { realTimeServerManager } from '@/lib/realtime/realTimeServerManager';
import { realTimeCacheManager } from '@/lib/cache/realTimeCacheManager';
import { connectionPoolManager } from '@/lib/realtime/connectionPoolManager';

export class ApiDataService implements DataService {
  /**
   * Production-ready data service using real database integration
   * Replaces mock data with live database queries and real-time updates
   */

  // Development methods
  async getDevelopments(): Promise<Development[]> {
    const cacheKey = 'developments:all';
    
    // Try to get from cache first with intelligent prefetching
    const cached = await realTimeCacheManager.get<Development[]>(
      cacheKey,
      async () => {
        // Cache miss - fetch from database
        const projects = await projectDataService.getAllProjects();
        return this.convertProjectsToDevelopments(projects);
      },
      {
        ttl: 2 * 60 * 1000, // 2 minutes
        priority: 'high',
        invalidateOnUpdate: true
      }
    );
    
    if (cached) {
      // Broadcast analytics for cached access
      connectionPoolManager.sendMessage({
        event: 'developments_cache_hit',
        timestamp: new Date().toISOString(),
        source: 'high_performance_cache'
      });
      return cached;
    }
    
    try {
      // Direct database access as fallback
      const projects = await projectDataService.getAllProjects();
      
      const developments = this.convertProjectsToDevelopments(projects);

      // Broadcast analytics event
      realTimeServerManager.triggerEvent('developments_accessed', {
        count: developments.length,
        timestamp: new Date().toISOString(),
        source: 'production_database'
      });

      return developments;
    } catch (error) {
      console.error('Failed to fetch developments from database:', error);
      // Fallback to API if database fails
      return api.get<Development[]>('/developments');
    }
  }

  async getDevelopmentById(id: string): Promise<Development | null> {
    try {
      // Use real project data service
      const project = await projectDataService.getProjectById(id);
      if (!project) return null;

      const development: Development = {
        id: project.id,
        name: project.name,
        description: project.description || 'Luxury development project',
        location: project.location || 'Dublin, Ireland',
        image: project.image || `/images/developments/${project.id}/hero.jpg`,
        status: this.mapProjectStatusToDevelopment(project.status),
        statusColor: this.getStatusColor(project.status)
      };

      // Broadcast real-time view event
      realTimeServerManager.triggerEvent('development_viewed', {
        developmentId: id,
        developmentName: project.name,
        timestamp: new Date().toISOString()
      });

      return development;
    } catch (error) {
      console.error(`Failed to fetch development ${id} from database:`, error);
      // Fallback to API
      try {
        return await api.get<Development>(`/developments/${id}`);
      } catch (apiError) {
        return null;
      }
    }
  }

  async getFeaturedDevelopments(limit = 4): Promise<Development[]> {
    try {
      // Get featured projects from real data
      const projects = await projectDataService.getFeaturedProjects(limit);
      
      const developments: Development[] = projects.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description || 'Luxury development project',
        location: project.location || 'Dublin, Ireland',
        image: project.image || `/images/developments/${project.id}/hero.jpg`,
        status: this.mapProjectStatusToDevelopment(project.status),
        statusColor: this.getStatusColor(project.status)
      }));

      return developments;
    } catch (error) {
      console.error('Failed to fetch featured developments:', error);
      // Fallback to API
      return api.get<Development[]>(`/developments/featured?limit=${limit}`);
    }
  }

  // Property methods
  async getProperties(filters?: any): Promise<Property[]> {
    const filterHash = JSON.stringify(filters || {});
    const cacheKey = `properties:search:${Buffer.from(filterHash).toString('base64')}`;
    
    // Try intelligent cache with prefetching
    const cached = await realTimeCacheManager.get<Property[]>(
      cacheKey,
      async () => {
        // Cache miss - fetch from database with optimized query
        const realProperties = await realPropertyDataService.searchProperties(filters || {});
        return realProperties.map(prop => this.convertRealPropertyToProperty(prop));
      },
      {
        ttl: 1 * 60 * 1000, // 1 minute for search results
        priority: 'medium',
        invalidateOnUpdate: true
      }
    );
    
    if (cached) {
      // Broadcast search analytics
      connectionPoolManager.sendMessage({
        event: 'property_search_cache_hit',
        filters,
        resultCount: cached.length,
        timestamp: new Date().toISOString(),
        source: 'performance_optimized_cache'
      });
      return cached;
    }
    
    try {
      // Fallback to direct database access
      const realProperties = await realPropertyDataService.searchProperties(filters || {});
      
      // Convert real property data to expected Property format
      const properties: Property[] = realProperties.map(prop => this.convertRealPropertyToProperty(prop));

      // Broadcast search analytics
      realTimeServerManager.triggerEvent('property_search', {
        filters,
        resultCount: properties.length,
        timestamp: new Date().toISOString(),
        source: 'production_database'
      });

      return properties;
    } catch (error) {
      console.error('Failed to fetch properties from database:', error);
      // Fallback to API
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, String(value));
          }
        });
      }
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      return api.get<Property[]>(`/properties${queryString}`);
    }
  }

  async getPropertyById(id: string): Promise<Property | null> {
    try {
      // Use real property data service
      const realProperty = await realPropertyDataService.getPropertyById(id);
      if (!realProperty) return null;

      const property = this.convertRealPropertyToProperty(realProperty);

      // Broadcast property view event
      realTimeServerManager.triggerEvent('property_viewed', {
        propertyId: id,
        propertyName: property.name,
        price: property.price,
        developmentId: property.developmentId,
        timestamp: new Date().toISOString()
      });

      return property;
    } catch (error) {
      console.error(`Failed to fetch property ${id} from database:`, error);
      // Fallback to API
      try {
        return await api.get<Property>(`/properties/${id}`);
      } catch (apiError) {
        return null;
      }
    }
  }

  async getFeaturedProperties(limit = 6): Promise<Property[]> {
    try {
      // Get featured properties from real data
      const realProperties = await realPropertyDataService.getFeaturedProperties(limit);
      const properties: Property[] = realProperties.map(prop => this.convertRealPropertyToProperty(prop));

      return properties;
    } catch (error) {
      console.error('Failed to fetch featured properties:', error);
      // Fallback to API
      return api.get<Property[]>(`/properties/featured?limit=${limit}`);
    }
  }

  async getPropertiesByDevelopment(developmentId: string): Promise<Property[]> {
    try {
      // Use real property data service with development filter
      const realProperties = await realPropertyDataService.searchProperties({
        developmentId: developmentId
      });
      
      const properties: Property[] = realProperties.map(prop => this.convertRealPropertyToProperty(prop));

      // Broadcast development property access
      realTimeServerManager.triggerEvent('development_properties_accessed', {
        developmentId,
        propertyCount: properties.length,
        timestamp: new Date().toISOString()
      });

      return properties;
    } catch (error) {
      console.error(`Failed to fetch properties for development ${developmentId}:`, error);
      // Fallback to API
      return api.get<Property[]>(`/developments/${developmentId}/properties`);
    }
  }

  /**
   * Helper method to convert projects to developments
   */
  private convertProjectsToDevelopments(projects: any[]): Development[] {
    return projects.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description || 'Luxury development project',
      location: project.location || 'Dublin, Ireland',
      image: project.image || `/images/developments/${project.id}/hero.jpg`,
      status: this.mapProjectStatusToDevelopment(project.status),
      statusColor: this.getStatusColor(project.status)
    }));
  }

  /**
   * Helper method to convert real property data to expected Property interface
   */
  private convertRealPropertyToProperty(realProperty: any): Property {
    return {
      id: realProperty.propertyId || realProperty.id,
      name: realProperty.name || `${realProperty.bedrooms} Bed ${realProperty.propertyType}`,
      slug: realProperty.slug || `${realProperty.name?.toLowerCase().replace(/\s+/g, '-')}-${realProperty.id}`,
      developmentId: realProperty.developmentId || 'unknown',
      developmentName: realProperty.developmentName || 'Unknown Development',
      projectId: realProperty.projectId || realProperty.developmentId,
      projectName: realProperty.projectName || realProperty.developmentName,
      projectSlug: realProperty.projectSlug || realProperty.developmentId,
      title: realProperty.title || realProperty.name,
      price: realProperty.currentPrice || realProperty.price || 0,
      bedrooms: realProperty.bedrooms || 0,
      bathrooms: realProperty.bathrooms || 0,
      area: realProperty.floorArea || realProperty.area || 0,
      floorArea: realProperty.floorArea || realProperty.area || 0,
      unitNumber: realProperty.unitNumber || 'TBD',
      status: this.mapRealPropertyStatus(realProperty.currentStatus || realProperty.status),
      type: this.mapRealPropertyType(realProperty.propertyType),
      parkingSpaces: realProperty.parkingSpaces || 0,
      features: realProperty.features || [],
      amenities: realProperty.amenities || [],
      images: realProperty.images || [`/images/properties/${realProperty.id}.jpg`],
      image: realProperty.primaryImage || realProperty.images?.[0] || `/images/properties/${realProperty.id}.jpg`,
      floorPlan: realProperty.floorPlan || `/images/properties/floorplans/${realProperty.id}.jpg`,
      description: realProperty.description || `${realProperty.bedrooms} bedroom ${realProperty.propertyType?.toLowerCase()}`,
      isNew: realProperty.isNew || false,
      isReduced: realProperty.isReduced || false,
      statusColor: this.getPropertyStatusColor(realProperty.currentStatus || realProperty.status),
      createdAt: realProperty.createdAt || new Date().toISOString(),
      updatedAt: realProperty.updatedAt || new Date().toISOString()
    };
  }

  /**
   * Helper methods to map between different data formats
   */
  private mapProjectStatusToDevelopment(projectStatus: string): any {
    const statusMap: Record<string, any> = {
      'ACTIVE': 'SellingFast',
      'PLANNING': 'LaunchingSoon', 
      'CONSTRUCTION': 'NewRelease',
      'COMPLETED': 'Completed',
      'FUTURE': 'Future'
    };
    return statusMap[projectStatus] || 'NewRelease';
  }

  private getStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
      'ACTIVE': 'green-600',
      'PLANNING': 'yellow-600',
      'CONSTRUCTION': 'blue-600', 
      'COMPLETED': 'gray-600',
      'FUTURE': 'purple-600'
    };
    return colorMap[status] || 'blue-600';
  }

  private mapRealPropertyStatus(status: string): any {
    const statusMap: Record<string, any> = {
      'AVAILABLE': 'Available',
      'RESERVED': 'Reserved',
      'SOLD': 'Sold',
      'VIEWING': 'Available'
    };
    return statusMap[status] || 'Available';
  }

  private mapRealPropertyType(type: string): any {
    const typeMap: Record<string, any> = {
      'APARTMENT': 'Apartment',
      'HOUSE': 'Detached',
      'SEMI_DETACHED': 'SemiDetached',
      'TERRACE': 'Terrace',
      'TOWNHOUSE': 'Townhouse'
    };
    return typeMap[type] || 'Detached';
  }

  private getPropertyStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
      'AVAILABLE': 'green-600',
      'RESERVED': 'yellow-600',
      'SOLD': 'gray-600',
      'VIEWING': 'blue-600'
    };
    return colorMap[status] || 'green-600';
  }
}