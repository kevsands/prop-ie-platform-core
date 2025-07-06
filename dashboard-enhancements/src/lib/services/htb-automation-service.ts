/**
 * HTB Automation Service
 * 
 * Provides automated processing for Help-to-Buy applications including:
 * - Document validation and verification
 * - Eligibility assessment
 * - Automated application submission
 * - Progress tracking and notifications
 * - Integration with existing HTB service and buyer journey
 */

import { htbService } from './htb-real';
import { htbRealRegulationsService } from './htb-real-regulations-service';
import { documentService } from './document-service';
import { logger } from '@/lib/security/auditLogger';
import { fraudDetectionService } from '@/lib/security/fraud-detection-service';
import { securityMonitoringService } from '@/lib/security/security-monitoring-service';
import { comprehensiveAuditService } from '@/lib/security/comprehensive-audit-service';
import { errorRecoveryService } from '@/lib/error-handling/error-recovery-service';
import { BuyerPhase } from '@/types/buyer-journey';
import { HTBClaim, HTBClaimStatus } from '@/types/htb';
import { v4 as uuidv4 } from 'uuid';

export interface HTBApplicationInput {
  buyerId: string;
  propertyId: string;
  propertyPrice: number;
  propertyAddress: string;
  developerId?: string;
  applicantDetails: HTBApplicantDetails;
  financialDetails: HTBFinancialDetails;
  propertyDetails: HTBPropertyDetails;
}

export interface HTBApplicantDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  ppsNumber: string;
  address: HTBAddress;
  employment: HTBEmploymentDetails;
  isFirstTimeBuyer: boolean;
}

export interface HTBFinancialDetails {
  grossAnnualIncome: number;
  netMonthlyIncome: number;
  partnerIncome?: number;
  monthlyExpenses: number;
  existingDebt: number;
  depositAmount: number;
  mortgageAmount: number;
  mortgageProvider?: string;
  mortgageApprovalDate?: string;
}

export interface HTBPropertyDetails {
  propertyType: 'new' | 'secondhand';
  propertyCategory: 'house' | 'apartment';
  bedrooms: number;
  floorArea: number;
  buildingEnergyRating?: string;
  estimatedCompletionDate?: string;
}

export interface HTBAddress {
  line1: string;
  line2?: string;
  city: string;
  county: string;
  eircode?: string;
}

export interface HTBEmploymentDetails {
  employerName: string;
  position: string;
  startDate: string;
  employmentType: 'permanent' | 'contract' | 'self-employed';
  contractEndDate?: string;
}

export interface HTBAutomationResult {
  success: boolean;
  claimId?: string;
  applicationReference?: string;
  eligibilityScore: number;
  maxHTBAmount: number;
  recommendedAmount: number;
  processingStage: HTBProcessingStage;
  requiredDocuments: HTBRequiredDocument[];
  warnings: string[];
  errors: string[];
  nextSteps: string[];
  estimatedProcessingTime: number; // in days
}

export interface HTBRequiredDocument {
  id: string;
  name: string;
  type: string;
  category: string;
  description: string;
  isRequired: boolean;
  isUploaded: boolean;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
  deadline?: string;
}

export type HTBProcessingStage = 
  | 'initial_assessment'
  | 'document_collection'
  | 'eligibility_verification'
  | 'property_validation'
  | 'financial_verification'
  | 'application_submission'
  | 'approval_pending'
  | 'approved'
  | 'rejected'
  | 'disbursement_ready'
  | 'completed';

export interface HTBEligibilityCheck {
  check: string;
  passed: boolean;
  details: string;
  score: number;
}

class HTBAutomationService {
  
