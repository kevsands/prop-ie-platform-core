import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { transactionCoordinator } from '@/services/transactionCoordinator';
// import { PrismaClient } from '@prisma/slp-client';
import { prisma } from '@/lib/prisma';
// Use regular Prisma client for now

// const prisma = new PrismaClient(); // Already imported above

// Schema for creating a new transaction
const CreateTransactionSchema = z.object({
  propertyId: z.string(),
  buyerId: z.string(),
  developerId: z.string(),
  unitId: z.string(),
  totalAmount: z.number().positive(),
  initialDeposit: z.number().positive(),
});

// Schema for updating transaction status
const UpdateStatusSchema = z.object({
  transactionId: z.string(),
  status: z.enum(['INITIATED', 'OFFER_MADE', 'OFFER_ACCEPTED', 'CONTRACTS_EXCHANGED', 'COMPLETED', 'CANCELLED']),
  performedBy: z.string(),
  notes: z.string().optional(),
});

// Schema for payment processing
const ProcessPaymentSchema = z.object({
  transactionId: z.string(),
  amount: z.number().positive(),
  paymentType: z.enum(['BOOKING_DEPOSIT', 'CONTRACT_DEPOSIT', 'STAGE_PAYMENT', 'FINAL_PAYMENT']),
  paymentMethod: z.enum(['bank_transfer', 'credit_card', 'debit_card']),
  reference: z.string(),
  notes: z.string().optional(),
});

/**
 * GET handler for transactions
 * Supports query parameters:
 * - id: Get specific transaction
 * - buyerId: Filter by buyer
 * - developerId: Filter by developer
 * - status: Filter by status
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const buyerId = searchParams.get('buyerId');
    const developerId = searchParams.get('developerId');
    const status = searchParams.get('status');

    if (id) {
      // Get specific transaction
      const transaction = await prisma.transaction.findUnique({
        where: { id },
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

      // Transform to match TransactionContext interface
      const transformedTransaction = {
        id: transaction.id,
        reference: `TX-${transaction.id.substring(0, 6).toUpperCase()}`,
        property: {
          id: transaction.project.id,
          developmentId: transaction.project.developerId,
          developmentName: transaction.project.name,
          address: transaction.project.description || '',
          type: 'APARTMENT' as const,
          bedrooms: 2, // Mock data
          bathrooms: 1, // Mock data
          price: 350000, // Mock data
          status: 'RESERVED' as const,
          images: [],
          features: [],
        },
        status: mapTransactionStatus(transaction.status),
        participants: transaction.participants.map(p => ({
          id: p.id,
          role: p.role,
          userId: p.userId,
          name: `User ${p.userId}`, // Would need to fetch user details
          email: `user${p.userId}@example.com`, // Would need to fetch user details
          joinedAt: p.joinedAt.toISOString(),
          status: 'ACTIVE' as const,
        })),
        documents: [], // Would need to fetch from document service
        messages: [], // Would need to fetch from messaging service
        timeline: [], // Would need to fetch timeline events
        payments: await getTransactionPayments(transaction.id),
        totalAmount: 350000, // Would need to calculate from unit price
        currentStage: getCurrentStage(transaction.status),
        createdAt: transaction.startedAt.toISOString(),
        updatedAt: transaction.startedAt.toISOString(),
        completionDate: transaction.completedAt?.toISOString(),
        metadata: {},
      };

      return NextResponse.json(transformedTransaction);
    }

    // List transactions with filters
    const where: any = {};
    if (buyerId) where.buyerId = buyerId;
    if (status) where.status = status;

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        project: true,
        milestones: true,
        participants: true,
      },
      orderBy: { startedAt: 'desc' },
    });

    // Transform all transactions
    const transformedTransactions = await Promise.all(
      transactions.map(async (t) => ({
        id: t.id,
        reference: `TX-${t.id.substring(0, 6).toUpperCase()}`,
        property: {
          id: t.project.id,
          developmentId: t.project.developerId,
          developmentName: t.project.name,
          address: t.project.description || '',
          type: 'APARTMENT' as const,
          bedrooms: 2,
          bathrooms: 1,
          price: 350000,
          status: 'RESERVED' as const,
          images: [],
          features: [],
        },
        status: mapTransactionStatus(t.status),
        participants: t.participants.map(p => ({
          id: p.id,
          role: p.role,
          userId: p.userId,
          name: `User ${p.userId}`,
          email: `user${p.userId}@example.com`,
          joinedAt: p.joinedAt.toISOString(),
          status: 'ACTIVE' as const,
        })),
        documents: [],
        messages: [],
        timeline: [],
        payments: await getTransactionPayments(t.id),
        totalAmount: 350000,
        currentStage: getCurrentStage(t.status),
        createdAt: t.startedAt.toISOString(),
        updatedAt: t.startedAt.toISOString(),
        completionDate: t.completedAt?.toISOString(),
        metadata: {},
      }))
    );

    return NextResponse.json(transformedTransactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

/**
 * POST handler for creating transactions
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validationResult = CreateTransactionSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { propertyId, buyerId, developerId, unitId, totalAmount, initialDeposit } = validationResult.data;

    // Create transaction
    const transaction = await transactionCoordinator.initiatePropertyPurchase(buyerId, propertyId);

    // Create initial payment record
    const payment = await createPaymentRecord({
      transactionId: transaction.id,
      amount: initialDeposit,
      type: 'BOOKING_DEPOSIT',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    });

    return NextResponse.json({ transaction, payment }, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}

/**
 * PUT handler for updating transactions
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Handle status updates
    if (body.status) {
      const validationResult = UpdateStatusSchema.safeParse(body);
      if (!validationResult.success) {
        return NextResponse.json(
          { error: 'Invalid status update data', details: validationResult.error.format() },
          { status: 400 }
        );
      }

      const { transactionId, status, performedBy, notes } = validationResult.data;
      const updatedTransaction = await transactionCoordinator.handleStateChange(
        transactionId,
        status,
        performedBy
      );

      return NextResponse.json(updatedTransaction);
    }

    // Handle payment processing
    if (body.paymentType) {
      const validationResult = ProcessPaymentSchema.safeParse(body);
      if (!validationResult.success) {
        return NextResponse.json(
          { error: 'Invalid payment data', details: validationResult.error.format() },
          { status: 400 }
        );
      }

      const paymentResult = await processPayment(validationResult.data);
      return NextResponse.json(paymentResult);
    }

    return NextResponse.json(
      { error: 'Invalid update request' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}

// Helper functions

/**
 * Map database transaction status to UI status
 */
