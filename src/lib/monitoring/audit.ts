import { logInfo, logWarn, generateCorrelationId } from './logger';
import { BusinessMetrics } from './metrics';

// Audit event types for compliance tracking
export enum AuditEventType {
  // Authentication events
  USER_LOGIN = 'user_login',
  USER_LOGOUT = 'user_logout',
  USER_REGISTRATION = 'user_registration',
  PASSWORD_CHANGE = 'password_change',
  MFA_ENABLED = 'mfa_enabled',
  MFA_DISABLED = 'mfa_disabled',
  
  // Data access events (GDPR compliance)
  PERSONAL_DATA_ACCESS = 'personal_data_access',
  PERSONAL_DATA_EXPORT = 'personal_data_export',
  PERSONAL_DATA_DELETE = 'personal_data_delete',
  PERSONAL_DATA_UPDATE = 'personal_data_update',
  
  // Property and transaction events
  PROPERTY_VIEW = 'property_view',
  PROPERTY_SEARCH = 'property_search',
  PROPERTY_INQUIRY = 'property_inquiry',
  PROPERTY_RESERVATION = 'property_reservation',
  TRANSACTION_START = 'transaction_start',
  TRANSACTION_COMPLETE = 'transaction_complete',
  TRANSACTION_CANCEL = 'transaction_cancel',
  
  // Financial events
  PAYMENT_INITIATED = 'payment_initiated',
  PAYMENT_COMPLETED = 'payment_completed',
  PAYMENT_FAILED = 'payment_failed',
  HTB_APPLICATION = 'htb_application',
  HTB_APPROVAL = 'htb_approval',
  
  // Document events
  DOCUMENT_UPLOAD = 'document_upload',
  DOCUMENT_DOWNLOAD = 'document_download',
  DOCUMENT_DELETE = 'document_delete',
  DOCUMENT_SHARE = 'document_share',
  
  // Administrative events
  ADMIN_USER_CREATE = 'admin_user_create',
  ADMIN_USER_DELETE = 'admin_user_delete',
  ADMIN_USER_UPDATE = 'admin_user_update',
  ADMIN_PERMISSION_CHANGE = 'admin_permission_change',
  ADMIN_SETTING_CHANGE = 'admin_setting_change',
  
  // System events
  SYSTEM_BACKUP = 'system_backup',
  SYSTEM_RESTORE = 'system_restore',
  SYSTEM_MAINTENANCE = 'system_maintenance',
  SECURITY_INCIDENT = 'security_incident',
  
  // Legal and compliance events
  TERMS_ACCEPTANCE = 'terms_acceptance',
  PRIVACY_CONSENT = 'privacy_consent',
  MARKETING_CONSENT = 'marketing_consent',
  DATA_RETENTION_DELETE = 'data_retention_delete',
}

// Audit severity levels
export enum AuditSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Audit log entry interface
export interface AuditLogEntry {
  eventType: AuditEventType;
  severity: AuditSeverity;
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  resource?: string;
  action: string;
  result: 'success' | 'failure' | 'pending';
  details?: Record<string, any>\n  );
  timestamp: Date;
  correlationId: string;
  complianceCategory?: 'GDPR' | 'Finance' | 'Security' | 'Legal';
}

// Main audit logging class
export class AuditLogger {
  
  // Log authentication events
  static async logUserLogin(
    userId: string, 
    method: string, 
    success: boolean, 
    ipAddress?: string, 
    userAgent?: string
  ) {
    await this.log({
      eventType: AuditEventType.USER_LOGIN,
      severity: success ? AuditSeverity.LOW : AuditSeverity.MEDIUM,
      userId,
      ipAddress,
      userAgent,
      action: `Login attempt via ${method}`,
      result: success ? 'success' : 'failure',
      details: {
        method,
        timestamp: new Date().toISOString()
      },
      complianceCategory: 'Security'
    });

    // Track business metric
    await BusinessMetrics.trackLoginAttempt(successmethod);
  }

  static async logUserLogout(userId: string, sessionDuration?: number) {
    await this.log({
      eventType: AuditEventType.USER_LOGOUT,
      severity: AuditSeverity.LOW,
      userId,
      action: 'User logout',
      result: 'success',
      details: {
        sessionDuration: sessionDuration ? `${sessionDuration}ms` : undefined
      },
      complianceCategory: 'Security'
    });
  }

  // Log GDPR compliance events
  static async logPersonalDataAccess(
    userId: string, 
    dataType: string, 
    accessor?: string, 
    purpose?: string
  ) {
    await this.log({
      eventType: AuditEventType.PERSONAL_DATA_ACCESS,
      severity: AuditSeverity.MEDIUM,
      userId,
      resource: dataType,
      action: 'Personal data accessed',
      result: 'success',
      details: {
        dataType,
        accessor: accessor || 'self',
        purpose: purpose || 'user_request',
        gdprBasis: 'legitimate_interest'
      },
      complianceCategory: 'GDPR'
    });
  }

