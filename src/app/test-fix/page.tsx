'use client';

import React, { useState } from 'react';

export default function TestFixPage() {
  const [isHoveredsetIsHovered] = useState(false);
  const [dropdownStatesetDropdownState] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 p-8 pt-24">
      <h1 className="text-2xl font-bold mb-8">Navigation Fix Test Page</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Test Basic Dropdown</h2>

        {/* Simple test dropdown */}
        <div className="relative inline-block">
          <button
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Test Dropdown
            <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          <div className={`absolute mt-2 w-64 bg-white rounded-lg shadow-xl p-4 ${
            isHovered ? 'opacity-100 visible' : 'opacity-0 invisible'
          } transition-all duration-200`}>
            <div className="space-y-2">
              <a href="#" className="block p-2 hover:bg-gray-100 rounded">Option 1</a>
              <a href="#" className="block p-2 hover:bg-gray-100 rounded">Option 2</a>
              <a href="#" className="block p-2 hover:bg-gray-100 rounded">Option 3</a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Multiple Dropdowns Test</h2>
        <div className="flex gap-4">
          {['Properties', 'Solutions', 'Resources'].map((item: any) => (
            <div key={item} className="relative">
              <button
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                onMouseEnter={() => setDropdownState(item)}
                onMouseLeave={() => setDropdownState(null)}
              >
                {item}
                <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              <div 
                className={`absolute mt-2 w-64 bg-white rounded-lg shadow-xl p-4 z-50 ${
                  dropdownState === item ? 'opacity-100 visible' : 'opacity-0 invisible'
                } transition-all duration-200`}
                onMouseEnter={() => setDropdownState(item)}
                onMouseLeave={() => setDropdownState(null)}
              >
                <div className="space-y-2">
                  <a href="#" className="block p-2 hover:bg-gray-100 rounded">
                    {item} Option 1
                  </a>
                  <a href="#" className="block p-2 hover:bg-gray-100 rounded">
                    {item} Option 2
                  </a>
                  <a href="#" className="block p-2 hover:bg-gray-100 rounded">
                    {item} Option 3
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">CSS Z-Index and Visibility Test</h2>
        <div className="space-y-4">
          <div className="relative">
            <div className="p-4 bg-blue-200 rounded">Base Layer (z-index: auto)</div>
            <div className="absolute top-full mt-2 left-0 p-4 bg-red-200 rounded z-[9999]">
              Dropdown Layer (z-index: 9999)
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-medium mb-2">Navigation State:</h3>
            <pre className="bg-gray-100 p-3 rounded text-sm">
              {JSON.stringify({ isHovered, dropdownState }, null2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}