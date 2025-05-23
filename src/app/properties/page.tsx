import React from 'react';
'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Grid, 
  List, 
  Map, 
  Filter, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Loader2,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { PropertyCard } from '@/components/property/PropertyCard';
import { PropertyListResponse, PropertyFilters, Property } from '@/types/models/property';
import { PropertyType, PropertyStatus } from '@/types/enums';
import { formatPrice } from '@/utils/format';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load map component
const PropertyMap = dynamic(() => import('@/components/property/PropertyMap'), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full" />
});

// Property skeleton loader
function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [viewsetView] = useState<'grid' | 'list' | 'map'>(
    (searchParams.get('view') as any) || 'grid'
  );
  const [searchQuerysetSearchQuery] = useState(searchParams.get('search') || '');
  const [showFilterssetShowFilters] = useState(false);
  const [filterssetFilters] = useState<PropertyFilters>({
    search: searchParams.get('search') || undefined,
    type: searchParams.getAll('type') as PropertyType[],
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    bedrooms: searchParams.getAll('bedrooms').map(Number),
    bathrooms: searchParams.getAll('bathrooms').map(Number),
    minSize: searchParams.get('minSize') ? Number(searchParams.get('minSize')) : undefined,
    maxSize: searchParams.get('maxSize') ? Number(searchParams.get('maxSize')) : undefined,
    location: searchParams.getAll('location'),
    amenities: searchParams.getAll('amenities'),
    status: searchParams.getAll('status') as PropertyStatus[],
    features: searchParams.getAll('features'),
    hasVirtualTour: searchParams.get('hasVirtualTour') === 'true',
    hasParking: searchParams.get('hasParking') === 'true',
    sortBy: searchParams.get('sortBy') as any || 'newest',
    sortOrder: searchParams.get('sortOrder') as any || 'desc'});

  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 12;

  // Fetch properties
  const { data, isLoading, error } = useQuery<PropertyListResponse>({
    queryKey: ['properties', filters, pagepageSize],
    queryFn: async () => {
      const params = new URLSearchParams();

      // Add filters to params
      if (filters.search) params.append('search', filters.search);
      filters.type?.forEach(t => params.append('type', t));
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
      filters.bedrooms?.forEach(b => params.append('bedrooms', b.toString()));
      filters.bathrooms?.forEach(b => params.append('bathrooms', b.toString()));
      if (filters.minSize) params.append('minSize', filters.minSize.toString());
      if (filters.maxSize) params.append('maxSize', filters.maxSize.toString());
      filters.location?.forEach(l => params.append('location', l));
      filters.amenities?.forEach(a => params.append('amenities', a));
      filters.status?.forEach(s => params.append('status', s));
      filters.features?.forEach(f => params.append('features', f));
      if (filters.hasVirtualTour) params.append('hasVirtualTour', 'true');
      if (filters.hasParking) params.append('hasParking', 'true');
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      params.append('page', page.toString());
      params.append('pageSize', pageSize.toString());

      const response = await fetch(`/api/properties?${params}`);
      if (!response.ok) throw new Error('Failed to fetch properties');
      return response.json();
    },
    staleTime: 60000, // 1 minute
  });

  // Update URL params when filters change
  const updateUrlParams = useCallback((newFilters: PropertyFilters, newPage?: number) => {
    const params = new URLSearchParams();

    if (newFilters.search) params.set('search', newFilters.search);
    newFilters.type?.forEach(t => params.append('type', t));
    if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice.toString());
    if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice.toString());
    newFilters.bedrooms?.forEach(b => params.append('bedrooms', b.toString()));
    newFilters.bathrooms?.forEach(b => params.append('bathrooms', b.toString()));
    if (newFilters.minSize) params.set('minSize', newFilters.minSize.toString());
    if (newFilters.maxSize) params.set('maxSize', newFilters.maxSize.toString());
    newFilters.location?.forEach(l => params.append('location', l));
    newFilters.amenities?.forEach(a => params.append('amenities', a));
    newFilters.status?.forEach(s => params.append('status', s));
    newFilters.features?.forEach(f => params.append('features', f));
    if (newFilters.hasVirtualTour) params.set('hasVirtualTour', 'true');
    if (newFilters.hasParking) params.set('hasParking', 'true');
    if (newFilters.sortBy) params.set('sortBy', newFilters.sortBy);
    if (newFilters.sortOrder) params.set('sortOrder', newFilters.sortOrder);
    if (view !== 'grid') params.set('view', view);
    params.set('page', (newPage || 1).toString());
    params.set('pageSize', pageSize.toString());

    router.push(`/properties?${params.toString()}`);
  }, [router, viewpageSize]);

  // Handle search
  const handleSearch = useCallback(() => {
    const newFilters = { ...filters, search: searchQuery };
    setFilters(newFilters);
    updateUrlParams(newFilters1);
  }, [searchQuery, filtersupdateUrlParams]);

  // Handle filter changes
  const handleFilterChange = (key: keyof PropertyFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateUrlParams(newFilters1);
  };

  // Reset filters
  const resetFilters = () => {
    const defaultFilters: PropertyFilters = {
      sortBy: 'newest',
      sortOrder: 'desc'};
    setFilters(defaultFilters);
    setSearchQuery('');
    updateUrlParams(defaultFilters1);
  };

  // Property type options
  const propertyTypes = Object.values(PropertyType);
  const propertyStatuses = Object.values(PropertyStatus);

  // Common amenities
  const commonAmenities = [
    'Gym', 'Pool', 'Parking', 'Garden', 'Balcony', 'Terrace',
    'Storage', 'Concierge', 'Security', 'Elevator'
  ];

  // Common features
  const commonFeatures = [
    'Pet Friendly', 'Furnished', 'Newly Built', 'Recently Renovated',
    'Sea View', 'City View', 'Garden View', 'Smart Home'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Meta */}
      <head>
        <title>Properties for Sale in Ireland | Find Your Dream Home</title>
        <meta name="description" content="Browse thousands of properties for sale across Ireland. Filter by location, price, bedrooms, and more. Virtual tours available." />
      </head>

      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1 flex gap-2 w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search by location, development, or property name..."
                  value={searchQuery}
                  onChange={(e: any) => setSearchQuery(e.target.value)}
                  onKeyDown={(e: any) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 pr-4"
                />
              </div>
              <Button onClick={handleSearch}>Search</Button>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={view === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setView('grid')}
                title="Grid view"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={view === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setView('list')}
                title="List view"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={view === 'map' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setView('map')}
                title="Map view"
              >
                <Map className="h-4 w-4" />
              </Button>
            </div>

            {/* Filters Toggle */}
            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {Object.keys(filters).filter(k => filters[k as keyof PropertyFilters]).length> 2 && (
                    <Badge variant="secondary" className="ml-1">
                      {Object.keys(filters).filter(k => filters[k as keyof PropertyFilters]).length - 2}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filter Properties</SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                  {/* Property Type */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Property Type</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {propertyTypes.map(type => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`type-${type}`}
                            checked={filters.type?.includes(type) || false}
                            onCheckedChange={(checked: any) => {
                              const newTypes = checked
                                ? [...(filters.type || []), type]
                                : filters.type?.filter(t => t !== type) || [];
                              handleFilterChange('type', newTypes);
                            }
                          />
                          <Label htmlFor={`type-${type}`} className="text-sm capitalize cursor-pointer">
                            {type.replace(/_/g, ' ')}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">
                      Price Range
                      {(filters.minPrice || filters.maxPrice) && (
                        <span className="ml-2 text-sm font-normal text-gray-600">
                          {formatPrice(filters.minPrice || 0)} - {formatPrice(filters.maxPrice || 5000000)}
                        </span>
                      )}
                    </Label>
                    <div className="space-y-4">
                      <Slider
                        min={0}
                        max={5000000}
                        step={50000}
                        value={[filters.minPrice || 0, filters.maxPrice || 5000000]}
                        onValueChange={([minmax]) => {
                          handleFilterChange('minPrice', min);
                          handleFilterChange('maxPrice', max);
                        }
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Bedrooms */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Bedrooms</Label>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 45].map(num => (
                        <Button
                          key={num}
                          variant={filters.bedrooms?.includes(num) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            const newBedrooms = filters.bedrooms?.includes(num)
                              ? filters.bedrooms.filter(b => b !== num)
                              : [...(filters.bedrooms || []), num];
                            handleFilterChange('bedrooms', newBedrooms);
                          }
                        >
                          {num}+
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Bathrooms */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Bathrooms</Label>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 34].map(num => (
                        <Button
                          key={num}
                          variant={filters.bathrooms?.includes(num) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            const newBathrooms = filters.bathrooms?.includes(num)
                              ? filters.bathrooms.filter(b => b !== num)
                              : [...(filters.bathrooms || []), num];
                            handleFilterChange('bathrooms', newBathrooms);
                          }
                        >
                          {num}+
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Size Range */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">
                      Size (sq ft)
                      {(filters.minSize || filters.maxSize) && (
                        <span className="ml-2 text-sm font-normal text-gray-600">
                          {filters.minSize || 0} - {filters.maxSize || 5000} sq ft
                        </span>
                      )}
                    </Label>
                    <div className="space-y-4">
                      <Slider
                        min={0}
                        max={5000}
                        step={100}
                        value={[filters.minSize || 0, filters.maxSize || 5000]}
                        onValueChange={([minmax]) => {
                          handleFilterChange('minSize', min);
                          handleFilterChange('maxSize', max);
                        }
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Status</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {propertyStatuses.map(status => (
                        <div key={status} className="flex items-center space-x-2">
                          <Checkbox
                            id={`status-${status}`}
                            checked={filters.status?.includes(status) || false}
                            onCheckedChange={(checked: any) => {
                              const newStatuses = checked
                                ? [...(filters.status || []), status]
                                : filters.status?.filter(s => s !== status) || [];
                              handleFilterChange('status', newStatuses);
                            }
                          />
                          <Label htmlFor={`status-${status}`} className="text-sm capitalize cursor-pointer">
                            {status.replace(/_/g, ' ')}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Amenities</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {commonAmenities.map(amenity => (
                        <div key={amenity} className="flex items-center space-x-2">
                          <Checkbox
                            id={`amenity-${amenity}`}
                            checked={filters.amenities?.includes(amenity) || false}
                            onCheckedChange={(checked: any) => {
                              const newAmenities = checked
                                ? [...(filters.amenities || []), amenity]
                                : filters.amenities?.filter(a => a !== amenity) || [];
                              handleFilterChange('amenities', newAmenities);
                            }
                          />
                          <Label htmlFor={`amenity-${amenity}`} className="text-sm cursor-pointer">
                            {amenity}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Features</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="has-virtual-tour"
                          checked={filters.hasVirtualTour || false}
                          onCheckedChange={(checked: any) => handleFilterChange('hasVirtualTour', checked)}
                        />
                        <Label htmlFor="has-virtual-tour" className="text-sm cursor-pointer">
                          Virtual Tour Available
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="has-parking"
                          checked={filters.hasParking || false}
                          onCheckedChange={(checked: any) => handleFilterChange('hasParking', checked)}
                        />
                        <Label htmlFor="has-parking" className="text-sm cursor-pointer">
                          Parking Included
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Sort By */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Sort By</Label>
                    <Select
                      value={`${filters.sortBy}-${filters.sortOrder}`}
                      onValueChange={(value: any) => {
                        const [sortBysortOrder] = value.split('-');
                        handleFilterChange('sortBy', sortBy);
                        handleFilterChange('sortOrder', sortOrder);
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest-desc">Newest First</SelectItem>
                        <SelectItem value="oldest-asc">Oldest First</SelectItem>
                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        <SelectItem value="size-asc">Size: Small to Large</SelectItem>
                        <SelectItem value="size-desc">Size: Large to Small</SelectItem>
                        <SelectItem value="bedrooms-asc">Bedrooms: Low to High</SelectItem>
                        <SelectItem value="bedrooms-desc">Bedrooms: High to Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={resetFilters} className="flex-1">
                      Reset Filters
                    </Button>
                    <Button onClick={() => setShowFilters(false)} className="flex-1">
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Active Filters */}
          {Object.keys(filters).filter(k => filters[k as keyof PropertyFilters] && k !== 'sortBy' && k !== 'sortOrder').length> 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {filters.search && (
                <Badge variant="secondary" className="gap-1">
                  Search: {filters.search}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleFilterChange('search', undefined)}
                  />
                </Badge>
              )}
              {filters.type?.map(type => (
                <Badge key={type} variant="secondary" className="gap-1">
                  {type}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleFilterChange('type', filters.type?.filter(t => t !== type))}
                  />
                </Badge>
              ))}
              {(filters.minPrice || filters.maxPrice) && (
                <Badge variant="secondary" className="gap-1">
                  Price: {formatPrice(filters.minPrice || 0)} - {formatPrice(filters.maxPrice || 5000000)}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => {
                      handleFilterChange('minPrice', undefined);
                      handleFilterChange('maxPrice', undefined);
                    }
                  />
                </Badge>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetFilters}
                className="h-6 text-xs"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Results Summary */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Properties for Sale in Ireland
          </h1>
          {data && (
            <p className="text-gray-600 mt-2">
              {data.total} properties found
              {filters.search && ` for "${filters.search}"`}
            </p>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {[...Array(pageSize)].map((_i: any) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Failed to load properties</p>
            <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['properties'] })}>
              Try Again
            </Button>
          </div>
        )}

        {/* Properties Display */}
        {data && !isLoading && (
          <>
            {/* Grid View */}
            {view === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.properties.map((propertyindex: any) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    priority={index <6}
                    onViewDetails={() => router.push(`/properties/${property.id}`)}
                  />
                ))}
              </div>
            )}

            {/* List View */}
            {view === 'list' && (
              <div className="space-y-4">
                {data.properties.map((property: any) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    variant="horizontal"
                    onViewDetails={() => router.push(`/properties/${property.id}`)}
                  />
                ))}
              </div>
            )}

            {/* Map View */}
            {view === 'map' && (
              <div className="h-[calc(100vh-300px)] relative">
                <PropertyMap 
                  properties={data.properties}
                  onPropertyClick={(property: any) => router.push(`/properties/${property.id}`)}
                />
              </div>
            )}

            {/* No Results */}
            {data.properties.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No properties found matching your criteria</p>
                <Button variant="outline" onClick={resetFilters}>
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {data.totalPages> 1 && (
              <div className="mt-8 flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateUrlParams(filters, page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex gap-1">
                  {[...Array(Math.min(data.totalPages7))].map((_i: any) => {
                    const pageNum = i + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === data.totalPages ||
                      (pageNum>= page - 2 && pageNum <= page + 2)
                    ) {
                      return (
                        <Button
                          key={pageNum}
                          variant={pageNum === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateUrlParams(filterspageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    } else if (
                      (pageNum === page - 3 && page> 4) ||
                      (pageNum === page + 3 && page <data.totalPages - 3)
                    ) {
                      return <span key={pageNum} className="px-2">...</span>\n  );
                    }
                    return null;
                  })}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateUrlParams(filters, page + 1)}
                  disabled={page === data.totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}