import { NextResponse } from 'next/server';

/**
 * Direct test of document generation service without authentication
 * Tests the core document generation functionality
 */
export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Test endpoint not available in production' },
      { status: 403 }
    );
  }

  try {
    // Dynamic import to test the document generation service
    const { documentGenerationEngine } = await import('@/lib/services/document-generation-service');

    // Create a test template directly in memory
    const testTemplate = {
      id: 'test-template-001',
      name: 'Property Sale Contract Test',
      category: 'legal',
      templateType: 'html' as const,
      templateContent: `
        <div class="contract-template">
          <h1>Property Sale Contract</h1>
          <h2>Contract for Sale of Property at {{property_address}}</h2>
          
          <div class="parties">
            <h3>Vendor Details</h3>
            <p>Name: {{vendor_name}}</p>
            <p>Address: {{vendor_address}}</p>
            
            <h3>Purchaser Details</h3>
            <p>Name: {{purchaser_name}}</p>
            <p>Address: {{purchaser_address}}</p>
          </div>
          
          <div class="property-details">
            <h3>Property Details</h3>
            <p>Address: {{property_address}}</p>
            <p>Purchase Price: €{{purchase_price}}</p>
            <p>Deposit: €{{deposit_amount}}</p>
            <p>Completion Date: {{completion_date}}</p>
          </div>
          
          <div class="terms">
            <h3>Terms and Conditions</h3>
            <p>1. The purchaser agrees to purchase the property for the sum of €{{purchase_price}}</p>
            <p>2. A deposit of €{{deposit_amount}} is payable upon signing</p>
            <p>3. Completion shall take place on {{completion_date}}</p>
          </div>
          
          <div class="signatures">
            <div class="signature-section">
              <p>Vendor Signature: _____________________ Date: {{signature_date}}</p>
            </div>
            <div class="signature-section">
              <p>Purchaser Signature: _____________________ Date: {{signature_date}}</p>
            </div>
          </div>
        </div>
      `,
      placeholders: [
        { key: 'property_address', label: 'Property Address', type: 'text', required: true },
        { key: 'vendor_name', label: 'Vendor Name', type: 'text', required: true },
        { key: 'vendor_address', label: 'Vendor Address', type: 'text', required: true },
        { key: 'purchaser_name', label: 'Purchaser Name', type: 'text', required: true },
        { key: 'purchaser_address', label: 'Purchaser Address', type: 'text', required: true },
        { key: 'purchase_price', label: 'Purchase Price', type: 'number', required: true },
        { key: 'deposit_amount', label: 'Deposit Amount', type: 'number', required: true },
        { key: 'completion_date', label: 'Completion Date', type: 'date', required: true },
        { key: 'signature_date', label: 'Signature Date', type: 'date', required: true }
      ],
      styling: {
        fonts: [{ name: 'Arial', size: 12, weight: 'normal', style: 'normal', color: '#000000' }],
        colors: { primary: '#2B5273', secondary: '#ffffff', accent: '#1e3347', text: '#000000', background: '#ffffff' },
        spacing: { lineHeight: 1.5, paragraphSpacing: 12, marginTop: 20, marginBottom: 20, marginLeft: 20, marginRight: 20 },
        pageSettings: { size: 'A4', orientation: 'portrait', margins: { top: 20, bottom: 20, left: 20, right: 20 } }
      },
      metadata: {
        version: '1.0',
        author: 'Test System',
        created: new Date(),
        modified: new Date(),
        description: 'Test property contract template',
        tags: ['test', 'contract', 'property'],
        category: 'legal',
        language: 'en',
        compatibleWith: ['html', 'pdf']
      }
    };

    // Test data for the contract
    const testData = {
      property_address: '123 Test Street, Dublin 4, Ireland',
      vendor_name: 'Test Vendor Ltd.',
      vendor_address: '456 Business Park, Dublin 2, Ireland',
      purchaser_name: 'John and Jane Doe',
      purchaser_address: '789 Residential Avenue, Dublin 6, Ireland',
      purchase_price: '450000',
      deposit_amount: '45000',
      completion_date: '2025-09-15',
      signature_date: '2025-07-02'
    };

    // Create a test generation request
    const generationRequest = {
      templateId: testTemplate.id,
      outputFormat: 'html' as const,
      data: testData,
      options: {
        includeMetadata: true,
        quality: 'high' as const
      },
      metadata: {
        requestId: `test-req-${Date.now()}`,
        userId: 'test-user-001',
        projectId: 'test-project-001',
        timestamp: new Date(),
        source: 'test-api'
      }
    };

    // Override the getTemplate method temporarily for testing
    const originalGetTemplate = (documentGenerationEngine as any).getTemplate;
    (documentGenerationEngine as any).getTemplate = async (templateId: string) => {
      if (templateId === testTemplate.id) {
        return testTemplate;
      }
      throw new Error('Template not found');
    };

    // Generate the document
    const result = await documentGenerationEngine.generateDocument(generationRequest);

    // Restore original method
    (documentGenerationEngine as any).getTemplate = originalGetTemplate;

    return NextResponse.json({
      success: true,
      message: 'Document generation test completed successfully',
      result: {
        documentId: result.documentId,
        fileName: result.fileName,
        fileUrl: result.fileUrl,
        fileSize: result.fileSize,
        mimeType: result.mimeType,
        generationTime: result.generationTime,
        metadata: result.metadata
      },
      template: {
        id: testTemplate.id,
        name: testTemplate.name,
        placeholders: testTemplate.placeholders.length
      },
      testData: Object.keys(testData)
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'Document generation test failed',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * GET - Test workflow engine
 */
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Test endpoint not available in production' },
      { status: 403 }
    );
  }

  try {
    // Test workflow engine
    const { documentWorkflowEngine } = await import('@/lib/services/document-workflow-engine');

    // Test analytics without database
    const mockAnalytics = {
      totalWorkflows: 0,
      activeWorkflows: 0,
      completedWorkflows: 0,
      averageCompletionTime: 0,
      stageBottlenecks: {},
      completionRate: 0
    };

    // Test that the workflow engine loads and has correct methods
    const methods = [
      'createWorkflowTemplate',
      'startWorkflow',
      'advanceWorkflow',
      'approveStage',
      'getWorkflowAnalytics'
    ];

    const availableMethods = methods.filter(method => 
      typeof (documentWorkflowEngine as any)[method] === 'function'
    );

    return NextResponse.json({
      success: true,
      message: 'Workflow engine test completed successfully',
      workflowEngine: {
        loaded: true,
        availableMethods,
        methodCount: availableMethods.length,
        expectedMethods: methods.length
      },
      analytics: mockAnalytics,
      eventEmitter: {
        hasEventSystem: typeof documentWorkflowEngine.on === 'function',
        hasEmitMethod: typeof documentWorkflowEngine.emit === 'function'
      }
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'Workflow engine test failed',
        message: error.message
      },
      { status: 500 }
    );
  }
}