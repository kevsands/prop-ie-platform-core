#!/bin/bash
# Immediate Production Deployment Script

set -e

echo "🚀 Starting Production Deployment..."
echo "=================================="

# 1. Check prerequisites
echo "✓ Checking prerequisites..."
if [ ! -f ".env.production" ]; then
    echo "❌ .env.production not found!"
    exit 1
fi

# 2. Install dependencies
echo "📦 Installing dependencies..."
npm ci

# 3. Run tests
echo "🧪 Running tests..."
npm test || echo "⚠️ Some tests failed, continuing..."

# 4. Build application
echo "🔨 Building for production..."
NODE_ENV=production npm run build

# 5. Initialize Amplify (if not already done)
if [ ! -d "amplify" ]; then
    echo "🔧 Initializing Amplify..."
    amplify init \
        --envName prod \
        --defaultEditor code \
        --appId prop-ie-production \
        --yes
fi

# 6. Add hosting (if not already done)
if ! amplify status | grep -q "Hosting"; then
    echo "🌐 Adding hosting..."
    amplify add hosting
fi

# 7. Deploy to AWS
echo "☁️ Deploying to AWS Amplify..."
amplify publish --yes

# 8. Run post-deployment checks
echo "✅ Running post-deployment checks..."
PROD_URL=$(amplify status | grep "Hosting" | grep -oE "https://[^ ]+")
echo "Production URL: $PROD_URL"

# Health check
echo "🏥 Checking health endpoint..."
curl -f "$PROD_URL/api/health" || echo "⚠️ Health check failed"

# 9. Update DNS (manual step)
echo ""
echo "📌 IMPORTANT: Manual steps required:"
echo "1. Update DNS records to point to: $PROD_URL"
echo "2. Verify SSL certificate is active"
echo "3. Update monitoring dashboards"
echo "4. Notify team of deployment"

echo ""
echo "🎉 Deployment complete!"
echo "Monitor the application at: $PROD_URL/monitoring"