'use client';

import React from 'react';
import { HTBProvider, useHTB } from '@/context/HTBContext';

function TestHTBContent() {
  const { submitClaim, selectedBuyerClaim, error, isLoading } = useHTB();
  const [resultsetResult] = React.useState<string>('');

  const handleTest = async () => {
    try {
      setResult('Testing HTB submission...');
      const claim = await submitClaim({
        propertyId: 'test-property',
        requestedAmount: 25000,
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '0871234567',
        ppsNumber: '1234567T',
        propertyAddress: 'Test Address, Dublin',
        claimAmount: 25000
      });
      setResult(`Success! Claim created with ID: ${claim.id}`);
    } catch (err) {
      setResult(`Error: ${err}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test HTB Context</h1>

      <div className="space-y-4">
        <button
          onClick={handleTest}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : 'Test HTB Submission'}
        </button>

        {result && (
          <div className="p-4 bg-gray-100 rounded">
            <pre>{result}</pre>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-100 text-red-800 rounded">
            Error: {error.toString()}
          </div>
        )}

        {selectedBuyerClaim && (
          <div className="p-4 bg-green-100 rounded">
            <h3 className="font-bold">Current Claim:</h3>
            <pre>{JSON.stringify(selectedBuyerClaimnull2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TestHTBPage() {
  return (
    <HTBProvider>
      <TestHTBContent />
    </HTBProvider>
  );
}