import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

export async function GET() {
  try {
    console.log('🔍 Testing Sentry network connectivity...');
    
    // Test if Sentry can send data
    const eventId = Sentry.captureMessage('PROP.ie Sentry Network Test - ' + new Date().toISOString(), 'info');
    
    console.log('📤 Sentry eventId:', eventId);
    
    // Force flush to ensure data is sent
    await Sentry.flush(2000);
    
    console.log('✅ Sentry flush completed');
    
    return NextResponse.json({
      success: true,
      eventId: eventId,
      message: 'Sentry network test completed',
      check_dashboard: 'Go to sentry.io and check your prop-xo/javascript-nextjs project for events',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Sentry network test failed:', error);
    return NextResponse.json({
      error: 'Network test failed',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}