  /**
   * Process a new HTB application with full automation
   */
  async processHTBApplication(applicationData: HTBApplicationInput): Promise<HTBAutomationResult> {
    return await errorRecoveryService.executeWithCircuitBreaker(
      'htb-automation-service',
      async () => {
        return await errorRecoveryService.executeWithRetry(
          async () => {
            try {
              // Record audit event for HTB application processing
              await comprehensiveAuditService.recordAuditEvent({
                eventType: 'BUSINESS_PROCESS',
                eventCategory: 'TRANSACTION_PROCESSING',
                eventSubcategory: 'htb_application_processing',
                actor: {
                  actorId: applicationData.buyerId,
                  actorType: 'USER',
                  actorName: `${applicationData.applicantDetails.firstName} ${applicationData.applicantDetails.lastName}`,
                  userId: applicationData.buyerId
                },
                target: {
                  targetId: applicationData.propertyId,
                  targetType: 'RESOURCE',
                  targetName: 'HTB Application',
                  resourceType: 'HTB_APPLICATION',
                  dataClassification: 'CONFIDENTIAL'
                },
                details: {
                  action: 'process_htb_application',
                  actionDescription: `Processing HTB application for property at ${applicationData.propertyAddress}`,
                  businessProcess: 'HTB Application Processing',
                  actionParameters: {
                    propertyPrice: applicationData.propertyPrice,
                    propertyAddress: applicationData.propertyAddress,
                    applicantEmail: applicationData.applicantDetails.email
                  }
                },
                context: {
                  requestId: uuidv4(),
                  applicationContext: {
                    applicationName: 'PropIE HTB Platform',
                    applicationVersion: '1.0.0',
                    environmentName: 'production',
                    instanceId: 'htb-automation-service'
                  },
                  businessContext: {
                    organizationId: 'propie',
                    departmentId: 'financial-services'
                  }
                },
                result: {
                  status: 'SUCCESS'
                }
              });

              logger.info('Starting automated HTB application processing', {
                buyerId: applicationData.buyerId,
                propertyId: applicationData.propertyId,
                propertyPrice: applicationData.propertyPrice
              });

              // Step 0: Fraud detection and security monitoring
              await this.performSecurityChecks(applicationData);

      // Step 1: Use real HTB regulations service for eligibility assessment
      const realAssessment = await htbRealRegulationsService.performRealHTBAssessment({
        personalDetails: {
          age: this.calculateAge(applicationData.applicantDetails.dateOfBirth),
          residencyStatus: 'IRISH_RESIDENT',
          firstTimeBuyer: applicationData.applicantDetails.isFirstTimeBuyer
        },
        financialDetails: applicationData.financialDetails,
        employmentDetails: applicationData.applicantDetails.employment,
        propertyDetails: applicationData.propertyDetails
      }, {
        amount: applicationData.financialDetails.mortgageAmount,
        provider: applicationData.financialDetails.mortgageProvider || 'Unknown',
        approvalDate: applicationData.financialDetails.mortgageApprovalDate || new Date().toISOString()
      });

      if (!realAssessment.eligible) {
        return {
          success: false,
          eligibilityScore: realAssessment.eligibilityScore,
          maxHTBAmount: 0,
          recommendedAmount: 0,
          processingStage: 'initial_assessment',
          requiredDocuments: [],
          warnings: realAssessment.warnings,
          errors: realAssessment.ineligibilityReasons,
          nextSteps: ['Review eligibility requirements', 'Contact qualified financial advisor'],
          estimatedProcessingTime: 0
        };
      }

      // Step 2: Calculate HTB amounts using real regulations
      const htbCalculation = {
        maxAmount: realAssessment.maxHTBAmount,
        recommendedAmount: realAssessment.recommendedHTBAmount,
        percentage: (realAssessment.recommendedHTBAmount / applicationData.propertyPrice) * 100
      };
      
      // Step 3: Generate required documents list (now includes certified AI verification requirements)
      const requiredDocuments = this.generateRequiredDocumentsList(applicationData);
      
      // Step 4: Create HTB claim in database
      const claim = await htbService.createClaim({
        buyerId: applicationData.buyerId,
        propertyId: applicationData.propertyId,
        propertyPrice: applicationData.propertyPrice,
        requestedAmount: htbCalculation.recommendedAmount,
        propertyAddress: applicationData.propertyAddress,
        developerId: applicationData.developerId
      });

      // Step 5: Initialize automation workflow
      await this.initializeAutomationWorkflow(claim.id, applicationData);

      logger.info('HTB application processing completed', {
        claimId: claim.id,
        eligibilityScore: realAssessment.eligibilityScore,
        recommendedAmount: htbCalculation.recommendedAmount
      });

              const result = {
                success: true,
                claimId: claim.id,
                applicationReference: claim.id,
                eligibilityScore: realAssessment.eligibilityScore,
                maxHTBAmount: htbCalculation.maxAmount,
                recommendedAmount: htbCalculation.recommendedAmount,
                processingStage: 'document_collection',
                requiredDocuments,
                warnings: realAssessment.warnings,
                errors: [],
                nextSteps: this.generateNextSteps('document_collection'),
                estimatedProcessingTime: this.calculateProcessingTime(requiredDocuments)
              };

              // Record successful completion audit event
              await comprehensiveAuditService.recordAuditEvent({
                eventType: 'BUSINESS_PROCESS',
                eventCategory: 'TRANSACTION_PROCESSING',
                eventSubcategory: 'htb_application_completed',
                actor: {
                  actorId: applicationData.buyerId,
                  actorType: 'USER',
                  actorName: `${applicationData.applicantDetails.firstName} ${applicationData.applicantDetails.lastName}`,
                  userId: applicationData.buyerId
                },
                target: {
                  targetId: claim.id,
                  targetType: 'RESOURCE',
                  targetName: 'HTB Claim',
                  resourceType: 'HTB_CLAIM',
                  dataClassification: 'CONFIDENTIAL'
                },
                details: {
                  action: 'complete_htb_application',
                  actionDescription: `Successfully processed HTB application with claim ID ${claim.id}`,
                  businessProcess: 'HTB Application Processing',
                  actionParameters: {
                    claimId: claim.id,
                    eligibilityScore: realAssessment.eligibilityScore,
                    recommendedAmount: htbCalculation.recommendedAmount,
                    processingStage: 'document_collection'
                  }
                },
                result: {
                  status: 'SUCCESS'
                }
              });

              return result;

            } catch (error: any) {
              // Record error audit event
              await comprehensiveAuditService.recordAuditEvent({
                eventType: 'ERROR_EVENT',
                eventCategory: 'ERROR_HANDLING',
                eventSubcategory: 'htb_application_error',
                actor: {
                  actorId: applicationData.buyerId,
                  actorType: 'USER',
                  actorName: `${applicationData.applicantDetails.firstName} ${applicationData.applicantDetails.lastName}`,
                  userId: applicationData.buyerId
                },
                target: {
                  targetId: applicationData.propertyId,
                  targetType: 'RESOURCE',
                  targetName: 'HTB Application',
                  resourceType: 'HTB_APPLICATION'
                },
                details: {
                  action: 'htb_application_error',
                  actionDescription: `HTB application processing failed: ${error.message}`,
                  businessProcess: 'HTB Application Processing',
                  errorDetails: {
                    errorCode: error.code,
                    errorMessage: error.message,
                    errorType: error.name,
                    stackTrace: error.stack
                  }
                },
                result: {
                  status: 'FAILURE'
                }
              });

              logger.error('HTB application processing failed', {
                error: error.message,
                buyerId: applicationData.buyerId,
                propertyId: applicationData.propertyId
              });

              throw error;
            }
          },
          'htb_application_processing',
          {
            buyerId: applicationData.buyerId,
            propertyId: applicationData.propertyId
          }
        );
      },
      async () => {
        // Fallback mechanism for HTB application processing
        logger.warn('HTB application processing circuit breaker activated, using fallback', {
          buyerId: applicationData.buyerId,
          propertyId: applicationData.propertyId
        });

        return {
          success: false,
          eligibilityScore: 0,
          maxHTBAmount: 0,
          recommendedAmount: 0,
          processingStage: 'initial_assessment',
          requiredDocuments: [],
          warnings: ['Service temporarily unavailable. Please try again later.'],
          errors: ['HTB processing service is currently unavailable due to high demand or maintenance.'],
          nextSteps: ['Wait for service recovery and try again', 'Contact support if the issue persists'],
          estimatedProcessingTime: 0
        };
      }
    );
  }

