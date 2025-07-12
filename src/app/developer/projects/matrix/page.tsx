'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Building2,
  Users,
  Calculator,
  Wrench,
  Award,
  Search,
  Filter,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Activity,
  ArrowUpRight,
  BarChart3,
  Eye,
  Star,
  MapPin,
  FileText,
  TrendingUp,
  Shield,
  Home,
  Target,
  Zap,
  Grid,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

/**
 * Unified Project-Professional Matrix View
 * 
 * Comprehensive matrix showing all professionals across all developer projects
 * Provides unified view of resource allocation, project coordination, and performance tracking
 */

interface Project {
  id: string;
  name: string;
  location: string;
  status: 'planning' | 'design' | 'construction' | 'completion';
  progress: number;
  startDate: string;
  targetCompletion: string;
  budget: number;
  value: number;
}

interface Professional {
  id: string;
  name: string;
  company: string;
  type: 'quantity-surveyor' | 'architect' | 'engineer';
  discipline?: string;
  activeProjects: string[];
  currentWorkload: number;
  performance: number;
  location: string;
  yearsExperience: number;
  status: 'available' | 'busy' | 'unavailable';
  dashboardUrl: string;
}

interface ProjectAssignment {
  projectId: string;
  professionalId: string;
  role: string;
  stage: string;
  progress: number;
  startDate: string;
  deliverables: number;
  completedDeliverables: number;
}

