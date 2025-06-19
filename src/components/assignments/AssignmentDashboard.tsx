'use client';

import React, { useState, useEffect } from 'react';
import {
  Target,
  User,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Users,
  Calendar,
  Filter,
  Search,
  RefreshCw,
  Plus,
  PlayCircle,
  XCircle,
  TrendingUp,
  Bell,
  UserCheck,
  Zap
} from 'lucide-react';
import { TaskAssignment, AssignmentStatus, TaskPriority, UserType } from '@/services/TaskAssignmentService';

interface AssignmentSummary {
  total: number;
  byStatus: Record<AssignmentStatus, number>;
  overdue: number;
  dueToday: number;
  dueSoon: number;
}

interface AssignmentDashboardProps {
  className?: string;
}

export function AssignmentDashboard({ className = '' }: AssignmentDashboardProps) {
  const [assignments, setAssignments] = useState<TaskAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<AssignmentSummary>({
    total: 0,
    byStatus: {
      assigned: 0,
      accepted: 0,
      in_progress: 0,
      completed: 0,
      delegated: 0,
      overdue: 0,
      cancelled: 0
    },
    overdue: 0,
    dueToday: 0,
    dueSoon: 0
  });

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAssignments();
  }, [statusFilter]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/assignments?type=user_assignments', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch assignments');
      }

      const data = await response.json();
      setAssignments(data.assignments || []);
      
      // Calculate summary statistics
      const assignmentList = data.assignments || [];
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

      const overdue = assignmentList.filter((a: TaskAssignment) => 
        a.dueDate && new Date(a.dueDate) < today && a.status !== 'completed'
      ).length;

      const dueToday = assignmentList.filter((a: TaskAssignment) => 
        a.dueDate && new Date(a.dueDate) >= today && new Date(a.dueDate) < tomorrow
      ).length;

      const dueSoon = assignmentList.filter((a: TaskAssignment) => 
        a.dueDate && new Date(a.dueDate) >= tomorrow && new Date(a.dueDate) < nextWeek
      ).length;

      setSummary({
        total: assignmentList.length,
        byStatus: data.summary?.byStatus || {
          assigned: 0,
          accepted: 0,
          in_progress: 0,
          completed: 0,
          delegated: 0,
          overdue: 0,
          cancelled: 0
        },
        overdue,
        dueToday,
        dueSoon
      });

    } catch (err: any) {
      setError(err.message || 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAssignments();
    setRefreshing(false);
  };

  const handleAssignmentAction = async (assignmentId: string, action: string, params?: any) => {
    try {
      const response = await fetch('/api/assignments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          assignmentId,
          action,
          ...params
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update assignment');
      }

      // Refresh assignments after update
      await fetchAssignments();
    } catch (err: any) {
      console.error('Error updating assignment:', err);
    }
  };

  const getStatusIcon = (status: AssignmentStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'in_progress':
        return <PlayCircle size={16} className="text-blue-600" />;
      case 'assigned':
      case 'accepted':
        return <Clock size={16} className="text-amber-600" />;
      case 'delegated':
        return <Users size={16} className="text-purple-600" />;
      case 'overdue':
        return <AlertTriangle size={16} className="text-red-600" />;
      case 'cancelled':
        return <XCircle size={16} className="text-gray-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: AssignmentStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'assigned':
      case 'accepted':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'delegated':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'critical':
        return 'border-l-red-600 bg-red-50';
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-amber-500 bg-amber-50';
      case 'low':
        return 'border-l-gray-500 bg-gray-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = searchTerm === '' || 
      assignment.taskId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.assignedTo.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || assignment.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className={`bg-white rounded-lg border shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Target size={24} className="text-blue-600" />
              Task Assignments
            </h2>
            <p className="text-gray-600 mt-1">Manage task assignments and track progress</p>
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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Total Assignments</p>
                <p className="text-2xl font-bold text-blue-900">{summary.total}</p>
              </div>
              <Target size={24} className="text-blue-600" />
            </div>
          </div>

          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-800">Overdue</p>
                <p className="text-2xl font-bold text-red-900">{summary.overdue}</p>
              </div>
              <AlertTriangle size={24} className="text-red-600" />
            </div>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-800">Due Today</p>
                <p className="text-2xl font-bold text-amber-900">{summary.dueToday}</p>
              </div>
              <Clock size={24} className="text-amber-600" />
            </div>
          </div>

          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Completed</p>
                <p className="text-2xl font-bold text-green-900">{summary.byStatus.completed}</p>
              </div>
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-3">Status Breakdown</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-amber-600">{summary.byStatus.assigned}</div>
              <div className="text-gray-600">Assigned</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-amber-700">{summary.byStatus.accepted}</div>
              <div className="text-gray-600">Accepted</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{summary.byStatus.in_progress}</div>
              <div className="text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{summary.byStatus.completed}</div>
              <div className="text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{summary.byStatus.delegated}</div>
              <div className="text-gray-600">Delegated</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">{summary.byStatus.overdue}</div>
              <div className="text-gray-600">Overdue</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-600">{summary.byStatus.cancelled}</div>
              <div className="text-gray-600">Cancelled</div>
            </div>
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
                placeholder="Search assignments..."
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
              <option value="assigned">Assigned</option>
              <option value="accepted">Accepted</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="delegated">Delegated</option>
              <option value="overdue">Overdue</option>
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-6">
          <div className="bg-red-100 border border-red-200 text-red-700 rounded-lg p-4 flex items-center gap-2">
            <AlertTriangle size={20} />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assignments...</p>
        </div>
      )}

      {/* Assignments List */}
      {!loading && !error && (
        <div className="p-6">
          {filteredAssignments.length === 0 ? (
            <div className="text-center py-12">
              <Target size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? 'No assignments match your current filters.'
                  : 'You have no task assignments yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAssignments.map((assignment) => (
                <div key={assignment.id} className={`border rounded-lg p-4 hover:shadow-md transition-shadow border-l-4 ${getPriorityColor(assignment.priority)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <UserCheck size={16} className="text-blue-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">Task: {assignment.taskId}</h4>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(assignment.status)}`}>
                            {getStatusIcon(assignment.status)}
                            {assignment.status.replace('_', ' ')}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${ 
                            assignment.priority === 'critical' ? 'bg-red-200 text-red-900' :
                            assignment.priority === 'high' ? 'bg-red-100 text-red-800' :
                            assignment.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {assignment.priority}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <User size={12} />
                            Assigned to: {assignment.assignedTo.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <User size={12} />
                            By: {assignment.assignedBy}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            Assigned: {formatDate(assignment.assignedAt.toISOString())}
                          </span>
                          {assignment.dueDate && (
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              Due: {formatDate(assignment.dueDate.toString())}
                            </span>
                          )}
                        </div>

                        {/* Delegations */}
                        {assignment.delegations.length > 0 && (
                          <div className="mb-3">
                            <h5 className="text-xs font-medium text-gray-700 mb-1">Delegations:</h5>
                            <div className="space-y-1">
                              {assignment.delegations.map((delegation, index) => (
                                <div key={index} className="text-xs text-gray-600 bg-purple-50 p-2 rounded">
                                  Delegated to {delegation.toUserId} - {delegation.status}
                                  {delegation.reason && ` (${delegation.reason})`}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Reminders */}
                        {assignment.reminders.length > 0 && (
                          <div className="mb-3">
                            <h5 className="text-xs font-medium text-gray-700 mb-1">Reminders:</h5>
                            <div className="space-y-1">
                              {assignment.reminders.map((reminder, index) => (
                                <div key={index} className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                                  {reminder.type} - {reminder.status}
                                  {reminder.scheduledFor && ` (scheduled for ${formatDate(reminder.scheduledFor.toString())})`}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {assignment.status === 'assigned' && (
                        <button
                          onClick={() => handleAssignmentAction(assignment.id, 'accept_delegation')}
                          className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                          Accept
                        </button>
                      )}
                      {assignment.status === 'in_progress' && (
                        <button
                          onClick={() => handleAssignmentAction(assignment.id, 'complete')}
                          className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          Complete
                        </button>
                      )}
                      {(assignment.status === 'assigned' || assignment.status === 'accepted') && (
                        <button
                          onClick={() => {
                            const toUserId = prompt('Delegate to user ID:');
                            const reason = prompt('Delegation reason:');
                            if (toUserId && reason) {
                              handleAssignmentAction(assignment.id, 'delegate', { toUserId, reason });
                            }
                          }}
                          className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                        >
                          Delegate
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Assignment metadata */}
                  {Object.keys(assignment.metadata).length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        {Object.entries(assignment.metadata).map(([key, value]) => (
                          <span key={key}>{key}: {JSON.stringify(value)}</span>
                        ))}
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