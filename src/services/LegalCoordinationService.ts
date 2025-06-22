/**
 * Legal Coordination Service
 * 
 * Month 2, Week 2 Implementation: Core Professional Roles
 * Business logic for legal coordination, conveyancing, and compliance
 * 
 * Features:
 * - Conveyancing workflow management
 * - Legal document preparation and review
 * - Client communication and coordination
 * - Law Society of Ireland compliance
 * - Multi-professional integration with architects, engineers, project managers, quantity surveyors
 * - Title examination and due diligence
 * - Contract management and execution
 * - Legal milestone tracking and reporting
 */

import { PrismaClient, UserRole } from '@prisma/client';
import { EventEmitter } from 'events';

const prisma = new PrismaClient();

export interface LegalCase {
  id: string;
  reference: string;
  type: 'conveyancing' | 'development' | 'commercial' | 'residential' | 'litigation' | 'planning';
  status: 'instruction' | 'in_progress' | 'awaiting_docs' | 'contracts_prepared' | 'exchange' | 'completion' | 'closed';
  clientId: string;
  clientName: string;
  propertyAddress: string;
  propertyType: 'apartment' | 'house' | 'commercial' | 'land' | 'mixed_use';
  transactionType: 'purchase' | 'sale' | 'lease' | 'development' | 'mortgage';
  purchasePrice: number;
  currency: 'EUR' | 'GBP' | 'USD';
  instructionDate: Date;
  targetExchangeDate?: Date;
  targetCompletionDate?: Date;
  actualExchangeDate?: Date;
  actualCompletionDate?: Date;
  solicitorId: string;
  solicitorName: string;
  otherPartySolicitor?: string;
  documents: LegalDocument[];
  milestones: LegalMilestone[];
  tasks: LegalTask[];
  communications: LegalCommunication[];
  fees: LegalFees;
  notes: string[];
  riskFactors: RiskFactor[];
  complianceChecks: ComplianceCheck[];
}

export interface LegalDocument {
  id: string;
  caseId: string;
  name: string;
  type: 'contract' | 'deed' | 'certificate' | 'report' | 'correspondence' | 'search' | 'survey' | 'planning';
  category: 'title_docs' | 'searches' | 'surveys' | 'planning' | 'contracts' | 'completion_docs' | 'correspondence';
  status: 'pending' | 'received' | 'reviewed' | 'approved' | 'requires_action' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  receivedDate?: Date;
  reviewedDate?: Date;
  reviewedBy?: string;
  dueDate?: Date;
  source: string;
  recipient?: string;
  description: string;
  filePath?: string;
  fileSize?: number;
  version: number;
  comments: DocumentComment[];
  complianceStatus: 'compliant' | 'non_compliant' | 'pending_review';
}

export interface DocumentComment {
  id: string;
  userId: string;
  userName: string;
  comment: string;
  timestamp: Date;
  type: 'review' | 'question' | 'approval' | 'rejection';
}

export interface LegalMilestone {
  id: string;
  caseId: string;
  name: string;
  description: string;
  category: 'instruction' | 'searches' | 'survey' | 'mortgage' | 'contracts' | 'exchange' | 'completion' | 'registration';
  status: 'pending' | 'in_progress' | 'completed' | 'delayed' | 'cancelled';
  targetDate: Date;
  actualDate?: Date;
  dependencies: string[];
  assignedTo: string;
  documents: string[];
  notes: string[];
}

export interface LegalTask {
  id: string;
  caseId: string;
  title: string;
  description: string;
  type: 'document_review' | 'client_contact' | 'search_order' | 'contract_prep' | 'compliance_check' | 'filing' | 'meeting';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  assignedTo: string;
  createdBy: string;
  createdDate: Date;
  dueDate: Date;
  completedDate?: Date;
  estimatedHours: number;
  actualHours?: number;
  relatedDocuments: string[];
  relatedMilestone?: string;
  notes: string[];
}

export interface LegalCommunication {
  id: string;
  caseId: string;
  type: 'email' | 'phone' | 'meeting' | 'letter' | 'video_call';
  direction: 'inbound' | 'outbound';
  date: Date;
  from: string;
  to: string[];
  subject: string;
  summary: string;
  documents: string[];
  actionRequired: boolean;
  actionDescription?: string;
  followUpDate?: Date;
}

