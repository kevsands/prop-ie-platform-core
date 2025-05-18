#!/bin/bash
# Production Deployment Script for Prop.ie Platform

set -e

echo "🚀 Starting Production Deployment..."

# 1. Environment Check
if [ "$NODE_ENV" != "production" ]; then
    echo "⚠️  Warning: NODE_ENV is not set to production"
    export NODE_ENV=production
fi

# 2. Install Dependencies
echo "📦 Installing production dependencies..."
npm ci --production

# 3. Run Tests
echo "🧪 Running test suite..."
npm test

# 4. Build Application
echo "🔨 Building for production..."
npm run build

# 5. Database Migration
echo "🗄️  Running database migrations..."
npx prisma migrate deploy

# 6. Health Check
echo "🏥 Performing health check..."
curl -f http://localhost:3000/api/health || exit 1

# 7. Deploy to AWS
echo "☁️  Deploying to AWS..."
if command -v amplify &> /dev/null; then
    amplify publish --yes
else
    echo "Amplify CLI not found. Please install with: npm install -g @aws-amplify/cli"
    exit 1
fi

# 8. Post-deployment verification
echo "✅ Deployment complete! Verifying..."
curl -f https://your-production-url.com/api/health

echo "🎉 Production deployment successful!"