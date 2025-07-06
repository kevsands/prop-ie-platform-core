'use client';

import React from 'react';
import HeroWithCarousel from '@/components/sections/HeroWithCarousel';
import { PropertyProvider } from '@/components/HomePage';
import HomePage from '@/components/HomePage';

export default function Page() {
  return (
    <>
      <HeroWithCarousel />
      <PropertyProvider>
        <HomePage />
      </PropertyProvider>
    </>
  );
}