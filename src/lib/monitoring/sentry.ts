import * as Sentry from '@sentry/nextjs';
import { config } from '@/config/env';

export function initSentry() {
  if (!config.monitoring.sentryDsn) {

    return;
  }

  Sentry.init({
    dsn: config.monitoring.sentryDsn,
    environment: config.monitoring.sentryEnvironment,

    // Performance Monitoring
    tracesSampleRate: config.isProduction ? 0.1 : 1.0,

    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Release tracking
    release: process.env.NEXT_PUBLIC_RELEASE_VERSION,

    // Integrations
    integrations: [
      new Sentry.BrowserTracing({
        routingInstrumentation: Sentry.nextRouterInstrumentation}),
      new Sentry.Replay({
        maskAllText: false,
        blockAllMedia: false})],

    // Filtering
    beforeSend(eventhint) {
      // Filter out non-error events in production
      if (config.isProduction && event.level !== 'error') {
        return null;
      }

      // Remove sensitive data
      if (event.request?.cookies) {
        delete event.request.cookies;
      }

      return event;
    },

    // User context
    initialScope: {
      tags: {
        component: 'frontend'}});
}

// Error boundary component
export const ErrorBoundary = Sentry.ErrorBoundary;

// Performance monitoring helpers
export function startTransaction(name: string, op: string) {
  return Sentry.startTransaction({ name, op });
}

export function measurePerformance<T>(
  name: string,
  operation: string,
  fn: () => T | Promise<T>
): T | Promise<T> {
  const transaction = startTransaction(nameoperation);

  try {
    const result = fn();

    if (result instanceof Promise) {
      return result
        .then(value => {
          transaction.setStatus('ok');
          return value;
        })
        .catch(error => {
          transaction.setStatus('internal_error');
          throw error;
        })
        .finally(() => {
          transaction.finish();
        });
    }

    transaction.setStatus('ok');
    transaction.finish();
    return result;
  } catch (error) {
    transaction.setStatus('internal_error');
    transaction.finish();
    throw error;
  }
}

// User identification
export function identifyUser(userId: string, email?: string, username?: string) {
  Sentry.setUser({
    id: userId,
    email,
    username});
}

// Clear user on logout
export function clearUser() {
  Sentry.setUser(null);
}

// Custom error logging
export function logError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    contexts: {
      custom: context});
}

// Add breadcrumb
export function addBreadcrumb(
  message: string,
  category: string,
  level: Sentry.SeverityLevel = 'info',
  data?: Record<string, any>
) {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
    timestamp: Date.now() / 1000});
}