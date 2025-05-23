'use client';

export default function StatusPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Application Status</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">✅ Server Running</h2>
          <p>Development server is active on port 3001</p>
        </div>

        <div className="bg-blue-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">🔗 Available Pages</h2>
          <ul className="space-y-2">
            <li><a href="/first-time-buyers" className="text-blue-600 hover:underline">/first-time-buyers</a></li>
            <li><a href="/test-htb" className="text-blue-600 hover:underline">/test-htb</a></li>
            <li><a href="/debug" className="text-blue-600 hover:underline">/debug</a></li>
          </ul>
        </div>

        <div className="bg-yellow-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">⚙️ HTB Integration</h2>
          <p>Mock API endpoints created for testing</p>
          <ul className="text-sm mt-2">
            <li>POST /api/htb/buyer/claims</li>
            <li>GET /api/htb/buyer/claims/[id]</li>
          </ul>
        </div>

        <div className="bg-purple-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">📊 Components</h2>
          <ul className="text-sm">
            <li>✅ HTBCalculatorApp</li>
            <li>✅ HTBStatusViewer</li>
            <li>✅ HTBProvider Context</li>
          </ul>
        </div>
      </div>
    </div>
  );
}