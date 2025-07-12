/**
 * Real-Time WebSocket API Endpoint
 * Handles WebSocket connections for live property updates
 * 
 * @fileoverview WebSocket server for buyer platform real-time synchronization
 */

import { NextRequest } from 'next/server';
import { realTimeDataSyncService } from '@/services/RealTimeDataSyncService';

/**
 * HTTP GET handler - WebSocket connection info
 */
export async function GET(request: NextRequest) {
  try {
    // Return WebSocket connection info
    return new Response(JSON.stringify({
      message: 'Real-time sync service running',
      endpoint: 'ws://localhost:8080/api/realtime',
      stats: realTimeDataSyncService.getStats(),
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Real-time service error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to get real-time service info'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

/**
 * HTTP POST handler - Manual event broadcasting
 */
export async function POST(request: NextRequest) {
  try {
    const { type, developmentId, unitId, data } = await request.json();

    if (!type || !developmentId) {
      return new Response(JSON.stringify({
        error: 'Missing required fields: type, developmentId'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Handle different event types
    switch (type) {
      case 'unit_status_change':
        realTimeDataSyncService.broadcastUnitStatusChange(
          developmentId,
          unitId,
          data.previousStatus,
          data.newStatus,
          data.updatedBy,
          data.reason
        );
        break;

      case 'unit_price_update':
        realTimeDataSyncService.broadcastUnitPriceUpdate(
          developmentId,
          unitId,
          data.previousPrice,
          data.newPrice,
          data.updatedBy,
          data.reason
        );
        break;

      case 'bulk_update':
        realTimeDataSyncService.broadcastBulkUnitUpdate(
          developmentId,
          data.updates,
          data.updatedBy
        );
        break;

      default:
        return new Response(JSON.stringify({
          error: `Unknown event type: ${type}`
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        });
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Event ${type} broadcasted to ${developmentId}`,
      stats: realTimeDataSyncService.getStats()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('WebSocket POST error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to process event broadcast'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}