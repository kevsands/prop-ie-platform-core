import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { userService } from '@/lib/services/users-production';
import { z } from 'zod';

const prisma = new PrismaClient();

const analyticsQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  developmentId: z.string().optional(),
  userId: z.string().optional(),
  granularity: z.enum(['day', 'week', 'month']).optional().default('day'),
  metrics: z.array(z.enum(['volume', 'conversion', 'revenue', 'duration', 'extensions', 'cancellations'])).optional()
});

/**
 * GET /api/reservations/analytics - Get reservation analytics and insights
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse and validate query parameters
    const queryData = {
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
      developmentId: searchParams.get('developmentId'),
      userId: searchParams.get('userId'),
      granularity: searchParams.get('granularity') || 'day',
      metrics: searchParams.get('metrics')?.split(',') || ['volume', 'conversion', 'revenue']
    };

    const validatedQuery = analyticsQuerySchema.parse(queryData);

    // Get current user for authorization
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check permissions - analytics access requires admin or developer role
    const canViewAnalytics = isAdmin(currentUser) || 
                            currentUser.roles?.includes('DEVELOPER') ||
                            currentUser.roles?.includes('ESTATE_AGENT');

    if (!canViewAnalytics) {
      return NextResponse.json(
        { error: 'Insufficient permissions for analytics access' },
        { status: 403 }
      );
    }

    // Set default date range (last 30 days)
    const endDate = validatedQuery.endDate ? new Date(validatedQuery.endDate) : new Date();
    const startDate = validatedQuery.startDate ? new Date(validatedQuery.startDate) : 
                     new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Build base filter
    const baseFilter: any = {
      created: {
        gte: startDate,
        lte: endDate
      }
    };

    if (validatedQuery.developmentId) {
      baseFilter.developmentId = validatedQuery.developmentId;
    }

    if (validatedQuery.userId) {
      baseFilter.userId = validatedQuery.userId;
    }

    // Generate analytics data
    const analytics = await generateReservationAnalytics(
      baseFilter, 
      validatedQuery.metrics, 
      validatedQuery.granularity,
      startDate,
      endDate
    );

    return NextResponse.json({
      success: true,
      data: analytics,
      meta: {
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        },
        filters: {
          developmentId: validatedQuery.developmentId,
          userId: validatedQuery.userId
        },
        granularity: validatedQuery.granularity,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error generating reservation analytics:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid query parameters', 
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate analytics' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Helper functions
async function getCurrentUser(request: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
      const authToken = request.cookies.get('auth-token')?.value;
      if (authToken?.startsWith('dev-token-')) {
        const userId = authToken.replace('dev-token-', '');
        return await userService.getUserById(userId);
      }
    } else {
      return await userService.getCurrentUser();
    }
  } catch (error) {
    console.error('Error getting current user:', error);
  }
  return null;
}

function isAdmin(user: any): boolean {
  return user?.roles?.includes('ADMIN') || user?.roles?.includes('SUPER_ADMIN');
}

async function generateReservationAnalytics(
  baseFilter: any, 
  requestedMetrics: string[], 
  granularity: string,
  startDate: Date,
  endDate: Date
) {
  const analytics: any = {
    overview: {},
    timeSeries: {},
    breakdown: {},
    insights: []
  };

  // Generate overview metrics
  if (requestedMetrics.includes('volume')) {
    analytics.overview.volume = await generateVolumeMetrics(baseFilter);
  }

  if (requestedMetrics.includes('conversion')) {
    analytics.overview.conversion = await generateConversionMetrics(baseFilter);
  }

  if (requestedMetrics.includes('revenue')) {
    analytics.overview.revenue = await generateRevenueMetrics(baseFilter);
  }

  if (requestedMetrics.includes('duration')) {
    analytics.overview.duration = await generateDurationMetrics(baseFilter);
  }

  if (requestedMetrics.includes('extensions')) {
    analytics.overview.extensions = await generateExtensionMetrics(baseFilter);
  }

  if (requestedMetrics.includes('cancellations')) {
    analytics.overview.cancellations = await generateCancellationMetrics(baseFilter);
  }

  // Generate time series data
  analytics.timeSeries = await generateTimeSeriesData(baseFilter, requestedMetrics, granularity, startDate, endDate);

  // Generate breakdown analysis
  analytics.breakdown = await generateBreakdownAnalysis(baseFilter);

  // Generate insights and recommendations
  analytics.insights = await generateInsights(analytics);

  return analytics;
}

async function generateVolumeMetrics(baseFilter: any) {
  const [
    totalReservations,
    activeReservations,
    completedReservations,
    previousPeriodTotal
  ] = await Promise.all([
    prisma.reservation.count({ where: baseFilter }),
    prisma.reservation.count({ 
      where: { ...baseFilter, status: 'ACTIVE' }
    }),
    prisma.reservation.count({ 
      where: { ...baseFilter, status: 'COMPLETED' }
    }),
    prisma.reservation.count({
      where: {
        ...baseFilter,
        created: {
          gte: new Date(baseFilter.created.gte.getTime() - (baseFilter.created.lte.getTime() - baseFilter.created.gte.getTime())),
          lt: baseFilter.created.gte
        }
      }
    })
  ]);

  const growthRate = previousPeriodTotal > 0 ? 
    ((totalReservations - previousPeriodTotal) / previousPeriodTotal) * 100 : 
    0;

  return {
    total: totalReservations,
    active: activeReservations,
    completed: completedReservations,
    cancelled: totalReservations - activeReservations - completedReservations,
    growthRate: Math.round(growthRate * 100) / 100,
    completionRate: totalReservations > 0 ? Math.round((completedReservations / totalReservations) * 100) : 0
  };
}

async function generateConversionMetrics(baseFilter: any) {
  // Get conversion funnel data
  const funnelData = await prisma.reservation.groupBy({
    by: ['status'],
    where: baseFilter,
    _count: true
  });

  const statusCounts = funnelData.reduce((acc, item) => {
    acc[item.status] = item._count;
    return acc;
  }, {} as any);

  const totalViews = statusCounts.ACTIVE + statusCounts.COMPLETED + statusCounts.CANCELLED + statusCounts.PENDING || 0;
  const conversions = statusCounts.COMPLETED || 0;

  return {
    funnel: {
      views: totalViews,
      reservations: statusCounts.ACTIVE || 0,
      completions: conversions
    },
    rates: {
      reservationRate: totalViews > 0 ? Math.round((statusCounts.ACTIVE / totalViews) * 100) : 0,
      completionRate: totalViews > 0 ? Math.round((conversions / totalViews) * 100) : 0,
      cancellationRate: totalViews > 0 ? Math.round(((statusCounts.CANCELLED || 0) / totalViews) * 100) : 0
    }
  };
}

async function generateRevenueMetrics(baseFilter: any) {
  const revenueData = await prisma.reservation.aggregate({
    where: baseFilter,
    _sum: {
      reservationFeeAmount: true,
      totalPropertyPrice: true,
      amountPaid: true
    },
    _avg: {
      reservationFeeAmount: true,
      totalPropertyPrice: true
    }
  });

  const completedReservations = await prisma.reservation.aggregate({
    where: {
      ...baseFilter,
      status: 'COMPLETED'
    },
    _sum: {
      totalPropertyPrice: true
    },
    _count: true
  });

  return {
    totalFees: revenueData._sum.reservationFeeAmount || 0,
    totalPropertyValue: revenueData._sum.totalPropertyPrice || 0,
    totalPaid: revenueData._sum.amountPaid || 0,
    averageFee: Math.round(revenueData._avg.reservationFeeAmount || 0),
    averagePropertyValue: Math.round(revenueData._avg.totalPropertyPrice || 0),
    completedValue: completedReservations._sum.totalPropertyPrice || 0,
    completedCount: completedReservations._count
  };
}

async function generateDurationMetrics(baseFilter: any) {
  const reservations = await prisma.reservation.findMany({
    where: {
      ...baseFilter,
      status: 'COMPLETED'
    },
    select: {
      created: true,
      lastUpdated: true,
      expiresAt: true
    }
  });

  if (reservations.length === 0) {
    return {
      averageDays: 0,
      medianDays: 0,
      minDays: 0,
      maxDays: 0,
      distribution: {}
    };
  }

  const durations = reservations.map(r => {
    const start = new Date(r.created);
    const end = new Date(r.lastUpdated);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  });

  durations.sort((a, b) => a - b);

  return {
    averageDays: Math.round(durations.reduce((sum, d) => sum + d, 0) / durations.length),
    medianDays: durations[Math.floor(durations.length / 2)],
    minDays: durations[0],
    maxDays: durations[durations.length - 1],
    distribution: {
      '0-7 days': durations.filter(d => d <= 7).length,
      '8-30 days': durations.filter(d => d > 7 && d <= 30).length,
      '31-60 days': durations.filter(d => d > 30 && d <= 60).length,
      '60+ days': durations.filter(d => d > 60).length
    }
  };
}

async function generateExtensionMetrics(baseFilter: any) {
  const extensions = await prisma.reservationExtension.findMany({
    where: {
      Reservation: baseFilter
    },
    include: {
      Reservation: {
        select: { id: true }
      }
    }
  });

  const approved = extensions.filter(e => e.status === 'APPROVED');
  const rejected = extensions.filter(e => e.status === 'REJECTED');
  const pending = extensions.filter(e => e.status === 'PENDING');

  return {
    total: extensions.length,
    approved: approved.length,
    rejected: rejected.length,
    pending: pending.length,
    approvalRate: extensions.length > 0 ? Math.round((approved.length / extensions.length) * 100) : 0,
    averageDaysRequested: extensions.length > 0 ? 
      Math.round(extensions.reduce((sum, e) => sum + e.requestedDays, 0) / extensions.length) : 0,
    averageDaysApproved: approved.length > 0 ? 
      Math.round(approved.reduce((sum, e) => sum + (e.approvedDays || 0), 0) / approved.length) : 0
  };
}

async function generateCancellationMetrics(baseFilter: any) {
  const cancellations = await prisma.reservation.findMany({
    where: {
      ...baseFilter,
      status: 'CANCELLED'
    },
    select: {
      created: true,
      lastUpdated: true,
      metadata: true
    }
  });

  const reasonBreakdown: any = {};
  cancellations.forEach(c => {
    const reason = c.metadata?.cancellationReason || 'Unknown';
    reasonBreakdown[reason] = (reasonBreakdown[reason] || 0) + 1;
  });

  return {
    total: cancellations.length,
    reasonBreakdown,
    averageTimeToCancel: cancellations.length > 0 ? 
      Math.round(cancellations.reduce((sum, c) => {
        return sum + ((new Date(c.lastUpdated).getTime() - new Date(c.created).getTime()) / (1000 * 60 * 60 * 24));
      }, 0) / cancellations.length) : 0
  };
}

async function generateTimeSeriesData(
  baseFilter: any, 
  metrics: string[], 
  granularity: string, 
  startDate: Date, 
  endDate: Date
) {
  const timeSeries: any = {};
  
  // Generate date intervals based on granularity
  const intervals = generateDateIntervals(startDate, endDate, granularity);
  
  for (const metric of metrics) {
    timeSeries[metric] = [];
    
    for (const interval of intervals) {
      const intervalFilter = {
        ...baseFilter,
        created: {
          gte: interval.start,
          lt: interval.end
        }
      };
      
      let value = 0;
      
      switch (metric) {
        case 'volume':
          value = await prisma.reservation.count({ where: intervalFilter });
          break;
        case 'revenue':
          const revenueSum = await prisma.reservation.aggregate({
            where: intervalFilter,
            _sum: { reservationFeeAmount: true }
          });
          value = revenueSum._sum.reservationFeeAmount || 0;
          break;
        // Add more metrics as needed
      }
      
      timeSeries[metric].push({
        date: interval.start.toISOString(),
        value
      });
    }
  }
  
  return timeSeries;
}

async function generateBreakdownAnalysis(baseFilter: any) {
  const [
    statusBreakdown,
    typeBreakdown,
    developmentBreakdown
  ] = await Promise.all([
    prisma.reservation.groupBy({
      by: ['status'],
      where: baseFilter,
      _count: true
    }),
    prisma.reservation.groupBy({
      by: ['reservationType'],
      where: baseFilter,
      _count: true
    }),
    prisma.reservation.groupBy({
      by: ['developmentId'],
      where: baseFilter,
      _count: true,
      _sum: { totalPropertyPrice: true },
      orderBy: { _count: { _all: 'desc' } },
      take: 10
    })
  ]);

  return {
    byStatus: statusBreakdown.map(item => ({
      status: item.status,
      count: item._count
    })),
    byType: typeBreakdown.map(item => ({
      type: item.reservationType,
      count: item._count
    })),
    byDevelopment: developmentBreakdown.map(item => ({
      developmentId: item.developmentId,
      count: item._count,
      totalValue: item._sum.totalPropertyPrice || 0
    }))
  };
}

async function generateInsights(analytics: any) {
  const insights = [];

  // Volume insights
  if (analytics.overview.volume) {
    if (analytics.overview.volume.growthRate > 20) {
      insights.push({
        type: 'positive',
        category: 'volume',
        title: 'Strong Growth',
        description: `Reservations increased by ${analytics.overview.volume.growthRate}% compared to previous period`,
        priority: 'high'
      });
    } else if (analytics.overview.volume.growthRate < -10) {
      insights.push({
        type: 'negative',
        category: 'volume',
        title: 'Declining Volume',
        description: `Reservations decreased by ${Math.abs(analytics.overview.volume.growthRate)}% compared to previous period`,
        priority: 'high'
      });
    }
  }

  // Conversion insights
  if (analytics.overview.conversion) {
    if (analytics.overview.conversion.rates.completionRate < 60) {
      insights.push({
        type: 'warning',
        category: 'conversion',
        title: 'Low Completion Rate',
        description: `Only ${analytics.overview.conversion.rates.completionRate}% of reservations complete successfully`,
        priority: 'medium'
      });
    }
  }

  // Extension insights
  if (analytics.overview.extensions) {
    if (analytics.overview.extensions.approvalRate < 70) {
      insights.push({
        type: 'warning',
        category: 'extensions',
        title: 'High Extension Rejection Rate',
        description: `${100 - analytics.overview.extensions.approvalRate}% of extension requests are rejected`,
        priority: 'medium'
      });
    }
  }

  return insights;
}

function generateDateIntervals(startDate: Date, endDate: Date, granularity: string) {
  const intervals = [];
  const current = new Date(startDate);
  
  while (current < endDate) {
    const intervalStart = new Date(current);
    let intervalEnd: Date;
    
    switch (granularity) {
      case 'day':
        intervalEnd = new Date(current.getTime() + 24 * 60 * 60 * 1000);
        current.setDate(current.getDate() + 1);
        break;
      case 'week':
        intervalEnd = new Date(current.getTime() + 7 * 24 * 60 * 60 * 1000);
        current.setDate(current.getDate() + 7);
        break;
      case 'month':
        intervalEnd = new Date(current.getFullYear(), current.getMonth() + 1, 1);
        current.setMonth(current.getMonth() + 1);
        break;
      default:
        intervalEnd = new Date(current.getTime() + 24 * 60 * 60 * 1000);
        current.setDate(current.getDate() + 1);
    }
    
    intervals.push({
      start: intervalStart,
      end: intervalEnd < endDate ? intervalEnd : endDate
    });
  }
  
  return intervals;
}