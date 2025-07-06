'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEnterpriseAuth } from '@/context/EnterpriseAuthContext';
import { EnterpriseAuthProvider } from '@/context/EnterpriseAuthContext';
import AuthErrorBoundary from '@/components/auth/AuthErrorBoundary';
import { 
  CheckCircle, 
  AlertCircle, 
  User, 
  Shield, 
  FileText, 
  Home,
  ArrowRight,
  Target,
  PiggyBank,
  MapPin,
  Clock,
  Star,
  Gift,
  ChevronRight,
  Building2,
  Heart,
  Calculator
} from 'lucide-react';

interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  budget?: string;
  deposit?: string;
  hasHTB?: boolean;
  hasAIP?: boolean;
  preferredCounties?: string[];
  propertyType?: string[];
  bedrooms?: string;
  moveInTimeframe?: string;
  currentStatus?: string;
  journeySource?: string;
  verificationStatus?: string;
  kycStatus?: string;
}

function ProfileCompletionDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useEnterpriseAuth();
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  const [completionScore, setCompletionScore] = useState(0);
  const [nextActions, setNextActions] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/buyer');
      return;
    }

    // Load existing profile data
    const storedData = localStorage.getItem('userRegistration');
    let profile: UserProfile = {};

    if (storedData) {
      profile = JSON.parse(storedData);
    }

    // Merge with auth user data
    if (user) {
      profile = {
        ...profile,
        email: user.email || profile.email,
        firstName: user.firstName || profile.firstName,
        lastName: user.lastName || profile.lastName,
        verificationStatus: user.verificationStatus || 'pending',
        kycStatus: user.kycStatus || 'not-started'
      };
    }

    setUserProfile(profile);
    analyzeCompleteness(profile);

    // Update time
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [isAuthenticated, user, router]);

  const analyzeCompleteness = (profile: UserProfile) => {
    let score = 0;
    const actions = [];

    // Basic information (30%)
    if (profile.firstName && profile.lastName && profile.email && profile.phone) {
      score += 30;
    } else {
      actions.push({
        title: 'Complete Basic Information',
        description: 'Add your personal details to get started',
        icon: User,
        action: () => router.push('/buyer/profile/basic'),
        color: 'bg-blue-500',
        priority: 'high',
        estimatedTime: '2 min'
      });
    }

    // Property preferences (25%)
    if (profile.preferredCounties?.length && profile.propertyType?.length && profile.bedrooms) {
      score += 25;
    } else {
      actions.push({
        title: 'Set Property Preferences',
        description: 'Tell us what type of property you\'re looking for',
        icon: Home,
        action: () => router.push('/buyer/profile/preferences'),
        color: 'bg-purple-500',
        priority: 'medium',
        estimatedTime: '3 min'
      });
    }

    // Financial details (25%)
    if (profile.budget && profile.deposit) {
      score += 25;
    } else {
      actions.push({
        title: 'Financial Assessment',
        description: 'Set your budget and available deposit',
        icon: PiggyBank,
        action: () => router.push('/buyer/profile/financial'),
        color: 'bg-green-500',
        priority: 'high',
        estimatedTime: '4 min'
      });
    }

    // Verification (20%)
    if (profile.verificationStatus === 'verified' || profile.kycStatus === 'approved') {
      score += 20;
    } else {
      actions.push({
        title: 'Verify Your Identity',
        description: 'Upload documents for KYC/AML compliance',
        icon: Shield,
        action: () => router.push('/buyer/verification'),
        color: 'bg-orange-500',
        priority: 'high',
        estimatedTime: '5 min'
      });
    }

    setCompletionScore(score);
    setNextActions(actions.slice(0, 4)); // Show top 4 actions
  };

  const greeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getMotivationalMessage = () => {
    if (completionScore >= 75) {
      return "You're almost ready to start your property search! 🎉";
    } else if (completionScore >= 50) {
      return "Great progress! A few more steps and you'll be ready to buy 💪";
    } else if (completionScore >= 25) {
      return "You're building a strong foundation for your property journey 🏗️";
    } else {
      return "Welcome! Let's get your property journey started 🚀";
    }
  };

  const quickStats = [
    {
      label: 'Profile Complete',
      value: `${completionScore}%`,
      icon: Target,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      label: 'Next Steps',
      value: nextActions.length,
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600'
    },
    {
      label: 'Est. Time to Complete',
      value: `${nextActions.length * 3}min`,
      icon: Clock,
      color: 'bg-orange-100 text-orange-600'
    },
    {
      label: 'Journey Phase',
      value: completionScore >= 50 ? 'Building' : 'Starting',
      icon: Star,
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const benefits = [
    {
      title: 'Personalized Property Recommendations',
      description: 'Get properties matched to your preferences and budget',
      icon: Home,
      unlocked: completionScore >= 50
    },
    {
      title: 'HTB Calculator & Application',
      description: 'Calculate your €30,000 Help to Buy benefit',
      icon: Calculator,
      unlocked: completionScore >= 30
    },
    {
      title: 'Pre-Approval Fast Track',
      description: 'Get mortgage pre-approval with our partners',
      icon: Shield,
      unlocked: completionScore >= 75
    },
    {
      title: 'Property Reservation System',
      description: 'Reserve your dream home with confidence',
      icon: Heart,
      unlocked: completionScore >= 90
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Hero */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white mb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {greeting()}{userProfile.firstName ? `, ${userProfile.firstName}` : ''}! 👋
              </h1>
              <p className="text-blue-100 text-base md:text-lg mb-2">
                {getMotivationalMessage()}
              </p>
              <p className="text-blue-200 text-sm">
                Complete your profile to unlock personalized property recommendations
              </p>
            </div>
            <div className="text-left lg:text-right">
              <div className="text-sm text-blue-100">Current time</div>
              <div className="text-xl md:text-2xl font-mono">{currentTime.toLocaleTimeString()}</div>
            </div>
          </div>
          
          {/* Progress Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-6">
            {quickStats.map((stat, index) => (
              <div key={index} className="bg-white/20 backdrop-blur-sm rounded-lg p-3 md:p-4">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg ${stat.color} flex items-center justify-center mb-2`}>
                  <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="text-lg md:text-2xl font-bold">{stat.value}</div>
                <div className="text-xs md:text-sm text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Completion Progress */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Profile Completion Progress</h2>
            <span className="text-2xl font-bold text-blue-600">{completionScore}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${completionScore}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-600">
            {completionScore >= 90 ? (
              <span className="text-green-600 font-medium">🎉 Profile Complete! You're ready to start buying.</span>
            ) : (
              <span>Complete {100 - completionScore}% more to unlock all features</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Next Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Next Steps */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Complete Your Profile</h2>
              <div className="space-y-4">
                {nextActions.map((action, index) => (
                  <div
                    key={index}
                    onClick={action.action}
                    className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`${action.color} text-white rounded-lg p-3`}>
                          <action.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-base mb-1 group-hover:text-blue-600">
                            {action.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">{action.description}</p>
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              action.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {action.priority === 'high' ? 'Required' : 'Recommended'}
                            </span>
                            <span className="text-xs text-gray-500">⏱️ {action.estimatedTime}</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
              
              {nextActions.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Complete!</h3>
                  <p className="text-gray-600 mb-4">You're ready to start your property search</p>
                  <button
                    onClick={() => router.push('/properties')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse Properties
                  </button>
                </div>
              )}
            </div>

            {/* What You'll Unlock */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">What You'll Unlock</h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className={`flex items-center gap-4 p-4 rounded-lg border ${
                    benefit.unlocked ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className={`rounded-lg p-3 ${
                      benefit.unlocked ? 'bg-green-600 text-white' : 'bg-gray-400 text-white'
                    }`}>
                      <benefit.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${benefit.unlocked ? 'text-green-900' : 'text-gray-600'}`}>
                        {benefit.title}
                      </h3>
                      <p className={`text-sm ${benefit.unlocked ? 'text-green-700' : 'text-gray-500'}`}>
                        {benefit.description}
                      </p>
                    </div>
                    {benefit.unlocked ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Support & Motivation */}
          <div className="space-y-6">
            {/* Current Profile Summary */}
            {userProfile.firstName && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold mb-4">Your Profile</h2>
                <div className="space-y-3">
                  {userProfile.firstName && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{userProfile.firstName} {userProfile.lastName}</span>
                    </div>
                  )}
                  {userProfile.email && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium truncate ml-2">{userProfile.email}</span>
                    </div>
                  )}
                  {userProfile.budget && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Budget:</span>
                      <span className="font-medium">€{userProfile.budget}k</span>
                    </div>
                  )}
                  {userProfile.preferredCounties?.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Areas:</span>
                      <span className="font-medium">{userProfile.preferredCounties.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Help */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Our property specialists are here to guide you through the process
              </p>
              <button
                onClick={() => router.push('/buyer/support')}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Get Support
              </button>
            </div>

            {/* Motivation Card */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
              <Gift className="w-8 h-8 text-yellow-300 mb-3" />
              <h3 className="font-bold mb-2">Complete Profile Bonus!</h3>
              <p className="text-sm text-green-100 mb-4">
                Complete your profile today and get €500 off PROP Choice customization
              </p>
              <div className="text-xs bg-white/20 rounded px-2 py-1 inline-block">
                Limited time offer
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfileCompletionPage() {
  return (
    <EnterpriseAuthProvider>
      <AuthErrorBoundary>
        <ProfileCompletionDashboard />
      </AuthErrorBoundary>
    </EnterpriseAuthProvider>
  );
}