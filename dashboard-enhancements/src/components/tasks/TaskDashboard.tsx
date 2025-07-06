'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  XCircle, 
  PlayCircle,
  Calendar,
  User,
  Target,
  TrendingUp,
  Filter,
  Search,
  Plus,
  RefreshCw,
  FileText,
  CreditCard,
  UserCheck,
  Home,
  Shield,
  Award,
  ArrowRight,
  ExternalLink,
  Upload,
  Phone
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  category: 'financial' | 'legal' | 'documentation' | 'property' | 'verification' | 'completion';
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'optional';
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  completedAt?: string;
  assignedTo?: 'buyer' | 'solicitor' | 'agent' | 'developer' | 'lender';
  dependencies: string[];
  progress: number;
  milestone: string;
  automationTrigger?: string;
  metadata: {
    propertyId?: string;
    documentType?: string;
    amount?: number;
    estimatedDuration?: number;
    stakeholders?: string[];
    externalDeadline?: string;
  };
  actions: {
    type: 'upload_document' | 'make_payment' | 'schedule_appointment' | 'external_link' | 'manual_review';
    label: string;
    url?: string;
    required: boolean;
  }[];
}

interface TaskSummary {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  blocked: number;
  journeyProgress: number;
  milestones: Record<string, { completed: number; total: number; progress: number }>;
}

interface TaskDashboardProps {
  className?: string;
}

