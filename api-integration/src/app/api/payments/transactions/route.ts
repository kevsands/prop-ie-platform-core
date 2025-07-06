// src/app/api/payments/transactions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/users-production';

interface Transaction {
  id: string;
  propertyId: string;
  propertyTitle: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  paymentType: 'reservation' | 'deposit' | 'completion' | 'htb_benefit';
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  receiptUrl?: string;
  metadata?: Record<string, any>;
}

/**
 * Payment Transactions API
 * Retrieves transaction history and status
 */
export async function GET(request: NextRequest) {
  try {
    // Get current user
    let currentUser = null;
    try {
      if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
        const authToken = request.cookies.get('auth-token')?.value;
        if (authToken?.startsWith('dev-token-')) {
          const userId = authToken.replace('dev-token-', '');
          currentUser = await userService.getUserById(userId);
        }
      } else {
        currentUser = await userService.getCurrentUser();
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status');
    const paymentType = searchParams.get('paymentType');
    const propertyId = searchParams.get('propertyId');

    // In development mode, return mock transactions
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
      console.log(`[DEV] Getting transactions for user ${currentUser.id}`);
      
      const mockTransactions: Transaction[] = [
        {
          id: 'txn_001',
          propertyId: 'prop_001',
          propertyTitle: 'Fitzgerald Gardens - Unit 12A',
          amount: 5000,
          currency: 'EUR',
          status: 'completed',
          paymentType: 'reservation',
          paymentMethod: '•••• 4242',
          createdAt: '2025-06-15T10:30:00Z',
          updatedAt: '2025-06-15T10:35:00Z',
          description: 'Property reservation fee',
          receiptUrl: '/receipts/txn_001.pdf',
          metadata: {
            developerId: 'dev_fitzgerald',
            agentId: 'agent_001'
          }
        },
        {
          id: 'txn_002',
          propertyId: 'prop_001',
          propertyTitle: 'Fitzgerald Gardens - Unit 12A',
          amount: 35000,
          currency: 'EUR',
          status: 'pending',
          paymentType: 'deposit',
          paymentMethod: 'Bank Transfer',
          createdAt: '2025-06-16T14:20:00Z',
          updatedAt: '2025-06-16T14:20:00Z',
          description: '10% deposit payment',
          metadata: {
            expectedDate: '2025-06-20',
            bankReference: 'FG12A-DEP-001'
          }
        },
        {
          id: 'txn_003',
          propertyId: 'prop_002',
          propertyTitle: 'Oakwood Heights - Unit 5B',
          amount: 3000,
          currency: 'EUR',
          status: 'failed',
          paymentType: 'reservation',
          paymentMethod: '•••• 1234',
          createdAt: '2025-06-14T16:45:00Z',
          updatedAt: '2025-06-14T16:47:00Z',
          description: 'Property reservation fee - Payment failed',
          metadata: {
            failureReason: 'insufficient_funds',
            retryAttempts: 2
          }
        },
        {
          id: 'txn_004',
          propertyId: 'prop_001',
          propertyTitle: 'Fitzgerald Gardens - Unit 12A',
          amount: 30000,
          currency: 'EUR',
          status: 'processing',
          paymentType: 'htb_benefit',
          paymentMethod: 'Government Transfer',
          createdAt: '2025-06-17T09:15:00Z',
          updatedAt: '2025-06-17T11:30:00Z',
          description: 'Help-to-Buy scheme benefit',
          metadata: {
            htbReference: 'HTB-2025-001234',
            governmentProcessingTime: '3-5 business days'
          }
        },
        {
          id: 'txn_005',
          propertyId: 'prop_003',
          propertyTitle: 'Marina View - Unit 8C',
          amount: 4500,
          currency: 'EUR',
          status: 'completed',
          paymentType: 'reservation',
          paymentMethod: '•••• 5678',
          createdAt: '2025-06-10T12:00:00Z',
          updatedAt: '2025-06-10T12:05:00Z',
          description: 'Property reservation fee',
          receiptUrl: '/receipts/txn_005.pdf'
        }
      ];

      // Apply filters
      let filteredTransactions = mockTransactions;
      
      if (status) {
        filteredTransactions = filteredTransactions.filter(t => t.status === status);
      }
      
      if (paymentType) {
        filteredTransactions = filteredTransactions.filter(t => t.paymentType === paymentType);
      }
      
      if (propertyId) {
        filteredTransactions = filteredTransactions.filter(t => t.propertyId === propertyId);
      }

      // Apply pagination
      const paginatedTransactions = filteredTransactions.slice(offset, offset + limit);

      // Calculate totals
      const totals = {
        total: filteredTransactions.reduce((sum, t) => sum + (t.status === 'completed' ? t.amount : 0), 0),
        pending: filteredTransactions.reduce((sum, t) => sum + (t.status === 'pending' ? t.amount : 0), 0),
        processing: filteredTransactions.reduce((sum, t) => sum + (t.status === 'processing' ? t.amount : 0), 0),
        failed: filteredTransactions.filter(t => t.status === 'failed').length
      };

      return NextResponse.json({
        success: true,
        transactions: paginatedTransactions,
        pagination: {
          total: filteredTransactions.length,
          limit,
          offset,
          hasMore: offset + limit < filteredTransactions.length
        },
        totals,
        message: '[DEV MODE] Mock transaction data. In production, this would query the database.'
      });
    }

    // Production: Query actual database
    try {
      // This would query the actual database in production
      // const transactions = await db.transactions.findMany({
      //   where: {
      //     userId: currentUser.id,
      //     ...(status && { status }),
      //     ...(paymentType && { paymentType }),
      //     ...(propertyId && { propertyId })
      //   },
      //   orderBy: { createdAt: 'desc' },
      //   take: limit,
      //   skip: offset
      // });

      return NextResponse.json({
        success: true,
        transactions: [],
        pagination: {
          total: 0,
          limit,
          offset,
          hasMore: false
        },
        totals: {
          total: 0,
          pending: 0,
          processing: 0,
          failed: 0
        }
      });
    } catch (dbError: any) {
      console.error('Database query error:', dbError);
      
      return NextResponse.json(
        { error: 'Failed to retrieve transactions' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Transactions API error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}