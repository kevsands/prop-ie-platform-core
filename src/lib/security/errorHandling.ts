/**
 * Enhanced Security Error Handling
 * 
 * This module provides specialized error classes and error handling
 * utilities for security-related errors in the PropIE application.
 * 
 * Features:
 * - Comprehensive error code categorization
 * - Performance-optimized error handling with context
 * - Standardized error response formatting
 * - Detailed security logging integration
 * - HTTP status code mapping
 * - User-friendly error messages
 */

import { AuditLogger, AuditCategory, AuditSeverity } from './auditLogger';
import { asyncSafeCacheFunction } from '@/utils/performance/safeCache';

/**
 * Enumeration of security error codes with enhanced categorization
 */
export enum SecurityErrorCode {
  // Authentication errors
  AUTHENTICATION_FAILED = 'auth_failed',
  INVALID_CREDENTIALS = 'invalid_credentials',
  ACCOUNT_LOCKED = 'account_locked',
  ACCOUNT_DISABLED = 'account_disabled',
  ACCOUNT_NOT_FOUND = 'account_not_found',
  LOGIN_BLOCKED = 'login_blocked',
  PASSWORD_EXPIRED = 'password_expired',

  // MFA errors
  MFA_REQUIRED = 'mfa_required',
  MFA_SETUP_REQUIRED = 'mfa_setup_required',
  MFA_VERIFICATION_FAILED = 'mfa_verification_failed',
  MFA_TIMEOUT = 'mfa_timeout',
  MFA_INVALID_TYPE = 'mfa_invalid_type',
  RECOVERY_CODE_INVALID = 'recovery_code_invalid',
  RECOVERY_CODE_USED = 'recovery_code_used',
  RECOVERY_CODE_EXPIRED = 'recovery_code_expired',

  // Session errors
  SESSION_EXPIRED = 'session_expired',
  SESSION_INVALID = 'session_invalid',
  SESSION_HIJACKING = 'session_hijacking',
  SESSION_LIMIT_EXCEEDED = 'session_limit_exceeded',
  SESSION_REVOKED = 'session_revoked',
  DEVICE_NOT_TRUSTED = 'device_not_trusted',
  DEVICE_BLOCKED = 'device_blocked',
  INVALID_TOKEN = 'invalid_token',
  TOKEN_EXPIRED = 'token_expired',
  TOKEN_REVOKED = 'token_revoked',

  // Access control errors
  UNAUTHORIZED_ACCESS = 'unauthorized_access',
  INSUFFICIENT_PERMISSIONS = 'insufficient_permissions',
  INVALID_ROLE = 'invalid_role',
  FORBIDDEN_OPERATION = 'forbidden_operation',
  TEMPORARY_ACCESS_DENIED = 'temporary_access_denied',
  RESOURCE_ACCESS_DENIED = 'resource_access_denied',
  PERMISSION_SCOPE_EXCEEDED = 'permission_scope_exceeded',
  REQUIRES_ELEVATION = 'requires_elevation',
  REQUIRES_RECENT_AUTH = 'requires_recent_auth',

  // Threat detection errors
  BRUTE_FORCE_DETECTED = 'brute_force_detected',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  ACCOUNT_COMPROMISED = 'account_compromised',
  LOCATION_CHANGE = 'location_change',
  IMPOSSIBLE_TRAVEL = 'impossible_travel',
  UNUSUAL_BEHAVIOR = 'unusual_behavior',
  ANOMALY_DETECTED = 'anomaly_detected',
  ATTACK_DETECTED = 'attack_detected',

  // Validation errors
  VALIDATION_FAILED = 'validation_failed',
  INVALID_INPUT = 'invalid_input',
  INVALID_FORMAT = 'invalid_format',
  MISSING_REQUIRED_FIELD = 'missing_required_field',
  DATA_TYPE_MISMATCH = 'data_type_mismatch',
  CONSTRAINT_VIOLATION = 'constraint_violation',
  MALFORMED_JSON = 'malformed_json',
  INVALID_ENUM_VALUE = 'invalid_enum_value',
  VALIDATION_DEPTH_EXCEEDED = 'validation_depth_exceeded',
  INVALID_DATE = 'invalid_date',
  SCHEMA_VIOLATION = 'schema_violation',

  // API Protection errors
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  QUOTA_EXCEEDED = 'quota_exceeded',
  API_ABUSE_DETECTED = 'api_abuse_detected',
  API_VERSION_DEPRECATED = 'api_version_deprecated',
  API_NOT_AVAILABLE = 'api_not_available',
  API_KEY_INVALID = 'api_key_invalid',
  API_KEY_EXPIRED = 'api_key_expired',
  API_KEY_REVOKED = 'api_key_revoked',

  // CSRF errors
  CSRF_TOKEN_INVALID = 'csrf_token_invalid',
  CSRF_TOKEN_MISSING = 'csrf_token_missing',
  CSRF_TOKEN_EXPIRED = 'csrf_token_expired',

  // Data integrity errors
  DATA_INTEGRITY_VIOLATION = 'data_integrity_violation',
  DATA_CORRUPTED = 'data_corrupted',
  DUPLICATE_ENTRY = 'duplicate_entry',
  REFERENCE_CONSTRAINT = 'reference_constraint',
  VERSION_CONFLICT = 'version_conflict',
  TRANSACTION_FAILED = 'transaction_failed',

  // Performance errors
  RESOURCE_EXHAUSTION = 'resource_exhaustion',
  TIMEOUT_EXCEEDED = 'timeout_exceeded',
  REQUEST_ENTITY_TOO_LARGE = 'request_entity_too_large',
  REQUEST_COMPLEXITY_EXCEEDED = 'request_complexity_exceeded',
  OPERATION_THROTTLED = 'operation_throttled',

  // File errors
  FILE_SIZE_EXCEEDED = 'file_size_exceeded',
  UNSUPPORTED_FILE_TYPE = 'unsupported_file_type',
  FILE_UPLOAD_FAILED = 'file_upload_failed',
  FILE_ACCESS_DENIED = 'file_access_denied',

