'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Building2, 
  Calculator, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Euro, 
  FileText, 
  Shield, 
  Heart,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Home,
  Calendar,
  Users
} from 'lucide-react';

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  beds: number;
  baths: number;
  developer: string;
  htbEligible: boolean;
  image?: string;
}

interface PaymentBreakdown {
  reservationFee: number;
  depositAmount: number;
  htbBenefit: number;
  completionAmount: number;
  totalPrice: number;
  monthlyMortgage: number;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_transfer' | 'sepa_debit';
  last4?: string;
  brand?: string;
  isDefault: boolean;
}

interface PropertyPurchaseFlowProps {
  property: Property;
  onClose: () => void;
  onComplete: (transactionId: string) => void;
}

type Step = 'overview' | 'payment_breakdown' | 'payment_method' | 'confirmation' | 'processing' | 'success';

export function PropertyPurchaseFlow({ property, onClose, onComplete }: PropertyPurchaseFlowProps) {
  const [currentStep, setCurrentStep] = useState<Step>('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentBreakdown, setPaymentBreakdown] = useState<PaymentBreakdown | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [paymentIntent, setPaymentIntent] = useState<any>(null);

  // Mock payment methods
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'pm_1',
      type: 'card',
      last4: '4242',
      brand: 'visa',
      isDefault: true
    },
    {
      id: 'pm_2', 
      type: 'card',
      last4: '1234',
      brand: 'mastercard',
      isDefault: false
    },
    {
      id: 'pm_3',
      type: 'bank_transfer',
      isDefault: false
    }
  ];

  useEffect(() => {
    calculatePaymentBreakdown();
  }, [property]);

  const calculatePaymentBreakdown = () => {
    const breakdown: PaymentBreakdown = {
      reservationFee: Math.min(5000, property.price * 0.01), // 1% or €5k max
      depositAmount: property.price * 0.10, // 10%
      htbBenefit: property.htbEligible ? Math.min(30000, property.price * 0.10) : 0,
      completionAmount: 0,
      totalPrice: property.price,
      monthlyMortgage: 0
    };

    // Calculate completion amount (remaining after deposit and HTB)
    breakdown.completionAmount = breakdown.totalPrice - breakdown.depositAmount - breakdown.htbBenefit;
    
    // Estimate monthly mortgage (simplified calculation)
    const loanAmount = breakdown.completionAmount;
    const interestRate = 0.035; // 3.5% annual
    const years = 30;
    const monthlyRate = interestRate / 12;
    const numPayments = years * 12;
    
    if (loanAmount > 0) {
      breakdown.monthlyMortgage = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                                 (Math.pow(1 + monthlyRate, numPayments) - 1);
    }

    setPaymentBreakdown(breakdown);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleStepChange = (step: Step) => {
    setError(null);
    setCurrentStep(step);
  };

  const createPaymentIntent = async (paymentType: 'reservation' | 'deposit') => {
    try {
      setLoading(true);
      setError(null);

      const amount = paymentType === 'reservation' 
        ? paymentBreakdown!.reservationFee 
        : paymentBreakdown!.depositAmount;

      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          propertyId: property.id,
          amount,
          paymentType,
          metadata: {
            propertyTitle: property.title,
            propertyLocation: property.location,
            developer: property.developer
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment intent');
      }

      setPaymentIntent(data.paymentIntent);
      return data.paymentIntent;
    } catch (err: any) {
      setError(err.message || 'Failed to initialize payment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const confirmPayment = async () => {
    if (!paymentIntent || !selectedPaymentMethod) {
      setError('Please select a payment method');
      return;
    }

    try {
      setLoading(true);
      setCurrentStep('processing');

      const response = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          paymentMethodId: selectedPaymentMethod.id
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Payment failed');
      }

      if (data.paymentIntent.status === 'succeeded') {
        setCurrentStep('success');
        setTimeout(() => {
          onComplete(data.paymentIntent.id);
        }, 3000);
      } else if (data.paymentIntent.status === 'processing') {
        // Handle processing state
        setTimeout(() => {
          setCurrentStep('success');
          onComplete(data.paymentIntent.id);
        }, 5000);
      } else {
        throw new Error('Payment requires additional verification');
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed');
      setCurrentStep('payment_method');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 'overview', title: 'Property Overview', icon: Home },
    { id: 'payment_breakdown', title: 'Payment Breakdown', icon: Calculator },
    { id: 'payment_method', title: 'Payment Method', icon: CreditCard },
    { id: 'confirmation', title: 'Confirmation', icon: CheckCircle },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  if (!paymentBreakdown) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={32} />
          <p>Calculating payment breakdown...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Purchase Property</h2>
              <p className="text-blue-100">{property.title}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Progress Steps */}
          {!['processing', 'success'].includes(currentStep) && (
            <div className="mt-6">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = index === currentStepIndex;
                  const isCompleted = index < currentStepIndex;
                  
                  return (
                    <div key={step.id} className="flex items-center">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        isActive 
                          ? 'bg-white text-blue-600 border-white' 
                          : isCompleted
                          ? 'bg-green-500 text-white border-green-500'
                          : 'border-blue-300 text-blue-300'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle size={20} />
                        ) : (
                          <StepIcon size={20} />
                        )}
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`w-16 h-0.5 mx-2 ${
                          isCompleted ? 'bg-green-500' : 'bg-blue-300'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-2">
                {steps.map((step) => (
                  <span key={step.id} className="text-xs text-blue-100">{step.title}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {/* Step Content */}
          {currentStep === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    {property.htbEligible && (
                      <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        HTB Eligible
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">{property.title}</h3>
                      <p className="text-white/90">{property.location}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">{formatCurrency(property.price)}</div>
                    <p className="text-gray-600">Total Property Price</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-lg font-semibold">{property.beds}</div>
                      <div className="text-sm text-gray-600">Bedrooms</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-lg font-semibold">{property.baths}</div>
                      <div className="text-sm text-gray-600">Bathrooms</div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Developer</h4>
                    <p className="text-blue-800">{property.developer}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'payment_breakdown' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Payment Schedule</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">Reservation Fee</h4>
                          <p className="text-sm text-gray-600">Payable now to secure property</p>
                        </div>
                        <div className="text-xl font-bold text-green-600">
                          {formatCurrency(paymentBreakdown.reservationFee)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">10% Deposit</h4>
                          <p className="text-sm text-gray-600">Due within 7 days</p>
                        </div>
                        <div className="text-xl font-bold text-amber-600">
                          {formatCurrency(paymentBreakdown.depositAmount)}
                        </div>
                      </div>
                    </div>
                    
                    {property.htbEligible && (
                      <div className="bg-white p-4 rounded-lg border border-red-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-red-600 flex items-center gap-2">
                              <Heart size={16} />
                              HTB Benefit
                            </h4>
                            <p className="text-sm text-gray-600">Help-to-Buy scheme reduction</p>
                          </div>
                          <div className="text-xl font-bold text-red-600">
                            -{formatCurrency(paymentBreakdown.htbBenefit)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">Remaining Balance</h4>
                          <p className="text-sm text-gray-600">Due on completion</p>
                        </div>
                        <div className="text-xl font-bold text-blue-600">
                          {formatCurrency(paymentBreakdown.completionAmount)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-600 text-white p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">Estimated Monthly Mortgage</h4>
                          <p className="text-sm text-blue-100">30-year term @ 3.5% APR</p>
                        </div>
                        <div className="text-xl font-bold">
                          {formatCurrency(paymentBreakdown.monthlyMortgage)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'payment_method' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold">Select Payment Method</h3>
              <p className="text-gray-600">
                You are paying the reservation fee of {formatCurrency(paymentBreakdown.reservationFee)}
              </p>
              
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedPaymentMethod?.id === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedPaymentMethod?.id === method.id
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedPaymentMethod?.id === method.id && (
                            <div className="w-full h-full rounded-full bg-white scale-50" />
                          )}
                        </div>
                        
                        <div>
                          {method.type === 'card' ? (
                            <>
                              <div className="font-medium">
                                {method.brand?.toUpperCase()} •••• {method.last4}
                              </div>
                              <div className="text-sm text-gray-600">Credit/Debit Card</div>
                            </>
                          ) : (
                            <>
                              <div className="font-medium">Bank Transfer</div>
                              <div className="text-sm text-gray-600">Direct bank transfer</div>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {method.isDefault && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 'confirmation' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Shield className="text-green-600" size={24} />
                  Confirm Your Payment
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Property Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Property:</span>
                        <span className="font-medium">{property.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Location:</span>
                        <span>{property.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Developer:</span>
                        <span>{property.developer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Price:</span>
                        <span className="font-medium">{formatCurrency(property.price)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Payment Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Payment Type:</span>
                        <span className="font-medium">Reservation Fee</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Amount:</span>
                        <span className="font-medium text-lg">{formatCurrency(paymentBreakdown.reservationFee)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Payment Method:</span>
                        <span>
                          {selectedPaymentMethod?.type === 'card' 
                            ? `${selectedPaymentMethod.brand?.toUpperCase()} •••• ${selectedPaymentMethod.last4}`
                            : 'Bank Transfer'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-white rounded-lg border border-amber-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-amber-600 mt-0.5" size={20} />
                    <div>
                      <h5 className="font-medium text-amber-800">Important Notice</h5>
                      <p className="text-sm text-amber-700 mt-1">
                        By proceeding, you agree to reserve this property and pay the reservation fee. 
                        This fee is non-refundable but will be credited towards your deposit.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'processing' && (
            <div className="text-center py-12">
              <Loader2 className="animate-spin mx-auto mb-6 text-blue-600" size={48} />
              <h3 className="text-xl font-bold mb-2">Processing Your Payment</h3>
              <p className="text-gray-600">Please wait while we process your payment securely...</p>
            </div>
          )}

          {currentStep === 'success' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-6">
                Your reservation for {property.title} has been confirmed.
              </p>
              <div className="bg-green-50 p-4 rounded-lg max-w-md mx-auto">
                <p className="text-sm text-green-700">
                  You will receive a confirmation email with your receipt and next steps.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {!['processing', 'success'].includes(currentStep) && (
          <div className="border-t p-6 bg-gray-50">
            <div className="flex justify-between">
              <button
                onClick={() => {
                  if (currentStep === 'overview') {
                    onClose();
                  } else if (currentStep === 'payment_breakdown') {
                    handleStepChange('overview');
                  } else if (currentStep === 'payment_method') {
                    handleStepChange('payment_breakdown');
                  } else if (currentStep === 'confirmation') {
                    handleStepChange('payment_method');
                  }
                }}
                className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft size={16} />
                {currentStep === 'overview' ? 'Cancel' : 'Back'}
              </button>
              
              <button
                onClick={async () => {
                  if (currentStep === 'overview') {
                    handleStepChange('payment_breakdown');
                  } else if (currentStep === 'payment_breakdown') {
                    handleStepChange('payment_method');
                  } else if (currentStep === 'payment_method') {
                    if (!selectedPaymentMethod) {
                      setError('Please select a payment method');
                      return;
                    }
                    await createPaymentIntent('reservation');
                    handleStepChange('confirmation');
                  } else if (currentStep === 'confirmation') {
                    await confirmPayment();
                  }
                }}
                disabled={loading || (currentStep === 'payment_method' && !selectedPaymentMethod)}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && <Loader2 className="animate-spin" size={16} />}
                {currentStep === 'confirmation' ? 'Pay Now' : 'Continue'}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}