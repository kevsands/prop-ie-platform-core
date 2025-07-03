'use client';

import React, { useState } from 'react';
import { 
  Workflow, 
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Users,
  User,
  Send,
  MessageSquare,
  Eye,
  Edit3,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Settings,
  Bell,
  Calendar,
  FileText,
  Building2,
  Scale,
  Shield,
  Star,
  Flag,
  Filter,
  Search,
  Plus,
  MoreVertical,
  GitBranch,
  Zap,
  BarChart3
} from 'lucide-react';

// Workflow templates for Irish property development
const WORKFLOW_TEMPLATES = {
  planning_approval: {
    name: 'Planning Application Approval',
    description: 'Standard workflow for planning application documents',
    icon: <Building2 className="w-5 h-5" />,
    color: 'blue',
    estimatedDuration: '4-6 weeks',
    stages: [
      {
        id: 'initial_review',
        name: 'Initial Review',
        description: 'Document completeness and initial assessment',
        assignedRole: 'planning_team',
        requiredActions: ['document_check', 'completeness_review'],
        duration: '2-3 days',
        autoProgress: false
      },
      {
        id: 'technical_review',
        name: 'Technical Review',
        description: 'Technical assessment by specialists',
        assignedRole: 'technical_team',
        requiredActions: ['technical_assessment', 'compliance_check'],
        duration: '1-2 weeks',
        autoProgress: false
      },
      {
        id: 'stakeholder_consultation',
        name: 'Stakeholder Consultation',
        description: 'External stakeholder review and feedback',
        assignedRole: 'external_stakeholders',
        requiredActions: ['stakeholder_review', 'public_consultation'],
        duration: '2-3 weeks',
        autoProgress: false
      },
      {
        id: 'final_approval',
        name: 'Final Approval',
        description: 'Final decision and approval',
        assignedRole: 'planning_authority',
        requiredActions: ['final_decision', 'approval_documentation'],
        duration: '1 week',
        autoProgress: false
      }
    ]
  },
  contract_approval: {
    name: 'Contract Document Approval',
    description: 'Legal contract review and approval workflow',
    icon: <Scale className="w-5 h-5" />,
    color: 'purple',
    estimatedDuration: '2-3 weeks',
    stages: [
      {
        id: 'legal_review',
        name: 'Legal Review',
        description: 'Initial legal assessment and compliance check',
        assignedRole: 'legal_team',
        requiredActions: ['legal_assessment', 'risk_analysis'],
        duration: '3-5 days',
        autoProgress: false
      },
      {
        id: 'commercial_review',
        name: 'Commercial Review',
        description: 'Commercial terms and financial assessment',
        assignedRole: 'commercial_team',
        requiredActions: ['commercial_assessment', 'financial_review'],
        duration: '3-5 days',
        autoProgress: false
      },
      {
        id: 'client_approval',
        name: 'Client Approval',
        description: 'Client review and sign-off',
        assignedRole: 'client',
        requiredActions: ['client_review', 'approval_signature'],
        duration: '1-2 weeks',
        autoProgress: false
      },
      {
        id: 'execution',
        name: 'Contract Execution',
        description: 'Final execution and filing',
        assignedRole: 'legal_team',
        requiredActions: ['contract_execution', 'filing'],
        duration: '1-2 days',
        autoProgress: true
      }
    ]
  },
  financial_approval: {
    name: 'Financial Document Approval',
    description: 'Financial document review and sign-off workflow',
    icon: <FileText className="w-5 h-5" />,
    color: 'green',
    estimatedDuration: '1-2 weeks',
    stages: [
      {
        id: 'qs_review',
        name: 'Quantity Surveyor Review',
        description: 'Technical and cost assessment',
        assignedRole: 'quantity_surveyor',
        requiredActions: ['cost_review', 'technical_assessment'],
        duration: '2-3 days',
        autoProgress: false
      },
      {
        id: 'finance_review',
        name: 'Finance Team Review',
        description: 'Financial analysis and budget validation',
        assignedRole: 'finance_team',
        requiredActions: ['budget_validation', 'cash_flow_analysis'],
        duration: '2-3 days',
        autoProgress: false
      },
      {
        id: 'management_approval',
        name: 'Management Approval',
        description: 'Senior management sign-off',
        assignedRole: 'management',
        requiredActions: ['management_review', 'final_approval'],
        duration: '3-5 days',
        autoProgress: false
      }
    ]
  },
  compliance_review: {
    name: 'Compliance Document Review',
    description: 'Regulatory compliance and certification workflow',
    icon: <Shield className="w-5 h-5" />,
    color: 'red',
    estimatedDuration: '3-4 weeks',
    stages: [
      {
        id: 'compliance_check',
        name: 'Compliance Assessment',
        description: 'Regulatory compliance verification',
        assignedRole: 'compliance_team',
        requiredActions: ['regulation_check', 'standard_compliance'],
        duration: '1 week',
        autoProgress: false
      },
      {
        id: 'authority_review',
        name: 'Authority Review',
        description: 'External authority assessment',
        assignedRole: 'regulatory_authority',
        requiredActions: ['authority_assessment', 'certification_review'],
        duration: '2-3 weeks',
        autoProgress: false
      },
      {
        id: 'certification',
        name: 'Certification & Filing',
        description: 'Final certification and document filing',
        assignedRole: 'compliance_team',
        requiredActions: ['certification', 'document_filing'],
        duration: '1-2 days',
        autoProgress: true
      }
    ]
  }
};

