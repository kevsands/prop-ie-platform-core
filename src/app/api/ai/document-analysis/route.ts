import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { userService } from '@/lib/services/users-production';
import { z } from 'zod';

const prisma = new PrismaClient();

const documentAnalysisSchema = z.object({
  documentId: z.string().optional(),
  documentData: z.string().optional(), // Base64 encoded document
  documentType: z.enum([
    'LEGAL_CONTRACT',
    'MORTGAGE_APPLICATION',
    'INSURANCE_POLICY',
    'PROPERTY_DEED',
    'BUILDING_CERTIFICATE',
    'SURVEY_REPORT',
    'VALUATION_REPORT',
    'ENERGY_CERTIFICATE',
    'PLANNING_PERMISSION',
    'LEASE_AGREEMENT',
    'WARRANTY_DOCUMENT',
    'FINANCIAL_STATEMENT',
    'IDENTITY_DOCUMENT',
    'UTILITY_BILL',
    'BANK_STATEMENT',
    'OTHER'
  ]),
  analysisTypes: z.array(z.enum([
    'DOCUMENT_CLASSIFICATION',
    'KEY_INFORMATION_EXTRACTION',
    'COMPLIANCE_CHECK',
    'RISK_ASSESSMENT',
    'VALIDITY_VERIFICATION',
    'COMPLETENESS_CHECK',
    'ANOMALY_DETECTION',
    'SENTIMENT_ANALYSIS',
    'DATA_VALIDATION',
    'SIGNATURE_VERIFICATION',
    'DATE_VERIFICATION',
    'AMOUNT_VERIFICATION'
  ])).optional().default(['DOCUMENT_CLASSIFICATION', 'KEY_INFORMATION_EXTRACTION', 'COMPLIANCE_CHECK']),
  contextData: z.object({
    propertyId: z.string().optional(),
    userId: z.string().optional(),
    transactionId: z.string().optional(),
    expectedValues: z.record(z.any()).optional()
  }).optional(),
  options: z.object({
    confidenceThreshold: z.number().min(0).max(1).optional().default(0.7),
    returnRawData: z.boolean().optional().default(false),
    generateSummary: z.boolean().optional().default(true),
    highlightIssues: z.boolean().optional().default(true)
  }).optional().default({})
});