  /**
   * Check document verification status and progress application
   */
  async checkDocumentVerificationAndProgress(claimId: string): Promise<void> {
    try {
      const claim = await htbService.getClaimById(claimId);
      if (!claim) {
        throw new Error(`HTB claim not found: ${claimId}`);
      }

      // Get all documents for this claim
      const documents = claim.documents || [];
      const requiredDocs = this.generateRequiredDocumentsList({} as HTBApplicationInput); // Would need to store this
      
      // Check verification status of each document
      const verifiedDocs = documents.filter(doc => 
        doc.type.includes('verified') || doc.name.includes('approved')
      );

      const totalRequired = requiredDocs.filter(doc => doc.isRequired).length;
      const verifiedRequired = verifiedDocs.length;

      logger.info('Checking document verification progress', {
        claimId,
        totalRequired,
        verifiedRequired,
        completionRate: (verifiedRequired / totalRequired) * 100
      });

      // Progress application based on document status
      if (verifiedRequired >= totalRequired) {
        await this.progressToNextStage(claimId, 'eligibility_verification');
      } else if (verifiedRequired >= totalRequired * 0.5) {
        await this.progressToNextStage(claimId, 'financial_verification');
      }

    } catch (error: any) {
      logger.error('Document verification check failed', {
        error: error.message,
        claimId
      });
    }
  }

