/**
 * Project Bible Data Types
 * Comprehensive type definitions for the Project Bible system
 * 
 * @fileoverview Types for project documentation, SOAs, roadmaps, and comprehensive project management
 * @version 2.0.0
 */

export interface ProjectBibleData {
  projectId: string;
  lastUpdated: Date;
  version: string;
  summary: ProjectBibleSummary;
  scheduleOfAccommodations: ScheduleOfAccommodations;
  programmeRoadmap: ProjectProgramme;
  milestoneChecklist: MilestoneChecklist;
  appointmentsAndFees: AppointmentsAndFees;
  salesTracker: SalesTracker;
  teamStructure: ProjectTeamStructure;
  documentLibrary: DocumentLibrary;
}

// =============================================================================
// PROJECT SUMMARY
// =============================================================================

export interface ProjectBibleSummary {
  executiveSummary: {
    projectVision: string;
    keyObjectives: string[];
    successMetrics: ProjectKPI[];
    riskAssessment: RiskFactor[];
  };
  commercialOverview: {
    totalInvestment: number;
    projectedRevenue: number;
    expectedROI: number;
    marketPositioning: string;
    competitiveAdvantage: string[];
  };
  technicalSpecifications: {
    developmentType: 'residential' | 'commercial' | 'mixed-use' | 'hospitality';
    constructionMethod: string;
    sustainabilityRating: string;
    planningReference: string;
    buildingRegulations: string[];
  };
  locationAnalysis: {
    address: string;
    coordinates: { lat: number; lng: number };
    proximityFactors: ProximityFactor[];
    transportLinks: TransportLink[];
    amenities: LocalAmenity[];
  };
}

export interface ProjectKPI {
  id: string;
  name: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  category: 'financial' | 'operational' | 'quality' | 'timeline';
  isOnTrack: boolean;
}

export interface RiskFactor {
  id: string;
  category: 'financial' | 'technical' | 'regulatory' | 'market' | 'operational';
  description: string;
  probability: number; // 1-5 scale
  impact: number; // 1-5 scale
  riskScore: number; // probability * impact
  mitigationStrategy: string;
  owner: string;
  status: 'open' | 'mitigated' | 'closed';
}

export interface ProximityFactor {
  type: 'school' | 'hospital' | 'transport' | 'retail' | 'employment';
  name: string;
  distance: number; // in meters
  rating: number; // 1-5 stars
}

export interface TransportLink {
  type: 'bus' | 'rail' | 'metro' | 'airport' | 'motorway';
  name: string;
  distance: number;
  frequency?: string;
}

export interface LocalAmenity {
  type: 'retail' | 'dining' | 'recreation' | 'healthcare' | 'education';
  name: string;
  distance: number;
  rating: number;
}

// =============================================================================
// SCHEDULE OF ACCOMMODATIONS (SOA)
// =============================================================================

export interface ScheduleOfAccommodations {
  lastUpdated: Date;
  unitSchedules: UnitSchedule[];
  commonAreas: CommonAreaSchedule[];
  servicesSchedule: ServicesSpecification[];
  totalAreas: {
    grossInternalArea: number;
    netInternalArea: number;
    externalArea: number;
    totalSiteArea: number;
  };
  complianceChecklist: ComplianceItem[];
}

export interface UnitSchedule {
  unitId: string;
  unitType: string;
  floor: number;
  orientation: string;
  roomSchedule: RoomSpecification[];
  totalAreas: {
    gross: number;
    net: number;
    balcony?: number;
    terrace?: number;
    garden?: number;
  };
  finishSchedule: FinishSpecification[];
  fixtures: FixtureSpecification[];
  services: ServiceSpecification[];
  complianceNotes: string[];
  accessibility: AccessibilityFeature[];
}

export interface RoomSpecification {
  roomId: string;
  roomType: 'bedroom' | 'bathroom' | 'kitchen' | 'living' | 'dining' | 'utility' | 'storage' | 'hallway';
  roomName: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    area: number;
  };
  features: string[];
  windows: WindowSpecification[];
  doors: DoorSpecification[];
  electricalPoints: ElectricalPoint[];
  plumbingPoints: PlumbingPoint[];
}

