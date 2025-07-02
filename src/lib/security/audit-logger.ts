/**
 * Security Audit Logger
 * 
 * Comprehensive audit logging system for security events and user activities
 * Provides structured logging with security context and threat detection capabilities
 */

/**
 * Security event types for categorization
 */
export enum SecurityEventType {
  // Authentication Events
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGOUT = 'LOGOUT',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  PASSWORD_RESET_REQUEST = 'PASSWORD_RESET_REQUEST',
  PASSWORD_RESET_COMPLETE = 'PASSWORD_RESET_COMPLETE',
  
  // Authorization Events
  ACCESS_DENIED = 'ACCESS_DENIED',
  PERMISSION_ESCALATION = 'PERMISSION_ESCALATION',
  ROLE_CHANGE = 'ROLE_CHANGE',
  
  // Data Access Events
  SENSITIVE_DATA_ACCESS = 'SENSITIVE_DATA_ACCESS',
  DATA_EXPORT = 'DATA_EXPORT',
  DATA_MODIFICATION = 'DATA_MODIFICATION',
  DATA_DELETION = 'DATA_DELETION',
  
  // Payment & Transaction Events
  PAYMENT_INITIATED = 'PAYMENT_INITIATED',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PAYMENT_FRAUD_SUSPECTED = 'PAYMENT_FRAUD_SUSPECTED',
  TRANSACTION_CREATED = 'TRANSACTION_CREATED',
  TRANSACTION_MODIFIED = 'TRANSACTION_MODIFIED',
  
  // Security Threats
  BRUTE_FORCE_DETECTED = 'BRUTE_FORCE_DETECTED',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  IP_BLOCKED = 'IP_BLOCKED',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  FRAUD_ALERT = 'FRAUD_ALERT',
  
  // System Events
  SECURITY_CONFIG_CHANGE = 'SECURITY_CONFIG_CHANGE',
  ADMIN_ACTION = 'ADMIN_ACTION',
  API_ABUSE_DETECTED = 'API_ABUSE_DETECTED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // Data Privacy Events
  PII_ACCESS = 'PII_ACCESS',
  GDPR_REQUEST = 'GDPR_REQUEST',
  DATA_BREACH_DETECTED = 'DATA_BREACH_DETECTED'
}

/**
 * Security risk levels
 */
export enum SecurityRiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

/**
 * User context for audit logs
 */
export interface AuditUserContext {
  userId?: string;
  email?: string;
  role?: string;
  sessionId?: string;
  impersonatedBy?: string; // For admin impersonation
}

/**
 * Request context for audit logs
 */
export interface AuditRequestContext {
  ipAddress: string;
  userAgent: string;
  requestId?: string;
  method?: string;
  url?: string;
  headers?: Record<string, string>;
  geoLocation?: {
    country?: string;
    region?: string;
    city?: string;
  };
}

/**
 * Security event metadata
 */
export interface SecurityEventMetadata {
  resourceId?: string;
  resourceType?: string;
  oldValue?: any;
  newValue?: any;
  amount?: number;
  currency?: string;
  propertyId?: string;
  developmentId?: string;
  transactionId?: string;
  paymentMethodLast4?: string;
  failureReason?: string;
  attemptCount?: number;
  [key: string]: any;
}

/**
 * Complete audit log entry
 */
export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  eventType: SecurityEventType;
  riskLevel: SecurityRiskLevel;
  message: string;
  userContext?: AuditUserContext;
  requestContext: AuditRequestContext;
  metadata?: SecurityEventMetadata;
  tags?: string[];
  correlationId?: string; // For tracking related events
}

/**
 * Audit logger configuration
 */
export interface AuditLoggerConfig {
  enabled: boolean;
  logLevel: SecurityRiskLevel;
  enableConsoleLogging: boolean;
  enableFileLogging: boolean;
  enableRemoteLogging: boolean;
  remoteEndpoint?: string;
  retentionDays: number;
  encryptLogs: boolean;
  redactSensitiveData: boolean;
}

/**
 * Security Audit Logger Class
 */
export class SecurityAuditLogger {
  private config: AuditLoggerConfig;
  private logBuffer: AuditLogEntry[] = [];
  private flushTimer: NodeJS.Timeout | null = null;

  constructor(config: Partial<AuditLoggerConfig> = {}) {
    this.config = {
      enabled: true,
      logLevel: SecurityRiskLevel.LOW,
      enableConsoleLogging: process.env.NODE_ENV === 'development',
      enableFileLogging: true,
      enableRemoteLogging: process.env.NODE_ENV === 'production',
      retentionDays: 90,
      encryptLogs: process.env.NODE_ENV === 'production',
      redactSensitiveData: true,
      ...config
    };

    // Set up periodic log flushing
    this.startLogFlushing();
  }

