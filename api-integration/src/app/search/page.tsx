/**
 * Property Search Page
 * Main search interface with integrated preference tracking
 */

'use client';

import React, { useState, useEffect } from 'react';
import SearchFilters from '@/components/layout/SearchFilters';
import PropertyCard from '@/components/properties/PropertyCard';
import { useSearchPreferences } from '@/hooks/useSearchPreferences';
import { 
  Search,
  Filter,
  Star,
  TrendingUp,
  MapPin,
  Grid,
  List,
  SortAsc,
  Heart,
  Eye,
  Sparkles
} from 'lucide-react';

interface SearchPageProps {
  searchParams?: {
    q?: string;
    location?: string;
    type?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const { preferences, trackPropertyViewing, getRecommendations, isGuest } = useSearchPreferences();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'relevance' | 'price_asc' | 'price_desc' | 'newest'>('relevance');
  const [showRecommendations, setShowRecommendations] = useState(true);

  useEffect(() => {
    // Load initial search results
    executeSearch();
    // Load personalized recommendations
    loadRecommendations();
  }, []);

  const executeSearch = async (filters?: any) => {
    setLoading(true);
    try {
      // Simulate search API call
      const mockResults = generateMockResults(filters);
      setSearchResults(mockResults);
    } catch (error) {
      console.error('Error executing search:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendations = async () => {
    try {
      const recs = await getRecommendations(6);
      setRecommendations(recs);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  };

  const generateMockResults = (filters?: any) => {
    // Generate mock property results based on filters and preferences
    const results = [];
    
    for (let i = 1; i <= 24; i++) {
      const propertyTypes = ['apartment', 'house', 'townhouse', 'duplex'];
      const locations = ['Dublin', 'Cork', 'Galway', 'Meath', 'Kildare'];
      const developments = ['Fitzgerald Gardens', 'Phoenix Park Residences', 'Docklands Quarter', 'Citywest Village'];
      
      const type = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const development = developments[Math.floor(Math.random() * developments.length)];
      const bedrooms = Math.floor(Math.random() * 4) + 1;
      const bathrooms = Math.min(bedrooms, Math.floor(Math.random() * 3) + 1);
      const price = 250000 + Math.floor(Math.random() * 500000);
      const size = 70 + Math.floor(Math.random() * 100);
      
      results.push({
        id: `prop_${i}`,
        title: `${bedrooms} Bed ${type}`,
        unitNumber: `Unit ${i}`,
        type: type,
        bedrooms,
        bathrooms,
        size,
        price,
        status: Math.random() > 0.8 ? 'reserved' : 'available',
        developmentName: development,
        developmentId: `dev_${Math.floor(i / 6) + 1}`,
        location,
        primaryImage: `/images/properties/property-${(i % 6) + 1}.jpg`,
        htbEligible: Math.random() > 0.3,
        isNew: Math.random() > 0.8,
        isReduced: Math.random() > 0.9,
        parkingSpaces: Math.random() > 0.5 ? 1 : 0,
        berRating: ['A1', 'A2', 'A3', 'B1', 'B2'][Math.floor(Math.random() * 5)],
        viewCount: Math.floor(Math.random() * 200) + 50,
        aiScore: preferences ? Math.floor(Math.random() * 30) + 70 : undefined,
        tags: [
          ...(Math.random() > 0.7 ? ['New Build'] : []),
          ...(Math.random() > 0.6 ? ['Parking'] : []),
          ...(Math.random() > 0.5 ? ['Garden'] : []),
          ...(Math.random() > 0.8 ? ['Balcony'] : [])
        ]
      });
    }
    
    return results.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'newest':
          return b.id.localeCompare(a.id);
        default:
          return (b.aiScore || 0) - (a.aiScore || 0);
      }
    });
  };

  const handlePropertyView = async (property: any) => {
    await trackPropertyViewing(property.id, property.developmentId, 'search');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Search</h1>
          <p className="text-gray-600">
            {searchResults.length} properties found
            {!isGuest && ' • Personalized for you'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <SearchFilters
              onFiltersChange={(filters) => {
                console.log('Filters changed:', filters);
              }}
              onSearchExecute={(filters) => {
                executeSearch(filters);
              }}
              className="sticky top-8"
            />

            {/* Personalized Recommendations */}
            {showRecommendations && recommendations && recommendations.properties.length > 0 && (
              <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    Recommended for You
                  </h3>
                  <div className="text-sm text-gray-500">
                    {Math.round(recommendations.confidence)}% match
                  </div>
                </div>
                
                <div className="space-y-3">
                  {recommendations.properties.slice(0, 3).map((property: any) => (
                    <div key={property.id} className="border border-gray-200 rounded-lg p-3">
                      <h4 className="font-medium text-gray-900 text-sm">{property.title}</h4>
                      <p className="text-xs text-gray-600">{property.location}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-bold text-green-600">
                          {formatCurrency(property.price)}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <Star className="w-3 h-3" />
                          <span>{property.matchScore}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => setShowRecommendations(false)}
                  className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700"
                >
                  Hide recommendations
                </button>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    Showing {searchResults.length} properties
                  </span>
                  
                  {!isGuest && (
                    <div className="flex items-center gap-1 text-sm text-blue-600">
                      <Star className="w-4 h-4" />
                      <span>AI-Ranked</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                  >
                    <option value="relevance">Best Match</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                  </select>

                  {/* View Mode */}
                  <div className="flex border border-gray-300 rounded overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                    <div className="h-48 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {searchResults.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    showAiScore={!isGuest && preferences !== null}
                    showViewCount={true}
                    compact={viewMode === 'list'}
                    onViewDetails={() => handlePropertyView(property)}
                  />
                ))}
              </div>
            )}

            {/* Load More */}
            {searchResults.length > 0 && (
              <div className="text-center mt-8">
                <button className="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Load More Properties
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && searchResults.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search filters to see more results.
                </p>
                <button
                  onClick={() => executeSearch()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Reset Search
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Guest Conversion CTA */}
        {isGuest && (
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Get Personalized Property Recommendations</h2>
              <p className="text-blue-100 mb-6">
                Create a free account to save your search preferences, get AI-powered recommendations, 
                and receive alerts about new properties that match your criteria.
              </p>
              <div className="flex justify-center gap-4">
                <button className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                  Create Free Account
                </button>
                <button className="px-6 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors">
                  Sign In
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}