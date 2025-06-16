# PROP.ie Cost-Optimized Deployment Guide

## Total Monthly Cost: €45

### Step 1: Supabase Database Setup (5 minutes)

1. **Create Supabase Project**
   ```bash
   # Go to https://supabase.com/dashboard
   # Click "New Project"
   # Project name: "propie-production"
   # Region: Europe West (Ireland)
   # Plan: Pro ($25/month)
   ```

2. **Get Database URL**
   ```bash
   # From Supabase Dashboard → Settings → Database
   # Copy the Connection String (postgres://...)
   ```

3. **Run Database Migrations**
   ```bash
   # Update .env.production with Supabase URL
   DATABASE_URL="postgresql://postgres:[password]@[project-ref].supabase.co:5432/postgres"
   
   # Run migrations
   npm run db:migrate:deploy
   npm run db:seed
   ```

### Step 2: Vercel Deployment (10 minutes)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Configure Project**
   ```bash
   # In your project root
   vercel init
   # Follow prompts:
   # - Framework: Next.js
   # - Build command: npm run build
   # - Output directory: .next
   ```

3. **Set Environment Variables**
   ```bash
   # Production environment
   vercel env add DATABASE_URL production
   vercel env add NEXTAUTH_SECRET production
   vercel env add JWT_SECRET production
   vercel env add STRIPE_SECRET_KEY production
   vercel env add SENTRY_DSN production
   ```

4. **Deploy**
   ```bash
   vercel --prod
   ```

### Step 3: Domain Configuration (15 minutes)

1. **Custom Domain**
   ```bash
   # In Vercel dashboard
   # Go to Project → Settings → Domains
   # Add: app.prop.ie
   # Update DNS: CNAME to cname.vercel-dns.com
   ```

2. **SSL Certificate**
   ```bash
   # Automatic with Vercel
   # Will provision Let's Encrypt certificate
   ```

### Step 4: Essential Services

1. **Stripe (Payments)**
   ```bash
   # Use existing Stripe account
   # Add webhook: https://app.prop.ie/api/webhooks/stripe
   # Events: payment_intent.succeeded, payment_intent.payment_failed
   ```

2. **SendGrid (Email) - FREE**
   ```bash
   # Free tier: 100 emails/day
   # More than enough for 97 transactions
   ```

3. **Sentry (Monitoring) - FREE**
   ```bash
   # Free tier: 5,000 errors/month
   # Perfect for launch monitoring
   ```

## Performance Specs

### Vercel Pro Limits
- **Bandwidth**: 100GB/month (plenty for property platform)
- **Build time**: 45 minutes (your build takes ~3 minutes)
- **Serverless functions**: 1,000GB-Hrs execution time
- **Edge functions**: 500,000 invocations

### Supabase Pro Limits  
- **Database size**: 8GB (enough for 10,000+ properties)
- **Bandwidth**: 250GB/month
- **API requests**: 5 million/month
- **Auth users**: Unlimited
- **Real-time connections**: 500 concurrent

## Scaling Triggers

**When to upgrade:**
- **>500 active users**: Upgrade Vercel to Team (€50/month)
- **>1,000 properties**: Upgrade Supabase storage
- **>€1M transactions/month**: Move to dedicated AWS infrastructure

## Launch Checklist

- [ ] Supabase project created
- [ ] Database migrated and seeded
- [ ] Vercel project deployed
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Stripe webhooks configured
- [ ] Error monitoring active
- [ ] Test transaction completed

## Expected Performance

- **Page load**: <2 seconds globally
- **API response**: <300ms average
- **Uptime**: 99.9% SLA
- **Concurrent users**: 1,000+
- **Transaction volume**: 500/month easily

## Cost Breakdown by Usage

### 97 Units Scenario
- **Monthly cost**: €45
- **Cost per transaction**: €0.46
- **Break-even**: 1 transaction
- **Profit margin**: 99.9%

### Growth Scenarios
- **500 users**: €95/month (Vercel Team + Supabase Pro)
- **1,000 properties**: €145/month (larger database)
- **Enterprise**: €500/month (dedicated infrastructure)

This scales with your business, not against it.