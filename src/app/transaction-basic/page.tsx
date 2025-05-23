'use client';

import React from 'react';
import { mockTransactionData } from '@/components/transaction/TransactionTracker';

export default function TransactionBasicPage() {
  // If the import of mockTransactionData works, we can display some of its data
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Transaction Data Test</h1>

      {mockTransactionData ? (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Mock Transaction Data</h2>

          <div className="grid gap-4">
            <div>
              <span className="font-medium">ID:</span> {mockTransactionData.id}
            </div>
            <div>
              <span className="font-medium">Reference:</span> {mockTransactionData.referenceNumber}
            </div>
            <div>
              <span className="font-medium">Status:</span> {mockTransactionData.status}
            </div>
            <div>
              <span className="font-medium">Property:</span> {mockTransactionData.unit.name}
            </div>
            <div>
              <span className="font-medium">Development:</span> {mockTransactionData.unit.development.name}
            </div>
            <div>
              <span className="font-medium">Completion:</span> {mockTransactionData.completionPercentage}%
            </div>
            <div>
              <span className="font-medium">Next Actions:</span>
              <ul className="list-disc ml-5 mt-2">
                {mockTransactionData.nextActions.map((actioni: any) => (
                  <li key={i}>{action}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600">Failed to load mock transaction data</p>
        </div>
      )}

      <div className="mt-8">
        <a href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Back to Home
        </a>
      </div>
    </div>
  );
}