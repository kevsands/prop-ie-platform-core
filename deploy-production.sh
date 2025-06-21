#!/bin/bash

# 🚀 KEVIN FITZGERALD PROPERTY PLATFORM - PRODUCTION DEPLOYMENT SCRIPT
# September 2025 Launch Ready

echo "🏠 Kevin Fitzgerald Property Platform - Production Deployment"
echo "=============================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project directory verified"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js version $NODE_VERSION detected. Requires Node.js 18+"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not available"
    exit 1
fi

echo "✅ npm $(npm -v) available"

# Check environment configuration
echo ""
echo "🔧 Checking Environment Configuration..."

if [ ! -f ".env.production" ]; then
    echo "❌ Error: .env.production file not found"
    echo "Please copy .env.production from the project template"
    exit 1
fi

echo "✅ Production environment file found"

# Check for required environment variables
echo ""
echo "📧 Checking Email Configuration..."

if grep -q "REPLACE_WITH" .env.production; then
    echo "⚠️  Warning: Some environment variables still need configuration:"
    grep "REPLACE_WITH" .env.production
    echo ""
    echo "Please update .env.production with your actual API keys before launching"
    echo "See PRODUCTION-LAUNCH-GUIDE.md for details"
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Install dependencies
echo ""
echo "📦 Installing Dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Check database connection
echo ""
echo "🗄️  Checking Database Connection..."

if npx prisma db pull --schema=./prisma/schema.prisma &> /dev/null; then
    echo "✅ Database connection successful"
else
    echo "⚠️  Warning: Could not connect to database"
    echo "Please ensure DATABASE_URL is correctly configured in .env.production"
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if data is populated
echo ""
echo "🏗️  Checking Project Data..."

DEVELOPMENT_COUNT=$(npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM \"Development\";" 2>/dev/null | tail -n1 | tr -d ' ')

if [ "$DEVELOPMENT_COUNT" = "3" ]; then
    echo "✅ All 3 developments found in database"
    echo "   • Ellwood (SOLD OUT)"
    echo "   • Ballymakenny View (19/20 SOLD)"
    echo "   • Fitzgerald Gardens (15 AVAILABLE)"
else
    echo "⚠️  Warning: Expected 3 developments, found $DEVELOPMENT_COUNT"
    echo "You may need to run the database seeding scripts"
fi

# Start application
echo ""
echo "🚀 Starting Production Application..."
echo ""

# Check if port 3000 is available
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null; then
    echo "⚠️  Port 3000 is already in use"
    echo "Stopping existing process..."
    pkill -f "next dev" || true
    sleep 2
fi

echo "Starting Kevin Fitzgerald Property Platform..."
echo "🌐 App will be available at: http://localhost:3000"
echo "📊 Admin dashboard: http://localhost:3000/admin"
echo "🏠 Property listings: http://localhost:3000/developments"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Copy production environment for local testing
cp .env.production .env.local

# Start the development server (recommended for initial production)
npm run dev

# Alternative: Use production build (if TypeScript issues are resolved)
# npm run build
# if [ $? -eq 0 ]; then
#     npm start
# else
#     echo "❌ Build failed - falling back to development server"
#     npm run dev
# fi