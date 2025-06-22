// src/services/propertyService.ts

import { useState, useEffect } from 'react';
import { Property } from '../types/properties';
import { PropertyStatus, PropertyType } from '../types/enums';
import { PropertySearchParams, PropertyListResponse } from '../types/search';
import { useSession } from 'next-auth/react';

// Real database connection for fetching property data
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database helper functions
const getDatabase = () => {
  const dbPath = path.join(process.cwd(), 'prisma/dev.db');
  return new sqlite3.Database(dbPath);
};

const convertUnitToProperty = (unit: any, development: any): Property => {
  return {
    id: unit.id,
    name: unit.name,
    slug: unit.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    description: `${unit.name} in ${development.name}`,
    price: unit.price,
    status: unit.status === 'available' ? PropertyStatus.Available : 
            unit.status === 'sold' ? PropertyStatus.Sold : PropertyStatus.Reserved,
    type: unit.type.includes('apartment') ? PropertyType.Apartment : 
          unit.type.includes('house') ? PropertyType.House : PropertyType.Duplex,
    bedrooms: parseInt(unit.type.charAt(0)) || 1,
    bathrooms: parseInt(unit.type.charAt(0)) || 1,
    parkingSpaces: unit.type.includes('detached') ? 2 : 1,
    floorArea: unit.type.includes('1_bed') ? 58 : 
               unit.type.includes('2_bed') ? 85 : 
               unit.type.includes('3_bed') ? 125 : 165,
    features: ['Modern Kitchen', 'Premium Finishes', 'Energy Efficient'],
    amenities: ['Parking', 'Secure Access'],
    images: [`/images/properties/${unit.id}-1.jpg`],
    floorPlan: `/floorplans/${unit.type}.pdf`,
    virtualTourUrl: `/virtual-tours/${unit.developmentId}`,
    projectId: unit.developmentId,
    projectName: development.name,
    projectSlug: unit.developmentId,
    unitNumber: unit.id.split('-').pop() || '',
    developmentId: unit.developmentId,
    developmentName: development.name,
    address: { city: development.location, state: '', country: 'Ireland' },
    createdAt: unit.createdAt || new Date().toISOString(),
    updatedAt: unit.updatedAt || new Date().toISOString()
  };
};

interface FeaturedPropertiesResult {
  properties: Property[];
  loading: boolean;
  error: string | null;
}

// Custom hook for fetching featured properties from real database
export function useFeaturedProperties(): FeaturedPropertiesResult {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        
        // Get featured properties from real database
        const db = getDatabase();
        
        const units = await new Promise<any[]>((resolve, reject) => {
          db.all(`
            SELECT u.*, d.name as developmentName, d.location, d.description as devDescription
            FROM Unit u
            JOIN Development d ON u.developmentId = d.id 
            WHERE u.status = 'available'
            ORDER BY u.price DESC
            LIMIT 6
          `, [], (err: Error, rows: any[]) => {
            if (err) reject(err);
            else resolve(rows);
          });
        });

        const developments = await new Promise<any[]>((resolve, reject) => {
          db.all(`SELECT * FROM Development`, [], (err: Error, rows: any[]) => {
            if (err) reject(err);
            else resolve(rows);
          });
        });

        db.close();

        const featuredProperties = units.map(unit => {
          const development = developments.find(d => d.id === unit.developmentId);
          return convertUnitToProperty(unit, development);
        });

        setProperties(featuredProperties);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchProperties();
  }, [session]);

  return { properties, loading, error };
}

interface ProjectPropertiesResult {
  properties: Property[];
  loading: boolean;
  error: string | null;
}

// Custom hook for fetching properties by project slug from real database
export function useProjectProperties(projectSlug: string): ProjectPropertiesResult {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchProjectProperties = async () => {
      try {
        setLoading(true);
        
        // Get properties for specific project from real database
        const db = getDatabase();
        
        const units = await new Promise<any[]>((resolve, reject) => {
          db.all(`
            SELECT u.*, d.name as developmentName, d.location, d.description as devDescription
            FROM Unit u
            JOIN Development d ON u.developmentId = d.id 
            WHERE u.developmentId = ?
            ORDER BY u.price ASC
          `, [projectSlug], (err: Error, rows: any[]) => {
            if (err) reject(err);
            else resolve(rows);
          });
        });

        const development = await new Promise<any>((resolve, reject) => {
          db.get(`SELECT * FROM Development WHERE id = ?`, [projectSlug], (err: Error, row: any) => {
            if (err) reject(err);
            else resolve(row);
          });
        });

        db.close();

        if (!development) {
          setError('Project not found');
          setLoading(false);
          return;
        }

        const projectProperties = units.map(unit => convertUnitToProperty(unit, development));
        setProperties(projectProperties);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchProjectProperties();
  }, [projectSlug, session]);

  return { properties, loading, error };
}

interface PropertyDetailsResult {
  property: Property | null;
  loading: boolean;
  error: string | null;
}

