/**
 * Automated Document Processing Service
 * Advanced AI-powered document processing with OCR, validation, and data extraction
 */

import { UploadedDocument } from '@/components/verification/DocumentUploadSystem';

export interface DocumentProcessingResult {
  success: boolean;
  processedAt: Date;
  extractedData: DocumentExtractedData;
  confidence: number; // 0-100
  validationResults: ValidationResult[];
  errors: string[];
  warnings: string[];
  processingTime: number; // milliseconds
  ocrText?: string;
  classificationResult: DocumentClassification;
}

export interface DocumentExtractedData {
  // Personal Information
  fullName?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  nationality?: string;
  gender?: string;
  placeOfBirth?: string;
  
  // Identity Documents
  documentNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  issuingAuthority?: string;
  
  // Address Information
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    county?: string;
    postalCode?: string;
    country?: string;
  };
  
  // Financial Information
  employer?: string;
  grossIncome?: number;
  netIncome?: number;
  employmentType?: string;
  payPeriod?: string;
  accountNumber?: string;
  bankName?: string;
  accountType?: string;
  
  // Utility Information
  provider?: string;
  accountReference?: string;
  billDate?: string;
  billPeriod?: string;
  
  // Additional Metadata
  documentType?: string;
  documentSubtype?: string;
  customFields?: Record<string, any>;
}

export interface ValidationResult {
  field: string;
  isValid: boolean;
  expectedFormat?: string;
  actualValue?: string;
  errorMessage?: string;
  confidence: number;
}

export interface DocumentClassification {
  primaryType: 'identity' | 'financial' | 'address' | 'employment' | 'unknown';
  secondaryType?: string;
  confidence: number;
  alternativePredictions?: Array<{
    type: string;
    confidence: number;
  }>;
}

export interface ProcessingOptions {
  enableOCR: boolean;
  performValidation: boolean;
  extractStructuredData: boolean;
  enableQualityCheck: boolean;
  strictMode: boolean;
  customValidationRules?: ValidationRule[];
}

export interface ValidationRule {
  field: string;
  required: boolean;
  pattern?: RegExp;
  validator?: (value: any) => boolean;
  errorMessage: string;
}

export class DocumentProcessingService {
  private static instance: DocumentProcessingService;
  private processingQueue: Map<string, Promise<DocumentProcessingResult>> = new Map();
  
  private constructor() {}
  
  static getInstance(): DocumentProcessingService {
    if (!DocumentProcessingService.instance) {
      DocumentProcessingService.instance = new DocumentProcessingService();
    }
    return DocumentProcessingService.instance;
  }
  
  /**
   * Process a document with AI-powered analysis
   */
  async processDocument(
    document: UploadedDocument,
    options: Partial<ProcessingOptions> = {}
  ): Promise<DocumentProcessingResult> {
    const startTime = Date.now();
    
    // Check if already processing
    if (this.processingQueue.has(document.id)) {
      return this.processingQueue.get(document.id)!;
    }
    
    const defaultOptions: ProcessingOptions = {
      enableOCR: true,
      performValidation: true,
      extractStructuredData: true,
      enableQualityCheck: true,
      strictMode: false,
      ...options
    };
    
    const processingPromise = this.performDocumentProcessing(document, defaultOptions, startTime);
    this.processingQueue.set(document.id, processingPromise);
    
    try {
      const result = await processingPromise;
      return result;
    } finally {
      this.processingQueue.delete(document.id);
    }
  }
  
