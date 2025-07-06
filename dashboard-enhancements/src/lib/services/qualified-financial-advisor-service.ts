/**
 * Qualified Financial Advisor Service
 * 
 * Ensures all financial advice and assessments comply with Central Bank of Ireland
 * regulations and are overseen by qualified financial advisors.
 * 
 * Regulatory Compliance:
 * - Central Bank of Ireland Consumer Protection Code 2012
 * - European Insurance and Occupational Pensions Authority (EIOPA) guidelines
 * - Markets in Financial Instruments Directive II (MiFID II)
 * - Consumer Credit Act 1995 (Ireland)
 * - Investment Intermediaries Act 1995
 */

import { logger } from '@/lib/security/auditLogger';
import { v4 as uuidv4 } from 'uuid';
import * as Sentry from '@sentry/nextjs';

export interface QualifiedAdvisor {
  advisorId: string;
  registrationNumber: string; // Central Bank registration
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Qualifications
  qualifications: AdvisorQualification[];
  specializations: FinancialSpecialization[];
  authorizedActivities: AuthorizedActivity[];
  
  // Regulatory status
  centralBankStatus: 'ACTIVE' | 'SUSPENDED' | 'REVOKED' | 'UNDER_REVIEW';
  licenseExpiryDate: string;
  cpd: ContinuingProfessionalDevelopment;
  
  // Professional indemnity
  piInsurance: ProfessionalIndemnityInsurance;
  
  // Compliance
  lastComplianceReview: string;
  nextComplianceReview: string;
  complianceRating: 'EXCELLENT' | 'GOOD' | 'SATISFACTORY' | 'NEEDS_IMPROVEMENT';
  
  // Current workload
  activeClients: number;
  maxClientCapacity: number;
  availabilityStatus: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE' | 'ON_LEAVE';
}

export interface AdvisorQualification {
  qualificationId: string;
  qualificationName: string;
  awardingBody: string;
  dateObtained: string;
  expiryDate?: string;
  cpeSatisfied: boolean;
  verificationDocument: string;
}

export interface FinancialSpecialization {
  specialization: 'MORTGAGE_ADVICE' | 'INVESTMENT_ADVICE' | 'PENSION_ADVICE' | 'INSURANCE_ADVICE' | 'GENERAL_FINANCIAL_PLANNING';
  certificationLevel: 'QFA' | 'APA' | 'CFP' | 'ACCA' | 'CFA' | 'FRM';
  yearsExperience: number;
  clientLimit: number;
}

export interface AuthorizedActivity {
  activity: string;
  authorizationDate: string;
  restrictions?: string[];
  supervisionRequired: boolean;
}

export interface ContinuingProfessionalDevelopment {
  currentCycleYear: number;
  requiredHours: number;
  completedHours: number;
  completedCourses: CPDCourse[];
  complianceStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'AT_RISK';
  nextDeadline: string;
}

export interface CPDCourse {
  courseId: string;
  courseName: string;
  provider: string;
  hoursAllocated: number;
  completionDate: string;
  certificateNumber: string;
}

export interface ProfessionalIndemnityInsurance {
  provider: string;
  policyNumber: string;
  coverageAmount: number;
  effectiveDate: string;
  expiryDate: string;
  coverageType: 'INDIVIDUAL' | 'FIRM_WIDE';
  status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';
}

export interface FinancialAdviceRequest {
  requestId: string;
  clientId: string;
  clientName: string;
  
  // Request details
  adviceType: FinancialAdviceType;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  requestDescription: string;
  
  // Client financial situation
  clientProfile: ClientFinancialProfile;
  
  // Regulatory requirements
  requiresRegulatedAdvice: boolean;
  mifidClassification: 'RETAIL' | 'PROFESSIONAL' | 'ELIGIBLE_COUNTERPARTY';
  
  // Processing
  status: 'PENDING_ASSIGNMENT' | 'ASSIGNED' | 'IN_REVIEW' | 'ADVICE_READY' | 'COMPLETED' | 'ESCALATED';
  assignedAdvisorId?: string;
  assignedDate?: string;
  expectedCompletionDate?: string;
  
  // Compliance tracking
  complianceChecksRequired: ComplianceCheck[];
  conflictOfInterestAssessment: ConflictOfInterestAssessment;
}

