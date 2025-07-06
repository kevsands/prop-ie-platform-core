"use client";

import NextGenNavigation from '@/components/navigation/NextGenNavigation';

export default function TestNewNav() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NextGenNavigation />
      <div className="pt-24 p-8">
        <h1 className="text-3xl font-bold">Testing New Navigation</h1>
        <p className="mt-4">If you can see this page with the new navigation above, it's working!</p>
      </div>
    </div>
  );
}