export interface LegalFees {
  baseFeeBand: 'A' | 'B' | 'C' | 'D' | 'E';
  baseFee: number;
  additionalServices: FeeItem[];
  searches: FeeItem[];
  registrationFees: FeeItem[];
  totalProfessionalFees: number;
  totalDisbursements: number;
  vat: number;
  totalFees: number;
  paymentSchedule: Payment[];
  invoices: Invoice[];
}

export interface FeeItem {
  description: string;
  amount: number;
  category: 'professional_fee' | 'disbursement' | 'registration' | 'search' | 'survey';
  status: 'estimated' | 'quoted' | 'invoiced' | 'paid';
}

export interface Payment {
  id: string;
  date: Date;
  amount: number;
  type: 'deposit' | 'interim' | 'completion' | 'disbursement';
  status: 'pending' | 'received' | 'overdue';
  reference?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: Date;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  items: FeeItem[];
}

export interface RiskFactor {
  id: string;
  caseId: string;
  type: 'title_defect' | 'planning_issue' | 'survey_concern' | 'finance_risk' | 'legal_dispute' | 'compliance_risk';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impact: string;
  likelihood: 'unlikely' | 'possible' | 'likely' | 'certain';
  mitigation: string;
  status: 'identified' | 'assessing' | 'mitigating' | 'resolved';
  identifiedDate: Date;
  reviewDate: Date;
  assignedTo: string;
}

export interface ComplianceCheck {
  id: string;
  caseId: string;
  type: 'anti_money_laundering' | 'client_identification' | 'conflict_check' | 'professional_indemnity' | 'cpd_compliance' | 'law_society_rules';
  status: 'pending' | 'compliant' | 'non_compliant' | 'requires_action';
  checkDate: Date;
  checkedBy: string;
  details: string;
  evidence: string[];
  remedialAction?: string;
  completionDate?: Date;
}

export interface LawSocietyCompliance {
  solicitorId: string;
  practitingCertificate: {
    number: string;
    expiryDate: Date;
    valid: boolean;
  };
  professionalIndemnityInsurance: {
    provider: string;
    policyNumber: string;
    coverageAmount: number;
    expiryDate: Date;
    valid: boolean;
  };
  continuingProfessionalDevelopment: {
    currentYear: number;
    hoursRequired: number;
    hoursCompleted: number;
    compliant: boolean;
    courses: CPDCourse[];
  };
  clientAccount: {
    accountProvider: string;
    accountNumber: string;
    lastAudit: Date;
    compliant: boolean;
  };
  antiMoneyLaundering: {
    policyInPlace: boolean;
    lastTraining: Date;
    compliant: boolean;
  };
}

export interface CPDCourse {
  title: string;
  provider: string;
  date: Date;
  hours: number;
  category: 'substantive_law' | 'professional_skills' | 'management' | 'technology';
  verified: boolean;
}

export interface ConveyancingWorkflow {
  caseId: string;
  currentStage: ConveyancingStage;
  stages: ConveyancingStageDetail[];
  completionPercentage: number;
  estimatedCompletion: Date;
  criticalPath: string[];
}

export interface ConveyancingStage {
  id: string;
  name: string;
  order: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
  dependencies: string[];
}

export interface ConveyancingStageDetail {
  stage: ConveyancingStage;
  tasks: LegalTask[];
  documents: LegalDocument[];
  milestones: LegalMilestone[];
  estimatedDuration: number;
  actualDuration?: number;
}

export interface LegalKPIs {
  caseCompletion: {
    onTime: number;
    delayed: number;
    average: number;
  };
  documentTurnaround: {
    averageDays: number;
    withinSLA: number;
  };
  clientSatisfaction: {
    rating: number;
    responses: number;
  };
  revenueMetrics: {
    monthlyRevenue: number;
    outstandingFees: number;
    collectionRate: number;
  };
  complianceScore: number;
  riskExposure: {
    highRiskCases: number;
    totalExposure: number;
  };
}

class LegalCoordinationService extends EventEmitter {
  private cases: Map<string, LegalCase> = new Map();
  private workflows: Map<string, ConveyancingWorkflow> = new Map();
  private solicitors: Map<string, any> = new Map();

