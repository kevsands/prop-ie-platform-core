'use client';

/**
 * Security Test Scenarios - Simplified Version for Build Testing
 * 
 * This is a mock implementation that provides test scenarios
 * for build testing purposes.
 */

export interface TestScenario {
  name: string;
  description: string;
  steps: string[];
  expectedOutcomes?: string[];
  priority: 'high' | 'medium' | 'low';
}

export const securityTestScenarios: TestScenario[] = [
  {
    name: 'Authentication Flow',
    description: 'Tests the authentication process including login and MFA',
    priority: 'high',
    steps: [
      'Initialize authentication',
      'Verify credentials',
      'Generate token',
      'Return user session'
    ],
    expectedOutcomes: [
      'User can successfully login',
      'Authentication token is generated correctly',
      'User session is established'
    ]
  },
  {
    name: 'Authorization Checks',
    description: 'Tests role-based access control and permission checks',
    priority: 'high',
    steps: [
      'Check user role',
      'Verify permissions',
      'Access protected resource'
    ],
    expectedOutcomes: [
      'User permissions are correctly verified',
      'Access is granted only to authorized resources',
      'Unauthorized access attempts are blocked'
    ]
  },
  {
    name: 'MFA Verification',
    description: 'Tests multi-factor authentication functionality',
    priority: 'high',
    steps: [
      'Request MFA code',
      'Validate MFA code',
      'Enhance security level'
    ],
    expectedOutcomes: [
      'MFA code is requested correctly',
      'MFA code validation works properly',
      'Security level is enhanced after successful MFA'
    ]
  }
];

export default securityTestScenarios;