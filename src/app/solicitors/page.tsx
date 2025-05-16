import React from 'react';
import Link from 'next/link';

export default function SolicitorPortal() {
  return (
    <main className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">Solicitor Portal</h1>
      <p className="mb-6 text-gray-700">Welcome to your dashboard. Here you can manage your cases, documents, and contacts.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/solicitors/cases" className="block p-6 bg-white rounded-lg shadow hover:shadow-lg border border-gray-100 transition">
          <h2 className="font-semibold text-lg mb-2">My Cases</h2>
          <p className="text-gray-500">View and manage your legal cases.</p>
        </Link>
        <Link href="/solicitors/documents" className="block p-6 bg-white rounded-lg shadow hover:shadow-lg border border-gray-100 transition">
          <h2 className="font-semibold text-lg mb-2">Documents</h2>
          <p className="text-gray-500">Access and upload legal documents.</p>
        </Link>
        <Link href="/solicitors/contacts" className="block p-6 bg-white rounded-lg shadow hover:shadow-lg border border-gray-100 transition">
          <h2 className="font-semibold text-lg mb-2">Contacts</h2>
          <p className="text-gray-500">Manage your professional contacts.</p>
        </Link>
      </div>
    </main>
  );
} 