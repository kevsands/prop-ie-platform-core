// src/app/buyer/htb/page.tsx
import { Suspense } from "react";
import BuyerHtbPage from "@/components/pages/buyer/htb/BuyerHtbPage";
import { SuspenseCustomizationProvider } from "@/context/SuspenseCustomizationProvider";
import { HTBProvider } from "@/context/HTBContext";
import { HTBErrorBoundary } from "./HTBErrorBoundary";

// Loading fallback component
function HTBLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-pulse text-xl font-semibold text-gray-700">
        Loading Help-to-Buy application...
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <SuspenseCustomizationProvider>
      <HTBErrorBoundary>
        <HTBProvider>
          <Suspense fallback={<HTBLoading />}>
            <BuyerHtbPage />
          </Suspense>
        </HTBProvider>
      </HTBErrorBoundary>
    </SuspenseCustomizationProvider>
  );
}