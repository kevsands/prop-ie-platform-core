/**
 * Professional Documents API
 * 
 * API for managing professional documents across quantity surveyors, architects, and engineers
 * Supports document sharing, template management, and collaborative workflows
 */

import { NextRequest, NextResponse } from 'next/server';

// Document types and interfaces
interface ProfessionalDocument {
  id: string;
  title: string;
  description: string;
  type: 'cost-estimate' | 'drawings' | 'specifications' | 'reports' | 'calculations' | 'plans';
  professionalType: 'quantity-surveyor' | 'architect' | 'engineer';
  projectId: string;
  createdBy: string;
  assignedTo: string[];
  status: 'draft' | 'review' | 'approved' | 'rejected' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  version: string;
  fileUrl?: string;
  fileSize?: number;
  format: 'pdf' | 'dwg' | 'xlsx' | 'docx' | 'txt' | 'bim';
  tags: string[];
  metadata: {
    discipline?: string;
    category: string;
    stage: string;
    compliance: string[];
  };
  collaboration: {
    comments: Array<{
      id: string;
      author: string;
      message: string;
      timestamp: string;
    }>;
    reviewers: string[];
    approvers: string[];
  };
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
}

interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  professionalType: 'quantity-surveyor' | 'architect' | 'engineer';
  category: string;
  templateUrl: string;
  fields: Array<{
    name: string;
    type: 'text' | 'number' | 'date' | 'select' | 'textarea';
    required: boolean;
    options?: string[];
  }>;
  compliance: string[];
  createdAt: string;
  updatedAt: string;
}

// Sample documents data
const sampleDocuments: ProfessionalDocument[] = [
  {
    id: 'doc-1',
    title: 'Fitzgerald Gardens - Bill of Quantities',
    description: 'Comprehensive BOQ for residential development including all trades',
    type: 'cost-estimate',
    professionalType: 'quantity-surveyor',
    projectId: 'fitzgerald-gardens',
    createdBy: 'Michael O\'Brien',
    assignedTo: ['developer-team'],
    status: 'approved',
    priority: 'high',
    version: '2.1',
    fileUrl: '/documents/fitzgerald-gardens-boq-v2.1.xlsx',
    fileSize: 2450000,
    format: 'xlsx',
    tags: ['BOQ', 'cost-estimate', 'residential', 'detailed'],
    metadata: {
      category: 'Cost Management',
      stage: 'Detailed Design',
      compliance: ['SCSI Standards', 'RICS Guidelines']
    },
    collaboration: {
      comments: [
        {
          id: 'comment-1',
          author: 'Emma Collins',
          message: 'Updated quantities based on latest architectural drawings',
          timestamp: '2025-07-05T14:30:00Z'
        }
      ],
      reviewers: ['architect-team'],
      approvers: ['developer-lead']
    },
    createdAt: '2025-06-15T09:00:00Z',
    updatedAt: '2025-07-05T16:45:00Z',
    dueDate: '2025-07-10T00:00:00Z'
  },
  {
    id: 'doc-2',
    title: 'Structural Calculations Package',
    description: 'Complete structural analysis and design calculations for foundations and frame',
    type: 'calculations',
    professionalType: 'engineer',
    projectId: 'fitzgerald-gardens',
    createdBy: 'Patrick O\'Connor',
    assignedTo: ['architect-team', 'developer-team'],
    status: 'review',
    priority: 'high',
    version: '1.3',
    fileUrl: '/documents/fitzgerald-gardens-structural-v1.3.pdf',
    fileSize: 15600000,
    format: 'pdf',
    tags: ['structural', 'calculations', 'foundation', 'frame'],
    metadata: {
      discipline: 'structural',
      category: 'Engineering Analysis',
      stage: 'Detailed Design',
      compliance: ['Eurocode 2', 'IS EN 1990', 'Building Regulations']
    },
    collaboration: {
      comments: [
        {
          id: 'comment-2',
          author: 'Building Control',
          message: 'Please include wind load calculations for exposed sections',
          timestamp: '2025-07-04T11:20:00Z'
        }
      ],
      reviewers: ['building-control', 'architect-team'],
      approvers: ['developer-lead', 'structural-reviewer']
    },
    createdAt: '2025-06-20T10:30:00Z',
    updatedAt: '2025-07-04T17:15:00Z',
    dueDate: '2025-07-08T00:00:00Z'
  },
  {
    id: 'doc-3',
    title: 'Architectural Drawings Set - GA Plans',
    description: 'General arrangement drawings for all floors including elevations and sections',
    type: 'drawings',
    professionalType: 'architect',
    projectId: 'fitzgerald-gardens',
    createdBy: 'Emma Collins',
    assignedTo: ['engineer-team', 'developer-team', 'contractor'],
    status: 'approved',
    priority: 'high',
    version: '3.0',
    fileUrl: '/documents/fitzgerald-gardens-drawings-v3.0.dwg',
    fileSize: 45200000,
    format: 'dwg',
    tags: ['GA-plans', 'elevations', 'sections', 'residential'],
    metadata: {
      category: 'Design Drawings',
      stage: 'Detailed Design',
      compliance: ['RIAI Standards', 'Planning Permission', 'Building Regulations']
    },
    collaboration: {
      comments: [
        {
          id: 'comment-3',
          author: 'Planning Department',
          message: 'Drawings approved with conditions - see planning decision notice',
          timestamp: '2025-07-02T15:45:00Z'
        }
      ],
      reviewers: ['planning-department', 'engineer-team'],
      approvers: ['planning-authority', 'developer-lead']
    },
    createdAt: '2025-05-10T08:00:00Z',
    updatedAt: '2025-07-02T16:00:00Z'
  }
];

