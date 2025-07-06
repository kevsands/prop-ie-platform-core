/**
 * Performance Audit Panel Component
 * 
 * A development component for running comprehensive performance audits on the PROP.ie platform
 * Tests API performance, frontend rendering, memory usage, and scalability metrics
 */

'use client';

import React, { useState } from 'react';
import { 
  PerformanceAuditRunner, 
  APIPerformanceTests, 
  FrontendPerformanceTests,
  type PerformanceAuditSuite,
  type PerformanceTestResult 
} from '@/utils/performanceAudit';

interface PerformanceAuditPanelProps {
  onClose?: () => void;
}

export const PerformanceAuditPanel: React.FC<PerformanceAuditPanelProps> = ({ onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [auditResults, setAuditResults] = useState<{
    apiTests?: PerformanceAuditSuite;
    frontendTests?: PerformanceAuditSuite;
    summary?: any;
  } | null>(null);

  const runCompleteAudit = async () => {
    setIsRunning(true);
    setAuditResults(null);
    
    try {
      const results = await new PerformanceAuditRunner().runCompletePerformanceAudit();
      setAuditResults(results);
    } catch (error) {
      console.error('Performance audit failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const runAPITests = async () => {
    setIsRunning(true);
    const apiTests = await new APIPerformanceTests().runAllTests();
    setAuditResults({ apiTests });
    setIsRunning(false);
  };

  const runFrontendTests = async () => {
    setIsRunning(true);
    const frontendTests = await new FrontendPerformanceTests().runAllTests();
    setAuditResults({ frontendTests });
    setIsRunning(false);
  };

  const getPerformanceScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    if (score >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getPerformanceGrade = (score: number) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const getTestTypeIcon = (testType: string) => {
    switch (testType) {
      case 'load': return '📊';
      case 'stress': return '🔥';
      case 'spike': return '⚡';
      case 'volume': return '📦';
      case 'endurance': return '⏳';
      case 'memory': return '🧠';
      case 'rendering': return '🎨';
      default: return '🔍';
    }
  };

  const renderPerformanceResult = (result: PerformanceTestResult) => {
    const scoreColor = getPerformanceScoreColor(result.performanceScore);
    const typeIcon = getTestTypeIcon(result.testType);
    
    return (
      <div key={`${result.name}-${result.endpoint}`} className={`p-4 rounded border-l-4 ${
        result.success ? 'border-green-500 bg-green-50' : 'border-yellow-500 bg-yellow-50'
      }`}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className={`font-medium ${result.success ? 'text-green-800' : 'text-yellow-800'}`}>
                {typeIcon} {result.name}
              </h4>
              <span className={`px-2 py-1 rounded text-xs font-medium ${scoreColor}`}>
                {result.performanceScore.toFixed(0)}/100
              </span>
              <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                {result.metrics.responseTime.toFixed(0)}ms
              </span>
              {result.metrics.throughput > 0 && (
                <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">
                  {result.metrics.throughput.toFixed(1)} req/s
                </span>
              )}
            </div>
            
            <div className="text-sm mb-2">
              <span className="font-medium">Endpoint:</span> {result.method} {result.endpoint}
              <span className="ml-4 font-medium">Type:</span> {result.testType}
            </div>
            
            <p className={`text-sm mb-2 ${result.success ? 'text-green-700' : 'text-yellow-700'}`}>
              {result.message}
            </p>
            
            {/* Performance Metrics */}
            <div className="mb-2">
              <h5 className="text-sm font-medium text-gray-800 mb-1">Performance Metrics:</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="font-medium">Response:</span> {result.metrics.responseTime.toFixed(0)}ms
                </div>
                <div>
                  <span className="font-medium">Throughput:</span> {result.metrics.throughput.toFixed(1)} req/s
                </div>
                <div>
                  <span className="font-medium">Error Rate:</span> {result.metrics.errorRate.toFixed(1)}%
                </div>
                {result.metrics.memoryUsage && (
                  <div>
                    <span className="font-medium">Memory:</span> {result.metrics.memoryUsage}MB
                  </div>
                )}
              </div>
            </div>
            
            {/* Benchmarks */}
            {result.benchmarks && result.benchmarks.length > 0 && (
              <div className="mb-2">
                <h5 className="text-sm font-medium text-gray-800 mb-1">Benchmarks:</h5>
                <div className="space-y-1">
                  {result.benchmarks.map((benchmark, index) => (
                    <div key={index} className={`text-xs flex items-center ${
                      benchmark.passed ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {benchmark.passed ? '✅' : '❌'} 
                      <span className="ml-1">
                        Target: {benchmark.target} {benchmark.unit}, 
                        Actual: {benchmark.actual.toFixed(1)} {benchmark.unit}
                      </span>
                    </div>
                  ))}
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

  const renderPerformanceSuite = (suite: PerformanceAuditSuite) => {
    const scoreColor = getPerformanceScoreColor(suite.overallPerformanceScore);
    const grade = getPerformanceGrade(suite.overallPerformanceScore);
    
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
              {suite.averageThroughput.toFixed(1)} req/s
            </div>
            <div className="text-xs text-gray-500">
              {suite.duration}ms total
            </div>
          </div>
        </div>
        
        {suite.criticalIssues > 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>⚠️ {suite.criticalIssues} Critical Performance Issues Found</strong>
          </div>
        )}
        
        <div className="space-y-3">
          {suite.results.map((result, index) => (
            <div key={index}>
              {renderPerformanceResult(result)}
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
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">⚡ PROP.ie Performance Audit</h2>
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
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {isRunning ? '🔄 Running...' : '⚡ Complete Performance Audit'}
              </button>
              <button
                onClick={runAPITests}
                disabled={isRunning}
                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50"
              >
                🔗 API Performance Tests
              </button>
              <button
                onClick={runFrontendTests}
                disabled={isRunning}
                className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50"
              >
                🎨 Frontend Performance Tests
              </button>
            </div>

            {/* Performance Info */}
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <h3 className="font-medium text-green-900 mb-2">Performance Audit Information</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• <strong>API Tests:</strong> Load, stress, spike, and volume testing for all endpoints</li>
                <li>• <strong>Frontend Tests:</strong> Page load times, component rendering, memory usage</li>
                <li>• <strong>Performance Scoring:</strong> A (90-100), B (80-89), C (70-79), D (60-69), F (&lt;60)</li>
                <li>• <strong>Critical Issues:</strong> Performance bottlenecks with score &lt;50</li>
              </ul>
            </div>
          </div>

          {/* Audit Results */}
          {auditResults && (
            <div className="space-y-6">
              {/* Summary */}
              {auditResults.summary && (
                <div className={`p-6 rounded-lg border-2 ${
                  auditResults.summary.performanceGrade === 'A' || auditResults.summary.performanceGrade === 'B'
                    ? 'border-green-500 bg-green-50' 
                    : auditResults.summary.performanceGrade === 'C'
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-red-500 bg-red-50'
                }`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-xl font-bold ${
                      auditResults.summary.performanceGrade === 'A' || auditResults.summary.performanceGrade === 'B'
                        ? 'text-green-800' 
                        : auditResults.summary.performanceGrade === 'C'
                        ? 'text-yellow-800'
                        : 'text-red-800'
                    }`}>
                      Performance Grade: {auditResults.summary.performanceGrade}
                    </h3>
                    <div className={`px-4 py-2 rounded font-bold text-lg ${
                      getPerformanceScoreColor(auditResults.summary.overallPerformanceScore)
                    }`}>
                      {auditResults.summary.overallPerformanceScore.toFixed(1)}/100
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
                      <span className="font-medium">Critical Issues:</span> {auditResults.summary.criticalIssues}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mt-2">
                    <div>
                      <span className="font-medium">Avg Response:</span> {auditResults.summary.averageResponseTime.toFixed(0)}ms
                    </div>
                    <div>
                      <span className="font-medium">Avg Throughput:</span> {auditResults.summary.averageThroughput.toFixed(1)} req/s
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span> {auditResults.summary.totalDuration}ms
                    </div>
                  </div>
                  
                  {auditResults.summary.criticalIssues > 0 && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-400 rounded">
                      <strong className="text-red-800">
                        ⚠️ {auditResults.summary.criticalIssues} critical performance issues require optimization
                      </strong>
                    </div>
                  )}
                </div>
              )}

              {/* Individual Test Suites */}
              <div className="space-y-6">
                {auditResults.apiTests && renderPerformanceSuite(auditResults.apiTests)}
                {auditResults.frontendTests && renderPerformanceSuite(auditResults.frontendTests)}
              </div>
            </div>
          )}

          {/* Loading State */}
          {isRunning && !auditResults && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <p className="mt-4 text-gray-600">Running performance audit...</p>
              <p className="text-sm text-gray-500">Testing load, stress, rendering, and scalability</p>
            </div>
          )}

          {/* No Results State */}
          {!isRunning && !auditResults && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">⚡</div>
              <p className="text-lg mb-2">Performance Audit Ready</p>
              <p>Click a button above to run performance tests</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceAuditPanel;