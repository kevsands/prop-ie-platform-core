/**
 * ================================================================================
 * PAYMENTS HEALTH CHECK API ENDPOINT
 * Verifies Stripe connectivity and payment system status
 * ================================================================================
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Check Stripe configuration
    const stripeConfig = checkStripeConfiguration();
    
    // Test Stripe connectivity (if configured)
    const stripeTest = await testStripeConnectivity();
    
    // Check webhook configuration
    const webhookConfig = checkWebhookConfiguration();
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      payments: {
        stripe: {
          configuration: stripeConfig,
          connectivity: stripeTest,
          webhooks: webhookConfig,
        },
        environment: getPaymentEnvironment(),
      },
      responseTime: Date.now() - startTime,
    };

    // Determine overall status
    if (!stripeConfig.configured || !stripeTest.success) {
      health.status = 'unhealthy';
    } else if (!webhookConfig.configured) {
      health.status = 'degraded';
    }

    const statusCode = health.status === 'healthy' ? 200 : 
                      health.status === 'degraded' ? 200 : 503;

    return NextResponse.json(health, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Pragma': 'no-cache',
      }
    });

  } catch (error) {
    console.error('Payments health check failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      payments: {
        error: error instanceof Error ? error.message : 'Unknown payments error',
      },
      responseTime: Date.now() - startTime,
    }, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Pragma': 'no-cache',
      }
    });
  }
}

/**
 * Check Stripe configuration
 */
function checkStripeConfiguration() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  
  if (!secretKey || !publishableKey) {
    return {
      configured: false,
      message: 'Stripe keys not configured',
      keys: {
        secretKey: !!secretKey,
        publishableKey: !!publishableKey,
      }
    };
  }

  const isTestMode = secretKey.includes('sk_test_');
  const isLiveMode = secretKey.includes('sk_live_');
  
  return {
    configured: true,
    mode: isTestMode ? 'test' : isLiveMode ? 'live' : 'unknown',
    message: `Stripe configured in ${isTestMode ? 'test' : isLiveMode ? 'live' : 'unknown'} mode`,
    keys: {
      secretKey: true,
      publishableKey: true,
    }
  };
}

/**
 * Test Stripe connectivity
 */
async function testStripeConnectivity() {
  const startTime = Date.now();
  
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!secretKey) {
      return {
        success: false,
        responseTime: Date.now() - startTime,
        message: 'No Stripe secret key configured'
      };
    }

    // Initialize Stripe
    const stripe = new Stripe(secretKey, {
      apiVersion: '2024-12-18.acacia',
    });

    // Test API connectivity with a simple account call
    const account = await stripe.accounts.retrieve();
    
    return {
      success: true,
      responseTime: Date.now() - startTime,
      account: {
        id: account.id,
        country: account.country,
        defaultCurrency: account.default_currency,
        type: account.type,
      },
      message: 'Stripe API connectivity successful'
    };
  } catch (error: any) {
    return {
      success: false,
      responseTime: Date.now() - startTime,
      error: error.message || 'Stripe connectivity test failed',
      errorType: error.type || 'unknown',
      message: 'Stripe API connectivity failed'
    };
  }
}

/**
 * Check webhook configuration
 */
function checkWebhookConfiguration() {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    return {
      configured: false,
      message: 'Stripe webhook secret not configured'
    };
  }

  const isTestWebhook = webhookSecret.includes('whsec_test_');
  const isLiveWebhook = webhookSecret.includes('whsec_') && !isTestWebhook;
  
  return {
    configured: true,
    mode: isTestWebhook ? 'test' : isLiveWebhook ? 'live' : 'unknown',
    endpoint: '/api/webhooks/stripe',
    message: `Webhook configured for ${isTestWebhook ? 'test' : isLiveWebhook ? 'live' : 'unknown'} mode`
  };
}

/**
 * Get payment environment configuration
 */
function getPaymentEnvironment() {
  return {
    currency: process.env.PAYMENT_CURRENCY || 'EUR',
    platformFee: process.env.STRIPE_PLATFORM_FEE_PERCENTAGE || '2.5',
    agentCommission: process.env.AGENT_COMMISSION_PERCENTAGE || '1.5',
    bookingDeposit: process.env.BOOKING_DEPOSIT_AMOUNT || '5000',
    contractualDepositRate: process.env.CONTRACTUAL_DEPOSIT_PERCENTAGE || '10',
  };
}

/**
 * HEAD request for simple payment system check
 */
export async function HEAD() {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!secretKey) {
      return new Response(null, { 
        status: 503,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
          'Pragma': 'no-cache',
        }
      });
    }

    return new Response(null, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Pragma': 'no-cache',
      }
    });
  } catch {
    return new Response(null, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Pragma': 'no-cache',
      }
    });
  }
}