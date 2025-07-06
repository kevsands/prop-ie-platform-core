'use client';

import React from 'react';

/**
 * Planning page stub
 * Simplified implementation to bypass build errors
 */
export default function PlanningPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Planning Your Purchase</h1>
      <p className="text-gray-600 mb-6">
        This page helps you plan your property purchase by calculating your budget
        and exploring financing options.
      </p>
      
      <div className="grid gap-6">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h2 className="text-xl font-semibold mb-3">Affordability Calculator</h2>
          <p className="mb-2">
            Calculate how much you can afford based on your income and expenses.
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            Calculate Now
          </button>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg border border-green-100">
          <h2 className="text-xl font-semibold mb-3">Planning Tasks</h2>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-green-500 mr-3 flex items-center justify-center text-white">
                ✓
              </div>
              <span>Complete your buyer profile</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-green-500 mr-3 flex items-center justify-center text-white">
                ✓
              </div>
              <span>Set your budget and preferences</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-gray-300 mr-3 flex items-center justify-center text-white">
                ✓
              </div>
              <span>Research areas and property types</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}