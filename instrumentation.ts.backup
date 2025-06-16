import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side Sentry configuration
    Sentry.init({
      dsn: "https://604ee0ea55f49f905a8124fee04627f2@o4509503761285120.ingest.de.sentry.io/4509504014581840",
      tracesSampleRate: 1.0,
      _experiments: {
        enableLogs: true,
      },
      integrations: [
        Sentry.consoleLoggingIntegration({ levels: ["log", "error", "warn"] }),
      ],
    });
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime Sentry configuration
    Sentry.init({
      dsn: "https://604ee0ea55f49f905a8124fee04627f2@o4509503761285120.ingest.de.sentry.io/4509504014581840",
      tracesSampleRate: 1.0,
      _experiments: {
        enableLogs: true,
      },
    });
  }
}

// Export request error hook for React Server Component error instrumentation
export const onRequestError = Sentry.captureRequestError;