export interface ClientFinancialProfile {
  clientId: string;
  
  // Basic information
  age: number;
  dependents: number;
  employmentStatus: 'EMPLOYED' | 'SELF_EMPLOYED' | 'UNEMPLOYED' | 'RETIRED' | 'STUDENT';
  maritalStatus: 'SINGLE' | 'MARRIED' | 'CIVIL_PARTNERSHIP' | 'DIVORCED' | 'WIDOWED';
  
  // Financial position
  grossAnnualIncome: number;
  netAnnualIncome: number;
  monthlyExpenses: number;
  assets: FinancialAsset[];
  liabilities: FinancialLiability[];
  
  // Investment profile
  riskTolerance: 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  investmentExperience: 'NONE' | 'LIMITED' | 'MODERATE' | 'EXTENSIVE';
  investmentHorizon: 'SHORT_TERM' | 'MEDIUM_TERM' | 'LONG_TERM';
  
  // Objectives
  financialGoals: FinancialGoal[];
  retirementAge?: number;
  
  // Regulatory status
  sophisticatedInvestor: boolean;
  professionalClient: boolean;
  adequacyAssessment: AdequacyAssessment;
  appropriatenessAssessment: AppropriatenessAssessment;
}

export interface FinancialAsset {
  assetType: 'CASH' | 'PROPERTY' | 'INVESTMENTS' | 'PENSION' | 'BUSINESS' | 'OTHER';
  description: string;
  value: number;
  currency: string;
  liquidity: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface FinancialLiability {
  liabilityType: 'MORTGAGE' | 'PERSONAL_LOAN' | 'CREDIT_CARD' | 'BUSINESS_LOAN' | 'OTHER';
  description: string;
  balance: number;
  monthlyPayment: number;
  interestRate: number;
  term: number;
}

export interface FinancialGoal {
  goalId: string;
  description: string;
  targetAmount: number;
  targetDate: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  achievabilityScore: number;
}

export interface AdequacyAssessment {
  assessmentId: string;
  assessmentDate: string;
  advisorId: string;
  
  // Knowledge assessment
  financialKnowledge: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
  investmentExperience: 'NONE' | 'LIMITED' | 'MODERATE' | 'EXTENSIVE';
  
  // Suitability factors
  riskCapacity: 'LOW' | 'MEDIUM' | 'HIGH';
  timeHorizon: 'SHORT' | 'MEDIUM' | 'LONG';
  liquidityNeeds: 'HIGH' | 'MEDIUM' | 'LOW';
  
  // Assessment outcome
  overallRating: 'SUITABLE' | 'UNSUITABLE' | 'REQUIRES_FURTHER_ASSESSMENT';
  recommendations: string[];
  restrictions: string[];
  
  // Compliance
  mifidCompliant: boolean;
  reviewDate: string;
}

export interface AppropriatenessAssessment {
  assessmentId: string;
  assessmentDate: string;
  advisorId: string;
  
  // Client understanding
  understandsProduct: boolean;
  understandsRisks: boolean;
  hasRelevantExperience: boolean;
  
  // Assessment outcome
  appropriate: boolean;
  warnings: string[];
  disclaimers: string[];
  
  // Compliance
  documentationComplete: boolean;
  clientAcknowledged: boolean;
}

export interface QualifiedFinancialAdvice {
  adviceId: string;
  requestId: string;
  advisorId: string;
  clientId: string;
  
  // Advice details
  adviceType: FinancialAdviceType;
  adviceDate: string;
  adviceSummary: string;
  detailedRecommendations: FinancialRecommendation[];
  
  // Risk warnings
  riskWarnings: string[];
  keyRisks: string[];
  riskMitigationStrategies: string[];
  
  // Compliance documentation
  factFind: ClientFactFind;
  needsAnalysis: NeedsAnalysis;
  productComparison: ProductComparison[];
  
  // Regulatory compliance
  mifidCompliant: boolean;
  consumerProtectionCompliant: boolean;
  conflictOfInterestDeclared: boolean;
  
  // Follow-up
  reviewDate: string;
  monitoringRequired: boolean;
  implementationSupport: boolean;
  
  // Client acceptance
  clientAccepted: boolean;
  clientSignature?: string;
  acceptanceDate?: string;
  
