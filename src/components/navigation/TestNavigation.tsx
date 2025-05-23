'use client';

import React, { useState } from 'react';

export default function TestNavigation() {
  const [activeDropdownsetActiveDropdown] = useState<string | null>(null);

  return (
    <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-16 gap-6">
          <div className="text-2xl font-bold text-[#2B5273]">PropIE</div>

          {/* Test Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown('test')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900">
              Test Dropdown
              <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div className={`absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg transition-all duration-200 ${
              activeDropdown === 'test' 
                ? 'opacity-100 transform translate-y-0 pointer-events-auto' 
                : 'opacity-0 transform -translate-y-2 pointer-events-none'
            }`}>
              <div className="p-4">
                <div className="mb-2 font-semibold text-gray-900">Dropdown Items</div>
                <a href="#" className="block py-2 text-gray-700 hover:text-gray-900">Item 1</a>
                <a href="#" className="block py-2 text-gray-700 hover:text-gray-900">Item 2</a>
                <a href="#" className="block py-2 text-gray-700 hover:text-gray-900">Item 3</a>
              </div>
            </div>
          </div>

          <div className="ml-auto">
            {activeDropdown ? 'Dropdown is active' : 'Hover over dropdown'}
          </div>
        </div>
      </div>
    </div>
  );
}