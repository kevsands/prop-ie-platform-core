'use client';

/**
 * Authentication Logger Module
 * 
 * Provides logging and reporting for authentication events and errors
 * with structured logging and optional server reporting.
 */

import { api } from '../api-client';

export enum AuthEventType {
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILURE = 'login_failure',
  LOGOUT = 'logout',
  REGISTRATION = 'registration',
  TOKEN_REFRESH = 'token_refresh',
  TOKEN_EXPIRED = 'token_expired',
  INVALID_TOKEN = 'invalid_token',
  SESSION_EXPIRED = 'session_expired',
  PERMISSION_DENIED = 'permission_denied',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
}

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical',
}

export interface AuthLogEvent {
  type: AuthEventType;
  level: LogLevel;
  message: string;
  timestamp: number;
  userId?: string;
  username?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

/**
 * Configuration for the auth logger
 */
interface AuthLoggerConfig {
  enableConsoleLogging: boolean;
  enableServerReporting: boolean;
  logLevel: LogLevel;
  reportEndpoint: string;
  includeUserInfo: boolean;
}

// Default configuration
const defaultConfig: AuthLoggerConfig = {
  enableConsoleLogging: true,
  enableServerReporting: process.env.NODE_ENV === 'production',
  logLevel: process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG,
  reportEndpoint: '/api/security/log', 
  includeUserInfo: true,
};

// Current configuration
let config: AuthLoggerConfig = { ...defaultConfig };

/**
 * Configure the auth logger
 */
export function configureAuthLogger(userConfig: Partial<AuthLoggerConfig>): void {
  config = { ...defaultConfig, ...userConfig };
}

/**
 * Get user agent and IP information
 */
function getEnvironmentInfo(): { userAgent: string, ipAddress: string | undefined } {
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown';
  return { userAgent, ipAddress: undefined };
}

/**
 * Determine if a log event should be logged based on level
 */
function shouldLog(level: LogLevel): boolean {
  const levels = {
    [LogLevel.DEBUG]: 0,
    [LogLevel.INFO]: 1,
    [LogLevel.WARN]: 2,
    [LogLevel.ERROR]: 3,
    [LogLevel.CRITICAL]: 4,
  };

  return levels[level] >= levels[config.logLevel];
}

/**
 * Format the log message for console output
 */
function formatLogMessage(event: AuthLogEvent): string {
  return `[AUTH] [${event.level.toUpperCase()}] [${event.type}] ${event.message}`;
}

/**
 * Send the log event to the server
 */
async function reportToServer(event: AuthLogEvent): Promise<void> {
  try {
    await api.post(config.reportEndpoint, {
      event: {
        ...event,
        source: 'client',
        application: 'prop-ie-app',
        environment: process.env.NODE_ENV || 'development',
      }
    }, { requiresAuth: false });
  } catch (error) {
    // Silently fail server reporting to avoid cascading errors
    if (config.enableConsoleLogging) {
      console.error('Failed to report auth event to server:', error);
    }
  }
}

/**
 * Record an authentication event
 */
export async function logAuthEvent(
  type: AuthEventType,
  message: string,
  level: LogLevel = LogLevel.INFO,
  metadata: Record<string, any> = {},
  userId?: string,
  username?: string,
): Promise<void> {
  if (!shouldLog(level)) {
    return;
  }

  const { userAgent, ipAddress } = getEnvironmentInfo();
  
  const event: AuthLogEvent = {
    type,
    level,
    message,
    timestamp: Date.now(),
    userId,
    username,
    userAgent,
    ipAddress,
    metadata,
  };

  // Console logging
  if (config.enableConsoleLogging) {
    const formattedMessage = formatLogMessage(event);
    
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage, { event });
        break;
      case LogLevel.INFO:
        console.info(formattedMessage, { event });
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, { event });
        break;
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        console.error(formattedMessage, { event });
        break;
    }
  }

  // Server reporting for warnings and above
  if (config.enableServerReporting && level !== LogLevel.DEBUG && level !== LogLevel.INFO) {
    await reportToServer(event);
  }
}

/**
 * Log a successful login
 */
export function logLoginSuccess(userId: string, username?: string, metadata?: Record<string, any>): void {
  logAuthEvent(
    AuthEventType.LOGIN_SUCCESS,
    `User ${username || userId} logged in successfully`,
    LogLevel.INFO,
    metadata,
    userId,
    username
  );
}

/**
 * Log a failed login attempt
 */
export function logLoginFailure(
  reason: string,
  username?: string,
  metadata?: Record<string, any>
): void {
  logAuthEvent(
    AuthEventType.LOGIN_FAILURE,
    `Login failed: ${reason}`,
    LogLevel.WARN,
    metadata,
    undefined,
    username
  );
}

/**
 * Log a logout event
 */
export function logLogout(userId: string, username?: string): void {
  logAuthEvent(
    AuthEventType.LOGOUT,
    `User ${username || userId} logged out`,
    LogLevel.INFO,
    {},
    userId,
    username
  );
}

/**
 * Log a token expiration
 */
export function logTokenExpired(userId?: string, username?: string): void {
  logAuthEvent(
    AuthEventType.TOKEN_EXPIRED,
    'Authentication token expired',
    LogLevel.WARN,
    {},
    userId,
    username
  );
}

/**
 * Log a token refresh
 */
export function logTokenRefresh(userId: string, username?: string): void {
  logAuthEvent(
    AuthEventType.TOKEN_REFRESH,
    'Authentication token refreshed',
    LogLevel.DEBUG,
    {},
    userId,
    username
  );
}

/**
 * Log a suspicious activity
 */
export function logSuspiciousActivity(
  description: string,
  metadata?: Record<string, any>,
  userId?: string,
  username?: string
): void {
  logAuthEvent(
    AuthEventType.SUSPICIOUS_ACTIVITY,
    `Suspicious activity detected: ${description}`,
    LogLevel.ERROR,
    metadata,
    userId,
    username
  );
}

/**
 * Log a permission denied event
 */
export function logPermissionDenied(
  resource: string,
  requiredPermission: string,
  userId?: string,
  username?: string
): void {
  logAuthEvent(
    AuthEventType.PERMISSION_DENIED,
    `Permission denied: ${requiredPermission} required for ${resource}`,
    LogLevel.WARN,
    { resource, requiredPermission },
    userId,
    username
  );
}

export default {
  logAuthEvent,
  logLoginSuccess,
  logLoginFailure,
  logLogout,
  logTokenExpired,
  logTokenRefresh,
  logSuspiciousActivity,
  logPermissionDenied,
  configureAuthLogger,
};