// This file is used to instrument the application with Sentry.
// It's automatically called by Next.js when the application starts.
// https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation

export async function register() {
  // Only initialize Sentry in certain environments
  if (process.env.NODE_ENV === 'production' || process.env.SENTRY_DEV_MODE === 'true') {
    
    // Determine the runtime and load appropriate Sentry config
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      // Server-side instrumentation
      await import('./sentry.server.config');
    }
    
    if (process.env.NEXT_RUNTIME === 'edge') {
      // Edge runtime instrumentation
      await import('./sentry.edge.config');
    }
    
    // Client-side instrumentation is handled by sentry.client.config.ts
    // which is automatically loaded by the Sentry Next.js plugin
  }
}