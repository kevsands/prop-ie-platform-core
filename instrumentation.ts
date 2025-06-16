// This file is used to instrument the application with Sentry.
// It's automatically called by Next.js when the application starts.
// https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation

import * as Sentry from '@sentry/nextjs';

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

export async function onRequestError(
  err: Error,
  request: {
    path: string;
    method: string;
    headers: Headers;
  },
  context: {
    routerKind: string;
    routePath: string;
    routeType: string;
  }
) {
  // Capture the error to Sentry
  Sentry.captureException(err, {
    contexts: {
      nextjs: {
        request_path: request.path,
        method: request.method,
        router_kind: context.routerKind,
        route_path: context.routePath,
        route_type: context.routeType,
      },
    },
  });
}