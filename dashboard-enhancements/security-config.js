/**
 * PROP.ie Production Security Configuration
 * Enterprise-grade security settings for production deployment
 */

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// Content Security Policy for production
const productionCSP = `
  default-src 'self';
  script-src 'self' 
    'unsafe-inline' 
    'unsafe-eval' 
    https://cdn.jsdelivr.net 
    https://www.google-analytics.com 
    https://www.googletagmanager.com
    https://*.amazonaws.com
    https://*.amplifyapp.com;
  style-src 'self' 
    'unsafe-inline' 
    https://fonts.googleapis.com;
  img-src 'self' 
    data: 
    blob: 
    https: 
    https://*.amazonaws.com
    https://*.amplifyapp.com;
  font-src 'self' 
    https://fonts.gstatic.com;
  connect-src 'self' 
    https://*.amazonaws.com 
    https://*.amplifyapp.com 
    https://*.execute-api.*.amazonaws.com 
    https://www.google-analytics.com
    wss://*.amazonaws.com;
  frame-src 'self' 
    https://*.amazonaws.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`.replace(/\s+/g, ' ').trim();

// Development CSP (more permissive)
const developmentCSP = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https:;
  font-src 'self' data:;
  connect-src 'self' ws: wss: https:;
  frame-src 'self';
  object-src 'none';
`.replace(/\s+/g, ' ').trim();

// Security headers configuration
const securityHeaders = [
  // HSTS (HTTP Strict Transport Security)
  {
    key: 'Strict-Transport-Security',
    value: isProduction 
      ? 'max-age=63072000; includeSubDomains; preload'
      : 'max-age=31536000; includeSubDomains'
  },
  
  // X-Frame-Options (Clickjacking protection)
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  
  // X-Content-Type-Options (MIME type sniffing protection)
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  
  // X-XSS-Protection (Legacy XSS protection)
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  
  // Referrer Policy
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  
  // Content Security Policy
  {
    key: 'Content-Security-Policy',
    value: isProduction ? productionCSP : developmentCSP
  },
  
  // Permissions Policy (formerly Feature Policy)
  {
    key: 'Permissions-Policy',
    value: [
      'camera=()',
      'microphone=()',
      'geolocation=(self)',
      'payment=(self)',
      'usb=()',
      'bluetooth=()',
      'magnetometer=()',
      'gyroscope=()',
      'accelerometer=()',
      'ambient-light-sensor=()',
    ].join(', ')
  },
  
  // X-DNS-Prefetch-Control
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  
  // Cross-Origin Embedder Policy
  {
    key: 'Cross-Origin-Embedder-Policy',
    value: 'credentialless'
  },
  
  // Cross-Origin Opener Policy
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin-allow-popups'
  },
  
  // Cross-Origin Resource Policy
  {
    key: 'Cross-Origin-Resource-Policy',
    value: 'cross-origin'
  },
];

// Rate limiting configuration
const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProduction ? 100 : 1000, // limit each IP to 100 requests per windowMs in production
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for certain paths
  skip: (req) => {
    const skipPaths = ['/api/health', '/api/status'];
    return skipPaths.some(path => req.url?.startsWith(path));
  }
};

// Authentication security settings
const authConfig = {
  // Session settings
  session: {
    strategy: 'jwt',
    maxAge: isProduction ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60, // 30 days in prod, 7 days in dev
    updateAge: 24 * 60 * 60, // 24 hours
  },
  
  // JWT settings
  jwt: {
    maxAge: isProduction ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60,
    encryption: true,
  },
  
  // Cookie settings
  cookies: {
    sessionToken: {
      name: isProduction ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isProduction,
        domain: isProduction ? '.prop.ie' : undefined,
      }
    }
  },
  
  // Password requirements
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
  }
};

// Database security settings
const databaseConfig = {
  // Connection pool settings
  pool: {
    min: 2,
    max: isProduction ? 20 : 10,
    acquire: 30000,
    idle: 10000,
    evict: 5000,
  },
  
  // Query timeout
  timeout: 30000,
  
  // SSL settings for production
  ssl: isProduction ? {
    require: true,
    rejectUnauthorized: true,
  } : false,
  
  // Connection encryption
  encrypt: isProduction,
};

// File upload security
const uploadConfig = {
  // Maximum file size (10MB)
  maxFileSize: 10 * 1024 * 1024,
  
  // Allowed file types
  allowedMimeTypes: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  
  // File name validation
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.doc', '.docx'],
  
  // Virus scanning (placeholder for production implementation)
  virusScanning: isProduction,
  
  // File quarantine settings
  quarantine: {
    enabled: isProduction,
    duration: 24 * 60 * 60 * 1000, // 24 hours
  }
};

// Audit logging configuration
const auditConfig = {
  enabled: true,
  level: isProduction ? 'warn' : 'debug',
  
  // Events to log
  events: [
    'USER_LOGIN',
    'USER_LOGOUT',
    'USER_REGISTER',
    'PASSWORD_CHANGE',
    'EMAIL_CHANGE',
    'PROFILE_UPDATE',
    'PROPERTY_VIEW',
    'PROPERTY_RESERVE',
    'PAYMENT_INITIATED',
    'PAYMENT_COMPLETED',
    'DOCUMENT_UPLOAD',
    'DOCUMENT_DOWNLOAD',
    'HTB_APPLICATION',
    'ADMIN_ACTION',
    'SECURITY_VIOLATION',
  ],
  
  // Retention period (days)
  retention: isProduction ? 2555 : 90, // 7 years for production (legal requirement)
  
  // PII handling
  excludePII: true,
  hashSensitiveData: true,
};

// CORS configuration
const corsConfig = {
  origin: isProduction 
    ? ['https://prop.ie', 'https://www.prop.ie', 'https://staging.prop.ie']
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-CSRF-Token',
    'X-API-Key',
  ],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400, // 24 hours
};

// Error handling configuration
const errorConfig = {
  // Hide error details in production
  hideDetails: isProduction,
  
  // Error logging
  logErrors: true,
  logLevel: isProduction ? 'error' : 'debug',
  
  // Sentry integration
  sentry: {
    enabled: isProduction && !!process.env.SENTRY_DSN,
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: isProduction ? 0.1 : 1.0,
  }
};

// Monitoring and alerting
const monitoringConfig = {
  // Health check endpoints
  healthCheck: {
    enabled: true,
    endpoint: '/api/health',
    checks: ['database', 'redis', 'external-apis'],
  },
  
  // Performance monitoring
  performance: {
    enabled: isProduction,
    thresholds: {
      responseTime: 2000, // 2 seconds
      errorRate: 0.01, // 1%
      availability: 0.999, // 99.9%
    }
  },
  
  // Alert thresholds
  alerts: {
    errorRate: 0.05, // 5%
    responseTime: 5000, // 5 seconds
    diskSpace: 0.9, // 90%
    memory: 0.9, // 90%
  }
};

module.exports = {
  securityHeaders,
  rateLimitConfig,
  authConfig,
  databaseConfig,
  uploadConfig,
  auditConfig,
  corsConfig,
  errorConfig,
  monitoringConfig,
  isProduction,
  isDevelopment,
};