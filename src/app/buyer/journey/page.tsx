'use client';

import React from 'react';
import { useVerification } from '@/context/VerificationContext';
import { Shield, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

/**
 * Enhanced Buyer Journey Page with Verification Integration
 */
export default function BuyerJourneyPage() {
  const { 
    profile: verificationProfile, 
    getOverallProgress, 
    isVerificationComplete,
    getCurrentStep 
  } = useVerification();

  const verificationProgress = getOverallProgress();
  const verificationComplete = isVerificationComplete();
  const currentVerificationStep = getCurrentStep();
  // Journey steps with verification integration
  const journeySteps = [
    {
      id: 'verification',
      title: 'Identity Verification',
      status: verificationComplete ? 'completed' : verificationProgress > 0 ? 'in-progress' : 'pending',
      progress: verificationProgress,
      icon: Shield,
      description: verificationComplete ? 'Identity verified' : currentVerificationStep ? `${currentVerificationStep.title}` : 'Verify your identity'
    },
    {
      id: 'planning',
      title: 'Planning',
      status: 'completed',
      progress: 100,
      icon: CheckCircle,
      description: 'Initial planning completed'
    },
    {
      id: 'financing',
      title: 'Financing',
      status: verificationComplete ? 'in-progress' : 'locked',
      progress: verificationComplete ? 60 : 0,
      icon: Clock,
      description: verificationComplete ? 'Mortgage application in progress' : 'Complete verification first'
    },
    {
      id: 'property-search',
      title: 'Property Search',
      status: verificationComplete ? 'pending' : 'locked',
      progress: 0,
      icon: Clock,
      description: verificationComplete ? 'Ready to start searching' : 'Complete verification first'
    },
    {
      id: 'reservation',
      title: 'Reservation',
      status: 'locked',
      progress: 0,
      icon: Clock,
      description: 'Property reservation'
    },
    {
      id: 'legal',
      title: 'Legal Process',
      status: 'locked',
      progress: 0,
      icon: Clock,
      description: 'Legal documentation'
    }
  ];

  const getStepIcon = (step: any) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-6 h-6 text-blue-600" />;
      case 'locked':
        return <AlertCircle className="w-6 h-6 text-gray-400" />;
      default:
        return <step.icon className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStepColor = (step: any) => {
    switch (step.status) {
      case 'completed':
        return 'bg-green-100 border-green-300';
      case 'in-progress':
        return 'bg-blue-100 border-blue-300';
      case 'locked':
        return 'bg-gray-100 border-gray-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Your Buying Journey</h1>
      <p className="text-gray-600 mb-8">
        Track your progress through the home buying process. Complete each step to unlock the next.
      </p>
      
      {/* Verification Status Banner */}
      {!verificationComplete && (
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-medium text-blue-900">Identity Verification Required</h3>
                <p className="text-sm text-blue-700">
                  Complete your verification to unlock all journey features
                </p>
              </div>
            </div>
            <Link 
              href="/buyer/verification/unified"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Continue Verification
            </Link>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-blue-700 mb-1">
              <span>Verification Progress</span>
              <span>{Math.round(verificationProgress)}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${verificationProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Journey Steps */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-6">Journey Tracker</h2>
        <div className="space-y-6">
          {journeySteps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex-shrink-0 w-12 h-12 rounded-full border-2 ${getStepColor(step)} flex items-center justify-center`}>
                {getStepIcon(step)}
              </div>
              
              <div className="flex-1 ml-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-medium ${
                    step.status === 'completed' ? 'text-green-900' :
                    step.status === 'in-progress' ? 'text-blue-900' :
                    'text-gray-500'
                  }`}>
                    {step.title}
                  </h3>
                  <span className={`text-sm ${
                    step.status === 'completed' ? 'text-green-600' :
                    step.status === 'in-progress' ? 'text-blue-600' :
                    'text-gray-400'
                  }`}>
                    {step.progress}%
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      step.status === 'completed' ? 'bg-green-500' :
                      step.status === 'in-progress' ? 'bg-blue-500' :
                      'bg-gray-300'
                    }`}
                    style={{ width: `${step.progress}%` }}
                  />
                </div>
              </div>

              {/* Action button for actionable steps */}
              {step.status === 'in-progress' && step.id === 'verification' && (
                <Link 
                  href="/buyer/verification/unified"
                  className="ml-4 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                >
                  Continue
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h2 className="text-xl font-semibold mb-4">Current Phase: Financing</h2>
          <p className="mb-4">
            In this phase, you'll secure your mortgage approval and prepare your finances for the purchase.
          </p>
          <div className="space-y-3">
            <div className="flex items-center bg-white p-3 rounded border">
              <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                ✓
              </div>
              <span className="line-through text-gray-500">Apply for mortgage approval in principle</span>
            </div>
            <div className="flex items-center bg-white p-3 rounded border">
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-3">
              </div>
              <span>Upload financial documents</span>
            </div>
            <div className="flex items-center bg-white p-3 rounded border">
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-3">
              </div>
              <span>Complete Help-to-Buy application</span>
            </div>
          </div>
          <div className="mt-4">
            <a href="/buyer/journey/financing" className="px-4 py-2 bg-blue-600 text-white rounded inline-block">
              Continue Financing
            </a>
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Phase Selection</h2>
          <div className="space-y-3">
            <a href="/buyer/journey/planning" className="flex items-center p-4 bg-white rounded-lg border hover:border-blue-300 hover:bg-blue-50">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                ✓
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Planning</h3>
                <p className="text-sm text-gray-600">Completed 2 days ago</p>
              </div>
              <span className="text-blue-600">→</span>
            </a>
            
            <a href="/buyer/journey/financing" className="flex items-center p-4 bg-white rounded-lg border border-blue-300 bg-blue-50">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                ⬤
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Financing</h3>
                <p className="text-sm text-gray-600">In progress</p>
              </div>
              <span className="text-blue-600">→</span>
            </a>
            
            <a href="/buyer/journey/property-search" className="flex items-center p-4 bg-white rounded-lg border hover:border-blue-300 hover:bg-blue-50">
              <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mr-3">
                ⏱
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Property Search</h3>
                <p className="text-sm text-gray-600">Coming next</p>
              </div>
              <span className="text-blue-600">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}