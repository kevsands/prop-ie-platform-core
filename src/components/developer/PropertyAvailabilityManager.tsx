'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Heart,
  TrendingUp,
  Users,
  Calendar,
  MapPin,
  DollarSign,
  Edit,
  Bell,
  Filter,
  Search,
  Home,
  Building,
  Settings,
  Activity,
  AlertTriangle
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

interface DevelopmentStats {
  developmentId: string;
  developmentName: string;
  totalUnits: number;
  available: number;
  reserved: number;
  saleAgreed: number;
  sold: number;
  withdrawn: number;
  averagePrice: number;
  priceRange: { min: number; max: number };
  lastUpdate: Date;
  recentActivity: AvailabilityUpdate[];
}

export default function PropertyAvailabilityManager() {
  const [selectedDevelopment, setSelectedDevelopment] = useState<string>('all');
  const [properties, setProperties] = useState<PropertyAvailability[]>([]);
  const [developmentStats, setDevelopmentStats] = useState<DevelopmentStats | null>(null);
  const [recentUpdates, setRecentUpdates] = useState<AvailabilityUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastPolled, setLastPolled] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [editingProperty, setEditingProperty] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    status: '',
    price: '',
    reason: ''
  });

  const developments = [
    { id: 'fitzgerald-gardens', name: 'Fitzgerald Gardens' },
    { id: 'ellwood', name: 'Ellwood Heights' },
    { id: 'ballymakenny-view', name: 'Ballymakenny View' },
    { id: 'phoenix-park-residences', name: 'Phoenix Park Residences' },
    { id: 'riverside-gardens', name: 'Riverside Gardens' },
    { id: 'city-centre-heights', name: 'City Centre Heights' }
  ];

  const loadAvailability = useCallback(async (isPolling = false) => {
    try {
      if (!isPolling) {
        setError(null);
        if (refreshing) setRefreshing(true);
      }

      const params = new URLSearchParams({
        includeUpdates: 'true',
        includeStats: 'true'
      });

      if (selectedDevelopment !== 'all') {
        params.append('developmentId', selectedDevelopment);
      }

      if (lastPolled && isPolling) {
        params.append('since', lastPolled.toISOString());
      }

      const response = await fetch(`/api/properties/availability?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to load property availability');
      }

      const data = await response.json();
      
      if (isPolling && data.properties.length === 0) {
        return;
      }

      // Convert date strings to Date objects for properties
      const processedProperties = data.properties.map((property: any) => ({
        ...property,
        lastUpdated: new Date(property.lastUpdated),
        statusChangedAt: new Date(property.statusChangedAt),
        priceChangedAt: property.priceChangedAt ? new Date(property.priceChangedAt) : undefined,
        reservedUntil: property.reservedUntil ? new Date(property.reservedUntil) : undefined
      }));
      
      setProperties(processedProperties);
      
      if (data.recentUpdates) {
        // Convert date strings to Date objects for recent updates
        const processedUpdates = data.recentUpdates.map((update: any) => ({
          ...update,
          timestamp: new Date(update.timestamp)
        }));
        setRecentUpdates(processedUpdates);
      }
      
      if (data.development) {
        // Convert date strings to Date objects for development stats
        const processedStats = {
          ...data.development,
          lastUpdate: new Date(data.development.lastUpdate),
          recentActivity: data.development.recentActivity.map((activity: any) => ({
            ...activity,
            timestamp: new Date(activity.timestamp)
          }))
        };
        setDevelopmentStats(processedStats);
      }
      
      setLastPolled(new Date(data.lastPolled));

    } catch (err) {
      console.error('Error loading availability:', err);
      if (!isPolling) {
        setError(err instanceof Error ? err.message : 'Failed to load availability');
      }
    } finally {
      if (!isPolling) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [selectedDevelopment, lastPolled, refreshing]);

  const updatePropertyStatus = async (propertyId: string, updates: any) => {
    try {
      const response = await fetch('/api/properties/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          developmentId: properties.find(p => p.propertyId === propertyId)?.developmentId,
          ...updates,
          agent: 'Developer Portal'
        })
      });

      if (response.ok) {
        await loadAvailability(true);
        setEditingProperty(null);
        setEditForm({ status: '', price: '', reason: '' });
      } else {
        throw new Error('Failed to update property');
      }
    } catch (err) {
      console.error('Error updating property:', err);
      setError(err instanceof Error ? err.message : 'Failed to update property');
    }
  };

  const handleEditProperty = (property: PropertyAvailability) => {
    setEditingProperty(property.propertyId);
    setEditForm({
      status: property.status,
      price: property.price.toString(),
      reason: property.reason || ''
    });
  };

  const handleSaveChanges = () => {
    if (!editingProperty) return;

    const updates: any = {};
    const originalProperty = properties.find(p => p.propertyId === editingProperty);
    
    if (editForm.status !== originalProperty?.status) {
      updates.status = editForm.status;
    }
    
    if (parseInt(editForm.price) !== originalProperty?.price) {
      updates.price = parseInt(editForm.price);
    }
    
    if (editForm.reason) {
      updates.reason = editForm.reason;
    }

    updatePropertyStatus(editingProperty, updates);
  };

  useEffect(() => {
    loadAvailability();
  }, [selectedDevelopment, loadAvailability]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadAvailability(true);
    }, 10000); // Poll every 10 seconds for developer updates

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

  const formatTimeAgo = (date: Date | string) => {
    const now = new Date();
    const dateObj = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const filteredProperties = properties.filter(property => {
    if (statusFilter !== 'all' && property.status !== statusFilter) return false;
    if (urgencyFilter !== 'all' && property.urgency !== urgencyFilter) return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        property.unitNumber.toLowerCase().includes(query) ||
        property.propertyId.toLowerCase().includes(query) ||
        property.salesAgent?.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Building className="text-blue-500" />
            Property Availability Manager
          </h1>
          <p className="mt-2 text-gray-600">
            Manage property status, pricing, and track buyer interest in real-time
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
            disabled={refreshing}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Updating...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Development Stats */}
      {developmentStats && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{developmentStats.developmentName} Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{developmentStats.totalUnits}</div>
              <div className="text-sm text-gray-600">Total Units</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{developmentStats.available}</div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{developmentStats.reserved}</div>
              <div className="text-sm text-gray-600">Reserved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{developmentStats.saleAgreed}</div>
              <div className="text-sm text-gray-600">Sale Agreed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{developmentStats.sold}</div>
              <div className="text-sm text-gray-600">Sold</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                €{Math.round(developmentStats.averagePrice / 1000)}K
              </div>
              <div className="text-sm text-gray-600">Avg Price</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <select
              value={selectedDevelopment}
              onChange={(e) => setSelectedDevelopment(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">All Developments</option>
              {developments.map(dev => (
                <option key={dev.id} value={dev.id}>{dev.name}</option>
              ))}
            </select>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search units..."
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
              <option value="WITHDRAWN">Withdrawn</option>
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Property List */}
        <div className="lg:col-span-3 space-y-4">
          {filteredProperties.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <Home className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties Found</h3>
              <p className="text-gray-600">
                No properties match your current filters.
              </p>
            </div>
          ) : (
            filteredProperties.map((property) => (
              <div key={property.propertyId} className="bg-white rounded-lg shadow-sm border p-6">
                {editingProperty === property.propertyId ? (
                  /* Edit Mode */
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Edit Unit {property.unitNumber}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          value={editForm.status}
                          onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        >
                          <option value="AVAILABLE">Available</option>
                          <option value="RESERVED">Reserved</option>
                          <option value="SALE_AGREED">Sale Agreed</option>
                          <option value="SOLD">Sold</option>
                          <option value="WITHDRAWN">Withdrawn</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price (€)
                        </label>
                        <input
                          type="number"
                          value={editForm.price}
                          onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Reason
                        </label>
                        <input
                          type="text"
                          value={editForm.reason}
                          onChange={(e) => setEditForm(prev => ({ ...prev, reason: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          placeholder="Reason for change"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t">
                      <button
                        onClick={handleSaveChanges}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => {
                          setEditingProperty(null);
                          setEditForm({ status: '', price: '', reason: '' });
                        }}
                        className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <div>
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

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Price:</span>
                            <p className="font-medium text-lg">€{property.price.toLocaleString()}</p>
                            {property.priceChangedAt && (
                              <p className="text-xs text-blue-600">
                                Changed {formatTimeAgo(property.priceChangedAt)}
                              </p>
                            )}
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
                            <span className="text-gray-500">Agent:</span>
                            <p className="font-medium">{property.salesAgent || 'Unassigned'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Updated:</span>
                            <p className="font-medium">{formatTimeAgo(property.lastUpdated)}</p>
                          </div>
                        </div>

                        {property.reason && (
                          <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                            <p className="text-sm text-gray-700">{property.reason}</p>
                          </div>
                        )}

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

                      <button
                        onClick={() => handleEditProperty(property)}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit property"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Activity Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Recent Activity
            </h2>
            <div className="space-y-3">
              {recentUpdates.slice(0, 10).map((update, index) => (
                <div key={index} className="border-l-4 border-blue-400 pl-3 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    {update.updateType === 'STATUS_CHANGE' && <CheckCircle className="h-4 w-4 text-blue-500" />}
                    {update.updateType === 'PRICE_CHANGE' && <DollarSign className="h-4 w-4 text-green-500" />}
                    {update.updateType === 'VIEWING_SCHEDULED' && <Eye className="h-4 w-4 text-purple-500" />}
                    {update.updateType === 'INTEREST_UPDATE' && <Heart className="h-4 w-4 text-red-500" />}
                    {update.updateType === 'URGENT_ACTION' && <AlertTriangle className="h-4 w-4 text-orange-500" />}
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>View Analytics</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Users className="h-5 w-5 text-green-600" />
                <span>Buyer Inquiries</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Calendar className="h-5 w-5 text-purple-600" />
                <span>Schedule Viewings</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Settings className="h-5 w-5 text-gray-600" />
                <span>Manage Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}