/**
 * Environment Validation for PROP.ie Production Deployment
 * 
 * Ensures all required environment variables are set for production deployment.
 * Prevents deployment with mock/temporary credentials.
 */

interface EnvironmentConfig {
  NODE_ENV: string;
  NEXT_PUBLIC_API_URL: string;
  NEXT_PUBLIC_APP_URL: string;
  DATABASE_URL: string;
  NEXT_PUBLIC_COGNITO_USER_POOL_ID: string;
  NEXT_PUBLIC_COGNITO_CLIENT_ID: string;
  NEXT_PUBLIC_COGNITO_REGION: string;
  NEXTAUTH_SECRET: string;
  JWT_SECRET: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  environment: 'development' | 'staging' | 'production';
}

export class EnvironmentValidator {
  private static instance: EnvironmentValidator;
  private config: Partial<EnvironmentConfig>;

  constructor() {
    this.config = {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      DATABASE_URL: process.env.DATABASE_URL,
      NEXT_PUBLIC_COGNITO_USER_POOL_ID: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
      NEXT_PUBLIC_COGNITO_CLIENT_ID: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
      NEXT_PUBLIC_COGNITO_REGION: process.env.NEXT_PUBLIC_COGNITO_REGION,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      JWT_SECRET: process.env.JWT_SECRET,
    };
  }

  static getInstance(): EnvironmentValidator {
    if (!EnvironmentValidator.instance) {
      EnvironmentValidator.instance = new EnvironmentValidator();
    }
    return EnvironmentValidator.instance;
  }

