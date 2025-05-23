'use client';

import React from 'react';
import { formatDate } from '@/utils/date-utils';

interface ClaimDocumentsProps {
  documents: any[]; // Ideally, you should define a proper type for your documents
}

export function ClaimDocuments({ documents }: ClaimDocumentsProps) {
  if (!documents || documents.length === 0) {
    return (
      <div className="text-center py-12 bg-white shadow overflow-hidden sm:rounded-lg">
        <p className="text-gray-500">No documents available for this claim</p>
      </div>
    );
  }

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'revenue_correspondence':
        return 'Revenue Correspondence';
      case 'bank_statement':
        return 'Bank Statement';
      case 'identity_verification':
        return 'Identity Verification';
      case 'deposit_receipt':
        return 'Deposit Receipt';
      case 'contract':
        return 'Contract';
      default:
        return 'Other';
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Claim Documents
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          All documents associated with this HTB claim
        </p>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {documents.map((documentindex: any) => (
            <li key={document.id || index} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {document.name || `Document ${index + 1}`}
                    </div>
                    <div className="text-sm text-gray-500 flex space-x-2">
                      <span>{getDocumentTypeLabel(document.type)}</span>
                      <span>•</span>
                      <span>{formatDate(document.uploadedAt || document.createdAt)}</span>
                      {document.uploadedBy && (
                        <>
                          <span>•</span>
                          <span>Uploaded by {document.uploadedBy}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  {document.url && (
                    <a
                      href={document.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View
                    </a>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}