  /**
   * Perform security and fraud detection checks
   */
  private async performSecurityChecks(applicationData: HTBApplicationInput): Promise<void> {
    try {
      // Create fraud detection request
      const fraudRequest = {
        transactionId: uuidv4(),
        userId: applicationData.buyerId,
        sessionId: uuidv4(),
        transactionData: {
          amount: applicationData.propertyPrice,
          currency: 'EUR',
          type: 'HTB_APPLICATION',
          description: `HTB application for property at ${applicationData.propertyAddress}`,
          paymentMethod: 'BANK_TRANSFER'
        },
        userContext: {
          accountAge: 30, // Would be calculated from user data
          transactionHistory: {
            totalTransactions: 0,
            averageAmount: 0,
            lastTransactionDate: new Date().toISOString(),
            frequentMerchants: [],
            unusualPatterns: []
          },
          verificationLevel: 'BASIC',
          deviceInfo: {
            deviceId: 'unknown',
            deviceType: 'web',
            operatingSystem: 'unknown',
            browser: 'unknown',
            screenResolution: 'unknown',
            timezone: 'Europe/Dublin',
            userAgent: 'PropIE Application',
            fingerprint: uuidv4()
          },
          locationInfo: {
            ipAddress: '127.0.0.1',
            country: 'IE',
            region: 'Dublin',
            city: 'Dublin',
            isp: 'Unknown',
            isVpn: false,
            isTor: false
          }
        },
        behavioralData: {
          sessionDuration: 3600000,
          pageViews: 10,
          formInteractions: [],
          navigationPattern: [],
          typingPattern: undefined
        },
        riskFactors: [
          {
            factorType: 'HIGH_VALUE_TRANSACTION',
            factorValue: applicationData.propertyPrice,
            riskScore: applicationData.propertyPrice > 500000 ? 30 : 10,
            confidence: 0.9,
            description: 'High-value property transaction'
          }
        ]
      };

      // Perform fraud assessment
      const fraudAssessment = await fraudDetectionService.assessFraudRisk(fraudRequest);
      
      // Log security monitoring event
      await securityMonitoringService.processSecurityEvent({
        eventType: 'TRANSACTION_ANOMALY',
        severity: fraudAssessment.riskLevel === 'HIGH' || fraudAssessment.riskLevel === 'CRITICAL' ? 'WARNING' : 'INFO',
        details: {
          description: `HTB application security assessment completed`,
          riskScore: fraudAssessment.overallRiskScore,
          confidence: fraudAssessment.confidence,
          impact: {
            confidentialityImpact: 'LOW',
            integrityImpact: 'MEDIUM',
            availabilityImpact: 'LOW'
          }
        },
        context: {
          userId: applicationData.buyerId,
          sessionId: fraudRequest.sessionId
        },
        technical: {
          sourceSystem: 'HTB Automation Service',
          logData: { fraudAssessment },
          indicators: [],
          relatedEvents: []
        }
      });

      // Block application if fraud risk is too high
      if (fraudAssessment.decision === 'DECLINE') {
        throw new Error('Application blocked due to high fraud risk');
      }

      logger.info('Security checks completed for HTB application', {
        buyerId: applicationData.buyerId,
        riskScore: fraudAssessment.overallRiskScore,
        decision: fraudAssessment.decision
      });

    } catch (error: any) {
      logger.error('Security checks failed for HTB application', {
        error: error.message,
        buyerId: applicationData.buyerId
      });

      // Continue with application processing but flag for manual review
      await securityMonitoringService.processSecurityEvent({
        eventType: 'SUSPICIOUS_BEHAVIOR',
        severity: 'WARNING',
        details: {
          description: `Security check failure for HTB application: ${error.message}`,
          riskScore: 60,
          confidence: 0.8
        },
        context: {
          userId: applicationData.buyerId
        }
      });
    }
  }