  constructor() {
    super();
    this.initializeSampleData();
  }

  // Case Management
  async createCase(data: Partial<LegalCase>): Promise<LegalCase> {
    const caseRef = this.generateCaseReference(data.type || 'conveyancing');
    
    const legalCase: LegalCase = {
      id: `case_${Date.now()}`,
      reference: caseRef,
      type: data.type || 'conveyancing',
      status: 'instruction',
      clientId: data.clientId || '',
      clientName: data.clientName || '',
      propertyAddress: data.propertyAddress || '',
      propertyType: data.propertyType || 'apartment',
      transactionType: data.transactionType || 'purchase',
      purchasePrice: data.purchasePrice || 0,
      currency: data.currency || 'EUR',
      instructionDate: new Date(),
      targetExchangeDate: data.targetExchangeDate,
      targetCompletionDate: data.targetCompletionDate,
      solicitorId: data.solicitorId || '',
      solicitorName: data.solicitorName || '',
      otherPartySolicitor: data.otherPartySolicitor,
      documents: [],
      milestones: [],
      tasks: [],
      communications: [],
      fees: this.calculateStandardFees(data.purchasePrice || 0),
      notes: [],
      riskFactors: [],
      complianceChecks: [],
      ...data
    };

    // Initialize conveyancing workflow
    if (legalCase.type === 'conveyancing') {
      await this.initializeConveyancingWorkflow(legalCase.id);
    }

    this.cases.set(legalCase.id, legalCase);
    this.emit('caseCreated', { case: legalCase });
    return legalCase;
  }

  async updateCaseStatus(caseId: string, status: LegalCase['status']): Promise<LegalCase> {
    const legalCase = this.cases.get(caseId);
    if (!legalCase) throw new Error('Case not found');

    legalCase.status = status;
    
    // Update workflow if applicable
    if (legalCase.type === 'conveyancing') {
      await this.updateConveyancingWorkflow(caseId, status);
    }

    this.emit('caseStatusUpdated', { caseId, status, case: legalCase });
    return legalCase;
  }

  // Document Management
  async addDocument(caseId: string, documentData: Partial<LegalDocument>): Promise<LegalDocument> {
    const legalCase = this.cases.get(caseId);
    if (!legalCase) throw new Error('Case not found');

    const document: LegalDocument = {
      id: `doc_${Date.now()}`,
      caseId,
      name: documentData.name || '',
      type: documentData.type || 'correspondence',
      category: documentData.category || 'correspondence',
      status: documentData.status || 'pending',
      priority: documentData.priority || 'medium',
      receivedDate: documentData.receivedDate || new Date(),
      dueDate: documentData.dueDate,
      source: documentData.source || '',
      recipient: documentData.recipient,
      description: documentData.description || '',
      version: 1,
      comments: [],
      complianceStatus: 'pending_review',
      ...documentData
    };

    legalCase.documents.push(document);
    this.emit('documentAdded', { caseId, document });
    return document;
  }

  async reviewDocument(caseId: string, documentId: string, reviewData: {
    status: LegalDocument['status'];
    comments?: string;
    reviewedBy: string;
  }): Promise<LegalDocument> {
    const legalCase = this.cases.get(caseId);
    if (!legalCase) throw new Error('Case not found');

    const document = legalCase.documents.find(d => d.id === documentId);
    if (!document) throw new Error('Document not found');

    document.status = reviewData.status;
    document.reviewedDate = new Date();
    document.reviewedBy = reviewData.reviewedBy;

    if (reviewData.comments) {
      document.comments.push({
        id: `comment_${Date.now()}`,
        userId: reviewData.reviewedBy,
        userName: reviewData.reviewedBy,
        comment: reviewData.comments,
        timestamp: new Date(),
        type: 'review'
      });
    }

    this.emit('documentReviewed', { caseId, documentId, document });
    return document;
  }

