'use client';

import React, { useState, useEffect } from 'react';
import { SessionProtectedRoute } from '@/components/auth/SessionProtectedRoute';
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
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { HTBDashboard } from '@/components/buyer/HTBDashboard';
import { useOverviewSync } from '@/hooks/useBuyerSync';

interface BuyerMetrics {
  budget: number;
  htbBenefit: number;
  preApprovalAmount: number;
  monthlyPayment: number;
  savedProperties: number;
  documentsUploaded: number;
  verificationStatus: 'pending' | 'in_progress' | 'completed';
  journeyProgress: number;
  tasksCompleted: number;
  totalTasks: number;
  nextAppointment?: {
    type: string;
    date: string;
    location: string;
  };
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  progress?: number;
  category: 'verification' | 'financial' | 'legal' | 'property';
}

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  beds: number;
  baths: number;
  htbEligible: boolean;
  developer: string;
  status: 'available' | 'reserved' | 'under_review';
  image: string;
}

function BuyerOverview() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('current');
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [buyerMetrics, setBuyerMetrics] = useState<BuyerMetrics | null>(null);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  
  // Use the buyer sync hook for real-time data
  const {
    budget,
    preApprovalAmount,
    htbBenefit,
    savedProperties: syncedSavedProperties,
    propChoiceSelections,
    propChoiceValue,
    overallProgress,
    journeyStatus,
    lastSyncedAt
  } = useOverviewSync();

  // Fetch buyer overview data
  useEffect(() => {
    const fetchBuyerData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/buyer/overview');
        
        if (!response.ok) {
          throw new Error('Failed to fetch buyer data');
        }
        
        const data = await response.json();
        
        setBuyerMetrics(data.metrics);
        setRecentTasks(data.tasks || []);
        setSavedProperties(data.savedProperties || []);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error fetching buyer data:', error);
        // Use synced data as fallback
        setBuyerMetrics({
          budget: budget || 380000,
          htbBenefit: htbBenefit || 30000,
          preApprovalAmount: preApprovalAmount || 350000,
          monthlyPayment: 1650,
          savedProperties: syncedSavedProperties || 7,
          documentsUploaded: 8,
          verificationStatus: 'completed',
          journeyProgress: overallProgress || 75,
          tasksCompleted: 12,
          totalTasks: 16,
          nextAppointment: {
            type: 'Mortgage Consultation',
            date: 'Tomorrow at 2:00 PM',
            location: 'Bank of Ireland, O\'Connell Street'
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBuyerData();
  }, []);


  const timeframes = [
    { value: 'current', label: 'Current Status' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: 'journey', label: 'Full Journey' }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await fetch('/api/buyer/overview');
      if (response.ok) {
        const data = await response.json();
        setBuyerMetrics(data.metrics);
        setRecentTasks(data.tasks || []);
        setSavedProperties(data.savedProperties || []);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
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

  const getTaskIcon = (category: string) => {
    switch (category) {
      case 'verification':
        return <Shield size={16} className="text-blue-600" />;
      case 'financial':
        return <Euro size={16} className="text-green-600" />;
      case 'legal':
        return <FileText size={16} className="text-purple-600" />;
      case 'property':
        return <Home size={16} className="text-amber-600" />;
      default:
        return <Target size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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

  // Show loading state
  if (loading || !buyerMetrics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Buyer Overview</h1>
          <p className="text-gray-600 mt-1">
            Your complete home buying journey dashboard
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
            Export Progress
          </button>
          <Link 
            href="/buyer/journey"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <TrendingUp size={16} className="inline mr-2" />
            View Journey
          </Link>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Budget & Approval */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pre-Approval Amount</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(buyerMetrics.preApprovalAmount)}</p>
              <div className="flex items-center gap-1 mt-1">
                <CheckCircle size={16} className="text-green-600" />
                <span className="text-sm text-green-600 font-medium">Approved</span>
                <span className="text-sm text-gray-500">ready to buy</span>
              </div>
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
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(buyerMetrics.htbBenefit)}</p>
              <div className="flex items-center gap-1 mt-1">
                <Heart size={16} className="text-red-500" />
                <span className="text-sm text-red-600 font-medium">Eligible</span>
                <span className="text-sm text-gray-500">first-time buyer</span>
              </div>
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
              <p className="text-2xl font-bold text-gray-900">{buyerMetrics.journeyProgress}%</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" />
                <span className="text-sm text-blue-600 font-medium">Active</span>
                <span className="text-sm text-gray-500">house hunting</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        {/* Saved Properties */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Saved Properties</p>
              <p className="text-2xl font-bold text-gray-900">{buyerMetrics.savedProperties}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star size={16} className="text-amber-500 fill-current" />
                <span className="text-sm text-amber-600 font-medium">Shortlisted</span>
                <span className="text-sm text-gray-500">for viewing</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
              <Building2 size={24} className="text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Help-to-Buy Dashboard */}
      <HTBDashboard />

      {/* Next Appointment Alert */}
      {buyerMetrics.nextAppointment && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Upcoming Appointment</h3>
              <p className="text-lg font-medium">{buyerMetrics.nextAppointment.type}</p>
              <p className="text-blue-100">{buyerMetrics.nextAppointment.date}</p>
              <p className="text-blue-100 text-sm">{buyerMetrics.nextAppointment.location}</p>
            </div>
            <div className="flex gap-3">
              <Link 
                href="/buyer/appointments"
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm"
              >
                View Details
              </Link>
              <Link 
                href="/buyer/appointments/reschedule"
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors text-sm"
              >
                Reschedule
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Tasks */}
        <div className="lg:col-span-2 bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                <Target size={20} className="inline mr-2 text-blue-600" />
                Priority Tasks
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{buyerMetrics.tasksCompleted}/{buyerMetrics.totalTasks} completed</span>
                <Link 
                  href="/buyer/tasks"
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  View All
                  <ExternalLink size={14} className="inline ml-1" />
                </Link>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`rounded-lg p-2 ${
                        task.status === 'completed' 
                          ? 'bg-green-100' 
                          : task.priority === 'high'
                          ? 'bg-red-100' 
                          : 'bg-blue-100'
                      }`}>
                        {getTaskIcon(task.category)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{task.title}</h4>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                        <div className="flex items-center gap-4">
                          {task.dueDate && (
                            <div className="flex items-center gap-1">
                              <Clock size={14} className="text-gray-400" />
                              <span className="text-xs text-gray-500">Due in {task.dueDate}</span>
                            </div>
                          )}
                          {task.progress !== undefined && (
                            <div className="flex items-center gap-2 flex-1">
                              <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-32">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${task.progress}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-600">{task.progress}%</span>
                            </div>
                          )}
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

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              <Zap size={20} className="inline mr-2 text-amber-600" />
              Quick Actions
            </h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 gap-3">
              <Link 
                href="/buyer/calculator"
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                <Calculator size={20} className="text-blue-600 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-medium text-gray-900">Affordability Calculator</p>
                  <p className="text-xs text-gray-600">Check what you can afford</p>
                </div>
              </Link>
              
              <Link 
                href="/buyer/calculator/htb"
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all group"
              >
                <Heart size={20} className="text-red-600 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-medium text-gray-900">HTB Calculator</p>
                  <p className="text-xs text-gray-600">Calculate your benefit</p>
                </div>
              </Link>
              
              <Link 
                href="/buyer/documents"
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all group"
              >
                <FileText size={20} className="text-purple-600 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-medium text-gray-900">Document Manager</p>
                  <p className="text-xs text-gray-600">{buyerMetrics.documentsUploaded} uploaded</p>
                </div>
              </Link>
              
              <Link 
                href="/buyer/verification"
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all group"
              >
                <Shield size={20} className="text-green-600 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-medium text-gray-900">Identity Verification</p>
                  <p className="text-xs text-gray-600">Status: {buyerMetrics.verificationStatus}</p>
                </div>
              </Link>
              
              <Link 
                href="/buyer/messages"
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
              >
                <MessageSquare size={20} className="text-indigo-600 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-medium text-gray-900">Messages</p>
                  <p className="text-xs text-gray-600">Chat with experts</p>
                </div>
              </Link>
              
              <Link 
                href="/buyer/appointments"
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all group"
              >
                <Calendar size={20} className="text-orange-600 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-medium text-gray-900">Appointments</p>
                  <p className="text-xs text-gray-600">Schedule consultations</p>
                </div>
              </Link>
            </div>

            {/* Progress Summary */}
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-semibold text-gray-900 mb-3">Journey Progress</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Financial Planning</span>
                  <span className="text-sm font-medium text-green-600">Complete</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Property Search</span>
                  <span className="text-sm font-medium text-blue-600">In Progress</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Legal Process</span>
                  <span className="text-sm font-medium text-gray-500">Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Properties */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              <Star size={20} className="inline mr-2 text-amber-600" />
              Saved Properties
            </h3>
            <Link 
              href="/buyer/saved-properties"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              View All ({buyerMetrics.savedProperties})
              <ExternalLink size={14} className="inline ml-1" />
            </Link>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProperties.map((property) => (
              <Link 
                key={property.id}
                href={`/properties/${property.id}`}
                className="group"
              >
                <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 group-hover:border-blue-300">
                  <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    {property.htbEligible && (
                      <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                        HTB Eligible
                      </div>
                    )}
                    {property.status === 'reserved' && (
                      <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Reserved
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 text-white">
                      <h4 className="font-semibold">{property.title}</h4>
                      <p className="text-sm opacity-90 flex items-center gap-1">
                        <MapPin size={14} />
                        {property.location}
                      </p>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl font-bold text-blue-600">{formatCurrency(property.price)}</span>
                      <span className="text-sm text-gray-500">{property.beds} bed • {property.baths} bath</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">by {property.developer}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        property.status === 'available' ? 'bg-green-100 text-green-800' :
                        property.status === 'reserved' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {property.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
              <Home size={24} className="text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">First-Time Buyer Portal</h4>
              <p className="text-sm text-gray-600">Your complete home buying journey platform</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/buyer/journey"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <TrendingUp size={16} className="inline mr-2" />
              Journey Timeline
            </Link>
            <Link 
              href="/buyer/support"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MessageSquare size={16} className="inline mr-2" />
              Get Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BuyerOverviewPage() {
  return (
    <SessionProtectedRoute requiredRoles={['buyer', 'first_time_buyer']}>
      <BuyerOverview />
    </SessionProtectedRoute>
  );
}