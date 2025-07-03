/**
 * Enterprise Multi-Tenant Architecture Manager
 * Manages isolation, security, and resource allocation across developers/projects
 * Supports enterprise-scale operations with 100+ developers and 1000+ projects
 */

import { z } from 'zod';
import { enterpriseAuditLogger } from '@/lib/security/enterpriseAuditLogger';

// Tenant types in the PROP.ie ecosystem
export const TenantType = z.enum([
  'developer', // Property developers (primary tenants)
  'agent', // Estate agents (sub-tenants)
  'solicitor', // Legal professionals
  'surveyor', // Building surveyors
  'broker', // Mortgage brokers
  'administrator', // PROP.ie admins
  'system' // System-level operations
]);

// Subscription tiers for different tenant capabilities
export const SubscriptionTier = z.enum([
  'starter', // Small developers (1-5 projects)
  'professional', // Medium developers (6-20 projects)
  'enterprise', // Large developers (21+ projects)
  'premium', // Enterprise+ with custom features
  'platform_partner' // Strategic partners with full access
]);

// Resource limits and quotas
export const ResourceQuota = z.object({
  maxProjects: z.number(),
  maxUnitsPerProject: z.number(),
  maxPropChoicePackages: z.number(),
  maxAPICallsPerMonth: z.number(),
  maxStorageGB: z.number(),
  maxUsers: z.number(),
  maxCustomDomains: z.number(),
  analyticsRetentionDays: z.number(),
  customBrandingEnabled: z.boolean(),
  whitelabelEnabled: z.boolean(),
  customIntegrationsAllowed: z.number()
});

// Tenant configuration schema
export const TenantSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  displayName: z.string().min(1).max(100),
  type: TenantType,
  subscriptionTier: SubscriptionTier,
  
  // Contact and billing information
  contact: z.object({
    primaryEmail: z.string().email(),
    primaryPhone: z.string(),
    billingEmail: z.string().email(),
    supportEmail: z.string().email(),
    address: z.object({
      street: z.string(),
      city: z.string(),
      county: z.string(),
      country: z.string().default('Ireland'),
      eircode: z.string(),
      vatNumber: z.string().optional()
    })
  }),
  
  // Technical configuration
  technical: z.object({
    customDomain: z.string().optional(),
    subdomain: z.string().regex(/^[a-z0-9-]+$/),
    apiKeys: z.array(z.object({
      keyId: z.string(),
      name: z.string(),
      permissions: z.array(z.string()),
      environment: z.enum(['development', 'staging', 'production']),
      expiresAt: z.string().datetime().optional()
    })),
    webhookEndpoints: z.array(z.object({
      url: z.string().url(),
      events: z.array(z.string()),
      secret: z.string(),
      active: z.boolean()
    })),
    ipWhitelist: z.array(z.string().ip()).optional(),
    customSSLCert: z.string().optional()
  }),
  
  // Resource quotas and limits
  quotas: ResourceQuota,
  
  // Current usage tracking
  usage: z.object({
    currentProjects: z.number(),
    currentUnits: z.number(),
    currentPropChoicePackages: z.number(),
    apiCallsThisMonth: z.number(),
    storageUsedGB: z.number(),
    activeUsers: z.number(),
    lastActivityAt: z.string().datetime()
  }),
  
  // Security and compliance
  security: z.object({
    mfaRequired: z.boolean(),
    passwordPolicy: z.object({
      minLength: z.number(),
      requireUppercase: z.boolean(),
      requireNumbers: z.boolean(),
      requireSymbols: z.boolean(),
      maxAge: z.number()
    }),
    sessionTimeout: z.number(),
    auditLogRetention: z.number(),
    dataResidency: z.enum(['ireland', 'eu', 'global']),
    encryptionAtRest: z.boolean(),
    encryptionInTransit: z.boolean()
  }),
  
  // Branding and customization
  branding: z.object({
    logoUrl: z.string().url().optional(),
    primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    customCss: z.string().optional(),
    faviconUrl: z.string().url().optional(),
    emailTemplates: z.record(z.string(), z.string()).optional()
  }),
  
  // Feature flags and permissions
  features: z.object({
    propChoiceEnabled: z.boolean(),
    constructionMonitoringEnabled: z.boolean(),
    professionalServicesEnabled: z.boolean(),
    whitelabelEnabled: z.boolean(),
    apiAccessEnabled: z.boolean(),
    analyticsEnabled: z.boolean(),
    customReportsEnabled: z.boolean(),
    multiLanguageEnabled: z.boolean(),
    advancedSecurityEnabled: z.boolean()
  }),
  
  // Billing and subscription
  billing: z.object({
    subscriptionId: z.string(),
    billingCycle: z.enum(['monthly', 'annual']),
    nextBillingDate: z.string().datetime(),
    currency: z.string().default('EUR'),
    taxRate: z.number(),
    paymentMethod: z.enum(['card', 'bank_transfer', 'invoice']),
    credits: z.number().default(0),
    suspended: z.boolean().default(false),
    suspensionReason: z.string().optional()
  }),
  
  // Metadata
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdBy: z.string(),
  status: z.enum(['active', 'suspended', 'terminated', 'pending_activation']),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional()
});

export type Tenant = z.infer<typeof TenantSchema>;

// Multi-tenant context for request processing
export interface TenantContext {
  tenantId: string;
  tenant: Tenant;
  userId: string;
  userRoles: string[];
  permissions: string[];
  quotaEnforcement: boolean;
  rateLimitConfig: {
    requests: number;
    window: number; // seconds
    burstLimit: number;
  };
}

export class MultiTenantManager {
  private static instance: MultiTenantManager;
  private tenantCache = new Map<string, Tenant>();
  private quotaCache = new Map<string, any>();
  private usageTracker = new Map<string, any>();

  private constructor() {
    this.initializeDefaultTenants();
  }

  public static getInstance(): MultiTenantManager {
    if (!MultiTenantManager.instance) {
      MultiTenantManager.instance = new MultiTenantManager();
    }
    return MultiTenantManager.instance;
  }

  /**
   * Create a new tenant with full enterprise setup
   */
  public async createTenant(tenantData: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt' | 'usage'>): Promise<Tenant> {
    const tenantId = this.generateTenantId();
    
    // Set up default quotas based on subscription tier
    const quotas = this.getDefaultQuotas(tenantData.subscriptionTier);
    
    const tenant: Tenant = {
      ...tenantData,
      id: tenantId,
      quotas,
      usage: {
        currentProjects: 0,
        currentUnits: 0,
        currentPropChoicePackages: 0,
        apiCallsThisMonth: 0,
        storageUsedGB: 0,
        activeUsers: 0,
        lastActivityAt: new Date().toISOString()
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'pending_activation'
    };

    // Validate tenant data
    const validatedTenant = TenantSchema.parse(tenant);

    // Store in tenant cache
    this.tenantCache.set(tenantId, validatedTenant);

    // Initialize tenant infrastructure
    await this.initializeTenantInfrastructure(validatedTenant);

    // Log tenant creation
    await enterpriseAuditLogger.logEvent({
      eventType: 'system_alert_triggered',
      riskLevel: 'medium',
      category: 'tenant_management',
      actor: {
        id: tenantData.createdBy,
        type: 'user'
      },
      target: {
        id: tenantId,
        type: 'tenant',
        name: tenantData.name
      },
      event: {
        action: 'create_tenant',
        description: `New tenant created: ${tenantData.name}`,
        outcome: 'success',
        metadata: {
          tenantType: tenantData.type,
          subscriptionTier: tenantData.subscriptionTier,
          tenantId
        }
      },
      compliance: {
        frameworks: ['gdpr', 'iso_27001'],
        retentionPeriod: 2555,
        sensitiveData: true,
        auditRequired: true
      }
    });

    return validatedTenant;
  }

  /**
   * Get tenant by ID with caching
   */
  public async getTenant(tenantId: string): Promise<Tenant | null> {
    // Check cache first
    if (this.tenantCache.has(tenantId)) {
      return this.tenantCache.get(tenantId)!;
    }

    // In production, this would query the database
    const tenant = await this.loadTenantFromDatabase(tenantId);
    
    if (tenant) {
      this.tenantCache.set(tenantId, tenant);
    }

    return tenant;
  }

  /**
   * Extract tenant context from request
   */
  public async extractTenantContext(
    request: any, // NextRequest in production
    userId: string
  ): Promise<TenantContext | null> {
    let tenantId: string | null = null;

    // Extract tenant ID from various sources
    if (request.headers) {
      // From custom header
      tenantId = request.headers.get('x-tenant-id');
      
      // From subdomain
      if (!tenantId && request.headers.get('host')) {
        const host = request.headers.get('host');
        const subdomain = host?.split('.')[0];
        if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
          tenantId = await this.getTenantIdBySubdomain(subdomain);
        }
      }
    }

    // From API key
    if (!tenantId && request.headers?.get('authorization')) {
      const apiKey = request.headers.get('authorization')?.replace('Bearer ', '');
      if (apiKey) {
        tenantId = await this.getTenantIdByApiKey(apiKey);
      }
    }

    // From user association
    if (!tenantId && userId) {
      tenantId = await this.getTenantIdByUserId(userId);
    }

    if (!tenantId) {
      return null;
    }

    const tenant = await this.getTenant(tenantId);
    if (!tenant || tenant.status !== 'active') {
      return null;
    }

    // Get user roles and permissions for this tenant
    const userRoles = await this.getUserRolesForTenant(userId, tenantId);
    const permissions = await this.getPermissionsForRoles(userRoles, tenantId);

    return {
      tenantId,
      tenant,
      userId,
      userRoles,
      permissions,
      quotaEnforcement: true,
      rateLimitConfig: this.getRateLimitConfig(tenant.subscriptionTier)
    };
  }

