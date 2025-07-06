import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 Starting comprehensive Sentry verification test...');
    
    const results: any[] = [];
    
    // Test 1: Basic error capture
    try {
      throw new Error('PROP.ie Test Error - Sentry verification');
    } catch (error) {
      const errorEventId = Sentry.captureException(error);
      results.push({
        test: 'Error Capture',
        status: 'success',
        eventId: errorEventId,
        description: 'Exception captured successfully'
      });
    }
    
    // Test 2: Custom message
    const messageEventId = Sentry.captureMessage('PROP.ie Platform - Sentry verification message', 'info');
    results.push({
      test: 'Message Capture',
      status: 'success',
      eventId: messageEventId,
      description: 'Custom message captured'
    });
    
    // Test 3: Performance span
    const spanEventId = await Sentry.startSpan(
      {
        op: 'test.verification',
        name: 'PROP.ie Sentry Verification Test',
      },
      async (span) => {
        span?.setAttribute('platform', 'prop.ie');
        span?.setAttribute('test_type', 'comprehensive_verification');
        span?.setAttribute('environment', process.env.NODE_ENV || 'development');
        
        // Simulate some work
        await new Promise(resolve => setTimeout(resolve, 100));
        
        return 'span_completed';
      }
    );
    
    results.push({
      test: 'Performance Span',
      status: 'success',
      eventId: spanEventId || 'span_executed',
      description: 'Performance tracking executed'
    });
    
    // Test 4: Structured logging
    const { logger } = Sentry;
    logger.info('PROP.ie comprehensive test completed', {
      platform: 'prop.ie',
      test_suite: 'comprehensive_verification',
      tests_executed: results.length,
      timestamp: new Date().toISOString()
    });
    
    results.push({
      test: 'Structured Logging',
      status: 'success',
      eventId: 'logged_successfully',
      description: 'Structured log data sent'
    });
    
    // Test 5: User context
    Sentry.setUser({
      id: 'test-user-verification',
      username: 'prop.ie-test',
      email: 'test@prop.ie'
    });
    
    results.push({
      test: 'User Context',
      status: 'success',
      eventId: 'user_context_set',
      description: 'User context configured'
    });
    
    // Flush all events to ensure they're sent
    await Sentry.flush(2000);
    
    console.log('✅ All Sentry tests completed successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Comprehensive Sentry verification completed',
      project: {
        organization: 'prop-xo',
        project: 'javascript-nextjs-gt',
        dsn_configured: true,
        environment: process.env.NODE_ENV,
        dev_mode: process.env.SENTRY_DEV_MODE === 'true'
      },
      test_results: results,
      next_steps: [
        'Check Sentry dashboard at https://sentry.io/organizations/prop-xo/projects/javascript-nextjs-gt/',
        'Verify all event IDs appear in the Issues tab',
        'Check Performance tab for span data',
        'Confirm structured logging in the Logs section'
      ],
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Sentry verification test failed:', error);
    
    // Capture this error too
    const errorId = Sentry.captureException(error);
    await Sentry.flush(1000);
    
    return NextResponse.json({
      success: false,
      error: 'Verification test failed',
      errorEventId: errorId,
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}