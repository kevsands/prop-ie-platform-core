import React from 'react';
import Link from 'next/link';

export default function DeveloperPortal() {
  return (
    <main className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">Developer Portal</h1>
      <p className="mb-6 text-gray-700">Welcome to your dashboard. Here you can manage your projects, analytics, and submissions.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/developers/projects" className="block p-6 bg-white rounded-lg shadow hover:shadow-lg border border-gray-100 transition">
          <h2 className="font-semibold text-lg mb-2">My Projects</h2>
          <p className="text-gray-500">View and manage your development projects.</p>
        </Link>
        <Link href="/developers/analytics" className="block p-6 bg-white rounded-lg shadow hover:shadow-lg border border-gray-100 transition">
          <h2 className="font-semibold text-lg mb-2">Analytics</h2>
          <p className="text-gray-500">Access project analytics and reports.</p>
        </Link>
        <Link href="/developers/submissions" className="block p-6 bg-white rounded-lg shadow hover:shadow-lg border border-gray-100 transition">
          <h2 className="font-semibold text-lg mb-2">Submissions</h2>
          <p className="text-gray-500">Submit new projects or proposals.</p>
        </Link>
      </div>
    </main>
  );
} 