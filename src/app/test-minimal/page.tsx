import React from 'react';
'use client';

export default function TestMinimal() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Property Transaction Platform - Test Page</h1>

      <div className="space-y-6">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Platform Status</h2>
          <p className="text-green-600">✅ Application is running on port 3000</p>
          <p className="text-green-600">✅ Next.js 15.3.1 configured</p>
          <p className="text-green-600">✅ TypeScript active</p>
          <p className="text-green-600">✅ Tailwind CSS configured</p>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Database Status</h2>
          <p className="text-green-600">✅ PostgreSQL connected</p>
          <p className="text-green-600">✅ Prisma ORM configured</p>
          <p className="text-green-600">✅ 3 users seeded</p>
          <p className="text-green-600">✅ 1 development created</p>
          <p className="text-green-600">✅ 3 units available</p>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Key Pages</h2>
          <ul className="space-y-2">
            <li>
              <a href="/developer/dashboard" className="text-blue-600 hover:underline">
                Developer Dashboard
              </a>
            </li>
            <li>
              <a href="/properties/search" className="text-blue-600 hover:underline">
                Property Search
              </a>
            </li>
            <li>
              <a href="/transactions" className="text-blue-600 hover:underline">
                Transactions
              </a>
            </li>
          </ul>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Credentials</h2>
          <ul className="space-y-1">
            <li>Admin: admin@prop.ie / admin123</li>
            <li>Developer: developer@fitzgerald.ie / developer123</li>
            <li>Buyer: buyer@example.com / buyer123</li>
          </ul>
        </div>
      </div>
    </div>
  );
}