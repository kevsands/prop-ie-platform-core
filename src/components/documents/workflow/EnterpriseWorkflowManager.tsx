'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  ArrowRight,
  BarChart3,
  FileText,
  Settings,
  Plus,
  Filter,
  Search,
  Calendar,
  Flag,
  AlertTriangle,
  TrendingUp,
  Activity,
  Target,
  Zap,
  RefreshCw
} from 'lucide-react';

// ================================================================================
// INTERFACES
// ================================================================================

interface WorkflowStage {
  id: string;
  name: string;
  type: 'approval' | 'task' | 'condition' | 'notification' | 'automation';
  sequence: number;
  requiredRoles: string[];
  timeoutHours?: number;
  autoApprove?: boolean;
}

interface WorkflowInstance {
  id: string;
  templateId: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected' | 'cancelled';
  currentStage: string;
  progress: number;
  projectId?: string;
  documentId?: string;
  createdBy: string;
  assignedTo?: string;
  startedAt: string;
  completedAt?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
}

interface WorkflowAnalytics {
  totalWorkflows: number;
  activeWorkflows: number;
  completedWorkflows: number;
  averageCompletionTime: number;
  stageBottlenecks: { [stageId: string]: number };
  completionRate: number;
}

interface EnterpriseWorkflowManagerProps {
  projectId?: string;
  onWorkflowSelect?: (workflow: WorkflowInstance) => void;
  showAnalytics?: boolean;
}

// ================================================================================
// MAIN COMPONENT
// ================================================================================

