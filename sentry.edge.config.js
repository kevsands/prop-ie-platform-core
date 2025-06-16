import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN || 'https://63456e81d3878454cbbac12098d51889@o4509503761285120.ingest.de.sentry.io/4509503762858064';

Sentry.init({
  dsn: SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  debug: process.env.NODE_ENV === 'development',
  
  beforeSend(event, hint) {
    // Edge runtime specific filtering
    if (event.request?.cookies) {
      delete event.request.cookies;
    }
    return event;
  },
});