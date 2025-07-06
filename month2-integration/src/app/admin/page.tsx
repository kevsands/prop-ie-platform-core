import React from 'react';
import Link from 'next/link';

export default function AdminPortal() {
  return (
    <main className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">Admin Portal</h1>
      <p className="mb-6 text-gray-700">Welcome to your dashboard. Here you can manage users, view site analytics, and oversee content.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/users" className="block p-6 bg-white rounded-lg shadow hover:shadow-lg border border-gray-100 transition">
          <h2 className="font-semibold text-lg mb-2">User Management</h2>
          <p className="text-gray-500">View and manage all users and roles.</p>
        </Link>
        <Link href="/admin/analytics" className="block p-6 bg-white rounded-lg shadow hover:shadow-lg border border-gray-100 transition">
          <h2 className="font-semibold text-lg mb-2">Site Analytics</h2>
          <p className="text-gray-500">Access site usage and performance data.</p>
        </Link>
        <Link href="/admin/content" className="block p-6 bg-white rounded-lg shadow hover:shadow-lg border border-gray-100 transition">
          <h2 className="font-semibold text-lg mb-2">Content Management</h2>
          <p className="text-gray-500">Oversee and edit site content.</p>
        </Link>
      </div>
    </main>
  );
} 