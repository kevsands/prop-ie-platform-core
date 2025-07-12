/**
 * Real-time Valuation Sync API
 * 
 * Synchronizes contractor valuations with payment certificates
 * Updates financial tracking in real-time
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Irish tax calculation function
function calculateIrishTaxes(params: {
  grossAmount: number;
  contractorType: string;
  serviceType: string;
  vatRegistered: boolean;
  isResident: boolean;
}) {
  const { grossAmount, contractorType, serviceType } = params;
  
  // RCT Calculation for construction
  let rctRate = 0;
  let rctAmount = 0;
  
  if (serviceType === 'construction' && grossAmount >= 10000) {
    rctRate = contractorType === 'c2_certificate' ? 0 : 20; // 20% for non-C2, 0% for C2
    rctAmount = (grossAmount * rctRate) / 100;
  }
  
  // VAT is typically handled separately in construction
  const vatAmount = 0; // Would be calculated based on actual VAT setup
  const finalPaymentAmount = grossAmount - rctAmount - vatAmount;
  
  return {
    rctRate,
    rctAmount: Math.round(rctAmount * 100) / 100,
    vatAmount: Math.round(vatAmount * 100) / 100,
    finalPaymentAmount: Math.round(finalPaymentAmount * 100) / 100
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { valuationId, action, userId } = body;

    const valuation = await prisma.contractorValuation.findUnique({
      where: { id: valuationId },
      include: { project: true }
    });

    if (!valuation) {
      return NextResponse.json({
        success: false,
        error: 'Valuation not found'
      }, { status: 404 });
    }

    if (action === 'approve') {
      // Update valuation status
      const updatedValuation = await prisma.contractorValuation.update({
        where: { id: valuationId },
        data: {
          status: 'approved',
          approvedAt: new Date(),
          approvedBy: userId,
          reviewedAt: new Date(),
          reviewedBy: userId
        }
      });

      // Create payment certificate
      const certificateNumber = await getNextCertificateNumber(valuation.projectId);
      
      // Calculate Irish taxes for the payment
      const grossAmount = Number(valuation.netAmount);
      const taxCalculation = calculateIrishTaxes({
        grossAmount,
        contractorType: 'standard', // Would get from contractor record
        serviceType: 'construction',
        vatRegistered: true,
        isResident: true
      });
      
      const paymentCertificate = await prisma.paymentCertificate.create({
        data: {
          projectId: valuation.projectId,
          certificateNumber,
          valuationId: valuationId,
          grossAmount: valuation.grossValuation,
          retentionAmount: valuation.retentionAmount,
          previousCertificates: valuation.previousCertificates,
          netAmount: valuation.netAmount,
          rctAmount: taxCalculation.rctAmount,
          vatAmount: taxCalculation.vatAmount,
          finalPayableAmount: taxCalculation.finalPaymentAmount,
          issuedBy: userId,
          issuedAt: new Date(),
          status: 'issued',
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          currency: 'EUR',
          taxCompliance: {
            rctRate: taxCalculation.rctRate,
            vatRate: taxCalculation.vatRate || 0,
            taxesCalculatedAt: new Date()
          }
        }
      });

      // Update financial tracker
      await updateFinancialTracker(valuation.projectId, {
        type: 'contractor_payment_approved',
        amount: Number(valuation.netAmount),
        valuationId,
        certificateId: paymentCertificate.id,
        timestamp: new Date()
      });

      return NextResponse.json({
        success: true,
        data: {
          valuation: updatedValuation,
          paymentCertificate
        },
        message: 'Valuation approved and payment certificate created'
      });
    }

    if (action === 'reject') {
      const { rejectionReason } = body;
      
      const updatedValuation = await prisma.contractorValuation.update({
        where: { id: valuationId },
        data: {
          status: 'rejected',
          reviewedAt: new Date(),
          reviewedBy: userId,
          rejectionReason
        }
      });

      return NextResponse.json({
        success: true,
        data: updatedValuation,
        message: 'Valuation rejected'
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('Error syncing valuation:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to sync valuation',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

async function getNextCertificateNumber(projectId: string): Promise<number> {
  const lastCertificate = await prisma.paymentCertificate.findFirst({
    where: { projectId },
    orderBy: { certificateNumber: 'desc' }
  });
  
  return (lastCertificate?.certificateNumber || 0) + 1;
}

async function updateFinancialTracker(projectId: string, transactionData: any) {
  const tracker = await prisma.financialTracker.findFirst({
    where: { 
      projectId,
      trackingType: 'expenses'
    }
  });

  if (tracker) {
    const currentData = tracker.data as any;
    const updatedData = {
      ...currentData,
      transactions: [
        ...(currentData.transactions || []),
        transactionData
      ],
      totals: {
        ...currentData.totals,
        contractorPayments: (currentData.totals?.contractorPayments || 0) + transactionData.amount
      }
    };

    await prisma.financialTracker.update({
      where: { id: tracker.id },
      data: {
        data: updatedData,
        updatedAt: new Date()
      }
    });
  } else {
    // Create new tracker
    await prisma.financialTracker.create({
      data: {
        projectId,
        name: 'Project Expenses Tracker',
        trackingType: 'expenses',
        data: {
          transactions: [transactionData],
          totals: {
            contractorPayments: transactionData.amount
          }
        },
        currency: 'EUR',
        period: 'monthly',
        createdBy: 'system'
      }
    });
  }
}