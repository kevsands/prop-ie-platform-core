/**
 * AI-Powered Workflow Recommendations UI
 * 
 * Interactive interface for AI workflow automation and recommendations
 * Month 2 Implementation: Professional Role Integration (Advanced Features)
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Brain, Zap, TrendingUp, Clock, Target, AlertTriangle,
  CheckCircle, PlayCircle, PauseCircle, Settings,
  BarChart3, Users, Calendar, Lightbulb, Workflow,
  RefreshCw, Download, Filter, Eye, EyeOff
} from 'lucide-react';

interface AIRecommendation {
  id: string;
  type: 'task_optimization' | 'resource_allocation' | 'timeline_adjustment' | 'risk_mitigation' | 'quality_enhancement';
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  reasoning: string[];
  expectedImpact: {
    timeReduction?: number;
    costSavings?: number;
    qualityImprovement?: number;
    riskReduction?: number;
  };
  implementation: {
    steps: Array<{
      order: number;
      action: string;
      assignedRole?: string;
      estimatedDuration: number;
      prerequisites: string[];
      automationLevel: 'manual' | 'semi_automated' | 'fully_automated';
    }>;
    requiredResources: string[];
    riskFactors: string[];
    successMetrics: string[];
    rollbackPlan: string[];
  };
  status: 'pending' | 'approved' | 'implementing' | 'completed' | 'rejected';
  validUntil: string;
  applicableContexts: string[];
  createdAt: string;
  appliedAt?: string;
  completedAt?: string;
}

interface WorkflowAutomation {
  id: string;
  name: string;
  category: 'buyer_journey' | 'developer_process' | 'legal_workflow' | 'financial_coordination';
  status: 'active' | 'paused' | 'draft' | 'archived';
  triggers: Array<{
    type: 'task_completed' | 'deadline_approaching' | 'status_change' | 'external_event';
    condition: string;
    parameters: Record<string, any>;
  }>;
  actions: Array<{
    type: 'create_task' | 'send_notification' | 'update_status' | 'run_analysis';
    description: string;
    automationLevel: 'manual' | 'semi_automated' | 'fully_automated';
  }>;
  frequency: number;
  successRate: number;
  lastRun: string;
  nextRun: string;
}

interface AIInsight {
  id: string;
  category: 'efficiency' | 'quality' | 'risk' | 'opportunity';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  dataPoints: number;
  trend: 'improving' | 'stable' | 'declining';
  recommendations: string[];
  visualizationData?: any[];
}

const AIWorkflowRecommendationsUI: React.FC = () => {
  const [activeTab, setActiveTab] = useState('recommendations');
  const [aiEnabled, setAiEnabled] = useState(true);
  const [autoApprovalThreshold, setAutoApprovalThreshold] = useState([85]);
  const [showImplemented, setShowImplemented] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['all']);

  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([
    {
      id: 'rec_001',
      type: 'task_optimization',
      confidence: 87,
      priority: 'high',
      title: 'Parallel Document Review Process',
      description: 'Implement parallel document review for mortgage applications and legal contracts to reduce timeline by 18%',
      reasoning: [
        'Historical data shows 73% of delays occur during sequential document reviews',
        'Parallel processing reduces critical path by average 4.2 days',
        'Quality metrics remain stable with parallel approach',
        'Resource availability supports simultaneous reviews'
      ],
      expectedImpact: {
        timeReduction: 18,
        qualityImprovement: 5,
        costSavings: 12
      },
      implementation: {
        steps: [
          {
            order: 1,
            action: 'Set up parallel review workflows',
            assignedRole: 'BUYER_SOLICITOR',
            estimatedDuration: 2,
            prerequisites: [],
            automationLevel: 'semi_automated'
          },
          {
            order: 2,
            action: 'Coordinate with mortgage broker for simultaneous review',
            assignedRole: 'BUYER_MORTGAGE_BROKER',
            estimatedDuration: 1,
            prerequisites: ['Parallel workflow setup'],
            automationLevel: 'manual'
          },
          {
            order: 3,
            action: 'Implement automated progress tracking',
            estimatedDuration: 0.5,
            prerequisites: ['Coordination established'],
            automationLevel: 'fully_automated'
          }
        ],
        requiredResources: ['Document management system', 'Coordination tools'],
        riskFactors: ['Communication overhead', 'Version control complexity'],
        successMetrics: ['Reduced timeline', 'Maintained quality scores', 'Client satisfaction'],
        rollbackPlan: ['Revert to sequential process', 'Maintain backup workflows']
      },
      status: 'pending',
      validUntil: '2025-06-28T00:00:00Z',
      applicableContexts: ['first_time_buyer', 'mortgage_required'],
      createdAt: '2025-06-21T08:00:00Z'
    },
    {
      id: 'rec_002',
      type: 'resource_allocation',
      confidence: 92,
      priority: 'medium',
      title: 'Smart Task Distribution',
      description: 'Optimize task distribution across team members based on current workload and expertise matching',
      reasoning: [
        'Current workload analysis shows 23% imbalance across team members',
        'Expertise matching could improve task completion speed by 15%',
        'Automated distribution reduces coordination overhead'
      ],
      expectedImpact: {
        timeReduction: 15,
        qualityImprovement: 8,
        riskReduction: 12
      },
      implementation: {
        steps: [
          {
            order: 1,
            action: 'Analyze current workload distribution',
            estimatedDuration: 1,
            prerequisites: [],
            automationLevel: 'fully_automated'
          },
          {
            order: 2,
            action: 'Implement smart assignment algorithm',
            estimatedDuration: 4,
            prerequisites: ['Workload analysis complete'],
            automationLevel: 'fully_automated'
          }
        ],
        requiredResources: ['Task management system', 'Analytics tools'],
        riskFactors: ['Algorithm accuracy', 'User acceptance'],
        successMetrics: ['Balanced workload', 'Improved completion times'],
        rollbackPlan: ['Manual assignment override available']
      },
      status: 'approved',
      validUntil: '2025-07-05T00:00:00Z',
      applicableContexts: ['high_volume_periods'],
      createdAt: '2025-06-20T14:30:00Z',
      appliedAt: '2025-06-21T09:15:00Z'
    },
    {
      id: 'rec_003',
      type: 'quality_enhancement',
      confidence: 78,
      priority: 'medium',
      title: 'Automated Quality Checkpoints',
      description: 'Implement automated quality checkpoints at critical workflow stages to prevent issues',
      reasoning: [
        'Manual quality checks miss 12% of potential issues',
        'Automated checkpoints provide consistent evaluation',
        'Early detection reduces downstream impact by 67%'
      ],
      expectedImpact: {
        qualityImprovement: 22,
        riskReduction: 25,
        costSavings: 8
      },
      implementation: {
        steps: [
          {
            order: 1,
            action: 'Define quality checkpoint criteria',
            estimatedDuration: 3,
            prerequisites: [],
            automationLevel: 'manual'
          },
          {
            order: 2,
            action: 'Set up automated evaluation triggers',
            estimatedDuration: 2,
            prerequisites: ['Criteria defined'],
            automationLevel: 'fully_automated'
          }
        ],
        requiredResources: ['Quality management framework', 'Automated testing tools'],
        riskFactors: ['False positive rates', 'System complexity'],
        successMetrics: ['Reduced defect rates', 'Faster issue detection'],
        rollbackPlan: ['Revert to manual checkpoints']
      },
      status: 'implementing',
      validUntil: '2025-07-15T00:00:00Z',
      applicableContexts: ['complex_transactions'],
      createdAt: '2025-06-19T11:20:00Z',
      appliedAt: '2025-06-20T16:45:00Z'
    }
  ]);

  const [automations, setAutomations] = useState<WorkflowAutomation[]>([
    {
      id: 'auto_001',
      name: 'First-Time Buyer Welcome Sequence',
      category: 'buyer_journey',
      status: 'active',
      triggers: [
        {
          type: 'task_completed',
          condition: 'Initial registration completed',
          parameters: { taskType: 'registration' }
        }
      ],
      actions: [
        {
          type: 'create_task',
          description: 'Schedule welcome call with dedicated advisor',
          automationLevel: 'semi_automated'
        },
        {
          type: 'send_notification',
          description: 'Send welcome package with next steps',
          automationLevel: 'fully_automated'
        }
      ],
      frequency: 847, // times triggered this month
      successRate: 94.2,
      lastRun: '2025-06-21T09:30:00Z',
      nextRun: 'On trigger'
    },
    {
      id: 'auto_002',
      name: 'Legal Deadline Monitoring',
      category: 'legal_workflow',
      status: 'active',
      triggers: [
        {
          type: 'deadline_approaching',
          condition: 'Legal deadline within 3 days',
          parameters: { daysThreshold: 3 }
        }
      ],
      actions: [
        {
          type: 'send_notification',
          description: 'Alert solicitor and client of approaching deadline',
          automationLevel: 'fully_automated'
        },
        {
          type: 'update_status',
          description: 'Flag transaction as requiring urgent attention',
          automationLevel: 'fully_automated'
        }
      ],
      frequency: 156,
      successRate: 98.7,
      lastRun: '2025-06-21T08:00:00Z',
      nextRun: '2025-06-21T20:00:00Z'
    },
    {
      id: 'auto_003',
      name: 'Construction Milestone Verification',
      category: 'developer_process',
      status: 'active',
      triggers: [
        {
          type: 'external_event',
          condition: 'Construction milestone reported',
          parameters: { source: 'construction_tracker' }
        }
      ],
      actions: [
        {
          type: 'run_analysis',
          description: 'Verify milestone against project timeline',
          automationLevel: 'fully_automated'
        },
        {
          type: 'create_task',
          description: 'Schedule quality inspection if required',
          automationLevel: 'semi_automated'
        }
      ],
      frequency: 89,
      successRate: 91.4,
      lastRun: '2025-06-20T15:45:00Z',
      nextRun: 'On trigger'
    }
  ]);

  const [insights, setInsights] = useState<AIInsight[]>([
    {
      id: 'insight_001',
      category: 'efficiency',
      title: 'Peak Performance Hours Identified',
      description: 'Team productivity peaks between 10-12 AM and 2-4 PM, with 23% higher task completion rates',
      severity: 'medium',
      confidence: 89,
      dataPoints: 1247,
      trend: 'stable',
      recommendations: [
        'Schedule critical tasks during peak hours',
        'Reserve routine work for lower-productivity periods',
        'Consider flexible scheduling to maximize peak-hour utilization'
      ]
    },
    {
      id: 'insight_002',
      category: 'risk',
      title: 'Communication Gap Pattern',
      description: 'Transactions with >48h response gaps show 34% higher risk of delays',
      severity: 'high',
      confidence: 94,
      dataPoints: 892,
      trend: 'improving',
      recommendations: [
        'Implement automated follow-up reminders',
        'Set communication SLAs for all stakeholders',
        'Create escalation procedures for delayed responses'
      ]
    },
    {
      id: 'insight_003',
      category: 'opportunity',
      title: 'Premium Service Demand',
      description: 'Market analysis shows 67% willingness to pay premium for expedited services',
      severity: 'low',
      confidence: 73,
      dataPoints: 2156,
      trend: 'improving',
      recommendations: [
        'Develop premium service tier',
        'Test expedited workflow processes',
        'Survey clients for specific premium features'
      ]
    }
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'task_optimization': return <Workflow className="h-4 w-4" />;
      case 'resource_allocation': return <Users className="h-4 w-4" />;
      case 'timeline_adjustment': return <Clock className="h-4 w-4" />;
      case 'risk_mitigation': return <AlertTriangle className="h-4 w-4" />;
      case 'quality_enhancement': return <Target className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'implementing': return 'text-blue-600 bg-blue-50';
      case 'approved': return 'text-purple-600 bg-purple-50';
      case 'pending': return 'text-orange-600 bg-orange-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleApproveRecommendation = (id: string) => {
    setRecommendations(prev => 
      prev.map(rec => 
        rec.id === id 
          ? { ...rec, status: 'approved', appliedAt: new Date().toISOString() }
          : rec
      )
    );
  };

  const handleRejectRecommendation = (id: string) => {
    setRecommendations(prev => 
      prev.map(rec => 
        rec.id === id 
          ? { ...rec, status: 'rejected' }
          : rec
      )
    );
  };

  const handleToggleAutomation = (id: string) => {
    setAutomations(prev =>
      prev.map(auto =>
        auto.id === id
          ? { ...auto, status: auto.status === 'active' ? 'paused' : 'active' }
          : auto
      )
    );
  };

  const filteredRecommendations = recommendations.filter(rec => {
    if (!showImplemented && ['completed', 'rejected'].includes(rec.status)) return false;
    if (selectedFilters.includes('all')) return true;
    return selectedFilters.includes(rec.type);
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Brain className="h-8 w-8 mr-3 text-blue-600" />
              AI Workflow Optimization
            </h1>
            <p className="text-gray-600">Intelligent automation and workflow recommendations</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">AI Engine</span>
              <Switch 
                checked={aiEnabled} 
                onCheckedChange={setAiEnabled}
              />
            </div>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* AI Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Recommendations</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {recommendations.filter(r => r.status === 'pending').length}
                  </p>
                </div>
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Lightbulb className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div className="mt-2">
                <p className="text-xs text-blue-600">
                  {recommendations.filter(r => r.confidence > 85).length} high confidence
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Automation Success</p>
                  <p className="text-2xl font-bold text-gray-900">94.7%</p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="mt-2">
                <p className="text-xs text-green-600">+2.3% from last month</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Time Saved</p>
                  <p className="text-2xl font-bold text-gray-900">127h</p>
                </div>
                <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Clock className="h-4 w-4 text-purple-600" />
                </div>
              </div>
              <div className="mt-2">
                <p className="text-xs text-purple-600">This month</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">ROI</p>
                  <p className="text-2xl font-bold text-gray-900">318%</p>
                </div>
                <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </div>
              </div>
              <div className="mt-2">
                <p className="text-xs text-orange-600">From AI optimizations</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="recommendations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="automations">Automations</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Show implemented:</span>
                  <Switch 
                    checked={showImplemented}
                    onCheckedChange={setShowImplemented}
                  />
                </div>
              </div>
              <Button>
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate New Recommendations
              </Button>
            </div>

            <div className="grid gap-6">
              {filteredRecommendations.map((recommendation) => (
                <Card key={recommendation.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {getTypeIcon(recommendation.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-lg">{recommendation.title}</h3>
                            <Badge className={getPriorityColor(recommendation.priority)}>
                              {recommendation.priority}
                            </Badge>
                            <Badge variant="outline">
                              {recommendation.confidence}% confidence
                            </Badge>
                            <Badge className={getStatusColor(recommendation.status)}>
                              {recommendation.status}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{recommendation.description}</p>
                          
                          {/* Expected Impact */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            {recommendation.expectedImpact.timeReduction && (
                              <div className="text-center p-2 bg-blue-50 rounded">
                                <div className="text-lg font-semibold text-blue-600">
                                  -{recommendation.expectedImpact.timeReduction}%
                                </div>
                                <div className="text-xs text-gray-600">Time Reduction</div>
                              </div>
                            )}
                            {recommendation.expectedImpact.costSavings && (
                              <div className="text-center p-2 bg-green-50 rounded">
                                <div className="text-lg font-semibold text-green-600">
                                  +{recommendation.expectedImpact.costSavings}%
                                </div>
                                <div className="text-xs text-gray-600">Cost Savings</div>
                              </div>
                            )}
                            {recommendation.expectedImpact.qualityImprovement && (
                              <div className="text-center p-2 bg-purple-50 rounded">
                                <div className="text-lg font-semibold text-purple-600">
                                  +{recommendation.expectedImpact.qualityImprovement}%
                                </div>
                                <div className="text-xs text-gray-600">Quality</div>
                              </div>
                            )}
                            {recommendation.expectedImpact.riskReduction && (
                              <div className="text-center p-2 bg-orange-50 rounded">
                                <div className="text-lg font-semibold text-orange-600">
                                  -{recommendation.expectedImpact.riskReduction}%
                                </div>
                                <div className="text-xs text-gray-600">Risk Reduction</div>
                              </div>
                            )}
                          </div>

                          {/* Implementation Steps */}
                          <div className="mb-4">
                            <h4 className="font-medium mb-2">Implementation Plan</h4>
                            <div className="space-y-2">
                              {recommendation.implementation.steps.slice(0, 3).map((step, index) => (
                                <div key={index} className="flex items-center space-x-3 text-sm">
                                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
                                    {step.order}
                                  </div>
                                  <span className="flex-1">{step.action}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {step.estimatedDuration}h
                                  </Badge>
                                </div>
                              ))}
                              {recommendation.implementation.steps.length > 3 && (
                                <div className="text-sm text-gray-500 ml-9">
                                  +{recommendation.implementation.steps.length - 3} more steps
                                </div>
                              )}
                            </div>
                          </div>

                          {/* AI Reasoning */}
                          <div className="mb-4">
                            <h4 className="font-medium mb-2">AI Analysis</h4>
                            <div className="text-sm text-gray-600 space-y-1">
                              {recommendation.reasoning.slice(0, 2).map((reason, index) => (
                                <div key={index} className="flex items-start">
                                  <span className="text-blue-500 mr-2">•</span>
                                  {reason}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-col space-y-2">
                        {recommendation.status === 'pending' && (
                          <>
                            <Button 
                              size="sm"
                              onClick={() => handleApproveRecommendation(recommendation.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleRejectRecommendation(recommendation.id)}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {recommendation.status === 'approved' && (
                          <Button size="sm" variant="outline">
                            <PlayCircle className="h-4 w-4 mr-1" />
                            Implement
                          </Button>
                        )}
                        {recommendation.status === 'implementing' && (
                          <Button size="sm" variant="outline" disabled>
                            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                            In Progress
                          </Button>
                        )}
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>

                    {/* Progress Bar for Implementing */}
                    {recommendation.status === 'implementing' && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Implementation Progress</span>
                          <span>67%</span>
                        </div>
                        <Progress value={67} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Automations Tab */}
          <TabsContent value="automations" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Active Workflow Automations</h2>
              <Button>
                <Zap className="h-4 w-4 mr-2" />
                Create New Automation
              </Button>
            </div>

            <div className="grid gap-6">
              {automations.map((automation) => (
                <Card key={automation.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg">{automation.name}</h3>
                          <Badge variant={automation.status === 'active' ? 'default' : 'secondary'}>
                            {automation.status}
                          </Badge>
                          <Badge variant="outline">{automation.category.replace('_', ' ')}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <h4 className="font-medium mb-2">Triggers</h4>
                            {automation.triggers.map((trigger, index) => (
                              <div key={index} className="text-sm text-gray-600 mb-1">
                                <span className="font-medium">{trigger.type}:</span> {trigger.condition}
                              </div>
                            ))}
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Actions</h4>
                            {automation.actions.map((action, index) => (
                              <div key={index} className="text-sm text-gray-600 mb-1">
                                • {action.description}
                              </div>
                            ))}
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Performance</h4>
                            <div className="text-sm space-y-1">
                              <div>Frequency: {automation.frequency}/month</div>
                              <div>Success Rate: {automation.successRate}%</div>
                              <div>Last Run: {new Date(automation.lastRun).toLocaleString()}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button
                          size="sm"
                          variant={automation.status === 'active' ? 'outline' : 'default'}
                          onClick={() => handleToggleAutomation(automation.id)}
                        >
                          {automation.status === 'active' ? (
                            <>
                              <PauseCircle className="h-4 w-4 mr-1" />
                              Pause
                            </>
                          ) : (
                            <>
                              <PlayCircle className="h-4 w-4 mr-1" />
                              Activate
                            </>
                          )}
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Settings className="h-4 w-4 mr-1" />
                          Configure
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Next run: {automation.nextRun === 'On trigger' ? automation.nextRun : new Date(automation.nextRun).toLocaleString()}</span>
                      <span>Success rate: {automation.successRate}%</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">AI-Generated Insights</h2>
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Full Analytics
              </Button>
            </div>

            <div className="grid gap-6">
              {insights.map((insight) => (
                <Card key={insight.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-lg">{insight.title}</h3>
                          <Badge variant={insight.severity === 'high' ? 'destructive' : 'secondary'}>
                            {insight.severity}
                          </Badge>
                          <Badge variant="outline">
                            {insight.confidence}% confidence
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-4">{insight.description}</p>
                        
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Recommendations</h4>
                          <div className="space-y-1">
                            {insight.recommendations.map((rec, index) => (
                              <div key={index} className="text-sm text-gray-600 flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                {rec}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <span>Data Points: {insight.dataPoints.toLocaleString()}</span>
                          <span>Trend: {insight.trend}</span>
                          <span>Category: {insight.category}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Explore
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-xl font-semibold">AI Configuration</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Automation Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Enable AI Recommendations</span>
                      <p className="text-sm text-gray-600">Allow AI to generate workflow recommendations</p>
                    </div>
                    <Switch checked={aiEnabled} onCheckedChange={setAiEnabled} />
                  </div>
                  
                  <div className="space-y-2">
                    <span className="font-medium">Auto-approval Threshold</span>
                    <p className="text-sm text-gray-600">
                      Automatically approve recommendations with confidence above: {autoApprovalThreshold[0]}%
                    </p>
                    <Slider
                      value={autoApprovalThreshold}
                      onValueChange={setAutoApprovalThreshold}
                      max={100}
                      min={70}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Learning Mode</span>
                      <p className="text-sm text-gray-600">Allow AI to learn from user decisions</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">High-priority recommendations</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Automation status changes</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Weekly AI insights digest</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Performance improvement alerts</span>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AIWorkflowRecommendationsUI;