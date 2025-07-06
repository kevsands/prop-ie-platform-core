"use client";

import React from 'react';
import CleanProfessionalNav from '@/components/navigation/CleanProfessionalNav';
import HeroWithSearch from '@/components/sections/HeroWithSearch';

export default function HomePageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CleanProfessionalNav />
      <div className="pt-16"> {/* Space for fixed navigation */}
        <HeroWithSearch />
        <main>
          {children}
        </main>
      </div>
    </>
  );
}