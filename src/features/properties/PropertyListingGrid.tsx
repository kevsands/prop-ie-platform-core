'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger} from '@/components/ui/sheet';
import {
  HomeIcon,
  MapPinIcon,
  CurrencyEuroIcon,
  Square3Stack3DIcon,
  SparklesIcon,
  HeartIcon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  CalendarIcon,
  BoltIcon,
  PhotoIcon} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import Image from 'next/image';

interface Property {
  id: string;
  name: string;
  address: string;
  location: {
    area: string;
    county: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  price: number;
  size: number;
  bedrooms: number;
  bathrooms: number;
  type: PropertyType;
  status: PropertyStatus;
  features: string[];
  images: PropertyImage[];
  berRating: string;
  yearBuilt: number;
  description: string;
  development?: {
    id: string;
    name: string;
    developer: string;
  };
  virtualTour?: string;
  floorPlans?: string[];
  availability: {
    moveInDate: Date;
    viewingDates: Date[];
  };
  stats: {
    views: number;
    saves: number;
    enquiries: number;
  };
}

interface PropertyImage {
  url: string;
  alt: string;
  isMain: boolean;
  order: number;
}

type PropertyType = 'APARTMENT' | 'HOUSE' | 'TOWNHOUSE' | 'PENTHOUSE' | 'BUNGALOW';
type PropertyStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'UNDER_OFFER';

interface FilterState {
  priceRange: [numbernumber];
  sizeRange: [numbernumber];
  bedrooms: number | null;
  bathrooms: number | null;
  propertyTypes: PropertyType[];
  locations: string[];
  features: string[];
  berRating: string | null;
  availability: 'all' | 'immediate' | 'future';
  sortBy: 'price-asc' | 'price-desc' | 'size-asc' | 'size-desc' | 'newest' | 'popular';
}

export function PropertyListingGrid() {
  const router = useRouter();
  const [propertiessetProperties] = useState<Property[]>([]);
  const [filteredPropertiessetFilteredProperties] = useState<Property[]>([]);
  const [loadingsetLoading] = useState(true);
  const [savedPropertiessetSavedProperties] = useState<string[]>([]);
  const [viewModesetViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [searchQuerysetSearchQuery] = useState('');
  const [filterssetFilters] = useState<FilterState>({
    priceRange: [01000000],
    sizeRange: [0500],
    bedrooms: null,
    bathrooms: null,
    propertyTypes: [],
    locations: [],
    features: [],
    berRating: null,
    availability: 'all',
    sortBy: 'newest'});

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    triggerOnce: false});

  const [pagesetPage] = useState(1);
  const [hasMoresetHasMore] = useState(true);
  const itemsPerPage = 12;

  useEffect(() => {
    loadProperties();
    loadSavedProperties();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [propertiesfilterssearchQuery]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMoreProperties();
    }
  }, [inViewhasMoreloading]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/properties?' + new URLSearchParams({
        limit: itemsPerPage.toString(),
        offset: '0'}));
      const data = await response.json();
      setProperties(data.properties);
      setHasMore(data.pagination.total> itemsPerPage);
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  const loadMoreProperties = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const offset = page * itemsPerPage;
      const response = await fetch('/api/properties?' + new URLSearchParams({
        limit: itemsPerPage.toString(),
        offset: offset.toString()}));
      const data = await response.json();
      setProperties(prev => [...prev, ...data.properties]);
      setPage(prev => prev + 1);
      setHasMore(data.pagination.total> (page + 1) * itemsPerPage);
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  const loadSavedProperties = async () => {
    try {
      const response = await fetch('/api/user/saved-properties');
      const data = await response.json();
      setSavedProperties(data.propertyIds);
    } catch (error) {

    }
  };

  const applyFilters = () => {
    let filtered = [...properties];

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(property => 
        property.name.toLowerCase().includes(query) ||
        property.address.toLowerCase().includes(query) ||
        property.location.area.toLowerCase().includes(query) ||
        property.location.county.toLowerCase().includes(query)
      );
    }

    // Price range
    filtered = filtered.filter(property => 
      property.price>= filters.priceRange[0] && 
      property.price <= filters.priceRange[1]
    );

    // Size range
    filtered = filtered.filter(property => 
      property.size>= filters.sizeRange[0] && 
      property.size <= filters.sizeRange[1]
    );

    // Bedrooms
    if (filters.bedrooms !== null) {
      filtered = filtered.filter(property => property.bedrooms>= filters.bedrooms);
    }

    // Bathrooms
    if (filters.bathrooms !== null) {
      filtered = filtered.filter(property => property.bathrooms>= filters.bathrooms);
    }

    // Property types
    if (filters.propertyTypes.length> 0) {
      filtered = filtered.filter(property => 
        filters.propertyTypes.includes(property.type)
      );
    }

    // Locations
    if (filters.locations.length> 0) {
      filtered = filtered.filter(property => 
        filters.locations.includes(property.location.county)
      );
    }

    // Features
    if (filters.features.length> 0) {
      filtered = filtered.filter(property => 
        filters.features.every(feature => property.features.includes(feature))
      );
    }

    // BER Rating
    if (filters.berRating) {
      filtered = filtered.filter(property => property.berRating === filters.berRating);
    }

    // Availability
    if (filters.availability !== 'all') {
      const now = new Date();
      const threeMonths = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

      filtered = filtered.filter(property => {
        const moveInDate = new Date(property.availability.moveInDate);
        if (filters.availability === 'immediate') {
          return moveInDate <= threeMonths;
        } else {
          return moveInDate> threeMonths;
        }
      });
    }

    // Sorting
    filtered.sort((ab: any) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'size-asc':
          return a.size - b.size;
        case 'size-desc':
          return b.size - a.size;
        case 'newest':
          return b.yearBuilt - a.yearBuilt;
        case 'popular':
          return b.stats.views - a.stats.views;
        default:
          return 0;
      }
    });

    setFilteredProperties(filtered);
  };

  const toggleSaveProperty = async (propertyId: string) => {
    try {
      const isSaved = savedProperties.includes(propertyId);
      const method = isSaved ? 'DELETE' : 'POST';

      await fetch(`/api/user/saved-properties/${propertyId}`, { method });

      if (isSaved) {
        setSavedProperties(prev => prev.filter(id => id !== propertyId));
      } else {
        setSavedProperties(prev => [...prevpropertyId]);
      }
    } catch (error) {

    }
  };

  const handlePropertyClick = (property: Property) => {
    // Track view
    fetch(`/api/properties/${property.id}/view`, { method: 'POST' });

    // Navigate to property detail
    router.push(`/properties/${property.id}`);
  };

  const getStatusColor = (status: PropertyStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800';
      case 'RESERVED':
        return 'bg-yellow-100 text-yellow-800';
      case 'SOLD':
        return 'bg-red-100 text-red-800';
      case 'UNDER_OFFER':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBERColor = (rating: string) => {
    const colors: Record<string, string> = {
      'A1': 'bg-green-600',
      'A2': 'bg-green-500',
      'A3': 'bg-green-400',
      'B1': 'bg-yellow-500',
      'B2': 'bg-yellow-400',
      'B3': 'bg-yellow-300',
      'C1': 'bg-orange-500',
      'C2': 'bg-orange-400',
      'C3': 'bg-orange-300',
      'D1': 'bg-red-500',
      'D2': 'bg-red-400',
      'E1': 'bg-red-600',
      'E2': 'bg-red-700',
      'F': 'bg-gray-600',
      'G': 'bg-gray-700'};
    return colors[rating] || 'bg-gray-400';
  };

  const PropertyCard = ({ property }: { property: Property }) => {
    const isSaved = savedProperties.includes(property.id);
    const mainImage = property.images.find(img => img.isMain) || property.images[0];

    return (
      <motion.div
        layout
        initial={ opacity: 0, y: 20 }
        animate={ opacity: 1, y: 0 }
        exit={ opacity: 0, y: 20 }
        whileHover={ y: -4 }
        transition={ duration: 0.2 }
      >
        <Card 
          className="cursor-pointer overflow-hidden group hover:shadow-xl transition-all duration-300"
          onClick={() => handlePropertyClick(property)}
        >
          {/* Image Container */}
          <div className="relative h-64 overflow-hidden">
            {mainImage ? (
              <Image
                src={mainImage.url}
                alt={mainImage.alt}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <PhotoIcon className="h-12 w-12 text-gray-400" />
              </div>
            )}

            {/* Status Badge */}
            <Badge 
              className={`absolute top-3 left-3 ${getStatusColor(property.status)}`}
            >
              {property.status.replace(/_/g, ' ')}
            </Badge>

            {/* BER Rating */}
            <div className={`absolute top-3 right-3 px-2 py-1 rounded text-white font-bold text-sm ${getBERColor(property.berRating)}`}>
              {property.berRating}
            </div>

            {/* Save Button */}
            <Button
              size="icon"
              variant="ghost"
              className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white"
              onClick={(e: any) => {
                e.stopPropagation();
                toggleSaveProperty(property.id);
              }
            >
              {isSaved ? (
                <HeartIconSolid className="h-5 w-5 text-red-500" />
              ) : (
                <HeartIcon className="h-5 w-5 text-gray-600" />
              )}
            </Button>

            {/* Image Count */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded">
              <PhotoIcon className="h-4 w-4" />
              <span className="text-sm">{property.images.length}</span>
            </div>
          </div>

          <CardContent className="p-4">
            {/* Price */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold">
                €{property.price.toLocaleString()}
              </h3>
              {property.development && (
                <Badge variant="secondary" className="text-xs">
                  {property.development.name}
                </Badge>
              )}
            </div>

            {/* Name and Address */}
            <h4 className="font-semibold text-lg mb-1">{property.name}</h4>
            <p className="text-gray-600 text-sm mb-3 flex items-center gap-1">
              <MapPinIcon className="h-4 w-4" />
              {property.location.area}, {property.location.county}
            </p>

            {/* Key Details */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="flex items-center gap-1 text-sm">
                <HomeIcon className="h-4 w-4 text-gray-500" />
                <span>{property.bedrooms} bed</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Square3Stack3DIcon className="h-4 w-4 text-gray-500" />
                <span>{property.bathrooms} bath</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <SparklesIcon className="h-4 w-4 text-gray-500" />
                <span>{property.size} m²</span>
              </div>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-1 mb-3">
              {property.features.slice(0).map((featureindex: any) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {property.features.length> 3 && (
                <Badge variant="outline" className="text-xs">
                  +{property.features.length - 3} more
                </Badge>
              )}
            </div>

            {/* Availability */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                <span>Available {new Date(property.availability.moveInDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <EyeIcon className="h-4 w-4" />
                <span>{property.stats.views} views</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0">
            <Button 
              className="w-full" 
              variant="outline"
              onClick={(e: any) => {
                e.stopPropagation();
                router.push(`/properties/${property.id}/book-viewing`);
              }
            >
              Book Viewing
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Search by location, development, or property name..."
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Square3Stack3DIcon className="h-5 w-5" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <Square3Stack3DIcon className="h-5 w-5 rotate-90" />
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('map')}
              >
                <MapPinIcon className="h-5 w-5" />
              </Button>
            </div>

            {/* Filters */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="h-12">
                  <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle>Filter Properties</SheetTitle>
                  <SheetDescription>
                    Refine your search to find the perfect property
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                  {/* Price Range */}
                  <div className="space-y-3">
                    <Label>Price Range</Label>
                    <Slider
                      min={0}
                      max={1000000}
                      step={10000}
                      value={filters.priceRange}
                      onValueChange={(value: any) => setFilters(prev => ({ ...prev, priceRange: value as [numbernumber] }))}
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>€{filters.priceRange[0].toLocaleString()}</span>
                      <span>€{filters.priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Size Range */}
                  <div className="space-y-3">
                    <Label>Size (m²)</Label>
                    <Slider
                      min={0}
                      max={500}
                      step={10}
                      value={filters.sizeRange}
                      onValueChange={(value: any) => setFilters(prev => ({ ...prev, sizeRange: value as [numbernumber] }))}
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{filters.sizeRange[0]} m²</span>
                      <span>{filters.sizeRange[1]} m²</span>
                    </div>
                  </div>

                  {/* Bedrooms */}
                  <div className="space-y-3">
                    <Label>Minimum Bedrooms</Label>
                    <Select
                      value={filters.bedrooms?.toString() || ''}
                      onValueChange={(value: any) => setFilters(prev => ({ ...prev, bedrooms: value ? parseInt(value) : null }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any</SelectItem>
                        <SelectItem value="1">1+</SelectItem>
                        <SelectItem value="2">2+</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                        <SelectItem value="5">5+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Property Type */}
                  <div className="space-y-3">
                    <Label>Property Type</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['APARTMENT', 'HOUSE', 'TOWNHOUSE', 'PENTHOUSE', 'BUNGALOW'].map((type: any) => (
                        <Button
                          key={type}
                          variant={filters.propertyTypes.includes(type as PropertyType) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            if (filters.propertyTypes.includes(type as PropertyType)) {
                              setFilters(prev => ({
                                ...prev,
                                propertyTypes: prev.propertyTypes.filter(t => t !== type)
                              }));
                            } else {
                              setFilters(prev => ({
                                ...prev,
                                propertyTypes: [...prev.propertyTypes, type as PropertyType]
                              }));
                            }
                          }
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Reset Filters */}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setFilters({
                      priceRange: [01000000],
                      sizeRange: [0500],
                      bedrooms: null,
                      bathrooms: null,
                      propertyTypes: [],
                      locations: [],
                      features: [],
                      berRating: null,
                      availability: 'all',
                      sortBy: 'newest'})}
                  >
                    Reset Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Found {filteredProperties.length} properties
            </p>
            <Select
              value={filters.sortBy}
              onValueChange={(value: any) => setFilters(prev => ({ ...prev, sortBy: value as FilterState['sortBy'] }))}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                <SelectItem value="size-asc">Size (Small to Large)</SelectItem>
                <SelectItem value="size-desc">Size (Large to Small)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && properties.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_i: any) => (
              <Card key={i} className="h-[450px] animate-pulse">
                <div className="h-64 bg-gray-200" />
                <CardContent className="p-4">
                  <div className="h-8 bg-gray-200 rounded mb-2" />
                  <div className="h-6 bg-gray-200 rounded mb-4" />
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <AnimatePresence mode="popLayout">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property: any) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </AnimatePresence>

            {hasMore && (
              <div ref={loadMoreRef} className="mt-8 flex justify-center">
                {loading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                ) : (
                  <Button variant="outline" onClick={loadMoreProperties}>
                    Load More
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}