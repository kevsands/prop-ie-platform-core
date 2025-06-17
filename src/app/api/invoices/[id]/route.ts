import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: {
        lineItems: true,
        payments: true,
        project: {
          select: { id: true, name: true }
        },
        development: {
          select: { id: true, name: true }
        },
        documents: true
      }
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
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
    const {
      clientName,
      clientEmail,
      clientAddress,
      description,
      dueDate,
      lineItems,
      taxRate,
      notes,
      termsConditions,
      status
    } = body;

    // Calculate totals
    const subtotal = lineItems.reduce((sum: number, item: any) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);

    const taxAmount = taxRate ? (subtotal * taxRate / 100) : 0;
    const totalAmount = subtotal + taxAmount;

    // Update invoice
    const invoice = await prisma.invoice.update({
      where: { id: params.id },
      data: {
        clientName,
        clientEmail,
        clientAddress,
        description,
        dueDate: new Date(dueDate),
        subtotal,
        taxRate,
        taxAmount,
        totalAmount,
        notes,
        termsConditions,
        status: status?.toUpperCase(),
        lineItems: {
          deleteMany: {},
          create: lineItems.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            lineTotal: item.quantity * item.unitPrice,
            category: item.category,
            taxRate: item.taxRate
          }))
        }
      },
      include: {
        lineItems: true,
        project: true,
        development: true
      }
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Error updating invoice:', error);
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
    await prisma.invoice.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json(
      { error: 'Failed to delete invoice' },
      { status: 500 }
    );
  }
}