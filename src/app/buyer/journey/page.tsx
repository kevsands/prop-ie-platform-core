'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVerification } from '@/context/VerificationContext';
import { useEnterpriseAuth } from '@/context/EnterpriseAuthContext';
import { useJourneySync } from '@/hooks/useBuyerSync';

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
  Euro,
  Clock,
  Info
} from 'lucide-react';

// PROP.ie Off-Plan Purchase Journey Stages
const journeyStages = [
  {
    id: 'prerequisites',
    title: 'Pre-Purchase Setup',
    icon: <ClipboardCheck className="w-5 h-5" />,
    description: 'Complete requirements to buy off-plan online',
    isPrerequisite: true,
    tasks: [
      {
        id: 'identity-verification',
        title: 'Complete Identity Verification',
        description: 'Upload ID, PPS number, and proof of address - required for online purchase',
        completed: false,
        link: '/buyer/verification',
        required: true,
        estimatedTime: '10 minutes'
      },
      {
        id: 'financial-documentation',
        title: 'Submit Financial Documents',
        description: 'Upload employment, income, and bank statements',
        completed: false,
        link: '/buyer/documents',
        required: true,
        estimatedTime: '15 minutes'
      },
      {
        id: 'htb-eligibility-check',
        title: 'Confirm HTB Eligibility',
        description: 'Verify first-time buyer status and calculate your HTB benefit',
        completed: false,
        link: '/buyer/htb',
        required: true,
        estimatedTime: '5 minutes'
      },
      {
        id: 'mortgage-approval-principle',
        title: 'Secure Mortgage Approval in Principle',
        description: 'Get pre-approval from lender before property selection',
        completed: false,
        link: '/buyer/mortgage',
        required: true,
        estimatedTime: '2-5 days'
      },
      {
        id: 'budget-confirmation',
        title: 'Confirm Purchase Budget',
        description: 'Use our calculator to set your maximum purchase price',
        completed: false,
        link: '/buyer/calculator',
        required: true,
        estimatedTime: '5 minutes'
      }
    ]
  },
  {
    id: 'online-reservation',
    title: 'Online Reservation',
    icon: <Home className="w-5 h-5" />,
    description: 'Reserve your chosen property online - €500',
    paymentAmount: 500,
    paymentStage: 1,
    tasks: [
      {
        id: 'browse-properties',
        title: 'Browse Off-Plan Properties',
        description: 'Explore available units with 3D visualization and floor plans',
        completed: false,
        link: '/properties?filter=off-plan',
        estimatedTime: '30 minutes'
      },
      {
        id: 'select-unit',
        title: 'Select Your Unit',
        description: 'Choose specific apartment/house including floor, orientation, and views',
        completed: false,
        link: '/properties',
        estimatedTime: '10 minutes'
      },
      {
        id: 'customize-with-prop-choice',
        title: 'Customize with PROP Choice',
        description: 'Select finishes, appliances, and upgrades for your new home',
        completed: false,
        link: '/buyer/prop-choice',
        estimatedTime: '45 minutes'
      },
      {
        id: 'pay-reservation-fee',
        title: 'Pay €500 Reservation Fee',
        description: 'Secure your property choice with online payment',
        completed: false,
        link: '/buyer/payment/reservation',
        required: true,
        estimatedTime: '5 minutes'
      }
    ]
  },
  {
    id: 'booking-deposit',
    title: 'Booking Deposit',
    icon: <CreditCard className="w-5 h-5" />,
    description: 'Confirm your purchase - typically €5,000',
    paymentAmount: 5000,
    paymentStage: 2,
    timeline: '7 days after reservation',
    tasks: [
      {
        id: 'review-property-details',
        title: 'Review Complete Property Details',
        description: 'Final review of unit specifications, PROP Choice selections, and pricing',
        completed: false,
        link: '/buyer/property-review',
        estimatedTime: '20 minutes'
      },
      {
        id: 'solicitor-selection',
        title: 'Choose Your Solicitor',
        description: 'Select from PROP.ie verified solicitors or use your own',
        completed: false,
        link: '/buyer/solicitor-selection',
        required: true,
        estimatedTime: '15 minutes'
      },
      {
        id: 'review-contracts',
        title: 'Review Purchase Contract',
        description: 'Download and review contract with your solicitor',
        completed: false,
        link: '/buyer/contracts',
        estimatedTime: '2-3 days'
      },
      {
        id: 'pay-booking-deposit',
        title: 'Pay Booking Deposit',
        description: 'Pay €5,000 booking deposit to confirm purchase intent',
        completed: false,
        link: '/buyer/payment/booking',
        required: true,
        estimatedTime: '5 minutes'
      }
    ]
  },
  {
    id: 'contract-exchange',
    title: 'Contract Exchange & Deposit',
    icon: <FileText className="w-5 h-5" />,
    description: 'Sign contracts and pay 10% deposit',
    paymentAmount: 'percentage',
    paymentPercentage: 10,
    paymentStage: 3,
    timeline: '28 days after booking deposit',
    tasks: [
      {
        id: 'finalize-htb-application',
        title: 'Complete HTB Application',
        description: 'Submit final HTB application through Revenue myAccount',
        completed: false,
        link: '/buyer/htb/application',
        estimatedTime: '30 minutes'
      },
      {
        id: 'mortgage-formal-application',
        title: 'Submit Formal Mortgage Application',
        description: 'Complete full mortgage application with chosen lender',
        completed: false,
        link: '/buyer/mortgage/application',
        required: true,
        estimatedTime: '1-2 hours'
      },
      {
        id: 'contract-signing',
        title: 'Sign Purchase Contracts',
        description: 'Execute contracts with developer through PROP.ie platform',
        completed: false,
        link: '/buyer/contracts/signing',
        required: true,
        estimatedTime: '1 hour'
      },
      {
        id: 'pay-contractual-deposit',
        title: 'Pay 10% Contractual Deposit',
        description: 'Pay deposit (minus booking deposit already paid)',
        completed: false,
        link: '/buyer/payment/deposit',
        required: true,
        estimatedTime: '10 minutes'
      }
    ]
  },
  {
    id: 'construction-monitoring',
    title: 'Construction Monitoring',
    icon: <Building className="w-5 h-5" />,
    description: 'Track your property being built',
    timeline: '12-24 months construction period',
    isOngoing: true,
    tasks: [
      {
        id: 'construction-commencement',
        title: 'Construction Commencement',
        description: 'Receive notification when construction begins on your unit',
        completed: false,
        link: '/buyer/construction/updates',
        estimatedTime: 'Notification only'
      },
      {
        id: 'milestone-updates',
        title: 'Regular Progress Updates',
        description: 'Monthly construction progress reports with photos and timelines',
        completed: false,
        link: '/buyer/construction/progress',
        isRecurring: true,
        estimatedTime: 'Monthly'
      },
      {
        id: 'prop-choice-installation',
        title: 'PROP Choice Installation',
        description: 'Track installation of your selected finishes and appliances',
        completed: false,
        link: '/buyer/prop-choice/installation',
        estimatedTime: 'Final construction stage'
      },
      {
        id: 'quality-inspections',
        title: 'Quality Inspections',
        description: 'Professional building surveys and quality checks',
        completed: false,
        link: '/buyer/construction/inspections',
        estimatedTime: 'Pre-completion'
      },
      {
        id: 'completion-notice',
        title: 'Completion Notice',
        description: 'Receive formal completion notice and prepare for handover',
        completed: false,
        link: '/buyer/completion/notice',
        estimatedTime: '30 days before handover'
      }
    ]
  },
  {
    id: 'pre-completion',
    title: 'Pre-Completion Preparation',
    icon: <ClipboardCheck className="w-5 h-5" />,
    description: 'Prepare for property handover',
    timeline: '60 days before completion',
    tasks: [
      {
        id: 'mortgage-offer-confirmation',
        title: 'Confirm Final Mortgage Offer',
        description: 'Receive and accept final mortgage offer from lender',
        completed: false,
        link: '/buyer/mortgage/final-offer',
        required: true,
        estimatedTime: '1-2 weeks'
      },
      {
        id: 'property-valuation',
        title: 'Property Valuation',
        description: 'Lender conducts final property valuation',
        completed: false,
        link: '/buyer/valuation/schedule',
        estimatedTime: '1 week'
      },
      {
        id: 'htb-final-approval',
        title: 'HTB Final Approval',
        description: 'Receive final HTB approval and payment schedule',
        completed: false,
        link: '/buyer/htb/final-approval',
        estimatedTime: '2-3 weeks'
      },
      {
        id: 'home-insurance',
        title: 'Arrange Home Insurance',
        description: 'Set up building and contents insurance from completion date',
        completed: false,
        link: '/buyer/insurance',
        required: true,
        estimatedTime: '1 week'
      },
      {
        id: 'professional-fees-payment',
        title: 'Pay Professional Fees',
        description: 'Pay solicitor, surveyor, and other professional fees through PROP.ie',
        completed: false,
        link: '/buyer/professional-fees',
        required: true,
        estimatedTime: '30 minutes'
      }
    ]
  },
  {
    id: 'completion-handover',
    title: 'Completion & Handover',
    icon: <Key className="w-5 h-5" />,
    description: 'Final payment and receive your keys',
    paymentAmount: 'percentage',
    paymentPercentage: 90,
    paymentStage: 4,
    timeline: 'On completion date',
    tasks: [
      {
        id: 'final-inspection-walkthrough',
        title: 'Final Inspection & Walkthrough',
        description: 'Complete detailed snag list with PROP.ie quality team',
        completed: false,
        link: '/buyer/completion/inspection',
        required: true,
        estimatedTime: '2-3 hours'
      },
      {
        id: 'mortgage-funds-drawdown',
        title: 'Mortgage Funds Drawdown',
        description: 'Lender releases funds to complete purchase',
        completed: false,
        link: '/buyer/completion/drawdown',
        estimatedTime: '24 hours'
      },
      {
        id: 'final-balance-payment',
        title: 'Pay Final Balance',
        description: 'Pay remaining ~90% purchase price (mortgage + own funds)',
        completed: false,
        link: '/buyer/payment/final-balance',
        required: true,
        estimatedTime: '1 hour'
      },
      {
        id: 'stamp-duty-payment',
        title: 'Stamp Duty Payment',
        description: 'Pay 1% stamp duty (handled automatically through PROP.ie)',
        completed: false,
        link: '/buyer/stamp-duty',
        estimatedTime: 'Automatic'
      },
      {
        id: 'property-registration',
        title: 'Property Registration',
        description: 'Register ownership with Property Registration Authority',
        completed: false,
        link: '/buyer/registration',
        estimatedTime: '6-8 weeks post-completion'
      },
      {
        id: 'keys-handover',
        title: 'Keys Handover & Move In',
        description: 'Receive keys to your new PROP.ie home!',
        completed: false,
        link: '/buyer/completion/keys',
        estimatedTime: 'Completion day'
      }
    ]
  }
];

