import { NextRequest, NextResponse } from 'next/server';

// Mock invoice data (in real app, this would be in database)
let mockInvoices = [
  {
    id: '1',
    number: 'INV-2025-001',
    type: 'PAYABLE',
    status: 'PAID',
    clientName: 'McCarthy Construction Ltd',
    clientEmail: 'contracts@mccarthyconstruction.ie',
    clientAddress: '123 Construction Avenue, Dublin 4',
    projectId: null,
    developmentId: 'dev-1',
    project: null,
    development: { id: 'dev-1', name: 'Fitzgerald Gardens' },
    subtotal: 125000,
    taxRate: 23,
    taxAmount: 28750,
    totalAmount: 153750,
    currency: 'EUR',
    issueDate: '2024-12-15T00:00:00Z',
    dueDate: '2025-01-15T00:00:00Z',
    paidDate: '2025-01-10T00:00:00Z',
    description: 'Construction Phase 1 - Foundation & Structure',
    notes: 'Payment received on time',
    createdBy: 'user-1',
    createdAt: '2024-12-15T10:00:00Z',
    updatedAt: '2025-01-10T14:30:00Z',
    lineItems: [
      {
        id: 'li-1',
        description: 'Foundation work',
        quantity: 1,
        unitPrice: 75000,
        lineTotal: 75000,
        category: 'Construction'
      },
      {
        id: 'li-2', 
        description: 'Structural framework',
        quantity: 1,
        unitPrice: 50000,
        lineTotal: 50000,
        category: 'Construction'
      }
    ],
    payments: [
      {
        id: 'pay-1',
        amount: 153750,
        currency: 'EUR',
        paymentDate: '2025-01-10T00:00:00Z',
        paymentMethod: 'BANK_TRANSFER',
        reference: 'TXN-2025-001',
        status: 'COMPLETED'
      }
    ]
  },
  {
    id: '4',
    number: 'INV-2025-004',
    type: 'PAYABLE',
    status: 'OVERDUE',
    clientName: 'Dublin City Council',
    clientEmail: 'developmentlevies@dublincity.ie',
    clientAddress: 'Civic Offices, Wood Quay, Dublin 8',
    projectId: null,
    developmentId: 'dev-1',
    project: null,
    development: { id: 'dev-1', name: 'Fitzgerald Gardens' },
    subtotal: 45000,
    taxRate: 0,
    taxAmount: 0,
    totalAmount: 45000,
    currency: 'EUR',
    issueDate: '2024-12-01T00:00:00Z',
    dueDate: '2025-01-05T00:00:00Z',
    paidDate: null,
    description: 'Development Levy & Bonds',
    notes: 'Payment overdue - follow up required',
    createdBy: 'user-1',
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2024-12-01T10:00:00Z',
    lineItems: [
      {
        id: 'li-5',
        description: 'Development contribution levy',
        quantity: 1,
        unitPrice: 30000,
        lineTotal: 30000,
        category: 'Levies'
      },
      {
        id: 'li-6',
        description: 'Performance bond',
        quantity: 1,
        unitPrice: 15000,
        lineTotal: 15000,
        category: 'Bonds'
      }
    ],
    payments: []
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoice = mockInvoices.find(inv => inv.id === params.id);
    
    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Error fetching mock invoice:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoice' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const invoiceIndex = mockInvoices.findIndex(inv => inv.id === params.id);
    
    if (invoiceIndex === -1) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Update the invoice
    mockInvoices[invoiceIndex] = {
      ...mockInvoices[invoiceIndex],
      ...body,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(mockInvoices[invoiceIndex]);
  } catch (error) {
    console.error('Error updating mock invoice:', error);
    return NextResponse.json(
      { error: 'Failed to update invoice' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoiceIndex = mockInvoices.findIndex(inv => inv.id === params.id);
    
    if (invoiceIndex === -1) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    mockInvoices.splice(invoiceIndex, 1);

    return NextResponse.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Error deleting mock invoice:', error);
    return NextResponse.json(
      { error: 'Failed to delete invoice' },
      { status: 500 }
    );
  }
}