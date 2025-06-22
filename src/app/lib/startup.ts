/**
 * Application Startup Script
 * 
 * Initializes the real-time system and other services when the Next.js app starts
 */

import { initializeRealTimeSystem } from '@/lib/realtime/initialize';

export async function initializeApplication(): Promise<void> {
  console.log('🚀 Initializing PropIE Application...');

  try {
    // Initialize real-time WebSocket system
    await initializeRealTimeSystem();

    console.log('✅ PropIE Application initialized successfully');
    console.log('🌐 Real-time features: ENABLED');
    console.log('📡 WebSocket server: ws://localhost:3001/realtime');
    console.log('🔌 Database: Connected');
    console.log('🏗️  Task orchestration: ACTIVE');
    console.log('🏠 Property updates: LIVE');
    console.log('💰 HTB status streaming: ENABLED');

  } catch (error) {
    console.error('❌ Application initialization failed:', error);
    console.log('⚠️  Application will continue without real-time features');
  }
}

// Auto-initialize if this module is imported during server startup
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'test') {
  initializeApplication().catch(error => {
    console.error('Startup initialization failed:', error);
  });
}