  // Encryption errors
  ENCRYPTION_FAILED = 'encryption_failed',
  DECRYPTION_FAILED = 'decryption_failed',
  KEY_NOT_FOUND = 'key_not_found',

  // General errors
  INTERNAL_SECURITY_ERROR = 'internal_security_error',
  CONFIGURATION_ERROR = 'configuration_error',
  INTEGRATION_ERROR = 'integration_error',
  FEATURE_DISABLED = 'feature_disabled',
  UNSUPPORTED_OPERATION = 'unsupported_operation',
  SYSTEM_UNDER_MAINTENANCE = 'system_under_maintenance',
  DEPENDENCY_FAILURE = 'dependency_failure',
  SERVICE_UNAVAILABLE = 'service_unavailable'
}

/**
 * Error category for grouping related errors
 */
export enum ErrorCategory {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  SECURITY = 'security',
  PERFORMANCE = 'performance',
  SYSTEM = 'system',
  DATA = 'data',
  API = 'api',
  FILE = 'file',
  UNKNOWN = 'unknown'
}

/**
 * Map error codes to categories for better organization
 */
const errorCodeToCategory: Record<SecurityErrorCode, ErrorCategory> = {
  // Authentication errors
  [SecurityErrorCode.AUTHENTICATION_FAILED]: ErrorCategory.AUTHENTICATION,
  [SecurityErrorCode.INVALID_CREDENTIALS]: ErrorCategory.AUTHENTICATION,
  [SecurityErrorCode.ACCOUNT_LOCKED]: ErrorCategory.AUTHENTICATION,
  [SecurityErrorCode.ACCOUNT_DISABLED]: ErrorCategory.AUTHENTICATION,
  [SecurityErrorCode.ACCOUNT_NOT_FOUND]: ErrorCategory.AUTHENTICATION,
  [SecurityErrorCode.LOGIN_BLOCKED]: ErrorCategory.AUTHENTICATION,
  [SecurityErrorCode.PASSWORD_EXPIRED]: ErrorCategory.AUTHENTICATION,

  // MFA errors
  [SecurityErrorCode.MFA_REQUIRED]: ErrorCategory.AUTHENTICATION,
  [SecurityErrorCode.MFA_SETUP_REQUIRED]: ErrorCategory.AUTHENTICATION,
  [SecurityErrorCode.MFA_VERIFICATION_FAILED]: ErrorCategory.AUTHENTICATION,
  [SecurityErrorCode.MFA_TIMEOUT]: ErrorCategory.AUTHENTICATION,
  [SecurityErrorCode.MFA_INVALID_TYPE]: ErrorCategory.AUTHENTICATION,
  [SecurityErrorCode.RECOVERY_CODE_INVALID]: ErrorCategory.AUTHENTICATION,
  [SecurityErrorCode.RECOVERY_CODE_USED]: ErrorCategory.AUTHENTICATION,
  [SecurityErrorCode.RECOVERY_CODE_EXPIRED]: ErrorCategory.AUTHENTICATION,

  // Session errors
  [SecurityErrorCode.SESSION_EXPIRED]: ErrorCategory.AUTHENTICATION,
  [SecurityErrorCode.SESSION_INVALID]: ErrorCategory.AUTHENTICATION,
  [SecurityErrorCode.SESSION_HIJACKING]: ErrorCategory.SECURITY,
  [SecurityErrorCode.SESSION_LIMIT_EXCEEDED]: ErrorCategory.SECURITY,
  [SecurityErrorCode.SESSION_REVOKED]: ErrorCategory.SECURITY,
  [SecurityErrorCode.DEVICE_NOT_TRUSTED]: ErrorCategory.SECURITY,
  [SecurityErrorCode.DEVICE_BLOCKED]: ErrorCategory.SECURITY,
  [SecurityErrorCode.INVALID_TOKEN]: ErrorCategory.AUTHENTICATION,
  [SecurityErrorCode.TOKEN_EXPIRED]: ErrorCategory.AUTHENTICATION,
  [SecurityErrorCode.TOKEN_REVOKED]: ErrorCategory.AUTHENTICATION,

  // Access control errors
  [SecurityErrorCode.UNAUTHORIZED_ACCESS]: ErrorCategory.AUTHORIZATION,
  [SecurityErrorCode.INSUFFICIENT_PERMISSIONS]: ErrorCategory.AUTHORIZATION,
  [SecurityErrorCode.INVALID_ROLE]: ErrorCategory.AUTHORIZATION,
  [SecurityErrorCode.FORBIDDEN_OPERATION]: ErrorCategory.AUTHORIZATION,
  [SecurityErrorCode.TEMPORARY_ACCESS_DENIED]: ErrorCategory.AUTHORIZATION,
  [SecurityErrorCode.RESOURCE_ACCESS_DENIED]: ErrorCategory.AUTHORIZATION,
  [SecurityErrorCode.PERMISSION_SCOPE_EXCEEDED]: ErrorCategory.AUTHORIZATION,
  [SecurityErrorCode.REQUIRES_ELEVATION]: ErrorCategory.AUTHORIZATION,
  [SecurityErrorCode.REQUIRES_RECENT_AUTH]: ErrorCategory.AUTHORIZATION,

  // Threat detection errors
  [SecurityErrorCode.BRUTE_FORCE_DETECTED]: ErrorCategory.SECURITY,
  [SecurityErrorCode.SUSPICIOUS_ACTIVITY]: ErrorCategory.SECURITY,
  [SecurityErrorCode.ACCOUNT_COMPROMISED]: ErrorCategory.SECURITY,
  [SecurityErrorCode.LOCATION_CHANGE]: ErrorCategory.SECURITY,
  [SecurityErrorCode.IMPOSSIBLE_TRAVEL]: ErrorCategory.SECURITY,
  [SecurityErrorCode.UNUSUAL_BEHAVIOR]: ErrorCategory.SECURITY,
  [SecurityErrorCode.ANOMALY_DETECTED]: ErrorCategory.SECURITY,
  [SecurityErrorCode.ATTACK_DETECTED]: ErrorCategory.SECURITY,

  // Validation errors
  [SecurityErrorCode.VALIDATION_FAILED]: ErrorCategory.VALIDATION,
  [SecurityErrorCode.INVALID_INPUT]: ErrorCategory.VALIDATION,
  [SecurityErrorCode.INVALID_FORMAT]: ErrorCategory.VALIDATION,
  [SecurityErrorCode.MISSING_REQUIRED_FIELD]: ErrorCategory.VALIDATION,
  [SecurityErrorCode.DATA_TYPE_MISMATCH]: ErrorCategory.VALIDATION,
  [SecurityErrorCode.CONSTRAINT_VIOLATION]: ErrorCategory.VALIDATION,
  [SecurityErrorCode.MALFORMED_JSON]: ErrorCategory.VALIDATION,
  [SecurityErrorCode.INVALID_ENUM_VALUE]: ErrorCategory.VALIDATION,
  [SecurityErrorCode.VALIDATION_DEPTH_EXCEEDED]: ErrorCategory.VALIDATION,
  [SecurityErrorCode.INVALID_DATE]: ErrorCategory.VALIDATION,
  [SecurityErrorCode.SCHEMA_VIOLATION]: ErrorCategory.VALIDATION,

  // API Protection errors
  [SecurityErrorCode.RATE_LIMIT_EXCEEDED]: ErrorCategory.API,
  [SecurityErrorCode.QUOTA_EXCEEDED]: ErrorCategory.API,
  [SecurityErrorCode.API_ABUSE_DETECTED]: ErrorCategory.SECURITY,
  [SecurityErrorCode.API_VERSION_DEPRECATED]: ErrorCategory.API,
  [SecurityErrorCode.API_NOT_AVAILABLE]: ErrorCategory.API,
  [SecurityErrorCode.API_KEY_INVALID]: ErrorCategory.API,
  [SecurityErrorCode.API_KEY_EXPIRED]: ErrorCategory.API,
  [SecurityErrorCode.API_KEY_REVOKED]: ErrorCategory.API,

  // CSRF errors
  [SecurityErrorCode.CSRF_TOKEN_INVALID]: ErrorCategory.SECURITY,
  [SecurityErrorCode.CSRF_TOKEN_MISSING]: ErrorCategory.SECURITY,
  [SecurityErrorCode.CSRF_TOKEN_EXPIRED]: ErrorCategory.SECURITY,

  // Data integrity errors
  [SecurityErrorCode.DATA_INTEGRITY_VIOLATION]: ErrorCategory.DATA,
  [SecurityErrorCode.DATA_CORRUPTED]: ErrorCategory.DATA,
  [SecurityErrorCode.DUPLICATE_ENTRY]: ErrorCategory.DATA,
  [SecurityErrorCode.REFERENCE_CONSTRAINT]: ErrorCategory.DATA,
  [SecurityErrorCode.VERSION_CONFLICT]: ErrorCategory.DATA,
  [SecurityErrorCode.TRANSACTION_FAILED]: ErrorCategory.DATA,

  // Performance errors
  [SecurityErrorCode.RESOURCE_EXHAUSTION]: ErrorCategory.PERFORMANCE,
  [SecurityErrorCode.TIMEOUT_EXCEEDED]: ErrorCategory.PERFORMANCE,
  [SecurityErrorCode.REQUEST_ENTITY_TOO_LARGE]: ErrorCategory.PERFORMANCE,
  [SecurityErrorCode.REQUEST_COMPLEXITY_EXCEEDED]: ErrorCategory.PERFORMANCE,
  [SecurityErrorCode.OPERATION_THROTTLED]: ErrorCategory.PERFORMANCE,

  // File errors
  [SecurityErrorCode.FILE_SIZE_EXCEEDED]: ErrorCategory.FILE,
  [SecurityErrorCode.UNSUPPORTED_FILE_TYPE]: ErrorCategory.FILE,
  [SecurityErrorCode.FILE_UPLOAD_FAILED]: ErrorCategory.FILE,
  [SecurityErrorCode.FILE_ACCESS_DENIED]: ErrorCategory.FILE,

  // Encryption errors
  [SecurityErrorCode.ENCRYPTION_FAILED]: ErrorCategory.SECURITY,
  [SecurityErrorCode.DECRYPTION_FAILED]: ErrorCategory.SECURITY,
  [SecurityErrorCode.KEY_NOT_FOUND]: ErrorCategory.SECURITY,

  // General errors
  [SecurityErrorCode.INTERNAL_SECURITY_ERROR]: ErrorCategory.SYSTEM,
  [SecurityErrorCode.CONFIGURATION_ERROR]: ErrorCategory.SYSTEM,
  [SecurityErrorCode.INTEGRATION_ERROR]: ErrorCategory.SYSTEM,
  [SecurityErrorCode.FEATURE_DISABLED]: ErrorCategory.SYSTEM,
  [SecurityErrorCode.UNSUPPORTED_OPERATION]: ErrorCategory.SYSTEM,
  [SecurityErrorCode.SYSTEM_UNDER_MAINTENANCE]: ErrorCategory.SYSTEM,
  [SecurityErrorCode.DEPENDENCY_FAILURE]: ErrorCategory.SYSTEM,
  [SecurityErrorCode.SERVICE_UNAVAILABLE]: ErrorCategory.SYSTEM
};

