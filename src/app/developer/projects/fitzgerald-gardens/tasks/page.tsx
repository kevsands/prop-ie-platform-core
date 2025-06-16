'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Filter, 
  Search, 
  Calendar, 
  User, 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  MoreHorizontal,
  ArrowLeft,
  Edit,
  Trash2
} from 'lucide-react';
import Link from 'next/link';

export default function FitzgeraldGardensTasksPage() {
  const [activeFiltersetActiveFilter] = useState('all');
  const [searchTermsetSearchTerm] = useState('');
  const [showNewTaskModalsetShowNewTaskModal] = useState(false);

  const tasks = [
    {
      id: 1,
      title: 'Final planning submission review',
      description: 'Review and submit final planning documents to Louth County Council',
      status: 'in_progress',
      priority: 'high',
      assignee: 'Sarah Chen',
      dueDate: '2025-06-18',
      category: 'Planning',
      tags: ['urgent', 'council'],
      progress: 75,
      subtasks: [
        { id: 1, title: 'Review architectural drawings', completed: true },
        { id: 2, title: 'Check engineering reports', completed: true },
        { id: 3, title: 'Submit to council portal', completed: false },
      ]
    },
    {
      id: 2,
      title: 'Q2 progress meeting with contractors',
      description: 'Quarterly review meeting with main contractors and subcontractors',
      status: 'pending',
      priority: 'medium',
      assignee: 'Michael Burke',
      dueDate: '2025-06-20',
      category: 'Construction',
      tags: ['meeting', 'contractors'],
      progress: 0,
      subtasks: []
    },
    {
      id: 3,
      title: 'Marketing material update',
      description: 'Update brochures and website with latest unit availability',
      status: 'pending',
      priority: 'low',
      assignee: 'Emma Walsh',
      dueDate: '2025-06-22',
      category: 'Marketing',
      tags: ['content', 'website'],
      progress: 0,
      subtasks: []
    },
    {
      id: 4,
      title: 'Site safety inspection',
      description: 'Monthly safety inspection and compliance check',
      status: 'overdue',
      priority: 'high',
      assignee: 'David O\'Connor',
      dueDate: '2025-06-15',
      category: 'Safety',
      tags: ['inspection', 'compliance'],
      progress: 0,
      subtasks: []
    },
    {
      id: 5,
      title: 'Foundation inspection sign-off',
      description: 'Engineer sign-off on Phase 2 foundation work',
      status: 'completed',
      priority: 'high',
      assignee: 'Sarah Chen',
      dueDate: '2025-06-10',
      category: 'Construction',
      tags: ['inspection', 'engineering'],
      progress: 100,
      subtasks: []
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = activeFilter === 'all' || task.status === activeFilter;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const taskCounts = {
    all: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => t.status === 'overdue').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link href="/developer/projects/fitzgerald-gardens" 
                    className="flex items-center text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Project
              </Link>
              <div className="border-l border-gray-300 pl-4">
                <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
                <p className="text-sm text-gray-500">Fitzgerald Gardens</p>
              </div>
            </div>
            <button 
              onClick={() => setShowNewTaskModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex space-x-1">
                {Object.entries(taskCounts).map(([statuscount]) => (
                  <button
                    key={status}
                    onClick={() => setActiveFilter(status)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeFilter === status
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)} ({count})
                  </button>
                ))}
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div key={task.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority} priority
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                    
                    {/* Task Progress */}
                    {task.subtasks.length> 0 && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={ width: `${task.progress}%` }
                          />
                        </div>
                      </div>
                    )}

                    {/* Subtasks */}
                    {task.subtasks.length> 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Subtasks:</h4>
                        <div className="space-y-1">
                          {task.subtasks.map((subtask) => (
                            <div key={subtask.id} className="flex items-center text-sm">
                              <CheckSquare className={`w-4 h-4 mr-2 ${subtask.completed ? 'text-green-600' : 'text-gray-400'}`} />
                              <span className={subtask.completed ? 'line-through text-gray-500' : 'text-gray-700'}>
                                {subtask.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {task.assignee}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                        {task.category}
                      </div>
                    </div>

                    {/* Tags */}
                    {task.tags.length> 0 && (
                      <div className="flex items-center space-x-2 mt-3">
                        {task.tags.map((tagindex) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 rounded-md hover:bg-gray-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first task.'}
            </p>
          </div>
        )}
      </div>

      {/* New Task Modal - Simple placeholder */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Task</h3>
            <p className="text-gray-500 mb-4">Task creation form would go here...</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowNewTaskModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
                Cancel
              </button>
              <button 
                onClick={() => setShowNewTaskModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}