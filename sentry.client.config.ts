// This file configures the initialization of Sentry on the client side.
// The config you add here will be used whenever a users loads a page in their browser.
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
  
  // Integration configuration
  integrations: [
    new Sentry.BrowserTracing({
      // Set sampling rate for performance monitoring
      routingInstrumentation: Sentry.nextRouterInstrumentation,
    }),
    // Send console.log, console.error, and console.warn calls as logs to Sentry
    Sentry.consoleLoggingIntegration({ levels: ["log", "error", "warn"] }),
  ],
  
  // Error filtering
  ignoreErrors: [
    // Browser extensions
    'top.GLOBALS',
    'originalCreateNotification',
    'canvas.contentDocument',
    'MyApp_RemoveAllHighlights',
    'http://tt.epicplay.com',
    "Can't find variable: ZiteReader",
    'jigsaw is not defined',
    'ComboSearch is not defined',
    'http://loading.retry.widdit.com/',
    'atomicFindClose',
    // Facebook flakiness
    'fb_xd_fragment',
    // ISP "optimizing" proxy - `Cache-Control: no-transform` seems to reduce this. (thanks @acdha)
    // See http://stackoverflow.com/questions/4113268
    'bmi_SafeAddOnload',
    'EBCallBackMessageReceived',
    // See http://toolbar.conduit.com/Developer/HtmlAndGadget/Methods/JSInjection.aspx
    'conduitPage',
    // Generic error boundary fallbacks
    'Script error.',
    'Non-Error promise rejection captured',
  ],
  
  // Additional context for property platform
  initialScope: {
    tags: {
      platform: 'prop.ie',
      component: 'client'
    }
  }
});