'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import to avoid hydration issues
const TransactionFlow = dynamic(
  () => import('@/components/transaction/TransactionFlow'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
    )
  }
);

function TransactionFlowContent() {
  return (
    <div className="py-12 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4 text-[#2B5273]">Property Transaction Ecosystem</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Prop.ie facilitates the entire property transaction journey from development to post-purchase support,
          connecting all stakeholders in a seamless digital experience.
        </p>
      </div>
      
      {/* Transaction Flow Visualization - Conditionally render */}
      {typeof window !== 'undefined' && (
        <TransactionFlow />
      )}
      
      {/* Value Proposition */}
      <div className="mt-16 bg-[#f8fafc] rounded-lg p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#2B5273]">Why Prop.ie?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#2B5273]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Accelerated Transactions</h3>
            <p className="text-gray-600">
              Reduce property transaction times by up to 60% through streamlined workflows and 
              automated processes that eliminate traditional bottlenecks.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#2B5273]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Enhanced Transparency</h3>
            <p className="text-gray-600">
              Provide all stakeholders with real-time visibility into transaction status, 
              eliminating uncertainty and improving trust throughout the process.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#2B5273]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Cost Efficiency</h3>
            <p className="text-gray-600">
              Save thousands in transaction costs through optimized processes, bulk purchasing 
              power, and reduced administrative overhead.
            </p>
          </div>
        </div>
      </div>
      
      {/* Platform Features */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#2B5273]">Platform Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border rounded-lg p-6">
            <div className="text-blue-600 mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">New Homes Portal</h3>
            <p className="text-sm text-gray-600">
              Browse and customize new homes directly from developers
            </p>
          </div>
          
          <div className="bg-white border rounded-lg p-6">
            <div className="text-blue-600 mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Document Management</h3>
            <p className="text-sm text-gray-600">
              Secure digital document storage and sharing
            </p>
          </div>
          
          <div className="bg-white border rounded-lg p-6">
            <div className="text-blue-600 mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Payment Processing</h3>
            <p className="text-sm text-gray-600">
              Integrated booking deposits and milestone payments
            </p>
          </div>
          
          <div className="bg-white border rounded-lg p-6">
            <div className="text-blue-600 mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Progress Tracking</h3>
            <p className="text-sm text-gray-600">
              Real-time updates on construction and transaction status
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TransactionFlowPage() {
  return (
    <Suspense fallback={
      <div className="py-12 px-4 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-10"></div>
          <div className="h-64 bg-gray-100 rounded-lg mb-8"></div>
        </div>
      </div>
    }>
      <TransactionFlowContent />
    </Suspense>
  );
}