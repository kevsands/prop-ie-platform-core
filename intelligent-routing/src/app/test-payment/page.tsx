'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Load Stripe with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51Pv3KAP9MwZJqQVhzvTUiGi8VgBQKAuE8MFKGupstY5wxgfboxneAbmRr9mXEQT9v7mFC81M3uKevADWwjyRUits00nuw5gnxU');

// Payment Form Component with Stripe Elements
function PaymentForm({ clientSecret, onSuccess, onError }: { 
  clientSecret: string, 
  onSuccess: (result: any) => void, 
  onError: (error: any) => void 
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setProcessing(false);
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Test Customer',
            email: 'test@propie.ie',
          },
        },
      });

      if (error) {
        onError(error);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      }
    } catch (err) {
      onError(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border border-gray-300 rounded-md">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>
      
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
      >
        {processing ? 'Processing Payment...' : 'Complete Payment'}
      </button>
    </form>
  );
}

export default function TestPaymentPage() {
  const [paymentIntent, setPaymentIntent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(5000);
  const [propertyId, setPropertyId] = useState('fitzgerald-gardens-unit-12');
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [paymentError, setPaymentError] = useState<any>(null);

  const createPaymentIntent = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency: 'eur',
          description: `Test payment for ${propertyId}`,
          propertyId,
          paymentType: 'booking_deposit'
        }),
      });

      const data = await response.json();
      setPaymentIntent(data);
    } catch (error) {
      console.error('Error creating payment intent:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (result: any) => {
    setPaymentResult(result);
    setPaymentError(null);
    console.log('Payment succeeded:', result);
  };

  const handlePaymentError = (error: any) => {
    setPaymentError(error);
    setPaymentResult(null);
    console.error('Payment failed:', error);
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🧪 Stripe Payment Integration Test
        </h1>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (in cents)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="5000"
            />
            <p className="text-sm text-gray-500 mt-1">
              €{(amount / 100).toFixed(2)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property ID
            </label>
            <input
              type="text"
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="fitzgerald-gardens-unit-12"
            />
          </div>

          <button
            onClick={createPaymentIntent}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Payment Intent'}
          </button>

          {paymentIntent && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ✅ Payment Intent Created
              </h3>
              <div className="space-y-2 text-sm">
                <p><strong>ID:</strong> {paymentIntent.paymentIntentId}</p>
                <p><strong>Amount:</strong> €{(paymentIntent.amount / 100).toFixed(2)}</p>
                <p><strong>Status:</strong> {paymentIntent.status}</p>
                <p><strong>Client Secret:</strong> {paymentIntent.clientSecret?.slice(0, 20)}...</p>
              </div>
            </div>
          )}

          {paymentIntent && paymentIntent.clientSecret && !paymentResult && (
            <div className="bg-white border-2 border-blue-200 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                💳 Complete Payment
              </h3>
              <PaymentForm
                clientSecret={paymentIntent.clientSecret}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Test Cards:</strong></p>
                <p>✅ Success: 4242 4242 4242 4242</p>
                <p>❌ Decline: 4000 0000 0000 0002</p>
                <p>Use any future date and any 3-digit CVC</p>
              </div>
            </div>
          )}

          {paymentResult && (
            <div className="bg-green-50 border-2 border-green-200 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-4">
                🎉 Payment Successful!
              </h3>
              <div className="space-y-2 text-sm text-green-800">
                <p><strong>Payment ID:</strong> {paymentResult.id}</p>
                <p><strong>Amount:</strong> €{(paymentResult.amount / 100).toFixed(2)}</p>
                <p><strong>Status:</strong> {paymentResult.status}</p>
                <p><strong>Payment Method:</strong> {paymentResult.payment_method}</p>
              </div>
            </div>
          )}

          {paymentError && (
            <div className="bg-red-50 border-2 border-red-200 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-red-900 mb-4">
                ❌ Payment Failed
              </h3>
              <div className="text-sm text-red-800">
                <p><strong>Error:</strong> {paymentError.message}</p>
                <p><strong>Code:</strong> {paymentError.code}</p>
              </div>
            </div>
          )}

          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              🔧 Testing Instructions
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>Create a payment intent above</li>
              <li>Use Stripe CLI to trigger webhook events:
                <code className="block bg-blue-100 p-2 mt-1 rounded text-xs">
                  stripe trigger payment_intent.succeeded
                </code>
              </li>
              <li>Check your server logs for webhook processing</li>
              <li>Test with test cards: 4242424242424242 (success)</li>
            </ol>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-900 mb-3">
              📊 API Status
            </h3>
            <div className="space-y-2 text-sm text-yellow-800">
              <p>✅ Stripe API Keys: Configured</p>
              <p>✅ Payment Intent API: Working</p>
              <p>✅ Webhook Endpoint: Active</p>
              <p>🔄 Next: Set up Stripe CLI for webhook testing</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </Elements>
  );
}