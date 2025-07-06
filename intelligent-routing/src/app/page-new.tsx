'use client';

import React from 'react';
import HeroWithSearch from '@/components/sections/HeroWithSearch';
import { PropertyProvider } from '@/components/HomePage';
import HomePage from '@/components/HomePage';

export default function Page() {
  return (
    <>
      <HeroWithSearch />
      <PropertyProvider>
        <HomePage />
      </PropertyProvider>
    </>
  );
}