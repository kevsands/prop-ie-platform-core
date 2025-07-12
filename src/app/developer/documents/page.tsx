'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Building2, 
  Plus, 
  Search, 
  Filter,
  Settings,
  Upload,
  Download,
  Eye,
  Edit,
  BarChart3,
  Users,
  Calendar,
  Shield,
  Archive,
  Folder,
  CheckCircle,
  Clock,
  AlertTriangle,
  Star,
  BookOpen,
  Scale,
  ClipboardList,
  Zap,
  Calculator,
  Wrench,
  Award,
  Home
} from 'lucide-react';
import EnterpriseDocumentTemplateManager from '@/components/documents/EnterpriseDocumentTemplateManager';
import RFPTemplateBuilder from '@/components/documents/templates/RFPTemplateBuilder';
import LegalContractTemplateBuilder from '@/components/documents/templates/LegalContractTemplateBuilder';
import AuthorizationTemplateBuilder from '@/components/documents/templates/AuthorizationTemplateBuilder';
import RIAIContractTemplateBuilder from '@/components/documents/templates/RIAIContractTemplateBuilder';
import BusinessPlanTemplateBuilder from '@/components/documents/templates/BusinessPlanTemplateBuilder';
import DynamicDocumentManager from '@/components/documents/dynamic/DynamicDocumentManager';
import EnterpriseFileUploadSystem from '@/components/documents/storage/EnterpriseFileUploadSystem';
import EnterpriseDocumentWorkflow from '@/components/documents/workflow/EnterpriseDocumentWorkflow';
import AutomaticDocumentFillers from '@/components/documents/automation/AutomaticDocumentFillers';
import DrawingManagementSystem from '@/components/documents/drawing/DrawingManagementSystem';
import PlanningComplianceTracker from '@/components/documents/compliance/PlanningComplianceTracker';

// Enterprise Projects Data
const ENTERPRISE_PROJECTS = {
  'fitzgerald-gardens': {
    id: 'fitzgerald-gardens',
    name: 'Fitzgerald Gardens',
    code: 'FG2025',
    location: 'Cork, Ireland',
    status: 'LIVE PRODUCTION',
    phase: 'Phase 1 - 15 Units Available',
    totalUnits: 15,
    soldUnits: 0,
    availableUnits: 15,
    targetCompletion: '2025-08-15',
    progress: 68,
    documentCount: 0
  },
  'ellwood': {
    id: 'ellwood',
    name: 'Ellwood',
    code: 'EW2024',
    location: 'Dublin, Ireland',
    status: 'SOLD OUT',
    phase: 'Completed - All Units Sold',
    totalUnits: 46,
    soldUnits: 46,
    availableUnits: 0,
    targetCompletion: 'COMPLETED',
    progress: 100,
    documentCount: 156
  },
  'ballymakenny-view': {
    id: 'ballymakenny-view',
    name: 'Ballymakenny View',
    code: 'BV2023',
    location: 'Drogheda, Ireland',
    status: '19/20 SOLD',
    phase: 'Near Completion',
    totalUnits: 20,
    soldUnits: 19,
    availableUnits: 0,
    targetCompletion: '2024-09-15',
    progress: 95,
    documentCount: 134
  }
};

