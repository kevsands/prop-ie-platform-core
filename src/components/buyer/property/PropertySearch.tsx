'use client';

import React, { useState, useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { 
  Search, 
  Sliders, 
  MapPin, 
  Home, 
  Bed, 
  Bath, 
  Square, 
  Heart, 
  Share2, 
  ArrowUpDown,
  Check,
  X,
  Info
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/useToast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BudgetInfo } from '@/types/buyer-journey';

interface Property {
  id: string;
  name: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  status: 'available' | 'reserved' | 'sold';
  isNew: boolean;
  mainImage: string;
  additionalImages: string[];
  description: string;
  features: string[];
  developmentId?: string;
  developmentName?: string;
  readyDate?: string;
  energyRating?: string;
  isFavorite?: boolean;
}

interface PropertySearchProps {
  initialBudget?: BudgetInfo;
  onPropertySelect?: (property: Property) => void;
  journeyId?: string;
}

export default function PropertySearch({ 
  initialBudget,
  onPropertySelect,
  journeyId
}: PropertySearchProps) {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([200000, 500000]);
  const [bedroomsFilter, setBedroomsFilter] = useState<number[]>([]);
  const [bathroomsFilter, setBathroomsFilter] = useState<number[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [showingNewBuildsOnly, setShowingNewBuildsOnly] = useState(true);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'newest' | 'ready-date'>('newest');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Mock data for demonstration with Sentry monitoring
  useEffect(() => {
    // Initialize component monitoring
    Sentry.addBreadcrumb({
      message: 'Property Search component initialized',
      level: 'info',
      category: 'ui.component'
    });
    
    Sentry.setContext('property_search', {
      initialBudget: initialBudget?.totalBudget || 'not_set',
      journeyId: journeyId || 'not_set'
    });
    
    // Simulate API fetch with error monitoring
    setTimeout(() => {
      try {
      const mockProperties: Property[] = [
        {
          id: 'prop-1',
          name: 'Fitzgerald Gardens - Type A',
          location: 'Fitzgerald Gardens, Dublin',
          price: 375000,
          bedrooms: 3,
          bathrooms: 2,
          area: 110,
          type: 'semi-detached',
          status: 'available',
          isNew: true,
          mainImage: '/images/developments/fitzgerald-gardens/3bed-House.jpeg',
          additionalImages: [
            '/images/developments/fitzgerald-gardens/1.jpg',
            '/images/developments/fitzgerald-gardens/2.jpg',
            '/images/developments/fitzgerald-gardens/3.jpg'
          ],
          description: 'A beautiful semi-detached 3-bedroom home in the popular Fitzgerald Gardens development.',
          features: ['South-facing garden', 'A-rated energy efficiency', 'Electric car charging point', 'Solar panels'],
          developmentId: 'dev-1',
          developmentName: 'Fitzgerald Gardens',
          readyDate: '2025-09-30',
          energyRating: 'A2'
        },
        {
          id: 'prop-2',
          name: 'Fitzgerald Gardens - Type B',
          location: 'Fitzgerald Gardens, Dublin',
          price: 325000,
          bedrooms: 2,
          bathrooms: 2,
          area: 85,
          type: 'terraced',
          status: 'available',
          isNew: true,
          mainImage: '/images/developments/fitzgerald-gardens/2bed-house.jpeg',
          additionalImages: [
            '/images/developments/fitzgerald-gardens/1.jpg',
            '/images/developments/fitzgerald-gardens/2.jpg'
          ],
          description: 'A well-designed 2-bedroom terraced home perfect for first-time buyers.',
          features: ['Fitted kitchen', 'A-rated energy efficiency', 'High-speed broadband ready'],
          developmentId: 'dev-1',
          developmentName: 'Fitzgerald Gardens',
          readyDate: '2025-08-15',
          energyRating: 'A3'
        },
        {
          id: 'prop-3',
          name: 'Ballymakenny View - Type A',
          location: 'Ballymakenny View, Louth',
          price: 395000,
          bedrooms: 4,
          bathrooms: 3,
          area: 140,
          type: 'detached',
          status: 'available',
          isNew: true,
          mainImage: '/images/developments/Ballymakenny-View/HouseType A.jpg',
          additionalImages: [
            '/images/developments/Ballymakenny-View/01-NoPeople.jpg',
            '/images/developments/Ballymakenny-View/02-NoPeople.jpg'
          ],
          description: 'A spacious 4-bedroom detached family home with modern design and finishes.',
          features: ['Large garden', 'A-rated energy efficiency', 'Utility room', 'Ensuite master bedroom'],
          developmentId: 'dev-2',
          developmentName: 'Ballymakenny View',
          readyDate: '2025-10-15',
          energyRating: 'A2'
        },
        {
          id: 'prop-4',
          name: 'Riverside Manor - Type C',
          location: 'Riverside Manor, Cork',
          price: 450000,
          bedrooms: 3,
          bathrooms: 2,
          area: 120,
          type: 'semi-detached',
          status: 'available',
          isNew: true,
          mainImage: '/images/riverside-manor/hero.jpg',
          additionalImages: [
            '/images/developments/riverside-manor/1.jpg',
            '/images/developments/riverside-manor/2.jpg'
          ],
          description: 'A luxury 3-bedroom home in the exclusive Riverside Manor development.',
          features: ['River views', 'A-rated energy efficiency', 'Smart home ready', 'Premium finishes'],
          developmentId: 'dev-3',
          developmentName: 'Riverside Manor',
          readyDate: '2025-12-01',
          energyRating: 'A2'
        },
        {
          id: 'prop-5',
          name: 'Fitzgerald Gardens - Apartment',
          location: 'Fitzgerald Gardens, Dublin',
          price: 275000,
          bedrooms: 2,
          bathrooms: 1,
          area: 72,
          type: 'apartment',
          status: 'available',
          isNew: true,
          mainImage: '/images/developments/fitzgerald-gardens/2bed-apartment.jpeg',
          additionalImages: [
            '/images/developments/fitzgerald-gardens/1.jpg'
          ],
          description: 'A modern 2-bedroom apartment with open-plan living area.',
          features: ['Balcony', 'A-rated energy efficiency', 'Elevator access', 'Secure parking'],
          developmentId: 'dev-1',
          developmentName: 'Fitzgerald Gardens',
          readyDate: '2025-07-30',
          energyRating: 'A3'
        }
      ];

      // Apply initial budget constraints if provided
      if (initialBudget) {
        const filteredByBudget = mockProperties.filter(
          prop => prop.price <= initialBudget.maxTotalPrice
        );
        setProperties(filteredByBudget);
        
        Sentry.addBreadcrumb({
          message: `Property search filtered by budget: ${filteredByBudget.length} properties under €${initialBudget.maxTotalPrice.toLocaleString()}`,
          level: 'info',
          category: 'filter.budget',
          data: { 
            budget: initialBudget.maxTotalPrice,
            resultCount: filteredByBudget.length 
          }
        });
      } else {
        setProperties(mockProperties);
      }
      
      setIsLoading(false);
      
      Sentry.addBreadcrumb({
        message: `Property search loaded ${mockProperties.length} properties`,
        level: 'info',
        category: 'api.success',
        data: { propertyCount: mockProperties.length }
      });
      
      } catch (error) {
        Sentry.captureException(error);
        setIsLoading(false);
        toast?.({
          title: 'Error loading properties',
          description: 'Failed to load property listings. Please try again.',
          variant: 'destructive'
        });
      }
    }, 1000);
  }, [initialBudget, toast]);

  // Filter properties based on search and filters
  const filteredProperties = properties.filter(property => {
    // Filter by search term
    const searchMatch = 
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.developmentName?.toLowerCase().includes(searchTerm.toLowerCase());
      
    // Filter by price range
    const priceMatch = property.price >= priceRange[0] && property.price <= priceRange[1];
    
    // Filter by bedrooms (if any selected)
    const bedroomsMatch = bedroomsFilter.length === 0 || bedroomsFilter.includes(property.bedrooms);
    
    // Filter by bathrooms (if any selected)
    const bathroomsMatch = bathroomsFilter.length === 0 || bathroomsFilter.includes(property.bathrooms);
    
    // Filter by property type (if any selected)
    const typeMatch = propertyTypes.length === 0 || propertyTypes.includes(property.type);
    
    // Filter by new builds only
    const newBuildMatch = !showingNewBuildsOnly || property.isNew;
    
    // Filter by favorites only
    const favoritesMatch = !showFavoritesOnly || favorites.includes(property.id);
    
    return searchMatch && priceMatch && bedroomsMatch && bathroomsMatch && typeMatch && newBuildMatch && favoritesMatch;
  });
  
  // Sort filtered properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'newest':
        return a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1;
      case 'ready-date':
        if (!a.readyDate || !b.readyDate) return 0;
        return new Date(a.readyDate).getTime() - new Date(b.readyDate).getTime();
      default:
        return 0;
    }
  });

  // Toggle favorite status
  const toggleFavorite = (propertyId: string) => {
    setFavorites(prev => 
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
    
    toast({
      title: favorites.includes(propertyId) ? "Removed from favorites" : "Added to favorites",
      description: favorites.includes(propertyId) 
        ? "Property removed from your saved properties" 
        : "Property saved to your favorites",
      variant: favorites.includes(propertyId) ? "destructive" : "default",
    });
  };

  // Handle property selection
  const handleSelectProperty = (property: Property) => {
    if (onPropertySelect) {
      onPropertySelect(property);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setPriceRange([200000, 500000]);
    setBedroomsFilter([]);
    setBathroomsFilter([]);
    setPropertyTypes([]);
    setShowingNewBuildsOnly(true);
    setSortBy('newest');
    setShowFavoritesOnly(false);
  };

  // Toggle bedroom filter
  const toggleBedroomFilter = (count: number) => {
    setBedroomsFilter(prev => 
      prev.includes(count)
        ? prev.filter(n => n !== count)
        : [...prev, count]
    );
  };

  // Toggle bathroom filter
  const toggleBathroomFilter = (count: number) => {
    setBathroomsFilter(prev => 
      prev.includes(count)
        ? prev.filter(n => n !== count)
        : [...prev, count]
    );
  };

  // Toggle property type filter
  const togglePropertyType = (type: string) => {
    setPropertyTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-grow relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search by location, development name, or property type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Sliders className="mr-2 h-4 w-4" />
                Filters
                {(bedroomsFilter.length > 0 || bathroomsFilter.length > 0 || propertyTypes.length > 0) && (
                  <span className="ml-2 bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {bedroomsFilter.length + bathroomsFilter.length + propertyTypes.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Price Range</h3>
                  <div className="space-y-4">
                    <Slider
                      defaultValue={priceRange}
                      min={100000}
                      max={1000000}
                      step={5000}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                    />
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">{formatCurrency(priceRange[0])}</span>
                      <span className="text-sm text-gray-600">{formatCurrency(priceRange[1])}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Bedrooms</h3>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5].map(count => (
                      <button
                        key={`bedroom-${count}`}
                        onClick={() => toggleBedroomFilter(count)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          bedroomsFilter.includes(count)
                            ? 'bg-blue-100 text-blue-600 border border-blue-200'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Bathrooms</h3>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4].map(count => (
                      <button
                        key={`bathroom-${count}`}
                        onClick={() => toggleBathroomFilter(count)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          bathroomsFilter.includes(count)
                            ? 'bg-blue-100 text-blue-600 border border-blue-200'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Property Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {['detached', 'semi-detached', 'terraced', 'apartment', 'duplex'].map(type => (
                      <button
                        key={`type-${type}`}
                        onClick={() => togglePropertyType(type)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          propertyTypes.includes(type)
                            ? 'bg-blue-100 text-blue-600 border border-blue-200'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="new-builds-only"
                      checked={showingNewBuildsOnly}
                      onChange={() => setShowingNewBuildsOnly(!showingNewBuildsOnly)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="new-builds-only" className="text-sm">New builds only</label>
                  </div>
                  
                  <button
                    onClick={resetFilters}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Reset All
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                {sortBy === 'price-asc' ? 'Price (Low to High)' : 
                 sortBy === 'price-desc' ? 'Price (High to Low)' :
                 sortBy === 'ready-date' ? 'Ready Date' : 'Newest'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-2">
              <div className="space-y-1">
                <button
                  onClick={() => setSortBy('price-asc')}
                  className={`w-full text-left px-3 py-2 rounded text-sm ${sortBy === 'price-asc' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                >
                  Price (Low to High)
                </button>
                <button
                  onClick={() => setSortBy('price-desc')}
                  className={`w-full text-left px-3 py-2 rounded text-sm ${sortBy === 'price-desc' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                >
                  Price (High to Low)
                </button>
                <button
                  onClick={() => setSortBy('newest')}
                  className={`w-full text-left px-3 py-2 rounded text-sm ${sortBy === 'newest' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                >
                  Newest
                </button>
                <button
                  onClick={() => setSortBy('ready-date')}
                  className={`w-full text-left px-3 py-2 rounded text-sm ${sortBy === 'ready-date' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                >
                  Ready Date
                </button>
              </div>
            </PopoverContent>
          </Popover>
          
          <div className="flex items-center">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}
              aria-label="Grid view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}
              aria-label="List view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center space-x-1 px-3 py-2 rounded text-sm ${
              showFavoritesOnly ? 'bg-pink-50 text-pink-600 border border-pink-200' : 'bg-gray-100 text-gray-600 border border-gray-200'
            }`}
          >
            <Heart size={16} className={showFavoritesOnly ? 'fill-pink-600 text-pink-600' : ''} />
            <span>{showFavoritesOnly ? 'All Properties' : 'Favorites'}</span>
          </button>
        </div>
      </div>
      
      {/* Results count and summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <p className="text-gray-600">
          {isLoading ? 'Loading properties...' : 
            sortedProperties.length === 0 ? 'No properties match your criteria' :
            `Showing ${sortedProperties.length} ${sortedProperties.length === 1 ? 'property' : 'properties'}`}
        </p>
        
        {initialBudget && (
          <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm mt-2 sm:mt-0">
            <Info size={16} className="mr-1" />
            <span>Budget: {formatCurrency(initialBudget.maxTotalPrice)}</span>
          </div>
        )}
      </div>
      
      {/* Property grid/list */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse"></div>
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-200 w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 w-1/2 animate-pulse"></div>
                <div className="flex space-x-2">
                  <div className="h-4 bg-gray-200 w-1/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 w-1/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 w-1/4 animate-pulse"></div>
                </div>
                <div className="h-10 bg-gray-200 w-full animate-pulse"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : sortedProperties.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <div className="text-gray-400 mb-4">
            <Search size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No properties match your search</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Try adjusting your search criteria or filters to see more results.
          </p>
          <Button onClick={resetFilters}>
            Reset All Filters
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProperties.map(property => (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="relative h-48 overflow-hidden">
                {/* Main image */}
                <img 
                  src={property.mainImage} 
                  alt={property.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                
                {/* Favorite button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(property.id);
                  }}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                >
                  <Heart 
                    size={18} 
                    className={favorites.includes(property.id) ? 'fill-pink-600 text-pink-600' : 'text-gray-600'} 
                  />
                </button>
                
                {/* Status badge */}
                {property.status !== 'available' && (
                  <div className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-medium ${
                    property.status === 'reserved' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {property.status === 'reserved' ? 'Reserved' : 'Sold'}
                  </div>
                )}
                
                {/* Price badge */}
                <div className="absolute bottom-2 left-2 bg-white/90 px-3 py-1 rounded-lg text-sm font-semibold shadow-sm">
                  {formatCurrency(property.price)}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1 line-clamp-1">{property.name}</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin size={16} className="flex-shrink-0 mr-1" />
                  <p className="text-sm truncate">{property.location}</p>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <div className="flex items-center">
                      <Bed size={16} className="mr-1" />
                      <span className="text-sm">{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center">
                      <Bath size={16} className="mr-1" />
                      <span className="text-sm">{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center">
                      <Square size={16} className="mr-1" />
                      <span className="text-sm">{property.area} m²</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {property.energyRating && (
                    <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium inline-flex items-center">
                      {property.energyRating}
                    </span>
                  )}
                  {property.isNew && (
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium inline-flex items-center">
                      New Build
                    </span>
                  )}
                  {property.readyDate && (
                    <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-medium inline-flex items-center">
                      Ready {new Date(property.readyDate).toLocaleDateString('en-IE', { month: 'short', year: 'numeric' })}
                    </span>
                  )}
                </div>
                
                <Button
                  onClick={() => handleSelectProperty(property)}
                  className="w-full"
                  disabled={property.status !== 'available'}
                >
                  {property.status === 'available' ? 'View Property' : 'Not Available'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedProperties.map(property => (
            <Card key={property.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-1/3 h-48 sm:h-auto">
                  <img 
                    src={property.mainImage} 
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Status badge */}
                  {property.status !== 'available' && (
                    <div className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-medium ${
                      property.status === 'reserved' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {property.status === 'reserved' ? 'Reserved' : 'Sold'}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 p-4">
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{property.name}</h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin size={16} className="flex-shrink-0 mr-1" />
                          <p className="text-sm">{property.location}</p>
                        </div>
                      </div>
                      
                      <div className="text-lg font-bold">{formatCurrency(property.price)}</div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 my-2">
                      <div className="flex items-center">
                        <Bed size={16} className="mr-1 text-gray-600" />
                        <span className="text-sm">{property.bedrooms} Beds</span>
                      </div>
                      <div className="flex items-center">
                        <Bath size={16} className="mr-1 text-gray-600" />
                        <span className="text-sm">{property.bathrooms} Baths</span>
                      </div>
                      <div className="flex items-center">
                        <Square size={16} className="mr-1 text-gray-600" />
                        <span className="text-sm">{property.area} m²</span>
                      </div>
                      <div className="flex items-center">
                        <Home size={16} className="mr-1 text-gray-600" />
                        <span className="text-sm">{property.type.charAt(0).toUpperCase() + property.type.slice(1)}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{property.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {property.energyRating && (
                        <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium inline-flex items-center">
                          {property.energyRating}
                        </span>
                      )}
                      {property.isNew && (
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium inline-flex items-center">
                          New Build
                        </span>
                      )}
                      {property.readyDate && (
                        <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-medium inline-flex items-center">
                          Ready {new Date(property.readyDate).toLocaleDateString('en-IE', { month: 'short', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleFavorite(property.id)}
                          className={`p-2 rounded-full ${
                            favorites.includes(property.id) ? 'bg-pink-50 text-pink-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <Heart 
                            size={18} 
                            className={favorites.includes(property.id) ? 'fill-pink-600' : ''} 
                          />
                        </button>
                        <button
                          className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                        >
                          <Share2 size={18} />
                        </button>
                      </div>
                      
                      <Button
                        onClick={() => handleSelectProperty(property)}
                        disabled={property.status !== 'available'}
                      >
                        {property.status === 'available' ? 'View Property' : 'Not Available'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {/* First-time buyer assistance information */}
      <Tabs defaultValue="htb" className="mt-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="htb">Help to Buy Scheme</TabsTrigger>
          <TabsTrigger value="fths">First-Time Home Buyers Scheme</TabsTrigger>
          <TabsTrigger value="tips">Home Buying Tips</TabsTrigger>
        </TabsList>
        <TabsContent value="htb">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3">Help to Buy Scheme</h3>
            <p className="text-gray-600 mb-4">
              The Help to Buy (HTB) incentive is a scheme for first-time property buyers. It helps you with the deposit needed to buy or build a new house or apartment.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium mb-1 text-green-800">You could claim:</h4>
                <p className="text-green-700">Up to €30,000 or 10% of the property price (whichever is lower)</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-1 text-blue-800">Property price limit:</h4>
                <p className="text-blue-700">€500,000 for houses and apartments</p>
              </div>
            </div>
            <h4 className="font-medium mb-2">Eligibility Requirements:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600 mb-4">
              <li>You must be a first-time buyer</li>
              <li>The property must be newly built and your primary residence</li>
              <li>You must take out a mortgage of at least 70% of the purchase price</li>
              <li>The developer must be approved for the scheme</li>
              <li>You must live in the property for 5 years from the date it was bought or built</li>
            </ul>
            <Button variant="outline" className="w-full sm:w-auto">
              Check Your Eligibility
            </Button>
          </Card>
        </TabsContent>
        <TabsContent value="fths">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3">First-Time Home Buyers Scheme</h3>
            <p className="text-gray-600 mb-4">
              The First-Time Home Buyers Scheme offers additional benefits to those purchasing their first property.
            </p>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h4 className="font-medium mb-1 text-purple-800">Stamp Duty Relief:</h4>
                  <p className="text-purple-700">Reduced stamp duty rates for first-time buyers</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <h4 className="font-medium mb-1 text-amber-800">Mortgage Interest Relief:</h4>
                  <p className="text-amber-700">Tax relief on mortgage interest payments</p>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-1 text-blue-800">Combined with Help to Buy:</h4>
                <p className="text-blue-700">Can be used alongside the Help to Buy scheme for maximum benefit</p>
              </div>
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full sm:w-auto">
                Learn More
              </Button>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="tips">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3">Home Buying Tips for First-Time Buyers</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-700 mr-3 mt-1">
                  <Check size={18} />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Get a mortgage approval in principle first</h4>
                  <p className="text-gray-600 text-sm">Before you start viewing properties, get pre-approved so you know your budget</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-700 mr-3 mt-1">
                  <Check size={18} />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Consider all costs</h4>
                  <p className="text-gray-600 text-sm">Remember to budget for stamp duty, legal fees, and moving costs</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-700 mr-3 mt-1">
                  <Check size={18} />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Research the area thoroughly</h4>
                  <p className="text-gray-600 text-sm">Check local amenities, transport links, and future development plans</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-700 mr-3 mt-1">
                  <Check size={18} />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Compare mortgage offers</h4>
                  <p className="text-gray-600 text-sm">Shop around for the best interest rates and terms</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-700 mr-3 mt-1">
                  <Check size={18} />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Get a good solicitor</h4>
                  <p className="text-gray-600 text-sm">A good solicitor can make the conveyancing process much smoother</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}