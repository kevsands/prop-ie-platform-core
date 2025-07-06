/**
 * Buyer Preferences Page
 * Main page for managing search preferences in buyer portal
 */

import React from 'react';
import SearchPreferencesManager from '@/components/buyer/SearchPreferencesManager';

export default function BuyerPreferencesPage() {
  // In production, get user ID from authentication context
  const mockBuyerId = 'buyer_12345'; // Replace with actual auth
  const sessionId = `session_${Date.now()}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Search Preferences</h1>
          <p className="text-gray-600 mt-2">
            Customize your property search experience and get personalized recommendations
          </p>
        </div>

        <SearchPreferencesManager
          buyerId={mockBuyerId}
          sessionId={sessionId}
          onPreferencesChange={(preferences) => {
            console.log('Preferences updated:', preferences);
            // Handle preference changes (analytics, etc.)
          }}
          className="mb-8"
        />

        {/* Integration with other buyer portal features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors text-left">
                <div className="font-medium text-gray-900">Search Properties</div>
                <div className="text-sm text-gray-600">Find properties matching your preferences</div>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors text-left">
                <div className="font-medium text-gray-900">HTB Calculator</div>
                <div className="text-sm text-gray-600">Check your Help to Buy eligibility</div>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors text-left">
                <div className="font-medium text-gray-900">Saved Properties</div>
                <div className="text-sm text-gray-600">View your favorite properties</div>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors text-left">
                <div className="font-medium text-gray-900">Viewing Schedule</div>
                <div className="text-sm text-gray-600">Manage your property viewings</div>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-bold">?</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-blue-900">Preference Guide</div>
                  <div className="text-xs text-blue-700">Learn how to optimize your search</div>
                </div>
              </div>
              
              <button className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Contact Property Consultant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}