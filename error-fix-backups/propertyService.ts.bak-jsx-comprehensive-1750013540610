// src/services/propertyService.ts

import { useState, useEffect } from 'react';
import { Property } from '../types/properties'; // Updated import path
import { PropertyStatus, PropertyType } from '../types/enums';
import { PropertySearchParams, PropertyListResponse } from '../types/search';
import { useSession } from 'next-auth/react';

// Mock data for development - replace with actual API calls later
const mockProperties: Property[] = [
  {
    id: 'prop-1',
    name: 'Luxury Waterfront Apartment',
    address: { city: 'Dublin 2', state: '', country: 'Ireland' },
    slug: 'luxury-waterfront-apartment',
    description: 'Stunning waterfront apartment with panoramic views of the Dublin bay.',
    price: 750000,
    status: PropertyStatus.Available,
    type: PropertyType.Apartment,
    bedrooms: 2,
    bathrooms: 2,
    parkingSpaces: 1,
    floorArea: 95,
    features: ['Balcony', 'Floor-to-ceiling windows', 'Underfloor heating'],
    amenities: ['Gym', 'Concierge', 'Residents lounge'],
    images: ['/images/properties/property-1-1.jpg', '/images/properties/property-1-2.jpg'],
    floorPlan: '/images/floorplans/property-1.jpg',
    virtualTourUrl: 'https://example.com/tour/property-1',
    projectId: 'project-1',
    projectName: 'Dockside Quarter',
    projectSlug: 'dockside-quarter',
    unitNumber: 'A12',
    developmentId: 'dev-1',
    developmentName: 'Dockside Quarter',
    createdAt: '2023-04-15T12:00:00Z',
    updatedAt: '2023-04-15T12:00:00Z'
  },
  {
    id: 'prop-2',
    name: 'Modern City Centre Apartment',
    address: { city: 'Dublin 1', state: '', country: 'Ireland' },
    slug: 'modern-city-centre-apartment',
    description: 'Stylish apartment in the heart of Dublin with excellent transport links.',
    price: 450000,
    status: PropertyStatus.Available,
    type: PropertyType.Apartment,
    bedrooms: 1,
    bathrooms: 1,
    parkingSpaces: 0,
    floorArea: 65,
    features: ['Juliette balcony', 'Smart home system'],
    amenities: ['Bike storage', 'Roof garden'],
    images: ['/images/properties/property-2-1.jpg', '/images/properties/property-2-2.jpg'],
    floorPlan: '/images/floorplans/property-2.jpg',
    projectId: 'project-1',
    projectName: 'Dockside Quarter',
    projectSlug: 'dockside-quarter',
    unitNumber: 'B05',
    developmentId: 'dev-1',
    developmentName: 'Dockside Quarter',
    createdAt: '2023-04-16T12:00:00Z',
    updatedAt: '2023-04-16T12:00:00Z'
  },
  {
    id: 'prop-3',
    name: 'Spacious Family House',
    address: { city: 'Dublin 15', state: '', country: 'Ireland' },
    slug: 'spacious-family-house',
    description: 'Beautiful 4-bedroom family home in a quiet residential area.',
    price: 595000,
    status: PropertyStatus.Available,
    type: PropertyType.House,
    bedrooms: 4,
    bathrooms: 3,
    parkingSpaces: 2,
    floorArea: 185,
    features: ['Garden', 'Attic conversion', 'Home office'],
    amenities: ['Playground nearby', 'Good schools'],
    images: ['/images/properties/property-3-1.jpg', '/images/properties/property-3-2.jpg'],
    floorPlan: '/images/floorplans/property-3.jpg',
    projectId: 'project-2',
    projectName: 'Parkview Residences',
    projectSlug: 'parkview-residences',
    unitNumber: '12',
    developmentId: 'dev-2',
    developmentName: 'Parkview Residences',
    createdAt: '2023-04-17T12:00:00Z',
    updatedAt: '2023-04-17T12:00:00Z'
  }
];

interface FeaturedPropertiesResult {
  properties: Property[];
  loading: boolean;
  error: string | null;
}

