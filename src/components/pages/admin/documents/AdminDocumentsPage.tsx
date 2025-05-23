'use client';

import React from 'react';

/**
 * Admin Documents Page Component - Simplified for Build Testing
 * 
 * This is a simplified version of the AdminDocumentsPage component used for build testing.
 */
export default function AdminDocumentsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-amber-50 p-3 mb-6 rounded text-amber-800 text-sm">
        <div className="font-medium">Simplified Admin Documents Page</div>
        <div>This is a simplified version for build testing. Limited functionality is available.</div>
      </div>

      <h1 className="text-3xl font-bold mb-6">Document Management</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Document Dashboard</h2>
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800">Total Documents</h3>
            <p className="text-2xl font-bold">258</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-800">Approved</h3>
            <p className="text-2xl font-bold">187</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-medium text-yellow-800">Pending Review</h3>
            <p className="text-2xl font-bold">42</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-medium text-red-800">Rejected</h3>
            <p className="text-2xl font-bold">29</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Recent Document Uploads</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Upload New</button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Document Name</th>
                <th className="py-2 px-4 border-b text-left">Uploaded By</th>
                <th className="py-2 px-4 border-b text-left">Date</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b">Contract_Template_2023.pdf</td>
                <td className="py-2 px-4 border-b">John Murphy</td>
                <td className="py-2 px-4 border-b">2023-04-28</td>
                <td className="py-2 px-4 border-b"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Approved</span></td>
                <td className="py-2 px-4 border-b">
                  <button className="text-blue-600 mr-2">View</button>
                  <button className="text-gray-600">Edit</button>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Financial_Agreement_V2.docx</td>
                <td className="py-2 px-4 border-b">Sarah Connor</td>
                <td className="py-2 px-4 border-b">2023-04-25</td>
                <td className="py-2 px-4 border-b"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Pending</span></td>
                <td className="py-2 px-4 border-b">
                  <button className="text-blue-600 mr-2">View</button>
                  <button className="text-gray-600">Edit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}