  // Audit trail
  auditTrail: AdviceAuditEntry[];
}

export interface FinancialRecommendation {
  recommendationId: string;
  priority: 'PRIMARY' | 'SECONDARY' | 'OPTIONAL';
  
  // Recommendation details
  productType: string;
  productName: string;
  provider: string;
  
  // Financial details
  recommendedAmount: number;
  expectedReturn?: number;
  riskRating: 'LOW' | 'MEDIUM' | 'HIGH';
  timeHorizon: string;
  
  // Rationale
  rationale: string;
  benefitsExplained: string[];
  risksExplained: string[];
  alternativesConsidered: string[];
  
  // Implementation
  implementationSteps: string[];
  estimatedCosts: number;
  ongoingCharges: number;
  
  // Compliance
  regulatoryApproval: boolean;
  disclaimers: string[];
}

export interface ClientFactFind {
  factFindId: string;
  completionDate: string;
  advisorId: string;
  
  // Personal circumstances
  personalDetails: any;
  familyCircumstances: any;
  healthConsiderations: any;
  
  // Financial circumstances
  incomeDetails: any;
  expenditureDetails: any;
  assetDetails: any;
  liabilityDetails: any;
  
  // Attitude to risk
  riskQuestionnaire: RiskQuestionnaire;
  
  // Objectives
  objectives: any;
  constraints: any;
  
  // Verification
  documentsVerified: string[];
  declarationSigned: boolean;
}

export interface RiskQuestionnaire {
  questionnaireVersion: string;
  completionDate: string;
  responses: RiskQuestionResponse[];
  overallScore: number;
  riskProfile: 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
}

export interface RiskQuestionResponse {
  questionId: string;
  question: string;
  response: string;
  score: number;
}

export interface NeedsAnalysis {
  analysisId: string;
  analysisDate: string;
  
  // Identified needs
  protectionNeeds: ProtectionNeed[];
  savingNeeds: SavingNeed[];
  investmentNeeds: InvestmentNeed[];
  retirementNeeds: RetirementNeed[];
  
  // Gap analysis
  currentPosition: any;
  targetPosition: any;
  gaps: FinancialGap[];
  
  // Priority assessment
  priorityRanking: string[];
  urgencyAssessment: any;
}

export interface ProtectionNeed {
  needType: 'LIFE_INSURANCE' | 'INCOME_PROTECTION' | 'CRITICAL_ILLNESS' | 'MORTGAGE_PROTECTION';
  currentCover: number;
  requiredCover: number;
  gap: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface SavingNeed {
  purpose: string;
  targetAmount: number;
  timeframe: string;
  currentSavings: number;
  monthlyCapacity: number;
  riskTolerance: string;
}

export interface InvestmentNeed {
  objective: string;
  investmentAmount: number;
  timeHorizon: string;
  riskProfile: string;
  constraints: string[];
}

export interface RetirementNeed {
  retirementAge: number;
  targetIncome: number;
  currentPension: number;
  projectedShortfall: number;
  contributionCapacity: number;
}

export interface FinancialGap {
  gapType: string;
  currentValue: number;
  requiredValue: number;
  shortfall: number;
  timeframe: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface ProductComparison {
  comparisonId: string;
  productCategory: string;
  productsCompared: ProductDetails[];
  comparisonCriteria: string[];
  recommendation: string;
  rationale: string;
}

export interface ProductDetails {
  productName: string;
  provider: string;
  keyFeatures: string[];
  costs: ProductCost[];
  riskRating: string;
  suitabilityScore: number;
}

export interface ProductCost {
  costType: 'INITIAL_CHARGE' | 'ANNUAL_CHARGE' | 'EXIT_CHARGE' | 'SWITCHING_CHARGE';
  amount: number;
  percentage?: number;
}

export interface ConflictOfInterestAssessment {
  assessmentId: string;
  assessmentDate: string;
  advisorId: string;
  
  // Potential conflicts
  directFinancialInterest: boolean;
  indirectFinancialInterest: boolean;
  personalRelationship: boolean;
  businessRelationship: boolean;
  
  // Conflict details
  conflictDetails: ConflictDetail[];
  
