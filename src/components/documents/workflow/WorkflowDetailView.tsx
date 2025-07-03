'use client';

import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  User,
  MessageSquare,
  Send,
  Edit3,
  Eye,
  Download,
  Share2,
  Bell,
  Flag,
  Calendar,
  FileText,
  Building2,
  Scale,
  Shield,
  Star,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  Settings,
  Users,
  Activity,
  GitBranch,
  Zap
} from 'lucide-react';

// Sample workflow detail data
const SAMPLE_WORKFLOW_DETAIL = {
  id: 'wf-1',
  title: 'Planning Application - Fitzgerald Gardens Phase 2',
  description: 'Comprehensive planning application for Phase 2 development including 15 residential units with associated infrastructure and landscaping.',
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
  estimatedCompletion: '2025-08-10T17:00:00Z',
  actualStartDate: '2025-07-01T09:00:00Z',
  budget: 45000,
  spent: 18500,
  tags: ['planning', 'phase-2', 'residential', 'fitzgerald-gardens'],
  stages: [
    {
      id: 'initial_review',
      name: 'Initial Review',
      description: 'Document completeness and initial assessment',
      assignedRole: 'planning_team',
      assignedUsers: ['Planning Manager', 'Planning Officer'],
      status: 'completed',
      startDate: '2025-07-01T09:00:00Z',
      completedDate: '2025-07-03T17:00:00Z',
      estimatedDuration: '2-3 days',
      actualDuration: '2 days',
      requiredActions: ['document_check', 'completeness_review'],
      completedActions: ['document_check', 'completeness_review'],
      comments: 3,
      approvals: [
        {
          user: 'Planning Manager',
          status: 'approved',
          timestamp: '2025-07-03T16:30:00Z',
          comment: 'All documents are complete and meet initial requirements.'
        }
      ]
    },
    {
      id: 'technical_review',
      name: 'Technical Review',
      description: 'Technical assessment by specialists',
      assignedRole: 'technical_team',
      assignedUsers: ['Chief Engineer', 'Structural Engineer', 'M&E Engineer'],
      status: 'in_progress',
      startDate: '2025-07-03T17:00:00Z',
      estimatedDuration: '1-2 weeks',
      requiredActions: ['technical_assessment', 'compliance_check'],
      completedActions: ['technical_assessment'],
      comments: 5,
      approvals: [
        {
          user: 'Chief Engineer',
          status: 'approved',
          timestamp: '2025-07-04T14:20:00Z',
          comment: 'Structural aspects are sound and comply with regulations.'
        },
        {
          user: 'M&E Engineer',
          status: 'pending',
          timestamp: null,
          comment: null
        }
      ]
    },
    {
      id: 'stakeholder_consultation',
      name: 'Stakeholder Consultation',
      description: 'External stakeholder review and feedback',
      assignedRole: 'external_stakeholders',
      assignedUsers: ['Local Authority', 'Community Representative'],
      status: 'pending',
      estimatedDuration: '2-3 weeks',
      requiredActions: ['stakeholder_review', 'public_consultation'],
      completedActions: [],
      comments: 0,
      approvals: []
    },
    {
      id: 'final_approval',
      name: 'Final Approval',
      description: 'Final decision and approval',
      assignedRole: 'planning_authority',
      assignedUsers: ['Planning Authority Director'],
      status: 'pending',
      estimatedDuration: '1 week',
      requiredActions: ['final_decision', 'approval_documentation'],
      completedActions: [],
      comments: 0,
      approvals: []
    }
  ]
};

