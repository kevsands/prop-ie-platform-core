'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Development type
interface Development {
  id: string;
  name: string;
  location: string;
  priceFrom: number;
  bedroomsRange: string;
  availableUnits: number;
  type: string;
  description: string;
  imageUrl: string;
  completionDate: string;
  featured: boolean;
}

// Filter types
type FilterOptions = {
  bedroomsMin: number | null;
  priceMin: number | null;
  priceMax: number | null;
  propertyType: string | null;
};

const DevelopmentsList: React.FC = () => {
  const [developments, setDevelopments] = useState<Development[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    bedroomsMin: null,
    priceMin: null,
    priceMax: null,
    propertyType: null,
  });

  // Fetch developments from API
  useEffect(() => {
    const fetchDevelopments = async () => {
      try {
        const response = await fetch('/api/developments?published=true');
        if (response.ok) {
          const data = await response.json();
          // Map API response to local format
          const mappedDevelopments: Development[] = data.data.map((dev: any, index: number) => ({
            id: dev.id,
            name: dev.name,
            location: `${dev.city}, ${dev.county}`,
            priceFrom: dev.startingPrice || 300000,
            bedroomsRange: '2-4', // Default - would be calculated from units in real scenario
            availableUnits: dev.totalUnits || 10,
            type: 'Houses', // Default - would be determined from units
            description: dev.description || `Premium development in ${dev.city}`,
            imageUrl: dev.mainImage || '/images/development-placeholder.jpg',
            completionDate: 'Available now',
            featured: index < 2 // Mark first 2 as featured
          }));
          setDevelopments(mappedDevelopments);
        } else {
          console.error('Failed to fetch developments');
        }
      } catch (error) {
        console.error('Error fetching developments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevelopments();
  }, []);

  // Apply filters to developments
  const filteredDevelopments = developments.filter((dev) => {
    // Filter by minimum bedrooms
    if (filters.bedroomsMin !== null) {
      const minBedrooms = parseInt(dev.bedroomsRange.split('-')[0]);
      if (minBedrooms < filters.bedroomsMin) return false;
    }

    // Filter by price range
    if (filters.priceMin !== null && dev.priceFrom < filters.priceMin) return false;
    if (filters.priceMax !== null && dev.priceFrom > filters.priceMax) return false;

    // Filter by property type
    if (filters.propertyType !== null && dev.type !== filters.propertyType) return false;

    return true;
  });

  // Handler for filter changes
  const handleFilterChange = (name: keyof FilterOptions, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Filters Section */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="bedroomsMin" className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Bedrooms
            </label>
            <select
              id="bedroomsMin"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={filters.bedroomsMin || ''}
              onChange={(e) => handleFilterChange('bedroomsMin', e.target.value ? parseInt(e.target.value) : null)}
            >
              <option value="">Any</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>

          <div>
            <label htmlFor="priceMin" className="block text-sm font-medium text-gray-700 mb-1">
              Price From
            </label>
            <select
              id="priceMin"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={filters.priceMin || ''}
              onChange={(e) => handleFilterChange('priceMin', e.target.value ? parseInt(e.target.value) : null)}
            >
              <option value="">Any</option>
              <option value="250000">€250,000+</option>
              <option value="300000">€300,000+</option>
              <option value="350000">€350,000+</option>
              <option value="400000">€400,000+</option>
            </select>
          </div>

          <div>
            <label htmlFor="priceMax" className="block text-sm font-medium text-gray-700 mb-1">
              Price To
            </label>
            <select
              id="priceMax"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={filters.priceMax || ''}
              onChange={(e) => handleFilterChange('priceMax', e.target.value ? parseInt(e.target.value) : null)}
            >
              <option value="">Any</option>
              <option value="300000">€300,000</option>
              <option value="350000">€350,000</option>
              <option value="400000">€400,000</option>
              <option value="450000">€450,000</option>
              <option value="500000">€500,000</option>
            </select>
          </div>

          <div>
            <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
              Property Type
            </label>
            <select
              id="propertyType"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={filters.propertyType || ''}
              onChange={(e) => handleFilterChange('propertyType', e.target.value || null)}
            >
              <option value="">Any</option>
              <option value="Houses">Houses</option>
              <option value="Apartments">Apartments</option>
            </select>
          </div>
        </div>
      </div>

      {/* Development Cards */}
      {filteredDevelopments.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-900">No developments match your criteria</h3>
          <p className="mt-2 text-gray-500">Try adjusting your filters to see more results.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDevelopments.map((development) => (
            <div key={development.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-60 w-full">
                <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                  {/* Placeholder for development image */}
                  <span className="text-gray-500">{development.name} Image</span>
                </div>
                {development.featured && (
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Featured
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">{development.name}</h3>
                <p className="text-gray-600 mt-1">{development.location}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    From €{development.priceFrom.toLocaleString()}
                  </span>
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {development.bedroomsRange} Beds
                  </span>
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    {development.type}
                  </span>
                </div>
                <p className="mt-4 text-gray-700">{development.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {development.availableUnits} units available
                  </span>
                  <span className="text-sm text-gray-500">
                    Ready: {development.completionDate}
                  </span>
                </div>
                <div className="mt-6">
                  <Link href={`/developments/${development.id}`} className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded text-center transition-colors duration-200">
                    View Development
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DevelopmentsList;