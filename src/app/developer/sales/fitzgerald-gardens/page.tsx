'use client';

import React, { useState, useCallback, useRef } from 'react';
import useProjectData from '@/hooks/useProjectData';
import { metricsEngine } from '@/services/MetricsCalculationEngine';
import { logger } from '@/lib/security/auditLogger';
import { realTimeDataSyncService } from '@/services/RealTimeDataSyncService';
import { useEnterpriseAuth } from '@/context/EnterpriseAuthContext';
import { authService } from '@/lib/auth/AuthService';
import { 
  Building2, 
  Home, 
  Edit, 
  Eye, 
  Save,
  X,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  MapPin,
  DollarSign,
  Calendar,
  User,
  FileText,
  Camera,
  Layout,
  CheckCircle,
  Clock,
  AlertTriangle,
  Phone,
  Mail,
  Briefcase,
  ChevronDown,
  ChevronRight,
  Upload,
  Download,
  Copy,
  Trash2,
  RefreshCw,
  Zap,
  Target,
  Settings,
  Loader2
} from 'lucide-react';
import { UnitStatus } from '@/types/project';

export default function FitzgeraldGardensSalesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [isEditingUnit, setIsEditingUnit] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<UnitStatus | 'all'>('all');
  const [editingTab, setEditingTab] = useState<'details' | 'media' | 'floorplans' | 'sales' | 'legal'>('details');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Enterprise Authentication
  const { user, isAuthenticated, hasRole } = useEnterpriseAuth();

  // Enterprise data integration
  const {
    project,
    units,
    totalUnits,
    soldUnits,
    reservedUnits,
    availableUnits,
    isLoading,
    lastUpdated,
    updateUnitStatus,
    updateUnitPrice,
    getUnitById,
    refreshData
  } = useProjectData('fitzgerald-gardens');

  // Filter units based on search and status
  const filteredUnits = units.filter(unit => {
    const matchesSearch = unit.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         unit.buyer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         unit.buyer?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || unit.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: UnitStatus) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'reserved': return 'bg-blue-100 text-blue-800';
      case 'sold': return 'bg-purple-100 text-purple-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      case 'withdrawn': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Use unified formatting for consistency across all routes
  const formatCurrency = metricsEngine.formatCurrency.bind(metricsEngine);

  const handleStatusChange = async (unitId: string, newStatus: UnitStatus) => {
    await updateUnitStatus(unitId, newStatus, `Status changed to ${newStatus} by developer`);
  };

  // Enterprise-grade unit save functionality
  const handleUnitSave = useCallback(async (unitId: string, formData: any) => {
    try {
      setIsSaving(true);
      setSaveError(null);
      setSaveSuccess(false);

      // Get current unit for comparison
      const currentUnit = getUnitById(unitId);
      if (!currentUnit) {
        throw new Error('Unit not found');
      }

      // Enterprise business rule validation
      const validationErrors = validateUnitData(formData, currentUnit);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      // Prepare update payload with comprehensive data structure
      const updatePayload = {
        type: 'unit_update',
        unitId,
        updates: {
          // Basic details
          number: formData.number || currentUnit.number,
          type: formData.type || currentUnit.type,
          
          // Features
          features: {
            bedrooms: parseInt(formData.bedrooms) || currentUnit.features.bedrooms,
            bathrooms: parseInt(formData.bathrooms) || currentUnit.features.bathrooms,
            sqft: parseInt(formData.floorArea) || currentUnit.features.sqft,
            building: formData.building || currentUnit.features.building,
            floor: currentUnit.features.floor
          },
          
          // Pricing
          pricing: {
            basePrice: parseFloat(formData.currentPrice) || currentUnit.pricing.currentPrice,
            currentPrice: parseFloat(formData.currentPrice) || currentUnit.pricing.currentPrice
          },
          
          // Status
          status: formData.status || currentUnit.status,
          
          // Buyer information (if provided)
          ...(formData.buyerName && {
            buyer: {
              name: formData.buyerName,
              email: formData.buyerEmail,
              phone: formData.buyerPhone,
              solicitor: formData.buyerSolicitor
            }
          }),
          
          // Audit trail with real user
          updatedAt: new Date().toISOString(),
          updatedBy: user?.email || user?.username || 'Unknown User',
          userId: user?.id
        },
        reason: 'Unit details updated via developer portal'
      };

      // Call enterprise API endpoint with proper authentication
      let headers: any = {
        'Content-Type': 'application/json'
      };
      
      // Add auth token if not in bypass mode
      if (!DEV_BYPASS_AUTH) {
        const token = await authService.getAccessToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }
      
      const response = await fetch(`/api/projects/fitzgerald-gardens`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(updatePayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save unit');
      }

      const result = await response.json();
      
      if (result.success) {
        // Enterprise audit logging with actual user
        logger.info('Unit updated via developer portal', {
          unitId,
          updates: Object.keys(updatePayload.updates),
          updatedBy: DEV_BYPASS_AUTH ? 'Development Testing User' : (user?.email || user?.username || 'Unknown User'),
          userId: DEV_BYPASS_AUTH ? 'dev-test-user' : user?.id,
          userRole: DEV_BYPASS_AUTH ? 'DEVELOPER' : user?.role,
          developmentMode: DEV_BYPASS_AUTH,
          timestamp: new Date().toISOString()
        });

        // Real-time sync to buyer platform and other stakeholders
        realTimeDataSyncService.broadcastUnitUpdate(
          'fitzgerald-gardens',
          unitId,
          updatePayload.updates,
          DEV_BYPASS_AUTH ? 'Development Testing User' : (user?.email || user?.username || 'Unknown User')
        );

        // Refresh local data to ensure consistency
        refreshData();
        
        setSaveSuccess(true);
        
        // Auto-close edit mode after successful save
        setTimeout(() => {
          setIsEditingUnit(false);
          setSaveSuccess(false);
        }, 1500);
        
        console.log(`✅ Unit ${currentUnit.number} saved successfully with enterprise audit trail`);
      } else {
        throw new Error(result.error || 'Save operation failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setSaveError(errorMessage);
      
      // Enterprise error logging
      logger.error('Unit save failed', {
        unitId,
        error: errorMessage,
        timestamp: new Date().toISOString()
      });
      
      console.error('❌ Unit save failed:', errorMessage);
    } finally {
      setIsSaving(false);
    }
  }, [getUnitById, refreshData]);

  // Enterprise business rule validation
  const validateUnitData = (formData: any, currentUnit: any): string[] => {
    const errors: string[] = [];

    // Unit number validation
    if (!formData.number || formData.number.trim() === '') {
      errors.push('Unit number is required');
    }

    // Bedroom/bathroom validation
    if (formData.bedrooms < 0 || formData.bedrooms > 10) {
      errors.push('Bedrooms must be between 0 and 10');
    }
    if (formData.bathrooms < 0 || formData.bathrooms > 10) {
      errors.push('Bathrooms must be between 0 and 10');
    }

    // Floor area validation
    if (formData.floorArea < 100 || formData.floorArea > 5000) {
      errors.push('Floor area must be between 100 and 5000 sq ft');
    }

    // Price validation
    if (formData.currentPrice < 50000 || formData.currentPrice > 2000000) {
      errors.push('Price must be between €50,000 and €2,000,000');
    }

    // Price increase validation (enterprise rule: >10% increase requires approval)
    const currentPrice = currentUnit.pricing?.currentPrice || 0;
    const priceIncrease = ((formData.currentPrice - currentPrice) / currentPrice) * 100;
    if (priceIncrease > 10) {
      errors.push('Price increases over 10% require management approval');
    }

    // Status transition validation
    const validTransitions: { [key: string]: string[] } = {
      available: ['reserved', 'on-hold', 'withdrawn'],
      reserved: ['sold', 'available', 'withdrawn'],
      sold: [], // Sold units cannot change status
      'on-hold': ['available', 'withdrawn'],
      withdrawn: ['available']
    };

    const currentStatus = currentUnit.status;
    const newStatus = formData.status;
    if (currentStatus !== newStatus) {
      const allowedTransitions = validTransitions[currentStatus] || [];
      if (!allowedTransitions.includes(newStatus)) {
        errors.push(`Cannot change status from ${currentStatus} to ${newStatus}`);
      }
    }

    // Buyer information validation (when status is reserved or sold)
    if ((formData.status === 'reserved' || formData.status === 'sold') && 
        (!formData.buyerName || !formData.buyerEmail)) {
      errors.push('Buyer name and email are required when unit is reserved or sold');
    }

    // Email validation
    if (formData.buyerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.buyerEmail)) {
      errors.push('Please enter a valid email address');
    }

    return errors;
  };

  // Authentication and permission checks
  // 🔧 DEVELOPMENT TESTING MODE - Remove for production
  const DEV_BYPASS_AUTH = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === 'true';
  
  if (!isAuthenticated && !DEV_BYPASS_AUTH) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-red-800 mb-2">Authentication Required</h2>
            <p className="text-red-600 mb-4">
              You must be signed in to access the developer sales portal.
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => window.location.href = '/auth/signin'}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors w-full"
              >
                Sign In
              </button>
              {process.env.NODE_ENV === 'development' && (
                <div className="text-xs text-gray-500 border-t pt-3">
                  <p>🔧 Development Mode:</p>
                  <p>Add NEXT_PUBLIC_DEV_BYPASS_AUTH=true to .env.local to test save functionality</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!DEV_BYPASS_AUTH && !hasRole('DEVELOPER') && !hasRole('ADMIN') && !hasRole('PROJECT_MANAGER') && !hasRole('SALES_MANAGER')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <AlertTriangle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">Insufficient Permissions</h2>
            <p className="text-yellow-600 mb-4">
              You don't have the required permissions to access the sales management portal.
            </p>
            <div className="text-sm text-yellow-700">
              <p><strong>Your Role:</strong> {user?.role || 'None'}</p>
              <p><strong>Required:</strong> Developer, Admin, Project Manager, or Sales Manager</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Fitzgerald Gardens sales data...</p>
          <p className="text-sm text-gray-500 mt-2">
            {DEV_BYPASS_AUTH ? '🔧 Development Mode - Auth Bypassed' : `Authenticated as: ${user?.email}`}
          </p>
        </div>
      </div>
    );
  }

  const selectedUnitData = selectedUnit ? getUnitById(selectedUnit) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-600" />
            Fitzgerald Gardens - Sales Management
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
              LIVE PRODUCTION
            </span>
          </h1>
          <p className="text-gray-600 mt-1">
            PHASE 1 LAUNCH: 15 units available for sale. Total project: 96 units, Phase 1: 27 units built.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download size={16} />
            Export
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus size={16} />
            Add Unit
          </button>
        </div>
      </div>

      {/* Real-time Status */}
      {lastUpdated && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-900">Live Unit Data</span>
              <span className="text-xs text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-green-600">
                <Zap size={16} />
                Real-time
              </div>
              <div className="text-gray-600">{totalUnits} total units</div>
              <div className="text-green-600">{soldUnits} sold</div>
              <div className="text-blue-600">{reservedUnits} reserved</div>
              <div className="text-orange-600">{availableUnits} available</div>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search units, buyers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as UnitStatus | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
              <option value="on-hold">On Hold</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Units List */}
        <div className="lg:col-span-2">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredUnits.map((unit) => (
                <div 
                  key={unit.id} 
                  className={`bg-white rounded-lg border shadow-sm p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedUnit === unit.id ? 'ring-2 ring-blue-500 border-blue-500' : ''
                  }`}
                  onClick={() => setSelectedUnit(unit.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">Unit {unit.number}</h3>
                      <p className="text-sm text-gray-500">{unit.type} • Building {unit.features.building}, Floor {unit.features.floor}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(unit.status)}`}>
                      {unit.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium">{formatCurrency(unit.pricing.currentPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Size:</span>
                      <span className="font-medium">{unit.features.floorArea} sq ft</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Beds/Baths:</span>
                      <span className="font-medium">{unit.features.bedrooms}B/{unit.features.bathrooms}Ba</span>
                    </div>
                  </div>

                  {unit.buyer && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-gray-600">Buyer:</p>
                      <p className="text-sm font-medium text-gray-900">{unit.buyer.name}</p>
                      <p className="text-xs text-gray-500">{unit.buyer.email}</p>
                    </div>
                  )}

                  <div className="mt-3 flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedUnit(unit.id);
                        setIsEditingUnit(true);
                      }}
                      className="flex-1 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      <Edit className="h-3 w-3 inline mr-1" />
                      Edit
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedUnit(unit.id);
                      }}
                      className="flex-1 px-3 py-1 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                    >
                      <Eye className="h-3 w-3 inline mr-1" />
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUnits.map((unit) => (
                    <tr 
                      key={unit.id} 
                      className={`hover:bg-gray-50 cursor-pointer ${
                        selectedUnit === unit.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedUnit(unit.id)}
                    >
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium text-gray-900">Unit {unit.number}</div>
                          <div className="text-sm text-gray-500">{unit.type} • {unit.features.bedrooms}B/{unit.features.bathrooms}Ba</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(unit.status)}`}>
                          {unit.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{formatCurrency(unit.pricing.currentPrice)}</td>
                      <td className="px-4 py-3">
                        {unit.buyer ? (
                          <div>
                            <div className="font-medium text-gray-900">{unit.buyer.name}</div>
                            <div className="text-sm text-gray-500">{unit.buyer.email}</div>
                          </div>
                        ) : (
                          <span className="text-gray-500">No buyer</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedUnit(unit.id);
                              setIsEditingUnit(true);
                            }}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedUnit(unit.id);
                            }}
                            className="text-gray-600 hover:text-gray-700"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Unit Details Panel */}
        <div className="bg-white rounded-lg border shadow-sm">
          {selectedUnitData ? (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Unit {selectedUnitData.number}
                </h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsEditingUnit(!isEditingUnit)}
                    className={`px-3 py-1 text-sm rounded ${
                      isEditingUnit 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    {isEditingUnit ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {isEditingUnit ? (
                <UnitEditForm 
                  unit={selectedUnitData} 
                  activeTab={editingTab}
                  setActiveTab={setEditingTab}
                  onSave={(formData) => handleUnitSave(selectedUnit, formData)}
                  onCancel={() => {
                    setIsEditingUnit(false);
                    setSaveError(null);
                    setSaveSuccess(false);
                  }}
                  isSaving={isSaving}
                  saveError={saveError}
                  saveSuccess={saveSuccess}
                />
              ) : (
                <UnitDetailsView unit={selectedUnitData} />
              )}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Select a unit to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Unit Details View Component
function UnitDetailsView({ unit }: { unit: any }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Unit Information</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Price:</span>
            <span className="font-medium">{formatCurrency(unit.pricing.currentPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="font-medium capitalize">{unit.status.replace('-', ' ')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Bedrooms:</span>
            <span className="font-medium">{unit.features.bedrooms}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Bathrooms:</span>
            <span className="font-medium">{unit.features.bathrooms}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Floor Area:</span>
            <span className="font-medium">{unit.features.floorArea} sq ft</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Last Updated:</span>
            <span className="font-medium">{new Date(unit.lastUpdated).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Features */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Unit Features</h4>
        <div className="grid grid-cols-2 gap-2">
          {(unit.features?.features || unit.features || []).map((feature: string, index: number) => (
            <div key={index} className="flex items-center text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              {feature}
            </div>
          ))}
        </div>
      </div>

      {/* Buyer Info */}
      {unit.buyer && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Buyer Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <User className="h-4 w-4 text-gray-400 mr-2" />
              <span>{unit.buyer.name}</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 text-gray-400 mr-2" />
              <span>{unit.buyer.email}</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 text-gray-400 mr-2" />
              <span>{unit.buyer.phone}</span>
            </div>
            <div className="flex items-center">
              <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
              <span>{unit.buyer.solicitor}</span>
            </div>
          </div>
        </div>
      )}

      {/* Legal Progress */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Legal Progress</h4>
        <div className="space-y-2">
          {unit.legalPack.documents.map((doc: any, index: number) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{doc.name}</span>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Unit Edit Form Component
function UnitEditForm({ 
  unit, 
  activeTab, 
  setActiveTab, 
  onSave, 
  onCancel,
  isSaving,
  saveError,
  saveSuccess
}: { 
  unit: any; 
  activeTab: string; 
  setActiveTab: (tab: string) => void; 
  onSave: (formData: any) => void; 
  onCancel: () => void;
  isSaving?: boolean;
  saveError?: string | null;
  saveSuccess?: boolean;
}) {
  // Form state management
  const [formData, setFormData] = useState({
    // Basic details
    number: unit.number || '',
    type: unit.type || '1 Bed Apartment',
    bedrooms: unit.features?.bedrooms || 1,
    bathrooms: unit.features?.bathrooms || 1,
    floorArea: unit.features?.sqft || unit.features?.floorArea || 0,
    building: unit.features?.building || 1,
    
    // Pricing and status
    currentPrice: unit.pricing?.currentPrice || unit.pricing?.basePrice || 0,
    status: unit.status || 'available',
    
    // Buyer information
    buyerName: unit.buyer?.name || '',
    buyerEmail: unit.buyer?.email || '',
    buyerPhone: unit.buyer?.phone || '',
    buyerSolicitor: unit.buyer?.solicitor || '',
    
    // Media
    virtualTourUrl: unit.virtualTourUrl || ''
  });
  
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSave = () => {
    onSave(formData);
  };
  const tabs = [
    { id: 'details', label: 'Details', icon: FileText },
    { id: 'media', label: 'Media', icon: Camera },
    { id: 'floorplans', label: 'Floor Plans', icon: Layout },
    { id: 'sales', label: 'Sales', icon: DollarSign },
    { id: 'legal', label: 'Legal', icon: Briefcase }
  ];

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'details' && <DetailsTab unit={unit} formData={formData} onInputChange={handleInputChange} />}
        {activeTab === 'media' && <MediaTab unit={unit} formData={formData} onInputChange={handleInputChange} />}
        {activeTab === 'floorplans' && <FloorPlansTab unit={unit} />}
        {activeTab === 'sales' && <SalesTab unit={unit} formData={formData} onInputChange={handleInputChange} />}
        {activeTab === 'legal' && <LegalTab unit={unit} />}
      </div>

      {/* Save/Cancel with Enterprise Feedback */}
      <div className="flex flex-col gap-3 pt-4 border-t">
        {/* Status Messages */}
        {saveError && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Save Failed</span>
            </div>
            <div className="text-sm">
              {saveError.includes('Validation failed:') ? (
                <div>
                  <p className="mb-1">Please fix the following issues:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {saveError.replace('Validation failed: ', '').split(', ').map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>{saveError}</p>
              )}
            </div>
          </div>
        )}
        
        {saveSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Unit saved successfully! Real-time sync in progress...</span>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// Individual Tab Components
function DetailsTab({ unit, formData, onInputChange }: { unit: any; formData: any; onInputChange: (field: string, value: any) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unit Number</label>
          <input
            type="text"
            value={formData.number}
            onChange={(e) => onInputChange('number', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unit Type</label>
          <select 
            value={formData.type}
            onChange={(e) => onInputChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1 Bed Apartment">1 Bed Apartment</option>
            <option value="2 Bed Apartment">2 Bed Apartment</option>
            <option value="3 Bed Apartment">3 Bed Apartment</option>
            <option value="Penthouse">Penthouse</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
          <input
            type="number"
            value={formData.bedrooms}
            onChange={(e) => onInputChange('bedrooms', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
          <input
            type="number"
            value={formData.bathrooms}
            onChange={(e) => onInputChange('bathrooms', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Floor Area (sq ft)</label>
          <input
            type="number"
            value={formData.floorArea}
            onChange={(e) => onInputChange('floorArea', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Building</label>
          <input
            type="number"
            value={formData.building}
            onChange={(e) => onInputChange('building', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
        <div className="grid grid-cols-2 gap-2">
          {['En-suite bathroom', 'Underfloor heating', 'Modern kitchen', 'Double glazed windows', 'Air conditioning', 'Smart home system'].map((feature) => (
            <label key={feature} className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-2" />
              <span className="text-sm">{feature}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function MediaTab({ unit, formData, onInputChange }: { unit: any; formData: any; onInputChange: (field: string, value: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Unit Images</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Drop images here or click to upload</p>
          <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Select Images
          </button>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Virtual Tour URL</label>
        <input
          type="url"
          placeholder="https://..."
          value={formData.virtualTourUrl}
          onChange={(e) => onInputChange('virtualTourUrl', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}

function FloorPlansTab({ unit }: { unit: any }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Floor Plan Images</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Layout className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Upload floor plan images</p>
          <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Select Floor Plans
          </button>
        </div>
      </div>
    </div>
  );
}

function SalesTab({ unit, formData, onInputChange }: { unit: any; formData: any; onInputChange: (field: string, value: any) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Price (€)</label>
          <input
            type="number"
            value={formData.currentPrice}
            onChange={(e) => onInputChange('currentPrice', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select 
            value={formData.status}
            onChange={(e) => onInputChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
            <option value="on-hold">On Hold</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-3">Buyer Information</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buyer Name</label>
            <input
              type="text"
              value={formData.buyerName}
              onChange={(e) => onInputChange('buyerName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter buyer name..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.buyerEmail}
              onChange={(e) => onInputChange('buyerEmail', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="buyer@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={formData.buyerPhone}
              onChange={(e) => onInputChange('buyerPhone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+353 XX XXX XXXX"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Solicitor</label>
            <input
              type="text"
              value={formData.buyerSolicitor}
              onChange={(e) => onInputChange('buyerSolicitor', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Solicitor name or firm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function LegalTab({ unit }: { unit: any }) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Legal Progress</h4>
        <div className="space-y-3">
          {[
            'Solicitor Pack Sent',
            'Contract Signed', 
            'Deposit Paid',
            'Mortgage Approved'
          ].map((step, index) => (
            <div key={step} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{step}</span>
              <div className="flex items-center gap-2">
                <select className="text-xs border border-gray-300 rounded px-2 py-1">
                  <option value="complete">Complete</option>
                  <option value="pending">Pending</option>
                  <option value="not-started">Not Started</option>
                </select>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}