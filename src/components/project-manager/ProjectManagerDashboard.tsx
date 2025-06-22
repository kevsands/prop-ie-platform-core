/**
 * Project Manager Dashboard
 * 
 * Month 2, Week 1 Implementation: Core Professional Roles
 * Construction oversight and project management for Irish property development
 * 
 * Features:
 * - Construction phase management and oversight
 * - Multi-professional team coordination
 * - Irish construction compliance (BCAR, Building Regulations)
 * - Quality assurance and safety management
 * - Budget and timeline management
 * - Client and stakeholder communication
 * - Risk management and mitigation
 */

'use client';

import React, { useState, useEffect } from 'react';
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
  Calendar,
  BarChart3,
  MessageSquare,
  DollarSign,
  Hammer,
  Shield,
  Target,
  TrendingUp,
  Bell,
  Camera,
  MapPin,
  Phone,
  Mail,
  Building2,
  HardHat,
  Eye,
  Flag,
  Zap
} from 'lucide-react';

export interface ConstructionPhase {
  id: string;
  name: string;
  stage: 'planning' | 'foundation' | 'structure' | 'envelope' | 'fit_out' | 'completion';
  status: 'not_started' | 'in_progress' | 'on_hold' | 'completed' | 'delayed';
  progress: number;
  startDate: Date;
  targetDate: Date;
  actualDate?: Date;
  dependencies: string[];
  team: TeamAssignment[];
  tasks: ConstructionTask[];
  milestones: Milestone[];
  qualityChecks: QualityCheck[];
  safetyRequirements: SafetyRequirement[];
}

export interface TeamAssignment {
  id: string;
  role: string;
  professional: ProfessionalTeamMember;
  responsibilities: string[];
  allocation: number; // percentage
  startDate: Date;
  endDate: Date;
  status: 'assigned' | 'active' | 'completed' | 'unavailable';
}

export interface ProfessionalTeamMember {
  id: string;
  name: string;
  title: string;
  role: 'architect' | 'engineer' | 'contractor' | 'surveyor' | 'specialist';
  company: string;
  qualifications: string[];
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  availability: 'available' | 'busy' | 'unavailable';
  workload: number;
  performance: {
    rating: number;
    completedTasks: number;
    onTimeDelivery: number;
    qualityScore: number;
  };
}

export interface ConstructionTask {
  id: string;
  name: string;
  description: string;
  type: 'design' | 'construction' | 'inspection' | 'approval' | 'documentation';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'review' | 'completed' | 'blocked';
  assignedTo: string[];
  estimatedHours: number;
  actualHours?: number;
  startDate: Date;
  dueDate: Date;
  completionDate?: Date;
  dependencies: string[];
  deliverables: TaskDeliverable[];
  comments: TaskComment[];
}

export interface TaskDeliverable {
  id: string;
  name: string;
  type: 'document' | 'drawing' | 'report' | 'certificate' | 'photo';
  url?: string;
  status: 'pending' | 'submitted' | 'approved';
  submittedBy?: string;
  submissionDate?: Date;
  reviewedBy?: string;
  reviewDate?: Date;
}

export interface TaskComment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  type: 'update' | 'issue' | 'approval' | 'question';
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  type: 'design' | 'construction' | 'regulatory' | 'client' | 'financial';
  targetDate: Date;
  actualDate?: Date;
  status: 'pending' | 'achieved' | 'delayed' | 'at_risk';
  dependencies: string[];
  stakeholders: string[];
  requirements: string[];
  signoffRequired: boolean;
  signedOff?: {
    signedBy: string;
    signDate: Date;
    comments: string;
  };
}

export interface QualityCheck {
  id: string;
  name: string;
  category: 'design_review' | 'material_test' | 'workmanship' | 'compliance' | 'safety';
  phase: string;
  status: 'scheduled' | 'in_progress' | 'passed' | 'failed' | 'conditional_pass';
  inspector: string;
  inspectionDate?: Date;
  results?: {
    score: number;
    findings: QualityFinding[];
    recommendations: string[];
    photos: string[];
  };
  followUpRequired: boolean;
  followUpDate?: Date;
}

export interface QualityFinding {
  id: string;
  category: string;
  severity: 'minor' | 'major' | 'critical';
  description: string;
  location: string;
  photos: string[];
  actionRequired: string;
  responsibleParty: string;
  dueDate: Date;
  status: 'open' | 'in_progress' | 'resolved';
}