export function TaskDashboard({ className = '' }: TaskDashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<TaskSummary>({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    blocked: 0,
    journeyProgress: 0,
    milestones: {}
  });
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [statusFilter, categoryFilter, priorityFilter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (categoryFilter !== 'all') params.set('category', categoryFilter);
      params.set('limit', '50');

      const response = await fetch(`/api/tasks?${params.toString()}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      setTasks(data.tasks || []);
      setSummary(data.summary || {
        total: 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
        blocked: 0,
        journeyProgress: 0,
        milestones: {}
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  const updateTaskStatus = async (taskId: string, status: string, progress?: number) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          taskId,
          status,
          progress: progress || (status === 'completed' ? 100 : status === 'in_progress' ? 50 : 0)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      // Refresh tasks after update
      await fetchTasks();
    } catch (err: any) {
      console.error('Error updating task:', err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'in_progress':
        return <PlayCircle size={16} className="text-blue-600" />;
      case 'pending':
        return <Clock size={16} className="text-amber-600" />;
      case 'blocked':
        return <XCircle size={16} className="text-red-600" />;
      case 'optional':
        return <AlertCircle size={16} className="text-gray-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'blocked':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'optional':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'financial':
        return <CreditCard size={16} className="text-green-600" />;
      case 'legal':
        return <Shield size={16} className="text-purple-600" />;
      case 'documentation':
        return <FileText size={16} className="text-blue-600" />;
      case 'property':
        return <Home size={16} className="text-amber-600" />;
      case 'verification':
        return <UserCheck size={16} className="text-indigo-600" />;
      case 'completion':
        return <Award size={16} className="text-gold-600" />;
      default:
        return <Target size={16} className="text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-amber-500';
      case 'low':
        return 'border-l-gray-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'upload_document':
        return <Upload size={16} />;
      case 'make_payment':
        return <CreditCard size={16} />;
      case 'schedule_appointment':
        return <Calendar size={16} />;
      case 'external_link':
        return <ExternalLink size={16} />;
      case 'manual_review':
        return <User size={16} />;
      default:
        return <ArrowRight size={16} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = searchTerm === '' || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesSearch && matchesPriority;
  });

  const milestoneTitles: Record<string, string> = {
    initial_setup: 'Initial Setup',
    financial_planning: 'Financial Planning',
    property_secured: 'Property Secured',
    legal_setup: 'Legal Setup',
    financing: 'Financing',
    due_diligence: 'Due Diligence',
    contract_stage: 'Contract Stage',
    completion_prep: 'Completion Prep',
    completion: 'Completion'
  };

  return (
    <div className={`bg-white rounded-lg border shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Target size={24} className="text-blue-600" />
              Task Dashboard
            </h2>
            <p className="text-gray-600 mt-1">Track your property purchase journey progress</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Journey Progress */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-blue-900">Journey Progress</h3>
            <span className="text-2xl font-bold text-blue-700">{summary.journeyProgress}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-3 mb-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${summary.journeyProgress}%` }}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{summary.completed}</div>
              <div className="text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{summary.inProgress}</div>
              <div className="text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-amber-600">{summary.pending}</div>
              <div className="text-gray-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-600">{summary.total}</div>
              <div className="text-gray-600">Total Tasks</div>
            </div>
          </div>
        </div>

        {/* Milestone Progress */}
        <div className="mt-6">
          <h3 className="font-semibold text-gray-900 mb-3">Milestone Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.entries(summary.milestones).map(([milestone, data]) => (
              <div key={milestone} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {milestoneTitles[milestone] || milestone}
                  </span>
                  <span className="text-xs text-gray-500">
                    {data.completed}/{data.total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${data.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 border-b bg-gray-50">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="blocked">Blocked</option>
            </select>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="financial">Financial</option>
              <option value="legal">Legal</option>
              <option value="documentation">Documentation</option>
              <option value="property">Property</option>
              <option value="verification">Verification</option>
              <option value="completion">Completion</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-6">
          <div className="bg-red-100 border border-red-200 text-red-700 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      )}

      {/* Tasks List */}
      {!loading && !error && (
        <div className="p-6">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <Target size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' || priorityFilter !== 'all'
                  ? 'No tasks match your current filters.'
                  : 'You have no tasks assigned yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div key={task.id} className={`border rounded-lg p-4 hover:shadow-md transition-shadow border-l-4 ${getPriorityColor(task.priority)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getCategoryIcon(task.category)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{task.title}</h4>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.status)}`}>
                            {getStatusIcon(task.status)}
                            {task.status.replace('_', ' ')}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            task.priority === 'high' ? 'bg-red-100 text-red-800' :
                            task.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                        
                        {/* Progress Bar */}
                        {task.progress > 0 && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-500">Progress</span>
                              <span className="text-xs text-gray-600">{task.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                          {task.assignedTo && (
                            <span className="flex items-center gap-1">
                              <User size={12} />
                              {task.assignedTo}
                            </span>
                          )}
                          {task.dueDate && (
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              Due {formatDate(task.dueDate)}
                            </span>
                          )}
                          {task.metadata.estimatedDuration && (
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {task.metadata.estimatedDuration} days
                            </span>
                          )}
                        </div>

                        {/* Task Actions */}
                        {task.actions.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {task.actions.map((action, index) => (
                              <button
                                key={index}
                                onClick={() => action.url && window.open(action.url, '_blank')}
                                className={`flex items-center gap-1 px-3 py-1 text-xs rounded-lg transition-colors ${
                                  action.required 
                                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {getActionIcon(action.type)}
                                {action.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {task.status !== 'completed' && (
                        <>
                          {task.status === 'pending' && (
                            <button
                              onClick={() => updateTaskStatus(task.id, 'in_progress')}
                              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                              Start
                            </button>
                          )}
                          {task.status === 'in_progress' && (
                            <button
                              onClick={() => updateTaskStatus(task.id, 'completed')}
                              className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            >
                              Complete
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Dependencies */}
                  {task.dependencies.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <span className="text-xs text-gray-500">
                        Depends on: {task.dependencies.join(', ')}
                      </span>
                    </div>
                  )}

                  {/* Metadata */}
                  {(task.metadata.amount || task.metadata.stakeholders) && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        {task.metadata.amount && (
                          <span>Amount: €{task.metadata.amount.toLocaleString()}</span>
                        )}
                        {task.metadata.stakeholders && (
                          <span>Stakeholders: {task.metadata.stakeholders.join(', ')}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}