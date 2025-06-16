'use client';

import { useState } from 'react';
import { 
  Target, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Filter, 
  Plus, 
  Search, 
  Calendar, 
  ArrowRight, 
  BarChart3,
  Euro,
  Home,
  FileText,
  Shield,
  TrendingUp,
  Zap,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { format, addDays } from 'date-fns';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'high' | 'medium' | 'low';
  category: 'verification' | 'financial' | 'legal' | 'property' | 'documentation' | 'appointment';
  dueDate: Date | null;
  progress: number;
  estimatedTime: number; // in minutes
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  dependencies?: string[];
  tags: string[];
  notes?: string;
}

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'status' | 'progress'>('dueDate');
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [showCompleted, setShowCompleted] = useState(false);

  // Mock tasks data based on the overview page structure
  const tasks: Task[] = [
    {
      id: '1',
      title: 'Complete Mortgage Application',
      description: 'Submit final mortgage application with all supporting documents including proof of income, bank statements, and employment verification.',
      status: 'in_progress',
      priority: 'high',
      category: 'financial',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      progress: 85,
      estimatedTime: 120,
      assignedTo: 'You',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      dependencies: ['kyc-verification'],
      tags: ['mortgage', 'urgent', 'bank'],
      notes: 'Waiting for final employment letter from HR department'
    },
    {
      id: '2',
      title: 'Schedule Property Viewing',
      description: 'Book viewing appointments for shortlisted properties including Fitzgerald Gardens Unit 23 and Ballymakenny View Unit 8.',
      status: 'pending',
      priority: 'high',
      category: 'property',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      progress: 0,
      estimatedTime: 30,
      assignedTo: 'You',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      tags: ['viewing', 'property'],
    },
    {
      id: '3',
      title: 'HTB Application Review',
      description: 'Review and submit Help-to-Buy scheme application. Ensure all eligibility criteria are met and documentation is complete.',
      status: 'pending',
      priority: 'medium',
      category: 'financial',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      progress: 25,
      estimatedTime: 90,
      assignedTo: 'You',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      tags: ['htb', 'government-scheme'],
    },
    {
      id: '4',
      title: 'Legal Advisor Selection',
      description: 'Choose a qualified solicitor for the property purchase process. Get quotes and check references.',
      status: 'pending',
      priority: 'medium',
      category: 'legal',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      progress: 0,
      estimatedTime: 60,
      assignedTo: 'You',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      tags: ['solicitor', 'legal'],
    },
    {
      id: '5',
      title: 'Identity Verification Complete',
      description: 'Upload proof of identity and address for KYC compliance',
      status: 'completed',
      priority: 'high',
      category: 'verification',
      dueDate: null,
      progress: 100,
      estimatedTime: 15,
      assignedTo: 'You',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      tags: ['kyc', 'verification', 'completed'],
    },
    {
      id: '6',
      title: 'Property Insurance Quotes',
      description: 'Get home insurance quotes from at least 3 providers for shortlisted properties',
      status: 'pending',
      priority: 'low',
      category: 'property',
      dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      progress: 0,
      estimatedTime: 45,
      assignedTo: 'You',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['insurance', 'quotes'],
    },
    {
      id: '7',
      title: 'Bank Statement Upload',
      description: 'Upload last 6 months bank statements for mortgage application',
      status: 'overdue',
      priority: 'high',
      category: 'documentation',
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      progress: 0,
      estimatedTime: 20,
      assignedTo: 'You',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      tags: ['bank-statements', 'urgent', 'overdue'],
    }
  ];

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (!showCompleted && task.status === 'completed') return false;
    
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.getTime() - b.dueDate.getTime();
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'status':
        const statusOrder = { overdue: 4, in_progress: 3, pending: 2, completed: 1 };
        return statusOrder[b.status] - statusOrder[a.status];
      case 'progress':
        return b.progress - a.progress;
      default:
        return 0;
    }
  });

  // Statistics
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    overdue: tasks.filter(t => t.status === 'overdue').length,
    pending: tasks.filter(t => t.status === 'pending').length,
  };

  const getTaskIcon = (category: string) => {
    switch (category) {
      case 'verification':
        return <Shield size={16} className="text-blue-600" />;
      case 'financial':
        return <Euro size={16} className="text-green-600" />;
      case 'legal':
        return <FileText size={16} className="text-purple-600" />;
      case 'property':
        return <Home size={16} className="text-amber-600" />;
      case 'documentation':
        return <FileText size={16} className="text-indigo-600" />;
      case 'appointment':
        return <Calendar size={16} className="text-orange-600" />;
      default:
        return <Target size={16} className="text-gray-600" />;
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
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getDaysRemaining = (dueDate: Date | null) => {
    if (!dueDate) return null;
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tasks & To-Do</h1>
            <p className="text-gray-600 mt-1">Manage your home buying journey tasks</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <RefreshCw size={16} />
              Refresh
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus size={16} />
              Add Task
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg border shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Target className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <Zap className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
              
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">All Categories</option>
                <option value="verification">Verification</option>
                <option value="financial">Financial</option>
                <option value="legal">Legal</option>
                <option value="property">Property</option>
                <option value="documentation">Documentation</option>
                <option value="appointment">Appointment</option>
              </select>
              
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="dueDate">Sort by Due Date</option>
                <option value="priority">Sort by Priority</option>
                <option value="status">Sort by Status</option>
                <option value="progress">Sort by Progress</option>
              </select>
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showCompleted}
                  onChange={(e) => setShowCompleted(e.target.checked)}
                  className="rounded"
                />
                Show Completed
              </label>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              Tasks ({sortedTasks.length})
            </h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {sortedTasks.map((task) => {
              const daysRemaining = getDaysRemaining(task.dueDate);
              
              return (
                <Link 
                  key={task.id}
                  href={`/buyer/tasks/${task.id}`}
                  className="block p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`rounded-lg p-2 ${
                        task.status === 'completed' ? 'bg-green-100' :
                        task.status === 'overdue' ? 'bg-red-100' :
                        task.priority === 'high' ? 'bg-red-100' : 
                        'bg-blue-100'
                      }`}>
                        {getTaskIcon(task.category)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{task.title}</h4>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.status)}`}>
                            {task.status.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                            {task.priority.toUpperCase()}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                        
                        <div className="flex items-center gap-6 mb-3">
                          {task.dueDate && (
                            <div className="flex items-center gap-1">
                              <Calendar size={14} className="text-gray-400" />
                              <span className={`text-xs ${
                                daysRemaining !== null && daysRemaining < 0 ? 'text-red-600 font-medium' :
                                daysRemaining !== null && daysRemaining <= 3 ? 'text-amber-600 font-medium' :
                                'text-gray-500'
                              }`}>
                                {daysRemaining !== null && daysRemaining < 0 
                                  ? `${Math.abs(daysRemaining)} days overdue`
                                  : daysRemaining !== null && daysRemaining === 0
                                  ? 'Due today'
                                  : daysRemaining !== null && daysRemaining === 1
                                  ? 'Due tomorrow'
                                  : task.dueDate ? `Due ${format(task.dueDate, 'MMM d, yyyy')}` : ''
                                }
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-1">
                            <Clock size={14} className="text-gray-400" />
                            <span className="text-xs text-gray-500">{task.estimatedTime} min</span>
                          </div>
                          
                          {task.progress > 0 && task.status !== 'completed' && (
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${task.progress}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-600">{task.progress}%</span>
                            </div>
                          )}
                        </div>
                        
                        {task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {task.tags.map((tag) => (
                              <span 
                                key={tag}
                                className="inline-flex px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <ArrowRight className="h-5 w-5 text-gray-400 ml-4" />
                  </div>
                </Link>
              );
            })}
          </div>
          
          {sortedTasks.length === 0 && (
            <div className="p-12 text-center">
              <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}