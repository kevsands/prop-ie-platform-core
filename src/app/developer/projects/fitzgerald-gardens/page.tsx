'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  FileText, 
  Users, 
  CheckSquare, 
  FolderOpen, 
  Settings, 
  TrendingUp, 
  Clock, 
  MapPin, 
  Euro,
  AlertCircle,
  CheckCircle,
  Building,
  Camera,
  MessageSquare,
  Share2,
  Download,
  MoreHorizontal,
  BarChart3,
  Brain,
  Calculator,
  UserCheck,
  CreditCard,
  PieChart,
  Home,
  Map,
  Receipt
} from 'lucide-react';
import Link from 'next/link';

export default function FitzgeraldGardensProject() {
  const [activeTabsetActiveTab] = useState('overview');

  const projectStats = {
    totalUnits: 97,
    available: 78,
    reserved: 12,
    sold: 7,
    totalValue: 38250000,
    depositsCollected: 475000,
    completionDate: '2025-09-30',
    salesRate: 18.2,
    phase: 'Construction'
  };

  const recentActivity = [
    { id: 1, type: 'sale', description: 'Unit 42 - Reserved by John Murphy', time: '2 hours ago', status: 'success' },
    { id: 2, type: 'task', description: 'Planning compliance review completed', time: '4 hours ago', status: 'success' },
    { id: 3, type: 'document', description: 'New architectural drawings uploaded', time: '6 hours ago', status: 'info' },
    { id: 4, type: 'issue', description: 'Drainage issue reported on Phase 2', time: '1 day ago', status: 'warning' },
  ];

  const upcomingTasks = [
    { id: 1, title: 'Final planning submission review', due: '2025-06-18', priority: 'high', assignee: 'Sarah Chen' },
    { id: 2, title: 'Q2 progress meeting with contractors', due: '2025-06-20', priority: 'medium', assignee: 'Michael Burke' },
    { id: 3, title: 'Marketing material update', due: '2025-06-22', priority: 'low', assignee: 'Emma Walsh' },
    { id: 4, title: 'Site safety inspection', due: '2025-06-25', priority: 'high', assignee: 'David O\'Connor' },
  ];

  const teamMembers = [
    { id: 1, name: 'Sarah Chen', role: 'Project Manager', avatar: null, status: 'online' },
    { id: 2, name: 'Michael Burke', role: 'Site Manager', avatar: null, status: 'offline' },
    { id: 3, name: 'Emma Walsh', role: 'Marketing Lead', avatar: null, status: 'online' },
    { id: 4, name: 'David O\'Connor', role: 'Safety Officer', avatar: null, status: 'busy' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Fitzgerald Gardens</h1>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-1" />
                    Drogheda, Co. Louth
                  </span>
                  <span className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    Expected: Sep 2025
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {projectStats.phase}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
                <Share2 className="w-4 h-4 mr-2 inline" />
                Share
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                <Settings className="w-4 h-4 mr-2 inline" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Units</p>
                <p className="text-2xl font-bold text-gray-900">{projectStats.totalUnits}</p>
              </div>
              <Building className="w-8 h-8 text-blue-600" />
            </div>
            <div className="mt-4 flex text-sm">
              <span className="text-green-600 font-medium">{projectStats.sold + projectStats.reserved} sold/reserved</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Project Value</p>
                <p className="text-2xl font-bold text-gray-900">€{(projectStats.totalValue / 1000000).toFixed(1)}M</p>
              </div>
              <Euro className="w-8 h-8 text-green-600" />
            </div>
            <div className="mt-4 flex text-sm">
              <span className="text-green-600 font-medium">€{(projectStats.depositsCollected / 1000).toFixed(0)}k deposits</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sales Rate</p>
                <p className="text-2xl font-bold text-gray-900">{projectStats.salesRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <div className="mt-4 flex text-sm">
              <span className="text-green-600 font-medium">+12% this month</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion</p>
                <p className="text-2xl font-bold text-gray-900">Sep 2025</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <div className="mt-4 flex text-sm">
              <span className="text-orange-600 font-medium">On schedule</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid with Side Menu */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow sticky top-6">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Project Navigation</h2>
              </div>
              <nav className="p-2">
                {/* Core Management */}
                <div className="mb-6">
                  <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Core Management</h3>
                  <div className="space-y-1">
                    <Link href="/developer/projects/fitzgerald-gardens/overview" 
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
                      <Building className="w-4 h-4 mr-3 text-gray-500" />
                      Project Overview
                    </Link>
                    <Link href="/developer/projects/fitzgerald-gardens/tasks" 
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
                      <CheckSquare className="w-4 h-4 mr-3 text-gray-500" />
                      Task Management
                    </Link>
                    <Link href="/developer/projects/fitzgerald-gardens/programme" 
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
                      <Calendar className="w-4 h-4 mr-3 text-gray-500" />
                      Project Timeline
                    </Link>
                    <Link href="/developer/projects/fitzgerald-gardens/team" 
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
                      <Users className="w-4 h-4 mr-3 text-gray-500" />
                      Team Management
                    </Link>
                  </div>
                </div>

                {/* Analytics & Intelligence */}
                <div className="mb-6">
                  <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Analytics & Intelligence</h3>
                  <div className="space-y-1">
                    <Link href="/developer/projects/fitzgerald-gardens/analytics" 
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
                      <TrendingUp className="w-4 h-4 mr-3 text-gray-500" />
                      Advanced Analytics Hub
                    </Link>
                    <Link href="/developer/projects/fitzgerald-gardens/enhanced-analytics" 
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
                      <BarChart3 className="w-4 h-4 mr-3 text-gray-500" />
                      Enhanced Analytics
                    </Link>
                    <Link href="/developer/projects/fitzgerald-gardens/market-intelligence" 
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
                      <Brain className="w-4 h-4 mr-3 text-gray-500" />
                      AI Market Intelligence
                    </Link>
                    <Link href="/developer/projects/fitzgerald-gardens/pricing-analytics" 
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
                      <Calculator className="w-4 h-4 mr-3 text-gray-500" />
                      AI Pricing Analytics
                    </Link>
                  </div>
                </div>

                {/* Sales & Finance */}
                <div className="mb-6">
                  <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sales & Finance</h3>
                  <div className="space-y-1">
                    <Link href="/developer/projects/fitzgerald-gardens/buyer-journey" 
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
                      <UserCheck className="w-4 h-4 mr-3 text-gray-500" />
                      Buyer Journey Tracking
                    </Link>
                    <Link href="/developer/projects/fitzgerald-gardens/transactions" 
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
                      <CreditCard className="w-4 h-4 mr-3 text-gray-500" />
                      Live Transactions
                    </Link>
                    <Link href="/developer/projects/fitzgerald-gardens/investment" 
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
                      <PieChart className="w-4 h-4 mr-3 text-gray-500" />
                      Investment Analysis
                    </Link>
                    <Link href="/developer/projects/fitzgerald-gardens/financial" 
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
                      <Euro className="w-4 h-4 mr-3 text-gray-500" />
                      Financial Overview
                    </Link>
                  </div>
                </div>

                {/* Property & Operations */}
                <div className="mb-6">
                  <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Property & Operations</h3>
                  <div className="space-y-1">
                    <Link href="/developer/projects/fitzgerald-gardens/units" 
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
                      <Home className="w-4 h-4 mr-3 text-gray-500" />
                      Unit Management
                    </Link>
                    <Link href="/developer/projects/fitzgerald-gardens/design" 
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
                      <Camera className="w-4 h-4 mr-3 text-gray-500" />
                      Media & Plans
                    </Link>
                    <Link href="/developer/projects/fitzgerald-gardens/site-plan" 
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
                      <Map className="w-4 h-4 mr-3 text-gray-500" />
                      Interactive Site Plan
                    </Link>
                    <Link href="/developer/projects/fitzgerald-gardens/invoices" 
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
                      <Receipt className="w-4 h-4 mr-3 text-gray-500" />
                      Invoice Management
                    </Link>
                  </div>
                </div>

                {/* Documentation & Compliance */}
                <div>
                  <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Documentation & Compliance</h3>
                  <div className="space-y-1">
                    <Link href="/developer/projects/fitzgerald-gardens/documents" 
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
                      <FolderOpen className="w-4 h-4 mr-3 text-gray-500" />
                      Documents
                    </Link>
                    <Link href="/developer/projects/fitzgerald-gardens/compliance" 
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
                      <FileText className="w-4 h-4 mr-3 text-gray-500" />
                      Compliance
                    </Link>
                    <Link href="/developer/projects/fitzgerald-gardens/communications" 
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
                      <MessageSquare className="w-4 h-4 mr-3 text-gray-500" />
                      Communications
                    </Link>
                  </div>
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Comprehensive Project Navigation */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Project Management Hub</h2>
                <p className="text-sm text-gray-600 mt-1">Complete access to all project tools and resources</p>
              </div>
              <div className="p-6">
                {/* Core Management Section */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Core Management</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Link href="/developer/projects/fitzgerald-gardens/overview" 
                          className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <Building className="w-6 h-6 text-gray-500 mb-2" />
                      <span className="text-xs font-medium text-gray-700">Project Overview</span>
                    </Link>
                    <Link href="/developer/projects/fitzgerald-gardens/tasks" 
                          className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <CheckSquare className="w-6 h-6 text-gray-500 mb-2" />
                      <span className="text-xs font-medium text-gray-700">Task Management</span>
                    </Link>
                    <Link href="/developer/projects/fitzgerald-gardens/programme" 
                          className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <Calendar className="w-6 h-6 text-gray-500 mb-2" />
                      <span className="text-xs font-medium text-gray-700">Project Timeline</span>
                    </Link>
                    <Link href="/developer/projects/fitzgerald-gardens/team" 
                          className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <Users className="w-6 h-6 text-gray-500 mb-2" />
                      <span className="text-xs font-medium text-gray-700">Team Management</span>
                    </Link>
                  </div>
                </div>

                {/* Analytics & Intelligence Section */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Analytics & Intelligence</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Link href="/developer/projects/fitzgerald-gardens/analytics" 
                          className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <TrendingUp className="w-6 h-6 text-gray-500 mb-2" />
                      <span className="text-xs font-medium text-gray-700">Advanced Analytics Hub</span>
                    </Link>
                    <Link href="/developer/projects/fitzgerald-gardens/enhanced-analytics" 
                          className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <BarChart3 className="w-6 h-6 text-gray-500 mb-2" />
                      <span className="text-xs font-medium text-gray-700">Enhanced Analytics</span>
                    </Link>
                    <Link href="/developer/projects/fitzgerald-gardens/market-intelligence" 
                          className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <Brain className="w-6 h-6 text-gray-500 mb-2" />
                      <span className="text-xs font-medium text-gray-700">AI Market Intelligence</span>
                    </Link>
                    <Link href="/developer/projects/fitzgerald-gardens/pricing-analytics" 
                          className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <Calculator className="w-6 h-6 text-gray-500 mb-2" />
                      <span className="text-xs font-medium text-gray-700">AI Pricing Analytics</span>
                    </Link>
                  </div>
                </div>

                {/* Sales & Finance Section */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Sales & Finance</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Link href="/developer/projects/fitzgerald-gardens/buyer-journey" 
                          className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <UserCheck className="w-6 h-6 text-gray-500 mb-2" />
                      <span className="text-xs font-medium text-gray-700">Buyer Journey Tracking</span>
                    </Link>
                    <Link href="/developer/projects/fitzgerald-gardens/transactions" 
                          className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <CreditCard className="w-6 h-6 text-gray-500 mb-2" />
                      <span className="text-xs font-medium text-gray-700">Live Transactions</span>
                    </Link>
                    <Link href="/developer/projects/fitzgerald-gardens/investment" 
                          className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <PieChart className="w-6 h-6 text-gray-500 mb-2" />
                      <span className="text-xs font-medium text-gray-700">Investment Analysis</span>
                    </Link>
                    <Link href="/developer/projects/fitzgerald-gardens/financial" 
                          className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <Euro className="w-6 h-6 text-gray-500 mb-2" />
                      <span className="text-xs font-medium text-gray-700">Financial Overview</span>
                    </Link>
                  </div>
                </div>

                {/* Property & Operations Section */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Property & Operations</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Link href="/developer/projects/fitzgerald-gardens/units" 
                          className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <Home className="w-6 h-6 text-gray-500 mb-2" />
                      <span className="text-xs font-medium text-gray-700">Unit Management</span>
                    </Link>
                    <Link href="/developer/projects/fitzgerald-gardens/design" 
                          className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <Camera className="w-6 h-6 text-gray-500 mb-2" />
                      <span className="text-xs font-medium text-gray-700">Media & Plans</span>
                    </Link>
                    <Link href="/developer/projects/fitzgerald-gardens/site-plan" 
                          className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <Map className="w-6 h-6 text-gray-500 mb-2" />
                      <span className="text-xs font-medium text-gray-700">Interactive Site Plan</span>
                    </Link>
                    <Link href="/developer/projects/fitzgerald-gardens/invoices" 
                          className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <Receipt className="w-6 h-6 text-gray-500 mb-2" />
                      <span className="text-xs font-medium text-gray-700">Invoice Management</span>
                    </Link>
                  </div>
                </div>

                {/* Documentation & Compliance Section */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Documentation & Compliance</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <Link href="/developer/projects/fitzgerald-gardens/documents" 
                          className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <FolderOpen className="w-6 h-6 text-gray-500 mb-2" />
                      <span className="text-xs font-medium text-gray-700">Documents</span>
                    </Link>
                    <Link href="/developer/projects/fitzgerald-gardens/compliance" 
                          className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <FileText className="w-6 h-6 text-gray-500 mb-2" />
                      <span className="text-xs font-medium text-gray-700">Compliance</span>
                    </Link>
                    <Link href="/developer/projects/fitzgerald-gardens/communications" 
                          className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <MessageSquare className="w-6 h-6 text-gray-500 mb-2" />
                      <span className="text-xs font-medium text-gray-700">Communications</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                        activity.status === 'success' ? 'bg-green-400' :
                        activity.status === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/developer/projects/fitzgerald-gardens/activity" 
                        className="text-sm text-blue-600 hover:text-blue-500">
                    View all activity →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Tasks */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Upcoming Tasks</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {upcomingTasks.slice(0).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                        <p className="text-xs text-gray-500">Due: {task.due}</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/developer/projects/fitzgerald-gardens/tasks" 
                        className="text-sm text-blue-600 hover:text-blue-500">
                    View all tasks →
                  </Link>
                </div>
              </div>
            </div>

            {/* Team Members */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Team Members</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        member.status === 'online' ? 'bg-green-400' :
                        member.status === 'busy' ? 'bg-yellow-400' : 'bg-gray-400'
                      }`} />
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/developer/projects/fitzgerald-gardens/team" 
                        className="text-sm text-blue-600 hover:text-blue-500">
                    Manage team →
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Quick Stats</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Open Tasks</span>
                  <span className="text-sm font-medium text-gray-900">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending Documents</span>
                  <span className="text-sm font-medium text-gray-900">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Next Milestone</span>
                  <span className="text-sm font-medium text-gray-900">18 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Budget Used</span>
                  <span className="text-sm font-medium text-gray-900">67%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}