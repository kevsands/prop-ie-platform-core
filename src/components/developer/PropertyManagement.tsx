'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Home,
  Bed,
  Bath,
  Square,
  Car,
  MapPin,
  Euro,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Star,
  MoreVertical,
  Download,
  Upload,
  Settings,
  BarChart3,
  Users,
  Activity,
  FileText,
  Image,
  Video,
  Play
} from 'lucide-react';

interface Property {
  id: string;
  projectId: string;
  unitNumber: string;
  unitType: 'apartment' | 'house' | 'duplex' | 'penthouse';
  bedrooms: number;
  bathrooms: number;
  floorArea: number;
  balconyArea?: number;
  parkingSpaces: number;
  floor: number;
  facing: string;
  status: 'available' | 'reserved' | 'sold' | 'held' | 'unavailable';
  pricing: {
    basePrice: number;
    currentPrice: number;
    pricePerSqm: number;
    htbEligible: boolean;
    htbMaxBenefit?: number;
    incentives: string[];
    paymentTerms: string;
  };
  specifications: {
    finishLevel: 'standard' | 'premium' | 'luxury';
    features: string[];
    appliances: string[];
    flooring: string[];
    bathroom: string[];
    kitchen: string[];
    energyRating: string;
  };
  media: {
    floorPlan: string;
    images: string[];
    virtualTour?: string;
    video?: string;
  };
  reservations?: {
    buyerId: string;
    buyerName: string;
    reservationDate: string;
    depositAmount: number;
    reservationExpiry: string;
    status: string;
  };
  saleData?: {
    buyerId: string;
    buyerName: string;
    salePrice: number;
    saleDate: string;
    depositPaid: number;
    completionDate: string;
    solicitorId?: string;
    mortgageProvider?: string;
    htbClaimId?: string;
  };
  construction: {
    phase: string;
    completionPercentage: number;
    expectedCompletion: string;
    snagStatus: string;
    handoverDate?: string;
  };
  compliance: {
    bcaCompliance: boolean;
    planningCompliance: boolean;
    safetyCompliance: boolean;
    energyCompliance: boolean;
    accessibilityCompliance: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

interface PropertySummary {
  total: number;
  available: number;
  reserved: number;
  sold: number;
  totalValue: number;
  averagePrice: number;
  htbEligible: number;
  constructionProgress: number;
}

interface PropertyManagementProps {
  className?: string;
  projectId?: string;
}

export function PropertyManagement({ className = '', projectId }: PropertyManagementProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [summary, setSummary] = useState<PropertySummary>({
    total: 0,
    available: 0,
    reserved: 0,
    sold: 0,
    totalValue: 0,
    averagePrice: 0,
    htbEligible: 0,
    constructionProgress: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    unitType: 'all',
    bedrooms: 'all',
    htbEligible: 'all',
    priceRange: 'all'
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('unitNumber');
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, [projectId, filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (projectId) params.append('projectId', projectId);
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.unitType !== 'all') params.append('unitType', filters.unitType);
      if (filters.bedrooms !== 'all') params.append('bedrooms', filters.bedrooms);
      if (filters.htbEligible !== 'all') params.append('htbEligible', filters.htbEligible);

      const response = await fetch(`/api/developer/properties?${params}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }

      const data = await response.json();
      setProperties(data.properties || []);
      setSummary(data.summary || {});
    } catch (err: any) {
      setError(err.message || 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'reserved':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'sold':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'held':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'unavailable':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle size={14} className="text-green-600" />;
      case 'reserved':
        return <Clock size={14} className="text-blue-600" />;
      case 'sold':
        return <Star size={14} className="text-purple-600" />;
      case 'held':
        return <AlertTriangle size={14} className="text-amber-600" />;
      default:
        return <Home size={14} className="text-gray-600" />;
    }
  };

  const getUnitTypeIcon = (type: string) => {
    switch (type) {
      case 'house':
        return <Home size={16} className="text-blue-600" />;
      case 'apartment':
        return <Building2 size={16} className="text-green-600" />;
      case 'duplex':
        return <BarChart3 size={16} className="text-purple-600" />;
      case 'penthouse':
        return <Star size={16} className="text-amber-600" />;
      default:
        return <Home size={16} className="text-gray-600" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatCompactCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `€${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `€${(amount / 1000).toFixed(0)}K`;
    }
    return formatCurrency(amount);
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          property.unitType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'unitNumber':
        return a.unitNumber.localeCompare(b.unitNumber);
      case 'price':
        return a.pricing.currentPrice - b.pricing.currentPrice;
      case 'status':
        return a.status.localeCompare(b.status);
      case 'bedrooms':
        return a.bedrooms - b.bedrooms;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border shadow-sm p-8 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Building2 className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Property Management</h2>
              <p className="text-sm text-gray-600 mt-1">
                Comprehensive overview and management of all property units
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Download size={16} />
              Export
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Plus size={16} />
              Add Property
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900">{summary.total}</div>
            <div className="text-sm text-gray-600">Total Units</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">{summary.available}</div>
            <div className="text-sm text-gray-600">Available</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{summary.reserved}</div>
            <div className="text-sm text-gray-600">Reserved</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">{summary.sold}</div>
            <div className="text-sm text-gray-600">Sold</div>
          </div>
          <div className="bg-amber-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-amber-600">{summary.htbEligible}</div>
            <div className="text-sm text-gray-600">HTB Eligible</div>
          </div>
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="text-lg font-bold text-indigo-600">{formatCompactCurrency(summary.totalValue)}</div>
            <div className="text-sm text-gray-600">Total Value</div>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="text-lg font-bold text-emerald-600">{formatCompactCurrency(summary.averagePrice)}</div>
            <div className="text-sm text-gray-600">Avg Price</div>
          </div>
          <div className="bg-rose-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-rose-600">{Math.round(summary.constructionProgress)}%</div>
            <div className="text-sm text-gray-600">Progress</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
              <option value="held">Held</option>
            </select>
            
            <select
              value={filters.unitType}
              onChange={(e) => setFilters(prev => ({ ...prev, unitType: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="duplex">Duplex</option>
              <option value="penthouse">Penthouse</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="unitNumber">Unit Number</option>
              <option value="price">Price</option>
              <option value="status">Status</option>
              <option value="bedrooms">Bedrooms</option>
            </select>
            
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'} rounded-l-lg`}
              >
                <BarChart3 size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'} rounded-r-lg`}
              >
                <FileText size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Display */}
      <div className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProperties.map((property) => (
              <div key={property.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200">
                {/* Property Image */}
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(property.status)}`}>
                      {getStatusIcon(property.status)}
                      {property.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    {property.pricing.htbEligible && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                        HTB
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      {getUnitTypeIcon(property.unitType)}
                      <span className="font-semibold">{property.unitNumber}</span>
                    </div>
                    <div className="text-lg font-bold">{formatCompactCurrency(property.pricing.currentPrice)}</div>
                  </div>
                  {property.media.images.length > 0 && (
                    <div className="absolute bottom-3 right-3">
                      <Image size={16} className="text-white" />
                    </div>
                  )}
                </div>

                {/* Property Details */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Bed size={14} />
                        <span>{property.bedrooms}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath size={14} />
                        <span>{property.bathrooms}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Square size={14} />
                        <span>{property.floorArea}m²</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedProperty(property);
                        setShowPropertyDetails(true);
                      }}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <MoreVertical size={16} className="text-gray-600" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Floor</span>
                      <span className="font-medium">{property.floor}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Facing</span>
                      <span className="font-medium capitalize">{property.facing}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Per m²</span>
                      <span className="font-medium">{formatCurrency(property.pricing.pricePerSqm)}</span>
                    </div>
                  </div>

                  {property.construction.completionPercentage < 100 && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Construction</span>
                        <span className="font-medium">{property.construction.completionPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${property.construction.completionPercentage}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-2">
                    <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-1">
                      <Eye size={14} />
                      View
                    </button>
                    <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Edit size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bedrooms</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getUnitTypeIcon(property.unitType)}
                        <span className="font-medium text-gray-900">{property.unitNumber}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm text-gray-900 capitalize">{property.unitType}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-3 text-sm text-gray-900">
                        <span>{property.bedrooms} bed</span>
                        <span>{property.bathrooms} bath</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {property.floorArea}m²
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{formatCompactCurrency(property.pricing.currentPrice)}</div>
                        <div className="text-xs text-gray-500">{formatCurrency(property.pricing.pricePerSqm)}/m²</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(property.status)}`}>
                        {getStatusIcon(property.status)}
                        {property.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${property.construction.completionPercentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">{property.construction.completionPercentage}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <Eye size={14} className="text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <Edit size={14} className="text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <MoreVertical size={14} className="text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {sortedProperties.length === 0 && !loading && (
          <div className="text-center py-12">
            <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || Object.values(filters).some(f => f !== 'all') 
                ? 'Try adjusting your search or filters' 
                : 'Get started by adding your first property'}
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto">
              <Plus size={16} />
              Add Property
            </button>
          </div>
        )}
      </div>
    </div>
  );
}