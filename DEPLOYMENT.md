# Deployment Guide for Prop.ie Fitzgerald Gardens

This guide provides step-by-step instructions for deploying the Prop.ie Fitzgerald Gardens platform to Vercel.

## Prerequisites

- GitHub account
- Vercel account (can sign up with GitHub)
- Your AWS backend API URL

## Step 1: Prepare Your Repository

1. Create a GitHub repository for your project
2. Push your code to the repository:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/prop-ie-aws-app.git
git push -u origin main
```

## Step 2: Connect to Vercel

1. Go to [Vercel](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: .next

## Step 3: Configure Environment Variables

Add the following environment variables:

- `NEXT_PUBLIC_API_URL`: Your AWS backend API URL

## Step 4: Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your site will be available at: https://prop-ie-aws-app.vercel.app

## Step 5: Custom Domain (When Ready)

1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain (e.g., fitzgeraldgardens.ie)
4. Follow the DNS configuration instructions

## Automatic Deployments

Vercel automatically deploys:

- When you push to the main branch
- Pull request previews for testing changes

## Troubleshooting

If you encounter deployment issues:

1. Check the build logs in Vercel
2. Ensure all dependencies are properly installed
3. Verify environment variables are correctly set
4. Check for any path issues in your code

## Performance Monitoring

Vercel provides built-in analytics and performance monitoring:

1. Go to your project dashboard
2. Click "Analytics" to view performance metrics
3. Enable "Web Vitals" for detailed performance tracking
