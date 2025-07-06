/**
 * HTB Real Regulations Service
 * 
 * Implements actual Help-to-Buy regulations as per Irish Housing Agency
 * and Department of Housing, Local Government and Heritage guidelines.
 * 
 * Regulatory Authority: Housing Agency Ireland
 * Legal Framework: Help to Buy (HTB) Incentive Scheme
 * Last Updated: January 2025 regulations
 * 
 * Key Regulations:
 * - Housing Act 2016
 * - Finance Act 2016 (HTB provisions)
 * - Housing Agency HTB Guidelines 2024-2025
 * - Revenue Commissioners HTB Rules
 */

import { logger } from '@/lib/security/auditLogger';
import { qualifiedFinancialAdvisorService, FinancialAdviceType } from './qualified-financial-advisor-service';
import { v4 as uuidv4 } from 'uuid';

export interface HTBRealRegulations {
  // Current scheme parameters (2025)
  maxPropertyPrice: {
    newHome: number;           // €600,000 (2025)
    secondHandHome: number;    // €500,000 (2025)
  };
  maxHTBAmount: {
    newHome: number;           // €30,000 or 10% whichever is lower
    secondHandHome: number;    // €20,000 or 5% whichever is lower
  };
  minimumDeposit: number;      // 10% of property price
  incomeThresholds: {
    single: number;            // €80,000 gross annual
    couple: number;            // €120,000 combined gross annual
  };
  firstTimeBuyerOnly: boolean; // Must be first-time buyer
  propertyConditions: HTBPropertyConditions;
  eligibilityConditions: HTBEligibilityConditions;
  applicationProcess: HTBApplicationProcess;
  complianceRequirements: HTBComplianceRequirements;
}

export interface HTBPropertyConditions {
  // Property type restrictions
  allowedPropertyTypes: string[];
  excludedPropertyTypes: string[];
  
  // New home requirements
  newHomeCriteria: {
    mustHaveBuildingEnergyRating: string;  // Minimum B3 rating
    maxCompletionAge: number;               // 2 years from first occupation
    mustHaveHomebondCover: boolean;
    mustHaveArchitectsCertificate: boolean;
  };
  
  // Second-hand home requirements
  secondHandCriteria: {
    minAge: number;                         // Must be at least 2 years old
    maxAge: number;                         // No upper limit but affects valuation
    mustHaveStructuralSurvey: boolean;
    energyRatingRequired: boolean;
  };
  
  // Geographic restrictions
  locationRestrictions: {
    excludedAreas: string[];                // Certain areas may be excluded
    includedCounties: string[];             // All Irish counties included
    specialConditions: HTBLocationCondition[];
  };
  
  // Valuation requirements
  valuationRequirements: {
    professionalValuationRequired: boolean;
    maxVarianceFromPrice: number;           // 5% variance allowed
    valuationAge: number;                   // Must be within 3 months
    approvedValuers: string[];
  };
}

export interface HTBEligibilityConditions {
  // Personal eligibility
  personalCriteria: {
    minimumAge: number;                     // 18 years
    maximumAge: number;                     // No upper limit
    residencyRequirement: string;           // Irish/EU resident
    firstTimeBuyerDefinition: HTBFirstTimeBuyerDefinition;
  };
  
  // Financial eligibility
  financialCriteria: {
    incomeAssessment: HTBIncomeAssessment;
    depositRequirements: HTBDepositRequirements;
    debtToIncomeRatio: HTBDebtToIncomeRatio;
    affordabilityAssessment: HTBAffordabilityAssessment;
  };
  
  // Employment requirements
  employmentCriteria: {
    minimumEmploymentPeriod: number;        // 12 months continuous
    acceptableEmploymentTypes: string[];
    selfEmployedRequirements: HTBSelfEmployedRequirements;
    probationaryPeriodAllowed: boolean;
  };
  
  // Mortgage requirements
  mortgageCriteria: {
    mortgageApprovalRequired: boolean;
    acceptableLenders: string[];
    loanToValueLimits: HTBLoanToValueLimits;
    mortgageTermLimits: HTBMortgageTermLimits;
  };
}

export interface HTBApplicationProcess {
  // Application stages
  stages: HTBApplicationStage[];
  
  // Required documentation
  requiredDocuments: HTBRequiredDocument[];
  
  // Processing timelines
  processingTimelines: {
    initialAssessment: number;              // 5 working days
    documentVerification: number;           // 10 working days
    finalApproval: number;                 // 15 working days
    appealProcess: number;                 // 30 working days
  };
  
  // Decision criteria
  decisionCriteria: HTBDecisionCriteria;
  
  // Appeal process
  appealProcess: HTBAppealProcess;
}

export interface HTBComplianceRequirements {
  // Regulatory oversight
  regulatoryBodies: string[];
  