export interface SafetyRequirement {
  id: string;
  name: string;
  type: 'ppe' | 'training' | 'procedure' | 'equipment' | 'certification';
  description: string;
  applicable: string[]; // roles/phases where this applies
  mandatory: boolean;
  compliance: {
    status: 'compliant' | 'non_compliant' | 'pending';
    lastChecked: Date;
    nextCheck: Date;
    checkedBy: string;
  };
  documentation: string[];
}

export interface ProjectBudget {
  totalBudget: number;
  spentToDate: number;
  committed: number;
  remaining: number;
  contingency: number;
  phaseBreakdown: { [phase: string]: PhaseBudget };
  variations: BudgetVariation[];
  forecastCompletion: number;
}

export interface PhaseBudget {
  allocated: number;
  spent: number;
  remaining: number;
  variance: number;
  forecasted: number;
}

export interface BudgetVariation {
  id: string;
  description: string;
  amount: number;
  type: 'addition' | 'reduction' | 'reallocation';
  status: 'proposed' | 'approved' | 'rejected' | 'implemented';
  requestedBy: string;
  requestDate: Date;
  approvedBy?: string;
  approvalDate?: Date;
  justification: string;
  impact: string;
}

export interface RiskItem {
  id: string;
  title: string;
  description: string;
  category: 'technical' | 'financial' | 'schedule' | 'regulatory' | 'safety' | 'external';
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  riskScore: number;
  status: 'open' | 'mitigated' | 'closed' | 'monitoring';
  owner: string;
  identifiedBy: string;
  identifiedDate: Date;
  mitigation: {
    strategy: string;
    actions: string[];
    responsible: string;
    targetDate: Date;
    status: 'planned' | 'in_progress' | 'completed';
  };
  monitoring: {
    frequency: string;
    indicators: string[];
    lastReview: Date;
    nextReview: Date;
  };
}

export interface ProjectManagementData {
  projectId: string;
  projectName: string;
  projectType: 'residential' | 'commercial' | 'mixed_use' | 'industrial';
  client: string;
  location: string;
  overview: {
    totalValue: number;
    duration: number;
    startDate: Date;
    targetCompletion: Date;
    currentPhase: string;
    overallProgress: number;
    status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  };
  phases: ConstructionPhase[];
  team: TeamAssignment[];
  budget: ProjectBudget;
  risks: RiskItem[];
  compliance: {
    bcar: {
      required: boolean;
      status: 'pending' | 'submitted' | 'approved';
      inspections: BCARInspection[];
    };
    buildingRegulations: {
      approvals: RegulatoryApproval[];
      certificates: ComplianceCertificate[];
    };
    safety: {
      healthSafetyPlan: boolean;
      safetyOfficer: string;
      incidentReports: SafetyIncident[];
    };
  };
  communications: ProjectCommunication[];
  reports: ProjectReport[];
}

export interface BCARInspection {
  id: string;
  stage: string;
  inspector: string;
  scheduledDate: Date;
  actualDate?: Date;
  status: 'scheduled' | 'completed' | 'failed' | 'cancelled';
  findings: string[];
  signOff: boolean;
}

export interface RegulatoryApproval {
  id: string;
  type: string;
  authority: string;
  applicationDate: Date;
  approvalDate?: Date;
  status: 'applied' | 'under_review' | 'approved' | 'rejected';
  conditions: string[];
}

export interface ComplianceCertificate {
  id: string;
  type: string;
  issuedBy: string;
  issuedDate: Date;
  expiryDate?: Date;
  status: 'valid' | 'expired' | 'revoked';
  documentUrl: string;
}

export interface SafetyIncident {
  id: string;
  date: Date;
  type: 'accident' | 'near_miss' | 'unsafe_condition' | 'violation';
  severity: 'minor' | 'major' | 'serious' | 'fatal';
  description: string;
  location: string;
  personsInvolved: string[];
  reportedBy: string;
  investigated: boolean;
  actionsTaken: string[];
  status: 'open' | 'investigating' | 'closed';
}

export interface ProjectCommunication {
  id: string;
  type: 'meeting' | 'email' | 'report' | 'notice' | 'update';
  subject: string;
  sender: string;
  recipients: string[];
  date: Date;
  content: string;
  attachments: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionRequired: boolean;
  actionItems: string[];
}

