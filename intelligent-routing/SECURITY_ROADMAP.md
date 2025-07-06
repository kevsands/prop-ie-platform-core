# Security & Architecture Roadmap

Following the completion of core architectural remediation, this roadmap outlines the next steps to further enhance security, infrastructure, and operational capabilities of the Prop IE AWS application.

## 1. Security Testing & Validation

### 1.1 Penetration Testing Framework

**Objective**: Implement automated security testing for API and authentication systems.

**Tasks**:
- [ ] Set up OWASP ZAP for automated API security scanning
- [ ] Implement authentication flow testing with Selenium or Playwright
- [ ] Create JWT token vulnerability scanning tests
- [ ] Develop custom security test suite specific to AWS Cognito implementation
- [ ] Automate testing for common vulnerabilities (SQLi, XSS, CSRF, etc.)

**Implementation Plan**:
```bash
# Install security testing tools
npm install --save-dev zap-cli playwright jest-security

# Create security testing directory structure
mkdir -p tests/security/{api,auth,ui,infrastructure}

# Add security testing to CI pipeline
echo "security-scan:
  stage: test
  script:
    - npm run security-tests
  artifacts:
    paths:
      - security-report.html" >> .gitlab-ci.yml
```

### 1.2 Vulnerability Scanning

**Objective**: Set up regular automated scanning of dependencies and infrastructure.

**Tasks**:
- [ ] Configure Snyk for continuous dependency vulnerability scanning
- [ ] Set up AWS Inspector for infrastructure scanning
- [ ] Implement trivy for container vulnerability scanning
- [ ] Create dependency audit workflow in CI/CD pipeline
- [ ] Establish vulnerability review and remediation process

**Implementation Plan**:
```yaml
# Add to package.json
{
  "scripts": {
    "security:deps": "snyk test",
    "security:infra": "aws-inspector-cli scan",
    "security:containers": "trivy image prop-ie-aws-app"
  }
}

# Schedule weekly scans
# .github/workflows/security-scan.yml
name: Weekly Security Scan
on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday
jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Security Scans
        run: |
          npm run security:deps
          npm run security:infra
          npm run security:containers
```

### 1.3 Security Headers Audit

**Objective**: Ensure proper security headers are implemented across the application.

**Tasks**:
- [ ] Implement security headers testing in CI/CD pipeline
- [ ] Create automatic header validation tool
- [ ] Refine CSP policy based on application needs
- [ ] Set up continuous monitoring of security headers
- [ ] Document security header requirements

**Implementation Plan**:
```javascript
// scripts/validate-headers.js
const fetch = require('node-fetch');
const urls = [
  'https://prop-ie-aws-app.com',
  'https://prop-ie-aws-app.com/login',
  // Add more critical URLs
];

const requiredHeaders = {
  'Content-Security-Policy': true,
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': true,
  'Strict-Transport-Security': true
};

async function validateHeaders() {
  let success = true;
  
  for (const url of urls) {
    console.log(`Checking headers for ${url}`);
    const response = await fetch(url);
    const headers = response.headers;
    
    for (const [header, value] of Object.entries(requiredHeaders)) {
      if (!headers.has(header)) {
        console.error(`❌ Missing header: ${header}`);
        success = false;
      } else if (value !== true && headers.get(header) !== value) {
        console.error(`❌ Invalid header value for ${header}: ${headers.get(header)}`);
        success = false;
      } else {
        console.log(`✅ Valid header: ${header}`);
      }
    }
  }
  
  process.exit(success ? 0 : 1);
}

validateHeaders();
```

## 2. Infrastructure & Deployment

### 2.1 Infrastructure as Code

**Objective**: Create or improve CloudFormation/Terraform templates for AWS resources.

**Tasks**:
- [ ] Create Terraform templates for all AWS resources
- [ ] Implement environment-specific variable files
- [ ] Set up remote state management with S3 and DynamoDB
- [ ] Develop modules for common infrastructure patterns
- [ ] Implement infrastructure testing with Terratest

**Implementation Plan**:
```
terraform/
├── environments/
│   ├── dev/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── staging/
│   └── production/
├── modules/
│   ├── amplify/
│   ├── cognito/
│   ├── api-gateway/
│   ├── lambda/
│   └── s3/
└── scripts/
    ├── apply.sh
    └── destroy.sh
```

```hcl
# terraform/modules/cognito/main.tf
resource "aws_cognito_user_pool" "prop_user_pool" {
  name = var.user_pool_name
  
  # Security settings
  mfa_configuration = "OPTIONAL"
  
  password_policy {
    minimum_length    = 12
    require_lowercase = true
    require_uppercase = true
    require_numbers   = true
    require_symbols   = true
  }
  
  # Advanced security features
  user_pool_add_ons {
    advanced_security_mode = "ENFORCED"
  }
  
  # Account recovery settings
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }
  
  # Custom attributes
  schema {
    name                = "role"
    attribute_data_type = "String"
    mutable             = true
    string_attribute_constraints {
      min_length = 0
      max_length = 256
    }
  }
  
  # Tags
  tags = var.tags
}
```

### 2.2 CI/CD Pipeline Security

**Objective**: Add security scanning steps to the build and deployment pipeline.

**Tasks**:
- [ ] Implement pre-commit hooks for security checks
- [ ] Add SAST scanning to CI pipeline
- [ ] Integrate dependency vulnerability scanning
- [ ] Create infrastructure validation checks
- [ ] Implement deployment approval process for security-critical changes

**Implementation Plan**:
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run static analysis
        run: npm run lint:security
        
      - name: Check dependencies
        run: npm audit --production
        
      - name: Run SAST
        uses: github/codeql-action/analyze@v2
        with:
          languages: javascript, typescript
          
      - name: Validate infrastructure
        run: |
          cd terraform
          terraform init
          terraform validate
          
  build:
    needs: security-scan
    runs-on: ubuntu-latest
    steps:
      # Build steps here
      
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      # Deploy steps here
      - name: Post-deployment security check
        run: npm run security:post-deploy
```

### 2.3 Environment Parity

**Objective**: Ensure consistent configuration across all environments.

**Tasks**:
- [ ] Create environment configuration templates
- [ ] Implement configuration validation tool
- [ ] Develop environment promotion process
- [ ] Set up configuration drift detection
- [ ] Document environment differences and justifications

**Implementation Plan**:
```javascript
// scripts/validate-env-parity.js
const fs = require('fs');
const path = require('path');

