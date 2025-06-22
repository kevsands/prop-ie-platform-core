/**
 * Real-Time System Initialization
 * 
 * Auto-initializes the WebSocket server when imported
 * Should be imported early in the Next.js application lifecycle
 */

import { realTimeServerManager } from './realTimeServerManager';

// Flag to prevent multiple initializations
let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

/**
 * Initialize the real-time system
 */
export async function initializeRealTimeSystem(): Promise<void> {
  if (isInitialized) {
    return;
  }

  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = performInitialization();
  return initializationPromise;
}

/**
 * Perform the actual initialization
 */
async function performInitialization(): Promise<void> {
  try {
    console.log('🌐 Initializing PropIE Real-Time System...');
    
    // Only initialize in development or if explicitly enabled
    const shouldInitialize = 
      process.env.NODE_ENV === 'development' || 
      process.env.ENABLE_REALTIME === 'true';

    if (!shouldInitialize) {
      console.log('⏸️  Real-time system disabled in production mode');
      return;
    }

    // Start the WebSocket server
    await realTimeServerManager.initialize();
    
    isInitialized = true;
    console.log('✅ PropIE Real-Time System initialized successfully');
    
  } catch (error) {
    console.error('❌ Failed to initialize real-time system:', error);
    // Don't throw error to prevent app from crashing
    // The app should work without real-time features
  }
}

// Auto-initialize when this module is imported
// Only in development mode to prevent issues in production builds
if (process.env.NODE_ENV === 'development' && typeof window === 'undefined') {
  // Only run on server-side
  initializeRealTimeSystem().catch(error => {
    console.error('Auto-initialization failed:', error);
  });
}

export { realTimeServerManager };