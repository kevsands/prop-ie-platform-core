import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth.config';
import { PrismaClient } from '@prisma/slp-client';

const prisma = new PrismaClient();

/**
 * GET /api/transactions/[id]
 * Get a specific transaction by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: params.id },
      include: {
        project: true,
        milestones: true,
        participants: true,
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Check if user has access to this transaction
    const isParticipant = transaction.participants.some(
      p => p.userId === session.user?.id
    );

    if (!isParticipant && session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/transactions/[id]
 * Update a specific transaction
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { status, notes } = body;

    // Check if user has permission to update
    const transaction = await prisma.transaction.findUnique({
      where: { id: params.id },
      include: { participants: true },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    const isParticipant = transaction.participants.some(
      p => p.userId === session.user?.id
    );

    if (!isParticipant && session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Update transaction
    const updatedTransaction = await prisma.transaction.update({
      where: { id: params.id },
      data: {
        status,
        ...(notes && { metadata: { notes } }),
      },
      include: {
        project: true,
        milestones: true,
        participants: true,
      },
    });

    return NextResponse.json(updatedTransaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/transactions/[id]
 * Cancel a transaction
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user has permission to cancel
    const transaction = await prisma.transaction.findUnique({
      where: { id: params.id },
      include: { participants: true },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    const isOwner = transaction.buyerId === session.user?.id;
    const isDeveloper = transaction.participants.some(
      p => p.userId === session.user?.id && p.role === 'DEVELOPER'
    );

    if (!isOwner && !isDeveloper && session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Cancel transaction
    const cancelledTransaction = await prisma.transaction.update({
      where: { id: params.id },
      data: {
        status: 'CANCELLED',
        completedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: 'Transaction cancelled successfully',
      transaction: cancelledTransaction,
    });
  } catch (error) {
    console.error('Error cancelling transaction:', error);
    return NextResponse.json(
      { error: 'Failed to cancel transaction' },
      { status: 500 }
    );
  }
}