  /**
   * Log a security event
   */
  logSecurityEvent(
    eventType: SecurityEventType,
    message: string,
    options: {
      riskLevel?: SecurityRiskLevel;
      userContext?: AuditUserContext;
      requestContext?: Partial<AuditRequestContext>;
      metadata?: SecurityEventMetadata;
      tags?: string[];
      correlationId?: string;
    } = {}
  ): void {
    if (!this.config.enabled) {
      return;
    }

    const riskLevel = options.riskLevel || this.determineRiskLevel(eventType);
    
    // Skip logging if below configured log level
    if (this.getRiskLevelPriority(riskLevel) < this.getRiskLevelPriority(this.config.logLevel)) {
      return;
    }

    const logEntry: AuditLogEntry = {
      id: this.generateLogId(),
      timestamp: new Date(),
      eventType,
      riskLevel,
      message,
      userContext: options.userContext,
      requestContext: this.enrichRequestContext(options.requestContext || {}),
      metadata: this.sanitizeMetadata(options.metadata),
      tags: options.tags,
      correlationId: options.correlationId || this.generateCorrelationId()
    };

    // Add to buffer for batch processing
    this.logBuffer.push(logEntry);

    // Immediate logging for critical events
    if (riskLevel === SecurityRiskLevel.CRITICAL) {
      this.flushLogs();
    }

    // Console logging for development
    if (this.config.enableConsoleLogging) {
      this.logToConsole(logEntry);
    }
  }

  /**
   * Log authentication events
   */
  logAuthEvent(
    eventType: SecurityEventType,
    userContext: AuditUserContext,
    requestContext: Partial<AuditRequestContext>,
    metadata?: SecurityEventMetadata
  ): void {
    const messages = {
      [SecurityEventType.LOGIN_SUCCESS]: `User ${userContext.email} logged in successfully`,
      [SecurityEventType.LOGIN_FAILED]: `Failed login attempt for ${userContext.email}`,
      [SecurityEventType.LOGOUT]: `User ${userContext.email} logged out`,
      [SecurityEventType.SESSION_EXPIRED]: `Session expired for user ${userContext.email}`,
      [SecurityEventType.PASSWORD_CHANGE]: `Password changed for user ${userContext.email}`,
      [SecurityEventType.PASSWORD_RESET_REQUEST]: `Password reset requested for ${userContext.email}`,
      [SecurityEventType.PASSWORD_RESET_COMPLETE]: `Password reset completed for ${userContext.email}`,
    };

    this.logSecurityEvent(
      eventType,
      messages[eventType] || `Authentication event: ${eventType}`,
      {
        userContext,
        requestContext,
        metadata,
        tags: ['authentication']
      }
    );
  }

  /**
   * Log payment events with enhanced security context
   */
  logPaymentEvent(
    eventType: SecurityEventType,
    amount: number,
    currency: string,
    userContext: AuditUserContext,
    requestContext: Partial<AuditRequestContext>,
    metadata: SecurityEventMetadata = {}
  ): void {
    const enhancedMetadata = {
      ...metadata,
      amount,
      currency,
      // Redact sensitive payment data
      paymentMethodLast4: metadata.paymentMethodLast4 ? `****${metadata.paymentMethodLast4}` : undefined
    };

    this.logSecurityEvent(
      eventType,
      `Payment ${eventType.toLowerCase().replace(/_/g, ' ')} - ${currency} ${amount.toLocaleString()}`,
      {
        riskLevel: this.getPaymentRiskLevel(eventType, amount),
        userContext,
        requestContext,
        metadata: enhancedMetadata,
        tags: ['payment', 'financial'],
        correlationId: metadata.transactionId
      }
    );
  }

  /**
   * Log data access events for compliance
   */
  logDataAccess(
    resourceType: string,
    resourceId: string,
    action: 'READ' | 'WRITE' | 'DELETE' | 'EXPORT',
    userContext: AuditUserContext,
    requestContext: Partial<AuditRequestContext>,
    metadata: SecurityEventMetadata = {}
  ): void {
    const eventType = this.getDataAccessEventType(action);
    const isPII = this.isPIIResource(resourceType);
    
    this.logSecurityEvent(
      eventType,
      `${action} access to ${resourceType} ${resourceId}`,
      {
        riskLevel: isPII ? SecurityRiskLevel.HIGH : SecurityRiskLevel.MEDIUM,
        userContext,
        requestContext,
        metadata: {
          ...metadata,
          resourceType,
          resourceId,
          action,
          isPII
        },
        tags: ['data-access', isPII ? 'pii' : 'data', resourceType.toLowerCase()]
      }
    );
  }