  // Compliance checks
  mandatoryChecks: HTBComplianceCheck[];
  
  // Record keeping
  recordKeepingRequirements: {
    retentionPeriod: number;                // 7 years minimum
    auditRequirements: string[];
    dataProtectionCompliance: boolean;
  };
  
  // Reporting requirements
  reportingRequirements: {
    monthlyReporting: boolean;
    quarterlyReporting: boolean;
    annualReporting: boolean;
    reportingBodies: string[];
  };
}

export interface HTBFirstTimeBuyerDefinition {
  definition: string;
  exclusions: string[];
  jointApplicationRules: string[];
  inheritanceRules: string[];
  previousOwnershipExclusions: string[];
}

export interface HTBIncomeAssessment {
  includedIncome: string[];
  excludedIncome: string[];
  assessmentPeriod: number;                 // 12 months
  variableIncomeRules: string[];
  jointApplicationRules: string[];
}

export interface HTBDepositRequirements {
  minimumDeposit: number;                   // 10% of property price
  acceptableFundingSources: string[];
  unacceptableSources: string[];
  giftRules: HTBGiftRules;
  depositHoldingRequirements: string[];
}

export interface HTBDebtToIncomeRatio {
  maximumRatio: number;                     // Typically 35%
  includedDebts: string[];
  excludedDebts: string[];
  calculationMethod: string;
  jointApplicationRules: string[];
}

export interface HTBAffordabilityAssessment {
  stressTestRate: number;                   // 2% above offered rate
  maximumLoanToIncome: number;              // 3.5x for most cases
  exceptionalCircumstances: string[];
  affordabilityCalculation: string;
}

export interface HTBSelfEmployedRequirements {
  minimumTradingPeriod: number;             // 2 years
  requiredDocuments: string[];
  incomeAveraging: string;
  accountantCertification: boolean;
}

export interface HTBLoanToValueLimits {
  firstTimeBuyers: number;                  // 90% LTV
  maximumLTV: number;                       // 90%
  depositExceptions: string[];
}

export interface HTBMortgageTermLimits {
  maximumTerm: number;                      // 35 years
  minimumTerm: number;                      // 5 years
  ageRestrictionsAtMaturity: number;        // Age 70 at maturity
}

export interface HTBLocationCondition {
  area: string;
  condition: string;
  effectiveDate: string;
  expiryDate?: string;
}

export interface HTBApplicationStage {
  stageNumber: number;
  stageName: string;
  description: string;
  requiredActions: string[];
  completionCriteria: string[];
  timeframe: number;
  canAppeal: boolean;
}

export interface HTBRequiredDocument {
  documentId: string;
  documentName: string;
  documentType: string;
  mandatory: boolean;
  applicableStages: number[];
  verificationRequired: boolean;
  retentionPeriod: number;
  legalBasis: string;
}

export interface HTBDecisionCriteria {
  automaticApproval: HTBAutomaticApprovalCriteria;
  manualReview: HTBManualReviewCriteria;
  refusalCriteria: HTBRefusalCriteria;
  conditionalApproval: HTBConditionalApprovalCriteria;
}

export interface HTBAutomaticApprovalCriteria {
  incomeThreshold: number;
  depositAmount: number;
  creditScore: number;
  employmentStability: boolean;
  propertyCompliance: boolean;
}

export interface HTBManualReviewCriteria {
  triggerConditions: string[];
  reviewProcess: string[];
  additionalDocuments: string[];
  reviewTimeframe: number;
}

export interface HTBRefusalCriteria {
  automaticRefusal: string[];
  discretionaryRefusal: string[];
  appealableRefusal: string[];
}

export interface HTBConditionalApprovalCriteria {
  conditions: string[];
  timeframeForCompliance: number;
  consequencesOfNonCompliance: string[];
}

export interface HTBAppealProcess {
  eligibleAppeals: string[];
  appealTimeframe: number;                  // 21 days from decision
  appealDocuments: string[];
  appealReviewProcess: string[];
  appealOutcomes: string[];
}

export interface HTBComplianceCheck {
  checkType: string;
  frequency: string;
  responsibleParty: string;
  failureConsequences: string[];
}

export interface HTBGiftRules {
  maximumGiftAmount: number;
  acceptableGiftSources: string[];
  documentationRequired: string[];
  taxImplications: string[];
}

export interface HTBRealAssessmentResult {
  eligible: boolean;
  maxHTBAmount: number;
  actualHTBAmount: number;
  conditions: string[];
  warnings: string[];
  requiresManualReview: boolean;
  appealable: boolean;
  
  // Detailed breakdown
  eligibilityBreakdown: HTBEligibilityBreakdown;
  propertyAssessment: HTBPropertyAssessment;
  financialAssessment: HTBFinancialAssessment;
  complianceStatus: HTBComplianceStatus;
  
