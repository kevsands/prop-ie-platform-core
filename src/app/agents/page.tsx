import React from 'react';
import Link from 'next/link';

export default function AgentPortal() {
  return (
    <main className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">Agent Portal</h1>
      <p className="mb-6 text-gray-700">Welcome to your dashboard. Here you can manage your listings, leads, and access resources.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/agents/listings" className="block p-6 bg-white rounded-lg shadow hover:shadow-lg border border-gray-100 transition">
          <h2 className="font-semibold text-lg mb-2">My Listings</h2>
          <p className="text-gray-500">View and manage your property listings.</p>
        </Link>
        <Link href="/agents/leads" className="block p-6 bg-white rounded-lg shadow hover:shadow-lg border border-gray-100 transition">
          <h2 className="font-semibold text-lg mb-2">Leads</h2>
          <p className="text-gray-500">Track and respond to buyer inquiries.</p>
        </Link>
        <Link href="/agents/resources" className="block p-6 bg-white rounded-lg shadow hover:shadow-lg border border-gray-100 transition">
          <h2 className="font-semibold text-lg mb-2">Resources</h2>
          <p className="text-gray-500">Access marketing materials and support.</p>
        </Link>
      </div>
    </main>
  );
} 