/**
 * Context for security error handling
 */
export interface SecurityErrorContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  resourceId?: string;
  resourceType?: string;
  action?: string;
  ipAddress?: string;
  timestamp?: number;
  source?: string;
  additional?: Record<string, any>
  );
  originalErrorName?: string;
  featureId?: string;
  error?: string | Error;
  errors?: any[];
  errorMessage?: string;
  configEnabled?: boolean;
  enableLazyLoading?: boolean;
  sourceName?: string;
  originalError?: Error | string;
}

/**
 * Options for error handling and responses
 */
export interface ErrorHandlingOptions {
  logError?: boolean;
  includeStack?: boolean;
  includeContext?: boolean;
  includeErrorId?: boolean;
  sanitizeError?: boolean;
  recordMetrics?: boolean;
}

/**
 * Specialized error class for security-related errors with enhanced performance features
 */
export class SecurityError extends Error {
  public readonly category: ErrorCategory;
  public readonly errorId: string;
  public readonly timestamp: number;

  /**
   * Create a new SecurityError
   * @param message Error message
   * @param code Security error code
   * @param context Error context
   * @param details Additional error details
   */
  constructor(
    message: string,
    public readonly code: SecurityErrorCode,
    public readonly context: SecurityErrorContext = {},
    public readonly details?: Record<string, any>
  ) {
    super(message);
    this.name = 'SecurityError';
    this.category = errorCodeToCategory[code] || ErrorCategory.UNKNOWN;
    this.errorId = `sec_${Date.now().toString(36)}_${Math.random().toString(36).substring(29)}`;
    this.timestamp = Date.now();

    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(thisSecurityError);
    }

