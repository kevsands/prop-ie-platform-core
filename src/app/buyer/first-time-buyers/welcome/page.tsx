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
import Link from 'next/link';

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
  const [userDatasetUserData] = useState<UserData | null>(null);
  const [htbEstimatesetHtbEstimate] = useState(0);
  const [currentTimesetCurrentTime] = useState(new Date());

  useEffect(() => {
    // Get user data from localStorage or use demo data
    const storedData = localStorage.getItem('userRegistration');
    if (storedData) {
      const data = JSON.parse(storedData);
      setUserData(data);

      // Calculate HTB estimate based on budget
      const budgetValue = data.budget.split('-')[0];
      const estimate = Math.min(parseInt(budgetValue) * 1000 * 0.1330000);
      setHtbEstimate(estimate);
    } else {
      // Use demo data for the welcome page
      const demoData: UserData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+353 87 123 4567',
        budget: '350-400',
        deposit: '45000',
        hasHTB: false,
        hasAIP: true,
        preferredCounties: ['Dublin', 'Kildare'],
        propertyType: ['house', 'apartment'],
        bedrooms: '2-3',
        moveInTimeframe: '6-12 months',
        currentStatus: 'first-time-buyer'
      };
      setUserData(demoData);
      setHtbEstimate(30000);
    }

    // Update time
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const greeting = () => {
    const hour = currentTime.getHours();
    if (hour <12) return 'Good morning';
    if (hour <18) return 'Good afternoon';
    return 'Good evening';
  };

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
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
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{greeting()}, {userData.firstName}! 🎉</h1>
            <p className="mt-2 text-blue-100">You've successfully joined Ireland's leading digital property platform</p>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-blue-100">Your Budget</div>
              <div className="text-xl font-bold">€{userData.budget}k</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-100">HTB Available</div>
              <div className="text-xl font-bold">€{htbEstimate.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {personalizedStats.map((statindex) => (
          <div key={index} className="bg-white rounded-lg shadow p-4">
            <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
              {React.createElement(stat.icon, { className: 'w-6 h-6' })}
            </div>
            <div className="text-sm text-gray-600">{stat.label}</div>
            <div className="text-lg font-bold text-gray-900">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Next Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {nextSteps.map((stepindex) => (
          <Link 
            key={index}
            href={step.link}
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow group"
          >
            <div className={`${step.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              {React.createElement(step.icon, { className: 'w-6 h-6 text-white' })}
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
            <p className="text-sm text-gray-600">{step.description}</p>
          </Link>
        ))}
      </div>

      {/* Journey Progress */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Your Journey Progress</h2>
          <Link href="/buyer/journey" className="text-blue-600 hover:text-blue-700 flex items-center text-sm font-medium">
            View Full Journey <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="space-y-4">
          {journeyMilestones.map((milestoneindex) => (
            <div key={index} className="flex items-center">
              <div className="flex-shrink-0">{milestone.icon}</div>
              <div className="ml-3 flex-grow">
                <div className="text-sm font-medium text-gray-900">{milestone.title}</div>
                {milestone.action && milestone.status === 'pending' && (
                  <Link href={milestone.action} className="text-xs text-blue-600 hover:text-blue-700">
                    Start Now
                  </Link>
                )}
              </div>
              {milestone.status === 'completed' && (
                <span className="text-xs text-green-600">Completed</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Essential Resources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resourceindex) => (
            <Link
              key={index}
              href={resource.href}
              className="group p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 text-gray-500 group-hover:text-blue-600">
                  {resource.icon}
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                    {resource.title}
                  </h3>
                  <p className="mt-1 text-xs text-gray-600">{resource.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}