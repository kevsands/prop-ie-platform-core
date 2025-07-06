/**
 * Real Developments/Properties Service for database operations
 * Works with existing SQLite database structure
 */

import sqlite3 from 'sqlite3';
import path from 'path';

const { Database } = sqlite3;

const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');

// Types that match the existing database structure
export type Development = {
  id: string;
  name: string;
  description?: string;
  location: string;
  city: string;
  county: string;
  eircode?: string;
  status: string;
  developerId: string;
  mainImage: string;
  imagesData: string; // JSON string
  videosData?: string; // JSON string
  sitePlanUrl?: string;
  brochureUrl?: string;
  totalUnits: number;
  startDate?: Date;
  estimatedCompletion?: Date;
  actualCompletion?: Date;
  shortDescription?: string;
  featuresData?: string; // JSON string
  amenitiesData?: string; // JSON string
  buildingSpecs?: string; // JSON string
  startingPrice?: number;
  avgPrice?: number;
  totalValue?: number;
  isPublished: boolean;
  tagsData?: string; // JSON string
  awardsData?: string; // JSON string
  createdAt: Date;
  updatedAt: Date;
};

export type Unit = {
  id: string;
  developmentId: string;
  unitNumber: string;
  unitType: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  floorArea: number;
  price: number;
  floorPlan?: string;
  imagesData?: string; // JSON string
  featuresData?: string; // JSON string
  customizationsData?: string; // JSON string
  berRating?: string;
  orientation?: string;
  floor?: number;
  isAccessible: boolean;
  parkingSpaces: number;
  storageSpaces: number;
  balconyArea?: number;
  gardenArea?: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateDevelopmentInput = {
  name: string;
  description?: string;
  location: string;
  city: string;
  county: string;
  eircode?: string;
  status: string;
  developerId: string;
  mainImage: string;
  imagesData?: string[];
  totalUnits: number;
  startingPrice?: number;
  avgPrice?: number;
  isPublished?: boolean;
  featuresData?: string[];
  amenitiesData?: string[];
};

/**
 * Real developments service with SQLite database operations
 */
export const developmentsService = {
  /**
   * Get all developments with optional filtering
   */
  getDevelopments: async (filters?: { 
    status?: string; 
    isPublished?: boolean; 
    search?: string;
    city?: string;
  }): Promise<Development[]> => {
    return new Promise((resolve, reject) => {
      const db = new Database(dbPath);
      
      let query = 'SELECT * FROM developments';
      const params: any[] = [];
      const conditions: string[] = [];
      
      if (filters?.isPublished !== undefined) {
        conditions.push('isPublished = ?');
        params.push(filters.isPublished ? 1 : 0);
      }
      
      if (filters?.status) {
        conditions.push('status = ?');
        params.push(filters.status);
      }
      
      if (filters?.city) {
        conditions.push('city = ?');
        params.push(filters.city);
      }
      
      if (filters?.search) {
        conditions.push('(name LIKE ? OR description LIKE ? OR location LIKE ?)');
        const searchPattern = `%${filters.search}%`;
        params.push(searchPattern, searchPattern, searchPattern);
      }
      
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
      
      query += ' ORDER BY createdAt DESC';
      
      db.all(query, params, (err, rows: any[]) => {
        db.close();
        if (err) {
          reject(new Error('Failed to fetch developments: ' + err.message));
          return;
        }
        
        const developments = rows.map(row => ({
          ...row,
          isPublished: !!row.isPublished,
          createdAt: new Date(row.createdAt),
          updatedAt: new Date(row.updatedAt),
          startDate: row.startDate ? new Date(row.startDate) : undefined,
          estimatedCompletion: row.estimatedCompletion ? new Date(row.estimatedCompletion) : undefined,
          actualCompletion: row.actualCompletion ? new Date(row.actualCompletion) : undefined,
        }));
        
        resolve(developments);
      });
    });
  },

  /**
   * Get a single development by ID
   */
  getDevelopmentById: async (id: string): Promise<Development | null> => {
    return new Promise((resolve, reject) => {
      const db = new Database(dbPath);
      
      db.get('SELECT * FROM developments WHERE id = ?', [id], (err, row: any) => {
        db.close();
        if (err) {
          reject(new Error('Failed to fetch development: ' + err.message));
          return;
        }
        
        if (!row) {
          resolve(null);
          return;
        }
        
        resolve({
          ...row,
          isPublished: !!row.isPublished,
          createdAt: new Date(row.createdAt),
          updatedAt: new Date(row.updatedAt),
          startDate: row.startDate ? new Date(row.startDate) : undefined,
          estimatedCompletion: row.estimatedCompletion ? new Date(row.estimatedCompletion) : undefined,
          actualCompletion: row.actualCompletion ? new Date(row.actualCompletion) : undefined,
        });
      });
    });
  },

  /**
   * Get units for a development
   */
  getUnitsByDevelopmentId: async (developmentId: string): Promise<Unit[]> => {
    return new Promise((resolve, reject) => {
      const db = new Database(dbPath);
      
      db.all('SELECT * FROM units WHERE developmentId = ? ORDER BY unitNumber', [developmentId], (err, rows: any[]) => {
        db.close();
        if (err) {
          reject(new Error('Failed to fetch units: ' + err.message));
          return;
        }
        
        const units = rows.map(row => ({
          ...row,
          isAccessible: !!row.isAccessible,
          createdAt: new Date(row.createdAt),
          updatedAt: new Date(row.updatedAt),
        }));
        
        resolve(units);
      });
    });
  },

  /**
   * Get a single unit by ID
   */
  getUnitById: async (id: string): Promise<Unit | null> => {
    return new Promise((resolve, reject) => {
      const db = new Database(dbPath);
      
      db.get('SELECT * FROM units WHERE id = ?', [id], (err, row: any) => {
        db.close();
        if (err) {
          reject(new Error('Failed to fetch unit: ' + err.message));
          return;
        }
        
        if (!row) {
          resolve(null);
          return;
        }
        
        resolve({
          ...row,
          isAccessible: !!row.isAccessible,
          createdAt: new Date(row.createdAt),
          updatedAt: new Date(row.updatedAt),
        });
      });
    });
  },

  /**
   * Create a new development
   */
  /**
   * Get all units with optional filtering
   */
  getUnits: async (filters?: { 
    developmentId?: string;
    status?: string; 
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    type?: string;
  }): Promise<Unit[]> => {
    return new Promise((resolve, reject) => {
      const db = new Database(dbPath);
      
      let query = 'SELECT * FROM units';
      const params: any[] = [];
      const conditions: string[] = [];
      
      if (filters?.developmentId) {
        conditions.push('developmentId = ?');
        params.push(filters.developmentId);
      }
      
      if (filters?.status) {
        conditions.push('status = ?');
        params.push(filters.status);
      }
      
      if (filters?.minPrice) {
        conditions.push('price >= ?');
        params.push(filters.minPrice);
      }
      
      if (filters?.maxPrice) {
        conditions.push('price <= ?');
        params.push(filters.maxPrice);
      }
      
      if (filters?.bedrooms) {
        conditions.push('bedrooms = ?');
        params.push(filters.bedrooms);
      }
      
      if (filters?.type) {
        conditions.push('type = ?');
        params.push(filters.type);
      }
      
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
      
      query += ' ORDER BY unitNumber';
      
      db.all(query, params, (err, rows: any[]) => {
        db.close();
        if (err) {
          reject(new Error('Failed to fetch units: ' + err.message));
          return;
        }
        
        const units = rows.map(row => ({
          ...row,
          createdAt: new Date(row.createdAt),
          updatedAt: new Date(row.updatedAt),
          availableFrom: row.availableFrom ? new Date(row.availableFrom) : undefined,
          estimatedCompletion: row.estimatedCompletion ? new Date(row.estimatedCompletion) : undefined,
        }));
        
        resolve(units);
      });
    });
  },

  createDevelopment: async (developmentData: CreateDevelopmentInput): Promise<Development> => {
    return new Promise((resolve, reject) => {
      const db = new Database(dbPath);
      
      // Check if development with this name already exists
      db.get('SELECT id FROM developments WHERE name = ?', [developmentData.name], (err, existingDev) => {
        if (err) {
          db.close();
          reject(new Error('Database error: ' + err.message));
          return;
        }
        
        if (existingDev) {
          db.close();
          reject(new Error('Development with this name already exists'));
          return;
        }
        
        // Generate unique ID
        const devId = 'dev_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        const now = new Date().toISOString();
        
        // Convert arrays to JSON strings
        const imagesData = JSON.stringify(developmentData.imagesData || []);
        const featuresData = JSON.stringify(developmentData.featuresData || []);
        const amenitiesData = JSON.stringify(developmentData.amenitiesData || []);
        
        const insertQuery = `
          INSERT INTO developments (
            id, name, description, location, city, county, eircode, status, 
            developerId, mainImage, imagesData, totalUnits, startingPrice, 
            avgPrice, isPublished, featuresData, amenitiesData, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        db.run(insertQuery, [
          devId,
          developmentData.name,
          developmentData.description || null,
          developmentData.location,
          developmentData.city,
          developmentData.county,
          developmentData.eircode || null,
          developmentData.status,
          developmentData.developerId,
          developmentData.mainImage,
          imagesData,
          developmentData.totalUnits,
          developmentData.startingPrice || null,
          developmentData.avgPrice || null,
          developmentData.isPublished ? 1 : 0,
          featuresData,
          amenitiesData,
          now,
          now
        ], function(err) {
          if (err) {
            db.close();
            reject(new Error('Failed to create development: ' + err.message));
            return;
          }
          
          // Return the created development
          db.get('SELECT * FROM developments WHERE id = ?', [devId], (err, row: any) => {
            db.close();
            if (err) {
              reject(new Error('Failed to retrieve created development: ' + err.message));
              return;
            }
            
            resolve({
              ...row,
              isPublished: !!row.isPublished,
              createdAt: new Date(row.createdAt),
              updatedAt: new Date(row.updatedAt),
            });
          });
        });
      });
    });
  }
};

export default developmentsService;