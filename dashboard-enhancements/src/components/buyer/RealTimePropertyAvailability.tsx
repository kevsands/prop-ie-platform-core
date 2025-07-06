'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  RefreshCw,
  AlertCircle,
  Clock,
  Eye,
  Heart,
  TrendingUp,
  Users,
  Calendar,
  MapPin,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Bell,
  Filter,
  Search,
  Home
} from 'lucide-react';

interface PropertyAvailability {
  propertyId: string;
  status: 'AVAILABLE' | 'RESERVED' | 'SALE_AGREED' | 'SOLD' | 'WITHDRAWN';
  price: number;
  priceChangedAt?: Date;
  statusChangedAt: Date;
  lastUpdated: Date;
  reservedUntil?: Date;
  salesAgent?: string;
  buyerInterest: number;
  viewingCount: number;
  developmentId: string;
  unitNumber: string;
  urgency?: 'low' | 'medium' | 'high' | 'urgent';
  reason?: string;
}

interface AvailabilityUpdate {
  propertyId: string;
  developmentId: string;
  updateType: 'STATUS_CHANGE' | 'PRICE_CHANGE' | 'INTEREST_UPDATE' | 'VIEWING_SCHEDULED' | 'URGENT_ACTION';
  oldValue?: string | number;
  newValue: string | number;
  timestamp: Date;
  reason?: string;
  agent?: string;
  buyerId?: string;
}

interface PropertyDetails {
  id: string;
  title: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  type: string;
  images: string[];
  development: {
    name: string;
    developer: string;
  };
}