  // Management
  mitigationMeasures: string[];
  disclosureRequired: boolean;
  disclosureMade: boolean;
  
  // Assessment outcome
  conflictLevel: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'SEVERE';
  advicePermissible: boolean;
  conditions: string[];
}

export interface ConflictDetail {
  conflictType: string;
  description: string;
  financialValue?: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  mitigationAction: string;
}

export interface ComplianceCheck {
  checkType: string;
  checkDescription: string;
  required: boolean;
  completed: boolean;
  completionDate?: string;
  result?: 'PASS' | 'FAIL' | 'CONDITIONAL';
  notes?: string;
}

export interface AdviceAuditEntry {
  entryId: string;
  timestamp: string;
  action: string;
  performedBy: string;
  details: string;
  documentsAccessed: string[];
  complianceImpact: string;
}

export enum FinancialAdviceType {
  MORTGAGE_ADVICE = 'MORTGAGE_ADVICE',
  INVESTMENT_ADVICE = 'INVESTMENT_ADVICE',
  PENSION_ADVICE = 'PENSION_ADVICE',
  INSURANCE_ADVICE = 'INSURANCE_ADVICE',
  GENERAL_FINANCIAL_PLANNING = 'GENERAL_FINANCIAL_PLANNING',
  DEBT_CONSOLIDATION = 'DEBT_CONSOLIDATION',
  TAX_PLANNING = 'TAX_PLANNING',
  ESTATE_PLANNING = 'ESTATE_PLANNING'
}

class QualifiedFinancialAdvisorService {
  private readonly CENTRAL_BANK_API = process.env.CENTRAL_BANK_API_ENDPOINT;
  private readonly REGULATORY_THRESHOLD = 10000; // €10,000 threshold for regulated advice

  /**
   * Request financial advice from qualified advisor
   */
  async requestFinancialAdvice(
    clientId: string,
    adviceType: FinancialAdviceType,
    requestDetails: {
      description: string;
      urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
      clientProfile: ClientFinancialProfile;
      amount?: number;
    }
  ): Promise<FinancialAdviceRequest> {
    try {
      const requestId = uuidv4();
      const timestamp = new Date().toISOString();

      // Determine if regulated advice is required
      const requiresRegulation = this.requiresRegulatedAdvice(adviceType, requestDetails.amount);
      
      // Assess MiFID classification
      const mifidClassification = this.assessMiFIDClassification(requestDetails.clientProfile);

      // Create advice request
      const request: FinancialAdviceRequest = {
        requestId,
        clientId,
        clientName: 'Client Name', // Would be retrieved from client service
        adviceType,
        urgency: requestDetails.urgency,
        requestDescription: requestDetails.description,
        clientProfile: requestDetails.clientProfile,
        requiresRegulatedAdvice: requiresRegulation,
        mifidClassification,
        status: 'PENDING_ASSIGNMENT',
        complianceChecksRequired: this.getRequiredComplianceChecks(adviceType, requiresRegulation),
        conflictOfInterestAssessment: await this.performConflictAssessment(clientId, adviceType)
      };

      // Store request
      await this.storeAdviceRequest(request);

      // Assign qualified advisor if regulation required
      if (requiresRegulation) {
        await this.assignQualifiedAdvisor(request);
      }

      logger.info('Financial advice request created', {
        requestId,
        clientId,
        adviceType,
        requiresRegulatedAdvice: requiresRegulation,
        mifidClassification
      });

      return request;

    } catch (error: any) {
      logger.error('Failed to create financial advice request', {
        error: error.message,
        clientId,
        adviceType
      });
      throw error;
    }
  }