    // Log security error if AuditLogger is available (async to not block)
    if (AuditLogger) {
      Promise.resolve().then(() => {
        AuditLogger.logSecurity(
          'security_error',
          this.getSeverity(),
          message,
          {
            errorId: this.errorId,
            errorCode: code,
            errorCategory: this.category,
            errorMessage: message,
            timestamp: this.timestamp,
            ...context,
            ...details
          }
        );
      }).catch(err => {

      });
    }
  }

  /**
   * Map error code to severity level with enhanced categorization
   */
  private getSeverity(): AuditSeverity {
    switch (this.code) {
      // Critical severity errors
      case SecurityErrorCode.ACCOUNT_COMPROMISED:
      case SecurityErrorCode.SESSION_HIJACKING:
      case SecurityErrorCode.IMPOSSIBLE_TRAVEL:
      case SecurityErrorCode.ATTACK_DETECTED:
      case SecurityErrorCode.DATA_CORRUPTED:
      case SecurityErrorCode.ENCRYPTION_FAILED:
      case SecurityErrorCode.DECRYPTION_FAILED:
        return AuditSeverity.CRITICAL;

      // High severity errors
      case SecurityErrorCode.BRUTE_FORCE_DETECTED:
      case SecurityErrorCode.SUSPICIOUS_ACTIVITY:
      case SecurityErrorCode.UNAUTHORIZED_ACCESS:
      case SecurityErrorCode.API_ABUSE_DETECTED:
      case SecurityErrorCode.ANOMALY_DETECTED:
      case SecurityErrorCode.UNUSUAL_BEHAVIOR:
      case SecurityErrorCode.RESOURCE_EXHAUSTION:
      case SecurityErrorCode.DATA_INTEGRITY_VIOLATION:
        return AuditSeverity.ERROR;

      // Medium severity errors
      case SecurityErrorCode.AUTHENTICATION_FAILED:
      case SecurityErrorCode.INVALID_CREDENTIALS:
      case SecurityErrorCode.ACCOUNT_LOCKED:
      case SecurityErrorCode.MFA_REQUIRED:
      case SecurityErrorCode.LOCATION_CHANGE:
      case SecurityErrorCode.RATE_LIMIT_EXCEEDED:
      case SecurityErrorCode.SESSION_EXPIRED:
      case SecurityErrorCode.INSUFFICIENT_PERMISSIONS:
      case SecurityErrorCode.CSRF_TOKEN_INVALID:
      case SecurityErrorCode.CSRF_TOKEN_MISSING:
      case SecurityErrorCode.DUPLICATE_ENTRY:
      case SecurityErrorCode.VERSION_CONFLICT:
      case SecurityErrorCode.TIMEOUT_EXCEEDED:
      case SecurityErrorCode.OPERATION_THROTTLED:
        return AuditSeverity.WARNING;

      // Low severity errors
      case SecurityErrorCode.VALIDATION_FAILED:
      case SecurityErrorCode.INVALID_INPUT:
      case SecurityErrorCode.MFA_SETUP_REQUIRED:
      case SecurityErrorCode.DEVICE_NOT_TRUSTED:
      case SecurityErrorCode.FEATURE_DISABLED:
      case SecurityErrorCode.MISSING_REQUIRED_FIELD:
      case SecurityErrorCode.API_VERSION_DEPRECATED:
        return AuditSeverity.INFO;

      // Default severity for other errors
      default:
        return AuditSeverity.WARNING;
    }
  }

  /**
   * Get appropriate HTTP status code for this error
   */
  getHttpStatus(): number {
    switch (this.code) {
      // 401 Unauthorized - Authentication errors
      case SecurityErrorCode.AUTHENTICATION_FAILED:
      case SecurityErrorCode.INVALID_CREDENTIALS:
      case SecurityErrorCode.INVALID_TOKEN:
      case SecurityErrorCode.TOKEN_EXPIRED:
      case SecurityErrorCode.TOKEN_REVOKED:
      case SecurityErrorCode.SESSION_EXPIRED:
      case SecurityErrorCode.SESSION_INVALID:
      case SecurityErrorCode.MFA_REQUIRED:
      case SecurityErrorCode.MFA_VERIFICATION_FAILED:
      case SecurityErrorCode.LOGIN_BLOCKED:
      case SecurityErrorCode.REQUIRES_RECENT_AUTH:
        return 401;

      // 403 Forbidden - Authorization errors
      case SecurityErrorCode.UNAUTHORIZED_ACCESS:
      case SecurityErrorCode.INSUFFICIENT_PERMISSIONS:
      case SecurityErrorCode.INVALID_ROLE:
      case SecurityErrorCode.FORBIDDEN_OPERATION:
      case SecurityErrorCode.TEMPORARY_ACCESS_DENIED:
      case SecurityErrorCode.RESOURCE_ACCESS_DENIED:
      case SecurityErrorCode.PERMISSION_SCOPE_EXCEEDED:
      case SecurityErrorCode.REQUIRES_ELEVATION:
      case SecurityErrorCode.CSRF_TOKEN_INVALID:
      case SecurityErrorCode.CSRF_TOKEN_MISSING:
      case SecurityErrorCode.CSRF_TOKEN_EXPIRED:
      case SecurityErrorCode.FILE_ACCESS_DENIED:
        return 403;

      // 400 Bad Request - Validation errors
      case SecurityErrorCode.VALIDATION_FAILED:
      case SecurityErrorCode.INVALID_INPUT:
      case SecurityErrorCode.INVALID_FORMAT:
      case SecurityErrorCode.MISSING_REQUIRED_FIELD:
      case SecurityErrorCode.DATA_TYPE_MISMATCH:
      case SecurityErrorCode.CONSTRAINT_VIOLATION:
      case SecurityErrorCode.MALFORMED_JSON:
      case SecurityErrorCode.INVALID_ENUM_VALUE:
      case SecurityErrorCode.VALIDATION_DEPTH_EXCEEDED:
      case SecurityErrorCode.INVALID_DATE:
      case SecurityErrorCode.SCHEMA_VIOLATION:
        return 400;

      // 404 Not Found
      case SecurityErrorCode.ACCOUNT_NOT_FOUND:
      case SecurityErrorCode.KEY_NOT_FOUND:
        return 404;

      // 409 Conflict - Data conflicts
      case SecurityErrorCode.DUPLICATE_ENTRY:
      case SecurityErrorCode.VERSION_CONFLICT:
      case SecurityErrorCode.REFERENCE_CONSTRAINT:
        return 409;

      // 413 Payload Too Large
      case SecurityErrorCode.REQUEST_ENTITY_TOO_LARGE:
      case SecurityErrorCode.FILE_SIZE_EXCEEDED:
        return 413;

      // 415 Unsupported Media Type
      case SecurityErrorCode.UNSUPPORTED_FILE_TYPE:
        return 415;

      // 422 Unprocessable Entity - Semantic errors
      case SecurityErrorCode.DATA_INTEGRITY_VIOLATION:
      case SecurityErrorCode.TRANSACTION_FAILED:
        return 422;

      // 423 Locked - Account/resource locking errors
      case SecurityErrorCode.ACCOUNT_LOCKED:
      case SecurityErrorCode.ACCOUNT_DISABLED:
      case SecurityErrorCode.BRUTE_FORCE_DETECTED:
        return 423;

      // 429 Too Many Requests - Rate limiting errors
      case SecurityErrorCode.RATE_LIMIT_EXCEEDED:
      case SecurityErrorCode.QUOTA_EXCEEDED:
      case SecurityErrorCode.API_ABUSE_DETECTED:
      case SecurityErrorCode.REQUEST_COMPLEXITY_EXCEEDED:
      case SecurityErrorCode.OPERATION_THROTTLED:
        return 429;

      // 503 Service Unavailable
      case SecurityErrorCode.SERVICE_UNAVAILABLE:
      case SecurityErrorCode.SYSTEM_UNDER_MAINTENANCE:
      case SecurityErrorCode.DEPENDENCY_FAILURE:
        return 503;

      // 500 Internal Server Error - Server-side errors
      case SecurityErrorCode.INTERNAL_SECURITY_ERROR:
      case SecurityErrorCode.CONFIGURATION_ERROR:
      case SecurityErrorCode.INTEGRATION_ERROR:
      case SecurityErrorCode.ENCRYPTION_FAILED:
      case SecurityErrorCode.DECRYPTION_FAILED:
      case SecurityErrorCode.RESOURCE_EXHAUSTION:
        return 500;

      // Default to 400 Bad Request for other errors
      default:
        return 400;
    }
  }

  /**
   * Get a user-friendly error message based on error code
   */
  getUserMessage(): string {
    switch (this.code) {
      // Authentication errors
      case SecurityErrorCode.AUTHENTICATION_FAILED:
      case SecurityErrorCode.INVALID_CREDENTIALS:
        return 'Authentication failed. Please check your credentials and try again.';

      case SecurityErrorCode.ACCOUNT_LOCKED:
        return 'Your account has been temporarily locked due to multiple failed login attempts. Please try again later or contact support.';

      case SecurityErrorCode.ACCOUNT_DISABLED:
        return 'Your account has been disabled. Please contact support for assistance.';

      case SecurityErrorCode.ACCOUNT_NOT_FOUND:
        return 'We couldn\'t find an account with those credentials. Please check your information or create a new account.';

      case SecurityErrorCode.LOGIN_BLOCKED:
        return 'Login is temporarily blocked for security reasons. Please try again later or contact support.';

      case SecurityErrorCode.PASSWORD_EXPIRED:
        return 'Your password has expired. Please reset your password to continue.';

      // MFA errors
      case SecurityErrorCode.MFA_REQUIRED:
        return 'Multi-factor authentication is required to complete this action.';

      case SecurityErrorCode.MFA_SETUP_REQUIRED:
        return 'You need to set up multi-factor authentication before continuing.';

      case SecurityErrorCode.MFA_VERIFICATION_FAILED:
        return 'Multi-factor authentication verification failed. Please try again.';

      case SecurityErrorCode.MFA_TIMEOUT:
        return 'Multi-factor authentication timed out. Please try again.';

      case SecurityErrorCode.MFA_INVALID_TYPE:
        return 'The selected authentication method is not valid for your account.';

      case SecurityErrorCode.RECOVERY_CODE_INVALID:
        return 'The recovery code you entered is invalid. Please try another code.';

      case SecurityErrorCode.RECOVERY_CODE_USED:
        return 'This recovery code has already been used. Please try another code or contact support.';

      case SecurityErrorCode.RECOVERY_CODE_EXPIRED:
        return 'This recovery code has expired. Please request a new code.';

      // Session errors
      case SecurityErrorCode.SESSION_EXPIRED:
        return 'Your session has expired. Please log in again.';

      case SecurityErrorCode.SESSION_INVALID:
        return 'Your session is invalid. Please log in again.';

      case SecurityErrorCode.SESSION_HIJACKING:
        return 'Your session has been terminated due to suspicious activity. If this was not you, please change your password immediately.';

      case SecurityErrorCode.SESSION_LIMIT_EXCEEDED:
        return 'You have exceeded the maximum number of allowed sessions. Please log out from other devices and try again.';

      case SecurityErrorCode.SESSION_REVOKED:
        return 'Your session has been revoked. Please log in again.';

      case SecurityErrorCode.DEVICE_NOT_TRUSTED:
        return 'This device is not recognized. Additional verification is required.';

      case SecurityErrorCode.DEVICE_BLOCKED:
        return 'This device has been blocked for security reasons. Please contact support for assistance.';

      case SecurityErrorCode.INVALID_TOKEN:
      case SecurityErrorCode.TOKEN_EXPIRED:
      case SecurityErrorCode.TOKEN_REVOKED:
        return 'Your authentication token is invalid or has expired. Please log in again.';

      // Access control errors
      case SecurityErrorCode.UNAUTHORIZED_ACCESS:
      case SecurityErrorCode.INSUFFICIENT_PERMISSIONS:
      case SecurityErrorCode.INVALID_ROLE:
      case SecurityErrorCode.FORBIDDEN_OPERATION:
      case SecurityErrorCode.RESOURCE_ACCESS_DENIED:
        return 'You do not have permission to perform this action.';

      case SecurityErrorCode.TEMPORARY_ACCESS_DENIED:
        return 'Access is temporarily denied. Please try again later.';

      case SecurityErrorCode.PERMISSION_SCOPE_EXCEEDED:
        return 'This action exceeds your permission scope.';

      case SecurityErrorCode.REQUIRES_ELEVATION:
        return 'This action requires elevated permissions. Please confirm your identity to continue.';

      case SecurityErrorCode.REQUIRES_RECENT_AUTH:
        return 'This action requires a recent authentication. Please log in again to continue.';

      // Threat detection errors
      case SecurityErrorCode.BRUTE_FORCE_DETECTED:
      case SecurityErrorCode.SUSPICIOUS_ACTIVITY:
      case SecurityErrorCode.ACCOUNT_COMPROMISED:
      case SecurityErrorCode.UNUSUAL_BEHAVIOR:
      case SecurityErrorCode.ANOMALY_DETECTED:
      case SecurityErrorCode.ATTACK_DETECTED:
        return 'Suspicious activity has been detected on your account. For your protection, additional verification is required.';

      case SecurityErrorCode.LOCATION_CHANGE:
        return 'You are logging in from a new location. For your protection, additional verification is required.';

      case SecurityErrorCode.IMPOSSIBLE_TRAVEL:
        return 'Suspicious login detected from an unusual location. For your protection, additional verification is required.';

      // Validation errors
      case SecurityErrorCode.VALIDATION_FAILED:
      case SecurityErrorCode.INVALID_INPUT:
      case SecurityErrorCode.INVALID_FORMAT:
      case SecurityErrorCode.MISSING_REQUIRED_FIELD:
      case SecurityErrorCode.DATA_TYPE_MISMATCH:
      case SecurityErrorCode.CONSTRAINT_VIOLATION:
      case SecurityErrorCode.INVALID_ENUM_VALUE:
      case SecurityErrorCode.VALIDATION_DEPTH_EXCEEDED:
      case SecurityErrorCode.INVALID_DATE:
      case SecurityErrorCode.SCHEMA_VIOLATION:
        return 'There was a problem with the information you provided. Please check your input and try again.';

      case SecurityErrorCode.MALFORMED_JSON:
        return 'The data format is invalid. Please ensure your request is properly formatted.';

      // API Protection errors
      case SecurityErrorCode.RATE_LIMIT_EXCEEDED:
      case SecurityErrorCode.QUOTA_EXCEEDED:
      case SecurityErrorCode.OPERATION_THROTTLED:
        return 'You have made too many requests. Please try again later.';

      case SecurityErrorCode.API_ABUSE_DETECTED:
        return 'Unusual activity detected. Please try again later or contact support.';

      case SecurityErrorCode.API_VERSION_DEPRECATED:
        return 'This API version is deprecated. Please upgrade to the latest version.';

      case SecurityErrorCode.API_NOT_AVAILABLE:
        return 'This API is currently unavailable. Please try again later.';

      case SecurityErrorCode.API_KEY_INVALID:
      case SecurityErrorCode.API_KEY_EXPIRED:
      case SecurityErrorCode.API_KEY_REVOKED:
        return 'Your API key is invalid, expired, or has been revoked.';

      // CSRF errors
      case SecurityErrorCode.CSRF_TOKEN_INVALID:
      case SecurityErrorCode.CSRF_TOKEN_MISSING:
      case SecurityErrorCode.CSRF_TOKEN_EXPIRED:
        return 'Your request could not be processed due to a security check failure. Please refresh the page and try again.';

      // Data integrity errors
      case SecurityErrorCode.DATA_INTEGRITY_VIOLATION:
      case SecurityErrorCode.DATA_CORRUPTED:
        return 'A data integrity error occurred. Please try again or contact support.';

      case SecurityErrorCode.DUPLICATE_ENTRY:
        return 'A duplicate entry was detected. Please use a unique value.';

      case SecurityErrorCode.REFERENCE_CONSTRAINT:
        return 'This operation cannot be completed due to existing references.';

      case SecurityErrorCode.VERSION_CONFLICT:
        return 'A version conflict was detected. Please refresh and try again.';

      case SecurityErrorCode.TRANSACTION_FAILED:
        return 'The transaction failed. Please try again.';

      // Performance errors
      case SecurityErrorCode.RESOURCE_EXHAUSTION:
      case SecurityErrorCode.TIMEOUT_EXCEEDED:
      case SecurityErrorCode.REQUEST_ENTITY_TOO_LARGE:
      case SecurityErrorCode.REQUEST_COMPLEXITY_EXCEEDED:
        return 'The request could not be completed due to resource constraints. Please simplify your request or try again later.';

      // File errors
      case SecurityErrorCode.FILE_SIZE_EXCEEDED:
        return 'The file size exceeds the maximum allowed limit.';

      case SecurityErrorCode.UNSUPPORTED_FILE_TYPE:
        return 'The file type is not supported.';

      case SecurityErrorCode.FILE_UPLOAD_FAILED:
        return 'File upload failed. Please try again.';

      case SecurityErrorCode.FILE_ACCESS_DENIED:
        return 'You do not have permission to access this file.';

      // Encryption errors
      case SecurityErrorCode.ENCRYPTION_FAILED:
      case SecurityErrorCode.DECRYPTION_FAILED:
      case SecurityErrorCode.KEY_NOT_FOUND:
        return 'A security operation failed. Please try again or contact support.';

      // Other errors
      case SecurityErrorCode.INTERNAL_SECURITY_ERROR:
      case SecurityErrorCode.CONFIGURATION_ERROR:
      case SecurityErrorCode.INTEGRATION_ERROR:
      case SecurityErrorCode.DEPENDENCY_FAILURE:
        return 'An internal security error occurred. Our team has been notified and is working to resolve the issue.';

      case SecurityErrorCode.FEATURE_DISABLED:
        return 'This security feature is currently disabled.';

      case SecurityErrorCode.UNSUPPORTED_OPERATION:
        return 'This operation is not supported.';

      case SecurityErrorCode.SYSTEM_UNDER_MAINTENANCE:
      case SecurityErrorCode.SERVICE_UNAVAILABLE:
        return 'The service is temporarily unavailable. Please try again later.';

      // Default message for other errors
      default:
        return this.message;
    }
  }

  /**
   * Create a standardized response object for API responses
   * @param options Options for customizing the response
   */
  toResponse(options: ErrorHandlingOptions = {}): Record<string, any> {
    const {
      includeStack = false,
      includeContext = false,
      includeErrorId = true,
      sanitizeError = true
    } = options;

    const response: Record<string, any> = {
      error: true,
      code: this.code,
      category: this.category,
      message: this.getUserMessage(),
      status: this.getHttpStatus(),
      timestamp: this.timestamp
    };

    // Include error ID for tracking
    if (includeErrorId) {
      response.errorId = this.errorId;
    }

    // Include context information if requested
    if (includeContext && this.context) {
      response.context = sanitizeError ?
        // Sanitize sensitive data if requested
        this.sanitizeContext(this.context) :
        this.context;
    }

    // Include validation errors if available
    if (this.details?.errors) {
      response.errors = this.details.errors;
    }

    // Include stack trace for debugging (only in non-production)
    if (includeStack && this.stack && process.env.NODE_ENV !== 'production') {
      response.stack = this.stack.split('\n');
    }

    return response;
  }

  /**
   * Sanitize error context to remove sensitive information
   */
  private sanitizeContext(context: SecurityErrorContext): SecurityErrorContext {
    const sanitized = { ...context };

    // Remove potentially sensitive fields
    const sensitiveFields = ['password', 'token', 'key', 'secret', 'credentials'];

    if (sanitized.additional) {
      const additionalSanitized = { ...sanitized.additional };

      for (const field of sensitiveFields) {
        if (field in additionalSanitized) {
          additionalSanitized[field] = '[REDACTED]';
        }
      }

      sanitized.additional = additionalSanitized;
    }

    return sanitized;
  }
}

