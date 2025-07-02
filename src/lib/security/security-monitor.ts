/**
 * Security Monitoring System
 * 
 * Real-time security monitoring with threat detection, rate limiting,
 * and automated response capabilities for the PROP.ie platform
 */

import { auditLogger, SecurityEventType, SecurityRiskLevel } from './audit-logger';

/**
 * Threat indicators and patterns
 */
export interface ThreatIndicator {
  type: 'ip_reputation' | 'user_behavior' | 'request_pattern' | 'payload_analysis';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  confidence: number; // 0-100
  source: string;
}

/**
 * Security metrics for monitoring
 */
export interface SecurityMetrics {
  failedLoginAttempts: number;
  suspiciousRequests: number;
  blockedIPs: number;
  activeThreats: number;
  riskScore: number;
  lastThreatDetected?: Date;
}

/**
 * Rate limiting configuration
 */
interface RateLimitConfig {
  windowMs: number;
  maxAttempts: number;
  blockDurationMs: number;
  enabled: boolean;
}

/**
 * IP-based tracking for security monitoring
 */
interface IPSecurityData {
  ipAddress: string;
  firstSeen: Date;
  lastSeen: Date;
  requestCount: number;
  failedLoginCount: number;
  suspiciousActivity: string[];
  riskScore: number;
  isBlocked: boolean;
  blockExpiry?: Date;
  geoLocation?: {
    country: string;
    region: string;
    city: string;
  };
}

/**
 * User-based security tracking
 */
interface UserSecurityProfile {
  userId: string;
  email: string;
  lastLogin?: Date;
  failedLoginAttempts: number;
  knownIPs: string[];
  suspiciousActivities: string[];
  riskScore: number;
  accountLocked: boolean;
  lockExpiry?: Date;
  mfaEnabled: boolean;
  deviceFingerprints: string[];
}

/**
 * Security alert configuration
 */
interface SecurityAlert {
  id: string;
  type: 'brute_force' | 'suspicious_activity' | 'fraud_detected' | 'data_breach' | 'account_takeover';
  severity: SecurityRiskLevel;
  message: string;
  timestamp: Date;
  userId?: string;
  ipAddress?: string;
  metadata?: Record<string, any>;
  resolved: boolean;
}

/**
 * Security Monitor Class
 */
export class SecurityMonitor {
  private ipTracker = new Map<string, IPSecurityData>();
  private userProfiles = new Map<string, UserSecurityProfile>();
  private activeAlerts = new Map<string, SecurityAlert>();
  private rateLimitConfig: RateLimitConfig;
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor() {
    // Development mode: relaxed security settings
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    this.rateLimitConfig = {
      windowMs: isDevelopment ? 5 * 60 * 1000 : 15 * 60 * 1000, // 5 min in dev, 15 min in prod
      maxAttempts: isDevelopment ? 100 : 5, // 100 attempts in dev, 5 in prod
      blockDurationMs: isDevelopment ? 1 * 60 * 1000 : 30 * 60 * 1000, // 1 min in dev, 30 min in prod
      enabled: isDevelopment ? false : true // Disabled in development
    };

    // Start periodic cleanup
    this.startCleanupTimer();
  }

