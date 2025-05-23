"use client";

import React from "react";
import BuyerDocumentRepository from "@/components/buyer/documents/BuyerDocumentRepository";
import { BuyerDocumentProvider } from "@/context/BuyerDocumentContext";
import { useAuth } from "@/context/AuthContext";

// Mock user ID (replace with real authentication later)
const MOCK_USER_ID = 'user-123';

export function DocumentManager() {
  const { user } = useAuth();
  
  // Use the authenticated user's ID if available, otherwise use mock ID
  const buyerId = user?.id || MOCK_USER_ID;

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
