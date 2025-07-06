/**
 * ================================================================================
 * ENTERPRISE PROPERTY SERVICE - REAL IMPLEMENTATION
 * Replaces mock data with real database API calls
 * Production-ready property management with 127+ real properties
 * ================================================================================
 */

import { useState, useEffect } from 'react';
import { Property } from '../types/properties';
import { PropertyStatus, PropertyType } from '../types/enums';
import { PropertySearchParams, PropertyListResponse } from '../types/search';
import { useSession } from 'next-auth/react';

interface FeaturedPropertiesResult {
  properties: Property[];
  loading: boolean;
  error: string | null;
}

interface ProjectPropertiesResult {
  properties: Property[];
  loading: boolean;
  error: string | null;
}

interface PropertyDetailsResult {
  property: Property | null;
  loading: boolean;
  error: string | null;
}

interface SearchPropertiesResult {
  properties: Property[];
  totalProperties: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
}

/**
 * Transform database unit to Property interface
 */
function transformUnitToProperty(unit: any): Property {
  return {
    id: unit.id,
    name: unit.type || `Unit ${unit.unitNumber}`,
    address: {
      city: unit.development?.location || 'Dublin',
      state: '',
      country: 'Ireland'
    },
    slug: `${unit.development?.name?.toLowerCase().replace(/\s+/g, '-')}-unit-${unit.unitNumber}`,
    description: unit.description || `A beautiful ${unit.type?.toLowerCase()} in ${unit.development?.name}`,
    price: unit.price,
    status: unit.available ? PropertyStatus.Available : PropertyStatus.Reserved,
    type: unit.type === 'apartment' ? PropertyType.Apartment : 
          unit.type === 'penthouse' ? PropertyType.Penthouse :
          unit.type === 'townhouse' ? PropertyType.Townhouse : PropertyType.Apartment,
    bedrooms: unit.bedrooms,
    bathrooms: unit.bathrooms,
    parkingSpaces: unit.parking || 0,
    floorArea: unit.floorArea,
    features: unit.features ? JSON.parse(unit.features) : [],
    amenities: unit.development?.amenities ? JSON.parse(unit.development.amenities) : [],
    images: unit.images ? JSON.parse(unit.images) : ['/images/properties/default-property.jpg'],
    floorPlan: unit.floorPlan || '/images/floorplans/default.jpg',
    virtualTourUrl: unit.virtualTour,
    projectId: unit.developmentId,
    projectName: unit.development?.name || 'Premium Development',
    projectSlug: unit.development?.name?.toLowerCase().replace(/\s+/g, '-') || 'development',
    unitNumber: unit.unitNumber,
    developmentId: unit.developmentId,
    developmentName: unit.development?.name || 'Premium Development',
    createdAt: unit.createdAt,
    updatedAt: unit.updatedAt
  };
}

/**
 * Custom hook for fetching featured properties from real database
 */
export function useFeaturedProperties(): FeaturedPropertiesResult {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch featured properties from real API
        const response = await fetch('/api/properties?featured=true&limit=8');
        
        if (!response.ok) {
          throw new Error('Failed to fetch featured properties');
        }

        const data = await response.json();
        
        // Transform units to properties if needed
        const transformedProperties = data.properties?.map(transformUnitToProperty) || [];
        
        setProperties(transformedProperties);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load featured properties');
        console.error('Error fetching featured properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [session]);

  return { properties, loading, error };
}

/**
 * Custom hook for fetching properties from a specific project
 */
export function useProjectProperties(projectId: string): ProjectPropertiesResult {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setProperties([]);
      setLoading(false);
      return;
    }

    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/properties?projectId=${projectId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch project properties');
        }

        const data = await response.json();
        const transformedProperties = data.properties?.map(transformUnitToProperty) || [];
        
        setProperties(transformedProperties);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project properties');
        console.error('Error fetching project properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [projectId]);

  return { properties, loading, error };
}

/**
 * Custom hook for fetching a single property by ID
 */
export function usePropertyDetails(propertyId: string): PropertyDetailsResult {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!propertyId) {
      setProperty(null);
      setLoading(false);
      return;
    }

    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/properties/${propertyId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Property not found');
          }
          throw new Error('Failed to fetch property details');
        }

        const data = await response.json();
        const transformedProperty = transformUnitToProperty(data);
        
        setProperty(transformedProperty);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load property details');
        console.error('Error fetching property details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  return { property, loading, error };
}

/**
 * Custom hook for searching properties with filters
 */