export interface FinishSpecification {
  element: 'floor' | 'wall' | 'ceiling' | 'skirting' | 'architrave';
  roomTypes: string[];
  material: string;
  finish: string;
  color: string;
  supplier: string;
  cost: number;
  installation: string;
}

export interface FixtureSpecification {
  category: 'kitchen' | 'bathroom' | 'lighting' | 'hardware';
  item: string;
  specification: string;
  supplier: string;
  model: string;
  cost: number;
  installation: string;
  warranty: string;
}

export interface ServiceSpecification {
  service: 'electrical' | 'plumbing' | 'heating' | 'ventilation' | 'security' | 'communications';
  specification: string;
  capacity: string;
  supplier: string;
  installation: string;
  certification: string[];
}

export interface WindowSpecification {
  type: string;
  dimensions: { width: number; height: number };
  material: string;
  glazing: string;
  hardware: string;
}

export interface DoorSpecification {
  type: string;
  dimensions: { width: number; height: number };
  material: string;
  finish: string;
  hardware: string;
  security: string;
}

export interface ElectricalPoint {
  type: 'socket' | 'switch' | 'light' | 'data' | 'tv' | 'security';
  location: string;
  specification: string;
}

export interface PlumbingPoint {
  type: 'water' | 'waste' | 'heating' | 'gas';
  location: string;
  specification: string;
}

export interface CommonAreaSchedule {
  areaId: string;
  areaName: string;
  areaType: 'entrance' | 'corridor' | 'stair' | 'lift' | 'parking' | 'amenity' | 'plant' | 'refuse';
  floor: number;
  area: number;
  capacity?: number;
  finishSchedule: FinishSpecification[];
  services: ServiceSpecification[];
  accessibility: AccessibilityFeature[];
  maintenance: MaintenanceSchedule[];
}

export interface AccessibilityFeature {
  feature: string;
  compliance: string;
  notes: string;
}

export interface ComplianceItem {
  category: 'building-regulations' | 'planning' | 'fire-safety' | 'accessibility' | 'energy';
  requirement: string;
  status: 'compliant' | 'non-compliant' | 'pending-approval';
  evidence: string;
  notes: string;
}

// =============================================================================
// PROGRAMME ROADMAP
// =============================================================================

export interface ProjectProgramme {
  lastUpdated: Date;
  overallTimeline: {
    projectStart: Date;
    plannedCompletion: Date;
    actualCompletion?: Date;
    totalDuration: number; // in weeks
  };
  phases: ProjectPhase[];
  criticalPath: CriticalPathItem[];
  resourceAllocation: ResourcePlan[];
  riskMitigation: RiskMitigationPlan[];
  dependencies: ProjectDependency[];
}

export interface ProjectPhase {
  phaseId: string;
  phaseName: string;
  description: string;
  startDate: Date;
  endDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  duration: number; // in weeks
  progress: number; // percentage
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed' | 'on-hold';
  dependencies: string[]; // phase IDs
  criticalPath: boolean;
  milestones: PhaseMilestone[];
  tasks: ProjectTask[];
  resources: PhaseResource[];
  costs: {
    budgeted: number;
    actual: number;
    variance: number;
  };
}

export interface PhaseMilestone {
  milestoneId: string;
  name: string;
  description: string;
  dueDate: Date;
  actualDate?: Date;
  status: 'pending' | 'achieved' | 'delayed' | 'cancelled';
  criticalPath: boolean;
  dependencies: string[];
  deliverables: Deliverable[];
  approvals: ApprovalRequired[];
}

export interface ProjectTask {
  taskId: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  duration: number; // in days
  progress: number; // percentage
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed';
  assignedTo: string;
  dependencies: string[];
  deliverables: string[];
  cost: number;
}

export interface Deliverable {
  deliverableId: string;
  name: string;
  description: string;
  type: 'document' | 'approval' | 'physical' | 'digital';
  dueDate: Date;
  status: 'pending' | 'submitted' | 'approved' | 'rejected';
  owner: string;
  reviewers: string[];
}