export default function EnterpriseWorkflowManager({
  projectId,
  onWorkflowSelect,
  showAnalytics = true
}: EnterpriseWorkflowManagerProps) {
  const [workflows, setWorkflows] = useState<WorkflowInstance[]>([]);
  const [analytics, setAnalytics] = useState<WorkflowAnalytics | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowInstance | null>(null);
  const [workflowDetails, setWorkflowDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<'list' | 'analytics' | 'details'>('list');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Load workflows and analytics on component mount
  useEffect(() => {
    loadWorkflows();
    if (showAnalytics) {
      loadAnalytics();
    }
  }, [projectId, statusFilter]);

  // ================================================================================
  // DATA LOADING FUNCTIONS
  // ================================================================================

  const loadWorkflows = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      
      if (projectId) params.append('projectId', projectId);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const response = await axios.get(`/api/workflows?${params.toString()}`);
      setWorkflows(response.data.data);
    } catch (error: any) {
      console.error('Error loading workflows:', error);
      alert('Failed to load workflows: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const params = new URLSearchParams({ action: 'analytics' });
      if (projectId) params.append('projectId', projectId);

      const response = await axios.get(`/api/workflows?${params.toString()}`);
      setAnalytics(response.data.data);
    } catch (error: any) {
      console.error('Error loading analytics:', error);
    }
  };

  const loadWorkflowDetails = async (workflowId: string) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/workflows/${workflowId}`);
      setWorkflowDetails(response.data.data);
      setCurrentView('details');
    } catch (error: any) {
      console.error('Error loading workflow details:', error);
      alert('Failed to load workflow details: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  // ================================================================================
  // WORKFLOW ACTIONS
  // ================================================================================

  const startWorkflow = async (templateId: string, workflowData: any) => {
    try {
      setIsLoading(true);
      const response = await axios.post('/api/workflows', {
        action: 'start_workflow',
        workflowData: {
          templateId,
          ...workflowData,
          projectId
        }
      });

      alert('✅ Workflow started successfully!');
      await loadWorkflows();
      setShowCreateModal(false);
    } catch (error: any) {
      console.error('Error starting workflow:', error);
      alert('Failed to start workflow: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const approveStage = async (workflowId: string, stageId: string, comments?: string) => {
    try {
      setIsLoading(true);
      const response = await axios.put('/api/workflows', {
        workflowId,
        action: 'approve',
        stageId,
        approvalData: {
          comments,
          approvedAt: new Date().toISOString()
        }
      });

      alert('✅ Stage approved successfully!');
      await loadWorkflows();
      if (workflowDetails && workflowDetails.instance.id === workflowId) {
        await loadWorkflowDetails(workflowId);
      }
    } catch (error: any) {
      console.error('Error approving stage:', error);
      alert('Failed to approve stage: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const rejectStage = async (workflowId: string, stageId: string, comments: string) => {
    try {
      setIsLoading(true);
      const response = await axios.put('/api/workflows', {
        workflowId,
        action: 'reject',
        stageId,
        approvalData: {
          comments,
          rejectedAt: new Date().toISOString()
        }
      });

      alert('❌ Stage rejected');
      await loadWorkflows();
      if (workflowDetails && workflowDetails.instance.id === workflowId) {
        await loadWorkflowDetails(workflowId);
      }
    } catch (error: any) {
      console.error('Error rejecting stage:', error);
      alert('Failed to reject stage: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  // ================================================================================
  // UTILITY FUNCTIONS
  // ================================================================================

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'in_progress': return <Play className="w-4 h-4 text-blue-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'cancelled': return <Pause className="w-4 h-4 text-gray-500" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  // ================================================================================
  // RENDER FUNCTIONS
  // ================================================================================

  const renderAnalyticsDashboard = () => {
    if (!analytics) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Workflow Analytics</h3>
          <button
            onClick={() => setCurrentView('list')}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to List
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{analytics.totalWorkflows}</div>
                <div className="text-sm text-gray-600">Total Workflows</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{analytics.activeWorkflows}</div>
                <div className="text-sm text-gray-600">Active Workflows</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{analytics.completionRate.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Completion Rate</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{analytics.averageCompletionTime.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Avg Days to Complete</div>
              </div>
            </div>
          </div>
        </div>

        {/* Completion Rate Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Workflow Status Distribution</h4>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Completed ({analytics.completedWorkflows})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-600">Active ({analytics.activeWorkflows})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500 rounded"></div>
              <span className="text-sm text-gray-600">Other ({analytics.totalWorkflows - analytics.completedWorkflows - analytics.activeWorkflows})</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderWorkflowDetails = () => {
    if (!workflowDetails) return null;

    const { instance, template, history, currentStageDetails } = workflowDetails;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{instance.title}</h3>
            <p className="text-gray-600">{instance.description}</p>
          </div>
          <button
            onClick={() => setCurrentView('list')}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to List
          </button>
        </div>

        {/* Workflow Status */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Workflow Status</h4>
            <div className="flex items-center gap-2">
              {getStatusIcon(instance.status)}
              <span className="text-sm font-medium capitalize">{instance.status}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm font-medium">{instance.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${instance.progress}%` }}
              ></div>
            </div>

            {currentStageDetails && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Current Stage</span>
                </div>
                <div className="text-sm text-blue-800">{currentStageDetails.name}</div>
                <div className="text-xs text-blue-600 mt-1">Type: {currentStageDetails.type}</div>
              </div>
            )}
          </div>
        </div>

        {/* Stage Actions */}
        {currentStageDetails && instance.status === 'in_progress' && (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4">Stage Actions</h4>
            <div className="flex gap-3">
              <button
                onClick={() => approveStage(instance.id, currentStageDetails.id)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                disabled={isLoading}
              >
                <CheckCircle className="w-4 h-4" />
                Approve Stage
              </button>
              <button
                onClick={() => {
                  const comments = prompt('Please provide rejection comments:');
                  if (comments) {
                    rejectStage(instance.id, currentStageDetails.id, comments);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                disabled={isLoading}
              >
                <XCircle className="w-4 h-4" />
                Reject Stage
              </button>
            </div>
          </div>
        )}

        {/* Stage History */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">Stage History</h4>
          <div className="space-y-3">
            {history.map((stage: any, index: number) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  stage.status === 'completed' ? 'bg-green-500' :
                  stage.status === 'rejected' ? 'bg-red-500' :
                  stage.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-400'
                }`}></div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{stage.stageName}</div>
                  <div className="text-sm text-gray-600">
                    Started: {new Date(stage.startedAt).toLocaleString()}
                    {stage.completedAt && ` • Completed: ${new Date(stage.completedAt).toLocaleString()}`}
                  </div>
                  {stage.notes && (
                    <div className="text-sm text-gray-600 mt-1">Notes: {stage.notes}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderWorkflowList = () => {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Enterprise Workflows</h3>
            <p className="text-gray-600">Manage document workflows and approvals</p>
          </div>
          <div className="flex items-center gap-3">
            {showAnalytics && (
              <button
                onClick={() => setCurrentView('analytics')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </button>
            )}
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Start Workflow
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search workflows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
          <button
            onClick={loadWorkflows}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Workflows Grid */}
        <div className="grid gap-4">
          {isLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-gray-400" />
              <p className="text-gray-600 mt-2">Loading workflows...</p>
            </div>
          ) : filteredWorkflows.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto text-gray-400" />
              <p className="text-gray-600 mt-2">No workflows found</p>
              <p className="text-sm text-gray-500">Try adjusting your filters or create a new workflow</p>
            </div>
          ) : (
            filteredWorkflows.map((workflow) => (
              <div
                key={workflow.id}
                className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedWorkflow(workflow);
                  loadWorkflowDetails(workflow.id);
                  if (onWorkflowSelect) onWorkflowSelect(workflow);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{workflow.title}</h4>
                      <div className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(workflow.priority)}`}>
                        {workflow.priority}
                      </div>
                      {getStatusIcon(workflow.status)}
                    </div>
                    
                    {workflow.description && (
                      <p className="text-gray-600 text-sm mb-3">{workflow.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Created: {new Date(workflow.startedAt).toLocaleDateString()}
                      </div>
                      {workflow.dueDate && (
                        <div className="flex items-center gap-1">
                          <Flag className="w-4 h-4" />
                          Due: {new Date(workflow.dueDate).toLocaleDateString()}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        Progress: {workflow.progress}%
                      </div>
                    </div>

                    {workflow.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {workflow.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="ml-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{workflow.progress}%</div>
                        <div className="text-xs text-gray-500">Complete</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // ================================================================================
  // MAIN RENDER
  // ================================================================================

  return (
    <div className="max-w-7xl mx-auto bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Workflow Engine</h1>
                <p className="text-gray-600">Enterprise document workflow management system</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {currentView === 'analytics' && renderAnalyticsDashboard()}
        {currentView === 'details' && renderWorkflowDetails()}
        {currentView === 'list' && renderWorkflowList()}
      </div>

      {/* Create Workflow Modal - Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Workflow</h3>
            <p className="text-gray-600 mb-4">Workflow template selection and creation will be implemented here.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}