/**
 * POST /api/ai/document-analysis - Analyze documents using AI/ML
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = documentAnalysisSchema.parse(body);

    // Get current user for authorization
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check permissions
    if (!isAuthorizedToAccessAI(currentUser)) {
      return NextResponse.json(
        { error: 'Insufficient permissions for AI document analysis' },
        { status: 403 }
      );
    }

    // Get document data
    let documentData = validatedData.documentData;
    let documentMetadata: any = {};

    if (validatedData.documentId) {
      // Fetch document from database
      const document = await getDocumentById(validatedData.documentId);
      if (!document) {
        return NextResponse.json(
          { error: 'Document not found' },
          { status: 404 }
        );
      }
      documentData = document.documentData;
      documentMetadata = document.metadata || {};
    }

    if (!documentData) {
      return NextResponse.json(
        { error: 'Document data is required' },
        { status: 400 }
      );
    }

    // Initialize analysis results
    const analysis: any = {
      documentId: validatedData.documentId,
      documentType: validatedData.documentType,
      analyzedAt: new Date(),
      confidence: 0,
      analysis: {}
    };

    // Process each requested analysis type
    for (const analysisType of validatedData.analysisTypes) {
      try {
        switch (analysisType) {
          case 'DOCUMENT_CLASSIFICATION':
            analysis.analysis.classification = await performDocumentClassification(
              documentData, validatedData.documentType, documentMetadata
            );
            break;

          case 'KEY_INFORMATION_EXTRACTION':
            analysis.analysis.keyInformation = await extractKeyInformation(
              documentData, validatedData.documentType, validatedData.contextData
            );
            break;

          case 'COMPLIANCE_CHECK':
            analysis.analysis.compliance = await performComplianceCheck(
              documentData, validatedData.documentType, validatedData.contextData
            );
            break;

          case 'RISK_ASSESSMENT':
            analysis.analysis.riskAssessment = await performRiskAssessment(
              documentData, validatedData.documentType, validatedData.contextData
            );
            break;

          case 'VALIDITY_VERIFICATION':
            analysis.analysis.validity = await verifyDocumentValidity(
              documentData, validatedData.documentType, validatedData.contextData
            );
            break;

          case 'COMPLETENESS_CHECK':
            analysis.analysis.completeness = await checkDocumentCompleteness(
              documentData, validatedData.documentType, validatedData.contextData
            );
            break;

          case 'ANOMALY_DETECTION':
            analysis.analysis.anomalies = await detectAnomalies(
              documentData, validatedData.documentType, validatedData.contextData
            );
            break;

          case 'SENTIMENT_ANALYSIS':
            analysis.analysis.sentiment = await analyzeSentiment(
              documentData, validatedData.documentType
            );
            break;

          case 'DATA_VALIDATION':
            analysis.analysis.dataValidation = await validateDocumentData(
              documentData, validatedData.documentType, validatedData.contextData
            );
            break;

          case 'SIGNATURE_VERIFICATION':
            analysis.analysis.signatureVerification = await verifySignatures(
              documentData, validatedData.contextData
            );
            break;

          case 'DATE_VERIFICATION':
            analysis.analysis.dateVerification = await verifyDates(
              documentData, validatedData.contextData
            );
            break;

          case 'AMOUNT_VERIFICATION':
            analysis.analysis.amountVerification = await verifyAmounts(
              documentData, validatedData.contextData
            );
            break;
        }
      } catch (error) {
        console.error(`Error in ${analysisType}:`, error);
        analysis.analysis[analysisType.toLowerCase()] = {
          error: `Failed to perform ${analysisType}`,
          retryRecommended: true
        };
      }
    }

    // Calculate overall confidence score
    analysis.confidence = calculateOverallConfidence(analysis.analysis);

    // Generate summary if requested
    if (validatedData.options?.generateSummary) {
      analysis.summary = generateAnalysisSummary(analysis, validatedData.documentType);
    }

    // Highlight issues if requested
    if (validatedData.options?.highlightIssues) {
      analysis.issues = identifyIssues(analysis.analysis, validatedData.options.confidenceThreshold);
    }

    // Generate recommendations
    analysis.recommendations = generateRecommendations(analysis.analysis, validatedData.documentType);

    // Log AI usage
    await logDocumentAnalysisUsage({
      userId: currentUser.id,
      documentId: validatedData.documentId,
      documentType: validatedData.documentType,
      analysisTypes: validatedData.analysisTypes,
      confidence: analysis.confidence,
      processingTime: Date.now() - new Date(analysis.analyzedAt).getTime()
    });

    // Remove raw data if not requested
    if (!validatedData.options?.returnRawData) {
      removeRawDataFromResponse(analysis);
    }

    return NextResponse.json({
      success: true,
      data: analysis
    });

  } catch (error) {
    console.error('Error analyzing document:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to analyze document' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Helper functions
async function getCurrentUser(request: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
      const authToken = request.cookies.get('auth-token')?.value;
      if (authToken?.startsWith('dev-token-')) {
        const userId = authToken.replace('dev-token-', '');
        return await userService.getUserById(userId);
      }
    } else {
      return await userService.getCurrentUser();
    }
  } catch (error) {
    console.error('Error getting current user:', error);
  }
  return null;
}

function isAuthorizedToAccessAI(user: any): boolean {
  return user?.roles?.includes('ADMIN') || 
         user?.roles?.includes('SUPER_ADMIN') ||
         user?.roles?.includes('DEVELOPER') ||
         user?.roles?.includes('ESTATE_AGENT') ||
         user?.roles?.includes('SOLICITOR') ||
         user?.subscription?.includes('AI_DOCUMENT_ANALYSIS');
}

async function getDocumentById(documentId: string) {
  // Try different document tables
  const sources = [
    'reservationDocument',
    'mortgageDocument',
    'snagItemPhoto',
    'homePackItemDocument'
  ];

  for (const source of sources) {
    try {
      const document = await (prisma as any)[source].findUnique({
        where: { id: documentId }
      });
      if (document) {
        return {
          documentData: document.documentData || document.photoData,
          metadata: document.metadata || {}
        };
      }
    } catch (error) {
      // Continue to next source
    }
  }

  return null;
}

async function performDocumentClassification(documentData: string, expectedType: string, metadata: any) {
  // Simulate AI document classification
  const classifications = await classifyDocument(documentData);
  
  return {
    detectedType: classifications.primaryType,
    confidence: classifications.confidence,
    alternativeTypes: classifications.alternativeTypes,
    matchesExpected: classifications.primaryType === expectedType,
    reasoning: classifications.reasoning,
    features: classifications.features
  };
}

async function extractKeyInformation(documentData: string, documentType: string, contextData: any) {
  // Extract key information based on document type
  const extraction = await performOCRAndNLP(documentData, documentType);
  
  const keyInfo: any = {
    confidence: extraction.confidence,
    extractedFields: {},
    structuredData: {}
  };

  switch (documentType) {
    case 'LEGAL_CONTRACT':
      keyInfo.extractedFields = {
        parties: extraction.parties,
        contractDate: extraction.contractDate,
        propertyAddress: extraction.propertyAddress,
        purchasePrice: extraction.purchasePrice,
        completionDate: extraction.completionDate,
        conditions: extraction.conditions,
        signatures: extraction.signatures
      };
      break;

    case 'MORTGAGE_APPLICATION':
      keyInfo.extractedFields = {
        applicantName: extraction.applicantName,
        applicantAddress: extraction.applicantAddress,
        loanAmount: extraction.loanAmount,
        interestRate: extraction.interestRate,
        loanTerm: extraction.loanTerm,
        propertyValue: extraction.propertyValue,
        income: extraction.income,
        employmentDetails: extraction.employmentDetails
      };
      break;

    case 'BUILDING_CERTIFICATE':
      keyInfo.extractedFields = {
        certificateType: extraction.certificateType,
        issueDate: extraction.issueDate,
        expiryDate: extraction.expiryDate,
        propertyAddress: extraction.propertyAddress,
        certifyingBody: extraction.certifyingBody,
        complianceItems: extraction.complianceItems,
        certificateNumber: extraction.certificateNumber
      };
      break;

    case 'VALUATION_REPORT':
      keyInfo.extractedFields = {
        valuationDate: extraction.valuationDate,
        propertyAddress: extraction.propertyAddress,
        valuedAmount: extraction.valuedAmount,
        valuationMethod: extraction.valuationMethod,
        valuerId: extraction.valuerId,
        marketConditions: extraction.marketConditions,
        comparableProperties: extraction.comparableProperties
      };
      break;

    default:
      keyInfo.extractedFields = extraction.generalFields;
  }

  return keyInfo;
}

async function performComplianceCheck(documentData: string, documentType: string, contextData: any) {
  // Check compliance based on document type and regulations
  const complianceRules = getComplianceRules(documentType);
  const complianceResults = await checkCompliance(documentData, complianceRules);

  return {
    overallCompliance: complianceResults.overallScore >= 0.8 ? 'COMPLIANT' : 'NON_COMPLIANT',
    complianceScore: complianceResults.overallScore,
    checks: complianceResults.checks.map((check: any) => ({
      rule: check.rule,
      status: check.status, // 'PASS', 'FAIL', 'WARNING'
      confidence: check.confidence,
      details: check.details,
      remedy: check.remedy
    })),
    criticalIssues: complianceResults.checks.filter((check: any) => check.status === 'FAIL' && check.critical),
    warnings: complianceResults.checks.filter((check: any) => check.status === 'WARNING'),
    recommendations: complianceResults.recommendations
  };
}

async function performRiskAssessment(documentData: string, documentType: string, contextData: any) {
  // Assess risks based on document content and type
  const risks = await assessDocumentRisks(documentData, documentType);

  return {
    overallRiskLevel: risks.overallLevel, // 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    riskScore: risks.overallScore, // 0-100
    riskCategories: {
      legal: risks.legal,
      financial: risks.financial,
      operational: risks.operational,
      compliance: risks.compliance,
      technical: risks.technical
    },
    identifiedRisks: risks.specificRisks.map((risk: any) => ({
      type: risk.type,
      description: risk.description,
      likelihood: risk.likelihood,
      impact: risk.impact,
      mitigation: risk.mitigation,
      urgency: risk.urgency
    })),
    recommendations: risks.recommendations,
    monitoring: risks.monitoringPoints
  };
}

async function verifyDocumentValidity(documentData: string, documentType: string, contextData: any) {
  // Verify document authenticity and validity
  const validity = await checkDocumentValidity(documentData, documentType);

  return {
    isValid: validity.isValid,
    confidence: validity.confidence,
    validityChecks: {
      formatCheck: validity.formatCheck,
      signatureCheck: validity.signatureCheck,
      dateCheck: validity.dateCheck,
      authorityCheck: validity.authorityCheck,
      integrityCheck: validity.integrityCheck
    },
    issues: validity.issues,
    authenticity: {
      score: validity.authenticityScore,
      indicators: validity.authenticityIndicators
    },
    recommendations: validity.recommendations
  };
}

async function checkDocumentCompleteness(documentData: string, documentType: string, contextData: any) {
  // Check if document contains all required information
  const completeness = await assessDocumentCompleteness(documentData, documentType);

  return {
    isComplete: completeness.isComplete,
    completenessScore: completeness.score, // 0-100
    requiredFields: completeness.requiredFields.map((field: any) => ({
      field: field.name,
      status: field.status, // 'PRESENT', 'MISSING', 'PARTIAL'
      confidence: field.confidence,
      importance: field.importance
    })),
    missingInformation: completeness.missingFields,
    recommendations: completeness.recommendations,
    nextSteps: completeness.nextSteps
  };
}

async function detectAnomalies(documentData: string, documentType: string, contextData: any) {
  // Detect anomalies in document content
  const anomalies = await findDocumentAnomalies(documentData, documentType);

  return {
    hasAnomalies: anomalies.detected,
    anomalyScore: anomalies.score, // 0-100 (higher = more anomalous)
    detectedAnomalies: anomalies.anomalies.map((anomaly: any) => ({
      type: anomaly.type,
      description: anomaly.description,
      severity: anomaly.severity,
      confidence: anomaly.confidence,
      location: anomaly.location,
      recommendation: anomaly.recommendation
    })),
    patterns: anomalies.patterns,
    riskLevel: anomalies.riskLevel
  };
}

async function analyzeSentiment(documentData: string, documentType: string) {
  // Analyze sentiment of document text
  const sentiment = await performSentimentAnalysis(documentData);

  return {
    overallSentiment: sentiment.overall, // 'POSITIVE', 'NEUTRAL', 'NEGATIVE'
    sentimentScore: sentiment.score, // -1 to 1
    confidence: sentiment.confidence,
    emotionalTone: sentiment.emotionalTone,
    keyPhrases: sentiment.keyPhrases,
    concerns: sentiment.concerns,
    opportunities: sentiment.opportunities
  };
}

async function validateDocumentData(documentData: string, documentType: string, contextData: any) {
  // Validate data consistency and accuracy
  const validation = await validateDataConsistency(documentData, contextData);

  return {
    isValid: validation.isValid,
    validationScore: validation.score,
    dataConsistency: validation.consistency,
    crossReferences: validation.crossReferences,
    discrepancies: validation.discrepancies,
    recommendations: validation.recommendations
  };
}

async function verifySignatures(documentData: string, contextData: any) {
  // Verify signatures in document
  const signatures = await analyzeSignatures(documentData);

  return {
    signaturesFound: signatures.count,
    signatures: signatures.signatures.map((sig: any) => ({
      location: sig.location,
      type: sig.type, // 'HANDWRITTEN', 'DIGITAL', 'ELECTRONIC'
      confidence: sig.confidence,
      validity: sig.validity,
      signatory: sig.signatory
    })),
    verification: signatures.verification,
    recommendations: signatures.recommendations
  };
}

async function verifyDates(documentData: string, contextData: any) {
  // Verify dates in document
  const dates = await analyzeDates(documentData);

  return {
    datesFound: dates.count,
    dates: dates.dates.map((date: any) => ({
      date: date.value,
      type: date.type,
      confidence: date.confidence,
      validity: date.validity,
      context: date.context
    })),
    consistency: dates.consistency,
    timeline: dates.timeline,
    issues: dates.issues
  };
}

async function verifyAmounts(documentData: string, contextData: any) {
  // Verify monetary amounts in document
  const amounts = await analyzeAmounts(documentData);

  return {
    amountsFound: amounts.count,
    amounts: amounts.amounts.map((amount: any) => ({
      value: amount.value,
      currency: amount.currency,
      type: amount.type,
      confidence: amount.confidence,
      context: amount.context
    })),
    consistency: amounts.consistency,
    calculations: amounts.calculations,
    discrepancies: amounts.discrepancies
  };
}

// AI/ML simulation functions
async function classifyDocument(documentData: string) {
  // Simulate document classification using AI
  return {
    primaryType: 'LEGAL_CONTRACT',
    confidence: 0.92,
    alternativeTypes: ['LEASE_AGREEMENT', 'MORTGAGE_APPLICATION'],
    reasoning: 'Document contains contract language, parties, and legal terms',
    features: ['contract_terms', 'party_names', 'legal_language', 'signatures']
  };
}

async function performOCRAndNLP(documentData: string, documentType: string) {
  // Simulate OCR and NLP processing
  return {
    confidence: 0.89,
    parties: ['John Smith', 'ABC Property Ltd'],
    contractDate: '2024-06-15',
    propertyAddress: '123 Main Street, Dublin 1',
    purchasePrice: 450000,
    completionDate: '2024-08-15',
    conditions: ['Subject to mortgage approval', 'Subject to survey'],
    signatures: 2,
    generalFields: {
      text_confidence: 0.89,
      extracted_text_length: 2450,
      key_terms_found: 15
    }
  };
}

function getComplianceRules(documentType: string) {
  const rules: any = {
    'LEGAL_CONTRACT': [
      { rule: 'PARTIES_IDENTIFIED', critical: true },
      { rule: 'CONSIDERATION_SPECIFIED', critical: true },
      { rule: 'SIGNATURES_PRESENT', critical: true },
      { rule: 'DATE_SPECIFIED', critical: false }
    ],
    'MORTGAGE_APPLICATION': [
      { rule: 'INCOME_VERIFIED', critical: true },
      { rule: 'EMPLOYMENT_CONFIRMED', critical: true },
      { rule: 'PROPERTY_VALUED', critical: true },
      { rule: 'CREDIT_CHECK_COMPLETED', critical: false }
    ]
  };

  return rules[documentType] || [];
}

async function checkCompliance(documentData: string, rules: any[]) {
  // Simulate compliance checking
  const checks = rules.map(rule => ({
    rule: rule.rule,
    status: Math.random() > 0.1 ? 'PASS' : 'FAIL',
    confidence: 0.85 + Math.random() * 0.15,
    critical: rule.critical,
    details: `Compliance check for ${rule.rule}`,
    remedy: rule.status === 'FAIL' ? `Please ensure ${rule.rule} is properly documented` : null
  }));

  const passCount = checks.filter(check => check.status === 'PASS').length;
  const overallScore = passCount / checks.length;

  return {
    overallScore,
    checks,
    recommendations: overallScore < 0.8 ? ['Review failed compliance checks', 'Ensure all critical requirements are met'] : []
  };
}

async function assessDocumentRisks(documentData: string, documentType: string) {
  // Simulate risk assessment
  const baseRisk = Math.random() * 0.3; // Base risk 0-30%
  
  return {
    overallLevel: baseRisk < 0.1 ? 'LOW' : baseRisk < 0.2 ? 'MEDIUM' : 'HIGH',
    overallScore: Math.round(baseRisk * 100),
    legal: { score: Math.round(baseRisk * 100), issues: [] },
    financial: { score: Math.round(baseRisk * 120), issues: [] },
    operational: { score: Math.round(baseRisk * 80), issues: [] },
    compliance: { score: Math.round(baseRisk * 90), issues: [] },
    technical: { score: Math.round(baseRisk * 70), issues: [] },
    specificRisks: [
      {
        type: 'LEGAL',
        description: 'Contract terms may be unclear',
        likelihood: 'LOW',
        impact: 'MEDIUM',
        mitigation: 'Review with legal counsel',
        urgency: 'MEDIUM'
      }
    ],
    recommendations: ['Regular compliance monitoring', 'Legal review recommended'],
    monitoringPoints: ['Contract execution', 'Payment milestones']
  };
}

async function checkDocumentValidity(documentData: string, documentType: string) {
  // Simulate validity checking
  return {
    isValid: true,
    confidence: 0.91,
    formatCheck: { status: 'PASS', confidence: 0.95 },
    signatureCheck: { status: 'PASS', confidence: 0.87 },
    dateCheck: { status: 'PASS', confidence: 0.92 },
    authorityCheck: { status: 'PASS', confidence: 0.89 },
    integrityCheck: { status: 'PASS', confidence: 0.94 },
    issues: [],
    authenticityScore: 91,
    authenticityIndicators: ['Valid signatures', 'Consistent formatting', 'Proper letterhead'],
    recommendations: []
  };
}

async function assessDocumentCompleteness(documentData: string, documentType: string) {
  // Simulate completeness assessment
  return {
    isComplete: true,
    score: 92,
    requiredFields: [
      { name: 'parties', status: 'PRESENT', confidence: 0.95, importance: 'HIGH' },
      { name: 'dates', status: 'PRESENT', confidence: 0.90, importance: 'HIGH' },
      { name: 'amounts', status: 'PRESENT', confidence: 0.88, importance: 'MEDIUM' }
    ],
    missingFields: [],
    recommendations: [],
    nextSteps: []
  };
}

async function findDocumentAnomalies(documentData: string, documentType: string) {
  // Simulate anomaly detection
  return {
    detected: false,
    score: 15, // Low anomaly score
    anomalies: [],
    patterns: ['Standard contract structure', 'Typical legal language'],
    riskLevel: 'LOW'
  };
}

async function performSentimentAnalysis(documentData: string) {
  // Simulate sentiment analysis
  return {
    overall: 'NEUTRAL',
    score: 0.1,
    confidence: 0.78,
    emotionalTone: 'PROFESSIONAL',
    keyPhrases: ['terms and conditions', 'mutual agreement', 'legal obligations'],
    concerns: [],
    opportunities: ['Clear terms', 'Professional language']
  };
}

async function validateDataConsistency(documentData: string, contextData: any) {
  // Simulate data validation
  return {
    isValid: true,
    score: 94,
    consistency: 'HIGH',
    crossReferences: ['Property address matches', 'Amounts are consistent'],
    discrepancies: [],
    recommendations: []
  };
}

async function analyzeSignatures(documentData: string) {
  // Simulate signature analysis
  return {
    count: 2,
    signatures: [
      {
        location: 'Page 1, bottom',
        type: 'HANDWRITTEN',
        confidence: 0.89,
        validity: 'VALID',
        signatory: 'John Smith'
      }
    ],
    verification: 'VERIFIED',
    recommendations: []
  };
}

async function analyzeDates(documentData: string) {
  // Simulate date analysis
  return {
    count: 3,
    dates: [
      {
        value: '2024-06-15',
        type: 'CONTRACT_DATE',
        confidence: 0.95,
        validity: 'VALID',
        context: 'Agreement date'
      }
    ],
    consistency: 'CONSISTENT',
    timeline: 'LOGICAL',
    issues: []
  };
}

async function analyzeAmounts(documentData: string) {
  // Simulate amount analysis
  return {
    count: 2,
    amounts: [
      {
        value: 450000,
        currency: 'EUR',
        type: 'PURCHASE_PRICE',
        confidence: 0.92,
        context: 'Property purchase price'
      }
    ],
    consistency: 'CONSISTENT',
    calculations: [],
    discrepancies: []
  };
}

function calculateOverallConfidence(analysisResults: any): number {
  const confidenceScores = Object.values(analysisResults)
    .filter((result: any) => result && typeof result.confidence === 'number')
    .map((result: any) => result.confidence);

  if (confidenceScores.length === 0) return 0;

  return Math.round((confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length) * 100) / 100;
}

function generateAnalysisSummary(analysis: any, documentType: string): string {
  const summaryElements = [];

  if (analysis.analysis.classification?.confidence > 0.8) {
    summaryElements.push(`Document correctly classified as ${documentType} with high confidence.`);
  }

  if (analysis.analysis.compliance?.overallCompliance === 'COMPLIANT') {
    summaryElements.push('Document meets all compliance requirements.');
  }

  if (analysis.analysis.validity?.isValid) {
    summaryElements.push('Document validity verified.');
  }

  return summaryElements.join(' ') || 'Analysis completed.';
}

function identifyIssues(analysisResults: any, threshold: number): any[] {
  const issues = [];

  // Check for low confidence scores
  Object.entries(analysisResults).forEach(([key, result]: [string, any]) => {
    if (result && result.confidence && result.confidence < threshold) {
      issues.push({
        type: 'LOW_CONFIDENCE',
        analysis: key,
        confidence: result.confidence,
        severity: 'WARNING'
      });
    }
  });

  // Check for compliance failures
  if (analysisResults.compliance?.overallCompliance === 'NON_COMPLIANT') {
    issues.push({
      type: 'COMPLIANCE_FAILURE',
      analysis: 'compliance',
      details: analysisResults.compliance.criticalIssues,
      severity: 'CRITICAL'
    });
  }

  return issues;
}

function generateRecommendations(analysisResults: any, documentType: string): string[] {
  const recommendations = [];

  if (analysisResults.compliance?.overallCompliance === 'NON_COMPLIANT') {
    recommendations.push('Address compliance issues before proceeding');
  }

  if (analysisResults.completeness?.isComplete === false) {
    recommendations.push('Provide missing information to complete the document');
  }

  if (analysisResults.riskAssessment?.overallRiskLevel === 'HIGH') {
    recommendations.push('Consider risk mitigation strategies');
  }

  return recommendations;
}

function removeRawDataFromResponse(analysis: any) {
  // Remove potentially large raw data fields
  if (analysis.analysis.keyInformation?.rawText) {
    delete analysis.analysis.keyInformation.rawText;
  }
}

async function logDocumentAnalysisUsage(data: any) {
  try {
    await prisma.aIUsageLog.create({
      data: {
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: data.userId,
        service: 'DOCUMENT_ANALYSIS',
        parameters: data,
        processingTime: data.processingTime,
        confidenceScore: data.confidence
      }
    });
  } catch (error) {
    console.error('Error logging document analysis usage:', error);
  }
}