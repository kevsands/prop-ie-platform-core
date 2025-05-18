'use client';

import { useEffect, useState } from 'react';

export default function TestDeployment() {
  const [status, setStatus] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      try {
        // Check health
        const healthRes = await fetch('/api/health');
        const health = await healthRes.json();
        
        // Check session
        const sessionRes = await fetch('/api/auth/session');
        const session = await sessionRes.json();
        
        setStatus({
          health,
          session,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        setStatus({ error: 'Failed to fetch status' });
      } finally {
        setLoading(false);
      }
    }
    
    checkStatus();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Deployment Status</h1>
        
        {loading ? (
          <p>Loading...</p>
        ) : (
          <pre className="bg-white p-6 rounded-lg shadow">
            {JSON.stringify(status, null, 2)}
          </pre>
        )}
        
        <div className="mt-8 grid grid-cols-2 gap-4">
          <a 
            href="/auth/login" 
            className="bg-blue-600 text-white p-4 rounded text-center hover:bg-blue-700"
          >
            Test Login
          </a>
          <a 
            href="/monitoring" 
            className="bg-green-600 text-white p-4 rounded text-center hover:bg-green-700"
          >
            View Monitoring
          </a>
        </div>
      </div>
    </div>
  );
}