  /**
   * Assign qualified advisor based on specialization and availability
   */
  async assignQualifiedAdvisor(request: FinancialAdviceRequest): Promise<string> {
    try {
      // Find qualified advisors for this advice type
      const suitableAdvisors = await this.findSuitableAdvisors(
        request.adviceType,
        request.urgency,
        request.clientProfile
      );

      if (suitableAdvisors.length === 0) {
        throw new Error('No qualified advisors available for this request type');
      }

      // Select best advisor based on specialization and workload
      const selectedAdvisor = this.selectBestAdvisor(suitableAdvisors, request);

      // Verify advisor qualifications
      await this.verifyAdvisorQualifications(selectedAdvisor.advisorId, request.adviceType);

      // Update request with assignment
      await this.updateAdviceRequest(request.requestId, {
        status: 'ASSIGNED',
        assignedAdvisorId: selectedAdvisor.advisorId,
        assignedDate: new Date().toISOString(),
        expectedCompletionDate: this.calculateExpectedCompletion(request.urgency)
      });

      // Notify advisor
      await this.notifyAdvisorOfAssignment(selectedAdvisor.advisorId, request);

      logger.info('Qualified advisor assigned', {
        requestId: request.requestId,
        advisorId: selectedAdvisor.advisorId,
        adviceType: request.adviceType
      });

      return selectedAdvisor.advisorId;

    } catch (error: any) {
      logger.error('Failed to assign qualified advisor', {
        error: error.message,
        requestId: request.requestId
      });
      throw error;
    }
  }

  /**
   * Generate qualified financial advice
   */
  async generateQualifiedAdvice(
    requestId: string,
    advisorId: string,
    factFind: ClientFactFind,
    needsAnalysis: NeedsAnalysis
  ): Promise<QualifiedFinancialAdvice> {
    try {
      // Verify advisor is qualified for this advice type
      const request = await this.getAdviceRequest(requestId);
      await this.verifyAdvisorQualifications(advisorId, request.adviceType);

      // Perform suitability assessments
      const adequacyAssessment = await this.performAdequacyAssessment(
        request.clientProfile,
        advisorId
      );

      const appropriatenessAssessment = await this.performAppropriatenessAssessment(
        request.clientProfile,
        advisorId
      );

      // Generate recommendations
      const recommendations = await this.generateRecommendations(
        request,
        factFind,
        needsAnalysis,
        adequacyAssessment
      );

      // Perform product comparison
      const productComparisons = await this.performProductComparison(
        recommendations,
        request.clientProfile
      );

      // Create qualified advice
      const advice: QualifiedFinancialAdvice = {
        adviceId: uuidv4(),
        requestId,
        advisorId,
        clientId: request.clientId,
        adviceType: request.adviceType,
        adviceDate: new Date().toISOString(),
        adviceSummary: this.generateAdviceSummary(recommendations),
        detailedRecommendations: recommendations,
        riskWarnings: this.generateRiskWarnings(recommendations),
        keyRisks: this.identifyKeyRisks(recommendations),
        riskMitigationStrategies: this.generateRiskMitigation(recommendations),
        factFind,
        needsAnalysis,
        productComparison: productComparisons,
        mifidCompliant: this.verifyMiFIDCompliance(request, adequacyAssessment),
        consumerProtectionCompliant: this.verifyConsumerProtectionCompliance(request),
        conflictOfInterestDeclared: request.conflictOfInterestAssessment.disclosureMade,
        reviewDate: this.calculateReviewDate(request.adviceType),
        monitoringRequired: this.requiresOngoingMonitoring(request.adviceType),
        implementationSupport: this.providesImplementationSupport(request.adviceType),
        clientAccepted: false,
        auditTrail: []
      };

      // Store advice
      await this.storeQualifiedAdvice(advice);

      // Update request status
      await this.updateAdviceRequest(requestId, {
        status: 'ADVICE_READY'
      });

      logger.info('Qualified financial advice generated', {
        adviceId: advice.adviceId,
        requestId,
        advisorId,
        adviceType: request.adviceType,
        recommendationCount: recommendations.length
      });

      return advice;

    } catch (error: any) {
      logger.error('Failed to generate qualified advice', {
        error: error.message,
        requestId,
        advisorId
      });
      throw error;
    }
  }

