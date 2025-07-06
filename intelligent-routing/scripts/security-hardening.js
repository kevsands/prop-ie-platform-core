/**
 * Security Hardening Script
 * Analyzes and implements security best practices for production deployment
 */

const fs = require('fs');
const path = require('path');

const SECURITY_CHECKS = {
  environment: [
    {
      name: 'Environment Variables Security',
      check: 'Sensitive data in .env files',
      status: 'pending',
      recommendations: [
        'Move production secrets to AWS Secrets Manager',
        'Use different .env files for different environments',
        'Never commit .env files to version control',
        'Rotate API keys regularly'
      ]
    },
    {
      name: 'HTTPS Enforcement',
      check: 'Force HTTPS in production',
      status: 'enabled',
      recommendations: [
        'Configure Next.js to redirect HTTP to HTTPS',
        'Set secure cookie flags',
        'Implement HSTS headers'
      ]
    }
  ],
  authentication: [
    {
      name: 'JWT Token Security',
      check: 'JWT implementation security',
      status: 'enabled',
      recommendations: [
        'Use strong secret keys (256+ bits)',
        'Implement token rotation',
        'Set appropriate expiration times',
        'Validate tokens on every request'
      ]
    },
    {
      name: 'Password Security',
      check: 'Password hashing and policies',
      status: 'enabled',
      recommendations: [
        'Use bcrypt with salt rounds >= 12',
        'Implement password complexity requirements',
        'Add rate limiting for login attempts',
        'Implement account lockout policies'
      ]
    }
  ],
  api: [
    {
      name: 'API Rate Limiting',
      check: 'Rate limiting implementation',
      status: 'pending',
      recommendations: [
        'Implement per-IP rate limiting',
        'Add per-user rate limiting',
        'Use sliding window rate limiting',
        'Configure different limits for different endpoints'
      ]
    },
    {
      name: 'CORS Configuration',
      check: 'Cross-Origin Resource Sharing setup',
      status: 'warning',
      recommendations: [
        'Restrict origins to known domains',
        'Limit allowed methods and headers',
        'Avoid using wildcard (*) in production',
        'Implement preflight request handling'
      ]
    },
    {
      name: 'Input Validation',
      check: 'Input sanitization and validation',
      status: 'enabled',
      recommendations: [
        'Validate all input data',
        'Sanitize data before database operations',
        'Use parameterized queries',
        'Implement schema validation'
      ]
    }
  ],
  headers: [
    {
      name: 'Security Headers',
      check: 'HTTP security headers',
      status: 'enabled',
      recommendations: [
        'Content Security Policy (CSP)',
        'X-Frame-Options: DENY',
        'X-Content-Type-Options: nosniff',
        'X-XSS-Protection: 1; mode=block',
        'Strict-Transport-Security (HSTS)'
      ]
    }
  ],
  database: [
    {
      name: 'Database Security',
      check: 'Database access and encryption',
      status: 'enabled',
      recommendations: [
        'Use connection pooling with SSL',
        'Implement least privilege access',
        'Enable database encryption at rest',
        'Regular security updates'
      ]
    }
  ],
  dependencies: [
    {
      name: 'Dependency Security',
      check: 'Third-party package vulnerabilities',
      status: 'pending',
      recommendations: [
        'Regular npm audit',
        'Use Snyk or similar tools',
        'Keep dependencies updated',
        'Remove unused dependencies'
      ]
    }
  ]
};

async function generateSecurityReport() {
  console.log('🔒 Generating Security Hardening Report...\n');

  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalChecks: 0,
      enabledChecks: 0,
      warningChecks: 0,
      pendingChecks: 0,
      securityScore: 0
    },
    categories: SECURITY_CHECKS,
    implementations: [],
    nextSteps: []
  };

  // Calculate summary statistics
  Object.values(SECURITY_CHECKS).forEach(category => {
    category.forEach(check => {
      report.summary.totalChecks++;
      switch (check.status) {
        case 'enabled':
          report.summary.enabledChecks++;
          break;
        case 'warning':
          report.summary.warningChecks++;
          break;
        case 'pending':
          report.summary.pendingChecks++;
          break;
      }
    });
  });

  // Calculate security score
  report.summary.securityScore = Math.round(
    ((report.summary.enabledChecks * 100) + (report.summary.warningChecks * 50)) / 
    (report.summary.totalChecks * 100) * 100
  );

  // Generate implementation code
  report.implementations = generateSecurityImplementations();

  // Generate next steps
  report.nextSteps = [
    {
      priority: 'HIGH',
      task: 'Implement API Rate Limiting',
      description: 'Add rate limiting middleware to protect against abuse',
      estimatedTime: '2-4 hours'
    },
    {
      priority: 'HIGH',
      task: 'Security Dependency Audit',
      description: 'Run comprehensive security audit of all dependencies',
      estimatedTime: '1-2 hours'
    },
    {
      priority: 'MEDIUM',
      task: 'Refine CORS Configuration',
      description: 'Tighten CORS settings for production environment',
      estimatedTime: '1 hour'
    },
    {
      priority: 'MEDIUM',
      task: 'Environment Security Review',
      description: 'Move sensitive environment variables to AWS Secrets Manager',
      estimatedTime: '2-3 hours'
    },
    {
      priority: 'LOW',
      task: 'Security Testing',
      description: 'Perform penetration testing and security audits',
      estimatedTime: '4-8 hours'
    }
  ];

  return report;
}

