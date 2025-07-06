/**
 * API Route: /api/analytics/metrics/batch
 * Handles batch performance metric submissions for improved efficiency
 */

import { NextRequest, NextResponse } from 'next/server';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  page?: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

interface BatchMetricsRequest {
  metrics: PerformanceMetric[];
}

export async function POST(request: NextRequest) {
  try {
    const { metrics }: BatchMetricsRequest = await request.json();
    
    if (!Array.isArray(metrics) || metrics.length === 0) {
      return NextResponse.json(
        { error: 'Invalid metrics array' },
        { status: 400 }
      );
    }

    // Validate each metric
    const validMetrics = metrics.filter(metric => 
      metric.name && 
      typeof metric.value === 'number' && 
      metric.timestamp
    );

    if (validMetrics.length !== metrics.length) {
      console.warn(`Filtered ${metrics.length - validMetrics.length} invalid metrics`);
    }

    // Process metrics by type for better insights
    const metricsByType = validMetrics.reduce((acc, metric) => {
      if (!acc[metric.name]) {
        acc[metric.name] = [];
      }
      acc[metric.name].push(metric);
      return acc;
    }, {} as Record<string, PerformanceMetric[]>);

    // Log aggregated data for immediate insights
    for (const [metricType, typeMetrics] of Object.entries(metricsByType)) {
      const avgValue = typeMetrics.reduce((sum, m) => sum + m.value, 0) / typeMetrics.length;
      const timeSpan = typeMetrics.length > 1 ? 
        Math.max(...typeMetrics.map(m => m.timestamp)) - Math.min(...typeMetrics.map(m => m.timestamp)) : 0;

      console.log(`Analytics [${metricType}]:`, {
        count: typeMetrics.length,
        avgValue: Math.round(avgValue),
        timeSpan: timeSpan > 0 ? `${Math.round(timeSpan / 1000)}s` : '0s',
        pages: [...new Set(typeMetrics.map(m => m.page).filter(Boolean))],
        sessions: [...new Set(typeMetrics.map(m => m.sessionId).filter(Boolean))].length
      });
    }

    // TODO: Implement database batch insert for production
    // await prisma.analyticsEvent.createMany({
    //   data: validMetrics.map(metric => ({
    //     event: metric.name,
    //     properties: {
    //       value: metric.value,
    //       page: metric.page,
    //       userId: metric.userId,
    //       sessionId: metric.sessionId,
    //       ...metric.metadata
    //     },
    //     userId: metric.userId,
    //     sessionId: metric.sessionId,
    //     createdAt: new Date(metric.timestamp)
    //   }))
    // });

    return NextResponse.json({
      success: true,
      processed: validMetrics.length,
      rejected: metrics.length - validMetrics.length,
      metricTypes: Object.keys(metricsByType)
    });
  } catch (error) {
    console.error('Error processing batch metrics:', error);
    return NextResponse.json(
      { error: 'Failed to process batch metrics' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('sessionId');
    const page = url.searchParams.get('page');
    const startTime = url.searchParams.get('startTime');
    const endTime = url.searchParams.get('endTime');

    // TODO: Implement batch metrics retrieval with filters
    // For now, return analytics summary
    const mockSummary = {
      totalMetrics: 1247,
      uniqueSessions: 34,
      topPages: [
        { page: '/developer/projects/fitzgerald-gardens', views: 89, avgLoadTime: 1250 },
        { page: '/developments', views: 67, avgLoadTime: 890 },
        { page: '/buyer/first-time-buyers/welcome', views: 45, avgLoadTime: 1100 }
      ],
      webVitalsAverage: {
        LCP: 1340,
        FID: 12,
        CLS: 0.05,
        score: 85
      },
      errorRate: 0.02,
      avgApiResponseTime: 340
    };

    return NextResponse.json({
      summary: mockSummary,
      filters: {
        sessionId,
        page,
        timeRange: startTime && endTime ? { startTime, endTime } : null
      }
    });
  } catch (error) {
    console.error('Error retrieving batch metrics:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve batch metrics' },
      { status: 500 }
    );
  }
}