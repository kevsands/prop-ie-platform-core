/**
 * Real Property Data Service
 * 
 * Database-integrated property data service that replaces mock data
 * with real data from the comprehensive property database schema
 */

import { DataService } from './index';
import { Development } from '../types/developments';
import { Property } from '../types/properties';
import { PropertyStatus, PropertyType, DevelopmentStatus } from '../types/enums';
import { realTimeServerManager } from '@/lib/realtime/realTimeServerManager';

// Use SQLite database for data access
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

/**
 * Real Property Data Service implementation
 */
export class RealPropertyDataService implements DataService {
  private db: any;
  
  constructor() {
    const dbPath = path.join(process.cwd(), 'prisma/dev.db');
    this.db = new sqlite3.Database(dbPath);
  }

  /**
   * Get all developments from database
   */
  async getDevelopments(): Promise<Development[]> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          id, name, description, location, image, status, status_color,
          price_range_display as priceRange, bedrooms_available, energy_rating,
          total_units, available_units, sold_units, reserved_units,
          launch_date, completion_date, developer_name, architect_name
        FROM developments_enhanced 
        ORDER BY name
      `;
      
      this.db.all(query, [], (err: Error, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          const developments: Development[] = rows.map(row => ({
            id: row.id,
            name: row.name,
            description: row.description,
            location: row.location,
            image: row.image,
            status: this.mapDatabaseStatusToDevelopmentStatus(row.status),
            statusColor: row.status_color,
            priceRange: row.priceRange,
            bedrooms: row.bedrooms_available ? JSON.parse(row.bedrooms_available) : [],
            energyRating: row.energy_rating,
            totalUnits: row.total_units,
            availableUnits: row.available_units,
            soldUnits: row.sold_units,
            reservedUnits: row.reserved_units,
            launchDate: row.launch_date,
            completionDate: row.completion_date,
            developerName: row.developer_name,
            architectName: row.architect_name
          }));
          
          resolve(developments);
        }
      });
    });
  }

  /**
   * Get development by ID
   */
  async getDevelopmentById(id: string): Promise<Development | null> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          id, name, description, location, image, status, status_color,
          price_range_min, price_range_max, price_range_display,
          bedrooms_available, bathrooms_typical, square_feet_typical,
          features, amenities, energy_rating, availability_status,
          deposit_amount, deposit_display, showing_dates, floor_plans,
          virtual_tour_url, brochure_url, launch_date, completion_date,
          total_units, available_units, sold_units, reserved_units,
          developer_name, architect_name, contact_phone, contact_email,
          sales_office_address, marketing_suite_open, coordinates_lat,
          coordinates_lng, nearby_amenities, transport_links, schools_nearby
        FROM developments_enhanced 
        WHERE id = ?
      `;
      
