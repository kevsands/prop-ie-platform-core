'use client';

import { useState } from 'react';
import Link from 'next/link';
import PlatformShell from '@/components/layout/PlatformShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building,
  Scale,
  Ruler,
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  ArrowRight,
  Activity,
  Home,
  Package,
  UserCheck,
  MessageSquare,
  Eye,
  Briefcase
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function PlatformDashboard() {
  const [timeRangesetTimeRange] = useState('week');

  // Mock data for charts
  const transactionData = [
    { month: 'Jan', estate: 45, legal: 38, architect: 22 },
    { month: 'Feb', estate: 52, legal: 42, architect: 25 },
    { month: 'Mar', estate: 61, legal: 45, architect: 28 },
    { month: 'Apr', estate: 58, legal: 50, architect: 32 },
    { month: 'May', estate: 69, legal: 54, architect: 35 },
    { month: 'Jun', estate: 75, legal: 59, architect: 38 }
  ];

  const revenueData = [
    { name: 'Week 1', revenue: 125000 },
    { name: 'Week 2', revenue: 145000 },
    { name: 'Week 3', revenue: 132000 },
    { name: 'Week 4', revenue: 168000 }
  ];

  const moduleUsage = [
    { name: 'Estate Agency', value: 45, color: '#3B82F6' },
    { name: 'Legal Services', value: 30, color: '#10B981' },
    { name: 'Architecture', value: 25, color: '#8B5CF6' }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'property',
      action: 'New property listed',
      detail: 'Riverside Development - Unit 45',
      time: '5 minutes ago',
      icon: Home,
      color: 'blue'
    },
    {
      id: 2,
      type: 'legal',
      action: 'Contract signed',
      detail: 'Purchase agreement for 123 Main St',
      time: '1 hour ago',
      icon: FileText,
      color: 'green'
    },
    {
      id: 3,
      type: 'architecture',
      action: 'Design approved',
      detail: 'Phase 2 of Fitzgerald Gardens',
      time: '2 hours ago',
      icon: CheckCircle,
      color: 'purple'
    },
    {
      id: 4,
      type: 'user',
      action: 'New client registered',
      detail: 'Sarah O\'Connor - First-time buyer',
      time: '3 hours ago',
      icon: UserCheck,
      color: 'yellow'
    },
    {
      id: 5,
      type: 'offer',
      action: 'Offer received',
      detail: '€425,000 for Unit 12B',
      time: '4 hours ago',
      icon: DollarSign,
      color: 'green'
    }
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: 'Property viewing - Ballymakenny View',
      dueDate: 'Today, 2:00 PM',
      priority: 'high',
      module: 'estate'
    },
    {
      id: 2,
      title: 'Contract review deadline',
      dueDate: 'Tomorrow, 10:00 AM',
      priority: 'medium',
      module: 'legal'
    },
    {
      id: 3,
      title: 'Site inspection report',
      dueDate: 'Thursday, 3:00 PM',
      priority: 'low',
      module: 'architecture'
    }
  ];

  const kpis = [
    {
      title: 'Total Revenue',
      value: '€2.4M',
      change: '+12%',
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Active Transactions',
      value: '156',
      change: '+8%',
      trend: 'up',
      icon: Activity,
      color: 'blue'
    },
    {
      title: 'Completion Rate',
      value: '94%',
      change: '+3%',
      trend: 'up',
      icon: CheckCircle,
      color: 'purple'
    },
    {
      title: 'User Satisfaction',
      value: '4.8/5',
      change: '+0.2',
      trend: 'up',
      icon: Users,
      color: 'yellow'
    }
  ];

  return (
    <PlatformShell>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, John
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Here's what's happening across your property platform today
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              View Schedule
            </Button>
            <Button>
              <Building className="h-4 w-4 mr-2" />
              Quick Action
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <Card key={kpi.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <kpi.icon className={`h-4 w-4 text-${kpi.color}-500`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className={`text-xs ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                  <TrendingUp className={`h-3 w-3 mr-1 ${kpi.trend === 'down' ? 'rotate-180' : ''}`} />
                  {kpi.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Volume by Module</CardTitle>
              <CardDescription>Monthly transaction trends across all services</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={transactionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="estate" stroke="#3B82F6" name="Estate Agency" />
                  <Line type="monotone" dataKey="legal" stroke="#10B981" name="Legal Services" />
                  <Line type="monotone" dataKey="architect" stroke="#8B5CF6" name="Architecture" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Weekly revenue performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `€${value.toLocaleString()}`} />
                  <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Activity and Tasks */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Module Usage */}
          <Card>
            <CardHeader>
              <CardTitle>Module Usage</CardTitle>
              <CardDescription>Distribution of platform activity</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={moduleUsage}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {moduleUsage.map((entryindex) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {moduleUsage.map((module) => (
                  <div key={module.name} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full`} style={ backgroundColor: module.color } />
                      <span className="text-sm">{module.name}</span>
                    </div>
                    <span className="text-sm font-medium">{module.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates across all modules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg bg-${activity.color}-100 dark:bg-${activity.color}-900/20`}>
                      <activity.icon className={`h-5 w-5 text-${activity.color}-600 dark:text-${activity.color}-400`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{activity.detail}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <Building className="h-8 w-8 text-blue-500 mb-2" />
              <CardTitle>Estate Agency</CardTitle>
              <CardDescription>Manage properties and clients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Active Listings</span>
                  <span className="font-medium">42</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Pending Viewings</span>
                  <span className="font-medium">15</span>
                </div>
              </div>
              <Link href="/agent/dashboard">
                <Button className="w-full mt-4" variant="outline">
                  Open Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <Scale className="h-8 w-8 text-green-500 mb-2" />
              <CardTitle>Legal Services</CardTitle>
              <CardDescription>Conveyancing and compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Active Cases</span>
                  <span className="font-medium">28</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Documents Pending</span>
                  <span className="font-medium">7</span>
                </div>
              </div>
              <Link href="/solicitor/dashboard">
                <Button className="w-full mt-4" variant="outline">
                  Open Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <Ruler className="h-8 w-8 text-purple-500 mb-2" />
              <CardTitle>Architecture</CardTitle>
              <CardDescription>Design and collaboration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Active Projects</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Pending Reviews</span>
                  <span className="font-medium">4</span>
                </div>
              </div>
              <Link href="/architect/dashboard">
                <Button className="w-full mt-4" variant="outline">
                  Open Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Important tasks requiring your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      task.priority === 'high' ? 'bg-red-500' :
                      task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <div>
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-gray-600">{task.dueDate}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{task.module}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PlatformShell>
  );
}