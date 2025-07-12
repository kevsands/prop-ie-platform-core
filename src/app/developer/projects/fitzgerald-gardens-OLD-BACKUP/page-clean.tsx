'use client';

import React, { useState } from 'react';
import useProjectData from '@/hooks/useProjectData';
import { 
  Building2, 
  Users, 
  MapPin, 
  Calendar, 
  DollarSign, 
  FileText, 
  Settings, 
  BarChart3,
  Eye,
  Download,
  Share,
  Edit,
  Zap,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Home,
  Layers,
  Camera,
  Mail,
  Phone,
  Badge,
  CreditCard,
  Receipt,
  UserCheck,
  Briefcase,
  Globe,
  User,
  X
} from 'lucide-react';
import Link from 'next/link';
import InteractiveSitePlan from '@/components/developer/InteractiveSitePlan';
import TeamManagement from '@/components/developer/TeamManagement';
import InvoiceManagement from '@/components/developer/InvoiceManagement';
import { UnitStatus } from '@/types/project';

export default function FitzgeraldGardensProject() {
  // Enterprise data management with real-time synchronization
  const {
    project,
    units,
    filteredUnits,
    isLoading,
    error,
    totalUnits,
    soldUnits,
    reservedUnits,
    availableUnits,
    totalRevenue,
    averageUnitPrice,
    salesVelocity,
    conversionRate,
    updateUnitStatus,
    getUnitById,
    getUnitsForSitePlan,
    setUnitFilter,
    unitFilter,
    lastUpdated,
    teamMembers,
    invoices,
    feeProposals,
    professionalAppointments
  } = useProjectData('fitzgerald-gardens');

  // Local UI state
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [unitViewMode, setUnitViewMode] = useState('grid'); // grid, list, icons
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [selectedUnitDetails, setSelectedUnitDetails] = useState(null);

  // Loading and error states
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Error loading project: {error}</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Project not found</p>
        </div>
      </div>
    );
  }

  // Dynamic unit type breakdown from real data
  const unitTypes = project.unitBreakdown;

  // Unit interaction handlers
  const handleUnitClick = (unit: any) => {
    setSelectedUnitDetails(unit);
    setShowUnitModal(true);
  };

  const handleUnitStatusUpdate = async (unitId: string, newStatus: UnitStatus) => {
    const success = await updateUnitStatus(unitId, newStatus, 'Status updated by developer');
    if (!success) {
      console.error('Failed to update unit status');
    }
  };

  // Get optimized units for site plan from data service
  const siteUnits = getUnitsForSitePlan();

  // Tab configuration
  const tabs = [
    { id: 'overview', label: 'Project Overview', icon: Home },
    { id: 'units', label: 'Unit Management', icon: Building2 },
    { id: 'media', label: 'Media & Plans', icon: Camera },
    { id: 'siteplan', label: 'Interactive Site Plan', icon: MapPin },
    { id: 'team', label: 'Team Management', icon: Users },
    { id: 'invoices', label: 'Invoice Management', icon: Receipt },
    { id: 'marketing', label: 'Marketing Display', icon: Globe }
  ];

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Building2 size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={16} />
                  <span>{project.location}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-blue-600" />
                <span className="text-gray-600">Completion: {new Date(project.timeline.plannedCompletion).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target size={16} className="text-green-600" />
                <span className="text-gray-600">{project.timeline.progressPercentage}% Complete</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-purple-600" />
                <span className="text-gray-600">Total Value: €{(project.metrics.projectedRevenue / 1000000).toFixed(1)}M</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Eye size={16} />
              View Public Listing
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Settings size={16} />
              Project Settings
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Project Progress</span>
            <span className="text-sm text-gray-600">{project.timeline.currentPhase}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${project.timeline.progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Units</p>
              <p className="text-2xl font-bold text-gray-900">{totalUnits}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 size={20} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Units Sold</p>
              <p className="text-2xl font-bold text-green-600">{soldUnits}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Reserved</p>
              <p className="text-2xl font-bold text-amber-600">{reservedUnits}</p>
            </div>
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock size={20} className="text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-2xl font-bold text-blue-600">{availableUnits}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Home size={20} className="text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Project Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Project Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-gray-600">Project Start</span>
                      <span className="font-medium">{new Date(project.timeline.projectStart).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-gray-600">Expected Completion</span>
                      <span className="font-medium">{new Date(project.timeline.plannedCompletion).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-gray-600">Average Unit Price</span>
                      <span className="font-medium">€{Math.round(averageUnitPrice).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-gray-600">Current Phase</span>
                      <span className="font-medium">{project.timeline.currentPhase}</span>
                    </div>
                  </div>
                </div>

                {/* Sales Summary */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Sales Summary</h3>
                  <div className="space-y-3">
                    {unitTypes.map((unit, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-gray-900">{unit.type}</h4>
                          <span className="text-sm text-gray-600">{unit.totalCount} units</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Sold: {unit.sold}</span>
                          <span>Reserved: {unit.reserved}</span>
                          <span>Available: {unit.available}</span>
                        </div>
                        <div className="text-sm font-medium text-blue-600">€{Math.round(unit.priceRange.min).toLocaleString()} - €{Math.round(unit.priceRange.max).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'units' && (
            <div className="space-y-6">
              {/* Header with Controls */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Unit Management</h3>
                  <p className="text-sm text-gray-600">{filteredUnits.length} of {totalUnits} units displayed</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {/* View Mode Selector */}
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button 
                      onClick={() => setUnitViewMode('grid')}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        unitViewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <Layers size={16} className="inline mr-1" />
                      Grid
                    </button>
                    <button 
                      onClick={() => setUnitViewMode('list')}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        unitViewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <FileText size={16} className="inline mr-1" />
                      List
                    </button>
                    <button 
                      onClick={() => setUnitViewMode('icons')}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        unitViewMode === 'icons' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <Home size={16} className="inline mr-1" />
                      Icons
                    </button>
                  </div>

                  {/* Filter Controls */}
                  <select 
                    value={unitFilter.status || 'all'} 
                    onChange={(e) => setUnitFilter({ ...unitFilter, status: e.target.value as any })}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="sold">Sold</option>
                  </select>

                  <select 
                    value={unitFilter.type || 'all'} 
                    onChange={(e) => setUnitFilter({ ...unitFilter, type: e.target.value as any })}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="all">All Types</option>
                    {unitTypes.map(type => (
                      <option key={type.type} value={type.type}>{type.type}</option>
                    ))}
                  </select>

                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <Download size={16} />
                    Export
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Edit size={16} />
                    Bulk Update
                  </button>
                </div>
              </div>

              {/* Grid View */}
              {unitViewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredUnits.map((unit) => (
                    <div 
                      key={unit.id} 
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleUnitClick(unit)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Unit {unit.number}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          unit.status === 'sold' ? 'bg-green-100 text-green-800' :
                          unit.status === 'reserved' ? 'bg-amber-100 text-amber-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Type: {unit.type}</p>
                        <p>Price: €{unit.pricing.currentPrice.toLocaleString()}</p>
                        <p>Floor: {unit.features.floor} | Building: {unit.features.building}</p>
                        <p>Size: {unit.features.sqft} sq ft</p>
                      </div>
                      
                      {unit.buyer && (
                        <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                          <p className="font-medium">{unit.buyer.name}</p>
                          <p className="text-gray-500">{unit.buyer.solicitor}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* List View */}
              {unitViewMode === 'list' && (
                <div className="bg-white border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Legal Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUnits.map((unit) => (
                          <tr key={unit.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Unit {unit.number}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {unit.type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                unit.status === 'sold' ? 'bg-green-100 text-green-800' :
                                unit.status === 'reserved' ? 'bg-amber-100 text-amber-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              €{unit.pricing.currentPrice.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {unit.buyer ? unit.buyer.name : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {unit.legalPack.contractSigned ? 'Contract Signed' : 
                               unit.legalPack.solicitorPackSent ? 'Legal Pack Sent' : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUnitClick(unit);
                                }}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                              >
                                View
                              </button>
                              <button className="text-gray-600 hover:text-gray-900">
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Icons View */}
              {unitViewMode === 'icons' && (
                <div className="grid grid-cols-8 md:grid-cols-12 lg:grid-cols-16 gap-2">
                  {filteredUnits.map((unit) => (
                    <div 
                      key={unit.id}
                      className={`relative w-12 h-12 rounded-lg border-2 cursor-pointer transition-all hover:scale-110 ${
                        unit.status === 'sold' ? 'bg-green-100 border-green-500' :
                        unit.status === 'reserved' ? 'bg-amber-100 border-amber-500' :
                        'bg-blue-100 border-blue-500'
                      }`}
                      onClick={() => handleUnitClick(unit)}
                      title={`Unit ${unit.number} - ${unit.type} - ${unit.status}`}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Home size={16} className={
                          unit.status === 'sold' ? 'text-green-600' :
                          unit.status === 'reserved' ? 'text-amber-600' :
                          'text-blue-600'
                        } />
                      </div>
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-white rounded px-1 text-xs font-medium border">
                        {unit.number}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Media & Plans</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Camera size={16} />
                  Upload Media
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Floor Plans */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Floor Plans</h4>
                  <div className="space-y-3">
                    {unitTypes.map((unit, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{unit.type}</span>
                          <div className="flex gap-2">
                            <button className="text-sm text-blue-600 hover:text-blue-800">View</button>
                            <button className="text-sm text-gray-600 hover:text-gray-800">Download</button>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          PDF • Updated 2 weeks ago
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Unit Plans */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Unit Plans</h4>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Site Layout Plan</span>
                        <div className="flex gap-2">
                          <button className="text-sm text-blue-600 hover:text-blue-800">View</button>
                          <button className="text-sm text-gray-600 hover:text-gray-800">Download</button>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        DWG • Updated 1 week ago
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Landscape Plan</span>
                        <div className="flex gap-2">
                          <button className="text-sm text-blue-600 hover:text-blue-800">View</button>
                          <button className="text-sm text-gray-600 hover:text-gray-800">Download</button>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        PDF • Updated 3 days ago
                      </div>
                    </div>
                  </div>
                </div>

                {/* Photos & Videos */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Photos & Videos</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: 6 }, (_, index) => (
                      <div key={index} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                        <Camera size={24} className="text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'siteplan' && (
            <div className="space-y-6">
              <InteractiveSitePlan 
                units={siteUnits}
                projectName={project.name}
                onUnitSelect={(unit) => setSelectedUnit(unit)}
              />
            </div>
          )}

          {activeTab === 'team' && (
            <TeamManagement 
              projectName={project.name}
              initialTeamMembers={teamMembers}
            />
          )}

          {activeTab === 'invoices' && (
            <InvoiceManagement 
              projectName={project.name}
              initialInvoices={invoices}
              initialProposals={feeProposals}
              initialAppointments={professionalAppointments}
            />
          )}

          {activeTab === 'marketing' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Marketing Display</h3>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <Eye size={16} />
                    Preview
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Edit size={16} />
                    Edit Listing
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Public Listing Information</h4>
                  <div className="border rounded-lg p-4 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project Description</label>
                      <p className="text-sm text-gray-600">
                        Fitzgerald Gardens is a premium residential development in Cork, featuring modern apartments and houses with stunning views and contemporary design.
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Key Features</label>
                      <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                        <li>Energy A-rated homes</li>
                        <li>Private gardens and balconies</li>
                        <li>Premium finishes throughout</li>
                        <li>Secure parking</li>
                        <li>Landscaped communal areas</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Buyer Display Settings</h4>
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Show Available Units</span>
                      <div className="w-10 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Display Pricing</span>
                      <div className="w-10 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Show Progress Updates</span>
                      <div className="w-10 h-6 bg-gray-300 rounded-full relative cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 transition-transform"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Enable Virtual Tours</span>
                      <div className="w-10 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Live Statistics</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">2,847</p>
                    <p className="text-sm text-blue-600">Page Views</p>
                    <p className="text-xs text-gray-500">This month</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">164</p>
                    <p className="text-sm text-green-600">Enquiries</p>
                    <p className="text-xs text-gray-500">This month</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">23</p>
                    <p className="text-sm text-purple-600">Brochure Downloads</p>
                    <p className="text-xs text-gray-500">This week</p>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-lg">
                    <p className="text-2xl font-bold text-amber-600">8</p>
                    <p className="text-sm text-amber-600">Virtual Tours</p>
                    <p className="text-xs text-gray-500">Today</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Unit Detail Modal */}
      {showUnitModal && selectedUnitDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Unit {selectedUnitDetails.number}</h3>
                <p className="text-sm text-gray-600">{selectedUnitDetails.type} • Building {selectedUnitDetails.features.building}, Floor {selectedUnitDetails.features.floor}</p>
              </div>
              <button 
                onClick={() => setShowUnitModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Unit Details */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Unit Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                        <p className="text-lg font-semibold text-gray-900">€{selectedUnitDetails.pricing.currentPrice.toLocaleString()}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            selectedUnitDetails.status === 'sold' ? 'bg-green-100 text-green-800' :
                            selectedUnitDetails.status === 'reserved' ? 'bg-amber-100 text-amber-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {selectedUnitDetails.status.charAt(0).toUpperCase() + selectedUnitDetails.status.slice(1)}
                          </span>
                          <select 
                            value={selectedUnitDetails.status}
                            onChange={(e) => handleUnitStatusUpdate(selectedUnitDetails.id, e.target.value as UnitStatus)}
                            className="ml-2 px-2 py-1 border border-gray-300 rounded text-xs"
                          >
                            <option value="available">Available</option>
                            <option value="reserved">Reserved</option>
                            <option value="sold">Sold</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                        <p className="text-gray-900">{selectedUnitDetails.features.bedrooms}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                        <p className="text-gray-900">{selectedUnitDetails.features.bathrooms}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Floor Area</label>
                        <p className="text-gray-900">{selectedUnitDetails.features.sqft} sq ft</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                        <p className="text-gray-900 text-xs">{new Date(selectedUnitDetails.lastUpdated).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Unit Features */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Unit Features</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedUnitDetails.features.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle size={14} className="text-green-500" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Development Amenities */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Development Amenities</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedUnitDetails.features.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <Zap size={14} className="text-blue-500" />
                          {amenity}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Legal Pack & Buyer Information */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Legal Pack & Sales Information</h4>
                    
                    {selectedUnitDetails.buyer ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h5 className="font-medium text-gray-900 mb-3">Buyer Information</h5>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <User size={16} className="text-gray-500" />
                              <span className="font-medium">{selectedUnitDetails.buyer.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail size={16} className="text-gray-500" />
                              <span className="text-sm text-gray-600">{selectedUnitDetails.buyer.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone size={16} className="text-gray-500" />
                              <span className="text-sm text-gray-600">{selectedUnitDetails.buyer.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Briefcase size={16} className="text-gray-500" />
                              <span className="text-sm text-gray-600">{selectedUnitDetails.buyer.solicitor}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h5 className="font-medium text-gray-900">Legal Progress</h5>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Solicitor Pack Sent</span>
                              <div className="flex items-center gap-2">
                                {selectedUnitDetails.legalPack.solicitorPackSent ? (
                                  <CheckCircle size={16} className="text-green-500" />
                                ) : (
                                  <Clock size={16} className="text-gray-400" />
                                )}
                                <span className="text-sm font-medium">
                                  {selectedUnitDetails.legalPack.solicitorPackSent ? 'Complete' : 'Pending'}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Contract Signed</span>
                              <div className="flex items-center gap-2">
                                {selectedUnitDetails.legalPack.contractSigned ? (
                                  <CheckCircle size={16} className="text-green-500" />
                                ) : (
                                  <Clock size={16} className="text-gray-400" />
                                )}
                                <span className="text-sm font-medium">
                                  {selectedUnitDetails.legalPack.contractSigned ? 'Complete' : 'Pending'}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Deposit Paid</span>
                              <div className="flex items-center gap-2">
                                {selectedUnitDetails.legalPack.depositPaid ? (
                                  <CheckCircle size={16} className="text-green-500" />
                                ) : (
                                  <Clock size={16} className="text-gray-400" />
                                )}
                                <span className="text-sm font-medium">
                                  {selectedUnitDetails.legalPack.depositPaid ? 'Complete' : 'Pending'}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Mortgage Approved</span>
                              <div className="flex items-center gap-2">
                                {selectedUnitDetails.legalPack.mortgageApproved ? (
                                  <CheckCircle size={16} className="text-green-500" />
                                ) : (
                                  <Clock size={16} className="text-gray-400" />
                                )}
                                <span className="text-sm font-medium">
                                  {selectedUnitDetails.legalPack.mortgageApproved ? 'Complete' : 'Pending'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No buyer assigned to this unit</p>
                        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Assign Buyer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}