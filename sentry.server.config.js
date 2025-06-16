import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN || 'https://63456e81d3878454cbbac12098d51889@o4509503761285120.ingest.de.sentry.io/4509503762858064';

Sentry.init({
  dsn: SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.05 : 1.0,
  debug: process.env.NODE_ENV === 'development',
  
  // Server-specific configuration
  maxBreadcrumbs: 50,
  attachStacktrace: true,
  
  beforeSend(event, hint) {
    // Remove sensitive server data
    if (event.request?.cookies) {
      delete event.request.cookies;
    }
    if (event.request?.headers) {
      delete event.request.headers.cookie;
      delete event.request.headers.authorization;
      delete event.request.headers['x-api-key'];
    }
    
    // Remove database connection strings and other secrets
    if (event.extra) {
      Object.keys(event.extra).forEach(key => {
        if (typeof event.extra[key] === 'string' && 
            (event.extra[key].includes('mongodb://') || 
             event.extra[key].includes('postgresql://') ||
             event.extra[key].includes('redis://'))) {
          event.extra[key] = '[REDACTED DATABASE URL]';
        }
      });
    }
    
    return event;
  },
});