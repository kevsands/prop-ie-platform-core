'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Shield, 
  CheckCircle,
  AlertTriangle,
  Clock,
  XCircle,
  FileText,
  Calendar,
  User,
  MapPin,
  Building2,
  TreePine,
  Car,
  Accessibility,
  Zap,
  Droplets,
  Home,
  Flag,
  Eye,
  Download,
  Upload,
  Edit3,
  Plus,
  Search,
  Filter,
  Bell,
  Award,
  Scale,
  Globe,
  Info,
  Target,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

// Irish planning compliance categories
const COMPLIANCE_CATEGORIES = {
  planning_permission: {
    name: 'Planning Permission',
    description: 'Core planning permission and conditions compliance',
    icon: <Building2 className="w-5 h-5" />,
    color: 'blue',
    authority: 'Local Planning Authority',
    legislation: 'Planning and Development Act 2000'
  },
  building_regulations: {
    name: 'Building Regulations',
    description: 'Building control and safety compliance',
    icon: <Shield className="w-5 h-5" />,
    color: 'green',
    authority: 'Building Control Authority',
    legislation: 'Building Control Act 1990 & Regulations 1997-2022'
  },
  environmental: {
    name: 'Environmental Compliance',
    description: 'Environmental impact and sustainability requirements',
    icon: <TreePine className="w-5 h-5" />,
    color: 'emerald',
    authority: 'Environmental Protection Agency',
    legislation: 'Environmental Protection Agency Act 1992'
  },
  access_mobility: {
    name: 'Access & Mobility',
    description: 'Disability access and universal design compliance',
    icon: <Accessibility className="w-5 h-5" />,
    color: 'purple',
    authority: 'Building Control Authority',
    legislation: 'Disability Act 2005 & Building Regulations Part M'
  },
  fire_safety: {
    name: 'Fire Safety',
    description: 'Fire safety design and evacuation compliance',
    icon: <AlertTriangle className="w-5 h-5" />,
    color: 'red',
    authority: 'Building Control Authority',
    legislation: 'Building Regulations Part B'
  },
  infrastructure: {
    name: 'Infrastructure & Utilities',
    description: 'Water, electricity, and telecommunications infrastructure',
    icon: <Zap className="w-5 h-5" />,
    color: 'yellow',
    authority: 'Various Utility Providers',
    legislation: 'Infrastructure and Planning Acts'
  },
  social_housing: {
    name: 'Social Housing (Part V)',
    description: 'Social and affordable housing provision compliance',
    icon: <Home className="w-5 h-5" />,
    color: 'indigo',
    authority: 'Local Housing Authority',
    legislation: 'Planning and Development Act 2000 Part V'
  }
};