// Sample templates data
const sampleTemplates: DocumentTemplate[] = [
  {
    id: 'template-1',
    name: 'Bill of Quantities Template',
    description: 'Standard BOQ template compliant with SCSI and RICS guidelines',
    professionalType: 'quantity-surveyor',
    category: 'Cost Estimation',
    templateUrl: '/templates/boq-standard-template.xlsx',
    fields: [
      { name: 'projectName', type: 'text', required: true },
      { name: 'projectLocation', type: 'text', required: true },
      { name: 'estimateDate', type: 'date', required: true },
      { name: 'currency', type: 'select', required: true, options: ['EUR', 'GBP', 'USD'] },
      { name: 'contingency', type: 'number', required: true },
      { name: 'vatRate', type: 'number', required: true }
    ],
    compliance: ['SCSI Standards', 'RICS New Rules of Measurement'],
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-06-01T14:30:00Z'
  },
  {
    id: 'template-2',
    name: 'Structural Design Report Template',
    description: 'Standard template for structural engineering design reports',
    professionalType: 'engineer',
    category: 'Engineering Reports',
    templateUrl: '/templates/structural-report-template.docx',
    fields: [
      { name: 'projectTitle', type: 'text', required: true },
      { name: 'engineerName', type: 'text', required: true },
      { name: 'charteredNumber', type: 'text', required: true },
      { name: 'designStandards', type: 'select', required: true, options: ['Eurocode', 'BS Standards', 'Irish Standards'] },
      { name: 'soilConditions', type: 'textarea', required: true },
      { name: 'loadAssumptions', type: 'textarea', required: true }
    ],
    compliance: ['Engineers Ireland', 'Eurocode Standards', 'Building Regulations'],
    createdAt: '2025-02-01T09:00:00Z',
    updatedAt: '2025-05-15T11:45:00Z'
  },
  {
    id: 'template-3',
    name: 'Planning Application Drawing Set',
    description: 'Standard drawing template for planning applications',
    professionalType: 'architect',
    category: 'Planning Documents',
    templateUrl: '/templates/planning-drawings-template.dwg',
    fields: [
      { name: 'applicantName', type: 'text', required: true },
      { name: 'siteAddress', type: 'textarea', required: true },
      { name: 'planningAuthority', type: 'text', required: true },
      { name: 'proposedUse', type: 'select', required: true, options: ['Residential', 'Commercial', 'Mixed Use', 'Industrial'] },
      { name: 'floorArea', type: 'number', required: true },
      { name: 'siteArea', type: 'number', required: true }
    ],
    compliance: ['RIAI Standards', 'Planning Guidelines', 'Development Standards'],
    createdAt: '2025-02-10T11:30:00Z',
    updatedAt: '2025-06-10T09:15:00Z'
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const projectId = searchParams.get('projectId');
  const professionalType = searchParams.get('professionalType');
  const documentType = searchParams.get('documentType');
  const status = searchParams.get('status');

  try {
    switch (action) {
      case 'documents':
        // Get professional documents with optional filters
        let filteredDocuments = sampleDocuments;
        
        if (projectId) {
          filteredDocuments = filteredDocuments.filter(doc => 
            doc.projectId.toLowerCase().replace(/\s+/g, '-') === projectId
          );
        }
        
        if (professionalType) {
          filteredDocuments = filteredDocuments.filter(doc => doc.professionalType === professionalType);
        }
        
        if (documentType) {
          filteredDocuments = filteredDocuments.filter(doc => doc.type === documentType);
        }
        
        if (status) {
          filteredDocuments = filteredDocuments.filter(doc => doc.status === status);
        }

        return NextResponse.json({
          success: true,
          documents: filteredDocuments,
          count: filteredDocuments.length,
          filters: {
            projectId,
            professionalType,
            documentType,
            status
          }
        });

      case 'templates':
        // Get document templates
        let filteredTemplates = sampleTemplates;
        
        if (professionalType) {
          filteredTemplates = filteredTemplates.filter(template => template.professionalType === professionalType);
        }

        return NextResponse.json({
          success: true,
          templates: filteredTemplates,
          count: filteredTemplates.length
        });

      case 'stats':
        // Get document statistics
        const stats = {
          totalDocuments: sampleDocuments.length,
          documentsByType: {
            'cost-estimate': sampleDocuments.filter(d => d.type === 'cost-estimate').length,
            'drawings': sampleDocuments.filter(d => d.type === 'drawings').length,
            'calculations': sampleDocuments.filter(d => d.type === 'calculations').length,
            'reports': sampleDocuments.filter(d => d.type === 'reports').length,
            'specifications': sampleDocuments.filter(d => d.type === 'specifications').length,
            'plans': sampleDocuments.filter(d => d.type === 'plans').length
          },
          documentsByProfessional: {
            'quantity-surveyor': sampleDocuments.filter(d => d.professionalType === 'quantity-surveyor').length,
            'architect': sampleDocuments.filter(d => d.professionalType === 'architect').length,
            'engineer': sampleDocuments.filter(d => d.professionalType === 'engineer').length
          },
          documentsByStatus: {
            'draft': sampleDocuments.filter(d => d.status === 'draft').length,
            'review': sampleDocuments.filter(d => d.status === 'review').length,
            'approved': sampleDocuments.filter(d => d.status === 'approved').length,
            'rejected': sampleDocuments.filter(d => d.status === 'rejected').length,
            'archived': sampleDocuments.filter(d => d.status === 'archived').length
          },
          totalTemplates: sampleTemplates.length,
          averageFileSize: sampleDocuments.reduce((acc, doc) => acc + (doc.fileSize || 0), 0) / sampleDocuments.length,
          totalCollaborators: new Set(sampleDocuments.flatMap(doc => [...doc.assignedTo, ...doc.collaboration.reviewers])).size
        };

        return NextResponse.json({
          success: true,
          stats
        });

      case 'collaboration':
        // Get collaboration data for a specific document
        const documentId = searchParams.get('documentId');
        if (!documentId) {
          return NextResponse.json({ 
            error: 'Document ID required for collaboration data' 
          }, { status: 400 });
        }

        const document = sampleDocuments.find(doc => doc.id === documentId);
        if (!document) {
          return NextResponse.json({ 
            error: 'Document not found' 
          }, { status: 404 });
        }

        return NextResponse.json({
          success: true,
          collaboration: document.collaboration,
          documentId,
          title: document.title
        });

      default:
        // Default: return all documents and templates
        return NextResponse.json({
          success: true,
          documents: sampleDocuments,
          templates: sampleTemplates,
          totalDocuments: sampleDocuments.length,
          totalTemplates: sampleTemplates.length
        });
    }
  } catch (error) {
    console.error('Professional documents API error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch document data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'create_document':
        // Create new professional document
        const newDocument: ProfessionalDocument = {
          id: `doc-${Date.now()}`,
          title: data.title,
          description: data.description,
          type: data.type,
          professionalType: data.professionalType,
          projectId: data.projectId,
          createdBy: data.createdBy,
          assignedTo: data.assignedTo || [],
          status: 'draft',
          priority: data.priority || 'medium',
          version: '1.0',
          fileUrl: data.fileUrl,
          fileSize: data.fileSize,
          format: data.format,
          tags: data.tags || [],
          metadata: data.metadata,
          collaboration: {
            comments: [],
            reviewers: data.reviewers || [],
            approvers: data.approvers || []
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          dueDate: data.dueDate
        };

        return NextResponse.json({
          success: true,
          document: newDocument,
          message: 'Document created successfully'
        });

      case 'add_comment':
        // Add comment to document
        const commentId = `comment-${Date.now()}`;
        const newComment = {
          id: commentId,
          author: data.author,
          message: data.message,
          timestamp: new Date().toISOString()
        };

        return NextResponse.json({
          success: true,
          comment: newComment,
          documentId: data.documentId,
          message: 'Comment added successfully'
        });

      case 'create_template':
        // Create new document template
        const newTemplate: DocumentTemplate = {
          id: `template-${Date.now()}`,
          name: data.name,
          description: data.description,
          professionalType: data.professionalType,
          category: data.category,
          templateUrl: data.templateUrl,
          fields: data.fields || [],
          compliance: data.compliance || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        return NextResponse.json({
          success: true,
          template: newTemplate,
          message: 'Template created successfully'
        });

      case 'assign_reviewers':
        // Assign reviewers to document
        return NextResponse.json({
          success: true,
          assignment: {
            documentId: data.documentId,
            reviewers: data.reviewers,
            assignedAt: new Date().toISOString()
          },
          message: 'Reviewers assigned successfully'
        });

      default:
        return NextResponse.json({ 
          error: 'Invalid action' 
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Professional documents POST error:', error);
    return NextResponse.json({ 
      error: 'Failed to process document request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentId, updates } = body;

    // Update document
    const updatedDocument = {
      ...updates,
      id: documentId,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      document: updatedDocument,
      message: 'Document updated successfully'
    });
  } catch (error) {
    console.error('Professional documents PUT error:', error);
    return NextResponse.json({ 
      error: 'Failed to update document',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('documentId');
    const templateId = searchParams.get('templateId');

    if (documentId) {
      return NextResponse.json({
        success: true,
        deletedDocumentId: documentId,
        message: 'Document deleted successfully'
      });
    }

    if (templateId) {
      return NextResponse.json({
        success: true,
        deletedTemplateId: templateId,
        message: 'Template deleted successfully'
      });
    }

    return NextResponse.json({ 
      error: 'Document ID or Template ID required' 
    }, { status: 400 });
  } catch (error) {
    console.error('Professional documents DELETE error:', error);
    return NextResponse.json({ 
      error: 'Failed to delete document data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}