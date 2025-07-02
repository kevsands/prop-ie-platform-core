import { NextRequest, NextResponse } from 'next/server';
import { securityMonitor } from '@/lib/security/security-monitor';
import { auditLogger, SecurityEventType } from '@/lib/security/audit-logger';

/**
 * Security Metrics API Endpoint
 * 
 * Provides real-time security metrics and alerts for the security dashboard
 * Requires admin or security role access
 */

export async function GET(request: NextRequest) {
  try {
    // Extract user context from headers (set by middleware)
    const userId = request.headers.get('X-User-ID');
    const userRole = request.headers.get('X-User-Role');
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     request.ip || 
                     'unknown';

    // Check authorization - only admin and security roles can access
    if (!userRole || !['ADMIN', 'SECURITY_OFFICER'].includes(userRole)) {
      // Log unauthorized access attempt
      auditLogger.logSecurityEvent(
        SecurityEventType.ACCESS_DENIED,
        'Unauthorized access to security metrics',
        {
          userContext: { userId, role: userRole },
          requestContext: { ipAddress },
          metadata: { endpoint: '/api/security/metrics' },
          tags: ['unauthorized-access', 'security-metrics']
        }
      );

      return NextResponse.json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'Access denied: Security dashboard requires admin or security officer role'
        }
      }, { status: 403 });
    }

    // Log authorized access to security metrics
    auditLogger.logSecurityEvent(
      SecurityEventType.SENSITIVE_DATA_ACCESS,
      'Security metrics accessed',
      {
        userContext: { userId, role: userRole },
        requestContext: { ipAddress },
        metadata: { endpoint: '/api/security/metrics' },
        tags: ['security-metrics', 'admin-access']
      }
    );

    // Get security metrics
    const metrics = securityMonitor.getSecurityMetrics();
    const alerts = securityMonitor.getActiveAlerts();

    // Calculate additional metrics
    const criticalAlerts = alerts.filter(alert => alert.severity === 'CRITICAL').length;
    const highRiskAlerts = alerts.filter(alert => alert.severity === 'HIGH').length;
    
    // Get time-based metrics (last 24 hours)
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const recentAlerts = alerts.filter(alert => alert.timestamp > last24Hours);

    // Security health score (0-100)
    const healthScore = calculateSecurityHealthScore(metrics, alerts);

    const response = {
      success: true,
      data: {
        overview: {
          healthScore,
          riskLevel: getRiskLevel(healthScore),
          lastUpdated: new Date().toISOString()
        },
        metrics: {
          ...metrics,
          criticalAlerts,
          highRiskAlerts,
          alertsLast24h: recentAlerts.length
        },
        alerts: {
          active: alerts.slice(0, 10), // Last 10 alerts
          total: alerts.length,
          breakdown: {
            critical: criticalAlerts,
            high: highRiskAlerts,
            medium: alerts.filter(alert => alert.severity === 'MEDIUM').length,
            low: alerts.filter(alert => alert.severity === 'LOW').length
          }
        },
        trends: {
          // In a real implementation, would calculate trends over time
          failedLoginTrend: metrics.failedLoginAttempts > 10 ? 'increasing' : 'stable',
          threatTrend: metrics.activeThreats > 5 ? 'increasing' : 'stable',
          riskTrend: metrics.riskScore > 70 ? 'high' : metrics.riskScore > 40 ? 'medium' : 'low'
        }
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching security metrics:', error);
    
    // Log the error
    auditLogger.logSecurityEvent(
      SecurityEventType.UNKNOWN_ERROR,
      'Error fetching security metrics',
      {
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
        tags: ['api-error', 'security-metrics']
      }
    );

    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch security metrics'
      }
    }, { status: 500 });
  }
}

/**
 * Calculate overall security health score
 */
function calculateSecurityHealthScore(metrics: any, alerts: any[]): number {
  let score = 100;

  // Deduct points for failed logins
  score -= Math.min(metrics.failedLoginAttempts * 2, 30);

  // Deduct points for active threats
  score -= Math.min(metrics.activeThreats * 5, 25);

  // Deduct points for blocked IPs (indicates ongoing attacks)
  score -= Math.min(metrics.blockedIPs * 3, 15);

  // Deduct points for high risk score
  if (metrics.riskScore > 80) score -= 20;
  else if (metrics.riskScore > 60) score -= 10;
  else if (metrics.riskScore > 40) score -= 5;

  // Deduct points for critical alerts
  const criticalAlerts = alerts.filter(alert => alert.severity === 'CRITICAL').length;
  score -= criticalAlerts * 10;

  // Deduct points for high severity alerts
  const highAlerts = alerts.filter(alert => alert.severity === 'HIGH').length;
  score -= highAlerts * 5;

  return Math.max(0, Math.min(100, score));
}

/**
 * Get risk level based on health score
 */
function getRiskLevel(healthScore: number): string {
  if (healthScore >= 80) return 'LOW';
  if (healthScore >= 60) return 'MEDIUM';
  if (healthScore >= 40) return 'HIGH';
  return 'CRITICAL';
}

/**
 * POST endpoint for manual security actions
 */
export async function POST(request: NextRequest) {
  try {
    const { action, targetIp, reason } = await request.json();
    
    const userId = request.headers.get('X-User-ID');
    const userRole = request.headers.get('X-User-Role');
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';

    // Check authorization
    if (!userRole || !['ADMIN', 'SECURITY_OFFICER'].includes(userRole)) {
      return NextResponse.json({
        success: false,
        error: { code: 'INSUFFICIENT_PERMISSIONS', message: 'Access denied' }
      }, { status: 403 });
    }

    switch (action) {
      case 'block_ip':
        if (!targetIp) {
          return NextResponse.json({
            success: false,
            error: { code: 'INVALID_REQUEST', message: 'Target IP is required' }
          }, { status: 400 });
        }

        securityMonitor.blockIP(targetIp, reason || 'Manual block by admin');
        
        auditLogger.logSecurityEvent(
          SecurityEventType.ADMIN_ACTION,
          `IP ${targetIp} manually blocked by admin`,
          {
            userContext: { userId, role: userRole },
            requestContext: { ipAddress },
            metadata: { action: 'block_ip', targetIp, reason },
            tags: ['admin-action', 'ip-block', 'manual']
          }
        );

        return NextResponse.json({
          success: true,
          message: `IP ${targetIp} has been blocked`,
          data: { blockedIp: targetIp, reason }
        });

      case 'resolve_alert':
        const { alertId } = await request.json();
        if (!alertId) {
          return NextResponse.json({
            success: false,
            error: { code: 'INVALID_REQUEST', message: 'Alert ID is required' }
          }, { status: 400 });
        }

        securityMonitor.resolveAlert(alertId);
        
        auditLogger.logSecurityEvent(
          SecurityEventType.ADMIN_ACTION,
          `Security alert ${alertId} resolved by admin`,
          {
            userContext: { userId, role: userRole },
            requestContext: { ipAddress },
            metadata: { action: 'resolve_alert', alertId },
            tags: ['admin-action', 'alert-resolution']
          }
        );

        return NextResponse.json({
          success: true,
          message: `Alert ${alertId} has been resolved`
        });

      default:
        return NextResponse.json({
          success: false,
          error: { code: 'INVALID_ACTION', message: 'Unknown action' }
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Error processing security action:', error);
    
    return NextResponse.json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to process security action' }
    }, { status: 500 });
  }
}