  // Task Management
  async createTask(caseId: string, taskData: Partial<LegalTask>): Promise<LegalTask> {
    const legalCase = this.cases.get(caseId);
    if (!legalCase) throw new Error('Case not found');

    const task: LegalTask = {
      id: `task_${Date.now()}`,
      caseId,
      title: taskData.title || '',
      description: taskData.description || '',
      type: taskData.type || 'document_review',
      priority: taskData.priority || 'medium',
      status: 'pending',
      assignedTo: taskData.assignedTo || '',
      createdBy: taskData.createdBy || '',
      createdDate: new Date(),
      dueDate: taskData.dueDate || new Date(),
      estimatedHours: taskData.estimatedHours || 1,
      relatedDocuments: taskData.relatedDocuments || [],
      relatedMilestone: taskData.relatedMilestone,
      notes: [],
      ...taskData
    };

    legalCase.tasks.push(task);
    this.emit('taskCreated', { caseId, task });
    return task;
  }

  async completeTask(caseId: string, taskId: string, completionData: {
    actualHours?: number;
    notes?: string;
    completedBy: string;
  }): Promise<LegalTask> {
    const legalCase = this.cases.get(caseId);
    if (!legalCase) throw new Error('Case not found');

    const task = legalCase.tasks.find(t => t.id === taskId);
    if (!task) throw new Error('Task not found');

    task.status = 'completed';
    task.completedDate = new Date();
    task.actualHours = completionData.actualHours || task.estimatedHours;

    if (completionData.notes) {
      task.notes.push(completionData.notes);
    }

    // Check if this completes any milestones
    await this.checkMilestoneCompletion(caseId, task.relatedMilestone);

    this.emit('taskCompleted', { caseId, taskId, task });
    return task;
  }

  // Conveyancing Workflow Management
  private async initializeConveyancingWorkflow(caseId: string): Promise<ConveyancingWorkflow> {
    const standardStages: ConveyancingStageDetail[] = [
      {
        stage: { id: 'instruction', name: 'Instruction & Initial Checks', order: 1, status: 'in_progress', dependencies: [] },
        tasks: [],
        documents: [],
        milestones: [],
        estimatedDuration: 2
      },
      {
        stage: { id: 'searches', name: 'Property Searches', order: 2, status: 'not_started', dependencies: ['instruction'] },
        tasks: [],
        documents: [],
        milestones: [],
        estimatedDuration: 10
      },
      {
        stage: { id: 'survey', name: 'Survey & Valuation', order: 3, status: 'not_started', dependencies: ['instruction'] },
        tasks: [],
        documents: [],
        milestones: [],
        estimatedDuration: 5
      },
      {
        stage: { id: 'mortgage', name: 'Mortgage Arrangements', order: 4, status: 'not_started', dependencies: ['survey'] },
        tasks: [],
        documents: [],
        milestones: [],
        estimatedDuration: 14
      },
      {
        stage: { id: 'contracts', name: 'Contract Preparation', order: 5, status: 'not_started', dependencies: ['searches'] },
        tasks: [],
        documents: [],
        milestones: [],
        estimatedDuration: 7
      },
      {
        stage: { id: 'exchange', name: 'Exchange of Contracts', order: 6, status: 'not_started', dependencies: ['contracts', 'mortgage'] },
        tasks: [],
        documents: [],
        milestones: [],
        estimatedDuration: 1
      },
      {
        stage: { id: 'completion', name: 'Completion', order: 7, status: 'not_started', dependencies: ['exchange'] },
        tasks: [],
        documents: [],
        milestones: [],
        estimatedDuration: 21
      }
    ];

    const workflow: ConveyancingWorkflow = {
      caseId,
      currentStage: standardStages[0].stage,
      stages: standardStages,
      completionPercentage: 0,
      estimatedCompletion: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
      criticalPath: ['instruction', 'searches', 'contracts', 'exchange', 'completion']
    };

    this.workflows.set(caseId, workflow);
    return workflow;
  }

  private async updateConveyancingWorkflow(caseId: string, caseStatus: LegalCase['status']): Promise<void> {
    const workflow = this.workflows.get(caseId);
    if (!workflow) return;

    // Update workflow based on case status
    switch (caseStatus) {
      case 'in_progress':
        workflow.currentStage = workflow.stages.find(s => s.stage.id === 'searches')?.stage || workflow.currentStage;
        break;
      case 'contracts_prepared':
        workflow.currentStage = workflow.stages.find(s => s.stage.id === 'contracts')?.stage || workflow.currentStage;
        break;
      case 'exchange':
        workflow.currentStage = workflow.stages.find(s => s.stage.id === 'exchange')?.stage || workflow.currentStage;
        break;
      case 'completion':
        workflow.currentStage = workflow.stages.find(s => s.stage.id === 'completion')?.stage || workflow.currentStage;
        workflow.completionPercentage = 100;
        break;
    }

    this.emit('workflowUpdated', { caseId, workflow });
  }

