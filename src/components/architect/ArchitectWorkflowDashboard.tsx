/**
 * Architect Workflow Dashboard
 * 
 * Month 2, Week 1 Implementation: Core Professional Roles
 * Specialized design coordination interface for architects
 * 
 * Features:
 * - Design stage management (Concept → Detailed → Construction)
 * - Planning application coordination
 * - Multi-disciplinary design coordination
 * - RIAI compliance tracking
 * - Client approval workflows
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Building2, FileText, Users, Calendar, CheckCircle, Clock,
  AlertTriangle, Ruler, PenTool, Eye, Upload, Download,
  MapPin, Layers, Settings, Bell, Target, Award, ArrowUpRight,
  Home
} from 'lucide-react';

interface DesignStage {
  id: string;
  name: string;
  status: 'not_started' | 'in_progress' | 'review' | 'approved' | 'revisions_required';
  progress: number;
  dueDate: Date;
  assignedTeam: string[];
  deliverables: string[];
  dependencies: string[];
}

interface PlanningApplication {
  id: string;
  applicationNumber: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'appeal';
  submissionDate?: Date;
  targetDecisionDate?: Date;
  localAuthority: string;
  planningOfficer?: string;
  conditions: string[];
}

interface ProjectCoordination {
  projectId: string;
  projectName: string;
  client: string;
  projectType: 'residential' | 'commercial' | 'mixed_use' | 'industrial' | 'institutional';
  projectStage: 'inception' | 'feasibility' | 'concept' | 'developed_design' | 'technical_design' | 'construction' | 'completion';
  designStages: DesignStage[];
  planningApplication?: PlanningApplication;
  team: {
    leadArchitect: string;
    projectArchitect: string;
    designTeam: string[];
    consultants: {
      structural: string;
      civil: string;
      mep: string;
      environmental?: string;
      landscape?: string;
      planning?: string;
    };
  };
  riaiCompliance: {
    projectRegistered: boolean;
    stageApprovals: { [stage: string]: boolean };
    codeOfConduct: boolean;
    professionalIndemnity: boolean;
  };
}

interface ArchitectWorkflowDashboardProps {
  userId?: string;
  projectId?: string;
}

export default function ArchitectWorkflowDashboard({ 
  userId, 
  projectId 
}: ArchitectWorkflowDashboardProps) {
  const [projects, setProjects] = useState<ProjectCoordination[]>([]);
  const [activeProject, setActiveProject] = useState<ProjectCoordination | null>(null);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Sample data for demonstration
  useEffect(() => {
    // Initialize with sample project data
    const sampleProject: ProjectCoordination = {
      projectId: 'fitzgerald-gardens-arch',
      projectName: 'Fitzgerald Gardens',
      client: 'Fitzgerald Development Ltd',
      projectType: 'residential',
      projectStage: 'developed_design',
      designStages: [
        {
          id: 'concept',
          name: 'Concept Design',
          status: 'approved',
          progress: 100,
          dueDate: new Date('2025-05-15'),
          assignedTeam: ['Lead Architect', 'Design Assistant'],
          deliverables: ['Site Analysis', 'Concept Drawings', 'Massing Study'],
          dependencies: []
        },
        {
          id: 'developed',
          name: 'Developed Design',
          status: 'in_progress',
          progress: 75,
          dueDate: new Date('2025-07-30'),
          assignedTeam: ['Lead Architect', 'Project Architect', 'CAD Technician'],
          deliverables: ['Floor Plans', 'Elevations', 'Sections', 'Material Schedule'],
          dependencies: ['concept']
        },
        {
          id: 'technical',
          name: 'Technical Design',
          status: 'not_started',
          progress: 0,
          dueDate: new Date('2025-09-15'),
          assignedTeam: ['Project Architect', 'Technical Architect'],
          deliverables: ['Construction Drawings', 'Details', 'Specifications'],
          dependencies: ['developed']
        }
      ],
      planningApplication: {
        id: 'pa-2025-001',
        applicationNumber: 'F25A/0123',
        status: 'under_review',
        submissionDate: new Date('2025-06-01'),
        targetDecisionDate: new Date('2025-08-30'),
        localAuthority: 'Fingal County Council',
        planningOfficer: 'Sarah O\'Brien',
        conditions: []
      },
      team: {
        leadArchitect: 'Michael McCarthy MRIAI',
        projectArchitect: 'Emma Sullivan',
        designTeam: ['David Chen', 'Rachel Murphy'],
        consultants: {
          structural: 'O\'Connor & Associates',
          civil: 'Irish Civil Engineering',
          mep: 'MEP Solutions Ireland',
          environmental: 'Green Design Consultants',
          landscape: 'Irish Landscape Architects'
        }
      },
      riaiCompliance: {
        projectRegistered: true,
        stageApprovals: {
          concept: true,
          developed: false,
          technical: false
        },
        codeOfConduct: true,
        professionalIndemnity: true
      }
    };

    setProjects([sampleProject]);
    setActiveProject(sampleProject);
  }, []);

  const getStageStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'revisions_required': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanningStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'submitted': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'appeal': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              Architect Workflow Dashboard
            </h1>
            <p className="text-muted-foreground">
              Design coordination and project management for architectural projects
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/developer/team/architects">
              <Button variant="outline">
                <Home className="h-4 w-4 mr-2" />
                Developer Dashboard
              </Button>
            </Link>
            <Badge className="bg-blue-100 text-blue-800">
              <Award className="h-3 w-3 mr-1" />
              RIAI Registered
            </Badge>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Drawings
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm text-muted-foreground">Active Projects</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-sm text-muted-foreground">Design Stages</p>
                </div>
                <Layers className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-sm text-muted-foreground">Planning Apps</p>
                </div>
                <FileText className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">Team Members</p>
                </div>
                <Users className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        {activeProject && (
          <Tabs defaultValue="design-stages" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="design-stages">Design Stages</TabsTrigger>
              <TabsTrigger value="planning">Planning</TabsTrigger>
              <TabsTrigger value="coordination">Team Coordination</TabsTrigger>
              <TabsTrigger value="compliance">RIAI Compliance</TabsTrigger>
              <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
            </TabsList>

            {/* Design Stages Tab */}
            <TabsContent value="design-stages" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Project: {activeProject.projectName}
                  </CardTitle>
                  <Badge className={getStageStatusColor(activeProject.projectStage)}>
                    {activeProject.projectStage.replace('_', ' ').toUpperCase()}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeProject.designStages.map((stage) => (
                    <div key={stage.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{stage.name}</h3>
                          <Badge className={getStageStatusColor(stage.status)}>
                            {stage.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          Due: {stage.dueDate.toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Progress</span>
                          <span className="text-sm font-medium">{stage.progress}%</span>
                        </div>
                        <Progress value={stage.progress} className="h-2" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <h4 className="font-medium mb-2">Assigned Team</h4>
                          <div className="space-y-1">
                            {stage.assignedTeam.map((member, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Users className="h-3 w-3" />
                                {member}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Deliverables</h4>
                          <div className="space-y-1">
                            {stage.deliverables.map((deliverable, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <FileText className="h-3 w-3" />
                                {deliverable}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Actions</h4>
                          <div className="space-y-2">
                            <Button size="sm" variant="outline" className="w-full">
                              <Eye className="h-3 w-3 mr-1" />
                              Review
                            </Button>
                            <Button size="sm" variant="outline" className="w-full">
                              <Upload className="h-3 w-3 mr-1" />
                              Upload
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Planning Tab */}
            <TabsContent value="planning" className="space-y-4">
              {activeProject.planningApplication && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Planning Application
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">Application Number</Label>
                          <p className="text-lg font-mono">{activeProject.planningApplication.applicationNumber}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Status</Label>
                          <Badge className={getPlanningStatusColor(activeProject.planningApplication.status)}>
                            {activeProject.planningApplication.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Local Authority</Label>
                          <p>{activeProject.planningApplication.localAuthority}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">Submission Date</Label>
                          <p>{activeProject.planningApplication.submissionDate?.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Target Decision</Label>
                          <p>{activeProject.planningApplication.targetDecisionDate?.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Planning Officer</Label>
                          <p>{activeProject.planningApplication.planningOfficer}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download Application
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View on Planning Portal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Team Coordination Tab */}
            <TabsContent value="coordination" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Project Team
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Design Team</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span>{activeProject.team.leadArchitect}</span>
                          <Badge variant="outline">Lead Architect</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span>{activeProject.team.projectArchitect}</span>
                          <Badge variant="outline">Project Architect</Badge>
                        </div>
                        {activeProject.team.designTeam.map((member, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <span>{member}</span>
                            <Badge variant="outline">Design Team</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Consultants</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span>{activeProject.team.consultants.structural}</span>
                          <Badge variant="outline">Structural</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span>{activeProject.team.consultants.civil}</span>
                          <Badge variant="outline">Civil</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span>{activeProject.team.consultants.mep}</span>
                          <Badge variant="outline">MEP</Badge>
                        </div>
                        {activeProject.team.consultants.environmental && (
                          <div className="flex items-center justify-between p-2 border rounded">
                            <span>{activeProject.team.consultants.environmental}</span>
                            <Badge variant="outline">Environmental</Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* RIAI Compliance Tab */}
            <TabsContent value="compliance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    RIAI Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span>Project Registered</span>
                        {activeProject.riaiCompliance.projectRegistered ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span>Code of Conduct</span>
                        {activeProject.riaiCompliance.codeOfConduct ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span>Professional Indemnity</span>
                        {activeProject.riaiCompliance.professionalIndemnity ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Stage Approvals</h3>
                      <div className="space-y-2">
                        {Object.entries(activeProject.riaiCompliance.stageApprovals).map(([stage, approved]) => (
                          <div key={stage} className="flex items-center justify-between p-2 border rounded">
                            <span className="capitalize">{stage.replace('_', ' ')}</span>
                            {approved ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Deliverables Tab */}
            <TabsContent value="deliverables" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Project Deliverables
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeProject.designStages.map((stage) => (
                      <div key={stage.id}>
                        <h3 className="font-semibold mb-2">{stage.name}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          {stage.deliverables.map((deliverable, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded">
                              <span className="text-sm">{deliverable}</span>
                              <div className="flex gap-1">
                                <Button size="sm" variant="ghost">
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Download className="h-3 w-3" />
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
          </Tabs>
        )}
      </div>
    </div>
  );
}