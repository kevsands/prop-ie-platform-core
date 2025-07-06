'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  FileText,
  Target,
  Lock,
  CreditCard,
  Building2,
  Eye,
  ArrowRight,
  Info
} from 'lucide-react';
import { FundSource, EscrowAccount, EscrowStatus } from '@/services/EscrowService';

interface EscrowPaymentIntegrationProps {
  propertyId: string;
  transactionId: string;
  amount: number;
  paymentType: 'booking_deposit' | 'contractual_deposit' | 'stage_payment' | 'completion_payment';
  onPaymentSuccess?: (escrowId: string, fundId: string) => void;
  onPaymentError?: (error: string) => void;
  className?: string;
}

interface EscrowSetupData {
  escrowId?: string;
  account?: EscrowAccount;
  requiresNewEscrow: boolean;
  suggestedConditions: string[];
  estimatedReleaseTime: string;
}

export function EscrowPaymentIntegration({
  propertyId,
  transactionId,
  amount,
  paymentType,
  onPaymentSuccess,
  onPaymentError,
  className = ''
}: EscrowPaymentIntegrationProps) {
  const [escrowData, setEscrowData] = useState<EscrowSetupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    checkEscrowRequirements();
  }, [propertyId, transactionId, paymentType]);

  const checkEscrowRequirements = async () => {
    try {
      setLoading(true);

      // Check if there's an existing escrow account for this transaction
      const response = await fetch(`/api/escrow?transaction_id=${transactionId}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        const existingAccount = data.accounts?.[0]?.account;

        if (existingAccount) {
          setEscrowData({
            escrowId: existingAccount.id,
            account: existingAccount,
            requiresNewEscrow: false,
            suggestedConditions: [
              'Contract execution verified',
              'Title verification completed',
              'Legal approval obtained'
            ],
            estimatedReleaseTime: getEstimatedReleaseTime(paymentType)
          });
        } else {
          setEscrowData({
            requiresNewEscrow: true,
            suggestedConditions: getDefaultConditions(paymentType),
            estimatedReleaseTime: getEstimatedReleaseTime(paymentType)
          });
        }
      } else {
        throw new Error('Failed to check escrow requirements');
      }
    } catch (error: any) {
      console.error('Error checking escrow requirements:', error);
      onPaymentError?.(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultConditions = (type: string): string[] => {
    switch (type) {
      case 'booking_deposit':
        return [
          'Property reservation confirmed',
          'Terms and conditions accepted',
          'Cooling-off period expired'
        ];
      case 'contractual_deposit':
        return [
          'Contract execution completed',
          'Title verification passed',
          'Legal approval obtained',
          'Mortgage approval confirmed'
        ];
      case 'stage_payment':
        return [
          'Construction milestone completed',
          'Quality inspection passed',
          'Compliance certificates obtained'
        ];
      case 'completion_payment':
        return [
          'Property completion verified',
          'Final inspection passed',
          'All legal requirements met',
          'Keys ready for handover'
        ];
      default:
        return ['Payment conditions verified'];
    }
  };

  const getEstimatedReleaseTime = (type: string): string => {
    switch (type) {
      case 'booking_deposit':
        return '7-14 days';
      case 'contractual_deposit':
        return '30-45 days';
      case 'stage_payment':
        return '14-21 days';
      case 'completion_payment':
        return '1-3 days';
      default:
        return '7-14 days';
    }
  };

  const getFundSource = (type: string): FundSource => {
    switch (type) {
      case 'booking_deposit':
        return FundSource.BUYER_DEPOSIT;
      case 'contractual_deposit':
        return FundSource.CONTRACTUAL_DEPOSIT;
      case 'stage_payment':
        return FundSource.STAGE_PAYMENT;
      case 'completion_payment':
        return FundSource.COMPLETION_PAYMENT;
      default:
        return FundSource.BUYER_DEPOSIT;
    }
  };

  const handlePaymentWithEscrow = async () => {
    if (!agreedToTerms) {
      alert('Please agree to the escrow terms and conditions');
      return;
    }

    try {
      setProcessing(true);

      let escrowId = escrowData?.escrowId;

      // Create new escrow account if needed
      if (escrowData?.requiresNewEscrow) {
        const createEscrowResponse = await fetch('/api/escrow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            transactionId,
            propertyId,
            propertyPrice: amount * 10, // Assume payment is 10% of property price
            participants: [
              {
                type: 'buyer',
                name: 'Property Buyer', // In real app, get from user data
                email: 'buyer@example.com',
                role: 'depositor',
                permissions: ['view_balance', 'deposit_funds'],
                signatureRequired: true
              },
              {
                type: 'developer',
                name: 'Property Developer',
                email: 'developer@example.com',
                role: 'beneficiary',
                permissions: ['view_balance', 'request_release'],
                signatureRequired: true
              },
              {
                type: 'solicitor',
                name: 'Transaction Solicitor',
                email: 'solicitor@example.com',
                role: 'approver',
                permissions: ['view_balance', 'approve_release', 'verify_conditions'],
                signatureRequired: true
              }
            ]
          })
        });

        if (!createEscrowResponse.ok) {
          throw new Error('Failed to create escrow account');
        }

        const escrowResult = await createEscrowResponse.json();
        escrowId = escrowResult.escrowAccount.id;
      }

      // Create payment intent
      const paymentResponse = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents
          propertyId,
          paymentType,
          description: `${paymentType.replace('_', ' ')} for property ${propertyId}`,
          buyerId: 'current_user', // In real app, get from auth context
          metadata: {
            escrowId,
            escrowEnabled: true,
            fundSource: getFundSource(paymentType)
          }
        })
      });

      if (!paymentResponse.ok) {
        throw new Error('Failed to create payment intent');
      }

      const paymentResult = await paymentResponse.json();

      // In a real implementation, you'd use Stripe Elements here
      // For now, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Deposit funds into escrow after successful payment
      const depositResponse = await fetch('/api/escrow/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          escrowId,
          amount: amount * 100, // Amount in cents
          currency: 'EUR',
          source: getFundSource(paymentType),
          depositedBy: 'current_user',
          paymentMethod: 'credit_card',
          purpose: `${paymentType.replace('_', ' ')} payment`,
          stripePaymentIntentId: paymentResult.paymentIntent.id
        })
      });

      if (!depositResponse.ok) {
        throw new Error('Failed to deposit funds into escrow');
      }

      const depositResult = await depositResponse.json();

      onPaymentSuccess?.(escrowId!, depositResult.deposit.id);

    } catch (error: any) {
      console.error('Error processing escrow payment:', error);
      onPaymentError?.(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Shield size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Secure Escrow Payment</h3>
            <p className="text-sm text-gray-600">
              Your payment will be held securely until all conditions are met
            </p>
          </div>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-medium text-gray-900">Payment Amount</h4>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(amount)}</p>
          </div>
          <div className="text-right">
            <h4 className="font-medium text-gray-900">Payment Type</h4>
            <p className="text-sm text-gray-600 capitalize">{paymentType.replace('_', ' ')}</p>
          </div>
        </div>

        {escrowData?.account && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={16} className="text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Existing Escrow Account Found
              </span>
            </div>
            <p className="text-sm text-green-700">
              Your payment will be added to escrow account #{escrowData.escrowId?.slice(-6)}
            </p>
          </div>
        )}
      </div>

      {/* Escrow Protection Details */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">Escrow Protection</h4>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
          >
            {showDetails ? 'Hide' : 'Show'} Details
            <Eye size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Shield size={24} className="mx-auto text-blue-600 mb-2" />
            <p className="text-sm font-medium text-gray-900">Secure Holding</p>
            <p className="text-xs text-gray-600">Funds held safely</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Target size={24} className="mx-auto text-green-600 mb-2" />
            <p className="text-sm font-medium text-gray-900">Condition-Based</p>
            <p className="text-xs text-gray-600">Released when conditions met</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Clock size={24} className="mx-auto text-amber-600 mb-2" />
            <p className="text-sm font-medium text-gray-900">Estimated Release</p>
            <p className="text-xs text-gray-600">{escrowData?.estimatedReleaseTime}</p>
          </div>
        </div>

        {showDetails && escrowData && (
          <div className="space-y-4">
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Release Conditions</h5>
              <ul className="space-y-2">
                {escrowData.suggestedConditions.map((condition, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle size={14} className="text-green-600" />
                    {condition}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Info size={16} className="text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">How Escrow Works</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Your payment is held securely by our escrow service until all agreed conditions are met. 
                    This protects both buyers and sellers by ensuring funds are only released when all 
                    parties have fulfilled their obligations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Terms and Payment */}
      <div className="p-6">
        <div className="mb-4">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5"
            />
            <span className="text-sm text-gray-700">
              I agree to the{' '}
              <a href="/terms/escrow" className="text-blue-600 hover:underline">
                escrow terms and conditions
              </a>{' '}
              and understand that my payment will be held securely until all conditions are met.
            </span>
          </label>
        </div>

        <button
          onClick={handlePaymentWithEscrow}
          disabled={!agreedToTerms || processing}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing Payment...
            </>
          ) : (
            <>
              <Lock size={16} />
              Pay {formatCurrency(amount)} with Escrow Protection
              <ArrowRight size={16} />
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center mt-3">
          Your payment is processed securely and held in escrow until all conditions are satisfied
        </p>
      </div>
    </div>
  );
}