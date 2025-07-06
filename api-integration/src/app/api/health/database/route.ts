/**
 * ================================================================================
 * DATABASE HEALTH CHECK API ENDPOINT
 * Verifies database connectivity and performance
 * ================================================================================
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Test basic database connectivity
    const connectionTest = await testDatabaseConnection();
    
    // Test query performance
    const performanceTest = await testQueryPerformance();
    
    // Get database stats
    const databaseStats = await getDatabaseStats();
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        connected: connectionTest.success,
        type: getDatabaseType(),
        connection: connectionTest,
        performance: performanceTest,
        stats: databaseStats,
      },
      responseTime: Date.now() - startTime,
    };

    // Determine overall status
    if (!connectionTest.success || performanceTest.queryTime > 5000) {
      health.status = 'unhealthy';
    } else if (performanceTest.queryTime > 1000) {
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
    console.error('Database health check failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown database error',
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
 * Test basic database connection
 */
async function testDatabaseConnection() {
  const startTime = Date.now();
  
  try {
    // Simple connectivity test
    await prisma.$queryRaw`SELECT 1 as test`;
    
    return {
      success: true,
      connectionTime: Date.now() - startTime,
      message: 'Database connection successful'
    };
  } catch (error) {
    return {
      success: false,
      connectionTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown connection error'
    };
  }
}

/**
 * Test query performance
 */
async function testQueryPerformance() {
  const startTime = Date.now();
  
  try {
    // Test a simple query that should exist in most setups
    const result = await prisma.$queryRaw`SELECT COUNT(*) as count FROM sqlite_master WHERE type='table'` as any;
    
    return {
      success: true,
      queryTime: Date.now() - startTime,
      tablesFound: Number(result[0]?.count || 0), // Convert BigInt to Number
      message: 'Query performance test successful'
    };
  } catch (error) {
    // Fallback for PostgreSQL or other databases
    try {
      const fallbackResult = await prisma.$queryRaw`SELECT 1 as test`;
      return {
        success: true,
        queryTime: Date.now() - startTime,
        message: 'Basic query performance test successful'
      };
    } catch (fallbackError) {
      return {
        success: false,
        queryTime: Date.now() - startTime,
        error: fallbackError instanceof Error ? fallbackError.message : 'Query performance test failed'
      };
    }
  }
}

/**
 * Get database statistics
 */
async function getDatabaseStats() {
  try {
    // Get basic database info
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      return {
        configured: false,
        message: 'DATABASE_URL not configured'
      };
    }

    const isPostgreSQL = databaseUrl.includes('postgresql://');
    const isSQLite = databaseUrl.includes('file:') || databaseUrl.includes('.db');
    
    return {
      configured: true,
      type: isPostgreSQL ? 'PostgreSQL' : isSQLite ? 'SQLite' : 'Unknown',
      url: databaseUrl.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'), // Mask credentials
      pooling: isPostgreSQL ? 'Available' : 'N/A',
    };
  } catch (error) {
    return {
      configured: false,
      error: error instanceof Error ? error.message : 'Stats collection failed'
    };
  }
}

/**
 * Determine database type from URL
 */
function getDatabaseType() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    return 'not_configured';
  }
  
  if (databaseUrl.includes('postgresql://')) {
    return 'PostgreSQL';
  }
  
  if (databaseUrl.includes('file:') || databaseUrl.includes('.db')) {
    return 'SQLite';
  }
  
  if (databaseUrl.includes('mysql://')) {
    return 'MySQL';
  }
  
  return 'unknown';
}

/**
 * HEAD request for simple connectivity check
 */
export async function HEAD() {
  try {
    await prisma.$queryRaw`SELECT 1`;
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