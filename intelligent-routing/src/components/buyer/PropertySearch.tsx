'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Bed, 
  Bath, 
  Car, 
  Euro, 
  Heart, 
  Eye,
  Grid,
  List,
  SlidersHorizontal,
  ArrowUpDown,
  Star,
  Home,
  Building2,
  Zap
} from 'lucide-react';
import Link from 'next/link';

interface Property {
  id: string;
  title: string;
  name: string;
  location: string;
  address: {
    street: string;
    city: string;
    county: string;
    country: string;
    eircode: string;
  };
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  size: number;
  floorArea: number;
  status: string;
  berRating: string;
  htbEligible: boolean;
  features: string[];
  amenities: string[];
  images: string[];
  description: string;
  development: {
    id: string;
    name: string;
    developer: string;
    completionDate: string;
  };
}

interface SearchFilters {
  query: string;
  location: string;
  minPrice: number | null;
  maxPrice: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  propertyType: string;
  htbEligible: boolean;
}

interface PropertySearchProps {
  className?: string;
  showFilters?: boolean;
  defaultFilters?: Partial<SearchFilters>;
}

export const PropertySearch: React.FC<PropertySearchProps> = ({ 
  className = '', 
  showFilters = true,
  defaultFilters = {}
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [sortBy, setSortBy] = useState('price_asc');
  const [savedProperties, setSavedProperties] = useState<Set<string>>(new Set());

  // Search filters
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    minPrice: null,
    maxPrice: null,
    bedrooms: null,
    bathrooms: null,
    propertyType: '',
    htbEligible: false,
    ...defaultFilters
  });

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Debounced search
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const performSearch = useCallback(async (searchFilters: SearchFilters, pageNum: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (searchFilters.query) params.append('q', searchFilters.query);
      if (searchFilters.location) params.append('location', searchFilters.location);
      if (searchFilters.minPrice) params.append('minPrice', searchFilters.minPrice.toString());
      if (searchFilters.maxPrice) params.append('maxPrice', searchFilters.maxPrice.toString());
      if (searchFilters.bedrooms) params.append('bedrooms', searchFilters.bedrooms.toString());
      if (searchFilters.bathrooms) params.append('bathrooms', searchFilters.bathrooms.toString());
      if (searchFilters.propertyType) params.append('type', searchFilters.propertyType);
      if (searchFilters.htbEligible) params.append('htbEligible', 'true');
      params.append('page', pageNum.toString());
      params.append('limit', '12');

      const response = await fetch(`/api/properties/search?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to search properties');
      }

      const data = await response.json();
      setProperties(data.properties);
      setTotalPages(data.pagination.totalPages);
      setTotalCount(data.pagination.totalCount);
      setPage(pageNum);

    } catch (error) {
      console.error('Property search error:', error);
      setError('Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      performSearch(filters, 1);
    }, 500);

    setSearchTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [filters, performSearch]);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      location: '',
      minPrice: null,
      maxPrice: null,
      bedrooms: null,
      bathrooms: null,
      propertyType: '',
      htbEligible: false
    });
  };

  const toggleSaveProperty = (propertyId: string) => {
    setSavedProperties(prev => {
      const newSet = new Set(prev);
      if (newSet.has(propertyId)) {
        newSet.delete(propertyId);
      } else {
        newSet.add(propertyId);
      }
      return newSet;
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getPropertyTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'house':
        return <Home size={16} className="text-green-600" />;
      case 'apartment':
        return <Building2 size={16} className="text-blue-600" />;
      default:
        return <Building2 size={16} className="text-gray-600" />;
    }
  };

  const getBERColor = (rating: string) => {
    const ratingLetter = rating.charAt(0).toLowerCase();
    switch (ratingLetter) {
      case 'a': return 'bg-green-100 text-green-800';
      case 'b': return 'bg-lime-100 text-lime-800';
      case 'c': return 'bg-yellow-100 text-yellow-800';
      case 'd': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      {/* Search Header */}
      <div className="p-6 border-b">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Property Search</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
              >
                {viewMode === 'grid' ? <List size={20} /> : <Grid size={20} />}
              </button>
              {showFilters && (
                <button
                  onClick={() => setShowFilterPanel(!showFilterPanel)}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                >
                  <SlidersHorizontal size={16} />
                  Filters
                </button>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search properties, locations, developers..."
                value={filters.query}
                onChange={(e) => updateFilter('query', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <MapPin size={20} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Location"
                value={filters.location}
                onChange={(e) => updateFilter('location', e.target.value)}
                className="w-40 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && showFilterPanel && (
        <div className="p-6 border-b bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
              <input
                type="number"
                placeholder="€0"
                value={filters.minPrice || ''}
                onChange={(e) => updateFilter('minPrice', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
              <input
                type="number"
                placeholder="€1,000,000"
                value={filters.maxPrice || ''}
                onChange={(e) => updateFilter('maxPrice', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
              <select
                value={filters.bedrooms || ''}
                onChange={(e) => updateFilter('bedrooms', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
              <select
                value={filters.bathrooms || ''}
                onChange={(e) => updateFilter('bathrooms', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={filters.propertyType}
                onChange={(e) => updateFilter('propertyType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">HTB Eligible</label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.htbEligible}
                  onChange={(e) => updateFilter('htbEligible', e.target.checked)}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Only HTB eligible</span>
              </label>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {totalCount} properties found
            </span>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="p-6">
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Searching properties...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => performSearch(filters, page)}
              className="mt-2 text-blue-600 hover:text-blue-700"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && properties.length === 0 && (
          <div className="text-center py-8">
            <Home size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600">Try adjusting your search filters</p>
          </div>
        )}

        {!loading && !error && properties.length > 0 && (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing {((page - 1) * 12) + 1}-{Math.min(page * 12, totalCount)} of {totalCount} properties
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="bedrooms_asc">Bedrooms: Low to High</option>
                <option value="bedrooms_desc">Bedrooms: High to Low</option>
              </select>
            </div>

            {/* Property Grid/List */}
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-4'
            }>
              {properties.map((property) => (
                <div
                  key={property.id}
                  className={`border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  {/* Property Image */}
                  <div className={`relative ${viewMode === 'list' ? 'w-64' : 'h-48'} bg-gray-200`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        property.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                        property.status === 'RESERVED' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {property.status}
                      </span>
                    </div>

                    {/* HTB Badge */}
                    {property.htbEligible && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          HTB Eligible
                        </span>
                      </div>
                    )}

                    {/* Save Button */}
                    <button
                      onClick={() => toggleSaveProperty(property.id)}
                      className="absolute bottom-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
                    >
                      <Heart 
                        size={16} 
                        className={savedProperties.has(property.id) ? 'text-red-500 fill-current' : 'text-gray-600'} 
                      />
                    </button>
                  </div>

                  {/* Property Details */}
                  <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{property.title}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin size={14} />
                          {property.location}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getBERColor(property.berRating)}`}>
                        BER {property.berRating}
                      </span>
                    </div>

                    <p className="text-xl font-bold text-blue-600 mb-3">
                      {formatCurrency(property.price)}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        {getPropertyTypeIcon(property.type)}
                        <span className="capitalize">{property.type}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bed size={14} />
                        <span>{property.bedrooms}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath size={14} />
                        <span>{property.bathrooms}</span>
                      </div>
                      {property.parkingSpaces > 0 && (
                        <div className="flex items-center gap-1">
                          <Car size={14} />
                          <span>{property.parkingSpaces}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {property.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        by {property.development.developer}
                      </span>
                      <Link
                        href={`/properties/${property.id}`}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        <Eye size={14} />
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-8 gap-2">
                <button
                  onClick={() => performSearch(filters, page - 1)}
                  disabled={page === 1}
                  className="px-3 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                  .map((p, index, arr) => (
                    <React.Fragment key={p}>
                      {index > 0 && arr[index - 1] !== p - 1 && (
                        <span className="px-2 text-gray-500">...</span>
                      )}
                      <button
                        onClick={() => performSearch(filters, p)}
                        className={`px-3 py-2 border rounded ${
                          p === page 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  ))}
                
                <button
                  onClick={() => performSearch(filters, page + 1)}
                  disabled={page === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PropertySearch;