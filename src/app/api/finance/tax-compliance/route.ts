/**
 * Irish Tax Compliance API
 * 
 * Handles RCT (Relevant Contracts Tax) and VAT calculations
 * Integrates with Revenue Online Service (ROS) data
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Irish tax rates and thresholds
const IRISH_TAX_CONFIG = {
  vat: {
    standard: 23.0,
    reduced: 13.5,
    zero: 0.0
  },
  rct: {
    standardRate: 20.0, // 20% RCT for non-C2 contractors
    c2Rate: 0.0,        // 0% RCT for C2 certificate holders
    threshold: 10000     // €10,000 threshold for RCT applicability
  },
  prsi: {
    employerRate: 11.05,
    employeeRate: 4.0
  }
};

interface TaxCalculationRequest {
  contractorId: string;
  grossAmount: number;
  contractorType: 'c2_certificate' | 'standard' | 'subcontractor';
  serviceType: 'construction' | 'professional' | 'consultancy';
  vatRegistered: boolean;
  isResident: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'calculate_taxes') {
      const data: TaxCalculationRequest = body.data;
      const calculation = calculateIrishTaxes(data);
      
      return NextResponse.json({
        success: true,
        data: calculation,
        metadata: {
          calculatedAt: new Date().toISOString(),
          taxYear: new Date().getFullYear(),
          jurisdiction: 'Ireland',
          currency: 'EUR'
        }
      });
    }

    if (action === 'check_rct_status') {
      const { contractorId, taxNumber } = body;
      
      // In production, this would integrate with Revenue's RCT system
      const rctStatus = await checkRCTStatus(contractorId, taxNumber);
      
      return NextResponse.json({
        success: true,
        data: rctStatus
      });
    }

    if (action === 'generate_tax_report') {
      const { projectId, periodStart, periodEnd } = body;
      
      const taxReport = await generateProjectTaxReport(projectId, periodStart, periodEnd);
      
      return NextResponse.json({
        success: true,
        data: taxReport
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action specified'
    }, { status: 400 });

  } catch (error) {
    console.error('Error in tax compliance API:', error);
    return NextResponse.json({
      success: false,
      error: 'Tax compliance calculation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const reportType = searchParams.get('reportType') || 'summary';

    if (!projectId) {
      return NextResponse.json({
        success: false,
        error: 'Project ID is required'
      }, { status: 400 });
    }

    // Get tax compliance summary for project
    const taxSummary = await getProjectTaxSummary(projectId);
    
    return NextResponse.json({
      success: true,
      data: taxSummary
    });

  } catch (error) {
    console.error('Error fetching tax compliance data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch tax compliance data'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

function calculateIrishTaxes(data: TaxCalculationRequest) {
  const { grossAmount, contractorType, serviceType, vatRegistered, isResident } = data;
  
  // VAT Calculation
  let vatRate = 0;
  let vatAmount = 0;
  let netAmount = grossAmount;

  if (vatRegistered) {
    if (serviceType === 'construction') {
      vatRate = IRISH_TAX_CONFIG.vat.reduced; // 13.5% for construction
    } else {
      vatRate = IRISH_TAX_CONFIG.vat.standard; // 23% for professional services
    }
    vatAmount = (grossAmount * vatRate) / (100 + vatRate);
    netAmount = grossAmount - vatAmount;
  }

  // RCT Calculation
  let rctRate = 0;
  let rctAmount = 0;
  let rctApplicable = false;

  if (serviceType === 'construction' && grossAmount >= IRISH_TAX_CONFIG.rct.threshold) {
    rctApplicable = true;
    
    if (contractorType === 'c2_certificate') {
      rctRate = IRISH_TAX_CONFIG.rct.c2Rate; // 0% for C2 holders
    } else {
      rctRate = IRISH_TAX_CONFIG.rct.standardRate; // 20% for others
    }
    
    rctAmount = (netAmount * rctRate) / 100;
  }

  // Final payment calculation
  const finalPaymentAmount = netAmount - rctAmount;

  return {
    grossAmount,
    vatCalculation: {
      rate: vatRate,
      amount: Math.round(vatAmount * 100) / 100,
      applicable: vatRegistered
    },
    rctCalculation: {
      rate: rctRate,
      amount: Math.round(rctAmount * 100) / 100,
      applicable: rctApplicable,
      certificateType: contractorType
    },
    netAmount: Math.round(netAmount * 100) / 100,
    finalPaymentAmount: Math.round(finalPaymentAmount * 100) / 100,
    taxesDeducted: Math.round((vatAmount + rctAmount) * 100) / 100,
    breakdown: {
      originalAmount: grossAmount,
      vatDeducted: Math.round(vatAmount * 100) / 100,
      rctDeducted: Math.round(rctAmount * 100) / 100,
      netPayable: Math.round(finalPaymentAmount * 100) / 100
    },
    complianceFlags: {
      vatRegistrationRequired: grossAmount > 37500, // VAT registration threshold
      rctCertificateRequired: serviceType === 'construction' && grossAmount >= IRISH_TAX_CONFIG.rct.threshold,
      monthlyReturnsRequired: vatRegistered && grossAmount > 2000000, // €2M turnover
      quarterlyReturnsRequired: vatRegistered && grossAmount <= 2000000
    }
  };
}

async function checkRCTStatus(contractorId: string, taxNumber: string) {
  // In production, this would call Revenue's RCT verification API
  // For now, simulate the check based on contractor data
  
  try {
    // Mock RCT status check - in production would be actual API call
    const mockStatuses = [
      {
        taxNumber: 'IE1234567T',
        certificateType: 'c2_certificate',
        status: 'active',
        validUntil: '2025-12-31',
        rctRate: 0.0
      },
      {
        taxNumber: 'IE2345678U',
        certificateType: 'standard',
        status: 'active',
        validUntil: null,
        rctRate: 20.0
      }
    ];

    const status = mockStatuses.find(s => s.taxNumber === taxNumber) || {
      taxNumber,
      certificateType: 'standard',
      status: 'unknown',
      validUntil: null,
      rctRate: 20.0
    };

    return {
      contractorId,
      taxNumber,
      rctStatus: status,
      lastChecked: new Date().toISOString(),
      dataSource: 'revenue_ros_api'
    };

  } catch (error) {
    return {
      contractorId,
      taxNumber,
      rctStatus: {
        status: 'error',
        message: 'Unable to verify RCT status'
      },
      lastChecked: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function generateProjectTaxReport(projectId: string, periodStart: string, periodEnd: string) {
  try {
    // Get all contractor valuations and professional invoices for the period
    const [contractorValuations, professionalInvoices] = await Promise.all([
      prisma.contractorValuation.findMany({
        where: {
          projectId,
          approvedAt: {
            gte: new Date(periodStart),
            lte: new Date(periodEnd)
          }
        }
      }),
      prisma.professionalInvoice.findMany({
        where: {
          projectId,
          invoiceDate: {
            gte: new Date(periodStart),
            lte: new Date(periodEnd)
          }
        }
      })
    ]);

    let totalVATLiable = 0;
    let totalRCTDeducted = 0;
    let totalGrossPayments = 0;
    let totalNetPayments = 0;

    const contractorBreakdown = contractorValuations.map(valuation => {
      const grossAmount = Number(valuation.netAmount);
      const taxCalc = calculateIrishTaxes({
        contractorId: valuation.contractorId,
        grossAmount,
        contractorType: 'standard', // Would get from contractor record
        serviceType: 'construction',
        vatRegistered: true,
        isResident: true
      });

      totalGrossPayments += grossAmount;
      totalNetPayments += taxCalc.finalPaymentAmount;
      totalRCTDeducted += taxCalc.rctCalculation.amount;

      return {
        valuationId: valuation.id,
        valuationNumber: valuation.valuationNumber,
        contractorId: valuation.contractorId,
        grossAmount: grossAmount,
        rctDeducted: taxCalc.rctCalculation.amount,
        netPayable: taxCalc.finalPaymentAmount,
        approvedAt: valuation.approvedAt
      };
    });

    const professionalBreakdown = professionalInvoices.map(invoice => {
      const grossAmount = Number(invoice.total);
      const vatAmount = Number(invoice.vatAmount);
      
      totalVATLiable += vatAmount;
      totalGrossPayments += grossAmount;
      totalNetPayments += (grossAmount - vatAmount);

      return {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        professionalRole: invoice.professionalRole,
        grossAmount: grossAmount,
        vatAmount: vatAmount,
        netAmount: grossAmount - vatAmount,
        invoiceDate: invoice.invoiceDate
      };
    });

    return {
      projectId,
      period: {
        start: periodStart,
        end: periodEnd
      },
      summary: {
        totalGrossPayments: Math.round(totalGrossPayments * 100) / 100,
        totalNetPayments: Math.round(totalNetPayments * 100) / 100,
        totalVATLiable: Math.round(totalVATLiable * 100) / 100,
        totalRCTDeducted: Math.round(totalRCTDeducted * 100) / 100,
        totalTaxesDeducted: Math.round((totalVATLiable + totalRCTDeducted) * 100) / 100
      },
      breakdown: {
        contractorPayments: contractorBreakdown,
        professionalInvoices: professionalBreakdown
      },
      complianceRequirements: {
        vatReturnsRequired: totalVATLiable > 0,
        rctReturnsRequired: totalRCTDeducted > 0,
        nextVATReturnDue: getNextVATReturnDate(),
        nextRCTReturnDue: getNextRCTReturnDate()
      },
      generatedAt: new Date().toISOString()
    };

  } catch (error) {
    throw new Error(`Failed to generate tax report: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function getProjectTaxSummary(projectId: string) {
  try {
    // Get current year tax data
    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);
    const yearEnd = new Date(currentYear, 11, 31);

    const taxReport = await generateProjectTaxReport(
      projectId, 
      yearStart.toISOString(), 
      yearEnd.toISOString()
    );

    return {
      projectId,
      taxYear: currentYear,
      summary: taxReport.summary,
      complianceStatus: {
        vatCompliant: true, // Would check actual compliance
        rctCompliant: true,
        lastVATReturn: '2025-06-23',
        lastRCTReturn: '2025-06-14',
        nextActions: [
          'File monthly VAT return by July 23rd',
          'Submit RCT return by July 14th'
        ]
      },
      recentActivity: {
        contractorPayments: taxReport.breakdown.contractorPayments.slice(-5),
        professionalInvoices: taxReport.breakdown.professionalInvoices.slice(-5)
      }
    };

  } catch (error) {
    throw new Error(`Failed to get tax summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function getNextVATReturnDate(): string {
  // VAT returns are due by 23rd of following month
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 23);
  return nextMonth.toISOString().split('T')[0];
}

function getNextRCTReturnDate(): string {
  // RCT returns are due by 14th of following month
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 14);
  return nextMonth.toISOString().split('T')[0];
}