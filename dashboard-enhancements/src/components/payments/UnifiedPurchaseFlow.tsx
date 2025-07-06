/**
 * Unified Purchase Flow Component
 * Harmonizes all purchase/reservation flows across the platform
 * Supports multiple payment types and scenarios with consistent UX
 */

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
  Users,
  Info,
  Banknote,
  HandHeart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/useToast';
import {
  PaymentType,
  PaymentMethod,
  PaymentStatus,
  calculatePaymentBreakdown,
  getPaymentTypeInfo,
  getPaymentMethodInfo,
  validatePaymentAmount,
  formatPaymentAmount,
  type PaymentBreakdown,
  type PaymentCalculationOptions
} from '@/lib/payment-config';

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  developer: string;
  htbEligible: boolean;
  image?: string;
  developmentId?: string;
}

interface PaymentFlowConfig {
  allowedPaymentTypes: PaymentType[];
  defaultPaymentType: PaymentType;
  allowCustomDeposit: boolean;
  requiresAppointment: boolean;
  escrowRequired: boolean;
  journeyIntegration: boolean;
}

interface UnifiedPurchaseFlowProps {
  property: Property;
  config: PaymentFlowConfig;
  onClose: () => void;
  onComplete: (result: PurchaseResult) => void;
  initialData?: Partial<PurchaseFormData>;
  journeyId?: string;
}

interface PurchaseFormData {
  paymentType: PaymentType;
  paymentMethod: PaymentMethod;
  customDepositAmount?: number;
  personalDetails: {
    fullName: string;
    email: string;
    phone: string;
  };
  termsAccepted: boolean;
  appointmentDate?: Date;
  mortgageApprovalInPrinciple: boolean;
}

interface PurchaseResult {
  transactionId: string;
  paymentType: PaymentType;
  amount: number;
  status: PaymentStatus;
  reservationExpiry?: Date;
  reservationId?: string;
  reservationNumber?: string;
}

type FlowStep = 
  | 'payment_type'
  | 'payment_breakdown' 
  | 'personal_details'
  | 'payment_method'
  | 'confirmation'
  | 'processing'
  | 'success';

