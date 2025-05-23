#!/bin/bash

echo "🚀 Applying performance optimizations..."

# Check if database URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL not set. Please set it in your .env file"
  exit 1
fi

echo "📊 Current database state..."
npx prisma db pull

echo "🔧 Applying missing indexes migration..."
npx prisma migrate deploy

echo "📈 Generating Prisma client with new indexes..."
npx prisma generate

echo "✅ Performance optimizations applied!"
echo ""
echo "📋 Next steps:"
echo "1. Restart your development server"
echo "2. Monitor query performance with: npx prisma studio"
echo "3. Check slow queries in your database logs"
echo ""
echo "🎯 Key improvements:"
echo "- Added 50+ missing indexes on foreign keys"
echo "- Fixed N+1 queries in unit listings"
echo "- Implemented query caching for heavy operations"
echo "- Added composite indexes for common query patterns"