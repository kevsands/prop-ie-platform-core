import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { monitoringService } from '@/services/monitoringService';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Test database connectivity
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbTime = Date.now() - dbStart;
    
    // Get system health from monitoring service
    const systemHealth = await monitoringService.getSystemHealth();
    
    // Calculate API response time
    const apiResponseTime = Date.now() - startTime;
    
    // Record metrics
    monitoringService.recordMetric({
      type: 'RESPONSE_TIME',
      name: 'Health Check API',
      value: apiResponseTime,
      unit: 'ms',
      source: 'health-check',
      tags: { endpoint: '/api/monitoring/health' }
    });

    monitoringService.recordMetric({
      type: 'RESPONSE_TIME',
      name: 'Database Health Check',
      value: dbTime,
      unit: 'ms',
      source: 'database',
      tags: { operation: 'health-check' }
    });

    // Enhanced health check with business metrics
    const [userCount, transactionCount, developmentCount] = await Promise.all([
      prisma.user.count(),
      prisma.transaction.count(),
      prisma.development.count()
    ]);

    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      systemHealth,
      services: {
        api: {
          status: 'up',
          responseTime: apiResponseTime,
          lastCheck: new Date().toISOString()
        },
        database: {
          status: 'up',
          responseTime: dbTime,
          lastCheck: new Date().toISOString(),
          connections: 'healthy' // Would check actual connection pool status
        },
        monitoring: {
          status: 'up',
          isActive: true,
          metricsCollected: true
        }
      },
      businessMetrics: {
        totalUsers: userCount,
        totalTransactions: transactionCount,
        totalDevelopments: developmentCount,
        lastUpdated: new Date().toISOString()
      },
      performance: {
        memory: process.memoryUsage(),
        cpu: process.cpuUsage()
      }
    };

    // Set appropriate cache headers
    const response = NextResponse.json(healthData);
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;

  } catch (error) {
    console.error('Health check failed:', error);
    
    const errorResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      services: {
        api: {
          status: 'up',
          responseTime: Date.now() - startTime,
          lastCheck: new Date().toISOString()
        },
        database: {
          status: 'down',
          error: 'Database connection failed',
          lastCheck: new Date().toISOString()
        },
        monitoring: {
          status: 'degraded',
          isActive: false,
          error: 'Monitoring service unavailable'
        }
      }
    };

    return NextResponse.json(errorResponse, { status: 503 });
  } finally {
    await prisma.$disconnect();
  }
}

// Simple health check endpoint for load balancers
export async function HEAD(request: NextRequest) {
  try {
    // Quick database ping
    await prisma.$queryRaw`SELECT 1`;
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    return new NextResponse(null, { status: 503 });
  } finally {
    await prisma.$disconnect();
  }
}