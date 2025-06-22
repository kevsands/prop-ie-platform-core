/**
 * Quantity Surveyor Cost Management API Routes
 * 
 * Month 2, Week 1 Implementation: Core Professional Roles
 * API endpoints for cost management, BOQ, valuations, and SCSI compliance
 * 
 * Endpoints:
 * - GET: Get cost data, BOQ, valuations, variations, cash flow, reports
 * - POST: Create BOQ, valuations, variations, cost reports
 * - PUT: Update cost elements, approve valuations
 * - DELETE: Archive cost data
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import CostManagementService from '@/services/CostManagementService';

const costManagement = new CostManagementService();

// Request schemas
const CreateBOQSchema = z.object({
  projectId: z.string().min(1),
  version: z.string().optional(),
  sections: z.array(z.object({
    code: z.string(),
    title: z.string(),
    description: z.string(),
    elements: z.array(z.object({
      code: z.string(),
      description: z.string(),
      category: z.enum(['preliminaries', 'substructure', 'superstructure', 'finishes', 'services', 'external_works', 'provisional']),
      unit: z.string(),
      quantity: z.number(),
      rate: z.number().optional()
    }))
  })).optional(),
  contingency: z.number().optional(),
  preliminaries: z.number().optional(),
  currency: z.enum(['EUR', 'GBP', 'USD']).optional()
});

const UpdateCostElementSchema = z.object({
  boqId: z.string(),
  elementId: z.string(),
  quantity: z.number().optional(),
  rate: z.number().optional(),
  status: z.enum(['estimated', 'tendered', 'agreed', 'certified', 'paid']).optional(),
  supplier: z.string().optional(),
  notes: z.array(z.string()).optional()
});

const CreateValuationSchema = z.object({
  projectId: z.string(),
  periodFrom: z.coerce.date(),
  periodTo: z.coerce.date(),
  workComplete: z.array(z.object({
    elementId: z.string(),
    quantityComplete: z.number(),
    rate: z.number()
  })),
  materialsOnSite: z.array(z.object({
    description: z.string(),
    quantity: z.number(),
    rate: z.number()
  })).optional(),
  retentionPercentage: z.number().optional(),
  variationsIncluded: z.array(z.string()).optional()
});

const CreateVariationSchema = z.object({
  projectId: z.string(),
  title: z.string().min(1),
  description: z.string(),
  category: z.enum(['design_change', 'additional_work', 'omission', 'acceleration', 'disruption', 'provisional_sum']),
  requestedBy: z.string(),
  justification: z.string(),
  impact: z.object({
    cost: z.number(),
    time: z.number(),
    resources: z.array(z.string())
  }),
  costBreakdown: z.array(z.object({
    description: z.string(),
    quantity: z.number(),
    rate: z.number(),
    unit: z.string()
  }))
});

const BOQPricingSchema = z.object({
  boqId: z.string(),
  pricing: z.record(z.object({
    rate: z.number(),
    notes: z.string().optional()
  }))
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const projectId = searchParams.get('projectId');
    const boqId = searchParams.get('boqId');
    const valuationId = searchParams.get('valuationId');
    const reportType = searchParams.get('reportType');

    switch (action) {
      case 'get_project_costs':
        if (!projectId) {
          return NextResponse.json(
            { error: 'Project ID is required' },
            { status: 400 }
          );
        }
        return await getProjectCosts(projectId);

      case 'get_boq':
        if (!projectId) {
          return NextResponse.json(
            { error: 'Project ID is required' },
            { status: 400 }
          );
        }
        return await getBOQ(projectId);

      case 'get_valuations':
        if (!projectId) {
          return NextResponse.json(
            { error: 'Project ID is required' },
            { status: 400 }
          );
        }
        return await getValuations(projectId);

      case 'get_variations':
        if (!projectId) {
          return NextResponse.json(
            { error: 'Project ID is required' },
            { status: 400 }
          );
        }
        return await getVariations(projectId);

      case 'get_cash_flow':
        if (!projectId) {
          return NextResponse.json(
            { error: 'Project ID is required' },
            { status: 400 }
          );
        }
        return await getCashFlow(projectId);

      case 'get_cost_kpis':
        if (!projectId) {
          return NextResponse.json(
            { error: 'Project ID is required' },
            { status: 400 }
          );
        }
        return await getCostKPIs(projectId);

      case 'get_cost_report':
        if (!projectId || !reportType) {
          return NextResponse.json(
            { error: 'Project ID and report type are required' },
            { status: 400 }
          );
        }
        return await getCostReport(projectId, reportType);

      case 'get_scsi_compliance':
        if (!projectId) {
          return NextResponse.json(
            { error: 'Project ID is required' },
            { status: 400 }
          );
        }
        return await getSCSICompliance(projectId);

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Cost Management API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'create_boq':
        const boqData = CreateBOQSchema.parse(body);
        return await createBOQ(boqData);

      case 'price_boq':
        const pricingData = BOQPricingSchema.parse(body);
        return await priceBOQ(pricingData);

      case 'create_valuation':
        const valuationData = CreateValuationSchema.parse(body);
        return await createValuation(valuationData);

      case 'create_variation':
        const variationData = CreateVariationSchema.parse(body);
        return await createVariation(variationData);

      case 'approve_valuation':
        const { valuationId, approvedBy } = body;
        if (!valuationId || !approvedBy) {
          return NextResponse.json(
            { error: 'Valuation ID and approver are required' },
            { status: 400 }
          );
        }
        return await approveValuation(valuationId, approvedBy);

      case 'approve_variation':
        const { variationId, approvedCost, approvedBy: variationApprover } = body;
        if (!variationId || approvedCost === undefined || !variationApprover) {
          return NextResponse.json(
            { error: 'Variation ID, approved cost, and approver are required' },
            { status: 400 }
          );
        }
        return await approveVariation(variationId, approvedCost, variationApprover);

      case 'generate_cash_flow':
        const { projectId, startDate, endDate } = body;
        if (!projectId || !startDate || !endDate) {
          return NextResponse.json(
            { error: 'Project ID, start date, and end date are required' },
            { status: 400 }
          );
        }
        return await generateCashFlow(projectId, new Date(startDate), new Date(endDate));

      case 'generate_report':
        const { projectId: reportProjectId, reportType } = body;
        if (!reportProjectId || !reportType) {
          return NextResponse.json(
            { error: 'Project ID and report type are required' },
            { status: 400 }
          );
        }
        return await generateReport(reportProjectId, reportType);

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Cost Management API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'update_cost_element':
        const elementData = UpdateCostElementSchema.parse(body);
        return await updateCostElement(elementData);

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Cost Management API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET action handlers
async function getProjectCosts(projectId: string) {
  try {
    const [boq, valuations, variations, cashFlow, kpis, compliance] = await Promise.all([
      costManagement.getProjectBOQ(projectId),
      costManagement.getProjectValuations(projectId),
      costManagement.getProjectVariations(projectId),
      costManagement.getProjectCashFlow(projectId),
      costManagement.calculateCostKPIs(projectId),
      costManagement.checkSCSICompliance(projectId)
    ]);

    const projectCosts = {
      projectId,
      boq,
      valuations,
      variations,
      cashFlow,
      kpis,
      compliance,
      summary: {
        totalBudget: boq?.grandTotal || 0,
        totalSpent: valuations.reduce((sum, v) => sum + (v.status === 'paid' ? v.netAmount : 0), 0),
        totalCommitted: valuations.reduce((sum, v) => sum + (v.status === 'approved' ? v.netAmount : 0), 0),
        variationsValue: variations.reduce((sum, v) => sum + (v.approvedCost || v.totalCost || 0), 0),
        completionPercentage: kpis.schedulePerformance || 0
      }
    };

    return NextResponse.json(projectCosts);
  } catch (error) {
    console.error('Error getting project costs:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve project costs' },
      { status: 500 }
    );
  }
}

async function getBOQ(projectId: string) {
  try {
    const boq = await costManagement.getProjectBOQ(projectId);
    return NextResponse.json({ boq });
  } catch (error) {
    console.error('Error getting BOQ:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve BOQ' },
      { status: 500 }
    );
  }
}

async function getValuations(projectId: string) {
  try {
    const valuations = await costManagement.getProjectValuations(projectId);
    return NextResponse.json({ valuations });
  } catch (error) {
    console.error('Error getting valuations:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve valuations' },
      { status: 500 }
    );
  }
}

async function getVariations(projectId: string) {
  try {
    const variations = await costManagement.getProjectVariations(projectId);
    return NextResponse.json({ variations });
  } catch (error) {
    console.error('Error getting variations:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve variations' },
      { status: 500 }
    );
  }
}

async function getCashFlow(projectId: string) {
  try {
    const cashFlow = await costManagement.getProjectCashFlow(projectId);
    return NextResponse.json({ cashFlow });
  } catch (error) {
    console.error('Error getting cash flow:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve cash flow' },
      { status: 500 }
    );
  }
}

async function getCostKPIs(projectId: string) {
  try {
    const kpis = await costManagement.calculateCostKPIs(projectId);
    return NextResponse.json({ kpis });
  } catch (error) {
    console.error('Error getting cost KPIs:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve cost KPIs' },
      { status: 500 }
    );
  }
}

async function getCostReport(projectId: string, reportType: string) {
  try {
    const report = await costManagement.generateCostReport(projectId, reportType as any);
    return NextResponse.json({ report });
  } catch (error) {
    console.error('Error getting cost report:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve cost report' },
      { status: 500 }
    );
  }
}

async function getSCSICompliance(projectId: string) {
  try {
    const compliance = await costManagement.checkSCSICompliance(projectId);
    return NextResponse.json({ compliance });
  } catch (error) {
    console.error('Error getting SCSI compliance:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve SCSI compliance' },
      { status: 500 }
    );
  }
}

// POST action handlers
async function createBOQ(data: z.infer<typeof CreateBOQSchema>) {
  try {
    const boq = await costManagement.createBOQ(data.projectId, data);
    return NextResponse.json({ 
      success: true, 
      message: 'BOQ created successfully',
      boq 
    });
  } catch (error) {
    console.error('Error creating BOQ:', error);
    return NextResponse.json(
      { error: 'Failed to create BOQ' },
      { status: 500 }
    );
  }
}

async function priceBOQ(data: z.infer<typeof BOQPricingSchema>) {
  try {
    const boq = await costManagement.priceBOQ(data.boqId, data.pricing);
    return NextResponse.json({ 
      success: true, 
      message: 'BOQ priced successfully',
      boq 
    });
  } catch (error) {
    console.error('Error pricing BOQ:', error);
    return NextResponse.json(
      { error: 'Failed to price BOQ' },
      { status: 500 }
    );
  }
}

async function createValuation(data: z.infer<typeof CreateValuationSchema>) {
  try {
    const valuation = await costManagement.createValuation(data.projectId, data);
    return NextResponse.json({ 
      success: true, 
      message: 'Valuation created successfully',
      valuation 
    });
  } catch (error) {
    console.error('Error creating valuation:', error);
    return NextResponse.json(
      { error: 'Failed to create valuation' },
      { status: 500 }
    );
  }
}

async function createVariation(data: z.infer<typeof CreateVariationSchema>) {
  try {
    const variation = await costManagement.createVariation(data.projectId, data);
    return NextResponse.json({ 
      success: true, 
      message: 'Variation created successfully',
      variation 
    });
  } catch (error) {
    console.error('Error creating variation:', error);
    return NextResponse.json(
      { error: 'Failed to create variation' },
      { status: 500 }
    );
  }
}

async function approveValuation(valuationId: string, approvedBy: string) {
  try {
    const valuation = await costManagement.approveValuation(valuationId, approvedBy);
    return NextResponse.json({ 
      success: true, 
      message: 'Valuation approved successfully',
      valuation 
    });
  } catch (error) {
    console.error('Error approving valuation:', error);
    return NextResponse.json(
      { error: 'Failed to approve valuation' },
      { status: 500 }
    );
  }
}

async function approveVariation(variationId: string, approvedCost: number, approvedBy: string) {
  try {
    const variation = await costManagement.approveVariation(variationId, approvedCost, approvedBy);
    return NextResponse.json({ 
      success: true, 
      message: 'Variation approved successfully',
      variation 
    });
  } catch (error) {
    console.error('Error approving variation:', error);
    return NextResponse.json(
      { error: 'Failed to approve variation' },
      { status: 500 }
    );
  }
}

async function generateCashFlow(projectId: string, startDate: Date, endDate: Date) {
  try {
    const cashFlow = await costManagement.generateCashFlowProjection(projectId, startDate, endDate);
    return NextResponse.json({ 
      success: true, 
      message: 'Cash flow projection generated successfully',
      cashFlow 
    });
  } catch (error) {
    console.error('Error generating cash flow:', error);
    return NextResponse.json(
      { error: 'Failed to generate cash flow projection' },
      { status: 500 }
    );
  }
}

async function generateReport(projectId: string, reportType: string) {
  try {
    const report = await costManagement.generateCostReport(projectId, reportType as any);
    return NextResponse.json({ 
      success: true, 
      message: 'Cost report generated successfully',
      report 
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Failed to generate cost report' },
      { status: 500 }
    );
  }
}

// PUT action handlers
async function updateCostElement(data: z.infer<typeof UpdateCostElementSchema>) {
  try {
    const element = await costManagement.updateBOQElement(
      data.boqId, 
      data.elementId, 
      {
        quantity: data.quantity,
        rate: data.rate,
        status: data.status,
        supplier: data.supplier,
        notes: data.notes
      }
    );
    return NextResponse.json({ 
      success: true, 
      message: 'Cost element updated successfully',
      element 
    });
  } catch (error) {
    console.error('Error updating cost element:', error);
    return NextResponse.json(
      { error: 'Failed to update cost element' },
      { status: 500 }
    );
  }
}