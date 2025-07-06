/**
 * WebSocket Connection Pooling Management API
 * 
 * Provides API endpoints for managing WebSocket connection pools
 * and monitoring extreme scale scenarios
 */

import { NextRequest, NextResponse } from 'next/server';
import { webSocketPoolManager } from '@/services/WebSocketConnectionPool';

/**
 * GET /api/realtime/pooling
 * Get connection pool statistics and health
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'stats':
        const aggregatedMetrics = webSocketPoolManager.getAggregatedMetrics();
        return NextResponse.json({
          success: true,
          data: aggregatedMetrics
        });

      case 'pools':
        const pools = webSocketPoolManager.getAllPools();
        const poolStatus = pools.map(pool => pool.getStatus());
        return NextResponse.json({
          success: true,
          data: {
            totalPools: pools.length,
            pools: poolStatus
          }
        });

      case 'health':
        const metrics = webSocketPoolManager.getAggregatedMetrics();
        const isHealthy = metrics.errorRate < 5 && metrics.poolUtilization < 90;
        
        return NextResponse.json({
          success: true,
          data: {
            isHealthy,
            utilization: metrics.poolUtilization,
            errorRate: metrics.errorRate,
            totalConnections: metrics.totalConnections,
            activeConnections: metrics.activeConnections,
            recommendations: generateHealthRecommendations(metrics)
          }
        });

      default:
        return NextResponse.json({
          success: true,
          data: {
            message: 'WebSocket Connection Pool Management API',
            endpoints: [
              'GET ?action=stats - Get aggregated pool statistics',
              'GET ?action=pools - Get all pool details',
              'GET ?action=health - Get health status and recommendations',
              'POST - Create new connection pool',
              'DELETE ?poolId=... - Remove connection pool'
            ]
          }
        });
    }
  } catch (error) {
    console.error('Connection pool API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve pool information'
    }, { status: 500 });
  }
}

/**
 * POST /api/realtime/pooling
 * Create new connection pool
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      poolId, 
      maxConnections = 1000,
      maxConnectionsPerUser = 10,
      connectionTimeout = 60000,
      heartbeatInterval = 30000,
      loadBalancing = 'least_connections'
    } = body;

    if (!poolId) {
      return NextResponse.json({
        success: false,
        error: 'Pool ID is required'
      }, { status: 400 });
    }

    // Check if pool already exists
    const existingPool = webSocketPoolManager.getPool(poolId);
    if (existingPool) {
      return NextResponse.json({
        success: false,
        error: 'Pool with this ID already exists'
      }, { status: 409 });
    }

    // Create new pool
    const pool = webSocketPoolManager.createPool(poolId, {
      maxConnections,
      maxConnectionsPerUser,
      connectionTimeout,
      heartbeatInterval,
      loadBalancing,
      clustering: true,
      metrics: true
    });

    return NextResponse.json({
      success: true,
      data: {
        poolId,
        status: pool.getStatus(),
        message: 'Connection pool created successfully'
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Pool creation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create connection pool'
    }, { status: 500 });
  }
}

/**
 * DELETE /api/realtime/pooling
 * Remove connection pool
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const poolId = searchParams.get('poolId');

    if (!poolId) {
      return NextResponse.json({
        success: false,
        error: 'Pool ID is required'
      }, { status: 400 });
    }

    const pool = webSocketPoolManager.getPool(poolId);
    if (!pool) {
      return NextResponse.json({
        success: false,
        error: 'Pool not found'
      }, { status: 404 });
    }

    // Graceful shutdown of the pool
    await pool.shutdown();

    return NextResponse.json({
      success: true,
      data: {
        poolId,
        message: 'Connection pool removed successfully'
      }
    });

  } catch (error) {
    console.error('Pool removal error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to remove connection pool'
    }, { status: 500 });
  }
}

/**
 * Generate health recommendations based on metrics
 */
function generateHealthRecommendations(metrics: any): string[] {
  const recommendations: string[] = [];

  if (metrics.poolUtilization > 80) {
    recommendations.push('High pool utilization detected. Consider adding more connection pools.');
  }

  if (metrics.errorRate > 2) {
    recommendations.push('Elevated error rate detected. Check connection health and network stability.');
  }

  if (metrics.averageLatency > 100) {
    recommendations.push('High latency detected. Consider geographic load balancing or connection optimization.');
  }

  if (metrics.poolCount < 2) {
    recommendations.push('Running with single pool. Consider adding redundant pools for high availability.');
  }

  if (metrics.totalConnections > 5000 && metrics.poolCount < 3) {
    recommendations.push('High connection count with few pools. Consider horizontal scaling.');
  }

  if (recommendations.length === 0) {
    recommendations.push('All metrics within healthy ranges. System performing optimally.');
  }

  return recommendations;
}