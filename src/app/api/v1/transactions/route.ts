/**
 * Transaction API - Create and list transactions
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authOptions } from '@/lib/auth-options';
import { Logger } from '@/utils/logger';
import { TransactionEngine, TransactionPhase } from '@/services/transaction/engine';

const prisma = new PrismaClient();
const logger = new Logger('api-transactions');
const transactionEngine = new TransactionEngine();

// Validation schemas
const CreateTransactionSchema = z.object({
  unitId: z.string(),
  buyerId: z.string().optional(),
  notes: z.string().optional()
});

const ListTransactionsSchema = z.object({
  status: z.nativeEnum(TransactionPhase).optional(),
  developmentId: z.string().optional(),
  agentId: z.string().optional(),
  buyerId: z.string().optional(),
  page: z.number().default(1),
  limit: z.number().default(20)
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: any = await request.json();
    const validation = CreateTransactionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { unitId, buyerId, notes } = validation.data;

    // Check if unit exists and is available
    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
      include: {
        development: true
      }
    });

    if (!unit) {
      return NextResponse.json({ error: 'Unit not found' }, { status: 404 });
    }

    if (!['AVAILABLE', 'PLANNED', 'UNDER_CONSTRUCTION'].includes(unit.status)) {
      return NextResponse.json(
        { error: 'Unit is not available', status: unit.status },
        { status: 400 }
      );
    }

    // Create transaction (sale)
    const transaction = await prisma.$transaction(async (tx: any) => {
      // Create the sale
      const sale = await tx.sale.create({
        data: {
          unitId,
          developmentId: unit.developmentId,
          buyerId: buyerId || session.user.id,
          sellingAgentId: session.user.role === 'AGENT' ? session.user.id : undefined,
          status: TransactionPhase.ENQUIRY,
          contractStatus: 'not_issued',
          basePrice: unit.basePrice,
          customizationCost: 0,
          totalPrice: unit.basePrice,
          referenceNumber: `SALE-${Date.now()}`,
          notes: notes ? [{ content: notes, authorId: session.user.id, timestamp: new Date() }] : undefined
        }
      });

      // Create timeline
      await tx.saleTimeline.create({
        data: {
          saleId: sale.id,
          initialEnquiryDate: new Date()
        }
      });

      // Update unit status
      await tx.unit.update({
        where: { id: unitId },
        data: { status: 'RESERVED' }
      });

      // Create initial status history
      await tx.saleStatusHistory.create({
        data: {
          saleId: sale.id,
          status: TransactionPhase.ENQUIRY,
          updatedById: session.user.id,
          notes: 'Initial enquiry created'
        }
      });

      return sale;
    });

    // Emit event for new transaction
    transactionEngine.emit('transaction_created', {
      saleId: transaction.id,
      unitId,
      buyerId: transaction.buyerId,
      agentId: transaction.sellingAgentId,
      timestamp: new Date()
    });

    logger.info('Transaction created', {
      saleId: transaction.id,
      unitId,
      userId: session.user.id
    });

    return NextResponse.json({
      success: true,
      transaction: {
        id: transaction.id,
        referenceNumber: transaction.referenceNumber,
        status: transaction.status,
        unitId: transaction.unitId,
        developmentId: transaction.developmentId
      }
    });

  } catch (error) {
    logger.error('Failed to create transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction', message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const params = {
      status: searchParams.get('status') as TransactionPhase | undefined,
      developmentId: searchParams.get('developmentId'),
      agentId: searchParams.get('agentId'),
      buyerId: searchParams.get('buyerId'),
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20')
    };

    const validation = ListTransactionsSchema.safeParse(params);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { status, developmentId, agentId, buyerId, page, limit } = validation.data;

    // Build where clause based on user role
    const where: any = {};

    if (session.user.role === 'BUYER') {
      where.buyerId = session.user.id;
    } else if (session.user.role === 'AGENT') {
      where.sellingAgentId = session.user.id;
    }

    if (status) where.status = status;
    if (developmentId) where.developmentId = developmentId;
    if (agentId && session.user.role !== 'BUYER') where.sellingAgentId = agentId;
    if (buyerId && session.user.role !== 'BUYER') where.buyerId = buyerId;

    // Get transactions with pagination
    const [transactionstotal] = await Promise.all([
      prisma.sale.findMany({
        where,
        include: {
          unit: {
            include: {
              development: {
                select: {
                  name: true,
                  location: true
                }
              }
            }
          },
          sellingAgent: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          timeline: true,
          depositInfo: true
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.sale.count({ where })
    ]);

    // Transform data
    const transformedTransactions = transactions.map(transaction => ({
      id: transaction.id,
      referenceNumber: transaction.referenceNumber,
      status: transaction.status,
      contractStatus: transaction.contractStatus,
      unit: {
        id: transaction.unit.id,
        name: transaction.unit.name,
        type: transaction.unit.type,
        price: transaction.unit.basePrice,
        development: transaction.unit.development
      },
      pricing: {
        basePrice: transaction.basePrice,
        customizationCost: transaction.customizationCost,
        totalPrice: transaction.totalPrice
      },
      agent: transaction.sellingAgent,
      timeline: transaction.timeline,
      deposit: transaction.depositInfo,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt
    }));

    return NextResponse.json({
      transactions: transformedTransactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    logger.error('Failed to list transactions:', error);
    return NextResponse.json(
      { error: 'Failed to list transactions', message: (error as Error).message },
      { status: 500 }
    );
  }
}