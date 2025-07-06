'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useBuyerJourney } from '@/hooks/useBuyerJourney';

import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  Home, 
  Calculator, 
  FileSearch, 
  Building, 
  CreditCard,
  UserCheck,
  FileText,
  Shield,
  Key,
  AlertCircle,
  ClipboardCheck,
  Calendar,
  Download,
  Euro
} from 'lucide-react';

// Disable static generation for auth pages
export const dynamic = 'force-dynamic';

// Journey stages specific to Irish property purchases
const journeyStages = [
  {
    id: 'preparation',
    title: 'Financial Preparation',
    icon: <Calculator className="w-5 h-5" />,
    description: 'Get your finances ready',
    tasks: [
      {
        id: 'budget-calculation',
        title: 'Calculate your budget',
        description: 'Determine how much you can afford including all costs',
        completed: false,
        link: '/first-time-buyers/calculator'
      },
      {
        id: 'htb-eligibility',
        title: 'Check Help-to-Buy eligibility',
        description: 'See if you qualify for HTB and calculate your refund',
        completed: false,
        link: '/first-time-buyers/help-to-buy'
      },
      {
        id: 'mortgage-approval',
        title: 'Get mortgage approval in principle',
        description: 'Secure AIP from your chosen lender',
        completed: false,
        link: '/first-time-buyers/mortgage-guide'
      },
      {
        id: 'solicitor-selection',
        title: 'Choose your solicitor',
        description: 'Select a solicitor experienced in property purchases',
        completed: false,
        link: '/first-time-buyers/solicitor-guide'
      }
    ]
  },
  {
    id: 'property-search',
    title: 'Property Search',
    icon: <Home className="w-5 h-5" />,
    description: 'Find your perfect home',
    tasks: [
      {
        id: 'view-properties',
        title: 'View available properties',
        description: 'Browse and visit properties within your budget',
        completed: false,
        link: '/properties'
      },
      {
        id: 'research-developments',
        title: 'Research developments',
        description: 'Check BER ratings, management fees, and amenities',
        completed: false,
        link: '/developments'
      },
      {
        id: 'make-booking',
        title: 'Make a booking',
        description: 'Reserve your chosen property (typically €5,000)',
        completed: false,
        link: '/properties'
      }
    ]
  },
  {
    id: 'htb-application',
    title: 'HTB Application',
    icon: <FileText className="w-5 h-5" />,
    description: 'Apply for Help-to-Buy',
    tasks: [
      {
        id: 'revenue-myaccount',
        title: 'Create Revenue myAccount',
        description: 'Set up your online Revenue account if needed',
        completed: false,
        link: 'https://www.ros.ie/myaccount-web/home.html'
      },
      {
        id: 'htb-online-application',
        title: 'Complete HTB application',
        description: 'Apply online through Revenue myAccount',
        completed: false,
        link: '/first-time-buyers/help-to-buy/apply'
      },
      {
        id: 'htb-approval',
        title: 'Receive HTB approval',
        description: 'Get your HTB approval number',
        completed: false,
        link: '/first-time-buyers/help-to-buy/status'
      }
    ]
  },
  {
    id: 'legal-documentation',
    title: 'Legal Process',
    icon: <Shield className="w-5 h-5" />,
    description: 'Complete legal requirements',
    tasks: [
      {
        id: 'contract-review',
        title: 'Contract review',
        description: 'Solicitor reviews purchase contract',
        completed: false
      },
      {
        id: 'kyc-aml',
        title: 'Complete KYC/AML',
        description: 'Provide identification and address verification',
        completed: false,
        link: '/first-time-buyers/kyc'
      },
      {
        id: 'sign-contracts',
        title: 'Sign contracts',
        description: 'Sign and exchange contracts with vendor',
        completed: false
      },
      {
        id: 'pay-deposit',
        title: 'Pay deposit',
        description: 'Pay 10% deposit (minus booking deposit)',
        completed: false
      }
    ]
  },
  {
    id: 'mortgage-completion',
    title: 'Mortgage Finalisation',
    icon: <CreditCard className="w-5 h-5" />,
    description: 'Complete mortgage process',
    tasks: [
      {
        id: 'formal-application',
        title: 'Submit formal mortgage application',
        description: 'Complete full mortgage application with all documents',
        completed: false
      },
      {
        id: 'property-valuation',
        title: 'Property valuation',
        description: 'Lender conducts property valuation',
        completed: false
      },
      {
        id: 'meet-conditions',
        title: 'Meet all conditions',
        description: 'Satisfy all lender requirements',
        completed: false
      },
      {
        id: 'mortgage-offer',
        title: 'Receive mortgage offer',
        description: 'Get formal mortgage offer letter',
        completed: false
      }
    ]
  },
  {
    id: 'closing',
    title: 'Closing Process',
    icon: <Key className="w-5 h-5" />,
    description: 'Complete the purchase',
    tasks: [
      {
        id: 'final-inspection',
        title: 'Final property inspection',
        description: 'Complete snag list and final walk-through',
        completed: false
      },
      {
        id: 'mortgage-drawdown',
        title: 'Mortgage drawdown',
        description: 'Lender releases funds to solicitor',
        completed: false
      },
      {
        id: 'pay-stamp-duty',
        title: 'Pay stamp duty',
        description: 'Pay 1% stamp duty through solicitor',
        completed: false
      },
      {
        id: 'register-property',
        title: 'Register property',
        description: 'Register with Property Registration Authority',
        completed: false
      },
      {
        id: 'receive-keys',
        title: 'Receive keys',
        description: 'Get keys to your new home!',
        completed: false
      }
    ]
  }
];

