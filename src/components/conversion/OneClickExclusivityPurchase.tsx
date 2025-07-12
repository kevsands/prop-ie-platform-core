/**
 * One-Click Exclusivity Purchase Component
 * Streamlined legal exclusivity purchase flow to maximize conversions
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  CreditCard, 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Euro,
  FileText,
  User,
  Phone,
  Mail,
  ArrowRight,
  Loader2,
  Zap,
  Award,
  Calculator,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export interface ExclusivityPurchaseData {
  propertyId: string;
  propertyName: string;
  propertyPrice: number;
  exclusivityFee: number;
  exclusivityPeriod: number; // days
  developmentName: string;
  unitNumber: string;
  bedrooms: number;
  bathrooms: number;
  htbEligible: boolean;
  htbBenefit?: number;
}

export interface PurchaserDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isFirstTimeBuyer: boolean;
  hasPreApproval: boolean;
}

interface OneClickExclusivityPurchaseProps {
  purchaseData: ExclusivityPurchaseData;
  onComplete: (transactionId: string, purchaserDetails: PurchaserDetails) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export const OneClickExclusivityPurchase: React.FC<OneClickExclusivityPurchaseProps> = ({
  purchaseData,
  onComplete,
  onCancel,
  isOpen
}) => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaserDetails, setPurchaserDetails] = useState<PurchaserDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    isFirstTimeBuyer: false,
    hasPreApproval: false
  });
  
  const [agreements, setAgreements] = useState({
    terms: false,
    exclusivity: false,
    nonRefundable: false,
    escrow: false
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes

  // Countdown timer for urgency
  useEffect(() => {
    if (!isOpen) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isStep1Valid = () => {
    return purchaserDetails.firstName && 
           purchaserDetails.lastName && 
           purchaserDetails.email && 
           purchaserDetails.phone;
  };

  const isStep2Valid = () => {
    return agreements.terms && 
           agreements.exclusivity && 
           agreements.nonRefundable && 
           agreements.escrow;
  };

  const handlePurchase = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate transaction ID
      const transactionId = `EX-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      onComplete(transactionId, purchaserDetails);
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateSavings = () => {
    const htbSavings = purchaseData.htbEligible ? (purchaseData.htbBenefit || 30000) : 0;
    const exclusivityValue = purchaseData.exclusivityFee; // Goes toward deposit
    return htbSavings + exclusivityValue;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header with Timer */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Secure Legal Exclusivity</h2>
              <p className="text-blue-100">
                {purchaseData.propertyName} - Unit {purchaseData.unitNumber}
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-mono font-bold">
                {formatTime(timeLeft)}
              </div>
              <p className="text-xs text-blue-200">Time Remaining</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <Progress value={(step / 3) * 100} className="h-2 bg-blue-400" />
            <div className="flex justify-between text-xs mt-1 text-blue-200">
              <span>Details</span>
              <span>Legal Agreement</span>
              <span>Payment</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Purchaser Details */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <Lock className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-xl font-semibold">Secure Your Exclusive Rights</h3>
                <p className="text-gray-600">
                  Get {purchaseData.exclusivityPeriod} days of legal exclusivity for just €{purchaseData.exclusivityFee.toLocaleString()}
                </p>
              </div>

              {/* Property Summary */}
              <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <div className="flex items-center space-x-4">
                  <Home className="h-8 w-8 text-green-600" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-800">
                      {purchaseData.bedrooms} bed, {purchaseData.bathrooms} bath
                    </h4>
                    <p className="text-green-600">
                      €{purchaseData.propertyPrice.toLocaleString()}
                    </p>
                  </div>
                  {purchaseData.htbEligible && (
                    <Badge className="bg-green-600 text-white">
                      HTB Eligible
                    </Badge>
                  )}
                </div>
              </Card>

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={purchaserDetails.firstName}
                    onChange={(e) => setPurchaserDetails(prev => ({
                      ...prev,
                      firstName: e.target.value
                    }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={purchaserDetails.lastName}
                    onChange={(e) => setPurchaserDetails(prev => ({
                      ...prev,
                      lastName: e.target.value
                    }))}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={purchaserDetails.email}
                  onChange={(e) => setPurchaserDetails(prev => ({
                    ...prev,
                    email: e.target.value
                  }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={purchaserDetails.phone}
                  onChange={(e) => setPurchaserDetails(prev => ({
                    ...prev,
                    phone: e.target.value
                  }))}
                  className="mt-1"
                />
              </div>

              {/* Quick Questions */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="firstTimeBuyer"
                    checked={purchaserDetails.isFirstTimeBuyer}
                    onCheckedChange={(checked) => setPurchaserDetails(prev => ({
                      ...prev,
                      isFirstTimeBuyer: checked as boolean
                    }))}
                  />
                  <Label htmlFor="firstTimeBuyer" className="text-sm">
                    I am a first-time buyer
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasPreApproval"
                    checked={purchaserDetails.hasPreApproval}
                    onCheckedChange={(checked) => setPurchaserDetails(prev => ({
                      ...prev,
                      hasPreApproval: checked as boolean
                    }))}
                  />
                  <Label htmlFor="hasPreApproval" className="text-sm">
                    I have mortgage pre-approval
                  </Label>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Legal Agreements */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <FileText className="h-12 w-12 text-orange-600 mx-auto mb-3" />
                <h3 className="text-xl font-semibold">Legal Exclusivity Agreement</h3>
                <p className="text-gray-600">
                  Review and accept the terms for your exclusive purchase rights
                </p>
              </div>

              {/* Agreement Items */}
              <div className="space-y-4">
                <Card className="p-4 border-orange-200 bg-orange-50">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={agreements.terms}
                      onCheckedChange={(checked) => setAgreements(prev => ({
                        ...prev,
                        terms: checked as boolean
                      }))}
                    />
                    <div>
                      <Label htmlFor="terms" className="font-medium text-orange-800">
                        Terms & Conditions
                      </Label>
                      <p className="text-sm text-orange-700 mt-1">
                        I agree to the standard property purchase terms and conditions
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 border-red-200 bg-red-50">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="exclusivity"
                      checked={agreements.exclusivity}
                      onCheckedChange={(checked) => setAgreements(prev => ({
                        ...prev,
                        exclusivity: checked as boolean
                      }))}
                    />
                    <div>
                      <Label htmlFor="exclusivity" className="font-medium text-red-800">
                        Exclusivity Period
                      </Label>
                      <p className="text-sm text-red-700 mt-1">
                        I understand this gives me {purchaseData.exclusivityPeriod} days of exclusive rights to purchase this property
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 border-purple-200 bg-purple-50">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="nonRefundable"
                      checked={agreements.nonRefundable}
                      onCheckedChange={(checked) => setAgreements(prev => ({
                        ...prev,
                        nonRefundable: checked as boolean
                      }))}
                    />
                    <div>
                      <Label htmlFor="nonRefundable" className="font-medium text-purple-800">
                        Non-Refundable Fee
                      </Label>
                      <p className="text-sm text-purple-700 mt-1">
                        The €{purchaseData.exclusivityFee.toLocaleString()} fee applies toward my deposit but is non-refundable
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 border-green-200 bg-green-50">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="escrow"
                      checked={agreements.escrow}
                      onCheckedChange={(checked) => setAgreements(prev => ({
                        ...prev,
                        escrow: checked as boolean
                      }))}
                    />
                    <div>
                      <Label htmlFor="escrow" className="font-medium text-green-800">
                        Escrow Protection
                      </Label>
                      <p className="text-sm text-green-700 mt-1">
                        All payments are held in secure escrow until transaction completion
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Savings Calculator */}
              <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <div className="flex items-center space-x-3">
                  <Calculator className="h-6 w-6 text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-blue-800">Your Potential Savings</h4>
                    <p className="text-2xl font-bold text-blue-600">
                      €{calculateSavings().toLocaleString()}
                    </p>
                    <p className="text-sm text-blue-700">
                      HTB benefit + exclusivity fee toward deposit
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <CreditCard className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-xl font-semibold">Secure Payment</h3>
                <p className="text-gray-600">
                  Complete your exclusivity purchase
                </p>
              </div>

              {/* Payment Summary */}
              <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-green-800">Exclusivity Fee</span>
                    <span className="text-2xl font-bold text-green-600">
                      €{purchaseData.exclusivityFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-green-700">
                    ✓ {purchaseData.exclusivityPeriod} days exclusive rights<br/>
                    ✓ Applies toward your deposit<br/>
                    ✓ Escrow protected<br/>
                    ✓ Legal binding agreement
                  </div>
                </div>
              </Card>

              {isProcessing && (
                <Card className="p-6 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-blue-600" />
                  <p className="text-lg font-semibold">Processing your purchase...</p>
                  <p className="text-sm text-gray-600">
                    Securing your exclusive rights to this property
                  </p>
                </Card>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
              Cancel
            </Button>
            
            <div className="flex space-x-3">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  disabled={isProcessing}
                >
                  Back
                </Button>
              )}
              
              {step < 3 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={step === 1 && !isStep1Valid() || step === 2 && !isStep2Valid()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handlePurchase}
                  disabled={isProcessing}
                  className="bg-green-600 hover:bg-green-700 text-white px-8"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Secure Exclusivity - €{purchaseData.exclusivityFee.toLocaleString()}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OneClickExclusivityPurchase;