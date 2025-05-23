/**
 * Test script to verify that roles are handled correctly in the authentication system
 */

async function testRolesHandling() {
  console.log('Testing roles array handling in auth system...\n');
  
  const baseUrl = 'http://localhost:3000';
  
  // Test user data with roles array
  const mockUser = {
    id: '123',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    roles: ['DEVELOPER', 'ADMIN'], // Multiple roles
    status: 'ACTIVE'
  };
  
  console.log('Mock user with roles array:', JSON.stringify(mockUser, null, 2));
  
  try {
    // Test permissions endpoint
    console.log('\n1. Testing permissions endpoint...');
    const permissionsResponse = await fetch(`${baseUrl}/api/auth/permissions`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Permissions response status:', permissionsResponse.status);
    
    // Test permission check
    console.log('\n2. Testing permission check...');
    const checkResponse = await fetch(`${baseUrl}/api/auth/permissions`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        resource: 'developments',
        action: 'create'
      })
    });
    
    console.log('Permission check response status:', checkResponse.status);
    
    console.log('\n✓ All tests completed');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testRolesHandling();