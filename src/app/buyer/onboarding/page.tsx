'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Home, 
  Users, 
  TrendingUp, 
  Shield, 
  ArrowRight,
  CheckCircle,
  Star,
  Heart,
  Building2,
  MapPin,
  PiggyBank,
  Calculator,
  FileText,
  Award
} from 'lucide-react';

export default function BuyerOnboarding() {
  const router = useRouter();
  const [selectedUserType, setSelectedUserType] = useState<string>('');

  const userTypes = [
    {
      id: 'first-time-buyer',
      title: 'First-Time Buyer',
      description: 'New to property buying? Get expert guidance and HTB support',
      icon: Home,
      benefits: ['€30k HTB Benefit', 'Step-by-step guidance', 'First-time buyer perks'],
      color: 'bg-blue-600',
      route: '/first-time-buyers/register'
    },
    {
      id: 'experienced-buyer',
      title: 'Experienced Buyer',
      description: 'Looking for your next property investment or upgrade?',
      icon: Building2,
      benefits: ['Advanced search', 'Investment insights', 'Portfolio tools'],
      color: 'bg-purple-600',
      route: '/buyer/profile/experienced'
    },
    {
      id: 'investor',
      title: 'Property Investor',
      description: 'Build and manage your property investment portfolio',
      icon: TrendingUp,
      benefits: ['ROI analysis', 'Market insights', 'Portfolio management'],
      color: 'bg-green-600',
      route: '/investor/register'
    },
    {
      id: 'downsizer',
      title: 'Downsizing',
      description: 'Looking to downsize to a smaller, more suitable home?',
      icon: Users,
      benefits: ['Tailored options', 'Moving support', 'Financial planning'],
      color: 'bg-orange-600',
      route: '/buyer/profile/downsize'
    }
  ];

  const platformFeatures = [
    {
      icon: Shield,
      title: 'Secure & Trusted',
      description: 'Enterprise-grade security with full regulatory compliance'
    },
    {
      icon: Calculator,
      title: 'Smart Tools',
      description: 'AI-powered search, HTB calculator, and financial planning'
    },
    {
      icon: Heart,
      title: 'Personalized',
      description: 'Customized recommendations based on your preferences'
    },
    {
      icon: Award,
      title: 'Expert Support',
      description: '24/7 support from certified property specialists'
    }
  ];

  const handleGetStarted = () => {
    if (!selectedUserType) return;
    
    const userType = userTypes.find(type => type.id === selectedUserType);
    if (userType) {
      // Add source tracking
      const url = `${userType.route}?source=onboarding&type=${selectedUserType}`;
      router.push(url);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to PROP.ie
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            Ireland's most advanced property platform. Let's personalize your experience to help you find your perfect home.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Trusted by 50,000+ buyers across Ireland</span>
          </div>
        </div>

        {/* User Type Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-center mb-2">What brings you here today?</h2>
          <p className="text-gray-600 text-center mb-8">
            Choose the option that best describes your situation for a personalized experience
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {userTypes.map((type) => (
              <div
                key={type.id}
                onClick={() => setSelectedUserType(type.id)}
                className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                  selectedUserType === type.id 
                    ? 'border-blue-600 bg-blue-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`${type.color} text-white rounded-lg p-3 flex-shrink-0`}>
                    <type.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{type.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{type.description}</p>
                    <div className="space-y-1">
                      {type.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedUserType === type.id ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                  }`}>
                    {selectedUserType === type.id && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleGetStarted}
            disabled={!selectedUserType}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
              selectedUserType 
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {selectedUserType ? 'Get Started' : 'Please select an option above'}
            {selectedUserType && <ArrowRight className="w-5 h-5 inline ml-2" />}
          </button>
        </div>

        {/* Platform Features */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-center mb-2">Why Choose PROP.ie?</h2>
          <p className="text-gray-600 text-center mb-8">
            Ireland's most comprehensive property platform designed for your success
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {platformFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="bg-blue-100 text-blue-600 rounded-lg p-3">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Join Thousands of Successful Buyers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <div className="text-3xl font-bold">€847M+</div>
              <div className="text-blue-100">Annual Transaction Volume</div>
            </div>
            <div>
              <div className="text-3xl font-bold">50,000+</div>
              <div className="text-blue-100">Happy Buyers</div>
            </div>
            <div>
              <div className="text-3xl font-bold">99.7%</div>
              <div className="text-blue-100">Success Rate</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-1 text-yellow-300">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
            <span className="ml-2 text-white">4.9/5 Customer Rating</span>
          </div>
        </div>

        {/* Support Section */}
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">
            Need help choosing? Our specialists are here to guide you.
          </p>
          <button
            onClick={() => router.push('/contact')}
            className="inline-flex items-center gap-2 bg-white text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <FileText className="w-5 h-5" />
            Talk to a Specialist
          </button>
        </div>
      </div>
    </div>
  );
}