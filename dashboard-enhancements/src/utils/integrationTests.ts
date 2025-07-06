/**
 * Integration Test Utilities
 * 
 * Utilities for testing end-to-end functionality of the PROP.ie platform
 * Tests authentication flows, API connections, and portal functionality
 */

import { authRestApiService } from '@/services/authRestApiService';
import { buyerRestApiService } from '@/services/buyerRestApiService';
import { developerRestApiService } from '@/services/developerRestApiService';

// Test result interface
export interface TestResult {
  name: string;
  success: boolean;
  message: string;
  duration: number;
  details?: any;
}

// Test suite interface
export interface TestSuite {
  name: string;
  results: TestResult[];
  totalTests: number;
  passedTests: number;
  failedTests: number;
  duration: number;
}

/**
 * Authentication Flow Integration Tests
 */
export class AuthenticationTests {
  
  async runAllTests(): Promise<TestSuite> {
    const startTime = Date.now();
    const results: TestResult[] = [];

    // Test 1: API Endpoints Accessibility
    results.push(await this.testApiEndpointsAccessible());
    
    // Test 2: Development Login Flow
    results.push(await this.testDevelopmentLogin());
    
    // Test 3: User Profile Retrieval
    results.push(await this.testUserProfileRetrieval());
    
    // Test 4: Token Management
    results.push(await this.testTokenManagement());
    
    // Test 5: Logout Flow
    results.push(await this.testLogoutFlow());

    const duration = Date.now() - startTime;
    const passedTests = results.filter(r => r.success).length;
    const failedTests = results.filter(r => !r.success).length;

    return {
      name: 'Authentication Flow Tests',
      results,
      totalTests: results.length,
      passedTests,
      failedTests,
      duration
    };
  }