// Document requirements for PROP.ie off-plan purchase
const documentRequirements = [
  {
    category: 'Prerequisites (Required for Online Reservation)',
    stage: 'prerequisites',
    documents: [
      { name: 'Government Photo ID (Passport/License)', required: true, uploaded: false },
      { name: 'PPS Number verification', required: true, uploaded: false },
      { name: 'Proof of address (< 3 months)', required: true, uploaded: false },
      { name: 'Employment verification', required: true, uploaded: false },
      { name: 'Mortgage approval in principle', required: true, uploaded: false }
    ]
  },
  {
    category: 'Financial Documentation',
    stage: 'booking-deposit',
    documents: [
      { name: 'P60 forms (last 2 years)', required: true, uploaded: false },
      { name: 'Payslips (last 3 months)', required: true, uploaded: false },
      { name: 'Bank statements (last 6 months)', required: true, uploaded: false },
      { name: 'Savings/deposit source documentation', required: true, uploaded: false }
    ]
  },
  {
    category: 'HTB Application Documents',
    stage: 'contract-exchange',
    documents: [
      { name: 'Revenue myAccount setup', required: true, uploaded: false },
      { name: 'HTB online application', required: true, uploaded: false },
      { name: 'Tax compliance certificate', required: false, uploaded: false }
    ]
  },
  {
    category: 'Contract & Legal Documents',
    stage: 'contract-exchange',
    documents: [
      { name: 'PROP.ie reservation confirmation', required: true, uploaded: false },
      { name: 'Purchase contract (developer)', required: true, uploaded: false },
      { name: 'Solicitor appointment confirmation', required: true, uploaded: false },
      { name: 'Building specifications agreement', required: true, uploaded: false }
    ]
  },
  {
    category: 'Pre-Completion Documents',
    stage: 'pre-completion',
    documents: [
      { name: 'Final mortgage offer letter', required: true, uploaded: false },
      { name: 'Home insurance policy', required: true, uploaded: false },
      { name: 'Professional fees payment receipts', required: true, uploaded: false },
      { name: 'PROP Choice selections confirmation', required: false, uploaded: false }
    ]
  }
];