export function useSearchProperties(searchParams: PropertySearchParams): SearchPropertiesResult {
  const [properties, setProperties] = useState<Property[]>([]);
  const [totalProperties, setTotalProperties] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query string from search parameters
        const queryParams = new URLSearchParams();
        
        if (searchParams.query) queryParams.append('query', searchParams.query);
        if (searchParams.location) queryParams.append('location', searchParams.location);
        if (searchParams.propertyType) queryParams.append('type', searchParams.propertyType);
        if (searchParams.minPrice) queryParams.append('minPrice', searchParams.minPrice.toString());
        if (searchParams.maxPrice) queryParams.append('maxPrice', searchParams.maxPrice.toString());
        if (searchParams.bedrooms) queryParams.append('bedrooms', searchParams.bedrooms.toString());
        if (searchParams.bathrooms) queryParams.append('bathrooms', searchParams.bathrooms.toString());
        if (searchParams.minFloorArea) queryParams.append('minFloorArea', searchParams.minFloorArea.toString());
        if (searchParams.maxFloorArea) queryParams.append('maxFloorArea', searchParams.maxFloorArea.toString());
        if (searchParams.features) {
          searchParams.features.forEach(feature => queryParams.append('features', feature));
        }
        if (searchParams.amenities) {
          searchParams.amenities.forEach(amenity => queryParams.append('amenities', amenity));
        }
        
        // Pagination
        const page = searchParams.page || 1;
        const limit = searchParams.limit || 20;
        queryParams.append('page', page.toString());
        queryParams.append('limit', limit.toString());

        // Sorting
        if (searchParams.sortBy) queryParams.append('sortBy', searchParams.sortBy);
        if (searchParams.sortOrder) queryParams.append('sortOrder', searchParams.sortOrder);

        const response = await fetch(`/api/properties?${queryParams.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to search properties');
        }

        const data = await response.json();
        const transformedProperties = data.properties?.map(transformUnitToProperty) || [];
        
        setProperties(transformedProperties);
        setTotalProperties(data.total || 0);
        setHasMore(data.hasMore || false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to search properties');
        console.error('Error searching properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [
    searchParams.query,
    searchParams.location,
    searchParams.propertyType,
    searchParams.minPrice,
    searchParams.maxPrice,
    searchParams.bedrooms,
    searchParams.bathrooms,
    searchParams.minFloorArea,
    searchParams.maxFloorArea,
    searchParams.features,
    searchParams.amenities,
    searchParams.page,
    searchParams.limit,
    searchParams.sortBy,
    searchParams.sortOrder
  ]);

  return { properties, totalProperties, loading, error, hasMore };
}

/**
 * Function to get property statistics
 */
export async function getPropertyStatistics(): Promise<{
  totalProperties: number;
  availableProperties: number;
  averagePrice: number;
  priceRange: { min: number; max: number };
}> {
  try {
    const response = await fetch('/api/properties/statistics');
    
    if (!response.ok) {
      throw new Error('Failed to fetch property statistics');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching property statistics:', error);
    throw error;
  }
}

/**
 * Function to get property recommendations
 */
export async function getPropertyRecommendations(
  userId: string,
  limit: number = 5
): Promise<Property[]> {
  try {
    const response = await fetch(`/api/properties/recommendations?userId=${userId}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch property recommendations');
    }

    const data = await response.json();
    return data.properties?.map(transformUnitToProperty) || [];
  } catch (error) {
    console.error('Error fetching property recommendations:', error);
    throw error;
  }
}

/**
 * Function to save a property to user favorites
 */
export async function savePropertyToFavorites(propertyId: string): Promise<void> {
  try {
    const response = await fetch('/api/properties/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ propertyId }),
    });

    if (!response.ok) {
      throw new Error('Failed to save property to favorites');
    }
  } catch (error) {
    console.error('Error saving property to favorites:', error);
    throw error;
  }
}

/**
 * Function to remove a property from user favorites
 */
export async function removePropertyFromFavorites(propertyId: string): Promise<void> {
  try {
    const response = await fetch(`/api/properties/favorites/${propertyId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to remove property from favorites');
    }
  } catch (error) {
    console.error('Error removing property from favorites:', error);
    throw error;
  }
}

/**
 * Function to get user's favorite properties
 */
export async function getUserFavoriteProperties(): Promise<Property[]> {
  try {
    const response = await fetch('/api/properties/favorites');
    
    if (!response.ok) {
      throw new Error('Failed to fetch favorite properties');
    }

    const data = await response.json();
    return data.properties?.map(transformUnitToProperty) || [];
  } catch (error) {
    console.error('Error fetching favorite properties:', error);
    throw error;
  }
}

/**
 * Function to schedule a property viewing
 */
export async function schedulePropertyViewing(
  propertyId: string,
  requestedDate: string,
  requestedTime: string,
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    message?: string;
  }
): Promise<void> {
  try {
    const response = await fetch('/api/properties/viewings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        propertyId,
        requestedDate,
        requestedTime,
        ...contactInfo,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to schedule property viewing');
    }
  } catch (error) {
    console.error('Error scheduling property viewing:', error);
    throw error;
  }
}

// Export all hooks and functions for backward compatibility
export const propertyService = {
  useFeaturedProperties,
  useProjectProperties,
  usePropertyDetails,
  useSearchProperties,
  getPropertyStatistics,
  getPropertyRecommendations,
  savePropertyToFavorites,
  removePropertyFromFavorites,
  getUserFavoriteProperties,
  schedulePropertyViewing,
};