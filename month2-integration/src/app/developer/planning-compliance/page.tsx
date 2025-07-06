'use client';

import React, { useState } from 'react';
import { 
  Shield, 
  FileText, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Upload,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  Building2,
  Gavel,
  Users,
  MapPin,
  Target,
  AlertCircle,
  X,
  ChevronDown,
  ChevronRight,
  Bookmark,
  Hash,
  Globe,
  Mail,
  Phone
} from 'lucide-react';

export default function PlanningCompliancePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [expandedCompliance, setExpandedCompliance] = useState(new Set(['conditions']));

  // Projects with planning compliance data
  const projects = [
    {
      id: 'fitzgerald',
      name: 'Fitzgerald Gardens',
      planningRef: 'CC23/0156',
      eplanningUrl: 'https://eplanning.corkcoco.ie/swiftlg/apas/run/WPHAPPDETAIL.DisplayUrl?theApnID=CC23/0156',
      status: 'active',
      grantDate: '2024-03-15',
      units: 96,
      currentPhase: 'Construction',
      compliance: 87,
      location: 'Cork',
      authority: 'Cork County Council'
    },
    {
      id: 'ellwood',
      name: 'Ellwood',
      planningRef: 'DCC24/0089',
      eplanningUrl: 'https://eplanning.dublincity.ie/swiftlg/apas/run/WPHAPPDETAIL.DisplayUrl?theApnID=DCC24/0089',
      status: 'completed',
      grantDate: '2024-01-20',
      units: 46,
      currentPhase: 'Completed',
      compliance: 100,
      location: 'Dublin',
      authority: 'Dublin City Council'
    },
    {
      id: 'ballymakenny',
      name: 'Ballymakenny View',
      planningRef: 'DRG22/0234',
      eplanningUrl: 'https://eplanning.louthcoco.ie/swiftlg/apas/run/WPHAPPDETAIL.DisplayUrl?theApnID=DRG22/0234',
      status: 'near-completion',
      grantDate: '2023-08-10',
      units: 20,
      currentPhase: 'Final Occupancy',
      compliance: 98,
      location: 'Drogheda',
      authority: 'Louth County Council'
    }
  ];

  // Planning conditions and compliance items
  const complianceItems = [
    {
      id: 'cond-001',
      project: 'fitzgerald',
      type: 'condition',
      category: 'Construction',
      title: 'Archaeological Monitoring',
      description: 'Archaeological monitoring during all groundworks and foundation excavation',
      status: 'compliant',
      dueDate: '2025-12-31',
      progress: 100,
      conditionNumber: '3',
      evidence: ['Archaeological Report Phase 1.pdf', 'Site Monitoring Log.xlsx'],
      assignedTo: 'Heritage Consultant - Dr. Mary Flynn',
      contact: 'mary.flynn@heritageirl.ie'
    },
    {
      id: 'cond-002',
      project: 'fitzgerald',
      type: 'condition',
      category: 'Environment',
      title: 'Construction Management Plan',
      description: 'Submission and implementation of detailed Construction Management Plan',
      status: 'in-progress',
      dueDate: '2025-07-15',
      progress: 75,
      conditionNumber: '7',
      evidence: ['CMP Draft v2.pdf'],
      assignedTo: 'Site Manager - Patrick Murphy',
      contact: 'pmurphy@murphycon.ie'
    },
    {
      id: 'cond-003',
      project: 'fitzgerald',
      type: 'condition',
      category: 'Transport',
      title: 'Traffic Management Plan',
      description: 'Implementation of agreed traffic management measures during construction',
      status: 'pending',
      dueDate: '2025-08-01',
      progress: 25,
      conditionNumber: '12',
      evidence: [],
      assignedTo: 'Traffic Consultant - Roads & Transport Ltd',
      contact: 'info@roadsandtransport.ie'
    },
    {
      id: 'cond-004',
      project: 'fitzgerald',
      type: 'part-v',
      category: 'Social Housing',
      title: 'Part V Compliance - 12 Units',
      description: 'Transfer of 12 units to Cork County Council as Part V social housing obligation',
      status: 'compliant',
      dueDate: '2025-06-30',
      progress: 100,
      conditionNumber: 'Part V',
      evidence: ['Part V Agreement.pdf', 'Unit Transfer Schedule.xlsx', 'Cork CC Confirmation.pdf'],
      assignedTo: 'Legal Team - Murphy & Associates',
      contact: 'legal@murphyassoc.ie',
      partVDetails: {
        totalObligation: 12,
        unitsTransferred: 12,
        transferValue: '€4,050,000',
        transferDate: '2025-06-15',
        councilContact: 'housing@corkcoco.ie'
      }
    },
    {
      id: 'cond-005',
      project: 'ellwood',
      type: 'condition',
      category: 'Environment',
      title: 'NZEB Certification',
      description: 'Nearly Zero Energy Building certification for all residential units',
      status: 'compliant',
      dueDate: '2024-12-31',
      progress: 100,
      conditionNumber: '5',
      evidence: ['NZEB Certificate.pdf', 'Energy Performance Reports.zip'],
      assignedTo: 'NZEB Consultant - Green Building Solutions',
      contact: 'cert@greenbuilding.ie'
    },
    {
      id: 'cond-006',
      project: 'ballymakenny',
      type: 'condition',
      category: 'Landscaping',
      title: 'Landscape Bond Release',
      description: 'Final landscaping completion and bond release application',
      status: 'in-progress',
      dueDate: '2025-07-01',
      progress: 90,
      conditionNumber: '8',
      evidence: ['Landscape Completion Report.pdf'],
      assignedTo: 'Landscape Architect - McGrath Landscapes',
      contact: 'paul@mcgrathland.ie'
    }
  ];

  // Compliance categories
  const complianceCategories = [
    { id: 'construction', name: 'Construction', icon: Building2, color: 'orange' },
    { id: 'environment', name: 'Environmental', icon: Shield, color: 'green' },
    { id: 'transport', name: 'Transport', icon: Target, color: 'blue' },
    { id: 'social-housing', name: 'Social Housing', icon: Users, color: 'purple' },
    { id: 'landscaping', name: 'Landscaping', icon: MapPin, color: 'emerald' },
    { id: 'utilities', name: 'Utilities', icon: Gavel, color: 'gray' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'in-progress':
        return <Clock size={16} className="text-blue-600" />;
      case 'pending':
        return <AlertTriangle size={16} className="text-amber-600" />;
      case 'overdue':
        return <AlertCircle size={16} className="text-red-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const filteredCompliance = complianceItems.filter(item => {
    if (selectedProject !== 'all' && item.project !== selectedProject) return false;
    if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Shield size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Planning Compliance Management</h1>
                <p className="text-gray-600">Monitor planning conditions and regulatory compliance across all projects</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Add Condition
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 size={20} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Compliant</p>
              <p className="text-2xl font-bold text-green-600">
                {complianceItems.filter(item => item.status === 'compliant').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">
                {complianceItems.filter(item => item.status === 'in-progress').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock size={20} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-amber-600">
                {complianceItems.filter(item => item.status === 'pending').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <AlertTriangle size={20} className="text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b">
          <nav className="flex overflow-x-auto">
            {[
              { id: 'overview', label: 'Projects Overview', icon: Building2 },
              { id: 'conditions', label: 'Planning Conditions', icon: FileText },
              { id: 'part-v', label: 'Part V Compliance', icon: Users },
              { id: 'monitoring', label: 'Compliance Monitoring', icon: Shield }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Project Planning Status</h3>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Sync ePlanning.ie
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">{project.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin size={14} />
                          <span>{project.location}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === 'completed' ? 'bg-green-100 text-green-800' :
                        project.status === 'near-completion' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {project.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Planning Ref:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{project.planningRef}</span>
                          <button 
                            onClick={() => window.open(project.eplanningUrl, '_blank')}
                            className="text-purple-600 hover:text-purple-800"
                            title="View on ePlanning.ie"
                          >
                            <ExternalLink size={14} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Planning Authority:</span>
                        <span className="font-medium">{project.authority}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Grant Date:</span>
                        <span className="font-medium">{new Date(project.grantDate).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Total Units:</span>
                        <span className="font-medium">{project.units}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Current Phase:</span>
                        <span className="font-medium">{project.currentPhase}</span>
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Compliance</span>
                          <span className="text-sm text-gray-600">{project.compliance}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              project.compliance >= 95 ? 'bg-green-500' :
                              project.compliance >= 75 ? 'bg-blue-500' :
                              'bg-amber-500'
                            }`}
                            style={{ width: `${project.compliance}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button className="flex-1 px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        View Details
                      </button>
                      <button className="px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Reports
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'conditions' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-lg font-semibold text-gray-900">Planning Conditions Tracking</h3>
                
                <div className="flex gap-2">
                  <select 
                    value={selectedProject} 
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="all">All Projects</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                  
                  <select 
                    value={selectedStatus} 
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="compliant">Compliant</option>
                    <option value="in-progress">In Progress</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {filteredCompliance.map((item) => (
                  <div key={item.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{item.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                            {getStatusIcon(item.status)}
                            <span className="ml-1">{item.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {item.type === 'part-v' ? 'Part V' : `Condition ${item.conditionNumber}`}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Project:</span>
                            <span className="ml-2 font-medium">
                              {projects.find(p => p.id === item.project)?.name}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Due Date:</span>
                            <span className="ml-2 font-medium">{new Date(item.dueDate).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Assigned To:</span>
                            <span className="ml-2 font-medium">{item.assignedTo}</span>
                          </div>
                        </div>

                        {item.type === 'part-v' && item.partVDetails && (
                          <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                            <h5 className="font-medium text-purple-900 mb-2">Part V Social Housing Details</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                              <div>
                                <span className="text-purple-700">Units Transferred:</span>
                                <span className="ml-2 font-medium">{item.partVDetails.unitsTransferred}/{item.partVDetails.totalObligation}</span>
                              </div>
                              <div>
                                <span className="text-purple-700">Transfer Value:</span>
                                <span className="ml-2 font-medium">{item.partVDetails.transferValue}</span>
                              </div>
                              <div>
                                <span className="text-purple-700">Transfer Date:</span>
                                <span className="ml-2 font-medium">{new Date(item.partVDetails.transferDate).toLocaleDateString()}</span>
                              </div>
                              <div>
                                <span className="text-purple-700">Council Contact:</span>
                                <span className="ml-2 font-medium">{item.partVDetails.councilContact}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">Progress</span>
                            <span className="text-sm text-gray-600">{item.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                item.progress >= 95 ? 'bg-green-500' :
                                item.progress >= 75 ? 'bg-blue-500' :
                                'bg-amber-500'
                              }`}
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                        </div>

                        {item.evidence.length > 0 && (
                          <div className="mt-4">
                            <span className="text-sm font-medium text-gray-700 block mb-2">Evidence Files:</span>
                            <div className="flex flex-wrap gap-2">
                              {item.evidence.map((file, index) => (
                                <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded flex items-center gap-1">
                                  <FileText size={12} />
                                  {file}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 ml-4">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'part-v' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Part V Social Housing Compliance</h3>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Generate Part V Report
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {projects.map((project) => {
                  const partVItems = complianceItems.filter(item => 
                    item.project === project.id && item.type === 'part-v'
                  );
                  
                  return (
                    <div key={project.id} className="border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">{project.name}</h4>
                        <span className="text-sm text-gray-600">{project.planningRef}</span>
                      </div>

                      {partVItems.length > 0 ? (
                        partVItems.map((item) => (
                          <div key={item.id} className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Users size={16} className="text-purple-600" />
                              <span className="font-medium text-gray-900">Part V Obligation</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                {item.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </span>
                            </div>

                            {item.partVDetails && (
                              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                <div className="grid grid-cols-1 gap-3 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-purple-700">Total Obligation:</span>
                                    <span className="font-medium">{item.partVDetails.totalObligation} units</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-purple-700">Units Transferred:</span>
                                    <span className="font-medium">{item.partVDetails.unitsTransferred}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-purple-700">Transfer Value:</span>
                                    <span className="font-medium">{item.partVDetails.transferValue}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-purple-700">Transfer Date:</span>
                                    <span className="font-medium">{new Date(item.partVDetails.transferDate).toLocaleDateString()}</span>
                                  </div>
                                </div>

                                <div className="mt-3 pt-3 border-t border-purple-200">
                                  <div className="flex items-center gap-2 text-sm">
                                    <Mail size={14} className="text-purple-600" />
                                    <span className="text-purple-700">{item.partVDetails.councilContact}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Users size={24} className="mx-auto mb-2 text-gray-400" />
                          <p className="text-sm">No Part V obligations for this project</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'monitoring' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Compliance Monitoring Dashboard</h3>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Schedule Inspection
                  </button>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    Generate Report
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {complianceCategories.map((category) => {
                  const categoryItems = complianceItems.filter(item => 
                    item.category.toLowerCase().includes(category.id.replace('-', ''))
                  );
                  const compliantItems = categoryItems.filter(item => item.status === 'compliant');
                  
                  const getProgressBarColor = (color: string) => {
                    switch (color) {
                      case 'orange': return 'bg-orange-500';
                      case 'green': return 'bg-green-500';
                      case 'blue': return 'bg-blue-500';
                      case 'purple': return 'bg-purple-500';
                      case 'emerald': return 'bg-emerald-500';
                      case 'gray': return 'bg-gray-500';
                      default: return 'bg-blue-500';
                    }
                  };

                  const getIconBgColor = (color: string) => {
                    switch (color) {
                      case 'orange': return 'bg-orange-100';
                      case 'green': return 'bg-green-100';
                      case 'blue': return 'bg-blue-100';
                      case 'purple': return 'bg-purple-100';
                      case 'emerald': return 'bg-emerald-100';
                      case 'gray': return 'bg-gray-100';
                      default: return 'bg-blue-100';
                    }
                  };

                  const getIconColor = (color: string) => {
                    switch (color) {
                      case 'orange': return 'text-orange-600';
                      case 'green': return 'text-green-600';
                      case 'blue': return 'text-blue-600';
                      case 'purple': return 'text-purple-600';
                      case 'emerald': return 'text-emerald-600';
                      case 'gray': return 'text-gray-600';
                      default: return 'text-blue-600';
                    }
                  };
                  
                  return (
                    <div key={category.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-8 h-8 ${getIconBgColor(category.color)} rounded-lg flex items-center justify-center`}>
                          <category.icon size={16} className={getIconColor(category.color)} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{category.name}</h4>
                          <p className="text-sm text-gray-600">{categoryItems.length} conditions</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Compliance Rate</span>
                          <span className="font-medium">
                            {categoryItems.length > 0 ? Math.round((compliantItems.length / categoryItems.length) * 100) : 0}%
                          </span>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getProgressBarColor(category.color)}`}
                            style={{ 
                              width: `${categoryItems.length > 0 ? (compliantItems.length / categoryItems.length) * 100 : 0}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <h4 className="font-medium text-gray-900">Recent Compliance Activities</h4>
                </div>
                
                <div className="divide-y">
                  {complianceItems.slice(0, 8).map((item) => (
                    <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(item.status)}
                        <div>
                          <p className="font-medium text-gray-900">{item.title}</p>
                          <p className="text-sm text-gray-600">
                            {projects.find(p => p.id === item.project)?.name} • Due {new Date(item.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        <button className="text-gray-400 hover:text-gray-600">
                          <ExternalLink size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Condition Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Add Planning Condition</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="">Select Project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Condition Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="">Select Type</option>
                    <option value="condition">Planning Condition</option>
                    <option value="part-v">Part V Obligation</option>
                    <option value="bond">Financial Bond</option>
                    <option value="covenant">Development Covenant</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="">Select Category</option>
                    <option value="Construction">Construction</option>
                    <option value="Environment">Environmental</option>
                    <option value="Transport">Transport</option>
                    <option value="Social Housing">Social Housing</option>
                    <option value="Landscaping">Landscaping</option>
                    <option value="Utilities">Utilities</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Condition Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g., 5, Part V, Bond A"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition Title</label>
                <input 
                  type="text" 
                  placeholder="Brief descriptive title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea 
                  rows={4} 
                  placeholder="Detailed description of the planning condition or requirement"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="compliant">Compliant</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Progress (%)</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100" 
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                <input 
                  type="text" 
                  placeholder="Name and company of responsible party"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                <input 
                  type="email" 
                  placeholder="contact@company.ie"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Evidence Files</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
                  <Upload size={24} className="mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-2">Drop files here or click to upload</p>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                    Choose Files
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Add Condition
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}