// Document requirements for Irish property purchase
const documentRequirements = [
  {
    category: 'Identity Verification',
    documents: [
      { name: 'Passport or Driving License', required: true, uploaded: false },
      { name: 'PPS Number documentation', required: true, uploaded: false }
    ]
  },
  {
    category: 'Address Verification',
    documents: [
      { name: 'Utility bill (< 3 months)', required: true, uploaded: false },
      { name: 'Bank statement (< 3 months)', required: true, uploaded: false }
    ]
  },
  {
    category: 'Financial Documentation',
    documents: [
      { name: 'Employment contract', required: true, uploaded: false },
      { name: 'P60 (last 2 years)', required: true, uploaded: false },
      { name: 'Payslips (last 3 months)', required: true, uploaded: false },
      { name: 'Bank statements (last 6 months)', required: true, uploaded: false }
    ]
  },
  {
    category: 'HTB Documentation',
    documents: [
      { name: 'HTB approval summary', required: true, uploaded: false },
      { name: 'Tax clearance certificate', required: false, uploaded: false }
    ]
  },
  {
    category: 'Legal Documents',
    documents: [
      { name: 'Booking form', required: true, uploaded: false },
      { name: 'Contract for sale', required: true, uploaded: false },
      { name: 'Building agreement (if applicable)', required: false, uploaded: false }
    ]
  }
];

