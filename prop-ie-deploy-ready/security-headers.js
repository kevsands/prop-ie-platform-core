/**
 * Security Headers Configuration
 * 
 * This module exports security headers configuration for Next.js
 * to improve the application's security posture.
 */

// Security headers based on OWASP recommendations
const securityHeaders = [
  // X-DNS-Prefetch-Control
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  // Strict-Transport-Security
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  // X-XSS-Protection - legacy but still valuable for older browsers
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  // X-Frame-Options - prevent clickjacking
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  // X-Content-Type-Options - prevent MIME-sniffing
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // Referrer-Policy
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // Permissions-Policy - control browser features
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
  },
];

// Content-Security-Policy - adjusted for AWS services and enhanced security
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.googleapis.com https://*.gstatic.com https://*.google.com https://*.cloudflare.com https://*.vercel-insights.com https://*.vercel-scripts.com https://*.amazonaws.com https://*.amplifyapp.com https://*.cognito-identity.amazonaws.com;
  style-src 'self' 'unsafe-inline' https://*.googleapis.com;
  img-src 'self' blob: data: https://*.googleapis.com https://*.gstatic.com https://*.google.com https://*.cloudflare.com https://*.amazonaws.com;
  font-src 'self' data: https://*.googleapis.com https://*.gstatic.com;
  connect-src 'self' https://*.amazonaws.com https://*.amplifyapp.com https://*.cognito-identity.amazonaws.com https://*.cognito-idp.amazonaws.com https://*.execute-api.*.amazonaws.com https://*.google-analytics.com https://*.vercel-insights.com wss://*.amazonaws.com;
  frame-src 'self' https://*.amazonaws.com https://*.amplifyapp.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'self';
  upgrade-insecure-requests;
`;

// Add CSP in production mode only to avoid development issues
if (process.env.NODE_ENV === 'production') {
  securityHeaders.push({
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
  });
}

module.exports = { securityHeaders };