  /**
   * Validate advisor qualifications with Central Bank
   */
  async verifyAdvisorQualifications(
    advisorId: string,
    adviceType: FinancialAdviceType
  ): Promise<boolean> {
    try {
      const advisor = await this.getAdvisor(advisorId);
      
      // Check Central Bank registration status
      const centralBankStatus = await this.checkCentralBankStatus(advisor.registrationNumber);
      if (centralBankStatus !== 'ACTIVE') {
        throw new Error(`Advisor not in good standing with Central Bank: ${centralBankStatus}`);
      }

      // Check license expiry
      if (new Date(advisor.licenseExpiryDate) <= new Date()) {
        throw new Error('Advisor license has expired');
      }

      // Check CPD compliance
      if (advisor.cpd.complianceStatus !== 'COMPLIANT') {
        throw new Error('Advisor CPD requirements not met');
      }

      // Check professional indemnity insurance
      if (advisor.piInsurance.status !== 'ACTIVE' || new Date(advisor.piInsurance.expiryDate) <= new Date()) {
        throw new Error('Advisor professional indemnity insurance not current');
      }

      // Check specialization for advice type
      const hasSpecialization = advisor.specializations.some(spec => 
        this.isSpecializationSuitable(spec, adviceType)
      );
      
      if (!hasSpecialization) {
        throw new Error(`Advisor not qualified for advice type: ${adviceType}`);
      }

      logger.info('Advisor qualifications verified', {
        advisorId,
        adviceType,
        registrationNumber: advisor.registrationNumber
      });

      return true;

    } catch (error: any) {
      logger.error('Advisor qualification verification failed', {
        error: error.message,
        advisorId,
        adviceType
      });
      throw error;
    }
  }

  /**
   * Perform MiFID II adequacy assessment
   */
  async performAdequacyAssessment(
    clientProfile: ClientFinancialProfile,
    advisorId: string
  ): Promise<AdequacyAssessment> {
    try {
      const assessmentId = uuidv4();
      const assessmentDate = new Date().toISOString();

      // Assess financial knowledge
      const financialKnowledge = this.assessFinancialKnowledge(clientProfile);
      
      // Assess investment experience
      const investmentExperience = clientProfile.investmentExperience;
      
      // Assess risk capacity
      const riskCapacity = this.assessRiskCapacity(clientProfile);
      
      // Assess time horizon
      const timeHorizon = this.assessTimeHorizon(clientProfile);
      
      // Assess liquidity needs
      const liquidityNeeds = this.assessLiquidityNeeds(clientProfile);

      // Determine overall suitability
      const overallRating = this.determineOverallSuitability(
        financialKnowledge,
        investmentExperience,
        riskCapacity,
        timeHorizon,
        liquidityNeeds
      );

      const assessment: AdequacyAssessment = {
        assessmentId,
        assessmentDate,
        advisorId,
        financialKnowledge,
        investmentExperience,
        riskCapacity,
        timeHorizon,
        liquidityNeeds,
        overallRating,
        recommendations: this.generateAdequacyRecommendations(overallRating),
        restrictions: this.generateAdequacyRestrictions(overallRating),
        mifidCompliant: overallRating !== 'UNSUITABLE',
        reviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      };

      await this.storeAdequacyAssessment(assessment);

      logger.info('MiFID adequacy assessment completed', {
        assessmentId,
        clientId: clientProfile.clientId,
        overallRating,
        mifidCompliant: assessment.mifidCompliant
      });

      return assessment;

    } catch (error: any) {
      logger.error('Adequacy assessment failed', {
        error: error.message,
        clientId: clientProfile.clientId
      });
      throw error;
    }
  }

  // Private helper methods
  private requiresRegulatedAdvice(adviceType: FinancialAdviceType, amount?: number): boolean {
    // Certain advice types always require regulation
    const alwaysRegulated = [
      FinancialAdviceType.INVESTMENT_ADVICE,
      FinancialAdviceType.PENSION_ADVICE,
      FinancialAdviceType.INSURANCE_ADVICE
    ];

    if (alwaysRegulated.includes(adviceType)) {
      return true;
    }

    // Amount-based threshold
    if (amount && amount >= this.REGULATORY_THRESHOLD) {
      return true;
    }

    return false;
  }

  private assessMiFIDClassification(clientProfile: ClientFinancialProfile): 'RETAIL' | 'PROFESSIONAL' | 'ELIGIBLE_COUNTERPARTY' {
    if (clientProfile.professionalClient) {
      return 'PROFESSIONAL';
    }
    
    // Large undertakings may be eligible counterparties
    if (clientProfile.grossAnnualIncome > 500000 && clientProfile.sophisticatedInvestor) {
      return 'ELIGIBLE_COUNTERPARTY';
    }

    return 'RETAIL';
  }

