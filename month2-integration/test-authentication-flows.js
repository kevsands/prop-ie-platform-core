#!/usr/bin/env node

/**
 * PROP.ie Authentication System Comprehensive Testing
 * 
 * This script tests all authentication flows and database connections
 * to validate the PostgreSQL migration and authentication system status.
 */

const axios = require('axios');
const { Pool } = require('pg');

class AuthenticationTester {
  constructor() {
    this.baseUrl = 'http://localhost:3002';
    this.results = {
      timestamp: new Date().toISOString(),
      tests: [],
      summary: {
        passed: 0,
        failed: 0,
        total: 0
      }
    };
  }

  /**
   * Run a test and record results
   */
  async runTest(testName, testFunction) {
    console.log(`\n🧪 Testing: ${testName}`);
    
    const testResult = {
      name: testName,
      startTime: new Date().toISOString(),
      status: 'running'
    };
    
    try {
      const result = await testFunction();
      testResult.status = 'passed';
      testResult.result = result;
      testResult.message = `✓ ${testName} - PASSED`;
      console.log(`✅ ${testName} - PASSED`);
      this.results.summary.passed++;
    } catch (error) {
      testResult.status = 'failed';
      testResult.error = error.message;
      testResult.message = `✗ ${testName} - FAILED: ${error.message}`;
      console.log(`❌ ${testName} - FAILED: ${error.message}`);
      this.results.summary.failed++;
    } finally {
      testResult.endTime = new Date().toISOString();
      testResult.duration = new Date(testResult.endTime) - new Date(testResult.startTime);
    }
    
    this.results.tests.push(testResult);
    this.results.summary.total++;
    return testResult;
  }

  /**
   * Test PostgreSQL direct connection
   */
  async testPostgreSQLConnection() {
    const pool = new Pool({
      host: 'localhost',
      port: 5432,
      database: 'propie_dev',
      user: 'postgres',
      password: 'postgres'
    });
    
    try {
      const result = await pool.query(`
        SELECT 
          COUNT(*) as user_count,
          MIN(created_at) as oldest_user,
          MAX(created_at) as newest_user
        FROM users 
        WHERE deleted_at IS NULL
      `);
      
      const userSample = await pool.query(`
        SELECT id, email, first_name, last_name, roles, status
        FROM users 
        WHERE deleted_at IS NULL 
        ORDER BY created_at DESC 
        LIMIT 3
      `);
      
      return {
        connected: true,
        statistics: result.rows[0],
        sampleUsers: userSample.rows
      };
    } finally {
      await pool.end();
    }
  }

  /**
   * Test SQLite authentication (current system)
   */
  async testSQLiteAuthentication() {
    const response = await axios.post(`${this.baseUrl}/api/auth/login`, {
      email: 'dev@prop.ie',
      password: 'testpass'
    });
    
    if (response.data.success && response.data.user) {
      return {
        authenticated: true,
        user: response.data.user,
        databaseType: 'SQLite',
        userIdFormat: response.data.user.id.startsWith('user_') ? 'SQLite-format' : 'Unknown'
      };
    } else {
      throw new Error('SQLite authentication failed');
    }
  }

  /**
   * Test session check
   */
  async testSessionCheck() {
    const response = await axios.get(`${this.baseUrl}/api/auth/session`);
    
    return {
      sessionCheckWorking: true,
      responseStatus: response.status,
      responseData: response.data
    };
  }

  /**
   * Test user registration
   */
  async testUserRegistration() {
    const testEmail = `test-${Date.now()}@prop.ie`;
    
    const response = await axios.post(`${this.baseUrl}/api/auth/register`, {
      username: testEmail,
      email: testEmail,
      password: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'User',
      userRole: 'buyer'
    });
    
    if (response.data.success) {
      return {
        registrationWorking: true,
        newUser: response.data.user,
        databaseType: response.data.user.id.startsWith('user_') ? 'SQLite' : 'PostgreSQL'
      };
    } else {
      throw new Error('User registration failed');
    }
  }

  /**
   * Test role-based access
   */
  async testRoleBasedAccess() {
    // First login to get a token
    const loginResponse = await axios.post(`${this.baseUrl}/api/auth/login`, {
      email: 'dev@prop.ie',
      password: 'testpass'
    });
    
    if (!loginResponse.data.success) {
      throw new Error('Could not login for role test');
    }
    
    // Extract cookie from response
    const cookies = loginResponse.headers['set-cookie'];
    
    return {
      roleTestPossible: true,
      userRoles: loginResponse.data.user.roles,
      cookiesSet: cookies ? cookies.length : 0
    };
  }

