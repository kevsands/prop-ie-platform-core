import { NextRequest, NextResponse } from 'next/server';
import os from 'os';
import { PrismaClient } from '@prisma/client';
import { metrics } from '@/lib/metrics-utils';

// Types
interface MetricsResponse {
  timestamp: string;
  period: string;
  application: {
    version: string;
    environment: string;
    uptime: number;
    pid: number;
  };
  performance: {
    averageResponseTime: number;
    requestsPerSecond: number;
    errorRate: number;
    successRate: number;
    activeConnections: number;
    totalRequests: number;
    totalErrors: number;
  };
  resources: {
    memory: {
      used: number;
      total: number;
      percentUsed: number;
      processMemory: NodeJS.MemoryUsage;
    };
    cpu: {
      cores: number;
      usage: number;
      loadAverage: number[];
    };
    disk: {
      free?: number;
      total?: number;
      percentUsed?: number;
    };
  };
  database: {
    connections: {
      active: number;
      idle: number;
      total: number;
    };
    queryPerformance: {
      averageTime: number;
      slowQueries: number;
    };
  };
  cache: {
    hitRate: number;
    missRate: number;
    evictions: number;
    keys: number;
  };
  errors: {
    byType: Record<string, number>
  );
    criticalErrors: number;
    warningCount: number;
  };
  endpoints: Array<{
    path: string;
    method: string;
    count: number;
    averageTime: number;
    errorRate: number;
  }>
  );
}

// Initialize Prisma (safely)
let prisma: PrismaClient | null = null;
try {
  prisma = new PrismaClient();
} catch (error) {

}

// Helper functions
async function getDatabaseMetrics() {
  try {
    if (!prisma) {
      return {
        connections: { active: 0, idle: 0, total: 0 },
        queryPerformance: { averageTime: 0, slowQueries: 0 }
      };
    }

    // Get connection pool metrics (simulated for now)
    // In production, you'd get this from your database monitoring

    return {
      connections: {
        active: Math.floor(Math.random() * 10) + 1,
        idle: Math.floor(Math.random() * 5),
        total: 15
      },
      queryPerformance: {
        averageTime: Math.random() * 100 + 20,
        slowQueries: Math.floor(Math.random() * 5)
      }
    };
  } catch (error) {

    return {
      connections: { active: 0, idle: 0, total: 0 },
      queryPerformance: { averageTime: 0, slowQueries: 0 }
    };
  }
}

function getCacheMetrics() {
  // In production, these would come from Redis
  const totalRequests = metrics.requestCount || 1;
  const cacheHits = Math.floor(totalRequests * 0.85); // 85% hit rate
  const cacheMisses = totalRequests - cacheHits;

  return {
    hitRate: cacheHits / totalRequests,
    missRate: cacheMisses / totalRequests,
    evictions: Math.floor(Math.random() * 100),
    keys: Math.floor(Math.random() * 1000) + 500
  };
}

function getResourceMetrics() {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;

  const cpuCores = os.cpus().length;
  const loadAverage = os.loadavg();
  const cpuUsage = (loadAverage[0] / cpuCores) * 100;

  const processMemory = process.memoryUsage();

  return {
    memory: {
      used: usedMemory,
      total: totalMemory,
      percentUsed: (usedMemory / totalMemory) * 100,
      processMemory
    },
    cpu: {
      cores: cpuCores,
      usage: cpuUsage,
      loadAverage
    },
    disk: {
      // Disk metrics would require additional system calls
      // Keeping it simple for now
      free: undefined,
      total: undefined,
      percentUsed: undefined
    }
  };
}

function getEndpointMetrics() {
  const endpoints = Array.from(metrics.endpoints.entries()).map(([keydata]) => {
    const [methodpath] = key.split(':');
    return {
      path,
      method,
      count: data.count,
      averageTime: data.count> 0 ? data.totalTime / data.count : 0,
      errorRate: data.count> 0 ? data.errors / data.count : 0
    };
  });

  // Sort by request count descending
  endpoints.sort((ab: any) => b.count - a.count);

  // Return top 10 endpoints
  return endpoints.slice(010);
}

function getErrorMetrics() {
  const errorTypes: Record<string, number> = {};
  metrics.errorTypes.forEach((counttype: any) => {
    errorTypes[type] = count;
  });

  const criticalErrors = errorTypes['500'] || 0;
  const warningCount = (errorTypes['400'] || 0) + (errorTypes['401'] || 0) + (errorTypes['403'] || 0);

  return {
    byType: errorTypes,
    criticalErrors,
    warningCount
  };
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Get all metrics data
    const [databaseMetricscacheMetricsresourceMetrics] = await Promise.all([
      getDatabaseMetrics(),
      Promise.resolve(getCacheMetrics()),
      Promise.resolve(getResourceMetrics())
    ]);

    const endpointMetrics = getEndpointMetrics();
    const errorMetrics = getErrorMetrics();

    const uptime = Date.now() - metrics.startTime;
    const averageResponseTime = metrics.requestCount> 0 
      ? metrics.totalResponseTime / metrics.requestCount 
      : 0;

    const requestsPerSecond = metrics.requestCount / (uptime / 1000);
    const errorRate = metrics.requestCount> 0 
      ? metrics.errorCount / metrics.requestCount 
      : 0;
    const successRate = 1 - errorRate;

    const response: MetricsResponse = {
      timestamp: new Date().toISOString(),
      period: 'since_startup',
      application: {
        version: process.env.npm_package_version || '0.1.0',
        environment: process.env.NODE_ENV || 'development',
        uptime: uptime,
        pid: process.pid
      },
      performance: {
        averageResponseTime,
        requestsPerSecond,
        errorRate,
        successRate,
        activeConnections: 0, // Would need to track this properly
        totalRequests: metrics.requestCount,
        totalErrors: metrics.errorCount
      },
      resources: resourceMetrics,
      database: databaseMetrics,
      cache: cacheMetrics,
      errors: errorMetrics,
      endpoints: endpointMetrics
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Response-Time': `${Date.now() - startTime}ms`
      }
    });
  } catch (error) {

    return NextResponse.json({
      error: 'Failed to collect metrics',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, {
      status: 500
    });
  }
}

// Reset metrics endpoint (for testing)
export async function POST(request: NextRequest) {
  try {
    const body: any = await request.json();
    const { action } = body;

    if (action === 'reset') {
      metrics.requestCount = 0;
      metrics.errorCount = 0;
      metrics.totalResponseTime = 0;
      metrics.endpoints.clear();
      metrics.errorTypes.clear();
      metrics.startTime = Date.now();

      return NextResponse.json({ success: true, message: 'Metrics reset' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}