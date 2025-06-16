/**
 * Enterprise-level types matching the €25M Excel workbook structure
 * These interfaces mirror the 34 worksheets and 15 phases
 */

// Core Excel workbook structure types
export interface ExcelWorkbookStructure {
  sheets: {
    disclaimer: any;
    cover: ExecutiveSummary;
    inputs: MasterInputs;
    scenarios: ScenarioControl;
    generalInfo: GeneralInformation;
    revenueInputs: RevenueInputs;
    stack: ProjectStack;
    costInputs: CostInputs;
    flccPS: FLCCProfitShare;
    timings: ProjectTimings;
    cashFlows: CashFlowManagement;
    list: ConsolidatedList;
    phases: PhaseData[]; // 15 phases
    outputs: ConsolidatedOutputs;
    consolidatedCF: ConsolidatedCashFlow;
    changeLog: ChangeLog;
    groupFinance: GroupFinanceData[];
  };
}

// Financial Categories from Excel
export interface CostInputs {
  landCost: number;
  constructionCost: number;
  professionalFees: number;
  marketing: number;
  financeCosts: number;
  contingency: number;
  totalCosts: number;
}

export interface RevenueInputs {
  salesRevenue: number;
  rentalIncome: number;
  otherRevenue: number;
  totalRevenue: number;
}

export interface CashFlowMetrics {
  netCashFlow: number;
  cumulativeCashFlow: number;
  peakFunding: number;
  irr: number;
  npv: number;
  profitMargin: number;
}

// 15 Development Phases (matching Excel phases 1-15)
export interface PhaseData {
  id: number; // 1-15
  name: string;
  category: 'Pre-Development' | 'Design' | 'Construction' | 'Fit-Out' | 'Completion' | 'Sales' | 'Post-Completion';
  startDate: string;
  endDate: string;
  duration: number; // weeks
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed' | 'on-hold';
  progress: number; // 0-100%
  
  // Financial data per phase
  budgetAllocated: number;
  budgetSpent: number;
  budgetRemaining: number;
  actualCosts: number;
  forecastCosts: number;
  varianceToForecast: number;
  
  // Bills of Quantities
  boq: BillOfQuantities[];
  
  // Team assignments
  teamMembers: TeamPhaseAssignment[];
  contractors: ContractorPhaseAssignment[];
  
  // Progress tracking
  milestones: Milestone[];
  deliverables: Deliverable[];
  risks: Risk[];
  
  // S-curve data
  sCurveData: SCurvePoint[];
  
  // Dependencies
  dependsOn: number[]; // Other phase IDs
  criticalPath: boolean;
}

export interface BillOfQuantities {
  id: string;
  description: string;
  unit: string;
  quantity: number;
  rate: number;
  amount: number;
  category: string;
  subCategory: string;
  contractor?: string;
  status: 'pending' | 'approved' | 'completed';
  phaseId: number;
  workPackage: string;
}

export interface TeamPhaseAssignment {
  teamMemberId: string;
  phaseId: number;
  allocationPercentage: number; // % of time allocated to this phase
  role: string;
  hourlyRate: number;
  estimatedHours: number;
  actualHours: number;
  startDate: string;
  endDate: string;
  responsibilities: string[];
}

export interface ContractorPhaseAssignment {
  contractorId: string;
  phaseId: number;
  contractValue: number;
  workPackages: string[];
  startDate: string;
  endDate: string;
  paymentTerms: string;
  retentionPercentage: number;
  performanceBond: number;
  insuranceRequirements: string[];
  keyPersonnel: string[];
  sCurveProgress: number;
}

export interface SCurvePoint {
  date: string;
  plannedProgress: number;
  actualProgress: number;
  plannedCost: number;
  actualCost: number;
  cumulativePlannedCost: number;
  cumulativeActualCost: number;
  variance: number;
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  phaseId: number;
  targetDate: string;
  actualDate?: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed';
  criticalPath: boolean;
  dependencies: string[];
  assignedTo: string[];
}

