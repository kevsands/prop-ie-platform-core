/**
 * Properties Service for Prop.ie platform
 * Handles property listings, details, and management
 */

import { api } from "../api-client";

/**
 * Property type definition
 */
export type Property = {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  developerId: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Property service with methods for property management
 */
export const propertyService = {
  /**
   * Get all properties
   */
  getProperties: () => api.get<Property[]>("/properties"),

  /**
   * Get a specific property by ID
   */
  getPropertyById: (id: string) => api.get<Property>(`/properties/${id}`),

  /**
   * Create a new property
   */
  createProperty: (
    property: Omit<Property, "id" | "createdAt" | "updatedAt">,
  ) => api.post<Property>("/properties", property),

  /**
   * Update an existing property
   */
  updateProperty: (id: string, property: Partial<Property>) =>
    api.put<Property>(`/properties/${id}`, property),

  /**
   * Delete a property
   */
  deleteProperty: (id: string) => api.delete<void>(`/properties/${id}`),

  /**
   * Search properties by criteria
   */
  searchProperties: (criteria: {
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    bedrooms?: number;
    bathrooms?: number;
    minArea?: number;
  }) =>
    api.get<Property[]>("/properties/search", {
      body: criteria,
    }),
};