/**
 * Authentication Error class for authentication-specific errors
 * with enhanced context and performance optimizations
 */
export class AuthenticationError extends SecurityError {
  constructor(
    message: string,
    code: SecurityErrorCode,
    context: SecurityErrorContext = {},
    details?: Record<string, any>
  ) {
    super(messagecodecontextdetails);
    this.name = 'AuthenticationError';
  }
}

/**
 * Authorization Error class for authorization-specific errors
 * with enhanced context and performance optimizations
 */
export class AuthorizationError extends SecurityError {
  constructor(
    message: string,
    code: SecurityErrorCode,
    context: SecurityErrorContext = {},
    details?: Record<string, any>
  ) {
    super(messagecodecontextdetails);
    this.name = 'AuthorizationError';
  }
}

/**
 * Validation Error class for data validation errors
 * with enhanced schema validation support
 */
export class ValidationError extends SecurityError {
  constructor(
    message: string,
    code: SecurityErrorCode = SecurityErrorCode.VALIDATION_FAILED,
    context: SecurityErrorContext = {},
    details?: Record<string, any>
  ) {
    super(messagecodecontextdetails);
    this.name = 'ValidationError';
  }

  /**
   * Get a more specific error message for validation errors
   */
  override getUserMessage(): string {
    // If we have field errors, create a more helpful message
    if (this.details?.errors && Array.isArray(this.details.errors)) {
      const firstError = this.details.errors[0];
      if (firstError && firstError.path && firstError.message) {
        return `Validation error: ${firstError.message} (at ${firstError.path})${this.details.errors.length> 1 ? ` and ${this.details.errors.length - 1} more errors` : ''
          }`;
      }
    }

    // Otherwise use the default message
    return super.getUserMessage();
  }
}