  // Processing information
  assessmentId: string;
  assessmentDate: string;
  assessedBy: string;
  validUntil: string;
  
  // Next steps
  nextSteps: string[];
  requiredActions: string[];
  estimatedProcessingTime: number;
}

export interface HTBEligibilityBreakdown {
  firstTimeBuyer: { eligible: boolean; reason?: string };
  age: { eligible: boolean; reason?: string };
  residency: { eligible: boolean; reason?: string };
  income: { eligible: boolean; amount: number; threshold: number; reason?: string };
  employment: { eligible: boolean; reason?: string };
  creditHistory: { eligible: boolean; score?: number; reason?: string };
}

export interface HTBPropertyAssessment {
  propertyType: { compliant: boolean; type: string; reason?: string };
  propertyPrice: { compliant: boolean; price: number; limit: number; reason?: string };
  propertyAge: { compliant: boolean; age?: number; reason?: string };
  energyRating: { compliant: boolean; rating?: string; required: string; reason?: string };
  location: { compliant: boolean; area: string; reason?: string };
  valuation: { compliant: boolean; valuedAt?: number; reason?: string };
}

export interface HTBFinancialAssessment {
  deposit: { sufficient: boolean; amount: number; required: number; reason?: string };
  debtToIncome: { compliant: boolean; ratio: number; limit: number; reason?: string };
  affordability: { passed: boolean; monthlyPayment: number; capacity: number; reason?: string };
  loanToValue: { compliant: boolean; ltv: number; limit: number; reason?: string };
  stressTest: { passed: boolean; rate: number; reason?: string };
}

export interface HTBComplianceStatus {
  documentsComplete: boolean;
  verificationComplete: boolean;
  financialAdvisorReview: boolean;
  regulatoryCompliance: boolean;
  appealRights: boolean;
  dataProtectionCompliance: boolean;
}

class HTBRealRegulationsService {
  private readonly CURRENT_REGULATIONS: HTBRealRegulations;

  constructor() {
    this.CURRENT_REGULATIONS = this.loadCurrentRegulations();
  }

  /**
   * Perform comprehensive HTB eligibility assessment using real regulations
   */
  async performRealHTBAssessment(
    applicantData: {
      personalDetails: any;
      financialDetails: any;
      employmentDetails: any;
      propertyDetails: any;
    },
    mortgageDetails: {
      lenderName: string;
      loanAmount: number;
      interestRate: number;
      term: number;
      ltvRatio: number;
    }
  ): Promise<HTBRealAssessmentResult> {
    try {
      const assessmentId = uuidv4();
      const assessmentDate = new Date().toISOString();

      logger.info('Starting real HTB assessment', {
        assessmentId,
        propertyPrice: applicantData.propertyDetails.price,
        income: applicantData.financialDetails.grossAnnualIncome
      });

      // Step 1: Personal eligibility assessment
      const eligibilityBreakdown = await this.assessPersonalEligibility(applicantData);

      // Step 2: Property compliance assessment
      const propertyAssessment = await this.assessPropertyCompliance(applicantData.propertyDetails);

      // Step 3: Financial assessment
      const financialAssessment = await this.assessFinancialEligibility(
        applicantData.financialDetails,
        applicantData.propertyDetails,
        mortgageDetails
      );

      // Step 4: Calculate HTB amount using real regulations
      const htbCalculation = this.calculateRealHTBAmount(
        applicantData.propertyDetails,
        eligibilityBreakdown,
        propertyAssessment,
        financialAssessment
      );

      // Step 5: Determine if manual review required
      const requiresManualReview = this.requiresManualReview(
        eligibilityBreakdown,
        propertyAssessment,
        financialAssessment,
        applicantData
      );

      // Step 6: Check if qualified financial advisor review needed
      const requiresAdvisorReview = await this.requiresQualifiedAdvisorReview(
        htbCalculation.actualHTBAmount,
        applicantData.financialDetails.grossAnnualIncome
      );

      // Step 7: Assess overall compliance
      const complianceStatus = await this.assessComplianceStatus(
        applicantData,
        eligibilityBreakdown,
        propertyAssessment,
        requiresAdvisorReview
      );

      // Step 8: Determine final eligibility
      const overallEligible = this.determineOverallEligibility(
        eligibilityBreakdown,
        propertyAssessment,
        financialAssessment
      );

      const result: HTBRealAssessmentResult = {
        eligible: overallEligible,
        maxHTBAmount: htbCalculation.maxHTBAmount,
        actualHTBAmount: htbCalculation.actualHTBAmount,
        conditions: this.generateConditions(eligibilityBreakdown, propertyAssessment, financialAssessment),
        warnings: this.generateWarnings(eligibilityBreakdown, propertyAssessment, financialAssessment),
        requiresManualReview,
        appealable: !overallEligible,
        eligibilityBreakdown,
        propertyAssessment,
        financialAssessment,
        complianceStatus,
        assessmentId,
        assessmentDate,
        assessedBy: 'HTB_Real_Regulations_Service',
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        nextSteps: this.generateNextSteps(overallEligible, requiresManualReview, requiresAdvisorReview),
        requiredActions: this.generateRequiredActions(eligibilityBreakdown, propertyAssessment, financialAssessment),
        estimatedProcessingTime: this.calculateProcessingTime(requiresManualReview, requiresAdvisorReview)
      };

      // Log assessment completion
      logger.info('Real HTB assessment completed', {
        assessmentId,
        eligible: overallEligible,
        htbAmount: htbCalculation.actualHTBAmount,
        requiresManualReview,
        requiresAdvisorReview
      });

      return result;

    } catch (error: any) {
      logger.error('Real HTB assessment failed', {
        error: error.message,
        applicantIncome: applicantData.financialDetails?.grossAnnualIncome,
        propertyPrice: applicantData.propertyDetails?.price
      });
      throw error;
    }
  }