const environments = ['dev', 'staging', 'production'];
const baseConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/base.json')));

// Config properties that are allowed to vary between environments
const allowedVariations = [
  'apiUrl',
  'logLevel',
  'featureFlags.debugEnabled'
];

function validateEnvironments() {
  let success = true;
  
  for (const env of environments) {
    console.log(`Validating ${env} environment`);
    const envConfig = JSON.parse(fs.readFileSync(path.join(__dirname, `../config/${env}.json`)));
    
    // Check for missing properties
    for (const key of Object.keys(baseConfig)) {
      if (!(key in envConfig)) {
        console.error(`❌ Missing config key in ${env}: ${key}`);
        success = false;
      }
    }
    
    // Check for unexpected properties
    for (const key of Object.keys(envConfig)) {
      if (!(key in baseConfig)) {
        console.error(`❌ Unexpected config key in ${env}: ${key}`);
        success = false;
      }
    }
  }
  
  // Check for configuration drift between environments
  for (const env1 of environments) {
    for (const env2 of environments.filter(e => e !== env1)) {
      const config1 = JSON.parse(fs.readFileSync(path.join(__dirname, `../config/${env1}.json`)));
      const config2 = JSON.parse(fs.readFileSync(path.join(__dirname, `../config/${env2}.json`)));
      
      // Compare configs, ignoring allowed variations
      for (const key of Object.keys(baseConfig)) {
        if (!allowedVariations.includes(key) && config1[key] !== config2[key]) {
          console.warn(`⚠️ Configuration drift detected: ${key} differs between ${env1} and ${env2}`);
        }
      }
    }
  }
  
  process.exit(success ? 0 : 1);
}

validateEnvironments();
```

## 3. Advanced Monitoring & Observability

### 3.1 Security Monitoring Dashboard

**Objective**: Create a centralized dashboard for authentication and API security events.

**Tasks**:
- [ ] Set up CloudWatch dashboard for security events
- [ ] Implement custom security metrics for key operations
- [ ] Create login attempt visualization
- [ ] Develop API usage monitoring dashboard
- [ ] Implement automated access pattern analysis

**Implementation Plan**:
```typescript
// src/lib/monitoring/security-metrics.ts
import { config } from '@/config';
import { metricScope, MetricsLogger } from 'aws-embedded-metrics';

export const securityMetrics = {
  recordAuthEvent: metricScope(metrics => async (event: {
    type: string;
    success: boolean;
    userId?: string;
    ip?: string;
  }) => {
    const metricsLogger = metrics.createMetricsLogger();
    
    metricsLogger.putDimensions({
      Environment: config.environment,
      AuthEventType: event.type
    });
    
    metricsLogger.putMetric('AuthAttemptCount', 1);
    metricsLogger.putMetric('AuthSuccessCount', event.success ? 1 : 0);
    metricsLogger.putMetric('AuthFailureCount', event.success ? 0 : 1);
    
    if (event.userId) {
      metricsLogger.setProperty('UserId', event.userId);
    }
    
    if (event.ip) {
      metricsLogger.setProperty('SourceIP', event.ip);
    }
    
    metricsLogger.setProperty('Timestamp', new Date().toISOString());
    
    return metricsLogger.flush();
  }),
  
  recordApiEvent: metricScope(metrics => async (event: {
    endpoint: string;
    method: string;
    statusCode: number;
    latency: number;
    userId?: string;
  }) => {
    const metricsLogger = metrics.createMetricsLogger();
    
    metricsLogger.putDimensions({
      Environment: config.environment,
      ApiEndpoint: event.endpoint,
      Method: event.method,
      StatusCode: event.statusCode.toString()
    });
    
    metricsLogger.putMetric('ApiCallCount', 1);
    metricsLogger.putMetric('ApiLatency', event.latency);
    metricsLogger.putMetric('ApiErrorCount', event.statusCode >= 400 ? 1 : 0);
    
    if (event.userId) {
      metricsLogger.setProperty('UserId', event.userId);
    }
    
    metricsLogger.setProperty('Timestamp', new Date().toISOString());
    
    return metricsLogger.flush();
  })
};
```

### 3.2 Anomaly Detection

**Objective**: Implement advanced detection for unusual auth patterns or API usage.

**Tasks**:
- [ ] Set up CloudWatch anomaly detection
- [ ] Implement IP-based anomaly detection
- [ ] Create user behavior analytics system
- [ ] Develop API rate anomaly detection
- [ ] Set up security alert mechanisms

**Implementation Plan**:
```typescript
// src/lib/security/anomaly-detection.ts
import { api } from '@/lib/api-client';
import { authService } from '@/lib/auth';

interface UserBehaviorMetrics {
  userId: string;
  lastLogin: Date;
  loginCount: number;
  loginIPs: string[];
  loginTimes: number[]; // Hour of day (0-23)
  apiUsagePattern: Record<string, number>;
  failedLoginCount: number;
}

// Rate limits and thresholds
const THRESHOLDS = {
  MAX_FAILED_LOGINS: 5,
  MAX_API_RATE: 60, // requests per minute
  MAX_IP_COUNT: 3, // different IPs in 24h
  SUSPICIOUS_TIME_WINDOW: 3 // hours outside normal pattern
};

class AnomalyDetector {
  private userMetrics: Map<string, UserBehaviorMetrics> = new Map();
  