/**
 * Performance-optimized security error factory with caching
 * @param code Security error code
 * @param messageGenerator Function to generate error message
 */
export const createSecurityError = asyncSafeCacheFunction<
  [SecurityErrorCode, (context: SecurityErrorContext) => string, SecurityErrorContext?, Record<string, any>?],
  SecurityError
>(async (args: any) => {
  const [code, messageGenerator, context = {}, details] = args;
  const message = messageGenerator(context);

  // Create a different error type based on the category
  const category = errorCodeToCategory[code];

  switch (category) {
    case ErrorCategory.AUTHENTICATION:
      return new AuthenticationError(messagecodecontextdetails);
    case ErrorCategory.AUTHORIZATION:
      return new AuthorizationError(messagecodecontextdetails);
    case ErrorCategory.VALIDATION:
      return new ValidationError(messagecodecontextdetails);
    default:
      return new SecurityError(messagecodecontextdetails);
  }
}
);

/**
 * Security-aware try/catch wrapper for async functions
 * with enhanced error handling and performance optimizations
 * @param fn The function to execute
 * @param options Error handling options
 * @param errorHandler Optional custom error handler
 * @returns The function result or throws a well-formatted error
 */
export async function securityTryCatch<T>(
  fn: () => Promise<T>,
  options: {
    defaultErrorCode?: SecurityErrorCode;
    context?: SecurityErrorContext;
    rethrowSecurityErrors?: boolean;
    logErrors?: boolean;
  } = {},
  errorHandler?: (error: any) => Promise<T>
): Promise<T> {
  const {
    defaultErrorCode = SecurityErrorCode.INTERNAL_SECURITY_ERROR,
    context = {},
    rethrowSecurityErrors = true,
    logErrors = true
  } = options;

  try {
    return await fn();
  } catch (error) {
    // If it's already a SecurityError and we want to rethrow them, just throw it
    if (error instanceof SecurityError && rethrowSecurityErrors) {
      throw error;
    }

    // For other errors, log and optionally handle
    let securityError: SecurityError;

    if (error instanceof Error) {
      const errorCode = error instanceof SecurityError ? error.code : defaultErrorCode;

      securityError = new SecurityError(
        error.message,
        errorCode,
        {
          ...context,
          originalErrorName: error.name,
          errorMessage: error.message},
        {
          stack: error.stack,
          originalError: error instanceof SecurityError ?
            undefined : error.message
        }
      );
    } else {
      securityError = new SecurityError(
        'Unknown security error occurred',
        defaultErrorCode,
        {
          ...context,
          errorMessage: String(error)},
        { originalError: String(error) }
      );
    }

    // Log the error if requested
    if (logErrors && AuditLogger && !(error instanceof SecurityError)) {
      AuditLogger.logSecurity(
        'security_try_catch_error',
        AuditSeverity.ERROR,
        `Security try/catch caught error: ${securityError.message}`,
        {
          errorId: securityError.errorId,
          errorCode: securityError.code,
          errorCategory: securityError.category,
          ...context,
          stack: securityError.stack
        }
      );
    }

    // Use custom handler if provided
    if (errorHandler) {
      return await errorHandler(securityError);
    }

    throw securityError;
  }
}