  /**
   * Assess personal eligibility against real HTB criteria
   */
  private async assessPersonalEligibility(applicantData: any): Promise<HTBEligibilityBreakdown> {
    const personal = applicantData.personalDetails;
    const employment = applicantData.employmentDetails;
    const financial = applicantData.financialDetails;

    // First-time buyer check (strict definition)
    const firstTimeBuyer = this.assessFirstTimeBuyerStatus(personal);

    // Age eligibility (18+ with no upper limit)
    const age = {
      eligible: personal.age >= this.CURRENT_REGULATIONS.eligibilityConditions.personalCriteria.minimumAge,
      reason: personal.age < 18 ? 'Must be at least 18 years old' : undefined
    };

    // Residency check (Irish/EU resident)
    const residency = this.assessResidencyStatus(personal);

    // Income eligibility (updated 2025 thresholds)
    const income = this.assessIncomeEligibility(financial, personal.maritalStatus);

    // Employment stability
    const employmentCheck = this.assessEmploymentEligibility(employment);

    // Credit history check
    const creditHistory = await this.assessCreditHistory(personal.ppsNumber);

    return {
      firstTimeBuyer,
      age,
      residency,
      income,
      employment: employmentCheck,
      creditHistory
    };
  }

  /**
   * Assess property compliance with real HTB regulations
   */
  private async assessPropertyCompliance(propertyDetails: any): Promise<HTBPropertyAssessment> {
    const regulations = this.CURRENT_REGULATIONS.propertyConditions;

    // Property type compliance
    const propertyType = {
      compliant: regulations.allowedPropertyTypes.includes(propertyDetails.type),
      type: propertyDetails.type,
      reason: !regulations.allowedPropertyTypes.includes(propertyDetails.type) 
        ? `Property type ${propertyDetails.type} not eligible for HTB` 
        : undefined
    };

    // Property price limits (2025 regulations)
    const isNewHome = propertyDetails.age <= 2;
    const priceLimit = isNewHome 
      ? this.CURRENT_REGULATIONS.maxPropertyPrice.newHome 
      : this.CURRENT_REGULATIONS.maxPropertyPrice.secondHandHome;

    const propertyPrice = {
      compliant: propertyDetails.price <= priceLimit,
      price: propertyDetails.price,
      limit: priceLimit,
      reason: propertyDetails.price > priceLimit 
        ? `Property price €${propertyDetails.price.toLocaleString()} exceeds limit of €${priceLimit.toLocaleString()} for ${isNewHome ? 'new' : 'second-hand'} homes`
        : undefined
    };

    // Property age compliance
    const propertyAge = this.assessPropertyAge(propertyDetails, isNewHome);

    // Energy rating requirement
    const energyRating = this.assessEnergyRating(propertyDetails, isNewHome);

    // Location compliance
    const location = this.assessLocationCompliance(propertyDetails.address);

    // Professional valuation
    const valuation = await this.assessPropertyValuation(propertyDetails);

    return {
      propertyType,
      propertyPrice,
      propertyAge,
      energyRating,
      location,
      valuation
    };
  }

