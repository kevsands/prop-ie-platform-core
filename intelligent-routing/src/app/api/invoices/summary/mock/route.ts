import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock summary data that makes sense for a developer
    const summary = {
      overview: {
        totalInvoices: 15,
        totalReceivables: 875000, // Money coming in
        totalPayables: 580000,   // Money going out
        totalPaid: 503750,       // Already paid
        totalOverdue: 45000,     // Overdue amount
        draftCount: 3
      },
      breakdown: {
        receivables: {
          count: 8,
          amount: 875000
        },
        payables: {
          count: 7,
          amount: 580000
        },
        paid: {
          count: 6,
          amount: 503750
        },
        overdue: {
          count: 1,
          amount: 45000
        }
      },
      recentInvoices: [
        {
          id: '5',
          number: 'INV-2025-005',
          clientName: 'HTB Scheme Administration',
          totalAmount: 125000,
          status: 'SENT',
          type: 'RECEIVABLE',
          development: { name: 'Multiple Projects' }
        },
        {
          id: '3',
          number: 'INV-2025-003',
          clientName: 'First Time Buyer - Unit 12',
          totalAmount: 350000,
          status: 'PAID',
          type: 'RECEIVABLE',
          development: { name: 'Ballymakenny View' }
        },
        {
          id: '2',
          number: 'INV-2025-002',
          clientName: 'O\'Brien Property Sales',
          totalAmount: 104550,
          status: 'SENT',
          type: 'PAYABLE',
          development: { name: 'Ellwood Development' }
        }
      ],
      monthlyTrends: {
        '2024-08': { amount: 125000, count: 2 },
        '2024-09': { amount: 230000, count: 3 },
        '2024-10': { amount: 180000, count: 2 },
        '2024-11': { amount: 420000, count: 4 },
        '2024-12': { amount: 320000, count: 3 },
        '2025-01': { amount: 580000, count: 6 }
      }
    };

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error fetching mock invoice summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoice summary' },
      { status: 500 }
    );
  }
}