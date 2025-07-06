#!/bin/bash

# Kill any existing processes on port 3000
lsof -ti :3000 | xargs kill -9 2>/dev/null

# Kill any existing Next.js dev processes
pkill -f "next dev" 2>/dev/null

# Wait a moment for ports to be released
sleep 2

# Start the development server
echo "Starting PropIE development server on port 3000..."
cd /Users/kevin/Downloads/awsready/prop-ie-aws-app
npm run dev