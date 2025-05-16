#!/bin/bash

# PropIE Enterprise Platform Restoration Script
echo "🚀 Restoring PropIE Enterprise Platform..."

# Kill any existing Next.js processes
pkill -f "next dev"

# Install dependencies if needed
echo "📦 Checking dependencies..."
npm install

# Clear Next.js cache
echo "🧹 Clearing cache..."
rm -rf .next

# Check for missing images and create placeholders
echo "🖼️ Checking images..."
mkdir -p public/images/properties
mkdir -p public/images/developments
mkdir -p public/images/testimonials
mkdir -p public/images/team

# Create placeholder images if they don't exist
if [ ! -f "public/images/fitzgerald-gardens/hero.jpg" ]; then
    echo "Creating placeholder images..."
    mkdir -p public/images/fitzgerald-gardens
    mkdir -p public/images/ellwood  
    mkdir -p public/images/ballymakenny-view
    mkdir -p public/images/riverside-manor
    
    # Create a simple placeholder using ImageMagick if available, or touch empty files
    touch public/images/fitzgerald-gardens/hero.jpg
    touch public/images/ellwood/hero.jpg
    touch public/images/ballymakenny-view/hero.jpg
    touch public/images/riverside-manor/hero.jpg
fi

# Start the development server
echo "🚀 Starting development server..."
npm run dev