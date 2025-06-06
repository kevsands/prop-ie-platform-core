'use client';

import React, { useState } from 'react';
import { 
  Users, Package, TrendingUp, DollarSign, Calendar,
  Phone, Mail, MessageSquare, Clock, CheckCircle,
  AlertCircle, Star, Filter, Search, Plus, Download,
  Eye, Edit, UserPlus, Target, Activity, Award,
  Home, MapPin, Smartphone, Tag, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamic imports for charts
const LineChart = dynamic(() => import('recharts').then(mod => mod.LineChart), { ssr: false });
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
const FunnelChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const Legend = dynamic(() => import('recharts').then(mod => mod.Legend), { ssr: false });
const Line = dynamic(() => import('recharts').then(mod => mod.Line), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false });

export default function SalesManagementPage() {
  const [activeTabsetActiveTab] = useState('overview');
  const [selectedDevelopmentsetSelectedDevelopment] = useState('all');
  const [showNewLeadsetShowNewLead] = useState(false);

  // Mock sales data
  const salesMetrics = {
    totalLeads: 342,
    activeDeals: 47,
    conversionRate: 72,
    avgDealSize: '€485K',
    monthlyRevenue: '€8.2M',
    velocity: '2.3 units/week'
  };

  const salesFunnel = [
    { stage: 'Inquiry', count: 342, value: '€165M' },
    { stage: 'Qualified', count: 186, value: '€90M' },
    { stage: 'Viewing', count: 124, value: '€60M' },
    { stage: 'Negotiation', count: 47, value: '€23M' },
    { stage: 'Contract', count: 18, value: '€8.7M' },
    { stage: 'Closed', count: 15, value: '€7.3M' }
  ];

  const leads = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+353 87 123 4567',
      status: 'qualified',
      interest: 'Fitzgerald Gardens',
      budget: '€450K - €550K',
      source: 'Website',
      assignedTo: 'John Smith',
      lastContact: '2 hours ago',
      score: 85,
      timeline: '1-3 months',
      unit: 'Unit 304',
      notes: 'Looking for 3-bed apartment, needs parking'
    },
    {
      id: '2',
      name: 'Michael O\'Brien',
      email: 'michael.obrien@email.com',
      phone: '+353 86 234 5678',
      status: 'viewing',
      interest: 'Riverside Manor',
      budget: '€380K - €420K',
      source: 'Referral',
      assignedTo: 'Mary Kelly',
      lastContact: '1 day ago',
      score: 92,
      timeline: 'Immediate',
      unit: 'Unit 205',
      notes: 'Cash buyer, pre-approved'
    },
    {
      id: '3',
      name: 'Emma Walsh',
      email: 'emma.walsh@email.com',
      phone: '+353 85 345 6789',
      status: 'negotiation',
      interest: 'Ballymakenny View',
      budget: '€320K - €380K',
      source: 'Property Portal',
      assignedTo: 'John Smith',
      lastContact: '3 hours ago',
      score: 78,
      timeline: '3-6 months',
      unit: 'Unit 108',
      notes: 'First-time buyer, needs mortgage approval'
    }
  ];

  const salesPerformance = [
    { month: 'Jan', sales: 12, revenue: 5800000, avgPrice: 483000 },
    { month: 'Feb', sales: 15, revenue: 7350000, avgPrice: 490000 },
    { month: 'Mar', sales: 18, revenue: 8910000, avgPrice: 495000 },
    { month: 'Apr', sales: 14, revenue: 7070000, avgPrice: 505000 },
    { month: 'May', sales: 20, revenue: 10200000, avgPrice: 510000 },
    { month: 'Jun', sales: 16, revenue: 8240000, avgPrice: 515000 }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sales Management</h1>
            <p className="text-gray-600">Lead tracking, pipeline management, and performance analytics</p>
          </div>
          <button
            onClick={() => setShowNewLead(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Lead
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Leads</span>
              <Users className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold">{salesMetrics.totalLeads}</p>
            <p className="text-xs text-green-600">+12% vs last month</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Active Deals</span>
              <Package className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold">{salesMetrics.activeDeals}</p>
            <p className="text-xs text-gray-500">In negotiation</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Conversion Rate</span>
              <Target className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold">{salesMetrics.conversionRate}%</p>
            <p className="text-xs text-green-600">Above target</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Avg Deal Size</span>
              <DollarSign className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold">{salesMetrics.avgDealSize}</p>
            <p className="text-xs text-gray-500">Per unit</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Monthly Revenue</span>
              <TrendingUp className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold">{salesMetrics.monthlyRevenue}</p>
            <p className="text-xs text-green-600">+8% growth</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Sales Velocity</span>
              <Activity className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold">{salesMetrics.velocity}</p>
            <p className="text-xs text-gray-500">Avg closure rate</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'overview' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center ${
                activeTab === 'leads' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Leads
              <span className="ml-2 bg-gray-200 text-gray-700 text-xs rounded-full px-2 py-0.5">342</span>
            </button>
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'pipeline' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Pipeline
            </button>
            <button
              onClick={() => setActiveTab('units')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'units' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Unit Availability
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'performance' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Performance
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div>
          {/* Sales Funnel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Sales Funnel</h3>
              <div className="space-y-3">
                {salesFunnel.map((stageindex) => (
                  <div key={stage.stage}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{stage.stage}</span>
                      <span className="text-sm text-gray-600">{stage.count} ({stage.value})</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full"
                        style={ width: `${(stage.count / salesFunnel[0].count) * 100}%` }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Sales Performance</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#3B82F6" name="Units Sold" />
                    <Line yAxisId="right" type="monotone" dataKey="avgPrice" stroke="#10B981" name="Avg Price" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Sales Activities</h3>
            <div className="space-y-4">
              <ActivityItem
                icon={<CheckCircle className="w-5 h-5 text-green-600" />}
                title="Unit 304 Reserved"
                subtitle="Fitzgerald Gardens - Sarah Johnson"
                time="2 hours ago"
              />
              <ActivityItem
                icon={<Eye className="w-5 h-5 text-blue-600" />}
                title="Property Viewing Scheduled"
                subtitle="Riverside Manor - Michael O'Brien"
                time="3 hours ago"
              />
              <ActivityItem
                icon={<Phone className="w-5 h-5 text-purple-600" />}
                title="Follow-up Call Completed"
                subtitle="Emma Walsh - Negotiation Update"
                time="5 hours ago"
              />
              <ActivityItem
                icon={<UserPlus className="w-5 h-5 text-indigo-600" />}
                title="New Lead Assigned"
                subtitle="David Murphy - Assigned to Mary Kelly"
                time="1 day ago"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'leads' && (
        <div>
          {/* Lead Filters */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>All Status</option>
                <option>New</option>
                <option>Qualified</option>
                <option>Viewing</option>
                <option>Negotiation</option>
                <option>Contract</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>All Developments</option>
                <option>Fitzgerald Gardens</option>
                <option>Riverside Manor</option>
                <option>Ballymakenny View</option>
              </select>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </button>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Download className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Lead List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interest
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leads.map(lead => (
                  <LeadRow key={lead.id} lead={lead} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Lead Modal */}
      {showNewLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">New Lead</h2>
              <button
                onClick={() => setShowNewLead(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ✕
              </button>
            </div>
            <NewLeadForm onClose={() => setShowNewLead(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

// Activity Item Component
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

// Lead Row Component
function LeadRow({ lead }) {
  const statusColors = {
    new: 'bg-blue-100 text-blue-700',
    qualified: 'bg-green-100 text-green-700',
    viewing: 'bg-purple-100 text-purple-700',
    negotiation: 'bg-yellow-100 text-yellow-700',
    contract: 'bg-indigo-100 text-indigo-700'
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <p className="font-medium text-gray-900">{lead.name}</p>
          <p className="text-sm text-gray-500">{lead.email}</p>
          <p className="text-sm text-gray-500">{lead.phone}</p>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[lead.status]}`}>
          {lead.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <p className="text-sm font-medium">{lead.interest}</p>
        <p className="text-sm text-gray-500">{lead.unit}</p>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <p className="text-sm">{lead.budget}</p>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
            <div
              className={`h-2 rounded-full ${
                lead.score>= 80 ? 'bg-green-600' : 
                lead.score>= 60 ? 'bg-yellow-600' : 'bg-red-600'
              }`}
              style={ width: `${lead.score}%` }
            />
          </div>
          <span className="text-sm font-medium">{lead.score}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <p className="text-sm">{lead.assignedTo}</p>
        <p className="text-xs text-gray-500">{lead.lastContact}</p>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end space-x-2">
          <button className="p-1 hover:bg-gray-100 rounded">
            <Phone className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <Mail className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <MessageSquare className="w-4 h-4 text-gray-600" />
          </button>
          <Link href={`/developer/sales/leads/${lead.id}`} className="p-1 hover:bg-gray-100 rounded">
            <Eye className="w-4 h-4 text-gray-600" />
          </Link>
        </div>
      </td>
    </tr>
  );
}

// New Lead Form Component
function NewLeadForm({ onClose }) {
  const [formDatasetFormData] = useState({
    name: '',
    email: '',
    phone: '',
    development: '',
    budget: '',
    timeline: '',
    source: '',
    notes: ''
  });

  return (
    <form>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Development Interest
          </label>
          <select
            value={formData.development}
            onChange={(e) => setFormData({ ...formData, development: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select development</option>
            <option value="fitzgerald">Fitzgerald Gardens</option>
            <option value="riverside">Riverside Manor</option>
            <option value="ballymakenny">Ballymakenny View</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Budget Range
          </label>
          <input
            type="text"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="€000,000 - €000,000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Timeline
          </label>
          <select
            value={formData.timeline}
            onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select timeline</option>
            <option value="immediate">Immediate</option>
            <option value="1-3months">1-3 months</option>
            <option value="3-6months">3-6 months</option>
            <option value="6months+">6+ months</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            rows={3}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Lead
        </button>
      </div>
    </form>
  );
}