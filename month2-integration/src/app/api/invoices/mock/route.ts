import { NextRequest, NextResponse } from 'next/server';

// Mock data for testing
const mockInvoices = [
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
    id: '2',
    number: 'INV-2025-002',
    type: 'PAYABLE',
    status: 'SENT',
    clientName: 'O\'Brien Property Sales',
    clientEmail: 'accounts@obrienproperties.ie',
    clientAddress: '456 Estate Road, Cork',
    projectId: null,
    developmentId: 'dev-2',
    project: null,
    development: { id: 'dev-2', name: 'Ellwood Development' },
    subtotal: 85000,
    taxRate: 23,
    taxAmount: 19550,
    totalAmount: 104550,
    currency: 'EUR',
    issueDate: '2025-01-01T00:00:00Z',
    dueDate: '2025-01-30T00:00:00Z',
    paidDate: null,
    description: 'Sales Commission - Q4 2024',
    notes: 'Awaiting payment',
    createdBy: 'user-1',
    createdAt: '2025-01-01T09:00:00Z',
    updatedAt: '2025-01-01T09:00:00Z',
    lineItems: [
      {
        id: 'li-3',
        description: 'Sales commission 3%',
        quantity: 1,
        unitPrice: 85000,
        lineTotal: 85000,
        category: 'Sales'
      }
    ],
    payments: []
  },
  {
    id: '3',
    number: 'INV-2025-003',
    type: 'RECEIVABLE',
    status: 'PAID',
    clientName: 'First Time Buyer - Unit 12',
    clientEmail: 'buyer@example.com',
    clientAddress: '789 Buyer Street, Galway',
    projectId: null,
    developmentId: 'dev-3',
    project: null,
    development: { id: 'dev-3', name: 'Ballymakenny View' },
    subtotal: 350000,
    taxRate: 0,
    taxAmount: 0,
    totalAmount: 350000,
    currency: 'EUR',
    issueDate: '2025-01-10T00:00:00Z',
    dueDate: '2025-01-20T00:00:00Z',
    paidDate: '2025-01-18T00:00:00Z',
    description: 'Property Purchase - 3 Bed Semi-Detached',
    notes: 'Full payment received',
    createdBy: 'user-1',
    createdAt: '2025-01-10T11:00:00Z',
    updatedAt: '2025-01-18T15:45:00Z',
    lineItems: [
      {
        id: 'li-4',
        description: 'Property purchase price',
        quantity: 1,
        unitPrice: 350000,
        lineTotal: 350000,
        category: 'Property Sale'
      }
    ],
    payments: [
      {
        id: 'pay-2',
        amount: 350000,
        currency: 'EUR',
        paymentDate: '2025-01-18T00:00:00Z',
        paymentMethod: 'BANK_TRANSFER',
        reference: 'MORTGAGE-DRAWDOWN-2025-003',
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
  },
  {
    id: '5',
    number: 'INV-2025-005',
    type: 'RECEIVABLE',
    status: 'SENT',
    clientName: 'HTB Scheme Administration',
    clientEmail: 'claims@htb.gov.ie',
    clientAddress: 'Custom House, Dublin 1',
    projectId: null,
    developmentId: null,
    project: null,
    development: null,
    subtotal: 125000,
    taxRate: 0,
    taxAmount: 0,
    totalAmount: 125000,
    currency: 'EUR',
    issueDate: '2025-01-15T00:00:00Z',
    dueDate: '2025-02-01T00:00:00Z',
    paidDate: null,
    description: 'Help-to-Buy Scheme Claims - January 2025',
    notes: 'Awaiting government processing',
    createdBy: 'user-1',
    createdAt: '2025-01-15T14:00:00Z',
    updatedAt: '2025-01-15T14:00:00Z',
    lineItems: [
      {
        id: 'li-7',
        description: 'HTB scheme rebates - 5 properties',
        quantity: 5,
        unitPrice: 25000,
        lineTotal: 125000,
        category: 'Government Schemes'
      }
    ],
    payments: []
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    let filteredInvoices = [...mockInvoices];

    // Apply filters
    if (status && status !== 'all') {
      filteredInvoices = filteredInvoices.filter(inv => 
        inv.status.toLowerCase() === status.toLowerCase()
      );
    }

    if (type && type !== 'all') {
      filteredInvoices = filteredInvoices.filter(inv => 
        inv.type.toLowerCase() === type.toLowerCase()
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredInvoices = filteredInvoices.filter(inv =>
        inv.number.toLowerCase().includes(searchLower) ||
        inv.clientName.toLowerCase().includes(searchLower) ||
        inv.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply pagination
    const total = filteredInvoices.length;
    const skip = (page - 1) * limit;
    const paginatedInvoices = filteredInvoices.slice(skip, skip + limit);

    return NextResponse.json({
      invoices: paginatedInvoices,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching mock invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Generate a new mock invoice
    const newInvoice = {
      id: `mock-${Date.now()}`,
      number: `INV-2025-${String(mockInvoices.length + 1).padStart(3, '0')}`,
      type: body.type || 'RECEIVABLE',
      status: 'DRAFT',
      clientName: body.clientName || 'New Client',
      clientEmail: body.clientEmail,
      clientAddress: body.clientAddress,
      projectId: body.projectId,
      developmentId: body.developmentId,
      project: body.projectId ? { id: body.projectId, name: 'Mock Project' } : null,
      development: body.developmentId ? { id: body.developmentId, name: 'Mock Development' } : null,
      subtotal: body.subtotal || 0,
      taxRate: body.taxRate || 0,
      taxAmount: body.taxAmount || 0,
      totalAmount: body.totalAmount || 0,
      currency: 'EUR',
      issueDate: new Date().toISOString(),
      dueDate: body.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      paidDate: null,
      description: body.description || 'New Invoice',
      notes: body.notes,
      createdBy: body.createdBy || 'user-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lineItems: body.lineItems || [],
      payments: []
    };

    // Add to mock data
    mockInvoices.push(newInvoice);

    return NextResponse.json(newInvoice, { status: 201 });
  } catch (error) {
    console.error('Error creating mock invoice:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}