'use client';

import React, { useState } from 'react';
import useProjectData from '@/hooks/useProjectData';
import { 
  Building2, 
  Users, 
  MapPin, 
  Calendar, 
  Euro, 
  FileText, 
  Settings, 
  BarChart3,
  Eye,
  Download,
  Share,
  Edit,
  Edit3,
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
  Activity,
  ArrowUpRight,
  Cpu
} from 'lucide-react';
import Link from 'next/link';
import InteractiveSitePlan from '@/components/developer/InteractiveSitePlan';
import TeamManagement from '@/components/developer/TeamManagement';
import InvoiceManagement from '@/components/developer/InvoiceManagement';
import AIPricingAnalytics from '@/components/developer/AIPricingAnalytics';
import EnhancedProjectAnalytics from '@/components/developer/EnhancedProjectAnalytics';
import LiveUnitManager from '@/components/developer/LiveUnitManager';
import EnterpriseUnitManager from '@/components/developer/EnterpriseUnitManager';
import ProjectTimelineDashboard from '@/components/developer/ProjectTimelineDashboard';
import EnhancedTeamDashboard from '@/components/developer/EnhancedTeamDashboard';
import ComprehensiveTeamManagement from '@/components/developer/ComprehensiveTeamManagement';
import FinancialOverviewDashboard from '@/components/developer/FinancialOverviewDashboard';
import AIMarketIntelligence from '@/components/developer/AIMarketIntelligence';
import BuyerJourneyTracker from '@/components/developer/BuyerJourneyTracker';
import InvestmentAnalysisTools from '@/components/developer/InvestmentAnalysisTools';
import TransactionTriangleDashboard from '@/components/developer/TransactionTriangleDashboard';
import EnhancedFinancialManagement from '@/components/developer/EnhancedFinancialManagement';
import EnterpriseFinancialManager from '@/components/developer/EnterpriseFinancialManager';
import EnterpriseAnalyticsEngine from '@/components/developer/EnterpriseAnalyticsEngine';
import EnterpriseTransactionManager from '@/components/developer/EnterpriseTransactionManager';
import EnterpriseTeamManager from '@/components/developer/EnterpriseTeamManager';
import EnterpriseInvoiceManager from '@/components/developer/EnterpriseInvoiceManager';
import EditableProjectOverview from '@/components/developer/EditableProjectOverview';
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
      return;
    }

    // Sync with properties availability API for real-time cross-platform updates
    try {
      const unit = units.find(u => u.id === unitId);
      if (unit) {
        const syncResponse = await fetch('/api/properties/availability', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            developmentId: 'fitzgerald-gardens',
            units: [{
              id: unitId,
              status: newStatus,
              price: unit.price,
              unitNumber: unit.unitNumber,
              reason: 'Developer portal unit status update'
            }],
            source: 'developer-unit-management'
          })
        });

        if (syncResponse.ok) {
          const syncData = await syncResponse.json();
          console.log('Unit status synced across platform:', syncData);
        } else {
          console.warn('Failed to sync unit status to availability API');
        }
      }
    } catch (error) {
      console.error('Error syncing unit status:', error);
    }
  };

  // Get optimized units for site plan from data service
  const siteUnits = getUnitsForSitePlan();

  // Tab configuration
  const tabs = [
    { id: 'overview', label: 'Project Overview', icon: Home },
    { id: 'advanced-analytics', label: 'Advanced Analytics Hub', icon: Activity, external: true, href: '/developer/projects/fitzgerald-gardens/analytics' },
    { id: 'enterprise-analytics', label: 'Enterprise Analytics Engine', icon: Cpu },
    { id: 'analytics', label: 'Enhanced Analytics', icon: BarChart3 },
    { id: 'intelligence', label: 'AI Market Intelligence', icon: Zap },
    { id: 'buyers', label: 'Buyer Journey Tracking', icon: UserCheck },
    { id: 'enterprise-transactions', label: 'Enterprise Transaction Manager', icon: Receipt },
    { id: 'transactions', label: 'Live Transactions', icon: Activity },
    { id: 'investment', label: 'Investment Analysis', icon: Briefcase },
    { id: 'timeline', label: 'Project Timeline', icon: Calendar },
    { id: 'units', label: 'Unit Management', icon: Building2 },
    { id: 'financials', label: 'Financial Overview', icon: Euro },
    { id: 'financial-management', label: 'Financial Management', icon: CreditCard },
    { id: 'pricing', label: 'AI Pricing Analytics', icon: Target },
    { id: 'media', label: 'Media & Plans', icon: Camera },
    { id: 'siteplan', label: 'Interactive Site Plan', icon: MapPin },
    { id: 'enterprise-team', label: 'Enterprise Team Manager', icon: UserCheck },
    { id: 'team', label: 'Team Management', icon: Users },
    { id: 'enterprise-invoices', label: 'Enterprise Invoice Manager', icon: CreditCard },
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
                <Euro size={16} className="text-purple-600" />
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

      {/* Main Content Area with Internal Sidebar */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="flex min-h-[700px]">
          {/* Internal Project Navigation Sidebar */}
          <div className="w-72 bg-gradient-to-b from-gray-50 to-gray-100 border-r border-gray-200 relative">
            {/* Sidebar Header */}
            <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
              <h3 className="text-lg font-bold">{project.name}</h3>
              <p className="text-green-100 text-sm">Project Management Hub</p>
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
                    {tabs.filter(tab => ['overview', 'timeline', 'units', 'financials'].includes(tab.id)).map((tab) => (
                      <li key={tab.id}>
                        <button
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                            activeTab === tab.id
                              ? 'bg-white text-green-700 shadow-md border border-green-100 transform scale-[1.02]'
                              : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${
                            activeTab === tab.id
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-200 text-gray-500'
                          }`}>
                            <tab.icon size={16} />
                          </div>
                          <span className="flex-1 text-left">{tab.label}</span>
                          {activeTab === tab.id && (
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Analytics & Intelligence */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                    Analytics & Intelligence
                  </h4>
                  <ul className="space-y-1">
                    {tabs.filter(tab => ['enterprise-analytics', 'analytics', 'intelligence', 'pricing', 'investment', 'financial-management'].includes(tab.id)).map((tab) => (
                      <li key={tab.id}>
                        {tab.external ? (
                          <Link
                            href={tab.href}
                            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-gray-600 hover:bg-white/60 hover:text-gray-900 group"
                          >
                            <div className="p-2 rounded-lg bg-gray-200 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600">
                              <tab.icon size={16} />
                            </div>
                            <span className="flex-1 text-left">{tab.label}</span>
                            <ArrowUpRight size={14} className="text-gray-400 group-hover:text-blue-600" />
                          </Link>
                        ) : (
                          <button
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                              activeTab === tab.id
                                ? 'bg-white text-blue-700 shadow-md border border-blue-100 transform scale-[1.02]'
                                : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
                            }`}
                          >
                            <div className={`p-2 rounded-lg ${
                              activeTab === tab.id
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-gray-200 text-gray-500'
                            }`}>
                              <tab.icon size={16} />
                            </div>
                            <span className="flex-1 text-left">{tab.label}</span>
                            {activeTab === tab.id && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            )}
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sales & Customer Management */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                    Sales & Customers
                  </h4>
                  <ul className="space-y-1">
                    {tabs.filter(tab => ['buyers', 'enterprise-transactions', 'transactions', 'marketing'].includes(tab.id)).map((tab) => (
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
                    {tabs.filter(tab => ['enterprise-team', 'team', 'enterprise-invoices', 'invoices', 'media', 'siteplan'].includes(tab.id)).map((tab) => (
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
                <div className="font-medium">{project.timeline.progressPercentage}% Complete</div>
                <div className="mt-1">Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Now'}</div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6 bg-white relative">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Overview Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
                        <div className="text-sm font-medium text-blue-600">
                          {typeof unit.priceRange === 'object' 
                            ? `€${Math.round(unit.priceRange.min).toLocaleString()} - €${Math.round(unit.priceRange.max).toLocaleString()}`
                            : unit.priceRange
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Comprehensive Editable Project Management */}
              <div className="border-t pt-6">
                <div className="flex items-center gap-3 mb-6">
                  <Edit3 className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Comprehensive Project Management</h3>
                </div>
                <EditableProjectOverview
                  projectId={project.id}
                  onSave={async (data) => {
                    try {
                      const response = await fetch(`/api/projects/${project.id}/comprehensive`, {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data)
                      });
                      return response.ok;
                    } catch (error) {
                      console.error('Failed to save project data:', error);
                      return false;
                    }
                  }}
                />
              </div>
            </div>
          )}


          {activeTab === 'enterprise-analytics' && (
            <EnterpriseAnalyticsEngine
              projectId={project.id}
              onMetricsUpdate={(metrics) => {
                console.log('Analytics metrics updated:', metrics);
              }}
            />
          )}

          {activeTab === 'analytics' && (
            <EnhancedProjectAnalytics
              projectId={project.id}
              units={units}
              totalRevenue={totalRevenue}
              averageUnitPrice={averageUnitPrice}
              salesVelocity={salesVelocity}
              conversionRate={conversionRate}
            />
          )}

          {activeTab === 'intelligence' && (
            <AIMarketIntelligence
              projectId={project.id}
              units={units}
              totalRevenue={totalRevenue}
              averageUnitPrice={averageUnitPrice}
            />
          )}

          {activeTab === 'buyers' && (
            <BuyerJourneyTracker
              projectId={project.id}
              units={units}
              soldUnits={soldUnits}
              reservedUnits={reservedUnits}
              totalRevenue={totalRevenue}
              salesVelocity={salesVelocity}
              conversionRate={conversionRate}
            />
          )}

          {activeTab === 'enterprise-transactions' && (
            <EnterpriseTransactionManager
              projectId={project.id}
              onTransactionUpdate={async (transactionId, updates) => {
                try {
                  const response = await fetch(`/api/projects/${project.id}/transactions/${transactionId}`, {
                    method: 'PATCH',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updates)
                  });
                  const result = await response.json();
                  return result.success;
                } catch (error) {
                  console.error('Failed to update transaction:', error);
                  return false;
                }
              }}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionTriangleDashboard
              projectId={project.id}
              units={units}
              soldUnits={soldUnits}
              reservedUnits={reservedUnits}
              totalRevenue={totalRevenue}
              salesVelocity={salesVelocity}
              conversionRate={conversionRate}
            />
          )}

          {activeTab === 'investment' && (
            <InvestmentAnalysisTools
              projectId={project.id}
              units={units}
              totalRevenue={totalRevenue}
              averageUnitPrice={averageUnitPrice}
            />
          )}

          {activeTab === 'timeline' && (
            <ProjectTimelineDashboard />
          )}

          {activeTab === 'units' && (
            <EnterpriseUnitManager
              projectId={project.id}
              onUnitUpdate={async (unitId, updates) => {
                try {
                  const response = await fetch(`/api/projects/${project.id}`, {
                    method: 'PATCH',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      type: 'unit_update',
                      unitId,
                      updates
                    })
                  });
                  const result = await response.json();
                  return result.success;
                } catch (error) {
                  console.error('Failed to update unit:', error);
                  return false;
                }
              }}
            />
          )}

          {activeTab === 'financials' && (
            <FinancialOverviewDashboard
              units={units}
              totalRevenue={totalRevenue}
              averageUnitPrice={averageUnitPrice}
              salesVelocity={salesVelocity}
              conversionRate={conversionRate}
              soldUnits={soldUnits}
              reservedUnits={reservedUnits}
              totalUnits={totalUnits}
            />
          )}

          {activeTab === 'financial-management' && (
            <EnterpriseFinancialManager
              projectId={project.id}
            />
          )}

          {activeTab === 'pricing' && (
            <AIPricingAnalytics 
              projectId={project?.id || 'fitzgerald-gardens'}
              units={units}
              onPriceUpdate={updateUnitPrice}
              totalRevenue={totalRevenue}
              averageUnitPrice={averageUnitPrice}
              salesVelocity={salesVelocity}
              conversionRate={conversionRate}
            />
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

          {activeTab === 'enterprise-team' && (
            <EnterpriseTeamManager
              projectId={project.id}
              onTeamUpdate={async (memberId, updates) => {
                try {
                  const response = await fetch(`/api/projects/${project.id}/team/${memberId}`, {
                    method: 'PATCH',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updates)
                  });
                  const result = await response.json();
                  return result.success;
                } catch (error) {
                  console.error('Failed to update team member:', error);
                  return false;
                }
              }}
            />
          )}

          {activeTab === 'team' && (
            <ComprehensiveTeamManagement 
              projectId="fitzgerald-gardens" 
              mode="project_specific" 
            />
          )}

          {activeTab === 'enterprise-invoices' && (
            <EnterpriseInvoiceManager
              projectId={project.id}
              onInvoiceUpdate={async (invoiceId, updates) => {
                try {
                  const response = await fetch(`/api/projects/${project.id}/invoices/${invoiceId}`, {
                    method: 'PATCH',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updates)
                  });
                  const result = await response.json();
                  return result.success;
                } catch (error) {
                  console.error('Failed to update invoice:', error);
                  return false;
                }
              }}
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