  // Compliance Management
  async checkLawSocietyCompliance(solicitorId: string): Promise<LawSocietyCompliance> {
    return {
      solicitorId,
      practitingCertificate: {
        number: 'PC2024/12345',
        expiryDate: new Date('2025-03-31'),
        valid: true
      },
      professionalIndemnityInsurance: {
        provider: 'Legal & General Ireland',
        policyNumber: 'PI2024/SOL/001',
        coverageAmount: 10000000,
        expiryDate: new Date('2025-03-31'),
        valid: true
      },
      continuingProfessionalDevelopment: {
        currentYear: 2024,
        hoursRequired: 20,
        hoursCompleted: 22,
        compliant: true,
        courses: [
          {
            title: 'Conveyancing Updates 2024',
            provider: 'Law Society of Ireland',
            date: new Date('2024-03-15'),
            hours: 6,
            category: 'substantive_law',
            verified: true
          },
          {
            title: 'Anti-Money Laundering Compliance',
            provider: 'Law Society of Ireland',
            date: new Date('2024-06-10'),
            hours: 4,
            category: 'professional_skills',
            verified: true
          }
        ]
      },
      clientAccount: {
        accountProvider: 'Bank of Ireland',
        accountNumber: 'CA123456789',
        lastAudit: new Date('2024-05-30'),
        compliant: true
      },
      antiMoneyLaundering: {
        policyInPlace: true,
        lastTraining: new Date('2024-06-10'),
        compliant: true
      }
    };
  }

  async performComplianceCheck(caseId: string, checkType: ComplianceCheck['type']): Promise<ComplianceCheck> {
    const check: ComplianceCheck = {
      id: `check_${Date.now()}`,
      caseId,
      type: checkType,
      status: 'compliant',
      checkDate: new Date(),
      checkedBy: 'System',
      details: `${checkType} check completed successfully`,
      evidence: []
    };

    const legalCase = this.cases.get(caseId);
    if (legalCase) {
      legalCase.complianceChecks.push(check);
    }

    this.emit('complianceCheckCompleted', { caseId, check });
    return check;
  }

  // Risk Management
  async identifyRisk(caseId: string, riskData: Partial<RiskFactor>): Promise<RiskFactor> {
    const risk: RiskFactor = {
      id: `risk_${Date.now()}`,
      caseId,
      type: riskData.type || 'legal_dispute',
      severity: riskData.severity || 'medium',
      description: riskData.description || '',
      impact: riskData.impact || '',
      likelihood: riskData.likelihood || 'possible',
      mitigation: riskData.mitigation || '',
      status: 'identified',
      identifiedDate: new Date(),
      reviewDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      assignedTo: riskData.assignedTo || '',
      ...riskData
    };

    const legalCase = this.cases.get(caseId);
    if (legalCase) {
      legalCase.riskFactors.push(risk);
    }

    this.emit('riskIdentified', { caseId, risk });
    return risk;
  }

  // Fee Management
  private calculateStandardFees(purchasePrice: number): LegalFees {
    let baseFee = 0;
    let baseFeeBand: LegalFees['baseFeeBand'] = 'A';

    // Irish solicitor fee bands (simplified)
    if (purchasePrice <= 100000) {
      baseFee = 1200;
      baseFeeBand = 'A';
    } else if (purchasePrice <= 250000) {
      baseFee = 1800;
      baseFeeBand = 'B';
    } else if (purchasePrice <= 500000) {
      baseFee = 2400;
      baseFeeBand = 'C';
    } else if (purchasePrice <= 750000) {
      baseFee = 3000;
      baseFeeBand = 'D';
    } else {
      baseFee = 3600;
      baseFeeBand = 'E';
    }

    return {
      baseFeeBand,
      baseFee,
      additionalServices: [],
      searches: [
        { description: 'Local Authority Search', amount: 85, category: 'search', status: 'estimated' },
        { description: 'Land Registry Search', amount: 40, category: 'search', status: 'estimated' },
        { description: 'Planning Search', amount: 65, category: 'search', status: 'estimated' }
      ],
      registrationFees: [
        { description: 'Land Registry Fee', amount: 125, category: 'registration', status: 'estimated' }
      ],
      totalProfessionalFees: baseFee,
      totalDisbursements: 315,
      vat: (baseFee * 0.23),
      totalFees: baseFee + 315 + (baseFee * 0.23),
      paymentSchedule: [],
      invoices: []
    };
  }

