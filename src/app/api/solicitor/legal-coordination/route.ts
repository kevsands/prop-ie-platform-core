/**
 * Solicitor Legal Coordination API Routes
 * 
 * Month 2, Week 2 Implementation: Core Professional Roles
 * API endpoints for legal coordination, conveyancing, and Law Society compliance
 * 
 * Endpoints:
 * - GET: Get legal data, cases, documents, compliance status
 * - POST: Create cases, tasks, documents, communications
 * - PUT: Update case status, approve documents, complete tasks
 * - DELETE: Archive cases and documents
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import LegalCoordinationService from '@/services/LegalCoordinationService';

const legalCoordination = new LegalCoordinationService();

// Request schemas
const CreateCaseSchema = z.object({
  type: z.enum(['conveyancing', 'development', 'commercial', 'residential', 'litigation', 'planning']),
  clientId: z.string().min(1),
  clientName: z.string().min(1),
  propertyAddress: z.string().min(1),
  propertyType: z.enum(['apartment', 'house', 'commercial', 'land', 'mixed_use']),
  transactionType: z.enum(['purchase', 'sale', 'lease', 'development', 'mortgage']),
  purchasePrice: z.number().min(0),
  currency: z.enum(['EUR', 'GBP', 'USD']).optional(),
  targetExchangeDate: z.coerce.date().optional(),
  targetCompletionDate: z.coerce.date().optional(),
  solicitorId: z.string().min(1),
  solicitorName: z.string().min(1),
  otherPartySolicitor: z.string().optional()
});

const UpdateCaseStatusSchema = z.object({
  caseId: z.string(),
  status: z.enum(['instruction', 'in_progress', 'awaiting_docs', 'contracts_prepared', 'exchange', 'completion', 'closed'])
});

const AddDocumentSchema = z.object({
  caseId: z.string(),
  name: z.string().min(1),
  type: z.enum(['contract', 'deed', 'certificate', 'report', 'correspondence', 'search', 'survey', 'planning']),
  category: z.enum(['title_docs', 'searches', 'surveys', 'planning', 'contracts', 'completion_docs', 'correspondence']),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  source: z.string().min(1),
  recipient: z.string().optional(),
  description: z.string(),
  dueDate: z.coerce.date().optional()
});

const ReviewDocumentSchema = z.object({
  caseId: z.string(),
  documentId: z.string(),
  status: z.enum(['pending', 'received', 'reviewed', 'approved', 'requires_action', 'completed']),
  comments: z.string().optional(),
  reviewedBy: z.string()
});

const CreateTaskSchema = z.object({
  caseId: z.string(),
  title: z.string().min(1),
  description: z.string(),
  type: z.enum(['document_review', 'client_contact', 'search_order', 'contract_prep', 'compliance_check', 'filing', 'meeting']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  assignedTo: z.string(),
  createdBy: z.string(),
  dueDate: z.coerce.date(),
  estimatedHours: z.number().min(0.5),
  relatedDocuments: z.array(z.string()).optional(),
  relatedMilestone: z.string().optional()
});

const CompleteTaskSchema = z.object({
  caseId: z.string(),
  taskId: z.string(),
  actualHours: z.number().optional(),
  notes: z.string().optional(),
  completedBy: z.string()
});

const IdentifyRiskSchema = z.object({
  caseId: z.string(),
  type: z.enum(['title_defect', 'planning_issue', 'survey_concern', 'finance_risk', 'legal_dispute', 'compliance_risk']),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  description: z.string(),
  impact: z.string(),
  likelihood: z.enum(['unlikely', 'possible', 'likely', 'certain']),
  mitigation: z.string(),
  assignedTo: z.string()
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const caseId = searchParams.get('caseId');
    const solicitorId = searchParams.get('solicitorId');
    const documentId = searchParams.get('documentId');

    switch (action) {
      case 'get_legal_data':
        if (!solicitorId) {
          return NextResponse.json(
            { error: 'Solicitor ID is required' },
            { status: 400 }
          );
        }
        return await getLegalData(solicitorId);

      case 'get_case':
        if (!caseId) {
          return NextResponse.json(
            { error: 'Case ID is required' },
            { status: 400 }
          );
        }
        return await getCase(caseId);

      case 'get_solicitor_cases':
        if (!solicitorId) {
          return NextResponse.json(
            { error: 'Solicitor ID is required' },
            { status: 400 }
          );
        }
        return await getSolicitorCases(solicitorId);

      case 'get_conveyancing_workflow':
        if (!caseId) {
          return NextResponse.json(
            { error: 'Case ID is required' },
            { status: 400 }
          );
        }
        return await getConveyancingWorkflow(caseId);

      case 'get_legal_kpis':
        if (!solicitorId) {
          return NextResponse.json(
            { error: 'Solicitor ID is required' },
            { status: 400 }
          );
        }
        return await getLegalKPIs(solicitorId);

      case 'get_law_society_compliance':
        if (!solicitorId) {
          return NextResponse.json(
            { error: 'Solicitor ID is required' },
            { status: 400 }
          );
        }
        return await getLawSocietyCompliance(solicitorId);

      case 'get_case_documents':
        if (!caseId) {
          return NextResponse.json(
            { error: 'Case ID is required' },
            { status: 400 }
          );
        }
        return await getCaseDocuments(caseId);

      case 'get_case_tasks':
        if (!caseId) {
          return NextResponse.json(
            { error: 'Case ID is required' },
            { status: 400 }
          );
        }
        return await getCaseTasks(caseId);

      case 'get_case_communications':
        if (!caseId) {
          return NextResponse.json(
            { error: 'Case ID is required' },
            { status: 400 }
          );
        }
        return await getCaseCommunications(caseId);

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Legal Coordination API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'create_case':
        const caseData = CreateCaseSchema.parse(body);
        return await createCase(caseData);

      case 'add_document':
        const documentData = AddDocumentSchema.parse(body);
        return await addDocument(documentData);

      case 'create_task':
        const taskData = CreateTaskSchema.parse(body);
        return await createTask(taskData);

      case 'identify_risk':
        const riskData = IdentifyRiskSchema.parse(body);
        return await identifyRisk(riskData);

      case 'perform_compliance_check':
        const { caseId, checkType } = body;
        if (!caseId || !checkType) {
          return NextResponse.json(
            { error: 'Case ID and check type are required' },
            { status: 400 }
          );
        }
        return await performComplianceCheck(caseId, checkType);

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Legal Coordination API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'update_case_status':
        const statusData = UpdateCaseStatusSchema.parse(body);
        return await updateCaseStatus(statusData);

      case 'review_document':
        const reviewData = ReviewDocumentSchema.parse(body);
        return await reviewDocument(reviewData);

      case 'complete_task':
        const completionData = CompleteTaskSchema.parse(body);
        return await completeTask(completionData);

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Legal Coordination API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET action handlers
async function getLegalData(solicitorId: string) {
  try {
    const [cases, kpis, compliance] = await Promise.all([
      legalCoordination.getSolicitorCases(solicitorId),
      legalCoordination.calculateLegalKPIs(solicitorId),
      legalCoordination.checkLawSocietyCompliance(solicitorId)
    ]);

    const legalData = {
      solicitorId,
      cases,
      kpis,
      compliance,
      summary: {
        totalCases: cases.length,
        activeCases: cases.filter(c => !['closed', 'completion'].includes(c.status)).length,
        totalDocuments: cases.reduce((sum, c) => sum + c.documents.length, 0),
        pendingTasks: cases.reduce((sum, c) => sum + c.tasks.filter(t => t.status !== 'completed').length, 0),
        complianceScore: kpis.complianceScore
      }
    };

    return NextResponse.json(legalData);
  } catch (error) {
    console.error('Error getting legal data:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve legal data' },
      { status: 500 }
    );
  }
}

async function getCase(caseId: string) {
  try {
    const legalCase = await legalCoordination.getCase(caseId);
    return NextResponse.json({ case: legalCase });
  } catch (error) {
    console.error('Error getting case:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve case' },
      { status: 500 }
    );
  }
}

async function getSolicitorCases(solicitorId: string) {
  try {
    const cases = await legalCoordination.getSolicitorCases(solicitorId);
    return NextResponse.json({ cases });
  } catch (error) {
    console.error('Error getting solicitor cases:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve solicitor cases' },
      { status: 500 }
    );
  }
}

async function getConveyancingWorkflow(caseId: string) {
  try {
    const workflow = await legalCoordination.getConveyancingWorkflow(caseId);
    return NextResponse.json({ workflow });
  } catch (error) {
    console.error('Error getting conveyancing workflow:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve conveyancing workflow' },
      { status: 500 }
    );
  }
}

async function getLegalKPIs(solicitorId: string) {
  try {
    const kpis = await legalCoordination.calculateLegalKPIs(solicitorId);
    return NextResponse.json({ kpis });
  } catch (error) {
    console.error('Error getting legal KPIs:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve legal KPIs' },
      { status: 500 }
    );
  }
}

async function getLawSocietyCompliance(solicitorId: string) {
  try {
    const compliance = await legalCoordination.checkLawSocietyCompliance(solicitorId);
    return NextResponse.json({ compliance });
  } catch (error) {
    console.error('Error getting Law Society compliance:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve Law Society compliance' },
      { status: 500 }
    );
  }
}

async function getCaseDocuments(caseId: string) {
  try {
    const legalCase = await legalCoordination.getCase(caseId);
    return NextResponse.json({ documents: legalCase?.documents || [] });
  } catch (error) {
    console.error('Error getting case documents:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve case documents' },
      { status: 500 }
    );
  }
}

async function getCaseTasks(caseId: string) {
  try {
    const legalCase = await legalCoordination.getCase(caseId);
    return NextResponse.json({ tasks: legalCase?.tasks || [] });
  } catch (error) {
    console.error('Error getting case tasks:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve case tasks' },
      { status: 500 }
    );
  }
}

async function getCaseCommunications(caseId: string) {
  try {
    const legalCase = await legalCoordination.getCase(caseId);
    return NextResponse.json({ communications: legalCase?.communications || [] });
  } catch (error) {
    console.error('Error getting case communications:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve case communications' },
      { status: 500 }
    );
  }
}

// POST action handlers
async function createCase(data: z.infer<typeof CreateCaseSchema>) {
  try {
    const legalCase = await legalCoordination.createCase(data);
    return NextResponse.json({ 
      success: true, 
      message: 'Legal case created successfully',
      case: legalCase 
    });
  } catch (error) {
    console.error('Error creating case:', error);
    return NextResponse.json(
      { error: 'Failed to create legal case' },
      { status: 500 }
    );
  }
}

async function addDocument(data: z.infer<typeof AddDocumentSchema>) {
  try {
    const document = await legalCoordination.addDocument(data.caseId, data);
    return NextResponse.json({ 
      success: true, 
      message: 'Document added successfully',
      document 
    });
  } catch (error) {
    console.error('Error adding document:', error);
    return NextResponse.json(
      { error: 'Failed to add document' },
      { status: 500 }
    );
  }
}

async function createTask(data: z.infer<typeof CreateTaskSchema>) {
  try {
    const task = await legalCoordination.createTask(data.caseId, data);
    return NextResponse.json({ 
      success: true, 
      message: 'Task created successfully',
      task 
    });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

async function identifyRisk(data: z.infer<typeof IdentifyRiskSchema>) {
  try {
    const risk = await legalCoordination.identifyRisk(data.caseId, data);
    return NextResponse.json({ 
      success: true, 
      message: 'Risk identified successfully',
      risk 
    });
  } catch (error) {
    console.error('Error identifying risk:', error);
    return NextResponse.json(
      { error: 'Failed to identify risk' },
      { status: 500 }
    );
  }
}

async function performComplianceCheck(caseId: string, checkType: string) {
  try {
    const check = await legalCoordination.performComplianceCheck(caseId, checkType as any);
    return NextResponse.json({ 
      success: true, 
      message: 'Compliance check completed successfully',
      check 
    });
  } catch (error) {
    console.error('Error performing compliance check:', error);
    return NextResponse.json(
      { error: 'Failed to perform compliance check' },
      { status: 500 }
    );
  }
}

// PUT action handlers
async function updateCaseStatus(data: z.infer<typeof UpdateCaseStatusSchema>) {
  try {
    const legalCase = await legalCoordination.updateCaseStatus(data.caseId, data.status);
    return NextResponse.json({ 
      success: true, 
      message: 'Case status updated successfully',
      case: legalCase 
    });
  } catch (error) {
    console.error('Error updating case status:', error);
    return NextResponse.json(
      { error: 'Failed to update case status' },
      { status: 500 }
    );
  }
}

async function reviewDocument(data: z.infer<typeof ReviewDocumentSchema>) {
  try {
    const document = await legalCoordination.reviewDocument(
      data.caseId, 
      data.documentId, 
      {
        status: data.status,
        comments: data.comments,
        reviewedBy: data.reviewedBy
      }
    );
    return NextResponse.json({ 
      success: true, 
      message: 'Document reviewed successfully',
      document 
    });
  } catch (error) {
    console.error('Error reviewing document:', error);
    return NextResponse.json(
      { error: 'Failed to review document' },
      { status: 500 }
    );
  }
}

async function completeTask(data: z.infer<typeof CompleteTaskSchema>) {
  try {
    const task = await legalCoordination.completeTask(
      data.caseId, 
      data.taskId, 
      {
        actualHours: data.actualHours,
        notes: data.notes,
        completedBy: data.completedBy
      }
    );
    return NextResponse.json({ 
      success: true, 
      message: 'Task completed successfully',
      task 
    });
  } catch (error) {
    console.error('Error completing task:', error);
    return NextResponse.json(
      { error: 'Failed to complete task' },
      { status: 500 }
    );
  }
}