// Sample compliance tracking data for Fitzgerald Gardens
const SAMPLE_COMPLIANCE_DATA = {
  'fitzgerald-gardens': {
    projectName: 'Fitzgerald Gardens',
    planningRef: 'CK24/12345',
    authority: 'Cork County Council',
    grantedDate: '2024-09-15',
    commencementDate: '2024-10-01',
    completionDeadline: '2026-09-15',
    overallStatus: 'compliant',
    lastReviewDate: '2025-07-01',
    nextReviewDate: '2025-10-01',
    complianceScore: 92,
    requirements: [
      {
        id: 'req-001',
        category: 'planning_permission',
        title: 'Planning Permission Granted',
        description: 'Main planning permission for 15 residential units',
        status: 'compliant',
        dueDate: '2024-09-15',
        completedDate: '2024-09-15',
        authority: 'Cork County Council',
        reference: 'CK24/12345',
        priority: 'critical',
        evidence: ['Planning_Grant_Letter.pdf', 'Planning_Drawings_Approved.dwg'],
        notes: 'Planning permission granted with 12 standard conditions'
      },
      {
        id: 'req-002',
        category: 'planning_permission',
        title: 'Condition 3: Archaeological Survey',
        description: 'Archaeological impact assessment and monitoring required',
        status: 'compliant',
        dueDate: '2024-11-01',
        completedDate: '2024-10-28',
        authority: 'National Monuments Service',
        reference: 'CK24/12345/C3',
        priority: 'high',
        evidence: ['Archaeological_Survey_Report.pdf', 'NMS_Approval_Letter.pdf'],
        notes: 'Archaeological survey completed, no significant finds'
      },
      {
        id: 'req-003',
        category: 'building_regulations',
        title: 'Building Control Application',
        description: 'Building control notification and compliance',
        status: 'in_progress',
        dueDate: '2025-08-01',
        completedDate: null,
        authority: 'Cork County Council Building Control',
        reference: 'BC2024/0892',
        priority: 'high',
        evidence: ['BC_Application_Form.pdf', 'Structural_Calculations.pdf'],
        notes: 'Building control application submitted, awaiting final inspection'
      },
      {
        id: 'req-004',
        category: 'fire_safety',
        title: 'Fire Safety Certificate',
        description: 'Fire safety certificate for apartment building',
        status: 'compliant',
        dueDate: '2025-01-15',
        completedDate: '2025-01-10',
        authority: 'Cork County Council Building Control',
        reference: 'FSC2024/0445',
        priority: 'critical',
        evidence: ['Fire_Safety_Certificate.pdf', 'Fire_Consultant_Report.pdf'],
        notes: 'Fire safety certificate granted with minor conditions'
      },
      {
        id: 'req-005',
        category: 'access_mobility',
        title: 'Disability Access Certificate',
        description: 'Universal design and accessibility compliance',
        status: 'pending',
        dueDate: '2025-08-15',
        completedDate: null,
        authority: 'Cork County Council Building Control',
        reference: 'DAC2025/0234',
        priority: 'high',
        evidence: [],
        notes: 'Disability access certificate application to be submitted'
      },
      {
        id: 'req-006',
        category: 'environmental',
        title: 'Part V Social Housing Agreement',
        description: '10% social housing provision or payment in lieu',
        status: 'compliant',
        dueDate: '2024-12-01',
        completedDate: '2024-11-25',
        authority: 'Cork County Council Housing',
        reference: 'PV2024/FG001',
        priority: 'high',
        evidence: ['Part_V_Agreement.pdf', 'Payment_Receipt.pdf'],
        notes: 'Payment in lieu of €156,000 made for social housing provision'
      },
      {
        id: 'req-007',
        category: 'infrastructure',
        title: 'Irish Water Connection',
        description: 'Water and wastewater connection approval',
        status: 'at_risk',
        dueDate: '2025-09-01',
        completedDate: null,
        authority: 'Irish Water',
        reference: 'IW-CON-2024-8842',
        priority: 'critical',
        evidence: ['IW_Application.pdf'],
        notes: 'Connection approval delayed due to network capacity issues'
      },
      {
        id: 'req-008',
        category: 'infrastructure',
        title: 'ESB Networks Connection',
        description: 'Electricity supply connection for development',
        status: 'compliant',
        dueDate: '2025-07-01',
        completedDate: '2025-06-28',
        authority: 'ESB Networks',
        reference: 'ESB-NC-2024-5567',
        priority: 'high',
        evidence: ['ESB_Connection_Approval.pdf', 'Electrical_Design.pdf'],
        notes: 'Electricity connection approved and installed'
      },
      {
        id: 'req-009',
        category: 'environmental',
        title: 'Waste Management Plan',
        description: 'Construction and operational waste management',
        status: 'non_compliant',
        dueDate: '2025-06-01',
        completedDate: null,
        authority: 'Cork County Council Environment',
        reference: 'WMP2025/0334',
        priority: 'medium',
        evidence: [],
        notes: 'Waste management plan submission overdue, requires immediate attention'
      }
    ]
  }
};

interface PlanningComplianceTrackerProps {
  onClose?: () => void;
  onSave?: (data: any) => void;
  projectId?: string;
}

