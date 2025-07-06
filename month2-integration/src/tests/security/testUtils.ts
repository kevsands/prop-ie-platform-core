'use client';

/**
 * Security Test Utilities - Simplified Version for Build Testing
 * 
 * This is a mock implementation that provides test utilities
 * for build testing purposes.
 */

// Mock test user credentials
export const testUser = {
  username: 'test-security-user',
  password: 'Test@Password123!',
  email: 'test-security@example.com'
};

// Mock function to set up a test user
export async function setupTestUser() {
  return {
    id: 'test-user-id',
    username: testUser.username,
    email: testUser.email
  };
}

// Mock function to enable all security features
export async function enableAllSecurityFeatures() {
  console.log('All security features enabled (mock)');
  return true;
}

// Mock function to reset security state
export async function resetSecurityState() {
  console.log('Security state reset (mock)');
  return true;
}

// Mock function to simulate a security event
export async function simulateSecurityEvent(
  eventType: string, 
  details: Record<string, any> = {}
) {
  console.log(`Security event simulated: ${eventType}`, details);
  return {
    id: 'mock-event-id',
    type: eventType,
    timestamp: new Date().toISOString(),
    data: details
  };
}

// Mock function to simulate a location change
export function simulateLocationChange(country: string, city: string) {
  return {
    country,
    city,
    ip: '192.168.1.1',
    latitude: 0,
    longitude: 0
  };
}

// Mock function to simulate a device change
export function simulateDeviceChange(deviceType: 'desktop' | 'mobile' | 'tablet') {
  const userAgents = {
    desktop: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    mobile: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    tablet: 'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  };
  
  return {
    userAgent: userAgents[deviceType],
    type: deviceType
  };
}

// Mock function to get recent security events
export function getRecentSecurityEvents(count = 5) {
  const mockEvents = [
    {
      id: '1',
      timestamp: Date.now() - 5 * 60 * 1000,
      category: 'AUTHENTICATION',
      action: 'login',
      severity: 'INFO',
      description: 'User logged in successfully',
      status: 'success'
    },
    {
      id: '2',
      timestamp: Date.now() - 15 * 60 * 1000,
      category: 'AUTHENTICATION',
      action: 'mfa_verification',
      severity: 'INFO',
      description: 'MFA verification successful',
      status: 'success'
    },
    {
      id: '3',
      timestamp: Date.now() - 25 * 60 * 1000,
      category: 'SECURITY',
      action: 'device_trusted',
      severity: 'INFO',
      description: 'Device added to trusted devices',
      status: 'success'
    }
  ];
  
  return mockEvents.slice(0, count);
}

export default {
  testUser,
  setupTestUser,
  enableAllSecurityFeatures,
  resetSecurityState,
  simulateSecurityEvent,
  simulateLocationChange,
  simulateDeviceChange,
  getRecentSecurityEvents
};