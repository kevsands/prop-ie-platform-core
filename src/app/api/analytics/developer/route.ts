import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-server';
import { prisma } from '@/lib/db';
import { startOfMonth, endOfMonth, subMonths, format, subDays, startOfDay, endOfDay } from 'date-fns';
import { redis } from '@/lib/redis';
import { queryCache } from '@/lib/cache/queryCache';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const from = searchParams.get('from') ? new Date(searchParams.get('from')!) : startOfMonth(new Date());
    const to = searchParams.get('to') ? new Date(searchParams.get('to')!) : endOfMonth(new Date());
    const comparison = searchParams.get('comparison') || 'month';

    // Check cache first
    const cacheKey = `analytics:developer:${session.user.id}:${from.toISOString()}:${to.toISOString()}:${comparison}`;
    const cached = await redis?.get(cacheKey);
    if (cached) {
      return NextResponse.json(JSON.parse(cached));
    }

    // Get developer's developments
    const developments = await prisma.development.findMany({
      where: {
        developerId: session.user.id},
      include: {
        units: {
          include: {
            transactions: {
              where: {
                createdAt: {
                  gte: from,
                  lte: to}}}});

    // Calculate comparison dates
    let comparisonFrom: Date;
    let comparisonTo: Date;

    switch (comparison) {
      case 'day':
        comparisonFrom = subDays(from1);
        comparisonTo = subDays(to1);
        break;
      case 'week':
        comparisonFrom = subDays(from7);
        comparisonTo = subDays(to7);
        break;
      case 'year':
        comparisonFrom = subMonths(from12);
        comparisonTo = subMonths(to12);
        break;
      default: // month
        comparisonFrom = subMonths(from1);
        comparisonTo = subMonths(to1);
    }

    // Get comparison data
    const comparisonTransactions = await prisma.transaction.findMany({
      where: {
        unit: {
          development: {
            developerId: session.user.id},
        createdAt: {
          gte: comparisonFrom,
          lte: comparisonTo}});

    // Calculate current metrics
    const currentTransactions = developments.flatMap(dev => 
      dev.units.flatMap(unit => unit.transactions)
    );

    const totalSales = currentTransactions.length;
    const totalRevenue = currentTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    const totalUnits = developments.reduce((sum, dev) => sum + dev.units.length, 0);
    const soldUnits = developments.reduce((sum, dev) => 
      sum + dev.units.filter(u => u.status === 'SOLD').length, 0
    );

    // Calculate leads and conversions
    const leads = await prisma.propertyView.count({
      where: {
        unit: {
          development: {
            developerId: session.user.id,
          },
        },
        createdAt: {
          gte: from,
          lte: to,
        },
      },
    });

    const conversionRate = leads > 0 ? (totalSales / leads) * 100 : 0;

    // Calculate average time to sale
    const salesWithTime = await prisma.transaction.findMany({
      where: {
        unit: {
          development: {
            developerId: session.user.id,
          },
        },
        status: 'COMPLETED',
        createdAt: {
          gte: from,
          lte: to,
        },
      },
      include: {
        unit: true,
      },
    });

    const avgTimeToSale = salesWithTime.length > 0
      ? salesWithTime.reduce((sum, t) => {
          const listingDate = t.unit.createdAt;
          const saleDate = t.createdAt;
          const days = Math.floor((saleDate.getTime() - listingDate.getTime()) / (1000 * 60 * 60 * 24));
          return sum + days;
        }, 0) / salesWithTime.length
      : 0;

    // Calculate comparison metrics
    const comparisonRevenue = comparisonTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    const revenueChange = comparisonRevenue > 0 
      ? ((totalRevenue - comparisonRevenue) / comparisonRevenue) * 100 
      : 0;

    // Generate revenue data for charts
    const revenueData = [];
    const currentDate = new Date(from);
    while (currentDate <= to) {
      const dayStart = startOfDay(currentDate);
      const dayEnd = endOfDay(currentDate);

      const dayRevenue = currentTransactions
        .filter(t => t.createdAt >= dayStart && t.createdAt <= dayEnd)
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      revenueData.push({
        date: format(currentDate, 'MMM d'),
        revenue: dayRevenue,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Sales by development
    const salesByDevelopment = developments.map(dev => ({
      name: dev.name,
      value: dev.units.flatMap(u => u.transactions).reduce((sum, t) => sum + (t.amount || 0), 0),
    }));

    // Cash flow calculations
    const cashFlow = await prisma.payment.aggregate({
      where: {
        transaction: {
          unit: {
            development: {
              developerId: session.user.id,
            },
          },
        },
        status: 'COMPLETED',
        createdAt: {
          gte: from,
          lte: to,
        },
      },
      _sum: {
        amount: true,
      },
    });

    const outstandingPayments = await prisma.payment.aggregate({
      where: {
        transaction: {
          unit: {
            development: {
              developerId: session.user.id}},
        status: 'PENDING'},
      _sum: {
        amount: true});

    const analytics = {
      totalSales,
      totalRevenue,
      salesChange: revenueChange,
      revenueChange,
      conversionRate,
      conversions: totalSales,
      totalLeads: leads,
      avgTimeToSale: Math.round(avgTimeToSale),
      timeToSaleChange: 0, // TODO: Calculate from comparison period
      totalUnits,
      availableUnits: totalUnits - soldUnits,
      cashFlow: cashFlow._sum.amount || 0,
      outstandingPayments: outstandingPayments._sum.amount || 0,
      projectedRevenue: totalRevenue * 3, // Simple projection
      paymentCollectionRate: 85, // TODO: Calculate actual rate
      revenueData,
      salesByDevelopment,
      cashFlowTrend: revenueData.map(d => ({ value: d.revenue })).slice(-7), // Last 7 days
    };

    // Cache for 5 minutes
    if (redis) {
      await redis.setex(cacheKey, 300, JSON.stringify(analytics));
    }

    return NextResponse.json(analytics);
  } catch (error) {

    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}