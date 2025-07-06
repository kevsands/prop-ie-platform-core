import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const projectId = searchParams.get('projectId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');

    const where: any = {};

    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }

    if (type && type !== 'all') {
      where.type = type.toUpperCase();
    }

    if (projectId) {
      where.OR = [
        { projectId: projectId },
        { developmentId: projectId }
      ];
    }

    if (search) {
      where.OR = [
        { number: { contains: search, mode: 'insensitive' } },
        { clientName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const skip = (page - 1) * limit;

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          lineItems: true,
          payments: true,
          project: {
            select: { name: true }
          },
          development: {
            select: { name: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.invoice.count({ where })
    ]);

    return NextResponse.json({
      invoices,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      type,
      clientName,
      clientEmail,
      clientAddress,
      projectId,
      developmentId,
      description,
      dueDate,
      lineItems,
      taxRate,
      notes,
      termsConditions,
      createdBy
    } = body;

    // Calculate totals
    const subtotal = lineItems.reduce((sum: number, item: any) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);

    const taxAmount = taxRate ? (subtotal * taxRate / 100) : 0;
    const totalAmount = subtotal + taxAmount;

    // Generate invoice number
    const lastInvoice = await prisma.invoice.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { number: true }
    });

    const currentYear = new Date().getFullYear();
    const nextNumber = lastInvoice 
      ? parseInt(lastInvoice.number.split('-')[2]) + 1 
      : 1;
    const invoiceNumber = `INV-${currentYear}-${nextNumber.toString().padStart(3, '0')}`;

    const invoice = await prisma.invoice.create({
      data: {
        number: invoiceNumber,
        type: type.toUpperCase(),
        clientName,
        clientEmail,
        clientAddress,
        projectId,
        developmentId,
        description,
        dueDate: new Date(dueDate),
        subtotal,
        taxRate,
        taxAmount,
        totalAmount,
        notes,
        termsConditions,
        createdBy,
        lineItems: {
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

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}