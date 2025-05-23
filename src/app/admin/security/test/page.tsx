'use client';

import React from 'react';
import TestRunnerUI from '../../../../tests/security/TestRunnerUI';

export default function SecurityTestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Security Integration Testing</h1>
      <p className="text-gray-600 mb-8">
        This page allows you to run integration tests for the security features
        to ensure they work correctly together. These tests run in a sandbox environment
        and don't affect production data.
      </p>

      <TestRunnerUI />
    </div>
  );
}