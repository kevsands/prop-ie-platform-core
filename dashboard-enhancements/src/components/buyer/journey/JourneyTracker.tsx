'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  CircleDot, 
  Clock, 
  ChevronRight, 
  ArrowRight,
  Home,
  CreditCard,
  Search,
  FileText,
  ClipboardCheck,
  Truck,
  ArrowRightCircle
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/useToast';
import { formatDistance } from 'date-fns';
import { useBuyerJourney } from '@/context/BuyerJourneyContext';
import { BuyerPhase } from '@/types/buyer-journey';

export type JourneyPhaseStatus = 'complete' | 'active' | 'pending';

export interface JourneyPhase {
  id: BuyerPhase;
  name: string;
  path: string;
  status: JourneyPhaseStatus;
  icon: React.ReactNode;
  description: string;
  nextSteps?: string[];
  completedTasks?: string[];
}

interface JourneyTrackerProps {
  isDetailView?: boolean;
}

export default function JourneyTracker({ isDetailView = false }: JourneyTrackerProps) {
  const { journey, loading, error, refreshJourney, getPhaseNextSteps, getPhaseCompletedTasks } = useBuyerJourney();
  const { toast } = useToast();
  const [phaseNextSteps, setPhaseNextSteps] = useState<Record<BuyerPhase, string[]>>({} as Record<BuyerPhase, string[]>);
  const [phaseCompletedTasks, setPhaseCompletedTasks] = useState<Record<BuyerPhase, string[]>>({} as Record<BuyerPhase, string[]>);

  // Fetch next steps and completed tasks for the current phase
  useEffect(() => {
    const fetchPhaseData = async () => {
      if (!journey) return;
      
      // Fetch data for current phase
      const nextSteps = await getPhaseNextSteps(journey.currentPhase);
      const completedTasks = await getPhaseCompletedTasks(journey.currentPhase);
      
      setPhaseNextSteps(prev => ({
        ...prev,
        [journey.currentPhase]: nextSteps
      }));
      
      setPhaseCompletedTasks(prev => ({
        ...prev,
        [journey.currentPhase]: completedTasks
      }));
    };
    
    if (journey && !loading) {
      fetchPhaseData();
    }
  }, [journey, loading, getPhaseNextSteps, getPhaseCompletedTasks]);

  // Define the journey phases
  const getJourneyPhases = (currentPhase: BuyerPhase): JourneyPhase[] => {
    const phases: JourneyPhase[] = [
      {
        id: 'PLANNING',
        name: 'Planning',
        path: '/buyer/journey/planning',
        status: currentPhase === 'PLANNING' 
                ? 'active' 
                : ['FINANCING', 'PROPERTY_SEARCH', 'RESERVATION', 'LEGAL_PROCESS', 'CONSTRUCTION', 'COMPLETION', 'POST_PURCHASE'].includes(currentPhase)
                ? 'complete'
                : 'pending',
        icon: <Home size={isDetailView ? 24 : 18} />,
        description: 'Research, education, and understanding your affordability',
        nextSteps: phaseNextSteps['PLANNING'] || [
          'Complete your financial profile',
          'Set your budget and preferences',
          'Learn about the home buying process'
        ],
        completedTasks: phaseCompletedTasks['PLANNING'] || [
          'Create account',
          'Complete initial assessment'
        ]
      },
      {
        id: 'FINANCING',
        name: 'Financing',
        path: '/buyer/journey/financing',
        status: currentPhase === 'FINANCING' 
                ? 'active' 
                : ['PROPERTY_SEARCH', 'RESERVATION', 'LEGAL_PROCESS', 'CONSTRUCTION', 'COMPLETION', 'POST_PURCHASE'].includes(currentPhase)
                ? 'complete'
                : 'pending',
        icon: <CreditCard size={isDetailView ? 24 : 18} />,
        description: 'Mortgage pre-approval, Help-to-Buy application',
        nextSteps: phaseNextSteps['FINANCING'] || [
          'Submit mortgage application',
          'Gather supporting financial documents',
          'Apply for Help-to-Buy scheme'
        ],
        completedTasks: phaseCompletedTasks['FINANCING'] || [
          'Research mortgage options',
          'Calculate affordability'
        ]
      },
      {
        id: 'PROPERTY_SEARCH',
        name: 'Property Search',
        path: '/buyer/journey/property-search',
        status: currentPhase === 'PROPERTY_SEARCH' 
                ? 'active' 
                : ['RESERVATION', 'LEGAL_PROCESS', 'CONSTRUCTION', 'COMPLETION', 'POST_PURCHASE'].includes(currentPhase)
                ? 'complete'
                : 'pending',
        icon: <Search size={isDetailView ? 24 : 18} />,
        description: 'Viewing properties and selecting options',
        nextSteps: phaseNextSteps['PROPERTY_SEARCH'] || [
          'Schedule property viewings',
          'Compare developments and units',
          'Explore customization options'
        ],
        completedTasks: phaseCompletedTasks['PROPERTY_SEARCH'] || []
      },
      {
        id: 'RESERVATION',
        name: 'Reservation',
        path: '/buyer/journey/reservation',
        status: currentPhase === 'RESERVATION' 
                ? 'active' 
                : ['LEGAL_PROCESS', 'CONSTRUCTION', 'COMPLETION', 'POST_PURCHASE'].includes(currentPhase)
                ? 'complete'
                : 'pending',
        icon: <ClipboardCheck size={isDetailView ? 24 : 18} />,
        description: 'Reserving your property and paying deposit',
        nextSteps: phaseNextSteps['RESERVATION'] || [
          'Pay reservation fee',
          'Confirm property details',
          'Review customization options'
        ],
        completedTasks: phaseCompletedTasks['RESERVATION'] || []
      },
      {
        id: 'LEGAL_PROCESS',
        name: 'Legal Process',
        path: '/buyer/journey/legal-process',
        status: currentPhase === 'LEGAL_PROCESS' 
                ? 'active' 
                : ['CONSTRUCTION', 'COMPLETION', 'POST_PURCHASE'].includes(currentPhase)
                ? 'complete'
                : 'pending',
        icon: <FileText size={isDetailView ? 24 : 18} />,
        description: 'Contracts and legal work',
        nextSteps: phaseNextSteps['LEGAL_PROCESS'] || [
          'Appoint a solicitor',
          'Review and sign contracts',
          'Complete legal checks'
        ],
        completedTasks: phaseCompletedTasks['LEGAL_PROCESS'] || []
      },
      {
        id: 'COMPLETION',
        name: 'Completion',
        path: '/buyer/journey/completion',
        status: currentPhase === 'COMPLETION' 
                ? 'active' 
                : ['POST_PURCHASE'].includes(currentPhase)
                ? 'complete'
                : 'pending',
        icon: <Truck size={isDetailView ? 24 : 18} />,
        description: 'Closing and funds transfer',
        nextSteps: phaseNextSteps['COMPLETION'] || [
          'Prepare final payment',
          'Schedule move-in date',
          'Plan your move'
        ],
        completedTasks: phaseCompletedTasks['COMPLETION'] || []
      }
    ];

    return phases;
  };

  const renderLoadingSkeleton = () => (
    <div className="w-full">
      {isDetailView ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-8 w-1/4" />
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3, 4, 5, 6].map(item => (
              <Skeleton key={item} className="h-24 w-full" />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-6 w-1/4" />
          </div>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((phase, i) => (
              <React.Fragment key={phase}>
                <Skeleton className="w-8 h-8 rounded-full" />
                {i < 4 && <Skeleton className="flex-1 h-1 mx-2" />}
              </React.Fragment>
            ))}
          </div>
        </>
      )}
    </div>
  );

  // Show loading skeleton while data is being fetched
  if (loading) {
    return renderLoadingSkeleton();
  }

  // If we don't have journey data and we're not loading
  if (!journey) {
    return (
      <div className="text-center py-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Start Your Home Buying Journey</h3>
        <p className="text-gray-600 mb-4">Track your progress from planning to moving into your new home.</p>
        <Button onClick={refreshJourney}>
          Get Started <ArrowRightCircle className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  // Get phases with their statuses based on current phase
  const phases = getJourneyPhases(journey.currentPhase);
  const currentPhaseObject = phases.find(phase => phase.id === journey.currentPhase);

  // Simple tracker view for the layout
  if (!isDetailView) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Your Home Buying Journey</h2>
          <Link href="/buyer/journey" className="text-blue-600 text-sm flex items-center">
            View Details <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        <div className="flex items-center">
          {phases.map((phase, index) => (
            <React.Fragment key={phase.id}>
              <Link href={phase.path} className="flex flex-col items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    phase.status === 'complete' ? 'bg-green-100 text-green-600' : 
                    phase.status === 'active' ? 'bg-blue-100 text-blue-600' : 
                    'bg-gray-100 text-gray-400'
                  }`}
                >
                  {phase.status === 'complete' ? (
                    <CheckCircle2 size={18} />
                  ) : phase.status === 'active' ? (
                    <CircleDot size={18} /> 
                  ) : (
                    <Clock size={18} />
                  )}
                </div>
                <span 
                  className={`text-xs mt-1 ${
                    phase.status === 'complete' ? 'text-green-600' : 
                    phase.status === 'active' ? 'text-blue-600' : 
                    'text-gray-400'
                  }`}
                >
                  {phase.name}
                </span>
              </Link>
              {index < phases.length - 1 && (
                <div 
                  className={`flex-1 h-1 mx-2 ${
                    phase.status === 'complete' ? 'bg-green-200' : 'bg-gray-200'
                  }`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  // Detailed tracker view for the journey page
  return (
    <div className="space-y-8">
      {/* Journey summary */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Current Phase: {currentPhaseObject?.name}</h2>
          <p className="text-gray-600">
            Started {formatDistance(new Date(journey.startDate), new Date(), { addSuffix: true })}
            {journey.targetMoveInDate && ` • Target move-in ${formatDistance(new Date(journey.targetMoveInDate), new Date(), { addSuffix: true })}`}
          </p>
        </div>
        <div className="mt-4 lg:mt-0">
          {currentPhaseObject?.id === 'PLANNING' && (
            <Button>
              Complete Financial Profile <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
          {currentPhaseObject?.id === 'FINANCING' && (
            <Button>
              Start Mortgage Application <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
          {currentPhaseObject?.id === 'PROPERTY_SEARCH' && (
            <Button>
              Browse Properties <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Detailed journey phases */}
      <div className="space-y-4">
        {phases.map((phase, index) => (
          <div 
            key={phase.id}
            className={`p-4 rounded-lg border ${
              phase.status === 'active' ? 'border-blue-200 bg-blue-50' : 
              phase.status === 'complete' ? 'border-green-200 bg-green-50' : 
              'border-gray-200'
            }`}
          >
            <div className="flex items-center">
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                  phase.status === 'complete' ? 'bg-green-100 text-green-600' : 
                  phase.status === 'active' ? 'bg-blue-100 text-blue-600' : 
                  'bg-gray-100 text-gray-400'
                }`}
              >
                {phase.icon}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-semibold ${
                    phase.status === 'complete' ? 'text-green-800' : 
                    phase.status === 'active' ? 'text-blue-800' : 
                    'text-gray-800'
                  }`}>
                    {index + 1}. {phase.name}
                  </h3>
                  <div className={`text-sm font-medium px-3 py-1 rounded-full ${
                    phase.status === 'complete' ? 'bg-green-200 text-green-800' : 
                    phase.status === 'active' ? 'bg-blue-200 text-blue-800' : 
                    'bg-gray-200 text-gray-800'
                  }`}>
                    {phase.status === 'complete' ? 'Completed' : 
                     phase.status === 'active' ? 'In Progress' : 'Upcoming'}
                  </div>
                </div>
                
                <p className="text-gray-600 mt-1">{phase.description}</p>
                
                {/* Show next steps for active phase */}
                {phase.status === 'active' && phase.nextSteps && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">Next Steps:</h4>
                    <ul className="space-y-2">
                      {phase.nextSteps.map((step, i) => (
                        <li key={i} className="flex items-start">
                          <div className="bg-blue-100 rounded-full p-1 text-blue-600 mr-2 mt-0.5">
                            <ArrowRight size={12} />
                          </div>
                          <span className="text-sm text-gray-700">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Show completed tasks for completed or active phase */}
                {(phase.status === 'complete' || phase.status === 'active') && phase.completedTasks && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-green-800 mb-2">Completed:</h4>
                    <ul className="space-y-2">
                      {phase.completedTasks.map((task, i) => (
                        <li key={i} className="flex items-start">
                          <div className="bg-green-100 rounded-full p-1 text-green-600 mr-2 mt-0.5">
                            <CheckCircle2 size={12} />
                          </div>
                          <span className="text-sm text-gray-700">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <Link 
                href={phase.path}
                className={`ml-4 px-4 py-2 text-sm font-medium rounded-md ${
                  phase.status === 'pending' ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                aria-disabled={phase.status === 'pending'}
                tabIndex={phase.status === 'pending' ? -1 : undefined}
                onClick={e => phase.status === 'pending' && e.preventDefault()}
              >
                {phase.status === 'complete' ? 'Review' : 
                 phase.status === 'active' ? 'Manage' : 'View'}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}