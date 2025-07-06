'use client';

// src/app/buyer/htb/buyer/developer/HTBClaimProcessor.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { HTBClaimProcessor } from '@/components/htb/developer/HTBClaimProcessor';

// This is a wrapper component for the HTB Claim Processor
export default function HTBClaimProcessorWrapper({ params }: { params: { claimId: string } }) {
  const router = useRouter();
  const claimId = params?.claimId;
  
  if (!claimId) {
    return <div>Missing claim ID</div>;
  }
  
  return <HTBClaimProcessor claimId={claimId} />;
}