export interface ApprovalRequired {
  approvalId: string;
  name: string;
  authority: string;
  submissionDate?: Date;
  approvalDate?: Date;
  status: 'not-submitted' | 'submitted' | 'approved' | 'rejected' | 'conditional';
  conditions: string[];
  documents: string[];
}

export interface CriticalPathItem {
  itemId: string;
  type: 'phase' | 'milestone' | 'task';
  name: string;
  startDate: Date;
  endDate: Date;
  float: number; // in days
  predecessors: string[];
  successors: string[];
}

export interface ResourcePlan {
  resourceId: string;
  resourceType: 'personnel' | 'equipment' | 'material' | 'subcontractor';
  name: string;
  capacity: number;
  allocation: ResourceAllocation[];
  cost: {
    hourly?: number;
    daily?: number;
    total: number;
  };
}

export interface ResourceAllocation {
  phaseId: string;
  startDate: Date;
  endDate: Date;
  allocation: number; // percentage or quantity
  cost: number;
}

export interface RiskMitigationPlan {
  riskId: string;
  riskDescription: string;
  category: 'schedule' | 'cost' | 'quality' | 'safety' | 'regulatory';
  probability: number;
  impact: number;
  mitigationActions: MitigationAction[];
  contingencyPlan: string;
  owner: string;
  status: 'active' | 'mitigated' | 'occurred' | 'cancelled';
}

export interface MitigationAction {
  actionId: string;
  description: string;
  owner: string;
  dueDate: Date;
  status: 'pending' | 'in-progress' | 'completed';
  cost: number;
}

export interface ProjectDependency {
  dependencyId: string;
  type: 'finish-to-start' | 'start-to-start' | 'finish-to-finish' | 'start-to-finish';
  predecessor: string;
  successor: string;
  lag: number; // in days
  constraint: string;
}

// =============================================================================
// MILESTONE CHECKLIST
// =============================================================================

export interface MilestoneChecklist {
  lastUpdated: Date;
  categories: MilestoneCategory[];
  overallProgress: number;
  criticalMilestones: string[];
  upcomingDeadlines: UpcomingDeadline[];
}

export interface MilestoneCategory {
  categoryId: string;
  name: string;
  description: string;
  milestones: ChecklistMilestone[];
  progress: number;
}

export interface ChecklistMilestone {
  milestoneId: string;
  name: string;
  description: string;
  category: string;
  dueDate: Date;
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  checklist: ChecklistItem[];
  approvals: ApprovalRequired[];
  documents: DocumentReference[];
  dependencies: string[];
  owner: string;
  progress: number;
  notes: string;
}

export interface ChecklistItem {
  itemId: string;
  description: string;
  status: 'pending' | 'completed' | 'not-applicable';
  completedDate?: Date;
  completedBy?: string;
  evidence?: string;
  notes?: string;
}

export interface UpcomingDeadline {
  milestoneId: string;
  name: string;
  dueDate: Date;
  daysUntilDue: number;
  status: 'on-track' | 'at-risk' | 'overdue';
  owner: string;
}

// =============================================================================
// APPOINTMENTS AND FEES
// =============================================================================

export interface AppointmentsAndFees {
  lastUpdated: Date;
  professionalAppointments: ProfessionalAppointment[];
  feeProposals: FeeProposal[];
  invoices: ProjectInvoice[];
  contracts: ProfessionalContract[];
  totalFees: {
    budgeted: number;
    committed: number;
    paid: number;
    outstanding: number;
  };
}

export interface ProfessionalAppointment {
  appointmentId: string;
  discipline: 'architect' | 'engineer-structural' | 'engineer-services' | 'quantity-surveyor' | 'planning-consultant' | 'project-manager' | 'contractor' | 'legal' | 'other';
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  scope: string[];
  appointmentDate: Date;
  contractValue: number;
  feeStructure: 'fixed' | 'percentage' | 'time-based' | 'hybrid';
  paymentTerms: string;
  keyPersonnel: KeyPersonnel[];
  qualifications: string[];
  insurance: InsuranceDetails;
  status: 'proposed' | 'appointed' | 'contracted' | 'active' | 'completed' | 'terminated';
}

