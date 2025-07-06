#!/bin/bash

# ================================================================================
# PROP.ie Third-Party Services Setup Guide
# ================================================================================
# This script provides guidance for setting up third-party services
# These require manual setup through respective service providers
# ================================================================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Stripe Live Account Setup
setup_stripe() {
    log "🏦 Stripe Live Account Setup"
    echo ""
    echo "1. Create Stripe Live Account:"
    echo "   - Visit: https://dashboard.stripe.com/register"
    echo "   - Business Type: Technology/Software"
    echo "   - Industry: Real Estate/Property"
    echo "   - Business Location: Ireland"
    echo ""
    echo "2. Business Verification:"
    echo "   - Company Registration Number (CRO)"
    echo "   - VAT Number (if applicable)"
    echo "   - Bank Account Details"
    echo "   - Director/Officer Information"
    echo ""
    echo "3. Get Live API Keys:"
    echo "   - Navigate to: Developers > API Keys"
    echo "   - Copy Live Publishable Key (pk_live_...)"
    echo "   - Copy Live Secret Key (sk_live_...)"
    echo ""
    echo "4. Configure Webhooks:"
    echo "   - Webhook URL: https://prop.ie/api/webhooks/stripe"
    echo "   - Events to listen for:"
    echo "     * payment_intent.succeeded"
    echo "     * payment_intent.payment_failed"
    echo "     * invoice.payment_succeeded"
    echo "     * customer.subscription.created"
    echo "     * customer.subscription.updated"
    echo "     * customer.subscription.deleted"
    echo ""
    echo "5. Enable Stripe Connect (for marketplace functionality):"
    echo "   - Go to: Connect > Settings"
    echo "   - Enable Express accounts"
    echo "   - Set platform fee: 2.5%"
    echo ""
    warning "Save these keys securely - you'll need them for environment configuration"
    echo ""
}

# SendGrid Email Service Setup
setup_sendgrid() {
    log "📧 SendGrid Email Service Setup"
    echo ""
    echo "1. Create SendGrid Account:"
    echo "   - Visit: https://signup.sendgrid.com"
    echo "   - Choose Essentials plan (€15/month for 50K emails)"
    echo ""
    echo "2. Domain Authentication:"
    echo "   - Go to: Settings > Sender Authentication"
    echo "   - Add Domain: prop.ie"
    echo "   - Add these DNS records to your domain:"
    echo "     * CNAME: em1234.prop.ie → u1234567.wl234.sendgrid.net"
    echo "     * CNAME: s1._domainkey.prop.ie → s1.domainkey.u1234567.wl234.sendgrid.net"
    echo "     * CNAME: s2._domainkey.prop.ie → s2.domainkey.u1234567.wl234.sendgrid.net"
    echo ""
    echo "3. Create API Key:"
    echo "   - Go to: Settings > API Keys"
    echo "   - Create API Key with Full Access"
    echo "   - Name: PROP.ie Production"
    echo "   - Save the key (SG.xxxx)"
    echo ""
    echo "4. Configure Templates:"
    echo "   - Welcome email for new users"
    echo "   - Password reset email"
    echo "   - Transaction confirmation"
    echo "   - HTB application updates"
    echo "   - Document upload notifications"
    echo ""
    echo "5. Set up Sender Identity:"
    echo "   - From Email: noreply@prop.ie"
    echo "   - From Name: PROP.ie Platform"
    echo "   - Reply-To: support@prop.ie"
    echo ""
    warning "Domain authentication can take 24-48 hours to verify"
    echo ""
}

# Sentry Error Monitoring Setup
setup_sentry() {
    log "🐛 Sentry Error Monitoring Setup"
    echo ""
    echo "1. Create Sentry Account:"
    echo "   - Visit: https://sentry.io/signup/"
    echo "   - Choose Team plan (€26/month)"
    echo ""
    echo "2. Create Project:"
    echo "   - Platform: Next.js"
    echo "   - Project Name: prop-ie-production"
    echo "   - Team: prop-ie"
    echo ""
    echo "3. Get DSN:"
    echo "   - Copy the DSN from project settings"
    echo "   - Format: https://[key]@[orgId].ingest.sentry.io/[projectId]"
    echo ""
    echo "4. Configure Performance Monitoring:"
    echo "   - Enable Performance Monitoring"
    echo "   - Sample Rate: 0.1 (10% of transactions)"
    echo "   - Enable Web Vitals"
    echo ""
    echo "5. Set up Alerts:"
    echo "   - Create alert for error rate > 1%"
    echo "   - Create alert for response time > 2s"
    echo "   - Notification channels: email + Slack"
    echo ""
    echo "6. Release Tracking:"
    echo "   - Enable release tracking"
    echo "   - Connect to GitHub for deploy notifications"
    echo ""
    warning "Sentry is already configured in the application code"
    echo ""
}

# Twilio SMS Service Setup (for MFA)
setup_twilio() {
    log "📱 Twilio SMS Service Setup (Optional - for MFA)"
    echo ""
    echo "1. Create Twilio Account:"
    echo "   - Visit: https://www.twilio.com/try-twilio"
    echo "   - Choose Pay As You Go plan"
    echo ""
    echo "2. Get Phone Number:"
    echo "   - Buy Irish phone number (+353)"
    echo "   - Enable SMS capabilities"
    echo "   - Cost: ~€1/month + usage"
    echo ""
    echo "3. Get API Credentials:"
    echo "   - Account SID: ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    echo "   - Auth Token: your_auth_token_here"
    echo ""
    echo "4. Configure SMS Templates:"
    echo "   - MFA Code: 'Your PROP.ie verification code is: {code}'"
    echo "   - Login Alert: 'New login to your PROP.ie account from {location}'"
    echo ""
    echo "5. Set up Compliance:"
    echo "   - Register for A2P messaging"
    echo "   - Configure opt-out keywords"
    echo "   - Set up compliance documentation"
    echo ""
    info "SMS MFA is optional - TOTP MFA is already implemented"
    echo ""
}

# Analytics and Monitoring
setup_analytics() {
    log "📊 Analytics and Additional Monitoring"
    echo ""
    echo "1. Google Analytics 4 (Optional):"
    echo "   - Create GA4 Property"
    echo "   - Get Measurement ID (G-XXXXXXXXXX)"
    echo "   - Configure Enhanced Ecommerce"
    echo ""
    echo "2. Hotjar User Analytics (Optional):"
    echo "   - Create account at hotjar.com"
    echo "   - Get Site ID"
    echo "   - Configure heatmaps and recordings"
    echo ""
    echo "3. AWS CloudWatch Insights:"
    echo "   - Already configured via infrastructure setup"
    echo "   - Custom dashboards available"
    echo "   - Log retention: 30 days"
    echo ""
    echo "4. Uptime Monitoring:"
    echo "   - Pingdom or UptimeRobot"
    echo "   - Monitor: https://prop.ie"
    echo "   - Alert if down > 2 minutes"
    echo ""
    info "Core monitoring is handled by AWS CloudWatch and Sentry"
    echo ""
}

# Generate configuration template
generate_config_template() {
    log "📝 Generating Configuration Template"
    
    cat > aws-infrastructure/third-party-env-template.txt << EOF
# ================================================================================
# THIRD-PARTY SERVICE ENVIRONMENT VARIABLES
# ================================================================================
# Copy these to your .env.production file and replace with actual values

# Stripe Live Configuration
STRIPE_SECRET_KEY=sk_live_REPLACE_WITH_ACTUAL_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_REPLACE_WITH_ACTUAL_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET=whsec_REPLACE_WITH_ACTUAL_WEBHOOK_SECRET
STRIPE_CONNECT_CLIENT_ID=ca_REPLACE_WITH_ACTUAL_CONNECT_CLIENT_ID

# SendGrid Email Configuration
SENDGRID_API_KEY=SG.REPLACE_WITH_ACTUAL_API_KEY
EMAIL_FROM=noreply@prop.ie
EMAIL_SUPPORT=support@prop.ie

# Sentry Error Monitoring
SENTRY_DSN=https://REPLACE_WITH_ACTUAL_DSN@sentry.io/PROJECT_ID
SENTRY_AUTH_TOKEN=REPLACE_WITH_ACTUAL_AUTH_TOKEN
SENTRY_ORG=prop-ie
SENTRY_PROJECT=prop-ie-production

# Twilio SMS (Optional - for MFA)
TWILIO_ACCOUNT_SID=AC_REPLACE_WITH_ACTUAL_ACCOUNT_SID
TWILIO_AUTH_TOKEN=REPLACE_WITH_ACTUAL_AUTH_TOKEN
TWILIO_PHONE_NUMBER=+353-XXX-XXX-XXX

# Google Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Hotjar Analytics (Optional)
NEXT_PUBLIC_HOTJAR_ID=XXXXXXX

# Additional Monitoring
UPTIME_MONITOR_API_KEY=REPLACE_IF_USING_EXTERNAL_MONITOR

# ================================================================================
# SECURITY NOTES
# ================================================================================
# 1. Never commit these values to version control
# 2. Use AWS Secrets Manager for production secrets
# 3. Rotate keys regularly
# 4. Monitor for unauthorized access
# 5. Enable 2FA on all service accounts
EOF
    
    success "Configuration template created: aws-infrastructure/third-party-env-template.txt"
}

