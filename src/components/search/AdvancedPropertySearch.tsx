'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search,
  Filter,
  SlidersHorizontal,
  MapPin,
  Home,
  Bed,
  Bath,
  Maximize,
  Euro,
  Calendar,
  Star,
  Bookmark,
  Grid3X3,
  List,
  ChevronDown,
  X,
  Heart,
  Share2,
  Eye,
  TrendingUp,
  Award,
  CheckCircle
} from 'lucide-react';
import { searchService, SearchFilters, SearchSort, SearchResult } from '@/services/searchService';

interface Props {
  onResults?: (results: SearchResult) => void;
  initialFilters?: SearchFilters;
  showMap?: boolean;
}

const AdvancedPropertySearch: React.FC<Props> = ({ 
  onResults, 
  initialFilters = {},
  showMap = false 
}) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [sort, setSort] = useState<SearchSort>({ field: 'price', direction: 'asc' });
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [savedSearches, setSavedSearches] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Search execution
  const executeSearch = useCallback(async () => {
    setLoading(true);
    try {
      const searchResults = await searchService.search(query, filters, sort, 1, 20, 'user-123');
      setResults(searchResults);
      onResults?.(searchResults);
      
      // Update suggestions
      const newSuggestions = searchService.getSearchSuggestions(query);
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  }, [query, filters, sort, onResults]);

  // Execute search on component mount and when dependencies change
  useEffect(() => {
    executeSearch();
  }, [executeSearch]);

  // Handle filter changes
  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle sort changes
  const updateSort = (field: SearchSort['field'], direction?: SearchSort['direction']) => {
    setSort(prev => ({
      field,
      direction: direction || (prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc')
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
    setQuery('');
  };

  // Save current search
  const saveSearch = async () => {
    try {
      const savedSearch = await searchService.saveSearch(
        'user-123',
        `Search ${new Date().toLocaleDateString()}`,
        filters,
        sort,
        true
      );
      setSavedSearches(prev => [...prev, savedSearch]);
      alert('Search saved successfully!');
    } catch (error) {
      console.error('Failed to save search:', error);
    }
  };

  // Toggle favorite
  const toggleFavorite = (unitId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(unitId)) {
        newFavorites.delete(unitId);
      } else {
        newFavorites.add(unitId);
      }
      return newFavorites;
    });
  };

  // Format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Active filter count
  const activeFilterCount = Object.keys(filters).filter(key => {
    const value = filters[key as keyof SearchFilters];
    return value !== undefined && value !== null && 
           (Array.isArray(value) ? value.length > 0 : true);
  }).length;

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by location, development, or property type..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            {/* Search Suggestions */}
            {suggestions.length > 0 && query && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 shadow-lg z-10 max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 border rounded-lg flex items-center gap-2 ${
              showFilters ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-5 h-5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Save Search */}
          <button
            onClick={saveSearch}
            className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Bookmark className="w-5 h-5" />
            Save Search
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Advanced Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min €"
                  value={filters.priceRange?.min || ''}
                  onChange={(e) => updateFilter('priceRange', {
                    ...filters.priceRange,
                    min: e.target.value ? parseInt(e.target.value) : undefined
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
                <input
                  type="number"
                  placeholder="Max €"
                  value={filters.priceRange?.max || ''}
                  onChange={(e) => updateFilter('priceRange', {
                    ...filters.priceRange,
                    max: e.target.value ? parseInt(e.target.value) : undefined
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
              <div className="flex gap-2">
                <select
                  value={filters.bedrooms?.min || ''}
                  onChange={(e) => updateFilter('bedrooms', {
                    ...filters.bedrooms,
                    min: e.target.value ? parseInt(e.target.value) : undefined
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="">Min</option>
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n}+</option>
                  ))}
                </select>
                <select
                  value={filters.bedrooms?.max || ''}
                  onChange={(e) => updateFilter('bedrooms', {
                    ...filters.bedrooms,
                    max: e.target.value ? parseInt(e.target.value) : undefined
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="">Max</option>
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <select
                multiple
                value={filters.propertyType || []}
                onChange={(e) => updateFilter('propertyType', 
                  Array.from(e.target.selectedOptions, option => option.value)
                )}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                size={3}
              >
                <option value="1 Bed Apartment">1 Bed Apartment</option>
                <option value="2 Bed Apartment">2 Bed Apartment</option>
                <option value="3 Bed Townhouse">3 Bed Townhouse</option>
                <option value="3 Bed Semi-Detached">3 Bed Semi-Detached</option>
                <option value="4 Bed Semi-Detached">4 Bed Semi-Detached</option>
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
              <select
                multiple
                value={filters.availabilityStatus || []}
                onChange={(e) => updateFilter('availabilityStatus', 
                  Array.from(e.target.selectedOptions, option => option.value)
                )}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                size={3}
              >
                <option value="Available">Available</option>
                <option value="Coming Soon">Coming Soon</option>
                <option value="Reserved">Reserved</option>
                <option value="Sold">Sold</option>
              </select>
            </div>

            {/* Features */}
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Help to Buy Eligible',
                  'Garden',
                  'Parking',
                  'Balcony',
                  'Modern Kitchen',
                  'Energy Efficient',
                  'Smart Home'
                ].map(feature => (
                  <label key={feature} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={feature === 'Help to Buy Eligible' ? 
                        filters.helpToBuy || false :
                        filters.features?.includes(feature) || false
                      }
                      onChange={(e) => {
                        if (feature === 'Help to Buy Eligible') {
                          updateFilter('helpToBuy', e.target.checked);
                        } else {
                          const currentFeatures = filters.features || [];
                          updateFilter('features', 
                            e.target.checked 
                              ? [...currentFeatures, feature]
                              : currentFeatures.filter(f => f !== feature)
                          );
                        }
                      }}
                      className="mr-2 rounded"
                    />
                    <span className="text-sm">{feature}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Header */}
      {results && (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold">
                {results.pagination.total} Properties Found
              </h2>
              <p className="text-sm text-gray-600">
                Search completed in {results.searchTime}ms
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={`${sort.field}-${sort.direction}`}
                  onChange={(e) => {
                    const [field, direction] = e.target.value.split('-') as [SearchSort['field'], SearchSort['direction']];
                    setSort({ field, direction });
                  }}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="bedrooms-desc">Most Bedrooms</option>
                  <option value="size-desc">Largest First</option>
                  <option value="completion-asc">Completion Date</option>
                  <option value="yield-desc">Highest Yield</option>
                </select>
              </div>

              {/* View Mode */}
              <div className="flex border border-gray-300 rounded">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      {loading ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Searching properties...</p>
        </div>
      ) : results ? (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {results.units.map((unit) => (
            <div key={unit.id} className={`bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow ${
              viewMode === 'list' ? 'flex' : ''
            }`}>
              {/* Property Image */}
              <div className={`relative ${viewMode === 'list' ? 'w-80 flex-shrink-0' : 'h-48'}`}>
                <img
                  src={unit.images[0] || '/images/property-placeholder.jpg'}
                  alt={`${unit.developmentName} ${unit.unitNumber}`}
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    unit.status === 'Available' ? 'bg-green-100 text-green-700' :
                    unit.status === 'Reserved' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {unit.status}
                  </span>
                </div>

                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => toggleFavorite(unit.id)}
                    className={`p-2 rounded-full ${
                      favorites.has(unit.id) ? 'bg-red-500 text-white' : 'bg-white text-gray-600'
                    } shadow-sm hover:shadow-md transition-shadow`}
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                </div>

                {unit.financing.helpToBuyEligible && (
                  <div className="absolute bottom-2 left-2">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                      Help to Buy
                    </span>
                  </div>
                )}
              </div>

              {/* Property Details */}
              <div className="p-4 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{unit.developmentName}</h3>
                    <p className="text-sm text-gray-600">{unit.unitNumber} • {unit.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{formatPrice(unit.basePrice)}</p>
                    <p className="text-sm text-gray-600">€{unit.financing.monthlyPayment}/month</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Bed className="w-4 h-4" />
                    {unit.bedrooms}
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="w-4 h-4" />
                    {unit.bathrooms}
                  </div>
                  <div className="flex items-center gap-1">
                    <Maximize className="w-4 h-4" />
                    {unit.floorArea}m²
                  </div>
                  {unit.investment.estimatedRentalYield && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {unit.investment.estimatedRentalYield}% yield
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                  <MapPin className="w-4 h-4" />
                  {unit.location.address}
                </div>

                {/* Match Reasons */}
                {unit.matchReasons.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {unit.matchReasons.map((reason, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded-full"
                        >
                          <CheckCircle className="w-3 h-3 inline mr-1" />
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Features */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {unit.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                    {unit.features.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        +{unit.features.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Your Property Search</h3>
          <p className="text-gray-600">Use the search and filters above to find your perfect property</p>
        </div>
      )}

      {/* Filter Aggregations */}
      {results && results.aggregations && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Refine Your Search</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Price Ranges */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Price Range</h4>
              {results.aggregations.priceRanges.map((range, index) => (
                <label key={index} className="flex items-center mb-1">
                  <input type="checkbox" className="mr-2 rounded" />
                  <span className="text-sm">{range.range} ({range.count})</span>
                </label>
              ))}
            </div>

            {/* Property Types */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Property Type</h4>
              {results.aggregations.propertyTypes.map((type, index) => (
                <label key={index} className="flex items-center mb-1">
                  <input type="checkbox" className="mr-2 rounded" />
                  <span className="text-sm">{type.type} ({type.count})</span>
                </label>
              ))}
            </div>

            {/* Developments */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Development</h4>
              {results.aggregations.developments.map((dev, index) => (
                <label key={index} className="flex items-center mb-1">
                  <input type="checkbox" className="mr-2 rounded" />
                  <span className="text-sm">{dev.name} ({dev.count})</span>
                </label>
              ))}
            </div>

            {/* Availability */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Availability</h4>
              {results.aggregations.availabilityStatus.map((status, index) => (
                <label key={index} className="flex items-center mb-1">
                  <input type="checkbox" className="mr-2 rounded" />
                  <span className="text-sm">{status.status} ({status.count})</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedPropertySearch;