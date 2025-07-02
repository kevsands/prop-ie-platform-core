'use client';

import React, { useState } from 'react';
import { DocumentManagerNew } from '@/components/buyer/DocumentManagerNew';
import UnifiedDocumentManager from '@/components/documents/UnifiedDocumentManager';
import { ArrowLeft, ArrowRight, ToggleLeft, ToggleRight } from 'lucide-react';

export default function BuyerDocumentsPage() {
  const [viewMode, setViewMode] = useState<'unified' | 'simple'>('unified');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Management</h1>
            <p className="text-gray-600">
              Securely upload and manage all your documents required for the home buying process.
            </p>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">View Mode:</span>
            <button
              onClick={() => setViewMode(viewMode === 'unified' ? 'simple' : 'unified')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {viewMode === 'unified' ? (
                <>
                  <ToggleRight className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium">Unified System</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium">Simple Manager</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mode Description */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          {viewMode === 'unified' ? (
            <div className="flex items-center gap-3">
              <ArrowRight className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Unified Document System</p>
                <p className="text-sm text-blue-700">
                  Comprehensive document management integrating first-time-buyer and investor verification systems
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Simple Document Manager</p>
                <p className="text-sm text-gray-700">
                  Streamlined document upload interface for quick file management
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Render appropriate component based on view mode */}
      {viewMode === 'unified' ? (
        <UnifiedDocumentManager 
          showIntegrationOptions={true}
          userType="existing-buyer"
        />
      ) : (
        <DocumentManagerNew />
      )}

      {/* Integration Info */}
      <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="font-semibold text-green-900 mb-2">System Integration</h3>
        <p className="text-sm text-green-800">
          Your documents are automatically synchronized between the simple manager and the comprehensive 
          first-time-buyer system. Upload in either interface and access from anywhere in the platform.
        </p>
      </div>
    </div>
  );
}
