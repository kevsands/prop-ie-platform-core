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
  X,
  TreePine,
  Waves
} from 'lucide-react';
import Link from 'next/link';
import InteractiveSitePlan from '@/components/developer/InteractiveSitePlan';
import TeamManagement from '@/components/developer/TeamManagement';
import InvoiceManagement from '@/components/developer/InvoiceManagement';
import AIPricingAnalytics from '@/components/developer/AIPricingAnalytics';
import { UnitStatus } from '@/types/project';

export default function EllwoodProject() {
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
    updateUnitPrice,
    getUnitById,
    getUnitsForSitePlan,
    setUnitFilter,
    unitFilter,
    lastUpdated,
    teamMembers,
    invoices,
    feeProposals,
    professionalAppointments
  } = useProjectData('ellwood');

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
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

  // Enterprise helper functions
  const handleUnitClick = (unit) => {
    setSelectedUnitDetails(unit);
    setShowUnitModal(true);
  };

  const handleStatusUpdate = async (unitId, newStatus) => {
    try {
      await updateUnitStatus(unitId, newStatus);
    } catch (error) {
      console.error('Failed to update unit status:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'reserved': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'sold': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'legal_pack': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 70) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Check if we have project data loaded
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
  const handleUnitStatusUpdate = async (unitId, newStatus) => {
    const success = await updateUnitStatus(unitId, newStatus, 'Status updated by developer');
    if (!success) {
      console.error('Failed to update unit status');
    }
  };

  // Get optimized units for site plan from data service
  const siteUnits = getUnitsForSitePlan();

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
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                <TreePine size={24} className="text-white" />
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
                <Calendar size={16} className="text-green-600" />
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
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
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
              className="bg-gradient-to-r from-green-500 to-teal-600 h-3 rounded-full transition-all duration-300"
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
              <p className="text-2xl font-bold text-gray-900">{projectData.totalUnits}</p>
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
              <p className="text-2xl font-bold text-green-600">{projectData.soldUnits}</p>
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
              <p className="text-2xl font-bold text-amber-600">{projectData.reservedUnits}</p>
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
              <p className="text-2xl font-bold text-blue-600">{projectData.availableUnits}</p>
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
                      <span className="font-medium">{new Date(projectData.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-gray-600">Expected Completion</span>
                      <span className="font-medium">{new Date(projectData.completionDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-gray-600">Average Unit Price</span>
                      <span className="font-medium">{projectData.averagePrice}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-gray-600">Current Phase</span>
                      <span className="font-medium">{projectData.phase}</span>
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
                          <span className="text-sm text-gray-600">{unit.count} units</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Sold: {unit.sold}</span>
                          <span>Reserved: {unit.reserved}</span>
                          <span>Available: {unit.available}</span>
                        </div>
                        <div className="text-sm font-medium text-blue-600">{unit.priceRange}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Special Features for Ellwood */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Waves size={24} className="text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-900">Ellwood Special Features</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-blue-800">Premium Amenities</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Rooftop garden terrace</li>
                      <li>• Concierge service</li>
                      <li>• Fitness center & spa</li>
                      <li>• Underground parking with EV charging</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-blue-800">Sustainability Features</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• NZEB (Nearly Zero Energy Building)</li>
                      <li>• Solar panels & rainwater harvesting</li>
                      <li>• Smart home automation</li>
                      <li>• A1 Energy Rating</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'units' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Unit Management</h3>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <Download size={16} />
                    Export Units
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Edit size={16} />
                    Bulk Update
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unitTypes.map((unitType, typeIndex) => 
                  Array.from({ length: Math.min(unitType.count, 15) }, (_, unitIndex) => {
                    const unitNumber = typeIndex * 100 + unitIndex + 101;
                    const status = unitIndex < unitType.sold ? 'sold' : 
                                  unitIndex < unitType.sold + unitType.reserved ? 'reserved' : 'available';
                    
                    return (
                      <div key={`${typeIndex}-${unitIndex}`} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">Unit {unitNumber}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            status === 'sold' ? 'bg-green-100 text-green-800' :
                            status === 'reserved' ? 'bg-amber-100 text-amber-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Type: {unitType.type}</p>
                          <p>Price: €{(Math.random() * 200000 + 325000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                          <p>Floor: {Math.floor(unitIndex / 3) + 1}</p>
                          <p>Size: {Math.floor(Math.random() * 50) + 70}m²</p>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button className="text-sm text-blue-600 hover:text-blue-800">View Details</button>
                          <button className="text-sm text-gray-600 hover:text-gray-800">Floor Plan</button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
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
                {/* Architectural Plans */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Architectural Plans</h4>
                  <div className="space-y-3">
                    {unitTypes.map((unit, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{unit.type} Plan</span>
                          <div className="flex gap-2">
                            <button className="text-sm text-blue-600 hover:text-blue-800">View</button>
                            <button className="text-sm text-gray-600 hover:text-gray-800">Download</button>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          PDF • Updated 1 week ago
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical Drawings */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Technical Drawings</h4>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Structural Plans</span>
                        <div className="flex gap-2">
                          <button className="text-sm text-blue-600 hover:text-blue-800">View</button>
                          <button className="text-sm text-gray-600 hover:text-gray-800">Download</button>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        DWG • Updated 5 days ago
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">MEP Drawings</span>
                        <div className="flex gap-2">
                          <button className="text-sm text-blue-600 hover:text-blue-800">View</button>
                          <button className="text-sm text-gray-600 hover:text-gray-800">Download</button>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        PDF • Updated 3 days ago
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Landscape Design</span>
                        <div className="flex gap-2">
                          <button className="text-sm text-blue-600 hover:text-blue-800">View</button>
                          <button className="text-sm text-gray-600 hover:text-gray-800">Download</button>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        PDF • Updated 2 days ago
                      </div>
                    </div>
                  </div>
                </div>

                {/* Marketing Media */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Marketing Media</h4>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {Array.from({ length: 8 }, (_, index) => (
                      <div key={index} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                        <Camera size={20} className="text-gray-400" />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Virtual Tour</span>
                        <button className="text-sm text-blue-600 hover:text-blue-800">Launch</button>
                      </div>
                    </div>
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Marketing Video</span>
                        <button className="text-sm text-blue-600 hover:text-blue-800">Play</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'siteplan' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Interactive Site Plan</h3>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Full Screen
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Update Plan
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8 text-center">
                <div className="max-w-md mx-auto">
                  <TreePine size={48} className="text-blue-500 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Ellwood Interactive Site Plan</h4>
                  <p className="text-gray-600 mb-4">
                    Premium Dublin development with interactive site plan showing real-time unit availability, amenities, and green spaces.
                  </p>
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Launch Interactive Plan
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-green-800">Available</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{projectData.availableUnits}</p>
                  <p className="text-sm text-green-600">Ready to reserve</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span className="font-medium text-amber-800">Reserved</span>
                  </div>
                  <p className="text-2xl font-bold text-amber-600">{projectData.reservedUnits}</p>
                  <p className="text-sm text-amber-600">Under contract</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span className="font-medium text-gray-800">Sold</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-600">{projectData.soldUnits}</p>
                  <p className="text-sm text-gray-600">Completed sales</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-blue-800">Total Value</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{projectData.totalValue}</p>
                  <p className="text-sm text-blue-600">Development GDV</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Team Management</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Users size={16} />
                  Add Team Member
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Design Team */}
                <div className="space-y-4">
                  <h4 className="font-medium text-blue-600 flex items-center gap-2">
                    <Layers size={16} />
                    Design Team
                  </h4>
                  <div className="space-y-3">
                    {designTeam.map((member, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <UserCheck size={20} className="text-blue-600" />
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900">{member.name}</h5>
                              <p className="text-sm text-gray-600">{member.role}</p>
                              <p className="text-sm text-gray-500">{member.company}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-1 text-gray-400 hover:text-blue-600">
                              <Mail size={16} />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-green-600">
                              <Phone size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="mt-3 flex gap-4 text-sm text-gray-600">
                          <span>{member.email}</span>
                          <span>{member.phone}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Construction Team */}
                <div className="space-y-4">
                  <h4 className="font-medium text-orange-600 flex items-center gap-2">
                    <Badge size={16} />
                    Construction Team
                  </h4>
                  <div className="space-y-3">
                    {constructionTeam.map((member, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                              <Briefcase size={20} className="text-orange-600" />
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900">{member.name}</h5>
                              <p className="text-sm text-gray-600">{member.role}</p>
                              <p className="text-sm text-gray-500">{member.company}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-1 text-gray-400 hover:text-blue-600">
                              <Mail size={16} />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-green-600">
                              <Phone size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="mt-3 flex gap-4 text-sm text-gray-600">
                          <span>{member.email}</span>
                          <span>{member.phone}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Invoice Management</h3>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Export Report
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Create Invoice
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={20} className="text-green-600" />
                    <span className="font-medium text-green-800">Paid</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">€27,700</p>
                  <p className="text-sm text-green-600">2 invoices</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={20} className="text-amber-600" />
                    <span className="font-medium text-amber-800">Pending</span>
                  </div>
                  <p className="text-2xl font-bold text-amber-600">€128,500</p>
                  <p className="text-sm text-amber-600">2 invoices</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={20} className="text-blue-600" />
                    <span className="font-medium text-blue-800">Approved</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">€12,800</p>
                  <p className="text-sm text-blue-600">1 invoice</p>
                </div>
              </div>

              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentInvoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.provider}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{invoice.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.amount}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{invoice.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                              invoice.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {invoice.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <button className="text-blue-600 hover:text-blue-900">View</button>
                              <button className="text-gray-600 hover:text-gray-900">Download</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
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
                        Ellwood represents the pinnacle of Dublin luxury living, featuring premium apartments and penthouses with exceptional amenities and sustainable design.
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Premium Features</label>
                      <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                        <li>NZEB certified development</li>
                        <li>Rooftop garden terrace</li>
                        <li>24/7 concierge service</li>
                        <li>Private fitness center & spa</li>
                        <li>Underground parking with EV charging</li>
                        <li>Smart home automation</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Display Settings</h4>
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Show Unit Availability</span>
                      <div className="w-10 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Display Premium Pricing</span>
                      <div className="w-10 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Show Sustainability Features</span>
                      <div className="w-10 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform"></div>
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
                <h4 className="font-medium text-gray-900 mb-4">Marketing Performance</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">4,256</p>
                    <p className="text-sm text-blue-600">Page Views</p>
                    <p className="text-xs text-gray-500">This month</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">287</p>
                    <p className="text-sm text-green-600">Enquiries</p>
                    <p className="text-xs text-gray-500">This month</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">45</p>
                    <p className="text-sm text-purple-600">Brochure Downloads</p>
                    <p className="text-xs text-gray-500">This week</p>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-lg">
                    <p className="text-2xl font-bold text-amber-600">12</p>
                    <p className="text-sm text-amber-600">Virtual Tours</p>
                    <p className="text-xs text-gray-500">Today</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}