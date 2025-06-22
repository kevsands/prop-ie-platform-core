/**
 * Real-Time Analytics Dashboard for Professionals
 * 
 * Advanced analytics dashboard with AI-powered insights and predictive analytics
 * Month 2 Implementation: Professional Role Integration (Advanced Features)
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, 
  ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import {
  TrendingUp, TrendingDown, Activity, Clock, Target, Users,
  Brain, Zap, AlertTriangle, CheckCircle, BarChart3, 
  PieChart as PieChartIcon, LineChart as LineChartIcon,
  Calendar, MapPin, Filter, Download, RefreshCw
} from 'lucide-react';

interface AnalyticsMetrics {
  performance: {
    completionRate: number;
    averageTaskTime: number;
    qualityScore: number;
    clientSatisfaction: number;
    onTimeDelivery: number;
    revenuePerHour: number;
  };
  utilization: {
    currentCapacity: number;
    weeklyUtilization: number;
    monthlyTrend: number;
    peakHours: Array<{ hour: number; utilization: number }>;
    workloadDistribution: Array<{ category: string; percentage: number; color: string }>;
  };
  coordination: {
    activeCollaborations: number;
    communicationEfficiency: number;
    stakeholderSatisfaction: number;
    responseTime: number;
    coordinationQuality: number;
  };
  predictions: {
    nextWeekWorkload: number;
    revenueProjection: number;
    riskScore: number;
    opportunities: Array<{
      type: string;
      impact: number;
      confidence: number;
      description: string;
    }>;
  };
}

interface TransactionAnalytics {
  id: string;
  phase: string;
  progress: number;
  timeline: {
    original: number;
    predicted: number;
    actual?: number;
  };
  riskScore: number;
  qualityMetrics: {
    documentation: number;
    communication: number;
    timeliness: number;
    overall: number;
  };
  stakeholders: Array<{
    role: string;
    performance: number;
    status: 'ahead' | 'on_track' | 'behind' | 'at_risk';
  }>;
}

interface AIInsight {
  id: string;
  type: 'optimization' | 'warning' | 'opportunity' | 'prediction';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  timeframe: string;
  category: string;
  metrics?: {
    timeReduction?: number;
    costSavings?: number;
    qualityImprovement?: number;
    riskReduction?: number;
  };
}

const RealTimeAnalyticsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<AnalyticsMetrics>({
    performance: {
      completionRate: 94.5,
      averageTaskTime: 2.3,
      qualityScore: 91.2,
      clientSatisfaction: 4.6,
      onTimeDelivery: 89.7,
      revenuePerHour: 285
    },
    utilization: {
      currentCapacity: 78.5,
      weeklyUtilization: 82.3,
      monthlyTrend: 5.2,
      peakHours: [
        { hour: 9, utilization: 45 },
        { hour: 10, utilization: 78 },
        { hour: 11, utilization: 92 },
        { hour: 14, utilization: 85 },
        { hour: 15, utilization: 88 },
        { hour: 16, utilization: 75 }
      ],
      workloadDistribution: [
        { category: 'Legal Review', percentage: 35, color: '#8884d8' },
        { category: 'Client Communication', percentage: 25, color: '#82ca9d' },
        { category: 'Documentation', percentage: 20, color: '#ffc658' },
        { category: 'Coordination', percentage: 15, color: '#ff7c7c' },
        { category: 'Research', percentage: 5, color: '#8dd1e1' }
      ]
    },
    coordination: {
      activeCollaborations: 12,
      communicationEfficiency: 87.4,
      stakeholderSatisfaction: 4.3,
      responseTime: 1.8,
      coordinationQuality: 92.1
    },
    predictions: {
      nextWeekWorkload: 85.2,
      revenueProjection: 12450,
      riskScore: 23.5,
      opportunities: [
        {
          type: 'efficiency',
          impact: 15,
          confidence: 87,
          description: 'Optimize document review process'
        },
        {
          type: 'revenue',
          impact: 22,
          confidence: 73,
          description: 'Premium service offering opportunity'
        }
      ]
    }
  });

  const [transactions, setTransactions] = useState<TransactionAnalytics[]>([
    {
      id: 'T001',
      phase: 'Legal Process',
      progress: 65,
      timeline: { original: 21, predicted: 19, actual: undefined },
      riskScore: 25,
      qualityMetrics: {
        documentation: 95,
        communication: 88,
        timeliness: 92,
        overall: 92
      },
      stakeholders: [
        { role: 'Buyer Solicitor', performance: 94, status: 'on_track' },
        { role: 'Mortgage Broker', performance: 87, status: 'ahead' },
        { role: 'Surveyor', performance: 78, status: 'behind' }
      ]
    },
    {
      id: 'T002',
      phase: 'Offer Negotiation',
      progress: 45,
      timeline: { original: 14, predicted: 16, actual: undefined },
      riskScore: 42,
      qualityMetrics: {
        documentation: 89,
        communication: 85,
        timeliness: 76,
        overall: 83
      },
      stakeholders: [
        { role: 'Estate Agent', performance: 91, status: 'on_track' },
        { role: 'Buyer Solicitor', performance: 85, status: 'on_track' }
      ]
    }
  ]);

  const [aiInsights, setAiInsights] = useState<AIInsight[]>([
    {
      id: 'ai_001',
      type: 'optimization',
      title: 'Document Review Optimization',
      description: 'AI analysis suggests implementing parallel document review could reduce timeline by 18%',
      confidence: 87,
      impact: 'high',
      actionable: true,
      timeframe: 'Next week',
      category: 'Process Improvement',
      metrics: {
        timeReduction: 18,
        qualityImprovement: 12
      }
    },
    {
      id: 'ai_002',
      type: 'warning',
      title: 'Capacity Risk Alert',
      description: 'Current workload trajectory suggests 95% capacity utilization by next Friday',
      confidence: 92,
      impact: 'medium',
      actionable: true,
      timeframe: 'This week',
      category: 'Resource Management'
    },
    {
      id: 'ai_003',
      type: 'opportunity',
      title: 'Premium Service Opportunity',
      description: 'Market analysis indicates 73% demand increase for expedited legal services',
      confidence: 73,
      impact: 'high',
      actionable: true,
      timeframe: 'Next month',
      category: 'Business Development',
      metrics: {
        costSavings: 22
      }
    },
    {
      id: 'ai_004',
      type: 'prediction',
      title: 'Quality Score Improvement',
      description: 'Implementing suggested workflow changes could improve quality score to 96.2%',
      confidence: 81,
      impact: 'medium',
      actionable: false,
      timeframe: 'Next quarter',
      category: 'Quality Enhancement',
      metrics: {
        qualityImprovement: 5.4
      }
    }
  ]);

  // Performance trend data
  const performanceTrend = [
    { month: 'Jan', completion: 89, quality: 87, satisfaction: 4.2, revenue: 11200 },
    { month: 'Feb', completion: 91, quality: 89, satisfaction: 4.3, revenue: 11800 },
    { month: 'Mar', completion: 93, quality: 90, satisfaction: 4.4, revenue: 12100 },
    { month: 'Apr', completion: 92, quality: 91, satisfaction: 4.5, revenue: 12350 },
    { month: 'May', completion: 94, quality: 91, satisfaction: 4.6, revenue: 12650 },
    { month: 'Jun', completion: 95, quality: 92, satisfaction: 4.6, revenue: 12850 }
  ];

  // Utilization pattern data
  const utilizationPattern = [
    { day: 'Mon', hours: 8.5, efficiency: 85, tasks: 12 },
    { day: 'Tue', hours: 9.2, efficiency: 92, tasks: 14 },
    { day: 'Wed', hours: 8.8, efficiency: 88, tasks: 13 },
    { day: 'Thu', hours: 9.5, efficiency: 95, tasks: 15 },
    { day: 'Fri', hours: 7.8, efficiency: 82, tasks: 11 },
    { day: 'Sat', hours: 4.2, efficiency: 78, tasks: 6 },
    { day: 'Sun', hours: 2.1, efficiency: 85, tasks: 3 }
  ];

  // Risk vs Revenue analysis
  const riskRevenueData = [
    { risk: 15, revenue: 8500, transactions: 3 },
    { risk: 25, revenue: 12200, transactions: 8 },
    { risk: 35, revenue: 15800, transactions: 5 },
    { risk: 45, revenue: 18200, transactions: 2 },
    { risk: 55, revenue: 22500, transactions: 1 }
  ];

  // Radar chart data for capabilities
  const capabilityData = [
    { capability: 'Legal Expertise', score: 92, fullMark: 100 },
    { capability: 'Communication', score: 88, fullMark: 100 },
    { capability: 'Efficiency', score: 85, fullMark: 100 },
    { capability: 'Technology', score: 78, fullMark: 100 },
    { capability: 'Client Relations', score: 91, fullMark: 100 },
    { capability: 'Coordination', score: 87, fullMark: 100 }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <Zap className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'opportunity': return <TrendingUp className="h-4 w-4" />;
      case 'prediction': return <Brain className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Real-Time Analytics</h1>
            <p className="text-gray-600">AI-powered insights and performance analytics</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.performance.completionRate}%</p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="mt-2">
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +2.3% from last month
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Quality Score</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.performance.qualityScore}%</p>
                </div>
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Target className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div className="mt-2">
                <Progress value={metrics.performance.qualityScore} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Utilization</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.utilization.currentCapacity}%</p>
                </div>
                <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Activity className="h-4 w-4 text-purple-600" />
                </div>
              </div>
              <div className="mt-2">
                <p className="text-xs text-purple-600">Optimal capacity range</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue/Hour</p>
                  <p className="text-2xl font-bold text-gray-900">€{metrics.performance.revenuePerHour}</p>
                </div>
                <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </div>
              </div>
              <div className="mt-2">
                <div className="flex items-center text-xs text-orange-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +€23 from last week
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Tabs */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="utilization">Utilization</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="predictions">AI Insights</TabsTrigger>
            <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
          </TabsList>

          {/* Performance Analytics */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LineChartIcon className="h-5 w-5 mr-2" />
                    Performance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="completion" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        name="Completion Rate"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="quality" 
                        stroke="#82ca9d" 
                        strokeWidth={2}
                        name="Quality Score"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Revenue Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={performanceTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#ffc658" name="Revenue (€)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{metrics.performance.onTimeDelivery}%</div>
                    <div className="text-sm text-green-600">On-Time Delivery</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{metrics.performance.clientSatisfaction}</div>
                    <div className="text-sm text-blue-600">Client Satisfaction</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{metrics.performance.averageTaskTime}h</div>
                    <div className="text-sm text-purple-600">Avg Task Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Utilization Analytics */}
          <TabsContent value="utilization" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Utilization Pattern</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={utilizationPattern}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="hours" 
                        stroke="#8884d8" 
                        fill="#8884d8" 
                        fillOpacity={0.6}
                        name="Hours Worked"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Workload Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={metrics.utilization.workloadDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name} ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="percentage"
                      >
                        {metrics.utilization.workloadDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Efficiency Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={utilizationPattern}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="efficiency" fill="#82ca9d" name="Efficiency %" />
                    <Bar dataKey="tasks" fill="#ffc658" name="Tasks Completed" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transaction Analytics */}
          <TabsContent value="transactions" className="space-y-6">
            <div className="grid gap-6">
              {transactions.map((transaction) => (
                <Card key={transaction.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">Transaction {transaction.id}</h3>
                        <p className="text-gray-600">{transaction.phase}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{transaction.progress}%</div>
                        <Progress value={transaction.progress} className="w-24 mt-1" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Timeline Analysis</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Original:</span>
                            <span>{transaction.timeline.original} days</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Predicted:</span>
                            <span className={transaction.timeline.predicted < transaction.timeline.original ? 'text-green-600' : 'text-orange-600'}>
                              {transaction.timeline.predicted} days
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Risk Score:</span>
                            <span className={`font-medium ${transaction.riskScore < 30 ? 'text-green-600' : transaction.riskScore < 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {transaction.riskScore}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Quality Metrics</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Documentation:</span>
                            <span>{transaction.qualityMetrics.documentation}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Communication:</span>
                            <span>{transaction.qualityMetrics.communication}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Timeliness:</span>
                            <span>{transaction.qualityMetrics.timeliness}%</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>Overall:</span>
                            <span className="text-blue-600">{transaction.qualityMetrics.overall}%</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Stakeholder Performance</h4>
                        <div className="space-y-2">
                          {transaction.stakeholders.map((stakeholder, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span>{stakeholder.role}</span>
                              <div className="flex items-center space-x-2">
                                <span>{stakeholder.performance}%</span>
                                <Badge 
                                  variant={
                                    stakeholder.status === 'ahead' ? 'default' :
                                    stakeholder.status === 'on_track' ? 'secondary' :
                                    stakeholder.status === 'behind' ? 'destructive' : 'outline'
                                  }
                                  className="text-xs"
                                >
                                  {stakeholder.status.replace('_', ' ')}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Risk vs Revenue Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={riskRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="risk" name="Risk Score" unit="%" />
                    <YAxis dataKey="revenue" name="Revenue" unit="€" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter dataKey="revenue" fill="#8884d8" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Insights */}
          <TabsContent value="predictions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Next Week Workload</p>
                      <p className="text-2xl font-bold text-gray-900">{metrics.predictions.nextWeekWorkload}%</p>
                    </div>
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <Progress value={metrics.predictions.nextWeekWorkload} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Revenue Projection</p>
                      <p className="text-2xl font-bold text-gray-900">€{metrics.predictions.revenueProjection.toLocaleString()}</p>
                    </div>
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <p className="text-xs text-green-600 mt-2">+12% from current month</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Risk Score</p>
                      <p className="text-2xl font-bold text-gray-900">{metrics.predictions.riskScore}%</p>
                    </div>
                    <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    </div>
                  </div>
                  <p className="text-xs text-yellow-600 mt-2">Low risk level</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  AI-Powered Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiInsights.map((insight) => (
                  <div key={insight.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${
                          insight.type === 'optimization' ? 'bg-blue-100' :
                          insight.type === 'warning' ? 'bg-yellow-100' :
                          insight.type === 'opportunity' ? 'bg-green-100' :
                          'bg-purple-100'
                        }`}>
                          {getInsightIcon(insight.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">{insight.title}</h4>
                            <Badge className={getImpactColor(insight.impact)}>
                              {insight.impact}
                            </Badge>
                            <Badge variant="outline">
                              {insight.confidence}% confidence
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Category: {insight.category}</span>
                            <span>Timeframe: {insight.timeframe}</span>
                          </div>
                        </div>
                      </div>
                      {insight.actionable && (
                        <Button size="sm" variant="outline">
                          Take Action
                        </Button>
                      )}
                    </div>
                    {insight.metrics && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 pt-3 border-t">
                        {insight.metrics.timeReduction && (
                          <div className="text-center">
                            <div className="text-lg font-semibold text-blue-600">-{insight.metrics.timeReduction}%</div>
                            <div className="text-xs text-gray-500">Time Reduction</div>
                          </div>
                        )}
                        {insight.metrics.costSavings && (
                          <div className="text-center">
                            <div className="text-lg font-semibold text-green-600">+{insight.metrics.costSavings}%</div>
                            <div className="text-xs text-gray-500">Cost Savings</div>
                          </div>
                        )}
                        {insight.metrics.qualityImprovement && (
                          <div className="text-center">
                            <div className="text-lg font-semibold text-purple-600">+{insight.metrics.qualityImprovement}%</div>
                            <div className="text-xs text-gray-500">Quality Improvement</div>
                          </div>
                        )}
                        {insight.metrics.riskReduction && (
                          <div className="text-center">
                            <div className="text-lg font-semibold text-orange-600">-{insight.metrics.riskReduction}%</div>
                            <div className="text-xs text-gray-500">Risk Reduction</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Capabilities Radar */}
          <TabsContent value="capabilities" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Capabilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={capabilityData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="capability" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="Current Score"
                        dataKey="score"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.4}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Coordination Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Active Collaborations</span>
                    <span className="text-xl font-bold">{metrics.coordination.activeCollaborations}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Communication Efficiency</span>
                      <span>{metrics.coordination.communicationEfficiency}%</span>
                    </div>
                    <Progress value={metrics.coordination.communicationEfficiency} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Coordination Quality</span>
                      <span>{metrics.coordination.coordinationQuality}%</span>
                    </div>
                    <Progress value={metrics.coordination.coordinationQuality} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Response Time</span>
                      <span>{metrics.coordination.responseTime}h avg</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Stakeholder Satisfaction</span>
                      <span>{metrics.coordination.stakeholderSatisfaction}/5.0</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Capability Development Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Technology Integration</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Current score: 78%. Recommended focus on AI-assisted document review and automation tools.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-600">Potential improvement: +15 points</span>
                      <Button size="sm" variant="outline">Learn More</Button>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Coordination Skills</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Current score: 87%. Enhanced stakeholder management training could boost efficiency.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-600">Potential improvement: +8 points</span>
                      <Button size="sm" variant="outline">View Training</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RealTimeAnalyticsDashboard;