'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEnterpriseAuth } from '@/context/EnterpriseAuthContext';
import { useVerification } from '@/context/VerificationContext';
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  User, 
  FileText, 
  Zap,
  RefreshCw,
  Building2,
  Star
} from 'lucide-react';

interface VerificationRoute {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  color: string;
  priority: number;
  requirements: string[];
  estimatedTime: string;
  suitableFor: string[];
}

interface UserVerificationStatus {
  hasDocuments: boolean;
  documentCount: number;
  verificationLevel: 'none' | 'basic' | 'advanced' | 'complete';
  missingDocuments: string[];
  lastActivity: Date | null;
  riskProfile: 'low' | 'medium' | 'high';
  userType: 'first-time-buyer' | 'existing-buyer' | 'investor' | 'professional';
}

const verificationRoutes: VerificationRoute[] = [
  {
    id: 'comprehensive-form',
    title: 'Complete Verification Form',
    description: 'Comprehensive 4-step verification with guided form completion',
    icon: <FileText className="w-6 h-6" />,
    route: '/first-time-buyers/kyc?view=comprehensive_form',
    color: 'blue',
    priority: 1,
    requirements: ['Personal info', 'ID documents', 'Address proof', 'Financial docs'],
    estimatedTime: '15-20 minutes',
    suitableFor: ['First-time buyers', 'Complete verification needed']
  },
  {
    id: 'document-upload',
    title: 'Document Upload Center',
    description: 'Advanced document categorization with Irish compliance features',
    icon: <Building2 className="w-6 h-6" />,
    route: '/first-time-buyers/documents',
    color: 'green',
    priority: 2,
    requirements: ['Identity docs', 'Address proof', 'Financial statements'],
    estimatedTime: '10-15 minutes',
    suitableFor: ['Document-focused verification', 'HTB applicants']
  },
  {
    id: 'advanced-workflow',
    title: 'Advanced Verification Workflow',
    description: 'Enterprise-grade with real-time progress and compliance scoring',
    icon: <Zap className="w-6 h-6" />,
    route: '/first-time-buyers/kyc?view=verification_workflow',
    color: 'purple',
    priority: 3,
    requirements: ['Pre-uploaded documents', 'Technical verification'],
    estimatedTime: '20-30 minutes',
    suitableFor: ['High-value transactions', 'Investment properties']
  },
  {
    id: 'simple-manager',
    title: 'Simple Document Manager',
    description: 'Streamlined interface for quick document uploads',
    icon: <User className="w-6 h-6" />,
    route: '/buyer/documents',
    color: 'gray',
    priority: 4,
    requirements: ['Basic document upload'],
    estimatedTime: '5-10 minutes',
    suitableFor: ['Existing customers', 'Quick updates']
  }
];

interface IntelligentVerificationRouterProps {
  className?: string;
}

