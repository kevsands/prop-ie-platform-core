#!/bin/bash
# Enterprise Grade Platform Launcher
# Top-tier deployment script for PropIE AWS Platform

echo "🚀 Enterprise Platform Launcher v1.0"
echo "===================================="

# Define colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print step
print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Function to print success
print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Function to print error
print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check Node.js version
print_step "Checking Node.js version..."
if command_exists node; then
    NODE_VERSION=$(node -v)
    print_success "Node.js ${NODE_VERSION} installed"
else
    print_error "Node.js not found. Please install Node.js 18+ first."
    exit 1
fi

# Check npm version
print_step "Checking npm version..."
if command_exists npm; then
    NPM_VERSION=$(npm -v)
    print_success "npm ${NPM_VERSION} installed"
else
    print_error "npm not found. Please install npm."
    exit 1
fi

# Install dependencies
print_step "Installing dependencies..."
npm install --legacy-peer-deps || {
    print_error "Failed to install dependencies"
    exit 1
}
print_success "Dependencies installed"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_step "Creating environment configuration..."
    cp .env.template .env 2>/dev/null || {
        cat > .env << 'EOF'
# Auto-generated environment configuration
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# AWS Configuration (Development)
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_AWS_USER_POOLS_ID=us-east-1_TEMPORARY
NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID=TEMPORARY_CLIENT_ID

# Database
DATABASE_URL=mongodb://localhost:27017/prop_ie_db

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=enterprise-dev-secret-2024
JWT_SECRET=enterprise-jwt-secret-2024

# Security
DISABLE_SECURITY_IN_DEV=true
EOF
    }
    print_success "Environment configuration created"
else
    print_success "Environment configuration exists"
fi

# Check if port 3000 is available
print_step "Checking port 3000..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    print_warning "Port 3000 is in use. Attempting to free it..."
    kill $(lsof -Pi :3000 -sTCP:LISTEN -t) 2>/dev/null
    sleep 2
fi

# Start the development server
print_step "Starting Enterprise Platform..."
echo ""
echo "🏢 PropIE Enterprise Platform"
echo "============================"
echo "✅ Development Server: http://localhost:3000"
echo "✅ Network Access: http://$(hostname -I | awk '{print $1}'):3000"
echo "✅ GraphQL Playground: http://localhost:3000/api/graphql"
echo ""
echo "📚 Documentation:"
echo "   - Architecture: ./ARCHITECTURE.md"
echo "   - API Guide: ./API-DOCUMENTATION.md"
echo "   - Deployment: ./DEPLOYMENT_GUIDE.md"
echo ""
echo "🛠️  Commands:"
echo "   - npm run build       # Production build"
echo "   - npm run test        # Run tests"
echo "   - npm run lint        # Run linter"
echo "   - npm run typecheck   # Check types"
echo ""
echo -e "${GREEN}Platform is launching...${NC}"
echo ""

# Launch the platform
npm run dev