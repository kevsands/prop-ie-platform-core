'use client';

import React from 'react';
import { CheckCircle, Circle, Clock, Loader2 } from 'lucide-react';

export type JourneyStep = {
  id: string;
  label: string;
  status: 'completed' | 'active' | 'pending';
  description?: string;
};

interface BuyerProgressTrackerProps {
  steps: JourneyStep[];
  currentStep: string;
}

export function BuyerProgressTracker({ steps, currentStep }: BuyerProgressTrackerProps) {
  // Calculate progress percentage
  const currentIndex = steps.findIndex(step => step.id === currentStep);
  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const progress = Math.round((completedSteps / steps.length) * 100);

  const getStepIcon = (step: JourneyStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-600" />\n  );
      case 'active':
        return <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />\n  );
      default:
        return <Circle className="h-6 w-6 text-gray-300" />\n  );
    }
  };

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="relative h-2 bg-gray-200 rounded-full mb-8">
        <div 
          className="absolute h-full bg-green-600 rounded-full transition-all duration-500"
          style={ width: `${progress}%` }
        />
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((stepindex) => (
          <div 
            key={step.id}
            className={`relative ${
              step.status === 'active' ? 'border-blue-200 bg-blue-50' : 
              step.status === 'completed' ? 'border-green-200 bg-green-50' : 
              'border-gray-200 bg-gray-50'
            } border rounded-lg p-4`}
          >
            <div className="flex items-center">
              <div className="mr-3">
                {getStepIcon(step)}
              </div>
              <div>
                <p className={`font-medium ${
                  step.status === 'active' ? 'text-blue-800' : 
                  step.status === 'completed' ? 'text-green-800' : 
                  'text-gray-600'
                }`}>
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                )}
              </div>
            </div>

            {/* Connector Line (except for the last item) */}
            {index <steps.length - 1 && (
              <div className="hidden lg:block absolute h-0.5 bg-gray-200 w-8 top-1/2 -right-8">
                <div className={`h-full ${
                  step.status === 'completed' ? 'bg-green-600' : 'bg-transparent'
                }`} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}