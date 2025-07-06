/**
 * Units Service for Prop.ie platform
 * Handles units (properties/apartments) listings, details, and management
 */

import { api } from "../api-client";
import { UnitStatus, UnitType } from "../../types/properties";

/**
 * Unit type definition
 */
export type Unit = {
  id: string;
  name: string;
  developmentId: string;
  type: UnitType;
  size: number;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  parkingSpaces: number;
  basePrice: number;
  status: UnitStatus;
  berRating: string;
  features: string[];
  primaryImage: string;
  images: string[];
  floorplans: string[];
  virtualTourUrl?: string;
  unitNumber?: string;
  block?: string;
  floor?: number;
  aspect?: string;
  availableFrom?: string;
  reservationEndDate?: string;
  lastViewed?: string;
  viewCount: number;
  updatedAt: string;
  slug?: string;
};

/**
 * Unit filters type definition
 */
export type UnitFilters = {
  developmentId?: string;
  status?: UnitStatus;
  type?: UnitType;
  minBedrooms?: number;
  maxBedrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  minSize?: number;
  maxSize?: number;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

/**
 * Units service with methods for unit management
 */
export const unitsService = {
  /**
   * Get all units with optional filtering
   */
  getUnits: (filters?: UnitFilters) => 
    api.get<Unit[]>("/units", { 
      params: filters 
    }),

  /**
   * Get a specific unit by ID
   */
  getUnitById: (id: string) => 
    api.get<Unit>(`/units/${id}`),

  /**
   * Get units by development ID
   */
  getUnitsByDevelopment: (developmentId: string, filters?: Omit<UnitFilters, 'developmentId'>) => 
    api.get<Unit[]>(`/units`, { 
      params: { 
        developmentId,
        ...filters
      } 
    }),

  /**
   * Create a new unit
   */
  createUnit: (unit: Omit<Unit, "id" | "updatedAt" | "viewCount">) => 
    api.post<Unit>("/units", unit),

  /**
   * Update an existing unit
   */
  updateUnit: (id: string, unit: Partial<Unit>) => 
    api.put<Unit>(`/units/${id}`, unit),

  /**
   * Delete a unit
   */
  deleteUnit: (id: string) => 
    api.delete<void>(`/units/${id}`),

  /**
   * Increment view count for a unit
   */
  incrementViewCount: (id: string) => 
    api.put<Unit>(`/units/${id}/view`, {}),
  
  /**
   * Get available customization options for a unit
   */
  getUnitCustomizationOptions: (id: string) => 
    api.get<any[]>(`/units/${id}/customization-options`),
  
  /**
   * Update unit status
   */
  updateUnitStatus: (id: string, status: UnitStatus) => 
    api.put<Unit>(`/units/${id}/status`, { status }),
  
  /**
   * Search units by various criteria
   */
  searchUnits: (searchParams: UnitFilters) => 
    api.get<Unit[]>(`/units/search`, { 
      params: searchParams 
    }),
};