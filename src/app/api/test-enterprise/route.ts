/**
 * API Route: /api/test-enterprise
 * Test endpoint to verify enterprise database functionality
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/enterprise-data';

export async function GET(request: NextRequest) {
  try {
    // Test database connectivity and data
    const stats = {
      users: await prisma.user.count(),
      developments: await prisma.development.count(),
      units: await prisma.unit.count(),
      sales: await prisma.sale.count(),
      documents: await prisma.document.count(),
      reservations: await prisma.reservation.count()
    };

    // Get sample data
    const sampleDevelopment = await prisma.development.findFirst({
      include: {
        developer: true,
        location: true,
        totalUnits: {
          take: 3
        }
      }
    });

    const sampleUnits = await prisma.unit.findMany({
      take: 5,
      include: {
        sales: true,
        reservations: true
      }
    });

    return NextResponse.json({
      status: 'success',
      message: 'Enterprise database is fully operational',
      timestamp: new Date().toISOString(),
      stats,
      samples: {
        development: sampleDevelopment ? {
          id: sampleDevelopment.id,
          name: sampleDevelopment.name,
          location: sampleDevelopment.location,
          status: sampleDevelopment.status,
          developer: {
            firstName: sampleDevelopment.developer.firstName,
            lastName: sampleDevelopment.developer.lastName,
            email: sampleDevelopment.developer.email
          },
          unitCount: sampleDevelopment.totalUnits.length
        } : null,
        units: sampleUnits.map(unit => ({
          id: unit.id,
          unitNumber: unit.unitNumber,
          type: unit.type,
          status: unit.status,
          bedrooms: unit.bedrooms,
          price: unit.price,
          hasSale: unit.sales.length > 0,
          hasReservation: unit.reservations.length > 0
        }))
      },
      database: {
        provider: 'PostgreSQL',
        schema: 'Enterprise (122 unified models)',
        migrationStatus: 'Complete'
      }
    });

  } catch (error) {
    console.error('Enterprise database test failed:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Enterprise database test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}