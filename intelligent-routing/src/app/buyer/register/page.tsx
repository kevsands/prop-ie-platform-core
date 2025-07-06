'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home, Shield, CheckCircle, Zap } from 'lucide-react';
import Link from 'next/link';
import BuyerRegistrationFlow from '@/components/buyer/BuyerRegistrationFlow';

interface RegistrationStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export default function BuyerRegisterPage() {
  const router = useRouter();
  const [showRegistrationFlow, setShowRegistrationFlow] = useState(false);
  const [selectedDevelopment, setSelectedDevelopment] = useState<string | null>(null);

  // Mock development data for registration context
  const developments = [
    {
      id: 'riverside-manor',
      name: 'Riverside Manor',
      location: 'Dublin 2',
      priceRange: '€380,000 - €450,000'
    },
    {
      id: 'fitzgerald-gardens',
      name: 'Fitzgerald Gardens',
      location: 'Cork',
      priceRange: '€350,000 - €420,000'
    },
    {
      id: 'ballymakenny-view',
      name: 'Ballymakenny View',
      location: 'Drogheda',
      priceRange: '€320,000 - €390,000'
    }
  ];

  const registrationSteps: RegistrationStep[] = [
    {
      id: 'account',
      title: 'Create Account',
      description: 'Set up your buyer profile with basic information',
      completed: false
    },
    {
      id: 'verification',
      title: 'Identity Verification',
      description: 'Upload identity documents for KYC compliance',
      completed: false
    },
    {
      id: 'financial',
      title: 'Financial Verification',
      description: 'Prove your ability to purchase with proof of funds',
      completed: false
    },
    {
      id: 'agreement',
      title: 'Legal Agreement',
      description: 'Review and accept terms and conditions',
      completed: false
    }
  ];

  const benefits = [
    {
      icon: <Shield className="h-6 w-6 text-blue-600" />,
      title: 'Secure & Verified',
      description: 'Bank-level security for all your documents and data'
    },
    {
      icon: <Zap className="h-6 w-6 text-green-600" />,
      title: 'Fast Track Process',
      description: 'Get priority access to new properties and viewings'
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-purple-600" />,
      title: 'Pre-Approved Status',
      description: 'Stand out to sellers with verified buyer credentials'
    }
  ];

  const handleRegistrationComplete = (data: any) => {
    console.log('Registration completed:', data);
    // Redirect to buyer dashboard
    router.push('/buyer/dashboard');
  };

  const startRegistration = (developmentId?: string) => {
    setSelectedDevelopment(developmentId || 'general');
    setShowRegistrationFlow(true);
  };

  if (showRegistrationFlow && selectedDevelopment) {
    const development = developments.find(d => d.id === selectedDevelopment);
    
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <BuyerRegistrationFlow
            developmentId={selectedDevelopment}
            developmentName={development?.name || 'Property Purchase'}
            onComplete={handleRegistrationComplete}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/buyer"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Buyer Registration</h1>
            <p className="text-gray-600 mt-1">Join PROP as a verified buyer and get access to exclusive properties</p>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Start Your Home Buying Journey</h2>
              <p className="text-blue-100 mb-4">
                Register as a verified buyer to unlock premium features, get priority access to properties, 
                and fast-track your home buying process.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  <span>Instant verification</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  <span>Priority viewings</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  <span>Expert support</span>
                </div>
              </div>
            </div>
            <Home className="h-20 w-20 text-white opacity-80" />
          </div>
        </div>

        {/* Registration Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Quick Registration */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">General Registration</h3>
            <p className="text-gray-600 mb-6">
              Register as a general buyer to browse all available properties and access basic features.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">Browse all properties</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">Save favorites</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">Schedule viewings</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">Access calculators</span>
              </div>
            </div>

            <button
              onClick={() => startRegistration()}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Start General Registration
            </button>
            
            <p className="text-xs text-gray-500 mt-3 text-center">
              Complete verification in 4 simple steps
            </p>
          </div>

          {/* Property-Specific Registration */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Property-Specific Registration</h3>
            <p className="text-gray-600 mb-6">
              Register for a specific property development to get priority access and dedicated support.
            </p>

            <div className="space-y-3 mb-6">
              {developments.map((development) => (
                <button
                  key={development.id}
                  onClick={() => startRegistration(development.id)}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{development.name}</h4>
                      <p className="text-sm text-gray-600">{development.location}</p>
                      <p className="text-sm text-blue-600 font-medium">{development.priceRange}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        HTB Eligible
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-500 text-center">
              Get priority notifications and exclusive access
            </p>
          </div>
        </div>

        {/* Registration Process */}
        <div className="bg-white rounded-lg border shadow-sm p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Simple 4-Step Registration Process
          </h3>
          
          <div className="grid md:grid-cols-4 gap-6">
            {registrationSteps.map((step, index) => (
              <div key={step.id} className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-blue-600">{index + 1}</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-8">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Complete registration in under 10 minutes
              </p>
              <button
                onClick={() => startRegistration()}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg"
              >
                Get Started Now
              </button>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-lg border shadow-sm p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Why Register with PROP?
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {benefit.icon}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-center">
              <h4 className="font-semibold text-blue-900 mb-2">Already have an account?</h4>
              <p className="text-blue-800 mb-4">
                Sign in to continue your home buying journey where you left off.
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium border border-blue-200"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}