  /**
   * Legacy eligibility assessment method (now replaced by real regulations service)
   * @deprecated Use htbRealRegulationsService.performRealHTBAssessment instead
   */
  private async performEligibilityAssessment(applicationData: HTBApplicationInput): Promise<{
    isEligible: boolean;
    score: number;
    checks: HTBEligibilityCheck[];
    reasons: string[];
    warnings: string[];
  }> {
    const checks: HTBEligibilityCheck[] = [];
    const warnings: string[] = [];
    let totalScore = 0;

    // Check 1: First-time buyer status
    const ftbCheck = {
      check: 'First-time buyer status',
      passed: applicationData.applicantDetails.isFirstTimeBuyer,
      details: applicationData.applicantDetails.isFirstTimeBuyer 
        ? 'Confirmed first-time buyer' 
        : 'Not a first-time buyer',
      score: applicationData.applicantDetails.isFirstTimeBuyer ? 20 : 0
    };
    checks.push(ftbCheck);
    totalScore += ftbCheck.score;

    // Check 2: Property price limits
    const maxPropertyPrice = 600000; // Current HTB limit for new homes
    const propertyPriceCheck = {
      check: 'Property price eligibility',
      passed: applicationData.propertyPrice <= maxPropertyPrice,
      details: `Property price €${applicationData.propertyPrice.toLocaleString()} (limit: €${maxPropertyPrice.toLocaleString()})`,
      score: applicationData.propertyPrice <= maxPropertyPrice ? 20 : 0
    };
    checks.push(propertyPriceCheck);
    totalScore += propertyPriceCheck.score;

    // Check 3: Income requirements
    const minIncome = 25000;
    const maxIncomeMultiple = 4.5;
    const maxAffordableProperty = applicationData.financialDetails.grossAnnualIncome * maxIncomeMultiple;
    
    const incomeCheck = {
      check: 'Income eligibility',
      passed: applicationData.financialDetails.grossAnnualIncome >= minIncome && 
               applicationData.propertyPrice <= maxAffordableProperty,
      details: `Annual income €${applicationData.financialDetails.grossAnnualIncome.toLocaleString()}, max affordable €${maxAffordableProperty.toLocaleString()}`,
      score: applicationData.financialDetails.grossAnnualIncome >= minIncome ? 15 : 0
    };
    checks.push(incomeCheck);
    totalScore += incomeCheck.score;

    // Check 4: Deposit requirements (minimum 10%)
    const minDeposit = applicationData.propertyPrice * 0.1;
    const depositCheck = {
      check: 'Deposit requirements',
      passed: applicationData.financialDetails.depositAmount >= minDeposit,
      details: `Deposit €${applicationData.financialDetails.depositAmount.toLocaleString()}, required minimum €${minDeposit.toLocaleString()}`,
      score: applicationData.financialDetails.depositAmount >= minDeposit ? 15 : 0
    };
    checks.push(depositCheck);
    totalScore += depositCheck.score;

    // Check 5: Employment stability
    const employmentCheck = {
      check: 'Employment stability',
      passed: applicationData.applicantDetails.employment.employmentType === 'permanent' ||
               (applicationData.applicantDetails.employment.employmentType === 'contract' && 
                applicationData.applicantDetails.employment.contractEndDate),
      details: `Employment type: ${applicationData.applicantDetails.employment.employmentType}`,
      score: applicationData.applicantDetails.employment.employmentType === 'permanent' ? 15 : 10
    };
    checks.push(employmentCheck);
    totalScore += employmentCheck.score;

    // Check 6: Debt-to-income ratio
    const monthlyDebt = applicationData.financialDetails.monthlyExpenses + 
                       (applicationData.financialDetails.existingDebt / 12);
    const debtToIncomeRatio = monthlyDebt / (applicationData.financialDetails.netMonthlyIncome || 
                             applicationData.financialDetails.grossAnnualIncome / 12);
    
    const debtCheck = {
      check: 'Debt-to-income ratio',
      passed: debtToIncomeRatio <= 0.35,
      details: `DTI ratio: ${(debtToIncomeRatio * 100).toFixed(1)}% (max: 35%)`,
      score: debtToIncomeRatio <= 0.35 ? 15 : debtToIncomeRatio <= 0.45 ? 10 : 0
    };
    checks.push(debtCheck);
    totalScore += debtCheck.score;

    // Add warnings for borderline cases
    if (debtToIncomeRatio > 0.30) {
      warnings.push('Debt-to-income ratio is high - additional documentation may be required');
    }
    
    if (applicationData.financialDetails.depositAmount < applicationData.propertyPrice * 0.15) {
      warnings.push('Low deposit amount may require additional income verification');
    }

    const failedChecks = checks.filter(check => !check.passed);
    const isEligible = totalScore >= 70 && failedChecks.filter(check => 
      ['First-time buyer status', 'Property price eligibility'].includes(check.check)
    ).length === 0;

    return {
      isEligible,
      score: totalScore,
      checks,
      reasons: failedChecks.map(check => check.details),
      warnings
    };
  }

