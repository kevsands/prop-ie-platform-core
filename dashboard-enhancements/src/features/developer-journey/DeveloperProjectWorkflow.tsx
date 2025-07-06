'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircleIcon, 
  DocumentTextIcon,
  HomeIcon,
  BanknotesIcon,
  UserGroupIcon,
  ChartBarIcon,
  DocumentCheckIcon,
  TruckIcon
} from '@heroicons/react/24/outline';

interface ProjectPhase {
  id: string;
  name: string;
  icon: React.ReactNode;
  status: 'completed' | 'active' | 'upcoming';
  progress: number;
  tasks: ProjectTask[];
  description: string;
  estimatedDuration: string;
}

interface ProjectTask {
  id: string;
  title: string;
  status: 'completed' | 'in-progress' | 'pending';
  assignee?: string;
  dueDate?: string;
  priority: 'high' | 'medium' | 'low';
}

interface ProjectMetrics {
  totalUnits: number;
  soldUnits: number;
  reservedUnits: number;
  availableUnits: number;
  totalRevenue: number;
  projectedRevenue: number;
  completionPercentage: number;
}

export function DeveloperProjectWorkflow({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [activePhase, setActivePhase] = useState<string>('planning');
  const [projectMetrics, setProjectMetrics] = useState<ProjectMetrics>({
    totalUnits: 100,
    soldUnits: 45,
    reservedUnits: 20,
    availableUnits: 35,
    totalRevenue: 15750000,
    projectedRevenue: 35000000,
    completionPercentage: 65
  });

  const phases: ProjectPhase[] = [
    {
      id: 'planning',
      name: 'Planning & Design',
      icon: <DocumentTextIcon className="h-5 w-5" />,
      status: 'completed',
      progress: 100,
      description: 'Initial project planning, architectural design, and permit acquisition',
      estimatedDuration: '3-6 months',
      tasks: [
        { id: '1', title: 'Site analysis completed', status: 'completed', priority: 'high' },
        { id: '2', title: 'Architectural plans finalized', status: 'completed', priority: 'high' },
        { id: '3', title: 'Planning permission obtained', status: 'completed', priority: 'high' },
        { id: '4', title: 'Environmental impact assessment', status: 'completed', priority: 'medium' }
      ]
    },
    {
      id: 'construction',
      name: 'Construction',
      icon: <TruckIcon className="h-5 w-5" />,
      status: 'active',
      progress: 65,
      description: 'Site development and building construction',
      estimatedDuration: '18-24 months',
      tasks: [
        { id: '5', title: 'Foundation work', status: 'completed', priority: 'high' },
        { id: '6', title: 'Structural framework', status: 'completed', priority: 'high' },
        { id: '7', title: 'Utilities installation', status: 'in-progress', priority: 'high', dueDate: '2024-03-15' },
        { id: '8', title: 'Interior finishing', status: 'in-progress', priority: 'medium', dueDate: '2024-04-01' },
        { id: '9', title: 'Landscaping', status: 'pending', priority: 'low' }
      ]
    },
    {
      id: 'marketing',
      name: 'Marketing & Sales',
      icon: <ChartBarIcon className="h-5 w-5" />,
      status: 'active',
      progress: 45,
      description: 'Property marketing, sales, and customer engagement',
      estimatedDuration: 'Ongoing',
      tasks: [
        { id: '10', title: 'Marketing campaign launch', status: 'completed', priority: 'high' },
        { id: '11', title: 'Show house preparation', status: 'in-progress', priority: 'high', dueDate: '2024-02-20' },
        { id: '12', title: 'Sales team training', status: 'completed', priority: 'medium' },
        { id: '13', title: 'Digital marketing optimization', status: 'in-progress', priority: 'medium' }
      ]
    },
    {
      id: 'legal',
      name: 'Legal & Compliance',
      icon: <DocumentCheckIcon className="h-5 w-5" />,
      status: 'active',
      progress: 30,
      description: 'Legal documentation, contracts, and regulatory compliance',
      estimatedDuration: 'Ongoing',
      tasks: [
        { id: '14', title: 'Sales contracts preparation', status: 'completed', priority: 'high' },
        { id: '15', title: 'Compliance documentation', status: 'in-progress', priority: 'high' },
        { id: '16', title: 'Warranty documentation', status: 'pending', priority: 'medium' },
        { id: '17', title: 'Handover procedures', status: 'pending', priority: 'medium' }
      ]
    },
    {
      id: 'financial',
      name: 'Financial Management',
      icon: <BanknotesIcon className="h-5 w-5" />,
      status: 'active',
      progress: 55,
      description: 'Budget management, revenue tracking, and financial reporting',
      estimatedDuration: 'Ongoing',
      tasks: [
        { id: '18', title: 'Monthly budget review', status: 'in-progress', priority: 'high', dueDate: '2024-02-28' },
        { id: '19', title: 'Revenue forecasting', status: 'completed', priority: 'high' },
        { id: '20', title: 'Investor reporting', status: 'pending', priority: 'medium', dueDate: '2024-03-01' },
        { id: '21', title: 'Cost optimization analysis', status: 'in-progress', priority: 'medium' }
      ]
    },
    {
      id: 'delivery',
      name: 'Delivery & Handover',
      icon: <HomeIcon className="h-5 w-5" />,
      status: 'upcoming',
      progress: 0,
      description: 'Final inspections, customer handover, and post-sale support',
      estimatedDuration: '3-6 months',
      tasks: [
        { id: '22', title: 'Quality inspections', status: 'pending', priority: 'high' },
        { id: '23', title: 'Snagging process', status: 'pending', priority: 'high' },
        { id: '24', title: 'Customer handover', status: 'pending', priority: 'high' },
        { id: '25', title: 'After-sales support setup', status: 'pending', priority: 'medium' }
      ]
    }
  ];

  const getPhaseStatus = (phase: ProjectPhase) => {
    const statusColors = {
      completed: 'text-green-600 bg-green-50',
      active: 'text-blue-600 bg-blue-50',
      upcoming: 'text-gray-600 bg-gray-50'
    };
    return statusColors[phase.status];
  };

  const getTaskPriorityColor = (priority: string) => {
    const colors = {
      high: 'destructive',
      medium: 'secondary',
      low: 'outline'
    };
    return colors[priority as keyof typeof colors] || 'outline';
  };

  const overallProgress = phases.reduce((acc, phase) => acc + phase.progress, 0) / phases.length;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Project Overview */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">FitzGerald Gardens - Project Dashboard</h1>
        <p className="text-gray-600">Comprehensive project management and tracking</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Total Units</p>
              <p className="text-2xl font-bold">{projectMetrics.totalUnits}</p>
            </div>
            <HomeIcon className="h-8 w-8 text-gray-400" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Units Sold</p>
              <p className="text-2xl font-bold text-green-600">{projectMetrics.soldUnits}</p>
              <p className="text-xs text-gray-500">{projectMetrics.reservedUnits} reserved</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-400" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-2xl font-bold">€{(projectMetrics.totalRevenue / 1000000).toFixed(1)}M</p>
              <p className="text-xs text-gray-500">of €{(projectMetrics.projectedRevenue / 1000000).toFixed(1)}M</p>
            </div>
            <BanknotesIcon className="h-8 w-8 text-gray-400" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Completion</p>
              <p className="text-2xl font-bold">{projectMetrics.completionPercentage}%</p>
              <Progress value={projectMetrics.completionPercentage} className="h-1 mt-2" />
            </div>
            <ChartBarIcon className="h-8 w-8 text-gray-400" />
          </div>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card className="mb-8 p-6">
        <h2 className="text-xl font-semibold mb-4">Overall Project Progress</h2>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">All Phases</span>
          <span className="text-sm font-medium">{Math.round(overallProgress)}%</span>
        </div>
        <Progress value={overallProgress} className="h-3" />
      </Card>

      {/* Phase Management */}
      <Card className="p-6">
        <Tabs defaultValue="planning" value={activePhase} onValueChange={setActivePhase}>
          <TabsList className="grid w-full grid-cols-6">
            {phases.map(phase => (
              <TabsTrigger key={phase.id} value={phase.id} className="relative">
                <div className="flex items-center gap-1">
                  {phase.icon}
                  <span className="hidden lg:inline">{phase.name}</span>
                  {phase.status === 'active' && (
                    <div className="absolute -top-1 -right-1 h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
                  )}
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {phases.map(phase => (
            <TabsContent key={phase.id} value={phase.id} className="mt-6">
              <div className="space-y-6">
                {/* Phase Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      {phase.icon}
                      {phase.name}
                      <Badge className={getPhaseStatus(phase)}>
                        {phase.status}
                      </Badge>
                    </h3>
                    <p className="text-gray-600 mt-1">{phase.description}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Estimated Duration: {phase.estimatedDuration}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{phase.progress}%</p>
                    <p className="text-sm text-gray-600">Complete</p>
                  </div>
                </div>

                {/* Phase Progress */}
                <Progress value={phase.progress} className="h-2" />

                {/* Tasks */}
                <div>
                  <h4 className="font-medium mb-3">Tasks</h4>
                  <div className="space-y-3">
                    {phase.tasks.map(task => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {task.status === 'completed' ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                          ) : task.status === 'in-progress' ? (
                            <div className="h-5 w-5 border-2 border-blue-500 rounded-full animate-pulse" />
                          ) : (
                            <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
                          )}
                          <div>
                            <p className="font-medium">{task.title}</p>
                            {task.dueDate && (
                              <p className="text-sm text-gray-600">Due: {task.dueDate}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getTaskPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          {task.assignee && (
                            <span className="text-sm text-gray-600">{task.assignee}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Phase Actions */}
                <div className="flex gap-3">
                  <Button variant="outline">
                    View Detailed Report
                  </Button>
                  <Button>
                    Manage Tasks
                  </Button>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Card>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-3">
            <UserGroupIcon className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">Team Management</h3>
              <p className="text-sm text-gray-600">Manage project team and assignments</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-3">
            <DocumentTextIcon className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">Documentation</h3>
              <p className="text-sm text-gray-600">Access project documents and reports</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-3">
            <ChartBarIcon className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">Analytics</h3>
              <p className="text-sm text-gray-600">View detailed project analytics</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}