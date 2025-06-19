'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Download, 
  Trash2, 
  Eye,
  Search,
  Plus,
  Tag,
  Calendar,
  User,
  AlertTriangle,
  X
} from 'lucide-react';

export function DocumentManager() {
  const { user } = useAuth();
  
  // Require authenticated user - redirect to login if not authenticated
  if (!user?.id) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
        <p className="text-gray-600 mb-4">Please log in to manage your documents.</p>
        <button 
          onClick={() => window.location.href = '/login'} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }
  
  const buyerId = user.id;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Your Documents</h1>
        <p className="text-muted-foreground mt-1">
          Upload and manage all the documents needed for your home buying journey
        </p>
      </div>
      
      <BuyerDocumentProvider buyerId={buyerId}>
        <BuyerDocumentRepository />
      </BuyerDocumentProvider>
    </div>
  );
}

export default DocumentManager;
