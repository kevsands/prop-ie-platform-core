'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BuildingOfficeIcon,
  CurrencyEuroIcon,
  ChartBarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  HomeIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  InformationCircleIcon,
  BanknotesIcon,
  Square3Stack3DIcon,
  FolderIcon,
  MapPinIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  CogIcon,
  ClipboardDocumentCheckIcon,
  BoltIcon,
  FireIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Calendar } from '@/components/ui/calendar';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  ScatterChart, Scatter, ComposedChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { useDeveloperData } from '@/hooks/useDeveloperData';
import { format, differenceInDays, addMonths } from 'date-fns';
import ProjectOverview from '@/components/projects/ProjectOverview';
import PropertyManagement from '@/components/properties/PropertyManagement';
import FinancialSummary from '@/components/financial/FinancialSummary';
import ConstructionProgress from '@/components/construction/ConstructionProgress';
import ComplianceTracker from '@/components/compliance/ComplianceTracker';
import SalesAnalytics from '@/components/analytics/SalesAnalytics';
import DocumentRepository from '@/components/documents/DocumentRepository';
import TeamManagement from '@/components/team/TeamManagement';
import TaskBoard from '@/components/tasks/TaskBoard';
import CommunicationHub from '@/components/communications/CommunicationHub';
import { toast } from 'sonner';

interface DeveloperDashboardProps {
  developerId?: string;
}