  // Track login attempts and detect anomalies
  async trackLogin(userId: string, success: boolean, ip: string): Promise<{
    isAnomaly: boolean;
    reason?: string;
  }> {
    const now = new Date();
    const hour = now.getHours();
    
    // Get or create user metrics
    let metrics = this.userMetrics.get(userId);
    if (!metrics) {
      metrics = {
        userId,
        lastLogin: now,
        loginCount: 0,
        loginIPs: [],
        loginTimes: [],
        apiUsagePattern: {},
        failedLoginCount: 0
      };
      this.userMetrics.set(userId, metrics);
    }
    
    // Update metrics
    if (success) {
      metrics.lastLogin = now;
      metrics.loginCount++;
      metrics.failedLoginCount = 0; // Reset on successful login
      
      // Add login time to pattern
      metrics.loginTimes.push(hour);
      if (metrics.loginTimes.length > 100) {
        metrics.loginTimes.shift(); // Keep last 100 login times
      }
      
      // Add IP to pattern
      if (!metrics.loginIPs.includes(ip)) {
        metrics.loginIPs.push(ip);
        // Keep last 10 IPs
        if (metrics.loginIPs.length > 10) {
          metrics.loginIPs.shift();
        }
      }
    } else {
      metrics.failedLoginCount++;
    }
    
    // Check for anomalies
    const anomalies = [];
    
    // Too many failed logins
    if (metrics.failedLoginCount >= THRESHOLDS.MAX_FAILED_LOGINS) {
      anomalies.push('Excessive failed login attempts');
    }
    
    // Login from unusual time
    if (metrics.loginTimes.length >= 10) {
      // Calculate hour frequency
      const hourFrequency = Array(24).fill(0);
      metrics.loginTimes.forEach(h => hourFrequency[h]++);
      
      // Find most common login hours
      const commonHours = hourFrequency
        .map((count, hour) => ({ hour, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map(x => x.hour);
      
      // Check if current hour is unusual
      const isUnusualTime = !commonHours.some(h => 
        Math.abs(h - hour) <= THRESHOLDS.SUSPICIOUS_TIME_WINDOW ||
        Math.abs(h - hour - 24) <= THRESHOLDS.SUSPICIOUS_TIME_WINDOW
      );
      
      if (isUnusualTime) {
        anomalies.push('Login at unusual time');
      }
    }
    
    // Too many different IPs in short time
    const last24hIPs = new Set(metrics.loginIPs.slice(-THRESHOLDS.MAX_IP_COUNT));
    if (last24hIPs.size >= THRESHOLDS.MAX_IP_COUNT) {
      anomalies.push('Multiple different IP addresses');
    }
    
    const isAnomaly = anomalies.length > 0;
    
    // Report anomaly
    if (isAnomaly) {
      await api.post('/api/security/anomaly', {
        type: 'auth',
        userId,
        ip,
        timestamp: now.toISOString(),
        reasons: anomalies,
        metrics: {
          failedLoginCount: metrics.failedLoginCount,
          uniqueIPs: Array.from(last24hIPs)
        }
      }, { requiresAuth: false });
    }
    
    return {
      isAnomaly,
      reason: anomalies.join(', ')
    };
  }
  
  // Track API usage and detect anomalies
  async trackApiUsage(userId: string, endpoint: string, method: string): Promise<{
    isAnomaly: boolean;
    reason?: string;
  }> {
    // Implementation similar to trackLogin
    // ...
    
    return { isAnomaly: false };
  }
}

export const anomalyDetector = new AnomalyDetector();
```

### 3.3 Alerting System

**Objective**: Set up proactive alerting for security-related events.

**Tasks**:
- [ ] Configure SNS topics for security alerts
- [ ] Set up CloudWatch alarms for critical security metrics
- [ ] Implement Slack/Teams integration for alerts
- [ ] Create email notification system for security events
- [ ] Develop alert escalation process

**Implementation Plan**:
```bash
# Create SNS topics for different alert levels
aws sns create-topic --name security-critical-alerts
aws sns create-topic --name security-warning-alerts
aws sns create-topic --name security-info-alerts

# Set up CloudWatch alarms for critical metrics
aws cloudwatch put-metric-alarm \
  --alarm-name HighFailedLoginRate \
  --metric-name AuthFailureCount \
  --namespace PropIEApp \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1 \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:security-critical-alerts

aws cloudwatch put-metric-alarm \
  --alarm-name UnusualAPIAccessPatterns \
  --metric-name AnomalyDetectionCount \
  --namespace PropIEApp \
  --statistic Sum \
  --period 300 \
  --threshold 5 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1 \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:security-warning-alerts
```

```typescript
// src/lib/alerting/security-alerts.ts
import { SNS } from 'aws-sdk';
import { config } from '@/config';

const sns = new SNS({
  region: config.aws.region
});

export enum AlertLevel {
  INFO = 'info',
  WARNING = 'warning',
  CRITICAL = 'critical'
}

export interface SecurityAlert {
  level: AlertLevel;
  title: string;
  message: string;
  userId?: string;
  resourceId?: string;
  sourceIP?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export async function sendSecurityAlert(alert: SecurityAlert): Promise<void> {
  const topicArn = (() => {
    switch (alert.level) {
      case AlertLevel.CRITICAL:
        return config.alerting.criticalAlertTopicArn;
      case AlertLevel.WARNING:
        return config.alerting.warningAlertTopicArn;
      case AlertLevel.INFO:
      default:
        return config.alerting.infoAlertTopicArn;
    }
  })();
  
  await sns.publish({
    TopicArn: topicArn,
    Subject: `[${config.environment.toUpperCase()}] ${alert.level.toUpperCase()}: ${alert.title}`,
    Message: JSON.stringify(alert, null, 2)
  }).promise();
}
```

## 4. Authentication Enhancements

### 4.1 Multi-factor Authentication

**Objective**: Add MFA support to the authentication flow.

**Tasks**:
- [ ] Configure Cognito for MFA
- [ ] Implement TOTP support
- [ ] Create MFA enrollment flow
- [ ] Develop MFA reset process
- [ ] Add MFA bypass protection

**Implementation Plan**:
```typescript
// src/lib/auth/mfa.ts
import { Auth } from 'aws-amplify';
import { z } from 'zod';

// MFA setup schema
const mfaSetupSchema = z.object({
  userId: z.string(),
  preferredMFA: z.enum(['TOTP', 'SMS']),
  phoneNumber: z.string().optional(),
});

type MFASetupParams = z.infer<typeof mfaSetupSchema>;

export interface TOTPSetupResult {
  secretCode: string;
  qrCodeUrl: string;
}

export async function setupMFA(params: MFASetupParams): Promise<TOTPSetupResult | { success: boolean }> {
  try {
    // Validate input
    mfaSetupSchema.parse(params);
    
    // Get current user
    const user = await Auth.currentAuthenticatedUser();
    
    if (params.preferredMFA === 'TOTP') {
      // Set up TOTP
      const totpSetup = await Auth.setupTOTP(user);
      return {
        secretCode: totpSetup.secretKey,
        qrCodeUrl: `otpauth://totp/PropIE:${user.username}?secret=${totpSetup.secretKey}&issuer=PropIE`
      };
    } else if (params.preferredMFA === 'SMS') {
      // Set up SMS
      if (!params.phoneNumber) {
        throw new Error('Phone number is required for SMS MFA');
      }
      
      await Auth.updateUserAttributes(user, {
        phone_number: params.phoneNumber
      });
      
      await Auth.setPreferredMFA(user, 'SMS');
      return { success: true };
    }
    
    throw new Error('Unsupported MFA type');
  } catch (error) {
    console.error('MFA setup error:', error);
    throw error;
  }
}

export async function verifyTOTP(code: string): Promise<boolean> {
  try {
    const user = await Auth.currentAuthenticatedUser();
    await Auth.verifyTotpToken(user, code);
    await Auth.setPreferredMFA(user, 'TOTP');
    return true;
  } catch (error) {
    console.error('TOTP verification error:', error);
    return false;
  }
}

export async function resetMFA(userId: string): Promise<boolean> {
  try {
    // This would typically be an admin operation
    // In Cognito, this would be done via AdminSetUserMFAPreference
    // For this example, we'll use a custom API endpoint
    
    const result = await fetch('/api/admin/reset-mfa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
    });
    
    return result.ok;
  } catch (error) {
    console.error('MFA reset error:', error);
    return false;
  }
}
```

### 4.2 OAuth Extensions

**Objective**: Implement additional OAuth providers for authentication.

**Tasks**:
- [ ] Configure Google OAuth integration
- [ ] Set up Microsoft/Azure AD integration
- [ ] Implement Apple Sign In
- [ ] Create unified social login interface
- [ ] Develop account linking system

**Implementation Plan**:
```typescript
// src/lib/auth/oauth-providers.ts
import { Auth } from 'aws-amplify';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import { authService } from '@/lib/auth';

export enum OAuthProvider {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  AMAZON = 'amazon',
  APPLE = 'apple',
  MICROSOFT = 'microsoft'
}

interface OAuthConfig {
  provider: OAuthProvider;
  scopes?: string[];
  redirectSignIn?: string;
  redirectSignOut?: string;
}

// Map our providers to Amplify's providers
const providerMap: Record<OAuthProvider, CognitoHostedUIIdentityProvider> = {
  [OAuthProvider.GOOGLE]: CognitoHostedUIIdentityProvider.Google,
  [OAuthProvider.FACEBOOK]: CognitoHostedUIIdentityProvider.Facebook,
  [OAuthProvider.AMAZON]: CognitoHostedUIIdentityProvider.Amazon,
  [OAuthProvider.APPLE]: 'SignInWithApple' as CognitoHostedUIIdentityProvider,
  [OAuthProvider.MICROSOFT]: 'Microsoft' as CognitoHostedUIIdentityProvider
};

export async function signInWithOAuth(config: OAuthConfig): Promise<void> {
  // Ensure the provider is valid
  if (!Object.values(OAuthProvider).includes(config.provider)) {
    throw new Error(`Unsupported OAuth provider: ${config.provider}`);
  }
  
  const cognitoProvider = providerMap[config.provider];
  
  try {
    await Auth.federatedSignIn({
      provider: cognitoProvider,
      customState: JSON.stringify({
        redirectUrl: config.redirectSignIn || window.location.origin
      })
    });
  } catch (error) {
    console.error('OAuth sign-in error:', error);
    throw error;
  }
}

export async function linkOAuthProvider(provider: OAuthProvider): Promise<boolean> {
  try {
    // This functionality requires custom implementation with Cognito
    // as Amplify doesn't directly support account linking
    
    // Get current user
    const user = await authService.getCurrentUser();
    
    if (!user) {
      throw new Error('User must be authenticated to link accounts');
    }
    
    // Use a custom API to handle the account linking
    const response = await fetch('/api/auth/link-provider', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        provider,
        userId: user.id
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to initiate account linking');
    }
    
    const { authUrl } = await response.json();
    
    // Redirect to the auth URL
    window.location.href = authUrl;
    
    return true;
  } catch (error) {
    console.error('Error linking OAuth provider:', error);
    return false;
  }
}
```

### 4.3 Session Management

**Objective**: Enhance session timeout and refresh mechanisms.

**Tasks**:
- [ ] Implement session timeout detection
- [ ] Create token refresh mechanism
- [ ] Develop session activity tracking
- [ ] Set up concurrent session handling
- [ ] Implement session revocation system

**Implementation Plan**:
```typescript
// src/lib/auth/session-manager.ts
import { authService } from '@/lib/auth';
import { Auth } from 'aws-amplify';
import { BehaviorSubject } from 'rxjs';

interface SessionState {
  isActive: boolean;
  lastActivity: number;
  expiresAt: number;
  refreshToken?: string;
}

export class SessionManager {
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private readonly ACTIVITY_EVENTS = ['click', 'mousemove', 'keypress', 'scroll', 'touchstart'];
  private readonly WARNING_THRESHOLD = 5 * 60 * 1000; // 5 minutes
  
  private sessionState$ = new BehaviorSubject<SessionState>({
    isActive: false,
    lastActivity: Date.now(),
    expiresAt: Date.now() + this.SESSION_TIMEOUT
  });
  
  private activityTimeout: NodeJS.Timeout | null = null;
  private refreshInterval: NodeJS.Timeout | null = null;
  private warningTimeout: NodeJS.Timeout | null = null;
  
  constructor(private onSessionExpired: () => void, private onSessionWarning: () => void) {}
  
  // Initialize the session manager
  public init(): void {
    if (typeof window === 'undefined') return;
    
    // Set up activity listeners
    this.ACTIVITY_EVENTS.forEach(event => {
      window.addEventListener(event, this.handleUserActivity);
    });
    
    // Check if already authenticated
    Auth.currentSession()
      .then(session => {
        const idToken = session.getIdToken();
        const expiration = idToken.getExpiration() * 1000; // Convert to ms
        
        this.sessionState$.next({
          isActive: true,
          lastActivity: Date.now(),
          expiresAt: expiration,
          refreshToken: session.getRefreshToken().getToken()
        });
        
        this.startSessionTimer();
        this.startTokenRefresh();
      })
      .catch(() => {
        // Not authenticated, do nothing
      });
    
    // Subscribe to auth changes
    authService.onAuthStateChanged((user) => {
      if (user) {
        this.sessionState$.next({
          ...this.sessionState$.value,
          isActive: true,
          lastActivity: Date.now()
        });
        
        this.startSessionTimer();
        this.startTokenRefresh();
      } else {
        this.sessionState$.next({
          isActive: false,
          lastActivity: Date.now(),
          expiresAt: Date.now()
        });
        
        this.stopSessionTimer();
        this.stopTokenRefresh();
      }
    });
  }
  
  // Handle user activity
  private handleUserActivity = (): void => {
    const currentState = this.sessionState$.value;
    
    if (currentState.isActive) {
      this.sessionState$.next({
        ...currentState,
        lastActivity: Date.now(),
        expiresAt: Date.now() + this.SESSION_TIMEOUT
      });
      
      // Reset warning
      if (this.warningTimeout) {
        clearTimeout(this.warningTimeout);
        this.warningTimeout = null;
      }
      
      // Set new warning timeout
      const timeToWarning = this.SESSION_TIMEOUT - this.WARNING_THRESHOLD;
      this.warningTimeout = setTimeout(this.handleSessionWarning, timeToWarning);
    }
  };
  
  // Handle session timeout warning
  private handleSessionWarning = (): void => {
    this.onSessionWarning();
  };
  
  // Start session timer
  private startSessionTimer(): void {
    this.stopSessionTimer();
    
    const currentState = this.sessionState$.value;
    const timeToExpiry = Math.max(0, currentState.expiresAt - Date.now());
    
    this.activityTimeout = setTimeout(() => {
      this.handleSessionExpired();
    }, timeToExpiry);
    
    // Set warning timeout
    const timeToWarning = Math.max(0, timeToExpiry - this.WARNING_THRESHOLD);
    this.warningTimeout = setTimeout(this.handleSessionWarning, timeToWarning);
  }
  
  // Stop session timer
  private stopSessionTimer(): void {
    if (this.activityTimeout) {
      clearTimeout(this.activityTimeout);
      this.activityTimeout = null;
    }
    
    if (this.warningTimeout) {
      clearTimeout(this.warningTimeout);
      this.warningTimeout = null;
    }
  }
  
  // Handle session expiration
  private handleSessionExpired(): void {
    this.sessionState$.next({
      isActive: false,
      lastActivity: Date.now(),
      expiresAt: Date.now()
    });
    
    this.stopSessionTimer();
    this.stopTokenRefresh();
    
    // Notify caller
    this.onSessionExpired();
  }
  
  // Start token refresh timer
  private startTokenRefresh(): void {
    this.stopTokenRefresh();
    
    // Refresh tokens every 45 minutes
    this.refreshInterval = setInterval(async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        const currentSession = await Auth.currentSession();
        
        // Refresh the session
        await Auth.refreshSession(currentSession.getRefreshToken());
        
        // Get the new session
        const newSession = await Auth.currentSession();
        const idToken = newSession.getIdToken();
        const expiration = idToken.getExpiration() * 1000; // Convert to ms
        
        this.sessionState$.next({
          isActive: true,
          lastActivity: Date.now(),
          expiresAt: expiration,
          refreshToken: newSession.getRefreshToken().getToken()
        });
      } catch (error) {
        console.error('Failed to refresh token:', error);
        // If refresh fails, expire the session
        this.handleSessionExpired();
      }
    }, 45 * 60 * 1000); // 45 minutes
  }
  
  // Stop token refresh timer
  private stopTokenRefresh(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }
  
  // Get current session state
  public getSessionState(): SessionState {
    return this.sessionState$.value;
  }
  
  // Subscribe to session state changes
  public onSessionStateChanged(callback: (state: SessionState) => void): () => void {
    const subscription = this.sessionState$.subscribe(callback);
    return () => subscription.unsubscribe();
  }
  
  // Extend the current session
  public extendSession(): void {
    if (this.sessionState$.value.isActive) {
      this.handleUserActivity();
    }
  }
  
  // Explicitly end the session
  public endSession(): void {
    authService.logout();
  }
  
  // Clean up resources
  public destroy(): void {
    if (typeof window === 'undefined') return;
    
    this.ACTIVITY_EVENTS.forEach(event => {
      window.removeEventListener(event, this.handleUserActivity);
    });
    
    this.stopSessionTimer();
    this.stopTokenRefresh();
  }
}

// Create a singleton instance
export const sessionManager = new SessionManager(
  // Session expired handler
  () => {
    // Show session expired modal
    // ...
    
    // Redirect to login
    window.location.href = '/login?expired=true';
  },
  // Session warning handler
  () => {
    // Show session expiring warning
    // ...
  }
);
```

## 5. Security Documentation & Training

### 5.1 Security Runbook

**Objective**: Create incident response procedures for common security scenarios.

**Tasks**:
- [ ] Develop security incident classification system
- [ ] Create step-by-step response procedures
- [ ] Define roles and responsibilities
- [ ] Implement post-incident review process
- [ ] Set up tabletop exercise schedule

**Implementation Plan**:
Create `docs/security/incident-response/` directory with the following files:

```markdown
# Security Incident Response Runbook

## Incident Classification

| Level | Description | Examples | Response Time | Notification |
|-------|-------------|----------|--------------|--------------|
| P1    | Critical security incident with active threat or data breach | Active intrusion, data exfiltration, account takeover | Immediate | Executive team, security team |
| P2    | High severity issue with potential for harm | Credential leak, suspicious admin access | < 1 hour | Security team, relevant leads |
| P3    | Medium severity issue requiring investigation | Unusual login patterns, API abuse | < 4 hours | Security team |
| P4    | Low severity issue | Security misconfiguration, minor policy violation | < 24 hours | Security team |

## Response Procedures

### P1: Critical Security Incident

#### Account Takeover Response

1. **Immediate Actions (0-15 minutes)**
   - Isolate affected accounts by forcing logout and suspending access
   - Revoke all active sessions for the user
   - Disable API keys and tokens associated with the account
   - Document initial findings including account details, attack vector, and timeline

2. **Investigation (15-60 minutes)**
   - Review authentication logs to identify access patterns
   - Check for additional affected accounts with similar patterns
   - Identify changes made by the attacker
   - Determine method of compromise

3. **Containment (1-2 hours)**
   - Reset credentials for all potentially affected accounts
   - Add suspicious IPs to blocklist
   - Verify MFA settings for sensitive accounts
   - Revoke and reissue access tokens

4. **Eradication (2-4 hours)**
   - Revert any changes made by the attacker
   - Remove any backdoors or persistent access
   - Ensure all compromised credentials have been changed
   - Verify system integrity

5. **Recovery (4-24 hours)**
   - Restore accounts to legitimate users with new credentials
   - Implement additional monitoring for affected accounts
   - Update security controls to prevent similar attacks

6. **Post-Incident**
   - Conduct thorough review of the incident
   - Document lessons learned
   - Update security controls and procedures
   - Provide training for affected users

### P2: Data Access Violation

// Similar structure to above
...

## Roles and Responsibilities

| Role | Responsibilities | Team Members |
|------|------------------|--------------|
| Incident Commander | Overall coordination, communication with management | [Names] |
| Technical Lead | Technical investigation and containment | [Names] |
| Communications Lead | User and stakeholder communications | [Names] |
| Legal/Compliance | Regulatory reporting, legal guidance | [Names] |

## Communication Templates

### Initial Notification Template

```
[SECURITY INCIDENT NOTIFICATION]
Severity: [P1/P2/P3/P4]
Time Detected: [DATETIME]
Incident ID: [INC-ID]

Brief Description:
[1-2 sentence description of the incident]

Current Status:
[Detection/Investigation/Containment/Eradication/Recovery]

Immediate Actions Taken:
- [Action 1]
- [Action 2]

Next Steps:
- [Step 1]
- [Step 2]

Contact: [Incident Commander Name and Contact Info]
```

### Post-Incident Review Template

```
[SECURITY INCIDENT POST-MORTEM]
Incident ID: [INC-ID]
Severity: [P1/P2/P3/P4]
Duration: [Start time] to [End time]

Summary:
[Brief description of what happened]

Timeline:
- [Time]: [Event]
- [Time]: [Event]

Root Cause:
[Description of the root cause]

Impact:
- [Impact 1]
- [Impact 2]

What Went Well:
- [Item 1]
- [Item 2]

What Went Poorly:
- [Item 1]
- [Item 2]

Action Items:
- [ ] [Action 1] - [Owner] - [Due Date]
- [ ] [Action 2] - [Owner] - [Due Date]

Lessons Learned:
[Key takeaways and lessons learned]
```
```

### 5.2 Developer Security Guidelines

**Objective**: Document security best practices for frontend development.

**Tasks**:
- [ ] Create frontend security checklist
- [ ] Develop API security usage guide
- [ ] Document authentication best practices
- [ ] Create secure coding patterns guide
- [ ] Implement security review checklist

**Implementation Plan**:
Create `docs/security/guidelines/` directory with the following files:

```markdown
# Frontend Security Guidelines

## Authentication & Authorization

### DO:
- ✅ Always use the unified auth service from `@/lib/auth`
- ✅ Include proper error handling for auth failures
- ✅ Use role-based checks for UI elements and routes
- ✅ Implement session timeout handling
- ✅ Use secure password inputs with proper validation
- ✅ Follow the principle of least privilege

### DON'T:
- ❌ Store sensitive information in localStorage or sessionStorage
- ❌ Include hard-coded credentials in the codebase
- ❌ Create custom authentication logic
- ❌ Disable security features like CSRF protection
- ❌ Set excessively long session timeouts

## API Security

### DO:
- ✅ Use the unified API client from `@/lib/api-client`
- ✅ Validate all user inputs before sending to the API
- ✅ Use TypeScript types for API requests and responses
- ✅ Implement proper error handling
- ✅ Use query parameters for filtering, not SQL/NoSQL queries

### DON'T:
- ❌ Create direct fetch/axios calls bypassing the API client
- ❌ Send unvalidated user input to the API
- ❌ Expose API keys in client-side code
- ❌ Implement custom CSRF protection
- ❌ Use string concatenation for building API URLs

## XSS Prevention

### DO:
- ✅ Use framework-provided escaping mechanisms
- ✅ Sanitize any HTML content with `@/lib/security/sanitize`
- ✅ Use Content Security Policy headers
- ✅ Validate user input on both client and server
- ✅ Use dedicated UI components for user-generated content

### DON'T:
- ❌ Use `dangerouslySetInnerHTML` without sanitization
- ❌ Directly insert user input into the DOM
- ❌ Use `eval()` or `Function()` constructors
- ❌ Create URLs with `javascript:` protocol
- ❌ Use outdated ReactDOM/DOM APIs for direct manipulation

## URL & Redirect Safety

### DO:
- ✅ Use `@/lib/security/urlSafetyCheck` for external URLs
- ✅ Validate all redirect URLs
- ✅ Use relative URLs for internal navigation
- ✅ Implement proper URL encoding/decoding
- ✅ Use router-provided navigation methods

### DON'T:
- ❌ Redirect to unvalidated URLs
- ❌ Accept URL parameters without validation
- ❌ Use `window.location` directly
- ❌ Open external links without proper attributes
- ❌ Create URLs from user input without validation

## Data Handling

### DO:
- ✅ Minimize sensitive data in client-side state
- ✅ Use secure forms with proper validation
- ✅ Implement proper form security attributes
- ✅ Use HTTPS for all requests
- ✅ Clear sensitive data when no longer needed

### DON'T:
- ❌ Log sensitive data to the console
- ❌ Store sensitive data in client-side storage
- ❌ Send sensitive data in URL parameters
- ❌ Cache sensitive API responses
- ❌ Include sensitive data in error reports

## Security Testing

### DO:
- ✅ Use automated security scanning in CI/CD
- ✅ Implement security-focused unit tests
- ✅ Test authentication and authorization workflows
- ✅ Validate input handling
- ✅ Test error handling paths

### DON'T:
- ❌ Skip security testing for UI components
- ❌ Ignore security warnings from linters
- ❌ Disable security checks in test code
- ❌ Use production credentials in tests
- ❌ Commit test credentials to the repository
```

```markdown
# Secure Coding Patterns

## Authentication Patterns

### Protected Routes

```tsx
import { useAuth } from '@/components/AuthProvider';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = ({ requiredRoles = [] }) => {
  const { user, isAuthenticated, hasPermission } = useAuth();
  
  // Check if the user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if the user has the required role
  if (requiredRoles.length > 0 && !requiredRoles.some(role => hasPermission(role))) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <Outlet />;
};
```

### Auth Guard Component

```tsx
import React from 'react';
import { useAuth } from '@/components/AuthProvider';

interface AuthGuardProps {
  requiredPermission?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  requiredPermission,
  children,
  fallback = null
}) => {
  const { hasPermission } = useAuth();
  
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

// Usage
function AdminPanel() {
  return (
    <AuthGuard 
      requiredPermission="admin" 
      fallback={<p>You don't have permission to view this panel.</p>}
    >
      <div>Admin content here</div>
    </AuthGuard>
  );
}
```

## API Request Patterns

### Data Fetching with React Query

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { ApiError } from '@/lib/api-client';

// Type definitions
interface User {
  id: string;
  name: string;
  email: string;
}

// Query hook
export function useUsers() {
  return useQuery<User[], ApiError>({
    queryKey: ['users'],
    queryFn: () => api.get('/api/users'),
    retry: (failureCount, error) => {
      // Don't retry on 401, 403, 404
      if (error.statusCode === 401 || error.statusCode === 403 || error.statusCode === 404) {
        return false;
      }
      // Retry other errors up to 3 times
      return failureCount < 3;
    }
  });
}

// Mutation hook
export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation<
    User,               // Response type
    ApiError,           // Error type
    Omit<User, 'id'>    // Variables type
  >({
    mutationFn: (newUser) => api.post('/api/users', newUser),
    onSuccess: () => {
      // Invalidate the users query to refetch
      queryClient.invalidateQueries(['users']);
    },
  });
}

