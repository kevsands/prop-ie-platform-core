'use client';

import React from 'react';
import Link from 'next/link';

/**
 * Financing Page - Simplified Stub
 */
export default function FinancingPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Financing</h1>
      <p className="text-gray-600 mb-8">
        Secure your mortgage approval and manage your home financing.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Mortgage Application</h2>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-4">
                ✓
              </div>
              <div>
                <h3 className="font-medium">Mortgage Approval in Principle</h3>
                <p className="text-sm text-gray-600">
                  Your mortgage has been approved in principle for €350,000
                </p>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Required Documents</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="w-5 h-5 bg-green-100 rounded-full mr-2 flex items-center justify-center text-green-600">✓</span>
                  <span className="text-gray-500">Proof of identity</span>
                </li>
                <li className="flex items-center">
                  <span className="w-5 h-5 bg-green-100 rounded-full mr-2 flex items-center justify-center text-green-600">✓</span>
                  <span className="text-gray-500">Proof of address</span>
                </li>
                <li className="flex items-center">
                  <span className="w-5 h-5 bg-gray-100 rounded-full mr-2 flex items-center justify-center"></span>
                  <span>Last 6 months bank statements</span>
                </li>
                <li className="flex items-center">
                  <span className="w-5 h-5 bg-gray-100 rounded-full mr-2 flex items-center justify-center"></span>
                  <span>Last 3 payslips</span>
                </li>
              </ul>
              <div className="mt-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded">
                  Upload Documents
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Help to Buy Scheme</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              The Help to Buy (HTB) incentive is a scheme for first-time property buyers. It helps you with the deposit 
              needed to buy or build a new house or apartment.
            </p>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="font-medium mb-2 text-blue-800">Eligibility Check</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">First-time buyer:</span>
                  <span className="text-blue-700 font-medium">Yes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">New property:</span>
                  <span className="text-blue-700 font-medium">Yes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Property price:</span>
                  <span className="text-blue-700 font-medium">€375,000 (Eligible)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mortgage LTV ratio:</span>
                  <span className="text-blue-700 font-medium">87% (Eligible)</span>
                </div>
              </div>
              <div className="mt-4 p-2 bg-blue-100 rounded">
                <p className="text-blue-800 font-medium text-center">
                  You are eligible for up to €30,000 in HTB rebate
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <Link href="/buyer/htb/calculator" className="flex-1">
                <button className="w-full px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded hover:bg-blue-50">
                  Calculate Amount
                </button>
              </Link>
              <Link href="/buyer/htb" className="flex-1">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded">
                  Apply for Help to Buy
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">1. Complete Documentation</h3>
            <p className="text-sm text-gray-600">
              Upload all required documents to complete your mortgage application.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">2. Apply for Help to Buy</h3>
            <p className="text-sm text-gray-600">
              Submit your Help to Buy application to receive your tax rebate.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">3. Finalize Mortgage</h3>
            <p className="text-sm text-gray-600">
              Once your property is selected, convert your approval in principle to a full mortgage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}