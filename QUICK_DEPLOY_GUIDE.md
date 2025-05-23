# Quick Deploy Guide - PropIE Platform

## 🚀 5-Minute Deployment to Vercel

### Prerequisites
- Vercel account (free tier works)
- GitHub repository
- PostgreSQL database (Supabase/Neon recommended)

### Step 1: Prepare Repository
```bash
# Ensure latest changes are committed
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### Step 2: Deploy to Vercel
```bash
# Option A: CLI Deployment
npm i -g vercel
vercel --prod

# Option B: GitHub Integration
# 1. Go to vercel.com/new
# 2. Import your GitHub repository
# 3. Configure environment variables
# 4. Deploy
```

### Step 3: Environment Variables
Add these in Vercel Dashboard → Settings → Environment Variables:

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname?sslmode=require

# Authentication
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=generate-32-char-secret
JWT_SECRET=another-32-char-secret

# Optional (can add later)
STRIPE_SECRET_KEY=sk_test_...
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
```

### Step 4: Database Setup
```bash
# Run from local machine with production DATABASE_URL
DATABASE_URL=your-production-db-url npx prisma migrate deploy
DATABASE_URL=your-production-db-url npx prisma db seed
```

### Step 5: Verify Deployment
1. Check deployment: `https://your-app.vercel.app`
2. Test health endpoint: `https://your-app.vercel.app/api/health`
3. Try login: `https://your-app.vercel.app/login`

## 🔧 Troubleshooting

### Build Fails
- Check Node version (18+ required)
- Review build logs in Vercel
- Ensure all dependencies are listed

### Database Connection Issues
- Verify DATABASE_URL format
- Check SSL requirements
- Ensure database is accessible

### Authentication Not Working
- Verify NEXTAUTH_URL matches deployment URL
- Check NEXTAUTH_SECRET is set
- Ensure callback URLs are configured

## 📱 Quick Test Checklist

After deployment, test these core features:

- [ ] Homepage loads
- [ ] Property search works
- [ ] User registration/login
- [ ] Developer dashboard accessible
- [ ] API health check returns 200

## 🎉 Success!

Your PropIE platform is now live! 

Next steps:
1. Set up custom domain
2. Configure monitoring
3. Add payment integration
4. Enable analytics

Need help? Check the full documentation or open an issue.

---

Deploy Time: ~5 minutes
Platform: Vercel
Cost: Free tier available