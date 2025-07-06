#!/bin/bash

echo "🗄️ Running staging database migrations..."

# Set staging environment
export DATABASE_URL="postgresql://staging_user:staging_secure_pass_2025@localhost:5432/propie_staging"
export NODE_ENV="staging"

# Run Prisma migrations for staging
echo "📝 Generating Prisma client for staging..."
npx prisma generate --schema=./prisma/schema-unified.prisma

echo "🚀 Running database migrations..."
npx prisma migrate deploy --schema=./prisma/schema-unified.prisma

echo "🌱 Seeding staging database with test data..."
npx prisma db seed --schema=./prisma/schema-unified.prisma

echo "✅ Staging database migrations completed!"