// Team roles and members
const TEAM_ROLES = {
  planning_team: {
    name: 'Planning Team',
    members: ['Planning Manager', 'Planning Officer', 'Site Engineer'],
    permissions: ['review', 'approve', 'comment', 'assign']
  },
  legal_team: {
    name: 'Legal Team',
    members: ['Legal Director', 'Senior Solicitor', 'Legal Assistant'],
    permissions: ['review', 'approve', 'comment', 'reject']
  },
  technical_team: {
    name: 'Technical Team',
    members: ['Chief Engineer', 'Structural Engineer', 'M&E Engineer'],
    permissions: ['review', 'approve', 'comment', 'request_changes']
  },
  commercial_team: {
    name: 'Commercial Team',
    members: ['Commercial Director', 'Quantity Surveyor', 'Procurement Manager'],
    permissions: ['review', 'approve', 'comment', 'cost_analysis']
  },
  finance_team: {
    name: 'Finance Team',
    members: ['Finance Director', 'Financial Controller', 'Finance Analyst'],
    permissions: ['review', 'approve', 'comment', 'budget_control']
  },
  management: {
    name: 'Senior Management',
    members: ['CEO', 'Development Director', 'Operations Director'],
    permissions: ['review', 'approve', 'reject', 'override']
  },
  client: {
    name: 'Client/External',
    members: ['Client Representative', 'External Consultant'],
    permissions: ['review', 'approve', 'comment']
  }
};

// Sample active workflows
const SAMPLE_WORKFLOWS = [
  {
    id: 'wf-1',
    title: 'Planning Application - Fitzgerald Gardens Phase 2',
    template: 'planning_approval',
    documentId: 'doc-planning-fg-001',
    projectId: 'fitzgerald-gardens',
    status: 'in_progress',
    currentStage: 'technical_review',
    progress: 45,
    priority: 'high',
    createdAt: '2025-07-01T09:00:00Z',
    dueDate: '2025-08-15T17:00:00Z',
    assignedTo: 'technical_team',
    createdBy: 'Planning Manager',
    comments: 3,
    notifications: 2
  },
  {
    id: 'wf-2',
    title: 'RIAI Blue Form Contract - Ballymakenny View',
    template: 'contract_approval',
    documentId: 'doc-contract-bv-002',
    projectId: 'ballymakenny-view',
    status: 'pending_approval',
    currentStage: 'client_approval',
    progress: 75,
    priority: 'urgent',
    createdAt: '2025-06-28T14:30:00Z',
    dueDate: '2025-07-10T17:00:00Z',
    assignedTo: 'client',
    createdBy: 'Legal Director',
    comments: 7,
    notifications: 1
  },
  {
    id: 'wf-3',
    title: 'Final BOQ Approval - Ellwood Project',
    template: 'financial_approval',
    documentId: 'doc-boq-ew-003',
    projectId: 'ellwood',
    status: 'completed',
    currentStage: 'management_approval',
    progress: 100,
    priority: 'medium',
    createdAt: '2025-06-20T10:15:00Z',
    dueDate: '2025-06-30T17:00:00Z',
    assignedTo: 'management',
    createdBy: 'Quantity Surveyor',
    comments: 12,
    notifications: 0
  }
];

interface EnterpriseDocumentWorkflowProps {
  onClose?: () => void;
  projectId?: string;
}

