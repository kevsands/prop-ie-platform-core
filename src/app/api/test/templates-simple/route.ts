import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Simple test endpoint to check templates without authentication
 * Only available in development
 */
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Test endpoint not available in production' },
      { status: 403 }
    );
  }

  try {
    const templates = await prisma.documentTemplate.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
        category: true,
        status: true,
        createdAt: true
      }
    });

    const count = await prisma.documentTemplate.count();

    return NextResponse.json({
      templates,
      count,
      message: 'Templates fetched successfully (no auth required)'
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Failed to fetch templates',
        message: error.message
      },
      { status: 500 }
    );
  }
}