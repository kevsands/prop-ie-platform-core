/**
 * ================================================================================
 * HEALTH CHECK API ENDPOINT
 * Production monitoring and system status verification
 * Used by load balancers, monitoring systems, and deployment verification
 * ================================================================================
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Basic application health
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'PROP.ie Enterprise Property Platform',
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      
      // System resources
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
        unit: 'MB'
      },
      
      // Service configuration status
      services: {
        database: checkDatabaseConfig(),
        stripe: checkStripeConfig(),
        aws: checkAWSConfig(),
        sentry: checkSentryConfig(),
      },
      
      // Request metadata
      requestId: crypto.randomUUID(),
      responseTime: Date.now() - startTime,
    };

    // Determine overall health status
    const unhealthyServices = Object.entries(health.services)
      .filter(([_, status]) => (status as any).status !== 'configured')
      .map(([service, _]) => service);

    if (unhealthyServices.length > 0) {
      (health as any).status = 'degraded';
      (health as any).warnings = `Services not configured: ${unhealthyServices.join(', ')}`;
    }

    const statusCode = health.status === 'healthy' ? 200 : 
                      (health as any).status === 'degraded' ? 200 : 503;

    return NextResponse.json(health, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Pragma': 'no-cache',
      }
    });

  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'PROP.ie Enterprise Property Platform',
      error: error instanceof Error ? error.message : 'Unknown health check error',
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
 * Check database configuration status
 */
function checkDatabaseConfig() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    return {
      status: 'not_configured',
      message: 'DATABASE_URL not set'
    };
  }

  if (databaseUrl.includes('localhost') || databaseUrl.includes('file:')) {
    return {
      status: 'configured',
      type: 'development',
      message: 'Local database configured'
    };
  }

  return {
    status: 'configured',
    type: 'production',
    message: 'Production database configured'
  };
}

/**
 * Check Stripe configuration status
 */
function checkStripeConfig() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  
  if (!stripeSecretKey || !stripePublishableKey) {
    return {
      status: 'not_configured',
      message: 'Stripe keys not configured'
    };
  }

  const isTestMode = stripeSecretKey.includes('sk_test_');
  
  return {
    status: 'configured',
    mode: isTestMode ? 'test' : 'live',
    message: isTestMode ? 'Test mode configured' : 'Live mode configured'
  };
}

/**
 * Check AWS configuration status
 */
function checkAWSConfig() {
  const cognitoUserPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;
  const cognitoClientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
  
  if (!cognitoUserPoolId || !cognitoClientId) {
    return {
      status: 'not_configured',
      message: 'AWS Cognito not configured'
    };
  }

  const isProduction = !cognitoUserPoolId.includes('TEMPORARY');
  
  return {
    status: 'configured',
    mode: isProduction ? 'production' : 'development',
    message: isProduction ? 'Production Cognito configured' : 'Development Cognito configured'
  };
}

/**
 * Check Sentry configuration status
 */
function checkSentryConfig() {
  const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  
  if (!sentryDsn) {
    return {
      status: 'not_configured',
      message: 'Sentry monitoring not configured'
    };
  }

  return {
    status: 'configured',
    message: 'Error monitoring configured'
  };
}

/**
 * HEAD request for simple health checks
 */
export async function HEAD() {
  return new Response(null, { 
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'Pragma': 'no-cache',
    }
  });
}