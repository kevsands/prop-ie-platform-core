// PropIE Irish Property Platform - Health Check API
// Secure health check endpoint without credential exposure

import { NextResponse } from 'next/server';
import { checkDatabaseConnection } from '@/lib/database';

export async function GET() {
  try {
    const startTime = Date.now();
    
    // Test database connectivity
    const isDatabaseConnected = await checkDatabaseConnection();
    const responseTime = Date.now() - startTime;

    const healthStatus = {
      status: isDatabaseConnected ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.PLATFORM_VERSION || '2.1.0',
      database: {
        connected: isDatabaseConnected,
        responseTime: responseTime
      },
      irish_market: {
        compliance: process.env.IRISH_MARKET_COMPLIANCE === 'true',
        apis_configured: !!(
          process.env.REVENUE_API_BASE_URL &&
          process.env.LAND_REGISTRY_API_BASE_URL &&
          process.env.PLANNING_AUTHORITY_API_BASE_URL
        )
      },
      infrastructure: {
        aws_region: process.env.PROPIE_AWS_REGION || 'not-configured',
        amplify_environment: process.env.AMPLIFY_ENVIRONMENT || 'not-configured'
      }
    };

    return NextResponse.json(healthStatus, {
      status: isDatabaseConnected ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    }, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    });
  }
}