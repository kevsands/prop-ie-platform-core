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

// Mock property data with AI scoring
const mockProperties = [
  {
    id: 1,
    title: 'Premium 3-Bed Family Home',
    development: 'Fitzgerald Gardens',
    location: 'Drogheda, Co. Louth',
    price: 425000,
    priceDisplay: '€425,000',
    beds: 3,
    baths: 2,
    parking: 2,
    size: 1450,
    image: '/images/developments/fitzgerald-gardens/3bed-House.jpeg',
    type: 'House',
    status: 'Available',
    completionDate: 'Q2 2024',
    aiScore: 98,
    matchReasons: ['Perfect for families', 'Close to schools', 'Growing area'],
    developerPriority: 'high',
    viewings: 45,
    saves: 12,
    features: ['Garden', 'En-suite', 'A-rated BER', 'Solar panels'],
    incentives: ['€5,000 furniture voucher', 'Legal fees paid'],
    priceHistory: [
      { date: '2024-01', price: 445000 },
      { date: '2024-02', price: 435000 },
      { date: '2024-03', price: 425000 }
    ],
    htbEligible: true,
    htbAmount: 30000
  },
  {
    id: 2,
    title: 'Modern 2-Bed Apartment',
    development: 'Ellwood',
    location: 'Riverside, Drogheda',
    price: 295000,
    priceDisplay: '€295,000',
    beds: 2,
    baths: 1,
    parking: 1,
    size: 850,
    image: '/images/developments/Ellwood-Logos/hero.jpg',
    type: 'Apartment',
    status: 'Available',
    completionDate: 'Q3 2024',
    aiScore: 92,
    matchReasons: ['Great for first-time buyers', 'Near transport', 'Affordable'],
    developerPriority: 'medium',
    viewings: 67,
    saves: 23,
    features: ['Balcony', 'Open plan', 'A-rated BER', 'Gym access'],
    incentives: ['Help to Buy eligible', '€2,500 appliance credit'],
    priceHistory: [
      { date: '2024-01', price: 310000 },
      { date: '2024-02', price: 300000 },
      { date: '2024-03', price: 295000 }
    ],
    htbEligible: true,
    htbAmount: 29500
  },
  {
    id: 3,
    title: 'Executive 4-Bed Detached',
    development: 'Ballymakenny View',
    location: 'Ballymakenny, Drogheda',
    price: 575000,
    priceDisplay: '€575,000',
    beds: 4,
    baths: 3,
    parking: 2,
    size: 2200,
    image: '/images/developments/Ballymakenny-View/hero.jpg',
    type: 'House',
    status: 'Show House Available',
    completionDate: 'Q1 2024',
    aiScore: 88,
    matchReasons: ['Executive home', 'Large garden', 'Premium finishes'],
    developerPriority: 'urgent',
    viewings: 34,
    saves: 18,
    features: ['Double garage', 'Home office', 'Premium kitchen', 'Master suite'],
    incentives: ['€10,000 price reduction', 'Stamp duty paid', 'Landscape package'],
    priceHistory: [
      { date: '2024-01', price: 595000 },
      { date: '2024-02', price: 585000 },
      { date: '2024-03', price: 575000 }
    ],
    htbEligible: false,
    htbAmount: 0
  },
  {
    id: 4,
    title: 'Affordable Starter Home',
    development: 'Fitzgerald Gardens',
    location: 'Drogheda, Co. Louth',
    price: 275000,
    priceDisplay: '€275,000',
    beds: 2,
    baths: 1,
    parking: 1,
    size: 950,
    image: '/images/developments/fitzgerald-gardens/hero.jpeg',
    type: 'Duplex',
    status: 'Last Few Remaining',
    completionDate: 'Ready Now',
    aiScore: 85,
    matchReasons: ['Budget-friendly', 'Move-in ready', 'First-time buyer ideal'],
    developerPriority: 'high',
    viewings: 89,
    saves: 45,
    features: ['Private entrance', 'Garden', 'A-rated BER'],
    incentives: ['No stamp duty', 'Furniture package available'],
    priceHistory: [
      { date: '2024-01', price: 285000 },
      { date: '2024-02', price: 280000 },
      { date: '2024-03', price: 275000 }
    ],
    htbEligible: true,
    htbAmount: 27500
  }
];

