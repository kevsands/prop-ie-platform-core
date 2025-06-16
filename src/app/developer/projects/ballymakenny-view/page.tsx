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
  Mountain,
  Sun
} from 'lucide-react';
import Link from 'next/link';
import InteractiveSitePlan from '@/components/developer/InteractiveSitePlan';
import TeamManagement from '@/components/developer/TeamManagement';
import InvoiceManagement from '@/components/developer/InvoiceManagement';
import AIPricingAnalytics from '@/components/developer/AIPricingAnalytics';
import { UnitStatus } from '@/types/project';

export default function BallymakenneyViewProject() {
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
  } = useProjectData('ballymakenny-view');

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
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
    if (progress >= 90) return 'bg-amber-500';
    if (progress >= 70) return 'bg-amber-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Legacy unit types and availability (for fallback display)
  const legacyUnitTypes = [
    { type: '2 Bed Apartment', totalCount: 6, sold: 6, reserved: 0, available: 0, priceRange: '€295,000 - €325,000' },
    { type: '3 Bed Apartment', totalCount: 8, sold: 8, reserved: 0, available: 0, priceRange: '€340,000 - €375,000' },
    { type: '3 Bed House', totalCount: 4, sold: 3, reserved: 0, available: 1, priceRange: '€385,000 - €425,000' },
    { type: '4 Bed House', totalCount: 2, sold: 2, reserved: 0, available: 0, priceRange: '€455,000 - €495,000' }
  ];

  // Dynamic unit type breakdown from real data
  const unitTypes = project?.unitBreakdown || legacyUnitTypes;

  // Unit interaction handlers
  const handleUnitStatusUpdate = async (unitId, newStatus) => {
    const success = await updateUnitStatus(unitId, newStatus, 'Status updated by developer');
    if (!success) {
      console.error('Failed to update unit status');
    }
  };

  // Get optimized units for site plan from data service
  const siteUnits = getUnitsForSitePlan();

  // Project overview data
  const projectData = {
    name: 'Ballymakenny View',
    location: 'Drogheda, Ireland',
    totalUnits: 20,
    soldUnits: 19,
    reservedUnits: 0,
    availableUnits: 1,
    totalValue: '€6.8M',
    averagePrice: '€340,000',
    completionDate: '2025-06-30',
    startDate: '2023-09-01',
    progress: 98,
    phase: 'Final Unit Available - Immediate Occupancy'
  };

  // Team members
  const designTeam = [
    { name: 'Catherine Lynch', role: 'Lead Architect', company: 'Lynch Design Studios', email: 'catherine@lynchdesign.ie', phone: '+353 41 123 4567' },
    { name: 'James Brady', role: 'Structural Engineer', company: 'Brady Engineering', email: 'james@bradyeng.ie', phone: '+353 41 234 5678' },
    { name: 'Niamh O\'Sullivan', role: 'Interior Designer', company: 'O\'Sullivan Interiors', email: 'niamh@osullivanint.ie', phone: '+353 41 345 6789' },
    { name: 'Paul McGrath', role: 'Landscape Architect', company: 'McGrath Landscapes', email: 'paul@mcgrathland.ie', phone: '+353 41 456 7890' }
  ];

  const constructionTeam = [
    { name: 'Michael Byrne', role: 'Construction Director', company: 'Byrne Construction Group', email: 'mbyrne@byrnecon.ie', phone: '+353 41 567 8901' },
    { name: 'Sharon Kelly', role: 'Site Manager', company: 'Kelly Site Services', email: 'sharon@kellysite.ie', phone: '+353 41 678 9012' },
    { name: 'Robert Smith', role: 'Quality Surveyor', company: 'Smith Quality Assurance', email: 'robert@smithqa.ie', phone: '+353 41 789 0123' },
    { name: 'Helen Murphy', role: 'Project Coordinator', company: 'Murphy Project Management', email: 'helen@murphypm.ie', phone: '+353 41 890 1234' },
    { name: 'Andrew Nolan', role: 'Safety Officer', company: 'Nolan Safety Solutions', email: 'andrew@nolansafety.ie', phone: '+353 41 901 2345' }
  ];

  // Recent invoices
  const recentInvoices = [
    { id: 'INV-2025-010', provider: 'Lynch Design Studios', amount: '€8,500', date: '2025-06-13', status: 'Paid', type: 'Final Design Review' },
    { id: 'INV-2025-011', provider: 'Byrne Construction Group', amount: '€45,000', date: '2025-06-11', status: 'Paid', type: 'Final Phase Construction' },
    { id: 'INV-2025-012', provider: 'McGrath Landscapes', amount: '€15,200', date: '2025-06-09', status: 'Pending', type: 'Landscaping Works' },
    { id: 'INV-2025-013', provider: 'Smith Quality Assurance', amount: '€4,800', date: '2025-06-07', status: 'Approved', type: 'Final Inspection' },
    { id: 'INV-2025-014', provider: 'O\'Sullivan Interiors', amount: '€6,200', date: '2025-06-05', status: 'Paid', type: 'Show Home Staging' }
  ];

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
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Mountain size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{projectData.name}</h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={16} />
                  <span>{projectData.location}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-amber-600" />
                <span className="text-gray-600">Completion: {new Date(projectData.completionDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target size={16} className="text-green-600" />
                <span className="text-gray-600">{projectData.progress}% Complete</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-purple-600" />
                <span className="text-gray-600">Total Value: {projectData.totalValue}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2">
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
            <span className="text-sm text-gray-600">{projectData.phase}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-amber-500 to-orange-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${projectData.progress}%` }}
            />
          </div>
        </div>

        {/* Near Completion Notice */}
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle size={20} className="text-green-600" />
            <span className="font-medium text-green-800">Project Nearing Completion</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            This development is 82% complete with final finishes underway. Estimated completion: June 2025.
          </p>
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
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Building2 size={20} className="text-amber-600" />
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
          <div className="mt-1 text-xs text-green-600">
            62% sales rate
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
          <div className="mt-1 text-xs text-blue-600">
            Limited availability
          </div>
        </div>
      </div>

      {/* Main Content Area with Internal Sidebar */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="flex min-h-[700px]">
          {/* Internal Project Navigation Sidebar */}
          <div className="w-72 bg-gradient-to-b from-gray-50 to-gray-100 border-r border-gray-200 relative">
            {/* Sidebar Header */}
            <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white">
              <h3 className="text-lg font-bold">{projectData.name}</h3>
              <p className="text-amber-100 text-sm">Project Management Hub</p>
            </div>

            {/* Navigation Sections */}
            <nav className="p-4">
              <div className="space-y-6">
                {/* Core Management */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                    Core Management
                  </h4>
                  <ul className="space-y-1">
                    {tabs.filter(tab => ['overview', 'units'].includes(tab.id)).map((tab) => (
                      <li key={tab.id}>
                        <button
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                            activeTab === tab.id
                              ? 'bg-white text-amber-700 shadow-md border border-amber-100 transform scale-[1.02]'
                              : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${
                            activeTab === tab.id
                              ? 'bg-amber-100 text-amber-600'
                              : 'bg-gray-200 text-gray-500'
                          }`}>
                            <tab.icon size={16} />
                          </div>
                          <span className="flex-1 text-left">{tab.label}</span>
                          {activeTab === tab.id && (
                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sales & Customer Management */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                    Sales & Marketing
                  </h4>
                  <ul className="space-y-1">
                    {tabs.filter(tab => ['marketing'].includes(tab.id)).map((tab) => (
                      <li key={tab.id}>
                        <button
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                            activeTab === tab.id
                              ? 'bg-white text-purple-700 shadow-md border border-purple-100 transform scale-[1.02]'
                              : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${
                            activeTab === tab.id
                              ? 'bg-purple-100 text-purple-600'
                              : 'bg-gray-200 text-gray-500'
                          }`}>
                            <tab.icon size={16} />
                          </div>
                          <span className="flex-1 text-left">{tab.label}</span>
                          {activeTab === tab.id && (
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Team & Operations */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                    Team & Operations
                  </h4>
                  <ul className="space-y-1">
                    {tabs.filter(tab => ['team', 'invoices', 'media', 'siteplan'].includes(tab.id)).map((tab) => (
                      <li key={tab.id}>
                        <button
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                            activeTab === tab.id
                              ? 'bg-white text-orange-700 shadow-md border border-orange-100 transform scale-[1.02]'
                              : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${
                            activeTab === tab.id
                              ? 'bg-orange-100 text-orange-600'
                              : 'bg-gray-200 text-gray-500'
                          }`}>
                            <tab.icon size={16} />
                          </div>
                          <span className="flex-1 text-left">{tab.label}</span>
                          {activeTab === tab.id && (
                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </nav>

            {/* Sidebar Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
              <div className="text-xs text-gray-500 text-center">
                <div className="font-medium">{projectData.progress}% Complete</div>
                <div className="mt-1">Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Now'}</div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
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
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-gray-600">Sales Rate</span>
                      <span className="font-medium text-green-600">62% (52/84 units)</span>
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
                        <div className="text-sm font-medium text-amber-600">
                          {typeof unit.priceRange === 'object' 
                            ? `€${unit.priceRange.min?.toLocaleString()} - €${unit.priceRange.max?.toLocaleString()}`
                            : unit.priceRange
                          }
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                          <div 
                            className="bg-green-500 h-1 rounded-full" 
                            style={{ width: `${(unit.sold / unit.totalCount) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Completion Timeline */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Sun size={24} className="text-amber-600" />
                  <h3 className="text-lg font-semibold text-amber-900">Completion Timeline</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-amber-800">Completed</h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>✓ Foundation & structure</li>
                      <li>✓ Roofing & external walls</li>
                      <li>✓ Windows & doors</li>
                      <li>✓ MEP installation</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-amber-800">In Progress</h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• Final interior finishes</li>
                      <li>• Landscaping works</li>
                      <li>• External works</li>
                      <li>• Show home preparation</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-amber-800">Upcoming</h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>→ Final inspections</li>
                      <li>→ Occupation certificates</li>
                      <li>→ Handover preparation</li>
                      <li>→ Marketing launch</li>
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
                  <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2">
                    <Edit size={16} />
                    Bulk Update
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unitTypes.map((unitType, typeIndex) => 
                  Array.from({ length: Math.min(unitType.totalCount, 12) }, (_, unitIndex) => {
                    const unitNumber = typeIndex * 50 + unitIndex + 1;
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
                          <p>Price: €{(Math.random() * 100000 + 295000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                          <p>Floor: {Math.floor(unitIndex / 4) + 1}</p>
                          <p>Size: {Math.floor(Math.random() * 60) + 65}m²</p>
                          <p>Status: {status === 'sold' ? 'Sold' : status === 'reserved' ? 'Reserved' : 'Ready for Sale'}</p>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button className="text-sm text-amber-600 hover:text-amber-800">View Details</button>
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
                <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2">
                  <Camera size={16} />
                  Upload Media
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Construction Progress Photos */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Construction Progress</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: 8 }, (_, index) => (
                      <div key={index} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                        <Camera size={20} className="text-gray-400" />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">
                    Latest update: 2 days ago
                  </div>
                </div>

                {/* Final Plans & Documents */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Final Plans & Documents</h4>
                  <div className="space-y-3">
                    {unitTypes.map((unit, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{unit.type} Plans</span>
                          <div className="flex gap-2">
                            <button className="text-sm text-amber-600 hover:text-amber-800">View</button>
                            <button className="text-sm text-gray-600 hover:text-gray-800">Download</button>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          PDF • Final version
                        </div>
                      </div>
                    ))}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Show Home Portfolio</span>
                        <div className="flex gap-2">
                          <button className="text-sm text-amber-600 hover:text-amber-800">View</button>
                          <button className="text-sm text-gray-600 hover:text-gray-800">Download</button>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        PDF • Professional photography
                      </div>
                    </div>
                  </div>
                </div>

                {/* Marketing Assets */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Marketing Assets</h4>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Virtual Tour</span>
                        <button className="text-sm text-amber-600 hover:text-amber-800">Launch</button>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Complete walkthrough</div>
                    </div>
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Development Video</span>
                        <button className="text-sm text-amber-600 hover:text-amber-800">Play</button>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">4K promotional video</div>
                    </div>
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Brochure</span>
                        <button className="text-sm text-amber-600 hover:text-amber-800">Download</button>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Sales brochure PDF</div>
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
                  <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                    Update Plan
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-lg p-8 text-center">
                <div className="max-w-md mx-auto">
                  <Mountain size={48} className="text-amber-600 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Ballymakenny View Site Plan</h4>
                  <p className="text-gray-600 mb-4">
                    Nearly complete development in Drogheda with live site plan showing available units and final completion status.
                  </p>
                  <button className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
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
                  <p className="text-sm text-green-600">Final units remaining</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span className="font-medium text-amber-800">Reserved</span>
                  </div>
                  <p className="text-2xl font-bold text-amber-600">{projectData.reservedUnits}</p>
                  <p className="text-sm text-amber-600">Pending completion</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span className="font-medium text-gray-800">Sold</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-600">{projectData.soldUnits}</p>
                  <p className="text-sm text-gray-600">Ready for handover</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-blue-800">Completion</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{projectData.progress}%</p>
                  <p className="text-sm text-blue-600">Project progress</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Team Management</h3>
                <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2">
                  <Users size={16} />
                  Add Team Member
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Design Team */}
                <div className="space-y-4">
                  <h4 className="font-medium text-amber-600 flex items-center gap-2">
                    <Layers size={16} />
                    Design Team
                  </h4>
                  <div className="space-y-3">
                    {designTeam.map((member, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                              <UserCheck size={20} className="text-amber-600" />
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
                  <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
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
                  <p className="text-2xl font-bold text-green-600">€59,700</p>
                  <p className="text-sm text-green-600">3 invoices</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={20} className="text-amber-600" />
                    <span className="font-medium text-amber-800">Pending</span>
                  </div>
                  <p className="text-2xl font-bold text-amber-600">€15,200</p>
                  <p className="text-sm text-amber-600">1 invoice</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={20} className="text-blue-600" />
                    <span className="font-medium text-blue-800">Approved</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">€4,800</p>
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
                              <button className="text-amber-600 hover:text-amber-900">View</button>
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
                  <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2">
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
                        Ballymakenny View is a sought-after residential development in Drogheda, offering quality homes with excellent transport links to Dublin and beautiful countryside views.
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Key Features</label>
                      <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                        <li>Contemporary design with quality finishes</li>
                        <li>Excellent transport links to Dublin</li>
                        <li>Energy efficient A-rated homes</li>
                        <li>Beautiful landscaped grounds</li>
                        <li>Close to schools and amenities</li>
                        <li>Final phase - limited availability</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Display Settings</h4>
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Show Final Units Available</span>
                      <div className="w-10 h-6 bg-amber-600 rounded-full relative cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Display Completion Progress</span>
                      <div className="w-10 h-6 bg-amber-600 rounded-full relative cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Show Handover Timeline</span>
                      <div className="w-10 h-6 bg-amber-600 rounded-full relative cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Enable Show Home Tours</span>
                      <div className="w-10 h-6 bg-amber-600 rounded-full relative cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Sales Performance</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-amber-50 rounded-lg">
                    <p className="text-2xl font-bold text-amber-600">6,847</p>
                    <p className="text-sm text-amber-600">Page Views</p>
                    <p className="text-xs text-gray-500">This month</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">425</p>
                    <p className="text-sm text-green-600">Enquiries</p>
                    <p className="text-xs text-gray-500">This month</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">67</p>
                    <p className="text-sm text-purple-600">Show Home Visits</p>
                    <p className="text-xs text-gray-500">This week</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">18</p>
                    <p className="text-sm text-blue-600">New Reservations</p>
                    <p className="text-xs text-gray-500">This month</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}