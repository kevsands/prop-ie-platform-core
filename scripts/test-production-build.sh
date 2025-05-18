#!/bin/bash
# Test Production Build Locally

echo "🧪 Testing Production Build..."

# 1. Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next

# 2. Set production environment
export NODE_ENV=production

# 3. Build the application
echo "🔨 Building for production..."
npm run build

# 4. Start production server
echo "🚀 Starting production server..."
npm start &
SERVER_PID=$!

# 5. Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 5

# 6. Run health checks
echo "🏥 Running health checks..."
curl -f http://localhost:3000/api/health || echo "Health check failed"

# 7. Test authentication
echo "🔐 Testing authentication..."
curl -f http://localhost:3000/api/auth/session || echo "Session check failed"

# 8. Test monitoring
echo "📊 Testing monitoring..."
curl -f http://localhost:3000/api/metrics || echo "Metrics check failed"

# 9. Kill the server
echo "🛑 Stopping server..."
kill $SERVER_PID

echo "✅ Production build test complete!"