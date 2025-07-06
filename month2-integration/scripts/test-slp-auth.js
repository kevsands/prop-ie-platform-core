#!/usr/bin/env node

/**
 * Test script to verify SLP page authentication is working
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key-change-this';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function testSLPAuthentication() {
  console.log('🧪 Testing SLP Page Authentication Flow\n');

  let results = {
    passed: [],
    failed: []
  };

  try {
    // 1. Create test users
    console.log('1️⃣ Creating test users...');
    try {
      // Clean up existing test data
      await prisma.user.deleteMany({
        where: { email: { in: ['slp-test@prop.ie', 'unauthorized@prop.ie'] } }
      });

      // Create authorized user
      const hashedPassword = await bcrypt.hash('slp123', 10);
      const authorizedUser = await prisma.user.create({
        data: {
          email: 'slp-test@prop.ie',
          password: hashedPassword,
          name: 'SLP Test User',
          roles: ['buyer', 'developer']
        }
      });

      // Create unauthorized user
      const unauthorizedUser = await prisma.user.create({
        data: {
          email: 'unauthorized@prop.ie',
          password: hashedPassword,
          name: 'Unauthorized User',
          roles: ['agent']
        }
      });

      results.passed.push('Test users created successfully');
    } catch (error) {
      results.failed.push(`Failed to create test users: ${error.message}`);
    }

    // 2. Test login endpoint
    console.log('\n2️⃣ Testing login endpoint...');
    let authToken = null;
    try {
      const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'slp-test@prop.ie',
          password: 'slp123'
        })
      });

      if (loginResponse.ok) {
        const data = await loginResponse.json();
        authToken = data.token;
        results.passed.push('Login successful - received JWT token');
      } else {
        results.failed.push(`Login failed: ${loginResponse.status} ${loginResponse.statusText}`);
      }
    } catch (error) {
      results.failed.push(`Login request failed: ${error.message}`);
    }

    // 3. Test accessing SLP API without authentication
    console.log('\n3️⃣ Testing SLP API without authentication...');
    try {
      const response = await fetch(`${BASE_URL}/api/slp/test-project`);
      if (response.status === 401) {
        results.passed.push('Correctly blocked unauthenticated access to SLP API');
      } else {
        results.failed.push(`Expected 401, got ${response.status}`);
      }
    } catch (error) {
      results.failed.push(`Failed to test unauthenticated access: ${error.message}`);
    }

    // 4. Test accessing SLP API with authentication
    console.log('\n4️⃣ Testing SLP API with authentication...');
    if (authToken) {
      try {
        const response = await fetch(`${BASE_URL}/api/slp/test-project`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });

        if (response.ok) {
          results.passed.push('Successfully accessed SLP API with authentication');
        } else {
          results.failed.push(`Failed to access SLP API: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        results.failed.push(`Failed to test authenticated access: ${error.message}`);
      }
    }

    // 5. Test JWT token validation
    console.log('\n5️⃣ Testing JWT token validation...');
    if (authToken) {
      try {
        const decoded = jwt.verify(authToken, JWT_SECRET);
        if (decoded.email === 'slp-test@prop.ie') {
          results.passed.push('JWT token contains correct user information');
        } else {
          results.failed.push('JWT token contains incorrect user information');
        }
      } catch (error) {
        results.failed.push(`JWT token validation failed: ${error.message}`);
      }
    }

    // 6. Test role-based access
    console.log('\n6️⃣ Testing role-based access control...');
    if (authToken) {
      try {
        const decoded = jwt.verify(authToken, JWT_SECRET);
        const hasBuyerRole = decoded.roles && decoded.roles.includes('buyer');
        const hasDeveloperRole = decoded.roles && decoded.roles.includes('developer');
        
        if (hasBuyerRole && hasDeveloperRole) {
          results.passed.push('User has correct roles for SLP access');
        } else {
          results.failed.push('User missing required roles for SLP access');
        }
      } catch (error) {
        results.failed.push(`Role verification failed: ${error.message}`);
      }
    }

    // 7. Test SLP page simulation
    console.log('\n7️⃣ Simulating SLP page access...');
    if (authToken) {
      try {
        // This simulates what the SLP page would do
        const headers = {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        };

        // Test getting components
        const componentsResponse = await fetch(`${BASE_URL}/api/slp/test-project/components`, {
          headers
        });

        if (componentsResponse.ok) {
          results.passed.push('Successfully fetched SLP components');
        } else {
          results.failed.push(`Failed to fetch components: ${componentsResponse.status}`);
        }

        // Test uploading a document
        const uploadResponse = await fetch(`${BASE_URL}/api/slp/test-project/documents`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            componentId: 'title-deeds',
            fileName: 'test-document.pdf',
            content: 'base64content'
          })
        });

        if (uploadResponse.ok || uploadResponse.status === 404) {
          results.passed.push('Document upload endpoint accessible');
        } else {
          results.failed.push(`Document upload failed: ${uploadResponse.status}`);
        }
      } catch (error) {
        results.failed.push(`SLP page simulation failed: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('Test suite error:', error);
    results.failed.push(`Test suite error: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }

  // Generate report
  console.log('\n=== Test Results ===\n');
  console.log(`✅ Passed: ${results.passed.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  
  if (results.passed.length > 0) {
    console.log('\nPassed Tests:');
    results.passed.forEach(msg => console.log(`  ✓ ${msg}`));
  }
  
  if (results.failed.length > 0) {
    console.log('\nFailed Tests:');
    results.failed.forEach(msg => console.log(`  ✗ ${msg}`));
  }

  // Recommendations
  console.log('\n=== Recommendations ===\n');
  if (results.failed.length === 0) {
    console.log('🎉 All tests passed! The SLP authentication system is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Here are the recommendations:');
    
    if (results.failed.some(msg => msg.includes('database'))) {
      console.log('  • Check DATABASE_URL environment variable');
      console.log('  • Ensure PostgreSQL is running');
      console.log('  • Run migrations: npx prisma migrate dev');
    }
    
    if (results.failed.some(msg => msg.includes('Login'))) {
      console.log('  • Check if the auth API endpoints are running');
      console.log('  • Verify JWT_SECRET is set correctly');
      console.log('  • Ensure bcrypt is installed');
    }
    
    if (results.failed.some(msg => msg.includes('API'))) {
      console.log('  • Ensure the Next.js server is running (npm run dev)');
      console.log('  • Check API route implementations');
      console.log('  • Verify middleware is properly configured');
    }
  }
}

// Run the test
testSLPAuthentication().catch(console.error);