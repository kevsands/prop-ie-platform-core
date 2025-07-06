# AWS Cognito Setup for PROP.ie Ireland

## Step 1: Create Cognito User Pool

1. **Login to AWS Console**
   - Go to https://console.aws.amazon.com
   - Select **eu-west-1 (Ireland)** region (top right)

2. **Navigate to Cognito**
   - Search for "Cognito" in the services
   - Click "Amazon Cognito"

3. **Create User Pool**
   - Click "Create user pool"
   - Choose **"Cognito user pool"**

## Step 2: Configure User Pool Settings

### Authentication providers
- ✅ **Cognito user pool** (checked)
- ✅ **Email** (checked for sign-in)

### Password policy
- **Minimum length**: 8 characters
- **Require**: Uppercase, lowercase, numbers, special characters
- **Temporary password expiry**: 7 days

### MFA Settings
- **MFA enforcement**: Optional (recommended for property transactions)
- **MFA methods**: SMS text message, TOTP

### User attributes
**Required attributes:**
- ✅ email
- ✅ given_name (first name)
- ✅ family_name (last name)
- ✅ phone_number

**Custom attributes (add these):**
- `custom:pps_number` (Irish PPS number for KYC)
- `custom:user_type` (buyer, developer, agent, solicitor)
- `custom:kyc_status` (not_started, in_progress, approved, rejected)

### Email settings
- **Email provider**: Amazon SES (or Cognito default for testing)
- **FROM email**: no-reply@prop.ie (you'll need to verify this domain)

## Step 3: App Client Configuration

### App client settings
- **App client name**: `propie-web-app`
- **Authentication flows**: 
  - ✅ ALLOW_USER_SRP_AUTH (secure remote password)
  - ✅ ALLOW_REFRESH_TOKEN_AUTH
  - ✅ ALLOW_USER_PASSWORD_AUTH (for development)

### OAuth settings
- **Allowed OAuth Flows**: Authorization code grant
- **Allowed OAuth Scopes**: email, openid, profile
- **Callback URLs**: 
  - `http://localhost:3000/api/auth/callback/cognito` (development)
  - `https://prop.ie/api/auth/callback/cognito` (production)
- **Sign out URLs**:
  - `http://localhost:3000` (development)  
  - `https://prop.ie` (production)

## Step 4: Get Your Credentials

After creating the User Pool, you'll get:

1. **User Pool ID** (format: eu-west-1_XXXXXXXXX)
2. **App Client ID** (format: long alphanumeric string)

## Step 5: Update Environment Variables

Replace these values in `.env.local`:

```env
# Replace these with your real values:
NEXT_PUBLIC_COGNITO_USER_POOL_ID=eu-west-1_YOUR_POOL_ID
NEXT_PUBLIC_COGNITO_CLIENT_ID=YOUR_CLIENT_ID
NEXT_PUBLIC_COGNITO_REGION=eu-west-1

# Optional: Add these for advanced features
COGNITO_USER_POOL_ID=eu-west-1_YOUR_POOL_ID  # Server-side access
COGNITO_CLIENT_SECRET=YOUR_CLIENT_SECRET     # If you enabled client secret
```

## Step 6: Domain Setup (Optional but Recommended)

1. **In Cognito Console** → **App integration** → **Domain**
2. **Choose domain**: `propie-auth` (creates: propie-auth.auth.eu-west-1.amazoncognito.com)
3. **Or use custom domain**: `auth.prop.ie` (requires SSL certificate)

## Common Issues & Solutions

❌ **"Invalid region"**: Make sure you're in eu-west-1 (Ireland)
❌ **"Email not verified"**: Check email configuration in SES
❌ **"Callback URL mismatch"**: Ensure localhost:3000 is in callback URLs
❌ **"Access denied"**: Check IAM permissions for your AWS user

## Testing Your Setup

Once configured, test with:
```bash
npm run dev
# Navigate to /auth/register to test user registration
```

---

**Need help?** Paste your User Pool ID and Client ID here, and I'll update the configuration files automatically.