export default function RealTimePropertyAvailability() {
  const [properties, setProperties] = useState<PropertyAvailability[]>([]);
  const [recentUpdates, setRecentUpdates] = useState<AvailabilityUpdate[]>([]);
  const [propertyDetails, setPropertyDetails] = useState<Map<string, PropertyDetails>>(new Map());
  const [loading, setLoading] = useState(true);
  const [lastPolled, setLastPolled] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [developmentFilter, setDevelopmentFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const loadAvailability = useCallback(async (isPolling = false) => {
    try {
      if (!isPolling) setError(null);
      
      const params = new URLSearchParams({
        includeUpdates: 'true',
        includeStats: 'true'
      });

      if (lastPolled && isPolling) {
        params.append('since', lastPolled.toISOString());
      }

      const response = await fetch(`/api/properties/availability?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to load property availability');
      }

      const data = await response.json();
      
      if (isPolling && data.properties.length === 0) {
        // No new updates
        return;
      }

      setProperties(data.properties);
      if (data.recentUpdates) {
        setRecentUpdates(data.recentUpdates);
      }
      setLastPolled(new Date(data.lastPolled));

      // Load property details for any new properties
      const newPropertyIds = data.properties
        .map((p: PropertyAvailability) => p.propertyId)
        .filter((id: string) => !propertyDetails.has(id));

      if (newPropertyIds.length > 0) {
        await loadPropertyDetails(newPropertyIds);
      }

    } catch (err) {
      console.error('Error loading availability:', err);
      if (!isPolling) {
        setError(err instanceof Error ? err.message : 'Failed to load availability');
      }
    } finally {
      if (!isPolling) setLoading(false);
    }
  }, [lastPolled, propertyDetails]);

  const loadPropertyDetails = async (propertyIds: string[]) => {
    try {
      // In a real implementation, this would fetch property details
      // For now, we'll create mock data based on the property IDs
      const mockDetails: PropertyDetails[] = propertyIds.map(id => ({
        id,
        title: `Property ${id.split('-').pop()}`,
        location: id.includes('dublin') ? 'Dublin' : id.includes('cork') ? 'Cork' : 'Ireland',
        bedrooms: Math.floor(Math.random() * 3) + 1,
        bathrooms: Math.floor(Math.random() * 2) + 1,
        size: Math.floor(Math.random() * 50) + 50,
        type: Math.random() > 0.5 ? 'apartment' : 'house',
        images: ['/images/properties/default.jpg'],
        development: {
          name: getDevelopmentName(id),
          developer: 'Premium Developments Ltd'
        }
      }));

      setPropertyDetails(prev => {
        const newMap = new Map(prev);
        mockDetails.forEach(detail => newMap.set(detail.id, detail));
        return newMap;
      });
    } catch (err) {
      console.error('Error loading property details:', err);
    }
  };

  const getDevelopmentName = (propertyId: string): string => {
    if (propertyId.includes('fitzgerald')) return 'Fitzgerald Gardens';
    if (propertyId.includes('ellwood')) return 'Ellwood Heights';
    if (propertyId.includes('ballymakenny')) return 'Ballymakenny View';
    if (propertyId.includes('phoenix')) return 'Phoenix Park Residences';
    if (propertyId.includes('riverside')) return 'Riverside Gardens';
    if (propertyId.includes('city-centre')) return 'City Centre Heights';
    return 'Premium Development';
  };

  const handleExpressInterest = async (propertyId: string) => {
    try {
      const response = await fetch('/api/properties/availability', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          action: 'interest_expressed',
          buyerId: 'buyer-001' // In real app, this would come from auth context
        })
      });

      if (response.ok) {
        // Refresh data to show updated interest count
        await loadAvailability(true);
      }
    } catch (err) {
      console.error('Error expressing interest:', err);
    }
  };

  const scheduleViewing = async (propertyId: string) => {
    try {
      const response = await fetch('/api/properties/availability', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          action: 'viewing_scheduled',
          buyerId: 'buyer-001'
        })
      });

      if (response.ok) {
        await loadAvailability(true);
      }
    } catch (err) {
      console.error('Error scheduling viewing:', err);
    }
  };

  useEffect(() => {
    loadAvailability();
  }, [loadAvailability]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadAvailability(true);
    }, 15000); // Poll every 15 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, loadAvailability]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'text-green-600 bg-green-100 border-green-200';
      case 'RESERVED': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'SALE_AGREED': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'SOLD': return 'text-gray-600 bg-gray-100 border-gray-200';
      case 'WITHDRAWN': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUpdateIcon = (updateType: string) => {
    switch (updateType) {
      case 'STATUS_CHANGE': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'PRICE_CHANGE': return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'VIEWING_SCHEDULED': return <Eye className="h-4 w-4 text-purple-500" />;
      case 'INTEREST_UPDATE': return <Heart className="h-4 w-4 text-red-500" />;
      case 'URGENT_ACTION': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const filteredProperties = properties.filter(property => {
    if (statusFilter !== 'all' && property.status !== statusFilter) return false;
    if (developmentFilter !== 'all' && property.developmentId !== developmentFilter) return false;
    if (urgencyFilter !== 'all' && property.urgency !== urgencyFilter) return false;
    
    if (searchQuery) {
      const details = propertyDetails.get(property.propertyId);
      const query = searchQuery.toLowerCase();
      return (
        property.unitNumber.toLowerCase().includes(query) ||
        property.developmentId.toLowerCase().includes(query) ||
        details?.title.toLowerCase().includes(query) ||
        details?.development.name.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property availability...</p>
        </div>
      </div>
    );
  }

  if (error && properties.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-600 mb-4" />
        <h3 className="text-lg font-medium text-red-900 mb-2">Unable to Load Property Availability</h3>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={() => loadAvailability()}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <TrendingUp className="text-blue-500" />
            Live Property Availability
          </h1>
          <p className="mt-2 text-gray-600">
            Real-time updates on property status, pricing, and availability
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-gray-300"
            />
            Auto-refresh
          </label>
          <button
            onClick={() => loadAvailability()}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">All Statuses</option>
              <option value="AVAILABLE">Available</option>
              <option value="RESERVED">Reserved</option>
              <option value="SALE_AGREED">Sale Agreed</option>
              <option value="SOLD">Sold</option>
            </select>

            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">All Urgency</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            {lastPolled && `Last updated: ${formatTimeAgo(lastPolled)}`}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Property List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredProperties.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <Home className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties Found</h3>
              <p className="text-gray-600">
                No properties match your current filters.
              </p>
            </div>
          ) : (
            filteredProperties.map((property) => {
              const details = propertyDetails.get(property.propertyId);
              return (
                <div key={property.propertyId} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          Unit {property.unitNumber}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(property.status)}`}>
                          {property.status}
                        </span>
                        {property.urgency && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(property.urgency)}`}>
                            {property.urgency.toUpperCase()}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <MapPin className="h-4 w-4" />
                        <span>{getDevelopmentName(property.propertyId)}</span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Price:</span>
                          <p className="font-medium text-lg">€{property.price.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Interest:</span>
                          <p className="font-medium flex items-center gap-1">
                            <Heart className="h-3 w-3 text-red-500" />
                            {property.buyerInterest}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Viewings:</span>
                          <p className="font-medium flex items-center gap-1">
                            <Eye className="h-3 w-3 text-blue-500" />
                            {property.viewingCount}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Updated:</span>
                          <p className="font-medium">{formatTimeAgo(property.lastUpdated)}</p>
                        </div>
                      </div>

                      {property.reservedUntil && property.status === 'RESERVED' && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center gap-2 text-yellow-800">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">
                              Reserved until {new Date(property.reservedUntil).toLocaleDateString('en-IE')}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {property.status === 'AVAILABLE' && (
                    <div className="flex items-center gap-3 pt-4 border-t">
                      <button
                        onClick={() => handleExpressInterest(property.propertyId)}
                        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Heart className="h-4 w-4" />
                        Express Interest
                      </button>
                      <button
                        onClick={() => scheduleViewing(property.propertyId)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Calendar className="h-4 w-4" />
                        Schedule Viewing
                      </button>
                      <Link
                        href={`/properties/${property.propertyId}`}
                        className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </Link>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Recent Updates Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-500" />
              Recent Updates
            </h2>
            <div className="space-y-3">
              {recentUpdates.slice(0, 10).map((update, index) => (
                <div key={index} className="border-l-4 border-blue-400 pl-3 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    {getUpdateIcon(update.updateType)}
                    <span className="font-medium text-sm text-gray-900">
                      Unit {properties.find(p => p.propertyId === update.propertyId)?.unitNumber || 'N/A'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{update.reason}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTimeAgo(update.timestamp)}
                    {update.agent && ` • ${update.agent}`}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Available:</span>
                <span className="font-medium text-green-600">
                  {properties.filter(p => p.status === 'AVAILABLE').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Reserved:</span>
                <span className="font-medium text-yellow-600">
                  {properties.filter(p => p.status === 'RESERVED').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Sale Agreed:</span>
                <span className="font-medium text-blue-600">
                  {properties.filter(p => p.status === 'SALE_AGREED').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Interest:</span>
                <span className="font-medium text-red-600">
                  {properties.reduce((sum, p) => sum + p.buyerInterest, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}