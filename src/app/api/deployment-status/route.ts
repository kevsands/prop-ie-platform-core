import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma (safely)
let prisma: PrismaClient | null = null;
try {
  prisma = new PrismaClient();
} catch (error) {

}

// Simple deployment status endpoint
export async function GET(request: Request) {
  const startTime = Date.now();

  try {
    // Test database connection
    let databaseStatus = 'disconnected';
    let databaseMessage = '';
    try {
      if (prisma) {
        await prisma.$queryRaw`SELECT 1`;
        databaseStatus = 'connected';
      } else {
        databaseStatus = 'not_initialized';
        databaseMessage = 'Database client not initialized';
      }
    } catch (error) {
      databaseStatus = 'error';
      databaseMessage = error instanceof Error ? error.message : 'Database connection failed';
    }

    // Check critical environment variables
    const environment: Record<string, boolean> = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      JWT_SECRET: !!process.env.JWT_SECRET
    };

    // Determine overall status
    const status = databaseStatus === 'connected' ? 'ok' : 'error';

    return NextResponse.json({
      status,
      timestamp: new Date().toISOString(),
      responseTime: `${Date.now() - startTime}ms`,
      database: databaseStatus,
      databaseMessage,
      environment_vars: environment
    }, {
      status: status === 'ok' ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {

    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      responseTime: `${Date.now() - startTime}ms`,
      error: error instanceof Error ? error.message : 'Unknown error',
      database: 'error'
    }, {
      status: 503
    });
  }
}