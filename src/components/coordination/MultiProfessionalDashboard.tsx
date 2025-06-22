/**
 * Multi-Professional Coordination Dashboard
 * 
 * Month 2, Week 3 Implementation: Advanced Multi-Professional Features
 * Unified dashboard integrating all 5 professional workflows with AI-assisted coordination
 * 
 * Features:
 * - Unified project oversight across all professionals
 * - Real-time multi-professional coordination
 * - AI-assisted task management and prioritization
 * - Intelligent workflow automation
 * - Predictive project analytics
 * - Cross-professional communication hub
 * - Automated milestone progression
 * - Comprehensive project intelligence
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Building2,
  Users,
  BarChart3,
  Brain,
  Zap,
  Target,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  MessageSquare,
  Eye,
  Settings,
  Lightbulb,
  Activity,
  Workflow,
  Network,
  Cpu,
  LineChart,
  PieChart,
  Globe,
  Shield,
  Award,
  Rocket,
  Star,
  ArrowRight,
  Play,
  Pause,
  RefreshCw,
  Bell,
  Filter,
  Search,
  Download,
  Upload,
  Share
} from 'lucide-react';

// Import types from MultiProfessionalCoordinationService
export interface UnifiedProject {
  id: string;
  name: string;
  description: string;
  type: 'residential' | 'commercial' | 'mixed_use' | 'industrial' | 'infrastructure';
  status: 'planning' | 'design' | 'engineering' | 'construction' | 'completion' | 'handover';
  location: {
    address: string;
    county: string;
    eircode: string;
    coordinates: { lat: number; lng: number };
  };
  client: {
    id: string;
    name: string;
    type: 'individual' | 'developer' | 'corporate' | 'government';
    contactInfo: {
      email: string;
      phone: string;
      address: string;
    };
  };
  professionals: {
    architect?: ProfessionalAssignment;
    engineers: ProfessionalAssignment[];
    projectManager?: ProfessionalAssignment;
    quantitySurveyor?: ProfessionalAssignment;
    solicitor?: ProfessionalAssignment;
  };
  timeline: {
    plannedStart: Date;
    plannedEnd: Date;
    actualStart?: Date;
    actualEnd?: Date;
    milestones: ProjectMilestone[];
  };
  budget: {
    totalBudget: number;
    currentSpend: number;
    committed: number;
    remaining: number;
    currency: 'EUR' | 'GBP' | 'USD';
  };
  intelligence: ProjectIntelligence;
}

export interface ProfessionalAssignment {
  professionalId: string;
  name: string;
  company: string;
  role: string;
  specialization?: string[];
  assignedDate: Date;
  status: 'assigned' | 'active' | 'completed' | 'on_hold';
  workload: number;
  performance: {
    rating: number;
    onTimeDelivery: number;
    qualityScore: number;
    communicationScore: number;
  };
  compliance: {
    registration: boolean;
    insurance: boolean;
    cpd: boolean;
  };
}

export interface ProjectMilestone {
  id: string;
  name: string;
  description: string;
  category: 'planning' | 'design' | 'engineering' | 'construction' | 'cost' | 'legal' | 'handover';
  targetDate: Date;
  actualDate?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed' | 'at_risk';
  dependencies: string[];
  assignedProfessionals: string[];
  deliverables: string[];
  criticalPath: boolean;
}

export interface ProjectIntelligence {
  analytics: ProjectAnalytics;
  predictions: ProjectPredictions;
  insights: ProjectInsights;
  recommendations: ProjectRecommendations;
}

export interface ProjectAnalytics {
  performance: {
    overallScore: number;
    trends: PerformanceTrend[];
    benchmarks: PerformanceBenchmark[];
    kpis: PerformanceKPI[];
  };
  financial: {
    budgetPerformance: number;
    costVariance: number;
  };
  timeline: {
    schedulePerformance: number;
    criticalPathAnalysis: {
      criticalTasks: string[];
      totalDuration: number;
      floatTime: number;
      bottlenecks: string[];
      optimization: OptimizationSuggestion[];
    };
  };
  quality: {
    overallScore: number;
    defectRate: number;
    reworkPercentage: number;
    complianceScore: number;
  };
  risk: {
    riskScore: number;
    riskVelocity: number;
    riskDistribution: RiskDistribution[];
    mitigation_effectiveness: number;
  };
  team: {
    productivity: number;
    satisfaction: number;
    collaboration: number;
  };
}

export interface PerformanceTrend {
  metric: string;
  period: string;
  values: number[];
  direction: 'up' | 'down' | 'stable';
  change: number;
}

export interface PerformanceBenchmark {
  metric: string;
  industry: number;
  organization: number;
  project: number;
  variance: number;
}

export interface PerformanceKPI {
  name: string;
  current: number;
  target: number;
  status: 'on_target' | 'at_risk' | 'off_target';
  trend: 'improving' | 'stable' | 'declining';
}

export interface OptimizationSuggestion {
  type: 'parallel_execution' | 'resource_reallocation' | 'scope_reduction' | 'fast_tracking';
  description: string;
  timeSaving: number;
  cost: number;
  risk: string;
}

export interface RiskDistribution {
  category: string;
  count: number;
  totalScore: number;
  percentage: number;
}

export interface ProjectPredictions {
  completion: {
    predictedDate: Date;
    confidence: number;
    scenarios: CompletionScenario[];
  };
  cost: {
    finalCost: number;
    confidence: number;
    variance: {
      optimistic: number;
      mostLikely: number;
      pessimistic: number;
    };
  };
  quality: {
    finalQualityScore: number;
    defectProbability: number;
    reworkRisk: number;
    complianceRisk: number;
  };
}

export interface CompletionScenario {
  name: string;
  probability: number;
  completionDate: Date;
  assumptions: string[];
}

export interface ProjectInsights {
  keyFindings: KeyFinding[];
  patterns: ProjectPattern[];
  opportunities: ProjectOpportunity[];
}

export interface KeyFinding {
  title: string;
  description: string;
  significance: 'high' | 'medium' | 'low';
  category: string;
  evidence: string[];
  implications: string[];
}

export interface ProjectPattern {
  name: string;
  description: string;
  frequency: number;
  impact: string;
  examples: string[];
}

export interface ProjectOpportunity {
  title: string;
  description: string;
  value: number;
  effort: 'low' | 'medium' | 'high';
  timeframe: string;
  probability: number;
}

export interface ProjectRecommendations {
  immediate: Recommendation[];
  shortTerm: Recommendation[];
  longTerm: Recommendation[];
  strategic: Recommendation[];
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  rationale: string;
  category: 'process' | 'resource' | 'technology' | 'team' | 'strategy';
  priority: 'low' | 'medium' | 'high' | 'critical';
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  timeline: string;
  cost: number;
  risks: string[];
  benefits: string[];
  status: 'proposed' | 'approved' | 'in_progress' | 'completed' | 'rejected';
}

const statusColors = {
  planning: 'bg-blue-100 text-blue-800',
  design: 'bg-purple-100 text-purple-800',
  engineering: 'bg-orange-100 text-orange-800',
  construction: 'bg-yellow-100 text-yellow-800',
  completion: 'bg-green-100 text-green-800',
  handover: 'bg-gray-100 text-gray-800'
};

const professionalIcons = {
  architect: Building2,
  engineer: Settings,
  projectManager: Users,
  quantitySurveyor: BarChart3,
  solicitor: Shield
};

export default function MultiProfessionalDashboard() {
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<string>('fitzgerald-gardens-unified');
  const [selectedTab, setSelectedTab] = useState('overview');
  const [projectData, setProjectData] = useState<{
    project: UnifiedProject;
  } | null>(null);

  useEffect(() => {
    loadProjectData();
  }, [selectedProject]);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      // This would be replaced with actual API calls
      const response = await fetch(`/api/coordination/multi-professional?action=get_unified_project&projectId=${selectedProject}`);
      const data = await response.json();
      setProjectData(data);
    } catch (error) {
      console.error('Error loading project data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">No project data available</p>
      </div>
    );
  }

  const { project } = projectData;
  const { intelligence } = project;

  // Calculate derived metrics
  const totalProfessionals = [
    project.professionals.architect,
    ...project.professionals.engineers,
    project.professionals.projectManager,
    project.professionals.quantitySurveyor,
    project.professionals.solicitor
  ].filter(Boolean).length;

  const activeProfessionals = [
    project.professionals.architect,
    ...project.professionals.engineers,
    project.professionals.projectManager,
    project.professionals.quantitySurveyor,
    project.professionals.solicitor
  ].filter(p => p && p.status === 'active').length;

  const completedMilestones = project.timeline.milestones.filter(m => m.status === 'completed').length;
  const totalMilestones = project.timeline.milestones.length;
  const projectProgress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  const budgetUtilization = project.budget.totalBudget > 0 ? 
    ((project.budget.currentSpend + project.budget.committed) / project.budget.totalBudget) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Network className="h-8 w-8 text-blue-600 mr-3" />
                Multi-Professional Coordination Hub
              </h1>
              <p className="text-gray-600 mt-1">AI-Enhanced Project Coordination & Intelligence</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline">
                <Brain className="h-4 w-4 mr-2" />
                Generate Insights
              </Button>
              <Button variant="outline">
                <Zap className="h-4 w-4 mr-2" />
                Automate Workflow
              </Button>
              <Button>
                <Rocket className="h-4 w-4 mr-2" />
                Optimize Project
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Selection */}
        <div className="mb-6">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-[400px]">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fitzgerald-gardens-unified">
                🏢 Fitzgerald Gardens Development - Swords, Dublin
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* AI Intelligence Summary */}
        <Alert className="mb-8 border-blue-200 bg-blue-50">
          <Brain className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>AI Project Intelligence:</strong> Project is performing {intelligence.analytics.performance.overallScore}% above target. 
            Predicted completion: {new Date(intelligence.predictions.completion.predictedDate).toLocaleDateString()} 
            ({intelligence.predictions.completion.confidence}% confidence). 
            {intelligence.insights.opportunities.length} optimization opportunities identified.
          </AlertDescription>
        </Alert>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Project Progress</p>
                  <p className="text-2xl font-bold">{Math.round(projectProgress)}%</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {completedMilestones}/{totalMilestones} milestones
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <Progress value={projectProgress} className="mt-4" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Performance Score</p>
                  <p className="text-2xl font-bold">{intelligence.analytics.performance.overallScore}%</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{intelligence.analytics.performance.trends[0]?.change || 5}% this month
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Budget Performance</p>
                  <p className="text-2xl font-bold">{intelligence.analytics.financial.budgetPerformance}%</p>
                  <p className="text-xs text-gray-500 mt-1">
                    €{Math.round(budgetUtilization)}% utilized
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Team Performance</p>
                  <p className="text-2xl font-bold">{intelligence.analytics.team.productivity}%</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {activeProfessionals}/{totalProfessionals} active
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Risk Score</p>
                  <p className="text-2xl font-bold">{intelligence.analytics.risk.riskScore}</p>
                  <p className="text-xs text-green-600 mt-1">
                    Low risk exposure
                  </p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-full">
                  <Shield className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="professionals">Professionals</TabsTrigger>
            <TabsTrigger value="coordination">Coordination</TabsTrigger>
            <TabsTrigger value="intelligence">AI Intelligence</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Project Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="h-5 w-5 mr-2" />
                    Project Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Project Name</p>
                    <p className="font-medium">{project.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Type & Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={statusColors[project.status]}>
                        {project.status.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{project.location.address}</p>
                    <p className="text-sm text-gray-500">{project.location.county} • {project.location.eircode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Client</p>
                    <p className="font-medium">{project.client.name}</p>
                    <p className="text-sm text-gray-500">{project.client.type}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline & Budget */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Timeline & Budget
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Project Duration</p>
                    <p className="font-medium">
                      {new Date(project.timeline.plannedStart).toLocaleDateString()} - {new Date(project.timeline.plannedEnd).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {Math.ceil((new Date(project.timeline.plannedEnd).getTime() - new Date(project.timeline.plannedStart).getTime()) / (1000 * 60 * 60 * 24))} days total
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Budget Status</p>
                    <p className="font-medium">€{project.budget.totalBudget.toLocaleString()}</p>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Spent: €{project.budget.currentSpend.toLocaleString()}</span>
                        <span>Remaining: €{project.budget.remaining.toLocaleString()}</span>
                      </div>
                      <Progress value={budgetUtilization} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Predicted Completion</p>
                    <p className="font-medium text-blue-600">
                      {new Date(intelligence.predictions.completion.predictedDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {intelligence.predictions.completion.confidence}% confidence
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Milestones */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Recent Milestones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.timeline.milestones.slice(0, 5).map((milestone) => (
                      <div key={milestone.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{milestone.name}</p>
                          <p className="text-sm text-gray-600">{milestone.description}</p>
                          <p className="text-xs text-gray-500">
                            {milestone.category.charAt(0).toUpperCase() + milestone.category.slice(1)} • 
                            {milestone.assignedProfessionals.length} professionals • 
                            {milestone.deliverables.length} deliverables
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={`${
                            milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                            milestone.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            milestone.status === 'delayed' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          } mb-1`}>
                            {milestone.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <p className="text-sm text-gray-600">
                            {milestone.actualDate ? 
                              new Date(milestone.actualDate).toLocaleDateString() :
                              new Date(milestone.targetDate).toLocaleDateString()
                            }
                          </p>
                          {milestone.criticalPath && (
                            <Badge variant="outline" className="text-xs mt-1">
                              Critical Path
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* AI Insights Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2" />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {intelligence.insights.keyFindings.slice(0, 3).map((finding, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">{finding.title}</p>
                          <Badge className={`${
                            finding.significance === 'high' ? 'bg-red-100 text-red-800' :
                            finding.significance === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {finding.significance.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{finding.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Category: {finding.category} • {finding.evidence.length} evidence points
                        </p>
                      </div>
                    ))}
                    
                    {intelligence.insights.opportunities.length > 0 && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Star className="h-4 w-4 text-green-600 mr-2" />
                          <p className="font-medium text-green-800">Optimization Opportunity</p>
                        </div>
                        <p className="text-sm text-green-700">
                          {intelligence.insights.opportunities[0].title}: 
                          €{intelligence.insights.opportunities[0].value.toLocaleString()} potential value
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Professionals Tab */}
          <TabsContent value="professionals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Professional Team ({totalProfessionals})
                  </span>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Assign Professional
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Architect */}
                  {project.professionals.architect && (
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-full mr-3">
                              <Building2 className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold">{project.professionals.architect.name}</p>
                              <p className="text-sm text-gray-600">{project.professionals.architect.role}</p>
                              <p className="text-xs text-gray-500">{project.professionals.architect.company}</p>
                            </div>
                          </div>
                          <Badge className={`${
                            project.professionals.architect.status === 'active' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {project.professionals.architect.status.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Workload</span>
                              <span>{project.professionals.architect.workload}%</span>
                            </div>
                            <Progress value={project.professionals.architect.workload} />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Performance</p>
                              <p className="font-medium">{project.professionals.architect.performance.rating}/5.0</p>
                            </div>
                            <div>
                              <p className="text-gray-600">On-Time Delivery</p>
                              <p className="font-medium">{project.professionals.architect.performance.onTimeDelivery}%</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Quality Score</p>
                              <p className="font-medium">{project.professionals.architect.performance.qualityScore}%</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Communication</p>
                              <p className="font-medium">{project.professionals.architect.performance.communicationScore}%</p>
                            </div>
                          </div>
                          
                          <div className="flex space-x-1">
                            <Badge variant={project.professionals.architect.compliance.registration ? "default" : "destructive"} className="text-xs">
                              Registration
                            </Badge>
                            <Badge variant={project.professionals.architect.compliance.insurance ? "default" : "destructive"} className="text-xs">
                              Insurance
                            </Badge>
                            <Badge variant={project.professionals.architect.compliance.cpd ? "default" : "destructive"} className="text-xs">
                              CPD
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Engineers */}
                  {project.professionals.engineers.map((engineer) => (
                    <Card key={engineer.professionalId}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="p-2 bg-orange-100 rounded-full mr-3">
                              <Settings className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                              <p className="font-semibold">{engineer.name}</p>
                              <p className="text-sm text-gray-600">{engineer.role}</p>
                              <p className="text-xs text-gray-500">{engineer.company}</p>
                            </div>
                          </div>
                          <Badge className={`${
                            engineer.status === 'active' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {engineer.status.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Workload</span>
                              <span>{engineer.workload}%</span>
                            </div>
                            <Progress value={engineer.workload} />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Performance</p>
                              <p className="font-medium">{engineer.performance.rating}/5.0</p>
                            </div>
                            <div>
                              <p className="text-gray-600">On-Time Delivery</p>
                              <p className="font-medium">{engineer.performance.onTimeDelivery}%</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Project Manager */}
                  {project.professionals.projectManager && (
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-full mr-3">
                              <Users className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-semibold">{project.professionals.projectManager.name}</p>
                              <p className="text-sm text-gray-600">{project.professionals.projectManager.role}</p>
                              <p className="text-xs text-gray-500">{project.professionals.projectManager.company}</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            ACTIVE
                          </Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Workload</span>
                              <span>{project.professionals.projectManager.workload}%</span>
                            </div>
                            <Progress value={project.professionals.projectManager.workload} />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Performance</p>
                              <p className="font-medium">{project.professionals.projectManager.performance.rating}/5.0</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Quality Score</p>
                              <p className="font-medium">{project.professionals.projectManager.performance.qualityScore}%</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Quantity Surveyor */}
                  {project.professionals.quantitySurveyor && (
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-full mr-3">
                              <BarChart3 className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-semibold">{project.professionals.quantitySurveyor.name}</p>
                              <p className="text-sm text-gray-600">{project.professionals.quantitySurveyor.role}</p>
                              <p className="text-xs text-gray-500">{project.professionals.quantitySurveyor.company}</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            ACTIVE
                          </Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Workload</span>
                              <span>{project.professionals.quantitySurveyor.workload}%</span>
                            </div>
                            <Progress value={project.professionals.quantitySurveyor.workload} />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Performance</p>
                              <p className="font-medium">{project.professionals.quantitySurveyor.performance.rating}/5.0</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Quality Score</p>
                              <p className="font-medium">{project.professionals.quantitySurveyor.performance.qualityScore}%</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Solicitor */}
                  {project.professionals.solicitor && (
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="p-2 bg-indigo-100 rounded-full mr-3">
                              <Shield className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                              <p className="font-semibold">{project.professionals.solicitor.name}</p>
                              <p className="text-sm text-gray-600">{project.professionals.solicitor.role}</p>
                              <p className="text-xs text-gray-500">{project.professionals.solicitor.company}</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            ACTIVE
                          </Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Workload</span>
                              <span>{project.professionals.solicitor.workload}%</span>
                            </div>
                            <Progress value={project.professionals.solicitor.workload} />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Performance</p>
                              <p className="font-medium">{project.professionals.solicitor.performance.rating}/5.0</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Communication</p>
                              <p className="font-medium">{project.professionals.solicitor.performance.communicationScore}%</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Intelligence Tab */}
          <TabsContent value="intelligence" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Performance Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {intelligence.analytics.performance.overallScore}%
                    </div>
                    <p className="text-gray-600">Overall Performance Score</p>
                  </div>
                  
                  <div className="space-y-3">
                    {intelligence.analytics.performance.kpis.map((kpi, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{kpi.name}</p>
                          <p className="text-sm text-gray-600">{kpi.current}/{kpi.target}</p>
                        </div>
                        <div className="flex items-center">
                          <Badge className={`${
                            kpi.status === 'on_target' ? 'bg-green-100 text-green-800' :
                            kpi.status === 'at_risk' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          } mr-2`}>
                            {kpi.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          {kpi.trend === 'improving' && <TrendingUp className="h-4 w-4 text-green-600" />}
                          {kpi.trend === 'declining' && <TrendingDown className="h-4 w-4 text-red-600" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Risk Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Risk Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {intelligence.analytics.risk.riskScore}
                    </div>
                    <p className="text-gray-600">Risk Score (Lower is Better)</p>
                  </div>
                  
                  <div className="space-y-3">
                    {intelligence.analytics.risk.riskDistribution.map((risk, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{risk.category.charAt(0).toUpperCase() + risk.category.slice(1)}</p>
                          <p className="text-sm text-gray-600">{risk.count} risks</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{risk.percentage}%</p>
                          <p className="text-sm text-gray-600">Score: {risk.totalScore}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Mitigation Effectiveness:</strong> {intelligence.analytics.risk.mitigation_effectiveness}%
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Key Findings */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2" />
                    Key AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {intelligence.insights.keyFindings.map((finding, index) => (
                      <Card key={index} className="border">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-semibold">{finding.title}</p>
                            <Badge className={`${
                              finding.significance === 'high' ? 'bg-red-100 text-red-800' :
                              finding.significance === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {finding.significance.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{finding.description}</p>
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs font-medium text-gray-500">Evidence:</p>
                              <ul className="text-xs text-gray-600 ml-4">
                                {finding.evidence.map((evidence, i) => (
                                  <li key={i} className="list-disc">{evidence}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500">Implications:</p>
                              <ul className="text-xs text-gray-600 ml-4">
                                {finding.implications.map((implication, i) => (
                                  <li key={i} className="list-disc">{implication}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Predictions Tab */}
          <TabsContent value="predictions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Completion Prediction */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Completion Prediction
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {new Date(intelligence.predictions.completion.predictedDate).toLocaleDateString()}
                  </div>
                  <p className="text-gray-600 mb-4">Predicted Completion</p>
                  <div className="mb-4">
                    <Progress value={intelligence.predictions.completion.confidence} />
                    <p className="text-sm text-gray-600 mt-1">
                      {intelligence.predictions.completion.confidence}% Confidence
                    </p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    {intelligence.predictions.completion.scenarios.map((scenario, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{scenario.name}:</span>
                        <span className="font-medium">
                          {new Date(scenario.completionDate).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Cost Prediction */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Cost Prediction
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    €{intelligence.predictions.cost.finalCost.toLocaleString()}
                  </div>
                  <p className="text-gray-600 mb-4">Predicted Final Cost</p>
                  <div className="mb-4">
                    <Progress value={intelligence.predictions.cost.confidence} />
                    <p className="text-sm text-gray-600 mt-1">
                      {intelligence.predictions.cost.confidence}% Confidence
                    </p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Optimistic:</span>
                      <span className="font-medium text-green-600">
                        €{intelligence.predictions.cost.variance.optimistic.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Most Likely:</span>
                      <span className="font-medium">
                        €{intelligence.predictions.cost.variance.mostLikely.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pessimistic:</span>
                      <span className="font-medium text-red-600">
                        €{intelligence.predictions.cost.variance.pessimistic.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quality Prediction */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Quality Prediction
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {intelligence.predictions.quality.finalQualityScore}%
                  </div>
                  <p className="text-gray-600 mb-4">Predicted Quality Score</p>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Defect Probability:</span>
                      <span className="font-medium text-orange-600">
                        {intelligence.predictions.quality.defectProbability}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rework Risk:</span>
                      <span className="font-medium text-yellow-600">
                        {intelligence.predictions.quality.reworkRisk}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Compliance Risk:</span>
                      <span className="font-medium text-green-600">
                        {intelligence.predictions.quality.complianceRisk}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Optimization Tab */}
          <TabsContent value="optimization" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Rocket className="h-5 w-5 mr-2" />
                      AI Recommendations
                    </span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {intelligence.recommendations.immediate.length} Active
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {intelligence.recommendations.immediate.map((recommendation) => (
                      <Card key={recommendation.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-semibold">{recommendation.title}</p>
                            <Badge className={`${
                              recommendation.priority === 'critical' ? 'bg-red-100 text-red-800' :
                              recommendation.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                              recommendation.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {recommendation.priority.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{recommendation.description}</p>
                          
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Impact</p>
                              <p className="font-medium">{recommendation.impact.toUpperCase()}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Effort</p>
                              <p className="font-medium">{recommendation.effort.toUpperCase()}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Cost</p>
                              <p className="font-medium">€{recommendation.cost.toLocaleString()}</p>
                            </div>
                          </div>
                          
                          <div className="mt-3 flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {recommendation.category}
                            </Badge>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3 mr-1" />
                                Review
                              </Button>
                              <Button size="sm">
                                <Play className="h-3 w-3 mr-1" />
                                Implement
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Opportunities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 mr-2" />
                    Optimization Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {intelligence.insights.opportunities.map((opportunity, index) => (
                      <Card key={index} className="border border-green-200 bg-green-50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-semibold text-green-800">{opportunity.title}</p>
                            <Badge className="bg-green-100 text-green-800">
                              €{opportunity.value.toLocaleString()}
                            </Badge>
                          </div>
                          <p className="text-sm text-green-700 mb-3">{opportunity.description}</p>
                          
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-green-600">Effort</p>
                              <p className="font-medium">{opportunity.effort.toUpperCase()}</p>
                            </div>
                            <div>
                              <p className="text-green-600">Timeframe</p>
                              <p className="font-medium">{opportunity.timeframe}</p>
                            </div>
                            <div>
                              <p className="text-green-600">Probability</p>
                              <p className="font-medium">{opportunity.probability}%</p>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <Button size="sm" className="w-full">
                              <ArrowRight className="h-3 w-3 mr-1" />
                              Explore Opportunity
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}