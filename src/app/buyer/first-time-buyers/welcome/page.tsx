'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle, 
  Calculator, 
  Home, 
  FileText, 
  Sparkles, 
  ArrowRight,
  Download,
  Star,
  Gift,
  User,
  Mail,
  Phone,
  PiggyBank,
  Building2,
  MapPin,
  Target,
  Clock,
  Shield,
  Award,
  HeartHandshake,
  TrendingUp,
  BookOpen,
  Heart,
  Calendar,
  ChevronRight,
  Loader2,
  AlertCircle,
  Zap,
  Brain,
  Camera,
  CreditCard,
  Lock,
  Scan,
  BadgeCheck
} from 'lucide-react';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  budget: string;
  deposit: string;
  hasHTB: boolean;
  hasAIP: boolean;
  preferredCounties: string[];
  propertyType: string[];
  bedrooms: string;
  moveInTimeframe: string;
  currentStatus: string;
  kycStatus?: 'not-started' | 'pending' | 'approved' | 'rejected';
  amlRiskScore?: number;
  verificationLevel?: 'basic' | 'enhanced' | 'complete';
  documentsUploaded?: string[];
  nextBestActions?: string[];
}

export default function FirstTimeBuyerWelcomePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [htbEstimate, setHtbEstimate] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [kycStatus, setKycStatus] = useState<'not-started' | 'pending' | 'approved' | 'rejected'>('not-started');
  const [verificationLevel, setVerificationLevel] = useState<'basic' | 'enhanced' | 'complete'>('basic');
  const [smartRecommendations, setSmartRecommendations] = useState<any[]>([]);
  const [complianceScore, setComplianceScore] = useState(0);

  // Smart recommendation engine
  const generateSmartRecommendations = (data: UserData) => {
    const recommendations = [];
    
    // KYC/AML Priority Logic
    if (!data.kycStatus || data.kycStatus === 'not-started') {
      recommendations.push({
        id: 'kyc-start',
        title: 'Complete Identity Verification',
        description: 'Required for property reservations and mortgage applications',
        priority: 'critical',
        estimatedTime: '5 min',
        icon: BadgeCheck,
        action: '/buyer/verification',
        color: 'bg-red-500',
        benefits: ['Unlock property reservations', 'Fast-track mortgage approval', 'Secure account protection']
      });
    }

    // Financial readiness assessment
    const budgetValue = parseInt(data.budget?.split('-')[0] || '0');
    const depositValue = parseInt(data.deposit || '0');
    const depositRatio = depositValue / (budgetValue * 1000);
    
    if (depositRatio < 0.1) {
      recommendations.push({
        id: 'deposit-boost',
        title: 'Boost Your Deposit',
        description: 'Increase buying power with savings strategies',
        priority: 'medium',
        estimatedTime: '10 min',
        icon: PiggyBank,
        action: '/buyer/financial/savings-plan',
        color: 'bg-green-500',
        benefits: ['Better mortgage rates', 'More property options', 'HTB maximization']
      });
    }

    // HTB Application
    if (!data.hasHTB) {
      recommendations.push({
        id: 'htb-apply',
        title: 'Apply for Help to Buy',
        description: `Claim your €${Math.min(budgetValue * 100, 30000).toLocaleString()} benefit`,
        priority: 'high',
        estimatedTime: '15 min',
        icon: Heart,
        action: '/buyer/htb/application',
        color: 'bg-blue-500',
        benefits: ['Up to €30,000 grant', 'No repayment required', 'Instant eligibility check']
      });
    }

    // Property search optimization
    if (data.preferredCounties && data.preferredCounties.length > 3) {
      recommendations.push({
        id: 'search-focus',
        title: 'Focus Your Search',
        description: 'Narrow location preferences for better matches',
        priority: 'low',
        estimatedTime: '3 min',
        icon: Target,
        action: '/buyer/preferences/refine',
        color: 'bg-purple-500',
        benefits: ['Better property matches', 'Faster search results', 'Market insights']
      });
    }

    return recommendations.slice(0, 3); // Top 3 recommendations
  };

  // Compliance score calculator
  const calculateComplianceScore = (data: UserData) => {
    let score = 0;
    
    // Identity verification (40%)
    if (data.kycStatus === 'approved') score += 40;
    else if (data.kycStatus === 'pending') score += 20;
    
    // Financial verification (30%)
    if (data.hasAIP) score += 30;
    else if (data.budget && data.deposit) score += 15;
    
    // Profile completeness (20%)
    const profileFields = [data.firstName, data.lastName, data.email, data.phone, data.preferredCounties?.length];
    const completedFields = profileFields.filter(field => field).length;
    score += (completedFields / profileFields.length) * 20;
    
    // Regulatory readiness (10%)
    if (data.hasHTB) score += 10;
    
    return Math.round(score);
  };

  useEffect(() => {
    // Get user data from localStorage
    const storedData = localStorage.getItem('userRegistration');
    if (storedData) {
      const data = JSON.parse(storedData);
      
      // Enhance data with compliance fields
      const enhancedData = {
        ...data,
        kycStatus: data.kycStatus || 'not-started',
        verificationLevel: data.verificationLevel || 'basic',
        documentsUploaded: data.documentsUploaded || []
      };
      
      setUserData(enhancedData);
      setKycStatus(enhancedData.kycStatus);
      setVerificationLevel(enhancedData.verificationLevel);
      
      // Calculate HTB estimate based on budget
      const budgetValue = data.budget.split('-')[0];
      const estimate = Math.min(parseInt(budgetValue) * 1000 * 0.1, 30000);
      setHtbEstimate(estimate);
      
      // Generate smart recommendations
      const recommendations = generateSmartRecommendations(enhancedData);
      setSmartRecommendations(recommendations);
      
      // Calculate compliance score
      const compliance = calculateComplianceScore(enhancedData);
      setComplianceScore(compliance);
    } else {
      // Redirect to registration if no data
      router.push('/first-time-buyers/register');
    }

    // Update time
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const greeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const nextSteps = [
    {
      icon: Calculator,
      title: 'Calculate Your HTB Benefit',
      description: `Based on your budget, you could get up to €${htbEstimate.toLocaleString()}`,
      link: '/buyer/calculator/htb',
      color: 'bg-blue-500'
    },
    {
      icon: Home,
      title: 'Browse Properties',
      description: `Explore properties in ${userData.preferredCounties.join(', ')}`,
      link: '/properties',
      color: 'bg-purple-500'
    },
    {
      icon: Shield,
      title: 'Complete Verification',
      description: 'Upload documents to verify your account',
      link: '/buyer/verification',
      color: 'bg-green-500'
    },
    {
      icon: BookOpen,
      title: 'Read Buyer\'s Guide',
      description: 'Everything about buying in Ireland',
      link: '/buyer/guides',
      color: 'bg-orange-500'
    }
  ];

  const personalizedStats = [
    {
      label: 'Your Budget',
      value: `€${userData.budget}k`,
      icon: Target,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      label: 'Saved Deposit',
      value: `€${parseInt(userData.deposit).toLocaleString()}`,
      icon: PiggyBank,
      color: 'bg-green-100 text-green-600'
    },
    {
      label: 'Preferred Areas',
      value: userData.preferredCounties.length,
      icon: MapPin,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      label: 'Move Timeline',
      value: userData.moveInTimeframe.replace('months', ' mo'),
      icon: Clock,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const journeyMilestones = [
    {
      title: 'Account Created',
      status: 'completed',
      icon: <CheckCircle className="w-5 h-5 text-green-600" />
    },
    {
      title: 'Profile Verification',
      status: 'pending',
      icon: <Shield className="w-5 h-5 text-gray-400" />,
      action: '/buyer/verification'
    },
    {
      title: 'HTB Application',
      status: 'pending',
      icon: <Heart className="w-5 h-5 text-gray-400" />,
      action: '/buyer/calculator/htb'
    },
    {
      title: 'Financial Assessment',
      status: 'pending',
      icon: <FileText className="w-5 h-5 text-gray-400" />,
      action: '/buyer/documents'
    },
    {
      title: 'Property Search',
      status: 'pending',
      icon: <Home className="w-5 h-5 text-gray-400" />,
      action: '/properties'
    }
  ];

  const resources = [
    {
      title: 'First-Time Buyer\'s Guide',
      description: 'Complete guide to buying in Ireland',
      icon: <FileText className="w-5 h-5" />,
      href: '/buyer/guides/ftb',
      tag: 'Essential'
    },
    {
      title: 'HTB Calculator',
      description: 'Calculate your €30k benefit',
      icon: <Calculator className="w-5 h-5" />,
      href: '/buyer/calculator/htb',
      tag: 'Interactive'
    },
    {
      title: 'Mortgage Advisor',
      description: 'Chat with our experts',
      icon: <HeartHandshake className="w-5 h-5" />,
      href: '/buyer/advisor',
      tag: 'Live Support'
    },
    {
      title: 'Market Insights',
      description: 'Latest property trends',
      icon: <TrendingUp className="w-5 h-5" />,
      href: '/buyer/insights',
      tag: 'Updated Daily'
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
                {greeting()}, {userData.firstName}! 🎉
              </h1>
              <p className="text-blue-100 text-base md:text-lg">
                You\'ve successfully joined Ireland\'s leading digital property platform
              </p>
            </div>
            <div className="text-left lg:text-right">
              <div className="text-sm text-blue-100">Current time</div>
              <div className="text-xl md:text-2xl font-mono">{currentTime.toLocaleTimeString()}</div>
            </div>
          </div>
          
          {/* Personalized Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-6">
            {personalizedStats.map((stat, index) => (
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

        {/* Special Offer Banner */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-4 md:p-6 text-white mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Gift className="text-yellow-300" size={28} />
              <div>
                <h2 className="text-lg md:text-xl font-bold">Welcome Bonus!</h2>
                <p className="text-sm text-green-100">Complete your profile today and get €500 off PROP Choice customization</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/buyer/profile')}
              className="px-4 md:px-6 py-2 md:py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors text-sm md:text-base"
            >
              Claim Offer
            </button>
          </div>
        </div>

        {/* Journey Progress - Moved up */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
          <h2 className="text-lg md:text-xl font-bold mb-4">Your Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {journeyMilestones.map((milestone, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                <div className={`rounded-full p-1.5 flex-shrink-0 ${
                  milestone.status === 'completed' ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {milestone.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold text-sm ${
                    milestone.status === 'completed' ? 'text-green-800' : 'text-gray-600'
                  }`}>
                    {milestone.title}
                  </h3>
                  {milestone.status === 'pending' && milestone.action && (
                    <button
                      onClick={() => router.push(milestone.action)}
                      className="text-xs text-blue-600 hover:underline mt-0.5"
                    >
                      Complete now →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center">
            <div className="text-xl font-bold text-blue-900 mb-0.5">25% Complete</div>
            <div className="text-xs text-gray-600">Keep going! You're making great progress</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Next Steps & Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Next Steps */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold mb-4">Your Next Steps</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {nextSteps.map((step, index) => (
                  <div
                    key={index}
                    onClick={() => router.push(step.link)}
                    className="border border-gray-200 rounded-lg p-3 md:p-4 cursor-pointer hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`${step.color} text-white rounded-lg p-2 md:p-3 flex-shrink-0`}>
                        <step.icon className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm md:text-base mb-1 group-hover:text-blue-600">
                          {step.title}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600 mb-2">{step.description}</p>
                        <div className="flex items-center text-blue-600 text-xs md:text-sm">
                          <span>Get Started</span>
                          <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* KYC/AML Compliance Tracking */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl font-bold">Verification & Compliance</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  complianceScore >= 80 ? 'bg-green-100 text-green-800' :
                  complianceScore >= 50 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {complianceScore}% Complete
                </span>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Compliance Score</span>
                  <span className="font-medium">{complianceScore}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      complianceScore >= 80 ? 'bg-green-600' :
                      complianceScore >= 50 ? 'bg-yellow-600' :
                      'bg-red-600'
                    }`}
                    style={{ width: `${complianceScore}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <Shield className="text-blue-600" size={18} />
                    Identity Verification
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">KYC Status:</span>
                      <span className={`font-medium ${
                        kycStatus === 'approved' ? 'text-green-600' :
                        kycStatus === 'pending' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {kycStatus === 'not-started' ? 'Not Started' :
                         kycStatus === 'pending' ? 'Under Review' :
                         kycStatus === 'approved' ? 'Verified' : 'Rejected'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Verification Level:</span>
                      <span className="font-medium capitalize">{verificationLevel}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Documents:</span>
                      <span className="font-medium">
                        {userData?.documentsUploaded?.length || 0}/6 uploaded
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <Lock className="text-purple-600" size={18} />
                    AML & Risk Assessment
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Risk Score:</span>
                      <span className={`font-medium ${
                        (userData?.amlRiskScore || 0) <= 20 ? 'text-green-600' :
                        (userData?.amlRiskScore || 0) <= 50 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {userData?.amlRiskScore || 'Low'} Risk
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Financial Check:</span>
                      <span className={`font-medium ${userData?.hasAIP ? 'text-green-600' : 'text-gray-600'}`}>
                        {userData?.hasAIP ? 'Pre-Approved' : 'Pending'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Regulatory Status:</span>
                      <span className="font-medium text-green-600">Compliant</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {kycStatus === 'not-started' ? (
                      <span>Start verification to unlock property reservations</span>
                    ) : kycStatus === 'pending' ? (
                      <span>Verification in progress - expected completion in 24-48 hours</span>
                    ) : kycStatus === 'approved' ? (
                      <span>✅ Fully verified - ready for property transactions</span>
                    ) : (
                      <span>❌ Verification required - please upload missing documents</span>
                    )}
                  </div>
                  <button
                    onClick={() => router.push('/buyer/verification')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Shield className="w-4 h-4" />
                    {kycStatus === 'not-started' ? 'Start Verification' : 'View Details'}
                  </button>
                </div>
              </div>
            </div>

            {/* Smart Recommendations */}
            {smartRecommendations.length > 0 && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl shadow-sm p-4 md:p-6 border border-purple-100">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="text-purple-600" size={20} />
                  <h2 className="text-lg md:text-xl font-bold text-purple-900">AI-Powered Recommendations</h2>
                  <Zap className="text-yellow-500" size={16} />
                </div>
                <p className="text-purple-700 text-sm mb-4">
                  Based on your profile and journey progress, here are your personalized next best actions:
                </p>
                
                <div className="space-y-3">
                  {smartRecommendations.map((rec, index) => (
                    <div
                      key={rec.id}
                      onClick={() => router.push(rec.action)}
                      className="bg-white rounded-lg p-4 cursor-pointer hover:shadow-md transition-all group border border-purple-100"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`${rec.color} text-white rounded-lg p-3 flex-shrink-0`}>
                          <rec.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-base group-hover:text-purple-600">
                              {rec.title}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              rec.priority === 'critical' ? 'bg-red-100 text-red-800' :
                              rec.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                              rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {rec.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>⏱️ {rec.estimatedTime}</span>
                            <span>📈 {rec.benefits.length} benefits</span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {rec.benefits.slice(0, 2).map((benefit, idx) => (
                              <span key={idx} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                {benefit}
                              </span>
                            ))}
                            {rec.benefits.length > 2 && (
                              <span className="text-xs text-purple-600">+{rec.benefits.length - 2} more</span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Summary */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold mb-4">Your Profile Summary</h2>
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <h3 className="font-semibold text-sm md:text-base mb-3 flex items-center gap-2">
                    <User className="text-blue-600" size={18} />
                    Personal Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{userData.firstName} {userData.lastName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium truncate ml-2">{userData.email}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{userData.phone}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-sm md:text-base mb-3 flex items-center gap-2">
                    <Home className="text-blue-600" size={18} />
                    Property Preferences
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium capitalize">{userData.propertyType.join(', ')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Bedrooms:</span>
                      <span className="font-medium">{userData.bedrooms}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Counties:</span>
                      <span className="font-medium">{userData.preferredCounties.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <h3 className="font-semibold text-sm md:text-base mb-3 flex items-center gap-2">
                  <PiggyBank className="text-blue-600" size={18} />
                  Financial Readiness
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-2 md:p-3 bg-blue-50 rounded-lg">
                    <div className="text-base md:text-lg font-bold text-blue-900">€{userData.budget}k</div>
                    <div className="text-xs text-gray-600">Budget Range</div>
                  </div>
                  <div className="text-center p-2 md:p-3 bg-green-50 rounded-lg">
                    <div className="text-base md:text-lg font-bold text-green-900">€{parseInt(userData.deposit).toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Saved Deposit</div>
                  </div>
                  <div className="text-center p-2 md:p-3 bg-purple-50 rounded-lg">
                    <div className="text-base md:text-lg font-bold text-purple-900">€{htbEstimate.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Est. HTB Benefit</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-3">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    userData.hasHTB ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {userData.hasHTB ? '✓ HTB Registered' : 'HTB Not Started'}
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    userData.hasAIP ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {userData.hasAIP ? '✓ Has AIP' : 'AIP Not Started'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Resources */}
          <div className="space-y-6">
            {/* Essential Resources */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold mb-4">Essential Resources</h2>
              <div className="space-y-3">
                {resources.map((resource, index) => (
                  <div
                    key={index}
                    onClick={() => router.push(resource.href)}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-blue-600">{resource.icon}</div>
                      <div>
                        <h3 className="font-semibold text-sm group-hover:text-blue-600">
                          {resource.title}
                        </h3>
                        <p className="text-xs text-gray-600">{resource.description}</p>
                      </div>
                    </div>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full flex-shrink-0">
                      {resource.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Help */}
            <div className="bg-blue-50 rounded-xl p-4 md:p-6">
              <h3 className="font-semibold text-sm md:text-base mb-2">Need Help?</h3>
              <p className="text-xs md:text-sm text-gray-600 mb-3">
                Our first-time buyer specialists are here to support you
              </p>
              <button
                onClick={() => router.push('/buyer/support')}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Get Support
              </button>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 md:p-8 text-white text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-3">Ready to Find Your Dream Home?</h2>
          <p className="text-base md:text-lg mb-5">Start browsing properties that match your preferences</p>
          <button
            onClick={() => router.push('/properties')}
            className="px-6 md:px-8 py-2.5 md:py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors text-sm md:text-base"
          >
            Browse Properties
          </button>
        </div>
      </div>
    </div>
  );
}