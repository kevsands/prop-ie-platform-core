#!/bin/bash

echo "🚀 Starting Prop.ie Platform..."
echo "========================================"
echo ""

# Check if PostgreSQL is running
echo "📦 Checking PostgreSQL..."
if psql -U postgres -h localhost -c "SELECT 1" > /dev/null 2>&1; then
    echo "✅ PostgreSQL is running"
else
    echo "❌ PostgreSQL is not running. Please start it first."
    exit 1
fi

# Check if database exists
echo "🔍 Checking database..."
if psql -U postgres -h localhost -d prop_ie_db -c "SELECT 1" > /dev/null 2>&1; then
    echo "✅ Database 'prop_ie_db' exists"
else
    echo "📦 Creating database..."
    psql -U postgres -h localhost -c "CREATE DATABASE prop_ie_db;"
fi

# Run migrations
echo "🔧 Running database migrations..."
npx prisma migrate deploy

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

echo ""
echo "🌐 Starting Next.js application..."
echo "================================="
echo ""
echo "Server will be available at: http://localhost:3000"
echo ""
echo "Test Users:"
echo "- Admin: admin@prop.ie / admin123"
echo "- Developer: developer@fitzgerald.ie / developer123"
echo "- Buyer: buyer@example.com / buyer123"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev