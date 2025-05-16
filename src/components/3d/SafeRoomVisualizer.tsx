'use client';

import React, { Suspense, useEffect, useState } from 'react';
import RoomVisualizer from './RoomVisualizer';

/**
 * SafeRoomVisualizer Component
 * 
 * A wrapper around the RoomVisualizer that provides:
 * - Error handling
 * - Fallback UI during loading
 * - Performance optimizations
 * - Safe rendering that won't break if 3D capabilities aren't available
 */
export default function SafeRoomVisualizer({ 
  room = "livingRoom",
  height = 500,
  onError
}: { 
  room?: string;
  height?: number;
  onError?: (error: Error) => void;
}) {
  const [isClient, setIsClient] = useState(false);
  const [is3DSupported, setIs3DSupported] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Only enable on client side
  useEffect(() => {
    setIsClient(true);
    
    // Check for WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setIs3DSupported(!!gl);
    } catch (err) {
      setIs3DSupported(false);
      const error = err instanceof Error ? err : new Error('Failed to initialize WebGL');
      setError(error);
      if (onError) onError(error);
    }
  }, [onError]);

  // Show nothing during SSR
  if (!isClient) {
    return (
      <div 
        className="w-full bg-gray-100 rounded-lg flex items-center justify-center" 
        style={{ height: `${height}px` }}
      >
        <div className="text-center p-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading 3D viewer...</p>
        </div>
      </div>
    );
  }

  // Show fallback if 3D is not supported
  if (!is3DSupported || error) {
    return (
      <div 
        className="w-full bg-gray-100 rounded-lg flex items-center justify-center" 
        style={{ height: `${height}px` }}
      >
        <div className="text-center p-8">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-12 w-12 text-gray-400 mx-auto mb-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">3D Visualization Unavailable</h3>
          <p className="text-gray-500">
            Your browser doesn't support WebGL, which is required for 3D visualization.
          </p>
          <p className="text-gray-500 mt-2">
            Please try using a modern browser or device.
          </p>
        </div>
      </div>
    );
  }

  // Render with Suspense for loading state
  return (
    <Suspense fallback={
      <div 
        className="w-full bg-gray-100 rounded-lg flex items-center justify-center" 
        style={{ height: `${height}px` }}
      >
        <div className="text-center p-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading 3D room visualization...</p>
        </div>
      </div>
    }>
      <RoomVisualizer 
        room={room}
        height={height}
      />
    </Suspense>
  );
}