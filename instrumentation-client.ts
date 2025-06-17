// Client-side Sentry initialization for Next.js
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://2d2aa5ab793b125e047c3ff3fbc76e3e@o4509510634176512.ingest.de.sentry.io/4509510798147664",

  // Environment configuration
  environment: process.env.NODE_ENV || 'development',

  // Enable logging
  _experiments: {
    enableLogs: true,
  },

  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Release tracking
  release: process.env.VERCEL_GIT_COMMIT_SHA || process.env.BUILD_ID || 'development',

  // Integration configuration with console logging
  integrations: [
    // Send console.log, console.error, and console.warn calls as logs to Sentry
    Sentry.consoleLoggingIntegration({ levels: ["log", "error", "warn"] }),
  ],

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
      component: 'client',
      project: 'javascript-nextjs-gt'
    }
  }
});

// Export router transition hook for navigation instrumentation
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;