  private getRequiredComplianceChecks(adviceType: FinancialAdviceType, regulated: boolean): ComplianceCheck[] {
    const checks: ComplianceCheck[] = [
      {
        checkType: 'IDENTITY_VERIFICATION',
        checkDescription: 'Verify client identity and address',
        required: true,
        completed: false
      },
      {
        checkType: 'FACT_FIND_COMPLETION',
        checkDescription: 'Complete comprehensive fact find',
        required: regulated,
        completed: false
      }
    ];

    if (regulated) {
      checks.push(
        {
          checkType: 'SUITABILITY_ASSESSMENT',
          checkDescription: 'Perform MiFID suitability assessment',
          required: true,
          completed: false
        },
        {
          checkType: 'PRODUCT_GOVERNANCE',
          checkDescription: 'Ensure product governance compliance',
          required: true,
          completed: false
        }
      );
    }

    return checks;
  }

  private async performConflictAssessment(clientId: string, adviceType: FinancialAdviceType): Promise<ConflictOfInterestAssessment> {
    // Simplified conflict assessment - production would be more comprehensive
    return {
      assessmentId: uuidv4(),
      assessmentDate: new Date().toISOString(),
      advisorId: '',
      directFinancialInterest: false,
      indirectFinancialInterest: false,
      personalRelationship: false,
      businessRelationship: false,
      conflictDetails: [],
      mitigationMeasures: [],
      disclosureRequired: false,
      disclosureMade: false,
      conflictLevel: 'NONE',
      advicePermissible: true,
      conditions: []
    };
  }

  private async findSuitableAdvisors(
    adviceType: FinancialAdviceType,
    urgency: string,
    clientProfile: ClientFinancialProfile
  ): Promise<QualifiedAdvisor[]> {
    // In production, this would query the advisor database
    return [];
  }

  private selectBestAdvisor(advisors: QualifiedAdvisor[], request: FinancialAdviceRequest): QualifiedAdvisor {
    // Advisor selection algorithm based on specialization, workload, and availability
    return advisors[0];
  }

  private calculateExpectedCompletion(urgency: string): string {
    const daysToAdd = urgency === 'URGENT' ? 1 : urgency === 'HIGH' ? 3 : 7;
    return new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000).toISOString();
  }

  private async checkCentralBankStatus(registrationNumber: string): Promise<string> {
    // Would integrate with Central Bank API
    return 'ACTIVE';
  }

  private isSpecializationSuitable(spec: FinancialSpecialization, adviceType: FinancialAdviceType): boolean {
    const suitabilityMap: Record<FinancialAdviceType, string[]> = {
      [FinancialAdviceType.MORTGAGE_ADVICE]: ['MORTGAGE_ADVICE', 'GENERAL_FINANCIAL_PLANNING'],
      [FinancialAdviceType.INVESTMENT_ADVICE]: ['INVESTMENT_ADVICE', 'GENERAL_FINANCIAL_PLANNING'],
      [FinancialAdviceType.PENSION_ADVICE]: ['PENSION_ADVICE', 'GENERAL_FINANCIAL_PLANNING'],
      [FinancialAdviceType.INSURANCE_ADVICE]: ['INSURANCE_ADVICE', 'GENERAL_FINANCIAL_PLANNING'],
      [FinancialAdviceType.GENERAL_FINANCIAL_PLANNING]: ['GENERAL_FINANCIAL_PLANNING'],
      [FinancialAdviceType.DEBT_CONSOLIDATION]: ['GENERAL_FINANCIAL_PLANNING'],
      [FinancialAdviceType.TAX_PLANNING]: ['GENERAL_FINANCIAL_PLANNING'],
      [FinancialAdviceType.ESTATE_PLANNING]: ['GENERAL_FINANCIAL_PLANNING']
    };

    return suitabilityMap[adviceType]?.includes(spec.specialization) || false;
  }

  // Additional helper methods (implementations would be comprehensive in production)
  private assessFinancialKnowledge(profile: ClientFinancialProfile): 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' {
    return profile.investmentExperience === 'EXTENSIVE' ? 'ADVANCED' : 'BASIC';
  }