  /**
   * Log suspicious activity with threat intelligence
   */
  logSuspiciousActivity(
    description: string,
    threatIndicators: string[],
    userContext?: AuditUserContext,
    requestContext?: Partial<AuditRequestContext>,
    metadata: SecurityEventMetadata = {}
  ): void {
    this.logSecurityEvent(
      SecurityEventType.SUSPICIOUS_ACTIVITY,
      `Suspicious activity detected: ${description}`,
      {
        riskLevel: SecurityRiskLevel.HIGH,
        userContext,
        requestContext,
        metadata: {
          ...metadata,
          threatIndicators,
          detectionTimestamp: new Date().toISOString()
        },
        tags: ['security-threat', 'suspicious-activity', ...threatIndicators]
      }
    );
  }

  /**
   * Determine risk level based on event type
   */
  private determineRiskLevel(eventType: SecurityEventType): SecurityRiskLevel {
    const criticalEvents = [
      SecurityEventType.DATA_BREACH_DETECTED,
      SecurityEventType.FRAUD_ALERT,
      SecurityEventType.PAYMENT_FRAUD_SUSPECTED
    ];

    const highRiskEvents = [
      SecurityEventType.BRUTE_FORCE_DETECTED,
      SecurityEventType.ACCESS_DENIED,
      SecurityEventType.SUSPICIOUS_ACTIVITY,
      SecurityEventType.PII_ACCESS,
      SecurityEventType.DATA_DELETION,
      SecurityEventType.PERMISSION_ESCALATION
    ];

    const mediumRiskEvents = [
      SecurityEventType.LOGIN_FAILED,
      SecurityEventType.PAYMENT_FAILED,
      SecurityEventType.RATE_LIMIT_EXCEEDED,
      SecurityEventType.DATA_MODIFICATION,
      SecurityEventType.SECURITY_CONFIG_CHANGE
    ];

    if (criticalEvents.includes(eventType)) {
      return SecurityRiskLevel.CRITICAL;
    } else if (highRiskEvents.includes(eventType)) {
      return SecurityRiskLevel.HIGH;
    } else if (mediumRiskEvents.includes(eventType)) {
      return SecurityRiskLevel.MEDIUM;
    } else {
      return SecurityRiskLevel.LOW;
    }
  }

  /**
   * Get payment-specific risk level
   */
  private getPaymentRiskLevel(eventType: SecurityEventType, amount: number): SecurityRiskLevel {
    if (eventType === SecurityEventType.PAYMENT_FRAUD_SUSPECTED) {
      return SecurityRiskLevel.CRITICAL;
    }

    if (eventType === SecurityEventType.PAYMENT_FAILED) {
      return SecurityRiskLevel.MEDIUM;
    }

    // High-value transactions get higher risk level
    if (amount > 500000) { // €500k+
      return SecurityRiskLevel.HIGH;
    } else if (amount > 100000) { // €100k+
      return SecurityRiskLevel.MEDIUM;
    } else {
      return SecurityRiskLevel.LOW;
    }
  }

  /**
   * Map data actions to event types
   */
  private getDataAccessEventType(action: string): SecurityEventType {
    switch (action) {
      case 'READ':
        return SecurityEventType.SENSITIVE_DATA_ACCESS;
      case 'WRITE':
        return SecurityEventType.DATA_MODIFICATION;
      case 'DELETE':
        return SecurityEventType.DATA_DELETION;
      case 'EXPORT':
        return SecurityEventType.DATA_EXPORT;
      default:
        return SecurityEventType.SENSITIVE_DATA_ACCESS;
    }
  }

  /**
   * Check if resource contains PII
   */
  private isPIIResource(resourceType: string): boolean {
    const piiResources = ['user', 'profile', 'contact', 'payment', 'identity', 'kyc'];
    return piiResources.some(type => resourceType.toLowerCase().includes(type));
  }

  /**
   * Enrich request context with additional security information
   */
  private enrichRequestContext(context: Partial<AuditRequestContext>): AuditRequestContext {
    return {
      ipAddress: context.ipAddress || 'unknown',
      userAgent: context.userAgent || 'unknown',
      requestId: context.requestId || this.generateRequestId(),
      method: context.method,
      url: context.url,
      headers: this.sanitizeHeaders(context.headers),
      geoLocation: context.geoLocation
    };
  }

