import React from 'react';
// src/app/buyer/htb/status/page.tsx
import BuyerHtbStatusPage from "@/components/pages/buyer/htb/status/BuyerHtbStatusPage";
import { HTBProvider } from "@/context/HTBContext";
import { HTBErrorBoundary } from "../HTBErrorBoundary";

export default function Page() {
  return (
    <HTBErrorBoundary>
      <HTBProvider>
        <BuyerHtbStatusPage />
      </HTBProvider>
    </HTBErrorBoundary>
  );
}