export interface Deliverable {
  id: string;
  name: string;
  description: string;
  phaseId: number;
  type: 'document' | 'approval' | 'completion' | 'handover';
  dueDate: string;
  completedDate?: string;
  status: 'pending' | 'in-review' | 'approved' | 'completed';
  assignedTo: string;
  approvedBy?: string;
  documents: string[];
}

export interface Risk {
  id: string;
  description: string;
  phaseId: number;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  category: 'technical' | 'financial' | 'schedule' | 'regulatory' | 'market';
  mitigation: string;
  owner: string;
  status: 'open' | 'mitigated' | 'closed';
  dateIdentified: string;
  lastUpdated: string;
}

// Project Stack (matching Excel 'Stack' sheet)
export interface ProjectStack {
  id: string;
  name: string;
  description: string;
  totalBudget: number;
  totalSpent: number;
  totalForecast: number;
  startDate: string;
  endDate: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  phases: PhaseData[];
  overallProgress: number;
  
  // Financial summary
  landCost: number;
  constructionCost: number;
  softCosts: number;
  contingency: number;
  
  // Revenue projections
  grossSalesValue: number;
  netSalesValue: number;
  grossProfit: number;
  netProfit: number;
  profitMargin: number;
  
  // Cash flow
  peakFunding: number;
  currentCashPosition: number;
  projectedCashFlow: number[];
  
  // Team composition
  teamSize: number;
  contractorCount: number;
  keyPersonnel: string[];
  
  // Performance metrics
  schedulePerformanceIndex: number; // SPI
  costPerformanceIndex: number; // CPI
  estimateAtCompletion: number; // EAC
  varianceAtCompletion: number; // VAC
}

// External Appointment Management
export interface Appointment {
  id: string;
  title: string;
  description: string;
  type: 'design-review' | 'site-meeting' | 'client-meeting' | 'statutory-meeting' | 'inspection' | 'coordination';
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  
  // Attendees
  organizer: string;
  requiredAttendees: string[];
  optionalAttendees: string[];
  externalAttendees: ExternalAttendee[];
  
  // Project context
  projectId: string;
  phaseId?: number;
  relatedMilestones: string[];
  
  // Documentation
  agenda: string[];
  documents: string[];
  outcomes: string[];
  actionItems: ActionItem[];
  
  // Status
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  recurring: boolean;
  recurrencePattern?: string;
}

export interface ExternalAttendee {
  name: string;
  company: string;
  role: string;
  email: string;
  phone?: string;
  specialty: string;
}

export interface ActionItem {
  id: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: 'open' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

// Fee Proposal & Invoice Management
export interface FeeProposal {
  id: string;
  title: string;
  description: string;
  contractorId: string;
  projectId: string;
  phaseIds: number[];
  
  // Financial details
  proposedValue: number;
  originalBudget: number;
  variance: number;
  variancePercentage: number;
  
  // Breakdown
  workPackages: WorkPackage[];
  additionalCosts: AdditionalCost[];
  
  // Approval workflow
  submittedBy: string;
  submittedDate: string;
  reviewedBy?: string;
  reviewedDate?: string;
  approvedBy?: string;
  approvedDate?: string;
  status: 'draft' | 'submitted' | 'under-review' | 'approved' | 'rejected' | 'requires-clarification';
  
  // Comments and attachments
  comments: ProposalComment[];
  attachments: string[];
  
  // Terms
  paymentTerms: string;
  deliveryDate: string;
  validUntil: string;
  currency: string;
}

export interface WorkPackage {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  startDate: string;
  endDate: string;
  dependencies: string[];
}

export interface AdditionalCost {
  id: string;
  description: string;
  amount: number;
  category: 'material' | 'labor' | 'equipment' | 'overhead' | 'other';
  justification: string;
}

export interface ProposalComment {
  id: string;
  author: string;
  date: string;
  comment: string;
  type: 'review' | 'clarification' | 'approval' | 'rejection';
}

// Invoice Management
export interface Invoice {
  id: string;
  invoiceNumber: string;
  contractorId: string;
  projectId: string;
  phaseIds: number[];
  
  // Financial details
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  retentionAmount: number;
  
