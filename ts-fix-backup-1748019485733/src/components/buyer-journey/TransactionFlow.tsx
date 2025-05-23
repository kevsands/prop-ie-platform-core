'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  CreditCard, 
  FileText, 
  Home, 
  Key, 
  ClipboardCheck,
  AlertCircle,
  Calendar,
  User,
  Shield
} from 'lucide-react';
import { TransactionState } from '@/lib/transaction-engine';

interface TransactionFlowProps {
  transactionId: string;
}

const TRANSACTION_STEPS = [
  {
    state: TransactionState.INITIATED,
    label: 'Journey Started',
    icon: Home,
    description: 'Your property purchase journey has begun'
  },
  {
    state: TransactionState.KYC_PENDING,
    label: 'Identity Verification',
    icon: User,
    description: 'Complete KYC/AML verification'
  },
  {
    state: TransactionState.BOOKING_DEPOSIT_PENDING,
    label: 'Booking Deposit',
    icon: CreditCard,
    description: 'Pay booking deposit to reserve property'
  },
  {
    state: TransactionState.HTB_APPLICATION_SUBMITTED,
    label: 'Help to Buy',
    icon: Shield,
    description: 'HTB application processing'
  },
  {
    state: TransactionState.PROPERTY_SELECTED,
    label: 'Property Selection',
    icon: Home,
    description: 'Choose your unit and customizations'
  },
  {
    state: TransactionState.CONTRACTUAL_DEPOSIT_PENDING,
    label: 'Contractual Deposit',
    icon: CreditCard,
    description: 'Pay 10% contractual deposit'
  },
  {
    state: TransactionState.CONTRACTS_ISSUED,
    label: 'Contract Review',
    icon: FileText,
    description: 'Review and sign purchase contracts'
  },
  {
    state: TransactionState.CONSTRUCTION_IN_PROGRESS,
    label: 'Construction',
    icon: Home,
    description: 'Property under construction'
  },
  {
    state: TransactionState.SNAGGING_SCHEDULED,
    label: 'Snagging Inspection',
    icon: ClipboardCheck,
    description: 'Property inspection and defect identification'
  },
  {
    state: TransactionState.MORTGAGE_DRAWDOWN_PENDING,
    label: 'Mortgage Drawdown',
    icon: CreditCard,
    description: 'Final financing in progress'
  },
  {
    state: TransactionState.HANDOVER_SCHEDULED,
    label: 'Property Handover',
    icon: Key,
    description: 'Collect keys and complete handover'
  },
  {
    state: TransactionState.TRANSACTION_COMPLETE,
    label: 'Complete',
    icon: CheckCircle,
    description: 'Welcome to your new home!'
  }
];

export function TransactionFlow({ transactionId }: TransactionFlowProps) {
  const [transactionsetTransaction] = useState<any>(null);
  const [loadingsetLoading] = useState(true);
  const [currentStepIndexsetCurrentStepIndex] = useState(0);

  useEffect(() => {
    fetchTransaction();
  }, [transactionId]);

  const fetchTransaction = async () => {
    try {
      const response = await fetch(`/api/v1/transactions/${transactionId}`);
      const data = await response.json();
      setTransaction(data.transaction);

      // Find current step
      const stepIndex = TRANSACTION_STEPS.findIndex(
        step => step.state === data.transaction.state
      );
      setCurrentStepIndex(stepIndex>= 0 ? stepIndex : 0);
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex <currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    return 'pending';
  };

  const getProgress = () => {
    return ((currentStepIndex + 1) / TRANSACTION_STEPS.length) * 100;
  };

  if (loading) {
    return <div>Loading transaction...</div>\n  );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Transaction Progress</CardTitle>
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-600">
              Step {currentStepIndex + 1} of {TRANSACTION_STEPS.length}
            </span>
            <span className="text-sm font-medium">
              {Math.round(getProgress())}% Complete
            </span>
          </div>
          <Progress value={getProgress()} className="mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {TRANSACTION_STEPS.map((stepindex) => {
              const status = getStepStatus(index);
              const Icon = step.icon;

              return (
                <div
                  key={step.state}
                  className={`flex items-start space-x-4 ${
                    status === 'pending' ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex-shrink-0">
                    {status === 'completed' ? (
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    ) : status === 'current' ? (
                      <div className="relative">
                        <Icon className="h-8 w-8 text-blue-600" />
                        <div className="absolute -inset-1 rounded-full bg-blue-600 opacity-25 animate-pulse" />
                      </div>
                    ) : (
                      <Circle className="h-8 w-8 text-gray-300" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-semibold ${
                        status === 'current' ? 'text-blue-600' : ''
                      }`}>
                        {step.label}
                      </h3>
                      {status === 'current' && (
                        <Badge variant="default">Current Step</Badge>
                      )}
                      {status === 'completed' && (
                        <Badge variant="secondary">Completed</Badge>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mt-1">
                      {step.description}
                    </p>

                    {status === 'current' && (
                      <div className="mt-3 space-y-2">
                        {/* Action buttons based on current state */}
                        {step.state === TransactionState.KYC_PENDING && (
                          <Button variant="default" size="sm">
                            Start Verification
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        )}

                        {step.state === TransactionState.BOOKING_DEPOSIT_PENDING && (
                          <Button variant="default" size="sm">
                            Pay Booking Deposit
                            <CreditCard className="ml-2 h-4 w-4" />
                          </Button>
                        )}

                        {step.state === TransactionState.PROPERTY_SELECTED && (
                          <Button variant="default" size="sm">
                            Select Property
                            <Home className="ml-2 h-4 w-4" />
                          </Button>
                        )}

                        {step.state === TransactionState.CONTRACTS_ISSUED && (
                          <Button variant="default" size="sm">
                            Review & Sign
                            <FileText className="ml-2 h-4 w-4" />
                          </Button>
                        )}

                        {step.state === TransactionState.SNAGGING_SCHEDULED && (
                          <Button variant="default" size="sm">
                            Schedule Inspection
                            <Calendar className="ml-2 h-4 w-4" />
                          </Button>
                        )}

                        {step.state === TransactionState.HANDOVER_SCHEDULED && (
                          <Button variant="default" size="sm">
                            Schedule Handover
                            <Key className="ml-2 h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  {index <TRANSACTION_STEPS.length - 1 && (
                    <div className="absolute left-4 top-12 w-px h-12 bg-gray-200" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Timeline Events */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transaction?.timeline?.slice(05).map((event: any, index: number) => (
              <div key={event.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-2 w-2 rounded-full bg-gray-400 mt-1.5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{event.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(event.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Next Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transaction?.state === TransactionState.KYC_PENDING && (
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Complete Identity Verification</p>
                    <p className="text-sm text-gray-600">Required to proceed with purchase</p>
                  </div>
                </div>
                <Button variant="default" size="sm">
                  Start Now
                </Button>
              </div>
            )}

            {transaction?.state === TransactionState.BOOKING_DEPOSIT_PENDING && (
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Pay Booking Deposit</p>
                    <p className="text-sm text-gray-600">€5,000 to reserve your property</p>
                  </div>
                </div>
                <Button variant="default" size="sm">
                  Pay Now
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}