  /**
   * Monitor authentication attempt
   */
  monitorAuthAttempt(
    email: string,
    ipAddress: string,
    success: boolean,
    userAgent: string,
    requestContext: any = {}
  ): { allowed: boolean; reason?: string; riskScore: number } {
    const now = new Date();
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    // Development mode: allow all attempts with minimal monitoring
    if (isDevelopment) {
      return { allowed: true, riskScore: 0 };
    }
    
    // Update IP tracking
    this.updateIPTracking(ipAddress, success, userAgent);
    
    // Update user profile
    this.updateUserProfile(email, ipAddress, success);
    
    // Check if IP is blocked
    const ipData = this.ipTracker.get(ipAddress);
    if (ipData?.isBlocked && ipData.blockExpiry && now < ipData.blockExpiry) {
      auditLogger.logSecurityEvent(
        SecurityEventType.ACCESS_DENIED,
        `Blocked IP ${ipAddress} attempted access`,
        {
          riskLevel: SecurityRiskLevel.HIGH,
          userContext: { email },
          requestContext: { ipAddress, userAgent },
          metadata: { blockReason: 'IP blocked due to suspicious activity' },
          tags: ['ip-blocked', 'access-denied']
        }
      );
      
      return { allowed: false, reason: 'IP blocked due to suspicious activity', riskScore: 100 };
    }

    // Check rate limiting
    if (!success && this.rateLimitConfig.enabled) {
      const isRateLimited = this.checkRateLimit(ipAddress, email);
      if (isRateLimited) {
        this.createAlert('brute_force', SecurityRiskLevel.HIGH, 
          `Brute force attack detected from ${ipAddress}`, { email, ipAddress });
        
        auditLogger.logSecurityEvent(
          SecurityEventType.BRUTE_FORCE_DETECTED,
          `Brute force attack detected: ${email} from ${ipAddress}`,
          {
            riskLevel: SecurityRiskLevel.HIGH,
            userContext: { email },
            requestContext: { ipAddress, userAgent },
            metadata: { attemptCount: ipData?.failedLoginCount || 0 },
            tags: ['brute-force', 'rate-limit']
          }
        );
        
        return { allowed: false, reason: 'Rate limit exceeded', riskScore: 90 };
      }
    }

    // Calculate overall risk score
    const riskScore = this.calculateRiskScore(email, ipAddress, requestContext);
    
    // Check for suspicious activity
    if (riskScore > 70) {
      this.detectSuspiciousActivity(email, ipAddress, riskScore, requestContext);
    }

    return { allowed: true, riskScore };
  }

  /**
   * Monitor payment transaction
   */
  monitorPaymentTransaction(
    userId: string,
    amount: number,
    currency: string,
    ipAddress: string,
    paymentMethod: string,
    requestContext: any = {}
  ): { allowed: boolean; requiresVerification: boolean; riskScore: number } {
    const riskScore = this.calculatePaymentRiskScore(userId, amount, ipAddress, requestContext);
    
    // High-risk transactions require additional verification
    const requiresVerification = riskScore > 60 || amount > 100000; // €100k+
    
    // Block suspicious payments
    if (riskScore > 85) {
      this.createAlert('fraud_detected', SecurityRiskLevel.CRITICAL,
        `High-risk payment detected: ${currency} ${amount} from user ${userId}`,
        { userId, amount, currency, ipAddress, riskScore });
      
      auditLogger.logSecurityEvent(
        SecurityEventType.PAYMENT_FRAUD_SUSPECTED,
        `Fraudulent payment blocked: ${currency} ${amount.toLocaleString()}`,
        {
          riskLevel: SecurityRiskLevel.CRITICAL,
          userContext: { userId },
          requestContext: { ipAddress },
          metadata: { 
            amount, 
            currency, 
            riskScore,
            paymentMethodLast4: paymentMethod.slice(-4)
          },
          tags: ['payment-fraud', 'blocked-transaction']
        }
      );
      
      return { allowed: false, requiresVerification: true, riskScore };
    }

    return { allowed: true, requiresVerification, riskScore };
  }

  /**
   * Monitor API usage for abuse detection
   */
  monitorAPIUsage(
    endpoint: string,
    userId: string | undefined,
    ipAddress: string,
    responseTime: number,
    statusCode: number
  ): void {
    // Track API abuse patterns
    const ipData = this.ipTracker.get(ipAddress);
    if (ipData) {
      ipData.requestCount++;
      
      // Detect API abuse (too many requests)
      if (ipData.requestCount > 1000) { // 1000 requests per window
        this.blockIP(ipAddress, 'API abuse detected');
        
        auditLogger.logSecurityEvent(
          SecurityEventType.API_ABUSE_DETECTED,
          `API abuse detected from ${ipAddress}`,
          {
            riskLevel: SecurityRiskLevel.HIGH,
            userContext: { userId },
            requestContext: { ipAddress },
            metadata: { endpoint, requestCount: ipData.requestCount },
            tags: ['api-abuse', 'rate-limit-exceeded']
          }
        );
      }
    }

    // Monitor for error patterns that might indicate attacks
    if (statusCode >= 400 && responseTime < 100) {
      // Fast error responses might indicate automated attacks
      this.addSuspiciousActivity(ipAddress, `Fast error responses to ${endpoint}`);
    }
  }

  /**
   * Monitor data access for compliance
   */
  monitorDataAccess(
    resourceType: string,
    resourceId: string,
    action: string,
    userId: string,
    ipAddress: string,
    authorized: boolean
  ): void {
    const userProfile = this.userProfiles.get(userId);
    
    // Track data access patterns
    if (userProfile) {
      if (!authorized) {
        userProfile.suspiciousActivities.push(`Unauthorized ${action} access to ${resourceType}`);
        userProfile.riskScore += 20;
        
        auditLogger.logDataAccess(resourceType, resourceId, action as any, 
          { userId }, { ipAddress });
      }
    }

    // Detect unusual data access patterns
    if (action === 'DELETE' || action === 'EXPORT') {
      auditLogger.logSecurityEvent(
        SecurityEventType.SENSITIVE_DATA_ACCESS,
        `${action} operation on ${resourceType} by user ${userId}`,
        {
          riskLevel: action === 'DELETE' ? SecurityRiskLevel.HIGH : SecurityRiskLevel.MEDIUM,
          userContext: { userId },
          requestContext: { ipAddress },
          metadata: { resourceType, resourceId, action },
          tags: ['data-access', action.toLowerCase()]
        }
      );
    }
  }

  /**
   * Get current security metrics
   */
  getSecurityMetrics(): SecurityMetrics {
    const now = new Date();
    const windowStart = new Date(now.getTime() - this.rateLimitConfig.windowMs);
    
    let failedLoginAttempts = 0;
    let suspiciousRequests = 0;
    let blockedIPs = 0;
    let totalRiskScore = 0;
    let ipCount = 0;

    for (const ipData of this.ipTracker.values()) {
      if (ipData.lastSeen > windowStart) {
        failedLoginAttempts += ipData.failedLoginCount;
        suspiciousRequests += ipData.suspiciousActivity.length;
        if (ipData.isBlocked) blockedIPs++;
        totalRiskScore += ipData.riskScore;
        ipCount++;
      }
    }

    return {
      failedLoginAttempts,
      suspiciousRequests,
      blockedIPs,
      activeThreats: this.activeAlerts.size,
      riskScore: ipCount > 0 ? Math.round(totalRiskScore / ipCount) : 0,
      lastThreatDetected: this.getLastThreatTime()
    };
  }