export default function UnifiedProjectProfessionalMatrix() {
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedProfessionalType, setSelectedProfessionalType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'matrix' | 'cards' | 'timeline'>('matrix');

  // Sample data
  const projects: Project[] = useMemo(() => [
    {
      id: 'fitzgerald-gardens',
      name: 'Fitzgerald Gardens',
      location: 'Cork',
      status: 'construction',
      progress: 75,
      startDate: '2025-03-01',
      targetCompletion: '2025-12-15',
      budget: 15000000,
      value: 18500000
    },
    {
      id: 'ellwood-development',
      name: 'Ellwood Development',
      location: 'Dublin',
      status: 'design',
      progress: 45,
      startDate: '2025-04-15',
      targetCompletion: '2026-03-30',
      budget: 22000000,
      value: 28000000
    },
    {
      id: 'ballymakenny-view',
      name: 'Ballymakenny View',
      location: 'Drogheda',
      status: 'planning',
      progress: 25,
      startDate: '2025-06-01',
      targetCompletion: '2026-08-15',
      budget: 8500000,
      value: 11200000
    }
  ], []);

  const professionals: Professional[] = useMemo(() => [
    {
      id: 'qs-1',
      name: 'Michael O\'Brien',
      company: 'Byrne Wallace QS',
      type: 'quantity-surveyor',
      activeProjects: ['fitzgerald-gardens', 'ellwood-development'],
      currentWorkload: 85,
      performance: 4.8,
      location: 'Dublin',
      yearsExperience: 12,
      status: 'busy',
      dashboardUrl: '/quantity-surveyor/cost-management'
    },
    {
      id: 'qs-2',
      name: 'Sarah Murphy',
      company: 'Precision Cost Consultants',
      type: 'quantity-surveyor',
      activeProjects: ['ballymakenny-view'],
      currentWorkload: 70,
      performance: 4.6,
      location: 'Cork',
      yearsExperience: 8,
      status: 'available',
      dashboardUrl: '/quantity-surveyor/cost-management'
    },
    {
      id: 'arch-1',
      name: 'Emma Collins',
      company: 'Collins Design Studio',
      type: 'architect',
      activeProjects: ['fitzgerald-gardens', 'ballymakenny-view'],
      currentWorkload: 80,
      performance: 4.7,
      location: 'Dublin',
      yearsExperience: 10,
      status: 'busy',
      dashboardUrl: '/architect/coordination'
    },
    {
      id: 'arch-2',
      name: 'David Walsh',
      company: 'Heritage Architecture',
      type: 'architect',
      activeProjects: ['ellwood-development'],
      currentWorkload: 65,
      performance: 4.5,
      location: 'Galway',
      yearsExperience: 15,
      status: 'available',
      dashboardUrl: '/architect/coordination'
    },
    {
      id: 'eng-1',
      name: 'Patrick O\'Connor',
      company: 'O\'Connor & Associates',
      type: 'engineer',
      discipline: 'structural',
      activeProjects: ['fitzgerald-gardens', 'ellwood-development'],
      currentWorkload: 85,
      performance: 4.7,
      location: 'Dublin',
      yearsExperience: 18,
      status: 'busy',
      dashboardUrl: '/engineer/coordination'
    },
    {
      id: 'eng-2',
      name: 'Lisa Walsh',
      company: 'Walsh Electrical Engineering',
      type: 'engineer',
      discipline: 'electrical',
      activeProjects: ['fitzgerald-gardens', 'ellwood-development'],
      currentWorkload: 80,
      performance: 4.8,
      location: 'Dublin',
      yearsExperience: 14,
      status: 'busy',
      dashboardUrl: '/engineer/coordination'
    }
  ], []);

  const projectAssignments: ProjectAssignment[] = useMemo(() => [
    // Fitzgerald Gardens
    { projectId: 'fitzgerald-gardens', professionalId: 'qs-1', role: 'Lead QS', stage: 'Cost Monitoring', progress: 80, startDate: '2025-03-01', deliverables: 18, completedDeliverables: 14 },
    { projectId: 'fitzgerald-gardens', professionalId: 'arch-1', role: 'Project Architect', stage: 'Design Development', progress: 85, startDate: '2025-03-01', deliverables: 15, completedDeliverables: 13 },
    { projectId: 'fitzgerald-gardens', professionalId: 'eng-1', role: 'Structural Engineer', stage: 'Structural Analysis', progress: 75, startDate: '2025-03-15', deliverables: 12, completedDeliverables: 9 },
    { projectId: 'fitzgerald-gardens', professionalId: 'eng-2', role: 'Electrical Engineer', stage: 'Electrical Design', progress: 70, startDate: '2025-04-01', deliverables: 10, completedDeliverables: 7 },
    
    // Ellwood Development
    { projectId: 'ellwood-development', professionalId: 'qs-1', role: 'Cost Consultant', stage: 'Feasibility Study', progress: 60, startDate: '2025-04-15', deliverables: 12, completedDeliverables: 7 },
    { projectId: 'ellwood-development', professionalId: 'arch-2', role: 'Lead Architect', stage: 'Planning Permission', progress: 50, startDate: '2025-04-15', deliverables: 9, completedDeliverables: 4 },
    { projectId: 'ellwood-development', professionalId: 'eng-1', role: 'Structural Consultant', stage: 'Preliminary Design', progress: 45, startDate: '2025-05-01', deliverables: 8, completedDeliverables: 3 },
    { projectId: 'ellwood-development', professionalId: 'eng-2', role: 'MEP Engineer', stage: 'Systems Planning', progress: 40, startDate: '2025-05-15', deliverables: 6, completedDeliverables: 2 },
    
    // Ballymakenny View
    { projectId: 'ballymakenny-view', professionalId: 'qs-2', role: 'Lead QS', stage: 'Tender Analysis', progress: 30, startDate: '2025-06-01', deliverables: 8, completedDeliverables: 2 },
    { projectId: 'ballymakenny-view', professionalId: 'arch-1', role: 'Design Architect', stage: 'Concept Design', progress: 35, startDate: '2025-06-01', deliverables: 6, completedDeliverables: 2 }
  ], []);

  // Filter data
  const filteredProfessionals = useMemo(() => {
    let filtered = professionals;

    if (selectedProfessionalType !== 'all') {
      filtered = filtered.filter(p => p.type === selectedProfessionalType);
    }

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.company.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [professionals, selectedProfessionalType, searchQuery]);

  const filteredProjects = useMemo(() => {
    if (selectedProject === 'all') return projects;
    return projects.filter(p => p.id === selectedProject);
  }, [projects, selectedProject]);

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'unavailable': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'design': return 'bg-purple-100 text-purple-800';
      case 'construction': return 'bg-orange-100 text-orange-800';
      case 'completion': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'quantity-surveyor': return Calculator;
      case 'architect': return Building2;
      case 'engineer': return Wrench;
      default: return Award;
    }
  };

  const getAssignment = (projectId: string, professionalId: string) => {
    return projectAssignments.find(a => a.projectId === projectId && a.professionalId === professionalId);
  };

  const getOverallStats = () => {
    const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
    const totalValue = projects.reduce((sum, p) => sum + p.value, 0);
    const avgProgress = projects.reduce((sum, p) => sum + p.progress, 0) / projects.length;
    const avgPerformance = professionals.reduce((sum, p) => sum + p.performance, 0) / professionals.length;
    const avgWorkload = professionals.reduce((sum, p) => sum + p.currentWorkload, 0) / professionals.length;

    return {
      totalBudget,
      totalValue,
      avgProgress,
      avgPerformance,
      avgWorkload,
      totalProjects: projects.length,
      totalProfessionals: professionals.length,
      totalAssignments: projectAssignments.length
    };
  };

  const stats = getOverallStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project-Professional Matrix</h1>
          <p className="text-gray-600">Unified view of all professionals across developer projects</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/developer/team">
              <Home className="h-4 w-4 mr-2" />
              Team Dashboard
            </Link>
          </Button>
          <Badge className="bg-emerald-100 text-emerald-800">
            <Grid className="h-3 w-3 mr-1" />
            {stats.totalAssignments} Active Assignments
          </Badge>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">€{(stats.totalValue / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-muted-foreground">Total Project Value</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.avgProgress.toFixed(0)}%</p>
                <p className="text-sm text-muted-foreground">Avg Project Progress</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.totalProfessionals}</p>
                <p className="text-sm text-muted-foreground">Active Professionals</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.avgPerformance.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">Avg Performance</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search professionals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map(project => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedProfessionalType} onValueChange={setSelectedProfessionalType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Professional type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="quantity-surveyor">Quantity Surveyors</SelectItem>
              <SelectItem value="architect">Architects</SelectItem>
              <SelectItem value="engineer">Engineers</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'matrix' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('matrix')}
          >
            <Grid className="h-4 w-4 mr-1" />
            Matrix
          </Button>
          <Button
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('cards')}
          >
            <Users className="h-4 w-4 mr-1" />
            Cards
          </Button>
        </div>
      </div>

      {/* Matrix View */}
      {viewMode === 'matrix' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Grid className="h-5 w-5" />
              Project-Professional Assignment Matrix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 min-w-[200px]">Professional</th>
                    {filteredProjects.map(project => (
                      <th key={project.id} className="text-center p-3 min-w-[150px]">
                        <div>
                          <div className="font-medium">{project.name}</div>
                          <div className="text-xs text-gray-500">{project.location}</div>
                          <Badge className={`mt-1 ${getProjectStatusColor(project.status)} text-xs`}>
                            {project.status}
                          </Badge>
                        </div>
                      </th>
                    ))}
                    <th className="text-center p-3">Workload</th>
                    <th className="text-center p-3">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProfessionals.map(professional => {
                    const TypeIcon = getTypeIcon(professional.type);
                    return (
                      <tr key={professional.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <TypeIcon className="h-5 w-5 text-gray-600" />
                            <div>
                              <div className="font-medium">{professional.name}</div>
                              <div className="text-sm text-gray-600">{professional.company}</div>
                              <Badge className={`mt-1 ${getStatusColor(professional.status)} text-xs`}>
                                {professional.status}
                              </Badge>
                            </div>
                          </div>
                        </td>
                        {filteredProjects.map(project => {
                          const assignment = getAssignment(project.id, professional.id);
                          return (
                            <td key={project.id} className="text-center p-3">
                              {assignment ? (
                                <div className="space-y-1">
                                  <div className="text-sm font-medium">{assignment.role}</div>
                                  <div className="text-xs text-gray-600">{assignment.stage}</div>
                                  <Progress value={assignment.progress} className="h-2" />
                                  <div className="text-xs">
                                    {assignment.completedDeliverables}/{assignment.deliverables} deliverables
                                  </div>
                                </div>
                              ) : (
                                <div className="text-gray-300">-</div>
                              )}
                            </td>
                          );
                        })}
                        <td className="text-center p-3">
                          <div className="flex items-center justify-center">
                            <Progress value={professional.currentWorkload} className="h-3 w-16" />
                            <span className="ml-2 text-sm font-medium">{professional.currentWorkload}%</span>
                          </div>
                        </td>
                        <td className="text-center p-3">
                          <div className="flex items-center justify-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="font-medium">{professional.performance}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cards View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProfessionals.map(professional => {
            const TypeIcon = getTypeIcon(professional.type);
            const assignments = projectAssignments.filter(a => a.professionalId === professional.id);
            
            return (
              <Card key={professional.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <TypeIcon className="h-6 w-6 text-gray-600" />
                      <div>
                        <CardTitle className="text-lg">{professional.name}</CardTitle>
                        <p className="text-sm text-gray-600">{professional.company}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(professional.status)}>
                      {professional.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Performance & Workload */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-medium">{professional.performance}/5</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">Workload:</span>
                      <span className="font-medium">{professional.currentWorkload}%</span>
                    </div>
                  </div>

                  {/* Active Assignments */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Active Assignments</h4>
                    <div className="space-y-2">
                      {assignments.map(assignment => {
                        const project = projects.find(p => p.id === assignment.projectId);
                        return (
                          <div key={assignment.projectId} className="p-2 bg-gray-50 rounded">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">{project?.name}</span>
                              <Link 
                                href={`/developer/projects/${assignment.projectId}`}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <ArrowUpRight className="h-3 w-3" />
                              </Link>
                            </div>
                            <div className="text-xs text-gray-600 mb-1">{assignment.role} • {assignment.stage}</div>
                            <Progress value={assignment.progress} className="h-1" />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Link href={professional.dashboardUrl} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-3 w-3 mr-1" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm">
                      <Activity className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Integration Status */}
      <Card className="bg-gradient-to-r from-blue-50 to-emerald-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-blue-500 rounded-lg mr-4">
                <Shield className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-900">Matrix Integration Active</h3>
                <p className="text-blue-700">
                  Real-time coordination across {stats.totalProjects} projects and {stats.totalProfessionals} professionals
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 text-blue-600 mr-1" />
                    <span className="text-sm text-blue-700">{stats.avgWorkload.toFixed(0)}% Avg Utilization</span>
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-blue-600 mr-1" />
                    <span className="text-sm text-blue-700">{stats.totalAssignments} Active Assignments</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-900">100%</div>
              <div className="text-blue-700 text-sm">Synchronized</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}