# Create setup checklist
create_checklist() {
    log "📋 Creating Setup Checklist"
    
    cat > aws-infrastructure/third-party-checklist.md << EOF
# Third-Party Services Setup Checklist

## Required Services (Essential for Production)

### Stripe Payment Processing
- [ ] Create Stripe live account
- [ ] Complete business verification
- [ ] Get live API keys (publishable & secret)
- [ ] Configure webhook endpoint
- [ ] Set up Stripe Connect for marketplace
- [ ] Test payment flows
- [ ] Configure Irish VAT settings

### SendGrid Email Service
- [ ] Create SendGrid account
- [ ] Authenticate prop.ie domain
- [ ] Create API key with full access
- [ ] Set up email templates
- [ ] Configure sender identity
- [ ] Test email delivery
- [ ] Set up DMARC/SPF records

### Sentry Error Monitoring
- [ ] Create Sentry project
- [ ] Get project DSN
- [ ] Configure performance monitoring
- [ ] Set up error alerts
- [ ] Test error reporting
- [ ] Configure release tracking

## Optional Services (Enhanced Features)

### Twilio SMS (for SMS MFA)
- [ ] Create Twilio account
- [ ] Purchase Irish phone number
- [ ] Get API credentials
- [ ] Configure SMS templates
- [ ] Set up A2P compliance
- [ ] Test SMS delivery

### Analytics Services
- [ ] Set up Google Analytics 4
- [ ] Configure Hotjar (if needed)
- [ ] Set up uptime monitoring
- [ ] Configure custom dashboards

## Security Configuration

### API Key Management
- [ ] Store all keys in AWS Secrets Manager
- [ ] Enable 2FA on all service accounts
- [ ] Set up key rotation schedules
- [ ] Document key access procedures
- [ ] Configure IP restrictions where possible

### Monitoring & Alerts
- [ ] Set up service health checks
- [ ] Configure spending alerts
- [ ] Set up security monitoring
- [ ] Test alert mechanisms
- [ ] Document incident response

## Testing & Validation

### Payment Testing
- [ ] Test successful payments
- [ ] Test failed payments
- [ ] Test webhook delivery
- [ ] Test refund processing
- [ ] Verify fee calculations

### Email Testing
- [ ] Test transactional emails
- [ ] Test newsletter delivery
- [ ] Verify sender reputation
- [ ] Test spam filter handling
- [ ] Validate unsubscribe process

### Monitoring Testing
- [ ] Generate test errors
- [ ] Verify alert delivery
- [ ] Test performance monitoring
- [ ] Validate log aggregation
- [ ] Test uptime monitoring

## Compliance & Legal

### Data Protection
- [ ] Update privacy policy for services
- [ ] Configure data retention settings
- [ ] Set up GDPR compliance features
- [ ] Document data processing agreements
- [ ] Configure data export features

### Financial Compliance
- [ ] Register with Revenue Commissioners
- [ ] Set up VAT collection (if required)
- [ ] Configure transaction reporting
- [ ] Set up audit trail logging
- [ ] Document financial procedures

---

**Completion Status**: ⬜ Not Started | 🔄 In Progress | ✅ Complete

**Estimated Setup Time**: 4-6 hours for essential services
**Estimated Cost**: €50-100/month for all services
**Priority**: Complete essential services before go-live
EOF
    
    success "Setup checklist created: aws-infrastructure/third-party-checklist.md"
}

# Main execution
main() {
    log "🛠️  PROP.ie Third-Party Services Setup Guide"
    echo ""
    echo "This guide will walk you through setting up essential third-party services"
    echo "for the PROP.ie production environment."
    echo ""
    
    # Create infrastructure directory if it doesn't exist
    mkdir -p aws-infrastructure
    
    # Setup guides
    setup_stripe
    setup_sendgrid
    setup_sentry
    setup_twilio
    setup_analytics
    
    # Generate configuration files
    generate_config_template
    create_checklist
    
    success "🎉 Third-Party Services Setup Guide Complete!"
    
    echo ""
    log "📋 What's Been Created:"
    echo "  - aws-infrastructure/third-party-env-template.txt"
    echo "  - aws-infrastructure/third-party-checklist.md"
    
    echo ""
    log "📋 Next Steps:"
    echo "1. Work through the setup checklist"
    echo "2. Update environment variables with real API keys"
    echo "3. Test all integrations before go-live"
    echo "4. Configure monitoring and alerts"
    
    echo ""
    warning "⚠️  These services require manual setup through their respective providers"
    warning "⚠️  Budget approximately €50-100/month for all services"
    warning "⚠️  Allow 2-3 business days for account verifications"
}

# Run main function
main "$@"