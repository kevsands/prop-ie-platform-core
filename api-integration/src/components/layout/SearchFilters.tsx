'use client';

import React, { useState, useEffect } from 'react';
import { 
  Filter,
  MapPin,
  Home,
  Euro,
  Bed,
  Bath,
  Car,
  Sliders,
  X,
  Check,
  Star,
  Heart,
  Search,
  Save
} from 'lucide-react';
import { useSearchPreferences } from '@/hooks/useSearchPreferences';

interface SearchFiltersProps {
  buyerId?: string;
  onFiltersChange?: (filters: any) => void;
  onSearchExecute?: (filters: any) => void;
  className?: string;
}

interface FilterState {
  location: string[];
  propertyTypes: string[];
  priceRange: { min: number; max: number };
  bedrooms: { min: number; max: number };
  bathrooms: { min: number; max: number };
  features: string[];
  htbEligible: boolean;
}

export default function SearchFilters({
  buyerId,
  onFiltersChange,
  onSearchExecute,
  className = ''
}: SearchFiltersProps) {
  const { preferences, updatePreferences, isGuest } = useSearchPreferences(buyerId);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [savedSearchName, setSavedSearchName] = useState('');
  
  const [filters, setFilters] = useState<FilterState>({
    location: [],
    propertyTypes: ['apartment', 'house'],
    priceRange: { min: 250000, max: 500000 },
    bedrooms: { min: 1, max: 4 },
    bathrooms: { min: 1, max: 3 },
    features: [],
    htbEligible: false
  });

  // Sync filters with preferences when loaded
  useEffect(() => {
    if (preferences) {
      setFilters({
        location: preferences.location.counties,
        propertyTypes: preferences.property.types,
        priceRange: { min: preferences.budget.min, max: preferences.budget.max },
        bedrooms: preferences.property.bedrooms,
        bathrooms: preferences.property.bathrooms,
        features: [
          ...(preferences.property.parking ? ['parking'] : []),
          ...(preferences.property.garden ? ['garden'] : []),
          ...(preferences.property.balcony ? ['balcony'] : []),
          ...(preferences.property.ensuite ? ['ensuite'] : [])
        ],
        htbEligible: preferences.budget.includeHTB
      });
    }
  }, [preferences]);

  // Notify parent of filter changes
  useEffect(() => {
    onFiltersChange?.(filters);
  }, [filters, onFiltersChange]);

  const handleLocationChange = (location: string) => {
    setFilters(prev => ({
      ...prev,
      location: prev.location.includes(location)
        ? prev.location.filter(l => l !== location)
        : [...prev.location, location]
    }));
  };

  const handlePropertyTypeChange = (type: string) => {
    setFilters(prev => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter(t => t !== type)
        : [...prev.propertyTypes, type]
    }));
  };

  const handleFeatureChange = (feature: string) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleSearch = () => {
    // Update search preferences in background
    if (preferences) {
      updatePreferences({
        location: { ...preferences.location, counties: filters.location },
        property: {
          ...preferences.property,
          types: filters.propertyTypes,
          bedrooms: filters.bedrooms,
          bathrooms: filters.bathrooms,
          parking: filters.features.includes('parking'),
          garden: filters.features.includes('garden'),
          balcony: filters.features.includes('balcony'),
          ensuite: filters.features.includes('ensuite')
        },
        budget: {
          ...preferences.budget,
          min: filters.priceRange.min,
          max: filters.priceRange.max,
          includeHTB: filters.htbEligible
        }
      });
    }

    onSearchExecute?.(filters);
  };

  const handleSaveSearch = async () => {
    if (!buyerId || !savedSearchName.trim()) return;
    
    try {
      await fetch('/api/buyer-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-saved-search',
          buyerId,
          search: {
            name: savedSearchName,
            criteria: filters,
            frequency: 'daily',
            emailAlerts: true
          }
        })
      });
      
      setShowSaveDialog(false);
      setSavedSearchName('');
    } catch (error) {
      console.error('Error saving search:', error);
    }
  };

  const resetFilters = () => {
    setFilters({
      location: [],
      propertyTypes: ['apartment', 'house'],
      priceRange: { min: 250000, max: 500000 },
      bedrooms: { min: 1, max: 4 },
      bathrooms: { min: 1, max: 3 },
      features: [],
      htbEligible: false
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.location.length > 0) count++;
    if (filters.propertyTypes.length !== 2) count++;
    if (filters.priceRange.min !== 250000 || filters.priceRange.max !== 500000) count++;
    if (filters.bedrooms.min !== 1 || filters.bedrooms.max !== 4) count++;
    if (filters.bathrooms.min !== 1 || filters.bathrooms.max !== 3) count++;
    if (filters.features.length > 0) count++;
    if (filters.htbEligible) count++;
    return count;
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Search Filters</h3>
            {getActiveFilterCount() > 0 && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                {getActiveFilterCount()} active
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {getActiveFilterCount() > 0 && (
              <button
                onClick={resetFilters}
                className="px-3 py-1 text-gray-600 hover:text-gray-800 text-sm"
              >
                Clear all
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Filters (Always Visible) */}
      <div className="p-4 space-y-4">
        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Location
          </label>
          <div className="flex flex-wrap gap-2">
            {['Dublin', 'Cork', 'Galway', 'Meath', 'Kildare', 'Wicklow'].map(county => (
              <button
                key={county}
                onClick={() => handleLocationChange(county)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  filters.location.includes(county)
                    ? 'bg-blue-100 text-blue-700 border-blue-300'
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:border-blue-300'
                }`}
              >
                {county}
              </button>
            ))}
          </div>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Home className="w-4 h-4 inline mr-1" />
            Property Type
          </label>
          <div className="flex flex-wrap gap-2">
            {['apartment', 'house', 'townhouse', 'duplex', 'penthouse'].map(type => (
              <button
                key={type}
                onClick={() => handlePropertyTypeChange(type)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors capitalize ${
                  filters.propertyTypes.includes(type)
                    ? 'bg-green-100 text-green-700 border-green-300'
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:border-green-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Euro className="w-4 h-4 inline mr-1" />
            Budget ({formatCurrency(filters.priceRange.min)} - {formatCurrency(filters.priceRange.max)})
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="range"
                min="100000"
                max="1000000"
                step="10000"
                value={filters.priceRange.min}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  priceRange: { ...prev.priceRange, min: parseInt(e.target.value) }
                }))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 mt-1">Min: {formatCurrency(filters.priceRange.min)}</div>
            </div>
            <div>
              <input
                type="range"
                min="200000"
                max="2000000"
                step="10000"
                value={filters.priceRange.max}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  priceRange: { ...prev.priceRange, max: parseInt(e.target.value) }
                }))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 mt-1">Max: {formatCurrency(filters.priceRange.max)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="p-4 pt-0 space-y-4 border-t border-gray-100">
          {/* Bedrooms & Bathrooms */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Bed className="w-4 h-4 inline mr-1" />
                Bedrooms
              </label>
              <div className="flex gap-2">
                <select
                  value={filters.bedrooms.min}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    bedrooms: { ...prev.bedrooms, min: parseInt(e.target.value) }
                  }))}
                  className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}+</option>
                  ))}
                </select>
                <span className="py-1 text-sm text-gray-500">to</span>
                <select
                  value={filters.bedrooms.max}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    bedrooms: { ...prev.bedrooms, max: parseInt(e.target.value) }
                  }))}
                  className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Bath className="w-4 h-4 inline mr-1" />
                Bathrooms
              </label>
              <div className="flex gap-2">
                <select
                  value={filters.bathrooms.min}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    bathrooms: { ...prev.bathrooms, min: parseInt(e.target.value) }
                  }))}
                  className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  {[1, 2, 3, 4].map(num => (
                    <option key={num} value={num}>{num}+</option>
                  ))}
                </select>
                <span className="py-1 text-sm text-gray-500">to</span>
                <select
                  value={filters.bathrooms.max}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    bathrooms: { ...prev.bathrooms, max: parseInt(e.target.value) }
                  }))}
                  className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  {[1, 2, 3, 4].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'parking', label: 'Parking', icon: Car },
                { key: 'garden', label: 'Garden', icon: Home },
                { key: 'balcony', label: 'Balcony', icon: Home },
                { key: 'ensuite', label: 'En-suite', icon: Bath }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => handleFeatureChange(key)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors flex items-center gap-1 ${
                    filters.features.includes(key)
                      ? 'bg-purple-100 text-purple-700 border-purple-300'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:border-purple-300'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Help to Buy */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.htbEligible}
                onChange={(e) => setFilters(prev => ({ ...prev, htbEligible: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 mr-2"
              />
              <span className="text-sm text-gray-700">Help to Buy eligible only</span>
            </label>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-3">
          <button
            onClick={handleSearch}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search Properties
          </button>
          
          {!isGuest && (
            <button
              onClick={() => setShowSaveDialog(true)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          )}
        </div>
        
        {isGuest && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Create an account</strong> to save your search preferences and get personalized recommendations!
            </p>
          </div>
        )}
      </div>

      {/* Save Search Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Save Search</h3>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search Name</label>
                <input
                  type="text"
                  value={savedSearchName}
                  onChange={(e) => setSavedSearchName(e.target.value)}
                  placeholder="e.g., 2-bed apartments in Dublin"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleSaveSearch}
                  disabled={!savedSearchName.trim()}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                  Save Search
                </button>
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}