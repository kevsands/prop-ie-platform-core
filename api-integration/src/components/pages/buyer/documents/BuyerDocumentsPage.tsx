"use client";

import React from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { DocumentManager } from "@/components/buyer/DocumentManager";

export default function BuyerDocumentsPage() {
  return (
    <ProtectedRoute roles={["buyer"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DocumentManager />
      </div>
    </ProtectedRoute>
  );
}
