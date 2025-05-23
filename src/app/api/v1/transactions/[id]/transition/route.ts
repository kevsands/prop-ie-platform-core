type Props = {
  params: Promise<{ id: string }>
}

/**
 * Transaction Transition API - Move transactions between phases
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authOptions } from '@/lib/auth-options';
import { Logger } from '@/utils/logger';
import { TransactionEngine, TransactionPhase } from '@/services/transaction/engine';

const prisma = new PrismaClient();
const logger = new Logger('api-transaction-transition');
const transactionEngine = new TransactionEngine();

// Validation schema
const TransitionSchema = z.object({
  newPhase: z.nativeEnum(TransactionPhase),
  notes: z.string().optional(),
  DevelopmentDocument: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional()
});

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: any = await request.json();
    const validation = TransitionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { newPhase, notes, documents, metadata } = validation.data;

    // Check permissions
    const transaction = await prisma.sale.findUnique({
      where: { id: params.id },
      include: {
        sellingAgent: true
      }
    });

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Check role-based permissions for transitions
    const canTransition = await checkTransitionPermissions(
      session.user,
      transaction,
      newPhase
    );

    if (!canTransition) {
      return NextResponse.json(
        { error: 'You do not have permission to make this transition' },
        { status: 403 }
      );
    }

    // Perform transition
    await transactionEngine.transition({
      saleId: params.id,
      newPhase,
      notes,
      documents,
      metadata,
      userId: session.user.id
    });

    // Get updated transaction
    const updatedTransaction = await prisma.sale.findUnique({
      where: { id: params.id },
      include: {
        timeline: true,
        statusHistory: {
          orderBy: { timestamp: 'desc' },
          take: 1
        }
      }
    });

    logger.info('Transaction transitioned', {
      saleId: params.id,
      fromPhase: transaction.status,
      toPhase: newPhase,
      userId: session.user.id
    });

    return NextResponse.json({
      success: true,
      transaction: updatedTransaction,
      transition: {
        from: transaction.status,
        to: newPhase,
        timestamp: new Date()
      }
    });

  } catch (error) {
    logger.error('Failed to transition transaction:', error);
    return NextResponse.json(
      { error: 'Failed to transition transaction', message: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * Check if user has permission to make a specific transition
 */
async function checkTransitionPermissions(
  user: any,
  transaction: any,
  newPhase: TransactionPhase
): Promise<boolean> {
  const userRole = user.role;
  const currentPhase = transaction.status as TransactionPhase;

  // Admins can make any transition
  if (userRole === 'ADMIN') {
    return true;
  }

  // Role-based transition permissions
  const permissions: Record<string, Partial<Record<TransactionPhase, TransactionPhase[]>>> = {
    BUYER: {
      [TransactionPhase.VIEWED]: [TransactionPhase.RESERVATION],
      [TransactionPhase.CONTRACT_ISSUED]: [TransactionPhase.CONTRACT_SIGNED],
      [TransactionPhase.MORTGAGE_APPROVED]: [TransactionPhase.CLOSING]
    },
    AGENT: {
      [TransactionPhase.ENQUIRY]: [TransactionPhase.VIEWING_SCHEDULED, TransactionPhase.CANCELLED],
      [TransactionPhase.VIEWING_SCHEDULED]: [TransactionPhase.VIEWED, TransactionPhase.CANCELLED],
      [TransactionPhase.VIEWED]: [TransactionPhase.RESERVATION, TransactionPhase.CANCELLED],
      [TransactionPhase.RESERVATION]: [TransactionPhase.CONTRACT_ISSUED, TransactionPhase.CANCELLED],
      [TransactionPhase.CONTRACT_SIGNED]: [TransactionPhase.DEPOSIT_PAID],
      [TransactionPhase.DEPOSIT_PAID]: [TransactionPhase.MORTGAGE_APPROVED],
      [TransactionPhase.CLOSING]: [TransactionPhase.COMPLETED],
      [TransactionPhase.COMPLETED]: [TransactionPhase.HANDED_OVER]
    },
    SOLICITOR: {
      [TransactionPhase.CONTRACT_ISSUED]: [TransactionPhase.CONTRACT_SIGNED],
      [TransactionPhase.MORTGAGE_APPROVED]: [TransactionPhase.CLOSING],
      [TransactionPhase.CLOSING]: [TransactionPhase.COMPLETED]
    },
    DEVELOPER: {
      [TransactionPhase.RESERVATION]: [TransactionPhase.CONTRACT_ISSUED],
      [TransactionPhase.COMPLETED]: [TransactionPhase.HANDED_OVER]
    }
  };

  // Check if user's role has permissions for this transition
  const rolePermissions = permissions[userRole];
  if (!rolePermissions) {
    return false;
  }

  const allowedTransitions = rolePermissions[currentPhase];
  if (!allowedTransitions) {
    return false;
  }

  return allowedTransitions.includes(newPhase);
}