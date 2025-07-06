'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Info } from 'lucide-react';

export default function TestAuthPage() {
  const { user, isAuthenticated, loading, login, logout } = useAuth();

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading auth state...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Authentication Test Page</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Auth Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
            <CardDescription>Current authentication state</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {isAuthenticated ? (
                  <CheckCircle className="text-green-600 h-5 w-5" />
                ) : (
                  <XCircle className="text-red-600 h-5 w-5" />
                )}
                <span className="font-medium">
                  {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                </span>
              </div>
              
              {user && (
                <div className="space-y-2 mt-4 p-4 bg-gray-50 rounded-lg">
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                  <p><strong>User ID:</strong> {user.id}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Test Actions</CardTitle>
            <CardDescription>Test authentication flow</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isAuthenticated ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Click a test account to login:</p>
                
                <div className="space-y-2">
                  <Button 
                    onClick={() => login('buyer@example.com', 'test123')}
                    className="w-full justify-start"
                  >
                    <Info className="mr-2 h-4 w-4" />
                    Login as Buyer
                  </Button>
                  
                  <Button 
                    onClick={() => login('developer@example.com', 'test123')}
                    className="w-full justify-start"
                  >
                    <Info className="mr-2 h-4 w-4" />
                    Login as Developer
                  </Button>
                  
                  <Button 
                    onClick={() => login('agent@example.com', 'test123')}
                    className="w-full justify-start"
                  >
                    <Info className="mr-2 h-4 w-4" />
                    Login as Agent
                  </Button>
                  
                  <Button 
                    onClick={() => login('solicitor@example.com', 'test123')}
                    className="w-full justify-start"
                  >
                    <Info className="mr-2 h-4 w-4" />
                    Login as Solicitor
                  </Button>
                  
                  <Button 
                    onClick={() => login('admin@example.com', 'test123')}
                    className="w-full justify-start"
                  >
                    <Info className="mr-2 h-4 w-4" />
                    Login as Admin
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  You are logged in as <strong>{user?.role}</strong>
                </p>
                
                <Button 
                  onClick={logout}
                  variant="destructive"
                  className="w-full"
                >
                  Logout
                </Button>
                
                <div className="pt-4 space-y-2">
                  <p className="text-sm font-medium">Test Protected Routes:</p>
                  <div className="space-y-2">
                    <a href="/buyer/dashboard" className="block">
                      <Button variant="outline" className="w-full justify-start">
                        → Buyer Dashboard (buyer only)
                      </Button>
                    </a>
                    
                    <a href="/developer/dashboard" className="block">
                      <Button variant="outline" className="w-full justify-start">
                        → Developer Dashboard (developer only)
                      </Button>
                    </a>
                    
                    <a href="/project-management" className="block">
                      <Button variant="outline" className="w-full justify-start">
                        → Project Management (developer/admin)
                      </Button>
                    </a>
                    
                    <a href="/admin" className="block">
                      <Button variant="outline" className="w-full justify-start">
                        → Admin Panel (admin only)
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Authentication Flow Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-medium mb-2">How it works:</h3>
              <ol className="list-decimal list-inside space-y-1 text-gray-600">
                <li>Login with test credentials</li>
                <li>Auth context stores user info and token in localStorage</li>
                <li>Protected routes check authentication state</li>
                <li>Unauthorized users are redirected to login</li>
                <li>Role-based routes check user permissions</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Test Scenarios:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Login with different roles to see role-based redirects</li>
                <li>Try accessing protected routes when logged out</li>
                <li>Test role-specific dashboards</li>
                <li>Check navigation updates after login/logout</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}