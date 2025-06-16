#!/bin/bash
# PROP.ie Quick Production Deployment
# Cost: €45/month | Time: 30 minutes

set -e

echo "🚀 PROP.ie Quick Production Deployment"
echo "💰 Target cost: €45/month"
echo ""

# 1. Generate secrets
echo "🔐 Generating security secrets..."
NEXTAUTH_SECRET=$(openssl rand -hex 64)
JWT_SECRET=$(openssl rand -hex 64)  
ENCRYPTION_KEY=$(openssl rand -hex 32)

echo "✅ Secrets generated"

# 2. Create production environment
echo "📝 Creating production environment file..."
cp .env.production.minimal .env.production

# Replace placeholders with generated secrets
sed -i '' "s/REPLACE_WITH_64_CHAR_SECRET/$NEXTAUTH_SECRET/g" .env.production
sed -i '' "s/REPLACE_WITH_64_CHAR_SECRET/$JWT_SECRET/g" .env.production  
sed -i '' "s/REPLACE_WITH_32_CHAR_KEY/$ENCRYPTION_KEY/g" .env.production

echo "✅ Environment file created"

# 3. Install Vercel CLI if not present
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# 4. Fix any remaining syntax issues
echo "🔧 Running syntax fixes..."
if [[ -f "fix-jsx-syntax-comprehensive.js" ]]; then
    node fix-jsx-syntax-comprehensive.js > /dev/null 2>&1 || true
fi

# 5. Test build
echo "🏗️  Testing build..."
npm run build || {
    echo "❌ Build failed. Checking for issues..."
    echo "Run: npm run build to see detailed errors"
    exit 1
}

echo "✅ Build successful"

# 6. Initialize Vercel project
echo "🚀 Setting up Vercel deployment..."
vercel init --yes || echo "Project may already exist"

echo ""
echo "🎉 Quick setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Create Supabase project at https://supabase.com/dashboard"
echo "2. Update DATABASE_URL in .env.production"  
echo "3. Run: vercel env add DATABASE_URL production"
echo "4. Run: vercel env add NEXTAUTH_SECRET production"
echo "5. Run: vercel env add JWT_SECRET production"
echo "6. Run: vercel --prod"
echo ""
echo "💰 Monthly cost: €45 (Vercel €20 + Supabase €25)"
echo "📈 Scales to 1,000+ users before needing upgrades"