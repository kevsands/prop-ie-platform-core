'use client';

export default function TestDebugPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Test Page</h1>
      <p className="mb-4">If you can see this page, the Next.js app is running correctly.</p>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-semibold mb-2">Environment Info:</h2>
        <ul className="list-disc list-inside">
          <li>Node Environment: {process.env.NODE_ENV}</li>
          <li>API URL: {process.env.NEXT_PUBLIC_API_URL || 'Not set'}</li>
          <li>AWS Region: {process.env.NEXT_PUBLIC_AWS_REGION || 'Not set'}</li>
        </ul>
      </div>
      
      <div className="mt-4 bg-green-100 p-4 rounded">
        <p className="text-green-800">✓ Application is working!</p>
      </div>
    </div>
  );
}