import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const developerId = searchParams.get('developerId');
    const projectId = searchParams.get('projectId');

    const where: any = {};

    if (developerId) {
      where.development = {
        developerId: developerId
      };
    }

    if (projectId) {
      where.OR = [
        { projectId: projectId },
        { developmentId: projectId }
      ];
    }

    // Get summary statistics
    const [
      totalInvoices,
      receivableInvoices,
      payableInvoices,
      paidInvoices,
      overdueInvoices,
      draftInvoices
    ] = await Promise.all([
      prisma.invoice.count({ where }),
      prisma.invoice.aggregate({
        where: { ...where, type: 'RECEIVABLE' },
        _sum: { totalAmount: true },
        _count: true
      }),
      prisma.invoice.aggregate({
        where: { ...where, type: 'PAYABLE' },
        _sum: { totalAmount: true },
        _count: true
      }),
      prisma.invoice.aggregate({
        where: { ...where, status: 'PAID' },
        _sum: { totalAmount: true },
        _count: true
      }),
      prisma.invoice.aggregate({
        where: { 
          ...where, 
          status: 'OVERDUE',
          dueDate: { lt: new Date() }
        },
        _sum: { totalAmount: true },
        _count: true
      }),
      prisma.invoice.count({
        where: { ...where, status: 'DRAFT' }
      })
    ]);

    // Get recent invoices
    const recentInvoices = await prisma.invoice.findMany({
      where,
      include: {
        project: { select: { name: true } },
        development: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    // Get monthly trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyData = await prisma.invoice.groupBy({
      by: ['createdAt'],
      where: {
        ...where,
        createdAt: { gte: sixMonthsAgo }
      },
      _sum: { totalAmount: true },
      _count: true
    });

    // Process monthly data
    const monthlyTrends = monthlyData.reduce((acc: any, item) => {
      const month = new Date(item.createdAt).toISOString().slice(0, 7); // YYYY-MM
      if (!acc[month]) {
        acc[month] = { amount: 0, count: 0 };
      }
      acc[month].amount += parseFloat(item._sum.totalAmount?.toString() || '0');
      acc[month].count += item._count;
      return acc;
    }, {});

    const summary = {
      overview: {
        totalInvoices: totalInvoices,
        totalReceivables: parseFloat(receivableInvoices._sum.totalAmount?.toString() || '0'),
        totalPayables: parseFloat(payableInvoices._sum.totalAmount?.toString() || '0'),
        totalPaid: parseFloat(paidInvoices._sum.totalAmount?.toString() || '0'),
        totalOverdue: parseFloat(overdueInvoices._sum.totalAmount?.toString() || '0'),
        draftCount: draftInvoices
      },
      breakdown: {
        receivables: {
          count: receivableInvoices._count,
          amount: parseFloat(receivableInvoices._sum.totalAmount?.toString() || '0')
        },
        payables: {
          count: payableInvoices._count,
          amount: parseFloat(payableInvoices._sum.totalAmount?.toString() || '0')
        },
        paid: {
          count: paidInvoices._count,
          amount: parseFloat(paidInvoices._sum.totalAmount?.toString() || '0')
        },
        overdue: {
          count: overdueInvoices._count,
          amount: parseFloat(overdueInvoices._sum.totalAmount?.toString() || '0')
        }
      },
      recentInvoices,
      monthlyTrends
    };

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error fetching invoice summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoice summary' },
      { status: 500 }
    );
  }
}