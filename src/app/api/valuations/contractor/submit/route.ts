/**
 * Contractor Valuation Submission API
 * 
 * Handles submission of contractor valuations for QS review
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ValuationSubmission {
  projectId: string;
  valuationNumber: number;
  periodFrom: Date;
  periodTo: Date;
  workCompleted: {
    id: string;
    code: string;
    description: string;
    unit: string;
    quantity: number;
    rate: number;
    previousQuantity: number;
    thisMonthQuantity: number;
    cumulativeQuantity: number;
    amount: number;
  }[];
  materialsOnSite: {
    description: string;
    quantity: number;
    unit: string;
    value: number;
  }[];
  variations: {
    description: string;
    type: 'addition' | 'omission';
    amount: number;
    approved: boolean;
  }[];
  grossValuation: number;
  retentionPercentage: number;
  retentionAmount: number;
  previousCertificates: number;
  netAmount: number;
  contractorNotes: string;
  supportingDocuments: string[];
  status: string;
  submittedAt: Date;
  submittedBy: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ValuationSubmission = await request.json();

    // Validate required fields
    if (!body.projectId || !body.valuationNumber || !body.contractorNotes.trim()) {
      return NextResponse.json(
        { error: 'Missing required fields: projectId, valuationNumber, contractorNotes' },
        { status: 400 }
      );
    }

    if (body.workCompleted.length === 0) {
      return NextResponse.json(
        { error: 'At least one work item must be included' },
        { status: 400 }
      );
    }

    // In development mode, simulate database operations
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV] Submitting contractor valuation #${body.valuationNumber} for ${body.projectId}`);
      
      // Simulate validation processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create valuation record (simulated)
      const newValuation = {
        id: `val_${Date.now()}`,
        projectId: body.projectId,
        valuationNumber: body.valuationNumber,
        periodFrom: body.periodFrom,
        periodTo: body.periodTo,
        grossValuation: body.grossValuation,
        retentionAmount: body.retentionAmount,
        netAmount: body.netAmount,
        status: 'submitted',
        submittedAt: body.submittedAt,
        submittedBy: body.submittedBy,
        contractorNotes: body.contractorNotes,
        workItems: body.workCompleted.filter(item => item.thisMonthQuantity > 0),
        materialsOnSite: body.materialsOnSite,
        variations: body.variations,
        supportingDocuments: body.supportingDocuments
      };

      // Simulate notification creation for QS
      const notification = {
        id: `notif_${Date.now()}`,
        userId: 'sarah-mitchell-qs',
        type: 'new_valuation',
        title: `New Valuation #${body.valuationNumber} Submitted`,
        content: `${body.submittedBy} has submitted valuation #${body.valuationNumber} for ${newValuation.netAmount.toLocaleString('en-IE', { style: 'currency', currency: 'EUR' })} on ${body.projectId}. Awaiting your review.`,
        priority: 'normal',
        category: 'financial',
        actionUrl: '/quantity-surveyor/valuation-review',
        actionLabel: 'Review Valuation',
        createdAt: new Date().toISOString()
      };

      console.log('[DEV] Valuation submission successful:', {
        valuationId: newValuation.id,
        netAmount: newValuation.netAmount,
        workItemsCount: newValuation.workItems.length,
        notificationSent: true
      });

      return NextResponse.json({
        success: true,
        valuation: newValuation,
        notification,
        message: `Valuation #${body.valuationNumber} submitted successfully for QS review`
      });
    }

    // Production database operations
    try {
      // Create contractor valuation record
      const contractorValuation = await prisma.contractorValuation.create({
        data: {
          projectId: body.projectId,
          valuationNumber: body.valuationNumber,
          periodFrom: new Date(body.periodFrom),
          periodTo: new Date(body.periodTo),
          grossValuation: body.grossValuation,
          retentionPercentage: body.retentionPercentage,
          retentionAmount: body.retentionAmount,
          previousCertificates: body.previousCertificates,
          netAmount: body.netAmount,
          status: 'submitted',
          submittedAt: new Date(body.submittedAt),
          submittedBy: body.submittedBy,
          contractorNotes: body.contractorNotes,
          workItems: JSON.stringify(body.workCompleted),
          materialsOnSite: JSON.stringify(body.materialsOnSite),
          variations: JSON.stringify(body.variations),
          supportingDocuments: JSON.stringify(body.supportingDocuments)
        }
      });

      // Create notification for quantity surveyor
      try {
        await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 'sarah-mitchell-qs',
            type: 'payment_status',
            title: `New Valuation #${body.valuationNumber} Submitted`,
            content: `${body.submittedBy} has submitted valuation #${body.valuationNumber} for ${body.netAmount.toLocaleString('en-IE', { style: 'currency', currency: 'EUR' })}. Awaiting your review.`,
            priority: 'normal',
            category: 'financial',
            actionUrl: '/quantity-surveyor/valuation-review',
            actionLabel: 'Review Valuation',
            metadata: {
              valuationId: contractorValuation.id,
              projectId: body.projectId,
              amount: body.netAmount
            }
          })
        });
      } catch (notificationError) {
        console.error('Failed to create notification:', notificationError);
        // Continue anyway - valuation was created successfully
      }

      return NextResponse.json({
        success: true,
        valuation: contractorValuation,
        message: `Valuation #${body.valuationNumber} submitted successfully for QS review`
      });

    } catch (dbError) {
      console.error('Database error creating valuation:', dbError);
      
      return NextResponse.json(
        { error: 'Failed to save valuation to database' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error processing valuation submission:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get contractor valuation history
    const { searchParams } = new URL(request.url);
    const contractorId = searchParams.get('contractorId') || 'murphy-construction';
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status');

    // In development mode, return mock data
    if (process.env.NODE_ENV === 'development') {
      const mockValuations = [
        {
          id: 'val_010',
          projectId: 'fitzgerald-gardens',
          valuationNumber: 10,
          periodFrom: '2025-07-01',
          periodTo: '2025-07-31',
          grossValuation: 425000,
          netAmount: 403750,
          status: 'draft',
          submittedAt: null,
          submittedBy: 'John Murphy',
          qsReviewedAt: null,
          qsReviewedBy: null
        },
        {
          id: 'val_009',
          projectId: 'fitzgerald-gardens',
          valuationNumber: 9,
          periodFrom: '2025-06-01',
          periodTo: '2025-06-30',
          grossValuation: 617500,
          netAmount: 586250,
          status: 'approved',
          submittedAt: '2025-06-28T14:30:00Z',
          submittedBy: 'John Murphy',
          qsReviewedAt: '2025-07-02T09:15:00Z',
          qsReviewedBy: 'Sarah Mitchell'
        },
        {
          id: 'val_008',
          projectId: 'fitzgerald-gardens',
          valuationNumber: 8,
          periodFrom: '2025-05-01',
          periodTo: '2025-05-31',
          grossValuation: 585000,
          netAmount: 555750,
          status: 'paid',
          submittedAt: '2025-05-31T16:20:00Z',
          submittedBy: 'John Murphy',
          qsReviewedAt: '2025-06-03T11:45:00Z',
          qsReviewedBy: 'Sarah Mitchell',
          paidAt: '2025-06-15T10:30:00Z'
        }
      ];

      let filteredValuations = mockValuations;
      
      if (projectId) {
        filteredValuations = filteredValuations.filter(v => v.projectId === projectId);
      }
      
      if (status) {
        filteredValuations = filteredValuations.filter(v => v.status === status);
      }

      return NextResponse.json({
        success: true,
        valuations: filteredValuations,
        summary: {
          total: filteredValuations.length,
          draft: filteredValuations.filter(v => v.status === 'draft').length,
          submitted: filteredValuations.filter(v => v.status === 'submitted').length,
          approved: filteredValuations.filter(v => v.status === 'approved').length,
          paid: filteredValuations.filter(v => v.status === 'paid').length,
          totalValue: filteredValuations.reduce((sum, v) => sum + v.netAmount, 0)
        }
      });
    }

    // Production database query
    const where: any = { submittedBy: contractorId };
    if (projectId) where.projectId = projectId;
    if (status) where.status = status;

    const valuations = await prisma.contractorValuation.findMany({
      where,
      orderBy: { valuationNumber: 'desc' },
      take: 50
    });

    return NextResponse.json({
      success: true,
      valuations,
      summary: {
        total: valuations.length,
        totalValue: valuations.reduce((sum, v) => sum + Number(v.netAmount), 0)
      }
    });

  } catch (error) {
    console.error('Error fetching contractor valuations:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch valuations' },
      { status: 500 }
    );
  }
}