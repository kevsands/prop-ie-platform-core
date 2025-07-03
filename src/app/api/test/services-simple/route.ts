import { NextResponse } from 'next/server';

/**
 * Simple test to verify service imports and basic functionality
 * No database, no authentication, just pure service testing
 */
export async function GET() {
  try {
    const results = {
      timestamp: new Date().toISOString(),
      tests: [] as any[]
    };

    // Test 1: Basic service imports
    try {
      const { enterpriseDocumentServices } = await import('@/lib/services/enterprise-document-service');
      results.tests.push({
        name: 'Enterprise Document Services Import',
        status: 'SUCCESS',
        details: {
          servicesAvailable: Object.keys(enterpriseDocumentServices),
          serviceCount: Object.keys(enterpriseDocumentServices).length
        }
      });
    } catch (error: any) {
      results.tests.push({
        name: 'Enterprise Document Services Import',
        status: 'FAILED',
        error: error.message
      });
    }

    // Test 2: Document generation service
    try {
      const { documentGenerationEngine } = await import('@/lib/services/document-generation-service');
      const status = documentGenerationEngine.getGenerationStatus('test-123');
      results.tests.push({
        name: 'Document Generation Engine',
        status: 'SUCCESS',
        details: {
          hasGenerationEngine: true,
          statusMethod: status ? 'working' : 'available',
          methods: ['generateDocument', 'getGenerationStatus', 'getGenerationAnalytics']
        }
      });
    } catch (error: any) {
      results.tests.push({
        name: 'Document Generation Engine',
        status: 'FAILED',
        error: error.message
      });
    }

    // Test 3: Workflow engine basic functionality
    try {
      const { documentWorkflowEngine } = await import('@/lib/services/document-workflow-engine');
      results.tests.push({
        name: 'Document Workflow Engine',
        status: 'SUCCESS',
        details: {
          hasWorkflowEngine: true,
          isEventEmitter: typeof documentWorkflowEngine.on === 'function',
          hasAnalytics: typeof documentWorkflowEngine.getWorkflowAnalytics === 'function'
        }
      });
    } catch (error: any) {
      results.tests.push({
        name: 'Document Workflow Engine',
        status: 'FAILED',
        error: error.message
      });
    }

    // Test 4: Irish utility APIs
    try {
      const { IrishUtilityAPIs } = await import('@/lib/services/irish-utility-apis');
      results.tests.push({
        name: 'Irish Utility APIs',
        status: 'SUCCESS',
        details: {
          providers: Object.keys(IrishUtilityAPIs),
          providerCount: Object.keys(IrishUtilityAPIs).length
        }
      });
    } catch (error: any) {
      results.tests.push({
        name: 'Irish Utility APIs',
        status: 'FAILED',
        error: error.message
      });
    }

    // Summary
    const successCount = results.tests.filter(t => t.status === 'SUCCESS').length;
    const totalTests = results.tests.length;

    return NextResponse.json({
      summary: {
        totalTests,
        successCount,
        failureCount: totalTests - successCount,
        successRate: `${Math.round((successCount / totalTests) * 100)}%`
      },
      results,
      message: successCount === totalTests ? 
        'All services loaded successfully!' : 
        `${successCount}/${totalTests} services working`
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Service test failed',
        message: error.message
      },
      { status: 500 }
    );
  }
}