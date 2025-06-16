'use client';

import React, { useState } from 'react';
import { 
  Home, 
  TrendingUp, 
  Calculator, 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Euro, 
  Heart, 
  Shield, 
  Target, 
  ArrowRight, 
  PiggyBank, 
  Building2, 
  MapPin, 
  Star, 
  Award, 
  BarChart3, 
  Activity, 
  DollarSign, 
  Download, 
  Plus, 
  RefreshCw, 
  ExternalLink,
  Bell,
  MessageSquare,
  Users,
  Zap,
  Settings,
  CreditCard,
  Phone,
  Mail,
  Calendar as CalendarIcon
} from 'lucide-react';
import Link from 'next/link';

interface DashboardMetrics {
  totalBudget: number;
  availableFunds: number;
  htbBenefit: number;
  monthlyPayment: number;
  propertiesViewed: number;
  documentsCompleted: number;
  verificationStatus: 'pending' | 'in_progress' | 'completed';
  journeyStage: string;
  completionPercentage: number;
  nextMilestone: string;
  estimatedCompletion: string;
}

interface RecentActivity {
  id: string;
  type: 'document' | 'property' | 'appointment' | 'application' | 'message';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'pending' | 'action_required';
}

interface UpcomingTask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  category: 'financial' | 'legal' | 'property' | 'documentation';
}