// Document Categories for Enterprise Management
const DOCUMENT_CATEGORIES = {
  templates: {
    name: 'Document Templates',
    description: 'Professional templates for all document types',
    icon: <FileText className="w-5 h-5" />,
    count: 25
  },
  contracts: {
    name: 'Contracts & Agreements',
    description: 'RIAI forms, sale contracts, and legal agreements',
    icon: <Scale className="w-5 h-5" />,
    count: 8
  },
  planning: {
    name: 'Planning & Regulatory',
    description: 'Planning applications and regulatory compliance',
    icon: <Shield className="w-5 h-5" />,
    count: 12
  },
  financial: {
    name: 'Financial Documents',
    description: 'Bills of quantities, appraisals, and dynamic financial trackers',
    icon: <BarChart3 className="w-5 h-5" />,
    count: 18
  },
  drawings: {
    name: 'Drawings & Plans',
    description: 'Technical drawings, plans, and as-built documentation',
    icon: <Building2 className="w-5 h-5" />,
    count: 45
  },
  compliance: {
    name: 'Compliance & Certificates',
    description: 'Building control, safety certificates, and compliance docs',
    icon: <CheckCircle className="w-5 h-5" />,
    count: 18
  },
  professional: {
    name: 'Professional Services',
    description: 'QS cost reports, architect plans, engineer deliverables',
    icon: <Award className="w-5 h-5" />,
    count: 24
  }
};

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [showTemplateBuilder, setShowTemplateBuilder] = useState(false);
  const [builderType, setBuilderType] = useState<string>('');

  const handleCreateTemplate = (type: string) => {
    setBuilderType(type);
    setShowTemplateBuilder(true);
  };

  const handleSaveTemplate = (templateData: any) => {
    console.log('Saving template:', templateData);
    setShowTemplateBuilder(false);
    setBuilderType('');
    // Here you would save to your backend
  };

  const handleCancelTemplate = () => {
    setShowTemplateBuilder(false);
    setBuilderType('');
  };

  if (showTemplateBuilder) {
    switch (builderType) {
      case 'rfp':
        return (
          <RFPTemplateBuilder
            onSave={handleSaveTemplate}
            onCancel={handleCancelTemplate}
            projectId={selectedProject}
          />
        );
      case 'legal_contract':
        return (
          <LegalContractTemplateBuilder
            onSave={handleSaveTemplate}
            onCancel={handleCancelTemplate}
            projectId={selectedProject}
          />
        );
      case 'authorization':
        return (
          <AuthorizationTemplateBuilder
            onSave={handleSaveTemplate}
            onCancel={handleCancelTemplate}
            projectId={selectedProject}
          />
        );
      case 'riai':
        return (
          <RIAIContractTemplateBuilder
            onSave={handleSaveTemplate}
            onCancel={handleCancelTemplate}
            projectId={selectedProject}
          />
        );
      case 'business_plan':
        return (
          <BusinessPlanTemplateBuilder
            onSave={handleSaveTemplate}
            onCancel={handleCancelTemplate}
            projectId={selectedProject}
          />
        );
      case 'dynamic_documents':
        return (
          <DynamicDocumentManager
            onSave={handleSaveTemplate}
            projectId={selectedProject}
          />
        );
      case 'file_storage':
        return (
          <EnterpriseFileUploadSystem
            projectId={selectedProject}
            onFileUpload={handleSaveTemplate}
          />
        );
      case 'workflow_management':
        return (
          <EnterpriseDocumentWorkflow
            onClose={handleCancelTemplate}
            projectId={selectedProject}
          />
        );
      case 'automatic_fillers':
        return (
          <AutomaticDocumentFillers
            onSave={handleSaveTemplate}
            onCancel={handleCancelTemplate}
            projectId={selectedProject}
          />
        );
      case 'drawing_management':
        return (
          <DrawingManagementSystem
            projectId={selectedProject}
            onSave={handleSaveTemplate}
            onClose={handleCancelTemplate}
          />
        );
      case 'compliance_tracking':
        return (
          <PlanningComplianceTracker
            projectId={selectedProject}
            onSave={handleSaveTemplate}
            onClose={handleCancelTemplate}
          />
        );
      case 'quantity_surveyor':
        return (
          <div className="container mx-auto py-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Calculator className="w-8 h-8 text-blue-600" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quantity Surveyor Template Builder</h1>
                    <p className="text-gray-600">Create professional QS documents and cost reports</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCancelTemplate}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveTemplate({ type: 'quantity_surveyor', template: 'created' })}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save Template
                  </button>
                </div>
              </div>
              <div className="text-center py-12">
                <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Quantity Surveyor Template Builder</h3>
                <p className="text-gray-600">Professional QS templates including BOQ, cost estimates, and valuation reports</p>
              </div>
            </div>
          </div>
        );
      case 'architect':
        return (
          <div className="container mx-auto py-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Home className="w-8 h-8 text-blue-600" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Architect Template Builder</h1>
                    <p className="text-gray-600">Create professional architectural documents and plans</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCancelTemplate}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveTemplate({ type: 'architect', template: 'created' })}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save Template
                  </button>
                </div>
              </div>
              <div className="text-center py-12">
                <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Architect Template Builder</h3>
                <p className="text-gray-600">Professional architectural templates including drawings, specifications, and design documents</p>
              </div>
            </div>
          </div>
        );
      case 'engineer':
        return (
          <div className="container mx-auto py-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Wrench className="w-8 h-8 text-blue-600" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Engineer Template Builder</h1>
                    <p className="text-gray-600">Create professional engineering documents and reports</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCancelTemplate}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveTemplate({ type: 'engineer', template: 'created' })}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save Template
                  </button>
                </div>
              </div>
              <div className="text-center py-12">
                <Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Engineer Template Builder</h3>
                <p className="text-gray-600">Professional engineering templates including structural, civil, and M&E documentation</p>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Unknown template type</div>;
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enterprise Document Management</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive document management for Irish property development projects
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Projects</option>
            {Object.values(ENTERPRISE_PROJECTS).map(project => (
              <option key={project.id} value={project.id}>
                {project.name} ({project.code})
              </option>
            ))}
          </select>
          
          <button 
            onClick={() => handleCreateTemplate('file_storage')}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Documents
          </button>
          
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              Create Template
            </button>
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 w-48">
              <button
                onClick={() => handleCreateTemplate('rfp')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
              >
                <ClipboardList className="w-4 h-4" />
                RFP Template
              </button>
              <button
                onClick={() => handleCreateTemplate('legal_contract')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
              >
                <Scale className="w-4 h-4" />
                Legal Contract
              </button>
              <button
                onClick={() => handleCreateTemplate('authorization')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
              >
                <Shield className="w-4 h-4" />
                Authorization
              </button>
              <button
                onClick={() => handleCreateTemplate('riai')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
              >
                <Building2 className="w-4 h-4" />
                RIAI Contract
              </button>
              <button
                onClick={() => handleCreateTemplate('business_plan')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
              >
                <BarChart3 className="w-4 h-4" />
                Business Plan
              </button>
              <div className="border-t border-gray-200 my-1"></div>
              <button
                onClick={() => handleCreateTemplate('dynamic_documents')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
              >
                <Settings className="w-4 h-4" />
                Dynamic Documents
              </button>
              <button
                onClick={() => handleCreateTemplate('file_storage')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
              >
                <Upload className="w-4 h-4" />
                File Storage & Management
              </button>
              <button
                onClick={() => handleCreateTemplate('workflow_management')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
              >
                <Users className="w-4 h-4" />
                Workflow & Approvals
              </button>
              <div className="border-t border-gray-200 my-1"></div>
              <button
                onClick={() => handleCreateTemplate('automatic_fillers')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
              >
                <Zap className="w-4 h-4" />
                Automatic Document Fillers
              </button>
              <button
                onClick={() => handleCreateTemplate('drawing_management')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
              >
                <Folder className="w-4 h-4" />
                Drawing Management
              </button>
              <button
                onClick={() => handleCreateTemplate('compliance_tracking')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
              >
                <Shield className="w-4 h-4" />
                Compliance Tracker
              </button>
              <div className="border-t border-gray-200 my-1"></div>
              <button
                onClick={() => handleCreateTemplate('quantity_surveyor')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
              >
                <Calculator className="w-4 h-4" />
                Quantity Surveyor
              </button>
              <button
                onClick={() => handleCreateTemplate('architect')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
              >
                <Home className="w-4 h-4" />
                Architect
              </button>
              <button
                onClick={() => handleCreateTemplate('engineer')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
              >
                <Wrench className="w-4 h-4" />
                Engineer
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'templates', label: 'Templates', icon: <FileText className="w-4 h-4" /> },
            { id: 'projects', label: 'Projects', icon: <Building2 className="w-4 h-4" /> },
            { id: 'workflow', label: 'Workflow & Approvals', icon: <Users className="w-4 h-4" /> },
            { id: 'automation', label: 'Automation & Tools', icon: <Zap className="w-4 h-4" /> },
            { id: 'compliance', label: 'Compliance', icon: <Shield className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-1 py-4 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Documents</p>
                  <p className="text-2xl font-bold text-gray-900">290</p>
                  <p className="text-xs text-green-600 mt-1">+12 this week</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                  <p className="text-xs text-blue-600 mt-1">All tracked</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Approvals</p>
                  <p className="text-2xl font-bold text-gray-900">7</p>
                  <p className="text-xs text-amber-600 mt-1">2 urgent</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Templates</p>
                  <p className="text-2xl font-bold text-gray-900">25</p>
                  <p className="text-xs text-purple-600 mt-1">Ready to use</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Document Categories */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(DOCUMENT_CATEGORIES).map(([key, category]) => (
                <div key={key} className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {category.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{category.name}</h4>
                        <p className="text-sm text-gray-600">{category.count} documents</p>
                      </div>
                    </div>
                    <Eye className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Professional Services */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <a 
                href="/developer/team/quantity-surveyors"
                className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <Calculator className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Quantity Surveyors</h4>
                      <p className="text-sm text-gray-600">Cost management</p>
                    </div>
                  </div>
                  <Eye className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <p className="text-sm text-gray-600">Professional QS team for cost estimates, BOQ, and valuation reports</p>
              </a>
              
              <a 
                href="/developer/team/architects"
                className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <Home className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Architects</h4>
                      <p className="text-sm text-gray-600">Design & planning</p>
                    </div>
                  </div>
                  <Eye className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <p className="text-sm text-gray-600">Architectural design team for drawings, specifications, and planning</p>
              </a>
              
              <a 
                href="/developer/team/engineers"
                className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <Wrench className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Engineers</h4>
                      <p className="text-sm text-gray-600">Technical services</p>
                    </div>
                  </div>
                  <Eye className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <p className="text-sm text-gray-600">Engineering team for structural, civil, and M&E documentation</p>
              </a>
              
              <a 
                href="/developer/team/professionals"
                className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                      <Award className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Other Professionals</h4>
                      <p className="text-sm text-gray-600">Specialist services</p>
                    </div>
                  </div>
                  <Eye className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <p className="text-sm text-gray-600">Specialist professionals including legal, financial, and planning experts</p>
              </a>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Recent Document Activity</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { type: 'workflow', message: 'Planning approval workflow started for Fitzgerald Gardens Phase 2', time: '1 hour ago', user: 'Planning Manager' },
                  { type: 'approval', message: 'Technical review stage completed in planning workflow', time: '3 hours ago', user: 'Technical Team' },
                  { type: 'automation', message: 'Automatic ESB connection application generated for Fitzgerald Gardens', time: '4 hours ago', user: 'Development Team' },
                  { type: 'upload', message: 'Planning application documents uploaded for Fitzgerald Gardens', time: '5 hours ago', user: 'Planning Team' },
                  { type: 'create', message: 'New business plan template created for residential development', time: '1 day ago', user: 'Project Manager' },
                  { type: 'compliance', message: 'Planning compliance tracker updated with new requirements', time: '1 day ago', user: 'Compliance Officer' },
                  { type: 'drawing', message: 'Architectural drawings uploaded for Ballymakenny View', time: '2 days ago', user: 'Architect' },
                  { type: 'update', message: 'Dynamic BOQ updated with real-time calculations', time: '2 days ago', user: 'Quantity Surveyor' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'upload' ? 'bg-blue-100' :
                      activity.type === 'approval' ? 'bg-green-100' :
                      activity.type === 'create' ? 'bg-purple-100' :
                      activity.type === 'workflow' ? 'bg-indigo-100' :
                      activity.type === 'automation' ? 'bg-green-100' :
                      activity.type === 'compliance' ? 'bg-purple-100' :
                      activity.type === 'drawing' ? 'bg-blue-100' :
                      'bg-amber-100'
                    }`}>
                      {activity.type === 'upload' ? <Upload className="w-4 h-4 text-blue-600" /> :
                       activity.type === 'approval' ? <CheckCircle className="w-4 h-4 text-green-600" /> :
                       activity.type === 'create' ? <Plus className="w-4 h-4 text-purple-600" /> :
                       activity.type === 'workflow' ? <Users className="w-4 h-4 text-indigo-600" /> :
                       activity.type === 'automation' ? <Zap className="w-4 h-4 text-green-600" /> :
                       activity.type === 'compliance' ? <Shield className="w-4 h-4 text-purple-600" /> :
                       activity.type === 'drawing' ? <Building2 className="w-4 h-4 text-blue-600" /> :
                       <Edit className="w-4 h-4 text-amber-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time} • {activity.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'templates' && (
        <EnterpriseDocumentTemplateManager
          projectId={selectedProject}
          onTemplateSelect={(template) => console.log('Selected template:', template)}
        />
      )}
      
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Project Document Management</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Object.values(ENTERPRISE_PROJECTS).map(project => (
              <div key={project.id} className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                  <div className="absolute top-4 left-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'LIVE PRODUCTION' ? 'bg-green-100 text-green-800' :
                      project.status === 'SOLD OUT' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h4 className="font-semibold text-lg">{project.name}</h4>
                    <p className="text-sm opacity-90">{project.location}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-4 text-center mb-4">
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{project.totalUnits}</p>
                      <p className="text-xs text-gray-600">Total Units</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-green-600">{project.soldUnits}</p>
                      <p className="text-xs text-gray-600">Sold</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-blue-600">{project.documentCount}</p>
                      <p className="text-xs text-gray-600">Documents</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Progress: {project.progress}%</span>
                    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                      View Documents
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {activeTab === 'workflow' && (
        <EnterpriseDocumentWorkflow
          projectId={selectedProject}
        />
      )}
      
      {activeTab === 'automation' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Automation & Tools</h3>
            <p className="text-gray-600 mb-6">Automate document creation and manage technical drawings and compliance.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div 
              onClick={() => handleCreateTemplate('automatic_fillers')}
              className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Automatic Document Fillers</h4>
                  <p className="text-sm text-gray-600">Pre-filled applications</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Generate pre-filled applications for Homebond, Irish Water, ESB, and other Irish utility providers.</p>
            </div>
            
            <div 
              onClick={() => handleCreateTemplate('drawing_management')}
              className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Folder className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Drawing Management</h4>
                  <p className="text-sm text-gray-600">Technical drawings & plans</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Manage architectural, structural, civil, M&E, and landscape drawings with schedules of accommodation.</p>
            </div>
            
            <div 
              onClick={() => handleCreateTemplate('compliance_tracking')}
              className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Compliance Tracker</h4>
                  <p className="text-sm text-gray-600">Irish planning compliance</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Track Irish planning permission, building regulations, and regulatory compliance requirements.</p>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'compliance' && (
        <PlanningComplianceTracker
          projectId={selectedProject}
          onSave={handleSaveTemplate}
          onClose={() => setActiveTab('overview')}
        />
      )}
    </div>
  );
}