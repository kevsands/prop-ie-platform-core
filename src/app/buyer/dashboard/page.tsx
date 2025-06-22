'use client';

import React, { useState, useEffect } from 'react';
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
  Calendar as CalendarIcon,
  Sparkles,
  Grid,
  List,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import PersonalizedPropertyCard from '@/components/properties/PersonalizedPropertyCard';
import { usePropertyRecommendations } from '@/hooks/usePropertyRecommendations';
import { UserProfile } from '@/lib/algorithms/PropertyRecommendationEngine';
import GuidedTour from '@/components/onboarding/GuidedTour';
import { getToursForUser } from '@/lib/tours/tourDefinitions';

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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favoriteProperties, setFavoriteProperties] = useState<string[]>([]);
  const [activeTour, setActiveTour] = useState<string | undefined>();

  // Check if user should see onboarding tour
  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    const completedTours = JSON.parse(localStorage.getItem('completedTours') || '[]');
    
    // Start dashboard tour for new users
    if (!onboardingCompleted && !completedTours.includes('dashboard-navigation')) {
      setActiveTour('dashboard-navigation');
    }
  }, []);

  // Build user profile for recommendations
  useEffect(() => {
    const buildUserProfile = () => {
      // Get stored registration data
      const storedData = localStorage.getItem('userRegistration');
      let profile: UserProfile = {};

      if (storedData) {
        const registrationData = JSON.parse(storedData);
        profile = {
          firstName: registrationData.firstName,
          lastName: registrationData.lastName,
          email: registrationData.email,
          journeySource: registrationData.journeyContext?.source,
        };
      }

      // For demo purposes, add some sample preferences
      // In production, this would come from user's saved preferences
      profile = {
        ...profile,
        budget: '350-450',
        hasHTB: true,
        preferredCounties: ['Dublin', 'Kildare'],
        propertyType: ['apartment', 'house'],
        bedrooms: '2-3',
        currentStatus: 'first-time-buyer',
        importantFeatures: ['parking', 'balcony', 'modern kitchen'],
        moveInTimeframe: '3-6-months',
        completionScore: 75
      };

      setUserProfile(profile);
    };

    buildUserProfile();
  }, []);

  // Get property recommendations
  const { 
    recommendations, 
    analytics, 
    loading: recommendationsLoading, 
    error: recommendationsError,
    refetch: refetchRecommendations
  } = usePropertyRecommendations({
    userProfile: userProfile || undefined,
    limit: 6,
    autoFetch: !!userProfile
  });

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

  // State for real tasks
  const [realTasks, setRealTasks] = useState<UpcomingTask[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  
  // Fetch real tasks from API
  useEffect(() => {
    const fetchRealTasks = async () => {
      try {
        const response = await fetch('/api/tasks?limit=8&status=pending,in_progress');
        if (response.ok) {
          const data = await response.json();
          const tasks = (data.tasks || []).map((task: any) => ({
            id: task.id,
            title: task.title,
            description: task.description,
            dueDate: task.dueDate || 'No deadline',
            priority: task.priority || 'medium',
            category: task.category || 'documentation',
            taskCode: task.taskCode,
            assignedTo: task.assignedTo,
            estimatedDurationHours: task.estimatedDurationHours
          }));
          setRealTasks(tasks);
        } else {
          // Fallback to demo tasks if API fails
          setRealTasks([
            {
              id: '1',
              title: 'Register with Revenue for HTB (Help to Buy)',
              description: 'Complete HTB registration on Revenue.ie to claim up to €30,000',
              dueDate: 'Due in 2 days',
              priority: 'high',
              category: 'financial'
            },
            {
              id: '2', 
              title: 'Mortgage Approval in Principle (AIP)',
              description: 'Submit mortgage application to Irish bank for pre-approval',
              dueDate: 'Due in 4 days',
              priority: 'high',
              category: 'financial'
            },
            {
              id: '3',
              title: 'Property reservation and booking deposit',
              description: 'Reserve property with €5,000-€10,000 booking deposit',
              dueDate: 'Due in 1 week',
              priority: 'medium',
              category: 'property'
            },
            {
              id: '4',
              title: 'Appoint qualified property solicitor',
              description: 'Select Law Society qualified solicitor for conveyancing',
              dueDate: 'Due in 2 weeks',
              priority: 'medium',
              category: 'legal'
            }
          ]);
        }
      } catch (error) {
        console.warn('Failed to fetch real tasks:', error);
        // Use demo tasks as fallback
        setRealTasks([
          {
            id: '1',
            title: 'Register with Revenue for HTB (Help to Buy)',
            description: 'Complete HTB registration on Revenue.ie to claim up to €30,000',
            dueDate: 'Due in 2 days',
            priority: 'high',
            category: 'financial'
          }
        ]);
      } finally {
        setTasksLoading(false);
      }
    };
    
    fetchRealTasks();
  }, []);

  // Use real tasks if available, otherwise use demo tasks
  const upcomingTasks = realTasks.length > 0 ? realTasks : [
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
    await refetchRecommendations();
    setRefreshing(false);
  };

  const handleFavorite = (propertyId: string) => {
    setFavoriteProperties(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
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
      {/* Enhanced Header Section */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Home className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
              <p className="text-gray-600">
                {userProfile?.firstName ? `Hi ${userProfile.firstName}, ` : ''}your property journey continues
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock size={14} />
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="ml-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                title="Refresh dashboard data"
              >
                <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              </button>
            </div>
            
            {/* Journey Progress Indicator */}
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
              <TrendingUp size={14} />
              <span>{metrics.completionPercentage}% Complete</span>
            </div>
            
            {/* Quick Status */}
            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
              <CheckCircle size={14} />
              <span>{metrics.documentsCompleted}/12 Documents</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.open('/buyer/calculator', '_blank')}
            className="flex items-center gap-2 px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm"
            title="Quick affordability check"
          >
            <Calculator size={16} />
            <span className="hidden sm:inline">Calculator</span>
          </button>
          
          <Link 
            href="/buyer/overview"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <BarChart3 size={16} className="inline mr-2" />
            Overview
          </Link>
          
          <Link 
            href="/buyer/journey"
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all text-sm font-medium"
          >
            <TrendingUp size={16} className="inline mr-2" />
            Continue Journey
          </Link>
        </div>
      </div>

      {/* Enhanced Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-tour="quick-stats">
        {/* Available Funds */}
        <Link href="/buyer/calculator" className="block group">
          <div className="bg-white rounded-xl border shadow-sm p-6 hover:shadow-lg hover:border-green-300 transition-all group-hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Available Funds</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.availableFunds)}</p>
                <p className="text-sm text-gray-500">of {formatCurrency(metrics.totalBudget)} budget</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                    style={{ width: `${(metrics.availableFunds / metrics.totalBudget) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Euro size={24} className="text-green-600" />
              </div>
            </div>
          </div>
        </Link>

        {/* HTB Benefit */}
        <Link href="/buyer/htb" className="block group">
          <div className="bg-white rounded-xl border shadow-sm p-6 hover:shadow-lg hover:border-red-300 transition-all group-hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">HTB Benefit</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.htbBenefit)}</p>
                <p className="text-sm text-gray-500">eligible amount</p>
                <div className="flex items-center gap-1 mt-2">
                  <CheckCircle size={14} className="text-green-500" />
                  <span className="text-xs text-green-600 font-medium">Registered</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-pink-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart size={24} className="text-red-600" />
              </div>
            </div>
          </div>
        </Link>

        {/* Journey Progress */}
        <Link href="/buyer/journey" className="block group">
          <div className="bg-white rounded-xl border shadow-sm p-6 hover:shadow-lg hover:border-blue-300 transition-all group-hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Journey Progress</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.completionPercentage}%</p>
                <p className="text-sm text-gray-500">{metrics.journeyStage}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                    style={{ width: `${metrics.completionPercentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp size={24} className="text-blue-600" />
              </div>
            </div>
          </div>
        </Link>

        {/* Properties Viewed */}
        <Link href="/properties" className="block group">
          <div className="bg-white rounded-xl border shadow-sm p-6 hover:shadow-lg hover:border-purple-300 transition-all group-hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Properties Viewed</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.propertiesViewed}</p>
                <p className="text-sm text-gray-500">this month</p>
                <div className="flex items-center gap-1 mt-2">
                  <Star size={14} className="text-yellow-500" />
                  <span className="text-xs text-gray-600">{favoriteProperties.length} saved</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-violet-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Building2 size={24} className="text-purple-600" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Enhanced Journey Status Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl p-6 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16"></div>
        </div>
        
        <div className="relative">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Property Journey Progress</h3>
                  <p className="text-blue-100 text-sm">Your personalized path to homeownership</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-blue-100 mb-1">Current Stage</p>
                  <p className="text-xl font-bold">{metrics.journeyStage}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-blue-100 mb-1">Next Milestone</p>
                    <p className="font-medium">{metrics.nextMilestone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-100 mb-1">Estimated Completion</p>
                    <p className="font-medium">{metrics.estimatedCompletion}</p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Journey Progress</span>
                    <span>{metrics.completionPercentage}% Complete</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <div 
                      className="bg-white h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${metrics.completionPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Circular Progress */}
              <div className="relative">
                <div className="w-24 h-24">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="white"
                      strokeOpacity="0.3"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="white"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - metrics.completionPercentage / 100)}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">{metrics.completionPercentage}%</span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <Link 
                  href="/buyer/journey"
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm text-center"
                >
                  <TrendingUp size={16} className="inline mr-2" />
                  Continue Journey
                </Link>
                <Link 
                  href="/buyer/milestones"
                  className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors text-sm text-center"
                >
                  <Target size={16} className="inline mr-2" />
                  View Milestones
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Recommendations Section */}
      <div className="bg-white rounded-lg border shadow-sm" data-tour="recommended-properties">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recommended Properties</h3>
                <p className="text-gray-600 text-sm">AI-powered matches based on your preferences</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => refetchRecommendations()}
                disabled={recommendationsLoading}
                className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw size={14} className={recommendationsLoading ? 'animate-spin' : ''} />
                Refresh
              </button>
              
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {analytics && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4" data-tour="analytics">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">{analytics.totalPropertiesAnalyzed}</div>
                <div className="text-xs text-blue-800">Properties Analyzed</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">{analytics.averageMatchScore}%</div>
                <div className="text-xs text-green-800">Avg Match Score</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-600">{analytics.userProfileCompleteness}%</div>
                <div className="text-xs text-purple-800">Profile Complete</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-lg font-bold text-orange-600">{analytics.topMatchScore}%</div>
                <div className="text-xs text-orange-800">Best Match</div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          {recommendationsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Finding your perfect properties...</p>
            </div>
          ) : recommendationsError ? (
            <div className="text-center py-8">
              <div className="text-red-600 mb-4">
                <AlertCircle size={48} className="mx-auto mb-2" />
                <p>Failed to load recommendations</p>
              </div>
              <button
                onClick={() => refetchRecommendations()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          ) : recommendations.length === 0 ? (
            <div className="text-center py-8">
              <Home size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No recommendations yet</h3>
              <p className="text-gray-600 mb-4">Complete your profile to get personalized property recommendations</p>
              <Link
                href="/buyer/profile-completion"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Complete Profile
              </Link>
            </div>
          ) : (
            <>
              <div className={`grid gap-4 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {recommendations.slice(0, viewMode === 'grid' ? 6 : 3).map((match) => (
                  <PersonalizedPropertyCard
                    key={match.property.id}
                    match={match}
                    onFavorite={handleFavorite}
                    isFavorited={favoriteProperties.includes(match.property.id)}
                    showMatchScore={true}
                    showExplanations={viewMode === 'list'}
                    className={viewMode === 'list' ? 'flex' : ''}
                  />
                ))}
              </div>

              {recommendations.length > (viewMode === 'grid' ? 6 : 3) && (
                <div className="text-center mt-6">
                  <Link
                    href="/properties"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                  >
                    View All {recommendations.length} Recommendations
                    <ChevronRight size={16} />
                  </Link>
                </div>
              )}
            </>
          )}
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
            {tasksLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="border rounded-lg p-4 animate-pulse">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingTasks.slice(0, 4).map((task: any) => (
                  <div key={task.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="rounded-lg p-2 bg-blue-100">
                          {getCategoryIcon(task.category)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{task.title}</h4>
                            {task.taskCode && (
                              <span className="inline-flex px-2 py-1 text-xs font-mono rounded bg-gray-100 text-gray-600">
                                {task.taskCode}
                              </span>
                            )}
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Clock size={14} className="text-gray-400" />
                              <span className="text-xs text-gray-500">{task.dueDate}</span>
                            </div>
                            {task.estimatedDurationHours && (
                              <div className="flex items-center gap-1">
                                <Target size={14} className="text-gray-400" />
                                <span className="text-xs text-gray-500">{task.estimatedDurationHours}h est.</span>
                              </div>
                            )}
                            {task.assignedTo && (
                              <div className="flex items-center gap-1">
                                <Users size={14} className="text-gray-400" />
                                <span className="text-xs text-gray-500">{task.assignedTo}</span>
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
                {upcomingTasks.length === 0 && !tasksLoading && (
                  <div className="text-center py-8">
                    <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
                    <p className="text-gray-600">No pending tasks at the moment.</p>
                  </div>
                )}
              </div>
            )}
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

      {/* Guided Tour */}
      <GuidedTour
        tours={getToursForUser(userProfile)}
        activeTourId={activeTour}
        onTourComplete={(tourId) => {
          console.log(`Tour completed: ${tourId}`);
          setActiveTour(undefined);
        }}
        onTourSkip={(tourId) => {
          console.log(`Tour skipped: ${tourId}`);
          setActiveTour(undefined);
        }}
        onTourStart={(tourId) => {
          console.log(`Tour started: ${tourId}`);
        }}
      />
    </div>
  );
}