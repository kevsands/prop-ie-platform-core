'use client';

import React, { useState } from 'react';

// Mock development type for build testing
interface Development {
  id: string;
  name: string;
  description: string;
  slug: string;
  status: string;
  mainImage: string;
  priceRange: string;
  totalUnits: number;
  availableUnits: number;
  location: {
    city: string;
    county: string;
  };
}

// Mock development card
const DevelopmentCardConnected: React.FC<{development: Development}> = ({ development }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-bold">{development.name}</h3>
      <p className="mt-2 text-gray-600">{development.description}</p>
      <div className="mt-2">
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
          {development.status}
        </span>
      </div>
    </div>
  );
};

// Mock hooks for build testing
const useDevelopments = () => {
  return {
    data: {
      developments: [
        {
          id: '1',
          name: 'Riverside Manor',
          description: 'Luxury riverside apartments',
          slug: 'riverside-manor',
          status: 'AVAILABLE',
          mainImage: '/images/riverside-manor/hero.jpg',
          priceRange: '€350,000 - €450,000',
          totalUnits: 24,
          availableUnits: 8,
          location: {
            city: 'Dublin',
            county: 'Dublin'
          }
        },
        {
          id: '2',
          name: 'Maple Heights',
          description: 'Modern family homes',
          slug: 'maple-heights',
          status: 'COMING_SOON',
          mainImage: '/images/developments/maple-heights/main.jpg',
          priceRange: '€420,000 - €520,000',
          totalUnits: 36,
          availableUnits: 36,
          location: {
            city: 'Galway',
            county: 'Galway'
          }
        }
      ]
    },
    isLoading: false,
    error: null,
    refetch: () => {}
  };
};

const useDevelopment = (id?: string, options?: { enabled: boolean }) => {
  return {
    data: id ? {
      id,
      name: 'Riverside Manor',
      description: 'Luxury riverside apartments with scenic views',
      slug: 'riverside-manor',
      status: 'AVAILABLE',
      mainImage: '/images/riverside-manor/hero.jpg',
      priceRange: '€350,000 - €450,000',
      totalUnits: 24,
      availableUnits: 8,
      location: {
        city: 'Dublin',
        county: 'Dublin'
      }
    } : null,
    isLoading: false,
    error: null,
    refetch: () => {}
  };
};

const useDevelopmentBySlug = (slug?: string, options?: { enabled: boolean }) => {
  return {
    data: slug ? {
      id: '1',
      name: 'Riverside Manor',
      description: 'Luxury riverside apartments with scenic views',
      slug: slug,
      status: 'AVAILABLE',
      mainImage: '/images/riverside-manor/hero.jpg',
      priceRange: '€350,000 - €450,000',
      totalUnits: 24,
      availableUnits: 8,
      location: {
        city: 'Dublin',
        county: 'Dublin'
      }
    } : null,
    isLoading: false,
    error: null,
    refetch: () => {}
  };
};

/**
 * Simplified GraphQL Tester component for build testing
 */
export default function GraphQLTester() {
  const [developmentId, setDevelopmentId] = useState<string>('');
  const [developmentSlug, setDevelopmentSlug] = useState<string>('');

  // Mock GraphQL queries using the simplified hooks above
  const { 
    data: developmentsData, 
    isLoading: isDevelopmentsLoading,
    error: developmentsError,
    refetch: refetchDevelopments
  } = useDevelopments();

  const {
    data: developmentData,
    isLoading: isDevelopmentLoading,
    error: developmentError,
    refetch: refetchDevelopment
  } = useDevelopment(developmentId || undefined, {
    enabled: Boolean(developmentId)
  });

  const {
    data: developmentBySlugData,
    isLoading: isSlugLoading,
    error: slugError,
    refetch: refetchBySlug
  } = useDevelopmentBySlug(developmentSlug || undefined, {
    enabled: Boolean(developmentSlug)
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-amber-50 p-3 mb-4 rounded text-amber-800 text-sm">
        <div className="font-medium">Simplified GraphQL Tester</div>
        <div>This is a simplified version for build testing. No actual GraphQL queries are performed.</div>
      </div>

      <h1 className="text-2xl font-bold mb-6">GraphQL Connection Tester</h1>
      
      {/* Test Controls */}
      <div className="bg-white p-4 rounded shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-2">Test Controls</h2>
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Development ID</label>
            <div className="flex">
              <input
                type="text"
                value={developmentId}
                onChange={(e) => setDevelopmentId(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter development ID"
              />
              <button
                onClick={() => refetchDevelopment()}
                disabled={!developmentId}
                className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 disabled:bg-gray-300"
              >
                Fetch
              </button>
            </div>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Development Slug</label>
            <div className="flex">
              <input
                type="text"
                value={developmentSlug}
                onChange={(e) => setDevelopmentSlug(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter development slug"
              />
              <button
                onClick={() => refetchBySlug()}
                disabled={!developmentSlug}
                className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 disabled:bg-gray-300"
              >
                Fetch
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">All Developments</label>
            <button
              onClick={() => refetchDevelopments()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 w-full"
            >
              Refresh List
            </button>
          </div>
        </div>
      </div>
      
      {/* Developments List */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">All Developments</h2>
        
        <div>
          <p className="mb-4 text-gray-600">Found {developmentsData.developments?.length || 0} developments</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {developmentsData.developments?.map(development => (
              <DevelopmentCardConnected 
                key={development.id} 
                development={development} 
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Development Detail by ID */}
      {developmentId && developmentData && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Development by ID: {developmentId}</h2>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{developmentData.name}</h3>
                <p className="text-gray-600 mt-2">{developmentData.description}</p>
                
                {developmentData.location && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="text-gray-800">
                      {developmentData.location.city}, {developmentData.location.county}
                    </p>
                  </div>
                )}
                
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="text-gray-800">{developmentData.status}</p>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500">Units</p>
                  <p className="text-gray-800">
                    {developmentData.availableUnits} available of {developmentData.totalUnits} total
                  </p>
                </div>
              </div>
              
              <div>
                {developmentData.mainImage && (
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                    <img 
                      src={developmentData.mainImage} 
                      alt={developmentData.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {developmentData.priceRange && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-500">Price Range</p>
                    <p className="text-xl font-bold text-indigo-600">{developmentData.priceRange}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}