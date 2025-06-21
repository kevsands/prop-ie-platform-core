'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  Clock
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
  completionScore?: number;
  journeySource?: string;
  verificationStatus?: string;
  kycStatus?: string;
}

function IntelligentBuyerRouterContent() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useEnterpriseAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileAnalysis, setProfileAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  // Profile completeness analyzer
  const analyzeProfile = (profile: UserProfile | null) => {
    if (!profile) {
      return {
        completionScore: 0,
        missingFields: ['Basic Information', 'Preferences', 'Financial Details'],
        nextActions: [],
        recommendedDashboard: 'onboarding',
        journeyPhase: 'new'
      };
    }

    let score = 0;
    const missingFields = [];
    const nextActions = [];

    // Basic information (30%)
    if (profile.firstName && profile.lastName && profile.email && profile.phone) {
      score += 30;
    } else {
      missingFields.push('Basic Information');
      nextActions.push({
        title: 'Complete Profile',
        description: 'Add your personal details',
        icon: User,
        action: '/buyer/profile/basic',
        priority: 'high'
      });
    }

    // Property preferences (25%)
    if (profile.preferredCounties?.length && profile.propertyType?.length && profile.bedrooms) {
      score += 25;
    } else {
      missingFields.push('Property Preferences');
      nextActions.push({
        title: 'Set Preferences',
        description: 'Tell us what you\'re looking for',
        icon: Home,
        action: '/buyer/profile/preferences',
        priority: 'medium'
      });
    }

    // Financial details (25%)
    if (profile.budget && profile.deposit) {
      score += 25;
    } else {
      missingFields.push('Financial Information');
      nextActions.push({
        title: 'Financial Assessment',
        description: 'Set your budget and deposit',
        icon: PiggyBank,
        action: '/buyer/profile/financial',
        priority: 'high'
      });
    }

    // Verification status (20%)
    if (profile.verificationStatus === 'verified' || profile.kycStatus === 'approved') {
      score += 20;
    } else {
      nextActions.push({
        title: 'Verify Identity',
        description: 'Upload documents for KYC/AML compliance',
        icon: Shield,
        action: '/buyer/verification',
        priority: 'high'
      });
    }

    // Determine dashboard type
    let recommendedDashboard = 'onboarding';
    let journeyPhase = 'new';

    if (score >= 80) {
      recommendedDashboard = profile.journeySource === 'first-time-buyer' ? 'ftb-complete' : 'complete';
      journeyPhase = 'ready';
    } else if (score >= 50) {
      recommendedDashboard = 'in-progress';
      journeyPhase = 'building';
    } else if (score >= 30) {
      recommendedDashboard = 'basic';
      journeyPhase = 'starting';
    }

    // Special routing for first-time buyer journey
    if (profile.journeySource === 'first-time-buyer' && score >= 50) {
      recommendedDashboard = 'ftb-welcome';
    }

    return {
      completionScore: score,
      missingFields,
      nextActions: nextActions.slice(0, 3), // Top 3 priorities
      recommendedDashboard,
      journeyPhase
    };
  };

  useEffect(() => {
    const analyzeUserAndRoute = async () => {
      if (!isAuthenticated) {
        router.push('/login?redirect=/buyer');
        return;
      }

      setIsAnalyzing(true);

      try {
        // Get profile from localStorage (registration data)
        const storedData = localStorage.getItem('userRegistration');
        let profile: UserProfile = {};

        if (storedData) {
          profile = JSON.parse(storedData);
          profile.journeySource = 'first-time-buyer';
        }

        // Get additional profile data from database/auth context
        if (user) {
          profile = {
            ...profile,
            email: user.email || profile.email,
            firstName: user.firstName || profile.firstName,
            lastName: user.lastName || profile.lastName,
            verificationStatus: (user as any).verificationStatus || 'pending',
            kycStatus: (user as any).kycStatus || 'not-started'
          };
        }

        // Check for URL params that indicate source
        const urlParams = new URLSearchParams(window.location.search);
        const source = urlParams.get('source');
        if (source) {
          profile.journeySource = source;
        }

        setUserProfile(profile);
        const analysis = analyzeProfile(profile);
        setProfileAnalysis(analysis);

        // Route based on analysis
        setTimeout(() => {
          routeUser(analysis, profile);
        }, 1500); // Brief delay to show analysis

      } catch (error) {
        console.error('Error analyzing user profile:', error);
        // Fallback to basic onboarding
        setProfileAnalysis({
          completionScore: 0,
          recommendedDashboard: 'onboarding',
          journeyPhase: 'new'
        });
        setTimeout(() => router.push('/buyer/onboarding'), 1500);
      } finally {
        setIsAnalyzing(false);
      }
    };

    if (!isLoading) {
      analyzeUserAndRoute();
    }
  }, [isAuthenticated, isLoading, user, router]);

  const routeUser = (analysis: any, profile: UserProfile) => {
    switch (analysis.recommendedDashboard) {
      case 'ftb-welcome':
        router.push('/buyer/first-time-buyers/welcome');
        break;
      case 'ftb-complete':
        router.push('/buyer/first-time-buyers/welcome');
        break;
      case 'complete':
        router.push('/buyer/dashboard');
        break;
      case 'in-progress':
        router.push('/buyer/profile-completion');
        break;
      case 'basic':
        router.push('/buyer/profile-completion');
        break;
      default:
        router.push('/buyer/onboarding');
    }
  };

  if (isLoading || isAnalyzing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {isLoading ? 'Authenticating...' : 'Analyzing your profile...'}
          </h2>
          <p className="text-gray-600">
            {isLoading 
              ? 'Verifying your credentials' 
              : 'Personalizing your dashboard experience'
            }
          </p>
          
          {profileAnalysis && (
            <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Profile Completeness</span>
                <span className="text-sm font-bold text-blue-600">
                  {profileAnalysis.completionScore}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${profileAnalysis.completionScore}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Journey Phase: <span className="capitalize font-medium">{profileAnalysis.journeyPhase}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // This should not render as user will be redirected
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Analyzed</h2>
        <p className="text-gray-600">Redirecting to your personalized dashboard...</p>
      </div>
    </div>
  );
}

export default function IntelligentBuyerRouter() {
  return (
    <EnterpriseAuthProvider>
      <AuthErrorBoundary>
        <IntelligentBuyerRouterContent />
      </AuthErrorBoundary>
    </EnterpriseAuthProvider>
  );
}