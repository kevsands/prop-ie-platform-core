'use client';

import { useState } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function SentryExamplePage() {
  const [testResult, setTestResult] = useState<string>('');
  const triggerError = () => {
    // This will cause an error that Sentry should catch
    // @ts-ignore
    myUndefinedFunction();
  };

  const triggerSpan = () => {
    // Example of custom span instrumentation following your guidelines
    Sentry.startSpan(
      {
        op: "ui.click",
        name: "PROP.ie Performance Test",
      },
      (span) => {
        const value = "prop.ie-platform";
        const metric = "test-performance-trace";

        // Metrics can be added to the span
        span?.setAttribute("config", value);
        span?.setAttribute("metric", metric);
        span?.setAttribute("platform", "prop.ie");
        span?.setAttribute("test_type", "performance_trace");
        
        // Simulate some work for the property platform
        console.log("Testing Sentry span instrumentation for PROP.ie");
        setTestResult('Performance trace sent! Check your Sentry Performance tab.');
      },
    );
  };

  const triggerLog = () => {
    // Test logger functionality following your examples
    const { logger } = Sentry;
    
    // Multiple log level examples for PROP.ie
    logger.info("PROP.ie platform test completed", { 
      platform: 'prop.ie',
      test_type: 'sentry_integration',
      page: "sentry-example-page" 
    });
    
    logger.warn("Rate limit reached for endpoint", {
      endpoint: "/api/test-sentry",
      isPlatform: true,
    });
    
    setTestResult('Multiple log levels sent! Check your Sentry Issues tab.');
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
                <li><strong>Project:</strong> javascript-nextjs-gt</li>
                <li><strong>Environment:</strong> {process.env.NODE_ENV}</li>
                <li><strong>DSN:</strong> Configured ✅</li>
                <li><strong>Logging:</strong> Enabled ✅</li>
                <li><strong>Tracing:</strong> Ready ✅</li>
              </ul>
            </div>
            
            {testResult && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Test Result:</h3>
                <p className="text-green-700">{testResult}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}