export default function BuyerJourneyPage() {
  const router = useRouter();
  
  // Safe auth access during build
  let user = null;
  let isVerificationComplete = () => false;
  let verificationProgress = 0;
  
  try {
    const authData = useEnterpriseAuth();
    user = authData.user;
  } catch (e) {
    // Auth provider not available during build
  }
  
  try {
    const verificationData = useVerification();
    isVerificationComplete = verificationData.isVerificationComplete;
    verificationProgress = verificationData.getOverallProgress();
  } catch (e) {
    // Verification hook not available during build
  }

  const [activeStage, setActiveStage] = useState('preparation');
  const [tasksCompleted, setTasksCompleted] = useState<Record<string, boolean>>({});
  const [documentsUploaded, setDocumentsUploaded] = useState<Record<string, boolean>>({});
  
  // Use the journey sync hook for real-time data
  const {
    journeyStage,
    journeyProgress,
    completedTasks,
    nextTasks,
    completionPercentage,
    journeyStatus,
    completeTask
  } = useJourneySync();

  const toggleTaskCompletion = (taskId: string) => {
    setTasksCompleted(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
    
    // Also update via sync hook
    if (!tasksCompleted[taskId]) {
      completeTask(taskId);
    }
  };

  const calculateProgress = () => {
    // Use synced progress if available, otherwise calculate locally
    if (completionPercentage > 0) {
      return completionPercentage;
    }
    
    const totalTasks = journeyStages.reduce((acc, stage) => acc + stage.tasks.length, 0);
    const completedTasksLocal = Object.values(tasksCompleted).filter(Boolean).length;
    return Math.round((completedTasksLocal / totalTasks) * 100);
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
              <h1 className="text-2xl font-bold text-gray-900">PROP.ie Off-Plan Purchase Journey</h1>
              <p className="text-gray-600 mt-1">Your complete guide to buying a new home off-plan through Ireland's leading property platform</p>
              <div className="mt-2 flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-blue-600">
                  <Clock size={16} />
                  Typical timeline: 12-24 months
                </span>
                <span className="flex items-center gap-1 text-green-600">
                  <Shield size={16} />
                  Secure online process
                </span>
                <span className="flex items-center gap-1 text-purple-600">
                  <Info size={16} />
                  PROP Choice customization included
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Overall Progress</p>
              <p className="text-2xl font-bold text-blue-600">{calculateProgress()}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Prerequisites Status Banner */}
      {!isVerificationComplete() && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900">Complete Prerequisites to Buy Off-Plan Online</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    You must complete identity verification, financial documentation, and mortgage pre-approval before you can reserve a property online.
                  </p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-amber-600">
                    <span>✓ Secure online purchase process</span>
                    <span>✓ €500 reservation fee</span>
                    <span>✓ PROP Choice customization</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <button
                  onClick={() => router.push('/buyer/verification')}
                  className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-medium"
                >
                  Start Prerequisites
                </button>
                <p className="text-xs text-amber-600 mt-1">~30 minutes to complete</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-amber-700 mb-2">
                <span>Prerequisites Progress</span>
                <span>{Math.round(verificationProgress)}% complete</span>
              </div>
              <div className="w-full bg-amber-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${verificationProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Off-Plan Purchase Info Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold">€500</div>
              <div className="text-sm text-blue-100">Online Reservation</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">€5,000</div>
              <div className="text-sm text-blue-100">Booking Deposit</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">10%</div>
              <div className="text-sm text-blue-100">Contractual Deposit</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">Balance</div>
              <div className="text-sm text-blue-100">On Completion (~90%)</div>
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
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 relative ${
                    isStageComplete(stage.id) 
                      ? 'bg-green-100' 
                      : activeStage === stage.id
                      ? 'bg-blue-100'
                      : stage.isPrerequisite
                      ? 'bg-amber-100'
                      : 'bg-gray-100'
                  }`}>
                    {isStageComplete(stage.id) ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      stage.icon
                    )}
                    {stage.paymentAmount && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <Euro size={12} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-medium block">{stage.title}</span>
                    {stage.paymentAmount && (
                      <span className="text-xs text-red-600 font-medium">
                        {typeof stage.paymentAmount === 'number' 
                          ? `€${stage.paymentAmount.toLocaleString()}` 
                          : `${stage.paymentPercentage}%`}
                      </span>
                    )}
                    {stage.timeline && (
                      <span className="text-xs text-gray-500 block">{stage.timeline}</span>
                    )}
                  </div>
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
                <div className={`bg-white rounded-lg shadow-md p-6 ${
                  stage.isPrerequisite ? 'border-l-4 border-amber-500' : 
                  stage.paymentAmount ? 'border-l-4 border-red-500' : 
                  stage.isOngoing ? 'border-l-4 border-blue-500' : ''
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
                        stage.isPrerequisite ? 'bg-amber-100' :
                        stage.paymentAmount ? 'bg-red-100' :
                        'bg-blue-100'
                      }`}>
                        {stage.icon}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{stage.title}</h2>
                        <p className="text-gray-600">{stage.description}</p>
                        {stage.timeline && (
                          <p className="text-sm text-gray-500 mt-1">
                            <Clock size={14} className="inline mr-1" />
                            {stage.timeline}
                          </p>
                        )}
                      </div>
                    </div>
                    {stage.paymentAmount && (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-red-600">
                          {typeof stage.paymentAmount === 'number' 
                            ? `€${stage.paymentAmount.toLocaleString()}` 
                            : `${stage.paymentPercentage}%`}
                        </div>
                        <div className="text-sm text-gray-500">Payment Required</div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {stage.tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`border rounded-lg p-4 transition ${
                          tasksCompleted[task.id] 
                            ? 'border-green-300 bg-green-50' 
                            : task.required
                            ? 'border-red-200 bg-red-50 hover:border-red-300'
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
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{task.title}</h3>
                              {task.required && (
                                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                                  Required
                                </span>
                              )}
                              {task.isRecurring && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                  Ongoing
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-4">
                                {task.estimatedTime && (
                                  <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Clock size={12} />
                                    {task.estimatedTime}
                                  </span>
                                )}
                                {task.link && (
                                  <a
                                    href={task.link}
                                    className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                                  >
                                    {task.link.startsWith('http') ? 'External Link' : 'Start Task'}
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                  </a>
                                )}
                              </div>
                            </div>
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
            {/* Stage-Specific Documents */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Documents for Current Stage
              </h3>
              <div className="space-y-4">
                {documentRequirements
                  .filter(category => !category.stage || category.stage === activeStage)
                  .map((category) => (
                  <div key={category.category}>
                    <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                      {category.category}
                      {category.stage === activeStage && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          Current
                        </span>
                      )}
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
              <button 
                onClick={() => router.push('/buyer/documents')}
                className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Manage Documents
              </button>
            </div>

            {/* Professional Services */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Professional Services
              </h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-gray-900">Solicitor Services</h4>
                  <p className="text-sm text-gray-600 mb-2">Contract review, legal advice, and completion handling</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Estimated cost: €1,200-€1,800</span>
                    <Link href="/buyer/solicitor-selection" className="text-blue-600 text-sm font-medium">
                      Select →
                    </Link>
                  </div>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium text-gray-900">Building Survey</h4>
                  <p className="text-sm text-gray-600 mb-2">Professional inspection and snag list preparation</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Estimated cost: €400-€600</span>
                    <Link href="/buyer/surveyor-booking" className="text-green-600 text-sm font-medium">
                      Book →
                    </Link>
                  </div>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-medium text-gray-900">PROP.ie Coordination</h4>
                  <p className="text-sm text-gray-600 mb-2">Payment coordination and professional fee management</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Included in platform</span>
                    <span className="text-green-600 text-sm font-medium">✓ Free</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <Info size={14} className="inline mr-1" />
                  PROP.ie coordinates all professional payments and ensures seamless communication between all parties.
                </p>
              </div>
            </div>

            {/* Payment Calculator */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Payment Schedule Calculator
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <label className="text-sm font-medium text-gray-700">Property Price</label>
                  <input 
                    type="number" 
                    placeholder="€350,000"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Reservation Fee:</span>
                    <span className="font-medium">€500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Booking Deposit:</span>
                    <span className="font-medium">€5,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contract Deposit (10%):</span>
                    <span className="font-medium">€35,000</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span>Balance on Completion:</span>
                    <span className="font-medium">€309,500</span>
                  </div>
                </div>
                
                <Link 
                  href="/buyer/calculator/off-plan"
                  className="w-full mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-center block"
                >
                  Full Payment Calculator
                </Link>
              </div>
            </div>

            {/* PROP.ie Resources */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                PROP.ie Resources
              </h3>
              <div className="space-y-3">
                <Link
                  href="/buyer/htb"
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  HTB Calculator & Application
                </Link>
                <Link
                  href="/buyer/prop-choice"
                  className="flex items-center text-purple-600 hover:text-purple-700"
                >
                  <Home className="w-5 h-5 mr-2" />
                  PROP Choice Customization
                </Link>
                <Link
                  href="/buyer/construction/monitoring"
                  className="flex items-center text-green-600 hover:text-green-700"
                >
                  <Building className="w-5 h-5 mr-2" />
                  Construction Progress
                </Link>
                <Link
                  href="/buyer/guides/off-plan"
                  className="flex items-center text-gray-600 hover:text-gray-700"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Off-Plan Buying Guide
                </Link>
              </div>
            </div>

            {/* Project Timeline */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Off-Plan Timeline
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-900">Reservation Complete</p>
                    <p className="text-sm text-gray-600">March 15, 2025 - €500 paid</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-900">Contract Exchange Due</p>
                    <p className="text-sm text-gray-600">April 30, 2025 - 10% deposit</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-900">Construction Start</p>
                    <p className="text-sm text-gray-600">Q2 2025 - Foundation works begin</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-900">PROP Choice Installation</p>
                    <p className="text-sm text-gray-600">Q4 2025 - Custom finishes installed</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-900">Expected Completion</p>
                    <p className="text-sm text-gray-600">Q1 2026 - Keys handover</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <Clock size={14} className="inline mr-1" />
                  Timeline updates sent monthly via PROP.ie platform
                </p>
              </div>
            </div>

            {/* PROP.ie Support */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2 text-blue-900">
                PROP.ie Expert Support
              </h3>
              <p className="text-sm text-blue-700 mb-4">
                Our dedicated off-plan purchase specialists are here to guide you through every step of your journey
              </p>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-blue-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Live chat support (9am-6pm)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Video consultations available</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Property-specific guidance</span>
                </div>
              </div>
              
              <button 
                onClick={() => router.push('/buyer/support')}
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
              >
                Get Expert Help
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}