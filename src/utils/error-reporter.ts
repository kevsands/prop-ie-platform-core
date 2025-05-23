/**
 * Error reporting utility
 * In a production environment, this would send errors to a monitoring service
 */
export class ErrorReporter {
  /**
   * Capture an error with additional context
   */
  public captureError(error: unknown, context?: Record<string, any>): void {
    // In development, just log to console
    if (process.env.NODE_ENV === 'development') {

      return;
    }

    // In production, would send to error tracking service
    // Example: Sentry.captureException(error, { extra: context });

    // For now, just log to console in a structured way
    .toISOString(),
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : String(error),
        context
      })
    );
  }

  /**
   * Report a message as an error
   */
  public captureMessage(message: string, context?: Record<string, any>): void {
    // In production, would send to error tracking service
    // Example: Sentry.captureMessage(message, { extra: context });

    .toISOString(),
        message,
        context
      })
    );
  }
}

// Export a default instance for backwards compatibility
export default new ErrorReporter();