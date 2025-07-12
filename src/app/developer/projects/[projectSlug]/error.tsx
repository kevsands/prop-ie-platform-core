'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProjectError({ error, reset }: ErrorPageProps) {
  return (
    <div className="min-h-[600px] flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <AlertTriangle className="h-16 w-16 text-red-500" />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Loading Error</h2>
          <p className="text-gray-600">
            We encountered an issue loading this project. This could be due to:
          </p>
          <ul className="text-sm text-gray-500 mt-2 space-y-1">
            <li>• Project not found or access denied</li>
            <li>• Network connectivity issues</li>
            <li>• Temporary server error</li>
          </ul>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
            <h3 className="font-semibold text-red-800 mb-2">Development Error Details:</h3>
            <p className="text-sm text-red-700 font-mono">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-600 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
          
          <Link
            href="/developer"
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Home size={16} />
            Developer Dashboard
          </Link>
        </div>

        <div className="text-xs text-gray-400">
          If this problem persists, please contact support with error ID: {error.digest}
        </div>
      </div>
    </div>
  );
}