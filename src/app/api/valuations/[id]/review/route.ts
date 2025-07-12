/**
 * Valuation Review API - QS Actions
 * 
 * Handles QS review, approval, and rejection of contractor valuations
 * Creates payment certificates when valuations are approved
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ReviewValuationSchema = z.object({
  action: z.enum(['approve', 'reject']),
  qsComments: z.string().optional(),
  rejectionReason: z.string().optional(),
  reviewedBy: z.string()
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: valuationId } = await params;
    const body = await request.json();
    const data = ReviewValuationSchema.parse(body);

    // Get the valuation
    const valuation = await prisma.contractorValuation.findUnique({
      where: { id: valuationId },
      include: {
        project: {
          select: { name: true }
        }
      }
    });

    if (!valuation) {
      return NextResponse.json(
        { error: 'Valuation not found' },
        { status: 404 }
      );
    }

    if (valuation.status !== 'submitted' && valuation.status !== 'under_review') {
      return NextResponse.json(
        { error: 'Valuation cannot be reviewed in current status' },
        { status: 400 }
      );
    }

    // Validate rejection reason if rejecting
    if (data.action === 'reject' && !data.rejectionReason) {
      return NextResponse.json(
        { error: 'Rejection reason is required when rejecting a valuation' },
        { status: 400 }
      );
    }

    const updateData: any = {
      status: data.action === 'approve' ? 'approved' : 'rejected',
      reviewedAt: new Date(),
      reviewedBy: data.reviewedBy,
      qsComments: data.qsComments
    };

    if (data.action === 'approve') {
      updateData.approvedAt = new Date();
      updateData.approvedBy = data.reviewedBy;
    } else {
      updateData.rejectionReason = data.rejectionReason;
    }

    // Update the valuation
    const updatedValuation = await prisma.contractorValuation.update({
      where: { id: valuationId },
      data: updateData,
      include: {
        project: {
          select: { name: true }
        }
      }
    });

    // If approved, create payment certificate
    let paymentCertificate = null;
    if (data.action === 'approve') {
      paymentCertificate = await createPaymentCertificate(updatedValuation);
    }

    const response = {
      success: true,
      message: `Valuation ${data.action}d successfully`,
      valuation: updatedValuation,
      paymentCertificate
    };

    return NextResponse.json(response);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Valuation Review Error:', error);
    return NextResponse.json(
      { error: 'Failed to review valuation' },
      { status: 500 }
    );
  }
}

// Helper function to create payment certificate for approved valuation
async function createPaymentCertificate(valuation: any) {
  try {
    // Get next certificate number for project
    const lastCertificate = await prisma.paymentCertificate.findFirst({
      where: { projectId: valuation.projectId },
      orderBy: { certificateNumber: 'desc' }
    });

    const certificateNumber = (lastCertificate?.certificateNumber || 0) + 1;

    // Calculate RCT deduction (35% for most contractors in Ireland)
    const rctDeduction = Number(valuation.netAmount) * 0.35;
    const payableAmount = Number(valuation.netAmount) - rctDeduction;

    const certificate = await prisma.paymentCertificate.create({
      data: {
        projectId: valuation.projectId,
        certificateNumber,
        valuationId: valuation.id,
        period: valuation.period,
        grossAmount: Number(valuation.grossValuation),
        retentionAmount: Number(valuation.retentionAmount),
        netAmount: Number(valuation.netAmount),
        rctDeduction,
        payableAmount,
        vatAmount: Number(valuation.grossValuation) * 0.23, // 23% Irish VAT
        status: 'issued',
        issuedAt: new Date(),
        certifiedBy: valuation.approvedBy,
        paymentDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        description: `Payment Certificate #${certificateNumber} for Valuation #${valuation.valuationNumber}`,
        currency: 'EUR'
      }
    });

    console.log(`Payment certificate ${certificateNumber} created for valuation ${valuation.id}`);
    return certificate;

  } catch (error) {
    console.error('Failed to create payment certificate:', error);
    // Don't throw - valuation approval should still succeed
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: valuationId } = await params;

    const valuation = await prisma.contractorValuation.findUnique({
      where: { id: valuationId },
      include: {
        project: {
          select: { name: true }
        }
      }
    });

    if (!valuation) {
      return NextResponse.json(
        { error: 'Valuation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ valuation });

  } catch (error) {
    console.error('Get Valuation Error:', error);
    return NextResponse.json(
      { error: 'Failed to get valuation' },
      { status: 500 }
    );
  }
}