/**
 * Resilience Audit Panel Component
 * 
 * A development component for running comprehensive resilience audits on the PROP.ie platform
 * Tests API timeouts, error handling, graceful degradation, and system recovery
 */

'use client';

import React, { useState } from 'react';
import { 
  ResilienceAuditRunner, 
  TimeoutResilienceTests, 
  ErrorBoundaryTests,
  type ResilienceAuditSuite,
  type ResilienceTestResult 
} from '@/utils/resilienceAudit';

interface ResilienceAuditPanelProps {
  onClose?: () => void;
}

export const ResilienceAuditPanel: React.FC<ResilienceAuditPanelProps> = ({ onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [auditResults, setAuditResults] = useState<{
    timeoutTests?: ResilienceAuditSuite;
    errorBoundaryTests?: ResilienceAuditSuite;
    summary?: any;
  } | null>(null);

  const runCompleteAudit = async () => {
    setIsRunning(true);
    setAuditResults(null);
    
    try {
      const results = await new ResilienceAuditRunner().runCompleteResilienceAudit();
      setAuditResults(results);
    } catch (error) {
      console.error('Resilience audit failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const runTimeoutTests = async () => {
    setIsRunning(true);
    const timeoutTests = await new TimeoutResilienceTests().runAllTests();
    setAuditResults({ timeoutTests });
    setIsRunning(false);
  };

  const runErrorBoundaryTests = async () => {
    setIsRunning(true);
    const errorBoundaryTests = await new ErrorBoundaryTests().runAllTests();
    setAuditResults({ errorBoundaryTests });
    setIsRunning(false);
  };

  const getResilienceScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    if (score >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getResilienceGrade = (score: number) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const getTestTypeIcon = (testType: string) => {
    switch (testType) {
      case 'timeout': return '⏱️';
      case 'network-failure': return '🌐';
      case 'server-error': return '💥';
      case 'malformed-response': return '🔧';
      case 'rate-limit': return '🚦';
      default: return '🔍';
    }
  };

  const renderResilienceResult = (result: ResilienceTestResult) => {
    const scoreColor = getResilienceScoreColor(result.resilienceScore);
    const typeIcon = getTestTypeIcon(result.testType);
    
    return (
      <div key={`${result.name}-${result.endpoint}`} className={`p-4 rounded border-l-4 ${
        result.success ? 'border-blue-500 bg-blue-50' : 'border-orange-500 bg-orange-50'
      }`}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className={`font-medium ${result.success ? 'text-blue-800' : 'text-orange-800'}`}>
                {typeIcon} {result.name}
              </h4>
              <span className={`px-2 py-1 rounded text-xs font-medium ${scoreColor}`}>
                {result.resilienceScore}/100
              </span>
              {result.responseTime > 0 && (
                <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                  {result.responseTime}ms
                </span>
              )}
            </div>
            
            <div className="text-sm mb-2">
              <span className="font-medium">Endpoint:</span> {result.method} {result.endpoint}
              <span className="ml-4 font-medium">Type:</span> {result.testType}
            </div>
            
            <p className={`text-sm mb-2 ${result.success ? 'text-blue-700' : 'text-orange-700'}`}>
              {result.message}
            </p>
            
            {result.errorHandling && (
              <div className="mb-2">
                <h5 className="text-sm font-medium text-gray-800 mb-1">Error Handling:</h5>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`flex items-center ${result.errorHandling.gracefulDegradation ? 'text-green-700' : 'text-red-700'}`}>
                    {result.errorHandling.gracefulDegradation ? '✅' : '❌'} Graceful Degradation
                  </div>
                  <div className={`flex items-center ${result.errorHandling.userFeedback ? 'text-green-700' : 'text-red-700'}`}>
                    {result.errorHandling.userFeedback ? '✅' : '❌'} User Feedback
                  </div>
                  <div className={`flex items-center ${result.errorHandling.retryMechanism ? 'text-green-700' : 'text-red-700'}`}>
                    {result.errorHandling.retryMechanism ? '✅' : '❌'} Retry Mechanism
                  </div>
                  <div className={`flex items-center ${result.errorHandling.fallbackData ? 'text-green-700' : 'text-red-700'}`}>
                    {result.errorHandling.fallbackData ? '✅' : '❌'} Fallback Data
                  </div>
                </div>
              </div>
            )}
            
            {result.recommendations && result.recommendations.length > 0 && (
              <div className="mb-2">
                <h5 className="text-sm font-medium text-blue-800 mb-1">Recommendations:</h5>
                <ul className="text-xs text-blue-700 list-disc list-inside">
                  {result.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {result.details && (
              <details className="mt-2">
                <summary className="text-xs text-gray-600 cursor-pointer">Technical Details</summary>
                <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                  {JSON.stringify(result.details, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderResilienceSuite = (suite: ResilienceAuditSuite) => {
    const scoreColor = getResilienceScoreColor(suite.overallResilienceScore);
    const grade = getResilienceGrade(suite.overallResilienceScore);
    
    return (
      <div className="border rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{suite.name}</h3>
          <div className="flex items-center gap-4">
            <div className={`px-3 py-1 rounded font-bold ${scoreColor}`}>
              Grade: {grade}
            </div>
            <div className="text-sm text-gray-600">
              {suite.passedTests}/{suite.totalTests} passed
            </div>
            <div className="text-xs text-gray-500">
              Avg: {suite.averageResponseTime.toFixed(0)}ms
            </div>
            <div className="text-xs text-gray-500">
              {suite.duration}ms total
            </div>
          </div>
        </div>
        
        {suite.criticalFailures > 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>⚠️ {suite.criticalFailures} Critical Resilience Issues Found</strong>
          </div>
        )}
        
        <div className="space-y-3">
          {suite.results.map((result, index) => (
            <div key={index}>
              {renderResilienceResult(result)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl max-h-[90vh] w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">🛡️ PROP.ie Resilience Audit</h2>
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
          {/* Control Panel */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={runCompleteAudit}
                disabled={isRunning}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isRunning ? '🔄 Running...' : '🛡️ Complete Resilience Audit'}
              </button>
              <button
                onClick={runTimeoutTests}
                disabled={isRunning}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                ⏱️ Timeout & Response Tests
              </button>
              <button
                onClick={runErrorBoundaryTests}
                disabled={isRunning}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
              >
                🔧 Error Boundary Tests
              </button>
            </div>

            {/* Resilience Info */}
            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <h3 className="font-medium text-blue-900 mb-2">Resilience Audit Information</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Timeout Tests:</strong> API response times, timeout handling, network resilience</li>
                <li>• <strong>Error Boundary Tests:</strong> Component error recovery, API error propagation, user feedback</li>
                <li>• <strong>Resilience Scoring:</strong> A (90-100), B (80-89), C (70-79), D (60-69), F (&lt;60)</li>
                <li>• <strong>Critical Failures:</strong> Resilience issues with score &lt;50</li>
              </ul>
            </div>
          </div>

          {/* Audit Results */}
          {auditResults && (
            <div className="space-y-6">
              {/* Summary */}
              {auditResults.summary && (
                <div className={`p-6 rounded-lg border-2 ${
                  auditResults.summary.resilienceGrade === 'A' || auditResults.summary.resilienceGrade === 'B'
                    ? 'border-green-500 bg-green-50' 
                    : auditResults.summary.resilienceGrade === 'C'
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-red-500 bg-red-50'
                }`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-xl font-bold ${
                      auditResults.summary.resilienceGrade === 'A' || auditResults.summary.resilienceGrade === 'B'
                        ? 'text-green-800' 
                        : auditResults.summary.resilienceGrade === 'C'
                        ? 'text-yellow-800'
                        : 'text-red-800'
                    }`}>
                      Resilience Grade: {auditResults.summary.resilienceGrade}
                    </h3>
                    <div className={`px-4 py-2 rounded font-bold text-lg ${
                      getResilienceScoreColor(auditResults.summary.overallResilienceScore)
                    }`}>
                      {auditResults.summary.overallResilienceScore.toFixed(1)}/100
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Total Tests:</span> {auditResults.summary.totalTests}
                    </div>
                    <div>
                      <span className="font-medium">Passed:</span> {auditResults.summary.totalPassed}
                    </div>
                    <div>
                      <span className="font-medium">Failed:</span> {auditResults.summary.totalFailed}
                    </div>
                    <div>
                      <span className="font-medium">Critical Failures:</span> {auditResults.summary.criticalFailures}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                    <div>
                      <span className="font-medium">Avg Response Time:</span> {auditResults.summary.averageResponseTime.toFixed(0)}ms
                    </div>
                    <div>
                      <span className="font-medium">Total Duration:</span> {auditResults.summary.totalDuration}ms
                    </div>
                  </div>
                  
                  {auditResults.summary.criticalFailures > 0 && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-400 rounded">
                      <strong className="text-red-800">
                        ⚠️ {auditResults.summary.criticalFailures} critical resilience issues require immediate attention
                      </strong>
                    </div>
                  )}
                </div>
              )}

              {/* Individual Test Suites */}
              <div className="space-y-6">
                {auditResults.timeoutTests && renderResilienceSuite(auditResults.timeoutTests)}
                {auditResults.errorBoundaryTests && renderResilienceSuite(auditResults.errorBoundaryTests)}
              </div>
            </div>
          )}

          {/* Loading State */}
          {isRunning && !auditResults && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Running resilience audit...</p>
              <p className="text-sm text-gray-500">Testing API timeouts, error handling, and system recovery</p>
            </div>
          )}

          {/* No Results State */}
          {!isRunning && !auditResults && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">🛡️</div>
              <p className="text-lg mb-2">Resilience Audit Ready</p>
              <p>Click a button above to run resilience tests</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResilienceAuditPanel;