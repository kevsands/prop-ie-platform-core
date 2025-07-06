// Security Monitoring & Incident Response for PROP.IE Platform
// Enterprise-grade security monitoring for €847M+ transaction platform
// Addresses CodeRabbit findings for continuous security monitoring

interface SecurityEvent {
  id: string;
  timestamp: string;
  eventType: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  userId?: string;
  ipAddress: string;
  userAgent?: string;
  details: Record<string, any>;
  riskScore: number;
  platform: string;
}

interface SecurityAlert {
  id: string;
  eventId: string;
  alertType: string;
  severity: 'HIGH' | 'CRITICAL';
  message: string;
  actionRequired: boolean;
  escalated: boolean;
  createdAt: string;
}

interface ThreatPattern {
  pattern: string;
  description: string;
  riskLevel: number;
  autoBlock: boolean;
}

export class SecurityMonitoring {
  private static events: SecurityEvent[] = [];
  private static alerts: SecurityAlert[] = [];
  
  // Define threat patterns for automated detection
  private static threatPatterns: ThreatPattern[] = [
    {
      pattern: 'BRUTE_FORCE_LOGIN',
      description: 'Multiple failed login attempts from same IP',
      riskLevel: 8,
      autoBlock: true
    },
    {
      pattern: 'SQL_INJECTION_ATTEMPT',
      description: 'Suspicious SQL patterns in request parameters',
      riskLevel: 9,
      autoBlock: true
    },
    {
      pattern: 'SESSION_HIJACK_ATTEMPT',
      description: 'Session token used from different IP/browser',
      riskLevel: 10,
      autoBlock: true
    },
    {
      pattern: 'PRIVILEGE_ESCALATION',
      description: 'Unauthorized attempt to access admin functions',
      riskLevel: 9,
      autoBlock: true
    },
    {
      pattern: 'DATA_EXFILTRATION',
      description: 'Unusual data access patterns or bulk downloads',
      riskLevel: 8,
      autoBlock: false
    },
    {
      pattern: 'API_ABUSE',
      description: 'Excessive API calls or unusual usage patterns',
      riskLevel: 6,
      autoBlock: true
    }
  ];

  /**
   * Log security event with automated threat detection
   */
  static logSecurityEvent(
    eventType: string,
    severity: SecurityEvent['severity'],
    details: Record<string, any>,
    userId?: string,
    ipAddress = 'unknown',
    userAgent?: string
  ): void {
    const event: SecurityEvent = {
      id: this.generateEventId(),
      timestamp: new Date().toISOString(),
      eventType,
      severity,
      userId,
      ipAddress,
      userAgent,
      details,
      riskScore: this.calculateRiskScore(eventType, severity, details),
      platform: 'PROP.IE-Enterprise'
    };

    this.events.push(event);

    // Automated threat detection
    this.detectThreats(event);

    // Real-time logging
    console.log(`[SECURITY-${severity}] ${eventType}: ${JSON.stringify(event)}`);

    // Send to external monitoring (production)
    this.sendToSIEM(event);

    // Check for automated response
    if (event.riskScore >= 8) {
      this.triggerSecurityAlert(event);
    }
  }

  /**
   * Calculate risk score based on event characteristics
   */
  private static calculateRiskScore(
    eventType: string,
    severity: SecurityEvent['severity'],
    details: Record<string, any>
  ): number {
    let score = 0;

    // Base score by severity
    switch (severity) {
      case 'LOW': score = 2; break;
      case 'MEDIUM': score = 4; break;
      case 'HIGH': score = 7; break;
      case 'CRITICAL': score = 10; break;
    }

    // Event type modifiers
    const eventRisks: Record<string, number> = {
      'LOGIN_FAILURE': 3,
      'LOGIN_SUCCESS_AFTER_FAILURES': 5,
      'SESSION_ANOMALY': 6,
      'PRIVILEGE_ESCALATION': 9,
      'ADMIN_ACCESS': 5,
      'DATA_ACCESS_UNUSUAL': 7,
      'API_RATE_LIMIT_EXCEEDED': 4,
      'SUSPICIOUS_QUERY': 8,
      'CONFIGURATION_CHANGE': 6,
      'SECURITY_BYPASS_ATTEMPT': 10
    };

    score += eventRisks[eventType] || 0;

    // Context-based modifiers
    if (details.multipleFailures) score += 2;
    if (details.newLocation) score += 1;
    if (details.adminFunction) score += 3;
    if (details.sensitiveData) score += 2;
    if (details.afterHours) score += 1;

    return Math.min(score, 10);
  }

  /**
   * Detect threat patterns in events
   */
  private static detectThreats(event: SecurityEvent): void {
    this.threatPatterns.forEach(pattern => {
      if (this.matchesPattern(event, pattern)) {
        console.warn(`[THREAT DETECTED] ${pattern.description}`);
        
        if (pattern.autoBlock) {
          this.initiateAutoBlock(event, pattern);
        }

        this.logSecurityEvent(
          'THREAT_PATTERN_DETECTED',
          'HIGH',
          {
            originalEvent: event.id,
            pattern: pattern.pattern,
            description: pattern.description,
            autoBlocked: pattern.autoBlock
          },
          event.userId,
          event.ipAddress
        );
      }
    });
  }

  /**
   * Check if event matches threat pattern
   */
  private static matchesPattern(event: SecurityEvent, pattern: ThreatPattern): boolean {
    switch (pattern.pattern) {
      case 'BRUTE_FORCE_LOGIN':
        return this.detectBruteForce(event);
      
      case 'SQL_INJECTION_ATTEMPT':
        return this.detectSQLInjection(event);
      
      case 'SESSION_HIJACK_ATTEMPT':
        return this.detectSessionHijack(event);
      
      case 'PRIVILEGE_ESCALATION':
        return this.detectPrivilegeEscalation(event);
      
      case 'DATA_EXFILTRATION':
        return this.detectDataExfiltration(event);
      
      case 'API_ABUSE':
        return this.detectAPIAbuse(event);
      
      default:
        return false;
    }
  }

  /**
   * Specific threat detection methods
   */
  private static detectBruteForce(event: SecurityEvent): boolean {
    if (event.eventType !== 'LOGIN_FAILURE') return false;
    
    const recentFailures = this.events.filter(e => 
      e.eventType === 'LOGIN_FAILURE' &&
      e.ipAddress === event.ipAddress &&
      Date.now() - new Date(e.timestamp).getTime() < 300000 // 5 minutes
    );
    
    return recentFailures.length >= 5;
  }

  private static detectSQLInjection(event: SecurityEvent): boolean {
    const sqlPatterns = [
      /(\bUNION\b.*\bSELECT\b)/i,
      /(\bSELECT\b.*\bFROM\b.*\bWHERE\b)/i,
      /(\bINSERT\b.*\bINTO\b)/i,
      /(\bDROP\b.*\bTABLE\b)/i,
      /(\b(OR|AND)\b.*=.*)/i,
      /(\'.*\bOR\b.*\')/i
    ];

    const payload = JSON.stringify(event.details);
    return sqlPatterns.some(pattern => pattern.test(payload));
  }

  private static detectSessionHijack(event: SecurityEvent): boolean {
    if (event.eventType !== 'SESSION_ANOMALY') return false;
    return event.details.ipMismatch || event.details.userAgentMismatch;
  }

  private static detectPrivilegeEscalation(event: SecurityEvent): boolean {
    return event.eventType === 'PRIVILEGE_ESCALATION' || 
           (event.details.adminFunction && !event.details.hasAdminRole);
  }

  private static detectDataExfiltration(event: SecurityEvent): boolean {
    if (event.eventType !== 'DATA_ACCESS') return false;
    
    return event.details.bulkDownload || 
           event.details.unusualDataVolume || 
           event.details.sensitiveDataAccess;
  }

  private static detectAPIAbuse(event: SecurityEvent): boolean {
    if (event.eventType !== 'API_REQUEST') return false;
    
    const recentRequests = this.events.filter(e => 
      e.eventType === 'API_REQUEST' &&
      e.ipAddress === event.ipAddress &&
      Date.now() - new Date(e.timestamp).getTime() < 60000 // 1 minute
    );
    
    return recentRequests.length > 100; // More than 100 requests per minute
  }

  /**
   * Trigger security alert for high-risk events
   */
  private static triggerSecurityAlert(event: SecurityEvent): void {
    const alert: SecurityAlert = {
      id: this.generateAlertId(),
      eventId: event.id,
      alertType: event.eventType,
      severity: event.riskScore >= 9 ? 'CRITICAL' : 'HIGH',
      message: this.generateAlertMessage(event),
      actionRequired: event.riskScore >= 8,
      escalated: event.riskScore >= 9,
      createdAt: new Date().toISOString()
    };

    this.alerts.push(alert);

    // Send immediate notification for critical alerts
    if (alert.severity === 'CRITICAL') {
      this.sendCriticalAlert(alert, event);
    }

    console.error(`[SECURITY ALERT] ${alert.severity}: ${alert.message}`);
  }

  /**
   * Initiate automatic blocking for severe threats
   */
  private static initiateAutoBlock(event: SecurityEvent, pattern: ThreatPattern): void {
    console.warn(`[AUTO-BLOCK] Blocking IP ${event.ipAddress} due to ${pattern.pattern}`);
    
    // In production, integrate with firewall/WAF
    // await this.blockIP(event.ipAddress, pattern.pattern);
    
    this.logSecurityEvent(
      'AUTO_BLOCK_INITIATED',
      'HIGH',
      {
        blockedIP: event.ipAddress,
        reason: pattern.pattern,
        originalEvent: event.id
      }
    );
  }

  /**
   * Generate alert message based on event
   */
  private static generateAlertMessage(event: SecurityEvent): string {
    const messages: Record<string, string> = {
      'LOGIN_FAILURE': `Multiple failed login attempts from IP ${event.ipAddress}`,
      'SESSION_ANOMALY': `Suspicious session activity detected for user ${event.userId}`,
      'PRIVILEGE_ESCALATION': `Unauthorized privilege escalation attempt detected`,
      'DATA_ACCESS_UNUSUAL': `Unusual data access pattern detected`,
      'API_ABUSE': `API abuse detected from IP ${event.ipAddress}`,
      'SECURITY_BYPASS_ATTEMPT': `Security bypass attempt detected`
    };

    return messages[event.eventType] || `Security event detected: ${event.eventType}`;
  }

  /**
   * Send critical alerts to security team
   */
  private static sendCriticalAlert(alert: SecurityAlert, event: SecurityEvent): void {
    // In production, integrate with:
    // - Slack/Teams notifications
    // - SMS alerts for critical events
    // - PagerDuty for incident response
    // - Email notifications
    
    console.error(`[CRITICAL ALERT] Immediate attention required: ${alert.message}`);
    console.error(`Event details: ${JSON.stringify(event)}`);
    
    // Example integration (implement in production):
    // await this.sendSlackAlert(alert, event);
    // await this.sendSMSAlert(alert, event);
    // await this.createPagerDutyIncident(alert, event);
  }

  /**
   * Send events to SIEM/monitoring system
   */
  private static sendToSIEM(event: SecurityEvent): void {
    // In production, integrate with:
    // - Splunk
    // - ELK Stack (Elasticsearch, Logstash, Kibana)
    // - AWS CloudTrail
    // - DataDog
    // - New Relic
    
    // Example JSON format for SIEM ingestion
    const siemEvent = {
      source: 'prop.ie',
      event_type: 'security',
      timestamp: event.timestamp,
      severity: event.severity,
      risk_score: event.riskScore,
      user_id: event.userId,
      ip_address: event.ipAddress,
      event_details: event.details,
      platform: 'PROP.IE-Enterprise'
    };

    // Log for now (replace with actual SIEM integration)
    console.log(`[SIEM] ${JSON.stringify(siemEvent)}`);
  }

  /**
   * Get security metrics and analytics
   */
  static getSecurityMetrics(timeframe = 24): {
    totalEvents: number;
    eventsBySeverity: Record<string, number>;
    topThreatTypes: Array<{type: string, count: number}>;
    alertCount: number;
    riskScore: number;
  } {
    const hoursAgo = Date.now() - (timeframe * 60 * 60 * 1000);
    const recentEvents = this.events.filter(e => 
      new Date(e.timestamp).getTime() > hoursAgo
    );

    const eventsBySeverity = recentEvents.reduce((acc, event) => {
      acc[event.severity] = (acc[event.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const threatCounts = recentEvents.reduce((acc, event) => {
      acc[event.eventType] = (acc[event.eventType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topThreatTypes = Object.entries(threatCounts)
      .map(([type, count]) => ({type, count}))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const averageRiskScore = recentEvents.length > 0 
      ? recentEvents.reduce((sum, event) => sum + event.riskScore, 0) / recentEvents.length
      : 0;

    return {
      totalEvents: recentEvents.length,
      eventsBySeverity,
      topThreatTypes,
      alertCount: this.alerts.length,
      riskScore: Math.round(averageRiskScore * 10) / 10
    };
  }

  /**
   * Generate event ID
   */
  private static generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate alert ID
   */
  private static generateAlertId(): string {
    return `alt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get all events (for admin dashboard)
   */
  static getAllEvents(): SecurityEvent[] {
    return this.events;
  }

  /**
   * Get all alerts (for admin dashboard)
   */
  static getAllAlerts(): SecurityAlert[] {
    return this.alerts;
  }

  /**
   * Clear old events (maintenance)
   */
  static clearOldEvents(daysToKeep = 30): void {
    const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
    this.events = this.events.filter(event => 
      new Date(event.timestamp).getTime() > cutoffTime
    );
  }
}

// Export for use in API routes and middleware
export { SecurityMonitoring, SecurityEvent, SecurityAlert };

// Example usage in API routes:
/*
import { SecurityMonitoring } from '@/lib/security-monitoring';

// In login API
SecurityMonitoring.logSecurityEvent(
  'LOGIN_ATTEMPT',
  'MEDIUM',
  { username, success: false, reason: 'invalid_password' },
  undefined,
  clientIP,
  userAgent
);

// In admin API
SecurityMonitoring.logSecurityEvent(
  'ADMIN_ACCESS',
  'HIGH',
  { action: 'user_management', resource: 'user_list' },
  userId,
  clientIP
);
*/