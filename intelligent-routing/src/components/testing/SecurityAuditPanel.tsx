/**
 * Security Audit Panel Component
 * 
 * A development component for running comprehensive security audits on the PROP.ie platform
 * Tests authentication, authorization, data protection, and security compliance
 */

'use client';

import React, { useState } from 'react';
import { 
  SecurityAuditRunner, 
  AuthenticationSecurityTests, 
  DataProtectionTests,
  type SecurityAuditSuite,
  type SecurityTestResult 
} from '@/utils/securityAudit';

interface SecurityAuditPanelProps {
  onClose?: () => void;
}

export const SecurityAuditPanel: React.FC<SecurityAuditPanelProps> = ({ onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [auditResults, setAuditResults] = useState<{
    authTests?: SecurityAuditSuite;
    dataProtectionTests?: SecurityAuditSuite;
    summary?: any;
  } | null>(null);

  const runCompleteAudit = async () => {
    setIsRunning(true);
    setAuditResults(null);
    
    try {
      const results = await new SecurityAuditRunner().runCompleteSecurityAudit();
      setAuditResults(results);
    } catch (error) {
      console.error('Security audit failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const runAuthTests = async () => {
    setIsRunning(true);
    const authTests = await new AuthenticationSecurityTests().runAllTests();
    setAuditResults({ authTests });
    setIsRunning(false);
  };

  const runDataProtectionTests = async () => {
    setIsRunning(true);
    const dataProtectionTests = await new DataProtectionTests().runAllTests();
    setAuditResults({ dataProtectionTests });
    setIsRunning(false);
  };

  const getSecurityScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    if (score >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getSecurityGrade = (score: number) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const renderSecurityResult = (result: SecurityTestResult) => {
    const scoreColor = getSecurityScoreColor(result.securityScore);
    
    return (
      <div key={`${result.name}-${result.endpoint}`} className={`p-4 rounded border-l-4 ${
        result.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
      }`}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                {result.success ? '🔒' : '⚠️'} {result.name}
              </h4>
              <span className={`px-2 py-1 rounded text-xs font-medium ${scoreColor}`}>
                {result.securityScore}/100
              </span>
            </div>
            
            <div className="text-sm mb-2">
              <span className="font-medium">Endpoint:</span> {result.method} {result.endpoint}
            </div>
            
            <p className={`text-sm mb-2 ${result.success ? 'text-green-700' : 'text-red-700'}`}>
              {result.message}
            </p>
            
            {result.vulnerabilities && result.vulnerabilities.length > 0 && (
              <div className="mb-2">
                <h5 className="text-sm font-medium text-red-800 mb-1">Vulnerabilities:</h5>
                <ul className="text-xs text-red-700 list-disc list-inside">
                  {result.vulnerabilities.map((vuln, index) => (
                    <li key={index}>{vuln}</li>
                  ))}
                </ul>
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

  const renderSecuritySuite = (suite: SecurityAuditSuite) => {
    const scoreColor = getSecurityScoreColor(suite.overallSecurityScore);
    const grade = getSecurityGrade(suite.overallSecurityScore);
    
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
              {suite.duration}ms
            </div>
          </div>
        </div>
        
        {suite.criticalIssues > 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>⚠️ {suite.criticalIssues} Critical Security Issues Found</strong>
          </div>
        )}
        
        <div className="space-y-3">
          {suite.results.map((result, index) => (
            <div key={index}>
              {renderSecurityResult(result)}
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
        <div className="bg-gradient-to-r from-red-600 to-purple-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">🔒 PROP.ie Security Audit</h2>
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
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {isRunning ? '🔄 Running...' : '🔒 Complete Security Audit'}
              </button>
              <button
                onClick={runAuthTests}
                disabled={isRunning}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                🔐 Authentication Tests
              </button>
              <button
                onClick={runDataProtectionTests}
                disabled={isRunning}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
              >
                🛡️ Data Protection Tests
              </button>
            </div>

            {/* Security Info */}
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <h3 className="font-medium text-red-900 mb-2">Security Audit Information</h3>
              <ul className="text-sm text-red-800 space-y-1">
                <li>• <strong>Authentication Tests:</strong> JWT validation, role-based access, session management</li>
                <li>• <strong>Data Protection Tests:</strong> Sensitive data exposure, input validation, HTTPS enforcement</li>
                <li>• <strong>Security Scoring:</strong> A (90-100), B (80-89), C (70-79), D (60-69), F (&lt;60)</li>
                <li>• <strong>Critical Issues:</strong> Security vulnerabilities with score &lt;50</li>
              </ul>
            </div>
          </div>

          {/* Audit Results */}
          {auditResults && (
            <div className="space-y-6">
              {/* Summary */}
              {auditResults.summary && (
                <div className={`p-6 rounded-lg border-2 ${
                  auditResults.summary.securityGrade === 'A' || auditResults.summary.securityGrade === 'B'
                    ? 'border-green-500 bg-green-50' 
                    : auditResults.summary.securityGrade === 'C'
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-red-500 bg-red-50'
                }`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-xl font-bold ${
                      auditResults.summary.securityGrade === 'A' || auditResults.summary.securityGrade === 'B'
                        ? 'text-green-800' 
                        : auditResults.summary.securityGrade === 'C'
                        ? 'text-yellow-800'
                        : 'text-red-800'
                    }`}>
                      Security Grade: {auditResults.summary.securityGrade}
                    </h3>
                    <div className={`px-4 py-2 rounded font-bold text-lg ${
                      getSecurityScoreColor(auditResults.summary.overallSecurityScore)
                    }`}>
                      {auditResults.summary.overallSecurityScore.toFixed(1)}/100
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
                  
                  {auditResults.summary.criticalIssues > 0 && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-400 rounded">
                      <strong className="text-red-800">
                        ⚠️ {auditResults.summary.criticalIssues} critical security issues require immediate attention
                      </strong>
                    </div>
                  )}
                </div>
              )}

              {/* Individual Test Suites */}
              <div className="space-y-6">
                {auditResults.authTests && renderSecuritySuite(auditResults.authTests)}
                {auditResults.dataProtectionTests && renderSecuritySuite(auditResults.dataProtectionTests)}
              </div>
            </div>
          )}

          {/* Loading State */}
          {isRunning && !auditResults && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <p className="mt-4 text-gray-600">Running security audit...</p>
              <p className="text-sm text-gray-500">This may take a few moments to complete</p>
            </div>
          )}

          {/* No Results State */}
          {!isRunning && !auditResults && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">🔒</div>
              <p className="text-lg mb-2">Security Audit Ready</p>
              <p>Click a button above to run security tests</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecurityAuditPanel;