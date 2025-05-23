'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  CurrencyEuroIcon,
  HomeIcon,
  BriefcaseIcon,
  ClipboardDocumentCheckIcon,
  SparklesIcon,
  TruckIcon} from '@heroicons/react/24/outline';
import { useBuyerJourney } from '@/hooks/useBuyerJourney';
import { BuyerPhase } from '@/types/buyer-journey';

// Define journey steps with detailed sub-tasks
const journeySteps = [
  {
    phase: BuyerPhase.PLANNING,
    title: 'Research & Planning',
    description: 'Begin your home buying journey',
    icon: ClipboardDocumentCheckIcon,
    color: 'bg-blue-500',
    tasks: [
      'Complete affordability calculator',
      'Get mortgage pre-approval',
      'Research government schemes',
      'Find a solicitor',
      'Set your budget'],
    actions: [
      { label: 'Affordability Calculator', href: '/buyer/calculator' },
      { label: 'Government Schemes', href: '/buyer/htb' },
      { label: 'Find Solicitor', href: '/solicitors' }]},
  {
    phase: BuyerPhase.FINANCING,
    title: 'Secure Financing',
    description: 'Get your mortgage & HTB approved',
    icon: CurrencyEuroIcon,
    color: 'bg-green-500',
    tasks: [
      'Submit mortgage application',
      'Apply for Help to Buy',
      'Get mortgage approval',
      'Finalize deposit amount',
      'Review loan offer'],
    actions: [
      { label: 'Apply for Mortgage', href: '/buyer/mortgage' },
      { label: 'HTB Application', href: '/buyer/htb/new' },
      { label: 'Document Upload', href: '/buyer/documents' }]},
  {
    phase: BuyerPhase.PROPERTY_SEARCH,
    title: 'Find Your Home',
    description: 'Search and select your property',
    icon: HomeIcon,
    color: 'bg-purple-500',
    tasks: [
      'Browse available properties',
      'Schedule viewings',
      'Compare properties',
      'Select preferred unit',
      'Review development details'],
    actions: [
      { label: 'Browse Properties', href: '/properties' },
      { label: 'Book Viewing', href: '/buyer/viewings' },
      { label: 'Compare Units', href: '/buyer/saved-properties' }]},
  {
    phase: BuyerPhase.RESERVATION,
    title: 'Reserve Your Home',
    description: 'Secure your chosen property',
    icon: BriefcaseIcon,
    color: 'bg-indigo-500',
    tasks: [
      'Pay booking deposit',
      'Sign reservation agreement',
      'Receive reservation confirmation',
      'Submit customization choices',
      'Review timeline'],
    actions: [
      { label: 'Pay Deposit', href: '/buyer/payment-methods' },
      { label: 'Customize Unit', href: '/buyer/customization' },
      { label: 'View Timeline', href: '/buyer/purchase/timeline' }]},
  {
    phase: BuyerPhase.LEGAL_PROCESS,
    title: 'Legal Process',
    description: 'Complete contracts & legal work',
    icon: DocumentTextIcon,
    color: 'bg-orange-500',
    tasks: [
      'Sign sales contract',
      'Complete legal searches',
      'Review title documents',
      'Finalize mortgage drawdown',
      'Schedule closing date'],
    actions: [
      { label: 'Sign Contracts', href: '/buyer/contracts' },
      { label: 'Legal Documents', href: '/buyer/documents' },
      { label: 'Contact Solicitor', href: '/buyer/messages' }]},
  {
    phase: BuyerPhase.CONSTRUCTION,
    title: 'Construction Progress',
    description: 'Monitor your home being built',
    icon: TruckIcon,
    color: 'bg-yellow-500',
    tasks: [
      'Receive construction updates',
      'Review progress photos',
      'Schedule site visits',
      'Confirm customizations',
      'Prepare for handover'],
    actions: [
      { label: 'View Progress', href: '/buyer/purchase/progress' },
      { label: 'Construction Updates', href: '/buyer/purchase/updates' },
      { label: 'Schedule Visit', href: '/buyer/appointments' }]},
  {
    phase: BuyerPhase.COMPLETION,
    title: 'Closing & Handover',
    description: 'Complete purchase & get keys',
    icon: SparklesIcon,
    color: 'bg-pink-500',
    tasks: [
      'Final walkthrough',
      'Sign closing documents',
      'Transfer funds',
      'Receive keys',
      'Complete snagging list'],
    actions: [
      { label: 'Schedule Walkthrough', href: '/buyer/appointments' },
      { label: 'Closing Checklist', href: '/buyer/checklists' },
      { label: 'Snagging List', href: '/buyer/purchase/snagging' }]}];

