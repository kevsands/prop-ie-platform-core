'use client';

import React, { useEffect, useState } from 'react';

export default function TestNavPage() {
  const [navErrors, setNavErrors] = useState<string[]>([]);
  const [mouseEvents, setMouseEvents] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) {
      return;
    }
    
    // Capture console errors
    const originalError = console.error;
    console.error = (...args) => {
      setNavErrors(prev => [...prev, args.join(' ')]);
      originalError(...args);
    };

    // Test dropdown functionality
    const testDropdowns = () => {
      if (typeof document === 'undefined') {
        return;
      }
      const dropdowns = document.querySelectorAll('[aria-expanded]');
      console.log('Found dropdowns:', dropdowns.length);
      
      dropdowns.forEach((dropdown, idx) => {
        const mouseEnterEvent = new MouseEvent('mouseenter', { bubbles: true });
        const mouseLeaveEvent = new MouseEvent('mouseleave', { bubbles: true });
        
        dropdown.dispatchEvent(mouseEnterEvent);
        const isExpanded = dropdown.getAttribute('aria-expanded');
        console.log(`Dropdown ${idx} expanded:`, isExpanded);
        
        setTimeout(() => {
          dropdown.dispatchEvent(mouseLeaveEvent);
        }, 100);
      });
    };

    const timer = setTimeout(testDropdowns, 1000);

    return () => {
      console.error = originalError;
      clearTimeout(timer);
    };
  }, [isClient]);

  const handleDropdownTest = (e: React.MouseEvent) => {
    const target = e.currentTarget;
    setMouseEvents(prev => [...prev, `Click on: ${target.textContent}`]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-4">Navigation Debug Page</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">Console Errors</h2>
        {navErrors.length === 0 ? (
          <p className="text-gray-500">No errors detected</p>
        ) : (
          <ul className="space-y-2">
            {navErrors.map((error, idx) => (
              <li key={idx} className="text-red-600 text-sm font-mono">
                {error}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">Test Dropdowns</h2>
        <div className="space-x-4">
          <button 
            onClick={handleDropdownTest}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            aria-expanded="false"
          >
            Test Dropdown 1
          </button>
          <button 
            onClick={handleDropdownTest}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            aria-expanded="false"
          >
            Test Dropdown 2
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-3">Mouse Events</h2>
        {mouseEvents.length === 0 ? (
          <p className="text-gray-500">No mouse events recorded</p>
        ) : (
          <ul className="space-y-1">
            {mouseEvents.map((event, idx) => (
              <li key={idx} className="text-gray-700 text-sm">
                {event}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}