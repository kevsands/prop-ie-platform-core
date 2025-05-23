/**
 * Quick Security Fixes
 * Immediate actions to improve security posture
 */

import crypto from 'crypto';
import { NextResponse } from 'next/server';

/**
 * Generate cryptographically secure secrets
 */
export function generateSecureSecret(length: number = 32): string {
  return crypto.randomBytes(length).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0length);
}

/**
 * Generate secure environment configuration
 */
export function generateSecureEnvConfig() {
  return {
    NEXTAUTH_SECRET: generateSecureSecret(64),
    JWT_SECRET: generateSecureSecret(64),
    JWT_REFRESH_SECRET: generateSecureSecret(64),
    CSRF_SECRET: generateSecureSecret(32),
    ENCRYPTION_KEY: generateSecureSecret(32),
    DATABASE_ENCRYPTION_KEY: generateSecureSecret(32),
  };
}

/**
 * Apply security headers to all API responses
 */
export function withSecurityHeaders(handler: Function) {
  return async (request: Request, ...args: any[]) => {
    const response = await handler(request, ...args);

    // Apply security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    // Remove sensitive headers
    response.headers.delete('X-Powered-By');
    response.headers.delete('Server');

    return response;
  };
}

/**
 * Sanitize environment variables script
 */
export const sanitizeEnvScript = `
#!/bin/bash
# Quick script to update .env with secure values

# Backup current .env
cp .env .env.backup.$(date +%s)

# Generate new secrets
NEXTAUTH_SECRET=$(openssl rand -base64 64 | tr -d '\\n' | tr -d '=' | tr -d '+' | tr -d '/' | cut -c1-64)
JWT_SECRET=$(openssl rand -base64 64 | tr -d '\\n' | tr -d '=' | tr -d '+' | tr -d '/' | cut -c1-64)
JWT_REFRESH_SECRET=$(openssl rand -base64 64 | tr -d '\\n' | tr -d '=' | tr -d '+' | tr -d '/' | cut -c1-64)
CSRF_SECRET=$(openssl rand -base64 32 | tr -d '\\n' | tr -d '=' | tr -d '+' | tr -d '/' | cut -c1-32)
ENCRYPTION_KEY=$(openssl rand -base64 32 | tr -d '\\n' | tr -d '=' | tr -d '+' | tr -d '/' | cut -c1-32)

# Update .env file
sed -i.bak "s/NEXTAUTH_SECRET=.*/NEXTAUTH_SECRET=$NEXTAUTH_SECRET/" .env
sed -i.bak "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env
sed -i.bak "s/JWT_REFRESH_SECRET=.*/JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET/" .env
sed -i.bak "s/CSRF_SECRET=.*/CSRF_SECRET=$CSRF_SECRET/" .env
sed -i.bak "s/ENCRYPTION_KEY=.*/ENCRYPTION_KEY=$ENCRYPTION_KEY/" .env

echo "Secrets updated successfully. Old .env backed up with timestamp."
`;

/**
 * Remove hardcoded secrets from shell scripts
 */
export const cleanShellScripts = `
#!/bin/bash
# Remove hardcoded API keys from shell scripts

# List of files to clean
files=("claude-test.sh" "claude-focused-security.sh" "claude-review-auth.sh" "claude-code-quickstart.sh")

for file in "\${files[@]}"; do
  if [ -f "$file" ]; then
    # Backup original
    cp "$file" "$file.backup"

    # Replace hardcoded API key with environment variable
    sed -i 's/ANTHROPIC_API_KEY="sk-[^"]*"/ANTHROPIC_API_KEY="$ANTHROPIC_API_KEY"/' "$file"

    echo "Cleaned $file"
  fi
done

echo "Shell scripts cleaned. Add ANTHROPIC_API_KEY to your environment variables."
`;

/**
 * Session rotation middleware
 */
export async function rotateSession(session: any) {
  // Generate new session ID
  const newSessionId = crypto.randomBytes(32).toString('hex');

  // Copy session data to new session
  const newSession = {
    ...session,
    id: newSessionId,
    rotatedAt: new Date().toISOString(),
  };

  // Invalidate old session
  // TODO: Implement session store invalidation

  return newSession;
}

/**
 * IP-based session validation
 */
