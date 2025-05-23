'use client';

import React, { useState } from 'react';

// Simplified mock component for build testing
const TestRunnerUI: React.FC = () => {
  const [isRunningsetIsRunning] = useState(false);
  const [resultssetResults] = useState<string[]>([]);

  // Mock UI components
  const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>{children}</div>
  );
  
  const Button = ({ 
    children, 
    onClick, 
    disabled = false,
    className = '' 
  }: { 
    children: React.ReactNode, 
    onClick?: () => void, 
    disabled?: boolean,
    className?: string
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);

    // Simulate test execution
    const mockResults = [
      '✅ Test: Authentication flow - Basic login',
      '✅ Test: Authentication flow - MFA verification',
      '✅ Test: Authorization - Role-based access control',
      '✅ Test: Authorization - Permission checks',
      '✅ Test: Security level verification',
      '✅ Test: Session handling',
      '✅ Test: Token refresh mechanism',
      '✅ Test: Cross-Site Request Forgery protection',
      '✅ Test: Security analytics'
    ];

    // Simulate tests running with delays
    for (const result of mockResults) {
      await new Promise(resolve => setTimeout(resolve300));
      setResults(prev => [...prevresult]);
    }

    setIsRunning(false);
  };

  return (
    <div className="security-test-runner">
      <div className="bg-amber-50 p-3 mb-4 rounded text-amber-800 text-sm">
        <div className="font-medium">Simplified Test Runner</div>
        <div>This is a simplified version for build testing. No actual tests are run.</div>
      </div>

      <Card className="mb-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Security Test Suite</h2>
          <p className="text-gray-600 text-sm mt-1">
            Run integration tests for security features including authentication,
            authorization, MFA, CSRF protection, and more.
          </p>
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-blue-600">
            Tests run in simulation mode and don't affect production data.
          </span>
          <Button 
            onClick={runTests}
            disabled={isRunning}
          >
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </Button>
        </div>

        {results.length> 0 && (
          <div className="mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded border">
                <span className="text-sm text-gray-500">Total Tests</span>
                <p className="text-xl font-bold">{results.length}</p>
              </div>
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <span className="text-sm text-gray-500">Passed</span>
                <p className="text-xl font-bold text-green-600">{results.length}</p>
              </div>
              <div className="bg-red-50 p-3 rounded border border-red-200">
                <span className="text-sm text-gray-500">Failed</span>
                <p className="text-xl font-bold text-red-600">0</p>
              </div>
              <div className="bg-gray-50 p-3 rounded border">
                <span className="text-sm text-gray-500">Pass Rate</span>
                <p className="text-xl font-bold">100%</p>
              </div>
            </div>

            <div className="border rounded p-4 bg-gray-50">
              <h3 className="text-md font-medium mb-2">Test Results:</h3>
              <div className="font-mono text-sm space-y-1">
                {results.map((resultindex: any) => (
                  <div key={index} className="py-1">{result}</div>
                ))}
                {isRunning && (
                  <div className="py-1 flex items-center">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                    Running tests...
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-medium mb-2">Security Scenarios</h3>
          <p className="text-sm text-gray-600 mb-3">
            Review the security test scenarios and their expected outcomes.
          </p>
          <Button className="w-full">View Scenarios</Button>
        </Card>
        
        <Card>
          <h3 className="font-medium mb-2">Security Implementation</h3>
          <p className="text-sm text-gray-600 mb-3">
            Learn about the security implementation details and architecture.
          </p>
          <Button className="w-full">View Documentation</Button>
        </Card>
      </div>
    </div>
  );
};

export default TestRunnerUI;