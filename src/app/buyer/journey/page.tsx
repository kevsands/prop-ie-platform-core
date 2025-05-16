'use client';

import React from 'react';

/**
 * Simplified Buyer Journey Page
 * For build purposes
 */
export default function BuyerJourneyPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Your Buying Journey</h1>
      <p className="text-gray-600 mb-8">
        Track your progress through the home buying process.
      </p>
      
      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Journey Tracker</h2>
        <div className="flex items-center">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
              ✓
            </div>
            <span className="text-xs mt-1 text-green-600">Planning</span>
          </div>
          
          <div className="flex-1 h-1 mx-2 bg-blue-200"></div>
          
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              ⬤
            </div>
            <span className="text-xs mt-1 text-blue-600">Financing</span>
          </div>
          
          <div className="flex-1 h-1 mx-2 bg-gray-200"></div>
          
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
              ⏱
            </div>
            <span className="text-xs mt-1 text-gray-400">Property Search</span>
          </div>
          
          <div className="flex-1 h-1 mx-2 bg-gray-200"></div>
          
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
              ⏱
            </div>
            <span className="text-xs mt-1 text-gray-400">Reservation</span>
          </div>
          
          <div className="flex-1 h-1 mx-2 bg-gray-200"></div>
          
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
              ⏱
            </div>
            <span className="text-xs mt-1 text-gray-400">Legal Process</span>
          </div>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h2 className="text-xl font-semibold mb-4">Current Phase: Financing</h2>
          <p className="mb-4">
            In this phase, you'll secure your mortgage approval and prepare your finances for the purchase.
          </p>
          <div className="space-y-3">
            <div className="flex items-center bg-white p-3 rounded border">
              <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                ✓
              </div>
              <span className="line-through text-gray-500">Apply for mortgage approval in principle</span>
            </div>
            <div className="flex items-center bg-white p-3 rounded border">
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-3">
              </div>
              <span>Upload financial documents</span>
            </div>
            <div className="flex items-center bg-white p-3 rounded border">
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-3">
              </div>
              <span>Complete Help-to-Buy application</span>
            </div>
          </div>
          <div className="mt-4">
            <a href="/buyer/journey/financing" className="px-4 py-2 bg-blue-600 text-white rounded inline-block">
              Continue Financing
            </a>
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Phase Selection</h2>
          <div className="space-y-3">
            <a href="/buyer/journey/planning" className="flex items-center p-4 bg-white rounded-lg border hover:border-blue-300 hover:bg-blue-50">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                ✓
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Planning</h3>
                <p className="text-sm text-gray-600">Completed 2 days ago</p>
              </div>
              <span className="text-blue-600">→</span>
            </a>
            
            <a href="/buyer/journey/financing" className="flex items-center p-4 bg-white rounded-lg border border-blue-300 bg-blue-50">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                ⬤
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Financing</h3>
                <p className="text-sm text-gray-600">In progress</p>
              </div>
              <span className="text-blue-600">→</span>
            </a>
            
            <a href="/buyer/journey/property-search" className="flex items-center p-4 bg-white rounded-lg border hover:border-blue-300 hover:bg-blue-50">
              <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mr-3">
                ⏱
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Property Search</h3>
                <p className="text-sm text-gray-600">Coming next</p>
              </div>
              <span className="text-blue-600">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}