/**
 * Professional Invoice Review API
 * 
 * Handles review workflow for professional service invoices
 * Supports approval, rejection, and status updates
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const ReviewInvoiceSchema = z.object({
  action: z.enum(['approve', 'reject', 'request_changes']),
  reviewNotes: z.string().optional(),
  rejectionReason: z.string().optional(),
  reviewedBy: z.string(),
  paymentDate: z.string().optional() // For approved invoices
});

export async function PUT(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: invoiceId } = await params;
    const body = await request.json();
    const { action, reviewNotes, rejectionReason, reviewedBy, paymentDate } = ReviewInvoiceSchema.parse(body);
    
    // In real implementation, update invoice in database
    // const invoice = await prisma.professionalInvoice.update({
    //   where: { id: invoiceId },
    //   data: {
    //     status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'under_review',
    //     reviewedAt: new Date(),
    //     reviewedBy,
    //     reviewNotes,
    //     rejectionReason: action === 'reject' ? rejectionReason : undefined,
    //     paidAt: action === 'approve' && paymentDate ? new Date(paymentDate) : undefined
    //   }
    // });
    
    // Mock response for development
    const updatedInvoice = {
      id: invoiceId,
      status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'under_review',
      reviewedAt: new Date(),
      reviewedBy,
      reviewNotes,
      rejectionReason: action === 'reject' ? rejectionReason : undefined,
      paidAt: action === 'approve' && paymentDate ? new Date(paymentDate) : undefined
    };
    
    return NextResponse.json({
      success: true,
      data: updatedInvoice,
      message: `Invoice ${action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'updated'} successfully`
    });
    
  } catch (error) {
    console.error('Error reviewing professional invoice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to review professional invoice' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: invoiceId } = await params;
    
    // In real implementation, fetch from database
    // const invoice = await prisma.professionalInvoice.findUnique({
    //   where: { id: invoiceId },
    //   include: { professional: true, project: true }
    // });
    
    // Mock invoice for development
    const mockInvoice = {
      id: invoiceId,
      invoiceNumber: 'JS-ARCH-001',
      professionalName: 'Jane Smith',
      professionalRole: 'Principal Architect',
      company: 'Smith & Associates Architects',
      total: 19434.00,
      status: 'submitted',
      submittedAt: new Date('2024-11-15'),
      workDescription: 'Architectural design services for residential development',
      attachments: ['design-drawings-v3.pdf', 'planning-application.pdf']
    };
    
    return NextResponse.json({
      success: true,
      data: mockInvoice
    });
    
  } catch (error) {
    console.error('Error fetching professional invoice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch professional invoice' },
      { status: 500 }
    );
  }
}