// Component usage
function UserList() {
  const { data: users, isLoading, error } = useUsers();
  const createUser = useCreateUser();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (error) {
    return (
      <div>
        <p>Error loading users: {error.message}</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }
  
  return (
    <div>
      <ul>
        {users?.map(user => (
          <li key={user.id}>{user.name} ({user.email})</li>
        ))}
      </ul>
      
      <button 
        onClick={() => createUser.mutate({ name: 'New User', email: 'new@example.com' })}
        disabled={createUser.isLoading}
      >
        {createUser.isLoading ? 'Adding...' : 'Add User'}
      </button>
      
      {createUser.isError && (
        <p>Error creating user: {createUser.error.message}</p>
      )}
    </div>
  );
}
```

### API Service Pattern

```typescript
// src/services/userService.ts
import { api } from '@/lib/api-client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  role: string;
}

export const userService = {
  getUsers: () => api.get<User[]>('/api/users'),
  getUser: (id: string) => api.get<User>(`/api/users/${id}`),
  createUser: (data: CreateUserRequest) => api.post<User>('/api/users', data),
  updateUser: (id: string, data: Partial<CreateUserRequest>) => api.put<User>(`/api/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/api/users/${id}`)
};
```

## Form Handling Patterns

### Secure Form Pattern

```tsx
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Define schema with Zod
const userSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
    .regex(/[a-z]/, 'Password must include at least one lowercase letter')
    .regex(/[0-9]/, 'Password must include at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must include at least one special character'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword']
});

type UserFormData = z.infer<typeof userSchema>;

function UserForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema)
  });
  
  const onSubmit = async (data: UserFormData) => {
    try {
      // Process form data
      await api.post('/api/users', {
        name: data.name,
        email: data.email,
        password: data.password
      });
      
      // Handle success
    } catch (error) {
      // Handle error
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          {...register('name')}
          aria-invalid={errors.name ? 'true' : 'false'}
        />
        {errors.name && <p role="alert">{errors.name.message}</p>}
      </div>
      
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register('email')}
          aria-invalid={errors.email ? 'true' : 'false'}
        />
        {errors.email && <p role="alert">{errors.email.message}</p>}
      </div>
      
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...register('password')}
          aria-invalid={errors.password ? 'true' : 'false'}
          autoComplete="new-password"
        />
        {errors.password && <p role="alert">{errors.password.message}</p>}
      </div>
      
      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword')}
          aria-invalid={errors.confirmPassword ? 'true' : 'false'}
          autoComplete="new-password"
        />
        {errors.confirmPassword && <p role="alert">{errors.confirmPassword.message}</p>}
      </div>
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

## Error Handling Patterns

### API Error Boundary

```tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ApiError } from '@/lib/api-client';

interface ApiErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: ApiError, reset: () => void) => ReactNode;
  onError?: (error: ApiError, errorInfo: ErrorInfo) => void;
}

interface ApiErrorBoundaryState {
  error: ApiError | null;
  hasError: boolean;
}

export class ApiErrorBoundary extends Component<ApiErrorBoundaryProps, ApiErrorBoundaryState> {
  constructor(props: ApiErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
    this.resetError = this.resetError.bind(this);
  }

  static getDerivedStateFromError(error: unknown): ApiErrorBoundaryState {
    // Only handle ApiError instances
    if (error instanceof ApiError) {
      return { hasError: true, error };
    }
    
    // Re-throw other errors
    throw error;
  }

  componentDidCatch(error: unknown, errorInfo: ErrorInfo): void {
    if (error instanceof ApiError && this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }
  
  resetError(): void {
    this.setState({ hasError: false, error: null });
  }

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }
      
      // Default fallback UI
      return (
        <div className="error-boundary">
          <h2>Something went wrong with API request</h2>
          <p>{this.state.error.message}</p>
          <p>Status code: {this.state.error.statusCode}</p>
          <button onClick={this.resetError}>Try again</button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Security Components

### Safe Link Component

```tsx
import React from 'react';
import { isUrlSafe } from '@/lib/security/urlSafetyCheck';
import Link from 'next/link';