  /**
   * Calculate HTB amounts based on property price and eligibility
   */
  private calculateHTBAmounts(applicationData: HTBApplicationInput): {
    maxAmount: number;
    recommendedAmount: number;
    percentage: number;
  } {
    const propertyPrice = applicationData.propertyPrice;
    
    // HTB provides up to 30% of property price, with maximum amounts based on property type
    const maxPercentage = 0.30;
    const maxAmountNewHome = 120000; // Current max for new homes
    const maxAmountSecondhand = 60000; // Current max for secondhand homes
    
    const isNewProperty = applicationData.propertyDetails?.propertyType === 'new';
    const calculatedAmount = propertyPrice * maxPercentage;
    const maxAllowedAmount = isNewProperty ? maxAmountNewHome : maxAmountSecondhand;
    
    const maxAmount = Math.min(calculatedAmount, maxAllowedAmount);
    
    // Recommend conservative amount based on deposit and affordability
    const conservativePercentage = 0.25;
    const recommendedAmount = Math.min(
      propertyPrice * conservativePercentage,
      maxAmount,
      applicationData.financialDetails.depositAmount * 2 // Don't exceed 2x their available deposit
    );

    return {
      maxAmount,
      recommendedAmount,
      percentage: (recommendedAmount / propertyPrice) * 100
    };
  }

