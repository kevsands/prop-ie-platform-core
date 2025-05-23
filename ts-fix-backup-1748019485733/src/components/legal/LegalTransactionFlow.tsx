import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircleIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { TermsOfSale } from './TermsOfSale';
import { SolicitorNomination } from './SolicitorNomination';
import { ContractConfirmation } from './ContractConfirmation';
import { useAuth } from '@/hooks/useAuth';

interface LegalTransactionFlowProps {
  unitId: string;
  unitDetails: {
    name: string;
    price: number;
    bookingDeposit: number;
    address: string;
  };
  onComplete: (transactionId: string) => void;
  onCancel: () => void;
}

type FlowStep = 
  | 'BOOKING_INITIATION'
  | 'TERMS_ACCEPTANCE' 
  | 'DEPOSIT_PAYMENT'
  | 'SOLICITOR_NOMINATION'
  | 'CONTRACT_GENERATION'
  | 'CONTRACT_REVIEW'
  | 'ELECTRONIC_SIGNING'
  | 'COMPLETION';

interface StepConfig {
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
}

export const LegalTransactionFlow: React.FC<LegalTransactionFlowProps> = ({
  unitId,
  unitDetails,
  onComplete,
  onCancel
}) => {
  const { user } = useAuth();
  const [currentStepsetCurrentStep] = useState<FlowStep>('BOOKING_INITIATION');
  const [reservationIdsetReservationId] = useState<string>('');
  const [loadingsetLoading] = useState(false);
  const [errorsetError] = useState<string>('');
  const [stepDatasetStepData] = useState<Record<string, any>>({});

  const steps: Record<FlowStep, StepConfig> = {
    BOOKING_INITIATION: {
      title: 'Booking Initiation',
      description: 'Initialize booking process',
      status: currentStep === 'BOOKING_INITIATION' ? 'active' : 'completed'
    },
    TERMS_ACCEPTANCE: {
      title: 'Terms of Sale',
      description: 'Review and accept terms',
      status: getCurrentStepStatus('TERMS_ACCEPTANCE')
    },
    DEPOSIT_PAYMENT: {
      title: 'Deposit Payment',
      description: 'Secure payment processing',
      status: getCurrentStepStatus('DEPOSIT_PAYMENT')
    },
    SOLICITOR_NOMINATION: {
      title: 'Solicitor Nomination',
      description: 'Nominate legal representation',
      status: getCurrentStepStatus('SOLICITOR_NOMINATION')
    },
    CONTRACT_GENERATION: {
      title: 'Contract Generation',
      description: 'Generate legal contract',
      status: getCurrentStepStatus('CONTRACT_GENERATION')
    },
    CONTRACT_REVIEW: {
      title: 'Contract Review',
      description: 'Review contract terms',
      status: getCurrentStepStatus('CONTRACT_REVIEW')
    },
    ELECTRONIC_SIGNING: {
      title: 'Electronic Signing',
      description: 'DocuSign execution',
      status: getCurrentStepStatus('ELECTRONIC_SIGNING')
    },
    COMPLETION: {
      title: 'Completion',
      description: 'Transaction finalized',
      status: getCurrentStepStatus('COMPLETION')
    }
  };

  function getCurrentStepStatus(step: FlowStep): 'pending' | 'active' | 'completed' | 'error' {
    const stepOrder: FlowStep[] = [
      'BOOKING_INITIATION',
      'TERMS_ACCEPTANCE',
      'DEPOSIT_PAYMENT',
      'SOLICITOR_NOMINATION',
      'CONTRACT_GENERATION',
      'CONTRACT_REVIEW',
      'ELECTRONIC_SIGNING',
      'COMPLETION'
    ];

    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(step);

    if (stepIndex <currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  }

  const progressPercentage = (Object.keys(steps).indexOf(currentStep) / (Object.keys(steps).length - 1)) * 100;

  useEffect(() => {
    initiateBooking();
  }, []);

  const initiateBooking = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/booking/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitId,
          buyerId: user?.id
        })
      });

      const data = await response.json();
      if (data.success) {
        setReservationId(data.reservationId);
        setCurrentStep('TERMS_ACCEPTANCE');
      } else {
        setError(data.error || 'Failed to initiate booking');
      }
    } catch (err) {
      setError('Network error during booking initiation');
    } finally {
      setLoading(false);
    }
  };

  const handleTermsAccept = () => {
    setStepData(prev => ({ ...prev, termsAccepted: true }));
    setCurrentStep('DEPOSIT_PAYMENT');
  };

  const handleDepositPayment = async () => {
    try {
      setLoading(true);
      // Integrate with existing Stripe payment system
      const paymentResponse = await processDepositPayment();

      if (paymentResponse.success) {
        setStepData(prev => ({ ...prev, paymentConfirmed: true }));
        setCurrentStep('SOLICITOR_NOMINATION');
      } else {
        setError('Payment processing failed');
      }
    } catch (err) {
      setError('Payment error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSolicitorNomination = async (solicitorDetails: any) => {
    try {
      setLoading(true);
      const response = await fetch('/api/buyer/solicitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservationId,
          solicitorDetails
        })
      });

      const data = await response.json();
      if (data.success) {
        setStepData(prev => ({ ...prev, solicitor: solicitorDetails }));
        setCurrentStep('CONTRACT_GENERATION');
        generateContract();
      } else {
        setError(data.error || 'Failed to nominate solicitor');
      }
    } catch (err) {
      setError('Error nominating solicitor');
    } finally {
      setLoading(false);
    }
  };

  const generateContract = async () => {
    try {
      const response = await fetch('/api/contracts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId })
      });

      const data = await response.json();
      if (data.success) {
        setStepData(prev => ({ ...prev, contractUrl: data.contractUrl }));
        setCurrentStep('CONTRACT_REVIEW');
      } else {
        setError(data.error || 'Failed to generate contract');
      }
    } catch (err) {
      setError('Contract generation error');
    }
  };

  const handleContractConfirm = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/contracts/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservationId,
          contractConfirmed: true
        })
      });

      const data = await response.json();
      if (data.success) {
        // Redirect to DocuSign
        window.location.href = data.docuSignUrl;
      } else {
        setError(data.error || 'Failed to initiate signing');
      }
    } catch (err) {
      setError('Signing initiation error');
    } finally {
      setLoading(false);
    }
  };

  const processDepositPayment = async () => {
    // Mock payment processing - integrate with your existing Stripe implementation
    return new Promise<{ success: boolean }>((resolve) => {
      setTimeout(() => resolve({ success: true }), 2000);
    });
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'TERMS_ACCEPTANCE':
        return (
          <TermsOfSale
            bookingDepositAmount={unitDetails.bookingDeposit}
            onAccept={handleTermsAccept}
            onDecline={onCancel}
          />
        );

      case 'DEPOSIT_PAYMENT':
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Secure Deposit Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-lg">Booking Deposit: €{unitDetails.bookingDeposit.toLocaleString()}</p>
                <p className="text-sm text-gray-600">
                  Your deposit will be held securely in an escrow account until contract execution.
                </p>
                <button
                  onClick={handleDepositPayment}
                  disabled={loading}
                  className="px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Processing Payment...' : 'Pay Deposit Securely'}
                </button>
              </div>
            </CardContent>
          </Card>
        );

      case 'SOLICITOR_NOMINATION':
        return (
          <SolicitorNomination
            onSubmit={handleSolicitorNomination}
            onSkip={() => setCurrentStep('CONTRACT_GENERATION')}
            loading={loading}
          />
        );

      case 'CONTRACT_REVIEW':
        return (
          <ContractConfirmation
            onConfirm={handleContractConfirm}
            onCancel={onCancel}
            loading={loading}
          />
        );

      default:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
              <p>Processing {steps[currentStep].title}...</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Legal Transaction Process</h1>
          <p className="text-gray-600">{unitDetails.name} - {unitDetails.address}</p>
          <p className="text-lg font-semibold text-blue-600">€{unitDetails.price.toLocaleString()}</p>
        </div>

        {/* Progress Indicator */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Transaction Progress</CardTitle>
              <span className="text-lg font-semibold">{Math.round(progressPercentage)}%</span>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progressPercentage} className="h-3 mb-6" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.entries(steps).map(([keystep]) => (
                <div key={key} className="text-center">
                  <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                    step.status === 'completed' ? 'bg-green-600 text-white' :
                    step.status === 'active' ? 'bg-blue-600 text-white' :
                    step.status === 'error' ? 'bg-red-600 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {step.status === 'completed' && <CheckCircleIcon className="h-5 w-5" />}
                    {step.status === 'active' && <ClockIcon className="h-5 w-5" />}
                    {step.status === 'error' && <ExclamationTriangleIcon className="h-5 w-5" />}
                    {step.status === 'pending' && <span className="text-xs">{Object.keys(steps).indexOf(key) + 1}</span>}
                  </div>
                  <p className="text-xs font-medium">{step.title}</p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Current Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={ opacity: 0, y: 20 }
            animate={ opacity: 1, y: 0 }
            exit={ opacity: 0, y: -20 }
            transition={ duration: 0.3 }
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>

        {/* Legal Compliance Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>This transaction is compliant with:</p>
          <p>Irish Electronic Commerce Act 2000 • eIDAS Regulation (EU) 910/2014 • Irish Property Law</p>
          <p>All deposits held in regulated solicitor client accounts</p>
        </div>
      </div>
    </div>
  );
};