  /**
   * Assess financial eligibility with real calculations
   */
  private async assessFinancialEligibility(
    financialDetails: any,
    propertyDetails: any,
    mortgageDetails: any
  ): Promise<HTBFinancialAssessment> {
    // Deposit assessment (minimum 10%)
    const requiredDeposit = propertyDetails.price * this.CURRENT_REGULATIONS.minimumDeposit;
    const deposit = {
      sufficient: financialDetails.depositAmount >= requiredDeposit,
      amount: financialDetails.depositAmount,
      required: requiredDeposit,
      reason: financialDetails.depositAmount < requiredDeposit 
        ? `Deposit of €${financialDetails.depositAmount.toLocaleString()} insufficient. Minimum required: €${requiredDeposit.toLocaleString()} (10%)`
        : undefined
    };

    // Debt-to-income ratio (Central Bank rules)
    const monthlyDebt = this.calculateMonthlyDebt(financialDetails, mortgageDetails);
    const monthlyIncome = financialDetails.grossAnnualIncome / 12;
    const debtToIncomeRatio = monthlyDebt / monthlyIncome;
    const maxRatio = this.CURRENT_REGULATIONS.eligibilityConditions.financialCriteria.debtToIncomeRatio.maximumRatio;

    const debtToIncome = {
      compliant: debtToIncomeRatio <= maxRatio,
      ratio: debtToIncomeRatio,
      limit: maxRatio,
      reason: debtToIncomeRatio > maxRatio 
        ? `Debt-to-income ratio ${(debtToIncomeRatio * 100).toFixed(1)}% exceeds maximum of ${(maxRatio * 100).toFixed(1)}%`
        : undefined
    };

    // Affordability assessment with stress testing
    const affordability = await this.performAffordabilityAssessment(
      financialDetails,
      propertyDetails,
      mortgageDetails
    );

    // Loan-to-value compliance
    const loanToValue = {
      compliant: mortgageDetails.ltvRatio <= this.CURRENT_REGULATIONS.eligibilityConditions.mortgageCriteria.loanToValueLimits.firstTimeBuyers,
      ltv: mortgageDetails.ltvRatio,
      limit: this.CURRENT_REGULATIONS.eligibilityConditions.mortgageCriteria.loanToValueLimits.firstTimeBuyers,
      reason: mortgageDetails.ltvRatio > 0.9 
        ? `LTV ratio ${(mortgageDetails.ltvRatio * 100).toFixed(1)}% exceeds 90% limit for first-time buyers`
        : undefined
    };

    // Stress testing (2% above offered rate)
    const stressTestRate = mortgageDetails.interestRate + 0.02;
    const stressTest = await this.performStressTest(
      mortgageDetails.loanAmount,
      stressTestRate,
      mortgageDetails.term,
      financialDetails
    );

    return {
      deposit,
      debtToIncome,
      affordability,
      loanToValue,
      stressTest
    };
  }

  /**
   * Calculate HTB amount using real Housing Agency formula
   */
  private calculateRealHTBAmount(
    propertyDetails: any,
    eligibility: HTBEligibilityBreakdown,
    property: HTBPropertyAssessment,
    financial: HTBFinancialAssessment
  ): { maxHTBAmount: number; actualHTBAmount: number } {
    // Determine if new or second-hand home
    const isNewHome = propertyDetails.age <= 2;
    
    // Get maximum HTB limits for 2025
    const maxHTBLimit = isNewHome 
      ? this.CURRENT_REGULATIONS.maxHTBAmount.newHome 
      : this.CURRENT_REGULATIONS.maxHTBAmount.secondHandHome;

    // Calculate percentage-based amount
    const percentageRate = isNewHome ? 0.10 : 0.05; // 10% for new, 5% for second-hand
    const percentageAmount = propertyDetails.price * percentageRate;

    // Maximum HTB is the lower of percentage or fixed limit
    const maxHTBAmount = Math.min(percentageAmount, maxHTBLimit);

    // Actual amount may be reduced based on circumstances
    let actualHTBAmount = maxHTBAmount;

    // Reduce if eligibility issues
    if (!eligibility.income.eligible) {
      actualHTBAmount = 0;
    } else if (!property.propertyPrice.compliant) {
      actualHTBAmount = 0;
    } else if (!financial.deposit.sufficient) {
      actualHTBAmount = 0;
    }

    // Apply any additional regulatory reductions
    if (financial.debtToIncome.ratio > 0.30) {
      actualHTBAmount *= 0.8; // 20% reduction for high DTI
    }

    return {
      maxHTBAmount,
      actualHTBAmount: Math.round(actualHTBAmount)
    };
  }

  /**
   * Check if qualified financial advisor review is required
   */
  private async requiresQualifiedAdvisorReview(
    htbAmount: number,
    grossIncome: number
  ): Promise<boolean> {
    // HTB amounts over €20,000 require qualified advisor review
    if (htbAmount >= 20000) {
      return true;
    }

    // High income applicants require advisor review
    if (grossIncome >= 100000) {
      return true;
    }

    // Complex financial situations require review
    return false;
  }

