import { NextRequest, NextResponse } from 'next/server';
import { taskAnalyticsService } from '@/services/TaskAnalyticsService';
import { userService } from '@/lib/services/users-production';

/**
 * Task Analytics API
 * Handles comprehensive task analytics, reporting, and insights
 */
export async function GET(request: NextRequest) {
  try {
    // Get current user
    let currentUser = null;
    try {
      if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
        const authToken = request.cookies.get('auth-token')?.value;
        if (authToken?.startsWith('dev-token-')) {
          const userId = authToken.replace('dev-token-', '');
          currentUser = await userService.getUserById(userId);
        }
      } else {
        currentUser = await userService.getCurrentUser();
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const userId = searchParams.get('user_id');
    const milestone = searchParams.get('milestone');
    const status = searchParams.get('status');
    const reportType = searchParams.get('report_type');

    switch (type) {
      case 'overview':
        // Get overall task metrics
        const overallMetrics = taskAnalyticsService.getOverallMetrics();
        const recentBottlenecks = taskAnalyticsService.getBottlenecks('active').slice(0, 3);
        const topPerformers = taskAnalyticsService.getUserPerformanceMetrics()
          .sort((a, b) => b.efficiencyScore - a.efficiencyScore)
          .slice(0, 5);

        return NextResponse.json({
          success: true,
          overview: {
            metrics: overallMetrics,
            bottlenecks: recentBottlenecks,
            topPerformers,
            lastUpdated: new Date().toISOString()
          }
        });

      case 'metrics':
        // Get detailed metrics
        const metrics = taskAnalyticsService.getOverallMetrics();
        return NextResponse.json({
          success: true,
          metrics
        });

      case 'user_performance':
        // Get user performance metrics
        const userMetrics = taskAnalyticsService.getUserPerformanceMetrics(userId);
        return NextResponse.json({
          success: true,
          userPerformance: userMetrics,
          count: userMetrics.length
        });

      case 'milestone_analytics':
        // Get milestone analytics
        const milestoneAnalytics = taskAnalyticsService.getMilestoneAnalytics(milestone);
        return NextResponse.json({
          success: true,
          milestoneAnalytics,
          count: milestoneAnalytics.length
        });

      case 'trends':
        // Get trend analysis
        const trendAnalysis = taskAnalyticsService.getTrendAnalysis();
        return NextResponse.json({
          success: true,
          trends: trendAnalysis
        });

      case 'bottlenecks':
        // Get bottleneck analysis
        const bottlenecks = taskAnalyticsService.getBottlenecks(status as any);
        return NextResponse.json({
          success: true,
          bottlenecks,
          count: bottlenecks.length
        });

      case 'forecast':
        // Get task forecast
        const forecast = taskAnalyticsService.getForecast();
        return NextResponse.json({
          success: true,
          forecast
        });

      case 'reports':
        // Get reports
        const reports = taskAnalyticsService.getReports(reportType as any);
        return NextResponse.json({
          success: true,
          reports,
          count: reports.length
        });

      case 'dashboard':
        // Get comprehensive dashboard data
        const dashboardData = {
          metrics: taskAnalyticsService.getOverallMetrics(),
          userPerformance: taskAnalyticsService.getUserPerformanceMetrics().slice(0, 10),
          trends: taskAnalyticsService.getTrendAnalysis(),
          bottlenecks: taskAnalyticsService.getBottlenecks('active'),
          forecast: taskAnalyticsService.getForecast(),
          milestones: taskAnalyticsService.getMilestoneAnalytics().slice(0, 5)
        };

        return NextResponse.json({
          success: true,
          dashboard: dashboardData,
          lastUpdated: new Date().toISOString()
        });

      default:
        return NextResponse.json(
          { error: 'Invalid analytics type' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Task analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Generate reports and analytics
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...params } = body;

    // Get current user
    let currentUser = null;
    try {
      if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
        const authToken = request.cookies.get('auth-token')?.value;
        if (authToken?.startsWith('dev-token-')) {
          const userId = authToken.replace('dev-token-', '');
          currentUser = await userService.getUserById(userId);
        }
      } else {
        currentUser = await userService.getCurrentUser();
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    switch (type) {
      case 'generate_report':
        // Generate custom report
        const { reportType, title, period, filters } = params;

        if (!reportType || !title || !period) {
          return NextResponse.json(
            { error: 'reportType, title, and period are required' },
            { status: 400 }
          );
        }

        const report = await taskAnalyticsService.generateReport({
          reportType,
          title,
          period: {
            from: new Date(period.from),
            to: new Date(period.to)
          },
          filters,
          generatedBy: currentUser.id
        });

        return NextResponse.json({
          success: true,
          report,
          message: 'Report generated successfully'
        });

      case 'refresh_metrics':
        // Refresh all analytics
        const refreshedMetrics = taskAnalyticsService.generateOverallMetrics();
        taskAnalyticsService.generateUserPerformanceMetrics();
        taskAnalyticsService.generateMilestoneAnalytics();
        taskAnalyticsService.generateTrendAnalysis();
        taskAnalyticsService.detectBottlenecks();
        taskAnalyticsService.generateForecast();

        return NextResponse.json({
          success: true,
          metrics: refreshedMetrics,
          message: 'Analytics refreshed successfully'
        });

      case 'export_data':
        // Export analytics data
        const exportType = params.exportType || 'json';
        const dataType = params.dataType || 'all';

        let exportData: any = {};

        switch (dataType) {
          case 'metrics':
            exportData = { metrics: taskAnalyticsService.getOverallMetrics() };
            break;
          case 'user_performance':
            exportData = { userPerformance: taskAnalyticsService.getUserPerformanceMetrics() };
            break;
          case 'trends':
            exportData = { trends: taskAnalyticsService.getTrendAnalysis() };
            break;
          case 'bottlenecks':
            exportData = { bottlenecks: taskAnalyticsService.getBottlenecks() };
            break;
          case 'forecast':
            exportData = { forecast: taskAnalyticsService.getForecast() };
            break;
          default:
            exportData = {
              metrics: taskAnalyticsService.getOverallMetrics(),
              userPerformance: taskAnalyticsService.getUserPerformanceMetrics(),
              trends: taskAnalyticsService.getTrendAnalysis(),
              bottlenecks: taskAnalyticsService.getBottlenecks(),
              forecast: taskAnalyticsService.getForecast(),
              milestones: taskAnalyticsService.getMilestoneAnalytics()
            };
        }

        return NextResponse.json({
          success: true,
          exportData,
          exportType,
          generatedAt: new Date().toISOString(),
          message: 'Data exported successfully'
        });

      case 'schedule_report':
        // Schedule recurring report (simulated)
        const { scheduleType, frequency, recipients } = params;

        return NextResponse.json({
          success: true,
          schedule: {
            id: `schedule_${Date.now()}`,
            type: scheduleType,
            frequency,
            recipients,
            nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            status: 'active'
          },
          message: 'Report scheduled successfully'
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action type' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Task analytics action error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to perform analytics action' },
      { status: 500 }
    );
  }
}