export interface ProjectReport {
  id: string;
  type: 'progress' | 'financial' | 'quality' | 'safety' | 'risk';
  title: string;
  author: string;
  date: Date;
  period: string;
  summary: string;
  keyMetrics: { [key: string]: any };
  issues: string[];
  recommendations: string[];
  documentUrl: string;
}

const ProjectManagerDashboard: React.FC = () => {
  const [projectData, setProjectData] = useState<ProjectManagementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');

  useEffect(() => {
    loadProjectData();
  }, []);

  const loadProjectData = async () => {
    try {
      const response = await fetch('/api/project-manager/coordination?action=get_project&projectId=fitzgerald-gardens-pm');
      const data = await response.json() as { success: boolean; project?: ProjectManagementData };
      
      if (data.success && data.project) {
        setProjectData(data.project);
      }
    } catch (error) {
      console.error('Failed to load project management data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed':
      case 'passed':
      case 'approved':
      case 'compliant':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
      case 'active':
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'delayed':
      case 'failed':
      case 'rejected':
      case 'non_compliant':
        return 'bg-red-100 text-red-800';
      case 'on_hold':
      case 'blocked':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'critical':
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPhaseIcon = (stage: string) => {
    switch (stage) {
      case 'planning':
        return <FileText className="h-4 w-4" />;
      case 'foundation':
        return <Building2 className="h-4 w-4" />;
      case 'structure':
        return <Hammer className="h-4 w-4" />;
      case 'envelope':
        return <Shield className="h-4 w-4" />;
      case 'fit_out':
        return <HardHat className="h-4 w-4" />;
      case 'completion':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project management dashboard...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
              <p className="text-gray-600 mt-1">{projectData.projectName} - Construction Oversight</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Button>
                <Bell className="h-4 w-4 mr-2" />
                Send Update
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
                  <p className="text-sm font-medium text-gray-600">Overall Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{projectData.overview.overallProgress}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-4">
                <Progress value={projectData.overview.overallProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Budget Utilization</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round((projectData.budget.spentToDate / projectData.budget.totalBudget) * 100)}%
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-500">
                  €{(projectData.budget.spentToDate / 1000000).toFixed(1)}M / €{(projectData.budget.totalBudget / 1000000).toFixed(1)}M
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Team</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {projectData.team.filter(t => t.status === 'active').length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-500">
                  {projectData.team.length} total assignments
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Open Risks</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {projectData.risks.filter(r => r.status === 'open').length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-500">
                  {projectData.risks.filter(r => r.probability === 'high').length} high probability
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="phases">Phases</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="risks">Risks</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Construction Phases Status */}
            <Card>
              <CardHeader>
                <CardTitle>Construction Phases Progress</CardTitle>
                <CardDescription>Current status of all construction phases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projectData.phases.map((phase) => (
                    <div key={phase.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getPhaseIcon(phase.stage)}
                          <h4 className="font-medium">{phase.name}</h4>
                        </div>
                        <Badge className={getStatusColor(phase.status)}>
                          {phase.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{phase.progress}%</span>
                          </div>
                          <Progress value={phase.progress} className="h-2" />
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          <p><strong>Team:</strong> {phase.team.length} professionals</p>
                          <p><strong>Tasks:</strong> {phase.tasks.filter(t => t.status === 'completed').length}/{phase.tasks.length} complete</p>
                          <p><strong>Target:</strong> {phase.targetDate.toLocaleDateString()}</p>
                        </div>
                        
                        {phase.status === 'delayed' && phase.actualDate && (
                          <div className="text-xs bg-red-50 text-red-700 p-2 rounded">
                            Delayed by {Math.ceil((phase.actualDate.getTime() - phase.targetDate.getTime()) / (1000 * 60 * 60 * 24))} days
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity & Updates */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Foundation inspection passed</p>
                        <p className="text-sm text-gray-600">BCAR inspection completed successfully with no issues</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium">New team member assigned</p>
                        <p className="text-sm text-gray-600">MEP Specialist joined for fit-out phase</p>
                        <p className="text-xs text-gray-500">4 hours ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                      <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Schedule update required</p>
                        <p className="text-sm text-gray-600">Structural phase ahead of schedule, fit-out can start early</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Critical Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-red-500 pl-3">
                      <p className="font-medium text-red-800">High Risk: Weather Delays</p>
                      <p className="text-sm text-gray-600">Heavy rain forecast may impact external works</p>
                      <div className="flex gap-2 mt-2">
                        <Badge className="bg-red-100 text-red-800">High Impact</Badge>
                        <Badge variant="outline">Owner: Site Manager</Badge>
                      </div>
                    </div>
                    
                    <div className="border-l-4 border-orange-500 pl-3">
                      <p className="font-medium text-orange-800">Budget Variance</p>
                      <p className="text-sm text-gray-600">Structural costs 5% over budget due to material price increases</p>
                      <div className="flex gap-2 mt-2">
                        <Badge className="bg-orange-100 text-orange-800">Medium Impact</Badge>
                        <Badge variant="outline">Review Required</Badge>
                      </div>
                    </div>
                    
                    <div className="border-l-4 border-yellow-500 pl-3">
                      <p className="font-medium text-yellow-800">Compliance Check Due</p>
                      <p className="text-sm text-gray-600">BCAR inspection for structural phase due next week</p>
                      <div className="flex gap-2 mt-2">
                        <Badge className="bg-yellow-100 text-yellow-800">Action Required</Badge>
                        <Badge variant="outline">Due: 28 Jun</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Phases Tab */}
          <TabsContent value="phases" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Construction Phases</h3>
              <Select value={selectedPhase} onValueChange={setSelectedPhase}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by phase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Phases</SelectItem>
                  {projectData.phases.map((phase) => (
                    <SelectItem key={phase.id} value={phase.id}>
                      {phase.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-6">
              {projectData.phases
                .filter(p => selectedPhase === 'all' || p.id === selectedPhase)
                .map((phase) => (
                <Card key={phase.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getPhaseIcon(phase.stage)}
                        <CardTitle>{phase.name}</CardTitle>
                      </div>
                      <Badge className={getStatusColor(phase.status)}>
                        {phase.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Progress Overview */}
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Overall Progress</span>
                          <span className="text-sm">{phase.progress}%</span>
                        </div>
                        <Progress value={phase.progress} />
                      </div>

                      {/* Timeline */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Start Date:</span>
                          <p className="text-gray-600">{phase.startDate.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="font-medium">Target Date:</span>
                          <p className="text-gray-600">{phase.targetDate.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="font-medium">Actual Date:</span>
                          <p className="text-gray-600">
                            {phase.actualDate ? phase.actualDate.toLocaleDateString() : 'In progress'}
                          </p>
                        </div>
                      </div>

                      {/* Team Assignments */}
                      <div>
                        <h4 className="font-medium mb-2">Team Assignments ({phase.team.length})</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {phase.team.slice(0, 4).map((assignment) => (
                            <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                              <div>
                                <p className="font-medium">{assignment.professional.name}</p>
                                <p className="text-sm text-gray-600">{assignment.role}</p>
                              </div>
                              <div className="text-right text-sm">
                                <p>{assignment.allocation}% allocated</p>
                                <Badge className={getStatusColor(assignment.status)}>
                                  {assignment.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                          {phase.team.length > 4 && (
                            <p className="text-sm text-gray-500 col-span-2">
                              +{phase.team.length - 4} more team members
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Tasks Summary */}
                      <div>
                        <h4 className="font-medium mb-2">Tasks Overview</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="text-center p-3 bg-gray-50 rounded">
                            <p className="text-2xl font-bold text-gray-900">
                              {phase.tasks.filter(t => t.status === 'completed').length}
                            </p>
                            <p className="text-sm text-gray-600">Completed</p>
                          </div>
                          <div className="text-center p-3 bg-blue-50 rounded">
                            <p className="text-2xl font-bold text-blue-900">
                              {phase.tasks.filter(t => t.status === 'in_progress').length}
                            </p>
                            <p className="text-sm text-blue-600">In Progress</p>
                          </div>
                          <div className="text-center p-3 bg-yellow-50 rounded">
                            <p className="text-2xl font-bold text-yellow-900">
                              {phase.tasks.filter(t => t.status === 'pending').length}
                            </p>
                            <p className="text-sm text-yellow-600">Pending</p>
                          </div>
                          <div className="text-center p-3 bg-red-50 rounded">
                            <p className="text-2xl font-bold text-red-900">
                              {phase.tasks.filter(t => t.status === 'blocked').length}
                            </p>
                            <p className="text-sm text-red-600">Blocked</p>
                          </div>
                        </div>
                      </div>

                      {/* Milestones */}
                      <div>
                        <h4 className="font-medium mb-2">Key Milestones</h4>
                        <div className="space-y-2">
                          {phase.milestones.slice(0, 3).map((milestone) => (
                            <div key={milestone.id} className="flex items-center justify-between p-2 border rounded">
                              <div>
                                <p className="font-medium">{milestone.name}</p>
                                <p className="text-sm text-gray-600">Due: {milestone.targetDate.toLocaleDateString()}</p>
                              </div>
                              <Badge className={getStatusColor(milestone.status)}>
                                {milestone.status}
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
                          Update Progress
                        </Button>
                        <Button size="sm" variant="outline">
                          Add Task
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Team</CardTitle>
                <CardDescription>All professionals assigned to the project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {projectData.team.map((assignment) => (
                    <div key={assignment.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-medium">{assignment.professional.name}</h4>
                          <p className="text-sm text-gray-600">{assignment.professional.title}</p>
                          <p className="text-sm text-gray-500">{assignment.professional.company}</p>
                        </div>
                        <Badge className={getStatusColor(assignment.status)}>
                          {assignment.status}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <span className="font-medium text-sm">Role:</span>
                          <p className="text-sm text-gray-600">{assignment.role}</p>
                        </div>

                        <div>
                          <span className="font-medium text-sm">Allocation:</span>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={assignment.allocation} className="flex-1" />
                            <span className="text-sm">{assignment.allocation}%</span>
                          </div>
                        </div>

                        <div>
                          <span className="font-medium text-sm">Qualifications:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {assignment.professional.qualifications.map((qual, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {qual}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="font-medium text-sm">Performance:</span>
                          <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
                            <div>Rating: {assignment.professional.performance.rating}/5</div>
                            <div>On-time: {assignment.professional.performance.onTimeDelivery}%</div>
                          </div>
                        </div>

                        <div>
                          <span className="font-medium text-sm">Contact:</span>
                          <div className="flex gap-3 mt-1">
                            <Button size="sm" variant="outline">
                              <Mail className="h-3 w-3 mr-1" />
                              Email
                            </Button>
                            <Button size="sm" variant="outline">
                              <Phone className="h-3 w-3 mr-1" />
                              Call
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Budget Tab */}
          <TabsContent value="budget" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Budget Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Spent</span>
                        <span className="text-sm">€{(projectData.budget.spentToDate / 1000000).toFixed(1)}M</span>
                      </div>
                      <Progress value={(projectData.budget.spentToDate / projectData.budget.totalBudget) * 100} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Total Budget</p>
                        <p className="font-bold">€{(projectData.budget.totalBudget / 1000000).toFixed(1)}M</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Remaining</p>
                        <p className="font-bold">€{(projectData.budget.remaining / 1000000).toFixed(1)}M</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Committed</p>
                        <p className="font-bold">€{(projectData.budget.committed / 1000000).toFixed(1)}M</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Contingency</p>
                        <p className="font-bold">€{(projectData.budget.contingency / 1000000).toFixed(1)}M</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Phase Budget Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(projectData.budget.phaseBreakdown).map(([phase, budget]) => (
                      <div key={phase} className="border rounded p-3">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium capitalize">{phase.replace('_', ' ')}</h4>
                          <Badge className={budget.variance < 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                            {budget.variance > 0 ? '+' : ''}€{(budget.variance / 1000).toFixed(0)}k
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Allocated</p>
                            <p className="font-medium">€{(budget.allocated / 1000).toFixed(0)}k</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Spent</p>
                            <p className="font-medium">€{(budget.spent / 1000).toFixed(0)}k</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Forecasted</p>
                            <p className="font-medium">€{(budget.forecasted / 1000).toFixed(0)}k</p>
                          </div>
                        </div>

                        <div className="mt-2">
                          <Progress value={(budget.spent / budget.allocated) * 100} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Budget Variations */}
            <Card>
              <CardHeader>
                <CardTitle>Budget Variations</CardTitle>
                <CardDescription>Approved and pending budget changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {projectData.budget.variations.map((variation) => (
                    <div key={variation.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex-1">
                        <p className="font-medium">{variation.description}</p>
                        <p className="text-sm text-gray-600">{variation.justification}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span>Requested by: {variation.requestedBy}</span>
                          <span>Date: {variation.requestDate.toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${variation.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {variation.amount >= 0 ? '+' : ''}€{(variation.amount / 1000).toFixed(0)}k
                        </p>
                        <Badge className={getStatusColor(variation.status)}>
                          {variation.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Risks Tab */}
          <TabsContent value="risks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Management</CardTitle>
                <CardDescription>Project risks and mitigation strategies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectData.risks.map((risk) => (
                    <div key={risk.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{risk.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{risk.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getPriorityColor(risk.probability)}>
                            {risk.probability} probability
                          </Badge>
                          <Badge className={getPriorityColor(risk.impact)}>
                            {risk.impact} impact
                          </Badge>
                          <Badge className={getStatusColor(risk.status)}>
                            {risk.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Category:</span>
                          <p className="text-gray-600 capitalize">{risk.category}</p>
                        </div>
                        <div>
                          <span className="font-medium">Risk Score:</span>
                          <p className="text-gray-600">{risk.riskScore}/9</p>
                        </div>
                        <div>
                          <span className="font-medium">Owner:</span>
                          <p className="text-gray-600">{risk.owner}</p>
                        </div>
                      </div>

                      <div className="mt-3 p-3 bg-gray-50 rounded">
                        <h5 className="font-medium mb-2">Mitigation Strategy</h5>
                        <p className="text-sm text-gray-600 mb-2">{risk.mitigation.strategy}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Status: {risk.mitigation.status}</span>
                          <span className="text-sm">Target: {risk.mitigation.targetDate.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* BCAR Compliance */}
              <Card>
                <CardHeader>
                  <CardTitle>BCAR Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>BCAR Required</span>
                      <Badge className={
                        projectData.compliance.bcar.required 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-gray-100 text-gray-800'
                      }>
                        {projectData.compliance.bcar.required ? 'Required' : 'Not Required'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Status</span>
                      <Badge className={getStatusColor(projectData.compliance.bcar.status)}>
                        {projectData.compliance.bcar.status}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Inspections</h4>
                      <div className="space-y-2">
                        {projectData.compliance.bcar.inspections.map((inspection) => (
                          <div key={inspection.id} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                            <span>{inspection.stage}</span>
                            <Badge className={getStatusColor(inspection.status)}>
                              {inspection.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Building Regulations */}
              <Card>
                <CardHeader>
                  <CardTitle>Building Regulations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Approvals</h4>
                      <div className="space-y-2">
                        {projectData.compliance.buildingRegulations.approvals.map((approval) => (
                          <div key={approval.id} className="p-2 bg-gray-50 rounded">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">{approval.type}</span>
                              <Badge className={getStatusColor(approval.status)}>
                                {approval.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600">{approval.authority}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Certificates</h4>
                      <div className="space-y-2">
                        {projectData.compliance.buildingRegulations.certificates.map((cert) => (
                          <div key={cert.id} className="p-2 bg-gray-50 rounded">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">{cert.type}</span>
                              <Badge className={getStatusColor(cert.status)}>
                                {cert.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600">Issued by: {cert.issuedBy}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Safety Compliance */}
              <Card>
                <CardHeader>
                  <CardTitle>Safety Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Health & Safety Plan</span>
                      <Badge className={
                        projectData.compliance.safety.healthSafetyPlan 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }>
                        {projectData.compliance.safety.healthSafetyPlan ? 'In Place' : 'Missing'}
                      </Badge>
                    </div>

                    <div>
                      <span className="font-medium">Safety Officer:</span>
                      <p className="text-sm text-gray-600">{projectData.compliance.safety.safetyOfficer}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Recent Incidents</h4>
                      <div className="text-center p-4 bg-green-50 rounded">
                        <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-sm text-green-700">No incidents reported</p>
                        <p className="text-xs text-gray-500">Last 30 days</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Reports</CardTitle>
                <CardDescription>Generated reports and documentation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projectData.reports.map((report) => (
                    <div key={report.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{report.title}</h4>
                          <p className="text-sm text-gray-600">{report.period}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {report.type}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Author:</span>
                          <p className="text-gray-600">{report.author}</p>
                        </div>
                        <div>
                          <span className="font-medium">Date:</span>
                          <p className="text-gray-600">{report.date.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="font-medium">Summary:</span>
                          <p className="text-gray-600">{report.summary}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate New Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProjectManagerDashboard;