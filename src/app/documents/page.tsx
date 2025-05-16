'use client';

import React from 'react';
import DocumentManager from '@/components/documents/DocumentManager';

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