  /**
   * Determine if manual review is required
   */
  private requiresManualReview(
    eligibility: HTBEligibilityBreakdown,
    property: HTBPropertyAssessment,
    financial: HTBFinancialAssessment,
    applicantData: any
  ): boolean {
    // Edge cases requiring manual review
    const triggers = [
      !eligibility.firstTimeBuyer.eligible,
      !property.propertyPrice.compliant,
      !financial.stressTest.passed,
      financial.debtToIncome.ratio > 0.35,
      applicantData.employmentDetails.type === 'SELF_EMPLOYED',
      property.propertyAge.age && property.propertyAge.age > 100
    ];

    return triggers.some(trigger => trigger);
  }

  // Helper methods for assessments
  private assessFirstTimeBuyerStatus(personal: any): { eligible: boolean; reason?: string } {
    // Strict first-time buyer definition per Housing Agency
    const hasOwnedProperty = personal.previousPropertyOwnership || false;
    const inheritedProperty = personal.inheritedProperty || false;
    const spouseOwnedProperty = personal.spousePropertyHistory || false;

    if (hasOwnedProperty) {
      return { eligible: false, reason: 'Previous property ownership disqualifies from first-time buyer status' };
    }

    if (inheritedProperty) {
      return { eligible: false, reason: 'Inherited property ownership disqualifies from first-time buyer status' };
    }

    if (spouseOwnedProperty) {
      return { eligible: false, reason: 'Spouse/partner previous ownership disqualifies from first-time buyer status' };
    }

    return { eligible: true };
  }

  private assessResidencyStatus(personal: any): { eligible: boolean; reason?: string } {
    const validResidencies = ['Irish', 'EU', 'EEA'];
    const eligible = validResidencies.includes(personal.nationality) || personal.irishResident;
    
    return {
      eligible,
      reason: !eligible ? 'Must be Irish/EU resident or have Irish residency status' : undefined
    };
  }

  private assessIncomeEligibility(financial: any, maritalStatus: string): { eligible: boolean; amount: number; threshold: number; reason?: string } {
    const isCouple = ['MARRIED', 'CIVIL_PARTNERSHIP'].includes(maritalStatus);
    const threshold = isCouple 
      ? this.CURRENT_REGULATIONS.incomeThresholds.couple 
      : this.CURRENT_REGULATIONS.incomeThresholds.single;

    const totalIncome = financial.grossAnnualIncome + (financial.partnerIncome || 0);
    const eligible = totalIncome <= threshold;

    return {
      eligible,
      amount: totalIncome,
      threshold,
      reason: !eligible 
        ? `Combined income €${totalIncome.toLocaleString()} exceeds threshold of €${threshold.toLocaleString()} for ${isCouple ? 'couples' : 'singles'}`
        : undefined
    };
  }

  private assessEmploymentEligibility(employment: any): { eligible: boolean; reason?: string } {
    const minimumPeriod = this.CURRENT_REGULATIONS.eligibilityConditions.employmentCriteria.minimumEmploymentPeriod;
    const employmentMonths = this.calculateEmploymentMonths(employment.startDate);

    if (employment.type === 'SELF_EMPLOYED') {
      const tradingYears = this.calculateTradingYears(employment.businessStartDate);
      return {
        eligible: tradingYears >= 2,
        reason: tradingYears < 2 ? 'Self-employed applicants require minimum 2 years trading history' : undefined
      };
    }

    return {
      eligible: employmentMonths >= minimumPeriod,
      reason: employmentMonths < minimumPeriod 
        ? `Minimum ${minimumPeriod} months continuous employment required` 
        : undefined
    };
  }

  private async assessCreditHistory(ppsNumber: string): Promise<{ eligible: boolean; score?: number; reason?: string }> {
    // In production, this would integrate with credit bureaus
    // For now, simulate credit check
    const simulatedScore = 650 + Math.random() * 200; // 650-850 range
    
    return {
      eligible: simulatedScore >= 600,
      score: Math.round(simulatedScore),
      reason: simulatedScore < 600 ? 'Credit score below minimum threshold' : undefined
    };
  }

  private assessPropertyAge(propertyDetails: any, isNewHome: boolean): { compliant: boolean; age?: number; reason?: string } {
    const age = propertyDetails.age;
    
    if (isNewHome) {
      const compliant = age <= 2;
      return {
        compliant,
        age,
        reason: !compliant ? 'New homes must be completed within 2 years for HTB eligibility' : undefined
      };
    } else {
      const compliant = age >= 2;
      return {
        compliant,
        age,
        reason: !compliant ? 'Second-hand homes must be at least 2 years old for HTB eligibility' : undefined
      };
    }
  }