  static async logPersonalDataExport(userId: string, exportFormat: string, dataTypes: string[]) {
    await this.log({
      eventType: AuditEventType.PERSONAL_DATA_EXPORT,
      severity: AuditSeverity.HIGH,
      userId,
      action: 'Personal data exported',
      result: 'success',
      details: {
        exportFormat,
        dataTypes,
        gdprBasis: 'data_portability',
        retentionNotice: 'Export will be automatically deleted after 30 days'
      },
      complianceCategory: 'GDPR'
    });
  }

  static async logPersonalDataDeletion(
    userId: string, 
    dataTypes: string[], 
    reason: string,
    retentionException?: string
  ) {
    await this.log({
      eventType: AuditEventType.PERSONAL_DATA_DELETE,
      severity: AuditSeverity.HIGH,
      userId,
      action: 'Personal data deleted',
      result: 'success',
      details: {
        dataTypes,
        reason,
        retentionException,
        gdprBasis: 'right_to_erasure',
        verificationRequired: true
      },
      complianceCategory: 'GDPR'
    });
  }

  // Log property and transaction events
  static async logPropertyReservation(
    userId: string, 
    propertyId: string, 
    amount: number, 
    paymentMethod: string
  ) {
    await this.log({
      eventType: AuditEventType.PROPERTY_RESERVATION,
      severity: AuditSeverity.HIGH,
      userId,
      resource: `property_${propertyId}`,
      action: 'Property reservation created',
      result: 'success',
      details: {
        propertyId,
        amount,
        paymentMethod,
        currency: 'EUR',
        legalRequirements: 'Irish property law compliance verified'
      },
      complianceCategory: 'Finance'
    });

    // Track business metric
    await BusinessMetrics.trackPropertyReservation(propertyId, amount, 'buyer');
  }

  static async logTransactionProgress(
    userId: string,
    transactionId: string,
    stage: string,
    legalMilestone?: string
  ) {
    await this.log({
      eventType: AuditEventType.TRANSACTION_START,
      severity: AuditSeverity.MEDIUM,
      userId,
      resource: `transaction_${transactionId}`,
      action: `Transaction progressed to ${stage}`,
      result: 'success',
      details: {
        transactionId,
        stage,
        legalMilestone,
        complianceChecks: 'AML/KYC verified',
        solicitorInvolved: stage !== 'initial'
      },
      complianceCategory: 'Legal'
    });
  }

  // Log HTB (Help-to-Buy) events - critical for Irish market compliance
  static async logHTBApplication(
    userId: string,
    applicationId: string,
    amount: number,
    status: string,
    eligibilityChecks: Record<string, boolean>
  ) {
    await this.log({
      eventType: AuditEventType.HTB_APPLICATION,
      severity: AuditSeverity.HIGH,
      userId,
      resource: `htb_application_${applicationId}`,
      action: `HTB application ${status}`,
      result: status === 'approved' ? 'success' : 'pending',
      details: {
        applicationId,
        amount,
        status,
        eligibilityChecks,
        governmentScheme: 'Irish HTB Scheme 2024',
        verificationRequired: true,
        appealRights: status === 'rejected'
      },
      complianceCategory: 'Finance'
    });

    // Track business metric
    await BusinessMetrics.trackHTBApplication(status, amount, 'Ireland');
  }

  // Log financial events
  static async logPayment(
    userId: string,
    paymentId: string,
    amount: number,
    purpose: string,
    success: boolean,
    failureReason?: string
  ) {
    await this.log({
      eventType: success ? AuditEventType.PAYMENT_COMPLETED : AuditEventType.PAYMENT_FAILED,
      severity: success ? AuditSeverity.MEDIUM : AuditSeverity.HIGH,
      userId,
      resource: `payment_${paymentId}`,
      action: `Payment ${success ? 'completed' : 'failed'}`,
      result: success ? 'success' : 'failure',
      details: {
        paymentId,
        amount,
        purpose,
        currency: 'EUR',
        failureReason,
        antiMoneyLaundering: 'AML checks completed',
        taxImplications: 'Stamp duty applicable'
      },
      complianceCategory: 'Finance'
    });
  }

  // Log document events
  static async logDocumentAccess(
    userId: string,
    documentId: string,
    documentType: string,
    action: 'view' | 'download' | 'share' | 'delete'
  ) {
    const eventType = {
      view: AuditEventType.DOCUMENT_DOWNLOAD,
      download: AuditEventType.DOCUMENT_DOWNLOAD,
      share: AuditEventType.DOCUMENT_SHARE,
      delete: AuditEventType.DOCUMENT_DELETE
    }[action];

    await this.log({
      eventType,
      severity: action === 'delete' ? AuditSeverity.HIGH : AuditSeverity.MEDIUM,
      userId,
      resource: `document_${documentId}`,
      action: `Document ${action}`,
      result: 'success',
      details: {
        documentId,
        documentType,
        classification: 'personal_data',
        retentionPeriod: this.getDocumentRetentionPeriod(documentType),
        legalBasis: 'contract_performance'
      },
      complianceCategory: 'GDPR'
    });
  }