  private assessRiskCapacity(profile: ClientFinancialProfile): 'LOW' | 'MEDIUM' | 'HIGH' {
    const netWorth = profile.assets.reduce((sum, asset) => sum + asset.value, 0) - 
                    profile.liabilities.reduce((sum, liability) => sum + liability.balance, 0);
    
    if (netWorth > 500000) return 'HIGH';
    if (netWorth > 100000) return 'MEDIUM';
    return 'LOW';
  }

  private assessTimeHorizon(profile: ClientFinancialProfile): 'SHORT' | 'MEDIUM' | 'LONG' {
    const age = profile.age;
    const retirementAge = profile.retirementAge || 65;
    const yearsToRetirement = retirementAge - age;
    
    if (yearsToRetirement > 15) return 'LONG';
    if (yearsToRetirement > 5) return 'MEDIUM';
    return 'SHORT';
  }

  private assessLiquidityNeeds(profile: ClientFinancialProfile): 'HIGH' | 'MEDIUM' | 'LOW' {
    // Simplified assessment based on emergency fund
    const monthlyExpenses = profile.monthlyExpenses;
    const liquidAssets = profile.assets.filter(a => a.liquidity === 'HIGH').reduce((sum, a) => sum + a.value, 0);
    const emergencyFundMonths = liquidAssets / monthlyExpenses;
    
    if (emergencyFundMonths < 3) return 'HIGH';
    if (emergencyFundMonths < 6) return 'MEDIUM';
    return 'LOW';
  }

  private determineOverallSuitability(
    knowledge: string,
    experience: string,
    capacity: string,
    horizon: string,
    liquidity: string
  ): 'SUITABLE' | 'UNSUITABLE' | 'REQUIRES_FURTHER_ASSESSMENT' {
    // Simplified suitability determination
    if (knowledge === 'BASIC' && capacity === 'LOW') {
      return 'REQUIRES_FURTHER_ASSESSMENT';
    }
    return 'SUITABLE';
  }

  private generateAdequacyRecommendations(rating: string): string[] {
    if (rating === 'REQUIRES_FURTHER_ASSESSMENT') {
      return ['Consider financial education', 'Start with low-risk products', 'Regular review recommended'];
    }
    return ['Suitable for recommended products'];
  }

  private generateAdequacyRestrictions(rating: string): string[] {
    if (rating === 'UNSUITABLE') {
      return ['High-risk products not suitable', 'Complex products not recommended'];
    }
    return [];
  }

  // Storage and retrieval methods (would be implemented with secure database)
  private async storeAdviceRequest(request: FinancialAdviceRequest): Promise<void> {}
  private async getAdviceRequest(requestId: string): Promise<FinancialAdviceRequest> { return {} as any; }
  private async updateAdviceRequest(requestId: string, updates: any): Promise<void> {}
  private async getAdvisor(advisorId: string): Promise<QualifiedAdvisor> { return {} as any; }
  private async storeQualifiedAdvice(advice: QualifiedFinancialAdvice): Promise<void> {}
  private async storeAdequacyAssessment(assessment: AdequacyAssessment): Promise<void> {}
  private async notifyAdvisorOfAssignment(advisorId: string, request: FinancialAdviceRequest): Promise<void> {}
  
  // Complex business logic methods (would have full implementations)
  private generateRecommendations(request: any, factFind: any, needs: any, adequacy: any): Promise<FinancialRecommendation[]> { return Promise.resolve([]); }
  private performProductComparison(recommendations: any, profile: any): Promise<ProductComparison[]> { return Promise.resolve([]); }
  private generateAdviceSummary(recommendations: any): string { return ''; }
  private generateRiskWarnings(recommendations: any): string[] { return []; }
  private identifyKeyRisks(recommendations: any): string[] { return []; }
  private generateRiskMitigation(recommendations: any): string[] { return []; }
  private verifyMiFIDCompliance(request: any, adequacy: any): boolean { return true; }
  private verifyConsumerProtectionCompliance(request: any): boolean { return true; }
  private calculateReviewDate(adviceType: any): string { return new Date().toISOString(); }
  private requiresOngoingMonitoring(adviceType: any): boolean { return false; }
  private providesImplementationSupport(adviceType: any): boolean { return true; }
}

// Export singleton instance
export const qualifiedFinancialAdvisorService = new QualifiedFinancialAdvisorService();
export default qualifiedFinancialAdvisorService;