export default function FirstTimeBuyerJourneyPage() {
  const router = useRouter();
  
  // Safe auth access during build
  let user = null;
  let journeyPhase = null;
  
  try {
    const authData = useAuth();
    user = authData.user;
  } catch (e) {
    // Auth provider not available during build
  }
  
  try {
    const journeyData = useBuyerJourney();
    journeyPhase = journeyData.journeyPhase;
  } catch (e) {
    // Journey hook not available during build
  }
  const [activeStage, setActiveStage] = useState('preparation');
  const [tasksCompleted, setTasksCompleted] = useState<Record<string, boolean>>({});
  const [documentsUploaded, setDocumentsUploaded] = useState<Record<string, boolean>>({});

  const toggleTaskCompletion = (taskId: string) => {
    setTasksCompleted(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const calculateProgress = () => {
    const totalTasks = journeyStages.reduce((acc, stage) => acc + stage.tasks.length, 0);
    const completedTasks = Object.values(tasksCompleted).filter(Boolean).length;
    return Math.round((completedTasks / totalTasks) * 100);
  };

  const isStageComplete = (stageId: string) => {
    const stage = journeyStages.find(s => s.id === stageId);
    if (!stage) return false;
    return stage.tasks.every(task => tasksCompleted[task.id]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your First-Time Buyer Journey</h1>
              <p className="text-gray-600 mt-1">Track your progress through the Irish property purchase process</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Overall Progress</p>
              <p className="text-2xl font-bold text-blue-600">{calculateProgress()}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="bg-white py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between overflow-x-auto">
            {journeyStages.map((stage, index) => (
              <div key={stage.id} className="flex items-center">
                <button
                  onClick={() => setActiveStage(stage.id)}
                  className={`flex flex-col items-center text-center min-w-[120px] px-4 py-2 rounded-lg transition ${
                    activeStage === stage.id 
                      ? 'bg-blue-50 text-blue-600' 
                      : isStageComplete(stage.id)
                      ? 'text-green-600'
                      : 'text-gray-500'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    isStageComplete(stage.id) 
                      ? 'bg-green-100' 
                      : activeStage === stage.id
                      ? 'bg-blue-100'
                      : 'bg-gray-100'
                  }`}>
                    {isStageComplete(stage.id) ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      stage.icon
                    )}
                  </div>
                  <span className="text-sm font-medium">{stage.title}</span>
                </button>
                {index < journeyStages.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    isStageComplete(stage.id) ? 'bg-green-400' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tasks Section */}
          <div className="lg:col-span-2">
            {journeyStages.map((stage) => (
              <div
                key={stage.id}
                className={`mb-8 ${activeStage !== stage.id ? 'hidden' : ''}`}
              >
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      {stage.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{stage.title}</h2>
                      <p className="text-gray-600">{stage.description}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {stage.tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`border rounded-lg p-4 transition ${
                          tasksCompleted[task.id] 
                            ? 'border-green-300 bg-green-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start">
                          <button
                            onClick={() => toggleTaskCompletion(task.id)}
                            className="mr-4 flex-shrink-0"
                          >
                            {tasksCompleted[task.id] ? (
                              <CheckCircle className="w-6 h-6 text-green-600" />
                            ) : (
                              <Circle className="w-6 h-6 text-gray-400" />
                            )}
                          </button>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{task.title}</h3>
                            <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                            {task.link && (
                              <a
                                href={task.link}
                                className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm mt-2"
                              >
                                Go to {task.title}
                                <ArrowRight className="w-4 h-4 ml-1" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Documents Checklist */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Document Requirements
              </h3>
              <div className="space-y-4">
                {documentRequirements.map((category) => (
                  <div key={category.category}>
                    <h4 className="font-medium text-gray-700 mb-2">
                      {category.category}
                    </h4>
                    <div className="space-y-2">
                      {category.documents.map((doc) => (
                        <div
                          key={doc.name}
                          className="flex items-center text-sm"
                        >
                          <div className={`w-4 h-4 rounded mr-2 ${
                            documentsUploaded[doc.name] 
                              ? 'bg-green-500' 
                              : 'bg-gray-300'
                          }`}>
                            {documentsUploaded[doc.name] && (
                              <CheckCircle className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <span className={`flex-1 ${
                            documentsUploaded[doc.name] 
                              ? 'text-green-700' 
                              : 'text-gray-600'
                          }`}>
                            {doc.name}
                          </span>
                          {doc.required && (
                            <span className="text-red-500 text-xs">Required</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Upload Documents
              </button>
            </div>

            {/* Key Resources */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Key Resources
              </h3>
              <div className="space-y-3">
                <a
                  href="/first-time-buyers/help-to-buy"
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  HTB Calculator
                </a>
                <a
                  href="/first-time-buyers/guides/mortgage"
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Mortgage Guide
                </a>
                <a
                  href="/first-time-buyers/guides/costs"
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Euro className="w-5 h-5 mr-2" />
                  Costs Breakdown
                </a>
                <a
                  href="/first-time-buyers/guides/legal"
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Legal Process
                </a>
              </div>
            </div>

            {/* Important Dates */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Important Dates
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Booking Date</p>
                    <p className="text-sm text-gray-600">March 15, 2025</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Contract Deadline</p>
                    <p className="text-sm text-gray-600">April 30, 2025</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Expected Closing</p>
                    <p className="text-sm text-gray-600">July 15, 2025</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2 text-blue-900">
                Need Help?
              </h3>
              <p className="text-sm text-blue-700 mb-4">
                Our expert team is here to guide you through every step
              </p>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}