/**
 * Performance-optimized security error handler for API routes
 * with standardized response formatting
 * @param error The error to handle
 * @param options Options for customizing the response
 * @returns A properly formatted Response object
 */
export function handleSecurityError(
  error: any,
  options: ErrorHandlingOptions = {}
): Response {
  const defaultOptions: ErrorHandlingOptions = {
    logError: true,
    includeStack: process.env.NODE_ENV !== 'production',
    includeContext: false,
    includeErrorId: true,
    sanitizeError: true,
    recordMetrics: true,
    ...options
  };

  // Record error metrics if enabled
  if (defaultOptions.recordMetrics) {
    recordErrorMetrics(error);
  }

  if (error instanceof SecurityError) {
    // Use the SecurityError's methods to generate a response
    const responseData = error.toResponse(defaultOptions);

    return Response.json(
      responseData,
      {
        status: error.getHttpStatus(),
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'Cache-Control': 'no-store'
        }
      }
    );
  } else if (error instanceof Error) {
    // Convert generic error to SecurityError
    const securityError = new SecurityError(
      process.env.NODE_ENV === 'production' ?
        'An unexpected error occurred' :
        `An unexpected error occurred: ${error.message}`,
      SecurityErrorCode.INTERNAL_SECURITY_ERROR,
      { errorMessage: error.message },
      { originalError: error.message, stack: error.stack }
    );

    // Log the error if requested
    if (defaultOptions.logError && AuditLogger) {
      AuditLogger.logSecurity(
        'unexpected_api_error',
        AuditSeverity.ERROR,
        `Unexpected API error: ${error.message}`,
        {
          errorId: securityError.errorId,
          stack: error.stack,
          ...error
        }
      );
    }

    return Response.json(
      securityError.toResponse(defaultOptions),
      {
        status: 500,
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'Cache-Control': 'no-store'
        }
      }
    );
  } else {
    // Fallback for non-Error objects
    const errorId = `sec_${Date.now().toString(36)}_${Math.random().toString(36).substring(29)}`;

    // Log the error if requested
    if (defaultOptions.logError && AuditLogger) {
      AuditLogger.logSecurity(
        'unknown_api_error',
        AuditSeverity.ERROR,
        'Unknown API error type',
        {
          errorId,
          error: String(error)
        }
      );
    }

    return Response.json(
      {
        error: true,
        errorId: defaultOptions.includeErrorId ? errorId : undefined,
        code: SecurityErrorCode.INTERNAL_SECURITY_ERROR,
        category: ErrorCategory.UNKNOWN,
        message: 'An unexpected error occurred',
        status: 500,
        timestamp: Date.now()
      },
      {
        status: 500,
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'Cache-Control': 'no-store'
        }
      }
    );
  }
}

/**
 * Record metrics about security errors for monitoring
 * @param error The error to record metrics for
 */
function recordErrorMetrics(error: any): void {
  // Skip if not a security error
  if (!(error instanceof SecurityError)) {
    return;
  }

  // This would integrate with your metrics collection system
  // For now, we'll just add a placeholder implementation
  try {
    const category = error.category;
    const code = error.code;

    // Example of how you might record metrics
    const metrics = {
      timestamp: Date.now(),
      errorCategory: category,
      errorCode: code,
      count: 1
    };

    // In a real implementation, you would send these metrics to your monitoring system
    // 
  } catch (e) {
    // Silent fail to avoid disrupting normal error handling

  }
}