// Custom hook for fetching property details by ID from real database
export function usePropertyDetails(projectSlug: string, propertyId: string): PropertyDetailsResult {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        
        // Get specific property from real database
        const db = getDatabase();
        
        const unit = await new Promise<any>((resolve, reject) => {
          db.get(`
            SELECT u.*, d.name as developmentName, d.location, d.description as devDescription
            FROM Unit u
            JOIN Development d ON u.developmentId = d.id 
            WHERE u.id = ? AND u.developmentId = ?
          `, [propertyId, projectSlug], (err: Error, row: any) => {
            if (err) reject(err);
            else resolve(row);
          });
        });

        const development = await new Promise<any>((resolve, reject) => {
          db.get(`SELECT * FROM Development WHERE id = ?`, [projectSlug], (err: Error, row: any) => {
            if (err) reject(err);
            else resolve(row);
          });
        });

        db.close();

        if (!unit || !development) {
          setError('Property not found');
          setLoading(false);
          return;
        }

        const propertyDetails = convertUnitToProperty(unit, development);
        setProperty(propertyDetails);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [projectSlug, propertyId, session]);

  return { property, loading, error };
}

interface SearchPropertiesResult extends PropertyListResponse {
  loading: boolean;
  error: string | null;
}

// Custom hook for searching properties with filters from real database
export function useSearchProperties(params: PropertySearchParams): SearchPropertiesResult {
  const [result, setResult] = useState<PropertyListResponse>({
    properties: [],
    totalCount: 0,
    currentPage: 1,
    totalPages: 0
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const searchProperties = async () => {
      try {
        setLoading(true);
        
        // Build dynamic SQL query with filters
        const db = getDatabase();
        let whereClause = 'WHERE 1=1';
        const queryParams: any[] = [];
        
        if (params.projectSlug) {
          whereClause += ' AND u.developmentId = ?';
          queryParams.push(params.projectSlug);
        }
        
        if (params.minPrice) {
          whereClause += ' AND u.price >= ?';
          queryParams.push(params.minPrice);
        }
        
        if (params.maxPrice) {
          whereClause += ' AND u.price <= ?';
          queryParams.push(params.maxPrice);
        }
        
        if (params.status?.length) {
          const statusFilter = params.status.map(s => 
            s === PropertyStatus.Available ? 'available' :
            s === PropertyStatus.Sold ? 'sold' : 'reserved'
          );
          whereClause += ` AND u.status IN (${statusFilter.map(() => '?').join(',')})`;
          queryParams.push(...statusFilter);
        }

        if (params.query) {
          whereClause += ' AND (u.name LIKE ? OR d.name LIKE ? OR d.location LIKE ?)';
          const searchTerm = `%${params.query}%`;
          queryParams.push(searchTerm, searchTerm, searchTerm);
        }

        // Get total count first
        const countQuery = `
          SELECT COUNT(*) as total
          FROM Unit u
          JOIN Development d ON u.developmentId = d.id 
          ${whereClause}
        `;

        const totalCount = await new Promise<number>((resolve, reject) => {
          db.get(countQuery, queryParams, (err: Error, row: any) => {
            if (err) reject(err);
            else resolve(row.total);
          });
        });

        // Build main query with sorting and pagination
        const page = params.page || 1;
        const limit = params.limit || 10;
        const totalPages = Math.ceil(totalCount / limit);
        const offset = (page - 1) * limit;

        let orderBy = 'ORDER BY u.price ASC';
        if (params.sort === 'price') orderBy = 'ORDER BY u.price ASC';
        else if (params.sort === 'name') orderBy = 'ORDER BY u.name ASC';

        const mainQuery = `
          SELECT u.*, d.name as developmentName, d.location, d.description as devDescription
          FROM Unit u
          JOIN Development d ON u.developmentId = d.id 
          ${whereClause}
          ${orderBy}
          LIMIT ? OFFSET ?
        `;

        const units = await new Promise<any[]>((resolve, reject) => {
          db.all(mainQuery, [...queryParams, limit, offset], (err: Error, rows: any[]) => {
            if (err) reject(err);
            else resolve(rows);
          });
        });

        const developments = await new Promise<any[]>((resolve, reject) => {
          db.all(`SELECT * FROM Development`, [], (err: Error, rows: any[]) => {
            if (err) reject(err);
            else resolve(rows);
          });
        });

        db.close();

        const searchResults = units.map(unit => {
          const development = developments.find(d => d.id === unit.developmentId);
          return convertUnitToProperty(unit, development);
        });

        // Apply additional filters that require property conversion
        let filteredResults = searchResults;

        if (params.minBedrooms) {
          filteredResults = filteredResults.filter(
            property => property.bedrooms >= params.minBedrooms!
          );
        }

        if (params.type?.length) {
          filteredResults = filteredResults.filter(
            property => params.type?.includes(property.type)
          );
        }

        setResult({ 
          properties: filteredResults, 
          totalCount, 
          currentPage: page, 
          totalPages 
        });
        
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    searchProperties();
  }, [params, session]);

  return { ...result, loading, error };
}