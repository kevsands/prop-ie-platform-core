/**
 * Engineer Coordination Dashboard
 * 
 * Month 2, Week 1 Implementation: Core Professional Roles
 * Multi-discipline engineer coordination for Structural, Civil, MEP, Environmental engineers
 * 
 * Features:
 * - Multi-discipline coordination interface
 * - Engineering stage management (Survey → Analysis → Design → Review → Sign-off)
 * - Cross-discipline dependency tracking
 * - Engineers Ireland compliance
 * - Technical documentation management
 * - Project coordination with architects and other professionals
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  ClipboardList, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  FileText,
  Settings,
  BarChart3,
  MessageSquare,
  Calculator,
  Zap,
  Building,
  Droplets,
  Thermometer,
  Shield,
  Activity,
  Home
} from 'lucide-react';

export interface EngineeringDiscipline {
  id: string;
  name: string;
  type: 'structural' | 'civil' | 'mechanical' | 'electrical' | 'plumbing' | 'environmental' | 'fire' | 'acoustic';
  leadEngineer: EngineerProfile;
  team: EngineerProfile[];
  status: 'not_started' | 'in_progress' | 'review' | 'approved' | 'on_hold';
  progress: number;
  currentStage: string;
  dependencies: string[];
  deliverables: EngineeringDeliverable[];
  timeline: {
    startDate: Date;
    targetDate: Date;
    actualDate?: Date;
  };
}

export interface EngineerProfile {
  id: string;
  name: string;
  title: string;
  discipline: string;
  qualifications: string[];
  registrationNumber?: string;
  contactInfo: {
    email: string;
    phone: string;
    company: string;
  };
  workload: number;
  availability: 'available' | 'busy' | 'unavailable';
  specializations: string[];
}

export interface EngineeringDeliverable {
  id: string;
  name: string;
  type: 'calculation' | 'drawing' | 'specification' | 'report' | 'model' | 'analysis';
  discipline: string;
  status: 'not_started' | 'in_progress' | 'review' | 'approved';
  version: string;
  fileUrl?: string;
  lastModified: Date;
  modifiedBy: string;
  dependencies: string[];
  reviewers: string[];
}

export interface EngineeringStage {
  id: string;
  name: string;
  disciplines: string[];
  status: 'not_started' | 'in_progress' | 'review' | 'approved' | 'delayed';
  progress: number;
  startDate?: Date;
  targetDate: Date;
  dependencies: string[];
  criticalPath: boolean;
  deliverables: string[];
}

export interface ProjectCoordination {
  projectId: string;
  projectName: string;
  projectType: 'residential' | 'commercial' | 'industrial' | 'infrastructure';
  disciplines: EngineeringDiscipline[];
  stages: EngineeringStage[];
  compliance: {
    engineersIreland: {
      registered: boolean;
      certificationRequired: boolean;
      status: 'compliant' | 'pending' | 'non_compliant';
    };
    buildingStandards: {
      eurocode: boolean;
      irishStandards: boolean;
      bcar: boolean;
    };
  };
  coordination: {
    crossDisciplinary: CrossDisciplinaryItem[];
    architectInterface: ArchitectInterface[];
    meetings: CoordinationMeeting[];
  };
}

export interface CrossDisciplinaryItem {
  id: string;
  title: string;
  disciplines: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved';
  description: string;
  assignedTo: string[];
  dueDate: Date;
  resolutionNotes?: string;
}

export interface ArchitectInterface {
  id: string;
  architectElement: string;
  engineeringRequirement: string;
  discipline: string;
  status: 'pending' | 'coordinated' | 'approved';
  lastUpdated: Date;
  notes: string;
}

export interface CoordinationMeeting {
  id: string;
  title: string;
  type: 'design' | 'coordination' | 'review' | 'approval';
  participants: string[];
  scheduledDate: Date;
  agenda: string[];
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  outcomes?: string[];
}

const EngineerCoordinationDashboard: React.FC = () => {
  const [projectData, setProjectData] = useState<ProjectCoordination | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');

  useEffect(() => {
    loadProjectData();
  }, []);

  const loadProjectData = async () => {
    try {
      const response = await fetch('/api/engineer/coordination?action=get_project&projectId=fitzgerald-gardens-eng');
      const data = await response.json() as { success: boolean; project?: ProjectCoordination };
      
      if (data.success && data.project) {
        setProjectData(data.project);
      }
    } catch (error) {
      console.error('Failed to load engineer coordination data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'approved':
      case 'compliant':
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
      case 'coordinated':
        return 'bg-blue-100 text-blue-800';
      case 'review':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'delayed':
      case 'non_compliant':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDisciplineIcon = (type: string) => {
    switch (type) {
      case 'structural':
        return <Building className="h-4 w-4" />;
      case 'civil':
        return <Settings className="h-4 w-4" />;
      case 'mechanical':
        return <Settings className="h-4 w-4" />;
      case 'electrical':
        return <Zap className="h-4 w-4" />;
      case 'plumbing':
        return <Droplets className="h-4 w-4" />;
      case 'environmental':
        return <Thermometer className="h-4 w-4" />;
      case 'fire':
        return <Shield className="h-4 w-4" />;
      case 'acoustic':
        return <Activity className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading engineer coordination dashboard...</p>
        </div>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="mt-4 text-gray-600">Failed to load project data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Engineer Coordination</h1>
              <p className="text-gray-600 mt-1">{projectData.projectName} - Multi-Discipline Engineering</p>
            </div>
            <div className="flex gap-3">
              <Link href="/developer/team/engineers">
                <Button variant="outline">
                  <Home className="h-4 w-4 mr-2" />
                  Developer Dashboard
                </Button>
              </Link>
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Coordinate Team
              </Button>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </div>

        {/* Project Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Disciplines</p>
                  <p className="text-2xl font-bold text-gray-900">{projectData.disciplines.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Engineers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {projectData.disciplines.reduce((total, d) => total + d.team.length + 1, 0)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overall Progress</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(projectData.disciplines.reduce((total, d) => total + d.progress, 0) / projectData.disciplines.length)}%
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cross-Discipline Items</p>
                  <p className="text-2xl font-bold text-gray-900">{projectData.coordination.crossDisciplinary.length}</p>
                </div>
                <ClipboardList className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="disciplines">Disciplines</TabsTrigger>
            <TabsTrigger value="coordination">Coordination</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Discipline Status Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Engineering Disciplines Status</CardTitle>
                <CardDescription>Current status of all engineering disciplines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {projectData.disciplines.map((discipline) => (
                    <div key={discipline.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getDisciplineIcon(discipline.type)}
                          <h4 className="font-medium">{discipline.name}</h4>
                        </div>
                        <Badge className={getStatusColor(discipline.status)}>
                          {discipline.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{discipline.progress}%</span>
                          </div>
                          <Progress value={discipline.progress} className="h-2" />
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          <p><strong>Lead:</strong> {discipline.leadEngineer.name}</p>
                          <p><strong>Team:</strong> {discipline.team.length + 1} engineers</p>
                          <p><strong>Stage:</strong> {discipline.currentStage}</p>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          <p>Target: {discipline.timeline.targetDate.toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Engineering Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Structural calculations approved</p>
                      <p className="text-sm text-gray-600">Foundation design calculations have been approved by MIEI reviewer</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium">MEP coordination meeting scheduled</p>
                      <p className="text-sm text-gray-600">Cross-discipline coordination for mechanical and electrical systems</p>
                      <p className="text-xs text-gray-500">4 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <FileText className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Civil engineering drawings updated</p>
                      <p className="text-sm text-gray-600">Site layout and drainage designs updated to v2.1</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Disciplines Tab */}
          <TabsContent value="disciplines" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Engineering Disciplines</h3>
              <Select value={selectedDiscipline} onValueChange={setSelectedDiscipline}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by discipline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Disciplines</SelectItem>
                  {projectData.disciplines.map((discipline) => (
                    <SelectItem key={discipline.id} value={discipline.id}>
                      {discipline.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projectData.disciplines
                .filter(d => selectedDiscipline === 'all' || d.id === selectedDiscipline)
                .map((discipline) => (
                <Card key={discipline.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getDisciplineIcon(discipline.type)}
                        <CardTitle>{discipline.name}</CardTitle>
                      </div>
                      <Badge className={getStatusColor(discipline.status)}>
                        {discipline.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Progress */}
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Overall Progress</span>
                          <span className="text-sm">{discipline.progress}%</span>
                        </div>
                        <Progress value={discipline.progress} />
                      </div>

                      {/* Lead Engineer */}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <h4 className="font-medium mb-2">Lead Engineer</h4>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{discipline.leadEngineer.name}</p>
                            <p className="text-sm text-gray-600">{discipline.leadEngineer.title}</p>
                            <div className="flex gap-1 mt-1">
                              {discipline.leadEngineer.qualifications.map((qual, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {qual}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="text-right text-sm text-gray-600">
                            <p>Workload: {discipline.leadEngineer.workload}%</p>
                            <Badge 
                              className={
                                discipline.leadEngineer.availability === 'available' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }
                            >
                              {discipline.leadEngineer.availability}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Team */}
                      <div>
                        <h4 className="font-medium mb-2">Team Members ({discipline.team.length})</h4>
                        <div className="space-y-2">
                          {discipline.team.slice(0, 3).map((member, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span>{member.name} - {member.title}</span>
                              <Badge variant="outline" className="text-xs">
                                {member.workload}% loaded
                              </Badge>
                            </div>
                          ))}
                          {discipline.team.length > 3 && (
                            <p className="text-sm text-gray-500">
                              +{discipline.team.length - 3} more team members
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Current Deliverables */}
                      <div>
                        <h4 className="font-medium mb-2">Active Deliverables</h4>
                        <div className="space-y-2">
                          {discipline.deliverables
                            .filter(d => d.status !== 'approved')
                            .slice(0, 3)
                            .map((deliverable) => (
                            <div key={deliverable.id} className="flex items-center justify-between text-sm">
                              <span>{deliverable.name}</span>
                              <Badge className={getStatusColor(deliverable.status)}>
                                {deliverable.status.replace('_', ' ')}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          Update Status
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Coordination Tab */}
          <TabsContent value="coordination" className="space-y-6">
            {/* Cross-Disciplinary Coordination */}
            <Card>
              <CardHeader>
                <CardTitle>Cross-Disciplinary Coordination</CardTitle>
                <CardDescription>Items requiring coordination between multiple engineering disciplines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectData.coordination.crossDisciplinary.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={
                            item.priority === 'critical' ? 'bg-red-100 text-red-800' :
                            item.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {item.priority}
                          </Badge>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Disciplines:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.disciplines.map((discipline, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {discipline}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Due Date:</span>
                          <p className="text-gray-600">{item.dueDate.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="font-medium">Assigned:</span>
                          <p className="text-gray-600">{item.assignedTo.length} engineers</p>
                        </div>
                      </div>

                      {item.resolutionNotes && (
                        <div className="mt-3 p-3 bg-green-50 rounded">
                          <span className="font-medium text-green-800">Resolution Notes:</span>
                          <p className="text-sm text-green-700 mt-1">{item.resolutionNotes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Architect Interface */}
            <Card>
              <CardHeader>
                <CardTitle>Architect Interface Items</CardTitle>
                <CardDescription>Coordination items with architectural team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {projectData.coordination.architectInterface.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{item.architectElement}</span>
                          <span className="text-gray-400">→</span>
                          <span className="text-gray-600">{item.engineeringRequirement}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span>Discipline: {item.discipline}</span>
                          <span>Updated: {item.lastUpdated.toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Engineers Ireland Compliance */}
              <Card>
                <CardHeader>
                  <CardTitle>Engineers Ireland Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Project Registration</span>
                      <Badge className={
                        projectData.compliance.engineersIreland.registered 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }>
                        {projectData.compliance.engineersIreland.registered ? 'Registered' : 'Not Registered'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Certification Required</span>
                      <Badge className={
                        projectData.compliance.engineersIreland.certificationRequired 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-gray-100 text-gray-800'
                      }>
                        {projectData.compliance.engineersIreland.certificationRequired ? 'Required' : 'Not Required'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Overall Status</span>
                      <Badge className={getStatusColor(projectData.compliance.engineersIreland.status)}>
                        {projectData.compliance.engineersIreland.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Building Standards Compliance */}
              <Card>
                <CardHeader>
                  <CardTitle>Building Standards Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Eurocode Compliance</span>
                      <Badge className={
                        projectData.compliance.buildingStandards.eurocode 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }>
                        {projectData.compliance.buildingStandards.eurocode ? 'Compliant' : 'Non-Compliant'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Irish Standards (I.S.)</span>
                      <Badge className={
                        projectData.compliance.buildingStandards.irishStandards 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }>
                        {projectData.compliance.buildingStandards.irishStandards ? 'Compliant' : 'Non-Compliant'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>BCAR Requirements</span>
                      <Badge className={
                        projectData.compliance.buildingStandards.bcar 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }>
                        {projectData.compliance.buildingStandards.bcar ? 'Compliant' : 'Non-Compliant'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Professional Registration Status */}
            <Card>
              <CardHeader>
                <CardTitle>Professional Registration Status</CardTitle>
                <CardDescription>Engineers Ireland registration status for all project engineers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectData.disciplines.map((discipline) => (
                    <div key={discipline.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{discipline.name}</h4>
                        <Badge className="bg-blue-100 text-blue-800">
                          {discipline.team.length + 1} engineers
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        {/* Lead Engineer */}
                        <div className="flex items-center justify-between text-sm">
                          <div>
                            <span className="font-medium">{discipline.leadEngineer.name}</span>
                            <span className="text-gray-500 ml-2">(Lead)</span>
                          </div>
                          <div className="flex gap-2">
                            {discipline.leadEngineer.qualifications.map((qual, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {qual}
                              </Badge>
                            ))}
                            {discipline.leadEngineer.registrationNumber && (
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                Reg: {discipline.leadEngineer.registrationNumber}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* Team Members */}
                        {discipline.team.slice(0, 2).map((member, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span>{member.name}</span>
                            <div className="flex gap-2">
                              {member.qualifications.map((qual, qualIndex) => (
                                <Badge key={qualIndex} variant="outline" className="text-xs">
                                  {qual}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Deliverables Tab */}
          <TabsContent value="deliverables" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Engineering Deliverables</CardTitle>
                <CardDescription>All engineering deliverables across disciplines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectData.disciplines.map((discipline) => (
                    <div key={discipline.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-4">
                        {getDisciplineIcon(discipline.type)}
                        <h4 className="font-medium">{discipline.name}</h4>
                        <Badge variant="outline">
                          {discipline.deliverables.length} deliverables
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {discipline.deliverables.map((deliverable) => (
                          <div key={deliverable.id} className="border rounded p-3">
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-medium text-sm">{deliverable.name}</h5>
                              <Badge className={getStatusColor(deliverable.status)}>
                                {deliverable.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            
                            <div className="text-xs text-gray-600 space-y-1">
                              <p>Type: {deliverable.type}</p>
                              <p>Version: {deliverable.version}</p>
                              <p>Modified: {deliverable.lastModified.toLocaleDateString()}</p>
                              <p>By: {deliverable.modifiedBy}</p>
                            </div>
                            
                            {deliverable.dependencies.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs font-medium text-gray-600">Dependencies:</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {deliverable.dependencies.map((dep, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {dep}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div className="mt-3 flex gap-2">
                              <Button size="sm" variant="outline" className="text-xs">
                                View
                              </Button>
                              <Button size="sm" variant="outline" className="text-xs">
                                Download
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Engineering Timeline</CardTitle>
                <CardDescription>Project timeline and milestones for all engineering disciplines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {projectData.stages.map((stage) => (
                    <div key={stage.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium">{stage.name}</h4>
                          {stage.criticalPath && (
                            <Badge className="bg-orange-100 text-orange-800">
                              Critical Path
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(stage.status)}>
                            {stage.status.replace('_', ' ')}
                          </Badge>
                          <span className="text-sm text-gray-600">{stage.progress}%</span>
                        </div>
                      </div>
                      
                      <Progress value={stage.progress} className="mb-4" />
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Target Date:</span>
                          <p className="text-gray-600">{stage.targetDate.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="font-medium">Start Date:</span>
                          <p className="text-gray-600">
                            {stage.startDate ? stage.startDate.toLocaleDateString() : 'Not started'}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium">Disciplines:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {stage.disciplines.map((discipline, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {discipline}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Dependencies:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {stage.dependencies.map((dep, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {dep}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EngineerCoordinationDashboard;