export interface KeyPersonnel {
  name: string;
  role: string;
  qualifications: string[];
  experience: number; // years
  allocation: number; // percentage
}

export interface InsuranceDetails {
  professionalIndemnity: number;
  publicLiability: number;
  employersLiability: number;
  expiryDate: Date;
  insurer: string;
}

export interface FeeProposal {
  proposalId: string;
  appointmentId: string;
  discipline: string;
  companyName: string;
  submissionDate: Date;
  scope: string[];
  feeBreakdown: FeeBreakdownItem[];
  totalFee: number;
  programme: string;
  assumptions: string[];
  exclusions: string[];
  status: 'submitted' | 'under-review' | 'approved' | 'rejected' | 'withdrawn';
  evaluationCriteria: EvaluationCriteria;
  score?: number;
}

export interface FeeBreakdownItem {
  phase: string;
  description: string;
  fee: number;
  percentage?: number;
  hours?: number;
  rate?: number;
}

export interface EvaluationCriteria {
  technical: number;
  commercial: number;
  experience: number;
  resources: number;
  programme: number;
  totalScore: number;
}

export interface ProfessionalContract {
  contractId: string;
  appointmentId: string;
  contractType: string;
  signedDate: Date;
  startDate: Date;
  completionDate: Date;
  value: number;
  paymentSchedule: PaymentMilestone[];
  keyTerms: string[];
  variations: ContractVariation[];
  status: 'draft' | 'signed' | 'active' | 'completed' | 'terminated';
}

export interface PaymentMilestone {
  milestoneId: string;
  description: string;
  percentage: number;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'due' | 'paid' | 'overdue';
}

export interface ContractVariation {
  variationId: string;
  description: string;
  value: number;
  approvedDate: Date;
  reason: string;
}

export interface ProjectInvoice {
  invoiceId: string;
  appointmentId: string;
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  amount: number;
  vat: number;
  total: number;
  period: string;
  description: string[];
  status: 'draft' | 'issued' | 'paid' | 'overdue' | 'disputed';
  paymentDate?: Date;
}

// =============================================================================
// SALES TRACKER
// =============================================================================

export interface SalesTracker {
  lastUpdated: Date;
  summary: SalesSummary;
  unitSales: UnitSale[];
  salesPipeline: SalesPipelineItem[];
  marketingCampaigns: MarketingCampaign[];
  leadGeneration: LeadGenerationSource[];
  salesTargets: SalesTarget[];
  performanceMetrics: SalesMetrics;
}

export interface SalesSummary {
  totalUnits: number;
  soldUnits: number;
  reservedUnits: number;
  availableUnits: number;
  totalRevenue: number;
  averageSellingPrice: number;
  salesVelocity: number; // units per month
  absorptionRate: number; // percentage per month
  completionRate: number; // percentage
}

export interface UnitSale {
  saleId: string;
  unitId: string;
  unitType: string;
  floor: number;
  sellingPrice: number;
  deposit: number;
  saleDate: Date;
  completionDate?: Date;
  buyer: BuyerDetails;
  solicitor: SolicitorDetails;
  mortgage: MortgageDetails;
  saleStatus: 'reserved' | 'sale-agreed' | 'contracts-signed' | 'completed' | 'withdrawn';
  salesAgent: string;
  commission: number;
  notes: string;
}

export interface BuyerDetails {
  buyerId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  occupation: string;
  financing: 'cash' | 'mortgage' | 'help-to-buy' | 'mixed';
  firstTimeBuyer: boolean;
  referralSource: string;
}

export interface SolicitorDetails {
  firm: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
}

export interface MortgageDetails {
  lender?: string;
  broker?: string;
  amount?: number;
  approved: boolean;
  approvalDate?: Date;
  loanToValue?: number;
}

