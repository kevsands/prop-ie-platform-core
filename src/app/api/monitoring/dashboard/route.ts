import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { monitoringService } from '@/services/monitoringService';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get dashboard data from monitoring service
    const dashboardData = monitoringService.getDashboardData();
    
    return NextResponse.json({
      data: dashboardData,
      timestamp: new Date(),
      status: 'success'
    });

  } catch (error) {
    console.error('Failed to fetch monitoring dashboard data:', error);
    
    // Return mock data if monitoring service fails
    const mockDashboardData = {
      systemHealth: {
        overall: 'HEALTHY' as const,
        uptime: 99.97,
        lastUpdated: new Date(),
        components: {
          api: 'UP' as const,
          database: 'UP' as const,
          email: 'UP' as const,
          payments: 'UP' as const,
          monitoring: 'UP' as const
        },
        metrics: {
          avgResponseTime: 245,
          errorRate: 0.02,
          throughput: 1247,
          activeUsers: 34,
          pendingTransactions: 7
        }
      },
      activeAlerts: [
        {
          id: 'alert-001',
          severity: 'HIGH',
          title: 'API Response Time Elevated',
          description: 'Average API response time has increased to 1.8s, approaching warning threshold',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          acknowledged: false,
          context: {
            systemComponent: 'api',
            troubleshootingSteps: [
              'Check API server load and CPU usage',
              'Review database query performance',
              'Examine network latency to external services'
            ]
          }
        }
      ],
      recentMetrics: {
        responseTime: [],
        errorRate: [],
        throughput: [],
        userActivity: []
      }
    };

    return NextResponse.json({
      data: mockDashboardData,
      timestamp: new Date(),
      status: 'fallback',
      message: 'Using mock data due to monitoring service unavailability'
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, alertId, acknowledgedBy } = await request.json();

    if (action === 'acknowledge_alert' && alertId) {
      const success = monitoringService.acknowledgeAlert(alertId, acknowledgedBy || session.user?.email || 'user');
      
      if (success) {
        return NextResponse.json({
          message: 'Alert acknowledged successfully',
          alertId,
          acknowledgedBy: acknowledgedBy || session.user?.email
        });
      } else {
        return NextResponse.json(
          { error: 'Alert not found or already acknowledged' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Invalid action or missing parameters' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Failed to process monitoring action:', error);
    return NextResponse.json(
      { error: 'Failed to process action' },
      { status: 500 }
    );
  }
}