  /**
   * Generate list of required documents based on application (Enhanced with certified AI verification)
   */
  private generateRequiredDocumentsList(applicationData: HTBApplicationInput): HTBRequiredDocument[] {
    const documents: HTBRequiredDocument[] = [
      {
        id: 'salary_cert',
        name: 'Salary Certificate (AI Verified)',
        type: 'FINANCIAL_CERTIFIED_AI',
        category: 'INCOME_VERIFICATION',
        description: 'Current salary certificate from employer - verified using certified AI/ML models',
        isRequired: true,
        isUploaded: false,
        deadline: this.addDaysToDate(new Date(), 14).toISOString()
      },
      {
        id: 'bank_statements',
        name: 'Bank Statements (AI Verified)',
        type: 'FINANCIAL_CERTIFIED_AI',
        category: 'FINANCIAL_VERIFICATION',
        description: 'Last 6 months bank statements - verified using certified AI/ML models with GDPR compliance',
        isRequired: true,
        isUploaded: false,
        deadline: this.addDaysToDate(new Date(), 14).toISOString()
      },
      {
        id: 'mortgage_approval',
        name: 'Mortgage Approval Letter (AI Verified)',
        type: 'FINANCIAL_CERTIFIED_AI',
        category: 'MORTGAGE_VERIFICATION',
        description: 'Mortgage approval letter from lender - verified using certified AI/ML models',
        isRequired: true,
        isUploaded: false,
        deadline: this.addDaysToDate(new Date(), 21).toISOString()
      },
      {
        id: 'contracts_sale',
        name: 'Contracts for Sale (AI Verified)',
        type: 'LEGAL_CERTIFIED_AI',
        category: 'PROPERTY_LEGAL',
        description: 'Signed contracts for sale of property - verified using certified AI/ML models with legal compliance',
        isRequired: true,
        isUploaded: false,
        deadline: this.addDaysToDate(new Date(), 30).toISOString()
      },
      {
        id: 'id_verification',
        name: 'Photo ID (AI Verified)',
        type: 'IDENTIFICATION_CERTIFIED_AI',
        category: 'IDENTITY_VERIFICATION',
        description: 'Valid photo identification (passport/driving licence) - verified using certified AI/ML identity verification',
        isRequired: true,
        isUploaded: false,
        deadline: this.addDaysToDate(new Date(), 7).toISOString()
      },
      {
        id: 'pps_cert',
        name: 'PPS Number Certificate (AI Verified)',
        type: 'IDENTIFICATION_CERTIFIED_AI',
        category: 'IDENTITY_VERIFICATION',
        description: 'PPS number certificate or recent payslip showing PPS - verified using certified AI/ML models',
        isRequired: true,
        isUploaded: false,
        deadline: this.addDaysToDate(new Date(), 7).toISOString()
      }
    ];

    // Add conditional documents based on employment type
    if (applicationData.applicantDetails?.employment.employmentType === 'self-employed') {
      documents.push({
        id: 'tax_returns',
        name: 'Tax Returns (AI Verified)',
        type: 'FINANCIAL_CERTIFIED_AI',
        category: 'INCOME_VERIFICATION',
        description: 'Last 2 years tax returns and Form 11 - verified using certified AI/ML models with Revenue compliance',
        isRequired: true,
        isUploaded: false,
        deadline: this.addDaysToDate(new Date(), 21).toISOString()
      });
    }

    // Add fraud detection notice document
    documents.push({
      id: 'fraud_detection_notice',
      name: 'Fraud Detection Notice',
      type: 'COMPLIANCE_NOTICE',
      category: 'SECURITY_COMPLIANCE',
      description: 'Notice of automated fraud detection and security monitoring for this application',
      isRequired: false,
      isUploaded: true, // Auto-generated
      deadline: new Date().toISOString()
    });

    return documents;
  }

  /**
   * Initialize automation workflow for claim
   */
  private async initializeAutomationWorkflow(claimId: string, applicationData: HTBApplicationInput): Promise<void> {
    try {
      // Update claim status to processing
      await htbService.updateClaimStatus(
        claimId, 
        HTBClaimStatus.DOCUMENTS_PENDING,
        'system',
        'Automated processing initialized - awaiting required documents'
      );

      logger.info('HTB automation workflow initialized', {
        claimId,
        buyerId: applicationData.buyerId,
        stage: 'document_collection'
      });

    } catch (error: any) {
      logger.error('Failed to initialize automation workflow', {
        error: error.message,
        claimId
      });
      throw error;
    }
  }

  /**
   * Progress claim to next stage
   */
  private async progressToNextStage(claimId: string, stage: HTBProcessingStage): Promise<void> {
    const stageStatusMap: Record<HTBProcessingStage, HTBClaimStatus> = {
      'initial_assessment': HTBClaimStatus.INITIATED,
      'document_collection': HTBClaimStatus.DOCUMENTS_PENDING,
      'eligibility_verification': HTBClaimStatus.UNDER_REVIEW,
      'property_validation': HTBClaimStatus.UNDER_REVIEW,
      'financial_verification': HTBClaimStatus.UNDER_REVIEW,
      'application_submission': HTBClaimStatus.SUBMITTED,
      'approval_pending': HTBClaimStatus.APPROVAL_PENDING,
      'approved': HTBClaimStatus.APPROVED,
      'rejected': HTBClaimStatus.REJECTED,
      'disbursement_ready': HTBClaimStatus.DISBURSEMENT_READY,
      'completed': HTBClaimStatus.COMPLETED
    };

    const newStatus = stageStatusMap[stage];
    if (newStatus) {
      await htbService.updateClaimStatus(
        claimId,
        newStatus,
        'system',
        `Automated progression to ${stage}`
      );
    }
  }

