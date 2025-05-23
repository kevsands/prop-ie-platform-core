'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DocumentCategory, DocumentStatus } from './DocumentComplianceTracker';
import { Search, X, Filter, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocumentFilterBarProps {
  onCategoryChangeAction: (category: DocumentCategory | 'ALL') => void;
  onStatusChangeAction: (status: DocumentStatus | 'ALL') => void;
  onSearchChangeAction: (search: string) => void;
  categoryFilter: DocumentCategory | 'ALL';
  statusFilter: DocumentStatus | 'ALL';
  searchQuery: string;
  className?: string;
}

export default function DocumentFilterBar({
  onCategoryChangeAction,
  onStatusChangeAction,
  onSearchChangeAction,
  categoryFilter,
  statusFilter,
  searchQuery,
  className
}: DocumentFilterBarProps) {
  const [expandedsetExpanded] = useState(false);

  // Calculate if any filters are active
  const hasActiveFilters = categoryFilter !== 'ALL' || statusFilter !== 'ALL' || searchQuery.trim() !== '';

  // Handle clearing all filters
  const clearAllFilters = () => {
    onCategoryChangeAction('ALL');
    onStatusChangeAction('ALL');
    onSearchChangeAction('');
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Mobile filter toggle */}
      <div className="flex md:hidden items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {hasActiveFilters ? 'Filters Active' : 'Filters'}
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {(categoryFilter !== 'ALL' ? 1 : 0) + (statusFilter !== 'ALL' ? 1 : 0) + (searchQuery.trim() !== '' ? 1 : 0)}
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Full filter bar */}
      <div className={cn(
        "flex flex-col md:flex-row gap-3 md:items-center justify-between",
        !expanded && "hidden md:flex"
      )}>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="w-full md:w-auto">
            <Select 
              value={categoryFilter} 
              onValueChange={(value) => onCategoryChangeAction(value as any)}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  <SelectItem value="ALL">All Categories</SelectItem>
                  <SelectItem value="PLANNING">Planning</SelectItem>
                  <SelectItem value="LEGAL">Legal</SelectItem>
                  <SelectItem value="CONSTRUCTION">Construction</SelectItem>
                  <SelectItem value="MARKETING">Marketing</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-auto">
            <Select 
              value={statusFilter} 
              onValueChange={(value) => onStatusChangeAction(value as any)}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="MISSING">Missing</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => onSearchChangeAction(e.target.value)}
            className="pl-8 pr-8"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-9 w-9"
              onClick={() => onSearchChangeAction('')}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>

        {/* Clear all filters button (desktop) */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="hidden md:flex text-muted-foreground hover:text-foreground ml-2"
          >
            <X className="h-4 w-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Active filters summary - mobile only */}
      {hasActiveFilters && expanded && (
        <div className="flex flex-wrap gap-2 md:hidden">
          {categoryFilter !== 'ALL' && (
            <div className="flex items-center bg-muted text-xs py-1 px-2 rounded-md">
              <span>Category: {categoryFilter.charAt(0) + categoryFilter.slice(1).toLowerCase()}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1"
                onClick={() => onCategoryChangeAction('ALL')}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Clear category filter</span>
              </Button>
            </div>
          )}
          {statusFilter !== 'ALL' && (
            <div className="flex items-center bg-muted text-xs py-1 px-2 rounded-md">
              <span>Status: {statusFilter.charAt(0) + statusFilter.slice(1).toLowerCase()}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1"
                onClick={() => onStatusChangeAction('ALL')}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Clear status filter</span>
              </Button>
            </div>
          )}
          {searchQuery.trim() !== '' && (
            <div className="flex items-center bg-muted text-xs py-1 px-2 rounded-md">
              <span>Search: "{searchQuery}"</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1"
                onClick={() => onSearchChangeAction('')}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Clear search</span>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}