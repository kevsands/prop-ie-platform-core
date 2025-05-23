#!/bin/bash

# Set API key directly in script (for testing only)
export ANTHROPIC_API_KEY="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"

echo "Running focused security review of auth components..."
echo "===================================================="

# Review all authentication related files
find src -type f \( -name "*.ts" -o -name "*.tsx" \) | grep -E 'auth|Auth' | \
xargs cat | \
claude -p "Perform a comprehensive security audit of these authentication-related files. 
Focus on:
1. Authentication vulnerabilities (JWT implementation, session management)
2. Authorization issues (role-based access, permission checks)
3. Sensitive data handling (tokens, credentials storage)
4. Input validation weaknesses
5. XSS/CSRF protections

Rate issues by severity (Critical/High/Medium/Low) and provide specific remediation steps for each issue."

echo ""
echo "Security review complete!"