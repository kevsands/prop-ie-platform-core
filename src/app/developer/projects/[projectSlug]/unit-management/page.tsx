'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  Building2, 
  Edit3, 
  Trash2, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Eye,
  DollarSign,
  Calendar,
  Users,
  Home,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Settings,
  Save,
  X,
  MoreHorizontal,
  RefreshCw,
  Image
} from 'lucide-react';

interface Unit {
  id: string;
  number: string;
  type: string;
  status: 'available' | 'reserved' | 'sold' | 'held';
  pricing: {
    basePrice: number;
    currentPrice: number;
  };
  physical: {
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    sqm: number;
    floor: number;
    building: number;
  };
  buyer?: {
    name: string;
    email: string;
    phone: string;
  };
  reservationDate?: string;
  saleDate?: string;
}

export default function UnitManagementPage() {
  const params = useParams();
  const projectSlug = params.projectSlug as string;
  
  const [project, setProject] = useState<any>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedUnits, setSelectedUnits] = useState<Set<string>>(new Set());
  const [showAddUnit, setShowAddUnit] = useState(false);

  // Load project and units data
  useEffect(() => {
    const loadProject = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/projects/${projectSlug}`);
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setProject(result.data);
            setUnits(result.data.units || []);
            setFilteredUnits(result.data.units || []);
            console.log('✅ Project loaded successfully:', result.data.name);
          } else {
            setError('Failed to load project data');
          }
        } else {
          setError('Project not found');
        }
      } catch (err) {
        console.error('Error loading project:', err);
        setError('Failed to load project');
      } finally {
        setIsLoading(false);
      }
    };

    if (projectSlug) {
      loadProject();
    }
  }, [projectSlug]);

  // Filter units based on search and status
  useEffect(() => {
    let filtered = units;
    
    if (searchTerm) {
      filtered = filtered.filter(unit => 
        unit.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.buyer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(unit => unit.status === statusFilter);
    }
    
    setFilteredUnits(filtered);
  }, [units, searchTerm, statusFilter]);

  // Enhanced CRUD Operations with real backend sync
  const updateUnit = async (unitId: string, updates: Partial<Unit>) => {
    try {
      // First update local state for immediate UI feedback
      const optimisticUpdatedUnits = units.map(unit => 
        unit.id === unitId ? { ...unit, ...updates } : unit
      );
      setUnits(optimisticUpdatedUnits);
      
      // Try the developer API endpoint first
      let response = await fetch(`/api/projects/${projectSlug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'unit_update',
          unitId: unitId,
          updates: updates,
          timestamp: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        // Fallback to unit-specific endpoint
        response = await fetch(`/api/projects/${projectSlug}/units/${unitId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
      }
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          // Update with server response to ensure consistency
          setProject(result.data);
          setUnits(result.data.units || []);
          setFilteredUnits(result.data.units || []);
        }
        console.log('✅ Unit updated successfully:', updates);
        
        // Force refresh buyer pages by clearing any caches
        await fetch(`/api/units/refresh`, { method: 'POST' });
      } else {
        // Revert optimistic update on failure
        setUnits(units);
        console.error('❌ Failed to update unit');
        alert('Failed to update unit. Please try again.');
      }
    } catch (err) {
      // Revert optimistic update on error
      setUnits(units);
      console.error('Error updating unit:', err);
      alert('Error updating unit. Please check your connection.');
    }
  };

  const deleteUnit = async (unitId: string) => {
    if (confirm('Are you sure you want to delete this unit?')) {
      try {
        const response = await fetch(`/api/projects/${projectSlug}/units/${unitId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setUnits(units.filter(unit => unit.id !== unitId));
          console.log('✅ Unit deleted successfully');
        }
      } catch (err) {
        console.error('Error deleting unit:', err);
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return CheckCircle;
      case 'reserved': return AlertTriangle;
      case 'sold': return XCircle;
      case 'held': return Settings;
      default: return Home;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-100';
      case 'reserved': return 'text-yellow-600 bg-yellow-100';
      case 'sold': return 'text-red-600 bg-red-100';
      case 'held': return 'text-gray-600 bg-gray-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading unit management...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <p className="text-gray-600">Project Slug: {projectSlug}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Unit Management</h2>
          <p className="text-gray-600 mt-1">Manage all units for {project.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw size={16} />
            Refresh Data
          </button>
          <button
            onClick={() => setShowAddUnit(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={16} />
            Add Unit
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download size={16} />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Upload size={16} />
            Import
          </button>
          <button
            onClick={() => window.open(`/developments/${projectSlug}/units`, '_blank')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Eye size={16} />
            View Buyer Side
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Units</p>
              <p className="text-2xl font-bold text-gray-900">{units.length}</p>
            </div>
            <Building2 className="w-10 h-10 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-2xl font-bold text-green-600">
                {units.filter(u => u.status === 'available').length}
              </p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Reserved</p>
              <p className="text-2xl font-bold text-yellow-600">
                {units.filter(u => u.status === 'reserved').length}
              </p>
            </div>
            <AlertTriangle className="w-10 h-10 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sold</p>
              <p className="text-2xl font-bold text-red-600">
                {units.filter(u => u.status === 'sold').length}
              </p>
            </div>
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search units by number, type, or buyer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
            <option value="held">Held</option>
          </select>
          <button
            onClick={() => setShowBulkActions(!showBulkActions)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Settings size={16} />
            Bulk Actions
          </button>
        </div>
      </div>

      {/* Units Table */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">
            Units ({filteredUnits.length} of {units.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Buyer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUnits.map((unit) => {
                const StatusIcon = getStatusIcon(unit.status);
                return (
                  <tr key={unit.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">Unit {unit.number}</div>
                      <div className="text-sm text-gray-500">Floor {unit.physical?.floor || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(unit.status)}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {unit.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {unit.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{unit.physical?.bedrooms || 0} bed • {unit.physical?.bathrooms || 0} bath</div>
                      <div>{unit.physical?.sqm || unit.physical?.sqft || 0} m² • Building {unit.physical?.building || 'N/A'}</div>
                      <div className="text-xs text-gray-400">Aspect: {unit.physical?.aspect || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        €{unit.pricing?.currentPrice?.toLocaleString() || 'TBC'}
                      </div>
                      {unit.pricing?.basePrice !== unit.pricing?.currentPrice && (
                        <div className="text-xs text-gray-500">
                          Base: €{unit.pricing?.basePrice?.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {unit.buyer ? (
                        <div>
                          <div className="font-medium text-gray-900">{unit.buyer.name}</div>
                          <div>{unit.buyer.email}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">No buyer</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingUnit(unit)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => deleteUnit(unit.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comprehensive Edit Unit Modal */}
      {editingUnit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Edit Unit {editingUnit.number} - Complete Property Details</h2>
                <button
                  onClick={() => setEditingUnit(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Unit Basic Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Building2 size={20} />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Unit Number</label>
                    <input
                      type="text"
                      value={editingUnit.number}
                      onChange={(e) => setEditingUnit({...editingUnit, number: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Unit Type</label>
                    <select
                      value={editingUnit.type}
                      onChange={(e) => setEditingUnit({...editingUnit, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="duplex">Duplex</option>
                      <option value="penthouse">Penthouse</option>
                      <option value="townhouse">Townhouse</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={editingUnit.status}
                      onChange={(e) => setEditingUnit({...editingUnit, status: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="available">Available</option>
                      <option value="reserved">Reserved</option>
                      <option value="sold">Sold</option>
                      <option value="held">Held</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Physical Specifications */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Home size={20} />
                  Physical Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                    <input
                      type="number"
                      min="0"
                      value={editingUnit.physical?.bedrooms || 0}
                      onChange={(e) => setEditingUnit({
                        ...editingUnit,
                        physical: {...editingUnit.physical, bedrooms: parseInt(e.target.value) || 0}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={editingUnit.physical?.bathrooms || 0}
                      onChange={(e) => setEditingUnit({
                        ...editingUnit,
                        physical: {...editingUnit.physical, bathrooms: parseFloat(e.target.value) || 0}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Square Feet</label>
                    <input
                      type="number"
                      min="0"
                      value={editingUnit.physical?.sqft || 0}
                      onChange={(e) => setEditingUnit({
                        ...editingUnit,
                        physical: {...editingUnit.physical, sqft: parseInt(e.target.value) || 0}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Square Meters</label>
                    <input
                      type="number"
                      min="0"
                      value={editingUnit.physical?.sqm || 0}
                      onChange={(e) => setEditingUnit({
                        ...editingUnit,
                        physical: {...editingUnit.physical, sqm: parseInt(e.target.value) || 0}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Floor</label>
                    <input
                      type="number"
                      min="0"
                      value={editingUnit.physical?.floor || 0}
                      onChange={(e) => setEditingUnit({
                        ...editingUnit,
                        physical: {...editingUnit.physical, floor: parseInt(e.target.value) || 0}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Building</label>
                    <input
                      type="text"
                      value={editingUnit.physical?.building || ''}
                      onChange={(e) => setEditingUnit({
                        ...editingUnit,
                        physical: {...editingUnit.physical, building: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Aspect</label>
                    <select
                      value={editingUnit.physical?.aspect || 'N'}
                      onChange={(e) => setEditingUnit({
                        ...editingUnit,
                        physical: {...editingUnit.physical, aspect: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="N">North</option>
                      <option value="S">South</option>
                      <option value="E">East</option>
                      <option value="W">West</option>
                      <option value="NE">North East</option>
                      <option value="NW">North West</option>
                      <option value="SE">South East</option>
                      <option value="SW">South West</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Parking Spaces</label>
                    <input
                      type="number"
                      min="0"
                      value={editingUnit.parking || 0}
                      onChange={(e) => setEditingUnit({
                        ...editingUnit,
                        parking: parseInt(e.target.value) || 0
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <DollarSign size={20} />
                  Pricing Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Base Price (€)</label>
                    <input
                      type="number"
                      min="0"
                      value={editingUnit.pricing?.basePrice || 0}
                      onChange={(e) => setEditingUnit({
                        ...editingUnit,
                        pricing: {...editingUnit.pricing, basePrice: parseInt(e.target.value) || 0}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Price (€)</label>
                    <input
                      type="number"
                      min="0"
                      value={editingUnit.pricing?.currentPrice || 0}
                      onChange={(e) => setEditingUnit({
                        ...editingUnit,
                        pricing: {...editingUnit.pricing, currentPrice: parseInt(e.target.value) || 0}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reservation Deposit (€)</label>
                    <input
                      type="number"
                      min="0"
                      value={editingUnit.pricing?.reservationDeposit || 0}
                      onChange={(e) => setEditingUnit({
                        ...editingUnit,
                        pricing: {...editingUnit.pricing, reservationDeposit: parseInt(e.target.value) || 0}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Features & Amenities */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Settings size={20} />
                  Features & Amenities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Unit Features</label>
                    <textarea
                      rows={4}
                      value={editingUnit.features?.join('\n') || ''}
                      onChange={(e) => setEditingUnit({
                        ...editingUnit,
                        features: e.target.value.split('\n').filter(f => f.trim())
                      })}
                      placeholder="Enter one feature per line&#10;e.g.:&#10;Energy A-rated&#10;Double glazing&#10;Hardwood floors"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">One feature per line</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Building Amenities</label>
                    <textarea
                      rows={4}
                      value={editingUnit.amenities?.join('\n') || ''}
                      onChange={(e) => setEditingUnit({
                        ...editingUnit,
                        amenities: e.target.value.split('\n').filter(a => a.trim())
                      })}
                      placeholder="Enter one amenity per line&#10;e.g.:&#10;Landscaped grounds&#10;Secure access&#10;Gym facility"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">One amenity per line</p>
                  </div>
                </div>
              </div>

              {/* Images & Media */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Image size={20} />
                  Images & Media
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image URLs</label>
                    <textarea
                      rows={3}
                      value={editingUnit.images?.join('\n') || ''}
                      onChange={(e) => setEditingUnit({
                        ...editingUnit,
                        images: e.target.value.split('\n').filter(img => img.trim())
                      })}
                      placeholder="Enter one image URL per line"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Floor Plan URL</label>
                    <input
                      type="text"
                      value={editingUnit.floorPlan || ''}
                      onChange={(e) => setEditingUnit({...editingUnit, floorPlan: e.target.value})}
                      placeholder="/plans/unit-floorplan.pdf"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Buyer Information (if sold/reserved) */}
              {(editingUnit.status === 'sold' || editingUnit.status === 'reserved') && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Users size={20} />
                    Buyer Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Buyer Name</label>
                      <input
                        type="text"
                        value={editingUnit.buyer?.name || ''}
                        onChange={(e) => setEditingUnit({
                          ...editingUnit,
                          buyer: {...editingUnit.buyer, name: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Buyer Email</label>
                      <input
                        type="email"
                        value={editingUnit.buyer?.email || ''}
                        onChange={(e) => setEditingUnit({
                          ...editingUnit,
                          buyer: {...editingUnit.buyer, email: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Buyer Phone</label>
                      <input
                        type="tel"
                        value={editingUnit.buyer?.phone || ''}
                        onChange={(e) => setEditingUnit({
                          ...editingUnit,
                          buyer: {...editingUnit.buyer, phone: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Reservation Date</label>
                      <input
                        type="date"
                        value={editingUnit.reservationDate || ''}
                        onChange={(e) => setEditingUnit({...editingUnit, reservationDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sale Date</label>
                      <input
                        type="date"
                        value={editingUnit.saleDate || ''}
                        onChange={(e) => setEditingUnit({...editingUnit, saleDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-3 pt-6 border-t">
                <button
                  onClick={() => setEditingUnit(null)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    updateUnit(editingUnit.id, editingUnit);
                    setEditingUnit(null);
                  }}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Save size={16} />
                  Save All Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}