export default function PlanningComplianceTracker({
  onClose,
  onSave,
  projectId = 'fitzgerald-gardens'
}: PlanningComplianceTrackerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'timeline' | 'reports'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [complianceData, setComplianceData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load compliance data when component mounts or projectId changes
  useEffect(() => {
    if (projectId) {
      loadComplianceData();
    }
  }, [projectId]);

  const loadComplianceData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/documents/compliance', {
        params: {
          projectId: projectId,
          action: 'dashboard'
        }
      });
      setComplianceData(response.data.data);
    } catch (error) {
      console.error('Error loading compliance data:', error);
      setComplianceData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const createCompliance = async (complianceData: any) => {
    try {
      const response = await axios.post('/api/documents/compliance', {
        ...complianceData,
        projectId: projectId
      });
      
      // Refresh compliance data
      await loadComplianceData();
      
      if (onSave) {
        onSave(response.data.data);
      }
    } catch (error) {
      console.error('Error creating compliance requirement:', error);
      alert('Failed to create compliance requirement. Please try again.');
    }
  };

  const updateCompliance = async (complianceId: string, updateData: any) => {
    try {
      const response = await axios.put('/api/documents/compliance', {
        complianceId: complianceId,
        ...updateData
      });
      
      // Refresh compliance data
      await loadComplianceData();
      
      return response.data.data;
    } catch (error) {
      console.error('Error updating compliance:', error);
      alert('Failed to update compliance. Please try again.');
      throw error;
    }
  };

  const generateComplianceReport = async (complianceId: string, reportType: string) => {
    try {
      const response = await axios.post('/api/documents/compliance', {
        action: 'generateReport',
        complianceId: complianceId,
        reportType: reportType,
        generatedBy: 'current-user-id' // Replace with actual user ID
      });
      
      return response.data.data;
    } catch (error) {
      console.error('Error generating compliance report:', error);
      alert('Failed to generate compliance report. Please try again.');
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto bg-white p-6">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Compliance Data</h3>
          <p className="text-gray-600">Please wait while we load the compliance information...</p>
        </div>
      </div>
    );
  }
  
  if (!complianceData) {
    return (
      <div className="max-w-7xl mx-auto bg-white p-6">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Compliance Data Available</h3>
          <p className="text-gray-600">No compliance tracking data found for this project.</p>
          <button
            onClick={() => createCompliance({
              complianceCategory: 'planning_permission',
              requirementName: 'Initial Planning Permission',
              description: 'Core planning permission application',
              authority: 'Local Planning Authority',
              legislation: 'Planning and Development Act 2000'
            })}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Initial Compliance Requirements
          </button>
        </div>
      </div>
    );
  }

  const filteredRequirements = complianceData.requirements.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || req.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || req.priority === filterPriority;
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'at_risk': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'non_compliant': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'at_risk': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'non_compliant': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const categoryStats = Object.keys(COMPLIANCE_CATEGORIES).map(categoryKey => {
    const requirements = complianceData.requirements.filter(req => req.category === categoryKey);
    const compliant = requirements.filter(req => req.status === 'compliant').length;
    const total = requirements.length;
    const percentage = total > 0 ? (compliant / total) * 100 : 0;
    
    return {
      category: categoryKey,
      total,
      compliant,
      percentage,
      ...COMPLIANCE_CATEGORIES[categoryKey]
    };
  });

  const overallStats = {
    total: complianceData.requirements.length,
    compliant: complianceData.requirements.filter(req => req.status === 'compliant').length,
    inProgress: complianceData.requirements.filter(req => req.status === 'in_progress').length,
    pending: complianceData.requirements.filter(req => req.status === 'pending').length,
    atRisk: complianceData.requirements.filter(req => req.status === 'at_risk').length,
    nonCompliant: complianceData.requirements.filter(req => req.status === 'non_compliant').length
  };

  return (
    <div className="max-w-7xl mx-auto bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Planning Compliance Tracker</h1>
                <p className="text-gray-600">Irish planning and regulatory compliance monitoring</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                Export Report
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                <Plus className="w-4 h-4" />
                Add Requirement
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          
          {/* Project Summary */}
          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm text-emerald-700">Project:</label>
                <p className="font-medium text-emerald-900">{complianceData.projectName}</p>
              </div>
              <div>
                <label className="text-sm text-emerald-700">Planning Ref:</label>
                <p className="font-medium text-emerald-900">{complianceData.planningRef}</p>
              </div>
              <div>
                <label className="text-sm text-emerald-700">Authority:</label>
                <p className="font-medium text-emerald-900">{complianceData.authority}</p>
              </div>
              <div>
                <label className="text-sm text-emerald-700">Compliance Score:</label>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-emerald-900 text-lg">{complianceData.complianceScore}%</p>
                  <div className="flex-1 bg-emerald-200 rounded-full h-2">
                    <div 
                      className="bg-emerald-600 h-2 rounded-full"
                      style={{ width: `${complianceData.complianceScore}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-6 mt-4">
            {[
              { id: 'overview', label: 'Compliance Overview', icon: <Shield className="w-4 h-4" /> },
              { id: 'requirements', label: 'Requirements Tracking', icon: <FileText className="w-4 h-4" /> },
              { id: 'timeline', label: 'Timeline & Deadlines', icon: <Calendar className="w-4 h-4" /> },
              { id: 'reports', label: 'Compliance Reports', icon: <Award className="w-4 h-4" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Compliance Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700">Compliant</p>
                    <p className="text-2xl font-bold text-green-900">{overallStats.compliant}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700">In Progress</p>
                    <p className="text-2xl font-bold text-blue-900">{overallStats.inProgress}</p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-700">Pending</p>
                    <p className="text-2xl font-bold text-yellow-900">{overallStats.pending}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-700">At Risk</p>
                    <p className="text-2xl font-bold text-orange-900">{overallStats.atRisk}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-orange-600" />
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-700">Non-Compliant</p>
                    <p className="text-2xl font-bold text-red-900">{overallStats.nonCompliant}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>
            </div>

            {/* Category Compliance Breakdown */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance by Category</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryStats.map(stat => (
                  <div key={stat.category} className={`bg-${stat.color}-50 border border-${stat.color}-200 rounded-lg p-6`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                        {stat.icon}
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold text-${stat.color}-900`}>{stat.percentage.toFixed(0)}%</div>
                        <div className={`text-sm text-${stat.color}-700`}>{stat.compliant}/{stat.total}</div>
                      </div>
                    </div>
                    
                    <h4 className={`font-semibold text-${stat.color}-900 mb-2`}>{stat.name}</h4>
                    <p className={`text-sm text-${stat.color}-700 mb-3`}>{stat.description}</p>
                    
                    <div className={`bg-${stat.color}-200 rounded-full h-2`}>
                      <div 
                        className={`bg-${stat.color}-600 h-2 rounded-full transition-all`}
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                    
                    <div className={`mt-3 text-xs text-${stat.color}-600`}>
                      <div>Authority: {stat.authority}</div>
                      <div>Legislation: {stat.legislation}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Compliance Activity</h3>
              <div className="space-y-4">
                {complianceData.requirements
                  .filter(req => req.completedDate)
                  .sort((a, b) => new Date(b.completedDate!).getTime() - new Date(a.completedDate!).getTime())
                  .slice(0, 5)
                  .map(req => (
                    <div key={req.id} className="flex items-start gap-3">
                      {getStatusIcon(req.status)}
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{req.title}</span> - {req.status === 'compliant' ? 'Completed' : 'Updated'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(req.completedDate!).toLocaleDateString()} • {req.authority}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Requirements Tracking Tab */}
        {activeTab === 'requirements' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search requirements..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {Object.entries(COMPLIANCE_CATEGORIES).map(([key, category]) => (
                  <option key={key} value={key}>{category.name}</option>
                ))}
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="compliant">Compliant</option>
                <option value="in_progress">In Progress</option>
                <option value="pending">Pending</option>
                <option value="at_risk">At Risk</option>
                <option value="non_compliant">Non-Compliant</option>
              </select>
              
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="all">All Priority</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Requirements List */}
            <div className="space-y-4">
              {filteredRequirements.map(requirement => {
                const category = COMPLIANCE_CATEGORIES[requirement.category];
                const isOverdue = requirement.dueDate && new Date(requirement.dueDate) < new Date() && requirement.status !== 'compliant';
                
                return (
                  <div key={requirement.id} className={`border rounded-lg p-6 ${
                    isOverdue ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                  } hover:shadow-md transition-shadow`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-10 h-10 bg-${category.color}-100 rounded-lg flex items-center justify-center`}>
                          {category.icon}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{requirement.title}</h4>
                            <div className={`w-3 h-3 rounded-full ${getPriorityColor(requirement.priority)}`} title={`${requirement.priority} priority`} />
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(requirement.status)}`}>
                              {getStatusIcon(requirement.status)}
                              <span className="ml-1">{requirement.status.replace('_', ' ')}</span>
                            </span>
                          </div>
                          
                          <p className="text-gray-700 mb-3">{requirement.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Authority:</span>
                              <p className="font-medium">{requirement.authority}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Reference:</span>
                              <p className="font-medium">{requirement.reference}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Due Date:</span>
                              <p className={`font-medium ${isOverdue ? 'text-red-600' : ''}`}>
                                {new Date(requirement.dueDate).toLocaleDateString()}
                                {isOverdue && <span className="ml-1">(Overdue)</span>}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600">Completed:</span>
                              <p className="font-medium">
                                {requirement.completedDate 
                                  ? new Date(requirement.completedDate).toLocaleDateString()
                                  : 'Not completed'
                                }
                              </p>
                            </div>
                          </div>
                          
                          {requirement.evidence.length > 0 && (
                            <div className="mt-3">
                              <span className="text-sm text-gray-600">Evidence:</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {requirement.evidence.map(doc => (
                                  <span key={doc} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                    <FileText className="w-3 h-3" />
                                    {doc}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {requirement.notes && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <span className="text-sm font-medium text-gray-700">Notes:</span>
                              <p className="text-sm text-gray-600 mt-1">{requirement.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-800">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-800">
                          <Upload className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Compliance Timeline & Deadlines</h3>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="space-y-6">
                {complianceData.requirements
                  .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                  .map((requirement, index) => {
                    const isOverdue = new Date(requirement.dueDate) < new Date() && requirement.status !== 'compliant';
                    const category = COMPLIANCE_CATEGORIES[requirement.category];
                    
                    return (
                      <div key={requirement.id} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            requirement.status === 'compliant' ? 'bg-green-100' :
                            isOverdue ? 'bg-red-100' :
                            'bg-gray-100'
                          }`}>
                            {getStatusIcon(requirement.status)}
                          </div>
                          {index < complianceData.requirements.length - 1 && (
                            <div className="w-0.5 h-12 bg-gray-300 mt-2" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">{requirement.title}</h4>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-medium ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
                                {new Date(requirement.dueDate).toLocaleDateString()}
                              </span>
                              <div className={`w-3 h-3 rounded-full ${getPriorityColor(requirement.priority)}`} />
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{requirement.authority}</p>
                          {requirement.status === 'compliant' && requirement.completedDate && (
                            <p className="text-sm text-green-600 mt-1">
                              Completed: {new Date(requirement.completedDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Compliance Reports</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                <Download className="w-4 h-4" />
                Generate Report
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Monthly Compliance Report</h4>
                <p className="text-gray-600 mb-4">Comprehensive monthly compliance status report for all requirements.</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Report Period:</span>
                    <span className="font-medium">July 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overall Score:</span>
                    <span className="font-medium text-emerald-600">{complianceData.complianceScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Generated:</span>
                    <span className="font-medium">{new Date(complianceData.lastReviewDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors">
                  Download Report
                </button>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Authority Submission Report</h4>
                <p className="text-gray-600 mb-4">Summary report for submission to planning and building control authorities.</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Authority:</span>
                    <span className="font-medium">Cork County Council</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Compliance Level:</span>
                    <span className="font-medium text-emerald-600">Satisfactory</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Outstanding Items:</span>
                    <span className="font-medium">{overallStats.pending + overallStats.atRisk + overallStats.nonCompliant}</span>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}