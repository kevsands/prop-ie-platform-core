/**
 * Professional Workflow Templates Interface
 * 
 * Week 3 Implementation: Professional Role Integration
 * Interface for browsing, selecting, and customizing professional workflow templates
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Workflow, Play, Users, Clock, Star, Filter, Search,
  Plus, Copy, Edit, Eye, Download, Share, Settings,
  CheckCircle, AlertTriangle, Calendar, BarChart3,
  ArrowRight, PlayCircle, Pause, Target
} from 'lucide-react';

interface WorkflowTask {
  taskCode: string;
  title: string;
  description: string;
  assignedRole: string;
  estimatedHours: number;
  dependencies: string[];
  automationLevel: 'manual' | 'semi_automated' | 'fully_automated';
  criticalPath: boolean;
  category: string;
  deliverables: string[];
}

interface WorkflowPhase {
  id: string;
  name: string;
  description: string;
  order: number;
  tasks: WorkflowTask[];
  dependencies: string[];
  parallelExecution: boolean;
  estimatedDuration: number;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'buyer' | 'developer' | 'agent' | 'solicitor' | 'multi_stakeholder';
  applicableRoles: string[];
  phases: WorkflowPhase[];
  totalTasks: number;
  estimatedDuration: number;
  complexity: 'simple' | 'moderate' | 'complex' | 'expert';
  popularity: number;
  lastUsed?: Date;
  isCustom: boolean;
  tags: string[];
  usageStats: {
    timesUsed: number;
    averageCompletion: number;
    successRate: number;
  };
}

interface WorkflowCustomization {
  templateId: string;
  customizations: {
    skipTasks?: string[];
    additionalTasks?: WorkflowTask[];
    modifiedDurations?: Record<string, number>;
    roleAssignments?: Record<string, string>;
    customParameters?: Record<string, any>;
  };
}

const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'buyer_journey_complete',
    name: 'Complete Buyer Journey Workflow',
    description: 'End-to-end buyer journey with all 641 buyer tasks including property search, financial preparation, legal process, and completion',
    category: 'buyer',
    applicableRoles: ['BUYER', 'BUYER_SOLICITOR', 'BUYER_MORTGAGE_BROKER', 'BUYER_SURVEYOR'],
    phases: [
      {
        id: 'buyer_phase_1',
        name: 'Property Search & Selection',
        description: '52 tasks covering property search and initial selection',
        order: 1,
        parallelExecution: false,
        dependencies: [],
        estimatedDuration: 20,
        tasks: [
          {
            taskCode: 'BUY-001',
            title: 'Location preference specification',
            description: 'Define preferred locations and amenities',
            assignedRole: 'BUYER',
            estimatedHours: 0.5,
            dependencies: [],
            automationLevel: 'semi_automated',
            criticalPath: true,
            category: 'planning',
            deliverables: ['Location criteria document']
          },
          {
            taskCode: 'BUY-002',
            title: 'Property type selection',
            description: 'Choose property type and size requirements',
            assignedRole: 'BUYER',
            estimatedHours: 0.25,
            dependencies: ['BUY-001'],
            automationLevel: 'semi_automated',
            criticalPath: true,
            category: 'planning',
            deliverables: ['Property specification']
          }
        ]
      },
      {
        id: 'buyer_phase_2',
        name: 'Financial Preparation',
        description: '89 tasks covering financial planning and mortgage approval',
        order: 2,
        parallelExecution: true,
        dependencies: ['buyer_phase_1'],
        estimatedDuration: 40,
        tasks: [
          {
            taskCode: 'MTG-001',
            title: 'Mortgage application assessment',
            description: 'Initial mortgage affordability assessment',
            assignedRole: 'BUYER_MORTGAGE_BROKER',
            estimatedHours: 3.0,
            dependencies: ['BUY-003'],
            automationLevel: 'fully_automated',
            criticalPath: true,
            category: 'financial',
            deliverables: ['Affordability report', 'Pre-approval letter']
          }
        ]
      }
    ],
    totalTasks: 641,
    estimatedDuration: 120,
    complexity: 'complex',
    popularity: 95,
    lastUsed: new Date('2024-06-15'),
    isCustom: false,
    tags: ['buyer', 'residential', 'first-time-buyer', 'complete-journey'],
    usageStats: {
      timesUsed: 324,
      averageCompletion: 89,
      successRate: 94
    }
  },
  {
    id: 'developer_project_complete',
    name: 'Complete Development Project Workflow',
    description: 'End-to-end development project with all 1,037 developer tasks from planning to handover',
    category: 'developer',
    applicableRoles: ['DEVELOPER', 'LEAD_ARCHITECT', 'STRUCTURAL_ENGINEER', 'DEVELOPMENT_PROJECT_MANAGER'],
    phases: [
      {
        id: 'dev_phase_1',
        name: 'Project Planning & Setup',
        description: '89 tasks covering project initiation and planning',
        order: 1,
        parallelExecution: false,
        dependencies: [],
        estimatedDuration: 80,
        tasks: [
          {
            taskCode: 'DEV-001',
            title: 'Project planning initiation',
            description: 'Initial project setup and stakeholder identification',
            assignedRole: 'DEVELOPER',
            estimatedHours: 40.0,
            dependencies: [],
            automationLevel: 'semi_automated',
            criticalPath: true,
            category: 'planning',
            deliverables: ['Project brief', 'Stakeholder matrix']
          }
        ]
      }
    ],
    totalTasks: 1037,
    estimatedDuration: 800,
    complexity: 'expert',
    popularity: 87,
    lastUsed: new Date('2024-06-10'),
    isCustom: false,
    tags: ['developer', 'construction', 'residential', 'commercial'],
    usageStats: {
      timesUsed: 156,
      averageCompletion: 92,
      successRate: 88
    }
  },
  {
    id: 'solicitor_conveyancing_complete',
    name: 'Complete Solicitor Conveyancing Workflow',
    description: 'End-to-end legal process with all 1,008 solicitor tasks for property transactions',
    category: 'solicitor',
    applicableRoles: ['BUYER_SOLICITOR', 'DEVELOPER_SOLICITOR'],
    phases: [
      {
        id: 'sol_phase_1',
        name: 'Client Onboarding & Verification',
        description: '187 tasks covering client verification and setup',
        order: 1,
        parallelExecution: false,
        dependencies: [],
        estimatedDuration: 25,
        tasks: [
          {
            taskCode: 'SOL-001',
            title: 'Client identity verification',
            description: 'Verify client identity and conduct due diligence',
            assignedRole: 'BUYER_SOLICITOR',
            estimatedHours: 2.0,
            dependencies: [],
            automationLevel: 'fully_automated',
            criticalPath: true,
            category: 'legal',
            deliverables: ['Identity verification report', 'Due diligence file']
          }
        ]
      }
    ],
    totalTasks: 1008,
    estimatedDuration: 200,
    complexity: 'complex',
    popularity: 91,
    lastUsed: new Date('2024-06-18'),
    isCustom: false,
    tags: ['solicitor', 'legal', 'conveyancing', 'compliance'],
    usageStats: {
      timesUsed: 278,
      averageCompletion: 96,
      successRate: 97
    }
  },
  {
    id: 'estate_agent_sales_complete',
    name: 'Complete Estate Agent Sales Workflow',
    description: 'End-to-end sales process with all 643 estate agent tasks',
    category: 'agent',
    applicableRoles: ['ESTATE_AGENT', 'DEVELOPMENT_SALES_AGENT'],
    phases: [
      {
        id: 'agent_phase_1',
        name: 'Property Listing & Marketing',
        description: '67 tasks covering property marketing preparation',
        order: 1,
        parallelExecution: false,
        dependencies: [],
        estimatedDuration: 30,
        tasks: [
          {
            taskCode: 'AGT-001',
            title: 'Property listing creation',
            description: 'Create comprehensive property listing with photos and details',
            assignedRole: 'ESTATE_AGENT',
            estimatedHours: 4.0,
            dependencies: [],
            automationLevel: 'semi_automated',
            criticalPath: true,
            category: 'marketing',
            deliverables: ['Property listing', 'Marketing materials', 'Photo gallery']
          }
        ]
      }
    ],
    totalTasks: 643,
    estimatedDuration: 160,
    complexity: 'moderate',
    popularity: 89,
    lastUsed: new Date('2024-06-20'),
    isCustom: false,
    tags: ['agent', 'sales', 'marketing', 'viewings'],
    usageStats: {
      timesUsed: 445,
      averageCompletion: 87,
      successRate: 91
    }
  },
  {
    id: 'complete_transaction_coordination',
    name: 'Complete Transaction Coordination Workflow',
    description: 'Cross-stakeholder coordination of all 3,329+ tasks across the entire ecosystem',
    category: 'multi_stakeholder',
    applicableRoles: [
      'BUYER', 'DEVELOPER', 'ESTATE_AGENT', 'BUYER_SOLICITOR',
      'LEAD_ARCHITECT', 'STRUCTURAL_ENGINEER', 'BER_ASSESSOR'
    ],
    phases: [
      {
        id: 'coord_phase_1',
        name: 'Pre-Transaction Preparation',
        description: '932 tasks across all personas for preparation phase',
        order: 1,
        parallelExecution: true,
        dependencies: [],
        estimatedDuration: 200,
        tasks: []
      }
    ],
    totalTasks: 3329,
    estimatedDuration: 1280,
    complexity: 'expert',
    popularity: 76,
    isCustom: false,
    tags: ['coordination', 'multi-stakeholder', 'complete-ecosystem'],
    usageStats: {
      timesUsed: 89,
      averageCompletion: 85,
      successRate: 82
    }
  }
];

const ProfessionalWorkflowTemplates: React.FC<{ userRole: string }> = ({ userRole }) => {
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<WorkflowTemplate[]>([]);
  const [activeTab, setActiveTab] = useState('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterComplexity, setFilterComplexity] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);
  const [showCustomizeDialog, setShowCustomizeDialog] = useState(false);
  const [customization, setCustomization] = useState<WorkflowCustomization | null>(null);

  useEffect(() => {
    // Filter templates based on user role
    const userApplicableTemplates = WORKFLOW_TEMPLATES.filter(template => 
      template.applicableRoles.includes(userRole) || template.category === 'multi_stakeholder'
    );
    setTemplates(userApplicableTemplates);
    setFilteredTemplates(userApplicableTemplates);
  }, [userRole]);

  useEffect(() => {
    let filtered = templates;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(template => template.category === filterCategory);
    }

    // Apply complexity filter
    if (filterComplexity !== 'all') {
      filtered = filtered.filter(template => template.complexity === filterComplexity);
    }

    setFilteredTemplates(filtered);
  }, [templates, searchTerm, filterCategory, filterComplexity]);

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-blue-100 text-blue-800';
      case 'complex': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartWorkflow = (template: WorkflowTemplate) => {
    // TODO: Implement workflow orchestration
    console.log('Starting workflow:', template.id);
  };

  const handleCustomizeWorkflow = (template: WorkflowTemplate) => {
    setSelectedTemplate(template);
    setCustomization({
      templateId: template.id,
      customizations: {}
    });
    setShowCustomizeDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Professional Workflow Templates</h2>
          <p className="text-muted-foreground">
            Browse and execute predefined workflows for your professional role
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Custom Template
        </Button>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="browse" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Browse Templates
          </TabsTrigger>
          <TabsTrigger value="my-workflows" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            My Workflows
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center gap-2">
            <PlayCircle className="h-4 w-4" />
            Active Workflows
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Browse Templates Tab */}
        <TabsContent value="browse" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search templates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="buyer">Buyer</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="agent">Estate Agent</SelectItem>
                    <SelectItem value="solicitor">Solicitor</SelectItem>
                    <SelectItem value="multi_stakeholder">Multi-Stakeholder</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterComplexity} onValueChange={setFilterComplexity}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Complexity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Complexity</SelectItem>
                    <SelectItem value="simple">Simple</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="complex">Complex</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {template.category.replace('_', ' ')}
                        </Badge>
                        <Badge className={getComplexityColor(template.complexity)}>
                          {template.complexity}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-muted-foreground">
                            {template.popularity}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <Workflow className="h-6 w-6 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {template.description}
                  </p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-lg font-semibold">{template.totalTasks}</p>
                      <p className="text-xs text-muted-foreground">Tasks</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{template.estimatedDuration}h</p>
                      <p className="text-xs text-muted-foreground">Duration</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{template.usageStats.successRate}%</p>
                      <p className="text-xs text-muted-foreground">Success Rate</p>
                    </div>
                  </div>

                  {/* Usage Stats */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Average Completion</span>
                      <span>{template.usageStats.averageCompletion}%</span>
                    </div>
                    <Progress value={template.usageStats.averageCompletion} className="h-2" />
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {template.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{template.tags.length - 3} more
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1"
                      onClick={() => handleStartWorkflow(template)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Workflow
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleCustomizeWorkflow(template)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* My Workflows Tab */}
        <TabsContent value="my-workflows" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Custom Templates</CardTitle>
              <p className="text-sm text-muted-foreground">
                Workflows you've created or customized
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Workflow className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No custom workflows yet</p>
                <p className="text-sm">Create your first custom workflow template</p>
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Custom Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Active Workflows Tab */}
        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Workflow Instances</CardTitle>
              <p className="text-sm text-muted-foreground">
                Currently running workflows and their progress
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <PlayCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No active workflows</p>
                <p className="text-sm">Start a workflow template to see it here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">Workflows Completed</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">Active Workflows</p>
                  </div>
                  <PlayCircle className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">0h</p>
                    <p className="text-sm text-muted-foreground">Time Saved</p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">0%</p>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                  </div>
                  <Target className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Workflow Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No workflow data yet</p>
                <p className="text-sm">Complete some workflows to see performance analytics</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Customize Workflow Dialog */}
      <Dialog open={showCustomizeDialog} onOpenChange={setShowCustomizeDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customize Workflow: {selectedTemplate?.name}</DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-6">
              {/* Workflow Overview */}
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-lg font-semibold">{selectedTemplate.totalTasks}</p>
                      <p className="text-sm text-muted-foreground">Total Tasks</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{selectedTemplate.estimatedDuration}h</p>
                      <p className="text-sm text-muted-foreground">Estimated Duration</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{selectedTemplate.phases.length}</p>
                      <p className="text-sm text-muted-foreground">Phases</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Phases and Tasks */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Workflow Phases</h3>
                <Accordion type="single" collapsible className="w-full">
                  {selectedTemplate.phases.map((phase, index) => (
                    <AccordionItem key={phase.id} value={phase.id}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{index + 1}</Badge>
                          <div>
                            <p className="font-medium">{phase.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {phase.tasks.length} tasks • {phase.estimatedDuration}h
                            </p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 pt-3">
                          <p className="text-sm text-muted-foreground">{phase.description}</p>
                          <div className="space-y-2">
                            {phase.tasks.map((task) => (
                              <div key={task.taskCode} className="flex items-center justify-between p-3 border rounded">
                                <div className="flex items-center gap-3">
                                  <Checkbox />
                                  <div>
                                    <p className="font-medium">{task.title}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="secondary" className="text-xs">
                                        {task.assignedRole}
                                      </Badge>
                                      <Badge variant="outline" className="text-xs">
                                        {task.estimatedHours}h
                                      </Badge>
                                      {task.criticalPath && (
                                        <Badge variant="destructive" className="text-xs">
                                          Critical
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              {/* Customization Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Customization Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="workflow-name">Custom Workflow Name</Label>
                    <Input 
                      id="workflow-name"
                      defaultValue={`${selectedTemplate.name} (Custom)`}
                      placeholder="Enter custom name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="workflow-notes">Custom Notes</Label>
                    <Textarea
                      id="workflow-notes"
                      placeholder="Add any custom notes or modifications"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  Start Customized Workflow
                </Button>
                <Button variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Save as Template
                </Button>
                <Button variant="outline" onClick={() => setShowCustomizeDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfessionalWorkflowTemplates;