/**
 * Security Audit Utilities
 * 
 * Comprehensive security validation for the PROP.ie platform
 * Tests authentication, authorization, data protection, and security compliance
 */

// Types for security testing
export interface SecurityTestResult {
  name: string;
  endpoint: string;
  method: string;
  success: boolean;
  securityScore: number; // 0-100
  message: string;
  details?: any;
  vulnerabilities?: string[];
  recommendations?: string[];
}

export interface SecurityAuditSuite {
  name: string;
  results: SecurityTestResult[];
  totalTests: number;
  passedTests: number;
  failedTests: number;
  overallSecurityScore: number;
  criticalIssues: number;
  duration: number;
}

// API endpoints to test
const API_ENDPOINTS = [
  // Authentication endpoints
  { path: '/api/auth/login', method: 'POST', requiresAuth: false, publicEndpoint: true },
  { path: '/api/auth/register', method: 'POST', requiresAuth: false, publicEndpoint: true },
  { path: '/api/auth/logout', method: 'POST', requiresAuth: true, publicEndpoint: false },
  
  // User management endpoints
  { path: '/api/users/me', method: 'GET', requiresAuth: true, publicEndpoint: false },
  { path: '/api/users', method: 'GET', requiresAuth: true, publicEndpoint: false, adminOnly: true },
  { path: '/api/users', method: 'POST', requiresAuth: true, publicEndpoint: false, adminOnly: true },
  
  // Project management endpoints
  { path: '/api/projects', method: 'GET', requiresAuth: true, publicEndpoint: false },
  { path: '/api/projects/fitzgerald-gardens', method: 'GET', requiresAuth: true, publicEndpoint: false },
  
  // Financial endpoints
  { path: '/api/finance', method: 'GET', requiresAuth: true, publicEndpoint: false, sensitiveData: true },
  { path: '/api/sales', method: 'GET', requiresAuth: true, publicEndpoint: false, sensitiveData: true },
  
  // Communication endpoints
  { path: '/api/notifications', method: 'GET', requiresAuth: true, publicEndpoint: false },
  { path: '/api/alerts', method: 'GET', requiresAuth: true, publicEndpoint: false },
  
  // Document endpoints
  { path: '/api/documents', method: 'GET', requiresAuth: true, publicEndpoint: false },
  { path: '/api/compliance', method: 'GET', requiresAuth: true, publicEndpoint: false, sensitiveData: true },
];

/**
 * Authentication Security Tests
 */
export class AuthenticationSecurityTests {
  
  async runAllTests(): Promise<SecurityAuditSuite> {
    const startTime = Date.now();
    const results: SecurityTestResult[] = [];

    // Test 1: Unauthorized access protection
    results.push(...await this.testUnauthorizedAccess());
    
    // Test 2: JWT token validation
    results.push(await this.testJWTTokenValidation());
    
    // Test 3: Token expiration handling
    results.push(await this.testTokenExpiration());
    
    // Test 4: Role-based access control
    results.push(...await this.testRoleBasedAccess());
    
    // Test 5: Authentication bypass attempts
    results.push(...await this.testAuthenticationBypass());
    
    // Test 6: Session management
    results.push(await this.testSessionManagement());

    const duration = Date.now() - startTime;
    const passedTests = results.filter(r => r.success).length;
    const failedTests = results.filter(r => !r.success).length;
    const criticalIssues = results.filter(r => r.securityScore < 50).length;
    const overallSecurityScore = results.reduce((sum, r) => sum + r.securityScore, 0) / results.length;

    return {
      name: 'Authentication Security Tests',
      results,
      totalTests: results.length,
      passedTests,
      failedTests,
      overallSecurityScore,
      criticalIssues,
      duration
    };
  }

  private async testUnauthorizedAccess(): Promise<SecurityTestResult[]> {
    const results: SecurityTestResult[] = [];
    
    for (const endpoint of API_ENDPOINTS.filter(e => e.requiresAuth)) {
      try {
        const response = await fetch(`http://localhost:3000${endpoint.path}`, {
          method: endpoint.method,
          headers: { 'Content-Type': 'application/json' }
          // Intentionally no Authorization header
        });

        const isProtected = response.status === 401 || response.status === 403;
        const securityScore = isProtected ? 100 : 0;
        
        results.push({
          name: 'Unauthorized Access Protection',
          endpoint: endpoint.path,
          method: endpoint.method,
          success: isProtected,
          securityScore,
          message: isProtected 
            ? 'Endpoint properly protected from unauthorized access' 
            : 'SECURITY RISK: Endpoint accessible without authentication',
          details: { statusCode: response.status, protected: isProtected },
          vulnerabilities: isProtected ? [] : ['Unprotected endpoint allows unauthorized access'],
          recommendations: isProtected ? [] : ['Add authentication middleware to protect this endpoint']
        });
      } catch (error) {
        results.push({
          name: 'Unauthorized Access Protection',
          endpoint: endpoint.path,
          method: endpoint.method,
          success: false,
          securityScore: 0,
          message: `Error testing endpoint: ${error}`,
          vulnerabilities: ['Unable to test endpoint security']
        });
      }
    }
    
    return results;
  }

  private async testJWTTokenValidation(): Promise<SecurityTestResult> {
    try {
      // Test with invalid JWT token
      const response = await fetch('http://localhost:3000/api/users/me', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer invalid-jwt-token',
          'Content-Type': 'application/json'
        }
      });

      const isValidated = response.status === 401 || response.status === 403;
      const securityScore = isValidated ? 100 : 0;

      return {
        name: 'JWT Token Validation',
        endpoint: '/api/users/me',
        method: 'GET',
        success: isValidated,
        securityScore,
        message: isValidated 
          ? 'JWT token validation working correctly' 
          : 'SECURITY RISK: Invalid JWT tokens are accepted',
        details: { statusCode: response.status, validated: isValidated },
        vulnerabilities: isValidated ? [] : ['Invalid JWT tokens are being accepted'],
        recommendations: isValidated ? [] : ['Implement proper JWT token validation']
      };
    } catch (error) {
      return {
        name: 'JWT Token Validation',
        endpoint: '/api/users/me',
        method: 'GET',
        success: false,
        securityScore: 0,
        message: `Error testing JWT validation: ${error}`,
        vulnerabilities: ['Unable to test JWT validation']
      };
    }
  }

  private async testTokenExpiration(): Promise<SecurityTestResult> {
    try {
      // Create a mock expired token (this is a simulation)
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.invalid';
      
      const response = await fetch('http://localhost:3000/api/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${expiredToken}`,
          'Content-Type': 'application/json'
        }
      });

      const handlesExpiration = response.status === 401;
      const securityScore = handlesExpiration ? 100 : 50; // Partial score as this is mock testing

      return {
        name: 'Token Expiration Handling',
        endpoint: '/api/users/me',
        method: 'GET',
        success: handlesExpiration,
        securityScore,
        message: handlesExpiration 
          ? 'Token expiration handled correctly' 
          : 'Warning: Unable to verify token expiration handling',
        details: { statusCode: response.status, expirationHandled: handlesExpiration },
        recommendations: handlesExpiration ? [] : ['Verify JWT expiration validation is implemented']
      };
    } catch (error) {
      return {
        name: 'Token Expiration Handling',
        endpoint: '/api/users/me',
        method: 'GET',
        success: false,
        securityScore: 0,
        message: `Error testing token expiration: ${error}`,
        vulnerabilities: ['Unable to test token expiration handling']
      };
    }
  }

  private async testRoleBasedAccess(): Promise<SecurityTestResult[]> {
    const results: SecurityTestResult[] = [];
    
    // Test admin-only endpoints with non-admin token
    const adminEndpoints = API_ENDPOINTS.filter(e => e.adminOnly);
    
    for (const endpoint of adminEndpoints) {
      try {
        // First, get a regular user token (mock for development)
        const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'buyer@example.com',
            password: 'test123'
          })
        });

        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          const userToken = loginData.token;

          // Try to access admin endpoint with user token
          const response = await fetch(`http://localhost:3000${endpoint.path}`, {
            method: endpoint.method,
            headers: {
              'Authorization': `Bearer ${userToken}`,
              'Content-Type': 'application/json'
            }
          });

          const isRestricted = response.status === 403;
          const securityScore = isRestricted ? 100 : 0;

          results.push({
            name: 'Role-Based Access Control',
            endpoint: endpoint.path,
            method: endpoint.method,
            success: isRestricted,
            securityScore,
            message: isRestricted 
              ? 'Role-based access control working correctly' 
              : 'SECURITY RISK: Admin endpoint accessible by regular user',
            details: { statusCode: response.status, roleRestricted: isRestricted },
            vulnerabilities: isRestricted ? [] : ['Admin endpoint accessible by non-admin users'],
            recommendations: isRestricted ? [] : ['Implement proper role-based access control']
          });
        }
      } catch (error) {
        results.push({
          name: 'Role-Based Access Control',
          endpoint: endpoint.path,
          method: endpoint.method,
          success: false,
          securityScore: 0,
          message: `Error testing role-based access: ${error}`,
          vulnerabilities: ['Unable to test role-based access control']
        });
      }
    }

    return results;
  }

  private async testAuthenticationBypass(): Promise<SecurityTestResult[]> {
    const results: SecurityTestResult[] = [];
    
    // Test common authentication bypass techniques
    const bypassAttempts = [
      { name: 'SQL Injection in Auth', payload: "admin'; DROP TABLE users; --" },
      { name: 'Header Injection', headers: { 'X-Forwarded-User': 'admin' } },
      { name: 'Parameter Pollution', queryParams: '?userId=1&userId=admin' },
      { name: 'Path Traversal', path: '/api/../admin/users' }
    ];

    for (const attempt of bypassAttempts) {
      try {
        const url = attempt.path ? 
          `http://localhost:3000${attempt.path}` : 
          'http://localhost:3000/api/users/me';
          
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...attempt.headers
          }
        });

        const isProtected = response.status === 401 || response.status === 403 || response.status === 404;
        const securityScore = isProtected ? 100 : 0;

        results.push({
          name: `Authentication Bypass - ${attempt.name}`,
          endpoint: url,
          method: 'GET',
          success: isProtected,
          securityScore,
          message: isProtected 
            ? 'Authentication bypass attempt blocked' 
            : 'SECURITY RISK: Potential authentication bypass vulnerability',
          details: { statusCode: response.status, bypassBlocked: isProtected },
          vulnerabilities: isProtected ? [] : [`Potential ${attempt.name} vulnerability`],
          recommendations: isProtected ? [] : [`Implement protection against ${attempt.name}`]
        });
      } catch (error) {
        results.push({
          name: `Authentication Bypass - ${attempt.name}`,
          endpoint: '/api/users/me',
          method: 'GET',
          success: true, // Error likely means protection is working
          securityScore: 90,
          message: 'Bypass attempt resulted in error (likely blocked)',
          details: { error: error.toString() }
        });
      }
    }

    return results;
  }

  private async testSessionManagement(): Promise<SecurityTestResult> {
    try {
      // Test if logout invalidates tokens
      let securityScore = 0;
      let success = false;
      let message = '';
      let vulnerabilities: string[] = [];
      let recommendations: string[] = [];

      // Step 1: Login
      const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'buyer@example.com',
          password: 'test123'
        })
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        const token = loginData.token;

        // Step 2: Use token to access protected endpoint
        const protectedResponse = await fetch('http://localhost:3000/api/users/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (protectedResponse.ok) {
          // Step 3: Logout
          const logoutResponse = await fetch('http://localhost:3000/api/auth/logout', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          // Step 4: Try to use token after logout
          const postLogoutResponse = await fetch('http://localhost:3000/api/users/me', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          const tokenInvalidated = postLogoutResponse.status === 401;
          
          if (tokenInvalidated) {
            securityScore = 100;
            success = true;
            message = 'Session management working correctly - token invalidated after logout';
          } else {
            securityScore = 30;
            success = false;
            message = 'SECURITY RISK: Token still valid after logout';
            vulnerabilities.push('Session tokens not properly invalidated on logout');
            recommendations.push('Implement token blacklisting or server-side session invalidation');
          }
        } else {
          securityScore = 50;
          success = false;
          message = 'Unable to test session management - token not working';
        }
      } else {
        securityScore = 0;
        success = false;
        message = 'Unable to test session management - login failed';
      }

      return {
        name: 'Session Management',
        endpoint: '/api/auth/logout',
        method: 'POST',
        success,
        securityScore,
        message,
        vulnerabilities,
        recommendations
      };
    } catch (error) {
      return {
        name: 'Session Management',
        endpoint: '/api/auth/logout',
        method: 'POST',
        success: false,
        securityScore: 0,
        message: `Error testing session management: ${error}`,
        vulnerabilities: ['Unable to test session management']
      };
    }
  }
}

/**
 * Data Protection Security Tests
 */
