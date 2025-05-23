'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function DemoLogin() {
  const router = useRouter();
  const [isLoadingsetIsLoading] = useState(false);

  const handleDemoLogin = async () => {
    setIsLoading(true);

    // For demo purposes, directly navigate without auth
    router.push('/enterprise-demo');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center mb-6">Demo Access</h1>
          <p className="text-gray-600 text-center mb-8">
            Click below to access the enterprise platform demo
          </p>

          <button
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Access Demo Platform'}
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              For development purposes only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}