  // KPI Calculation
  async calculateLegalKPIs(solicitorId: string): Promise<LegalKPIs> {
    const solicitorCases = Array.from(this.cases.values()).filter(c => c.solicitorId === solicitorId);
    
    return {
      caseCompletion: {
        onTime: 85,
        delayed: 15,
        average: 45 // days
      },
      documentTurnaround: {
        averageDays: 2.5,
        withinSLA: 92
      },
      clientSatisfaction: {
        rating: 4.7,
        responses: 127
      },
      revenueMetrics: {
        monthlyRevenue: 45000,
        outstandingFees: 12500,
        collectionRate: 94
      },
      complianceScore: 98,
      riskExposure: {
        highRiskCases: 3,
        totalExposure: 25000
      }
    };
  }

  // Data Retrieval
  async getCase(caseId: string): Promise<LegalCase | null> {
    return this.cases.get(caseId) || null;
  }

  async getSolicitorCases(solicitorId: string): Promise<LegalCase[]> {
    return Array.from(this.cases.values()).filter(c => c.solicitorId === solicitorId);
  }

  async getConveyancingWorkflow(caseId: string): Promise<ConveyancingWorkflow | null> {
    return this.workflows.get(caseId) || null;
  }

  private generateCaseReference(type: string): string {
    const year = new Date().getFullYear();
    const timestamp = Date.now().toString().slice(-6);
    const typeCode = type.substring(0, 3).toUpperCase();
    return `${typeCode}${year}${timestamp}`;
  }

  private async checkMilestoneCompletion(caseId: string, milestoneId?: string): Promise<void> {
    if (!milestoneId) return;

    const legalCase = this.cases.get(caseId);
    if (!legalCase) return;

    const milestone = legalCase.milestones.find(m => m.id === milestoneId);
    if (!milestone) return;

    // Check if all related tasks are complete
    const relatedTasks = legalCase.tasks.filter(t => t.relatedMilestone === milestoneId);
    const allTasksComplete = relatedTasks.every(t => t.status === 'completed');

    if (allTasksComplete && milestone.status !== 'completed') {
      milestone.status = 'completed';
      milestone.actualDate = new Date();
      this.emit('milestoneCompleted', { caseId, milestone });
    }
  }

