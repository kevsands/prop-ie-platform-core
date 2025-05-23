import React from 'react';
'use client';

import Link from 'next/link';

export default function TestDeveloperPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Developer Portal Test Page</h1>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Available Pages:</h2>

        <div className="grid grid-cols-2 gap-4">
          <Link 
            href="/developer" 
            className="p-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Dashboard
          </Link>

          <Link 
            href="/developer/developments" 
            className="p-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
          >
            Developments
          </Link>

          <Link 
            href="/developer/projects" 
            className="p-4 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
          >
            Projects
          </Link>

          <Link 
            href="/developer/team/members" 
            className="p-4 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors"
          >
            Team Members
          </Link>

          <Link 
            href="/developer/team/contractors" 
            className="p-4 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            Contractors
          </Link>

          <Link 
            href="/developer/tenders" 
            className="p-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            Tenders
          </Link>

          <Link 
            href="/developer/financial" 
            className="p-4 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors"
          >
            Financial
          </Link>

          <Link 
            href="/developer/sales" 
            className="p-4 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition-colors"
          >
            Sales
          </Link>

          <Link 
            href="/developer/analytics" 
            className="p-4 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors"
          >
            Analytics
          </Link>

          <Link 
            href="/developer/documents" 
            className="p-4 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Documents
          </Link>

          <Link 
            href="/developer/settings/company" 
            className="p-4 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Company Settings
          </Link>
        </div>
      </div>

      <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-800">✅ All developer portal pages have been created and are ready to use!</p>
      </div>
    </div>
  );
}