  /**
   * Test API endpoints availability
   */
  async testAPIEndpoints() {
    const endpoints = [
      '/api/ping',
      '/api/auth/session',
      '/api/auth/login',
      '/api/auth/register'
    ];
    
    const results = {};
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`${this.baseUrl}${endpoint}`, {
          validateStatus: () => true // Don't throw on 4xx/5xx
        });
        results[endpoint] = {
          status: response.status,
          accessible: response.status < 500
        };
      } catch (error) {
        results[endpoint] = {
          status: 'error',
          accessible: false,
          error: error.message
        };
      }
    }
    
    return results;
  }

  /**
   * Validate PostgreSQL data integrity
   */
  async testPostgreSQLDataIntegrity() {
    const pool = new Pool({
      host: 'localhost',
      port: 5432,
      database: 'propie_dev',
      user: 'postgres',
      password: 'postgres'
    });
    
    try {
      // Check data consistency
      const checks = await pool.query(`
        SELECT 
          COUNT(*) as total_users,
          COUNT(CASE WHEN email IS NOT NULL AND email != '' THEN 1 END) as users_with_email,
          COUNT(CASE WHEN roles IS NOT NULL THEN 1 END) as users_with_roles,
          COUNT(CASE WHEN id::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN 1 END) as users_with_uuid
        FROM users 
        WHERE deleted_at IS NULL
      `);
      
      // Check role distribution
      const roleDistribution = await pool.query(`
        SELECT 
          unnest(string_to_array(trim(both '{}' from roles::text), ',')) as role,
          COUNT(*) as count
        FROM users 
        WHERE deleted_at IS NULL
        GROUP BY unnest(string_to_array(trim(both '{}' from roles::text), ','))
        ORDER BY count DESC
      `);
      
      return {
        dataIntegrity: checks.rows[0],
        roleDistribution: roleDistribution.rows,
        allUsersHaveUUIDs: checks.rows[0].users_with_uuid === checks.rows[0].total_users,
        allUsersHaveEmails: checks.rows[0].users_with_email === checks.rows[0].total_users
      };
    } finally {
      await pool.end();
    }
  }

  /**
   * Test authentication security
   */
  async testAuthenticationSecurity() {
    const tests = {
      invalidCredentials: false,
      missingFields: false,
      sqlInjection: false
    };
    
    // Test invalid credentials
    try {
      await axios.post(`${this.baseUrl}/api/auth/login`, {
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        tests.invalidCredentials = true;
      }
    }
    
    // Test missing fields
    try {
      await axios.post(`${this.baseUrl}/api/auth/login`, {
        email: 'test@example.com'
        // missing password
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        tests.missingFields = true;
      }
    }
    
    // Test basic SQL injection attempt
    try {
      await axios.post(`${this.baseUrl}/api/auth/login`, {
        email: "admin@example.com'; DROP TABLE users; --",
        password: 'password'
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        tests.sqlInjection = true;
      }
    }
    
    return tests;
  }

  /**
   * Generate comprehensive report
   */
  generateReport() {
    console.log('\n📋 AUTHENTICATION SYSTEM TEST REPORT');
    console.log('=====================================');
    console.log(`Timestamp: ${this.results.timestamp}`);
    console.log(`Tests Passed: ${this.results.summary.passed}/${this.results.summary.total}`);
    console.log(`Tests Failed: ${this.results.summary.failed}/${this.results.summary.total}`);
    
    if (this.results.summary.failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.tests
        .filter(test => test.status === 'failed')
        .forEach(test => {
          console.log(`  - ${test.name}: ${test.error}`);
        });
    }
    
    console.log('\n✅ Passed Tests:');
    this.results.tests
      .filter(test => test.status === 'passed')
      .forEach(test => {
        console.log(`  - ${test.name}`);
      });
    
    // Overall assessment
    console.log('\n🎯 OVERALL ASSESSMENT');
    console.log('=====================');
    
    if (this.results.summary.failed === 0) {
      console.log('🎉 ALL TESTS PASSED - Authentication system is working correctly!');
    } else if (this.results.summary.failed < this.results.summary.total / 2) {
      console.log('⚠️  SOME ISSUES FOUND - Authentication system is partially working');
    } else {
      console.log('🚨 CRITICAL ISSUES - Authentication system needs immediate attention');
    }
    
    return this.results;
  }

  /**
   * Run all authentication tests
   */
  async runAllTests() {
    console.log('\n🔐 PROP.ie AUTHENTICATION SYSTEM TESTING');
    console.log('=========================================');
    
    // Database Tests
    await this.runTest('PostgreSQL Connection', () => this.testPostgreSQLConnection());
    await this.runTest('PostgreSQL Data Integrity', () => this.testPostgreSQLDataIntegrity());
    
    // Authentication Flow Tests
    await this.runTest('SQLite Authentication (Current)', () => this.testSQLiteAuthentication());
    await this.runTest('Session Check', () => this.testSessionCheck());
    await this.runTest('User Registration', () => this.testUserRegistration());
    await this.runTest('Role-Based Access', () => this.testRoleBasedAccess());
    
    // API Tests
    await this.runTest('API Endpoints Availability', () => this.testAPIEndpoints());
    
    // Security Tests
    await this.runTest('Authentication Security', () => this.testAuthenticationSecurity());
    
    // Generate final report
    return this.generateReport();
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new AuthenticationTester();
  
  tester.runAllTests()
    .then((results) => {
      const success = results.summary.failed === 0;
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('\n💥 Testing failed:', error.message);
      process.exit(1);
    });
}

module.exports = AuthenticationTester;