// This file configures the initialization of Sentry for edge runtime.
// The config you add here will be used whenever a page or API route is going to be run in an edge runtime.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: "https://be9dda7134f8964c9da5d7ebb7d42f10@o4509510634176512.ingest.de.sentry.io/4509510635290704",
  
  // Environment configuration
  environment: process.env.NODE_ENV || 'development',
  
  // Enable logging
  _experiments: {
    enableLogs: true,
  },
  
  // Performance monitoring (minimal for edge)
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.01 : 1.0,
  
  // Release tracking
  release: process.env.VERCEL_GIT_COMMIT_SHA || process.env.BUILD_ID || 'development',
  
  // Edge-specific configuration
  beforeSend(event, hint) {
    // Don't send events in development unless explicitly enabled
    if (process.env.NODE_ENV === 'development' && !process.env.SENTRY_DEV_MODE) {
      return null;
    }
    
    // Edge runtime has limited context, keep it simple
    return event;
  },
  
  // Minimal integrations for edge runtime
  integrations: [
    // Edge runtime has limited APIs, keep integrations minimal
  ],
  
  // Error filtering for edge
  ignoreErrors: [
    // Edge-specific errors to ignore
    'The script will never generate a response',
    'This operation is not supported in the Edge Runtime',
  ],
  
  // Additional context for edge runtime
  initialScope: {
    tags: {
      platform: 'prop.ie',
      component: 'edge'
    }
  }
});