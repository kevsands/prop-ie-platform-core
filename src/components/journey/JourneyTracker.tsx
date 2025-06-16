'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';

interface JourneyStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  date?: Date;
}

interface JourneyTrackerProps {
  steps?: JourneyStep[];
  currentStep?: number;
}

export default function JourneyTracker({ steps, currentStep = 2 }: JourneyTrackerProps) {
  const defaultSteps: JourneyStep[] = [
    {
      id: '1',
      title: 'Pre-Approval',
      description: 'Get mortgage pre-approval',
      status: 'completed',
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    {
      id: '2',
      title: 'Property Search',
      description: 'Find your dream home',
      status: 'completed',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    {
      id: '3',
      title: 'Make Offer',
      description: 'Submit offer on property',
      status: 'current'},
    {
      id: '4',
      title: 'Legal Process',
      description: 'Complete legal requirements',
      status: 'upcoming'},
    {
      id: '5',
      title: 'Close Deal',
      description: 'Finalize purchase and get keys',
      status: 'upcoming'

  const displaySteps = steps || defaultSteps;

  const getStepIcon = (status: JourneyStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-8 w-8 text-green-500" />\n  );
      case 'current':
        return (
          <div className="h-8 w-8 rounded-full bg-blue-500 animate-pulse flex items-center justify-center">
            <div className="h-3 w-3 bg-white rounded-full" />
          </div>
        );
      default:
        return <Circle className="h-8 w-8 text-gray-300" />\n  );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Journey</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-4 top-8 bottom-4 w-0.5 bg-gray-200" />

          <div className="space-y-6">
            {displaySteps.map((step, index: any) => (
              <div key={step.id} className="flex items-start gap-4">
                <div className="relative">
                  {getStepIcon(step.status)}
                  {index <displaySteps.length - 1 && (
                    <div
                      className={`absolute top-8 left-4 w-0.5 h-6 ${
                        step.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h4
                    className={`font-medium ${
                      step.status === 'completed'
                        ? 'text-gray-700'
                        : step.status === 'current'
                        ? 'text-blue-600'
                        : 'text-gray-400'
                    }`}
                  >
                    {step.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                  {step.date && (
                    <p className="text-xs text-gray-500 mt-1">
                      Completed: {step.date.toLocaleDateString()}
                    </p>
                  )}
                </div>
                {step.status === 'current' && (
                  <ArrowRight className="h-5 w-5 text-blue-500 animate-pulse" />
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}