  /**
   * Get active security alerts
   */
  getActiveAlerts(): SecurityAlert[] {
    return Array.from(this.activeAlerts.values())
      .filter(alert => !alert.resolved)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Block an IP address
   */
  blockIP(ipAddress: string, reason: string): void {
    const ipData = this.getOrCreateIPData(ipAddress);
    ipData.isBlocked = true;
    ipData.blockExpiry = new Date(Date.now() + this.rateLimitConfig.blockDurationMs);
    
    auditLogger.logSecurityEvent(
      SecurityEventType.IP_BLOCKED,
      `IP ${ipAddress} blocked: ${reason}`,
      {
        riskLevel: SecurityRiskLevel.HIGH,
        requestContext: { ipAddress },
        metadata: { reason, blockExpiry: ipData.blockExpiry },
        tags: ['ip-blocked', 'security-action']
      }
    );
  }

  /**
   * Update IP tracking data
   */
  private updateIPTracking(ipAddress: string, success: boolean, userAgent: string): void {
    const ipData = this.getOrCreateIPData(ipAddress);
    ipData.lastSeen = new Date();
    ipData.requestCount++;
    
    if (!success) {
      ipData.failedLoginCount++;
      ipData.riskScore += 10;
    } else {
      // Successful login reduces risk score slightly
      ipData.riskScore = Math.max(0, ipData.riskScore - 5);
    }
  }

  /**
   * Update user security profile
   */
  private updateUserProfile(email: string, ipAddress: string, success: boolean): void {
    const userProfile = this.getOrCreateUserProfile(email);
    
    if (success) {
      userProfile.lastLogin = new Date();
      userProfile.failedLoginAttempts = 0; // Reset on successful login
      
      // Add IP to known IPs if not already present
      if (!userProfile.knownIPs.includes(ipAddress)) {
        userProfile.knownIPs.push(ipAddress);
        // Limit to last 10 IPs
        if (userProfile.knownIPs.length > 10) {
          userProfile.knownIPs = userProfile.knownIPs.slice(-10);
        }
      }
    } else {
      userProfile.failedLoginAttempts++;
      userProfile.riskScore += 15;
      
      // Lock account after too many failed attempts
      if (userProfile.failedLoginAttempts >= 5) {
        userProfile.accountLocked = true;
        userProfile.lockExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        
        auditLogger.logSecurityEvent(
          SecurityEventType.ACCOUNT_LOCKED,
          `Account locked for user ${email} due to failed login attempts`,
          {
            riskLevel: SecurityRiskLevel.HIGH,
            userContext: { email },
            metadata: { attemptCount: userProfile.failedLoginAttempts },
            tags: ['account-locked', 'brute-force-protection']
          }
        );
      }
    }
  }

  /**
   * Check rate limiting
   */
  private checkRateLimit(ipAddress: string, email: string): boolean {
    const ipData = this.ipTracker.get(ipAddress);
    if (!ipData) return false;
    
    return ipData.failedLoginCount >= this.rateLimitConfig.maxAttempts;
  }

  /**
   * Calculate risk score for authentication
   */
  private calculateRiskScore(email: string, ipAddress: string, context: any): number {
    let score = 0;
    
    const ipData = this.ipTracker.get(ipAddress);
    const userProfile = this.userProfiles.get(email);
    
    // IP-based risk factors
    if (ipData) {
      score += Math.min(ipData.failedLoginCount * 10, 50);
      score += ipData.suspiciousActivity.length * 5;
      
      // New IP for user
      if (userProfile && !userProfile.knownIPs.includes(ipAddress)) {
        score += 20;
      }
    }
    
    // User-based risk factors
    if (userProfile) {
      score += Math.min(userProfile.failedLoginAttempts * 5, 25);
      score += userProfile.suspiciousActivities.length * 3;
    }
    
    // Time-based factors
    const hour = new Date().getHours();
    if (hour < 6 || hour > 22) {
      score += 10; // Off-hours access
    }
    
    // Geographic factors (would implement actual geo-IP lookup)
    // For now, assume any non-EU IP gets higher score
    score += this.getGeographicRiskScore(ipAddress);
    
    return Math.min(score, 100);
  }

  /**
   * Calculate payment-specific risk score
   */
  private calculatePaymentRiskScore(userId: string, amount: number, ipAddress: string, context: any): number {
    let score = this.calculateRiskScore(userId, ipAddress, context);
    
    // Amount-based risk
    if (amount > 500000) score += 30;        // €500k+
    else if (amount > 100000) score += 20;   // €100k+
    else if (amount > 50000) score += 10;    // €50k+
    
    // Payment pattern analysis
    // (In real implementation, would check historical payment patterns)
    
    return Math.min(score, 100);
  }

  /**
   * Get geographic risk score (placeholder)
   */
  private getGeographicRiskScore(ipAddress: string): number {
    // In real implementation, would use geo-IP database
    // For now, return low risk
    return 0;
  }

  /**
   * Detect suspicious activity patterns
   */
  private detectSuspiciousActivity(email: string, ipAddress: string, riskScore: number, context: any): void {
    const indicators: string[] = [];
    
    if (riskScore > 80) indicators.push('high-risk-score');
    
    const ipData = this.ipTracker.get(ipAddress);
    if (ipData?.failedLoginCount > 3) indicators.push('multiple-failed-logins');
    
    const userProfile = this.userProfiles.get(email);
    if (userProfile && !userProfile.knownIPs.includes(ipAddress)) {
      indicators.push('unknown-ip');
    }
    
    if (indicators.length > 0) {
      auditLogger.logSuspiciousActivity(
        `Suspicious login attempt for ${email}`,
        indicators,
        { email },
        { ipAddress },
        { riskScore }
      );
      
      this.addSuspiciousActivity(ipAddress, `Suspicious login: ${indicators.join(', ')}`);
    }
  }

  /**
   * Add suspicious activity to IP tracking
   */
  private addSuspiciousActivity(ipAddress: string, activity: string): void {
    const ipData = this.getOrCreateIPData(ipAddress);
    ipData.suspiciousActivity.push(activity);
    ipData.riskScore += 15;
    
    // Limit activity log size
    if (ipData.suspiciousActivity.length > 20) {
      ipData.suspiciousActivity = ipData.suspiciousActivity.slice(-20);
    }
  }

  /**
   * Create security alert
   */
  private createAlert(
    type: SecurityAlert['type'], 
    severity: SecurityRiskLevel, 
    message: string, 
    metadata?: Record<string, any>
  ): void {
    const alert: SecurityAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      severity,
      message,
      timestamp: new Date(),
      metadata,
      resolved: false
    };
    
    this.activeAlerts.set(alert.id, alert);
    
    // Auto-resolve low severity alerts after 1 hour
    if (severity === SecurityRiskLevel.LOW) {
      setTimeout(() => {
        this.resolveAlert(alert.id);
      }, 60 * 60 * 1000);
    }
  }

