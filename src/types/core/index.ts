/**
 * PropIE Core Data Models
 * Export all core data model interfaces and types from a single location
 */

// Document types
export * from '../document';
export type * from '../document';

// User management
export * from './user';
export type * from './user';

// Location and Geography
export * from './location';
export type * from './location';

// Development model (export directly to avoid ambiguity)
export {
  calculateProfitMargin
} from './development';

// Export types with the 'export type' syntax for isolatedModules
export type {
  Development,
  DevelopmentStatus,
  ProfessionalTeamMember,
  Task,
  TaskStatus,
  TaskPriority,
  TaskComment,
  MarketingStatus,
  MarketingCampaign,
  CampaignPerformance,
  SalesStatus,
  ConstructionStatus,
  ConstructionStage,
  Inspection,
  InspectionType,
  InspectionStatus,
  ComplianceStatus,
  ComplianceItem,
  ComplianceItemStatus,
  Bond,
  BondType,
  BondStatus,
  Levy,
  LevyType,
  LevyStatus,
  BuildingSpecifications,
  DevelopmentFinancials,
  ConstructionCosts,
  ProfessionalFees,
  CashFlowItem
} from './development';

// Avoid re-exporting the ambiguous types from professional
export {
  hasProfessionalSpecialization,
  isProfessionalAvailable,
  getUserProfessionalRoles
} from './professional';

// Export types with the 'export type' syntax for isolatedModules
export type {
  Professional,
  ProfessionalStatus,
  ProfessionalSpecialization,
  Company,
  ServiceArea,
  Qualification,
  InsuranceDetails,
  ProfessionalAppointment,
  // Re-export this with a more specific name to avoid ambiguity
  ProfessionalRole as ProfTeamRole,
  // Re-export with a more specific name
  AppointmentStatus as ProfAppointmentStatus,
  FeeStructure,
  FeeType,
  PaymentMilestone,
  ProfessionalAssignment,
  AssignmentStatus,
  ProfessionalReview
} from './professional';

// Units
export * from './unit';
export type * from './unit';

// Sales process
export * from './sales';
export type * from './sales';

// Document management - avoid ambiguous re-exports
export {
  getDefaultWorkflow,
  createSaleDocumentPackage,
  createDevelopmentDocument
} from './document';

// Export types with the 'export type' syntax for isolatedModules
export type {
  DocumentWorkflow,
  DocumentWorkflowStage,
  ApproverConfig,
  DocumentCustomField,
  DocumentWorkflowInstance,
  DocumentWorkflowHistory,
  DocumentApproval,
  // Rename to avoid ambiguity
  DocumentTemplate as DocTemplate,
  TemplateVariable,
  DocumentGeneration,
  DocumentRelatedEntity,
  DocumentPackage,
  DocumentPackageStatus,
  DocumentActivity,
  DocumentActivityType,
  DocumentRetentionPolicy,
  DocumentSignature,
  SignaturePosition,
  DocumentVersion,
  DocumentCategoryTypeMapping
} from './document';

// Financial models
export * from './financial';
export type * from './financial';

// Project management - avoid ambiguous re-exports
export {
  calculateScheduleVariance,
  calculateRiskScore,
  identifyCriticalPath
} from './project';

// Export types with the 'export type' syntax for isolatedModules
export type {
  Project,
  ProjectStatus,
  // Rename to avoid ambiguity
  ProjectTimeline as ProjTimeline,
  ProjectTeam,
  ProjectPhase,
  PhaseStatus,
  // Rename to avoid ambiguity
  ProjectMilestone as ProjMilestone,
  // Rename to avoid ambiguity
  MilestoneStatus as ProjMilestoneStatus,
  // Rename to avoid ambiguity with development module
  ProjectTask,
  // These are already renamed in the import above
  // TaskStatus,
  // TaskPriority,
  // TaskComment,
  ProjectRisk,
  RiskCategory,
  RiskProbability,
  RiskImpact,
  RiskStatus,
  ProjectIssue,
  IssueCategory,
  IssueSeverity,
  IssueStatus,
  IssueComment,
  ConstructionLog,
  // Inspection is already exported from development
  // InspectionType is already exported from development
  // InspectionStatus is already exported from development
  InspectionResult,
  InspectionFinding,
  ProjectUpdate,
  UpdateType,
  Meeting,
  MeetingType,
  AgendaItem,
  MeetingMinutes,
  MeetingActionItem,
  ComplianceChecklist,
  // ComplianceItem is already exported from development
  HealthAndSafetyPlan,
  EmergencyContact,
  SafetyInspection,
  SafetyIncident,
  TrainingRecord,
  ToolboxTalk
} from './project';

// Investor models
export * from './investor';
export type * from './investor';

// Marketing and sales tracking
export * from './marketing';
export type * from './marketing';

// Analytics and AI
export {
  calculateKPIs,
  getReportCategories
} from './analytics';

// Export types with the 'export type' syntax for isolatedModules
export type {
  AnalyticsDashboard,
  DashboardType,
  DashboardWidget,
  WidgetType,
  VisualizationType,
  DataTransformation,
  DashboardFilter,
  DataSource,
  DataSourceType,
  AIModel,
  AIModelType,
  AIModelFeature,
  AIPrediction,
  PricePrediction,
  LeadScorePrediction,
  Report,
  // Rename to avoid ambiguity
  ReportType as AnalyticsReportType,
  AnalyticsEvent,
  UserBehaviorAnalytics,
  MarketAnalytics,
  BusinessIntelligence
} from './analytics';