'use client';

export default function TestAgentsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Test Agents Page</h1>
      <p className="mt-4">This is a simple test page in the /test-agents route.</p>
      <div className="mt-8 p-4 bg-green-100 rounded">
        <p>If you can see this green box, routing is working!</p>
      </div>
      <div className="mt-8">
        <a href="/solutions/estate-agents" className="text-blue-600 hover:underline">
          Click here to go to the actual Estate Agents page
        </a>
      </div>
    </div>
  );
}