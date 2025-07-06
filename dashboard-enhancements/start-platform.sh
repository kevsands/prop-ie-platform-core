#!/bin/bash

echo "🚀 Starting Prop.ie Platform..."

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "📦 Starting MongoDB..."
    brew services start mongodb-community@6.0
    sleep 2
fi

echo "✅ MongoDB is running"

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate --schema=./prisma/schema-mongodb.prisma

# Run the Next.js app
echo "🌐 Starting Next.js application..."
npm run dev