      this.db.get(query, [id], (err: Error, row: any) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          const development: Development = {
            id: row.id,
            name: row.name,
            description: row.description,
            location: row.location,
            image: row.image,
            status: this.mapDatabaseStatusToDevelopmentStatus(row.status),
            statusColor: row.status_color,
            priceRange: row.price_range_display,
            priceRangeMin: row.price_range_min,
            priceRangeMax: row.price_range_max,
            bedrooms: row.bedrooms_available ? JSON.parse(row.bedrooms_available) : [],
            bathrooms: row.bathrooms_typical,
            squareFeet: row.square_feet_typical,
            features: row.features ? JSON.parse(row.features) : [],
            amenities: row.amenities ? JSON.parse(row.amenities) : [],
            energyRating: row.energy_rating,
            availability: row.availability_status,
            depositAmount: row.deposit_display,
            showingDates: row.showing_dates ? JSON.parse(row.showing_dates) : [],
            floorPlans: row.floor_plans ? JSON.parse(row.floor_plans) : [],
            virtualTourUrl: row.virtual_tour_url,
            brochureUrl: row.brochure_url,
            launchDate: row.launch_date,
            completionDate: row.completion_date,
            totalUnits: row.total_units,
            availableUnits: row.available_units,
            soldUnits: row.sold_units,
            reservedUnits: row.reserved_units,
            developerName: row.developer_name,
            architectName: row.architect_name,
            contactPhone: row.contact_phone,
            contactEmail: row.contact_email,
            salesOfficeAddress: row.sales_office_address,
            marketingSuiteOpen: row.marketing_suite_open,
            coordinates: row.coordinates_lat && row.coordinates_lng ? {
              lat: row.coordinates_lat,
              lng: row.coordinates_lng
            } : undefined,
            nearbyAmenities: row.nearby_amenities ? JSON.parse(row.nearby_amenities) : [],
            transportLinks: row.transport_links ? JSON.parse(row.transport_links) : [],
            schoolsNearby: row.schools_nearby ? JSON.parse(row.schools_nearby) : []
          };
          
          resolve(development);
        }
      });
    });
  }

  /**
   * Get featured developments
   */
  async getFeaturedDevelopments(limit = 4): Promise<Development[]> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          id, name, description, location, image, status, status_color,
          price_range_display as priceRange, energy_rating,
          total_units, available_units, sold_units
        FROM developments_enhanced 
        WHERE status IN ('now_selling', 'coming_soon', 'register_interest')
        ORDER BY 
          CASE status 
            WHEN 'now_selling' THEN 1 
            WHEN 'coming_soon' THEN 2 
            ELSE 3 
          END,
          available_units DESC
        LIMIT ?
      `;
      
      this.db.all(query, [limit], (err: Error, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          const developments: Development[] = rows.map(row => ({
            id: row.id,
            name: row.name,
            description: row.description,
            location: row.location,
            image: row.image,
            status: this.mapDatabaseStatusToDevelopmentStatus(row.status),
            statusColor: row.status_color,
            priceRange: row.priceRange,
            energyRating: row.energy_rating,
            totalUnits: row.total_units,
            availableUnits: row.available_units,
            soldUnits: row.sold_units
          }));
          
          resolve(developments);
        }
      });
    });
  }

  /**
   * Get properties with optional filters
   */
  async getProperties(filters?: any): Promise<Property[]> {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT 
          id, name, slug, development_id, development_name, title,
          description, price, bedrooms, bathrooms, area, unit_number,
          status, type, parking_spaces, features, amenities, images,
          main_image, floor_plan, energy_rating, is_new, is_reduced,
          is_featured, htb_eligible, view_description, created_at, updated_at
        FROM properties_enhanced 
        WHERE 1=1
      `;
      
      const params: any[] = [];
      
      // Apply filters
      if (filters) {
        if (filters.developmentId) {
          query += ' AND development_id = ?';
          params.push(filters.developmentId);
        }
        
        if (filters.minBedrooms) {
          query += ' AND bedrooms >= ?';
          params.push(filters.minBedrooms);
        }
        
        if (filters.maxBedrooms) {
          query += ' AND bedrooms <= ?';
          params.push(filters.maxBedrooms);
        }
        
        if (filters.minPrice) {
          query += ' AND price >= ?';
          params.push(filters.minPrice);
        }
        
        if (filters.maxPrice) {
          query += ' AND price <= ?';
          params.push(filters.maxPrice);
        }
        
        if (filters.status) {
          query += ' AND status = ?';
          params.push(filters.status);
        }
        
        if (filters.type) {
          query += ' AND type = ?';
          params.push(filters.type);
        }
        
        if (filters.location) {
          query += ' AND development_name LIKE ?';
          params.push(`%${filters.location}%`);
        }
        
        if (filters.htbEligible) {
          query += ' AND htb_eligible = 1';
        }
        
        if (filters.isNew) {
          query += ' AND is_new = 1';
        }
        
        if (filters.isFeatured) {
          query += ' AND is_featured = 1';
        }
      }
      
      query += ' ORDER BY is_featured DESC, price ASC';
      
      if (filters?.limit) {
        query += ' LIMIT ?';
        params.push(filters.limit);
      }
      
      this.db.all(query, params, (err: Error, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          const properties: Property[] = rows.map(row => this.mapDatabaseRowToProperty(row));
          resolve(properties);
        }
      });
    });
  }

  /**
   * Get property by ID
   */
  async getPropertyById(id: string): Promise<Property | null> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM properties_enhanced WHERE id = ?
      `;
      
      this.db.get(query, [id], (err: Error, row: any) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          const property = this.mapDatabaseRowToProperty(row);
          resolve(property);
        }
      });
    });
  }

  /**
   * Get featured properties
   */
  async getFeaturedProperties(limit = 6): Promise<Property[]> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          id, name, slug, development_id, development_name, title,
          description, price, bedrooms, bathrooms, area, unit_number,
          status, type, parking_spaces, features, amenities, images,
          main_image, floor_plan, energy_rating, is_new, is_reduced,
          is_featured, htb_eligible, view_description, created_at, updated_at
        FROM properties_enhanced 
        WHERE status = 'available' 
        AND (is_featured = 1 OR is_new = 1)
        ORDER BY is_featured DESC, is_new DESC, price ASC
        LIMIT ?
      `;
      
      this.db.all(query, [limit], (err: Error, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          const properties: Property[] = rows.map(row => this.mapDatabaseRowToProperty(row));
          resolve(properties);
        }
      });
    });
  }

  /**
   * Get properties by development
   */
  async getPropertiesByDevelopment(developmentId: string): Promise<Property[]> {
    return this.getProperties({ developmentId });
  }

  /**
   * Search properties by criteria
   */
  async searchProperties(searchTerm: string, filters?: any): Promise<Property[]> {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT 
          id, name, slug, development_id, development_name, title,
          description, price, bedrooms, bathrooms, area, unit_number,
          status, type, parking_spaces, features, amenities, images,
          main_image, floor_plan, energy_rating, is_new, is_reduced,
          is_featured, htb_eligible, view_description, created_at, updated_at
        FROM properties_enhanced 
        WHERE (
          name LIKE ? OR 
          title LIKE ? OR 
          description LIKE ? OR 
          development_name LIKE ?
        )
      `;
      
      const searchPattern = `%${searchTerm}%`;
      const params = [searchPattern, searchPattern, searchPattern, searchPattern];
      
      // Apply additional filters
      if (filters) {
        if (filters.minPrice) {
          query += ' AND price >= ?';
          params.push(filters.minPrice);
        }
        
        if (filters.maxPrice) {
          query += ' AND price <= ?';
          params.push(filters.maxPrice);
        }
        
        if (filters.bedrooms) {
          query += ' AND bedrooms = ?';
          params.push(filters.bedrooms);
        }
        
        if (filters.status) {
          query += ' AND status = ?';
          params.push(filters.status);
        }
      }
      
      query += ' ORDER BY is_featured DESC, price ASC LIMIT 50';
      
      this.db.all(query, params, (err: Error, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          const properties: Property[] = rows.map(row => this.mapDatabaseRowToProperty(row));
          resolve(properties);
        }
      });
    });
  }

  /**
   * Get property statistics
   */
  async getPropertyStatistics(): Promise<{
    totalProperties: number;
    availableProperties: number;
    averagePrice: number;
    priceRange: { min: number; max: number };
    developmentCount: number;
  }> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          COUNT(*) as totalProperties,
          SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as availableProperties,
          AVG(price) as averagePrice,
          MIN(price) as minPrice,
          MAX(price) as maxPrice,
          COUNT(DISTINCT development_id) as developmentCount
        FROM properties_enhanced
      `;
      
      this.db.get(query, [], (err: Error, row: any) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            totalProperties: row.totalProperties,
            availableProperties: row.availableProperties,
            averagePrice: Math.round(row.averagePrice),
            priceRange: {
              min: row.minPrice,
              max: row.maxPrice
            },
            developmentCount: row.developmentCount
          });
        }
      });
    });
  }

  /**
   * Helper method to map database row to Property object
   */
  private mapDatabaseRowToProperty(row: any): Property {
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      developmentId: row.development_id,
      developmentName: row.development_name,
      projectId: row.development_id,
      projectName: row.development_name,
      projectSlug: row.development_id,
      title: row.title,
      description: row.description,
      price: row.price,
      bedrooms: row.bedrooms,
      bathrooms: row.bathrooms,
      area: row.area,
      floorArea: row.floor_area || row.area,
      unitNumber: row.unit_number,
      status: this.mapDatabaseStatusToPropertyStatus(row.status),
      type: this.mapDatabaseTypeToPropertyType(row.type),
      parkingSpaces: row.parking_spaces,
      features: row.features ? JSON.parse(row.features) : [],
      amenities: row.amenities ? JSON.parse(row.amenities) : [],
      images: row.images ? JSON.parse(row.images) : [],
      image: row.main_image,
      floorPlan: row.floor_plan,
      energyRating: row.energy_rating,
      isNew: Boolean(row.is_new),
      isReduced: Boolean(row.is_reduced),
      isFeatured: Boolean(row.is_featured),
      htbEligible: Boolean(row.htb_eligible),
      viewDescription: row.view_description,
      statusColor: row.status_color || 'green-600',
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      // Additional fields for compatibility
      garden: Boolean(row.garden),
      balcony: Boolean(row.balcony),
      garage: Boolean(row.garage),
      reducedFromPrice: row.reduced_from_price,
      htbGrantAmount: row.htb_grant_amount,
      pricePerSqm: row.price_per_sqm,
      completionDate: row.completion_date,
      virtualTourUrl: row.virtual_tour_url
    };
  }

  /**
   * Helper method to map database status to DevelopmentStatus enum
   */
  private mapDatabaseStatusToDevelopmentStatus(status: string): DevelopmentStatus {
    const statusMap: { [key: string]: DevelopmentStatus } = {
      'now_selling': DevelopmentStatus.SellingFast,
      'coming_soon': DevelopmentStatus.LaunchingSoon,
      'register_interest': DevelopmentStatus.NewRelease,
      'completed': DevelopmentStatus.Completed,
      'planning': DevelopmentStatus.Future
    };
    
    return statusMap[status] || DevelopmentStatus.LaunchingSoon;
  }

  /**
   * Helper method to map database status to PropertyStatus enum
   */
  private mapDatabaseStatusToPropertyStatus(status: string): PropertyStatus {
    const statusMap: { [key: string]: PropertyStatus } = {
      'available': PropertyStatus.Available,
      'reserved': PropertyStatus.Reserved,
      'sold': PropertyStatus.Sold,
      'viewing_arranged': PropertyStatus.Available // Map viewing arranged to available
    };
    
    return statusMap[status] || PropertyStatus.Available;
  }

  /**
   * Helper method to map database type to PropertyType enum
   */
  private mapDatabaseTypeToPropertyType(type: string): PropertyType {
    const typeMap: { [key: string]: PropertyType } = {
      'apartment': PropertyType.Apartment,
      'house': PropertyType.House,
      'detached': PropertyType.Detached,
      'semi_detached': PropertyType.SemiDetached,
      'terrace': PropertyType.Terrace,
      'townhouse': PropertyType.Townhouse,
      'duplex': PropertyType.Duplex,
      'penthouse': PropertyType.Penthouse
    };
    
    return typeMap[type] || PropertyType.House;
  }

  /**
   * Update property status with real-time broadcasting
   */
  async updatePropertyStatus(propertyId: string, newStatus: PropertyStatus, updatedBy: string = 'system'): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE properties_enhanced 
        SET status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      this.db.run(query, [newStatus, propertyId], function(this: any, err: Error) {
        if (err) {
          console.error('Error updating property status:', err);
          reject(err);
        } else {
          if (this.changes > 0) {
            // Get updated property data for broadcasting
            const selectQuery = `SELECT * FROM properties_enhanced WHERE id = ?`;
            
            this.db.get(selectQuery, [propertyId], (selectErr: Error, row: any) => {
              if (!selectErr && row) {
                // Broadcast real-time property update
                const propertyData = {
                  propertyId: row.id,
                  updatedData: {
                    status: row.status,
                    price: row.price,
                    availability: row.status === 'available' ? 'Available' : 'Unavailable',
                    lastUpdated: new Date().toISOString()
                  },
                  updatedBy,
                  timestamp: new Date().toISOString()
                };

                realTimeServerManager.triggerEvent('property_updated', propertyData);
                realTimeServerManager.broadcastToRoles(
                  ['BUYER', 'ESTATE_AGENT', 'DEVELOPER', 'ADMIN'],
                  'property_update',
                  propertyData
                );
                
                console.log(`📡 Broadcasted property status update: ${propertyId} -> ${newStatus}`);
              }
            });
            
            resolve(true);
          } else {
            resolve(false);
          }
        }
      });
    });
  }

  /**
   * Update property price with real-time broadcasting
   */
  async updatePropertyPrice(propertyId: string, newPrice: number, updatedBy: string = 'system'): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE properties_enhanced 
        SET price = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      this.db.run(query, [newPrice, propertyId], function(this: any, err: Error) {
        if (err) {
          console.error('Error updating property price:', err);
          reject(err);
        } else {
          if (this.changes > 0) {
            // Broadcast real-time property update
            const propertyData = {
              propertyId,
              updatedData: {
                price: newPrice,
                priceFormatted: `€${newPrice.toLocaleString()}`,
                lastUpdated: new Date().toISOString()
              },
              updatedBy,
              timestamp: new Date().toISOString(),
              type: 'price_change'
            };

            realTimeServerManager.triggerEvent('property_updated', propertyData);
            realTimeServerManager.broadcastToRoles(
              ['BUYER', 'ESTATE_AGENT', 'DEVELOPER', 'ADMIN'],
              'property_update',
              propertyData
            );
            
            console.log(`📡 Broadcasted property price update: ${propertyId} -> €${newPrice.toLocaleString()}`);
            resolve(true);
          } else {
            resolve(false);
          }
        }
      });
    });
  }

  /**
   * Reserve property with real-time broadcasting
   */
  async reserveProperty(propertyId: string, buyerId: string, reservationDetails?: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE properties_enhanced 
        SET status = 'reserved', updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND status = 'available'
      `;
      
      this.db.run(query, [propertyId], function(this: any, err: Error) {
        if (err) {
          reject(err);
        } else {
          if (this.changes > 0) {
            // Broadcast real-time property reservation
            const reservationData = {
              propertyId,
              updatedData: {
                status: 'reserved',
                reservedBy: buyerId,
                reservationDate: new Date().toISOString()
              },
              updatedBy: buyerId,
              timestamp: new Date().toISOString(),
              type: 'reservation'
            };

            realTimeServerManager.triggerEvent('property_updated', reservationData);
            realTimeServerManager.broadcastToUsers([buyerId], 'property_update', reservationData);
            realTimeServerManager.broadcastToRoles(
              ['ESTATE_AGENT', 'DEVELOPER', 'ADMIN'],
              'property_update',
              reservationData
            );
            
            console.log(`📡 Broadcasted property reservation: ${propertyId} by ${buyerId}`);
            resolve(true);
          } else {
            resolve(false);
          }
        }
      });
    });
  }

  /**
   * Cleanup database connection
   */
  async disconnect(): Promise<void> {
    return new Promise((resolve) => {
      this.db.close((err: Error) => {
        if (err) {
          console.error('Error closing database:', err);
        }
        resolve();
      });
    });
  }
}

// Export singleton instance
export const realPropertyDataService = new RealPropertyDataService();
export default realPropertyDataService;