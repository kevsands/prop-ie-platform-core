'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useBuyerJourney } from '@/hooks/useBuyerJourney';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { StopCircleIcon as CircleIcon } from '@heroicons/react/24/outline';
import { JourneyStage, BuyerJourneyData } from '@/types/buyer-journey';

interface BuyerJourneyStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  action?: string;
  route?: string;
  requiredData?: string[];
}

export function BuyerJourneyManager() {
  const router = useRouter();
  const { user } = useAuth();
  const { 
    journeyData, 
    currentStage, 
    updateStage, 
    getProgress,
    isLoading 
  } = useBuyerJourney();

  const [steps, setSteps] = useState<BuyerJourneyStep[]>([]);

  useEffect(() => {
    // Define the buyer journey steps
    const journeySteps: BuyerJourneyStep[] = [
      {
        id: 'profile-setup',
        title: 'Complete Your Profile',
        description: 'Tell us about your property requirements and budget',
        status: journeyData?.profileCompleted ? 'completed' : 'current',
        action: 'Complete Profile',
        route: '/buyer/profile',
        requiredData: ['budget', 'location', 'propertyType']
      },
      {
        id: 'pre-approval',
        title: 'Get Pre-Approved',
        description: 'Secure your mortgage pre-approval to know your budget',
        status: journeyData?.preApprovalStatus === 'approved' ? 'completed' : 
                journeyData?.profileCompleted ? 'current' : 'upcoming',
        action: 'Start Pre-Approval',
        route: '/buyer/pre-approval',
        requiredData: ['income', 'employment', 'creditScore']
      },
      {
        id: 'property-search',
        title: 'Search Properties',
        description: 'Browse available properties matching your criteria',
        status: journeyData?.viewedProperties?.length > 0 ? 'completed' :
                journeyData?.preApprovalStatus === 'approved' ? 'current' : 'upcoming',
        action: 'Browse Properties',
        route: '/properties',
        requiredData: []
      },
      {
        id: 'property-viewing',
        title: 'View Properties',
        description: 'Schedule and attend property viewings',
        status: journeyData?.viewings?.length > 0 ? 'completed' :
                journeyData?.savedProperties?.length > 0 ? 'current' : 'upcoming',
        action: 'Schedule Viewing',
        route: '/buyer/viewings',
        requiredData: ['selectedProperty']
      },
      {
        id: 'make-offer',
        title: 'Make an Offer',
        description: 'Submit your offer on your chosen property',
        status: journeyData?.offers?.length > 0 ? 'completed' :
                journeyData?.viewings?.length > 0 ? 'current' : 'upcoming',
        action: 'Make Offer',
        route: '/buyer/offers',
        requiredData: ['selectedProperty', 'offerAmount']
      },
      {
        id: 'legal-process',
        title: 'Legal Process',
        description: 'Complete legal checks and documentation',
        status: journeyData?.legalStatus === 'completed' ? 'completed' :
                journeyData?.offers?.some(o => o.status === 'accepted') ? 'current' : 'upcoming',
        action: 'Start Legal Process',
        route: '/buyer/legal',
        requiredData: ['acceptedOffer', 'solicitor']
      },
      {
        id: 'closing',
        title: 'Closing',
        description: 'Finalize purchase and receive keys',
        status: journeyData?.purchaseCompleted ? 'completed' :
                journeyData?.legalStatus === 'in-progress' ? 'current' : 'upcoming',
        action: 'View Closing Details',
        route: '/buyer/closing',
        requiredData: ['closingDate', 'finalPayment']
      }
    ];

    setSteps(journeySteps);
  }, [journeyData]);

  const getCurrentStep = () => steps.find(step => step.status === 'current');
  const getCompletedSteps = () => steps.filter(step => step.status === 'completed').length;
  const progress = (getCompletedSteps() / steps.length) * 100;

  const handleStepAction = (step: BuyerJourneyStep) => {
    if (step.route) {
      router.push(step.route);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Home Buying Journey</h1>
        <p className="text-gray-600">Track your progress from search to keys</p>
      </div>

      {/* Progress Overview */}
      <Card className="mb-8 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">Overall Progress</h2>
            <p className="text-sm text-gray-600">
              {getCompletedSteps()} of {steps.length} steps completed
            </p>
          </div>
          <div className="text-3xl font-bold text-primary">
            {Math.round(progress)}%
          </div>
        </div>
        <Progress value={progress} className="h-3" />
      </Card>

      {/* Journey Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <Card 
            key={step.id} 
            className={`p-6 transition-all ${
              step.status === 'current' 
                ? 'border-primary shadow-lg' 
                : step.status === 'upcoming'
                ? 'opacity-60'
                : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {step.status === 'completed' ? (
                    <CheckCircleIcon className="h-8 w-8 text-green-500" />
                  ) : step.status === 'current' ? (
                    <div className="relative">
                      <CircleIcon className="h-8 w-8 text-primary animate-pulse" />
                      <div className="absolute inset-0 h-8 w-8 bg-primary rounded-full animate-ping opacity-25" />
                    </div>
                  ) : (
                    <CircleIcon className="h-8 w-8 text-gray-300" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold flex items-center">
                    {step.title}
                    {step.status === 'current' && (
                      <span className="ml-2 text-sm font-normal text-primary">
                        (Current Step)
                      </span>
                    )}
                  </h3>
                  <p className="text-gray-600 mt-1">{step.description}</p>
                  
                  {step.status === 'current' && step.requiredData && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700">Required:</p>
                      <ul className="text-sm text-gray-600 list-disc list-inside mt-1">
                        {step.requiredData.map(item => (
                          <li key={item}>{item.replace(/([A-Z])/g, ' $1').trim()}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              
              {step.status === 'current' && step.action && (
                <Button
                  onClick={() => handleStepAction(step)}
                  className="flex-shrink-0"
                >
                  {step.action}
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Next Steps Recommendation */}
      {getCurrentStep() && (
        <Card className="mt-8 p-6 bg-primary/5 border-primary/20">
          <h3 className="text-lg font-semibold mb-2">Recommended Next Step</h3>
          <p className="text-gray-700 mb-4">
            {getCurrentStep()?.description}
          </p>
          <Button
            onClick={() => handleStepAction(getCurrentStep()!)}
            size="lg"
            className="w-full sm:w-auto"
          >
            {getCurrentStep()?.action || 'Continue'}
          </Button>
        </Card>
      )}
    </div>
  );
}