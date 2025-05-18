import * as Sentry from '@sentry/nextjs';

// Error tracking configuration
export function initializeErrorTracking() {
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      
      // Performance Monitoring
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      
      // Session Replay
      replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      replaysOnErrorSampleRate: 1.0,
      
      // Integrations
      integrations: [
        new Sentry.BrowserTracing({
          routingInstrumentation: Sentry.nextRouterInstrumentation,
        }),
        new Sentry.Replay(),
      ],
      
      // Error filtering
      beforeSend(event, hint) {
        // Filter out certain errors
        if (event.exception?.values?.[0]?.type === 'NetworkError') {
          return null;
        }
        
        // Add custom context
        event.contexts = {
          ...event.contexts,
          app: {
            version: process.env.npm_package_version || '0.1.0',
            environment: process.env.NODE_ENV,
          }
        };
        
        return event;
      },
      
      // Breadcrumb filtering
      beforeBreadcrumb(breadcrumb, hint) {
        // Filter out certain breadcrumbs
        if (breadcrumb.category === 'console') {
          return null;
        }
        
        return breadcrumb;
      }
    });
  }
}

// Error tracking utilities
export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  path?: string;
  method?: string;
  statusCode?: number;
  requestId?: string;
  metadata?: Record<string, any>;
}

export function trackError(error: Error, context: ErrorContext = {}) {
  console.error('Error tracked:', error, context);
  
  if (process.env.SENTRY_DSN) {
    Sentry.withScope((scope) => {
      // Set user context
      if (context.userId) {
        scope.setUser({ id: context.userId });
      }
      
      // Set tags
      if (context.path) scope.setTag('path', context.path);
      if (context.method) scope.setTag('method', context.method);
      if (context.statusCode) scope.setTag('statusCode', context.statusCode);
      if (context.requestId) scope.setTag('requestId', context.requestId);
      
      // Set context
      scope.setContext('errorDetails', {
        sessionId: context.sessionId,
        metadata: context.metadata,
        timestamp: new Date().toISOString()
      });
      
      // Capture the error
      Sentry.captureException(error);
    });
  }
  
  // Also log to CloudWatch (if enabled)
  if (process.env.CLOUDWATCH_ENABLED === 'true') {
    logToCloudWatch(error, context);
  }
}

// Enhanced error types
export class BusinessError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly context: Record<string, any>;
  
  constructor(
    message: string,
    code: string,
    statusCode: number = 400,
    context: Record<string, any> = {}
  ) {
    super(message);
    this.name = 'BusinessError';
    this.code = code;
    this.statusCode = statusCode;
    this.context = context;
  }
}

export class ValidationError extends BusinessError {
  constructor(message: string, context: Record<string, any> = {}) {
    super(message, 'VALIDATION_ERROR', 400, context);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends BusinessError {
  constructor(message: string, context: Record<string, any> = {}) {
    super(message, 'AUTHENTICATION_ERROR', 401, context);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends BusinessError {
  constructor(message: string, context: Record<string, any> = {}) {
    super(message, 'AUTHORIZATION_ERROR', 403, context);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends BusinessError {
  constructor(message: string, context: Record<string, any> = {}) {
    super(message, 'NOT_FOUND', 404, context);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends BusinessError {
  constructor(message: string, context: Record<string, any> = {}) {
    super(message, 'CONFLICT', 409, context);
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends BusinessError {
  constructor(message: string, context: Record<string, any> = {}) {
    super(message, 'RATE_LIMIT_EXCEEDED', 429, context);
    this.name = 'RateLimitError';
  }
}

// Error boundary for React components
export function errorBoundaryHandler(error: Error, errorInfo: any) {
  console.error('Error boundary triggered:', error, errorInfo);
  
  trackError(error, {
    metadata: {
      componentStack: errorInfo.componentStack,
      errorBoundary: true
    }
  });
}

// CloudWatch Logs integration
async function logToCloudWatch(error: Error, context: ErrorContext) {
  try {
    // This would integrate with AWS CloudWatch Logs
    // For now, it's a placeholder
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      message: error.message,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      context,
      application: {
        name: 'PropIE',
        version: process.env.npm_package_version || '0.1.0',
        environment: process.env.NODE_ENV
      }
    };
    
    console.log('CloudWatch log:', JSON.stringify(logEntry));
  } catch (logError) {
    console.error('Failed to log to CloudWatch:', logError);
  }
}

// Error aggregation for reporting
interface ErrorAggregation {
  errorType: string;
  count: number;
  lastOccurrence: Date;
  paths: Set<string>;
  users: Set<string>;
}

const errorAggregations = new Map<string, ErrorAggregation>();

export function aggregateError(error: Error, context: ErrorContext) {
  const key = `${error.name}:${error.message}`;
  
  if (!errorAggregations.has(key)) {
    errorAggregations.set(key, {
      errorType: error.name,
      count: 0,
      lastOccurrence: new Date(),
      paths: new Set(),
      users: new Set()
    });
  }
  
  const aggregation = errorAggregations.get(key)!;
  aggregation.count++;
  aggregation.lastOccurrence = new Date();
  
  if (context.path) aggregation.paths.add(context.path);
  if (context.userId) aggregation.users.add(context.userId);
}

export function getErrorReport() {
  const report = Array.from(errorAggregations.entries()).map(([key, data]) => ({
    key,
    ...data,
    paths: Array.from(data.paths),
    users: Array.from(data.users)
  }));
  
  // Sort by count descending
  report.sort((a, b) => b.count - a.count);
  
  return report;
}

// Reset error aggregations (for testing)
export function resetErrorAggregations() {
  errorAggregations.clear();
}