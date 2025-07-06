'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Calendar, 
  ArrowUpRight, 
  Download, 
  Plus, 
  RefreshCw, 
  ExternalLink,
  Shield,
  Award,
  Activity,
  Target,
  Briefcase,
  Scale,
  Building2,
  MessageSquare,
  Bell,
  Settings,
  BarChart3,
  DollarSign,
  Euro,
  MapPin,
  Home,
  Zap,
  BookOpen,
  Search,
  Filter,
  Eye
} from 'lucide-react';
import Link from 'next/link';

interface SolicitorMetrics {
  activeCases: number;
  completedThisMonth: number;
  totalClients: number;
  avgCompletionTime: number;
  pendingDocuments: number;
  kycCompliance: number;
  revenueThisMonth: number;
  billableHours: number;
  clientSatisfaction: number;
  urgentCases: number;
  documentsProcessed: number;
  nextDeadline: {
    case: string;
    client: string;
    date: string;
    type: string;
  };
}

interface Case {
  id: string;
  caseNumber: string;
  client: string;
  propertyAddress: string;
  transactionType: 'purchase' | 'sale' | 'remortgage';
  status: 'new' | 'in_progress' | 'awaiting_documents' | 'completion_ready' | 'completed';
  priority: 'urgent' | 'high' | 'normal' | 'low';
  stage: string;
  completionDate: string;
  value: number;
  assignedSolicitor: string;
  lastActivity: string;
  progress: number;
}

interface Document {
  id: string;
  type: string;
  caseNumber: string;
  client: string;
  status: 'pending' | 'received' | 'reviewed' | 'approved';
  dueDate: string;
  priority: 'urgent' | 'high' | 'normal';
}

