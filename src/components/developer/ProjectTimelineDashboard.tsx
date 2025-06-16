'use client';

import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Target, 
  TrendingUp, 
  BarChart3,
  Flag,
  MapPin,
  Users,
  Building,
  FileText,
  Zap,
  ArrowRight,
  Play,
  Pause,
  RefreshCw,
  AlertTriangle,
  Award,
  Settings
} from 'lucide-react';
import { fitzgeraldGardensConfig } from '@/data/fitzgerald-gardens-config';
import { realDataService } from '@/services/RealDataService';

interface Milestone {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'completed' | 'in_progress' | 'upcoming' | 'delayed';
  priority: 'critical' | 'high' | 'medium' | 'low';
  progress: number;
  dependencies: string[];
  assignee: string;
  category: 'planning' | 'construction' | 'sales' | 'legal' | 'completion';
  tasks: Array<{
    id: string;
    name: string;
    completed: boolean;
    dueDate: Date;
  }>;
}

export default function ProjectTimelineDashboard() {
  const [viewMode, setViewMode] = useState<'timeline' | 'gantt' | 'calendar'>('timeline');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showDelayed, setShowDelayed] = useState(true);
  
  // Get real project data
  const config = fitzgeraldGardensConfig;
  const projectTimeline = realDataService.getRealProjectTimeline();
  
  // Generate realistic milestones based on actual project data
  const milestones: Milestone[] = useMemo(() => [
    {
      id: 'planning-permission',
      name: 'Planning Permission Approved',
      description: 'Official planning permission granted by Cork City Council',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-15'),
      status: 'completed',
      priority: 'critical',
      progress: 100,
      dependencies: [],
      assignee: 'Planning Department',
      category: 'planning',
      tasks: [
        { id: 'submit-application', name: 'Submit Planning Application', completed: true, dueDate: new Date('2024-01-05') },
        { id: 'council-review', name: 'Council Review Process', completed: true, dueDate: new Date('2024-01-12') },
        { id: 'approval-received', name: 'Approval Documentation', completed: true, dueDate: new Date('2024-01-15') }
      ]
    },
    {
      id: 'site-preparation',
      name: 'Site Preparation & Infrastructure',
      description: 'Site clearance, utilities connection, and foundation preparation',
      startDate: new Date(config.projectStartDate),
      endDate: new Date('2024-03-15'),
      status: 'completed',
      priority: 'critical',
      progress: 100,
      dependencies: ['planning-permission'],
      assignee: 'Murphy Construction',
      category: 'construction',
      tasks: [
        { id: 'site-clearance', name: 'Site Clearance', completed: true, dueDate: new Date('2024-02-10') },
        { id: 'utilities-connection', name: 'Utilities Connection', completed: true, dueDate: new Date('2024-02-25') },
        { id: 'foundation-prep', name: 'Foundation Preparation', completed: true, dueDate: new Date('2024-03-15') }
      ]
    },
    {
      id: 'foundation-work',
      name: 'Foundation & Ground Floor',
      description: 'Concrete foundation work and ground floor construction',
      startDate: new Date('2024-03-16'),
      endDate: new Date('2024-04-30'),
      status: 'completed',
      priority: 'critical',
      progress: 100,
      dependencies: ['site-preparation'],
      assignee: 'Murphy Construction',
      category: 'construction',
      tasks: [
        { id: 'foundation-pour', name: 'Foundation Pour', completed: true, dueDate: new Date('2024-04-01') },
        { id: 'ground-floor-slab', name: 'Ground Floor Slab', completed: true, dueDate: new Date('2024-04-20') },
        { id: 'structural-inspection', name: 'Structural Inspection', completed: true, dueDate: new Date('2024-04-30') }
      ]
    },
    {
      id: 'structural-framework',
      name: 'Structural Framework Phase 1',
      description: 'First floor and building framework construction',
      startDate: new Date('2024-05-01'),
      endDate: new Date('2024-07-15'),
      status: 'in_progress',
      priority: 'critical',
      progress: 75,
      dependencies: ['foundation-work'],
      assignee: 'Murphy Construction',
      category: 'construction',
      tasks: [
        { id: 'first-floor-structure', name: 'First Floor Structure', completed: true, dueDate: new Date('2024-06-15') },
        { id: 'roof-framework', name: 'Roof Framework', completed: false, dueDate: new Date('2024-07-10') },
        { id: 'phase1-inspection', name: 'Phase 1 Inspection', completed: false, dueDate: new Date('2024-07-15') }
      ]
    },
    {
      id: 'building-envelope',
      name: 'Building Envelope & Exterior',
      description: 'External walls, windows, roofing, and weatherproofing',
      startDate: new Date('2024-07-16'),
      endDate: new Date('2024-10-30'),
      status: 'upcoming',
      priority: 'high',
      progress: 0,
      dependencies: ['structural-framework'],
      assignee: 'Exterior Specialists Ltd',
      category: 'construction',
      tasks: [
        { id: 'external-walls', name: 'External Walls Installation', completed: false, dueDate: new Date('2024-08-30') },
        { id: 'windows-doors', name: 'Windows & Doors', completed: false, dueDate: new Date('2024-09-30') },
        { id: 'roofing-complete', name: 'Roofing Completion', completed: false, dueDate: new Date('2024-10-30') }
      ]
    },
    {
      id: 'mechanical-electrical',
      name: 'Mechanical & Electrical Systems',
      description: 'Plumbing, electrical, HVAC, and telecommunications installation',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2024-12-15'),
      status: 'upcoming',
      priority: 'high',
      progress: 0,
      dependencies: ['building-envelope'],
      assignee: 'M&E Contractors',
      category: 'construction',
      tasks: [
        { id: 'electrical-rough', name: 'Electrical Rough-in', completed: false, dueDate: new Date('2024-10-15') },
        { id: 'plumbing-install', name: 'Plumbing Installation', completed: false, dueDate: new Date('2024-11-15') },
        { id: 'hvac-systems', name: 'HVAC Systems', completed: false, dueDate: new Date('2024-12-15') }
      ]
    },
    {
      id: 'interior-fitout',
      name: 'Interior Fit-out',
      description: 'Flooring, kitchen installation, bathroom fit-out, and interior finishes',
      startDate: new Date('2024-12-01'),
      endDate: new Date('2025-03-30'),
      status: 'upcoming',
      priority: 'medium',
      progress: 0,
      dependencies: ['mechanical-electrical'],
      assignee: 'Kelly Interiors',
      category: 'construction',
      tasks: [
        { id: 'flooring-install', name: 'Flooring Installation', completed: false, dueDate: new Date('2025-01-30') },
        { id: 'kitchen-fitout', name: 'Kitchen Fit-out', completed: false, dueDate: new Date('2025-02-28') },
        { id: 'bathroom-complete', name: 'Bathroom Completion', completed: false, dueDate: new Date('2025-03-30') }
      ]
    },
    {
      id: 'sales-launch',
      name: 'Sales Launch Campaign',
      description: 'Marketing launch and sales center opening',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-07-01'),
      status: 'completed',
      priority: 'high',
      progress: 100,
      dependencies: ['foundation-work'],
      assignee: 'Marketing Team',
      category: 'sales',
      tasks: [
        { id: 'marketing-materials', name: 'Marketing Materials', completed: true, dueDate: new Date('2024-06-15') },
        { id: 'sales-center', name: 'Sales Center Setup', completed: true, dueDate: new Date('2024-06-25') },
        { id: 'launch-event', name: 'Launch Event', completed: true, dueDate: new Date('2024-07-01') }
      ]
    },
    {
      id: 'final-inspections',
      name: 'Final Inspections & Compliance',
      description: 'Building compliance, safety inspections, and certification',
      startDate: new Date('2025-04-01'),
      endDate: new Date('2025-07-01'),
      status: 'upcoming',
      priority: 'critical',
      progress: 0,
      dependencies: ['interior-fitout'],
      assignee: 'Compliance Team',
      category: 'legal',
      tasks: [
        { id: 'building-inspection', name: 'Building Inspection', completed: false, dueDate: new Date('2025-05-15') },
        { id: 'fire-safety-cert', name: 'Fire Safety Certificate', completed: false, dueDate: new Date('2025-06-15') },
        { id: 'occupancy-permit', name: 'Occupancy Permit', completed: false, dueDate: new Date('2025-07-01') }
      ]
    },
    {
      id: 'project-completion',
      name: 'Project Completion & Handover',
      description: 'Final handover, warranties, and project close-out',
      startDate: new Date('2025-07-01'),
      endDate: new Date(config.estimatedCompletion),
      status: 'upcoming',
      priority: 'critical',
      progress: 0,
      dependencies: ['final-inspections'],
      assignee: 'Project Manager',
      category: 'completion',
      tasks: [
        { id: 'final-handover', name: 'Unit Handovers', completed: false, dueDate: new Date('2025-08-01') },
        { id: 'warranty-docs', name: 'Warranty Documentation', completed: false, dueDate: new Date('2025-08-10') },
        { id: 'project-closeout', name: 'Project Close-out', completed: false, dueDate: new Date(config.estimatedCompletion) }
      ]
    }
  ], [config]);

  // Filter milestones
  const filteredMilestones = useMemo(() => {
    let filtered = milestones;
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(m => m.category === filterCategory);
    }
    
    if (!showDelayed) {
      filtered = filtered.filter(m => m.status !== 'delayed');
    }
    
    return filtered.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }, [milestones, filterCategory, showDelayed]);

  // Calculate overall project stats
  const projectStats = useMemo(() => {
    const totalMilestones = milestones.length;
    const completedMilestones = milestones.filter(m => m.status === 'completed').length;
    const inProgressMilestones = milestones.filter(m => m.status === 'in_progress').length;
    const delayedMilestones = milestones.filter(m => m.status === 'delayed').length;
    const upcomingMilestones = milestones.filter(m => m.status === 'upcoming').length;
    
    const overallProgress = milestones.reduce((sum, m) => sum + m.progress, 0) / totalMilestones;
    
    return {
      totalMilestones,
      completedMilestones,
      inProgressMilestones,
      delayedMilestones,
      upcomingMilestones,
      overallProgress
    };
  }, [milestones]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delayed': return 'bg-red-100 text-red-800 border-red-200';
      case 'upcoming': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'planning': return <FileText size={16} />;
      case 'construction': return <Building size={16} />;
      case 'sales': return <Target size={16} />;
      case 'legal': return <CheckCircle size={16} />;
      case 'completion': return <Award size={16} />;
      default: return <Flag size={16} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'planning': return 'text-purple-600';
      case 'construction': return 'text-blue-600';
      case 'sales': return 'text-green-600';
      case 'legal': return 'text-amber-600';
      case 'completion': return 'text-emerald-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Project Timeline Dashboard</h2>
          <p className="text-gray-600">Real-time progress tracking for {config.projectName}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['timeline', 'gantt', 'calendar'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-3 py-1 rounded text-sm transition-colors capitalize ${
                  viewMode === mode ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Categories</option>
            <option value="planning">Planning</option>
            <option value="construction">Construction</option>
            <option value="sales">Sales</option>
            <option value="legal">Legal</option>
            <option value="completion">Completion</option>
          </select>
        </div>
      </div>

      {/* Project Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overall Progress</p>
              <p className="text-2xl font-bold text-blue-600">{projectStats.overallProgress.toFixed(0)}%</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${projectStats.overallProgress}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{projectStats.completedMilestones}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-xs text-gray-500 mt-1">of {projectStats.totalMilestones} milestones</p>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{projectStats.inProgressMilestones}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-xs text-gray-500 mt-1">active milestones</p>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-amber-600">{projectStats.upcomingMilestones}</p>
            </div>
            <Calendar className="h-8 w-8 text-amber-600" />
          </div>
          <p className="text-xs text-gray-500 mt-1">planned milestones</p>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Est. Completion</p>
              <p className="text-lg font-bold text-emerald-600">
                {new Date(config.estimatedCompletion).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </p>
            </div>
            <Target className="h-8 w-8 text-emerald-600" />
          </div>
          <p className="text-xs text-gray-500 mt-1">target date</p>
        </div>
      </div>

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <div className="bg-white rounded-lg border">
          <div className="p-6">
            <div className="space-y-6">
              {filteredMilestones.map((milestone, index) => (
                <div key={milestone.id} className="relative">
                  {/* Timeline line */}
                  {index < filteredMilestones.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    {/* Status indicator */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                      milestone.status === 'completed' ? 'bg-green-100 border-green-500' :
                      milestone.status === 'in_progress' ? 'bg-blue-100 border-blue-500' :
                      milestone.status === 'delayed' ? 'bg-red-100 border-red-500' :
                      'bg-gray-100 border-gray-300'
                    }`}>
                      {milestone.status === 'completed' ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : milestone.status === 'in_progress' ? (
                        <Clock className="w-6 h-6 text-blue-600" />
                      ) : milestone.status === 'delayed' ? (
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                      ) : (
                        <Calendar className="w-6 h-6 text-gray-600" />
                      )}
                    </div>

                    {/* Milestone content */}
                    <div className="flex-1 min-w-0">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`p-1.5 rounded ${getCategoryColor(milestone.category)}`}>
                                {getCategoryIcon(milestone.category)}
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900">{milestone.name}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(milestone.status)}`}>
                                {milestone.status.replace('_', ' ').charAt(0).toUpperCase() + milestone.status.replace('_', ' ').slice(1)}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-3">{milestone.description}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-gray-700">Duration:</span>
                                <div className="text-gray-600">
                                  {milestone.startDate.toLocaleDateString()} - {milestone.endDate.toLocaleDateString()}
                                </div>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Assignee:</span>
                                <div className="text-gray-600">{milestone.assignee}</div>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Priority:</span>
                                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                  milestone.priority === 'critical' ? 'bg-red-100 text-red-800' :
                                  milestone.priority === 'high' ? 'bg-amber-100 text-amber-800' :
                                  milestone.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {milestone.priority}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex-shrink-0">
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-900">{milestone.progress}%</div>
                              <div className="text-sm text-gray-600">Progress</div>
                              <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                                <div 
                                  className={`h-2 rounded-full ${
                                    milestone.status === 'completed' ? 'bg-green-500' :
                                    milestone.status === 'in_progress' ? 'bg-blue-500' :
                                    milestone.status === 'delayed' ? 'bg-red-500' : 'bg-gray-400'
                                  }`}
                                  style={{ width: `${milestone.progress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Tasks breakdown */}
                        {milestone.tasks.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <h4 className="font-medium text-gray-900 mb-2">Key Tasks:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              {milestone.tasks.map((task) => (
                                <div key={task.id} className="flex items-center gap-2 text-sm">
                                  {task.completed ? (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <Clock className="w-4 h-4 text-gray-400" />
                                  )}
                                  <span className={task.completed ? 'text-gray-600 line-through' : 'text-gray-800'}>
                                    {task.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Critical Path Analysis */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Critical Path Analysis</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Current Risks</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800">Weather Delays Risk</p>
                  <p className="text-sm text-amber-700">Upcoming exterior work phase vulnerable to weather conditions</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">Material Delivery Schedule</p>
                  <p className="text-sm text-blue-700">Coordinate window delivery timing with installation phase</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Next Milestones</h4>
            <div className="space-y-3">
              {filteredMilestones
                .filter(m => m.status === 'in_progress' || m.status === 'upcoming')
                .slice(0, 3)
                .map((milestone) => (
                  <div key={milestone.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={getCategoryColor(milestone.category)}>
                      {getCategoryIcon(milestone.category)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{milestone.name}</p>
                      <p className="text-sm text-gray-600">Due: {milestone.endDate.toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{milestone.progress}%</div>
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{ width: `${milestone.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}