const searchFilters = {
  priceRanges: [
    { label: 'Under €300k', min: 0, max: 300000 },
    { label: '€300k - €400k', min: 300000, max: 400000 },
    { label: '€400k - €500k', min: 400000, max: 500000 },
    { label: '€500k+', min: 500000, max: null }
  ],
  propertyTypes: ['All', 'House', 'Apartment', 'Duplex'],
  bedrooms: ['Any', '1', '2', '3', '4+'],
  developments: ['All Developments', 'Fitzgerald Gardens', 'Ellwood', 'Ballymakenny View']
};

// Buyer preferences simulation
const buyerPreferences = {
  budget: { min: 250000, max: 450000 },
  propertyType: 'House',
  bedrooms: 3,
  mustHaves: ['Garden', 'Parking', 'A-rated BER'],
  niceToHaves: ['En-suite', 'Home office'],
  lifestyle: ['Family-oriented', 'Schools nearby', 'Quiet area'],
  timeline: '3-6 months'
};

export default function PropertySearchPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedBeds, setSelectedBeds] = useState('Any');
  const [selectedDevelopment, setSelectedDevelopment] = useState('All Developments');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('ai-recommended');
  const [viewMode, setViewMode] = useState('grid');
  const [showAIInsights, setShowAIInsights] = useState(true);
  const [filteredProperties, setFilteredProperties] = useState(mockProperties);
  const [activeProperty, setActiveProperty] = useState<number | null>(null);
  const [showHTBCalculator, setShowHTBCalculator] = useState(false);
  const [selectedPropertyForHTB, setSelectedPropertyForHTB] = useState<typeof mockProperties[0] | null>(null);

  // Initialize search state from URL parameters
  useEffect(() => {
    const query = searchParams.get('q');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const beds = searchParams.get('beds');
    const type = searchParams.get('type');
    const development = searchParams.get('development');
    const htbEligible = searchParams.get('htbEligible');

    if (query) {
      setSearchQuery(query);
    }

    if (minPrice || maxPrice) {
      if (maxPrice === '300000') {
        setSelectedPriceRange('Under €300k');
      } else if (minPrice === '300000' && maxPrice === '400000') {
        setSelectedPriceRange('€300k - €400k');
      } else if (minPrice === '400000' && maxPrice === '500000') {
        setSelectedPriceRange('€400k - €500k');
      } else if (minPrice === '500000') {
        setSelectedPriceRange('€500k+');
      }
    }

    if (beds) {
      setSelectedBeds(beds === '4+' ? '4+' : beds);
    }

    if (type) {
      setSelectedType(type.charAt(0).toUpperCase() + type.slice(1));
    }

    if (development) {
      const devMap: Record<string, string> = {
        'fitzgerald-gardens': 'Fitzgerald Gardens',
        'ellwood': 'Ellwood',
        'ballymakenny-view': 'Ballymakenny View'
      };
      setSelectedDevelopment(devMap[development] || 'All Developments');
    }

    if (htbEligible === 'true') {
      // Show AI insights with HTB focus
      setShowAIInsights(true);
    }
  }, [searchParams]);

  // Filter properties based on criteria
  useEffect(() => {
    let filtered = [...mockProperties];

    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.development.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query)
      );
    }

    // Apply price range filter
    if (selectedPriceRange) {
      const priceFilters: Record<string, { min?: number; max?: number }> = {
        'Under €300k': { max: 300000 },
        '€300k - €400k': { min: 300000, max: 400000 },
        '€400k - €500k': { min: 400000, max: 500000 },
        '€500k+': { min: 500000 }
      };
      
      const filter = priceFilters[selectedPriceRange];
      if (filter) {
        filtered = filtered.filter(p => {
          if (filter.min && p.price < filter.min) return false;
          if (filter.max && p.price > filter.max) return false;
          return true;
        });
      }
    }

    // Apply type filter
    if (selectedType !== 'All') {
      filtered = filtered.filter(p => p.type === selectedType);
    }

    // Apply bedroom filter
    if (selectedBeds !== 'Any') {
      filtered = filtered.filter(p => {
        if (selectedBeds === '4+') return p.beds >= 4;
        return p.beds === parseInt(selectedBeds);
      });
    }

    // Apply development filter
    if (selectedDevelopment !== 'All Developments') {
      filtered = filtered.filter(p => p.development === selectedDevelopment);
    }

    // Sort properties
    switch (sortBy) {
      case 'ai-recommended':
        filtered.sort((a, b) => {
          // Prioritize developer priority and AI score
          const priorityWeight = { urgent: 3, high: 2, medium: 1 };
          const aPriority = priorityWeight[a.developerPriority] || 0;
          const bPriority = priorityWeight[b.developerPriority] || 0;
          
          if (aPriority !== bPriority) return bPriority - aPriority;
          return b.aiScore - a.aiScore;
        });
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => a.completionDate.localeCompare(b.completionDate));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.viewings + b.saves) - (a.viewings + a.saves));
        break;
    }

    setFilteredProperties(filtered);
  }, [searchQuery, selectedPriceRange, selectedType, selectedBeds, selectedDevelopment, sortBy]);

  const PropertyCard = ({ property }: { property: typeof mockProperties[0] }) => {
    const isHot = property.developerPriority === 'urgent' || property.developerPriority === 'high';
    const priceDropped = property.priceHistory[0].price > property.price;

    return (
      <div 
        className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
          property.developerPriority === 'urgent' ? 'ring-2 ring-red-500' : ''
        }`}
        onMouseEnter={() => setActiveProperty(property.id)}
        onMouseLeave={() => setActiveProperty(null)}
      >
        <div className="relative">
          <Image
            src={property.image}
            alt={property.title}
            width={400}
            height={300}
            className="w-full h-64 object-cover"
          />
          
          {/* Status Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {property.aiScore >= 90 && (
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                AI Match {property.aiScore}%
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
            {property.status !== 'Available' && (
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
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPropertyForHTB(property);
                  setShowHTBCalculator(true);
                }}
                className="p-2 bg-green-600/90 backdrop-blur-sm rounded-full hover:bg-green-700 transition-colors"
                title="Calculate Help-to-Buy"
              >
                <Calculator className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
          
          {/* Completion Badge */}
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
            {property.completionDate}
          </div>
        </div>
        
        <div className="p-6">
          {/* Price and Title */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{property.title}</h3>
              <p className="text-gray-600">{property.development}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{property.priceDisplay}</p>
              {priceDropped && (
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
              <span className="text-sm text-gray-700">{property.beds} beds</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">{property.baths} baths</span>
            </div>
            <div className="flex items-center gap-1">
              <Car className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">{property.parking} parking</span>
            </div>
            <div className="flex items-center gap-1">
              <Home className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">{property.size} sq ft</span>
            </div>
          </div>
          
          {/* AI Match Reasons */}
          {property.aiScore >= 85 && (
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
                    €{property.htbAmount.toLocaleString()} potential refund
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPropertyForHTB(property);
                    setShowHTBCalculator(true);
                  }}
                  className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors"
                >
                  Calculate
                </button>
              </div>
            </div>
          )}

          {/* Incentives */}
          {property.incentives.length > 0 && (
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {property.viewings} views
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {property.saves} saves
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Listed 3 days ago</span>
            </div>
          </div>
          
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <section className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Home
            </h1>
            <p className="text-xl text-blue-100">
              AI-powered search matching you with properties that fit your lifestyle
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                    Based on your preferences: Family home, 3 beds, €250k-€450k budget, good schools nearby
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
                {filteredProperties.filter(p => p.aiScore >= 85).length} highly recommended by AI
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
                  <button className="w-full py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
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
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
              
              {/* Load More */}
              <div className="mt-12 text-center">
                <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Load More Properties
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
          <Brain className="w-6 h-6" />
        </button>
      </div>

      {/* Help-to-Buy Calculator Modal */}
      {showHTBCalculator && selectedPropertyForHTB && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Help-to-Buy Calculator
                  </h2>
                  <p className="text-gray-600">
                    Calculate your HTB refund for {selectedPropertyForHTB.title}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowHTBCalculator(false);
                    setSelectedPropertyForHTB(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Property Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Property:</span>
                    <p className="font-medium">{selectedPropertyForHTB.title}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Price:</span>
                    <p className="font-medium">{selectedPropertyForHTB.priceDisplay}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Development:</span>
                    <p className="font-medium">{selectedPropertyForHTB.development}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Location:</span>
                    <p className="font-medium">{selectedPropertyForHTB.location}</p>
                  </div>
                </div>
              </div>
              
              <HelpToBuyCalculator />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}