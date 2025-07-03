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

    // Create test development first (required for project foreign key)
    const testDevelopment = await prisma.development.upsert({
      where: { id: 'dev-test-001' },
      update: {},
      create: {
        id: 'dev-test-001',
        name: 'Test Development',
        slug: 'test-development',
        description: 'Sample development for testing',
        status: 'PLANNING',
        type: 'RESIDENTIAL',
        location: 'Dublin, Ireland',
        developerCompany: 'Test Developer Ltd',
        totalUnits: 10,
        availableUnits: 10,
        priceRange: '€300,000 - €500,000',
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
        category: 'legal',
        fileType: 'pdf',
        status: 'active',
        version: '1.0',
        content: `
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
              <p>4. The property is sold subject to planning permission {{planning_reference}}</p>
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
        placeholders: JSON.stringify([
          { key: 'property_address', label: 'Property Address', type: 'text', required: true },
          { key: 'vendor_name', label: 'Vendor Name', type: 'text', required: true },
          { key: 'vendor_address', label: 'Vendor Address', type: 'text', required: true },
          { key: 'purchaser_name', label: 'Purchaser Name', type: 'text', required: true },
          { key: 'purchaser_address', label: 'Purchaser Address', type: 'text', required: true },
          { key: 'purchase_price', label: 'Purchase Price', type: 'number', required: true },
          { key: 'deposit_amount', label: 'Deposit Amount', type: 'number', required: true },
          { key: 'completion_date', label: 'Completion Date', type: 'date', required: true },
          { key: 'planning_reference', label: 'Planning Reference', type: 'text', required: false },
          { key: 'signature_date', label: 'Signature Date', type: 'date', required: true }
        ]),
        styling: JSON.stringify({
          fonts: [{ name: 'Arial', size: 12, weight: 'normal', style: 'normal', color: '#000000' }],
          colors: { primary: '#2B5273', secondary: '#ffffff', accent: '#1e3347', text: '#000000', background: '#ffffff' },
          spacing: { lineHeight: 1.5, paragraphSpacing: 12, marginTop: 20, marginBottom: 20, marginLeft: 20, marginRight: 20 },
          pageSettings: { size: 'A4', orientation: 'portrait', margins: { top: 20, bottom: 20, left: 20, right: 20 } }
        }),
        createdBy: testUser.id,
        projectTypes: ['residential', 'commercial'],
        tags: ['contract', 'legal', 'sale', 'property'],
        metadata: JSON.stringify({
          version: '1.0',
          created: new Date(),
          category: 'legal',
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
        category: 'financial',
        fileType: 'pdf',
        status: 'active',
        version: '1.0',
        content: `
          <div class="htb-application">
            <h1>Help to Buy Application Form</h1>
            <p>Application for Help to Buy Incentive for First Time Buyers</p>
            
            <div class="applicant-details">
              <h2>Applicant Details</h2>
              <p>First Name: {{first_name}}</p>
              <p>Last Name: {{last_name}}</p>
              <p>Date of Birth: {{date_of_birth}}</p>
              <p>PPS Number: {{pps_number}}</p>
              <p>Email: {{email}}</p>
              <p>Phone: {{phone}}</p>
              <p>Address: {{current_address}}</p>
            </div>
            
            <div class="property-details">
              <h2>Property Information</h2>
              <p>Property Address: {{property_address}}</p>
              <p>Property Type: {{property_type}}</p>
              <p>Purchase Price: €{{purchase_price}}</p>
              <p>Mortgage Amount: €{{mortgage_amount}}</p>
              <p>Deposit Amount: €{{deposit_amount}}</p>
              <p>HTB Amount Requested: €{{htb_amount}}</p>
            </div>
            
            <div class="employment">
              <h2>Employment Details</h2>
              <p>Employer: {{employer_name}}</p>
              <p>Annual Income: €{{annual_income}}</p>
              <p>Employment Start Date: {{employment_start_date}}</p>
            </div>
            
            <div class="declaration">
              <h2>Declaration</h2>
              <p>I declare that:</p>
              <p>☐ This is my first time purchasing a property</p>
              <p>☐ I will occupy this property as my principal private residence</p>
              <p>☐ The information provided is true and accurate</p>
              <p>☐ I understand the terms and conditions of the HTB scheme</p>
            </div>
            
            <div class="signature">
              <p>Applicant Signature: _____________________ Date: {{application_date}}</p>
            </div>
          </div>
        `,
        placeholders: JSON.stringify([
          { key: 'first_name', label: 'First Name', type: 'text', required: true },
          { key: 'last_name', label: 'Last Name', type: 'text', required: true },
          { key: 'date_of_birth', label: 'Date of Birth', type: 'date', required: true },
          { key: 'pps_number', label: 'PPS Number', type: 'text', required: true },
          { key: 'email', label: 'Email Address', type: 'text', required: true },
          { key: 'phone', label: 'Phone Number', type: 'text', required: true },
          { key: 'current_address', label: 'Current Address', type: 'text', required: true },
          { key: 'property_address', label: 'Property Address', type: 'text', required: true },
          { key: 'property_type', label: 'Property Type', type: 'text', required: true },
          { key: 'purchase_price', label: 'Purchase Price', type: 'number', required: true },
          { key: 'mortgage_amount', label: 'Mortgage Amount', type: 'number', required: true },
          { key: 'deposit_amount', label: 'Deposit Amount', type: 'number', required: true },
          { key: 'htb_amount', label: 'HTB Amount Requested', type: 'number', required: true },
          { key: 'employer_name', label: 'Employer Name', type: 'text', required: true },
          { key: 'annual_income', label: 'Annual Income', type: 'number', required: true },
          { key: 'employment_start_date', label: 'Employment Start Date', type: 'date', required: true },
          { key: 'application_date', label: 'Application Date', type: 'date', required: true }
        ]),
        styling: JSON.stringify({
          fonts: [{ name: 'Arial', size: 11, weight: 'normal', style: 'normal', color: '#000000' }],
          colors: { primary: '#2B5273', secondary: '#ffffff', accent: '#1e3347', text: '#000000', background: '#ffffff' },
          spacing: { lineHeight: 1.4, paragraphSpacing: 10, marginTop: 15, marginBottom: 15, marginLeft: 15, marginRight: 15 },
          pageSettings: { size: 'A4', orientation: 'portrait', margins: { top: 15, bottom: 15, left: 15, right: 15 } }
        }),
        createdBy: testUser.id,
        projectTypes: ['residential'],
        tags: ['htb', 'help-to-buy', 'government', 'financial'],
        metadata: JSON.stringify({
          version: '1.0',
          created: new Date(),
          category: 'financial',
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
        category: 'approval',
        version: '1.0',
        isActive: true,
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
        globalVariables: JSON.stringify({
          timeout_hours: 48,
          auto_approve_threshold: 1000,
          notification_enabled: true
        }),
        createdBy: testUser.id
      }
    });

    // Create some sample documents
    const sampleContract = await prisma.document.create({
      data: {
        id: 'doc-contract-001',
        name: 'Sample_Property_Contract.pdf',
        category: 'generated',
        fileType: 'pdf',
        fileUrl: '/api/documents/generated/Sample_Property_Contract.pdf',
        fileSize: 156789,
        uploadedById: testUser.id,
        projectId: testProject.id,
        status: 'active',
        version: '1.0',
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