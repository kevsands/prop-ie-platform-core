// src/app/api/payments/htb/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/users-production';

interface HTBPaymentRequest {
  propertyId: string;
  htbClaimId: string;
  benefitAmount: number;
  bankDetails: {
    iban: string;
    accountName: string;
    bankName: string;
  };
}

interface HTBBenefitPayment {
  id: string;
  claimId: string;
  propertyId: string;
  amount: number;
  status: 'pending' | 'processing' | 'approved' | 'disbursed' | 'rejected';
  submittedAt: string;
  processedAt?: string;
  disbursedAt?: string;
  governmentReference: string;
  bankDetails: {
    iban: string;
    accountName: string;
    bankName: string;
  };
  processingNotes?: string;
  estimatedDisbursementDate?: string;
}

/**
 * HTB Benefit Payment Processing API
 * Handles Help-to-Buy scheme benefit disbursement
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as HTBPaymentRequest;
    const { propertyId, htbClaimId, benefitAmount, bankDetails } = body;

    // Validate required fields
    if (!propertyId || !htbClaimId || !benefitAmount || !bankDetails) {
      return NextResponse.json(
        { error: 'Property ID, HTB claim ID, benefit amount, and bank details are required' },
        { status: 400 }
      );
    }

    // Validate benefit amount
    if (benefitAmount <= 0 || benefitAmount > 30000) {
      return NextResponse.json(
        { error: 'Benefit amount must be between €1 and €30,000' },
        { status: 400 }
      );
    }

    // Validate IBAN format (basic validation)
    const ibanRegex = /^IE\d{2}[A-Z]{4}\d{14}$/;
    if (!ibanRegex.test(bankDetails.iban)) {
      return NextResponse.json(
        { error: 'Invalid Irish IBAN format' },
        { status: 400 }
      );
    }

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

    // Generate HTB payment ID and government reference
    const htbPaymentId = `htb_pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const governmentReference = `HTB-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

    // In development mode, create mock HTB benefit payment
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
      console.log(`[DEV] Processing HTB benefit payment for claim ${htbClaimId}, amount: €${benefitAmount}`);
      
      const mockHTBPayment: HTBBenefitPayment = {
        id: htbPaymentId,
        claimId: htbClaimId,
        propertyId,
        amount: benefitAmount,
        status: 'processing',
        submittedAt: new Date().toISOString(),
        governmentReference,
        bankDetails: {
          iban: bankDetails.iban,
          accountName: bankDetails.accountName,
          bankName: bankDetails.bankName
        },
        processingNotes: 'HTB benefit payment submitted to Revenue for processing',
        estimatedDisbursementDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
      };

      // Simulate different processing scenarios
      const random = Math.random();
      if (random < 0.8) {
        // 80% chance of successful processing
        mockHTBPayment.status = 'processing';
        mockHTBPayment.processingNotes = 'HTB benefit claim submitted to Revenue. Processing time: 5-10 business days.';
      } else if (random < 0.95) {
        // 15% chance of requiring additional documentation
        mockHTBPayment.status = 'pending';
        mockHTBPayment.processingNotes = 'Additional documentation required. Please submit proof of first-time buyer status.';
      } else {
        // 5% chance of rejection
        mockHTBPayment.status = 'rejected';
        mockHTBPayment.processingNotes = 'HTB claim rejected: Property does not meet new build criteria.';
      }

      return NextResponse.json({
        success: true,
        htbPayment: mockHTBPayment,
        message: '[DEV MODE] HTB benefit payment submitted. In production, this would integrate with Revenue systems.',
        nextSteps: [
          'Monitor claim status in your HTB dashboard',
          'Revenue will process your claim within 5-10 business days',
          'Benefit will be disbursed directly to your solicitor for property completion'
        ]
      });
    }

    // Production: Submit to Revenue HTB system
    try {
      // This would integrate with actual Revenue API in production
      // const revenueResponse = await submitHTBClaim({
      //   claimId: htbClaimId,
      //   propertyId,
      //   benefitAmount,
      //   bankDetails,
      //   applicantPPSN: currentUser.ppsn
      // });

      // Mock production response
      const productionHTBPayment: HTBBenefitPayment = {
        id: htbPaymentId,
        claimId: htbClaimId,
        propertyId,
        amount: benefitAmount,
        status: 'processing',
        submittedAt: new Date().toISOString(),
        governmentReference,
        bankDetails,
        processingNotes: 'HTB benefit claim submitted to Revenue for processing',
        estimatedDisbursementDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
      };

      return NextResponse.json({
        success: true,
        htbPayment: productionHTBPayment,
        nextSteps: [
          'Monitor claim status through your HTB dashboard',
          'Revenue will review your claim within 10 business days',
          'You will receive email notifications on status updates'
        ]
      });
    } catch (revenueError: any) {
      console.error('Revenue HTB submission error:', revenueError);
      
      return NextResponse.json(
        { error: 'Failed to submit HTB benefit claim to Revenue' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('HTB payment processing error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Get HTB Payment Status
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
    const claimId = searchParams.get('claimId');

    // In development mode, return mock HTB payments
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
      console.log(`[DEV] Getting HTB payments for user ${currentUser.id}`);
      
      const mockHTBPayments: HTBBenefitPayment[] = [
        {
          id: 'htb_pay_001',
          claimId: 'HTB-CLAIM-001',
          propertyId: 'prop_001',
          amount: 30000,
          status: 'disbursed',
          submittedAt: '2025-05-15T10:30:00Z',
          processedAt: '2025-05-20T14:22:00Z',
          disbursedAt: '2025-05-22T09:15:00Z',
          governmentReference: 'HTB-2025-001234',
          bankDetails: {
            iban: 'IE29AIBK93115212345678',
            accountName: 'John Smith',
            bankName: 'AIB Bank'
          },
          processingNotes: 'HTB benefit successfully disbursed to solicitor for property completion'
        },
        {
          id: 'htb_pay_002',
          claimId: 'HTB-CLAIM-002',
          propertyId: 'prop_002',
          amount: 25000,
          status: 'processing',
          submittedAt: '2025-06-10T16:45:00Z',
          governmentReference: 'HTB-2025-005678',
          bankDetails: {
            iban: 'IE29AIBK93115212345678',
            accountName: 'John Smith',
            bankName: 'AIB Bank'
          },
          processingNotes: 'HTB claim under review by Revenue. Expected processing time: 3-5 business days.',
          estimatedDisbursementDate: '2025-06-20T12:00:00Z'
        }
      ];

      const filteredPayments = claimId 
        ? mockHTBPayments.filter(p => p.claimId === claimId)
        : mockHTBPayments;

      return NextResponse.json({
        success: true,
        htbPayments: filteredPayments,
        summary: {
          totalBenefits: mockHTBPayments.reduce((sum, p) => sum + (p.status === 'disbursed' ? p.amount : 0), 0),
          pendingBenefits: mockHTBPayments.reduce((sum, p) => sum + (p.status === 'processing' || p.status === 'approved' ? p.amount : 0), 0),
          totalClaims: mockHTBPayments.length
        },
        message: '[DEV MODE] Mock HTB payment data'
      });
    }

    // Production: Query actual database
    try {
      // This would query the actual database in production
      return NextResponse.json({
        success: true,
        htbPayments: [],
        summary: {
          totalBenefits: 0,
          pendingBenefits: 0,
          totalClaims: 0
        }
      });
    } catch (dbError: any) {
      console.error('Database query error:', dbError);
      
      return NextResponse.json(
        { error: 'Failed to retrieve HTB payments' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('HTB payments API error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}