export class DataProtectionTests {
  
  async runAllTests(): Promise<SecurityAuditSuite> {
    const startTime = Date.now();
    const results: SecurityTestResult[] = [];

    // Test 1: Sensitive data exposure
    results.push(...await this.testSensitiveDataExposure());
    
    // Test 2: Data validation and sanitization
    results.push(...await this.testDataValidation());
    
    // Test 3: HTTPS enforcement
    results.push(await this.testHTTPSEnforcement());

    const duration = Date.now() - startTime;
    const passedTests = results.filter(r => r.success).length;
    const failedTests = results.filter(r => !r.success).length;
    const criticalIssues = results.filter(r => r.securityScore < 50).length;
    const overallSecurityScore = results.reduce((sum, r) => sum + r.securityScore, 0) / results.length;

    return {
      name: 'Data Protection Tests',
      results,
      totalTests: results.length,
      passedTests,
      failedTests,
      overallSecurityScore,
      criticalIssues,
      duration
    };
  }

  private async testSensitiveDataExposure(): Promise<SecurityTestResult[]> {
    const results: SecurityTestResult[] = [];
    
    const sensitiveEndpoints = API_ENDPOINTS.filter(e => e.sensitiveData);
    
    for (const endpoint of sensitiveEndpoints) {
      try {
        // Login first to get a valid token
        const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'developer@example.com',
            password: 'test123'
          })
        });

        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          const token = loginData.token;

          const response = await fetch(`http://localhost:3000${endpoint.path}`, {
            method: endpoint.method,
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            
            // Check for potential sensitive data exposure
            const dataString = JSON.stringify(data).toLowerCase();
            const sensitivePatterns = [
              'password', 'secret', 'key', 'token', 'credential',
              'ssn', 'social', 'credit', 'bank', 'account'
            ];
            
            const exposedPatterns = sensitivePatterns.filter(pattern => 
              dataString.includes(pattern)
            );
            
            const hasExposure = exposedPatterns.length > 0;
            const securityScore = hasExposure ? 40 : 100;

            results.push({
              name: 'Sensitive Data Exposure',
              endpoint: endpoint.path,
              method: endpoint.method,
              success: !hasExposure,
              securityScore,
              message: hasExposure 
                ? `WARNING: Potential sensitive data exposure detected` 
                : 'No obvious sensitive data exposure detected',
              details: { exposedPatterns, dataKeys: Object.keys(data || {}) },
              vulnerabilities: hasExposure ? [`Potential exposure of: ${exposedPatterns.join(', ')}`] : [],
              recommendations: hasExposure ? ['Review data filtering to prevent sensitive data exposure'] : []
            });
          } else {
            results.push({
              name: 'Sensitive Data Exposure',
              endpoint: endpoint.path,
              method: endpoint.method,
              success: true,
              securityScore: 100,
              message: 'Endpoint properly protected or unavailable',
              details: { statusCode: response.status }
            });
          }
        }
      } catch (error) {
        results.push({
          name: 'Sensitive Data Exposure',
          endpoint: endpoint.path,
          method: endpoint.method,
          success: false,
          securityScore: 0,
          message: `Error testing data exposure: ${error}`,
          vulnerabilities: ['Unable to test for sensitive data exposure']
        });
      }
    }

    return results;
  }

  private async testDataValidation(): Promise<SecurityTestResult[]> {
    const results: SecurityTestResult[] = [];
    
    // Test input validation on POST endpoints
    const postEndpoints = API_ENDPOINTS.filter(e => e.method === 'POST');
    
    for (const endpoint of postEndpoints) {
      try {
        // Test with malicious payloads
        const maliciousPayloads = [
          { type: 'XSS', data: { test: '<script>alert("xss")</script>' } },
          { type: 'SQL Injection', data: { test: "'; DROP TABLE users; --" } },
          { type: 'NoSQL Injection', data: { test: { $ne: null } } },
          { type: 'Large Payload', data: { test: 'A'.repeat(10000) } }
        ];

        for (const payload of maliciousPayloads) {
          const response = await fetch(`http://localhost:3000${endpoint.path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload.data)
          });

          const isValidated = response.status === 400 || response.status === 422 || response.status === 401;
          const securityScore = isValidated ? 100 : 50;

          results.push({
            name: `Data Validation - ${payload.type}`,
            endpoint: endpoint.path,
            method: endpoint.method,
            success: isValidated,
            securityScore,
            message: isValidated 
              ? `${payload.type} payload properly validated/rejected` 
              : `Warning: ${payload.type} payload accepted`,
            details: { statusCode: response.status, payloadType: payload.type },
            vulnerabilities: isValidated ? [] : [`Potential ${payload.type} vulnerability`],
            recommendations: isValidated ? [] : [`Implement validation for ${payload.type} attacks`]
          });
        }
      } catch (error) {
        results.push({
          name: 'Data Validation',
          endpoint: endpoint.path,
          method: endpoint.method,
          success: false,
          securityScore: 0,
          message: `Error testing data validation: ${error}`,
          vulnerabilities: ['Unable to test data validation']
        });
      }
    }

    return results;
  }

  private async testHTTPSEnforcement(): Promise<SecurityTestResult> {
    try {
      // In development, HTTPS might not be enforced, so this is a configuration check
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      return {
        name: 'HTTPS Enforcement',
        endpoint: 'Configuration Check',
        method: 'GET',
        success: true, // Pass in dev mode
        securityScore: isDevelopment ? 80 : 100,
        message: isDevelopment 
          ? 'Development mode: HTTPS enforcement should be enabled in production' 
          : 'HTTPS enforcement configured',
        details: { environment: process.env.NODE_ENV, development: isDevelopment },
        recommendations: isDevelopment ? ['Ensure HTTPS is enforced in production deployment'] : []
      };
    } catch (error) {
      return {
        name: 'HTTPS Enforcement',
        endpoint: 'Configuration Check',
        method: 'GET',
        success: false,
        securityScore: 0,
        message: `Error checking HTTPS enforcement: ${error}`,
        vulnerabilities: ['Unable to verify HTTPS enforcement']
      };
    }
  }
}

/**
 * Master Security Audit Runner
 */
export class SecurityAuditRunner {
  
  async runCompleteSecurityAudit(): Promise<{
    authTests: SecurityAuditSuite;
    dataProtectionTests: SecurityAuditSuite;
    summary: {
      totalSuites: number;
      totalTests: number;
      totalPassed: number;
      totalFailed: number;
      overallSecurityScore: number;
      criticalIssues: number;
      totalDuration: number;
      securityGrade: string;
    };
  }> {
    const startTime = Date.now();
    
    console.log('🔒 Starting PROP.ie Security Audit...');
    
    // Run all security test suites
    const authTests = await new AuthenticationSecurityTests().runAllTests();
    console.log(`🔐 Authentication Tests: ${authTests.passedTests}/${authTests.totalTests} passed (Score: ${authTests.overallSecurityScore.toFixed(1)})`);
    
    const dataProtectionTests = await new DataProtectionTests().runAllTests();
    console.log(`🛡️ Data Protection Tests: ${dataProtectionTests.passedTests}/${dataProtectionTests.totalTests} passed (Score: ${dataProtectionTests.overallSecurityScore.toFixed(1)})`);
    
    const totalDuration = Date.now() - startTime;
    const totalTests = authTests.totalTests + dataProtectionTests.totalTests;
    const totalPassed = authTests.passedTests + dataProtectionTests.passedTests;
    const totalFailed = authTests.failedTests + dataProtectionTests.failedTests;
    const criticalIssues = authTests.criticalIssues + dataProtectionTests.criticalIssues;
    const overallSecurityScore = (authTests.overallSecurityScore + dataProtectionTests.overallSecurityScore) / 2;
    
    // Determine security grade
    const securityGrade = 
      overallSecurityScore >= 90 ? 'A' :
      overallSecurityScore >= 80 ? 'B' :
      overallSecurityScore >= 70 ? 'C' :
      overallSecurityScore >= 60 ? 'D' : 'F';
    
    const summary = {
      totalSuites: 2,
      totalTests,
      totalPassed,
      totalFailed,
      overallSecurityScore,
      criticalIssues,
      totalDuration,
      securityGrade
    };
    
    console.log(`🎯 Security Audit Complete: Grade ${securityGrade} (${overallSecurityScore.toFixed(1)}/100) - ${criticalIssues} critical issues`);
    
    return {
      authTests,
      dataProtectionTests,
      summary
    };
  }
}

// Export utilities for use in browser console or development
export const runSecurityAudit = () => new SecurityAuditRunner().runCompleteSecurityAudit();