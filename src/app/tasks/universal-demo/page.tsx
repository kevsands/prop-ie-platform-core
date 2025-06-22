/**
 * Universal Task Management Demo Page
 * 
 * Comprehensive demonstration of the new Universal Task Management system
 * with progressive disclosure, cross-persona coordination, and intelligent
 * task orchestration for the 3,329+ task ecosystem.
 */

'use client';

import React, { useState } from 'react';
import { UserRole } from '@prisma/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Task Management Components
import UniversalTaskManager from '@/components/tasks/UniversalTaskManager';
import SharedTransactionTimeline from '@/components/tasks/SharedTransactionTimeline';
import GanttChart from '@/components/tasks/GanttChart';

// Hooks
import { useUniversalTasks } from '@/hooks/useUniversalTasks';
import { useAuth } from '@/context/AuthContext';

// Icons
import {
  Layers,
  Users,
  Timeline,
  BarChart3,
  Settings,
  Info,
  CheckCircle,
  TrendingUp,
  Clock,
  AlertTriangle
} from 'lucide-react';

// Types
import {
  TaskViewType,
  TaskOrchestrationContext,
  TaskComplexityLevel
} from '@/types/task/universal-task';

export default function UniversalTaskDemoPage() {
  const { user } = useAuth();
  const [selectedPersona, setSelectedPersona] = useState<UserRole>(UserRole.BUYER);
  const [selectedComplexity, setSelectedComplexity] = useState<TaskComplexityLevel>(TaskComplexityLevel.MODERATE);
  const [activeTab, setActiveTab] = useState('tasks');

  // Context override for demonstration
  const contextOverride: Partial<TaskOrchestrationContext> = {
    userRole: selectedPersona,
    skillLevel: selectedComplexity === TaskComplexityLevel.EXPERT ? 'expert' : 
                selectedComplexity === TaskComplexityLevel.SIMPLE ? 'beginner' : 'intermediate',
    preferredComplexity: selectedComplexity,
    workloadCapacity: 70,
    availableHours: 40,
    collaborationPreference: 'collaborative'
  };

  // Use the universal tasks hook
  const {
    tasks,
    filteredView,
    loading,
    error,
    context,
    currentViewType,
    availableViewTypes,
    setViewType,
    createTask,
    updateTask,
    completeTask,
    getProgress,
    getBottlenecks,
    getRecommendations
  } = useUniversalTasks({
    transactionId: 'demo_transaction_123',
    autoRefresh: true,
    enableRealTime: true,
    contextOverride
  });

  const progress = getProgress();
  const bottlenecks = getBottlenecks();
  const recommendations = getRecommendations();

  // Persona information
  const personaInfo = {
    [UserRole.BUYER]: {
      name: 'First-Time Buyer',
      description: 'Purchasing their first property with Help-to-Buy assistance',
      icon: '🏠',
      color: 'bg-blue-500'
    },
    [UserRole.DEVELOPER]: {
      name: 'Property Developer',
      description: 'Managing multiple development projects and sales processes',
      icon: '🏗️',
      color: 'bg-purple-500'
    },
    [UserRole.AGENT]: {
      name: 'Estate Agent',
      description: 'Managing client relationships and property transactions',
      icon: '🤝',
      color: 'bg-green-500'
    },
    [UserRole.SOLICITOR]: {
      name: 'Property Solicitor',
      description: 'Handling legal aspects of property transactions',
      icon: '⚖️',
      color: 'bg-red-500'
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Universal Task Management System
        </h1>
        <p className="text-xl text-gray-600">
          Supporting 3,329+ granular tasks across all property transaction personas
        </p>
        <Badge variant="outline" className="text-lg px-4 py-2">
          Enterprise-Grade Task Orchestration
        </Badge>
      </div>

      {/* Key Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="h-5 w-5" />
            <span>System Capabilities</span>
          </CardTitle>
          <CardDescription>
            Advanced task management with progressive disclosure and intelligent orchestration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Layers className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold">Progressive Disclosure</h3>
              <p className="text-sm text-gray-600">Smart complexity management</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold">Cross-Persona Coordination</h3>
              <p className="text-sm text-gray-600">Seamless collaboration</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Timeline className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h3 className="font-semibold">Real-Time Orchestration</h3>
              <p className="text-sm text-gray-600">AI-powered task routing</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <BarChart3 className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <h3 className="font-semibold">Enterprise Analytics</h3>
              <p className="text-sm text-gray-600">Performance insights</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Demo Configuration</span>
          </CardTitle>
          <CardDescription>
            Switch between different personas and complexity levels to see how the system adapts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                User Persona
              </label>
              <Select value={selectedPersona} onValueChange={(value) => setSelectedPersona(value as UserRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(personaInfo).map(([role, info]) => (
                    <SelectItem key={role} value={role}>
                      <div className="flex items-center space-x-2">
                        <span>{info.icon}</span>
                        <span>{info.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-600 mt-1">
                {personaInfo[selectedPersona].description}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Complexity Level
              </label>
              <Select value={selectedComplexity} onValueChange={(value) => setSelectedComplexity(value as TaskComplexityLevel)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TaskComplexityLevel.SIMPLE}>Simple - Beginner User</SelectItem>
                  <SelectItem value={TaskComplexityLevel.MODERATE}>Moderate - Intermediate User</SelectItem>
                  <SelectItem value={TaskComplexityLevel.COMPLEX}>Complex - Advanced User</SelectItem>
                  <SelectItem value={TaskComplexityLevel.EXPERT}>Expert - Professional User</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-600 mt-1">
                Controls task visibility and detail level
              </p>
            </div>
          </div>

          {/* Current Context Display */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Current Context</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Persona:</span>
                <br />
                <Badge variant="outline">{personaInfo[selectedPersona].name}</Badge>
              </div>
              <div>
                <span className="text-gray-600">Skill Level:</span>
                <br />
                <Badge variant="outline">{context.skillLevel}</Badge>
              </div>
              <div>
                <span className="text-gray-600">View Types:</span>
                <br />
                <Badge variant="outline">{availableViewTypes.length} available</Badge>
              </div>
              <div>
                <span className="text-gray-600">Workload:</span>
                <br />
                <Badge variant="outline">{context.workloadCapacity}% capacity</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold">{progress.total}</p>
              </div>
              <Layers className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{progress.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-2xl font-bold text-blue-600">{Math.round(progress.percentage)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bottlenecks</p>
                <p className="text-2xl font-bold text-red-600">{bottlenecks.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tasks" className="flex items-center space-x-2">
            <Layers className="h-4 w-4" />
            <span>Task Management</span>
          </TabsTrigger>
          <TabsTrigger value="gantt" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Gantt Chart</span>
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center space-x-2">
            <Timeline className="h-4 w-4" />
            <span>Transaction Timeline</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics & Insights</span>
          </TabsTrigger>
        </TabsList>

        {/* Task Management Tab */}
        <TabsContent value="tasks" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Task Management</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">View Type:</span>
              <Select value={currentViewType} onValueChange={(value) => setViewType(value as TaskViewType)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableViewTypes.map(viewType => (
                    <SelectItem key={viewType} value={viewType}>
                      {viewType.replace('_', ' ').toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Progressive Disclosure Explanation */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Progressive Disclosure in Action</AlertTitle>
            <AlertDescription>
              The system automatically adjusts task complexity and visibility based on your selected persona 
              and skill level. {selectedPersona === UserRole.BUYER ? 'As a buyer, you see simplified milestone views.' : 
              selectedPersona === UserRole.DEVELOPER ? 'As a developer, you have access to comprehensive project management views.' :
              selectedPersona === UserRole.AGENT ? 'As an agent, you see client-focused task management.' :
              'As a solicitor, you have detailed legal workflow views.'} 
              {filteredView?.hiddenTaskCount && filteredView.hiddenTaskCount > 0 && 
                ` Currently hiding ${filteredView.hiddenTaskCount} tasks to reduce complexity.`}
            </AlertDescription>
          </Alert>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <UniversalTaskManager
            initialTasks={tasks}
            contextOverride={contextOverride}
            defaultViewType={currentViewType}
            enableRealTimeUpdates={true}
            showAnalytics={true}
          />
        </TabsContent>

        {/* Gantt Chart Tab */}
        <TabsContent value="gantt" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Enterprise Gantt Chart</h2>
            <Badge variant="outline">Critical Path & Dependency Analysis</Badge>
          </div>

          <Alert>
            <Calendar className="h-4 w-4" />
            <AlertTitle>Advanced Project Management</AlertTitle>
            <AlertDescription>
              Enterprise-grade Gantt chart with critical path method (CPM), dependency mapping,
              and real-time collaboration. Automatically calculates task relationships and identifies
              bottlenecks across all personas.
            </AlertDescription>
          </Alert>

          <GanttChart
            tasks={tasks}
            context={context}
            onTaskUpdate={(taskId, updates) => {
              updateTask(taskId, updates);
            }}
            onTaskClick={(task) => console.log('Gantt task clicked:', task)}
            showPersonaLanes={true}
            allowDragDrop={context.userRole !== UserRole.BUYER}
            height={700}
            className="w-full"
          />
        </TabsContent>

        {/* Transaction Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Transaction Timeline</h2>
            <Badge variant="outline">Cross-Persona Coordination</Badge>
          </div>

          <Alert>
            <Users className="h-4 w-4" />
            <AlertTitle>Collaborative Transaction Management</AlertTitle>
            <AlertDescription>
              This timeline shows how tasks and handoffs flow between different personas throughout 
              the property transaction. Each phase highlights the primary responsible party and 
              collaborating stakeholders.
            </AlertDescription>
          </Alert>

          <SharedTransactionTimeline
            transactionId="demo_transaction_123"
            tasks={tasks}
            currentUser={context}
            onTaskClick={(task) => console.log('Task clicked:', task)}
            onHandoffClick={(handoff) => console.log('Handoff clicked:', handoff)}
            onCommunicationClick={(event) => console.log('Communication clicked:', event)}
            showAllPersonas={true}
            compactView={false}
          />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Analytics & Insights</h2>
            <Badge variant="outline">AI-Powered Recommendations</Badge>
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>AI Recommendations</CardTitle>
                <CardDescription>
                  Intelligent suggestions based on your current workload and transaction progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">{rec.type?.replace(/_/g, ' ')}</p>
                        <p className="text-sm text-blue-700">{rec.description}</p>
                        {rec.confidence && (
                          <p className="text-xs text-blue-600 mt-1">Confidence: {rec.confidence}%</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Progress Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Progress Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completed Tasks</span>
                    <span className="font-medium">{progress.completed}/{progress.total}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">In Progress</span>
                    <span className="font-medium">{progress.inProgress}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Blocked</span>
                    <span className="font-medium text-red-600">{progress.blocked}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Overdue</span>
                    <span className="font-medium text-orange-600">{progress.overdue}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estimated Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-blue-600">
                    {progress.estimatedCompletion.toLocaleDateString()}
                  </div>
                  <p className="text-sm text-gray-600">
                    Based on current progress and AI predictions
                  </p>
                  <div className="text-sm">
                    <Clock className="h-4 w-4 inline mr-1" />
                    {Math.ceil((progress.estimatedCompletion.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Task Complexity Distribution */}
          {filteredView?.complexityDistribution && (
            <Card>
              <CardHeader>
                <CardTitle>Task Complexity Distribution</CardTitle>
                <CardDescription>
                  Breakdown of visible tasks by complexity level for current persona
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array.from(filteredView.complexityDistribution.entries()).map(([complexity, count]) => (
                    <div key={complexity} className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold">{count}</div>
                      <div className="text-sm text-gray-600 capitalize">
                        {complexity.toLowerCase()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Technical Details */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Highlights</CardTitle>
          <CardDescription>
            Key technical achievements in this Universal Task Management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Progressive Disclosure Service</h4>
              <p className="text-sm text-gray-600">
                Intelligent filtering and grouping based on persona and skill level
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Universal Task Manager</h4>
              <p className="text-sm text-gray-600">
                Centralized orchestration with existing TaskOrchestrationEngine integration
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Cross-Persona Coordination</h4>
              <p className="text-sm text-gray-600">
                Shared timelines with handoff visualization and bottleneck detection
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Real-Time Orchestration</h4>
              <p className="text-sm text-gray-600">
                WebSocket integration for live updates and collaboration
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">AI-Powered Insights</h4>
              <p className="text-sm text-gray-600">
                Intelligent recommendations and predictive analytics
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Enterprise Scalability</h4>
              <p className="text-sm text-gray-600">
                Supporting 3,329+ tasks with production-ready architecture
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}