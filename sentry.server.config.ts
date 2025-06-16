// This file configures the initialization of Sentry on the server side.
// The config you add here will be used whenever the server handles a request.
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
  
  // Performance monitoring (lower rate for server-side)
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.05 : 1.0,
  
  // Release tracking
  release: process.env.VERCEL_GIT_COMMIT_SHA || process.env.BUILD_ID || 'development',
  
  // Server-specific configuration
  beforeSend(event, hint) {
    // Don't send events in development unless explicitly enabled
    if (process.env.NODE_ENV === 'development' && !process.env.SENTRY_DEV_MODE) {
      return null;
    }
    
    // Filter out sensitive information
    if (event.request) {
      // Remove sensitive headers
      if (event.request.headers) {
        delete event.request.headers.authorization;
        delete event.request.headers.cookie;
        delete event.request.headers['x-api-key'];
      }
      
      // Remove sensitive query parameters
      if (event.request.query_string) {
        const sensitiveParams = ['token', 'password', 'secret', 'key'];
        let queryString = event.request.query_string;
        sensitiveParams.forEach(param => {
          queryString = queryString.replace(new RegExp(`${param}=[^&]*`, 'gi'), `${param}=[FILTERED]`);
        });
        event.request.query_string = queryString;
      }
    }
    
    // Filter out common server errors
    if (event.exception) {
      const error = hint.originalException;
      if (error instanceof Error) {
        // Skip common database connection retries
        if (error.message.includes('Connection terminated') ||
            error.message.includes('connect ECONNREFUSED') ||
            error.message.includes('ETIMEDOUT')) {
          return null;
        }
      }
    }
    
    return event;
  },
  
  // Server-side integrations
  integrations: [
    // Send console.log, console.error, and console.warn calls as logs to Sentry
    Sentry.consoleLoggingIntegration({ levels: ["log", "error", "warn"] }),
  ],
  
  // Error filtering for server
  ignoreErrors: [
    // Database connection issues (temporary)
    'Connection terminated',
    'connect ECONNREFUSED',
    'ETIMEDOUT',
    'ENOTFOUND',
    // Common Next.js server errors
    'NEXT_NOT_FOUND',
    'NEXT_REDIRECT',
    // AWS/Amplify temporary issues
    'UnauthorizedException',
    'NetworkError when attempting to fetch resource'
  ],
  
  // Additional context for property platform server
  initialScope: {
    tags: {
      platform: 'prop.ie',
      component: 'server'
    }
  }
});