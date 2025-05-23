'use client';

import React, { useState } from 'react';
import { 
  Activity, TrendingUp, Target, Clock, AlertCircle, CheckCircle,
  Calendar, DollarSign, Users, Building, Package, BarChart3,
  MessageSquare, FileText, Award, Zap, ChevronRight, Plus,
  ArrowUpRight, ArrowDownRight, Filter, Download, Share2, Calculator
} from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamic imports for charts
const LineChart = dynamic(() => import('recharts').then(mod => mod.LineChart), { ssr: false });
const AreaChart = dynamic(() => import('recharts').then(mod => mod.AreaChart), { ssr: false });
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
const PieChart = dynamic(() => import('recharts').then(mod => mod.PieChart), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const Legend = dynamic(() => import('recharts').then(mod => mod.Legend), { ssr: false });
const Line = dynamic(() => import('recharts').then(mod => mod.Line), { ssr: false });
const Area = dynamic(() => import('recharts').then(mod => mod.Area), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false });
const Pie = dynamic(() => import('recharts').then(mod => mod.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => mod.Cell), { ssr: false });

export default function DeveloperDashboard() {
  const [timeRangesetTimeRange] = useState('7d');
  const [selectedMetricsetSelectedMetric] = useState('revenue');

  // Mock data for charts
  const salesData = [
    { month: 'Jan', sales: 4500000, units: 12, conversions: 68 },
    { month: 'Feb', sales: 5200000, units: 15, conversions: 72 },
    { month: 'Mar', sales: 4800000, units: 13, conversions: 70 },
    { month: 'Apr', sales: 6100000, units: 18, conversions: 75 },
    { month: 'May', sales: 7300000, units: 22, conversions: 78 },
    { month: 'Jun', sales: 8500000, units: 25, conversions: 82 }];

  const projectPhases = [
    { name: 'Planning', value: 3, color: '#3B82F6' },
    { name: 'Foundation', value: 5, color: '#10B981' },
    { name: 'Construction', value: 8, color: '#F59E0B' },
    { name: 'Finishing', value: 4, color: '#8B5CF6' },
    { name: 'Complete', value: 2, color: '#6B7280' }];

  const performanceMetrics = [
    { metric: 'Sales Velocity', value: 2.3, target: 2.0, unit: 'units/week' },
    { metric: 'Lead Conversion', value: 72, target: 70, unit: '%' },
    { metric: 'Construction Time', value: 14.5, target: 16, unit: 'months' },
    { metric: 'Cost Efficiency', value: 94, target: 90, unit: '%' }];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Developer Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's your portfolio overview.</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 3 Months</option>
              <option value="1y">Last Year</option>
            </select>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Download className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* AI Assistant Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 text-white mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">AI Insights Available</p>
                <p className="text-sm opacity-90">3 new optimization opportunities identified</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors">
              View Insights
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Portfolio Value"
          value="€142.5M"
          change={+12.3}
          icon={<DollarSign className="w-5 h-5" />}
          color="blue"
          subtext="Total development value"
        />
        <MetricCard
          title="Active Projects"
          value="8"
          change={+2}
          icon={<Building className="w-5 h-5" />}
          color="green"
          subtext="Across 5 locations"
        />
        <MetricCard
          title="Units Sold"
          value="156"
          change={+23}
          icon={<Package className="w-5 h-5" />}
          color="purple"
          subtext="Last 30 days"
        />
        <MetricCard
          title="Sales Velocity"
          value="2.3/week"
          change={+15}
          icon={<TrendingUp className="w-5 h-5" />}
          color="orange"
          subtext="Units per week"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sales Performance Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Sales Performance</h3>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1"
            >
              <option value="revenue">Revenue</option>
              <option value="units">Units Sold</option>
              <option value="conversions">Conversion Rate</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey={selectedMetric === 'revenue' ? 'sales' : selectedMetric === 'units' ? 'units' : 'conversions'}
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Project Status Distribution</h3>
            <Link href="/developer/projects" className="text-sm text-blue-600 hover:text-blue-700">
              View All
            </Link>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectPhases}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {projectPhases.map((entryindex) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Performance vs Targets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {performanceMetrics.map((metric) => (
            <div key={metric.metric} className="text-center">
              <p className="text-sm text-gray-600 mb-2">{metric.metric}</p>
              <div className="relative h-32 flex items-center justify-center">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="36"
                      stroke="#E5E7EB"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="36"
                      stroke={metric.value>= metric.target ? '#10B981' : '#F59E0B'}
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(metric.value / 100) * 226} 226`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div>
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <p className="text-xs text-gray-500">{metric.unit}</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Target: {metric.target}{metric.unit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <ActivityItem
              icon={<CheckCircle className="w-5 h-5 text-green-600" />}
              title="Phase 2 Construction Complete"
              subtitle="Fitzgerald Gardens - Block A"
              time="2 hours ago"
            />
            <ActivityItem
              icon={<DollarSign className="w-5 h-5 text-blue-600" />}
              title="New Sale: Unit 304"
              subtitle="€450,000 - Riverside Manor"
              time="5 hours ago"
            />
            <ActivityItem
              icon={<Users className="w-5 h-5 text-purple-600" />}
              title="Contractor Added"
              subtitle="ABC Construction Ltd - Electrical Work"
              time="1 day ago"
            />
            <ActivityItem
              icon={<AlertCircle className="w-5 h-5 text-yellow-600" />}
              title="Approval Required"
              subtitle="Planning permission for Phase 3"
              time="2 days ago"
            />
            <ActivityItem
              icon={<FileText className="w-5 h-5 text-gray-600" />}
              title="Document Updated"
              subtitle="Environmental Impact Assessment"
              time="3 days ago"
            />
          </div>
          <Link href="/developer/activity" className="mt-4 text-sm text-blue-600 hover:text-blue-700 inline-flex items-center">
            View All Activity
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link href="/developer/developments/new" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Plus className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium">New Development</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link href="/developer/tenders/create" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm font-medium">Create Tender</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link href="/developer/team/add" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium">Add Team Member</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link href="/developer/financial/appraisal" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Calculator className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-sm font-medium">New Appraisal</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link href="/developer/analytics" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                </div>
                <span className="text-sm font-medium">View Reports</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component definitions
function MetricCard({ title, value, change, icon, color, subtext }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'};

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className={`flex items-center text-sm ${change>= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change>= 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
          {Math.abs(change)}%
        </div>
      </div>
      <h3 className="text-sm text-gray-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{subtext}</p>
    </div>
  );
}

function ActivityItem({ icon, title, subtitle, time }) {
  return (
    <div className="flex items-start space-x-3">
      <div className="p-2 bg-gray-50 rounded-lg">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
      <span className="text-xs text-gray-500">{time}</span>
    </div>
  );
}