  /**
   * Resolve security alert
   */
  resolveAlert(alertId: string): void {
    const alert = this.activeAlerts.get(alertId);
    if (alert) {
      alert.resolved = true;
    }
  }

  /**
   * Get or create IP data
   */
  private getOrCreateIPData(ipAddress: string): IPSecurityData {
    if (!this.ipTracker.has(ipAddress)) {
      this.ipTracker.set(ipAddress, {
        ipAddress,
        firstSeen: new Date(),
        lastSeen: new Date(),
        requestCount: 0,
        failedLoginCount: 0,
        suspiciousActivity: [],
        riskScore: 0,
        isBlocked: false
      });
    }
    return this.ipTracker.get(ipAddress)!;
  }

  /**
   * Get or create user profile
   */
  private getOrCreateUserProfile(email: string): UserSecurityProfile {
    if (!this.userProfiles.has(email)) {
      this.userProfiles.set(email, {
        userId: email, // Would use actual user ID in real implementation
        email,
        failedLoginAttempts: 0,
        knownIPs: [],
        suspiciousActivities: [],
        riskScore: 0,
        accountLocked: false,
        mfaEnabled: false,
        deviceFingerprints: []
      });
    }
    return this.userProfiles.get(email)!;
  }

  /**
   * Get last threat detection time
   */
  private getLastThreatTime(): Date | undefined {
    const alerts = Array.from(this.activeAlerts.values());
    if (alerts.length === 0) return undefined;
    
    return alerts.reduce((latest, alert) => 
      alert.timestamp > latest ? alert.timestamp : latest, 
      alerts[0].timestamp
    );
  }

  /**
   * Start cleanup timer for old data
   */
  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanupOldData();
    }, 60 * 60 * 1000); // Cleanup every hour
  }

  /**
   * Clean up old tracking data
   */
  private cleanupOldData(): void {
    const now = new Date();
    const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
    
    // Clean up old IP data
    for (const [ip, data] of this.ipTracker.entries()) {
      if (data.lastSeen < cutoff && !data.isBlocked) {
        this.ipTracker.delete(ip);
      }
    }
    
    // Clean up resolved alerts older than 7 days
    const alertCutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    for (const [id, alert] of this.activeAlerts.entries()) {
      if (alert.resolved && alert.timestamp < alertCutoff) {
        this.activeAlerts.delete(id);
      }
    }
  }

  /**
   * Clear all security locks and reset state (development only)
   */
  clearAllLocks(): void {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    if (!isDevelopment) {
      console.warn('clearAllLocks() can only be called in development mode');
      return;
    }
    
    // Clear all IP blocks and reset counters
    for (const ipData of this.ipTracker.values()) {
      ipData.isBlocked = false;
      ipData.blockExpiry = undefined;
      ipData.failedLoginCount = 0;
      ipData.riskScore = 0;
      ipData.suspiciousActivity = [];
    }
    
    // Clear all user account locks
    for (const userProfile of this.userProfiles.values()) {
      userProfile.accountLocked = false;
      userProfile.lockExpiry = undefined;
      userProfile.failedLoginAttempts = 0;
      userProfile.riskScore = 0;
      userProfile.suspiciousActivities = [];
    }
    
    // Clear all alerts
    this.activeAlerts.clear();
    
    console.log('🔓 All security locks cleared (development mode)');
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }
}

// Create and export singleton instance
export const securityMonitor = new SecurityMonitor();

export default securityMonitor;