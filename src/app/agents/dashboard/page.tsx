"use client";

export default function AgentsDashboard() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Estate Agents Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Lead Management</h2>
          <p className="text-gray-600">Track and manage your property leads</p>
          <div className="mt-4">
            <div className="text-2xl font-bold text-blue-600">47</div>
            <div className="text-sm text-gray-500">Active Leads</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Commission Tracking</h2>
          <p className="text-gray-600">Monitor your commission earnings</p>
          <div className="mt-4">
            <div className="text-2xl font-bold text-green-600">€28,500</div>
            <div className="text-sm text-gray-500">This Month</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Property Matches</h2>
          <p className="text-gray-600">AI-powered property matching</p>
          <div className="mt-4">
            <div className="text-2xl font-bold text-purple-600">12</div>
            <div className="text-sm text-gray-500">New Matches</div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Advanced CRM Features Coming Soon</h3>
        <ul className="space-y-2 text-gray-700">
          <li>• Automated follow-up campaigns</li>
          <li>• Advanced lead scoring</li>
          <li>• Commission automation</li>
          <li>• Property matching algorithms</li>
        </ul>
      </div>
    </div>
  );
}