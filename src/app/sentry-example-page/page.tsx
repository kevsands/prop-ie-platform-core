'use client';

import * as Sentry from '@sentry/nextjs';

export default function SentryExamplePage() {
  const triggerError = () => {
    // This will cause an error that Sentry should catch
    // @ts-ignore
    myUndefinedFunction();
  };

  const triggerSpan = () => {
    // Example of custom span instrumentation
    Sentry.startSpan(
      {
        op: "ui.click",
        name: "Test Button Click",
      },
      (span) => {
        span.setAttribute("test", "sentry_verification");
        span.setAttribute("user_action", "test_button_click");
        
        // Simulate some work
        console.log("Testing Sentry span instrumentation");
      },
    );
  };

  const triggerLog = () => {
    // Test logger functionality
    const { logger } = Sentry;
    logger.info("Testing Sentry logger integration", { 
      test: true, 
      page: "sentry-example-page" 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Sentry Test Page
          </h1>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              Use the buttons below to test different Sentry features:
            </p>
            
            <div className="grid gap-4 md:grid-cols-3">
              <button
                onClick={triggerError}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                Trigger Test Error
              </button>
              
              <button
                onClick={triggerSpan}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Test Performance Span
              </button>
              
              <button
                onClick={triggerLog}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Test Logger
              </button>
            </div>
            
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Instructions:</h3>
              <ol className="list-decimal list-inside text-yellow-700 space-y-1">
                <li>Click "Trigger Test Error" to send an error to Sentry</li>
                <li>Check your Sentry Issues dashboard to see if the error appears</li>
                <li>Use other buttons to test performance monitoring and logging</li>
              </ol>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Project Details:</h3>
              <ul className="text-blue-700 space-y-1">
                <li><strong>Organization:</strong> prop-xo</li>
                <li><strong>Project:</strong> javascript-nextjs</li>
                <li><strong>Environment:</strong> {process.env.NODE_ENV}</li>
                <li><strong>DSN:</strong> Configured ✅</li>
                <li><strong>Logging:</strong> Enabled ✅</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}