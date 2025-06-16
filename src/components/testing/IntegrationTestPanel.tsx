/**
 * Integration Test Panel Component
 * 
 * A development component for testing end-to-end integration of the PROP.ie platform
 * Tests authentication flows, API connections, and portal functionality
 */

'use client';

import React, { useState } from 'react';
import { 
  IntegrationTestRunner, 
  AuthenticationTests, 
  BuyerPortalTests, 
  DeveloperPortalTests,
  type TestSuite,
  type TestResult 
} from '@/utils/integrationTests';

interface TestPanelProps {
  onClose?: () => void;
}

export const IntegrationTestPanel: React.FC<TestPanelProps> = ({ onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<{
    authTests?: TestSuite;
    buyerTests?: TestSuite;
    developerTests?: TestSuite;
    summary?: any;
  } | null>(null);
  const [selectedSuite, setSelectedSuite] = useState<string | null>(null);

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults(null);
    
    try {
      const results = await new IntegrationTestRunner().runAllTests();
      setTestResults(results);
    } catch (error) {
      console.error('Integration tests failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const runAuthTests = async () => {
    setIsRunning(true);
    const authTests = await new AuthenticationTests().runAllTests();
    setTestResults({ authTests });
    setIsRunning(false);
  };

  const runBuyerTests = async () => {
    setIsRunning(true);
    const buyerTests = await new BuyerPortalTests().runAllTests();
    setTestResults({ buyerTests });
    setIsRunning(false);
  };

  const runDeveloperTests = async () => {
    setIsRunning(true);
    const developerTests = await new DeveloperPortalTests().runAllTests();
    setTestResults({ developerTests });
    setIsRunning(false);
  };

  const renderTestResult = (result: TestResult) => (
    <div key={result.name} className={`p-3 rounded border-l-4 ${
      result.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
    }`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
            {result.success ? '✅' : '❌'} {result.name}
          </h4>
          <p className={`text-sm mt-1 ${result.success ? 'text-green-700' : 'text-red-700'}`}>
            {result.message}
          </p>
          {result.details && (
            <details className="mt-2">
              <summary className="text-xs text-gray-600 cursor-pointer">Details</summary>
              <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                {JSON.stringify(result.details, null, 2)}
              </pre>
            </details>
          )}
        </div>
        <span className="text-xs text-gray-500 ml-4">
          {result.duration}ms
        </span>
      </div>
    </div>
  );

  const renderTestSuite = (suite: TestSuite) => (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{suite.name}</h3>
        <div className="text-sm text-gray-600">
          {suite.passedTests}/{suite.totalTests} passed ({suite.duration}ms)
        </div>
      </div>
      <div className="space-y-2">
        {suite.results.map(renderTestResult)}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">🧪 PROP.ie Integration Tests</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Test Controls */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={runAllTests}
                disabled={isRunning}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isRunning ? '🔄 Running...' : '🚀 Run All Tests'}
              </button>
              <button
                onClick={runAuthTests}
                disabled={isRunning}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                🔐 Auth Tests
              </button>
              <button
                onClick={runBuyerTests}
                disabled={isRunning}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
              >
                🏠 Buyer Tests
              </button>
              <button
                onClick={runDeveloperTests}
                disabled={isRunning}
                className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
              >
                🏗️ Developer Tests
              </button>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <h3 className="font-medium text-blue-900 mb-2">Test Information</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Auth Tests:</strong> Verify login/logout, token management, and user profile retrieval</li>
                <li>• <strong>Buyer Tests:</strong> Test buyer portal APIs including profile, reservations, and mortgage tracking</li>
                <li>• <strong>Developer Tests:</strong> Test developer dashboard, projects, sales, and financial data</li>
                <li>• <strong>All Tests:</strong> Run complete end-to-end integration testing</li>
              </ul>
            </div>
          </div>

          {/* Test Results */}
          {testResults && (
            <div className="space-y-6">
              {/* Summary */}
              {testResults.summary && (
                <div className={`p-4 rounded-lg border-2 ${
                  testResults.summary.overallSuccess 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-red-500 bg-red-50'
                }`}>
                  <h3 className={`text-lg font-bold ${
                    testResults.summary.overallSuccess ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {testResults.summary.overallSuccess ? '✅ All Tests Passed!' : '❌ Some Tests Failed'}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                    <div>
                      <span className="font-medium">Total Tests:</span> {testResults.summary.totalTests}
                    </div>
                    <div>
                      <span className="font-medium">Passed:</span> {testResults.summary.totalPassed}
                    </div>
                    <div>
                      <span className="font-medium">Failed:</span> {testResults.summary.totalFailed}
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span> {testResults.summary.totalDuration}ms
                    </div>
                  </div>
                </div>
              )}

              {/* Individual Test Suites */}
              <div className="space-y-4">
                {testResults.authTests && renderTestSuite(testResults.authTests)}
                {testResults.buyerTests && renderTestSuite(testResults.buyerTests)}
                {testResults.developerTests && renderTestSuite(testResults.developerTests)}
              </div>
            </div>
          )}

          {/* Loading State */}
          {isRunning && !testResults && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Running integration tests...</p>
            </div>
          )}

          {/* No Results State */}
          {!isRunning && !testResults && (
            <div className="text-center py-12 text-gray-500">
              <p>Click a button above to run integration tests</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntegrationTestPanel;