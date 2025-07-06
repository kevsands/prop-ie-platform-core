// src/lib/enterprise-data.ts
// Enterprise data service using real Prisma database

import { PrismaClient } from '@prisma/client';

// Use global prisma instance to avoid multiple connections in development
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  globalThis.prisma = prisma;
}

// Enterprise data functions

export async function getDevelopments() {
  try {
    return await prisma.development.findMany({
      where: { isPublished: true },
      include: {
        developer: true,
        location: true
      },
      orderBy: { created: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching developments:', error);
    return [];
  }
}

export async function getDevelopmentByName(name: string) {
  try {
    const development = await prisma.development.findFirst({
      where: { 
        name: {
          contains: name
        }
      },
      include: {
        developer: true,
        location: true
      }
    });

    if (development) {
      // Get units separately
      const units = await prisma.unit.findMany({
        where: { developmentId: development.id },
        orderBy: { unitNumber: 'asc' }
      });

      // Parse JSON fields and add relations
      return {
        ...development,
        images: JSON.parse(development.imagesData || '[]'),
        videos: JSON.parse(development.videosData || '[]'),
        features: JSON.parse(development.featuresData || '[]'),
        amenities: JSON.parse(development.amenitiesData || '[]'),
        tags: JSON.parse(development.tagsData || '[]'),
        awards: JSON.parse(development.awardsData || '[]'),
        units
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching development:', error);
    return null;
  }
}

export async function getFitzgeraldGardensData() {
  try {
    const development = await getDevelopmentByName('Fitzgerald Gardens');
    
    if (!development) {
      throw new Error('Fitzgerald Gardens development not found');
    }

    // Get additional stats
    const totalUnits = await prisma.unit.count({
      where: { developmentId: development.id }
    });

    const soldUnits = await prisma.unit.count({
      where: { 
        developmentId: development.id,
        status: 'SOLD'
      }
    });

    const reservedUnits = await prisma.unit.count({
      where: { 
        developmentId: development.id,
        status: 'RESERVED'
      }
    });

    const availableUnits = await prisma.unit.count({
      where: { 
        developmentId: development.id,
        status: 'AVAILABLE'
      }
    });

    // Get recent sales
    const recentSales = await prisma.sale.findMany({
      where: {
        unit: {
          developmentId: development.id
        }
      },
      include: {
        unit: true
      },
      orderBy: { created: 'desc' },
      take: 10
    });

    return {
      ...development,
      stats: {
        totalUnits,
        soldUnits,
        reservedUnits,
        availableUnits,
        completionPercentage: Math.round((soldUnits + reservedUnits) / totalUnits * 100)
      },
      recentSales: recentSales.map(sale => ({
        id: sale.id,
        unitNumber: sale.unit.unitNumber,
        buyerName: `Sale ${sale.id.slice(-6)}`, // Since we don't have buyer relation
        price: sale.totalPrice,
        status: sale.status,
        date: sale.createdAt
      }))
    };
  } catch (error) {
    console.error('Error fetching Fitzgerald Gardens data:', error);
    return null;
  }
}

export async function getUnitsForDevelopment(developmentId: string) {
  try {
    const units = await prisma.unit.findMany({
      where: { developmentId },
      include: {
        sales: true,
        reservations: true
      },
      orderBy: { unitNumber: 'asc' }
    });

    return units.map(unit => ({
      ...unit,
      images: JSON.parse(unit.imagesData || '[]'),
      floorplans: JSON.parse(unit.floorplansData || '[]'),
      features: JSON.parse(unit.featuresData || '[]'),
      sale: unit.sales[0] || null,
      reservation: unit.reservations[0] || null
    }));
  } catch (error) {
    console.error('Error fetching units:', error);
    return [];
  }
}

export async function getSalesAnalytics(developmentId?: string) {
  try {
    const whereClause = developmentId ? {
      unit: {
        developmentId: developmentId
      }
    } : {};

    const totalSales = await prisma.sale.count({ where: whereClause });
    const completedSales = await prisma.sale.count({
      where: {
        ...whereClause,
        status: 'COMPLETED'
      }
    });

    const totalValue = await prisma.sale.aggregate({
      where: {
        ...whereClause,
        status: { in: ['COMPLETED', 'CONTRACT_SIGNED'] }
      },
      _sum: {
        totalPrice: true
      }
    });

    const avgPrice = await prisma.sale.aggregate({
      where: {
        ...whereClause,
        status: { in: ['COMPLETED', 'CONTRACT_SIGNED'] }
      },
      _avg: {
        totalPrice: true
      }
    });

    // Monthly sales data for charts
    const monthlySales = await prisma.sale.groupBy({
      by: ['createdAt'],
      where: {
        ...whereClause,
        createdAt: {
          gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // Last year
        }
      },
      _count: {
        id: true
      },
      _sum: {
        totalPrice: true
      }
    });

    return {
      totalSales,
      completedSales,
      totalValue: totalValue._sum.totalPrice || 0,
      avgPrice: avgPrice._avg.totalPrice || 0,
      conversionRate: totalSales > 0 ? (completedSales / totalSales) * 100 : 0,
      monthlySales: monthlySales.map(month => ({
        date: month.createdAt,
        count: month._count.id,
        value: month._sum.totalPrice || 0
      }))
    };
  } catch (error) {
    console.error('Error fetching sales analytics:', error);
    return {
      totalSales: 0,
      completedSales: 0,
      totalValue: 0,
      avgPrice: 0,
      conversionRate: 0,
      monthlySales: []
    };
  }
}

export async function getBuyerJourneyData(buyerId: string) {
  try {
    const journey = await prisma.buyerJourney.findFirst({
      where: { buyerId },
      include: {
        buyer: true,
        milestones: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!journey) {
      return null;
    }

    return {
      ...journey,
      completedSteps: JSON.parse(journey.completedSteps || '[]'),
      preferences: JSON.parse(journey.preferences || '{}')
    };
  } catch (error) {
    console.error('Error fetching buyer journey:', error);
    return null;
  }
}

export async function getAnalyticsEvents(limit = 100) {
  try {
    return await prisma.analyticsEvent.findMany({
      orderBy: { created: 'desc' },
      take: limit
    });
  } catch (error) {
    console.error('Error fetching analytics events:', error);
    return [];
  }
}

// Helper function to check if enterprise data is available
export async function isEnterpriseDataAvailable() {
  try {
    const developmentCount = await prisma.development.count();
    return developmentCount > 0;
  } catch (error) {
    console.error('Error checking enterprise data availability:', error);
    return false;
  }
}

// Fallback to mock data if enterprise data is not available
export async function getDataWithFallback<T>(
  enterpriseDataFn: () => Promise<T>,
  mockData: T
): Promise<T> {
  try {
    const isAvailable = await isEnterpriseDataAvailable();
    if (isAvailable) {
      return await enterpriseDataFn();
    }
  } catch (error) {
    console.warn('Enterprise data unavailable, using mock data:', error);
  }
  return mockData;
}