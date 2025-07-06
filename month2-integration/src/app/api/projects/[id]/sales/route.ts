import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { GetHandler, IdParam } from '@/types/next-route-handlers';

/**
 * GET /api/projects/[id]/sales
 * Fetch sales data for a specific project
 */
export const GET: GetHandler<IdParam> = async (request, { params }) => {
  try {
    const session = await getServerSession(authOptions);

    // Check authentication
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const projectId = params.id as string;
    
    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Mock sales data for demonstration
    const salesData = {
      summary: {
        totalUnits: 45,
        unitsSold: 32,
        unitsReserved: 5,
        unitsAvailable: 8,
        totalValue: 12500000,
        soldValue: 8750000,
        reservedValue: 1875000,
        averageSellingPrice: 273437.5,
        projectedCompletionValue: 13200000
      },
      recentSales: [
        {
          id: 'sale-1',
          unitId: 'unit-15',
          unitName: 'Apartment 15, Block A',
          price: 275000,
          buyer: 'John & Mary Smith',
          status: 'completed',
          completionDate: '2023-10-15',
          projectId
        },
        {
          id: 'sale-2',
          unitId: 'unit-23',
          unitName: 'Apartment 23, Block B',
          price: 295000,
          buyer: 'David Wilson',
          status: 'reserved',
          reservationDate: '2023-10-28',
          projectId
        },
        {
          id: 'sale-3',
          unitId: 'unit-8',
          unitName: 'Apartment 8, Block A',
          price: 250000,
          buyer: 'Sarah Johnson',
          status: 'completed',
          completionDate: '2023-09-30',
          projectId
        }
      ],
      salesByType: [
        {
          type: '1 Bedroom',
          totalUnits: 15,
          soldUnits: 12,
          reservedUnits: 1,
          availableUnits: 2,
          priceRange: {
            min: 225000,
            max: 275000
          }
        },
        {
          type: '2 Bedroom',
          totalUnits: 20,
          soldUnits: 15,
          reservedUnits: 3,
          availableUnits: 2,
          priceRange: {
            min: 275000,
            max: 325000
          }
        },
        {
          type: '3 Bedroom',
          totalUnits: 10,
          soldUnits: 5,
          reservedUnits: 1,
          availableUnits: 4,
          priceRange: {
            min: 350000,
            max: 400000
          }
        }
      ],
      salesTimeline: {
        monthlySales: [
          { month: 'Jan 2023', units: 2, value: 550000 },
          { month: 'Feb 2023', units: 3, value: 825000 },
          { month: 'Mar 2023', units: 5, value: 1375000 },
          { month: 'Apr 2023', units: 4, value: 1100000 },
          { month: 'May 2023', units: 4, value: 1100000 },
          { month: 'Jun 2023', units: 3, value: 825000 },
          { month: 'Jul 2023', units: 2, value: 550000 },
          { month: 'Aug 2023', units: 3, value: 825000 },
          { month: 'Sep 2023', units: 4, value: 1100000 },
          { month: 'Oct 2023', units: 2, value: 550000 }
        ],
        projections: [
          { month: 'Nov 2023', units: 3, value: 825000 },
          { month: 'Dec 2023', units: 2, value: 550000 },
          { month: 'Jan 2024', units: 2, value: 550000 },
          { month: 'Feb 2024', units: 3, value: 825000 },
          { month: 'Mar 2024', units: 3, value: 825000 }
        ]
      }
    };

    return NextResponse.json(salesData);
  } catch (error) {
    console.error('Error fetching sales data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales data' },
      { status: 500 }
    );
  }
}