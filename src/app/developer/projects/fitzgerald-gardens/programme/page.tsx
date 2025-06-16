'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  Plus,
  Download,
  Building,
  AlertTriangle,
  Target,
  TrendingUp,
  Activity
} from 'lucide-react';
import Link from 'next/link';

export default function FitzgeraldGardensProgrammePage() {
  const [activeTabsetActiveTab] = useState('timeline');

  const projectPhases = [
    {
      id: 1,
      name: 'Phase 1 - Site Preparation',
      startDate: '2024-11-01',
      endDate: '2025-02-28',
      status: 'completed',
      progress: 100,
      tasks: 15,
      completedTasks: 15,
      budget: 850000,
      spent: 832000,
      manager: 'David O\'Connor',
      description: 'Site clearance, utilities, and infrastructure preparation'
    },
    {
      id: 2,
      name: 'Phase 2 - Foundation & Structure',
      startDate: '2025-01-15',
      endDate: '2025-07-30',
      status: 'in_progress',
      progress: 75,
      tasks: 28,
      completedTasks: 21,
      budget: 1250000,
      spent: 945000,
      manager: 'Sarah Chen',
      description: 'Foundation work, structural frame, and core construction'
    },
    {
      id: 3,
      name: 'Phase 3 - Building Envelope',
      startDate: '2025-06-01',
      endDate: '2025-11-15',
      status: 'in_progress',
      progress: 35,
      tasks: 22,
      completedTasks: 8,
      budget: 980000,
      spent: 285000,
      manager: 'Michael Burke',
      description: 'External walls, roofing, windows, and weatherproofing'
    },
    {
      id: 4,
      name: 'Phase 4 - Internal Fit-out',
      startDate: '2025-09-01',
      endDate: '2026-03-31',
      status: 'pending',
      progress: 0,
      tasks: 35,
      completedTasks: 0,
      budget: 1450000,
      spent: 0,
      manager: 'Emma Rodriguez',
      description: 'Internal finishes, MEP installation, and unit completion'
    },
    {
      id: 5,
      name: 'Phase 5 - Landscaping & Handover',
      startDate: '2026-02-01',
      endDate: '2026-05-30',
      status: 'pending',
      progress: 0,
      tasks: 18,
      completedTasks: 0,
      budget: 420000,
      spent: 0,
      manager: 'Michael O\'Brien',
      description: 'External works, landscaping, and project handover'
    }
  ];

  const criticalMilestones = [
    {
      id: 1,
      title: 'Planning Permission Granted',
      date: '2025-03-20',
      status: 'completed',
      type: 'approval',
      description: 'Full planning permission approved by Louth County Council'
    },
    {
      id: 2,
      title: 'Foundation Sign-off',
      date: '2025-06-10',
      status: 'completed',
      type: 'construction',
      description: 'Structural engineer approval for foundation work'
    },
    {
      id: 3,
      title: 'Fire Safety Certificate',
      date: '2025-07-15',
      status: 'at_risk',
      type: 'approval',
      description: 'Fire safety certificate decision due from Building Control'
    },
    {
      id: 4,
      title: 'Structural Frame Completion',
      date: '2025-08-30',
      status: 'on_track',
      type: 'construction',
      description: 'All structural elements complete for Phase 2'
    },
    {
      id: 5,
      title: 'Building Envelope Weather-tight',
      date: '2025-11-15',
      status: 'on_track',
      type: 'construction',
      description: 'External envelope complete and weather-tight'
    },
    {
      id: 6,
      title: 'First Unit Handover',
      date: '2026-03-15',
      status: 'pending',
      type: 'handover',
      description: 'First residential units ready for handover'
    }
  ];

  const upcomingDeadlines = [
    { title: 'Fire Safety Certificate Decision', date: '2025-07-15', days: 30, priority: 'high', phase: 'Phase 3' },
    { title: 'Structural Frame Inspection', date: '2025-07-01', days: 16, priority: 'high', phase: 'Phase 2' },
    { title: 'External Wall Installation Start', date: '2025-06-25', days: 10, priority: 'medium', phase: 'Phase 3' },
    { title: 'Building Control Inspection', date: '2025-06-20', days: 5, priority: 'high', phase: 'Phase 2' },
  ];

  const resourceAllocation = [
    { resource: 'Site Managers', allocated: 3, required: 3, utilization: 100 },
    { resource: 'Construction Workers', allocated: 45, required: 52, utilization: 87 },
    { resource: 'Specialized Trades', allocated: 18, required: 20, utilization: 90 },
    { resource: 'Equipment & Machinery', allocated: 12, required: 15, utilization: 80 },
    { resource: 'Quality Inspectors', allocated: 2, required: 2, utilization: 100 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'on_track': return 'bg-green-100 text-green-800';
      case 'at_risk': return 'bg-yellow-100 text-yellow-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />\n  );
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600" />\n  );
      case 'on_track':
        return <TrendingUp className="w-5 h-5 text-green-600" />\n  );
      case 'at_risk':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />\n  );
      case 'delayed':
        return <AlertCircle className="w-5 h-5 text-red-600" />\n  );
      default:
        return <Clock className="w-5 h-5 text-gray-600" />\n  );
    }
  };

  const formatCurrency = (amount) => {
    return `€${(amount / 1000).toFixed(0)}k`;
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
                <h1 className="text-2xl font-bold text-gray-900">Programme Management</h1>
                <p className="text-sm text-gray-500">Fitzgerald Gardens - Timeline, Milestones & Resource Planning</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export Schedule
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Add Milestone
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'timeline', label: 'Project Timeline' },
                { key: 'milestones', label: 'Critical Milestones' },
                { key: 'resources', label: 'Resource Planning' },
                { key: 'deadlines', label: 'Upcoming Deadlines' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            {/* Project Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Building className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Phases</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {projectPhases.filter(phase => phase.status === 'in_progress').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Target className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Overall Progress</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(projectPhases.reduce((accphase) => acc + phase.progress0) / projectPhases.length)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Activity className="w-8 h-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {projectPhases.reduce((accphase) => acc + phase.completedTasks0)}/{projectPhases.reduce((accphase) => acc + phase.tasks0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Budget Used</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round((projectPhases.reduce((accphase) => acc + phase.spent0) / projectPhases.reduce((accphase) => acc + phase.budget0)) * 100)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Phase Timeline */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Project Phases</h2>
                <p className="text-sm text-gray-500 mt-1">Track progress across all construction phases</p>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {projectPhases.map((phaseindex) => (
                    <div key={phase.id} className="relative">
                      {index <projectPhases.length - 1 && (
                        <div className="absolute left-6 top-16 w-0.5 h-20 bg-gray-200" />
                      )}
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {getStatusIcon(phase.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-medium text-gray-900">{phase.name}</h3>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(phase.status)}`}>
                              {phase.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">{phase.description}</p>
                          
                          {/* Progress Bar */}
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{phase.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={ width: `${phase.progress}%` }
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Start Date</p>
                              <p className="font-medium text-gray-900">{new Date(phase.startDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">End Date</p>
                              <p className="font-medium text-gray-900">{new Date(phase.endDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Tasks</p>
                              <p className="font-medium text-gray-900">{phase.completedTasks}/{phase.tasks}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Budget</p>
                              <p className="font-medium text-gray-900">{formatCurrency(phase.spent)}/{formatCurrency(phase.budget)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Manager</p>
                              <p className="font-medium text-gray-900">{phase.manager}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Milestones Tab */}
        {activeTab === 'milestones' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Critical Milestones</h2>
              <p className="text-sm text-gray-500 mt-1">Key project milestones and decision points</p>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {criticalMilestones.map((milestoneindex) => (
                  <div key={milestone.id} className="relative">
                    {index <criticalMilestones.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200" />
                    )}
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(milestone.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{milestone.title}</h3>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(milestone.status)}`}>
                            {milestone.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{milestone.description}</p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(milestone.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                              milestone.type === 'approval' ? 'bg-blue-100 text-blue-700' :
                              milestone.type === 'construction' ? 'bg-green-100 text-green-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {milestone.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Resource Allocation</h2>
                <p className="text-sm text-gray-500 mt-1">Current resource allocation across the project</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {resourceAllocation.map((resourceindex) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-medium text-gray-900">{resource.resource}</h3>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">
                            {resource.allocated}/{resource.required} allocated
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            resource.utilization>= 100 ? 'bg-green-100 text-green-800' :
                            resource.utilization>= 80 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {resource.utilization}% utilized
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-300 ${
                            resource.utilization>= 100 ? 'bg-green-600' :
                            resource.utilization>= 80 ? 'bg-yellow-600' :
                            'bg-red-600'
                          }`}
                          style={ width: `${Math.min(resource.utilization100)}%` }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Deadlines Tab */}
        {activeTab === 'deadlines' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Upcoming Deadlines</h2>
              <p className="text-sm text-gray-500 mt-1">Critical deadlines requiring attention</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {upcomingDeadlines.map((deadlineindex) => (
                  <div key={index} className={`p-4 rounded-lg border ${
                    deadline.days <= 7 ? 'bg-red-50 border-red-200' :
                    deadline.days <= 14 ? 'bg-yellow-50 border-yellow-200' :
                    'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{deadline.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span>{deadline.date} • {deadline.days} days remaining</span>
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-700">
                            {deadline.phase}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          deadline.priority === 'high' ? 'bg-red-100 text-red-800' :
                          deadline.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {deadline.priority}
                        </span>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}