interface SafeLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  onError?: (reason: string) => void;
}

export const SafeLink: React.FC<SafeLinkProps> = ({
  href,
  children,
  className,
  target,
  rel,
  onClick,
  onError
}) => {
  // Check if URL is safe
  const safetyCheck = isUrlSafe(href);
  
  if (!safetyCheck.isSafe) {
    // Handle unsafe URL
    console.warn(`Unsafe URL blocked: ${safetyCheck.reason}`);
    
    if (onError) {
      onError(safetyCheck.reason || 'Unsafe URL');
    }
    
    // Render a span instead of a link
    return (
      <span className={className}>
        {children}
        <span className="sr-only">(unsafe link)</span>
      </span>
    );
  }
  
  // For external links, ensure proper security attributes
  const isExternal = !href.startsWith('/') && !href.startsWith('#');
  
  if (isExternal) {
    // Always open external links in a new tab with security attributes
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer nofollow"
        onClick={onClick}
      >
        {children}
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    );
  }
  
  // For internal links, use Next.js Link component
  return (
    <Link
      href={href}
      className={className}
      target={target}
      rel={rel}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};
```
```

### 5.3 Security Review Process

**Objective**: Establish a process for security reviews of new features.

**Tasks**:
- [ ] Define security review process
- [ ] Create security review checklist
- [ ] Establish security approval gate for releases
- [ ] Implement automated security checks
- [ ] Develop security review documentation templates

