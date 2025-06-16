/**
 * Production Configuration
 * Real-world integrations for payment processing, email delivery, and analytics
 */

export const productionConfig = {
  // Database Configuration
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    database: process.env.DATABASE_NAME || 'prop_ie_production',
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    pool: {
      min: 2,
      max: 10,
      acquire: 30000,
      idle: 10000
    }
  },

  // Payment Processing Configuration
  payments: {
    stripe: {
      publicKey: process.env.STRIPE_PUBLIC_KEY,
      secretKey: process.env.STRIPE_SECRET_KEY,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
      currency: 'EUR',
      country: 'IE'
    },
    paypal: {
      clientId: process.env.PAYPAL_CLIENT_ID,
      clientSecret: process.env.PAYPAL_CLIENT_SECRET,
      environment: process.env.NODE_ENV === 'production' ? 'live' : 'sandbox'
    }
  },

  // Email Service Configuration
  email: {
    resend: {
      apiKey: process.env.RESEND_API_KEY,
      fromEmail: 'noreply@prop.ie',
      fromName: 'PROP.ie',
      replyTo: 'support@prop.ie'
    },
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY,
      fromEmail: 'noreply@prop.ie',
      templateIds: {
        welcome: process.env.SENDGRID_WELCOME_TEMPLATE,
        propertyAlert: process.env.SENDGRID_PROPERTY_ALERT_TEMPLATE,
        transactionUpdate: process.env.SENDGRID_TRANSACTION_TEMPLATE
      }
    }
  },

  // Analytics and Monitoring
  analytics: {
    googleAnalytics: {
      measurementId: process.env.GA_MEASUREMENT_ID,
      apiSecret: process.env.GA_API_SECRET
    },
    mixpanel: {
      token: process.env.MIXPANEL_TOKEN,
      secret: process.env.MIXPANEL_SECRET
    },
    hotjar: {
      siteId: process.env.HOTJAR_SITE_ID
    }
  },

  // Error Monitoring
  monitoring: {
    sentry: {
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0
    },
    logLevel: process.env.LOG_LEVEL || 'info'
  },

  // External APIs
  apis: {
    propertyData: {
      baseUrl: process.env.PROPERTY_API_BASE_URL || 'https://api.property.ie',
      apiKey: process.env.PROPERTY_API_KEY
    },
    mortgage: {
      baseUrl: process.env.MORTGAGE_API_BASE_URL,
      apiKey: process.env.MORTGAGE_API_KEY
    },
    maps: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
    }
  },

  // Security Configuration
  security: {
    jwtSecret: process.env.JWT_SECRET,
    encryptionKey: process.env.ENCRYPTION_KEY,
    sessionSecret: process.env.SESSION_SECRET,
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['https://prop.ie', 'https://www.prop.ie'],
    rateLimiting: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100
    }
  },

  // CDN and Storage
  storage: {
    aws: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'eu-west-1',
      s3Bucket: process.env.S3_BUCKET_NAME || 'prop-ie-assets'
    },
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET
    }
  },

  // Application Configuration
  app: {
    baseUrl: process.env.BASE_URL || 'https://prop.ie',
    port: parseInt(process.env.PORT || '3000'),
    nodeEnv: process.env.NODE_ENV || 'production',
    apiVersion: 'v1'
  },

  // Revenue Engine Configuration
  revenue: {
    // Transaction fee rates (can be adjusted via admin panel)
    feeRates: {
      initialDepositRate: parseFloat(process.env.INITIAL_DEPOSIT_RATE || '0.025'), // 2.5%
      fullDepositRate: parseFloat(process.env.FULL_DEPOSIT_RATE || '0.02'), // 2%
      finalTransactionRate: parseFloat(process.env.FINAL_TRANSACTION_RATE || '0.015'), // 1.5%
      propChoiceFurnitureRate: parseFloat(process.env.PROP_CHOICE_FURNITURE_RATE || '0.15'), // 15%
      propChoiceCustomizationRate: parseFloat(process.env.PROP_CHOICE_CUSTOMIZATION_RATE || '0.12'), // 12%
      tenderSubmissionFee: parseFloat(process.env.TENDER_SUBMISSION_FEE || '25'), // €25
      premiumListingFee: parseFloat(process.env.PREMIUM_LISTING_FEE || '100'), // €100/month
      aiAnalysisFee: parseFloat(process.env.AI_ANALYSIS_FEE || '50') // €50
    },
    // Subscription pricing (monthly in EUR)
    subscriptionPricing: {
      starter: parseFloat(process.env.STARTER_PRICE || '99'),
      professional: parseFloat(process.env.PROFESSIONAL_PRICE || '499'),
      enterprise: parseFloat(process.env.ENTERPRISE_PRICE || '2499')
    }
  }
};

// Validation function to ensure all required environment variables are set
export function validateProductionConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const requiredVars = [
    'DATABASE_PASSWORD',
    'STRIPE_SECRET_KEY',
    'STRIPE_PUBLIC_KEY',
    'RESEND_API_KEY',
    'JWT_SECRET',
    'ENCRYPTION_KEY'
  ];

  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Export configuration with validation
export function getProductionConfig() {
  const validation = validateProductionConfig();
  
  if (!validation.isValid && process.env.NODE_ENV === 'production') {
    console.error('❌ Production configuration validation failed:');
    validation.errors.forEach(error => console.error(`  - ${error}`));
    throw new Error('Invalid production configuration');
  }

  return productionConfig;
}