// Sample comments data
const SAMPLE_COMMENTS = [
  {
    id: 'comment-1',
    user: 'Planning Manager',
    userRole: 'planning_team',
    timestamp: '2025-07-03T16:30:00Z',
    stageId: 'initial_review',
    content: 'Initial review completed successfully. All required documents are present and appear to be in order.',
    type: 'approval',
    attachments: []
  },
  {
    id: 'comment-2',
    user: 'Chief Engineer',
    userRole: 'technical_team',
    timestamp: '2025-07-04T14:20:00Z',
    stageId: 'technical_review',
    content: 'Structural engineering review complete. Drawings comply with Irish building regulations and structural requirements are adequate.',
    type: 'approval',
    attachments: ['structural_review_report.pdf']
  },
  {
    id: 'comment-3',
    user: 'Planning Officer',
    userRole: 'planning_team',
    timestamp: '2025-07-04T10:15:00Z',
    stageId: 'technical_review',
    content: 'Question regarding drainage specifications in drawing set A-101. Could the M&E team clarify the storm water management approach?',
    type: 'question',
    attachments: []
  },
  {
    id: 'comment-4',
    user: 'M&E Engineer',
    userRole: 'technical_team',
    timestamp: '2025-07-04T15:45:00Z',
    stageId: 'technical_review',
    content: 'Reviewing electrical and mechanical systems. Will provide detailed feedback by end of week. Preliminary assessment shows compliance with Part L regulations.',
    type: 'status_update',
    attachments: []
  },
  {
    id: 'comment-5',
    user: 'Structural Engineer',
    userRole: 'technical_team',
    timestamp: '2025-07-05T09:30:00Z',
    stageId: 'technical_review',
    content: 'Minor revision needed to foundation detail on sheet S-102. Updated drawing attached.',
    type: 'revision_request',
    attachments: ['foundation_detail_rev.dwg']
  }
];

interface WorkflowDetailViewProps {
  workflowId: string;
  onClose: () => void;
}

