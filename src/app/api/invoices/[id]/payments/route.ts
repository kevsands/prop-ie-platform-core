import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payments = await prisma.invoicePayment.findMany({
      where: { invoiceId: params.id },
      orderBy: { paymentDate: 'desc' }
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error('Error fetching invoice payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      amount,
      paymentMethod,
      paymentDate,
      reference,
      notes,
      recordedBy
    } = body;

    // Create payment record
    const payment = await prisma.invoicePayment.create({
      data: {
        invoiceId: params.id,
        amount,
        paymentMethod: paymentMethod.toUpperCase(),
        paymentDate: new Date(paymentDate),
        reference,
        notes,
        recordedBy
      }
    });

    // Check if invoice is fully paid
    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: { payments: true }
    });

    if (invoice) {
      const totalPaid = invoice.payments.reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0);
      const invoiceTotal = parseFloat(invoice.totalAmount.toString());

      if (totalPaid >= invoiceTotal) {
        await prisma.invoice.update({
          where: { id: params.id },
          data: { 
            status: 'PAID',
            paidDate: new Date()
          }
        });
      } else if (totalPaid > 0) {
        await prisma.invoice.update({
          where: { id: params.id },
          data: { status: 'PARTIALLY_PAID' }
        });
      }
    }

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}