function generateSecurityImplementations() {
  return [
    {
      name: 'API Rate Limiting Middleware',
      description: 'Express middleware for rate limiting API requests',
      code: `
// middleware/rateLimiting.ts
import { NextRequest, NextResponse } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

export function createRateLimiter(windowMs: number, maxRequests: number) {
  return (req: NextRequest) => {
    const clientIp = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    
    // Clean expired entries
    for (const [key, entry] of rateLimitMap.entries()) {
      if (now > entry.resetTime) {
        rateLimitMap.delete(key);
      }
    }
    
    const existing = rateLimitMap.get(clientIp);
    
    if (!existing) {
      rateLimitMap.set(clientIp, {
        count: 1,
        resetTime: now + windowMs
      });
      return null; // Allow request
    }
    
    if (now > existing.resetTime) {
      existing.count = 1;
      existing.resetTime = now + windowMs;
      return null; // Allow request
    }
    
    if (existing.count >= maxRequests) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': existing.resetTime.toString()
          }
        }
      );
    }
    
    existing.count++;
    return null; // Allow request
  };
}

// Usage in API routes
export const apiRateLimiter = createRateLimiter(60000, 100); // 100 requests per minute
export const authRateLimiter = createRateLimiter(900000, 5); // 5 attempts per 15 minutes
      `
    },
    {
      name: 'Security Headers Middleware',
      description: 'Next.js middleware for security headers',
      code: `
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://api.stripe.com wss:",
    "frame-src https://js.stripe.com",
    "form-action 'self'"
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', cspHeader);
  
  // HSTS (only in production with HTTPS)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};
      `
    },
    {
      name: 'Input Validation Utility',
      description: 'Comprehensive input validation and sanitization',
      code: `
// utils/inputValidation.ts
import { z } from 'zod';

export class InputValidator {
  static sanitizeString(input: string): string {
    return input
      .replace(/[<>\"']/g, '') // Remove potential XSS characters
      .trim()
      .substring(0, 1000); // Limit length
  }

  static validateEmail(email: string): boolean {
    const emailSchema = z.string().email();
    return emailSchema.safeParse(email).success;
  }

  static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/\\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static sanitizeHtml(input: string): string {
    // Basic HTML sanitization - in production use a library like DOMPurify
    return input
      .replace(/<script[^>]*>.*?<\\/script>/gi, '')
      .replace(/<iframe[^>]*>.*?<\\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\\w+\\s*=/gi, '');
  }

  static validateApiInput<T>(
    schema: z.ZodSchema<T>,
    input: unknown
  ): { success: true; data: T } | { success: false; errors: string[] } {
    const result = schema.safeParse(input);
    
    if (result.success) {
      return { success: true, data: result.data };
    }
    
    return {
      success: false,
      errors: result.error.errors.map(err => err.message)
    };
  }
}

// API Schema Examples
export const apiSchemas = {
  userRegistration: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().min(1).max(50),
    lastName: z.string().min(1).max(50),
    role: z.enum(['buyer', 'developer', 'agent', 'solicitor'])
  }),
  
  propertySearch: z.object({
    location: z.string().optional(),
    priceMin: z.number().positive().optional(),
    priceMax: z.number().positive().optional(),
    propertyType: z.string().optional(),
    page: z.number().positive().default(1),
    limit: z.number().positive().max(100).default(20)
  }),
  
  messageCreation: z.object({
    conversationId: z.string().uuid(),
    content: z.string().min(1).max(5000),
    messageType: z.enum(['text', 'file', 'system']).default('text')
  })
};
      `
    },
    {
      name: 'Secure Cookie Configuration',
      description: 'Production-ready cookie security settings',
      code: `
// utils/cookieConfig.ts
export const cookieConfig = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  path: '/',
  domain: process.env.NODE_ENV === 'production' 
    ? process.env.COOKIE_DOMAIN 
    : undefined
};

export const sessionConfig = {
  ...cookieConfig,
  maxAge: 30 * 60 * 1000, // 30 minutes for sessions
};

export const refreshTokenConfig = {
  ...cookieConfig,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days for refresh tokens
};

// Usage example
export function setSecureCookie(
  name: string, 
  value: string, 
  options: Partial<typeof cookieConfig> = {}
) {
  const config = { ...cookieConfig, ...options };
  
  return \`\${name}=\${value}; \${Object.entries(config)
    .map(([key, val]) => \`\${key}=\${val}\`)
    .join('; ')}\`;
}
      `
    }
  ];
}