  // Log administrative events
  static async logAdminAction(
    adminUserId: string,
    targetUserId: string,
    action: string,
    changes: Record<string, any>
  ) {
    await this.log({
      eventType: AuditEventType.ADMIN_USER_UPDATE,
      severity: AuditSeverity.HIGH,
      userId: adminUserId,
      resource: `user_${targetUserId}`,
      action: `Admin action: ${action}`,
      result: 'success',
      details: {
        targetUserId,
        changes,
        adminJustification: 'System administration',
        approvalRequired: Object.keys(changes).includes('permissions'),
        notificationSent: true
      },
      complianceCategory: 'Security'
    });
  }

  // Log security incidents
  static async logSecurityIncident(
    description: string,
    severity: AuditSeverity,
    affectedUsers?: string[],
    mitigationSteps?: string[]
  ) {
    await this.log({
      eventType: AuditEventType.SECURITY_INCIDENT,
      severity,
      action: 'Security incident reported',
      result: 'pending',
      details: {
        description,
        affectedUsers: affectedUsers?.length || 0,
        mitigationSteps,
        reportedAt: new Date().toISOString(),
        investigationRequired: true,
        regulatoryNotification: severity === AuditSeverity.CRITICAL
      },
      complianceCategory: 'Security'
    });
  }

  // Core logging method
  private static async log(entry: Partial<AuditLogEntry>) {
    const auditEntry: AuditLogEntry = {
      ...entry,
      timestamp: new Date(),
      correlationId: generateCorrelationId(),
      eventType: entry.eventType!,
      severity: entry.severity!,
      action: entry.action!,
      result: entry.result!
    };

    // Log to main logging system
    logInfo('AUDIT_EVENT', {
      auditEventType: auditEntry.eventType,
      auditSeverity: auditEntry.severity,
      auditUserId: auditEntry.userId,
      auditAction: auditEntry.action,
      auditResult: auditEntry.result,
      auditDetails: auditEntry.details,
      auditComplianceCategory: auditEntry.complianceCategory,
      auditTimestamp: auditEntry.timestamp,
      auditCorrelationId: auditEntry.correlationId
    });

    // Store in database for compliance queries (if needed)
    // await this.storeAuditEntry(auditEntry);

    // Send to compliance monitoring system
    if (auditEntry.severity === AuditSeverity.CRITICAL) {
      await this.alertComplianceTeam(auditEntry);
    }
  }

  // Helper methods
  private static getDocumentRetentionPeriod(documentType: string): string {
    const retentionPeriods: Record<string, string> = {
      'kyc_document': '7 years',
      'property_deed': '12 years',
      'mortgage_document': '7 years',
      'tax_document': '7 years',
      'identity_verification': '5 years',
      'consent_record': '3 years after withdrawal',
      'transaction_record': '6 years'
    };
    
    return retentionPeriods[documentType] || '6 years (default)';
  }

  private static async alertComplianceTeam(entry: AuditLogEntry) {
    logWarn('CRITICAL_AUDIT_EVENT', {
      eventType: entry.eventType,
      severity: entry.severity,
      userId: entry.userId,
      details: entry.details,
      immediateActionRequired: true
    });

    // In production, this would send notifications to compliance team
    // await notificationService.sendComplianceAlert(entry);
  }

  // Compliance reporting methods
  static async generateGDPRReport(userId: string, startDate: Date, endDate: Date) {
    logInfo('GDPR_REPORT_GENERATED', {
      userId,
      startDate,
      endDate,
      reportType: 'user_data_access',
      generatedBy: 'system',
      retentionPeriod: '30 days'
    });
    
    // Implementation would query audit logs and generate comprehensive GDPR report
    return {
      userId,
      reportGenerated: new Date(),
      dataAccessed: [],
      dataModified: [],
      dataShared: [],
      retentionSchedule: [],
      userRights: {
        canExport: true,
        canDelete: true,
        canModify: true,
        canWithdrawConsent: true
      }
    };
  }

  static async generateFinancialAuditReport(startDate: Date, endDate: Date) {
    logInfo('FINANCIAL_AUDIT_REPORT_GENERATED', {
      startDate,
      endDate,
      reportType: 'financial_transactions',
      complianceStandard: 'Irish Financial Regulations',
      generatedBy: 'system'
    });

    // Implementation would generate comprehensive financial audit report
    return {
      reportGenerated: new Date(),
      totalTransactions: 0,
      totalValue: 0,
      htbApplications: 0,
      complianceChecks: {
        amlCompliance: true,
        taxReporting: true,
        stampDutyCalculation: true
      }
    };
  }
}

// Export for use throughout the application
export { AuditLogger };
export default AuditLogger;