export default function IntelligentVerificationRouter({ 
  className = '' 
}: IntelligentVerificationRouterProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useEnterpriseAuth();
  const { profile, getOverallProgress, isVerificationComplete } = useVerification();
  
  const [userStatus, setUserStatus] = useState<UserVerificationStatus>({
    hasDocuments: false,
    documentCount: 0,
    verificationLevel: 'none',
    missingDocuments: [],
    lastActivity: null,
    riskProfile: 'medium',
    userType: 'first-time-buyer'
  });
  
  const [recommendedRoute, setRecommendedRoute] = useState<VerificationRoute | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    analyzeUserStatus();
  }, [user, profile]);

  const analyzeUserStatus = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis - in production this would check real data
    setTimeout(() => {
      const mockStatus: UserVerificationStatus = {
        hasDocuments: profile ? getOverallProgress() > 0 : false,
        documentCount: profile?.steps.filter(s => s.status === 'completed').length || 0,
        verificationLevel: isVerificationComplete() ? 'complete' : 
                          getOverallProgress() > 50 ? 'advanced' :
                          getOverallProgress() > 0 ? 'basic' : 'none',
        missingDocuments: profile?.steps
          .filter(s => s.status === 'not-started')
          .map(s => s.title) || ['Identity documents', 'Address proof'],
        lastActivity: new Date(),
        riskProfile: 'low',
        userType: 'first-time-buyer'
      };
      
      setUserStatus(mockStatus);
      setRecommendedRoute(determineOptimalRoute(mockStatus));
      setIsAnalyzing(false);
    }, 1500);
  };

  const determineOptimalRoute = (status: UserVerificationStatus): VerificationRoute => {
    // Intelligent routing logic based on user status
    if (status.verificationLevel === 'complete') {
      return verificationRoutes.find(r => r.id === 'simple-manager')!;
    }
    
    if (status.verificationLevel === 'none' && status.userType === 'first-time-buyer') {
      return verificationRoutes.find(r => r.id === 'comprehensive-form')!;
    }
    
    if (status.hasDocuments && status.documentCount > 2) {
      return verificationRoutes.find(r => r.id === 'advanced-workflow')!;
    }
    
    if (status.missingDocuments.length > 3) {
      return verificationRoutes.find(r => r.id === 'document-upload')!;
    }
    
    // Default to comprehensive form
    return verificationRoutes.find(r => r.id === 'comprehensive-form')!;
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'border-blue-200 bg-blue-50 text-blue-800',
      green: 'border-green-200 bg-green-50 text-green-800',
      purple: 'border-purple-200 bg-purple-50 text-purple-800',
      gray: 'border-gray-200 bg-gray-50 text-gray-800'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getButtonColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-600 hover:bg-blue-700',
      green: 'bg-green-600 hover:bg-green-700',
      purple: 'bg-purple-600 hover:bg-purple-700',
      gray: 'bg-gray-600 hover:bg-gray-700'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (isAnalyzing) {
    return (
      <div className={`bg-white rounded-xl shadow-lg border p-8 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyzing Your Profile</h3>
          <p className="text-gray-600">
            Determining the optimal verification path based on your status and requirements...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg border ${className}`}>
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Intelligent Verification Router</h2>
            <p className="text-gray-600">Personalized verification path based on your profile</p>
          </div>
        </div>

        {/* User Status Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{userStatus.verificationLevel}</div>
            <div className="text-sm text-gray-600">Verification Level</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">{userStatus.documentCount}</div>
            <div className="text-sm text-gray-600">Documents Uploaded</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-lg font-bold text-purple-600">{userStatus.riskProfile}</div>
            <div className="text-sm text-gray-600">Risk Profile</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-lg font-bold text-orange-600">{userStatus.userType.replace('-', ' ')}</div>
            <div className="text-sm text-gray-600">User Type</div>
          </div>
        </div>
      </div>

      {/* Recommended Route */}
      {recommendedRoute && (
        <div className="p-6 border-b">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900">Recommended for You</h3>
          </div>
          
          <div className={`border-2 rounded-lg p-6 ${getColorClasses(recommendedRoute.color)}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center bg-white`}>
                  {recommendedRoute.icon}
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold mb-2">{recommendedRoute.title}</h4>
                  <p className="text-sm mb-3">{recommendedRoute.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium mb-1">Requirements:</p>
                      <ul className="space-y-1">
                        {recommendedRoute.requirements.map((req, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Details:</p>
                      <div className="space-y-1">
                        <p>⏱️ {recommendedRoute.estimatedTime}</p>
                        <p>👥 {recommendedRoute.suitableFor.join(', ')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => router.push(recommendedRoute.route)}
                className={`px-6 py-3 text-white rounded-lg transition-colors flex items-center gap-2 ${getButtonColorClasses(recommendedRoute.color)}`}
              >
                Start Verification
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* All Available Routes */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All Verification Options</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {verificationRoutes.map((route) => (
            <div
              key={route.id}
              className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                route.id === recommendedRoute?.id 
                  ? 'border-yellow-300 bg-yellow-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {route.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{route.title}</h4>
                    {route.id === recommendedRoute?.id && (
                      <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{route.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{route.estimatedTime}</span>
                <button
                  onClick={() => router.push(route.route)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Select →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Re-analyze Button */}
      <div className="p-6 border-t bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Profile Updated?</p>
            <p className="text-sm text-gray-600">Re-analyze to get updated recommendations</p>
          </div>
          <button
            onClick={analyzeUserStatus}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Re-analyze
          </button>
        </div>
      </div>
    </div>
  );
}