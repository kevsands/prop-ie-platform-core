'use client';

import React from 'react';
import { HTBProvider } from '@/context/HTBContext';
import { HTBCalculatorApp } from './HTBCalculatorApp';
import { HTBStatusViewer } from './HTBStatusViewer';

function SimpleFirstTimeBuyersPageContent() {
  const [currentView, setCurrentView] = React.useState<'htb' | 'progress'>('htb');

  const handleClaimCreated = () => {
    setCurrentView('progress');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="sticky top-0 z-30 w-full bg-white shadow-md">
        <div className="max-w-5xl mx-auto flex gap-4 p-4">
          <button
            onClick={() => setCurrentView('htb')}
            className={`px-4 py-2 rounded ${currentView === 'htb' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            HTB Calculator
          </button>
          <button
            onClick={() => setCurrentView('progress')}
            className={`px-4 py-2 rounded ${currentView === 'progress' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Your Progress
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-4">
        {currentView === 'htb' && (
          <HTBCalculatorApp onClaimCreated={handleClaimCreated} />
        )}
        {currentView === 'progress' && (
          <HTBStatusViewer />
        )}
      </main>
    </div>
  );
}

export default function SimpleFirstTimeBuyersPage() {
  return (
    <HTBProvider>
      <SimpleFirstTimeBuyersPageContent />
    </HTBProvider>
  );
}