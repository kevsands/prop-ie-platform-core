'use client';

import { useState } from 'react';
import {
  MapIcon,
  ListBulletIcon,
  Squares2X2Icon,
  AdjustmentsHorizontalIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  BookmarkIcon,
  ScaleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SavedSearch {
  id: string;
  name: string;
  filters: any;
  createdAt: Date;
}

interface PropertySearchHeaderProps {
  totalCount: number;
  viewMode: 'list' | 'map' | 'grid';
  setViewMode: (mode: 'list' | 'map' | 'grid') => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  compareMode: boolean;
  setCompareMode: (enabled: boolean) => void;
  compareCount: number;
  onSaveSearch: () => void;
  savedSearches: SavedSearch[];
  onLoadSearch: (search: SavedSearch) => void;
  sortBy?: string;
  setSortBy?: (sort: string) => void;
}

export default function PropertySearchHeader({
  totalCount,
  viewMode,
  setViewMode,
  showFilters,
  setShowFilters,
  compareMode,
  setCompareMode,
  compareCount,
  onSaveSearch,
  savedSearches,
  onLoadSearch,
  sortBy = 'price_asc',
  setSortBy = () => {}
}: PropertySearchHeaderProps) {
  const sortOptions = [
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'date_desc', label: 'Newest First' },
    { value: 'date_asc', label: 'Oldest First' },
    { value: 'size_desc', label: 'Size: Largest First' },
    { value: 'size_asc', label: 'Size: Smallest First' },
    { value: 'relevance', label: 'Most Relevant' },
  ];

  const currentSort = sortOptions.find(opt => opt.value === sortBy);

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-gray-900">
              {totalCount} Properties Found
            </h1>
            {compareMode && compareCount > 0 && (
              <Badge className="bg-blue-100 text-blue-700">
                {compareCount} selected
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <AdjustmentsHorizontalIcon className="h-4 w-4" />
              Filters
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <BookmarkIcon className="h-4 w-4" />
                  Saved Searches
                  <ChevronDownIcon className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem onClick={onSaveSearch}>
                  <span className="font-medium">Save Current Search</span>
                </DropdownMenuItem>
                {savedSearches.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    {savedSearches.map((search) => (
                      <DropdownMenuItem
                        key={search.id}
                        onClick={() => onLoadSearch(search)}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{search.name}</span>
                          <span className="text-xs text-gray-500">
                            Saved {new Date(search.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <span>{currentSort?.label}</span>
                <ChevronDownIcon className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={cn(
                    "cursor-pointer",
                    sortBy === option.value && "bg-gray-100"
                  )}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant={compareMode ? "default" : "outline"}
            size="sm"
            onClick={() => setCompareMode(!compareMode)}
            className="flex items-center gap-2"
          >
            <ScaleIcon className="h-4 w-4" />
            Compare
          </Button>

          <div className="flex items-center border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={cn(
                "rounded-r-none border-r",
                viewMode === 'grid' && "bg-blue-50 text-blue-600 hover:bg-blue-100"
              )}
            >
              <Squares2X2Icon className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={cn(
                "rounded-none border-r",
                viewMode === 'list' && "bg-blue-50 text-blue-600 hover:bg-blue-100"
              )}
            >
              <ListBulletIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('map')}
              className={cn(
                "rounded-l-none",
                viewMode === 'map' && "bg-blue-50 text-blue-600 hover:bg-blue-100"
              )}
            >
              <MapIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}