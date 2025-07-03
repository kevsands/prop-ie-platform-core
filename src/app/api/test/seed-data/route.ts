import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Test endpoint to seed the database with sample document management data
 * Only available in development
 */
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Test endpoint not available in production' },
      { status: 403 }
    );
  }

  try {
    // Create test user first
    const testUser = await prisma.user.upsert({
      where: { email: 'test@prop.ie' },
      update: {},
      create: {
        id: 'test-user-001',
        email: 'test@prop.ie',
        firstName: 'Test',
        lastName: 'User',
        password: 'hashed-password', // In real app this would be properly hashed
        status: 'ACTIVE',
        created: new Date(),
        lastActive: new Date()
      }
    });

    // Create test location first (required for development foreign key)
    const testLocation = await prisma.location.upsert({
      where: { id: 'test-location-001' },
      update: {},
      create: {
        id: 'test-location-001',
        city: 'Dublin',
        county: 'Dublin',
        country: 'Ireland',
        address: 'Test Street, Dublin 1',
        addressLine1: 'Test Street',
        addressLine2: 'Dublin 1',
        latitude: 53.3498,
        longitude: -6.2603,
        eircode: 'D01X123'
      }
    });

    // Create test development first (required for project foreign key)
    const testDevelopment = await prisma.development.upsert({
      where: { id: 'dev-test-001' },
      update: {},
      create: {
        id: 'dev-test-001',
        name: 'Test Development',
        slug: 'test-development',
        developerId: testUser.id,
        locationId: 'test-location-001', // We'll need to create this
        status: 'PLANNING',
        marketingStatus: {},
        salesStatus: {},
        constructionStatus: {},
        complianceStatus: {},
        mainImage: '/images/test-development.jpg',
        description: 'Sample development for testing document management',
        created: new Date(),
        updated: new Date()
      }
    });

    // Create test project
    const testProject = await prisma.project.upsert({
      where: { id: 'test-project-001' },
      update: {},
      create: {
        id: 'test-project-001',
        developmentId: testDevelopment.id,
        name: 'Test Development Project',
        description: 'Sample project for testing document management',
        status: 'ACTIVE',
        plannedStartDate: new Date(),
        plannedEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        projectManagerId: testUser.id,
        constructionStage: 'planning',
        createdBy: testUser.id,
        created: new Date(),
        updated: new Date()
      }
    });

    // Create sample document templates
    const contractTemplate = await prisma.documentTemplate.upsert({
      where: { id: 'template-contract-001' },
      update: {},
      create: {
        id: 'template-contract-001',
        name: 'Property Sale Contract',
        description: 'Standard property sale contract template for Ireland',
        category: 'legal_contract',
        status: 'active',
        version: '1.0',
        templateData: {
          type: 'contract',
          sections: ['parties', 'property-details', 'terms', 'signatures'],
          fields: ['property_address', 'vendor_name', 'vendor_address', 'purchaser_name', 'purchaser_address', 'purchase_price', 'deposit_amount', 'completion_date', 'planning_reference', 'signature_date']
        },
        createdBy: testUser.id,
        projectTypes: ['residential', 'commercial'],
        tags: ['contract', 'legal', 'sale', 'property'],
        metadata: JSON.stringify({
          version: '1.0',
          created: new Date(),
          category: 'legal_contract',
          jurisdiction: 'Ireland'
        })
      }
    });

    const htbTemplate = await prisma.documentTemplate.upsert({
      where: { id: 'template-htb-001' },
      update: {},
      create: {
        id: 'template-htb-001',
        name: 'Help to Buy Application',
        description: 'Help to Buy scheme application form for first-time buyers',
        category: 'authorization',
        status: 'active',
        version: '1.0',
        templateData: {
          type: 'government_application',
          scheme: 'help_to_buy',
          sections: ['applicant-details', 'property-details', 'employment', 'declaration', 'signature'],
          fields: ['first_name', 'last_name', 'date_of_birth', 'pps_number', 'email', 'phone', 'current_address', 'property_address', 'property_type', 'purchase_price', 'mortgage_amount', 'deposit_amount', 'htb_amount', 'employer_name', 'annual_income', 'employment_start_date', 'application_date']
        },
        createdBy: testUser.id,
        projectTypes: ['residential'],
        tags: ['htb', 'help-to-buy', 'government', 'financial'],
        metadata: JSON.stringify({
          version: '1.0',
          created: new Date(),
          category: 'authorization',
          scheme: 'help-to-buy'
        })
      }
    });

    // Create a workflow template
    const approvalWorkflow = await prisma.workflowTemplate.upsert({
      where: { id: 'workflow-approval-001' },
      update: {},
      create: {
        id: 'workflow-approval-001',
        name: 'Document Approval Workflow',
        description: 'Standard workflow for document review and approval',
        documentCategory: 'legal_contract',
        stages: JSON.stringify([
          {
            id: 'stage-1',
            name: 'Initial Review',
            type: 'task',
            sequence: 1,
            requiredRoles: ['PROJECT_MANAGER'],
            conditions: [],
            actions: [{ type: 'send_notification', config: { message: 'Document ready for review' } }],
            notifications: [{ type: 'email', template: 'review_needed', recipients: ['pm@prop.ie'], triggerOn: 'stage_start' }]
          },
          {
            id: 'stage-2',
            name: 'Legal Review',
            type: 'approval',
            sequence: 2,
            requiredRoles: ['SOLICITOR', 'ADMIN'],
            conditions: [],
            actions: [{ type: 'update_document', config: { status: 'legal_reviewed' } }],
            notifications: [{ type: 'email', template: 'legal_review', recipients: ['legal@prop.ie'], triggerOn: 'stage_start' }]
          },
          {
            id: 'stage-3',
            name: 'Final Approval',
            type: 'approval',
            sequence: 3,
            requiredRoles: ['DEVELOPER', 'ADMIN'],
            conditions: [],
            actions: [{ type: 'update_document', config: { status: 'approved' } }],
            notifications: [{ type: 'email', template: 'final_approval', recipients: ['developer@prop.ie'], triggerOn: 'stage_complete' }]
          }
        ]),
        estimatedDuration: '48 hours'
      }
    });

    // Create some sample documents
    const sampleContract = await prisma.document.create({
      data: {
        id: 'doc-contract-001',
        name: 'Sample_Property_Contract.pdf',
        category: 'generated',
        type: 'CONTRACT',
        fileType: 'pdf',
        fileUrl: '/api/documents/generated/Sample_Property_Contract.pdf',
        fileSize: 156789,
        uploadedById: testUser.id,
        developmentId: testDevelopment.id,
        status: 'active',
        version: 1,
        metadata: JSON.stringify({
          templateId: contractTemplate.id,
          generatedAt: new Date(),
          generatedBy: testUser.id,
          documentType: 'contract'
        })
      }
    });

    return NextResponse.json({
      message: 'Test data seeded successfully',
      data: {
        user: testUser,
        project: testProject,
        templates: {
          contract: contractTemplate.id,
          htb: htbTemplate.id
        },
        workflow: approvalWorkflow.id,
        documents: [sampleContract.id],
        counts: {
          templates: 2,
          workflows: 1,
          documents: 1
        }
      }
    });

  } catch (error: any) {
    console.error('Seed data error:', error);
    return NextResponse.json(
      {
        error: 'Failed to seed test data',
        message: error.message,
        details: error.stack
      },
      { status: 500 }
    );
  }
}

/**
 * GET - Check what test data exists
 */
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Test endpoint not available in production' },
      { status: 403 }
    );
  }

  try {
    const [templates, workflows, documents, users] = await Promise.all([
      prisma.documentTemplate.count(),
      prisma.workflowTemplate.count(),
      prisma.document.count(),
      prisma.user.count()
    ]);

    return NextResponse.json({
      current_data: {
        templates,
        workflows,
        documents,
        users
      },
      message: 'Use POST to seed test data'
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to check test data', message: error.message },
      { status: 500 }
    );
  }
}