'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { transactionCoordinator } from '@/services/transactionCoordinator';
import { notificationService, NotificationData } from '@/services/notificationService';
import {
  Home,
  TrendingUp,
  Calculator,
  FileText,
  Bell,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
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
  Loader2,
  BarChart3,
  Activity,
  DollarSign,
  Info,
  Download,
  ChevronUp,
  MessageSquare
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  icon: React.ComponentType<any>;
  progress?: number;
}

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  status: 'available' | 'under-review' | 'reserved';
  htbEligible: boolean;
  developer: string;
  completionDate: string;
}

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
  action?: {
    label: string;
    href: string;
  };
}

interface Transaction {
  id: string;
  status: string;
  projectId: string;
  buyerId: string;
  createdAt: Date;
  milestones?: Array<{
    id: string;
    name: string;
    description: string;
    status: string;
    dueDate?: Date;
  }>;
  participants?: Array<{
    id: string;
    userId: string;
    role: string;
  }>;
}

export default function BuyerOverviewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [activeTransactions, setActiveTransactions] = useState<Transaction[]>([]);
  const [realTimeNotifications, setRealTimeNotifications] = useState<NotificationData[]>([]);

  useEffect(() => {
    // Load real-time notifications for this user
    const loadNotifications = () => {
      // Mock buyer ID - in production this would come from auth context
      const buyerId = 'mock-buyer-id';
      
      // Load existing notifications
      const userNotifications = notificationService.getUserNotifications(buyerId);
      setRealTimeNotifications(userNotifications);
      
      // Subscribe to new notifications
      const handleNewNotification = (notification: NotificationData) => {
        if (notification.recipient === buyerId) {
          setRealTimeNotifications(prev => [notification, ...prev]);
        }
      };
      
      notificationService.onNewNotification(handleNewNotification);
      
      return () => {
        notificationService.removeListener('notification', handleNewNotification);
      };
    };
    
    loadNotifications();
    
    // Check for recent transactions from purchase flow
    const checkForRecentTransactions = () => {
      // Check localStorage for recent transaction completion
      const recentPurchase = localStorage.getItem('recentTransactionCompleted');
      const transactionData = localStorage.getItem('lastTransactionData');
      
      let activeReservation = null;
      let transactions: Transaction[] = [];
      
      if (recentPurchase === 'true' && transactionData) {
        try {
          const transaction = JSON.parse(transactionData);
          transactions.push(transaction);
          
          // Create active reservation from transaction data
          activeReservation = {
            id: transaction.id,
            property: 'Fitzgerald Gardens - 3 Bed Semi-Detached House',
            price: 375000,
            depositPaid: 500,
            depositRemaining: 4500,
            daysRemaining: 28,
            nextPaymentDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            transactionId: transaction.id,
            status: transaction.status
          };
          
          // Add success notification
          const successNotification = {
            id: 'transaction-success',
            type: 'success' as const,
            title: 'Property Reserved Successfully!',
            message: `Transaction ${transaction.id} created. Your property has been secured.`,
            time: 'Just now',
            read: false,
            action: {
              label: 'View Transaction',
              href: `/buyer/transactions/${transaction.id}`
            }
          };
          
          // Clear the flag so it doesn't show again
          localStorage.removeItem('recentTransactionCompleted');
        } catch (error) {
          console.error('Error parsing transaction data:', error);
        }
      }
      
      return { activeReservation, transactions };
    };
    
    // Simulate loading user data
    setTimeout(() => {
      const { activeReservation, transactions } = checkForRecentTransactions();
      
      setActiveTransactions(transactions);
      setUserData({
        name: 'John Doe',
        budget: 380000,
        htbBenefit: 30000,
        verificationStatus: 'completed',
        documentCount: 3,
        savedProperties: 7,
        viewingsScheduled: 2,
        preApprovalAmount: 350000,
        monthlyPayment: 1650,
        journeyProgress: activeReservation ? 85 : 75, // Higher progress if they have an active reservation
        nextAppointment: {
          type: activeReservation ? 'Property Viewing' : 'Mortgage Consultation',
          date: 'Tomorrow at 2:00 PM',
          location: activeReservation ? 'Fitzgerald Gardens Sales Office' : 'Bank of Ireland, O\'Connell Street'
        },
        activeReservation
      });
      setLoading(false);
    }, 1000);
  }, []);

  const tasks: Task[] = [
    {
      id: '1',
      title: 'Complete Identity Verification',
      description: 'Upload your passport and proof of address',
      status: 'pending',
      priority: 'high',
      icon: Shield,
      dueDate: 'Today',
      progress: 50
    },
    {
      id: '2',
      title: 'Submit Financial Documents',
      description: 'Provide bank statements and payslips',
      status: 'pending',
      priority: 'high',
      icon: FileText,
      dueDate: 'Tomorrow',
      progress: 0
    },
    {
      id: '3',
      title: 'HTB Application',
      description: 'Apply for Help-to-Buy benefit',
      status: 'pending',
      priority: 'medium',
      icon: Heart,
      dueDate: 'Next Week',
      progress: 0
    },
    {
      id: '4',
      title: 'Schedule Property Viewing',
      description: 'Book viewing for Riverside Manor',
      status: 'in-progress',
      priority: 'medium',
      icon: Calendar,
      progress: 66
    }
  ];

  const savedProperties: Property[] = [
    {
      id: '1',
      title: 'Riverside Manor - Type A',
      price: 375000,
      location: 'Dublin 15',
      beds: 3,
      baths: 2,
      sqft: 1200,
      image: '/images/riverside-manor/hero.jpg',
      status: 'available',
      htbEligible: true,
      developer: 'Cairn Homes',
      completionDate: 'Q4 2025'
    },
    {
      id: '2',
      title: 'Fitzgerald Gardens - 2 Bed',
      price: 295000,
      location: 'Cork City',
      beds: 2,
      baths: 1,
      sqft: 850,
      image: '/images/fitzgerald-gardens/hero.jpg',
      status: 'under-review',
      htbEligible: true,
      developer: 'Glenveagh Properties',
      completionDate: 'Q2 2025'
    }
  ];

  const notifications: Notification[] = [
    {
      id: '1',
      type: 'success',
      title: 'Mortgage Pre-Approval',
      message: 'Congratulations! You\'ve been pre-approved for €350,000',
      time: '2 hours ago',
      read: false,
      action: {
        label: 'View Details',
        href: '/buyer/mortgage/approval'
      }
    },
    {
      id: '2',
      type: 'warning',
      title: 'Document Required',
      message: 'Please upload your latest bank statement',
      time: '1 day ago',
      read: false,
      action: {
        label: 'Upload Now',
        href: '/buyer/documents'
      }
    },
    {
      id: '3',
      type: 'info',
      title: 'New Property Match',
      message: '3 new properties match your preferences',
      time: '2 days ago',
      read: true,
      action: {
        label: 'View Properties',
        href: '/properties'
      }
    }
  ];

  const metrics = [
    {
      title: 'Your Budget',
      value: userData?.budget || 0,
      subtitle: 'Including HTB',
      format: 'currency',
      icon: Euro,
      color: 'bg-blue-500',
      trend: {
        value: '+12%',
        label: 'vs. initial estimate'
      }
    },
    {
      title: 'Monthly Payment',
      value: userData?.monthlyPayment || 0,
      subtitle: 'Estimated',
      format: 'currency',
      icon: Calendar,
      color: 'bg-green-500',
      trend: {
        value: '€1,650',
        label: 'per month'
      }
    },
    {
      title: 'HTB Benefit',
      value: userData?.htbBenefit || 0,
      subtitle: 'Available',
      format: 'currency',
      icon: Heart,
      color: 'bg-red-500',
      trend: {
        value: '€30k',
        label: 'maximum'
      }
    },
    {
      title: 'Journey Progress',
      value: userData?.journeyProgress || 0,
      subtitle: 'Complete',
      format: 'percentage',
      icon: TrendingUp,
      color: 'bg-purple-500',
      trend: {
        value: '25%',
        label: 'this month'
      }
    }
  ];

  const formatValue = (value: number, format?: string) => {
    if (format === 'currency') {
      return `€${value.toLocaleString()}`;
    }
    if (format === 'percentage') {
      return `${value}%`;
    }
    return value.toLocaleString();
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole={['buyer', 'admin']}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole={['buyer', 'admin']}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Active Reservation Alert */}
          {userData && userData.activeReservation && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 rounded-full p-2">
                  <Home className="w-6 h-6 text-green-800" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-green-900 mb-1">Active Property Reservation</h3>
                  <p className="text-green-800 text-sm mb-1">
                    {userData.activeReservation.property} • {userData.activeReservation.daysRemaining} days remaining
                  </p>
                  {userData.activeReservation.transactionId && (
                    <p className="text-green-700 text-xs mb-3 font-mono">
                      Transaction ID: {userData.activeReservation.transactionId}
                    </p>
                  )}
                  <div className="grid sm:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-green-700">Deposit Paid</p>
                      <p className="font-semibold text-green-900">€{userData.activeReservation.depositPaid}</p>
                    </div>
                    <div>
                      <p className="text-xs text-green-700">Remaining</p>
                      <p className="font-semibold text-orange-600">€{userData.activeReservation.depositRemaining}</p>
                    </div>
                    <div>
                      <p className="text-xs text-green-700">Next Payment</p>
                      <p className="font-semibold text-green-900">{userData.activeReservation.nextPaymentDue.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-green-700">Status</p>
                      <p className="font-semibold text-blue-600 capitalize">
                        {userData.activeReservation.status?.toLowerCase().replace('_', ' ') || 'Active'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => router.push('/buyer/journey/reservation')}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      View Transaction Details
                    </button>
                    <button
                      className="bg-white text-green-800 border border-green-300 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors text-sm"
                    >
                      Pay Remaining Deposit
                    </button>
                    <button
                      onClick={() => router.push('/buyer/journey/reservation#milestones')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      View Milestones
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Verification Alert Banner - Now only shows if not verified */}
          {userData && userData.verificationStatus === 'pending' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="bg-yellow-100 rounded-full p-2">
                  <Shield className="w-6 h-6 text-yellow-800" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-yellow-900 mb-1">Complete Your KYC Verification</h3>
                  <p className="text-yellow-800 text-sm mb-3">
                    You need to complete your KYC/AML verification before you can make a booking deposit or secure a property.
                    This process ensures compliance with Irish property regulations and protects all parties.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => router.push('/buyer/verification')}
                      className="bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-700 transition-colors text-sm flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      Complete Verification Now
                    </button>
                    <button
                      onClick={() => router.push('/buyer/verification#requirements')}
                      className="bg-white text-yellow-800 border border-yellow-300 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-50 transition-colors text-sm"
                    >
                      View Requirements
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Welcome Section with Next Appointment */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  Welcome back, {userData.name}!
                </h1>
                <p className="text-blue-100 mb-4">
                  You're <span className="font-semibold text-white">{userData.journeyProgress}%</span> through your home buying journey
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => router.push('/buyer/calculator')}
                    className="bg-white text-blue-600 px-5 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-sm"
                  >
                    Update Budget
                  </button>
                  <button
                    onClick={() => router.push('/properties')}
                    className="bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors text-sm"
                  >
                    Browse Properties
                  </button>
                </div>
              </div>
              
              {userData.nextAppointment && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Next Appointment
                  </h3>
                  <p className="font-medium text-base mb-1">{userData.nextAppointment.type}</p>
                  <p className="text-blue-100 text-sm mb-1">{userData.nextAppointment.date}</p>
                  <p className="text-blue-100 text-sm mb-2">{userData.nextAppointment.location}</p>
                  <button className="text-sm underline hover:no-underline">
                    View Details →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {metrics.map((metric) => (
              <div key={metric.title} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className={`${metric.color} text-white rounded-lg p-2`}>
                    <metric.icon className="w-5 h-5" />
                  </div>
                  {metric.trend && (
                    <div className="text-right">
                      <div className="text-green-600 font-semibold text-sm">
                        {metric.trend.value}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {metric.trend.label}
                      </div>
                    </div>
                  )}
                </div>
                <h3 className="text-gray-600 text-sm mb-1">{metric.title}</h3>
                <p className="text-xl font-bold text-gray-900">
                  {formatValue(metric.value, metric.format)}
                </p>
                <p className="text-gray-500 text-xs mt-1">{metric.subtitle}</p>
              </div>
            ))}
          </div>

          {/* Three Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tasks Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-4 md:p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg md:text-xl font-bold text-gray-900">Your Tasks</h2>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">
                        {tasks.filter(t => t.status === 'pending').length} pending
                      </span>
                      <button className="text-blue-600 hover:underline text-sm font-medium">
                        View All
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 md:p-6">
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`border rounded-lg p-3 md:p-4 hover:shadow-md transition-all cursor-pointer group ${
                          task.status === 'completed' ? 'bg-gray-50' : ''
                        }`}
                        onClick={() => {
                          // Special handling for verification task
                          if (task.id === '1' && task.title.includes('Identity Verification')) {
                            router.push('/buyer/verification');
                          } else {
                            router.push(`/buyer/tasks/${task.id}`);
                          }
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={`rounded-lg p-2 ${
                              task.status === 'completed' 
                                ? 'bg-green-100 text-green-600'
                                : task.priority === 'high'
                                ? 'bg-red-100 text-red-600'
                                : 'bg-blue-100 text-blue-600'
                            }`}>
                              <task.icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <h3 className={`font-semibold text-sm ${
                                task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'
                              }`}>
                                {task.title}
                                {task.priority === 'high' && task.status !== 'completed' && (
                                  <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                                    Urgent
                                  </span>
                                )}
                              </h3>
                              <p className="text-xs text-gray-600 mt-1">
                                {task.description}
                              </p>
                              <div className="flex items-center gap-4 mt-2">
                                {task.dueDate && (
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-500">
                                      Due: {task.dueDate}
                                    </span>
                                  </div>
                                )}
                                {task.progress !== undefined && task.status !== 'completed' && (
                                  <div className="flex items-center gap-2 flex-1">
                                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                      <div 
                                        className="bg-blue-600 h-1.5 rounded-full"
                                        style={{ width: `${task.progress}%` }}
                                      />
                                    </div>
                                    <span className="text-xs text-gray-600">
                                      {task.progress}%
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Transaction Milestones */}
              {activeTransactions.length> 0 && (
                <div className="bg-white rounded-xl shadow-sm mt-6">
                  <div className="p-4 md:p-6 border-b">
                    <h2 className="text-lg md:text-xl font-bold text-gray-900">Transaction Progress</h2>
                    <p className="text-sm text-gray-600">Track your property purchase milestones</p>
                  </div>
                  
                  <div className="p-4 md:p-6">
                    {activeTransactions.map((transaction) => (
                      <div key={transaction.id} className="mb-6 last:mb-0">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-gray-900">Transaction {transaction.id}</h3>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                            {transaction.status.toLowerCase().replace('_', ' ')}
                          </span>
                        </div>
                        
                        {transaction.milestones && transaction.milestones.length> 0 && (
                          <div className="space-y-3">
                            {transaction.milestones.map((milestoneindex) => (
                              <div key={milestone.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  milestone.status === 'COMPLETED' ? 'bg-green-600 text-white' :
                                  milestone.status === 'IN_PROGRESS' ? 'bg-blue-600 text-white' :
                                  'bg-gray-300 text-gray-600'
                                }`}>
                                  {milestone.status === 'COMPLETED' ? (
                                    <CheckCircle className="w-4 h-4" />
                                  ) : (
                                    <span className="text-xs font-bold">{index + 1}</span>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900">{milestone.name}</h4>
                                  <p className="text-sm text-gray-600">{milestone.description}</p>
                                  {milestone.dueDate && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      Due: {new Date(milestone.dueDate).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                                <div className={`px-2 py-1 rounded text-xs font-medium ${
                                  milestone.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                  milestone.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-600'
                                }`}>
                                  {milestone.status === 'COMPLETED' ? 'Complete' :
                                   milestone.status === 'IN_PROGRESS' ? 'In Progress' : 'Pending'}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Saved Properties */}
              <div className="bg-white rounded-xl shadow-sm mt-6">
                <div className="p-4 md:p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg md:text-xl font-bold text-gray-900">Saved Properties</h2>
                    <button
                      onClick={() => router.push('/buyer/saved-properties')}
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      View all ({userData.savedProperties})
                    </button>
                  </div>
                </div>

                <div className="p-4 md:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedProperties.map((property) => (
                      <div
                        key={property.id}
                        className="border rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                        onClick={() => router.push(`/properties/${property.id}`)}
                      >
                        <div className="h-40 bg-gray-200 relative">
                          <img
                            src={property.image}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                          {property.htbEligible && (
                            <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                              HTB Eligible
                            </div>
                          )}
                          <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                            {property.completionDate}
                          </div>
                        </div>
                        <div className="p-3">
                          <h3 className="font-semibold text-sm text-gray-900 mb-1">{property.title}</h3>
                          <p className="text-lg font-bold text-blue-600 mb-1">
                            €{property.price.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {property.location}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-2">
                              <span>{property.beds} beds</span>
                              <span>{property.baths} baths</span>
                              <span>{property.sqft} sq ft</span>
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-gray-600">
                            by {property.developer}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Journey Progress */}
              <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Journey Progress</h2>
                
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute left-4 top-6 bottom-0 w-0.5 bg-gray-200"></div>
                    
                    <div className="space-y-6">
                      <div className="relative flex items-start">
                        <div className="absolute left-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <div className="ml-12">
                          <h3 className="font-semibold text-sm text-green-800">Registration</h3>
                          <p className="text-xs text-gray-600">Account created successfully</p>
                        </div>
                      </div>

                      <div className="relative flex items-start">
                        <div className="absolute left-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center animate-pulse">
                          <Shield className="w-4 h-4 text-white" />
                        </div>
                        <div className="ml-12">
                          <h3 className="font-semibold text-sm text-gray-900">Verification</h3>
                          <p className="text-xs text-gray-600">In progress - 50% complete</p>
                          <button 
                            onClick={() => router.push('/buyer/verification')}
                            className="text-xs text-blue-600 hover:underline mt-1"
                          >
                            Complete now →
                          </button>
                        </div>
                      </div>

                      <div className="relative flex items-start">
                        <div className="absolute left-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <FileText className="w-4 h-4 text-white" />
                        </div>
                        <div className="ml-12">
                          <h3 className="font-semibold text-sm text-gray-500">Financial Assessment</h3>
                          <p className="text-xs text-gray-400">Pending verification</p>
                        </div>
                      </div>

                      <div className="relative flex items-start">
                        <div className="absolute left-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <Home className="w-4 h-4 text-white" />
                        </div>
                        <div className="ml-12">
                          <h3 className="font-semibold text-sm text-gray-500">Property Purchase</h3>
                          <p className="text-xs text-gray-400">Not started</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <svg className="w-12 h-12">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="#E5E7EB"
                          strokeWidth="6"
                          fill="none"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="#3B82F6"
                          strokeWidth="6"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 20}`}
                          strokeDashoffset={`${2 * Math.PI * 20 * (1 - userData.journeyProgress / 100)}`}
                          className="transition-all duration-500"
                          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">
                          {userData.journeyProgress}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-blue-900">Overall Progress</p>
                      <p className="text-xs text-blue-700">Keep going, you\'re doing great!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg md:text-xl font-bold text-gray-900">Notifications</h2>
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {[...realTimeNotifications, ...notifications].filter(n => !n.read).length} new
                  </span>
                </div>
                
                <div className="space-y-3">
                  {/* Real-time notifications first */}
                  {realTimeNotifications.slice(0).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border ${
                        notification.read ? 'bg-gray-50 border-gray-200' : 'bg-green-50 border-green-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`rounded-full p-1.5 ${
                          notification.type === 'transaction' ? 'bg-blue-100 text-blue-600' :
                          notification.type === 'milestone' ? 'bg-purple-100 text-purple-600' :
                          notification.type === 'payment' ? 'bg-green-100 text-green-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {notification.type === 'transaction' ? <Home className="w-4 h-4" /> :
                           notification.type === 'milestone' ? <CheckCircle className="w-4 h-4" /> :
                           notification.type === 'payment' ? <Euro className="w-4 h-4" /> :
                           <Bell className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm text-gray-900">{notification.title}</h3>
                          <p className="text-xs text-gray-600 mt-0.5">{notification.message}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {new Date(notification.timestamp).toLocaleString()}
                            </span>
                            {notification.actions && notification.actions.length> 0 && (
                              <div className="flex gap-2">
                                {notification.actions.slice(0).map((action, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => {
                                      if (action.action === 'view_transaction') {
                                        router.push(`/buyer/transactions/${notification.transactionId}`);
                                      } else if (action.action === 'contact_developer') {
                                        alert('Contact feature coming soon!');
                                      }
                                    }}
                                    className={`text-xs px-2 py-1 rounded font-medium ${
                                      action.variant === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' :
                                      'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                  >
                                    {action.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Traditional notifications */}
                  {notifications.slice(0).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border ${
                        notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`rounded-full p-1.5 ${
                          notification.type === 'success' ? 'bg-green-100 text-green-600' :
                          notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                          notification.type === 'error' ? 'bg-red-100 text-red-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {notification.type === 'success' ? <CheckCircle className="w-4 h-4" /> :
                           notification.type === 'warning' ? <AlertCircle className="w-4 h-4" /> :
                           notification.type === 'error' ? <AlertCircle className="w-4 h-4" /> :
                           <Info className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm text-gray-900">{notification.title}</h3>
                          <p className="text-xs text-gray-600 mt-0.5">{notification.message}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">{notification.time}</span>
                            {notification.action && (
                              <button
                                onClick={() => router.push(notification.action.href)}
                                className="text-xs text-blue-600 hover:underline font-medium"
                              >
                                {notification.action.label} →
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-3 w-full text-center py-2 text-sm text-blue-600 hover:underline">
                  View All Notifications ({[...realTimeNotifications, ...notifications].length})
                </button>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mt-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Quick Actions</h2>
                <div className="space-y-2">
                  <button
                    onClick={() => router.push('/buyer/calculator')}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Calculator className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-sm">Update Budget</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </button>

                  <button
                    onClick={() => router.push('/buyer/documents')}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-purple-600" />
                      <span className="font-medium text-sm">Upload Documents</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </button>

                  <button
                    onClick={() => router.push('/buyer/advisor')}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-sm">Chat with Advisor</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </button>

                  <button
                    onClick={() => router.push('/buyer/calculator/htb')}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Heart className="w-4 h-4 text-red-600" />
                      <span className="font-medium text-sm">HTB Calculator</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}