  /**
   * Check if tenant can perform an action based on quotas
   */
  public async checkQuota(
    tenantId: string,
    resourceType: keyof Tenant['quotas'],
    requestedAmount: number = 1
  ): Promise<{ allowed: boolean; remaining: number; message?: string }> {
    const tenant = await this.getTenant(tenantId);
    if (!tenant) {
      return { allowed: false, remaining: 0, message: 'Tenant not found' };
    }

    const quota = tenant.quotas[resourceType];
    const currentUsage = this.getCurrentUsage(tenant, resourceType);
    const remaining = quota - currentUsage;

    if (remaining >= requestedAmount) {
      return { allowed: true, remaining: remaining - requestedAmount };
    } else {
      await this.logQuotaExceeded(tenantId, resourceType, quota, currentUsage, requestedAmount);
      return {
        allowed: false,
        remaining,
        message: `Quota exceeded for ${resourceType}. Current: ${currentUsage}, Limit: ${quota}, Requested: ${requestedAmount}`
      };
    }
  }

  /**
   * Update tenant usage tracking
   */
  public async updateUsage(
    tenantId: string,
    resourceType: keyof Tenant['usage'],
    delta: number
  ): Promise<void> {
    const tenant = await this.getTenant(tenantId);
    if (!tenant) return;

    // Update usage
    const currentValue = tenant.usage[resourceType] as number;
    const newValue = Math.max(0, currentValue + delta);
    
    // Update in cache
    tenant.usage[resourceType] = newValue as any;
    tenant.usage.lastActivityAt = new Date().toISOString();
    tenant.updatedAt = new Date().toISOString();

    this.tenantCache.set(tenantId, tenant);

    // In production, this would update the database
    await this.persistUsageUpdate(tenantId, resourceType, newValue);

    // Check for quota warnings
    if (this.shouldSendQuotaWarning(tenant, resourceType, newValue)) {
      await this.sendQuotaWarning(tenant, resourceType, newValue);
    }
  }

