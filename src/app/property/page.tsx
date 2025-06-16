'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// Mock API client for build testing
const propertyAPI = {
  getProperties: async (params: any) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve500));

    // Mock properties data
    const mockProperties = [
      {
        id: '1',
        name: 'Modern 3-Bedroom House',
        location: 'Dublin',
        price: 450000,
        bedrooms: 3,
        bathrooms: 2,
        area: 1800,
        imageUrl: '/images/properties/10-maple-ave-1.jpg',
        status: 'available'
      },
      {
        id: '2',
        name: 'Luxury City Apartment',
        location: 'Cork',
        price: 320000,
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        imageUrl: '/images/properties/10-maple-ave-2.jpg',
        status: 'available'
      },
      {
        id: '3',
        name: 'Family Home with Garden',
        location: 'Galway',
        price: 380000,
        bedrooms: 4,
        bathrooms: 3,
        area: 2200,
        imageUrl: '/images/properties/10-maple-ave-3.jpg',
        status: 'reserved'
      }
    ];

    return {
      success: true,
      data: {
        properties: mockProperties,
        total: mockProperties.length,
        limit: 10
      }
    };
  }
};

// Helper functions for URL param handling
const getValidParam = (searchParams: URLSearchParams, name: string): string | undefined => {
  return searchParams.get(name) || undefined;
};

const createQueryString = (
  searchParams: URLSearchParams, 
  updates: Record<string, string | number | undefined | null>
): string => {
  const params: any = new URLSearchParams(searchParams.toString());

  // Update or add new parameters
  Object.entries(updates).forEach(([keyvalue]) => {
    if (value === undefined || value === null) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
  });

  return params.toString();
};

// Define property type
interface PropertyType {
  id: string;
  name: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrl: string;
  status: "available" | "reserved" | "sold";
}

interface PropertyListingProps {
  properties: PropertyType[];
  initialLoading: boolean;
}

