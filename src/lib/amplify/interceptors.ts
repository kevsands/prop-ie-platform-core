/**
 * AWS Amplify API Interceptors
 * 
 * This module provides request and response interceptors for API requests,
 * implementing security measures, monitoring, and error handling.
 */

import { AuditLogger, AuditCategory, AuditSeverity } from '@/lib/security/auditLogger';
import { RateLimiter } from '@/lib/security/rateLimit';
import { SessionFingerprint } from '@/lib/security/sessionFingerprint';

// Constants for interceptor configuration
const SENSITIVE_PARAMS = ['password', 'token', 'secret', 'key', 'credential', 'ssn', 'creditCard'];
const MAX_RESPONSE_TIME_WARNING = 3000; // 3 seconds

/**
 * Generate category for a request based on endpoint
 */
function getEndpointCategory(endpoint: string): 'auth' | 'api' | 'mutation' | 'query' | 'default' {
  const path = endpoint.toLowerCase();

  if (path.includes('/auth') || path.includes('/login') || path.includes('/register')) {
    return 'auth';
  } else if (path.includes('/graphql') && path.includes('mutation')) {
    return 'mutation';
  } else if (path.includes('/graphql')) {
    return 'query';
  } else {
    return 'api';
  }
}

/**
 * Sanitize request data to remove sensitive information
 */
function sanitizeRequestData(data: any): any {
  if (!data) return data;

  if (typeof data === 'object' && data !== null) {
    const sanitized = { ...data };

    for (const key in sanitized) {
      if (SENSITIVE_PARAMS.some(param => key.toLowerCase().includes(param.toLowerCase()))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
        sanitized[key] = sanitizeRequestData(sanitized[key]);
      }
    }

    return sanitized;
  }

  return data;
}

/**
 * Request interceptor for GraphQL operations
 */
export async function requestInterceptor(request: any): Promise<any> {
  const startTime = Date.now();
  const endpoint = request.path || 'graphql';
  const method = request.method || 'POST';
  const isGraphQL = endpoint.includes('graphql');

  // Store the start time for performance tracking
  request.metadata = {
    ...request.metadata,
    startTime
  };

  try {
    // Validate session fingerprint
    const fingerprintCheck = await SessionFingerprint.validate();
    if (!fingerprintCheck.valid) {
      // Session fingerprint invalid - potential session hijacking
      await AuditLogger.log({
        category: AuditCategory.SECURITY,
        action: 'session_fingerprint_invalid',
        severity: AuditSeverity.ERROR,
        description: `Invalid session fingerprint: ${fingerprintCheck.reason}`,
        status: 'failure',
        metadata: {
          endpoint,
          method,
          reason: fingerprintCheck.reason
        }
      });

      throw new Error('Security check failed: invalid session fingerprint');
    }

    // Check rate limits
    const category = getEndpointCategory(endpoint);
    const rateLimitCheck = RateLimiter.checkRateLimit(endpointcategory);

    if (!rateLimitCheck.allowed) {
      // Rate limit exceeded
      await AuditLogger.log({
        category: AuditCategory.SECURITY,
        action: 'rate_limit_exceeded',
        severity: AuditSeverity.WARNING,
        description: `Rate limit exceeded for ${endpoint}`,
        status: 'failure',
        metadata: {
          endpoint,
          method,
          reason: rateLimitCheck.reason,
          retryAfter: rateLimitCheck.retryAfter
        }
      });

      throw new Error(`Rate limit exceeded. Please try again in ${rateLimitCheck.retryAfter} seconds.`);
    }

    // Audit log API request (for important operations)
    if (category === 'auth' || category === 'mutation') {
      let operationName = '';
      let variables = {};

      if (isGraphQL && request.body) {
        operationName = request.body.operationName || '';
        variables = request.body.variables || {};
      }

      await AuditLogger.logApi(
        operationName || method,
        endpoint,
        method,
        'success',
        `API request: ${operationName || endpoint}`,
        {
          variables: sanitizeRequestData(variables)
        }
      );
    }

    // Continue with the request
    return request;
  } catch (error) {
    // If it's our own error (from rate limiting or fingerprint), throw it up
    if (error instanceof Error && 
        (error.message.includes('Rate limit') || 
         error.message.includes('Security check'))) {
      throw error;
    }

    // Otherwise log and continue

    return request;
  }
}

/**
 * Response interceptor for GraphQL operations
 */
export async function responseInterceptor(response: any, request: any): Promise<any> {
  const endTime = Date.now();
  const startTime = request.metadata?.startTime || endTime;
  const responseTime = endTime - startTime;

  const endpoint = request.path || 'graphql';
  const method = request.method || 'POST';
  const statusCode = response.statusCode || 200;
  const isError = statusCode>= 400;
  const isGraphQL = endpoint.includes('graphql');

  try {
    // Track request for rate limiting and abuse detection
    RateLimiter.trackRequest({
      endpoint,
      method,
      timestamp: endTime,
      statusCode,
      responseTime
    });

    // Log slow responses
    if (responseTime> MAX_RESPONSE_TIME_WARNING) {

    }

    // Audit log errors
    if (isError) {
      const category = getEndpointCategory(endpoint);
      let operationName = '';
      let errorInfo = {};

      if (isGraphQL && request.body) {
        operationName = request.body.operationName || '';
      }

      if (response.errors) {
        errorInfo = {
          errors: response.errors
        };
      }

      await AuditLogger.logApi(
        operationName || method,
        endpoint,
        method,
        'failure',
        `API error: ${statusCode} - ${operationName || endpoint}`,
        {
          responseTime,
          ...errorInfo
        },
        statusCode.toString(),
        response.errorMessage || 'Unknown error'
      );
    }

    // Continue with the response
    return response;
  } catch (error) {

    return response;
  }
}

/**
 * Apply interceptors to an API client
 */
export function applyInterceptors(apiClient: any): void {
  if (!apiClient || !apiClient.middleware) {

    return;
  }

  try {
    // Add request interceptor
    apiClient.middleware.beforeRequest = async (request: any) => {
      return await requestInterceptor(request);
    };

    // Add response interceptor
    apiClient.middleware.afterResponse = async (response: any, request: any) => {
      return await responseInterceptor(responserequest);
    };

  } catch (error) {

  }
}