export default function WorkflowDetailView({
  workflowId,
  onClose
}: WorkflowDetailViewProps) {
  const [workflow, setWorkflow] = useState(SAMPLE_WORKFLOW_DETAIL);
  const [comments, setComments] = useState(SAMPLE_COMMENTS);
  const [activeTab, setActiveTab] = useState<'overview' | 'stages' | 'comments' | 'documents' | 'history'>('overview');
  const [newComment, setNewComment] = useState('');
  const [commentType, setCommentType] = useState<'comment' | 'approval' | 'rejection' | 'question'>('comment');

  const handleStageAction = (stageId: string, action: 'approve' | 'reject' | 'start' | 'complete') => {
    setWorkflow(prev => ({
      ...prev,
      stages: prev.stages.map(stage => {
        if (stage.id === stageId) {
          switch (action) {
            case 'approve':
              return { 
                ...stage, 
                approvals: [
                  ...stage.approvals,
                  {
                    user: 'Current User',
                    status: 'approved',
                    timestamp: new Date().toISOString(),
                    comment: newComment || 'Approved'
                  }
                ]
              };
            case 'start':
              return { ...stage, status: 'in_progress', startDate: new Date().toISOString() };
            case 'complete':
              return { 
                ...stage, 
                status: 'completed', 
                completedDate: new Date().toISOString(),
                completedActions: stage.requiredActions
              };
            default:
              return stage;
          }
        }
        return stage;
      })
    }));
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: `comment-${Date.now()}`,
      user: 'Current User',
      userRole: 'current_user',
      timestamp: new Date().toISOString(),
      stageId: workflow.currentStage,
      content: newComment,
      type: commentType,
      attachments: []
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
  };

  const getStageStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStageStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-gray-600" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getCommentTypeColor = (type: string) => {
    switch (type) {
      case 'approval': return 'bg-green-100 text-green-800';
      case 'rejection': return 'bg-red-100 text-red-800';
      case 'question': return 'bg-amber-100 text-amber-800';
      case 'revision_request': return 'bg-purple-100 text-purple-800';
      case 'status_update': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (start: string, end?: string) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  const currentStageIndex = workflow.stages.findIndex(s => s.id === workflow.currentStage);
  const completedStages = workflow.stages.filter(s => s.status === 'completed').length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{workflow.title}</h2>
                <p className="text-gray-600">{workflow.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
          </div>
          
          {/* Status Bar */}
          <div className="flex items-center justify-between mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Progress: {workflow.progress}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-sm">Due: {new Date(workflow.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Flag className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">{workflow.priority} priority</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                <span className="text-sm">Stage {currentStageIndex + 1} of {workflow.stages.length}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button className="flex items-center gap-2 px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                <Bell className="w-4 h-4" />
                Subscribe
              </button>
              <button className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                <Edit3 className="w-4 h-4" />
                Take Action
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm text-gray-600">{completedStages}/{workflow.stages.length} stages completed</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${workflow.progress}%` }}
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 mt-6">
            {[
              { id: 'overview', label: 'Overview', icon: <Eye className="w-4 h-4" /> },
              { id: 'stages', label: 'Workflow Stages', icon: <GitBranch className="w-4 h-4" /> },
              { id: 'comments', label: 'Comments & Reviews', icon: <MessageSquare className="w-4 h-4" /> },
              { id: 'documents', label: 'Documents', icon: <FileText className="w-4 h-4" /> },
              { id: 'history', label: 'Activity History', icon: <Activity className="w-4 h-4" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Workflow Summary */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Workflow Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Template</label>
                      <p className="font-medium">Planning Application Approval</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Project</label>
                      <p className="font-medium">{workflow.projectId}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Created By</label>
                      <p className="font-medium">{workflow.createdBy}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Started</label>
                      <p className="font-medium">{new Date(workflow.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Estimated Completion</label>
                      <p className="font-medium">{new Date(workflow.estimatedCompletion).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Budget</label>
                      <p className="font-medium">€{workflow.budget.toLocaleString()} (€{workflow.spent.toLocaleString()} spent)</p>
                    </div>
                  </div>
                </div>

                {/* Current Stage Status */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-4">Current Stage: Technical Review</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-700">Stage Progress</span>
                      <span className="font-medium text-blue-900">70%</span>
                    </div>
                    <div className="bg-blue-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '70%' }} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700">Assigned to:</span>
                        <p className="font-medium text-blue-900">Technical Team</p>
                      </div>
                      <div>
                        <span className="text-blue-700">Started:</span>
                        <p className="font-medium text-blue-900">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      <CheckCircle className="w-4 h-4" />
                      Approve Current Stage
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <MessageSquare className="w-4 h-4" />
                      Add Comment
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Download className="w-4 h-4" />
                      Download Documents
                    </button>
                  </div>
                </div>

                {/* Team Members */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Team Members</h3>
                  <div className="space-y-3">
                    {['Chief Engineer', 'M&E Engineer', 'Planning Manager'].map(member => (
                      <div key={member} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{member}</p>
                          <p className="text-xs text-gray-600">Active reviewer</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {workflow.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stages Tab */}
          {activeTab === 'stages' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Workflow Stages</h3>
              
              <div className="space-y-6">
                {workflow.stages.map((stage, index) => (
                  <div key={stage.id} className={`border rounded-lg p-6 ${
                    stage.status === 'completed' ? 'border-green-200 bg-green-50' :
                    stage.status === 'in_progress' ? 'border-blue-200 bg-blue-50' :
                    'border-gray-200 bg-white'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            stage.status === 'completed' ? 'bg-green-100' :
                            stage.status === 'in_progress' ? 'bg-blue-100' :
                            'bg-gray-100'
                          }`}>
                            {getStageStatusIcon(stage.status)}
                          </div>
                          {index < workflow.stages.length - 1 && (
                            <div className={`w-0.5 h-12 mt-2 ${
                              stage.status === 'completed' ? 'bg-green-300' : 'bg-gray-300'
                            }`} />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{stage.name}</h4>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStageStatusColor(stage.status)}`}>
                              {stage.status.replace('_', ' ')}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">{stage.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Assigned to:</span>
                              <p className="font-medium">{stage.assignedUsers?.join(', ')}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Duration:</span>
                              <p className="font-medium">
                                {stage.actualDuration || stage.estimatedDuration}
                                {stage.startDate && !stage.completedDate && (
                                  <span className="text-blue-600"> (ongoing)</span>
                                )}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600">Comments:</span>
                              <p className="font-medium">{stage.comments} comments</p>
                            </div>
                          </div>
                          
                          {/* Required Actions */}
                          <div className="mt-4">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Required Actions</h5>
                            <div className="space-y-1">
                              {stage.requiredActions.map(action => (
                                <div key={action} className="flex items-center gap-2">
                                  {stage.completedActions.includes(action) ? (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <Clock className="w-4 h-4 text-gray-400" />
                                  )}
                                  <span className={`text-sm ${
                                    stage.completedActions.includes(action) ? 'text-green-700' : 'text-gray-600'
                                  }`}>
                                    {action.replace('_', ' ')}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Approvals */}
                          {stage.approvals.length > 0 && (
                            <div className="mt-4">
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Approvals</h5>
                              <div className="space-y-2">
                                {stage.approvals.map((approval, approvalIndex) => (
                                  <div key={approvalIndex} className="flex items-center gap-2">
                                    {approval.status === 'approved' ? (
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                    ) : approval.status === 'rejected' ? (
                                      <XCircle className="w-4 h-4 text-red-600" />
                                    ) : (
                                      <Clock className="w-4 h-4 text-amber-600" />
                                    )}
                                    <span className="text-sm text-gray-700">{approval.user}</span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                      approval.status === 'approved' ? 'bg-green-100 text-green-800' :
                                      approval.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                      'bg-amber-100 text-amber-800'
                                    }`}>
                                      {approval.status}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Stage Actions */}
                      <div className="flex items-center gap-2 ml-4">
                        {stage.status === 'pending' && index === currentStageIndex && (
                          <button
                            onClick={() => handleStageAction(stage.id, 'start')}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            <Play className="w-3 h-3" />
                            Start
                          </button>
                        )}
                        {stage.status === 'in_progress' && (
                          <>
                            <button
                              onClick={() => handleStageAction(stage.id, 'approve')}
                              className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                            >
                              <CheckCircle className="w-3 h-3" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleStageAction(stage.id, 'complete')}
                              className="flex items-center gap-1 px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                            >
                              <Flag className="w-3 h-3" />
                              Complete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Comments & Reviews</h3>
                <span className="text-sm text-gray-600">{comments.length} comments</span>
              </div>
              
              {/* Add Comment */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <select
                    value={commentType}
                    onChange={(e) => setCommentType(e.target.value as any)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="comment">Comment</option>
                    <option value="approval">Approval</option>
                    <option value="rejection">Rejection</option>
                    <option value="question">Question</option>
                  </select>
                </div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add your comment or review..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
                <div className="flex items-center justify-between mt-3">
                  <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
                    <Plus className="w-4 h-4" />
                    Attach Files
                  </button>
                  <button
                    onClick={handleAddComment}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Post Comment
                  </button>
                </div>
              </div>
              
              {/* Comments List */}
              <div className="space-y-4">
                {comments.map(comment => (
                  <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{comment.user}</h4>
                          <p className="text-xs text-gray-600">
                            {new Date(comment.timestamp).toLocaleString()} • 
                            Stage: {workflow.stages.find(s => s.id === comment.stageId)?.name}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCommentTypeColor(comment.type)}`}>
                        {comment.type.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{comment.content}</p>
                    
                    {comment.attachments.length > 0 && (
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {comment.attachments.length} attachment(s)
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Related Documents</h3>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-blue-900">Primary Document</h4>
                </div>
                <p className="text-blue-800">Planning_Application_FitzgeraldGardens_Phase2.pdf</p>
                <p className="text-sm text-blue-700">Last updated: 2 days ago</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Site_Plans_A101.dwg',
                  'Structural_Drawings_S102.dwg',
                  'MEP_Systems_M201.pdf',
                  'Landscape_Plans_L301.pdf',
                  'Engineering_Report.pdf',
                  'Environmental_Assessment.pdf'
                ].map(doc => (
                  <div key={doc} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{doc}</p>
                          <p className="text-xs text-gray-600">Updated 3 days ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-800">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Activity History</h3>
              
              <div className="space-y-4">
                {[
                  {
                    action: 'Stage completed',
                    detail: 'Initial Review stage completed by Planning Manager',
                    timestamp: '2025-07-03T17:00:00Z',
                    user: 'Planning Manager',
                    icon: <CheckCircle className="w-4 h-4 text-green-600" />
                  },
                  {
                    action: 'Comment added',
                    detail: 'Technical review feedback provided',
                    timestamp: '2025-07-04T14:20:00Z',
                    user: 'Chief Engineer',
                    icon: <MessageSquare className="w-4 h-4 text-blue-600" />
                  },
                  {
                    action: 'Document updated',
                    detail: 'Foundation detail revised on sheet S-102',
                    timestamp: '2025-07-05T09:30:00Z',
                    user: 'Structural Engineer',
                    icon: <FileText className="w-4 h-4 text-purple-600" />
                  },
                  {
                    action: 'Workflow started',
                    detail: 'Planning application workflow initiated',
                    timestamp: '2025-07-01T09:00:00Z',
                    user: 'Planning Manager',
                    icon: <Play className="w-4 h-4 text-blue-600" />
                  }
                ].map((entry, index) => (
                  <div key={index} className="flex items-start gap-3">
                    {entry.icon}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{entry.action}</h4>
                        <span className="text-xs text-gray-500">
                          {new Date(entry.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{entry.detail}</p>
                      <p className="text-xs text-gray-500">by {entry.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}