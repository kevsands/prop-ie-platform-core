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
  Loader2
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
}

export default function FirstTimeBuyerWelcomePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [htbEstimate, setHtbEstimate] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Get user data from localStorage
    const storedData = localStorage.getItem('userRegistration');
    if (storedData) {
      const data = JSON.parse(storedData);
      setUserData(data);
      
      // Calculate HTB estimate based on budget
      const budgetValue = data.budget.split('-')[0];
      const estimate = Math.min(parseInt(budgetValue) * 1000 * 0.1, 30000);
      setHtbEstimate(estimate);
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
    <div className="-mt-6">
      <div className="">
        {/* Welcome Hero */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
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
        </div>

        {/* Special Offer Banner */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-4 md:p-6 text-white mb-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          {/* Left Column - Next Steps & Journey Progress */}
          <div className="lg:col-span-2 space-y-6">
            {/* Next Steps */}
            <div className="bg-gray-50 rounded-xl shadow-sm p-4 md:p-6">
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

            {/* Profile Summary */}
            <div className="bg-gray-50 rounded-xl shadow-sm p-4 md:p-6">
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

          {/* Right Column - Journey & Resources */}
          <div className="space-y-6">
            {/* Journey Progress */}
            <div className="bg-gray-50 rounded-xl shadow-sm p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold mb-4">Your Journey</h2>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="space-y-4">
                  {journeyMilestones.map((milestone, index) => (
                    <div key={index} className="flex items-start gap-3 relative">
                      <div className={`absolute left-0 w-0.5 h-full ${
                        milestone.status === 'completed' ? 'bg-green-600' : 'bg-gray-200'
                      }`}></div>
                      <div className={`relative z-10 rounded-full p-1.5 ${
                        milestone.status === 'completed' ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {milestone.icon}
                      </div>
                      <div className="flex-1">
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
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-900 mb-0.5">25% Complete</div>
                <div className="text-xs text-gray-600">Keep going! You\'re making great progress</div>
              </div>
            </div>

            {/* Essential Resources */}
            <div className="bg-gray-50 rounded-xl shadow-sm p-4 md:p-6">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 md:p-8 text-white text-center">
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
    </div>
  );
}