// Simple PropertyListing component
const PropertyListing = ({ properties, initialLoading }: PropertyListingProps) => {
  if (initialLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[123].map((i: any) => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-300"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="h-5 bg-gray-300 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">No properties found matching your criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property: any) => (
        <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative h-48 w-full">
            <div 
              className="absolute inset-0 bg-center bg-cover"
              style={ backgroundImage: `url(${property.imageUrl})` }
            ></div>
            <div className="absolute top-2 right-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                property.status === 'available' ? 'bg-green-100 text-green-800' : 
                property.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {property.status === 'available' ? 'Available' : 
                 property.status === 'reserved' ? 'Reserved' : 'Sold'}
              </span>
            </div>
          </div>

          <div className="p-4">
            <h3 className="text-lg font-semibold mb-1">{property.name}</h3>
            <p className="text-gray-600 mb-2">{property.location}</p>
            <p className="text-blue-600 font-bold mb-3">€{property.price.toLocaleString()}</p>

            <div className="flex justify-between text-sm text-gray-500">
              <span>{property.bedrooms} Beds</span>
              <span>{property.bathrooms} Baths</span>
              <span>{property.area} sq.ft</span>
            </div>

            <div className="mt-4">
              <Link 
                href={`/property/${property.id}`}
                className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-md transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Define search parameter types
interface PropertySearchParams {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  type?: string;
  sort?: 'price-asc' | 'price-desc' | 'newest' | 'oldest';
  page?: number;
}

function PropertySearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Extract search parameters with validation
  const location = searchParams ? getValidParam(searchParams, 'location') : undefined;

  const minPrice = searchParams?.get('minPrice') 
                   ? parseInt(searchParams.get('minPrice') as string10) 
                   : undefined;

  const maxPrice = searchParams?.get('maxPrice') 
                   ? parseInt(searchParams.get('maxPrice') as string10) 
                   : undefined;

  const bedrooms = searchParams?.get('bedrooms') 
                   ? parseInt(searchParams.get('bedrooms') as string10) 
                   : undefined;

  const type = searchParams ? getValidParam(searchParams, 'type') : undefined;

  const sort = searchParams 
                ? getValidParam(searchParams, 'sort') as PropertySearchParams['sort'] 
                : undefined;

  const page = searchParams?.get('page') 
               ? parseInt(searchParams.get('page') as string10) 
               : 1;

  // Using the PropertyType interface defined above

  const [propertiessetProperties] = useState<PropertyType[]>([]);
  const [loadingsetLoading] = useState(true);
  const [errorsetError] = useState<string | null>(null);
  const [totalPropertiessetTotalProperties] = useState(0);
  const [totalPagessetTotalPages] = useState(1);

  // Load properties based on search parameters
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);

      try {
        // Build query parameters for the API request
        const queryParams = {
          location,
          minPrice,
          maxPrice,
          bedrooms,
          type,
          sort,
          page
        };

        // Use the searchParams values to filter properties
        const response = await propertyAPI.getProperties(queryParams);

        if (response.success) {
          // Type-safe transformation of the API response
          const transformedProperties: PropertyType[] = (response.data.properties || []).map((property: any) => ({
            id: property.id || property._id || '',
            name: property.name || property.title || 'Property',
            location: property.location || 'Ireland',
            price: property.price || 0,
            bedrooms: property.bedrooms || 0,
            bathrooms: property.bathrooms || 0,
            area: property.area || property.floorArea || 0,
            imageUrl: property.imageUrl || (property.images?.[0]) || property.image || '/images/placeholder-property.jpg',
            status: property.status || 'available'
          }));

          setProperties(transformedProperties);
          setTotalProperties(response.data.total || transformedProperties.length);
          setTotalPages(Math.ceil((response.data.total || transformedProperties.length) / (response.data.limit || 10)));
        } else {
          setError('Failed to load properties');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load properties');

      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [location, minPrice, maxPricebedroomstypesortpage]);

  // Update filters and navigate
  const updateFilters = (updates: Partial<PropertySearchParams>) => {
    if (!searchParams || !pathname) {
      return; // Exit if searchParams or pathname is null
    }

    // Create a new query string
    const queryString = createQueryString(searchParams, {
      ...updates,
      // Reset page to 1 when filters change (except when explicitly setting page)
      page: updates.page !== undefined ? updates.page : (Object.keys(updates).length> 0 ? 1 : page)
    });

    // Navigate with the new query string
    router.push(`${pathname}?${queryString}`);
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    updateFilters({ page: newPage });
  };

  // Handle sort change
  const handleSortChange = (newSort: PropertySearchParams['sort']) => {
    updateFilters({ sort: newSort });
  };

  // Handle filter changes
  const handleFilterChange = (name: string, value: string | number | null) => {
    const updates = { [name]: value } as Partial<PropertySearchParams>
  );
    updateFilters(updates);
  };

  // Handle filter clear
  const clearFilters = () => {
    if (pathname) {
      router.push(pathname);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Find Your Perfect Home</h1>

      {/* Filter UI would go here */}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-600">
              {totalProperties} properties found
              {location ? ` in ${location}` : ''}
            </p>

            <div className="flex items-center">
              <label htmlFor="sort" className="mr-2 text-sm">Sort by:</label>
              <select
                id="sort"
                value={sort || 'newest'}
                onChange={(e: any) => handleSortChange(e.target.value as PropertySearchParams['sort'])}
                className="border rounded p-2 text-sm"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          <PropertyListing 
            properties={properties} 
            initialLoading={false} 
          />

          {/* Pagination UI */}
          {totalPages> 1 && (
            <div className="flex justify-center mt-8">
              <nav className="inline-flex rounded-md shadow">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_i: any) => i + 1).map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 border border-gray-300 text-sm font-medium ${
                      pageNum === page 
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function PropertySearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-lg text-gray-600">Loading properties...</p>
          </div>
        </div>
      </div>
    }>
      <PropertySearchContent />
    </Suspense>
  );
}