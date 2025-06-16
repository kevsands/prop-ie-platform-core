/**
 * Security Audit Logger
 * Provides standardized logging for security and audit events
 */

import winston from 'winston';

/**
 * Audit severity levels for categorizing audit events
 */
export enum AuditSeverity {
  CRITICAL = 'CRITICAL',  // Critical security issues requiring immediate action
  ERROR = 'ERROR',        // Serious errors that need attention
  WARNING = 'WARNING',    // Potentially problematic situations
  INFO = 'INFO',          // Normal but significant events
  DEBUG = 'DEBUG'         // Detailed debugging information
}

/**
 * Audit categories for organizing audit events
 */
export enum AuditCategory {
  AUTHENTICATION = 'AUTHENTICATION',  // Login, logout, token operations
  AUTHORIZATION = 'AUTHORIZATION',    // Permission checks, access control
  DATA_ACCESS = 'DATA_ACCESS',        // Reading or modifying data
  CONFIGURATION = 'CONFIGURATION',    // System configuration changes
  USER_MANAGEMENT = 'USER_MANAGEMENT', // User creation, modification, deletion
  SECURITY = 'SECURITY',              // Security-specific events
  SYSTEM = 'SYSTEM',                  // System-level operations
  API = 'API',                        // API access and usage
  PERFORMANCE = 'PERFORMANCE'         // Performance-related events
}

/**
 * Audit logger for security events
 */
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'security-audit' },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/security-audit.log',
      level: 'info'
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

/**
 * Log a security event
 * @param level The log level
 * @param message The log message
 * @param meta Additional metadata
 */
export function logSecurityEvent(
  level: 'info' | 'warn' | 'error',
  message: string,
  meta: Record<string, any> = {}
): void {
  logger.log(level, message, {
    ...meta,
    timestamp: new Date().toISOString()
  });
}

/**
 * Log a security audit event
 * @param action The action performed
 * @param resource The resource affected
 * @param user The user performing the action
 * @param status The status of the action
 * @param details Additional details
 */
export function logAuditEvent(
  action: string,
  resource: string,
  user: string,
  status: 'success' | 'failure',
  details: Record<string, any> = {}
): void {
  logSecurityEvent('info', 'Security audit event', {
    action,
    resource,
    user,
    status,
    ...details
  });
}

// Audit log data type
export interface AuditLogData {
  userId?: string;
  resourceType?: string;
  resourceId?: string;
  action: string;
  status: 'success' | 'failure';
  details?: any;
  clientIp?: string;
  userAgent?: string;
}

/**
 * Enhanced Audit Logger for security events
 */
export const AuditLogger = {
  /**
   * Log a security event
   * 
   * @param action The action being performed
   * @param severity The severity level of the event
   * @param message A descriptive message about the event
   * @param data Additional data relevant to the event
   */
  logSecurity: (
    action: string, 
    severity: AuditSeverity, 
    message: string, 
    data?: any
  ) => {
    // For now, just log to console
    const level = severity === AuditSeverity.CRITICAL || severity === AuditSeverity.ERROR ? 'error' :
                  severity === AuditSeverity.WARNING ? 'warn' : 'info';

    console[level](`[SECURITY:${severity}] ${action}: ${message}`, data);

    // In a production environment, this would:
    // 1. Encrypt sensitive data
    // 2. Send to a secure audit log store
    // 3. Trigger alerts for high-severity events
  },

  /**
   * Log an authentication event
   * 
   * @param action The authentication action (login, logout, etc.)
   * @param userId The ID of the user involved
   * @param status Success or failure
   * @param details Additional details about the event
   */
  logAuthentication: (
    action: string,
    userId: string,
    status: 'success' | 'failure',
    details?: any
  ) => {
    const severity = status === 'failure' ? AuditSeverity.WARNING : AuditSeverity.INFO;
    const message = `Authentication ${action} ${status} for user ${userId}`;

    AuditLogger.logSecurity(action, severity, message, {
      category: AuditCategory.AUTHENTICATION,
      userId,
      status,
      timestamp: Date.now(),
      ...details
    });
  },

  /**
   * Log an authorization event
   * 
   * @param action The authorization action (access granted/denied)
   * @param userId The ID of the user involved
   * @param resource The resource being accessed
   * @param status Success or failure
   * @param details Additional details about the event
   */
  logAuthorization: (
    action: string,
    userId: string,
    resource: string,
    status: 'success' | 'failure',
    details?: any
  ) => {
    const severity = status === 'failure' ? AuditSeverity.WARNING : AuditSeverity.INFO;
    const message = `Authorization ${action} ${status} for user ${userId} on ${resource}`;

    AuditLogger.logSecurity(action, severity, message, {
      category: AuditCategory.AUTHORIZATION,
      userId,
      resource,
      status,
      timestamp: Date.now(),
      ...details
    });
  },

  /**
   * Log a data access event
   * 
   * @param action The data access action (readwritedelete)
   * @param userId The ID of the user involved
   * @param resourceType The type of resource being accessed
   * @param resourceId The ID of the resource
   * @param status Success or failure
   * @param details Additional details about the event
   */
  logDataAccess: (
    action: string,
    userId: string,
    resourceType: string,
    resourceId: string,
    status: 'success' | 'failure',
    details?: any
  ) => {
    const severity = status === 'failure' ? AuditSeverity.WARNING : AuditSeverity.INFO;
    const message = `Data ${action} ${status} by user ${userId} on ${resourceType}:${resourceId}`;

    AuditLogger.logSecurity(action, severity, message, {
      category: AuditCategory.DATA_ACCESS,
      userId,
      resourceType,
      resourceId,
      status,
      timestamp: Date.now(),
      ...details
    });
  }
};

export default logger;