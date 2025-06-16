'use client';

import React, { useState, useEffect } from 'react';
import useProjectData from '@/hooks/useProjectData';
import { 
  Building2, 
  TrendingUp, 
  Home, 
  Users, 
  Calendar, 
  DollarSign, 
  BarChart3, 
  Target, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Eye, 
  Filter, 
  Download, 
  Plus, 
  Bell, 
  MapPin, 
  Zap, 
  Award, 
  Briefcase,
  CreditCard,
  PieChart,
  Activity,
  Smartphone,
  Globe,
  Shield,
  Heart,
  FileText,
  Settings,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Layers,
  GitBranch,
  Flag,
  BarChart2,
  Triangle,
  Circle,
  Square
} from 'lucide-react';
import Link from 'next/link';

export default function DeveloperDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [selectedProject, setSelectedProject] = useState('all');
  
  // Real enterprise data integration
  const fitzgeraldData = useProjectData('fitzgerald-gardens');
  const ellwoodData = useProjectData('ellwood');
  const ballymakenny = useProjectData('ballymakenny-view');

  // Enhanced mock data for enterprise dashboard
  const dashboardData = {
    overview: {
      totalProjects: 3,
      activeProjects: 1, // Only Fitzgerald Gardens is active for sales
      completedProjects: 2, // Ellwood and Ballymakenny are essentially complete
      totalUnits: (fitzgeraldData.totalUnits || 15) + (ellwoodData.totalUnits || 46) + (ballymakenny.totalUnits || 20),
      soldUnits: (fitzgeraldData.soldUnits || 0) + (ellwoodData.soldUnits || 46) + (ballymakenny.soldUnits || 19),
      reservedUnits: (fitzgeraldData.reservedUnits || 0) + (ellwoodData.reservedUnits || 0) + (ballymakenny.reservedUnits || 1),
      availableUnits: (fitzgeraldData.availableUnits || 15) + (ellwoodData.availableUnits || 0) + (ballymakenny.availableUnits || 0),
      totalRevenue: (fitzgeraldData.totalRevenue || 0) + (ellwoodData.totalRevenue || 18500000) + (ballymakenny.totalRevenue || 7600000),
      monthlyRevenue: 0, // No current sales yet for Fitzgerald Gardens
      totalInvestment: 45000000, // Estimated total investment
      roi: 57.8, // Based on actual revenue vs investment
      averageUnitPrice: 320000, // Weighted average across all projects
      salesVelocity: 0, // Will increase once Fitzgerald Gardens sales begin
      constructionProgress: 87, // Weighted average across projects
      htbClaims: 35, // Total HTB claims across all projects
      activeBuyers: 15, // Currently potential buyers for Fitzgerald Gardens
      pendingDeals: 0 // All deals completed for Ellwood/Ballymakenny
    },
    recentActivity: [
      { id: 1, type: 'milestone', message: 'Fitzgerald Gardens Phase 1 launched - 15 units available', time: '1 hour ago', value: null },
      { id: 2, type: 'sale', message: 'Final unit completed at Ballymakenny View (19/20 sold)', time: '2 days ago', value: '€385,000' },
      { id: 3, type: 'milestone', message: 'Ellwood project completed - All 46 units sold', time: '3 days ago', value: '€18.5M' },
      { id: 4, type: 'production', message: 'Platform ready for live sales transactions', time: '1 week ago', value: null },
      { id: 5, type: 'preparation', message: 'Sales management system activated', time: '1 week ago', value: null }
    ],
    projects: [
      {
        id: 'fitzgerald-gardens',
        name: 'Fitzgerald Gardens',
        location: 'Cork, Ireland',
        status: 'LIVE PRODUCTION',
        progress: fitzgeraldData.project?.timeline?.progressPercentage || 68,
        totalUnits: fitzgeraldData.totalUnits || 15,
        soldUnits: fitzgeraldData.soldUnits || 0,
        reservedUnits: fitzgeraldData.reservedUnits || 0,
        availableUnits: fitzgeraldData.availableUnits || 15,
        revenue: fitzgeraldData.totalRevenue || 0,
        targetCompletion: '2025-08-15',
        phase: 'Phase 1 - 15 Units Available',
        image: '/api/placeholder/300/200'
      },
      {
        id: 'ellwood',
        name: 'Ellwood',
        location: 'Dublin, Ireland',
        status: 'SOLD OUT',
        progress: 100,
        totalUnits: ellwoodData.totalUnits || 46,
        soldUnits: ellwoodData.soldUnits || 46,
        reservedUnits: ellwoodData.reservedUnits || 0,
        availableUnits: ellwoodData.availableUnits || 0,
        revenue: ellwoodData.totalRevenue || 18500000,
        targetCompletion: 'COMPLETED',
        phase: 'Completed - All Units Sold',
        image: '/api/placeholder/300/200'
      },
      {
        id: 'ballymakenny-view',
        name: 'Ballymakenny View',
        location: 'Drogheda, Ireland',
        status: '19/20 SOLD',
        progress: 95,
        totalUnits: ballymakenny.totalUnits || 20,
        soldUnits: ballymakenny.soldUnits || 19,
        reservedUnits: ballymakenny.reservedUnits || 1,
        availableUnits: ballymakenny.availableUnits || 0,
        revenue: ballymakenny.totalRevenue || 7600000,
        targetCompletion: '2024-09-15',
        phase: 'Near Completion',
        image: '/api/placeholder/300/200'
      }
    ],
    salesMetrics: {
      thisMonth: { sold: 8, revenue: 3200000, growth: 12.5 },
      lastMonth: { sold: 7, revenue: 2850000, growth: 8.2 },
      thisQuarter: { sold: 23, revenue: 9500000, growth: 15.3 },
      yearToDate: { sold: 97, revenue: 42800000, growth: 18.7 }
    },
    financialMetrics: {
      totalInvestment: 58500000,
      totalRevenue: 42800000,
      grossProfit: 15300000,
      netProfit: 12200000,
      roi: 18.5,
      cashFlow: 2800000,
      outstandingPayments: 450000,
      monthlyBurnRate: 1200000
    },
    teamMetrics: {
      totalTeamMembers: 47,
      contractors: 23,
      inHouse: 24,
      activeTasks: 156,
      completedTasks: 892,
      efficiency: 94.2
    },
    criticalPath: {
      summary: {
        totalTasks: 156,
        criticalTasks: 23,
        overdueTasks: 3,
        atRiskTasks: 8,
        onTrackTasks: 12,
        projectHealth: 85.3,
        estimatedDelay: 2.5 // weeks
      },
      tasks: [
        {
          id: 'CP001',
          name: 'Planning Permission Approval',
          project: 'Ellwood',
          phase: 'Pre-Construction',
          taskType: 'milestone',
          priority: 'critical',
          status: 'at_risk',
          startDate: '2025-05-15',
          endDate: '2025-07-15',
          duration: 61,
          progress: 75,
          assignee: 'Mary O\'Sullivan',
          assigneeRole: 'Planning Consultant',
          dependencies: ['CP002', 'CP003'],
          predecessors: [],
          successors: ['CP004', 'CP005'],
          resourceHours: 240,
          cost: 18500,
          notes: 'Awaiting final committee review. May require additional environmental impact assessment.',
          lastUpdate: '2025-06-14'
        },
        {
          id: 'CP002',
          name: 'Foundation Design Completion',
          project: 'Fitzgerald Gardens',
          phase: 'Design',
          taskType: 'deliverable',
          priority: 'critical',
          status: 'overdue',
          startDate: '2025-04-01',
          endDate: '2025-06-15',
          duration: 75,
          progress: 88,
          assignee: 'Michael Walsh',
          assigneeRole: 'Structural Engineer',
          dependencies: ['CP006'],
          predecessors: ['CP007'],
          successors: ['CP008'],
          resourceHours: 180,
          cost: 12500,
          notes: 'Delayed due to soil analysis complications. Engineering review in progress.',
          lastUpdate: '2025-06-13'
        },
        {
          id: 'CP003',
          name: 'Contractor Procurement',
          project: 'Ballymakenny View',
          phase: 'Procurement',
          taskType: 'process',
          priority: 'high',
          status: 'on_track',
          startDate: '2025-06-01',
          endDate: '2025-07-01',
          duration: 30,
          progress: 45,
          assignee: 'David Ryan',
          assigneeRole: 'Project Manager',
          dependencies: [],
          predecessors: ['CP009'],
          successors: ['CP010'],
          resourceHours: 120,
          cost: 5500,
          notes: 'Tender responses received. Evaluation in progress.',
          lastUpdate: '2025-06-14'
        },
        {
          id: 'CP004',
          name: 'Site Preparation',
          project: 'Fitzgerald Gardens',
          phase: 'Construction',
          taskType: 'work_package',
          priority: 'critical',
          status: 'pending',
          startDate: '2025-07-01',
          endDate: '2025-08-15',
          duration: 45,
          progress: 0,
          assignee: 'Patrick Murphy',
          assigneeRole: 'Site Manager',
          dependencies: ['CP002'],
          predecessors: ['CP002'],
          successors: ['CP011'],
          resourceHours: 360,
          cost: 45000,
          notes: 'Waiting for foundation design completion.',
          lastUpdate: '2025-06-14'
        },
        {
          id: 'CP005',
          name: 'Utility Connections',
          project: 'Ellwood',
          phase: 'Infrastructure',
          taskType: 'work_package',
          priority: 'high',
          status: 'at_risk',
          startDate: '2025-06-20',
          endDate: '2025-08-20',
          duration: 61,
          progress: 15,
          assignee: 'Lisa Connolly',
          assigneeRole: 'QS Surveyor',
          dependencies: ['CP001'],
          predecessors: ['CP001'],
          successors: ['CP012'],
          resourceHours: 200,
          cost: 28000,
          notes: 'ESB connection approval pending. May impact timeline.',
          lastUpdate: '2025-06-12'
        },
        {
          id: 'CP006',
          name: 'Environmental Impact Assessment',
          project: 'Ballymakenny View',
          phase: 'Compliance',
          taskType: 'assessment',
          priority: 'medium',
          status: 'completed',
          startDate: '2025-03-01',
          endDate: '2025-05-01',
          duration: 61,
          progress: 100,
          assignee: 'Dr. James Mitchell',
          assigneeRole: 'Environmental Consultant',
          dependencies: [],
          predecessors: [],
          successors: ['CP013'],
          resourceHours: 160,
          cost: 15500,
          notes: 'Assessment approved with minor recommendations.',
          lastUpdate: '2025-05-02'
        }
      ]
    }
  };

  const timeframes = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'construction':
        return 'bg-blue-100 text-blue-800';
      case 'pre-construction':
        return 'bg-amber-100 text-amber-800';
      case 'completion':
        return 'bg-green-100 text-green-800';
      case 'planning':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatCompactCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `€${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `€${(amount / 1000).toFixed(0)}K`;
    }
    return formatCurrency(amount);
  };

  const getTaskStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'on_track':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'at_risk':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTaskStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle size={14} className="text-green-600" />;
      case 'on_track':
        return <Clock size={14} className="text-blue-600" />;
      case 'at_risk':
        return <AlertTriangle size={14} className="text-amber-600" />;
      case 'overdue':
        return <AlertCircle size={14} className="text-red-600" />;
      case 'pending':
        return <Circle size={14} className="text-gray-600" />;
      default:
        return <Circle size={14} className="text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical':
        return 'text-red-600';
      case 'high':
        return 'text-amber-600';
      case 'medium':
        return 'text-blue-600';
      case 'low':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTaskTypeIcon = (taskType: string) => {
    switch (taskType.toLowerCase()) {
      case 'milestone':
        return <Flag size={14} className="text-purple-600" />;
      case 'deliverable':
        return <FileText size={14} className="text-blue-600" />;
      case 'work_package':
        return <Briefcase size={14} className="text-green-600" />;
      case 'process':
        return <GitBranch size={14} className="text-amber-600" />;
      case 'assessment':
        return <BarChart2 size={14} className="text-indigo-600" />;
      default:
        return <Square size={14} className="text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IE', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  const calculateDaysFromToday = (dateString: string) => {
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Developer Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive overview of your property development portfolio</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {timeframes.map(tf => (
              <option key={tf.value} value={tf.value}>{tf.label}</option>
            ))}
          </select>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download size={16} />
            Export Report
          </button>
          <Link 
            href="/developer/projects/create"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            New Project
          </Link>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCompactCurrency(dashboardData.overview.totalRevenue)}</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight size={16} className="text-green-600" />
                <span className="text-sm text-green-600 font-medium">+18.7%</span>
                <span className="text-sm text-gray-500">vs last period</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* Units Sold */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Units Sold</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.overview.soldUnits}</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight size={16} className="text-green-600" />
                <span className="text-sm text-green-600 font-medium">+12.5%</span>
                <span className="text-sm text-gray-500">this month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Home size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.overview.activeProjects}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-sm text-blue-600 font-medium">{dashboardData.overview.constructionProgress}%</span>
                <span className="text-sm text-gray-500">avg completion</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Building2 size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        {/* ROI */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Return on Investment</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.overview.roi}%</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight size={16} className="text-green-600" />
                <span className="text-sm text-green-600 font-medium">+2.3%</span>
                <span className="text-sm text-gray-500">vs target</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={24} className="text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Critical Path Tasks - Microsoft Project Style */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <GitBranch size={20} className="text-blue-600" />
                Critical Path Tasks
              </h3>
              <p className="text-sm text-gray-600 mt-1">Microsoft Project-style task management and dependency tracking</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
                  <span className="text-gray-600">Overdue ({dashboardData.criticalPath.summary.overdueTasks})</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-amber-100 border border-amber-200 rounded"></div>
                  <span className="text-gray-600">At Risk ({dashboardData.criticalPath.summary.atRiskTasks})</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
                  <span className="text-gray-600">On Track ({dashboardData.criticalPath.summary.onTrackTasks})</span>
                </div>
              </div>
              <Link 
                href="/developer/projects/gantt"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <BarChart2 size={16} />
                Gantt View
              </Link>
            </div>
          </div>
        </div>

        {/* Critical Path Summary Cards */}
        <div className="p-6 border-b bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Project Health</p>
                  <p className="text-xl font-semibold text-gray-900">{dashboardData.criticalPath.summary.projectHealth}%</p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart3 size={16} className="text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Critical Tasks</p>
                  <p className="text-xl font-semibold text-red-600">{dashboardData.criticalPath.summary.criticalTasks}</p>
                </div>
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle size={16} className="text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Overdue Tasks</p>
                  <p className="text-xl font-semibold text-red-600">{dashboardData.criticalPath.summary.overdueTasks}</p>
                </div>
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle size={16} className="text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">At Risk</p>
                  <p className="text-xl font-semibold text-amber-600">{dashboardData.criticalPath.summary.atRiskTasks}</p>
                </div>
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Clock size={16} className="text-amber-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Est. Delay</p>
                  <p className="text-xl font-semibold text-amber-600">{dashboardData.criticalPath.summary.estimatedDelay}w</p>
                </div>
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Calendar size={16} className="text-amber-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Task List - Microsoft Project Style */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboardData.criticalPath.tasks.map((task) => {
                const daysToEnd = calculateDaysFromToday(task.endDate);
                const isOverdue = daysToEnd < 0;
                const isUrgent = daysToEnd <= 7 && daysToEnd >= 0;
                
                return (
                  <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getTaskTypeIcon(task.taskType)}
                        <span className="text-sm font-medium text-gray-900">{task.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{task.name}</p>
                          <p className="text-xs text-gray-500">{task.phase}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{task.project}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{task.assignee}</p>
                        <p className="text-xs text-gray-500">{task.assigneeRole}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(task.startDate)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(task.endDate)}
                        {isOverdue && (
                          <div className="text-xs text-red-600 font-medium">
                            {Math.abs(daysToEnd)} days overdue
                          </div>
                        )}
                        {isUrgent && !isOverdue && (
                          <div className="text-xs text-amber-600 font-medium">
                            {daysToEnd} days remaining
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {task.duration} days
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              task.progress === 100 ? 'bg-green-600' :
                              task.progress >= 75 ? 'bg-blue-600' :
                              task.progress >= 50 ? 'bg-amber-600' :
                              'bg-red-600'
                            }`}
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-600">{task.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {getTaskStatusIcon(task.status)}
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getTaskStatusColor(task.status)}`}>
                          {task.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {formatCompactCurrency(task.cost)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Task Dependencies Visualization */}
        <div className="p-6 border-t bg-gray-50">
          <h4 className="font-semibold text-gray-900 mb-4">Task Dependencies Network</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-3">Critical Path Sequence</h5>
              <div className="space-y-2">
                {['CP002', 'CP004', 'CP011', 'CP015'].map((taskId, index) => (
                  <div key={taskId} className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-red-100 border-2 border-red-300 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-red-600">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">{taskId}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        {dashboardData.criticalPath.tasks.find(t => t.id === taskId)?.name || 'Task Name'}
                      </span>
                    </div>
                    {index < 3 && <ArrowUpRight size={16} className="text-red-500" />}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-3">Resource Allocation</h5>
              <div className="space-y-3">
                {dashboardData.criticalPath.tasks.slice(0, 4).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users size={14} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{task.assignee}</p>
                        <p className="text-xs text-gray-500">{task.assigneeRole}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{task.resourceHours}h</p>
                      <p className="text-xs text-gray-500">{formatCompactCurrency(task.cost)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6 border-t">
          <div className="flex flex-wrap gap-3">
            <Link 
              href="/developer/projects/timeline"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Calendar size={16} />
              View Timeline
            </Link>
            <Link 
              href="/developer/projects/resources"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Users size={16} />
              Manage Resources
            </Link>
            <Link 
              href="/developer/projects/dependencies"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <GitBranch size={16} />
              Dependencies
            </Link>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Download size={16} />
              Export to MS Project
            </button>
          </div>
        </div>
      </div>

      {/* Sales Performance Chart and Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Performance Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Sales Performance</h3>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg">Revenue</button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Units</button>
            </div>
          </div>
          
          {/* Simple chart placeholder with data points */}
          <div className="h-64 relative">
            <div className="absolute inset-0 flex items-end justify-between p-4 bg-gradient-to-t from-blue-50 to-transparent rounded-lg">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div 
                    className="w-8 bg-blue-600 rounded-t"
                    style={{ height: `${Math.random() * 80 + 20}%` }}
                  />
                  <span className="text-xs text-gray-500 mt-2">
                    {new Date(2025, i, 1).toLocaleDateString('en', { month: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-xl font-semibold text-gray-900">{formatCompactCurrency(dashboardData.salesMetrics.thisMonth.revenue)}</p>
              <p className="text-sm text-green-600">+{dashboardData.salesMetrics.thisMonth.growth}%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">This Quarter</p>
              <p className="text-xl font-semibold text-gray-900">{formatCompactCurrency(dashboardData.salesMetrics.thisQuarter.revenue)}</p>
              <p className="text-sm text-green-600">+{dashboardData.salesMetrics.thisQuarter.growth}%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Year to Date</p>
              <p className="text-xl font-semibold text-gray-900">{formatCompactCurrency(dashboardData.salesMetrics.yearToDate.revenue)}</p>
              <p className="text-sm text-green-600">+{dashboardData.salesMetrics.yearToDate.growth}%</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          {/* Portfolio Health */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Portfolio Health</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Available Units</span>
                <span className="font-medium text-green-600">{dashboardData.overview.availableUnits}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Reserved Units</span>
                <span className="font-medium text-amber-600">{dashboardData.overview.reservedUnits}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">HTB Claims</span>
                <span className="font-medium text-blue-600">{dashboardData.overview.htbClaims}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Buyers</span>
                <span className="font-medium text-purple-600">{dashboardData.overview.activeBuyers}</span>
              </div>
            </div>
          </div>

          {/* Team Performance */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Team Performance</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Team Members</span>
                <span className="font-medium">{dashboardData.teamMetrics.totalTeamMembers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Tasks</span>
                <span className="font-medium">{dashboardData.teamMetrics.activeTasks}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Efficiency</span>
                <span className="font-medium text-green-600">{dashboardData.teamMetrics.efficiency}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${dashboardData.teamMetrics.efficiency}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Projects */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Active Development Projects</h3>
            <Link 
              href="/developer/projects"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              View All
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {dashboardData.projects.map((project) => (
            <Link 
              key={project.id}
              href={`/developer/projects/${project.id}`}
              className="group"
            >
              <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 group-hover:border-blue-300">
                {/* Project Image */}
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black bg-opacity-20" />
                  <div className="absolute top-4 left-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h4 className="font-semibold text-lg">{project.name}</h4>
                    <p className="text-sm opacity-90 flex items-center gap-1">
                      <MapPin size={14} />
                      {project.location}
                    </p>
                  </div>
                </div>

                {/* Project Details */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center mb-4">
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{project.totalUnits}</p>
                      <p className="text-xs text-gray-600">Total Units</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-green-600">{project.soldUnits}</p>
                      <p className="text-xs text-gray-600">Sold</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-blue-600">{project.availableUnits}</p>
                      <p className="text-xs text-gray-600">Available</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Revenue</span>
                      <span className="font-semibold">{formatCompactCurrency(project.revenue)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Completion</span>
                      <span className="text-sm text-gray-900">{new Date(project.targetCompletion).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Phase</span>
                      <span className="text-sm text-gray-900">{project.phase}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity and Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {dashboardData.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'sale' ? 'bg-green-100' :
                    activity.type === 'reservation' ? 'bg-blue-100' :
                    activity.type === 'htb' ? 'bg-purple-100' :
                    activity.type === 'milestone' ? 'bg-amber-100' :
                    'bg-gray-100'
                  }`}>
                    {activity.type === 'sale' ? <DollarSign size={16} className="text-green-600" /> :
                     activity.type === 'reservation' ? <Home size={16} className="text-blue-600" /> :
                     activity.type === 'htb' ? <Heart size={16} className="text-purple-600" /> :
                     activity.type === 'milestone' ? <Target size={16} className="text-amber-600" /> :
                     <FileText size={16} className="text-gray-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">{activity.time}</span>
                      {activity.value && (
                        <span className="text-sm font-medium text-green-600">{activity.value}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t">
              <Link 
                href="/developer/activity"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
              >
                View All Activity
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Financial Overview</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Investment</span>
                <span className="font-semibold text-gray-900">{formatCompactCurrency(dashboardData.financialMetrics.totalInvestment)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Revenue</span>
                <span className="font-semibold text-green-600">{formatCompactCurrency(dashboardData.financialMetrics.totalRevenue)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Gross Profit</span>
                <span className="font-semibold text-blue-600">{formatCompactCurrency(dashboardData.financialMetrics.grossProfit)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Net Profit</span>
                <span className="font-semibold text-purple-600">{formatCompactCurrency(dashboardData.financialMetrics.netProfit)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cash Flow</span>
                <span className="font-semibold text-green-600">{formatCompactCurrency(dashboardData.financialMetrics.cashFlow)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Outstanding Payments</span>
                <span className="font-semibold text-amber-600">{formatCompactCurrency(dashboardData.financialMetrics.outstandingPayments)}</span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <Link 
                href="/developer/finance"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
              >
                View Financial Dashboard
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Link 
              href="/developer/projects/create"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <Plus size={24} className="text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">New Project</span>
            </Link>
            
            <Link 
              href="/developer/team"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors group"
            >
              <Users size={24} className="text-green-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">Team Management</span>
            </Link>
            
            <Link 
              href="/developer/htb"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors group"
            >
              <Heart size={24} className="text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">Help-to-Buy</span>
            </Link>
            
            <Link 
              href="/developer/documents"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-colors group"
            >
              <FileText size={24} className="text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">Documents</span>
            </Link>
            
            <Link 
              href="/developer/analytics"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
            >
              <BarChart3 size={24} className="text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">Analytics</span>
            </Link>
            
            <Link 
              href="/developer/settings"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors group"
            >
              <Settings size={24} className="text-gray-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}