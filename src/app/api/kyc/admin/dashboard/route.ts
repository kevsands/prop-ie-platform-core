import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const dateFrom = url.searchParams.get('dateFrom');
    const dateTo = url.searchParams.get('dateTo');
    const status = url.searchParams.get('status');
    const riskLevel = url.searchParams.get('riskLevel');

    // Build date filter
    const dateFilter = dateFrom && dateTo ? {
      created: {
        gte: new Date(dateFrom),
        lte: new Date(dateTo)
      }
    } : {};

    // Build status filter
    const statusFilter = status ? { status: status as any } : {};

    // Build risk filter
    const riskFilter = riskLevel ? {
      riskScore: riskLevel === 'LOW' ? { lt: 30 } :
                  riskLevel === 'MEDIUM' ? { gte: 30, lt: 50 } :
                  riskLevel === 'HIGH' ? { gte: 50, lt: 70 } :
                  riskLevel === 'CRITICAL' ? { gte: 70 } : undefined
    } : {};

    const whereClause = {
      ...dateFilter,
      ...statusFilter,
      ...riskFilter
    };

    // Get KYC verification statistics
    const [
      totalVerifications,
      verificationsByStatus,
      verificationsByRisk,
      recentVerifications,
      complianceCheckStats,
      processingTimeStats
    ] = await Promise.all([
      // Total verifications count
      prisma.kYCVerification.count({ where: whereClause }),

      // Verifications by status
      prisma.kYCVerification.groupBy({
        by: ['status'],
        where: whereClause,
        _count: { status: true }
      }),

      // Verifications by risk level
      prisma.kYCVerification.findMany({
        where: whereClause,
        select: { riskScore: true }
      }).then(verifications => {
        const riskCounts = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0, UNKNOWN: 0 };
        verifications.forEach(v => {
          const score = v.riskScore || 0;
          if (score < 30) riskCounts.LOW++;
          else if (score < 50) riskCounts.MEDIUM++;
          else if (score < 70) riskCounts.HIGH++;
          else riskCounts.CRITICAL++;
        });
        return riskCounts;
      }),

      // Recent verifications
      prisma.kYCVerification.findMany({
        where: whereClause,
        take: 10,
        orderBy: { created: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          }
        }
      }),

      // Compliance check statistics
      prisma.kYCComplianceCheck.groupBy({
        by: ['checkType', 'result'],
        _count: { checkType: true },
        where: dateFrom && dateTo ? {
          requestedAt: {
            gte: new Date(dateFrom),
            lte: new Date(dateTo)
          }
        } : {}
      }),

      // Processing time statistics
      prisma.kYCVerification.findMany({
        where: {
          ...whereClause,
          submittedAt: { not: null },
          reviewedAt: { not: null }
        },
        select: {
          submittedAt: true,
          reviewedAt: true,
          status: true
        }
      }).then(verifications => {
        const processingTimes = verifications
          .filter(v => v.submittedAt && v.reviewedAt)
          .map(v => ({
            hours: Math.round((v.reviewedAt!.getTime() - v.submittedAt!.getTime()) / (1000 * 60 * 60)),
            status: v.status
          }));

        return {
          averageHours: processingTimes.length > 0 
            ? Math.round(processingTimes.reduce((sum, pt) => sum + pt.hours, 0) / processingTimes.length)
            : 0,
          medianHours: processingTimes.length > 0
            ? processingTimes.sort((a, b) => a.hours - b.hours)[Math.floor(processingTimes.length / 2)]?.hours || 0
            : 0,
          byStatus: processingTimes.reduce((acc, pt) => {
            acc[pt.status] = acc[pt.status] || [];
            acc[pt.status].push(pt.hours);
            return acc;
          }, {} as Record<string, number[]>)
        };
      })
    ]);

    // Calculate daily verification trends
    const dailyTrends = await getDailyVerificationTrends(dateFrom, dateTo);

    // Get pending actions
    const pendingActions = await getPendingActions();

    // Calculate success metrics
    const successMetrics = {
      approvalRate: verificationsByStatus.length > 0 
        ? Math.round((verificationsByStatus.find(s => s.status === 'APPROVED')?._count.status || 0) / totalVerifications * 100)
        : 0,
      rejectionRate: verificationsByStatus.length > 0
        ? Math.round((verificationsByStatus.find(s => s.status === 'REJECTED')?._count.status || 0) / totalVerifications * 100)
        : 0,
      averageProcessingTime: processingTimeStats.averageHours,
      slaCompliance: processingTimeStats.averageHours <= 48 ? 95 : 85 // Simplified SLA calculation
    };

    // Format response
    const dashboard = {
      summary: {
        totalVerifications,
        successMetrics,
        riskDistribution: verificationsByRisk,
        statusDistribution: verificationsByStatus.reduce((acc, curr) => {
          acc[curr.status] = curr._count.status;
          return acc;
        }, {} as Record<string, number>)
      },
      trends: {
        daily: dailyTrends,
        processing: processingTimeStats
      },
      complianceChecks: {
        summary: complianceCheckStats.reduce((acc, curr) => {
          const key = `${curr.checkType}_${curr.result}`;
          acc[key] = curr._count.checkType;
          return acc;
        }, {} as Record<string, number>),
        byType: complianceCheckStats.reduce((acc, curr) => {
          if (!acc[curr.checkType]) acc[curr.checkType] = {};
          acc[curr.checkType][curr.result] = curr._count.checkType;
          return acc;
        }, {} as Record<string, Record<string, number>>)
      },
      recentActivity: recentVerifications.map(v => ({
        id: v.id,
        user: {
          id: v.user.id,
          name: `${v.user.firstName} ${v.user.lastName}`,
          email: v.user.email
        },
        status: v.status,
        progress: v.progress,
        riskScore: v.riskScore,
        submittedAt: v.submittedAt,
        created: v.created,
        timeToProcess: v.submittedAt && v.reviewedAt 
          ? Math.round((v.reviewedAt.getTime() - v.submittedAt.getTime()) / (1000 * 60 * 60))
          : null
      })),
      pendingActions,
      alerts: generateSystemAlerts(verificationsByStatus, processingTimeStats, pendingActions)
    };

    return NextResponse.json(dashboard);

  } catch (error) {
    console.error('Error fetching KYC admin dashboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

async function getDailyVerificationTrends(dateFrom?: string | null, dateTo?: string | null) {
  const endDate = dateTo ? new Date(dateTo) : new Date();
  const startDate = dateFrom ? new Date(dateFrom) : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

  const dailyData = await prisma.kYCVerification.findMany({
    where: {
      created: {
        gte: startDate,
        lte: endDate
      }
    },
    select: {
      created: true,
      status: true
    }
  });

  // Group by day
  const dailyGroups = dailyData.reduce((acc, verification) => {
    const day = verification.created.toISOString().split('T')[0];
    if (!acc[day]) {
      acc[day] = { total: 0, approved: 0, rejected: 0, pending: 0 };
    }
    acc[day].total++;
    if (verification.status === 'APPROVED') acc[day].approved++;
    else if (verification.status === 'REJECTED') acc[day].rejected++;
    else acc[day].pending++;
    return acc;
  }, {} as Record<string, { total: number; approved: number; rejected: number; pending: number }>);

  return Object.entries(dailyGroups).map(([date, counts]) => ({
    date,
    ...counts
  })).sort((a, b) => a.date.localeCompare(b.date));
}

async function getPendingActions() {
  const [
    pendingReviews,
    expiredDocuments,
    highRiskVerifications,
    stalledVerifications
  ] = await Promise.all([
    // Pending reviews
    prisma.kYCVerification.count({
      where: { status: 'PENDING_REVIEW' }
    }),

    // Expired documents (example - this would need actual expiry logic)
    prisma.document.count({
      where: {
        category: { startsWith: 'kyc_' },
        expiryDate: { lt: new Date() }
      }
    }),

    // High risk verifications needing attention
    prisma.kYCVerification.count({
      where: {
        riskScore: { gte: 70 },
        status: { in: ['IN_PROGRESS', 'PENDING_REVIEW'] }
      }
    }),

    // Stalled verifications (older than 7 days without progress)
    prisma.kYCVerification.count({
      where: {
        status: 'IN_PROGRESS',
        created: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }
    })
  ]);

  return {
    pendingReviews,
    expiredDocuments,
    highRiskVerifications,
    stalledVerifications,
    total: pendingReviews + expiredDocuments + highRiskVerifications + stalledVerifications
  };
}

function generateSystemAlerts(
  verificationsByStatus: any[],
  processingTimeStats: any,
  pendingActions: any
) {
  const alerts = [];

  // High processing time alert
  if (processingTimeStats.averageHours > 72) {
    alerts.push({
      type: 'warning',
      title: 'High Processing Times',
      message: `Average processing time is ${processingTimeStats.averageHours} hours, exceeding SLA target of 48 hours`,
      action: 'Review workflow efficiency'
    });
  }

  // High risk verifications alert
  if (pendingActions.highRiskVerifications > 5) {
    alerts.push({
      type: 'critical',
      title: 'High Risk Verifications',
      message: `${pendingActions.highRiskVerifications} high-risk verifications require immediate attention`,
      action: 'Review high-risk cases'
    });
  }

  // Stalled verifications alert
  if (pendingActions.stalledVerifications > 10) {
    alerts.push({
      type: 'warning',
      title: 'Stalled Verifications',
      message: `${pendingActions.stalledVerifications} verifications have been in progress for over 7 days`,
      action: 'Follow up on stalled cases'
    });
  }

  // Pending reviews backlog
  if (pendingActions.pendingReviews > 20) {
    alerts.push({
      type: 'info',
      title: 'Review Backlog',
      message: `${pendingActions.pendingReviews} verifications are pending review`,
      action: 'Allocate additional review resources'
    });
  }

  return alerts;
}