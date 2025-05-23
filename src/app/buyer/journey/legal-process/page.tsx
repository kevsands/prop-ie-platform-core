'use client';

import React from 'react';

/**
 * Legal Process Page - Simplified Stub
 */
export default function LegalProcessPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Legal Process</h1>
      <p className="text-gray-600 mb-6">
        Track your progress through the legal steps of your property purchase.
      </p>

      <div className="grid gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Legal Process Timeline</h2>

          <div className="relative pl-8 border-l-2 border-blue-200 space-y-8">
            <div className="relative">
              <div className="absolute -left-[25px] h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                ✓
              </div>
              <h3 className="font-medium text-lg">Solicitor Appointment</h3>
              <p className="text-gray-600 mt-1">
                Choose a solicitor to represent you in the purchase process
              </p>
              <div className="mt-2">
                <span className="text-sm text-green-600">Completed on May 1, 2025</span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-[25px] h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                ⏱
              </div>
              <h3 className="font-medium text-lg">Contract Review</h3>
              <p className="text-gray-600 mt-1">
                Your solicitor will review the contract of sale and explain the terms
              </p>
              <div className="mt-2">
                <span className="text-sm text-amber-600">In progress - Estimated completion May 10, 2025</span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-[25px] h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-white">
                ...
              </div>
              <h3 className="font-medium text-lg text-gray-500">Contract Signing</h3>
              <p className="text-gray-500 mt-1">
                Sign the contract of sale after your solicitor has reviewed it
              </p>
              <div className="mt-2">
                <span className="text-sm text-gray-500">Pending</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="font-semibold text-lg mb-4">Solicitor Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">Michael O'Brien</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Firm:</span>
                <span className="font-medium">Legal Partners LLP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">mobrien@legalpartners.com</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <h3 className="font-semibold text-lg mb-4">Important Dates</h3>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium">Solicitor Meeting</span>
                  <span>May 10, 2025</span>
                </div>
                <p className="text-sm text-gray-600">Review contracts and legal requirements</p>
              </div>

              <div className="p-3 border rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium">Contract Signing Deadline</span>
                  <span>May 15, 2025</span>
                </div>
                <p className="text-sm text-gray-600">Final date to sign contracts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}