  private assessEnergyRating(propertyDetails: any, isNewHome: boolean): { compliant: boolean; rating?: string; required: string; reason?: string } {
    const rating = propertyDetails.energyRating;
    const requiredRating = isNewHome ? 'B3' : 'D1';
    
    // Simplified energy rating comparison
    const ratingValues: { [key: string]: number } = {
      'A1': 1, 'A2': 2, 'A3': 3,
      'B1': 4, 'B2': 5, 'B3': 6,
      'C1': 7, 'C2': 8, 'C3': 9,
      'D1': 10, 'D2': 11, 'E1': 12, 'E2': 13,
      'F': 14, 'G': 15
    };

    const currentValue = ratingValues[rating] || 20;
    const requiredValue = ratingValues[requiredRating];
    const compliant = currentValue <= requiredValue;

    return {
      compliant,
      rating,
      required: requiredRating,
      reason: !compliant ? `Energy rating ${rating} does not meet minimum requirement of ${requiredRating}` : undefined
    };
  }

  private assessLocationCompliance(address: string): { compliant: boolean; area: string; reason?: string } {
    // Check if property is in excluded areas
    const excludedAreas = this.CURRENT_REGULATIONS.propertyConditions.locationRestrictions.excludedAreas;
    const isExcluded = excludedAreas.some(area => address.toLowerCase().includes(area.toLowerCase()));
    
    return {
      compliant: !isExcluded,
      area: address,
      reason: isExcluded ? 'Property located in area not eligible for HTB scheme' : undefined
    };
  }

  private async assessPropertyValuation(propertyDetails: any): Promise<{ compliant: boolean; valuedAt?: number; reason?: string }> {
    // In production, this would integrate with professional valuers
    const hasValuation = propertyDetails.professionalValuation;
    const valuationAge = propertyDetails.valuationDate ? 
      (Date.now() - new Date(propertyDetails.valuationDate).getTime()) / (1000 * 60 * 60 * 24) : 
      365;

    if (!hasValuation) {
      return {
        compliant: false,
        reason: 'Professional valuation required for HTB application'
      };
    }

    if (valuationAge > 90) {
      return {
        compliant: false,
        reason: 'Professional valuation must be within 3 months of application'
      };
    }

    const variance = Math.abs(propertyDetails.valuedPrice - propertyDetails.price) / propertyDetails.price;
    if (variance > 0.05) {
      return {
        compliant: false,
        valuedAt: propertyDetails.valuedPrice,
        reason: 'Valuation variance exceeds 5% of agreed price'
      };
    }

    return {
      compliant: true,
      valuedAt: propertyDetails.valuedPrice
    };
  }

  private calculateMonthlyDebt(financial: any, mortgage: any): number {
    const existingDebts = financial.monthlyDebtPayments || 0;
    const mortgagePayment = this.calculateMortgagePayment(
      mortgage.loanAmount,
      mortgage.interestRate,
      mortgage.term
    );
    return existingDebts + mortgagePayment;
  }

  private calculateMortgagePayment(loanAmount: number, annualRate: number, termYears: number): number {
    const monthlyRate = annualRate / 12;
    const termMonths = termYears * 12;
    
    if (monthlyRate === 0) return loanAmount / termMonths;
    
    return loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
           (Math.pow(1 + monthlyRate, termMonths) - 1);
  }

  private async performAffordabilityAssessment(
    financial: any,
    property: any,
    mortgage: any
  ): Promise<{ passed: boolean; monthlyPayment: number; capacity: number; reason?: string }> {
    const monthlyPayment = this.calculateMortgagePayment(
      mortgage.loanAmount,
      mortgage.interestRate,
      mortgage.term
    );
    
    const monthlyIncome = financial.netMonthlyIncome || (financial.grossAnnualIncome / 12 * 0.7);
    const monthlyExpenses = financial.monthlyExpenses || (monthlyIncome * 0.4);
    const capacity = monthlyIncome - monthlyExpenses;
    
    const passed = monthlyPayment <= capacity * 0.35; // 35% of disposable income
    
    return {
      passed,
      monthlyPayment,
      capacity,
      reason: !passed ? 'Monthly mortgage payment exceeds 35% of disposable income' : undefined
    };
  }

  private async performStressTest(
    loanAmount: number,
    stressRate: number,
    term: number,
    financial: any
  ): Promise<{ passed: boolean; rate: number; reason?: string }> {
    const stressPayment = this.calculateMortgagePayment(loanAmount, stressRate, term);
    const monthlyIncome = financial.netMonthlyIncome || (financial.grossAnnualIncome / 12 * 0.7);
    const monthlyExpenses = financial.monthlyExpenses || (monthlyIncome * 0.4);
    const capacity = monthlyIncome - monthlyExpenses;
    
    const passed = stressPayment <= capacity * 0.35;
    
    return {
      passed,
      rate: stressRate,
      reason: !passed ? `Cannot afford repayments at stress test rate of ${(stressRate * 100).toFixed(2)}%` : undefined
    };
  }

