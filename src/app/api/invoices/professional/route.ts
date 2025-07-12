/**
 * Professional Invoice API Endpoints
 * 
 * Handles CRUD operations for professional service invoices
 * Supports architect, engineer, QS, and consultant billing
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schemas
const ProfessionalInvoiceSchema = z.object({
  professionalId: z.string(),
  professionalName: z.string(),
  professionalRole: z.string(),
  company: z.string(),
  projectId: z.string(),
  appointmentId: z.string(),
  
  lineItems: z.array(z.object({
    description: z.string(),
    quantity: z.number(),
    rate: z.number(),
    amount: z.number(),
    category: z.string()
  })),
  
  subtotal: z.number(),
  vatRate: z.number(),
  vatAmount: z.number(),
  total: z.number(),
  
  issueDate: z.string(),
  dueDate: z.string(),
  periodFrom: z.string(),
  periodTo: z.string(),
  
  serviceType: z.enum(['design', 'construction_admin', 'project_management', 'consultancy', 'inspection']),
  workDescription: z.string(),
  hoursWorked: z.number().optional(),
  milestoneReference: z.string().optional(),
  
  attachments: z.array(z.string()).default([]),
  notes: z.string().optional(),
  
  paymentTerms: z.number(),
  retentionPercentage: z.number().optional(),
  
  professionalEmail: z.string().email(),
  professionalPhone: z.string(),
  vatNumber: z.string().optional(),
  professionalAddress: z.string()
});

// Mock data for professional invoices
const mockProfessionalInvoices = [
  {
    id: 'INV-ARCH-2024-001',
    invoiceNumber: 'JS-ARCH-001',
    professionalId: 'prof-001',
    professionalName: 'Jane Smith',
    professionalRole: 'Principal Architect',
    company: 'Smith & Associates Architects',
    projectId: 'fitzgerald-gardens',
    appointmentId: 'APPT-ARCH-001',
    
    lineItems: [
      {
        id: 'li-001',
        description: 'Design Development - Residential Units',
        quantity: 120,
        unit: 'hours',
        rate: 85.00,
        amount: 10200.00,
        category: 'Design Services',
        milestoneReference: 'Stage 3 - Design Development'
      },
      {
        id: 'li-002',
        description: 'Planning Application Preparation',
        quantity: 40,
        unit: 'hours',
        rate: 95.00,
        amount: 3800.00,
        category: 'Planning Services',
        milestoneReference: 'Stage 2 - Planning'
      },
      {
        id: 'li-003',
        description: 'Site Meetings and Coordination',
        quantity: 24,
        unit: 'hours',
        rate: 75.00,
        amount: 1800.00,
        category: 'Project Management',
        milestoneReference: 'Ongoing - Site Supervision'
      }
    ],
    
    subtotal: 15800.00,
    vatRate: 0.23,
    vatAmount: 3634.00,
    total: 19434.00,
    currency: 'EUR',
    
    issueDate: new Date('2024-11-15'),
    dueDate: new Date('2024-12-15'),
    periodFrom: new Date('2024-10-01'),
    periodTo: new Date('2024-10-31'),
    
    status: 'submitted' as const,
    submittedAt: new Date('2024-11-15'),
    
    serviceType: 'design' as const,
    workDescription: 'Architectural design services for residential development including design development, planning application, and site coordination.',
    hoursWorked: 184,
    milestoneReference: 'Stage 3 Completion',
    
    attachments: [
      'design-drawings-v3.pdf',
      'planning-application.pdf',
      'site-meeting-minutes.pdf'
    ],
    notes: 'Invoice covers Stage 3 Design Development completion and planning application submission.',
    
    paymentTerms: 30,
    retentionPercentage: 5,
    retentionAmount: 792.00,
    
    professionalEmail: 'jane.smith@smitharchitects.ie',
    professionalPhone: '+353 1 234 5678',
    vatNumber: 'IE9876543P',
    professionalAddress: '123 Grafton Street, Dublin 2, Ireland'
  },
  {
    id: 'INV-ENG-2024-002',
    invoiceNumber: 'MOB-STR-002',
    professionalId: 'prof-002',
    professionalName: 'Michael O\'Brien',
    professionalRole: 'Structural Engineer',
    company: 'O\'Brien Structural Engineering',
    projectId: 'fitzgerald-gardens',
    appointmentId: 'APPT-STR-001',
    
    lineItems: [
      {
        id: 'li-004',
        description: 'Structural Analysis - Foundation Design',
        quantity: 60,
        unit: 'hours',
        rate: 110.00,
        amount: 6600.00,
        category: 'Structural Design',
        milestoneReference: 'Foundation Design Complete'
      },
      {
        id: 'li-005',
        description: 'Steel Frame Calculations',
        quantity: 45,
        unit: 'hours',
        rate: 115.00,
        amount: 5175.00,
        category: 'Structural Design',
        milestoneReference: 'Superstructure Design'
      },
      {
        id: 'li-006',
        description: 'Site Inspections - Foundation',
        quantity: 8,
        unit: 'visits',
        rate: 180.00,
        amount: 1440.00,
        category: 'Site Services',
        milestoneReference: 'Construction Phase Services'
      }
    ],
    
    subtotal: 13215.00,
    vatRate: 0.23,
    vatAmount: 3039.45,
    total: 16254.45,
    currency: 'EUR',
    
    issueDate: new Date('2024-11-20'),
    dueDate: new Date('2024-12-20'),
    periodFrom: new Date('2024-10-15'),
    periodTo: new Date('2024-11-15'),
    
    status: 'under_review' as const,
    submittedAt: new Date('2024-11-20'),
    
    serviceType: 'design' as const,
    workDescription: 'Structural engineering services including foundation design, steel frame calculations, and construction phase inspections.',
    hoursWorked: 113,
    milestoneReference: 'Foundation Phase Complete',
    
    attachments: [
      'structural-calculations.pdf',
      'foundation-drawings.pdf',
      'inspection-reports.pdf'
    ],
    notes: 'Foundation design complete, proceeding with superstructure detailed design.',
    
    paymentTerms: 30,
    retentionPercentage: 5,
    retentionAmount: 660.75,
    
    professionalEmail: 'michael@obrienstructural.ie',
    professionalPhone: '+353 21 987 6543',
    vatNumber: 'IE8765432M',
    professionalAddress: '45 Patrick Street, Cork, Ireland'
  },
  {
    id: 'INV-QS-2024-003',
    invoiceNumber: 'SK-QS-003',
    professionalId: 'prof-003',
    professionalName: 'Sarah Kelly',
    professionalRole: 'Quantity Surveyor',
    company: 'Kelly Cost Consultancy',
    projectId: 'fitzgerald-gardens',
    appointmentId: 'APPT-QS-001',
    
    lineItems: [
      {
        id: 'li-007',
        description: 'Final Account Preparation',
        quantity: 45,
        unit: 'hours',
        rate: 95.00,
        amount: 4275.00,
        category: 'Cost Management',
        milestoneReference: 'Final Account - Phase 1'
      },
      {
        id: 'li-008',
        description: 'Variation Assessment and Pricing',
        quantity: 28,
        unit: 'hours',
        rate: 90.00,
        amount: 2520.00,
        category: 'Variation Management',
        milestoneReference: 'Variation Orders 15-22'
      },
      {
        id: 'li-009',
        description: 'Cost Reporting and Analysis',
        quantity: 15,
        unit: 'hours',
        rate: 85.00,
        amount: 1275.00,
        category: 'Reporting',
        milestoneReference: 'Monthly Cost Reports'
      }
    ],
    
    subtotal: 8070.00,
    vatRate: 0.23,
    vatAmount: 1856.10,
    total: 9926.10,
    currency: 'EUR',
    
    issueDate: new Date('2024-11-25'),
    dueDate: new Date('2024-12-25'),
    periodFrom: new Date('2024-11-01'),
    periodTo: new Date('2024-11-30'),
    
    status: 'approved' as const,
    submittedAt: new Date('2024-11-25'),
    reviewedAt: new Date('2024-11-28'),
    reviewedBy: 'Project Manager - David Wilson',
    
    serviceType: 'consultancy' as const,
    workDescription: 'Quantity surveying services including final account preparation, variation assessment, and cost reporting.',
    hoursWorked: 88,
    milestoneReference: 'Final Account Complete',
    
    attachments: [
      'final-account-summary.pdf',
      'variation-assessments.pdf',
      'cost-reports-nov.pdf'
    ],
    notes: 'Final account preparation complete. All variations assessed and priced.',
    reviewNotes: 'Approved - comprehensive final account documentation provided.',
    
    paymentTerms: 30,
    retentionPercentage: 0, // Final account - no retention
    
    professionalEmail: 'sarah@kellycost.ie',
    professionalPhone: '+353 1 456 7890',
    vatNumber: 'IE7654321S',
    professionalAddress: '78 Dame Street, Dublin 2, Ireland'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status');
    const professionalRole = searchParams.get('professionalRole');
    
    let filteredInvoices = mockProfessionalInvoices;
    
    if (projectId) {
      filteredInvoices = filteredInvoices.filter(inv => inv.projectId === projectId);
    }
    
    if (status) {
      filteredInvoices = filteredInvoices.filter(inv => inv.status === status);
    }
    
    if (professionalRole) {
      filteredInvoices = filteredInvoices.filter(inv => 
        inv.professionalRole.toLowerCase().includes(professionalRole.toLowerCase())
      );
    }
    
    return NextResponse.json({
      success: true,
      data: filteredInvoices,
      summary: {
        totalInvoices: filteredInvoices.length,
        totalValue: filteredInvoices.reduce((sum, inv) => sum + inv.total, 0),
        statusBreakdown: {
          draft: filteredInvoices.filter(inv => inv.status === 'draft').length,
          submitted: filteredInvoices.filter(inv => inv.status === 'submitted').length,
          under_review: filteredInvoices.filter(inv => inv.status === 'under_review').length,
          approved: filteredInvoices.filter(inv => inv.status === 'approved').length,
          paid: filteredInvoices.filter(inv => inv.status === 'paid').length,
          rejected: filteredInvoices.filter(inv => inv.status === 'rejected').length
        }
      }
    });
    
  } catch (error) {
    console.error('Error fetching professional invoices:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch professional invoices' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = ProfessionalInvoiceSchema.parse(body);
    
    // Generate new invoice
    const newInvoice = {
      id: `INV-${Date.now()}`,
      invoiceNumber: `${validatedData.professionalName.split(' ').map(n => n[0]).join('')}-${Date.now()}`,
      ...validatedData,
      status: 'draft' as const,
      issueDate: new Date(validatedData.issueDate),
      dueDate: new Date(validatedData.dueDate),
      periodFrom: new Date(validatedData.periodFrom),
      periodTo: new Date(validatedData.periodTo)
    };
    
    // In real implementation, save to database
    // await prisma.professionalInvoice.create({ data: newInvoice });
    
    return NextResponse.json({
      success: true,
      data: newInvoice,
      message: 'Professional invoice created successfully'
    });
    
  } catch (error) {
    console.error('Error creating professional invoice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create professional invoice' },
      { status: 500 }
    );
  }
}