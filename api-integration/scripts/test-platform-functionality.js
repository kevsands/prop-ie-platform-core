#!/usr/bin/env node

/**
 * Platform Functionality Test Script
 * Tests all key functionality including:
 * 1. Database connectivity with Prisma
 * 2. Authentication service (login/register)
 * 3. JWT token generation and validation
 * 4. Protected API routes
 * 5. SLP service operations
 * 6. Transaction coordinator
 */

const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const chalk = require('chalk');
const ora = require('ora');

const BASE_URL = process.env.API_URL || 'http://localhost:3000';

class PlatformTester {
  constructor() {
    this.prisma = new PrismaClient();
    this.testUser = {
      email: `test${Date.now()}@example.com`,
      password: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'User'
    };
    this.token = null;
    this.refreshToken = null;
    this.results = {
      passed: [],
      failed: []
    };
  }

  // Utility methods
  log(message, type = 'info') {
    const colors = {
      info: chalk.blue,
      success: chalk.green,
      warning: chalk.yellow,
      error: chalk.red
    };
    console.log(colors[type](`[${type.toUpperCase()}] ${message}`));
  }

  async testWithSpinner(testName, testFn) {
    const spinner = ora(`Testing ${testName}...`).start();
    try {
      await testFn();
      spinner.succeed(`${testName} passed`);
      this.results.passed.push(testName);
    } catch (error) {
      spinner.fail(`${testName} failed`);
      this.log(error.message, 'error');
      this.results.failed.push({ testName, error: error.message });
    }
  }

  // Test methods
  async testDatabaseConnectivity() {
    await this.testWithSpinner('Database Connectivity', async () => {
      // Test Prisma connection
      const result = await this.prisma.$queryRaw`SELECT 1 as test`;
      if (!result || result.length === 0) {
        throw new Error('Database query failed');
      }

      // Test basic model query
      const userCount = await this.prisma.user.count();
      this.log(`Found ${userCount} users in database`, 'info');
    });
  }

  async testUserRegistration() {
    await this.testWithSpinner('User Registration', async () => {
      const response = await axios.post(`${BASE_URL}/api/auth/register`, {
        email: this.testUser.email,
        password: this.testUser.password,
        firstName: this.testUser.firstName,
        lastName: this.testUser.lastName
      });

      if (!response.data.success) {
        throw new Error('Registration failed');
      }

      this.log(`User registered: ${this.testUser.email}`, 'success');
    });
  }

