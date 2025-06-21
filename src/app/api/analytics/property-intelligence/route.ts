import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-server';
import { PrismaClient } from '@prisma/client';
import { subDays, subMonths, startOfMonth, endOfMonth } from 'date-fns';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Allow access with dev token for testing
    const devToken = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!session?.user?.id && devToken !== 'dev-mode-dummy-token') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get('timeRange') || '30d';
    const developmentFilter = searchParams.get('development') || 'all';

    // Calculate date range
    let fromDate: Date;
    let toDate = new Date();

    switch (timeRange) {
      case '7d':
        fromDate = subDays(toDate, 7);
        break;
      case '30d':
        fromDate = subDays(toDate, 30);
        break;
      case '90d':
        fromDate = subDays(toDate, 90);
        break;
      case '1y':
        fromDate = subDays(toDate, 365);
        break;
      default:
        fromDate = subDays(toDate, 30);
    }

    // Get comprehensive analytics data
    const [
      developments,
      units,
      transactions,
      users,
      customizationSelections,
      unitCustomizations
    ] = await Promise.all([
      // All developments
      prisma.development.findMany({
        include: {
          location: true,
          developer: true,
          units: {
            include: {
              transactions: true
            }
          }
        }
      }),

      // All units with details
      prisma.unit.findMany({
        include: {
          development: true,
          unitType: true,
          transactions: {
            where: {
              createdAt: {
                gte: fromDate,
                lte: toDate
              }
            }
          },
          customizationOptions: true
        }
      }),

      // Recent transactions
      prisma.transaction.findMany({
        where: {
          createdAt: {
            gte: fromDate,
            lte: toDate
          }
        },
        include: {
          buyer: true,
          unit: {
            include: {
              development: true
            }
          }
        }
      }),

      // Users for conversion analysis
      prisma.user.findMany({
        where: {
          createdAt: {
            gte: fromDate,
            lte: toDate
          }
        }
      }),

      // Customization selections
      prisma.customizationSelection.findMany({
        where: {
          createdAt: {
            gte: fromDate,
            lte: toDate
          }
        },
        include: {
          selections: {
            include: {
              option: true
            }
          }
        }
      }),

      // Unit customization options for popularity analysis
      prisma.unitCustomizationOption.findMany({
        include: {
          _count: {
            select: {
              selectedOptions: true
            }
          }
        }
      })
    ]);

    // Calculate portfolio metrics
    const totalPropertyValue = units.reduce((sum, unit) => sum + (unit.basePrice || 0), 0);
    
    const availableUnits = units.filter(unit => unit.status === 'AVAILABLE').length;
    const reservedUnits = units.filter(unit => unit.status === 'RESERVED').length;
    const soldUnits = units.filter(unit => unit.status === 'SOLD').length;

    // Calculate financial metrics
    const completedTransactions = transactions.filter(t => t.status === 'COMPLETED' || t.status === 'RESERVED');
    const totalRevenue = completedTransactions.reduce((sum, t) => sum + (t.agreedPrice || 0), 0);
    const avgPropertyPrice = totalRevenue > 0 ? totalRevenue / completedTransactions.length : 0;

    // Calculate customization metrics
    const totalCustomizationValue = customizationSelections.reduce((sum, selection) => sum + (selection.totalCost || 0), 0);
    const customizationUptake = transactions.length > 0 ? customizationSelections.length / transactions.length : 0;

    // Development performance analysis
    const developmentPerformance = developments.map(dev => {
      const devUnits = dev.units;
      const soldCount = devUnits.filter(unit => unit.status === 'SOLD' || unit.status === 'RESERVED').length;
      const devRevenue = devUnits
        .filter(unit => unit.status === 'SOLD' || unit.status === 'RESERVED')
        .reduce((sum, unit) => sum + (unit.basePrice || 0), 0);
      
      const avgPrice = soldCount > 0 ? devRevenue / soldCount : 0;
      
      // Calculate sales velocity (units sold per month)
      const monthsActive = Math.max(1, Math.ceil((Date.now() - new Date(dev.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30)));
      const velocity = soldCount / monthsActive;

      return {
        name: dev.name,
        totalUnits: devUnits.length,
        soldCount,
        avgPrice,
        revenue: devRevenue,
        velocity
      };
    });

    // Popular customizations analysis
    const customizationPopularity = unitCustomizations.map(option => {
      const totalSelections = option._count.selectedOptions;
      const uptake = transactions.length > 0 ? totalSelections / transactions.length : 0;
      
      return {
        name: option.name,
        uptake,
        value: option.additionalCost || 0
      };
    }).sort((a, b) => b.uptake - a.uptake).slice(0, 5);

    // Mock some metrics that would come from web analytics in production
    const websiteVisitors = Math.floor(Math.random() * 1000) + 2000; // Mock data
    const registrations = users.length;
    const propertyViews = Math.floor(websiteVisitors * 0.75); // Mock engagement
    const reservations = transactions.filter(t => t.status === 'RESERVED').length;
    const conversionRate = websiteVisitors > 0 ? registrations / websiteVisitors : 0;

    // Calculate average time to reservation
    const reservationTransactions = transactions.filter(t => t.status === 'RESERVED' && t.reservationDate);
    const avgTimeToReservation = reservationTransactions.length > 0 
      ? reservationTransactions.reduce((sum, t) => {
          const daysDiff = Math.ceil((new Date(t.reservationDate!).getTime() - new Date(t.createdAt).getTime()) / (1000 * 60 * 60 * 24));
          return sum + daysDiff;
        }, 0) / reservationTransactions.length
      : 0;

    // Buyer demographics (mock data based on Irish property market trends)
    const buyerDemographics = {
      firstTimeBuyers: 0.72, // 72% typical for new developments
      investors: 0.15,
      upgraders: 0.13
    };

    // Real-time metrics (mock for demonstration)
    const realTimeMetrics = {
      activeUsers: Math.floor(Math.random() * 30) + 10,
      currentViewers: Math.floor(Math.random() * 15) + 5,
      todayInquiries: Math.floor(Math.random() * 8) + 2,
      thisWeekReservations: transactions.filter(t => 
        t.createdAt >= subDays(new Date(), 7) && t.status === 'RESERVED'
      ).length
    };

    // Calculate revenue growth (comparing to previous period)
    const previousPeriodStart = subDays(fromDate, toDate.getTime() - fromDate.getTime());
    const previousTransactions = await prisma.transaction.findMany({
      where: {
        createdAt: {
          gte: previousPeriodStart,
          lt: fromDate
        }
      }
    });
    
    const previousRevenue = previousTransactions.reduce((sum, t) => sum + (t.agreedPrice || 0), 0);
    const revenueGrowth = previousRevenue > 0 ? (totalRevenue - previousRevenue) / previousRevenue : 0;

    const analytics = {
      // Core Business Metrics
      totalPropertyValue,
      availableInventory: availableUnits,
      reservedUnits,
      soldUnits,
      
      // Financial Performance
      totalRevenue,
      avgPropertyPrice,
      customizationUptake,
      revenueGrowth,
      
      // Sales Funnel
      websiteVisitors,
      registrations,
      propertyViews,
      reservations,
      conversionRate,
      
      // Customer Insights
      avgTimeToReservation,
      popularCustomizations: customizationPopularity,
      buyerDemographics,
      
      // Property Performance
      developmentPerformance,
      
      // Real-time Insights
      ...realTimeMetrics
    };

    return NextResponse.json({ 
      success: true,
      data: analytics,
      metadata: {
        timeRange,
        fromDate: fromDate.toISOString(),
        toDate: toDate.toISOString(),
        developmentFilter,
        dataPoints: {
          developments: developments.length,
          units: units.length,
          transactions: transactions.length,
          users: users.length
        }
      }
    });

  } catch (error) {
    console.error('Property analytics API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch property analytics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Health check endpoint
export async function HEAD() {
  return NextResponse.json({ status: 'ok' });
}