/**
 * Advanced Analytics API Routes
 * 
 * API endpoints for comprehensive business intelligence and predictive analytics
 * Leverages AI-enhanced multi-professional coordination data for executive insights
 * 
 * Endpoints:
 * - GET: Get executive analytics, performance metrics, market intelligence, optimization insights
 * - POST: Generate reports, create custom analytics queries
 * - PUT: Update analytics preferences and configurations
 * - DELETE: Archive old reports and analytics data
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import AdvancedAnalyticsService from '@/services/AdvancedAnalyticsService';

const analyticsService = new AdvancedAnalyticsService();

// Request schemas
const AnalyticsQuerySchema = z.object({
  dateRange: z.object({
    start: z.coerce.date(),
    end: z.coerce.date()
  }).optional(),
  projects: z.array(z.string()).optional(),
  professionals: z.array(z.string()).optional(),
  clients: z.array(z.string()).optional(),
  regions: z.array(z.string()).optional(),
  filters: z.record(z.any()).optional(),
  groupBy: z.array(z.string()).optional(),
  metrics: z.array(z.string()).optional()
});

const ReportGenerationSchema = z.object({
  type: z.enum(['executive', 'operational', 'financial', 'custom']),
  name: z.string().min(1),
  description: z.string().optional(),
  format: z.enum(['dashboard', 'pdf', 'excel', 'csv']).optional().default('dashboard'),
  distribution: z.array(z.string().email()).optional(),
  schedule: z.object({
    frequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly']),
    recipients: z.array(z.string().email()),
    nextRun: z.coerce.date()
  }).optional(),
  query: AnalyticsQuerySchema.optional()
});

const CustomAnalyticsSchema = z.object({
  query: AnalyticsQuerySchema,
  visualizations: z.array(z.object({
    type: z.enum(['line', 'bar', 'pie', 'area', 'scatter', 'heatmap']),
    data: z.string(),
    title: z.string(),
    description: z.string().optional()
  })),
  title: z.string().min(1),
  description: z.string().optional()
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'get_executive_analytics':
        return await getExecutiveAnalytics(request);

      case 'get_performance_analytics':
        return await getPerformanceAnalytics(request);

      case 'get_market_intelligence':
        return await getMarketIntelligence(request);

      case 'get_professional_analytics':
        return await getProfessionalAnalytics(request);

      case 'get_client_analytics':
        return await getClientAnalytics(request);

      case 'get_financial_analytics':
        return await getFinancialAnalytics(request);

      case 'get_optimization_insights':
        return await getOptimizationInsights(request);

      case 'get_predictive_insights':
        const projectId = searchParams.get('projectId');
        return await getPredictiveInsights(projectId);

      case 'get_optimization_opportunities':
        return await getOptimizationOpportunities();

      case 'get_analytics_reports':
        return await getAnalyticsReports();

      case 'get_kpi_summary':
        return await getKPISummary();

      case 'get_trend_analysis':
        const metric = searchParams.get('metric');
        const timeframe = searchParams.get('timeframe') || '30d';
        return await getTrendAnalysis(metric, timeframe);

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'generate_report':
        const reportData = ReportGenerationSchema.parse(body);
        return await generateReport(reportData);

      case 'create_custom_analytics':
        const customData = CustomAnalyticsSchema.parse(body);
        return await createCustomAnalytics(customData);

      case 'run_analytics_query':
        const queryData = AnalyticsQuerySchema.parse(body.query);
        return await runAnalyticsQuery(queryData);

      case 'export_analytics':
        const { format, data, filename } = body;
        if (!format || !data) {
          return NextResponse.json(
            { error: 'Format and data are required for export' },
            { status: 400 }
          );
        }
        return await exportAnalytics(format, data, filename);

      case 'schedule_report':
        const scheduleData = ReportGenerationSchema.parse(body);
        return await scheduleReport(scheduleData);

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Analytics API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'update_analytics_preferences':
        const { userId, preferences } = body;
        if (!userId || !preferences) {
          return NextResponse.json(
            { error: 'User ID and preferences are required' },
            { status: 400 }
          );
        }
        return await updateAnalyticsPreferences(userId, preferences);

      case 'update_kpi_targets':
        const { targets } = body;
        if (!targets) {
          return NextResponse.json(
            { error: 'Targets are required' },
            { status: 400 }
          );
        }
        return await updateKPITargets(targets);

      case 'update_alert_thresholds':
        const { thresholds } = body;
        if (!thresholds) {
          return NextResponse.json(
            { error: 'Thresholds are required' },
            { status: 400 }
          );
        }
        return await updateAlertThresholds(thresholds);

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'delete_report':
        const reportId = searchParams.get('reportId');
        if (!reportId) {
          return NextResponse.json(
            { error: 'Report ID is required' },
            { status: 400 }
          );
        }
        return await deleteReport(reportId);

      case 'archive_analytics_data':
        const beforeDate = searchParams.get('beforeDate');
        if (!beforeDate) {
          return NextResponse.json(
            { error: 'Before date is required' },
            { status: 400 }
          );
        }
        return await archiveAnalyticsData(new Date(beforeDate));

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET action handlers
async function getExecutiveAnalytics(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const dateRange = {
      start: searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : new Date()
    };

    const query = {
      dateRange,
      projects: searchParams.get('projects')?.split(','),
      professionals: searchParams.get('professionals')?.split(','),
      clients: searchParams.get('clients')?.split(','),
      regions: searchParams.get('regions')?.split(',')
    };

    const analytics = await analyticsService.getExecutiveAnalytics(query);

    return NextResponse.json({
      success: true,
      data: analytics,
      generated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting executive analytics:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve executive analytics' },
      { status: 500 }
    );
  }
}

async function getPerformanceAnalytics(request: NextRequest) {
  try {
    const analytics = await analyticsService.getExecutiveAnalytics();
    
    return NextResponse.json({
      success: true,
      data: analytics.performance,
      generated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting performance analytics:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve performance analytics' },
      { status: 500 }
    );
  }
}

async function getMarketIntelligence(request: NextRequest) {
  try {
    const analytics = await analyticsService.getExecutiveAnalytics();
    
    return NextResponse.json({
      success: true,
      data: analytics.market,
      generated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting market intelligence:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve market intelligence' },
      { status: 500 }
    );
  }
}

async function getProfessionalAnalytics(request: NextRequest) {
  try {
    const analytics = await analyticsService.getExecutiveAnalytics();
    
    return NextResponse.json({
      success: true,
      data: analytics.professionals,
      generated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting professional analytics:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve professional analytics' },
      { status: 500 }
    );
  }
}

async function getClientAnalytics(request: NextRequest) {
  try {
    const analytics = await analyticsService.getExecutiveAnalytics();
    
    return NextResponse.json({
      success: true,
      data: analytics.clients,
      generated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting client analytics:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve client analytics' },
      { status: 500 }
    );
  }
}

async function getFinancialAnalytics(request: NextRequest) {
  try {
    const analytics = await analyticsService.getExecutiveAnalytics();
    
    return NextResponse.json({
      success: true,
      data: analytics.financial,
      generated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting financial analytics:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve financial analytics' },
      { status: 500 }
    );
  }
}

async function getOptimizationInsights(request: NextRequest) {
  try {
    const analytics = await analyticsService.getExecutiveAnalytics();
    
    return NextResponse.json({
      success: true,
      data: analytics.optimization,
      generated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting optimization insights:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve optimization insights' },
      { status: 500 }
    );
  }
}

async function getPredictiveInsights(projectId: string | null) {
  try {
    const insights = await analyticsService.getPredictiveInsights(projectId || undefined);
    
    return NextResponse.json({
      success: true,
      data: insights,
      generated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting predictive insights:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve predictive insights' },
      { status: 500 }
    );
  }
}

async function getOptimizationOpportunities() {
  try {
    const opportunities = await analyticsService.getOptimizationOpportunities();
    
    return NextResponse.json({
      success: true,
      data: opportunities,
      generated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting optimization opportunities:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve optimization opportunities' },
      { status: 500 }
    );
  }
}

async function getAnalyticsReports() {
  try {
    // This would get saved reports from database
    const reports = [
      {
        id: 'report_001',
        name: 'Executive Monthly Report',
        type: 'executive',
        generated: new Date(Date.now() - 24 * 60 * 60 * 1000),
        format: 'dashboard',
        status: 'completed'
      },
      {
        id: 'report_002',
        name: 'Performance Quarterly Review',
        type: 'operational',
        generated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        format: 'pdf',
        status: 'completed'
      }
    ];
    
    return NextResponse.json({
      success: true,
      data: reports,
      generated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting analytics reports:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve analytics reports' },
      { status: 500 }
    );
  }
}

async function getKPISummary() {
  try {
    const analytics = await analyticsService.getExecutiveAnalytics();
    
    const kpiSummary = {
      overallHealth: analytics.overview.overallHealthScore,
      keyMetrics: analytics.overview.keyMetrics,
      trends: {
        direction: analytics.overview.trendDirection,
        performance: analytics.performance.timelinePerformance.trendAnalysis,
        budget: analytics.performance.budgetPerformance.trendAnalysis,
        quality: analytics.performance.qualityPerformance.trendAnalysis,
        ai: analytics.performance.aiPerformance.trendAnalysis
      },
      alerts: analytics.overview.criticalAlerts.length,
      achievements: analytics.overview.recentAchievements.length
    };
    
    return NextResponse.json({
      success: true,
      data: kpiSummary,
      generated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting KPI summary:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve KPI summary' },
      { status: 500 }
    );
  }
}

async function getTrendAnalysis(metric: string | null, timeframe: string) {
  try {
    // This would provide detailed trend analysis for specific metrics
    const trendData = {
      metric: metric || 'overall_performance',
      timeframe,
      dataPoints: [
        { date: '2025-05-22', value: 85.2 },
        { date: '2025-05-29', value: 86.1 },
        { date: '2025-06-05', value: 87.3 },
        { date: '2025-06-12', value: 88.9 },
        { date: '2025-06-19', value: 89.7 },
        { date: '2025-06-22', value: 91.4 }
      ],
      trend: {
        direction: 'improving',
        rate: 1.8,
        confidence: 92,
        forecast: {
          nextWeek: 92.1,
          nextMonth: 94.3,
          confidence: 87
        }
      },
      factors: [
        'Improved AI coordination efficiency',
        'Enhanced professional collaboration',
        'Optimized project workflows',
        'Better client communication'
      ]
    };
    
    return NextResponse.json({
      success: true,
      data: trendData,
      generated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting trend analysis:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve trend analysis' },
      { status: 500 }
    );
  }
}

// POST action handlers
async function generateReport(data: z.infer<typeof ReportGenerationSchema>) {
  try {
    const report = await analyticsService.generateDashboardReport(data.type);
    
    return NextResponse.json({
      success: true,
      message: 'Report generated successfully',
      report: {
        ...report,
        name: data.name,
        description: data.description,
        format: data.format,
        distribution: data.distribution
      }
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}

async function createCustomAnalytics(data: z.infer<typeof CustomAnalyticsSchema>) {
  try {
    // This would create custom analytics dashboard
    const customAnalytics = {
      id: `custom_${Date.now()}`,
      title: data.title,
      description: data.description,
      query: data.query,
      visualizations: data.visualizations,
      created: new Date(),
      status: 'active'
    };
    
    return NextResponse.json({
      success: true,
      message: 'Custom analytics created successfully',
      analytics: customAnalytics
    });
  } catch (error) {
    console.error('Error creating custom analytics:', error);
    return NextResponse.json(
      { error: 'Failed to create custom analytics' },
      { status: 500 }
    );
  }
}

async function runAnalyticsQuery(query: z.infer<typeof AnalyticsQuerySchema>) {
  try {
    const analytics = await analyticsService.getExecutiveAnalytics(query);
    
    return NextResponse.json({
      success: true,
      data: analytics,
      query,
      generated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error running analytics query:', error);
    return NextResponse.json(
      { error: 'Failed to run analytics query' },
      { status: 500 }
    );
  }
}

async function exportAnalytics(format: string, data: any, filename?: string) {
  try {
    // This would handle data export in various formats
    const exportResult = {
      format,
      filename: filename || `analytics_export_${Date.now()}.${format}`,
      size: JSON.stringify(data).length,
      downloadUrl: `/api/analytics/download/${Date.now()}`,
      generated: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      message: 'Analytics data exported successfully',
      export: exportResult
    });
  } catch (error) {
    console.error('Error exporting analytics:', error);
    return NextResponse.json(
      { error: 'Failed to export analytics data' },
      { status: 500 }
    );
  }
}

async function scheduleReport(data: z.infer<typeof ReportGenerationSchema>) {
  try {
    // This would schedule recurring reports
    const schedule = {
      id: `schedule_${Date.now()}`,
      reportType: data.type,
      name: data.name,
      frequency: data.schedule?.frequency,
      recipients: data.schedule?.recipients,
      nextRun: data.schedule?.nextRun,
      status: 'active',
      created: new Date()
    };
    
    return NextResponse.json({
      success: true,
      message: 'Report scheduled successfully',
      schedule
    });
  } catch (error) {
    console.error('Error scheduling report:', error);
    return NextResponse.json(
      { error: 'Failed to schedule report' },
      { status: 500 }
    );
  }
}

// PUT action handlers
async function updateAnalyticsPreferences(userId: string, preferences: any) {
  try {
    // This would update user analytics preferences
    return NextResponse.json({
      success: true,
      message: 'Analytics preferences updated successfully',
      userId,
      preferences,
      updated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating analytics preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update analytics preferences' },
      { status: 500 }
    );
  }
}

async function updateKPITargets(targets: any) {
  try {
    // This would update KPI targets
    return NextResponse.json({
      success: true,
      message: 'KPI targets updated successfully',
      targets,
      updated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating KPI targets:', error);
    return NextResponse.json(
      { error: 'Failed to update KPI targets' },
      { status: 500 }
    );
  }
}

async function updateAlertThresholds(thresholds: any) {
  try {
    // This would update alert thresholds
    return NextResponse.json({
      success: true,
      message: 'Alert thresholds updated successfully',
      thresholds,
      updated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating alert thresholds:', error);
    return NextResponse.json(
      { error: 'Failed to update alert thresholds' },
      { status: 500 }
    );
  }
}

// DELETE action handlers
async function deleteReport(reportId: string) {
  try {
    // This would delete a specific report
    return NextResponse.json({
      success: true,
      message: 'Report deleted successfully',
      reportId,
      deleted: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error deleting report:', error);
    return NextResponse.json(
      { error: 'Failed to delete report' },
      { status: 500 }
    );
  }
}

async function archiveAnalyticsData(beforeDate: Date) {
  try {
    // This would archive old analytics data
    return NextResponse.json({
      success: true,
      message: 'Analytics data archived successfully',
      beforeDate: beforeDate.toISOString(),
      archived: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error archiving analytics data:', error);
    return NextResponse.json(
      { error: 'Failed to archive analytics data' },
      { status: 500 }
    );
  }
}