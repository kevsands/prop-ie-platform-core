/**
 * Property Recommendations Page
 * Advanced property search with AI-powered recommendations, filtering, and sorting
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PersonalizedPropertyCard from '@/components/properties/PersonalizedPropertyCard';
import { usePropertyRecommendations } from '@/hooks/usePropertyRecommendations';
import { UserProfile, PropertyMatch } from '@/lib/algorithms/PropertyRecommendationEngine';
import { 
  Filter, 
  SlidersHorizontal, 
  Grid, 
  List, 
  ArrowUpDown, 
  Star, 
  Euro, 
  Home, 
  MapPin, 
  Bed,
  Sparkles,
  Target,
  RefreshCw,
  X,
  ChevronDown,
  Search,
  TrendingUp,
  Heart,
  Eye,
  Calendar
} from 'lucide-react';

interface FilterOptions {
  matchScoreMin: number;
  priceMin: number;
  priceMax: number;
  bedrooms: string[];
  propertyTypes: string[];
  counties: string[];
  features: string[];
  htbEligible: boolean;
  availableOnly: boolean;
}

type SortOption = 'match_score' | 'price_low' | 'price_high' | 'bedrooms' | 'date_added';

export default function PropertyRecommendationsPage() {
  const searchParams = useSearchParams();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('match_score');
  const [showFilters, setShowFilters] = useState(false);
  const [favoriteProperties, setFavoriteProperties] = useState<string[]>([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState<PropertyMatch[]>([]);

  const [filters, setFilters] = useState<FilterOptions>({
    matchScoreMin: 0,
    priceMin: 0,
    priceMax: 1000000,
    bedrooms: [],
    propertyTypes: [],
    counties: [],
    features: [],
    htbEligible: false,
    availableOnly: true
  });

  // Build user profile
  useEffect(() => {
    const buildUserProfile = () => {
      const storedData = localStorage.getItem('userRegistration');
      let profile: UserProfile = {};

      if (storedData) {
        const registrationData = JSON.parse(storedData);
        profile = {
          firstName: registrationData.firstName,
          lastName: registrationData.lastName,
          email: registrationData.email,
          journeySource: registrationData.journeyContext?.source,
        };
      }

      // Enhanced profile for better recommendations
      profile = {
        ...profile,
        budget: '300-500',
        hasHTB: true,
        preferredCounties: ['Dublin', 'Kildare', 'Wicklow'],
        propertyType: ['apartment', 'house', 'duplex'],
        bedrooms: '2-4',
        currentStatus: 'first-time-buyer',
        importantFeatures: ['parking', 'balcony', 'modern kitchen', 'gym', 'garden'],
        moveInTimeframe: '3-6-months',
        completionScore: 85
      };

      setUserProfile(profile);
    };

    buildUserProfile();
  }, []);

  // Get property recommendations
  const { 
    recommendations, 
    analytics, 
    loading: recommendationsLoading, 
    error: recommendationsError,
    refetch
  } = usePropertyRecommendations({
    userProfile: userProfile || undefined,
    limit: 50,
    autoFetch: !!userProfile
  });

  // Apply filters and sorting
  useEffect(() => {
    if (!recommendations.length) return;

    const filtered = recommendations.filter(match => {
      const property = match.property;
      
      // Match score filter
      if (match.matchScore < filters.matchScoreMin) return false;
      
      // Price filter
      if (property.price < filters.priceMin || property.price > filters.priceMax) return false;
      
      // Bedrooms filter
      if (filters.bedrooms.length && !filters.bedrooms.includes(property.bedrooms?.toString() || '')) return false;
      
      // Property type filter
      if (filters.propertyTypes.length && !filters.propertyTypes.some(type => 
        property.type?.toLowerCase().includes(type.toLowerCase())
      )) return false;
      
      // County filter
      if (filters.counties.length && !filters.counties.some(county =>
        property.address?.city?.toLowerCase().includes(county.toLowerCase()) ||
        property.address?.state?.toLowerCase().includes(county.toLowerCase())
      )) return false;
      
      // Features filter
      if (filters.features.length && !filters.features.some(feature =>
        property.features?.some(pf => pf.toLowerCase().includes(feature.toLowerCase())) ||
        property.amenities?.some(pa => pa.toLowerCase().includes(feature.toLowerCase()))
      )) return false;
      
      // HTB eligibility filter
      if (filters.htbEligible && !property.isNew) return false;
      
      // Availability filter
      if (filters.availableOnly && property.status !== 'Available') return false;
      
      return true;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'match_score':
          return b.matchScore - a.matchScore;
        case 'price_low':
          return a.property.price - b.property.price;
        case 'price_high':
          return b.property.price - a.property.price;
        case 'bedrooms':
          return (b.property.bedrooms || 0) - (a.property.bedrooms || 0);
        case 'date_added':
          return new Date(b.property.createdAt).getTime() - new Date(a.property.createdAt).getTime();
        default:
          return 0;
      }
    });

    setFilteredRecommendations(filtered);
  }, [recommendations, filters, sortBy]);

  const handleFavorite = (propertyId: string) => {
    setFavoriteProperties(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      matchScoreMin: 0,
      priceMin: 0,
      priceMax: 1000000,
      bedrooms: [],
      propertyTypes: [],
      counties: [],
      features: [],
      htbEligible: false,
      availableOnly: true
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const bedroomOptions = ['1', '2', '3', '4', '5+'];
  const propertyTypeOptions = ['Apartment', 'House', 'Duplex', 'Studio', 'Townhouse'];
  const countyOptions = ['Dublin', 'Cork', 'Galway', 'Limerick', 'Kildare', 'Wicklow', 'Meath'];
  const featureOptions = ['Parking', 'Balcony', 'Garden', 'Gym', 'Pool', 'Concierge', 'Storage'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Sparkles className="text-blue-600" />
                AI Property Recommendations
              </h1>
              <p className="text-gray-600 mt-1">
                Personalized property matches powered by machine learning
              </p>
              {analytics && (
                <div className="flex items-center gap-6 mt-3 text-sm text-gray-600">
                  <span>📊 {analytics.totalPropertiesAnalyzed} properties analyzed</span>
                  <span>🎯 {analytics.averageMatchScore}% avg match score</span>
                  <span>⭐ {analytics.topMatchScore}% best match</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => refetch()}
                disabled={recommendationsLoading}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw size={16} className={recommendationsLoading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
              >
                <List size={16} />
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="match_score">Best Match</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="bedrooms">Most Bedrooms</option>
              <option value="date_added">Recently Added</option>
            </select>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <SlidersHorizontal size={16} />
              Filters
              {Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : v !== 0 && v !== false && v !== 1000000) && (
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              )}
            </button>
          </div>

          <div className="text-sm text-gray-600">
            Showing {filteredRecommendations.length} of {recommendations.length} properties
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Match Score */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Match Score: {filters.matchScoreMin}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.matchScoreMin}
                  onChange={(e) => updateFilter('matchScoreMin', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceMin || ''}
                    onChange={(e) => updateFilter('priceMin', parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceMax === 1000000 ? '' : filters.priceMax}
                    onChange={(e) => updateFilter('priceMax', parseInt(e.target.value) || 1000000)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>
                <div className="flex flex-wrap gap-1">
                  {bedroomOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => {
                        const current = filters.bedrooms;
                        updateFilter(
                          'bedrooms',
                          current.includes(option)
                            ? current.filter(b => b !== option)
                            : [...current, option]
                        );
                      }}
                      className={`px-2 py-1 text-xs rounded border ${
                        filters.bedrooms.includes(option)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <div className="flex flex-wrap gap-1">
                  {propertyTypeOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => {
                        const current = filters.propertyTypes;
                        updateFilter(
                          'propertyTypes',
                          current.includes(option)
                            ? current.filter(t => t !== option)
                            : [...current, option]
                        );
                      }}
                      className={`px-2 py-1 text-xs rounded border ${
                        filters.propertyTypes.includes(option)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 mt-4 pt-4 border-t">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.htbEligible}
                  onChange={(e) => updateFilter('htbEligible', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">HTB Eligible Only</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.availableOnly}
                  onChange={(e) => updateFilter('availableOnly', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Available Only</span>
              </label>
            </div>
          </div>
        )}

        {/* Property Grid */}
        {recommendationsLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Finding your perfect properties...</p>
          </div>
        ) : recommendationsError ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <Home size={48} className="mx-auto mb-2" />
              <p>Failed to load recommendations</p>
            </div>
            <button
              onClick={() => refetch()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : filteredRecommendations.length === 0 ? (
          <div className="text-center py-12">
            <Search size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties match your filters</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters to see more results</p>
            <button
              onClick={clearFilters}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredRecommendations.map((match) => (
              <PersonalizedPropertyCard
                key={match.property.id}
                match={match}
                onFavorite={handleFavorite}
                isFavorited={favoriteProperties.includes(match.property.id)}
                showMatchScore={true}
                showExplanations={viewMode === 'list'}
                className={viewMode === 'list' ? 'lg:flex' : ''}
              />
            ))}
          </div>
        )}

        {/* Load More */}
        {filteredRecommendations.length > 0 && filteredRecommendations.length < recommendations.length && (
          <div className="text-center mt-8">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700">
              Load More Properties
            </button>
          </div>
        )}
      </div>
    </div>
  );
}