  /**
   * Get default quotas for subscription tier
   */
  private getDefaultQuotas(tier: z.infer<typeof SubscriptionTier>): z.infer<typeof ResourceQuota> {
    const quotaTemplates = {
      starter: {
        maxProjects: 5,
        maxUnitsPerProject: 50,
        maxPropChoicePackages: 20,
        maxAPICallsPerMonth: 10000,
        maxStorageGB: 5,
        maxUsers: 3,
        maxCustomDomains: 0,
        analyticsRetentionDays: 90,
        customBrandingEnabled: false,
        whitelabelEnabled: false,
        customIntegrationsAllowed: 1
      },
      professional: {
        maxProjects: 20,
        maxUnitsPerProject: 200,
        maxPropChoicePackages: 100,
        maxAPICallsPerMonth: 100000,
        maxStorageGB: 50,
        maxUsers: 10,
        maxCustomDomains: 1,
        analyticsRetentionDays: 365,
        customBrandingEnabled: true,
        whitelabelEnabled: false,
        customIntegrationsAllowed: 5
      },
      enterprise: {
        maxProjects: 100,
        maxUnitsPerProject: 1000,
        maxPropChoicePackages: 500,
        maxAPICallsPerMonth: 1000000,
        maxStorageGB: 500,
        maxUsers: 50,
        maxCustomDomains: 5,
        analyticsRetentionDays: 1095, // 3 years
        customBrandingEnabled: true,
        whitelabelEnabled: true,
        customIntegrationsAllowed: 20
      },
      premium: {
        maxProjects: 500,
        maxUnitsPerProject: 5000,
        maxPropChoicePackages: 2000,
        maxAPICallsPerMonth: 10000000,
        maxStorageGB: 2000,
        maxUsers: 200,
        maxCustomDomains: 20,
        analyticsRetentionDays: 2555, // 7 years
        customBrandingEnabled: true,
        whitelabelEnabled: true,
        customIntegrationsAllowed: 100
      },
      platform_partner: {
        maxProjects: -1, // Unlimited
        maxUnitsPerProject: -1,
        maxPropChoicePackages: -1,
        maxAPICallsPerMonth: -1,
        maxStorageGB: -1,
        maxUsers: -1,
        maxCustomDomains: -1,
        analyticsRetentionDays: 2555,
        customBrandingEnabled: true,
        whitelabelEnabled: true,
        customIntegrationsAllowed: -1
      }
    };

    return quotaTemplates[tier];
  }

  /**
   * Initialize tenant-specific infrastructure
   */
  private async initializeTenantInfrastructure(tenant: Tenant): Promise<void> {
    // In production, this would:
    // 1. Create tenant-specific database schemas
    // 2. Set up CDN and storage buckets
    // 3. Configure monitoring and alerting
    // 4. Create API keys and certificates
    // 5. Set up backup and disaster recovery
    // 6. Initialize audit logging
    // 7. Configure security policies

    console.log(`Initializing infrastructure for tenant: ${tenant.name}`);
    
    // Create default admin user
    await this.createDefaultAdminUser(tenant);
    
    // Set up monitoring
    await this.setupTenantMonitoring(tenant);
    
    // Configure security policies
    await this.configureTenantSecurity(tenant);
  }

  /**
   * Helper methods for tenant management
   */
  private async loadTenantFromDatabase(tenantId: string): Promise<Tenant | null> {
    // In production, this would query the tenant database
    // For demo, return mock data for known tenants
    if (tenantId === 'tenant_premium_developments') {
      return {
        id: tenantId,
        name: 'Premium Developments Ltd',
        displayName: 'Premium Developments',
        type: 'developer',
        subscriptionTier: 'enterprise',
        contact: {
          primaryEmail: 'admin@premiumdev.ie',
          primaryPhone: '+353 1 234 5678',
          billingEmail: 'billing@premiumdev.ie',
          supportEmail: 'support@premiumdev.ie',
          address: {
            street: '15 Stephen\'s Green',
            city: 'Dublin',
            county: 'Dublin',
            country: 'Ireland',
            eircode: 'D02 XY12',
            vatNumber: 'IE1234567AB'
          }
        },
        technical: {
          subdomain: 'premiumdev',
          apiKeys: [],
          webhookEndpoints: [],
          customDomain: 'properties.premiumdev.ie'
        },
        quotas: this.getDefaultQuotas('enterprise'),
        usage: {
          currentProjects: 15,
          currentUnits: 450,
          currentPropChoicePackages: 75,
          apiCallsThisMonth: 45000,
          storageUsedGB: 125,
          activeUsers: 25,
          lastActivityAt: new Date().toISOString()
        },
        security: {
          mfaRequired: true,
          passwordPolicy: {
            minLength: 12,
            requireUppercase: true,
            requireNumbers: true,
            requireSymbols: true,
            maxAge: 90
          },
          sessionTimeout: 480, // 8 hours
          auditLogRetention: 2555,
          dataResidency: 'ireland',
          encryptionAtRest: true,
          encryptionInTransit: true
        },
        branding: {
          logoUrl: 'https://cdn.premiumdev.ie/logo.png',
          primaryColor: '#1e40af',
          secondaryColor: '#f59e0b'
        },
        features: {
          propChoiceEnabled: true,
          constructionMonitoringEnabled: true,
          professionalServicesEnabled: true,
          whitelabelEnabled: true,
          apiAccessEnabled: true,
          analyticsEnabled: true,
          customReportsEnabled: true,
          multiLanguageEnabled: false,
          advancedSecurityEnabled: true
        },
        billing: {
          subscriptionId: 'sub_premium_ent_001',
          billingCycle: 'annual',
          nextBillingDate: '2026-03-15T00:00:00Z',
          currency: 'EUR',
          taxRate: 0.23,
          paymentMethod: 'invoice',
          credits: 0,
          suspended: false
        },
        createdAt: '2024-03-15T10:00:00Z',
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        status: 'active',
        tags: ['enterprise', 'developer', 'dublin']
      } as Tenant;
    }
    
    return null;
  }

