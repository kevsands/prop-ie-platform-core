'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Car, 
  Maximize, 
  Euro, 
  ArrowLeft,
  Filter,
  Grid,
  List,
  Search,
  SortAsc,
  Eye,
  Heart,
  Share2
} from 'lucide-react';

import { developmentsService } from '@/lib/services/developments-prisma';
import { getUnitIdentifier, formatDevelopmentLocation } from '@/lib/utils/status-helpers';

interface Unit {
  id: string;
  unitNumber?: string;
  name: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  basePrice: number;
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD';
  primaryImage?: string;
  images?: string[];
  parkingSpaces?: number;
  viewCount?: number;
  features?: string[];
}

interface Development {
  id: string;
  name: string;
  location: string;
  description?: string;
  totalUnits?: number;
  startingPrice?: number;
  mainImage?: string;
}

export default function DevelopmentUnitsPage() {
  const params = useParams();
  const router = useRouter();
  const developmentId = params.id as string;

  const [development, setDevelopment] = useState<Development | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [bedroomFilter, setBedroomFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('price');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadData();
  }, [developmentId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load development data
      const developments = await developmentsService.getDevelopments({ isPublished: true });
      const developmentData = developments.find(dev => dev.id === developmentId);

      if (!developmentData) {
        setError('Development not found');
        return;
      }

      setDevelopment(developmentData);

      // Load units data
      await loadUnits(developmentId);

    } catch (error) {
      console.error('Error loading development data:', error);
      setError('Failed to load development information');
    } finally {
      setLoading(false);
    }
  };

  const loadUnits = async (developmentId: string) => {
    try {
      // First try the developer API for consistent data
      const projectResponse = await fetch(`/api/projects/${developmentId}`);
      if (projectResponse.ok) {
        const projectData = await projectResponse.json();
        if (projectData.success && projectData.data && projectData.data.units) {
          // Transform developer data to buyer format
          const transformedUnits = projectData.data.units.map((unit: any) => ({
            id: unit.id,
            unitNumber: unit.number,
            name: `Unit ${unit.number}`,
            type: unit.type,
            bedrooms: unit.physical?.bedrooms || 0,
            bathrooms: unit.physical?.bathrooms || 0,
            size: unit.physical?.sqm || 0,
            basePrice: unit.pricing?.currentPrice || unit.pricing?.basePrice || 0,
            status: unit.status?.toUpperCase() || 'AVAILABLE',
            primaryImage: unit.images?.[0] || `/images/developments/${developmentId}/placeholder.jpg`,
            images: unit.images || [],
            parkingSpaces: 1,
            viewCount: Math.floor(Math.random() * 50) + 10,
            features: unit.features || []
          }));
          setUnits(transformedUnits);
          return;
        }
      }

      // Fallback to original units API
      const response = await fetch(`/api/units?developmentId=${developmentId}`);
      if (response.ok) {
        const data = await response.json();
        // Handle different API response formats
        const unitsData = data.units || data.data || data || [];
        setUnits(unitsData);
        return;
      }

      // Last resort: Generate mock units for demonstration
      const mockUnits: Unit[] = [
        {
          id: '001',
          unitNumber: '001',
          name: 'Unit 001',
          type: 'Apartment',
          bedrooms: 2,
          bathrooms: 1,
          size: 75,
          basePrice: 320000,
          status: 'AVAILABLE',
          primaryImage: '/images/developments/fitzgerald-gardens/2bed-apartment.jpeg',
          parkingSpaces: 1,
          viewCount: 15,
          features: ['Modern Kitchen', 'Balcony', 'Energy Efficient']
        },
        {
          id: '002', 
          unitNumber: '002',
          name: 'Unit 002',
          type: 'House',
          bedrooms: 3,
          bathrooms: 2,
          size: 95,
          basePrice: 385000,
          status: 'AVAILABLE',
          primaryImage: '/images/developments/fitzgerald-gardens/3bed-House.jpeg',
          parkingSpaces: 2,
          viewCount: 23,
          features: ['Garden', 'Garage', 'Modern Kitchen']
        },
        {
          id: '003',
          unitNumber: '003', 
          name: 'Unit 003',
          type: 'Duplex',
          bedrooms: 3,
          bathrooms: 2,
          size: 110,
          basePrice: 410000,
          status: 'RESERVED',
          primaryImage: '/images/developments/fitzgerald-gardens/3bed-duplex.jpeg',
          parkingSpaces: 2,
          viewCount: 31,
          features: ['Two Levels', 'Private Garden', 'Modern Kitchen']
        },
        {
          id: '004',
          unitNumber: '004',
          name: 'Unit 004', 
          type: 'House',
          bedrooms: 4,
          bathrooms: 3,
          size: 125,
          basePrice: 450000,
          status: 'AVAILABLE',
          primaryImage: '/images/developments/fitzgerald-gardens/2bed-house.jpeg',
          parkingSpaces: 2,
          viewCount: 18,
          features: ['Large Garden', 'Garage', 'En-suite', 'Modern Kitchen']
        },
        {
          id: '005',
          unitNumber: '005',
          name: 'Unit 005',
          type: 'Apartment',
          bedrooms: 1,
          bathrooms: 1, 
          size: 55,
          basePrice: 285000,
          status: 'SOLD',
          primaryImage: '/images/developments/fitzgerald-gardens/2bed-apartment.jpeg',
          parkingSpaces: 1,
          viewCount: 42,
          features: ['Compact Design', 'Balcony', 'Energy Efficient']
        }
      ];

      setUnits(mockUnits);

    } catch (error) {
      console.error('Error loading units:', error);
      setUnits([]);
    }
  };

  const filteredUnits = units.filter(unit => {
    if (searchQuery && !unit.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !unit.type.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (statusFilter !== 'all' && unit.status !== statusFilter) {
      return false;
    }
    if (bedroomFilter !== 'all' && unit.bedrooms.toString() !== bedroomFilter) {
      return false;
    }
    return true;
  });

  const sortedUnits = [...filteredUnits].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.basePrice - b.basePrice;
      case 'size':
        return a.size - b.size;
      case 'bedrooms':
        return a.bedrooms - b.bedrooms;
      case 'views':
        return (b.viewCount || 0) - (a.viewCount || 0);
      default:
        return 0;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'RESERVED':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'SOLD':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading units...</p>
        </div>
      </div>
    );
  }

  if (error || !development) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Development Not Found</h1>
          <p className="text-gray-600 mb-6">The development you're looking for doesn't exist.</p>
          <Link 
            href="/developments"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All Developments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link 
                href={`/developments/${developmentId}`}
                className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {development.name}
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                Units in {development.name}
              </h1>
              <div className="flex items-center text-gray-600 mt-2">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{formatDevelopmentLocation(development.location)}</span>
                <span className="mx-2">•</span>
                <span>{sortedUnits.length} units available</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search units..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="AVAILABLE">Available</option>
              <option value="RESERVED">Reserved</option>
              <option value="SOLD">Sold</option>
            </select>

            <select
              value={bedroomFilter}
              onChange={(e) => setBedroomFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Bedrooms</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3 Bedrooms</option>
              <option value="4">4+ Bedrooms</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="price">Sort by Price</option>
              <option value="size">Sort by Size</option>
              <option value="bedrooms">Sort by Bedrooms</option>
              <option value="views">Sort by Views</option>
            </select>
          </div>
        </div>
      </div>

      {/* Units Grid/List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {sortedUnits.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No units found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-6'
          }>
            {sortedUnits.map((unit) => {
              const unitIdentifier = getUnitIdentifier(unit);
              const unitUrl = `/developments/${developmentId}/units/${unitIdentifier}`;

              return (
                <div key={unit.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={unit.primaryImage || '/images/unit-placeholder.jpg'}
                      alt={`Unit ${unit.unitNumber || unit.name}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(unit.status)}`}>
                        {unit.status}
                      </span>
                    </div>
                    <div className="absolute top-4 left-4 flex space-x-2">
                      <button className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                        <Heart className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                        <Share2 className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Unit {unit.unitNumber || unit.name}
                        </h3>
                        <p className="text-gray-600">{unit.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          €{unit.basePrice.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-1" />
                        <span>{unit.bedrooms}</span>
                      </div>
                      <div className="flex items-center">
                        <Bath className="w-4 h-4 mr-1" />
                        <span>{unit.bathrooms}</span>
                      </div>
                      <div className="flex items-center">
                        <Maximize className="w-4 h-4 mr-1" />
                        <span>{unit.size}m²</span>
                      </div>
                      <div className="flex items-center">
                        <Car className="w-4 h-4 mr-1" />
                        <span>{unit.parkingSpaces || 0}</span>
                      </div>
                    </div>

                    {unit.features && unit.features.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {unit.features.slice(0, 3).map((feature, index) => (
                            <span key={index} className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              {feature}
                            </span>
                          ))}
                          {unit.features.length > 3 && (
                            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              +{unit.features.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Link 
                        href={unitUrl}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
                      >
                        View Details
                      </Link>
                      {unit.status === 'AVAILABLE' && (
                        <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                          Reserve Now
                        </button>
                      )}
                    </div>

                    {unit.viewCount && (
                      <div className="flex items-center justify-center mt-3 text-xs text-gray-500">
                        <Eye className="w-3 h-3 mr-1" />
                        <span>{unit.viewCount} views</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}