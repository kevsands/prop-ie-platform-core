'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Property } from '@/types/property';

interface PropertyFilters {
  priceMin?: number;
  priceMax?: number;
  bedroomsMin?: number;
  bedroomsMax?: number;
  bathroomsMin?: number;
  propertyTypes: string[];
  locations: string[];
  features: string[];
  sizeMin?: number;
  sizeMax?: number;
  gardenSizeMin?: number;
  berRating?: string[];
  availability?: string;
  developmentStage?: string[];
  orientation?: string[];
  floor?: string[];
  parking?: boolean;
  garden?: boolean;
  balcony?: boolean;
  ensuite?: boolean;
  walkInWardrobe?: boolean;
}

interface SavedSearch {
  id: string;
  name: string;
  description?: string;
  filters: PropertyFilters;
  createdAt: Date;
  lastUsed?: Date;
  notificationEnabled: boolean;
}

export const usePropertySearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [propertiessetProperties] = useState<Property[]>([]);
  const [loadingsetLoading] = useState(false);
  const [totalCountsetTotalCount] = useState(0);
  const [currentPagesetCurrentPage] = useState(1);
  const [savedSearchessetSavedSearches] = useState<SavedSearch[]>([]);
  const [sortBysetSortBy] = useState('price_asc');

  const [filterssetFilters] = useState<PropertyFilters>({
    propertyTypes: [],
    locations: [],
    features: [],
    berRating: [],
    developmentStage: [],
    orientation: [],
    floor: []
  });

  // Parse filters from URL on mount
  useEffect(() => {
    const urlFilters: PropertyFilters = {
      priceMin: searchParams.get('priceMin') ? parseInt(searchParams.get('priceMin')!) : undefined,
      priceMax: searchParams.get('priceMax') ? parseInt(searchParams.get('priceMax')!) : undefined,
      bedroomsMin: searchParams.get('bedroomsMin') ? parseInt(searchParams.get('bedroomsMin')!) : undefined,
      bedroomsMax: searchParams.get('bedroomsMax') ? parseInt(searchParams.get('bedroomsMax')!) : undefined,
      bathroomsMin: searchParams.get('bathroomsMin') ? parseInt(searchParams.get('bathroomsMin')!) : undefined,
      propertyTypes: searchParams.get('propertyTypes')?.split(',') || [],
      locations: searchParams.get('locations')?.split(',') || [],
      features: searchParams.get('features')?.split(',') || [],
      berRating: searchParams.get('berRating')?.split(',') || [],
      developmentStage: searchParams.get('developmentStage')?.split(',') || [],
      orientation: searchParams.get('orientation')?.split(',') || [],
      floor: searchParams.get('floor')?.split(',') || []};

    setFilters(urlFilters);
    const page = searchParams.get('page');
    if (page) setCurrentPage(parseInt(page));

    const sort = searchParams.get('sort');
    if (sort) setSortBy(sort);
  }, [searchParams]);

  // Update URL when filters change
  const updateURL = useCallback((newFilters: PropertyFilters, page: number, sort: string) => {
    const params = new URLSearchParams();

    if (newFilters.priceMin) params.set('priceMin', newFilters.priceMin.toString());
    if (newFilters.priceMax) params.set('priceMax', newFilters.priceMax.toString());
    if (newFilters.bedroomsMin) params.set('bedroomsMin', newFilters.bedroomsMin.toString());
    if (newFilters.bedroomsMax) params.set('bedroomsMax', newFilters.bedroomsMax.toString());
    if (newFilters.bathroomsMin) params.set('bathroomsMin', newFilters.bathroomsMin.toString());
    if (newFilters.propertyTypes.length> 0) params.set('propertyTypes', newFilters.propertyTypes.join(','));
    if (newFilters.locations.length> 0) params.set('locations', newFilters.locations.join(','));
    if (newFilters.features.length> 0) params.set('features', newFilters.features.join(','));
    if (newFilters.berRating?.length> 0) params.set('berRating', newFilters.berRating.join(','));

    params.set('page', page.toString());
    params.set('sort', sort);

    router.push(`/properties/search?${params.toString()}`);
  }, [router]);

  // Fetch properties based on filters
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/properties?' + new URLSearchParams({
        ...Object.fromEntries(
          Object.entries(filters).map(([keyvalue]) => [
            key,
            Array.isArray(value) ? value.join(',') : value?.toString() || ''
          ])
        ),
        page: currentPage.toString(),
        limit: '12',
        sort: sortBy
      }));

      const data = await response.json();
      setProperties(data.properties);
      setTotalCount(data.totalCount);
    } catch (error) {

    } finally {
      setLoading(false);
    }
  }, [filterscurrentPagesortBy]);

  // Fetch properties when filters change
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Update filters and URL
  const updateFilters = (newFilters: PropertyFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page
    updateURL(newFilters1sortBy);
  };

  // Update page
  const updatePage = (page: number) => {
    setCurrentPage(page);
    updateURL(filterspagesortBy);
  };

  // Update sort
  const updateSort = (sort: string) => {
    setSortBy(sort);
    updateURL(filterscurrentPagesort);
  };

  // Save current search
  const saveSearch = async (name: string, description?: string, enableNotifications?: boolean) => {
    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name,
      description,
      filters,
      createdAt: new Date(),
      notificationEnabled: enableNotifications || false
    };

    // In production, save to API
    const savedSearches = JSON.parse(localStorage.getItem('savedSearches') || '[]');
    savedSearches.push(newSearch);
    localStorage.setItem('savedSearches', JSON.stringify(savedSearches));
    setSavedSearches(savedSearches);
  };

  // Load saved search
  const loadSavedSearch = (search: SavedSearch) => {
    setFilters(search.filters);
    setCurrentPage(1);
    updateURL(search.filters1sortBy);

    // Update last used
    const searches = savedSearches.map(s => 
      s.id === search.id ? { ...s, lastUsed: new Date() } : s
    );
    setSavedSearches(searches);
    localStorage.setItem('savedSearches', JSON.stringify(searches));
  };

  // Delete saved search
  const deleteSavedSearch = (id: string) => {
    const searches = savedSearches.filter(s => s.id !== id);
    setSavedSearches(searches);
    localStorage.setItem('savedSearches', JSON.stringify(searches));
  };

  // Load saved searches on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedSearches') || '[]');
    setSavedSearches(saved.map((s: any) => ({
      ...s,
      createdAt: new Date(s.createdAt),
      lastUsed: s.lastUsed ? new Date(s.lastUsed) : undefined
    })));
  }, []);

  return {
    properties,
    loading,
    filters,
    setFilters: updateFilters,
    totalCount,
    currentPage,
    setCurrentPage: updatePage,
    savedSearches,
    saveSearch,
    loadSavedSearch,
    deleteSavedSearch,
    sortBy,
    setSortBy: updateSort
  };
};