  /**
   * Validate environment configuration for Irish property business
   */
  validate(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const environment = this.detectEnvironment();

    // Critical validations for production
    if (environment === 'production') {
      errors.push(...this.validateProductionCritical());
    }

    // Cognito validation
    errors.push(...this.validateCognito());

    // Database validation
    errors.push(...this.validateDatabase());

    // Security validation
    errors.push(...this.validateSecurity());

    // Irish compliance warnings
    warnings.push(...this.validateIrishCompliance());

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      environment,
    };
  }

  /**
   * Validate critical production requirements
   */
  private validateProductionCritical(): string[] {
    const errors: string[] = [];

    // Mock authentication check
    if (this.config.NEXT_PUBLIC_COGNITO_USER_POOL_ID?.includes('TEMPORARY')) {
      errors.push('🚨 PRODUCTION BLOCKER: Temporary Cognito credentials detected. Set real AWS Cognito User Pool ID.');
    }

    if (this.config.NEXT_PUBLIC_COGNITO_CLIENT_ID?.includes('TEMPORARY')) {
      errors.push('🚨 PRODUCTION BLOCKER: Temporary Cognito Client ID detected. Set real AWS Cognito Client ID.');
    }

    // Security secrets
    if (this.config.NEXTAUTH_SECRET?.includes('change-this') || this.config.NEXTAUTH_SECRET?.includes('1234567890')) {
      errors.push('🚨 SECURITY RISK: Default NEXTAUTH_SECRET detected. Generate secure random string.');
    }

    if (this.config.JWT_SECRET?.includes('change-this') || this.config.JWT_SECRET?.includes('0987654321')) {
      errors.push('🚨 SECURITY RISK: Default JWT_SECRET detected. Generate secure random string.');
    }

    // URL validation
    if (this.config.NEXT_PUBLIC_APP_URL?.includes('localhost')) {
      errors.push('🚨 PRODUCTION BLOCKER: localhost URL detected in production. Set real domain.');
    }

    return errors;
  }

  /**
   * Validate AWS Cognito configuration
   */
  private validateCognito(): string[] {
    const errors: string[] = [];

    if (!this.config.NEXT_PUBLIC_COGNITO_USER_POOL_ID) {
      errors.push('❌ Missing NEXT_PUBLIC_COGNITO_USER_POOL_ID');
    }

    if (!this.config.NEXT_PUBLIC_COGNITO_CLIENT_ID) {
      errors.push('❌ Missing NEXT_PUBLIC_COGNITO_CLIENT_ID');
    }

    if (!this.config.NEXT_PUBLIC_COGNITO_REGION) {
      errors.push('❌ Missing NEXT_PUBLIC_COGNITO_REGION');
    } else if (this.config.NEXT_PUBLIC_COGNITO_REGION !== 'eu-west-1') {
      errors.push('🇮🇪 WARNING: Cognito region is not eu-west-1 (Ireland). Consider using Irish region for compliance.');
    }

    // Validate Cognito format
    if (this.config.NEXT_PUBLIC_COGNITO_USER_POOL_ID && 
        !this.config.NEXT_PUBLIC_COGNITO_USER_POOL_ID.match(/^[a-z0-9-]+_[A-Za-z0-9]+$/)) {
      errors.push('❌ Invalid Cognito User Pool ID format');
    }

    return errors;
  }

  /**
   * Validate database configuration
   */
  private validateDatabase(): string[] {
    const errors: string[] = [];

    if (!this.config.DATABASE_URL) {
      errors.push('❌ Missing DATABASE_URL');
      return errors;
    }

    // Check for PostgreSQL (required for production)
    if (!this.config.DATABASE_URL.startsWith('postgresql://') && 
        !this.config.DATABASE_URL.startsWith('postgres://')) {
      errors.push('⚠️ Database is not PostgreSQL. Production requires PostgreSQL for enterprise features.');
    }

    // Check for localhost in production
    if (this.detectEnvironment() === 'production' && this.config.DATABASE_URL.includes('localhost')) {
      errors.push('🚨 PRODUCTION BLOCKER: localhost database detected in production. Use cloud database.');
    }

    return errors;
  }

  /**
   * Validate security configuration
   */
  private validateSecurity(): string[] {
    const errors: string[] = [];

    if (!this.config.NEXTAUTH_SECRET) {
      errors.push('❌ Missing NEXTAUTH_SECRET');
    } else if (this.config.NEXTAUTH_SECRET.length < 32) {
      errors.push('🔒 NEXTAUTH_SECRET should be at least 32 characters long');
    }

    if (!this.config.JWT_SECRET) {
      errors.push('❌ Missing JWT_SECRET');
    } else if (this.config.JWT_SECRET.length < 32) {
      errors.push('🔒 JWT_SECRET should be at least 32 characters long');
    }

    return errors;
  }

  /**
   * Validate Irish property business compliance
   */
  private validateIrishCompliance(): string[] {
    const warnings: string[] = [];

    // Irish domain check
    if (this.config.NEXT_PUBLIC_APP_URL && 
        !this.config.NEXT_PUBLIC_APP_URL.includes('.ie') && 
        this.detectEnvironment() === 'production') {
      warnings.push('🇮🇪 Consider using .ie domain for Irish property business credibility');
    }

    // EU region check
    if (this.config.NEXT_PUBLIC_COGNITO_REGION && 
        !this.config.NEXT_PUBLIC_COGNITO_REGION.startsWith('eu-')) {
      warnings.push('🇪🇺 Consider using EU region for GDPR compliance');
    }

    return warnings;
  }

  /**
   * Detect current environment
   */
  private detectEnvironment(): 'development' | 'staging' | 'production' {
    if (this.config.NODE_ENV === 'production') return 'production';
    if (this.config.NODE_ENV === 'staging' || process.env.NEXT_PUBLIC_APP_ENV === 'staging') return 'staging';
    return 'development';
  }

  /**
   * Generate secure random secrets
   */
  static generateSecureSecret(length: number = 64): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Get validation status for display
   */
  getStatus(): 'ready' | 'warning' | 'blocked' {
    const validation = this.validate();
    if (!validation.isValid) return 'blocked';
    if (validation.warnings.length > 0) return 'warning';
    return 'ready';
  }

  /**
   * Print validation report to console
   */
  printReport(): void {
    const validation = this.validate();
    
    console.log('\n🔍 PROP.ie Environment Validation Report');
    console.log('=====================================');
    console.log(`Environment: ${validation.environment.toUpperCase()}`);
    console.log(`Status: ${this.getStatus().toUpperCase()}`);
    
    if (validation.errors.length > 0) {
      console.log('\n❌ ERRORS (Must be fixed):');
      validation.errors.forEach(error => console.log(`  ${error}`));
    }
    
    if (validation.warnings.length > 0) {
      console.log('\n⚠️ WARNINGS (Recommended):');
      validation.warnings.forEach(warning => console.log(`  ${warning}`));
    }
    
    if (validation.isValid) {
      console.log('\n✅ Environment validation passed!');
    } else {
      console.log('\n🚨 Environment validation failed! Fix errors before deploying.');
    }
    
    console.log('=====================================\n');
  }
}

// Export singleton instance
export const environmentValidator = EnvironmentValidator.getInstance();

// Validate on import for early detection
if (typeof window === 'undefined') {
  // Only run on server-side to avoid client-side logs
  const validator = EnvironmentValidator.getInstance();
  const status = validator.getStatus();
  
  if (status === 'blocked' && process.env.NODE_ENV === 'production') {
    validator.printReport();
    throw new Error('🚨 Production deployment blocked due to environment validation errors');
  }
}