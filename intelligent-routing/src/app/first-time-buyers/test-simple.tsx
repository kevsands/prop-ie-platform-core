'use client';

import React, { useState } from 'react';

export default function TestSimplePage() {
  const [currentView, setCurrentView] = useState('overview');

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">First Time Buyers Test Page</h1>
      
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setCurrentView('overview')}
          className={`px-4 py-2 rounded ${currentView === 'overview' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Overview
        </button>
        <button
          onClick={() => setCurrentView('prop-difference')}
          className={`px-4 py-2 rounded ${currentView === 'prop-difference' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          The PROP Way
        </button>
      </div>

      <div>
        {currentView === 'overview' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Overview Content</h2>
            <p>This is the overview section</p>
          </div>
        )}
        {currentView === 'prop-difference' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">The PROP Way Content</h2>
            <p>This is the PROP difference section showing how PROP revolutionizes buying</p>
          </div>
        )}
      </div>
    </div>
  );
}