'use client';

import React from 'react';
import TransactionTracker, { mockTransactionData } from '@/components/transaction/TransactionTracker';

export default function TransactionDemoPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Transaction Tracker Demo</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">With Mock Data</h2>
        <TransactionTracker 
          userRole="buyer" 
          mockData={mockTransactionData} 
        />
      </div>

      {/* You can uncomment this to test with real API when it's available
      <div className="mt-12 pt-12 border-t">
        <h2 className="text-xl font-semibold mb-4">With Real API</h2>
        <TransactionTracker 
          transactionId="YOUR_REAL_TRANSACTION_ID" 
          userRole="buyer" 
        />
      </div>
      */}
    </div>
  );
}