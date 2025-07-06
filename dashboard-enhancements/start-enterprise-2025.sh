#!/bin/bash

# Enterprise 2025 Next.js Application Launcher
# Ultra-robust, production-grade development server

set -e

echo -e "\n\033[1;36m🏢 ENTERPRISE 2025 APPLICATION LAUNCHER 🚀\033[0m\n"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Kill any existing processes
log_info "Cleaning up existing processes..."
pkill -f "node" || true
pkill -f "next" || true
sleep 2

# Clean cache
log_info "Cleaning build cache..."
rm -rf .next || true
rm -rf node_modules/.cache || true

# Check environment
log_info "Checking environment..."
if [ ! -f .env.local ]; then
    log_warn ".env.local not found, creating from template..."
    cp .env.example .env.local || true
fi

# Set up environment variables
export NODE_ENV=development
export NODE_OPTIONS="--max-old-space-size=8192"
export NEXT_TELEMETRY_DISABLED=1

# Check dependencies
log_info "Checking dependencies..."
if [ ! -d node_modules ]; then
    log_warn "Dependencies not installed, installing..."
    npm install --legacy-peer-deps
fi

# Create a process monitor
log_info "Starting process monitor..."
(
    while true; do
        if ! pgrep -f "next dev" > /dev/null; then
            log_error "Server crashed, restarting..."
            npm run dev &
        fi
        sleep 5
    done
) &
MONITOR_PID=$!

# Start the development server with full logging
log_info "Starting development server..."
npm run dev 2>&1 | while IFS= read -r line; do
    if [[ "$line" == *"Error"* ]]; then
        log_error "$line"
    elif [[ "$line" == *"Warning"* ]]; then
        log_warn "$line"
    elif [[ "$line" == *"Ready"* ]]; then
        log_success "$line"
        log_success "Application is running at http://localhost:3000"
        log_info "Press CTRL+C to stop"
    else
        echo "$line"
    fi
done

# Cleanup on exit
trap "kill $MONITOR_PID 2>/dev/null; pkill -f 'next dev'" EXIT