export default function EnterpriseDocumentWorkflow({
  onClose,
  projectId
}: EnterpriseDocumentWorkflowProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'templates' | 'active' | 'completed'>('dashboard');
  const [workflows, setWorkflows] = useState(SAMPLE_WORKFLOWS);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'in_progress' | 'pending_approval' | 'completed'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'urgent' | 'high' | 'medium' | 'low'>('all');

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || workflow.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || workflow.priority === filterPriority;
    const matchesProject = !projectId || workflow.projectId === projectId;
    return matchesSearch && matchesStatus && matchesPriority && matchesProject;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending_approval': return 'bg-amber-100 text-amber-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'on_hold': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'pending_approval': return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'on_hold': return <Pause className="w-4 h-4 text-gray-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const calculateDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const workflowStats = {
    total: workflows.length,
    inProgress: workflows.filter(w => w.status === 'in_progress').length,
    pendingApproval: workflows.filter(w => w.status === 'pending_approval').length,
    completed: workflows.filter(w => w.status === 'completed').length,
    overdue: workflows.filter(w => calculateDaysRemaining(w.dueDate) < 0 && w.status !== 'completed').length
  };

  return (
    <div className="max-w-7xl mx-auto bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Workflow className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Document Workflow & Approval System</h1>
                <p className="text-gray-600">Enterprise-grade workflow management for Irish property development</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Settings className="w-4 h-4" />
                Configure Workflows
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                <Plus className="w-4 h-4" />
                New Workflow
              </button>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex items-center gap-6 mt-4">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'active', label: 'Active Workflows', icon: <Play className="w-4 h-4" /> },
              { id: 'templates', label: 'Templates', icon: <GitBranch className="w-4 h-4" /> },
              { id: 'completed', label: 'Completed', icon: <CheckCircle className="w-4 h-4" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
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
        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Workflows</p>
                    <p className="text-2xl font-bold text-gray-900">{workflowStats.total}</p>
                  </div>
                  <Workflow className="w-8 h-8 text-gray-400" />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700">In Progress</p>
                    <p className="text-2xl font-bold text-blue-900">{workflowStats.inProgress}</p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-amber-700">Pending Approval</p>
                    <p className="text-2xl font-bold text-amber-900">{workflowStats.pendingApproval}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-amber-600" />
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700">Completed</p>
                    <p className="text-2xl font-bold text-green-900">{workflowStats.completed}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-700">Overdue</p>
                    <p className="text-2xl font-bold text-red-900">{workflowStats.overdue}</p>
                  </div>
                  <Flag className="w-8 h-8 text-red-600" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Planning Workflow</div>
                    <div className="text-sm text-gray-600">Start planning approval</div>
                  </div>
                </button>

                <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Scale className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Contract Review</div>
                    <div className="text-sm text-gray-600">Legal contract approval</div>
                  </div>
                </button>

                <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Financial Approval</div>
                    <div className="text-sm text-gray-600">BOQ and cost approval</div>
                  </div>
                </button>

                <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Compliance Check</div>
                    <div className="text-sm text-gray-600">Regulatory compliance</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Workflow Activity</h3>
              <div className="space-y-4">
                {[
                  {
                    user: 'Technical Team',
                    action: 'completed technical review',
                    workflow: 'Planning Application - Fitzgerald Gardens Phase 2',
                    time: '2 hours ago',
                    icon: <CheckCircle className="w-4 h-4 text-green-600" />
                  },
                  {
                    user: 'Legal Director',
                    action: 'requested changes to',
                    workflow: 'RIAI Blue Form Contract - Ballymakenny View',
                    time: '4 hours ago',
                    icon: <MessageSquare className="w-4 h-4 text-amber-600" />
                  },
                  {
                    user: 'Finance Team',
                    action: 'approved',
                    workflow: 'Budget Allocation - Q3 Development',
                    time: '1 day ago',
                    icon: <CheckCircle className="w-4 h-4 text-green-600" />
                  },
                  {
                    user: 'Client Representative',
                    action: 'submitted review for',
                    workflow: 'Site Design Specifications',
                    time: '2 days ago',
                    icon: <Eye className="w-4 h-4 text-blue-600" />
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    {activity.icon}
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.user}</span> {activity.action} <span className="font-medium">{activity.workflow}</span>
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active Workflows View */}
        {activeTab === 'active' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search workflows..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="in_progress">In Progress</option>
                <option value="pending_approval">Pending Approval</option>
                <option value="completed">Completed</option>
              </select>
              
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Workflows List */}
            <div className="space-y-4">
              {filteredWorkflows.map(workflow => {
                const template = WORKFLOW_TEMPLATES[workflow.template];
                const daysRemaining = calculateDaysRemaining(workflow.dueDate);
                
                return (
                  <div key={workflow.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-12 h-12 bg-${template.color}-100 rounded-lg flex items-center justify-center`}>
                          {template.icon}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{workflow.title}</h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}>
                              {getStatusIcon(workflow.status)}
                              <span className="ml-1">{workflow.status.replace('_', ' ')}</span>
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(workflow.priority)}`}>
                              {workflow.priority}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                          
                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>Assigned to {TEAM_ROLES[workflow.assignedTo]?.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span className={daysRemaining < 0 ? 'text-red-600 font-medium' : daysRemaining <= 3 ? 'text-amber-600 font-medium' : ''}>
                                {daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days remaining`}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              <span>{workflow.comments} comments</span>
                            </div>
                            {workflow.notifications > 0 && (
                              <div className="flex items-center gap-1">
                                <Bell className="w-4 h-4 text-red-500" />
                                <span className="text-red-600 font-medium">{workflow.notifications} notifications</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Progress</div>
                          <div className="text-lg font-semibold text-gray-900">{workflow.progress}%</div>
                        </div>
                        <div className="w-16">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full bg-${template.color}-600`}
                              style={{ width: `${workflow.progress}%` }}
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedWorkflow(workflow.id)}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Workflow Stages Preview */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        {template.stages.map((stage, index) => (
                          <div key={stage.id} className="flex items-center">
                            <div className={`w-3 h-3 rounded-full ${
                              workflow.currentStage === stage.id ? `bg-${template.color}-600` :
                              index < template.stages.findIndex(s => s.id === workflow.currentStage) ? 'bg-green-500' :
                              'bg-gray-300'
                            }`} />
                            {index < template.stages.length - 1 && (
                              <div className={`w-8 h-0.5 ${
                                index < template.stages.findIndex(s => s.id === workflow.currentStage) ? 'bg-green-500' : 'bg-gray-300'
                              }`} />
                            )}
                          </div>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          {template.stages.find(s => s.id === workflow.currentStage)?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Templates View */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Workflow Templates</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(WORKFLOW_TEMPLATES).map(([key, template]) => (
                <div key={key} className={`bg-${template.color}-50 border border-${template.color}-200 rounded-xl p-6`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-${template.color}-100 rounded-lg flex items-center justify-center`}>
                        {template.icon}
                      </div>
                      <div>
                        <h4 className={`font-semibold text-${template.color}-900`}>{template.name}</h4>
                        <p className={`text-sm text-${template.color}-700`}>{template.description}</p>
                      </div>
                    </div>
                    <button className={`px-3 py-1 bg-${template.color}-600 text-white rounded-lg hover:bg-${template.color}-700 transition-colors text-sm`}>
                      Use Template
                    </button>
                  </div>
                  
                  <div className={`text-sm text-${template.color}-700 mb-4`}>
                    <span className="font-medium">Duration:</span> {template.estimatedDuration}
                  </div>
                  
                  <div className="space-y-2">
                    {template.stages.map((stage, index) => (
                      <div key={stage.id} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full bg-${template.color}-400`} />
                        <span className={`text-sm text-${template.color}-800`}>
                          {stage.name} ({stage.duration})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Workflows View */}
        {activeTab === 'completed' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Completed Workflows</h3>
            
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Workflow</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Template</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Project</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Completed</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Duration</th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workflows.filter(w => w.status === 'completed').map((workflow, index) => {
                      const template = WORKFLOW_TEMPLATES[workflow.template];
                      return (
                        <tr key={workflow.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 bg-${template.color}-100 rounded-lg flex items-center justify-center`}>
                                {template.icon}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{workflow.title}</div>
                                <div className="text-sm text-gray-600">{workflow.createdBy}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-900">{template.name}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-900">{workflow.projectId}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-900">
                              {new Date(workflow.dueDate).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-900">
                              {Math.ceil((new Date(workflow.dueDate).getTime() - new Date(workflow.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button className="text-blue-600 hover:text-blue-800">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-800">
                                <Download className="w-4 h-4" />
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
          </div>
        )}
      </div>
    </div>
  );
}