export default function CompleteBuyerFlowPage() {
  const router = useRouter();
  const { journey, updateJourneyPhase } = useBuyerJourney();
  const [selectedPhasesetSelectedPhase] = useState(journey?.currentPhase || BuyerPhase.PLANNING);

  const currentStepIndex = journeySteps.findIndex(step => step.phase === selectedPhase);
  const progress = ((currentStepIndex + 1) / journeySteps.length) * 100;

  const getPhaseStatus = (phase: BuyerPhase) => {
    const stepIndex = journeySteps.findIndex(step => step.phase === phase);
    const currentIndex = journeySteps.findIndex(step => step.phase === journey?.currentPhase);

    if (stepIndex <currentIndex) return 'complete';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  const handlePhaseClick = (phase: BuyerPhase) => {
    setSelectedPhase(phase);
  };

  const handleActionClick = (href: string) => {
    router.push(href);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Home Buying Journey</h1>
        <p className="text-gray-600 mt-2">Track your progress from start to keys</p>
      </div>

      {/* Progress Bar */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">Journey Progress</span>
            <span className="text-sm font-medium text-green-600">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-3" />
          <div className="grid grid-cols-7 mt-6 relative">
            {journeySteps.map((stepindex) => {
              const status = getPhaseStatus(step.phase);
              const Icon = step.icon;

              return (
                <div key={step.phase} className="relative">
                  {index> 0 && (
                    <div
                      className={`absolute top-6 -left-1/2 right-1/2 h-0.5 ${
                        status === 'complete' ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  )}
                  <button
                    onClick={() => handlePhaseClick(step.phase)}
                    className={`relative z-10 mx-auto flex flex-col items-center cursor-pointer transition-all ${
                      selectedPhase === step.phase ? 'scale-110' : ''
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                        status === 'complete'
                          ? 'bg-green-500 text-white'
                          : status === 'active'
                          ? step.color + ' text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {status === 'complete' ? (
                        <CheckCircleIcon className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <span className="text-xs text-center font-medium text-gray-700">
                      {step.title}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Phase Details */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Current Phase Card */}
        <div className="lg:col-span-2">
          {journeySteps.map((step) => {
            if (step.phase !== selectedPhase) return null;

            const Icon = step.icon;
            const status = getPhaseStatus(step.phase);

            return (
              <Card key={step.phase} className="border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${step.color} text-white`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{step.title}</CardTitle>
                        <CardDescription>{step.description}</CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant={
                        status === 'complete'
                          ? 'success'
                          : status === 'active'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Tasks Checklist */}
                    <div>
                      <h3 className="font-semibold text-lg mb-4">Tasks to Complete</h3>
                      <div className="space-y-3">
                        {step.tasks.map((taskindex) => (
                          <div key={index} className="flex items-center space-x-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                status === 'complete'
                                  ? 'border-green-500 bg-green-500'
                                  : 'border-gray-300'
                              }`}
                            >
                              {status === 'complete' && (
                                <CheckCircleIcon className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <span className={status === 'complete' ? 'line-through text-gray-500' : ''}>
                              {task}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div>
                      <h3 className="font-semibold text-lg mb-4">Take Action</h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {step.actions.map((actionindex) => (
                          <Button
                            key={index}
                            variant="outline"
                            onClick={() => handleActionClick(action.href)}
                            className="justify-start"
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Timeline & Support */}
        <div className="space-y-6">
          {/* Estimated Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Estimated Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Start Date</span>
                  <span className="font-medium">{journey?.startDate || 'Not started'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Phase</span>
                  <span className="font-medium">{selectedPhase.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Target Move-in</span>
                  <span className="font-medium">
                    {journey?.targetMoveInDate || 'To be determined'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Need Help? */}
          <Card>
            <CardHeader>
              <CardTitle>Need Assistance?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <ClockIcon className="w-4 h-4 mr-2" />
                Schedule Advisor Call
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <DocumentTextIcon className="w-4 h-4 mr-2" />
                View Journey Guide
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <HomeIcon className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </CardContent>
          </Card>

          {/* Documents Hub */}
          <Card>
            <CardHeader>
              <CardTitle>Document Center</CardTitle>
              <CardDescription>All your documents in one place</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="primary" className="w-full" onClick={() => router.push('/buyer/documents')}>
                Access Documents
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}