  // Line items
  lineItems: InvoiceLineItem[];
  
  // Dates
  invoiceDate: string;
  dueDate: string;
  paidDate?: string;
  
  // Status tracking
  status: 'draft' | 'sent' | 'received' | 'approved' | 'paid' | 'overdue' | 'disputed';
  approvalStatus: 'pending' | 'approved' | 'rejected';
  paymentStatus: 'pending' | 'processing' | 'paid' | 'failed';
  
  // References
  contractReference: string;
  purchaseOrderNumber?: string;
  workCompletedDate: string;
  
  // Documentation
  supportingDocuments: string[];
  certificationDocuments: string[];
  
  // Approval workflow
  submittedBy: string;
  approvedBy?: string;
  authorizedBy?: string;
  
  // Payment details
  paymentMethod: string;
  paymentReference?: string;
  bankDetails: BankDetails;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  workPackageId?: string;
  phaseId: number;
  completionPercentage: number;
}

export interface BankDetails {
  accountName: string;
  accountNumber: string;
  sortCode: string;
  iban: string;
  bic: string;
  bankName: string;
}

// Monthly Invoice Tracking
export interface MonthlyInvoiceSummary {
  month: string;
  year: number;
  totalInvoiced: number;
  totalPaid: number;
  totalOutstanding: number;
  averagePaymentDays: number;
  invoiceCount: number;
  overdueCount: number;
  
  // By contractor
  contractorSummaries: ContractorInvoiceSummary[];
  
  // By phase
  phaseSummaries: PhaseInvoiceSummary[];
}

export interface ContractorInvoiceSummary {
  contractorId: string;
  contractorName: string;
  totalInvoiced: number;
  totalPaid: number;
  outstandingAmount: number;
  invoiceCount: number;
  averagePaymentDays: number;
  complianceStatus: 'compliant' | 'warning' | 'overdue';
}

export interface PhaseInvoiceSummary {
  phaseId: number;
  phaseName: string;
  budgetAllocated: number;
  totalInvoiced: number;
  percentageOfBudget: number;
  remainingBudget: number;
  forecastToComplete: number;
}

// Executive Summary (Cover sheet)
export interface ExecutiveSummary {
  projectName: string;
  totalDevelopmentValue: number;
  totalDevelopmentCost: number;
  grossProfit: number;
  profitMargin: number;
  peakFunding: number;
  developmentPeriod: string;
  unitCount: number;
  averageUnitPrice: number;
  keyMetrics: KeyMetric[];
  executiveHighlights: string[];
}

export interface KeyMetric {
  name: string;
  value: number | string;
  unit: string;
  variance?: number;
  trend: 'up' | 'down' | 'stable';
}

// Other supporting interfaces
export interface MasterInputs {
  projectParameters: any;
  economicAssumptions: any;
  marketConditions: any;
}

export interface ScenarioControl {
  scenarios: any[];
  currentScenario: string;
  sensitivityAnalysis: any;
}

export interface GeneralInformation {
  projectDetails: any;
  siteInformation: any;
  planningDetails: any;
}

export interface FLCCProfitShare {
  firstLossCapital: number;
  profitShare: any;
  waterfallStructure: any;
}

export interface ProjectTimings {
  masterSchedule: any;
  criticalPath: any;
  milestoneSchedule: any;
}

export interface CashFlowManagement {
  cashFlowProjections: any;
  fundingRequirements: any;
  drawdownSchedule: any;
}

export interface ConsolidatedList {
  allItems: any[];
  summaries: any;
}

export interface ConsolidatedOutputs {
  financialSummary: any;
  performanceMetrics: any;
  dashboardData: any;
}

export interface ConsolidatedCashFlow {
  monthlyCashFlow: any[];
  cumulativeCashFlow: any[];
  fundingProfile: any;
}

export interface ChangeLog {
  changes: ChangeLogEntry[];
}

export interface ChangeLogEntry {
  date: string;
  author: string;
  description: string;
  version: string;
  impact: string;
}

export interface GroupFinanceData {
  groupLevel: string;
  financialData: any;
  consolidatedView: any;
}