export function validateSessionIP(session: any, currentIP: string): boolean {
  if (!session.ipAddress) {
    // First access, store IP
    session.ipAddress = currentIP;
    return true;
  }

  // Check if IP matches
  if (session.ipAddress !== currentIP) {
    // Log suspicious activity

    // In production, you might want to be more lenient (e.g., allow same subnet)
    return false;
  }

  return true;
}

/**
 * Account lockout implementation
 */
const lockoutStore = new Map<string, { attempts: number; lockedUntil?: Date }>();

export function checkAccountLockout(identifier: string): { locked: boolean; remainingTime?: number } {
  const record = lockoutStore.get(identifier);

  if (!record) {
    return { locked: false };
  }

  if (record.lockedUntil && record.lockedUntil> new Date()) {
    const remainingTime = Math.ceil((record.lockedUntil.getTime() - Date.now()) / 1000);
    return { locked: true, remainingTime };
  }

  return { locked: false };
}

export function recordFailedAttempt(identifier: string) {
  const record = lockoutStore.get(identifier) || { attempts: 0 };
  record.attempts++;

  // Lock after 5 attempts
  if (record.attempts>= 5) {
    record.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  }

  lockoutStore.set(identifierrecord);
}

export function clearFailedAttempts(identifier: string) {
  lockoutStore.delete(identifier);
}

/**
 * GDPR consent banner HTML
 */
export const gdprConsentBanner = `
<div id="gdpr-consent-banner" style="
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #1a1a1a;
  color: white;
  padding: 20px;
  z-index: 9999;
  display: none;
">
  <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
    <div style="flex: 1;">
      <h3 style="margin: 0 0 10px 0;">We value your privacy</h3>
      <p style="margin: 0; opacity: 0.9;">
        We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
        By clicking "Accept All", you consent to our use of cookies. 
        <a href="/privacy-policy" style="color: #60a5fa; text-decoration: underline;">Learn more</a>
      </p>
    </div>
    <div style="display: flex; gap: 10px;">
      <button onclick="acceptAllCookies()" style="
        background: #3b82f6;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
      ">Accept All</button>
      <button onclick="rejectNonEssential()" style="
        background: transparent;
        color: white;
        border: 1px solid white;
        padding: 10px 20px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
      ">Reject Non-Essential</button>
      <button onclick="openCookieSettings()" style="
        background: transparent;
        color: white;
        border: 1px solid white;
        padding: 10px 20px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
      ">Cookie Settings</button>
    </div>
  </div>
</div>

<script>
// Check if consent already given
if (!localStorage.getItem('gdpr-consent')) {
  document.getElementById('gdpr-consent-banner').style.display = 'block';
}

function acceptAllCookies() {
  localStorage.setItem('gdpr-consent', JSON.stringify({
    essential: true,
    analytics: true,
    marketing: true,
    timestamp: new Date().toISOString()
  }));
  document.getElementById('gdpr-consent-banner').style.display = 'none';
}

function rejectNonEssential() {
  localStorage.setItem('gdpr-consent', JSON.stringify({
    essential: true,
    analytics: false,
    marketing: false,
    timestamp: new Date().toISOString()
  }));
  document.getElementById('gdpr-consent-banner').style.display = 'none';
}

function openCookieSettings() {
  window.location.href = '/cookie-settings';
}
</script>
`;

/**
 * Quick security audit script
 */
export const quickSecurityAudit = `
#!/bin/bash
echo "=== Quick Security Audit ==="
echo ""

# Check for exposed secrets
echo "Checking for exposed secrets..."
grep -r "sk-ant-api" . --exclude-dir=node_modules --exclude-dir=.git 2>/dev/null | grep -v ".backup"

# Check npm vulnerabilities
echo ""
echo "Checking npm vulnerabilities..."
npm audit --json | jq '.metadata.vulnerabilities'

# Check for console.log in production code
echo ""
echo "Checking for console.log statements..."
grep -r "console.log" src/ --include="*.ts" --include="*.tsx" | wc -l

# Check for TODO security items
echo ""
echo "Checking for security TODOs..."
grep -r "TODO.*security" src/ --include="*.ts" --include="*.tsx"

echo ""
echo "=== Audit Complete ==="
`;