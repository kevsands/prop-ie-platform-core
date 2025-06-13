#!/bin/bash

# 🚀 PropIE Platform - Quick Start Script
# Instantly launch the €1B property investment platform

echo "🏆 Starting PropIE Platform - €1B Property Investment Platform"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the platform directory."
    echo "   Expected location: /Users/kevin/backups/awsready_20250524/prop-ie-aws-app/"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies (this may take a moment)..."
    npm install
fi

echo ""
echo "🎯 Platform Features:"
echo "   • Buyer Dashboard: Complete 8-phase property journey"
echo "   • Developer Dashboard: Fitzgerald Gardens, Ballymakenny View, Ellwood"
echo "   • HTB Integration: Government Help-to-Buy scheme"
echo "   • Real-time Booking: Live property reservation system"
echo "   • Advanced Analytics: Sales tracking, financial reporting"
echo ""

echo "🚀 Starting development server..."
echo "   The platform will auto-detect available ports (3000, 3001, 3002)"
echo ""

# Start the development server
npm run dev

echo ""
echo "✅ Platform stopped. Thank you for using PropIE!"