import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  FileText, 
  Euro, 
  Home,
  AlertCircle,
  ChevronRight
} from 'lucide-react';

interface JourneyStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending' | 'locked';
  icon: React.ReactNode;
  action?: string;
  actionLabel?: string;
}

export default function EnhancedBuyerDashboard() {
  const router = useRouter();
  
  // In real app, this would come from context/API
  const journeySteps: JourneyStep[] = [
    {
      id: 'registration',
      title: 'Account Registration',
      description: 'Create your account and verify email',
      status: 'completed',
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
    {
      id: 'kyc',
      title: 'Identity Verification',
      description: 'Upload ID and proof of address',
      status: 'completed',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      id: 'financial',
      title: 'Financial Verification',
      description: 'Proof of funds and mortgage pre-approval',
      status: 'current',
      icon: <Euro className="w-5 h-5" />,
      action: '/buyer/financial-verification',
      actionLabel: 'Upload Documents',
    },
    {
      id: 'property-selection',
      title: 'Property Selection',
      description: 'Browse and reserve your property',
      status: 'pending',
      icon: <Home className="w-5 h-5" />,
      action: '/properties',
      actionLabel: 'Browse Properties',
    },
    {
      id: 'legal-agreement',
      title: 'Legal Agreement',
      description: 'Review and sign purchase agreement',
      status: 'locked',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      id: 'deposit',
      title: 'Reservation Deposit',
      description: 'Pay non-refundable deposit',
      status: 'locked',
      icon: <Euro className="w-5 h-5" />,
    },
    {
      id: 'customization',
      title: 'Home Customization',
      description: 'Choose finishes and upgrades',
      status: 'locked',
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: 'closing',
      title: 'Closing Process',
      description: 'Final contracts and key handover',
      status: 'locked',
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
  ];

  const getStepIcon = (step: JourneyStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle2 className="w-8 h-8 text-green-600" />;
      case 'current':
        return <Clock className="w-8 h-8 text-blue-600 animate-pulse" />;
      case 'pending':
        return <Circle className="w-8 h-8 text-gray-400" />;
      case 'locked':
        return <Circle className="w-8 h-8 text-gray-300" />;
      default:
        return <Circle className="w-8 h-8 text-gray-300" />;
    }
  };

  const currentStep = journeySteps.find(s => s.status === 'current');
  const completedSteps = journeySteps.filter(s => s.status === 'completed').length;
  const progress = (completedSteps / journeySteps.length) * 100;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Property Journey</h1>
        <p className="text-gray-600">Track your progress towards homeownership</p>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Overall Progress</h2>
            <p className="text-gray-600">
              {completedSteps} of {journeySteps.length} steps completed
            </p>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(progress)}%
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current Action Required */}
      {currentStep && currentStep.action && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Action Required: {currentStep.title}
              </h3>
              <p className="text-blue-700 mb-4">{currentStep.description}</p>
              <button
                onClick={() => router.push(currentStep.action!)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                {currentStep.actionLabel}
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Journey Steps */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Complete Journey</h2>
        <div className="space-y-6">
          {journeySteps.map((step, index) => (
            <div key={step.id} className="flex items-start">
              <div className="flex items-center">
                <div className="relative">
                  {getStepIcon(step)}
                  {index < journeySteps.length - 1 && (
                    <div 
                      className={`absolute top-10 left-4 w-0.5 h-16 -mb-8 ${
                        step.status === 'completed' ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              </div>
              <div className="ml-6 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-lg font-medium ${
                      step.status === 'completed' ? 'text-gray-900' : 
                      step.status === 'current' ? 'text-blue-900' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </h3>
                    <p className={`text-sm ${
                      step.status === 'locked' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                  {step.status === 'current' && step.action && (
                    <button
                      onClick={() => router.push(step.action!)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      {step.actionLabel}
                    </button>
                  )}
                  {step.status === 'pending' && step.action && (
                    <button
                      onClick={() => router.push(step.action!)}
                      className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      {step.actionLabel}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Important Information */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start">
          <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">
              Important Information
            </h3>
            <ul className="text-sm text-yellow-800 space-y-2">
              <li>• All deposits are non-refundable once paid</li>
              <li>• Documents must be verified before proceeding to next steps</li>
              <li>• Property reservations are legally binding</li>
              <li>• Each step must be completed in sequence</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}