export default function SolicitorOverview() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('current');
  const [selectedView, setSelectedView] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Enhanced solicitor metrics
  const solicitorMetrics: SolicitorMetrics = {
    activeCases: 47,
    completedThisMonth: 23,
    totalClients: 89,
    avgCompletionTime: 8.5,
    pendingDocuments: 12,
    kycCompliance: 98.5,
    revenueThisMonth: 145000,
    billableHours: 186,
    clientSatisfaction: 96.2,
    urgentCases: 5,
    documentsProcessed: 234,
    nextDeadline: {
      case: 'CASE-2025-0847',
      client: 'Murphy Family Trust',
      date: 'Tomorrow 2:00 PM',
      type: 'Contract Exchange'
    }
  };

  const recentCases: Case[] = [
    {
      id: '1',
      caseNumber: 'CASE-2025-0847',
      client: 'Murphy Family Trust',
      propertyAddress: 'Fitzgerald Gardens, Unit 23, Cork',
      transactionType: 'purchase',
      status: 'completion_ready',
      priority: 'urgent',
      stage: 'Pre-Completion',
      completionDate: '2025-06-20',
      value: 385000,
      assignedSolicitor: 'Sarah O\'Connor',
      lastActivity: '2 hours ago',
      progress: 95
    },
    {
      id: '2',
      caseNumber: 'CASE-2025-0846',
      client: 'John & Mary Walsh',
      propertyAddress: 'Ellwood, Unit 15, Dublin',
      transactionType: 'purchase',
      status: 'in_progress',
      priority: 'high',
      stage: 'Contract Review',
      completionDate: '2025-07-15',
      value: 520000,
      assignedSolicitor: 'Michael Byrne',
      lastActivity: '4 hours ago',
      progress: 65
    },
    {
      id: '3',
      caseNumber: 'CASE-2025-0845',
      client: 'David Kelly',
      propertyAddress: 'Ballymakenny View, Unit 8, Drogheda',
      transactionType: 'sale',
      status: 'awaiting_documents',
      priority: 'normal',
      stage: 'Title Investigation',
      completionDate: '2025-08-10',
      value: 365000,
      assignedSolicitor: 'Emma Collins',
      lastActivity: '1 day ago',
      progress: 45
    },
    {
      id: '4',
      caseNumber: 'CASE-2025-0844',
      client: 'Thompson Holdings Ltd',
      propertyAddress: 'Cork City Commercial Center, Cork',
      transactionType: 'purchase',
      status: 'new',
      priority: 'high',
      stage: 'Initial Review',
      completionDate: '2025-09-30',
      value: 850000,
      assignedSolicitor: 'Patrick Murphy',
      lastActivity: '2 days ago',
      progress: 15
    }
  ];

  const pendingDocuments: Document[] = [
    {
      id: '1',
      type: 'Title Deeds',
      caseNumber: 'CASE-2025-0847',
      client: 'Murphy Family Trust',
      status: 'pending',
      dueDate: 'Today',
      priority: 'urgent'
    },
    {
      id: '2',
      type: 'Property Information Form',
      caseNumber: 'CASE-2025-0846',
      client: 'John & Mary Walsh',
      status: 'received',
      dueDate: 'Tomorrow',
      priority: 'high'
    },
    {
      id: '3',
      type: 'Mortgage Offer Letter',
      caseNumber: 'CASE-2025-0845',
      client: 'David Kelly',
      status: 'pending',
      dueDate: '2 days',
      priority: 'normal'
    }
  ];

  const timeframes = [
    { value: 'current', label: 'Current Status' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' }
  ];

  const caseViews = [
    { value: 'all', label: 'All Cases' },
    { value: 'urgent', label: 'Urgent Only' },
    { value: 'purchase', label: 'Purchases' },
    { value: 'sale', label: 'Sales' }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLastUpdated(new Date());
    setRefreshing(false);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'completion_ready':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'in_progress':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'awaiting_documents':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'new':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'normal':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <Home size={16} className="text-green-600" />;
      case 'sale':
        return <DollarSign size={16} className="text-blue-600" />;
      case 'remortgage':
        return <Building2 size={16} className="text-purple-600" />;
      default:
        return <FileText size={16} className="text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Legal Practice Overview</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive view of your legal practice and client cases
          </p>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <Clock size={14} />
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            {timeframes.map(tf => (
              <option key={tf.value} value={tf.value}>{tf.label}</option>
            ))}
          </select>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
            <Download size={16} className="inline mr-2" />
            Export Report
          </button>
          <Link 
            href="/solicitor/cases/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus size={16} className="inline mr-2" />
            New Case
          </Link>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Cases */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Cases</p>
              <p className="text-2xl font-bold text-gray-900">{solicitorMetrics.activeCases}</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight size={16} className="text-green-600" />
                <span className="text-sm text-green-600 font-medium">+{solicitorMetrics.completedThisMonth}</span>
                <span className="text-sm text-gray-500">completed this month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
              <Briefcase size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        {/* Revenue This Month */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCompactCurrency(solicitorMetrics.revenueThisMonth)}</p>
              <div className="flex items-center gap-1 mt-1">
                <Euro size={16} className="text-green-600" />
                <span className="text-sm text-green-600 font-medium">{solicitorMetrics.billableHours}h</span>
                <span className="text-sm text-gray-500">billable</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
              <DollarSign size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* KYC Compliance */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">KYC Compliance</p>
              <p className="text-2xl font-bold text-gray-900">{solicitorMetrics.kycCompliance}%</p>
              <div className="flex items-center gap-1 mt-1">
                <Shield size={16} className="text-blue-600" />
                <span className="text-sm text-blue-600 font-medium">Excellent</span>
                <span className="text-sm text-gray-500">compliance rate</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-violet-100 rounded-lg flex items-center justify-center">
              <Shield size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        {/* Client Satisfaction */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Client Satisfaction</p>
              <p className="text-2xl font-bold text-gray-900">{solicitorMetrics.clientSatisfaction}%</p>
              <div className="flex items-center gap-1 mt-1">
                <Award size={16} className="text-amber-500" />
                <span className="text-sm text-amber-600 font-medium">Excellent</span>
                <span className="text-sm text-gray-500">rating</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
              <Users size={24} className="text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Next Deadline Alert */}
      {solicitorMetrics.nextDeadline && (
        <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Urgent Deadline</h3>
              <p className="text-xl font-bold">{solicitorMetrics.nextDeadline.type}</p>
              <p className="text-red-100">{solicitorMetrics.nextDeadline.date}</p>
              <p className="text-red-100 text-sm">Case: {solicitorMetrics.nextDeadline.case} - {solicitorMetrics.nextDeadline.client}</p>
            </div>
            <div className="flex gap-3">
              <Link 
                href={`/solicitor/cases/${solicitorMetrics.nextDeadline.case}`}
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm"
              >
                View Case
              </Link>
              <Link 
                href="/solicitor/calendar"
                className="px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-gray-100 transition-colors text-sm"
              >
                Calendar View
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Cases */}
        <div className="lg:col-span-2 bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                <Scale size={20} className="inline mr-2 text-blue-600" />
                Active Cases
              </h3>
              <div className="flex items-center gap-2">
                <select
                  value={selectedView}
                  onChange={(e) => setSelectedView(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  {caseViews.map(view => (
                    <option key={view.value} value={view.value}>{view.label}</option>
                  ))}
                </select>
                <Link 
                  href="/solicitor/cases"
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  View All ({solicitorMetrics.activeCases})
                  <ExternalLink size={14} className="inline ml-1" />
                </Link>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {recentCases.map((case_) => (
                <div key={case_.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                        {getTransactionIcon(case_.transactionType)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{case_.caseNumber}</h4>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(case_.priority)}`}>
                            {case_.priority}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(case_.status)}`}>
                            {case_.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-1">{case_.client}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                          <MapPin size={12} />
                          {case_.propertyAddress}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <p className="text-gray-500">Stage</p>
                            <p className="font-medium">{case_.stage}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Value</p>
                            <p className="font-medium">{formatCompactCurrency(case_.value)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Completion</p>
                            <p className="font-medium">{new Date(case_.completionDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Solicitor</p>
                            <p className="font-medium">{case_.assignedSolicitor}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                case_.progress >= 90 ? 'bg-green-600' :
                                case_.progress >= 60 ? 'bg-blue-600' :
                                case_.progress >= 30 ? 'bg-amber-600' :
                                'bg-red-600'
                              }`}
                              style={{ width: `${case_.progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-600">{case_.progress}%</span>
                        </div>
                      </div>
                    </div>
                    <Link 
                      href={`/solicitor/cases/${case_.caseNumber}`}
                      className="ml-4 p-2 hover:bg-gray-100 rounded transition-colors"
                    >
                      <ArrowUpRight size={16} className="text-gray-400" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Documents & Quick Actions */}
        <div className="space-y-6">
          {/* Pending Documents */}
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                <FileText size={20} className="inline mr-2 text-orange-600" />
                Pending Documents
              </h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-3">
                {pendingDocuments.map((doc) => (
                  <div key={doc.id} className="border rounded-lg p-3 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{doc.type}</h4>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(doc.priority)}`}>
                        {doc.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">Case: {doc.caseNumber}</p>
                    <p className="text-xs text-gray-600 mb-2">{doc.client}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Due: {doc.dueDate}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        doc.status === 'received' ? 'bg-green-100 text-green-800' :
                        doc.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                        doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link 
                href="/solicitor/documents"
                className="mt-4 w-full flex items-center justify-center p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <FileText size={16} className="mr-2" />
                Document Manager
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                <Zap size={20} className="inline mr-2 text-purple-600" />
                Quick Actions
              </h3>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 gap-3">
                <Link 
                  href="/solicitor/cases/new"
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
                >
                  <Plus size={20} className="text-blue-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-medium text-gray-900">New Case</p>
                    <p className="text-xs text-gray-600">Start new property transaction</p>
                  </div>
                </Link>
                
                <Link 
                  href="/solicitor/calendar"
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all group"
                >
                  <Calendar size={20} className="text-green-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-medium text-gray-900">Calendar</p>
                    <p className="text-xs text-gray-600">View deadlines & appointments</p>
                  </div>
                </Link>
                
                <Link 
                  href="/solicitor/documents"
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all group"
                >
                  <FileText size={20} className="text-purple-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-medium text-gray-900">Documents</p>
                    <p className="text-xs text-gray-600">{solicitorMetrics.pendingDocuments} pending review</p>
                  </div>
                </Link>
                
                <Link 
                  href="/solicitor/clients"
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-all group"
                >
                  <Users size={20} className="text-amber-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-medium text-gray-900">Clients</p>
                    <p className="text-xs text-gray-600">{solicitorMetrics.totalClients} total clients</p>
                  </div>
                </Link>
                
                <Link 
                  href="/solicitor/compliance"
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
                >
                  <Shield size={20} className="text-indigo-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-medium text-gray-900">KYC/AML</p>
                    <p className="text-xs text-gray-600">Compliance management</p>
                  </div>
                </Link>
                
                <Link 
                  href="/solicitor/reports"
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all group"
                >
                  <BarChart3 size={20} className="text-gray-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-medium text-gray-900">Reports</p>
                    <p className="text-xs text-gray-600">Practice analytics</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
              <Scale size={24} className="text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Legal Practice Management</h4>
              <p className="text-sm text-gray-600">Professional property law practice platform</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/solicitor/reports"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <BarChart3 size={16} className="inline mr-2" />
              Practice Reports
            </Link>
            <Link 
              href="/solicitor/support"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MessageSquare size={16} className="inline mr-2" />
              Legal Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}