  private async testApiEndpointsAccessible(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      // Test if authentication endpoints are reachable
      const endpoints = [
        '/api/auth/login',
        '/api/users/me',
        '/api/users',
        '/api/projects',
        '/api/sales'
      ];

      const testPromises = endpoints.map(async (endpoint) => {
        const response = await fetch(`http://localhost:3000${endpoint}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        return { endpoint, status: response.status, reachable: response.status !== 500 };
      });

      const results = await Promise.all(testPromises);
      const allReachable = results.every(r => r.reachable);

      return {
        name: 'API Endpoints Accessibility',
        success: allReachable,
        message: allReachable ? 'All API endpoints are accessible' : 'Some API endpoints are not accessible',
        duration: Date.now() - startTime,
        details: results
      };
    } catch (error) {
      return {
        name: 'API Endpoints Accessibility',
        success: false,
        message: `Error testing endpoints: ${error}`,
        duration: Date.now() - startTime
      };
    }
  }

  private async testDevelopmentLogin(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      // Test development login with mock credentials
      const { isSignedIn } = await authRestApiService.signIn({
        username: 'developer@example.com',
        password: 'test123'
      });

      return {
        name: 'Development Login Flow',
        success: isSignedIn,
        message: isSignedIn ? 'Development login successful' : 'Development login failed',
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        name: 'Development Login Flow',
        success: false,
        message: `Login error: ${error}`,
        duration: Date.now() - startTime
      };
    }
  }

  private async testUserProfileRetrieval(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      // Test getting current user profile
      const { userId } = await authRestApiService.getCurrentUser();
      const attributes = await authRestApiService.fetchUserAttributes();

      const hasRequiredFields = !!(userId && attributes.email && attributes.name);

      return {
        name: 'User Profile Retrieval',
        success: hasRequiredFields,
        message: hasRequiredFields ? 'User profile retrieved successfully' : 'Missing required profile fields',
        duration: Date.now() - startTime,
        details: { userId, attributes }
      };
    } catch (error) {
      return {
        name: 'User Profile Retrieval',
        success: false,
        message: `Profile retrieval error: ${error}`,
        duration: Date.now() - startTime
      };
    }
  }

  private async testTokenManagement(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      // Test token storage and retrieval
      const token = authRestApiService.getToken();
      const isAuthenticated = authRestApiService.isAuthenticated();

      return {
        name: 'Token Management',
        success: !!(token && isAuthenticated),
        message: (token && isAuthenticated) ? 'Token management working correctly' : 'Token management issues detected',
        duration: Date.now() - startTime,
        details: { hasToken: !!token, isAuthenticated }
      };
    } catch (error) {
      return {
        name: 'Token Management',
        success: false,
        message: `Token management error: ${error}`,
        duration: Date.now() - startTime
      };
    }
  }

  private async testLogoutFlow(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      // Test logout functionality
      await authRestApiService.signOut();
      const isStillAuthenticated = authRestApiService.isAuthenticated();

      return {
        name: 'Logout Flow',
        success: !isStillAuthenticated,
        message: !isStillAuthenticated ? 'Logout successful' : 'Logout failed - user still authenticated',
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        name: 'Logout Flow',
        success: false,
        message: `Logout error: ${error}`,
        duration: Date.now() - startTime
      };
    }
  }
}

/**
 * Buyer Portal Integration Tests
 */
export class BuyerPortalTests {
  
  async runAllTests(): Promise<TestSuite> {
    const startTime = Date.now();
    const results: TestResult[] = [];

    // Setup: Login as buyer
    await this.setupBuyerAuth();

    // Test buyer API operations
    results.push(await this.testBuyerProfileAccess());
    results.push(await this.testBuyerReservations());
    results.push(await this.testBuyerMortgageTracking());
    results.push(await this.testBuyerHomePackItems());

    const duration = Date.now() - startTime;
    const passedTests = results.filter(r => r.success).length;
    const failedTests = results.filter(r => !r.success).length;

    return {
      name: 'Buyer Portal Tests',
      results,
      totalTests: results.length,
      passedTests,
      failedTests,
      duration
    };
  }

  private async setupBuyerAuth(): Promise<void> {
    try {
      await authRestApiService.signIn({
        username: 'buyer@example.com',
        password: 'test123'
      });
    } catch (error) {
      console.warn('Buyer auth setup failed:', error);
    }
  }

  private async testBuyerProfileAccess(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      const profile = await buyerRestApiService.getMyBuyerProfile();
      
      return {
        name: 'Buyer Profile Access',
        success: !!(profile && profile.id && profile.email),
        message: profile ? 'Buyer profile accessible' : 'Buyer profile not accessible',
        duration: Date.now() - startTime,
        details: profile
      };
    } catch (error) {
      return {
        name: 'Buyer Profile Access',
        success: false,
        message: `Profile access error: ${error}`,
        duration: Date.now() - startTime
      };
    }
  }

  private async testBuyerReservations(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      const reservations = await buyerRestApiService.getMyReservations();
      
      return {
        name: 'Buyer Reservations',
        success: Array.isArray(reservations),
        message: Array.isArray(reservations) ? `Retrieved ${reservations.length} reservations` : 'Reservations not accessible',
        duration: Date.now() - startTime,
        details: { count: reservations?.length || 0 }
      };
    } catch (error) {
      return {
        name: 'Buyer Reservations',
        success: false,
        message: `Reservations error: ${error}`,
        duration: Date.now() - startTime
      };
    }
  }

  private async testBuyerMortgageTracking(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      const mortgageTracking = await buyerRestApiService.getMyMortgageTracking();
      
      return {
        name: 'Buyer Mortgage Tracking',
        success: !!mortgageTracking,
        message: mortgageTracking ? 'Mortgage tracking accessible' : 'Mortgage tracking not accessible',
        duration: Date.now() - startTime,
        details: mortgageTracking
      };
    } catch (error) {
      return {
        name: 'Buyer Mortgage Tracking',
        success: false,
        message: `Mortgage tracking error: ${error}`,
        duration: Date.now() - startTime
      };
    }
  }

  private async testBuyerHomePackItems(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      const homePackItems = await buyerRestApiService.getHomePackItems('test-property-id');
      
      return {
        name: 'Buyer Home Pack Items',
        success: Array.isArray(homePackItems),
        message: Array.isArray(homePackItems) ? `Retrieved ${homePackItems.length} home pack items` : 'Home pack items not accessible',
        duration: Date.now() - startTime,
        details: { count: homePackItems?.length || 0 }
      };
    } catch (error) {
      return {
        name: 'Buyer Home Pack Items',
        success: false,
        message: `Home pack items error: ${error}`,
        duration: Date.now() - startTime
      };
    }
  }
}

/**
 * Developer Portal Integration Tests
 */
export class DeveloperPortalTests {
  
  async runAllTests(): Promise<TestSuite> {
    const startTime = Date.now();
    const results: TestResult[] = [];

    // Setup: Login as developer
    await this.setupDeveloperAuth();

    // Test developer API operations
    results.push(await this.testDeveloperDashboard());
    results.push(await this.testDeveloperProjects());
    results.push(await this.testDeveloperSalesData());
    results.push(await this.testDeveloperFinancialData());

    const duration = Date.now() - startTime;
    const passedTests = results.filter(r => r.success).length;
    const failedTests = results.filter(r => !r.success).length;

    return {
      name: 'Developer Portal Tests',
      results,
      totalTests: results.length,
      passedTests,
      failedTests,
      duration
    };
  }

  private async setupDeveloperAuth(): Promise<void> {
    try {
      await authRestApiService.signIn({
        username: 'developer@example.com',
        password: 'test123'
      });
    } catch (error) {
      console.warn('Developer auth setup failed:', error);
    }
  }

  private async testDeveloperDashboard(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      const dashboardData = await developerRestApiService.getDeveloperDashboard();
      
      return {
        name: 'Developer Dashboard',
        success: !!(dashboardData && dashboardData.stats && dashboardData.recentProjects),
        message: dashboardData ? 'Developer dashboard accessible' : 'Developer dashboard not accessible',
        duration: Date.now() - startTime,
        details: dashboardData?.stats
      };
    } catch (error) {
      return {
        name: 'Developer Dashboard',
        success: false,
        message: `Dashboard error: ${error}`,
        duration: Date.now() - startTime
      };
    }
  }

  private async testDeveloperProjects(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      const projects = await developerRestApiService.getProjects();
      
      return {
        name: 'Developer Projects',
        success: Array.isArray(projects),
        message: Array.isArray(projects) ? `Retrieved ${projects.length} projects` : 'Projects not accessible',
        duration: Date.now() - startTime,
        details: { count: projects?.length || 0 }
      };
    } catch (error) {
      return {
        name: 'Developer Projects',
        success: false,
        message: `Projects error: ${error}`,
        duration: Date.now() - startTime
      };
    }
  }

  private async testDeveloperSalesData(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      const salesData = await developerRestApiService.getSalesData();
      
      return {
        name: 'Developer Sales Data',
        success: Array.isArray(salesData),
        message: Array.isArray(salesData) ? `Retrieved ${salesData.length} sales records` : 'Sales data not accessible',
        duration: Date.now() - startTime,
        details: { count: salesData?.length || 0 }
      };
    } catch (error) {
      return {
        name: 'Developer Sales Data',
        success: false,
        message: `Sales data error: ${error}`,
        duration: Date.now() - startTime
      };
    }
  }

  private async testDeveloperFinancialData(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      const financialData = await developerRestApiService.getFinancialData();
      
      return {
        name: 'Developer Financial Data',
        success: !!(financialData && typeof financialData.totalRevenue === 'number'),
        message: financialData ? 'Financial data accessible' : 'Financial data not accessible',
        duration: Date.now() - startTime,
        details: financialData
      };
    } catch (error) {
      return {
        name: 'Developer Financial Data',
        success: false,
        message: `Financial data error: ${error}`,
        duration: Date.now() - startTime
      };
    }
  }
}

/**
 * Master Integration Test Runner
 */
export class IntegrationTestRunner {
  
  async runAllTests(): Promise<{
    authTests: TestSuite;
    buyerTests: TestSuite;
    developerTests: TestSuite;
    summary: {
      totalSuites: number;
      totalTests: number;
      totalPassed: number;
      totalFailed: number;
      totalDuration: number;
      overallSuccess: boolean;
    };
  }> {
    const startTime = Date.now();
    
    console.log('🚀 Starting PROP.ie Platform Integration Tests...');
    
    // Run all test suites
    const authTests = await new AuthenticationTests().runAllTests();
    console.log(`✅ Authentication Tests: ${authTests.passedTests}/${authTests.totalTests} passed`);
    
    const buyerTests = await new BuyerPortalTests().runAllTests();
    console.log(`✅ Buyer Portal Tests: ${buyerTests.passedTests}/${buyerTests.totalTests} passed`);
    
    const developerTests = await new DeveloperPortalTests().runAllTests();
    console.log(`✅ Developer Portal Tests: ${developerTests.passedTests}/${developerTests.totalTests} passed`);
    
    const totalDuration = Date.now() - startTime;
    const totalTests = authTests.totalTests + buyerTests.totalTests + developerTests.totalTests;
    const totalPassed = authTests.passedTests + buyerTests.passedTests + developerTests.passedTests;
    const totalFailed = authTests.failedTests + buyerTests.failedTests + developerTests.failedTests;
    const overallSuccess = totalFailed === 0;
    
    const summary = {
      totalSuites: 3,
      totalTests,
      totalPassed,
      totalFailed,
      totalDuration,
      overallSuccess
    };
    
    console.log(`🎯 Integration Tests Complete: ${totalPassed}/${totalTests} tests passed in ${totalDuration}ms`);
    
    return {
      authTests,
      buyerTests,
      developerTests,
      summary
    };
  }
}

// Export utilities for use in browser console or development
export const runIntegrationTests = () => new IntegrationTestRunner().runAllTests();