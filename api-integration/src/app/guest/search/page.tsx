/**
 * Guest Search Page
 * Property search page for guest users with preference tracking
 */

import React from 'react';
import SearchPreferencesManager from '@/components/buyer/SearchPreferencesManager';

export default function GuestSearchPage() {
  // Generate session ID for guest tracking
  const sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Guest Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Find Your Perfect Property</h1>
          <p className="text-blue-100 mb-4">
            Personalize your search experience. We'll remember your preferences for this session.
          </p>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">
              Create Free Account
            </button>
            <button className="px-4 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors">
              Sign In
            </button>
          </div>
        </div>

        <SearchPreferencesManager
          sessionId={sessionId}
          onPreferencesChange={(preferences) => {
            console.log('Guest preferences updated:', preferences);
            // Track guest behavior for analytics
          }}
          className="mb-8"
        />

        {/* Guest-specific CTAs */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Create an Account?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 text-xl">💾</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Save Preferences</h4>
              <p className="text-sm text-gray-600">Keep your search criteria across devices and sessions</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 text-xl">🔔</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Get Alerts</h4>
              <p className="text-sm text-gray-600">Receive notifications about new properties that match your criteria</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 text-xl">🎯</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Smart Recommendations</h4>
              <p className="text-sm text-gray-600">Get AI-powered property suggestions based on your behavior</p>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Create Free Account - 30 Seconds
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}