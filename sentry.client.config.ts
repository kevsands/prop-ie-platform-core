// This file configures the initialization of Sentry on the client side.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: "https://be9dda7134f8964c9da5d7ebb7d42f10@o4509510634176512.ingest.de.sentry.io/4509510635290704",
  
  // Environment configuration
  environment: process.env.NODE_ENV || 'development',
  
  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Release tracking
  release: process.env.VERCEL_GIT_COMMIT_SHA || process.env.BUILD_ID || 'development',
  
  // User context for property platform
  beforeSend(event, hint) {
    // Don't send events in development unless explicitly enabled
    if (process.env.NODE_ENV === 'development' && !process.env.SENTRY_DEV_MODE) {
      return null;
    }
    
    // Filter out common development errors
    if (event.exception) {
      const error = hint.originalException;
      if (error instanceof Error) {
        // Skip common development-only errors
        if (error.message.includes('ChunkLoadError') || 
            error.message.includes('Loading chunk') ||
            error.message.includes('ResizeObserver loop limit exceeded')) {
          return null;
        }
      }
    }
    
    return event;
  },
  
  // Additional context for property platform
  initialScope: {
    tags: {
      platform: 'prop.ie',
      component: 'client'
    }
  }
});