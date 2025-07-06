'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const DocumentManager = dynamic(
  () => import('@/components/documents/DocumentManager'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }
);

export default function DocumentsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Document Management</h1>
      
      <DocumentManager 
        allowUpload={true}
      />
    </div>
  );
}