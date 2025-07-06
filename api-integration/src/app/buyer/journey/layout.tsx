'use client';

import React from 'react';

export default function JourneyLayout({ 
  children 
}: { 
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto max-w-7xl">
      {children}
    </div>
  );
}