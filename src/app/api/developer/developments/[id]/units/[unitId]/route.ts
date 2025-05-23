type Props = {
  params: { id: string; unitId: string }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/developer/developments/[id]/units/[unitId] - Get a specific unit
export async function GET(
  request: NextRequest,
  props: { params: { id: string; unitId: string } }
) {
  const { id, unitId } = props.params;
  try {
    const unit = await prisma.unit.findFirst({
      where: {
        id: unitId,
        developmentId: id
      },
      include: {
        unitType: {
          include: {
            schedule: {
              orderBy: { order: 'asc' }
            }
          }
        },
        reservations: {
          orderBy: { createdAt: 'desc' }
        },
        sales: {
          orderBy: { createdAt: 'desc' }
        },
        viewings: {
          orderBy: { date: 'desc' }
        },
        customizations: {
          orderBy: { category: 'asc' }
        }
      }
    });

    if (!unit) {
      return NextResponse.json(
        { error: 'Unit not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ unit });
  } catch (error) {

    return NextResponse.json(
      { error: 'Failed to fetch unit' },
      { status: 500 }
    );
  }
}

// PUT /api/developer/developments/[id]/units/[unitId] - Update a unit
export async function PUT(
  request: NextRequest,
  props: { params: { id: string; unitId: string } }
) {
  const { id, unitId } = props.params;
  try {
    const body: any = await request.json();

    // Get current unit status
    const currentUnit = await prisma.unit.findUnique({
      where: { id: unitId }
    });

    if (!currentUnit) {
      return NextResponse.json(
        { error: 'Unit not found' },
        { status: 404 }
      );
    }

    const unit = await prisma.unit.update({
      where: {
        id: unitId
      },
      data: body
    });

    // Update development counts if status changed
    if (currentUnit.status !== unit.status) {
      const statusUpdates: any = {};

      // Decrement old status
      if (currentUnit.status === 'AVAILABLE') statusUpdates.availableUnits = { decrement: 1 };
      if (currentUnit.status === 'RESERVED') statusUpdates.reservedUnits = { decrement: 1 };
      if (currentUnit.status === 'SOLD') statusUpdates.soldUnits = { decrement: 1 };

      // Increment new status
      if (unit.status === 'AVAILABLE') statusUpdates.availableUnits = { increment: 1 };
      if (unit.status === 'RESERVED') statusUpdates.reservedUnits = { increment: 1 };
      if (unit.status === 'SOLD') statusUpdates.soldUnits = { increment: 1 };

      await prisma.development.update({
        where: { id },
        data: statusUpdates
      });

      // Update unit type counts
      const unitTypeUpdates: any = {};
      if (currentUnit.status === 'AVAILABLE') unitTypeUpdates.availableUnits = { decrement: 1 };
      if (unit.status === 'AVAILABLE') unitTypeUpdates.availableUnits = { increment: 1 };

      if (Object.keys(unitTypeUpdates).length> 0 && unit.unitTypeId) {
        await prisma.unitType.update({
          where: { id: unit.unitTypeId },
          data: unitTypeUpdates
        });
      }
    }

    return NextResponse.json({ unit });
  } catch (error) {

    return NextResponse.json(
      { error: 'Failed to update unit' },
      { status: 500 }
    );
  }
}