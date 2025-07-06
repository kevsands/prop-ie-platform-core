# Sentry Error Monitoring Setup Guide

## 🎯 Quick Setup

Sentry is now configured but requires a real Sentry project to function. Here's how to complete the setup:

### 1. Create a Sentry Account & Project

1. **Go to [sentry.io](https://sentry.io)** and create an account
2. **Create a new project:**
   - Platform: `Next.js`
   - Project name: `prop-ie-platform`
   - Organization: `propchain-solutions-ltd-ta-pro` (or your org)

### 2. Get Your Sentry DSN

After creating the project, you'll get a DSN that looks like:
```
https://abc123def456@o123456.ingest.sentry.io/789012
```

### 3. Update Environment Variables

Replace the placeholder in `.env.local`:

```env
# Replace this line:
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# With your actual DSN:
NEXT_PUBLIC_SENTRY_DSN=https://abc123def456@o123456.ingest.sentry.io/789012
```

### 4. Optional: Enable in Development

To test Sentry in development, uncomment this line in `.env.local`:
```env
SENTRY_DEV_MODE=true
```

### 5. For Production Deployment

Add these additional environment variables for production:

```env
SENTRY_AUTH_TOKEN=your-auth-token-from-sentry
SENTRY_ORG=propchain-solutions-ltd-ta-pro
SENTRY_PROJECT=javascript-nextjs
```

## 🔧 Configuration Files Created

The following files have been set up:

- ✅ **`instrumentation-client.ts`** - Modern client-side error monitoring (recommended)
- ✅ **`sentry.server.config.ts`** - Server-side error monitoring  
- ✅ **`sentry.edge.config.ts`** - Edge runtime monitoring
- ✅ **`instrumentation.ts`** - Automatic Sentry initialization with onRequestError hook
- ✅ **`next.config.js`** - Updated to conditionally enable Sentry
- ✅ **`.env.local`** - Environment variables updated with new DSN
- ✅ **Router instrumentation** - Navigation tracking enabled

## 🎮 Testing Sentry

Once you have a real DSN configured:

1. **Restart your development server:**
   ```bash
   npm run dev
   ```

2. **Test error reporting:**
   - Add a button that throws an error
   - Check your Sentry dashboard for the error report

3. **View errors in Sentry dashboard:**
   - Go to your Sentry project dashboard
   - Check the "Issues" tab for reported errors

## 🛡️ Security Features

The configuration includes:

- **Environment filtering:** Disabled in development by default
- **Sensitive data filtering:** Removes passwords, tokens, cookies
- **Error filtering:** Ignores common development/browser errors
- **Performance monitoring:** Configurable sampling rates
- **Release tracking:** Automatic release tagging

## 📊 What Gets Monitored

- **JavaScript errors** (client & server)
- **Unhandled promise rejections**
- **Performance metrics** (page load times, API response times)
- **User sessions** (anonymized)
- **Release tracking** (automatic with git commits)

## 🚫 Error Filtering

The following errors are automatically filtered out:

- **Development-only errors** (chunk loading, hot reload)
- **Browser extension errors**
- **Temporary network issues**
- **Known Next.js framework errors**
- **Sensitive authentication errors**

## 🎯 Current Status

- **Configuration:** ✅ Complete
- **Integration:** ✅ Ready (waiting for real DSN)
- **Environment:** ✅ Development-safe (disabled by default)
- **Production:** ✅ Ready for deployment

**Next Step:** Get a real Sentry DSN and update the `.env.local` file!