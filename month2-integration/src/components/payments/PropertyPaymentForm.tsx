'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Euro, CreditCard, Shield, CheckCircle, AlertCircle, Clock, Loader2, Lock, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  propertyId: string;
  propertyName: string;
  amount: number;
  paymentType: 'booking_deposit' | 'contractual_deposit' | 'completion_payment' | 'stage_payment' | 'upgrade_payment';
  description: string;
  onSuccess: (paymentResult: any) => void;
  onError: (error: any) => void;
}

function StripePaymentForm({ 
  propertyId, 
  propertyName, 
  amount, 
  paymentType, 
  description, 
  onSuccess, 
  onError 
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState<any>(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const [step, setStep] = useState<'setup' | 'payment' | 'success' | 'error'>('setup');

  // Step 1: Create payment intent
  const createPaymentIntent = async () => {
    setProcessing(true);
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency: 'eur',
          description,
          propertyId,
          paymentType,
          metadata: {
            propertyName,
            buyerJourney: 'production_payment'
          }
        }),
      });

      const data = await response.json();
      if (data.paymentIntent && data.paymentIntent.clientSecret) {
        setPaymentIntent({
          clientSecret: data.paymentIntent.clientSecret,
          id: data.paymentIntent.id,
          amount: data.paymentIntent.amount,
          currency: data.paymentIntent.currency,
          fees: data.fees
        });
        setStep('payment');
      } else {
        setStep('error');
        onError(data.error || 'Failed to create payment intent');
      }
    } catch (error) {
      setStep('error');
      onError(error);
    } finally {
      setProcessing(false);
    }
  };

  // Handle card element changes
  const handleCardChange = (event: any) => {
    setCardComplete(event.complete);
    setCardError(event.error ? event.error.message : null);
  };

  // Step 2: Complete payment
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !paymentIntent || !cardComplete) {
      return;
    }

    setProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setProcessing(false);
      return;
    }

    try {
      const { error, paymentIntent: confirmedPayment } = await stripe.confirmCardPayment(
        paymentIntent.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: 'Property Buyer',
              email: 'buyer@propie.ie',
            },
          },
        }
      );

      if (error) {
        setStep('error');
        onError(error);
      } else if (confirmedPayment && confirmedPayment.status === 'succeeded') {
        setStep('success');
        onSuccess({
          ...confirmedPayment,
          propertyId,
          propertyName,
          paymentType
        });
      }
    } catch (err) {
      setStep('error');
      onError(err);
    } finally {
      setProcessing(false);
    }
  };

  if (!paymentIntent) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <div className="text-center">
          <CreditCard className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Secure Payment Setup
          </h3>
          <p className="text-gray-600 mb-4">
            {description} for {propertyName}
          </p>
          <p className="text-2xl font-bold text-gray-900 mb-6">
            €{(amount / 100).toLocaleString()}
          </p>
          <button
            onClick={createPaymentIntent}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Shield className="h-6 w-6 text-green-600 mr-2" />
          <span className="text-sm text-green-600 font-medium">PCI Compliant Secure Payment</span>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Property:</span>
            <span className="font-medium">{propertyName}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Payment Type:</span>
            <span className="font-medium capitalize">{paymentType.replace('_', ' ')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Amount:</span>
            <span className="text-xl font-bold text-blue-600">€{(amount / 100).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Details
          </label>
          <div className="p-4 border border-gray-300 rounded-md">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#374151',
                    '::placeholder': {
                      color: '#9CA3AF',
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg text-sm text-green-800">
          <div className="flex items-center mb-2">
            <Lock className="h-4 w-4 mr-2" />
            <span className="font-medium">Secure Payment Processing</span>
          </div>
          <p>• PCI DSS Level 1 compliant encryption</p>
          <p>• Your card details are never stored on our servers</p>
          <p>• 256-bit SSL encryption in transit</p>
        </div>

        <button
          type="submit"
          disabled={!stripe || processing}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center"
        >
          {processing ? (
            <>
              <Clock className="h-5 w-5 mr-2 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5 mr-2" />
              Complete Payment €{(amount / 100).toLocaleString()}
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function PropertyPaymentForm(props: PaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <StripePaymentForm {...props} />
    </Elements>
  );
}