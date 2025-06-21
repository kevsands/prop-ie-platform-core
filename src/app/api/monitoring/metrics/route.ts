import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { monitoringService, MetricType } from '@/services/monitoringService';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const metricType = searchParams.get('type') as MetricType;
    const timeRange = searchParams.get('timeRange') || '1h';
    
    // Convert time range to milliseconds
    const timeRangeMs = {
      '5m': 5 * 60 * 1000,
      '15m': 15 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000
    }[timeRange] || 60 * 60 * 1000;

    if (metricType) {
      // Get specific metric type
      const metrics = monitoringService.getMetrics(metricType, timeRangeMs);
      
      return NextResponse.json({
        data: metrics,
        metricType,
        timeRange,
        count: metrics.length,
        timestamp: new Date()
      });
    } else {
      // Get all metric types summary
      const allMetrics = Object.values(MetricType).map(type => ({
        type,
        metrics: monitoringService.getMetrics(type, timeRangeMs),
        latest: monitoringService.getMetrics(type, timeRangeMs).slice(-1)[0] || null
      }));

      return NextResponse.json({
        data: allMetrics,
        timeRange,
        timestamp: new Date()
      });
    }

  } catch (error) {
    console.error('Failed to fetch metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const metricData = await request.json();

    const {
      type,
      name,
      value,
      unit,
      source,
      tags,
      threshold
    } = metricData;

    if (!type || !name || value === undefined || !unit || !source) {
      return NextResponse.json(
        { error: 'Missing required fields: type, name, value, unit, source' },
        { status: 400 }
      );
    }

    // Record the metric
    monitoringService.recordMetric({
      type,
      name,
      value,
      unit,
      source,
      tags: tags || {},
      threshold
    });

    return NextResponse.json({
      message: 'Metric recorded successfully',
      type,
      name,
      value,
      timestamp: new Date()
    }, { status: 201 });

  } catch (error) {
    console.error('Failed to record metric:', error);
    return NextResponse.json(
      { error: 'Failed to record metric' },
      { status: 500 }
    );
  }
}