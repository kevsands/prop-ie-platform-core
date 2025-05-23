'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  MapPin, 
  Home, 
  Euro, 
  ChevronDown,
  ArrowRight,
  Bed,
  Calendar
} from 'lucide-react';

interface SearchFormData {
  location: string;
  propertyType: string;
  bedrooms: string;
  priceRange: string;
  searchQuery: string;
}

export default function EnhancedPropertySearch() {
  const router = useRouter();
  const [activeTabsetActiveTab] = useState<'buy' | 'rent' | 'newHomes'>('newHomes');
  const [isAdvancedSearchsetIsAdvancedSearch] = useState(false);

  const [formDatasetFormData] = useState<SearchFormData>({
    location: '',
    propertyType: '',
    bedrooms: '',
    priceRange: '',
    searchQuery: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Build query parameters
    const params = new URLSearchParams();
    Object.entries(formData).forEach(([keyvalue]) => {
      if (value) {
        params.append(keyvalue);
      }
    });

    // Add tab as parameter
    params.append('tab', activeTab);

    // Navigate to search page with parameters
    router.push(`/properties/search?${params.toString()}`);
  };

  // Popular searches
  const popularSearches = [
    { label: '3-bed houses', query: '?bedrooms=3&propertyType=house' },
    { label: 'Fitzgerald Gardens', query: '?development=fitzgerald-gardens' },
    { label: 'Modern apartments', query: '?propertyType=apartment&features=modern' },
    { label: 'First-time buyer homes', query: '?firstTimeBuyer=true' }];

  // Price range options
  const priceRanges = [
    { value: 'any', label: 'Any Price' },
    { value: '0-250000', label: 'Up to €250,000' },
    { value: '250000-350000', label: '€250,000 - €350,000' },
    { value: '350000-500000', label: '€350,000 - €500,000' },
    { value: '500000-750000', label: '€500,000 - €750,000' },
    { value: '750000-1000000', label: '€750,000 - €1,000,000' },
    { value: '1000000+', label: 'Over €1,000,000' }];

  // Location options
  const locations = [
    { value: '', label: 'Any Location' },
    { value: 'dublin', label: 'Dublin' },
    { value: 'cork', label: 'Cork' },
    { value: 'galway', label: 'Galway' },
    { value: 'limerick', label: 'Limerick' },
    { value: 'waterford', label: 'Waterford' },
    { value: 'drogheda', label: 'Drogheda' },
    { value: 'kildare', label: 'Kildare' },
    { value: 'wicklow', label: 'Wicklow' }];

  // Property types
  const propertyTypes = [
    { value: '', label: 'Any Property Type' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'duplex', label: 'Duplex' },
    { value: 'bungalow', label: 'Bungalow' },
    { value: 'townhouse', label: 'Townhouse' }];

  // Bedrooms
  const bedroomOptions = [
    { value: '', label: 'Any Bedrooms' },
    { value: '1', label: '1+ Bed' },
    { value: '2', label: '2+ Beds' },
    { value: '3', label: '3+ Beds' },
    { value: '4', label: '4+ Beds' },
    { value: '5', label: '5+ Beds' }];

  return (
    <div className="w-full bg-white shadow-2xl rounded-xl border border-gray-100">
      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`flex-1 py-4 text-center font-medium ${
            activeTab === 'buy' 
              ? 'text-[#2B5273] border-b-2 border-[#2B5273]' 
              : 'text-gray-500 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('buy')}
        >
          Buy
        </button>
        <button
          className={`flex-1 py-4 text-center font-medium ${
            activeTab === 'rent' 
              ? 'text-[#2B5273] border-b-2 border-[#2B5273]' 
              : 'text-gray-500 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('rent')}
        >
          Rent
        </button>
        <button
          className={`flex-1 py-4 text-center font-medium ${
            activeTab === 'newHomes' 
              ? 'text-[#2B5273] border-b-2 border-[#2B5273]' 
              : 'text-gray-500 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('newHomes')}
        >
          New Homes
        </button>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="p-6">
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            name="searchQuery"
            value={formData.searchQuery}
            onChange={handleInputChange}
            placeholder="Search by location, development name, or features..."
            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B5273] focus:border-[#2B5273]"
          />
        </div>

        {isAdvancedSearch && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#2B5273] focus:border-[#2B5273]"
                >
                  {locations.map((location) => (
                    <option key={location.value} value={location.value}>
                      {location.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#2B5273] focus:border-[#2B5273]"
                >
                  {propertyTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
              <div className="relative">
                <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#2B5273] focus:border-[#2B5273]"
                >
                  {bedroomOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <div className="relative">
                <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  name="priceRange"
                  value={formData.priceRange}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#2B5273] focus:border-[#2B5273]"
                >
                  {priceRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsAdvancedSearch(!isAdvancedSearch)}
            className="text-[#2B5273] font-medium text-sm flex items-center"
          >
            {isAdvancedSearch ? 'Simple Search' : 'Advanced Search'}
            <ChevronDown className={`ml-1 h-4 w-4 transform ${isAdvancedSearch ? 'rotate-180' : ''} transition-transform`} />
          </button>

          <button
            type="submit"
            className="bg-[#2B5273] text-white px-6 py-3 rounded-lg hover:bg-[#1E3142] transition-colors font-medium flex items-center"
          >
            Search Properties
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </form>

      {/* Popular Searches */}
      <div className="px-6 pb-6">
        <div className="flex flex-wrap gap-2 items-center text-sm">
          <span className="text-gray-600">Popular searches:</span>
          {popularSearches.map((searchindex) => (
            <a
              key={index}
              href={`/properties/search${search.query}`}
              className="text-[#2B5273] hover:underline"
            >
              {search.label}
            </a>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gray-50 px-6 py-4 rounded-b-xl border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <Home className="h-5 w-5 text-[#2B5273] mr-2" />
            <span className="text-sm">120+ New Developments</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-[#2B5273] mr-2" />
            <span className="text-sm">Updated Daily</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-[#2B5273] mr-2" />
            <span className="text-sm">Nationwide Coverage</span>
          </div>
        </div>
      </div>
    </div>
  );
}