export function UnifiedPurchaseFlow({
  property,
  config,
  onClose,
  onComplete,
  initialData,
  journeyId
}: UnifiedPurchaseFlowProps) {
  const toast = useToast();
  const [currentStep, setCurrentStep] = useState<FlowStep>('payment_type');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentBreakdown, setPaymentBreakdown] = useState<PaymentBreakdown | null>(null);
  const [completedResult, setCompletedResult] = useState<PurchaseResult | null>(null);
  
  const [formData, setFormData] = useState<PurchaseFormData>({
    paymentType: config.defaultPaymentType,
    paymentMethod: PaymentMethod.CREDIT_CARD,
    personalDetails: {
      fullName: initialData?.personalDetails?.fullName || '',
      email: initialData?.personalDetails?.email || '',
      phone: initialData?.personalDetails?.phone || ''
    },
    termsAccepted: false,
    mortgageApprovalInPrinciple: false,
    ...initialData
  });

  // Calculate payment breakdown when payment type or custom amount changes
  useEffect(() => {
    const calculationOptions: PaymentCalculationOptions = {
      propertyPrice: property.price,
      htbEligible: property.htbEligible,
      customDepositPercentage: formData.customDepositAmount 
        ? formData.customDepositAmount / property.price 
        : undefined
    };

    const breakdown = calculatePaymentBreakdown(calculationOptions);
    setPaymentBreakdown(breakdown);
  }, [property, formData.paymentType, formData.customDepositAmount]);

  const getCurrentPaymentAmount = (): number => {
    if (!paymentBreakdown) return 0;
    
    switch (formData.paymentType) {
      case PaymentType.RESERVATION_FEE:
        return paymentBreakdown.reservationFee;
      case PaymentType.BOOKING_DEPOSIT:
        return formData.customDepositAmount || paymentBreakdown.bookingDeposit;
      case PaymentType.CONTRACTUAL_DEPOSIT:
        return paymentBreakdown.contractualDeposit;
      default:
        return paymentBreakdown.reservationFee;
    }
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 'payment_type':
        return config.allowedPaymentTypes.includes(formData.paymentType);
      
      case 'payment_breakdown':
        const amount = getCurrentPaymentAmount();
        const validation = validatePaymentAmount(formData.paymentType, amount, property.price);
        if (!validation.isValid) {
          setError(validation.error || 'Invalid payment amount');
          return false;
        }
        return true;
      
      case 'personal_details':
        const { fullName, email, phone } = formData.personalDetails;
        return !!(fullName.trim() && email.trim() && phone.trim());
      
      case 'payment_method':
        return !!formData.paymentMethod;
      
      case 'confirmation':
        return formData.termsAccepted;
      
      default:
        return true;
    }
  };

  const nextStep = () => {
    setError(null);
    
    if (!validateCurrentStep()) {
      return;
    }

    const stepOrder: FlowStep[] = [
      'payment_type',
      'payment_breakdown',
      'personal_details',
      'payment_method',
      'confirmation',
      'processing'
    ];

    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    } else if (currentStep === 'confirmation') {
      processPayment();
    }
  };

  const prevStep = () => {
    const stepOrder: FlowStep[] = [
      'payment_type',
      'payment_breakdown', 
      'personal_details',
      'payment_method',
      'confirmation'
    ];

    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const processPayment = async () => {
    setCurrentStep('processing');
    setLoading(true);
    setError(null);

    try {
      const paymentData = {
        propertyId: property.id,
        paymentType: formData.paymentType,
        paymentMethod: formData.paymentMethod,
        amount: getCurrentPaymentAmount(),
        personalDetails: formData.personalDetails,
        journeyId,
        appointmentDate: formData.appointmentDate,
        escrowRequired: config.escrowRequired
      };

      // Create payment intent
      const intentResponse = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });

      if (!intentResponse.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { paymentIntent } = await intentResponse.json();

      // Create reservation record
      let reservationId = null;
      const reservationData = {
        propertyId: property.id,
        unitId: property.id, // Use property ID as unit ID for now
        developmentId: property.developmentId || 'unknown',
        reservationType: formData.paymentType === PaymentType.RESERVATION_FEE ? 'paid_reservation' : 'deposit_booking',
        paymentType: formData.paymentType,
        amount: getCurrentPaymentAmount(),
        buyerDetails: formData.personalDetails,
        appointmentDate: formData.appointmentDate?.toISOString(),
        journeyId,
        paymentIntentId: paymentIntent.id,
        metadata: {
          propertyPrice: property.price,
          htbEligible: property.htbEligible,
          paymentMethod: formData.paymentMethod
        }
      };

      const reservationResponse = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservationData)
      });

      if (reservationResponse.ok) {
        const { reservation } = await reservationResponse.json();
        reservationId = reservation.id;
        console.log(`Created reservation ${reservationId}`);
      } else {
        console.warn('Failed to create reservation, but continuing with payment');
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Confirm payment (including reservation ID)
      const confirmResponse = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          paymentMethodId: formData.paymentMethod,
          reservationId
        })
      });

      if (!confirmResponse.ok) {
        throw new Error('Payment confirmation failed');
      }

      const { transaction, reservation: confirmedReservation } = await confirmResponse.json();

      // Use reservation expiry from confirmed reservation or calculate default
      const reservationExpiry = confirmedReservation?.expiresAt 
        ? new Date(confirmedReservation.expiresAt)
        : (formData.paymentType === PaymentType.RESERVATION_FEE
          ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days
          : undefined);

      const result: PurchaseResult = {
        transactionId: transaction.id,
        paymentType: formData.paymentType,
        amount: getCurrentPaymentAmount(),
        status: PaymentStatus.COMPLETED,
        reservationExpiry,
        reservationId: confirmedReservation?.id,
        reservationNumber: confirmedReservation?.reservationNumber
      };

      setCompletedResult(result);
      setCurrentStep('success');
      
      // Show success toast
      const paymentTypeInfo = getPaymentTypeInfo(formData.paymentType);
      toast({
        title: "Payment Successful",
        description: `${paymentTypeInfo.label} of ${formatPaymentAmount(result.amount)} processed successfully`,
        variant: "success"
      });

      // Complete the flow
      setTimeout(() => {
        onComplete(result);
      }, 5000); // Extended to 5 seconds to let user read reservation details

    } catch (err: any) {
      setError(err.message || 'Payment processing failed');
      setCurrentStep('confirmation');
      toast({
        title: "Payment Failed",
        description: err.message || 'Please try again or contact support',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'payment_type':
        return renderPaymentTypeStep();
      case 'payment_breakdown':
        return renderPaymentBreakdownStep();
      case 'personal_details':
        return renderPersonalDetailsStep();
      case 'payment_method':
        return renderPaymentMethodStep();
      case 'confirmation':
        return renderConfirmationStep();
      case 'processing':
        return renderProcessingStep();
      case 'success':
        return renderSuccessStep();
      default:
        return null;
    }
  };

  const renderPaymentTypeStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Choose Payment Type</h2>
        <p className="text-gray-600 mt-2">Select how you'd like to proceed with this property</p>
      </div>

      <RadioGroup 
        value={formData.paymentType} 
        onValueChange={(value) => setFormData(prev => ({ ...prev, paymentType: value as PaymentType }))}
        className="space-y-4"
      >
        {config.allowedPaymentTypes.map((paymentType) => {
          const info = getPaymentTypeInfo(paymentType);
          return (
            <Card key={paymentType} className="p-4">
              <div className="flex items-start space-x-3">
                <RadioGroupItem value={paymentType} id={paymentType} className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor={paymentType} className="text-base font-semibold cursor-pointer">
                    {info.label}
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">{info.description}</p>
                  {info.maxDuration && (
                    <div className="flex items-center mt-2 text-xs text-blue-600">
                      <Clock className="h-3 w-3 mr-1" />
                      Valid for {info.maxDuration}
                    </div>
                  )}
                  {info.isRefundable && (
                    <div className="flex items-center mt-1 text-xs text-green-600">
                      <Shield className="h-3 w-3 mr-1" />
                      Refundable
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </RadioGroup>
    </div>
  );

  const renderPaymentBreakdownStep = () => {
    if (!paymentBreakdown) return null;

    const currentAmount = getCurrentPaymentAmount();
    const paymentTypeInfo = getPaymentTypeInfo(formData.paymentType);

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Payment Breakdown</h2>
          <p className="text-gray-600 mt-2">Review the payment details for your {paymentTypeInfo.label.toLowerCase()}</p>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Property Price</span>
              <span className="text-lg">{formatPaymentAmount(paymentBreakdown.propertyPrice)}</span>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-blue-600 bg-blue-50 p-3 rounded-lg">
                <span className="font-semibold">{paymentTypeInfo.label}</span>
                <span className="font-bold text-lg">{formatPaymentAmount(currentAmount)}</span>
              </div>
              
              {formData.paymentType === PaymentType.BOOKING_DEPOSIT && config.allowCustomDeposit && (
                <div className="mt-4">
                  <Label htmlFor="customDeposit">Custom Deposit Amount (Optional)</Label>
                  <Input
                    id="customDeposit"
                    type="number"
                    placeholder="Enter custom amount"
                    value={formData.customDepositAmount || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      customDepositAmount: parseInt(e.target.value) || undefined 
                    }))}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended: {formatPaymentAmount(paymentBreakdown.bookingDeposit)} (5%)
                  </p>
                </div>
              )}
            </div>

            {property.htbEligible && (
              <>
                <Separator />
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <HandHeart className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-semibold text-green-800">Help to Buy Eligible</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>HTB Benefit Available</span>
                      <span className="font-semibold">{formatPaymentAmount(paymentBreakdown.htbBenefit)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Your Net Deposit Required</span>
                      <span className="font-semibold">{formatPaymentAmount(paymentBreakdown.netDepositRequired)}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>

        {error && (
          <div className="flex items-center p-4 bg-red-50 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        )}
      </div>
    );
  };

  const renderPersonalDetailsStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Personal Details</h2>
        <p className="text-gray-600 mt-2">We need your details to process the payment</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            value={formData.personalDetails.fullName}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              personalDetails: { ...prev.personalDetails, fullName: e.target.value }
            }))}
            placeholder="Enter your full name"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.personalDetails.email}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              personalDetails: { ...prev.personalDetails, email: e.target.value }
            }))}
            placeholder="Enter your email"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.personalDetails.phone}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              personalDetails: { ...prev.personalDetails, phone: e.target.value }
            }))}
            placeholder="Enter your phone number"
            className="mt-1"
          />
        </div>

        {config.requiresAppointment && (
          <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg">
            <Checkbox
              id="appointment"
              checked={!!formData.appointmentDate}
              onCheckedChange={(checked) => {
                if (checked) {
                  // Set default appointment date to next week
                  const nextWeek = new Date();
                  nextWeek.setDate(nextWeek.getDate() + 7);
                  setFormData(prev => ({ ...prev, appointmentDate: nextWeek }));
                } else {
                  setFormData(prev => ({ ...prev, appointmentDate: undefined }));
                }
              }}
            />
            <Label htmlFor="appointment" className="text-sm">
              Schedule a viewing appointment with our sales team
            </Label>
          </div>
        )}
      </div>
    </div>
  );

  const renderPaymentMethodStep = () => {
    const currentAmount = getCurrentPaymentAmount();
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
          <p className="text-gray-600 mt-2">
            Choose how to pay {formatPaymentAmount(currentAmount)}
          </p>
        </div>

        <RadioGroup 
          value={formData.paymentMethod} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value as PaymentMethod }))}
          className="space-y-4"
        >
          {Object.values(PaymentMethod).map((method) => {
            const info = getPaymentMethodInfo(method);
            const isAvailable = !info.maxAmount || currentAmount <= info.maxAmount;
            
            return (
              <Card key={method} className={`p-4 ${!isAvailable ? 'opacity-50' : ''}`}>
                <div className="flex items-start space-x-3">
                  <RadioGroupItem 
                    value={method} 
                    id={method} 
                    disabled={!isAvailable}
                    className="mt-1" 
                  />
                  <div className="flex-1">
                    <Label htmlFor={method} className="text-base font-semibold cursor-pointer">
                      {info.label}
                    </Label>
                    <div className="text-sm text-gray-600 mt-1 space-y-1">
                      <p>Processing time: {info.processingTime}</p>
                      <p>Fees: {info.fees}</p>
                      {info.maxAmount && (
                        <p className={currentAmount > info.maxAmount ? 'text-red-600' : ''}>
                          Max amount: {formatPaymentAmount(info.maxAmount)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </RadioGroup>

        {config.escrowRequired && (
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center mb-2">
              <Shield className="h-5 w-5 text-yellow-600 mr-2" />
              <span className="font-semibold text-yellow-800">Escrow Protection</span>
            </div>
            <p className="text-sm text-yellow-700">
              Your payment will be held in a secure escrow account until completion milestones are met.
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderConfirmationStep = () => {
    const currentAmount = getCurrentPaymentAmount();
    const paymentTypeInfo = getPaymentTypeInfo(formData.paymentType);
    const paymentMethodInfo = getPaymentMethodInfo(formData.paymentMethod);

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Confirm Payment</h2>
          <p className="text-gray-600 mt-2">Review your details before proceeding</p>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Property Details</h3>
              <p className="text-gray-600">{property.title}</p>
              <p className="text-gray-600">{property.location}</p>
              <p className="font-semibold">{formatPaymentAmount(property.price)}</p>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-lg">Payment Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Payment Type</span>
                  <span>{paymentTypeInfo.label}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount</span>
                  <span className="font-semibold">{formatPaymentAmount(currentAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method</span>
                  <span>{paymentMethodInfo.label}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee</span>
                  <span>{paymentMethodInfo.fees}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-lg">Contact Details</h3>
              <div className="text-sm space-y-1">
                <p>{formData.personalDetails.fullName}</p>
                <p>{formData.personalDetails.email}</p>
                <p>{formData.personalDetails.phone}</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={formData.termsAccepted}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, termsAccepted: !!checked }))}
          />
          <Label htmlFor="terms" className="text-sm leading-5">
            I agree to the <a href="/terms" className="text-blue-600 hover:underline">Terms & Conditions</a> and 
            <a href="/privacy" className="text-blue-600 hover:underline ml-1">Privacy Policy</a>. 
            I understand that this payment is {paymentTypeInfo.isRefundable ? 'refundable' : 'non-refundable'}.
          </Label>
        </div>

        {error && (
          <div className="flex items-center p-4 bg-red-50 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        )}
      </div>
    );
  };

  const renderProcessingStep = () => (
    <div className="text-center space-y-6 py-12">
      <Loader2 className="h-16 w-16 animate-spin mx-auto text-blue-600" />
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Processing Payment</h2>
        <p className="text-gray-600 mt-2">Please wait while we process your payment securely...</p>
      </div>
    </div>
  );

  const renderSuccessStep = () => {
    const currentAmount = getCurrentPaymentAmount();
    const paymentTypeInfo = getPaymentTypeInfo(formData.paymentType);

    return (
      <div className="text-center space-y-6 py-8">
        <CheckCircle className="h-16 w-16 mx-auto text-green-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
          <p className="text-gray-600 mt-2">
            Your {paymentTypeInfo.label.toLowerCase()} of {formatPaymentAmount(currentAmount)} has been processed
          </p>
        </div>

        {/* Reservation Details */}
        {completedResult && (
          <Card className="p-6 text-left max-w-md mx-auto">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-semibold text-lg">Reservation Confirmed</h3>
                {completedResult.reservationNumber && (
                  <p className="text-sm text-gray-600">
                    Reference: <span className="font-mono font-bold">{completedResult.reservationNumber}</span>
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Transaction ID</span>
                  <p className="font-mono text-xs">{completedResult.transactionId}</p>
                </div>
                <div>
                  <span className="text-gray-500">Amount Paid</span>
                  <p className="font-semibold">{formatPaymentAmount(completedResult.amount)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Payment Type</span>
                  <p>{paymentTypeInfo.label}</p>
                </div>
                {completedResult.reservationExpiry && (
                  <div>
                    <span className="text-gray-500">Valid Until</span>
                    <p className="font-semibold">
                      {completedResult.reservationExpiry.toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {formData.appointmentDate && (
                <div className="pt-3 border-t">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                    <span className="text-gray-500">Appointment:</span>
                    <span className="ml-2 font-semibold">
                      {formData.appointmentDate.toLocaleDateString()} at {formData.appointmentDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
        
        {/* Payment Type Specific Messages */}
        {formData.paymentType === PaymentType.RESERVATION_FEE && (
          <div className="bg-blue-50 p-4 rounded-lg max-w-md mx-auto">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
              <div className="text-left">
                <p className="text-sm text-blue-800 font-semibold mb-1">
                  Property Reserved for 14 Days
                </p>
                <p className="text-xs text-blue-700">
                  You have 14 days to complete your purchase. We'll contact you within 24 hours to arrange your viewing and guide you through the next steps.
                </p>
              </div>
            </div>
          </div>
        )}

        {formData.paymentType === PaymentType.BOOKING_DEPOSIT && (
          <div className="bg-green-50 p-4 rounded-lg max-w-md mx-auto">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
              <div className="text-left">
                <p className="text-sm text-green-800 font-semibold mb-1">
                  Booking Confirmed
                </p>
                <p className="text-xs text-green-700">
                  Your booking deposit has secured this property. Our sales team will contact you to arrange contract signing and completion details.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500">
          A confirmation email has been sent to {formData.personalDetails.email}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Property Purchase</h1>
              <p className="text-sm text-gray-600">{property.title}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Payment Type</span>
              <span>Breakdown</span>
              <span>Details</span>
              <span>Method</span>
              <span>Confirm</span>
            </div>
            <div className="mt-2 h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(['payment_type', 'payment_breakdown', 'personal_details', 'payment_method', 'confirmation'].indexOf(currentStep) + 1) * 20}%` 
                }}
              />
            </div>
          </div>

          {/* Step Content */}
          {renderStepContent()}

          {/* Navigation */}
          {!['processing', 'success'].includes(currentStep) && (
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button 
                variant="outline" 
                onClick={prevStep}
                disabled={currentStep === 'payment_type'}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <Button 
                onClick={nextStep}
                disabled={loading || !validateCurrentStep()}
              >
                {currentStep === 'confirmation' ? 'Process Payment' : 'Continue'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UnifiedPurchaseFlow;