import { NextRequest, NextResponse } from 'next/server';

// Mock payment recording
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Create a mock payment record
    const payment = {
      id: `pay-${Date.now()}`,
      amount: body.amount,
      currency: 'EUR',
      paymentDate: body.paymentDate || new Date().toISOString(),
      paymentMethod: body.paymentMethod || 'BANK_TRANSFER',
      reference: body.reference || '',
      notes: body.notes || '',
      status: 'COMPLETED',
      recordedBy: body.recordedBy || 'current-user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // In a real app, this would update the database
    console.log(`Mock payment recorded for invoice ${params.id}:`, payment);

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('Error recording mock payment:', error);
    return NextResponse.json(
      { error: 'Failed to record payment' },
      { status: 500 }
    );
  }
}