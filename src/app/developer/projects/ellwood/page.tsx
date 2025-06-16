'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  ArrowLeft,
  ExternalLink,
  Zap,
  Target,
  BarChart3,
  Award,
  Star,
  Brain,
  Calculator,
  UserCheck,
  CreditCard,
  PieChart,
  Home,
  Map,
  Receipt
} from 'lucide-react';

export default function EllwoodProject() {
  const [activeTab, setActiveTab] = useState('overview');

  // Project data matching the consumer-facing development
  const projectData = {
    id: 'ellwood',
    name: 'Ellwood',
    location: 'Celbridge, Co. Kildare',
    phase: 'Sold Out - Complete',
    status: 'completed',
    completionRate: 100,
    totalUnits: 46,
    soldUnits: 46,
    reservedUnits: 0,
    availableUnits: 0,
    totalValue: 35200000,
    depositsCollected: 35200000,
    completionDate: '2024-12-31',
    salesRate: 100.0,
    startDate: '2022-09-01',
    team: 14,
    contractors: 8,
    description: 'Contemporary apartment living in the heart of Kildare. This stunning development features modern architecture, sustainable design, and luxurious finishes throughout.',
    
    // Unit types based on consumer page
    unitTypes: {
      '1bed': {
        name: '1 Bed Apartment',
        price: 285000,
        area: '50-55 sq.m',
        available: 0,
        total: 18,
        sold: 18
      },
      '2bed': {
        name: '2 Bed Apartment',
        price: 365000,
        area: '70-80 sq.m',
        available: 0,
        total: 20,
        sold: 20
      },
      '3bed': {
        name: '3 Bed Penthouse',
        price: 450000,
        area: '95-105 sq.m',
        available: 0,
        total: 8,
        sold: 8
      }
    },

    // Sales completed - all units sold
    salesFunnel: {
      available: 0,
      reserved: 0,
      saleAgreed: 0,
      completed: 46
    },

    // Link to consumer page
    publicUrl: '/developments/ellwood'
  };

  const projectStats = {
    totalUnits: projectData.totalUnits,
    available: projectData.availableUnits,
    reserved: projectData.reservedUnits,
    sold: projectData.soldUnits,
    totalValue: projectData.totalValue,
    depositsCollected: projectData.depositsCollected,
    completionDate: projectData.completionDate,
    salesRate: projectData.salesRate,
    phase: projectData.phase
  };

  const completedMilestones = [
    { id: 1, type: 'milestone', description: 'Final unit handover completed - Project 100% complete', time: '2 weeks ago', status: 'success' },
    { id: 2, type: 'sale', description: 'Last remaining 3-bed penthouse sold to O\'Brien family', time: '1 month ago', status: 'success' },
    { id: 3, type: 'achievement', description: 'Ellwood wins Best Apartment Development 2024', time: '2 months ago', status: 'success' },
    { id: 4, type: 'milestone', description: 'All residents moved in - Occupancy 100%', time: '3 months ago', status: 'success' },
  ];

  const projectReview = [
    { id: 1, title: 'Generate final sales report', due: 'Completed', priority: 'high', assignee: 'Finance Team' },
    { id: 2, title: 'Handover all building warranties', due: 'Completed', priority: 'high', assignee: 'Legal Team' },
    { id: 3, title: 'Archive project documentation', due: 'In Progress', priority: 'medium', assignee: 'Project Manager' },
    { id: 4, title: 'Prepare case study for marketing', due: 'Pending', priority: 'low', assignee: 'Marketing Team' },
  ];

  const salesMetrics = [
    { label: 'Total Revenue', value: '€35.2M', change: '100%', trend: 'up' },
    { label: 'Average Sale Price', value: '€765k', change: '+12%', trend: 'up' },
    { label: 'Sales Velocity', value: '2.1 units/month', change: 'Final', trend: 'up' },
    { label: 'ROI', value: '24.7%', change: '+3%', trend: 'up' },
  ];

  const achievements = [
    'Best Apartment Development 2024 - Irish Property Awards',
    '100% Sales Achievement Award',
    'A1 Energy Rating Certification',
    'Customer Satisfaction Rating: 4.8/5',
    'Zero Defects Post-Handover',
    'Sold Out in Record Time (22 months)'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Ellwood</h1>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-1" />
                    Celbridge, Co. Kildare
                  </span>
                  <span className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    Completed: Dec 2024
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Completed - Sold Out
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href={projectData.publicUrl}
                target="_blank"
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <ExternalLink className="w-4 h-4 mr-2 inline" />
                View Public Page
              </Link>
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
              <span className="text-green-600 font-medium">All 46 units sold</span>
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
              <span className="text-green-600 font-medium">100% revenue achieved</span>
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
              <span className="text-green-600 font-medium">Sold out</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion</p>
                <p className="text-2xl font-bold text-gray-900">Dec 2024</p>
              </div>
              <Clock className="w-8 h-8 text-green-600" />
            </div>
            <div className="mt-4 flex text-sm">
              <span className="text-green-600 font-medium">On schedule</span>
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
                    <Link href="/developer/projects/ellwood/overview" 
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
                      <Building className="w-4 h-4 mr-3 text-gray-500" />
                      Project Overview
                    </Link>
                    <Link href="/developer/projects/ellwood/tasks" 
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
                      <CheckSquare className="w-4 h-4 mr-3 text-gray-500" />
                      Task Management
                    </Link>
                    <Link href="/developer/projects/ellwood/programme" 
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
                      <Calendar className="w-4 h-4 mr-3 text-gray-500" />
                      Project Timeline
                    </Link>
                    <Link href="/developer/projects/ellwood/team" 
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
                    <Link href="/developer/projects/ellwood/analytics" 
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
                      <TrendingUp className="w-4 h-4 mr-3 text-gray-500" />
                      Advanced Analytics Hub
                    </Link>
                    <Link href="/developer/projects/ellwood/enhanced-analytics" 
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
                      <BarChart3 className="w-4 h-4 mr-3 text-gray-500" />
                      Enhanced Analytics
                    </Link>
                    <Link href="/developer/projects/ellwood/market-intelligence" 
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
                      <Brain className="w-4 h-4 mr-3 text-gray-500" />
                      AI Market Intelligence
                    </Link>
                    <Link href="/developer/projects/ellwood/pricing-analytics" 
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
                    <Link href="/developer/projects/ellwood/buyer-journey" 
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
                      <UserCheck className="w-4 h-4 mr-3 text-gray-500" />
                      Buyer Journey Tracking
                    </Link>
                    <Link href="/developer/projects/ellwood/transactions" 
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
                      <CreditCard className="w-4 h-4 mr-3 text-gray-500" />
                      Live Transactions
                    </Link>
                    <Link href="/developer/projects/ellwood/investment" 
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
                      <PieChart className="w-4 h-4 mr-3 text-gray-500" />
                      Investment Analysis
                    </Link>
                    <Link href="/developer/projects/ellwood/financial" 
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
                    <Link href="/developer/projects/ellwood/units" 
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
                      <Home className="w-4 h-4 mr-3 text-gray-500" />
                      Unit Management
                    </Link>
                    <Link href="/developer/projects/ellwood/design" 
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
                      <Camera className="w-4 h-4 mr-3 text-gray-500" />
                      Media & Plans
                    </Link>
                    <Link href="/developer/projects/ellwood/site-plan" 
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
                      <Map className="w-4 h-4 mr-3 text-gray-500" />
                      Interactive Site Plan
                    </Link>
                    <Link href="/developer/projects/ellwood/invoices" 
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
                    <Link href="/developer/projects/ellwood/documents" 
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
                      <FolderOpen className="w-4 h-4 mr-3 text-gray-500" />
                      Documents
                    </Link>
                    <Link href="/developer/projects/ellwood/compliance" 
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
                      <FileText className="w-4 h-4 mr-3 text-gray-500" />
                      Compliance
                    </Link>
                    <Link href="/developer/projects/ellwood/communications" 
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
            {/* Project Success Summary */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-green-600" />
                  Project Success Summary
                </h2>
                <p className="text-sm text-gray-600 mt-1">Completed development with outstanding results</p>
              </div>
              <div className="p-6">
                <div className="p-4 bg-green-50 rounded-lg mb-6">
                  <h4 className="font-medium text-green-900 mb-2">Outstanding Achievement</h4>
                  <p className="text-sm text-green-700">
                    Ellwood has been completed successfully with 100% sales achievement, making it one of our most successful developments to date. 
                    The project exceeded ROI expectations by 3% and received multiple industry awards.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {salesMetrics.map((metric, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">{metric.label}</p>
                      <p className="text-xl font-bold text-gray-900">{metric.value}</p>
                      <p className={`text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.change}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Project Duration</p>
                    <p className="text-xl font-bold text-gray-900">28 months</p>
                    <p className="text-sm text-green-600">On schedule</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Sales Period</p>
                    <p className="text-xl font-bold text-gray-900">22 months</p>
                    <p className="text-sm text-green-600">Record fast</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Unit Sales Breakdown */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Final Unit Sales</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {Object.entries(projectData.unitTypes).map(([key, unit]) => (
                    <div key={key} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{unit.name}</h4>
                        <span className="text-sm text-gray-600">€{(unit.price / 1000).toFixed(0)}k</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>{unit.area}</span>
                        <span className="text-green-600 font-medium">SOLD OUT</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>{unit.sold}/{unit.total} sold</span>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Awards & Recognition */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-amber-500" />
                  Awards & Recognition
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span className="text-sm text-gray-700">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}