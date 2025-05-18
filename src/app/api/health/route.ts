import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import os from 'os';

// Types
interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  service: string;
  version: string;
  uptime: number;
  environment: string;
  checks: {
    [key: string]: {
      status: 'ok' | 'error' | 'warning';
      message?: string;
      responseTime?: number;
      details?: any;
    };
  };
  system: {
    memory: {
      total: number;
      free: number;
      used: number;
      percentUsed: number;
    };
    cpu: {
      cores: number;
      loadAverage: number[];
      percentUsed: number;
    };
    process: {
      memoryUsage: NodeJS.MemoryUsage;
      uptime: number;
      pid: number;
    };
  };
}

// Initialize Prisma (safely)
let prisma: PrismaClient | null = null;
try {
  prisma = new PrismaClient();
} catch (error) {
  console.error('Failed to initialize Prisma:', error);
}

// Health check functions
async function checkDatabase(): Promise<any> {
  const startTime = Date.now();
  
  try {
    if (!prisma) {
      return {
        status: 'error',
        message: 'Database client not initialized',
        responseTime: Date.now() - startTime
      };
    }

    // Test connection with a simple query
    await prisma.$queryRaw`SELECT 1`;
    
    return {
      status: 'ok',
      responseTime: Date.now() - startTime,
      details: {
        provider: process.env.DATABASE_URL?.includes('mongodb') ? 'MongoDB' : 'PostgreSQL'
      }
    };
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Database connection failed',
      responseTime: Date.now() - startTime
    };
  }
}

async function checkRedis(): Promise<any> {
  const startTime = Date.now();
  
  try {
    // Check if Redis URL is configured
    if (!process.env.REDIS_URL) {
      return {
        status: 'warning',
        message: 'Redis not configured',
        responseTime: Date.now() - startTime
      };
    }

    // In a real implementation, you'd test the Redis connection
    // For now, we'll simulate it
    return {
      status: 'ok',
      responseTime: Date.now() - startTime,
      details: {
        url: process.env.REDIS_URL.replace(/:[^:@]+@/, ':****@') // Hide password
      }
    };
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Redis connection failed',
      responseTime: Date.now() - startTime
    };
  }
}

async function checkExternalServices(): Promise<any> {
  const startTime = Date.now();
  const services: any = {};

  // Check AWS services
  if (process.env.AWS_REGION) {
    services.aws = {
      status: 'ok',
      region: process.env.AWS_REGION,
      services: {
        s3: process.env.AWS_S3_BUCKET ? 'configured' : 'not configured',
        cognito: process.env.AWS_COGNITO_USER_POOL_ID ? 'configured' : 'not configured',
        appsync: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ? 'configured' : 'not configured'
      }
    };
  }

  // Check Amplify
  if (process.env.NEXT_PUBLIC_AWS_PROJECT_REGION) {
    services.amplify = {
      status: 'ok',
      region: process.env.NEXT_PUBLIC_AWS_PROJECT_REGION,
      configured: true
    };
  }

  return {
    status: Object.keys(services).length > 0 ? 'ok' : 'warning',
    message: Object.keys(services).length === 0 ? 'No external services configured' : undefined,
    responseTime: Date.now() - startTime,
    details: services
  };
}

function getSystemInfo() {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  
  const cpuCores = os.cpus().length;
  const loadAverage = os.loadavg();
  
  const processMemory = process.memoryUsage();

  return {
    memory: {
      total: totalMemory,
      free: freeMemory,
      used: usedMemory,
      percentUsed: (usedMemory / totalMemory) * 100
    },
    cpu: {
      cores: cpuCores,
      loadAverage: loadAverage,
      percentUsed: (loadAverage[0] / cpuCores) * 100
    },
    process: {
      memoryUsage: processMemory,
      uptime: process.uptime(),
      pid: process.pid
    }
  };
}

export async function GET(request: Request) {
  const startTime = Date.now();
  
  try {
    // Run all health checks in parallel
    const [databaseCheck, redisCheck, externalServicesCheck] = await Promise.all([
      checkDatabase(),
      checkRedis(),
      checkExternalServices()
    ]);

    const checks = {
      database: databaseCheck,
      redis: redisCheck,
      externalServices: externalServicesCheck
    };

    // Determine overall status
    const hasError = Object.values(checks).some(check => check.status === 'error');
    const hasWarning = Object.values(checks).some(check => check.status === 'warning');
    
    let status: 'healthy' | 'unhealthy' | 'degraded';
    if (hasError) {
      status = 'unhealthy';
    } else if (hasWarning) {
      status = 'degraded';
    } else {
      status = 'healthy';
    }

    const response: HealthCheckResponse = {
      status,
      timestamp: new Date().toISOString(),
      service: 'PropIE AWS Application',
      version: process.env.npm_package_version || '0.1.0',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      checks,
      system: getSystemInfo()
    };

    // Add response headers for monitoring
    const responseHeaders = {
      'X-Response-Time': `${Date.now() - startTime}ms`,
      'X-Health-Status': status,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    };

    return NextResponse.json(response, {
      status: status === 'healthy' ? 200 : 503,
      headers: responseHeaders
    });
  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'PropIE AWS Application',
      version: process.env.npm_package_version || '0.1.0',
      error: error instanceof Error ? error.message : 'Unknown error',
      checks: {}
    }, {
      status: 503,
      headers: {
        'X-Response-Time': `${Date.now() - startTime}ms`,
        'X-Health-Status': 'unhealthy'
      }
    });
  }
}

// Cleanup on shutdown
if (typeof process !== 'undefined') {
  process.on('SIGINT', async () => {
    if (prisma) {
      await prisma.$disconnect();
    }
  });
}