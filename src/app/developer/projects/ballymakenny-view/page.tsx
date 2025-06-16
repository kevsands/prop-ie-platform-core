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
  BarChart3
} from 'lucide-react';

export default function BallymakennyViewProject() {
  const [activeTab, setActiveTab] = useState('overview');

  // This data should match the consumer-facing development data
  const projectData = {
    id: 'ballymakenny-view',
    name: 'Ballymakenny View',
    location: 'Drogheda, Co. Louth',
    phase: 'Phase 2 Construction',
    status: 'active',
    completionRate: 45,
    totalUnits: 40,
    soldUnits: 18,
    reservedUnits: 8,
    availableUnits: 14,
    totalValue: 16000000,
    depositsCollected: 785000,
    completionDate: '2025-06-30',
    salesRate: 45.0,
    startDate: '2023-06-15',
    team: 10,
    contractors: 6,
    description: 'Premium coastal living with stunning views of the Irish Sea. Ballymakenny View offers luxury homes in a prime location, combining modern design with the beauty of coastal Ireland.',
    
    // Unit types matching consumer page
    unitTypes: {
      '2bed': {
        name: '2 Bed Apartment',
        price: 395000,
        area: '85 sq.m',
        available: 6,
        total: 16,
        sold: 10
      },
      '3bed': {
        name: '3 Bed Duplex',
        price: 525000,
        area: '125 sq.m',
        available: 4,
        total: 14,
        sold: 10
      },
      '4bed': {
        name: '4 Bed Penthouse',
        price: 795000,
        area: '165 sq.m',
        available: 4,
        total: 10,
        sold: 6
      }
    },

    // Sales data for developer insights
    salesFunnel: {
      available: 14,
      reserved: 8,
      saleAgreed: 18,
      completed: 0
    },

    // Link to consumer page
    publicUrl: '/developments/ballymakenny-view'
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

  const recentActivity = [
    { id: 1, type: 'sale', description: 'Unit 12 - 3 Bed Duplex reserved by Sarah O\'Connor', time: '3 hours ago', status: 'success' },
    { id: 2, type: 'task', description: 'Phase 2 construction milestone completed', time: '1 day ago', status: 'success' },
    { id: 3, type: 'document', description: 'Updated floor plans uploaded to public site', time: '2 days ago', status: 'info' },
    { id: 4, type: 'inquiry', description: '5 new inquiries via public development page', time: '3 days ago', status: 'info' },
  ];

  const upcomingTasks = [
    { id: 1, title: 'Update public site with new availability', due: '2025-06-18', priority: 'high', assignee: 'Marketing Team' },
    { id: 2, title: 'Q2 sales review and pricing strategy', due: '2025-06-20', priority: 'medium', assignee: 'Sales Manager' },
    { id: 3, title: 'Site visit coordination for interested buyers', due: '2025-06-22', priority: 'medium', assignee: 'Site Manager' },
    { id: 4, title: 'Update virtual tour with Phase 2 progress', due: '2025-06-25', priority: 'low', assignee: 'Media Team' },
  ];

  const salesMetrics = [
    { label: 'Sales Velocity', value: '2.3 units/month', change: '+15%', trend: 'up' },
    { label: 'Average Sale Price', value: '€525k', change: '+8%', trend: 'up' },
    { label: 'Conversion Rate', value: '18%', change: '-2%', trend: 'down' },
    { label: 'Time to Sale', value: '45 days', change: '-12%', trend: 'up' },
  ];

  return (
    <div className="p-6">
      {/* Header with Back Navigation */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Link
              href="/developer/projects"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{projectData.name}</h1>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                {projectData.location}
                <span className="mx-2">•</span>
                <span className="text-sm">{projectData.phase}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href={projectData.publicUrl}
              target="_blank"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Public Page
            </Link>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Quick Status Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{projectStats.totalUnits}</p>
              <p className="text-xs text-gray-600">Total Units</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{projectStats.sold}</p>
              <p className="text-xs text-gray-600">Sold</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{projectStats.reserved}</p>
              <p className="text-xs text-gray-600">Reserved</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{projectStats.available}</p>
              <p className="text-xs text-gray-600">Available</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">€{(projectStats.totalValue / 1000000).toFixed(1)}M</p>
              <p className="text-xs text-gray-600">Total Value</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{projectStats.salesRate}%</p>
              <p className="text-xs text-gray-600">Sales Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-6">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'sales', label: 'Sales Analytics' },
            { id: 'units', label: 'Unit Management' },
            { id: 'marketing', label: 'Marketing & Media' },
            { id: 'construction', label: 'Construction' },
            { id: 'financial', label: 'Financial' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Project Progress */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Project Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Overall Completion</span>
                    <span className="text-sm font-medium">{projectData.completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full"
                      style={{ width: `${projectData.completionRate}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Sales Progress</span>
                    <span className="text-sm font-medium">{projectStats.salesRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full"
                      style={{ width: `${projectStats.salesRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sales Metrics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Sales Performance</h3>
              <div className="grid grid-cols-2 gap-4">
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
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <Link href="/developer/activity" className="text-sm text-blue-600 hover:text-blue-700">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.status === 'success' ? 'bg-green-500' :
                      activity.status === 'warning' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Unit Overview & Tasks */}
          <div className="space-y-6">
            {/* Unit Type Breakdown */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Unit Breakdown</h3>
              <div className="space-y-4">
                {Object.entries(projectData.unitTypes).map(([key, unit]) => (
                  <div key={key} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{unit.name}</h4>
                      <span className="text-sm text-gray-600">€{(unit.price / 1000).toFixed(0)}k</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>{unit.area}</span>
                      <span>{unit.sold}/{unit.total} sold</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(unit.sold / unit.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Upcoming Tasks</h3>
                <Link href="/developer/tasks" className="text-sm text-blue-600 hover:text-blue-700">
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {upcomingTasks.map(task => (
                  <div key={task.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        task.priority === 'high' ? 'bg-red-100 text-red-700' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{task.assignee}</p>
                    <p className="text-xs text-gray-500">Due: {task.due}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href={projectData.publicUrl}
                  target="_blank"
                  className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                >
                  <ExternalLink className="w-4 h-4 mr-3 text-blue-600" />
                  <span className="text-sm">View Public Development Page</span>
                </Link>
                <button className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                  <BarChart3 className="w-4 h-4 mr-3 text-green-600" />
                  <span className="text-sm">Generate Sales Report</span>
                </button>
                <button className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                  <Camera className="w-4 h-4 mr-3 text-purple-600" />
                  <span className="text-sm">Update Media Gallery</span>
                </button>
                <button className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                  <MessageSquare className="w-4 h-4 mr-3 text-yellow-600" />
                  <span className="text-sm">Contact Interested Buyers</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sales' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sales Analytics</h3>
            <p className="text-gray-600">Detailed sales analytics and performance metrics</p>
            <div className="mt-6 flex items-center justify-center space-x-4">
              <Link
                href={projectData.publicUrl}
                target="_blank"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Consumer Page
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Other tabs would be similar placeholders linking to the consumer page */}
      {activeTab !== 'overview' && activeTab !== 'sales' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
              {activeTab === 'units' && <Building className="w-8 h-8 text-gray-400" />}
              {activeTab === 'marketing' && <Camera className="w-8 h-8 text-gray-400" />}
              {activeTab === 'construction' && <Target className="w-8 h-8 text-gray-400" />}
              {activeTab === 'financial' && <Euro className="w-8 h-8 text-gray-400" />}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
            </h3>
            <p className="text-gray-600">
              {activeTab === 'units' && 'Unit inventory, pricing, and availability management'}
              {activeTab === 'marketing' && 'Marketing campaigns, media assets, and public page content'}
              {activeTab === 'construction' && 'Construction progress, milestones, and site management'}
              {activeTab === 'financial' && 'Financial tracking, deposits, and revenue analytics'}
            </p>
            <div className="mt-6 flex items-center justify-center space-x-4">
              <Link
                href={projectData.publicUrl}
                target="_blank"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Public Development Page
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}