export default function DeveloperDashboard({ developerId }: DeveloperDashboardProps) {
  const { user } = useAuth();
  const { data: developerData, isLoading } = useDeveloperData(developerId || user?.id);
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: addMonths(new Date(), -3),
    to: new Date()
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!developerData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">No developer data found</p>
      </div>
    );
  }

  const {
    developer,
    projects,
    properties,
    finances,
    sales,
    compliance,
    team,
    tasks,
    notifications,
    analytics
  } = developerData;

  const filteredProjects = selectedProject === 'all' 
    ? projects 
    : projects.filter(p => p.id === selectedProject);

  const activeProjects = projects.filter(p => p.status === 'ACTIVE');
  const totalProperties = properties.length;
  const soldProperties = properties.filter(p => p.status === 'SOLD').length;
  const availableProperties = properties.filter(p => p.status === 'AVAILABLE').length;
  const underConstruction = properties.filter(p => p.status === 'UNDER_CONSTRUCTION').length;

  const totalRevenue = finances.totalRevenue;
  const projectedRevenue = finances.projectedRevenue;
  const costs = finances.totalCosts;
  const profit = totalRevenue - costs;
  const profitMargin = (profit / totalRevenue) * 100;

  const complianceScore = compliance.overallScore;
  const complianceIssues = compliance.issues.filter(i => i.status === 'OPEN').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Developer Dashboard</h1>
              <p className="text-gray-600 mt-1">{developer.companyName}</p>
            </div>
            <div className="flex items-center gap-4">
              <DatePickerWithRange 
                date={dateRange}
                onDateChange={setDateRange}
              />
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button>
                <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold">{activeProjects.length}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Progress value={65} className="w-20 h-2" />
                    <span className="text-sm text-gray-600">65% on track</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold">€{totalRevenue.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">+12.5% MoM</span>
                  </div>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CurrencyEuroIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Sales Rate</p>
                  <p className="text-2xl font-bold">{Math.round((soldProperties / totalProperties) * 100)}%</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {soldProperties}/{totalProperties} units sold
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <HomeIcon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Compliance Score</p>
                  <p className="text-2xl font-bold">{complianceScore}%</p>
                  {complianceIssues > 0 && (
                    <p className="text-sm text-red-600 mt-2">
                      {complianceIssues} issues pending
                    </p>
                  )}
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <ShieldCheckIcon className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Critical Alerts */}
        {compliance.criticalIssues.length > 0 && (
          <Alert className="mb-8">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>Critical:</strong> {compliance.criticalIssues[0].title}
              <Button size="sm" variant="link" className="ml-2">
                Review Now
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
            <TabsTrigger value="construction">Construction</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Portfolio Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Portfolio Performance</CardTitle>
                  <CardDescription>Revenue and sales trends across all projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={analytics.monthlyPerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="revenue" fill="#3B82F6" name="Revenue (€)" />
                        <Line 
                          yAxisId="right" 
                          type="monotone" 
                          dataKey="salesRate" 
                          stroke="#10B981" 
                          name="Sales Rate (%)"
                          strokeWidth={2}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analytics.projectStatus}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {analytics.projectStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-2">
                    {analytics.projectStatus.map((status, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: status.color }}
                          />
                          <span className="text-sm">{status.name}</span>
                        </div>
                        <span className="text-sm font-medium">{status.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Projects */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Projects</CardTitle>
                  <Button variant="outline" size="sm">View All</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.slice(0, 3).map(project => (
                    <ProjectOverview key={project.id} project={project} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-4">
                  <Button className="w-full" variant="outline">
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    Generate Reports
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <Button className="w-full" variant="outline">
                    <UserGroupIcon className="h-4 w-4 mr-2" />
                    Team Meeting
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <Button className="w-full" variant="outline">
                    <ClipboardDocumentCheckIcon className="h-4 w-4 mr-2" />
                    Compliance Check
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <Button className="w-full" variant="outline">
                    <TruckIcon className="h-4 w-4 mr-2" />
                    Site Inspection
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <ProjectManagement projects={filteredProjects} />
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <SalesAnalytics 
              sales={sales}
              properties={properties}
              analytics={analytics.salesMetrics}
            />
          </TabsContent>

          <TabsContent value="financials" className="space-y-6">
            <FinancialSummary 
              finances={finances}
              projects={filteredProjects}
            />
          </TabsContent>

          <TabsContent value="construction" className="space-y-6">
            <ConstructionProgress 
              projects={filteredProjects}
              milestones={analytics.constructionMilestones}
            />
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <ComplianceTracker 
              compliance={compliance}
              projects={filteredProjects}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Market Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Market Analysis</CardTitle>
                <CardDescription>Regional performance and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-4">Price Trends by Area</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analytics.priceTrends}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          {analytics.areas.map((area, index) => (
                            <Line 
                              key={area}
                              type="monotone" 
                              dataKey={area} 
                              stroke={['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index % 4]}
                              strokeWidth={2}
                            />
                          ))}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Demand by Property Type</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={analytics.demandByType}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="type" />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} />
                          <Radar 
                            name="Current Demand" 
                            dataKey="demand" 
                            stroke="#3B82F6" 
                            fill="#3B82F6" 
                            fillOpacity={0.6} 
                          />
                          <Radar 
                            name="Supply" 
                            dataKey="supply" 
                            stroke="#10B981" 
                            fill="#10B981" 
                            fillOpacity={0.6} 
                          />
                          <Legend />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key indicators across your portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <h4 className="font-medium mb-2">Average Time to Sale</h4>
                    <p className="text-3xl font-bold text-blue-600">
                      {analytics.averageTimeToSale} days
                    </p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <ArrowTrendingDownIcon className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">-5 days vs last quarter</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <h4 className="font-medium mb-2">Customer Satisfaction</h4>
                    <p className="text-3xl font-bold text-green-600">
                      {analytics.customerSatisfaction}%
                    </p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">+3% improvement</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <h4 className="font-medium mb-2">ROI</h4>
                    <p className="text-3xl font-bold text-purple-600">
                      {analytics.roi}%
                    </p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <BoltIcon className="h-4 w-4 text-purple-600" />
                      <span className="text-sm text-purple-600">Above industry average</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Future Projections */}
            <Card>
              <CardHeader>
                <CardTitle>Future Projections</CardTitle>
                <CardDescription>6-month outlook based on current trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.projections}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="pessimistic" 
                        stackId="1" 
                        stroke="#EF4444" 
                        fill="#FEE2E2" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="realistic" 
                        stackId="1" 
                        stroke="#3B82F6" 
                        fill="#DBEAFE" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="optimistic" 
                        stackId="1" 
                        stroke="#10B981" 
                        fill="#D1FAE5" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}