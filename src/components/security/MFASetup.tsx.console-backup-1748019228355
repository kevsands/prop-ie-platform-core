'use client';

import React from 'react';

interface MFASetupProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

/**
 * Simplified stub implementation of MFA Setup Component
 * 
 * This component simulates the UI for setting up Multi-Factor Authentication
 * without the actual functionality.
 */
export function MFASetup({ onComplete, onCancel }: MFASetupProps) {
  return (
    <div className="w-full max-w-md mx-auto border rounded-lg shadow-sm p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Set Up Multi-Factor Authentication</h2>
        <p className="text-sm text-gray-500">
          Enhance your account security with a second factor of authentication.
        </p>
      </div>
      
      <div className="border-t border-b py-4 my-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-md font-medium mb-2">Authenticator App</h3>
            <p className="text-sm mb-4">
              Use an authenticator app like Google Authenticator, Authy, or Microsoft Authenticator
              to generate verification codes.
            </p>
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={onComplete}
            >
              Start Setup
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-4">
        <button 
          className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50 transition"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button 
          className="px-4 py-2 bg-gray-200 rounded text-gray-700 hover:bg-gray-300 transition"
          onClick={onComplete}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}