  /**
   * Sanitize metadata to remove sensitive information
   */
  private sanitizeMetadata(metadata?: SecurityEventMetadata): SecurityEventMetadata | undefined {
    if (!metadata || !this.config.redactSensitiveData) {
      return metadata;
    }

    const sanitized = { ...metadata };
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'cardNumber', 'cvv', 'ssn'];

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  /**
   * Sanitize HTTP headers
   */
  private sanitizeHeaders(headers?: Record<string, string>): Record<string, string> | undefined {
    if (!headers) return undefined;

    const sanitized = { ...headers };
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key', 'x-auth-token'];

    for (const header of sensitiveHeaders) {
      if (sanitized[header.toLowerCase()]) {
        sanitized[header.toLowerCase()] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  /**
   * Get risk level priority for comparison
   */
  private getRiskLevelPriority(level: SecurityRiskLevel): number {
    const priorities = {
      [SecurityRiskLevel.LOW]: 1,
      [SecurityRiskLevel.MEDIUM]: 2,
      [SecurityRiskLevel.HIGH]: 3,
      [SecurityRiskLevel.CRITICAL]: 4
    };
    return priorities[level];
  }

  /**
   * Generate unique log ID
   */
  private generateLogId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate correlation ID for tracking related events
   */
  private generateCorrelationId(): string {
    return `corr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Log to console with formatting
   */
  private logToConsole(logEntry: AuditLogEntry): void {
    const colors = {
      [SecurityRiskLevel.LOW]: '\x1b[32m',      // Green
      [SecurityRiskLevel.MEDIUM]: '\x1b[33m',   // Yellow
      [SecurityRiskLevel.HIGH]: '\x1b[31m',     // Red
      [SecurityRiskLevel.CRITICAL]: '\x1b[35m'  // Magenta
    };

    const reset = '\x1b[0m';
    const color = colors[logEntry.riskLevel];

    console.log(
      `${color}[SECURITY AUDIT]${reset} ${logEntry.timestamp.toISOString()} ` +
      `${color}[${logEntry.riskLevel}]${reset} ${logEntry.eventType}: ${logEntry.message}`
    );

    if (logEntry.userContext?.email) {
      console.log(`  User: ${logEntry.userContext.email}`);
    }

    if (logEntry.requestContext.ipAddress !== 'unknown') {
      console.log(`  IP: ${logEntry.requestContext.ipAddress}`);
    }

    if (logEntry.metadata && Object.keys(logEntry.metadata).length > 0) {
      console.log(`  Metadata:`, logEntry.metadata);
    }
  }

  /**
   * Start periodic log flushing
   */
  private startLogFlushing(): void {
    this.flushTimer = setInterval(() => {
      this.flushLogs();
    }, 30000); // Flush every 30 seconds
  }

  /**
   * Flush logs to persistent storage
   */
  private flushLogs(): void {
    if (this.logBuffer.length === 0) {
      return;
    }

    const logsToFlush = [...this.logBuffer];
    this.logBuffer = [];

    // File logging
    if (this.config.enableFileLogging) {
      this.writeLogsToFile(logsToFlush);
    }

    // Remote logging
    if (this.config.enableRemoteLogging && this.config.remoteEndpoint) {
      this.sendLogsToRemote(logsToFlush);
    }
  }

  /**
   * Write logs to file (placeholder - would implement actual file writing)
   */
  private writeLogsToFile(logs: AuditLogEntry[]): void {
    // In a real implementation, this would write to a secure log file
    console.log(`[Audit Logger] Would write ${logs.length} logs to file`);
  }

  /**
   * Send logs to remote logging service
   */
  private sendLogsToRemote(logs: AuditLogEntry[]): void {
    // In a real implementation, this would send to a SIEM or logging service
    console.log(`[Audit Logger] Would send ${logs.length} logs to remote endpoint`);
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    
    // Flush any remaining logs
    this.flushLogs();
  }
}

// Create and export singleton instance
export const auditLogger = new SecurityAuditLogger();

// Export utility functions for common logging scenarios
export const logAuthSuccess = (email: string, requestContext: Partial<AuditRequestContext>) => {
  auditLogger.logAuthEvent(
    SecurityEventType.LOGIN_SUCCESS,
    { email },
    requestContext
  );
};

export const logAuthFailure = (email: string, requestContext: Partial<AuditRequestContext>, reason: string) => {
  auditLogger.logAuthEvent(
    SecurityEventType.LOGIN_FAILED,
    { email },
    requestContext,
    { failureReason: reason }
  );
};

export const logPaymentAttempt = (
  success: boolean,
  amount: number,
  currency: string,
  userContext: AuditUserContext,
  requestContext: Partial<AuditRequestContext>,
  metadata?: SecurityEventMetadata
) => {
  auditLogger.logPaymentEvent(
    success ? SecurityEventType.PAYMENT_SUCCESS : SecurityEventType.PAYMENT_FAILED,
    amount,
    currency,
    userContext,
    requestContext,
    metadata
  );
};

export default auditLogger;