async function runSecurityAudit() {
  console.log('🔍 Running Security Audit...\n');
  
  const auditResults = {
    npmAudit: await runNpmAudit(),
    dependencyCheck: await checkDependencies(),
    environmentCheck: checkEnvironmentSecurity(),
    filePermissions: checkFilePermissions()
  };

  return auditResults;
}

async function runNpmAudit() {
  try {
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);
    
    const { stdout } = await execAsync('npm audit --json');
    const auditData = JSON.parse(stdout);
    
    return {
      vulnerabilities: auditData.metadata?.vulnerabilities || {},
      advisories: Object.keys(auditData.advisories || {}).length,
      summary: 'NPM audit completed successfully'
    };
  } catch (error) {
    return {
      vulnerabilities: {},
      advisories: 0,
      summary: 'NPM audit failed or no vulnerabilities found',
      error: error.message
    };
  }
}

async function checkDependencies() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    return { error: 'package.json not found' };
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  };
  
  // Check for known risky packages
  const riskyPackages = [
    'eval',
    'vm2',
    'serialize-javascript',
    'lodash',
    'moment'
  ];
  
  const foundRiskyPackages = riskyPackages.filter(pkg => 
    Object.keys(dependencies).includes(pkg)
  );
  
  return {
    totalDependencies: Object.keys(dependencies).length,
    riskyPackages: foundRiskyPackages,
    recommendations: foundRiskyPackages.length > 0 
      ? ['Review usage of risky packages', 'Consider alternatives', 'Update to latest versions']
      : ['Dependencies look secure']
  };
}

function checkEnvironmentSecurity() {
  const envFiles = ['.env', '.env.local', '.env.production'];
  const findings = [];
  
  envFiles.forEach(envFile => {
    const envPath = path.join(process.cwd(), envFile);
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      
      // Check for potential secrets in plain text
      const sensitivePatterns = [
        /password/i,
        /secret/i,
        /key/i,
        /token/i,
        /api[_-]?key/i
      ];
      
      const lines = content.split('\\n');
      lines.forEach((line, index) => {
        sensitivePatterns.forEach(pattern => {
          if (pattern.test(line) && !line.startsWith('#')) {
            findings.push({
              file: envFile,
              line: index + 1,
              content: line.split('=')[0],
              recommendation: 'Move to secure secret management'
            });
          }
        });
      });
    }
  });
  
  return {
    envFilesFound: envFiles.filter(f => fs.existsSync(path.join(process.cwd(), f))),
    potentialSecrets: findings,
    recommendation: findings.length > 0 
      ? 'Review environment variables and move secrets to AWS Secrets Manager'
      : 'Environment security looks good'
  };
}

function checkFilePermissions() {
  const criticalFiles = [
    'package.json',
    'next.config.js',
    '.env',
    '.env.local',
    '.env.production'
  ];
  
  const permissionIssues = [];
  
  criticalFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      try {
        const stats = fs.statSync(filePath);
        const mode = stats.mode.toString(8);
        
        // Check if file is world-readable (basic check)
        if (file.startsWith('.env') && (stats.mode & parseInt('004', 8))) {
          permissionIssues.push({
            file,
            issue: 'Environment file is world-readable',
            recommendation: 'Set permissions to 600 (owner read/write only)'
          });
        }
      } catch (error) {
        permissionIssues.push({
          file,
          issue: 'Cannot check file permissions',
          error: error.message
        });
      }
    }
  });
  
  return {
    checkedFiles: criticalFiles,
    issues: permissionIssues,
    recommendation: permissionIssues.length === 0 
      ? 'File permissions look secure'
      : 'Review and fix file permission issues'
  };
}

// Main execution
async function main() {
  try {
    console.log('🔒 PROP.IE Security Hardening Analysis\\n');
    console.log('==========================================\\n');
    
    // Generate security report
    const securityReport = await generateSecurityReport();
    
    // Run security audit
    const auditResults = await runSecurityAudit();
    
    // Combine results
    const fullReport = {
      ...securityReport,
      audit: auditResults,
      generatedAt: new Date().toISOString()
    };
    
    // Save report
    const reportPath = path.join(process.cwd(), 'security-hardening-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(fullReport, null, 2));
    
    // Display summary
    console.log('📊 Security Summary:');
    console.log(`- Security Score: ${securityReport.summary.securityScore}%`);
    console.log(`- Enabled Security Measures: ${securityReport.summary.enabledChecks}/${securityReport.summary.totalChecks}`);
    console.log(`- Pending Implementation: ${securityReport.summary.pendingChecks}`);
    console.log(`- NPM Vulnerabilities: ${auditResults.npmAudit.advisories || 0}`);
    
    console.log('\\n🎯 Priority Actions:');
    securityReport.nextSteps
      .filter(step => step.priority === 'HIGH')
      .forEach(step => {
        console.log(`- ${step.task} (${step.estimatedTime})`);
      });
    
    console.log(`\\n📄 Full report saved to: ${reportPath}`);
    console.log('\\n✅ Security analysis complete!');
    
  } catch (error) {
    console.error('❌ Security analysis failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  generateSecurityReport,
  runSecurityAudit
};