  async testUserLogin() {
    await this.testWithSpinner('User Login', async () => {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: this.testUser.email,
        password: this.testUser.password
      });

      if (!response.data.token) {
        throw new Error('Login failed - no token received');
      }

      this.token = response.data.token;
      this.refreshToken = response.data.refreshToken;

      // Set default auth header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

      this.log('Login successful, tokens received', 'success');
    });
  }

  async testJWTValidation() {
    await this.testWithSpinner('JWT Token Validation', async () => {
      if (!this.token) {
        throw new Error('No token available for validation');
      }

      // Test protected endpoint
      const response = await axios.get(`${BASE_URL}/api/users/me`);
      
      if (!response.data.user) {
        throw new Error('Token validation failed - no user data');
      }

      this.log(`Token validated for user: ${response.data.user.email}`, 'success');
    });
  }

  async testProtectedRoutes() {
    await this.testWithSpinner('Protected API Routes', async () => {
      // Test without token
      const tempToken = axios.defaults.headers.common['Authorization'];
      delete axios.defaults.headers.common['Authorization'];

      try {
        await axios.get(`${BASE_URL}/api/properties`);
        throw new Error('Protected route should have rejected request without token');
      } catch (error) {
        if (error.response?.status !== 401) {
          throw error;
        }
      }

      // Restore token
      axios.defaults.headers.common['Authorization'] = tempToken;

      // Test with token
      const response = await axios.get(`${BASE_URL}/api/properties`);
      this.log('Protected route accessible with valid token', 'success');
    });
  }

  async testSLPService() {
    await this.testWithSpinner('SLP Service Operations', async () => {
      // Create a test project first
      const project = await this.prisma.project.create({
        data: {
          name: `Test Project ${Date.now()}`,
          developmentId: 'dev-001', // Assuming this exists
          type: 'RESIDENTIAL'
        }
      });

      // Test SLP component creation
      const createResponse = await axios.post(`${BASE_URL}/api/slp/${project.id}`, {
        action: 'createComponent',
        data: {
          name: 'Test Component',
          description: 'Test SLP component',
          required: true
        }
      });

      if (!createResponse.data.id) {
        throw new Error('Failed to create SLP component');
      }

      const componentId = createResponse.data.id;
      this.log(`Created SLP component: ${componentId}`, 'success');

      // Test SLP component status update
      const updateResponse = await axios.post(`${BASE_URL}/api/slp/${project.id}`, {
        action: 'updateStatus',
        data: {
          componentId,
          status: 'IN_REVIEW',
          notes: 'Test status update'
        }
      });

      if (updateResponse.data.status !== 'IN_REVIEW') {
        throw new Error('Failed to update SLP component status');
      }

      this.log('SLP component status updated successfully', 'success');

      // Test SLP progress retrieval
      const progressResponse = await axios.get(`${BASE_URL}/api/slp/${project.id}`);
      
      if (!progressResponse.data.progress) {
        throw new Error('Failed to retrieve SLP progress');
      }

      this.log(`SLP progress: ${progressResponse.data.progress.progressPercentage}%`, 'success');

      // Cleanup
      await this.prisma.sLPComponent.deleteMany({
        where: { projectId: project.id }
      });
      await this.prisma.project.delete({
        where: { id: project.id }
      });
    });
  }

  async testTransactionCoordinator() {
    await this.testWithSpinner('Transaction Coordinator', async () => {
      // Create test data
      const development = await this.prisma.development.create({
        data: {
          name: `Test Development ${Date.now()}`,
          location: 'Test Location',
          totalUnits: 10
        }
      });

      const property = await this.prisma.unit.create({
        data: {
          developmentId: development.id,
          name: 'Test Unit',
          type: 'APARTMENT',
          price: 300000,
          status: 'AVAILABLE'
        }
      });

      // Test transaction creation
      const transactionResponse = await axios.post(`${BASE_URL}/api/transactions`, {
        propertyId: property.id,
        buyerId: 'test-buyer-id',
        type: 'SALE'
      });

      if (!transactionResponse.data.id) {
        throw new Error('Failed to create transaction');
      }

      const transactionId = transactionResponse.data.id;
      this.log(`Created transaction: ${transactionId}`, 'success');

      // Test transaction status update
      const statusResponse = await axios.patch(`${BASE_URL}/api/transactions/${transactionId}`, {
        status: 'IN_PROGRESS',
        notes: 'Test status update'
      });

      if (statusResponse.data.status !== 'IN_PROGRESS') {
        throw new Error('Failed to update transaction status');
      }

      this.log('Transaction status updated successfully', 'success');

      // Cleanup
      await this.prisma.transaction.deleteMany({
        where: { id: transactionId }
      });
      await this.prisma.unit.delete({
        where: { id: property.id }
      });
      await this.prisma.development.delete({
        where: { id: development.id }
      });
    });
  }

  async testTokenRefresh() {
    await this.testWithSpinner('Token Refresh', async () => {
      if (!this.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(`${BASE_URL}/api/auth/refresh`, {
        refreshToken: this.refreshToken
      });

      if (!response.data.token) {
        throw new Error('Token refresh failed - no new token received');
      }

      this.token = response.data.token;
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

      this.log('Token refreshed successfully', 'success');
    });
  }

  async cleanup() {
    this.log('Cleaning up test data...', 'info');
    
    try {
      // Delete test user
      await this.prisma.user.deleteMany({
        where: { email: this.testUser.email }
      });
      
      this.log('Cleanup completed', 'success');
    } catch (error) {
      this.log(`Cleanup failed: ${error.message}`, 'warning');
    }
  }

  async run() {
    console.log(chalk.bold('\n🧪 Platform Functionality Test Suite\n'));
    console.log(chalk.gray(`Testing against: ${BASE_URL}\n`));

    try {
      // Database tests
      await this.testDatabaseConnectivity();

      // Authentication tests
      await this.testUserRegistration();
      await this.testUserLogin();
      await this.testJWTValidation();
      await this.testTokenRefresh();

      // API tests
      await this.testProtectedRoutes();

      // Service tests
      await this.testSLPService();
      await this.testTransactionCoordinator();

    } catch (error) {
      this.log(`Critical error: ${error.message}`, 'error');
    } finally {
      await this.cleanup();
      await this.prisma.$disconnect();
    }

    // Print results
    console.log(chalk.bold('\n📊 Test Results\n'));
    
    if (this.results.passed.length > 0) {
      console.log(chalk.green(`✅ Passed: ${this.results.passed.length}`));
      this.results.passed.forEach(test => {
        console.log(chalk.green(`   ✓ ${test}`));
      });
    }

    if (this.results.failed.length > 0) {
      console.log(chalk.red(`\n❌ Failed: ${this.results.failed.length}`));
      this.results.failed.forEach(({ testName, error }) => {
        console.log(chalk.red(`   ✗ ${testName}: ${error}`));
      });
    }

    const total = this.results.passed.length + this.results.failed.length;
    const successRate = (this.results.passed.length / total * 100).toFixed(1);
    
    console.log(chalk.bold(`\n📈 Success Rate: ${successRate}%\n`));

    // Exit with error code if any tests failed
    process.exit(this.results.failed.length > 0 ? 1 : 0);
  }
}

// Run tests
const tester = new PlatformTester();
tester.run().catch(error => {
  console.error(chalk.red(`\n❌ Test suite failed: ${error.message}\n`));
  process.exit(1);
});