// Custom hook for fetching featured properties
export function useFeaturedProperties(): FeaturedPropertiesResult {
  const [propertiessetProperties] = useState<Property[]>([]);
  const [loadingsetLoading] = useState<boolean>(true);
  const [errorsetError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);

        // In a real app, you'd make an API call here
        // const response = await fetch('/api/properties/featured', {
        //   headers: {
        //     Authorization: `Bearer ${session?.accessToken}`
        //   }
        // });
        // if (!response.ok) throw new Error('Failed to fetch properties');
        // const data = await response.json();

        // For now, using mock data
        setTimeout(() => {
          setProperties(mockProperties);
          setLoading(false);
        }, 500);
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

// Custom hook for fetching properties by project slug
export function useProjectProperties(projectSlug: string): ProjectPropertiesResult {
  const [propertiessetProperties] = useState<Property[]>([]);
  const [loadingsetLoading] = useState<boolean>(true);
  const [errorsetError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchProjectProperties = async () => {
      try {
        setLoading(true);

        // In a real app, you'd make an API call here
        // const response = await fetch(`/api/projects/${projectSlug}/properties`, {
        //   headers: {
        //     Authorization: `Bearer ${session?.accessToken}`
        //   }
        // });
        // if (!response.ok) throw new Error('Failed to fetch project properties');
        // const data = await response.json();

        // For now, filter mock data by project slug
        setTimeout(() => {
          const filteredProperties = mockProperties.filter(
            property => property.projectSlug === projectSlug
          );
          setProperties(filteredProperties);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchProjectProperties();
  }, [projectSlugsession]);

  return { properties, loading, error };
}

interface PropertyDetailsResult {
  property: Property | null;
  loading: boolean;
  error: string | null;
}

// Custom hook for fetching property details by ID
export function usePropertyDetails(projectSlug: string, propertyId: string): PropertyDetailsResult {
  const [propertysetProperty] = useState<Property | null>(null);
  const [loadingsetLoading] = useState<boolean>(true);
  const [errorsetError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);

        // In a real app, you'd make an API call here
        // const response = await fetch(`/api/projects/${projectSlug}/properties/${propertyId}`, {
        //   headers: {
        //     Authorization: `Bearer ${session?.accessToken}`
        //   }
        // });
        // if (!response.ok) throw new Error('Failed to fetch property details');
        // const data = await response.json();

        // For now, find in mock data
        setTimeout(() => {
          const foundProperty = mockProperties.find(
            property => property.id === propertyId && property.projectSlug === projectSlug
          );

          if (foundProperty) {
            setProperty(foundProperty);
          } else {
            setError('Property not found');
          }

          setLoading(false);
        }, 500);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [projectSlug, propertyIdsession]);

  return { property, loading, error };
}

interface SearchPropertiesResult extends PropertyListResponse {
  loading: boolean;
  error: string | null;
}

// Custom hook for searching properties with filters
export function useSearchProperties(params: PropertySearchParams): SearchPropertiesResult {
  const [resultsetResult] = useState<PropertyListResponse>({
    properties: [],
    totalCount: 0,
    currentPage: 1,
    totalPages: 0
  });
  const [loadingsetLoading] = useState<boolean>(true);
  const [errorsetError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const searchProperties = async () => {
      try {
        setLoading(true);

        // In a real app, you'd make an API call here
        // const queryParams = new URLSearchParams();
        // Object.entries(params).forEach(([keyvalue]) => {
        //   if (value !== undefined) queryParams.set(key, value.toString());
        // });
        // const response = await fetch(`/api/properties/search?${queryParams}`, {
        //   headers: {
        //     Authorization: `Bearer ${session?.accessToken}`
        //   }
        // });
        // if (!response.ok) throw new Error('Failed to search properties');
        // const data = await response.json();

        // For now, filter mock data
        setTimeout(() => {
          let filteredProperties = [...mockProperties];

          // Apply filters
          if (params.projectSlug) {
            filteredProperties = filteredProperties.filter(
              property => property.projectSlug === params.projectSlug
            );
          }

          if (params.minPrice) {
            filteredProperties = filteredProperties.filter(
              property => property.price>= params.minPrice!
            );
          }

          if (params.maxPrice) {
            filteredProperties = filteredProperties.filter(
              property => property.price <= params.maxPrice!
            );
          }

          if (params.minBedrooms) {
            filteredProperties = filteredProperties.filter(
              property => property.bedrooms>= params.minBedrooms!
            );
          }

          if (params.type?.length) {
            filteredProperties = filteredProperties.filter(
              property => params.type?.includes(property.type)
            );
          }

          if (params.status?.length) {
            filteredProperties = filteredProperties.filter(
              property => params.status?.includes(property.status)
            );
          }

          // Apply query search
          if (params.query) {
            const query = params.query.toLowerCase();
            filteredProperties = filteredProperties.filter(property => {
              const addressStr = `${property.address?.city || ''} ${property.address?.state || ''} ${property.address?.country || ''}`.toLowerCase();
              return property.name?.toLowerCase().includes(query)
                || property.description?.toLowerCase().includes(query)
                || addressStr.includes(query);
            });
          }

          // Sort
          if (params.sort) {
            const key = params.sort as keyof Property;
            filteredProperties.sort((ab: any) => {
              const aVal = a[key];
              const bVal = b[key];
              if (typeof aVal === 'string' && typeof bVal === 'string') {
                return aVal.localeCompare(bVal);
              }
              if (typeof aVal === 'number' && typeof bVal === 'number') {
                return aVal - bVal;
              }
              // Handle enum values (convert to strings for comparison)
              if (aVal !== undefined && bVal !== undefined) {
                return String(aVal).localeCompare(String(bVal));
              }
              return 0;
            });
          }

          const page = params.page || 1;
          const limit = params.limit || 10;
          const totalCount = filteredProperties.length;
          const totalPages = Math.ceil(totalCount / limit);

          const startIndex = (page - 1) * limit;
          const endIndex = startIndex + limit;
          const paginatedProperties = filteredProperties.slice(startIndexendIndex);

          setResult({ 
            properties: paginatedProperties, 
            totalCount, 
            currentPage: page, 
            totalPages 
          });

          setLoading(false);
        }, 500);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    searchProperties();
  }, [paramssession]);

  return { ...result, loading, error };
}