# 🚀 Deploy PROP.ie to Vercel - Step by Step

## ✅ Prerequisites Complete
- Vercel CLI installed ✓
- Configuration file created ✓
- Environment variables set ✓

---

## 🎯 Manual Deployment Steps

### Step 1: Login to Vercel
```bash
cd "/Users/kevin/backups/awsready_20250524/prop-ie-aws-app-PERFECT-WORKING-JUNE13-2025"
vercel login
```
**Action**: Choose your preferred login method (GitHub recommended)

### Step 2: Deploy to Vercel
```bash
# Deploy with staging configuration
vercel --prod --env ALLOW_MOCK_AUTH=true --env NEXT_PUBLIC_APP_ENV=staging
```

**During deployment, when prompted**:
- Project name: `prop-ie-staging`
- Framework: `Next.js` (should auto-detect)
- Build command: Use default or `npm run build`
- Output directory: Use default (`.next`)

### Step 3: Note Your Vercel URL
After deployment, you'll get a URL like:
```
https://prop-ie-staging-xyz123.vercel.app
```
**Copy this URL** - you'll need it for DNS setup.

---

## 🌐 Add Custom Domain (staging.prop.ie)

### Step 4: Add Domain in Vercel Dashboard
1. Go to **Vercel Dashboard**: https://vercel.com/dashboard
2. Click your **prop-ie-staging** project
3. Go to **Settings** → **Domains**
4. Add domain: `staging.prop.ie`
5. Vercel will show you the CNAME record needed

### Step 5: Update Your DNS
In your **prop.ie** DNS settings, add:
```dns
Type: CNAME
Name: staging
Value: cname.vercel-dns.com
```
*Or use the specific CNAME that Vercel provides*

---

## 🔧 Alternative: Quick Deploy Commands

### Option A: Deploy with Environment Variables
```bash
vercel \
  --env NODE_ENV=production \
  --env NEXT_PUBLIC_APP_ENV=staging \
  --env ALLOW_MOCK_AUTH=true \
  --env ENABLE_AUTH=false \
  --env ENABLE_DEBUG_MODE=true \
  --prod
```

### Option B: Deploy with .env.staging
```bash
# Copy staging config to .env.local for deployment
cp .env.staging .env.local
vercel --prod
```

---

## 📋 Expected Results

### Immediate (5-10 minutes)
- **Vercel URL active**: https://prop-ie-staging-xyz.vercel.app
- **Platform accessible** with all 245+ routes
- **Real development data** visible (Fitzgerald Gardens)
- **Professional interface** ready for demos

### After DNS Propagation (10-60 minutes)
- **staging.prop.ie** accessible
- **SSL certificate** automatically provisioned
- **Professional URL** for stakeholder presentations

---

## 🧪 Testing Checklist

After deployment, verify:

### Core Functionality
- [ ] Homepage loads at staging.prop.ie
- [ ] Navigation works across all sections
- [ ] Developer portal accessible (`/developer`)
- [ ] Buyer portal accessible (`/buyer`)
- [ ] Property data displays correctly

### Business Data
- [ ] Fitzgerald Gardens development visible
- [ ] Transaction data showing (€6.6M+)
- [ ] HTB calculator functional
- [ ] Analytics dashboards operational

### Technical
- [ ] All images loading
- [ ] No JavaScript errors in console
- [ ] Mobile responsive design
- [ ] SSL certificate active (🔒 icon)

---

## 🎪 Demo Preparation

### For Estate Agents
Direct them to:
- `staging.prop.ie` - Main platform
- `staging.prop.ie/developer/projects/fitzgerald-gardens` - Real project data
- `staging.prop.ie/buyer/first-time-buyers/welcome` - Buyer journey

### For Investors
Show them:
- `staging.prop.ie` - Professional homepage
- Sales analytics with real €6.6M+ data
- Multi-stakeholder workflow demonstrations
- Enterprise platform capabilities

---

## 🚨 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules/.cache
npm install --legacy-peer-deps
vercel --prod
```

### Domain Not Working
- Check DNS propagation: https://www.whatsmydns.net/
- Verify CNAME record in your DNS provider
- Wait up to 24 hours for full propagation

### Environment Variables
Update in Vercel Dashboard:
1. Project Settings → Environment Variables
2. Add missing variables from vercel.json
3. Redeploy: `vercel --prod`

---

## 📈 Success Metrics

### Technical Success
- ✅ staging.prop.ie loads in under 3 seconds
- ✅ All 245+ routes accessible
- ✅ Real transaction data displayed
- ✅ No critical JavaScript errors

### Business Success
- ✅ Professional demo URL ready
- ✅ Stakeholder presentations possible
- ✅ Estate agent onboarding ready
- ✅ Investor showcase prepared

---

**Status**: Ready for immediate deployment  
**Timeline**: 30 minutes to live staging.prop.ie  
**Next Step**: Run `vercel login` and deploy!

**Platform**: 1,354+ files, 245+ routes, €6.6M+ real data, enterprise-ready