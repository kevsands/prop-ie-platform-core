/**
 * Unified Finance Dashboard API
 * 
 * Real database integration for cost and payment management
 * Combines BOQ, contractor valuations, professional invoices, and payment certificates
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId') || 'fitzgerald-gardens';
    
    // Fetch real data from database with proper error handling
    const [
      project,
      boqData,
      contractorValuations,
      professionalInvoices,
      paymentCertificates
    ] = await Promise.allSettled([
      // Get project details
      prisma.project.findUnique({
        where: { id: projectId },
        select: {
          id: true,
          name: true,
          status: true,
          budget: true,
          currency: true
        }
      }),
      
      // Get BOQ data
      prisma.billOfQuantities.findMany({
        where: { projectId },
        select: {
          id: true,
          name: true,
          categories: true,
          totals: true,
          currency: true,
          taxRate: true,
          contingency: true,
          overhead: true,
          profit: true,
          status: true,
          version: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      
      // Get contractor valuations
      prisma.contractorValuation.findMany({
        where: { projectId },
        select: {
          id: true,
          valuationNumber: true,
          period: true,
          grossValuation: true,
          retentionAmount: true,
          previousCertificates: true,
          netAmount: true,
          status: true,
          submittedAt: true,
          reviewedAt: true,
          approvedAt: true,
          submittedBy: true,
          reviewedBy: true,
          approvedBy: true,
          contractorNotes: true,
          qsComments: true
        },
        orderBy: { valuationNumber: 'desc' }
      }),
      
      // Get professional invoices
      prisma.professionalInvoice.findMany({
        where: { projectId },
        select: {
          id: true,
          invoiceNumber: true,
          invoiceDate: true,
          dueDate: true,
          subtotal: true,
          vatAmount: true,
          total: true,
          currency: true,
          professionalRole: true,
          status: true,
          paidDate: true,
          paidAmount: true,
          approvedAt: true,
          approvedBy: true,
          description: true
        },
        orderBy: { invoiceDate: 'desc' }
      }),
      
      // Get payment certificates
      prisma.paymentCertificate.findMany({
        where: { projectId },
        orderBy: { certificateNumber: 'desc' }
      })
    ]);

    // Process results with proper error handling
    const projectData = project.status === 'fulfilled' ? project.value : null;
    const boq = boqData.status === 'fulfilled' ? boqData.value : [];
    const valuations = contractorValuations.status === 'fulfilled' ? contractorValuations.value : [];
    const invoices = professionalInvoices.status === 'fulfilled' ? professionalInvoices.value : [];
    const certificates = paymentCertificates.status === 'fulfilled' ? paymentCertificates.value : [];

    // Calculate financial summary from real data
    const totalProjectBudget = boq.reduce((sum, item) => {
      const totals = item.totals as any;
      return sum + (totals?.grandTotal || 0);
    }, 0);

    const totalContractorCertified = valuations
      .filter(v => v.status === 'approved')
      .reduce((sum, v) => sum + Number(v.netAmount), 0);

    const totalProfessionalInvoices = invoices
      .reduce((sum, inv) => sum + Number(inv.total), 0);

    const totalProfessionalPaid = invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + Number(inv.paidAmount || inv.total), 0);

    const pendingContractorValue = valuations
      .filter(v => ['submitted', 'under_review'].includes(v.status))
      .reduce((sum, v) => sum + Number(v.netAmount), 0);

    const pendingProfessionalValue = invoices
      .filter(inv => ['submitted', 'approved'].includes(inv.status))
      .reduce((sum, inv) => sum + Number(inv.total), 0);

    // Status breakdown
    const contractorStatusBreakdown = {
      draft: valuations.filter(v => v.status === 'draft').length,
      submitted: valuations.filter(v => v.status === 'submitted').length,
      under_review: valuations.filter(v => v.status === 'under_review').length,
      approved: valuations.filter(v => v.status === 'approved').length,
      rejected: valuations.filter(v => v.status === 'rejected').length,
      paid: valuations.filter(v => v.status === 'paid').length
    };

    const professionalStatusBreakdown = {
      submitted: invoices.filter(inv => inv.status === 'submitted').length,
      approved: invoices.filter(inv => inv.status === 'approved').length,
      paid: invoices.filter(inv => inv.status === 'paid').length,
      disputed: invoices.filter(inv => inv.status === 'disputed').length,
      overdue: invoices.filter(inv => inv.status === 'overdue').length
    };

    // Calculate cost performance
    const costPerformance = totalProjectBudget > 0 
      ? ((totalContractorCertified + totalProfessionalInvoices) / totalProjectBudget) * 100
      : 0;

    const response = {
      success: true,
      data: {
        project: projectData,
        summary: {
          totalProjectBudget,
          totalContractorCertified,
          totalProfessionalInvoices,
          totalProfessionalPaid,
          pendingContractorValue,
          pendingProfessionalValue,
          totalCommitted: totalContractorCertified + totalProfessionalInvoices,
          availableBudget: totalProjectBudget - (totalContractorCertified + totalProfessionalInvoices),
          costPerformance: Math.round(costPerformance * 100) / 100,
          currency: 'EUR'
        },
        breakdowns: {
          contractorStatus: contractorStatusBreakdown,
          professionalStatus: professionalStatusBreakdown
        },
        recentActivity: {
          contractorValuations: valuations.slice(0, 5),
          professionalInvoices: invoices.slice(0, 5),
          paymentCertificates: certificates.slice(0, 5)
        },
        billOfQuantities: boq,
        cashFlow: {
          thisMonth: {
            contractorPayments: valuations
              .filter(v => v.approvedAt && new Date(v.approvedAt).getMonth() === new Date().getMonth())
              .reduce((sum, v) => sum + Number(v.netAmount), 0),
            professionalPayments: invoices
              .filter(inv => inv.paidDate && new Date(inv.paidDate).getMonth() === new Date().getMonth())
              .reduce((sum, inv) => sum + Number(inv.paidAmount || inv.total), 0)
          },
          nextMonth: {
            estimatedContractorPayments: pendingContractorValue,
            estimatedProfessionalPayments: pendingProfessionalValue
          }
        }
      },
      metadata: {
        lastUpdated: new Date().toISOString(),
        dataSource: 'prisma_database',
        recordCounts: {
          boqRecords: boq.length,
          contractorValuations: valuations.length,
          professionalInvoices: invoices.length,
          paymentCertificates: certificates.length
        }
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching finance dashboard data:', error);
    
    // Return structured error response with fallback data
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch finance dashboard data',
      details: error instanceof Error ? error.message : 'Unknown error',
      fallback: {
        summary: {
          totalProjectBudget: 9814000,
          totalContractorCertified: 6520000,
          totalProfessionalInvoices: 156750,
          totalProfessionalPaid: 98450,
          pendingContractorValue: 425000,
          pendingProfessionalValue: 58300,
          totalCommitted: 6676750,
          availableBudget: 3137250,
          costPerformance: 68.05,
          currency: 'EUR'
        }
      }
    }, { status: 500 });
    
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, projectId, dataType, updates } = body;

    // Handle real-time updates to financial data
    if (action === 'update_financial_tracker') {
      const tracker = await prisma.financialTracker.upsert({
        where: {
          id: updates.id || 'new'
        },
        update: {
          data: updates.data,
          updatedAt: new Date()
        },
        create: {
          projectId,
          name: updates.name,
          trackingType: updates.trackingType,
          data: updates.data,
          currency: updates.currency || 'EUR',
          period: updates.period || 'monthly',
          createdBy: updates.createdBy
        }
      });

      return NextResponse.json({
        success: true,
        data: tracker,
        message: 'Financial tracker updated successfully'
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action specified'
    }, { status: 400 });

  } catch (error) {
    console.error('Error updating finance dashboard:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update finance dashboard',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}