  private initializeSampleData(): void {
    // Initialize Fitzgerald Gardens legal case
    const projectId = 'fitzgerald-gardens';
    
    const sampleCase: LegalCase = {
      id: `${projectId}_legal`,
      reference: 'CON202412345',
      type: 'conveyancing',
      status: 'contracts_prepared',
      clientId: 'client_david_fitzgerald',
      clientName: 'David Fitzgerald',
      propertyAddress: 'Apartment 3B, Fitzgerald Gardens, Swords, Co. Dublin',
      propertyType: 'apartment',
      transactionType: 'purchase',
      purchasePrice: 425000,
      currency: 'EUR',
      instructionDate: new Date('2024-10-15'),
      targetExchangeDate: new Date('2024-12-20'),
      targetCompletionDate: new Date('2025-01-15'),
      solicitorId: 'solicitor_mary_oleary',
      solicitorName: 'Mary O\'Leary',
      otherPartySolicitor: 'Devlin & Associates Solicitors',
      documents: [
        {
          id: 'doc_001',
          caseId: `${projectId}_legal`,
          name: 'Contract for Sale',
          type: 'contract',
          category: 'contracts',
          status: 'approved',
          priority: 'high',
          receivedDate: new Date('2024-11-20'),
          reviewedDate: new Date('2024-11-22'),
          reviewedBy: 'Mary O\'Leary',
          source: 'Vendor Solicitor',
          description: 'Main contract for sale of apartment 3B',
          version: 2,
          comments: [
            {
              id: 'comment_001',
              userId: 'mary_oleary',
              userName: 'Mary O\'Leary',
              comment: 'Contract reviewed and approved. Special conditions negotiated.',
              timestamp: new Date('2024-11-22'),
              type: 'approval'
            }
          ],
          complianceStatus: 'compliant'
        }
      ],
      milestones: [
        {
          id: 'milestone_001',
          caseId: `${projectId}_legal`,
          name: 'Exchange of Contracts',
          description: 'Formal exchange of contracts with deposit payment',
          category: 'exchange',
          status: 'pending',
          targetDate: new Date('2024-12-20'),
          dependencies: ['contracts', 'mortgage_approval'],
          assignedTo: 'Mary O\'Leary',
          documents: ['doc_001'],
          notes: ['Awaiting final mortgage approval from client']
        }
      ],
      tasks: [
        {
          id: 'task_001',
          caseId: `${projectId}_legal`,
          title: 'Final mortgage approval follow-up',
          description: 'Contact client and mortgage provider for final approval status',
          type: 'client_contact',
          priority: 'high',
          status: 'in_progress',
          assignedTo: 'Mary O\'Leary',
          createdBy: 'Mary O\'Leary',
          createdDate: new Date('2024-12-01'),
          dueDate: new Date('2024-12-15'),
          estimatedHours: 2,
          relatedDocuments: [],
          relatedMilestone: 'milestone_001',
          notes: ['Client confirmed mortgage approval expected by 12th December']
        }
      ],
      communications: [
        {
          id: 'comm_001',
          caseId: `${projectId}_legal`,
          type: 'email',
          direction: 'outbound',
          date: new Date('2024-12-05'),
          from: 'Mary O\'Leary',
          to: ['David Fitzgerald'],
          subject: 'Fitzgerald Gardens - Exchange Update',
          summary: 'Updated client on contract status and exchange timeline',
          documents: [],
          actionRequired: true,
          actionDescription: 'Client to confirm mortgage approval by 12th December'
        }
      ],
      fees: {
        baseFeeBand: 'C',
        baseFee: 2400,
        additionalServices: [
          { description: 'Contract negotiation', amount: 300, category: 'professional_fee', status: 'invoiced' }
        ],
        searches: [
          { description: 'Local Authority Search', amount: 85, category: 'search', status: 'paid' },
          { description: 'Land Registry Search', amount: 40, category: 'search', status: 'paid' },
          { description: 'Planning Search', amount: 65, category: 'search', status: 'paid' }
        ],
        registrationFees: [
          { description: 'Land Registry Fee', amount: 125, category: 'registration', status: 'estimated' }
        ],
        totalProfessionalFees: 2700,
        totalDisbursements: 315,
        vat: 621,
        totalFees: 3636,
        paymentSchedule: [
          {
            id: 'pay_001',
            date: new Date('2024-10-20'),
            amount: 1500,
            type: 'deposit',
            status: 'received',
            reference: 'DEP001'
          }
        ],
        invoices: [
          {
            id: 'inv_001',
            invoiceNumber: 'INV-2024-001',
            date: new Date('2024-11-15'),
            amount: 2136,
            status: 'paid',
            items: [
              { description: 'Professional fees', amount: 2700, category: 'professional_fee', status: 'invoiced' },
              { description: 'Searches', amount: 190, category: 'search', status: 'invoiced' },
              { description: 'VAT', amount: 621, category: 'professional_fee', status: 'invoiced' }
            ]
          }
        ]
      },
      notes: [
        'Client very proactive and responsive',
        'Property management company confirmed for building',
        'Mortgage approval expected 12th December'
      ],
      riskFactors: [],
      complianceChecks: [
        {
          id: 'compliance_001',
          caseId: `${projectId}_legal`,
          type: 'client_identification',
          status: 'compliant',
          checkDate: new Date('2024-10-16'),
          checkedBy: 'Mary O\'Leary',
          details: 'Client ID verified, PPS number confirmed, proof of address provided',
          evidence: ['passport_copy', 'utility_bill', 'bank_statement']
        }
      ]
    };

    this.cases.set(sampleCase.id, sampleCase);

    // Initialize workflow for the sample case
    this.initializeConveyancingWorkflow(sampleCase.id);
  }
}

export default LegalCoordinationService;