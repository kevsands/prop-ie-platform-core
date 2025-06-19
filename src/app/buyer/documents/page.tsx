'use client';

import React from 'react';
import { DocumentManagerNew } from '@/components/buyer/DocumentManagerNew';

export default function BuyerDocumentsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Management</h1>
        <p className="text-gray-600">
          Securely upload and manage all your documents required for the home buying process.
        </p>
      </div>
      
      <DocumentManagerNew />
    </div>
  );
}
