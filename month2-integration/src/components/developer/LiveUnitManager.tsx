'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Edit3, 
  MoreHorizontal, 
  CheckSquare, 
  Square,
  Home,
  Building,
  MapPin,
  Euro,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  Calendar,
  AlertCircle,
  CheckCircle,
  Eye,
  Settings,
  Trash2,
  Copy,
  RefreshCw,
  BarChart3,
  TrendingUp,
  PieChart
} from 'lucide-react';
import { UnitStatus, Unit } from '@/types/project';
import { fitzgeraldGardensConfig } from '@/data/fitzgerald-gardens-config';
import UnitEditModal from './UnitEditModal';

interface LiveUnitManagerProps {
  units: Unit[];
  onUnitUpdate: (unitId: string, updates: Partial<Unit>) => Promise<boolean>;
  onStatusUpdate: (unitId: string, status: UnitStatus, reason?: string) => Promise<boolean>;
  onPriceUpdate: (unitId: string, price: number, reason?: string) => Promise<boolean>;
  projectId: string;
}

export default function LiveUnitManager({
  units,
  onUnitUpdate,
  onStatusUpdate,
  onPriceUpdate,
  projectId
}: LiveUnitManagerProps) {
  const [selectedUnits, setSelectedUnits] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'table' | 'grid' | 'kanban'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<UnitStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkAction, setBulkAction] = useState<'status' | 'price' | 'export'>('status');
  const [bulkStatusValue, setBulkStatusValue] = useState<UnitStatus>('available');
  const [bulkPriceAdjustment, setBulkPriceAdjustment] = useState('');
  const [priceAdjustmentType, setPriceAdjustmentType] = useState<'amount' | 'percentage'>('percentage');
  
  // Unit edit modal state
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalInitialTab, setModalInitialTab] = useState<'details' | 'buyer' | 'features' | 'media' | 'history' | 'settings'>('details');
  
  // Real data from configuration
  const config = fitzgeraldGardensConfig;

  // Filter and search units
  const filteredUnits = useMemo(() => {
    return units.filter(unit => {
      const matchesSearch = searchTerm === '' || 
        unit.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.buyer?.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || unit.status === statusFilter;
      const matchesType = typeFilter === 'all' || unit.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [units, searchTerm, statusFilter, typeFilter]);

  // Unit statistics
  const unitStats = useMemo(() => {
    const total = units.length;
    const available = units.filter(u => u.status === 'available').length;
    const sold = units.filter(u => u.status === 'sold').length;
    const reserved = units.filter(u => u.status === 'reserved').length;
    const avgPrice = units.reduce((sum, u) => sum + u.pricing.currentPrice, 0) / total;
    const totalRevenue = units.filter(u => u.status === 'sold').reduce((sum, u) => sum + u.pricing.currentPrice, 0);
    
    return { total, available, sold, reserved, avgPrice, totalRevenue };
  }, [units]);

  // Get unique unit types
  const unitTypes = useMemo(() => {
    const types = [...new Set(units.map(u => u.type))];
    return types;
  }, [units]);

  // Handle unit selection
  const handleUnitSelect = (unitId: string) => {
    const newSelection = new Set(selectedUnits);
    if (newSelection.has(unitId)) {
      newSelection.delete(unitId);
    } else {
      newSelection.add(unitId);
    }
    setSelectedUnits(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedUnits.size === filteredUnits.length) {
      setSelectedUnits(new Set());
    } else {
      setSelectedUnits(new Set(filteredUnits.map(u => u.id)));
    }
  };

  // Handle bulk actions
  const applyBulkAction = async () => {
    const selectedUnitsList = Array.from(selectedUnits);
    setIsLoading(true);
    
    try {
      if (bulkAction === 'status') {
        await Promise.all(selectedUnitsList.map(unitId => 
          onStatusUpdate(unitId, bulkStatusValue, 'Bulk status update')
        ));
      } else if (bulkAction === 'price') {
        await Promise.all(selectedUnitsList.map(async unitId => {
          const unit = units.find(u => u.id === unitId);
          if (unit) {
            let newPrice = unit.pricing.currentPrice;
            if (priceAdjustmentType === 'percentage') {
              const adjustment = parseFloat(bulkPriceAdjustment) / 100;
              newPrice = unit.pricing.currentPrice * (1 + adjustment);
            } else {
              newPrice = unit.pricing.currentPrice + parseFloat(bulkPriceAdjustment);
            }
            return onPriceUpdate(unitId, Math.round(newPrice), 'Bulk price adjustment');
          }
        }));
      }
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setIsLoading(false);
      setSelectedUnits(new Set());
      setShowBulkActions(false);
    }
  };

  // Handle unit actions
  const handleEditUnit = (unit: Unit) => {
    setSelectedUnit(unit);
    setModalInitialTab('details');
    setIsEditModalOpen(true);
  };

  const handleViewUnit = (unit: Unit) => {
    // This could open a read-only view or the same modal in view mode
    setSelectedUnit(unit);
    setModalInitialTab('details');
    setIsEditModalOpen(true);
  };

  const handleSettingsUnit = (unit: Unit) => {
    // Open unit-specific settings - open directly to settings tab
    setSelectedUnit(unit);
    setModalInitialTab('settings');
    setIsEditModalOpen(true);
  };

  // Handle buyer assignment (called from modal)
  const handleBuyerAssign = async (unitId: string, buyerData: any): Promise<boolean> => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'buyer_assignment',
          unitId,
          buyerData
        })
      });

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Failed to assign buyer:', error);
      return false;
    }
  };

  const handleCloseModal = () => {
    setSelectedUnit(null);
    setIsEditModalOpen(false);
  };

  const getStatusColor = (status: UnitStatus) => {
    switch (status) {
      case 'available': return 'bg-blue-100 text-blue-800';
      case 'reserved': return 'bg-amber-100 text-amber-800';
      case 'sold': return 'bg-green-100 text-green-800';
      case 'held': return 'bg-purple-100 text-purple-800';
      case 'withdrawn': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Statistics */}
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Live Unit Management</h2>
            <p className="text-gray-600">Real-time unit status and pricing management for {config.projectName}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50">
              <RefreshCw size={16} />
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Download size={16} />
              Export
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Upload size={16} />
              Import
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-xl font-bold text-blue-600">{unitStats.total}</div>
            <div className="text-sm text-blue-600">Total Units</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-xl font-bold text-green-600">{unitStats.sold}</div>
            <div className="text-sm text-green-600">Sold</div>
          </div>
          <div className="text-center p-3 bg-amber-50 rounded-lg">
            <div className="text-xl font-bold text-amber-600">{unitStats.reserved}</div>
            <div className="text-sm text-amber-600">Reserved</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-xl font-bold text-blue-600">{unitStats.available}</div>
            <div className="text-sm text-blue-600">Available</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-xl font-bold text-purple-600">€{Math.round(unitStats.avgPrice).toLocaleString()}</div>
            <div className="text-sm text-purple-600">Avg. Price</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search units by number, type, or buyer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as UnitStatus | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
            <option value="held">Held</option>
            <option value="withdrawn">Withdrawn</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            {unitTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                viewMode === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
              }`}
            >
              <FileText size={16} className="inline mr-1" />
              Table
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
              }`}
            >
              <Home size={16} className="inline mr-1" />
              Grid
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                viewMode === 'kanban' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
              }`}
            >
              <BarChart3 size={16} className="inline mr-1" />
              Kanban
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUnits.size > 0 && (
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium text-blue-800">
              {selectedUnits.size} unit{selectedUnits.size > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => setShowBulkActions(!showBulkActions)}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Bulk Actions
            </button>
            <button
              onClick={() => setSelectedUnits(new Set())}
              className="px-3 py-1 border border-blue-300 text-blue-600 rounded text-sm hover:bg-blue-100"
            >
              Clear Selection
            </button>
          </div>
        )}

        {/* Bulk Actions Panel */}
        {showBulkActions && selectedUnits.size > 0 && (
          <div className="mt-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value as 'status' | 'price' | 'export')}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="status">Update Status</option>
                <option value="price">Adjust Pricing</option>
                <option value="export">Export Selected</option>
              </select>

              {bulkAction === 'status' && (
                <select
                  value={bulkStatusValue}
                  onChange={(e) => setBulkStatusValue(e.target.value as UnitStatus)}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="sold">Sold</option>
                  <option value="held">Held</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
              )}

              {bulkAction === 'price' && (
                <div className="flex items-center gap-2">
                  <select
                    value={priceAdjustmentType}
                    onChange={(e) => setPriceAdjustmentType(e.target.value as 'amount' | 'percentage')}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="amount">Fixed Amount</option>
                  </select>
                  <input
                    type="number"
                    step="0.1"
                    placeholder={priceAdjustmentType === 'percentage' ? '5.0' : '10000'}
                    value={bulkPriceAdjustment}
                    onChange={(e) => setBulkPriceAdjustment(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg w-24"
                  />
                  <span className="text-sm text-gray-600">
                    {priceAdjustmentType === 'percentage' ? '%' : '€'}
                  </span>
                </div>
              )}

              <button
                onClick={applyBulkAction}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Apply to {selectedUnits.size} unit{selectedUnits.size > 1 ? 's' : ''}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <button onClick={handleSelectAll} className="text-gray-400 hover:text-gray-600">
                      {selectedUnits.size === filteredUnits.length && filteredUnits.length > 0 ? (
                        <CheckSquare size={16} />
                      ) : (
                        <Square size={16} />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Buyer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUnits.map((unit) => (
                  <tr key={unit.id} className={`hover:bg-gray-50 ${selectedUnits.has(unit.id) ? 'bg-blue-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => handleUnitSelect(unit.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {selectedUnits.has(unit.id) ? (
                          <CheckSquare size={16} className="text-blue-600" />
                        ) : (
                          <Square size={16} />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Home size={16} className="text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">Unit {unit.number}</div>
                          <div className="text-sm text-gray-500">Floor {unit.features.floor}, Building {unit.features.building}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {unit.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(unit.status)}`}>
                        {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      €{unit.pricing.currentPrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {unit.buyer ? (
                        <div>
                          <div className="font-medium text-gray-900">{unit.buyer.name}</div>
                          <div className="text-gray-500">{unit.buyer.solicitor}</div>
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(unit.lastUpdated).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleViewUnit(unit)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                          title="View Unit Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleEditUnit(unit)}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                          title="Edit Unit"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => handleSettingsUnit(unit)}
                          className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50 transition-colors"
                          title="Unit Settings"
                        >
                          <Settings size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredUnits.map((unit) => (
            <div 
              key={unit.id} 
              className={`bg-white border rounded-lg p-4 hover:shadow-md transition-shadow ${
                selectedUnits.has(unit.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <button 
                  onClick={() => handleUnitSelect(unit.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {selectedUnits.has(unit.id) ? (
                    <CheckSquare size={16} className="text-blue-600" />
                  ) : (
                    <Square size={16} />
                  )}
                </button>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(unit.status)}`}>
                  {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
                </span>
              </div>
              
              <div className="mb-3">
                <h4 className="font-semibold text-gray-900">Unit {unit.number}</h4>
                <p className="text-sm text-gray-600">{unit.type}</p>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <DollarSign size={14} />
                  <span>€{unit.pricing.currentPrice.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building size={14} />
                  <span>Floor {unit.features.floor}, Building {unit.features.building}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Home size={14} />
                  <span>{unit.features.bedrooms} bed, {unit.features.bathrooms} bath</span>
                </div>
              </div>
              
              {unit.buyer && (
                <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                  <p className="font-medium">{unit.buyer.name}</p>
                  <p className="text-gray-500">{unit.buyer.solicitor}</p>
                </div>
              )}
              
              <div className="mt-3 pt-3 border-t flex justify-center gap-2">
                <button 
                  onClick={() => handleViewUnit(unit)}
                  className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                  title="View Unit Details"
                >
                  <Eye size={14} />
                </button>
                <button 
                  onClick={() => handleEditUnit(unit)}
                  className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                  title="Edit Unit"
                >
                  <Edit3 size={14} />
                </button>
                <button 
                  onClick={() => handleSettingsUnit(unit)}
                  className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50 transition-colors"
                  title="Unit Settings"
                >
                  <Settings size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {['available', 'reserved', 'sold', 'held', 'withdrawn'].map((status) => {
            const statusUnits = filteredUnits.filter(u => u.status === status);
            return (
              <div key={status} className="bg-white rounded-lg border">
                <div className="p-4 border-b">
                  <h3 className="font-semibold text-gray-900 capitalize">{status}</h3>
                  <p className="text-sm text-gray-600">{statusUnits.length} units</p>
                </div>
                <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                  {statusUnits.map((unit) => (
                    <div 
                      key={unit.id}
                      className={`p-3 border rounded-lg hover:shadow-sm transition-shadow cursor-pointer ${
                        selectedUnits.has(unit.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                      }`}
                      onClick={() => handleUnitSelect(unit.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">Unit {unit.number}</h4>
                        {selectedUnits.has(unit.id) ? (
                          <CheckSquare size={16} className="text-blue-600" />
                        ) : (
                          <Square size={16} className="text-gray-400" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{unit.type}</p>
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Euro size={12} />
                          <span>€{unit.pricing.currentPrice.toLocaleString()}</span>
                        </div>
                        {unit.buyer && (
                          <div className="mt-1">
                            <div className="flex items-center gap-1">
                              <User size={12} />
                              <span className="truncate">{unit.buyer.name}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-2 pt-2 border-t flex justify-center gap-1">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewUnit(unit);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                          title="View Unit Details"
                        >
                          <Eye size={12} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditUnit(unit);
                          }}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                          title="Edit Unit"
                        >
                          <Edit3 size={12} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSettingsUnit(unit);
                          }}
                          className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50 transition-colors"
                          title="Unit Settings"
                        >
                          <Settings size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Results Summary */}
      <div className="text-center text-sm text-gray-600">
        Showing {filteredUnits.length} of {units.length} units
        {selectedUnits.size > 0 && (
          <span className="ml-2 text-blue-600 font-medium">
            • {selectedUnits.size} selected
          </span>
        )}
      </div>

      {/* Unit Edit Modal */}
      <UnitEditModal
        unit={selectedUnit}
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        onSave={onUnitUpdate}
        onStatusUpdate={onStatusUpdate}
        onPriceUpdate={onPriceUpdate}
        onBuyerAssign={handleBuyerAssign}
        projectId={projectId}
        initialTab={modalInitialTab}
      />
    </div>
  );
}