**Implementation Plan**:
Create `docs/security/review-process/` directory with the following files:

```markdown
# Security Review Process

## Overview

This document defines the security review process for new features and changes to the Prop IE AWS application. Every significant feature or change that affects security-sensitive areas must undergo a security review before deployment to production.

## When is a Security Review Required?

A security review is required for changes that:

1. Modify authentication or authorization mechanisms
2. Introduce new API endpoints
3. Handle sensitive data (PII, financial information, etc.)
4. Change infrastructure or deployment configuration
5. Modify security headers or CSP policies
6. Integrate with external services
7. Implement new file upload/download functionality
8. Add or modify payment processing features

## Security Review Workflow

### 1. Planning Phase

**Responsibility**: Feature owner

- Complete the Security Impact Assessment template
- Identify potential security implications
- Document security requirements
- Share assessment with security reviewer

### 2. Design Review

**Responsibility**: Security reviewer and feature owner

- Review security architecture and design
- Identify potential security issues
- Provide security recommendations
- Document design decisions

### 3. Implementation Phase

**Responsibility**: Developers

- Implement security controls
- Follow secure coding guidelines
- Use approved libraries and components
- Document security-related changes

### 4. Code Review

**Responsibility**: Security reviewer

- Review code changes for security issues
- Verify security controls implementation
- Provide feedback on security improvements
- Approve or reject security-related changes

### 5. Testing Phase

**Responsibility**: QA and security team

- Execute security-focused test cases
- Verify security controls effectiveness
- Conduct penetration testing (if applicable)
- Document security testing results

### 6. Final Approval

**Responsibility**: Security reviewer

- Review all security documentation
- Verify all security issues have been addressed
- Provide final security approval
- Document any accepted risks

### 7. Post-Deployment Monitoring

**Responsibility**: Operations and security team

- Monitor for security-related issues
- Verify security controls in production
- Document any security observations
- Address any security concerns promptly

## Security Review Checklist

### Authentication & Authorization

- [ ] Authentication mechanisms follow approved standards
- [ ] Authorization checks are properly implemented
- [ ] Session management follows best practices
- [ ] Sensitive operations require additional verification
- [ ] Role-based access control is correctly implemented
- [ ] Token handling follows security best practices

### API Security

- [ ] Input validation is thorough and properly implemented
- [ ] Output encoding is applied where necessary
- [ ] API endpoints have appropriate authorization checks
- [ ] Rate limiting is implemented for sensitive operations
- [ ] Error handling does not leak sensitive information
- [ ] API security headers are properly configured

### Data Protection

- [ ] Sensitive data is properly encrypted at rest
- [ ] Sensitive data is protected in transit
- [ ] Data access logs are maintained
- [ ] Data retention policies are followed
- [ ] Data is validated before processing
- [ ] PII handling complies with regulations

### Infrastructure Security

- [ ] Infrastructure changes follow least privilege principle
- [ ] Security groups and network ACLs are properly configured
- [ ] Logging and monitoring are configured correctly
- [ ] Secrets management is properly implemented
- [ ] Backup and recovery procedures are updated
- [ ] Infrastructure as code is securely configured

### Frontend Security

- [ ] CSP policies are properly configured
- [ ] XSS protections are implemented
- [ ] CSRF protections are in place
- [ ] Secure cookie flags are set correctly
- [ ] Client-side security controls work as expected
- [ ] URL validation is properly implemented

## Security Impact Assessment Template

```
# Security Impact Assessment