export default function BuyerDashboard() {
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Dashboard metrics
  const metrics: DashboardMetrics = {
    totalBudget: 420000,
    availableFunds: 350000,
    htbBenefit: 30000,
    monthlyPayment: 1850,
    propertiesViewed: 12,
    documentsCompleted: 8,
    verificationStatus: 'completed',
    journeyStage: 'Property Search',
    completionPercentage: 72,
    nextMilestone: 'Property Reservation',
    estimatedCompletion: '6-8 weeks'
  };

  // Recent activity
  const recentActivity: RecentActivity[] = [
    {
      id: '1',
      type: 'property',
      title: 'Viewed Fitzgerald Gardens Unit 23',
      description: 'Added to saved properties',
      timestamp: '2 hours ago',
      status: 'success'
    },
    {
      id: '2',
      type: 'document',
      title: 'Payslip uploaded',
      description: 'Document verified successfully',
      timestamp: '1 day ago',
      status: 'success'
    },
    {
      id: '3',
      type: 'appointment',
      title: 'Mortgage consultation scheduled',
      description: 'Tomorrow at 2:00 PM',
      timestamp: '2 days ago',
      status: 'pending'
    },
    {
      id: '4',
      type: 'application',
      title: 'HTB application submitted',
      description: 'Application under review',
      timestamp: '3 days ago',
      status: 'pending'
    },
    {
      id: '5',
      type: 'message',
      title: 'Message from solicitor',
      description: 'Response required for contract query',
      timestamp: '4 days ago',
      status: 'action_required'
    }
  ];

  // Upcoming tasks
  const upcomingTasks: UpcomingTask[] = [
    {
      id: '1',
      title: 'Complete mortgage application',
      description: 'Submit final mortgage application with all supporting documents',
      dueDate: 'Due in 2 days',
      priority: 'high',
      category: 'financial'
    },
    {
      id: '2',
      title: 'Schedule property viewings',
      description: 'Book viewing appointments for 3 shortlisted properties',
      dueDate: 'Due in 4 days',
      priority: 'high',
      category: 'property'
    },
    {
      id: '3',
      title: 'Upload bank statements',
      description: 'Upload last 6 months of bank statements',
      dueDate: 'Due in 1 week',
      priority: 'medium',
      category: 'documentation'
    },
    {
      id: '4',
      title: 'Select solicitor',
      description: 'Choose legal representation for property purchase',
      dueDate: 'Due in 2 weeks',
      priority: 'medium',
      category: 'legal'
    }
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'property':
        return <Home size={16} className="text-blue-600" />;
      case 'document':
        return <FileText size={16} className="text-green-600" />;
      case 'appointment':
        return <Calendar size={16} className="text-purple-600" />;
      case 'application':
        return <Shield size={16} className="text-amber-600" />;
      case 'message':
        return <MessageSquare size={16} className="text-indigo-600" />;
      default:
        return <Activity size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-amber-600 bg-amber-50';
      case 'action_required':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'financial':
        return <Euro size={16} className="text-green-600" />;
      case 'legal':
        return <Shield size={16} className="text-purple-600" />;
      case 'property':
        return <Home size={16} className="text-blue-600" />;
      case 'documentation':
        return <FileText size={16} className="text-amber-600" />;
      default:
        return <Target size={16} className="text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Buyer Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Your complete home buying command center
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
          <Link 
            href="/buyer/overview"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <BarChart3 size={16} className="inline mr-2" />
            Overview
          </Link>
          <Link 
            href="/buyer/journey"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <TrendingUp size={16} className="inline mr-2" />
            Journey
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Available Funds */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available Funds</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.availableFunds)}</p>
              <p className="text-sm text-gray-500">of {formatCurrency(metrics.totalBudget)} budget</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
              <Euro size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* HTB Benefit */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">HTB Benefit</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.htbBenefit)}</p>
              <p className="text-sm text-gray-500">eligible amount</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-pink-100 rounded-lg flex items-center justify-center">
              <Heart size={24} className="text-red-600" />
            </div>
          </div>
        </div>

        {/* Journey Progress */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Journey Progress</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.completionPercentage}%</p>
              <p className="text-sm text-gray-500">{metrics.journeyStage}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        {/* Properties Viewed */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Properties Viewed</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.propertiesViewed}</p>
              <p className="text-sm text-gray-500">this month</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-violet-100 rounded-lg flex items-center justify-center">
              <Building2 size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Journey Status Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Current Journey Stage</h3>
            <p className="text-xl font-bold">{metrics.journeyStage}</p>
            <p className="text-blue-100">Next: {metrics.nextMilestone}</p>
            <p className="text-blue-100 text-sm">Estimated completion: {metrics.estimatedCompletion}</p>
          </div>
          <div className="text-right">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-2">
              <span className="text-2xl font-bold">{metrics.completionPercentage}%</span>
            </div>
            <p className="text-sm text-blue-100">Complete</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                <Target size={20} className="inline mr-2 text-blue-600" />
                Upcoming Tasks
              </h3>
              <Link 
                href="/buyer/tasks"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View All
                <ExternalLink size={14} className="inline ml-1" />
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="rounded-lg p-2 bg-blue-100">
                        {getCategoryIcon(task.category)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{task.title}</h4>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                        <div className="flex items-center gap-1">
                          <Clock size={14} className="text-gray-400" />
                          <span className="text-xs text-gray-500">{task.dueDate}</span>
                        </div>
                      </div>
                    </div>
                    <Link 
                      href={`/buyer/tasks/${task.id}`}
                      className="ml-4 p-2 hover:bg-gray-100 rounded transition-colors"
                    >
                      <ArrowRight size={16} className="text-gray-400" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              <Activity size={20} className="inline mr-2 text-green-600" />
              Recent Activity
            </h3>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`rounded-lg p-2 ${getStatusColor(activity.status)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{activity.title}</h4>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                  </div>
                  {activity.status === 'action_required' && (
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                      Action Required
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            <Zap size={20} className="inline mr-2 text-amber-600" />
            Quick Actions
          </h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link 
              href="/buyer/calculator"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
            >
              <Calculator size={24} className="text-blue-600 group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-medium text-gray-900">Calculator</p>
                <p className="text-xs text-gray-600">Check affordability</p>
              </div>
            </Link>
            
            <Link 
              href="/buyer/documents"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all group"
            >
              <FileText size={24} className="text-purple-600 group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-medium text-gray-900">Documents</p>
                <p className="text-xs text-gray-600">Upload & manage</p>
              </div>
            </Link>
            
            <Link 
              href="/buyer/appointments"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all group"
            >
              <Calendar size={24} className="text-orange-600 group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-medium text-gray-900">Appointments</p>
                <p className="text-xs text-gray-600">Schedule meetings</p>
              </div>
            </Link>
            
            <Link 
              href="/buyer/support"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all group"
            >
              <MessageSquare size={24} className="text-green-600 group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-medium text-gray-900">Support</p>
                <p className="text-xs text-gray-600">Get help</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}