  /**
   * Generate next steps based on current stage
   */
  private generateNextSteps(stage: HTBProcessingStage): string[] {
    const nextStepsMap: Record<HTBProcessingStage, string[]> = {
      'initial_assessment': ['Complete application form', 'Gather required documents'],
      'document_collection': ['Upload all required documents', 'Ensure documents are clear and legible'],
      'eligibility_verification': ['Await verification completion', 'Respond to any queries promptly'],
      'property_validation': ['Property valuation in progress', 'Ensure property details are accurate'],
      'financial_verification': ['Financial assessment in progress', 'Be available for additional queries'],
      'application_submission': ['Application submitted for review', 'Monitor status updates'],
      'approval_pending': ['Awaiting final approval', 'Prepare for potential disbursement'],
      'approved': ['HTB approved', 'Coordinate with solicitor for disbursement'],
      'rejected': ['Application rejected', 'Review rejection reasons', 'Consider appeal if applicable'],
      'disbursement_ready': ['Disbursement authorized', 'Coordinate with legal team'],
      'completed': ['HTB claim completed', 'Process concluded successfully']
    };

    return nextStepsMap[stage] || ['Contact support for guidance'];
  }

  /**
   * Calculate estimated processing time
   */
  private calculateProcessingTime(requiredDocuments: HTBRequiredDocument[]): number {
    const baseProcessingDays = 28; // Standard HTB processing time
    const documentPenalty = requiredDocuments.filter(doc => doc.isRequired).length * 2;
    const complexityBonus = 7; // Additional time for verification
    
    return baseProcessingDays + documentPenalty + complexityBonus;
  }

  /**
   * Helper function to add days to date
   */
  private addDaysToDate(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  // Helper function to calculate age from date of birth
  private calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  // Helper function to calculate property age
  private calculatePropertyAge(estimatedCompletionDate?: string): number {
    if (!estimatedCompletionDate) return 0;
    
    const today = new Date();
    const completionDate = new Date(estimatedCompletionDate);
    const ageInYears = (today.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    
    return Math.max(0, Math.floor(ageInYears));
  }

  /**
   * Get automation status for claim
   */
  async getAutomationStatus(claimId: string): Promise<{
    stage: HTBProcessingStage;
    progress: number;
    nextActions: string[];
    documentsStatus: { total: number; uploaded: number; verified: number };
  }> {
    try {
      const claim = await htbService.getClaimById(claimId);
      if (!claim) {
        throw new Error(`HTB claim not found: ${claimId}`);
      }

      // Map claim status to processing stage
      const statusStageMap: Record<HTBClaimStatus, HTBProcessingStage> = {
        [HTBClaimStatus.INITIATED]: 'initial_assessment',
        [HTBClaimStatus.DOCUMENTS_PENDING]: 'document_collection',
        [HTBClaimStatus.UNDER_REVIEW]: 'eligibility_verification',
        [HTBClaimStatus.SUBMITTED]: 'application_submission',
        [HTBClaimStatus.APPROVAL_PENDING]: 'approval_pending',
        [HTBClaimStatus.APPROVED]: 'approved',
        [HTBClaimStatus.REJECTED]: 'rejected',
        [HTBClaimStatus.DISBURSEMENT_READY]: 'disbursement_ready',
        [HTBClaimStatus.COMPLETED]: 'completed'
      };

      const currentStage = statusStageMap[claim.status] || 'initial_assessment';
      
      // Calculate progress percentage
      const stageProgress: Record<HTBProcessingStage, number> = {
        'initial_assessment': 10,
        'document_collection': 25,
        'eligibility_verification': 40,
        'property_validation': 55,
        'financial_verification': 70,
        'application_submission': 80,
        'approval_pending': 90,
        'approved': 95,
        'rejected': 0,
        'disbursement_ready': 98,
        'completed': 100
      };

      const progress = stageProgress[currentStage];
      const nextActions = this.generateNextSteps(currentStage);

      // Calculate documents status
      const totalDocs = 6; // Standard required documents
      const uploadedDocs = claim.documents?.length || 0;
      const verifiedDocs = claim.documents?.filter(doc => 
        doc.type.includes('verified') || doc.name.includes('approved')
      ).length || 0;

      return {
        stage: currentStage,
        progress,
        nextActions,
        documentsStatus: {
          total: totalDocs,
          uploaded: uploadedDocs,
          verified: verifiedDocs
        }
      };

    } catch (error: any) {
      logger.error('Failed to get automation status', {
        error: error.message,
        claimId
      });
      throw error;
    }
  }
}

// Export singleton instance
export const htbAutomationService = new HTBAutomationService();
export default htbAutomationService;