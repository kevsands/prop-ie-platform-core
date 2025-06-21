/**
 * Professional Ecosystem Dashboard
 * 
 * Advanced dashboard for professional coordination and real-time analytics
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
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';
import {
  Bell, Users, Clock, TrendingUp, AlertTriangle, CheckCircle,
  Activity, Target, Calendar, MessageSquare, Settings, 
  BarChart3, PieChart as PieChartIcon, Zap, Brain
} from 'lucide-react';

interface ProfessionalMetrics {
  activeTransactions: number;
  pendingTasks: number;
  completedToday: number;
  utilizationRate: number;
  qualityScore: number;
  responseTime: number;
  coordinationEfficiency: number;
}

interface Transaction {
  id: string;
  propertyAddress: string;
  buyerName: string;
  phase: string;
  progress: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedCompletion: string;
  stakeholders: Array<{
    role: string;
    name: string;
    status: 'active' | 'waiting' | 'completed';
  }>;
  nextAction: string;
  riskLevel: number;
}

interface AIRecommendation {
  id: string;
  type: 'optimization' | 'risk_mitigation' | 'quality_improvement';
  title: string;
  description: string;
  confidence: number;
  expectedImpact: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  implementation: string[];
}

interface CoordinationAlert {
  id: string;
  type: 'deadline' | 'dependency' | 'resource' | 'communication';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  timestamp: string;
  actionRequired: boolean;
  relatedTransaction?: string;
}

const ProfessionalEcosystemDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<ProfessionalMetrics>({
    activeTransactions: 12,
    pendingTasks: 34,
    completedToday: 8,
    utilizationRate: 78,
    qualityScore: 92,
    responseTime: 2.4,
    coordinationEfficiency: 85
  });

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'T001',
      propertyAddress: 'Apt 12A, Fitzgerald Gardens, Dublin 4',
      buyerName: 'Sarah & Michael Thompson',
      phase: 'Legal Process',
      progress: 65,
      priority: 'high',
      estimatedCompletion: '2025-07-15',
      stakeholders: [
        { role: 'Buyer Solicitor', name: 'Sarah O\'Sullivan', status: 'active' },
        { role: 'Developer Solicitor', name: 'James Mitchell', status: 'waiting' },
        { role: 'Mortgage Broker', name: 'David Chen', status: 'completed' }
      ],
      nextAction: 'Complete title investigation',
      riskLevel: 3
    },
    {
      id: 'T002',
      propertyAddress: 'Unit 5B, Riverside Quarter, Cork',
      buyerName: 'Emma O\'Brien',
      phase: 'Offer Negotiation',
      progress: 45,
      priority: 'medium',
      estimatedCompletion: '2025-08-02',
      stakeholders: [
        { role: 'Estate Agent', name: 'Lisa Murphy', status: 'active' },
        { role: 'Buyer Solicitor', name: 'Sarah O\'Sullivan', status: 'waiting' }
      ],
      nextAction: 'Review counter-offer terms',
      riskLevel: 2
    }
  ]);

  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([
    {
      id: 'AI001',
      type: 'optimization',
      title: 'Optimize Task Sequencing',
      description: 'Parallel processing of searches and mortgage approval could reduce timeline by 8 days',
      confidence: 0.87,
      expectedImpact: '12% faster completion',
      priority: 'high',
      implementation: [
        'Coordinate with mortgage broker for early approval',
        'Run searches in parallel with financial setup'
      ]
    },
    {
      id: 'AI002',
      type: 'risk_mitigation',
      title: 'Address Capacity Constraint',
      description: 'Current workload may impact quality on high-priority transactions',
      confidence: 0.72,
      expectedImpact: 'Maintain 92% quality score',
      priority: 'medium',
      implementation: [
        'Delegate routine tasks to junior staff',
        'Focus on critical path activities'
      ]
    }
  ]);

  const [alerts, setAlerts] = useState<CoordinationAlert[]>([
    {
      id: 'A001',
      type: 'deadline',
      title: 'Title Investigation Due',
      message: 'Title investigation for Fitzgerald Gardens due in 2 days',
      severity: 'warning',
      timestamp: '2025-06-21T10:30:00Z',
      actionRequired: true,
      relatedTransaction: 'T001'
    },
    {
      id: 'A002',
      type: 'communication',
      title: 'Stakeholder Response Needed',
      message: 'Developer solicitor waiting for contract amendments review',
      severity: 'info',
      timestamp: '2025-06-21T09:15:00Z',
      actionRequired: true,
      relatedTransaction: 'T001'
    }
  ]);

  // Analytics data
  const utilizationData = [
    { day: 'Mon', utilization: 85, capacity: 100 },
    { day: 'Tue', utilization: 92, capacity: 100 },
    { day: 'Wed', utilization: 78, capacity: 100 },
    { day: 'Thu', utilization: 88, capacity: 100 },
    { day: 'Fri', utilization: 75, capacity: 100 },
    { day: 'Sat', utilization: 45, capacity: 60 },
    { day: 'Sun', utilization: 20, capacity: 30 }
  ];

  const taskDistribution = [
    { name: 'Legal Review', value: 35, color: '#8884d8' },
    { name: 'Documentation', value: 25, color: '#82ca9d' },
    { name: 'Coordination', value: 20, color: '#ffc658' },
    { name: 'Client Communication', value: 15, color: '#ff7c7c' },
    { name: 'Administrative', value: 5, color: '#8dd1e1' }
  ];

  const performanceTrend = [
    { month: 'Jan', quality: 88, efficiency: 82, satisfaction: 90 },
    { month: 'Feb', quality: 89, efficiency: 84, satisfaction: 91 },
    { month: 'Mar', quality: 91, efficiency: 86, satisfaction: 89 },
    { month: 'Apr', quality: 90, efficiency: 88, satisfaction: 93 },
    { month: 'May', quality: 92, efficiency: 85, satisfaction: 94 },
    { month: 'Jun', quality: 92, efficiency: 87, satisfaction: 95 }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'error': return 'text-red-600 bg-red-50';
      case 'warning': return 'text-orange-600 bg-orange-50';
      case 'info': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Professional Dashboard</h1>
            <p className="text-gray-600">Real-time coordination and analytics</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications ({alerts.length})
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.activeTransactions}</p>
                </div>
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Activity className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div className="mt-2">
                <p className="text-xs text-green-600">+2 from yesterday</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.pendingTasks}</p>
                </div>
                <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="h-4 w-4 text-orange-600" />
                </div>
              </div>
              <div className="mt-2">
                <p className="text-xs text-red-600">+5 from yesterday</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Utilization Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.utilizationRate}%</p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="mt-2">
                <Progress value={metrics.utilizationRate} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Quality Score</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.qualityScore}%</p>
                </div>
                <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Target className="h-4 w-4 text-purple-600" />
                </div>
              </div>
              <div className="mt-2">
                <p className="text-xs text-green-600">+1.2% this week</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
            <TabsTrigger value="coordination">Coordination</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Utilization */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Weekly Utilization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={utilizationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="utilization" fill="#8884d8" />
                      <Bar dataKey="capacity" fill="#e0e0e0" opacity={0.3} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Task Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChartIcon className="h-5 w-5 mr-2" />
                    Task Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={taskDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {taskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Recent Alerts
                  </span>
                  <Badge variant="secondary">{alerts.length} active</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {alerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{alert.title}</h4>
                        <p className="text-sm opacity-90 mt-1">{alert.message}</p>
                        <p className="text-xs opacity-75 mt-2">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {alert.actionRequired && (
                        <Button size="sm" variant="outline">
                          Action Required
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <div className="grid gap-6">
              {transactions.map((transaction) => (
                <Card key={transaction.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{transaction.propertyAddress}</h3>
                        <p className="text-gray-600">{transaction.buyerName}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="outline">{transaction.phase}</Badge>
                          <Badge className={getPriorityColor(transaction.priority)}>
                            {transaction.priority}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            Due: {new Date(transaction.estimatedCompletion).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{transaction.progress}%</div>
                        <Progress value={transaction.progress} className="w-24 mt-1" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Stakeholders</h4>
                        <div className="space-y-2">
                          {transaction.stakeholders.map((stakeholder, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span>{stakeholder.role}: {stakeholder.name}</span>
                              <Badge 
                                variant={
                                  stakeholder.status === 'completed' ? 'default' :
                                  stakeholder.status === 'active' ? 'secondary' : 'outline'
                                }
                              >
                                {stakeholder.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Next Action</h4>
                        <p className="text-sm text-gray-600">{transaction.nextAction}</p>
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-sm">
                            <span>Risk Level</span>
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((level) => (
                                <div
                                  key={level}
                                  className={`w-3 h-3 rounded-full mr-1 ${
                                    level <= transaction.riskLevel ? 'bg-red-500' : 'bg-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="ai-insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  AI-Powered Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{rec.title}</h4>
                          <Badge className={getPriorityColor(rec.priority)}>
                            {rec.priority}
                          </Badge>
                          <Badge variant="outline">
                            {(rec.confidence * 100).toFixed(0)}% confidence
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                        <p className="text-sm font-medium text-green-600 mt-2">
                          Expected Impact: {rec.expectedImpact}
                        </p>
                      </div>
                      <Button size="sm">
                        <Zap className="h-4 w-4 mr-1" />
                        Apply
                      </Button>
                    </div>
                    <div className="mt-3">
                      <h5 className="text-sm font-medium mb-2">Implementation Steps:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {rec.implementation.map((step, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Coordination Tab */}
          <TabsContent value="coordination" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Active Coordination Rooms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Fitzgerald Gardens - Legal Coordination</h4>
                        <p className="text-sm text-gray-600">3 participants active</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Join
                      </Button>
                    </div>
                  </div>
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Riverside Quarter - Multi-stakeholder Review</h4>
                        <p className="text-sm text-gray-600">5 participants active</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Join
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Real-time Activity Feed</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600">2 minutes ago</span>
                    </div>
                    <p className="mt-1">Mortgage broker confirmed approval for Thompson transaction</p>
                  </div>
                  <div className="text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-600">8 minutes ago</span>
                    </div>
                    <p className="mt-1">Title investigation completed for Riverside Quarter</p>
                  </div>
                  <div className="text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-600">15 minutes ago</span>
                    </div>
                    <p className="mt-1">Contract amendments requested by developer solicitor</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={performanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="quality" 
                      stackId="1" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="efficiency" 
                      stackId="2" 
                      stroke="#82ca9d" 
                      fill="#82ca9d" 
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="satisfaction" 
                      stackId="3" 
                      stroke="#ffc658" 
                      fill="#ffc658" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfessionalEcosystemDashboard;