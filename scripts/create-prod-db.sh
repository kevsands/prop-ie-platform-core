#!/bin/bash
# Create Production Database

echo "🗄️ Creating Production Database..."

# For local testing with PostgreSQL
if command -v psql &> /dev/null; then
    echo "Creating local production database..."
    createdb prop_ie_production || echo "Database already exists"
    
    # Set DATABASE_URL for Vercel
    export DATABASE_URL="postgresql://postgres@localhost:5432/prop_ie_production"
    echo "DATABASE_URL=$DATABASE_URL"
    
    # Run migrations
    echo "Running migrations..."
    npx prisma migrate deploy
    
    echo "✅ Local production database ready"
else
    echo "PostgreSQL not found. You'll need to:"
    echo "1. Create a database on Supabase, Neon, or Railway"
    echo "2. Get the connection string"
    echo "3. Set it as DATABASE_URL in Vercel"
fi

echo ""
echo "📝 Next steps:"
echo "1. Create a database on one of these services:"
echo "   - Supabase (https://supabase.com) - Recommended"
echo "   - Neon (https://neon.tech)"
echo "   - Railway (https://railway.app)"
echo "2. Copy the connection string"
echo "3. Run: vercel env add DATABASE_URL"
echo "4. Paste the connection string"