function mapTransactionStatus(dbStatus: string): string {
  const statusMap: Record<string, string> = {
    'INITIATED': 'DRAFT',
    'OFFER_MADE': 'RESERVED',
    'OFFER_ACCEPTED': 'DEPOSIT_PAID',
    'CONTRACTS_EXCHANGED': 'CONTRACTED',
    'COMPLETED': 'COMPLETED',
    'CANCELLED': 'CANCELLED',
  };
  return statusMap[dbStatus] || dbStatus;
}

/**
 * Get current stage based on status
 */
function getCurrentStage(status: string): string {
  const stageMap: Record<string, string> = {
    'INITIATED': 'Property Discovery',
    'OFFER_MADE': 'Offer Submitted',
    'OFFER_ACCEPTED': 'Processing Deposits',
    'CONTRACTS_EXCHANGED': 'Legal Process',
    'COMPLETED': 'Transaction Complete',
    'CANCELLED': 'Transaction Cancelled',
  };
  return stageMap[status] || status;
}

/**
 * Get transaction payments
 */
async function getTransactionPayments(transactionId: string) {
  // Mock payment data - would be fetched from payment service
  return [
    {
      id: `payment-${transactionId}-1`,
      amount: 5000,
      currency: 'EUR',
      type: 'BOOKING_DEPOSIT' as const,
      status: 'COMPLETED' as const,
      dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      paidDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      reference: 'REF-001',
    },
    {
      id: `payment-${transactionId}-2`,
      amount: 35000,
      currency: 'EUR',
      type: 'CONTRACT_DEPOSIT' as const,
      status: 'PENDING' as const,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

/**
 * Create payment record
 */
async function createPaymentRecord(data: {
  transactionId: string;
  amount: number;
  type: string;
  dueDate: Date;
}) {
  // Mock implementation - would integrate with payment service
  return {
    id: `payment-${Date.now()}`,
    transactionId: data.transactionId,
    amount: data.amount,
    currency: 'EUR',
    type: data.type,
    status: 'PENDING',
    dueDate: data.dueDate.toISOString(),
    createdAt: new Date().toISOString(),
  };
}

/**
 * Process payment
 */
async function processPayment(data: z.infer<typeof ProcessPaymentSchema>) {
  // Mock implementation - would integrate with payment gateway
  return {
    success: true,
    paymentId: `payment-${Date.now()}`,
    status: 'PROCESSING',
    message: 'Payment is being processed',
    processingTime: '1-2 business days',
  };
}