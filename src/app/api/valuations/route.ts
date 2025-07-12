/**
 * Contractor Valuation API Routes
 * 
 * Handles monthly contractor valuation submissions and QS review workflow
 * Integrates with existing BOQ data and payment certificate generation
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Request schemas
const CreateValuationSchema = z.object({
  projectId: z.string().min(1),
  contractorId: z.string().min(1),
  valuationNumber: z.number().int().positive(),
  period: z.object({
    from: z.coerce.date(),
    to: z.coerce.date()
  }),
  workCompleted: z.array(z.object({
    boqSectionId: z.string(),
    boqElementId: z.string(),
    description: z.string(),
    quantityComplete: z.number(),
    rate: z.number(),
    amount: z.number(),
    cumulativeQuantity: z.number(),
    percentComplete: z.number()
  })),
  materialsOnSite: z.array(z.object({
    description: z.string(),
    quantity: z.number(),
    unit: z.string(),
    rate: z.number(),
    amount: z.number(),
    deliveryDate: z.coerce.date(),
    storageLocation: z.string()
  })).optional(),
  variations: z.array(z.object({
    variationNumber: z.string(),
    description: z.string(),
    amount: z.number(),
    status: z.enum(['pending', 'approved', 'rejected']),
    justification: z.string()
  })).optional(),
  grossValuation: z.number(),
  retentionPercentage: z.number().default(5.0),
  retentionAmount: z.number(),
  previousCertificates: z.number(),
  netAmount: z.number(),
  contractorNotes: z.string().optional(),
  supportingDocuments: z.array(z.object({
    id: z.string(),
    filename: z.string(),
    type: z.string(),
    uploadedAt: z.coerce.date(),
    fileSize: z.number(),
    url: z.string()
  })).optional(),
  submittedBy: z.string()
});

const UpdateValuationStatusSchema = z.object({
  valuationId: z.string(),
  status: z.enum(['under_review', 'approved', 'rejected']),
  qsComments: z.string().optional(),
  rejectionReason: z.string().optional(),
  reviewedBy: z.string()
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const valuationId = searchParams.get('valuationId');
    const status = searchParams.get('status');

    if (valuationId) {
      // Get specific valuation
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
    }

    if (projectId) {
      // Get all valuations for project
      const where: any = { projectId };
      if (status) {
        where.status = status;
      }

      const valuations = await prisma.contractorValuation.findMany({
        where,
        orderBy: { valuationNumber: 'desc' },
        include: {
          project: {
            select: { name: true }
          }
        }
      });

      return NextResponse.json({ valuations });
    }

    // Get all pending reviews (for QS dashboard)
    const pendingValuations = await prisma.contractorValuation.findMany({
      where: { 
        status: { in: ['submitted', 'under_review'] }
      },
      orderBy: { submittedAt: 'desc' },
      include: {
        project: {
          select: { name: true }
        }
      }
    });

    return NextResponse.json({ pendingValuations });

  } catch (error) {
    console.error('Valuation API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = CreateValuationSchema.parse(body);

    // Check for duplicate valuation number
    const existingValuation = await prisma.contractorValuation.findUnique({
      where: {
        projectId_valuationNumber: {
          projectId: data.projectId,
          valuationNumber: data.valuationNumber
        }
      }
    });

    if (existingValuation) {
      return NextResponse.json(
        { error: 'Valuation number already exists for this project' },
        { status: 409 }
      );
    }

    // Create valuation
    const valuation = await prisma.contractorValuation.create({
      data: {
        projectId: data.projectId,
        contractorId: data.contractorId,
        valuationNumber: data.valuationNumber,
        period: data.period,
        workCompleted: data.workCompleted,
        materialsOnSite: data.materialsOnSite || [],
        variations: data.variations || [],
        grossValuation: data.grossValuation,
        retentionPercentage: data.retentionPercentage,
        retentionAmount: data.retentionAmount,
        previousCertificates: data.previousCertificates,
        netAmount: data.netAmount,
        status: 'submitted',
        submittedAt: new Date(),
        submittedBy: data.submittedBy,
        supportingDocuments: data.supportingDocuments || [],
        contractorNotes: data.contractorNotes
      }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Valuation submitted successfully',
      valuation 
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Valuation Creation Error:', error);
    return NextResponse.json(
      { error: 'Failed to create valuation' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const data = UpdateValuationStatusSchema.parse(body);

    const updateData: any = {
      status: data.status,
      reviewedAt: new Date(),
      reviewedBy: data.reviewedBy
    };

    if (data.qsComments) {
      updateData.qsComments = data.qsComments;
    }

    if (data.rejectionReason) {
      updateData.rejectionReason = data.rejectionReason;
    }

    if (data.status === 'approved') {
      updateData.approvedAt = new Date();
      updateData.approvedBy = data.reviewedBy;
    }

    const valuation = await prisma.contractorValuation.update({
      where: { id: data.valuationId },
      data: updateData,
      include: {
        project: {
          select: { name: true }
        }
      }
    });

    // If approved, create payment certificate
    if (data.status === 'approved') {
      await createPaymentCertificate(valuation);
    }

    return NextResponse.json({ 
      success: true,
      message: `Valuation ${data.status}`,
      valuation 
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Valuation Update Error:', error);
    return NextResponse.json(
      { error: 'Failed to update valuation' },
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
    const rctDeduction = valuation.netAmount * 0.35;

    const certificate = await prisma.paymentCertificate.create({
      data: {
        projectId: valuation.projectId,
        certificateNumber,
        valuationId: valuation.id,
        period: valuation.period,
        grossAmount: valuation.grossValuation,
        retentionAmount: valuation.retentionAmount,
        netAmount: valuation.netAmount,
        rctDeduction,
        status: 'issued',
        certifiedBy: valuation.reviewedBy,
        description: `Payment Certificate #${certificateNumber} for Valuation #${valuation.valuationNumber}`
      }
    });

    console.log(`Payment certificate ${certificateNumber} created for valuation ${valuation.id}`);
    return certificate;

  } catch (error) {
    console.error('Failed to create payment certificate:', error);
    // Don't throw - valuation approval should still succeed
  }
}