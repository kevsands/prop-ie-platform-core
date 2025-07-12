/**
 * Units Grid Listing Component
 * Comprehensive unit display with conversion optimization and developer/buyer views
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Filter, 
  Grid, 
  List, 
  SortAsc, 
  SortDesc, 
  Search,
  Eye,
  TrendingUp,
  Users,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Euro,
  Settings,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Clock,
  Building2
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Unit, UnitType, UnitStatus } from '@/types/core/unit';
import UnitCard from './UnitCard';
import ConversionOptimizedUnitCard from '../conversion/ConversionOptimizedUnitCard';
import { PurchaserDetails } from '../conversion/OneClickExclusivityPurchase';

export interface UnitsGridData {
  units: Unit[];
  totalCount: number;
  summary: {
    available: number;
    reserved: number;
    sold: number;
    averagePrice: number;
    priceRange: { min: number; max: number };
  };
  developmentInfo: {
    id: string;
    name: string;
    location: string;
    totalUnits: number;
  };
}

export interface UnitFilters {
  search: string;
  status: UnitStatus[];
  type: UnitType[];
  bedrooms: number[];
  priceRange: [number, number];
  sizeRange: [number, number];
  features: string[];
  sortBy: 'price' | 'size' | 'bedrooms' | 'updated' | 'views';
  sortOrder: 'asc' | 'desc';
}

interface UnitsGridListingProps {
  data: UnitsGridData;
  viewMode?: 'buyer' | 'developer';
  showConversionFeatures?: boolean;
  onUnitView?: (unitId: string) => void;
  onUnitEdit?: (unitId: string) => void;
  onExclusivityPurchased?: (transactionId: string, unitId: string, purchaserDetails: PurchaserDetails) => void;
  onFiltersChange?: (filters: UnitFilters) => void;
}

const DEFAULT_FILTERS: UnitFilters = {
  search: '',
  status: [],
  type: [],
  bedrooms: [],
  priceRange: [0, 2000000],
  sizeRange: [0, 500],
  features: [],
  sortBy: 'price',
  sortOrder: 'asc'
};

export const UnitsGridListing: React.FC<UnitsGridListingProps> = ({
  data,
  viewMode = 'buyer',
  showConversionFeatures = true,
  onUnitView,
  onUnitEdit,
  onExclusivityPurchased,
  onFiltersChange
}) => {
  const [filters, setFilters] = useState<UnitFilters>(DEFAULT_FILTERS);
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');
  const [selectedUnits, setSelectedUnits] = useState<Set<string>>(new Set());

  // Filter and sort units
  const filteredUnits = useMemo(() => {
    let filtered = [...data.units];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(unit => 
        unit.name.toLowerCase().includes(searchLower) ||
        unit.unitNumber?.toLowerCase().includes(searchLower) ||
        unit.features.some(f => f.toLowerCase().includes(searchLower))
      );
    }

    // Status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(unit => filters.status.includes(unit.status));
    }

    // Type filter
    if (filters.type.length > 0) {
      filtered = filtered.filter(unit => filters.type.includes(unit.type));
    }

    // Bedrooms filter
    if (filters.bedrooms.length > 0) {
      filtered = filtered.filter(unit => filters.bedrooms.includes(unit.bedrooms));
    }

    // Price range filter
    filtered = filtered.filter(unit => 
      unit.basePrice >= filters.priceRange[0] && 
      unit.basePrice <= filters.priceRange[1]
    );

    // Size range filter
    filtered = filtered.filter(unit => 
      unit.size >= filters.sizeRange[0] && 
      unit.size <= filters.sizeRange[1]
    );

    // Sort
    filtered.sort((a, b) => {
      let aVal: any, bVal: any;
      
      switch (filters.sortBy) {
        case 'price':
          aVal = a.basePrice;
          bVal = b.basePrice;
          break;
        case 'size':
          aVal = a.size;
          bVal = b.size;
          break;
        case 'bedrooms':
          aVal = a.bedrooms;
          bVal = b.bedrooms;
          break;
        case 'views':
          aVal = a.viewCount || 0;
          bVal = b.viewCount || 0;
          break;
        case 'updated':
          aVal = new Date(a.updatedAt || 0).getTime();
          bVal = new Date(b.updatedAt || 0).getTime();
          break;
        default:
          return 0;
      }

      if (filters.sortOrder === 'desc') {
        return bVal - aVal;
      }
      return aVal - bVal;
    });

    return filtered;
  }, [data.units, filters]);

  // Handle filter changes
  const updateFilters = (newFilters: Partial<UnitFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange?.(updatedFilters);
  };

  const formatPrice = (price: number) => `€${price.toLocaleString()}`;

  const getStatusColor = (status: UnitStatus) => {
    switch (status) {
      case UnitStatus.AVAILABLE: return 'bg-green-100 text-green-800';
      case UnitStatus.RESERVED: return 'bg-orange-100 text-orange-800';
      case UnitStatus.SALE_AGREED: return 'bg-blue-100 text-blue-800';
      case UnitStatus.SOLD: return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedUnits.size === 0) return;
    
    console.log(`Bulk action: ${action} on units:`, Array.from(selectedUnits));
    // Implement bulk actions for developer mode
  };

  return (
    <div className="space-y-6">
      {/* Header with Development Info */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {data.developmentInfo.name} Units
          </h1>
          <div className="flex items-center space-x-4 text-gray-600 mt-2">
            <span className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{data.developmentInfo.location}</span>
            </span>
            <span>{filteredUnits.length} of {data.totalCount} units</span>
          </div>
        </div>
        
        {viewMode === 'developer' && (
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => {}}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            <Button onClick={() => {}}>
              <Settings className="h-4 w-4 mr-2" />
              Manage Units
            </Button>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-2xl font-bold text-green-600">
                {data.summary.available}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm text-gray-600">Reserved</p>
              <p className="text-2xl font-bold text-orange-600">
                {data.summary.reserved}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Sold</p>
              <p className="text-2xl font-bold text-blue-600">
                {data.summary.sold}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Euro className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-sm text-gray-600">Avg Price</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatPrice(data.summary.averagePrice)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Search and View Controls */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search units by name, number, or features..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="max-w-md"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={displayMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDisplayMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={displayMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDisplayMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <Select
              value={filters.status.join(',')}
              onValueChange={(value) => 
                updateFilters({ status: value ? value.split(',') as UnitStatus[] : [] })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value={UnitStatus.AVAILABLE}>Available</SelectItem>
                <SelectItem value={UnitStatus.RESERVED}>Reserved</SelectItem>
                <SelectItem value={UnitStatus.SOLD}>Sold</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.type.join(',')}
              onValueChange={(value) => 
                updateFilters({ type: value ? value.split(',') as UnitType[] : [] })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value={UnitType.APARTMENT}>Apartment</SelectItem>
                <SelectItem value={UnitType.DUPLEX}>Duplex</SelectItem>
                <SelectItem value={UnitType.PENTHOUSE}>Penthouse</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.bedrooms.join(',')}
              onValueChange={(value) => 
                updateFilters({ bedrooms: value ? value.split(',').map(Number) : [] })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Bedrooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Bedrooms</SelectItem>
                <SelectItem value="1">1 Bedroom</SelectItem>
                <SelectItem value="2">2 Bedrooms</SelectItem>
                <SelectItem value="3">3 Bedrooms</SelectItem>
                <SelectItem value="4">4+ Bedrooms</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.sortBy}
              onValueChange={(value: any) => updateFilters({ sortBy: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="size">Size</SelectItem>
                <SelectItem value="bedrooms">Bedrooms</SelectItem>
                <SelectItem value="views">Views</SelectItem>
                <SelectItem value="updated">Updated</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => updateFilters({ 
                sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' 
              })}
            >
              {filters.sortOrder === 'asc' ? (
                <SortAsc className="h-4 w-4" />
              ) : (
                <SortDesc className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => setFilters(DEFAULT_FILTERS)}
            >
              Clear Filters
            </Button>
          </div>

          {/* Developer Bulk Actions */}
          {viewMode === 'developer' && selectedUnits.size > 0 && (
            <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-blue-800">
                {selectedUnits.size} units selected
              </span>
              <Button size="sm" onClick={() => handleBulkAction('update_status')}>
                Update Status
              </Button>
              <Button size="sm" onClick={() => handleBulkAction('update_price')}>
                Update Price
              </Button>
              <Button size="sm" onClick={() => handleBulkAction('export')}>
                Export
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Units Grid */}
      <div className={`${
        displayMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
          : 'space-y-4'
      }`}>
        {filteredUnits.map((unit) => {
          if (viewMode === 'buyer' && showConversionFeatures) {
            // Convert unit to conversion format
            const conversionUnit = {
              ...unit,
              unitNumber: unit.unitNumber || unit.id,
              price: unit.basePrice,
              location: data.developmentInfo.location,
              developmentName: data.developmentInfo.name,
              htbEligible: true, // This should come from unit data
              exclusivityFee: Math.max(500, unit.basePrice * 0.01),
              urgencyData: {
                unitsRemaining: data.summary.available,
                totalUnits: data.totalCount,
                currentViewers: Math.floor(Math.random() * 10) + 1,
                viewsToday: (unit.viewCount || 0) + Math.floor(Math.random() * 50),
                recentReservations: Math.floor(Math.random() * 5),
              },
              recentActivity: {
                viewsToday: (unit.viewCount || 0) + Math.floor(Math.random() * 50),
                currentViewers: Math.floor(Math.random() * 10) + 1,
                recentInquiries: Math.floor(Math.random() * 10),
              },
              sellingPoints: unit.features.slice(0, 3),
            };

            return (
              <ConversionOptimizedUnitCard
                key={unit.id}
                unit={conversionUnit}
                onViewDetails={onUnitView || (() => {})}
                onExclusivityPurchased={onExclusivityPurchased || (() => {})}
                showIntenseMode={data.summary.available <= 10}
              />
            );
          }

          return (
            <UnitCard
              key={unit.id}
              unit={unit}
              developmentId={data.developmentInfo.id}
              developmentName={data.developmentInfo.name}
              showDevelopmentName={false}
              showViewCount={viewMode === 'developer'}
              onClick={() => {
                if (viewMode === 'developer') {
                  onUnitEdit?.(unit.id);
                } else {
                  onUnitView?.(unit.id);
                }
              }}
            />
          );
        })}
      </div>

      {/* Empty State */}
      {filteredUnits.length === 0 && (
        <Card className="p-12 text-center">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No units found
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your filters or search criteria
          </p>
          <Button 
            variant="outline" 
            onClick={() => setFilters(DEFAULT_FILTERS)}
          >
            Clear all filters
          </Button>
        </Card>
      )}

      {/* Load More / Pagination */}
      {filteredUnits.length > 0 && filteredUnits.length < data.totalCount && (
        <div className="text-center">
          <Button variant="outline" onClick={() => {}}>
            Load More Units
          </Button>
        </div>
      )}
    </div>
  );
};

export default UnitsGridListing;