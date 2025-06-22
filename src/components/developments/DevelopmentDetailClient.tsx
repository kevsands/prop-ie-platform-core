'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  Search, 
  Filter, 
  MapPin, 
  Bed, 
  Bath, 
  Car, 
  Maximize,
  Calendar,
  Euro,
  Eye,
  Heart,
  Share2,
  Grid2x2,
  List,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Home,
  TrendingUp,
  Users,
  Star
} from 'lucide-react';

import { developmentsService } from '@/lib/services/developments-prisma';
import { Unit } from '@/lib/services/units';
import DevelopmentCTA from '@/components/buyer/DevelopmentCTA';
import { UnitCard } from '@/components/units';
import { getStatusInfo, formatPrice, sortByStatusAndPrice } from '@/lib/utils/status-helpers';
import { useDevelopmentUnitsRealTimeSync } from '@/hooks/useUnitRealTimeSync';
import UnitSyncIndicator from '@/components/units/UnitSyncIndicator';

// Filter helpers
const filterUnits = (units: Unit[], filters: any) => {
  return units.filter(unit => {
    if (filters.status && filters.status !== 'All' && unit.status !== filters.status) {
      return false;
    }
    if (filters.bedrooms && filters.bedrooms !== 'Any' && unit.bedrooms !== parseInt(filters.bedrooms)) {
      return false;
    }
    if (filters.type && filters.type !== 'All' && unit.type !== filters.type) {
      return false;
    }
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      if (min && unit.basePrice < min) return false;
      if (max && unit.basePrice > max) return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        unit.name?.toLowerCase().includes(searchLower) ||
        unit.unitNumber?.toLowerCase().includes(searchLower) ||
        unit.type?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });
};

interface DevelopmentDetailClientProps {
  initialDevelopmentId: string;
}

export default function DevelopmentDetailClient({ initialDevelopmentId }: DevelopmentDetailClientProps) {
  const params = useParams();
  const developmentId = params.id as string || initialDevelopmentId;

  // State management
  const [development, setDevelopment] = useState<any>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Real-time sync
  const {
    units: syncedUnits,
    lastUpdate,
    isLive,
    initializeUnits,
    refreshUnits,
    hasActiveUpdate,
    getActiveUpdate,
    isConnected
  } = useDevelopmentUnitsRealTimeSync(developmentId);
  
  // Filter and display state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [bedroomFilter, setBedroomFilter] = useState('Any');
  const [typeFilter, setTypeFilter] = useState('All');
  const [priceRangeFilter, setPriceRangeFilter] = useState<[number, number] | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('price-asc');

  // Apply filtering whenever dependencies change
  useEffect(() => {
    const filtered = filterUnits(units, {
      status: statusFilter,
      bedrooms: bedroomFilter,
      type: typeFilter,
      priceRange: priceRangeFilter,
      search: searchQuery
    });
    
    // Apply sorting
    const sorted = sortByStatusAndPrice(filtered, sortBy);
    setFilteredUnits(sorted);
  }, [units, statusFilter, bedroomFilter, typeFilter, priceRangeFilter, searchQuery, sortBy]);

  // Sync units from real-time service
  useEffect(() => {
    if (syncedUnits.length > 0) {
      setUnits(syncedUnits);
      initializeUnits(syncedUnits);
    }
  }, [syncedUnits, initializeUnits]);

  // Load development and units data
  useEffect(() => {
    const loadDevelopmentData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load development details
        const devData = await developmentsService.getDevelopmentById(developmentId);
        if (!devData) {
          setError('Development not found');
          return;
        }
        setDevelopment(devData);
        
        // Load units for this development
        const unitsData = await developmentsService.getUnitsForDevelopment(developmentId);
        setUnits(unitsData || []);
        
      } catch (err) {
        console.error('Error loading development data:', err);
        setError('Failed to load development data');
      } finally {
        setLoading(false);
      }
    };

    if (developmentId) {
      loadDevelopmentData();
    }
  }, [developmentId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading development details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Development</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!development) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Development Not Found</h1>
          <p className="text-gray-600">The requested development could not be found.</p>
        </div>
      </div>
    );
  }

  const hasUpdate = hasActiveUpdate();
  const activeUpdate = getActiveUpdate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 bg-gray-900">
        <div className="absolute inset-0">
          {development.heroImage && (
            <img 
              src={development.heroImage} 
              alt={development.name}
              className="w-full h-full object-cover opacity-70"
            />
          )}
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{development.name}</h1>
            <div className="flex items-center mb-4">
              <MapPin className="h-5 w-5 mr-2" />
              <span className="text-lg">{development.location}</span>
            </div>
            <p className="text-xl max-w-2xl">{development.description}</p>
          </div>
        </div>
      </section>

      {/* Development Info */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About {development.name}</h2>
              <p className="text-lg text-gray-600 mb-8">{development.description}</p>
              
              {development.features && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {development.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
                <h3 className="text-xl font-semibold mb-4">Development Details</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Starting Price</span>
                    <span className="font-semibold">{formatPrice(development.startingPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Units Available</span>
                    <span className="font-semibold">{development.unitsAvailable} / {development.totalUnits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completion</span>
                    <span className="font-semibold">{development.completionDate || 'TBA'}</span>
                  </div>
                </div>
                
                <DevelopmentCTA 
                  developmentId={developmentId}
                  developmentName={development.name}
                  unitsAvailable={development.unitsAvailable}
                  startingPrice={development.startingPrice}
                />
              </div>
            </div>
          </div>

          {/* Units Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Available Units</h2>
              <div className="flex items-center space-x-4">
                <UnitSyncIndicator 
                  isLive={isLive}
                  lastUpdate={lastUpdate}
                  isConnected={isConnected}
                />
                <button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="flex items-center px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                  {viewMode === 'grid' ? <List className="h-5 w-5 mr-2" /> : <Grid2x2 className="h-5 w-5 mr-2" />}
                  {viewMode === 'grid' ? 'List View' : 'Grid View'}
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search units..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="All">All Status</option>
                    <option value="Available">Available</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                  <select
                    value={bedroomFilter}
                    onChange={(e) => setBedroomFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Any">Any Bedrooms</option>
                    <option value="1">1 Bedroom</option>
                    <option value="2">2 Bedrooms</option>
                    <option value="3">3 Bedrooms</option>
                    <option value="4">4+ Bedrooms</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="All">All Types</option>
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Duplex">Duplex</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="bedrooms-asc">Bedrooms: Low to High</option>
                    <option value="bedrooms-desc">Bedrooms: High to Low</option>
                    <option value="status">Status</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Units Grid/List */}
            {filteredUnits.length === 0 ? (
              <div className="text-center py-12">
                <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Units Found</h3>
                <p className="text-gray-600">Try adjusting your filters to see more units.</p>
              </div>
            ) : (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {filteredUnits.map((unit) => {
                  const hasUpdate = hasActiveUpdate();
                  const activeUpdate = getActiveUpdate();
                  return (
                    <UnitCard
                      key={unit.id}
                      unit={unit}
                      developmentId={developmentId}
                      showSyncIndicator={isLive}
                      syncStatus={hasUpdate ? 'syncing' : (isConnected ? 'synced' : 'offline')}
                      isLive={isLive}
                      lastUpdate={activeUpdate?.timestamp ? new Date(activeUpdate.timestamp) : lastUpdate}
                      updateType={activeUpdate?.updateType}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}