  private getCurrentUsage(tenant: Tenant, resourceType: keyof Tenant['quotas']): number {
    const usageMap: Record<keyof Tenant['quotas'], keyof Tenant['usage']> = {
      maxProjects: 'currentProjects',
      maxUnitsPerProject: 'currentUnits',
      maxPropChoicePackages: 'currentPropChoicePackages',
      maxAPICallsPerMonth: 'apiCallsThisMonth',
      maxStorageGB: 'storageUsedGB',
      maxUsers: 'activeUsers',
      maxCustomDomains: 'activeUsers', // Placeholder
      analyticsRetentionDays: 'activeUsers', // Placeholder
      customBrandingEnabled: 'activeUsers', // Placeholder
      whitelabelEnabled: 'activeUsers', // Placeholder
      customIntegrationsAllowed: 'activeUsers' // Placeholder
    };

    const usageKey = usageMap[resourceType];
    return tenant.usage[usageKey] as number;
  }

  private getRateLimitConfig(tier: z.infer<typeof SubscriptionTier>) {
    const rateLimits = {
      starter: { requests: 100, window: 60, burstLimit: 20 },
      professional: { requests: 500, window: 60, burstLimit: 100 },
      enterprise: { requests: 2000, window: 60, burstLimit: 500 },
      premium: { requests: 10000, window: 60, burstLimit: 2000 },
      platform_partner: { requests: 50000, window: 60, burstLimit: 10000 }
    };

    return rateLimits[tier];
  }

  private generateTenantId(): string {
    return `tenant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async initializeDefaultTenants(): Promise<void> {
    // Initialize some default tenants for development
    this.tenantCache.set('tenant_premium_developments', await this.loadTenantFromDatabase('tenant_premium_developments') as Tenant);
  }

  // Placeholder methods that would be implemented in production
  private async getTenantIdBySubdomain(subdomain: string): Promise<string | null> { return 'tenant_premium_developments'; }
  private async getTenantIdByApiKey(apiKey: string): Promise<string | null> { return null; }
  private async getTenantIdByUserId(userId: string): Promise<string | null> { return 'tenant_premium_developments'; }
  private async getUserRolesForTenant(userId: string, tenantId: string): Promise<string[]> { return ['admin']; }
  private async getPermissionsForRoles(roles: string[], tenantId: string): Promise<string[]> { return ['*']; }
  private async persistUsageUpdate(tenantId: string, resourceType: string, newValue: number): Promise<void> {}
  private shouldSendQuotaWarning(tenant: Tenant, resourceType: string, newValue: number): boolean { return false; }
  private async sendQuotaWarning(tenant: Tenant, resourceType: string, newValue: number): Promise<void> {}
  private async logQuotaExceeded(tenantId: string, resourceType: string, quota: any, currentUsage: number, requested: number): Promise<void> {}
  private async createDefaultAdminUser(tenant: Tenant): Promise<void> {}
  private async setupTenantMonitoring(tenant: Tenant): Promise<void> {}
  private async configureTenantSecurity(tenant: Tenant): Promise<void> {}
}

// Export singleton instance
export const multiTenantManager = MultiTenantManager.getInstance();

// Middleware helper for extracting tenant context
export async function withTenantContext(
  request: any,
  userId: string,
  handler: (context: TenantContext) => Promise<any>
): Promise<any> {
  const context = await multiTenantManager.extractTenantContext(request, userId);
  
  if (!context) {
    throw new Error('Tenant context could not be determined');
  }

  // Check quota before processing request
  const quotaCheck = await multiTenantManager.checkQuota(context.tenantId, 'maxAPICallsPerMonth', 1);
  if (!quotaCheck.allowed) {
    throw new Error(`API quota exceeded: ${quotaCheck.message}`);
  }

  // Update API usage
  await multiTenantManager.updateUsage(context.tenantId, 'apiCallsThisMonth', 1);

  return handler(context);
}