  private async performDocumentProcessing(
    document: UploadedDocument,
    options: ProcessingOptions,
    startTime: number
  ): Promise<DocumentProcessingResult> {
    const result: DocumentProcessingResult = {
      success: false,
      processedAt: new Date(),
      extractedData: {},
      confidence: 0,
      validationResults: [],
      errors: [],
      warnings: [],
      processingTime: 0,
      classificationResult: {
        primaryType: 'unknown',
        confidence: 0
      }
    };
    
    try {
      // Step 1: Document Classification
      const classification = await this.classifyDocument(document);
      result.classificationResult = classification;
      
      // Step 2: OCR Processing
      let ocrText = '';
      if (options.enableOCR) {
        ocrText = await this.performOCR(document);
        result.ocrText = ocrText;
      }
      
      // Step 3: Quality Check
      if (options.enableQualityCheck) {
        const qualityIssues = await this.checkDocumentQuality(document);
        result.warnings.push(...qualityIssues);
      }
      
      // Step 4: Structured Data Extraction
      if (options.extractStructuredData) {
        result.extractedData = await this.extractStructuredData(
          document,
          classification,
          ocrText
        );
      }
      
      // Step 5: Data Validation
      if (options.performValidation) {
        result.validationResults = await this.validateExtractedData(
          result.extractedData,
          classification.primaryType,
          options
        );
      }
      
      // Step 6: Calculate Overall Confidence
      result.confidence = this.calculateOverallConfidence(
        classification,
        result.validationResults,
        result.extractedData
      );
      
      // Step 7: Determine Success Status
      result.success = result.confidence >= 70 && result.errors.length === 0;
      
      result.processingTime = Date.now() - startTime;
      
      return result;
      
    } catch (error) {
      result.errors.push(`Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      result.processingTime = Date.now() - startTime;
      return result;
    }
  }
  
  /**
   * Classify document type using AI
   */
  private async classifyDocument(document: UploadedDocument): Promise<DocumentClassification> {
    // Simulate AI classification
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const fileName = document.file.name.toLowerCase();
    const documentTypeId = document.documentTypeId;
    
    // Determine primary type based on document type ID and filename
    let primaryType: DocumentClassification['primaryType'] = 'unknown';
    let confidence = 85;
    
    if (['passport', 'drivers_license', 'pps_card'].includes(documentTypeId)) {
      primaryType = 'identity';
      confidence = 95;
    } else if (['payslip', 'bank_statements'].includes(documentTypeId)) {
      primaryType = 'financial';
      confidence = 92;
    } else if (['utility_bill'].includes(documentTypeId)) {
      primaryType = 'address';
      confidence = 90;
    } else if (['employment_letter'].includes(documentTypeId)) {
      primaryType = 'employment';
      confidence = 88;
    }
    
    // Adjust confidence based on filename analysis
    if (fileName.includes('passport')) {
      primaryType = 'identity';
      confidence = Math.max(confidence, 90);
    } else if (fileName.includes('bank') || fileName.includes('statement')) {
      primaryType = 'financial';
      confidence = Math.max(confidence, 88);
    } else if (fileName.includes('utility') || fileName.includes('bill')) {
      primaryType = 'address';
      confidence = Math.max(confidence, 85);
    }
    
    return {
      primaryType,
      confidence,
      alternativePredictions: [
        { type: 'identity', confidence: primaryType === 'identity' ? confidence : 65 },
        { type: 'financial', confidence: primaryType === 'financial' ? confidence : 45 },
        { type: 'address', confidence: primaryType === 'address' ? confidence : 35 }
      ]
    };
  }
  
  /**
   * Perform OCR on document
   */
  private async performOCR(document: UploadedDocument): Promise<string> {
    // Simulate OCR processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock OCR text based on document type
    return this.generateMockOCRText(document.documentTypeId);
  }
  
  /**
   * Check document quality
   */
  private async checkDocumentQuality(document: UploadedDocument): Promise<string[]> {
    const warnings: string[] = [];
    
    // File size checks
    if (document.file.size < 100000) { // Less than 100KB
      warnings.push('Document image may be too small for optimal processing');
    }
    
    if (document.file.size > 10000000) { // Greater than 10MB
      warnings.push('Large file size may affect processing speed');
    }
    
    // File type checks
    if (document.file.type === 'application/pdf') {
      warnings.push('PDF documents may have reduced OCR accuracy');
    }
    
    return warnings;
  }
  
  /**
   * Extract structured data from document
   */
  private async extractStructuredData(
    document: UploadedDocument,
    classification: DocumentClassification,
    ocrText: string
  ): Promise<DocumentExtractedData> {
    // Simulate AI data extraction
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return this.generateMockExtractedData(document.documentTypeId, classification.primaryType);
  }
  
  /**
   * Validate extracted data
   */
  private async validateExtractedData(
    extractedData: DocumentExtractedData,
    documentType: string,
    options: ProcessingOptions
  ): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    
    // Name validation
    if (extractedData.fullName) {
      results.push({
        field: 'fullName',
        isValid: extractedData.fullName.length >= 2,
        confidence: 95,
        errorMessage: extractedData.fullName.length < 2 ? 'Name too short' : undefined
      });
    }
    
    // Date validation
    if (extractedData.dateOfBirth) {
      const isValidDate = this.isValidDate(extractedData.dateOfBirth);
      results.push({
        field: 'dateOfBirth',
        isValid: isValidDate,
        confidence: 90,
        expectedFormat: 'YYYY-MM-DD',
        actualValue: extractedData.dateOfBirth,
        errorMessage: !isValidDate ? 'Invalid date format' : undefined
      });
    }
    
    // Document number validation
    if (extractedData.documentNumber) {
      const isValid = extractedData.documentNumber.length >= 5;
      results.push({
        field: 'documentNumber',
        isValid,
        confidence: 88,
        errorMessage: !isValid ? 'Document number appears invalid' : undefined
      });
    }
    
    // Email validation
    if (extractedData.customFields?.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = emailRegex.test(extractedData.customFields.email);
      results.push({
        field: 'email',
        isValid,
        confidence: 95,
        errorMessage: !isValid ? 'Invalid email format' : undefined
      });
    }
    
    return results;
  }
  
  /**
   * Calculate overall confidence score
   */
  private calculateOverallConfidence(
    classification: DocumentClassification,
    validationResults: ValidationResult[],
    extractedData: DocumentExtractedData
  ): number {
    let totalConfidence = classification.confidence;
    
    // Factor in validation results
    if (validationResults.length > 0) {
      const validationConfidence = validationResults.reduce(
        (sum, result) => sum + (result.isValid ? result.confidence : result.confidence * 0.3),
        0
      ) / validationResults.length;
      
      totalConfidence = (totalConfidence + validationConfidence) / 2;
    }
    
    // Factor in data completeness
    const extractedFields = Object.keys(extractedData).filter(
      key => extractedData[key as keyof DocumentExtractedData] !== undefined
    );
    const completenessBonus = Math.min(10, extractedFields.length * 2);
    
    return Math.min(100, Math.round(totalConfidence + completenessBonus));
  }
  
  /**
   * Generate mock OCR text for demo
   */
  private generateMockOCRText(documentTypeId: string): string {
    switch (documentTypeId) {
      case 'passport':
        return `PASSPORT
        IRELAND
        P123456789
        SURNAME: O'SULLIVAN
        GIVEN NAMES: JOHN PATRICK
        NATIONALITY: IRL
        DATE OF BIRTH: 15 MAR 1985
        PLACE OF BIRTH: DUBLIN
        SEX: M
        DATE OF ISSUE: 14 MAR 2020
        DATE OF EXPIRY: 13 MAR 2030
        AUTHORITY: DFA`;
        
      case 'payslip':
        return `TECH SOLUTIONS IRELAND LTD
        PAY ADVICE
        Employee: JOHN O'SULLIVAN
        Employee No: 12345
        Pay Period: 01/01/2024 - 31/01/2024
        Gross Pay: €4,500.00
        Tax: €1,035.00
        PRSI: €225.00
        Net Pay: €3,240.00`;
        
      case 'bank_statements':
        return `BANK OF IRELAND
        STATEMENT OF ACCOUNT
        Account Number: 12345678
        Statement Period: 01/01/2024 - 31/01/2024
        Opening Balance: €11,250.00
        Closing Balance: €12,450.00
        Transactions: 15`;
        
      case 'utility_bill':
        return `ESB NETWORKS
        ELECTRICITY BILL
        Account: 123456789
        Service Address: 123 Grafton Street, Dublin 2
        Bill Date: 15/01/2024
        Amount Due: €125.50
        Due Date: 15/02/2024`;
        
      default:
        return 'Document text extracted via OCR processing';
    }
  }
  
  /**
   * Generate mock extracted data
   */
  private generateMockExtractedData(
    documentTypeId: string,
    primaryType: string
  ): DocumentExtractedData {
    const baseData: DocumentExtractedData = {
      documentType: primaryType,
      documentSubtype: documentTypeId
    };
    
    switch (documentTypeId) {
      case 'passport':
        return {
          ...baseData,
          fullName: 'John Patrick O\'Sullivan',
          firstName: 'John',
          lastName: 'O\'Sullivan',
          documentNumber: 'P123456789',
          nationality: 'Irish',
          dateOfBirth: '1985-03-15',
          gender: 'M',
          placeOfBirth: 'Dublin',
          issueDate: '2020-03-14',
          expiryDate: '2030-03-13',
          issuingAuthority: 'Department of Foreign Affairs'
        };
        
      case 'drivers_license':
        return {
          ...baseData,
          fullName: 'John Patrick O\'Sullivan',
          documentNumber: 'DL987654321',
          dateOfBirth: '1985-03-15',
          issueDate: '2020-03-15',
          expiryDate: '2030-03-15',
          address: {
            line1: '123 Grafton Street',
            city: 'Dublin',
            postalCode: 'D02 X285',
            country: 'Ireland'
          }
        };
        
      case 'payslip':
        return {
          ...baseData,
          fullName: 'John Patrick O\'Sullivan',
          employer: 'Tech Solutions Ireland Ltd',
          grossIncome: 4500,
          netIncome: 3240,
          employmentType: 'Full-time',
          payPeriod: 'Monthly',
          customFields: {
            employeeNumber: '12345',
            payDate: '2024-01-31',
            tax: 1035,
            prsi: 225
          }
        };
        
      case 'bank_statements':
        return {
          ...baseData,
          fullName: 'John Patrick O\'Sullivan',
          accountNumber: '****1234',
          bankName: 'Bank of Ireland',
          accountType: 'Current Account',
          customFields: {
            openingBalance: 11250,
            closingBalance: 12450,
            statementPeriod: '01/01/2024 - 31/01/2024',
            transactionCount: 15
          }
        };
        
      case 'utility_bill':
        return {
          ...baseData,
          fullName: 'John Patrick O\'Sullivan',
          provider: 'ESB Networks',
          accountReference: '123456789',
          billDate: '2024-01-15',
          address: {
            line1: '123 Grafton Street',
            city: 'Dublin',
            postalCode: 'D02 X285',
            country: 'Ireland'
          },
          customFields: {
            amountDue: 125.50,
            dueDate: '2024-02-15',
            serviceType: 'Electricity'
          }
        };
        
      default:
        return baseData;
    }
  }
  
  /**
   * Utility function to validate date
   */
  private isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }
  
  /**
   * Batch process multiple documents
   */
  async processDocuments(
    documents: UploadedDocument[],
    options: Partial<ProcessingOptions> = {}
  ): Promise<Map<string, DocumentProcessingResult>> {
    const results = new Map<string, DocumentProcessingResult>();
    
    // Process documents in parallel with concurrency limit
    const concurrencyLimit = 3;
    const chunks = this.chunkArray(documents, concurrencyLimit);
    
    for (const chunk of chunks) {
      const promises = chunk.map(async (document) => {
        try {
          const result = await this.processDocument(document, options);
          return { documentId: document.id, result };
        } catch (error) {
          return {
            documentId: document.id,
            result: {
              success: false,
              processedAt: new Date(),
              extractedData: {},
              confidence: 0,
              validationResults: [],
              errors: [`Failed to process: ${error instanceof Error ? error.message : 'Unknown error'}`],
              warnings: [],
              processingTime: 0,
              classificationResult: { primaryType: 'unknown' as const, confidence: 0 }
            }
          };
        }
      });
      
      const chunkResults = await Promise.all(promises);
      chunkResults.forEach(({ documentId, result }) => {
        results.set(documentId, result);
      });
    }
    
    return results;
  }
  
  /**
   * Utility function to chunk array
   */
  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }
  
  /**
   * Get processing statistics
   */
  getProcessingStats(): {
    activeProcesses: number;
    totalProcessed: number;
    averageProcessingTime: number;
  } {
    return {
      activeProcesses: this.processingQueue.size,
      totalProcessed: 0, // Would be tracked in a real implementation
      averageProcessingTime: 2500 // milliseconds
    };
  }
}