export interface SalesPipelineItem {
  pipelineId: string;
  unitId: string;
  prospectName: string;
  contactDetails: ContactDetails;
  inquiryDate: Date;
  stage: 'inquiry' | 'viewing' | 'offer' | 'negotiation' | 'sale-agreed' | 'withdrawn';
  probability: number; // percentage
  expectedCloseDate: Date;
  offerAmount?: number;
  salesAgent: string;
  lastContact: Date;
  nextAction: string;
  notes: string;
}

export interface ContactDetails {
  email: string;
  phone: string;
  preferredContact: 'email' | 'phone' | 'text';
  address?: string;
}

export interface MarketingCampaign {
  campaignId: string;
  name: string;
  type: 'digital' | 'print' | 'outdoor' | 'radio' | 'tv' | 'event' | 'pr';
  startDate: Date;
  endDate: Date;
  budget: number;
  spend: number;
  leads: number;
  conversions: number;
  roi: number;
  targetAudience: string;
  channels: string[];
  creatives: string[];
  performance: CampaignMetrics;
}

export interface CampaignMetrics {
  impressions: number;
  clicks: number;
  ctr: number; // click-through rate
  cpm: number; // cost per mille
  cpc: number; // cost per click
  cpl: number; // cost per lead
  conversionRate: number;
}

export interface LeadGenerationSource {
  source: string;
  leads: number;
  conversions: number;
  conversionRate: number;
  cost: number;
  cpl: number; // cost per lead
  quality: 'high' | 'medium' | 'low';
}

export interface SalesTarget {
  month: string;
  targetUnits: number;
  actualUnits: number;
  targetRevenue: number;
  actualRevenue: number;
  variance: number;
  onTrack: boolean;
}

export interface SalesMetrics {
  monthlyVelocity: MonthlyVelocity[];
  priceAnalysis: PriceAnalysis;
  buyerProfiles: BuyerProfileAnalysis[];
  conversionFunnel: ConversionFunnel;
}

export interface MonthlyVelocity {
  month: string;
  sales: number;
  reservations: number;
  viewings: number;
  inquiries: number;
}

export interface PriceAnalysis {
  averagePricePerSqFt: number;
  priceGrowth: number; // percentage
  priceVariance: number;
  competitorComparison: CompetitorPricing[];
}

export interface CompetitorPricing {
  competitor: string;
  averagePrice: number;
  pricePerSqFt: number;
  premiumDiscount: number; // vs our project
}

export interface BuyerProfileAnalysis {
  segment: string;
  percentage: number;
  averageBudget: number;
  conversionRate: number;
  timeToDecision: number; // days
}

export interface ConversionFunnel {
  inquiry: number;
  viewing: number;
  offer: number;
  saleAgreed: number;
  completed: number;
  conversionRates: {
    inquiryToViewing: number;
    viewingToOffer: number;
    offerToSale: number;
    saleToCompletion: number;
  };
}

// =============================================================================
// TEAM STRUCTURE
// =============================================================================

export interface ProjectTeamStructure {
  lastUpdated: Date;
  projectManager: TeamMember;
  coreTeam: TeamMember[];
  consultants: ConsultantTeam[];
  contractors: ContractorTeam[];
  organogram: TeamOrganogram;
  responsibilities: ResponsibilityMatrix[];
  communications: CommunicationPlan;
}

export interface TeamMember {
  memberId: string;
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  responsibilities: string[];
  reportingTo?: string;
  directReports: string[];
  skills: string[];
  availability: number; // percentage
  startDate: Date;
  endDate?: Date;
  performance: PerformanceMetrics;
}

export interface ConsultantTeam {
  discipline: string;
  lead: TeamMember;
  team: TeamMember[];
  scope: string[];
  deliverables: string[];
  programme: ConsultantProgramme[];
}

export interface ContractorTeam {
  trade: string;
  contractor: string;
  supervisor: TeamMember;
  operatives: TeamMember[];
  subcontractors: string[];
  programme: ContractorProgramme[];
}

export interface TeamOrganogram {
  levels: OrgLevel[];
  relationships: OrgRelationship[];
}

export interface OrgLevel {
  level: number;
  roles: string[];
}