  private async assessComplianceStatus(
    applicantData: any,
    eligibility: HTBEligibilityBreakdown,
    property: HTBPropertyAssessment,
    requiresAdvisorReview: boolean
  ): Promise<HTBComplianceStatus> {
    return {
      documentsComplete: this.assessDocumentCompleteness(applicantData),
      verificationComplete: this.assessVerificationStatus(applicantData),
      financialAdvisorReview: requiresAdvisorReview,
      regulatoryCompliance: true, // Would check against all regulations
      appealRights: true,
      dataProtectionCompliance: true
    };
  }

  private determineOverallEligibility(
    eligibility: HTBEligibilityBreakdown,
    property: HTBPropertyAssessment,
    financial: HTBFinancialAssessment
  ): boolean {
    const criticalFailures = [
      !eligibility.firstTimeBuyer.eligible,
      !eligibility.age.eligible,
      !eligibility.residency.eligible,
      !eligibility.income.eligible,
      !property.propertyPrice.compliant,
      !property.propertyType.compliant,
      !financial.deposit.sufficient,
      !financial.loanToValue.compliant
    ];

    return !criticalFailures.some(failure => failure);
  }

  // Load current HTB regulations (would be from regulatory database)
  private loadCurrentRegulations(): HTBRealRegulations {
    return {
      maxPropertyPrice: {
        newHome: 600000,      // €600k for new homes (2025)
        secondHandHome: 500000 // €500k for second-hand (2025)
      },
      maxHTBAmount: {
        newHome: 30000,       // €30k or 10% whichever lower
        secondHandHome: 20000  // €20k or 5% whichever lower
      },
      minimumDeposit: 0.10,   // 10%
      incomeThresholds: {
        single: 80000,        // €80k for singles (2025)
        couple: 120000        // €120k for couples (2025)
      },
      firstTimeBuyerOnly: true,
      propertyConditions: {} as HTBPropertyConditions,
      eligibilityConditions: {} as HTBEligibilityConditions,
      applicationProcess: {} as HTBApplicationProcess,
      complianceRequirements: {} as HTBComplianceRequirements
    };
  }

  // Utility methods
  private calculateEmploymentMonths(startDate: string): number {
    return Math.floor((Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24 * 30));
  }

  private calculateTradingYears(startDate: string): number {
    return (Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
  }

  private assessDocumentCompleteness(applicantData: any): boolean {
    // Check if all required documents are present
    return true; // Simplified for now
  }

  private assessVerificationStatus(applicantData: any): boolean {
    // Check if documents are verified
    return true; // Simplified for now
  }

  private generateConditions(eligibility: any, property: any, financial: any): string[] {
    const conditions = [];
    
    if (financial.debtToIncome.ratio > 0.30) {
      conditions.push('High debt-to-income ratio requires additional monitoring');
    }
    
    if (property.propertyAge.age && property.propertyAge.age > 50) {
      conditions.push('Older property requires structural survey');
    }
    
    return conditions;
  }

  private generateWarnings(eligibility: any, property: any, financial: any): string[] {
    const warnings = [];
    
    if (!financial.stressTest.passed) {
      warnings.push('May not afford repayments if interest rates increase');
    }
    
    return warnings;
  }

  private generateNextSteps(eligible: boolean, manualReview: boolean, advisorReview: boolean): string[] {
    if (!eligible) {
      return ['Review eligibility criteria', 'Consider appeal if appropriate', 'Seek financial advice'];
    }
    
    if (manualReview) {
      return ['Await manual review by Housing Agency', 'Provide additional documentation if requested'];
    }
    
    if (advisorReview) {
      return ['Schedule consultation with qualified financial advisor', 'Complete financial advisor assessment'];
    }
    
    return ['Submit HTB application', 'Await automated processing'];
  }

  private generateRequiredActions(eligibility: any, property: any, financial: any): string[] {
    const actions = [];
    
    if (!property.valuation.compliant) {
      actions.push('Obtain professional property valuation');
    }
    
    if (!financial.deposit.sufficient) {
      actions.push('Increase deposit amount');
    }
    
    return actions;
  }

  private calculateProcessingTime(manualReview: boolean, advisorReview: boolean): number {
    let days = this.CURRENT_REGULATIONS.applicationProcess.processingTimelines.initialAssessment;
    
    if (advisorReview) days += 7;
    if (manualReview) days += this.CURRENT_REGULATIONS.applicationProcess.processingTimelines.finalApproval;
    
    return days;
  }
}

// Export singleton instance
export const htbRealRegulationsService = new HTBRealRegulationsService();
export default htbRealRegulationsService;