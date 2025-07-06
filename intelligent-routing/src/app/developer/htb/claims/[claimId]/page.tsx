// src/app/developer/htb/claims/[claimId]/page.tsx
import { HTBClaimProcessor } from '@/components/htb/developer/HTBClaimProcessor';
import { NextPageParams } from '@/types/next-api';

// Fix for Next.js 15+ compatibility with page parameters
export default function HTBClaimProcessorPage({ params }: NextPageParams) {
  return <HTBClaimProcessor claimId={params.claimId} />;
}