## Feature Information
- **Feature Name**: [Name]
- **JIRA/GitHub Issue**: [Link]
- **Feature Owner**: [Name]
- **Security Reviewer**: [Name]
- **Target Release Date**: [Date]

## Feature Description
[Brief description of the feature]

## Security Impact Areas
- **Authentication/Authorization**: [Yes/No] [If yes, describe]
- **Data Processing**: [Yes/No] [If yes, describe]
- **API Endpoints**: [Yes/No] [If yes, describe]
- **Infrastructure Changes**: [Yes/No] [If yes, describe]
- **External Integrations**: [Yes/No] [If yes, describe]
- **User Permissions**: [Yes/No] [If yes, describe]

## Security Considerations

### Authentication & Authorization
[Describe how the feature handles authentication and authorization]

### Data Handling
[Describe what data the feature processes and how it's protected]

### API Security
[Describe API endpoints, input validation, and security controls]

### Infrastructure Security
[Describe infrastructure changes and security implications]

### Compliance Requirements
[Describe any compliance requirements this feature must meet]

## Security Controls
[List the security controls implemented for this feature]

## Security Testing
[Describe how security testing will be performed]

## Risk Assessment
[List any identified risks and mitigation strategies]

## Additional Notes
[Any other security-related information]
```

## Security Review Report Template

```
# Security Review Report

## Feature Information
- **Feature Name**: [Name]
- **JIRA/GitHub Issue**: [Link]
- **Feature Owner**: [Name]
- **Security Reviewer**: [Name]
- **Review Date**: [Date]

## Review Summary
[Brief summary of the security review findings]

## Security Findings

### High Priority Issues
- [Issue 1]
  - **Description**: [Description]
  - **Impact**: [Impact]
  - **Remediation**: [Remediation steps]
  - **Status**: [Open/Fixed/Mitigated]

### Medium Priority Issues
- [Issue 1]
  - **Description**: [Description]
  - **Impact**: [Impact]
  - **Remediation**: [Remediation steps]
  - **Status**: [Open/Fixed/Mitigated]

### Low Priority Issues
- [Issue 1]
  - **Description**: [Description]
  - **Impact**: [Impact]
  - **Remediation**: [Remediation steps]
  - **Status**: [Open/Fixed/Mitigated]

## Security Controls Review
[Assessment of the implemented security controls]

## Security Testing Results
[Summary of security testing results]

## Recommendations
[Security recommendations]

## Final Assessment
[Overall security assessment and approval status]

## Accepted Risks
[List of accepted risks, if any]

## Reviewer Sign-off
[ ] All high-priority issues have been addressed
[ ] All medium-priority issues have been addressed or accepted
[ ] Security testing has been completed
[ ] Security documentation is complete

Approved by: [Name]
Date: [Date]
```
```

By implementing this roadmap, you'll build upon the core architectural remediation work already completed, creating a more secure, robust, and maintainable application architecture with proper security controls, monitoring, and processes.