import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Log a test message
    const { logger } = Sentry;
    logger.info('Testing Sentry API integration with CORRECT DSN', { 
      endpoint: '/api/test-sentry',
      timestamp: new Date().toISOString(),
      project: 'javascript-nextjs'
    });

    // Trigger a test error for the newly created project
    // @ts-ignore
    myUndefinedFunction();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    // Explicitly capture the error with Sentry
    Sentry.captureException(error);
    
    return NextResponse.json(
      { error: 'Test error captured by Sentry for NEW project' }, 
      { status: 500 }
    );
  }
}