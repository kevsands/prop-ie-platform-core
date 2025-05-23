# Platform Setup Guide

## Prerequisites
- Node.js 18+
- PostgreSQL database
- Redis (for sessions)
- AWS Account
- Stripe Account
- Resend Account

## Step 1: Install Dependencies
```bash
npm install
```

## Step 2: Setup Database
```bash
# Create database
createdb prop_platform

# Run migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed initial data
npm run seed
```

## Step 3: Environment Setup
Create `.env.local` file:
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/prop_platform

# NextAuth
NEXTAUTH_SECRET=generate-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Stripe
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
RESEND_API_KEY=re_...

# AWS
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=eu-west-1
S3_BUCKET_NAME=prop-platform-documents

# Redis
REDIS_URL=redis://localhost:6379

# WebSocket
WEBSOCKET_PORT=3001
```

## Step 4: Install UI Components
```bash
# Install shadcn/ui
npx shadcn-ui@latest init

# Add required components
npx shadcn-ui@latest add card button input label slider select badge separator tabs progress avatar scroll-area checkbox
```

## Step 5: Setup Third-party Services

### Stripe
1. Create Stripe account
2. Get API keys from dashboard
3. Set up webhook endpoint

### Resend
1. Create Resend account
2. Verify domain
3. Get API key

### AWS
1. Create S3 bucket for documents
2. Set up IAM permissions
3. Configure CORS for bucket

## Step 6: Start Development Server
```bash
# Start database
pg_ctl start

# Start Redis
redis-server

# Start WebSocket server
npm run websocket

# Start Next.js dev server
npm run dev
```

## Step 7: Deploy to Production

### Using Docker
```bash
# Build image
docker build -t prop-platform .

# Run container
docker run -p 3000:3000 prop-platform
```

### Using AWS ECS
```bash
# Initialize Terraform
cd infrastructure/terraform
terraform init

# Plan deployment
terraform plan

# Deploy
terraform apply
```

## Testing the Platform

### 1. Create Developer Account
- Register at `/auth/register`
- Select "Developer" role
- Create first development

### 2. Add Property Units
- Go to Developer Dashboard
- Create new development
- Add individual units

### 3. Test Buyer Flow
- Register buyer account
- Search properties
- Make reservation
- Complete KYC

### 4. Monitor Transaction
- View unified timeline
- Upload documents
- Track payments
- Test messaging

## Common Issues

### Database Connection
```bash
# Check PostgreSQL is running
pg_isready

# Check connection string
psql $DATABASE_URL
```

### WebSocket Connection
```bash
# Check if port is available
lsof -i :3001

# Test WebSocket
wscat -c ws://localhost:3001
```

### Email Delivery
- Check Resend API key
- Verify domain in Resend
- Check spam folder

## Production Checklist

- [ ] SSL certificates configured
- [ ] Environment variables set
- [ ] Database backups configured
- [ ] Monitoring alerts set up
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Error tracking (Sentry) configured
- [ ] CDN configured for assets
- [ ] Load testing completed
- [ ] Security audit completed