export interface OrgRelationship {
  from: string;
  to: string;
  type: 'reports-to' | 'coordinates-with' | 'supports';
}

export interface ResponsibilityMatrix {
  task: string;
  responsible: string;
  accountable: string;
  consulted: string[];
  informed: string[];
}

export interface CommunicationPlan {
  meetings: MeetingSchedule[];
  reports: ReportSchedule[];
  escalationProcedure: EscalationLevel[];
}

export interface MeetingSchedule {
  type: string;
  frequency: string;
  attendees: string[];
  agenda: string[];
  duration: number; // minutes
}

export interface ReportSchedule {
  reportType: string;
  frequency: string;
  recipients: string[];
  format: string;
  dueDate: string;
}

export interface EscalationLevel {
  level: number;
  issues: string[];
  escalateTo: string;
  timeframe: string; // e.g., "24 hours"
}

export interface ConsultantProgramme {
  phase: string;
  startDate: Date;
  endDate: Date;
  deliverables: string[];
  milestones: string[];
}

export interface ContractorProgramme {
  phase: string;
  startDate: Date;
  endDate: Date;
  activities: string[];
  milestones: string[];
  dependencies: string[];
}

export interface PerformanceMetrics {
  qualityScore: number;
  timelinessScore: number;
  communicationScore: number;
  overallScore: number;
  feedback: string[];
}

export interface MaintenanceSchedule {
  activity: string;
  frequency: string;
  lastCompleted?: Date;
  nextDue: Date;
  cost: number;
}

// =============================================================================
// DOCUMENT LIBRARY
// =============================================================================

export interface DocumentLibrary {
  lastUpdated: Date;
  categories: DocumentCategory[];
  totalDocuments: number;
  recentUploads: DocumentReference[];
  pendingApprovals: DocumentReference[];
}

export interface DocumentCategory {
  categoryId: string;
  name: string;
  description: string;
  documents: DocumentReference[];
  subcategories: DocumentCategory[];
}

export interface DocumentReference {
  documentId: string;
  title: string;
  description: string;
  type: 'pdf' | 'dwg' | 'docx' | 'xlsx' | 'image' | 'other';
  category: string;
  version: string;
  uploadDate: Date;
  uploadedBy: string;
  fileSize: number;
  filePath: string;
  tags: string[];
  status: 'draft' | 'review' | 'approved' | 'superseded' | 'archived';
  approvals: DocumentApproval[];
  relatedDocuments: string[];
  isConfidential: boolean;
}

export interface DocumentApproval {
  approver: string;
  approvalDate?: Date;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

export type ProjectStatus = 'planning' | 'pre-construction' | 'construction' | 'completion' | 'closed';
export type UnitStatus = 'available' | 'reserved' | 'sold' | 'completed';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'conditional';
export type TaskStatus = 'not-started' | 'in-progress' | 'completed' | 'delayed' | 'cancelled';

// =============================================================================
// EXPORT INTERFACES
// =============================================================================

export interface ProjectBibleExport {
  format: 'pdf' | 'excel' | 'word' | 'json';
  sections: string[];
  includeGraphics: boolean;
  includeRawData: boolean;
  confidentialityLevel: 'public' | 'commercial' | 'confidential';
  watermark?: string;
}

export interface DocumentTemplate {
  templateId: string;
  name: string;
  description: string;
  sections: TemplateSection[];
  variables: TemplateVariable[];
  formatting: TemplateFormatting;
}

export interface TemplateSection {
  sectionId: string;
  name: string;
  order: number;
  required: boolean;
  dataSource: string;
  format: 'table' | 'chart' | 'text' | 'image';
}

export interface TemplateVariable {
  variableId: string;
  name: string;
  dataType: 'string' | 'number' | 'date' | 'boolean';
  source: string;
  defaultValue?: any;
}

export interface TemplateFormatting {
  pageSize: 'A4' | 'A3' | 'Letter';
  orientation: 'portrait' | 'landscape';
  margins: { top: number; right: number; bottom: number; left: number };
  fonts: { heading: string; body: string; caption: string };
  colors: { primary: string; secondary: string; accent: string };
  logo?: string;
}