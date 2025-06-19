import { NextRequest, NextResponse } from 'next/server';

interface IntegrationTestResult {
  endpoint: string;
  name: string;
  status: 'pass' | 'fail' | 'warning';
  responseTime: number;
  data?: any;
  error?: string;
  dependencies?: string[];
}

interface SystemHealthReport {
  timestamp: Date;
  overallStatus: 'healthy' | 'degraded' | 'critical';
  totalTests: number;
  passed: number;
  failed: number;
  warnings: number;
  tests: IntegrationTestResult[];
  integrationMatrix: {
    buyerToHTB: boolean;
    buyerToNotifications: boolean;
    buyerToProperties: boolean;
    developerToHTB: boolean;
    developerToNotifications: boolean;
    developerToProperties: boolean;
    htbToNotifications: boolean;
    propertiesRealTime: boolean;
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const detailed = searchParams.get('detailed') === 'true';
    const testEndpoints = searchParams.get('endpoints')?.split(',') || [];
    
    const results: IntegrationTestResult[] = [];
    const startTime = Date.now();

    // Test 1: HTB Status API
    await testEndpoint({
      endpoint: '/api/htb/status/buyer-001',
      name: 'HTB Status API',
      dependencies: ['Database', 'ROS.ie Integration'],
      expectedFields: ['userId', 'status', 'timeline', 'requirements']
    }, results);

    // Test 2: Notifications API
    await testEndpoint({
      endpoint: '/api/notifications/user/buyer-001',
      name: 'Buyer Notifications API',
      dependencies: ['Database', 'HTB API'],
      expectedFields: ['notifications', 'length']
    }, results);

    // Test 3: Developer Notifications API
    await testEndpoint({
      endpoint: '/api/developer/notifications?developerId=developer-001',
      name: 'Developer Notifications API',
      dependencies: ['Database', 'Buyer APIs'],
      expectedFields: ['notifications', 'stats']
    }, results);

    // Test 4: Property Availability API
    await testEndpoint({
      endpoint: '/api/properties/availability?includeUpdates=true&includeStats=true',
      name: 'Property Availability API',
      dependencies: ['Database', 'Real-time Updates'],
      expectedFields: ['properties', 'recentUpdates']
    }, results);

    // Test 5: Properties Search API
    await testEndpoint({
      endpoint: '/api/properties/search?q=fitzgerald&includeStatistics=true',
      name: 'Properties Search API',
      dependencies: ['Database', 'Search Engine'],
      expectedFields: ['properties', 'statistics']
    }, results);

    // Test 6: Properties Main API
    await testEndpoint({
      endpoint: '/api/properties?featured=true&limit=5',
      name: 'Properties Main API',
      dependencies: ['Database', 'Development Service'],
      expectedFields: ['properties', 'total']
    }, results);

    // Integration Matrix Tests
    const integrationMatrix = {
      buyerToHTB: await testIntegration('buyer-htb', results),
      buyerToNotifications: await testIntegration('buyer-notifications', results),
      buyerToProperties: await testIntegration('buyer-properties', results),
      developerToHTB: await testIntegration('developer-htb', results),
      developerToNotifications: await testIntegration('developer-notifications', results),
      developerToProperties: await testIntegration('developer-properties', results),
      htbToNotifications: await testIntegration('htb-notifications', results),
      propertiesRealTime: await testIntegration('properties-realtime', results)
    };

    // Calculate overall health
    const passed = results.filter(r => r.status === 'pass').length;
    const failed = results.filter(r => r.status === 'fail').length;
    const warnings = results.filter(r => r.status === 'warning').length;
    
    let overallStatus: 'healthy' | 'degraded' | 'critical' = 'healthy';
    if (failed > 0) {
      overallStatus = failed > 2 ? 'critical' : 'degraded';
    } else if (warnings > 2) {
      overallStatus = 'degraded';
    }

    const report: SystemHealthReport = {
      timestamp: new Date(),
      overallStatus,
      totalTests: results.length,
      passed,
      failed,
      warnings,
      tests: results,
      integrationMatrix
    };

    // Add detailed information if requested
    if (detailed) {
      const additionalInfo = {
        executionTime: Date.now() - startTime,
        systemInfo: {
          nodeEnv: process.env.NODE_ENV,
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        },
        recommendations: generateRecommendations(results, integrationMatrix)
      };
      
      return NextResponse.json({ ...report, ...additionalInfo });
    }

    return NextResponse.json(report);

  } catch (error) {
    console.error('Integration test failed:', error);
    return NextResponse.json({
      error: 'Integration test execution failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    }, { status: 500 });
  }
}

async function testEndpoint(
  config: {
    endpoint: string;
    name: string;
    dependencies: string[];
    expectedFields: string[];
  },
  results: IntegrationTestResult[]
) {
  const startTime = Date.now();
  
  try {
    const response = await fetch(`http://localhost:3000${config.endpoint}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const responseTime = Date.now() - startTime;
    const data = await response.json();

    if (!response.ok) {
      results.push({
        endpoint: config.endpoint,
        name: config.name,
        status: 'fail',
        responseTime,
        error: `HTTP ${response.status}: ${data.error || 'Unknown error'}`,
        dependencies: config.dependencies
      });
      return;
    }

    // Check for expected fields
    const missingFields = config.expectedFields.filter(field => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return !data[parent] || !data[parent][child];
      }
      return data[field] === undefined;
    });

    const status = missingFields.length > 0 ? 'warning' : 'pass';
    
    results.push({
      endpoint: config.endpoint,
      name: config.name,
      status,
      responseTime,
      data: {
        recordCount: Array.isArray(data.properties) ? data.properties.length : 
                    Array.isArray(data.notifications) ? data.notifications.length :
                    data.total || 1,
        hasRequiredFields: missingFields.length === 0,
        missingFields: missingFields.length > 0 ? missingFields : undefined
      },
      dependencies: config.dependencies
    });

  } catch (error) {
    results.push({
      endpoint: config.endpoint,
      name: config.name,
      status: 'fail',
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Network error',
      dependencies: config.dependencies
    });
  }
}

async function testIntegration(type: string, results: IntegrationTestResult[]): Promise<boolean> {
  try {
    switch (type) {
      case 'buyer-htb':
        // Test buyer can access HTB data
        const htbTest = results.find(r => r.endpoint.includes('/api/htb/status/'));
        return htbTest?.status === 'pass';

      case 'buyer-notifications':
        // Test buyer notifications are working
        const notifTest = results.find(r => r.endpoint.includes('/api/notifications/user/'));
        return notifTest?.status === 'pass';

      case 'buyer-properties':
        // Test buyer can access property data
        const propTest = results.find(r => r.endpoint.includes('/api/properties'));
        return propTest?.status === 'pass';

      case 'developer-htb':
        // Test developer can access HTB management features (inherits from buyer-htb)
        return results.find(r => r.endpoint.includes('/api/htb/status/'))?.status === 'pass';

      case 'developer-notifications':
        // Test developer notifications integration
        const devNotifTest = results.find(r => r.endpoint.includes('/api/developer/notifications'));
        return devNotifTest?.status === 'pass';

      case 'developer-properties':
        // Test developer property management
        const availTest = results.find(r => r.endpoint.includes('/api/properties/availability'));
        return availTest?.status === 'pass';

      case 'htb-notifications':
        // Test HTB status changes trigger notifications
        const htbNotifIntegration = results.find(r => r.endpoint.includes('/api/notifications/'))?.status === 'pass' &&
                                  results.find(r => r.endpoint.includes('/api/htb/'))?.status === 'pass';
        return !!htbNotifIntegration;

      case 'properties-realtime':
        // Test real-time property updates
        const realtimeTest = results.find(r => r.endpoint.includes('/api/properties/availability'));
        return realtimeTest?.status === 'pass' && !!realtimeTest?.data?.recordCount;

      default:
        return false;
    }
  } catch (error) {
    return false;
  }
}

function generateRecommendations(
  results: IntegrationTestResult[], 
  integrationMatrix: any
): string[] {
  const recommendations: string[] = [];

  const failedTests = results.filter(r => r.status === 'fail');
  const slowTests = results.filter(r => r.responseTime > 1000);
  const warningTests = results.filter(r => r.status === 'warning');

  if (failedTests.length > 0) {
    recommendations.push(`Critical: ${failedTests.length} API endpoints are failing. Immediate attention required.`);
    failedTests.forEach(test => {
      recommendations.push(`- Fix ${test.name}: ${test.error}`);
    });
  }

  if (slowTests.length > 0) {
    recommendations.push(`Performance: ${slowTests.length} endpoints are responding slowly (>1s).`);
    recommendations.push('- Consider implementing caching or optimizing database queries.');
  }

  if (warningTests.length > 0) {
    recommendations.push(`Data Quality: ${warningTests.length} endpoints have missing expected fields.`);
    recommendations.push('- Review API response schemas and ensure all required data is included.');
  }

  // Integration-specific recommendations
  const failedIntegrations = Object.entries(integrationMatrix)
    .filter(([_, status]) => !status)
    .map(([name]) => name);

  if (failedIntegrations.length > 0) {
    recommendations.push(`Integration Issues: ${failedIntegrations.join(', ')} integrations are not functioning.`);
    recommendations.push('- Verify API dependencies and data flow between services.');
  }

  if (recommendations.length === 0) {
    recommendations.push('✅ All systems are functioning optimally.');
    recommendations.push('✅ All integrations are working correctly.');
    recommendations.push('✅ Performance is within acceptable limits.');
  }

  return recommendations;
}

// Export for use in other parts of the application
export async function runSystemHealthCheck(): Promise<SystemHealthReport> {
  const response = await fetch('/api/system/integration-test');
  return response.json();
}