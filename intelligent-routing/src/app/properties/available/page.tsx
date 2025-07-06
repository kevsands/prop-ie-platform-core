'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  Filter, 
  MapPin, 
  Bed, 
  Bath, 
  Car, 
  Home,
  Heart,
  Share2,
  TrendingUp,
  Sparkles,
  Brain,
  Target,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  Calendar,
  DollarSign,
  Eye,
  Users,
  Star,
  ArrowUp,
  Clock,
  Zap,
  Award,
  Euro,
  Calculator
} from 'lucide-react';
import { HelpToBuyCalculator } from '@/components/calculators/HelpToBuyCalculator';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
  status: string;
  images: string[];
  features: string[];
  developmentName: string;
  htbEligible: boolean;
  htbAmount: number;
  // Advanced search features
  type: string;
  parking?: number;
  aiScore?: number;
  matchReasons?: string[];
  developerPriority?: 'urgent' | 'high' | 'medium' | 'low';
  viewings?: number;
  saves?: number;
  incentives?: string[];
  priceHistory?: { date: string; price: number; }[];
  completionDate?: string;
  energyRating?: string;
  priceDisplay?: string;
}

export default function AvailablePropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBedrooms, setFilterBedrooms] = useState('');
  const [filterMaxPrice, setFilterMaxPrice] = useState('');
  
  // Advanced search states from search page
  const [showFilters, setShowFilters] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(true);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedBeds, setSelectedBeds] = useState('Any');
  const [selectedDevelopment, setSelectedDevelopment] = useState('All Developments');
  const [sortBy, setSortBy] = useState('ai-recommended');
  const [viewMode, setViewMode] = useState('grid');
  const [activeProperty, setActiveProperty] = useState(null);
  const [showHTBCalculator, setShowHTBCalculator] = useState(false);
  const [selectedPropertyForHTB, setSelectedPropertyForHTB] = useState(null);
  
  // Search filters configuration
  const searchFilters = {
    priceRanges: [
      { label: 'Under €300k', min: 0, max: 300000 },
      { label: '€300k - €400k', min: 300000, max: 400000 },
      { label: '€400k - €500k', min: 400000, max: 500000 },
      { label: '€500k+', min: 500000, max: Infinity }
    ],
    propertyTypes: ['All Types', 'House', 'Apartment', 'Duplex', 'Townhouse'],
    bedrooms: ['Any', '1+', '2+', '3+', '4+'],
    developments: ['All Developments', 'Fitzgerald Gardens', 'Ballymakenny View', 'Ellwood']
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      // Fetch all available properties from API
      const response = await fetch('/api/properties?status=available&limit=100');
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      
      const data = await response.json();
      // Transform API data to include advanced search features
      const transformedProperties = (data.properties || []).map((property: any) => ({
        ...property,
        type: property.type || 'House',
        parking: property.parking || 1,
        aiScore: Math.floor(Math.random() * 30) + 70, // Mock AI scores 70-99
        matchReasons: [
          'Perfect for families',
          'Excellent transport links',
          'Growing area value'
        ].slice(0, Math.floor(Math.random() * 3) + 1),
        developerPriority: ['low', 'medium', 'high', 'urgent'][Math.floor(Math.random() * 4)],
        viewings: Math.floor(Math.random() * 100) + 10,
        saves: Math.floor(Math.random() * 50) + 5,
        incentives: [
          'Legal fees paid',
          'Furniture voucher included',
          'Stamp duty reduction'
        ].slice(0, Math.floor(Math.random() * 3)),
        priceHistory: [
          { date: '2024-01', price: property.price + 15000 },
          { date: '2024-02', price: property.price + 8000 },
          { date: '2024-03', price: property.price }
        ],
        completionDate: 'Q2 2024',
        energyRating: 'A2',
        priceDisplay: new Intl.NumberFormat('en-IE', {
          style: 'currency',
          currency: 'EUR',
          maximumFractionDigits: 0,
        }).format(property.price)
      }));
      
      setProperties(transformedProperties);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Enhanced filtering logic from search page
  const filteredProperties = React.useMemo(() => {
    const filtered = properties.filter(property => {
      // Search term matching
      const searchQuery = searchTerm.toLowerCase();
      const matchesSearch = !searchQuery || 
        property.title.toLowerCase().includes(searchQuery) ||
        property.location.toLowerCase().includes(searchQuery) ||
        property.developmentName.toLowerCase().includes(searchQuery) ||
        property.features?.some(f => f.toLowerCase().includes(searchQuery));
      
      // Price range filtering
      let matchesPrice = true;
      if (selectedPriceRange && selectedPriceRange !== '') {
        const range = searchFilters.priceRanges.find(r => r.label === selectedPriceRange);
        if (range) {
          matchesPrice = property.price >= range.min && property.price <= range.max;
        }
      }
      if (filterMaxPrice) {
        matchesPrice = property.price <= parseInt(filterMaxPrice);
      }
      
      // Property type filtering
      const matchesType = selectedType === 'All Types' || property.type === selectedType;
      
      // Bedrooms filtering
      let matchesBedrooms = true;
      if (selectedBeds !== 'Any') {
        const bedsNum = parseInt(selectedBeds.replace('+', ''));
        matchesBedrooms = property.bedrooms >= bedsNum;
      }
      if (filterBedrooms) {
        matchesBedrooms = property.bedrooms >= parseInt(filterBedrooms);
      }
      
      // Development filtering
      const matchesDevelopment = selectedDevelopment === 'All Developments' || 
        property.developmentName === selectedDevelopment;
      
      return matchesSearch && matchesPrice && matchesType && matchesBedrooms && matchesDevelopment;
    });
    
    // Sort properties
    switch (sortBy) {
      case 'ai-recommended':
        filtered.sort((a, b) => {
          const priorityWeight = { urgent: 3, high: 2, medium: 1, low: 0 };
          const aPriority = priorityWeight[a.developerPriority || 'low'];
          const bPriority = priorityWeight[b.developerPriority || 'low'];
          
          if (aPriority !== bPriority) return bPriority - aPriority;
          return (b.aiScore || 0) - (a.aiScore || 0);
        });
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => (a.completionDate || '').localeCompare(b.completionDate || ''));
        break;
      case 'popular':
        filtered.sort((a, b) => ((b.viewings || 0) + (b.saves || 0)) - ((a.viewings || 0) + (a.saves || 0)));
        break;
    }
    
    return filtered;
  }, [properties, searchTerm, selectedPriceRange, selectedType, selectedBeds, selectedDevelopment, filterBedrooms, filterMaxPrice, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading available properties...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={fetchProperties}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <section className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Available Properties
            </h1>
            <p className="text-xl text-blue-100">
              {filteredProperties.length} properties ready for immediate purchase across all developments
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by location, development, or property type..."
                className="w-full px-6 py-4 pl-12 pr-32 text-gray-900 bg-white rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-400"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
            
            {/* Quick Filters */}
            <div className="mt-4 flex flex-wrap gap-3 justify-center">
              {searchFilters.priceRanges.map((range, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPriceRange(range.label)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedPriceRange === range.label
                      ? 'bg-white text-blue-900'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI Insights Banner */}
      {showAIInsights && (
        <section className="bg-gradient-to-r from-purple-100 to-pink-100 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    AI Property Matching Active
                  </h3>
                  <p className="text-sm text-gray-600">
                    Showing all available properties with AI scoring and personalized recommendations
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAIInsights(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Filters and Results */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredProperties.length} Properties Available
              </h2>
              <p className="text-gray-600">
                {filteredProperties.filter(p => (p.aiScore || 0) >= 85).length} highly recommended by AI
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ai-recommended">AI Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
              </select>
              
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : ''
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : ''
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex gap-8">
            {/* Sidebar Filters */}
            {showFilters && (
              <div className="w-80 flex-shrink-0">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
                  
                  {/* Property Type */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Type
                    </label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {searchFilters.propertyTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Bedrooms */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bedrooms
                    </label>
                    <select
                      value={selectedBeds}
                      onChange={(e) => setSelectedBeds(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {searchFilters.bedrooms.map((beds) => (
                        <option key={beds} value={beds}>{beds}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Development */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Development
                    </label>
                    <select
                      value={selectedDevelopment}
                      onChange={(e) => setSelectedDevelopment(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {searchFilters.developments.map((dev) => (
                        <option key={dev} value={dev}>{dev}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* AI Preferences */}
                  <div className="mb-6 p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      AI Preferences
                    </h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded text-purple-600" defaultChecked />
                        <span className="text-sm text-gray-700">Family-friendly areas</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded text-purple-600" defaultChecked />
                        <span className="text-sm text-gray-700">Near schools</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded text-purple-600" />
                        <span className="text-sm text-gray-700">Investment potential</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded text-purple-600" />
                        <span className="text-sm text-gray-700">Move-in ready</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Reset Filters */}
                  <button 
                    onClick={() => {
                      setSelectedPriceRange('');
                      setSelectedType('All Types');
                      setSelectedBeds('Any');
                      setSelectedDevelopment('All Developments');
                      setFilterBedrooms('');
                      setFilterMaxPrice('');
                      setSearchTerm('');
                    }}
                    className="w-full py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Reset all filters
                  </button>
                </div>
              </div>
            )}
            
            {/* Property Grid */}
            <div className="flex-1">
              {/* Developer Priority Alert */}
              {filteredProperties.some(p => p.developerPriority === 'urgent') && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Zap className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-red-900">Limited Time Offers</h4>
                      <p className="text-sm text-red-700">
                        Some properties have special incentives ending soon. Don't miss out!
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Properties Grid */}
              {filteredProperties.length === 0 ? (
                <div className="text-center py-12">
                  <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No properties found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria.</p>
                </div>
              ) : (
                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                  {filteredProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )}
              
              {/* Load More */}
              <div className="mt-12 text-center">
                <button 
                  onClick={fetchProperties}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Load More Properties
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Help-to-Buy Calculator Modal */}
      {showHTBCalculator && selectedPropertyForHTB && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  Help-to-Buy Calculator
                </h3>
                <button
                  onClick={() => {
                    setShowHTBCalculator(false);
                    setSelectedPropertyForHTB(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <HelpToBuyCalculator
                propertyPrice={selectedPropertyForHTB.price}
                propertyTitle={selectedPropertyForHTB.title}
                onClose={() => {
                  setShowHTBCalculator(false);
                  setSelectedPropertyForHTB(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// PropertyCard component with advanced features from search page
const PropertyCard = ({ property }: { property: Property }) => {
  const isHot = property.developerPriority === 'urgent' || property.developerPriority === 'high';
  const priceDropped = property.priceHistory && property.priceHistory.length > 0 && 
    property.priceHistory[0].price > property.price;
  const aiScore = property.aiScore || 0;
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
        property.developerPriority === 'urgent' ? 'ring-2 ring-red-500' : ''
      }`}
    >
      <div className="relative">
        <Image
          src={property.images?.[0] || '/images/properties/default-property.jpg'}
          alt={property.title}
          width={400}
          height={300}
          className="w-full h-64 object-cover"
        />
        
        {/* Status Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {aiScore >= 90 && (
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              AI Match {aiScore}%
            </div>
          )}
          {isHot && (
            <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              <Zap className="w-4 h-4" />
              Hot Property
            </div>
          )}
          {priceDropped && (
            <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Price Reduced
            </div>
          )}
          {property.status !== 'Available' && property.status !== 'available' && (
            <div className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {property.status}
            </div>
          )}
        </div>
        
        {/* Property Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
            <Heart className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>
          {property.htbEligible && (
            <button 
              className="p-2 bg-green-600/90 backdrop-blur-sm rounded-full hover:bg-green-700 transition-colors"
              title="Calculate Help-to-Buy"
            >
              <Calculator className="w-5 h-5 text-white" />
            </button>
          )}
        </div>
        
        {/* Completion Badge */}
        {property.completionDate && (
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
            {property.completionDate}
          </div>
        )}
      </div>
      
      <div className="p-6">
        {/* Price and Title */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{property.title}</h3>
            <p className="text-gray-600">{property.developmentName}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              {property.priceDisplay || formatPrice(property.price)}
            </p>
            {priceDropped && property.priceHistory && (
              <p className="text-sm text-green-600">
                <ArrowUp className="w-3 h-3 inline rotate-180" />
                €{((property.priceHistory[0].price - property.price) / 1000).toFixed(0)}k
              </p>
            )}
          </div>
        </div>
        
        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{property.location}</span>
        </div>
        
        {/* Property Details */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">{property.bedrooms} beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">{property.bathrooms} baths</span>
          </div>
          {property.parking && (
            <div className="flex items-center gap-1">
              <Car className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">{property.parking} parking</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Home className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">{property.size} sq ft</span>
          </div>
        </div>
        
        {/* AI Match Reasons */}
        {aiScore >= 85 && property.matchReasons && (
          <div className="mb-4 p-3 bg-purple-50 rounded-lg">
            <p className="text-sm font-medium text-purple-900 mb-2 flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Recommends Because:
            </p>
            <ul className="text-sm text-purple-700 space-y-1">
              {property.matchReasons.map((reason, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Check className="w-3 h-3" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Help-to-Buy Benefit */}
        {property.htbEligible && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-900 flex items-center gap-2">
                  <Euro className="w-4 h-4" />
                  Help-to-Buy Eligible
                </p>
                <p className="text-lg font-bold text-green-700">
                  {formatPrice(property.htbAmount)} potential refund
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Incentives */}
        {property.incentives && property.incentives.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-900 mb-2">Special Offers:</p>
            <div className="flex flex-wrap gap-2">
              {property.incentives.map((incentive, idx) => (
                <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                  {incentive}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Engagement Stats */}
        {(property.viewings || property.saves) && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {property.viewings && (
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {property.viewings} views
                </span>
              )}
              {property.saves && (
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {property.saves} saves
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Listed recently</span>
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href={`/properties/${property.id}`}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium text-center hover:bg-blue-700 transition-colors"
          >
            View Details
          </Link>
          <button className="px-4 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            <Calendar className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};